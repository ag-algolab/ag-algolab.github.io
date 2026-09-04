# -*- coding: utf-8 -*-
"""
Fabrique les images de partage (Open Graph, 1200 × 630) dans la DA du site.

    python outils/og.py

Écrit trois pages HTML temporaires dans _travail/og/, les photographie avec
Edge headless (une à la fois) et dépose les PNG dans src/assets/img/ :
og-agalgolab.png, og-institut-moliere.png, og-prepa-600.png.
Relancer ensuite `python outils/construire.py` pour les copier dans public/.

⚠️ À lancer depuis PowerShell (Edge lancé depuis Bash n'écrit rien).
"""
import os
import sys

sys.stdout.reconfigure(encoding="utf-8")
ICI = os.path.dirname(os.path.abspath(__file__))
RACINE = os.path.dirname(ICI)
sys.path.insert(0, ICI)
from capturer import capturer, trouver_edge  # noqa: E402

GABARIT = """<!doctype html><html lang="fr"><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
<style>
html,body{margin:0;width:1200px;height:630px;overflow:hidden;background:#F6F2E8;color:#171410;font-family:"Instrument Sans",Arial,sans-serif}
.fond{position:absolute;inset:0;background-image:linear-gradient(rgba(23,20,16,.075) 1px,transparent 1px),linear-gradient(90deg,rgba(23,20,16,.075) 1px,transparent 1px);background-size:28px 28px;-webkit-mask-image:radial-gradient(ellipse 80% 70% at 30% 20%,#000 40%,transparent 100%)}
.in{position:absolute;left:72px;top:64px;right:72px;bottom:60px;display:flex;flex-direction:column;justify-content:space-between}
.etq{display:flex;align-items:center;gap:14px;font:500 20px/1 "JetBrains Mono",monospace;letter-spacing:.09em;text-transform:uppercase;color:#57503F}
.etq::before{content:"";width:16px;height:16px;background:#E4491C;border-radius:4px}
h1{font:400 %(taille)spx/1.12 "Instrument Serif",Georgia,serif;letter-spacing:-.012em;margin:0;max-width:1000px}
h1 em{font-style:italic;color:#C8401A}
.bas{display:flex;justify-content:space-between;align-items:flex-end;font:400 22px/1.4 "Instrument Sans",Arial,sans-serif;color:#57503F}
.bas b{font:400 30px/1 "Instrument Serif",Georgia,serif;color:#171410;display:flex;align-items:center;gap:12px}
.bas b::before{content:"";width:14px;height:14px;background:#E4491C;border-radius:4px}
</style></head><body><div class="fond"></div><div class="in">
<p class="etq">%(etq)s</p><h1>%(titre)s</h1>
<div class="bas"><b>AG Algo Lab</b><span>%(bas)s</span></div></div></body></html>"""

IMAGES = [
    ("og-agalgolab", 84, "Anthony Gocmen · développeur full-stack indépendant",
     "Des plateformes web complètes, <em>construites seul</em>, de l'idée à la mise en ligne.",
     "agalgolab.com"),
    ("og-institut-moliere", 72, "Cas client · en ligne depuis le 25 août 2026",
     "Institut Molière : tout le site et toute la plateforme, <em>construits seul</em>.",
     "72 écrans · 13 routes d'API · 523 commits en 20 jours"),
    ("og-prepa-600", 72, "Produit propre · prepa600.com · ouvert le 31 août 2026",
     "Prépa 600 : un produit <em>conçu, écrit et ouvert</em> en six jours.",
     "540 questions · 27 pages · 15 fonctions serveur"),
]


def main():
    edge = trouver_edge()
    travail = os.path.join(RACINE, "_travail", "og")
    os.makedirs(travail, exist_ok=True)
    for nom, taille, etq, titre, bas in IMAGES:
        page = os.path.join(travail, nom + ".html")
        with open(page, "w", encoding="utf-8") as f:
            page_html = GABARIT
            for cle, val in (("taille", str(taille)), ("etq", etq), ("titre", titre), ("bas", bas)):
                page_html = page_html.replace("%(" + cle + ")s", val)
            f.write(page_html)
        sortie = os.path.join(RACINE, "src", "assets", "img", nom + ".png")
        capturer(edge, "file:///" + page.replace(os.sep, "/"), sortie, 1200, 630, budget=20000)


if __name__ == "__main__":
    main()
