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


/** GET /{slug}/similar returns a flat `{items: [...]}` array (same state,
 * similar price band) — unlike the old CFS API's richer
 * `{similar_by_make, similar_by_price, ...}` grouping. Mapped onto
 * `similar_by_price`/`price_similar` here since that's the closest match;
 * the old by-make grouping and blog sections have no MPN equivalent yet. */
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
    ...(pd.make && { brand: { "@type": "Brand", name: pd.make } }),
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