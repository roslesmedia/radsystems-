import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/ui";
const content: Record<string, { title: string; body: string }> = {
  shipping: {
    title: "اطلاعات ارسال",
    body: "روش‌های ارسال، محدوده جغرافیایی، هزینه و زمان تحویل پس از تأیید فروشگاه در این صفحه منتشر می‌شود. نسخه فعلی فقط پیش‌نمایش است و سفارشی ارسال نمی‌کند.",
  },
  returns: {
    title: "شرایط بازگشت",
    body: "شرایط مرجوعی و ضمانت باید توسط فروشگاه تأیید و پیش از شروع فروش منتشر شوند. در نسخه نمایشی، هیچ خرید یا تعهد ضمانتی ایجاد نمی‌شود.",
  },
  privacy: {
    title: "حریم خصوصی",
    body: "سبد خرید و فهرست مقایسه این پیش‌نمایش در مرورگر شما ذخیره می‌شوند. اطلاعات فرم‌های آزمایشی به سرور ارسال نمی‌شوند. این سایت در حال حاضر تحلیلگر شخص ثالث یا درگاه پرداخت ندارد. سیاست کامل پردازش داده‌ها پیش از راه‌اندازی فروشگاه واقعی منتشر می‌شود.",
  },
};
export function generateStaticParams() {
  return Object.keys(content).map((slug) => ({ slug }));
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const info = content[slug];
  if (!info) notFound();
  return (
    <div className="page-container info-page">
      <Breadcrumb items={[{ label: info.title }]} />
      <h1>{info.title}</h1>
      <p>{info.body}</p>
    </div>
  );
}
