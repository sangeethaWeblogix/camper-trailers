const API_BASE = process.env.MPN_API_BASE;
const API_KEY  = process.env.MPN_API_KEY;

/** Shared headers for every WP API call. */
const wpHeaders = (): Record<string, string> => ({
  Accept: "application/json",
  ...(API_KEY ? { "X-Secret-Key": API_KEY } : {}),
});

// ---------------------------------------------------------------------------
// fetchMakeDetails
// MPN has no make_details-with-models-per-make equivalent — closest route is
// attribute-terms/make, a flat list of make names (no slugs). Adapted into
// the old { name, slug } shape callers expect.
// ---------------------------------------------------------------------------
export const fetchMakeDetails = async () => {
  const res = await fetch(`${API_BASE}/attribute-terms/make`, {
    headers: wpHeaders(),
    cache: "no-store",
  });
  const json = await res.json();
  const values: string[] = json?.values ?? [];
  return values.map((name) => ({ name, slug: name.trim().toLowerCase().replace(/\s+/g, "-") }));
};

// ---------------------------------------------------------------------------
// fetchModelCounts — WP params_count, 1h Next.js fetch cache.
// ---------------------------------------------------------------------------
export const fetchModelCounts = async (
  make: string
): Promise<{ name: string; slug: string; count: number }[]> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(
      `${API_BASE}/params-count?group_by=model&make=${encodeURIComponent(make)}`,
      {
        headers: wpHeaders(),
        cache: "no-store",
        signal: controller.signal,
      }
    );
    clearTimeout(timeoutId);
    if (!res.ok) return [];
    const data = await res.json();
    return data?.data ?? [];
  } catch {
    clearTimeout(timeoutId);
    return [];
  }
};

/** Remove duplicate makes by slug (WP taxonomy can register the same make twice). */
function dedupBySlug<T extends { slug: string }>(arr: T[]): T[] {
  const seen = new Set<string>();
  return arr.filter((m) => {
    if (seen.has(m.slug)) return false;
    seen.add(m.slug);
    return true;
  });
}

// ---------------------------------------------------------------------------
// fetchMakeCounts — WP params_count, 1h Next.js fetch cache.
// ---------------------------------------------------------------------------
export const fetchMakeCounts = async (): Promise<
  { name: string; slug: string; count: number }[]
> => {
  try {
    const res = await fetch(`${API_BASE}/params-count?group_by=make`, {
      headers: wpHeaders(),
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return dedupBySlug(data?.data ?? []);
  } catch {
    return [];
  }
};

// ---------------------------------------------------------------------------
// fetchCategoryCounts — WP params_count, 1h Next.js fetch cache.
// ---------------------------------------------------------------------------
export const fetchCategoryCounts = async (): Promise<
  { name: string; slug: string; count: number }[]
> => {
  try {
    const res = await fetch(`${API_BASE}/params-count?group_by=category`, {
      headers: wpHeaders(),
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data?.data ?? []).map(
      (c: { name: string; slug: string; count: number }) => ({
        ...c,
        slug: c.slug.replace(/-category$/, ""),
      })
    );
  } catch {
    return [];
  }
};

// ---------------------------------------------------------------------------
// fetchProductList — not pre-warmed in KV; Next.js 1h fetch cache.
// ---------------------------------------------------------------------------
export const fetchProductList = async () => {
  try {
    const res = await fetch(`${API_BASE}/params-product-list`, {
      headers: wpHeaders(),
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch product list");
    return await res.json();
  } catch (error) {
    console.error("fetchProductList error:", error);
    return null;
  }
};
