import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * Only the marketing page is worth indexing.
 *
 * Everything behind auth redirects to /sign-in for a crawler anyway, so listing
 * it wastes crawl budget and risks the sign-in page outranking the landing page
 * for brand queries.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard",
        "/recording",
        "/history",
        "/progress",
        "/sign-in",
        "/sign-up",
        "/api/",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
