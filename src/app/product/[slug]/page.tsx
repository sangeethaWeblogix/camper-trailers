// app/product-details/[slug]/page.tsx
import ProductDetailDemo from "../../product-detail-demo/ProductDetailDemo";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { cache } from "react";
import './product.css?=30006'

export const dynamic = "force-dynamic";

// export async function generateStaticParams() {
//   const API_BASE = process.env.MPN_API_BASE;
//   const API_KEY = process.env.MPN_API_KEY;
//   if (!API_BASE) return [];
//
//   const headers: Record<string, string> = {
//     Accept: "application/json",
//     ...(API_KEY ? { "X-Secret-Key": API_KEY } : {}),
//   };
//
//   const fetchPage = async (page: number): Promise<string[]> => {
//     const res = await fetch(
//       `${API_BASE}/new_optimize_code?page=${page}&per_page=500`,
//       { headers, cache: "no-store" }
//     );
//     if (!res.ok) return [];
//     const data = await res.json();
//     const products: { slug?: string }[] = data?.data?.products ?? [];
//     return products.map((p) => p.slug ?? "").filter(Boolean);
//   };
//
//   // Page 1 — also tells us total_pages
//   const firstRes = await fetch(
//     `${API_BASE}/new_optimize_code?page=1&per_page=500`,
//     { headers, cache: "no-store" }
//   );
//   if (!firstRes.ok) return [];
//   const firstData = await firstRes.json();
//   const firstSlugs = (firstData?.data?.products ?? [])
//     .map((p: { slug?: string }) => p.slug ?? "")
//     .filter(Boolean) as string[];
//   const totalPages: number = firstData?.pagination?.total_pages ?? 1;
//
//   // Remaining pages — 10 at a time in parallel
//   const allSlugs = [...firstSlugs];
//   const BATCH = 10;
//   for (let i = 2; i <= totalPages; i += BATCH) {
//     const pages = Array.from(
//       { length: Math.min(BATCH, totalPages - i + 1) },
//       (_, j) => fetchPage(i + j)
//     );
//     const results = await Promise.all(pages);
//     allSlugs.push(...results.flat());
//   }
//
//   return allSlugs.map((slug) => ({ slug }));
// }

export const dynamicParams = true;

type RouteParams = { slug: string };
type PageProps = { params: Promise<RouteParams> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await Promise.race([
    fetchProductDetail(slug),
    new Promise<null>((resolve) => setTimeout(() => resolve(null), 1500)),
  ]);
  const pd = data?.data?.product_details ?? {};
  const seo = data?.seo ?? data?.product?.seo ?? {};
  const slugTitle = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const title = seo.metatitle || seo.meta_title || pd.name || data?.name || slugTitle || "Camping Trailer for Sale";
  const description = seo.metadescription || seo.meta_description || pd.short_description || "View camping trailer details on Caravans For Sale Australia.";
  const canonicalUrl = `https://www.campingtrailersforsale.com.au/product/${slug}/`;
  const rawImages = pd.image_url ?? pd.images ?? [];
  const images: string[] = (Array.isArray(rawImages) ? rawImages : [rawImages]).filter(Boolean);

  return {
    title,
    description,
    robots: seo.index === "noindex" ? "noindex, nofollow" : "index, follow",
    alternates: { canonical: canonicalUrl },
    verification: { google: "6tT6MT6AJgGromLaqvdnyyDQouJXq0VHS-7HC194xEo" },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Camping Trailers for Sale",
      ...(images.length > 0 && { images: [{ url: images[0], alt: title }] }),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

/** The MPN API returns a FLAT single-listing object at GET /{slug} — this
 * adapts it into the old CFS envelope shape (`{ data: { product_details, ... }, seo }`)
 * that generateMetadata() and ProductDetailDemo already expect, so neither
 * needs to change field-by-field. Field names not present on the MPN listing
 * (short_description, sku) are left undefined rather than guessed.
 */
function normalizeProductDetail(raw: any): any {
  if (!raw || raw.message === "Listing not found." || raw.code) return raw;

  const rawImages: string[] = raw.r2_thumbnails ?? raw.images_full ?? raw.images ?? [];
  const images: string[] = rawImages.map((t) => (/^https?:\/\//.test(t) ? t : `https://${t}`));

  // The MPN listing has no `attributes` object — the details-table data lives
  // as flat top-level fields instead. Map them onto the same {label, value}
  // shape ProductDetailDemo's attribute_urls-driven details table expects,
  // labeled to match the lookups it does (e.g. "Conditions" not "Condition").
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
  // as non-attribute metadata below gets auto-included too, humanized from its
  // key (e.g. `tyre_size` → "Tyre Size") — so a brand-new field the backend
  // adds later shows up in the details table without another code change.
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

const fetchProductDetail = cache(async (slug: string) => {
  const API_BASE = process.env.MPN_API_BASE!;
  const API_KEY = process.env.MPN_API_KEY;
  try {
    const res = await fetch(
      `${API_BASE}/${encodeURIComponent(slug)}`,
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
    const parsed = JSON.parse(idx >= 0 ? raw.substring(idx) : raw);
    return normalizeProductDetail(parsed);
  } catch {
    return null;
  }
});


/** GET /{slug}/similar returns `{ same_make: [...], price_range: [...], blog: [...] }`
 * (not the old CFS API's `{similar_by_make, similar_by_price, ...}` shape, and
 * not a flat `items` array either). Combined + deduped here into
 * `similar_by_price`/`price_similar` since that's what ProductDetailDemo renders;
 * items are also normalized the same way as the main listing (title→name,
 * r2_thumbnails→image_format with an https:// prefix). */
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

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await fetchProductDetail(slug);

  if (!data || Object.keys(data).length === 0) {
    // Middleware handles 410 for the common path; this covers the rare case where
    // the middleware check timed out and let the request through.
    redirect("/410/");
  }

  const pd = data?.data?.product_details ?? {};
  const seo = data?.seo ?? data?.product?.seo ?? {};
  const pdName = seo.metatitle || seo.meta_title || pd.name || data?.name || "";
  const pdDesc = seo.metadescription || seo.meta_description || pd.short_description || data?.short_description || "";
  const canonicalUrl = `https://www.campingtrailersforsale.com.au/product/${slug}/`;

  const rawImages = pd.image_url ?? pd.images ?? [];
  const images: string[] = (Array.isArray(rawImages) ? rawImages : [rawImages]).filter(Boolean);

  const rawPrice = pd.sale_price || pd.regular_price || pd.price;
  const priceStr = rawPrice ? String(rawPrice).replace(/[^0-9.]/g, "") : null;

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: pdName,
    ...(pdDesc && { description: pdDesc }),
    ...(images.length > 0 && { image: images }),
    ...(pd.make && { brand: { "@type": "Brand", name: pd.make?.name ?? pd.make } }),
    ...(pd.condition && {
      itemCondition:
        String(pd.condition).toLowerCase() === "new"
          ? "https://schema.org/NewCondition"
          : "https://schema.org/UsedCondition",
    }),
    offers: {
      "@type": "Offer",
      priceCurrency: "AUD",
      ...(priceStr && { price: priceStr }),
      availability: "https://schema.org/InStock",
      url: canonicalUrl,
      seller: { "@type": "Organization", name: "Caravans For Sale" },
    },
  };

  const similarData = await fetchSimilarProducts(slug);
  const seed = Math.ceil(Math.random() * 10);

  // Shuffle price section server-side (API doesn't shuffle it)
  if (similarData?.similar_by_price?.products?.length) {
    const arr = similarData.similar_by_price.products;
    let s = seed * 9301 + 49297;
    for (let i = arr.length - 1; i > 0; i--) {
      s = (s * 9301 + 49297) % 233280;
      const j = Math.floor((s / 233280) * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  return (
    <main className="mx-auto">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailDemo data={data} similarData={similarData} />
    </main>
  );
}