/**
 * بوابة إشعارات تيليجرام مستقلة تمامًا عن Lovable.
 * تُنشر على Cloudflare Workers (مجاني) وتحفظ التوكن وأيدي الشات كأسرار بيئة.
 *
 * أسرار مطلوبة:
 *   TELEGRAM_BOT_TOKEN  = توكن البوت من @BotFather
 *   TELEGRAM_CHAT_ID    = أيدي الشات اللي هتوصله الطلبات
 * اختياري:
 *   ALLOWED_ORIGIN      = نطاق موقعك (افتراضي: *)
 */

function cors(env) {
  return {
    "Access-Control-Allow-Origin": (env && env.ALLOWED_ORIGIN) || "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Max-Age": "86400",
    "Cache-Control": "no-store",
  };
}

function json(env, body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors(env), "Content-Type": "application/json" },
  });
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors(env) });
    }

    if (request.method === "GET") {
      return json(env, {
        ok: true,
        service: "telegram-order-gateway",
        configured: Boolean(env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID),
      });
    }

    if (request.method !== "POST") {
      return json(env, { ok: false, error_code: 405, description: "Method not allowed" }, 405);
    }

    if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) {
      return json(env, { ok: false, error_code: 503, description: "Gateway is not configured" }, 503);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json(env, { ok: false, error_code: 400, description: "Invalid JSON" }, 400);
    }

    const method = String(body.method || "sendMessage");
    const text = String(body.text || "");

    if (method !== "getMe" && method !== "sendMessage") {
      return json(env, { ok: false, error_code: 400, description: "Unsupported method" }, 400);
    }
    if (method === "sendMessage" && (!text || text.length > 4096)) {
      return json(env, { ok: false, error_code: 400, description: "Invalid message" }, 400);
    }

    const payload =
      method === "getMe"
        ? {}
        : { chat_id: env.TELEGRAM_CHAT_ID, text, disable_web_page_preview: true };

    try {
      const res = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/${method}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json().catch(() => ({
        ok: false,
        error_code: res.status,
        description: "Telegram returned an unreadable response",
      }));
      return json(env, result, res.ok ? 200 : res.status);
    } catch (error) {
      return json(env, { ok: false, error_code: 502, description: "Unable to reach Telegram" }, 502);
    }
  },
};