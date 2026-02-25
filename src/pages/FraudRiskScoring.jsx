import React, { useState, useEffect, useRef, useCallback } from "react";

/* ================= MOBILE DETECTION HOOK ================= */
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

/* ================= ANIMATED PIPELINE COMPONENT ================= */
function AnimatedPipeline() {
  const isMobile = useIsMobile();
  const [rawProba, setRawProba] = useState(0.73);
  const [calibratedProba, setCalibratedProba] = useState(0.68);
  const [activeStep, setActiveStep] = useState(0);
  const [isTransferring, setIsTransferring] = useState(0);
  const [treeValues, setTreeValues] = useState({
    feature1: "claim_amount",
    threshold1: "5000",
    feature2: "policy_age",
    threshold2: "2",
    leaves: ["0.15", "0.42", "0.58", "0.87"]
  });

  const features = [
    { name: "claim_amount", thresholds: ["3000", "5000", "7500", "10000"] },
    { name: "policy_age", thresholds: ["1", "2", "3", "5"] },
    { name: "vehicle_age", thresholds: ["3", "5", "7", "10"] },
    { name: "num_claims", thresholds: ["0", "1", "2", "3"] },
  ];

  useEffect(() => {
    // ✅ Cycle plus long sur mobile pour réduire la charge
    const cycleDuration = isMobile ? 14000 : 10500;

    const runCycle = () => {
      const newRaw = Math.random() * 0.5 + 0.35;
      const newCalibrated = Math.min(0.95, Math.max(0.08, newRaw * (0.85 + Math.random() * 0.25)));

      const f1 = features[Math.floor(Math.random() * features.length)];
      const f2 = features[Math.floor(Math.random() * features.length)];

      const newTreeValues = {
        feature1: f1.name,
        threshold1: f1.thresholds[Math.floor(Math.random() * f1.thresholds.length)],
        feature2: f2.name,
        threshold2: f2.thresholds[Math.floor(Math.random() * f2.thresholds.length)],
        leaves: [
          (Math.random() * 0.3 + 0.05).toFixed(2),
          (Math.random() * 0.3 + 0.25).toFixed(2),
          (Math.random() * 0.3 + 0.45).toFixed(2),
          (Math.random() * 0.25 + 0.70).toFixed(2),
        ]
      };

      setActiveStep(0);
      setIsTransferring(0);

      setTimeout(() => setIsTransferring(1), 100);
      setTimeout(() => {
        setIsTransferring(0);
        setActiveStep(1);
        setRawProba(newRaw);
        setTreeValues(newTreeValues);
      }, 800);
      setTimeout(() => setIsTransferring(2), 3800);
      setTimeout(() => {
        setIsTransferring(0);
        setActiveStep(2);
      }, 4600);
      setTimeout(() => setIsTransferring(3), 7600);
      setTimeout(() => {
        setIsTransferring(0);
        setActiveStep(3);
        setCalibratedProba(newCalibrated);
      }, 8400);
    };

    runCycle();
    const interval = setInterval(runCycle, cycleDuration);
    return () => clearInterval(interval);
  }, [isMobile]);

  return (
    <div className="w-full">
      <div className="relative flex flex-col items-center gap-6">
        {/* ✅ Orbit réduit sur mobile */}
        <OrbitInputs isMobile={isMobile} />
        <AnimatedArrow active={isTransferring === 1} isMobile={isMobile} />
        <CatBoostVisualizer
          active={activeStep >= 1}
          processing={activeStep === 1 && isTransferring === 0}
          rawProba={rawProba}
          treeValues={treeValues}
          isMobile={isMobile}
        />
        <AnimatedArrow active={isTransferring === 2} isMobile={isMobile} />
        <IsotonicCalibrationVisualizer
          active={activeStep >= 2}
          processing={activeStep === 2 && isTransferring === 0}
          inputProba={rawProba}
          outputProba={calibratedProba}
          isMobile={isMobile}
        />
        <AnimatedArrow active={isTransferring === 3} isMobile={isMobile} />
        <OutputDisplay probability={calibratedProba} active={activeStep >= 3} adjusting={activeStep === 3 && isTransferring === 0} />
      </div>
    </div>
  );
}

/* ================= ORBIT INPUTS — Mobile optimisé ================= */
function OrbitInputs({ isMobile }) {
  // ✅ 5 tags sur mobile au lieu de 10 — moitié moins d'animations CSS
  const allTags = [
    { label: "Age of Policy Holder", color: "tag-green", phase: "-0s" },
    { label: "Past Number of Claims", color: "tag-green", phase: "-1.2s" },
    { label: "Vehicle Price", color: "tag-violet", phase: "-2.4s" },
    { label: "Marital Status", color: "tag-green", phase: "-3.6s" },
    { label: "Accident Area", color: "tag-red", phase: "-4.8s" },
    { label: "Vehicle Category", color: "tag-violet", phase: "-6.0s" },
    { label: "Witness Present", color: "tag-red", phase: "-7.2s" },
    { label: "Age of Vehicle", color: "tag-violet", phase: "-8.4s" },
    { label: "Police Report Filed", color: "tag-red", phase: "-9.6s" },
    { label: "Number of Cars", color: "tag-violet", phase: "-10.8s" },
  ];

  const tags = isMobile
    ? [allTags[0], allTags[2], allTags[4], allTags[6], allTags[8]]
    : allTags;

  // ✅ Recalcule les phases pour que les 5 tags soient espacés uniformément
  const mobileTags = tags.map((tag, i) => ({
    ...tag,
    phase: isMobile ? `-${(i * (12 / tags.length)).toFixed(1)}s` : tag.phase,
  }));

  return (
    <div className="relative w-[280px] h-[280px] sm:w-[360px] sm:h-[360px]">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="input-orb w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-white/5 backdrop-blur flex items-center justify-center">
          <div className="text-center">
            <div className="text-white/90 font-semibold text-sm sm:text-base">Inputs</div>
            <div className="text-[10px] sm:text-[11px] text-white/50 mt-1">Claim Features</div>
          </div>
        </div>
      </div>
      <div className="absolute inset-0">
        {mobileTags.map((tag, i) => (
          <div
            key={i}
            className={`orbit-tag ${tag.color}`}
            style={{ "--phase": tag.phase }}
          >
            {tag.label}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= ANIMATED ARROW ================= */
function AnimatedArrow({ active, isMobile }) {
  return (
    <div className={`relative transition-all duration-500 ${active ? "opacity-100 scale-105" : "opacity-30 scale-100"}`}>
      <svg width="60" height="70" viewBox="0 0 60 70" fill="none" className="overflow-visible">
        <defs>
          <linearGradient id="arrowGradActive" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
          {/* ✅ Filtre glow uniquement desktop */}
          {!isMobile && (
            <filter id="glowArrow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          )}
        </defs>

        <path
          d="M30 5V55"
          stroke={active ? "url(#arrowGradActive)" : "rgba(255,255,255,0.2)"}
          strokeWidth={active ? "4" : "2"}
          strokeLinecap="round"
          filter={active && !isMobile ? "url(#glowArrow)" : ""}
          className="transition-all duration-500"
        />
        <path
          d="M30 55L18 42M30 55L42 42"
          stroke={active ? "url(#arrowGradActive)" : "rgba(255,255,255,0.2)"}
          strokeWidth={active ? "4" : "2"}
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={active && !isMobile ? "url(#glowArrow)" : ""}
          className="transition-all duration-500"
        />

        {/* ✅ Particules animées uniquement desktop */}
        {active && !isMobile && (
          <>
            <circle r="5" fill="#8b5cf6" filter="url(#glowArrow)">
              <animateMotion dur="0.5s" repeatCount="indefinite" path="M30 5 L30 55" />
            </circle>
            <circle r="4" fill="#3b82f6" filter="url(#glowArrow)">
              <animateMotion dur="0.5s" repeatCount="indefinite" path="M30 5 L30 55" begin="0.2s" />
            </circle>
          </>
        )}
        {/* ✅ Version mobile : simple point statique au milieu */}
        {active && isMobile && (
          <circle cx="30" cy="30" r="4" fill="#8b5cf6" opacity="0.8" />
        )}
      </svg>
    </div>
  );
}

/* ================= OBLIVIOUS TREE ================= */
function ObliviousTreeViz({ active, processing, treeValues }) {
  const [activeLevel, setActiveLevel] = useState(-1);

  useEffect(() => {
    if (!processing) {
      if (active) setActiveLevel(2);
      return;
    }
    setActiveLevel(0);
    const timers = [
      setTimeout(() => setActiveLevel(1), 1000),
      setTimeout(() => setActiveLevel(2), 2000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [processing, active]);

  const { feature1, threshold1, feature2, threshold2, leaves } = treeValues;

  const centerX = 200;
  const levelY = [30, 85, 145];
  const level1LeftX = centerX - 90;
  const level1RightX = centerX + 90;
  const leafPositions = [centerX - 135, centerX - 45, centerX + 45, centerX + 135];
  const condition1 = `${feature1} ≤ ${threshold1}`;
  const condition2 = `${feature2} ≤ ${threshold2}`;

  // ✅ Pas de filter="url(#nodeGlow)" sur mobile (feGaussianBlur coûteux)
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const nodeFilter = processing && !isMobile ? "url(#nodeGlow)" : "";

  return (
    <svg viewBox="0 0 400 170" className="w-full h-full">
      <defs>
        {!isMobile && (
          <filter id="nodeGlow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        )}
        <linearGradient id="edgeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>

      {/* Edges root → level1 */}
      {[level1LeftX, level1RightX].map((x, i) => (
        <line key={i}
          x1={centerX} y1={levelY[0] + 14}
          x2={x} y2={levelY[1] - 14}
          stroke={activeLevel >= 1 ? "url(#edgeGrad)" : "rgba(255,255,255,0.15)"}
          strokeWidth={activeLevel >= 1 ? 2.5 : 1.5}
          className="transition-all duration-700"
        />
      ))}

      {/* Edges level1 → leaves */}
      {[[level1LeftX, 0], [level1LeftX, 1], [level1RightX, 2], [level1RightX, 3]].map(([parentX, li]) => (
        <line key={li}
          x1={parentX} y1={levelY[1] + 14}
          x2={leafPositions[li]} y2={levelY[2] - 12}
          stroke={activeLevel >= 2 ? "url(#edgeGrad)" : "rgba(255,255,255,0.15)"}
          strokeWidth={activeLevel >= 2 ? 2.5 : 1.5}
          className="transition-all duration-700"
        />
      ))}

      {/* Yes/No labels */}
      <text x={centerX - 55} y={levelY[0] + 35} fill={activeLevel >= 1 ? "rgba(34,197,94,0.8)" : "rgba(255,255,255,0.3)"} fontSize="9" fontWeight="600">Yes</text>
      <text x={centerX + 40} y={levelY[0] + 35} fill={activeLevel >= 1 ? "rgba(239,68,68,0.8)" : "rgba(255,255,255,0.3)"} fontSize="9" fontWeight="600">No</text>
      {[[level1LeftX - 38, "Y"], [level1LeftX + 25, "N"], [level1RightX - 32, "Y"], [level1RightX + 20, "N"]].map(([x, label], i) => (
        <text key={i} x={x} y={levelY[1] + 32} fill={activeLevel >= 2 ? (label === "Y" ? "rgba(34,197,94,0.7)" : "rgba(239,68,68,0.7)") : "rgba(255,255,255,0.25)"} fontSize="8">{label}</text>
      ))}

      {/* Root node */}
      <g>
        <rect x={centerX - 70} y={levelY[0] - 14} width={140} height={28} rx={6}
          fill={activeLevel >= 0 ? "rgba(59,130,246,0.3)" : "rgba(255,255,255,0.05)"}
          stroke={activeLevel >= 0 ? "#3b82f6" : "rgba(255,255,255,0.2)"}
          strokeWidth={activeLevel >= 0 ? 2 : 1}
          filter={activeLevel === 0 ? nodeFilter : ""}
          className="transition-all duration-500"
        />
        <text x={centerX} y={levelY[0] + 4} textAnchor="middle"
          fill={activeLevel >= 0 ? "#60a5fa" : "rgba(255,255,255,0.4)"}
          fontSize="11" fontFamily="monospace" fontWeight="600" className="transition-all duration-500">
          {condition1}
        </text>
        {processing && activeLevel === 0 && !isMobile && (
          <circle cx={centerX} cy={levelY[0]} r="20" fill="none" stroke="#3b82f6" strokeWidth="2" opacity="0.5">
            <animate attributeName="r" from="18" to="35" dur="0.8s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.6" to="0" dur="0.8s" repeatCount="indefinite" />
          </circle>
        )}
      </g>

      {/* Level 1 nodes */}
      {[level1LeftX, level1RightX].map((x, i) => (
        <g key={i}>
          <rect x={x - 60} y={levelY[1] - 14} width={120} height={28} rx={6}
            fill={activeLevel >= 1 ? "rgba(59,130,246,0.25)" : "rgba(255,255,255,0.05)"}
            stroke={activeLevel >= 1 ? "#3b82f6" : "rgba(255,255,255,0.2)"}
            strokeWidth={activeLevel >= 1 ? 2 : 1}
            filter={activeLevel === 1 ? nodeFilter : ""}
            className="transition-all duration-500"
          />
          <text x={x} y={levelY[1] + 4} textAnchor="middle"
            fill={activeLevel >= 1 ? "#60a5fa" : "rgba(255,255,255,0.4)"}
            fontSize="10" fontFamily="monospace" fontWeight="500" className="transition-all duration-500">
            {condition2}
          </text>
        </g>
      ))}

      {/* Leaf nodes */}
      {leaves.map((value, i) => (
        <g key={i}>
          <rect x={leafPositions[i] - 24} y={levelY[2] - 12} width={48} height={24} rx={12}
            fill={activeLevel >= 2 ? "rgba(34,197,94,0.3)" : "rgba(255,255,255,0.05)"}
            stroke={activeLevel >= 2 ? "#22c55e" : "rgba(255,255,255,0.2)"}
            strokeWidth={activeLevel >= 2 ? 2 : 1}
            filter={activeLevel === 2 ? nodeFilter : ""}
            className="transition-all duration-500"
          />
          <text x={leafPositions[i]} y={levelY[2] + 4} textAnchor="middle"
            fill={activeLevel >= 2 ? "#4ade80" : "rgba(255,255,255,0.4)"}
            fontSize="12" fontFamily="monospace" fontWeight="600" className="transition-all duration-500">
            {value}
          </text>
        </g>
      ))}

      {/* ✅ Pulse leaves uniquement desktop */}
      {processing && activeLevel === 2 && !isMobile && leaves.map((_, i) => (
        <circle key={`pulse-${i}`} cx={leafPositions[i]} cy={levelY[2]} r="18" fill="none" stroke="#22c55e" strokeWidth="2" opacity="0.4">
          <animate attributeName="r" from="14" to="28" dur="0.8s" repeatCount="indefinite" begin={`${i * 0.15}s`} />
          <animate attributeName="opacity" from="0.5" to="0" dur="0.8s" repeatCount="indefinite" begin={`${i * 0.15}s`} />
        </circle>
      ))}

      <g opacity={activeLevel >= 1 ? 0.6 : 0.2} className="transition-all duration-500">
        <path d={`M ${level1LeftX + 62} ${levelY[1]} Q ${centerX} ${levelY[1] - 20} ${level1RightX - 62} ${levelY[1]}`}
          fill="none" stroke="#8b5cf6" strokeWidth="1" strokeDasharray="4 3" />
        <text x={centerX} y={levelY[1] - 22} textAnchor="middle" fill="#a78bfa" fontSize="8" fontStyle="italic">same split</text>
      </g>
    </svg>
  );
}

/* ================= CATBOOST VISUALIZER ================= */
function CatBoostVisualizer({ active, processing, rawProba, treeValues, isMobile }) {
  const [displayProba, setDisplayProba] = useState(rawProba);

  useEffect(() => {
    if (!active) return;
    const start = displayProba;
    const end = rawProba;
    const duration = 1000;
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setDisplayProba(start + (end - start) * eased);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [rawProba, active]);

  return (
    <div className={`relative w-full max-w-xl p-6 rounded-2xl border transition-all duration-700 ${
      active ? "bg-gradient-to-br from-[#1a2744] to-[#0e1424] border-blue-500/50 shadow-[0_0_40px_rgba(59,130,246,0.2)]"
             : "bg-[#141f38] border-white/10"
    }`}>
      {/* ✅ Glow background : uniquement desktop */}
      {processing && !isMobile && (
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/5" />
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-transparent to-purple-500/20 blur-xl animate-pulse" />
        </div>
      )}
      {/* Mobile : simple fond coloré sans blur */}
      {processing && isMobile && (
        <div className="absolute inset-0 rounded-2xl bg-blue-500/5 pointer-events-none" />
      )}

      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 ${
            processing ? "bg-blue-500/30 scale-110" : active ? "bg-blue-500/20" : "bg-white/5"
          }`}>
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke={active ? "#60a5fa" : "#ffffff40"} strokeWidth="2">
              <circle cx="12" cy="4" r="2" /><circle cx="6" cy="11" r="2" /><circle cx="18" cy="11" r="2" />
              <circle cx="3" cy="18" r="2" /><circle cx="9" cy="18" r="2" /><circle cx="15" cy="18" r="2" /><circle cx="21" cy="18" r="2" />
              <line x1="12" y1="6" x2="6" y2="9" /><line x1="12" y1="6" x2="18" y2="9" />
              <line x1="6" y1="13" x2="3" y2="16" /><line x1="6" y1="13" x2="9" y2="16" />
              <line x1="18" y1="13" x2="15" y2="16" /><line x1="18" y1="13" x2="21" y2="16" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg text-white/90">CatBoost</h3>
            <p className="text-sm text-white/50">Oblivious Decision Tree</p>
          </div>
          <div className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-500 ${
            processing ? "bg-blue-500/30 text-blue-300 animate-pulse" : active ? "bg-green-500/20 text-green-300" : "bg-white/5 text-white/30"
          }`}>
            {processing ? "⚡ Processing..." : active ? "✓ Ready" : "Idle"}
          </div>
        </div>

        <div className="relative h-48 mb-4 rounded-xl bg-[#0e1424]/80 border border-white/5 overflow-hidden">
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)", backgroundSize: "16px 16px" }}
          />
          <ObliviousTreeViz active={active} processing={processing} treeValues={treeValues} />
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-3">
            <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              processing ? "bg-blue-400 animate-ping" : active ? "bg-green-400" : "bg-white/30"
            }`} />
            <span className="text-sm text-white/60">Raw Probability</span>
          </div>
          <div className={`px-5 py-2.5 rounded-xl font-mono text-xl font-bold transition-all duration-700 ${
            active ? "bg-gradient-to-r from-blue-500/25 to-blue-600/25 border border-blue-500/50 text-blue-300"
                   : "bg-white/5 border border-white/10 text-white/40"
          }`}>
            {displayProba.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= ISOTONIC CALIBRATION VISUALIZER ================= */
function IsotonicCalibrationVisualizer({ active, processing, inputProba, outputProba, isMobile }) {
  const canvasRef = useRef(null);
  const [animatedPoint, setAnimatedPoint] = useState(0);
  const animFrameRef = useRef(null);

  useEffect(() => {
    if (processing) {
      const duration = 2000;
      const startTime = Date.now();
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        setAnimatedPoint(eased);
        if (progress < 1) animFrameRef.current = requestAnimationFrame(animate);
      };
      animFrameRef.current = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animFrameRef.current);
    }
  }, [processing, inputProba]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    // ✅ DPR capé à 2
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;
    canvas.width = displayWidth * dpr;
    canvas.height = displayHeight * dpr;
    ctx.scale(dpr, dpr);

    const width = displayWidth;
    const height = displayHeight;

    ctx.clearRect(0, 0, width, height);

    // Grid
    ctx.strokeStyle = "rgba(255,255,255,0.05)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) {
      ctx.beginPath(); ctx.moveTo((i * width) / 10, 0); ctx.lineTo((i * width) / 10, height); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, (i * height) / 10); ctx.lineTo(width, (i * height) / 10); ctx.stroke();
    }

    // Diagonal reference
    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    ctx.setLineDash([5, 5]);
    ctx.beginPath(); ctx.moveTo(0, height); ctx.lineTo(width, 0); ctx.stroke();
    ctx.setLineDash([]);

    const calibrate = (x) => Math.pow(x, 0.85) * (1 - 0.1 * Math.sin(x * Math.PI));

    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, active ? "#8b5cf6" : "rgba(255,255,255,0.2)");
    gradient.addColorStop(1, active ? "#ec4899" : "rgba(255,255,255,0.2)");

    ctx.strokeStyle = gradient;
    ctx.lineWidth = active ? 3 : 2;
    ctx.lineCap = "round";
    ctx.beginPath();
    for (let i = 0; i <= 100; i++) {
      const x = i / 100;
      const y = calibrate(x);
      if (i === 0) ctx.moveTo(x * width, height - y * height);
      else ctx.lineTo(x * width, height - y * height);
    }
    ctx.stroke();

    if (active) {
      const currentX = processing ? inputProba * animatedPoint : inputProba;
      const px = currentX * width;
      const calibY = calibrate(currentX);
      const py = height - calibY * height;

      // Dashed lines
      ctx.strokeStyle = "rgba(139, 92, 246, 0.5)";
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.moveTo(px, height); ctx.lineTo(px, py); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(0, py); ctx.stroke();
      ctx.setLineDash([]);

      // ✅ shadowBlur uniquement desktop
      if (!isMobile) {
        ctx.shadowColor = "#8b5cf6";
        ctx.shadowBlur = processing ? 25 : 15;
      }

      ctx.fillStyle = "#8b5cf6";
      ctx.beginPath();
      ctx.arc(px, py, processing ? 8 : 6, 0, Math.PI * 2);
      ctx.fill();

      // ✅ Reset shadow impératif
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;

      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(px, py, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [active, processing, inputProba, outputProba, animatedPoint, isMobile]);

  return (
    <div className={`relative w-full max-w-xl p-6 rounded-2xl border transition-all duration-700 ${
      active ? "bg-gradient-to-br from-[#1f1744] to-[#141424] border-purple-500/50 shadow-[0_0_40px_rgba(139,92,246,0.2)]"
             : "bg-[#141f38] border-white/10"
    }`}>
      {/* ✅ Glow background : uniquement desktop */}
      {processing && !isMobile && (
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/5" />
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 via-transparent to-pink-500/20 blur-xl animate-pulse" />
        </div>
      )}
      {processing && isMobile && (
        <div className="absolute inset-0 rounded-2xl bg-purple-500/5 pointer-events-none" />
      )}

      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 ${
            processing ? "bg-purple-500/30 scale-110" : active ? "bg-purple-500/20" : "bg-white/5"
          }`}>
            <span className="text-2xl">📐</span>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg text-white/90">Isotonic Calibration</h3>
            <p className="text-sm text-white/50">Probability Correction</p>
          </div>
          <div className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-500 ${
            processing ? "bg-purple-500/30 text-purple-300 animate-pulse" : active ? "bg-green-500/20 text-green-300" : "bg-white/5 text-white/30"
          }`}>
            {processing ? "⚡ Calibrating..." : active ? "✓ Ready" : "Idle"}
          </div>
        </div>

        <div className="relative mb-4 rounded-xl bg-[#0e1424]/80 border border-white/5 overflow-hidden">
          {/* ✅ Canvas responsive — height fixe mais width fluide via CSS */}
          <canvas ref={canvasRef} className="w-full h-44 block" />
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] text-white/40 bg-[#0e1424]/90 px-2 py-0.5 rounded">
            Raw Output
          </div>
          <div className="absolute left-1 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] text-white/40 bg-[#0e1424]/90 px-2 py-0.5 rounded">
            Calibrated
          </div>
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="text-center">
            <div className="text-[10px] text-white/40 mb-1.5">Input</div>
            <div className={`px-4 py-2 rounded-lg font-mono text-base transition-all duration-500 ${
              active ? "bg-white/10 text-white/80 border border-white/20" : "bg-white/5 text-white/40"
            }`}>
              {inputProba.toFixed(2)}
            </div>
          </div>
          <div className={`flex items-center gap-2 transition-all duration-500 ${
            processing ? "text-purple-400 scale-110" : active ? "text-purple-400/60" : "text-white/20"
          }`}>
            <span className="text-xl">→</span>
            <span className={`text-sm font-mono px-2 py-1 rounded ${processing ? "bg-purple-500/20 animate-pulse" : ""}`}>f(x)</span>
            <span className="text-xl">→</span>
          </div>
          <div className="text-center">
            <div className="text-[10px] text-white/40 mb-1.5">Calibrated</div>
            <div className={`px-4 py-2 rounded-lg font-mono text-base font-bold transition-all duration-700 ${
              active ? "bg-gradient-to-r from-purple-500/25 to-pink-500/25 border border-purple-500/50 text-purple-300"
                     : "bg-white/5 border border-white/10 text-white/40"
            }`}>
              {outputProba.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= OUTPUT DISPLAY ================= */
function OutputDisplay({ probability, active, adjusting }) {
  const [displayProba, setDisplayProba] = useState(probability);

  useEffect(() => {
    if (!active) return;
    const start = displayProba;
    const end = probability;
    const duration = 1500;
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setDisplayProba(start + (end - start) * eased);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [probability, active]);

  const riskLevel = displayProba > 0.7 ? "HIGH" : displayProba > 0.4 ? "MEDIUM" : "LOW";
  const riskColor = displayProba > 0.7 ? "red" : displayProba > 0.4 ? "yellow" : "green";

  const colorConfig = {
    red: { gradient: "from-red-500/30 to-orange-500/10", border: "border-red-500/60", text: "text-red-400", glow: "shadow-[0_0_40px_rgba(239,68,68,0.4)]", dot: "bg-red-500", stroke: "#ef4444" },
    yellow: { gradient: "from-yellow-500/30 to-amber-500/10", border: "border-yellow-500/60", text: "text-yellow-400", glow: "shadow-[0_0_40px_rgba(234,179,8,0.4)]", dot: "bg-yellow-500", stroke: "#eab308" },
    green: { gradient: "from-green-500/30 to-emerald-500/10", border: "border-green-500/60", text: "text-green-400", glow: "shadow-[0_0_40px_rgba(34,197,94,0.4)]", dot: "bg-green-500", stroke: "#22c55e" },
  };

  const colors = colorConfig[riskColor];
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - displayProba * circumference;

  return (
    <div className={`relative w-full max-w-sm p-8 rounded-2xl border transition-all duration-700 ${
      active ? `bg-gradient-to-br ${colors.gradient} ${colors.border} ${colors.glow}` : "bg-[#141f38] border-white/10"
    }`}>
      {adjusting && (
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
          <div className={`absolute inset-0 rounded-2xl border-2 ${colors.border}`}
            style={{ animation: "ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite" }} />
        </div>
      )}
      <div className="relative z-10 flex flex-col items-center">
        <div className="mb-6 text-center">
          <span className="text-xs font-semibold text-white/40 uppercase tracking-widest">Fraud Risk Score</span>
        </div>
        <div className="relative w-40 h-40 mb-6">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
            <circle cx="60" cy="60" r="54" fill="none"
              stroke={active ? colors.stroke : "rgba(255,255,255,0.1)"}
              strokeWidth="8" strokeLinecap="round"
              strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
              className="transition-all duration-500 ease-out"
              style={{ filter: active ? `drop-shadow(0 0 8px ${colors.stroke})` : "none" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-5xl font-bold transition-all duration-500 ${active ? colors.text : "text-white/30"}`}
              style={{ fontVariantNumeric: "tabular-nums" }}>
              {Math.round(displayProba * 100)}%
            </span>
          </div>
        </div>
        <div className={`flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-700 ${
          active ? `bg-gradient-to-r ${colors.gradient} border ${colors.border}` : "bg-white/5 border border-white/10"
        }`}>
          <div className={`w-3 h-3 rounded-full transition-all duration-500 ${active ? colors.dot : "bg-white/30"} ${
            adjusting ? "animate-ping" : active ? "animate-pulse" : ""
          }`} />
          <span className={`font-bold text-sm tracking-wider transition-all duration-500 ${active ? colors.text : "text-white/40"}`}>
            {riskLevel} RISK
          </span>
        </div>
        <div className={`mt-5 flex items-center gap-2 text-xs transition-all duration-500 ${active ? "text-white/60" : "text-white/20"}`}>
          <div className={`w-2 h-2 rounded-full ${adjusting ? "bg-yellow-400 animate-pulse" : active ? "bg-green-400" : "bg-white/20"}`} />
          <span>{adjusting ? "Adjusting score..." : active ? "Live prediction" : "Awaiting data..."}</span>
        </div>
      </div>
    </div>
  );
}

/* ================= CARD COMPONENT ================= */
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
  return (
    <main className="min-h-screen bg-[#0e1424] text-[#e7ecff]">
      {/* Navbar — fond solide mobile, backdrop-blur desktop */}
      <nav className="fixed top-0 w-full z-50 bg-[#0e1424] sm:bg-[#0e1424]/80 sm:backdrop-blur border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3 hover:opacity-80 transition">
            <img src="/logo.jpg" alt="Logo" className="w-9 h-9 object-contain rounded-lg" />
            <span className="font-bold text-lg">AG Algo Lab</span>
          </a>
          <a href="/" className="text-sm px-4 py-2 rounded-lg border border-white/15 text-[#b7c3e6] hover:bg-white/5 hover:text-white transition">
            ← Back home
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-6 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <span className="inline-block text-sm font-medium bg-gradient-to-r from-[#2f4486] to-[#4f46e5] text-white px-4 py-1.5 rounded-full">
            AI · Insurance · Risk Management
          </span>
          <h1 className="mt-6 text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
            Fraud Risk Scoring
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-[#b7c3e6] text-lg md:text-xl leading-relaxed">
            An AI-driven insurance fraud detection system combining{" "}
            <span className="text-white font-semibold">CatBoost</span> with{" "}
            <span className="text-white font-semibold">isotonic calibration</span> to produce reliable, production-ready fraud risk scores.
          </p>
        </div>
      </section>

      <div className="flex flex-col items-center my-2 text-white/60">
        <div className="flex items-center gap-6">
          <div className="h-px w-24 bg-white/20" />
          <span className="text-lg md:text-xl font-semibold tracking-widest uppercase">Live Pipeline</span>
          <div className="h-px w-24 bg-white/20" />
        </div>
      </div>

      {/* Pipeline */}
      <section className="px-4 sm:px-6 pb-16 mt-12">
        <div className="max-w-4xl mx-auto">
          <AnimatedPipeline />
        </div>
      </section>

      {/* Features */}
      <section className="px-4 sm:px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            <Card title="Machine Learning Core" text="CatBoost gradient boosting handles mixed categorical and numerical features with state-of-the-art accuracy." icon="🌲" />
            <Card title="Probability Calibration" text="Isotonic regression ensures predicted probabilities reflect true fraud likelihood — no overconfidence." icon="📐" />
            <Card title="Production-Ready" text="Clean percentage outputs ready for dashboards, APIs, and real-time underwriting decisions." icon="🚀" />
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="px-4 sm:px-6 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden bg-gradient-to-br from-[#141f38] via-[#1a2744] to-[#141f38] border border-white/10 rounded-3xl p-8 sm:p-10 text-center">
            {/* ✅ Blurs décoratifs cachés sur mobile */}
            <div className="absolute inset-0 opacity-30 hidden sm:block pointer-events-none">
              <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
            </div>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 text-sm font-semibold mb-6">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Outstanding Results
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">See the Full Analysis</h3>
              <p className="text-[#b7c3e6] text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
                Our model achieves <span className="text-white font-semibold">exceptional discrimination</span> between fraudulent and legitimate claims. The calibrated probabilities enable{" "}
                <span className="text-white font-semibold">precise risk-based prioritization</span> that transforms fraud detection operations.
              </p>
              <div className="flex flex-wrap justify-center gap-8 mb-10">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-400">High</div>
                  <div className="text-sm text-white/50 mt-1">AUC-ROC Score</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-400">Calibrated</div>
                  <div className="text-sm text-white/50 mt-1">Probabilities</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-400">Ready</div>
                  <div className="text-sm text-white/50 mt-1">For Production</div>
                </div>
              </div>
              <a href="https://www.kaggle.com/writeups/anthonygocmen/insurance-fraud-detection-with-calibrated-gradient"
                target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-300 font-bold text-lg shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105">
                📊 Explore the Notebook (Kaggle)
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 pb-10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 border-t border-white/10 pt-6">
          <div className="flex items-center gap-3">
            <img src="/logo.jpg" alt="Logo" className="w-6 h-6 object-contain rounded" />
            <span className="text-sm text-[#b7c3e6]">AG Algo Lab — Building intelligent systems</span>
          </div>
          <a href="/" className="text-sm px-4 py-2 rounded-lg border border-white/15 text-[#b7c3e6] hover:bg-white/5 hover:text-white transition">
            ← Back home
          </a>
        </div>
      </footer>
    </main>
  );
}
