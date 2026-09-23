    import { NextResponse } from "next/server";
      const API_KEY = process.env.MPN_API_KEY; // ✅ Added

  
  const SITE_URL =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://www.campingtrailersforsale.com.au/listings/";
  
  export async function GET() {
    try {
      const res = await fetch(
        `${process.env.MPN_API_BASE}/sitemap/price`,
         {
        headers: {
          Accept: "application/json",
          ...(API_KEY && { "X-Secret-Key": API_KEY }), // ✅ Added
        },
      }
       
      );
  
      const data = await res.json();

      // The MPN backend doesn't implement the price sitemap type yet
      // (returns { success: false, message: "...not yet implemented" }) —
      // serve a valid empty sitemap rather than a 500, so crawlers don't log
      // it as a broken URL while the backend catches up.
      if (!data?.success || !Array.isArray(data.paths)) {
        return new NextResponse(
          `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`,
          { headers: { "Content-Type": "application/xml; charset=utf-8" } }
        );
      }


  
      const urls = data.paths
        .map(
          (path: string) => `
    <url>
      <loc>${SITE_URL}${path}</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
             <changefreq>weekly</changefreq>
        <priority>0.7</priority>
    </url>`
        )
        .join("");
  
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls}
  </urlset>`;
  
      return new NextResponse(sitemap, {
        headers: {
          "Content-Type": "application/xml; charset=utf-8",
        },
      });
    } catch (error) {
      console.error("❌ Sitemap error:", error);
      return new NextResponse("Failed to generate sitemap", { status: 500 });
    }
  }
  