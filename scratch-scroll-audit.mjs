import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 900 } });

const checks = [
  { url: "/work/airspace", label: "Airspace infra diagram" },
  { url: "/work/prism", label: "Prism full flow + infra diagrams" },
];

for (const c of checks) {
  await page.goto("http://localhost:3000" + c.url, { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  const results = await page.evaluate(() => {
    const containers = Array.from(document.querySelectorAll(".overflow-x-auto"));
    return containers.map((el) => ({
      scrollWidth: el.scrollWidth,
      clientWidth: el.clientWidth,
      needsScroll: el.scrollWidth > el.clientWidth + 1,
    }));
  });
  console.log(c.label, JSON.stringify(results));
}
await browser.close();
