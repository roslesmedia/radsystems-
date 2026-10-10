import { notFound } from "next/navigation";
import { products } from "@/lib/commerce";
import ProductDetail from "@/components/product-detail";
export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = products.find((p) => p.slug === slug);
  return {
    title: p?.name || "محصول یافت نشد",
    alternates: { canonical: `/product/${slug}` },
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = products.find((p) => p.slug === slug);
  if (!p) notFound();
  return <ProductDetail product={p} />;
}
