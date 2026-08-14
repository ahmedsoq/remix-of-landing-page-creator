import { createFileRoute } from "@tanstack/react-router";

type TelegramRequest = {
  token?: unknown;
  method?: unknown;
  chatId?: unknown;
  text?: unknown;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Cache-Control": "no-store",
};

function json(body: unknown, status = 200) {
  return Response.json(body, { status, headers: corsHeaders });
}

export const Route = createFileRoute("/api/public/telegram-order")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: corsHeaders }),
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as TelegramRequest;
          const token = String(body.token ?? "").trim().replace(/^bot/i, "");
          const method = String(body.method ?? "sendMessage");
          const chatId = String(body.chatId ?? "").trim();
          const text = String(body.text ?? "");

          if (!/^\d{6,12}:[A-Za-z0-9_-]{25,}$/.test(token)) {
            return json({ ok: false, error_code: 400, description: "Invalid bot token format" }, 400);
          }
          if (method !== "getMe" && method !== "sendMessage") {
            return json({ ok: false, error_code: 400, description: "Unsupported method" }, 400);
          }
          if (method === "sendMessage" && (!chatId || !text || text.length > 4096)) {
            return json({ ok: false, error_code: 400, description: "Invalid chat or message" }, 400);
          }

          const telegramBody = method === "getMe"
            ? {}
            : { chat_id: chatId, text, disable_web_page_preview: true };
          const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(telegramBody),
          });
          const result = await response.json().catch(() => ({
            ok: false,
            error_code: response.status,
            description: "Telegram returned an unreadable response",
          }));

          return json(result, response.ok ? 200 : response.status);
        } catch (error) {
          console.error("Telegram order gateway failed:", error);
          return json({ ok: false, error_code: 502, description: "Unable to reach Telegram" }, 502);
        }
      },
    },
  },
});