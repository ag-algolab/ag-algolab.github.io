import React, { useState, useEffect, useRef } from "react";

/* ================= MOBILE DETECTION ================= */
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler, { passive: true });
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
}

/* ================= PIPELINE MOBILE — version statique simplifiée ================= */
function PipelineMobile() {
  const [step, setStep] = useState(0);
  const [rawProba, setRawProba] = useState(0.73);
  const [calibratedProba, setCalibratedProba] = useState(0.68);

  useEffect(() => {
    const cycle = () => {
      const raw = +(Math.random() * 0.5 + 0.35).toFixed(2);
      const cal = +(Math.min(0.95, Math.max(0.08, raw * (0.85 + Math.random() * 0.25)))).toFixed(2);
      setStep(0);
      setTimeout(() => setStep(1), 600);
      setTimeout(() => { setRawProba(raw); setStep(2); }, 2000);
      setTimeout(() => setStep(3), 3500);
      setTimeout(() => { setCalibratedProba(cal); setStep(4); }, 5000);
    };
    cycle();
    const id = setInterval(cycle, 8000);
    return () => clearInterval(id);
  }, []);

  const riskColor = calibratedProba > 0.7 ? "#ef4444" : calibratedProba > 0.4 ? "#eab308" : "#22c55e";
  const riskLabel = calibratedProba > 0.7 ? "HIGH" : calibratedProba > 0.4 ? "MEDIUM" : "LOW";

  const inputTags = [
    { label: "Claim Amount", color: "#60a5fa" },
    { label: "Policy Age", color: "#4ade80" },
    { label: "Vehicle Price", color: "#a78bfa" },
    { label: "Nb. Claims", color: "#4ade80" },
    { label: "Accident Area", color: "#f87171" },
    { label: "Vehicle Type", color: "#a78bfa" },
    { label: "Witness", color: "#f87171" },
    { label: "Police Report", color: "#f87171" },
  ];

  return (
    <div className="w-full flex flex-col gap-3">

      {/* STEP 1 — Inputs */}
      <div className="rounded-2xl border bg-[#141f38] border-white/15 p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg bg-blue-500/20 flex items-center justify-center text-xs text-blue-400 font-bold">1</div>
          <span className="text-white font-semibold text-sm">Claim Features</span>
          <div className="ml-auto w-2 h-2 rounded-full bg-blue-400"/>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {inputTags.map((t, i) => (
            <span key={i} className="text-[11px] px-2 py-1 rounded-full border"
              style={{ borderColor: t.color + "40", color: t.color, backgroundColor: t.color + "15" }}>
              {t.label}
            </span>
          ))}
        </div>
      </div>

      {/* Arrow */}
      <div className={`flex justify-center transition-opacity duration-300 ${step >= 1 ? "opacity-100" : "opacity-20"}`}>
        <div className={`w-0.5 h-5 rounded-full ${step >= 1 ? "bg-gradient-to-b from-blue-500 to-purple-500" : "bg-white/20"}`}/>
      </div>

      {/* STEP 2 — CatBoost */}
      <div className={`rounded-2xl border p-4 transition-all duration-500 ${step >= 2 ? "bg-[#1a2744] border-blue-500/40" : "bg-[#141f38] border-white/10"}`}>
        <div className="flex items-center gap-2 mb-3">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-all duration-500 ${step >= 2 ? "bg-blue-500/30 text-blue-300" : "bg-white/5 text-white/30"}`}>2</div>
          <div>
            <span className={`font-semibold text-sm block transition-colors duration-500 ${step >= 2 ? "text-white" : "text-white/40"}`}>CatBoost</span>
            <span className="text-[10px] text-white/30">Oblivious Decision Tree</span>
          </div>
          {step === 1 && <span className="ml-auto text-[10px] text-blue-400 animate-pulse">⚡ Processing...</span>}
          {step >= 2 && <span className="ml-auto text-[10px] text-green-400">✓ Done</span>}
        </div>

        {/* SVG tree — léger, zéro filtre */}
        <div className="rounded-xl bg-[#0e1424]/80 border border-white/5 p-2 mb-3 overflow-hidden">
          <svg viewBox="0 0 320 115" className="w-full h-16">
            <rect x="100" y="5" width="120" height="22" rx="5"
              fill={step>=2?"rgba(59,130,246,0.3)":"rgba(255,255,255,0.05)"}
              stroke={step>=2?"#3b82f6":"rgba(255,255,255,0.15)"} strokeWidth="1.5"/>
            <text x="160" y="19" textAnchor="middle" fill={step>=2?"#60a5fa":"rgba(255,255,255,0.3)"}
              fontSize="9" fontFamily="monospace" fontWeight="600">claim_amount ≤ 5000</text>
            <line x1="130" y1="27" x2="80" y2="52" stroke={step>=2?"#3b82f6":"rgba(255,255,255,0.1)"} strokeWidth="1.5"/>
            <line x1="190" y1="27" x2="240" y2="52" stroke={step>=2?"#3b82f6":"rgba(255,255,255,0.1)"} strokeWidth="1.5"/>
            {[[20,52],[180,52]].map(([x,y],i)=>(
              <g key={i}>
                <rect x={x} y={y} width="120" height="20" rx="5"
                  fill={step>=2?"rgba(59,130,246,0.2)":"rgba(255,255,255,0.05)"}
                  stroke={step>=2?"#3b82f6":"rgba(255,255,255,0.1)"} strokeWidth="1"/>
                <text x={x+60} y={y+13} textAnchor="middle" fill={step>=2?"#60a5fa":"rgba(255,255,255,0.3)"}
                  fontSize="8" fontFamily="monospace">policy_age ≤ 2</text>
              </g>
            ))}
            {[[80,72,50,95],[80,72,110,95],[240,72,210,95],[240,72,270,95]].map(([x1,y1,x2,y2],i)=>(
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={step>=2?"#22c55e":"rgba(255,255,255,0.08)"} strokeWidth="1"/>
            ))}
            {[["0.15",50],["0.42",110],["0.58",210],["0.87",270]].map(([v,x],i)=>(
              <g key={i}>
                <rect x={x-18} y="85" width="36" height="20" rx="10"
                  fill={step>=2?"rgba(34,197,94,0.25)":"rgba(255,255,255,0.05)"}
                  stroke={step>=2?"#22c55e":"rgba(255,255,255,0.1)"} strokeWidth="1"/>
                <text x={x} y="98" textAnchor="middle" fill={step>=2?"#4ade80":"rgba(255,255,255,0.3)"}
                  fontSize="9" fontFamily="monospace" fontWeight="600">{v}</text>
              </g>
            ))}
          </svg>
        </div>

        <div className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-white/5 border border-white/10">
          <span className="text-xs text-white/50">Raw Probability</span>
          <span className={`font-mono text-xl font-bold transition-all duration-700 ${step >= 2 ? "text-blue-300" : "text-white/20"}`}>
            {rawProba.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Arrow */}
      <div className={`flex justify-center transition-opacity duration-300 ${step >= 3 ? "opacity-100" : "opacity-20"}`}>
        <div className={`w-0.5 h-5 rounded-full ${step >= 3 ? "bg-gradient-to-b from-purple-500 to-pink-500" : "bg-white/20"}`}/>
      </div>

      {/* STEP 3 — Isotonic */}
      <div className={`rounded-2xl border p-4 transition-all duration-500 ${step >= 4 ? "bg-[#1f1744] border-purple-500/40" : "bg-[#141f38] border-white/10"}`}>
        <div className="flex items-center gap-2 mb-3">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-all duration-500 ${step >= 4 ? "bg-purple-500/30 text-purple-300" : "bg-white/5 text-white/30"}`}>3</div>
          <div>
            <span className={`font-semibold text-sm block transition-colors duration-500 ${step >= 4 ? "text-white" : "text-white/40"}`}>Isotonic Calibration</span>
            <span className="text-[10px] text-white/30">Probability Correction</span>
          </div>
          {step === 3 && <span className="ml-auto text-[10px] text-purple-400 animate-pulse">⚡ Calibrating...</span>}
          {step >= 4 && <span className="ml-auto text-[10px] text-green-400">✓ Done</span>}
        </div>

        {/* Calibration curve — SVG pur, zéro canvas */}
        <div className="rounded-xl bg-[#0e1424]/80 border border-white/5 p-2 mb-3 overflow-hidden">
          <svg viewBox="0 0 280 80" className="w-full h-16">
            {[0,1,2,3,4].map(i=>(<line key={i} x1={i*70} y1="0" x2={i*70} y2="80" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>))}
            {[0,1,2,3].map(i=>(<line key={i} x1="0" y1={i*27} x2="280" y2={i*27} stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>))}
            <line x1="0" y1="80" x2="280" y2="0" stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="4 3"/>
            <defs>
              <linearGradient id="cg" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={step>=4?"#8b5cf6":"rgba(255,255,255,0.2)"}/>
                <stop offset="100%" stopColor={step>=4?"#ec4899":"rgba(255,255,255,0.2)"}/>
              </linearGradient>
            </defs>
            <path d="M0,80 C20,76 40,70 70,62 S120,48 140,42 S200,24 230,14 S260,6 280,2"
              fill="none" stroke="url(#cg)" strokeWidth="2.5" strokeLinecap="round"/>
            {step >= 4 && (() => {
              const px = rawProba * 280;
              const py = 80 - Math.pow(rawProba, 0.85) * (1 - 0.1 * Math.sin(rawProba * Math.PI)) * 80;
              return (
                <g>
                  <line x1={px} y1="80" x2={px} y2={py} stroke="rgba(139,92,246,0.5)" strokeWidth="1.5" strokeDasharray="3 3"/>
                  <line x1="0" y1={py} x2={px} y2={py} stroke="rgba(139,92,246,0.5)" strokeWidth="1.5" strokeDasharray="3 3"/>
                  <circle cx={px} cy={py} r="5" fill="#8b5cf6"/>
                  <circle cx={px} cy={py} r="2.5" fill="white"/>
                </g>
              );
            })()}
          </svg>
        </div>

        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10">
          <span className="font-mono text-sm text-white/50">{rawProba.toFixed(2)}</span>
          <div className={`flex-1 text-center text-xs transition-colors duration-500 ${step >= 4 ? "text-purple-400" : "text-white/20"}`}>→ f(x) →</div>
          <span className={`font-mono text-xl font-bold transition-all duration-700 ${step >= 4 ? "text-purple-300" : "text-white/20"}`}>
            {calibratedProba.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Arrow */}
      <div className={`flex justify-center transition-opacity duration-300 ${step >= 4 ? "opacity-100" : "opacity-20"}`}>
        <div className="w-0.5 h-5 rounded-full" style={{ background: step >= 4 ? riskColor : "rgba(255,255,255,0.2)" }}/>
      </div>

      {/* STEP 4 — Output */}
      <div className="rounded-2xl border p-4 transition-all duration-700"
        style={step >= 4
          ? { background: riskColor + "18", borderColor: riskColor + "80" }
          : { background: "#141f38", borderColor: "rgba(255,255,255,0.1)" }}>
        <div className="flex items-center gap-4">
          <div className="relative w-20 h-20 flex-shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="5"/>
              <circle cx="32" cy="32" r="28" fill="none"
                stroke={step >= 4 ? riskColor : "rgba(255,255,255,0.1)"}
                strokeWidth="5" strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 28}
                strokeDashoffset={(1 - (step >= 4 ? calibratedProba : 0)) * 2 * Math.PI * 28}
                className="transition-all duration-700 ease-out"/>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-bold text-xl transition-all duration-700"
                style={{ color: step >= 4 ? riskColor : "rgba(255,255,255,0.2)" }}>
                {Math.round((step >= 4 ? calibratedProba : 0) * 100)}%
              </span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] text-white/40 uppercase tracking-widest mb-2">Fraud Risk Score</div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full font-bold text-sm border transition-all duration-700"
              style={step >= 4
                ? { color: riskColor, borderColor: riskColor + "60", background: riskColor + "20" }
                : { color: "rgba(255,255,255,0.3)", borderColor: "rgba(255,255,255,0.1)" }}>
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: step >= 4 ? riskColor : "rgba(255,255,255,0.3)" }}/>
              {riskLabel} RISK
            </div>
            <div className="mt-2 text-[11px] text-white/40 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"/>
              {step >= 4 ? "Live prediction" : "Awaiting data..."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= ANIMATED ARROW ================= */
function AnimatedArrow({ active }) {
  return (
    <div className={`relative transition-all duration-500 ${active ? "opacity-100 scale-105" : "opacity-30"}`}>
      <svg width="60" height="70" viewBox="0 0 60 70" fill="none" className="overflow-visible">
        <defs>
          <linearGradient id="arrowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6"/><stop offset="100%" stopColor="#8b5cf6"/>
          </linearGradient>
          <filter id="glowArrow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <path d="M30 5V55" stroke={active?"url(#arrowGrad)":"rgba(255,255,255,0.2)"} strokeWidth={active?4:2} strokeLinecap="round" filter={active?"url(#glowArrow)":""} className="transition-all duration-500"/>
        <path d="M30 55L18 42M30 55L42 42" stroke={active?"url(#arrowGrad)":"rgba(255,255,255,0.2)"} strokeWidth={active?4:2} strokeLinecap="round" strokeLinejoin="round" filter={active?"url(#glowArrow)":""} className="transition-all duration-500"/>
        {active&&(<>
          <circle r="5" fill="#8b5cf6" filter="url(#glowArrow)"><animateMotion dur="0.5s" repeatCount="indefinite" path="M30 5 L30 55"/></circle>
          <circle r="4" fill="#3b82f6" filter="url(#glowArrow)"><animateMotion dur="0.5s" repeatCount="indefinite" path="M30 5 L30 55" begin="0.2s"/></circle>
        </>)}
      </svg>
    </div>
  );
}

/* ================= OBLIVIOUS TREE ================= */
function ObliviousTreeViz({ active, processing, treeValues }) {
  const [activeLevel, setActiveLevel] = useState(-1);
  useEffect(() => {
    if (!processing) { if (active) setActiveLevel(2); return; }
    setActiveLevel(0);
    const t1 = setTimeout(() => setActiveLevel(1), 1000);
    const t2 = setTimeout(() => setActiveLevel(2), 2000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [processing, active]);
  const { feature1, threshold1, feature2, threshold2, leaves } = treeValues;
  const cx=200, lY=[30,85,145], l1L=cx-90, l1R=cx+90, lx=[cx-135,cx-45,cx+45,cx+135];
  return (
    <svg viewBox="0 0 400 170" className="w-full h-full">
      <defs>
        <filter id="nGlow"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <linearGradient id="eGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#3b82f6"/><stop offset="100%" stopColor="#8b5cf6"/></linearGradient>
      </defs>
      {[l1L,l1R].map((x,i)=>(<line key={i} x1={cx} y1={lY[0]+14} x2={x} y2={lY[1]-14} stroke={activeLevel>=1?"url(#eGrad)":"rgba(255,255,255,0.15)"} strokeWidth={activeLevel>=1?2.5:1.5} className="transition-all duration-700"/>))}
      {[[l1L,0],[l1L,1],[l1R,2],[l1R,3]].map(([px,li])=>(<line key={li} x1={px} y1={lY[1]+14} x2={lx[li]} y2={lY[2]-12} stroke={activeLevel>=2?"url(#eGrad)":"rgba(255,255,255,0.15)"} strokeWidth={activeLevel>=2?2.5:1.5} className="transition-all duration-700"/>))}
      <g>
        <rect x={cx-70} y={lY[0]-14} width={140} height={28} rx={6} fill={activeLevel>=0?"rgba(59,130,246,0.3)":"rgba(255,255,255,0.05)"} stroke={activeLevel>=0?"#3b82f6":"rgba(255,255,255,0.2)"} strokeWidth={activeLevel>=0?2:1} filter={processing&&activeLevel===0?"url(#nGlow)":""} className="transition-all duration-500"/>
        <text x={cx} y={lY[0]+4} textAnchor="middle" fill={activeLevel>=0?"#60a5fa":"rgba(255,255,255,0.4)"} fontSize="11" fontFamily="monospace" fontWeight="600">{feature1} ≤ {threshold1}</text>
      </g>
      {[l1L,l1R].map((x,i)=>(<g key={i}><rect x={x-60} y={lY[1]-14} width={120} height={28} rx={6} fill={activeLevel>=1?"rgba(59,130,246,0.25)":"rgba(255,255,255,0.05)"} stroke={activeLevel>=1?"#3b82f6":"rgba(255,255,255,0.2)"} strokeWidth={activeLevel>=1?2:1} filter={processing&&activeLevel===1?"url(#nGlow)":""} className="transition-all duration-500"/><text x={x} y={lY[1]+4} textAnchor="middle" fill={activeLevel>=1?"#60a5fa":"rgba(255,255,255,0.4)"} fontSize="10" fontFamily="monospace" fontWeight="500">{feature2} ≤ {threshold2}</text></g>))}
      {leaves.map((v,i)=>(<g key={i}><rect x={lx[i]-24} y={lY[2]-12} width={48} height={24} rx={12} fill={activeLevel>=2?"rgba(34,197,94,0.3)":"rgba(255,255,255,0.05)"} stroke={activeLevel>=2?"#22c55e":"rgba(255,255,255,0.2)"} strokeWidth={activeLevel>=2?2:1} filter={processing&&activeLevel===2?"url(#nGlow)":""} className="transition-all duration-500"/><text x={lx[i]} y={lY[2]+4} textAnchor="middle" fill={activeLevel>=2?"#4ade80":"rgba(255,255,255,0.4)"} fontSize="12" fontFamily="monospace" fontWeight="600">{v}</text></g>))}
      {processing&&activeLevel===2&&leaves.map((_,i)=>(<circle key={i} cx={lx[i]} cy={lY[2]} r="18" fill="none" stroke="#22c55e" strokeWidth="2" opacity="0.4"><animate attributeName="r" from="14" to="28" dur="0.8s" repeatCount="indefinite" begin={`${i*0.15}s`}/><animate attributeName="opacity" from="0.5" to="0" dur="0.8s" repeatCount="indefinite" begin={`${i*0.15}s`}/></circle>))}
      <g opacity={activeLevel>=1?0.6:0.2} className="transition-all duration-500">
        <path d={`M${l1L+62} ${lY[1]} Q${cx} ${lY[1]-20} ${l1R-62} ${lY[1]}`} fill="none" stroke="#8b5cf6" strokeWidth="1" strokeDasharray="4 3"/>
        <text x={cx} y={lY[1]-22} textAnchor="middle" fill="#a78bfa" fontSize="8" fontStyle="italic">same split</text>
      </g>
    </svg>
  );
}

/* ================= CATBOOST VISUALIZER ================= */
function CatBoostVisualizer({ active, processing, rawProba, treeValues }) {
  const [dp, setDp] = useState(rawProba);
  useEffect(() => {
    if (!active) return;
    const s=dp, e=rawProba, t0=Date.now();
    const go=()=>{ const p=Math.min((Date.now()-t0)/1000,1), ease=1-Math.pow(1-p,4); setDp(s+(e-s)*ease); if(p<1)requestAnimationFrame(go); };
    requestAnimationFrame(go);
  }, [rawProba, active]);
  return (
    <div className={`relative w-full max-w-xl p-6 rounded-2xl border transition-all duration-700 ${active?"bg-gradient-to-br from-[#1a2744] to-[#0e1424] border-blue-500/50 shadow-[0_0_40px_rgba(59,130,246,0.2)]":"bg-[#141f38] border-white/10"}`}>
      {processing&&<div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none"><div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/5"/><div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-transparent to-purple-500/20 blur-xl animate-pulse"/></div>}
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 ${processing?"bg-blue-500/30 scale-110":active?"bg-blue-500/20":"bg-white/5"}`}>
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke={active?"#60a5fa":"#ffffff40"} strokeWidth="2"><circle cx="12" cy="4" r="2"/><circle cx="6" cy="11" r="2"/><circle cx="18" cy="11" r="2"/><circle cx="3" cy="18" r="2"/><circle cx="9" cy="18" r="2"/><circle cx="15" cy="18" r="2"/><circle cx="21" cy="18" r="2"/><line x1="12" y1="6" x2="6" y2="9"/><line x1="12" y1="6" x2="18" y2="9"/><line x1="6" y1="13" x2="3" y2="16"/><line x1="6" y1="13" x2="9" y2="16"/><line x1="18" y1="13" x2="15" y2="16"/><line x1="18" y1="13" x2="21" y2="16"/></svg>
          </div>
          <div className="flex-1"><h3 className="font-bold text-lg text-white/90">CatBoost</h3><p className="text-sm text-white/50">Oblivious Decision Tree</p></div>
          <div className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-500 ${processing?"bg-blue-500/30 text-blue-300 animate-pulse":active?"bg-green-500/20 text-green-300":"bg-white/5 text-white/30"}`}>{processing?"⚡ Processing...":active?"✓ Ready":"Idle"}</div>
        </div>
        <div className="relative h-48 mb-4 rounded-xl bg-[#0e1424]/80 border border-white/5 overflow-hidden">
          <div className="absolute inset-0 opacity-20" style={{backgroundImage:"radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)",backgroundSize:"16px 16px"}}/>
          <ObliviousTreeViz active={active} processing={processing} treeValues={treeValues}/>
        </div>
        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-3"><div className={`w-2.5 h-2.5 rounded-full ${processing?"bg-blue-400 animate-ping":active?"bg-green-400":"bg-white/30"}`}/><span className="text-sm text-white/60">Raw Probability</span></div>
          <div className={`px-5 py-2.5 rounded-xl font-mono text-xl font-bold transition-all duration-700 ${active?"bg-gradient-to-r from-blue-500/25 to-blue-600/25 border border-blue-500/50 text-blue-300":"bg-white/5 border border-white/10 text-white/40"}`}>{dp.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
}

/* ================= ISOTONIC ================= */
function IsotonicCalibrationVisualizer({ active, processing, inputProba, outputProba }) {
  const canvasRef = useRef(null);
  const [ap, setAp] = useState(0);
  useEffect(() => {
    if (!processing) return;
    const t0=Date.now();
    const go=()=>{ const p=Math.min((Date.now()-t0)/2000,1); setAp(1-Math.pow(1-p,4)); if(p<1)requestAnimationFrame(go); };
    requestAnimationFrame(go);
  }, [processing, inputProba]);
  useEffect(() => {
    const canvas=canvasRef.current; if(!canvas) return;
    const ctx=canvas.getContext("2d");
    const dpr=Math.min(window.devicePixelRatio||1,2);
    const w=canvas.clientWidth, h=canvas.clientHeight;
    canvas.width=w*dpr; canvas.height=h*dpr; ctx.scale(dpr,dpr);
    ctx.clearRect(0,0,w,h);
    ctx.strokeStyle="rgba(255,255,255,0.05)"; ctx.lineWidth=1;
    for(let i=0;i<=10;i++){ ctx.beginPath();ctx.moveTo(i*w/10,0);ctx.lineTo(i*w/10,h);ctx.stroke(); ctx.beginPath();ctx.moveTo(0,i*h/10);ctx.lineTo(w,i*h/10);ctx.stroke(); }
    ctx.strokeStyle="rgba(255,255,255,0.15)";ctx.setLineDash([5,5]);ctx.beginPath();ctx.moveTo(0,h);ctx.lineTo(w,0);ctx.stroke();ctx.setLineDash([]);
    const cal=x=>Math.pow(x,0.85)*(1-0.1*Math.sin(x*Math.PI));
    const g=ctx.createLinearGradient(0,0,w,0);g.addColorStop(0,active?"#8b5cf6":"rgba(255,255,255,0.2)");g.addColorStop(1,active?"#ec4899":"rgba(255,255,255,0.2)");
    ctx.strokeStyle=g;ctx.lineWidth=active?3:2;ctx.lineCap="round";ctx.beginPath();
    for(let i=0;i<=100;i++){ const x=i/100,y=cal(x); if(i===0)ctx.moveTo(x*w,h-y*h);else ctx.lineTo(x*w,h-y*h); }ctx.stroke();
    if(active){ const cx2=processing?inputProba*ap:inputProba,px=cx2*w,py=h-cal(cx2)*h;
      ctx.strokeStyle="rgba(139,92,246,0.5)";ctx.lineWidth=2;ctx.setLineDash([4,4]);ctx.beginPath();ctx.moveTo(px,h);ctx.lineTo(px,py);ctx.stroke();ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(0,py);ctx.stroke();ctx.setLineDash([]);
      ctx.shadowColor="#8b5cf6";ctx.shadowBlur=processing?20:12;ctx.fillStyle="#8b5cf6";ctx.beginPath();ctx.arc(px,py,processing?8:6,0,Math.PI*2);ctx.fill();
      ctx.shadowColor="transparent";ctx.shadowBlur=0;ctx.fillStyle="#fff";ctx.beginPath();ctx.arc(px,py,3,0,Math.PI*2);ctx.fill(); }
  }, [active, processing, inputProba, outputProba, ap]);
  return (
    <div className={`relative w-full max-w-xl p-6 rounded-2xl border transition-all duration-700 ${active?"bg-gradient-to-br from-[#1f1744] to-[#141424] border-purple-500/50 shadow-[0_0_40px_rgba(139,92,246,0.2)]":"bg-[#141f38] border-white/10"}`}>
      {processing&&<div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none"><div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/5"/><div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 via-transparent to-pink-500/20 blur-xl animate-pulse"/></div>}
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 ${processing?"bg-purple-500/30 scale-110":active?"bg-purple-500/20":"bg-white/5"}`}><span className="text-2xl">📐</span></div>
          <div className="flex-1"><h3 className="font-bold text-lg text-white/90">Isotonic Calibration</h3><p className="text-sm text-white/50">Probability Correction</p></div>
          <div className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-500 ${processing?"bg-purple-500/30 text-purple-300 animate-pulse":active?"bg-green-500/20 text-green-300":"bg-white/5 text-white/30"}`}>{processing?"⚡ Calibrating...":active?"✓ Ready":"Idle"}</div>
        </div>
        <div className="relative mb-4 rounded-xl bg-[#0e1424]/80 border border-white/5 overflow-hidden"><canvas ref={canvasRef} className="w-full h-44 block"/>
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] text-white/40 bg-[#0e1424]/90 px-2 py-0.5 rounded">Raw Output</div>
          <div className="absolute left-1 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] text-white/40 bg-[#0e1424]/90 px-2 py-0.5 rounded">Calibrated</div>
        </div>
        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="text-center"><div className="text-[10px] text-white/40 mb-1.5">Input</div><div className={`px-4 py-2 rounded-lg font-mono text-base transition-all duration-500 ${active?"bg-white/10 text-white/80 border border-white/20":"bg-white/5 text-white/40"}`}>{inputProba.toFixed(2)}</div></div>
          <div className={`flex items-center gap-2 ${processing?"text-purple-400 scale-110":active?"text-purple-400/60":"text-white/20"}`}><span className="text-xl">→</span><span className={`text-sm font-mono px-2 py-1 rounded ${processing?"bg-purple-500/20 animate-pulse":""}`}>f(x)</span><span className="text-xl">→</span></div>
          <div className="text-center"><div className="text-[10px] text-white/40 mb-1.5">Calibrated</div><div className={`px-4 py-2 rounded-lg font-mono text-base font-bold transition-all duration-700 ${active?"bg-gradient-to-r from-purple-500/25 to-pink-500/25 border border-purple-500/50 text-purple-300":"bg-white/5 border border-white/10 text-white/40"}`}>{outputProba.toFixed(2)}</div></div>
        </div>
      </div>
    </div>
  );
}

/* ================= OUTPUT DISPLAY ================= */
function OutputDisplay({ probability, active, adjusting }) {
  const [dp, setDp] = useState(probability);
  useEffect(() => {
    if (!active) return;
    const s=dp,e=probability,t0=Date.now();
    const go=()=>{ const p=Math.min((Date.now()-t0)/1500,1),ease=1-Math.pow(1-p,4); setDp(s+(e-s)*ease); if(p<1)requestAnimationFrame(go); };
    requestAnimationFrame(go);
  }, [probability, active]);
  const risk=dp>0.7?"HIGH":dp>0.4?"MEDIUM":"LOW", rc=dp>0.7?"red":dp>0.4?"yellow":"green";
  const cc={red:{g:"from-red-500/30 to-orange-500/10",b:"border-red-500/60",t:"text-red-400",glow:"shadow-[0_0_40px_rgba(239,68,68,0.4)]",d:"bg-red-500",s:"#ef4444"},yellow:{g:"from-yellow-500/30 to-amber-500/10",b:"border-yellow-500/60",t:"text-yellow-400",glow:"shadow-[0_0_40px_rgba(234,179,8,0.4)]",d:"bg-yellow-500",s:"#eab308"},green:{g:"from-green-500/30 to-emerald-500/10",b:"border-green-500/60",t:"text-green-400",glow:"shadow-[0_0_40px_rgba(34,197,94,0.4)]",d:"bg-green-500",s:"#22c55e"}}[rc];
  const circ=2*Math.PI*54;
  return (
    <div className={`relative w-full max-w-sm p-8 rounded-2xl border transition-all duration-700 ${active?`bg-gradient-to-br ${cc.g} ${cc.b} ${cc.glow}`:"bg-[#141f38] border-white/10"}`}>
      {adjusting&&<div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none"><div className={`absolute inset-0 rounded-2xl border-2 ${cc.b}`} style={{animation:"ping 1.5s cubic-bezier(0,0,0.2,1) infinite"}}/></div>}
      <div className="relative z-10 flex flex-col items-center">
        <div className="mb-6"><span className="text-xs font-semibold text-white/40 uppercase tracking-widest">Fraud Risk Score</span></div>
        <div className="relative w-40 h-40 mb-6">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120"><circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8"/><circle cx="60" cy="60" r="54" fill="none" stroke={active?cc.s:"rgba(255,255,255,0.1)"} strokeWidth="8" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ-dp*circ} className="transition-all duration-500 ease-out" style={{filter:active?`drop-shadow(0 0 8px ${cc.s})`:"none"}}/></svg>
          <div className="absolute inset-0 flex items-center justify-center"><span className={`text-5xl font-bold ${active?cc.t:"text-white/30"}`} style={{fontVariantNumeric:"tabular-nums"}}>{Math.round(dp*100)}%</span></div>
        </div>
        <div className={`flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-700 ${active?`bg-gradient-to-r ${cc.g} border ${cc.b}`:"bg-white/5 border border-white/10"}`}>
          <div className={`w-3 h-3 rounded-full ${active?cc.d:"bg-white/30"} ${adjusting?"animate-ping":active?"animate-pulse":""}`}/>
          <span className={`font-bold text-sm tracking-wider ${active?cc.t:"text-white/40"}`}>{risk} RISK</span>
        </div>
        <div className={`mt-5 flex items-center gap-2 text-xs ${active?"text-white/60":"text-white/20"}`}><div className={`w-2 h-2 rounded-full ${adjusting?"bg-yellow-400 animate-pulse":active?"bg-green-400":"bg-white/20"}`}/><span>{adjusting?"Adjusting score...":active?"Live prediction":"Awaiting data..."}</span></div>
      </div>
    </div>
  );
}

/* ================= PIPELINE DESKTOP ================= */
function AnimatedPipelineDesktop() {
  const [rawProba, setRawProba] = useState(0.73);
  const [calibratedProba, setCalibratedProba] = useState(0.68);
  const [activeStep, setActiveStep] = useState(0);
  const [isTransferring, setIsTransferring] = useState(0);
  const [treeValues, setTreeValues] = useState({feature1:"claim_amount",threshold1:"5000",feature2:"policy_age",threshold2:"2",leaves:["0.15","0.42","0.58","0.87"]});
  const features=[{name:"claim_amount",thresholds:["3000","5000","7500","10000"]},{name:"policy_age",thresholds:["1","2","3","5"]},{name:"vehicle_age",thresholds:["3","5","7","10"]},{name:"num_claims",thresholds:["0","1","2","3"]}];
  useEffect(() => {
    const run=()=>{
      const nr=Math.random()*0.5+0.35,nc=Math.min(0.95,Math.max(0.08,nr*(0.85+Math.random()*0.25)));
      const f1=features[Math.floor(Math.random()*features.length)],f2=features[Math.floor(Math.random()*features.length)];
      const tv={feature1:f1.name,threshold1:f1.thresholds[Math.floor(Math.random()*f1.thresholds.length)],feature2:f2.name,threshold2:f2.thresholds[Math.floor(Math.random()*f2.thresholds.length)],leaves:[(Math.random()*0.3+0.05).toFixed(2),(Math.random()*0.3+0.25).toFixed(2),(Math.random()*0.3+0.45).toFixed(2),(Math.random()*0.25+0.70).toFixed(2)]};
      setActiveStep(0);setIsTransferring(0);
      setTimeout(()=>setIsTransferring(1),100);setTimeout(()=>{setIsTransferring(0);setActiveStep(1);setRawProba(nr);setTreeValues(tv);},800);
      setTimeout(()=>setIsTransferring(2),3800);setTimeout(()=>{setIsTransferring(0);setActiveStep(2);},4600);
      setTimeout(()=>setIsTransferring(3),7600);setTimeout(()=>{setIsTransferring(0);setActiveStep(3);setCalibratedProba(nc);},8400);
    };
    run(); const id=setInterval(run,10500); return()=>clearInterval(id);
  }, []);
  const tags=[{l:"Age of Policy Holder",p:"-0s",c:"tag-green"},{l:"Past Number of Claims",p:"-1.2s",c:"tag-green"},{l:"Vehicle Price",p:"-2.4s",c:"tag-violet"},{l:"Marital Status",p:"-3.6s",c:"tag-green"},{l:"Accident Area",p:"-4.8s",c:"tag-red"},{l:"Vehicle Category",p:"-6.0s",c:"tag-violet"},{l:"Witness Present",p:"-7.2s",c:"tag-red"},{l:"Age of Vehicle",p:"-8.4s",c:"tag-violet"},{l:"Police Report Filed",p:"-9.6s",c:"tag-red"},{l:"Number of Cars",p:"-10.8s",c:"tag-violet"}];
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative w-[360px] h-[360px]">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="input-orb w-32 h-32 rounded-full bg-white/5 backdrop-blur flex items-center justify-center">
            <div className="text-center"><div className="text-white/90 font-semibold">Inputs</div><div className="text-[11px] text-white/50 mt-1">Claim Features</div></div>
          </div>
        </div>
        <div className="absolute inset-0">{tags.map((t,i)=>(<div key={i} className={`orbit-tag ${t.c}`} style={{"--phase":t.p}}>{t.l}</div>))}</div>
      </div>
      <AnimatedArrow active={isTransferring===1}/>
      <CatBoostVisualizer active={activeStep>=1} processing={activeStep===1&&isTransferring===0} rawProba={rawProba} treeValues={treeValues}/>
      <AnimatedArrow active={isTransferring===2}/>
      <IsotonicCalibrationVisualizer active={activeStep>=2} processing={activeStep===2&&isTransferring===0} inputProba={rawProba} outputProba={calibratedProba}/>
      <AnimatedArrow active={isTransferring===3}/>
      <OutputDisplay probability={calibratedProba} active={activeStep>=3} adjusting={activeStep===3&&isTransferring===0}/>
    </div>
  );
}

/* ================= CARD ================= */
function Card({ title, text, icon }) {
  return (
    <div className="bg-[#141f38] border border-white/10 rounded-2xl p-6 hover:border-white/20 hover:bg-[#1a2744] transition-all duration-300 group">
      <div className="flex flex-col items-center text-center">
        <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{icon}</div>
        <h3 className="font-semibold text-lg mb-2">{title}</h3>
        <p className="text-[#b7c3e6] text-sm leading-relaxed">{text}</p>
      </div>
    </div>
  );
}

/* ================= MAIN PAGE ================= */
export default function FraudRiskScoring() {
  const isMobile = useIsMobile();
  return (
    <main className="min-h-screen bg-[#0e1424] text-[#e7ecff] overflow-x-hidden w-full">
      <nav className="fixed top-0 w-full z-50 bg-[#0e1424] sm:bg-[#0e1424]/80 sm:backdrop-blur border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 hover:opacity-80 transition min-w-0">
            <img src="/logo.jpg" alt="Logo" className="w-8 h-8 object-contain rounded-lg flex-shrink-0"/>
            <span className="font-bold text-base sm:text-lg bg-gradient-to-r from-violet-700 to-violet-300 bg-clip-text text-transparent truncate">
              AG Algo Lab
            </span>
          </a>
          <a href="/" className="text-sm px-4 py-2 rounded-lg border border-white/15 text-white/70 hover:bg-white/5 hover:text-white transition">
            ← Back home
          </a>
        </div>
      </nav>

      <section className="pt-28 pb-6 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto text-center">
          <span className="inline-block text-xs sm:text-sm font-medium bg-gradient-to-r from-[#2f4486] to-[#4f46e5] text-white px-3 sm:px-4 py-1.5 rounded-full">AI · Insurance · Risk Management</span>
          <h1 className="mt-5 text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent leading-tight">Fraud Risk Scoring</h1>
          <p className="mt-4 max-w-3xl mx-auto text-[#b7c3e6] text-base sm:text-lg leading-relaxed">
            An AI-driven insurance fraud detection system combining <span className="text-white font-semibold">CatBoost</span> with <span className="text-white font-semibold">isotonic calibration</span> for reliable fraud risk scores.
          </p>
        </div>
      </section>

      <div className="flex items-center justify-center gap-4 my-2 px-4">
        <div className="h-px flex-1 max-w-24 bg-white/20"/>
        <span className="text-sm sm:text-base font-semibold tracking-widest uppercase text-white/60">Live Pipeline</span>
        <div className="h-px flex-1 max-w-24 bg-white/20"/>
      </div>

      <section className="px-4 sm:px-6 pb-16 mt-10">
        <div className="max-w-4xl mx-auto">
          {isMobile ? <PipelineMobile /> : <AnimatedPipelineDesktop />}
        </div>
      </section>

      <section className="px-4 sm:px-6 pb-16">
        <div className="max-w-4xl mx-auto grid sm:grid-cols-3 gap-4">
          <Card title="Machine Learning Core" text="CatBoost gradient boosting handles mixed categorical and numerical features with state-of-the-art accuracy." icon="🌲"/>
          <Card title="Probability Calibration" text="Isotonic regression ensures predicted probabilities reflect true fraud likelihood — no overconfidence." icon="📐"/>
          <Card title="Production-Ready" text="Clean percentage outputs ready for dashboards, APIs, and real-time underwriting decisions." icon="🚀"/>
        </div>
      </section>

      <section className="px-4 sm:px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden bg-gradient-to-br from-[#141f38] via-[#1a2744] to-[#141f38] border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-10 text-center">
            <div className="hidden sm:block absolute inset-0 opacity-30 pointer-events-none">
              <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"/>
              <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"/>
            </div>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 text-xs sm:text-sm font-semibold mb-5"><span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"/>Outstanding Results</div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3">See the Full Analysis</h3>
              <p className="text-[#b7c3e6] text-sm sm:text-base max-w-2xl mx-auto mb-6 leading-relaxed">Our model achieves <span className="text-white font-semibold">exceptional discrimination</span> between fraudulent and legitimate claims, enabling <span className="text-white font-semibold">precise risk-based prioritization</span>.</p>
              <div className="flex justify-center gap-6 sm:gap-8 mb-8">
                {[["High","AUC-ROC Score","text-blue-400"],["Calibrated","Probabilities","text-purple-400"],["Ready","For Production","text-green-400"]].map(([v,l,c])=>(<div key={l} className="text-center"><div className={`text-2xl sm:text-4xl font-bold ${c}`}>{v}</div><div className="text-xs sm:text-sm text-white/50 mt-1">{l}</div></div>))}
              </div>
              <a href="https://www.kaggle.com/writeups/anthonygocmen/insurance-fraud-detection-with-calibrated-gradient" target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 sm:gap-3 px-5 sm:px-8 py-3 sm:py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-300 font-bold text-sm sm:text-lg shadow-lg shadow-purple-500/30">
                📊 Explore the Notebook (Kaggle)
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="px-4 sm:px-6 pb-10">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 pt-6">
          <div className="flex items-center gap-2"><img src="/logo.jpg" alt="Logo" className="w-6 h-6 object-contain rounded"/><span className="text-sm text-[#b7c3e6]">AG Algo Lab — Building intelligent systems</span></div>
          <a href="/" className="text-sm px-4 py-2 rounded-lg border border-white/15 text-[#b7c3e6] hover:bg-white/5 transition">← Back home</a>
        </div>
      </footer>
    </main>
  );
}
