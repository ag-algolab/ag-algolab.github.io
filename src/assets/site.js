/* AG Algo Lab — script du site.
   Le HTML est déjà dans son état final : ce script n'ajoute que des
   commodités (menu, copie de l'adresse, onglets, carrousels), le déroulé
   des pages dans les vitrines (au survol avec une souris, tout seul sans),
   et, sur grand écran avec souris, un peu de mouvement. Sans lui, rien ne
   manque : chaque vitrine montre le haut de sa page. */
(function () {
  'use strict';
  var doc = document;
  var chaque = function (sel, fn, racine) { Array.prototype.forEach.call((racine || doc).querySelectorAll(sel), fn); };

  /* ------------------------------------------------------------- menu */
  var burger = doc.querySelector('.burger');
  var nav = doc.getElementById('nav');
  if (burger && nav) {
    burger.addEventListener('click', function () {
      var ouvert = nav.classList.toggle('ouvert');
      burger.setAttribute('aria-expanded', ouvert ? 'true' : 'false');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a') && nav.classList.contains('ouvert')) {
        nav.classList.remove('ouvert');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ------------------------------------------------ copier l'adresse */
  chaque('[data-copier]', function (b) {
    var texte = b.textContent;
    b.addEventListener('click', function () {
      var valeur = b.getAttribute('data-copier');
      var fini = function (ok) {
        b.textContent = ok ? b.getAttribute('data-fait') : b.getAttribute('data-rate');
        setTimeout(function () { b.textContent = texte; }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(valeur).then(function () { fini(true); }, function () { fini(false); });
      } else {
        fini(false);
      }
    });
  });

  /* ------------------------------------------------------------ onglets */
  chaque('[data-onglets]', function (bloc) {
    var onglets = bloc.querySelectorAll('.onglet');
    var panneaux = bloc.querySelectorAll('.panneau');
    var choisir = function (i) {
      Array.prototype.forEach.call(onglets, function (o, j) { o.setAttribute('aria-selected', i === j ? 'true' : 'false'); });
      Array.prototype.forEach.call(panneaux, function (p, j) { p.classList.toggle('actif', i === j); });
    };
    Array.prototype.forEach.call(onglets, function (o, i) { o.addEventListener('click', function () { choisir(i); }); });
  });

  /* --------------------------------------------------------- carrousels */
  chaque('[data-carrousel]', function (bloc) {
    var piste = bloc.querySelector('.carrousel');
    var av = bloc.querySelector('[data-avant]'), ap = bloc.querySelector('[data-apres]');
    if (!piste) return;
    var pas = function () { var c = piste.firstElementChild; return c ? c.getBoundingClientRect().width + 18 : 300; };
    if (av) av.addEventListener('click', function () { piste.scrollBy({ left: -pas(), behavior: 'smooth' }); });
    if (ap) ap.addEventListener('click', function () { piste.scrollBy({ left: pas(), behavior: 'smooth' }); });
  });

  /* --------------------------------------------------- chemin riche ? */
  var riche = false, souris = false, reduit = false;
  try {
    souris = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    riche = window.matchMedia('(min-width: 1024px)').matches && souris && !reduit;
  } catch (e) { riche = false; }

  /* ------------------------------------------- les vitrines qui déroulent
     Avec une souris : la page défile quand on est dessus, revient en haut
     quand on part. Sans souris : elle défile toute seule, doucement, tant
     qu'elle est à l'écran. L'état statique est le haut de la page. */
  var distance = function (boite) {
    var img = boite.querySelector('img');
    if (!img) return 0;
    return Math.max(0, img.getBoundingClientRect().height - boite.getBoundingClientRect().height);
  };
  chaque('.defile', function (boite) {
    var img = boite.querySelector('img');
    if (!img) return;
    if (souris && !reduit) {
      var cadre = boite.closest('.ordi, .tel, .tablette') || boite;
      cadre.addEventListener('mouseenter', function () {
        var d = distance(boite);
        if (d <= 0) return;
        // vitesse : une page entière descend en une vingtaine de secondes au plus.
        // À d / 220 c'était deux fois trop lent, on croyait l'image figée.
        img.style.transition = 'transform ' + Math.min(20, Math.max(6, d / 300)) + 's linear';
        img.style.transform = 'translateY(' + (-d) + 'px)';
      });
      cadre.addEventListener('mouseleave', function () {
        img.style.transition = 'transform 1.2s cubic-bezier(.2,.7,.2,1)';
        img.style.transform = 'translateY(0)';
      });
    } else if (!reduit && 'IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entrees) {
        entrees.forEach(function (en) {
          if (en.isIntersecting) {
            var d = distance(boite);
            if (d <= 0) return;
            boite.style.setProperty('--d', (-d) + 'px');
            boite.style.setProperty('--duree', Math.min(30, Math.max(6, d / 230)) + 's');
            boite.classList.add('auto');
          } else {
            boite.classList.remove('auto');
          }
        });
      }, { threshold: 0.2 });
      io.observe(boite);
    }
  });
  /* l'ordinateur passe devant le téléphone quand la souris est dessus */
  chaque('.vitrine', function (v) {
    var ordi = v.querySelector('.vitrine-ordi');
    if (!ordi || !souris) return;
    ordi.addEventListener('mouseenter', function () { v.classList.add('ordi-devant'); });
    ordi.addEventListener('mouseleave', function () { v.classList.remove('ordi-devant'); });
  });

  /* --------------------------------------------- le manège des écrans
     Quatre écrans posés sur un cercle vu de trois quarts : celui de devant
     est grand et net, les autres s'éloignent, rapetissent et s'assombrissent.
     On le fait tourner au doigt, à la souris, aux flèches ou aux points ;
     laissé tranquille et visible, il avance d'un cran toutes les cinq
     secondes. Tout est projeté ici, en 2D : position, échelle et ordre de
     peinture viennent de la profondeur — aucun preserve-3d, donc aucune
     surprise de navigateur. Le script ne tourne (requestAnimationFrame) que
     pendant un mouvement ; au repos, seul le balancement CSS des côtés vit.
     Sans script ou avec « réduire le mouvement » : la table de deux sur
     deux reste telle quelle. */
  chaque('[data-anneau]', function (bloc) {
    if (reduit) return;
    var pieces = Array.prototype.filter.call(bloc.children, function (e) { return e.classList.contains('carte-ecran'); });
    var n = pieces.length;
    if (n < 3) return;
    var pas = 360 / n;
    var fr = (doc.documentElement.lang || 'en').slice(0, 2) === 'fr';
    bloc.classList.add('anneau');
    chaque('img', function (img) { img.setAttribute('draggable', 'false'); }, bloc);
    bloc.insertAdjacentHTML('afterbegin',
      '<svg class="anneau-sol" aria-hidden="true" focusable="false"><defs><radialGradient id="anneau-lueur" cx="50%" cy="50%" r="50%">' +
      '<stop offset="0" stop-color="#10B981" stop-opacity=".26"/><stop offset=".65" stop-color="#10B981" stop-opacity=".1"/>' +
      '<stop offset="1" stop-color="#10B981" stop-opacity="0"/></radialGradient></defs>' +
      '<path class="disque" d="M0 0"/><path class="cercle-2" d="M0 0"/><path class="cercle" d="M0 0"/>' +
      pieces.map(function () { return '<circle class="ancre" r="3.5"/>'; }).join('') + '</svg>');
    var sol = bloc.firstElementChild;
    var ancres = sol.querySelectorAll('.ancre');
    var legendes = pieces.map(function (p) { var l = p.querySelector('.leg'); return l ? l.textContent.trim() : ''; });
    var cmd = doc.createElement('div');
    cmd.className = 'anneau-cmd';
    cmd.innerHTML = '<button type="button" class="anneau-btn" data-sens="1" aria-label="' + (fr ? 'Écran précédent' : 'Previous screen') + '">‹</button><div class="anneau-points">' +
      legendes.map(function (l, i) { return '<button type="button" class="anneau-point" data-i="' + i + '" aria-label="' + l.replace(/"/g, '&quot;') + '"></button>'; }).join('') +
      '</div><button type="button" class="anneau-btn" data-sens="-1" aria-label="' + (fr ? 'Écran suivant' : 'Next screen') + '">›</button>';
    var leg = doc.createElement('p');
    leg.className = 'anneau-leg'; leg.setAttribute('aria-live', 'polite');
    bloc.parentNode.insertBefore(cmd, bloc.nextSibling);
    bloc.parentNode.insertBefore(leg, cmd.nextSibling);
    pieces.forEach(function (p, i) { p.style.setProperty('--bd', (4.6 + i * .7) + 's'); p.style.setProperty('--br', (-i * 1.3) + 's'); });

    /* la géométrie : R le rayon du cercle, F la distance de l'œil, pente
       l'inclinaison du cercle (0 = vu de face, 1 = vu du dessus), y0 la
       ligne du centre du cercle. Tout est en pixels du bloc. */
    var W = 0, R = 0, F = 0, pente = 0, y0 = 0, dims = [], base = 0, devant = -1;
    var proj = function (a, r) {
      var X = r * Math.sin(a), Z = r * Math.cos(a), s = F / (F - Z);
      return [W / 2 + X * s, y0 + Z * pente * s, s, Z];
    };
    var tracerSol = function () {
      var pts = [], pts2 = [], k;
      for (k = 0; k <= 72; k++) { var a = k * 5 * Math.PI / 180; pts.push(proj(a, R)); pts2.push(proj(a, R * .8)); }
      var chemin = function (ps) { return 'M' + ps.map(function (q) { return q[0].toFixed(1) + ' ' + q[1].toFixed(1); }).join('L') + 'Z'; };
      sol.setAttribute('viewBox', '0 0 ' + W + ' ' + (bloc.clientHeight || 1));
      sol.querySelector('.disque').setAttribute('d', chemin(pts));
      sol.querySelector('.cercle').setAttribute('d', chemin(pts));
      sol.querySelector('.cercle-2').setAttribute('d', chemin(pts2));
    };
    var mesurer = function () {
      W = bloc.clientWidth || 1;
      var etroit = W < 700;
      // R + la demi-largeur d'un ordinateur (.18 W) doit tenir dans W/2, sinon
      // la pièce de côté est rognée par le bord du bloc (mesuré : 23 px à .34)
      R = W * (etroit ? .36 : .32); F = 4 * R;
      // l'inclinaison : assez forte sur grand écran pour que la pièce du fond
      // dépasse au-dessus de celle de devant — à .25 elle était cachée derrière
      pente = etroit ? .26 : .5;
      pieces.forEach(function (p) {
        var k = p.classList.contains('carte-tel') ? (etroit ? .21 : .135) : p.classList.contains('carte-tab') ? (etroit ? .30 : .19) : (etroit ? .56 : .36);
        p.style.width = Math.round(W * k) + 'px';
      });
      dims = pieces.map(function (p) { return { w: p.offsetWidth, h: p.offsetHeight }; });
      // la hauteur du bloc : la pièce la plus haute, à la place où elle monte le plus
      var haut = Infinity, i, j;
      for (i = 0; i < n; i++) for (j = 0; j < n; j++) {
        var q = proj(j * pas * Math.PI / 180, R);
        haut = Math.min(haut, q[3] * pente * q[2] - dims[i].h * q[2]);
      }
      y0 = 12 - haut;
      bloc.style.height = Math.round(y0 + R * pente * F / (F - R) + 28) + 'px';
      tracerSol();
    };
    var minLeg = null;
    var marquer = function () {
      chaque('.anneau-point', function (b) { b.setAttribute('aria-current', Number(b.getAttribute('data-i')) === devant ? 'true' : 'false'); }, cmd);
      leg.classList.add('change');
      clearTimeout(minLeg);
      minLeg = setTimeout(function () { leg.textContent = legendes[devant]; leg.classList.remove('change'); }, 220);
    };
    var poser = function () {
      var iDevant = 0, zMax = -Infinity;
      pieces.forEach(function (p, i) {
        var q = proj((base + i * pas) * Math.PI / 180, R), s = q[2], Z = q[3];
        p.style.transform = 'translate(' + (q[0] - W / 2 - dims[i].w / 2).toFixed(1) + 'px,' + (q[1] - dims[i].h).toFixed(1) + 'px) scale(' + s.toFixed(4) + ')';
        p.style.zIndex = String(Math.round(1000 + Z));
        var prof = 1 - (Z / R + 1) / 2;
        p.style.setProperty('--voile', (prof * .34).toFixed(3));
        p.style.setProperty('--amp', Z > R * .92 ? '0' : '1');
        if (Z > zMax) { zMax = Z; iDevant = i; }
        if (ancres[i]) { ancres[i].setAttribute('cx', q[0].toFixed(1)); ancres[i].setAttribute('cy', q[1].toFixed(1)); }
      });
      if (iDevant !== devant) { devant = iDevant; marquer(); }
    };

    /* tourner : d'un angle à l'autre, en décélérant */
    var anim = null;
    var tourner = function (cible) {
      if (anim) cancelAnimationFrame(anim);
      var depart = base, delta = cible - depart, t0 = null;
      if (Math.abs(delta) < .01) { base = cible; poser(); return; }
      var duree = Math.min(900, 380 + Math.abs(delta) * 3.2);
      var etape = function (t) {
        if (t0 === null) t0 = t;
        var u = Math.min(1, (t - t0) / duree), e = 1 - Math.pow(1 - u, 3);
        base = depart + delta * e; poser();
        anim = u < 1 ? requestAnimationFrame(etape) : null;
      };
      anim = requestAnimationFrame(etape);
    };
    var cran = function () { return Math.round(base / pas) * pas; };
    var vers = function (i) {
      var d = ((-i * pas - base) % 360 + 540) % 360 - 180;
      tourner(base + d);
    };

    /* tout seul : un cran toutes les cinq secondes, visible, sans souris
       dessus, et six secondes après le dernier geste */
    var visible = false, survol = false, tire = false, dernier = 0, minuterie = null;
    var armer = function () {
      clearTimeout(minuterie);
      if (!visible || doc.hidden) return;
      minuterie = setTimeout(function () {
        if (!survol && !tire && Date.now() - dernier > 6000) tourner(cran() - pas);
        armer();
      }, 4800);
    };
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { es.forEach(function (en) { visible = en.isIntersecting; armer(); }); }, { threshold: .25 }).observe(bloc);
    }
    doc.addEventListener('visibilitychange', armer);
    if (souris) {
      bloc.addEventListener('mouseenter', function () { survol = true; });
      bloc.addEventListener('mouseleave', function () { survol = false; });
    }

    /* les gestes : flèches, points, glisser, toucher une pièce de côté */
    cmd.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      dernier = Date.now();
      if (b.hasAttribute('data-i')) vers(Number(b.getAttribute('data-i')));
      else tourner(cran() + Number(b.getAttribute('data-sens')) * pas);
    });
    var x0 = 0, base0 = 0, bouge = false, touche = null;
    bloc.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      tire = true; bouge = false; x0 = e.clientX; base0 = base; dernier = Date.now();
      touche = e.target.closest('.carte-ecran');
      if (anim) { cancelAnimationFrame(anim); anim = null; }
      bloc.classList.add('tire');
      try { bloc.setPointerCapture(e.pointerId); } catch (err) { /* rien */ }
    });
    bloc.addEventListener('pointermove', function (e) {
      if (!tire) return;
      var dx = e.clientX - x0;
      if (Math.abs(dx) > 5) bouge = true;
      if (bouge) { base = base0 + dx / W * 180; poser(); }
    });
    var lacher = function () {
      if (!tire) return;
      tire = false; bloc.classList.remove('tire'); dernier = Date.now();
      var i = (!bouge && touche) ? pieces.indexOf(touche) : -1;
      if (i >= 0 && i !== devant) vers(i); else tourner(cran());
    };
    bloc.addEventListener('pointerup', lacher);
    bloc.addEventListener('pointercancel', lacher);

    var minR = null;
    window.addEventListener('resize', function () { clearTimeout(minR); minR = setTimeout(function () { mesurer(); poser(); }, 120); });
    mesurer(); poser();
    setTimeout(function () { mesurer(); poser(); }, 600);
  });

  /* ------------------------------------------ le réacteur des automatismes
     Le cœur au centre, les automatismes autour ; chaque fil est tracé
     d'après les positions réelles (offsetTop/offsetLeft : la révélation
     .rv déplace les cartes, pas leur place), et une impulsion y circule —
     animation SVG native, plus aucun script une fois tracé. En colonne,
     sur téléphone : un bus descend à gauche du cœur et dessert chaque
     nœud. Les impulsions sont mises en pause hors de l'écran. */
  chaque('[data-reacteur]', function (bloc) {
    var svg = bloc.querySelector('.reacteur-trace');
    var coeur = bloc.querySelector('.reacteur-coeur');
    var noeuds = bloc.querySelectorAll('.noeud');
    if (!svg || !coeur || !noeuds.length) return;
    var f = function (v) { return v.toFixed(1); };
    var tracer = function () {
      var W = bloc.offsetWidth, H = bloc.offsetHeight;
      svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
      var etroit = window.innerWidth < 900;
      var cx = coeur.offsetLeft + coeur.offsetWidth / 2, cy = coeur.offsetTop + coeur.offsetHeight / 2;
      var cb = coeur.offsetTop + coeur.offsetHeight, cg = coeur.offsetLeft, cd = coeur.offsetLeft + coeur.offsetWidth;
      var xb = 9, dernierY = cb, fils = '', pistes = '', pulses = '';
      var descente = 'M' + f(cx) + ' ' + f(cb) + ' C' + f(cx) + ' ' + f(cb + 26) + ' ' + f(xb) + ' ' + f(cb + 14) + ' ' + f(xb) + ' ' + f(cb + 40);
      Array.prototype.forEach.call(noeuds, function (nd, i) {
        var y1 = nd.offsetTop + nd.offsetHeight / 2, d;
        if (etroit) {
          var branche = 'M' + f(xb) + ' ' + f(y1 - 14) + ' Q' + f(xb) + ' ' + f(y1) + ' ' + f(xb + 14) + ' ' + f(y1) + ' L' + f(nd.offsetLeft) + ' ' + f(y1);
          d = descente + ' L' + f(xb) + ' ' + f(y1 - 14) + branche.slice(branche.indexOf(' Q'));
          fils += '<path class="branche" d="' + branche + '"/>';
          dernierY = y1;
        } else {
          var gauche = nd.offsetLeft < cx;
          var x0 = gauche ? cg : cd, x1 = gauche ? nd.offsetLeft + nd.offsetWidth : nd.offsetLeft, m = (x0 + x1) / 2;
          d = 'M' + f(x0) + ' ' + f(cy) + ' C' + f(m) + ' ' + f(cy) + ' ' + f(m) + ' ' + f(y1) + ' ' + f(x1) + ' ' + f(y1);
          fils += '<path class="branche" d="' + d + '"/>';
        }
        pistes += '<path id="reac-' + i + '" class="piste" d="' + d + '"/>';
        if (!reduit) {
          var debut = (-i * .9).toFixed(1) + 's';
          pulses += '<circle class="halo" r="7"><animateMotion dur="3.6s" begin="' + debut + '" repeatCount="indefinite"><mpath href="#reac-' + i + '"/></animateMotion></circle>' +
            '<circle class="pulse" r="3"><animateMotion dur="3.6s" begin="' + debut + '" repeatCount="indefinite"><mpath href="#reac-' + i + '"/></animateMotion></circle>';
        }
      });
      if (etroit) fils = '<path class="branche" d="' + descente + ' L' + f(xb) + ' ' + f(dernierY - 14) + '"/>' + fils;
      svg.innerHTML = pistes + fils + pulses;
    };
    tracer();
    var minT = null;
    window.addEventListener('resize', function () { clearTimeout(minT); minT = setTimeout(tracer, 120); });
    setTimeout(tracer, 800);
    if ('IntersectionObserver' in window && svg.pauseAnimations) {
      new IntersectionObserver(function (es) {
        es.forEach(function (en) { if (en.isIntersecting) svg.unpauseAnimations(); else svg.pauseAnimations(); });
      }, { threshold: 0 }).observe(bloc);
    }
  });

  /* ------------------------------------------- la méthode, en serpentin
     Le chemin passe par le nœud de chaque étape ; il est calculé d'après
     les positions réelles. Sur grand écran avec souris il se dessine au
     défilement et allume les nœuds au passage ; ailleurs il est dessiné
     d'un bloc et tous les nœuds sont allumés. */
  chaque('[data-serpentin]', function (bloc) {
    var svg = bloc.querySelector('.serpentin-trace');
    var fond = svg && svg.querySelector('.fond');
    var trait = svg && svg.querySelector('.trait');
    var etapes = bloc.querySelectorAll('.serp-etape');
    if (!svg || !fond || !trait || !etapes.length) return;
    var noeuds = [], longueur = 0;
    var tracer = function () {
      var r = bloc.getBoundingClientRect();
      var W = Math.round(r.width), H = Math.round(r.height);
      svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
      svg.setAttribute('width', W); svg.setAttribute('height', H);
      var etroit = window.innerWidth < 900;
      noeuds = Array.prototype.map.call(etapes, function (e) {
        var t = e.querySelector('.serp-titre');
        var b = t.getBoundingClientRect();
        var cx = etroit ? (b.left - r.left + 22) : (b.left - r.left + b.width / 2);
        var cy = etroit ? (b.top - r.top + 15) : (b.top - r.top + 9);
        return { x: cx, y: cy };
      });
      var d = 'M ' + noeuds[0].x + ' 0 L ' + noeuds[0].x + ' ' + noeuds[0].y;
      var swing = etroit ? 10 : 80;
      for (var i = 1; i < noeuds.length; i++) {
        var a = noeuds[i - 1], b2 = noeuds[i];
        var s = (i % 2 ? 1 : -1) * swing * Math.min(1, (b2.y - a.y) / 640);
        var y1 = a.y + (b2.y - a.y) * 0.38, y2 = a.y + (b2.y - a.y) * 0.62;
        d += ' C ' + (a.x + s) + ' ' + y1 + ', ' + (b2.x - s) + ' ' + y2 + ', ' + b2.x + ' ' + b2.y;
      }
      d += ' L ' + noeuds[noeuds.length - 1].x + ' ' + H;
      fond.setAttribute('d', d); trait.setAttribute('d', d);
      longueur = trait.getTotalLength ? trait.getTotalLength() : 0;
      trait.style.strokeDasharray = longueur ? longueur + ' ' + longueur : 'none';
      peindre();
    };
    var progression = 1;
    var peindre = function () {
      if (!longueur) return;
      trait.style.strokeDashoffset = String(longueur * (1 - progression));
      var r = bloc.getBoundingClientRect();
      Array.prototype.forEach.call(etapes, function (e, i) {
        var part = noeuds[i] ? noeuds[i].y / (r.height || 1) : 0;
        e.classList.toggle('passe', progression >= part - 0.02);
      });
    };
    var defiler = function () {
      var r = bloc.getBoundingClientRect();
      var ligne = window.innerHeight * 0.72;
      progression = Math.max(0, Math.min(1, (ligne - r.top) / (r.height || 1)));
      peindre();
    };
    tracer();
    if (riche) {
      progression = 0; peindre(); defiler();
      window.addEventListener('scroll', defiler, { passive: true });
    }
    var minuterieT = null;
    window.addEventListener('resize', function () { clearTimeout(minuterieT); minuterieT = setTimeout(tracer, 120); });
    setTimeout(tracer, 800);
  });

  if (!riche) return;

  /* --------------------------------------------------- révélations */
  if ('IntersectionObserver' in window) {
    var cibles = doc.querySelectorAll('[data-rv]');
    var h = window.innerHeight || 800;
    var observes = [];
    Array.prototype.forEach.call(cibles, function (el) {
      if (el.getBoundingClientRect().top > h * 0.92) { el.classList.add('rv'); observes.push(el); }
    });
    var nettoyer = function (el) {
      setTimeout(function () { el.classList.remove('rv'); el.classList.remove('in'); }, 900);
    };
    var io2 = new IntersectionObserver(function (entrees) {
      entrees.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io2.unobserve(en.target); nettoyer(en.target); }
      });
    }, { rootMargin: '0px 0px -6% 0px' });
    observes.forEach(function (el) { io2.observe(el); });
    setTimeout(function () {
      chaque('.rv', function (el) { el.classList.remove('rv'); el.classList.remove('in'); });
    }, 6000);
  }

  /* ---------------------------------------------------- compteurs */
  chaque('[data-compte]', function (el) {
    var origine = el.textContent;
    var chiffres = origine.replace(/[^0-9]/g, '');
    if (!chiffres) return;
    var cible = parseInt(chiffres, 10);
    if (!cible || cible < 10) return;
    var lang = (doc.documentElement.lang || 'fr').slice(0, 2);
    var format = function (n) {
      var s = String(n);
      var out = '';
      while (s.length > 3) { out = (lang === 'fr' ? ' ' : ',') + s.slice(-3) + out; s = s.slice(0, -3); }
      return s + out;
    };
    var lance = false;
    var animer = function () {
      if (lance) return;
      lance = true;
      var debut = Date.now();
      var duree = 900;
      var minuterie = setInterval(function () {
        var t = Math.min(1, (Date.now() - debut) / duree);
        var e = 1 - Math.pow(1 - t, 3);
        el.textContent = origine.replace(chiffres, format(Math.round(cible * e)));
        if (t >= 1) { clearInterval(minuterie); el.textContent = origine; }
      }, 16);
      setTimeout(function () { clearInterval(minuterie); el.textContent = origine; }, duree + 400);
    };
    if ('IntersectionObserver' in window) {
      var ioc = new IntersectionObserver(function (entrees) {
        entrees.forEach(function (en) { if (en.isIntersecting) { animer(); ioc.unobserve(el); } });
      });
      ioc.observe(el);
    }
  });
})();
