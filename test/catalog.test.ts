import assert from "node:assert/strict";
import { test } from "node:test";
import { CATEGORIES, titleFor } from "../src/catalog";

const NAME = /^[a-z0-9-]+$/;

test("every category has icons with plain names", () => {
    for (const group of CATEGORIES) {
        assert.ok(group.names.length > 0, `${group.title} is empty`);
        for (const name of group.names) {
            assert.match(name, NAME, `${group.title}: ${name}`);
        }
    }
});

test("no name appears twice within or across categories", () => {
    const seen = new Map<string, string>();
    for (const group of CATEGORIES) {
        for (const name of group.names) {
            const key = `${group.source}:${name}`;
            assert.ok(
                !seen.has(key),
                `${name} is in ${seen.get(key)} and ${group.title}`
            );
            seen.set(key, group.title);
        }
    }
});

test("titleFor uses the override map before the acronym map", () => {
    assert.equal(titleFor("postgresql"), "PostgreSQL");
    assert.equal(titleFor("nodejs"), "Node.js");
    assert.equal(titleFor("c-sharp"), "C#");
    assert.equal(titleFor("github-actions"), "GitHub Actions");
});

test("titleFor upper-cases acronyms and title-cases other words", () => {
    assert.equal(titleFor("aws-lambda"), "AWS Lambda");
    assert.equal(titleFor("aws-s3"), "AWS S3");
    assert.equal(titleFor("google-cloud-run"), "Google Cloud Run");
    assert.equal(titleFor("hard-drive"), "Hard Drive");
});

test("titleFor drops a trailing -icon", () => {
    assert.equal(titleFor("docker-icon"), "Docker");
    assert.equal(titleFor("mongodb-icon"), "MongoDB");
    assert.equal(titleFor("icon"), "Icon");
});

test("titleFor works the same after a toString round trip", () => {
    const inlined = new Function(
        `return ${titleFor.toString()}`
    )() as typeof titleFor;
    for (const group of CATEGORIES) {
        for (const name of group.names) {
            assert.equal(inlined(name), titleFor(name));
        }
    }
});
