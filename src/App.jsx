import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import ShahMat from "./pages/ShahMat"; 
import FraudRiskScoring from "./pages/FraudRiskScoring";
import SolverBet from "./pages/SolverBet";
import ScorerBet from "./pages/ScorerBet";
import ReversalEngine from "./pages/ReversalEngine";
import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Phone, ChevronDown, ExternalLink, Play, Send, MoreVertical, ArrowRight } from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';
import { AnimatedPipelineDesktop, PipelineMobile, useIsMobile } from "./pages/FraudRiskScoring";

/* ================= BUILDING BADGE COMPONENT ================= */
function BuildingBadge() {
  const [dotCount, setDotCount] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setDotCount((prev) => (prev % 3) + 1);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const dots = ['●', '●●', '●●●'][dotCount - 1];

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-[10px] font-bold uppercase tracking-wider">
      <span>🔨 Building</span>
      <span className="font-mono text-[10px] text-sky-400/60 w-5 text-left transition-all">{dots}</span>
    </span>
  );
}

function StandbyBadge() {
  const [dotCount, setDotCount] = useState(1);
  useEffect(() => {
    const interval = setInterval(() => {
      setDotCount((prev) => (prev % 3) + 1);
    }, 500);
    return () => clearInterval(interval);
  }, []);
  const dots = ['●', '●●', '●●●'][dotCount - 1];
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-[10px] font-bold uppercase tracking-wider">
      <span>Standby</span>
      <span className="font-mono text-[10px] text-yellow-400/60 w-5 text-left transition-all">{dots}</span>
    </span>
  );
}


/*Service Section*/
function ServicesSection() {
  const [demoOpen, setDemoOpen] = useState(false);
  const [demoActive, setDemoActive] = useState('statistical');
  const [fraudOpen, setFraudOpen] = useState(false);
  const isMobile = useIsMobile();
  const tiers = [
    {
      label: 'Statistical',
      badge: '3–7 days',
      color: 'cyan',
      hoverColor: 'hover:text-cyan-400', 
      tools: 'ARIMA · ETS · CES · Theta',
      desc: 'Fast, interpretable baselines. Perfect when explainability matters more than raw performance.',
    },
    {
      label: 'Machine Learning',
      badge: '1–2 weeks',
      color: 'violet',
      hoverColor: 'hover:text-violet-400',
      tools: 'CatBoost · LightGBM · MLForecast',
      desc: 'Production-grade pipelines with walk-forward validation and feature engineering.',
      highlight: true,
    },
    {
      label: 'Deep Learning',
      badge: 'Scope-dependent',
      color: 'pink',
      hoverColor: 'hover:text-pink-400',
      tools: 'N-HiTS · TFT · PatchTST',
      desc: 'State-of-the-art architectures for complex patterns, long horizons, and multi-variate series.',
    },
  ];
 
  const tierColors = {
    cyan: {
      badge: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',
      glow: 'hover:border-cyan-500/40 hover:shadow-[0_0_30px_rgba(34,211,238,0.08)]',
      dot: 'bg-cyan-400',
      tool: 'text-cyan-400/70',
    },
    violet: {
      badge: 'bg-violet-500/10 border-violet-500/20 text-violet-400',
      glow: 'hover:border-violet-500/40 hover:shadow-[0_0_30px_rgba(139,92,246,0.12)]',
      dot: 'bg-violet-400',
      tool: 'text-violet-400/70',
    },
    pink: {
      badge: 'bg-pink-500/10 border-pink-500/20 text-pink-400',
      glow: 'hover:border-pink-500/40 hover:shadow-[0_0_30px_rgba(236,72,153,0.08)]',
      dot: 'bg-pink-400',
      tool: 'text-pink-400/70',
    },
  };
 
  return (
    <section id="services" className="py-24 relative overflow-hidden">
      {/* Background atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-blue-500/[0.03] rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-purple-500/[0.03] rounded-full blur-3xl" />
      </div>
 
      <div className="max-w-6xl mx-auto px-6 relative z-10">
 
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent mb-4">
            Services
          </h2>
        </motion.div>
 
        {/* ── SERVICE 1 : Predictive Analytics ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-6"
        >
          <div className="relative bg-[#141f38] rounded-2xl border border-white/10 overflow-hidden">
            {/* Top glow */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
 
            {/* Header of card */}
            <div className="p-8 pb-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/10 border border-white/10 flex items-center justify-center flex-shrink-0 text-2xl">
                    ❖
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">
                      Predictive Analytics & Forecasting
                    </h3>
                    <p className="text-[#b7c3e6] text-sm leading-relaxed max-w-xl">
                      Turn your historical data into a foresight engine. Revenue, demand, claims, cash flow,
                      forecast what matters with the right level of sophistication for your context.
                    </p>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
                    3 Approaches
                  </span>
                </div>
              </div>
 
              {/* 3 tier cards */}
              <div className="grid md:grid-cols-3 gap-4">
                {tiers.map((tier, i) => {
                  const c = tierColors[tier.color];
                  return (
                    <motion.div
                      key={tier.label}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.1 }}
                      viewport={{ once: true }}
                      className={`relative bg-[#0e1424] rounded-xl p-5 border border-white/[0.07] transition-all duration-300 ${c.glow} ${tier.highlight ? 'ring-1 ring-violet-500/20' : ''}`}
                    >
                      {tier.highlight && (
                        <div className="absolute -top-px left-4 right-4 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
                      )}
                      <div className="flex items-center justify-between mb-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${c.badge}`}>
                          {tier.badge}
                        </span>
                      </div>
                      <h4 className="text-white font-semibold mb-2">{tier.label}</h4>
                      <p className="text-white/40 text-[11px] font-mono mb-3 leading-relaxed">{tier.tools}</p>
                      <p className="text-[#b7c3e6] text-xs leading-relaxed">{tier.desc}</p>
                      <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
                        {tier.highlight && (
                          <span className="text-violet-400/60 text-[10px] font-semibold uppercase tracking-wider">
                            Core offering
                          </span>
                        )}
                        <button
                          onClick={() => {
                            setDemoActive(tier.label.toLowerCase().replace(' ', '-'));
                            setDemoOpen(true);
                          }}
                          className={`text-[10px] font-mono text-white 
                                       ${tier.hoverColor}
                                       transition-colors duration-200 ml-auto`}
                        >
                          See example →
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
 
              {/* Deliverable strip */}
              <div className="mt-4 px-4 py-3 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                <span className="text-white/25 text-xs uppercase tracking-widest font-mono block mb-2">Deliverables tailored to your needs</span>
                <p className="text-white/45 text-xs leading-relaxed">
                  From a standalone model to a fully documented pipeline, interactive dashboard, 
                  automated reporting, or API-ready deployment, scoped around what you actually need.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
 
        {/* ── SERVICES 2 & 3 side by side ── */}
        <div className="grid md:grid-cols-2 gap-6">
 
          {/* SERVICE 2 : Fraud & Anomaly Detection */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="relative bg-[#141f38] rounded-2xl border border-white/10 overflow-hidden hover:border-emerald-500/30 hover:shadow-[0_0_40px_rgba(16,185,129,0.07)] transition-all duration-500"
          >
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
            <div className="p-7 flex flex-col h-full">
              <div className="flex items-start gap-4 mb-5">
                <div className="w-14 h-14 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0 text-2xl">
                  🛡️
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    Fraud & Anomaly Detection
                  </h3>
                  <span className="text-[10px] uppercase tracking-widest text-emerald-400/60 font-mono">Insurance · Finance · Operations</span>
                </div>
              </div>
 
              <p className="text-[#b7c3e6] text-sm leading-relaxed mb-6">
                Know exactly where to look. Calibrated risk scores and explainable signals, 
                so your team focuses time and money where it actually counts.
              </p>
              <div className="mt-auto pt-4 border-t border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-white/20 text-[10px] font-mono uppercase tracking-wider">
                    Usual model
                  </span>
                  <span className="text-white/40 text-[10px] font-mono">·</span>
                  <span className="text-emerald-400/60 text-[10px] font-mono">
                    CatBoost + Calibration
                  </span>
                </div>
                <button
                  onClick={() => setFraudOpen(true)}
                  className="text-[10px] font-mono text-white hover:text-emerald-400
                             transition-colors duration-200"
                >
                  See example →
                </button>
              </div>
            </div>
          </motion.div>
 
          {/* SERVICE 3 : On-Demand */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative bg-gradient-to-br from-[#141f38] to-[#1a1535] rounded-2xl border border-white/10 overflow-hidden hover:border-amber-500/30 hover:shadow-[0_0_40px_rgba(245,158,11,0.07)] transition-all duration-500"
          >
            {/* Decorative corner */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-500/8 to-transparent rounded-bl-full" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
 
            <div className="p-7 flex flex-col h-full relative z-10">
              {/* Titre + sous-titre — alignés en haut comme la carte 2 */}
              <div className="flex items-start gap-4 mb-3">
                <div className="w-14 h-14 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0 text-2xl">
                  ✦
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    Built Around Your Problem
                  </h3>
                  <span className="text-[10px] uppercase tracking-widest text-amber-400/60 font-mono">On-demand · Fully tailored scope</span>
                </div>
              </div>
            
              {/* Corps du texte — centré dans l'espace restant */}
              <div className="flex-1 flex items-center">
                <p className="text-[#b7c3e6] text-sm leading-relaxed">
                  Have a problem that doesn't fit a standard mold? Good.<br />
                  Let's discuss and design something together, built for YOUR context,
                  scoped around YOUR actual constraints.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
        <div className="flex justify-center mt-8">
          <button
            onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
            className="group relative flex items-center gap-3 px-10 py-4 rounded-2xl border border-white/20 overflow-hidden transition-all duration-500 hover:border-white/30 hover:scale-[1.03] hover:shadow-[0_0_40px_rgba(52,211,153,0.2)]"
            style={{
              background: 'linear-gradient(135deg, #020f07, #020a0f, #020f07)',
            }}
          >
            {/* Animated gradient background */}
            <div
              className="absolute inset-0 opacity-60"
              style={{
                background: 'linear-gradient(270deg, #10b981, #0ea5e9, #8b5cf6, #10b981)',
                backgroundSize: '400% 400%',
                animation: 'gradientShift 6s ease infinite',
                mixBlendMode: 'screen',
              }}
            />
          
            {/* Soft glow pulse */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
              style={{ boxShadow: 'inset 0 0 30px rgba(52,211,153,0.1)' }}
            />
          
            <Mail className="w-4 h-4 text-emerald-300 relative z-10" />
            <span className="text-white font-semibold text-sm tracking-wide relative z-10">
              Discuss your project
            </span>
            <ArrowRight className="w-4 h-4 text-emerald-300/70 group-hover:translate-x-1 transition-transform duration-300 relative z-10" />
          
            <style>{`
              @keyframes gradientShift {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
              }
            `}</style>
          </button>
        </div>
      </div>
      {/* ── DEMO MODAL ── */}
      {demoOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setDemoOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="relative bg-[#141f38] rounded-2xl border border-white/10 
                       w-full max-w-4xl max-h-[92vh] overflow-y-auto z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sticky header with tabs */}
            <div className="sticky top-0 z-20 bg-[#141f38]/95 backdrop-blur-md 
                            flex items-center justify-between px-6 py-4 
                            border-b border-white/[0.07]">
              <div className="flex gap-2">
                {[
                  { id: 'statistical',       label: 'Statistical'      },
                  { id: 'machine-learning',  label: 'ML'               },
                  { id: 'deep-learning',     label: 'Deep Learning'    },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setDemoActive(tab.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-200
                      ${demoActive === tab.id
                        ? 'bg-white/10 text-white border border-white/20'
                        : 'text-white/30 hover:text-white/60 border border-transparent'
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setDemoOpen(false)}
                className="text-white/30 hover:text-white/70 transition-colors text-lg leading-none w-8 h-8 flex items-center justify-center"
              >
                ✕
              </button>
            </div>
      
            {/* ============ STATISTICAL ============ */}
            {demoActive === 'statistical' && (
              <div className="p-6 md:p-8 space-y-6">
      
                {/* Context badges */}
                <div className="flex flex-wrap gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/20 
                                   text-cyan-400 text-[10px] font-semibold uppercase tracking-wider">
                    Case study
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.08] 
                                   text-white/50 text-[10px] font-mono uppercase tracking-wider">
                    French SME
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.08] 
                                   text-white/50 text-[10px] font-mono uppercase tracking-wider">
                    Real data
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.08] 
                                   text-white/50 text-[10px] font-mono uppercase tracking-wider">
                    6-month horizon
                  </span>
                </div>
      
                {/* Hero title + narrative */}
                <div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    Revenue Forecasting — French SME
                  </h3>
                  <p className="text-[#b7c3e6] text-sm leading-relaxed">
                    A French small-to-medium business reached out with a simple need: 
                    anticipate their monthly revenue to plan inventory, staffing, and cash flow 
                    with more confidence. They provided <span className="text-white font-medium">3.5 years 
                    of historical data</span>, nothing fancy, just two columns: <span className="text-cyan-400 font-mono text-xs">date</span> and 
                    the <span className="text-cyan-400 font-mono text-xs">revenue</span> recorded that day.
                  </p>
                </div>
      
                {/* Model selection card */}
                <div className="bg-[#0e1424] rounded-xl border border-white/[0.07] p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-1 h-4 rounded-full bg-cyan-400" />
                    <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400/80">
                      Model selection
                    </span>
                  </div>
                  <p className="text-[#b7c3e6] text-sm leading-relaxed mb-3">
                    Picking the right model is not guesswork. Before training anything, 
                    the data is decomposed to measure two things: <span className="text-white font-medium">trend strength</span> (is 
                    revenue drifting up or down over time?) and <span className="text-white font-medium">seasonality strength</span> (are 
                    there recurring monthly or yearly patterns?).
                  </p>
                  <p className="text-[#b7c3e6] text-sm leading-relaxed">
                    For this client, the analysis pointed clearly toward{' '}
                    <span className="text-cyan-400 font-mono text-xs">CES</span> (Complex Exponential Smoothing), a 
                    method designed for series where trend and seasonality coexist without being 
                    rigidly periodic. It also produces <span className="text-white font-medium">calibrated probabilistic forecasts</span>,
                    meaning every prediction comes with an honest uncertainty range.
                  </p>
                </div>
      
                {/* The chart */}
                <div>
                  <img
                    src="/forecast_stats_6M.png"
                    alt="CES forecast vs. realized revenue over 6 months"
                    className="w-full rounded-xl border border-white/[0.07]"
                  />
                </div>
      
                {/* MAPE explanation */}
                <div className="bg-[#0e1424] rounded-xl border border-white/[0.07] p-5">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-1 h-4 rounded-full bg-green-400" />
                        <span className="text-[10px] font-mono uppercase tracking-wider text-green-400/80">
                          The result
                        </span>
                      </div>
                      <p className="text-white/50 text-xs">Mean Absolute Percentage Error</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold font-mono text-green-400 leading-none">2.7%</div>
                      <div className="text-white/30 text-[10px] uppercase tracking-wider mt-1">MAPE</div>
                    </div>
                  </div>
                  <p className="text-[#b7c3e6] text-sm leading-relaxed">
                    MAPE tells you, on average, how far predictions were off in percentage terms. 
                    A MAPE of <span className="text-green-400 font-mono text-xs">2.7%</span> means the 
                    model was, on average, within <span className="text-white font-medium">±2.7% of the actual revenue</span> each month.
                    For context, in retail and service businesses, anything below 
                    <span className="text-white font-medium"> 5%</span> is considered excellent forecasting performance.
                  </p>
                </div>
      
                {/* Bottom CTA */}
                <div className="bg-gradient-to-br from-cyan-500/[0.06] to-blue-500/[0.04] 
                                rounded-xl border border-cyan-500/[0.15] p-5 
                                flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1">
                    <p className="text-white font-medium text-sm mb-1">
                      Have historical data sitting somewhere?
                    </p>
                    <p className="text-[#b7c3e6] text-xs leading-relaxed">
                      Two columns. A date and a number. That's all it takes to get started.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setDemoOpen(false);
                      setTimeout(() => {
                        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                      }, 200);
                    }}
                    className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg
                               bg-cyan-500/10 border border-cyan-500/30 text-cyan-300
                               hover:bg-cyan-500/20 hover:border-cyan-500/50
                               transition-all duration-200 text-sm font-medium"
                  >
                    Discuss your project
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
      
              </div>
            )}
      
            {/* ============ ML ============ */}
            {demoActive === 'machine-learning' && (
              <div className="p-12">
                <div className="flex flex-col items-center justify-center text-center gap-3 py-12">
                  <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 
                                  flex items-center justify-center text-xl">
                    ⏳
                  </div>
                  <p className="text-white/60 font-mono text-sm">Case study in preparation</p>
                  <p className="text-white/30 text-xs max-w-sm">
                    A production-grade ML pipeline showcase is being finalized. 
                    In the meantime, the statistical example shows the same rigor applied at a simpler level.
                  </p>
                </div>
              </div>
            )}
      
            {/* ============ DEEP LEARNING ============ */}
            {demoActive === 'deep-learning' && (
              <div className="p-6 md:p-8 space-y-6">
            
                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-pink-500/10 border border-pink-500/20 
                                   text-pink-400 text-[10px] font-semibold uppercase tracking-wider">
                    Deep Learning
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.08] 
                                   text-white/50 text-[10px] font-mono uppercase tracking-wider">
                    TFT · N-HiTS · PatchTST
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-pink-500/10 border border-pink-500/20 
                                   text-pink-400 text-[10px] font-semibold uppercase tracking-wider">
                    By appointment only
                  </span>
                </div>
            
                {/* Title */}
                <div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    State-of-the-art forecasting — no ceiling on complexity
                  </h3>
                  <p className="text-[#b7c3e6] text-sm leading-relaxed">
                    Where statistical models need clean, simple signals and ML pipelines 
                    rely on engineered features from historical data, deep learning architectures 
                    like TFT operate on a different level entirely.{' '}
                    <span className="text-white font-medium">
                      They ingest heterogeneous data streams — past observations, 
                      known future variables, static metadata — simultaneously,
                    </span>{' '}
                    and produce calibrated multi-horizon forecasts across any time range 
                    without retraining for each horizon.
                  </p>
                </div>
            
                {/* What makes it different */}
                <div className="bg-[#0e1424] rounded-xl border border-white/[0.07] p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-1 h-4 rounded-full bg-pink-400"/>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-pink-400/80">
                      What separates this from ML
                    </span>
                  </div>
                  <div className="space-y-3">
                    {[
                      {
                        title: 'Known future inputs',
                        desc: 'CatBoost only sees the past. TFT can integrate variables already known for the future — planned promotions, confirmed holidays, scheduled price changes — and factor them directly into the forecast.',
                        color: '#f472b6',
                      },
                      {
                        title: 'Native multi-horizon',
                        desc: 'ML models require one model per forecast horizon, with errors compounding at each step. TFT produces 1-week through 52-week forecasts in a single forward pass, with calibrated uncertainty at every step.',
                        color: '#a78bfa',
                      },
                      {
                        title: 'Temporal attention',
                        desc: 'The model learns which moments in the past mattered most for each prediction — surfacing interpretable patterns across seasonality, regime shifts, and lag effects without manual feature engineering.',
                        color: '#60a5fa',
                      },
                    ].map((item, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="w-1 flex-shrink-0 rounded-full mt-1.5"
                             style={{background: item.color, opacity: 0.7, minHeight: '12px'}}/>
                        <div>
                          <span className="text-white text-sm font-medium">{item.title} — </span>
                          <span className="text-[#b7c3e6] text-sm leading-relaxed">{item.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
            
                {/* Who it's for */}
                <div className="bg-[#0e1424] rounded-xl border border-pink-500/[0.12] p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-1 h-4 rounded-full bg-pink-400"/>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-pink-400/80">
                      Who this is built for
                    </span>
                  </div>
                  <p className="text-[#b7c3e6] text-sm leading-relaxed mb-4">
                    Deep learning forecasting is not a turnkey product. It requires 
                    substantial data infrastructure, clean pipelines, and technical 
                    ownership on your side.{' '}
                    <span className="text-white font-medium">
                      This offering is designed for organizations that already have 
                      an internal data or engineering function — a CTO, a data team, 
                      or an existing ML stack — and are looking for specialized expertise 
                      to push their forecasting capabilities further.
                    </span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'Existing data infrastructure',
                      'Internal technical team',
                      'High data volume',
                      'Long forecast horizons',
                      'Multiple interacting signals',
                    ].map(tag => (
                      <span key={tag}
                            className="px-2.5 py-1 rounded-md bg-pink-500/[0.06] border border-pink-500/[0.15] 
                                       text-pink-300/60 text-[10px] font-mono">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
            
                {/* No example block */}
                <div className="flex items-start gap-3 px-4 py-3 rounded-lg 
                                bg-white/[0.02] border border-white/[0.05]">
                  <span className="text-white/20 text-[10px] font-mono uppercase tracking-wider leading-relaxed">
                    No standardized example is provided here — every deep learning engagement 
                    starts from your data, your architecture constraints, and your forecast objectives. 
                    The scope is defined together.
                  </span>
                </div>
            
                {/* CTA */}
                <div className="bg-gradient-to-br from-pink-500/[0.06] to-violet-500/[0.04] 
                                rounded-xl border border-pink-500/[0.15] p-5 
                                flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1">
                    <p className="text-white font-medium text-sm mb-1">
                      You're sitting on signals you haven't started reading yet.
                    </p>
                    <p className="text-[#b7c3e6] text-xs leading-relaxed">
                      If the infrastructure is there, so is the opportunity.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setDemoOpen(false);
                      setTimeout(() => {
                        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                      }, 200);
                    }}
                    className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg
                               bg-pink-500/10 border border-pink-500/30 text-pink-300
                               hover:bg-pink-500/20 hover:border-pink-500/50
                               transition-all duration-200 text-sm font-medium"
                  >
                    Discuss your project
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
            
              </div>
            )} 
          </motion.div>  
        </div>
      )}
      {/* ── FRAUD MODAL ── */}
      {fraudOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setFraudOpen(false)}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="relative bg-[#141f38] rounded-2xl border border-white/10
                       w-full max-w-2xl max-h-[92vh] overflow-y-auto z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 z-20 bg-[#141f38]/95 backdrop-blur-md
                            flex items-center justify-between px-6 py-4
                            border-b border-white/[0.07]">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20
                                 text-emerald-400 text-[10px] font-semibold uppercase tracking-wider">
                  Live Pipeline
                </span>
                <span className="text-white/40 text-[10px] font-mono">
                  Fraud & Anomaly Detection
                </span>
              </div>
              <button
                onClick={() => setFraudOpen(false)}
                className="text-white/30 hover:text-white/70 transition-colors
                           text-lg leading-none w-8 h-8 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {/* Pipeline */}
            <div className="p-6">
              {isMobile ? <PipelineMobile /> : <AnimatedPipelineDesktop />}
            </div>
          </motion.div>
        </div>
      )}
    </section>  
  );
}

 


/* ================= TECH ORBIT COMPONENT ================ */
function TechOrbit() {
  const techs = [
    { name: "Python", logo: "/logos/python.png" },
    { name: "TensorFlow", logo: "/logos/catboost.png" },
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
        <h3 className={`text-xl font-bold mb-2 text-white ${c.text} transition-colors duration-300`}>{title}</h3>
        <p className="text-[#b7c3e6] text-sm leading-relaxed mb-4">{description}</p>
        <div className="flex items-center gap-2 text-white/50 group-hover:text-white/80 transition-colors">
          <span className="text-sm font-medium">Explore</span>
          <ExternalLink className="w-4 h-4" />
        </div>
      </motion.div>
    </Link>
  );
}


/* ================= FLIPPING COURSE CARD ================= */
function FlippingCourseCard() {
  const [flipped, setFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const timerRef = useRef(null);
  const countdownRef = useRef(null);

  const doFlip = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setFlipped((f) => !f);
    setTimeout(() => setIsAnimating(false), 700);
    setCountdown(60);
  };

  useEffect(() => {
    timerRef.current = setInterval(doFlip, 60000);
    countdownRef.current = setInterval(() => {
      setCountdown((c) => (c <= 1 ? 60 : c - 1));
    }, 1000);
    return () => {
      clearInterval(timerRef.current);
      clearInterval(countdownRef.current);
    };
  }, [isAnimating]);

  const telegramCurriculum = [
    { id: '01', title: 'Setup & Premier Bot', desc: "Créer son bot, récupérer le token & chat ID" },
    { id: '02', title: 'Envoyer des Messages', desc: "Construire une fonction d'envoi propre" },
    { id: '03', title: 'Envoyer des Photos', desc: "PNG, JPG, ..." },
    { id: '04', title: 'Envoyer des Vidéos', desc: "MP4, MKV, ..." },
    { id: '05', title: 'Envoyer des Documents', desc: "PDF, DOCX, CSV, ..." },
    { id: '06', title: 'Formatage  HTML', desc: "Blocs de citation ou de code, gras, ..." },
    { id: '07', title: 'Créer son Channel', desc: "Création + récupération de l'ID via bot" },
    { id: '08', title: 'Automatiser son Channel', desc: "Envoi automatique de contenus" },
  ];

  const catboostCurriculum = [
    { id: '00', title: 'Préambule', desc: 'Présentation Cours & Dataset' },
    { id: '01', title: 'Encodage Catégoriel', desc: 'Fonctionnement interne de CatBoost' },
    { id: '02', title: 'CatBoost VS XGB / LGBM / RF', desc: 'Comparatifs sur datasets réels' },
    { id: '03', title: 'Pipeline Fiable', desc: 'De la préparation à la prédiction' },
    { id: '04', title: 'Évaluation', desc: 'Métriques adaptées au contexte' },
    { id: '05', title: 'Calibration', desc: 'Probabilités interprétables' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      viewport={{ once: true }}
      className="mb-12"
    >
      {/* Header controls */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${!flipped ? 'bg-cyan-400' : 'bg-cyan-400/20'}`} />
            <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${flipped ? 'bg-purple-400' : 'bg-purple-400/20'}`} />
          </div>
          <span className="text-white/30 text-xs font-mono">
            {flipped ? 'CatBoost Expliqué' : 'Telegram × Python'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Countdown ring */}
          <div className="relative w-7 h-7">
            <svg className="w-7 h-7 -rotate-90" viewBox="0 0 28 28">
              <circle cx="14" cy="14" r="11" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2" />
              <circle
                cx="14" cy="14" r="11" fill="none"
                stroke={flipped ? 'rgba(168,85,247,0.5)' : 'rgba(34,211,238,0.5)'}
                strokeWidth="2"
                strokeDasharray={`${2 * Math.PI * 11}`}
                strokeDashoffset={`${2 * Math.PI * 11 * (1 - countdown / 60)}`}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1s linear' }}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[8px] font-mono text-white/30">{countdown}</span>
          </div>

          {/* Flip button */}
          <button
            onClick={doFlip}
            disabled={isAnimating}
            className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all duration-300 text-xs font-medium
              ${flipped
                ? 'border-purple-500/30 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20'
                : 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20'
              } ${isAnimating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <svg
              className={`w-3.5 h-3.5 transition-transform duration-300 ${isAnimating ? 'rotate-180' : 'group-hover:rotate-180'}`}
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            >
              <path d="M1 4v6h6" /><path d="M23 20v-6h-6" />
              <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
            </svg>
            Retourner
          </button>
        </div>
      </div>

      {/* 3D Flip container */}
      <div className="relative w-full" style={{ perspective: '1400px', perspectiveOrigin: '50% 40%' }}>
        <div
          className="relative w-full"
          style={{
            transformStyle: 'preserve-3d',
            transition: 'transform 0.7s cubic-bezier(0.4, 0.2, 0.2, 1)',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {/* ===== FACE AVANT : Telegram × Python ===== */}
          <div className="w-full" style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}>
            <div className="bg-gradient-to-br from-[#141f38] to-[#0d1424] rounded-2xl border border-white/10 overflow-hidden">
              <div className="bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-teal-500/10 border-b border-white/10 p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/20 flex items-center justify-center">
                      <span className="text-2xl">✈️</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded bg-green-500/20 text-green-400 text-xs font-semibold uppercase tracking-wider">Free Course</span>
                        <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider">🇫🇷 French</span>
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold text-white">Piloter Telegram depuis Python</h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-white/50">
                    <div className="flex items-center gap-1.5">
                      <Play className="w-4 h-4" /><span>9 episodes</span>
                    </div>
                    <div className="w-px h-4 bg-white/20" />
                    <div className="flex items-center gap-1.5">
                      <span>🤖</span><span>Bot automation</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 md:p-8">
                <div className="grid lg:grid-cols-5 gap-8">
                  <div className="lg:col-span-3">
                    <div className="aspect-video rounded-xl overflow-hidden border border-white/10 shadow-2xl shadow-cyan-500/10">
                      <iframe
                        className="w-full h-full"
                        src="https://www.youtube.com/embed/videoseries?list=PLpcu21l3JC8aTG9z5eGXV3Z1TSJpcwDHh&index=0"
                        title="Piloter Telegram depuis Python"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>

                  <div className="lg:col-span-2 flex flex-col justify-between">
                    <div>
                      <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        Programme du cours
                      </h4>
                      <ul className="space-y-2 text-sm text-[#b7c3e6]">
                        {telegramCurriculum.map((ep) => (
                          <li key={ep.id} className="flex items-start gap-2">
                            <span className="text-cyan-400 font-mono text-xs mt-0.5 flex-shrink-0">{ep.id}</span>
                            <span>
                              <span className="text-white font-medium">{ep.title}</span>
                              {' — '}{ep.desc}
                              {ep.advanced && (
                                <span className="ml-1 px-1.5 py-0.5 rounded bg-orange-500/15 text-orange-400 text-[9px] font-bold uppercase tracking-wider">
                                  Advanced
                                </span>
                              )}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <a
                      href="https://youtube.com/playlist?list=PLpcu21l3JC8aTG9z5eGXV3Z1TSJpcwDHh"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 group flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 transition-all duration-300 font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02]"
                    >
                      <Play className="w-5 h-5" />
                      Commencer le cours
                      <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ===== FACE ARRIÈRE : CatBoost ===== */}
          <div
            className="w-full absolute top-0 left-0"
            style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
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
                        <span className="px-2 py-0.5 rounded bg-green-500/20 text-green-400 text-xs font-semibold uppercase tracking-wider">Free Course</span>
                        <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">🇫🇷 French</span>
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold text-white">
                        Maîtriser CatBoost : l'élite du Machine Learning
                      </h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-white/50">
                    <div className="flex items-center gap-1.5">
                      <Play className="w-4 h-4" /><span>5 episodes</span>
                    </div>
                    <div className="w-px h-4 bg-white/20" />
                    <div className="flex items-center gap-1.5">
                      <span>📊</span><span>Real dataset</span>
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
                        {catboostCurriculum.map((ep) => (
                          <li key={ep.id} className="flex items-start gap-2">
                            <span className="text-purple-400 font-mono text-xs mt-0.5">{ep.id}</span>
                            <span>
                              <span className="text-white font-medium">{ep.title}</span>
                              {' — '}{ep.desc}
                            </span>
                          </li>
                        ))}
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
          </div>
        </div>
      </div>
    </motion.div>
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
    { label: 'Services', to: 'services' },
    { label: 'Projects', to: 'projects' },
    { label: 'Knowledge Hub', to: 'knowledge-hub' },
    { label: 'Contact', to: 'contact' },
  ];

  return (
    <>
      <Helmet>
        <title>AG Algo Lab - Predict the Unpredictable</title>
        <meta name="description" content="AG Algo Lab specializes in research and development using AI for predictive modelling and anomaly detection." />
        <link rel="icon" type="image/jpg" href="/logo.jpg" />
      </Helmet>

      <div className="min-h-screen bg-[#0e1424] text-[#e7ecff]">
        {/* Navigation */}
        <nav className="fixed top-0 w-full z-50 bg-[#0e1424] sm:bg-[#0e1424]/80 sm:backdrop-blur-xl border-b border-white/10">
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
            <div className="hidden sm:block absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
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
                  <span className="bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">AG Algo Lab</span>
                </h1>
                <p className="text-2xl md:text-3xl font-light text-white/70 italic mb-8">Predict the Unpredictable</p>
                <p className="text-lg text-[#b7c3e6] max-w-xl mb-10 leading-relaxed">
                  Research and development using AI for predictive modelling and anomaly detection.
                  From model design to production-ready execution pipelines.
                </p>
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
              <button onClick={() => scrollToSection('founder')} className="text-white/30 hover:text-white/60 transition-colors animate-bounce">
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
                    <img src="/founder.jpg" alt="Anthony Gocmen" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-bold text-white mb-4">Anthony Gocmen</h3>
                  <div className="space-y-3 text-[#b7c3e6] leading-relaxed">
                    <p>
                      AG Algo Lab is led by Anthony Gocmen, Finance student at <span className="text-white font-medium">Université Paris Dauphine (PSL)</span>.
                    </p>
                    <p>
                     The lab operates independently and focuses on <span className="text-white font-medium">machine learning for financial markets, algorithmic trading, and predictive modeling across multiple domains</span>. Winner of the 2025 Space Hackathon 4 Sustainability (1st Place, Arizona State University).
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Service Section */}
        <section id="services" className="py-24 relative">
          <ServicesSection />
        </section>

        {/* Projects Section */}
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
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent mb-4">Projects</h2>
            </motion.div>
          
            <div className="flex flex-col gap-6 mb-16">
          
              {/* SOLVERBET */}
              <Link to="/solverbet" className="block group">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}
                  className="relative bg-[#141f38] rounded-2xl p-6 border border-white/10 hover:border-violet-500/50 hover:shadow-[0_0_40px_rgba(124,58,237,0.2)] transition-all duration-500 overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
                    <div className="flex-shrink-0 flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-violet-500/20 group-hover:bg-violet-500/30 flex items-center justify-center transition-all duration-300 shadow-lg shadow-violet-500/10">
                        <img src="/solverbet_eagle.png" alt="SolverBet" className="w-10 h-10 object-contain" />
                      </div>
                      <div className="flex flex-col gap-1.5 md:hidden">
                        <span className="px-2.5 py-0.5 rounded-full bg-violet-500/15 border border-violet-500/25 text-violet-400 text-[10px] font-bold uppercase tracking-wider w-fit">Featured Project</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-bold uppercase tracking-wider w-fit">🟢 Live</span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="hidden md:flex items-center gap-2 mb-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-violet-500/15 border border-violet-500/25 text-violet-400 text-[10px] font-bold uppercase tracking-wider">Featured Project</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-bold uppercase tracking-wider">🟢 Live</span>
                      </div>
                      <h3 className="text-2xl font-bold text-white group-hover:text-violet-400 transition-colors duration-300 mb-2">SolverBet</h3>
                      <p className="text-[#b7c3e6] text-sm leading-relaxed">
                        Fully automated AI system covering 35+ football leagues. League-specific models identify statistically mispriced odds and deliver real-time signals via Telegram.
                      </p>
                    </div>
                    <div className="flex-shrink-0 hidden md:flex flex-col gap-2 items-end">
                      {[{ label: 'Leagues', value: '35' },{ label: 'Matches Analyzed', value: '115,000+' },{ label: 'AI Approach', value: 'Machine Learning' }].map((s) => (
                        <div key={s.label} className="text-right"><div className="text-violet-400 font-bold text-sm">{s.value}</div><div className="text-white/30 text-xs">{s.label}</div></div>
                      ))}
                    </div>
                    <div className="flex-shrink-0 md:ml-2">
                      <div className="flex items-center gap-2 text-white/50 group-hover:text-violet-400 transition-colors">
                        <span className="text-sm font-medium hidden md:block">Explore</span>
                        <ExternalLink className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>

              <div className="flex flex-col gap-6">
              
                {/* REVERSAL ENGINE */}
                <Link to="/reversal-engine" className="block group">
                  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}
                    className="relative bg-[#141f38] rounded-2xl p-6 border border-white/10 hover:border-[#9945FF]/50 hover:shadow-[0_0_40px_rgba(153,69,255,0.2)] transition-all duration-500 overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#9945FF]/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#14F195]/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
                      <div className="flex-shrink-0 flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#9945FF]/20 to-[#14F195]/10 border border-[#9945FF]/20 flex items-center justify-center transition-all duration-300 shadow-lg shadow-[#9945FF]/10 group-hover:scale-110">
                          <span className="text-2xl">◎</span>
                        </div>
                        <div className="flex flex-col gap-1.5 md:hidden">
                          <StandbyBadge />
                          <span className="px-2.5 py-0.5 rounded-full bg-[#00C2FF]/10 border border-[#00C2FF]/20 text-[#00C2FF] text-[10px] font-bold uppercase tracking-wider w-fit">Crypto</span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="hidden md:flex items-center gap-2 mb-2">
                          <StandbyBadge />
                          <span className="px-2.5 py-0.5 rounded-full bg-[#00C2FF]/10 border border-[#00C2FF]/20 text-[#00C2FF] text-[10px] font-bold uppercase tracking-wider">Crypto</span>
                        </div>
                        <h3 className="text-2xl font-bold text-white group-hover:text-[#14F195] transition-colors duration-300 mb-2">Reversal Engine</h3>
                        <p className="text-[#b7c3e6] text-sm leading-relaxed">
                          AI system detecting high-probability price reversals on SOL and BTC in real-time. Signals delivered and executed automatically via Telegram.
                        </p>
                      </div>
                      <div className="flex-shrink-0 hidden md:flex flex-col gap-2 items-end">
                        {[{ label: 'Active Assets', value: 'SOL · BTC' }, { label: 'Timeframe', value: '15m' }, { label: 'Execution', value: 'Automated' }].map((s) => (
                          <div key={s.label} className="text-right">
                            <div className="text-[#00C2FF] font-bold text-sm">{s.value}</div>
                            <div className="text-white/30 text-xs">{s.label}</div>
                          </div>
                        ))}
                      </div>
                      <div className="flex-shrink-0 md:ml-2">
                        <div className="flex items-center gap-2 text-white/50 group-hover:text-[#14F195] transition-colors">
                          <span className="text-sm font-medium hidden md:block">Explore</span>
                          <ExternalLink className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              
                {/* SHAHMAT */}
                <Link to="/shahmat" className="block group">
                  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }}
                    className="relative bg-[#141f38] rounded-2xl p-5 border border-white/10 hover:border-green-500/40 hover:shadow-[0_0_30px_rgba(34,197,94,0.12)] transition-all duration-500 overflow-hidden">
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-5">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/15 flex items-center justify-center transition-all duration-300 group-hover:bg-green-500/20">
                          <span className="text-xl">♟️</span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        {/* Badges row — aligne le titre avec les autres cards */}
                        <div className="hidden md:flex items-center gap-2 mb-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-bold uppercase tracking-wider">Open Source</span>
                          <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/40 text-[10px] font-bold uppercase tracking-wider">PyPI</span>
                        </div>
                        <h3 className="text-lg font-bold text-white group-hover:text-green-400 transition-colors duration-300 mb-1">ShahMat · Chess.com Analytics</h3>
                        <p className="text-[#b7c3e6] text-sm leading-relaxed">
                          Pull your Chess.com games, dissect your patterns by hour, Elo gap, and color — all in one Python call.
                        </p>
                      </div>
                      <div className="flex-shrink-0 md:ml-2">
                        <div className="flex items-center gap-2 text-white/40 group-hover:text-green-400 transition-colors">
                          <span className="text-sm font-medium hidden md:block">Explore</span>
                          <ExternalLink className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </div>
             </div>         
          </div>
        </section>

        {/* Knowledge Hub Section */}
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
                      Free courses and tutorials in French on <span className="text-purple-400">Machine Learning</span>, <span className="text-blue-400">Python</span>, and <span className="text-green-400">Algorithmic Trading</span>. 
                      Learn by doing with real datasets and practical implementations.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <FlippingCourseCard />
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
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent mb-4">Contact</h2>
              <p className="text-lg text-[#b7c3e6]">Get in touch for collaborations or inquiries</p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6 mb-10">
              <motion.a
                href="mailto:anthony.gocmen@dauphine.eu"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="group bg-[#141f38] rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                    <Mail className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white/50 text-sm">Email</p>
                    <p className="text-white font-semibold group-hover:text-blue-400 transition-colors">anthony.gocmen@dauphine.eu</p>
                  </div>
                </div>
              </motion.a>
            
              <motion.a
                href="https://www.linkedin.com/in/anthony-gocmen"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="group bg-[#141f38] rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                    <Linkedin className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white/50 text-sm">LinkedIn</p>
                    <p className="text-white font-semibold group-hover:text-blue-400 transition-colors">anthony-gocmen</p>
                  </div>
                </div>
              </motion.a>
            </div>
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
      <Route path="/solverbet" element={<SolverBet />} />
      <Route path="/scorerbet" element={<ScorerBet />} />
      <Route path="/reversal-engine" element={<ReversalEngine />} />
      <Route path="*" element={<Home />} />
    </Routes>
  );
}
