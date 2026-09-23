import { NextResponse } from "next/server";
const API_KEY = process.env.MPN_API_KEY;

// Fired on product detail page view — tracks both a click and an impression
// for the viewed listing (matches the old route's behaviour). MPN's beacons
// are slug-based; falls back to the batch /impressions endpoint (numeric id,
// impression-only — there's no id-based click route) when only product_id
// is available.
export async function POST(req: Request) {
  try {
    const { product_id, slug } = await req.json();

    if (slug) {
      await Promise.all([
        fetch(`${process.env.MPN_API_BASE}/click?slug=${encodeURIComponent(slug)}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(API_KEY && { "X-Secret-Key": API_KEY }),
          },
        }),
        fetch(`${process.env.MPN_API_BASE}/impression?slug=${encodeURIComponent(slug)}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(API_KEY && { "X-Secret-Key": API_KEY }),
          },
        }),
      ]);
    } else if (product_id) {
      await fetch(`${process.env.MPN_API_BASE}/impressions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(API_KEY && { "X-Secret-Key": API_KEY }),
        },
        body: JSON.stringify({ ids: [product_id] }),
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: true });
  }
}