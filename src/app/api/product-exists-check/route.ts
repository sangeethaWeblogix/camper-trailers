import { NextRequest, NextResponse } from "next/server";

export const preferredRegion = "syd1";

const API_BASE = process.env.MPN_API_BASE;
const API_KEY = process.env.MPN_API_KEY;

/**
 * Band-count lookup for the browse-section filter links (Price/ATM/Length/Sleep).
 * Mirrors fetchBandCountServer in fetchBrowseSectionData.ts.
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const paramsStr = searchParams.toString();
  try {
    const res = await fetch(`${API_BASE}/exists?${paramsStr}`, {
      headers: {
        Accept: "application/json",
        ...(API_KEY ? { "X-Secret-Key": API_KEY } : {}),
      },
      cache: "no-store",
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
