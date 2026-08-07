import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import camMain from "@/assets/cam-main.png.asset.json";
import camFront from "@/assets/cam-front.png.asset.json";
import camSide from "@/assets/cam-side.png.asset.json";
import camWorn from "@/assets/cam-worn.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "كاميرا مراقبة جيب صوت وصورة بدون إنترنت | 1200ج بدل 1900" },
      {
        name: "description",
        content:
          "كاميرا مراقبة صغيرة تسجل صوت وصورة بجودة 1080P بدون إنترنت. رؤية ليلية ومشبك معدني. 1200 جنيه بدل 1900، الدفع عند الاستلام وشحن مجاني لكل محافظات مصر.",
      },
      { property: "og:title", content: "كاميرا مراقبة جيب صوت وصورة بدون إنترنت" },
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
  adminPass: string;
};

const DEFAULTS: Settings = {
  botToken: "",
  chatId: "",
  price: "1200",
  oldPrice: "1900",
  productName: "كاميرا مراقبة جيب صوت وصورة بدون إنترنت",
  whatsapp: "",
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

const GOVS = [
  "القاهرة","الجيزة","الإسكندرية","القليوبية","الشرقية","الدقهلية","المنوفية","الغربية","البحيرة",
  "كفر الشيخ","دمياط","بورسعيد","الإسماعيلية","السويس","شمال سيناء","جنوب سيناء","بني سويف",
  "الفيوم","المنيا","أسيوط","سوهاج","قنا","الأقصر","أسوان","البحر الأحمر","الوادي الجديد","مطروح",
];

const GALLERY = [
  { src: camMain.url, alt: "كاميرا المراقبة من الأمام والخلف" },
  { src: camFront.url, alt: "كاميرا المراقبة من الأمام" },
  { src: camSide.url, alt: "كاميرا المراقبة من الجانب والمشبك المعدني" },
  { src: camWorn.url, alt: "الكاميرا مثبتة على جيب القميص" },
];

const FEATURES = [
  { glow: "glow-orange", icon: "🎥", t: "جودة 1080P Full HD", d: "فيديو واضح وصوت نقي يسجل كل التفاصيل حولك." },
  { glow: "glow-cyan", icon: "🌙", t: "رؤية ليلية", d: "تصوير واضح في الظلام الدامس بدون أي إضاءة." },
  { glow: "glow-lime", icon: "📴", t: "تعمل بدون إنترنت", d: "تسجل على كارت الميموري مباشرة، لا تحتاج واي فاي." },
  { glow: "glow-pink", icon: "🧲", t: "مشبك معدني قوي", d: "ثبتها على الجيب أو الحزام أو أي مكان في ثانية." },
  { glow: "glow-violet", icon: "🔄", t: "عدسة دوارة", d: "لف العدسة لتصوير أي زاوية تريدها بسهولة." },
  { glow: "glow-yellow", icon: "🔋", t: "بطارية تدوم طويلاً", d: "ساعات تسجيل متواصل وشحن سريع بكابل USB." },
];

/* ================= الصفحة ================= */

function LandingPage() {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [adminOpen, setAdminOpen] = useState(false);

  useEffect(() => {
    setSettings(loadSettings());
    const check = () => setAdminOpen(window.location.hash === "#admin-2024");
    check();
    window.addEventListener("hashchange", check);
    return () => window.removeEventListener("hashchange", check);
  }, []);

  return (
    <div dir="rtl" className="mx-auto max-w-5xl px-4 pb-16 pt-6">
      {/* شريط العرض */}
      <div className="glass cta-pulse mb-6 rounded-2xl px-4 py-3 text-center text-sm md:text-base">
        🔥 عرض محدود: شحن مجاني لكل محافظات مصر + الدفع عند الاستلام
      </div>

      {/* الهيرو */}
      <section className="glass glow-violet overflow-hidden p-5 md:p-8">
        <div className="grid items-center gap-6 md:grid-cols-2">
          <div className="text-center md:text-right">
            <span className="glass glow-lime inline-block rounded-full px-4 py-1 text-xs">1080P Full HD • صوت وصورة</span>
            <h1 className="mt-4 text-3xl font-black leading-tight md:text-5xl">{settings.productName}</h1>
            <p className="mt-3 text-base opacity-90">
              كاميرا صغيرة تخفيها في أي مكان، تسجل صوت وصورة بجودة عالية، رؤية ليلية، وتعمل بدون إنترنت.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3 md:justify-start">
              <div className="glass glow-orange px-5 py-3 text-2xl font-black">{settings.price} ج</div>
              <div className="text-xl line-through opacity-60">{settings.oldPrice} ج</div>
              <div className="glass glow-yellow px-3 py-2 text-sm">وفر {Number(settings.oldPrice) - Number(settings.price)} ج</div>
            </div>
            <a
              href="#order"
              className="cta-pulse mt-5 inline-block rounded-2xl px-8 py-4 text-lg font-black shadow-lg"
            >
              اطلب الآن — الدفع عند الاستلام
            </a>
          </div>
          <img src={camMain.url} alt="كاميرا المراقبة من الأمام والخلف" className="mx-auto w-full max-w-md drop-shadow-2xl" />
        </div>
      </section>

      {/* المزايا */}
      <h2 className="mt-10 text-center text-2xl font-black md:text-3xl">لماذا هذه الكاميرا؟</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f) => (
          <div key={f.t} className={`glass ${f.glow} p-5`}>
            <div className="text-3xl">{f.icon}</div>
            <h3 className="mt-2 text-lg font-black">{f.t}</h3>
            <p className="mt-1 text-sm opacity-90">{f.d}</p>
          </div>
        ))}
      </div>

      {/* الصور */}
      <h2 className="mt-10 text-center text-2xl font-black md:text-3xl">صور المنتج</h2>
      <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">
        {GALLERY.map((g, i) => (
          <div key={g.src} className={`glass ${["glow-cyan", "glow-orange", "glow-lime", "glow-pink"][i]} p-2`}>
            <img src={g.src} alt={g.alt} loading="lazy" className="h-40 w-full rounded-xl object-contain" />
          </div>
        ))}
      </div>

      {/* الطلب */}
      <OrderForm settings={settings} />

      {/* لوحة التحكم المخفية */}
      {adminOpen && <AdminPanel settings={settings} onSave={setSettings} />}

      <footer className="mt-10 text-center text-xs opacity-60">
        © {new Date().getFullYear()} — جميع الحقوق محفوظة
      </footer>
    </div>
  );
}

/* ================= نموذج الطلب ================= */

function OrderForm({ settings }: { settings: Settings }) {
  const [form, setForm] = useState({ name: "", phone: "", gov: "", address: "" });
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [k]: e.target.value.slice(0, 200) });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const name = form.name.trim();
    const phone = form.phone.trim();
    const address = form.address.trim();

    if (name.length < 3) return fail("اكتب الاسم بالكامل");
    if (!/^01[0-2,5]\d{8}$/.test(phone)) return fail("رقم الموبايل غير صحيح (11 رقم يبدأ بـ 01)");
    if (!form.gov) return fail("اختر المحافظة");
    if (address.length < 6) return fail("اكتب العنوان بالتفصيل");
    if (!settings.botToken || !settings.chatId) return fail("لم يتم ضبط إعدادات الإشعارات بعد. تواصل معنا هاتفياً.");

    setState("sending");
    setMsg("");
    const text =
      `🛒 طلب جديد\n\n` +
      `📦 المنتج: ${settings.productName}\n` +
      `💰 السعر: ${settings.price} ج (الدفع عند الاستلام)\n\n` +
      `👤 الاسم: ${name}\n` +
      `📞 الهاتف: ${phone}\n` +
      `🏙️ المحافظة: ${form.gov}\n` +
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
      setForm({ name: "", phone: "", gov: "", address: "" });
    } catch (err) {
      setState("error");
      setMsg(err instanceof Error ? err.message : "حدث خطأ، حاول مرة أخرى");
    }
  }

  function fail(m: string) {
    setState("error");
    setMsg(m);
  }

  const field = "mt-1 w-full rounded-xl border-2 border-white/25 bg-white/10 px-4 py-3 font-bold text-inherit outline-none placeholder:opacity-60 focus:border-white/60";

  return (
    <section id="order" className="glass glow-lime mt-10 p-5 md:p-8">
      <h2 className="text-center text-2xl font-black md:text-3xl">اطلب الآن</h2>
      <p className="mt-2 text-center text-sm opacity-90">
        الدفع عند الاستلام • شحن مجاني لكل محافظات مصر • السعر {settings.price} ج
      </p>

      {state === "done" ? (
        <div className="glass glow-cyan mt-6 p-6 text-center">
          <div className="text-4xl">✅</div>
          <h3 className="mt-2 text-xl font-black">تم استلام طلبك بنجاح</h3>
          <p className="mt-1 text-sm opacity-90">هنتواصل معك تليفونياً لتأكيد الطلب.</p>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-sm">الاسم بالكامل</span>
            <input className={field} value={form.name} onChange={set("name")} maxLength={100} placeholder="محمد أحمد" />
          </label>
          <label className="block">
            <span className="text-sm">رقم الموبايل</span>
            <input className={field} value={form.phone} onChange={set("phone")} inputMode="tel" maxLength={11} placeholder="01xxxxxxxxx" />
          </label>
          <label className="block">
            <span className="text-sm">المحافظة</span>
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
            <span className="text-sm">العنوان بالتفصيل</span>
            <input className={field} value={form.address} onChange={set("address")} maxLength={200} placeholder="المدينة - الشارع - رقم العقار" />
          </label>

          {msg && <p className="md:col-span-2 text-center text-sm font-black text-brand-yellow">{msg}</p>}

          <button
            type="submit"
            disabled={state === "sending"}
            className="cta-pulse md:col-span-2 rounded-2xl px-8 py-4 text-lg font-black disabled:opacity-70"
          >
            {state === "sending" ? "جاري الإرسال..." : "تأكيد الطلب"}
          </button>
        </form>
      )}
    </section>
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
      <section className="glass glow-pink mt-10 p-6">
        <h2 className="text-xl font-black">لوحة التحكم</h2>
        <input
          type="password"
          className={field}
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          placeholder="كلمة المرور"
        />
        <button
          onClick={() => setOk(pass === settings.adminPass)}
          className="cta-pulse mt-3 rounded-xl px-6 py-3 font-black"
        >
          دخول
        </button>
        {pass && pass !== settings.adminPass && <p className="mt-2 text-sm">كلمة المرور غير صحيحة</p>}
      </section>
    );
  }

  return (
    <section className="glass glow-pink mt-10 p-5 md:p-8">
      <h2 className="text-2xl font-black">لوحة التحكم المخفية</h2>
      <p className="mt-1 text-sm opacity-80">
        الإعدادات محفوظة في هذا المتصفح، والتغييرات تُطبق فوراً على الصفحة.
      </p>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {(
          [
            ["botToken", "توكن بوت تليجرام"],
            ["chatId", "أيدي الشات (Chat ID)"],
            ["price", "السعر الحالي"],
            ["oldPrice", "السعر القديم"],
            ["productName", "اسم المنتج"],
            ["whatsapp", "رقم واتساب (اختياري)"],
            ["adminPass", "كلمة مرور اللوحة"],
          ] as [keyof Settings, string][]
        ).map(([k, label]) => (
          <label key={k} className="block">
            <span className="text-sm">{label}</span>
            <input className={field} value={draft[k]} onChange={(e) => setDraft({ ...draft, [k]: e.target.value })} />
          </label>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
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
