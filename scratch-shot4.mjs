import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
await page.waitForTimeout(1000);
const html = await page.evaluate(() => {
  const btns = Array.from(document.querySelectorAll("button"));
  const cityBtns = btns.filter((b) => /Brooklyn|London|New Delhi/.test(b.textContent));
  return cityBtns.map((b) => ({ text: JSON.stringify(b.textContent), outerHTML: b.outerHTML, parentHTML: b.parentElement.outerHTML })).slice(0, 5);
});
console.log(JSON.stringify(html, null, 2));
await browser.close();
