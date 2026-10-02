# Skip Bits

Website for [Skip Bits](https://skipbits.co.uk) — skip and container parts, lids and bin spares, part of
[Caledonia Containers Ltd](https://caledoniacontainers.co.uk).

A static [Astro](https://astro.build) site styled with Tailwind CSS 4, deployed to GitHub Pages. There's no
shop or checkout: every product has an **Ask for price** button that opens a dialog with the part's photo and
code and a phone and email link (the email is pre-filled with the part name and code).

## Commands

| Command           | Action                                      |
| ----------------- | ------------------------------------------- |
| `npm install`     | Install dependencies                        |
| `npm run dev`     | Local dev server at `http://localhost:4321` |
| `npm run build`   | Build the production site to `dist/`        |
| `npm run preview` | Serve the built `dist/` locally             |

## Editing products

Products live in one JSON file per category, with that category's photos in a folder of the same name:

```
src/content/categories/skip-lugs.json     ← category details + its products
src/assets/products/skip-lugs/            ← photos for those products
```

The file name is the category's URL (`skip-lugs.json` → `/collections/skip-lugs/`). A category file looks like:

```jsonc
{
  "title": "Skip Lugs",
  "description": "Forged lifting lugs for chain-lift skips.",  // shown under the heading and used by Google
  "group": "skip-parts",                                      // skip-parts, lids or bin-spares
  "order": 6,                                                 // position within the group
  "products": [
    {
      "id": "bfd1187-skip-lug",          // the product URL: /products/bfd1187-skip-lug/ — keep unique, don't change once live
      "name": "Skip Lug",
      "code": "BFD1187",                 // optional part number
      "description": ["First paragraph.", "Second paragraph."],
      "images": ["bfd1187-skip-lug.png", "bfd1187-skip-lug-2.png"]   // first one is the main photo
    }
  ]
}
```

Optional product fields:

- `"options"` — for parts sold in versions, each with its own code:
  `{ "name": "Size", "choices": [{ "name": "10mm", "code": "BFD5131" }, { "name": "12mm", "code": "BFD5130" }] }`
- `"fits"` — bin sizes a lid fits, e.g. `["660L", "770L"]`. Lid categories show these as filter buttons.
- `"alsoIn"` — other categories to list the product in too, by file name, e.g. `["skip-lids"]`. The product
  still lives (and its photos still go) in one place.

**To add a product**, copy an existing one in the right file, change the details, and drop its photos in the
matching `src/assets/products/<category>/` folder. Upload photos as they are — the build resizes them and
converts them to WebP. Products with no `images` show a "Photo coming soon" tile.

**To add a category**, create a new JSON file in `src/content/categories/` and a folder with the same name in
`src/assets/products/`. Groups (the three departments) and the home page's popular categories are set in
[`src/consts.ts`](src/consts.ts).

The build checks the files and stops with a message naming the file to fix if, say, a photo is missing, two
products share an `id`, or an `alsoIn` names a category that doesn't exist. Editing a JSON file directly on
GitHub works fine — the site rebuilds on commit and the Actions tab shows if anything needs fixing.

## Business details

Phone, email, address, company and VAT numbers live in [`src/consts.ts`](src/consts.ts). The visible copy and
the structured data are both generated from it.

## Old Shopify links

Product and category URLs match the old Shopify ones (`/products/<id>/`, `/collections/<category>/`), so
existing links and search rankings carry over. Shopify-only pages (bin-size collections, `/pages/contact`,
`/policies/…`) redirect to their new homes — see `redirects` in [`astro.config.mjs`](astro.config.mjs).

## Deployment

Every push to `main` runs [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which builds the site
and publishes it to GitHub Pages. The custom domain is set by [`public/CNAME`](public/CNAME).
