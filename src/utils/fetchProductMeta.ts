import { cache } from "react";

export interface ProductMeta {
  title: string;
  description: string;
  canonical: string;
  ogImage: string;
}

export const fetchProductMeta = cache(async (slug: string): Promise<ProductMeta> => {
  const API_BASE = process.env.MPN_API_BASE!;
  const API_KEY = process.env.MPN_API_KEY;
  const empty: ProductMeta = { title: "", description: "", canonical: "", ogImage: "" };
  try {
    const res = await fetch(
      `${API_BASE}/${encodeURIComponent(slug)}`,
      {
        cache: "no-store",
        headers: {
          Accept: "application/json",
          ...(API_KEY && { "X-Secret-Key": API_KEY }),
        },
      }
    );
    if (!res.ok) return empty;
    const raw = await res.text();
    const idx = raw.indexOf('{"');
    // MPN /{slug} returns a flat listing object (title, seo_title,
    // seo_description, images_full, ...) — no more data.product_details nesting.
    const pd = JSON.parse(idx >= 0 ? raw.substring(idx) : raw);
    const title = pd.seo_title || pd.title || "";
    const description = pd.seo_description || "";
    const canonical = `https://www.campingtrailersforsale.com.au/product/${slug}/`;
    const rawImages: string[] = pd.r2_thumbnails ?? pd.images_full ?? pd.images ?? [];
    const ogImage: string = rawImages.filter(Boolean)[0];
    const ogImageFull = ogImage ? (/^https?:\/\//.test(ogImage) ? ogImage : `https://${ogImage}`) : "";
    return { title, description, canonical, ogImage: ogImageFull };
  } catch {
    return empty;
  }
});
