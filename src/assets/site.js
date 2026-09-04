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
      var cadre = boite.closest('.ordi, .tel') || boite;
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

  /* ------------------------------------------- la méthode, pas à pas
     Un clic choisit l'étape ; avec une souris, les étapes s'enchaînent
     toutes seules et s'arrêtent quand la souris est sur le bloc. */
  chaque('[data-etapes]', function (bloc) {
    var etapes = bloc.querySelectorAll('.etape');
    var visuels = bloc.querySelectorAll('.visuel');
    var i = 0, minuterie = null, tempo = 5200;
    var choisir = function (n) {
      i = n;
      Array.prototype.forEach.call(etapes, function (e, j) {
        e.setAttribute('aria-selected', j === n ? 'true' : 'false');
        var barre = e.querySelector('.barre');
        if (barre) { barre.style.transition = 'none'; barre.style.width = '0'; }
      });
      Array.prototype.forEach.call(visuels, function (v, j) { v.classList.toggle('actif', j === n); });
      if (riche) {
        var b = etapes[n].querySelector('.barre');
        if (b) setTimeout(function () { b.style.transition = 'width ' + tempo + 'ms linear'; b.style.width = '100%'; }, 30);
      }
    };
    var suivant = function () { choisir((i + 1) % etapes.length); };
    var lancer = function () { if (!riche) return; clearInterval(minuterie); minuterie = setInterval(suivant, tempo); };
    Array.prototype.forEach.call(etapes, function (e, n) {
      e.addEventListener('click', function () { choisir(n); lancer(); });
    });
    bloc.addEventListener('mouseenter', function () { clearInterval(minuterie); });
    bloc.addEventListener('mouseleave', lancer);
    choisir(0);
    lancer();
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
