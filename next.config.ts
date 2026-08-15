import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /*
   * Static export. Nothing on this site needs a server — no API routes, no
   * server actions, no request-time rendering — so `next build` writes a plain
   * folder of HTML, CSS, JS and images to `out/`. That uploads to any host,
   * costs nothing to run, and cannot break at 3am.
   *
   * `trailingSlash` makes every route a directory with an index.html inside
   * (`out/work/index.html`), which is the form the widest range of hosts serve
   * correctly — including plain Apache and cPanel, which will not rewrite
   * `/work` to `work.html` on their own.
   */
  output: "export",
  trailingSlash: true,
  reactStrictMode: true,
  poweredByHeader: false,
  // The dev badge sits over the bottom-left corner, which is exactly where the
  // social cards and the hero readouts get screenshotted.
  devIndicators: false,
  images: {
    // A static export has no image optimiser behind it.
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
    deviceSizes: [420, 640, 828, 1080, 1280, 1600, 1920, 2560],
  },
  experimental: {
    optimizePackageImports: ["gsap", "three"],
  },
};

export default nextConfig;
