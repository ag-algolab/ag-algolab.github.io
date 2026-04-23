import { Routes, Route, Link } from 'react-router-dom';
import ShahMat from "./pages/ShahMat"; 
import FraudRiskScoring from "./pages/FraudRiskScoring";
import SolverBet from "./pages/SolverBet";
import ScorerBet from "./pages/ScorerBet";
import ReversalEngine from "./pages/ReversalEngine";
import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Linkedin, Mail, ChevronDown, ExternalLink, Play, ArrowRight, ArrowUpRight } from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';
import { AnimatedPipelineDesktop, PipelineMobile, useIsMobile } from "./pages/FraudRiskScoring";

/* ================= STATUS BADGES ================= */
function LiveBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-medium tracking-wide">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
      Live
    </span>
  );
}

function StandbyBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-neutral-500/10 border border-neutral-500/20 text-neutral-400 text-[10px] font-medium tracking-wide">
      <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
      Standby
    </span>
  );
}

function BuildingBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-medium tracking-wide">
      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
      Building
    </span>
  );
}

function NeutralBadge({ children }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/10 text-neutral-400 text-[10px] font-medium tracking-wide">
      {children}
    </span>
  );
}

/* ================= SERVICES SECTION ================= */
function ServicesSection() {
  const [demoOpen, setDemoOpen] = useState(false);
  const [demoActive, setDemoActive] = useState('statistical');
  const [fraudOpen, setFraudOpen] = useState(false);
  const isMobile = useIsMobile();

  const tiers = [
    {
      label: 'Statistical',
      badge: '3-7 days',
      tools: 'ARIMA · ETS · CES · Theta',
      desc: 'Fast, interpretable baselines. Perfect when explainability matters more than raw performance.',
      id: 'statistical',
    },
    {
      label: 'Machine Learning',
      badge: '1-2 weeks',
      tools: 'CatBoost · LightGBM · MLForecast',
      desc: 'Production-grade pipelines with walk-forward validation and feature engineering.',
      id: 'machine-learning',
      highlight: true,
    },
    {
      label: 'Deep Learning',
      badge: 'Scope-dependent',
      tools: 'N-HiTS · TFT · PatchTST',
      desc: 'State-of-the-art architectures for complex patterns, long horizons, and multi-variate series.',
      id: 'deep-learning',
    },
  ];

  return (
    <section id="services" className="py-32 relative">
      <div className="max-w-6xl mx-auto px-6">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <p className="text-xs font-mono text-neutral-500 uppercase tracking-[0.2em] mb-3">Services</p>
          <h2 className="text-4xl md:text-5xl font-semibold text-white tracking-tight">
            Built for signal, not noise.
          </h2>
          <p className="text-neutral-400 mt-4 text-lg max-w-2xl">
            Three capability levels, scoped around your actual constraints.
          </p>
        </motion.div>

        {/* SERVICE 1 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-6"
        >
          <div className="bg-[#0a0a0a] rounded-xl border border-white/10 overflow-hidden">
            <div className="p-8 pb-6">
              <div className="mb-8">
                <h3 className="text-2xl font-semibold text-white mb-2 tracking-tight">
                  Predictive Analytics & Forecasting
                </h3>
                <p className="text-neutral-400 text-sm leading-relaxed max-w-2xl">
                  Turn your historical data into a foresight engine. Revenue, demand, claims, cash flow —
                  forecast what matters{' '}
                  <span className="text-white font-semibold">
                    with the right level of sophistication for your context.
                  </span>
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-3">
                {tiers.map((tier, i) => (
                  <motion.div
                    key={tier.label}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    viewport={{ once: true }}
                    className={`relative bg-black rounded-lg p-5 border transition-colors duration-200 ${
                      tier.highlight
                        ? 'border-blue-500/30 hover:border-blue-500/50'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                    style={tier.highlight ? { borderTop: '2px solid rgba(0,112,243,0.6)' } : {}}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/25 text-blue-400 text-[10px] font-mono font-medium tracking-wide">
                        {tier.badge}
                      </span>
                      {tier.highlight && (
                        <span className="text-[10px] font-mono text-blue-400 tracking-wider">CORE</span>
                      )}
                    </div>
                    <h4 className="text-white font-semibold mb-2">{tier.label}</h4>
                    <p className="text-neutral-500 text-[11px] font-mono mb-3 leading-relaxed">{tier.tools}</p>
                    <p className="text-neutral-400 text-xs leading-relaxed mb-4">{tier.desc}</p>
                    <button
                      onClick={() => {
                        setDemoActive(tier.id);
                        setDemoOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/[0.06] border border-white/15 text-[11px] font-mono text-white/70 hover:text-white hover:bg-white/10 hover:border-white/25 transition-all duration-150"
                    >
                      See example
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 px-4 py-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                <span className="text-neutral-500 text-[10px] uppercase tracking-widest font-mono block mb-1.5">
                  Deliverables tailored to your needs
                </span>
                <p className="text-neutral-400 text-xs leading-relaxed">
                  From a standalone model to a fully documented pipeline, interactive dashboard,
                  automated reporting, or API-ready deployment.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* SERVICES 2 & 3 */}
        <div className="grid md:grid-cols-2 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="bg-[#0a0a0a] rounded-xl border border-white/10 hover:border-white/20 transition-colors duration-200"
          >
            <div className="p-8 flex flex-col h-full">
              <h3 className="text-xl font-semibold text-white mb-2 tracking-tight">
                Fraud & Anomaly Detection
              </h3>
              <p className="text-neutral-400 text-sm leading-relaxed mb-6 flex-1">
                Know exactly where to look. Calibrated risk scores
                so your team focuses time and money where it actually counts.
              </p>
              <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
                <span className="text-neutral-500 text-[11px] font-mono">CatBoost + Calibration</span>
                <button
                  onClick={() => setFraudOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/[0.06] border border-white/15 text-[11px] font-mono text-white/70 hover:text-white hover:bg-white/10 hover:border-white/25 transition-all duration-150"
                >
                  See example
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            viewport={{ once: true }}
            className="bg-[#0a0a0a] rounded-xl border border-white/10 hover:border-white/20 transition-colors duration-200"
          >
            <div className="p-8 flex flex-col h-full">
              <h3 className="text-xl font-semibold text-white mb-2 tracking-tight">
                Built Around Your Problem
              </h3>
              <p className="text-neutral-400 text-sm leading-relaxed flex-1">
                Have a problem that does not fit a standard mold? Good.
                Let us discuss and design something together, built for your context,
                scoped around your actual constraints.
              </p>
            </div>
          </motion.div>
        </div>

        {/* CTA */}
        <div className="flex justify-center mt-12">
          <button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white hover:bg-neutral-200 text-black text-sm font-medium transition-colors duration-150"
            
          >
            Discuss your project
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-150" />
          </button>
        </div>

      </div>

      {/* DEMO MODAL */}
      {demoOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setDemoOpen(false)}
        >
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" />
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="relative bg-[#0a0a0a] rounded-xl border border-white/10 w-full max-w-4xl max-h-[92vh] overflow-y-auto z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-20 bg-[#0a0a0a]/95 backdrop-blur-md flex items-center justify-between px-6 py-4 border-b border-white/[0.08]">
              <div className="flex gap-1">
                {[
                  { id: 'statistical', label: 'Statistical' },
                  { id: 'machine-learning', label: 'Machine Learning' },
                  { id: 'deep-learning', label: 'Deep Learning' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setDemoActive(tab.id)}
                    className={`px-3 py-1.5 rounded-md text-xs font-mono transition-colors duration-150 ${
                      demoActive === tab.id ? 'bg-white/10 text-white' : 'text-neutral-500 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setDemoOpen(false)}
                className="text-neutral-500 hover:text-white transition-colors text-lg leading-none w-8 h-8 flex items-center justify-center"
              >
                &#x2715;
              </button>
            </div>

            {/* STATISTICAL */}
            {demoActive === 'statistical' && (
              <div className="p-6 md:p-8 space-y-6">
                <div className="flex flex-wrap gap-2">
                  <NeutralBadge>Case study</NeutralBadge>
                  <NeutralBadge>French SME</NeutralBadge>
                  <NeutralBadge>Real data</NeutralBadge>
                  <NeutralBadge>6-month horizon</NeutralBadge>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-white mb-3 tracking-tight">
                    Revenue Forecasting - French SME
                  </h3>
                  <p className="text-neutral-400 text-sm leading-relaxed">
                    A French small-to-medium business reached out with a simple need:
                    anticipate their monthly revenue to plan inventory, staffing, and cash flow
                    with more confidence. They provided{' '}
                    <span className="text-white font-medium">3.5 years of historical data</span>,
                    nothing fancy, just two columns:{' '}
                    <span className="text-blue-400 font-mono text-xs">date</span> and the{' '}
                    <span className="text-blue-400 font-mono text-xs">revenue</span> recorded that day.
                  </p>
                </div>
                <div className="bg-black rounded-lg border border-white/[0.08] p-5">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 block mb-3">
                    Model selection
                  </span>
                  <p className="text-neutral-400 text-sm leading-relaxed mb-3">
                    Picking the right model is not guesswork. Before training anything,
                    the data is decomposed to measure two things:{' '}
                    <span className="text-white font-medium">trend strength</span> and{' '}
                    <span className="text-white font-medium">seasonality strength</span>.
                  </p>
                  <p className="text-neutral-400 text-sm leading-relaxed">
                    For this client, the analysis pointed clearly toward{' '}
                    <span className="text-blue-400 font-mono text-xs">CES</span> (Complex Exponential Smoothing),
                    a method designed for series where trend and seasonality coexist without being rigidly periodic.
                    It also produces{' '}
                    <span className="text-white font-medium">calibrated probabilistic forecasts</span>.
                  </p>
                </div>
                <div>
                  <img
                    src="/forecast_stats_6M.png"
                    alt="CES forecast vs realized revenue over 6 months"
                    className="w-full rounded-lg border border-white/[0.08]"
                  />
                </div>
                <div className="bg-black rounded-lg border border-white/[0.08] p-5">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 block mb-1">
                        The result
                      </span>
                      <p className="text-neutral-500 text-xs">Mean Absolute Percentage Error</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-semibold font-mono text-emerald-400 leading-none">2.7%</div>
                      <div className="text-neutral-500 text-[10px] uppercase tracking-wider mt-1">MAPE</div>
                    </div>
                  </div>
                  <p className="text-neutral-400 text-sm leading-relaxed">
                    A MAPE of{' '}
                    <span className="text-emerald-400 font-mono text-xs">2.7%</span> means the model was,
                    on average, within{' '}
                    <span className="text-white font-medium">2.7% of the actual revenue</span> each month.
                    In retail and service businesses, anything below{' '}
                    <span className="text-white font-medium">5%</span> is considered excellent.
                  </p>
                </div>
                <div className="bg-black rounded-lg border border-white/[0.08] p-5 flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1">
                    <p className="text-white font-medium text-sm mb-1">Have historical data sitting somewhere?</p>
                    <p className="text-neutral-400 text-xs leading-relaxed">
                      Two columns. A date and a number. That is all it takes to get started.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setDemoOpen(false);
                      setTimeout(() => { document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }, 200);
                    }}
                    className="group inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white hover:bg-neutral-200 text-black text-sm font-medium transition-colors duration-150"
                  >
                    Discuss your project
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ML */}
            {demoActive === 'machine-learning' && (
              <div className="p-12">
                <div className="flex flex-col items-center justify-center text-center gap-3 py-12">
                  <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-lg">
                    &#x23F3;
                  </div>
                  <p className="text-white/80 font-mono text-sm">Case study in preparation</p>
                  <p className="text-neutral-500 text-xs max-w-sm">
                    A production-grade ML pipeline showcase is being finalized.
                    In the meantime, the statistical example shows the same rigor applied at a simpler level.
                  </p>
                </div>
              </div>
            )}

            {/* DEEP LEARNING */}
            {demoActive === 'deep-learning' && (
              <div className="p-6 md:p-8 space-y-6">
                <div className="flex flex-wrap gap-2">
                  <NeutralBadge>Deep Learning</NeutralBadge>
                  <NeutralBadge>TFT · N-HiTS · PatchTST</NeutralBadge>
                  <NeutralBadge>Collaboration tier</NeutralBadge>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-white mb-3 tracking-tight">
                    When the patterns run deep
                  </h3>
                  <p className="text-neutral-400 text-sm leading-relaxed">
                    Deep learning architectures like TFT are built for one thing: finding{' '}
                    <span className="text-white font-medium">
                      non-obvious dependencies across many variables including ones already known about the future
                    </span>{' '}
                    (planned promotions, confirmed holidays, scheduled prices). They surface
                    signals that statistical and ML models structurally cannot see.
                  </p>
                </div>
                <div className="bg-black rounded-lg border border-white/[0.08] p-5">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 block mb-3">
                    Who this is for
                  </span>
                  <p className="text-neutral-400 text-sm leading-relaxed">
                    Best suited for organizations that already have data pipelines and
                    some technical ownership in-house. Deep learning is a long-term
                    commitment - the model needs to be maintained, monitored, and
                    updated as your data evolves.
                  </p>
                </div>
                <div className="bg-black rounded-lg border border-white/[0.08] p-5 flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1">
                    <p className="text-white font-medium text-sm mb-1">
                      You are sitting on signals you have not started reading yet.
                    </p>
                    <p className="text-neutral-400 text-xs leading-relaxed">
                      If the infrastructure is there, so is the opportunity.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setDemoOpen(false);
                      setTimeout(() => { document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }, 200);
                    }}
                    className="group inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white hover:bg-neutral-200 text-black text-sm font-medium transition-colors duration-150"
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

      {/* FRAUD MODAL */}
      {fraudOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setFraudOpen(false)}
        >
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" />
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="relative bg-[#0a0a0a] rounded-xl border border-white/10 w-full max-w-2xl max-h-[92vh] overflow-y-auto z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-20 bg-[#0a0a0a]/95 backdrop-blur-md flex items-center justify-between px-6 py-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-3">
                <NeutralBadge>Live Pipeline</NeutralBadge>
                <span className="text-neutral-500 text-[11px] font-mono">Fraud & Anomaly Detection</span>
              </div>
              <button
                onClick={() => setFraudOpen(false)}
                className="text-neutral-500 hover:text-white transition-colors text-lg leading-none w-8 h-8 flex items-center justify-center"
              >
                &#x2715;
              </button>
            </div>
            <div className="p-6">
              {isMobile ? <PipelineMobile /> : <AnimatedPipelineDesktop />}
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
}

/* ================= TECH ORBIT ================= */
function TechOrbit() {
  const techs = [
    { name: "Python", logo: "/logos/python.png" },
    { name: "CatBoost", logo: "/logos/catboost.png" },
    { name: "Pandas", logo: "/logos/pandas.png" },
    { name: "NumPy", logo: "/logos/numpy.png" },
    { name: "MetaTrader", logo: "/logos/mt5.png" },
    { name: "PyPI", logo: "/logos/pypi.png" },
  ];

  return (
    <div className="relative w-[280px] h-[280px] sm:w-[340px] sm:h-[340px]">
      {/* Center logo */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-[#0a0a0a] border border-white/10 flex items-center justify-center shadow-[0_0_80px_rgba(0,112,243,0.15)]">
          <img src="/logo.jpg" alt="AG Algo Lab" className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-contain" />
        </div>
      </div>

      {/* Orbiting techs */}
      <div className="absolute inset-0 animate-spin" style={{ animationDuration: '40s' }}>
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
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-[#0a0a0a] border border-white/10 flex items-center justify-center hover:border-white/20 transition-colors duration-200"
                style={{ animation: 'counter-spin 40s linear infinite' }}
              >
                <img src={tech.logo} alt={tech.name} className="w-8 h-8 sm:w-9 sm:h-9 object-contain" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Orbit rings */}
      <div className="absolute inset-[30px] rounded-full border border-white/[0.04]" />
      <div className="absolute inset-[60px] rounded-full border border-dashed border-white/[0.04]" />

      <style>{`
        @keyframes counter-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
      `}</style>
    </div>
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
    { id: '06', title: 'Formatage HTML', desc: "Blocs de citation ou de code, gras, ..." },
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

  const currentCourse = flipped
    ? { title: 'Maîtriser CatBoost', playlist: 'PLpcu21l3JC8Y8i0htvQplfREYF0m5V3H1', episodes: 5, curriculum: catboostCurriculum, emoji: '🎓' }
    : { title: 'Piloter Telegram depuis Python', playlist: 'PLpcu21l3JC8aTG9z5eGXV3Z1TSJpcwDHh', episodes: 9, curriculum: telegramCurriculum, emoji: '✈️' };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="mb-12"
    >
      {/* Header controls */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${!flipped ? 'bg-white' : 'bg-white/20'}`} />
            <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${flipped ? 'bg-white' : 'bg-white/20'}`} />
          </div>
          <span className="text-neutral-500 text-xs font-mono">
            {flipped ? '02 / CatBoost' : '01 / Telegram × Python'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Countdown ring */}
          <div className="relative w-6 h-6">
            <svg className="w-6 h-6 -rotate-90" viewBox="0 0 28 28">
              <circle cx="14" cy="14" r="11" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2" />
              <circle
                cx="14" cy="14" r="11" fill="none"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="2"
                strokeDasharray={`${2 * Math.PI * 11}`}
                strokeDashoffset={`${2 * Math.PI * 11 * (1 - countdown / 60)}`}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1s linear' }}
              />
            </svg>
          </div>

          <button
            onClick={doFlip}
            disabled={isAnimating}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 transition-colors duration-150 text-xs font-medium text-white
              ${isAnimating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <svg
              className={`w-3.5 h-3.5 transition-transform duration-300 ${isAnimating ? 'rotate-180' : ''}`}
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            >
              <path d="M1 4v6h6" /><path d="M23 20v-6h-6" />
              <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
            </svg>
            Switch
          </button>
        </div>
      </div>

      {/* 3D flip */}
      <div className="relative w-full" style={{ perspective: '1400px', perspectiveOrigin: '50% 40%' }}>
        <div
          className="relative w-full"
          style={{
            transformStyle: 'preserve-3d',
            transition: 'transform 0.7s cubic-bezier(0.4, 0.2, 0.2, 1)',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {/* FACE AVANT */}
          <div className="w-full" style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}>
            <CourseFace course={{ title: 'Piloter Telegram depuis Python', playlist: 'PLpcu21l3JC8aTG9z5eGXV3Z1TSJpcwDHh', episodes: 9, curriculum: telegramCurriculum, emoji: '✈️' }} />
          </div>

          {/* FACE ARRIERE */}
          <div
            className="w-full absolute top-0 left-0"
            style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <CourseFace course={{ title: "Maîtriser CatBoost : l'élite du Machine Learning", playlist: 'PLpcu21l3JC8Y8i0htvQplfREYF0m5V3H1', episodes: 5, curriculum: catboostCurriculum, emoji: '🎓' }} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function CourseFace({ course }) {
  return (
    <div className="bg-[#0a0a0a] rounded-xl border border-white/10 overflow-hidden">
      <div className="border-b border-white/[0.08] p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
              <span className="text-2xl">{course.emoji}</span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <NeutralBadge>Free</NeutralBadge>
                <NeutralBadge>🇫🇷 French</NeutralBadge>
              </div>
              <h3 className="text-xl md:text-2xl font-semibold text-white tracking-tight">{course.title}</h3>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs text-neutral-500 font-mono">
            <div className="flex items-center gap-1.5">
              <Play className="w-3.5 h-3.5" /><span>{course.episodes} episodes</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8">
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <div className="aspect-video rounded-lg overflow-hidden border border-white/10">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/videoseries?list=${course.playlist}`}
                title={course.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>

          <div className="lg:col-span-2 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 block mb-3">
                Programme
              </span>
              <ul className="space-y-2 text-sm text-neutral-400">
                {course.curriculum.map((ep) => (
                  <li key={ep.id} className="flex items-start gap-2">
                    <span className="text-neutral-600 font-mono text-xs mt-0.5 flex-shrink-0">{ep.id}</span>
                    <span>
                      <span className="text-white font-medium">{ep.title}</span>
                      {' — '}<span className="text-neutral-500">{ep.desc}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <a
              href={`https://youtube.com/playlist?list=${course.playlist}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 group flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-white text-black hover:bg-neutral-200 transition-colors duration-150 font-medium text-sm"
            >
              <Play className="w-4 h-4" />
              Commencer le cours
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= HOME PAGE ================= */
function Home() {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  const navItems = [
    { label: 'Founder', to: 'founder' },
    { label: 'Services', to: 'services' },
    { label: 'Projects', to: 'projects' },
    { label: 'Knowledge Hub', to: 'knowledge-hub' },
    { label: 'Contact', to: 'contact' },
  ];

  return (
    <>
      <Helmet>
        <title>AG Algo Lab — Predictive modelling & anomaly detection</title>
        <meta name="description" content="AG Algo Lab specializes in research and development using Machine Learning for predictive modelling and anomaly detection." />
        <link rel="icon" type="image/jpg" href="/logo.jpg" />
      </Helmet>

      <div className="min-h-screen bg-black text-[#ededed] font-sans antialiased">
        {/* Navigation */}
        <nav className="fixed top-0 w-full z-50 bg-black/70 backdrop-blur-xl border-b border-white/[0.08]">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
                <img src="/logo.jpg" alt="Logo" className="w-8 h-8 object-contain rounded-md" />
                <span className="text-[15px] font-semibold text-white tracking-tight">
                  AG Algo Lab
                </span>
              </Link>
              <div className="hidden md:flex items-center gap-7">
                {navItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => scrollToSection(item.to)}
                    className="text-neutral-400 hover:text-white transition-colors duration-150 text-sm"
                  >
                    {item.label}
                  </button>
                ))}
                <button
                  onClick={() => scrollToSection('contact')}
                  className="px-3.5 py-1.5 rounded-md bg-white text-black hover:bg-neutral-200 transition-colors duration-150 text-sm font-medium"
                >
                  Get in touch
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <section id="home" className="min-h-screen flex items-center justify-center relative pt-20 overflow-hidden">
          {/* Background glows */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-blue-500/[0.04] rounded-full blur-[100px] sm:hidden" />
            <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-blue-500/[0.04] rounded-full blur-[100px] sm:hidden" />
            <div className="hidden sm:block absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-500/[0.03] rounded-full blur-[120px]" />
            <div className="hidden sm:block absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/[0.03] rounded-full blur-[120px]" />
          </div>

          <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center lg:text-left"
              >
                <div className="inline-flex items-center gap-2 mb-8 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs text-neutral-300 font-mono tracking-wide">Statistics · Machine Learning · DL</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-semibold tracking-[-0.04em] mb-5 text-white leading-[1.02]">
                  AG Algo Lab
                </h1>

                <p className="text-2xl md:text-3xl font-light text-neutral-400 mb-6 tracking-tight">
                  Before it happens.
                </p>

                <p className="text-base text-neutral-500 max-w-md mb-10 leading-relaxed">
                  Every engagement starts with a question. We answer it with a model.
                </p>

                <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                  <button
                    onClick={() => scrollToSection('contact')}
                    className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white text-black hover:bg-neutral-200 transition-colors duration-150 text-sm font-medium"
                  >
                    Start a project
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                  <button
                    onClick={() => scrollToSection('projects')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-colors duration-150 text-sm font-medium"
                  >
                    View projects
                  </button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="flex justify-center"
              >
                <TechOrbit />
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="absolute bottom-10 left-1/2 -translate-x-1/2"
            >
              <button onClick={() => scrollToSection('founder')} className="text-neutral-600 hover:text-neutral-400 transition-colors animate-bounce">
                <ChevronDown className="w-6 h-6" />
              </button>
            </motion.div>
          </div>
        </section>

        {/* Founder */}
        <section id="founder" className="py-32 relative">
          <div className="max-w-5xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <p className="text-xs font-mono text-neutral-500 uppercase tracking-[0.2em] mb-3">Founder</p>
              <h2 className="text-4xl md:text-5xl font-semibold text-white tracking-tight">
                Independent, focused, accountable.
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-[#0a0a0a] rounded-xl p-8 md:p-10 border border-white/10"
            >
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-shrink-0">
                  <div className="w-36 h-36 md:w-44 md:h-44 rounded-xl overflow-hidden border border-white/10">
                    <img src="/founder.jpg" alt="Anthony Gocmen" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-semibold text-white mb-4 tracking-tight">Anthony Gocmen</h3>
                  <div className="space-y-3 text-neutral-400 leading-relaxed text-[15px]">
                    <p>
                      AG Algo Lab is led by Anthony Gocmen, Finance student at <span className="text-white">Université Paris Dauphine (PSL)</span>.
                    </p>
                    <p>
                      The lab operates independently and focuses on <span className="text-white">machine learning for financial markets, algorithmic trading, and predictive modeling across multiple domains</span>. Winner of the 2025 Space Hackathon 4 Sustainability (1st Place, Arizona State University).
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Services */}
        <ServicesSection />

        {/* Projects */}
        <section id="projects" className="py-32 relative">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <p className="text-xs font-mono text-neutral-500 uppercase tracking-[0.2em] mb-3">Projects</p>
              <h2 className="text-4xl md:text-5xl font-semibold text-white tracking-tight">
                Systems running in production.
              </h2>
            </motion.div>

            <div className="flex flex-col gap-3">

              {/* SOLVERBET */}
              <Link to="/solverbet" className="block group">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  viewport={{ once: true }}
                  className="relative bg-[#0a0a0a] rounded-xl p-6 border border-white/10 hover:border-white/20 transition-colors duration-200"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className="flex-shrink-0 flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                        <img src="/solverbet_eagle.png" alt="SolverBet" className="w-9 h-9 object-contain" />
                      </div>
                      <div className="flex flex-col gap-1.5 md:hidden">
                        <LiveBadge />
                        <NeutralBadge>Featured</NeutralBadge>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="hidden md:flex items-center gap-2 mb-2">
                        <LiveBadge />
                        <NeutralBadge>Featured project</NeutralBadge>
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-1.5 tracking-tight group-hover:text-white transition-colors">SolverBet</h3>
                      <p className="text-neutral-400 text-sm leading-relaxed max-w-2xl">
                        Fully automated AI system covering 35+ football leagues. League-specific models identify statistically mispriced odds and deliver real-time signals via Telegram.
                      </p>
                    </div>
                    <div className="flex-shrink-0 hidden md:flex flex-col gap-2 items-end min-w-[140px]">
                      {[{ l: 'Leagues', v: '35' }, { l: 'Matches', v: '115,000+' }, { l: 'Approach', v: 'ML' }].map((s) => (
                        <div key={s.l} className="text-right">
                          <div className="text-white font-medium text-sm font-mono">{s.v}</div>
                          <div className="text-neutral-500 text-[10px] uppercase tracking-wider">{s.l}</div>
                        </div>
                      ))}
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-neutral-600 group-hover:text-white transition-colors flex-shrink-0" />
                  </div>
                </motion.div>
              </Link>

              {/* REVERSAL ENGINE */}
              <Link to="/reversal-engine" className="block group">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.05 }}
                  viewport={{ once: true }}
                  className="relative bg-[#0a0a0a] rounded-xl p-6 border border-white/10 hover:border-white/20 transition-colors duration-200"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className="flex-shrink-0 flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                        <span className="text-2xl">◎</span>
                      </div>
                      <div className="flex flex-col gap-1.5 md:hidden">
                        <StandbyBadge />
                        <NeutralBadge>Crypto</NeutralBadge>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="hidden md:flex items-center gap-2 mb-2">
                        <StandbyBadge />
                        <NeutralBadge>Crypto</NeutralBadge>
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-1.5 tracking-tight">Reversal Engine</h3>
                      <p className="text-neutral-400 text-sm leading-relaxed max-w-2xl">
                        AI system detecting high-probability price reversals on SOL and BTC in real-time. Signals delivered and executed automatically via Telegram.
                      </p>
                    </div>
                    <div className="flex-shrink-0 hidden md:flex flex-col gap-2 items-end min-w-[140px]">
                      {[{ l: 'Assets', v: 'SOL · BTC' }, { l: 'Timeframe', v: '15m' }, { l: 'Execution', v: 'Auto' }].map((s) => (
                        <div key={s.l} className="text-right">
                          <div className="text-white font-medium text-sm font-mono">{s.v}</div>
                          <div className="text-neutral-500 text-[10px] uppercase tracking-wider">{s.l}</div>
                        </div>
                      ))}
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-neutral-600 group-hover:text-white transition-colors flex-shrink-0" />
                  </div>
                </motion.div>
              </Link>

              {/* SHAHMAT */}
              <Link to="/shahmat" className="block group">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="relative bg-[#0a0a0a] rounded-xl p-6 border border-white/10 hover:border-white/20 transition-colors duration-200"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className="flex-shrink-0 flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                        <span className="text-2xl">♟️</span>
                      </div>
                      <div className="flex flex-col gap-1.5 md:hidden">
                        <NeutralBadge>Python Package</NeutralBadge>
                        <NeutralBadge>Free</NeutralBadge>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="hidden md:flex items-center gap-2 mb-2">
                        <NeutralBadge>Python Package</NeutralBadge>
                        <NeutralBadge>Free</NeutralBadge>
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-1.5 tracking-tight">ShahMat · Chess.com Analytics</h3>
                      <p className="text-neutral-400 text-sm leading-relaxed max-w-2xl">
                        Pull your Chess.com games, dissect your patterns by hour, Elo gap, and color — all in one Python call.
                      </p>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-neutral-600 group-hover:text-white transition-colors flex-shrink-0 md:ml-auto" />
                  </div>
                </motion.div>
              </Link>
            </div>
          </div>
        </section>

        {/* Knowledge Hub */}
        <section id="knowledge-hub" className="py-32 relative">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <p className="text-xs font-mono text-neutral-500 uppercase tracking-[0.2em] mb-3">Knowledge Hub</p>
              <h2 className="text-4xl md:text-5xl font-semibold text-white tracking-tight mb-4">
                Free, in French, no fluff.
              </h2>
              <p className="text-neutral-400 text-lg max-w-2xl leading-relaxed">
                Courses and tutorials on Machine Learning, Python, and Algorithmic Trading. Real datasets, practical implementations.
              </p>
            </motion.div>

            <FlippingCourseCard />
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="py-32">
          <div className="max-w-4xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <p className="text-xs font-mono text-neutral-500 uppercase tracking-[0.2em] mb-3">Contact</p>
              <h2 className="text-4xl md:text-5xl font-semibold text-white tracking-tight mb-4">
                Let's talk.
              </h2>
              <p className="text-neutral-400 text-lg max-w-2xl leading-relaxed">
                Collaborations, commissioned work, or just a conversation about your data.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-3">
              <motion.a
                href="mailto:anthony@agalgolab.com"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                viewport={{ once: true }}
                className="group bg-[#0a0a0a] rounded-xl p-6 border border-white/10 hover:border-white/20 transition-colors duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-neutral-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-neutral-500 text-xs font-mono uppercase tracking-wider mb-0.5">Email</p>
                    <p className="text-white font-medium text-sm truncate">anthony@agalgolab.com</p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-neutral-600 group-hover:text-white transition-colors" />
                </div>
              </motion.a>

              <motion.a
                href="https://www.linkedin.com/in/anthony-gocmen"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 }}
                viewport={{ once: true }}
                className="group bg-[#0a0a0a] rounded-xl p-6 border border-white/10 hover:border-white/20 transition-colors duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                    <Linkedin className="w-5 h-5 text-neutral-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-neutral-500 text-xs font-mono uppercase tracking-wider mb-0.5">LinkedIn</p>
                    <p className="text-white font-medium text-sm truncate">anthony-gocmen</p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-neutral-600 group-hover:text-white transition-colors" />
                </div>
              </motion.a>
            </div>
          </div>
        </section>

        {/* Footer */}
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
