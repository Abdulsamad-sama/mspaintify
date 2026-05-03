# MSPAINTIFY — Token Community + AI Image Generator

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

- Token name (`MSPAINTIFY` → your token name)
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

## Rate Limiting

Rate limiting is **enabled by default**:

- **5 requests per minute** per IP address
- Returns HTTP 429 (Too Many Requests) when limit exceeded
- Includes `Retry-After` header with reset time

### Customizing Rate Limits

Edit `lib/rateLimit.ts` or modify the call in `app/api/edit-image/route.ts`:

```typescript
// Current: 5 requests per 60 seconds
const rateLimitResult = rateLimit(clientIP, 5, 60000);
// Change to: 10 requests per 120 seconds
const rateLimitResult = rateLimit(clientIP, 10, 120000);
```

### For Production (Redis-backed rate limiting)

Replace the simple in-memory rate limiter with `@upstash/ratelimit`:

```bash
npm install @upstash/ratelimit @upstash/redis
```

See [Upstash Rate Limiting Docs](https://upstash.com/docs/redis/features/ratelimiting) for setup.

# mspaintify
