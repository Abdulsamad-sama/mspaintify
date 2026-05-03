"use client";

import { useState, useEffect } from "react";
import { FaXTwitter, FaThreads, FaMoon, FaSun } from "react-icons/fa6";
import { FiUpload } from "react-icons/fi";



const PARTICLES = Array.from({ length: 30 }, (_, i) => i);

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [glitch, setGlitch] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return "dark"; // default fallback
  });
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


  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (event: MediaQueryListEvent) => setTheme(event.matches ? "dark" : "light");

    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 200);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const isDark = theme === "dark";
  const cardBg = isDark ? "rgba(255,255,255,0.05)" : "rgba(15,23,42,0.88)";
  const cardBorder = isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)";
  const scanlineColor = isDark ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.12)";

  function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed");
      return;
    }

    setFile(file);
    setError(null);
  }

  async function generate() {
    if (!file) return;

    setLoading(true);
    setError(null);
    setImageUrl(null);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch("/api/edit-image", {
        method: "POST",
        body: formData,
      });

      // const data = await res.json();
      const text = await res.text();

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(text); // shows actual server error
      }

      if (!res.ok) throw new Error(data.error || "Generation failed");

      setImageUrl(data.image); // base64 image
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Skip to main content for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-yellow-400 text-black px-4 py-2 rounded z-50"
      >
        Skip to main content
      </a>

      <main
        id="main-content"
        className={`min-h-screen overflow-hidden relative ${isDark ? "bg-black text-white" : "bg-slate-100 text-slate-900"}`}
      >
        {/* Animated grid background */}
        <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }} aria-hidden="true">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(${isDark ? "255,220,0,0.07" : "0,0,0,0.06"}) 1px, transparent 1px), linear-gradient(90deg, rgba(${isDark ? "255,220,0,0.07" : "0,0,0,0.06"}) 1px, transparent 1px)`,
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
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, ${scanlineColor} 2px, ${scanlineColor} 4px)`,
          zIndex: 1
        }} aria-hidden="true" />

        <div className="relative z-10 flex flex-col items-center px-4 py-12">
          {/* Theme toggle */}
          <div className="w-full flex justify-end mb-4">
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="px-4 py-2 rounded-full text-xs font-mono uppercase tracking-[0.3em] transition-all"
              style={{
                background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
                color: isDark ? "#fff" : "#111",
                border: `1px solid ${isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.12)"}`
              }}
              aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
            >
              {isDark ?
                <span className="flex gap-3"><FaSun aria-hidden="true" /> light</span> :
                <span className="flex gap-3"><FaMoon aria-hidden="true" /> dark</span>}
            </button>
          </div>

          {/* Header Section */}
          <header className="text-center mb-10 mt-4">
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

            <p className={`font-mono text-sm tracking-widest uppercase ${isDark ? "text-yellow-400/70" : "text-slate-500"}`}>
              generate · imagine · tokenize
            </p>
          </header>

          {/* Token Information Section */}
          <section className="w-full max-w-2xl mb-8" aria-labelledby="token-address">
            <div
              className="relative overflow-hidden rounded-2xl border"
              style={{
                borderColor: isDark ? "rgba(255,215,0,0.3)" : "rgba(148,163,184,0.2)",
                background: isDark ? "rgba(255,215,0,0.05)" : "rgba(15,23,42,0.05)"
              }}
              itemScope
              itemType="https://schema.org/CryptoCurrency"
            >
              <meta itemProp="name" content="MSPAINTIFY" />
              <meta itemProp="description" content="Community token for AI image generation" />
              <link itemProp="sameAs" href="https://solscan.io/token/HDmojpFZvf1F421Gev2hh2p1ThaVbWsW5qh9C5Bipump" />
              <div className="flex items-center p-3 gap-3">
                <span className={`font-mono text-xs uppercase tracking-widest shrink-0 ${isDark ? "text-yellow-400" : "text-slate-700"}`}>CA:</span>
                <span
                  className={`font-mono text-sm truncate ${isDark ? "text-white/80" : "text-slate-700"}`}
                  id="token-address"
                  aria-label="Token contract address"
                  itemProp="identifier"
                >
                  HDmojpFZvf1F421Gev2hh2p1ThaVbWsW5qh9C5Bipump
                </span>
                <button
                  onClick={() => navigator.clipboard.writeText("HDmojpFZvf1F421Gev2hh2p1ThaVbWsW5qh9C5Bipump")}
                  className="shrink-0 text-xs border px-2 py-1 rounded-lg transition-all font-mono"
                  style={{
                    borderColor: isDark ? "rgba(255,215,0,0.4)" : "rgba(148,163,184,0.3)",
                    color: isDark ? "#FFD700" : "#0f172a",
                    background: isDark ? "rgba(255,215,0,0.1)" : "rgba(248,250,252,0.8)",
                  }}
                  aria-label="Copy token contract address to clipboard"
                >
                  copy
                </button>
              </div>
              <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full blur-2xl" style={{ background: isDark ? "rgba(255,215,0,0.1)" : "rgba(34,197,94,0.08)" }} aria-hidden="true" />
            </div>
          </section>
        </div>

        {/* Community Links */}
        <div className="flex gap-3 mb-10 flex-wrap justify-center">
          {([
            { label: "Thread", icon: FaThreads, color: "#00CCFF", href: "https://www.threads.com/@withgrdnrush/post/DXtQ_cDk7ux?xmt=AQF0MwlrCdf3sLF9-Iqn05mK417LKbc2SoJpwVi-5HjTP" },
            { label: "Twitter", icon: FaXTwitter, color: "#1DA1F2", href: "https://x.com/i/communities/2018745872868147521" },
            { label: "Dexscreener", icon: "◎", color: "#00FF88", href: "https://dexscreener.com/solana/hdmojpfzvf1f421gev2hh2p1thavbwsw5qh9c5bipump" },
          ]).map(({ label, icon, color, href }) => {
            const Icon = icon;
            return (
              <a key={label} href={href}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-mono font-bold uppercase tracking-wider transition-all duration-200 hover:scale-105 hover:shadow-lg"
                style={{
                  borderColor: color + "55",
                  color,
                  background: color + "11",
                }}
              >
                <span style={{ fontSize: "14px" }}>{typeof Icon === "string" ? Icon : <Icon />}</span>
                {label}
              </a>
            );
          })}
        </div>

        {/* Image Generator */}
        <div className="w-full max-w-2xl m-auto">
          <div className="relative rounded-3xl border backdrop-blur-sm p-6 sm:p-8"
            style={{ boxShadow: "0 0 80px rgba(255,215,0,0.08), 0 0 200px rgba(255,0,255,0.05)", background: cardBg, borderColor: cardBorder }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
              <h2 className="font-mono text-sm uppercase tracking-[0.2em] text-white/60">
                Paintify you image
              </h2>
              <div className="flex-1 h-px bg-white/10" />
            </div>



            {/* Prompt input */}
            <div className="mb-5">
              <label className="block font-mono text-xs text-white/40 uppercase tracking-widest mb-3">
                Upload Image
              </label>

              <label
                className="relative flex flex-col items-center justify-center w-full h-48 rounded-2xl gap-2 border-2 border-dashed cursor-pointer transition-all group"
                style={{
                  borderColor: "rgba(255,255,255,0.15)",
                  background: "rgba(255,255,255,0.03)",
                }}
              >
                {/* Hidden Input */}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFile(file);
                  }}
                />

                {/* Icon */}
                <div
                  className="mb-3 text-3xl transition-transform group-hover:scale-110"
                  style={{ color: "#A855F7" }}
                >
                  <FiUpload />
                </div>

                {/* Text */}
                <p className="font-mono text-sm text-purple-400">
                  Click to upload
                </p>

                <p className="font-mono text-xs text-white/20 uppercase tracking-widest">
                  drop · paste · click
                </p>
              </label>

              {/* Preview */}
              {file && (
                <div className="mt-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={URL.createObjectURL(file)}
                    alt="Preview"
                    className="m-auto max-h-40 object-contain rounded-xl border border-white/10"
                  />
                </div>
              )}
            </div>

            {/* Generate button */}
            <button
              onClick={generate}
              disabled={loading || !file}
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
              <div className="mt-6 rounded-2xl border border-dashed h-48 flex flex-col items-center justify-center gap-2" style={{ borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(148,163,184,0.2)" }}>
                <div className="text-4xl opacity-20">◎</div>
                <p className="font-mono text-xs text-white/20 uppercase tracking-widest">your image appears here</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center font-mono text-xs text-white/20 uppercase tracking-widest">
          <p>© 2025 MSPAINTIFY — Token, Generate paint like images with AI</p>
        </div>

      </main >

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
    </>
  );
}
