# -*- coding: utf-8 -*-
"""
Recompte dans les dépôts tous les chiffres qui se recomptent, et met
`src/faits.json` à jour (valeur + date du relevé).

    python outils/recompter.py            # recompte, écrit, affiche les écarts
    python outils/recompter.py --lire     # affiche seulement, n'écrit rien

À lancer AVANT `construire.py` : les deux plateformes bougent tous les jours
(la banque de Prépa 600 grossit plusieurs fois par jour), et `verifier.py`
refuse la mise en ligne dès qu'un chiffre affiché ne correspond plus au
dépôt. Ce qui ne se recompte pas d'ici (dates, prix, décisions) reste écrit
à la main dans faits.json.
"""
import collections
import datetime
import glob
import io
import json
import os
import re
import subprocess
import sys

sys.stdout.reconfigure(encoding="utf-8")
ICI = os.path.dirname(os.path.abspath(__file__))
RACINE = os.path.dirname(ICI)
PROJETS = os.path.dirname(RACINE)
FAITS = os.path.join(RACINE, "src", "faits.json")
MOLIERE = os.path.join(PROJETS, "moliere-plateforme")
P600 = os.path.join(PROJETS, "tagemage")


def lignes(chemin):
    with io.open(chemin, encoding="utf-8", errors="replace") as f:
        return sum(1 for _ in f)


def commits(depot):
    r = subprocess.run(["git", "-C", depot, "rev-list", "--count", "HEAD"],
                       capture_output=True, text=True, timeout=30)
    return int(r.stdout.strip())


def date_git(depot, premier=False):
    """Date (AAAA-MM-JJ) du premier ou du dernier commit."""
    args = ["git", "-C", depot, "log", "--format=%cs"] + (["--reverse"] if premier else ["-1"])
    r = subprocess.run(args, capture_output=True, text=True, timeout=30)
    l = r.stdout.strip().splitlines()
    return l[0] if l else None


def lire(chemin):
    with io.open(chemin, encoding="utf-8", errors="replace") as f:
        return f.read()


def constante(texte, motif):
    """Le premier groupe d'un motif, en entier — None si le motif ne prend
    plus (le code a changé de forme) : la valeur de faits.json est alors
    gardée et signalée, jamais inventée."""
    m = re.search(motif, texte)
    return int(m.group(1)) if m else None


def jours_entre(iso_a, iso_b):
    return (datetime.date.fromisoformat(iso_b) - datetime.date.fromisoformat(iso_a)).days


# la source de chaque mesure, écrite dans faits.json à côté de la valeur
SOURCES = {
    "moliere.premier_commit": "git log --reverse --format=%cs",
    "moliere.jours": "du premier au dernier commit du dépôt, bornes comprises (git log --format=%cs)",
    "moliere.jours_en_ligne": "jours entre moliere.premier_commit et moliere.en_ligne",
    "moliere.jours_rdv_ligne": "jours entre moliere.rendez_vous et moliere.en_ligne",
    "moliere.crons": "vercel.json : chemins distincts dans crons",
    "total.passages_jour": "somme des passages quotidiens de tous les crons des deux plateformes (vercel.json)",
    "total.jours_service": "jours écoulés depuis la mise en ligne du premier des deux produits",
    "moliere.dictees_par_jour": "vercel.json : entrées crons dont le chemin finit par banque-dictees",
    "moliere.cron_rappel_min": "vercel.json : schedule */N du cron rappel-cours",
    "moliere.rappel_fenetre_min": "src/app/api/cron/rappel-cours/route.ts : const FENETRE_MINUTES",
    "moliere.silence_jours": "src/app/api/cron/coach/route.ts : const SEUIL_ABSENCE",
    "moliere.essai_jours": "src/lib/tarifs.ts : « N jours d'essai »",
    "moliere.centres": "src/lib/institut.ts : chaînes du tableau CENTRES",
    "moliere.automatismes": "les nœuds du réacteur de src/pages/institut-moliere.html (class=\"noeud\") — le texte suit le schéma",
    "p600.premier_commit": "git log --reverse --format=%cs",
    "p600.prix": "public/tarifs.html : « N € TTC, une fois, M mois d'accès »",
    "p600.mois": "public/tarifs.html : « N € TTC, une fois, M mois d'accès »",
    "p600.prix_boursier": "public/index.html : « Boursiers : N € »",
    "site.contraste_min": "le plus faible contraste des paires texte/fond de verifier.py (PAIRES), sur les jetons de style.css",
}


def ecrans_moliere():
    """Les page.tsx de src/app, hors pages de travail (demo-*) : elles ne sont
    reliées nulle part et portent robots noindex — ce ne sont pas des écrans."""
    app = os.path.join(MOLIERE, "src", "app")
    tous = glob.glob(os.path.join(app, "**", "page.tsx"), recursive=True)
    rel = [os.path.relpath(p, app).replace(os.sep, "/") for p in tous]
    return [r for r in rel if not any(m.startswith("demo-") for m in r.split("/"))]


def passages_par_jour(schedule):
    """Combien de fois par jour un cron passe. On ne gère que ce que Vercel
    accepte ici : « */N m h j M » et « m h * * * »."""
    champs = schedule.split()
    if len(champs) != 5:
        return 0
    minute, heure = champs[0], champs[1]
    par_heure = 60 // int(minute[2:]) if minute.startswith("*/") else (1 if minute.isdigit() else 60)
    heures = 24 if heure == "*" else (24 // int(heure[2:]) if heure.startswith("*/") else 1)
    return par_heure * heures


def faits_date(chemin):
    """Une date déjà relevée dans faits.json (les dates passées ne bougent plus)."""
    fam, cle = chemin.split(".")
    try:
        return json.load(io.open(FAITS, encoding="utf-8"))[fam][cle]["valeur"]
    except Exception:
        return None


def mesurer():
    m = {}
    if os.path.isdir(MOLIERE):
        app = os.path.join(MOLIERE, "src", "app")
        rel = ecrans_moliere()
        m["moliere.ecrans"] = len(rel)
        m["moliere.ecrans_site"] = sum(1 for r in rel if r.startswith("(site)"))
        m["moliere.ecrans_eleve"] = sum(1 for r in rel if r.startswith("eleve"))
        m["moliere.ecrans_prof"] = sum(1 for r in rel if r.startswith("prof"))
        m["moliere.ecrans_admin"] = sum(1 for r in rel if r.startswith("admin"))
        m["moliere.ecrans_communs"] = sum(1 for r in rel if not r.startswith(("(site)", "eleve", "prof", "admin")))
        m["moliere.routes_api"] = len(glob.glob(os.path.join(app, "api", "**", "route.ts"), recursive=True))
        db = os.path.join(MOLIERE, "db")
        m["moliere.migrations"] = len([n for n in os.listdir(db) if re.match(r"\d\d_.*\.sql$", n)])
        tables = set()
        for n in sorted(os.listdir(db)):
            if not n.endswith(".sql"):
                continue
            with io.open(os.path.join(db, n), encoding="utf-8", errors="replace") as f:
                for t in re.findall(r"create\s+table\s+(?:if\s+not\s+exists\s+)?(?:public\.)?([a-z_0-9]+)", f.read(), re.I):
                    tables.add(t.lower())
        m["moliere.tables"] = len(tables)
        src = os.path.join(MOLIERE, "src")
        m["moliere.lignes_ts"] = sum(lignes(p) for p in
                                     glob.glob(os.path.join(src, "**", "*.ts"), recursive=True) +
                                     glob.glob(os.path.join(src, "**", "*.tsx"), recursive=True))
        m["moliere.commits"] = commits(MOLIERE)
        premier = date_git(MOLIERE, premier=True)
        dernier = date_git(MOLIERE)
        if premier and dernier:
            m["moliere.premier_commit"] = premier
            m["moliere.jours"] = jours_entre(premier, dernier) + 1
        faits = json.load(io.open(FAITS, encoding="utf-8"))
        en_ligne = faits["moliere"]["en_ligne"]["valeur"]
        rdv = faits["moliere"].get("rendez_vous", {}).get("valeur")
        if premier:
            m["moliere.jours_en_ligne"] = jours_entre(premier, en_ligne)
        if rdv:
            m["moliere.jours_rdv_ligne"] = jours_entre(rdv, en_ligne)
        # les automatismes : ce que vercel.json et les constantes du code disent
        crons = json.load(io.open(os.path.join(MOLIERE, "vercel.json"), encoding="utf-8"))["crons"]
        m["moliere.crons"] = len(set(c["path"] for c in crons))
        m["moliere.dictees_par_jour"] = sum(1 for c in crons if c["path"].endswith("banque-dictees"))
        rappel = [c["schedule"] for c in crons if c["path"].endswith("rappel-cours")]
        if rappel and re.match(r"\*/(\d+) ", rappel[0]):
            m["moliere.cron_rappel_min"] = int(re.match(r"\*/(\d+) ", rappel[0]).group(1))
        for cle, fichier, motif in (
                ("moliere.rappel_fenetre_min", "src/app/api/cron/rappel-cours/route.ts", r"const FENETRE_MINUTES = (\d+)"),
                ("moliere.silence_jours", "src/app/api/cron/coach/route.ts", r"const SEUIL_ABSENCE = (\d+)"),
                ("moliere.essai_jours", "src/lib/tarifs.ts", r"(\d+) jours d'essai")):
            v = constante(lire(os.path.join(MOLIERE, fichier)), motif)
            if v is None:
                print("  ⚠ %s : motif introuvable dans %s, valeur gardée" % (cle, fichier))
            else:
                m[cle] = v
        inst = lire(os.path.join(MOLIERE, "src", "lib", "institut.ts"))
        bloc = re.search(r"export const CENTRES = \[(.*?)\]", inst, re.S)
        if bloc:
            m["moliere.centres"] = len(re.findall(r'"[^"]+"', bloc.group(1)))
        page = lire(os.path.join(RACINE, "src", "pages", "institut-moliere.html"))
        m["moliere.automatismes"] = page.count('class="noeud"')
    if os.path.isdir(P600):
        m["p600.pages"] = len(glob.glob(os.path.join(P600, "public", "*.html")))
        m["p600.endpoints"] = len([n for n in os.listdir(os.path.join(P600, "api"))
                                   if n.endswith(".js") and not n.startswith("_")])
        with io.open(os.path.join(P600, "donnees", "items.json"), encoding="utf-8") as f:
            items = json.load(f)["items"]
        par_blanc = collections.Counter(x["test"] for x in items)
        complets = [t for t, n in par_blanc.items() if n >= 90]
        m["p600.questions"] = sum(par_blanc[t] for t in complets)
        m["p600.blancs"] = len(complets)
        m["p600.blancs_payants"] = len(complets) - 1
        m["p600.sous_tests"] = len(set((x["test"], x["sous_test"]) for x in items if x["test"] in complets))
        m["p600.commits"] = commits(P600)
        premier = date_git(P600, premier=True)
        if premier:
            m["p600.premier_commit"] = premier
        tarifs = lire(os.path.join(P600, "public", "tarifs.html"))
        mt = re.search(r"(\d+) € TTC, une fois, (\d+) mois", tarifs)
        if mt:
            m["p600.prix"], m["p600.mois"] = int(mt.group(1)), int(mt.group(2))
        else:
            print("  ⚠ p600.prix / p600.mois : motif introuvable dans tarifs.html, valeurs gardées")
        accueil = lire(os.path.join(P600, "public", "index.html"))
        mb = re.search(r"Boursiers(?:&nbsp;|\s)*: (?:&nbsp;|\s)*(\d+)", accueil)
        if mb:
            m["p600.prix_boursier"] = int(mb.group(1))
        else:
            print("  ⚠ p600.prix_boursier : motif introuvable dans index.html, valeur gardée")
    # le site lui-même : le contraste le plus faible de sa DA, celui que la
    # méthode affiche (« mesuré, jamais jugé à l'œil »)
    sys.path.insert(0, ICI)
    import verifier
    css = lire(os.path.join(RACINE, "src", "assets", "style.css"))
    jetons = dict(re.findall(r"--([a-z0-9-]+):\s*(#[0-9A-Fa-f]{6})", css))
    ratios = [verifier.contraste(jetons[t], jetons[f]) for t, f, _, _ in verifier.PAIRES if t in jetons and f in jetons]
    if ratios:
        m["site.contraste_min"] = round(min(ratios), 1)
    if "moliere.commits" in m and "p600.commits" in m:
        m["total.commits"] = m["moliere.commits"] + m["p600.commits"]
    # ce que les machines font sans personne devant : on additionne les
    # passages quotidiens de tous les crons des deux plateformes (*/5 → 288
    # fois par jour, 0 16 → une fois). C'est un compte de PASSAGES, pas
    # d'actions utiles : un passage qui ne trouve rien à faire compte aussi.
    passages = 0
    for depot in (MOLIERE, P600):
        chemin = os.path.join(depot, "vercel.json")
        if not os.path.exists(chemin):
            continue
        for c in json.load(io.open(chemin, encoding="utf-8")).get("crons", []):
            passages += passages_par_jour(c["schedule"])
    if passages:
        m["total.passages_jour"] = passages
    # depuis combien de jours les produits servent : du premier mis en ligne
    # à aujourd'hui
    debuts = [d for d in (faits_date("moliere.en_ligne"), faits_date("p600.ouverture")) if d]
    if debuts:
        m["total.jours_service"] = jours_entre(min(debuts), datetime.date.today().isoformat())
    return m


def main():
    ecrire = "--lire" not in sys.argv
    faits = json.load(io.open(FAITS, encoding="utf-8"))
    aujourd = datetime.date.today().isoformat()
    change = 0
    for chemin, valeur in sorted(mesurer().items()):
        fam, cle = chemin.split(".")
        n = faits.setdefault(fam, {}).setdefault(cle, {"valeur": None, "source": "", "releve": aujourd})
        if n["valeur"] != valeur:
            print("  %-24s %s → %s" % (chemin, n["valeur"], valeur))
            change += 1
        n["valeur"] = valeur
        n["releve"] = aujourd
        if chemin in SOURCES:
            n["source"] = SOURCES[chemin]
    faits.setdefault("total", {}).setdefault("releve", {"source": "date du dernier recomptage", "releve": aujourd})
    faits["total"]["releve"]["valeur"] = aujourd
    faits["total"]["releve"]["releve"] = aujourd
    if ecrire:
        io.open(FAITS, "w", encoding="utf-8", newline="\n").write(
            json.dumps(faits, ensure_ascii=False, indent=2) + "\n")
    print("%d chiffre(s) mis à jour%s" % (change, "" if ecrire else " (rien écrit : --lire)"))


if __name__ == "__main__":
    main()
