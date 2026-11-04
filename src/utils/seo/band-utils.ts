// Edge-runtime-safe: no fs, path, or process.cwd()

// Kept in sync with the backend's own /sitemap/price — was a stale,
// hand-maintained guess (including bands like "under-300000" the backend has
// never indexed, and missing most of its real "over-X" values), so pages the
// backend genuinely lists were being marked noindex by this site. See the
// matching note on ATM/LENGTH below — same root cause for all three.
export const PRICE_BANDS_ORDERED = [
  "under-20000",
  "under-30000",
  "under-40000",
  "under-50000",
  "under-60000",
  "under-70000",
  "under-80000",
  "under-90000",
  "under-100000",
  "under-125000",
  "under-150000",
  "under-175000",
  "under-200000",
  "between-20000-30000",
  "between-30000-40000",
  "between-40000-50000",
  "between-50000-60000",
  "between-60000-70000",
  "between-70000-80000",
  "between-80000-90000",
  "between-90000-100000",
  "between-125000-150000",
  "between-150000-175000",
  "between-175000-200000",
  "over-20000",
  "over-30000",
  "over-40000",
  "over-50000",
  "over-60000",
  "over-70000",
  "over-80000",
  "over-90000",
  "over-100000",
  "over-125000",
  "over-150000",
  "over-175000",
];

// Kept in sync with the backend's own /sitemap/atm.
export const ATM_BANDS_ORDERED = [
  "under-1000-kg-atm",
  "under-1250-kg-atm",
  "under-1500-kg-atm",
  "under-1750-kg-atm",
  "under-2000-kg-atm",
  "under-2250-kg-atm",
  "under-2500-kg-atm",
  "under-2750-kg-atm",
  "under-3000-kg-atm",
  "under-3500-kg-atm",
  "between-1000-kg-1250-kg-atm",
  "between-1250-kg-1500-kg-atm",
  "between-1500-kg-1750-kg-atm",
  "between-1750-kg-2000-kg-atm",
  "between-2000-kg-2250-kg-atm",
  "between-2250-kg-2500-kg-atm",
  "between-2500-kg-2750-kg-atm",
  "between-2750-kg-3000-kg-atm",
  "between-3000-kg-3500-kg-atm",
  "over-1000-kg-atm",
  "over-1250-kg-atm",
  "over-1500-kg-atm",
  "over-1750-kg-atm",
  "over-2000-kg-atm",
  "over-2250-kg-atm",
  "over-2500-kg-atm",
  "over-2750-kg-atm",
  "over-3000-kg-atm",
];

export const SLEEP_BANDS_ORDERED = [
  "under-2-people-sleeping-capacity",
  "between-2-2-people-sleeping-capacity",
  "under-3-people-sleeping-capacity",
  "between-3-3-people-sleeping-capacity",
  "under-4-people-sleeping-capacity",
  "between-4-4-people-sleeping-capacity",
  "under-5-people-sleeping-capacity",
  "between-5-5-people-sleeping-capacity",
  "between-6-6-people-sleeping-capacity",
  "over-5-people-sleeping-capacity",
];

// Kept in sync with the backend's own /sitemap/length (note "between-23-24"
// is genuinely absent from the backend's data, not an omission here).
export const LENGTH_BANDS_ORDERED = [
  "under-12-length-in-feet",
  "under-13-length-in-feet",
  "under-14-length-in-feet",
  "under-15-length-in-feet",
  "under-16-length-in-feet",
  "under-17-length-in-feet",
  "under-18-length-in-feet",
  "under-19-length-in-feet",
  "under-20-length-in-feet",
  "under-21-length-in-feet",
  "under-22-length-in-feet",
  "under-23-length-in-feet",
  "under-24-length-in-feet",
  "under-25-length-in-feet",
  "under-26-length-in-feet",
  "under-27-length-in-feet",
  "under-28-length-in-feet",
  "between-12-13-length-in-feet",
  "between-13-14-length-in-feet",
  "between-14-15-length-in-feet",
  "between-15-16-length-in-feet",
  "between-16-17-length-in-feet",
  "between-17-18-length-in-feet",
  "between-18-19-length-in-feet",
  "between-19-20-length-in-feet",
  "between-20-21-length-in-feet",
  "between-21-22-length-in-feet",
  "between-22-23-length-in-feet",
  "between-24-25-length-in-feet",
  "between-25-26-length-in-feet",
  "over-12-length-in-feet",
  "over-13-length-in-feet",
  "over-14-length-in-feet",
  "over-15-length-in-feet",
  "over-16-length-in-feet",
  "over-17-length-in-feet",
  "over-18-length-in-feet",
  "over-19-length-in-feet",
  "over-20-length-in-feet",
  "over-21-length-in-feet",
  "over-22-length-in-feet",
  "over-23-length-in-feet",
  "over-24-length-in-feet",
  "over-25-length-in-feet",
];

export const ALLOWED_PRICE_BANDS  = new Set(PRICE_BANDS_ORDERED);
export const ALLOWED_ATM_BANDS    = new Set(ATM_BANDS_ORDERED);
export const ALLOWED_SLEEP_BANDS  = new Set(SLEEP_BANDS_ORDERED);
export const ALLOWED_LENGTH_BANDS = new Set(LENGTH_BANDS_ORDERED);

export function isAllowedSingleBand(slugSegments: string[]): boolean {
  const price  = slugSegments.find(s => /^(under|over)-\d+$/.test(s) || /^between-\d+-\d+$/.test(s));
  const atm    = slugSegments.find(s => s.includes("-kg-atm"));
  const sleep  = slugSegments.find(s => s.includes("-people-sleeping-capacity"));
  const length = slugSegments.find(s => s.includes("-length-in-feet"));
  if (price)  return ALLOWED_PRICE_BANDS.has(price);
  if (atm)    return ALLOWED_ATM_BANDS.has(atm);
  if (sleep)  return ALLOWED_SLEEP_BANDS.has(sleep);
  if (length) return ALLOWED_LENGTH_BANDS.has(length);
  return false;
}
