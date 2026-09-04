# -*- coding: utf-8 -*-
"""
Capture des pages avec Edge headless — UNE instance à la fois.

    python outils/capturer.py <url> <sortie.png> [largeur] [hauteur]
    python outils/capturer.py --site http://localhost:8873      # toutes les pages, 1280 et 504

⚠️ À lancer depuis PowerShell : lancé depuis le shell Bash, Edge n'écrit rien.
⚠️ Le headless plafonne la largeur à 504 px : pour juger le téléphone, capturer
   à 504 (toutes les media-queries mobiles y matchent) et prouver l'absence de
   débordement à 375 px par mesure dans le navigateur.
Les captures vont dans _travail/captures/ (ignoré par git).
"""
import glob
import os
import shutil
import subprocess
import sys
import tempfile
import time

sys.stdout.reconfigure(encoding="utf-8")
RACINE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAGES = ["/", "/institut-moliere/", "/prepa-600/", "/reversal-engine/", "/mentions-legales/",
         "/en/", "/en/institut-moliere/", "/en/prepa-600/", "/en/reversal-engine/", "/en/mentions-legales/"]


def trouver_edge():
    cands = glob.glob(r"C:\Program Files (x86)\Microsoft\EdgeCore\*\msedge.exe") + [
        r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
        r"C:\Program Files\Microsoft\Edge\Application\msedge.exe"]
    for c in cands:
        if os.path.exists(c):
            return c
    raise SystemExit("Edge introuvable")


def autre_travail_lourd():
    r = subprocess.run(["powershell", "-NoProfile", "-Command",
                        "Get-CimInstance Win32_Process | Where-Object { ($_.Name -eq 'msedge.exe' -and $_.CommandLine -match 'headless') -or ($_.Name -match 'ffmpeg') } | Select-Object -ExpandProperty ProcessId"],
                       capture_output=True, text=True)
    return r.stdout.strip()


def capturer(edge, url, sortie, largeur=1280, hauteur=2400, budget=40000):
    sortie = os.path.abspath(sortie)
    os.makedirs(os.path.dirname(sortie), exist_ok=True)
    if os.path.exists(sortie):
        os.remove(sortie)
    prof = tempfile.mkdtemp(prefix="edge_cap_")
    cmd = [edge, "--headless=new", "--no-sandbox", "--disable-gpu", "--hide-scrollbars",
           "--force-device-scale-factor=1", "--user-data-dir=" + prof,
           "--window-size=%d,%d" % (largeur, hauteur), "--virtual-time-budget=%d" % budget,
           "--screenshot=" + sortie, url]
    subprocess.call(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    limite, taille = time.time() + 90, -1
    while time.time() < limite:
        if os.path.exists(sortie):
            t2 = os.path.getsize(sortie)
            if t2 > 0 and t2 == taille:
                break
            taille = t2
        time.sleep(0.3)
    time.sleep(0.5)
    for _ in range(3):
        shutil.rmtree(prof, ignore_errors=True)
        if not os.path.isdir(prof):
            break
        time.sleep(1)
    ok = os.path.exists(sortie) and os.path.getsize(sortie) > 0
    print("%s : %s" % (os.path.basename(sortie), "%d octets" % os.path.getsize(sortie) if ok else "MANQUÉE"))
    return ok


def main():
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(1)
    lourd = autre_travail_lourd()
    if lourd:
        raise SystemExit("un autre travail lourd tourne (%s) : on attend" % lourd.replace("\n", ", "))
    edge = trouver_edge()
    if sys.argv[1] == "--site":
        base = sys.argv[2].rstrip("/")
        dossier = os.path.join(RACINE, "_travail", "captures")
        for page in PAGES:
            nom = page.strip("/").replace("/", "-") or "accueil"
            capturer(edge, base + page, os.path.join(dossier, nom + "-1280.png"), 1280, 2400)
            capturer(edge, base + page, os.path.join(dossier, nom + "-504.png"), 504, 2600)
        return
    url, sortie = sys.argv[1], sys.argv[2]
    largeur = int(sys.argv[3]) if len(sys.argv) > 3 else 1280
    hauteur = int(sys.argv[4]) if len(sys.argv) > 4 else 2400
    capturer(edge, url, sortie, largeur, hauteur)


if __name__ == "__main__":
    main()
