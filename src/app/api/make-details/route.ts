import { NextResponse } from "next/server";

const API_BASE = process.env.MPN_API_BASE;
const API_KEY = process.env.MPN_API_KEY;

export async function GET() {
  if (!API_BASE) {
    return NextResponse.json({ message: "API base not configured" }, { status: 500 });
  }

  // MPN has no make_details-with-models-per-make equivalent yet — the closest
  // available route is attribute-terms/make, a flat list of make names (no
  // slugs, no per-make model sub-lists). Adapted into the old
  // { data: { make_options: [{name, slug}] } } shape so callers don't need
  // to change, but the "models" sub-array this used to carry is gone.
  const res = await fetch(`${API_BASE}/attribute-terms/make`, {
    headers: {
      Accept: "application/json",
      ...(API_KEY && { "X-Secret-Key": API_KEY }),
    },
    cache: "no-store",
  });

  const raw = await res.text();
  let json: any;
  try {
    json = raw ? JSON.parse(raw) : {};
  } catch {
    json = { message: raw || "Invalid JSON from server" };
  }

  const values: string[] = json?.values ?? [];
  const make_options = values.map((name) => ({
    name,
    slug: name.trim().toLowerCase().replace(/\s+/g, "-"),
  }));

  return NextResponse.json({ data: { make_options } }, { status: res.status });
}
