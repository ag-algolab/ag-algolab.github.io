# -*- coding: utf-8 -*-
"""
Contrôle le RENDU de public/ dans Edge headless (CDP), page par page, en
ordinateur (1280 × 900) puis en téléphone (390 × 844, échelle 2) :

  - chaque image est chargée et décodée DÈS L'OUVERTURE, sans défiler
    (`complete` et `naturalWidth > 0`), en moins de huit secondes en local ;
    aucune n'est déclarée `loading="lazy"` ; aucune ne dépasse 16 383 px
    (plafond des textures : au-delà, blanc) ni 4,2 mégapixels (au-delà, des
    secondes de décodage au moment de peindre : l'écran blanc du 06/09) ;
  - aucun débordement horizontal (`scrollWidth` ≤ largeur de la fenêtre),
    en haut de page et une fois descendu tout en bas ;
  - en téléphone, chaque cible tactile visible (bouton, lien-bouton, onglet,
    badge, champ, lien de menu) fait au moins 44 px dans ses deux dimensions ;
    un lien posé dans une phrase ne compte pas ;
  - aucune exception JavaScript, aucune ressource en erreur (404…).

Puis écrit dans src/faits.json, famille `site`, ce que la méthode de
l'accueil affiche : `images_cassees`, `debordement_px`, `cible_min_px`,
`releve_rendu`. `verifier.py` avertit quand ce relevé a plus de huit jours.

    python outils/verifier_rendu.py                      # tout, depuis PowerShell
    python outils/verifier_rendu.py --lire               # n'écrit pas faits.json
    python outils/verifier_rendu.py --pages /fr/prepa-600/ /fr/   # certaines pages

Règle du 06/09 (Anthony : « les sites ne sont pas chargés entièrement quand
ils défilent… ça ne doit plus jamais se reproduire, check dès que tu y
touches ») : à lancer après construire.py dès qu'on touche une image, une
vitrine, un cadre ou le CSS d'une page.

⚠️ Une seule instance d'Edge (la machine ne chauffe pas) ; depuis PowerShell,
depuis Bash Edge ne répond pas. Le script sert public/ lui-même sur un port
libre : pas besoin du serveur local.

Code de sortie : 0 si tout passe, 1 sinon.
"""
import argparse
import datetime
import functools
import glob
import http.server
import io
import json
import os
import subprocess
import sys
import tempfile
import threading
import time
import urllib.request

import websocket  # websocket-client

sys.stdout.reconfigure(encoding="utf-8")
ICI = os.path.dirname(os.path.abspath(__file__))
RACINE = os.path.dirname(ICI)
PUB = os.path.join(RACINE, "public")
FAITS = os.path.join(RACINE, "src", "faits.json")
sys.path.insert(0, ICI)
from capturer import trouver_edge, autre_travail_lourd  # noqa: E402
from capturer_cdp import UA_MOBILE  # noqa: E402

DELAI_IMAGES = 8.0      # secondes, en local
CIBLE_MIN = 44          # px, dans les deux dimensions
TEXTURE_MAX = 16383     # px, plafond d'une image décodée
PIXELS_MAX = 4_200_000  # pixels par image : au-delà, des secondes de décodage à la peinture

FENETRES = [
    ("ordi", {"width": 1280, "height": 900, "deviceScaleFactor": 1, "mobile": False}),
    ("tel", {"width": 390, "height": 844, "deviceScaleFactor": 2, "mobile": True}),
]


class Cdp:
    """Comme capturer_cdp.Cdp, mais garde les exceptions et les erreurs de
    chargement que la page émet entre deux commandes."""

    def __init__(self, url_ws):
        self.ws = websocket.create_connection(url_ws, suppress_origin=True)
        self.ws.settimeout(60)
        self.n = 0
        self.evenements = []
        self.erreurs = []

    def noter(self, msg):
        m = msg.get("method")
        if not m:
            return
        self.evenements.append(m)
        p = msg.get("params", {})
        if m == "Runtime.exceptionThrown":
            d = p.get("exceptionDetails", {})
            texte = d.get("exception", {}).get("description") or d.get("text") or "exception"
            self.erreurs.append("JS : " + texte.split("\n")[0][:160])
        elif m == "Log.entryAdded" and p.get("entry", {}).get("level") == "error":
            e = p["entry"]
            self.erreurs.append("%s : %s" % (e.get("source", "log"), (e.get("text", "") + " " + e.get("url", "")).strip()[:160]))

    def envoyer(self, methode, params=None):
        self.n += 1
        self.ws.send(json.dumps({"id": self.n, "method": methode, "params": params or {}}))
        while True:
            msg = json.loads(self.ws.recv())
            if msg.get("id") == self.n:
                if "error" in msg:
                    raise RuntimeError("%s : %s" % (methode, msg["error"]))
                return msg.get("result", {})
            self.noter(msg)

    def attendre(self, evenement, delai):
        limite = time.time() + delai
        if evenement in self.evenements:
            return True
        self.ws.settimeout(1)
        try:
            while time.time() < limite:
                try:
                    msg = json.loads(self.ws.recv())
                except websocket.WebSocketTimeoutException:
                    continue
                self.noter(msg)
                if msg.get("method") == evenement:
                    return True
            return False
        finally:
            self.ws.settimeout(60)

    def evaluer(self, expression):
        r = self.envoyer("Runtime.evaluate", {"expression": expression, "returnByValue": True, "awaitPromise": True})
        return r.get("result", {}).get("value")


JS_ETAT = r"""
(function (mobile) {
  var imgs = Array.prototype.slice.call(document.images);
  var lire = function (e) { return (e.textContent || e.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim().slice(0, 40); };
  var nom = function (e) { return e.tagName.toLowerCase() + (e.className && typeof e.className === 'string' ? '.' + e.className.split(' ')[0] : ''); };
  var cibles = [], cibleMin = null;
  if (mobile) {
    var tous = document.querySelectorAll('a, button, [role="button"], [role="tab"], input, select, textarea, summary, label');
    Array.prototype.forEach.call(tous, function (e) {
      var cs = getComputedStyle(e);
      if (cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity) === 0) return;
      if (e.closest('[hidden], [aria-hidden="true"], nav:not(.ouvert) .nav-panneau')) return;
      // un lien dans une phrase ne compte pas ; un lien de menu, si
      if (cs.display === 'inline' && !e.closest('nav, header, footer, .nav')) return;
      var r = e.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      var m = Math.round(Math.min(r.width, r.height));
      if (cibleMin === null || m < cibleMin) cibleMin = m;
      if (m < %d) cibles.push(nom(e) + ' « ' + lire(e) + ' » ' + Math.round(r.width) + '×' + Math.round(r.height));
    });
  }
  return {
    total: imgs.length,
    attente: imgs.filter(function (i) { return !i.complete; }).length,
    cassees: imgs.filter(function (i) { return i.complete && i.naturalWidth === 0; }).map(function (i) { return i.getAttribute('src'); }),
    lazy: imgs.filter(function (i) { return i.getAttribute('loading') === 'lazy'; }).length,
    trop: imgs.filter(function (i) { return i.naturalWidth > %d || i.naturalHeight > %d || i.naturalWidth * i.naturalHeight > %d; }).map(function (i) { return i.getAttribute('src') + ' ' + i.naturalWidth + '×' + i.naturalHeight; }),
    debord: document.documentElement.scrollWidth - window.innerWidth,
    cibles: cibles,
    cibleMin: cibleMin
  };
})(%s)
""" % (CIBLE_MIN, TEXTURE_MAX, TEXTURE_MAX, PIXELS_MAX, "%s")


class Silencieux(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass


class Serveur(http.server.ThreadingHTTPServer):
    def handle_error(self, requete, adresse):
        pass  # Edge coupe ses connexions en partant : ce n'est pas une erreur du site


def servir():
    serveur = Serveur(("127.0.0.1", 0), functools.partial(Silencieux, directory=PUB))
    threading.Thread(target=serveur.serve_forever, daemon=True).start()
    return serveur, "http://127.0.0.1:%d" % serveur.server_address[1]


def pages_publiques():
    pages = []
    for p in sorted(glob.glob(os.path.join(PUB, "**", "index.html"), recursive=True)):
        rel = os.path.relpath(os.path.dirname(p), PUB).replace(os.sep, "/")
        if rel.startswith("en"):
            continue
        pages.append("/" if rel == "." else "/" + rel + "/")
    return pages


def lancer_edge(edge, port):
    subprocess.run(["powershell", "-NoProfile", "-Command",
                    "Get-CimInstance Win32_Process | Where-Object { $_.Name -eq 'msedge.exe' -and $_.CommandLine -match 'edge_cdp_|edge_cap_|edge_rendu_' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }"],
                   capture_output=True)
    time.sleep(1)
    lourd = autre_travail_lourd()
    if lourd:
        raise SystemExit("un autre travail lourd tourne (%s) : on attend" % lourd.replace("\n", ", "))
    prof = tempfile.mkdtemp(prefix="edge_rendu_")
    proc = subprocess.Popen([edge, "--headless=new", "--no-sandbox", "--disable-gpu", "--hide-scrollbars",
                             "--remote-debugging-port=%d" % port, "--user-data-dir=" + prof,
                             "--window-size=1280,900", "about:blank"],
                            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
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
    return proc, prof, page["webSocketDebuggerUrl"]


def fermer_edge(proc, prof):
    subprocess.run(["taskkill", "/PID", str(proc.pid), "/T", "/F"], capture_output=True)
    try:
        proc.wait(timeout=10)
    except Exception:
        pass
    time.sleep(1)
    subprocess.run(["powershell", "-NoProfile", "-Command",
                    "Get-CimInstance Win32_Process | Where-Object { $_.Name -eq 'msedge.exe' -and $_.CommandLine -match 'edge_rendu_' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }"],
                   capture_output=True)
    import shutil
    for _ in range(3):
        shutil.rmtree(prof, ignore_errors=True)
        if not os.path.isdir(prof):
            break
        time.sleep(1)


def examiner(c, base, chemin, nom, fenetre, erreurs):
    """Une page dans une fenêtre : renvoie (cassées, débordement, cible min)."""
    c.evenements = []
    c.erreurs = []
    c.envoyer("Emulation.setDeviceMetricsOverride", fenetre)
    c.envoyer("Emulation.setTouchEmulationEnabled", {"enabled": fenetre["mobile"]})
    c.envoyer("Emulation.setUserAgentOverride", {"userAgent": UA_MOBILE if fenetre["mobile"] else ""})
    c.envoyer("Page.navigate", {"url": base + chemin})
    if not c.attendre("Page.loadEventFired", 40):
        erreurs.append("%s %s : la page ne finit pas de charger" % (chemin, nom))
        return 0, 0, None
    debut = time.time()
    etat = None
    while True:
        etat = c.evaluer(JS_ETAT % ("true" if fenetre["mobile"] else "false")) or {}
        if etat.get("attente", 1) == 0 or time.time() - debut > DELAI_IMAGES:
            break
        time.sleep(0.25)
    delai = time.time() - debut
    # tout en bas, puis retour : les gestionnaires de défilement tournent,
    # et un débordement peut n'apparaître qu'une fois une section dépliée
    c.evaluer("window.scrollTo(0, document.documentElement.scrollHeight)")
    time.sleep(0.6)
    bas = c.evaluer("document.documentElement.scrollWidth - window.innerWidth") or 0
    c.evaluer("window.scrollTo(0, 0)")
    time.sleep(0.3)
    debord = max(int(etat.get("debord", 0)), int(bas))
    ou = "%s %s" % (chemin, nom)
    if etat.get("attente"):
        erreurs.append("%s : %d image(s) toujours pas chargée(s) après %.0f s" % (ou, etat["attente"], DELAI_IMAGES))
    for src in etat.get("cassees", []):
        erreurs.append("%s : image cassée %s" % (ou, src))
    if etat.get("lazy"):
        erreurs.append("%s : %d image(s) loading=\"lazy\"" % (ou, etat["lazy"]))
    for t in etat.get("trop", []):
        erreurs.append("%s : image au-delà de %d px ou de %.1f Mpx — %s" % (ou, TEXTURE_MAX, PIXELS_MAX / 1e6, t))
    if debord > 0:
        erreurs.append("%s : débordement horizontal de %d px" % (ou, debord))
    for cb in etat.get("cibles", []):
        erreurs.append("%s : cible tactile sous %d px — %s" % (ou, CIBLE_MIN, cb))
    for e in c.erreurs:
        erreurs.append("%s : %s" % (ou, e))
    print("  %s %-24s %-5s %2d images en %.1f s · débordement %d px%s" % (
        "✓" if not [e for e in erreurs if e.startswith(ou)] else "✗", chemin, nom, etat.get("total", 0), delai, debord,
        " · cible min %s px" % etat.get("cibleMin") if fenetre["mobile"] and etat.get("cibleMin") is not None else ""))
    return len(etat.get("cassees", [])), debord, etat.get("cibleMin")


def ecrire_faits(cassees, debord, cible_min):
    faits = json.load(io.open(FAITS, encoding="utf-8"))
    aujourd = datetime.date.today().isoformat()
    site = faits.setdefault("site", {})
    for cle, valeur, source in (
            ("images_cassees", cassees, "verifier_rendu.py : images sans pixel décodé, toutes pages, ordinateur et téléphone"),
            ("debordement_px", debord, "verifier_rendu.py : scrollWidth − largeur de fenêtre, le pire de toutes les pages, à 1 280 et 390 px"),
            ("cible_min_px", cible_min, "verifier_rendu.py : la plus petite cible tactile visible à 390 px (boutons, onglets, badges, menu), min(largeur, hauteur)"),
            ("releve_rendu", aujourd, "date du dernier passage de verifier_rendu.py")):
        n = site.setdefault(cle, {})
        n["valeur"] = valeur
        n["source"] = source
        n["releve"] = aujourd
    io.open(FAITS, "w", encoding="utf-8", newline="\n").write(json.dumps(faits, ensure_ascii=False, indent=2) + "\n")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--lire", action="store_true", help="n'écrit pas src/faits.json")
    ap.add_argument("--pages", nargs="*", help="chemins à contrôler (défaut : toutes les pages de public/)")
    a = ap.parse_args()
    if not os.path.isdir(PUB):
        raise SystemExit("public/ absent : lancer d'abord python outils/construire.py")
    pages = a.pages or pages_publiques()
    serveur, base = servir()
    edge = trouver_edge()
    proc, prof, ws = lancer_edge(edge, 9334)
    erreurs = []
    cassees, debord, cible_min = 0, 0, None
    try:
        c = Cdp(ws)
        c.envoyer("Page.enable")
        c.envoyer("Runtime.enable")
        c.envoyer("Log.enable")
        c.envoyer("Network.setCacheDisabled", {"cacheDisabled": True})
        for chemin in pages:
            for nom, fenetre in FENETRES:
                k, d, m = examiner(c, base, chemin, nom, dict(fenetre), erreurs)
                cassees += k
                debord = max(debord, d)
                if m is not None:
                    cible_min = m if cible_min is None else min(cible_min, m)
        c.ws.close()
    finally:
        fermer_edge(proc, prof)
        serveur.shutdown()
    print("%d page(s) × %d fenêtres" % (len(pages), len(FENETRES)))
    for e in erreurs:
        print("  ERREUR : " + e)
    if not a.lire and not a.pages:
        ecrire_faits(cassees, debord, cible_min if cible_min is not None else 0)
        print("faits.json : site.images_cassees=%d, site.debordement_px=%d, site.cible_min_px=%s, site.releve_rendu=%s"
              % (cassees, debord, cible_min, datetime.date.today().isoformat()))
    if erreurs:
        print("ÉCHEC : %d erreur(s)" % len(erreurs))
        sys.exit(1)
    print("OK — rendu conforme")


if __name__ == "__main__":
    main()
