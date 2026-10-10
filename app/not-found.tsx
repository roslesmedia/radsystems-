import Link from "next/link";
export default function NotFound() {
  return (
    <div className="page-container empty">
      <span className="eyebrow">404 / OUT OF FRAME</span>
      <h1>این زاویه هنوز در قاب ما نیست.</h1>
      <Link className="button primary" href="/shop">
        بازگشت به فروشگاه
      </Link>
    </div>
  );
}
