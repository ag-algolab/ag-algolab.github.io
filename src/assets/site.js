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
        img.style.transition = 'transform ' + Math.min(40, Math.max(4, d / 220)) + 's linear';
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
            boite.style.setProperty('--duree', Math.min(60, Math.max(8, d / 110)) + 's');
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
