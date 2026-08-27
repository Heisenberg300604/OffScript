import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * V1 has exactly one public, indexable page. Authenticated routes are
 * per-user and gated, so they are deliberately absent — a sitemap should only
 * list URLs a crawler can actually fetch and render.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
