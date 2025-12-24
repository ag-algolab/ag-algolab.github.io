import React, { useState, useEffect, useRef } from "react";

/* ================= ANIMATED PIPELINE COMPONENT ================= */
function AnimatedPipeline() {
  const [rawProba, setRawProba] = useState(0.73);
  const [calibratedProba, setCalibratedProba] = useState(0.68);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  // Simulate processing every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsProcessing(true);
      setActiveStep(1);
      
      // Generate new raw probability
      const newRaw = (Math.random() * 0.5 + 0.35).toFixed(2);
      
      setTimeout(() => {
        setRawProba(parseFloat(newRaw));
        setActiveStep(2);
      }, 600);
      
      setTimeout(() => {
        // Calibration slightly adjusts the probability
        const calibrated = (parseFloat(newRaw) * (0.85 + Math.random() * 0.2)).toFixed(2);
        setCalibratedProba(Math.min(0.99, Math.max(0.05, parseFloat(calibrated))));
        setActiveStep(3);
      }, 1200);
      
      setTimeout(() => {
        setIsProcessing(false);
        setActiveStep(0);
      }, 1800);
      
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full">
      {/* Main Pipeline Container */}
      <div className="relative flex flex-col items-center gap-8">
        
        {/* Row 1: Input Orb */}
        <div className="relative w-[300px] h-[300px] sm:w-[360px] sm:h-[360px]">
          {/* Center orb */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="input-orb w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-white/5 backdrop-blur flex items-center justify-center">
              <div className="text-center">
                <div className="text-white/90 font-semibold text-sm sm:text-base">Inputs</div>
                <div className="text-[10px] sm:text-[11px] text-white/50 mt-1">Claim Features</div>
              </div>
            </div>
          </div>
          
          {/* Orbiting tags */}
          <div className="absolute inset-0">
            <div className="orbit-tag tag-green" style={{ "--phase": "-0s" }}>Age of Policy Holder</div>
            <div className="orbit-tag tag-green" style={{ "--phase": "-1.2s" }}>Past Number of Claims</div>
            <div className="orbit-tag tag-violet" style={{ "--phase": "-2.4s" }}>Vehicle Price</div>
            <div className="orbit-tag tag-green" style={{ "--phase": "-3.6s" }}>Marital Status</div>
            <div className="orbit-tag tag-red" style={{ "--phase": "-4.8s" }}>Accident Area</div>
            <div className="orbit-tag tag-violet" style={{ "--phase": "-6.0s" }}>Vehicle Category</div>
            <div className="orbit-tag tag-red" style={{ "--phase": "-7.2s" }}>Witness Present</div>
            <div className="orbit-tag tag-violet" style={{ "--phase": "-8.4s" }}>Age of Vehicle</div>
            <div className="orbit-tag tag-red" style={{ "--phase": "-9.6s" }}>Police Report Filed</div>
            <div className="orbit-tag tag-violet" style={{ "--phase": "-10.8s" }}>Number of Cars</div>
          </div>
        </div>

        {/* Arrow 1: Input → CatBoost */}
        <AnimatedArrow active={activeStep >= 1} direction="down" />

        {/* Row 2: CatBoost Model */}
        <CatBoostVisualizer active={activeStep >= 1} rawProba={rawProba} />

        {/* Arrow 2: CatBoost → Calibration */}
        <AnimatedArrow active={activeStep >= 2} direction="down" />

        {/* Row 3: Isotonic Calibration */}
        <IsotonicCalibrationVisualizer 
          active={activeStep >= 2} 
          inputProba={rawProba} 
          outputProba={calibratedProba} 
        />

        {/* Arrow 3: Calibration → Output */}
        <AnimatedArrow active={activeStep >= 3} direction="down" />

        {/* Row 4: Final Output */}
        <OutputDisplay probability={calibratedProba} active={activeStep >= 3} />
      </div>

      {/* Pipeline Labels */}
      <div className="mt-12 flex flex-wrap justify-center gap-6 text-xs text-white/50">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          <span>Behavioral Features</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-violet-400"></span>
          <span>Vehicle Features</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500"></span>
          <span>Incident Features</span>
        </div>
      </div>
    </div>
  );
}

/* ================= ANIMATED ARROW ================= */
function AnimatedArrow({ active, direction = "down" }) {
  const isVertical = direction === "down" || direction === "up";
  
  if (isVertical) {
    return (
      <div className={`relative transition-all duration-500 ${active ? 'opacity-100' : 'opacity-30'}`}>
        <svg width="60" height="80" viewBox="0 0 60 80" fill="none" className="overflow-visible">
          <defs>
            <linearGradient id={`arrowGradV-${active}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={active ? "#3b82f6" : "#ffffff"} stopOpacity={active ? "0.9" : "0.2"} />
              <stop offset="100%" stopColor={active ? "#8b5cf6" : "#ffffff"} stopOpacity={active ? "0.9" : "0.2"} />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Main line */}
          <path 
            d="M30 5V65" 
            stroke={`url(#arrowGradV-${active})`} 
            strokeWidth="3" 
            strokeLinecap="round"
            filter={active ? "url(#glow)" : ""}
          />
          
          {/* Arrow head */}
          <path 
            d="M30 65L20 52M30 65L40 52" 
            stroke={`url(#arrowGradV-${active})`} 
            strokeWidth="3" 
            strokeLinecap="round"
            strokeLinejoin="round"
            filter={active ? "url(#glow)" : ""}
          />
          
          {/* Animated particles */}
          {active && (
            <>
              <circle r="4" fill="#8b5cf6" filter="url(#glow)">
                <animateMotion dur="0.8s" repeatCount="indefinite" path="M30 5 L30 65" />
              </circle>
              <circle r="3" fill="#3b82f6" filter="url(#glow)">
                <animateMotion dur="0.8s" repeatCount="indefinite" path="M30 5 L30 65" begin="0.3s" />
              </circle>
            </>
          )}
        </svg>
      </div>
    );
  }
  
  return null;
}

/* ================= CATBOOST VISUALIZER ================= */
function CatBoostVisualizer({ active, rawProba }) {
  const [trees, setTrees] = useState([0.3, 0.5, 0.7, 0.4, 0.6, 0.45, 0.55]);
  
  useEffect(() => {
    if (active) {
      const newTrees = trees.map(() => Math.random() * 0.5 + 0.3);
      setTrees(newTrees);
    }
  }, [active, rawProba]);

  return (
    <div className={`relative w-full max-w-lg p-6 rounded-2xl border transition-all duration-500 ${
      active 
        ? 'bg-gradient-to-br from-[#1a2744] to-[#0e1424] border-blue-500/50 shadow-[0_0_40px_rgba(59,130,246,0.3)]' 
        : 'bg-[#141f38] border-white/10'
    }`}>
      {/* Animated background glow */}
      {active && (
        <div className="absolute inset-0 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 animate-pulse" />
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-transparent to-purple-500/20 blur-xl animate-spin-slow opacity-50" style={{ animationDuration: '8s' }} />
        </div>
      )}
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-5">
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-500 ${
            active ? 'bg-gradient-to-br from-blue-500/30 to-green-500/20 shadow-lg shadow-blue-500/30' : 'bg-white/5'
          }`}>
            <span className="text-3xl">🌲</span>
          </div>
          <div>
            <h3 className="font-bold text-xl text-white/90">CatBoost</h3>
            <p className="text-sm text-white/50">Gradient Boosted Decision Trees</p>
          </div>
        </div>

        {/* Forest visualization */}
        <div className="relative h-40 mb-5 rounded-xl bg-[#0e1424]/80 border border-white/5 overflow-hidden">
          {/* Grid background */}
          <div className="absolute inset-0 opacity-30" style={{
            backgroundImage: 'linear-gradient(rgba(59,130,246,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.05) 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }} />
          
          {/* Trees row */}
          <div className="absolute inset-0 flex items-end justify-around px-3 pb-4">
            {trees.map((height, i) => (
              <div 
                key={i} 
                className="flex flex-col items-center transition-all duration-700 ease-out"
                style={{ 
                  transform: active ? 'translateY(0)' : 'translateY(20px)',
                  opacity: active ? 1 : 0.5,
                  transitionDelay: `${i * 80}ms`
                }}
              >
                {/* Tree SVG */}
                <svg 
                  width="36" 
                  height="50" 
                  viewBox="0 0 36 50" 
                  className={`transition-all duration-500 drop-shadow-lg`}
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  {/* Tree layers */}
                  <polygon 
                    points="18,0 36,18 28,18 36,30 0,30 8,18 0,18" 
                    fill={active ? `rgba(34, 197, 94, ${0.6 + height * 0.4})` : 'rgba(255,255,255,0.1)'}
                    className="transition-all duration-500"
                  />
                  {/* Trunk */}
                  <rect x="14" y="30" width="8" height="12" fill={active ? '#8B5513' : 'rgba(255,255,255,0.1)'} rx="1" />
                  {/* Glow when active */}
                  {active && (
                    <circle cx="18" cy="18" r="12" fill={`rgba(34, 197, 94, ${height * 0.3})`} className="animate-pulse" />
                  )}
                </svg>
                
                {/* Weight indicator */}
                <div 
                  className={`mt-2 w-8 rounded-full transition-all duration-700 ${
                    active ? 'bg-gradient-to-t from-blue-600 to-blue-400' : 'bg-white/10'
                  }`}
                  style={{ 
                    height: `${height * 30 + 8}px`,
                    transitionDelay: `${i * 100}ms`,
                    boxShadow: active ? '0 0 10px rgba(59,130,246,0.5)' : 'none'
                  }}
                />
              </div>
            ))}
          </div>

          {/* Data flow particles */}
          {active && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1.5 h-1.5 bg-blue-400 rounded-full"
                  style={{
                    left: `${5 + i * 8}%`,
                    animation: `floatUp 1.8s ease-out infinite`,
                    animationDelay: `${i * 0.12}s`,
                  }}
                />
              ))}
            </div>
          )}

          {/* Processing label */}
          <div className={`absolute top-2 right-2 px-2 py-1 rounded-md text-[10px] font-medium transition-all duration-300 ${
            active ? 'bg-blue-500/20 text-blue-300' : 'bg-white/5 text-white/30'
          }`}>
            {active ? '⚡ Processing' : 'Idle'}
          </div>
        </div>

        {/* Output */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${active ? 'bg-blue-400 animate-pulse' : 'bg-white/30'}`} />
            <span className="text-sm text-white/60">Raw Probability Output</span>
          </div>
          <div className={`px-4 py-2 rounded-lg font-mono text-lg font-bold transition-all duration-500 ${
            active 
              ? 'bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/40 text-blue-300 shadow-lg shadow-blue-500/20' 
              : 'bg-white/5 border border-white/10 text-white/40'
          }`}>
            {rawProba.toFixed(2)}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(160px); opacity: 0; }
          15% { opacity: 0.8; }
          85% { opacity: 0.8; }
          100% { transform: translateY(-20px); opacity: 0; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
}

/* ================= ISOTONIC CALIBRATION VISUALIZER ================= */
function IsotonicCalibrationVisualizer({ active, inputProba, outputProba }) {
  const canvasRef = useRef(null);
  
  // Draw the isotonic calibration curve
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    // Draw grid
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) {
      ctx.beginPath();
      ctx.moveTo(i * width / 10, 0);
      ctx.lineTo(i * width / 10, height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * height / 10);
      ctx.lineTo(width, i * height / 10);
      ctx.stroke();
    }
    
    // Draw diagonal (perfect calibration)
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(0, height);
    ctx.lineTo(width, 0);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw isotonic calibration curve (step function approximation)
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, active ? '#8b5cf6' : 'rgba(255,255,255,0.2)');
    gradient.addColorStop(0.5, active ? '#a855f7' : 'rgba(255,255,255,0.2)');
    gradient.addColorStop(1, active ? '#ec4899' : 'rgba(255,255,255,0.2)');
    
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    ctx.beginPath();
    const points = [];
    for (let i = 0; i <= 100; i++) {
      const x = i / 100;
      // Isotonic-like calibration curve
      const y = Math.pow(x, 0.85) * (1 - 0.1 * Math.sin(x * Math.PI));
      points.push({ x: x * width, y: height - y * height });
    }
    
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();
    
    // Draw current point if active
    if (active) {
      const px = inputProba * width;
      const calibY = Math.pow(inputProba, 0.85) * (1 - 0.1 * Math.sin(inputProba * Math.PI));
      const py = height - calibY * height;
      
      // Vertical line
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.4)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(px, height);
      ctx.lineTo(px, py);
      ctx.stroke();
      
      // Horizontal line
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(0, py);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Point with glow
      ctx.shadowColor = '#8b5cf6';
      ctx.shadowBlur = 15;
      ctx.fillStyle = '#8b5cf6';
      ctx.beginPath();
      ctx.arc(px, py, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      
      // Inner white dot
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(px, py, 2, 0, Math.PI * 2);
      ctx.fill();
    }
    
  }, [active, inputProba, outputProba]);

  return (
    <div className={`relative w-full max-w-lg p-6 rounded-2xl border transition-all duration-500 ${
      active 
        ? 'bg-gradient-to-br from-[#1f1744] to-[#141424] border-purple-500/50 shadow-[0_0_40px_rgba(139,92,246,0.3)]' 
        : 'bg-[#141f38] border-white/10'
    }`}>
      {/* Background effect */}
      {active && (
        <div className="absolute inset-0 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 animate-pulse" />
        </div>
      )}
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-5">
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-500 ${
            active ? 'bg-gradient-to-br from-purple-500/30 to-pink-500/20 shadow-lg shadow-purple-500/30' : 'bg-white/5'
          }`}>
            <span className="text-3xl">📐</span>
          </div>
          <div>
            <h3 className="font-bold text-xl text-white/90">Isotonic Calibration</h3>
            <p className="text-sm text-white/50">Probability Correction Layer</p>
          </div>
        </div>

        {/* Canvas for curve */}
        <div className="relative mb-5 rounded-xl bg-[#0e1424]/80 border border-white/5 overflow-hidden">
          <canvas 
            ref={canvasRef} 
            width={400} 
            height={200} 
            className="w-full h-40"
          />
          
          {/* Axis labels */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] text-white/40 bg-[#0e1424]/80 px-2 rounded">
            Raw Model Output
          </div>
          <div className="absolute left-1 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] text-white/40 bg-[#0e1424]/80 px-2 rounded">
            Calibrated
          </div>
          
          {/* Legend */}
          <div className="absolute top-2 right-2 flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-[9px] text-white/40">
              <div className="w-3 h-0.5 bg-white/20" style={{ borderBottom: '1px dashed rgba(255,255,255,0.3)' }} />
              <span>Perfect calibration</span>
            </div>
            <div className="flex items-center gap-1.5 text-[9px] text-white/40">
              <div className="w-3 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded" />
              <span>Isotonic curve</span>
            </div>
          </div>
        </div>

        {/* Transformation display */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
          <div className="text-center">
            <div className="text-[10px] text-white/40 mb-1">Raw Input</div>
            <div className={`px-3 py-1.5 rounded-lg font-mono text-sm transition-all duration-300 ${
              active ? 'bg-white/10 text-white/80' : 'bg-white/5 text-white/40'
            }`}>
              {inputProba.toFixed(2)}
            </div>
          </div>
          
          <div className={`flex items-center gap-2 transition-all duration-300 ${active ? 'text-purple-400' : 'text-white/20'}`}>
            <span className="text-lg">→</span>
            <span className="text-xs">f(x)</span>
            <span className="text-lg">→</span>
          </div>
          
          <div className="text-center">
            <div className="text-[10px] text-white/40 mb-1">Calibrated</div>
            <div className={`px-3 py-1.5 rounded-lg font-mono text-sm font-bold transition-all duration-500 ${
              active 
                ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/40 text-purple-300 shadow-lg shadow-purple-500/20' 
                : 'bg-white/5 border border-white/10 text-white/40'
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
function OutputDisplay({ probability, active }) {
  const [displayProba, setDisplayProba] = useState(probability);
  
  // Smooth transition for probability
  useEffect(() => {
    const start = displayProba;
    const end = probability;
    const duration = 600;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setDisplayProba(start + (end - start) * eased);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [probability]);

  const riskLevel = displayProba > 0.7 ? 'HIGH' : displayProba > 0.4 ? 'MEDIUM' : 'LOW';
  const riskColor = displayProba > 0.7 ? 'red' : displayProba > 0.4 ? 'yellow' : 'green';
  
  const colorConfig = {
    red: {
      gradient: 'from-red-500/30 to-orange-500/10',
      border: 'border-red-500/60',
      text: 'text-red-400',
      glow: 'shadow-[0_0_60px_rgba(239,68,68,0.4)]',
      dot: 'bg-red-500',
      stroke: '#ef4444'
    },
    yellow: {
      gradient: 'from-yellow-500/30 to-amber-500/10',
      border: 'border-yellow-500/60',
      text: 'text-yellow-400',
      glow: 'shadow-[0_0_60px_rgba(234,179,8,0.4)]',
      dot: 'bg-yellow-500',
      stroke: '#eab308'
    },
    green: {
      gradient: 'from-green-500/30 to-emerald-500/10',
      border: 'border-green-500/60',
      text: 'text-green-400',
      glow: 'shadow-[0_0_60px_rgba(34,197,94,0.4)]',
      dot: 'bg-green-500',
      stroke: '#22c55e'
    }
  };

  const colors = colorConfig[riskColor];
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (displayProba * circumference);

  return (
    <div className={`relative w-full max-w-sm p-8 rounded-2xl border transition-all duration-500 ${
      active 
        ? `bg-gradient-to-br ${colors.gradient} ${colors.border} ${colors.glow}` 
        : 'bg-[#141f38] border-white/10'
    }`}>
      {/* Pulsing ring effect */}
      {active && (
        <div className="absolute inset-0 rounded-2xl overflow-hidden">
          <div className={`absolute inset-0 rounded-2xl border-2 ${colors.border} animate-ping opacity-20`} />
        </div>
      )}
      
      <div className="relative z-10 flex flex-col items-center">
        {/* Header */}
        <div className="mb-6 text-center">
          <span className="text-xs font-semibold text-white/40 uppercase tracking-widest">Fraud Risk Score</span>
        </div>

        {/* Circular progress */}
        <div className="relative w-36 h-36 mb-6">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            {/* Background circle */}
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="8"
            />
            {/* Progress circle */}
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke={active ? colors.stroke : 'rgba(255,255,255,0.1)'}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-700 ease-out"
              style={{
                filter: active ? `drop-shadow(0 0 8px ${colors.stroke})` : 'none'
              }}
            />
          </svg>
          
          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-4xl font-bold transition-all duration-300 ${
              active ? colors.text : 'text-white/30'
            }`}>
              {Math.round(displayProba * 100)}%
            </span>
          </div>
        </div>

        {/* Risk level badge */}
        <div className={`flex items-center gap-3 px-5 py-2.5 rounded-full transition-all duration-500 ${
          active 
            ? `bg-gradient-to-r ${colors.gradient} border ${colors.border}` 
            : 'bg-white/5 border border-white/10'
        }`}>
          <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
            active ? `${colors.dot} animate-pulse` : 'bg-white/30'
          }`} />
          <span className={`font-bold text-sm tracking-wide transition-all duration-300 ${
            active ? colors.text : 'text-white/40'
          }`}>
            {riskLevel} RISK
          </span>
        </div>

        {/* Live indicator */}
        <div className={`mt-4 flex items-center gap-2 text-xs transition-all duration-300 ${
          active ? 'text-white/50' : 'text-white/20'
        }`}>
          <div className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-green-400 animate-pulse' : 'bg-white/20'}`} />
          <span>{active ? 'Live prediction' : 'Awaiting data...'}</span>
        </div>
      </div>
    </div>
  );
}

/* ================= MAIN PAGE COMPONENT ================= */
export default function FraudRiskScoring() {
  return (
    <main className="min-h-screen bg-[#0e1424] text-[#e7ecff]">

      {/* ================= NAVBAR ================= */}
      <nav className="fixed top-0 w-full z-50 bg-[#0e1424]/80 backdrop-blur border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.jpg" alt="Logo" className="w-9 h-9 object-contain rounded-lg" />
            <span className="font-bold text-lg">Hackathon 2025</span>
          </div>
          <div className="flex items-center gap-4">
            <img src="/ey.png" alt="EY" className="h-10 object-contain" />
            <span className="text-white/60 font-semibold">×</span>
            <img src="/dauphine.png" alt="Dauphine PSL" className="h-8 object-contain" />
          </div>
        </div>
      </nav>

      {/* ================= HERO ================= */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          <span className="inline-block text-sm font-medium bg-[#2f4486] text-white px-3 py-1 rounded-full">
            AI · Insurance · Risk Management
          </span>

          <h1 className="mt-6 text-4xl md:text-5xl font-extrabold tracking-tight">
            Fraud Risk Scoring
          </h1>

          <p className="mt-6 max-w-3xl text-[#b7c3e6] text-lg">
            An AI-driven insurance fraud risk scoring system combining machine-learning models with probabilistic calibration to produce reliable, 
            ranked fraud risk scores for operational prioritization.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="https://github.com/ag-algolab"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 rounded-xl bg-[#2f4486] hover:bg-[#3b5bb8] transition font-semibold"
            >
              Kaggle Notebook
            </a>
            <a
              href="https://github.com/ag-algolab"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 rounded-xl border border-white/20 hover:bg-white/5 transition"
            >
              GitHub Repository
            </a>
          </div>
        </div>
      </section>

      {/* ================= PIPELINE VISUALIZATION ================= */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Watch the complete fraud detection pipeline in action — from raw claim features to calibrated risk scores.
            </p>
          </div>
          
          <AnimatedPipeline />
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="px-6 pb-24">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="card-title">Quick start</h2>
            <p className="text-sm text-white/60 mt-1">
              Designed for immediate use — no configuration, no friction.
            </p>
      
            <pre className="codeblock text-sm leading-relaxed font-mono" aria-label="Install & import">
              <code>
                <span className="text-yellow-400">pip</span> install POF
                {"\n\n"}
                <span className="text-blue-400">from</span> POF{" "}
                <span className="text-blue-400">import</span>{" "}
                launch_fraud_scoring
                {"\n"}
                <span className="text-purple-300">launch_fraud_scoring()</span>
              </code>
            </pre>
          </div>

          <div className="space-y-6">
            <Card
              title="Machine Learning Core"
              text="The engine relies on CatBoost, a powerful gradient boosting algorithm well-suited for heterogeneous insurance data."
              icon="🌲"
            />
            <Card
              title="Probability Calibration"
              text="Raw model outputs are corrected via isotonic calibration to avoid overconfidence and misinterpretation."
              icon="📐"
            />
            <Card
              title="Production-Ready Outputs"
              text="Results are delivered as clean percentages, directly usable in dashboards, APIs, or underwriting workflows."
              icon="🚀"
            />
          </div>
        </div>
      </section>

      {/* ================= METHODOLOGY ================= */}
      <section id="methodology" className="px-6 pb-24">
        <div className="max-w-5xl mx-auto bg-[#141f38] border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4">Methodology</h2>
          <p className="text-[#b7c3e6] leading-relaxed">
            The Fraud Risk Scoring system is built on a supervised learning approach.
            A CatBoost classifier is trained on historical insurance claim data to
            detect fraud-related patterns. To ensure trustworthy probabilities,
            the raw outputs are calibrated using isotonic regression on validation
            and test datasets.
            <br /><br />
            This dual-step process allows the model to retain strong ranking power
            while delivering probabilities that can be safely interpreted and used
            in real business contexts.
          </p>
        </div>
      </section>

      {/* ================= FOOTER ================= */}          
      <footer className="px-6 pb-10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 border-t border-white/10 pt-6">
          <div className="flex items-center gap-3">
            <span className="text-sm text-[#b7c3e6]">
              By AG Algo Lab — Hack for Smart Insurance with AI
            </span>
          </div>
          <a
            href="/"
            className="text-sm px-4 py-2 rounded-lg border border-white/15 text-[#b7c3e6] hover:bg-white/5 hover:text-white transition"
          >
            ← Back home
          </a>     
        </div>
      </footer>
    </main>
  );
}

/* ================= CARD COMPONENT ================= */
function Card({ title, text, icon }) {
  return (
    <div className="bg-[#141f38] border border-white/10 rounded-2xl p-6">
      <div className="flex items-start gap-4">
        <div className="text-2xl">{icon}</div>
        <div>
          <h3 className="font-semibold text-lg mb-1">{title}</h3>
          <p className="text-[#b7c3e6] text-sm leading-relaxed">{text}</p>
        </div>
      </div>
    </div>
  );
}
