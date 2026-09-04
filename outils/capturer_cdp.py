# -*- coding: utf-8 -*-
"""
Capture une page avec Edge headless piloté par son protocole de débogage
(CDP) : émulation d'un téléphone, clic sur un élément, défilement jusqu'à un
texte, puis photographie d'une zone. Ce que `capturer.py` ne sait pas faire.

    python outils/capturer_cdp.py <url> <sortie.png> [options]
      --mobile                 émule un téléphone de 390 × 844, échelle 2
      --largeur N --hauteur N  fenêtre (défaut 1280 × 900 ; 390 × 844 en mobile)
      --clic "texte"           clique le premier bouton/lien/label contenant ce texte
      --depuis "texte"         la capture commence au haut de l'élément contenant ce texte
      --decalage N             ajuste ce départ (en px CSS, négatif = plus haut)
      --long N                 hauteur de la capture en px CSS (défaut : la fenêtre)
      --attente S              secondes d'attente après le chargement (défaut 4)

⚠️ Une seule instance d'Edge à la fois (règle : la machine ne chauffe pas).
    À lancer depuis PowerShell.
"""
import argparse
import base64
import json
import os
import shutil
import subprocess
import sys
import tempfile
import time
import urllib.request

import websocket  # websocket-client

sys.stdout.reconfigure(encoding="utf-8")
ICI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, ICI)
from capturer import trouver_edge, autre_travail_lourd  # noqa: E402

UA_MOBILE = ("Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 "
             "(KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36")


class Cdp:
    def __init__(self, url_ws):
        self.ws = websocket.create_connection(url_ws, suppress_origin=True)
        self.ws.settimeout(60)
        self.n = 0
        self.evenements = []

    def envoyer(self, methode, params=None):
        self.n += 1
        self.ws.send(json.dumps({"id": self.n, "method": methode, "params": params or {}}))
        while True:
            msg = json.loads(self.ws.recv())
            if msg.get("id") == self.n:
                if "error" in msg:
                    raise RuntimeError("%s : %s" % (methode, msg["error"]))
                return msg.get("result", {})
            if "method" in msg:
                self.evenements.append(msg["method"])

    def attendre(self, evenement, delai):
        limite = time.time() + delai
        if evenement in self.evenements:
            return True
        self.ws.settimeout(1)
        while time.time() < limite:
            try:
                msg = json.loads(self.ws.recv())
            except websocket.WebSocketTimeoutException:
                continue
            if msg.get("method") == evenement:
                self.ws.settimeout(60)
                return True
        self.ws.settimeout(60)
        return False

    def evaluer(self, expression):
        r = self.envoyer("Runtime.evaluate", {"expression": expression, "returnByValue": True, "awaitPromise": True})
        return r.get("result", {}).get("value")


JS_CLIC = r"""
(function (texte) {
  const cands = Array.from(document.querySelectorAll('button, a, label, [role="button"], [role="radio"], input'));
  const cible = cands.find(el => (el.textContent || el.value || '').replace(/\s+/g, ' ').trim().toLowerCase().includes(texte.toLowerCase()));
  if (!cible) return 'introuvable';
  cible.scrollIntoView({block: 'center'});
  cible.click();
  return cible.tagName + ' ' + (cible.textContent || '').trim().slice(0, 60);
})(%s)
"""

JS_DEPUIS = r"""
(function (texte) {
  const tous = Array.from(document.querySelectorAll('body *'));
  const el = tous.find(e => e.children.length < 6 && (e.textContent || '').replace(/\s+/g, ' ').trim().toLowerCase().includes(texte.toLowerCase()));
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return Math.round(r.top + window.scrollY);
})(%s)
"""


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("url")
    ap.add_argument("sortie")
    ap.add_argument("--mobile", action="store_true")
    ap.add_argument("--largeur", type=int)
    ap.add_argument("--hauteur", type=int)
    ap.add_argument("--clic")
    ap.add_argument("--depuis")
    ap.add_argument("--decalage", type=int, default=0)
    ap.add_argument("--long", type=int)
    ap.add_argument("--attente", type=float, default=4)
    a = ap.parse_args()

    # un Edge headless resté de NOTRE précédente capture (profil edge_cdp_/edge_cap_) se ferme ;
    # celui d'Anthony, jamais
    subprocess.run(["powershell", "-NoProfile", "-Command",
                    "Get-CimInstance Win32_Process | Where-Object { $_.Name -eq 'msedge.exe' -and $_.CommandLine -match 'edge_cdp_|edge_cap_' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }"],
                   capture_output=True)
    time.sleep(1)
    lourd = autre_travail_lourd()
    if lourd:
        raise SystemExit("un autre travail lourd tourne (%s) : on attend" % lourd.replace("\n", ", "))
    edge = trouver_edge()
    largeur = a.largeur or (390 if a.mobile else 1280)
    hauteur = a.hauteur or (844 if a.mobile else 900)
    port = 9333
    prof = tempfile.mkdtemp(prefix="edge_cdp_")
    proc = subprocess.Popen([edge, "--headless=new", "--no-sandbox", "--disable-gpu", "--hide-scrollbars",
                             "--remote-debugging-port=%d" % port, "--user-data-dir=" + prof,
                             "--window-size=%d,%d" % (max(largeur, 504), hauteur), "about:blank"],
                            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    try:
        cibles = None
        for _ in range(80):
            try:
                cibles = json.load(urllib.request.urlopen("http://127.0.0.1:%d/json" % port, timeout=2))
                break
            except Exception:
                time.sleep(0.25)
        if not cibles:
            raise SystemExit("Edge ne répond pas sur le port %d" % port)
        page = [t for t in cibles if t.get("type") == "page"][0]
        c = Cdp(page["webSocketDebuggerUrl"])
        c.envoyer("Page.enable")
        c.envoyer("Runtime.enable")
        c.envoyer("Emulation.setDeviceMetricsOverride", {
            "width": largeur, "height": hauteur, "deviceScaleFactor": 2 if a.mobile else 1, "mobile": bool(a.mobile)})
        if a.mobile:
            c.envoyer("Emulation.setUserAgentOverride", {"userAgent": UA_MOBILE})
            c.envoyer("Emulation.setTouchEmulationEnabled", {"enabled": True})
        c.envoyer("Page.navigate", {"url": a.url})
        c.attendre("Page.loadEventFired", 40)
        time.sleep(a.attente)
        if a.clic:
            print("clic :", c.evaluer(JS_CLIC % json.dumps(a.clic)))
            time.sleep(2.5)
        # les images chargées à la demande n'apparaissent qu'une fois vues :
        # on parcourt toute la page par paliers, on laisse charger, on remonte
        hauteur_page = int(c.evaluer("Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)") or 0)
        y_parcours = 0
        while y_parcours < hauteur_page:
            c.evaluer("window.scrollTo(0, %d)" % y_parcours)
            time.sleep(0.35)
            y_parcours += max(300, hauteur // 2)
            hauteur_page = int(c.evaluer("Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)") or hauteur_page)
        c.evaluer("window.scrollTo(0, 0)")
        time.sleep(1.5)
        c.evaluer("Promise.all(Array.from(document.images).filter(i => !i.complete).map(i => new Promise(r => { i.onload = i.onerror = r; setTimeout(r, 4000); })))")
        time.sleep(0.8)
        y = 0
        if a.depuis:
            y = c.evaluer(JS_DEPUIS % json.dumps(a.depuis))
            if y is None:
                raise SystemExit("texte introuvable : " + a.depuis)
            y = max(0, y + a.decalage)
            c.evaluer("window.scrollTo(0, %d)" % y)
            time.sleep(1.2)
            print("départ à", y, "px")
        long_ = a.long or hauteur
        # la page peut être plus courte que la zone demandée
        hauteur_page = c.evaluer("Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)") or long_
        long_ = min(long_, max(1, int(hauteur_page) - y))
        r = c.envoyer("Page.captureScreenshot", {
            "format": "png", "captureBeyondViewport": True,
            "clip": {"x": 0, "y": y, "width": largeur, "height": long_, "scale": 2 if a.mobile else 1}})
        with open(a.sortie, "wb") as f:
            f.write(base64.b64decode(r["data"]))
        print("%s : %d octets (%d × %d px CSS)" % (os.path.basename(a.sortie), os.path.getsize(a.sortie), largeur, long_))
        c.ws.close()
    finally:
        # tout l'arbre de processus, pas seulement le parent — puis ce qui
        # porterait encore notre profil (Edge relance parfois des enfants)
        subprocess.run(["taskkill", "/PID", str(proc.pid), "/T", "/F"], capture_output=True)
        try:
            proc.wait(timeout=10)
        except Exception:
            pass
        time.sleep(1)
        subprocess.run(["powershell", "-NoProfile", "-Command",
                        "Get-CimInstance Win32_Process | Where-Object { $_.Name -eq 'msedge.exe' -and $_.CommandLine -match 'edge_cdp_' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }"],
                       capture_output=True)
        time.sleep(1)
        for _ in range(3):
            shutil.rmtree(prof, ignore_errors=True)
            if not os.path.isdir(prof):
                break
            time.sleep(1)


if __name__ == "__main__":
    main()
