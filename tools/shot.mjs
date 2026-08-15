/**
 * Visual QA harness.
 *
 *   node tools/shot.mjs <path> [preset] [scrollFraction] [--wait=ms] [--motion=reduce]
 *
 * Drives the locally installed Chrome through Playwright and writes a PNG to
 * tools/shots/. Used throughout the build to check real rendered output at
 * exact viewports rather than guessing.
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE = process.env.PECLET_BASE ?? "http://localhost:3000";

const PRESETS = {
  desktop: { width: 1440, height: 900, dsf: 1 },
  wide: { width: 1728, height: 1000, dsf: 1 },
  laptop: { width: 1280, height: 800, dsf: 1 },
  tablet: { width: 834, height: 1112, dsf: 2 },
  mobile: { width: 390, height: 844, dsf: 3 },
};

const [, , rawPath = "/", presetName = "desktop", rawScroll = "0", ...flags] =
  process.argv;

const preset = PRESETS[presetName] ?? PRESETS.desktop;
const scroll = Number(rawScroll) || 0;
const waitFlag = flags.find((f) => f.startsWith("--wait="));
const settle = waitFlag ? Number(waitFlag.split("=")[1]) : 2600;
const reduceMotion = flags.includes("--motion=reduce");
const fullPage = flags.includes("--full");

const outDir = resolve(process.cwd(), "tools/shots");
mkdirSync(outDir, { recursive: true });

const slug =
  (rawPath === "/" ? "home" : rawPath.replace(/^\//, "").replace(/\//g, "-")) +
  `-${presetName}` +
  (scroll ? `-s${Math.round(scroll * 100)}` : "") +
  (reduceMotion ? "-reduced" : "");
const outFile = resolve(outDir, `${slug}.png`);

const browser = await chromium.launch({
  executablePath: CHROME,
  args: ["--enable-gpu", "--use-gl=angle", "--enable-unsafe-swiftshader"],
});

const context = await browser.newContext({
  viewport: { width: preset.width, height: preset.height },
  deviceScaleFactor: preset.dsf,
  isMobile: presetName === "mobile",
  hasTouch: presetName === "mobile" || presetName === "tablet",
  reducedMotion: reduceMotion ? "reduce" : "no-preference",
  colorScheme: "dark",
});

const page = await context.newPage();

const consoleIssues = [];
page.on("console", (msg) => {
  if (msg.type() === "error" || msg.type() === "warning") {
    consoleIssues.push(`[${msg.type()}] ${msg.text()}`);
  }
});
page.on("pageerror", (err) => consoleIssues.push(`[pageerror] ${err.message}`));

await page.goto(BASE + rawPath, { waitUntil: "networkidle", timeout: 60000 });

// Nudge the pointer so hover-driven visualisations wake up.
if (!reduceMotion) {
  await page.mouse.move(preset.width * 0.32, preset.height * 0.42);
  await page.mouse.move(preset.width * 0.38, preset.height * 0.5, {
    steps: 12,
  });
}

if (fullPage) {
  // Scroll-reveals only fire for elements that have been on screen. Walk the
  // page once so a full-page capture shows what a reader would actually see.
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.8;
    const max = document.documentElement.scrollHeight;
    for (let y = 0; y < max; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(700);
}

if (scroll > 0) {
  await page.evaluate((frac) => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: max * frac, behavior: "auto" });
  }, scroll);
}

await page.waitForTimeout(settle);

const metrics = await page.evaluate(() => ({
  scrollW: document.documentElement.scrollWidth,
  innerW: window.innerWidth,
  scrollH: document.documentElement.scrollHeight,
  canvases: document.querySelectorAll("canvas").length,
  viz: window.__viz ?? null,
  h1: [...document.querySelectorAll("h1")].map((n) =>
    (n.textContent ?? "").trim().slice(0, 70),
  ),
}));

await page.screenshot({ path: outFile, fullPage });

await browser.close();

console.log(
  JSON.stringify(
    {
      file: outFile,
      viewport: `${preset.width}x${preset.height}@${preset.dsf}x`,
      horizontalOverflow: metrics.scrollW > metrics.innerW + 1,
      ...metrics,
      issues: consoleIssues.slice(0, 12),
    },
    null,
    2,
  ),
);
