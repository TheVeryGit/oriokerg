import type { MetadataRoute } from "next";

import { getCats, getKittens } from "@/lib/content";

const BASE = "https://oriokerg.ru";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages = [
    { path: "/", priority: 1.0, changeFrequency: "weekly" as const },
    { path: "/kittens", priority: 0.9, changeFrequency: "daily" as const },
    { path: "/cats", priority: 0.7, changeFrequency: "weekly" as const },
    { path: "/breed", priority: 0.6, changeFrequency: "monthly" as const },
    { path: "/about", priority: 0.5, changeFrequency: "monthly" as const },
    { path: "/contacts", priority: 0.6, changeFrequency: "monthly" as const },
    { path: "/faq", priority: 0.5, changeFrequency: "monthly" as const },
    { path: "/privacy", priority: 0.2, changeFrequency: "yearly" as const },
  ];

  const pages: MetadataRoute.Sitemap = staticPages.map((p) => ({
    url: p.path === "/" ? `${BASE}/` : `${BASE}${p.path}/`,
    lastModified: now,
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }));

  for (const kitten of getKittens()) {
    pages.push({
      url: `${BASE}/kittens/${encodeURIComponent(kitten.slug)}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  for (const cat of getCats()) {
    pages.push({
      url: `${BASE}/cats/${encodeURIComponent(cat.slug)}/`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  return pages;
}
