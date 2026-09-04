# -*- coding: utf-8 -*-
"""
Rafraîchit les captures des deux plateformes — À LANCER CHAQUE SEMAINE.

    python outils/rafraichir.py            # tout
    python outils/rafraichir.py moliere    # une seule famille (moliere | p600)

Les sites évoluent ; le site vitrine doit montrer leur état réel. Chaque page
est photographiée EN ENTIER (ordinateur 1280 px et téléphone 390 px) avec
Edge piloté par son protocole de débogage (`capturer_cdp.py`), puis convertie
en WebP dans `src/assets/img/` :

  <nom>.webp         ordinateur, 960 px de large, le haut de la page (1500 px)  → héros
  <nom>-full.webp    ordinateur, 800 px de large, la page entière             → vitrines qui déroulent
  <nom>-m.webp       téléphone, 390 px de large, le haut (1702 px)
  <nom>-m-full.webp  téléphone, 360 px de large, la page entière

Puis `python outils/construire.py` et `python outils/verifier.py`, puis push.
⚠️ Depuis PowerShell, une seule instance d'Edge à la fois (le script est séquentiel).
"""
import os
import subprocess
import sys

from PIL import Image

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
        ("moliere-accueil", MOLIERE + "/", ["--long", "30000", "--attente", "7"]),
        ("moliere-plateforme", MOLIERE + "/la-plateforme", ["--long", "30000", "--attente", "7"]),
        ("moliere-test", MOLIERE + "/test-de-niveau", ["--long", "30000", "--attente", "5"]),
        ("moliere-inscription", MOLIERE + "/inscription-cours", ["--long", "30000", "--attente", "5", "--clic", "première fois"]),
        ("moliere-accueil-m", MOLIERE + "/", ["--mobile", "--long", "30000", "--attente", "7"]),
        ("moliere-test-m", MOLIERE + "/test-de-niveau", ["--mobile", "--long", "30000", "--attente", "5"]),
        ("moliere-inscription-m", MOLIERE + "/inscription-cours", ["--mobile", "--long", "30000", "--attente", "5", "--clic", "première fois"]),
        ("moliere-plateforme-m", MOLIERE + "/la-plateforme", ["--mobile", "--long", "30000", "--attente", "7"]),
    ],
    "p600": [
        ("p600-accueil", P600 + "/", ["--long", "30000", "--attente", "7"]),
        ("p600-test", P600 + "/le-test.html", ["--long", "30000", "--attente", "5"]),
        ("p600-simulateur", P600 + "/simulateur.html", ["--long", "30000", "--attente", "5"]),
        ("p600-tarifs", P600 + "/tarifs.html", ["--long", "30000", "--attente", "5"]),
        ("p600-accueil-m", P600 + "/", ["--mobile", "--long", "30000", "--attente", "7"]),
        ("p600-test-m", P600 + "/le-test.html", ["--mobile", "--long", "30000", "--attente", "5"]),
        ("p600-tarifs-m", P600 + "/tarifs.html", ["--mobile", "--long", "30000", "--attente", "5"]),
        ("p600-simulateur-m", P600 + "/simulateur.html", ["--mobile", "--long", "30000", "--attente", "5"]),
    ],
}
# les deux téléphones du héros : une zone précise d'une page
ZONES = [
    ("moliere-form-m", MOLIERE + "/inscription-cours", ["--mobile", "--clic", "première fois", "--depuis", "Avez-vous déjà un compte", "--decalage", "330", "--long", "1300"]),
    ("p600-fuites-m", P600 + "/", ["--mobile", "--depuis", "FUITE 01", "--decalage", "-90", "--long", "1140", "--attente", "7"]),
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
        haut = im.resize((960, round(im.height * 960 / im.width)), Image.LANCZOS)
        haut.crop((0, 0, 960, min(haut.height, 1500))).save(os.path.join(IMG, nom + ".webp"), quality=82, method=6)
        full = im.resize((800, round(im.height * 800 / im.width)), Image.LANCZOS)
        full = full.crop((0, 0, 800, min(full.height, 16000)))
        full.save(os.path.join(IMG, nom + "-full.webp"), quality=76, method=6)
    print("  → %s : haut %s, entière %s (%d Ko)" % (nom, haut.size, full.size, os.path.getsize(os.path.join(IMG, nom + "-full.webp")) // 1024))


def zone(nom, url, options):
    if capturer(nom, url, options):
        im = Image.open(os.path.join(BRUT, nom + ".png")).convert("RGB")
        im = im.resize((390, round(im.height * 390 / im.width)), Image.LANCZOS)
        im.save(os.path.join(IMG, nom + ".webp"), quality=84, method=6)
        print("  → %s : %s" % (nom, im.size))


def main():
    os.makedirs(BRUT, exist_ok=True)
    familles = [a for a in sys.argv[1:] if a in CAPTURES] or list(CAPTURES)
    for fam in familles:
        print("== " + fam)
        for nom, url, options in CAPTURES[fam]:
            if capturer(nom, url, options):
                convertir(nom, "--mobile" in options)
    if not sys.argv[1:] or "zones" in sys.argv[1:]:
        print("== zones du héros")
        for nom, url, options in ZONES:
            zone(nom, url, options)
    print("Fini. Relancer : python outils/construire.py && python outils/verifier.py")


if __name__ == "__main__":
    main()
