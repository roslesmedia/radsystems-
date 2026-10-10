"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Search,
  ShoppingBag,
  Menu,
  ArrowUpLeft,
  ChevronDown,
  UserRound,
  X,
  ArrowLeft,
  GitCompareArrows,
  Trash2,
} from "lucide-react";
import { categories, commerce, price, fa, type Product } from "@/lib/commerce";
import { findProduct, useStore } from "./store";
import { Modal, Quantity } from "./ui";
export function Brand() {
  return (
    <Link href="/" className="brand" aria-label="راد سیستم، صفحه اصلی">
      <img src="/logo.svg" width="36" height="42" alt="" />
      <span>
        RADSYSTEM<small>SECURITY, REDEFINED.</small>
      </span>
    </Link>
  );
}
function SearchDialog({ open, close }: { open: boolean; close: () => void }) {
  const [query, setQuery] = useState(""),
    [results, setResults] = useState<Product[]>([]),
    [loading, setLoading] = useState(false),
    [error, setError] = useState(false),
    [index, setIndex] = useState(-1);
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (open) setTimeout(() => input.current?.focus(), 50);
  }, [open]);
  useEffect(() => {
    let cancelled = false;
    setIndex(-1);
    setError(false);
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const t = setTimeout(() => {
      commerce
        .search(query)
        .then((r) => {
          if (!cancelled) {
            setResults(r.slice(0, 6));
            setLoading(false);
          }
        })
        .catch(() => {
          if (!cancelled) {
            setError(true);
            setLoading(false);
          }
        });
    }, 200);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [query]);
  return (
    <Modal
      open={open}
      onClose={close}
      label="جستجوی محصولات"
      className="search-dialog"
    >
      <h2>در جستجوی چه هستید؟</h2>
      <div className="search-field">
        <Search size={22} />
        <input
          ref={input}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="نام محصول، مدل یا مشخصات"
          aria-label="جستجوی محصولات"
          role="combobox"
          aria-expanded={results.length > 0}
          aria-controls="search-results"
          aria-activedescendant={index >= 0 ? `search-${index}` : undefined}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setIndex((i) => Math.min(i + 1, results.length - 1));
            }
            if (e.key === "ArrowUp") {
              e.preventDefault();
              setIndex((i) => Math.max(i - 1, 0));
            }
            if (e.key === "Enter") {
              router.push(
                index >= 0
                  ? `/product/${results[index].slug}`
                  : `/shop?q=${encodeURIComponent(query)}`,
              );
              close();
            }
          }}
        />
        {query && (
          <button
            className="icon-button"
            aria-label="پاک کردن جستجو"
            onClick={() => setQuery("")}
          >
            <X size={18} />
          </button>
        )}
      </div>
      <div aria-live="polite">
        {loading ? (
          <p className="muted">در حال جستجو...</p>
        ) : error ? (
          <p>دریافت نتایج ممکن نشد. دوباره جستجو کنید.</p>
        ) : query && !results.length ? (
          <p className="empty">محصولی پیدا نشد.</p>
        ) : !query ? (
          <div className="search-suggestions">
            {categories.slice(0, 4).map((c) => (
              <Link onClick={close} key={c.id} href={`/shop?category=${c.id}`}>
                {c.name}
                <ArrowUpLeft size={15} />
              </Link>
            ))}
          </div>
        ) : null}
      </div>
      <ul id="search-results" role="listbox" className="search-results">
        {!loading &&
          results.map((p, i) => (
            <li
              key={p.id}
              id={`search-${i}`}
              role="option"
              aria-selected={index === i}
            >
              <Link
                className={index === i ? "active" : ""}
                href={`/product/${p.slug}`}
                onClick={close}
              >
                <img src={p.image} alt="" />
                <div>
                  <strong>{p.name}</strong>
                  <span dir="ltr">{p.model}</span>
                </div>
                <span>
                  {price(p.price)}
                  <small> تومان</small>
                </span>
                <ArrowUpLeft size={18} />
              </Link>
            </li>
          ))}
      </ul>
      {query && (
        <Link
          href={`/shop?q=${encodeURIComponent(query)}`}
          onClick={close}
          className="text-link"
        >
          همه نتایج جستجو
          <ArrowLeft size={17} />
        </Link>
      )}
    </Modal>
  );
}
export function CartLines() {
  const { cart, setQuantity } = useStore();
  return (
    <div className="cart-lines">
      {cart.map((line) => {
        const p = findProduct(line.id);
        return (
          <div className="cart-line" key={p.id}>
            <Link href={`/product/${p.slug}`}>
              <img src={p.image} alt={p.name} />
            </Link>
            <div>
              <Link href={`/product/${p.slug}`}>{p.name}</Link>
              <span className="latin">{p.model}</span>
              <strong>
                {price(p.price)} <small>تومان</small>
              </strong>
              <Quantity
                value={line.quantity}
                max={p.stock}
                onChange={(q) => setQuantity(p.id, q)}
              />
            </div>
            <button
              className="icon-button"
              aria-label={`حذف ${p.model}`}
              onClick={() => setQuantity(p.id, 0)}
            >
              <Trash2 size={17} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
export function CartDrawer() {
  const { cartOpen, setCartOpen, count, total } = useStore();
  return (
    <Modal
      open={cartOpen}
      onClose={() => setCartOpen(false)}
      label="سبد خرید"
      className="cart-drawer"
    >
      <div className="drawer-heading">
        <span className="eyebrow">YOUR SELECTION</span>
        <h2>
          سبد خرید <small>({fa(count)})</small>
        </h2>
      </div>
      {count ? (
        <>
          <CartLines />
          <div className="drawer-total">
            <div>
              <span>جمع سبد</span>
              <strong>
                {price(total)} <small>تومان</small>
              </strong>
            </div>
            <p className="muted small">
              سبد نمایشی · هزینه ارسال محاسبه نشده است.
            </p>
            <Link
              className="button primary"
              href="/checkout"
              onClick={() => setCartOpen(false)}
            >
              ادامه و بررسی سفارش
              <ArrowLeft size={18} />
            </Link>
            <Link
              className="text-link"
              href="/cart"
              onClick={() => setCartOpen(false)}
            >
              مشاهده سبد خرید
            </Link>
          </div>
        </>
      ) : (
        <div className="empty">
          <ShoppingBag size={46} />
          <h3>سبد شما هنوز خالی است</h3>
          <Link
            className="button primary"
            href="/shop"
            onClick={() => setCartOpen(false)}
          >
            کشف محصولات
            <ArrowLeft size={18} />
          </Link>
        </div>
      )}
    </Modal>
  );
}
export default function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const [mega, setMega] = useState(false),
    [mobile, setMobile] = useState(false),
    [search, setSearch] = useState(false);
  const { count, setCartOpen, compare } = useStore();
  useEffect(() => {
    setMega(false);
    setMobile(false);
    setCartOpen(false);
  }, [path, setCartOpen]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMega(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);
  if (path === "/asset-studio") return children;
  return (
    <>
      <a className="skip-link" href="#main">
        رفتن به محتوای اصلی
      </a>
      <div className="topbar">
        <span>نگاهی دقیق‌تر. دنیایی امن‌تر.</span>
        <span>
          RADSYSTEM EXPERIENCE <i /> نسخه نمایشی
        </span>
      </div>
      <header className="site-header" onMouseLeave={() => setMega(false)}>
        <div className="header-inner">
          <Brand />
          <nav className="desktop-nav" aria-label="ناوبری اصلی">
            <Link href="/" className={path === "/" ? "active" : ""}>
              خانه
            </Link>
            <div onMouseEnter={() => setMega(true)}>
              <button
                className={path.startsWith("/shop") ? "active" : ""}
                onClick={() => setMega(!mega)}
                aria-expanded={mega}
                aria-controls="mega-menu"
              >
                محصولات
                <ChevronDown size={13} />
              </button>
            </div>
            <Link
              href="/configurator"
              className={path === "/configurator" ? "active" : ""}
            >
              سیستم‌ساز
            </Link>
            <Link href="/shop?brand=RAD%20Concept">مجموعه‌ها</Link>
            <Link href="/consultation">مشاوره و نصب</Link>
          </nav>
          <div className="header-tools">
            <button
              className="icon-button"
              title="جستجو"
              aria-label="جستجو"
              onClick={() => setSearch(true)}
            >
              <Search size={20} />
            </button>
            <Link
              className="icon-button account-icon"
              title="حساب کاربری"
              aria-label="حساب کاربری"
              href="/account"
            >
              <UserRound size={20} />
            </Link>
            <button
              className="cart-trigger"
              aria-label="باز کردن سبد خرید"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingBag size={19} />
              <span>{fa(count)}</span>
            </button>
            <button
              className="icon-button mobile-menu"
              aria-label="فهرست"
              onClick={() => setMobile(true)}
            >
              <Menu size={23} />
            </button>
          </div>
        </div>
        {mega && (
          <div className="mega-menu" id="mega-menu">
            <div>
              <span className="eyebrow">THE COLLECTION</span>
              <h3>برای هر زاویه، یک انتخاب</h3>
              <Link className="text-link" href="/shop">
                همه محصولات
                <ArrowUpLeft size={16} />
              </Link>
              <Link href="/compare" className="text-link">
                مقایسه محصولات
                <GitCompareArrows size={16} />
              </Link>
            </div>
            {categories.slice(0, 4).map((c) => (
              <Link
                className="mega-category"
                key={c.id}
                href={`/shop?category=${c.id}`}
              >
                <img src={c.image} alt="" />
                <strong>{c.name}</strong>
                <span dir="ltr">{c.english}</span>
              </Link>
            ))}
          </div>
        )}
      </header>
      <main id="main">{children}</main>
      <footer className="site-footer">
        <div className="footer-top">
          <div className="footer-brand">
            <Brand />
            <p>امنیت از زاویه‌ای تازه.</p>
            <span className="muted small">
              تجربه‌ای تازه از انتخاب تجهیزات نظارتی.
            </span>
          </div>
          <div>
            <h4>دنیای راد سیستم</h4>
            <Link href="/shop">فروشگاه</Link>
            <Link href="/configurator">سیستم‌ساز</Link>
            <Link href="/compare">مقایسه محصولات</Link>
            <Link href="/consultation">مشاوره و نصب</Link>
          </div>
          <div>
            <h4>همراه شما</h4>
            <Link href="/account">پیگیری سفارش</Link>
            <Link href="/info/shipping">اطلاعات ارسال</Link>
            <Link href="/info/returns">شرایط بازگشت</Link>
            <Link href="/info/privacy">حریم خصوصی</Link>
          </div>
          <div className="footer-contact">
            <h4>در ارتباط باشیم</h4>
            <p>
              اطلاعات تماس و ساعت کاری
              <br />
              پس از تأیید فروشگاه درج می‌شود.
            </p>
            <Link className="text-link" href="/consultation">
              درخواست مشاوره
              <ArrowUpLeft size={17} />
            </Link>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {fa(2026)} راد سیستم. نسخه پیش‌نمایش.</span>
          <span className="latin">DESIGNED TO SEE MORE.</span>
          <Link href="/admin">پیش‌نمایش مدیریت</Link>
        </div>
      </footer>
      {compare.length > 0 && path !== "/compare" && (
        <Link className="compare-dock" href="/compare">
          <GitCompareArrows size={19} />
          مقایسه <span>{fa(compare.length)}</span>
          <ArrowLeft size={17} />
        </Link>
      )}
      <SearchDialog open={search} close={() => setSearch(false)} />
      <CartDrawer />
      <Modal
        open={mobile}
        onClose={() => setMobile(false)}
        className="mobile-drawer"
        label="فهرست اصلی"
      >
        <Brand />
        <nav>
          <Link href="/">خانه</Link>
          <Link href="/shop">همه محصولات</Link>
          <details>
            <summary>دسته‌بندی محصولات</summary>
            {categories.map((c) => (
              <Link key={c.id} href={`/shop?category=${c.id}`}>
                {c.name}
              </Link>
            ))}
          </details>
          <Link href="/configurator">سیستم‌ساز</Link>
          <Link href="/compare">مقایسه محصولات</Link>
          <Link href="/consultation">مشاوره و نصب</Link>
          <Link href="/account">حساب کاربری</Link>
        </nav>
      </Modal>
    </>
  );
}
