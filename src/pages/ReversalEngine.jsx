import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Send, Phone, MoreVertical } from 'lucide-react';
import { Helmet } from 'react-helmet';

/* ===================== SOLANA PALETTE =====================
   Purple  #9945FF
   Green   #14F195
   Teal    #00C2FF
   Dark    #0a0a12
   Card    #111120
   Border  rgba(153,69,255,0.15)
   ========================================================= */

/* ================= ANIMATED GRID BACKGROUND ================= */
function GridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(153,69,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(153,69,255,0.4) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#9945FF]/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-[#14F195]/6 rounded-full blur-[100px]" />
        <div className="absolute top-2/3 left-1/2 w-[300px] h-[300px] bg-[#00C2FF]/5 rounded-full blur-[80px]" />
      </div>
    </div>
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

    const priceToY = (price) =>
      padding.top + chartHeight - ((price - minPrice) / priceRange) * chartHeight;
    const indexToX = (index) =>
      padding.left + index * candleGap + candleGap / 2;

    let startTime = null;
    let lastFrameTime = 0;
    const scanDuration = 5500;
    const revealDuration = 3500;
    const totalCycle = scanDuration + revealDuration;
    const targetInterval = isMobile ? 1000 / 30 : 0;

    const drawFrame = (timestamp) => {
      if (isMobile && timestamp - lastFrameTime < targetInterval) {
        animationRef.current = requestAnimationFrame(drawFrame);
        return;
      }
      lastFrameTime = timestamp;
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) % totalCycle;
      const isScanning = elapsed < scanDuration;
      const scanProgress = isScanning ? elapsed / scanDuration : 1;
      const revealProgress = isScanning ? 0 : Math.min((elapsed - scanDuration) / 400, 1);
      setPhase(isScanning ? 'scanning' : 'revealed');

      ctx.fillStyle = '#070711';
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = 'rgba(153,69,255,0.04)';
      ctx.lineWidth = 1;
      for (let i = 0; i <= 5; i++) {
        const y = padding.top + (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(width - padding.right, y);
        ctx.stroke();
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
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;

      candles.forEach((candle, i) => {
        const x = indexToX(i);
        const candleRight = x + candleWidth / 2;
        const isGreen = candle.c > candle.o;

        let alpha = 0.1;
        if (isScanning) {
          if (candleRight < scanX) alpha = 0.85;
          else if (x - candleWidth / 2 < scanX)
            alpha = 0.1 + ((scanX - (x - candleWidth / 2)) / candleWidth) * 0.75;
        } else {
          alpha = 0.1 + revealProgress * 0.75;
        }

        // Solana green / red
        const baseColor = isGreen ? [20, 241, 149] : [255, 80, 80];
        const color = `rgba(${baseColor.join(',')}, ${alpha})`;

        if (!isMobile && alpha > 0.5) {
          ctx.shadowColor = `rgba(${baseColor.join(',')}, 0.25)`;
          ctx.shadowBlur = 10;
        }

        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x, priceToY(candle.h));
        ctx.lineTo(x, priceToY(candle.l));
        ctx.stroke();

        const bodyTop = priceToY(Math.max(candle.o, candle.c));
        const bodyBottom = priceToY(Math.min(candle.o, candle.c));
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.roundRect(x - candleWidth / 2, bodyTop, candleWidth, Math.max(bodyBottom - bodyTop, 2), 2);
        ctx.fill();
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
      });

      if (isScanning) {
        if (!isMobile) {
          const gradient = ctx.createLinearGradient(scanX - 100, 0, scanX + 15, 0);
          gradient.addColorStop(0, 'rgba(153,69,255,0)');
          gradient.addColorStop(0.6, 'rgba(153,69,255,0.06)');
          gradient.addColorStop(0.85, 'rgba(153,69,255,0.18)');
          gradient.addColorStop(1, 'rgba(153,69,255,0)');
          ctx.fillStyle = gradient;
          ctx.fillRect(scanX - 100, padding.top, 115, chartHeight);
          ctx.shadowColor = 'rgba(153,69,255,0.9)';
          ctx.shadowBlur = 18;
        }
        ctx.strokeStyle = 'rgba(153,69,255,0.8)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(scanX, padding.top);
        ctx.lineTo(scanX, height - padding.bottom);
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'rgba(153,69,255,1)';
        ctx.beginPath();
        ctx.arc(scanX, padding.top - 8, 4, 0, Math.PI * 2);
        ctx.fill();
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
        const markerColor = isLow ? [20, 241, 149] : [255, 80, 80];

        ctx.strokeStyle = `rgba(${markerColor.join(',')}, ${markerAlpha * 0.25})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(x, y, 18, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = `rgba(${markerColor.join(',')}, ${markerAlpha * 0.08})`;
        ctx.beginPath();
        ctx.arc(x, y, 13, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = `rgba(${markerColor.join(',')}, ${markerAlpha * 0.7})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.strokeStyle = `rgba(${markerColor.join(',')}, ${markerAlpha * 0.95})`;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        if (isLow) {
          ctx.beginPath();
          ctx.moveTo(x - 4, y);
          ctx.lineTo(x - 1, y + 4);
          ctx.lineTo(x + 5, y - 3);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.moveTo(x - 4, y - 4);
          ctx.lineTo(x + 4, y + 4);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(x + 4, y - 4);
          ctx.lineTo(x - 4, y + 4);
          ctx.stroke();
        }
      });

      animationRef.current = requestAnimationFrame(drawFrame);
    };

    animationRef.current = requestAnimationFrame(drawFrame);
    return () => cancelAnimationFrame(animationRef.current);
  }, []);

  return (
    <div className="relative">
      <div className="relative bg-[#070711] rounded-2xl border border-[#9945FF]/20 overflow-hidden shadow-2xl shadow-[#9945FF]/10">
        <div className="absolute top-0 left-0 right-0 h-14 bg-gradient-to-b from-[#9945FF]/5 to-transparent border-b border-[#9945FF]/10 flex items-center justify-between px-5 z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#9945FF]/30 to-[#14F195]/10 border border-[#9945FF]/30 flex items-center justify-center">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#9945FF] to-[#14F195] font-bold text-sm">◎</span>
            </div>
            <div className="flex flex-col">
              <span className="text-white/80 font-semibold text-sm tracking-wide">SOL / USDC</span>
              <span className="text-white/30 text-[10px] uppercase tracking-wider">Spot · 15m</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${phase === 'scanning' ? 'bg-[#9945FF] animate-pulse' : 'bg-[#14F195]'}`} />
            <span className="text-white/40 font-mono text-[10px] uppercase tracking-widest">
              {phase === 'scanning' ? 'Scanning' : 'Reversal Detected'}
            </span>
          </div>
        </div>
        <canvas ref={canvasRef} className="w-full h-[420px]" style={{ display: 'block' }} />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#070711] to-transparent pointer-events-none" />
      </div>

      <div className="flex justify-center gap-10 mt-6">
        <div className="flex items-center gap-2.5">
          <div className="w-5 h-5 rounded-full bg-[#14F195]/10 border border-[#14F195]/30 flex items-center justify-center">
            <svg className="w-2.5 h-2.5 text-[#14F195]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <span className="text-white/35 text-sm">Reversal Low</span>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-5 h-5 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
            <svg className="w-2.5 h-2.5 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </div>
          <span className="text-white/35 text-sm">Reversal High</span>
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
    { id: 1, type: 'info', text: '🟣 Engine online — Scanning SOL/USDC 15m...', time: '09:00' },
    { id: 2, type: 'info', text: '⚡ Structure shift detected — Monitoring closely', time: '09:11' },
    { id: 3, type: 'buy', price: '143.50', confidence: 94, time: '09:15' },
    { id: 4, type: 'sell', price: '150.10', confidence: 91, time: '14:45' },
  ];

  useEffect(() => {
    setMessages([{ ...allMessages[0], visible: true }]);
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % allMessages.length;
        if (next === 0) {
          setMessages((current) => current.map((m) => ({ ...m, fading: true })));
          setTimeout(() => setMessages([{ ...allMessages[0], visible: true }]), 400);
        } else {
          setMessages((current) => [...current, { ...allMessages[next], visible: true }].slice(-4));
        }
        return next;
      });
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-[340px] mx-auto">
      <div className="bg-[#0e1621] rounded-[2.5rem] border border-[#9945FF]/15 overflow-hidden shadow-2xl shadow-[#9945FF]/10">
        <div className="h-7 bg-[#0e1621] relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-b-2xl" />
        </div>
        <div className="bg-[#17212b] px-4 py-2.5 flex items-center gap-3 border-b border-white/[0.04]">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#9945FF] to-[#14F195]/50 flex items-center justify-center shadow-lg shadow-[#9945FF]/20">
            <span className="text-base">◎</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-white font-semibold text-sm truncate">AG Reversal Signals</span>
              <svg className="w-3.5 h-3.5 text-[#9945FF] flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
              </svg>
            </div>
            <span className="text-white/35 text-[11px]">bot · SOL · BTC</span>
          </div>
          <div className="flex items-center gap-2.5 text-white/25">
            <Phone className="w-4 h-4" />
            <MoreVertical className="w-4 h-4" />
          </div>
        </div>

        <div className="h-[300px] p-3 flex flex-col justify-end gap-2 bg-[#0e1621] overflow-hidden">
          {messages.map((msg, idx) => (
            <motion.div
              key={`${msg.id}-${idx}`}
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: msg.fading ? 0 : 1, y: msg.fading ? -10 : 0, scale: msg.fading ? 0.95 : 1 }}
              transition={{ duration: msg.fading ? 0.35 : 0.2, ease: 'easeOut' }}
              className="max-w-[88%]"
            >
              {msg.type === 'buy' || msg.type === 'sell' ? (
                <div className={`rounded-2xl rounded-bl-sm px-3.5 py-2.5 ${
                  msg.type === 'buy'
                    ? 'bg-gradient-to-br from-[#14F195]/15 to-[#14F195]/5 border border-[#14F195]/20'
                    : 'bg-gradient-to-br from-red-500/15 to-red-600/5 border border-red-500/20'
                }`}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${msg.type === 'buy' ? 'bg-[#14F195]' : 'bg-red-400'}`} />
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${msg.type === 'buy' ? 'text-[#14F195]' : 'text-red-400'}`}>
                      {msg.type === 'buy' ? 'Long Signal' : 'Short Signal'}
                    </span>
                  </div>
                  <div className="text-white font-mono text-lg font-bold">${msg.price}</div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-white/25 text-[10px]">{msg.time}</span>
                    <div className="flex items-center gap-1.5">
                      <div className={`h-1 w-10 rounded-full overflow-hidden ${msg.type === 'buy' ? 'bg-[#14F195]/20' : 'bg-red-900/40'}`}>
                        <div className={`h-full rounded-full ${msg.type === 'buy' ? 'bg-[#14F195]' : 'bg-red-400'}`} style={{ width: `${msg.confidence}%` }} />
                      </div>
                      <span className={`text-[10px] font-medium ${msg.type === 'buy' ? 'text-[#14F195]/60' : 'text-red-400/60'}`}>{msg.confidence}%</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-[#182533] rounded-2xl rounded-bl-sm px-3.5 py-2 border border-white/[0.03]">
                  <p className="text-white/60 text-[13px]">{msg.text}</p>
                  <span className="text-white/20 text-[10px]">{msg.time}</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <div className="bg-[#17212b] px-3 py-2 border-t border-white/[0.04]">
          <div className="bg-[#242f3d] rounded-full px-4 py-2 flex items-center gap-2">
            <span className="text-white/20 text-sm flex-1">Message</span>
            <div className="w-7 h-7 rounded-full bg-[#9945FF]/15 flex items-center justify-center">
              <Send className="w-3.5 h-3.5 text-[#9945FF]/70" />
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

/* ================= STAT PILL ================= */
function StatPill({ value, label, color = '#9945FF' }) {
  return (
    <div className="flex flex-col items-center gap-1 px-6 py-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
      <span className="font-mono font-bold text-2xl" style={{ color }}>{value}</span>
      <span className="text-white/40 text-xs uppercase tracking-wider">{label}</span>
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

      <div className="min-h-screen text-[#e7ecff]" style={{ backgroundColor: '#070711' }}>
        <GridBackground />

        {/* NAV */}
        <nav className="fixed top-0 w-full z-50 border-b border-[#9945FF]/10 backdrop-blur-xl" style={{ backgroundColor: 'rgba(7,7,17,0.85)' }}>
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 text-white/50 hover:text-white transition-colors duration-200 text-sm font-medium">
              <ArrowLeft className="w-4 h-4" />
              Back to Lab
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#14F195] animate-pulse" />
              <span className="text-[#14F195] font-mono text-xs uppercase tracking-widest">Live</span>
            </div>
          </div>
        </nav>

        {/* HERO */}
        <section className="relative pt-32 pb-20 px-6">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border mb-8"
                style={{ backgroundColor: 'rgba(153,69,255,0.08)', borderColor: 'rgba(153,69,255,0.2)' }}>
                <span className="text-lg">◎</span>
                <span className="text-sm font-medium" style={{ color: '#9945FF' }}>Crypto Intelligence · SOL · BTC</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
                <span className="text-white">Reversal</span>
                <br />
                <span style={{
                  backgroundImage: 'linear-gradient(135deg, #9945FF 0%, #14F195 60%, #00C2FF 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  Detection Engine
                </span>
              </h1>

              <p className="text-lg text-white/50 max-w-2xl mx-auto leading-relaxed mb-4">
                Proprietary AI identifies high-probability turning points across crypto and commodity markets in real-time.
                Signals are generated and executed automatically — no manual intervention.
              </p>
              <p className="text-white/20 text-sm italic">Architecture details remain confidential.</p>
            </motion.div>

            {/* STATS */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-wrap justify-center gap-4 mt-12"
            >
              <StatPill value="2" label="Active Assets" color="#9945FF" />
              <StatPill value="15m" label="Timeframe" color="#14F195" />
              <StatPill value="24/7" label="Monitoring" color="#00C2FF" />
              <StatPill value="Auto" label="Execution" color="#9945FF" />
            </motion.div>
          </div>
        </section>

        {/* SCANNER */}
        <section className="relative px-6 pb-24">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="mb-6"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, rgba(153,69,255,0.3))' }} />
                <span className="text-xs font-mono uppercase tracking-widest text-white/30">Live Scan · SOL/USDC</span>
                <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, rgba(153,69,255,0.3), transparent)' }} />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <SolScannerChart />
            </motion.div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="relative px-6 pb-24">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">How It Works</h2>
              <p className="text-white/40 max-w-xl mx-auto">From market data to executed order — fully automated.</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  step: '01',
                  title: 'Real-Time Ingestion',
                  desc: 'Price action and order flow data streamed continuously across SOL and BTC on 15-minute intervals.',
                  color: '#9945FF',
                },
                {
                  step: '02',
                  title: 'Pattern Recognition',
                  desc: 'Proprietary model identifies structural signatures invisible to traditional technical analysis. Confidence score computed per signal.',
                  color: '#14F195',
                },
                {
                  step: '03',
                  title: 'Auto Execution',
                  desc: 'Upon threshold breach, signal is dispatched via Telegram and order is routed to the broker automatically. Zero latency.',
                  color: '#00C2FF',
                },
              ].map((item, i) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="relative rounded-2xl p-6 border"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.02)',
                    borderColor: `${item.color}22`,
                  }}
                >
                  <div className="font-mono text-5xl font-bold mb-4 opacity-10" style={{ color: item.color }}>{item.step}</div>
                  <h3 className="text-white font-bold text-lg mb-2" style={{ color: item.color }}>{item.title}</h3>
                  <p className="text-white/45 text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* SIGNAL DELIVERY */}
        <section className="relative px-6 pb-24">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Signal Delivery</h2>
              <p className="text-white/40 max-w-lg mx-auto">
                Every reversal detection triggers an instant alert with entry level and confidence score,
                followed by automatic order execution.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <TelegramAlerts />
            </motion.div>
          </div>
        </section>

        {/* ASSETS COVERED */}
        <section className="relative px-6 pb-24">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="rounded-2xl p-8 border"
              style={{
                backgroundColor: 'rgba(153,69,255,0.04)',
                borderColor: 'rgba(153,69,255,0.15)',
              }}
            >
              <h3 className="text-white font-bold text-xl mb-6 text-center">Assets Covered</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { symbol: '◎', name: 'Solana', ticker: 'SOL/USDC', color: '#9945FF' },
                  { symbol: '₿', name: 'Bitcoin', ticker: 'BTC/USDT', color: '#F7931A' },
                ].map((asset) => (
                  <div key={asset.ticker} className="flex flex-col items-center gap-2 py-4 rounded-xl border border-white/5 bg-white/[0.02]">
                    <span className="text-3xl" style={{ color: asset.color }}>{asset.symbol}</span>
                    <span className="text-white font-semibold text-sm">{asset.name}</span>
                    <span className="text-white/30 font-mono text-xs">{asset.ticker}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-white/[0.06] flex items-center justify-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#14F195] animate-pulse" />
                <span className="text-white/30 text-sm font-mono">All models active and monitoring 24/7</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* FOOTER NAV */}
        <div className="px-6 pb-16">
          <div className="max-w-5xl mx-auto flex justify-center">
            <Link
              to="/"
              className="flex items-center gap-2 text-white/30 hover:text-white/70 transition-colors duration-200 text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to AG Algo Lab
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
