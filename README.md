# $IMGN — Token Community + AI Image Generator

A flashy crypto token landing page with an integrated AI image generator built with Next.js, Tailwind CSS, and OpenAI.

## Features
- Animated, flashy token aesthetic (dark, neon, glitch effects)
- Token contract address display with copy button
- Community links (Telegram, Discord, Twitter, Dexscreener)
- AI image generator supporting 10 art styles/genres
- Images are generated on-demand and NOT stored server-side
- Users can save images directly to their device

## Tech Stack
- **Next.js 15** (App Router)
- **Tailwind CSS** (utility-first styling)
- **OpenAI API** (DALL-E 3 image generation)
- **TypeScript**

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment variables
```bash
cp .env.example .env.local
```
Edit `.env.local` and add your OpenAI API key:
```
OPENAI_API_KEY=sk-...your-key-here...
```

Get your key at: https://platform.openai.com/api-keys

### 3. Customize your token
Edit `app/page.tsx` and update:
- Token name (`$IMGN` → your token name)
- Contract address (`0x742d35Cc...` → your real CA)
- Community links (Telegram, Discord, Twitter, Dexscreener URLs)

### 4. Run locally
```bash
npm run dev
```
Open http://localhost:3000

### 5. Deploy to Vercel (recommended)
```bash
npm install -g vercel
vercel
```
Add `OPENAI_API_KEY` in Vercel dashboard → Settings → Environment Variables

## Cost per image
- DALL-E 3 Standard: ~$0.04 per image
- With $30 OpenAI credit: ~750 images

## Project Structure
```
app/
  page.tsx              # Main frontend page
  layout.tsx            # Root layout
  api/
    generate/
      route.ts          # OpenAI API endpoint (server-side)
  globals.css           # Global styles
.env.local              # Your API keys (never commit this)
.env.example            # Template for env vars
```

## Important Notes
- Images are NOT stored — they come directly from OpenAI's CDN and expire
- The API key is server-side only — never exposed to the browser
- Rate limiting recommended for production (add middleware)
# mspaintify
