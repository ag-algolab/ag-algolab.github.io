import React from "react";
import CatBoostTree from "./CatBoostTree";



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
          <div className="grid lg:grid-cols-[520px_1fr] gap-10 items-center">
      
            {/* LEFT: Data + orbiting features */}
            <div className="card relative overflow-hidden">
              <div className="relative h-[420px] sm:h-[460px]">
      
                {/* Center: Data (fixed) */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                  <div className="input-orb w-32 h-32 rounded-full bg-white/5 backdrop-blur flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-white/90 font-semibold">Inputs</div>
                      <div className="text-[11px] text-white/50 mt-1">Some of the Data Provided</div>
                    </div>
                  </div>
                </div>

      
                {/* Orbiting tags (each tag animates independently) */}
                <div className="absolute inset-0">
                  {/* MIXED order (no color blocks) */}
                  <div className="orbit-tag tag-green"  style={{ "--phase": "-0s"   }}>Age of Policy Holder</div>
                  <div className="orbit-tag tag-green"  style={{ "--phase": "-1.2s" }}>Past Number of Claims</div>
                  <div className="orbit-tag tag-violet" style={{ "--phase": "-2.4s" }}>Vehicle Price</div>
                  <div className="orbit-tag tag-green"  style={{ "--phase": "-3.6s" }}>Marital Status</div>
                  <div className="orbit-tag tag-red"    style={{ "--phase": "-4.8s" }}>Accident Area</div>
                  <div className="orbit-tag tag-violet" style={{ "--phase": "-6.0s" }}>Vehicle Category</div>
                  <div className="orbit-tag tag-red"    style={{ "--phase": "-7.2s" }}>Witness Present</div>
                  <div className="orbit-tag tag-violet" style={{ "--phase": "-8.4s" }}>Age of Vehicle</div>
                  <div className="orbit-tag tag-red"    style={{ "--phase": "-9.6s" }}>Police Report Filed</div>
                  <div className="orbit-tag tag-violet" style={{ "--phase": "-10.8s" }}>Number of Cars</div>    
                </div>
              </div>
            </div>
      
            {/* RIGHT: Arrow → CatBoost (placeholder, step 1 only) */}
            <div className="relative">
              {/* Arrow (desktop) */}
              <svg
                className="hidden lg:block absolute -left-14 top-1/2 -translate-y-1/2"
                width="90"
                height="40"
                viewBox="0 0 90 40"
                fill="none"
              >
                <path d="M5 20H78" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
                <path d="M78 20L66 12" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
                <path d="M78 20L66 28" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
              </svg>
      
              <div className="card">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl">
                    🤖
                  </div>
                  <div>
                    <div className="text-white/90 font-semibold text-lg">CatBoost</div>
                    <div className="text-sm text-white/60 mt-1">
                      The model learns patterns from structured claim signals to estimate fraud risk.
                    </div>
                    <CatBoostTree />

                    <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-white/60">
                      <span className="opacity-80">Output:</span>
                      <span className="text-white/80">raw probability</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
      
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
