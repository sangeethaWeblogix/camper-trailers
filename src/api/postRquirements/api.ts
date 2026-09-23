// src/api/requirements/api.ts
const API_BASE = process.env.MPN_API_BASE;
const API_KEY = process.env.MPN_API_KEY; // ✅ Add this

export type Requirement = {
  id?: number; // if the API returns one
  featured?: "0" | "1";
  type: string; // e.g., "Hybrid"
  condition: string; // e.g., "Used" | "New"
  location: string; // e.g., "2033"
  requirements: string; // text
  budget: string; // number as string
  active?: "0" | "1";
  created_at?: string;
};

type ListResp = {
  success: boolean;
  data: Requirement[]; // screenshot shows an array under data
};

// Maps onto GET /get-home-enquiries-list — returns featured (featured=1)
// buy/sell requirement submissions. Confirmed working against the dedicated
// MPN Camping Trailers Postman collection: {success, data: Requirement[]}
// on a hit, {success: false, message: "No enquiries found", data: []} when
// empty — data is always a usable array either way.
export async function fetchRequirements(): Promise<Requirement[]> {
  if (!API_BASE) return [];
  const url = `${API_BASE}/get-home-enquiries-list`;
  try {
    const res = await fetch(url, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
        ...(API_KEY && { "X-Secret-Key": API_KEY }),
      },
    });
    if (!res.ok) return [];
    const json: ListResp = await res.json();
    return Array.isArray(json?.data) ? json.data : [];
  } catch {
    return [];
  }
}

/** Maps onto POST /enquiries/home (the "buy/sell requirement" form) —
 * name/email/phone/postcode/budget/requirements required, condition
 * optional. The old Requirement type's `type`/`location`/`featured`/`active`
 * fields have no equivalent on the new API and are dropped from the request;
 * callers now need to supply name/email/phone directly. */
export async function createRequirement(
  payload: Requirement & { name: string; email: string; phone: string; postcode?: string }
): Promise<boolean> {
  if (!API_BASE) throw new Error("Missing MPN_API_BASE");
  const url = `${API_BASE}/enquiries/home`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(API_KEY && { "X-Secret-Key": API_KEY }),
    },
    body: JSON.stringify({
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      postcode: payload.postcode ?? payload.location,
      condition: payload.condition,
      budget: payload.budget,
      requirements: payload.requirements,
    }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`createRequirement failed: ${res.status} ${text}`);
  }
  return true;
}
