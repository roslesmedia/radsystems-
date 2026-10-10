"use client";
import { useState, useRef } from "react";
import {
  LayoutDashboard,
  Package,
  BadgeDollarSign,
  Boxes,
  ShoppingBag,
  FilePenLine,
  Users,
  Settings,
  Search,
  Plus,
  Pencil,
  Archive,
  Download,
  Upload,
  Undo2,
  Check,
  ImagePlus,
} from "lucide-react";
import { products, categories, fa, price, type Product } from "@/lib/commerce";
import { adjustPrice } from "@/lib/rules.mjs";
import { Breadcrumb, DemoNotice, Modal } from "@/components/ui";
import { useStore } from "@/components/store";
type Item = Product & { published: boolean; override: boolean };
type PriceChange = { id: string; oldPrice: number; newPrice: number };
type HistoryEntry = {
  id: number;
  time: string;
  changes: PriceChange[];
  rolledBack: boolean;
};
const tabs = [
  ["dashboard", "نمای کلی", LayoutDashboard],
  ["products", "محصولات", Package],
  ["prices", "مدیریت قیمت", BadgeDollarSign],
  ["stock", "موجودی", Boxes],
  ["orders", "سفارش‌ها", ShoppingBag],
  ["content", "محتوای سایت", FilePenLine],
  ["customers", "مشتریان", Users],
  ["settings", "کارکنان و تنظیمات", Settings],
] as const;
const initialContent = {
  title: "امنیت از زاویه‌ای تازه",
  description: "نسل جدید تجهیزات امنیتی و سیستم‌های نظارتی حرفه‌ای",
  contact: "",
  address: "",
  hours: "",
  featured: true,
};
export default function Page() {
  const [tab, setTab] = useState("dashboard"),
    [items, setItems] = useState<Item[]>(() =>
      products.map((p) => ({ ...p, published: true, override: false })),
    ),
    [query, setQuery] = useState(""),
    [editing, setEditing] = useState<Item | null>(null),
    [method, setMethod] = useState("percent"),
    [amount, setAmount] = useState(10),
    [currency, setCurrency] = useState("toman"),
    [oldRate, setOldRate] = useState(60000),
    [newRate, setNewRate] = useState(65000),
    [rateDate, setRateDate] = useState(""),
    [preview, setPreview] = useState<PriceChange[]>([]),
    [history, setHistory] = useState<HistoryEntry[]>([]),
    [content, setContent] = useState(initialContent),
    [contentSaved, setContentSaved] = useState(false),
    [banner, setBanner] = useState(""),
    [busy, setBusy] = useState(false);
  const { notify } = useStore();
  const operation = useRef(0);
  const visible = items.filter((p) =>
    `${p.name} ${p.model}`.toLowerCase().includes(query.toLowerCase()),
  );
  function updateItem(id: string, patch: Partial<Item>) {
    setItems((a) => a.map((p) => (p.id === id ? { ...p, ...patch } : p)));
    setPreview([]);
  }
  function buildPreview() {
    try {
      if (!Number.isFinite(amount)) throw new Error("عدد معتبر وارد کنید.");
      if (method === "exchange") {
        const age = Date.now() - Date.parse(rateDate);
        if (
          !rateDate ||
          !Number.isFinite(age) ||
          age < 0 ||
          age > 86400000 ||
          oldRate <= 0 ||
          newRate <= 0 ||
          newRate / oldRate < 0.5 ||
          newRate / oldRate > 2
        )
          throw new Error(
            "نرخ و زمان را بررسی کنید؛ نرخ باید مربوط به ۲۴ ساعت اخیر و تغییر آن بین نیم تا دو برابر باشد.",
          );
      }
      const changed = items
        .filter((p) => p.published && !p.override)
        .map((p) => ({
          id: p.id,
          oldPrice: p.price,
          newPrice:
            method === "exchange"
              ? Math.round((p.price * newRate) / oldRate / 1000) * 1000
              : adjustPrice(
                  p.price,
                  method,
                  amount / (method === "fixed" && currency === "rial" ? 10 : 1),
                ),
        }))
        .filter((p) => p.oldPrice !== p.newPrice);
      setPreview(changed);
      if (!changed.length) notify("تغییری برای پیش‌نمایش وجود ندارد.");
    } catch (e) {
      notify(e instanceof Error ? e.message : "قیمت نامعتبر است.");
    }
  }
  function applyPrices() {
    if (!preview.length) return;
    const changes = [...preview];
    setItems((current) =>
      current.map((p) => {
        const c = changes.find((c) => c.id === p.id);
        return c && p.price === c.oldPrice ? { ...p, price: c.newPrice } : p;
      }),
    );
    setHistory((h) => [
      {
        id: ++operation.current,
        time: new Date().toLocaleTimeString("fa-IR"),
        changes,
        rolledBack: false,
      },
      ...h,
    ]);
    setPreview([]);
    notify("قیمت‌های نمونه در همین صفحه به‌روزرسانی شدند.");
  }
  function rollback(entry: HistoryEntry) {
    if (entry.rolledBack) return;
    if (
      entry.changes.some(
        (c) => items.find((p) => p.id === c.id)?.price !== c.newPrice,
      )
    ) {
      notify("قیمت‌ها بعداً تغییر کرده‌اند؛ بازگردانی خودکار ممکن نیست.");
      return;
    }
    setItems((a) =>
      a.map((p) => {
        const c = entry.changes.find((c) => c.id === p.id);
        return c ? { ...p, price: c.oldPrice } : p;
      }),
    );
    setHistory((h) =>
      h.map((x) => (x.id === entry.id ? { ...x, rolledBack: true } : x)),
    );
    setPreview([]);
    notify("قیمت‌های نمونه بازگردانده شدند.");
  }
  async function exportExcel() {
    setBusy(true);
    try {
      const ExcelJS = await import("exceljs");
      const book = new ExcelJS.Workbook();
      const sheet = book.addWorksheet("Products");
      sheet.columns = [
        { header: "id", key: "id", width: 10 },
        { header: "model", key: "model", width: 28 },
        { header: "price_toman", key: "price_toman", width: 20 },
        { header: "stock", key: "stock", width: 10 },
      ];
      items.forEach((p) =>
        sheet.addRow({
          id: p.id,
          model: p.model,
          price_toman: p.price,
          stock: p.stock,
        }),
      );
      const buffer = await book.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "radsystem-demo-toman.xlsx";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      notify("خروجی فایل انجام نشد.");
    } finally {
      setBusy(false);
    }
  }
  async function importExcel(file?: File) {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024 || !file.name.endsWith(".xlsx")) {
      notify("فقط فایل XLSX تا ۲ مگابایت پذیرفته می‌شود.");
      return;
    }
    setBusy(true);
    try {
      const ExcelJS = await import("exceljs");
      const book = new ExcelJS.Workbook();
      await book.xlsx.load(await file.arrayBuffer());
      const sheet = book.worksheets[0];
      if (
        !sheet ||
        sheet.rowCount > 500 ||
        sheet.getRow(1).getCell(1).text !== "id" ||
        sheet.getRow(1).getCell(3).text !== "price_toman"
      )
        throw new Error(
          "قالب فایل باید مطابق خروجی و قیمت‌ها بر حسب تومان باشد.",
        );
      const changes: PriceChange[] = [];
      const seen = new Set<string>();
      sheet.eachRow((row, index) => {
        if (index === 1) return;
        const id = row.getCell(1).text.trim(),
          value = row.getCell(3).value;
        if (seen.has(id)) throw new Error("شناسه محصول تکراری است.");
        seen.add(id);
        const p = items.find((p) => p.id === id);
        if (
          !p ||
          row.getCell(2).text.trim() !== p.model ||
          typeof value !== "number" ||
          !Number.isSafeInteger(value) ||
          value < 0 ||
          value > 1e12
        )
          throw new Error("شناسه یا قیمت نامعتبر در فایل.");
        if (!p.override && p.price !== value)
          changes.push({ id, oldPrice: p.price, newPrice: value });
      });
      setPreview(changes);
      notify(`${fa(changes.length)} تغییر برای بازبینی آماده است.`);
    } catch (e) {
      notify(e instanceof Error ? e.message : "خواندن فایل ممکن نشد.");
    } finally {
      setBusy(false);
    }
  }
  function imageFile(file: File | undefined, callback: (data: string) => void) {
    if (!file) return;
    if (
      !["image/png", "image/jpeg", "image/webp"].includes(file.type) ||
      file.size > 3 * 1024 * 1024
    ) {
      notify("تصویر JPG، PNG یا WebP تا ۳ مگابایت انتخاب کنید.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => callback(String(reader.result));
    reader.readAsDataURL(file);
  }
  const table = (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>تصویر</th>
            <th>محصول</th>
            <th>قیمت (تومان)</th>
            <th>موجودی</th>
            <th>وضعیت</th>
            <th>ویرایش</th>
          </tr>
        </thead>
        <tbody>
          {visible.slice(0, 30).map((p) => (
            <tr key={p.id}>
              <td>
                <img src={p.image} alt="" />
              </td>
              <td>
                {p.name}
                <div className="muted latin" style={{ fontSize: 9 }}>
                  {p.model}
                </div>
              </td>
              <td>
                {tab === "prices" ? (
                  <input
                    type="number"
                    aria-label={`قیمت ${p.model}`}
                    min="0"
                    value={p.price}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (Number.isSafeInteger(value) && value >= 0)
                        updateItem(p.id, { price: value, override: true });
                    }}
                  />
                ) : (
                  price(p.price)
                )}
              </td>
              <td>
                {tab === "stock" ? (
                  <input
                    type="number"
                    min="0"
                    aria-label={`موجودی ${p.model}`}
                    value={p.stock}
                    onChange={(e) => {
                      const stock = Number(e.target.value);
                      if (Number.isInteger(stock) && stock >= 0)
                        updateItem(p.id, { stock });
                    }}
                  />
                ) : (
                  fa(p.stock)
                )}
              </td>
              <td>{p.published ? "منتشرشده در نمونه" : "بایگانی"}</td>
              <td>
                <button
                  className="icon-button"
                  aria-label={`ویرایش ${p.model}`}
                  onClick={() => setEditing({ ...p })}
                >
                  <Pencil size={14} />
                </button>
                <button
                  className="icon-button"
                  aria-label={`بایگانی ${p.model}`}
                  onClick={() => updateItem(p.id, { published: !p.published })}
                >
                  {p.published ? <Archive size={14} /> : <Undo2 size={14} />}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {visible.length > 30 && (
        <p className="small muted" style={{ marginTop: 15 }}>
          ۳۰ نتیجه نخست؛ برای محصول مشخص جستجو کنید.
        </p>
      )}
    </div>
  );
  return (
    <div className="page-container">
      <Breadcrumb items={[{ label: "پیش‌نمایش مدیریت" }]} />
      <div className="page-title">
        <div>
          <span className="eyebrow">RADSYSTEM / ADMIN DESIGN PREVIEW</span>
          <h1>مدیریت، با دید روشن.</h1>
        </div>
        <span className="small muted">محیط نمونه · بدون اتصال به فروشگاه</span>
      </div>
      <DemoNotice>
        دموی عمومی طراحی؛ داده‌ها فقط تا زمان خروج از این صفحه باقی می‌مانند.
        احراز هویت یا کنترل فروشگاه واقعی وجود ندارد.
      </DemoNotice>
      <div className="admin-layout">
        <nav className="admin-sidebar">
          {tabs.map(([id, title, Icon]) => (
            <button
              key={id}
              className={tab === id ? "active" : ""}
              onClick={() => {
                setTab(id);
                setPreview([]);
              }}
            >
              <Icon size={17} />
              {title}
            </button>
          ))}
        </nav>
        <div className="admin-main">
          {tab === "dashboard" ? (
            <>
              <h2>نمای کلی داده‌های نمونه</h2>
              <div className="stat-grid">
                <div className="stat-item">
                  <Package />
                  <span>
                    محصولات نمونه<strong>{fa(items.length)}</strong>
                  </span>
                </div>
                <div className="stat-item">
                  <Boxes />
                  <span>
                    محصولات موجود
                    <strong>
                      {fa(items.filter((p) => p.stock > 0).length)}
                    </strong>
                  </span>
                </div>
                <div className="stat-item">
                  <ShoppingBag />
                  <span>
                    سفارش‌های واقعی<strong>۰</strong>
                  </span>
                </div>
              </div>
              {table}
            </>
          ) : ["products", "stock"].includes(tab) ? (
            <>
              <h2>{tab === "products" ? "مدیریت محصولات" : "موجودی نمونه"}</h2>
              <div className="admin-toolbar">
                <div className="search-field">
                  <Search size={17} />
                  <input
                    aria-label="جستجوی مدیریت"
                    placeholder="جستجوی نام یا مدل"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
                {tab === "products" && (
                  <button
                    className="button primary"
                    onClick={() =>
                      setEditing({
                        ...products[0],
                        id: `demo-${Date.now()}`,
                        name: "محصول نمونه جدید",
                        slug: `sample-${Date.now()}`,
                        model: "RAD-SAMPLE",
                        price: 0,
                        stock: 0,
                        published: false,
                        override: false,
                      })
                    }
                  >
                    <Plus size={17} />
                    محصول نمونه
                  </button>
                )}
              </div>
              {table}
            </>
          ) : tab === "prices" ? (
            <>
              <h2>مدیریت قیمت‌ها</h2>
              <div className="price-controls">
                <label>
                  روش تغییر
                  <select
                    value={method}
                    onChange={(e) => {
                      setMethod(e.target.value);
                      setPreview([]);
                    }}
                  >
                    <option value="percent">تغییر درصدی</option>
                    <option value="fixed">مبلغ ثابت</option>
                    <option value="exchange">بازمحاسبه نرخ ارز</option>
                  </select>
                </label>
                {method !== "exchange" ? (
                  <label>
                    {method === "percent" ? "درصد تغییر" : "مبلغ تغییر"}
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => {
                        setAmount(Number(e.target.value));
                        setPreview([]);
                      }}
                    />
                  </label>
                ) : (
                  <>
                    <label>
                      نرخ قبلی (تومان)
                      <input
                        type="number"
                        min="1"
                        value={oldRate}
                        onChange={(e) => {
                          setOldRate(Number(e.target.value));
                          setPreview([]);
                        }}
                      />
                    </label>
                    <label>
                      نرخ جدید (تومان)
                      <input
                        type="number"
                        min="1"
                        value={newRate}
                        onChange={(e) => {
                          setNewRate(Number(e.target.value));
                          setPreview([]);
                        }}
                      />
                    </label>
                    <label>
                      زمان تأیید نرخ دستی
                      <input
                        type="datetime-local"
                        value={rateDate}
                        onChange={(e) => {
                          setRateDate(e.target.value);
                          setPreview([]);
                        }}
                      />
                    </label>
                  </>
                )}
                {method === "fixed" && (
                  <label>
                    واحد مبلغ ورودی
                    <select
                      value={currency}
                      onChange={(e) => {
                        setCurrency(e.target.value);
                        setPreview([]);
                      }}
                    >
                      <option value="toman">تومان</option>
                      <option value="rial">ریال (تقسیم بر ۱۰)</option>
                    </select>
                  </label>
                )}
                <button className="button" onClick={buildPreview}>
                  پیش‌نمایش تغییرات
                </button>
              </div>
              <p className="small muted" style={{ margin: "20px 0" }}>
                قیمت‌های دارای قفل دستی از تغییر گروهی مستثنا هستند. نرخ ارز
                ورودی دستی است؛ دریافت یا انتشار خودکار فعال نیست.
              </p>
              <div className="admin-toolbar">
                <button
                  className="button"
                  disabled={busy}
                  onClick={exportExcel}
                >
                  <Download size={16} />
                  خروجی Excel
                </button>
                <label className="button import-label">
                  <Upload size={16} />
                  ورود قیمت از Excel
                  <input
                    type="file"
                    accept=".xlsx"
                    disabled={busy}
                    onChange={(e) => {
                      importExcel(e.target.files?.[0]);
                      e.target.value = "";
                    }}
                  />
                </label>
              </div>
              {preview.length > 0 && (
                <>
                  <div className="admin-table-wrap">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>محصول</th>
                          <th>قیمت قبلی (تومان)</th>
                          <th>قیمت جدید (تومان)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {preview.map((c) => (
                          <tr key={c.id}>
                            <td>{items.find((p) => p.id === c.id)?.name}</td>
                            <td>{price(c.oldPrice)}</td>
                            <td>{price(c.newPrice)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <button
                    className="button primary"
                    style={{ marginTop: 20 }}
                    onClick={applyPrices}
                  >
                    اعمال {fa(preview.length)} تغییر در نمونه
                    <Check size={17} />
                  </button>
                </>
              )}
              <h3 style={{ marginTop: 30 }}>ویرایش دستی</h3>
              {table}
              {history.length > 0 && (
                <>
                  <h3 style={{ marginTop: 30 }}>تاریخچه این نشست</h3>
                  {history.map((h) => (
                    <div className="history-entry" key={h.id}>
                      <span>
                        {h.time} · {fa(h.changes.length)} تغییر{" "}
                        {h.rolledBack ? "· بازگردانده شد" : ""}
                      </span>
                      <button
                        className="button"
                        disabled={h.rolledBack}
                        onClick={() => rollback(h)}
                      >
                        <Undo2 size={15} />
                        بازگردانی
                      </button>
                    </div>
                  ))}
                </>
              )}
            </>
          ) : tab === "content" ? (
            <>
              <h2>ویرایش ساختاری محتوا</h2>
              <form
                className="admin-editor"
                onSubmit={(e) => {
                  e.preventDefault();
                  setContentSaved(true);
                  notify(
                    "پیش‌نویس نمونه در همین صفحه ثبت شد؛ سایت عمومی تغییر نکرد.",
                  );
                }}
              >
                <label className="full">
                  عنوان صفحه اصلی
                  <input
                    value={content.title}
                    required
                    maxLength={80}
                    onChange={(e) => {
                      setContent({ ...content, title: e.target.value });
                      setContentSaved(false);
                    }}
                  />
                </label>
                <label className="full">
                  توضیح اصلی
                  <textarea
                    value={content.description}
                    maxLength={200}
                    onChange={(e) =>
                      setContent({ ...content, description: e.target.value })
                    }
                  />
                </label>
                <label>
                  شماره تماس
                  <input
                    value={content.contact}
                    onChange={(e) =>
                      setContent({ ...content, contact: e.target.value })
                    }
                  />
                </label>
                <label>
                  ساعت کاری
                  <input
                    value={content.hours}
                    onChange={(e) =>
                      setContent({ ...content, hours: e.target.value })
                    }
                  />
                </label>
                <label className="full">
                  نشانی
                  <input
                    value={content.address}
                    onChange={(e) =>
                      setContent({ ...content, address: e.target.value })
                    }
                  />
                </label>
                <label className="full">
                  تصویر بنر
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={(e) => imageFile(e.target.files?.[0], setBanner)}
                  />
                  {banner && (
                    <img
                      src={banner}
                      alt="بنر نمونه"
                      style={{ maxHeight: 170, objectFit: "contain" }}
                    />
                  )}
                </label>
                <label
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={content.featured}
                    onChange={(e) =>
                      setContent({ ...content, featured: e.target.checked })
                    }
                  />
                  نمایش محصولات منتخب
                </label>
                <button className="button primary">
                  {contentSaved
                    ? "پیش‌نویس نمونه ثبت شد"
                    : "ثبت پیش‌نویس نمونه"}
                </button>
              </form>
            </>
          ) : tab === "settings" ? (
            <>
              <h2>نقش‌های برنامه‌ریزی‌شده</h2>
              <p className="muted small">
                این جدول تنها طراحی دسترسی‌هاست. اعمال مجوزها، احراز هویت و ثبت
                وقایع باید در بک‌اند انجام شود.
              </p>
              <table className="role-table">
                <thead>
                  <tr>
                    <th>نقش</th>
                    <th>حوزه دسترسی پیشنهادی</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["مالک", "تنظیمات، کارکنان و همه عملیات"],
                    ["مدیر فروشگاه", "محصولات، موجودی، قیمت و سفارش"],
                    ["ویراستار محتوا", "محتوای ساختاری سایت"],
                    ["کارشناس سفارش", "وضعیت سفارش و پاسخ‌گویی"],
                    ["تکنسین آژانس", "نگهداری فنی با دسترسی محدود"],
                  ].map(([a, b]) => (
                    <tr key={a}>
                      <td>{a}</td>
                      <td>{b}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : (
            <>
              <h2>{tab === "orders" ? "سفارش‌ها" : "مشتریان"}</h2>
              <div className="empty">
                {tab === "orders" ? (
                  <ShoppingBag size={40} />
                ) : (
                  <Users size={40} />
                )}
                <p>
                  {tab === "orders"
                    ? "سفارش واقعی وجود ندارد."
                    : "اطلاعات مشتری واقعی وجود ندارد."}
                </p>
                <span className="small muted">
                  این بخش بعد از اتصال امن به ووکامرس فعال می‌شود.
                </span>
              </div>
            </>
          )}
        </div>
      </div>
      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        className="admin-edit-dialog"
        label="ویرایش محصول نمونه"
      >
        {editing && (
          <>
            <h2>ویرایش محصول نمونه</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setItems((a) =>
                  a.some((p) => p.id === editing.id)
                    ? a.map((p) => (p.id === editing.id ? editing : p))
                    : [editing, ...a],
                );
                setPreview([]);
                setEditing(null);
                notify("محصول نمونه به‌روزرسانی شد.");
              }}
            >
              <div className="form-grid">
                <label className="full">
                  نام محصول
                  <input
                    required
                    value={editing.name}
                    onChange={(e) =>
                      setEditing({ ...editing, name: e.target.value })
                    }
                  />
                </label>
                <label>
                  مدل
                  <input
                    required
                    dir="ltr"
                    value={editing.model}
                    onChange={(e) =>
                      setEditing({ ...editing, model: e.target.value })
                    }
                  />
                </label>
                <label>
                  دسته‌بندی
                  <select
                    value={editing.category}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        category: e.target.value as Product["category"],
                      })
                    }
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  قیمت (تومان)
                  <input
                    required
                    type="number"
                    min="0"
                    step="1"
                    value={editing.price}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        price: Number(e.target.value),
                        override: true,
                      })
                    }
                  />
                </label>
                <label>
                  موجودی
                  <input
                    required
                    type="number"
                    min="0"
                    step="1"
                    value={editing.stock}
                    onChange={(e) =>
                      setEditing({ ...editing, stock: Number(e.target.value) })
                    }
                  />
                </label>
                <label className="full">
                  توضیحات
                  <textarea
                    value={editing.description}
                    onChange={(e) =>
                      setEditing({ ...editing, description: e.target.value })
                    }
                  />
                </label>
                <label>
                  وضوح (مگاپیکسل)
                  <input
                    type="number"
                    min="1"
                    value={editing.resolution || ""}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        resolution: e.target.value
                          ? Number(e.target.value)
                          : undefined,
                      })
                    }
                  />
                </label>
                <label>
                  تصویر نمونه
                  <ImagePlus size={17} />
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={(e) =>
                      imageFile(e.target.files?.[0], (image) =>
                        setEditing({ ...editing, image }),
                      )
                    }
                  />
                </label>
                <label style={{ flexDirection: "row" }}>
                  <input
                    type="checkbox"
                    checked={editing.published}
                    onChange={(e) =>
                      setEditing({ ...editing, published: e.target.checked })
                    }
                  />
                  انتشار در نمونه
                </label>
                <label style={{ flexDirection: "row" }}>
                  <input
                    type="checkbox"
                    checked={editing.override}
                    onChange={(e) =>
                      setEditing({ ...editing, override: e.target.checked })
                    }
                  />
                  قفل قیمت دستی
                </label>
              </div>
              <button className="button primary">
                ثبت تغییر نمونه
                <Check size={17} />
              </button>
            </form>
          </>
        )}
      </Modal>
    </div>
  );
}
