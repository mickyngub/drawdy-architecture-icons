import assert from "node:assert/strict";
import { test } from "node:test";
import { AZURE_ICONS } from "../src/azure-icons";
import type { IconPick } from "../src/shared/messages";
import { finalizeIconSvg, isMonochrome, type SvgOptions } from "../src/svg";

const LUCIDE = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h18"/></svg>`;
const LOGO = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 256 153"><path fill="#f90" d="M0 0h256v153H0z"/></svg>`;
const HOSTILE = `<?xml version="1.0"?><!-- note --><svg viewBox="0 0 24 24" onload="alert(1)"><script>alert(2)</script><path onclick='steal()' d="M0 0h24"/></svg>`;

const OPTIONS: SvgOptions = {
    size: 64,
    color: "#ff4d4d",
    stroke: 2,
};

const lucide: IconPick = {
    source: "lucide",
    name: "minus",
    title: "minus",
    svg: LUCIDE,
};
const logo: IconPick = {
    source: "iconify",
    name: "logos:aws",
    title: "AWS",
    svg: LOGO,
};

function finish(icon: IconPick, overrides: Partial<SvgOptions> = {}) {
    const result = finalizeIconSvg(icon, { ...OPTIONS, ...overrides });
    assert.ok(result, "finalizeIconSvg returned null");
    return result;
}

const rootTag = (svg: string): string => /^<svg[^>]*>/.exec(svg)?.[0] ?? "";

test("a Lucide icon takes the colour and the stroke width", () => {
    const { svg } = finish(lucide, { stroke: 2.75 });
    assert.ok(!svg.includes("currentColor"));
    assert.match(rootTag(svg), / stroke="#ff4d4d"/);
    assert.match(rootTag(svg), / stroke-width="2.75"/);
});

test("an Iconify icon keeps its own colours", () => {
    const { svg } = finish(logo);
    assert.ok(!svg.includes("#ff4d4d"));
    assert.ok(!/ fill=/.test(rootTag(svg)));
    assert.match(svg, /<path fill="#f90"/);
});

test("a wide viewBox keeps its aspect on the board and stays crisp", () => {
    const { svg, width, height } = finish(logo);
    assert.equal(width, 64);
    assert.equal(height, 38.25);
    assert.match(rootTag(svg), / width="512"/);
    assert.match(rootTag(svg), / height="306"/);
});

test("an icon without a viewBox is treated as 24 by 24", () => {
    const bare: IconPick = { ...lucide, svg: `<svg><path d="M0 0"/></svg>` };
    const { svg, width, height } = finish(bare, { size: 128 });
    assert.deepEqual([width, height], [128, 128]);
    assert.match(rootTag(svg), / viewBox="0 0 24 24"/);
});

test("scripts, event handlers, comments and the XML declaration are stripped", () => {
    const { svg } = finish({ ...logo, svg: HOSTILE });
    assert.ok(!/script/i.test(svg));
    assert.ok(!/\son[a-z]+\s*=/i.test(svg));
    assert.ok(!svg.includes("<!--"));
    assert.ok(!svg.includes("<?xml"));
    assert.match(svg, /<path\s+d="M0 0h24"\/>/);
});

test("an azure icon keeps its viewBox, colours and proportions", () => {
    const source = AZURE_ICONS["virtual-machine"].svg;
    const azure: IconPick = {
        source: "azure",
        name: "virtual-machine",
        title: "Azure Virtual Machines",
        svg: source,
    };
    const { svg, width, height } = finish(azure);

    const viewBox = /\sviewBox="([^"]*)"/.exec(source)?.[1] ?? "";
    assert.equal(/\sviewBox="([^"]*)"/.exec(rootTag(svg))?.[1], viewBox);

    const paints = source.match(/(?:fill|stop-color)="#[0-9a-fA-F]+"/g) ?? [];
    assert.ok(paints.length > 0, "the source has no hex paints to compare");
    for (const paint of paints) {
        assert.ok(svg.includes(paint), `lost ${paint}`);
    }
    assert.ok(!svg.includes(OPTIONS.color));

    const withCurrentColor = finish({
        ...azure,
        svg: source.replace("</svg>", '<path stroke="currentColor"/></svg>'),
    }).svg;
    assert.ok(withCurrentColor.includes('stroke="currentColor"'));
    assert.ok(!withCurrentColor.includes(OPTIONS.color));

    const [, , boxWidth, boxHeight] = viewBox.split(/\s+/).map(Number);
    assert.equal(width / height, boxWidth / boxHeight);
    assert.equal(
        Number(/ width="([^"]*)"/.exec(rootTag(svg))?.[1]) /
            Number(/ height="([^"]*)"/.exec(rootTag(svg))?.[1]),
        boxWidth / boxHeight
    );

    assert.equal(isMonochrome(azure), false);
});
