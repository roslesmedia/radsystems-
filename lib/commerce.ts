export type CategoryId =
  | "bullet"
  | "dome"
  | "ptz"
  | "nvr"
  | "dvr"
  | "storage"
  | "accessories"
  | "network";
export type Product = {
  id: string;
  slug: string;
  name: string;
  model: string;
  brand: string;
  category: CategoryId;
  price: number;
  stock: number;
  image: string;
  resolution?: number;
  protocol?: "IP" | "Analog";
  channels?: number;
  capacity?: number;
  outdoor?: boolean;
  poe?: boolean;
  description: string;
  demo: true;
};
export const categories: {
  id: CategoryId;
  name: string;
  english: string;
  image: string;
}[] = [
  {
    id: "bullet",
    name: "دوربین بولت",
    english: "BULLET CAMERAS",
    image: "/images/bullet.webp",
  },
  {
    id: "dome",
    name: "دوربین دام",
    english: "DOME CAMERAS",
    image: "/images/dome.webp",
  },
  {
    id: "ptz",
    name: "دوربین گردان",
    english: "PTZ CAMERAS",
    image: "/images/ptz.webp",
  },
  {
    id: "nvr",
    name: "ضبط‌کننده شبکه",
    english: "NVR RECORDERS",
    image: "/images/nvr.webp",
  },
  {
    id: "dvr",
    name: "ضبط‌کننده دیجیتال",
    english: "DVR RECORDERS",
    image: "/images/nvr.webp",
  },
  {
    id: "storage",
    name: "ذخیره‌سازی",
    english: "SURVEILLANCE STORAGE",
    image: "/images/storage.webp",
  },
  {
    id: "accessories",
    name: "لوازم جانبی",
    english: "ACCESSORIES",
    image: "/images/accessories.webp",
  },
  {
    id: "network",
    name: "تجهیزات شبکه",
    english: "NETWORK EQUIPMENT",
    image: "/images/network.webp",
  },
];
const series = [
  "VISION",
  "ORBIT",
  "PANORAMA",
  "RECORD",
  "ANALOG",
  "VAULT",
  "MOUNT",
  "CONNECT",
];
const basePrices = [
  4200000, 3800000, 12900000, 8700000, 5600000, 3200000, 450000, 2400000,
];
// All specifications and prices describe fictional demo products, never manufacturer inventory.
export const products: Product[] = Array.from({ length: 104 }, (_, i) => {
  const c = i % 8,
    v = Math.floor(i / 8),
    category = categories[c];
  const model = `RAD-${series[c]}-${String(v + 1).padStart(2, "0")}`;
  return {
    id: String(i + 1),
    slug: model.toLowerCase(),
    name: `${category.name} ${["ویژن", "اوربیت", "پانوراما", "رکورد", "آنالوگ", "والت", "مانت", "کانکت"][c]} ${v + 1}`,
    model,
    brand: v % 2 ? "RAD Studio" : "RAD Concept",
    category: category.id,
    price: basePrices[c] + v * 250000,
    stock: v === 4 ? 0 : 4 + v,
    image: category.image,
    resolution: c < 3 ? [4, 8, 2][v % 3] : undefined,
    protocol: c < 4 ? "IP" : c === 4 ? "Analog" : undefined,
    channels: c === 3 || c === 4 ? [8, 16, 32][v % 3] : undefined,
    capacity: c === 5 ? [2, 4, 8][v % 3] : undefined,
    outdoor: c < 3 ? c !== 1 : undefined,
    poe: c < 4 || c === 7 ? true : undefined,
    description:
      "محصول مفهومی از مجموعه نمایشی راد سیستم. مشخصات و قیمت این محصول برای بررسی تجربه فروشگاه ارائه شده‌اند و موجودی واقعی نیستند.",
    demo: true,
  };
});
export const featuredProducts = products.slice(0, 6);
export const fa = (n: number) => new Intl.NumberFormat("fa-IR").format(n);
export const price = (n: number) => fa(n);
export function normalize(text: string) {
  return text
    .toLowerCase()
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/[\u200c\u200f]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
export function searchProducts(query: string, source = products) {
  const tokens = normalize(query).split(" ").filter(Boolean);
  return source.filter((p) =>
    tokens.every((q) =>
      normalize(
        `${p.name} ${p.model} ${p.brand} ${categories.find((c) => c.id === p.category)?.name} ${p.resolution ?? ""} ${p.resolution ? fa(p.resolution) + " مگاپیکسل" : ""} ${p.protocol ?? ""} ${p.poe ? "PoE" : ""}`,
      ).includes(q),
    ),
  );
}
export interface CommerceAdapter {
  mode: "demo" | "live";
  listProducts: () => Promise<Product[]>;
  getProduct: (slug: string) => Promise<Product | undefined>;
  search: (query: string) => Promise<Product[]>;
}
export const demoCommerce: CommerceAdapter = {
  mode: "demo",
  listProducts: async () => products,
  getProduct: async (slug) => products.find((p) => p.slug === slug),
  search: async (query) => searchProducts(query),
};
export const commerce = demoCommerce;
export const specRows = (p: Product): [string, string][] => [
  ["مدل", p.model],
  ["مجموعه", p.brand],
  ...(p.resolution
    ? [["وضوح تصویر", `${fa(p.resolution)} مگاپیکسل`] as [string, string]]
    : []),
  ...(p.protocol ? [["پروتکل", p.protocol] as [string, string]] : []),
  ...(p.channels ? [["تعداد کانال", fa(p.channels)] as [string, string]] : []),
  ...(p.capacity
    ? [["ظرفیت", `${fa(p.capacity)} ترابایت`] as [string, string]]
    : []),
  ...(p.outdoor !== undefined
    ? [["محیط پیشنهادی", p.outdoor ? "بیرونی" : "داخلی"] as [string, string]]
    : []),
  ...(p.poe !== undefined
    ? [["تغذیه PoE", p.poe ? "دارد" : "ندارد"] as [string, string]]
    : []),
];
