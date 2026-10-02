// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";

import { SITE_URL } from "./src/consts";

/**
 * Pages that deserve more weight than the default in the sitemap.
 * @type {[RegExp, number, string][]}
 */
const PRIORITIES = [
  [/^\/$/, 1.0, "weekly"],
  [/^\/collections\/$/, 0.9, "weekly"],
  [/^\/collections\/.+/, 0.8, "weekly"],
  [/^\/products\/.+/, 0.6, "monthly"],
  [/^\/contact\/$/, 0.5, "yearly"],
];

/** Old Shopify bin-size collections, now a filter on Trade Waste Lids. */
const LEGACY_SIZE_COLLECTIONS = {
  "500-litre-bin-lid": "500L",
  "660-litre-bin-lid": "660L",
  "770-litre-bin-lid": "770L",
  "820-litre-bin-lid": "820L",
  "940-litre-bin-lid": "940L",
  "1100-litre-bin-lid": "1100L",
  "1280-litre-bin-lid": "1280L",
  "1700-litre-bin-lids": "1700L",
};

// https://astro.build/config
export default defineConfig({
  output: "static",
  site: SITE_URL,
  trailingSlash: "always",
  build: { format: "directory" },
  // GitHub Pages can't send real redirects, so these become small HTML pages
  // that forward visitors (and search engines) from the old Shopify URLs.
  redirects: {
    "/collections/all": "/collections/",
    "/collections/all-products": "/collections/",
    "/collections/frontpage": "/",
    "/collections/bin-lids": "/collections/#lids",
    "/collections/four-wheeled-container-lid": "/collections/trade-waste-lids/",
    ...Object.fromEntries(
      Object.entries(LEGACY_SIZE_COLLECTIONS).map(([handle, size]) => [
        `/collections/${handle}`,
        `/collections/trade-waste-lids/?size=${size}`,
      ]),
    ),
    "/pages/contact": "/contact/",
    "/policies/contact-information": "/contact/",
    "/policies/privacy-policy": "/privacy/",
    "/policies/terms-of-service": "/contact/",
    "/policies/refund-policy": "/contact/",
    "/policies/shipping-policy": "/contact/",
    "/cart": "/",
    "/account": "/",
  },
  integrations: [
    sitemap({
      serialize(item) {
        const { pathname } = new URL(item.url);
        const match = PRIORITIES.find(([pattern]) => pattern.test(pathname));
        item.priority = match ? match[1] : 0.5;
        item.changefreq = /** @type {any} */ (match ? match[2] : "yearly");
        item.lastmod = new Date().toISOString();
        return item;
      },
    }),
    icon(),
  ],
  vite: {
    // Cast: Tailwind's plugin is typed against a newer Vite than Astro 5 bundles.
    plugins: [/** @type {any} */ (tailwindcss())],
  },
});
