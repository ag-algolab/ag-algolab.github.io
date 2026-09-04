# agalgolab.com — passation

> **Ce fichier fait foi.** Il est écrit pour qu'une session neuve reprenne le
> travail sans rien redécouvrir. Mis à jour le **4 septembre 2026**.
>
> agalgolab.com est le site d'AG Algo Lab, l'entreprise individuelle
> d'Anthony Gocmen (SIREN 935 081 703, régime réel de TVA). Mi-portfolio,
> mi-site de vente : il montre deux produits en production (la plateforme
> de l'Institut Molière et Prépa 600), vend deux formats (plateforme
> complète, site vitrine) et dit comment le travail est fait (Claude Code,
> toujours sur les modèles les plus performants du marché).
>
> ⚠️ Ce dépôt est **PUBLIC** (GitHub Pages gratuit l'exige). Rien de
> confidentiel n'y entre : pas de chiffres commerciaux des clients, pas de
> prospects, pas de clés. Ce document reste lisible par n'importe qui.

---

## 1. Où tout se trouve

| Quoi | Où |
|---|---|
| Le site en ligne | https://agalgolab.com (et https://agalgolab.com/en/) |
| Le dépôt | GitHub `ag-algolab/ag-algolab.github.io`, branche `main`, **public** |
| Le code en local | `C:\Users\antho\projets\agalgolab\` |
| L'hébergement | **GitHub Pages**, déployé par `.github/workflows/deploy.yml` à chaque push sur `main` |
| Le nom de domaine | Porkbun ; enregistrements A vers les quatre adresses de GitHub Pages (185.199.108–111.153) ; `public/CNAME` porte `agalgolab.com` |
| Les sources | `src/` — le gabarit, les pages, les faits, les assets |
| Ce qui est servi | `public/` — **généré**, jamais modifié à la main |
| Les outils | `outils/` — construire, vérifier, capturer, images de partage |
| Les anciennes versions | `_archives/` — V1 React (clone fidèle en un fichier), V2 « instrument vivant » du 4 août 2026, et trois images d'origine (photo, logos) |

Aucune base, aucun serveur, aucune clé : le site est entièrement statique.
Le seul canal de contact est `mailto:anthony@agalgolab.com`.

**Ce qui n'existe plus** : le build React + Vite + Tailwind de la V1, les
pages MLbet, SolverBet, ShahMat, Faconde et « fraud risk scoring », les pages
cachées, la palette ⌘K, le curseur custom, l'offre « data » à 950 €. Tout
document qui les cite est périmé (les archives les gardent pour mémoire).

---

## 2. Faire tourner la machine

```
modifier src/  →  python outils/construire.py  →  python outils/verifier.py
             →  regarder en local  →  git commit  →  git push  →  Pages déploie (~1 min)
```

### Construire

`python outils/construire.py` régénère `public/` **entièrement** : les
dix pages (cinq en français à la racine, cinq en anglais sous `/en/`), le
sitemap avec les alternates de langue, `robots.txt`, `llms.txt`, `CNAME`,
`404.html`, et copie `src/assets/` vers `public/assets/`.

### Écrire une page

Une page = un fichier `src/pages/<slug>.html`, avec un en-tête :

```
---
slug: prepa-600
titre: [[Titre français||English title]]
description: [[…||…]]
type: cas            (accueil | cas | projet | legal — change le JSON-LD)
image: /assets/img/og-prepa-600.png
modifie: 2026-09-04  (date du sitemap et du JSON-LD)
---
```

Puis le corps, avec quatre macros :

| Macro | Ce qu'elle fait |
|---|---|
| `[[français||English]]` | un texte, deux langues — partout, y compris dans un attribut |
| `{{f:moliere.ecrans}}` | un chiffre de `src/faits.json`, formaté dans la langue (70 795 / 70,795) |
| `{{d:moliere.en_ligne}}` | une date de `faits.json` en toutes lettres (25 août 2026 / 25 August 2026) |
| `{{p:prepa-600}}` · `{{accueil}}` | le chemin d'une page dans la langue courante |

⚠️ Jamais de `||` ni de `]]` ailleurs que dans une macro. Le constructeur
refuse une macro non résolue.

### Vérifier

`python outils/verifier.py` — sort en erreur si : macro non résolue, plusieurs
`<h1>`, `lang` faux, canonical ou hreflang manquants, `og:image` absente,
JSON-LD invalide, image sans `alt` ou sans `width`/`height`, image ou lien
interne introuvable, lien `http://`, mot interdit (« CTO », « lorem »,
« TODO », « Prépa 600® »), versions `?v=` incohérentes, **contraste sous
4,5:1** sur une paire de couleurs de la DA, ou **chiffre de `faits.json` qui
ne correspond plus au dépôt voisin** (écrans, routes, migrations, pages,
endpoints, questions). Le nombre de commits ne bloque pas : il avance tout
seul, il donne un avertissement à mettre à jour avec sa date.

### Regarder en local

```
python -m http.server 8873 --directory public
```

(ou, dans Claude Code, la configuration `agalgolab` de `.claude/launch.json`).
Les pages se lisent à `http://localhost:8873/`, `/en/`, `/institut-moliere/`…

### Capturer

```
python outils/capturer.py --site http://localhost:8873      # depuis PowerShell
```

Dix pages × deux largeurs (1280 et 504) dans `_travail/captures/`, une
instance d'Edge à la fois. ⚠️ **Depuis PowerShell** : lancé depuis Bash,
Edge n'écrit rien. ⚠️ Le headless plafonne à **504 px** de large : c'est la
capture « téléphone », et l'absence de débordement à 375 px se prouve par
mesure dans le navigateur, pas par capture.

### Les images de partage

`python outils/og.py` (PowerShell) fabrique `og-agalgolab.png`,
`og-institut-moliere.png` et `og-prepa-600.png` dans `src/assets/img/`,
en 1200 × 630, avec les polices et la DA du site. Les textes sont dans le
script. Relancer `construire.py` après.

### Versions des assets

`style.css?v=N` et `site.js?v=N` sont écrits dans `src/gabarit.html` (et
`src/404.html` pour le CSS). **Toute modification d'un de ces deux fichiers
exige d'incrémenter son `?v=`**, sinon les visiteurs revenants gardent
l'ancien fichier en cache.

### Publier

```
git add -A
git commit -m "…"
git push origin main
```

Le workflow `deploy.yml` téléverse `public/` tel quel — aucune étape de
compilation côté GitHub. En cas de doute sur un déploiement : onglet
**Actions** du dépôt.

---

## 3. Les chiffres du site — `src/faits.json`

Chaque chiffre affiché vient de là, avec **sa source et la date du relevé**.
Le site le promet en pied de page et dans les mentions légales (§ 5) :
ne jamais écrire un chiffre en dur dans une page.

Pour mettre à jour (à faire quand les deux autres dépôts ont bougé) :

```bash
# Molière
find ../moliere-plateforme/src/app -name page.tsx | wc -l            # ecrans
find ../moliere-plateforme/src/app/api -name route.ts | wc -l        # routes_api
ls ../moliere-plateforme/db | grep -cE '^[0-9]{2}_'                   # migrations
git -C ../moliere-plateforme rev-list --count HEAD                    # commits
# Prépa 600
ls ../tagemage/public/*.html | wc -l                                  # pages
ls ../tagemage/api/*.js | grep -v '/_' | wc -l                        # endpoints
git -C ../tagemage rev-list --count HEAD                              # commits
```

Puis reporter dans `faits.json` avec la nouvelle date de relevé, recalculer
`total.commits` (somme) et `moliere.jours` (du 16 août à la date du relevé,
bornes comprises), et relancer `verifier.py`, qui recompte lui-même ce qui se
recompte.

---

## 4. La direction artistique — « Isométrique »

Choisie par Anthony le 4 septembre 2026 **parmi seize compositions** (trois
habillages, puis dix habillages, puis six compositions, puis dix
compositions : les maquettes sont dans `_travail/da*`, ignoré par git). Ce
qu'il a écarté en chemin : le papier et le serif (« ça fait Claude », l'orange
aussi), les habillages qui ne changent que les couleurs, les compositions
« un texte, une barre de chiffres et voilà ». Ce qu'il a retenu : **le double
panneau ordinateur + téléphone**, à condition que les deux cadres montrent des
pages différentes et **changent de page**, et du mouvement.

Fond menthe, encre vert profond, un accent vert, chiffres en bandes vert nuit.
**Plus Jakarta Sans** partout (titres en 800, très serrés), **JetBrains Mono**
pour les étiquettes et les sources. Le héros de l'accueil et des deux cas pose
les écrans en **dalles flottantes sur un sol quadrillé en 3D**, les téléphones
et les étiquettes se redressent face au visiteur.

| Jeton | Valeur | Emploi |
|---|---|---|
| `--papier` / `--papier-2` / `--carte` | `#EAF7F1` / `#DDF0E6` / `#FFFFFF` | fonds |
| `--encre` / `--encre-2` | `#0B2E1F` / `#3F5F50` | texte / texte secondaire (6,4:1 sur menthe) |
| `--accent` | `#047857` | boutons au survol, mot fort des titres (4,9:1 sur menthe, gros texte) |
| `--accent-txt` | `#046C4E` | petit texte vert (5,9:1) |
| `--accent-vif` | `#10B981` | décor seulement : losanges des étiquettes et des puces |
| `--nuit` / `--nuit-2` | `#0B2E1F` / `#124A33` | bandes de chiffres, étiquettes de la scène, bloc du graphique |
| `--menthe` / `--ambre` | `#6EE7B7` / `#FCD34D` | chiffres et lignes sur les blocs nuit |

**La scène isométrique** (`.iso`) : un bloc de 760 × 640 dessiné à l'échelle 1
puis réduit par `--k` selon la largeur (0,9 → 0,76 → 0,74 → 0,55 → 0,43). Le
sol `.iso-sol` est un carré de 760 tourné `rotateX(58deg) rotateZ(-45deg)` ; les
dalles `.iso-dalle` (ordinateurs) y reposent avec une hauteur `--z` ; les
téléphones `.iso-tel` et les étiquettes `.iso-tag` reçoivent la rotation
inverse, donc se redressent. Le sol déborde du bloc (un carré tourné de 45°
fait 1 075 px de large) : **`.hero { overflow: hidden }` est obligatoire**,
c'est lui qui empêche le défilement horizontal sur téléphone. Les positions
sont écrites en `style=""` dans le HTML de chaque page, pas dans le CSS.

**Les écrans qui changent de page** (`.ecran-rot[data-pages]`, script
`site.js`) : l'image de base reste toujours affichée ; toutes les 5,2 s
(décalées d'un cadre à l'autre) la suivante est préchargée puis, sur le
chemin riche, posée par-dessus en fondu avant de devenir la base ; sur le
chemin sobre, la base change simplement de fichier, sans transition. Un
écran figé ne peut donc jamais être vide. Les listes de pages sont dans
`data-pages`, images dans `src/assets/img/` (ordinateur 960 × 1500,
téléphone 390 × 1702, WebP).

**Les règles de production, non négociables** (héritées de Molière et de
Prépa 600) :

- **l'état statique du HTML est l'état final** : aucun contenu ne dépend
  d'une transition ni d'une animation ; les compteurs portent leur valeur
  finale dans le HTML et le script la restitue à la fin ;
- **le chemin riche n'existe qu'à partir de 1024 px, avec une souris, sans
  `prefers-reduced-motion`** : lévitation des dalles, fondus, révélations,
  défilement des planches au survol. En dessous : rien ne bouge, sauf le
  changement de page des écrans, par remplacement instantané ;
- les classes `.rv` / `.in` de révélation sont posées par le script, sur ce
  chemin seulement, et **retirées 900 ms après** ; un balayage global retire
  tout ce qui resterait à 6 s ;
- grilles en `minmax(0, …)` ou `minmax(min(100%, Npx), 1fr)` ;
  `padding-top` / `padding-bottom` séparés sur tout ce qui porte `.wrap` ;
- menu téléphone en `display:none` ↔ `display:flex`, jamais en opacité ;
  `<noscript>` le rend visible sans script ;
- jamais de `&nbsp;` dans un très gros titre.

Les images de partage (`outils/og.py`) reprennent la scène : sol quadrillé en
3D à droite, deux étiquettes vert nuit dont les chiffres viennent de
`faits.json`. Les icônes sont un losange vert sur menthe.

---

## 5. Ce qui a été décidé le 4 septembre 2026 (les réponses d'Anthony)

1. **Projet phare** : la plateforme de l'Institut Molière, avec une page
   entière qui dit qu'il a fait tout le site et toute la plateforme —
   **sans le mot « CTO »**. Prépa 600 en seconde preuve. Le contenu vient
   de son texte LinkedIn (expérience « Institut Molière », rédigé le même
   jour) et des passations des deux projets ; chaque affirmation a été
   retrouvée dans le code avant d'être écrite.
2. **Prix** : plateforme « selon l'activité, un fixe par élève ou par
   membre actif, ou un forfait, fixé après un premier échange » ; site
   vitrine **de 500 à 1 250 €, nom de domaine et hébergement compris** ;
   **l'offre data est retirée**.
3. **Reversal Engine reste**, refait dans la DA ; MLbet et SolverBet
   disparaissent.
4. **Hébergement : GitHub Pages, on ne change pas** (pas de Vercel, pas de
   formulaire serveur : contact par e-mail et LinkedIn).
5. **Claude Code est nommé**, « toujours sur les modèles les plus
   performants du marché » — dans la méthode, la page Molière, le pied.
6. **Aucun numéro WhatsApp tunisien** sur le site.
7. **Aucune réalisation à part Prépa 600 et l'Institut Molière** (les sites
   vitrines freelance ne sont pas montrés).
8. **Référencement soigné**, il déclare le site lui-même dans la Search
   Console.

---

## 6. Ce qui reste à Anthony

1. **Search Console** : ajouter la propriété `agalgolab.com` (validation
   DNS chez Porkbun) et soumettre `https://agalgolab.com/sitemap.xml`.
2. Après le premier déploiement, vérifier dans GitHub → Settings → Pages que
   le domaine `agalgolab.com` est toujours déclaré et **Enforce HTTPS**
   coché (le `CNAME` dans `public/` le maintient, mais un coup d'œil ne
   coûte rien).
3. **LinkedIn** : mettre `https://agalgolab.com/institut-moliere/` en
   « Sélection », avec titre et description écrasés (voir la session
   Molière du 04/09).
4. Relire la version anglaise sur téléphone.
5. Les captures des deux sites datent du **4 septembre 2026** : les
   reprendre quand leurs accueils changent (`outils/capturer.py`, puis les
   convertir comme dans `_archives/` — la recette est dans le journal
   ci-dessous).

---

## 7. Pièges connus

- **Heredoc et antislashs** : sur cette machine, un heredoc Bash avale les
  `\b` et les chemins Windows en `\U…` font planter Python. Écrire les
  scripts dans un fichier, utiliser des barres obliques.
- **Edge headless depuis Bash n'écrit rien** : `capturer.py` et `og.py` se
  lancent depuis PowerShell.
- **Une seule charge lourde à la fois** : les deux scripts refusent de partir
  si un autre Edge headless ou un ffmpeg tourne.
- **`git rm --cached`** : les anciennes images de la V1 (12 Mo de PNG) sont
  encore dans l'historique git — c'est normal, le dépôt pèse ~55 Mo.
- Le panneau navigateur de Claude Code, quand il est masqué, rapporte
  `innerWidth = 0` : tout `matchMedia("(min-width: …)")` y échoue, donc le
  chemin riche y paraît désactivé à tort — c'est le banc d'essai idéal du
  chemin sobre, pas du riche.

---

## 8. Journal

- **04/09/2026** — Refonte complète (V3). Décisions ci-dessus. Le dossier
  `projets\agalgolab\` devient le clone du dépôt Pages ; la V1 et la V2 sont
  archivées. Générateur bilingue, gabarit, DA « Carnet de labo » (remplacée le jour même par « Isométrique », voir §4), cinq pages,
  faits chiffrés avec sources, outils de vérification et de capture, images
  de partage. Captures des deux plateformes prises le jour même (Edge
  headless, 1280 et 504 px, converties en WebP à 960 et 390 px de large
  avec Pillow, qualité 82). Mise en ligne par `main`.
- **04/09/2026 (soir)** — La DA « Carnet de labo » est rejetée (orange « comme
  Claude », serif). Seize maquettes plus tard, Anthony choisit la composition
  **isométrique** : elle est appliquée à tout le site, avec les écrans qui
  changent de page. Au passage, la vérification a attrapé la dérive des
  chiffres de Prépa 600 (l'autre session y a ajouté un septième blanc dans la
  journée : 630 questions, 28 pages, 16 fonctions, 42 sous-tests au vert) —
  `faits.json` mis à jour, les textes « cinq blancs » remplacés par le
  chiffre `p600.blancs_payants`, `og.py` lit désormais `faits.json`.
