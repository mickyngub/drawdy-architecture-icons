import assert from "node:assert/strict";
import { test } from "node:test";
import { readState } from "../src/index";

const DEFAULT_OPTIONS = {
    size: 64,
    color: "ink",
    stroke: 2,
    label: true,
};

test("readState falls back to the defaults, with labels on", () => {
    const empty = { recent: [], options: DEFAULT_OPTIONS };
    assert.deepEqual(readState(undefined), empty);
    assert.deepEqual(readState({}), empty);
});

test("readState keeps valid values, and a stored false label wins", () => {
    const options = {
        size: 256,
        color: "#698CF9",
        stroke: 1.5,
        label: false,
    };
    const recent = [
        { source: "iconify", name: "logos:aws-lambda", title: "AWS Lambda" },
        { source: "lucide", name: "server", title: "Server" },
    ];
    assert.deepEqual(readState({ recent, options }), { recent, options });
});

test("readState rejects a bad colour, size, stroke and label", () => {
    const state = readState({
        options: {
            size: 100,
            color: "red",
            stroke: 3,
            label: "false",
        },
    });
    assert.deepEqual(state.options, DEFAULT_OPTIONS);
    assert.equal(
        readState({ options: { color: "#12345" } }).options.color,
        "ink"
    );
});

test("readState drops recent icons from removed sources and other sets", () => {
    const kept = [
        { source: "iconify", name: "logos:postgresql", title: "PostgreSQL" },
        { source: "lucide", name: "database", title: "Database" },
    ];
    const state = readState({
        recent: [
            { source: "brand", name: "figma", title: "Figma", hex: "F24E1E" },
            kept[0],
            {
                source: "iconify",
                name: "fluent-emoji-flat:rocket",
                title: "Rocket",
            },
            { source: "iconify", name: "circle-flags:th", title: "Thailand" },
            { source: "iconify", name: "logos:AWS", title: "AWS" },
            kept[1],
        ],
    });
    assert.deepEqual(state.recent, kept);
});
