import { CATEGORIES } from "../src/catalog.ts";
import { ICONIFY_HOST, LOGOS_PREFIX } from "../src/sources.ts";

const res = await fetch(`${ICONIFY_HOST}/collection?prefix=${LOGOS_PREFIX}`);
if (!res.ok) {
    console.error(`Iconify collection: HTTP ${res.status}`);
    process.exit(2);
}
const data = await res.json();
const listed = new Set([
    ...(data.uncategorized ?? []),
    ...Object.values(data.categories ?? {}).flat(),
]);
const hidden = new Set(data.hidden ?? []);
const curated = CATEGORIES.filter((group) => group.source === "logos").flatMap(
    (group) => group.names.map((name) => ({ name, category: group.title }))
);

for (const { name, category } of curated) {
    if (hidden.has(name))
        console.log(
            `! ${name} (${category}) is hidden upstream but still served`
        );
}
const missing = curated.filter(
    ({ name }) => !listed.has(name) && !hidden.has(name)
);
if (missing.length) {
    for (const { name, category } of missing) {
        console.log(
            `✗ ${name} (${category}) is no longer in Iconify's ${LOGOS_PREFIX} set`
        );
    }
    process.exit(1);
}
console.log(
    `✓ All ${curated.length} curated logos exist in Iconify's ${LOGOS_PREFIX} set.`
);
