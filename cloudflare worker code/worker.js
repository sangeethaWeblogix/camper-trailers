/**
 * CFS Cloudflare Worker - Pass-through
 *
 * All caching (image cache, JSON pool cache, KV static HTML cache, routes-mapping,
 * stale-while-revalidate) has been removed. Every request is forwarded straight to
 * the origin (Vercel).
 */

export default {
  async fetch(request) {
    return fetch(request);
  }
};
