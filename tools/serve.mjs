/**
 * Serves the exported site from `out/` so it can be checked before upload.
 *
 *   node tools/serve.mjs [port]
 *
 * Deliberately dependency-free, and deliberately dumb: it resolves paths the
 * way a plain static host does, so anything that only works because a dev
 * server was clever will fail here too — which is the point.
 */
import { createServer } from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { join, extname, normalize } from "node:path";

const ROOT = join(process.cwd(), "out");
const PORT = Number(process.argv[2] ?? 4173);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".mp4": "video/mp4",
  ".woff2": "font/woff2",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
};

if (!existsSync(ROOT)) {
  console.error("No `out/` folder. Run `npm run build` first.");
  process.exit(1);
}

const resolve = (urlPath) => {
  // Strip the query, decode, and refuse to climb out of the root.
  const clean = decodeURIComponent(urlPath.split("?")[0]);
  const safe = normalize(clean).replace(/^(\.\.[/\\])+/, "");
  let file = join(ROOT, safe);

  if (existsSync(file) && statSync(file).isDirectory()) {
    file = join(file, "index.html");
  }
  if (existsSync(file)) return file;

  // A host that does not rewrite extensionless URLs still finds these.
  for (const candidate of [`${file}.html`, join(file, "index.html")]) {
    if (existsSync(candidate)) return candidate;
  }
  return null;
};

createServer((req, res) => {
  const file = resolve(req.url ?? "/");

  if (!file) {
    const notFound = join(ROOT, "404.html");
    res.writeHead(404, { "Content-Type": TYPES[".html"] });
    if (existsSync(notFound)) return createReadStream(notFound).pipe(res);
    return res.end("404");
  }

  res.writeHead(200, {
    "Content-Type": TYPES[extname(file)] ?? "application/octet-stream",
    "Cache-Control": "no-cache",
  });
  createReadStream(file).pipe(res);
}).listen(PORT, () => {
  console.log(`Exported site: http://localhost:${PORT}`);
});
