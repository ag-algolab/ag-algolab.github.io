// src/pages/ShahMat.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

/* ================= ANIMATED MINI CHESSBOARD ================= */
function MiniChessboard() {
  const initialPieces = [
    { id: 1, type: "♔", row: 3, col: 0 },  // Roi blanc
    { id: 2, type: "♕", row: 3, col: 3 },  // Dame blanche
    { id: 3, type: "♘", row: 3, col: 2 },  // Cavalier blanc
    { id: 4, type: "♚", row: 0, col: 3 },  // Roi noir
    { id: 5, type: "♞", row: 0, col: 2 },  // Cavalier noir
    { id: 6, type: "♟", row: 1, col: 1 },  // Pion noir
  ];

  const [pieces, setPieces] = useState(initialPieces);
  const [movingPiece, setMovingPiece] = useState(null);
  const [highlightedSquare, setHighlightedSquare] = useState(null); // Case menacée

  /*
    Scénario de la mini-partie :
    
    1. ♘ Cavalier blanc (3,2) -> (1,3) : attaque le roi noir, menace
    2. ♚ Roi noir (0,3) -> (0,2) : fuit l'échec (le cavalier noir était là, on le décale au setup)
       -> En fait, redesign: cavalier noir en (0,1) au départ
    
    Nouveau setup plus clean :
  */

  // Séquence narrative :
  // 1. Blanc joue : Cavalier menace la dame noire (si on avait une dame noire) 
  //    -> Simplifions : Cavalier blanc attaque une case clé
  // 2. Noir répond...
  
  // NOUVELLE APPROCHE : Une vraie micro-partie
  
  const moveSequence = [
    // Tour 1 - Blanc : Cavalier avance, menace le pion
    { 
      pieceId: 3, 
      toRow: 1, 
      toCol: 3,
      threat: { row: 1, col: 1 }, // Menace le pion en (1,1)
      narrative: "Cavalier blanc menace le pion"
    },
    
    // Tour 1 - Noir : Pion avance pour fuir
    { 
      pieceId: 6, 
      toRow: 2, 
      toCol: 1,
      threat: null,
      narrative: "Pion fuit"
    },
    
    // Tour 2 - Blanc : Dame attaque
    { 
      pieceId: 2, 
      toRow: 1, 
      toCol: 3,  // Oops cavalier là -> Dame va ailleurs
      narrative: "Dame avance"
    },
    // ... on va simplifier
  ];

  // VRAIE VERSION CLEAN :
  
  const gameSequence = [
    // === État initial ===
    // Row 0: [_, ♞, _, ♚]
    // Row 1: [_, ♟, _, _]
    // Row 2: [_, _, _, _]
    // Row 3: [♔, _, ♘, ♕]
    
    // Tour 1 - BLANC : Cavalier (3,2) -> (2,0) en L
    // Menace rien directement, développement
    { pieceId: 3, toRow: 2, toCol: 0, threat: null },
    
    // Tour 1 - NOIR : Pion (1,1) -> (2,1) avance
    { pieceId: 6, toRow: 2, toCol: 1, threat: null },
    
    // Tour 2 - BLANC : Cavalier (2,0) -> (0,1) mange le cavalier noir? 
    // Non, cavalier noir en (0,1). Cavalier (2,0) -> (1,2) menace case (0,0) et (3,3)
    { pieceId: 3, toRow: 1, toCol: 2, threat: null },
    
    // Tour 2 - NOIR : Cavalier noir (0,1) -> (2,2) en L, MENACE LA DAME en (3,3)!
    { pieceId: 5, toRow: 2, toCol: 2, threat: { row: 3, col: 3 } },
    
    // Tour 3 - BLANC : Dame FUIT (3,3) -> (3,1) 
    { pieceId: 2, toRow: 3, toCol: 1, threat: null },
    
    // Tour 3 - NOIR : Cavalier continue (2,2) -> (0,3)? Non roi là. -> (1,0)
    { pieceId: 5, toRow: 1, toCol: 0, threat: null },
    
    // Tour 4 - BLANC : Cavalier (1,2) -> (0,0) 
    { pieceId: 3, toRow: 0, toCol: 0, threat: null },
    
    // Tour 4 - NOIR : Roi (0,3) -> (1,3) descend
    { pieceId: 4, toRow: 1, toCol: 3, threat: null },
    
    // === RESET pour boucle : tout le monde revient ===
    // On fait revenir les pièces une par une
    { pieceId: 4, toRow: 0, toCol: 3, threat: null }, // Roi noir revient
    { pieceId: 3, toRow: 3, toCol: 2, threat: null }, // Cavalier blanc revient
    { pieceId: 5, toRow: 0, toCol: 1, threat: null }, // Cavalier noir revient
    { pieceId: 2, toRow: 3, toCol: 3, threat: null }, // Dame revient
    { pieceId: 6, toRow: 1, toCol: 1, threat: null }, // Pion revient
  ];

  useEffect(() => {
    let moveIndex = 0;
    
    const interval = setInterval(() => {
      const move = gameSequence[moveIndex % gameSequence.length];
      
      setMovingPiece(move.pieceId);
      setHighlightedSquare(move.threat);
      
      setTimeout(() => {
        setPieces(prev => prev.map(p => 
          p.id === move.pieceId 
            ? { ...p, row: move.toRow, col: move.toCol }
            : p
        ));
        setMovingPiece(null);
        
        // Garder le highlight de menace un peu plus longtemps
        setTimeout(() => setHighlightedSquare(null), 800);
      }, 500);
      
      moveIndex++;
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const cellSize = 60;
  const isWhitePiece = (type) => ["♔", "♕", "♖", "♗", "♘", "♙"].includes(type);

  return (
    <div className="relative">
      <div className="absolute -inset-6 bg-gradient-to-br from-emerald-500/20 to-green-500/10 rounded-3xl blur-2xl" />
      
      <div 
        className="relative rounded-xl overflow-hidden border-2 border-emerald-700/50 shadow-2xl shadow-emerald-900/50"
        style={{ width: cellSize * 4, height: cellSize * 4 }}
      >
        {/* Cases du plateau */}
        {[...Array(16)].map((_, i) => {
          const row = Math.floor(i / 4);
          const col = i % 4;
          const isLight = (row + col) % 2 === 0;
          const isThreatened = highlightedSquare?.row === row && highlightedSquare?.col === col;
          
          return (
            <div
              key={i}
              className={`absolute transition-colors duration-300 ${
                isThreatened 
                  ? 'bg-red-500/70' 
                  : isLight 
                    ? 'bg-[#eeeed2]' 
                    : 'bg-[#769656]'
              }`}
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
        {pieces.map((piece) => (
          <motion.div
            key={piece.id}
            className="absolute flex items-center justify-center select-none"
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
              stiffness: 150,
              damping: 20,
            }}
          >
            <span 
              className={`text-5xl ${movingPiece === piece.id ? 'scale-110' : 'scale-100'} transition-transform duration-200`}
              style={{
                color: isWhitePiece(piece.type) ? '#ffffff' : '#1a1a1a',
                textShadow: isWhitePiece(piece.type)
                  ? '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000, 2px 2px 4px rgba(0,0,0,0.3)'
                  : '0 2px 4px rgba(0,0,0,0.3)',
                WebkitTextStroke: isWhitePiece(piece.type) ? '1px #333' : 'none',
              }}
            >
              {piece.type}
            </span>
          </motion.div>
        ))}
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
