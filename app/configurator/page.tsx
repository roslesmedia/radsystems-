"use client";
import { useState } from "react";
import {
  House,
  Store,
  Building2,
  Warehouse,
  Landmark,
  Shapes,
  ArrowLeft,
  ArrowRight,
  Check,
  ShoppingBag,
} from "lucide-react";
import { products, price, fa, type Product } from "@/lib/commerce";
import { compatibility, storageTB } from "@/lib/rules.mjs";
import { Breadcrumb, DemoNotice } from "@/components/ui";
import { useStore, type CartLine } from "@/components/store";
const steps = [
  "نوع فضا",
  "پوشش تصویر",
  "دوربین‌ها",
  "ضبط‌کننده",
  "ذخیره‌سازی",
  "لوازم جانبی",
  "مجموعه شما",
];
const applications = [
  ["خانه", House],
  ["فروشگاه", Store],
  ["دفتر کار", Building2],
  ["انبار", Warehouse],
  ["ساختمان تجاری", Landmark],
  ["سایر", Shapes],
] as const;
export default function Page() {
  const [step, setStep] = useState(0),
    [application, setApplication] = useState("خانه"),
    [quantity, setQuantity] = useState(4),
    [outdoor, setOutdoor] = useState(true),
    [cameraId, setCameraId] = useState("1"),
    [recorderId, setRecorderId] = useState("4"),
    [storageId, setStorageId] = useState("22"),
    [days, setDays] = useState(14),
    [bitrate, setBitrate] = useState(2),
    [accessories, setAccessories] = useState<string[]>([]);
  const { addPackage } = useStore();
  const camera = products.find((p) => p.id === cameraId)!,
    recorder = products.find((p) => p.id === recorderId)!,
    storage = products.find((p) => p.id === storageId)!;
  const needed = storageTB(quantity, bitrate, days);
  const warnings = compatibility(camera, recorder, quantity);
  if (outdoor && !camera.outdoor)
    warnings.push("دوربین انتخابی برای محیط بیرونی تعریف نشده است.");
  if (storage.capacity! < needed)
    warnings.push(`ظرفیت ذخیره‌سازی کمتر از برآورد ${fa(needed)} ترابایت است.`);
  if (quantity > camera.stock)
    warnings.push("تعداد دوربین از موجودی نمایشی بیشتر است.");
  const lines: CartLine[] = [
    { id: cameraId, quantity },
    { id: recorderId, quantity: 1 },
    { id: storageId, quantity: 1 },
    ...accessories.map((id) => ({ id, quantity: 1 })),
  ];
  const total = lines.reduce(
    (n, l) => n + products.find((p) => p.id === l.id)!.price * l.quantity,
    0,
  );
  const cameras = products
      .filter(
        (p) => p.resolution && p.stock >= quantity && (!outdoor || p.outdoor),
      )
      .slice(0, 8),
    recorders = products
      .filter(
        (p) =>
          p.category === "nvr" &&
          p.protocol === camera.protocol &&
          p.channels! >= quantity &&
          p.stock,
      )
      .slice(0, 6);
  function choice(p: Product, selected: boolean, select: () => void) {
    return (
      <button
        className={`config-product ${selected ? "selected" : ""}`}
        aria-pressed={selected}
        onClick={select}
        key={p.id}
      >
        <img src={p.image} alt="" />
        <div>
          <strong>{p.name}</strong>
          <small dir="ltr">{p.model}</small>
          <span>
            {price(p.price)} <small style={{ display: "inline" }}>تومان</small>
          </span>
        </div>
        {selected && <Check size={16} />}
      </button>
    );
  }
  return (
    <div className="page-container">
      <Breadcrumb items={[{ label: "سیستم‌ساز" }]} />
      <div className="page-title">
        <div>
          <span className="eyebrow">YOUR SPACE. YOUR SYSTEM.</span>
          <h1>امنیت، به انتخاب شما.</h1>
        </div>
        <p>
          گام {fa(step + 1)} از {fa(steps.length)}
        </p>
      </div>
      <DemoNotice>پیکربندی نمایشی؛ طرح نصب تأییدشده نیست.</DemoNotice>
      <nav className="config-progress" aria-label="مراحل سیستم‌ساز">
        {steps.map((s, i) => (
          <button
            key={s}
            className={i === step ? "current" : i < step ? "complete" : ""}
            onClick={() => {
              if (i < step) setStep(i);
            }}
            disabled={i > step}
            aria-current={i === step ? "step" : undefined}
          >
            <span>{i < step ? <Check size={13} /> : i + 1}</span>
            {s}
          </button>
        ))}
      </nav>
      <div className="config-layout">
        <section className="config-main">
          <h2>
            {
              [
                "سیستم شما برای چه فضایی است؟",
                "چه میزان پوشش نیاز دارید؟",
                "زاویه دید خود را انتخاب کنید.",
                "قلب سیستم را انتخاب کنید.",
                "فضا برای آنچه مهم است.",
                "آخرین جزئیات مجموعه شما.",
                "مجموعه شما آماده بررسی است.",
              ][step]
            }
          </h2>
          {step === 0 && (
            <div className="application-grid">
              {applications.map(([name, Icon]) => (
                <button
                  key={name}
                  className={`application-choice ${application === name ? "selected" : ""}`}
                  onClick={() => setApplication(name)}
                  aria-pressed={application === name}
                >
                  <Icon size={30} />
                  {name}
                </button>
              ))}
            </div>
          )}
          {step === 1 && (
            <div className="config-controls">
              <label>
                تعداد نقاط تحت پوشش: {fa(quantity)}
                <input
                  aria-label="تعداد دوربین"
                  type="range"
                  min="1"
                  max="16"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                />
              </label>
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={outdoor}
                  onChange={(e) => setOutdoor(e.target.checked)}
                />
                پوشش فضای بیرونی لازم است
              </label>
              <p className="muted small">
                در این بسته، برای هر نقطه یک دوربین یکسان در نظر گرفته می‌شود.
              </p>
            </div>
          )}
          {step === 2 && (
            <div className="config-products">
              {cameras.map((p) =>
                choice(p, cameraId === p.id, () => setCameraId(p.id)),
              )}
            </div>
          )}
          {step === 3 && (
            <>
              <p>ضبط‌کننده‌های هم‌پروتکل با ظرفیت حداقل {fa(quantity)} کانال</p>
              <div className="config-products">
                {recorders.map((p) =>
                  choice(p, recorderId === p.id, () => setRecorderId(p.id)),
                )}
              </div>
              <p className="muted small" style={{ marginTop: 20 }}>
                این بررسی فقط پروتکل و ظرفیت کانال را می‌سنجد. سازگاری واقعی به
                مشخصات سازنده نیاز دارد.
              </p>
            </>
          )}
          {step === 4 && (
            <>
              <div className="form-grid">
                <label>
                  مدت نگهداری (روز)
                  <input
                    type="number"
                    min="1"
                    max="90"
                    value={days}
                    onChange={(e) =>
                      setDays(Math.max(1, Math.min(90, Number(e.target.value))))
                    }
                  />
                </label>
                <label>
                  نرخ بیت هر دوربین (Mbps)
                  <input
                    type="number"
                    min="1"
                    max="16"
                    value={bitrate}
                    onChange={(e) =>
                      setBitrate(
                        Math.max(1, Math.min(16, Number(e.target.value))),
                      )
                    }
                  />
                </label>
              </div>
              <div className="warning">
                برآورد ظرفیت: {fa(needed)} ترابایت. ضبط پیوسته با نرخ بیت
                واردشده و ۱۵٪ فضای احتیاطی؛ نتیجه تضمین زمان نگهداری نیست.
              </div>
              <div className="config-products">
                {products
                  .filter((p) => p.category === "storage" && p.stock)
                  .slice(0, 3)
                  .map((p) =>
                    choice(p, storageId === p.id, () => setStorageId(p.id)),
                  )}
              </div>
            </>
          )}
          {step === 5 && (
            <>
              <p>
                تجهیزات اختیاری برای بررسی؛ کابل‌کشی و تغذیه باید در محل ارزیابی
                شوند.
              </p>
              <div className="config-products">
                {products
                  .filter(
                    (p) =>
                      ["network", "accessories"].includes(p.category) &&
                      p.stock,
                  )
                  .slice(0, 4)
                  .map((p) =>
                    choice(p, accessories.includes(p.id), () =>
                      setAccessories((a) =>
                        a.includes(p.id)
                          ? a.filter((id) => id !== p.id)
                          : [...a, p.id],
                      ),
                    ),
                  )}
              </div>
            </>
          )}
          {step === 6 && (
            <>
              <div className="package-lines">
                {lines.map((l) => {
                  const p = products.find((p) => p.id === l.id)!;
                  return (
                    <div key={l.id}>
                      <img src={p.image} alt="" />
                      <span>
                        {p.name}
                        <small>{fa(l.quantity)} عدد</small>
                      </span>
                      <strong>{price(p.price * l.quantity)} تومان</strong>
                    </div>
                  );
                })}
              </div>
              {warnings.map((w) => (
                <div className="warning" key={w}>
                  {w}
                </div>
              ))}
              <div className="summary-line total">
                <span>جمع مجموعه نمایشی</span>
                <strong>{price(total)} تومان</strong>
              </div>
            </>
          )}
          <div className="config-nav">
            <button
              className="button"
              disabled={!step}
              onClick={() => setStep((s) => s - 1)}
            >
              <ArrowRight size={17} />
              مرحله قبل
            </button>
            {step < 6 ? (
              <button
                className="button primary"
                onClick={() => setStep((s) => s + 1)}
              >
                ادامه
                <ArrowLeft size={17} />
              </button>
            ) : (
              <button
                className="button primary"
                disabled={warnings.length > 0}
                onClick={() => addPackage(lines)}
              >
                افزودن مجموعه به سبد
                <ShoppingBag size={17} />
              </button>
            )}
          </div>
        </section>
        <aside className="config-aside">
          <span className="eyebrow">YOUR CONFIGURATION</span>
          <h3>نگاهی به سیستم شما</h3>
          <img
            src={
              step === 3
                ? recorder.image
                : step === 4
                  ? storage.image
                  : camera.image
            }
            alt="تجهیزات منتخب"
          />
          <dl>
            <dt>نوع فضا</dt>
            <dd>{application}</dd>
            <dt>تعداد دوربین</dt>
            <dd>{fa(quantity)} عدد</dd>
            <dt>محیط</dt>
            <dd>{outdoor ? "بیرونی و داخلی" : "داخلی"}</dd>
            <dt>جمع نمایشی</dt>
            <dd>{price(total)} تومان</dd>
          </dl>
        </aside>
      </div>
    </div>
  );
}
