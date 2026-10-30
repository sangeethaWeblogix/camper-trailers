 import { cache } from "react";
import { parseSlugToFilters } from "@/app/components/urlBuilder";

/** Local shapes for the pool_test response fields this file actually reads —
 * kept here instead of importing from the (removed) old listings API module.
 * /pool items come back as `title`/`slug`/`r2_thumbnails`/`category` (not
 * `name`/`link`/`image_format`/`categories` — see normalizeListing in
 * src/app/listings/listingShared.ts for the same raw shape); `make`/`model`/
 * `axle` aren't present on /pool items at all, even when filtering by make. */
type Item = {
  name?: string;
  title?: string;
  make?: string;
  model?: string;
  link?: string;
  slug?: string;
  sku?: string;
  length?: string | number;
  atm?: number | string | null;
  condition?: string;
  regular_price?: string | number;
  sale_price?: string | number;
  image?: string;
  image_format?: string[];
  r2_thumbnails?: string[];
  categories?: string[];
  category?: string[];
  axle?: string;
};

type ApiResponse = {
  success?: boolean;
  seo_v2?: {
    h1?: string;
    meta_title?: string;
    meta_description?: string;
    footer_description?: string;
    faq?: string | Faq[];
  };
  pagination?: {
    total_products?: number;
  };
  data?: {
    products?: Item[];
    exclusive_products?: Item[];
    emp_exclusive_products?: Item[];
    premium_products?: Item[];
  };
  emp_exclusive_products?: Item[];
};

const BASE_URL = "https://www.campingtrailersforsale.com.au";
const API_BASE = process.env.MPN_API_BASE;
const API_KEY = process.env.MPN_API_KEY;

/** Manual TTL cache (mirrors seoCache/productCache in middleware.ts) instead of
 * Next's `next: { revalidate }` fetch Data Cache — that internal stream-teeing
 * mechanism races with bots that disconnect mid-render, throwing
 * "controller[kState].transformAlgorithm is not a function". Plain in-memory
 * Map, server-side only — doesn't touch response headers, so it has no effect
 * on Cloudflare's edge cache. */
const headPoolCache = new Map<string, { data: ApiResponse | null; expires: number }>();
const HEAD_POOL_CACHE_TTL = 60 * 60 * 1000; // 1 hour

/** Same backend endpoint as /api/pool-listings/ (pool_test, engine=typesense) —
 * used here instead of new_optimize_code because pool_test has proven far more
 * reliable (new_optimize_code intermittently returns a PHP notice from the ACF
 * plugin instead of JSON). Response is flat (products/premium_products/etc. at
 * the top level); adapted into the nested ApiResponse shape buildListingsJsonLd
 * already expects, so no caller changes are needed. */
async function fetchPoolListingsForHead(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filters: any,
  page: number
): Promise<ApiResponse | null> {
  const params = new URLSearchParams();
  params.set("orderby", "default");
  params.set("seed", "1"); // fixed seed — this is for SEO schema, not user-facing shuffle
  params.set("page", String(page));
  if (filters.state) params.set("state", String(filters.state));
  if (filters.category) params.set("category", String(filters.category));
  if (filters.make) params.set("make", String(filters.make));
  if (filters.model) params.set("model", String(filters.model));
  if (filters.region) params.set("region", String(filters.region));
  if (filters.suburb) params.set("suburb", String(filters.suburb));
  if (filters.pincode) params.set("pincode", String(filters.pincode));
  if (filters.from_price) params.set("from_price", String(filters.from_price));
  if (filters.to_price) params.set("to_price", String(filters.to_price));
  if (filters.minKg) params.set("from_atm", String(filters.minKg));
  if (filters.maxKg) params.set("to_atm", String(filters.maxKg));
  if (filters.from_sleep) params.set("from_sleep", String(filters.from_sleep));
  if (filters.to_sleep) params.set("to_sleep", String(filters.to_sleep));
  // Backend expects from_year/to_year — acustom_fromyears/acustom_toyears
  // (the filter field names) is a leftover from the old backend and is
  // silently ignored by /pool.
  if (filters.acustom_fromyears) params.set("from_year", String(filters.acustom_fromyears));
  if (filters.acustom_toyears) params.set("to_year", String(filters.acustom_toyears));
  if (filters.from_length) params.set("from_length", String(filters.from_length));
  if (filters.to_length) params.set("to_length", String(filters.to_length));
  if (filters.condition) params.set("condition", String(filters.condition));
  if (filters.search || filters.keyword) params.set("search", String(filters.search ?? filters.keyword));

  const url = `${API_BASE}/pool?${params.toString()}`;

  const cached = headPoolCache.get(url);
  if (cached && cached.expires > Date.now()) return cached.data;

  let res: Response;
  try {
    res = await fetch(url, {
      headers: {
        Accept: "application/json",
        ...(API_KEY && { "X-Secret-Key": API_KEY }),
      },
      cache: "no-store",
    });
  } catch {
    return null;
  }
  if (!res.ok) return null;

  const raw = await res.text();
  const jsonStart = raw.indexOf("{");
  const cleaned = jsonStart <= 0 ? raw : raw.substring(jsonStart);

  let json: any;
  try {
    json = JSON.parse(cleaned);
  } catch {
    return null;
  }

  // Page 1 + default order + no condition filter (what this function always
  // requests) makes /pool return pre-split featured_products/new_products/
  // used_products instead of a flat products array — same quirk documented in
  // splitPoolProducts (src/app/listings/listingShared.ts). Without this
  // fallback, `products` here is always empty, which left every listings
  // page's OfferCatalog schema with 0 items regardless of real inventory.
  const flatProducts: Item[] = json.products?.length
    ? json.products
    : [
        ...(json.featured_products ?? []),
        ...(json.new_products ?? []),
        ...(json.used_products ?? []),
      ];

  const data: ApiResponse = {
    success: json.success,
    seo_v2: json.seo_v2,
    pagination: json.pagination,
    data: {
      products: flatProducts,
      exclusive_products: json.exclusive_products ?? [],
      emp_exclusive_products: json.emp_exclusive_products ?? [],
      premium_products: json.premium_products ?? [],
    },
    emp_exclusive_products: json.emp_exclusive_products ?? [],
  };
  headPoolCache.set(url, { data, expires: Date.now() + HEAD_POOL_CACHE_TTL });
  return data;
}

function parseLengthFt(raw: string | number): number {
  // handles "19'6 ft" (feet+inches) and "24.93 ft" (decimal feet)
  const str = String(raw);
  const feetInches = str.match(/^(\d+)'(\d+)/);
  if (feetInches) return parseInt(feetInches[1]) + parseInt(feetInches[2]) / 12;
  return parseFloat(str);
}

function cleanPrice(raw: string | number): string {
  return String(raw).replace(/[$,]/g, "").trim();
}

function stripHtml(raw: string): string {
  return raw
    .replace(/<\/(h[1-6]|p|div|li|br)\s*>/gi, ". ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;|&apos;/gi, "'")
    .replace(/\s*\.\s*\.\s*/g, ". ") // collapse doubled periods from adjacent block tags
    .replace(/\s+/g, " ")
    .replace(/\s+\./g, ".")
    .trim();
}

type Faq = { q: string; a: string };

function parseFaq(raw?: string | Faq[]): Faq[] {
  if (!raw) return [];
  const parsed = Array.isArray(raw) ? raw : (() => {
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  })();
  if (!Array.isArray(parsed)) return [];
  return parsed.filter((f): f is Faq => !!f?.q && !!f?.a);
}

/** /pool items don't carry a separate year field — titles consistently embed
 * it ("2026 Jayco Lark OB.CP-MY26 ...", "2018 Goldstream Crown ST ..."), so
 * pull the first plausible vehicle year out of the name instead of guessing. */
function extractYear(name: string): number | null {
  const m = name.match(/\b(19|20)\d{2}\b/);
  return m ? parseInt(m[0], 10) : null;
}

/** Builds a schema.org ItemList entry per listing, matching the richer
 * Vehicle pattern used on the sibling motorhomesforsale.com.au site. /pool
 * items don't carry per-item make/model (confirmed even when the request is
 * itself filtered by make), so `brand` is only set when the PAGE is filtered
 * to a single make — safe to attribute every item on it to that make — never
 * guessed from free-text title parsing. */
function buildVehicleListItem(item: Item, position: number, pageMake?: string) {
  const name = item.name ?? item.title ?? "";
  const url = item.link ?? (item.slug ? `${BASE_URL}/product/${item.slug}/` : "");
  const rawPrice = item.sale_price && item.sale_price !== "" ? item.sale_price : item.regular_price;
  const priceStr = cleanPrice(rawPrice ?? "");
  const price = priceStr && !isNaN(Number(priceStr)) ? Number(priceStr) : null;
  const thumbs = item.r2_thumbnails?.length ? item.r2_thumbnails : item.image_format;
  const images = thumbs && thumbs.length > 0 ? thumbs.slice(0, 5) : item.image ? [item.image] : [];
  const categories = item.categories ?? item.category ?? [];
  const year = extractYear(name);
  const lengthFt = parseLengthFt(item.length ?? "");
  const atmKg = item.atm != null ? Number(item.atm) : null;

  const additionalProperty: Record<string, unknown>[] = [];
  if (!isNaN(lengthFt) && lengthFt > 0) {
    additionalProperty.push({ "@type": "PropertyValue", name: "Length", value: Number(lengthFt.toFixed(2)), unitCode: "FOT" });
  }
  if (atmKg != null && !isNaN(atmKg) && atmKg > 0) {
    additionalProperty.push({ "@type": "PropertyValue", name: "ATM", value: atmKg, unitCode: "KGM" });
  }
  if (categories.length > 0) {
    additionalProperty.push({ "@type": "PropertyValue", name: "Features", value: categories.join(", ") });
  }

  const itemCondition =
    String(item.condition ?? "").toLowerCase() === "new"
      ? "https://schema.org/NewCondition"
      : "https://schema.org/UsedCondition";

  return {
    "@type": "ListItem",
    position,
    url,
    item: {
      "@type": "Vehicle",
      "@id": `${url}#vehicle`,
      name,
      url,
      ...(item.sku && { sku: item.sku }),
      bodyType: "Camper Trailer",
      ...(pageMake && { brand: { "@type": "Brand", name: pageMake } }),
      ...(year && { vehicleModelDate: String(year) }),
      ...(additionalProperty.length > 0 && { additionalProperty }),
      ...(images.length > 0 && { image: images }),
      itemCondition,
      ...(price !== null && {
        offers: {
          "@type": "Offer",
          url,
          price,
          priceCurrency: "AUD",
          availability: "https://schema.org/InStock",
          itemCondition,
        },
      }),
    },
  };
}

/** Single @graph combining WebSite + CollectionPage + BreadcrumbList +
 * ItemList (+ FAQPage) — matches the structure already in production on the
 * sibling motorhomesforsale.com.au listings pages: one connected graph with
 * @id cross-references, rather than two separate, loosely-related scripts
 * (the old CollectionPage/SearchResultsPage split this replaces). */
export function buildListingsJsonLd(
  response: ApiResponse,
  pageUrl: string,
  breadcrumbs: { name: string; url: string }[],
  pathname: string
) {
  const pageTitle =
    response?.seo_v2?.h1 ||
    response?.seo_v2?.meta_title ||
    "Camper Trailers for Sale in Australia";

  const allProducts = [
    ...(response.data?.products || []),
    ...(response.data?.emp_exclusive_products || []),
  ];

  const footerDescription = response?.seo_v2?.footer_description
    ? stripHtml(response.seo_v2.footer_description)
    : "";
  const pageDescription =
    footerDescription || response?.seo_v2?.meta_description || "";

  const faqItems = parseFaq(response?.seo_v2?.faq);

  // Re-derive filters from the path so a single-make page (e.g. /listings/avan/)
  // can safely attribute `brand` to every item — see buildVehicleListItem.
  const slugString = pathname.replace(/^\/listings\//, "").replace(/\/$/, "");
  const slugParts = slugString ? slugString.split("/").filter(Boolean) : [];
  const filters = parseSlugToFilters(slugParts, {});
  const pageMake = filters.make
    ? filters.make.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : undefined;

  const listingsLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${BASE_URL}/#website`,
        url: `${BASE_URL}/`,
        name: "Camper Trailers For Sale",
        inLanguage: "en-AU",
      },
      {
        "@type": "CollectionPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: pageTitle,
        ...(pageDescription && { description: pageDescription }),
        inLanguage: "en-AU",
        isPartOf: { "@id": `${BASE_URL}/#website` },
        breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
        mainEntity: { "@id": `${pageUrl}#itemlist` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: breadcrumbs.map((b, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: b.name,
          item: b.url,
        })),
      },
      {
        "@type": "ItemList",
        "@id": `${pageUrl}#itemlist`,
        name: pageTitle,
        numberOfItems: allProducts.length,
        itemListOrder: "https://schema.org/ItemListUnordered",
        itemListElement: allProducts.map((item, idx) =>
          buildVehicleListItem(item, idx + 1, pageMake)
        ),
      },
      ...(faqItems.length > 0
        ? [
            {
              "@type": "FAQPage",
              "@id": `${pageUrl}#faqpage`,
              mainEntity: faqItems.map((f) => ({
                "@type": "Question",
                name: stripHtml(f.q),
                acceptedAnswer: {
                  "@type": "Answer",
                  text: stripHtml(f.a),
                },
              })),
            },
          ]
        : []),
    ],
  };

  return { listingsLd };
}

// React.cache deduplicates within a single request; the 1hr cross-request cache
// is handled by headPoolCache above.
const fetchListingsForHead = cache(
  async (pathnameKey: string): Promise<ApiResponse | null> => {
    try {
      if (pathnameKey === "/listings/") {
        return await fetchPoolListingsForHead({}, 1);
      }
      const slugString = pathnameKey
        .replace(/^\/listings\//, "")
        .replace(/\/$/, "");
      const slugParts = slugString.split("/").filter(Boolean);
      const rawFilters = parseSlugToFilters(slugParts, {});
      const page = rawFilters.page ? Number(rawFilters.page) : 1;
      return await fetchPoolListingsForHead(rawFilters, page);
    } catch {
      return null;
    }
  }
);

export function buildBreadcrumbs(pathname: string): { name: string; url: string }[] {
  const crumbs: { name: string; url: string }[] = [
    { name: "Home", url: `${BASE_URL}/` },
    { name: "Camper Trailers for Sale", url: `${BASE_URL}/listings/` },
  ];
  if (pathname === "/listings/" || pathname === "/listings") return crumbs;

  const slugString = pathname.replace(/^\/listings\//, "").replace(/\/$/, "");
  const slugParts = slugString.split("/").filter(Boolean);
  slugParts.forEach((segment, i) => {
    const label = segment
      .replace(/-(category|state|region|condition|search|suburb)$/, "")
      .replace(/[-+]/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    crumbs.push({
      name: label,
      url: `${BASE_URL}/listings/${slugParts.slice(0, i + 1).join("/")}/`,
    });
  });
  return crumbs;
}

export default fetchListingsForHead;
