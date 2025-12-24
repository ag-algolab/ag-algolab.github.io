import React, { useState, useEffect, useRef } from "react";

/* ================= ANIMATED PIPELINE COMPONENT ================= */
function AnimatedPipeline() {
  const [rawProba, setRawProba] = useState(0.73);
  const [calibratedProba, setCalibratedProba] = useState(0.68);
  const [activeStep, setActiveStep] = useState(0);
  const [isTransferring, setIsTransferring] = useState(0); // 0=none, 1=to catboost, 2=to iso, 3=to output

  // Pipeline timing: 
  // 0-0.5s: transfer to catboost (arrow 1 active)
  // 0.5-2.5s: catboost processing
  // 2.5-3s: transfer to isotonic (arrow 2 active)
  // 3-5s: isotonic processing
  // 5-5.5s: transfer to output (arrow 3 active)
  // 5.5-6.5s: output adjustment
  // Total cycle: ~7s
  
  useEffect(() => {
    const runCycle = () => {
      // Generate new probabilities for this cycle
      const newRaw = (Math.random() * 0.5 + 0.35);
      const newCalibrated = Math.min(0.95, Math.max(0.08, newRaw * (0.85 + Math.random() * 0.25)));
      
      // Step 1: Transfer to CatBoost (0-500ms)
      setIsTransferring(1);
      setActiveStep(0);
      
      setTimeout(() => {
        // Step 2: CatBoost processing (500ms-2500ms)
        setIsTransferring(0);
        setActiveStep(1);
        setRawProba(newRaw);
      }, 500);
      
      setTimeout(() => {
        // Step 3: Transfer to Isotonic (2500ms-3000ms)
        setIsTransferring(2);
      }, 2500);
      
      setTimeout(() => {
        // Step 4: Isotonic processing (3000ms-5000ms)
        setIsTransferring(0);
        setActiveStep(2);
      }, 3000);
      
      setTimeout(() => {
        // Step 5: Transfer to Output (5000ms-5500ms)
        setIsTransferring(3);
      }, 5000);
      
      setTimeout(() => {
        // Step 6: Output adjustment (5500ms-6500ms)
        setIsTransferring(0);
        setActiveStep(3);
        setCalibratedProba(newCalibrated);
      }, 5500);
    };

    // Initial run
    runCycle();
    
    // Repeat every 7 seconds
    const interval = setInterval(runCycle, 7000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full">
      {/* Main Pipeline Container */}
      <div className="relative flex flex-col items-center gap-6">
        
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
        <AnimatedArrow active={isTransferring === 1} />

        {/* Row 2: CatBoost Model */}
        <CatBoostVisualizer active={activeStep >= 1} processing={activeStep === 1 && isTransferring === 0} rawProba={rawProba} />

        {/* Arrow 2: CatBoost → Calibration */}
        <AnimatedArrow active={isTransferring === 2} />

        {/* Row 3: Isotonic Calibration */}
        <IsotonicCalibrationVisualizer 
          active={activeStep >= 2} 
          processing={activeStep === 2 && isTransferring === 0}
          inputProba={rawProba} 
          outputProba={calibratedProba} 
        />

        {/* Arrow 3: Calibration → Output */}
        <AnimatedArrow active={isTransferring === 3} />

        {/* Row 4: Final Output */}
        <OutputDisplay probability={calibratedProba} active={activeStep >= 3} adjusting={activeStep === 3 && isTransferring === 0} />
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
function AnimatedArrow({ active }) {
  return (
    <div className={`relative transition-all duration-300 ${active ? 'opacity-100 scale-105' : 'opacity-30 scale-100'}`}>
      <svg width="60" height="70" viewBox="0 0 60 70" fill="none" className="overflow-visible">
        <defs>
          <linearGradient id={`arrowGrad-${active}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={active ? "#3b82f6" : "#ffffff"} stopOpacity={active ? "1" : "0.2"} />
            <stop offset="100%" stopColor={active ? "#8b5cf6" : "#ffffff"} stopOpacity={active ? "1" : "0.2"} />
          </linearGradient>
          <filter id="glowArrow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Main line */}
        <path 
          d="M30 5V55" 
          stroke={active ? "url(#arrowGrad-true)" : "rgba(255,255,255,0.2)"}
          strokeWidth={active ? "4" : "2"}
          strokeLinecap="round"
          filter={active ? "url(#glowArrow)" : ""}
          className="transition-all duration-300"
        />
        
        {/* Arrow head */}
        <path 
          d="M30 55L18 42M30 55L42 42" 
          stroke={active ? "url(#arrowGrad-true)" : "rgba(255,255,255,0.2)"}
          strokeWidth={active ? "4" : "2"}
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={active ? "url(#glowArrow)" : ""}
          className="transition-all duration-300"
        />
        
        {/* Animated particles when active */}
        {active && (
          <>
            <circle r="5" fill="#8b5cf6" filter="url(#glowArrow)">
              <animateMotion dur="0.4s" repeatCount="indefinite" path="M30 5 L30 55" />
            </circle>
            <circle r="4" fill="#3b82f6" filter="url(#glowArrow)">
              <animateMotion dur="0.4s" repeatCount="indefinite" path="M30 5 L30 55" begin="0.15s" />
            </circle>
            <circle r="3" fill="#a855f7" filter="url(#glowArrow)">
              <animateMotion dur="0.4s" repeatCount="indefinite" path="M30 5 L30 55" begin="0.3s" />
            </circle>
          </>
        )}
      </svg>
    </div>
  );
}

/* ================= CATBOOST VISUALIZER ================= */
function CatBoostVisualizer({ active, processing, rawProba }) {
  const [trees, setTrees] = useState([0.3, 0.5, 0.7, 0.4, 0.6, 0.45, 0.55]);
  const [displayProba, setDisplayProba] = useState(rawProba);
  
  // Smooth probability transition
  useEffect(() => {
    if (!active) return;
    
    const start = displayProba;
    const end = rawProba;
    const duration = 800;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayProba(start + (end - start) * eased);
      
      if (progress < 1) requestAnimationFrame(animate);
    };
    
    requestAnimationFrame(animate);
  }, [rawProba, active]);
  
  useEffect(() => {
    if (processing) {
      const interval = setInterval(() => {
        setTrees(trees.map(() => Math.random() * 0.5 + 0.3));
      }, 400);
      return () => clearInterval(interval);
    }
  }, [processing]);

  return (
    <div className={`relative w-full max-w-lg p-6 rounded-2xl border transition-all duration-500 ${
      active 
        ? 'bg-gradient-to-br from-[#1a2744] to-[#0e1424] border-blue-500/50 shadow-[0_0_50px_rgba(59,130,246,0.35)]' 
        : 'bg-[#141f38] border-white/10'
    }`}>
      {/* Animated background glow when processing */}
      {processing && (
        <div className="absolute inset-0 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-green-500/5" />
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 via-transparent to-green-500/30 blur-xl animate-pulse" />
        </div>
      )}
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-5">
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-500 ${
            processing ? 'bg-gradient-to-br from-blue-500/40 to-green-500/30 shadow-lg shadow-blue-500/40 scale-110' : 
            active ? 'bg-gradient-to-br from-blue-500/30 to-green-500/20 shadow-lg shadow-blue-500/30' : 'bg-white/5'
          }`}>
            <span className={`text-3xl transition-transform duration-300 ${processing ? 'animate-bounce' : ''}`}>🌲</span>
          </div>
          <div>
            <h3 className="font-bold text-xl text-white/90">CatBoost</h3>
            <p className="text-sm text-white/50">Gradient Boosted Decision Trees</p>
          </div>
          {/* Processing indicator */}
          <div className={`ml-auto px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
            processing ? 'bg-blue-500/30 text-blue-300 animate-pulse' : 
            active ? 'bg-green-500/20 text-green-300' : 'bg-white/5 text-white/30'
          }`}>
            {processing ? '⚡ Processing...' : active ? '✓ Ready' : 'Idle'}
          </div>
        </div>

        {/* Forest visualization */}
        <div className="relative h-44 mb-5 rounded-xl bg-[#0e1424]/80 border border-white/5 overflow-hidden">
          {/* Grid background */}
          <div className="absolute inset-0 opacity-30" style={{
            backgroundImage: 'linear-gradient(rgba(59,130,246,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.05) 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }} />
          
          {/* Trees row */}
          <div className="absolute inset-0 flex items-end justify-around px-4 pb-4">
            {trees.map((height, i) => (
              <div 
                key={i} 
                className="flex flex-col items-center"
                style={{ 
                  transform: active ? 'translateY(0)' : 'translateY(20px)',
                  opacity: active ? 1 : 0.4,
                  transition: `all 0.5s ease ${i * 60}ms`
                }}
              >
                {/* Tree SVG */}
                <svg 
                  width="40" 
                  height="55" 
                  viewBox="0 0 40 55" 
                  className="drop-shadow-lg"
                  style={{ 
                    filter: processing ? `drop-shadow(0 0 8px rgba(34, 197, 94, ${height}))` : 'none',
                    transition: 'filter 0.3s ease'
                  }}
                >
                  <polygon 
                    points="20,0 40,20 31,20 40,34 0,34 9,20 0,20" 
                    fill={active ? `rgba(34, 197, 94, ${0.5 + height * 0.5})` : 'rgba(255,255,255,0.1)'}
                    className="transition-all duration-300"
                  />
                  <rect x="15" y="34" width="10" height="14" fill={active ? '#8B5513' : 'rgba(255,255,255,0.1)'} rx="1" />
                  {processing && (
                    <circle cx="20" cy="20" r="14" fill={`rgba(34, 197, 94, ${height * 0.4})`} className="animate-ping" style={{ animationDuration: '1s' }} />
                  )}
                </svg>
                
                {/* Weight indicator */}
                <div 
                  className={`mt-2 w-8 rounded-full transition-all duration-500 ${
                    processing ? 'bg-gradient-to-t from-blue-600 via-blue-500 to-green-400' : 
                    active ? 'bg-gradient-to-t from-blue-600 to-blue-400' : 'bg-white/10'
                  }`}
                  style={{ 
                    height: `${height * 35 + 10}px`,
                    boxShadow: processing ? '0 0 15px rgba(59,130,246,0.6)' : active ? '0 0 10px rgba(59,130,246,0.4)' : 'none'
                  }}
                />
              </div>
            ))}
          </div>

          {/* Data flow particles */}
          {processing && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(15)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-blue-400 rounded-full"
                  style={{
                    left: `${3 + i * 6.5}%`,
                    animation: `floatUp 1.2s ease-out infinite`,
                    animationDelay: `${i * 0.08}s`,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Output */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              processing ? 'bg-blue-400 animate-ping' : active ? 'bg-green-400' : 'bg-white/30'
            }`} />
            <span className="text-sm text-white/60">Raw Probability Output</span>
          </div>
          <div className={`px-5 py-2.5 rounded-xl font-mono text-xl font-bold transition-all duration-500 ${
            active 
              ? 'bg-gradient-to-r from-blue-500/25 to-blue-600/25 border border-blue-500/50 text-blue-300 shadow-lg shadow-blue-500/25' 
              : 'bg-white/5 border border-white/10 text-white/40'
          }`}>
            {displayProba.toFixed(2)}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(180px); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-20px); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

/* ================= ISOTONIC CALIBRATION VISUALIZER ================= */
function IsotonicCalibrationVisualizer({ active, processing, inputProba, outputProba }) {
  const canvasRef = useRef(null);
  const [animatedPoint, setAnimatedPoint] = useState(0);
  
  // Animate the point along the curve when processing
  useEffect(() => {
    if (processing) {
      const duration = 1500;
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = progress < 0.5 
          ? 4 * progress * progress * progress 
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        setAnimatedPoint(eased);
        
        if (progress < 1) requestAnimationFrame(animate);
      };
      
      requestAnimationFrame(animate);
    }
  }, [processing, inputProba]);
  
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
    
    // Isotonic calibration function
    const calibrate = (x) => Math.pow(x, 0.85) * (1 - 0.1 * Math.sin(x * Math.PI));
    
    // Draw isotonic calibration curve
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, active ? '#8b5cf6' : 'rgba(255,255,255,0.2)');
    gradient.addColorStop(0.5, active ? '#a855f7' : 'rgba(255,255,255,0.2)');
    gradient.addColorStop(1, active ? '#ec4899' : 'rgba(255,255,255,0.2)');
    
    ctx.strokeStyle = gradient;
    ctx.lineWidth = active ? 3 : 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    ctx.beginPath();
    for (let i = 0; i <= 100; i++) {
      const x = i / 100;
      const y = calibrate(x);
      const px = x * width;
      const py = height - y * height;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    
    // Draw animated point when processing or active
    if (active) {
      const currentX = processing ? inputProba * animatedPoint : inputProba;
      const px = currentX * width;
      const calibY = calibrate(currentX);
      const py = height - calibY * height;
      
      // Vertical line from bottom
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.5)';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(px, height);
      ctx.lineTo(px, py);
      ctx.stroke();
      
      // Horizontal line to left
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(0, py);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Glowing point
      ctx.shadowColor = '#8b5cf6';
      ctx.shadowBlur = processing ? 25 : 15;
      ctx.fillStyle = '#8b5cf6';
      ctx.beginPath();
      ctx.arc(px, py, processing ? 8 : 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      
      // Inner white dot
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(px, py, 3, 0, Math.PI * 2);
      ctx.fill();
    }
    
  }, [active, processing, inputProba, outputProba, animatedPoint]);

  return (
    <div className={`relative w-full max-w-lg p-6 rounded-2xl border transition-all duration-500 ${
      active 
        ? 'bg-gradient-to-br from-[#1f1744] to-[#141424] border-purple-500/50 shadow-[0_0_50px_rgba(139,92,246,0.35)]' 
        : 'bg-[#141f38] border-white/10'
    }`}>
      {/* Background effect when processing */}
      {processing && (
        <div className="absolute inset-0 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/5" />
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/30 via-transparent to-pink-500/30 blur-xl animate-pulse" />
        </div>
      )}
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-5">
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-500 ${
            processing ? 'bg-gradient-to-br from-purple-500/40 to-pink-500/30 shadow-lg shadow-purple-500/40 scale-110' :
            active ? 'bg-gradient-to-br from-purple-500/30 to-pink-500/20 shadow-lg shadow-purple-500/30' : 'bg-white/5'
          }`}>
            <span className={`text-3xl transition-transform duration-300 ${processing ? 'animate-pulse' : ''}`}>📐</span>
          </div>
          <div>
            <h3 className="font-bold text-xl text-white/90">Isotonic Calibration</h3>
            <p className="text-sm text-white/50">Probability Correction Layer</p>
          </div>
          {/* Processing indicator */}
          <div className={`ml-auto px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
            processing ? 'bg-purple-500/30 text-purple-300 animate-pulse' : 
            active ? 'bg-green-500/20 text-green-300' : 'bg-white/5 text-white/30'
          }`}>
            {processing ? '⚡ Calibrating...' : active ? '✓ Ready' : 'Idle'}
          </div>
        </div>

        {/* Canvas for curve */}
        <div className="relative mb-5 rounded-xl bg-[#0e1424]/80 border border-white/5 overflow-hidden">
          <canvas 
            ref={canvasRef} 
            width={400} 
            height={200} 
            className="w-full h-44"
          />
          
          {/* Axis labels */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] text-white/40 bg-[#0e1424]/90 px-2 py-0.5 rounded">
            Raw Model Output
          </div>
          <div className="absolute left-1 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] text-white/40 bg-[#0e1424]/90 px-2 py-0.5 rounded">
            Calibrated
          </div>
          
          {/* Legend */}
          <div className="absolute top-2 right-2 flex flex-col gap-1.5 bg-[#0e1424]/80 p-2 rounded-lg">
            <div className="flex items-center gap-2 text-[10px] text-white/50">
              <div className="w-4 h-0.5 border-b border-dashed border-white/30" />
              <span>Perfect calibration</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-white/50">
              <div className="w-4 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded" />
              <span>Isotonic curve</span>
            </div>
          </div>
        </div>

        {/* Transformation display */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="text-center">
            <div className="text-[10px] text-white/40 mb-1.5">Raw Input</div>
            <div className={`px-4 py-2 rounded-lg font-mono text-base transition-all duration-300 ${
              active ? 'bg-white/10 text-white/80 border border-white/20' : 'bg-white/5 text-white/40'
            }`}>
              {inputProba.toFixed(2)}
            </div>
          </div>
          
          <div className={`flex items-center gap-2 transition-all duration-500 ${
            processing ? 'text-purple-400 scale-110' : active ? 'text-purple-400/60' : 'text-white/20'
          }`}>
            <span className="text-xl">→</span>
            <span className={`text-sm font-mono px-2 py-1 rounded ${processing ? 'bg-purple-500/20 animate-pulse' : ''}`}>f(x)</span>
            <span className="text-xl">→</span>
          </div>
          
          <div className="text-center">
            <div className="text-[10px] text-white/40 mb-1.5">Calibrated</div>
            <div className={`px-4 py-2 rounded-lg font-mono text-base font-bold transition-all duration-500 ${
              active 
                ? 'bg-gradient-to-r from-purple-500/25 to-pink-500/25 border border-purple-500/50 text-purple-300 shadow-lg shadow-purple-500/20' 
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
function OutputDisplay({ probability, active, adjusting }) {
  const [displayProba, setDisplayProba] = useState(probability);
  
  // Smooth probability transition over 1 second
  useEffect(() => {
    if (!active) return;
    
    const start = displayProba;
    const end = probability;
    const duration = 1000;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Smooth easing
      const eased = progress < 0.5 
        ? 4 * progress * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      setDisplayProba(start + (end - start) * eased);
      
      if (progress < 1) requestAnimationFrame(animate);
    };
    
    requestAnimationFrame(animate);
  }, [probability, active]);

  const riskLevel = displayProba > 0.7 ? 'HIGH' : displayProba > 0.4 ? 'MEDIUM' : 'LOW';
  const riskColor = displayProba > 0.7 ? 'red' : displayProba > 0.4 ? 'yellow' : 'green';
  
  const colorConfig = {
    red: {
      gradient: 'from-red-500/30 to-orange-500/10',
      border: 'border-red-500/60',
      text: 'text-red-400',
      glow: 'shadow-[0_0_60px_rgba(239,68,68,0.5)]',
      dot: 'bg-red-500',
      stroke: '#ef4444'
    },
    yellow: {
      gradient: 'from-yellow-500/30 to-amber-500/10',
      border: 'border-yellow-500/60',
      text: 'text-yellow-400',
      glow: 'shadow-[0_0_60px_rgba(234,179,8,0.5)]',
      dot: 'bg-yellow-500',
      stroke: '#eab308'
    },
    green: {
      gradient: 'from-green-500/30 to-emerald-500/10',
      border: 'border-green-500/60',
      text: 'text-green-400',
      glow: 'shadow-[0_0_60px_rgba(34,197,94,0.5)]',
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
      {/* Pulsing ring effect when adjusting */}
      {adjusting && (
        <div className="absolute inset-0 rounded-2xl overflow-hidden">
          <div className={`absolute inset-0 rounded-2xl border-2 ${colors.border}`} style={{ animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite' }} />
        </div>
      )}
      
      <div className="relative z-10 flex flex-col items-center">
        {/* Header */}
        <div className="mb-6 text-center">
          <span className="text-xs font-semibold text-white/40 uppercase tracking-widest">Fraud Risk Score</span>
        </div>

        {/* Circular progress */}
        <div className="relative w-40 h-40 mb-6">
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
              className="transition-all duration-300 ease-out"
              style={{
                filter: active ? `drop-shadow(0 0 12px ${colors.stroke})` : 'none'
              }}
            />
          </svg>
          
          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-5xl font-bold transition-all duration-300 ${
              active ? colors.text : 'text-white/30'
            }`} style={{ fontVariantNumeric: 'tabular-nums' }}>
              {Math.round(displayProba * 100)}%
            </span>
          </div>
        </div>

        {/* Risk level badge */}
        <div className={`flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-500 ${
          active 
            ? `bg-gradient-to-r ${colors.gradient} border ${colors.border}` 
            : 'bg-white/5 border border-white/10'
        }`}>
          <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
            active ? `${colors.dot}` : 'bg-white/30'
          } ${adjusting ? 'animate-ping' : active ? 'animate-pulse' : ''}`} />
          <span className={`font-bold text-sm tracking-wider transition-all duration-300 ${
            active ? colors.text : 'text-white/40'
          }`}>
            {riskLevel} RISK
          </span>
        </div>

        {/* Live indicator */}
        <div className={`mt-5 flex items-center gap-2 text-xs transition-all duration-300 ${
          active ? 'text-white/60' : 'text-white/20'
        }`}>
          <div className={`w-2 h-2 rounded-full ${adjusting ? 'bg-yellow-400 animate-pulse' : active ? 'bg-green-400' : 'bg-white/20'}`} />
          <span>{adjusting ? 'Adjusting score...' : active ? 'Live prediction' : 'Awaiting data...'}</span>
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
          <a href="/" className="flex items-center gap-3 hover:opacity-80 transition">
            <img src="/logo.jpg" alt="Logo" className="w-9 h-9 object-contain rounded-lg" />
            <span className="font-bold text-lg">AG Algo Lab</span>
          </a>
          <a
            href="/"
            className="text-sm px-4 py-2 rounded-lg border border-white/15 text-[#b7c3e6] hover:bg-white/5 hover:text-white transition"
          >
            ← Back home
          </a>
        </div>
      </nav>

      {/* ================= HERO ================= */}
      <section className="pt-32 pb-12 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <span className="inline-block text-sm font-medium bg-gradient-to-r from-[#2f4486] to-[#4f46e5] text-white px-4 py-1.5 rounded-full">
            AI · Insurance · Risk Management
          </span>

          <h1 className="mt-6 text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
            Fraud Risk Scoring
          </h1>

          <p className="mt-6 max-w-3xl mx-auto text-[#b7c3e6] text-lg md:text-xl leading-relaxed">
            An AI-driven insurance fraud detection system combining <span className="text-white font-semibold">CatBoost</span> with <span className="text-white font-semibold">isotonic calibration</span> to produce reliable, production-ready fraud risk scores.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a
              href="https://www.kaggle.com"
              target="_blank"
              rel="noreferrer"
              className="group px-8 py-4 rounded-xl bg-gradient-to-r from-[#2f4486] to-[#4f46e5] hover:from-[#3b5bb8] hover:to-[#5b5bd6] transition-all duration-300 font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105"
            >
              <span className="flex items-center gap-2">
                📊 View Kaggle Notebook
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </a>
            <a
              href="https://github.com/ag-algolab"
              target="_blank"
              rel="noreferrer"
              className="px-8 py-4 rounded-xl border border-white/20 hover:bg-white/5 hover:border-white/40 transition-all duration-300 font-semibold"
            >
              GitHub Repository
            </a>
          </div>
        </div>
      </section>

      {/* ================= PIPELINE VISUALIZATION ================= */}
      <section className="px-6 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Live Pipeline Demo</h2>
            <p className="text-white/50 max-w-2xl mx-auto">
              Watch the complete fraud detection pipeline process claims in real-time
            </p>
          </div>
          
          <AnimatedPipeline />
        </div>
      </section>

      {/* ================= FEATURES - Centered ================= */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            <Card
              title="Machine Learning Core"
              text="CatBoost gradient boosting handles mixed categorical and numerical features with state-of-the-art accuracy."
              icon="🌲"
            />
            <Card
              title="Probability Calibration"
              text="Isotonic regression ensures predicted probabilities reflect true fraud likelihood — no overconfidence."
              icon="📐"
            />
            <Card
              title="Production-Ready"
              text="Clean percentage outputs ready for dashboards, APIs, and real-time underwriting decisions."
              icon="🚀"
            />
          </div>
        </div>
      </section>

      {/* ================= RESULTS TEASER ================= */}
      <section className="px-6 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden bg-gradient-to-br from-[#141f38] via-[#1a2744] to-[#141f38] border border-white/10 rounded-3xl p-10 text-center">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
            </div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 text-sm font-semibold mb-6">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Outstanding Results
              </div>
              
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                See the Full Analysis
              </h3>
              
              <p className="text-[#b7c3e6] text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
                Our model achieves <span className="text-white font-semibold">exceptional discrimination</span> between fraudulent and legitimate claims. 
                The calibrated probabilities enable <span className="text-white font-semibold">precise risk-based prioritization</span> that transforms fraud detection operations.
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
              
              <a
                href="https://www.kaggle.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-300 font-bold text-lg shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105"
              >
                📊 Explore the Notebook
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}          
      <footer className="px-6 pb-10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 border-t border-white/10 pt-6">
          <div className="flex items-center gap-3">
            <img src="/logo.jpg" alt="Logo" className="w-6 h-6 object-contain rounded" />
            <span className="text-sm text-[#b7c3e6]">
              AG Algo Lab — Building intelligent systems
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
    <div className="bg-[#141f38] border border-white/10 rounded-2xl p-6 hover:border-white/20 hover:bg-[#1a2744] transition-all duration-300 group">
      <div className="flex flex-col items-center text-center">
        <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{icon}</div>
        <h3 className="font-semibold text-lg mb-2">{title}</h3>
        <p className="text-[#b7c3e6] text-sm leading-relaxed">{text}</p>
      </div>
    </div>
  );
}
