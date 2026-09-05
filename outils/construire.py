# -*- coding: utf-8 -*-
"""
Construit `public/` à partir de `src/` : deux langues, un seul gabarit.

    python outils/construire.py

Ce que ça fait, dans l'ordre :
  1. lit `src/faits.json` — les chiffres du site, avec leur source et leur date ;
  2. pour chaque page de `src/pages/*.html`, produit une version anglaise
     (à la racine) et une version française (sous `/fr/`) ;
  3. enveloppe chaque page dans `src/gabarit.html` (en-tête, navigation,
     pied, balises de référencement, données structurées) ;
  4. copie `src/assets/` vers `public/assets/` ;
  5. écrit `sitemap.xml`, `robots.txt`, `llms.txt`, `404.html`, `CNAME`.

Syntaxe des pages :
  [[texte français||English text]]   — un texte, deux langues ; se met
                                        n'importe où, y compris dans un
                                        attribut (title, alt, content)
  {{f:moliere.ecrans}}                — un chiffre de faits.json, formaté
                                        dans la langue (70 795 / 70,795)
  {{d:moliere.en_ligne}}              — une date de faits.json, en toutes
                                        lettres (25 août 2026 / 25 August 2026)
  {{p:prepa-600}}                     — le chemin d'une page dans la langue
                                        courante (/prepa-600/ ou /en/prepa-600/)
  {{accueil}}                         — le chemin de l'accueil dans la langue

L'en-tête de page (entre deux lignes `---`) déclare : slug, titre, description,
type (accueil | cas | projet | legal), image (OG), modifie (AAAA-MM-JJ).
`public/` est régénéré entièrement à chaque passage : ne rien y modifier à la
main, tout part de `src/`.
"""
import html
import json
import hashlib
import os
import re
import shutil
import sys

sys.stdout.reconfigure(encoding="utf-8")

ICI = os.path.dirname(os.path.abspath(__file__))
RACINE = os.path.dirname(ICI)
SRC = os.path.join(RACINE, "src")
PUB = os.path.join(RACINE, "public")
DOMAINE = "https://agalgolab.com"
LANGUES = ("en", "fr")   # l'anglais est la langue principale du site (racine), le français sous /fr/
COURRIEL = "anthony@agalgolab.com"

MOIS_FR = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet",
           "août", "septembre", "octobre", "novembre", "décembre"]
MOIS_EN = ["January", "February", "March", "April", "May", "June", "July",
           "August", "September", "October", "November", "December"]

with open(os.path.join(SRC, "faits.json"), encoding="utf-8") as f:
    FAITS = json.load(f)


# --------------------------------------------------------------- utilitaires
def chercher_fait(chemin):
    noeud = FAITS
    for morceau in chemin.split("."):
        if not isinstance(noeud, dict) or morceau not in noeud:
            raise KeyError("fait inconnu : %s" % chemin)
        noeud = noeud[morceau]
    if isinstance(noeud, dict) and "valeur" in noeud:
        noeud = noeud["valeur"]
    return noeud


def nombre(v, lang):
    if isinstance(v, bool) or not isinstance(v, (int, float)):
        return str(v)
    if isinstance(v, float):
        s = ("%.1f" % v)
        return s.replace(".", ",") if lang == "fr" else s
    s = "{:,}".format(v)
    # espace fine insécable en français, virgule en anglais
    return s.replace(",", " ") if lang == "fr" else s


def date_lettres(iso, lang):
    a, m, j = (int(x) for x in iso.split("-"))
    if lang == "fr":
        jour = "1er" if j == 1 else str(j)
        return "%s %s %d" % (jour, MOIS_FR[m - 1], a)
    return "%d %s %d" % (j, MOIS_EN[m - 1], a)


def chemin_page(slug, lang):
    base = "/" if lang == "en" else "/fr/"
    return base if slug == "index" else base + slug + "/"


def image_partage(meta, lang):
    """og-agalgolab.png → og-agalgolab-en.png si cette version existe."""
    img = meta.get("image", "/assets/img/og-agalgolab.png")
    cand = img[:-4] + "-" + lang + ".png"
    if os.path.exists(os.path.join(SRC, cand.lstrip("/").replace("/", os.sep))):
        return cand
    return img


def resoudre(texte, lang, slug):
    """Applique les macros dans l'ordre : langue, faits, dates, chemins."""
    def choix(m):
        return m.group(1) if lang == "fr" else m.group(2)
    texte = re.sub(r"\[\[(.*?)\|\|(.*?)\]\]", choix, texte, flags=re.S)
    texte = re.sub(r"\{\{f:([a-z0-9_.]+)\}\}",
                   lambda m: nombre(chercher_fait(m.group(1)), lang), texte)
    texte = re.sub(r"\{\{d:([a-z0-9_.]+)\}\}",
                   lambda m: date_lettres(chercher_fait(m.group(1)), lang), texte)
    texte = re.sub(r"\{\{p:([a-z0-9-]+)\}\}",
                   lambda m: chemin_page(m.group(1), lang), texte)
    texte = texte.replace("{{accueil}}", chemin_page("index", lang))
    texte = texte.replace("{{courriel}}", COURRIEL)
    texte = texte.replace("{{lang}}", lang)
    reste = re.findall(r"\[\[|\{\{[a-z]+:", texte)
    if reste:
        raise ValueError("macro non résolue dans %s (%s) : %s" % (slug, lang, reste[:3]))
    return dimensions_images(texte)


_empreintes = {}


def empreinte(chemin):
    """Huit caractères du contenu du fichier : l'adresse change quand l'image
    change, et le navigateur ne peut plus servir la précédente."""
    if chemin not in _empreintes:
        with open(chemin, "rb") as f:
            _empreintes[chemin] = hashlib.sha1(f.read()).hexdigest()[:8]
    return _empreintes[chemin]


def dimensions_images(texte):
    """Pose width et height sur chaque <img> locale d'après le fichier réel :
    les captures sont rafraîchies chaque semaine et changent de hauteur."""
    from PIL import Image

    def poser(m):
        balise = m.group(0)
        src = re.search(r'src="/assets/img/([^"]+)"', balise).group(1)
        chemin = os.path.join(SRC, "assets", "img", src)
        if not os.path.exists(chemin):
            return balise
        w, h = Image.open(chemin).size
        balise = re.sub(r'\s(width|height)="[^"]*"', "", balise)
        # …et une empreinte du contenu dans l'adresse. Une capture rafraîchie
        # garde le même nom de fichier : sans ça, le navigateur d'un visiteur
        # (ou celui d'Anthony) sert l'ancienne image pendant des jours, et la
        # vitrine s'arrête au tiers de la page parce que l'image est plus
        # courte qu'avant. Vérifié le 05/09 : c'était exactement ça.
        balise = balise.replace('src="/assets/img/%s"' % src,
                                'src="/assets/img/%s?v=%s"' % (src, empreinte(chemin)), 1)
        return balise.replace("<img ", '<img width="%d" height="%d" ' % (w, h), 1)
    return re.sub(r'<img [^>]*src="/assets/img/[^"]+"[^>]*>', poser, texte)


def lire_page(chemin):
    with open(chemin, encoding="utf-8") as f:
        brut = f.read()
    m = re.match(r"^---\n(.*?)\n---\n(.*)$", brut, flags=re.S)
    if not m:
        raise ValueError("en-tête manquant : " + chemin)
    meta = {}
    for ligne in m.group(1).splitlines():
        if ":" in ligne:
            cle, val = ligne.split(":", 1)
            meta[cle.strip()] = val.strip()
    for cle in ("slug", "titre", "description", "type", "modifie"):
        if cle not in meta:
            raise ValueError("en-tête de %s : clé manquante %s" % (chemin, cle))
    return meta, m.group(2)


# ---------------------------------------------------------- données structurées
def jsonld(meta, lang, slug):
    url = DOMAINE + chemin_page(slug, lang)
    nom = "AG Algo Lab"
    personne = {
        "@type": "Person",
        "@id": DOMAINE + "/#anthony",
        "name": "Anthony Gocmen",
        "url": DOMAINE + "/",
        "email": COURRIEL,
        "jobTitle": "Fondateur d'AG Algo Lab" if lang == "fr" else "Founder of AG Algo Lab",
        "sameAs": ["https://www.linkedin.com/in/anthony-gocmen",
                   "https://github.com/ag-algolab"],
        "worksFor": {"@id": DOMAINE + "/#org"},
        "image": DOMAINE + "/assets/img/anthony.jpg",
    }
    org = {
        "@type": "ProfessionalService",
        "@id": DOMAINE + "/#org",
        "name": nom,
        "legalName": "Anthony Gocmen — entreprise individuelle (AG Algo Lab)",
        "url": DOMAINE + "/",
        "email": COURRIEL,
        "founder": {"@id": DOMAINE + "/#anthony"},
        "logo": DOMAINE + "/assets/img/icone-512.png",
        "image": DOMAINE + "/assets/img/og-agalgolab.png",
        "vatID": "FR77935081703",
        "identifier": {"@type": "PropertyValue", "propertyID": "SIREN", "value": "935081703"},
        "address": {"@type": "PostalAddress", "streetAddress": "6 rue de la Norée",
                    "postalCode": "27630", "addressLocality": "Vexin-sur-Epte",
                    "addressCountry": "FR"},
        "areaServed": ["FR"],
        "description": resoudre(meta["description"], lang, slug),
        "knowsAbout": ["Next.js", "TypeScript", "Supabase", "PostgreSQL", "Vercel",
                       "Stripe", "SEO", "Claude Code"],
    }
    site = {
        "@type": "WebSite",
        "@id": DOMAINE + "/#site",
        "url": DOMAINE + "/",
        "name": nom,
        "inLanguage": ["fr", "en"],
        "publisher": {"@id": DOMAINE + "/#org"},
    }
    page = {
        "@type": "WebPage",
        "@id": url,
        "url": url,
        "name": resoudre(meta["titre"], lang, slug),
        "description": resoudre(meta["description"], lang, slug),
        "inLanguage": lang,
        "isPartOf": {"@id": DOMAINE + "/#site"},
        "dateModified": meta["modifie"],
        "primaryImageOfPage": DOMAINE + image_partage(meta, lang),
    }
    graphe = [org, personne, site, page]
    if slug != "index":
        graphe.append({
            "@type": "BreadcrumbList",
            "itemListElement": [
                {"@type": "ListItem", "position": 1,
                 "name": "Accueil" if lang == "fr" else "Home",
                 "item": DOMAINE + chemin_page("index", lang)},
                {"@type": "ListItem", "position": 2, "name": page["name"], "item": url},
            ],
        })
    if meta["type"] in ("cas", "projet"):
        page["@type"] = "Article"
        page["headline"] = page["name"]
        page["author"] = {"@id": DOMAINE + "/#anthony"}
        page["publisher"] = {"@id": DOMAINE + "/#org"}
        page["image"] = page["primaryImageOfPage"]
    return json.dumps({"@context": "https://schema.org", "@graph": graphe},
                      ensure_ascii=False, indent=1)


# ------------------------------------------------------------------ construction
def construire():
    with open(os.path.join(SRC, "gabarit.html"), encoding="utf-8") as f:
        gabarit = f.read()

    pages = []
    for nom in sorted(os.listdir(os.path.join(SRC, "pages"))):
        if nom.endswith(".html"):
            pages.append(lire_page(os.path.join(SRC, "pages", nom)))

    # public/ repart de zéro
    if os.path.isdir(PUB):
        shutil.rmtree(PUB)
    os.makedirs(PUB)
    shutil.copytree(os.path.join(SRC, "assets"), os.path.join(PUB, "assets"))

    urls = []
    for meta, corps in pages:
        slug = meta["slug"]
        for lang in LANGUES:
            autre = "en" if lang == "fr" else "fr"
            chemin = chemin_page(slug, lang)
            titre = resoudre(meta["titre"], lang, slug)
            description = resoudre(meta["description"], lang, slug)
            contenu = resoudre(corps, lang, slug)
            page = gabarit
            remplacements = {
                "{{contenu}}": contenu,
                "{{titre}}": html.escape(titre, quote=True),
                "{{description}}": html.escape(description, quote=True),
                "{{canonical}}": DOMAINE + chemin,
                "{{alt_fr}}": DOMAINE + chemin_page(slug, "fr"),
                "{{alt_en}}": DOMAINE + chemin_page(slug, "en"),
                "{{alt_defaut}}": DOMAINE + chemin_page(slug, "en"),
                "{{switch_href}}": chemin_page(slug, autre),
                "{{switch_lang}}": autre,
                "{{switch_label}}": "EN" if lang == "fr" else "FR",
                "{{switch_title}}": ("Read this page in English" if lang == "fr"
                                     else "Lire cette page en français"),
                "{{og_image}}": DOMAINE + image_partage(meta, lang),
                "{{og_locale}}": "fr_FR" if lang == "fr" else "en_GB",
                "{{jsonld}}": jsonld(meta, lang, slug),
                "{{type}}": meta["type"],
                "{{slug}}": slug,
            }
            for cle, val in remplacements.items():
                page = page.replace(cle, val)
            page = resoudre(page, lang, slug)
            dossier = os.path.join(PUB, *[m for m in chemin.strip("/").split("/") if m])
            os.makedirs(dossier, exist_ok=True)
            with open(os.path.join(dossier, "index.html"), "w", encoding="utf-8", newline="\n") as f:
                f.write(page)
            urls.append((slug, lang, chemin, meta["modifie"], titre, description))

    # sitemap avec les alternates de langue
    lignes = ['<?xml version="1.0" encoding="UTF-8"?>',
              '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" '
              'xmlns:xhtml="http://www.w3.org/1999/xhtml">']
    for slug, lang, chemin, modifie, _, _ in urls:
        lignes.append("  <url>")
        lignes.append("    <loc>%s%s</loc>" % (DOMAINE, chemin))
        lignes.append("    <lastmod>%s</lastmod>" % modifie)
        for l2 in LANGUES:
            lignes.append('    <xhtml:link rel="alternate" hreflang="%s" href="%s%s"/>'
                          % (l2, DOMAINE, chemin_page(slug, l2)))
        lignes.append('    <xhtml:link rel="alternate" hreflang="x-default" href="%s%s"/>'
                      % (DOMAINE, chemin_page(slug, "en")))
        lignes.append("  </url>")
    lignes.append("</urlset>")
    with open(os.path.join(PUB, "sitemap.xml"), "w", encoding="utf-8", newline="\n") as f:
        f.write("\n".join(lignes) + "\n")

    with open(os.path.join(PUB, "robots.txt"), "w", encoding="utf-8", newline="\n") as f:
        f.write("User-agent: *\nAllow: /\n\nSitemap: %s/sitemap.xml\n" % DOMAINE)

    with open(os.path.join(PUB, "CNAME"), "w", encoding="utf-8", newline="\n") as f:
        f.write("agalgolab.com\n")

    # llms.txt — le résumé lisible par les assistants conversationnels
    llm = ["# AG Algo Lab — Anthony Gocmen", "",
           "> Anthony Gocmen, founder of AG Algo Lab. Complete web platforms built solo, "
           "from the idea to launch: public site, member areas, payments, automation, SEO, data. "
           "Two products in production. Built with Claude Code. English at the root, French under /fr/.", "",
           "Contact: %s" % COURRIEL, "", "## Pages"]
    for slug, lang, chemin, _, titre, description in urls:
        llm.append("- [%s](%s%s) (%s) : %s" % (titre, DOMAINE, chemin, lang, description))
    with open(os.path.join(PUB, "llms.txt"), "w", encoding="utf-8", newline="\n") as f:
        f.write("\n".join(llm) + "\n")

    # 404
    for fichier in ("404.html",):
        src = os.path.join(SRC, fichier)
        if os.path.exists(src):
            with open(src, encoding="utf-8") as f:
                contenu = resoudre(f.read(), "en", "404")
            with open(os.path.join(PUB, fichier), "w", encoding="utf-8", newline="\n") as f:
                f.write(contenu)

    # redirections : le 4 septembre 2026 l'anglais vivait sous /en/ ; ces adresses
    # ont pu être indexées, elles renvoient vers la racine (noindex, canonique)
    for slug, lang, chemin, _, _, _ in urls:
        if lang != "en":
            continue
        ancien = "/en/" if slug == "index" else "/en/" + slug + "/"
        cible = DOMAINE + chemin
        dossier = os.path.join(PUB, *[m for m in ancien.strip("/").split("/") if m])
        os.makedirs(dossier, exist_ok=True)
        with open(os.path.join(dossier, "index.html"), "w", encoding="utf-8", newline="\n") as f:
            f.write('<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Moved</title>'
                    '<meta name="robots" content="noindex"><link rel="canonical" href="%s">'
                    '<meta http-equiv="refresh" content="0; url=%s"></head>'
                    '<body><p>This page has moved to <a href="%s">%s</a>.</p></body></html>\n'
                    % (cible, cible, cible, cible))

    print("construit : %d pages (%d par langue), sitemap, robots, llms, CNAME, redirections /en/"
          % (len(urls), len(urls) // len(LANGUES)))
    return urls


if __name__ == "__main__":
    construire()
