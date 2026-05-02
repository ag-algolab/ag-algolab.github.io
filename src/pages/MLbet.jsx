import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, ChevronRight, CheckCircle, XCircle, Database, Brain, TrendingUp, Send, BarChart2, Zap, Globe, Phone, MoreVertical } from 'lucide-react';

/* ========== SPARKLINE CURVE ========== */
function SparkCurve({ visible }) {
  const points = [0, 8, 5, 15, 10, 22, 16, 30, 24, 20, 28, 38, 32, 45, 40, 55, 50, 48, 60, 72];
  const w = 200, h = 50;
  const min = Math.min(...points), max = Math.max(...points);
  const scale = (v) => h - ((v - min) / (max - min)) * h;
  const path = points.map((v, i) => `${i === 0 ? 'M' : 'L'} ${(i / (points.length - 1)) * w} ${scale(v)}`).join(' ');

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          exit={{ opacity: 0, scaleX: 0 }}
          style={{ transformOrigin: 'left' }}
          className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none"
        >
          <svg width="100%" height="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="absolute inset-0 opacity-30">
            <defs>
              <linearGradient id="curveGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#16a34a" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#16a34a" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={path + ` L ${w} ${h} L 0 ${h} Z`} fill="url(#curveGrad)" />
            <path d={path} fill="none" stroke="#22c55e" strokeWidth="2" />
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ========== ANIMATED COUNTER ========== */
function Counter({ end, suffix = '', prefix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        let start = 0;
        const duration = 1800;
        const step = (end / duration) * 16;
        const timer = setInterval(() => {
          start += step;
          if (start >= end) { setCount(end); clearInterval(timer); }
          else setCount(Math.floor(start));
        }, 16);
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);

  return <span ref={ref}>{prefix}{count}{suffix}</span>;
}

/* ========== WORKFLOW NODE ========== */
function WorkflowNode({ icon, title, subtitle, color, delay, children }) {
  const colors = {
    emerald: 'border-emerald-500/40 bg-emerald-500/5 shadow-emerald-500/10',
    teal: 'border-teal-500/40 bg-teal-500/5 shadow-teal-500/10',
    green: 'border-green-500/40 bg-green-500/5 shadow-green-500/10',
    lime: 'border-lime-500/40 bg-lime-500/5 shadow-lime-500/10',
    red: 'border-red-500/40 bg-red-500/5 shadow-red-500/10',
    cyan: 'border-cyan-500/40 bg-cyan-500/5 shadow-cyan-500/10',
    forest: 'border-green-700/40 bg-green-900/10 shadow-green-700/10',
  };
  const iconColors = {
    emerald: 'text-emerald-400 bg-emerald-500/15',
    teal: 'text-teal-400 bg-teal-500/15',
    green: 'text-green-400 bg-green-500/15',
    lime: 'text-lime-400 bg-lime-500/15',
    red: 'text-red-400 bg-red-500/15',
    cyan: 'text-cyan-400 bg-cyan-500/15',
    forest: 'text-green-300 bg-green-800/20',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className={`relative bg-[#05100a] rounded-xl border p-5 ${colors[color]}`}
    >
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${iconColors[color]}`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-white text-sm mb-0.5">{title}</h4>
          <p className="text-white/40 text-xs leading-relaxed">{subtitle}</p>
          {children}
        </div>
      </div>
    </motion.div>
  );
}

/* ========== TELEGRAM CHANNEL MOCK ========== */
function TelegramChannel() {
  const [activeMsg, setActiveMsg] = useState(0);
  const messages = [
    {
      league: 'Belgique — Challenger Pro League 🔥',
      matches: [
        { confidence: 65.0, color: 'green', time: '19:00', home: 'Liège', away: 'Club Brugge II', winner: 'Liège', fairOdd: '1.54', realOdd: '1.82', dnb: '1.24' },
        { confidence: 47.4, color: 'orange', time: '19:00', home: 'RSC Anderlecht II', away: 'KRC Genk II', winner: 'RSC Anderlecht II', fairOdd: '2.11', realOdd: '2.19', dnb: '1.66' },
      ]
    },
    {
      league: 'Allemagne — 2. Bundesliga 🔥',
      matches: [
        { confidence: 61.3, color: 'yellow', time: '17:30', home: 'VfL Bochum', away: '1. FC Nürnberg', winner: 'VfL Bochum', fairOdd: '1.63', realOdd: '2.15', dnb: '1.25' },
      ]
    },
    {
      league: 'Espagne — Segunda División 🔥',
      matches: [
        { confidence: 47.9, color: 'blue', time: '19:30', home: 'AD Ceuta FC', away: 'Granada CF', winner: 'AD Ceuta FC', fairOdd: '2.09', realOdd: '2.75', dnb: '1.51' },
      ]
    }
  ];

  useEffect(() => {
    const t = setInterval(() => setActiveMsg(p => (p + 1) % messages.length), 3200);
    return () => clearInterval(t);
  }, []);

  const confidenceColor = (c) => {
    if (c >= 60) return 'text-green-400 bg-green-500/10 border-green-500/20';
    if (c >= 50) return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
    return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
  };
  const confidenceCircle = (c) => {
    if (c >= 60) return '🟢';
    if (c >= 50) return '🟡';
    return '🟠';
  };

  return (
    <div className="w-full max-w-[340px]">
      <div className="bg-[#0a1209] rounded-[2.5rem] border border-white/[0.06] overflow-hidden shadow-2xl shadow-black/60">
        <div className="h-7 bg-[#0a1209] relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-b-2xl" />
        </div>
        <div className="bg-[#0d1a0f] px-4 py-2.5 flex items-center gap-3 border-b border-white/[0.04]">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-600 to-green-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <span className="text-base">⚽</span>
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-white font-semibold text-sm">Canal MLbet</span>
            <div className="text-white/35 text-[11px]">📢 canal public</div>
          </div>
          <div className="flex items-center gap-2.5 text-white/25">
            <MoreVertical className="w-4 h-4" />
          </div>
        </div>

        <div className="h-[340px] p-3 flex flex-col gap-2 bg-[#0a1209] overflow-hidden">
          <div className="max-w-[90%] bg-[#102414] rounded-2xl rounded-bl-sm px-3.5 py-2 border border-white/[0.03]">
            <p className="text-white/70 text-[12px] mb-0.5">🟢 <span className="font-semibold text-white/90">MLbet</span> vous souhaite une journée profitable !</p>
            <p className="text-white/50 text-[11px]">🚀 Le modèle tourne</p>
            <span className="text-white/20 text-[10px]">7:37</span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeMsg}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="max-w-[95%] bg-[#102414] rounded-2xl rounded-bl-sm px-3.5 py-2.5 border border-emerald-500/10"
            >
              <p className="text-emerald-400/80 font-semibold text-[11px] mb-2">{messages[activeMsg].league}</p>
              {messages[activeMsg].matches.map((m, i) => (
                <div key={i} className={`mb-2 last:mb-0 rounded-xl p-2.5 border ${confidenceColor(m.confidence)}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider">{confidenceCircle(m.confidence)} Confiance : {m.confidence}%</span>
                    <span className="text-white/30 text-[10px]">⏰ {m.time}</span>
                  </div>
                  <div className="text-[10px] text-white/60 space-y-0.5">
                    <div><span className="text-white/40">Domicile :</span> <span className="text-white/80">{m.home}</span></div>
                    <div><span className="text-white/40">Extérieur :</span> <span className="text-white/80">{m.away}</span></div>
                    <div><span className="text-white/40">Vainqueur :</span> <span className="text-white font-semibold">{m.winner} 🏆</span></div>
                    <div className="flex gap-3 mt-1">
                      <span>💰 Juste : <span className="text-green-400">{m.fairOdd}</span></span>
                      <span>🎰 Réelle : <span className="text-emerald-400">{m.realOdd}</span></span>
                    </div>
                    <div className="text-green-400/70 text-[9px]">✅ DNB : {m.dnb}</div>
                  </div>
                </div>
              ))}
              <span className="text-white/20 text-[10px]">7:44</span>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center gap-1.5 mt-auto">
            {messages.map((_, i) => (
              <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i === activeMsg ? 'w-4 bg-emerald-400' : 'w-1.5 bg-white/15'}`} />
            ))}
          </div>
        </div>

        <div className="bg-[#0d1a0f] px-3 py-2 border-t border-white/[0.04]">
          <div className="bg-[#162d1a] rounded-full px-4 py-2 flex items-center gap-2">
            <span className="text-white/20 text-sm flex-1">Message</span>
            <div className="w-7 h-7 rounded-full bg-emerald-500/15 flex items-center justify-center">
              <Send className="w-3.5 h-3.5 text-emerald-400/70" />
            </div>
          </div>
        </div>
        <div className="h-5 flex items-center justify-center bg-[#0a1209]">
          <div className="w-28 h-1 bg-white/15 rounded-full" />
        </div>
      </div>
    </div>
  );
}

/* ========== TELEGRAM BOT MOCK ========== */
function TelegramBot() {
  const [screen, setScreen] = useState('menu');
  const [selected, setSelected] = useState(null);

  const countries = [
    { name: 'France' }, { name: 'Angleterre' }, { name: 'Allemagne' }, { name: 'Italie' },
    { name: 'Espagne' }, { name: 'Pays-Bas' }, { name: 'Belgique' }, { name: 'Japon' },
  ];

  const results = {
    Angleterre: [{ league: 'Premier League', time: '19:30', home: 'Manchester City', away: 'Fulham', winner: 'Manchester City', prob: '81.9%', fairOdd: '1.22', realOdd: '1.40' }],
    Allemagne: [{ league: '2. Bundesliga', time: '17:30', home: 'VfL Bochum', away: 'Nürnberg', winner: 'VfL Bochum', prob: '61.3%', fairOdd: '1.63', realOdd: '2.15' }],
    France: [{ league: 'Ligue 1', time: '20:00', home: 'PSG', away: 'Lyon', winner: 'PSG', prob: '78.2%', fairOdd: '1.31', realOdd: '1.55' }],
    Espagne: [{ league: 'Segunda División', time: '19:30', home: 'AD Ceuta FC', away: 'Granada CF', winner: 'AD Ceuta FC', prob: '47.9%', fairOdd: '2.09', realOdd: '2.75' }],
    Italie: [{ league: 'Serie A', time: '21:00', home: 'Inter Milan', away: 'Napoli', winner: 'Inter Milan', prob: '58.4%', fairOdd: '1.72', realOdd: '2.10' }],
    'Pays-Bas': [{ league: 'Eredivisie', time: '18:45', home: 'Ajax', away: 'Feyenoord', winner: 'Ajax', prob: '52.1%', fairOdd: '1.90', realOdd: '2.25' }],
    Belgique: [{ league: 'Pro League', time: '19:00', home: 'Liège', away: 'Club Brugge II', winner: 'Liège', prob: '65.0%', fairOdd: '1.54', realOdd: '1.82' }],
    Japon: [{ league: 'J. League', time: '12:00', home: 'Kashima', away: 'Yokohama', winner: 'Kashima', prob: '55.7%', fairOdd: '1.80', realOdd: '2.05' }],
  };

  const handleSelect = (name) => { setSelected(name); setScreen('result'); };

  return (
    <div className="w-full max-w-[340px]">
      <div className="bg-[#0a1209] rounded-[2.5rem] border border-white/[0.06] overflow-hidden shadow-2xl shadow-black/60">
        <div className="h-7 bg-[#0a1209] relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-b-2xl" />
        </div>

        <div className="bg-[#0d1a0f] px-4 py-2.5 flex items-center gap-3 border-b border-white/[0.04]">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-600 to-green-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <span className="text-base font-bold text-white text-sm">M</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-white font-semibold text-sm">MLbet</span>
              <svg className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
              </svg>
            </div>
            <div className="text-white/35 text-[11px]">bot</div>
          </div>
          <MoreVertical className="w-4 h-4 text-white/25" />
        </div>

        <div className="h-[340px] bg-[#0a1209] overflow-hidden relative" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Ctext x='5' y='20' fill='rgba(34,197,94,0.04)' font-size='10' font-family='monospace'%3Esin(x)%3C/text%3E%3Ctext x='40' y='50' fill='rgba(34,197,94,0.04)' font-size='8' font-family='monospace'%3Eπ²/6%3C/text%3E%3Ctext x='10' y='80' fill='rgba(34,197,94,0.04)' font-size='9' font-family='monospace'%3Elim→∞%3C/text%3E%3C/svg%3E")`,
        }}>
          <div className="p-3 flex flex-col gap-2 h-full">
            <div className="self-end bg-[#1a4a20] rounded-2xl rounded-br-sm px-3 py-1.5 max-w-[60%]">
              <span className="text-white text-[13px] font-mono">/start</span>
              <span className="text-white/30 text-[9px] ml-2">13:46 ✓✓</span>
            </div>

            <AnimatePresence mode="wait">
              {screen === 'menu' ? (
                <motion.div key="menu" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-[95%]">
                  <div className="bg-[#102414] rounded-2xl rounded-bl-sm px-3.5 py-2.5 border border-white/[0.03] mb-2">
                    <p className="text-white text-[12px] mb-0.5">⚽ <span className="font-semibold">Bienvenue sur MLbet</span> ⚽</p>
                    <p className="text-white/55 text-[11px]">Dernière analyse : Aujourd'hui à 8h54</p>
                    <p className="text-white/55 text-[11px]">🌐 Choisissez un pays :</p>
                    <span className="text-white/20 text-[10px]">13:46</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {countries.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => handleSelect(c.name)}
                        className="bg-[#162d1a] hover:bg-[#1d3d22] border border-white/[0.06] rounded-xl px-3 py-2 text-white/80 text-[12px] text-left transition-all duration-200 hover:border-emerald-500/30 hover:text-emerald-300"
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div key="result" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col gap-2 max-w-[95%]">
                  <div className="self-end bg-[#1a4a20] rounded-2xl rounded-br-sm px-3 py-1.5">
                    <span className="text-white text-[12px]">{selected}</span>
                  </div>
                  {(results[selected] || []).map((m, i) => (
                    <div key={i} className="bg-[#102414] rounded-2xl rounded-bl-sm px-3.5 py-2.5 border border-emerald-500/10">
                      <p className="text-white/60 text-[11px] mb-1.5">Cote(s) surévaluée(s) aujourd'hui en {selected} :</p>
                      <p className="text-emerald-400/80 font-semibold text-[11px] mb-1">⚡ {m.league} — {m.time} ⚡</p>
                      <p className="text-white font-semibold text-[12px]">{m.home} VS {m.away}</p>
                      <p className="text-white/70 text-[11px]">🥇 Vainqueur → <span className="text-white font-medium">{m.winner}</span></p>
                      <p className="text-white/70 text-[11px]">🎯 Probabilité → <span className="text-green-400 font-medium">{m.prob}</span></p>
                      <div className="mt-1.5 flex items-center gap-1">
                        <span className="text-white/50 text-[10px]">Juste {m.fairOdd}</span>
                        <span className="text-white/20 text-[10px]">|</span>
                        <span className="text-white/50 text-[10px]">Observée {m.realOdd}</span>
                        <span className="text-green-400 text-[10px]">✅</span>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => setScreen('menu')}
                    className="bg-[#162d1a] border border-white/[0.06] rounded-xl px-3 py-2 text-white/70 text-[12px] flex items-center justify-center gap-1.5 hover:bg-[#1d3d22] transition-all"
                  >
                    ◀ Retour au menu
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="bg-[#0d1a0f] px-3 py-2 border-t border-white/[0.04]">
          <div className="bg-[#162d1a] rounded-full px-4 py-2 flex items-center gap-2">
            <span className="text-white/20 text-sm flex-1">Message</span>
            <div className="w-7 h-7 rounded-full bg-emerald-500/15 flex items-center justify-center">
              <Send className="w-3.5 h-3.5 text-emerald-400/70" />
            </div>
          </div>
        </div>
        <div className="h-5 flex items-center justify-center bg-[#0a1209]">
          <div className="w-28 h-1 bg-white/15 rounded-full" />
        </div>
      </div>
    </div>
  );
}

/* ========== WORKFLOW ARROW ========== */
function WorkflowArrow({ condition }) {
  if (condition) {
    return (
      <div className="flex flex-col items-center gap-1 my-1">
        <div className="w-px h-4 bg-gradient-to-b from-white/10 to-white/5" />
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
          condition === 'yes' ? 'text-green-400 border-green-500/30 bg-green-500/5' : 'text-red-400 border-red-500/30 bg-red-500/5'
        }`}>{condition === 'yes' ? '✅ OUI' : '❌ NON'}</span>
        <div className="w-px h-4 bg-gradient-to-b from-white/10 to-white/5" />
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center my-1">
      <div className="w-px h-6 bg-gradient-to-b from-emerald-500/40 to-emerald-500/10" />
      <div className="w-2 h-2 border-r-2 border-b-2 border-emerald-500/40 rotate-45 -mt-1" />
    </div>
  );
}

/* ========== HEDGE HUNT SECTION ========== */
function HedgeHuntSection() {
  const bookmakerPoints = [
    { label: 'Leur seul objectif', text: 'Profiter peu importe le vainqueur. Pas prédire, se protéger.' },
    { label: 'Cotes d\'ouverture', text: 'Les premières cotes ne sont qu\'une ébauche. Un point de départ pour tester le marché.' },
    { label: 'Ils suivent l\'argent', text: "Si les mises s'accumulent sur une équipe, ils raccourcissent les cotes. Pas parce que l'équipe a changé, mais pour limiter leur exposition." },
    { label: 'Toujours équilibrés', text: "Ils ajustent jusqu'à être couverts de chaque côté. Qu'on gagne ou qu'on perde, ils encaissent leur commission." },
  ];

  const ourPoints = [
    { label: 'La fenêtre', text: "Juste après l'ouverture des cotes, elles sont souvent déséquilibrées. Le marché n'a pas encore bougé. C'est notre point d'entrée." },
    { label: 'Probabilité réelle', text: 'Notre modèle calcule ce que les vraies cotes devraient être, indépendamment de la pression publique ou des volumes.' },
    { label: 'Repérer l\'écart', text: "Quand le bookmaker paie plus que ce que notre probabilité justifie, c'est un signal de valeur." },
    { label: 'On agit en premier', text: 'Avant que la foule ajuste le marché. Avant que les cotes convergent vers leur valeur juste.' },
  ];

  return (
    <section className="py-28 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-72 h-72 bg-red-500/[0.04] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-72 h-72 bg-emerald-500/[0.05] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/10 mb-6">
            <span className="text-white/40 text-xs font-medium uppercase tracking-widest">Le Vrai Jeu</span>
          </div>

          <h2 className="text-5xl md:text-6xl font-black tracking-tight text-white">
            Les Bookmakers Se Couvrent. Nous Chassons.
          </h2>

          <p className="text-white/35 text-base mt-4 max-w-md mx-auto leading-relaxed">
            Ils jouent un jeu différent de celui que vous imaginez. Comprendre le leur, c'est gagner le nôtre.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-5 items-stretch">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-white/[0.07] bg-white/[0.02] overflow-hidden flex flex-col"
          >
            <div className="px-6 pt-6 pb-5 border-b border-white/[0.06]">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-base">🏦</div>
                <span className="text-red-400/80 text-xs font-semibold uppercase tracking-widest">Le Bookmaker</span>
              </div>
              <p className="text-white font-bold text-xl mt-3">Leur métier n'est pas de prédire.<br/>C'est de toujours gagner.</p>
            </div>

            <div className="px-6 py-5 flex flex-col gap-4 flex-1">
              {bookmakerPoints.map((p, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.15 + i * 0.08 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-3"
                >
                  <span className="text-white/25 text-sm mt-0.5 flex-shrink-0 font-light">→</span>
                  <div>
                    <span className="text-white/70 text-sm font-semibold">{p.label} : </span>
                    <span className="text-white/40 text-sm">{p.text}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mx-6 mb-6 rounded-2xl bg-red-500/5 border border-red-500/15 px-4 py-3">
              <p className="text-red-400/70 text-xs font-medium text-center">
                Les cotes reflètent la gestion des risques — pas la vérité.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-emerald-500/20 bg-emerald-500/[0.03] overflow-hidden flex flex-col"
          >
            <div className="px-6 pt-6 pb-5 border-b border-emerald-500/[0.12]">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-base">⚡</div>
                <span className="text-emerald-400/80 text-xs font-semibold uppercase tracking-widest">MLbet</span>
              </div>
              <p className="text-white font-bold text-xl mt-3">Notre mission : valoriser<br/>mieux que le marché.</p>
            </div>

            <div className="px-6 py-5 flex flex-col gap-4 flex-1">
              {ourPoints.map((p, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.25 + i * 0.08 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-3"
                >
                  <span className="text-white/25 text-sm mt-0.5 flex-shrink-0 font-light">→</span>
                  <div>
                    <span className="text-white/70 text-sm font-semibold">{p.label} : </span>
                    <span className="text-white/40 text-sm">{p.text}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mx-6 mb-6 rounded-2xl bg-emerald-500/8 border border-emerald-500/20 px-4 py-3">
              <p className="text-emerald-400/80 text-xs font-medium text-center">
                Nous ne battons pas le bookmaker. Nous battons l'horloge.
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-10 flex items-center justify-center gap-4"
        >
          <div className="h-px flex-1 max-w-[140px] bg-gradient-to-r from-transparent to-red-500/30" />
          <div className="px-5 py-2.5 rounded-full border border-white/10 bg-white/[0.03]">
            <span className="text-white/50 text-xs font-medium">C'est dans l'écart entre eux que vit l'avantage</span>
          </div>
          <div className="h-px flex-1 max-w-[140px] bg-gradient-to-l from-transparent to-emerald-500/30" />
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
    </section>
  );
}

/* ========== WEEKLY BREAKDOWN ========== */
const WEEKS_DATA = [
  { week: 12, signals: 37, pnl: 1466.5, flatYield: 44.9, note: null },
  { week: 13, signals: 2, pnl: 172.9, flatYield: 126.2, note: 'Trêve internationale — très peu de matchs joués' },
  { week: 14, signals: 18, pnl: 597.8, flatYield: 34.0, note: null },
  { week: 15, signals: 12, pnl: 493.0, flatYield: 41.1, note: 'Nouveau modèle en ligne — priorité à la constance plutôt qu\'aux rendements agressifs' },
  { week: 16, signals: 9, pnl: 397.0, flatYield: 44.1, note: null },
  { week: 17, signals: 10, pnl: 455.0, flatYield: 45.5, note: null },
];

function WeeklyBreakdown() {
  const maxFlatYield = Math.max(...WEEKS_DATA.map((w) => w.flatYield));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="mt-5"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <span className="text-white/40 text-xs uppercase tracking-widest font-medium">Récapitulatif hebdomadaire</span>
          <div className="h-px w-10 bg-white/10" />
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[520px]">
          <div className="grid grid-cols-[56px_64px_1fr_88px] gap-3 px-4 mb-2">
            {['Semaine', 'Signaux', 'Rendement plat', 'P&L'].map((h) => (
              <span key={h} className="text-white/20 text-[10px] uppercase tracking-wider font-mono">{h}</span>
            ))}
          </div>

          <div className="space-y-2">
            {WEEKS_DATA.map((w, i) => (
              <motion.div
                key={w.week}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                viewport={{ once: true }}
                className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-3.5 hover:border-emerald-500/25 hover:bg-emerald-500/[0.03] transition-all duration-300 cursor-default"
              >
                <div className="absolute inset-x-0 top-0 h-px rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent pointer-events-none" />

                <div className="grid grid-cols-[56px_64px_1fr_88px] gap-3 items-center">
                  <div className="flex items-center">
                    <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 bg-gradient-to-r from-emerald-400 to-green-300 bg-clip-text text-transparent">
                      S{w.week}
                    </span>
                  </div>

                  <span className="text-white/45 text-sm font-mono">{w.signals}</span>

                  <div className="flex items-center gap-2.5">
                    <div className="flex-1 h-[3px] bg-white/[0.06] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${(w.flatYield / maxFlatYield) * 100}%` }}
                        transition={{ duration: 0.9, delay: i * 0.08 + 0.25, ease: 'easeOut' }}
                        viewport={{ once: true }}
                        className="h-full rounded-full"
                        style={{ background: 'linear-gradient(90deg, #16a34a, #86efac)' }}
                      />
                    </div>
                    <span
                      className="font-mono text-sm font-bold bg-clip-text text-transparent whitespace-nowrap"
                      style={{ backgroundImage: 'linear-gradient(135deg, #4ade80, #86efac)' }}
                    >
                      +{w.flatYield.toFixed(1)}%
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-green-400 font-mono text-sm font-bold whitespace-nowrap">
                      +{w.pnl.toLocaleString('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} €
                    </span>
                  </div>
                </div>

                {w.note && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-amber-400/50 flex-shrink-0" />
                    <span className="text-white/22 text-[10px] font-mono italic">{w.note}</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

const MODEL_UPGRADE_AT = 57;
const PERF_DATA = {
  pnl: [
    -63.8,-58.3,112.4,97.9,-55.7,95.5,433.9,-122.5,182.7,223.7,
    266.9,-77.0,117.8,98.4,-56.9,84.1,-85.4,85.2,108.2,-60.5,
    -81.3,-70.1,132.7,-107.3,-112.6,160.1,66.8,67.0,-140.7,-93.2,
    210.8,-78.1,114.3,170.8,-79.7,61.7,-81.5,88.0,85.0,-84.9,-123.2,
    94.0,180.1,463.9,-69.8,239.3,-180.3,-115.6,-113.1,-54.7,228.3,-72.5,
    -45.2,96.8,155.6,70.0,-71.1,75,-100,79,107.0,125.0,170.0,-100,112,
    -100,165,-100,60,60,112,62,-100,143,110,210,-100,-100,96,16,118,78,
    117,-100,104,-100,105,21
  ],
  avgOdd: '2.42',
  signals: 88,
  totalPnL: 3582.2
};

const CHART_PATH = "M 58.0 178.5 L 66.3 180.9 L 74.6 176.3 L 82.9 172.3 L 91.2 174.6 L 99.5 170.6 L 107.8 152.9 L 116.1 157.9 L 124.4 150.4 L 132.7 141.2 L 141.0 130.3 L 149.3 133.4 L 157.6 128.6 L 165.9 124.6 L 174.2 126.9 L 182.5 123.5 L 190.8 127.0 L 199.1 123.5 L 207.4 119.0 L 215.7 121.5 L 224.0 124.9 L 232.3 127.7 L 240.6 122.3 L 248.9 126.7 L 257.2 131.3 L 265.5 124.7 L 273.8 122.0 L 282.1 119.3 L 290.4 125.0 L 298.7 128.8 L 307.0 120.2 L 315.3 123.4 L 323.6 118.7 L 331.9 111.7 L 340.2 115.0 L 348.5 112.5 L 356.8 115.8 L 365.1 112.2 L 373.4 108.7 L 381.7 112.2 L 390.0 117.2 L 398.3 113.4 L 406.6 106.0 L 414.9 87.0 L 423.1 89.9 L 431.4 80.1 L 439.7 87.4 L 448.0 92.2 L 456.3 96.8 L 464.6 99.1 L 472.9 89.7 L 481.2 92.7 L 489.5 94.5 L 497.8 90.6 L 506.1 84.2 L 514.4 81.3 L 522.7 84.2 L 531.0 81.2 L 539.3 85.2 L 547.6 82.0 L 555.9 77.6 L 564.2 72.5 L 572.5 65.5 L 580.8 69.6 L 589.1 65.0 L 597.4 69.1 L 605.7 62.4 L 614.0 66.5 L 622.3 64.0 L 630.6 61.6 L 638.9 57.0 L 647.2 54.4 L 655.5 58.5 L 663.8 52.7 L 672.1 48.2 L 680.4 39.6 L 688.7 43.7 L 697.0 47.8 L 705.3 43.8 L 713.6 43.2 L 721.9 38.3 L 730.2 35.1 L 738.5 30.3 L 746.8 34.4 L 755.1 30.2 L 763.4 34.3 L 771.7 30.0 L 780.0 29.1"
const PATH_LENGTH = 851;
const LAST_X = 780.0;
const LAST_Y = 29.1;
const ZERO_Y = 175.9;
const Y_TICKS = [{'val': -344, 'y': 190.0}, {'val': 693, 'y': 147.5}, {'val': 1730, 'y': 105.0}, {'val': 2767, 'y': 62.5}, {'val': 3804, 'y': 20.0}];

function PerformanceSection() {
  const ref = useRef(null);
  const [dashOffset, setDashOffset] = useState(PATH_LENGTH);
  const [done, setDone] = useState(false);
  const animStarted = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animStarted.current) {
          animStarted.current = true;
          const duration = 2800;
          let start = null;
          const ease = (t) => t < 0.5 ? 2*t*t : -1+(4-2*t)*t;
          const step = (ts) => {
            if (!start) start = ts;
            const raw = Math.min((ts - start) / duration, 1);
            const eased = ease(raw);
            setDashOffset(PATH_LENGTH * (1 - eased));
            if (raw < 1) { requestAnimationFrame(step); }
            else { setDashOffset(0); setDone(true); }
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.25 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const stats = [
    { label: 'Signaux envoyés', display: `${PERF_DATA.signals}`, color: 'green' },
    { label: 'P&L Total', display: `+${PERF_DATA.totalPnL.toLocaleString()} €`, color: 'green' },
    { label: 'Cote moyenne', display: `${PERF_DATA.avgOdd}`, color: 'emerald' },
  ];

  return (
    <section className="py-28 relative overflow-hidden">
      <style>{`
        @keyframes heartbeat {
          0%   { opacity: 1; r: 5; }
          15%  { opacity: 0.9; r: 10; }
          30%  { opacity: 1; r: 5; }
          45%  { opacity: 0.85; r: 13; }
          65%  { opacity: 1; r: 5; }
          100% { opacity: 1; r: 5; }
        }
        @keyframes heartbeat-inner {
          0%   { r: 3; opacity: 1; }
          15%  { r: 6; opacity: 0.7; }
          30%  { r: 3; opacity: 1; }
          45%  { r: 8; opacity: 0.6; }
          65%  { r: 3; opacity: 1; }
          100% { r: 3; opacity: 1; }
        }
        @media (max-width: 640px) {
          .y-tick-hide { display: none; }
        }
        .hb-outer { animation: heartbeat 1.6s ease-in-out infinite; }
        .hb-inner { animation: heartbeat-inner 1.6s ease-in-out infinite; }
      `}</style>

      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/[0.03] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/10 mb-6">
            <span className="text-white/40 text-xs font-medium uppercase tracking-widest">Résultats en Direct</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-3">
            <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              Performances Actuelles | Saison 2025
            </span>
          </h2>
          <p className="text-white/35 text-base max-w-md mx-auto">
            Signaux réels uniquement. Pas de backtest. P&L cumulatif depuis la mise en production du modèle.
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="rounded-3xl border border-white/[0.07] bg-white/[0.02] p-6 mb-5"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-white/40 text-xs uppercase tracking-widest font-medium">P&L Cumulatif</span>
          </div>

          <div className="relative w-full">
            <svg viewBox="0 0 800 220" className="w-full" style={{ height: '220px' }} preserveAspectRatio="none">
              <defs>
                <linearGradient id="perfFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#16a34a" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#16a34a" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="lineGradPerf" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#166534" />
                  <stop offset="100%" stopColor="#4ade80" />
                </linearGradient>
                <clipPath id="chartClip">
                  <rect x="58" y="20" width="722" height="170" />
                </clipPath>
              </defs>

              {Y_TICKS.map((t, i) => (
                <g key={i} className={i === 1 || i === 3 ? 'y-tick-hide' : ''}>
                  <line x1="58" y1={t.y} x2="780" y2={t.y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                  <text x="50" y={t.y + 4} textAnchor="end" fill="rgba(255,255,255,0.22)" fontSize="10" fontFamily="monospace">
                    {t.val >= 0 ? `+${t.val}` : t.val}
                  </text>
                </g>
              ))}

              <line x1="58" y1={ZERO_Y} x2="780" y2={ZERO_Y} stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="4 4" />

              {(() => {
                const total = PERF_DATA.pnl.length;
                const step = Math.ceil(total / 6);
                const ticks = [];
                for (let n = 1; n <= total; n += step) ticks.push(n);
                if (ticks[ticks.length - 1] !== total) ticks.push(total);
                return ticks.map((n, i) => {
                  const x = 58 + ((n - 1) / (total - 1)) * 722;
                  return <text key={i} x={x} y="214" textAnchor="middle" fill="rgba(255,255,255,0.18)" fontSize="9" fontFamily="monospace">#{n}</text>;
                });
              })()}

              {(() => {
                const total = PERF_DATA.pnl.length;
                const ux = 58 + ((MODEL_UPGRADE_AT - 1) / (total - 1)) * 722;
                return (
                  <g>
                    <line x1={ux} y1="20" x2={ux} y2="190" stroke="rgba(239,68,68,0.55)" strokeWidth="1.5" strokeDasharray="4 3" />
                    <text x={ux - 7} y="32" fill="rgba(239,68,68,0.7)" fontSize="9" fontFamily="monospace" fontWeight="bold" transform={`rotate(-45, ${ux - 7}, 32)`}>
                      Mise à Jour du Modèle
                    </text>
                  </g>
                );
              })()}

              <path
                d={CHART_PATH + ` L ${LAST_X} ${ZERO_Y} L 58 ${ZERO_Y} Z`}
                fill="url(#perfFill)"
                clipPath="url(#chartClip)"
                opacity={done ? 1 : 0.4}
              />

              <path
                d={CHART_PATH}
                fill="none"
                stroke="url(#lineGradPerf)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={PATH_LENGTH}
                strokeDashoffset={dashOffset}
                clipPath="url(#chartClip)"
              />
            </svg>

            {!done && dashOffset < PATH_LENGTH && (
              <div className="absolute pointer-events-none" style={{ left: `${(LAST_X / 800) * 100}%`, top: `${(LAST_Y / 220) * 100}%`, transform: 'translate(-50%, -50%)', opacity: 1 - dashOffset / PATH_LENGTH }}>
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
            )}
            {done && (
              <div className="absolute pointer-events-none" style={{ left: `${(LAST_X / 800) * 100}%`, top: `${(LAST_Y / 220) * 100}%`, transform: 'translate(-50%, -50%)' }}>
                <div className="relative flex items-center justify-center">
                  <div className="absolute w-5 h-5 rounded-full bg-emerald-500/30 animate-ping" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mt-2">
            <span className="text-white/20 text-[10px] font-mono">Signal n°1</span>
            <span className="text-white/20 text-[10px] font-mono">Signal n°57</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-5">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.09 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-white/[0.07] bg-white/[0.02] px-5 py-5 text-center"
            >
              <div className="text-xl font-black mb-1.5 bg-gradient-to-r from-emerald-400 to-green-300 bg-clip-text text-transparent">
                {s.display}
              </div>
              <div className="text-white/30 text-xs">{s.label}</div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-white/[0.05] bg-white/[0.015] px-5 py-4 flex items-start gap-3"
        >
          <span className="text-white/20 text-xs mt-0.5 flex-shrink-0">ℹ</span>
          <p className="text-white/30 text-xs leading-relaxed">
            Tous les calculs sont basés sur les cotes Betclic enregistrées au moment de chaque analyse. Les performances passées ne garantissent pas les résultats futurs.
          </p>
        </motion.div>
        <WeeklyBreakdown />
      </div>
    </section>
  );
}

/* ========== MAIN PAGE ========== */
export default function MLbet() {
  const [pulseStep, setPulseStep] = useState(0);
  const [showBackModal, setShowBackModal] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setPulseStep(p => (p + 1) % 5), 900);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-[#030804] text-[#ededed]">

      {/* Ambient bg */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-900/[0.12] rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-green-900/[0.08] rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-950/[0.15] rounded-full blur-3xl" />
      </div>

      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-[#030804]/80 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center relative">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
              <img src="/logo.jpg" alt="Logo" className="w-8 h-8 object-contain rounded-md" />
              <span className="text-[15px] font-semibold text-white tracking-tight">AG Algo Lab</span>
            </Link>
            <div className="absolute left-1/2 -translate-x-1/2">
              <img src="/MLbet_Black_noback.png" alt="MLbet" className="h-7 object-contain opacity-90" />
            </div>
            <button
              onClick={() => setShowBackModal(true)}
              className="text-sm px-4 py-2 rounded-lg border border-white/15 text-white/60 hover:bg-white/5 hover:text-white transition-colors"
            >
              ← Retour
            </button>
          </div>
        </div>
      </nav>

      {/* ======== HERO ======== */}
      <section className="min-h-screen flex items-center justify-center pt-24 pb-16 relative">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-8">
              <span className="text-emerald-400 text-lg">⚽</span>
              <span className="text-emerald-400/80 text-sm font-medium">Intelligence Sportive · 35+ Ligues</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mb-6"
          >
            <img src="/MLbet_Black_noback.png" alt="MLbet" className="h-24 md:h-32 mx-auto object-contain" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl md:text-2xl font-light text-white/50 italic mb-8"
          >
            Nous ne prédisons pas l'avenir — nous le valorisons mieux que le marché
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-3 gap-4 max-w-xl mx-auto mb-16"
          >
            {[
              { label: 'Ligues Couvertes', value: 35, suffix: '' },
              { label: 'Matchs Analysés', value: 115000, suffix: '+' },
              { label: 'Années de Backtest', value: 10, suffix: '' },
            ].map((s, i) => (
              <div key={i} className="bg-[#05100a] border border-emerald-900/40 rounded-xl p-4 text-center">
                <div className="text-2xl font-black bg-gradient-to-r from-emerald-400 to-green-300 bg-clip-text text-transparent mb-1">
                  <Counter end={s.value} suffix={s.suffix} />
                </div>
                <div className="text-white/35 text-xs">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ======== HEDGE / HUNT SECTION ======== */}
      <HedgeHuntSection />

      {/* ======== WORKFLOW ======== */}
      <section className="py-24 relative">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-5">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400/80 text-sm font-medium">Architecture du Système</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                Comment ça Fonctionne
              </span>
            </h2>
            <p className="text-white/40 max-w-xl mx-auto">De la donnée brute au signal en temps réel — voici le pipeline entièrement automatisé.</p>
          </motion.div>

          <div className="max-w-xl mx-auto">
            <WorkflowNode
              icon={<Database className="w-5 h-5" />}
              title="Collecte de Données"
              subtitle="Données de match en direct via une API sportive : calendriers, historiques et plus encore sur 30+ ligues mondiales."
              color="emerald"
              delay={0}
            />
            <WorkflowArrow />

            <WorkflowNode
              icon={<BarChart2 className="w-5 h-5" />}
              title="Ingénierie des Variables"
              subtitle="Des dizaines de features construites depuis les données brutes : moyennes glissantes, indicateurs de forme, force des adversaires, splits domicile/extérieur..."
              color="cyan"
              delay={0.2}
            >
              <div className="mt-2 grid grid-cols-2 gap-1.5">
                {[
                  { label: 'Nombre de features', val: '300+' },
                  { label: 'Fenêtres glissantes', val: '5 / 10 / 20 matchs' }
                ].map(r => (
                  <div key={r.label} className="bg-cyan-500/5 border border-cyan-500/10 rounded-lg px-2.5 py-1.5">
                    <div className="text-white/25 text-[9px] uppercase tracking-wider">{r.label}</div>
                    <div className="text-cyan-400/80 text-[11px] font-medium">{r.val}</div>
                  </div>
                ))}
              </div>
            </WorkflowNode>

            <WorkflowArrow />

            <WorkflowNode
              icon={<Brain className="w-5 h-5" />}
              title="Inférence du Modèle"
              subtitle="Ancré dans la littérature scientifique sur la modélisation des résultats de matchs."
              color="teal"
              delay={0.1}
            >
              <div className="mt-2 flex flex-wrap gap-1.5">
                {['Études Scientifiques', 'Architecture Confidentielle', 'Scoring de Probabilité'].map(t => (
                  <span key={t} className="px-2 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400/70 text-[10px]">{t}</span>
                ))}
              </div>
            </WorkflowNode>

            <WorkflowArrow />

            <WorkflowNode
              icon={<TrendingUp className="w-5 h-5" />}
              title="Calibration des Probabilités"
              subtitle="Les sorties brutes du modèle ne sont pas utilisées directement. Nous appliquons une calibration pour s'assurer que les probabilités prédites reflètent les fréquences réelles."
              color="forest"
              delay={0.25}
            >
              <div className="mt-2 grid grid-cols-2 gap-1.5">
                {[
                  { label: 'Méthode', val: 'Régression isotonique' },
                  { label: 'Sortie', val: 'Probabilité juste' },
                ].map(r => (
                  <div key={r.label} className="bg-green-900/10 border border-green-700/20 rounded-lg px-2.5 py-1.5">
                    <div className="text-white/25 text-[9px] uppercase tracking-wider">{r.label}</div>
                    <div className="text-green-300/80 text-[11px] font-medium">{r.val}</div>
                  </div>
                ))}
              </div>
            </WorkflowNode>

            <WorkflowArrow />

            <WorkflowNode
              icon={<Globe className="w-5 h-5" />}
              title="Récupération des Cotes en Temps Réel"
              subtitle="Cotes bookmakers en temps réel récupérées via API et comparées à la sortie de probabilité juste du modèle."
              color="green"
              delay={0.3}
            />
            <WorkflowArrow />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="relative rounded-2xl border border-teal-500/40 bg-teal-500/5 p-5 shadow-lg shadow-teal-500/10"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-teal-500/15 text-teal-400">
                  <span className="text-lg">⚖️</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-white text-sm mb-1">Détection de Valeur</h4>
                  <p className="text-white/40 text-xs">La cote bookmaker est-elle significativement supérieure à la cote juste du modèle ? Le signal est-il dans les seuils d'entrée optimisés par Optuna ?</p>
                </div>
              </div>
              <div className="flex justify-between mt-4 pt-3 border-t border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-400" />
                  <span className="text-red-400/70 text-xs font-medium">Pas de valeur → Match ignoré</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-green-400/70 text-xs font-medium">Valeur trouvée → Signal !</span>
                </div>
              </div>
            </motion.div>

            <WorkflowArrow condition="yes" />

            <WorkflowNode
              icon={<TrendingUp className="w-5 h-5" />}
              title="Sizing selon le Critère de Kelly"
              subtitle="Chaque position est dimensionnée en fonction de l'edge détecté. La fraction de Kelly alloue le bankroll de façon optimale pour maximiser la croissance à long terme tout en contrôlant le risque."
              color="emerald"
              delay={0.45}
            >
              <div className="mt-2 flex flex-wrap gap-1.5">
                {['Sizing basé sur l\'Edge', 'Gestion du Bankroll', 'Croissance Optimale'].map(t => (
                  <span key={t} className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400/70 text-[10px]">{t}</span>
                ))}
              </div>
            </WorkflowNode>
            <WorkflowArrow />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-green-500/40 bg-green-500/5 p-5 shadow-lg shadow-green-500/15"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-green-500/15 text-green-400">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Signal Envoyé 🚀</h4>
                  <p className="text-white/40 text-xs">Détails du match, cotes, confiance et logique d'entrée envoyés via Telegram</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-[#0a1209] border border-white/[0.06] rounded-xl p-3 flex items-center gap-2.5">
                  <span className="text-lg">📢</span>
                  <div>
                    <div className="text-white/70 text-xs font-medium">Canal</div>
                    <div className="text-white/30 text-[10px]">Diffusion toutes ligues</div>
                  </div>
                </div>
                <div className="bg-[#0a1209] border border-white/[0.06] rounded-xl p-3 flex items-center gap-2.5">
                  <span className="text-lg">🤖</span>
                  <div>
                    <div className="text-white/70 text-xs font-medium">Bot</div>
                    <div className="text-white/30 text-[10px]">À la demande par pays</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ======== TELEGRAM DEMOS ======== */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-500/30 to-transparent" />
        </div>

        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                Interfaces de Livraison
              </span>
            </h2>
            <p className="text-white/40 max-w-lg mx-auto">
              Deux sorties Telegram complémentaires — un canal de diffusion pour tous les signaux, et un bot interactif pour filtrer à la demande.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-start justify-items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center gap-5 w-full max-w-[340px]"
            >
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-3">
                  <span className="text-emerald-400 text-sm">🤖</span>
                  <span className="text-emerald-400/80 text-xs font-medium">Bot Interactif</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-1">MLbet Bot</h3>
                <p className="text-white/35 text-sm">Filtrez par pays, obtenez les paris de valeur du jour à la demande. Cliquez pour interagir !</p>
              </div>
              <TelegramBot />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex flex-col items-center gap-5 w-full max-w-[340px]"
            >
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 mb-3">
                  <span className="text-green-400 text-sm">📢</span>
                  <span className="text-green-400/80 text-xs font-medium">Canal de Diffusion</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-1">Canal MLbet</h3>
                <p className="text-white/35 text-sm">Tous les signaux quotidiens sur chaque ligue couverte — confiance, cotes justes et écart de valeur.</p>
              </div>
              <TelegramChannel />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ======== PERFORMANCE ======== */}
      <PerformanceSection />

      {/* Footer */}
      <footer className="py-10 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2.5">
            <img src="/logo.jpg" alt="Logo" className="w-7 h-7 object-contain rounded-md" />
            <span className="text-sm text-neutral-400">AG Algo Lab — MLbet est un outil de recherche.</span>
          </div>
          <button
            onClick={() => setShowBackModal(true)}
            className="text-sm text-neutral-500 hover:text-white transition-colors font-mono"
          >
            ← Retour à l'accueil
          </button>
        </div>
      </footer>

      {/* ======== HIDDEN PAGE MODAL ======== */}
      <AnimatePresence>
        {showBackModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] flex items-center justify-center px-6 bg-black/70 backdrop-blur-md"
            onClick={() => setShowBackModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md rounded-3xl border border-emerald-500/20 bg-[#030804] p-7 shadow-2xl shadow-emerald-500/10"
            >
              <div className="absolute -top-px left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />

              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <span className="text-base">🔒</span>
                </div>
                <span className="text-emerald-400/80 text-[10px] font-bold uppercase tracking-widest">
                  Page Cachée
                </span>
              </div>

              <h3 className="text-xl font-black text-white mb-2 leading-snug">
                Vous êtes sur le point de quitter un recoin caché d'AG Algo Lab
              </h3>

              <p className="text-white/45 text-sm leading-relaxed mb-2">
                Cette page n'est répertoriée nulle part sur le site public — elle n'est accessible que via un lien direct.
              </p>
              <p className="text-white/45 text-sm leading-relaxed mb-6">
                Une fois de retour à l'accueil, <span className="text-emerald-300/90 font-medium">il n'y aura aucun bouton ou menu pour revenir ici</span>. Pensez à mettre cette URL en favori si vous souhaitez y revenir.
              </p>

              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 mb-6 flex items-center gap-2">
                <span className="text-white/25 text-[10px] font-mono uppercase tracking-wider flex-shrink-0">URL</span>
                <code className="text-white/60 text-xs font-mono truncate">
                  {typeof window !== 'undefined' ? window.location.href : ''}
                </code>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowBackModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-white/60 text-sm font-medium hover:bg-white/5 hover:text-white transition-colors"
                >
                  Rester ici
                </button>
                <Link
                  to="/"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-sm font-semibold hover:bg-emerald-500/25 hover:text-emerald-200 transition-colors text-center"
                >
                  Retour à l'accueil →
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
