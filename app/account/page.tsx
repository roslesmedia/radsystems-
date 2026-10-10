"use client";
import { useState } from "react";
import Link from "next/link";
import { UserRound, MapPin, Package, Headphones, LogIn } from "lucide-react";
import { Breadcrumb, DemoNotice } from "@/components/ui";
import { useStore } from "@/components/store";
const tabs = [
  ["login", "ورود", LogIn],
  ["details", "اطلاعات حساب", UserRound],
  ["addresses", "نشانی‌ها", MapPin],
  ["orders", "سفارش‌ها", Package],
  ["support", "پشتیبانی", Headphones],
] as const;
export default function Page() {
  const [tab, setTab] = useState("login");
  const { notify } = useStore();
  return (
    <div className="page-container">
      <Breadcrumb items={[{ label: "حساب کاربری" }]} />
      <div className="page-title">
        <div>
          <span className="eyebrow">YOUR RADSYSTEM</span>
          <h1>همراه نگاه شما.</h1>
        </div>
      </div>
      <DemoNotice>
        پیش‌نمایش حساب کاربری؛ ورود و ذخیره اطلاعات فعال نیست.
      </DemoNotice>
      <div className="account-layout">
        <nav className="account-nav">
          {tabs.map(([id, label, Icon]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={tab === id ? "active" : ""}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </nav>
        <div className="account-content">
          {tab === "login" ? (
            <>
              <h2>ورود به حساب کاربری</h2>
              <p>اتصال به حساب ووکامرس پس از راه‌اندازی فروشگاه فعال می‌شود.</p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  notify("سامانه ورود هنوز متصل نیست؛ کدی ارسال نشد.");
                }}
              >
                <div className="form-grid">
                  <label className="full">
                    شماره موبایل آزمایشی
                    <input
                      type="tel"
                      dir="ltr"
                      placeholder="09123456789"
                      pattern="09[0-9]{9}"
                      required
                      autoComplete="off"
                    />
                  </label>
                </div>
                <button className="button primary">بررسی ورود نمایشی</button>
              </form>
            </>
          ) : tab === "details" ? (
            <>
              <h2>اطلاعات حساب</h2>
              <p>برای پیش‌نمایش از اطلاعات آزمایشی استفاده کنید.</p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  notify("اطلاعات بررسی شد؛ ذخیره‌سازی حساب فعال نیست.");
                }}
              >
                <div className="form-grid">
                  <label>
                    نام
                    <input required placeholder="نام آزمایشی" />
                  </label>
                  <label>
                    نام خانوادگی
                    <input required placeholder="نام خانوادگی آزمایشی" />
                  </label>
                  <label className="full">
                    ایمیل
                    <input
                      type="email"
                      required
                      dir="ltr"
                      placeholder="demo@example.com"
                    />
                  </label>
                </div>
                <button className="button">بررسی اطلاعات</button>
              </form>
            </>
          ) : tab === "addresses" ? (
            <>
              <h2>نشانی‌های ارسال</h2>
              <p>
                نشانی ذخیره‌شده‌ای وجود ندارد. نشانی‌ها بعد از اتصال امن حساب
                کاربری قابل مدیریت خواهند بود.
              </p>
            </>
          ) : tab === "orders" ? (
            <>
              <h2>تاریخچه سفارش‌ها</h2>
              <div className="empty">
                <Package size={38} />
                <p>هنوز سفارشی ثبت نشده است.</p>
                <Link className="button" href="/shop">
                  مشاهده محصولات
                </Link>
              </div>
            </>
          ) : (
            <>
              <h2>پشتیبانی حساب</h2>
              <p>اطلاعات تماس پشتیبانی پس از تأیید فروشگاه درج می‌شود.</p>
              <Link className="button" href="/consultation">
                فرم مشاوره
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
