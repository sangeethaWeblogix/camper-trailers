const API_BASE = process.env.MPN_API_BASE;
const API_KEY = process.env.MPN_API_KEY;
const SERVER_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36";

export type FeaturedListing = {
  id: number;
  name: string;
  slug: string;
  condition: string;
  location: string;
  state?: string;
  regular_price: string;
  sale_price: string;
  categories: string[];
  image_format: string[];
  seller_type?: string;
  berths?: string | number;
};

// Normalize each product so components always get image_format as string[]
// home_featured returns `thumbnail` (imagestack R2 URL); also handle `image` fallback
function normalizeProduct(p: any): FeaturedListing {
  if (!p.image_format) {
    const img = p.thumbnail ?? p.image ?? p.main_image ?? null;
    p.image_format = img ? [img] : [];
  } else if (typeof p.image_format === "string") {
    p.image_format = [p.image_format];
  }
  if (!p.seller_type) p.seller_type = "dealer";
  return p;
}

export async function fetchHomeFeatured(params: {
  type?: "all" | "new" | "used";
  seed?: number;
  category?: string;
  visitorIp?: string;
}): Promise<FeaturedListing[]> {
  const { type = "all", seed, category, visitorIp } = params;

  if (!API_BASE) return [];

  const url = `${API_BASE}/home-featured?type=${encodeURIComponent(type)}${
    seed ? `&seed=${encodeURIComponent(seed)}` : ""
  }${category ? `&category=${encodeURIComponent(category)}` : ""}`;

  const controller = new AbortController();
  // 20s: the home page fires several of these in parallel (type=all/new/used)
  // alongside other API calls, and dev-mode's first Turbopack compile can
  // delay the event loop enough to abort a ~1.5s request prematurely at 10s.
  const timeoutId = setTimeout(() => controller.abort(), 20000);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        "User-Agent": SERVER_UA,
        ...(API_KEY && { "X-Secret-Key": API_KEY }),
        ...(visitorIp && { "X-Visitor-IP": visitorIp }),
      },
      cache: "no-store",
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.error(`[home_featured] type=${type} non-OK status: ${res.status}`);
      return [];
    }

    const raw = await res.text();

    if (raw.includes("sgcaptcha") || raw.includes("cf-chl") || raw.trimStart().startsWith("<html")) {
      console.error(`[home_featured] type=${type} CLOUDFLARE CHALLENGE blocked request`);
      return [];
    }

    const jsonStart = raw.indexOf("{");
    const json = JSON.parse(jsonStart > 0 ? raw.substring(jsonStart) : raw);

    // MPN response shape: { success, type, state, seed, counts, count, items: [...] }
    // (older shape used `products`/`data.products` — kept as a fallback)
    const rawProducts: any[] = json?.items ?? json?.products ?? json?.data?.products ?? [];
    return rawProducts.map(normalizeProduct);
  } catch (err: any) {
    clearTimeout(timeoutId);
    console.error(`[home_featured] type=${type} fetch error:`, err?.message);
    return [];
  }
}
