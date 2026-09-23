const API_BASE = process.env.MPN_API_BASE;
 const API_KEY = process.env.MPN_API_KEY; // ✅ Add this

// MPN has no make_details-with-models-per-make equivalent — closest route is
// attribute-terms/make, a flat list of make names (no slugs). Adapted into
// the old { name, slug } shape callers expect.
export const fetchMakeDetails = async () => {
  try {
    const res = await fetch(`${API_BASE}/attribute-terms/make`, {
      headers: {
        Accept: "application/json",
        ...(API_KEY && { "X-Secret-Key": API_KEY }),
      },
    });
    if (!res.ok) return [];
    const raw = await res.text();
    const idx = raw.indexOf('{"');
    const json = JSON.parse(idx > 0 ? raw.substring(idx) : raw);
    const values: string[] = json?.values ?? [];
    return values.map((name) => ({ name, slug: name.trim().toLowerCase().replace(/\s+/g, "-") }));
  } catch {
    return [];
  }
};

// MPN's attribute-terms/model doesn't filter by make (tested live — the
// `make` param has no effect), unlike the old new-list?make= route. Returns
// every model regardless of the `make` argument; kept as a parameter so
// call sites don't need to change, but the per-make filtering is gone until
// the backend adds it.
export const fetchModelsByMake = async (make: string) => {
  let json: { values?: string[] };
  try {
    const res = await fetch(`${API_BASE}/attribute-terms/model`, {
      headers: {
        Accept: "application/json",
        ...(API_KEY && { "X-Secret-Key": API_KEY }),
      },
    });
    if (!res.ok) return [];
    const raw = await res.text();
    const idx = raw.indexOf('{"');
    json = JSON.parse(idx > 0 ? raw.substring(idx) : raw);
  } catch {
    return [];
  }
  const values = json?.values ?? [];
  return values.map((name) => ({
    name,
    slug: name.trim().toLowerCase().replace(/\s+/g, "-"),
  }));
};
