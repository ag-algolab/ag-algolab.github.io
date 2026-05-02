import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CheckCircle, XCircle, Database, Brain, TrendingUp, Send, BarChart2, Zap, Globe, MoreVertical, ExternalLink } from 'lucide-react';

/* ========== ANIMATED COUNTER ========== */
function Counter({ end, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        let s = 0;
        const dur = 1800, step = (end / dur) * 16;
        const t = setInterval(() => {
          s += step;
          if (s >= end) { setCount(end); clearInterval(t); } else setCount(Math.floor(s));
        }, 16);
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);
  return <span ref={ref}>{count}{suffix}</span>;
}

/* ========== WORKFLOW NODE ========== */
function WorkflowNode({ icon, title, subtitle, color = 'neutral', delay, children }) {
  const cls = {
    neutral: { wrap: 'border-white/[0.08] bg-[#0d0d0d]', icon: 'text-white/50 bg-white/[0.05]' },
    green:   { wrap: 'border-green-500/20 bg-green-500/[0.03]', icon: 'text-green-400 bg-green-500/10' },
    red:     { wrap: 'border-red-500/20 bg-red-500/[0.03]', icon: 'text-red-400 bg-red-500/10' },
  };
  const c = cls[color];
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay }} viewport={{ once: true }}
      className={`relative rounded-xl border p-5 ${c.wrap}`}>
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${c.icon}`}>{icon}</div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-white text-sm mb-0.5">{title}</h4>
          <p className="text-white/35 text-xs leading-relaxed">{subtitle}</p>
          {children}
        </div>
      </div>
    </motion.div>
  );
}

/* ========== WORKFLOW ARROW ========== */
function WorkflowArrow({ condition }) {
  if (condition) return (
    <div className="flex flex-col items-center gap-1 my-1">
      <div className="w-px h-4 bg-white/[0.07]" />
      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
        condition === 'yes' ? 'text-green-400 border-green-500/20 bg-green-500/[0.05]' : 'text-red-400 border-red-500/20 bg-red-500/[0.05]'
      }`}>{condition === 'yes' ? '✅ OUI' : '❌ NON'}</span>
      <div className="w-px h-4 bg-white/[0.07]" />
    </div>
  );
  return (
    <div className="flex flex-col items-center my-1">
      <div className="w-px h-6 bg-gradient-to-b from-white/15 to-white/5" />
      <div className="w-2 h-2 border-r-2 border-b-2 border-white/15 rotate-45 -mt-1" />
    </div>
  );
}

/* ========== TELEGRAM CHANNEL ========== */
function TelegramChannel() {
  const [active, setActive] = useState(0);
  const msgs = [
    { league: '🇧🇪 Belgique — Pro League', matches: [
      { time: '19:00', home: 'Liège', away: 'Club Brugge II', winner: 'Liège', conf: 65.0, fair: '1.54', real: '1.82', edge: '+18.2%' },
      { time: '19:00', home: 'Anderlecht II', away: 'KRC Genk II', winner: 'Anderlecht II', conf: 47.4, fair: '2.11', real: '2.19', edge: '+3.8%' },
    ]},
    { league: '🇩🇪 Allemagne — 2. Bundesliga', matches: [
      { time: '17:30', home: 'VfL Bochum', away: '1. FC Nürnberg', winner: 'VfL Bochum', conf: 61.3, fair: '1.63', real: '2.15', edge: '+31.9%' },
    ]},
    { league: '🇪🇸 Espagne — Segunda División', matches: [
      { time: '19:30', home: 'AD Ceuta FC', away: 'Granada CF', winner: 'AD Ceuta FC', conf: 47.9, fair: '2.09', real: '2.75', edge: '+31.6%' },
    ]},
  ];
  useEffect(() => { const t = setInterval(() => setActive(p => (p + 1) % msgs.length), 3400); return () => clearInterval(t); }, []);
  const dot = (c) => c >= 60 ? 'bg-green-400' : c >= 50 ? 'bg-yellow-400' : 'bg-orange-400';
  return (
    <div className="w-full max-w-[340px]">
      <div className="bg-[#0e1621] rounded-[2.5rem] border border-white/[0.06] overflow-hidden shadow-2xl shadow-black/70">
        <div className="h-7 bg-[#0e1621] relative"><div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-b-2xl" /></div>
        <div className="bg-[#17212b] px-4 py-2.5 flex items-center gap-3 border-b border-white/[0.04]">
          <div className="w-9 h-9 rounded-full bg-[#1c2c1e] border border-white/[0.08] flex items-center justify-center">
            <span className="text-sm font-black text-green-400/90">M</span>
          </div>
          <div className="flex-1"><span className="text-white font-semibold text-sm block">Canal MLbet</span><span className="text-white/30 text-[11px]">📢 canal public · @mlbet_foot</span></div>
          <MoreVertical className="w-4 h-4 text-white/20" />
        </div>

        <div className="h-[360px] p-3 flex flex-col gap-2 bg-[#0e1621]">
          <div className="max-w-[90%] bg-[#182533] rounded-2xl rounded-bl-sm px-3.5 py-2.5 border border-white/[0.04]">
            <p className="text-white/80 text-[12px] font-semibold mb-0.5">⚡ MLbet — Analyse du jour</p>
            <p className="text-white/40 text-[11px]">Modèle lancé · cotes récupérées · signaux en filtrage...</p>
            <span className="text-white/20 text-[10px]">07:37</span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={active} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}
              className="max-w-[97%] bg-[#182533] rounded-2xl rounded-bl-sm px-3.5 py-2.5 border border-white/[0.07]">
              <div className="flex items-center gap-2 mb-2.5 pb-2 border-b border-white/[0.05]">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400/70" />
                <p className="text-white/65 font-semibold text-[11px]">{msgs[active].league}</p>
              </div>
              {msgs[active].matches.map((m, i) => (
                <div key={i} className="mb-2.5 last:mb-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white/85 text-[12px] font-bold">{m.home} <span className="text-white/25 font-normal text-[10px]">vs</span> {m.away}</span>
                    <span className="text-white/25 text-[10px]">{m.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${dot(m.conf)}`} />
                    <span className="text-white/50 text-[10px]">Confiance {m.conf}%</span>
                    <span className="text-white/25 text-[10px]">·</span>
                    <span className="text-white/65 text-[10px] font-semibold">{m.winner}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px]">
                    <span className="text-white/25">Juste <span className="text-white/50">{m.fair}</span></span>
                    <span className="text-white/25">Betclic <span className="text-white/50">{m.real}</span></span>
                    <span className="text-green-400 font-bold">{m.edge}</span>
                  </div>
                </div>
              ))}
              <span className="text-white/18 text-[10px]">07:44</span>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center gap-1.5 mt-auto">
            {msgs.map((_, i) => <div key={i} className={`h-1 rounded-full transition-all ${i === active ? 'w-4 bg-white/30' : 'w-1.5 bg-white/10'}`} />)}
          </div>
        </div>

        <div className="bg-[#17212b] px-3 py-2 border-t border-white/[0.04]">
          <div className="bg-[#242f3d] rounded-full px-4 py-2 flex items-center gap-2">
            <span className="text-white/18 text-sm flex-1">Message</span>
            <div className="w-7 h-7 rounded-full bg-white/[0.05] flex items-center justify-center"><Send className="w-3.5 h-3.5 text-white/25" /></div>
          </div>
        </div>
        <div className="h-5 flex items-center justify-center bg-[#0e1621]"><div className="w-28 h-1 bg-white/10 rounded-full" /></div>
      </div>
    </div>
  );
}

/* ========== TELEGRAM BOT ========== */
function TelegramBot() {
  const [screen, setScreen] = useState('menu');
  const [selected, setSelected] = useState(null);
  const countries = ['France','Angleterre','Allemagne','Italie','Espagne','Pays-Bas','Belgique','Japon'];
  const results = {
    Angleterre: [{ league: 'Premier League', time: '19:30', home: 'Manchester City', away: 'Fulham', winner: 'Manchester City', prob: '81.9%', fair: '1.22', real: '1.40', edge: '+14.8%' }],
    Allemagne: [{ league: '2. Bundesliga', time: '17:30', home: 'VfL Bochum', away: 'Nürnberg', winner: 'VfL Bochum', prob: '61.3%', fair: '1.63', real: '2.15', edge: '+31.9%' }],
    France: [{ league: 'Ligue 1', time: '20:00', home: 'PSG', away: 'Lyon', winner: 'PSG', prob: '78.2%', fair: '1.31', real: '1.55', edge: '+18.3%' }],
    Espagne: [{ league: 'Segunda División', time: '19:30', home: 'AD Ceuta FC', away: 'Granada CF', winner: 'AD Ceuta FC', prob: '47.9%', fair: '2.09', real: '2.75', edge: '+31.6%' }],
    Italie: [{ league: 'Serie A', time: '21:00', home: 'Inter Milan', away: 'Napoli', winner: 'Inter Milan', prob: '58.4%', fair: '1.72', real: '2.10', edge: '+22.1%' }],
    'Pays-Bas': [{ league: 'Eredivisie', time: '18:45', home: 'Ajax', away: 'Feyenoord', winner: 'Ajax', prob: '52.1%', fair: '1.90', real: '2.25', edge: '+18.4%' }],
    Belgique: [{ league: 'Pro League', time: '19:00', home: 'Liège', away: 'Club Brugge II', winner: 'Liège', prob: '65.0%', fair: '1.54', real: '1.82', edge: '+18.2%' }],
    Japon: [{ league: 'J. League', time: '12:00', home: 'Kashima', away: 'Yokohama', winner: 'Kashima', prob: '55.7%', fair: '1.80', real: '2.05', edge: '+13.9%' }],
  };

  return (
    <div className="w-full max-w-[340px]">
      <div className="bg-[#0e1621] rounded-[2.5rem] border border-white/[0.06] overflow-hidden shadow-2xl shadow-black/70">
        <div className="h-7 bg-[#0e1621] relative"><div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-b-2xl" /></div>
        <div className="bg-[#17212b] px-4 py-2.5 flex items-center gap-3 border-b border-white/[0.04]">
          <div className="w-9 h-9 rounded-full bg-[#1c2c1e] border border-white/[0.08] flex items-center justify-center">
            <span className="text-sm font-black text-green-400/90">M</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-white font-semibold text-sm">MLbet</span>
              <svg className="w-3.5 h-3.5 text-sky-400" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
            </div>
            <span className="text-white/30 text-[11px]">bot</span>
          </div>
          <MoreVertical className="w-4 h-4 text-white/20" />
        </div>

        <div className="h-[360px] bg-[#0e1621] overflow-hidden">
          <div className="p-3 flex flex-col gap-2 h-full">
            <div className="self-end bg-[#2b5278] rounded-2xl rounded-br-sm px-3 py-1.5 max-w-[60%]">
              <span className="text-white text-[13px] font-mono">/start</span>
              <span className="text-white/30 text-[9px] ml-2">13:46 ✓✓</span>
            </div>

            <AnimatePresence mode="wait">
              {screen === 'menu' ? (
                <motion.div key="menu" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-[97%]">
                  <div className="bg-[#182533] rounded-2xl rounded-bl-sm px-3.5 py-2.5 border border-white/[0.05] mb-2">
                    <p className="text-white text-[12px] font-semibold mb-0.5">⚡ Bienvenue sur MLbet</p>
                    <p className="text-white/40 text-[11px]">Dernière analyse : aujourd'hui à 08h54</p>
                    <p className="text-white/40 text-[11px] mt-0.5">🌐 Choisissez un pays :</p>
                    <span className="text-white/18 text-[10px]">13:46</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {countries.map(c => (
                      <button key={c} onClick={() => { setSelected(c); setScreen('result'); }}
                        className="bg-[#242f3d] hover:bg-[#2d3d50] border border-white/[0.06] rounded-xl px-3 py-2 text-white/70 text-[12px] text-left transition-all hover:text-white hover:border-white/12">
                        {c}
                      </button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div key="result" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col gap-2 max-w-[97%]">
                  <div className="self-end bg-[#2b5278] rounded-2xl rounded-br-sm px-3 py-1.5">
                    <span className="text-white text-[12px]">{selected}</span>
                  </div>
                  {(results[selected] || []).map((m, i) => (
                    <div key={i} className="bg-[#182533] rounded-2xl rounded-bl-sm px-3.5 py-2.5 border border-white/[0.06]">
                      <p className="text-white/40 text-[11px] mb-1.5">Signaux du jour · {selected}</p>
                      <p className="text-white/60 text-[11px] mb-1">⚡ {m.league} — {m.time}</p>
                      <p className="text-white font-bold text-[13px] mb-1">{m.home} <span className="text-white/25 font-normal text-[10px]">vs</span> {m.away}</p>
                      <div className="text-[11px] space-y-0.5">
                        <div className="text-white/55">Vainqueur : <span className="text-white font-semibold">{m.winner}</span></div>
                        <div className="text-white/55">Probabilité : <span className="text-green-400 font-semibold">{m.prob}</span></div>
                        <div className="flex gap-3 mt-1 text-[10px]">
                          <span className="text-white/35">Juste <span className="text-white/55">{m.fair}</span></span>
                          <span className="text-white/35">Betclic <span className="text-white/55">{m.real}</span></span>
                          <span className="text-green-400 font-bold">{m.edge}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => setScreen('menu')} className="bg-[#242f3d] border border-white/[0.06] rounded-xl px-3 py-2 text-white/55 text-[12px] flex items-center justify-center hover:bg-[#2d3d50] transition-all">
                    ◀ Retour au menu
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="bg-[#17212b] px-3 py-2 border-t border-white/[0.04]">
          <div className="bg-[#242f3d] rounded-full px-4 py-2 flex items-center gap-2">
            <span className="text-white/18 text-sm flex-1">Message</span>
            <div className="w-7 h-7 rounded-full bg-white/[0.05] flex items-center justify-center"><Send className="w-3.5 h-3.5 text-white/25" /></div>
          </div>
        </div>
        <div className="h-5 flex items-center justify-center bg-[#0e1621]"><div className="w-28 h-1 bg-white/10 rounded-full" /></div>
      </div>
    </div>
  );
}

/* ========== HEDGE HUNT ========== */
function HedgeHuntSection() {
  const bookPoints = [
    { label: 'Leur seul objectif', text: 'Encaisser leur marge sur chaque événement, peu importe l\'issue. Pas prédire — se couvrir.' },
    { label: 'Les cotes d\'ouverture', text: 'Une estimation initiale pour sonder le marché. Rien de définitif, tout est ajustable.' },
    { label: 'Ils suivent le flux', text: "Trop de mises sur un camp ? Ils rééquilibrent les cotes. Pas pour refléter la réalité sportive — pour limiter leur exposition." },
    { label: 'L\'équilibre permanent', text: "Couverts de chaque côté, ils encaissent leur commission quoi qu'il arrive." },
  ];
  const ourPoints = [
    { label: 'La fenêtre d\'entrée', text: "À l'ouverture des cotes, avant que le marché réagisse, les erreurs de pricing sont à leur maximum. C'est notre point d'entrée." },
    { label: 'La probabilité vraie', text: 'Notre modèle calcule la probabilité réelle, indépendante des volumes et de la pression publique.' },
    { label: 'Identifier la déviation', text: "Quand la cote proposée excède notre estimation — le marché paie plus qu'il ne devrait. C'est un signal." },
    { label: 'Agir avant la correction', text: 'Avant que la masse des parieurs ne rééquilibre les cotes. Avant que l\'anomalie disparaisse.' },
  ];

  return (
    <section className="py-28 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      <div className="absolute top-1/3 right-0 w-80 h-80 bg-green-950/20 rounded-full blur-3xl pointer-events-none" />
      <div className="max-w-6xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/7 mb-6">
            <span className="text-white/30 text-xs font-medium uppercase tracking-widest">Mécanique du marché</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black tracking-tight text-white leading-[1.1]">
            Les books protègent leurs marges.<br/>
            <span className="text-white/50">Nous, on exploite leurs erreurs.</span>
          </h2>
          <p className="text-white/28 text-base mt-5 max-w-lg mx-auto leading-relaxed">
            Ils ne cherchent pas à prédire le bon résultat. Comprendre leur logique, c'est là que commence l'edge.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-5 items-stretch">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }} viewport={{ once: true }}
            className="rounded-3xl border border-white/[0.06] bg-white/[0.015] overflow-hidden flex flex-col">
            <div className="px-6 pt-6 pb-5 border-b border-white/[0.05]">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-7 h-7 rounded-lg bg-red-500/10 border border-red-500/15 flex items-center justify-center text-sm">🏦</div>
                <span className="text-red-400/60 text-xs font-semibold uppercase tracking-widest">Le Bookmaker</span>
              </div>
              <p className="text-white font-bold text-xl mt-3 leading-snug">Leur métier n'est pas de prédire.<br/>C'est de ne jamais perdre.</p>
            </div>
            <div className="px-6 py-5 flex flex-col gap-4 flex-1">
              {bookPoints.map((p, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 + i * 0.07 }} viewport={{ once: true }} className="flex items-start gap-3">
                  <span className="text-white/18 text-sm mt-0.5 flex-shrink-0">→</span>
                  <div><span className="text-white/60 text-sm font-semibold">{p.label} : </span><span className="text-white/30 text-sm">{p.text}</span></div>
                </motion.div>
              ))}
            </div>
            <div className="mx-6 mb-6 rounded-2xl bg-red-500/[0.04] border border-red-500/10 px-4 py-3">
              <p className="text-red-400/55 text-xs text-center">Leurs cotes reflètent la gestion du risque — pas la réalité sportive.</p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} viewport={{ once: true }}
            className="rounded-3xl border border-green-500/12 bg-green-500/[0.02] overflow-hidden flex flex-col">
            <div className="px-6 pt-6 pb-5 border-b border-green-500/[0.07]">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-7 h-7 rounded-lg bg-green-500/10 border border-green-500/18 flex items-center justify-center text-sm">⚡</div>
                <span className="text-green-400/65 text-xs font-semibold uppercase tracking-widest">MLbet</span>
              </div>
              <p className="text-white font-bold text-xl mt-3 leading-snug">Mieux valoriser que le marché.<br/>Avant qu'il ne se corrige.</p>
            </div>
            <div className="px-6 py-5 flex flex-col gap-4 flex-1">
              {ourPoints.map((p, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 + i * 0.07 }} viewport={{ once: true }} className="flex items-start gap-3">
                  <span className="text-white/18 text-sm mt-0.5 flex-shrink-0">→</span>
                  <div><span className="text-white/60 text-sm font-semibold">{p.label} : </span><span className="text-white/30 text-sm">{p.text}</span></div>
                </motion.div>
              ))}
            </div>
            <div className="mx-6 mb-6 rounded-2xl bg-green-500/[0.05] border border-green-500/12 px-4 py-3">
              <p className="text-green-400/65 text-xs text-center">On n'est pas plus fort que le bookmaker. On est plus rapide.</p>
            </div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, scaleX: 0 }} whileInView={{ opacity: 1, scaleX: 1 }} transition={{ duration: 0.8, delay: 0.5 }} viewport={{ once: true }} className="mt-10 flex items-center justify-center gap-4">
          <div className="h-px flex-1 max-w-[120px] bg-gradient-to-r from-transparent to-red-500/15" />
          <div className="px-5 py-2.5 rounded-full border border-white/7 bg-white/[0.02]">
            <span className="text-white/35 text-xs">C'est dans cet intervalle que vit l'edge</span>
          </div>
          <div className="h-px flex-1 max-w-[120px] bg-gradient-to-l from-transparent to-green-500/15" />
        </motion.div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
    </section>
  );
}

/* ========== WEEKLY BREAKDOWN ========== */
const WEEKS_DATA = [
  { week: 12, signals: 37, pnl: 1466.5, flatYield: 44.9, note: null },
  { week: 13, signals: 2,  pnl: 172.9,  flatYield: 126.2, note: 'Trêve internationale — très peu de matchs joués' },
  { week: 14, signals: 18, pnl: 597.8,  flatYield: 34.0,  note: null },
  { week: 15, signals: 12, pnl: 493.0,  flatYield: 41.1,  note: 'Nouveau modèle déployé — priorité à la stabilité des signaux' },
  { week: 16, signals: 9,  pnl: 397.0,  flatYield: 44.1,  note: null },
  { week: 17, signals: 10, pnl: 455.0,  flatYield: 45.5,  note: null },
];

function WeeklyBreakdown() {
  const max = Math.max(...WEEKS_DATA.map(w => w.flatYield));
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="mt-5">
      <div className="flex items-center gap-3 mb-5">
        <span className="text-white/25 text-xs uppercase tracking-widest font-medium">Détail par semaine</span>
        <div className="h-px w-8 bg-white/7" />
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-[520px]">
          <div className="grid grid-cols-[56px_64px_1fr_88px] gap-3 px-4 mb-2">
            {['Semaine','Signaux','Rendement plat','P&L'].map(h => (
              <span key={h} className="text-white/15 text-[10px] uppercase tracking-wider font-mono">{h}</span>
            ))}
          </div>
          <div className="space-y-2">
            {WEEKS_DATA.map((w, i) => (
              <motion.div key={w.week} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: i * 0.07 }} viewport={{ once: true }}
                className="group relative rounded-2xl border border-white/[0.05] bg-white/[0.015] px-4 py-3.5 hover:border-white/9 hover:bg-white/[0.02] transition-all duration-300 cursor-default">
                <div className="absolute inset-x-0 top-0 h-px rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-transparent via-white/8 to-transparent pointer-events-none" />
                <div className="grid grid-cols-[56px_64px_1fr_88px] gap-3 items-center">
                  <span className="text-[10px] font-mono font-bold text-white/35 px-2 py-0.5 rounded bg-white/[0.04] w-fit">S{w.week}</span>
                  <span className="text-white/35 text-sm font-mono">{w.signals}</span>
                  <div className="flex items-center gap-2.5">
                    <div className="flex-1 h-[2px] bg-white/[0.05] rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} whileInView={{ width: `${(w.flatYield / max) * 100}%` }} transition={{ duration: 0.9, delay: i * 0.07 + 0.2, ease: 'easeOut' }} viewport={{ once: true }} className="h-full rounded-full bg-green-400/60" />
                    </div>
                    <span className="font-mono text-sm font-bold text-green-400/75 whitespace-nowrap">+{w.flatYield.toFixed(1)}%</span>
                  </div>
                  <div className="text-right"><span className="text-white/65 font-mono text-sm font-bold whitespace-nowrap">+{w.pnl.toLocaleString('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} €</span></div>
                </div>
                {w.note && <div className="mt-2 flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-amber-400/35 flex-shrink-0" /><span className="text-white/18 text-[10px] font-mono italic">{w.note}</span></div>}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ========== PERFORMANCE ========== */
const MODEL_UPGRADE_AT = 57;
const PERF_DATA = { pnl: [-63.8,-58.3,112.4,97.9,-55.7,95.5,433.9,-122.5,182.7,223.7,266.9,-77.0,117.8,98.4,-56.9,84.1,-85.4,85.2,108.2,-60.5,-81.3,-70.1,132.7,-107.3,-112.6,160.1,66.8,67.0,-140.7,-93.2,210.8,-78.1,114.3,170.8,-79.7,61.7,-81.5,88.0,85.0,-84.9,-123.2,94.0,180.1,463.9,-69.8,239.3,-180.3,-115.6,-113.1,-54.7,228.3,-72.5,-45.2,96.8,155.6,70.0,-71.1,75,-100,79,107.0,125.0,170.0,-100,112,-100,165,-100,60,60,112,62,-100,143,110,210,-100,-100,96,16,118,78,117,-100,104,-100,105,21], avgOdd: '2.42', signals: 88, totalPnL: 3582.2 };
const CHART_PATH = "M 58.0 178.5 L 66.3 180.9 L 74.6 176.3 L 82.9 172.3 L 91.2 174.6 L 99.5 170.6 L 107.8 152.9 L 116.1 157.9 L 124.4 150.4 L 132.7 141.2 L 141.0 130.3 L 149.3 133.4 L 157.6 128.6 L 165.9 124.6 L 174.2 126.9 L 182.5 123.5 L 190.8 127.0 L 199.1 123.5 L 207.4 119.0 L 215.7 121.5 L 224.0 124.9 L 232.3 127.7 L 240.6 122.3 L 248.9 126.7 L 257.2 131.3 L 265.5 124.7 L 273.8 122.0 L 282.1 119.3 L 290.4 125.0 L 298.7 128.8 L 307.0 120.2 L 315.3 123.4 L 323.6 118.7 L 331.9 111.7 L 340.2 115.0 L 348.5 112.5 L 356.8 115.8 L 365.1 112.2 L 373.4 108.7 L 381.7 112.2 L 390.0 117.2 L 398.3 113.4 L 406.6 106.0 L 414.9 87.0 L 423.1 89.9 L 431.4 80.1 L 439.7 87.4 L 448.0 92.2 L 456.3 96.8 L 464.6 99.1 L 472.9 89.7 L 481.2 92.7 L 489.5 94.5 L 497.8 90.6 L 506.1 84.2 L 514.4 81.3 L 522.7 84.2 L 531.0 81.2 L 539.3 85.2 L 547.6 82.0 L 555.9 77.6 L 564.2 72.5 L 572.5 65.5 L 580.8 69.6 L 589.1 65.0 L 597.4 69.1 L 605.7 62.4 L 614.0 66.5 L 622.3 64.0 L 630.6 61.6 L 638.9 57.0 L 647.2 54.4 L 655.5 58.5 L 663.8 52.7 L 672.1 48.2 L 680.4 39.6 L 688.7 43.7 L 697.0 47.8 L 705.3 43.8 L 713.6 43.2 L 721.9 38.3 L 730.2 35.1 L 738.5 30.3 L 746.8 34.4 L 755.1 30.2 L 763.4 34.3 L 771.7 30.0 L 780.0 29.1";
const PATH_LENGTH = 851, LAST_X = 780.0, LAST_Y = 29.1, ZERO_Y = 175.9;
const Y_TICKS = [{val:-344,y:190},{val:693,y:147.5},{val:1730,y:105},{val:2767,y:62.5},{val:3804,y:20}];

function PerformanceSection() {
  const ref = useRef(null);
  const [dashOffset, setDashOffset] = useState(PATH_LENGTH);
  const [done, setDone] = useState(false);
  const animStarted = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !animStarted.current) {
        animStarted.current = true;
        const dur = 2800; let start = null;
        const ease = t => t < 0.5 ? 2*t*t : -1+(4-2*t)*t;
        const step = ts => {
          if (!start) start = ts;
          const raw = Math.min((ts - start) / dur, 1);
          setDashOffset(PATH_LENGTH * (1 - ease(raw)));
          raw < 1 ? requestAnimationFrame(step) : (setDashOffset(0), setDone(true));
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.25 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="performance" className="py-28 relative overflow-hidden">
      <style>{`.y-tick-hide{display:none} @media(min-width:640px){.y-tick-hide{display:block}}`}</style>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      <div className="max-w-5xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/7 mb-6">
            <span className="text-white/30 text-xs uppercase tracking-widest">Résultats en direct</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-3">
            <span className="bg-gradient-to-r from-white to-white/50 bg-clip-text text-transparent">Performances · Saison 2025</span>
          </h2>
          <p className="text-white/28 text-base max-w-md mx-auto">Signaux réels uniquement. Pas de backtest. Chaque point = un signal publié sur Telegram avant le coup d'envoi.</p>
        </motion.div>

        <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="rounded-3xl border border-white/[0.06] bg-white/[0.015] p-6 mb-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-white/25 text-xs uppercase tracking-widest font-medium">P&L Cumulatif</span>
            <span className="text-green-400/80 text-xs font-mono font-bold">+{PERF_DATA.totalPnL.toLocaleString('fr-FR')} €</span>
          </div>
          <div className="relative w-full">
            <svg viewBox="0 0 800 220" className="w-full" style={{ height: '220px' }} preserveAspectRatio="none">
              <defs>
                <linearGradient id="perfFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity="0.10" />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#14532d" />
                  <stop offset="100%" stopColor="#4ade80" />
                </linearGradient>
                <clipPath id="chartClip"><rect x="58" y="20" width="722" height="170" /></clipPath>
              </defs>
              {Y_TICKS.map((t, i) => (
                <g key={i} className={i === 1 || i === 3 ? 'y-tick-hide' : ''}>
                  <line x1="58" y1={t.y} x2="780" y2={t.y} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                  <text x="50" y={t.y+4} textAnchor="end" fill="rgba(255,255,255,0.16)" fontSize="10" fontFamily="monospace">{t.val >= 0 ? `+${t.val}` : t.val}</text>
                </g>
              ))}
              <line x1="58" y1={ZERO_Y} x2="780" y2={ZERO_Y} stroke="rgba(255,255,255,0.07)" strokeWidth="1" strokeDasharray="4 4" />
              {(() => {
                const tot = PERF_DATA.pnl.length, step = Math.ceil(tot/6), ticks = [];
                for (let n = 1; n <= tot; n += step) ticks.push(n);
                if (ticks[ticks.length-1] !== tot) ticks.push(tot);
                return ticks.map((n, i) => <text key={i} x={58+((n-1)/(tot-1))*722} y="214" textAnchor="middle" fill="rgba(255,255,255,0.12)" fontSize="9" fontFamily="monospace">#{n}</text>);
              })()}
              {(() => {
                const tot = PERF_DATA.pnl.length, ux = 58+((MODEL_UPGRADE_AT-1)/(tot-1))*722;
                return <g><line x1={ux} y1="20" x2={ux} y2="190" stroke="rgba(239,68,68,0.4)" strokeWidth="1.5" strokeDasharray="4 3" /><text x={ux-7} y="32" fill="rgba(239,68,68,0.55)" fontSize="9" fontFamily="monospace" fontWeight="bold" transform={`rotate(-45,${ux-7},32)`}>Mise à jour modèle</text></g>;
              })()}
              <path d={CHART_PATH+` L ${LAST_X} ${ZERO_Y} L 58 ${ZERO_Y} Z`} fill="url(#perfFill)" clipPath="url(#chartClip)" opacity={done ? 1 : 0.3} />
              <path d={CHART_PATH} fill="none" stroke="url(#lineGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={PATH_LENGTH} strokeDashoffset={dashOffset} clipPath="url(#chartClip)" />
            </svg>
            {done && (
              <div className="absolute pointer-events-none" style={{ left: `${(LAST_X/800)*100}%`, top: `${(LAST_Y/220)*100}%`, transform: 'translate(-50%,-50%)' }}>
                <div className="relative flex items-center justify-center">
                  <div className="absolute w-5 h-5 rounded-full bg-green-500/20 animate-ping" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-white/12 text-[10px] font-mono">Signal n°1</span>
            <span className="text-white/12 text-[10px] font-mono">Signal n°{PERF_DATA.pnl.length}</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-3 gap-4 mb-5">
          {[{ l: 'Signaux envoyés', v: `${PERF_DATA.signals}`, g: false }, { l: 'P&L total', v: `+${PERF_DATA.totalPnL.toLocaleString('fr-FR')} €`, g: true }, { l: 'Cote moyenne', v: PERF_DATA.avgOdd, g: false }].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.08 }} viewport={{ once: true }} className="rounded-2xl border border-white/[0.06] bg-white/[0.015] px-5 py-5 text-center">
              <div className={`text-xl font-black mb-1.5 ${s.g ? 'text-green-400' : 'text-white'}`}>{s.v}</div>
              <div className="text-white/22 text-xs">{s.l}</div>
            </motion.div>
          ))}
        </div>

        <div className="rounded-2xl border border-white/[0.04] bg-white/[0.01] px-5 py-4 flex items-start gap-3">
          <span className="text-white/15 text-xs mt-0.5 flex-shrink-0">ℹ</span>
          <p className="text-white/22 text-xs leading-relaxed">Calculs basés sur les cotes Betclic enregistrées au moment de chaque analyse. Signaux diffusés publiquement sur @mlbet_foot avant le coup d'envoi. Les performances passées ne préjugent pas des résultats futurs.</p>
        </div>
        <WeeklyBreakdown />
      </div>
    </section>
  );
}

/* ========== MAIN ========== */
export default function MLbet() {
  const [showBackModal, setShowBackModal] = useState(false);

  return (
    <div className="min-h-screen bg-[#080808] text-[#ededed]">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-950/[0.18] rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-neutral-900/40 rounded-full blur-3xl" />
      </div>

      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-[#080808]/85 backdrop-blur-xl border-b border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-6 py-2">
          <div className="flex justify-between items-center relative">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-75 transition-opacity">
              <img src="/logo.jpg" alt="Logo" className="w-8 h-8 object-contain rounded-md" />
              <span className="text-[15px] font-semibold text-white tracking-tight">AG Algo Lab</span>
            </Link>
            {/* Nav center logo — much bigger */}
            <div className="absolute left-1/2 -translate-x-1/2">
              <img src="/MLbet_Black_noback.png" alt="MLbet" className="h-16 object-contain" style={{ filter: 'brightness(1.05) contrast(1.05)' }} />
            </div>
            <button onClick={() => setShowBackModal(true)} className="text-sm px-4 py-2 rounded-lg border border-white/8 text-white/45 hover:bg-white/5 hover:text-white transition-colors">
              ← Retour
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="min-h-screen flex items-center justify-center pt-28 pb-16 relative">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.03] border border-white/7 mb-10">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-white/40 text-sm">Intelligence Sportive · 35+ Ligues</span>
            </div>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="text-8xl md:text-[120px] font-black tracking-tight mb-6 leading-none">
            <span className="text-white">ML</span><span className="text-green-400">bet</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-base md:text-lg text-white/40 mb-4">
            Détection de valeur par Machine Learning
          </motion.p>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="flex items-center justify-center gap-5 mb-12 flex-wrap">
            {['100% gratuit','Suivi public et transparent','Aucun signal retouché après coup'].map((t, i) => (
              <span key={i} className="flex items-center gap-1.5 text-white/30 text-sm">
                <span className="text-green-400/80 font-bold">✓</span> {t}
              </span>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="grid grid-cols-3 gap-4 max-w-xl mx-auto mb-10">
            {[{ label: 'Ligues couvertes', value: 35, suffix: '' }, { label: 'Matchs analysés', value: 115000, suffix: '+' }, { label: 'Années de backtest', value: 10, suffix: '' }].map((s, i) => (
              <div key={i} className="bg-[#0e0e0e] border border-white/[0.06] rounded-xl p-4 text-center">
                <div className="text-2xl font-black text-white mb-1"><Counter end={s.value} suffix={s.suffix} /></div>
                <div className="text-white/25 text-xs">{s.label}</div>
              </div>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }} className="flex items-center justify-center gap-4 flex-wrap">
            <a href="#performance" className="px-6 py-3 rounded-xl border border-white/9 bg-white/[0.03] text-white/65 text-sm font-medium hover:bg-white/[0.06] hover:text-white hover:border-white/15 transition-all duration-200">
              Voir les résultats →
            </a>
            <a href="https://t.me/mlbet_foot" target="_blank" rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl border border-green-500/25 bg-green-500/8 text-green-300/90 text-sm font-semibold hover:bg-green-500/15 hover:border-green-500/40 hover:text-green-200 transition-all duration-200 flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              Rejoindre sur Telegram
            </a>
          </motion.div>
        </div>
      </section>

      <HedgeHuntSection />

      {/* WORKFLOW */}
      <section className="py-24 relative">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/7 mb-5">
              <Zap className="w-4 h-4 text-white/35" />
              <span className="text-white/35 text-sm">Architecture du système</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              <span className="bg-gradient-to-r from-white to-white/50 bg-clip-text text-transparent">Comment ça fonctionne</span>
            </h2>
            <p className="text-white/28 max-w-xl mx-auto">De la donnée brute au signal Telegram — un pipeline entièrement automatisé.</p>
          </motion.div>

          <div className="max-w-xl mx-auto">
            <WorkflowNode icon={<Database className="w-5 h-5" />} title="Collecte de données" subtitle="Données de match en direct via une API sportive : calendriers, historiques et statistiques sur 30+ ligues mondiales." color="neutral" delay={0} />
            <WorkflowArrow />

            <WorkflowNode icon={<BarChart2 className="w-5 h-5" />} title="Feature Engineering" subtitle="Des centaines de variables construites depuis les données brutes : moyennes glissantes, indicateurs de forme, force des adversaires, splits domicile/extérieur..." color="neutral" delay={0.1}>
              <div className="mt-2 grid grid-cols-2 gap-1.5">
                {[{label:'Variables',val:'300+'},{label:'Fenêtres glissantes',val:'5 / 10 / 20 matchs'}].map(r => (
                  <div key={r.label} className="bg-white/[0.03] border border-white/[0.06] rounded-lg px-2.5 py-1.5">
                    <div className="text-white/18 text-[9px] uppercase tracking-wider">{r.label}</div>
                    <div className="text-white/55 text-[11px] font-medium">{r.val}</div>
                  </div>
                ))}
              </div>
            </WorkflowNode>
            <WorkflowArrow />

            <WorkflowNode icon={<Brain className="w-5 h-5" />} title="Inférence du modèle" subtitle="Architecture confidentielle, ancrée dans la littérature scientifique sur la modélisation des résultats de matchs." color="neutral" delay={0.1}>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {['Études scientifiques','Architecture confidentielle','Scoring probabiliste'].map(t => (
                  <span key={t} className="px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.07] text-white/40 text-[10px]">{t}</span>
                ))}
              </div>
            </WorkflowNode>
            <WorkflowArrow />

            <WorkflowNode icon={<TrendingUp className="w-5 h-5" />} title="Calibration des probabilités" subtitle="Les sorties brutes du modèle sont recalibrées via régression isotonique pour s'assurer que les probabilités prédites reflètent les fréquences réelles observées." color="neutral" delay={0.15}>
              <div className="mt-2 grid grid-cols-2 gap-1.5">
                {[{label:'Méthode',val:'Régression isotonique'},{label:'Sortie',val:'Probabilité calibrée'}].map(r => (
                  <div key={r.label} className="bg-white/[0.03] border border-white/[0.06] rounded-lg px-2.5 py-1.5">
                    <div className="text-white/18 text-[9px] uppercase tracking-wider">{r.label}</div>
                    <div className="text-white/55 text-[11px] font-medium">{r.val}</div>
                  </div>
                ))}
              </div>
            </WorkflowNode>
            <WorkflowArrow />

            <WorkflowNode icon={<Globe className="w-5 h-5" />} title="Récupération des cotes en temps réel" subtitle="Cotes bookmakers récupérées en direct via API et comparées à la probabilité calibrée du modèle." color="neutral" delay={0.2} />
            <WorkflowArrow />

            <motion.div initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.25 }} viewport={{ once: true }}
              className="relative rounded-2xl border border-white/[0.09] bg-[#0d0d0d] p-5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-white/[0.04] text-white/50"><span className="text-lg">⚖️</span></div>
                <div className="flex-1">
                  <h4 className="font-bold text-white text-sm mb-1">Détection de valeur</h4>
                  <p className="text-white/32 text-xs leading-relaxed">La cote du bookmaker dépasse-t-elle significativement notre cote juste calibrée ? Le signal s'inscrit-il dans la fourchette de seuil optimal déterminée par Optuna ?</p>
                </div>
              </div>
              <div className="flex justify-between mt-4 pt-3 border-t border-white/[0.05]">
                <div className="flex items-center gap-2"><XCircle className="w-4 h-4 text-red-400/65" /><span className="text-red-400/55 text-xs">Hors seuil → ignoré</span></div>
                <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-400/75" /><span className="text-green-400/65 text-xs font-medium">Dans la fourchette → signal validé</span></div>
              </div>
            </motion.div>

            <WorkflowArrow condition="yes" />

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} viewport={{ once: true }}
              className="rounded-2xl border border-green-500/18 bg-green-500/[0.035] p-5">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-green-500/10 text-green-400"><Send className="w-5 h-5" /></div>
                <div>
                  <h4 className="font-bold text-white text-sm">Signal envoyé 🚀</h4>
                  <p className="text-white/32 text-xs">Match, cote, confiance et edge diffusés sur Telegram</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-[#0e0e0e] border border-white/[0.06] rounded-xl p-3 flex items-center gap-2.5">
                  <span className="text-lg">📢</span>
                  <div><div className="text-white/55 text-xs font-medium">Canal</div><div className="text-white/22 text-[10px]">@mlbet_foot</div></div>
                </div>
                <div className="bg-[#0e0e0e] border border-white/[0.06] rounded-xl p-3 flex items-center gap-2.5">
                  <span className="text-lg">🤖</span>
                  <div><div className="text-white/55 text-xs font-medium">Bot</div><div className="text-white/22 text-[10px]">Filtrage par pays</div></div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* TELEGRAM DEMOS */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        <div className="max-w-6xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              <span className="bg-gradient-to-r from-white to-white/50 bg-clip-text text-transparent">Interfaces de livraison</span>
            </h2>
            <p className="text-white/28 max-w-lg mx-auto">Un canal de diffusion pour tous les signaux, un bot interactif pour filtrer par pays — disponibles sur <span className="text-white/45 font-medium">@mlbet_foot</span>.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-start justify-items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }} viewport={{ once: true }} className="flex flex-col items-center gap-5 w-full max-w-[340px]">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/7 mb-3">
                  <span className="text-white/40 text-sm">🤖</span><span className="text-white/35 text-xs">Bot interactif</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-1">MLbet Bot</h3>
                <p className="text-white/28 text-sm">Filtrez par pays, obtenez les signaux du jour à la demande.</p>
              </div>
              <TelegramBot />
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} viewport={{ once: true }} className="flex flex-col items-center gap-5 w-full max-w-[340px]">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/7 mb-3">
                  <span className="text-white/40 text-sm">📢</span><span className="text-white/35 text-xs">Canal de diffusion</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-1">Canal MLbet</h3>
                <p className="text-white/28 text-sm">Tous les signaux quotidiens — confiance, cote juste et edge.</p>
              </div>
              <TelegramChannel />
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} viewport={{ once: true }} className="flex justify-center mt-12">
            <a href="https://t.me/mlbet_foot" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2.5 px-7 py-3.5 rounded-xl border border-green-500/20 bg-green-500/[0.06] text-green-300/85 font-semibold hover:bg-green-500/12 hover:border-green-500/35 transition-all duration-200">
              <ExternalLink className="w-4 h-4" />
              Rejoindre @mlbet_foot
            </a>
          </motion.div>
        </div>
      </section>

      <PerformanceSection />

      {/* Footer */}
      <footer className="py-10 border-t border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col gap-5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2.5">
              <img src="/logo.jpg" alt="Logo" className="w-7 h-7 object-contain rounded-md" />
              <span className="text-sm text-white/25">AG Algo Lab — MLbet est un outil de recherche analytique.</span>
            </div>
            <button onClick={() => setShowBackModal(true)} className="text-sm text-white/20 hover:text-white/60 transition-colors font-mono">← Retour à l'accueil</button>
          </div>
          <p className="text-center text-white/14 text-xs leading-relaxed max-w-2xl mx-auto">
            Ceci ne constitue pas un conseil financier. MLbet est un outil d'analyse quantitative à but strictement informatif. Les performances passées ne préjugent pas des résultats futurs. Le pari sportif comporte des risques — pariez de manière responsable.
          </p>
        </div>
      </footer>

      {/* MODAL */}
      <AnimatePresence>
        {showBackModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] flex items-center justify-center px-6 bg-black/75 backdrop-blur-md" onClick={() => setShowBackModal(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} transition={{ duration: 0.3, ease: 'easeOut' }}
              onClick={e => e.stopPropagation()} className="relative w-full max-w-md rounded-3xl border border-white/9 bg-[#0c0c0c] p-7 shadow-2xl shadow-black/60">
              <div className="absolute -top-px left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-green-400/30 to-transparent" />
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/7 flex items-center justify-center"><span className="text-base">🔒</span></div>
                <span className="text-white/28 text-[10px] font-bold uppercase tracking-widest">Page cachée</span>
              </div>
              <h3 className="text-xl font-black text-white mb-2 leading-snug">Vous êtes sur le point de quitter un recoin caché d'AG Algo Lab</h3>
              <p className="text-white/38 text-sm leading-relaxed mb-2">Cette page n'est répertoriée nulle part sur le site public — accessible uniquement via lien direct.</p>
              <p className="text-white/38 text-sm leading-relaxed mb-6">Une fois de retour à l'accueil, <span className="text-white/65 font-medium">il n'y aura aucun bouton pour revenir ici</span>. Pensez à mettre l'URL en favori.</p>
              <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] px-3 py-2.5 mb-6 flex items-center gap-2">
                <span className="text-white/18 text-[10px] font-mono uppercase tracking-wider flex-shrink-0">URL</span>
                <code className="text-white/40 text-xs font-mono truncate">{typeof window !== 'undefined' ? window.location.href : ''}</code>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowBackModal(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-white/7 text-white/45 text-sm font-medium hover:bg-white/5 hover:text-white transition-colors">Rester ici</button>
                <Link to="/" className="flex-1 px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/9 text-white text-sm font-semibold hover:bg-white/9 transition-colors text-center">Retour à l'accueil →</Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
