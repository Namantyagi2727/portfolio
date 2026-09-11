import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } }); // normal motion
await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
await page.waitForTimeout(500);

// Scroll the globe far offscreen (down past Selected Work).
await page.evaluate(() => window.scrollTo(0, 4000));
await page.waitForTimeout(500);

const canvas = await page.$("canvas");
const shot1 = await canvas.screenshot();
await page.waitForTimeout(2500);
const shot2 = await canvas.screenshot();
console.log("offscreen, frames identical (expect true = paused):", Buffer.compare(shot1, shot2) === 0);

await browser.close();
