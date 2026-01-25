import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import ShahMat from "./pages/ShahMat"; 
import FraudRiskScoring from "./pages/FraudRiskScoring";

import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Phone, ChevronDown, ExternalLink, Play, Send, MoreVertical } from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';

/* ================= TECH ORBIT COMPONENT ================ */
function TechOrbit() {
  const techs = [
    { name: "Python", logo: "/logos/python.png" },
    { name: "TensorFlow", logo: "/logos/tensorflow.png" },
    { name: "Pandas", logo: "/logos/pandas.png" },
    { name: "NumPy", logo: "/logos/numpy.png" },
    { name: "MetaTrader", logo: "/logos/mt5.png" },
    { name: "PyPI", logo: "/logos/pypi.png" },
  ];

  return (
    <div className="relative w-[280px] h-[280px] sm:w-[340px] sm:h-[340px]">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur border border-white/10 flex items-center justify-center shadow-[0_0_60px_rgba(59,130,246,0.3)]">
          <img src="/logo.jpg" alt="AG Algo Lab" className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-contain" />
        </div>
      </div>
      
      <div className="absolute inset-0 animate-spin" style={{ animationDuration: '30s' }}>
        {techs.map((tech, i) => {
          const angle = (i / techs.length) * 360;
          const radius = 120;
          const x = Math.cos((angle * Math.PI) / 180) * radius;
          const y = Math.sin((angle * Math.PI) / 180) * radius;
          
          return (
            <div
              key={tech.name}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))` }}
            >
              <div 
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-[#141f38] border border-white/10 flex items-center justify-center shadow-lg hover:border-white/30 transition-all duration-300 hover:scale-110"
                style={{ animation: 'counter-spin 30s linear infinite' }}
              >
                <img src={tech.logo} alt={tech.name} className="w-8 h-8 sm:w-9 sm:h-9 object-contain" />
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="absolute inset-[30px] rounded-full border border-white/5" />
      <div className="absolute inset-[60px] rounded-full border border-dashed border-white/5" />
      
      <style>{`
        @keyframes counter-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
      `}</style>
    </div>
  );
}

/* ================ BTC SCANNER CHART COMPONENT ================= */
function BTCScannerChart() {
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
    const dpr = window.devicePixelRatio || 1;
    
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
    
    const candleWidth = chartWidth / candles.length * 0.7;
    const candleGap = chartWidth / candles.length;
    
    const priceToY = (price) => {
      return padding.top + chartHeight - ((price - minPrice) / priceRange) * chartHeight;
    };
    
    const indexToX = (index) => {
      return padding.left + index * candleGap + candleGap / 2;
    };

    let startTime = null;
    const scanDuration = 5500;
    const revealDuration = 3500;
    const totalCycle = scanDuration + revealDuration;
    
    const drawFrame = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) % totalCycle;
      const isScanning = elapsed < scanDuration;
      const scanProgress = isScanning ? elapsed / scanDuration : 1;
      const revealProgress = isScanning ? 0 : Math.min((elapsed - scanDuration) / 400, 1);
      
      setPhase(isScanning ? 'scanning' : 'revealed');
      
      ctx.fillStyle = '#060a10';
      ctx.fillRect(0, 0, width, height);
      
      const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
      bgGradient.addColorStop(0, 'rgba(10, 15, 25, 1)');
      bgGradient.addColorStop(1, 'rgba(5, 8, 15, 1)');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);
      
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
      ctx.lineWidth = 1;
      for (let i = 0; i <= 5; i++) {
        const y = padding.top + (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(width - padding.right, y);
        ctx.stroke();
      }
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.font = '11px monospace';
      ctx.textAlign = 'right';
      const niceRound = (num, step = 0.5) => {
        return Math.round(num / step) * step;
      };
      
      for (let i = 0; i <= 4; i++) {
        const price = minPrice + (priceRange / 4) * (4 - i);
        const roundedPrice = niceRound(price, 0.25); // arrondi au quart
        const y = padding.top + (chartHeight / 4) * i;
        ctx.fillText('$' + roundedPrice.toFixed(2), width - 8, y + 4);
      }

      
      const scanX = padding.left + scanProgress * chartWidth;
      
      candles.forEach((candle, i) => {
        const x = indexToX(i);
        const candleRight = x + candleWidth / 2;
        const isGreen = candle.c > candle.o;
        
        let alpha = 0.12;
        let glowIntensity = 0;
        
        if (isScanning) {
          if (candleRight < scanX) {
            alpha = 0.85;
            glowIntensity = 0.5;
          } else if (x - candleWidth / 2 < scanX) {
            const t = (scanX - (x - candleWidth / 2)) / candleWidth;
            alpha = 0.12 + t * 0.73;
            glowIntensity = t * 0.5;
          }
        } else {
          alpha = 0.12 + revealProgress * 0.73;
          glowIntensity = revealProgress * 0.4;
        }
        
        const baseColor = isGreen ? [16, 185, 129] : [239, 68, 68];
        const color = `rgba(${baseColor.join(',')}, ${alpha})`;
        
        if (glowIntensity > 0) {
          ctx.shadowColor = `rgba(${baseColor.join(',')}, ${glowIntensity * 0.6})`;
          ctx.shadowBlur = 12;
        }
        
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x, priceToY(candle.h));
        ctx.lineTo(x, priceToY(candle.l));
        ctx.stroke();
        
        const bodyTop = priceToY(Math.max(candle.o, candle.c));
        const bodyBottom = priceToY(Math.min(candle.o, candle.c));
        const bodyHeight = Math.max(bodyBottom - bodyTop, 2);
        
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.roundRect(x - candleWidth / 2, bodyTop, candleWidth, bodyHeight, 2);
        ctx.fill();
        
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
      });
      
      if (isScanning) {
        const gradient = ctx.createLinearGradient(scanX - 100, 0, scanX + 15, 0);
        gradient.addColorStop(0, 'rgba(59, 130, 246, 0)');
        gradient.addColorStop(0.6, 'rgba(59, 130, 246, 0.06)');
        gradient.addColorStop(0.85, 'rgba(59, 130, 246, 0.2)');
        gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(scanX - 100, padding.top, 115, chartHeight);
        
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.7)';
        ctx.lineWidth = 1.5;
        ctx.shadowColor = 'rgba(59, 130, 246, 0.8)';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.moveTo(scanX, padding.top);
        ctx.lineTo(scanX, height - padding.bottom);
        ctx.stroke();
        ctx.shadowBlur = 0;
        
        ctx.fillStyle = 'rgba(59, 130, 246, 0.9)';
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
        const y = extreme.type === 'low' 
          ? priceToY(candle.l) + 28 
          : priceToY(candle.h) - 28;
        
        const isLow = extreme.type === 'low';
        const markerColor = isLow ? [16, 185, 129] : [239, 68, 68];
        
        ctx.strokeStyle = `rgba(${markerColor.join(',')}, ${markerAlpha * 0.25})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(x, y, 18, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.fillStyle = `rgba(${markerColor.join(',')}, ${markerAlpha * 0.1})`;
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
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="relative">
      <div className="relative bg-gradient-to-b from-[#0a0f18] to-[#060a10] rounded-2xl border border-white/[0.06] overflow-hidden shadow-2xl shadow-black/50">
        <div className="absolute top-0 left-0 right-0 h-14 bg-gradient-to-b from-white/[0.02] to-transparent border-b border-white/[0.04] flex items-center justify-between px-5 z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-400/20 via-purple-400/10 to-pink-400/5 border border-cyan-400/20 flex items-center justify-center">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 font-bold text-sm">◎</span>
            </div>
            <div className="flex flex-col">
              <span className="text-white/80 font-semibold text-sm tracking-wide">SOL / USDC</span>
              <span className="text-white/30 text-[10px] uppercase tracking-wider">Spot</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${phase === 'scanning' ? 'bg-blue-400 animate-pulse' : 'bg-emerald-400'}`} />
            <span className="text-white/40 font-mono text-[10px] uppercase tracking-widest">
              {phase === 'scanning' ? 'Analyzing' : 'Complete'}
            </span>
          </div>
        </div>
        
        <canvas 
          ref={canvasRef}
          className="w-full h-[400px]"
          style={{ display: 'block' }}
        />
        
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#060a10] to-transparent pointer-events-none" />
      </div>
      
      <div className="flex justify-center gap-10 mt-6">
        <div className="flex items-center gap-2.5">
          <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
            <svg className="w-2.5 h-2.5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <span className="text-white/35 text-sm">Reversal Low</span>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-5 h-5 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
            <svg className="w-2.5 h-2.5 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </div>
          <span className="text-white/35 text-sm">Reversal High</span>
        </div>
      </div>
    </div>
  );
}

/* ================= TELEGRAM ALERTS COMPONENT ================= */
function TelegramAlerts() {
  const [messages, setMessages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const allMessages = [
  { id: 1, type: 'info', text: '🟢 Algorithm started — Scanning market...', time: '09:00' },
  { id: 2, type: 'info', text: '⚡ High volatility detected — Be ready, opportunity might appear', time: '09:12' },
  { id: 3, type: 'buy', price: '143.5', confidence: 94, time: '09:15' },
  { id: 4, type: 'sell', price: '150.1', confidence: 91, time: '14:45' },
];

  useEffect(() => {
    setMessages([{ ...allMessages[0], visible: true }]);
    
    const interval = setInterval(() => {
      setCurrentIndex(prev => {
        const next = (prev + 1) % allMessages.length;
        
        if (next === 0) {
          // Fade out all messages before restarting
          setMessages(current => current.map(m => ({ ...m, fading: true })));
          setTimeout(() => {
            setMessages([{ ...allMessages[0], visible: true }]);
          }, 400);
        } else {
          setMessages(current => {
            const newMessages = [...current, { ...allMessages[next], visible: true }];
            return newMessages.slice(-4);
          });
        }
        
        return next;
      });
    }, 2800);
  
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-[340px] mx-auto">
      <div className="relative">
        <div className="bg-[#0e1621] rounded-[2.5rem] border border-white/[0.06] overflow-hidden shadow-2xl shadow-black/60">
          <div className="h-7 bg-[#0e1621] relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-b-2xl" />
          </div>
          
          <div className="bg-[#17212b] px-4 py-2.5 flex items-center gap-3 border-b border-white/[0.04]">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="text-base">🤖</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-white font-semibold text-sm truncate">AG Algo Signals</span>
                <svg className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                </svg>
              </div>
              <span className="text-white/35 text-[11px]">bot</span>
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
                animate={{ 
                  opacity: msg.fading ? 0 : 1, 
                  y: msg.fading ? -10 : 0, 
                  scale: msg.fading ? 0.95 : 1 
                }}
                transition={{ duration: msg.fading ? 0.35 : 0.2, ease: 'easeOut' }}
                className="max-w-[88%]"
              >
                {msg.type === 'buy' || msg.type === 'sell' ? (
                  <div className={`rounded-2xl rounded-bl-sm px-3.5 py-2.5 ${
                    msg.type === 'buy' 
                      ? 'bg-gradient-to-br from-emerald-500/15 to-emerald-600/5 border border-emerald-500/20' 
                      : 'bg-gradient-to-br from-red-500/15 to-red-600/5 border border-red-500/20'
                  }`}>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${msg.type === 'buy' ? 'bg-emerald-400' : 'bg-red-400'}`} />
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${
                        msg.type === 'buy' ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        {msg.type === 'buy' ? 'Buy Signal' : 'Sell Signal'}
                      </span>
                    </div>
                    <div className="text-white font-mono text-lg font-bold">
                      ${msg.price}
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-white/25 text-[10px]">{msg.time}</span>
                      <div className="flex items-center gap-1.5">
                        <div className={`h-1 w-10 rounded-full overflow-hidden ${
                          msg.type === 'buy' ? 'bg-emerald-900/40' : 'bg-red-900/40'
                        }`}>
                          <div 
                            className={`h-full rounded-full ${msg.type === 'buy' ? 'bg-emerald-400' : 'bg-red-400'}`}
                            style={{ width: `${msg.confidence}%` }}
                          />
                        </div>
                        <span className={`text-[10px] font-medium ${
                          msg.type === 'buy' ? 'text-emerald-400/60' : 'text-red-400/60'
                        }`}>
                          {msg.confidence}%
                        </span>
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
              <div className="w-7 h-7 rounded-full bg-blue-500/15 flex items-center justify-center">
                <Send className="w-3.5 h-3.5 text-blue-400/70" />
              </div>
            </div>
          </div>
          
          <div className="h-5 flex items-center justify-center bg-[#0e1621]">
            <div className="w-28 h-1 bg-white/15 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= FEATURE CARD ================= */
function FeatureCard({ title, description, href, icon, color }) {
  const colorClasses = {
    green: {
      border: "hover:border-green-500/50",
      glow: "group-hover:shadow-[0_0_40px_rgba(34,197,94,0.2)]",
      icon: "bg-green-500/20 text-green-400 group-hover:bg-green-500/30",
      text: "group-hover:text-green-400"
    },
    blue: {
      border: "hover:border-blue-500/50",
      glow: "group-hover:shadow-[0_0_40px_rgba(59,130,246,0.2)]",
      icon: "bg-blue-500/20 text-blue-400 group-hover:bg-blue-500/30",
      text: "group-hover:text-blue-400"
    },
  };
  
  const c = colorClasses[color] || colorClasses.blue;

  return (
    <Link to={href} className="block group">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className={`relative bg-[#141f38] rounded-2xl p-6 border border-white/10 ${c.border} ${c.glow} transition-all duration-500`}
      >
        <div className={`w-14 h-14 rounded-xl ${c.icon} flex items-center justify-center mb-4 transition-all duration-300`}>
          {icon}
        </div>
        <h3 className={`text-xl font-bold mb-2 text-white ${c.text} transition-colors duration-300`}>
          {title}
        </h3>
        <p className="text-[#b7c3e6] text-sm leading-relaxed mb-4">
          {description}
        </p>
        <div className="flex items-center gap-2 text-white/50 group-hover:text-white/80 transition-colors">
          <span className="text-sm font-medium">Explore</span>
          <ExternalLink className="w-4 h-4" />
        </div>
      </motion.div>
    </Link>
  );
}

/* ================= KAGGLE ICON ================= */
function KaggleIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.825 23.859c-.022.092-.117.141-.281.141h-3.139c-.187 0-.351-.082-.492-.248l-5.178-6.589-1.448 1.374v5.111c0 .235-.117.352-.351.352H5.505c-.236 0-.354-.117-.354-.352V.353c0-.233.118-.353.354-.353h2.431c.234 0 .351.12.351.353v14.343l6.203-6.272c.165-.165.33-.246.495-.246h3.239c.144 0 .236.06.281.18.046.149.034.255-.036.315l-6.555 6.344 6.836 8.507c.095.104.117.208.075.339"/>
    </svg>
  );
}

/* ================= HOME PAGE ================= */
function Home() {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  const navItems = [
    { label: 'Home', to: 'home' },
    { label: 'Founder', to: 'founder' },
    { label: 'Projects', to: 'projects' },
    { label: 'Knowledge Hub', to: 'knowledge-hub' },
    { label: 'Contact', to: 'contact' },
  ];

  return (
    <>
      <Helmet>
        <title>AG Algo Lab - Predict the Unpredictable</title>
        <meta name="description" content="AG Algo Lab specializes in research and development in algorithmic trading using deep learning." />
        <link rel="icon" type="image/jpg" href="/logo.jpg" />
      </Helmet>

      <div className="min-h-screen bg-[#0e1424] text-[#e7ecff]">
        {/* Navigation */}
        <nav className="fixed top-0 w-full z-50 bg-[#0e1424]/80 backdrop-blur-xl border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition">
                <img src="/logo.jpg" alt="Logo" className="w-10 h-10 object-contain rounded-lg" />
                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  AG Algo Lab
                </span>
              </Link>

              <div className="hidden md:flex items-center gap-8">
                {navItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => scrollToSection(item.to)}
                    className="text-white/60 hover:text-white transition-colors duration-300 text-sm font-medium"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl" />
          </div>

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center lg:text-left"
              >
                <div className="inline-block mb-6">
                  <span className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-white/10 text-sm font-medium text-white/80">
                    AI · Algorithmic Trading · ML Scoring
                  </span>
                </div>
                
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
                  <span className="bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
                    AG Algo Lab
                  </span>
                </h1>
                
                <p className="text-2xl md:text-3xl font-light text-white/70 italic mb-8">
                  Predict the Unpredictable
                </p>
                
                <p className="text-lg text-[#b7c3e6] max-w-xl mb-10 leading-relaxed">
                  Research and development in algorithmic trading using deep learning. 
                  Building advanced prediction models and high-performance execution pipelines.
                </p>

                {/*
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link
                    to="/shahmat"
                    className="group px-8 py-4 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 transition-all duration-300 font-semibold shadow-lg shadow-green-500/25 hover:shadow-green-500/40 hover:scale-105 text-center"
                  >
                    <span className="flex items-center justify-center gap-2">
                      ♟️ ShahMat Chess
                      <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </span>
                  </Link>
                  <Link
                    to="/fraud-risk-scoring"
                    className="group px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 text-center"
                  >
                    <span className="flex items-center justify-center gap-2">
                      📊 Fraud Risk Scoring
                      <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </span>
                  </Link>
                </div>
                */}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex justify-center"
              >
                <TechOrbit />
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="absolute bottom-10 left-1/2 -translate-x-1/2"
            >
              <button
                onClick={() => scrollToSection('founder')}
                className="text-white/30 hover:text-white/60 transition-colors animate-bounce"
              >
                <ChevronDown className="w-8 h-8" />
              </button>
            </motion.div>
          </div>
        </section>

        {/* Founder Section */}
        <section id="founder" className="py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent" />
          
          <div className="max-w-5xl mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent mb-4">
                Founder
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-[#141f38] rounded-2xl p-8 md:p-10 border border-white/10 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              
              <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-shrink-0">
                  <div className="w-40 h-40 md:w-48 md:h-48 rounded-2xl overflow-hidden border border-white/10 shadow-xl">
                    <img 
                      src="/founder.png" 
                      alt="Anthony Gocmen" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-bold text-white mb-4">Anthony Gocmen</h3>
                  <div className="space-y-3 text-[#b7c3e6] leading-relaxed">
                    <p>
                      AG AlgoLab is led by Anthony Gocmen, Master in Finance student at <span className="text-white font-medium">Université Paris Dauphine (PSL)</span>, specializing in Python-based ML, deep learning, and quantitative modeling.
                    </p>
                    <p>
                      Work focuses on risk and financial applications, including insurance fraud detection, and has been recognized in competitions such as the <span className="text-white font-medium">'2025 Space Hackathon 4 Sustainability'</span> (1st Place).
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ================= BTC PREDICTION SECTION ================= */}
        <section id="projects" className="py-24 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-orange-500/[0.02] rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/[0.02] rounded-full blur-3xl" />
          </div>
          
          <div className="max-w-6xl mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/15 mb-6">
                <span className="text-orange-400 font-bold">₿</span>
                <span className="text-orange-400/70 text-sm font-medium">Crypto Intelligence</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-white via-orange-100 to-orange-200 bg-clip-text text-transparent">
                  Reversal Detection Engine
                </span>
              </h2>
              
              <p className="text-lg text-[#8b9dc3] max-w-2xl mx-auto leading-relaxed">
                Proprietary AI scans Bitcoin price action in real-time, identifying 
                <span> </span><span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 font-medium">
                   high-probability turning points
                </span> before they happen. The model sees patterns invisible to traditional analysis.
              </p>
              
              <p className="text-white/25 mt-4 text-sm italic font-light">
                Architecture details remain confidential
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              viewport={{ once: true }}
              className="mb-24"
            >
              <BTCScannerChart />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: true }}
              className="mb-20"
            >
              <div className="text-center mb-10">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                  Instant Signal Delivery & Execution
                </h3>
                <p className="text-[#8b9dc3] max-w-lg mx-auto">
                  When the AI detects a reversal opportunity, a real-time alert is sent with entry levels and 
                  confidence scores, and an order is automatically sent to the broker.
                </p>
              </div>
              
              <TelegramAlerts />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Other Projects
              </h3>
              <p className="text-[#8b9dc3]">
                Explore our open-source work
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              <FeatureCard
                title="ShahMat Chess Engine"
                description="A custom-built chess engine showcasing algorithmic thinking and game theory implementation."
                href="/shahmat"
                icon={<span className="text-2xl">♟️</span>}
                color="green"
              />
              <FeatureCard
                title="Fraud Risk Scoring"
                description="AI-driven insurance fraud detection combining CatBoost with isotonic calibration for reliable risk scores."
                href="/fraud-risk-scoring"
                icon={<span className="text-2xl">📊</span>}
                color="blue"
              />
            </div>
          </div>
        </section>

        {/* ================= KNOWLEDGE HUB SECTION ================= */}
        <section id="knowledge-hub" className="py-24 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
            <div 
              className="absolute inset-0 opacity-[0.02]"
              style={{
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                backgroundSize: '50px 50px'
              }}
            />
            <div className="absolute top-1/4 -left-32 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
          </div>
          
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <div className="max-w-3xl mx-auto">
                <div className="bg-[#0d1117] rounded-t-xl border border-white/10 border-b-0 px-4 py-3 flex items-center gap-3">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <span className="text-white/40 text-sm font-mono">~/ag-algolab/knowledge-hub</span>
                </div>
                <div className="bg-[#0d1117]/80 rounded-b-xl border border-white/10 p-6 font-mono">
                  <div className="flex items-start gap-2 text-sm mb-3">
                    <span className="text-green-400">$</span>
                    <span className="text-white/70">cat</span>
                    <span className="text-blue-400">mission.txt</span>
                  </div>
                  <div className="pl-4 border-l-2 border-purple-500/50">
                    <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent mb-3">
                      Knowledge Hub
                    </h2>
                    <p className="text-[#b7c3e6] leading-relaxed">
                      Free courses and tutorials on <span className="text-purple-400">Machine Learning</span>, <span className="text-blue-400">Python</span>, and <span className="text-green-400">Algorithmic Trading</span>. 
                      Learn by doing with real datasets and practical implementations.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
        
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <div className="bg-gradient-to-br from-[#141f38] to-[#0d1424] rounded-2xl border border-white/10 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-green-500/10 border-b border-white/10 p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/10 flex items-center justify-center">
                        <span className="text-2xl">🎓</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 rounded bg-green-500/20 text-green-400 text-xs font-semibold uppercase tracking-wider">
                            Free Course
                          </span>
                          <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
                            🇫🇷 French
                          </span>
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold text-white">
                          Maîtriser CatBoost : l'élite du Machine Learning
                        </h3>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-white/50">
                      <div className="flex items-center gap-1.5">
                        <Play className="w-4 h-4" />
                        <span>5 episodes</span>
                      </div>
                      <div className="w-px h-4 bg-white/20" />
                      <div className="flex items-center gap-1.5">
                        <span>📊</span>
                        <span>Real dataset</span>
                      </div>
                    </div>
                  </div>
                </div>
        
                <div className="p-6 md:p-8">
                  <div className="grid lg:grid-cols-5 gap-8">
                    <div className="lg:col-span-3">
                      <div className="aspect-video rounded-xl overflow-hidden border border-white/10 shadow-2xl shadow-purple-500/10">
                        <iframe
                          className="w-full h-full"
                          src="https://www.youtube.com/embed/videoseries?list=PLpcu21l3JC8Y8i0htvQplfREYF0m5V3H1"
                          title="Maîtriser CatBoost - Cours Complet"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    </div>
        
                    <div className="lg:col-span-2 flex flex-col justify-between">
                      <div>
                        <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                          Programme du cours
                        </h4>
                        <ul className="space-y-2.5 text-sm text-[#b7c3e6]">
                          <li className="flex items-start gap-2">
                            <span className="text-purple-400 font-mono text-xs mt-0.5">00</span>
                            <span><span className="text-white font-medium">Préambule</span> — Présentation Cours & Dataset</span>
                          </li>        
                          <li className="flex items-start gap-2">
                            <span className="text-purple-400 font-mono text-xs mt-0.5">01</span>
                            <span><span className="text-white font-medium">Encodage catégoriel</span> — Fonctionnement interne de CatBoost</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-purple-400 font-mono text-xs mt-0.5">02</span>
                            <span><span className="text-white font-medium">CatBoost VS XGB / LGBM / RF</span> — Comparatifs sur datasets réels</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-purple-400 font-mono text-xs mt-0.5">03</span>
                            <span><span className="text-white font-medium">Pipeline fiable</span> — De la préparation à la prédiction</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-purple-400 font-mono text-xs mt-0.5">04</span>
                            <span><span className="text-white font-medium">Évaluation</span> — Métriques adaptées au contexte</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-purple-400 font-mono text-xs mt-0.5">05</span>
                            <span><span className="text-white font-medium">Calibration</span> — Probabilités interprétables</span>
                          </li>
                        </ul>
                      </div>
        
                      <a
                        href="https://www.youtube.com/playlist?list=PLpcu21l3JC8Y8i0htvQplfREYF0m5V3H1"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-6 group flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 transition-all duration-300 font-semibold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-[1.02]"
                      >
                        <Play className="w-5 h-5" />
                        Commencer le cours
                        <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
        
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="grid md:grid-cols-2 gap-6"
            >
              <a
                href="https://www.youtube.com/@ag_algolab_fr"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative bg-[#141f38] rounded-xl p-6 border border-white/10 hover:border-blue-500/50 transition-all duration-500 hover:shadow-[0_0_40px_rgba(59,130,246,0.15)] overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-red-500/10 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-500/20 to-red-600/10 border border-red-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Play className="w-6 h-6 text-red-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">🇫🇷</span>
                      <h4 className="text-white font-semibold group-hover:text-blue-400 transition-colors">
                        Chaîne Française
                      </h4>
                    </div>
                    <p className="text-white/50 text-sm">
                      Cours ML, trading algorithmique & tutoriels Python
                    </p>
                  </div>
                  <ExternalLink className="w-5 h-5 text-white/30 group-hover:text-white/70 transition-colors" />
                </div>
                
                <div className="mt-4 pt-4 border-t border-white/5 font-mono text-xs text-white/30">
                  <span className="text-purple-400">@ag_algolab_fr</span>
                  <span className="text-white/20 mx-2">•</span>
                  <span>Primary channel</span>
                </div>
              </a>
        
              <a
                href="https://www.youtube.com/@ag_algolab"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative bg-[#141f38] rounded-xl p-6 border border-white/10 hover:border-purple-500/50 transition-all duration-500 hover:shadow-[0_0_40px_rgba(168,85,247,0.15)] overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-red-500/10 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-500/20 to-red-600/10 border border-red-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Play className="w-6 h-6 text-red-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">🇬🇧</span>
                      <h4 className="text-white font-semibold group-hover:text-purple-400 transition-colors">
                        English Channel
                      </h4>
                    </div>
                    <p className="text-white/50 text-sm">
                      Algo trading & Python tutorials
                    </p>
                  </div>
                  <ExternalLink className="w-5 h-5 text-white/30 group-hover:text-white/70 transition-colors" />
                </div>
                
                <div className="mt-4 pt-4 border-t border-white/5 font-mono text-xs text-white/30">
                  <span className="text-purple-400">@ag_algolab</span>
                  <span className="text-white/20 mx-2">•</span>
                  <span>International content</span>
                </div>
              </a>
            </motion.div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-24">
          <div className="max-w-4xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent mb-4">
                Contact
              </h2>
              <p className="text-lg text-[#b7c3e6]">
                Get in touch for collaborations or inquiries
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6 mb-10">
              <motion.a
                href="tel:+21655906954"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="group bg-[#141f38] rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                    <Phone className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <p className="text-white/50 text-sm">Phone (WhatsApp)</p>
                    <p className="text-white font-semibold group-hover:text-green-400 transition-colors">
                      +216 55 906 954
                    </p>
                  </div>
                </div>
              </motion.a>

              <motion.a
                href="mailto:anthony.gocmen@gmail.com"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="group bg-[#141f38] rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                    <Mail className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white/50 text-sm">Email</p>
                    <p className="text-white font-semibold group-hover:text-blue-400 transition-colors">
                      anthony.gocmen@gmail.com
                    </p>
                  </div>
                </div>
              </motion.a>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <p className="text-white/50 text-sm mb-4">Follow & Connect</p>
              <div className="flex items-center justify-center gap-4">
                <a
                  href="https://github.com/ag-algolab"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-xl bg-[#141f38] border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
                >
                  <Github className="w-5 h-5 group-hover:text-white transition-colors" />
                </a>
                <a
                  href="https://www.linkedin.com/in/anthony-gocmen"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-xl bg-[#141f38] border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
                >
                  <Linkedin className="w-5 h-5 group-hover:text-blue-400 transition-colors" />
                </a>
                <a
                  href="https://www.kaggle.com/anthonygocmen"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-xl bg-[#141f38] border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
                >
                  <KaggleIcon className="w-5 h-5 group-hover:text-cyan-400 transition-colors" />
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <img src="/logo.jpg" alt="Logo" className="w-8 h-8 object-contain rounded-lg" />
                <span className="text-sm text-[#b7c3e6]">AG Algo Lab — Building intelligent systems</span>
              </div>
              <div className="text-white/40 text-sm text-center md:text-right">
                <p>© {new Date().getFullYear()} AG Algo Lab. All rights reserved.</p>
                <p>Registered in France – Company Registration No. 935 081 703</p>
              </div>
            </div>
          </div>
        </footer>

        <Toaster />
      </div>
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/shahmat" element={<ShahMat />} />
      <Route path="/fraud-risk-scoring" element={<FraudRiskScoring />} />
      <Route path="*" element={<Home />} />
    </Routes>
  );
}
