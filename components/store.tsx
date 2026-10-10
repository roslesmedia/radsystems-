"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { products, type Product } from "@/lib/commerce";
export type CartLine = { id: string; quantity: number };
type Store = {
  cart: CartLine[];
  add: (id: string, quantity?: number) => void;
  addPackage: (lines: CartLine[]) => void;
  setQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  compare: string[];
  toggleCompare: (id: string) => void;
  toast: string;
  notify: (text: string) => void;
  count: number;
  total: number;
  hydrated: boolean;
};
const StoreContext = createContext<Store | null>(null);
function validLines(data: unknown): CartLine[] {
  if (!Array.isArray(data)) return [];
  return data.flatMap((line) => {
    const p = products.find((p) => p.id === line?.id);
    return p && p.stock && Number.isInteger(line.quantity) && line.quantity > 0
      ? [{ id: p.id, quantity: Math.min(p.stock, line.quantity) }]
      : [];
  });
}
export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]),
    [compare, setCompare] = useState<string[]>([]),
    [cartOpen, setCartOpen] = useState(false),
    [toast, setToast] = useState(""),
    [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    try {
      setCart(
        validLines(JSON.parse(localStorage.getItem("rad-cart-v1") || "[]")),
      );
      const saved = JSON.parse(localStorage.getItem("rad-compare-v1") || "[]");
      if (Array.isArray(saved))
        setCompare(
          saved
            .filter((id: unknown) => products.some((p) => p.id === id))
            .slice(0, 4),
        );
    } catch {}
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (hydrated) {
      try {
        localStorage.setItem("rad-cart-v1", JSON.stringify(cart));
        localStorage.setItem("rad-compare-v1", JSON.stringify(compare));
      } catch {}
    }
  }, [cart, compare, hydrated]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 3500);
    return () => clearTimeout(t);
  }, [toast]);
  const notify = useCallback((text: string) => setToast(text), []);
  const addPackage = (lines: CartLine[]) => {
    setCart((current) => {
      const next = [...current];
      for (const line of validLines(lines)) {
        const p = products.find((p) => p.id === line.id)!;
        const existing = next.find((l) => l.id === line.id);
        if (existing) {
          next[next.indexOf(existing)] = {
            ...existing,
            quantity: Math.min(p.stock, existing.quantity + line.quantity),
          };
        } else next.push(line);
      }
      return next;
    });
    setCartOpen(true);
  };
  const value: Store = {
    cart,
    add: (id, quantity = 1) => addPackage([{ id, quantity }]),
    addPackage,
    setQuantity: (id, quantity) =>
      setCart((c) =>
        validLines(c.map((l) => (l.id === id ? { ...l, quantity } : l))),
      ),
    clearCart: () => setCart([]),
    cartOpen,
    setCartOpen,
    compare,
    toggleCompare: (id) => {
      if (!compare.includes(id) && compare.length >= 4) {
        notify("حداکثر چهار محصول قابل مقایسه است.");
        return;
      }
      setCompare((c) =>
        c.includes(id) ? c.filter((i) => i !== id) : [...c, id],
      );
    },
    toast,
    notify,
    count: cart.reduce((n, l) => n + l.quantity, 0),
    total: cart.reduce(
      (n, l) =>
        n + (products.find((p) => p.id === l.id)?.price || 0) * l.quantity,
      0,
    ),
    hydrated,
  };
  return (
    <StoreContext.Provider value={value}>
      {children}
      <div className={`toast ${toast ? "visible" : ""}`} role="status">
        {toast}
      </div>
    </StoreContext.Provider>
  );
}
export const useStore = () => {
  const store = useContext(StoreContext);
  if (!store) throw new Error("StoreProvider missing");
  return store;
};
export const findProduct = (id: string): Product =>
  products.find((p) => p.id === id)!;
