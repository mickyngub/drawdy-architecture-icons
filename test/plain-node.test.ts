import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { test } from "node:test";

// scripts/check-logos.mjs runs under plain node, whose type stripping only resolves
// imports that spell out the file extension. tsx and bundlers forgive a bare
// "./azure-icons"; node does not, and `npm test` alone would never notice.
for (const file of ["catalog.ts", "sources.ts"]) {
    test(`src/${file} loads under plain node, as check-logos needs`, () => {
        // Drop NODE_OPTIONS so an inherited tsx loader cannot paper over a bare import.
        const { NODE_OPTIONS: _, ...env } = process.env;
        const child = spawnSync(
            process.execPath,
            [
                "--input-type=module",
                "-e",
                "await import(process.argv[1])",
                new URL(`../src/${file}`, import.meta.url).href,
            ],
            { env, encoding: "utf8" }
        );
        assert.equal(child.status, 0, child.stderr);
    });
}
