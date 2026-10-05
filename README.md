# Architecture Icons

Icons for architecture and system diagrams on your Drawdy board. One palette holds Lucide building blocks (servers, databases, users, queues, networks) and the logos architects actually draw: cloud providers, every AWS service, databases, DevOps tools, languages, frameworks, AI and data tools, and messaging and API services. Each lands with a label spelled the way diagrams spell it, such as AWS Lambda, PostgreSQL or Node.js.

## How to use

1. Click the Architecture Icons button on the right of the board to open the palette.
2. Pick a category chip: **All**, **Diagram** (Lucide building blocks), **Cloud**, **AWS**, **Databases**, **DevOps**, **Languages**, **Frameworks**, **AI & data** or **Messaging & APIs**. The chip row scrolls sideways.
3. Type in the search box, or press `/` to jump to it. Every word you type must match. Exact names come first, then names that start with your word, then names with a word that starts with it, then names that contain it, then Lucide tag matches. A search covers the selected chip, or every category under All. When fewer than 10 of these icons match, an **Other logos** section adds matches from the full SVG Logos set. The palette shows 120 icons at a time; **Show more** adds the next 120. Press Enter to add the first result.
4. Set the options above the search box:
   - **S / M / L / XL**: 32, 64, 128 or 256 board units on the icon's long side.
   - **Label**: on by default, adds the icon's name as text under it.
   - **Thin / Regular / Bold** and **Colour** (shown on All and Diagram): the stroke width and colour of Lucide icons. Ink is the board's foreground colour when you place the icon; there are also four of Drawdy's stroke colours and a colour picker.
5. Drag a tile out of the palette and let go over the board: the icon lands centred where you let go. Letting go inside the palette places nothing. Click a tile to add the icon in the middle of your view; more clicks without moving the view add icons in a row to the right, wrapping to a new row at the edge of the view, and moving the view starts again from its centre.
6. Each icon lands as an SVG image that keeps its proportions. Logos keep their own colours. A label is a text element in the Lucide icon's colour, or in Ink for logos.
7. The last 12 icons you placed show in a **Recent** row above the results, and the palette remembers your options.

## Good to know

- Nothing is bundled. Lucide icons and their search tags load from `cdn.jsdelivr.net` at a pinned version (`lucide-static@1.39.0`), one file per icon. Logos load from the Iconify API at `api.iconify.design` in batches of a few dozen per request, at most two batches at a time; the full logo list loads only when a search needs the Other logos section. Tiles load as they scroll into view. A tile that fails to load shows an empty dashed square, and the palette says "Some icons didn't load." with a Retry button; nothing is retried automatically.
- A placed icon is the SVG itself, embedded in the board as a data URL and drawn at 512 px on its long side, so it stays sharp when you zoom in. Scripts and event handlers are stripped from every SVG before it is shown or placed.
- The Recent row and the options are kept in Drawdy's extension storage in this browser, so they are the same on every board you open here.
- The extension sends nothing anywhere. It only downloads icons from the hosts above.
- Icons are [Lucide](https://lucide.dev) (ISC) and [SVG Logos](https://github.com/gilbarbara/logos) (CC0; logos are trademarks of their owners).

## Licence

This extension's code is [MIT](LICENSE). The icons are not part of this repository; they load from jsDelivr and the Iconify API under their own licences, listed above.

## Development

```bash
npm install
npm test
npm run typecheck
npm run check-logos  # are the curated logos still in Iconify's logos set?
npm run dev          # dev server on :5205; in Drawdy run ⌘K → "Add extension dev server" on a local board
npm run build        # dist/main.js and dist/mickyngub-architecture-icons.drawdyx
npm run preflight    # before submitting: committed, built, pushed, under Drawdy's limits, above the live version
```

The categories, their icons and the label spellings live in `src/catalog.ts`. Drawdy builds published versions from this repository's `src/index.ts` itself, so what is pushed is what ships; `dist/` is only for local testing. Bump `driverVersion` in `manifest.json` for every release and add it to `CHANGELOG.md`. `npm test` holds the manifest and listing files to Drawdy's submission rules (a description of at most 500 characters, an icon of at most 256 KB, only `@drawdy/driver-protocol` imported from outside the repository), and also tests the catalog, the SVG finishing, the Iconify batching, the click layout and the saved-state checks.
