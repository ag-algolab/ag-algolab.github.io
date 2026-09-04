# agalgolab.com

Le site d'AG Algo Lab — Anthony Gocmen, développeur full-stack indépendant.
Statique, bilingue (français à la racine, anglais sous `/en/`), servi par
GitHub Pages depuis `public/`.

**Pour reprendre le travail, lire `_PASSATION.md` — il fait foi.**

```
src/        les sources : gabarit, pages, faits chiffrés, assets
public/     ce qui est servi — GÉNÉRÉ par outils/construire.py, ne pas y toucher
outils/     construire.py · verifier.py · capturer.py · og.py
_archives/  les versions précédentes du site
```

```bash
python outils/construire.py   # régénère public/
python outils/verifier.py     # refuse la mise en ligne si quelque chose cloche
git push origin main          # GitHub Pages déploie
```

Chaque chiffre affiché sur le site vient de `src/faits.json`, avec sa source
et la date du relevé ; `verifier.py` recompte ceux qui se recomptent.
