"use client";
import Link from "next/link";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { CartLines } from "@/components/shell";
import { useStore } from "@/components/store";
import { price, fa } from "@/lib/commerce";
import { Breadcrumb, DemoNotice } from "@/components/ui";
export default function Page() {
  const { count, total, hydrated } = useStore();
  return (
    <div className="page-container">
      <Breadcrumb items={[{ label: "سبد خرید" }]} />
      <div className="page-title">
        <div>
          <span className="eyebrow">YOUR SELECTION</span>
          <h1>انتخاب‌های شما</h1>
        </div>
        <Link className="text-link" href="/shop">
          ادامه خرید
          <ArrowLeft size={17} />
        </Link>
      </div>
      <DemoNotice />
      {!hydrated ? (
        <p className="muted">در حال دریافت سبد...</p>
      ) : count ? (
        <div className="cart-page-grid">
          <CartLines />
          <aside className="order-summary">
            <h2>خلاصه سبد</h2>
            <div className="summary-line">
              <span>تعداد محصولات</span>
              <span>{fa(count)}</span>
            </div>
            <div className="summary-line">
              <span>هزینه ارسال</span>
              <span>تعیین نشده</span>
            </div>
            <div className="summary-line total">
              <span>جمع محصولات</span>
              <strong>
                {price(total)} <small>تومان</small>
              </strong>
            </div>
            <Link className="button primary" href="/checkout">
              ادامه و بررسی سفارش
              <ArrowLeft size={17} />
            </Link>
            <p className="small muted" style={{ marginTop: 15 }}>
              پرداخت واقعی در نسخه نمایشی فعال نیست.
            </p>
          </aside>
        </div>
      ) : (
        <div className="empty">
          <ShoppingBag size={45} />
          <h3>سبد شما خالی است</h3>
          <Link className="button primary" href="/shop">
            مشاهده محصولات
            <ArrowLeft size={18} />
          </Link>
        </div>
      )}
    </div>
  );
}
