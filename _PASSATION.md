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
| Le site en ligne | https://agalgolab.com (anglais, langue principale) et https://agalgolab.com/fr/ (français) |
| Le dépôt | GitHub `ag-algolab/ag-algolab.github.io`, branche `main`, **public** |
| Le code en local | `C:\Users\antho\projets\agalgolab\` |
| L'hébergement | **GitHub Pages**, déployé par `.github/workflows/deploy.yml` à chaque push sur `main` |
| Le nom de domaine | Porkbun ; enregistrements A vers les quatre adresses de GitHub Pages (185.199.108–111.153) ; `public/CNAME` porte `agalgolab.com` |
| Les sources | `src/` — le gabarit, les pages, les faits, les assets |
| Ce qui est servi | `public/` — **généré**, jamais modifié à la main |
| Les outils | `outils/` — construire, vérifier, capturer (Edge headless), capturer_cdp (Edge piloté : clic, défilement, téléphone), rafraichir (toutes les captures des deux sites, CHAQUE SEMAINE), images de partage |
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
dix pages (cinq en anglais à la racine, cinq en français sous `/fr/`), le
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
Les pages se lisent à `http://localhost:8873/`, `/fr/`, `/institut-moliere/`…

### Capturer

```
python outils/capturer.py --site http://localhost:8873      # depuis PowerShell
```

Dix pages × deux largeurs (1280 et 504) dans `_travail/captures/`, une
instance d'Edge à la fois. ⚠️ **Depuis PowerShell** : lancé depuis Bash,
Edge n'écrit rien. ⚠️ Le headless plafonne à **504 px** de large : c'est la
capture « téléphone », et l'absence de débordement à 375 px se prouve par
mesure dans le navigateur, pas par capture.

**Les options de `capturer_cdp.py` ajoutées le 05/09** : `--clic` est
**répétable** (les clics partent dans l'ordre, 2,2 s entre chacun) et vise
d'abord une correspondance **exacte** du texte, sinon « Français » tombait sur
le menu « Communication ▼ français · anglais » ; `--echelle N` fixe la densité
de pixels et `--tactile` émule le doigt sans changer de navigateur (c'est le
couple qui fabrique une tablette : `--largeur 820 --hauteur 1180 --echelle 2
--tactile`) ; `--depuis` vise désormais **le plus petit élément visible**
portant le texte — il tombait sinon sur un conteneur haut de toute la page, ou
sur une région d'annonce invisible, et la capture démarrait à 0.

`python outils/rafraichir.py --reconvertir` refabrique tous les WebP depuis
les PNG déjà capturés, **sans ouvrir Edge** : c'est ce qu'il faut lancer après
avoir changé une largeur ou une qualité d'image.

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

Pour mettre à jour, un seul geste :

```bash
python outils/recompter.py          # recompte les dépôts et réécrit faits.json
python outils/recompter.py --lire   # affiche les écarts sans rien écrire
```

Il recompte les écrans, les routes d'API, les migrations, les tables, les
lignes de TypeScript, les pages, les fonctions serveur, les blancs, les
questions, les sous-tests et les commits ; il écrit la valeur **et la date du
relevé** ; il affiche les écarts. `verifier.py` recompte avec **le même code**
(il importe `recompter.mesurer`) et refuse la mise en ligne au moindre écart :
les deux ne peuvent pas diverger. Ce qui ne se recompte pas d'ici (dates,
prix, décisions) reste écrit à la main dans `faits.json`.

Trois définitions, parce qu'un chiffre affiché doit être vrai au mot près :

- un **écran** de Molière = un `page.tsx` de `src/app`, **hors pages de
  travail** (`demo-*` : reliée nulle part, `robots noindex`). D'où 71, et
  non 72 : `demo-boutons` est un banc d'essai, pas un écran.
- un **blanc** de Prépa 600 = un test **complet** de 90 items ; celui qui est
  en cours d'écriture ne compte pas encore (la banque a gagné le blanc 13
  pendant le lot 5, entre deux commandes).
- `p600.sous_tests` n'est écrit que parce que `marketing/verifier_lot.py
  --tous` passe : **78 sur 78 au vert le 05/09**, relancé ce jour-là.

La date du dernier recomptage est elle-même un fait (`total.releve`) : les
mentions « comptés dans les dépôts le … » et le dernier jalon de la frise
Molière la lisent, donc elles ne vieillissent pas toutes seules.

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

**La scène isométrique** (`.iso`) : un bloc de 760 × 760 dessiné à l'échelle 1
puis réduit par `--k` selon la largeur (0,84 → 0,78 → 0,71 → 0,65 → 0,8 en une
colonne → 0,62 → 0,46 → 0,42 sous 360 px). Le sol `.iso-sol` est un carré de
1 100 tourné `rotateX(58deg) rotateZ(-45deg)`, avec `perspective: 2400px` sur
la scène : ce qui est devant est plus grand, sans qu'on l'écrive. Le
quadrillage n'est PAS peint sur le sol mais dans un enfant `.iso-grille`
(60 px, plus une ligne forte tous les 300) — **un masque sur le sol lui-même
l'aplatirait** (`mask` force `transform-style: flat`) et les écrans
retomberaient collés au sol. Le sol déborde du bloc : **`.hero { overflow:
hidden }` est obligatoire**, c'est lui qui empêche le défilement horizontal
sur téléphone.

**Le héros : six écrans POSÉS SUR LA GRILLE** (Anthony, 05/09 au soir : « la
grille doit servir d'endroit où les sites sont posés… ils se relèvent un petit
peu puis redescendent, pas tous au même moment… ils doivent être parallèles et
perpendiculaires aux lignes de la grille, dans les deux sens »). Les
`.iso-dalle` sont donc **des enfants du sol** : ils héritent de son
orientation. La moitié reçoit en plus `.travers` (`rotateZ(90deg)`), d'où les
deux directions. Chaque dalle est placée par son CENTRE (`left`/`top` +
`translate(-50%, -50%)`), en pixels du sol : la hauteur réelle du cadre ne
déplace donc rien. Trois rangs de deux, du fond vers l'avant : les tarifs de
Prépa 600 et **l'administration Molière** (capture d'Anthony, **seuls les noms
d'élèves floutés** — il a demandé le 05/09 que les chiffres restent nets,
« c'est celui qui est le plus loin à droite, on ne le verra pas même en
zoomant »), le tableau de bord élève et la page de la plateforme, l'accueil
Prépa 600 et l'accueil Molière (le plus grand, devant).

**La lévitation** : chaque dalle porte `--z` (hauteur au repos, 16 à 34 px),
`--l` (amplitude, 22 à 30), `--d` (durée, 7,6 à 11,2 s) et `--r` (retard
négatif) — d'où le décalage entre elles. L'ombre est portée par la dalle
elle-même (`::before`, z = 0, donc **sur la grille**) pendant que l'écran
s'élève : c'est ce décalage qui fait la lévitation. Hors chemin riche, chaque
écran reste posé à sa hauteur `--z`, rien ne bouge.

**Comment les positions sont vérifiées** : un écran tourné en 3D n'a pas de
rectangle, il a un quadrilatère. On insère quatre marqueurs de taille nulle
aux quatre coins de chaque `.ordi`, on lit leur `getBoundingClientRect()` (la
projection exacte, perspective comprise), et on teste l'intersection par axes
séparateurs, plus la distance à la colonne de texte, au bandeau des chiffres
et aux bords de la fenêtre. Mesuré à 1 440, 1 280, 1 200, 1 199, 1 140, 1 024,
960, 900, 390 et 320 px : aucune intersection, jamais rien hors de la fenêtre,
16 px au moins avec la colonne de texte. **Les paliers de `--k` viennent de
là** : la scène doit tenir entre le texte et le bord.

**Le bandeau des chiffres passe au-dessus de la grille** (`.stats` et
`.hero-txt` en `position: relative; z-index: 2`, la scène en `z-index: 0`) :
un élément positionné se peint sinon par-dessus le contenu en flux, et la
grille traversait le bandeau vert nuit.

**Les vitrines qui déroulent** (`.vitrine`, `.defile`, script `site.js`) :
un ordinateur montre la page ENTIÈRE (`<nom>-full.webp`, 800 px de large) ;
avec une souris, la page défile de haut en bas tant qu'on est dessus et
revient en haut quand on part ; sans souris, elle défile toute seule,
doucement, tant qu'elle est à l'écran. Un téléphone est posé à côté, **devant
le bord de l'ordinateur, toujours au-dessus** — sauf quand la souris est
sur l'ordinateur, où celui-ci passe devant (`.ordi-devant`). L'état
statique est le haut de la page. **Le téléphone montre LA MÊME page d'accueil
que l'ordinateur** (Anthony, 05/09 : « il faut que ce soit la même, pour voir
comment ça s'adapte au téléphone ») ; `capturer_cdp.py` fait défiler toute la
page avant de photographier, sinon les images chargées à la demande
manquent dans le bas (c'était le cas à partir d'« Écoles françaises »).

**Les cadres doivent se voir** (Anthony, 05/09 : « c'est vraiment blanc sur
blanc, on se doute au niveau de la forme, mais ça ne fait pas encore vrai ») :
la barre du navigateur `.ordi-barre` est teintée (`#CBE3D7`, pastilles à 30 %
d'encre), et **le téléphone `.tel` comme la tablette `.tablette` ont un corps
sombre** (`--nuit`). Trois cadres, trois silhouettes reconnaissables sans
lire. La tablette est le troisième : mêmes proportions que la capture
(41 / 59), et elle défile au survol comme les deux autres (`site.js` cherche
`.ordi, .tel, .tablette`).

**Les quatre écrans de la page Molière** (le carrousel, choisi par Anthony le
05/09) : le **test de niveau COMMENCÉ** sur téléphone — on clique « Français »
et on photographie la première question, « pour montrer à quoi ressemble le
test » ; **l'inscription sur TABLETTE** — « c'est beaucoup plus lisible,
sinon c'est vraiment compliqué de le lire » ; **l'espace élève** ; et **la
candidature de "Enseigner"** sur ordinateur avec trois réponses cochées —
c'est l'état sélectionné qu'il veut montrer, pas le formulaire vide. Sont
sortis : la page « la plateforme » et l'accueil sur téléphone, déjà présents
ailleurs. Ces trois nouveautés sont des **zones** de `rafraichir.py` : elles
se refont donc toutes les semaines comme le reste.

Le 05/09 au soir, quatre corrections sur ce carrousel : **plus de carte
blanche autour des appareils** (« ça ne sert à rien que tu mettes quatre
rectangles blancs »), juste l'appareil et **son nom centré dessous**, sans
sous-description ; les appareils sont **alignés par le bas**
(`.carrousel { align-items: end }`) ; l'ordre commence par la tablette et
**finit par le téléphone du test** ; et surtout les trois captures descendent
**jusqu'au bas de la page** (`--long 30000`), parce que l'intérêt est de voir
la fin — « ce qui est impressionnant, c'est de voir qu'il y a même le RIB ».
Le défilement au survol a été accéléré de moitié (`d / 380` au lieu de
`d / 220`, 22 s au plus) : on le croyait figé.

**Les coordonnées bancaires de l'institut sont floutées avant la photo**
(`--masquer "Titulaire" "Banque :" "RIB :" "IBAN"` dans `rafraichir.py`) :
elles sont publiques sur la page d'inscription de l'institut, mais elles
n'ont rien à faire sur un site vitrine. Le floutage se fait **par le texte**,
jamais par des coordonnées de rectangle, qui vieilliraient à la première
mise à jour de la page.

**Les trois pastilles de la barre du navigateur sont rouge, ambre et verte**
(05/09) : grises, elles ne disaient pas « fenêtre ».

**La netteté des grandes vitrines** : sur la page de cas, l'écran de
l'ordinateur fait **1 038 px de large**. Les images de page entière étaient
en 800 px, donc agrandies, donc floues (« elle est floue, donc ce n'est pas
top »). Elles sont maintenant en **1 100 px, qualité 70** — l'accueil Molière
pèse 451 Ko au lieu de 311. Mesurer avant de choisir une résolution :
`getBoundingClientRect()` sur `.ordi-ecran` de la page concernée.

**Les captures se rafraîchissent CHAQUE SEMAINE** (`python outils/rafraichir.py`
depuis PowerShell) : les deux sites évoluent, et la vitrine doit montrer
leur état réel. `construire.py` relit la taille de chaque image à la
construction, donc une capture plus longue ne casse rien.

**La méthode en serpentin** (`.serpentin`, `[data-serpentin]` dans `site.js`) :
un chemin en S descend au centre, les cinq titres sont posés dessus, les
contenus alternent à gauche et à droite (`.serp-etape.droite`). Le chemin est
un `<path>` SVG calculé d'après les positions réelles des nœuds (courbes de
Bézier, amplitude ±80 px proportionnelle à la longueur du segment, ±10 px
sur téléphone où il devient une ligne à 22 px du bord). **État statique :
tout est dessiné et tous les nœuds sont allumés** (classe `passe` dans le
HTML). Sur le chemin riche seulement, le script cache le trait
(`stroke-dasharray` = longueur) et le dessine au défilement : la progression
est la position d'une ligne à 72 % de la hauteur de l'écran dans le bloc, et
chaque nœud s'allume quand elle le dépasse. Le texte de l'étape 1, « La
vision », porte le positionnement d'Anthony : il ne code pas ce qu'on lui
dicte, il revient avec le produit que le client n'avait pas dessiné.

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
- jamais de `&nbsp;` dans un très gros titre — une seule exception, mesurée à
  320 px : « plateformes&nbsp;web » dans le H1 français, pour que les deux
  mots restent sur la même ligne (demande d'Anthony du 05/09).

Les images de partage (`outils/og.py`) existent **par page et par langue**
(`og-<nom>-fr.png` et `og-<nom>-en.png`, six fichiers ; `image_partage()` dans
`construire.py` choisit la bonne) : le logo AG, le slogan « La vision, le
produit, la mise en ligne » / « The vision, the product, the launch », deux
étiquettes vert nuit dont les chiffres viennent de `faits.json`.

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

Ajouté le 5 septembre 2026 (ses retours du soir et de la nuit) :

9. **L'anglais est la langue principale, à la racine** ; le français sous
   `/fr/`. Les anciennes adresses `/en/…` (indexables une journée) renvoient
   vers la racine par une page `noindex` + `canonical` + `meta refresh`.
10. **Un slogan à la place de son nom** en étiquette du héros — « Anthony
    Gocmen · fondateur d'AG Algo Lab » lui paraissait « ultra narcissique » :
    « La vision, le produit, la mise en ligne. »
11. **La méthode doit montrer sa vision et sa créativité**, pas « un
    développeur qui développe ce qu'on lui dit mot pour mot » : le titre de
    la section et l'étape 1 le disent, le dialogue de l'étape 1 le montre.
12. **Jamais la Tunisie**, nulle part (`grep -ri tunis src/` doit rendre
    zéro) ; « développeur full-stack indépendant » interdit ; Master
    Dauphine sans dates ; jamais le mot « CTO ».
13. **Reversal Engine : le score apparaît sur la bougie du retournement
    même**, pas trois bougies plus tard (« toute la force de l'engin c'est de
    prédire ») ; la simulation fait ensuite partir la tendance dans le sens
    annoncé, et le dit.

Ajouté le 5 septembre 2026 (deuxième soirée) :

14. **Les écrans sont posés sur la grille**, alignés sur ses lignes dans les
    deux sens, en lévitation décalée — plus de cartes de face (§4).
15. **Le bandeau des quatre chiffres passe au-dessus de la grille** : on ne
    doit pas voir le quadrillage le traverser.
16. **Les chiffres du tableau de bord d'administration ne sont plus floutés**
    (seuls les noms d'élèves le restent : ce sont des personnes réelles).
17. **Le simulateur et le test de niveau sortent du héros** (« très moche ») :
    la page des tarifs de Prépa 600 et la page de la plateforme Molière les
    remplacent.
18. **Le trio de chiffres de l'Institut Molière ne dit plus les commits** :
    écrans, routes d'API, **tables en base**. Et les chiffres affichés sont
    recomptés pour de bon (§3) : 71 écrans, pas 72.

Ajouté le 6 septembre 2026 :

19. **Les cadres doivent se lire** : navigateur teinté, téléphone et tablette
    sombres (§4).
20. **Les grandes vitrines ne doivent pas être floues** : images de page
    entière en 1 100 px.
21. **Le carrousel de la page Molière** : test commencé (téléphone),
    inscription (tablette), espace élève, candidature « Enseigner » avec des
    réponses cochées.
22. **L'espace élève doit défiler d'un écran à l'autre au survol** (« le petit
    truc jaune du menu de gauche change ») — EN ATTENTE : il faut un compte
    élève, et je ne crée pas de compte ni ne saisis de mot de passe. Anthony
    doit fournir les captures, ou ouvrir une session dans un navigateur que je
    pilote. Voir §6.

Ajouté le 6 septembre 2026 (soir) :

23. **Carrousel sans cartes** : l'appareil, son nom centré dessous, rien
    d'autre. Ordre : tablette, espace élève, candidature, test (téléphone).
24. **Les écrans déroulent la page entière**, et deux fois plus vite.
25. **Les chiffres de la page Molière** : ni commits (« on s'en fout ») ni
    migrations — écrans, routes d'API, tables en base, lignes de TypeScript,
    automatisations, espaces.
26. **« Début août »**, pas « mi-août » ; la phrase se termine par la date
    réelle de mise en ligne, qui vient de `faits.json`.

---

## 6. Ce qui reste à Anthony

0. **Chaque semaine** : `python outils/rafraichir.py` (PowerShell), puis
   `construire.py`, `verifier.py`, commit, push — les captures des deux
   sites doivent montrer leur état réel.

1. **Les écrans de l'espace élève** (demandé le 05/09, redemandé le soir) :
   la carte « espace élève » doit passer d'une page à l'autre au survol,
   toutes les 3 secondes, par un glissement de la droite vers la gauche —
   coach, mes cours, calendrier, bibliothèque, dictées, calcul mental,
   échecs, concours, progression, niveau. Il faut donc une capture par page
   de `/eleve`, **et il faut être connecté**.
   ⚠️ **Je ne saisis pas de mot de passe et je ne crée pas de compte** —
   Anthony a proposé un compte d'essai, je ne m'en sers pas. Deux façons de
   débloquer : il prend les captures lui-même (« Démo espace élève » dans
   l'administration, une par page, fenêtre de 1 280 px), ou il ouvre la
   session lui-même dans un Edge dont je réutilise le profil / dans un Chrome
   relié à l'extension. Le mécanisme d'affichage reste à écrire (une vingtaine
   de lignes : `.ecrans` + un minuteur au survol, sur le chemin riche).

1. **Search Console** : ajouter la propriété `agalgolab.com` (validation
   DNS chez Porkbun) et soumettre `https://agalgolab.com/sitemap.xml`.
2. Après le premier déploiement, vérifier dans GitHub → Settings → Pages que
   le domaine `agalgolab.com` est toujours déclaré et **Enforce HTTPS**
   coché (le `CNAME` dans `public/` le maintient, mais un coup d'œil ne
   coûte rien).
3. **LinkedIn** : mettre `https://agalgolab.com/institut-moliere/` en
   « Sélection », avec titre et description écrasés (voir la session
   Molière du 04/09).
4. Relire les deux versions sur téléphone : l'anglaise (la racine,
   désormais) et la française (`/fr/`).
5. Les captures des deux sites datent du **5 septembre 2026 (nuit)** ; le
   point 0 les tient à jour. La capture de l'administration Molière
   (`moliere-admin.webp`) ne vient pas de `rafraichir.py` : c'est sa capture
   d'écran floutée, à refaire à la main si l'administration change.

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
- **L'onglet caché du panneau ne défile pas et ne rend pas** : `scrollTo`
  n'y bouge rien, ni `scroll` ni `requestAnimationFrame` n'y sont délivrés,
  et les captures d'écran expirent. Pour tester une mécanique au défilement,
  remplacer `getBoundingClientRect` du bloc par une fonction qui renvoie la
  position voulue et envoyer `new Event('scroll')` (c'est ainsi que le
  serpentin a été validé), ou photographier en Edge headless avec
  `capturer_cdp.py --depuis "un texte"`.
- **Les chiffres Prépa 600 bougent plusieurs fois par jour** (la banque de
  questions grossit pendant qu'on travaille ici) : quand `verifier.py`
  refuse, relancer les deux scripts de mise à jour (§3) et reconstruire,
  sans discuter.
- **`mask` ou `filter` aplatit une scène 3D** : appliqué au sol, le masque du
  quadrillage annulait `transform-style: preserve-3d` et les écrans
  retombaient à plat dessus. Peindre la grille dans un enfant.
- **Un élément positionné se peint par-dessus le contenu en flux**, même
  écrit avant lui : c'est pour ça que la grille passait sur le bandeau des
  chiffres. `position: relative; z-index` sur ce qui doit rester devant.
- **La première image d'une page manque une fois sur deux dans les captures**
  (Anthony, 05/09 : « la photo de l'atelier de communication au tout début »).
  `capturer_cdp.py` descend puis **remonte par paliers** (les observateurs de
  visibilité se déclenchent dans les deux sens), repasse toutes les images en
  `loading="eager"`, attend qu'aucune ne soit incomplète, et prévient s'il en
  manque encore.
- **Le serveur local** est déclaré dans le `launch.json` de la session
  Claude Code du dossier `PycharmProjects\Youtube`, pas dans ce dépôt :
  `python -m http.server 8873 --directory C:/Users/antho/projets/agalgolab/public`.

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
- **04/09/2026 (nuit)** — Deuxième lot après la mise en ligne, sur les
  retours d'Anthony : **le logo AG** (récupéré transparent dans l'historique
  git de la V1, `src/assets/img/logo-ag.png`, icônes et image de partage
  refaites avec) ; **sa photo pro** (« Photo de profil pro.jpg » de ses
  Téléchargements) ; **héros statiques** — les cadres ne changent plus de
  page (« ça fait cheap, ce n'est qu'un aperçu »), plus d'étiquettes de
  chiffres dans la scène, et **le téléphone posé sur le coin avant de chaque
  cadre** (`.iso-tel-sur`, coin bas-gauche de la dalle : c'est lui qui est
  devant une fois le sol tourné de −45°). Les trois cadres montrent l'accueil
  Molière, l'accueil Prépa 600 et le **tableau de bord de l'espace élève**
  (capture d'écran d'Anthony, `moliere-eleve.webp`) ; les téléphones montrent
  le **formulaire d'inscription Molière après le choix « première fois »**
  et les **trois fuites de points** de Prépa 600 — deux captures prises
  avec `outils/capturer_cdp.py`, un nouvel outil qui pilote Edge par son
  protocole de débogage (clic, défilement, émulation téléphone). **Reversal
  Engine refait** : un moteur animé sur canvas (`src/assets/reversal.js`,
  bougies de 15 min qui se forment, extremum confirmé, score, seuil, flux de
  signaux), première image dessinée sans animation, simulation clairement
  annoncée. SEO : `robots`, `og:image:alt`, `rel="me"`, logo et portrait
  dans les données structurées, fil d'Ariane sur toutes les pages.
  Fluidité : courbes d'accélération, lévitation à 9 s, cartes qui se
  soulèvent au survol ; téléphone : boutons pleine largeur, chiffres sur deux
  colonnes. `verifier.py` compte désormais les balises ouvertes et fermées —
  c'est un `</div>` manquant qui avait fait disparaître la scène des pages de
  cas. Les chiffres Prépa 600 ont encore bougé dans la journée (810
  questions, 9 blancs, 54 sous-tests au vert) : `faits.json` suit.
- **05/09/2026 (nuit)** — Troisième lot, sur les retours d'Anthony du soir :
  « développeur full-stack indépendant » supprimé partout (c'est
  rabaissant : il fait bien plus) → **fondateur d'AG Algo Lab** ; le
  Master Dauphine sans dates ; **le héros ne bouge plus**, trois ordinateurs
  et deux téléphones sans aucun chevauchement (mesuré) ; les cas montrent
  d'abord le visuel : **vitrine pleine largeur** avec la page ENTIÈRE qui
  déroule au survol et le téléphone posé à côté, devant le bord ; **carrousel
  d'écrans** (test de niveau en premier, inscription après « première fois »,
  tableau de bord élève…), **onglets** pour les quatre espaces, texte réduit
  de moitié ; **méthode interactive** en cinq étapes cliquables avec un
  visuel par étape ; `outils/rafraichir.py` photographie les deux sites en
  entier, ordinateur et téléphone, et `construire.py` relit les dimensions
  des images. La banque Prépa 600 a atteint 900 questions dans la nuit
  (10 blancs, 60 sous-tests au vert) : suivie.
- **05/09/2026 (matin)** — Quatrième lot, sur ses retours de la nuit.
  **L'anglais devient la langue de la racine** et le français passe sous
  `/fr/` (`LANGUES = ("en", "fr")`, `image_partage()`, `x-default` vers
  l'anglais, 404 en anglais, redirections `/en/…` → racine). **Slogan** à la
  place de son nom dans le héros. **Héros refait** : six écrans face au
  visiteur en trois rangs de profondeur, sans téléphone, dont sa capture de
  l'administration Molière **floutée** (noms, pastilles, tuiles, liste des
  élèves, axe du graphique) et placée le plus loin ; aucun chevauchement
  mesuré à 1 280, 499, 375 et 320 px. **Vitrines** : le téléphone montre la
  même page d'accueil que l'ordinateur, et `capturer_cdp.py` fait défiler
  toute la page avant la photo (les images paresseuses manquaient sous
  « Écoles françaises »). **Méthode en serpentin** : chemin SVG en S calculé
  sur les positions réelles, dessiné au défilement sur le chemin riche,
  complet et allumé partout ailleurs ; contenus réécrits autour de la vision
  (étape 1 « La vision »). **Reversal Engine** : le signal part à la clôture
  de la bougie du retournement (plus bas / plus haut des sept dernières et
  clôture du côté du rebond), la tendance simulée suit. H1 français :
  « plateformes&nbsp;web » insécable, corps réduit. `og.py` produit six
  images (trois pages × deux langues). Pied : cibles tactiles des liens à
  30 px. `rafraichir.py` relancé : toutes les captures des deux sites datent
  de cette nuit. Prépa 600 a encore grossi pendant le lot (990 puis 1 080
  questions, 12 blancs, 72 sous-tests au vert) : `faits.json` suit, le
  vérificateur a refusé deux fois avant. Assets en `?v=5`.
- **05/09/2026 (nuit)** — Lot 5, ses retours du soir. La grille redevient un
  sol : les six écrans y sont **posés**, alignés sur ses lignes dans les deux
  sens, et lévitent chacun à sa hauteur et à son rythme ; le bandeau des
  chiffres passe au-dessus ; les positions sont vérifiées par quadrilatères à
  dix largeurs. Le simulateur et le test de niveau quittent le héros au profit
  des tarifs Prépa 600 et de la plateforme Molière. Les chiffres du tableau de
  bord d'administration redeviennent nets, seuls les noms d'élèves sont
  floutés. Nouveau `outils/recompter.py` : les chiffres se recomptent et se
  réécrivent en une commande, et `verifier.py` partage ce code — au passage,
  **71 écrans et non 72** (une page de travail ne compte pas), 44 tables en
  base à la place des commits dans le trio Molière, 13 blancs et 1 170
  questions pour Prépa 600, 78 sous-tests sur 78 au vert. Captures des deux
  sites refaites avec l'attente des images renforcée. Assets en `?v=6`.
- **05/09/2026 (fin de matinée)** — Lot 6, ses retours sur la page Molière. Le carrousel montre
  quatre écrans choisis : le test de niveau commencé (téléphone), l'inscription
  sur tablette, l'espace élève, la candidature « Enseigner » avec des réponses
  cochées. Nouveau cadre `.tablette`, et les trois cadres reçoivent du
  contraste (barre teintée, corps sombres). Les images de page entière passent
  à 1 100 px : la vitrine de la page de cas fait 1 038 px de large, elle était
  floue. `capturer_cdp.py` gagne les clics multiples, la correspondance exacte,
  `--echelle`, `--tactile`, et un `--depuis` qui vise le plus petit élément
  visible ; `rafraichir.py` gagne trois zones et `--reconvertir`. Reste en
  attente : les captures de l'espace élève, qui demandent une session.
- **05/09/2026 (midi)** — Lot 7. Le carrousel de la page Molière perd ses
  cartes blanches : les appareils, alignés par le bas, avec leur nom centré
  dessous. Les trois captures descendent jusqu'au bas de la page et le
  défilement au survol est deux fois plus vif. Les coordonnées bancaires de
  l'institut sont floutées à la capture, par leur texte. Pastilles rouge,
  ambre, verte. Les chiffres de la page Molière perdent les commits et les
  migrations au profit des tables en base et des automatisations. « Début
  août ». Assets en `?v=8`. Reste en attente : les écrans de l'espace élève.
