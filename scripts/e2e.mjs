import { chromium, expect } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import assert from "node:assert/strict";
import sharp from "sharp";
const base = process.env.TEST_BASE_URL || "http://localhost:3000";
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
await mkdir("test-results", { recursive: true });
const errors = [],
  results = [];
async function run(name, fn) {
  if (
    process.env.TEST_FILTER &&
    !new RegExp(process.env.TEST_FILTER).test(name)
  )
    return;
  await fn();
  results.push(name);
  console.log(`PASS ${name}`);
}
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
});
const page = await context.newPage();
page.on("pageerror", (e) => errors.push(e.message));
const go = (path) => page.goto(base + path, { waitUntil: "networkidle" });
try {
  await run(
    "Homepage renders real WebGL and reversible scroll motion",
    async () => {
      await go("/");
      await page.locator("canvas").waitFor();
      await page.waitForTimeout(1300);
      const canvas = page.locator("canvas");
      await expect
        .poll(
          async () => {
            const dataUrl = await canvas.evaluate((c) => c.toDataURL());
            const { data, info } = await sharp(
              Buffer.from(dataUrl.split(",")[1], "base64"),
            )
              .ensureAlpha()
              .raw()
              .toBuffer({ resolveWithObject: true });
            let lit = 0;
            for (let i = 0; i < data.length; i += 4)
              if (data[i] + data[i + 1] + data[i + 2] > 150 && data[i + 3] > 0)
                lit++;
            return lit / (info.width * info.height);
          },
          { timeout: 30000 },
        )
        .toBeGreaterThan(0.04);
      await page.screenshot({ path: "test-results/verified-home-desktop.png" });
      await page.mouse.move(90, 400);
      const before = await canvas.screenshot();
      await page.mouse.move(900, 450);
      await page.waitForTimeout(450);
      const after = await canvas.screenshot();
      assert.notEqual(before.toString("base64"), after.toString("base64"));
      await page.evaluate(() => scrollTo({ top: 550, behavior: "instant" }));
      await page.waitForTimeout(900);
      await expect(page.locator(".technical-copy")).toHaveClass(/shown/);
      await page.screenshot({
        path: "test-results/verified-exploded-desktop.png",
      });
      await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
      await page.waitForTimeout(500);
      await expect(page.locator(".technical-copy")).not.toHaveClass(/shown/);
      await page.evaluate(() => scrollTo({ top: 2200, behavior: "instant" }));
      await page.waitForTimeout(700);
      assert.equal(await page.locator("canvas").count(), 0);
      await page.screenshot({
        path: "test-results/verified-collection-desktop.png",
      });
    },
  );
  await run(
    "Live search normalizes Persian characters and supports keyboard selection",
    async () => {
      await page.getByRole("button", { name: "جستجو", exact: true }).click();
      const input = page.getByRole("combobox", { name: "جستجوی محصولات" });
      await input.fill("دوربين");
      await expect(page.locator("#search-results li")).toHaveCount(6);
      await input.press("ArrowDown");
      await input.press("Enter");
      await expect(page).toHaveURL(/\/product\//);
    },
  );
  await run(
    "Catalogue filters, URL persistence, sorting and empty state",
    async () => {
      await go("/shop?category=bullet&resolution=8&stock=1&sort=price-asc");
      await expect(page.locator(".product-card")).toHaveCount(3);
      await page.reload();
      await expect(page.locator(".product-card")).toHaveCount(3);
      await page
        .getByRole("textbox", { name: "جستجو در فروشگاه" })
        .fill("unfindable-product");
      await expect(page.locator(".product-card")).toHaveCount(0);
      await expect(
        page.getByText("محصولی با این مشخصات پیدا نشد"),
      ).toBeVisible();
    },
  );
  await run(
    "Product viewer, cart quantity, reload persistence and comparison",
    async () => {
      await go("/product/rad-vision-01");
      await page
        .getByRole("button", { name: "نمای سه‌بعدی", exact: true })
        .click();
      await page.locator("canvas").waitFor();
      await page
        .getByRole("button", { name: "بزرگ‌نمایی", exact: true })
        .click();
      await page
        .getByRole("button", { name: "بازنشانی نما", exact: true })
        .click();
      await page
        .getByRole("button", { name: "افزودن به مقایسه", exact: true })
        .click();
      await page
        .getByRole("button", { name: "افزودن به سبد خرید", exact: true })
        .click();
      const drawer = page.getByRole("dialog", {
        name: "سبد خرید",
        exact: true,
      });
      await expect(drawer).toBeVisible();
      await drawer.getByRole("button", { name: "افزایش تعداد" }).click();
      await expect(drawer.locator("output")).toHaveText("۲");
      await page.keyboard.press("Escape");
      await page.reload();
      await go("/cart");
      await expect(page.locator("main .cart-line")).toHaveCount(1);
      await expect(page.locator("main output")).toHaveText("۲");
      await go("/compare");
      await expect(page.locator(".compare-product")).toHaveCount(1);
    },
  );
  await run(
    "Checkout validates demonstration data and makes no order request",
    async () => {
      await go("/checkout");
      await page.locator("input[name=name]").fill("کاربر آزمایشی");
      await page.locator("input[name=phone]").fill("09123456789");
      await page.locator("input[name=province]").fill("استان نمونه");
      await page.locator("input[name=city]").fill("شهر نمونه");
      await page
        .locator("textarea[name=address]")
        .fill("نشانی آزمایشی برای پیش‌نمایش فرم");
      await page.locator("input[name=postal]").fill("1234567890");
      await page.locator("input[type=checkbox]").check();
      let posts = 0;
      const track = (req) => {
        if (req.method() === "POST") posts++;
      };
      page.on("request", track);
      await page.getByRole("button", { name: "بررسی آزمایشی سفارش" }).click();
      await expect(
        page.getByRole("heading", { name: "بررسی آزمایشی کامل شد" }),
      ).toBeVisible();
      assert.equal(posts, 0);
      page.off("request", track);
    },
  );
  await run("Configurator builds a valid seven-step package", async () => {
    await context.clearCookies();
    await page.evaluate(() => localStorage.removeItem("rad-cart-v1"));
    await go("/configurator");
    for (let i = 0; i < 6; i++)
      await page.getByRole("button", { name: "ادامه", exact: true }).click();
    await expect(page.locator(".warning")).toHaveCount(0);
    await page.getByRole("button", { name: "افزودن مجموعه به سبد" }).click();
    await expect(page.getByRole("dialog", { name: "سبد خرید" })).toBeVisible();
    await expect(page.locator(".cart-drawer .cart-line")).toHaveCount(3);
    await page.keyboard.press("Escape");
  });
  await run(
    "High coverage configurator exposes adequately stocked cameras",
    async () => {
      await go("/configurator");
      await page.getByRole("button", { name: "ادامه", exact: true }).click();
      await page.getByRole("slider", { name: "تعداد دوربین" }).fill("16");
      await page.getByRole("button", { name: "ادامه", exact: true }).click();
      await page.locator(".config-product").first().click();
      await page.getByRole("button", { name: "ادامه", exact: true }).click();
      await page.locator(".config-product").first().click();
      for (let i = 0; i < 3; i++)
        await page.getByRole("button", { name: "ادامه", exact: true }).click();
      await expect(page.locator(".warning")).toHaveCount(0);
      await expect(
        page.getByRole("button", { name: "افزودن مجموعه به سبد" }),
      ).toBeEnabled();
    },
  );
  await run(
    "Admin price batches preview, apply once and roll back",
    async () => {
      await go("/admin");
      await page
        .getByRole("button", { name: "مدیریت قیمت", exact: true })
        .click();
      await page.getByRole("button", { name: "پیش‌نمایش تغییرات" }).click();
      await expect(
        page.getByRole("button", { name: /اعمال .* تغییر در نمونه/ }),
      ).toBeVisible();
      await page
        .getByRole("button", { name: /اعمال .* تغییر در نمونه/ })
        .click();
      await expect(
        page.getByRole("button", { name: /اعمال .* تغییر در نمونه/ }),
      ).toHaveCount(0);
      await expect(
        page.getByRole("spinbutton", {
          name: "قیمت RAD-VISION-01",
          exact: true,
        }),
      ).toHaveValue("4620000");
      await page
        .getByRole("button", { name: "بازگردانی", exact: true })
        .click();
      await expect(
        page.getByRole("spinbutton", {
          name: "قیمت RAD-VISION-01",
          exact: true,
        }),
      ).toHaveValue("4200000");
    },
  );
  await run("Excel export and validated reimport", async () => {
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "خروجی Excel" }).click();
    const download = await downloadPromise;
    const path = "test-results/demo-export.xlsx";
    await download.saveAs(path);
    assert.ok(download.suggestedFilename().endsWith(".xlsx"));
    await page.locator('input[accept=".xlsx"]').setInputFiles(path);
    await expect(page.getByRole("status")).toContainText("تغییر برای بازبینی");
  });
  await run("Preview routes return successful responses", async () => {
    for (const route of [
      "/account",
      "/consultation",
      "/info/privacy",
      "/info/shipping",
      "/info/returns",
      "/sitemap.xml",
      "/robots.txt",
    ]) {
      const response = await page.request.get(base + route);
      assert.equal(response.status(), 200, route);
    }
  });
  await run(
    "Mobile layouts, navigation, filtering, cart and canvas remain usable",
    async () => {
      const mobile = await context.newPage();
      await mobile.setViewportSize({ width: 390, height: 844 });
      await mobile.goto(base, { waitUntil: "networkidle" });
      await mobile.waitForTimeout(800);
      await mobile.screenshot({
        path: "test-results/verified-home-mobile.png",
      });
      await mobile.getByRole("button", { name: "فهرست", exact: true }).click();
      await mobile
        .getByRole("dialog", { name: "فهرست اصلی" })
        .getByRole("link", { name: "همه محصولات" })
        .click();
      await mobile
        .getByRole("button", { name: "فیلترها", exact: true })
        .click();
      const filters = mobile.getByRole("dialog", { name: "فیلتر محصولات" });
      await filters.getByRole("radio", { name: /دوربین دام/ }).click();
      await expect(
        filters.getByRole("radio", { name: /دوربین دام/ }),
      ).toBeChecked();
      await filters.getByRole("button", { name: /نمایش .* محصول/ }).click();
      await expect(mobile).toHaveURL(/category=dome/);
      for (const route of [
        "/",
        "/shop",
        "/product/rad-vision-01",
        "/configurator",
        "/admin",
        "/checkout",
      ]) {
        await mobile.goto(base + route, { waitUntil: "networkidle" });
        const width = await mobile.evaluate(() => ({
          scroll: document.documentElement.scrollWidth,
          viewport: innerWidth,
        }));
        assert.ok(
          width.scroll <= width.viewport + 1,
          `${route}: ${JSON.stringify(width)}`,
        );
        if (route === "/shop")
          await mobile.screenshot({
            path: "test-results/verified-shop-mobile.png",
          });
      }
      await mobile.close();
    },
  );
  await run("Reduced motion and static WebGL fallback", async () => {
    const reduced = await browser.newContext({
      viewport: { width: 390, height: 844 },
      reducedMotion: "reduce",
    });
    const r = await reduced.newPage();
    await r.goto(base, { waitUntil: "networkidle" });
    assert.ok(
      (await r
        .locator(".cinema-sequence")
        .evaluate((el) => el.getBoundingClientRect().height)) < 900,
    );
    await reduced.close();
    const fallback = await context.newPage();
    await fallback.addInitScript(() => {
      const original = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (type, ...args) {
        if (type === "webgl" || type === "webgl2") return null;
        return original.call(this, type, ...args);
      };
    });
    await fallback.goto(base, { waitUntil: "networkidle" });
    await expect(fallback.locator(".scene-fallback")).toBeVisible();
    assert.equal(await fallback.locator("canvas").count(), 0);
    await fallback.close();
  });
  assert.deepEqual(errors, []);
  await writeFile(
    process.env.TEST_FILTER
      ? "test-results/results-filtered.json"
      : "test-results/results.json",
    JSON.stringify({ passed: results, errors }, null, 2),
  );
  console.log(`${results.length} checks passed.`);
} finally {
  await browser.close();
}
