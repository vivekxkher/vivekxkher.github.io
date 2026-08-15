import type { MetadataRoute } from "next";
import { site } from "@/content/site";

/** Written to a file at build time — the site exports as static HTML. */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const base = new URL(site.url).origin;

  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
