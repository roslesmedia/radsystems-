import type { Metadata, Viewport } from "next";
import "@fontsource-variable/vazirmatn";
import "@fontsource-variable/manrope";
import "./globals.css";
import { StoreProvider } from "@/components/store";
import Shell from "@/components/shell";
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  title: {
    default: "RADSYSTEM | راد سیستم، امنیت از زاویه‌ای تازه",
    template: "%s | راد سیستم",
  },
  description:
    "تجربه انتخاب تجهیزات نظارتی راد سیستم؛ دوربین، ضبط‌کننده و طراحی سیستم امنیتی. نسخه نمایشی فروشگاه.",
  robots: { index: false, follow: false },
  openGraph: { locale: "fa_IR", type: "website", siteName: "RADSYSTEM" },
};
export const viewport: Viewport = {
  themeColor: "#0a0b0e",
  width: "device-width",
  initialScale: 1,
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" data-scroll-behavior="smooth">
      <body>
        <StoreProvider>
          <Shell>{children}</Shell>
        </StoreProvider>
      </body>
    </html>
  );
}
