import { CATEGORIES } from "../src/catalog.ts";
import { ICONIFY_HOST, ICONIFY_SETS } from "../src/sources.ts";

let curatedCount = 0;
let missingCount = 0;
const sets = [];

for (const prefix of ICONIFY_SETS) {
    const res = await fetch(`${ICONIFY_HOST}/collection?prefix=${prefix}`);
    if (!res.ok) {
        console.error(`Iconify collection ${prefix}: HTTP ${res.status}`);
        process.exit(2);
    }
    const data = await res.json();
    const listed = new Set([
        ...(data.uncategorized ?? []),
        ...Object.values(data.categories ?? {}).flat(),
    ]);
    const hidden = new Set(data.hidden ?? []);
    const curated = CATEGORIES.filter(
        (group) => group.source === prefix
    ).flatMap((group) =>
        group.names.map((name) => ({ name, category: group.title }))
    );

    for (const { name, category } of curated) {
        if (hidden.has(name))
            console.log(
                `! ${name} (${category}) is hidden upstream but still served`
            );
    }
    for (const { name, category } of curated) {
        if (listed.has(name) || hidden.has(name)) continue;
        console.log(
            `✗ ${name} (${category}) is no longer in Iconify's ${prefix} set`
        );
        missingCount++;
    }
    curatedCount += curated.length;
    sets.push(prefix);
}

if (missingCount) process.exit(1);
console.log(
    `✓ All ${curatedCount} curated logos exist in Iconify's ${sets.slice(0, -1).join(", ")}${sets.length > 1 ? " and " : ""}${sets.at(-1)} sets.`
);
