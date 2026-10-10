"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="page-container empty">
      <h1>دریافت این صفحه ممکن نشد.</h1>
      <button className="button primary" onClick={reset}>
        تلاش دوباره
      </button>
    </div>
  );
}
