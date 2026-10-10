"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUpLeft,
  ScanEye,
  Layers3,
  SlidersHorizontal,
  MoveUpRight,
  Crosshair,
  Cable,
  HardDrive,
  Camera,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CameraScene from "./lazy-scene";
import ProductCard from "./product-card";
import { categories, featuredProducts } from "@/lib/commerce";
import { SectionHeading, DemoNotice } from "./ui";
export default function Home() {
  const sequence = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const trigger = ScrollTrigger.create({
        trigger: sequence.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => setProgress(self.progress),
      });
      return () => trigger.kill();
    });
    return () => media.revert();
  }, []);
  return (
    <>
      <section className="cinema-sequence" ref={sequence}>
        <div className="cinema-sticky">
          <div className="hero-gridlines" />
          <CameraScene hero progress={progress} />
          <div
            className="hero-copy"
            style={{
              opacity: Math.max(0, 1 - progress * 5),
              pointerEvents: progress > 0.25 ? "none" : "auto",
            }}
          >
            <span className="eyebrow">
              <span className="red-rule" /> THE NEXT PERSPECTIVE
            </span>
            <h1>
              امنیت از
              <br />
              زاویه‌ای <span>تازه.</span>
            </h1>
            <p>
              نسل جدید تجهیزات امنیتی
              <br />و سیستم‌های نظارتی حرفه‌ای
            </p>
            <div className="hero-actions">
              <Link className="button primary" href="/shop">
                مشاهده محصولات
                <ArrowUpLeft size={19} />
              </Link>
              <a className="button text-button" href="#technology">
                کشف فناوری
                <ArrowDown size={17} />
              </a>
            </div>
          </div>
          <div className="hero-side-label" dir="ltr">
            PRECISION IN EVERY PERSPECTIVE <span>—</span> RAD / 01
          </div>
          <div
            className="hero-model-label"
            style={{ opacity: Math.max(0, 1 - progress * 5) }}
            dir="ltr"
          >
            <span className="status-dot" /> RAD / VISION 01{" "}
            <small>CONCEPT CAMERA</small>
          </div>
          <div
            className={`technical-copy ${progress > 0.2 && progress < 0.9 ? "shown" : ""}`}
          >
            <span className="eyebrow">ENGINEERED TO SEE MORE</span>
            <h2>
              {progress < 0.5 ? "جزئیاتی که" : "دقت، در هر"}
              <br />
              {progress < 0.5 ? "تفاوت می‌سازند." : "لایه از طراحی."}
            </h2>
            <p>
              {progress < 0.5
                ? "از بدنه تا قلب تصویر؛ نگاهی نزدیک‌تر به طراحی یک دوربین."
                : "پوسته محافظ، مجموعه لنز و حسگر؛ هماهنگ برای یک نگاه دقیق."}
            </p>
            <div className="technical-labels">
              <span>
                <i />
                پوسته محافظ
              </span>
              <span>
                <i />
                مجموعه لنز
              </span>
              <span>
                <i />
                حسگر تصویر
              </span>
            </div>
            <small>مدل مفهومی؛ نمای داخلی، شماتیک است.</small>
          </div>
          <div className="hero-bottom">
            <a href="#technology" className="scroll-cue">
              <ArrowDown size={16} />
              <span>نگاه نزدیک‌تر</span>
              <span className="scroll-line" />
            </a>
            <div className="hero-pagination" dir="ltr">
              <strong>{progress > 0.5 ? "02" : "01"}</strong>
              <span />
              <small>03</small>
            </div>
            <span className="hero-caption">
              طراحی مفهومی راد سیستم <span className="tiny-square" />
            </span>
          </div>
        </div>
        <div id="technology" className="technology-anchor" />
      </section>
      <div className="values-strip">
        <div>
          <ScanEye size={23} />
          <span>
            نگاه دقیق‌تر<small>از هر زاویه</small>
          </span>
        </div>
        <div>
          <Layers3 size={23} />
          <span>
            انتخاب یکپارچه<small>دوربین تا ذخیره‌سازی</small>
          </span>
        </div>
        <div>
          <SlidersHorizontal size={23} />
          <span>
            متناسب با نیاز شما<small>سیستم‌ساز هوشمند</small>
          </span>
        </div>
        <Link href="/consultation">
          <Crosshair size={23} />
          <span>
            شروع با یک گفت‌وگو<small>مشاوره و انتخاب تجهیزات</small>
          </span>
          <ArrowUpLeft size={19} />
        </Link>
      </div>
      <section className="section categories-section">
        <SectionHeading
          eyebrow="01 / EXPLORE THE COLLECTION"
          title="برای هر فضا، یک نگاه."
          href="/shop"
          action="تمام دسته‌بندی‌ها"
        />
        <div className="category-grid">
          {categories.slice(0, 4).map((c, i) => (
            <Link
              className="category-tile"
              href={`/shop?category=${c.id}`}
              key={c.id}
            >
              <span className="category-number" dir="ltr">
                0{i + 1}
              </span>
              <img src={c.image} alt={c.name} loading="lazy" />
              <div>
                <span className="eyebrow">{c.english}</span>
                <h3>{c.name}</h3>
              </div>
              <ArrowUpLeft className="category-arrow" size={23} />
            </Link>
          ))}
        </div>
        <div className="secondary-categories">
          {categories.slice(4).map((c) => (
            <Link href={`/shop?category=${c.id}`} key={c.id}>
              {c.name}
              <ArrowUpLeft size={16} />
            </Link>
          ))}
        </div>
      </section>
      <section className="section featured-section">
        <SectionHeading
          eyebrow="02 / CURATED BY RADSYSTEM"
          title="منتخبِ نگاه‌های دقیق."
          href="/shop"
          action="ورود به فروشگاه"
        />
        <DemoNotice />
        <div className="product-grid home-products">
          {featuredProducts.map((p) => (
            <ProductCard product={p} key={p.id} />
          ))}
        </div>
      </section>
      <section className="builder-band">
        <div className="builder-inner">
          <div className="builder-copy">
            <span className="eyebrow">03 / YOUR SPACE. YOUR SYSTEM.</span>
            <h2>
              امنیت شما،
              <br />
              با انتخاب شما.
            </h2>
            <p>
              از اولین دوربین تا آخرین جزئیات.
              <br />
              سیستم نظارتی متناسب با فضای خود را بسازید.
            </p>
            <Link className="button primary" href="/configurator">
              طراحی سیستم من
              <ArrowUpLeft size={20} />
            </Link>
          </div>
          <div className="system-composition">
            <div className="system-orbit" />
            <img
              className="system-camera"
              src="/images/bullet.webp"
              alt="دوربین مفهومی"
              loading="lazy"
            />
            <img
              className="system-recorder"
              src="/images/nvr.webp"
              alt="ضبط‌کننده مفهومی"
              loading="lazy"
            />
            <img
              className="system-dome"
              src="/images/dome.webp"
              alt="دوربین دام مفهومی"
              loading="lazy"
            />
            <span className="system-label">
              <span className="status-dot" />
              سیستم شما، یکپارچه
            </span>
          </div>
        </div>
        <div className="builder-steps">
          <span>
            <Camera size={17} />
            انتخاب دوربین
          </span>
          <i />
          <span>
            <HardDrive size={17} />
            ضبط و ذخیره‌سازی
          </span>
          <i />
          <span>
            <Cable size={17} />
            تکمیل تجهیزات
          </span>
        </div>
      </section>
      <section className="section brand-section">
        <span className="eyebrow">THE CONCEPT COLLECTIONS</span>
        <div>
          <Link
            href="/shop?brand=RAD%20Concept"
            className="collection-wordmark"
          >
            RAD<span>CONCEPT</span>
            <ArrowUpLeft size={26} />
          </Link>
          <Link
            href="/shop?brand=RAD%20Studio"
            className="collection-wordmark studio"
          >
            RAD<span>STUDIO</span>
            <ArrowUpLeft size={26} />
          </Link>
          <p>
            دو مجموعه مفهومی.
            <br />
            یک نگاه به آینده امنیت.
          </p>
        </div>
      </section>
      <section className="section perspective-section">
        <SectionHeading
          eyebrow="04 / A CLEARER PERSPECTIVE"
          title="پیش از انتخاب، دقیق‌تر ببینید."
        />
        <div className="perspective-grid">
          <Link href="/compare">
            <span>01</span>
            <h3>جزئیات را مقایسه کنید</h3>
            <p>
              مشخصات دوربین‌ها را کنار هم ببینید و انتخاب آگاهانه‌تری داشته
              باشید.
            </p>
            <GitCompareIcon />
          </Link>
          <Link href="/configurator">
            <span>02</span>
            <h3>یکپارچه انتخاب کنید</h3>
            <p>
              دوربین، ضبط‌کننده و فضای ذخیره‌سازی را در یک مجموعه بررسی کنید.
            </p>
            <ArrowUpLeft size={22} />
          </Link>
          <Link href="/consultation">
            <span>03</span>
            <h3>از نیاز خود شروع کنید</h3>
            <p>فضا و اولویت‌های خود را برای یک گفت‌وگوی دقیق‌تر آماده کنید.</p>
            <ArrowUpLeft size={22} />
          </Link>
        </div>
      </section>
      <section className="consultation-band">
        <span className="eyebrow">LET’S FIND YOUR PERSPECTIVE</span>
        <h2>
          هر فضای امن،
          <br />
          با یک انتخاب درست شروع می‌شود.
        </h2>
        <Link className="button light" href="/consultation">
          شروع مشاوره
          <ArrowUpLeft size={20} />
        </Link>
        <span className="consultation-watermark" aria-hidden>
          RAD.
        </span>
      </section>
    </>
  );
}
function GitCompareIcon() {
  return <MoveUpRight size={22} />;
}
