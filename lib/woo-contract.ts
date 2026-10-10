import type { CommerceAdapter } from "./commerce";
/** Implement only on the server. Never import merchant credentials into client components. */
export interface LiveCommerceAdapter extends CommerceAdapter {
  mode: "live";
  createHostedCheckout: (
    items: { productId: number; quantity: number }[],
  ) => Promise<{ url: string }>;
}
export type WooCurrencyUnit = "IRR" | "IRT";
export function wooAmountToToman(
  amount: number,
  currency: WooCurrencyUnit,
): number {
  if (!Number.isSafeInteger(amount) || amount < 0)
    throw new Error("Invalid integer currency amount");
  if (currency === "IRR" && amount % 10 !== 0)
    throw new Error("Amount cannot be represented as whole toman");
  return currency === "IRR" ? amount / 10 : amount;
}
