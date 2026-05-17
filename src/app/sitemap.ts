import type { MetadataRoute } from "next";
import { guidePages, industryPages, site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: site.url,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${site.url}/pilot`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...industryPages.map((page) => ({
      url: `${site.url}/industries/${page.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...guidePages.map((page) => ({
      url: `${site.url}/guides/${page.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
