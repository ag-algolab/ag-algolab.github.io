import React, { useState, useEffect, useRef } from "react";

/* ================= MOBILE DETECTION ================= */
export function useIsMobile() {
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
        <linearGradient id="eGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6"/><stop offset="100%" stopColor="#8b5cf6"/>
        </linearGradient>
      </defs>
      {[l1L,l1R].map((x,i)=>(<line key={i} x1={cx} y1={lY[0]+14} x2={x} y2={lY[1]-14} stroke={activeLevel>=1?"url(#eGrad)":"rgba(255,255,255,0.15)"} strokeWidth={activeLevel>=1?2.5:1.5} className="transition-all duration-700"/>))}
      {[[l1L,0],[l1L,1],[l1R,2],[l1R,3]].map(([px,li])=>(<line key={li} x1={px} y1={lY[1]+14} x2={lx[li]} y2={lY[2]-12} stroke={activeLevel>=2?"url(#eGrad)":"rgba(255,255,255,0.15)"} strokeWidth={activeLevel>=2?2.5:1.5} className="transition-all duration-700"/>))}
      <g>
        <rect x={cx-70} y={lY[0]-14} width={140} height={28} rx={6}
          fill={activeLevel>=0?"rgba(59,130,246,0.3)":"rgba(255,255,255,0.05)"}
          stroke={activeLevel>=0?"#3b82f6":"rgba(255,255,255,0.2)"} strokeWidth={activeLevel>=0?2:1}
          filter={processing&&activeLevel===0?"url(#nGlow)":""} className="transition-all duration-500"/>
        <text x={cx} y={lY[0]+4} textAnchor="middle"
          fill={activeLevel>=0?"#60a5fa":"rgba(255,255,255,0.4)"}
          fontSize="11" fontFamily="monospace" fontWeight="600">{feature1} ≤ {threshold1}</text>
      </g>
      {[l1L,l1R].map((x,i)=>(<g key={i}>
        <rect x={x-60} y={lY[1]-14} width={120} height={28} rx={6}
          fill={activeLevel>=1?"rgba(59,130,246,0.25)":"rgba(255,255,255,0.05)"}
          stroke={activeLevel>=1?"#3b82f6":"rgba(255,255,255,0.2)"} strokeWidth={activeLevel>=1?2:1}
          filter={processing&&activeLevel===1?"url(#nGlow)":""} className="transition-all duration-500"/>
        <text x={x} y={lY[1]+4} textAnchor="middle"
          fill={activeLevel>=1?"#60a5fa":"rgba(255,255,255,0.4)"}
          fontSize="10" fontFamily="monospace" fontWeight="500">{feature2} ≤ {threshold2}</text>
      </g>))}
      {leaves.map((v,i)=>(<g key={i}>
        <rect x={lx[i]-24} y={lY[2]-12} width={48} height={24} rx={12}
          fill={activeLevel>=2?"rgba(34,197,94,0.3)":"rgba(255,255,255,0.05)"}
          stroke={activeLevel>=2?"#22c55e":"rgba(255,255,255,0.2)"} strokeWidth={activeLevel>=2?2:1}
          filter={processing&&activeLevel===2?"url(#nGlow)":""} className="transition-all duration-500"/>
        <text x={lx[i]} y={lY[2]+4} textAnchor="middle"
          fill={activeLevel>=2?"#4ade80":"rgba(255,255,255,0.4)"}
          fontSize="12" fontFamily="monospace" fontWeight="600">{v}</text>
      </g>))}
      <g opacity={activeLevel>=1?0.6:0.2} className="transition-all duration-500">
        <path d={`M${l1L+62} ${lY[1]} Q${cx} ${lY[1]-20} ${l1R-62} ${lY[1]}`}
          fill="none" stroke="#8b5cf6" strokeWidth="1" strokeDasharray="4 3"/>
        <text x={cx} y={lY[1]-22} textAnchor="middle"
          fill="#a78bfa" fontSize="8" fontStyle="italic">same split</text>
      </g>
    </svg>
  );
}

/* ================= ANIMATED ARROW ================= */
function AnimatedArrow({ active }) {
  return (
    <div className={`flex justify-center transition-all duration-500 ${active ? "opacity-100" : "opacity-25"}`}>
      <div className="flex flex-col items-center gap-1">
        <div className={`w-0.5 h-8 rounded-full transition-all duration-500 ${active ? "bg-gradient-to-b from-blue-500/60 to-purple-500/60" : "bg-white/15"}`}/>
        <div className={`w-0 h-0 border-l-4 border-r-4 border-t-6 border-l-transparent border-r-transparent transition-all duration-500 ${active ? "border-t-purple-500/60" : "border-t-white/15"}`}
          style={{borderTopWidth:'6px'}}/>
      </div>
    </div>
  );
}

/* ================= PIPELINE MOBILE ================= */
export function PipelineMobile() {
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
    { label: "Claim Amount",   color: "#60a5fa" },
    { label: "Policy Age",     color: "#4ade80" },
    { label: "Vehicle Price",  color: "#a78bfa" },
    { label: "Nb. Claims",     color: "#4ade80" },
    { label: "Accident Area",  color: "#f87171" },
    { label: "Vehicle Type",   color: "#a78bfa" },
    { label: "Witness",        color: "#f87171" },
    { label: "Police Report",  color: "#f87171" },
  ];

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Inputs */}
      <div className="rounded-2xl border bg-[#141f38] border-white/10 p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-md bg-blue-500/20 flex items-center justify-center text-[10px] text-blue-400 font-bold">1</div>
          <span className="text-white/70 font-medium text-sm">Claim Features</span>
          <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400/60"/>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {inputTags.map((t, i) => (
            <span key={i} className="text-[10px] px-2 py-0.5 rounded-full border"
              style={{ borderColor: t.color + "30", color: t.color + "bb", backgroundColor: t.color + "0d" }}>
              {t.label}
            </span>
          ))}
        </div>
      </div>

      <AnimatedArrow active={step >= 1} />

      {/* CatBoost */}
      <div className={`rounded-2xl border p-4 transition-all duration-500 ${step >= 2 ? "bg-[#0e1424] border-blue-500/30" : "bg-[#141f38] border-white/10"}`}>
        <div className="flex items-center gap-2 mb-3">
          <div className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold transition-all duration-500 ${step >= 2 ? "bg-blue-500/25 text-blue-300" : "bg-white/5 text-white/25"}`}>2</div>
          <div>
            <span className={`font-medium text-sm block transition-colors duration-500 ${step >= 2 ? "text-white" : "text-white/35"}`}>CatBoost</span>
            <span className="text-[10px] text-white/25">Gradient Boosting</span>
          </div>
          {step === 1 && <span className="ml-auto text-[10px] text-blue-400/70 animate-pulse">Processing...</span>}
          {step >= 2 && <span className="ml-auto text-[10px] text-green-400/70">✓ {rawProba.toFixed(2)}</span>}
        </div>
        <div className="rounded-lg bg-[#0e1424]/60 border border-white/5 p-2 overflow-hidden" style={{height:'72px'}}>
          <svg viewBox="0 0 320 115" className="w-full h-full">
            <rect x="100" y="5" width="120" height="22" rx="5"
              fill={step>=2?"rgba(59,130,246,0.25)":"rgba(255,255,255,0.04)"}
              stroke={step>=2?"#3b82f650":"rgba(255,255,255,0.1)"} strokeWidth="1.5"/>
            <text x="160" y="19" textAnchor="middle" fill={step>=2?"#60a5fa99":"rgba(255,255,255,0.2)"}
              fontSize="9" fontFamily="monospace" fontWeight="600">claim_amount ≤ 5000</text>
            <line x1="130" y1="27" x2="80" y2="52" stroke={step>=2?"#3b82f650":"rgba(255,255,255,0.08)"} strokeWidth="1.5"/>
            <line x1="190" y1="27" x2="240" y2="52" stroke={step>=2?"#3b82f650":"rgba(255,255,255,0.08)"} strokeWidth="1.5"/>
            {[[20,52],[180,52]].map(([x,y],i)=>(<g key={i}>
              <rect x={x} y={y} width="120" height="20" rx="5"
                fill={step>=2?"rgba(59,130,246,0.15)":"rgba(255,255,255,0.04)"}
                stroke={step>=2?"#3b82f640":"rgba(255,255,255,0.08)"} strokeWidth="1"/>
              <text x={x+60} y={y+13} textAnchor="middle" fill={step>=2?"#60a5fa80":"rgba(255,255,255,0.2)"}
                fontSize="8" fontFamily="monospace">policy_age ≤ 2</text>
            </g>))}
            {[["0.15",50],["0.42",110],["0.58",210],["0.87",270]].map(([v,x],i)=>(<g key={i}>
              <rect x={x-18} y="85" width="36" height="20" rx="10"
                fill={step>=2?"rgba(34,197,94,0.2)":"rgba(255,255,255,0.04)"}
                stroke={step>=2?"#22c55e50":"rgba(255,255,255,0.08)"} strokeWidth="1"/>
              <text x={x} y="98" textAnchor="middle" fill={step>=2?"#4ade8099":"rgba(255,255,255,0.2)"}
                fontSize="9" fontFamily="monospace" fontWeight="600">{v}</text>
            </g>))}
          </svg>
        </div>
      </div>

      <AnimatedArrow active={step >= 3} />

      {/* Calibration + Output combined */}
      <div className={`rounded-2xl border p-4 transition-all duration-700 ${step >= 4 ? "bg-[#0e1424] border-purple-500/25" : "bg-[#141f38] border-white/10"}`}>
        <div className="flex items-center gap-2 mb-4">
          <div className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold transition-all duration-500 ${step >= 4 ? "bg-purple-500/25 text-purple-300" : "bg-white/5 text-white/25"}`}>3</div>
          <div>
            <span className={`font-medium text-sm block transition-colors duration-500 ${step >= 4 ? "text-white" : "text-white/35"}`}>Isotonic Calibration → Risk Score</span>
          </div>
          {step === 3 && <span className="ml-auto text-[10px] text-purple-400/70 animate-pulse">Calibrating...</span>}
        </div>
        <div className="flex items-center gap-3">
          <div className={`px-3 py-2 rounded-lg font-mono text-sm transition-all duration-500 ${step >= 4 ? "bg-white/8 text-white/60 border border-white/10" : "bg-white/4 text-white/20"}`}>
            {rawProba.toFixed(2)}
          </div>
          <div className={`text-white/30 text-xs transition-colors duration-500 ${step >= 4 ? "text-purple-400/50" : ""}`}>→ f(x) →</div>
          <div className="flex-1">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-700"
              style={step >= 4
                ? { borderColor: riskColor + "50", background: riskColor + "15" }
                : { borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}>
              <div className="w-1.5 h-1.5 rounded-full animate-pulse flex-shrink-0"
                style={{ background: step >= 4 ? riskColor : "rgba(255,255,255,0.2)" }}/>
              <span className="font-mono text-sm font-bold" style={{ color: step >= 4 ? riskColor : "rgba(255,255,255,0.2)" }}>
                {Math.round(calibratedProba * 100)}%
              </span>
              <span className="text-[10px] font-semibold tracking-wider" style={{ color: step >= 4 ? riskColor + "cc" : "rgba(255,255,255,0.15)" }}>
                {riskLabel} RISK
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= PIPELINE DESKTOP ================= */
export function AnimatedPipelineDesktop() {
  const [rawProba, setRawProba]           = useState(0.73);
  const [calibratedProba, setCalibratedProba] = useState(0.68);
  const [activeStep, setActiveStep]       = useState(0);
  const [isTransferring, setIsTransferring] = useState(0);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [treeValues, setTreeValues]       = useState({
    feature1:"claim_amount", threshold1:"5000",
    feature2:"policy_age",  threshold2:"2",
    leaves:["0.15","0.42","0.58","0.87"]
  });

  const features = [
    {name:"claim_amount",  thresholds:["3000","5000","7500","10000"]},
    {name:"policy_age",    thresholds:["1","2","3","5"]},
    {name:"vehicle_age",   thresholds:["3","5","7","10"]},
    {name:"num_claims",    thresholds:["0","1","2","3"]},
  ];

  useEffect(() => {
    const run = () => {
      const nr = Math.random()*0.5+0.35;
      const nc = Math.min(0.95, Math.max(0.08, nr*(0.85+Math.random()*0.25)));
      const f1 = features[Math.floor(Math.random()*features.length)];
      const f2 = features[Math.floor(Math.random()*features.length)];
      const tv = {
        feature1: f1.name,
        threshold1: f1.thresholds[Math.floor(Math.random()*f1.thresholds.length)],
        feature2: f2.name,
        threshold2: f2.thresholds[Math.floor(Math.random()*f2.thresholds.length)],
        leaves: [
          (Math.random()*0.3+0.05).toFixed(2),
          (Math.random()*0.3+0.25).toFixed(2),
          (Math.random()*0.3+0.45).toFixed(2),
          (Math.random()*0.25+0.70).toFixed(2),
        ],
      };
      setActiveStep(0); setIsTransferring(0); setIsCalibrating(false);
      setTimeout(() => setIsTransferring(1), 100);
      setTimeout(() => { setIsTransferring(0); setActiveStep(1); setRawProba(nr); setTreeValues(tv); }, 800);
      setTimeout(() => setIsTransferring(2), 3800);
      setTimeout(() => { setIsTransferring(0); setActiveStep(2); setIsCalibrating(true); }, 4600);
      setTimeout(() => { setIsCalibrating(false); setActiveStep(3); setCalibratedProba(nc); }, 6600);
    };
    run();
    const id = setInterval(run, 9000);
    return () => clearInterval(id);
  }, []);

  const riskColor = calibratedProba > 0.7 ? "#ef4444" : calibratedProba > 0.4 ? "#eab308" : "#22c55e";
  const riskLabel = calibratedProba > 0.7 ? "HIGH RISK" : calibratedProba > 0.4 ? "MEDIUM RISK" : "LOW RISK";
  const riskBg    = calibratedProba > 0.7 ? "rgba(239,68,68,0.12)" : calibratedProba > 0.4 ? "rgba(234,179,8,0.12)" : "rgba(34,197,94,0.12)";

  const tags = [
    {l:"Age of Policy Holder",  p:"-0s",    c:"#60a5fa"},
    {l:"Past Number of Claims", p:"-1.2s",  c:"#4ade80"},
    {l:"Vehicle Price",         p:"-2.4s",  c:"#a78bfa"},
    {l:"Marital Status",        p:"-3.6s",  c:"#4ade80"},
    {l:"Accident Area",         p:"-4.8s",  c:"#f87171"},
    {l:"Vehicle Category",      p:"-6.0s",  c:"#a78bfa"},
    {l:"Witness Present",       p:"-7.2s",  c:"#f87171"},
    {l:"Age of Vehicle",        p:"-8.4s",  c:"#a78bfa"},
    {l:"Police Report Filed",   p:"-9.6s",  c:"#f87171"},
    {l:"Number of Cars",        p:"-10.8s", c:"#60a5fa"},
  ];

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-lg mx-auto">

      {/* INPUTS ORBIT */}
      <div className="relative w-72 h-72">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="input-orb w-28 h-28 rounded-full bg-[#141f38] border border-white/10 flex items-center justify-center">
            <div className="text-center">
              <div className="text-white/70 font-semibold text-sm">Inputs</div>
              <div className="text-[10px] text-white/35 mt-0.5">Claim Features</div>
            </div>
          </div>
        </div>
        <div className="absolute inset-0">
          {tags.map((t, i) => (
            <div key={i}
              className="orbit-tag"
              style={{
                "--phase": t.p,
                "--radius": "130px",
                color: t.c + "bb",
                borderColor: t.c + "25",
                background: t.c + "0d",
                fontSize: "10px",
                padding: "5px 8px",
                width: "130px",
              }}>
              {t.l}
            </div>
          ))}
        </div>
      </div>

      <AnimatedArrow active={isTransferring === 1} />

      {/* CATBOOST */}
      <div className={`w-full rounded-2xl border p-5 transition-all duration-700 
        ${activeStep >= 1 ? "bg-[#0e1424] border-blue-500/25" : "bg-[#141f38] border-white/[0.07]"}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500
            ${activeStep >= 1 ? "bg-blue-500/20" : "bg-white/5"}`}>
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none"
              stroke={activeStep >= 1 ? "#60a5fa" : "rgba(255,255,255,0.25)"} strokeWidth="2">
              <circle cx="12" cy="4" r="2"/><circle cx="6" cy="11" r="2"/>
              <circle cx="18" cy="11" r="2"/><circle cx="3" cy="18" r="2"/>
              <circle cx="9" cy="18" r="2"/><circle cx="15" cy="18" r="2"/>
              <circle cx="21" cy="18" r="2"/>
              <line x1="12" y1="6" x2="6" y2="9"/><line x1="12" y1="6" x2="18" y2="9"/>
              <line x1="6" y1="13" x2="3" y2="16"/><line x1="6" y1="13" x2="9" y2="16"/>
              <line x1="18" y1="13" x2="15" y2="16"/><line x1="18" y1="13" x2="21" y2="16"/>
            </svg>
          </div>
          <div className="flex-1">
            <h3 className={`font-semibold text-sm transition-colors duration-500 ${activeStep >= 1 ? "text-white" : "text-white/35"}`}>
              CatBoost
            </h3>
            <p className="text-[10px] text-white/25">Gradient Boosted Trees</p>
          </div>
          <div className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all duration-500
            ${isTransferring === 1 ? "bg-blue-500/20 text-blue-300 animate-pulse"
            : activeStep >= 1 ? "bg-green-500/15 text-green-300/80"
            : "bg-white/5 text-white/20"}`}>
            {isTransferring === 1 ? "Processing..." : activeStep >= 1 ? `✓  ${rawProba.toFixed(2)}` : "Idle"}
          </div>
        </div>
        <div className="rounded-xl bg-black/20 border border-white/5 overflow-hidden" style={{height:"160px"}}>
          <ObliviousTreeViz
            active={activeStep >= 1}
            processing={activeStep === 1 && isTransferring === 0}
            treeValues={treeValues}
          />
        </div>
      </div>

      <AnimatedArrow active={isTransferring === 2} />

      {/* CALIBRATION + OUTPUT */}
      <div className={`w-full rounded-2xl border p-5 transition-all duration-700
        ${activeStep >= 2 ? "bg-[#0e1424] border-purple-500/20" : "bg-[#141f38] border-white/[0.07]"}`}>
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all duration-500
            ${activeStep >= 2 ? "bg-purple-500/20" : "bg-white/5"}`}>
            📐
          </div>
          <div className="flex-1">
            <h3 className={`font-semibold text-sm transition-colors duration-500 ${activeStep >= 2 ? "text-white" : "text-white/35"}`}>
              Isotonic Calibration
            </h3>
            <p className="text-[10px] text-white/25">Probability correction</p>
          </div>
          {isCalibrating && (
            <span className="text-[10px] text-purple-300/70 animate-pulse">Calibrating...</span>
          )}
        </div>

        {/* Flow: raw → calibration → output */}
        <div className="flex items-center gap-3">
          {/* Raw prob */}
          <div className={`flex-shrink-0 px-4 py-2.5 rounded-xl border font-mono text-base transition-all duration-500
            ${activeStep >= 2 ? "bg-white/5 border-white/15 text-white/60" : "bg-white/[0.02] border-white/5 text-white/15"}`}>
            {rawProba.toFixed(2)}
          </div>

          {/* Arrow with calibration animation */}
          <div className="flex-1 flex items-center gap-1 relative">
            <div className={`h-px flex-1 transition-all duration-700
              ${isCalibrating ? "bg-gradient-to-r from-purple-500/60 to-pink-500/60" : activeStep >= 3 ? "bg-purple-500/30" : "bg-white/10"}`}/>
            {isCalibrating && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[9px] font-mono text-purple-300/70 bg-[#0e1424] px-1.5">
                  f(x)
                </span>
              </div>
            )}
            <div className={`w-0 h-0 border-l-4 border-t-4 border-b-4 border-l-transparent border-r-transparent transition-all duration-500`}
              style={{
                borderLeftWidth: '6px',
                borderTopWidth: '4px',
                borderBottomWidth: '4px',
                borderTopColor: 'transparent',
                borderBottomColor: 'transparent',
                borderLeftColor: activeStep >= 3 ? '#8b5cf650' : 'rgba(255,255,255,0.1)',
              }}/>
          </div>

          {/* Output risk */}
          <div className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl border font-mono transition-all duration-700"
            style={activeStep >= 3
              ? { borderColor: riskColor + "40", background: riskBg, color: riskColor }
              : { borderColor: "rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)", color: "rgba(255,255,255,0.15)" }}>
            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 animate-pulse"
              style={{ background: activeStep >= 3 ? riskColor : "rgba(255,255,255,0.2)" }}/>
            <span className="text-base font-bold">{Math.round(calibratedProba * 100)}%</span>
            <span className="text-[10px] font-semibold tracking-wider opacity-80">{riskLabel}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= MAIN PAGE ================= */
export default function FraudRiskScoring() {
  const isMobile = useIsMobile();

  return (
    <main className="min-h-screen bg-[#0e1424] text-[#e7ecff] overflow-x-hidden w-full">

      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-[#0e1424]/90 backdrop-blur border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 hover:opacity-80 transition min-w-0">
            <img src="/logo.jpg" alt="Logo" className="w-8 h-8 object-contain rounded-lg flex-shrink-0"/>
            <span className="font-bold text-base bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent truncate">
              AG Algo Lab
            </span>
          </a>
          <a href="/" className="text-sm px-4 py-2 rounded-lg border border-white/15 text-white/60 hover:bg-white/5 hover:text-white transition">
            ← Back
          </a>
        </div>
      </nav>

      {/* Header */}
      <section className="pt-28 pb-10 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-semibold uppercase tracking-wider">
              Case Study
            </span>
            <span className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.08] text-white/45 text-[10px] font-mono uppercase tracking-wider">
              Insurance · Fraud Detection
            </span>
            <span className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.08] text-white/45 text-[10px] font-mono uppercase tracking-wider">
              Real Data
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Vehicle Insurance Fraud Detection
          </h1>
          <p className="text-[#b7c3e6] text-sm leading-relaxed">
            Built on a real-world vehicle insurance dataset, this pipeline combines{' '}
            <span className="text-white font-medium">CatBoost</span> with{' '}
            <span className="text-white font-medium">isotonic calibration</span> to
            score each claim by fraud probability — enabling teams to focus investigation
            resources where they matter most.
          </p>
        </div>
      </section>

      {/* Pipeline */}
      <section className="px-4 sm:px-6 pb-12">
        <div className="max-w-lg mx-auto">
          <p className="text-[10px] font-mono uppercase tracking-widest text-white/20 text-center mb-6">
            Live Pipeline
          </p>
          {isMobile ? <PipelineMobile /> : <AnimatedPipelineDesktop />}
        </div>
      </section>

      {/* Results */}
      <section className="px-4 sm:px-6 pb-16">
        <div className="max-w-3xl mx-auto space-y-4">

          {/* AUC */}
          <div className="bg-[#141f38] rounded-2xl border border-white/[0.07] p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1 h-4 rounded-full bg-emerald-400"/>
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400/80">
                Model Performance
              </span>
            </div>
            <div className="flex items-end gap-4 mb-3">
              <div className="text-5xl font-bold font-mono text-emerald-400 leading-none">0.83+</div>
              <div className="text-white/40 text-sm pb-1">AUC score</div>
            </div>
            <p className="text-[#b7c3e6] text-sm leading-relaxed">
              The model achieves an AUC above 0.83 on held-out data — meaning it correctly
              ranks a fraudulent claim above a legitimate one in over 83% of cases.
              For imbalanced fraud datasets, this is the metric that matters.
            </p>
          </div>

          {/* Safe bucket */}
          <div className="bg-[#141f38] rounded-2xl border border-white/[0.07] p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1 h-4 rounded-full bg-blue-400"/>
              <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400/80">
                Operational Impact
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.05]">
                <div className="text-2xl font-bold font-mono text-blue-400 mb-1">&gt; 50%</div>
                <div className="text-white/40 text-xs">of claims auto-cleared</div>
              </div>
              <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.05]">
                <div className="text-2xl font-bold font-mono text-green-400 mb-1">0.2%</div>
                <div className="text-white/40 text-xs">fraud rate in safe bucket</div>
              </div>
            </div>
            <p className="text-[#b7c3e6] text-sm leading-relaxed">
              Over half the claims are immediately classified as low-risk and cleared without
              manual review. Among the ~1,400 cases marked safe, only 3 actual fraud cases
              were present — a miss rate of 0.2%, which is operationally negligible and
              far below industry thresholds.
            </p>
          </div>

          {/* Risk tiers */}
          <div className="bg-[#141f38] rounded-2xl border border-white/[0.07] p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1 h-4 rounded-full bg-amber-400"/>
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400/80">
                Risk Tiers — Remaining Cases
              </span>
            </div>
            <div className="space-y-3">
              {[
                { label: "Low Risk",    color: "#22c55e", desc: "Auto-cleared. No investigation needed." },
                { label: "Medium Risk", color: "#eab308", desc: "Flagged for light review. May warrant a call or document check." },
                { label: "High Risk",   color: "#f97316", desc: "Priority investigation. Likely fraudulent pattern detected." },
                { label: "Very High",   color: "#ef4444", desc: "Immediate escalation. Strong fraud signal across multiple features." },
              ].map((tier, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: tier.color, opacity: 0.8 }}/>
                  <span className="text-sm font-medium flex-shrink-0 w-20" style={{ color: tier.color + "cc" }}>
                    {tier.label}
                  </span>
                  <span className="text-[#b7c3e6] text-xs leading-relaxed">{tier.desc}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 sm:px-6 pb-10 border-t border-white/10 pt-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/logo.jpg" alt="Logo" className="w-6 h-6 object-contain rounded"/>
            <span className="text-sm text-[#b7c3e6]">AG Algo Lab — Building intelligent systems</span>
          </div>
          <a href="/" className="text-sm px-4 py-2 rounded-lg border border-white/15 text-[#b7c3e6] hover:bg-white/5 transition">
            ← Back home
          </a>
        </div>
      </footer>
    </main>
  );
}
