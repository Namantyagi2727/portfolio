import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
await page.waitForTimeout(1500);

// Sample the globe canvas pixels twice with a delay — if reduced-motion is
// respected, the canvas should be pixel-identical (no rotation/cycling).
const canvas = await page.$("canvas");
const shot1 = await canvas.screenshot();
await page.waitForTimeout(2000);
const shot2 = await canvas.screenshot();
console.log("frame 1 bytes:", shot1.length, "frame 2 bytes:", shot2.length);
console.log("identical:", Buffer.compare(shot1, shot2) === 0);

await page.screenshot({ path: "/tmp/redesign-screenshots/reduced-motion-hero.png" });
await browser.close();
