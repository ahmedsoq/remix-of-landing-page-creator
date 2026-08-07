import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "elsoooq — كاميرا مراقبة جيب صوت وصورة | 1200ج بدل 1900" },
      {
        name: "description",
        content:
          "كاميرا مراقبة صغيرة تسجل صوت وصورة بجودة 1080P بدون إنترنت. رؤية ليلية ومشبك معدني. 1200 جنيه بدل 1900، الدفع عند الاستلام وشحن مجاني لكل محافظات مصر.",
      },
      { property: "og:title", content: "elsoooq — كاميرا مراقبة جيب صوت وصورة بدون إنترنت" },
      {
        property: "og:description",
        content: "1080P فيديو وصوت، رؤية ليلية، بدون إنترنت. 1200ج بدل 1900 مع الدفع عند الاستلام وشحن مجاني.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

/**
 * الصفحة بالكامل موجودة في ملف واحد: public/elsoooq.html
 * (HTML + CSS + JS + المحافظات + لوحة التحكم) — قابل للنقل لأي استضافة.
 */
function Landing() {
  useEffect(() => {
    window.location.replace("/elsoooq.html" + window.location.hash);
  }, []);

  return (
    <main dir="rtl" className="flex min-h-screen items-center justify-center p-6 text-center">
      <h1 className="text-lg font-black">جاري تحويلك إلى صفحة elsoooq…</h1>
    </main>
  );
}
