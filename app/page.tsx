"use client";

import { useState, useRef, useEffect } from "react";

const GENRES = [
  "sketch", "anime", "pixel art", "oil painting", "watercolor",
  "neon cyberpunk", "pencil drawing", "comic book", "glitch art", "ink wash"
];

const PARTICLES = Array.from({ length: 30 }, (_, i) => i);

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [genre, setGenre] = useState("sketch");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [glitch, setGlitch] = useState(false);
  const [particles] = useState(() =>
    PARTICLES.map(i => ({
      size: Math.floor(Math.random() * 4 + 2),
      left: (i * 37) % 100,
      top: (i * 53) % 100,
      color: i % 3 === 0 ? "#FFD700" : i % 3 === 1 ? "#FF00FF" : "#00FFFF",
      duration: 4 + (i % 5),
      delay: i * 0.3,
    }))
  );
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 200);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  async function generate() {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    setImageUrl(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, genre }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setImageUrl(data.url);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Animated grid background */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(255,220,0,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,220,0,0.07) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          animation: "gridMove 12s linear infinite"
        }} />
        {particles.map((p, i) => (
          <div key={i} className="absolute rounded-full" style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            left: `${p.left}%`,
            top: `${p.top}%`,
            background: p.color,
            animation: `float ${p.duration}s ease-in-out ${p.delay}s infinite alternate`,
            opacity: 0.6,
          }} />
        ))}
      </div>

      {/* Scanlines overlay */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)",
        zIndex: 1
      }} />

      <div className="relative z-10 flex flex-col items-center min-h-screen px-4 py-12">

        {/* Header */}
        <div className="text-center mb-10 mt-4">
          <div className="inline-block mb-3">
            <span className="text-xs font-mono tracking-[0.3em] text-yellow-400 uppercase border border-yellow-400/40 px-3 py-1 rounded-full">
              ◈ Community Token ◈
            </span>
          </div>

          <h1
            className="text-6xl sm:text-8xl font-black uppercase tracking-tight leading-none mb-2 select-none"
            style={{
              fontFamily: "'Arial Black', sans-serif",
              background: "linear-gradient(135deg, #FFD700 0%, #FF00FF 50%, #00FFFF 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: glitch ? "blur(2px)" : "none",
              transform: glitch ? "skewX(-5deg) translateX(4px)" : "none",
              transition: "all 0.05s",
            }}
          >
            mspaintify
          </h1>

          <p className="text-yellow-400/70 font-mono text-sm tracking-widest uppercase">
            generate · imagine · tokenize
          </p>
        </div>

        {/* Token Address Strip */}
        <div className="w-full max-w-2xl mb-8">
          <div className="relative overflow-hidden rounded-2xl border border-yellow-400/30 bg-yellow-400/5 p-4">
            <div className="flex items-center gap-3">
              <span className="text-yellow-400 font-mono text-xs uppercase tracking-widest shrink-0">CA:</span>
              <span className="font-mono text-sm text-white/80 truncate">
                HDmojpFZvf1F421Gev2hh2p1ThaVbWsW5qh9C5Bipump
              </span>
              <button
                onClick={() => navigator.clipboard.writeText("0x742d35Cc6634C0532925a3b8D4C9B7E3F1a2b3c4")}
                className="shrink-0 text-xs border border-yellow-400/40 text-yellow-400 px-2 py-1 rounded-lg hover:bg-yellow-400 hover:text-black transition-all font-mono"
              >
                copy
              </button>
            </div>
            <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-yellow-400/10 blur-2xl" />
          </div>
        </div>

        {/* Community Links */}
        <div className="flex gap-3 mb-10 flex-wrap justify-center">
          {[
            { label: "Telegram", icon: "✈", color: "#00CCFF", href: "#" },
            { label: "Discord", icon: "◉", color: "#7289DA", href: "#" },
            { label: "Twitter", icon: "✕", color: "#FFFFFF", href: "#" },
            { label: "Dexscreener", icon: "◎", color: "#00FF88", href: "#" },
          ].map(({ label, icon, color, href }) => (
            <a key={label} href={href}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-mono font-bold uppercase tracking-wider transition-all duration-200 hover:scale-105 hover:shadow-lg"
              style={{
                borderColor: color + "55",
                color,
                background: color + "11",
              }}
            >
              <span style={{ fontSize: "14px" }}>{icon}</span>
              {label}
            </a>
          ))}
        </div>

        {/* Image Generator */}
        <div className="w-full max-w-2xl">
          <div className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 sm:p-8"
            style={{ boxShadow: "0 0 80px rgba(255,215,0,0.08), 0 0 200px rgba(255,0,255,0.05)" }}>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
              <h2 className="font-mono text-sm uppercase tracking-[0.2em] text-white/60">
                AI Image Generator
              </h2>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Genre selector */}
            <div className="mb-4">
              <label className="block font-mono text-xs text-white/40 uppercase tracking-widest mb-2">Style</label>
              <div className="flex flex-wrap gap-2">
                {GENRES.map(g => (
                  <button key={g} onClick={() => setGenre(g)}
                    className="px-3 py-1.5 rounded-xl text-xs font-mono uppercase tracking-wide transition-all duration-150"
                    style={{
                      background: genre === g ? "#FFD700" : "rgba(255,255,255,0.05)",
                      color: genre === g ? "#000" : "rgba(255,255,255,0.5)",
                      border: `1px solid ${genre === g ? "#FFD700" : "rgba(255,255,255,0.1)"}`,
                      fontWeight: genre === g ? 700 : 400,
                    }}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt input */}
            <div className="mb-5">
              <label className="block font-mono text-xs text-white/40 uppercase tracking-widest mb-2">Prompt</label>
              <textarea
                ref={inputRef}
                rows={3}
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && e.metaKey) generate(); }}
                placeholder="a crypto trader crying at 3am, holding a chart going to zero..."
                className="w-full rounded-2xl border border-white/10 bg-white/5 text-white placeholder-white/20 font-mono text-sm p-4 resize-none focus:outline-none focus:border-yellow-400/50 transition-colors"
              />
              <p className="text-white/20 font-mono text-xs mt-1 text-right">⌘+Enter to generate</p>
            </div>

            {/* Generate button */}
            <button
              onClick={generate}
              disabled={loading || !prompt.trim()}
              className="w-full py-4 rounded-2xl font-black text-base uppercase tracking-widest transition-all duration-200 relative overflow-hidden disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: loading ? "rgba(255,215,0,0.2)" : "linear-gradient(135deg, #FFD700, #FF8C00)",
                color: "#000",
                fontFamily: "'Arial Black', sans-serif",
                boxShadow: loading ? "none" : "0 0 30px rgba(255,215,0,0.3)",
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <span className="inline-block w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Generating...
                </span>
              ) : (
                "◈ Generate Image"
              )}
            </button>

            {/* Error */}
            {error && (
              <div className="mt-4 p-3 rounded-xl border border-red-500/30 bg-red-500/10 font-mono text-xs text-red-400">
                {error}
              </div>
            )}

            {/* Image output */}
            {imageUrl && (
              <div className="mt-6 relative">
                <div className="rounded-2xl overflow-hidden border border-white/10"
                  style={{ boxShadow: "0 0 60px rgba(255,215,0,0.1)" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imageUrl} alt="Generated" className="w-full h-auto" />
                </div>
                <div className="mt-3 flex justify-between items-center">
                  <span className="font-mono text-xs text-white/30 uppercase tracking-widest">generated · not stored</span>
                  <a
                    href={imageUrl}
                    download="token-image.png"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs text-yellow-400 border border-yellow-400/30 px-3 py-1.5 rounded-xl hover:bg-yellow-400 hover:text-black transition-all"
                  >
                    ↓ save
                  </a>
                </div>
              </div>
            )}

            {/* Empty state */}
            {!imageUrl && !loading && !error && (
              <div className="mt-6 rounded-2xl border border-dashed border-white/10 h-48 flex flex-col items-center justify-center gap-2">
                <div className="text-4xl opacity-20">◎</div>
                <p className="font-mono text-xs text-white/20 uppercase tracking-widest">your image appears here</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center font-mono text-xs text-white/20 uppercase tracking-widest">
          <p>© 2025 $IMGN · not financial advice · do your own research</p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes gridMove {
          0% { background-position: 0 0; }
          100% { background-position: 60px 60px; }
        }
        @keyframes float {
          from { transform: translateY(0px) scale(1); opacity: 0.4; }
          to { transform: translateY(-20px) scale(1.2); opacity: 0.9; }
        }
      `}</style>
    </main>
  );
}
