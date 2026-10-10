"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { X, Minus, Plus, ArrowUpLeft } from "lucide-react";
import Link from "next/link";
import { fa } from "@/lib/commerce";
export function Modal({
  open,
  onClose,
  children,
  className = "",
  label,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  label: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (open && !el?.open) el?.showModal();
    else if (!open && el?.open) el.close();
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);
  return (
    <dialog
      ref={ref}
      className={className}
      aria-label={label}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      <button
        className="icon-button modal-close"
        aria-label="بستن"
        onClick={onClose}
      >
        <X size={22} />
      </button>
      {children}
    </dialog>
  );
}
export function Quantity({
  value,
  onChange,
  max = 99,
}: {
  value: number;
  onChange: (n: number) => void;
  max?: number;
}) {
  return (
    <div className="quantity">
      <button
        aria-label="کاهش تعداد"
        onClick={() => onChange(Math.max(1, value - 1))}
        disabled={value <= 1}
      >
        <Minus size={14} />
      </button>
      <output>{fa(value)}</output>
      <button
        aria-label="افزایش تعداد"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
export function SectionHeading({
  eyebrow,
  title,
  href,
  action = "مشاهده همه",
}: {
  eyebrow: string;
  title: string;
  href?: string;
  action?: string;
}) {
  return (
    <div className="section-heading">
      <div>
        <span className="eyebrow" dir="ltr">
          {eyebrow}
        </span>
        <h2>{title}</h2>
      </div>
      {href && (
        <Link className="text-link" href={href}>
          {action}
          <ArrowUpLeft size={18} />
        </Link>
      )}
    </div>
  );
}
export function Breadcrumb({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <nav className="breadcrumb" aria-label="مسیر صفحه">
      <Link href="/">خانه</Link>
      {items.map((item, i) => (
        <span key={i}>
          <i>/</i>
          {item.href ? <Link href={item.href}>{item.label}</Link> : item.label}
        </span>
      ))}
    </nav>
  );
}
export function DemoNotice({ children }: { children?: ReactNode }) {
  return (
    <div className="demo-notice">
      <span className="status-dot" />
      {children || "نسخه نمایشی · محصولات، موجودی و قیمت‌ها نمونه هستند."}
    </div>
  );
}
