const API_KEY = process.env.MPN_API_KEY;

// Prefers the slug-based /impression beacon (matches /click); falls back to
// the batch /impressions endpoint (numeric ids) when only product_id is
// available, since that's the only MPN route that still accepts an id.
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const slug: string | undefined = body.slug;

    if (slug) {
      await fetch(
        `${process.env.MPN_API_BASE}/impression?slug=${encodeURIComponent(slug)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(API_KEY && { "X-Secret-Key": API_KEY }),
          },
        }
      );
    } else if (body.product_id) {
      await fetch(
        `${process.env.MPN_API_BASE}/impressions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(API_KEY && { "X-Secret-Key": API_KEY }),
          },
          body: JSON.stringify({ ids: [body.product_id] }),
        }
      );
    }

    return Response.json({ success: true });
  } catch (_e) {
    return Response.json({ success: false });
  }
}