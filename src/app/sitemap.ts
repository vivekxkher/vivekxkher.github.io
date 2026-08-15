import type { MetadataRoute } from "next";
import { disciplines } from "@/content/disciplines";
import { projects } from "@/content/projects";
import { research } from "@/content/research";
import { site } from "@/content/site";

/** Written to a file at build time — the site exports as static HTML. */
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = new URL(site.url).origin;
  const now = new Date();

  /**
   * Trailing slashes, to match `trailingSlash: true` in the Next config.
   * A sitemap that lists a different URL from the one the site serves invites
   * a duplicate-content reading, so the two have to agree.
   */
  const url = (path: string) => `${base}${path}`;

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: url("/"), priority: 1, changeFrequency: "monthly" },
    { url: url("/work/"), priority: 0.9, changeFrequency: "monthly" },
    { url: url("/disciplines/"), priority: 0.9, changeFrequency: "monthly" },
    { url: url("/atlas/"), priority: 0.9, changeFrequency: "monthly" },
    { url: url("/research/"), priority: 0.8, changeFrequency: "weekly" },
    { url: url("/about/"), priority: 0.6, changeFrequency: "yearly" },
    { url: url("/contact/"), priority: 0.6, changeFrequency: "yearly" },
  ];

  return [
    ...staticRoutes,
    ...disciplines.map((d) => ({
      url: url(`/disciplines/${d.slug}/`),
      priority: 0.7,
      changeFrequency: "monthly" as const,
    })),
    ...projects.map((p) => ({
      url: url(`/work/${p.slug}/`),
      priority: 0.7,
      changeFrequency: "monthly" as const,
    })),
    ...research.map((r) => ({
      url: url(`/research/${r.slug}/`),
      priority: 0.6,
      changeFrequency: "monthly" as const,
    })),
  ].map((entry) => ({ ...entry, lastModified: now }));
}
