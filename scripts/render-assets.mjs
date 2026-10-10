import { chromium } from "@playwright/test";
import sharp from "sharp";
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
const page = await browser.newPage({
  viewport: { width: 800, height: 650 },
  deviceScaleFactor: 1,
});
page.on("pageerror", (err) => console.error(err.message));
for (const kind of [
  "bullet",
  "dome",
  "ptz",
  "nvr",
  "storage",
  "accessories",
  "network",
]) {
  await page.goto(`http://localhost:3000/asset-studio?kind=${kind}`, {
    waitUntil: "networkidle",
  });
  await page.locator("canvas").waitFor();
  await page.waitForTimeout(1700);
  const png = await page.locator("canvas").screenshot();
  await sharp(png).webp({ quality: 90 }).toFile(`public/images/${kind}.webp`);
  console.log(`Rendered ${kind}`);
}
await browser.close();
