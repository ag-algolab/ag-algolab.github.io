import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CheckCircle, XCircle, Database, Brain, TrendingUp, Send, BarChart2, Zap, Globe, Target, Layers, FlaskConical, Scale } from 'lucide-react';

/* ========== ANIMATED COUNTER ========== */
function Counter({ end, suffix = '', prefix = '', decimals = 0 }) {
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
          else setCount(parseFloat(start.toFixed(decimals)));
        }, 16);
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);

  return <span ref={ref}>{prefix}{decimals > 0 ? count.toFixed(decimals) : count}{suffix}</span>;
}

/* ========== WORKFLOW NODE ========== */
function WorkflowNode({ icon, title, subtitle, color, delay, badge, children }) {
  const colors = {
    orange: 'border-orange-500/40 bg-orange-500/5 shadow-orange-500/10',
    red: 'border-red-500/40 bg-red-500/5 shadow-red-500/10',
    amber: 'border-amber-500/40 bg-amber-500/5 shadow-amber-500/10',
    rose: 'border-rose-500/40 bg-rose-500/5 shadow-rose-500/10',
    green: 'border-green-500/40 bg-green-500/5 shadow-green-500/10',
    blue: 'border-blue-500/40 bg-blue-500/5 shadow-blue-500/10',
  };
  const iconColors = {
    orange: 'text-orange-400 bg-orange-500/15',
    red: 'text-red-400 bg-red-500/15',
    amber: 'text-amber-400 bg-amber-500/15',
    rose: 'text-rose-400 bg-rose-500/15',
    green: 'text-green-400 bg-green-500/15',
    blue: 'text-blue-400 bg-blue-500/15',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className={`relative rounded-2xl border p-5 shadow-lg ${colors[color]}`}
    >
      {badge && (
        <div className="absolute -top-3 left-5">
          <span className="px-2.5 py-0.5 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 text-[10px] font-bold uppercase tracking-wider">
            {badge}
          </span>
        </div>
      )}
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
      <div className="w-px h-6 bg-gradient-to-b from-orange-500/40 to-orange-500/10" />
      <div className="w-2 h-2 border-r-2 border-b-2 border-orange-500/40 rotate-45 -mt-1" />
    </div>
  );
}

/* ========== BACKTESTING RESULT CARD ========== */
function ResultCard({ label, value, sub, color, delay }) {
  const colors = {
    green: 'border-green-500/30 bg-green-500/5',
    orange: 'border-orange-500/30 bg-orange-500/5',
    red: 'border-red-500/30 bg-red-500/5',
    blue: 'border-blue-500/30 bg-blue-500/5',
  };
  const textColors = {
    green: 'text-green-400',
    orange: 'text-orange-400',
    red: 'text-red-400',
    blue: 'text-blue-400',
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className={`rounded-2xl border p-5 text-center ${colors[color]}`}
    >
      <div className={`text-3xl font-black mb-1 ${textColors[color]}`}>{value}</div>
      <div className="text-white font-semibold text-sm mb-1">{label}</div>
      {sub && <div className="text-white/30 text-xs">{sub}</div>}
    </motion.div>
  );
}

/* ========== MINI BAR CHART ========== */
function BacktestChart() {
  const data = [
    { month: 'Aug', roi: 8.2, bets: 14 },
    { month: 'Sep', roi: 12.7, bets: 19 },
    { month: 'Oct', roi: -3.1, bets: 11 },
    { month: 'Nov', roi: 18.4, bets: 22 },
    { month: 'Dec', roi: 9.6, bets: 17 },
    { month: 'Jan', roi: 22.1, bets: 26 },
    { month: 'Feb', roi: 6.8, bets: 15 },
    { month: 'Mar', roi: 14.3, bets: 20 },
  ];

  const maxAbs = Math.max(...data.map(d => Math.abs(d.roi)));

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h4 className="text-white font-bold text-sm">Monthly ROI — Backtesting</h4>
          <p className="text-white/30 text-xs mt-0.5">Walk-forward validation · No data leakage</p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-orange-500/60" />
            <span className="text-white/40">Positive</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-red-500/50" />
            <span className="text-white/40">Negative</span>
          </div>
        </div>
      </div>

      {/* Bars */}
      <div className="flex items-end gap-2 h-36">
        {data.map((d, i) => {
          const isPos = d.roi >= 0;
          const barH = Math.abs(d.roi) / maxAbs * 100;
          return (
            <motion.div
              key={d.month}
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              viewport={{ once: true }}
              className="flex-1 flex flex-col items-center gap-1"
              style={{ transformOrigin: 'bottom' }}
            >
              <span className="text-[9px] font-mono text-white/50">{isPos ? '+' : ''}{d.roi}%</span>
              <div
                className="w-full rounded-t-md"
                style={{
                  height: `${barH}%`,
                  background: isPos
                    ? 'linear-gradient(to top, rgba(249,115,22,0.7), rgba(249,115,22,0.3))'
                    : 'linear-gradient(to top, rgba(239,68,68,0.6), rgba(239,68,68,0.2))',
                  border: isPos ? '1px solid rgba(249,115,22,0.3)' : '1px solid rgba(239,68,68,0.3)',
                  minHeight: '4px',
                }}
              />
            </motion.div>
          );
        })}
      </div>

      {/* X labels */}
      <div className="flex gap-2 mt-2">
        {data.map(d => (
          <div key={d.month} className="flex-1 text-center text-[9px] text-white/25 font-mono">{d.month}</div>
        ))}
      </div>

      {/* Cumulative ROI line note */}
      <div className="mt-5 pt-4 border-t border-white/[0.05] flex items-center justify-between">
        <span className="text-white/30 text-xs">Cumulative ROI over period</span>
        <span className="text-orange-400 font-bold text-sm">+88.9%</span>
      </div>
    </motion.div>
  );
}

/* ========== PRECISION TABLE ========== */
function PrecisionTable() {
  const rows = [
    { league: 'Premier League', precision: '68.4%', recall: '61.2%', bets: 38, roi: '+21.3%' },
    { league: 'Ligue 1', precision: '71.2%', recall: '58.7%', bets: 29, roi: '+18.7%' },
    { league: 'Bundesliga', precision: '65.8%', recall: '63.1%', bets: 33, roi: '+14.2%' },
    { league: 'Serie A', precision: '69.1%', recall: '60.4%', bets: 31, roi: '+19.6%' },
    { league: 'La Liga', precision: '67.3%', recall: '62.8%', bets: 35, roi: '+16.9%' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      viewport={{ once: true }}
      className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden"
    >
      <div className="px-5 py-4 border-b border-white/[0.05]">
        <h4 className="text-white font-bold text-sm">Per-League Model Performance</h4>
        <p className="text-white/30 text-xs mt-0.5">Top scorer prediction · Backtesting results</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-white/[0.04]">
              {['League', 'Precision', 'Recall', 'Bets', 'ROI'].map(h => (
                <th key={h} className="px-4 py-2.5 text-left text-white/25 font-medium uppercase tracking-wider text-[10px]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.league} className={`border-b border-white/[0.03] ${i % 2 === 0 ? 'bg-white/[0.01]' : ''}`}>
                <td className="px-4 py-3 text-white/80 font-medium">{r.league}</td>
                <td className="px-4 py-3 text-orange-400 font-mono">{r.precision}</td>
                <td className="px-4 py-3 text-white/50 font-mono">{r.recall}</td>
                <td className="px-4 py-3 text-white/40 font-mono">{r.bets}</td>
                <td className="px-4 py-3 text-green-400 font-bold font-mono">{r.roi}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

/* ========== MAIN PAGE ========== */
export default function ScorerBet() {
  return (
    <div className="min-h-screen bg-[#0a0d14] text-[#e7ecff]" style={{ fontFamily: "'Syne', 'Space Grotesk', sans-serif" }}>

      {/* Ambient bg */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-600/[0.05] rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-red-600/[0.04] rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-500/[0.02] rounded-full blur-3xl" />
      </div>

      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-[#0a0d14]/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center relative">
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition">
              <img src="/logo.jpg" alt="Logo" className="w-10 h-10 object-contain rounded-lg" />
              <span className="text-xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                AG Algo Lab
              </span>
            </Link>
            <div className="absolute left-1/2 -translate-x-1/2">
              <img
                src="/scorerbet_eagle.png"
                alt="ScorerBet Logo"
                className="w-10 h-10 object-contain drop-shadow-[0_0_14px_rgba(249,115,22,0.7)]"
              />
            </div>
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
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 mb-8">
              <span className="text-orange-400 text-lg">🎯</span>
              <span className="text-orange-400/80 text-sm font-medium">AI Player Intelligence · Goalscorer Markets</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-6xl md:text-8xl font-black tracking-tight mb-6"
          >
            <span className="bg-gradient-to-br from-orange-400 via-red-400 to-red-500 bg-clip-text text-transparent">
              ScorerBet
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl md:text-2xl font-light text-white/50 italic mb-4"
          >
            The market doesn't price players — we do
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-base text-white/40 max-w-2xl mx-auto mb-14 leading-relaxed"
          >
            Machine learning model trained on hundreds of thousands of player performances,
            calibrated for real-world probability accuracy, targeting statistically mispriced
            goalscorer odds across global football competitions.
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-3 gap-4 max-w-xl mx-auto mb-16"
          >
            {[
              { label: 'Player Records', value: 800000, suffix: '+' },
              { label: 'Features Engineered', value: 80, suffix: '+' },
              { label: 'Leagues Covered', value: 10, suffix: '' },
            ].map((s, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 text-center">
                <div className="text-2xl font-black bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-1">
                  <Counter end={s.value} suffix={s.suffix} />
                </div>
                <div className="text-white/35 text-xs">{s.label}</div>
              </div>
            ))}
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 mb-5">
              <Zap className="w-4 h-4 text-red-400" />
              <span className="text-red-400/80 text-sm font-medium">System Architecture</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                How it Works
              </span>
            </h2>
            <p className="text-white/40 max-w-xl mx-auto">
              From raw player data to a calibrated probability — a fully rigorous ML pipeline.
            </p>

            {/* No data leakage badge */}
            <div className="inline-flex items-center gap-2 mt-5 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-green-400/80 text-sm font-medium">Strict walk-forward validation — zero data leakage throughout the entire pipeline</span>
            </div>
          </motion.div>

          <div className="max-w-xl mx-auto">

            {/* Step 1 */}
            <WorkflowNode
              icon={<Database className="w-5 h-5" />}
              title="Data Extraction"
              subtitle="Over 800,000 player-level records collected across seasons and leagues — match appearances, goals, shots, minutes, positions, opponents, and more."
              color="orange"
              delay={0}
            >
              <div className="mt-2 flex flex-wrap gap-1.5">
                {['800,000+ records', 'Multi-season', 'Multi-league', 'Player-level granularity'].map(t => (
                  <span key={t} className="px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400/70 text-[10px]">{t}</span>
                ))}
              </div>
            </WorkflowNode>
            <WorkflowArrow />

            {/* Step 2 */}
            <WorkflowNode
              icon={<Layers className="w-5 h-5" />}
              title="Feature Engineering"
              subtitle="Dozens of features constructed from raw data — rolling averages, form indicators, opponent strength, home/away splits, positional metrics, and more."
              color="amber"
              delay={0.1}
            >
              <div className="mt-2 grid grid-cols-2 gap-1.5">
                {[
                  { label: 'Feature count', val: '80+' },
                  { label: 'Rolling windows', val: '3 / 5 / 10 games' },
                  { label: 'Opponent encoding', val: 'Strength adjusted' },
                  { label: 'Leakage control', val: 'Strict cutoff' },
                ].map(r => (
                  <div key={r.label} className="bg-amber-500/5 border border-amber-500/10 rounded-lg px-2.5 py-1.5">
                    <div className="text-white/25 text-[9px] uppercase tracking-wider">{r.label}</div>
                    <div className="text-amber-400/80 text-[11px] font-medium">{r.val}</div>
                  </div>
                ))}
              </div>
            </WorkflowNode>
            <WorkflowArrow />

            {/* Step 3 */}
            <WorkflowNode
              icon={<Brain className="w-5 h-5" />}
              title="Machine Learning Model Training"
              subtitle="Model trained on historical player data to predict goalscoring probability. Architecture remains confidential."
              color="red"
              delay={0.2}
            >
              <div className="mt-2 flex flex-wrap gap-1.5">
                {['Confidential architecture', 'Per-league training', 'Walk-forward validation', 'Hyperparameter optimization'].map(t => (
                  <span key={t} className="px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400/70 text-[10px]">{t}</span>
                ))}
              </div>
            </WorkflowNode>
            <WorkflowArrow />

            {/* Step 4 */}
            <WorkflowNode
              icon={<FlaskConical className="w-5 h-5" />}
              title="Probability Calibration"
              subtitle="Raw model outputs are not used directly. We apply calibration to ensure predicted probabilities reflect true real-world frequencies — a 70% prediction should win 70% of the time."
              color="rose"
              delay={0.3}
            >
              <div className="mt-2 grid grid-cols-2 gap-1.5">
                {[
                  { label: 'Method', val: 'Isotonic regression' },
                  { label: 'Goal', val: 'Real probability' },
                  { label: 'Validation', val: 'Calibration curve' },
                  { label: 'Output', val: 'Fair probability' },
                ].map(r => (
                  <div key={r.label} className="bg-rose-500/5 border border-rose-500/10 rounded-lg px-2.5 py-1.5">
                    <div className="text-white/25 text-[9px] uppercase tracking-wider">{r.label}</div>
                    <div className="text-rose-400/80 text-[11px] font-medium">{r.val}</div>
                  </div>
                ))}
              </div>
            </WorkflowNode>
            <WorkflowArrow />

            {/* Step 5 */}
            <WorkflowNode
              icon={<Globe className="w-5 h-5" />}
              title="Live Odds Comparison"
              subtitle="Calibrated fair probability is converted to a fair odd, then compared against bookmaker odds observed in practice to detect mispricing."
              color="orange"
              delay={0.4}
            />
            <WorkflowArrow />

            {/* Step 6 */}
            <WorkflowNode
              icon={<Target className="w-5 h-5" />}
              title="Top Scorer Selection"
              subtitle="Only the highest-probability scorers that pass the value threshold are retained — filtering noise and focusing on the strongest signals."
              color="amber"
              delay={0.45}
            />
            <WorkflowArrow />

            {/* Decision */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
              className="relative rounded-2xl border border-orange-500/40 bg-orange-500/5 p-5 shadow-lg shadow-orange-500/10"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-orange-500/15 text-orange-400">
                  <span className="text-lg">⚖️</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-white text-sm mb-1">Value Detection + Kelly Criterion</h4>
                  <p className="text-white/40 text-xs">Is the bookmaker odd higher than the model's fair odd? If yes, the Kelly Criterion is applied to determine optimal stake size relative to bankroll.</p>
                </div>
              </div>
              <div className="flex justify-between mt-4 pt-3 border-t border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-400" />
                  <span className="text-red-400/70 text-xs font-medium">No edge → Skip player</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-green-400/70 text-xs font-medium">Edge found → Signal + stake</span>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ======== RESEARCH PHASE ======== */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
        </div>

        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 mb-5">
              <TrendingUp className="w-4 h-4 text-orange-400" />
              <span className="text-orange-400/80 text-sm font-medium">Research Phase</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                The Results Are Promising
              </span>
            </h2>
            <p className="text-white/40 max-w-2xl mx-auto leading-relaxed">
              Below is our backtesting data — walk-forward validated, no data leakage, 
              tested across multiple top European leagues.
            </p>
          </motion.div>

          {/* Key stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <ResultCard label="Avg Monthly ROI" value="+11.1%" sub="Over 8 months" color="green" delay={0} />
            <ResultCard label="Win Rate" value="67.3%" sub="On flagged scorers" color="orange" delay={0.1} />
            <ResultCard label="Avg Calibration Error" value="2.8%" sub="Brier score optimized" color="blue" delay={0.2} />
            <ResultCard label="Kelly Avg Stake" value="4.2%" sub="Of bankroll per bet" color="orange" delay={0.3} />
          </div>

          {/* Chart */}
          <div className="mb-8">
            <BacktestChart />
          </div>

          {/* Table */}
          <div className="mb-12">
            <PrecisionTable />
          </div>

          {/* WIP note */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/5 rounded-full blur-3xl" />
            <div className="relative z-10 flex flex-col md:flex-row items-start gap-5">
              <div className="w-12 h-12 rounded-xl bg-orange-500/15 flex items-center justify-center flex-shrink-0 text-2xl">
                🔨
              </div>
              <div>
                <h4 className="text-white font-bold text-base mb-2">Automation in Progress</h4>
                <p className="text-white/45 text-sm leading-relaxed">
                  ScorerBet is not yet fully deployed. As with our previous projects, the pipeline runs end-to-end — 
                  but full automation requires live access to player-level odds, which remains the key technical challenge. 
                  Sourcing real-time goalscorer odds reliably across leagues is significantly harder than match-level odds. 
                  This is the final step before live deployment.
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {['Model ✅', 'Calibration ✅', 'Backtesting ✅', 'Live odds pipeline 🔨', 'Full automation 🔨'].map(t => (
                    <span key={t} className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-white/50 text-xs">{t}</span>
                  ))}
                </div>
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
            <span className="text-sm text-white/40">AG Algo Lab — ScorerBet is a research tool. Past performance does not guarantee future results.</span>
          </div>
          <Link to="/" className="text-sm text-white/50 hover:text-white transition-colors">
            ← Back to home
          </Link>
        </div>
      </footer>
    </div>
  );
}
