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
  - la version ?v= de style.css et site.js est la même partout ;
  - aucun loading="lazy" (règle du 06/09 : tout se charge dès l'ouverture —
    le rendu réel se contrôle avec verifier_rendu.py, dans Edge) ;
  - aucune image de src/assets/img au-delà de 4,2 mégapixels (décodage).
Puis, sur les chiffres :
  - les contrastes des couleurs de style.css (texte sur fond ≥ 4,5:1) ;
  - les faits de src/faits.json qui se recomptent dans les dépôts voisins
    (moliere-plateforme, tagemage) — un écart fait échouer la vérification.
    Le recomptage est celui de `recompter.py`, qui sait aussi les réécrire :
    quand la vérification refuse un chiffre, lancer `python outils/recompter.py`
    puis reconstruire.

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
    for macro in ("[[", "||", "]]", "{{f:", "{{d:", "{{j:", "{{m:", "{{M:", "{{p:", "{{accueil}}", "{{contenu}}"):
        if macro in texte:
            erreur("%s : macro non résolue « %s »" % (rel, macro))
    for mot in MOTS_INTERDITS:
        if re.search(r"(?<![A-Za-z])" + re.escape(mot) + r"(?![A-Za-z])", texte):
            erreur("%s : mot interdit « %s »" % (rel, mot))
    # règle du 06/09 : aucune image « à l'approche ». Une vitrine atteinte d'un
    # coup de molette restait blanche ; tout se charge dès l'ouverture, et
    # outils/verifier_rendu.py le prouve dans Edge (images, débordement, cibles).
    if 'loading="lazy"' in texte:
        erreur("%s : loading=\"lazy\" interdit (toutes les images se chargent dès l'ouverture)" % rel)
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
        if not img.get("alt", "").strip() and img.get("aria-hidden") != "true":
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

    if not os.path.isdir(DEPOT_MOLIERE):
        avertir("dépôt Molière absent : faits non recomptés")
    if not os.path.isdir(DEPOT_P600):
        avertir("dépôt Prépa 600 absent : faits non recomptés")

    # le recomptage est celui de recompter.py, mot pour mot : un seul endroit
    # décide de ce que compte un « écran » ou un « blanc ».
    sys.path.insert(0, ICI)
    import recompter
    for chemin, valeur in sorted(recompter.mesurer().items()):
        if chemin.endswith("commits") or chemin == "total.jours_service":
            if valeur != attendu(chemin):
                avertir("%s : faits.json dit %s, le dépôt en est à %s (python outils/recompter.py)"
                        % (chemin, attendu(chemin), valeur))
        else:
            comparer(chemin, valeur)

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
    for src_page in glob.glob(os.path.join(SRC, "pages", "*.html")):
        with open(src_page, encoding="utf-8") as f:
            if 'loading="lazy"' in f.read():
                erreur("src/pages/%s : loading=\"lazy\" interdit" % os.path.basename(src_page))
    # règle du 06/09 : aucune image stockée au-delà de 4,2 Mpx — une image de
    # 19 Mpx se téléchargeait, mais mettait des secondes à se décoder au moment
    # de se peindre (écran blanc au défilement). rafraichir.py découpe en tuiles.
    from PIL import Image, ImageStat
    for chemin in sorted(glob.glob(os.path.join(SRC, "assets", "img", "*.webp"))):
        w, h = Image.open(chemin).size
        if w * h > 4_200_000:
            erreur("image trop lourde à décoder : %s (%d × %d = %.1f Mpx) — à découper en tuiles (rafraichir.py)"
                   % (os.path.basename(chemin), w, h, w * h / 1e6))
        # ⚠️ Une capture TROUÉE (06/09) : au-delà d'une certaine surface, Chrome
        # rendait des bandes vides sans le dire, et la moitié basse des deux
        # vitrines d'accueil était crème — c'est ce qu'Anthony voyait défiler.
        # Une tuile de capture entièrement unie n'existe pas légitimement :
        # les vraies pages ont toujours du texte ou une image quelque part.
        # (Les blancs de mise en page, eux, ne couvrent jamais un fichier
        # entier : la tuile fautive mesurait 0,1 d'écart-type.)
        ecart = ImageStat.Stat(Image.open(chemin).convert("L")).stddev[0]
        if ecart < 2:
            erreur("capture trouée : %s est entièrement unie (écart-type %.1f) — refaire la capture (rafraichir.py)"
                   % (os.path.basename(chemin), ecart))
    # règle du 06/09 (audit du lot 20) : toute image citée par une page existe,
    # et toute image du dossier est citée. Les données structurées de TOUTES
    # les pages pointaient vers og-agalgolab.png, supprimé le 04/09 quand
    # og.py s'est mis à fabriquer une image par langue — un lien mort que
    # personne ne voyait, parce qu'il n'est lu que par les robots.
    citees = set()
    for page in pages:
        with open(page, encoding="utf-8") as f:
            citees |= set(re.findall(r"/assets/img/([A-Za-z0-9._-]+\.(?:webp|png|jpg|jpeg|svg))", f.read()))
    dossier = {os.path.basename(f) for f in glob.glob(os.path.join(SRC, "assets", "img", "*"))}
    for manquante in sorted(citees - dossier):
        erreur("image citée mais absente du dossier : %s" % manquante)
    # ⚠️ Une image dont plus aucune page ne parle N'EST PAS supprimée tout de
    # suite : GitHub Pages sert le HTML avec `max-age=600`, donc pendant dix
    # minutes des visiteurs réclament encore l'ancienne liste de tuiles. Le
    # 06/09, sept tuiles supprimées le jour même ont vidé les deux vitrines de
    # l'accueil chez Anthony. On ne retire donc qu'au passage SUIVANT
    # (`--nettoyer`, et seulement au-delà d'un jour).
    import time as _t
    for orpheline in sorted(dossier - citees):
        chemin = os.path.join(SRC, "assets", "img", orpheline)
        heures = (_t.time() - os.path.getmtime(chemin)) / 3600.0
        poids = os.path.getsize(chemin) // 1024
        if "--nettoyer" in sys.argv and heures > 24:
            os.remove(chemin)
            print("  retirée : %s (%d Ko, plus citée depuis %.0f h)" % (orpheline, poids, heures))
        else:
            avertir("image que plus aucune page ne cite : %s (%d Ko, %.0f h) — "
                    "`python outils/verifier.py --nettoyer` la retirera passé un jour"
                    % (orpheline, poids, heures))
    # un formulaire qui poste dans le vide perd des clients sans le dire
    for page in pages:
        with open(page, encoding="utf-8") as f:
            if "A-REMPLIR" in f.read():
                erreur("%s : le formulaire n'a pas d'adresse (FORMULAIRE dans construire.py)"
                       % os.path.relpath(page, PUB).replace(os.sep, "/"))
                break
    verifier_contrastes()
    if "--sans-depots" not in sys.argv:
        recompter()
    try:
        import datetime
        with open(os.path.join(SRC, "faits.json"), encoding="utf-8") as f:
            releve = json.load(f)["site"]["releve_rendu"]["valeur"]
        age = (datetime.date.today() - datetime.date.fromisoformat(releve)).days
        if age > 8:
            avertir("le relevé de rendu date de %d jours : python outils/verifier_rendu.py (PowerShell)" % age)
    except (KeyError, ValueError):
        avertir("aucun relevé de rendu dans faits.json : python outils/verifier_rendu.py (PowerShell)")
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
