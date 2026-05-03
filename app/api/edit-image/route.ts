import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { rateLimit, getClientIP } from "@/lib/rateLimit";

export const runtime = "nodejs"; // important for file handling

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const FIXED_PROMPT = `Redraw the attached image in the most clumsy, scribbly, and utterly pathetic way possible. Use a white background, and make it look like it was drawn in MS Paint with a mouse. It should be vaguely similar but also not really, kind of matching but also off in a confusing, awkward way, with that low-quality pixel-by-pixel feel that really emphasizes how ridiculously bad it is. Actually, you know what, whatever, just draw it however you want`;

export async function POST(req: NextRequest) {
  try {
    // 🛡️ Rate limiting: 5 requests per minute per IP
    const clientIP = getClientIP(req);
    const rateLimitResult = rateLimit(clientIP, 5, 60000);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": String(
              Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000),
            ),
          },
        },
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 },
      );
    }

    const formData = await req.formData();
    const file = formData.get("image") as File | null;

    // 🔒 Strict validation: image only
    if (!file) {
      return NextResponse.json(
        { error: "Image file is required" },
        { status: 400 },
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files are allowed" },
        { status: 400 },
      );
    }

    // Convert File → Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 🧠 Image edit call
    const result = await client.images.edit({
      model: "gpt-image-1",
      image: file,
      prompt: FIXED_PROMPT,
      size: "1024x1024",
    });

    const imageBase64 = result.data?.[0]?.b64_json;

    if (!imageBase64) {
      return NextResponse.json({ error: "No image returned" }, { status: 500 });
    }

    // Return as base64 so frontend can render directly
    return NextResponse.json({
      image: `data:image/png;base64,${imageBase64}`,
    });
  } catch (error: unknown) {
    console.error("Image edit error:", error);

    const message =
      error instanceof Error ? error.message : "Image editing failed";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
