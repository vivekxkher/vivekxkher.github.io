/**
 * Post-processes `out/` after `next build`.
 *
 * Next 16's static export writes its navigation payloads as nested folders:
 *
 *   out/work/__next.work/__PAGE__.txt
 *
 * but the client prefetcher requests them as one flat filename, with the path
 * segments joined by dots:
 *
 *   /work/__next.work.__PAGE__.txt
 *
 * so every link hover 404s on a static host. Navigation still works — Next
 * falls back to a full page load — but the prefetch is wasted and the server
 * log fills with misses.
 *
 * This writes the flat filename alongside the nested one. The originals are
 * left in place: they cost little and nothing is gained by guessing which form
 * a future Next version will ask for.
 */
import {
  readdirSync,
  statSync,
  copyFileSync,
  existsSync,
} from "node:fs";
import { join, relative, sep } from "node:path";

const OUT = join(process.cwd(), "out");

if (!existsSync(OUT)) {
  console.error("postexport: no `out/` folder — did `next build` run?");
  process.exit(1);
}

let written = 0;

/** Every file beneath `dir`, as paths relative to it. */
function filesUnder(dir) {
  const found = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      found.push(...filesUnder(full).map((f) => join(entry, f)));
    } else {
      found.push(entry);
    }
  }
  return found;
}

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (!statSync(full).isDirectory()) continue;

    if (entry.startsWith("__next.")) {
      // Flatten this payload folder into sibling files.
      for (const rel of filesUnder(full)) {
        const flat = `${entry}.${rel.split(sep).join(".")}`;
        const dest = join(dir, flat);
        if (!existsSync(dest)) {
          copyFileSync(join(full, rel), dest);
          written++;
        }
      }
      continue; // no payload folders nested inside payload folders
    }

    walk(full);
  }
}

walk(OUT);

console.log(
  `postexport: wrote ${written} flattened navigation payload${
    written === 1 ? "" : "s"
  } into ${relative(process.cwd(), OUT)}/`,
);
