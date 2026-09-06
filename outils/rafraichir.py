# -*- coding: utf-8 -*-
"""
Rafraîchit les captures des deux plateformes — À LANCER CHAQUE SEMAINE.

    python outils/rafraichir.py            # tout
    python outils/rafraichir.py moliere    # une seule famille (moliere | p600)
    python outils/rafraichir.py --reconvertir   # refabrique les WebP, sans Edge

Les sites évoluent ; le site vitrine doit montrer leur état réel. Chaque page
est photographiée EN ENTIER (ordinateur 1280 px et téléphone 390 px) avec
Edge piloté par son protocole de débogage (`capturer_cdp.py`), puis convertie
en WebP dans `src/assets/img/` :

  <nom>.webp           le haut de la page          → dalles du héros
  <nom>-full-N.webp    la page entière EN TUILES   → vitrines qui déroulent

⚠️ LA LARGEUR N'EST PAS CHOISIE ICI (06/09). Elle vient de `src/affichage.json`,
que `verifier_rendu.py` écrit après avoir mesuré dans Edge la largeur réelle
de chaque image sur la page : largeur affichée × 2 sur ordinateur, × 3 sur
téléphone. Une image stockée plus petite que ça est AGRANDIE par le
navigateur, donc floue — « c'est re devenu flou les images dans les
fenêtres » (Anthony, 06/09) ; stockée beaucoup plus grande, c'est du poids
pour rien. La mise en page décide, la capture suit, et `verifier_rendu.py`
refuse de passer si une image est agrandie.

⚠️ AUCUNE IMAGE STOCKÉE AU-DELÀ DE 4 MÉGAPIXELS (06/09). Une page entière de
1 600 × 12 000 px (19 Mpx, 75 Mo décodés) se téléchargeait bien, mais le
navigateur ne la décode qu'au moment de la peindre : plusieurs secondes
d'écran blanc quand on arrive dessus d'un coup de molette — « les sites ne
sont pas chargés entièrement quand ils défilent » (Anthony). Toute image
plus haute que le plafond est donc découpée en tuiles nom-1, nom-2… que
`construire.py` empile avec la macro {{t:nom|alt}} ; le navigateur ne décode
que les tuiles visibles. `verifier.py` refuse tout fichier au-delà du
plafond, `verifier_rendu.py` le contrôle aussi dans Edge.

Puis `python outils/construire.py` et `python outils/verifier.py`, puis push.
⚠️ Depuis PowerShell, une seule instance d'Edge à la fois (le script est séquentiel).
"""
import glob
import io
import json
import math
import os
import re
import subprocess
import sys

import numpy as np
from PIL import Image
# une page entière à l'échelle 2 dépasse la garde anti-« bombe » de Pillow (195 Mpx pour l'accueil Molière)
Image.MAX_IMAGE_PIXELS = None

sys.stdout.reconfigure(encoding="utf-8")
ICI = os.path.dirname(os.path.abspath(__file__))
RACINE = os.path.dirname(ICI)
IMG = os.path.join(RACINE, "src", "assets", "img")
BRUT = os.path.join(RACINE, "_travail", "captures-sites")
CDP = os.path.join(ICI, "capturer_cdp.py")

MOLIERE = "https://institut-moliere.com"
P600 = "https://prepa600.com"

PLAFOND_PX = 3_600_000   # pixels par fichier stocké (≈ 14 Mo décodés) — verifier.py tolère 4,2 Mpx
MARGE = 1.02             # 2 % de marge sur la largeur mesurée, arrondis à 10 px près

AFFICHAGE = os.path.join(RACINE, "src", "affichage.json")


def besoins():
    """{nom: largeur à stocker}, mesuré dans le navigateur par verifier_rendu.py."""
    if not os.path.exists(AFFICHAGE):
        print("⚠ src/affichage.json absent : largeurs de repli (lancer verifier_rendu.py)")
        return {}
    return {n: v["besoin"] for n, v in json.load(io.open(AFFICHAGE, encoding="utf-8"))["images"].items()}


BESOIN = besoins()


def largeur(nom, defaut):
    """La largeur mesurée pour cette image, à défaut celle écrite ici."""
    b = BESOIN.get(nom)
    if b is None:
        print("  ⚠ %s : pas encore mesurée, largeur de repli %d px" % (nom, defaut))
        return defaut
    return int(math.ceil(b * MARGE / 10) * 10)


def sauver(nom, im, qualite):
    """nom.webp si l'image tient sous le plafond ; sinon nom-1.webp, nom-2.webp…
    (tranches de hauteur égale, la dernière plus courte).

    ⚠️ NE SUPPRIME PLUS la forme précédente (06/09). GitHub Pages sert le HTML
    avec `max-age=600` : pendant dix minutes, un visiteur garde l'ancienne page,
    qui réclame l'ancien nombre de tuiles. Le jour où le compte a changé
    (7 tuiles → 2 pour l'accueil Prépa 600), ces visiteurs ont eu des 404 et
    des vitrines vides — le bug qu'Anthony a revu le 06/09 au soir. Les
    anciennes restent donc en place ; `python outils/verifier.py --nettoyer`
    les retire une fois qu'elles ne servent plus depuis plus d'un jour, c'est-
    à-dire au lot suivant, bien après l'expiration des caches."""
    anciennes = sorted(os.path.basename(c) for c in glob.glob(os.path.join(IMG, nom + "*.webp"))
                       if re.fullmatch(re.escape(nom) + r"(-\d+)?\.webp", os.path.basename(c)))
    if im.width * im.height <= PLAFOND_PX:
        im.save(os.path.join(IMG, nom + ".webp"), quality=qualite, method=6)
        sorties = [nom + ".webp"]
    else:
        n = math.ceil(im.width * im.height / PLAFOND_PX)
        pas = math.ceil(im.height / n)
        sorties = []
        for k in range(n):
            tuile = im.crop((0, k * pas, im.width, min(im.height, (k + 1) * pas)))
            fichier = "%s-%d.webp" % (nom, k + 1)
            tuile.save(os.path.join(IMG, fichier), quality=qualite, method=6)
            sorties.append(fichier)
    survivantes = [f for f in anciennes if f not in sorties]
    if survivantes:
        print("    · %d ancienne(s) tuile(s) laissée(s) en place le temps que les caches expirent : %s"
              % (len(survivantes), ", ".join(survivantes)))
    return sorties

# nom, url, options de capturer_cdp
CAPTURES = {
    "moliere": [
        ("moliere-accueil", MOLIERE + "/", ["--echelle", "2", "--long", "30000", "--attente", "7"]),
        ("moliere-plateforme", MOLIERE + "/la-plateforme", ["--echelle", "2", "--long", "30000", "--attente", "7"]),
        ("moliere-accueil-m", MOLIERE + "/", ["--mobile", "--long", "30000", "--attente", "7"]),
    ],
    "p600": [
        ("p600-accueil", P600 + "/", ["--echelle", "2", "--long", "30000", "--attente", "7"]),
        ("p600-tarifs", P600 + "/tarifs.html", ["--echelle", "2", "--long", "30000", "--attente", "5"]),
        ("p600-accueil-m", P600 + "/", ["--mobile", "--long", "30000", "--attente", "7"]),
    ],
}
# seules ces pages entières servent (les vitrines qui déroulent)…
PLEINES = {"moliere-accueil", "moliere-accueil-m", "p600-accueil", "p600-accueil-m"}
# …et seuls ces hauts de page servent (dalles du héros). Le haut des deux
# captures téléphone n'était affiché nulle part : 113 Ko de fichiers morts (06/09).
HAUTS = {"moliere-accueil", "moliere-plateforme", "p600-accueil", "p600-tarifs"}
# prises à la main sur l'écran d'Anthony (il faut être connecté), recadrées
# en 16:10 ; originaux hors git, dans _travail/
MANUELLES = {
    "eleve-01-tableau-de-bord": "_travail/eleve/01-tableau-de-bord.png",
    "eleve-02-coach": "_travail/eleve/02-coach.png",
    "eleve-03-mes-cours": "_travail/eleve/03-mes-cours.png",
    "eleve-04-calendrier": "_travail/eleve/04-calendrier.png",
    "eleve-05-bibliotheque": "_travail/eleve/05-bibliotheque.png",
    "eleve-06-dictees": "_travail/eleve/06-dictees.png",
    "eleve-07-calcul-mental": "_travail/eleve/07-calcul-mental.png",
    "eleve-08-echecs": "_travail/eleve/08-echecs.png",
    "eleve-09-concours": "_travail/eleve/09-concours.png",
    "eleve-10-progression": "_travail/eleve/10-progression.png",
    "eleve-11-mon-niveau": "_travail/eleve/11-mon-niveau.png",
    "p600-modules": "_travail/p600-modules.png",
}
DEGRAISSER = ["moliere-eleve", "moliere-admin"]
# ⚠️ Ne se rafraîchissent PAS ici (il faut être connecté) : moliere-admin.webp,
# moliere-eleve.webp et les onze eleve-NN-*.webp de l'espace élève. Elles
# viennent de l'écran d'Anthony ; les originaux sont dans _travail/eleve/
# (hors git). Pour les refaire : mêmes pages, fenêtre de 2 000 px de large,
# puis le rognage 16:10 → 1 100 × 688 (voir _PASSATION.md §3).
# les zones : un moment précis d'une page, en une seule image (pas de -full).
# nom, url, options de capture, largeur stockée[, hauteur maximale stockée]
ZONES = [
    # ⚠️ Ces trois-là descendent JUSQU'AU BAS de la page (--long 30000) : dans
    # les vitrines, l'écran déroule l'image, et Anthony veut voir la fin —
    # « ça s'arrête au tout début… ce qui est impressionnant, c'est de voir
    # qu'il y a même le RIB » (05/09). Le départ, lui, est choisi : la première
    # question du test, le haut du formulaire, la première question de la
    # candidature.
    #
    # le test de niveau sur téléphone : l'ACCUEIL du test (« votre niveau en
    # 3 minutes », la photo, les deux langues), pas une question du test
    # commencé — « c'est pas attractif » (Anthony, 05/09 au soir). Les autres
    # pages publiques sur téléphone ont été écartées : elles montrent un
    # drapeau ou nomment le programme local. 560 px pour rester net sur un
    # écran fin (la pièce fait 204 px CSS quand elle est devant).
    ("moliere-test-tel", MOLIERE + "/test-de-niveau", ["--mobile", "--long", "30000", "--attente", "5"], 780),
    # l'inscription sur une TABLETTE : à cette largeur, le formulaire se lit,
    # et on le déroule en entier — jusqu'à la preuve de règlement.
    ("moliere-inscription-tab", MOLIERE + "/inscription-cours",
     ["--largeur", "820", "--hauteur", "1180", "--echelle", "2", "--tactile", "--clic", "première fois",
      # les coordonnées bancaires de l'institut n'ont rien à faire sur un site
      # vitrine : on les floute AVANT la photo, par leur texte (un rectangle
      # vieillirait à la première mise à jour de la page).
      "--masquer", "Titulaire", "--masquer", "Banque :", "--masquer", "RIB :", "--masquer", "IBAN",
      "--long", "30000", "--attente", "5"], 1500),
    # la candidature de « Enseigner », avec des réponses cochées : c'est l'état
    # sélectionné qu'Anthony veut montrer, pas le formulaire vide.
    ("moliere-enseigner", MOLIERE + "/enseigner",
     ["--largeur", "1280", "--hauteur", "1000", "--echelle", "2", "--clic", "Professeur en fonction", "--clic", "Français",
      "--clic", "Anglais", "--clic", "Des enfants et des adolescents",
      "--long", "30000", "--attente", "5"], 1600),  # depuis le HAUT de la page (06/09 : « on ne voit pas le haut »)
    # les six écrans du récit Prépa 600. Chacun ILLUSTRE son étape (07/09 :
    # « on ne sait pas du tout pourquoi ça arrive sur calcul ton score ») :
    # l'idée → l'accueil, la méthode à lire → methode, les six sous-tests →
    # reviser, le prix → tarifs, ce que le premier utilisateur découvre →
    # simulateur, les pages que les assistants citent → score-ecoles.
    # Le dernier champ demande le cadrage MESURÉ : le haut d'une page n'est
    # qu'un titre et du texte. Le test lui-même et le rapport ne sont pas
    # capturables : sans compte, ils renvoient l'écran de connexion.
    ("p600-accueil-tel", P600 + "/", ["--mobile", "--long", "4000", "--attente", "6"], 660, 1540),
    ("p600-methode-tel", P600 + "/methode.html", ["--mobile", "--long", "9000", "--attente", "5"], 660, 1540, True),
    ("p600-reviser-tel", P600 + "/reviser.html", ["--mobile", "--long", "9000", "--attente", "5"], 660, 1540, True),
    ("p600-tarifs-tel", P600 + "/tarifs.html", ["--mobile", "--long", "4000", "--attente", "5"], 660, 1540),
    ("p600-simulateur-tel", P600 + "/simulateur.html", ["--mobile", "--long", "9000", "--attente", "5"], 660, 1540, True),
    ("p600-score-ecoles-tel", P600 + "/score-ecoles.html", ["--mobile", "--long", "9000", "--attente", "5"], 660, 1540, True),
]


def capturer(nom, url, options):
    sortie = os.path.join(BRUT, nom + ".png")
    r = subprocess.run([sys.executable, CDP, url, sortie] + options, capture_output=True, text=True, encoding="utf-8", errors="replace")
    ok = os.path.exists(sortie) and os.path.getsize(sortie) > 0
    print(("  ok    " if ok else "  ÉCHEC ") + nom + "  " + (r.stdout.strip().splitlines()[-1] if r.stdout.strip() else r.stderr.strip()[-200:]))
    return ok


def reperes_blocs(nom):
    """Les débuts de blocs relevés dans le navigateur à la capture."""
    chemin = os.path.join(BRUT, nom + ".png.blocs.json")
    if not os.path.exists(chemin):
        return [], 0
    try:
        d = json.load(io.open(chemin, encoding="utf-8"))
    except Exception:
        return [], 0
    if isinstance(d, dict):
        return d.get("blocs", []), int(d.get("pied") or 0)
    return d, 0


def fenetre_visuelle(im, ratio, reperes=(), pied=0):
    """Où cadrer un écran de téléphone : pas en haut de la page, c'est là qu'il
    n'y a que du titre et du texte (Anthony, 07/09 : « baisse dans la page pour
    prendre les écrans un peu attractifs, où il y a de la couleur »). On fait
    glisser la fenêtre sur toute la capture et on garde celle qui a le plus de
    COULEUR et de DÉTAIL — saturation moyenne et densité de contours. Le
    rafraîchissement hebdomadaire le refait donc tout seul, même si les pages
    changent."""
    hauteur = int(im.width * ratio)
    if im.height <= hauteur * 1.05:
        return 0
    n = 400
    petite = im.resize((160, n), Image.LANCZOS)
    a = np.asarray(petite.convert("RGB"), dtype=float) / 255.0
    sat = (a.max(axis=2) - a.min(axis=2)).mean(axis=1)
    g = np.asarray(petite.convert("L"), dtype=float)
    bords = (np.abs(np.diff(g, axis=0, prepend=g[:1])) + np.abs(np.diff(g, axis=1, prepend=g[:, :1]))).mean(axis=1) / 255.0
    note = 0.65 * sat / max(sat.max(), 1e-6) + 0.35 * bords / max(bords.max(), 1e-6)
    pas = n / float(im.height)
    large = max(1, int(hauteur * pas))
    cumul = np.concatenate([[0], np.cumsum(note)])
    meilleur, note_max = 0, -1.0
    for i in range(int(im.height * 0.05 * pas), n - large):
        m = (cumul[i + large] - cumul[i]) / large
        if m > note_max:
            note_max, meilleur = m, i
    y = int(meilleur / pas)
    # puis on cale le haut sur un DÉBUT DE BLOC relevé dans le navigateur.
    # Sans ça, la fenêtre coupe une carte en deux et l'écran a l'air cassé
    # (07/09 : « les visuels, je ne les trouve pas tops »). Le fond des pages
    # est en dégradé : chercher une ligne unie ne donnait rien.
    # la fenêtre doit finir AVANT le pied de page : un écran de vitrine qui
    # se termine sur le pied a l'air vide (07/09)
    plafond = im.height - hauteur
    if pied and pied - hauteur > im.height * 0.05:
        plafond = min(plafond, pied - hauteur)
    possibles = [int(v) for v in reperes if 0 <= v <= plafond]
    if possibles:
        # parmi les débuts de bloc, celui dont la fenêtre est la mieux notée
        def note_de(v):
            i = int(v * pas)
            return (cumul[min(n, i + large)] - cumul[i]) / large
        return max(possibles, key=note_de)
    return y


def reduire(im, large, haut_max=None):
    petite = im.resize((large, round(im.height * large / im.width)), Image.LANCZOS)
    if haut_max:
        petite = petite.crop((0, 0, large, min(petite.height, haut_max)))
    return petite


def convertir(nom, mobile):
    src = os.path.join(BRUT, nom + ".png")
    if not os.path.exists(src):
        return
    im = Image.open(src).convert("RGB")
    # le haut de page garde la même part de la page qu'avant : une dalle de
    # héros fait 1,5625 fois sa largeur sur ordinateur, 4,364 fois sur téléphone
    part, q = (4.3641, 78) if mobile else (1.5625, 70)
    sorties = []
    if nom in HAUTS:
        large = largeur(nom, 390 if mobile else 1440)
        sorties += sauver(nom, reduire(im, large, round(large * part)), 80)
    if nom in PLEINES:
        large = largeur(nom + "-full", 360 if mobile else 1600)
        sorties += sauver(nom + "-full", reduire(im, large), q)
    poids = sum(os.path.getsize(os.path.join(IMG, f)) for f in sorties) // 1024
    print("  → %s : %d fichier(s), %d Ko" % (nom, len(sorties), poids))


def convertir_zone(nom, large_defaut, haut_max=None, auto=False):
    """`haut_max` est donné pour `large_defaut` : il suit la largeur retenue.
    `auto` : le cadrage part de la fenêtre la plus regardable, pas du haut."""
    src = os.path.join(BRUT, nom + ".png")
    if not os.path.exists(src):
        return
    im = Image.open(src).convert("RGB")
    large = largeur(nom, large_defaut)
    haut = round(haut_max * large / large_defaut) if haut_max else None
    if auto and haut:
        blocs, pied = reperes_blocs(nom)
        y = fenetre_visuelle(im, haut / float(large), blocs, pied)
        if y:
            print("    · cadré à %d px (%.0f %% de la page), pas en haut" % (y, 100.0 * y / im.height))
        im = im.crop((0, y, im.width, im.height))
    petite = reduire(im, large, haut)
    sorties = sauver(nom, petite, 80)
    poids = sum(os.path.getsize(os.path.join(IMG, f)) for f in sorties) // 1024
    print("  → %s : %s, %d fichier(s), %d Ko" % (nom, petite.size, len(sorties), poids))


def zone(nom, url, options, large=390, haut_max=None, auto=False):
    if capturer(nom, url, options):
        convertir_zone(nom, large, haut_max, auto)


def manuelles():
    """Les captures prises à la main sur l'écran d'Anthony (espace élève,
    modules Prépa 600) : originaux dans _travail/, hors git. Recadrées en
    16:10, à la largeur mesurée. Absents = on ne touche à rien."""
    for nom, chemin in MANUELLES.items():
        src = os.path.join(RACINE, chemin)
        if not os.path.exists(src):
            print("  · %s : original absent (%s), inchangé" % (nom, chemin))
            continue
        im = Image.open(src).convert("RGB")
        im = im.crop((0, 0, im.width, min(im.height, round(im.width * 0.625))))
        large = largeur(nom, 900)
        sorties = sauver(nom, reduire(im, large), 80)
        print("  → %s : %s, %d Ko" % (nom, (large, round(large * 0.625)),
                                      sum(os.path.getsize(os.path.join(IMG, f)) for f in sorties) // 1024))


def degraisser():
    """Deux images dont l'original s'est perdu : on réduit le WebP en place
    quand il dépasse d'un quart la largeur mesurée (réduire ne crée pas
    d'artefact, il en efface)."""
    for nom in DEGRAISSER:
        chemin = os.path.join(IMG, nom + ".webp")
        if not os.path.exists(chemin) or nom not in BESOIN:
            continue
        im = Image.open(chemin).convert("RGB")
        large = largeur(nom, im.width)
        if im.width <= large * 1.25:
            continue
        avant = os.path.getsize(chemin) // 1024
        reduire(im, large).save(chemin, quality=82, method=6)
        print("  → %s : %d → %d px, %d → %d Ko" % (nom, im.width, large, avant, os.path.getsize(chemin) // 1024))


def reconvertir():
    """Refabrique les WebP depuis les PNG déjà capturés, sans ouvrir Edge."""
    for fam in CAPTURES:
        for nom, _, options in CAPTURES[fam]:
            convertir(nom, "--mobile" in options)
    for z in ZONES:
        convertir_zone(z[0], z[3], z[4] if len(z) > 4 else None, z[5] if len(z) > 5 else False)
    print("== prises à la main")
    manuelles()
    degraisser()


def main():
    os.makedirs(BRUT, exist_ok=True)
    if "--reconvertir" in sys.argv:
        reconvertir()
        return
    familles = [a for a in sys.argv[1:] if a in CAPTURES] or list(CAPTURES)
    for fam in familles:
        print("== " + fam)
        for nom, url, options in CAPTURES[fam]:
            if capturer(nom, url, options):
                convertir(nom, "--mobile" in options)
    if not sys.argv[1:] or "zones" in sys.argv[1:]:
        print("== zones du héros")
        for z in ZONES:
            zone(*z)
        print("== prises à la main")
        manuelles()
        degraisser()
    print("Fini. Relancer : python outils/construire.py && python outils/verifier.py"
          " && python outils/verifier_rendu.py")


if __name__ == "__main__":
    main()
