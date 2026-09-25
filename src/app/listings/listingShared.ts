export type Listing = {
  id: number;
  name: string;
  slug?: string;
  condition: string;
  location?: string;
  state?: string;
  region?: string;
  suburb?: string;
  regular_price: string | number;
  sale_price?: string | number | null;
  categories?: string[];
  image_format?: string[];
  image_url?: string[];
  image?: string;
  seller_type?: string;
  kg?: string;
  length?: string | number;
  make?: string;
  is_premium?: boolean;
  is_exclusive?: boolean;
  is_featured?: boolean;
  slot_bucket?: string;
};

/** Raw shape returned by the MPN /pool endpoint — field names differ from the
 * `Listing` shape the render components expect (a holdover from the old API). */
type RawPoolItem = Listing & {
  title?: string;
  r2_thumbnails?: string[];
  category?: string[];
  atm?: number | string;
  tier?: string;
};

/** Adapts a raw /pool item to the `Listing` shape components render: MPN sends
 * `title` (not `name`), `r2_thumbnails` as protocol-relative host+path (not
 * `image_format` with full URLs), `category` (not `categories`), and `atm`
 * (not `kg`). Safe to call more than once — already-correct fields pass through. */
function normalizeListing(raw: RawPoolItem): Listing {
  const thumbs = raw.r2_thumbnails?.length ? raw.r2_thumbnails : raw.image_format;
  return {
    ...raw,
    name: raw.name ?? raw.title ?? "",
    categories: raw.categories ?? raw.category,
    image_format: thumbs?.map((t) =>
      /^https?:\/\//.test(t) ? t : `https://${t}`
    ),
    kg: raw.kg ?? (raw.atm != null ? `${raw.atm}kg` : undefined),
    slot_bucket: raw.slot_bucket ?? raw.tier,
  };
}

export const normalizeAll = (items: Listing[]): Listing[] =>
  (items ?? []).map((item) => normalizeListing(item as RawPoolItem));

export type SeoV2 = {
  h1?: string;
  meta_title?: string;
  meta_description?: string;
  short_description?: string;
  footer_description?: string;
  /** JSON-encoded string: `[{ "q": "...", "a": "..." }, ...]` */
  faq?: string;
};

/** Featured-tab ordering: slots 1 & 2 are regular featured vans, slot 3 is the
 * exclusive spotlight van, slots 4 & 5 are premium vans, then the rest of the
 * pool fills in after. Shared by the internal fetch path and any caller doing
 * its own shared fetch (e.g. StateHome splitting one response across grids). */
export function buildFeaturedOrder(productsRaw: Listing[], premiumsRawIn: Listing[], exclusivesRawIn: Listing[]): Listing[] {
  const products = normalizeAll(productsRaw);
  const premiums   = normalizeAll(premiumsRawIn).map((p) => ({ ...p, is_premium: true }));
  const exclusives = normalizeAll(exclusivesRawIn).map((p) => ({ ...p, is_exclusive: true }));
  const heroFeatured = products.slice(0, 2);
  const hero = [...heroFeatured, ...exclusives.slice(0, 1), ...premiums.slice(0, 2)];
  const heroIds = new Set(hero.map((p) => p.id));
  const rest = products.filter((p) => !heroIds.has(p.id));
  return [...hero, ...rest];
}

/** Split a /pool response's products into Featured/New/Used buckets.
 *
 * The MPN API returns TWO shapes depending on the request:
 *  - Page 1, default order, no condition filter: pre-split top-level
 *    `featured_products` / `new_products` / `used_products` arrays.
 *  - Every other case (explicit sort, page 2+, condition filter): a single
 *    flat `products` array, each item carrying a `tier` (or legacy
 *    `slot_bucket`) field to bucket by.
 */
export function splitPoolProducts(
  productsIn: Listing[],
  premiumsRaw: Listing[],
  exclusivesRaw: Listing[],
  presplitIn?: { featured?: Listing[]; new?: Listing[]; used?: Listing[] }
): { featured: Listing[]; new: Listing[]; used: Listing[] } {
  const products = normalizeAll(productsIn);
  const presplit = presplitIn && {
    featured: normalizeAll(presplitIn.featured ?? []),
    new: normalizeAll(presplitIn.new ?? []),
    used: normalizeAll(presplitIn.used ?? []),
  };
  const hasPreSplit = !!(presplit && (presplit.featured.length + presplit.new.length + presplit.used.length > 0));

  if (hasPreSplit) {
    const featured = buildFeaturedOrder(presplit!.featured, premiumsRaw, exclusivesRaw);
    const featuredIds = new Set(featured.map((p) => p.id));
    const newItems  = presplit!.new.filter((p) => !p.is_premium && !p.is_exclusive && !featuredIds.has(p.id));
    const usedItems = presplit!.used.filter((p) => !p.is_premium && !p.is_exclusive && !featuredIds.has(p.id));
    return { featured, new: newItems, used: usedItems };
  }

  const bucketOf = (p: Listing) => (p as Listing & { tier?: string }).tier ?? p.slot_bucket;
  const featuredSource = products.filter((p) => bucketOf(p) === "featured");
  const featured = buildFeaturedOrder(featuredSource, premiumsRaw, exclusivesRaw);
  const featuredIds = new Set(featured.map((p) => p.id));
  const newItems  = products.filter((p) => bucketOf(p) === "new"  && !p.is_premium && !p.is_exclusive && !featuredIds.has(p.id));
  const usedItems = products.filter((p) => bucketOf(p) === "used" && !p.is_premium && !p.is_exclusive && !featuredIds.has(p.id));
  return { featured, new: newItems, used: usedItems };
}
