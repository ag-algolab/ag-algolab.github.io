import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Phone, MoreVertical } from 'lucide-react';
import { Helmet } from 'react-helmet';

/* ================= ANIMATED COUNTER ================= */
function Counter({ end, suffix = '' }) {
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
  return <span ref={ref}>{count}{suffix}</span>;
}

function NeutralBadge({ children }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/10 text-neutral-400 text-[10px] font-medium tracking-wide">
      {children}
    </span>
  );
}

/* ================= SOL SCANNER CHART ================= */
function SolScannerChart() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [phase, setPhase] = useState('scanning');

  const candles = [
    { o: 142.1, c: 142.6, h: 142.9, l: 141.9 },
    { o: 142.6, c: 143.2, h: 143.4, l: 142.5 },
    { o: 143.2, c: 142.4, h: 143.3, l: 142.2 },
    { o: 142.4, c: 141.6, h: 142.5, l: 141.5 },
    { o: 141.6, c: 142.3, h: 142.5, l: 141.6 },
    { o: 142.3, c: 143.1, h: 143.3, l: 142.2 },
    { o: 143.1, c: 144.2, h: 144.5, l: 143.0 },
    { o: 144.2, c: 145.4, h: 145.8, l: 144.1 },
    { o: 145.4, c: 146.1, h: 146.4, l: 145.2 },
    { o: 146.1, c: 145.2, h: 146.2, l: 145.0 },
    { o: 145.2, c: 144.1, h: 145.4, l: 143.9 },
    { o: 144.1, c: 143.2, h: 144.3, l: 143.0 },
    { o: 143.2, c: 142.1, h: 143.4, l: 141.9 },
    { o: 142.1, c: 143.0, h: 143.2, l: 142.0 },
    { o: 143.0, c: 144.1, h: 144.4, l: 142.9 },
    { o: 144.1, c: 144.8, h: 145.1, l: 143.9 },
  ];
  const extremes = [
    { index: 3, type: 'low' },
    { index: 8, type: 'high' },
    { index: 12, type: 'low' },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const isMobile = window.innerWidth < 768;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    const width = rect.width;
    const height = rect.height;
    const padding = { top: 50, right: 70, bottom: 40, left: 20 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    const minPrice = Math.min(...candles.map(c => c.l)) - 1;
    const maxPrice = Math.max(...candles.map(c => c.h)) + 1;
    const priceRange = maxPrice - minPrice;
    const candleWidth = (chartWidth / candles.length) * 0.7;
    const candleGap = chartWidth / candles.length;
    const priceToY = (price) => padding.top + chartHeight - ((price - minPrice) / priceRange) * chartHeight;
    const indexToX = (index) => padding.left + index * candleGap + candleGap / 2;
    let startTime = null;
    let lastFrameTime = 0;
    const scanDuration = 5500;
    const revealDuration = 3500;
    const totalCycle = scanDuration + revealDuration;
    const targetInterval = isMobile ? 1000 / 30 : 0;

    const drawFrame = (timestamp) => {
      if (isMobile && timestamp - lastFrameTime < targetInterval) { animationRef.current = requestAnimationFrame(drawFrame); return; }
      lastFrameTime = timestamp;
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) % totalCycle;
      const isScanning = elapsed < scanDuration;
      const scanProgress = isScanning ? elapsed / scanDuration : 1;
      const revealProgress = isScanning ? 0 : Math.min((elapsed - scanDuration) / 400, 1);
      setPhase(isScanning ? 'scanning' : 'revealed');

      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = 'rgba(255,255,255,0.04)';
      ctx.lineWidth = 1;
      for (let i = 0; i <= 5; i++) {
        const y = padding.top + (chartHeight / 5) * i;
        ctx.beginPath(); ctx.moveTo(padding.left, y); ctx.lineTo(width - padding.right, y); ctx.stroke();
      }

      ctx.fillStyle = 'rgba(255,255,255,0.2)';
      ctx.font = '11px monospace';
      ctx.textAlign = 'right';
      for (let i = 0; i <= 4; i++) {
        const price = minPrice + (priceRange / 4) * (4 - i);
        const rounded = Math.round(price / 0.25) * 0.25;
        const y = padding.top + (chartHeight / 4) * i;
        ctx.fillText('$' + rounded.toFixed(2), width - 8, y + 4);
      }

      const scanX = padding.left + scanProgress * chartWidth;
      ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0;

      candles.forEach((candle, i) => {
        const x = indexToX(i);
        const candleRight = x + candleWidth / 2;
        const isGreen = candle.c > candle.o;
        let alpha = 0.1;
        if (isScanning) {
          if (candleRight < scanX) alpha = 0.8;
          else if (x - candleWidth / 2 < scanX) alpha = 0.1 + ((scanX - (x - candleWidth / 2)) / candleWidth) * 0.7;
        } else { alpha = 0.1 + revealProgress * 0.7; }

        const baseColor = isGreen ? [74, 222, 128] : [248, 113, 113];
        const color = `rgba(${baseColor.join(',')}, ${alpha})`;

        ctx.strokeStyle = color; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(x, priceToY(candle.h)); ctx.lineTo(x, priceToY(candle.l)); ctx.stroke();

        const bodyTop = priceToY(Math.max(candle.o, candle.c));
        const bodyBottom = priceToY(Math.min(candle.o, candle.c));
        ctx.fillStyle = color;
        ctx.beginPath(); ctx.roundRect(x - candleWidth / 2, bodyTop, candleWidth, Math.max(bodyBottom - bodyTop, 2), 2); ctx.fill();
        ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0;
      });

      if (isScanning) {
        ctx.strokeStyle = 'rgba(153,69,255,0.7)'; ctx.lineWidth = 1;
        ctx.setLineDash([4, 3]);
        ctx.beginPath(); ctx.moveTo(scanX, padding.top); ctx.lineTo(scanX, height - padding.bottom); ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = 'rgba(153,69,255,1)';
        ctx.beginPath(); ctx.arc(scanX, padding.top - 8, 3, 0, Math.PI * 2); ctx.fill();
      }

      extremes.forEach((extreme) => {
        const candle = candles[extreme.index];
        const x = indexToX(extreme.index);
        const candleRight = x + candleWidth / 2;
        const shouldShow = isScanning ? candleRight < scanX - 15 : revealProgress > 0.2;
        if (!shouldShow) return;
        const markerAlpha = isScanning ? 1 : Math.min((revealProgress - 0.2) / 0.3, 1);
        const y = extreme.type === 'low' ? priceToY(candle.l) + 28 : priceToY(candle.h) - 28;
        const isLow = extreme.type === 'low';
        const markerColor = isLow ? [74, 222, 128] : [248, 113, 113];

        ctx.strokeStyle = `rgba(${markerColor.join(',')}, ${markerAlpha * 0.2})`; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(x, y, 16, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = `rgba(${markerColor.join(',')}, ${markerAlpha * 0.06})`;
        ctx.beginPath(); ctx.arc(x, y, 11, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = `rgba(${markerColor.join(',')}, ${markerAlpha * 0.6})`; ctx.lineWidth = 1.5; ctx.stroke();
        ctx.strokeStyle = `rgba(${markerColor.join(',')}, ${markerAlpha * 0.9})`; ctx.lineWidth = 1.5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        if (isLow) {
          ctx.beginPath(); ctx.moveTo(x - 4, y); ctx.lineTo(x - 1, y + 4); ctx.lineTo(x + 5, y - 3); ctx.stroke();
        } else {
          ctx.beginPath(); ctx.moveTo(x - 3, y - 3); ctx.lineTo(x + 3, y + 3); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(x + 3, y - 3); ctx.lineTo(x - 3, y + 3); ctx.stroke();
        }
      });

      animationRef.current = requestAnimationFrame(drawFrame);
    };
    animationRef.current = requestAnimationFrame(drawFrame);
    return () => cancelAnimationFrame(animationRef.current);
  }, []);

  return (
    <div className="bg-[#0a0a0a] rounded-xl border border-white/10 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <span className="text-neutral-500 font-mono text-[11px] uppercase tracking-widest">SOL / USDC</span>
          <NeutralBadge>15m</NeutralBadge>
        </div>
        <div className="flex items-center gap-2">
          <span className={`w-1.5 h-1.5 rounded-full ${phase === 'scanning' ? 'bg-purple-400 animate-pulse' : 'bg-emerald-400'}`} />
          <span className="text-neutral-500 font-mono text-[10px] uppercase tracking-widest">
            {phase === 'scanning' ? 'Scanning' : 'Reversal detected'}
          </span>
        </div>
      </div>
      <canvas ref={canvasRef} className="w-full h-[340px]" style={{ display: 'block' }} />
      <div className="flex items-center gap-6 px-5 py-3 border-t border-white/[0.06]">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center">
            <svg className="w-2 h-2 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
          </div>
          <span className="text-neutral-500 text-xs">Reversal Low</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-red-500/10 border border-red-500/25 flex items-center justify-center">
            <svg className="w-2 h-2 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </div>
          <span className="text-neutral-500 text-xs">Reversal High</span>
        </div>
      </div>
    </div>
  );
}

/* ================= TELEGRAM ALERTS ================= */
function TelegramAlerts() {
  const [messages, setMessages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const allMessages = [
    { id: 1, type: 'info', text: '⬡ Engine online — Scanning SOL/USDC 15m...', time: '09:00' },
    { id: 2, type: 'info', text: '⬡ Structure shift detected — Monitoring closely', time: '09:11' },
    { id: 3, type: 'buy', price: '143.50', confidence: 94, time: '09:15' },
    { id: 4, type: 'sell', price: '150.10', confidence: 91, time: '14:45' },
  ];

  useEffect(() => {
    setMessages([{ ...allMessages[0] }]);
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % allMessages.length;
        if (next === 0) {
          setMessages([]);
          setTimeout(() => setMessages([{ ...allMessages[0] }]), 100);
        } else {
          setMessages((current) => [...current, { ...allMessages[next] }].slice(-4));
        }
        return next;
      });
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-[320px] mx-auto">
      <div className="bg-[#111] rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl">
        <div className="h-6 bg-[#111] relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-4 bg-black rounded-b-2xl" />
        </div>

        <div className="bg-[#0a0a0a] px-4 py-2.5 flex items-center gap-3 border-b border-white/[0.06]">
          <div className="w-8 h-8 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
            <span className="text-sm text-purple-300">◎</span>
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-white font-medium text-sm">AG Reversal Signals</span>
            <div className="text-neutral-500 text-[10px] font-mono">bot · SOL · BTC</div>
          </div>
          <div className="flex items-center gap-2 text-neutral-600">
            <Phone className="w-3.5 h-3.5" />
            <MoreVertical className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Messages — NO y animation to avoid scroll-up effect */}
        <div className="h-[280px] p-3 flex flex-col justify-end gap-2 bg-[#0d0d0d] overflow-hidden">
          {messages.map((msg, idx) => (
            <motion.div
              key={`${msg.id}-${idx}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="max-w-[90%]"
            >
              {msg.type === 'buy' || msg.type === 'sell' ? (
                <div className={`rounded-2xl rounded-bl-sm px-3.5 py-2.5 border ${
                  msg.type === 'buy'
                    ? 'bg-emerald-500/[0.06] border-emerald-500/15'
                    : 'bg-red-500/[0.06] border-red-500/15'
                }`}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${msg.type === 'buy' ? 'bg-emerald-400' : 'bg-red-400'}`} />
                    <span className={`text-[10px] font-mono font-semibold uppercase tracking-wider ${msg.type === 'buy' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {msg.type === 'buy' ? 'Long Signal' : 'Short Signal'}
                    </span>
                  </div>
                  <div className={`font-mono text-lg font-bold ${msg.type === 'buy' ? 'text-emerald-300' : 'text-red-300'}`}>
                    ${msg.price}
                  </div>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-neutral-600 text-[10px] font-mono">{msg.time}</span>
                    <div className="flex items-center gap-1.5">
                      <div className={`h-0.5 w-10 rounded-full overflow-hidden ${msg.type === 'buy' ? 'bg-emerald-900/60' : 'bg-red-900/60'}`}>
                        <div className={`h-full rounded-full ${msg.type === 'buy' ? 'bg-emerald-400' : 'bg-red-400'}`} style={{ width: `${msg.confidence}%` }} />
                      </div>
                      <span className={`text-[10px] font-mono ${msg.type === 'buy' ? 'text-emerald-500' : 'text-red-500'}`}>{msg.confidence}%</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white/[0.04] rounded-2xl rounded-bl-sm px-3.5 py-2 border border-white/[0.06]">
                  <p className="text-neutral-400 text-[12px] leading-relaxed">{msg.text}</p>
                  <span className="text-neutral-600 text-[10px] font-mono">{msg.time}</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <div className="bg-[#0a0a0a] px-3 py-2 border-t border-white/[0.06]">
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-full px-4 py-2 flex items-center gap-2">
            <span className="text-neutral-600 text-sm flex-1">Message</span>
            <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center">
              <Send className="w-3 h-3 text-neutral-500" />
            </div>
          </div>
        </div>
        <div className="h-4 flex items-center justify-center bg-[#111]">
          <div className="w-20 h-0.5 bg-white/10 rounded-full" />
        </div>
      </div>
    </div>
  );
}

/* ================= MAIN PAGE ================= */
export default function ReversalEngine() {
  return (
    <>
      <Helmet>
        <title>Reversal Engine — AG Algo Lab</title>
        <meta name="description" content="AI-powered reversal detection system for SOL and BTC. Real-time signals, automated execution." />
      </Helmet>

      <div className="min-h-screen bg-black text-[#ededed] font-sans antialiased">

        {/* Ambient glow — purple/orange for crypto identity */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/[0.05] rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-500/[0.04] rounded-full blur-3xl" />
        </div>

        {/* ── NAV ── */}
        <nav className="fixed top-0 w-full z-50 bg-black/70 backdrop-blur-xl border-b border-white/[0.08]">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex justify-between items-center relative">
              <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
                <img src="/logo.jpg" alt="Logo" className="w-8 h-8 object-contain rounded-md" />
                <span className="text-[15px] font-semibold text-white tracking-tight">AG Algo Lab</span>
              </Link>
              {/* Centered symbol */}
              <div className="absolute left-1/2 -translate-x-1/2">
                <span className="text-2xl text-purple-400/60">◎</span>
              </div>
              <Link to="/" className="text-sm px-4 py-2 rounded-lg border border-white/10 text-neutral-400 hover:bg-white/5 hover:text-white transition-colors">
                ← Back
              </Link>
            </div>
          </div>
        </nav>

        {/* ── HERO — centered like SolverBet ── */}
        <section className="min-h-screen flex items-center justify-center pt-24 pb-16 relative">
          <div className="max-w-5xl mx-auto px-6 text-center">

            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                <span className="text-purple-400/80 text-sm font-medium font-mono tracking-wide">Crypto Intelligence · SOL · BTC</span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-6xl md:text-8xl font-semibold tracking-[-0.04em] mb-6 text-white leading-[1.02]"
            >
              Reversal Engine
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xl md:text-2xl font-light text-neutral-400 mb-12 tracking-tight max-w-xl mx-auto"
            >
              Detecting high-probability turning points in real-time.
            </motion.p>

            {/* Stat boxes — centered row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-3 gap-4 max-w-xl mx-auto"
            >
              {[
                { label: 'Active Assets', value: '2' },
                { label: 'Timeframe', value: '15m' },
                { label: 'Execution', value: 'Auto' },
              ].map((s, i) => (
                <div key={i} className="bg-[#0a0a0a] border border-white/10 rounded-xl p-4 text-center hover:border-white/20 transition-colors duration-200">
                  <div className="text-2xl font-semibold font-mono text-white mb-1">{s.value}</div>
                  <div className="text-neutral-500 text-xs">{s.label}</div>
                </div>
              ))}
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-neutral-700 text-xs font-mono italic mt-8"
            >
              Architecture details remain confidential.
            </motion.p>
          </div>
        </section>

        {/* ── PATTERN RECOGNITION ── */}
        <section className="py-24 relative">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="mb-10 text-center"
            >
              <p className="text-xs font-mono text-neutral-500 uppercase tracking-[0.2em] mb-3">Pattern Recognition</p>
              <h2 className="text-4xl md:text-5xl font-semibold text-white tracking-tight">
                Scanning in real-time.
              </h2>
              <p className="text-neutral-400 mt-4 text-lg max-w-xl mx-auto">
                Proprietary model identifies structural reversal signatures across price action — invisible to traditional analysis.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <SolScannerChart />
            </motion.div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="py-24 relative">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="mb-12 text-center"
            >
              <p className="text-xs font-mono text-neutral-500 uppercase tracking-[0.2em] mb-3">How It Works</p>
              <h2 className="text-4xl md:text-5xl font-semibold text-white tracking-tight">
                From data to order.
              </h2>
              <p className="text-neutral-400 mt-4 text-lg max-w-xl mx-auto">
                Three steps, fully automated.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-3">
              {[
                {
                  step: '01',
                  title: 'Real-Time Ingestion',
                  desc: 'Price action and order flow data streamed continuously across SOL and BTC on 15-minute intervals.',
                },
                {
                  step: '02',
                  title: 'Pattern Recognition',
                  desc: 'Proprietary model identifies structural reversal signatures. A confidence score is computed per signal before dispatch.',
                },
                {
                  step: '03',
                  title: 'Auto Execution',
                  desc: 'Upon threshold breach, signal is dispatched via Telegram and the order is routed to the broker automatically.',
                },
              ].map((item, i) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  viewport={{ once: true }}
                  className="bg-[#0a0a0a] rounded-xl p-6 border border-white/10 hover:border-white/20 transition-colors duration-200"
                >
                  {/* Step number in blue — all three equal */}
                  <div className="text-4xl font-semibold font-mono mb-4 leading-none text-blue-400 opacity-80">
                    {item.step}
                  </div>
                  <h3 className="text-white font-semibold mb-2 tracking-tight">{item.title}</h3>
                  <p className="text-neutral-400 text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SIGNAL DELIVERY ── */}
        <section className="py-24 relative">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="mb-12 text-center"
            >
              <p className="text-xs font-mono text-neutral-500 uppercase tracking-[0.2em] mb-3">Signal Delivery</p>
              <h2 className="text-4xl md:text-5xl font-semibold text-white tracking-tight">
                Instant. Precise.
              </h2>
              <p className="text-neutral-400 mt-4 text-lg max-w-xl mx-auto">
                Every reversal detection triggers an alert with entry price and confidence score,
                followed by automatic order execution.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="flex justify-center"
            >
              <TelegramAlerts />
            </motion.div>
          </div>
        </section>

        {/* ── ASSETS ── */}
        <section className="py-24 relative">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="mb-12 text-center"
            >
              <p className="text-xs font-mono text-neutral-500 uppercase tracking-[0.2em] mb-3">Assets</p>
              <h2 className="text-4xl md:text-5xl font-semibold text-white tracking-tight">
                Two markets. One engine.
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-3 max-w-2xl mx-auto">
              {[
                {
                  symbol: '◎',
                  name: 'Solana',
                  ticker: 'SOL / USDC',
                  accentBg: 'bg-purple-500/[0.06]',
                  accentBorder: 'border-purple-500/20',
                  accentText: 'text-purple-400',
                  hoverBorder: 'hover:border-purple-500/30',
                },
                {
                  symbol: '₿',
                  name: 'Bitcoin',
                  ticker: 'BTC / USDT',
                  accentBg: 'bg-orange-500/[0.06]',
                  accentBorder: 'border-orange-500/20',
                  accentText: 'text-orange-400',
                  hoverBorder: 'hover:border-orange-500/30',
                },
              ].map((asset, i) => (
                <motion.div
                  key={asset.ticker}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  viewport={{ once: true }}
                  className={`bg-[#0a0a0a] rounded-xl p-6 border border-white/10 ${asset.hoverBorder} transition-colors duration-200`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl ${asset.accentBg} border ${asset.accentBorder} flex items-center justify-center`}>
                      <span className={`text-2xl ${asset.accentText}`}>{asset.symbol}</span>
                    </div>
                    <div>
                      <div className="text-white font-semibold tracking-tight">{asset.name}</div>
                      <div className="text-neutral-500 font-mono text-xs mt-0.5">{asset.ticker}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <p className="text-neutral-700 text-xs font-mono italic text-center mt-8">
              Architecture details remain confidential.
            </p>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="py-10 border-t border-white/[0.08]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2.5">
                <img src="/logo.jpg" alt="Logo" className="w-7 h-7 object-contain rounded-md" />
                <span className="text-sm text-neutral-400">AG Algo Lab</span>
              </div>
              <div className="text-neutral-500 text-xs text-center md:text-right font-mono">
                <p>© {new Date().getFullYear()} AG Algo Lab · SIREN 935 081 703</p>
              </div>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}
