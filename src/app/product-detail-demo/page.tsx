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

  const images: string[] = raw.images_full ?? raw.images ?? [];
  const attributesObj: Record<string, string> = raw.attributes ?? {};
  const attribute_urls = Object.entries(attributesObj).map(([label, value]) => ({ label, value: String(value) }));

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

/** GET /{slug}/similar returns a flat `{items: [...]}` array — see the
 * matching adapter note in src/app/product/[slug]/page.tsx. */
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
    const items = json?.items ?? [];
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
