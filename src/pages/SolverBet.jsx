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
                <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={path + ` L ${w} ${h} L 0 ${h} Z`} fill="url(#curveGrad)" />
            <path d={path} fill="none" stroke="#7c3aed" strokeWidth="2" />
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
    violet: 'border-violet-500/40 bg-violet-500/5 shadow-violet-500/10',
    blue: 'border-blue-500/40 bg-blue-500/5 shadow-blue-500/10',
    purple: 'border-purple-500/40 bg-purple-500/5 shadow-purple-500/10',
    green: 'border-green-500/40 bg-green-500/5 shadow-green-500/10',
    red: 'border-red-500/40 bg-red-500/5 shadow-red-500/10',
    cyan: 'border-cyan-500/40 bg-cyan-500/5 shadow-cyan-500/10',
    indigo: 'border-indigo-500/40 bg-indigo-500/5 shadow-indigo-500/10',
  };
  const iconColors = {
    violet: 'text-violet-400 bg-violet-500/15',
    blue: 'text-blue-400 bg-blue-500/15',
    purple: 'text-purple-400 bg-purple-500/15',
    green: 'text-green-400 bg-green-500/15',
    red: 'text-red-400 bg-red-500/15',
    cyan: 'text-cyan-400 bg-cyan-500/15',
    indigo: 'text-indigo-400 bg-indigo-500/15',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className={`relative bg-[#0a0a0a] rounded-xl border p-5 ${colors[color]}`}
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
      league: 'Belgium — Challenger Pro League 🔥',
      matches: [
        { confidence: 65.0, color: 'green', time: '19:00', home: 'Liège', away: 'Club Brugge II', winner: 'Liège', fairOdd: '1.54', realOdd: '1.82', dnb: '1.24' },
        { confidence: 47.4, color: 'orange', time: '19:00', home: 'RSC Anderlecht II', away: 'KRC Genk II', winner: 'RSC Anderlecht II', fairOdd: '2.11', realOdd: '2.19', dnb: '1.66' },
      ]
    },
    {
      league: 'Germany — 2. Bundesliga 🔥',
      matches: [
        { confidence: 61.3, color: 'yellow', time: '17:30', home: 'VfL Bochum', away: '1. FC Nürnberg', winner: 'VfL Bochum', fairOdd: '1.63', realOdd: '2.15', dnb: '1.25' },
      ]
    },
    {
      league: 'Spain — Segunda División 🔥',
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
      <div className="bg-[#0e1621] rounded-[2.5rem] border border-white/[0.06] overflow-hidden shadow-2xl shadow-black/60">
        <div className="h-7 bg-[#0e1621] relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-b-2xl" />
        </div>
        <div className="bg-[#17212b] px-4 py-2.5 flex items-center gap-3 border-b border-white/[0.04]">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <span className="text-base">⚽</span>
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-white font-semibold text-sm">SolverBet Channel</span>
            <div className="text-white/35 text-[11px]">📢 public channel</div>
          </div>
          <div className="flex items-center gap-2.5 text-white/25">
            <MoreVertical className="w-4 h-4" />
          </div>
        </div>

        <div className="h-[340px] p-3 flex flex-col gap-2 bg-[#0e1621] overflow-hidden">
          <div className="max-w-[90%] bg-[#182533] rounded-2xl rounded-bl-sm px-3.5 py-2 border border-white/[0.03]">
            <p className="text-white/70 text-[12px] mb-0.5">🟢 <span className="font-semibold text-white/90">SolverBet</span> wishes you a profitable day!</p>
            <p className="text-white/50 text-[11px]">🚀 The model is now running</p>
            <span className="text-white/20 text-[10px]">7:37 AM</span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeMsg}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="max-w-[95%] bg-[#182533] rounded-2xl rounded-bl-sm px-3.5 py-2.5 border border-violet-500/10"
            >
              <p className="text-violet-400/80 font-semibold text-[11px] mb-2">{messages[activeMsg].league}</p>
              {messages[activeMsg].matches.map((m, i) => (
                <div key={i} className={`mb-2 last:mb-0 rounded-xl p-2.5 border ${confidenceColor(m.confidence)}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider">{confidenceCircle(m.confidence)} Confidence: {m.confidence}%</span>
                    <span className="text-white/30 text-[10px]">⏰ {m.time}</span>
                  </div>
                  <div className="text-[10px] text-white/60 space-y-0.5">
                    <div><span className="text-white/40">Home:</span> <span className="text-white/80">{m.home}</span></div>
                    <div><span className="text-white/40">Away:</span> <span className="text-white/80">{m.away}</span></div>
                    <div><span className="text-white/40">Winner:</span> <span className="text-white font-semibold">{m.winner} 🏆</span></div>
                    <div className="flex gap-3 mt-1">
                      <span>💰 Fair: <span className="text-green-400">{m.fairOdd}</span></span>
                      <span>🎰 Real: <span className="text-violet-400">{m.realOdd}</span></span>
                    </div>
                    <div className="text-green-400/70 text-[9px]">✅ DNB: {m.dnb}</div>
                  </div>
                </div>
              ))}
              <span className="text-white/20 text-[10px]">7:44 AM</span>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center gap-1.5 mt-auto">
            {messages.map((_, i) => (
              <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i === activeMsg ? 'w-4 bg-violet-400' : 'w-1.5 bg-white/15'}`} />
            ))}
          </div>
        </div>

        <div className="bg-[#17212b] px-3 py-2 border-t border-white/[0.04]">
          <div className="bg-[#242f3d] rounded-full px-4 py-2 flex items-center gap-2">
            <span className="text-white/20 text-sm flex-1">Message</span>
            <div className="w-7 h-7 rounded-full bg-violet-500/15 flex items-center justify-center">
              <Send className="w-3.5 h-3.5 text-violet-400/70" />
            </div>
          </div>
        </div>
        <div className="h-5 flex items-center justify-center bg-[#0e1621]">
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
    { name: 'France' }, { name: 'England' }, { name: 'Germany' }, { name: 'Italy' },
    { name: 'Spain' }, { name: 'Netherlands' }, { name: 'Belgium' }, { name: 'Japan' },
  ];

  const results = {
    England: [{ league: 'Premier League', time: '19:30', home: 'Manchester City', away: 'Fulham', winner: 'Manchester City', prob: '81.9%', fairOdd: '1.22', realOdd: '1.40' }],
    Germany: [{ league: '2. Bundesliga', time: '17:30', home: 'VfL Bochum', away: 'Nürnberg', winner: 'VfL Bochum', prob: '61.3%', fairOdd: '1.63', realOdd: '2.15' }],
    France: [{ league: 'Ligue 1', time: '20:00', home: 'PSG', away: 'Lyon', winner: 'PSG', prob: '78.2%', fairOdd: '1.31', realOdd: '1.55' }],
    Spain: [{ league: 'Segunda División', time: '19:30', home: 'AD Ceuta FC', away: 'Granada CF', winner: 'AD Ceuta FC', prob: '47.9%', fairOdd: '2.09', realOdd: '2.75' }],
    Italy: [{ league: 'Serie A', time: '21:00', home: 'Inter Milan', away: 'Napoli', winner: 'Inter Milan', prob: '58.4%', fairOdd: '1.72', realOdd: '2.10' }],
    Netherlands: [{ league: 'Eredivisie', time: '18:45', home: 'Ajax', away: 'Feyenoord', winner: 'Ajax', prob: '52.1%', fairOdd: '1.90', realOdd: '2.25' }],
    Belgium: [{ league: 'Pro League', time: '19:00', home: 'Liège', away: 'Club Brugge II', winner: 'Liège', prob: '65.0%', fairOdd: '1.54', realOdd: '1.82' }],
    Japan: [{ league: 'J. League', time: '12:00', home: 'Kashima', away: 'Yokohama', winner: 'Kashima', prob: '55.7%', fairOdd: '1.80', realOdd: '2.05' }],
  };

  const handleSelect = (name) => { setSelected(name); setScreen('result'); };

  return (
    <div className="w-full max-w-[340px]">
      <div className="bg-[#0e1621] rounded-[2.5rem] border border-white/[0.06] overflow-hidden shadow-2xl shadow-black/60">
        <div className="h-7 bg-[#0e1621] relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-b-2xl" />
        </div>

        <div className="bg-[#17212b] px-4 py-2.5 flex items-center gap-3 border-b border-white/[0.04]">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <span className="text-base font-bold text-white text-sm">S</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-white font-semibold text-sm">SolverBet</span>
              <svg className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
              </svg>
            </div>
            <div className="text-white/35 text-[11px]">bot</div>
          </div>
          <MoreVertical className="w-4 h-4 text-white/25" />
        </div>

        <div className="h-[340px] bg-[#0e1621] overflow-hidden relative" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Ctext x='5' y='20' fill='rgba(255,255,255,0.03)' font-size='10' font-family='monospace'%3Esin(x)%3C/text%3E%3Ctext x='40' y='50' fill='rgba(255,255,255,0.03)' font-size='8' font-family='monospace'%3Eπ²/6%3C/text%3E%3Ctext x='10' y='80' fill='rgba(255,255,255,0.03)' font-size='9' font-family='monospace'%3Elim→∞%3C/text%3E%3C/svg%3E")`,
        }}>
          <div className="p-3 flex flex-col gap-2 h-full">
            <div className="self-end bg-[#2b5278] rounded-2xl rounded-br-sm px-3 py-1.5 max-w-[60%]">
              <span className="text-white text-[13px] font-mono">/start</span>
              <span className="text-white/30 text-[9px] ml-2">13:46 ✓✓</span>
            </div>

            <AnimatePresence mode="wait">
              {screen === 'menu' ? (
                <motion.div key="menu" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-[95%]">
                  <div className="bg-[#182533] rounded-2xl rounded-bl-sm px-3.5 py-2.5 border border-white/[0.03] mb-2">
                    <p className="text-white text-[12px] mb-0.5">⚽ <span className="font-semibold">Welcome to SolverBet</span> ⚽</p>
                    <p className="text-white/55 text-[11px]">Last analysis: Today at 8:54</p>
                    <p className="text-white/55 text-[11px]">🌐 Choose a country:</p>
                    <span className="text-white/20 text-[10px]">13:46</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {countries.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => handleSelect(c.name)}
                        className="bg-[#242f3d] hover:bg-[#2b3849] border border-white/[0.06] rounded-xl px-3 py-2 text-white/80 text-[12px] text-left transition-all duration-200 hover:border-violet-500/30 hover:text-violet-300"
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div key="result" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col gap-2 max-w-[95%]">
                  <div className="self-end bg-[#2b5278] rounded-2xl rounded-br-sm px-3 py-1.5">
                    <span className="text-white text-[12px]">{selected}</span>
                  </div>
                  {(results[selected] || []).map((m, i) => (
                    <div key={i} className="bg-[#182533] rounded-2xl rounded-bl-sm px-3.5 py-2.5 border border-violet-500/10">
                      <p className="text-white/60 text-[11px] mb-1.5">Today's inflated odd(s) in {selected}:</p>
                      <p className="text-violet-400/80 font-semibold text-[11px] mb-1">⚡ {m.league} — {m.time} ⚡</p>
                      <p className="text-white font-semibold text-[12px]">{m.home} VS {m.away}</p>
                      <p className="text-white/70 text-[11px]">🥇 Winner → <span className="text-white font-medium">{m.winner}</span></p>
                      <p className="text-white/70 text-[11px]">🎯 Probability → <span className="text-green-400 font-medium">{m.prob}</span></p>
                      <div className="mt-1.5 flex items-center gap-1">
                        <span className="text-white/50 text-[10px]">Fair {m.fairOdd}</span>
                        <span className="text-white/20 text-[10px]">|</span>
                        <span className="text-white/50 text-[10px]">Observed {m.realOdd}</span>
                        <span className="text-green-400 text-[10px]">✅</span>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => setScreen('menu')}
                    className="bg-[#242f3d] border border-white/[0.06] rounded-xl px-3 py-2 text-white/70 text-[12px] flex items-center justify-center gap-1.5 hover:bg-[#2b3849] transition-all"
                  >
                    ◀ Back to menu
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="bg-[#17212b] px-3 py-2 border-t border-white/[0.04]">
          <div className="bg-[#242f3d] rounded-full px-4 py-2 flex items-center gap-2">
            <span className="text-white/20 text-sm flex-1">Message</span>
            <div className="w-7 h-7 rounded-full bg-violet-500/15 flex items-center justify-center">
              <Send className="w-3.5 h-3.5 text-violet-400/70" />
            </div>
          </div>
        </div>
        <div className="h-5 flex items-center justify-center bg-[#0e1621]">
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
        }`}>{condition === 'yes' ? '✅ YES' : '❌ NO'}</span>
        <div className="w-px h-4 bg-gradient-to-b from-white/10 to-white/5" />
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center my-1">
      <div className="w-px h-6 bg-gradient-to-b from-violet-500/40 to-violet-500/10" />
      <div className="w-2 h-2 border-r-2 border-b-2 border-violet-500/40 rotate-45 -mt-1" />
    </div>
  );
}

/* ========== HEDGE HUNT SECTION ========== */
function HedgeHuntSection() {
  const bookmakerPoints = [
    { label: 'Their only goal', text: 'Profit regardless of who wins. Not to predict, to protect.' },
    { label: 'Opening odds', text: 'First odds are just a draft. A starting point to test the market.' },
    { label: 'They watch the money', text: "If bets pile up on one team, they shorten those odds. Not because the team changed, but to limit their exposure." },
    { label: 'Always balanced', text: "They adjust until covered on every side. Win or lose, they collect their cut." },
  ];

  const ourPoints = [
    { label: 'The window', text: "Right after odds open, they are often unbalanced. The market has not moved yet. That is our entry point." },
    { label: 'Real probability', text: 'Our model calculates what the true odds should be, independent of public pressure or volume.' },
    { label: 'Spot the gap', text: "When the bookmaker pays more than our probability justifies, that is a value signal." },
    { label: 'We act first', text: 'Before the crowd adjusts the market. Before the odds converge back to fair.' },
  ];

  return (
    <section className="py-28 relative overflow-hidden">
      {/* Subtle top separator */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />

      {/* Background glow accents */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-72 h-72 bg-red-500/[0.04] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-72 h-72 bg-violet-500/[0.06] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6">

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/10 mb-6">
            <span className="text-white/40 text-xs font-medium uppercase tracking-widest">The Real Game</span>
          </div>

          <h2 className="text-5xl md:text-6xl font-black tracking-tight text-white">
            Bookmakers Hedge. We Hunt.
          </h2>

          <p className="text-white/35 text-base mt-4 max-w-md mx-auto leading-relaxed">
            They play a different game than you think. Understanding theirs is how we win ours.
          </p>
        </motion.div>

        {/* Two columns */}
        <div className="grid md:grid-cols-2 gap-5 items-stretch">

          {/* LEFT — Bookmaker */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-white/[0.07] bg-white/[0.02] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="px-6 pt-6 pb-5 border-b border-white/[0.06]">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-base">🏦</div>
                <span className="text-red-400/80 text-xs font-semibold uppercase tracking-widest">The Bookmaker</span>
              </div>
              <p className="text-white font-bold text-xl mt-3">Their job isn't to predict.<br/>It's to always win.</p>
            </div>

            {/* Points */}
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
                    <span className="text-white/70 text-sm font-semibold">{p.label}: </span>
                    <span className="text-white/40 text-sm">{p.text}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Footer tag */}
            <div className="mx-6 mb-6 rounded-2xl bg-red-500/5 border border-red-500/15 px-4 py-3">
              <p className="text-red-400/70 text-xs font-medium text-center">
                The odds reflect risk management — not truth.
              </p>
            </div>
          </motion.div>

          {/* RIGHT — Us */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-violet-500/20 bg-violet-500/[0.03] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="px-6 pt-6 pb-5 border-b border-violet-500/[0.12]">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-8 h-8 rounded-xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center text-base">⚡</div>
                <span className="text-violet-400/80 text-xs font-semibold uppercase tracking-widest">SolverBet</span>
              </div>
              <p className="text-white font-bold text-xl mt-3">Our job is to price<br/>better than the market.</p>
            </div>

            {/* Points */}
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
                    <span className="text-white/70 text-sm font-semibold">{p.label}: </span>
                    <span className="text-white/40 text-sm">{p.text}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Footer tag */}
            <div className="mx-6 mb-6 rounded-2xl bg-violet-500/8 border border-violet-500/20 px-4 py-3">
              <p className="text-violet-400/80 text-xs font-medium text-center">
                We don't beat the bookmaker. We beat the clock.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Bottom connector line */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-10 flex items-center justify-center gap-4"
        >
          <div className="h-px flex-1 max-w-[140px] bg-gradient-to-r from-transparent to-red-500/30" />
          <div className="px-5 py-2.5 rounded-full border border-white/10 bg-white/[0.03]">
            <span className="text-white/50 text-xs font-medium">The gap between them is where the edge lives</span>
          </div>
          <div className="h-px flex-1 max-w-[140px] bg-gradient-to-l from-transparent to-violet-500/30" />
        </motion.div>

      </div>

      {/* Subtle bottom separator */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
    </section>
  );
}


/* ========== PERFORMANCE SECTION ========== */
// UPDATE: add new picks to the bottom of each array

/* ========== WEEKLY BREAKDOWN — paste this block into your file ========== */

// Add new weeks at the bottom — the component adapts automatically
const WEEKS_DATA = [
  {
    week: 12,
    signals: 37,
    pnl: 1466.5,
    flatYield: 44.9,
    rob: 293.3,
    note: null,
  },
  {
    week: 13,
    signals: 2,
    pnl: 172.9,
    flatYield: 126.2,
    rob: 34.6,
    note: 'International break — very few matches played',
  },
  {
    week: 14,
    signals: 18,
    pnl: 597.8,
    flatYield: 34.0,
    rob: 119.6,
    note: null,
  },
  {
    week: 15,
    signals: 12,
    pnl: 469.0,
    flatYield: 39.1,
    rob: 93.8,
    note: 'Upgraded model live — prioritizing consistency over aggressive returns',
  },
  {
    week: 16,
    signals: 8,
    pnl: 440.0,
    flatYield: 55.0,
    rob: 88.0,
    note: null,
  },
];

function WeeklyBreakdown() {
  const maxPnL = Math.max(...WEEKS_DATA.map((w) => w.pnl));
  const totalPnL = WEEKS_DATA.reduce((s, w) => s + w.pnl, 0);
  const totalSignals = WEEKS_DATA.reduce((s, w) => s + w.signals, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="mt-5"
    >
      {/* Section header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <span className="text-white/40 text-xs uppercase tracking-widest font-medium">
            Weekly breakdown
          </span>
          <div className="h-px w-10 bg-white/10" />
        </div>
        <span className="text-white/20 text-[10px] font-mono uppercase tracking-wider hidden md:block">
          Kelly adjusted · 500€ bankroll
        </span>
      </div>

      {/* Scrollable wrapper for small screens */}
      <div className="overflow-x-auto">
        <div className="min-w-[520px]">

          {/* Column headers */}
          <div className="grid grid-cols-[56px_64px_1fr_88px_108px] gap-3 px-4 mb-2">
            {['Week', 'Signals', 'Kelly P&L', 'Flat yield', 'On bankroll'].map((h) => (
              <span
                key={h}
                className={`text-white/20 text-[10px] uppercase tracking-wider font-mono ${
                  h === 'Flat yield' || h === 'On bankroll' ? 'text-right' : ''
                }`}
              >
                {h}
              </span>
            ))}
          </div>

          {/* Week rows */}
          <div className="space-y-2">
            {WEEKS_DATA.map((w, i) => (
              <motion.div
                key={w.week}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                viewport={{ once: true }}
                className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-3.5
                           hover:border-violet-500/25 hover:bg-violet-500/[0.03] transition-all duration-300 cursor-default"
              >
                {/* Top scan line on hover */}
                <div className="absolute inset-x-0 top-0 h-px rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300
                                bg-gradient-to-r from-transparent via-violet-400/30 to-transparent pointer-events-none" />

                <div className="grid grid-cols-[56px_64px_1fr_88px_108px] gap-3 items-center">
                  {/* Week badge */}
                  <div className="flex items-center">
                    <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded-md
                                     bg-violet-500/10 border border-violet-500/20
                                     bg-gradient-to-r from-violet-400 to-blue-300 bg-clip-text text-transparent">
                      W{w.week}
                    </span>
                  </div>

                  {/* Signals */}
                  <span className="text-white/45 text-sm font-mono">{w.signals}</span>

                  {/* PnL bar + value */}
                  <div className="flex items-center gap-2.5">
                    <div className="flex-1 h-[3px] bg-white/[0.06] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${(w.pnl / maxPnL) * 100}%` }}
                        transition={{ duration: 0.9, delay: i * 0.08 + 0.25, ease: 'easeOut' }}
                        viewport={{ once: true }}
                        className="h-full rounded-full"
                        style={{
                          background: 'linear-gradient(90deg, #6d28d9, #93c5fd)',
                        }}
                      />
                    </div>
                    <span className="text-green-400 font-mono text-sm font-bold whitespace-nowrap">
                      +{w.pnl.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} €
                    </span>
                  </div>

                  {/* Flat yield */}
                  <div className="text-right">
                    <span
                      className="font-mono text-sm font-bold bg-clip-text text-transparent"
                      style={{ backgroundImage: 'linear-gradient(135deg, #a78bfa, #93c5fd)' }}
                    >
                      +{w.flatYield.toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* Note line */}
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
    -45.2,96.8,155.6,70.0,-71.1,75,-100,107,170,125,-100,-100,112,-100,165,
    -100,215,112,-100,143,110,210,165,-100,-100
  ],
  roi: '447.4',
  avgOdd: '2.56',
  signals: 77,
  totalPnL: 3146.2
};

// Pre-computed SVG path (800x220 viewBox, padding 58/20/20/30)
const CHART_PATH = "M 58.0 178.3 L 67.5 180.9 L 77.0 176.0 L 86.5 171.7 L 96.0 174.1 L 105.5 169.9 L 115.0 151.0 L 124.5 156.3 L 134.0 148.3 L 143.5 138.5 L 153.0 126.8 L 162.5 130.2 L 172.0 125.1 L 181.5 120.8 L 191.0 123.2 L 200.5 119.6 L 210.0 123.3 L 219.5 119.6 L 229.0 114.8 L 238.5 117.5 L 248.0 121.0 L 257.5 124.1 L 267.0 118.3 L 276.5 123.0 L 286.0 127.9 L 295.5 120.9 L 305.0 118.0 L 314.5 115.1 L 324.0 121.2 L 333.5 125.3 L 343.0 116.1 L 352.5 119.5 L 362.0 114.5 L 371.5 107.0 L 381.0 110.5 L 390.5 107.8 L 400.0 111.4 L 409.5 107.5 L 419.0 103.8 L 428.5 107.5 L 438.0 112.9 L 447.5 108.8 L 457.0 100.9 L 466.5 80.6 L 476.0 83.7 L 485.5 73.2 L 495.0 81.1 L 504.5 86.1 L 514.0 91.1 L 523.5 93.5 L 533.0 83.5 L 542.5 86.7 L 552.0 88.6 L 561.5 84.4 L 571.0 77.6 L 580.5 74.5 L 590.0 77.6 L 599.5 74.4 L 609.0 78.7 L 618.5 74.1 L 628.0 66.6 L 637.5 61.1 L 647.0 65.5 L 656.5 69.9 L 666.0 65.0 L 675.5 69.4 L 685.0 62.2 L 694.5 66.5 L 704.0 57.1 L 713.5 52.2 L 723.0 56.6 L 732.5 50.3 L 742.0 45.5 L 751.5 36.3 L 761.0 29.1 L 770.5 33.5 L 780.0 37.9"
const PATH_LENGTH = 850
const LAST_X = 780.0
const LAST_Y = 37.9
const ZERO_Y = 175.5
const Y_TICKS = [{'val': -330, 'y': 190.0}, {'val': 641, 'y': 147.5}, {'val': 1612, 'y': 105.0}, {'val': 2583, 'y': 62.5}, {'val': 3554, 'y': 20.0}]

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
            if (raw < 1) {
              requestAnimationFrame(step);
            } else {
              setDashOffset(0);
              setDone(true);
            }
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
    { label: 'Signals sent', display: `${PERF_DATA.signals}`, color: 'violet' },
    { label: 'Total P&L', display: `+${PERF_DATA.totalPnL.toLocaleString()} €`, color: 'green' },
    { label: 'Avg odds', display: `${PERF_DATA.avgOdd}`, color: 'violet' },
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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-violet-500/[0.03] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/10 mb-6">
            <span className="text-white/40 text-xs font-medium uppercase tracking-widest">Live Results</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-3">
            <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              Current Performances
            </span>
          </h2>
          <p className="text-white/35 text-base max-w-md mx-auto">
            Real signals only. No backtest. Cumulative P&L since the model went live.
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
            <span className="text-white/40 text-xs uppercase tracking-widest font-medium">Cumulative P&L — Kelly adjusted</span>
          </div>


          <div className="relative w-full">
            <svg viewBox="0 0 800 220" className="w-full" style={{ height: '220px' }} preserveAspectRatio="none">
            <defs>
              <linearGradient id="perfFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="lineGradPerf" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#6d28d9" />
                <stop offset="100%" stopColor="#a78bfa" />
              </linearGradient>
              <clipPath id="chartClip">
                <rect x="58" y="20" width="722" height="170" />
              </clipPath>
            </defs>

            {/* Grid lines + Y labels */}
            {Y_TICKS.map((t, i) => (
              <g key={i} className={i === 1 || i === 3 ? 'y-tick-hide' : ''}>
                <line x1="58" y1={t.y} x2="780" y2={t.y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                <text x="50" y={t.y + 4} textAnchor="end" fill="rgba(255,255,255,0.22)" fontSize="10" fontFamily="monospace">
                  {t.val >= 0 ? `+${t.val}` : t.val}
                </text>
              </g>
            ))}

            {/* Zero dashed line */}
            <line x1="58" y1={ZERO_Y} x2="780" y2={ZERO_Y} stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="4 4" />

            {/* Signal X labels — dynamic */}
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
            
            {/* Model Upgrade marker */}
            {(() => {
              const total = PERF_DATA.pnl.length;
              const ux = 58 + ((MODEL_UPGRADE_AT - 1) / (total - 1)) * 722;
              return (
                <g>
                  <line x1={ux} y1="20" x2={ux} y2="190" stroke="rgba(239,68,68,0.55)" strokeWidth="1.5" strokeDasharray="4 3" />
                  <text
                    x={ux - 7}
                    y="32"
                    fill="rgba(239,68,68,0.7)"
                    fontSize="9"
                    fontFamily="monospace"
                    fontWeight="bold"
                    transform={`rotate(-45, ${ux - 7}, 32)`}
                  >
                    Model Upgrade
                  </text>
                </g>
              );
            })()}


            {/* Area fill — static, behind line */}
            <path
              d={CHART_PATH + ` L ${LAST_X} ${ZERO_Y} L 58 ${ZERO_Y} Z`}
              fill="url(#perfFill)"
              clipPath="url(#chartClip)"
              opacity={done ? 1 : 0.4}
            />

            {/* Animated line via stroke-dashoffset */}
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
            <div
              className="absolute pointer-events-none"
              style={{
                left: `${(LAST_X / 800) * 100}%`,
                top: `${(LAST_Y / 220) * 100}%`,
                transform: 'translate(-50%, -50%)',
                opacity: 1 - dashOffset / PATH_LENGTH,
              }}
            >
              <div className="w-2 h-2 rounded-full bg-violet-400" />
            </div>
          )}
          {done && (
            <div
              className="absolute pointer-events-none"
              style={{
                left: `${(LAST_X / 800) * 100}%`,
                top: `${(LAST_Y / 220) * 100}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div className="relative flex items-center justify-center">
                <div className="absolute w-5 h-5 rounded-full bg-violet-500/30 animate-ping" />
                <div className="w-2.5 h-2.5 rounded-full bg-violet-400" />
              </div>
            </div>
          )}
          </div>

          <div className="flex items-center justify-between mt-2">
            <span className="text-white/20 text-[10px] font-mono">Signal #1</span>
            <span className="text-white/20 text-[10px] font-mono">Signal #57</span>
          </div>
        </motion.div>

        {/* Stat cards */}
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
              <div className={`text-xl font-black mb-1.5 ${
                s.color === 'green'
                  ? 'text-green-400'
                  : 'bg-gradient-to-r from-violet-400 to-blue-300 bg-clip-text text-transparent'
              }`}>
                {s.display}
              </div>
              <div className="text-white/30 text-xs">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Kelly note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-white/[0.05] bg-white/[0.015] px-5 py-4 flex items-start gap-3"
        >
          <span className="text-white/20 text-xs mt-0.5 flex-shrink-0">ℹ</span>
          <p className="text-white/30 text-xs leading-relaxed">
            These results are based on a <span className="text-white/50 font-medium">Kelly-adjusted staking strategy</span>, 
            calibrated for a starting bankroll of <span className="text-white/50 font-medium">500€</span>. 
            The Kelly fraction is adjusted per signal based on the detected edge. 
            Past performance does not guarantee future returns.
          </p>
        </motion.div>
        <WeeklyBreakdown />
      </div>
    </section>
    
  );
}






/* ========== MAIN PAGE ========== */
export default function SolverBet() {
  const [pulseStep, setPulseStep] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setPulseStep(p => (p + 1) % 5), 900);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-black text-[#ededed]">

      {/* Ambient bg */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-violet-600/[0.05] rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/[0.04] rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/[0.03] rounded-full blur-3xl" />
      </div>

      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-black/70 backdrop-blur-xl border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center relative">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
              <img src="/logo.jpg" alt="Logo" className="w-8 h-8 object-contain rounded-md" />
              <span className="text-[15px] font-semibold text-white tracking-tight">AG Algo Lab</span>
            </Link>
            <div className="absolute left-1/2 -translate-x-1/2">
              <img src="/solverbet_eagle.png" alt="SolverBet" className="w-9 h-9 object-contain opacity-80" />
            </div>
            <Link to="/" className="text-sm px-4 py-2 rounded-lg border border-white/15 text-white/60 hover:bg-white/5 hover:text-white transition-colors">
              ← Back
            </Link>
          </div>
        </div>
      </nav>

      {/* ======== HERO ======== */}
      <section className="min-h-screen flex items-center justify-center pt-24 pb-16 relative">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-8">
              <span className="text-violet-400 text-lg">⚽</span>
              <span className="text-violet-400/80 text-sm font-medium">Sports Intelligence · 35+ Leagues</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-6xl md:text-8xl font-black tracking-tight mb-6"
          >
            <span className="bg-gradient-to-br from-violet-400 via-indigo-400 to-blue-400 bg-clip-text text-transparent">
              SolverBet
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl md:text-2xl font-light text-white/50 italic mb-8"
          >
            We don't predict the future — we price it better than the market
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-3 gap-4 max-w-xl mx-auto mb-16"
          >
            {[
              { label: 'Leagues Covered', value: 35, suffix: '' },
              { label: 'Matches Analyzed', value: 115000, suffix: '+' },
              { label: 'Years of Backtest', value: 10, suffix: '' },
            ].map((s, i) => (
              <div key={i} className="bg-[#0a0a0a] border border-white/10 rounded-xl p-4 text-center">
                <div className="text-2xl font-black bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent mb-1">
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-5">
              <Zap className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400/80 text-sm font-medium">System Architecture</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                How it Works
              </span>
            </h2>
            <p className="text-white/40 max-w-xl mx-auto">From raw data to real-time signal, here is the fully automated pipeline.</p>
          </motion.div>

          <div className="max-w-xl mx-auto">
            <WorkflowNode
              icon={<Database className="w-5 h-5" />}
              title="Data Collection"
              subtitle="Live match data from a sports API: fixtures, historical results, and more across 30+ leagues worldwide."
              color="violet"
              delay={0}
            />
            <WorkflowArrow />

            <WorkflowNode
              icon={<BarChart2 className="w-5 h-5" />}
              title="Feature Engineering"
              subtitle="Dozens of features constructed from raw data: rolling averages, form indicators, opponent strength, home/away splits,..."
              color="cyan"
              delay={0.2}
            >
              <div className="mt-2 grid grid-cols-2 gap-1.5">
                {[
                  { label: 'Feature count', val: '300+' },
                  { label: 'Rolling windows', val: '5 / 10 / 20 games' }
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
              title="Model Inference"
              subtitle="Grounded in scientific literature on match outcome modeling."
              color="purple"
              delay={0.1}
            >
              <div className="mt-2 flex flex-wrap gap-1.5">
                {['Scientific Studies', 'Confidential Architecture', 'Probability Scoring'].map(t => (
                  <span key={t} className="px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400/70 text-[10px]">{t}</span>
                ))}
              </div>
            </WorkflowNode>
            
            <WorkflowArrow />

            <WorkflowNode
              icon={<TrendingUp className="w-5 h-5" />}
              title="Probability Calibration"
              subtitle="Raw model outputs are not used directly. We apply calibration to ensure predicted probabilities reflect true real-world frequencies."
              color="indigo"
              delay={0.25}
            >
              <div className="mt-2 grid grid-cols-2 gap-1.5">
                {[
                  { label: 'Method', val: 'Isotonic regression' },
                  { label: 'Output', val: 'Fair probability' },
                ].map(r => (
                  <div key={r.label} className="bg-indigo-500/5 border border-indigo-500/10 rounded-lg px-2.5 py-1.5">
                    <div className="text-white/25 text-[9px] uppercase tracking-wider">{r.label}</div>
                    <div className="text-indigo-400/80 text-[11px] font-medium">{r.val}</div>
                  </div>
                ))}
              </div>
            </WorkflowNode>

            <WorkflowArrow />

            <WorkflowNode
              icon={<Globe className="w-5 h-5" />}
              title="Live Odds Retrieval"
              subtitle="Real-time bookmaker odds fetched via API and compared against the model's fair probability output."
              color="blue"
              delay={0.3}
            />
            <WorkflowArrow />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="relative rounded-2xl border border-indigo-500/40 bg-indigo-500/5 p-5 shadow-lg shadow-indigo-500/10"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-indigo-500/15 text-indigo-400">
                  <span className="text-lg">⚖️</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-white text-sm mb-1">Value Detection Check</h4>
                  <p className="text-white/40 text-xs">Is the bookmaker odd significantly higher than the model's fair odd? Is the signal within the Optuna-optimized entry thresholds?</p>
                </div>
              </div>
              <div className="flex justify-between mt-4 pt-3 border-t border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-400" />
                  <span className="text-red-400/70 text-xs font-medium">No value → Skip match</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-green-400/70 text-xs font-medium">Value found → Signal!</span>
                </div>
              </div>
            </motion.div>

            <WorkflowArrow condition="yes" />

            <WorkflowNode
              icon={<TrendingUp className="w-5 h-5" />}
              title="Kelly Criterion Sizing"
              subtitle="Each position is sized according to the detected edge. The Kelly fraction optimally allocates bankroll to maximize long-term growth while controlling downside risk."
              color="green"
              delay={0.45}
            >
              <div className="mt-2 flex flex-wrap gap-1.5">
                {['Edge-Based Sizing', 'Bankroll Management', 'Optimal Growth'].map(t => (
                  <span key={t} className="px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400/70 text-[10px]">{t}</span>
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
                  <h4 className="font-bold text-white text-sm">Signal Dispatched 🚀</h4>
                  <p className="text-white/40 text-xs">Match details, odds, confidence & entry logic sent via Telegram</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-[#0e1621] border border-white/[0.06] rounded-xl p-3 flex items-center gap-2.5">
                  <span className="text-lg">📢</span>
                  <div>
                    <div className="text-white/70 text-xs font-medium">Channel</div>
                    <div className="text-white/30 text-[10px]">All leagues broadcast</div>
                  </div>
                </div>
                <div className="bg-[#0e1621] border border-white/[0.06] rounded-xl p-3 flex items-center gap-2.5">
                  <span className="text-lg">🤖</span>
                  <div>
                    <div className="text-white/70 text-xs font-medium">Bot</div>
                    <div className="text-white/30 text-[10px]">On-demand by country</div>
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
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
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
                Delivery Interfaces
              </span>
            </h2>
            <p className="text-white/40 max-w-lg mx-auto">
              Two complementary Telegram outputs — a broadcast channel for all signals, and an interactive bot for on-demand filtering.
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
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 mb-3">
                  <span className="text-violet-400 text-sm">🤖</span>
                  <span className="text-violet-400/80 text-xs font-medium">Interactive Bot</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-1">SolverBet Bot</h3>
                <p className="text-white/35 text-sm">Filter by country, get today's value bets on demand. Click the buttons to interact!</p>
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
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-3">
                  <span className="text-blue-400 text-sm">📢</span>
                  <span className="text-blue-400/80 text-xs font-medium">Broadcast Channel</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-1">SolverBet Channel</h3>
                <p className="text-white/35 text-sm">All daily signals across every covered league — confidence, fair odds, and value gap.</p>
              </div>
              <TelegramChannel />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ======== PERFORMANCE ======== */}
      <PerformanceSection />

      {/* Footer */}
      <footer className="py-10 border-t border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2.5">
            <img src="/logo.jpg" alt="Logo" className="w-7 h-7 object-contain rounded-md" />
            <span className="text-sm text-neutral-400">AG Algo Lab — SolverBet is a research tool.</span>
          </div>
          <Link to="/" className="text-sm text-neutral-500 hover:text-white transition-colors font-mono">
            ← Back to home
          </Link>
        </div>
      </footer>
    </div>
  );
}
