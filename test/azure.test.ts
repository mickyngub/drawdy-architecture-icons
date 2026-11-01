import assert from "node:assert/strict";
import { test } from "node:test";
import { AZURE_ICONS } from "../src/azure-icons";
import { WEBVIEW_HTML } from "../src/webview-html";

const SLUG = /^[a-z0-9-]+$/;
const VIEW_BOX = /<svg\b[^>]*\sviewBox="([^"]*)"/;

test("azure set has the curated core services", () => {
    const entries = Object.entries(AZURE_ICONS);
    assert.ok(
        entries.length >= 55 && entries.length <= 65,
        `${entries.length} Azure icons`
    );
    for (const [slug, icon] of entries) {
        assert.match(slug, SLUG);
        assert.ok(icon.title.trim().length > 0, `${slug} has no title`);
    }
});

test("azure titles use current product names", () => {
    assert.equal(AZURE_ICONS["function-apps"].title, "Azure Functions");
    assert.equal(AZURE_ICONS["cognitive-search"].title, "Azure AI Search");
    assert.equal(AZURE_ICONS["azure-cosmos-db"].title, "Azure Cosmos DB");
});

test("every azure svg is safe and keeps its viewBox", () => {
    for (const [slug, { svg }] of Object.entries(AZURE_ICONS)) {
        assert.ok(svg.startsWith("<svg"), `${slug} does not start with <svg`);
        const viewBox = VIEW_BOX.exec(svg)?.[1];
        assert.ok(viewBox !== undefined, `${slug} has no viewBox`);
        const [, , width, height] = viewBox
            .trim()
            .split(/[\s,]+/)
            .map(Number);
        assert.ok(width > 0 && height > 0, `${slug} viewBox is ${viewBox}`);
        assert.ok(!svg.includes("<script"), `${slug} has a <script>`);
        assert.ok(!svg.includes("<title"), `${slug} has a <title>`);
        assert.doesNotMatch(svg, / on[a-z]+=/, `${slug} has an event handler`);
    }
});

test("azure data stays small", () => {
    const total = Object.values(AZURE_ICONS).reduce(
        (sum, { svg }) => sum + svg.length,
        0
    );
    assert.ok(total < 200_000, `${total} characters of SVG`);
});

test("injecting the azure icons leaves the webview with one script to close", () => {
    assert.ok(WEBVIEW_HTML.includes("var AZURE_ICONS = {"));
    assert.equal(WEBVIEW_HTML.match(/<\/script/gi)?.length, 1);
    assert.ok(!WEBVIEW_HTML.includes("<!--"));
});
