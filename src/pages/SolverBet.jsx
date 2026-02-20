import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, ChevronRight, CheckCircle, XCircle, Database, Brain, TrendingUp, Send, BarChart2, Zap, Globe, Phone, MoreVertical } from 'lucide-react';

/* ========== SPARKLINE CURVE (hover on tracker button) ========== */
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
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={path + ` L ${w} ${h} L 0 ${h} Z`} fill="url(#curveGrad)" />
            <path d={path} fill="none" stroke="#f59e0b" strokeWidth="2" />
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
    amber: 'border-amber-500/40 bg-amber-500/5 shadow-amber-500/10',
    blue: 'border-blue-500/40 bg-blue-500/5 shadow-blue-500/10',
    purple: 'border-purple-500/40 bg-purple-500/5 shadow-purple-500/10',
    green: 'border-green-500/40 bg-green-500/5 shadow-green-500/10',
    red: 'border-red-500/40 bg-red-500/5 shadow-red-500/10',
    cyan: 'border-cyan-500/40 bg-cyan-500/5 shadow-cyan-500/10',
  };
  const iconColors = {
    amber: 'text-amber-400 bg-amber-500/15',
    blue: 'text-blue-400 bg-blue-500/15',
    purple: 'text-purple-400 bg-purple-500/15',
    green: 'text-green-400 bg-green-500/15',
    red: 'text-red-400 bg-red-500/15',
    cyan: 'text-cyan-400 bg-cyan-500/15',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className={`relative rounded-2xl border p-5 shadow-lg ${colors[color]}`}
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
        {/* Top notch */}
        <div className="h-7 bg-[#0e1621] relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-b-2xl" />
        </div>
        {/* Header */}
        <div className="bg-[#17212b] px-4 py-2.5 flex items-center gap-3 border-b border-white/[0.04]">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <span className="text-base">⚽</span>
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-white font-semibold text-sm">SolverBet Channel</span>
            <div className="text-white/35 text-[11px]">📢 {' '}public channel</div>
          </div>
          <div className="flex items-center gap-2.5 text-white/25">
            <MoreVertical className="w-4 h-4" />
          </div>
        </div>

        {/* Messages */}
        <div className="h-[340px] p-3 flex flex-col gap-2 bg-[#0e1621] overflow-hidden">
          {/* Intro msg */}
          <div className="max-w-[90%] bg-[#182533] rounded-2xl rounded-bl-sm px-3.5 py-2 border border-white/[0.03]">
            <p className="text-white/70 text-[12px] mb-0.5">🟢 <span className="font-semibold text-white/90">SolverBet</span> wishes you a profitable day!</p>
            <p className="text-white/50 text-[11px]">🚀 The model is now running</p>
            <span className="text-white/20 text-[10px]">7:37 AM</span>
          </div>

          {/* Rotating match cards */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeMsg}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="max-w-[95%] bg-[#182533] rounded-2xl rounded-bl-sm px-3.5 py-2.5 border border-amber-500/10"
            >
              <p className="text-amber-400/80 font-semibold text-[11px] mb-2">{messages[activeMsg].league}</p>
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
                      <span>🎰 Real: <span className="text-amber-400">{m.realOdd}</span></span>
                    </div>
                    <div className="text-green-400/70 text-[9px]">✅ DNB: {m.dnb}</div>
                  </div>
                </div>
              ))}
              <span className="text-white/20 text-[10px]">7:44 AM</span>
            </motion.div>
          </AnimatePresence>

          {/* Indicators */}
          <div className="flex justify-center gap-1.5 mt-auto">
            {messages.map((_, i) => (
              <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i === activeMsg ? 'w-4 bg-amber-400' : 'w-1.5 bg-white/15'}`} />
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="bg-[#17212b] px-3 py-2 border-t border-white/[0.04]">
          <div className="bg-[#242f3d] rounded-full px-4 py-2 flex items-center gap-2">
            <span className="text-white/20 text-sm flex-1">Message</span>
            <div className="w-7 h-7 rounded-full bg-amber-500/15 flex items-center justify-center">
              <Send className="w-3.5 h-3.5 text-amber-400/70" />
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
  const [screen, setScreen] = useState('menu'); // menu | result
  const [selected, setSelected] = useState(null);

  const countries = [
    { name: 'France' },
    { name: 'England' },
    { name: 'Germany' },
    { name: 'Italy' },
    { name: 'Spain' },
    { name: 'Netherlands' },
    { name: 'Belgium' },
    { name: 'Japan' },
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

  const handleSelect = (name) => {
    setSelected(name);
    setScreen('result');
  };

  return (
    <div className="w-full max-w-[340px]">
      <div className="bg-[#0e1621] rounded-[2.5rem] border border-white/[0.06] overflow-hidden shadow-2xl shadow-black/60">
        {/* Math bg style */}
        <div className="h-7 bg-[#0e1621] relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-b-2xl" />
        </div>

        {/* Header */}
        <div className="bg-[#17212b] px-4 py-2.5 flex items-center gap-3 border-b border-white/[0.04]">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
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

        {/* Chat area */}
        <div className="h-[340px] bg-[#0e1621] overflow-hidden relative" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Ctext x='5' y='20' fill='rgba(255,255,255,0.03)' font-size='10' font-family='monospace'%3Esin(x)%3C/text%3E%3Ctext x='40' y='50' fill='rgba(255,255,255,0.03)' font-size='8' font-family='monospace'%3Eπ²/6%3C/text%3E%3Ctext x='10' y='80' fill='rgba(255,255,255,0.03)' font-size='9' font-family='monospace'%3Elim→∞%3C/text%3E%3C/svg%3E")`,
        }}>
          <div className="p-3 flex flex-col gap-2 h-full">
            {/* User: /start */}
            <div className="self-end bg-[#2b5278] rounded-2xl rounded-br-sm px-3 py-1.5 max-w-[60%]">
              <span className="text-white text-[13px] font-mono">/start</span>
              <span className="text-white/30 text-[9px] ml-2">13:46 ✓✓</span>
            </div>

            {/* Bot reply */}
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
                        className="bg-[#242f3d] hover:bg-[#2b3849] border border-white/[0.06] rounded-xl px-3 py-2 text-white/80 text-[12px] text-left transition-all duration-200 hover:border-amber-500/30 hover:text-amber-300"
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div key="result" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col gap-2 max-w-[95%]">
                  <div className="self-end bg-[#2b5278] rounded-2xl rounded-br-sm px-3 py-1.5">
                    <span className="text-white text-[12px]">{countries.find(c => c.name === selected)?.flag} {selected}</span>
                  </div>
                  {(results[selected] || []).map((m, i) => (
                    <div key={i} className="bg-[#182533] rounded-2xl rounded-bl-sm px-3.5 py-2.5 border border-amber-500/10">
                      <p className="text-white/60 text-[11px] mb-1.5">Today's inflated odd(s) in {countries.find(c => c.name === selected)?.flag}:</p>
                      <p className="text-amber-400/80 font-semibold text-[11px] mb-1">⚡ {m.league} — {m.time} ⚡</p>
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

        {/* Input */}
        <div className="bg-[#17212b] px-3 py-2 border-t border-white/[0.04]">
          <div className="bg-[#242f3d] rounded-full px-4 py-2 flex items-center gap-2">
            <span className="text-white/20 text-sm flex-1">Message</span>
            <div className="w-7 h-7 rounded-full bg-amber-500/15 flex items-center justify-center">
              <Send className="w-3.5 h-3.5 text-amber-400/70" />
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

/* ========== ANIMATED WORKFLOW ========== */
function WorkflowArrow({ color = 'amber', label, condition }) {
  const colorMap = {
    amber: 'border-amber-500/30 bg-amber-500/5',
    green: 'bg-green-400',
    red: 'bg-red-400',
  };
  
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
      <div className="w-px h-6 bg-gradient-to-b from-amber-500/40 to-amber-500/10" />
      <div className="w-2 h-2 border-r-2 border-b-2 border-amber-500/40 rotate-45 -mt-1" />
    </div>
  );
}

/* ========== MAIN PAGE ========== */
export default function SolverBet() {
  const [trackerHover, setTrackerHover] = useState(false);
  const [pulseStep, setPulseStep] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setPulseStep(p => (p + 1) % 5), 900);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0d14] text-[#e7ecff]" style={{ fontFamily: "'Syne', 'Space Grotesk', sans-serif" }}>
      {/* Ambient bg */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-500/[0.03] rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-500/[0.03] rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-500/[0.02] rounded-full blur-3xl" />
      </div>

      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-[#0a0d14]/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition">
              <img src="/logo.jpg" alt="Logo" className="w-10 h-10 object-contain rounded-lg" />
              <span className="text-xl font-bold bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">
                AG Algo Lab
              </span>
            </Link>
            <Link to="/" className="text-sm px-4 py-2 rounded-lg border border-white/15 text-white/70 hover:bg-white/5 hover:text-white transition">
              ← Back home
            </Link>
          </div>
        </div>
      </nav>

      {/* ======== HERO ======== */}
      <section className="min-h-screen flex items-center justify-center pt-24 pb-16 relative">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-8">
              <span className="text-amber-400 text-lg">⚽</span>
              <span className="text-amber-400/80 text-sm font-medium">AI Sports Intelligence · 30+ Leagues</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-6xl md:text-8xl font-black tracking-tight mb-6"
          >
            <span className="bg-gradient-to-br from-amber-300 via-orange-400 to-red-500 bg-clip-text text-transparent">
              SolverBet
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl md:text-2xl font-light text-white/50 italic mb-4"
          >
            We don't predict the future — we price it better than the market
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-base text-white/40 max-w-2xl mx-auto mb-14 leading-relaxed"
          >
            Machine learning system trained on scientific research, optimized by Optuna per league, 
            identifying statistically mispriced outcomes across global football competitions.
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-16"
          >
            {[
              { label: 'Leagues Covered', value: 30, suffix: '+' },
              { label: 'Daily Analyses', value: 200, suffix: '+' },
              { label: 'Countries', value: 8, suffix: '+' },
              { label: 'Picks per Week', value: 35, suffix: '~' },
            ].map((s, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 text-center">
                <div className="text-2xl font-black text-amber-400 mb-1">
                  <Counter end={s.value} suffix={s.suffix} />
                </div>
                <div className="text-white/35 text-xs">{s.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Tracker button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex justify-center"
          >
            <a
              href="https://app.bet-analytix.com/bankroll/1734144"
              target="_blank"
              rel="noopener noreferrer"
              className="relative group inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500/15 to-orange-500/10 border border-amber-500/30 hover:border-amber-500/60 transition-all duration-500 overflow-hidden hover:shadow-[0_0_60px_rgba(245,158,11,0.25)]"
              onMouseEnter={() => setTrackerHover(true)}
              onMouseLeave={() => setTrackerHover(false)}
            >
              <SparkCurve visible={trackerHover} />
              <div className="relative z-10 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-left">
                  <div className="text-white font-bold text-sm">Live Performance Tracker</div>
                  <div className="text-amber-400/60 text-xs">View ROI & bankroll evolution →</div>
                </div>
                <ExternalLink className="w-4 h-4 text-white/30 group-hover:text-amber-400 transition-colors" />
              </div>
            </a>
          </motion.div>
        </div>
      </section>

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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-5">
              <Zap className="w-4 h-4 text-violet-400" />
              <span className="text-violet-400/80 text-sm font-medium">System Architecture</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                How it Works
              </span>
            </h2>
            <p className="text-white/40 max-w-xl mx-auto">From raw data to real-time signal, here is the fully automated pipeline.</p>
          </motion.div>

          <div className="max-w-xl mx-auto">
            {/* Step 1 */}
            <WorkflowNode
              icon={<Database className="w-5 h-5" />}
              title="Data Collection"
              subtitle="Live match data from a sports API: fixtures, historical results, and more across 30+ leagues worldwide."
              color="amber"
              delay={0}
            />
            <WorkflowArrow />

            {/* Step 2 */}
            <WorkflowNode
              icon={<BarChart2 className="w-5 h-5" />}
              title="Optuna Optimization"
              subtitle="Per-league hyperparameter tuning on the previous season. Entry thresholds and filters are maximized for ROI using Bayesian optimization."
              color="cyan"
              delay={0.2}
            >
              <div className="mt-2 grid grid-cols-2 gap-1.5">
                {[
                  { label: 'Method', val: 'Bayesian Search' },
                  { label: 'Target', val: 'Max ROI' },
                  { label: 'Scope', val: 'Per League' },
                  { label: 'Dataset', val: 'Prior Season' },
                ].map(r => (
                  <div key={r.label} className="bg-cyan-500/5 border border-cyan-500/10 rounded-lg px-2.5 py-1.5">
                    <div className="text-white/25 text-[9px] uppercase tracking-wider">{r.label}</div>
                    <div className="text-cyan-400/80 text-[11px] font-medium">{r.val}</div>
                  </div>
                ))}
              </div>
            </WorkflowNode>
            <WorkflowArrow />


            {/* Step 3 */}            
            <WorkflowNode
              icon={<Brain className="w-5 h-5" />}
              title="ML Model Inference"
              subtitle="Proprietary machine learning model: grounded in scientific literature on match outcome modeling. Architecture remains confidential."
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


            {/* Step 4 */}
            <WorkflowNode
              icon={<Globe className="w-5 h-5" />}
              title="Live Odds Retrieval"
              subtitle="Real-time bookmaker odds fetched via API and compared against the model's fair probability output."
              color="blue"
              delay={0.3}
            />
            <WorkflowArrow />

            {/* Decision node */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="relative rounded-2xl border border-yellow-500/40 bg-yellow-500/5 p-5 shadow-lg shadow-yellow-500/10"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-yellow-500/15 text-yellow-400">
                  <span className="text-lg">⚖️</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-white text-sm mb-1">Value Detection Check</h4>
                  <p className="text-white/40 text-xs">Is the bookmaker odd significantly higher than the model's fair odd? Is the signal within the Optuna-optimized entry thresholds?</p>
                </div>
              </div>
              {/* Branch indicators */}
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
            
            {/* YES arrow + signal */}
            <WorkflowArrow condition="yes" />

            {/* Final: Signal */}
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
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
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
            {/* Bot */}
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

            {/* Channel */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex flex-col items-center gap-5 w-full max-w-[340px]"
            >
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 mb-3">
                  <span className="text-amber-400 text-sm">📢</span>
                  <span className="text-amber-400/80 text-xs font-medium">Broadcast Channel</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-1">SolverBet Channel</h3>
                <p className="text-white/35 text-sm">All daily signals across every covered league — confidence, fair odds, and value gap.</p>
              </div>
              <TelegramChannel />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ======== HOW SIGNALS ARE PRESENTED ======== */}
      <section className="py-24 relative">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-[#141f38] to-[#0d1117] rounded-3xl border border-white/[0.07] p-8 md:p-10"
          >
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 mb-4">
                  <TrendingUp className="w-3.5 h-3.5 text-green-400" />
                  <span className="text-green-400/80 text-xs font-medium">Performance</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-white mb-4">
                  Transparent. Tracked. Verifiable.
                </h3>
                <p className="text-white/45 leading-relaxed mb-6">
                  All picks are logged and tracked publicly. ROI is measured bet-by-bet on an independent platform. 
                  Backtested on prior seasons, verified live. No hidden filters, no cherry-picking.
                </p>
                <a
                  href="https://app.bet-analytix.com/bankroll/1734144"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-amber-500/15 border border-amber-500/30 hover:bg-amber-500/25 hover:border-amber-500/50 transition-all duration-300 font-semibold text-amber-300 hover:text-amber-200 hover:shadow-[0_0_40px_rgba(245,158,11,0.2)]"
                >
                  <BarChart2 className="w-4 h-4" />
                  Open Bankroll Tracker
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </a>
              </div>
              <div className="flex-shrink-0 grid grid-cols-1 gap-3 w-full md:w-auto">
                {[
                  { icon: '✅', label: 'Publicly tracked', sub: 'bet-analytix.com' },
                  { icon: '📊', label: 'Backtested', sub: 'Prior season per league' },
                  { icon: '🎯', label: 'Optuna-optimized', sub: 'Entry filters tuned' },
                  { icon: '🔬', label: 'Science-based', sub: 'Peer-reviewed methods' },
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white/[0.02] border border-white/[0.05] rounded-xl px-4 py-3">
                    <span className="text-lg">{f.icon}</span>
                    <div>
                      <div className="text-white/80 text-sm font-medium">{f.label}</div>
                      <div className="text-white/30 text-xs">{f.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <img src="/logo.jpg" alt="Logo" className="w-8 h-8 object-contain rounded-lg" />
            <span className="text-sm text-white/40">AG Algo Lab — SolverBet is a research tool. Past performance does not guarantee future results.</span>
          </div>
          <Link to="/" className="text-sm text-white/50 hover:text-white transition-colors">
            ← Back to home
          </Link>
        </div>
      </footer>
    </div>
  );
}
