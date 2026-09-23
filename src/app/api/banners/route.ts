
// src/app/api/banners/route.ts
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const PLACEMENTS = ["listings", "home"];

export async function GET() {
  try {
    const results = await Promise.allSettled(
      PLACEMENTS.map(async (placement) => {
        // site=ctfs scopes results to this site's own banners — the Marketplace
        // Network backend serves multiple connected sites (camping trailers,
        // campervans, etc.) from the same ads-manager API; without this param
        // it returns banners for whichever site happens to match first.
        const url = `http://admin.marketplacenetwork.com.au/wp-json/ads-manager/v1/banners?placement=${placement}&limit=50&paged=1&site=ctfs`;

        const res = await fetch(url, {
          headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36" },
          cache: "no-store",
        });

        if (!res.ok) {
          // 404 means the placement hasn't been configured in WordPress yet — not an error.
          // Log other unexpected failures as warnings so they're visible but not alarming.
          if (res.status !== 404) {
            console.warn(`⚠️ banners/${placement}: ${res.status}`);
          }
          return [];
        }

        const raw = await res.text();
        const idx = raw.search(/[[{]/);
        if (idx === -1) return [];
        let data;
        try {
          data = JSON.parse(idx > 0 ? raw.substring(idx) : raw);
        } catch {
          return [];
        }
        return Array.isArray(data) ? data : data.data || [];
      })
    );

    const merged = results.flatMap((r) =>
      r.status === "fulfilled" ? r.value : []
    );

    const unique = merged.filter(
      (banner, index, self) =>
        index === self.findIndex((b) => b.id === banner.id)
    );

    console.log(`✅ Total banners: ${unique.length}`);
    return NextResponse.json(unique, {
      headers: { "Cache-Control": "no-store" },
    });

  } catch (error) {
    console.error("🔴 Error:", error);
    return NextResponse.json([], { status: 500 });
  }
}