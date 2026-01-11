import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import ShahMat from "./pages/ShahMat"; 
import FraudRiskScoring from "./pages/FraudRiskScoring";

import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Phone, ChevronDown, ExternalLink, Play, Send } from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';

/* ================= TECH ORBIT COMPONENT ================= */
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

/* ================= BTC SCANNER CHART COMPONENT ================= */
function BTCScannerChart() {
  const [scanPosition, setScanPosition] = useState(0);
  const [isFullyLit, setIsFullyLit] = useState(false);
  const [markers, setMarkers] = useState([]);
  const animationRef = useRef(null);
  
  // Generate realistic-looking candlestick data
  const candles = [
    { open: 42100, close: 42800, high: 43200, low: 41900 },
    { open: 42800, close: 43500, high: 43800, low: 42600 },
    { open: 43500, close: 42200, high: 43600, low: 42000 },
    { open: 42200, close: 41500, high: 42400, low: 41200 }, // Local low
    { open: 41500, close: 42800, high: 43000, low: 41400 },
    { open: 42800, close: 44200, high: 44500, low: 42700 },
    { open: 44200, close: 45100, high: 45800, low: 44000 },
    { open: 45100, close: 46200, high: 46500, low: 44900 }, // Local high
    { open: 46200, close: 45000, high: 46300, low: 44800 },
    { open: 45000, close: 43800, high: 45200, low: 43500 },
    { open: 43800, close: 42500, high: 44000, low: 42200 },
    { open: 42500, close: 41800, high: 42700, low: 41500 }, // Local low
    { open: 41800, close: 43200, high: 43500, low: 41700 },
    { open: 43200, close: 44800, high: 45000, low: 43100 },
    { open: 44800, close: 45500, high: 46000, low: 44600 },
    { open: 45500, close: 44200, high: 45700, low: 44000 },
  ];

  // Find local highs and lows
  const localExtremes = [
    { index: 3, type: 'low' },
    { index: 7, type: 'high' },
    { index: 11, type: 'low' },
  ];

  const minPrice = Math.min(...candles.map(c => c.low)) - 500;
  const maxPrice = Math.max(...candles.map(c => c.high)) + 500;
  const priceRange = maxPrice - minPrice;

  const chartWidth = 640;
  const chartHeight = 320;
  const candleWidth = 28;
  const candleGap = 12;

  const priceToY = (price) => {
    return chartHeight - ((price - minPrice) / priceRange) * chartHeight;
  };

  useEffect(() => {
    let startTime = null;
    const scanDuration = 8000; // 8 seconds to scan
    const pauseDuration = 3000; // 3 seconds fully lit
    const totalDuration = scanDuration + pauseDuration;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) % totalDuration;

      if (elapsed < scanDuration) {
        const progress = elapsed / scanDuration;
        setScanPosition(progress);
        setIsFullyLit(false);

        // Add markers when scanner passes extremes
        const currentCandleIndex = Math.floor(progress * candles.length);
        const newMarkers = localExtremes
          .filter(e => e.index <= currentCandleIndex)
          .map(e => ({ ...e }));
        setMarkers(newMarkers);
      } else {
        setScanPosition(1);
        setIsFullyLit(true);
        setMarkers(localExtremes);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const scanX = scanPosition * chartWidth;

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Chart container */}
      <div className="relative bg-[#0a0f1a] rounded-2xl border border-white/10 p-6 overflow-hidden">
        {/* BTC Label */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
            <span className="text-orange-400 font-bold text-sm">₿</span>
          </div>
          <span className="text-white/70 font-mono text-sm">BTC/USDT</span>
        </div>

        {/* SVG Chart */}
        <svg 
          viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
          className="w-full h-64 md:h-80"
          style={{ filter: isFullyLit ? 'none' : 'brightness(0.3)' }}
        >
          {/* Gradient definitions */}
          <defs>
            <linearGradient id="scanGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(59,130,246,0)" />
              <stop offset="40%" stopColor="rgba(59,130,246,0.3)" />
              <stop offset="50%" stopColor="rgba(59,130,246,0.8)" />
              <stop offset="60%" stopColor="rgba(59,130,246,0.3)" />
              <stop offset="100%" stopColor="rgba(59,130,246,0)" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <clipPath id="scanClip">
              <rect x="0" y="0" width={scanX + 60} height={chartHeight} />
            </clipPath>
          </defs>

          {/* Grid lines */}
          {[...Array(5)].map((_, i) => (
            <line
              key={`h-${i}`}
              x1="0"
              y1={(i + 1) * (chartHeight / 6)}
              x2={chartWidth}
              y2={(i + 1) * (chartHeight / 6)}
              stroke="rgba(255,255,255,0.05)"
              strokeDasharray="4 4"
            />
          ))}

          {/* Dark candles (background) */}
          {candles.map((candle, i) => {
            const x = i * (candleWidth + candleGap) + candleGap;
            const isGreen = candle.close > candle.open;
            const bodyTop = priceToY(Math.max(candle.open, candle.close));
            const bodyBottom = priceToY(Math.min(candle.open, candle.close));
            const bodyHeight = Math.max(bodyBottom - bodyTop, 2);

            return (
              <g key={`dark-${i}`} opacity="0.2">
                {/* Wick */}
                <line
                  x1={x + candleWidth / 2}
                  y1={priceToY(candle.high)}
                  x2={x + candleWidth / 2}
                  y2={priceToY(candle.low)}
                  stroke={isGreen ? '#22c55e' : '#ef4444'}
                  strokeWidth="1"
                />
                {/* Body */}
                <rect
                  x={x}
                  y={bodyTop}
                  width={candleWidth}
                  height={bodyHeight}
                  fill={isGreen ? '#22c55e' : '#ef4444'}
                  rx="2"
                />
              </g>
            );
          })}

          {/* Illuminated candles (clipped by scan position) */}
          <g clipPath={!isFullyLit ? "url(#scanClip)" : undefined}>
            {candles.map((candle, i) => {
              const x = i * (candleWidth + candleGap) + candleGap;
              const isGreen = candle.close > candle.open;
              const bodyTop = priceToY(Math.max(candle.open, candle.close));
              const bodyBottom = priceToY(Math.min(candle.open, candle.close));
              const bodyHeight = Math.max(bodyBottom - bodyTop, 2);

              return (
                <g key={`lit-${i}`} filter="url(#glow)">
                  {/* Wick */}
                  <line
                    x1={x + candleWidth / 2}
                    y1={priceToY(candle.high)}
                    x2={x + candleWidth / 2}
                    y2={priceToY(candle.low)}
                    stroke={isGreen ? '#22c55e' : '#ef4444'}
                    strokeWidth="2"
                  />
                  {/* Body */}
                  <rect
                    x={x}
                    y={bodyTop}
                    width={candleWidth}
                    height={bodyHeight}
                    fill={isGreen ? '#22c55e' : '#ef4444'}
                    rx="2"
                  />
                </g>
              );
            })}
          </g>

          {/* Markers for detected extremes */}
          {markers.map((marker, idx) => {
            const candle = candles[marker.index];
            const x = marker.index * (candleWidth + candleGap) + candleGap + candleWidth / 2;
            const y = marker.type === 'low' 
              ? priceToY(candle.low) + 20 
              : priceToY(candle.high) - 20;
            const isLow = marker.type === 'low';

            return (
              <g key={`marker-${idx}`} filter="url(#glow)">
                <circle
                  cx={x}
                  cy={y}
                  r="12"
                  fill={isLow ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}
                  stroke={isLow ? '#22c55e' : '#ef4444'}
                  strokeWidth="2"
                />
                {isLow ? (
                  <path
                    d={`M${x - 5} ${y} L${x - 1} ${y + 5} L${x + 6} ${y - 4}`}
                    stroke="#22c55e"
                    strokeWidth="2.5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ) : (
                  <g>
                    <line x1={x - 4} y1={y - 4} x2={x + 4} y2={y + 4} stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1={x + 4} y1={y - 4} x2={x - 4} y2={y + 4} stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
                  </g>
                )}
              </g>
            );
          })}

          {/* Scanner line */}
          {!isFullyLit && (
            <g>
              <rect
                x={scanX - 40}
                y="0"
                width="80"
                height={chartHeight}
                fill="url(#scanGlow)"
              />
              <line
                x1={scanX}
                y1="0"
                x2={scanX}
                y2={chartHeight}
                stroke="rgba(59,130,246,0.9)"
                strokeWidth="2"
                filter="url(#glow)"
              />
            </g>
          )}
        </svg>

        {/* AI scanning indicator */}
        <div className="absolute bottom-4 right-4 flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isFullyLit ? 'bg-green-400' : 'bg-blue-400 animate-pulse'}`} />
          <span className="text-white/50 font-mono text-xs">
            {isFullyLit ? 'Analysis Complete' : 'AI Scanning...'}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ================= TELEGRAM ALERTS COMPONENT ================= */
function TelegramAlerts() {
  const [visibleMessages, setVisibleMessages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const messages = [
    { type: 'buy', price: '41,523', time: '14:32', confidence: '94%' },
    { type: 'info', text: 'Reversal pattern detected on 4H timeframe', time: '14:33' },
    { type: 'sell', price: '46,189', time: '18:47', confidence: '91%' },
    { type: 'info', text: 'Strong resistance zone ahead', time: '18:48' },
    { type: 'buy', price: '42,847', time: '09:15', confidence: '88%' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => {
        const next = (prev + 1) % messages.length;
        if (next === 0) {
          setVisibleMessages([]);
        }
        return next;
      });
      
      setVisibleMessages(prev => {
        const newMessages = [...prev, messages[currentIndex]];
        if (newMessages.length > 4) {
          return newMessages.slice(-4);
        }
        return newMessages;
      });
    }, 2500);

    // Show first message immediately
    if (visibleMessages.length === 0) {
      setVisibleMessages([messages[0]]);
    }

    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-[#0e1621] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
        {/* Telegram header */}
        <div className="bg-[#17212b] px-4 py-3 flex items-center gap-3 border-b border-white/5">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">🤖</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-white font-semibold text-sm">AG Algo Lab Signals</span>
              <svg className="w-4 h-4 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
              </svg>
            </div>
            <span className="text-white/40 text-xs">bot • online</span>
          </div>
          <Send className="w-5 h-5 text-white/30" />
        </div>

        {/* Messages area */}
        <div className="p-4 min-h-[280px] flex flex-col justify-end gap-3">
          {visibleMessages.map((msg, idx) => (
            <motion.div
              key={`${msg.time}-${idx}`}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
              className={`max-w-[85%] rounded-2xl rounded-bl-sm px-4 py-3 ${
                msg.type === 'buy' 
                  ? 'bg-gradient-to-r from-green-500/20 to-green-600/10 border border-green-500/30' 
                  : msg.type === 'sell'
                  ? 'bg-gradient-to-r from-red-500/20 to-red-600/10 border border-red-500/30'
                  : 'bg-[#182533] border border-white/5'
              }`}
            >
              {msg.type === 'buy' || msg.type === 'sell' ? (
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold uppercase tracking-wider ${
                      msg.type === 'buy' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {msg.type === 'buy' ? '🟢 BUY SIGNAL' : '🔴 SELL SIGNAL'}
                    </span>
                  </div>
                  <div className="text-white font-mono text-lg font-bold">
                    ${msg.price}
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/40">{msg.time}</span>
                    <span className={`${
                      msg.type === 'buy' ? 'text-green-400/70' : 'text-red-400/70'
                    }`}>
                      Confidence: {msg.confidence}
                    </span>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-white/80 text-sm">{msg.text}</p>
                  <span className="text-white/30 text-xs">{msg.time}</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Input area (decorative) */}
        <div className="bg-[#17212b] px-4 py-3 border-t border-white/5">
          <div className="bg-[#242f3d] rounded-full px-4 py-2 flex items-center gap-2">
            <span className="text-white/30 text-sm">Signals are automated...</span>
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
                    AI · Trading · Deep Learning
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
              {/* Background gradient */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              
              <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
                {/* Photo */}
                <div className="flex-shrink-0">
                  <div className="w-40 h-40 md:w-48 md:h-48 rounded-2xl overflow-hidden border border-white/10 shadow-xl">
                    <img 
                      src="/founder.png" 
                      alt="Anthony Gocmen" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Description */}
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

        {/* Projects Section */}
        <section id="projects" className="py-24 relative">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent mb-6">
                BTC Prediction Engine
              </h2>
              <p className="text-lg text-[#b7c3e6] max-w-3xl mx-auto leading-relaxed">
                Our proprietary AI analyzes Bitcoin price action in real-time, identifying 
                <span className="text-orange-400 font-medium"> high-probability reversal points</span> using 
                advanced pattern recognition that goes beyond traditional indicators.
              </p>
              <p className="text-white/40 mt-4 text-sm italic">
                The underlying model architecture remains confidential.
              </p>
            </motion.div>

            {/* Scanner Chart */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="mb-20"
            >
              <BTCScannerChart />
              
              {/* Legend */}
              <div className="flex justify-center gap-8 mt-6">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500/30 border border-green-500 flex items-center justify-center">
                    <span className="text-green-400 text-xs">✓</span>
                  </div>
                  <span className="text-white/50 text-sm">Buy Zone Detected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-red-500/30 border border-red-500 flex items-center justify-center">
                    <span className="text-red-400 text-xs">✕</span>
                  </div>
                  <span className="text-white/50 text-sm">Sell Zone Detected</span>
                </div>
              </div>
            </motion.div>

            {/* Telegram Alerts */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="mb-20"
            >
              <div className="text-center mb-8">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                  Real-Time Telegram Alerts
                </h3>
                <p className="text-[#b7c3e6] max-w-xl mx-auto">
                  Signals are broadcasted instantly to subscribers when the AI identifies 
                  actionable opportunities.
                </p>
              </div>
              <TelegramAlerts />
            </motion.div>

            {/* Other Projects */}
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
              <p className="text-[#b7c3e6]">
                Explore our open-source projects and research
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
        
        {/* Knowledge Hub Section */}
        <section id="knowledge-hub" className="py-24 relative overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
            {/* Grid pattern */}
            <div 
              className="absolute inset-0 opacity-[0.02]"
              style={{
                backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                backgroundSize: '50px 50px'
              }}
            />
            {/* Gradient orbs */}
            <div className="absolute top-1/4 -left-32 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
          </div>
          
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            {/* Header with terminal style */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              {/* Terminal header */}
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
        
            {/* Featured Course - CatBoost */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <div className="bg-gradient-to-br from-[#141f38] to-[#0d1424] rounded-2xl border border-white/10 overflow-hidden">
                {/* Course header */}
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
                        <span>6 episodes</span>
                      </div>
                      <div className="w-px h-4 bg-white/20" />
                      <div className="flex items-center gap-1.5">
                        <span>📊</span>
                        <span>Real dataset</span>
                      </div>
                    </div>
                  </div>
                </div>
        
                {/* Course content */}
                <div className="p-6 md:p-8">
                  <div className="grid lg:grid-cols-5 gap-8">
                    {/* Video embed - takes 3 columns */}
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
        
                    {/* Course description - takes 2 columns */}
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
                            <span><span className="text-white font-medium">Erreurs fatales</span> — Fuites de données & pièges à éviter</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-purple-400 font-mono text-xs mt-0.5">04</span>
                            <span><span className="text-white font-medium">Pipeline fiable</span> — De la préparation à la prédiction</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-purple-400 font-mono text-xs mt-0.5">05</span>
                            <span><span className="text-white font-medium">Évaluation</span> — Métriques adaptées au contexte</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-purple-400 font-mono text-xs mt-0.5">06</span>
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
        
            {/* Channel Links */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="grid md:grid-cols-2 gap-6"
            >
              {/* French Channel */}
              <a
                href="https://www.youtube.com/@ag_algolab_fr"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative bg-[#141f38] rounded-xl p-6 border border-white/10 hover:border-blue-500/50 transition-all duration-500 hover:shadow-[0_0_40px_rgba(59,130,246,0.15)] overflow-hidden"
              >
                {/* Decorative elements */}
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
                
                {/* Code-style footer */}
                <div className="mt-4 pt-4 border-t border-white/5 font-mono text-xs text-white/30">
                  <span className="text-purple-400">@ag_algolab_fr</span>
                  <span className="text-white/20 mx-2">•</span>
                  <span>Primary channel</span>
                </div>
              </a>
        
              {/* English Channel */}
              <a
                href="https://www.youtube.com/@ag_algolab"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative bg-[#141f38] rounded-xl p-6 border border-white/10 hover:border-purple-500/50 transition-all duration-500 hover:shadow-[0_0_40px_rgba(168,85,247,0.15)] overflow-hidden"
              >
                {/* Decorative elements */}
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
                
                {/* Code-style footer */}
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
