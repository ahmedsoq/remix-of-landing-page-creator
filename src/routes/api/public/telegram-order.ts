import { createFileRoute } from "@tanstack/react-router";

type TelegramRequest = {
  method?: unknown;
  text?: unknown;
};

const ORDER_CHAT_ID = "8260431304";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
  "Cache-Control": "no-store",
};

function json(body: unknown, status = 200) {
  return Response.json(body, { status, headers: corsHeaders });
}

export const Route = createFileRoute("/api/public/telegram-order")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: corsHeaders }),
      GET: async () =>
        json({
          ok: true,
          service: "telegram-order-gateway",
          configured: Boolean(process.env["LOVABLE_API_KEY"] && process.env["TELEGRAM_API_KEY"]),
        }),
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as TelegramRequest;
          const method = String(body.method ?? "sendMessage");
          const text = String(body.text ?? "");

          if (method !== "getMe" && method !== "sendMessage") {
            return json({ ok: false, error_code: 400, description: "Unsupported method" }, 400);
          }
          if (method === "sendMessage" && (!text || text.length > 4096)) {
            return json({ ok: false, error_code: 400, description: "Invalid message" }, 400);
          }

          const lovableApiKey = process.env["LOVABLE_API_KEY"];
          const telegramApiKey = process.env["TELEGRAM_API_KEY"];
          if (!lovableApiKey || !telegramApiKey) {
            return json({ ok: false, error_code: 503, description: "Telegram connection is not configured" }, 503);
          }
          const telegramBody = method === "getMe"
            ? {}
            : { chat_id: ORDER_CHAT_ID, text, disable_web_page_preview: true };
          const response = await fetch(`https://connector-gateway.lovable.dev/telegram/${method}`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${lovableApiKey}`,
              "X-Connection-Api-Key": telegramApiKey,
              "Content-Type": "application/json",
            },
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