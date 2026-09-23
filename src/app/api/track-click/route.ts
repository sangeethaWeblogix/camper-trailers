const API_KEY = process.env.MPN_API_KEY;

// /click needs the listing slug (query param) — the old update-clicks
// endpoint took product_id in the body; the MPN API's click beacon is
// slug-based instead, so this route now requires slug from the caller.
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const slug: string | undefined = body.slug;
    if (!slug) return Response.json({ success: false, error: "slug required" });

    await fetch(
      `${process.env.MPN_API_BASE}/click?slug=${encodeURIComponent(slug)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(API_KEY && { "X-Secret-Key": API_KEY }),
        },
      }
    );

    return Response.json({ success: true });
  } catch (_e) {
    return Response.json({ success: false });
  }
}