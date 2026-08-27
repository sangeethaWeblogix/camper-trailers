import { NextRequest, NextResponse } from "next/server";

export const preferredRegion = "syd1";

const API_BASE = process.env.NEXT_PUBLIC_CFS_API_BASE;
const API_KEY = process.env.CFS_API_KEY;

/**
 * Band-count lookup for the browse-section filter links (Price/ATM/Length/Sleep).
 * Mirrors fetchBandCountServer in fetchBrowseSectionData.ts.
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const paramsStr = searchParams.toString();
  try {
    const res = await fetch(`${API_BASE}/product_exists_check?${paramsStr}`, {
      headers: {
        Accept: "application/json",
        ...(API_KEY ? { "X-API-Key": API_KEY } : {}),
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return NextResponse.json({ success: false, exists: false, count: 0 }, { status: res.status });
    }

    const json = await res.json();
    return NextResponse.json(json);
  } catch (err) {
    console.error(
      `[product-exists-check] WP API fetch failed | params="${paramsStr}" | error="${(err as Error).message}"`
    );
    return NextResponse.json({ success: false, exists: false, count: 0 }, { status: 502 });
  }
}
