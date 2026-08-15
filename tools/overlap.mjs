/**
 * Text collision check.
 *
 *   node tools/overlap.mjs [path ...]
 *
 * Walks each route, hovers every interactive element and activates every
 * toggle, and after each interaction looks for text that has landed on top of
 * other text. Only leaf text elements are compared, and ancestor/descendant
 * pairs are ignored, so normal nesting is not reported.
 *
 * The hero deliberately sets type over its visualisation; that region is
 * excluded by name rather than by accident.
 */
import { chromium } from "playwright";

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
        "/disciplines/air",
        "/disciplines/moisture",
        "/disciplines/daylight",
        "/disciplines/energy",
        "/atlas",
        "/research",
        "/research/insulation-is-not-a-strategy",
        "/about",
        "/contact",
      ];

const DETECTOR = () => {
  // The fixed header is meant to float over content on an opaque bar, and the
  // hero deliberately sets type over its visualisation. Neither is a
  // collision; everything else is.
  const EXCLUDE = [
    "[data-hero-stage]",
    "[data-site-chrome='grid']",
    "[data-site-chrome='header']",
  ];

  const excluded = (el) => EXCLUDE.some((sel) => el.closest(sel));

  const leaves = [...document.querySelectorAll("body *")].filter((el) => {
    if (excluded(el)) return false;
    const style = getComputedStyle(el);
    if (
      style.visibility === "hidden" ||
      style.display === "none" ||
      Number(style.opacity) < 0.06
    )
      return false;
    // Leaf text: has a direct non-empty text node.
    const own = [...el.childNodes].some(
      (n) => n.nodeType === 3 && n.textContent.trim().length > 0,
    );
    if (!own) return false;
    const r = el.getBoundingClientRect();
    return r.width > 2 && r.height > 2 && r.bottom > 0 && r.top < innerHeight;
  });

  const hits = [];
  for (let i = 0; i < leaves.length; i++) {
    for (let j = i + 1; j < leaves.length; j++) {
      const a = leaves[i];
      const b = leaves[j];
      if (a.contains(b) || b.contains(a)) continue;

      const ra = a.getBoundingClientRect();
      const rb = b.getBoundingClientRect();
      const ox = Math.min(ra.right, rb.right) - Math.max(ra.left, rb.left);
      const oy = Math.min(ra.bottom, rb.bottom) - Math.max(ra.top, rb.top);
      if (ox <= 1 || oy <= 1) continue;

      // Ignore a hairline: adjacent text lines share a pixel or two of leading.
      if (ox * oy < 12) continue;

      hits.push({
        a: (a.textContent ?? "").trim().slice(0, 26),
        b: (b.textContent ?? "").trim().slice(0, 26),
        area: Math.round(ox * oy),
      });
    }
  }
  return hits;
};

const MOBILE = process.env.PECLET_VIEWPORT === "mobile";

const browser = await chromium.launch({ executablePath: CHROME });
const context = await browser.newContext({
  viewport: MOBILE ? { width: 390, height: 844 } : { width: 1440, height: 900 },
  deviceScaleFactor: MOBILE ? 3 : 1,
  isMobile: MOBILE,
  hasTouch: MOBILE,
  reducedMotion: "reduce",
});

let total = 0;

for (const route of ROUTES) {
  const page = await context.newPage();
  await page.goto(BASE + route, { waitUntil: "networkidle", timeout: 60000 });

  await page.evaluate(async () => {
    for (
      let y = 0;
      y < document.body.scrollHeight;
      y += window.innerHeight * 0.75
    ) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 90));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(700);

  const found = new Map();
  const record = (hits, state) => {
    for (const h of hits) {
      const key = `${h.a} ⨯ ${h.b}`;
      if (!found.has(key)) found.set(key, { ...h, state });
    }
  };

  record(await page.evaluate(DETECTOR), "rest");

  // Hover every interactive element, and press every toggle.
  const targets = await page
    .locator("a[href], button, label, input[type=range], [role=button]")
    .all();

  for (const target of targets.slice(0, 40)) {
    try {
      if (!(await target.isVisible())) continue;
      await target.scrollIntoViewIfNeeded({ timeout: 2000 });
      await target.hover({ timeout: 2000 });
      await page.waitForTimeout(90);
      record(await page.evaluate(DETECTOR), "hover");

      const tag = await target.evaluate((el) => el.tagName.toLowerCase());
      const isToggle = await target.evaluate(
        (el) =>
          el.tagName === "BUTTON" &&
          !el.getAttribute("aria-controls")?.includes("menu"),
      );
      if (tag === "button" && isToggle) {
        await target.click({ timeout: 2000 });
        await page.waitForTimeout(150);
        record(await page.evaluate(DETECTOR), "pressed");
      }
    } catch {
      /* element moved or is not hoverable — not what this check is about */
    }
  }

  const hits = [...found.values()].sort((a, b) => b.area - a.area);
  total += hits.length;
  console.log(
    `\n${route}  ${hits.length ? `⚠ ${hits.length} overlap(s)` : "✓ clean"}`,
  );
  for (const h of hits.slice(0, 8)) {
    console.log(`   [${h.state}] "${h.a}" ⨯ "${h.b}"  (${h.area}px²)`);
  }

  await page.close();
}

await browser.close();
console.log(`\n=== ${total} text overlaps across ${ROUTES.length} routes ===`);
