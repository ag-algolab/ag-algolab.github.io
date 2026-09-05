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


def ecrans_moliere():
    """Les page.tsx de src/app, hors pages de travail (demo-*) : elles ne sont
    reliées nulle part et portent robots noindex — ce ne sont pas des écrans."""
    app = os.path.join(MOLIERE, "src", "app")
    tous = glob.glob(os.path.join(app, "**", "page.tsx"), recursive=True)
    rel = [os.path.relpath(p, app).replace(os.sep, "/") for p in tous]
    return [r for r in rel if not any(m.startswith("demo-") for m in r.split("/"))]


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
    if "moliere.commits" in m and "p600.commits" in m:
        m["total.commits"] = m["moliere.commits"] + m["p600.commits"]
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
    faits.setdefault("total", {}).setdefault("releve", {"source": "date du dernier recomptage", "releve": aujourd})
    faits["total"]["releve"]["valeur"] = aujourd
    faits["total"]["releve"]["releve"] = aujourd
    if ecrire:
        io.open(FAITS, "w", encoding="utf-8", newline="\n").write(
            json.dumps(faits, ensure_ascii=False, indent=2) + "\n")
    print("%d chiffre(s) mis à jour%s" % (change, "" if ecrire else " (rien écrit : --lire)"))


if __name__ == "__main__":
    main()
