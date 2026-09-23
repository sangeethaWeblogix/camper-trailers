const BASE = process.env.MPN_API_BASE;
const API_KEY = process.env.MPN_API_KEY;
export type BlogDetail = {
  slug: string;
  title: string;
  date?: string;
  image?: string; // hero image
  excerpt?: string;
  content_html?: string; // full HTML body
  seo?: { metatitle?: string; metadescription?: string; index?: string };
};

export async function fetchBlogDetail(
  slug: string
): Promise<BlogDetail | null> {
  if (!slug) return null;
  const res = await fetch(
    `${BASE}/blog-detail-new/?slug=${encodeURIComponent(slug)}`,
    {
      headers: {
        Accept: "application/json",
        ...(API_KEY && { "X-Secret-Key": API_KEY }), // ✅ API key added
      },
      // cache strategy: tweak as you like
      cache: "no-store",

    }
  );
  if (!res.ok) return null;
  const data = await res.json();
  // Some APIs wrap in {data: {...}} — unwrap if needed
  return (data?.data ?? data) as BlogDetail;
}
