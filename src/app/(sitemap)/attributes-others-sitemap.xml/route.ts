import { NextResponse } from "next/server";

// This sitemap previously hardcoded ~400 make/model/state/region + price/
// weight/length/sleep band combo URLs (e.g. ".../jayco/starcraft/
// between-10000-20000/"). Every single one combines a band with another
// filter, which getRobotsFromFilters (src/utils/seo/meta.ts) always
// noindexes by design — and ~35% of them used a stale "size-in-feet" wording
// that doesn't match any current URL pattern at all, so they 410 outright.
// A sitemap should only list pages meant to be indexed, so this is empty
// rather than repopulated with "corrected" combo URLs.
const URLS: string[] = [];

export async function GET() {
  const lastmod = new Date().toISOString().split("T")[0];

  const urls = URLS.map(
    (url) => `  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>`
  ).join("\n");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new NextResponse(Buffer.from(sitemap, "utf-8"), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
