# -*- coding: utf-8 -*-
"""
Vérifie `public/` avant toute mise en ligne.

    python outils/verifier.py            # tout
    python outils/verifier.py --sans-depots   # sans recompter dans les dépôts voisins

Ce qui est contrôlé, page par page :
  - aucune macro non résolue ([[ … ]], {{ … }}) ;
  - un seul <h1>, un <title> de 20 à 70 caractères, une description de 80 à 170 ;
  - lang, canonical, hreflang fr / en / x-default, og:image, JSON-LD valide ;
  - chaque <img> a un alt non vide, des attributs width et height, et un
    fichier qui existe ;
  - chaque lien interne mène à un fichier de public/ ;
  - aucun lien en http:// ;
  - aucun mot interdit (« CTO », « lorem », « TODO », « Prépa 600® ») ;
  - la version ?v= de style.css et site.js est la même partout.
Puis, sur les chiffres :
  - les contrastes des couleurs de style.css (texte sur fond ≥ 4,5:1) ;
  - les faits de src/faits.json qui se recomptent dans les dépôts voisins
    (moliere-plateforme, tagemage) — un écart fait échouer la vérification.

Code de sortie : 0 si tout passe, 1 sinon. Les avertissements ne bloquent pas.
"""
import glob
import json
import os
import re
import subprocess
import sys
from html.parser import HTMLParser

sys.stdout.reconfigure(encoding="utf-8")

ICI = os.path.dirname(os.path.abspath(__file__))
RACINE = os.path.dirname(ICI)
PUB = os.path.join(RACINE, "public")
SRC = os.path.join(RACINE, "src")
PROJETS = os.path.dirname(RACINE)
DEPOT_MOLIERE = os.path.join(PROJETS, "moliere-plateforme")
DEPOT_P600 = os.path.join(PROJETS, "tagemage")

erreurs = []
avertissements = []


def erreur(msg):
    erreurs.append(msg)


def avertir(msg):
    avertissements.append(msg)


# ------------------------------------------------------------ analyse HTML
class Analyse(HTMLParser):
    def __init__(self):
        super().__init__()
        self.h1 = 0
        self.title = ""
        self.dans_title = False
        self.description = None
        self.lang = None
        self.canonical = None
        self.hreflangs = set()
        self.og_image = None
        self.images = []
        self.liens = []
        self.jsonld = []
        self.dans_jsonld = False
        self.assets = []

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "html":
            self.lang = a.get("lang")
        elif tag == "h1":
            self.h1 += 1
        elif tag == "title":
            self.dans_title = True
        elif tag == "meta":
            if a.get("name") == "description":
                self.description = a.get("content", "")
            if a.get("property") == "og:image":
                self.og_image = a.get("content")
        elif tag == "link":
            rel = a.get("rel", "")
            if rel == "canonical":
                self.canonical = a.get("href")
            if rel == "alternate" and a.get("hreflang"):
                self.hreflangs.add(a["hreflang"])
            if rel == "stylesheet" and a.get("href", "").startswith("/assets/"):
                self.assets.append(a["href"])
        elif tag == "img":
            self.images.append(a)
        elif tag == "a":
            if a.get("href"):
                self.liens.append(a["href"])
        elif tag == "script":
            if a.get("type") == "application/ld+json":
                self.dans_jsonld = True
                self.jsonld.append("")
            if a.get("src", "").startswith("/assets/"):
                self.assets.append(a["src"])

    def handle_endtag(self, tag):
        if tag == "title":
            self.dans_title = False
        if tag == "script":
            self.dans_jsonld = False

    def handle_data(self, data):
        if self.dans_title:
            self.title += data
        if self.dans_jsonld:
            self.jsonld[-1] += data


def fichier_pour(chemin):
    """Le fichier de public/ qui répond à un chemin absolu du site."""
    chemin = chemin.split("#")[0].split("?")[0]
    if not chemin.startswith("/"):
        return None
    cible = os.path.join(PUB, *[m for m in chemin.split("/") if m])
    if chemin.endswith("/") or not os.path.splitext(chemin)[1]:
        return os.path.join(cible, "index.html")
    return cible


MOTS_INTERDITS = ["CTO", "lorem", "TODO", "Prépa 600®", "Prepa 600®"]


def verifier_page(chemin):
    rel = os.path.relpath(chemin, PUB).replace(os.sep, "/")
    with open(chemin, encoding="utf-8") as f:
        texte = f.read()
    for macro in ("[[", "||", "]]", "{{f:", "{{d:", "{{p:", "{{accueil}}", "{{contenu}}"):
        if macro in texte:
            erreur("%s : macro non résolue « %s »" % (rel, macro))
    for mot in MOTS_INTERDITS:
        if re.search(r"(?<![A-Za-z])" + re.escape(mot) + r"(?![A-Za-z])", texte):
            erreur("%s : mot interdit « %s »" % (rel, mot))
    if "http://" in texte.replace("http://www.w3.org", "").replace("http://schema.org", ""):
        erreur("%s : lien en http:// non chiffré" % rel)
    for balise in ("div", "section", "article", "ul", "main"):
        ouverts = len(re.findall(r"<%s[\s>]" % balise, texte))
        fermes = texte.count("</%s>" % balise)
        if ouverts != fermes:
            erreur("%s : %d <%s> ouverts pour %d fermés" % (rel, ouverts, balise, fermes))
    if rel == "404.html":
        return
    p = Analyse()
    p.feed(texte)
    if p.h1 != 1:
        erreur("%s : %d <h1> (il en faut exactement un)" % (rel, p.h1))
    titre = p.title.strip()
    if not 20 <= len(titre) <= 70:
        avertir("%s : titre de %d caractères (« %s »)" % (rel, len(titre), titre))
    if p.description is None or not 80 <= len(p.description) <= 170:
        avertir("%s : description de %d caractères" % (rel, len(p.description or "")))
    if p.lang not in ("fr", "en"):
        erreur("%s : lang=%r" % (rel, p.lang))
    if not p.canonical:
        erreur("%s : pas de canonical" % rel)
    if not {"fr", "en", "x-default"} <= p.hreflangs:
        erreur("%s : hreflang incomplets %s" % (rel, sorted(p.hreflangs)))
    if not p.og_image:
        erreur("%s : pas d'og:image" % rel)
    else:
        og = p.og_image.replace("https://agalgolab.com", "")
        if not os.path.exists(fichier_pour(og) or ""):
            erreur("%s : og:image introuvable %s" % (rel, og))
    for j in p.jsonld:
        try:
            json.loads(j)
        except ValueError as e:
            erreur("%s : JSON-LD invalide (%s)" % (rel, e))
    for img in p.images:
        src = img.get("src", "")
        if not img.get("alt", "").strip():
            erreur("%s : image sans alt (%s)" % (rel, src))
        if not (img.get("width") and img.get("height")):
            erreur("%s : image sans width/height (%s)" % (rel, src))
        if src.startswith("/") and not os.path.exists(fichier_pour(src) or ""):
            erreur("%s : image introuvable %s" % (rel, src))
    for lien in p.liens:
        if lien.startswith("/"):
            f = fichier_pour(lien)
            if not f or not os.path.exists(f):
                erreur("%s : lien interne cassé %s" % (rel, lien))
        elif lien.startswith("#"):
            if lien != "#contenu" and ('id="%s"' % lien[1:]) not in texte:
                erreur("%s : ancre absente %s" % (rel, lien))
    for a in p.assets:
        if not os.path.exists(fichier_pour(a) or ""):
            erreur("%s : asset introuvable %s" % (rel, a))
    return p.assets


# --------------------------------------------------------------- contrastes
def luminance(hexa):
    hexa = hexa.lstrip("#")
    r, g, b = [int(hexa[i:i + 2], 16) / 255 for i in (0, 2, 4)]

    def f(c):
        return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)


def contraste(a, b):
    la, lb = luminance(a), luminance(b)
    hi, lo = max(la, lb), min(la, lb)
    return (hi + 0.05) / (lo + 0.05)


PAIRES = [  # (texte, fond, minimum, où)
    ("encre", "papier", 4.5, "texte courant"),
    ("encre", "papier-2", 4.5, "texte sur bandes papier-2"),
    ("encre", "carte", 4.5, "texte sur cartes"),
    ("encre-2", "papier", 4.5, "texte secondaire"),
    ("encre-2", "papier-2", 4.5, "texte secondaire sur papier-2"),
    ("encre-2", "carte", 4.5, "texte secondaire sur cartes"),
    ("accent-txt", "papier", 4.5, "liens et dates"),
    ("accent-txt", "carte", 4.5, "liens sur cartes"),
    ("accent", "papier", 3.0, "mot en italique des titres (gros texte)"),
    ("vert", "papier-2", 4.5, "étiquettes vertes"),
    ("vert", "vert-pale", 4.5, "étiquettes vertes sur leur fond"),
    ("nuit-txt", "nuit", 4.5, "texte sur bloc nuit"),
    ("nuit-txt-2", "nuit", 4.5, "texte secondaire sur bloc nuit"),
    ("ambre", "nuit", 4.5, "liens sur bloc nuit"),
    ("menthe", "nuit", 4.5, "signaux bas"),
]


def verifier_contrastes():
    with open(os.path.join(SRC, "assets", "style.css"), encoding="utf-8") as f:
        css = f.read()
    jetons = dict(re.findall(r"--([a-z0-9-]+):\s*(#[0-9A-Fa-f]{6})", css))
    for texte, fond, mini, ou in PAIRES:
        if texte not in jetons or fond not in jetons:
            erreur("contraste : jeton inconnu %s / %s" % (texte, fond))
            continue
        c = contraste(jetons[texte], jetons[fond])
        if c < mini:
            erreur("contraste %s sur %s = %.2f:1 < %.1f (%s)" % (texte, fond, c, mini, ou))
    # blanc sur les boutons
    c = contraste("#FFFFFF", jetons.get("accent", "#000000"))
    if c < 4.5:
        erreur("contraste blanc sur accent = %.2f:1 (boutons)" % c)
    return jetons


# ------------------------------------------------------------- les faits
def recompter():
    with open(os.path.join(SRC, "faits.json"), encoding="utf-8") as f:
        faits = json.load(f)

    def attendu(chemin):
        n = faits
        for m in chemin.split("."):
            n = n[m]
        return n["valeur"] if isinstance(n, dict) else n

    def comparer(nom, mesure):
        att = attendu(nom)
        if mesure != att:
            erreur("fait %s : faits.json dit %s, le dépôt dit %s" % (nom, att, mesure))

    def compter_git(depot):
        try:
            r = subprocess.run(["git", "-C", depot, "rev-list", "--count", "HEAD"],
                               capture_output=True, text=True, timeout=30)
            return int(r.stdout.strip())
        except Exception:
            return None

    if os.path.isdir(DEPOT_MOLIERE):
        app = os.path.join(DEPOT_MOLIERE, "src", "app")
        pages = glob.glob(os.path.join(app, "**", "page.tsx"), recursive=True)
        comparer("moliere.ecrans", len(pages))
        comparer("moliere.routes_api", len(glob.glob(os.path.join(app, "api", "**", "route.ts"), recursive=True)))
        comparer("moliere.migrations", len([n for n in os.listdir(os.path.join(DEPOT_MOLIERE, "db")) if re.match(r"\d\d_.*\.sql$", n)]))
        rel = [os.path.relpath(p, app).replace(os.sep, "/") for p in pages]
        comparer("moliere.ecrans_site", sum(1 for r in rel if r.startswith("(site)")))
        comparer("moliere.ecrans_eleve", sum(1 for r in rel if r.startswith("eleve")))
        comparer("moliere.ecrans_prof", sum(1 for r in rel if r.startswith("prof")))
        comparer("moliere.ecrans_admin", sum(1 for r in rel if r.startswith("admin")))
        comparer("moliere.ecrans_communs", sum(1 for r in rel if not r.startswith(("(site)", "eleve", "prof", "admin"))))
        n = compter_git(DEPOT_MOLIERE)
        if n is not None and n != attendu("moliere.commits"):
            avertir("moliere.commits : faits.json dit %s, le dépôt en est à %s (à mettre à jour avec la date)" % (attendu("moliere.commits"), n))
    else:
        avertir("dépôt Molière absent : faits non recomptés")

    if os.path.isdir(DEPOT_P600):
        comparer("p600.pages", len(glob.glob(os.path.join(DEPOT_P600, "public", "*.html"))))
        comparer("p600.endpoints", len([n for n in os.listdir(os.path.join(DEPOT_P600, "api")) if n.endswith(".js") and not n.startswith("_")]))
        with open(os.path.join(DEPOT_P600, "donnees", "items.json"), encoding="utf-8") as f:
            comparer("p600.questions", len(json.load(f)["items"]))
        n = compter_git(DEPOT_P600)
        if n is not None and n != attendu("p600.commits"):
            avertir("p600.commits : faits.json dit %s, le dépôt en est à %s (à mettre à jour avec la date)" % (attendu("p600.commits"), n))
    else:
        avertir("dépôt Prépa 600 absent : faits non recomptés")

    if attendu("total.commits") != attendu("moliere.commits") + attendu("p600.commits"):
        erreur("total.commits ne vaut pas moliere.commits + p600.commits")


# ----------------------------------------------------------------- main
def main():
    if not os.path.isdir(PUB):
        print("public/ absent : lancer d'abord python outils/construire.py")
        sys.exit(1)
    pages = sorted(glob.glob(os.path.join(PUB, "**", "*.html"), recursive=True))
    # les redirections /en/ ne sont pas des pages : elles ne portent qu'un canonique
    pages = [p for p in pages if not os.path.relpath(p, PUB).replace(os.sep, "/").startswith("en/")]
    versions = set()
    for page in pages:
        assets = verifier_page(page) or []
        for a in assets:
            versions.add(a)
    css = {a for a in versions if "style.css" in a}
    js = {a for a in versions if "site.js" in a}
    if len(css) > 1 or len(js) > 1:
        erreur("versions ?v= incohérentes : %s" % sorted(versions))
    verifier_contrastes()
    if "--sans-depots" not in sys.argv:
        recompter()
    for fichier in ("sitemap.xml", "robots.txt", "llms.txt", "CNAME", "404.html"):
        if not os.path.exists(os.path.join(PUB, fichier)):
            erreur("fichier manquant : " + fichier)

    print("%d pages vérifiées" % len(pages))
    for a in avertissements:
        print("  avertissement : " + a)
    for e in erreurs:
        print("  ERREUR : " + e)
    if erreurs:
        print("ÉCHEC : %d erreur(s)" % len(erreurs))
        sys.exit(1)
    print("OK — rien à signaler" if not avertissements else "OK — %d avertissement(s)" % len(avertissements))


if __name__ == "__main__":
    main()
