import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
await mkdir("test-results", { recursive: true });
const browser = await chromium.launch({
  executablePath: "/usr/bin/chromium",
  headless: true,
  args: [
    "--no-sandbox",
    "--use-gl=angle",
    "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader",
  ],
});
for (const [name, width, height] of [
  ["desktop", 1440, 1000],
  ["mobile", 390, 844],
]) {
  const page = await browser.newPage({
    viewport: { width, height },
    deviceScaleFactor: 1,
  });
  page.on("pageerror", (e) => console.log(name, "PAGE ERROR", e.message));
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await page.waitForTimeout(1800);
  await page.screenshot({ path: `test-results/home-${name}.png` });
  console.log(
    name,
    await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      width: innerWidth,
      images: [...document.images]
        .filter((i) => !i.complete || !i.naturalWidth)
        .map((i) => i.src),
    })),
  );
  await page.evaluate(() => scrollTo(0, 850));
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `test-results/exploded-${name}.png` });
  await page.goto("http://localhost:3000/shop", { waitUntil: "networkidle" });
  await page.screenshot({ path: `test-results/shop-${name}.png` });
  await page.close();
}
await browser.close();
