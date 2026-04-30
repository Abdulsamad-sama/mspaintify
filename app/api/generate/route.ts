import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { prompt, genre } = await req.json();

    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 });
    }

    // Build style-specific prompt based on genre
    const styleMap: Record<string, string> = {
      "sketch": "simple pencil sketch, hand-drawn on white background, rough loose lines, minimal detail, white background",
      "anime": "anime style illustration, clean lineart, vibrant colors, manga aesthetic",
      "pixel art": "pixel art style, 16-bit retro game aesthetic, pixelated, low resolution look",
      "oil painting": "oil painting style, rich textures, impressionistic brush strokes, painterly",
      "watercolor": "watercolor painting, soft washes of color, delicate brushwork, paper texture",
      "neon cyberpunk": "neon cyberpunk style, dark background, glowing neon lights, futuristic city",
      "pencil drawing": "detailed pencil drawing, graphite shading, realistic proportions, white paper background",
      "comic book": "comic book style, bold outlines, halftone dots, dynamic action poses, speech bubbles",
      "glitch art": "glitch art style, digital corruption effects, RGB split, pixel displacement",
      "ink wash": "ink wash painting, monochromatic, flowing ink strokes, minimalist composition",
    };

    const styleInstruction = styleMap[genre] || styleMap["sketch"];
    const fullPrompt = `${prompt}. Style: ${styleInstruction}. High quality, artistic.`;

    const response = await client.images.generate({
      model: "dall-e-3",
      prompt: fullPrompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      response_format: "url",
    });

    const url = response.data?.[0]?.url;
    if (!url) {
      return NextResponse.json({ error: "No image returned" }, { status: 500 });
    }

    // Return URL only — image is NOT stored server-side
    return NextResponse.json({ url });
  } catch (error: unknown) {
    console.error("Image generation error:", error);
    const message =
      error instanceof Error ? error.message : "Image generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
