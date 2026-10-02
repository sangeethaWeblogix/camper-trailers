import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const MPN_API_BASE = process.env.MPN_API_BASE;
const MPN_API_KEY = process.env.MPN_API_KEY;
const SITE_URL = "https://www.campingtrailersforsale.com.au/listings/";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = "sangeethaWeblogix";
const GITHUB_REPO = "camper-trailers";
const GITHUB_BRANCH = "main";

/**
 * Regenerates src/app/url.csv and cfs-paths/indexable-urls.json from the
 * live MPN sitemap API, then commits both straight to `main` via the GitHub
 * Contents API — a Vercel serverless function's filesystem is read-only and
 * ephemeral, so it can't just write these git-tracked files directly; the
 * commit is what actually persists the change (and triggers a redeploy that
 * bakes the fresh files into the next build).
 *
 * Scheduled via vercel.json "crons". Requires:
 *  - CRON_SECRET (Vercel sets the `Authorization: Bearer <CRON_SECRET>`
 *    header automatically on scheduled invocations once this env var exists)
 *  - GITHUB_TOKEN with `contents:write` on this repo (already used for
 *    production error reporting in src/lib/reportGitHubIssue.ts — same token,
 *    just needs that extra permission)
 *
 * "listings" is intentionally excluded (that sitemap type is /product/{slug}
 * pages, not /listings/ pages) and so is "vehicle-makes" (currently broken
 * server-side, and not needed for this site — confirmed with the user).
 */
const SITEMAP_TYPES = [
  "base", "states", "regions", "makes", "models",
  "state-make", "region-make", "category-state", "category-region",
  "length", "atm", "price", "categories",
];

async function fetchSitemapType(type: string): Promise<string[]> {
  try {
    const res = await fetch(`${MPN_API_BASE}/sitemap/${type}?min_count=1`, {
      headers: {
        Accept: "application/json",
        ...(MPN_API_KEY && { "X-Secret-Key": MPN_API_KEY }),
      },
      cache: "no-store",
    });
    if (!res.ok) return [];
    const json = await res.json();
    if (!json?.success || !Array.isArray(json.paths)) return [];
    return json.paths as string[];
  } catch {
    return [];
  }
}

async function githubGetFileSha(path: string): Promise<string | undefined> {
  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}?ref=${GITHUB_BRANCH}`,
    { headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: "application/vnd.github+json" } }
  );
  if (!res.ok) return undefined;
  const json = await res.json();
  return json.sha as string;
}

async function githubPutFile(path: string, content: string, message: string): Promise<boolean> {
  const sha = await githubGetFileSha(path);
  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        content: Buffer.from(content, "utf-8").toString("base64"),
        branch: GITHUB_BRANCH,
        ...(sha && { sha }),
      }),
    }
  );
  return res.ok;
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!MPN_API_BASE) {
    return NextResponse.json({ error: "MPN_API_BASE not configured" }, { status: 500 });
  }
  if (!GITHUB_TOKEN) {
    return NextResponse.json({ error: "GITHUB_TOKEN not configured" }, { status: 500 });
  }

  try {
    const results = await Promise.all(SITEMAP_TYPES.map(fetchSitemapType));

    const seen = new Set<string>();
    const urls: string[] = [];
    results.forEach((paths) => {
      for (const path of paths) {
        const url = SITE_URL + path;
        if (!seen.has(url)) {
          seen.add(url);
          urls.push(url);
        }
      }
    });
    urls.sort();

    if (urls.length === 0) {
      return NextResponse.json({ error: "Sitemap API returned zero URLs — aborting to avoid wiping url.csv" }, { status: 502 });
    }

    // url.csv — ID\tURL, tab-separated (matches the format every reader expects).
    const csvLines = ["ID\tURL", ...urls.map((url, i) => `${i + 1}\t${url}`)];
    const csvContent = csvLines.join("\n") + "\n";

    // indexable-urls.json — client-safe snapshot, same normalization as
    // src/utils/seo/indexable-urls.ts (ensure trailing slash, strip origin).
    const ORIGIN = "https://www.campingtrailersforsale.com.au";
    const jsonPaths = urls.map((url) => {
      let p = url.startsWith(ORIGIN) ? url.slice(ORIGIN.length) : url;
      if (!p.endsWith("/")) p += "/";
      return p;
    });
    const jsonContent = JSON.stringify(jsonPaths);

    const today = new Date().toISOString().split("T")[0];
    const [csvOk, jsonOk] = await Promise.all([
      githubPutFile("src/app/url.csv", csvContent, `chore: sync url.csv from live sitemap (${today})`),
      githubPutFile("cfs-paths/indexable-urls.json", jsonContent, `chore: sync indexable-urls.json from live sitemap (${today})`),
    ]);

    return NextResponse.json({
      success: csvOk && jsonOk,
      totalUrls: urls.length,
      csvCommitted: csvOk,
      jsonCommitted: jsonOk,
    });
  } catch (error) {
    console.error("[sync-listings-sitemap] error:", error);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}
