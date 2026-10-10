"use client";
import Link from "next/link";
import {
  ShoppingBag,
  GitCompareArrows,
  ArrowUpLeft,
  Check,
} from "lucide-react";
import { type Product, price, fa } from "@/lib/commerce";
import { useStore } from "./store";
export default function ProductCard({ product: p }: { product: Product }) {
  const { add, compare, toggleCompare } = useStore();
  return (
    <article className="product-card">
      <div className="product-stage">
        <span className="product-tag">
          {p.category === "bullet" ? "انتخاب راد" : "مجموعه مفهومی"}
        </span>
        <button
          className={`icon-button compare-button ${compare.includes(p.id) ? "selected" : ""}`}
          title="مقایسه محصول"
          aria-label={`مقایسه ${p.model}`}
          aria-pressed={compare.includes(p.id)}
          onClick={() => toggleCompare(p.id)}
        >
          {compare.includes(p.id) ? (
            <Check size={17} />
          ) : (
            <GitCompareArrows size={17} />
          )}
        </button>
        <Link href={`/product/${p.slug}`} tabIndex={-1} aria-hidden>
          <img src={p.image} alt="" loading="lazy" />
        </Link>
        <span className="product-stage-index" dir="ltr">
          {p.brand}
        </span>
      </div>
      <div className="product-info">
        <div className="product-topline">
          <span>
            {p.resolution
              ? `${fa(p.resolution)} مگاپیکسل · ${p.protocol}`
              : p.channels
                ? `${fa(p.channels)} کانال`
                : p.capacity
                  ? `${fa(p.capacity)} ترابایت`
                  : "مجموعه تجهیزات"}
          </span>
          <span className={p.stock ? "stock" : "muted"}>
            {p.stock ? "موجود در دمو" : "ناموجود"}
          </span>
        </div>
        <Link href={`/product/${p.slug}`} className="product-name">
          {p.name}
          <ArrowUpLeft size={17} />
        </Link>
        <p className="product-model" dir="ltr">
          {p.model}
        </p>
        <div className="product-bottom">
          <div>
            <strong>{price(p.price)}</strong>
            <small>تومان</small>
          </div>
          <button
            className="add-button"
            disabled={!p.stock}
            title="افزودن به سبد خرید"
            aria-label={`افزودن ${p.model} به سبد`}
            onClick={() => add(p.id)}
          >
            <ShoppingBag size={18} />
          </button>
        </div>
      </div>
    </article>
  );
}
