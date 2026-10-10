"use client";
import Link from "next/link";
import { GitCompareArrows, X, ShoppingBag, ArrowLeft } from "lucide-react";
import { useStore, findProduct } from "@/components/store";
import { Breadcrumb, DemoNotice } from "@/components/ui";
import { specRows, price } from "@/lib/commerce";
export default function Page() {
  const { compare, toggleCompare, add, hydrated } = useStore();
  const selected = compare.map(findProduct);
  const labels = [
    ...new Set(selected.flatMap((p) => specRows(p).map((r) => r[0]))),
  ];
  return (
    <div className="page-container">
      <Breadcrumb items={[{ label: "مقایسه محصولات" }]} />
      <div className="page-title">
        <div>
          <span className="eyebrow">SIDE BY SIDE</span>
          <h1>تفاوت در جزئیات است.</h1>
        </div>
        <Link className="text-link" href="/shop">
          افزودن محصول
          <ArrowLeft size={17} />
        </Link>
      </div>
      <DemoNotice />
      {!hydrated ? (
        <p className="muted">در حال دریافت انتخاب‌ها...</p>
      ) : !selected.length ? (
        <div className="empty">
          <GitCompareArrows size={45} />
          <h3>محصولی برای مقایسه انتخاب نشده است</h3>
          <Link className="button primary" href="/shop">
            انتخاب محصولات
            <ArrowLeft size={18} />
          </Link>
        </div>
      ) : (
        <div className="compare-table-wrap">
          <table className="compare-table">
            <tbody>
              <tr>
                <th>محصول</th>
                {selected.map((p) => (
                  <td key={p.id} className="compare-product">
                    <button
                      className="icon-button"
                      aria-label={`حذف ${p.model} از مقایسه`}
                      onClick={() => toggleCompare(p.id)}
                    >
                      <X size={16} />
                    </button>
                    <Link href={`/product/${p.slug}`}>
                      <img src={p.image} alt={p.name} />
                      <h3>{p.name}</h3>
                      <p className="product-model" dir="ltr">
                        {p.model}
                      </p>
                    </Link>
                  </td>
                ))}
              </tr>
              {labels.map((label) => (
                <tr key={label}>
                  <th>{label}</th>
                  {selected.map((p) => (
                    <td key={p.id}>
                      <bdi>
                        {specRows(p).find((r) => r[0] === label)?.[1] ||
                          "ثبت نشده"}
                      </bdi>
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <th>قیمت نمایشی</th>
                {selected.map((p) => (
                  <td key={p.id}>
                    {price(p.price)} تومان
                    <button
                      className="button primary"
                      disabled={!p.stock}
                      onClick={() => add(p.id)}
                    >
                      {p.stock ? "افزودن به سبد" : "ناموجود"}
                      <ShoppingBag size={16} />
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
