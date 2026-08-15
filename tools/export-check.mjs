/** Verifies the exported static site: failed requests, and real navigation. */
import { chromium } from "playwright";
const CHROME = process.env.CHROME_PATH;
const BASE = process.env.PECLET_BASE ?? "http://localhost:4173";

const browser = await chromium.launch({ executablePath: CHROME });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const failures = [];
page.on("response", (r) => {
  if (r.status() >= 400) failures.push(`${r.status()} ${r.url()}`);
});
page.on("requestfailed", (r) => {
  failures.push(`FAILED ${r.failure()?.errorText} ${r.url()}`);
});

await page.goto(BASE + "/", { waitUntil: "networkidle" });
await page.waitForTimeout(2500);

console.log("--- failed requests on / ---");
console.log(failures.length ? [...new Set(failures)].join("\n") : "none");

// Does client-side navigation actually work?
failures.length = 0;
console.log("\n--- clicking nav: Disciplines ---");
await page.locator("header a[href='/disciplines/']").first().click();
await page.waitForLoadState("networkidle");
await page.waitForTimeout(1500);
console.log("landed on:", page.url());
console.log("h1:", (await page.locator("h1").first().textContent())?.trim().slice(0, 60));

console.log("\n--- clicking a discipline card ---");
await page.locator("a[href='/disciplines/solar/']").first().click();
await page.waitForLoadState("networkidle");
await page.waitForTimeout(2000);
console.log("landed on:", page.url());
console.log("h1:", (await page.locator("h1").first().textContent())?.trim().slice(0, 60));
console.log("canvas present:", await page.locator("canvas").count());

console.log("\n--- failures during navigation ---");
console.log(failures.length ? [...new Set(failures)].join("\n") : "none");

await browser.close();
