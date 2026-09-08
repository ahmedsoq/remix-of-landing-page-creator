import { CATALOG } from "./catalog";

const GRAPH = "https://graph.facebook.com/v21.0";

export const SYSTEM_PROMPT = `أنت "مساعد elsoooq" — موظف مبيعات مصري حقيقي بيرد على واتساب متجر elsoooq.

قواعد إلزامية:
- اتكلم بالعامية المصرية البسيطة، جمل قصيرة، ودود ومحترم، من غير رسمية زائدة.
- ممنوع تماماً اختراع أي معلومة. لو مش موجودة في قائمة المنتجات تحت، قول: "هبعتلك التفاصيل دي من زميلي حالاً" ولا تخمّن.
- الأسعار والمواصفات من القائمة فقط.
- الدفع عند الاستلام، والشحن مجاني لكل محافظات مصر، والتسليم من 2 لـ 4 أيام.
- لو العميل عايز يطلب، اجمع منه بالترتيب: الاسم بالكامل، رقم الموبايل، المحافظة، العنوان بالتفصيل، اسم المنتج والكمية.
- لما تكمل كل بيانات الطلب، اكتب في آخر ردك سطر منفصل بالشكل ده بالظبط:
[ORDER]{"name":"...","phone":"...","governorate":"...","address":"...","product":"...","qty":1,"total":0}
العميل مش هيشوف السطر ده.
- تعامل مع الاعتراضات (السعر غالي / مش واثق) بهدوء: اذكر الدفع عند الاستلام وضمان المعاينة قبل الدفع.
- خلي الرد أقل من 60 كلمة غالباً.

قائمة المنتجات المتاحة:${CATALOG}`;

export async function sendWhatsAppText(to: string, body: string) {
  const token = process.env["WHATSAPP_TOKEN"];
  const phoneId = process.env["WHATSAPP_PHONE_NUMBER_ID"];
  if (!token || !phoneId) throw new Error("WhatsApp credentials missing");

  const res = await fetch(`${GRAPH}/${phoneId}/messages`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { preview_url: false, body: body.slice(0, 3000) },
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    console.error(`WhatsApp send failed [${res.status}]: ${text}`);
    throw new Error(`WhatsApp send failed [${res.status}]: ${text}`);
  }
}

type Turn = { role: "user" | "assistant"; content: string };

export async function generateReply(history: Turn[]): Promise<string> {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("Missing LOVABLE_API_KEY");

  const res = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
    method: "POST",
    headers: { "Lovable-API-Key": key, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "openai/gpt-6-astra",
      reasoning: { effort: "low" },
      max_output_tokens: 700,
      input: [
        { role: "system", content: SYSTEM_PROMPT },
        ...history.slice(-12),
      ],
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(`AI gateway error [${res.status}]: ${text}`);
    throw new Error(`AI gateway error [${res.status}]`);
  }

  const data = (await res.json()) as {
    output_text?: string;
    output?: Array<{ content?: Array<{ type?: string; text?: string }> }>;
  };
  if (data.output_text) return data.output_text.trim();
  const parts =
    data.output?.flatMap((o) => o.content ?? []).filter((c) => c.type === "output_text") ?? [];
  return parts.map((p) => p.text ?? "").join("").trim();
}

export function extractOrder(reply: string): { clean: string; order: Record<string, unknown> | null } {
  const match = reply.match(/\[ORDER\]\s*(\{[\s\S]*?\})/);
  if (!match) return { clean: reply, order: null };
  let order: Record<string, unknown> | null = null;
  try {
    order = JSON.parse(match[1]!) as Record<string, unknown>;
  } catch {
    order = null;
  }
  return { clean: reply.replace(match[0], "").trim(), order };
}
