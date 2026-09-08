import { createFileRoute } from "@tanstack/react-router";

import {
  extractOrder,
  generateReply,
  sendWhatsAppText,
} from "@/lib/whatsapp-agent.server";

type Turn = { role: "user" | "assistant"; content: string };

async function handleMessage(from: string, text: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const { data: rows } = await supabaseAdmin
    .from("wa_messages")
    .select("role, content")
    .eq("wa_id", from)
    .order("created_at", { ascending: false })
    .limit(12);

  const history: Turn[] = ((rows ?? []) as Turn[]).slice().reverse();
  history.push({ role: "user", content: text });

  const raw = await generateReply(history);
  const { clean, order } = extractOrder(raw);
  const reply = clean || "تمام يا فندم، ثانية واحدة وهرد عليك 🙏";

  await sendWhatsAppText(from, reply);

  await supabaseAdmin.from("wa_messages").insert([
    { wa_id: from, role: "user", content: text },
    { wa_id: from, role: "assistant", content: reply },
  ]);

  if (order) {
    await supabaseAdmin
      .from("wa_orders")
      .insert({ wa_id: from, details: JSON.parse(JSON.stringify(order)) });
  }
}

export const Route = createFileRoute("/api/public/whatsapp")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const mode = url.searchParams.get("hub.mode");
        const token = url.searchParams.get("hub.verify_token");
        const challenge = url.searchParams.get("hub.challenge");
        const expected = process.env["WHATSAPP_VERIFY_TOKEN"];

        if (mode === "subscribe" && expected && token === expected) {
          return new Response(challenge ?? "", { status: 200 });
        }
        return new Response("Forbidden", { status: 403 });
      },

      POST: async ({ request }) => {
        let payload: any;
        try {
          payload = await request.json();
        } catch {
          return new Response("Bad Request", { status: 400 });
        }

        try {
          const value = payload?.entry?.[0]?.changes?.[0]?.value;
          const message = value?.messages?.[0];
          const from: string | undefined = message?.from;
          const text: string | undefined =
            message?.text?.body ??
            message?.button?.text ??
            message?.interactive?.list_reply?.title ??
            message?.interactive?.button_reply?.title;

          if (from && typeof text === "string" && text.trim()) {
            await handleMessage(from, text.trim());
          } else if (from) {
            await sendWhatsAppText(
              from,
              "أهلاً بيك في elsoooq 👋 اكتبلي اسم المنتج اللي يهمك وهساعدك فوراً.",
            );
          }
        } catch (error) {
          console.error("WhatsApp webhook error", error);
        }

        // Meta needs a fast 200 regardless, otherwise it retries endlessly.
        return new Response("EVENT_RECEIVED", { status: 200 });
      },
    },
  },
});
