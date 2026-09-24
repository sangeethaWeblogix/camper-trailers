import { cache } from "react";
import type { Metadata } from "next";
import ProductDetailDemo from "./ProductDetailDemo";

export const metadata: Metadata = {
  robots: "noindex, nofollow",
};

export const dynamic = "force-dynamic";

const DEMO_SLUG = "2025-retreat-caravans-daydream-29ft6-off-road";

/** Adapts the MPN API's flat single-listing response into the old CFS
 * envelope shape (`{ data: { product_details, ... }, seo }`) that
 * ProductDetailDemo already expects. Kept in sync with the same adapter in
 * src/app/product/[slug]/page.tsx. Fields not present on the MPN listing
 * (short_description, sku) are left undefined rather than guessed. */
function normalizeProductDetail(raw: any): any {
  if (!raw || raw.message === "Listing not found." || raw.code) return raw;

  const rawImages: string[] = raw.r2_thumbnails ?? raw.images_full ?? raw.images ?? [];
  const images: string[] = rawImages.map((t) => (/^https?:\/\//.test(t) ? t : `https://${t}`));

  // The MPN listing has no `attributes` object — see the matching note in
  // src/app/product/[slug]/page.tsx.
  const attributesObj: Record<string, unknown> = raw.attributes ?? {};
  const flatAttrPairs: [string, unknown][] = [
    ["Make", raw.make?.name],
    ["Model", raw.model?.name],
    ["Years", raw.year],
    ["Conditions", raw.condition],
    ["Length", raw.length],
    ["sleeps", raw.sleep],
    ["ATM", raw.atm],
    ["Tare Mass", raw.tare_mass],
    ["Ball Weight", raw.ball_weight],
    ["Axle Configuration", raw.axle_configuration],
    ["Suspension", raw.suspension],
    ["Brakes", raw.brakes],
    ["Location", typeof raw.state === "string" ? raw.state.replace(/\b\w/g, (c: string) => c.toUpperCase()) : raw.state],
  ];
  // Any OTHER field the API returns that isn't already mapped above or listed
  // as non-attribute metadata below gets auto-included too — see the matching
  // note in src/app/product/[slug]/page.tsx.
  const NON_ATTR_META_KEYS = new Set([
    "id", "source", "source_id", "sku", "unique_key", "dealer_id", "dealer",
    "seller_type", "product_type", "title", "slug", "status", "visibility",
    "is_featured", "featured", "exclusive", "premium", "make", "model", "year",
    "condition", "length", "atm", "sleep", "tare_mass", "ball_weight",
    "axle_configuration", "suspension", "brakes", "category", "state", "region",
    "suburb", "pincode", "regular_price", "sale_price", "r2_thumbnails",
    "updated_at", "imported_at", "images_full", "wc_categories", "in_stock",
    "seo_title", "seo_description", "location", "created_at", "description",
    "attributes", "name",
  ]);
  const ACRONYMS: Record<string, string> = { atm: "ATM", gps: "GPS", vin: "VIN", uv: "UV", led: "LED", usb: "USB" };
  const humanizeLabel = (key: string) =>
    key.split("_").map((w) => ACRONYMS[w.toLowerCase()] ?? (w.charAt(0).toUpperCase() + w.slice(1))).join(" ");
  const discoveredPairs: [string, unknown][] = Object.entries(raw)
    .filter(([k, v]) => !NON_ATTR_META_KEYS.has(k) && v !== null && v !== undefined && v !== "" && typeof v !== "object")
    .map(([k, v]) => [humanizeLabel(k), v]);

  const attribute_urls = [...Object.entries(attributesObj), ...flatAttrPairs, ...discoveredPairs]
    .filter(([, value]) => value !== null && value !== undefined && value !== "")
    .map(([label, value]) => ({ label, value: String(value) }));

  const product_details = {
    id: raw.id,
    slug: raw.slug,
    name: raw.title,
    title: raw.title,
    description: raw.description,
    image_url: images,
    image: images,
    regular_price: raw.regular_price,
    sale_price: raw.sale_price,
    location: [raw.suburb, raw.region, raw.state].filter(Boolean).join(", "),
    location_shortcode: raw.state,
    region: raw.region ? { label: raw.region, value: raw.region, slug: raw.region } : undefined,
    suburb: raw.suburb ? { label: raw.suburb, value: raw.suburb, slug: raw.suburb } : undefined,
    categories: raw.wc_categories ?? raw.category ?? [],
    attribute_urls,
    sku: raw.sku,
    seller_type: raw.seller_type,
    make: raw.make,
    model: raw.model,
    year: raw.year,
    condition: raw.condition,
    length: raw.length,
    atm: raw.atm,
    sleep: raw.sleep,
    tare_mass: raw.tare_mass,
    ball_weight: raw.ball_weight,
    axle_configuration: raw.axle_configuration,
  };

  return {
    data: {
      product_details,
      categories: product_details.categories,
      id: raw.id,
      slug: raw.slug,
      related: [],
      latest_blog_posts: [],
    },
    seo: {
      metatitle: raw.seo_title,
      meta_title: raw.seo_title,
      metadescription: raw.seo_description,
      meta_description: raw.seo_description,
    },
    name: raw.title,
  };
}

const fetchProduct = cache(async () => {
  const API_BASE = process.env.MPN_API_BASE!;
  const API_KEY  = process.env.MPN_API_KEY;
  try {
    const res = await fetch(
      `${API_BASE}/${encodeURIComponent(DEMO_SLUG)}`,
      {
        cache: "no-store",
        headers: {
          Accept: "application/json",
          ...(API_KEY && { "X-Secret-Key": API_KEY }),
        },
      }
    );
    if (!res.ok) return null;
    const raw = await res.text();
    const idx = raw.indexOf('{"');
    const parsed = JSON.parse(idx > 0 ? raw.substring(idx) : raw);
    return normalizeProductDetail(parsed);
  } catch {
    return null;
  }
});

/** GET /{slug}/similar returns `{ same_make: [...], price_range: [...], blog: [...] }`
 * — see the matching adapter note in src/app/product/[slug]/page.tsx. */
async function fetchSimilarProducts(slug: string) {
  const API_KEY = process.env.MPN_API_KEY;
  try {
    const res = await fetch(
      `${process.env.MPN_API_BASE}/${encodeURIComponent(slug)}/similar`,
      {
        cache: "no-store",
        headers: {
          Accept: "application/json",
          ...(API_KEY && { "X-Secret-Key": API_KEY }),
        },
      }
    );
    if (!res.ok) return null;
    const raw = await res.text();
    const idx = raw.indexOf("{");
    const json = JSON.parse(idx > 0 ? raw.substring(idx) : raw);

    const seen = new Set<number>();
    const items = [...(json?.same_make ?? []), ...(json?.price_range ?? [])]
      .filter((it: any) => {
        if (!it?.id || seen.has(it.id)) return false;
        seen.add(it.id);
        return true;
      })
      .map((it: any) => ({
        ...it,
        name: it.name ?? it.title,
        categories: it.categories ?? it.category,
        image_format: (it.r2_thumbnails ?? it.image_format ?? []).map((t: string) =>
          /^https?:\/\//.test(t) ? t : `https://${t}`
        ),
      }));

    if (!items.length) return null;
    return {
      similar_by_price: { products: items },
      price_similar: items,
    };
  } catch {
    return null;
  }
}

export default async function ProductDetailDemoPage() {
  const data = await fetchProduct();
  const similarData = await fetchSimilarProducts(DEMO_SLUG);

  return (
    <main>
      <ProductDetailDemo data={data} similarData={similarData} />
    </main>
  );
}
