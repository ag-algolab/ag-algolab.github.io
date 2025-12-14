import React from "react";

/*
  Fraud Risk Scoring
  AG Algo Lab × Dauphine PSL × EY
*/

export default function FraudRiskScoring() {
  return (
    <main className="min-h-screen bg-[#0e1424] text-[#e7ecff]">

      {/* ================= NAVBAR ================= */}
      <nav className="fixed top-0 w-full z-50 bg-[#0e1424]/80 backdrop-blur border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

          {/* Left: AG Algo Lab */}
          <div className="flex items-center gap-3">
            <img
              src="/logos/ag.png"
              alt="AG Algo Lab"
              className="h-9 w-9 object-contain"
            />
            <span className="font-bold text-lg">
              Fraud Risk Scoring
            </span>
          </div>

          {/* Right: Dauphine + EY */}
          <div className="flex items-center gap-4">
            <img
              src="/logos/dauphine.png"
              alt="Dauphine PSL"
              className="h-8 object-contain"
            />
            <img
              src="/logos/ey.png"
              alt="EY"
              className="h-7 object-contain"
            />
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
            An AI-based insurance fraud detection system combining machine-learning
            classification and probabilistic calibration to deliver reliable,
            business-ready fraud risk scores.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="https://github.com/ag-algolab"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 rounded-xl bg-[#2f4486] hover:bg-[#3b5bb8] transition font-semibold"
            >
              GitHub Repository
            </a>

            <a
              href="#methodology"
              className="px-6 py-3 rounded-xl border border-white/20 hover:bg-white/5 transition"
            >
              Methodology
            </a>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="px-6 pb-24">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">

          {/* LEFT COLUMN */}
          <div className="space-y-6">
            <Card
              title="Calibrated Fraud Probability"
              text="Each claim is assigned a fraud probability calibrated using isotonic regression, ensuring that risk scores reflect real-world frequencies."
              icon="📊"
            />

            <Card
              title="Business-Oriented Thresholds"
              text="Risk thresholds are designed for operational decision-making: automatic approval, human review, or high-risk flagging."
              icon="⚖️"
            />

            <Card
              title="Explainable Risk Scores"
              text="The scoring system is built to remain interpretable, allowing insurers to understand and justify each decision."
              icon="🔍"
            />
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
            <img
              src="/logos/ag.png"
              alt="AG Algo Lab"
              className="h-8 object-contain"
            />
            <span className="text-sm text-[#b7c3e6]">
              AG Algo Lab — Fraud Risk Scoring
            </span>
          </div>

          <div className="text-sm text-[#b7c3e6]">
            Dauphine PSL × EY · Academic & Industry Project
          </div>

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
