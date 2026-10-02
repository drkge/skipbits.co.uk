// Reads the category files and joins products to their images, so pages only
// deal with ready-to-render data. Mistakes in the JSON (a missing image, a
// duplicate product id, an unknown alsoIn category) fail the build with a
// message saying which file to fix.

import type { ImageMetadata } from "astro";
import { getCollection, type CollectionEntry } from "astro:content";
import { GROUPS } from "@/consts";

type CategoryEntry = CollectionEntry<"categories">;
type ProductData = CategoryEntry["data"]["products"][number];

export type Category = {
  id: string;
  href: string;
  title: string;
  description: string;
  group: string;
  order: number;
  /** Products whose file is this category. */
  own: Product[];
  /** Own products plus any listed here via `alsoIn`. */
  products: Product[];
};

export type Product = ProductData & {
  href: string;
  category: { id: string; title: string; href: string };
  /** Resolved images; empty when the product has no photo yet. */
  photos: ImageMetadata[];
  /** Every code a customer might search for: the main code and option codes. */
  codes: string[];
};

const imageFiles = import.meta.glob<ImageMetadata>("/src/assets/products/*/*.{png,jpg,jpeg,webp,avif}", {
  eager: true,
  import: "default",
});

function resolveImage(category: string, file: string, productId: string) {
  const image = imageFiles[`/src/assets/products/${category}/${file}`];
  if (!image) {
    throw new Error(
      `Image "${file}" for product "${productId}" not found. ` +
        `Put it in src/assets/products/${category}/ or fix the name in src/content/categories/${category}.json.`,
    );
  }
  return image;
}

let cache: Category[] | undefined;

/** All categories in display order (by group, then `order`). */
export async function getCategories(): Promise<Category[]> {
  if (cache) return cache;

  const groupIndex = (group: string) => GROUPS.findIndex((g) => g.id === group);
  const entries = (await getCollection("categories")).sort(
    (a, b) => groupIndex(a.data.group) - groupIndex(b.data.group) || a.data.order - b.data.order,
  );

  const seen = new Map<string, string>();
  const categories: Category[] = entries.map((entry) => {
    const href = `/collections/${entry.id}/`;
    const own = entry.data.products.map((data): Product => {
      const clash = seen.get(data.id);
      if (clash) {
        throw new Error(`Product id "${data.id}" is used twice (in ${clash}.json and ${entry.id}.json). Ids must be unique.`);
      }
      seen.set(data.id, entry.id);
      return {
        ...data,
        href: `/products/${data.id}/`,
        category: { id: entry.id, title: entry.data.title, href },
        photos: data.images.map((file) => resolveImage(entry.id, file, data.id)),
        codes: [data.code, ...(data.options?.choices.map((choice) => choice.code) ?? [])].filter(
          (code): code is string => Boolean(code),
        ),
      };
    });
    return { id: entry.id, href, ...entry.data, own, products: [...own] };
  });

  const byId = new Map(categories.map((category) => [category.id, category]));
  for (const category of categories) {
    for (const product of category.own) {
      for (const other of product.alsoIn) {
        const target = byId.get(other);
        if (!target) {
          throw new Error(`Product "${product.id}" in ${category.id}.json lists alsoIn "${other}", but there is no ${other}.json.`);
        }
        target.products.push(product);
      }
    }
  }

  cache = categories;
  return categories;
}

export async function getProducts(): Promise<Product[]> {
  return (await getCategories()).flatMap((category) => category.own);
}

/** The first image of the first product that has one, for category cards. */
export function coverImage(category: Category) {
  return category.products.find((product) => product.photos.length)?.photos[0];
}

/** Sort sizes like "660L" numerically. */
export function sortSizes(sizes: Iterable<string>) {
  return [...new Set(sizes)].sort((a, b) => parseInt(a) - parseInt(b) || a.localeCompare(b));
}
