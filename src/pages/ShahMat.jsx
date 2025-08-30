// src/pages/ShahMat.jsx
import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const PIECES = [
  "knightw2.png","queenw2.png","rookw2.png","bishopw2.png","pawnw2.png","kingw2.png",
  "knightb2.png","queenb2.png","rookb2.png","bishopb2.png","pawnb2.png","kingb2.png"
];

// util: generate smooth random keyframes
function randomKeyframes(rangeX = 800, rangeY = 600) {
  const steps = 4 + Math.floor(Math.random() * 3); // 4..6
  const xs = Array.from({ length: steps }, () => Math.random() * rangeX);
  const ys = Array.from({ length: steps }, () => Math.random() * rangeY);
  return { x: xs, y: ys };
}

export default function ShahMat() {
  // rotate pieces in batches of 6
  const [batchIdx, setBatchIdx] = useState(0);
  const batch = useMemo(() => {
    const start = (batchIdx * 6) % PIECES.length;
    return Array.from({ length: 6 }, (_, i) => PIECES[(start + i) % PIECES.length]);
  }, [batchIdx]);

  // switch batch every 8s
  useEffect(() => {
    const id = setInterval(() => setBatchIdx((i) => i + 1), 8000);
    return () => clearInterval(id);
  }, []);

  const sprites = useMemo(
    () =>
      batch.map((name) => {
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const kf = randomKeyframes(800, 600);
        const dur = 6 + Math.random() * 6; // 6..12s
        const rot = [0, 10, -8, 0];
        return { name, left, top, kf, dur, rot };
      }),
    [batch]
  );

  return (
    <main className="theme-shahmat min-h-screen text-[var(--paper)] relative overflow-hidden">
      {/* GREEN GRADIENT BACKGROUND */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#0F3D2E] via-[#155E49] to-[#1F6F51]" />
      <div className="absolute inset-0 -z-10 bg-black/10" />

      {/* NAVBAR */}
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

      {/* BACKGROUND: animated PNG pieces */}
      <div className="absolute inset-0 -z-10 pointer-events-none select-none">
        {sprites.map(({ name, left, top, kf, dur, rot }, i) => (
          <motion.img
            key={`${name}-${i}`}
            src={`/logos/${name}`}
            alt=""
            className="absolute opacity-40 md:opacity-30 lg:opacity-25"
            style={{ width: "64px", height: "64px", left: `${left}%`, top: `${top}%` }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{
              opacity: [0, 0.6, 0.3, 0.6],
              scale: [0.9, 1, 0.98, 1],
              rotate: rot,
              x: kf.x,
              y: kf.y,
            }}
            transition={{ duration: dur, repeat: Infinity, ease: "easeInOut" }}
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
            ShahMat · Chess.com Analytics Package
          </h1>
          <p className="mt-4 text-[var(--paper-soft)] max-w-3xl">
            Fetch, analyze and visualize your Chess.com games: score rate by hour, Elo difference,
            White/Black breakdown, and clean visualizations — all in one call.
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
            <a
              href="https://github.com/ag-algolab/ShahMat"
              className="btn-ghost"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
            <button
              className="btn-ghost"
              onClick={() => navigator.clipboard?.writeText("pip install shahmat")}
            >
              Copy&nbsp;: <code className="opacity-80">pip install shahmat</code>
            </button>
          </div>
        </header>

        {/* Quick Start (left) + Feature cards (right) */}
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
          {/* LEFT: Quick start */}
          <div className="card">
            <h2 className="card-title">Quick start</h2>
            <pre className="codeblock" aria-label="Install & import">{`pip install shahmat
        
        from shahmat import chesscom
        df = chesscom(username="your_name", start_year=2023)
        df.head()`}</pre>
            <ul className="mt-4 list-disc pl-5 text-sm text-[var(--paper-soft)] space-y-1">
              <li>Fetch & normalize monthly games with a single function</li>
              <li>Clean DataFrame with key fields ready for plotting</li>
              <li>Matplotlib visuals included out of the box</li>
            </ul>
        
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="px-2 py-1 rounded-full text-xs bg-white/10 border border-white/15">Python</span>
              <span className="px-2 py-1 rounded-full text-xs bg-white/10 border border-white/15">Chess.com API</span>
              <span className="px-2 py-1 rounded-full text-xs bg-white/10 border border-white/15">Matplotlib</span>
              <span className="px-2 py-1 rounded-full text-xs bg-white/10 border border-white/15">TQDM</span>
            </div>
          </div>
        
          {/* RIGHT: one small card per feature */}
          <div className="grid gap-6">
            {/* Feature 1 */}
            <div className="card">
              <div className="flex items-start gap-3">
                <div className="shrink-0 w-9 h-9 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center">
                  <span className="text-sm font-bold">TC</span>
                </div>
                <div className="flex-1">
                  <h3 className="card-subtitle">Time control filter</h3>
                  <p className="card-text">
                    Analyze <strong>Bullet</strong>, <strong>Blitz</strong>, <strong>Rapid</strong> or <strong>All</strong> with a simple menu switch.
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="px-2 py-1 rounded-full text-xs bg-white/10 border border-white/15">Bullet</span>
                    <span className="px-2 py-1 rounded-full text-xs bg-white/10 border border-white/15">Blitz</span>
                    <span className="px-2 py-1 rounded-full text-xs bg-white/10 border border-white/15">Rapid</span>
                  </div>
                </div>
              </div>
            </div>
        
            {/* Feature 2 */}
            <div className="card">
              <div className="flex items-start gap-3">
                <div className="shrink-0 w-9 h-9 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center">
                  <span className="text-sm font-bold">H</span>
                </div>
                <div className="flex-1">
                  <h3 className="card-subtitle">Hours of play</h3>
                  <p className="card-text">
                    Score rate &amp; game volume by hour (UTC). Quickly spot your best time windows.
                  </p>
                </div>
              </div>
            </div>
        
            {/* Feature 3 */}
            <div className="card">
              <div className="flex items-start gap-3">
                <div className="shrink-0 w-9 h-9 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center">
                  <span className="text-sm font-bold">D</span>
                </div>
                <div className="flex-1">
                  <h3 className="card-subtitle">Games per day (3h→3h UTC)</h3>
                  <p className="card-text">
                    Relationship between daily game count and score rate, with a normalized “day” window.
                  </p>
                </div>
              </div>
            </div>
        
            {/* Feature 4 */}
            <div className="card">
              <div className="flex items-start gap-3">
                <div className="shrink-0 w-9 h-9 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center">
                  <span className="text-sm font-bold">ΔE</span>
                </div>
                <div className="flex-1">
                  <h3 className="card-subtitle">Elo difference</h3>
                  <p className="card-text">
                    Score vs Elo gap with separate <strong>White</strong>/<strong>Black</strong> curves and volume bars.
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="px-2 py-1 rounded-full text-xs bg-white/10 border border-white/15">White curve</span>
                    <span className="px-2 py-1 rounded-full text-xs bg-white/10 border border-white/15">Black curve</span>
                    <span className="px-2 py-1 rounded-full text-xs bg-white/10 border border-white/15">Volume</span>
                  </div>
                </div>
              </div>
            </div>
        
            {/* Feature 5 */}
            <div className="card">
              <div className="flex items-start gap-3">
                <div className="shrink-0 w-9 h-9 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center">
                  <span className="text-sm font-bold">RT</span>
                </div>
                <div className="flex-1">
                  <h3 className="card-subtitle">Result types</h3>
                  <p className="card-text">
                    Wins vs losses breakdown: checkmate, resign, timeout, stalemate, agreed draw, etc.
                  </p>
                </div>
              </div>
            </div>
        
            {/* Feature 6 */}
            <div className="card">
              <div className="flex items-start gap-3">
                <div className="shrink-0 w-9 h-9 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center">
                  <span className="text-sm font-bold">CSV</span>
                </div>
                <div className="flex-1">
                  <h3 className="card-subtitle">Download</h3>
                  <p className="card-text">
                    Export the <strong>currently filtered</strong> dataset to CSV for deeper analysis.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* CTA bottom */}
        <div className="max-w-5xl mx-auto mt-12 p-5 rounded-2xl bg-[var(--bg-soft)] border border-white/5 flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex-1">
            <h3 className="font-semibold text-lg">Want to contribute?</h3>
            <p className="text-sm text-[var(--paper-soft)]">
              Light roadmap, issues welcome. Add a plot, a stat, or a UI idea.
            </p>
          </div>
          <a
            href="https://github.com/ag-algolab/ShahMat/issues"
            className="btn-accent"
            target="_blank"
            rel="noreferrer"
          >
            Open an issue
          </a>
        </div>
      </section>
    </main>
  );
}
