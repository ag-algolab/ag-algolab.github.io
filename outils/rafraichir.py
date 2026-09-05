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

  <nom>.webp         ordinateur, 960 px de large, le haut de la page (1500 px)  → héros
  <nom>-full.webp    ordinateur, 1100 px de large, la page entière            → vitrines qui déroulent
  <nom>-m.webp       téléphone, 390 px de large, le haut (1702 px)
  <nom>-m-full.webp  téléphone, 360 px de large, la page entière

Puis `python outils/construire.py` et `python outils/verifier.py`, puis push.
⚠️ Depuis PowerShell, une seule instance d'Edge à la fois (le script est séquentiel).
"""
import os
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

# nom, url, options de capturer_cdp
CAPTURES = {
    "moliere": [
        ("moliere-accueil", MOLIERE + "/", ["--echelle", "2", "--long", "30000", "--attente", "7"]),
        ("moliere-plateforme", MOLIERE + "/la-plateforme", ["--echelle", "2", "--long", "30000", "--attente", "7"]),
        ("moliere-test", MOLIERE + "/test-de-niveau", ["--echelle", "2", "--long", "30000", "--attente", "5"]),
        ("moliere-inscription", MOLIERE + "/inscription-cours", ["--echelle", "2", "--long", "30000", "--attente", "5", "--clic", "première fois"]),
        ("moliere-accueil-m", MOLIERE + "/", ["--mobile", "--long", "30000", "--attente", "7"]),
        ("moliere-test-m", MOLIERE + "/test-de-niveau", ["--mobile", "--long", "30000", "--attente", "5"]),
        ("moliere-inscription-m", MOLIERE + "/inscription-cours", ["--mobile", "--long", "30000", "--attente", "5", "--clic", "première fois"]),
        ("moliere-plateforme-m", MOLIERE + "/la-plateforme", ["--mobile", "--long", "30000", "--attente", "7"]),
    ],
    "p600": [
        ("p600-accueil", P600 + "/", ["--echelle", "2", "--long", "30000", "--attente", "7"]),
        ("p600-test", P600 + "/le-test.html", ["--echelle", "2", "--long", "30000", "--attente", "5"]),
        ("p600-simulateur", P600 + "/simulateur.html", ["--echelle", "2", "--long", "30000", "--attente", "5"]),
        ("p600-tarifs", P600 + "/tarifs.html", ["--echelle", "2", "--long", "30000", "--attente", "5"]),
        ("p600-accueil-m", P600 + "/", ["--mobile", "--long", "30000", "--attente", "7"]),
        ("p600-test-m", P600 + "/le-test.html", ["--mobile", "--long", "30000", "--attente", "5"]),
        ("p600-tarifs-m", P600 + "/tarifs.html", ["--mobile", "--long", "30000", "--attente", "5"]),
        ("p600-simulateur-m", P600 + "/simulateur.html", ["--mobile", "--long", "30000", "--attente", "5"]),
    ],
}
# ⚠️ Ne se rafraîchissent PAS ici (il faut être connecté) : moliere-admin.webp,
# moliere-eleve.webp et les onze eleve-NN-*.webp de l'espace élève. Elles
# viennent de l'écran d'Anthony ; les originaux sont dans _travail/eleve/
# (hors git). Pour les refaire : mêmes pages, fenêtre de 2 000 px de large,
# puis le rognage 16:10 → 1 100 × 688 (voir _PASSATION.md §3).
# les zones : un moment précis d'une page, en une seule image (pas de -full).
# nom, url, options de capture, largeur stockée
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
    ("p600-fuites-m", P600 + "/", ["--mobile", "--depuis", "FUITE 01", "--decalage", "-90", "--long", "1140", "--attente", "7"], 390),
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
        haut.crop((0, 0, 390, min(haut.height, 1702))).save(os.path.join(IMG, nom + ".webp"), quality=82, method=6)
        full = im.resize((360, round(im.height * 360 / im.width)), Image.LANCZOS)
        full = full.crop((0, 0, 360, min(full.height, 16000)))
        full.save(os.path.join(IMG, nom + "-full.webp"), quality=78, method=6)
    else:
        # ⚠️ Les écrans d'ordinateur sont photographiés à --echelle 2 (2 560 px
        # pour 1 280 CSS) et stockés en 1 600 px : un écran à 1,5× (portable
        # Windows) affiche l'ordinateur de la page de cas sur ~1 560 px
        # physiques, et 1 100 étaient agrandis, donc flous — « partout sur le
        # site quand il s'agit de fenêtre ordi » (Anthony, 06/09). Plafond à
        # 16 000 px de haut : WebP refuse au-delà de 16 383.
        haut = im.resize((1440, round(im.height * 1440 / im.width)), Image.LANCZOS)
        haut.crop((0, 0, 1440, min(haut.height, 2250))).save(os.path.join(IMG, nom + ".webp"), quality=80, method=6)
        full = im.resize((1600, round(im.height * 1600 / im.width)), Image.LANCZOS)
        full = full.crop((0, 0, 1600, min(full.height, 16000)))
        full.save(os.path.join(IMG, nom + "-full.webp"), quality=70, method=6)
    print("  → %s : haut %s, entière %s (%d Ko)" % (nom, haut.size, full.size, os.path.getsize(os.path.join(IMG, nom + "-full.webp")) // 1024))


def zone(nom, url, options, largeur=390):
    if capturer(nom, url, options):
        im = Image.open(os.path.join(BRUT, nom + ".png")).convert("RGB")
        im = im.resize((largeur, round(im.height * largeur / im.width)), Image.LANCZOS)
        im.save(os.path.join(IMG, nom + ".webp"), quality=80, method=6)
        print("  → %s : %s (%d Ko)" % (nom, im.size, os.path.getsize(os.path.join(IMG, nom + ".webp")) // 1024))


def reconvertir():
    """Refabrique les WebP depuis les PNG déjà capturés, sans ouvrir Edge."""
    for fam in CAPTURES:
        for nom, _, options in CAPTURES[fam]:
            convertir(nom, "--mobile" in options)
    for nom, _, options, largeur in ZONES:
        src = os.path.join(BRUT, nom + ".png")
        if os.path.exists(src):
            im = Image.open(src).convert("RGB")
            im = im.resize((largeur, round(im.height * largeur / im.width)), Image.LANCZOS)
            im.save(os.path.join(IMG, nom + ".webp"), quality=80, method=6)
            print("  → %s : %s" % (nom, im.size))


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
        for nom, url, options, largeur in ZONES:
            zone(nom, url, options, largeur)
    print("Fini. Relancer : python outils/construire.py && python outils/verifier.py")


if __name__ == "__main__":
    main()
