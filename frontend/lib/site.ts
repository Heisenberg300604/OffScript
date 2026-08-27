/**
 * Canonical public origin, used by robots.ts, sitemap.ts and metadata.
 *
 * Resolution order:
 *   1. NEXT_PUBLIC_SITE_URL — set this once you have a real domain.
 *   2. VERCEL_PROJECT_PRODUCTION_URL — Vercel's stable production hostname,
 *      which stays correct across preview deploys (unlike VERCEL_URL, which is
 *      unique per deployment and would put preview URLs in the sitemap).
 *   3. localhost for development.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;

  return "http://localhost:3000";
}

export const SITE_URL = resolveSiteUrl();

export const SITE_NAME = "OffScript";

export const SITE_DESCRIPTION =
  "Practice speaking every day with unexpected topics. Research, think, speak, and build confidence one challenge at a time.";
