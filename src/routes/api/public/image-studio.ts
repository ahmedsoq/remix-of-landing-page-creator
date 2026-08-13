import { createFileRoute } from "@tanstack/react-router";

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/images/generations";
const IMAGE_MODEL = "google/gemini-2.5-flash-image";

interface StudioBody {
  action: "generate" | "remove-bg";
  image: string; // data URL, e.g. data:image/jpeg;base64,...
  productName?: string;
}

function extractMimeAndBase64(dataUrl: string) {
  const m = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!m) return null;
  return { mime: m[1], base64: m[2] };
}

async function callImageModel(prompt: string, imageDataUrl: string): Promise<string> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new Error("LOVABLE_API_KEY is not configured");

  const res = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": apiKey,
      "X-Lovable-AIG-SDK": "fetch",
    },
    body: JSON.stringify({
      model: IMAGE_MODEL,
      prompt,
      image: imageDataUrl,
      n: 1,
      size: "1024x1024",
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "unknown error");
    throw new Error(`AI Gateway error ${res.status}: ${text}`);
  }

  const data = (await res.json()) as {
    data?: Array<{ url?: string; b64_json?: string }>;
  };

  const item = data.data?.[0];
  if (!item) throw new Error("No image returned from model");
  if (item.b64_json) {
    const parsed = extractMimeAndBase64(imageDataUrl);
    const mime = parsed?.mime ?? "image/png";
    return `data:${mime};base64,${item.b64_json}`;
  }
  if (item.url) return item.url;
  throw new Error("No image URL or data returned from model");
}

export const Route = createFileRoute("/api/public/image-studio")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as StudioBody;
          if (!body.image) {
            return new Response(JSON.stringify({ error: "Missing image" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          const parsed = extractMimeAndBase64(body.image);
          if (!parsed) {
            return new Response(JSON.stringify({ error: "Invalid image data URL" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          const productName = (body.productName || "this product").trim();

          if (body.action === "remove-bg") {
            const prompt = `Remove the background from this product photo. Keep only the product (${productName}) and place it on a clean pure white background. Preserve all product details, colors, and lighting. Output a high-quality product photo.`;
            const image = await callImageModel(prompt, body.image);
            return new Response(JSON.stringify({ images: [image] }), {
              headers: { "Content-Type": "application/json" },
            });
          }

          // generate 3 similar product images
          const prompts = [
            `Create a professional product photo of ${productName} in the same style and angle as the reference image, clean studio lighting, high quality, same product details.`,
            `Create a product photo of ${productName} from a slightly different angle than the reference, clean white background, professional e-commerce style.`,
            `Create a lifestyle product photo of ${productName} being used in a clean minimal scene, same product style and colors as the reference.`,
          ];

          const images: string[] = [];
          for (const prompt of prompts) {
            try {
              const img = await callImageModel(prompt, body.image);
              images.push(img);
            } catch (e) {
              console.error("Image generation call failed:", e);
              // continue with remaining images
            }
          }

          if (images.length === 0) {
            return new Response(JSON.stringify({ error: "Failed to generate any images" }), {
              status: 502,
              headers: { "Content-Type": "application/json" },
            });
          }

          return new Response(JSON.stringify({ images }), {
            headers: { "Content-Type": "application/json" },
          });
        } catch (err) {
          console.error("Image studio error:", err);
          const message = err instanceof Error ? err.message : "Unknown error";
          return new Response(JSON.stringify({ error: message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
