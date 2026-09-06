# -*- coding: utf-8 -*-
"""
Fabrique la carte de visite AG Algo Lab, recto et verso, prête pour
l'imprimeur.

    python outils/carte.py            # depuis PowerShell

Sortie dans `_travail/carte/` :
  carte-recto.pdf, carte-verso.pdf   à envoyer à l'imprimeur (85 × 55 mm + 3 mm de fond perdu)
  carte-recto.png, carte-verso.png   pour regarder (300 points par pouce)

Format : 85 × 55 mm, le standard européen. Avec 3 mm de fond perdu sur les
quatre bords, la page fait 91 × 61 mm : l'imprimeur coupe dedans, et rien de
blanc n'apparaît au bord si sa lame dévie d'un demi-millimètre. Tout ce qui
compte reste à 5 mm au moins du trait de coupe.

La direction artistique est celle du site (`_PASSATION.md` §4) : fond menthe
`#EAF7F1`, encre `#0B2E1F`, accent `#047857`, Plus Jakarta Sans et JetBrains
Mono servies depuis `src/assets/fonts/`, le vrai logo AG. Le QR mène à
`agalgolab.com` ; il est dessiné par `segno` en SVG, donc net à n'importe
quelle taille.

⚠️ Une seule instance d'Edge à la fois ; depuis PowerShell.
"""
import base64
import io
import json
import os
import subprocess
import sys
import tempfile
import time
import urllib.request

import segno
import websocket  # websocket-client

sys.stdout.reconfigure(encoding="utf-8")
ICI = os.path.dirname(os.path.abspath(__file__))
RACINE = os.path.dirname(ICI)
SORTIE = os.path.join(RACINE, "_travail", "carte")
sys.path.insert(0, ICI)
from capturer import trouver_edge, autre_travail_lourd  # noqa: E402

SITE = "https://agalgolab.com"
COURRIEL = "anthony@agalgolab.com"
LARGEUR_MM, HAUTEUR_MM, PERDU_MM = 85.0, 55.0, 3.0
PAGE_MM = (LARGEUR_MM + 2 * PERDU_MM, HAUTEUR_MM + 2 * PERDU_MM)


def fichier(chemin):
    """Un fichier local en data: — le PDF doit être fabriqué hors ligne."""
    with open(chemin, "rb") as f:
        b64 = base64.b64encode(f.read()).decode()
    ext = os.path.splitext(chemin)[1].lower()
    mime = {".woff2": "font/woff2", ".png": "image/png", ".jpg": "image/jpeg",
            ".jpeg": "image/jpeg", ".webp": "image/webp"}[ext]
    return "data:%s;base64,%s" % (mime, b64)


def qr_svg(donnee):
    tampon = io.BytesIO()
    segno.make(donnee, error="q").save(tampon, kind="svg", xmldecl=False, svgns=True,
                                       omitsize=True, dark="#0B2E1F", light=None, border=0)
    return tampon.getvalue().decode("utf-8")


def gabarit(cote):
    img = os.path.join(RACINE, "src", "assets", "img")
    police = os.path.join(RACINE, "src", "assets", "fonts")
    styles = """
@font-face { font-family: "Jakarta"; font-weight: 400 800; font-display: block;
  src: url("%(sans)s") format("woff2"); }
@font-face { font-family: "Mono"; font-weight: 400 600; font-display: block;
  src: url("%(mono)s") format("woff2"); }
* { margin: 0; padding: 0; box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
html, body { width: %(pw)smm; height: %(ph)smm; overflow: hidden; }
body { font-family: "Jakarta", Arial, sans-serif; color: #0B2E1F; background: #EAF7F1; }
.carte { position: absolute; inset: 0; overflow: hidden; }
/* la grille isométrique du site, en très discret */
.grille { position: absolute; inset: -20mm; opacity: .34;
  background-image: linear-gradient(#047857 .18mm, transparent .18mm), linear-gradient(90deg, #047857 .18mm, transparent .18mm);
  background-size: 6mm 6mm; transform: rotate(-30deg) skewX(15deg); }
.zone { position: absolute; left: %(m)smm; right: %(m)smm; top: %(m)smm; bottom: %(m)smm; }
""" % {"pw": PAGE_MM[0], "ph": PAGE_MM[1], "m": PERDU_MM + 5,
       "sans": fichier(os.path.join(police, "jakarta-latin.woff2")),
       "mono": fichier(os.path.join(police, "jetbrains-latin.woff2"))}

    if cote == "recto":
        corps = """
<div class="carte">
  <span class="grille"></span>
  <div class="zone recto">
    <img class="portrait" src="%(photo)s" alt="">
    <div class="txt">
      <img class="logo" src="%(logo)s" alt="">
      <p class="nom">Anthony Gocmen</p>
      <p class="role">Fondateur d'AG&nbsp;Algo&nbsp;Lab</p>
      <p class="slogan">Des plateformes entières,<br>pas des pages.</p>
    </div>
  </div>
</div>
<style>
.recto { display: flex; align-items: center; gap: 6mm; }
.portrait { width: 30mm; height: 30mm; border-radius: 50%%; object-fit: cover;
  border: .7mm solid #FFFFFF; box-shadow: 0 .8mm 2.4mm rgba(11,46,31,.18); flex: none; }
.txt { flex: 1; }
.logo { height: 7.5mm; display: block; margin-bottom: 3.2mm; }
.nom { font-size: 5.1mm; white-space: nowrap; font-weight: 800; letter-spacing: -.12mm; line-height: 1.05; }
.role { font-family: "Mono", monospace; font-size: 2.5mm; font-weight: 500; letter-spacing: .18mm;
  text-transform: uppercase; color: #047857; margin-top: 1.4mm; }
.slogan { font-size: 3.5mm; font-weight: 600; line-height: 1.3; margin-top: 3.4mm; color: #0B2E1F; }
</style>""" % {"photo": fichier(os.path.join(img, "anthony.jpg")),
               "logo": fichier(os.path.join(img, "logo-ag.png"))}
    else:
        corps = """
<div class="carte verso-fond">
  <span class="grille"></span>
  <div class="zone verso">
    <div class="gauche">
      <img class="logo" src="%(logo)s" alt="">
      <p class="marque">AG Algo&nbsp;Lab</p>
      <ul class="coord">
        <li>agalgolab.com</li>
        <li>%(courriel)s</li>
        <li>linkedin.com/in/anthony-gocmen</li>
        <li>github.com/ag-algolab</li>
      </ul>
    </div>
    <div class="droite">
      <div class="qr">%(qr)s</div>
      <p class="lire">Scannez&nbsp;: le site, les deux plateformes</p>
    </div>
  </div>
</div>
<style>
.verso-fond { background: #0B2E1F; color: #EAF7F1; }
.verso-fond .grille { opacity: .22; background-image:
  linear-gradient(#6EE7B7 .18mm, transparent .18mm), linear-gradient(90deg, #6EE7B7 .18mm, transparent .18mm); }
.verso { display: flex; align-items: center; justify-content: space-between; gap: 5mm; }
.gauche { flex: 1; }
.logo { height: 6.6mm; display: block; filter: brightness(0) saturate(100%%) invert(97%%) sepia(6%%) saturate(360%%) hue-rotate(96deg) brightness(98%%); }
.marque { font-size: 4.6mm; font-weight: 800; letter-spacing: -.1mm; margin-top: 2.6mm; }
.coord { list-style: none; margin-top: 3.4mm; font-family: "Mono", monospace; font-size: 2.15mm;
  line-height: 2.05; color: #A7F3D0; white-space: nowrap; }
.droite { text-align: center; flex: none; }
.qr { width: 24mm; height: 24mm; background: #EAF7F1; border-radius: 2mm; padding: 1.6mm; }
.qr svg { width: 100%%; height: 100%%; display: block; }
.lire { font-family: "Mono", monospace; font-size: 1.9mm; letter-spacing: .06mm; margin-top: 1.8mm;
  color: #A7F3D0; max-width: 26mm; line-height: 1.5; }
</style>""" % {"logo": fichier(os.path.join(img, "logo-ag.png")), "courriel": COURRIEL, "qr": qr_svg(SITE)}

    return "<!doctype html><html lang=\"fr\"><meta charset=\"utf-8\"><style>%s</style>%s</html>" % (styles, corps)


class Cdp:
    def __init__(self, url_ws):
        self.ws = websocket.create_connection(url_ws, suppress_origin=True)
        self.ws.settimeout(60)
        self.n = 0

    def envoyer(self, methode, params=None):
        self.n += 1
        self.ws.send(json.dumps({"id": self.n, "method": methode, "params": params or {}}))
        while True:
            msg = json.loads(self.ws.recv())
            if msg.get("id") == self.n:
                if "error" in msg:
                    raise RuntimeError("%s : %s" % (methode, msg["error"]))
                return msg.get("result", {})


def relire(chemin):
    """On ne suppose pas qu'un QR se lit : on le RELIT dans l'image finale,
    avec un vrai lecteur, y compris réduite comme le ferait une photo prise de
    loin. Sans lecteur installé, on le dit plutôt que de se taire."""
    try:
        import cv2
        import numpy as np
        from PIL import Image
    except ImportError:
        print("    (QR non relu : opencv-python-headless n'est pas installé)")
        return
    im = Image.open(chemin).convert("RGB")
    lecteur = cv2.QRCodeDetector()
    for part in (1.0, 0.5, 0.3):
        petite = im if part == 1.0 else im.resize((int(im.width * part), int(im.height * part)), Image.LANCZOS)
        texte = lecteur.detectAndDecode(np.asarray(petite)[:, :, ::-1].copy())[0]
        etat = "lu : %s" % texte if texte == SITE else "ILLISIBLE" if not texte else "lu autre chose : %r" % texte
        print("    QR à %3d %% de la taille — %s" % (part * 100, etat))


def main():
    os.makedirs(SORTIE, exist_ok=True)
    subprocess.run(["powershell", "-NoProfile", "-Command",
                    "Get-CimInstance Win32_Process | Where-Object { $_.Name -eq 'msedge.exe' -and $_.CommandLine -match 'edge_carte_' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }"],
                   capture_output=True)
    lourd = autre_travail_lourd()
    if lourd:
        raise SystemExit("un autre travail lourd tourne (%s) : on attend" % lourd.replace("\n", ", "))
    pouce = 25.4
    prof = tempfile.mkdtemp(prefix="edge_carte_")
    proc = subprocess.Popen([trouver_edge(), "--headless=new", "--no-sandbox", "--disable-gpu",
                             "--hide-scrollbars", "--remote-debugging-port=9350",
                             "--user-data-dir=" + prof, "about:blank"],
                            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    try:
        cibles = None
        for _ in range(80):
            try:
                cibles = json.load(urllib.request.urlopen("http://127.0.0.1:9350/json", timeout=2))
                break
            except Exception:
                time.sleep(0.25)
        if not cibles:
            raise SystemExit("Edge ne répond pas")
        c = Cdp([t for t in cibles if t.get("type") == "page"][0]["webSocketDebuggerUrl"])
        c.envoyer("Page.enable")
        for cote in ("recto", "verso"):
            html = gabarit(cote)
            page = os.path.join(SORTIE, "carte-%s.html" % cote)
            io.open(page, "w", encoding="utf-8", newline="\n").write(html)
            c.envoyer("Page.navigate", {"url": "file:///" + page.replace(os.sep, "/")})
            time.sleep(2.5)
            pdf = c.envoyer("Page.printToPDF", {
                "printBackground": True, "preferCSSPageSize": False, "scale": 1,
                "paperWidth": PAGE_MM[0] / pouce, "paperHeight": PAGE_MM[1] / pouce,
                "marginTop": 0, "marginBottom": 0, "marginLeft": 0, "marginRight": 0})
            chemin = os.path.join(SORTIE, "carte-%s.pdf" % cote)
            open(chemin, "wb").write(base64.b64decode(pdf["data"]))
            # l'aperçu : la même page en 300 points par pouce
            c.envoyer("Emulation.setDeviceMetricsOverride", {
                "width": int(PAGE_MM[0] / pouce * 96), "height": int(PAGE_MM[1] / pouce * 96),
                "deviceScaleFactor": 300 / 96.0, "mobile": False})
            time.sleep(0.8)
            png = c.envoyer("Page.captureScreenshot", {"format": "png"})
            apercu = os.path.join(SORTIE, "carte-%s.png" % cote)
            open(apercu, "wb").write(base64.b64decode(png["data"]))
            print("  %-6s : %s (%.0f Ko) · %s" % (cote, os.path.basename(chemin),
                                                  os.path.getsize(chemin) / 1024, os.path.basename(apercu)))
            if cote == "verso":
                relire(apercu)
        c.ws.close()
    finally:
        subprocess.run(["taskkill", "/PID", str(proc.pid), "/T", "/F"], capture_output=True)
    print("Carte : %.0f × %.0f mm coupés, %.0f × %.0f mm avec le fond perdu → %s"
          % (LARGEUR_MM, HAUTEUR_MM, PAGE_MM[0], PAGE_MM[1], SORTIE))


if __name__ == "__main__":
    main()
