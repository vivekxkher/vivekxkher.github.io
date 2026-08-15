/** Hovers every discipline card and reports whether it stays visible. */
import { chromium } from "playwright";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE = process.env.PECLET_BASE ?? "http://localhost:3000";

const browser = await chromium.launch({ executablePath: CHROME });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

for (const [route, selector] of [
  ["/disciplines", "a[href^='/disciplines/']"],
  ["/", "a[href^='/disciplines/']"],
  ["/work", "a[href^='/work/']"],
  ["/research", "a[href^='/research/']"],
]) {
  await page.goto(BASE + route, { waitUntil: "networkidle" });
  // Walk the page so the reveal observer fires for everything.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight * 0.8) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 100));
    }
  });
  await page.waitForTimeout(900);

  const cards = await page.locator(selector).all();
  const results = [];
  for (const card of cards.slice(0, 8)) {
    if (!(await card.isVisible())) continue;
    await card.scrollIntoViewIfNeeded();
    await card.hover();
    await page.waitForTimeout(220);
    const state = await card.evaluate((el) => ({
      label: (el.textContent ?? "").trim().slice(0, 18),
      opacity: getComputedStyle(el).opacity,
      revealed: el.hasAttribute("data-revealed"),
    }));
    results.push(state);
  }

  const broken = results.filter((r) => Number(r.opacity) < 0.99);
  console.log(
    `${route}: ${results.length} hovered, ${broken.length} faded` +
      (broken.length ? ` → ${broken.map((b) => `${b.label}=${b.opacity}`).join(", ")}` : " ✓"),
  );
}

await browser.close();
