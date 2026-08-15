/** One-off diagnostics: console errors and label/name mismatches. */
import { chromium } from "playwright";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE = process.env.PECLET_BASE ?? "http://localhost:3100";
const routes = process.argv.slice(2).length ? process.argv.slice(2) : ["/"];

const browser = await chromium.launch({ executablePath: CHROME });
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
});

for (const route of routes) {
  const page = await context.newPage();
  const logs = [];
  page.on("console", (m) => {
    if (m.type() === "error") logs.push(`[console] ${m.text()}`);
  });
  page.on("pageerror", (e) => logs.push(`[pageerror] ${e.message}`));
  page.on("requestfailed", (r) =>
    logs.push(`[request] ${r.url()} — ${r.failure()?.errorText}`),
  );

  await page.goto(BASE + route, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(2500);

  const mismatches = await page.evaluate(() => {
    const out = [];
    const norm = (s) =>
      (s ?? "")
        .toLowerCase()
        .replace(/[\u2010-\u2015\u2212]/g, "-")
        .replace(/\s+/g, " ")
        .trim();

    for (const el of document.querySelectorAll(
      "a[aria-label], button[aria-label], [role=button][aria-label], input[aria-label]",
    )) {
      const visible = norm(el.textContent);
      const name = norm(el.getAttribute("aria-label"));
      if (visible && !name.includes(visible)) {
        out.push({
          tag: el.tagName.toLowerCase(),
          visible: visible.slice(0, 60),
          name: name.slice(0, 60),
        });
      }
    }
    return out;
  });

  console.log(`\n${route}`);
  console.log(`  console issues: ${logs.length}`);
  logs.slice(0, 10).forEach((l) => console.log(`    ${l.slice(0, 220)}`));
  console.log(`  label/name mismatches: ${mismatches.length}`);
  mismatches.forEach((m) =>
    console.log(`    <${m.tag}> visible "${m.visible}" vs name "${m.name}"`),
  );

  await page.close();
}

await browser.close();
