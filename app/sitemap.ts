import type { MetadataRoute } from "next";
import { products } from "@/lib/commerce";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return [
    "",
    "/shop",
    "/configurator",
    "/consultation",
    ...products.map((p) => `/product/${p.slug}`),
  ].map((path) => ({
    url: base + path,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));
}
