import { chromium } from "playwright";
const browser = await chromium.launch();
const routes = ["/", "/work/prism", "/work/medical-cv", "/work/faculty-ops", "/work/airspace"];
const widths = [360, 390, 430, 768, 1024, 1440];

for (const width of widths) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  for (const route of routes) {
    await page.goto("http://localhost:3000" + route, { waitUntil: "networkidle" });
    await page.waitForTimeout(400);
    const overflow = await page.evaluate(() => {
      const sw = document.documentElement.scrollWidth;
      const cw = document.documentElement.clientWidth;
      return { scrollWidth: sw, clientWidth: cw, overflow: sw - cw };
    });
    const flag = overflow.overflow > 1 ? "  <-- OVERFLOW" : "";
    console.log(`${width}px ${route.padEnd(20)} scrollW=${overflow.scrollWidth} clientW=${overflow.clientWidth}${flag}`);
  }
  await page.close();
}
await browser.close();
