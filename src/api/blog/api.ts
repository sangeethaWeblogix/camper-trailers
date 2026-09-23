const API_BASE = process.env.MPN_API_BASE;
const API_KEY = process.env.MPN_API_KEY; // ✅ Add this

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  link: string;
  image: string;
  slug: string;
  date: string;
}

export interface BlogApiResponse {
  // MPN shape: { success, data: BlogPost[], meta: {total, page, per_page, total_pages, seed} }
  success?: boolean;
  data?: BlogPost[] | { latest_blog_posts?: { items: BlogPost[]; current_page?: number; total_pages?: number } };
  meta?: { total?: number; page?: number; per_page?: number; total_pages?: number };
}

export type BlogPageResult = {
  items: BlogPost[];
  currentPage: number;
  totalPages: number;
  total_pages: number;
  error?: boolean;
};

const FETCH_TIMEOUT_MS = 8000;
const MAX_ATTEMPTS = 3;

const fetchWithTimeout = async (url: string) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    return await fetch(url, {
      headers: {
        Accept: "application/json",
        ...(API_KEY && { "X-Secret-Key": API_KEY }), // ✅ API key added
      },
      cache: "no-store",
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
};

export const fetchBlogs = async (page: number = 1): Promise<BlogPageResult> => {
  if (!API_BASE) {
    console.error("❌ CFS_API_BASE env missing"); // ✅ Server log
    return { items: [], currentPage: page, totalPages: 1, total_pages: 1, error: true };
  }

  const url = `${API_BASE}/blog?page=${page}`;

  let lastErr: unknown;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    console.log(`[Blog API] GET ${url} (attempt ${attempt}/${MAX_ATTEMPTS})`); // ✅ Server terminal-ல் தெரியும்
    try {
      const res = await fetchWithTimeout(url);

      if (!res.ok) {
        console.error(`❌ Blog API failed: ${res.status} (attempt ${attempt}/${MAX_ATTEMPTS})`);
        lastErr = new Error(`Blog API status ${res.status}`);
        continue;
      }

      const raw = await res.text();
      const idx = raw.indexOf('{"');
      const data = JSON.parse(idx >= 0 ? raw.substring(idx) : raw) as BlogApiResponse;

      // MPN returns a flat array under `data` + pagination under `meta`;
      // older shape nested items under `data.latest_blog_posts` — support both.
      const items: BlogPost[] = Array.isArray(data?.data)
        ? data.data
        : (data?.data as { latest_blog_posts?: { items: BlogPost[] } })?.latest_blog_posts?.items ?? [];
      const currentPage = data?.meta?.page ?? (data?.data as { latest_blog_posts?: { current_page?: number } })?.latest_blog_posts?.current_page ?? page;
      const totalPages = data?.meta?.total_pages ?? (data?.data as { latest_blog_posts?: { total_pages?: number } })?.latest_blog_posts?.total_pages ?? 1;

      return {
        items,
        currentPage,
        totalPages,
        total_pages: totalPages,
      };
    } catch (err) {
      console.error(`❌ fetchBlogs error (attempt ${attempt}/${MAX_ATTEMPTS}):`, err);
      lastErr = err;
    }
  }

  console.error("❌ fetchBlogs: all attempts failed", lastErr);
  return { items: [], currentPage: page, totalPages: 1, total_pages: 1, error: true };
};