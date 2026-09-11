import { chromium } from "playwright";

const label = process.argv[2];
const baseUrl = process.argv[3] || "http://localhost:3000";
const outDir = "/tmp/redesign-screenshots";

const targets = [
  { path: "/", name: "home" },
  { path: "/work/prism", name: "prism" },
];

const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
];

const browser = await chromium.launch();
for (const vp of viewports) {
  const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
  for (const t of targets) {
    try {
      await page.goto(baseUrl + t.path, { waitUntil: "networkidle", timeout: 15000 });
      await page.waitForTimeout(600);
      const file = `${outDir}/${label}-${t.name}-${vp.name}.png`;
      await page.screenshot({ path: file, fullPage: true });
      console.log("saved", file);
    } catch (e) {
      console.log("FAILED", label, t.path, vp.name, String(e).slice(0, 200));
    }
  }
  await page.close();
}
await browser.close();
