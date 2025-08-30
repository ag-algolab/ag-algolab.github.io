// src/pages/ShahMat.jsx
import React from "react";

export default function ShahMat() {
  return (
    <main className="theme-shahmat min-h-screen text-[var(--paper)] bg-[var(--bg)] relative overflow-hidden">
      {/* Motif chessboard + petits points */}
      <div className="absolute inset-0 -z-10 shahmat-pattern" aria-hidden />

      {/* Logos de pièces en filigrane */}
      {/* Place tes PNG dans /public/logos/ (ex: knight.png, queen.png, rook.png, bishop.png, king.png, pawn.png) */}
      <img src="/logos/knight.png" alt="" className="piece-bg piece-1" />
      <img src="/logos/queen.png"  alt="" className="piece-bg piece-2" />
      <img src="/logos/rook.png"   alt="" className="piece-bg piece-3" />
      <img src="/logos/bishop.png" alt="" className="piece-bg piece-4" />

      <section className="px-6 md:px-10 lg:px-16 py-16">
        <header className="max-w-5xl mx-auto mb-10">
          <span className="inline-block text-sm font-medium bg-[var(--accent)] text-[var(--ink-strong)] px-3 py-1 rounded-full">
            Free & Open-Source
          </span>
          <h1 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight">
            ShahMat · Chess.com Analytics Package
          </h1>
          <p className="mt-4 text-[var(--ink-soft)] max-w-3xl">
            Récupère, analyse et visualise tes parties Chess.com&nbsp;: stats par heure,
            différence d’Elo, White/Black breakdown, et graphes clean — en un appel.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="https://pypi.org/project/shahmat/"
              className="btn-accent"
              target="_blank" rel="noreferrer"
            >
              PyPI · Install
            </a>
            <a
              href="https://github.com/ag-algolab/ShahMat"
              className="btn-ghost"
              target="_blank" rel="noreferrer"
            >
              GitHub
            </a>
            <button
              className="btn-ghost"
              onClick={() => {
                navigator.clipboard?.writeText("pip install shahmat");
              }}
            >
              Copier&nbsp;: <code className="opacity-80">pip install shahmat</code>
            </button>
          </div>
        </header>

        {/* Quick Start */}
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="card-title">Quick start</h2>
            <pre className="codeblock" aria-label="Install & import">
{`pip install shahmat

from shahmat import chesscom
df = chesscom(username="your_name", start_year=2023)
df.head()`}
            </pre>
            <ul className="mt-4 list-disc pl-5 text-sm text-[var(--paper-soft)] space-y-1">
              <li>Stats par heure de jeu (SR/volume)</li>
              <li>Impact Elo diff (toi vs. adversaire)</li>
              <li>Split White / Black</li>
              <li>Visuels clairs & rapides</li>
            </ul>
          </div>

          {/* Cards features */}
          <div className="grid gap-6">
            <div className="card">
              <h3 className="card-subtitle">Performances par heure</h3>
              <p className="card-text">
                Découvre quand tu joues le mieux (ou le pire) et adapte ta routine.
              </p>
            </div>
            <div className="card">
              <h3 className="card-subtitle">Elo difference</h3>
              <p className="card-text">
                Visualise l’impact de l’écart Elo sur ton score rate, avec bins propres.
              </p>
            </div>
            <div className="card">
              <h3 className="card-subtitle">White vs Black</h3>
              <p className="card-text">
                Compare rapidement tes résultats selon la couleur jouée.
              </p>
            </div>
          </div>
        </div>

        {/* CTA bas de page */}
        <div className="max-w-5xl mx-auto mt-12 p-5 rounded-2xl bg-[var(--bg-soft)] border border-white/5 flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex-1">
            <h3 className="font-semibold text-lg">Tu veux contribuer&nbsp;?</h3>
            <p className="text-sm text-[var(--paper-soft)]">
              Roadmap légère, issues bienvenues. Ajoute un plot, une stat, ou une idée UI.
            </p>
          </div>
          <a
            href="https://github.com/ag-algolab/ShahMat/issues"
            className="btn-accent"
            target="_blank" rel="noreferrer"
          >
            Ouvrir une issue
          </a>
        </div>
      </section>
    </main>
  );
}
