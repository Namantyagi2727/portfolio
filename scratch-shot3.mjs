import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
await page.waitForTimeout(1000);
const el = await page.$("text=Brooklyn, NY");
const box = await el.boundingBox();
await page.screenshot({
  path: "/tmp/redesign-screenshots/city-tabs-zoom.png",
  clip: { x: box.x - 100, y: box.y - 60, width: 500, height: 150 },
});
await browser.close();
console.log("done");
