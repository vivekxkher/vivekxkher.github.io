/** Reports the vertical gap between consecutive top-level sections. */
import { chromium } from "playwright";
const CHROME = process.env.CHROME_PATH;
const BASE = process.env.PECLET_BASE ?? "http://localhost:3000";
const routes = process.argv.slice(2).length ? process.argv.slice(2) : ["/"];

const browser = await chromium.launch({ executablePath: CHROME });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

for (const route of routes) {
  await page.goto(BASE + route, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  const rows = await page.evaluate(() => {
    const main = document.querySelector("main");
    const out = [];
    for (const el of main.children) {
      const cs = getComputedStyle(el);
      out.push({
        tag: el.tagName.toLowerCase(),
        cls: (el.className || "").toString().slice(0, 28),
        h: Math.round(el.getBoundingClientRect().height),
        pt: cs.paddingTop,
        pb: cs.paddingBottom,
      });
    }
    return out;
  });
  console.log(`\n${route}`);
  for (const r of rows) {
    console.log(`  ${r.tag} ${r.cls}  h=${r.h}  pad ${r.pt} / ${r.pb}`);
  }
}
await browser.close();
