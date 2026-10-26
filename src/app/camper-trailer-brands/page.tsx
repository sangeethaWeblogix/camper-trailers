import type { Metadata } from "next";
import Link from "next/link";

const BASE_URL = "https://www.campingtrailersforsale.com.au";
const API_BASE = process.env.MPN_API_BASE;
const API_KEY = process.env.MPN_API_KEY;

export const metadata: Metadata = {
  title: "Browse Camper Trailer Brands",
  description: "Browse every camper trailer brand for sale on CampingTrailersForSale.com.au, from major manufacturers to boutique off-road builders.",
  robots: "index, follow",
  alternates: { canonical: `${BASE_URL}/camper-trailer-brands/` },
};

function slugToName(slug: string): string {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/** A plain, real-<a>-tag directory of every make — the make picker in
 * StateFilterBar is a click-driven modal with no hrefs, so without a page
 * like this, every /listings/{make}/ page has zero crawlable internal links
 * pointing to it (flagged by Ahrefs as "Orphan page"). */
async function fetchAllMakeSlugs(): Promise<string[]> {
  try {
    const res = await fetch(`${API_BASE}/sitemap/makes`, {
      headers: {
        Accept: "application/json",
        ...(API_KEY && { "X-Secret-Key": API_KEY }),
      },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    if (!data?.success || !Array.isArray(data.paths)) return [];
    return data.paths
      .map((p: string) => p.replace(/\/+$/, ""))
      .filter(Boolean)
      .sort((a: string, b: string) => a.localeCompare(b));
  } catch {
    return [];
  }
}

export default async function CamperTrailerBrandsPage() {
  const makes = await fetchAllMakeSlugs();

  return (
    <main className="container" style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 15px" }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>Camper Trailer Brands</h1>
      <p style={{ color: "#555", marginBottom: 28, maxWidth: 720 }}>
        Browse camper trailers for sale by brand. Select a manufacturer below to see every current listing.
      </p>
      <ul
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: "10px 20px",
          listStyle: "none",
          padding: 0,
          margin: 0,
        }}
      >
        {makes.map((slug) => (
          <li key={slug}>
            <Link href={`/listings/${slug}/`} style={{ color: "#0066cc", textDecoration: "none" }}>
              {slugToName(slug)} Camper Trailers
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
