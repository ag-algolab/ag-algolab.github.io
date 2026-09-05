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

  <nom>.webp           ordinateur, 1 440 px de large, le haut de la page (2 250 px) → dalles du héros
  <nom>-full-N.webp    ordinateur, 1 600 px de large, la page entière EN TUILES     → vitrines qui déroulent
  <nom>-m.webp         téléphone, 390 px de large, le haut (1 702 px)
  <nom>-m-full-N.webp  téléphone, 360 px de large, la page entière en tuiles

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
import math
import os
import re
import subprocess
import sys

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


def sauver(nom, im, qualite):
    """nom.webp si l'image tient sous le plafond ; sinon nom-1.webp, nom-2.webp…
    (tranches de hauteur égale, la dernière plus courte). Efface la forme
    précédente : un nom n'existe que sous une seule forme."""
    for chemin in glob.glob(os.path.join(IMG, nom + "*.webp")):
        if re.fullmatch(re.escape(nom) + r"(-\d+)?\.webp", os.path.basename(chemin)):
            os.remove(chemin)
    if im.width * im.height <= PLAFOND_PX:
        im.save(os.path.join(IMG, nom + ".webp"), quality=qualite, method=6)
        return [nom + ".webp"]
    n = math.ceil(im.width * im.height / PLAFOND_PX)
    pas = math.ceil(im.height / n)
    sorties = []
    for k in range(n):
        tuile = im.crop((0, k * pas, im.width, min(im.height, (k + 1) * pas)))
        fichier = "%s-%d.webp" % (nom, k + 1)
        tuile.save(os.path.join(IMG, fichier), quality=qualite, method=6)
        sorties.append(fichier)
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
# seules ces pages entières servent (les vitrines qui déroulent) ; les autres
# captures ne gardent que leur haut de page (dalles du héros)
PLEINES = {"moliere-accueil", "moliere-accueil-m", "p600-accueil", "p600-accueil-m"}
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
    # les six écrans du récit Prépa 600 (06/09) : le haut de six pages, en
    # 600 px pour rester net dans un téléphone de 300 px CSS, rognés à 1 400 px
    # de haut (l'écran ne déroule pas : au-delà, c'est du décodage pour rien)
    ("p600-accueil-tel", P600 + "/", ["--mobile", "--long", "4000", "--attente", "6"], 600, 1400),
    ("p600-methode-tel", P600 + "/methode.html", ["--mobile", "--long", "4000", "--attente", "5"], 600, 1400),
    ("p600-diagnostic-tel", P600 + "/diagnostic.html", ["--mobile", "--long", "4000", "--attente", "5"], 600, 1400),
    ("p600-tarifs-tel", P600 + "/tarifs.html", ["--mobile", "--long", "4000", "--attente", "5"], 600, 1400),
    ("p600-calcul-tel", P600 + "/calcul-score.html", ["--mobile", "--long", "4000", "--attente", "5"], 600, 1400),
    ("p600-questions-tel", P600 + "/questions-tage-mage.html", ["--mobile", "--long", "4000", "--attente", "5"], 600, 1400),
]


def capturer(nom, url, options):
    sortie = os.path.join(BRUT, nom + ".png")
    r = subprocess.run([sys.executable, CDP, url, sortie] + options, capture_output=True, text=True, encoding="utf-8", errors="replace")
    ok = os.path.exists(sortie) and os.path.getsize(sortie) > 0
    print(("  ok    " if ok else "  ÉCHEC ") + nom + "  " + (r.stdout.strip().splitlines()[-1] if r.stdout.strip() else r.stderr.strip()[-200:]))
    return ok


def convertir(nom, mobile):
    src = os.path.join(BRUT, nom + ".png")
    if not os.path.exists(src):
        return
    im = Image.open(src).convert("RGB")
    if mobile:
        haut = im.resize((390, round(im.height * 390 / im.width)), Image.LANCZOS)
        haut = haut.crop((0, 0, 390, min(haut.height, 1702)))
        pleine, q = (360, round(im.height * 360 / im.width)), 78
    else:
        # ⚠️ Les écrans d'ordinateur sont photographiés à --echelle 2 (2 560 px
        # pour 1 280 CSS) et stockés en 1 600 px : un écran à 1,5× (portable
        # Windows) affiche l'ordinateur de la page de cas sur ~1 560 px
        # physiques, et 1 100 étaient agrandis, donc flous — « partout sur le
        # site quand il s'agit de fenêtre ordi » (Anthony, 06/09).
        haut = im.resize((1440, round(im.height * 1440 / im.width)), Image.LANCZOS)
        haut = haut.crop((0, 0, 1440, min(haut.height, 2250)))
        pleine, q = (1600, round(im.height * 1600 / im.width)), 70
    sorties = sauver(nom, haut, 80)
    if nom in PLEINES:
        full = im.resize(pleine, Image.LANCZOS)
        sorties += sauver(nom + "-full", full, q)
    poids = sum(os.path.getsize(os.path.join(IMG, f)) for f in sorties) // 1024
    print("  → %s : %d fichier(s), %d Ko" % (nom, len(sorties), poids))


def convertir_zone(nom, largeur, haut_max=None):
    src = os.path.join(BRUT, nom + ".png")
    if not os.path.exists(src):
        return
    im = Image.open(src).convert("RGB")
    im = im.resize((largeur, round(im.height * largeur / im.width)), Image.LANCZOS)
    if haut_max:
        im = im.crop((0, 0, largeur, min(im.height, haut_max)))
    sorties = sauver(nom, im, 80)
    poids = sum(os.path.getsize(os.path.join(IMG, f)) for f in sorties) // 1024
    print("  → %s : %s, %d fichier(s), %d Ko" % (nom, im.size, len(sorties), poids))


def zone(nom, url, options, largeur=390, haut_max=None):
    if capturer(nom, url, options):
        convertir_zone(nom, largeur, haut_max)


def reconvertir():
    """Refabrique les WebP depuis les PNG déjà capturés, sans ouvrir Edge."""
    for fam in CAPTURES:
        for nom, _, options in CAPTURES[fam]:
            convertir(nom, "--mobile" in options)
    for z in ZONES:
        convertir_zone(z[0], z[3], z[4] if len(z) > 4 else None)


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
    print("Fini. Relancer : python outils/construire.py && python outils/verifier.py")


if __name__ == "__main__":
    main()
