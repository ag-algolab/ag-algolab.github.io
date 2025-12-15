import React from "react";



export default function FraudRiskScoring() {
  return (
    <main className="min-h-screen bg-[#0e1424] text-[#e7ecff]">

      {/* ================= NAVBAR ================= */}
      <nav className="fixed top-0 w-full z-50 bg-[#0e1424]/80 backdrop-blur border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

          {/* Left: AG Algo Lab */}
          <div className="flex items-center gap-3">
            <img src="/logo.jpg" alt="Logo" className="w-9 h-9 object-contain rounded-lg" />
            <span className="font-bold text-lg">
              Hackathon 2025
            </span>
          </div>

          {/* Right: Dauphine + EY */}
          <div className="flex items-center gap-4">
            <img src="/ey.png" alt="EY" className="h-10 object-contain" />
            <span className="text-white/60 font-semibold">×</span>
            <img src="/dauphine.png" alt="Dauphine PSL" className="h-8 object-contain" />
          </div>
        </div>
      </nav>

      {/* ================= HERO ================= */}
      <section className="pt-32 pb-20 px-6">
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






      {/* ================= HOW IT WORKS (Serpentine) ================= */}
      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <p className="text-xs uppercase tracking-wider text-white/50">How it works</p>
            <h2 className="text-2xl md:text-3xl font-semibold text-white/90">
              From claim data to a calibrated fraud risk score
            </h2>
            <p className="mt-2 text-sm text-white/60 max-w-3xl">
              A user-friendly pipeline: data signals → CatBoost risk model → isotonic calibration → business-ready probability score.
            </p>
          </div>
      
          <div className="relative">
            <div className="grid lg:grid-cols-[520px_1fr] gap-10 items-start">
              {/* LEFT: Data orbit */}
              <div className="relative">
                <div className="card relative overflow-hidden">
                  <div className="absolute inset-0 opacity-40 pointer-events-none" />
      
                  <div className="relative h-[420px] sm:h-[460px]">
                    {/* Center: Data */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                      <div className="w-32 h-32 rounded-full border border-white/20 bg-white/5 backdrop-blur flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.06)]">
                        <div className="text-center">
                          <div className="text-white/90 font-semibold">Data</div>
                          <div className="text-[11px] text-white/50 mt-1">Claim signals</div>
                        </div>
                      </div>
                    </div>
      
                    {/* Orbit ring (rotates). Items counter-rotate to stay horizontal */}
                    <div className="orbit absolute left-1/2 top-1/2">
                      {/* VEHICLE group (blue) */}
                      <div className="tag tag-blue" style={{ "--a": "0deg" }}>
                        Vehicle Price
                      </div>
                      <div className="tag tag-blue" style={{ "--a": "45deg" }}>
                        Vehicle Category
                      </div>
                      <div className="tag tag-blue" style={{ "--a": "90deg" }}>
                        Age of Vehicle
                      </div>
      
                      {/* DRIVER group (green) */}
                      <div className="tag tag-green" style={{ "--a": "135deg" }}>
                        Age
                      </div>
                      <div className="tag tag-green" style={{ "--a": "180deg" }}>
                        Marital Status
                      </div>
      
                      {/* HISTORY group (red) */}
                      <div className="tag tag-red" style={{ "--a": "225deg" }}>
                        Past # Claims
                      </div>
                      <div className="tag tag-red" style={{ "--a": "270deg" }}>
                        Number of Cars
                      </div>
                      <div className="tag tag-red" style={{ "--a": "315deg" }}>
                        Base Policy
                      </div>
                    </div>
      
                    {/* Small legend */}
                    <div className="absolute left-5 bottom-5 flex flex-wrap gap-2">
                      <span className="px-2 py-1 text-xs rounded-full bg-white/5 border border-white/10 text-white/60">
                        Blue = Vehicle
                      </span>
                      <span className="px-2 py-1 text-xs rounded-full bg-white/5 border border-white/10 text-white/60">
                        Green = Person
                      </span>
                      <span className="px-2 py-1 text-xs rounded-full bg-white/5 border border-white/10 text-white/60">
                        Red = History
                      </span>
                    </div>
                  </div>
                </div>
      
                {/* Arrow → to CatBoost */}
                <svg
                  className="hidden lg:block absolute -right-10 top-1/2 -translate-y-1/2"
                  width="90"
                  height="40"
                  viewBox="0 0 90 40"
                  fill="none"
                >
                  <path d="M5 20H78" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
                  <path d="M78 20L66 12" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
                  <path d="M78 20L66 28" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
                </svg>
              </div>
      
              {/* RIGHT: Serpentine nodes */}
              <div className="relative">
                <div className="grid gap-6">
                  {/* CatBoost node */}
                  <div className="card relative">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl">
                        🤖
                      </div>
                      <div>
                        <div className="text-white/90 font-semibold text-lg">CatBoost</div>
                        <div className="text-sm text-white/60 mt-1">
                          Learns fraud risk patterns from heterogeneous insurance data (categorical + numeric).
                        </div>
                        <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/60">
                          <span className="opacity-80">Model output:</span>
                          <span className="text-white/80">raw probability</span>
                        </div>
                      </div>
                    </div>
                  </div>
      
                  {/* Arrow ↓ */}
                  <div className="hidden lg:flex justify-start pl-6">
                    <svg width="40" height="70" viewBox="0 0 40 70" fill="none">
                      <path d="M20 5V55" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
                      <path d="M20 55L12 43" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
                      <path d="M20 55L28 43" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
                    </svg>
                  </div>
      
                  {/* Isotonic Calibration node */}
                  <div className="card relative">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl">
                        🧠
                      </div>
                      <div>
                        <div className="text-white/90 font-semibold text-lg">Isotonic Calibration</div>
                        <div className="text-sm text-white/60 mt-1">
                          Adjusts raw scores so probabilities better reflect real-world frequencies (less over/under-confidence).
                        </div>
                        <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/60">
                          <span className="opacity-80">Output:</span>
                          <span className="text-white/80">calibrated risk score</span>
                        </div>
                      </div>
                    </div>
                  </div>
      
                  {/* Arrow ← to Output (serpentine back to left) */}
                  <div className="relative h-[90px] hidden lg:block">
                    <svg className="absolute left-0 top-0" width="100%" height="90" viewBox="0 0 900 90" fill="none">
                      {/* Right-to-left arrow */}
                      <path d="M860 45H120" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
                      <path d="M120 45L132 37" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
                      <path d="M120 45L132 53" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
                    </svg>
      
                    {/* Output node placed visually on the left */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[320px]">
                      <div className="card">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl">
                            ✅
                          </div>
                          <div>
                            <div className="text-white/90 font-semibold text-lg">Output</div>
                            <div className="text-sm text-white/60 mt-1">
                              A calibrated fraud probability you can use to prioritize claim reviews (not a hard yes/no).
                            </div>
                            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/60">
                              <span className="opacity-80">Example:</span>
                              <span className="text-white/80">Fraud risk = 72%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
      
                  {/* Mobile fallback: show Output as normal card */}
                  <div className="lg:hidden card">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl">
                        ✅
                      </div>
                      <div>
                        <div className="text-white/90 font-semibold text-lg">Output</div>
                        <div className="text-sm text-white/60 mt-1">
                          A calibrated fraud probability used to prioritize investigations — not a binary decision.
                        </div>
                      </div>
                    </div>
                  </div>
      
                </div>
              </div>
            </div>
      
            {/* Local CSS for orbit */}
            <style jsx>{`
              .orbit {
                width: 360px;
                height: 360px;
                transform: translate(-50%, -50%);
                animation: spin 16s linear infinite;
              }
      
              .tag {
                position: absolute;
                left: 50%;
                top: 50%;
                width: 170px;
                padding: 10px 12px;
                border-radius: 14px;
                background: rgba(255, 255, 255, 0.06);
                border: 1px solid rgba(255, 255, 255, 0.12);
                color: rgba(255, 255, 255, 0.85);
                font-size: 12px;
                line-height: 1;
                text-align: center;
      
                /* Put each tag on the ring and keep it horizontal */
                transform:
                  rotate(var(--a))
                  translateX(170px)
                  rotate(calc(-1 * var(--a)));
                backdrop-filter: blur(8px);
              }
      
              .tag-blue {
                border-color: rgba(59, 130, 246, 0.55);
                color: rgba(147, 197, 253, 0.95);
              }
              .tag-green {
                border-color: rgba(34, 197, 94, 0.55);
                color: rgba(134, 239, 172, 0.95);
              }
              .tag-red {
                border-color: rgba(239, 68, 68, 0.55);
                color: rgba(252, 165, 165, 0.95);
              }
      
              @keyframes spin {
                from { transform: translate(-50%, -50%) rotate(0deg); }
                to   { transform: translate(-50%, -50%) rotate(360deg); }
              }
            `}</style>
          </div>
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
      
            <pre
              className="codeblock text-sm leading-relaxed font-mono"
              aria-label="Install & import"
            >
              <code>
                <span className="text-yellow-400">pip</span> install POF
                {"\n\n"}
                <span className="text-blue-400">from</span> POF{" "}
                <span className="text-blue-400">import</span>{" "}
                launch_fraud_scoring
                {"\n"}
                <span className="text-purple-300">
                  launch_fraud_scoring()
                </span>
              </code>
            </pre>
          </div>
                



          {/* RIGHT COLUMN */}
          <div className="space-y-6">
            <Card
              title="Machine Learning Core"
              text="The engine relies on CatBoost, a powerful gradient boosting algorithm well-suited for heterogeneous insurance data."
              icon="🤖"
            />

            <Card
              title="Probability Calibration"
              text="Raw model outputs are corrected via isotonic calibration to avoid overconfidence and misinterpretation."
              icon="🧠"
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
      <section
        id="methodology"
        className="px-6 pb-24"
      >
        <div className="max-w-5xl mx-auto bg-[#141f38] border border-white/10 rounded-2xl p-8">

          <h2 className="text-2xl font-bold mb-4">
            Methodology
          </h2>

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
          <h3 className="font-semibold text-lg mb-1">
            {title}
          </h3>
          <p className="text-[#b7c3e6] text-sm leading-relaxed">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}
