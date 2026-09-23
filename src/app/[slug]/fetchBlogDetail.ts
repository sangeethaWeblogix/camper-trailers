import { cache } from "react";

const API_KEY = process.env.MPN_API_KEY;
const FETCH_TIMEOUT_MS = 8000;
const MAX_ATTEMPTS = 3;

async function fetchWithTimeout(url: string) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    return await fetch(url, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
        ...(API_KEY && { "X-Secret-Key": API_KEY }),
      },
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

// MPN_API_BASE already includes the /camping-trailers vehicle-scope suffix
// (e.g. https://admin.marketplacenetwork.com.au/wp-json/mpn/v1/camping-trailers),
// but blog detail lives on the root mpn-blog namespace (GET /blog/{slug}),
// not under /camping-trailers — strip that suffix back off to get there.
// Response envelope matches the old /blog-detail-new shape by design.
const MPN_ROOT_BASE = process.env.MPN_API_BASE?.replace(/\/camping-trailers\/?$/, "");

// cache() dedupes identical (slug, seed) calls within a single request, so
// generateMetadata + layout + page no longer each hit the WP API separately.
export const fetchBlogDetail = cache(async (slug: string, seed?: number) => {
  const seedParam = seed ? `?seed=${seed}` : "";
  const url = `${MPN_ROOT_BASE}/blog/${encodeURIComponent(slug)}${seedParam}`;

  let lastErr: unknown;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const res = await fetchWithTimeout(url);
      if (res.status === 404) {
        return null;
      }
      if (!res.ok) {
        lastErr = new Error(`blog detail status ${res.status}`);
        continue;
      }
      const raw = await res.text();
      if (raw.includes("sgcaptcha") || raw.trimStart().startsWith("<html")) {
        console.error(`[fetchBlogDetail] Bot challenge blocked request | slug="${slug}" | attempt=${attempt}`);
        lastErr = new Error("sgcaptcha bot challenge");
        continue;
      }
      const idx = raw.indexOf('{"');
      return JSON.parse(idx >= 0 ? raw.substring(idx) : raw);
    } catch (err) {
      lastErr = err;
    }
  }

  console.error(`[fetchBlogDetail] All ${MAX_ATTEMPTS} attempts failed | slug="${slug}" |`, lastErr);
  return null;
});
