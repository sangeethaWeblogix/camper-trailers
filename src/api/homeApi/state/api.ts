const API_BASE = process.env.MPN_API_BASE;
const API_KEY = process.env.MPN_API_KEY; // ✅ Add this

export const fetchStateBasedCaravans = async () => {
  try {
    const res = await fetch(`${API_BASE}/by-state`, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
        ...(API_KEY && { "X-Secret-Key": API_KEY }),
      },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json?.states || [];
  } catch {
    return [];
  }
};
