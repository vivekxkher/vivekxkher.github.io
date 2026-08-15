/**
 * Lighthouse run against the production build.
 *
 *   npm run build && npm start   (on PORT 3100)
 *   node tools/lighthouse.mjs [path ...]
 *
 * Uses the locally installed Chrome. Reports the four category scores plus any
 * audit that actually failed, so the output says what to fix rather than just
 * how it scored.
 */
import lighthouse from "lighthouse";
import { spawn } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE = process.env.PECLET_BASE ?? "http://localhost:3100";
const PORT = 9222;

const ROUTES =
  process.argv.slice(2).length > 0
    ? process.argv.slice(2)
    : ["/", "/disciplines/solar", "/atlas", "/work"];

const profile = mkdtempSync(join(tmpdir(), "peclet-lh-"));
const chrome = spawn(CHROME, [
  `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${profile}`,
  "--headless=new",
  "--no-first-run",
  "--disable-extensions",
  "--disable-gpu",
]);

await new Promise((resolve) => setTimeout(resolve, 3500));

const results = [];

for (const route of ROUTES) {
  const runnerResult = await lighthouse(
    BASE + route,
    { port: PORT, output: "json", logLevel: "error" },
    {
      extends: "lighthouse:default",
      settings: {
        formFactor: "desktop",
        screenEmulation: {
          mobile: false,
          width: 1440,
          height: 900,
          deviceScaleFactor: 1,
          disabled: false,
        },
        throttling: {
          rttMs: 40,
          throughputKbps: 10 * 1024,
          cpuSlowdownMultiplier: 1,
        },
      },
    },
  );

  const lhr = runnerResult.lhr;
  const scores = Object.fromEntries(
    Object.entries(lhr.categories).map(([key, value]) => [
      key,
      Math.round((value.score ?? 0) * 100),
    ]),
  );

  const failed = Object.values(lhr.audits)
    .filter(
      (audit) =>
        audit.score !== null &&
        audit.score < 0.9 &&
        audit.scoreDisplayMode !== "informative" &&
        audit.scoreDisplayMode !== "notApplicable",
    )
    .map((audit) => `${audit.id} (${Math.round((audit.score ?? 0) * 100)})`);

  results.push({ route, scores, failed, metrics: {
    fcp: lhr.audits["first-contentful-paint"].displayValue,
    lcp: lhr.audits["largest-contentful-paint"].displayValue,
    cls: lhr.audits["cumulative-layout-shift"].displayValue,
    tbt: lhr.audits["total-blocking-time"].displayValue,
  } });
}

chrome.kill();
try {
  rmSync(profile, { recursive: true, force: true });
} catch {
  /* the profile directory is disposable */
}

for (const r of results) {
  console.log(`\n${r.route}`);
  console.log(
    `  perf ${r.scores.performance}  a11y ${r.scores.accessibility}  best-practices ${r.scores["best-practices"]}  seo ${r.scores.seo}`,
  );
  console.log(
    `  FCP ${r.metrics.fcp} · LCP ${r.metrics.lcp} · CLS ${r.metrics.cls} · TBT ${r.metrics.tbt}`,
  );
  if (r.failed.length) console.log(`  below 90: ${r.failed.join(", ")}`);
}
