import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SITE_URL =
  (process.env.NEXT_PUBLIC_SITE_URL || "https://www.campingtrailersforsale.com.au") +
  "/product/";

const API_KEY = process.env.MPN_API_KEY;

export async function GET() {
  try {
    const res = await fetch(`${process.env.MPN_API_BASE}/sitemap/listings`, {
      headers: {
        Accept: "application/json",
        ...(API_KEY && { "X-Secret-Key": API_KEY }),
      },
      cache: "no-store",
    });

    const data = await res.json();

    if (!data?.success || !Array.isArray(data.paths)) {
      throw new Error("Invalid sitemap API response");
    }

    const today = new Date().toISOString().split("T")[0];

    const urls = data.paths
      .map(
        (path: string) => `
          <url>
            <loc>${SITE_URL}${path}</loc>
            <lastmod>${today}</lastmod>
            <changefreq>daily</changefreq>
            <priority>0.7</priority>
          </url>`,
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
