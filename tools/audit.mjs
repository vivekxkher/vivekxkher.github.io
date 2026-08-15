/**
 * Accessibility audit.
 *
 *   node tools/audit.mjs [path ...]
 *
 * Runs axe-core against each route in the locally installed Chrome, then adds
 * a few checks axe cannot make on its own: heading order, keyboard focus
 * order, and whether every focused element actually shows a focus ring.
 */
import { chromium } from "playwright";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const axeSource = readFileSync(require.resolve("axe-core"), "utf8");

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE = process.env.PECLET_BASE ?? "http://localhost:3000";

const ROUTES =
  process.argv.slice(2).length > 0
    ? process.argv.slice(2)
    : [
        "/",
        "/work",
        "/work/composite-summer-section",
        "/disciplines",
        "/disciplines/thermal",
        "/disciplines/solar",
        "/disciplines/energy",
        "/atlas",
        "/research",
        "/research/insulation-is-not-a-strategy",
        "/about",
        "/contact",
      ];

const browser = await chromium.launch({ executablePath: CHROME });
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  colorScheme: "dark",
});

let totalViolations = 0;
const report = [];

for (const route of ROUTES) {
  const page = await context.newPage();
  await page.goto(BASE + route, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(1200);

  await page.addScriptTag({ content: axeSource });

  const results = await page.evaluate(async () => {
    // Canvases are decorative and carry their equivalent in prose; the colour
    // checker cannot read them and would only produce noise.
    return await window.axe.run(document, {
      resultTypes: ["violations"],
      rules: { "color-contrast": { enabled: true } },
    });
  });

  // Heading order — axe checks some of this, but not the document outline.
  const headings = await page.evaluate(() =>
    [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].map((h) => ({
      level: Number(h.tagName[1]),
      text: (h.textContent ?? "").trim().slice(0, 50),
    })),
  );

  const outlineProblems = [];
  let previous = 0;
  headings.forEach((h, i) => {
    if (i === 0 && h.level !== 1) outlineProblems.push(`starts at h${h.level}`);
    if (previous && h.level > previous + 1)
      outlineProblems.push(`h${previous} → h${h.level} at "${h.text}"`);
    previous = h.level;
  });
  const h1Count = headings.filter((h) => h.level === 1).length;
  if (h1Count !== 1) outlineProblems.push(`${h1Count} h1 elements`);

  // Keyboard: actually press Tab. `:focus-visible` only matches on a real
  // keyboard focus, so programmatic .focus() cannot be used to test for it.
  const focus = [];
  await page.evaluate(() => document.body.focus());
  for (let i = 0; i < 24; i++) {
    await page.keyboard.press("Tab");
    const stop = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      const style = getComputedStyle(el);
      const ring =
        (style.outlineStyle !== "none" && parseFloat(style.outlineWidth) > 0) ||
        style.boxShadow !== "none";
      return {
        tag: el.tagName.toLowerCase(),
        label: (
          el.getAttribute("aria-label") ||
          el.textContent ||
          el.getAttribute("id") ||
          ""
        )
          .trim()
          .slice(0, 34),
        ring,
        offscreen: el.getBoundingClientRect().width === 0,
      };
    });
    if (stop) focus.push(stop);
  }

  const noRing = focus.filter((f) => !f.ring && !f.offscreen);

  totalViolations += results.violations.length;
  report.push({
    route,
    violations: results.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      nodes: v.nodes.length,
      help: v.help,
      targets: v.nodes
        .slice(0, 8)
        .map((n) => `${n.target.join(" ")} :: ${n.failureSummary?.split("\n")[1]?.trim() ?? ""}`),
    })),
    headings: headings.length,
    outlineProblems,
    focusStops: focus.length,
    focusWithoutRing: noRing.map((f) => `${f.tag} "${f.label}"`),
  });

  await page.close();
}

await browser.close();

for (const entry of report) {
  const flags = [
    entry.violations.length ? `${entry.violations.length} axe` : null,
    entry.outlineProblems.length ? `${entry.outlineProblems.length} outline` : null,
    entry.focusWithoutRing.length ? `${entry.focusWithoutRing.length} no-ring` : null,
  ].filter(Boolean);

  console.log(
    `\n${entry.route}  ${flags.length ? "⚠ " + flags.join(", ") : "✓ clean"}  (${entry.headings} headings, ${entry.focusStops} focus stops)`,
  );
  for (const v of entry.violations) {
    console.log(`   [${v.impact}] ${v.id} ×${v.nodes} — ${v.help}`);
    for (const t of v.targets) console.log(`      ${t}`);
  }
  for (const p of entry.outlineProblems) console.log(`   outline: ${p}`);
  for (const f of entry.focusWithoutRing) console.log(`   no focus ring: ${f}`);
}

console.log(`\n=== ${totalViolations} axe violations across ${report.length} routes ===`);
