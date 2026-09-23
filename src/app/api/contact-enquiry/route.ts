import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.MPN_API_BASE;
const API_KEY = process.env.MPN_API_KEY;

/** Server-side proxy for POST /enquiries/contact — keeps MPN_API_KEY off the
 * client. Replaces the old direct-from-browser Contact Form 7 REST call
 * (wp-json/contact-form-7/v1/contact-forms/{id}/feedback), which needed no
 * auth; the MPN endpoint does, so this can no longer be called from the
 * browser directly. Expects { name, email, phone, postcode, message }. */
export async function POST(req: NextRequest) {
  if (!API_BASE) {
    return NextResponse.json({ success: false, message: "API base not configured" }, { status: 500 });
  }

  const payload = await req.json();

  const res = await fetch(`${API_BASE}/enquiries/contact`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(API_KEY && { "X-Secret-Key": API_KEY }),
    },
    body: JSON.stringify(payload),
  });

  const raw = await res.text();
  let json: object;
  try {
    json = raw ? JSON.parse(raw) : {};
  } catch {
    json = { success: false, message: raw || "Invalid JSON from server" };
  }

  return NextResponse.json(json, { status: res.status });
}
