import React, { useEffect, useMemo, useRef, useState } from "react";

export default function CatBoostCategoryEngine() {
  const tokens = useMemo(
    () => [
      { t: "cat₁", s: "bg-white/5 border-white/10 text-white/70" },
      { t: "cat₂", s: "bg-white/5 border-white/10 text-white/70" },
      { t: "cat₃", s: "bg-white/5 border-white/10 text-white/70" },
      { t: "cat₄", s: "bg-white/5 border-white/10 text-white/70" },
      { t: "cat₅", s: "bg-white/5 border-white/10 text-white/70" },
    ],
    []
  );

  const [step, setStep] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => setStep((s) => (s + 1) % 5), 900);
    return () => clearInterval(timerRef.current);
  }, []);

  const bars = useMemo(() => {
    // deterministic-ish but animated by step
    const base = [0.25, 0.55, 0.35, 0.75, 0.45, 0.62, 0.28, 0.52];
    return base.map((v, i) => {
      const bump = ((step + i) % 5) * 0.04;
      return Math.min(0.92, v + bump);
    });
  }, [step]);

  return (
    <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold text-white/70 tracking-wide">
          Category Engine
        </div>
        <div className="text-[11px] text-white/45">
          categorical → numeric signal
        </div>
      </div>

      {/* Engine */}
      <div className="mt-3 grid grid-cols-[1fr_220px_1fr] gap-3 items-center">
        {/* Left: category tokens (no feature names) */}
        <div className="relative h-[120px] rounded-xl border border-white/10 bg-[#0e1424]/40 overflow-hidden">
          <TokenRail tokens={tokens} step={step} />
          <div className="absolute left-3 bottom-2 text-[10px] text-white/40">
            incoming categories
          </div>
        </div>

        {/* Middle: encoder chamber */}
        <div className="relative h-[120px] rounded-xl border border-white/10 bg-[#0e1424]/55 overflow-hidden">
          <EncoderCore step={step} />
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 opacity-60">
              <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-44 h-44 rounded-full blur-2xl bg-[#2f4486]/40" />
              <div className="absolute -right-10 top-1/2 -translate-y-1/2 w-44 h-44 rounded-full blur-2xl bg-[#e7ecff]/10" />
            </div>
          </div>
          <div className="absolute left-3 bottom-2 text-[10px] text-white/40">
            encoding & ordered statistics
          </div>
        </div>

        {/* Right: numeric embedding bars */}
        <div className="relative h-[120px] rounded-xl border border-white/10 bg-[#0e1424]/40 overflow-hidden">
          <div className="absolute inset-0 p-3 flex items-end gap-1.5">
            {bars.map((v, i) => (
              <div
                key={i}
                className="w-full rounded-md border border-white/10 bg-white/5"
                style={{
                  height: `${Math.round(v * 100)}%`,
                  transform: `translateY(${step % 2 === 0 ? 0 : -1}px)`,
                  transition: "height 500ms ease, transform 500ms ease",
                }}
              />
            ))}
          </div>
          <div className="absolute left-3 bottom-2 text-[10px] text-white/40">
            numeric representation
          </div>
        </div>
      </div>

      {/* Bottom: subtle output pill */}
      <div className="mt-3 flex items-center justify-between">
        <div className="text-xs text-white/55">
          CatBoost handles mixed categorical signals without manual one-hot noise.
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/60">
          <span className="opacity-80">Output:</span>
          <span className="text-white/80">raw probability</span>
        </div>
      </div>

      {/* Local keyframes (no external CSS needed) */}
      <style>{css}</style>
    </div>
  );
}

function TokenRail({ tokens, step }) {
  return (
    <div className="absolute inset-0">
      {tokens.map((x, i) => {
        const active = i === step;
        return (
          <div
            key={x.t}
            className={`absolute left-3 top-3 px-2.5 py-1 rounded-full border text-[11px] ${x.s}`}
            style={{
              transform: `translateY(${i * 18}px) translateX(${active ? 6 : 0}px)`,
              opacity: active ? 1 : 0.75,
              transition: "transform 450ms ease, opacity 450ms ease",
            }}
          >
            {x.t}
          </div>
        );
      })}

      {/* moving particles to show flow */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 10 }).map((_, k) => (
          <span
            key={k}
            className="cat-dot"
            style={{
              top: `${12 + (k % 5) * 18}px`,
              animationDelay: `${k * 0.18}s`,
              opacity: 0.55,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function EncoderCore({ step }) {
  return (
    <div className="absolute inset-0 p-3">
      {/* core ring */}
      <div className="relative h-full rounded-lg border border-white/10 bg-white/5 overflow-hidden">
        <div className="absolute inset-0 encoder-grid opacity-60" />
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[86px] h-[86px] rounded-full border border-white/10 bg-[#0e1424]/40"
          style={{
            boxShadow:
              step % 2 === 0
                ? "0 0 26px rgba(47,68,134,0.45)"
                : "0 0 18px rgba(47,68,134,0.30)",
            transition: "box-shadow 500ms ease",
          }}
        >
          <div className="absolute inset-2 rounded-full border border-white/10 bg-white/5 encoder-spin" />
          <div className="absolute inset-0 flex items-center justify-center text-[10px] text-white/60">
            encoder
          </div>
        </div>

        {/* left → right pulse */}
        <div className="absolute left-0 top-0 h-full w-full pointer-events-none">
          <div
            className="encoder-scan"
            style={{ animationDuration: "1.8s" }}
          />
        </div>
      </div>
    </div>
  );
}

const css = `
@keyframes catDot {
  0%   { transform: translateX(-10px); opacity: 0; }
  10%  { opacity: .55; }
  60%  { opacity: .55; }
  100% { transform: translateX(260px); opacity: 0; }
}
.cat-dot{
  position:absolute;
  left:-10px;
  width:3px;
  height:3px;
  border-radius:999px;
  background: rgba(231,236,255,.7);
  box-shadow: 0 0 10px rgba(47,68,134,.55);
  animation: catDot 2.2s linear infinite;
}

.encoder-grid{
  background-image:
    linear-gradient(rgba(255,255,255,.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,.06) 1px, transparent 1px);
  background-size: 18px 18px;
  transform: translateZ(0);
}

@keyframes spinSlow {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
.encoder-spin{
  animation: spinSlow 6s linear infinite;
}

@keyframes scan {
  0%   { transform: translateX(-40%); opacity: 0; }
  20%  { opacity: .35; }
  60%  { opacity: .35; }
  100% { transform: translateX(140%); opacity: 0; }
}
.encoder-scan{
  position:absolute;
  top:0;
  left:0;
  width:40%;
  height:100%;
  background: linear-gradient(90deg, transparent, rgba(47,68,134,.22), transparent);
  filter: blur(0.2px);
  animation: scan linear infinite;
}
`;
