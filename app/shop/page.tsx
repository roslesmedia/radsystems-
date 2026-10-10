import { Suspense } from "react";
import Shop from "@/components/shop";
export const metadata = {
  title: "فروشگاه",
  alternates: { canonical: "/shop" },
};
export default function Page() {
  return (
    <Suspense
      fallback={<div className="page-container">در حال دریافت محصولات...</div>}
    >
      <Shop />
    </Suspense>
  );
}
