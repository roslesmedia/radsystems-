export function storageTB(cameras, mbps, days) {
  return (
    Math.ceil(
      ((((cameras * mbps * 1e6) / 8) * 86400 * days * 1.15) / 1e12) * 10,
    ) / 10
  );
}
export function compatibility(camera, recorder, quantity) {
  const warnings = [];
  if (!camera || !recorder) return ["دوربین و ضبط‌کننده را انتخاب کنید."];
  if (camera.protocol !== recorder.protocol)
    warnings.push("پروتکل دوربین با ضبط‌کننده سازگار نیست.");
  if ((recorder.channels ?? 0) < quantity)
    warnings.push("تعداد کانال ضبط‌کننده کافی نیست.");
  return warnings;
}
export function adjustPrice(oldPrice, method, amount) {
  if (!Number.isFinite(amount)) throw new Error("Invalid amount");
  const next =
    method === "percent" ? oldPrice * (1 + amount / 100) : oldPrice + amount;
  if (!Number.isFinite(next) || next < 0) throw new Error("Invalid price");
  return Math.round(next / 1000) * 1000;
}
