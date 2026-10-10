"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { useStore, findProduct } from "@/components/store";
import { Breadcrumb, DemoNotice } from "@/components/ui";
import { price, fa } from "@/lib/commerce";
export default function Page() {
  const { cart, count, total, hydrated } = useStore();
  const [done, setDone] = useState(false);
  return (
    <div className="page-container">
      <Breadcrumb
        items={[{ label: "سبد خرید", href: "/cart" }, { label: "بررسی سفارش" }]}
      />
      <div className="page-title">
        <div>
          <span className="eyebrow">ONE LAST LOOK</span>
          <h1>بررسی نهایی انتخاب شما</h1>
        </div>
      </div>
      <DemoNotice>
        پرداخت و ثبت سفارش صرفاً نمایشی است. از اطلاعات آزمایشی استفاده کنید.
      </DemoNotice>
      {!hydrated ? (
        <p>در حال دریافت سبد...</p>
      ) : !count ? (
        <div className="empty">
          <h2>ابتدا محصولی به سبد اضافه کنید</h2>
          <Link className="button primary" href="/shop">
            فروشگاه
          </Link>
        </div>
      ) : done ? (
        <div className="empty">
          <CheckCircle2 size={48} />
          <h2>بررسی آزمایشی کامل شد</h2>
          <p>هیچ سفارش یا پرداختی ثبت نشده و اطلاعات واردشده ارسال نشده‌اند.</p>
          <Link className="button primary" href="/shop">
            بازگشت به فروشگاه
            <ArrowLeft size={18} />
          </Link>
        </div>
      ) : (
        <div className="checkout-layout">
          <form
            id="checkout-form"
            className="checkout-form"
            onSubmit={(e) => {
              e.preventDefault();
              setDone(true);
            }}
          >
            <h2>اطلاعات ارسال آزمایشی</h2>
            <div className="form-grid">
              <label>
                نام و نام خانوادگی
                <input
                  name="name"
                  autoComplete="off"
                  required
                  minLength={3}
                  placeholder="کاربر آزمایشی"
                />
              </label>
              <label>
                شماره موبایل
                <input
                  name="phone"
                  type="tel"
                  dir="ltr"
                  autoComplete="off"
                  required
                  pattern="09[0-9]{9}"
                  placeholder="09123456789"
                />
              </label>
              <label>
                استان
                <input name="province" required autoComplete="off" />
              </label>
              <label>
                شهر
                <input name="city" required autoComplete="off" />
              </label>
              <label className="full">
                آدرس
                <textarea
                  name="address"
                  required
                  minLength={10}
                  autoComplete="off"
                />
              </label>
              <label>
                کد پستی
                <input
                  name="postal"
                  inputMode="numeric"
                  dir="ltr"
                  required
                  pattern="[0-9]{10}"
                  autoComplete="off"
                />
              </label>
            </div>
            <div className="payment-preview">
              <h2>روش پرداخت</h2>
              <label>
                <input type="radio" checked readOnly />
                شبیه‌سازی بررسی سفارش
              </label>
              <p>
                درگاه پرداخت هنوز متصل نیست. هیچ اطلاعات بانکی دریافت نمی‌شود.
              </p>
              <label className="small">
                <input type="checkbox" required />
                نمایشی بودن این مرحله را تأیید می‌کنم.
              </label>
            </div>
          </form>
          <aside className="order-summary">
            <h2>خلاصه سفارش</h2>
            {cart.map((l) => (
              <div className="summary-line" key={l.id}>
                <span>
                  {findProduct(l.id).name}
                  <small> × {fa(l.quantity)}</small>
                </span>
                <span>{price(findProduct(l.id).price * l.quantity)}</span>
              </div>
            ))}
            <div className="summary-line">
              <span>ارسال</span>
              <span>تعیین نشده</span>
            </div>
            <div className="summary-line total">
              <span>جمع محصولات</span>
              <strong>
                {price(total)} <small>تومان</small>
              </strong>
            </div>
            <button
              className="button primary"
              type="submit"
              form="checkout-form"
            >
              بررسی آزمایشی سفارش
              <ArrowLeft size={17} />
            </button>
          </aside>
        </div>
      )}
    </div>
  );
}
