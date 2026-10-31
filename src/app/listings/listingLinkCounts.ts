import { parseSlugToFilters } from "@/app/components/urlBuilder";
import { buildSlugFromFilters } from "@/app/components/slugBuilter";

/**
 * Live-count guard for static /listings/ links (home, footer, listings browse
 * section). A link is only rendered when its page actually has products —
 * an empty page renders 200 + noindex with no listings, and a non-canonical
 * segment order is answered 410 by middleware.ts. Counts are fetched per href,
 * so a hidden link comes back by itself as soon as stock arrives.
 */
export type ListingLinkCounts = Record<string, number>;

const norm = (p: string) => p.replace(/\/$/, "").toLowerCase();

/** /api/params-count/ scope matching exactly what the href's page queries, or
 * null when middleware would 410 the href (segment order isn't canonical). */
export function listingLinkCountScope(href: string): URLSearchParams | null {
  const slugParts = href.replace(/^\/listings/, "").split("/").filter(Boolean);
  if (slugParts.length === 0) return new URLSearchParams({ group_by: "make" });
  const f = parseSlugToFilters(slugParts);
  if (norm(buildSlugFromFilters(f)) !== norm(href)) return null;

  const p = new URLSearchParams();
  if (f.make)        p.set("make", f.make);
  if (f.model)       p.set("model", f.model);
  if (f.condition)   p.set("condition", f.condition.toLowerCase().replace(/\s+/g, "-"));
  if (f.category)    p.set("category", f.category);
  if (f.state)       p.set("state", String(f.state).toLowerCase());
  if (f.region)      p.set("region", f.region);
  if (f.from_price)  p.set("from_price", String(f.from_price));
  if (f.to_price)    p.set("to_price", String(f.to_price));
  if (f.minKg)       p.set("from_atm", String(f.minKg));
  if (f.maxKg)       p.set("to_atm", String(f.maxKg));
  if (f.from_length) p.set("from_length", String(f.from_length));
  if (f.to_length)   p.set("to_length", String(f.to_length));
  if (f.from_sleep)  p.set("from_sleep", String(f.from_sleep));
  if (f.to_sleep)    p.set("to_sleep", String(f.to_sleep));

  // params-count drops the group_by dimension from its own scope, so group by
  // one the href doesn't filter on — total_products then honours every filter.
  const groupBy = ["make", "condition", "category", "region", "state"].find((g) => !p.has(g)) ?? "make";
  p.set("group_by", groupBy);
  return p;
}

/** Unknown count (fetch failed / not fetched) keeps the link — only a known 0 hides it. */
export function hasListings(counts: ListingLinkCounts | null | undefined, href: string): boolean {
  return (counts?.[href] ?? 1) > 0;
}
