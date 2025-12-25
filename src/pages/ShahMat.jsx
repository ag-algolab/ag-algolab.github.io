// src/pages/ShahMat.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

/* ================= ANIMATED MINI CHESSBOARD ================= */
function MiniChessboard() {
  const [pieces, setPieces] = useState([
    { id: 1, color: "white", row: 3, col: 0 }, // Cases foncées (3+0=3 impair)
    { id: 2, color: "black", row: 0, col: 0 }, // Cases claires (0+0=0 pair)
  ]);

  const [movingPiece, setMovingPiece] = useState(null);

  // Cases claires (somme paire): (0,0), (0,2), (1,1), (1,3), (2,0), (2,2), (3,1), (3,3)
  // Cases foncées (somme impaire): (0,1), (0,3), (1,0), (1,2), (2,1), (2,3), (3,0), (3,2)

  const gameSequence = [
    // Blanc sur cases foncées
    { pieceId: 1, toRow: 2, toCol: 1 },
    // Noir sur cases claires  
    { pieceId: 2, toRow: 1, toCol: 1 },
    // Blanc
    { pieceId: 1, toRow: 0, toCol: 3 },
    // Noir
    { pieceId: 2, toRow: 3, toCol: 3 },
    // Blanc
    { pieceId: 1, toRow: 1, toCol: 2 },
    // Noir
    { pieceId: 2, toRow: 2, toCol: 2 },
    // Blanc retour
    { pieceId: 1, toRow: 3, toCol: 0 },
    // Noir retour
    { pieceId: 2, toRow: 0, toCol: 0 },
  ];

  useEffect(() => {
    let moveIndex = 0;

    const interval = setInterval(() => {
      const move = gameSequence[moveIndex % gameSequence.length];
      setMovingPiece(move.pieceId);

      setTimeout(() => {
        setPieces(prev =>
          prev.map(p =>
            p.id === move.pieceId ? { ...p, row: move.toRow, col: move.toCol } : p
          )
        );
        setMovingPiece(null);
      }, 400);

      moveIndex++;
    }, 1400);

    return () => clearInterval(interval);
  }, []);

  const cellSize = 64;

  return (
    <div className="relative">
      {/* Glow effect */}
      <div className="absolute -inset-8 bg-gradient-to-br from-emerald-500/20 to-green-500/10 rounded-3xl blur-2xl" />

      <div
        className="relative rounded-xl overflow-hidden border-2 border-emerald-700/50 shadow-2xl shadow-emerald-900/50"
        style={{ width: cellSize * 4, height: cellSize * 4 }}
      >
        {/* Cases */}
        {[...Array(16)].map((_, i) => {
          const row = Math.floor(i / 4);
          const col = i % 4;
          const isLight = (row + col) % 2 === 0;

          return (
            <div
              key={i}
              className={`absolute ${isLight ? "bg-[#eeeed2]" : "bg-[#769656]"}`}
              style={{
                width: cellSize,
                height: cellSize,
                left: col * cellSize,
                top: row * cellSize,
              }}
            />
          );
        })}

        {/* Pièces */}
        {pieces.map((piece) => {
          const isWhite = piece.color === 'white';
          
          return (
            <motion.div
              key={piece.id}
              className="absolute flex items-center justify-center"
              style={{
                width: cellSize,
                height: cellSize,
                zIndex: movingPiece === piece.id ? 20 : 10,
              }}
              animate={{
                left: piece.col * cellSize,
                top: piece.row * cellSize,
              }}
              transition={{
                type: "spring",
                stiffness: 120,
                damping: 18,
              }}
            >
              <span
                className={`text-5xl select-none transition-transform duration-200 ${
                  movingPiece === piece.id ? 'scale-110' : 'scale-100'
                }`}
                style={{
                  color: isWhite ? '#fff' : '#000',
                  textShadow: isWhite
                    ? `
                      -1px -1px 0 #000,
                      1px -1px 0 #000,
                      -1px 1px 0 #000,
                      1px 1px 0 #000,
                      0 3px 6px rgba(0,0,0,0.4)
                    `
                    : `
                      -1px -1px 0 rgba(255,255,255,0.3),
                      1px -1px 0 rgba(255,255,255,0.3),
                      -1px 1px 0 rgba(255,255,255,0.1),
                      1px 1px 0 rgba(255,255,255,0.1),
                      0 3px 6px rgba(0,0,0,0.5)
                    `,
                  filter: movingPiece === piece.id 
                    ? 'drop-shadow(0 8px 12px rgba(0,0,0,0.4))' 
                    : 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))',
                }}
              >
                ♝
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Coins décoratifs */}
      <div className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-emerald-400/60 rounded-tl-lg" />
      <div className="absolute -top-3 -right-3 w-6 h-6 border-t-2 border-r-2 border-emerald-400/60 rounded-tr-lg" />
      <div className="absolute -bottom-3 -left-3 w-6 h-6 border-b-2 border-l-2 border-emerald-400/60 rounded-bl-lg" />
      <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-emerald-400/60 rounded-br-lg" />
    </div>
  );
}




/* ================= MAIN PAGE ================= */
export default function ShahMat() {
  return (
    <main className="min-h-screen bg-[#0a1f18] text-[#e7f5e8]">
      {/* Background gradient */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d2818] via-[#133d2a] to-[#0a1f18]" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-green-500/10 rounded-full blur-3xl" />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-[#0a1f18]/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition">
              <img src="/logo.jpg" alt="Logo" className="w-10 h-10 object-contain rounded-lg" />
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-300 to-green-200 bg-clip-text text-transparent">
                AG Algo Lab
              </span>
            </Link>

            <Link to="/" className="text-sm px-4 py-2 rounded-lg border border-white/15 text-white/70 hover:bg-white/5 hover:text-white transition">
              ← Back home
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block text-sm font-medium bg-emerald-500/20 text-emerald-300 px-4 py-1.5 rounded-full border border-emerald-500/30 mb-6">
                Free & Open-Source
              </span>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
                <span className="bg-gradient-to-r from-white via-emerald-100 to-green-200 bg-clip-text text-transparent">
                  ShahMat
                </span>
                <span className="block text-2xl md:text-3xl font-medium text-white/60 mt-2">
                  Chess.com Analytics Package
                </span>
              </h1>
              
              <p className="text-lg text-[#a8d4b8] max-w-xl mb-8 leading-relaxed">
                Fetch, analyze and visualize your Chess.com games: hourly performance, 
                Elo-gap impact, result-type breakdowns, and more — all from one function.
              </p>

              <div className="flex flex-wrap gap-4">
                <a
                  href="https://pypi.org/project/shahmat/"
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 transition-all duration-300 font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-105"
                >
                  PyPI · Install
                </a>
                <a
                  href="https://github.com/ag-algolab/ShahMat"
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-3 rounded-xl border border-white/20 hover:bg-white/5 hover:border-white/40 transition-all duration-300 font-semibold"
                >
                  GitHub
                </a>
              </div>
            </motion.div>

            {/* Right - Animated Chessboard */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex justify-center lg:justify-end"
            >
              <MiniChessboard />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Start Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-[#0d2818] rounded-2xl p-6 md:p-8 border border-white/10 mb-12"
          >
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-sm">⚡</span>
              Quick Start
            </h2>
            <div className="bg-black/40 rounded-xl p-5 font-mono text-sm border border-white/5 overflow-x-auto">
              <pre className="text-sm leading-relaxed">
                <code>
                  <span className="text-emerald-400">pip</span>
                  <span className="text-white/80"> install shahmat</span>
{`

`}
                  <span className="text-blue-400">from</span>
                  <span className="text-white/80"> ShahMat </span>
                  <span className="text-blue-400">import</span>
                  <span className="text-white/80"> chesscom</span>
{`
`}
                  <span className="text-purple-400">chesscom</span>
                  <span className="text-white/60">(</span>
                  <span className="text-orange-300">username</span>
                  <span className="text-white/60">=</span>
                  <span className="text-green-300">"your_name"</span>
                  <span className="text-white/60">,</span>
                  <span className="text-orange-300">start_year</span>
                  <span className="text-white/60">=</span>
                  <span className="text-cyan-300">2023</span>
                  <span className="text-white/60">)</span>

                </code>
              </pre>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {["Python", "Chess.com API", "Matplotlib", "TQDM"].map(tag => (
                <span key={tag} className="px-3 py-1 rounded-full text-xs bg-white/5 border border-white/10 text-white/70">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: "🕐",
                title: "Hours of Play",
                description: "Score rate & game volume by hour (UTC). Spot your best time windows."
              },
              {
                icon: "📆",
                title: "Daily Volume",
                description: "Relationship between daily game count and score rate."
              },
              {
                icon: "⚖️",
                title: "Elo Difference",
                description: "Score vs Elo gap with separate White/Black curves and volume bars."
              },
              {
                icon: "♟️",
                title: "Opening Moves",
                description: "Score rate by first move played (White & Black), with sample size."
              },
              {
                icon: "🏆",
                title: "Result Types",
                description: "Wins vs losses: checkmate, resign, timeout, stalemate, agreed draw."
              },
              {
                icon: "💾",
                title: "CSV Export",
                description: "Export filtered dataset to CSV for deeper analysis."
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-[#0d2818] rounded-2xl p-6 border border-white/10 hover:border-emerald-500/30 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-2xl mb-4 group-hover:bg-emerald-500/20 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-[#a8d4b8] leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-[#133d2a] to-[#0d2818] rounded-2xl p-8 md:p-10 border border-emerald-500/20 text-center"
          >
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Join the journey 🤝
            </h3>
            <p className="text-[#a8d4b8] max-w-xl mx-auto mb-8">
              No matter your Elo, your ideas matter. Got suggestions or want to contribute? 
              Let's connect — I'm always open for a good discussion.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://www.linkedin.com/in/anthony-gocmen/"
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 transition-all duration-300 font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-105"
              >
                Connect on LinkedIn
              </a>
              <a
                href="https://github.com/ag-algolab/ShahMat"
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 rounded-xl border border-white/20 hover:bg-white/5 hover:border-white/40 transition-all duration-300 font-semibold"
              >
                Star on GitHub
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <img src="/logo.jpg" alt="Logo" className="w-8 h-8 object-contain rounded-lg" />
            <span className="text-sm text-[#a8d4b8]">AG Algo Lab — Building intelligent systems</span>
          </div>
          <Link to="/" className="text-sm text-white/50 hover:text-white transition-colors">
            ← Back to home
          </Link>
        </div>
      </footer>
    </main>
  );
}
