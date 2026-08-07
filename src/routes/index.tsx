import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Facebook, MessageCircle, Phone, X } from "lucide-react";

import camHero from "@/assets/cam-hero.jpg.asset.json";
import featPair from "@/assets/feat-pair.jpg.asset.json";
import featLens from "@/assets/feat-lens.jpg.asset.json";
import featClip from "@/assets/feat-clip.jpg.asset.json";
import featSd from "@/assets/feat-sd.jpg.asset.json";
import sceneKids from "@/assets/scene-kids.jpg.asset.json";
import scenePets from "@/assets/scene-pets.jpg.asset.json";
import sceneTravel from "@/assets/scene-travel.jpg.asset.json";
import sceneHome from "@/assets/scene-home.jpg.asset.json";
import { EGYPT_AREAS, GOVS, UNIT_PRICE, totalFor, unitDiscount } from "@/lib/egypt-areas";

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
  component: LandingPage,
});

/* ================= الإعدادات (لوحة التحكم المخفية) ================= */

type Settings = {
  botToken: string;
  chatId: string;
  price: string;
  oldPrice: string;
  productName: string;
  whatsapp: string;
  facebook: string;
  phone: string;
  adminPass: string;
};

const DEFAULTS: Settings = {
  botToken: "",
  chatId: "",
  price: String(UNIT_PRICE),
  oldPrice: "1900",
  productName: "كاميرا مراقبة جيب صوت وصورة بدون إنترنت",
  whatsapp: "",
  facebook: "",
  phone: "",
  adminPass: "admin123",
};

const STORAGE_KEY = "cam_lp_settings_v1";

function loadSettings(): Settings {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULTS, ...(JSON.parse(raw) as Partial<Settings>) } : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}

const GALLERY: { src: string; alt: string; fit: string }[] = [
  { src: camHero.url, alt: "كاميرا 1080P Full HD — أمام وخلف", fit: "object-cover" },
  { src: featPair.url, alt: "تصميم أنيق ومتين — الوجه والظهر", fit: "object-cover" },
  { src: featLens.url, alt: "عدسة دوّارة 180° لأي زاوية تصوير", fit: "object-cover" },
  { src: featClip.url, alt: "مشبك معدني قوي — 8سم فقط وخفيفة", fit: "object-cover" },
  { src: featSd.url, alt: "تدعم كارت ميموري حتى 128 جيجا", fit: "object-cover" },
  { src: sceneKids.url, alt: "راقب أطفالك في أي وقت", fit: "object-cover" },
  { src: sceneHome.url, alt: "حماية منزلك ليلاً برؤية ليلية", fit: "object-cover" },
  { src: scenePets.url, alt: "راقب حيواناتك أثناء غيابك", fit: "object-cover" },
  { src: sceneTravel.url, alt: "وثّق رحلاتك وأسفارك بجودة عالية", fit: "object-cover" },
];


const FEATURES = [
  { glow: "glow-orange", icon: "🎥", t: "1080P Full HD", d: "صوت وصورة واضحة" },
  { glow: "glow-cyan", icon: "🌙", t: "رؤية ليلية", d: "تصوير في الظلام" },
  { glow: "glow-lime", icon: "📴", t: "بدون إنترنت", d: "تسجل على الميموري" },
  { glow: "glow-pink", icon: "🧲", t: "مشبك معدني", d: "ثبتها في ثانية" },
];


/* ================= الصفحة ================= */

function LandingPage() {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [adminOpen, setAdminOpen] = useState(false);
  const [orderOpen, setOrderOpen] = useState(false);

  useEffect(() => {
    setSettings(loadSettings());
    const check = () => setAdminOpen(window.location.hash === "#admin-2024");
    check();
    window.addEventListener("hashchange", check);
    return () => window.removeEventListener("hashchange", check);
  }, []);

  return (
    <div dir="rtl" className="mx-auto max-w-3xl px-3 pb-10 pt-3">
      {/* شريط الشحن المجاني */}
      <div className="cta-pulse mb-3 flex items-center justify-center gap-2 rounded-2xl px-3 py-3 text-center text-sm font-black md:text-lg">
        🚚 شحن مجاني لكل المحافظات • 💵 الدفع عند الاستلام
      </div>

      {/* كرت الصور + السعر + زر الطلب */}
      <section className="glass glow-violet p-4">
        <h1 className="text-center text-xl font-black leading-snug md:text-3xl">{settings.productName}</h1>
        <Carousel />
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
          <span className="glass glow-orange px-4 py-2 text-xl font-black">{settings.price} ج</span>
          <span className="text-lg line-through opacity-60">{settings.oldPrice} ج</span>
          <span className="glass glow-yellow px-3 py-2 text-xs">
            وفر {Number(settings.oldPrice) - Number(settings.price)} ج
          </span>
        </div>
        <button
          onClick={() => setOrderOpen(true)}
          className="cta-pulse mt-3 w-full rounded-2xl px-6 py-4 text-lg font-black"
        >
          اطلب الآن — الدفع عند الاستلام
        </button>
      </section>

      {/* المواصفات — 4 كروت 2×2 */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        {FEATURES.map((f) => (
          <div key={f.t} className={`glass ${f.glow} flex items-center gap-2 p-3`}>
            <div className="text-2xl">{f.icon}</div>
            <div className="min-w-0 text-right">
              <h3 className="truncate text-sm font-black">{f.t}</h3>
              <p className="truncate text-xs opacity-90">{f.d}</p>
            </div>
          </div>
        ))}
      </div>


      {/* التواصل */}
      <section className="glass glow-cyan mt-4 p-4 text-center">
        <h2 className="text-base font-black">تواصل معنا مباشرة</h2>
        <div className="mt-3 flex items-center justify-center gap-5">
          <SocialCircle
            href={settings.whatsapp ? `https://wa.me/${settings.whatsapp.replace(/\D/g, "")}` : "#"}
            label="واتساب"
            cls="glow-lime"
          >
            <MessageCircle className="size-7" />
          </SocialCircle>
          <SocialCircle href={settings.facebook || "#"} label="فيسبوك" cls="glow-cyan">
            <Facebook className="size-7" />
          </SocialCircle>
          <SocialCircle href={settings.phone ? `tel:${settings.phone}` : "#"} label="اتصال" cls="glow-orange">
            <Phone className="size-7" />
          </SocialCircle>
        </div>
      </section>

      {orderOpen && <OrderModal settings={settings} onClose={() => setOrderOpen(false)} />}
      {adminOpen && <AdminPanel settings={settings} onSave={setSettings} />}

      <footer className="mt-5 text-center text-xs opacity-60">© {new Date().getFullYear()} — جميع الحقوق محفوظة</footer>
    </div>
  );
}

function SocialCircle({
  href,
  label,
  cls,
  children,
}: {
  href: string;
  label: string;
  cls: string;
  children: React.ReactNode;
}) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-1">
      <span className={`glass ${cls} flex size-14 items-center justify-center rounded-full transition-transform hover:scale-110`}>
        {children}
      </span>
      <span className="text-xs font-black">{label}</span>
    </a>
  );
}

/* ================= معرض الصور الديناميكي ================= */

function Carousel() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setI((p) => (p + 1) % GALLERY.length), 2600);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="mt-3">
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-black/20">
        {GALLERY.map((g, idx) => (
          <img
            key={g.src}
            src={g.src}
            alt={g.alt}
            loading={idx === 0 ? "eager" : "lazy"}
            className={`absolute inset-0 h-full w-full transition-all duration-700 ${g.fit} ${
              idx === i ? "scale-100 opacity-100" : "scale-105 opacity-0"
            }`}
          />
        ))}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2 text-center text-xs font-black">
          {GALLERY[i]?.alt}
        </div>
      </div>

      <div className="mt-2 flex justify-center gap-2">
        {GALLERY.map((g, idx) => (
          <button
            key={g.src}
            aria-label={g.alt}
            onClick={() => setI(idx)}
            className={`h-2 rounded-full transition-all ${idx === i ? "w-6 bg-brand-orange" : "w-2 bg-white/40"}`}
          />
        ))}
      </div>
    </div>
  );
}

/* ================= نموذج الطلب (يفتح بعد الضغط) ================= */

function OrderModal({ settings, onClose }: { settings: Settings; onClose: () => void }) {
  const [form, setForm] = useState({ name: "", phone: "", gov: "", area: "", address: "" });
  const [qty, setQty] = useState(1);
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");

  const areas = useMemo(() => (form.gov ? EGYPT_AREAS[form.gov] ?? [] : []), [form.gov]);
  const total = totalFor(qty);
  const disc = unitDiscount(qty);

  const set =
    (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value.slice(0, 200), ...(k === "gov" ? { area: "" } : null) }));

  function fail(m: string) {
    setState("error");
    setMsg(m);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const name = form.name.trim();
    const phone = form.phone.trim();
    const address = form.address.trim();

    if (name.length < 3) return fail("اكتب الاسم بالكامل");
    if (!/^01[0-2,5]\d{8}$/.test(phone)) return fail("رقم الموبايل غير صحيح (11 رقم يبدأ بـ 01)");
    if (!form.gov) return fail("اختر المحافظة");
    if (!form.area) return fail("اختر المركز / المنطقة");
    if (address.length < 6) return fail("اكتب العنوان بالتفصيل");
    if (!settings.botToken || !settings.chatId) return fail("لم يتم ضبط إعدادات الإشعارات بعد. تواصل معنا هاتفياً.");

    setState("sending");
    setMsg("");
    const text =
      `🛒 طلب جديد\n\n` +
      `📦 المنتج: ${settings.productName}\n` +
      `🔢 الكمية: ${qty}\n` +
      `💰 سعر القطعة: ${UNIT_PRICE - disc} ج${disc ? ` (خصم ${disc} ج)` : ""}\n` +
      `🧾 الإجمالي: ${total} ج (الدفع عند الاستلام)\n\n` +
      `👤 الاسم: ${name}\n` +
      `📞 الهاتف: ${phone}\n` +
      `🏙️ المحافظة: ${form.gov}\n` +
      `🏘️ المركز: ${form.area}\n` +
      `📍 العنوان: ${address}\n` +
      `🕒 ${new Date().toLocaleString("ar-EG")}`;

    try {
      const res = await fetch(`https://api.telegram.org/bot${encodeURIComponent(settings.botToken)}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: settings.chatId, text }),
      });
      const data = (await res.json()) as { ok?: boolean; description?: string };
      if (!data.ok) throw new Error(data.description ?? "فشل الإرسال");
      setState("done");
    } catch (err) {
      setState("error");
      setMsg(err instanceof Error ? err.message : "حدث خطأ، حاول مرة أخرى");
    }
  }

  const field =
    "mt-1 w-full rounded-xl border-2 border-white/25 bg-white/10 px-3 py-2.5 text-sm font-bold text-inherit outline-none placeholder:opacity-60 focus:border-white/60";

  return (
    <div dir="rtl" className="fixed inset-0 z-50 overflow-y-auto bg-black/70 p-3 backdrop-blur-sm">
      <div className="glass glow-lime mx-auto mt-4 max-w-lg p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black">اطلب الآن — الدفع عند الاستلام</h2>
          <button onClick={onClose} aria-label="إغلاق" className="glass rounded-full p-2">
            <X className="size-4" />
          </button>
        </div>

        {state === "done" ? (
          <div className="glass glow-cyan mt-4 p-5 text-center">
            <div className="text-4xl">✅</div>
            <h3 className="mt-2 text-lg font-black">تم استلام طلبك بنجاح</h3>
            <p className="mt-1 text-sm opacity-90">هنتواصل معك تليفونياً لتأكيد الطلب.</p>
            <button onClick={onClose} className="cta-pulse mt-4 rounded-xl px-6 py-3 font-black">
              تم
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-3 grid gap-3 md:grid-cols-2">
            <label className="block">
              <span className="text-xs">الاسم بالكامل</span>
              <input className={field} value={form.name} onChange={set("name")} maxLength={100} placeholder="محمد أحمد" />
            </label>
            <label className="block">
              <span className="text-xs">رقم التليفون</span>
              <input className={field} value={form.phone} onChange={set("phone")} inputMode="tel" maxLength={11} placeholder="01xxxxxxxxx" />
            </label>
            <label className="block">
              <span className="text-xs">المحافظة</span>
              <select className={field} value={form.gov} onChange={set("gov")}>
                <option value="">اختر المحافظة</option>
                {GOVS.map((g) => (
                  <option key={g} value={g} className="text-black">
                    {g}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-xs">المركز / المنطقة</span>
              <select className={field} value={form.area} onChange={set("area")} disabled={!form.gov}>
                <option value="">{form.gov ? "اختر المركز" : "اختر المحافظة أولاً"}</option>
                {areas.map((a) => (
                  <option key={a} value={a} className="text-black">
                    {a}
                  </option>
                ))}
              </select>
            </label>
            <label className="block md:col-span-2">
              <span className="text-xs">العنوان بالتفصيل</span>
              <input className={field} value={form.address} onChange={set("address")} maxLength={200} placeholder="المدينة - الشارع - رقم العقار" />
            </label>

            {/* الكمية والخصومات — قائمة منسدلة */}
            <label className="block md:col-span-2">
              <span className="text-xs">عدد القطع (خصم أكبر مع الكمية)</span>
              <select className={field} value={qty} onChange={(e) => setQty(Number(e.target.value))}>
                {[1, 2, 3, 4, 5].map((q) => (
                  <option key={q} value={q} className="text-black">
                    {q} قطعة — {UNIT_PRICE - unitDiscount(q)} ج للقطعة
                    {unitDiscount(q) ? ` (خصم ${unitDiscount(q)} ج)` : ""}
                  </option>
                ))}
              </select>
            </label>


            <div className="glass glow-orange md:col-span-2 flex items-center justify-between px-4 py-3 text-sm font-black">
              <span>الإجمالي</span>
              <span className="text-lg">{total} ج</span>
            </div>

            {msg && <p className="md:col-span-2 text-center text-sm font-black text-brand-yellow">{msg}</p>}

            <button
              type="submit"
              disabled={state === "sending"}
              className="cta-pulse md:col-span-2 rounded-2xl px-6 py-4 text-lg font-black disabled:opacity-70"
            >
              {state === "sending" ? "جاري الإرسال..." : "تأكيد الطلب"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

/* ================= لوحة التحكم المخفية ================= */

function AdminPanel({ settings, onSave }: { settings: Settings; onSave: (s: Settings) => void }) {
  const [pass, setPass] = useState("");
  const [ok, setOk] = useState(false);
  const [draft, setDraft] = useState<Settings>(settings);
  const [saved, setSaved] = useState(false);
  const [testMsg, setTestMsg] = useState("");

  useEffect(() => setDraft(settings), [settings]);

  const field = "mt-1 w-full rounded-xl border-2 border-white/25 bg-white/10 px-4 py-3 font-bold outline-none focus:border-white/60";

  function save() {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    onSave(draft);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  }

  async function test() {
    setTestMsg("جاري الاختبار...");
    try {
      const res = await fetch(`https://api.telegram.org/bot${encodeURIComponent(draft.botToken)}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: draft.chatId, text: "✅ تجربة اتصال ناجحة من صفحة الهبوط" }),
      });
      const data = (await res.json()) as { ok?: boolean; description?: string };
      setTestMsg(data.ok ? "✅ تم إرسال رسالة تجربة" : `❌ ${data.description ?? "فشل"}`);
    } catch {
      setTestMsg("❌ فشل الاتصال");
    }
  }

  if (!ok) {
    return (
      <section className="glass glow-pink mt-6 p-5">
        <h2 className="text-xl font-black">لوحة التحكم</h2>
        <input type="password" className={field} value={pass} onChange={(e) => setPass(e.target.value)} placeholder="كلمة المرور" />
        <button onClick={() => setOk(pass === settings.adminPass)} className="cta-pulse mt-3 rounded-xl px-6 py-3 font-black">
          دخول
        </button>
        {pass && pass !== settings.adminPass && <p className="mt-2 text-sm">كلمة المرور غير صحيحة</p>}
      </section>
    );
  }

  return (
    <section className="glass glow-pink mt-6 p-5">
      <h2 className="text-2xl font-black">لوحة التحكم المخفية</h2>
      <p className="mt-1 text-sm opacity-80">الإعدادات محفوظة في هذا المتصفح، والتغييرات تُطبق فوراً على الصفحة.</p>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {(
          [
            ["botToken", "توكن بوت تليجرام"],
            ["chatId", "أيدي الشات (Chat ID)"],
            ["price", "السعر الحالي"],
            ["oldPrice", "السعر القديم"],
            ["productName", "اسم المنتج"],
            ["whatsapp", "رقم واتساب (2010xxxxxxxx)"],
            ["facebook", "رابط صفحة فيسبوك"],
            ["phone", "رقم الاتصال المباشر"],
            ["adminPass", "كلمة مرور اللوحة"],
          ] as [keyof Settings, string][]
        ).map(([k, label]) => (
          <label key={k} className="block">
            <span className="text-sm">{label}</span>
            <input className={field} value={draft[k]} onChange={(e) => setDraft({ ...draft, [k]: e.target.value })} />
          </label>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <button onClick={save} className="cta-pulse rounded-xl px-6 py-3 font-black">
          حفظ وتطبيق فوراً
        </button>
        <button onClick={test} className="glass glow-cyan rounded-xl px-6 py-3 font-black">
          إرسال رسالة تجربة
        </button>
      </div>
      {saved && <p className="mt-3 text-sm font-black">✅ تم الحفظ والتطبيق</p>}
      {testMsg && <p className="mt-2 text-sm font-black">{testMsg}</p>}
    </section>
  );
}
