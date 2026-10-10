"use client";
import { useState } from "react";
import { ArrowUpLeft } from "lucide-react";
import { Breadcrumb, DemoNotice } from "@/components/ui";
export default function Page() {
  const [validated, setValidated] = useState(false);
  return (
    <div className="page-container">
      <Breadcrumb items={[{ label: "مشاوره و نصب" }]} />
      <div className="consultation-page">
        <div>
          <span className="eyebrow">LET’S FIND YOUR PERSPECTIVE</span>
          <h1>
            یک گفت‌وگو.
            <br />
            یک نگاه روشن‌تر.
          </h1>
          <p>
            از فضای خود بگویید؛ نیازها و اولویت‌هایتان نقطه شروع انتخاب یک سیستم
            نظارتی مناسب هستند.
          </p>
          <div className="consultation-visual">
            <img src="/images/bullet.webp" alt="دوربین مفهومی راد سیستم" />
          </div>
        </div>
        <div>
          <DemoNotice>
            فرم پیش‌نمایش است؛ ارسال درخواست هنوز فعال نیست.
          </DemoNotice>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setValidated(true);
            }}
          >
            <div className="form-grid">
              <label>
                نام و نام خانوادگی
                <input
                  required
                  minLength={3}
                  autoComplete="off"
                  placeholder="نام آزمایشی"
                />
              </label>
              <label>
                شماره تماس
                <input
                  type="tel"
                  dir="ltr"
                  pattern="09[0-9]{9}"
                  required
                  autoComplete="off"
                  placeholder="09123456789"
                />
              </label>
              <label>
                نوع فضا
                <select>
                  <option>مسکونی</option>
                  <option>فروشگاهی</option>
                  <option>اداری</option>
                  <option>صنعتی</option>
                  <option>سایر</option>
                </select>
              </label>
              <label>
                موضوع درخواست
                <select>
                  <option>انتخاب تجهیزات</option>
                  <option>طراحی سیستم</option>
                  <option>نصب و راه‌اندازی</option>
                  <option>ارتقای سیستم موجود</option>
                </select>
              </label>
              <label className="full">
                کمی بیشتر از نیاز خود بگویید
                <textarea
                  required
                  minLength={10}
                  placeholder="مساحت، تعداد نقاط تحت پوشش و اولویت‌های شما..."
                />
              </label>
              <div className="full">
                <button className="button primary" type="submit">
                  بررسی فرم نمایشی
                  <ArrowUpLeft size={18} />
                </button>
              </div>
            </div>
            {validated && (
              <div className="form-success" role="status">
                اطلاعات فرم معتبر است. هیچ درخواستی ارسال نشده؛ اتصال به سامانه
                مشاوره در انتظار راه‌اندازی است.
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
