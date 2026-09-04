# -*- coding: utf-8 -*-
"""
Fabrique les images de partage (Open Graph, 1200 × 630) dans la DA du site,
en anglais ET en français.

    python outils/og.py

Écrit les pages HTML temporaires dans _travail/og/, les photographie avec
Edge headless (une à la fois) et dépose les PNG dans src/assets/img/ :
og-agalgolab-en.png, og-agalgolab-fr.png, og-institut-moliere-en.png, …
`construire.py` choisit la version de la langue de la page.
Relancer ensuite `python outils/construire.py`.

⚠️ À lancer depuis PowerShell (Edge lancé depuis Bash n'écrit rien).
"""
import json
import os
import sys

sys.stdout.reconfigure(encoding="utf-8")
ICI = os.path.dirname(os.path.abspath(__file__))
RACINE = os.path.dirname(ICI)
sys.path.insert(0, ICI)
from capturer import capturer, trouver_edge  # noqa: E402

with open(os.path.join(RACINE, "src", "faits.json"), encoding="utf-8") as _f:
    _F = json.load(_f)


def fait(chemin):
    n = _F
    for m in chemin.split("."):
        n = n[m]
    return n["valeur"] if isinstance(n, dict) else n


def nb(n, lang):
    if not isinstance(n, int):
        return str(n)
    s = "{:,}".format(n)
    return s.replace(",", " ") if lang == "fr" else s


GABARIT = """<!doctype html><html lang="%(lang)s"><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;700;800&family=JetBrains+Mono:wght@600&display=swap" rel="stylesheet">
<style>
html,body{margin:0;width:1200px;height:630px;overflow:hidden;background:#EAF7F1;color:#0B2E1F;font-family:"Plus Jakarta Sans",Arial,sans-serif}
.sol{position:absolute;left:760px;top:120px;width:700px;height:700px;transform:rotateX(58deg) rotateZ(-45deg);background-image:linear-gradient(rgba(4,120,87,.22) 1px,transparent 1px),linear-gradient(90deg,rgba(4,120,87,.22) 1px,transparent 1px);background-size:60px 60px;border:1px solid rgba(4,120,87,.35)}
.scene{position:absolute;inset:0;perspective:1800px}
.in{position:absolute;left:72px;top:64px;right:72px;bottom:60px;display:flex;flex-direction:column;justify-content:space-between}
.etq{display:flex;align-items:center;gap:14px;font:600 20px/1 "JetBrains Mono",monospace;letter-spacing:.1em;text-transform:uppercase;color:#046C4E}
.etq::before{content:"";width:16px;height:16px;background:#10B981;transform:rotate(45deg)}
h1{font:800 %(taille)spx/1.08 "Plus Jakarta Sans",Arial,sans-serif;letter-spacing:-.035em;margin:0;max-width:760px}
h1 em{font-style:normal;color:#047857}
.bas{display:flex;justify-content:space-between;align-items:flex-end;font:500 22px/1.4 "Plus Jakarta Sans",Arial,sans-serif;color:#3F5F50}
.bas b{font:800 30px/1 "Plus Jakarta Sans",Arial,sans-serif;color:#0B2E1F;display:flex;align-items:center;gap:12px;letter-spacing:-.03em}
.bas b img{height:36px;width:auto}
.tag{position:absolute;background:#0B2E1F;color:#fff;font:600 18px/1.3 "JetBrains Mono",monospace;padding:12px 16px;border-radius:8px;white-space:nowrap}
.tag b{color:#6EE7B7;font-size:24px;margin-right:8px}
</style></head><body><div class="scene"><div class="sol"></div></div><div class="in">
<p class="etq">%(etq)s</p><h1>%(titre)s</h1>
<div class="bas"><b><img src="%(logo)s" alt="">AG Algo Lab</b><span>%(bas)s</span></div></div>
<div class="tag" style="left:900px;top:150px">%(tag1)s</div><div class="tag" style="left:840px;top:330px">%(tag2)s</div>
</body></html>"""

TEXTES = {
    "fr": {
        "og-agalgolab": (74, "La vision, le produit, la mise en ligne",
                         "Des plateformes web complètes, <em>construites seul</em>, posées sur une seule base.",
                         "agalgolab.com", "<b>%s</b>produits en production" % fait("total.produits"),
                         "<b>%s</b>commits · %s jours" % (nb(fait("total.commits"), "fr"), fait("moliere.jours"))),
        "og-institut-moliere": (66, "Cas client · en ligne depuis le 25 août 2026",
                                "Institut Molière : tout le site et toute la plateforme, <em>construits seul</em>.",
                                "%s écrans · %s routes d'API · %s commits" % (fait("moliere.ecrans"), fait("moliere.routes_api"), fait("moliere.commits")),
                                "<b>%s</b>écrans" % fait("moliere.ecrans"),
                                "<b>%s</b>commits · %s jours" % (fait("moliere.commits"), fait("moliere.jours"))),
        "og-prepa-600": (66, "Produit propre · prepa600.com · ouvert le 31 août 2026",
                         "Prépa 600 : un produit <em>conçu, écrit et ouvert</em> en six jours.",
                         "%s questions · %s pages · %s fonctions serveur" % (fait("p600.questions"), fait("p600.pages"), fait("p600.endpoints")),
                         "<b>%s</b>questions" % fait("p600.questions"),
                         "<b>%s</b>jours jusqu'à l'ouverture" % fait("p600.jours")),
    },
    "en": {
        "og-agalgolab": (74, "The vision, the product, the launch",
                         "Complete web platforms, <em>built solo</em>, resting on a single foundation.",
                         "agalgolab.com", "<b>%s</b>products in production" % fait("total.produits"),
                         "<b>%s</b>commits · %s days" % (nb(fait("total.commits"), "en"), fait("moliere.jours"))),
        "og-institut-moliere": (66, "Client case · live since 25 August 2026",
                                "Institut Molière: the whole site and the whole platform, <em>built solo</em>.",
                                "%s screens · %s API routes · %s commits" % (fait("moliere.ecrans"), fait("moliere.routes_api"), fait("moliere.commits")),
                                "<b>%s</b>screens" % fait("moliere.ecrans"),
                                "<b>%s</b>commits · %s days" % (fait("moliere.commits"), fait("moliere.jours"))),
        "og-prepa-600": (66, "Own product · prepa600.com · opened 31 August 2026",
                         "Prépa 600: a product <em>designed, written and launched</em> in six days.",
                         "%s questions · %s pages · %s server functions" % (fait("p600.questions"), fait("p600.pages"), fait("p600.endpoints")),
                         "<b>%s</b>questions" % fait("p600.questions"),
                         "<b>%s</b>days to opening" % fait("p600.jours")),
    },
}


def main():
    edge = trouver_edge()
    travail = os.path.join(RACINE, "_travail", "og")
    os.makedirs(travail, exist_ok=True)
    logo = "file:///" + os.path.join(RACINE, "src", "assets", "img", "logo-ag.png").replace(os.sep, "/")
    for lang, images in TEXTES.items():
        for nom, (taille, etq, titre, bas, tag1, tag2) in images.items():
            page = os.path.join(travail, "%s-%s.html" % (nom, lang))
            page_html = GABARIT
            for cle, val in (("lang", lang), ("taille", str(taille)), ("etq", etq), ("titre", titre), ("bas", bas), ("tag1", tag1), ("tag2", tag2), ("logo", logo)):
                page_html = page_html.replace("%(" + cle + ")s", val)
            with open(page, "w", encoding="utf-8") as f:
                f.write(page_html)
            sortie = os.path.join(RACINE, "src", "assets", "img", "%s-%s.png" % (nom, lang))
            capturer(edge, "file:///" + page.replace(os.sep, "/"), sortie, 1200, 630, budget=20000)
    # les anciennes images sans langue ne servent plus
    for nom in ("og-agalgolab.png", "og-institut-moliere.png", "og-prepa-600.png"):
        p = os.path.join(RACINE, "src", "assets", "img", nom)
        if os.path.exists(p):
            os.remove(p)


if __name__ == "__main__":
    main()
