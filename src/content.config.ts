import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";
import { GROUPS } from "./consts";

const groupIds = GROUPS.map((group) => group.id) as [string, ...string[]];

/** URL-safe: lowercase letters, numbers and hyphens. */
const slug = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "use lowercase letters, numbers and hyphens only");

const product = z.object({
  /** Sets the page URL (/products/<id>/). Keep it unique and don't change it once live. */
  id: slug,
  name: z.string(),
  /** Part number / SKU, shown on the tile and in enquiries. */
  code: z.string().optional(),
  /** For parts sold in several versions, e.g. left and right hand. */
  options: z
    .object({
      name: z.string(),
      choices: z.array(z.object({ name: z.string(), code: z.string().optional() })).min(1),
    })
    .optional(),
  /** One string per paragraph. */
  description: z.array(z.string()).default([]),
  /** Bin sizes a lid fits, e.g. ["660L", "770L"]. Shown as filters on lid categories. */
  fits: z.array(z.string()).default([]),
  /** Other categories this product should also be listed in (by file name). */
  alsoIn: z.array(z.string()).default([]),
  /** File names inside src/assets/products/<category>/. The first is the main image. */
  images: z.array(z.string()).default([]),
});

// One JSON file per category; the file name is the category's URL.
const categories = defineCollection({
  loader: glob({ base: "./src/content/categories", pattern: "*.json" }),
  schema: z.object({
    title: z.string(),
    /** One or two sentences: shown under the heading and used as the meta description. */
    description: z.string(),
    group: z.enum(groupIds),
    /** Position within its group. */
    order: z.number(),
    products: z.array(product),
  }),
});

export const collections = { categories };
