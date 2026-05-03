import { Routes, Route, Link } from 'react-router-dom';
import ShahMat from "./pages/ShahMat"; 
import FraudRiskScoring from "./pages/FraudRiskScoring";
import SolverBet from "./pages/SolverBet";
import MLbet from "./pages/MLbet";
import ReversalEngine from "./pages/ReversalEngine";
import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Linkedin, Mail, ChevronDown, ExternalLink, Play, ArrowRight, ArrowUpRight, Check} from 'lucide-react';
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
/* ================================================================
   AG ALGO LAB — ServicesSection v2
   Drop-in replacement for the existing ServicesSection() function.
   FraudGrid() and the helper badges (LiveBadge, NeutralBadge, etc.)
   stay exactly as they are in your App.jsx.
   ================================================================ */


/* ================= SERVICES SECTION ================= */
function ServicesSection() {
  const [demoOpen, setDemoOpen] = useState(false);
  const [pricingOpen, setPricingOpen] = useState(false);
  const [fraudOpen, setFraudOpen] = useState(false);

  return (
    <section id="services" className="py-32 relative">
      <div className="max-w-6xl mx-auto px-6">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <p className="text-xs font-mono text-neutral-500 uppercase tracking-[0.2em] mb-3">Services</p>
          <h2 className="text-4xl md:text-5xl font-semibold text-white tracking-tight">
            See further. Act sooner.
          </h2>
        </motion.div>

        {/* SERVICE 1 — Predictive Analytics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-6"
        >
          <div className="bg-[#0a0a0a] rounded-xl border border-blue-500/35 overflow-hidden">
            <div className="p-8 pb-6">

              {/* Title + intro */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold text-white mb-2 tracking-tight">
                  Predictive Analytics & Forecasting
                </h3>
                <p className="text-neutral-400 text-sm leading-relaxed max-w-2xl">
                  Turn your historical data into a foresight engine. Revenue, demand, claims, cash flow.
                  Forecast what matters{' '}
                  <span className="text-white font-semibold">
                    with statistics or machine learning, depending on what fits your data best.
                  </span>
                </p>
              </div>

              {/* Showcase: Excel sheet + Python animation + action buttons */}
              <ForecastingShowcase
                onSeeExample={() => setDemoOpen(true)}
                onSeePricing={() => setPricingOpen(true)}
              />

              {/* Deliverables footer */}
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

        {/* SERVICE 2 — Fraud (unchanged) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <div className="bg-[#0a0a0a] rounded-xl border border-blue-500/35 overflow-hidden">
            <div className="p-8 pb-6">
              <div className="mb-6">
                <h3 className="text-2xl font-semibold text-white mb-2 tracking-tight">
                  Fraud & Anomaly Detection
                </h3>
              </div>
              <FraudGrid />
            </div>
          </div>
        </motion.div>

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

      {/* ───────── DEMO MODAL — Statistical only ───────── */}
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
              <div className="flex items-center gap-3">
                <NeutralBadge>Case study</NeutralBadge>
                <span className="text-neutral-500 text-[11px] font-mono">Statistical Forecasting</span>
              </div>
              <button
                onClick={() => setDemoOpen(false)}
                className="text-neutral-500 hover:text-white transition-colors text-lg leading-none w-8 h-8 flex items-center justify-center"
              >
                &#x2715;
              </button>
            </div>

            <div className="p-6 md:p-8 space-y-6">
              <div className="flex flex-wrap gap-2">
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
                    setTimeout(() => {
                      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                    }, 200);
                  }}
                  className="group inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white hover:bg-neutral-200 text-black text-sm font-medium transition-colors duration-150"
                >
                  Discuss your project
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* ───────── PRICING MODAL ───────── */}
      {pricingOpen && (
        <PricingModal onClose={() => setPricingOpen(false)} />
      )}

      {/* ───────── FRAUD MODAL (unchanged) ───────── */}
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
            className="relative bg-[#0a0a0a] rounded-xl border border-white/10 w-full max-w-3xl max-h-[92vh] overflow-y-auto z-10"
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
            <div className="p-5">
              <FraudGrid />
            </div>
          </motion.div>
        </div>
      )}

    </section>
  );
}

/* ================================================================
   FORECASTING SHOWCASE — Excel sheet + Python code animation
   ================================================================ */
function ForecastingShowcase({ onSeeExample, onSeePricing }) {
  // Phase machine: typing → typed → moving → clicking → output → holding → reset
  const [phase, setPhase] = useState('typing');
  const [typedChars, setTypedChars] = useState(0);
  const [cursorPos, setCursorPos] = useState({ x: 22, y: 70 });
  const [runActive, setRunActive] = useState(false);

  const codeText = `import pandas as pd
from statsforecast import StatsForecast
from statsforecast.models import CES

df = pd.read_csv("revenue.csv")
df.columns = ["ds", "y"]
df["unique_id"] = "client_01"

sf = StatsForecast(
    models=[CES(season_length=12)],
    freq="MS"
)
sf.fit(df)

forecast = sf.predict(h=6, level=[80, 95])`;

  const tokens = tokenizePython(codeText);

  // Phase orchestration
  useEffect(() => {
    let timer;

    if (phase === 'typing') {
      if (typedChars < codeText.length) {
        timer = setTimeout(() => setTypedChars((c) => c + 1), 22);
      } else {
        timer = setTimeout(() => setPhase('typed'), 600);
      }
    } else if (phase === 'typed') {
      timer = setTimeout(() => {
        setCursorPos({ x: 91, y: 9 });
        setPhase('moving');
      }, 400);
    } else if (phase === 'moving') {
      timer = setTimeout(() => {
        setRunActive(true);
        setPhase('clicking');
      }, 950);
    } else if (phase === 'clicking') {
      timer = setTimeout(() => {
        setRunActive(false);
        setPhase('output');
      }, 280);
    } else if (phase === 'output') {
      timer = setTimeout(() => setPhase('holding'), 3500);
    } else if (phase === 'holding') {
      timer = setTimeout(() => setPhase('reset'), 2800);
    } else if (phase === 'reset') {
      setCursorPos({ x: 22, y: 70 });
      timer = setTimeout(() => {
        setTypedChars(0);
        setPhase('typing');
      }, 700);
    }

    return () => clearTimeout(timer);
  }, [phase, typedChars, codeText.length]);

  const visibleTokens = sliceTokens(tokens, typedChars);
  const showOutput = phase === 'output' || phase === 'holding';
  const dataPulse = phase === 'output' || phase === 'clicking';

  return (
    <div className="grid md:grid-cols-12 gap-3 mb-2">
      {/* ───── EXCEL ───── */}
      <div className="md:col-span-5">
        <ExcelSheet pulse={dataPulse} />
      </div>

      {/* ───── PYTHON ───── */}
      <div className="md:col-span-5 relative">
        <PythonEditor
          tokens={visibleTokens}
          showCaret={phase === 'typing' || phase === 'typed'}
          runActive={runActive}
          showOutput={showOutput}
        />

        {/* Animated cursor (desktop only — pointer makes no sense on touch) */}
        <div
          className="hidden md:block absolute pointer-events-none transition-all duration-700 ease-[cubic-bezier(0.4,0.2,0.2,1)] z-30"
          style={{
            left: `${cursorPos.x}%`,
            top: `${cursorPos.y}%`,
            opacity: phase === 'output' || phase === 'holding' || phase === 'reset' ? 0 : 1,
            transform: phase === 'clicking' ? 'scale(0.85)' : 'scale(1)',
          }}
        >
          <CursorIcon />
        </div>
      </div>

      {/* ───── BUTTONS ───── */}
      <div className="md:col-span-2 flex md:flex-col gap-3 justify-center md:justify-center">
        <button
          onClick={onSeeExample}
          className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-lg bg-white/[0.06] border border-white/15 text-xs font-mono text-white/80 hover:text-white hover:bg-white/10 hover:border-white/25 transition-all duration-150"
        >
          See example
          <ArrowRight className="w-3 h-3" />
        </button>
        <button
          onClick={onSeePricing}
          className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-lg bg-blue-500/10 border border-blue-500/30 text-xs font-mono text-blue-300 hover:text-blue-200 hover:bg-blue-500/15 hover:border-blue-500/50 transition-all duration-150"
        >
          See pricing
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

/* ================= EXCEL SHEET ================= */
function ExcelSheet({ pulse }) {
  const rows = [
    ['2024-01-01', '142', '€8,540'],
    ['2024-02-01', '156', '€9,360'],
    ['2024-03-01', '168', '€10,080'],
    ['2024-04-01', '175', '€10,500'],
    ['2024-05-01', '189', '€11,340'],
    ['2024-06-01', '203', '€12,180'],
  ];

  return (
    <div
      className="bg-white rounded-md overflow-hidden shadow-2xl border border-black/20 transition-all duration-500"
      style={{
        boxShadow: pulse
          ? '0 0 0 1px rgba(59,130,246,0.4), 0 20px 50px -10px rgba(59,130,246,0.25)'
          : '0 20px 50px -10px rgba(0,0,0,0.5)',
      }}
    >
      {/* Title bar */}
      <div className="bg-[#217346] text-white px-3 py-1.5 flex items-center gap-2 text-[11px]">
        <div className="w-3 h-3 rounded-sm bg-white/20 flex items-center justify-center font-bold text-[8px]">X</div>
        <span className="font-medium">revenue.xlsx</span>
        <span className="text-white/60">— Excel</span>
      </div>

      {/* Ribbon stub */}
      <div className="bg-[#f3f2f1] border-b border-[#d4d4d4] px-3 py-1 flex gap-3 text-[10px] text-[#444]">
        <span className="border-b-2 border-[#217346] pb-0.5 text-[#217346] font-medium">Home</span>
        <span>Insert</span>
        <span>Data</span>
        <span>Formulas</span>
        <span>View</span>
      </div>

      {/* Formula bar */}
      <div className="bg-white border-b border-[#d4d4d4] px-2 py-1 flex items-center gap-2 text-[11px]">
        <div className="px-1.5 py-0.5 bg-white border border-[#d4d4d4] rounded text-[#444] font-mono w-12 text-center">A1</div>
        <div className="text-[#888] italic font-mono">fx</div>
        <div className="flex-1 px-1.5 py-0.5 bg-white border border-[#d4d4d4] rounded text-[#444] font-mono">Date</div>
      </div>

      {/* Sheet with bottom fade */}
      <div className="relative bg-white">
        <div className="overflow-x-auto bg-white">
          <table className="w-full border-collapse text-[11px] font-mono">
            <thead>
              <tr>
                <th className="bg-[#f3f2f1] border border-[#d4d4d4] text-[#666] font-normal w-7 h-5"></th>
                {['A', 'B', 'C'].map((c) => (
                  <th key={c} className="bg-[#f3f2f1] border border-[#d4d4d4] text-[#666] font-normal text-center min-w-[110px] h-5">
                    {c}
                  </th>
                ))}
              </tr>
              <tr>
                <td className="bg-[#f3f2f1] border border-[#d4d4d4] text-[#666] text-center text-[10px] font-normal">1</td>
                <td className="bg-[#f3f2f1] border border-[#d4d4d4] px-2 py-1 font-semibold text-[#222]">Date</td>
                <td className="bg-[#f3f2f1] border border-[#d4d4d4] px-2 py-1 font-semibold text-[#222]">Units Sold</td>
                <td className="bg-[#f3f2f1] border border-[#d4d4d4] px-2 py-1 font-semibold text-[#222]">Sales</td>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i}>
                  <td className="bg-[#f3f2f1] border border-[#d4d4d4] text-[#666] text-center text-[10px]">{i + 2}</td>
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      className="border border-[#d4d4d4] px-2 py-1 text-[#222] transition-colors duration-300"
                      style={{
                        background: pulse && j === 0 ? '#dbeafe' : 'white',
                      }}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
              {/* Empty rows hint that there is more data below */}
              {[0].map((i) => (
                <tr key={`empty-${i}`}>
                  <td className="bg-[#f3f2f1] border border-[#d4d4d4] text-[#666] text-center text-[10px]">{rows.length + i + 2}</td>
                  <td className="border border-[#d4d4d4] px-2 py-1 h-[22px]"></td>
                  <td className="border border-[#d4d4d4] px-2 py-1 h-[22px]"></td>
                  <td className="border border-[#d4d4d4] px-2 py-1 h-[22px]"></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Fade overlay at bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.95) 80%, white 100%)',
          }}
        />
      </div>
      {/* Sheet tabs */}
      <div className="bg-[#f3f2f1] border-t border-[#d4d4d4] px-2 py-1 flex items-center gap-1 text-[10px] text-[#444]">
        <div className="px-2 py-0.5 bg-white border border-[#d4d4d4] border-b-white rounded-t font-medium">Sheet1</div>
        <div className="px-2 py-0.5 text-[#888]">+</div>
      </div>
    </div>
  );
}

/* ================= PYTHON EDITOR ================= */
function PythonEditor({ tokens, showCaret, runActive, showOutput }) {
  const lines = renderLines(tokens);

  return (
    <div className="bg-[#1e1e1e] rounded-md overflow-hidden border border-white/10 shadow-2xl">
      {/* VS Code title bar */}
      <div className="bg-[#323233] px-3 py-1.5 flex items-center justify-between border-b border-black/40">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#28c940]" />
          </div>
          <span className="ml-2 text-[#cccccc] text-[11px] font-mono">forecast.py</span>
        </div>
        {/* Run button */}
        <button
          className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono transition-all duration-150"
          style={{
            background: runActive ? 'rgba(34,197,94,0.35)' : 'rgba(34,197,94,0.12)',
            color: runActive ? '#86efac' : '#4ade80',
            border: runActive ? '1px solid rgba(74,222,128,0.6)' : '1px solid rgba(34,197,94,0.25)',
            transform: runActive ? 'scale(0.95)' : 'scale(1)',
          }}
        >
          <Play className="w-2.5 h-2.5 fill-current" />
          Run
        </button>
      </div>

      {/* Code area */}
      <div className="font-mono text-[11px] leading-[1.65] bg-[#1e1e1e] py-3 min-h-[260px] relative">
        <table className="border-collapse">
          <tbody>
            {lines.map((line, idx) => (
              <tr key={idx}>
                <td className="text-[#858585] text-right pr-3 pl-3 select-none w-8 align-top">
                  {line.length === 0 && idx === lines.length - 1 ? '' : idx + 1}
                </td>
                <td className="pr-3 align-top">
                  {line.map((tok, j) => (
                    <span key={j} style={{ color: tokenColor(tok.type) }}>
                      {tok.text}
                    </span>
                  ))}
                  {showCaret && idx === lines.length - 1 && (
                    <span className="inline-block w-[6px] h-[12px] bg-[#d4d4d4] align-middle ml-[1px] animate-pulse" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Output overlay (forecast chart) */}
        <div
          className="absolute inset-x-0 bottom-0 transition-all duration-700 ease-out"
          style={{
            height: showOutput ? '160px' : '0px',
            opacity: showOutput ? 1 : 0,
            background: 'linear-gradient(to top, #1e1e1e 60%, rgba(30,30,30,0.95) 100%)',
            borderTop: showOutput ? '1px solid rgba(74,222,128,0.25)' : '1px solid transparent',
          }}
        >
          <ForecastChart active={showOutput} />
        </div>
      </div>
    </div>
  );
}

/* ================= FORECAST CHART (animated SVG output) ================= */
function ForecastChart({ active }) {
  // Historical values (10 points) + forecast (6 points)
  const historical = [142, 156, 168, 175, 189, 203, 218, 195, 224, 241];
  const forecast = [255, 248, 238, 261, 273, 285];

  const all = [...historical, ...forecast];
  const minV = Math.min(...all) - 30;
  const maxV = Math.max(...all) + 30;
  const W = 320, H = 110, PAD = 6;

  const xStep = (W - PAD * 2) / (all.length - 1);
  const scaleY = (v) => H - PAD - ((v - minV) / (maxV - minV)) * (H - PAD * 2);
  const histPoints = historical.map((v, i) => `${PAD + i * xStep},${scaleY(v)}`).join(' ');
  const fcPoints = [
    `${PAD + (historical.length - 1) * xStep},${scaleY(historical[historical.length - 1])}`,
    ...forecast.map((v, i) => `${PAD + (historical.length + i) * xStep},${scaleY(v)}`)
  ].join(' ');

  // 95% CI shaded area
  const ciLower = forecast.map((v) => v * 0.88);
  const ciUpper = forecast.map((v) => v * 1.12);

  const ciPath = (() => {
    const anchor = `${PAD + (historical.length - 1) * xStep},${scaleY(historical[historical.length - 1])}`;
    const upper = [
      anchor,
      ...ciUpper.map((v, i) => `${PAD + (historical.length + i) * xStep},${scaleY(v)}`)
    ];
    const lower = ciLower.map((v, i) => `${PAD + (historical.length + i) * xStep},${scaleY(v)}`).reverse();
    return `M ${upper.join(' L ')} L ${lower.join(' L ')} Z`;
  })();

  return (
    <div className="px-3 pt-2 pb-1 h-full flex flex-col">
      <div className="text-[9px] font-mono text-[#858585] mb-1 flex items-center justify-between">
        <span><span className="text-[#4ec9b0]">Out[1]:</span> forecast.head(6)</span>
        <span className="text-[#6a9955]"># MAPE: 2.7%</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full flex-1" preserveAspectRatio="none">
        <defs>
          <linearGradient id="histGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid */}
        {[0.25, 0.5, 0.75].map((p) => (
          <line key={p} x1={PAD} x2={W - PAD} y1={PAD + (H - PAD * 2) * p} y2={PAD + (H - PAD * 2) * p}
            stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
        ))}

        {/* CI area */}
        <path
          d={ciPath}
          fill="rgba(74,222,128,0.12)"
          style={{
            opacity: active ? 1 : 0,
            transition: 'opacity 1.2s ease 0.6s',
          }}
        />

        {/* Historical line */}
        <polyline
          points={histPoints}
          fill="none"
          stroke="#60a5fa"
          strokeWidth="1.8"
          strokeLinejoin="round"
          strokeLinecap="round"
          style={{
            strokeDasharray: 1000,
            strokeDashoffset: active ? 0 : 1000,
            transition: 'stroke-dashoffset 1.4s ease',
          }}
        />


        {/* Forecast line */}
        <polyline
          points={fcPoints}
          fill="none"
          stroke="#4ade80"
          strokeWidth="1.8"
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeDasharray="4,2"
          style={{
            strokeDasharray: 600,
            strokeDashoffset: active ? 0 : 600,
            transition: 'stroke-dashoffset 1.6s ease 0.8s',
          }}
        />

        {/* Forecast points */}
        {forecast.map((v, i) => (
          <circle
            key={i}
            cx={PAD + (historical.length + i) * xStep}
            cy={scaleY(v)}
            r="2"
            fill="#4ade80"
            style={{
              opacity: active ? 1 : 0,
              transition: `opacity 0.4s ease ${1.2 + i * 0.12}s`,
            }}
          />
        ))}

        {/* Vertical separator (forecast start) */}
        <line
          x1={PAD + (historical.length - 1) * xStep}
          x2={PAD + (historical.length - 1) * xStep}
          y1={PAD}
          y2={H - PAD}
          stroke="rgba(74,222,128,0.3)"
          strokeWidth="0.8"
          strokeDasharray="2,2"
          style={{
            opacity: active ? 1 : 0,
            transition: 'opacity 0.5s ease 0.4s',
          }}
        />
      </svg>
    </div>
  );
}

/* ================= CURSOR ICON ================= */
function CursorIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.6))' }}>
      <path
        d="M3 2 L17 11 L11 12 L14 18 L11 19 L8 13 L3 16 Z"
        fill="white"
        stroke="black"
        strokeWidth="0.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ================= PYTHON TOKENIZER ================= */
function tokenizePython(code) {
  const keywords = new Set(['import', 'from', 'as', 'def', 'return', 'if', 'else', 'for', 'in', 'class', 'lambda', 'with', 'try', 'except']);
  const builtins = new Set(['pd', 'np', 'StatsForecast', 'CES', 'pandas', 'statsforecast']);
  const tokens = [];
  let i = 0;

  while (i < code.length) {
    const c = code[i];

    // Comment
    if (c === '#') {
      let j = i;
      while (j < code.length && code[j] !== '\n') j++;
      tokens.push({ type: 'comment', text: code.slice(i, j) });
      i = j;
      continue;
    }
    // String
    if (c === '"' || c === "'") {
      let j = i + 1;
      while (j < code.length && code[j] !== c) j++;
      tokens.push({ type: 'string', text: code.slice(i, j + 1) });
      i = j + 1;
      continue;
    }
    // Identifier
    if (/[a-zA-Z_]/.test(c)) {
      let j = i;
      while (j < code.length && /[a-zA-Z0-9_]/.test(code[j])) j++;
      const word = code.slice(i, j);
      let type = 'plain';
      if (keywords.has(word)) type = 'keyword';
      else if (builtins.has(word)) type = 'builtin';
      else if (code[j] === '(') type = 'function';
      tokens.push({ type, text: word });
      i = j;
      continue;
    }
    // Number
    if (/\d/.test(c)) {
      let j = i;
      while (j < code.length && /[\d.]/.test(code[j])) j++;
      tokens.push({ type: 'number', text: code.slice(i, j) });
      i = j;
      continue;
    }
    // Anything else
    tokens.push({ type: 'plain', text: c });
    i++;
  }
  return tokens;
}

function sliceTokens(tokens, charLimit) {
  const out = [];
  let count = 0;
  for (const t of tokens) {
    if (count >= charLimit) break;
    if (count + t.text.length <= charLimit) {
      out.push(t);
      count += t.text.length;
    } else {
      out.push({ ...t, text: t.text.slice(0, charLimit - count) });
      count = charLimit;
      break;
    }
  }
  return out;
}

function renderLines(tokens) {
  // Split tokens by newlines into per-line arrays
  const lines = [[]];
  for (const t of tokens) {
    const parts = t.text.split('\n');
    for (let k = 0; k < parts.length; k++) {
      if (parts[k].length > 0) {
        lines[lines.length - 1].push({ ...t, text: parts[k] });
      }
      if (k < parts.length - 1) {
        lines.push([]);
      }
    }
  }
  return lines;
}

function tokenColor(type) {
  switch (type) {
    case 'keyword':  return '#c586c0';
    case 'string':   return '#ce9178';
    case 'comment':  return '#6a9955';
    case 'number':   return '#b5cea8';
    case 'function': return '#dcdcaa';
    case 'builtin':  return '#4ec9b0';
    default:         return '#d4d4d4';
  }
}

/* ================================================================
   PRICING MODAL
   ================================================================ */
function PricingModal({ onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="relative bg-[#0a0a0a] rounded-xl border border-white/10 w-full max-w-5xl max-h-[92vh] overflow-y-auto z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-20 bg-[#0a0a0a]/95 backdrop-blur-md flex items-center justify-between px-6 py-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <NeutralBadge>Pricing</NeutralBadge>
            <span className="text-neutral-500 text-[11px] font-mono">Predictive Analytics & Forecasting</span>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-white transition-colors text-lg leading-none w-8 h-8 flex items-center justify-center"
          >
            &#x2715;
          </button>
        </div>

        <div className="p-6 md:p-8">
          {/* Disclaimer */}
          <div className="mb-6 px-4 py-3 rounded-lg bg-blue-500/[0.04] border border-blue-500/15">
            <p className="text-neutral-400 text-xs leading-relaxed">
              <span className="text-blue-300 font-medium">Note.</span>{' '}
              Final pricing depends on the specific scope of your project and the level of output you need.
              From a simple prediction file to a fully explainable production system, the deliverables shape the quote.
            </p>
          </div>

          {/* Two pricing cards */}
          <div className="grid md:grid-cols-2 gap-4">

            {/* ── STATISTICAL ── */}
            <div className="bg-black rounded-xl border border-green-500/30 p-6 flex flex-col">
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[10px] font-mono font-medium tracking-wide">
                    Entry tier
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-white tracking-tight mb-1">Statistical</h3>
                <p className="text-neutral-500 text-xs leading-relaxed">
                  For univariate series with clear seasonal or trend structure. Fast to deploy, fully interpretable.
                </p>
              </div>

              {/* Initial price */}
              <div className="mb-5 pb-5 border-b border-white/[0.06]">
                <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 block mb-2">
                  Initial Price
                </span>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-4xl font-semibold text-white font-mono">€950</span>
                  <span className="text-neutral-500 text-xs">one-time</span>
                </div>
                <p className="text-neutral-500 text-xs">First 6-month forecast horizon</p>

                <ul className="mt-4 space-y-2">
                  {[
                    'Optimal model selection (CES, ETS, ARIMA, Theta)',
                    '6-month forecast horizon',
                    '80% and 95% confidence intervals',
                    'Free monthly adjustments with your fresh data, for the 6 months',
                    'Performance report (MAPE, MAE, MASE)',
                  ].map((item, i) => (
                    <CheckItem key={i}>{item}</CheckItem>
                  ))}
                </ul>
              </div>

              {/* Continuation */}
              <div className="flex-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 block mb-2">
                  Continuation
                </span>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-2xl font-semibold text-white font-mono">€250</span>
                  <span className="text-neutral-500 text-xs">/ month</span>
                </div>
                <p className="text-neutral-500 text-xs">Optional, after the initial 6 months</p>

                <ul className="mt-4 space-y-2">
                  {[
                    'Each month: model adjusted with your latest data',
                    'Rolling 6-month horizon, always projecting 6 months ahead',
                    'Continuous performance monitoring',
                    'Cancel anytime',
                  ].map((item, i) => (
                    <CheckItem key={i}>{item}</CheckItem>
                  ))}
                </ul>
              </div>
            </div>

            {/* ── MACHINE LEARNING ── */}
            <div className="bg-black rounded-xl border border-blue-500/30 p-6 flex flex-col relative overflow-hidden">
              {/* Subtle gradient corner */}

              <div className="mb-5 relative">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/25 text-blue-400 text-[10px] font-mono font-medium tracking-wide">
                    Custom scope
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-white tracking-tight mb-1">Machine Learning</h3>
                <p className="text-neutral-500 text-xs leading-relaxed">
                  For complex environments. Multi-product, multi-store, large feature spaces, external regressors,
                  and explainability requirements. Built around your data, end to end.
                </p>
              </div>

              {/* Initial price */}
              <div className="mb-5 pb-5 border-b border-white/[0.06] relative">
                <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 block mb-2">
                  Initial Price
                </span>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-3xl font-semibold text-white font-mono">On request</span>
                </div>
                <p className="text-neutral-500 text-xs">Quote based on data complexity and target output</p>

                <ul className="mt-4 space-y-2">
                  {[
                    'Tailored feature engineering on your data',
                    'CatBoost, LightGBM, or MLForecast pipelines',
                    'Walk-forward validation on real out-of-sample data',
                    'Hyperparameter tuning with Optuna',
                    'Optional SHAP-based explainability for every prediction',
                    'Production-ready code, fully documented',
                  ].map((item, i) => (
                    <CheckItem key={i} accent>{item}</CheckItem>
                  ))}
                </ul>
              </div>

              {/* Continuation */}
              <div className="flex-1 relative">
                <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 block mb-2">
                  Continuation
                </span>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-2xl font-semibold text-white font-mono">Custom</span>
                  <span className="text-neutral-500 text-xs">monthly retainer</span>
                </div>
                <p className="text-neutral-500 text-xs">Scaled to the size and frequency of your pipeline</p>

                <ul className="mt-4 space-y-2">
                  {[
                    'Model retraining on your schedule',
                    'Drift monitoring and alerts',
                    'API or dashboard delivery, automated reports',
                    'Direct support and iteration cycles',
                  ].map((item, i) => (
                    <CheckItem key={i} accent>{item}</CheckItem>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-6 px-5 py-4 rounded-lg bg-white/[0.02] border border-white/[0.06] flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <p className="text-white font-medium text-sm mb-1">Initial price kept low on purpose.</p>
              <p className="text-neutral-400 text-xs leading-relaxed">
                The goal is for you to see the model perform on your data first. The continuation is only worth taking
                once the value is proven.
              </p>
            </div>
            <button
              onClick={() => {
                onClose();
                setTimeout(() => {
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                }, 200);
              }}
              className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white hover:bg-neutral-200 text-black text-sm font-medium transition-colors duration-150"
            >
              Discuss your project
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ================= CHECK ITEM ================= */
function CheckItem({ children, accent = false }) {
  return (
    <li className="flex items-start gap-2.5">
      <span
        className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center mt-0.5"
        style={{
          background: accent ? 'rgba(59,130,246,0.15)' : 'rgba(34,197,94,0.12)',
          border: accent ? '1px solid rgba(59,130,246,0.3)' : '1px solid rgba(34,197,94,0.25)',
        }}
      >
        <Check className="w-2.5 h-2.5" style={{ color: accent ? '#60a5fa' : '#4ade80' }} strokeWidth={3} />
      </span>
      <span className="text-neutral-300 text-xs leading-relaxed">{children}</span>
    </li>
  );
}


// ================================================================
// FRAUD GRID v2 — remplace le composant FraudGrid() dans App.jsx
// ================================================================

function FraudGrid() {
  const [step, setStep] = useState(0);
  const [rawProba, setRawProba] = useState(0.73);
  const [calibratedProba, setCalibratedProba] = useState(0.18);
  const [treeValues, setTreeValues] = useState({
    feature1: "claim_amount", threshold1: "5000",
    feature2: "policy_age",   threshold2: "2",
    leaves: ["0.15", "0.22", "0.58", "0.87"],
  });

  const featurePool = [
    { name: "claim_amount",  thresholds: ["3000","5000","7500","10000"] },
    { name: "policy_age",    thresholds: ["1","2","3","5"] },
    { name: "vehicle_age",   thresholds: ["3","5","7","10"] },
    { name: "num_claims",    thresholds: ["0","1","2","3"] },
  ];

  useEffect(() => {
    const run = () => {
      const nr = +(Math.random() * 0.5 + 0.35).toFixed(2);
      const nc = +(nr * (0.25 + Math.random() * 0.25)).toFixed(3);
      const f1 = featurePool[Math.floor(Math.random() * featurePool.length)];
      const f2 = featurePool[Math.floor(Math.random() * featurePool.length)];
      setTreeValues({
        feature1: f1.name,
        threshold1: f1.thresholds[Math.floor(Math.random() * f1.thresholds.length)],
        feature2: f2.name,
        threshold2: f2.thresholds[Math.floor(Math.random() * f2.thresholds.length)],
        leaves: [
          (Math.random() * 0.3 + 0.05).toFixed(2),
          (Math.random() * 0.3 + 0.25).toFixed(2),
          (Math.random() * 0.3 + 0.45).toFixed(2),
          (Math.random() * 0.25 + 0.70).toFixed(2),
        ],
      });
      setStep(0);
      setTimeout(() => setStep(1), 600);
      setTimeout(() => { setStep(2); setRawProba(nr); }, 3500);
      setTimeout(() => { setStep(3); setCalibratedProba(nc); }, 6500);
    };
    run();
    const id = setInterval(run, 11000);
    return () => clearInterval(id);
  }, []);

  const riskColor =
    calibratedProba > 0.40 ? "#ef4444" :
    calibratedProba > 0.20 ? "#f97316" :
    calibratedProba > 0.08 ? "#eab308" : "#22c55e";
  const riskLabel =
    calibratedProba > 0.40 ? "HIGH" :
    calibratedProba > 0.20 ? "MEDIUM" :
    calibratedProba > 0.08 ? "LOW" : "SAFE";

  const orbitTags = [
    { label: "Claim Amount",  color: "#60a5fa" },
    { label: "Policy Age",    color: "#4ade80" },
    { label: "Vehicle Price", color: "#a78bfa" },
    { label: "Nb. Claims",    color: "#f87171" },
    { label: "Accident Area", color: "#fb923c" },
    { label: "Vehicle Type",  color: "#a78bfa" },
    { label: "Witness",       color: "#f87171" },
    { label: "Police Report", color: "#60a5fa" },
  ];

  return (
    <>
      <style>{`
        @keyframes orbit-fraud {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes counter-orbit-fraud {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.6; }
          50%       { opacity: 1; }
        }
      `}</style>

      {/* ── DESKTOP 2×2 ── */}
      <div className="hidden md:grid grid-cols-2 gap-px bg-white/[0.06] rounded-xl overflow-hidden border border-white/[0.06]">

        {/* ── Q1 upper-left — Service text ── */}
        <div className="bg-[#0a0a0a] p-7 flex flex-col justify-between gap-6 min-h-[300px]">
          <div className="space-y-4 text-sm leading-relaxed">
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-600">
              How it works
            </p>
            <p className="text-neutral-400">
              Each incoming claim scored by fraud probability, so your team focuses
              time and money <span className="text-white font-medium">where it actually counts.</span>
            </p>
            <p className="text-neutral-400">
              Every claim enters the pipeline as raw features. A{' '}
              <span className="text-white font-medium">CatBoost ensemble</span> scores it,{' '}
              <span className="text-white font-medium">isotonic calibration</span> converts
              the raw score into a real probability — and your team gets a ranked list,
              not guesswork.
            </p>
            <p className="text-neutral-400">
              The real craft is upstream —{' '}
              <span className="text-white font-medium">feature engineering</span>,{' '}
              <span className="text-white font-medium">model tuning</span> via modern
              optimization methods,{' '}
              <span className="text-white font-medium">variable importance</span> analysis,
              and much more. Every pipeline is built around your data, not a generic template.
            </p>
          </div>
        </div>

        {/* ── Q2 upper-right — Orbit inputs ── */}
        <div
          className="bg-[#0a0a0a] p-7 flex flex-col items-center justify-center min-h-[300px]"
          style={{
            borderLeft: step >= 1
              ? '1px solid rgba(96,165,250,0.2)'
              : '1px solid rgba(255,255,255,0.06)',
            transition: 'border-color 1s ease',
          }}
        >
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-600 mb-5 self-start">
            Claim Features
          </p>

          {/* Orbit widget */}
          <div className="relative" style={{ width: 220, height: 220 }}>
            {/* Glow */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: step >= 1
                  ? 'radial-gradient(circle, rgba(96,165,250,0.08) 0%, transparent 70%)'
                  : 'transparent',
                transition: 'background 1.2s ease',
              }}
            />

            {/* Orbit ring */}
            <div
              className="absolute rounded-full border"
              style={{
                inset: 20,
                borderColor: step >= 1 ? 'rgba(96,165,250,0.15)' : 'rgba(255,255,255,0.06)',
                transition: 'border-color 1s ease',
              }}
            />
            <div
              className="absolute rounded-full border border-dashed"
              style={{
                inset: 42,
                borderColor: step >= 1 ? 'rgba(96,165,250,0.08)' : 'rgba(255,255,255,0.04)',
                transition: 'border-color 1s ease',
              }}
            />

            {/* Center node */}
            <div
              className="absolute rounded-xl flex items-center justify-center"
              style={{
                width: 64, height: 64,
                top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                background: step >= 1 ? 'rgba(96,165,250,0.1)' : 'rgba(255,255,255,0.04)',
                border: step >= 1 ? '1px solid rgba(96,165,250,0.3)' : '1px solid rgba(255,255,255,0.08)',
                transition: 'all 1s ease',
              }}
            >
              <span
                className="text-xs font-mono font-semibold text-center leading-tight"
                style={{
                  color: step >= 1 ? '#93c5fd' : 'rgba(255,255,255,0.2)',
                  transition: 'color 1s ease',
                }}
              >
                Claim<br />Input
              </span>
            </div>

            {/* Spinning ring with tags */}
            <div
              className="absolute inset-0"
              style={{ animation: 'orbit-fraud 18s linear infinite' }}
            >
              {orbitTags.map((tag, i) => {
                const angle = (i / orbitTags.length) * 360;
                const rad = (angle * Math.PI) / 180;
                const r = 90;
                const x = Math.cos(rad) * r;
                const y = Math.sin(rad) * r;
                return (
                  <div
                    key={tag.label}
                    className="absolute"
                    style={{
                      top: '50%', left: '50%',
                      transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                    }}
                  >
                    <div
                      style={{ animation: 'counter-orbit-fraud 18s linear infinite' }}
                    >
                      <span
                        className="whitespace-nowrap text-[10px] font-mono px-2 py-1 rounded-full border"
                        style={{
                          borderColor: step >= 1 ? tag.color + '40' : 'rgba(255,255,255,0.08)',
                          color:       step >= 1 ? tag.color + 'cc' : 'rgba(255,255,255,0.2)',
                          background:  step >= 1 ? tag.color + '0f' : 'transparent',
                          transition:  'all 1.2s ease',
                        }}
                      >
                        {tag.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Arrow down */}
          <div
            className="mt-4 flex flex-col items-center gap-1"
            style={{ opacity: step >= 2 ? 1 : 0.15, transition: 'opacity 1s ease' }}
          >
            <div className="w-px h-6 bg-gradient-to-b from-blue-500/60 to-purple-500/60" />
            <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-t-[6px] border-l-transparent border-r-transparent border-t-purple-500/60" />
          </div>
        </div>

        {/* ── Q4 lower-left — Output ── */}
        {/* ── Q4 lower-left — Output ── */}
        <div
          className="bg-[#0a0a0a] p-7 flex flex-col min-h-[300px]"
          style={{
            borderTop: step >= 3
              ? '1px solid rgba(168,85,247,0.2)'
              : '1px solid rgba(255,255,255,0.06)',
            transition: 'border-color 1s ease',
          }}
        >
          {/* Label + arrow sur la même ligne */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-600">
              Isotonic Calibration → Risk Score
            </p>
            <div
              className="flex items-center gap-1"
              style={{ opacity: step >= 3 ? 1 : 0.15, transition: 'opacity 1s ease' }}
            >
              <div
                className="w-0 h-0 border-t-[5px] border-b-[5px] border-r-[6px] border-t-transparent border-b-transparent"
                style={{ borderRightColor: 'rgba(168,85,247,0.6)' }}
              />
              <div className="h-px w-8 bg-gradient-to-l from-purple-500/60 to-blue-500/30" />
            </div>
          </div>
        
          {/* Diagramme centré verticalement */}
          <div className="flex-1 flex items-center">
            <div className="flex items-center gap-3 w-full">
              <div
                className="flex flex-col items-center px-4 py-3 rounded-xl border"
                style={{
                  borderColor: step >= 3 ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)',
                  background: 'rgba(255,255,255,0.03)',
                  transition: 'all 1s ease',
                }}
              >
                <span className="text-[10px] text-neutral-600 font-mono mb-1">raw score</span>
                <span
                  className="font-mono text-lg font-semibold"
                  style={{
                    color: step >= 3 ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.1)',
                    transition: 'color 1s ease',
                  }}
                >
                  {rawProba.toFixed(2)}
                </span>
              </div>
        
              <div className="flex flex-col items-center gap-1">
                <span
                  className="text-xs font-mono"
                  style={{
                    color: step >= 3 ? 'rgba(168,85,247,0.6)' : 'rgba(255,255,255,0.1)',
                    transition: 'color 1s ease',
                  }}
                >
                  f(x)
                </span>
                <div
                  className="h-px w-8"
                  style={{
                    background: step >= 3
                      ? 'linear-gradient(to right, rgba(168,85,247,0.5), rgba(96,165,250,0.5))'
                      : 'rgba(255,255,255,0.08)',
                    transition: 'background 1s ease',
                  }}
                />
                <span style={{ color: step >= 3 ? 'rgba(168,85,247,0.4)' : 'rgba(255,255,255,0.06)', transition: 'color 1s ease', fontSize: 14 }}>→</span>
              </div>
        
              <div
                className="flex-1 flex flex-col items-center justify-center py-6 rounded-xl border"
                style={{
                  borderColor: step >= 3 ? riskColor + '50' : 'rgba(255,255,255,0.07)',
                  background:  step >= 3 ? riskColor + '10' : 'rgba(255,255,255,0.02)',
                  transition: 'all 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                <div
                  className="w-2 h-2 rounded-full mb-2"
                  style={{
                    background:  step >= 3 ? riskColor : 'rgba(255,255,255,0.15)',
                    boxShadow:   step >= 3 ? `0 0 8px ${riskColor}` : 'none',
                    animation:   step >= 3 ? 'pulse-glow 2s ease-in-out infinite' : 'none',
                    transition: 'all 1s ease',
                  }}
                />
                <span
                  className="font-mono text-3xl font-bold leading-none mb-1"
                  style={{
                    color:      step >= 3 ? riskColor : 'rgba(255,255,255,0.1)',
                    transition: 'color 1.2s ease',
                  }}
                >
                  {Math.round(calibratedProba * 100)}%
                </span>
                <span
                  className="text-xs font-semibold tracking-widest"
                  style={{
                    color:      step >= 3 ? riskColor + 'cc' : 'rgba(255,255,255,0.08)',
                    transition: 'color 1.2s ease',
                  }}
                >
                  {riskLabel} RISK
                </span>
              </div>
            </div>
          </div>
        </div>
        

        {/* ── Q3 lower-right — CatBoost tree ── */}
        <div
          className="bg-[#0a0a0a] p-7 flex flex-col min-h-[300px]"
          style={{
            borderTop: step >= 2 ? '1px solid rgba(96,165,250,0.2)' : '1px solid rgba(255,255,255,0.06)',
            borderLeft: step >= 2 ? '1px solid rgba(96,165,250,0.2)' : '1px solid rgba(255,255,255,0.06)',
            transition: 'border-color 1s ease',
          }}
        >
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-600 mb-4">
            CatBoost · Decision Tree
          </p>

          <svg viewBox="0 0 220 160" className="w-full flex-1" style={{ maxHeight: 220 }}>
            {/* Root */}
            <rect x="65" y="6" width="90" height="34" rx="7"
              style={{
                fill:   step >= 2 ? 'rgba(59,130,246,0.12)' : 'rgba(255,255,255,0.04)',
                stroke: step >= 2 ? 'rgba(59,130,246,0.45)' : 'rgba(255,255,255,0.1)',
                transition: 'all 1s ease',
              }} strokeWidth="1" />
            <text x="110" y="19" textAnchor="middle"
              style={{ fill: step >= 2 ? '#93c5fd' : 'rgba(255,255,255,0.2)', transition: 'fill 1s ease' }}
              fontSize="8" fontFamily="monospace">
              {treeValues.feature1}
            </text>
            <text x="110" y="32" textAnchor="middle"
              style={{ fill: step >= 2 ? '#60a5fa' : 'rgba(255,255,255,0.12)', transition: 'fill 1s ease' }}
              fontSize="7.5" fontFamily="monospace">
              ≤ {treeValues.threshold1}
            </text>

            {/* Lines root → mid */}
            <line x1="90" y1="40" x2="55" y2="74"
              style={{ stroke: step >= 2 ? 'rgba(59,130,246,0.35)' : 'rgba(255,255,255,0.07)', transition: 'stroke 1s ease' }} strokeWidth="1.2" />
            <line x1="130" y1="40" x2="165" y2="74"
              style={{ stroke: step >= 2 ? 'rgba(59,130,246,0.35)' : 'rgba(255,255,255,0.07)', transition: 'stroke 1s ease' }} strokeWidth="1.2" />

            {/* YES / NO labels */}
            <text x="68" y="62" style={{ fill: step >= 2 ? 'rgba(96,165,250,0.5)' : 'rgba(255,255,255,0.1)', transition: 'fill 1s ease' }}
              fontSize="7" fontFamily="monospace">yes</text>
            <text x="140" y="62" style={{ fill: step >= 2 ? 'rgba(96,165,250,0.5)' : 'rgba(255,255,255,0.1)', transition: 'fill 1s ease' }}
              fontSize="7" fontFamily="monospace">no</text>

            {/* Mid nodes */}
            {[{ cx: 20 }, { cx: 130 }].map((n, i) => (
              <g key={i}>
                <rect x={n.cx} y="74" width="90" height="34" rx="7"
                  style={{
                    fill:   step >= 2 ? 'rgba(59,130,246,0.08)' : 'rgba(255,255,255,0.03)',
                    stroke: step >= 2 ? 'rgba(59,130,246,0.3)' : 'rgba(255,255,255,0.07)',
                    transition: 'all 1s ease',
                  }} strokeWidth="1" />
                <text x={n.cx + 45} y="87" textAnchor="middle"
                  style={{ fill: step >= 2 ? '#93c5fd' : 'rgba(255,255,255,0.15)', transition: 'fill 1s ease' }}
                  fontSize="7.5" fontFamily="monospace">
                  {treeValues.feature2}
                </text>
                <text x={n.cx + 45} y="100" textAnchor="middle"
                  style={{ fill: step >= 2 ? '#60a5fa' : 'rgba(255,255,255,0.1)', transition: 'fill 1s ease' }}
                  fontSize="7" fontFamily="monospace">
                  ≤ {treeValues.threshold2}
                </text>
              </g>
            ))}

            {/* Lines mid → leaves */}
            {[
              [65, 108, 28, 136], [65, 108, 82, 136],
              [175, 108, 138, 136], [175, 108, 192, 136],
            ].map(([x1, y1, x2, y2], i) => (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                style={{ stroke: step >= 2 ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.05)', transition: 'stroke 1s ease' }}
                strokeWidth="1" />
            ))}

            {/* Leaves */}
            {treeValues.leaves.map((v, i) => {
              const xs = [6, 60, 116, 170];
              const col = parseFloat(v) > 0.6 ? "#ef4444" : parseFloat(v) > 0.35 ? "#f97316" : parseFloat(v) > 0.2 ? "#eab308" : "#22c55e";
              return (
                <g key={i}>
                  <rect x={xs[i]} y="136" width="48" height="20" rx="6"
                    style={{
                      fill:   step >= 2 ? col + '18' : 'rgba(255,255,255,0.03)',
                      stroke: step >= 2 ? col + '55' : 'rgba(255,255,255,0.07)',
                      transition: 'all 1.2s ease',
                    }} strokeWidth="1" />
                  <text x={xs[i] + 24} y="150" textAnchor="middle"
                    style={{ fill: step >= 2 ? col : 'rgba(255,255,255,0.15)', transition: 'fill 1.2s ease' }}
                    fontSize="9" fontFamily="monospace" fontWeight="700">
                    {v}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

      </div>

      {/* ── MOBILE — stack vertical ── */}
      <div className="md:hidden flex flex-col gap-4">

        <div className="bg-[#0a0a0a] rounded-xl border border-white/10 p-5">
          <p className="text-white font-medium text-sm mb-2">Fraud & Anomaly Detection</p>
          <p className="text-neutral-400 text-sm leading-relaxed">
            Each claim scored by fraud probability via a calibrated CatBoost pipeline.
          </p>
          <div className="flex flex-col gap-2 mt-4">
            {[
              { label: "AUC", value: "0.83+", color: "#4ade80" },
              { label: "Auto-cleared", value: ">50%", color: "#60a5fa" },
              { label: "Miss rate", value: "0.2%", color: "#a78bfa" },
            ].map((s) => (
              <div key={s.label} className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                <span className="text-neutral-500 text-xs font-mono">{s.label}</span>
                <span className="text-xs font-semibold font-mono" style={{ color: s.color }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#0a0a0a] rounded-xl border p-5"
          style={{ borderColor: step >= 1 ? 'rgba(96,165,250,0.25)' : 'rgba(255,255,255,0.1)', transition: 'border-color 1s ease' }}>
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-600 mb-3">Claim Features</p>
          <div className="flex flex-wrap gap-2">
            {orbitTags.map((t, i) => (
              <span key={i} className="text-[11px] px-2.5 py-1 rounded-full border font-mono"
                style={{
                  borderColor: step >= 1 ? t.color + '40' : 'rgba(255,255,255,0.08)',
                  color:       step >= 1 ? t.color + 'cc' : 'rgba(255,255,255,0.2)',
                  background:  step >= 1 ? t.color + '10' : 'transparent',
                  transition:  'all 1.2s ease',
                }}>
                {t.label}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-[#0a0a0a] rounded-xl border p-5"
          style={{ borderColor: step >= 2 ? 'rgba(96,165,250,0.25)' : 'rgba(255,255,255,0.1)', transition: 'border-color 1s ease' }}>
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-600 mb-3">CatBoost · Decision Tree</p>
          <svg viewBox="0 0 220 160" className="w-full" style={{ maxHeight: 140 }}>
            <rect x="65" y="6" width="90" height="34" rx="7"
              style={{ fill: step >= 2 ? 'rgba(59,130,246,0.12)' : 'rgba(255,255,255,0.04)', stroke: step >= 2 ? 'rgba(59,130,246,0.45)' : 'rgba(255,255,255,0.1)', transition: 'all 1s ease' }} strokeWidth="1" />
            <text x="110" y="19" textAnchor="middle" style={{ fill: step >= 2 ? '#93c5fd' : 'rgba(255,255,255,0.2)', transition: 'fill 1s ease' }} fontSize="8" fontFamily="monospace">{treeValues.feature1}</text>
            <text x="110" y="32" textAnchor="middle" style={{ fill: step >= 2 ? '#60a5fa' : 'rgba(255,255,255,0.12)', transition: 'fill 1s ease' }} fontSize="7.5" fontFamily="monospace">≤ {treeValues.threshold1}</text>
            <line x1="90" y1="40" x2="55" y2="74" style={{ stroke: step >= 2 ? 'rgba(59,130,246,0.35)' : 'rgba(255,255,255,0.07)', transition: 'stroke 1s ease' }} strokeWidth="1.2" />
            <line x1="130" y1="40" x2="165" y2="74" style={{ stroke: step >= 2 ? 'rgba(59,130,246,0.35)' : 'rgba(255,255,255,0.07)', transition: 'stroke 1s ease' }} strokeWidth="1.2" />
            {[{ cx: 20 }, { cx: 130 }].map((n, i) => (
              <g key={i}>
                <rect x={n.cx} y="74" width="90" height="34" rx="7" style={{ fill: step >= 2 ? 'rgba(59,130,246,0.08)' : 'rgba(255,255,255,0.03)', stroke: step >= 2 ? 'rgba(59,130,246,0.3)' : 'rgba(255,255,255,0.07)', transition: 'all 1s ease' }} strokeWidth="1" />
                <text x={n.cx + 45} y="94" textAnchor="middle" style={{ fill: step >= 2 ? '#93c5fd' : 'rgba(255,255,255,0.15)', transition: 'fill 1s ease' }} fontSize="7.5" fontFamily="monospace">{treeValues.feature2} ≤ {treeValues.threshold2}</text>
              </g>
            ))}
            {[[65,108,28,136],[65,108,82,136],[175,108,138,136],[175,108,192,136]].map(([x1,y1,x2,y2],i) => (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} style={{ stroke: step >= 2 ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.05)', transition: 'stroke 1s ease' }} strokeWidth="1" />
            ))}
            {treeValues.leaves.map((v, i) => {
              const xs = [6,60,116,170];
              const col = parseFloat(v) > 0.6 ? "#ef4444" : parseFloat(v) > 0.35 ? "#f97316" : parseFloat(v) > 0.2 ? "#eab308" : "#22c55e";
              return (
                <g key={i}>
                  <rect x={xs[i]} y="136" width="48" height="20" rx="6" style={{ fill: step >= 2 ? col+'18' : 'rgba(255,255,255,0.03)', stroke: step >= 2 ? col+'55' : 'rgba(255,255,255,0.07)', transition: 'all 1.2s ease' }} strokeWidth="1" />
                  <text x={xs[i]+24} y="150" textAnchor="middle" style={{ fill: step >= 2 ? col : 'rgba(255,255,255,0.15)', transition: 'fill 1.2s ease' }} fontSize="9" fontFamily="monospace" fontWeight="700">{v}</text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="bg-[#0a0a0a] rounded-xl border p-5"
          style={{ borderColor: step >= 3 ? 'rgba(168,85,247,0.25)' : 'rgba(255,255,255,0.1)', transition: 'border-color 1s ease' }}>
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-600 mb-4">Calibration → Risk Score</p>
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-center px-3 py-2 rounded-lg border border-white/[0.08] bg-white/[0.03]">
              <span className="text-[10px] text-neutral-600 font-mono">raw</span>
              <span className="font-mono text-base font-semibold" style={{ color: step >= 3 ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.1)', transition: 'color 1s ease' }}>{rawProba.toFixed(2)}</span>
            </div>
            <span style={{ color: step >= 3 ? 'rgba(168,85,247,0.5)' : 'rgba(255,255,255,0.1)', transition: 'color 1s ease' }} className="text-sm">→ f(x) →</span>
            <div className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border"
              style={{ borderColor: step >= 3 ? riskColor+'50' : 'rgba(255,255,255,0.07)', background: step >= 3 ? riskColor+'10' : 'rgba(255,255,255,0.02)', transition: 'all 1.2s ease' }}>
              <div className="w-2 h-2 rounded-full" style={{ background: step >= 3 ? riskColor : 'rgba(255,255,255,0.15)', transition: 'background 1s ease' }} />
              <span className="font-mono text-2xl font-bold" style={{ color: step >= 3 ? riskColor : 'rgba(255,255,255,0.1)', transition: 'color 1.2s ease' }}>{Math.round(calibratedProba * 100)}%</span>
              <span className="text-[10px] font-semibold tracking-widest" style={{ color: step >= 3 ? riskColor+'cc' : 'rgba(255,255,255,0.08)', transition: 'color 1.2s ease' }}>{riskLabel}</span>
            </div>
          </div>
        </div>

      </div>
    </>
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
    { id: '01', title: 'Setup & First Bot', desc: "Create your bot, retrieve the token & chat ID" },
    { id: '02', title: 'Sending Messages', desc: "Build a clean sending function" },
    { id: '03', title: 'Sending Photos', desc: "PNG, JPG, ..." },
    { id: '04', title: 'Sending Videos', desc: "MP4, MKV, ..." },
    { id: '05', title: 'Sending Documents', desc: "PDF, DOCX, CSV, ..." },
    { id: '06', title: 'HTML Formatting', desc: "Quote & code blocks, bold, ..." },
    { id: '07', title: 'Creating a Channel', desc: "Setup + retrieve the channel ID via bot" },
    { id: '08', title: 'Automating your Channel', desc: "Scheduled & automatic content delivery" },
  ];
  
  const catboostCurriculum = [
    { id: '00', title: 'Preamble', desc: 'Course overview & dataset presentation' },
    { id: '01', title: 'Categorical Encoding', desc: 'How CatBoost handles categories internally' },
    { id: '02', title: 'CatBoost vs XGB / LGBM / RF', desc: 'Benchmarks on real-world datasets' },
    { id: '03', title: 'Reliable Pipeline', desc: 'From data preparation to prediction' },
    { id: '04', title: 'Evaluation', desc: 'Metrics adapted to your context' },
    { id: '05', title: 'Calibration', desc: 'Interpretable probabilities' },
  ];

  const currentCourse = flipped
    ? { title: 'Master CatBoost', playlist: 'PLpcu21l3JC8Y8i0htvQplfREYF0m5V3H1', episodes: 5, curriculum: catboostCurriculum, emoji: '🎓', thumbnail: '/miniature_catboost.jpg' }
    : { title: 'Control Telegram from Python', playlist: 'PLpcu21l3JC8aTG9z5eGXV3Z1TSJpcwDHh', episodes: 9, curriculum: telegramCurriculum, emoji: '✈️', thumbnail: '/miniature_telegram.jpg' };

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
            <CourseFace course={{ title: 'Control Telegram from Python', playlist: 'PLpcu21l3JC8aTG9z5eGXV3Z1TSJpcwDHh', episodes: 9, curriculum: telegramCurriculum, emoji: '✈️', thumbnail: '/miniature_telegram.jpg' }} />
          </div>
          
          {/* FACE ARRIERE */}
          <div
            className="w-full absolute top-0 left-0"
            style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <CourseFace course={{ title: 'Master CatBoost', playlist: 'PLpcu21l3JC8Y8i0htvQplfREYF0m5V3H1', episodes: 5, curriculum: catboostCurriculum, emoji: '🎓', thumbnail: '/miniature_catboost.jpg' }} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function CourseFace({ course }) {
  const [playing, setPlaying] = useState(false);

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
            <div
              className="aspect-video rounded-lg overflow-hidden border border-white/10 relative cursor-pointer"
              onClick={() => setPlaying(true)}
            >
              {playing ? (
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/videoseries?list=${course.playlist}&autoplay=1`}
                  title={course.title}
                  frameBorder="0"
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <>
                  <img src={course.thumbnail} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors duration-150">
                    <div className="w-12 h-12 rounded-full bg-black/50 border border-white/20 flex items-center justify-center">
                      <Play className="w-5 h-5 text-white ml-0.5" />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 block mb-3">
                Curriculum
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
              Start the course
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
        <meta property="og:title" content="AG Algo Lab — Predictive modelling & anomaly detection" />
        <meta property="og:description" content="Asking the right question gets you halfway there. We take care of the other half." />
        <meta property="og:image" content="https://agalgolab.com/logo_black.png" />
        <meta property="og:url" content="https://agalgolab.com" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:image" content="https://agalgolab.com/logo_black.png" />
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

                <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                  <button
                    onClick={() => scrollToSection('contact')}
                    className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white text-black hover:bg-neutral-200 transition-colors duration-150 text-sm font-medium"
                  >
                    Start a project
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                  <button
                    onClick={() => scrollToSection('services')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-colors duration-150 text-sm font-medium"
                  >
                    See our services
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

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="mb-10"
            >
              <p className="text-xs font-mono text-neutral-500 uppercase tracking-[0.2em] mb-3">Founder</p>
              <h2 className="text-4xl md:text-5xl font-semibold text-white tracking-tight">
                Independent, focused, accountable.
              </h2>
            </motion.div>

            {/* Quote block */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              viewport={{ once: true }}
              className="mb-8 relative pl-5 border-l-2 border-blue-500/40"
            >
              <div className="absolute -top-1 -left-[1px] w-[2px] h-4 bg-gradient-to-b from-blue-500/0 to-blue-500/40" />
              <p className="text-lg md:text-xl font-light text-blue-400/80 leading-relaxed tracking-tight italic">
                "Asking the right question gets you halfway there.
                <span className="text-blue-300"> We take care of the other half.</span>"
              </p>
            </motion.div>

            {/* Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-[#0a0a0a] rounded-xl border border-white/10 overflow-hidden"
            >
              {/* Photo + bio */}
              <div className="p-8 md:p-10">
                <div className="flex flex-col md:flex-row gap-8 items-center">

                  <div className="flex-shrink-0">
                    <div className="w-36 h-36 md:w-40 md:h-40 rounded-xl overflow-hidden border border-white/10">
                      <img src="/founder.jpg" alt="Anthony Gocmen" className="w-full h-full object-cover" />
                    </div>
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl font-semibold text-white tracking-tight">Anthony Gocmen</h3>
                    <p className="text-neutral-500 text-sm font-mono mt-1 mb-5">Founder · AG Algo Lab</p>
                    <div className="space-y-3 text-neutral-400 leading-relaxed text-[15px]">
                      <p>
                        AG Algo Lab is an independent ML lab delivering{' '}
                        <span className="text-white">production-grade predictive systems</span>{' '}
                        — fraud detection, revenue forecasting, and risk modeling —
                        built around your data, scoped to your constraints.
                      </p>
                      <p>
                        The underlying conviction: applying{' '}
                        <span className="text-white">competitor-level analytical discipline</span>{' '}
                        to every data problem. The same rigor that builds a FIDE-titled
                        chess player builds a model that holds in production.
                      </p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Credentials — no label, all blue */}
              <div className="border-t border-white/[0.06] px-8 md:px-10 py-6">
                <div className="flex flex-wrap gap-3">

                  <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg bg-blue-500/[0.07] border border-blue-500/20">
                    <span className="text-neutral-400 text-base leading-none">♟</span>
                    <div>
                      <p className="text-neutral-400 text-xs font-medium">FIDE-titled player</p>
                      <p className="text-neutral-400/40 text-[10px] mt-0.5">Chess</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg bg-blue-500/[0.07] border border-blue-500/20">
                    <span className="text-neutral-400 text-sm leading-none">🏆</span>
                    <div>
                      <p className="text-neutral-400 text-xs font-medium">1st Place · ASU 2025</p>
                      <p className="text-neutral-400/40 text-[10px] mt-0.5">Space Hackathon 4 Sustainability</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg bg-blue-500/[0.07] border border-blue-500/20">
                    <span className="text-neutral-400 text-sm leading-none">🎓</span>
                    <div>
                      <p className="text-neutral-400 text-xs font-medium">Université Paris Dauphine · PSL</p>
                      <p className="text-neutral-400/40 text-[10px] mt-0.5">Finance</p>
                    </div>
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
              {/*
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
              </Link>*/}

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
      <Route path="/mlbet" element={<MLbet />} />
      <Route path="/reversal-engine" element={<ReversalEngine />} />
      <Route path="*" element={<Home />} />
    </Routes>
  );
}
