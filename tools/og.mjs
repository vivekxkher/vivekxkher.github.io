/**
 * Renders the social cards.
 *
 *   node tools/og.mjs
 *
 * Loads /og-preview at 1200 × 630 for each route and writes the result to that
 * route's `opengraph-image.png` and `twitter-image.png`. Next.js picks those
 * filenames up by convention and emits the meta tags — including the absolute
 * URL, dimensions and MIME type — without any further wiring.
 *
 * Re-run after changing the card design or any of the titles below.
 */
import { chromium } from "playwright";
import { mkdirSync, writeFileSync, copyFileSync } from "node:fs";
import { resolve } from "node:path";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE = process.env.PECLET_BASE ?? "http://localhost:3000";
const APP = resolve(process.cwd(), "src/app");

/** dir is relative to src/app; "" is the site root. */
const CARDS = [
  {
    dir: "",
    eyebrow: "PÉCLET",
    readout: "Building Physics",
    title: "Buildings as climate systems",
    standfirst:
      "We study how buildings exchange heat, light, air and moisture with their climate.",
    alt: "PÉCLET — Buildings as climate systems. A building physics and climate design practice.",
  },
  {
    dir: "work",
    eyebrow: "PÉCLET / Project Atlas",
    readout: "Conceptual studies",
    title: "Studies in physics",
    standfirst:
      "An atlas of problems rather than a portfolio of buildings.",
    alt: "PÉCLET Project Atlas — studies in physics.",
  },
  {
    dir: "disciplines",
    eyebrow: "PÉCLET / Disciplines",
    readout: "06 Phenomena",
    title: "Six transport problems",
    standfirst:
      "Thermal, solar, air, moisture, daylight and energy — each with a live visualisation.",
    alt: "PÉCLET Disciplines — six transport problems.",
  },
  {
    dir: "atlas",
    eyebrow: "PÉCLET / India Climate Atlas",
    readout: "05 Zones",
    title: "Five climates, one country",
    standfirst:
      "A detail that is correct in one Indian climate zone can be a defect in another.",
    alt: "PÉCLET India Climate Atlas — five climates, one country.",
  },
  {
    dir: "research",
    eyebrow: "PÉCLET / Research",
    readout: "Observations",
    title: "Positions worth arguing with",
    standfirst:
      "Working notes on building physics, climate, materials and simulation.",
    alt: "PÉCLET Research — positions worth arguing with.",
  },
  {
    dir: "about",
    eyebrow: "PÉCLET / About",
    readout: "The practice",
    title: "Buildings are physical systems",
    standfirst:
      "They interact continuously with sun, air, heat, moisture, materials, people and energy.",
    alt: "PÉCLET About — buildings are physical systems.",
  },
  {
    dir: "contact",
    eyebrow: "PÉCLET / Contact",
    readout: "Let's talk",
    title: "Let's build better physics",
    standfirst:
      "Tell us the climate, the typology, the stage, and the question you are stuck on.",
    alt: "PÉCLET Contact — let's build better physics.",
  },
];

const browser = await chromium.launch({ executablePath: CHROME });
const context = await browser.newContext({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
  colorScheme: "dark",
  reducedMotion: "reduce",
});

const page = await context.newPage();

for (const card of CARDS) {
  const query = new URLSearchParams({
    title: card.title,
    eyebrow: card.eyebrow,
    readout: card.readout,
    standfirst: card.standfirst,
  });

  await page.goto(`${BASE}/og-preview?${query}`, {
    waitUntil: "networkidle",
    timeout: 60000,
  });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);

  const dir = card.dir ? resolve(APP, card.dir) : APP;
  mkdirSync(dir, { recursive: true });

  const og = resolve(dir, "opengraph-image.png");
  await page.screenshot({ path: og, clip: { x: 0, y: 0, width: 1200, height: 630 } });

  // Twitter reads its own filename when present; same art, explicit tag.
  copyFileSync(og, resolve(dir, "twitter-image.png"));

  // The alt text ships alongside, so the card is described in a timeline.
  writeFileSync(resolve(dir, "opengraph-image.alt.txt"), card.alt, "utf8");
  writeFileSync(resolve(dir, "twitter-image.alt.txt"), card.alt, "utf8");

  console.log(`${card.dir || "/"} → opengraph-image.png`);
}

await browser.close();
console.log(`\n${CARDS.length} cards rendered.`);
