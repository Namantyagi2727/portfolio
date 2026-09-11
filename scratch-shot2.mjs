import { chromium } from "playwright";

const outDir = "/tmp/redesign-screenshots";
const browser = await chromium.launch();

// Hero only, desktop viewport, no fullPage (top of page)
let page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
await page.waitForTimeout(1000);
await page.screenshot({ path: `${outDir}/after-hero-desktop-viewport.png` });
await page.close();

// Hero only, mobile viewport
page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
await page.waitForTimeout(1000);
await page.screenshot({ path: `${outDir}/after-hero-mobile-viewport.png` });
await page.close();

// Mobile at 360px too (narrowest brief target)
page = await browser.newPage({ viewport: { width: 360, height: 780 } });
await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
await page.waitForTimeout(1000);
await page.screenshot({ path: `${outDir}/after-hero-360-viewport.png` });
await page.close();

await browser.close();
console.log("done");
