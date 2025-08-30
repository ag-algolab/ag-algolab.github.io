// src/pages/ShahMat.jsx
import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const PIECES = [
  "knightw2.png","queenw2.png","rookw2.png","bishopw2.png","pawnw2.png","kingw2.png",
  "knightb2.png","queenb2.png","rookb2.png","bishopb2.png","pawnb2.png","kingb2.png"
];

// Generate gentle keyframes (small drift, slow)
function gentleKeyframes() {
  // small drift amplitudes in viewport units
  const dx = (4 + Math.random() * 6) * (Math.random() < 0.5 ? -1 : 1); // ~4..10vw
  const dy = (3 + Math.random() * 5) * (Math.random() < 0.5 ? -1 : 1); // ~3..8vh
  return { x: [0, dx], y: [0, dy], rotate: [0, 15, -15, 0] };
}

export default function ShahMat() {
  // Rotate pieces in batches of 6
  const [batchIdx, setBatchIdx] = useState(0);
  const batch = useMemo(() => {
    const start = (batchIdx * 6) % PIECES.length;
    return Array.from({ length: 6 }, (_, i) => PIECES[(start + i) % PIECES.length]);
  }, [batchIdx]);

  // Switch batch every 14s (slow, discreet)
  useEffect(() => {
    const id = setInterval(() => setBatchIdx((i) => i + 1), 14000);
    return () => clearInterval(id);
  }, []);

  const sprites = useMemo(
    () =>
      batch.map((name) => {
        // random starting anchor (percentage of viewport)
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const kf = gentleKeyframes();
        // slow animations for sobriety
        const dur = 18 + Math.random() * 8; // 18..26s
        return { name, left, top, kf, dur };
      }),
    [batch]
  );

  return (
    <main className="theme-shahmat min-h-screen text-[var(--paper)] relative overflow-hidden">
      {/* GREEN GRADIENT BACKGROUND */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#0F3D2E] via-[#155E49] to-[#1F6F51]" />
      <div className="absolute inset-0 -z-10 bg-black/10" />

      {/* NAVBAR (logo + gradient green brand + Home) */}
      <nav className="fixed top-0 w-full z-50 bg-black/30 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            <Link to="/" className="flex items-center space-x-3">
              <img src="/logo.jpg" alt="Logo" className="w-9 h-9 object-contain rounded-lg" />
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-300 via-green-300 to-lime-200 bg-clip-text text-transparent">
                AG Algo Lab
              </span>
            </Link>

            <div className="flex items-center gap-6">
              <Link
                to="/"
                className="text-white/80 hover:text-emerald-300 transition-colors duration-300 font-medium"
              >
                Home
              </Link>
              <span className="text-emerald-200/80 font-semibold">ShahMat</span>
            </div>
          </div>
        </div>
      </nav>

      {/* BACKGROUND: animated PNG chess pieces (6 at a time, slow & subtle) */}
      <div className="absolute inset-0 -z-10 pointer-events-none select-none">
        {sprites.map(({ name, left, top, kf, dur }, i) => (
          <motion.img
            key={`${name}-${i}`}
            src={`/logos/${name}`}
            alt=""
            className="absolute opacity-25 md:opacity-20 lg:opacity-15"
            style={{
              width: "64px",
              height: "64px",
              left: `${left}%`,
              top: `${top}%`,
            }}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{
              opacity: [0, 0.4, 0.3, 0.4],
              scale: [0.96, 1, 0.99, 1],
              x: kf.x,
              y: kf.y,
              rotate: kf.rotate,
            }}
            transition={{
              duration: dur,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* CONTENT */}
      <section className="px-6 md:px-10 lg:px-16 pt-28 pb-16">
        <header className="max-w-5xl mx-auto mb-10">
          <span className="inline-block text-sm font-medium bg-[var(--accent)] text-[var(--ink-strong)] px-3 py-1 rounded-full">
            Free & Open-Source
          </span>
          <h1 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight">
            ShahMat · Chess.com Analytics
          </h1>
          <p className="mt-4 text-[var(--paper-soft)] max-w-3xl">
            Fetch, analyze, and visualize your Chess.com games with one function call — simple
            install, clear visuals, and practical insights.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="https://pypi.org/project/shahmat/"
              className="btn-accent"
              target="_blank"
              rel="noreferrer"
            >
              PyPI · Install
            </a>
            {/* Show GitHub link later when the code is public + licensed */}
            <button
              className="btn-ghost"
              onClick={() => navigator.clipboard?.writeText("pip install shahmat")}
            >
              Copy&nbsp;: <code className="opacity-80">pip install shahmat</code>
            </button>
          </div>
        </header>

        {/* Quick Start */}
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="card-title">Quick start</h2>
            <pre className="codeblock" aria-label="Install & import">{`pip install shahmat

from shahmat import chesscom
df = chesscom(username="your_name", start_year=2023)
df.head()`}</pre>
            <ul className="mt-4 list-disc pl-5 text-sm text-[var(--paper-soft)] space-y-1">
              <li>One function to fetch & normalize monthly games</li>
              <li>Clean DataFrame with key fields ready for plotting</li>
              <li>Matplotlib visuals included out of the box</li>
            </ul>
          </div>

          {/* Features */}
          <div className="card">
            <h3 className="card-subtitle">Key features</h3>
            <ul className="list-disc pl-5 text-sm text-[var(--paper-soft)] space-y-2">
              <li>
                <strong>Time control filter</strong>: Bullet / Blitz / Rapid / All
              </li>
              <li>
                <strong>Hours of play</strong>: score rate &amp; volume by hour (UTC)
              </li>
              <li>
                <strong>Games per day</strong>: score vs number of games (day = 3h→3h UTC)
              </li>
              <li>
                <strong>Elo difference</strong>: score vs Elo gap (White/Black curves) + volume
              </li>
              <li>
                <strong>Result types</strong>: wins vs losses (checkmate, resign, timeout, …)
              </li>
              <li>
                <strong>Download</strong>: export the filtered dataset to CSV
              </li>
            </ul>
          </div>
        </div>

        {/* CTA bottom */}
        <div className="max-w-5xl mx-auto mt-12 p-5 rounded-2xl bg-[var(--bg-soft)] border border-white/5 flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex-1">
            <h3 className="font-semibold text-lg">Want to contribute later?</h3>
            <p className="text-sm text-[var(--paper-soft)]">
              When the source is public with a proper license, issues & PRs will be welcome.
            </p>
          </div>
          <a
            href="https://pypi.org/project/shahmat/"
            className="btn-accent"
            target="_blank"
            rel="noreferrer"
          >
            PyPI page
          </a>
        </div>
      </section>
    </main>
  );
}
