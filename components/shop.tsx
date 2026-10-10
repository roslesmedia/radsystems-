"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Search,
  SlidersHorizontal,
  Grid2X2,
  List,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  categories,
  products,
  searchProducts,
  fa,
  price,
} from "@/lib/commerce";
import ProductCard from "./product-card";
import { Breadcrumb, DemoNotice, Modal } from "./ui";
export default function Shop() {
  const params = useSearchParams(),
    router = useRouter();
  const [view, setView] = useState("grid"),
    [filterOpen, setFilterOpen] = useState(false);
  const query = params.get("q") || "",
    category = params.get("category") || "",
    brand = params.get("brand") || "",
    resolution = params.get("resolution") || "",
    stock = params.get("stock") === "1",
    sort = params.get("sort") || "featured",
    max = Math.min(
      20000000,
      Math.max(0, Number(params.get("max")) || 20000000),
    ),
    page = Math.max(1, Number(params.get("page")) || 1);
  function update(key: string, value: string) {
    const p = new URLSearchParams(params.toString());
    if (value) p.set(key, value);
    else p.delete(key);
    if (key !== "page") p.delete("page");
    window.history.replaceState(
      null,
      "",
      `/shop${p.size ? "?" + p.toString() : ""}`,
    );
  }
  let filtered = searchProducts(query).filter(
    (p) =>
      (!category || p.category === category) &&
      (!brand || p.brand === brand) &&
      (!resolution || String(p.resolution) === resolution) &&
      (!stock || p.stock > 0) &&
      p.price <= max,
  );
  if (sort === "price-asc")
    filtered = filtered.toSorted((a, b) => a.price - b.price);
  if (sort === "price-desc")
    filtered = filtered.toSorted((a, b) => b.price - a.price);
  if (sort === "name")
    filtered = filtered.toSorted((a, b) => a.name.localeCompare(b.name, "fa"));
  const pages = Math.max(1, Math.ceil(filtered.length / 12)),
    current = Math.min(page, pages),
    display = filtered.slice((current - 1) * 12, current * 12);
  const active = [
    ["category", categories.find((c) => c.id === category)?.name],
    ["brand", brand],
    ["resolution", resolution ? `${fa(Number(resolution))} مگاپیکسل` : ""],
    ["stock", stock ? "فقط موجود" : ""],
    ["max", max < 20000000 ? `تا ${price(max)} تومان` : ""],
  ].filter((x) => x[1]);
  const filters = (scope: string) => (
    <>
      <div className="filter-section">
        <h3>دسته‌بندی</h3>
        <label>
          <input
            type="radio"
            name={`category-${scope}`}
            checked={!category}
            onChange={() => update("category", "")}
          />
          همه محصولات<span>{fa(products.length)}</span>
        </label>
        {categories.map((c) => (
          <label key={c.id}>
            <input
              type="radio"
              name={`category-${scope}`}
              checked={category === c.id}
              onChange={() => update("category", c.id)}
            />
            {c.name}
            <span>
              {fa(products.filter((p) => p.category === c.id).length)}
            </span>
          </label>
        ))}
      </div>
      <div className="filter-section">
        <h3>مجموعه</h3>
        {["RAD Concept", "RAD Studio"].map((b) => (
          <label key={b}>
            <input
              type="checkbox"
              checked={brand === b}
              onChange={() => update("brand", brand === b ? "" : b)}
            />
            <bdi>{b}</bdi>
          </label>
        ))}
      </div>
      <div className="filter-section">
        <h3>محدوده قیمت</h3>
        <input
          type="range"
          min="500000"
          max="20000000"
          step="500000"
          value={max}
          onChange={(e) => update("max", e.target.value)}
          aria-label="حداکثر قیمت"
        />
        <div className="range-labels">
          <span>تا {price(max)} تومان</span>
        </div>
      </div>
      <div className="filter-section">
        <h3>وضوح تصویر</h3>
        {[2, 4, 8].map((r) => (
          <label key={r}>
            <input
              type="checkbox"
              checked={resolution === String(r)}
              onChange={() =>
                update("resolution", resolution === String(r) ? "" : String(r))
              }
            />
            {fa(r)} مگاپیکسل
          </label>
        ))}
      </div>
      <div className="filter-section">
        <label>
          <input
            type="checkbox"
            checked={stock}
            onChange={(e) => update("stock", e.target.checked ? "1" : "")}
          />
          فقط محصولات موجود
        </label>
      </div>
      <button
        className="clear-filters"
        onClick={() => router.replace("/shop", { scroll: false })}
      >
        پاک کردن همه فیلترها
      </button>
    </>
  );
  return (
    <div className="page-container">
      <Breadcrumb items={[{ label: "فروشگاه" }]} />
      <div className="page-title">
        <div>
          <span className="eyebrow">THE RADSYSTEM COLLECTION</span>
          <h1>
            {categories.find((c) => c.id === category)?.name ||
              "نگاه دقیق، انتخاب درست."}
          </h1>
        </div>
        <p>{fa(filtered.length)} محصول در مجموعه</p>
      </div>
      <DemoNotice />
      <div className="shop-layout">
        <aside className="shop-sidebar" aria-label="فیلتر محصولات">
          {filters("desktop")}
        </aside>
        <div>
          <div className="shop-toolbar">
            <div className="search-field">
              <Search size={18} />
              <input
                value={query}
                placeholder="جستجو در محصولات..."
                aria-label="جستجو در فروشگاه"
                onChange={(e) => update("q", e.target.value)}
              />
              {query && (
                <button
                  className="icon-button"
                  aria-label="پاک کردن جستجو"
                  onClick={() => update("q", "")}
                >
                  <X size={15} />
                </button>
              )}
            </div>
            <button
              className="button mobile-filter"
              onClick={() => setFilterOpen(true)}
            >
              <SlidersHorizontal size={17} />
              فیلترها
            </button>
            <select
              aria-label="مرتب‌سازی"
              value={sort}
              onChange={(e) => update("sort", e.target.value)}
            >
              <option value="featured">منتخب راد سیستم</option>
              <option value="price-asc">قیمت: کم به زیاد</option>
              <option value="price-desc">قیمت: زیاد به کم</option>
              <option value="name">نام محصول</option>
            </select>
            <div className="view-toggle">
              <button
                className={view === "grid" ? "active" : ""}
                onClick={() => setView("grid")}
                aria-label="نمای شبکه‌ای"
                aria-pressed={view === "grid"}
              >
                <Grid2X2 size={17} />
              </button>
              <button
                className={view === "list" ? "active" : ""}
                onClick={() => setView("list")}
                aria-label="نمای فهرستی"
                aria-pressed={view === "list"}
              >
                <List size={17} />
              </button>
            </div>
          </div>
          {active.length > 0 && (
            <div className="active-filters">
              {active.map(([key, label]) => (
                <button
                  key={key}
                  className="filter-chip"
                  onClick={() => update(key!, "")}
                >
                  {label}
                  <X size={12} />
                </button>
              ))}
            </div>
          )}
          {display.length ? (
            <div
              className={`product-grid ${view === "list" ? "list-view" : ""}`}
            >
              {display.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="empty">
              <Search size={38} />
              <h3>محصولی با این مشخصات پیدا نشد</h3>
              <button
                className="button"
                onClick={() => router.replace("/shop")}
              >
                حذف فیلترها
              </button>
            </div>
          )}
          {pages > 1 && (
            <nav className="pagination" aria-label="صفحه‌بندی">
              <button
                disabled={current === 1}
                onClick={() => update("page", String(current - 1))}
                aria-label="صفحه قبل"
              >
                <ChevronRight size={16} />
              </button>
              {Array.from({ length: pages }, (_, i) => (
                <button
                  key={i}
                  className={current === i + 1 ? "active" : ""}
                  aria-current={current === i + 1 ? "page" : undefined}
                  onClick={() => update("page", String(i + 1))}
                >
                  {fa(i + 1)}
                </button>
              ))}
              <button
                disabled={current === pages}
                onClick={() => update("page", String(current + 1))}
                aria-label="صفحه بعد"
              >
                <ChevronLeft size={16} />
              </button>
            </nav>
          )}
        </div>
      </div>
      <Modal
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        label="فیلتر محصولات"
        className="mobile-filter-dialog"
      >
        <h2>فیلتر محصولات</h2>
        {filters("mobile")}
        <button className="button primary" onClick={() => setFilterOpen(false)}>
          نمایش {fa(filtered.length)} محصول
        </button>
      </Modal>
    </div>
  );
}
