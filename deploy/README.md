# النشر المباشر على GitHub + بيئة خارجية للتوكن

الموقع كله ملف واحد `index.html` (كل الصور والمنتجات مدمجة داخله)، والتوكن لا يوجد داخل الصفحة إطلاقًا — يعيش كسر بيئة داخل بوابة Cloudflare Worker.

## 1) بوابة تيليجرام المستقلة (Cloudflare Workers — مجاني)

```bash
cd deploy/telegram-worker
npx wrangler login
npx wrangler secret put TELEGRAM_BOT_TOKEN   # التوكن من @BotFather
npx wrangler secret put TELEGRAM_CHAT_ID     # 8260431304
npx wrangler deploy
```

ستحصل على رابط مثل:
`https://elsoooq-telegram-gateway.<your-subdomain>.workers.dev`

تأكد أنها تعمل:
```bash
curl https://elsoooq-telegram-gateway.<your-subdomain>.workers.dev
# {"ok":true,"service":"telegram-order-gateway","configured":true}
```

## 2) اربط الصفحة بالبوابة

في `index.html` (وأيضًا `404.html` و`public/elsoooq.html`) ابحث عن:

```js
var TG_GATEWAY_OVERRIDE = "";
```

وضع رابط الـ Worker:

```js
var TG_GATEWAY_OVERRIDE = "https://elsoooq-telegram-gateway.<your-subdomain>.workers.dev";
```

## 3) النشر على GitHub Pages

```bash
git add -A
git commit -m "publish store"
git push origin main
```

ثم في المستودع: **Settings → Pages → Source: GitHub Actions**.
ملف الـ workflow جاهز في `.github/workflows/deploy-pages.yml` وينشر `index.html` + `404.html` + `.nojekyll` تلقائيًا مع كل push.

> لو تستخدم نطاقك الخاص، الملف `CNAME` موجود بالفعل في الجذر.

## الأمان
- لا تضع التوكن داخل HTML أو داخل المستودع أبدًا؛ فقط عبر `wrangler secret put`.
- يُفضّل ضبط `ALLOWED_ORIGIN` في `wrangler.toml` على نطاق موقعك بعد النشر.