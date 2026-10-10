"use client";
import { useState } from "react";
import { ShoppingBag, GitCompareArrows, Share2 } from "lucide-react";
import {
  type Product,
  categories,
  products,
  price,
  specRows,
} from "@/lib/commerce";
import { Breadcrumb, DemoNotice, Quantity, SectionHeading } from "./ui";
import { useStore } from "./store";
import ProductCard from "./product-card";
import CameraScene from "./lazy-scene";
export default function ProductDetail({ product: p }: { product: Product }) {
  const [quantity, setQuantity] = useState(1),
    [mode, setMode] = useState("image"),
    [tab, setTab] = useState("specs");
  const { add, toggleCompare, compare, notify } = useStore();
  const category = categories.find((c) => c.id === p.category)!;
  const supported = ["bullet", "dome", "ptz"].includes(p.category);
  return (
    <div className="page-container">
      <Breadcrumb
        items={[
          { label: "فروشگاه", href: "/shop" },
          { label: category.name, href: `/shop?category=${p.category}` },
          { label: p.name },
        ]}
      />
      <div className="product-detail-grid">
        <div className="detail-gallery">
          <div className="detail-image">
            {supported && (
              <div className="gallery-mode">
                <button
                  className={mode === "image" ? "active" : ""}
                  onClick={() => setMode("image")}
                >
                  تصویر
                </button>
                <button
                  className={mode === "3d" ? "active" : ""}
                  onClick={() => setMode("3d")}
                >
                  نمای سه‌بعدی
                </button>
              </div>
            )}
            {mode === "3d" ? (
              <CameraScene kind={p.category} interactive />
            ) : (
              <img src={p.image} alt={p.name} />
            )}
          </div>
          <div className="gallery-thumbs">
            <button
              className={mode === "image" ? "active" : ""}
              aria-label="تصویر محصول"
              onClick={() => setMode("image")}
            >
              <img src={p.image} alt="" />
            </button>
            {supported && (
              <button
                className={mode === "3d" ? "active" : ""}
                onClick={() => setMode("3d")}
                aria-label="نمای سه‌بعدی محصول"
              >
                <span className="latin">3D</span>
              </button>
            )}
          </div>
          <DemoNotice>
            طراحی مفهومی؛ تصاویر و مدل، نمونه نمایشی هستند.
          </DemoNotice>
        </div>
        <div className="detail-copy">
          <span className="eyebrow">
            {p.brand.toUpperCase()} / {category.english}
          </span>
          <h1>{p.name}</h1>
          <div className="detail-model latin" dir="ltr">
            {p.model}
          </div>
          <span className="stock">
            <i className="status-dot" />
            {p.stock ? "موجود در انبار نمایشی" : "ناموجود"}
          </span>
          <p>{p.description}</p>
          <div className="detail-highlights">
            {specRows(p)
              .slice(2, 6)
              .map(([label, value]) => (
                <div key={label}>
                  <span>{label}</span>
                  <bdi>{value}</bdi>
                </div>
              ))}
          </div>
          <div className="detail-price">
            <strong>{price(p.price)}</strong>
            <small>تومان</small>
          </div>
          <div className="purchase-row">
            <Quantity value={quantity} onChange={setQuantity} max={p.stock} />
            <button
              className="button primary"
              disabled={!p.stock}
              onClick={() => add(p.id, quantity)}
            >
              افزودن به سبد خرید
              <ShoppingBag size={20} />
            </button>
          </div>
          <DemoNotice />
          <div className="detail-extra">
            <button
              onClick={() => toggleCompare(p.id)}
              aria-pressed={compare.includes(p.id)}
            >
              <GitCompareArrows size={17} />
              {compare.includes(p.id) ? "حذف از مقایسه" : "افزودن به مقایسه"}
            </button>
            <button
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(location.href);
                  notify("پیوند محصول کپی شد.");
                } catch {
                  notify("امکان کپی خودکار وجود ندارد.");
                }
              }}
            >
              <Share2 size={16} />
              اشتراک‌گذاری
            </button>
          </div>
        </div>
      </div>
      <section className="spec-section">
        <div className="tabs" role="tablist" aria-label="اطلاعات محصول">
          {[
            ["specs", "مشخصات فنی"],
            ["description", "توضیحات محصول"],
            ["shipping", "ارسال و ضمانت"],
          ].map(([id, title]) => (
            <button
              key={id}
              role="tab"
              aria-selected={tab === id}
              className={tab === id ? "active" : ""}
              onClick={() => setTab(id)}
            >
              {title}
            </button>
          ))}
        </div>
        <div role="tabpanel">
          {tab === "specs" ? (
            <table className="spec-table">
              <tbody>
                {specRows(p).map(([label, value]) => (
                  <tr key={label}>
                    <th>{label}</th>
                    <td>
                      <bdi>{value}</bdi>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : tab === "description" ? (
            <p className="description">
              {p.description} سازگاری ثبت‌شده در این نسخه فقط به پروتکل و تعداد
              کانال محصولات نمایشی محدود است؛ نصب واقعی به تأیید مشخصات سازنده و
              بررسی محل نیاز دارد.
            </p>
          ) : (
            <p className="description">
              شرایط ارسال، نصب و ضمانت هنوز توسط فروشگاه تأیید نشده‌اند. این
              نسخه امکان خرید یا پرداخت واقعی ندارد.
            </p>
          )}
        </div>
      </section>
      <section className="related">
        <SectionHeading
          eyebrow="COMPLETE YOUR PERSPECTIVE"
          title="در کنار انتخاب شما"
          href="/shop"
        />
        <div className="product-grid home-products">
          {products
            .filter(
              (x) =>
                x.id !== p.id &&
                ["nvr", "storage", "network", "accessories"].includes(
                  x.category,
                ),
            )
            .slice(0, 4)
            .map((x) => (
              <ProductCard key={x.id} product={x} />
            ))}
        </div>
      </section>
    </div>
  );
}
