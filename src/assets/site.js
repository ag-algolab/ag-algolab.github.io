/* AG Algo Lab — script du site.
   Le HTML est déjà dans son état final : ce script n'ajoute que des
   commodités (menu, copie de l'adresse) et, sur grand écran avec une souris,
   un peu de mouvement. Sans lui, rien ne manque. */
(function () {
  'use strict';
  var doc = document;

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
  var boutons = doc.querySelectorAll('[data-copier]');
  Array.prototype.forEach.call(boutons, function (b) {
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

  /* --------------------------------------------------- chemin riche ? */
  var riche = false;
  try {
    riche = window.matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) { riche = false; }
  if (!riche) return;

  /* ------------------------------------------ planches qui défilent */
  var ecrans = doc.querySelectorAll('.ordi-ecran, .tel-ecran');
  Array.prototype.forEach.call(ecrans, function (boite) {
    var img = boite.querySelector('img');
    if (!img) return;
    var cadre = boite.closest('.ordi, .tel') || boite;
    cadre.addEventListener('mouseenter', function () {
      var d = img.getBoundingClientRect().height - boite.getBoundingClientRect().height;
      if (d <= 0) return;
      img.style.transitionDuration = Math.min(16, Math.max(3, d / 110)) + 's';
      img.style.transform = 'translateY(' + (-d) + 'px)';
    });
    cadre.addEventListener('mouseleave', function () {
      img.style.transitionDuration = '1.2s';
      img.style.transform = 'translateY(0)';
    });
  });

  /* --------------------------------------------------- révélations
     Seuls les blocs encore sous la ligne de flottaison reçoivent .rv ; la
     classe est retirée 900 ms après la révélation, et un balayage global
     retire tout ce qui resterait au bout de 6 s. */
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
    var io = new IntersectionObserver(function (entrees) {
      entrees.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); nettoyer(en.target); }
      });
    }, { rootMargin: '0px 0px -6% 0px' });
    observes.forEach(function (el) { io.observe(el); });
    setTimeout(function () {
      Array.prototype.forEach.call(doc.querySelectorAll('.rv'), function (el) { el.classList.remove('rv'); el.classList.remove('in'); });
    }, 6000);
  }

  /* ---------------------------------------------------- compteurs
     Le chiffre final est déjà écrit dans le HTML ; on le remet à zéro juste
     avant d'animer, en setInterval (les minuteries tournent même quand rien
     ne s'affiche), et on restitue le texte d'origine à la fin. */
  var compteurs = doc.querySelectorAll('[data-compte]');
  Array.prototype.forEach.call(compteurs, function (el) {
    var origine = el.textContent;
    var chiffres = origine.replace(/[^0-9]/g, '');
    if (!chiffres) return;
    var cible = parseInt(chiffres, 10);
    if (!cible || cible < 10) return;
    var lang = (doc.documentElement.lang || 'fr').slice(0, 2);
    var format = function (n) {
      var s = String(n);
      var out = '';
      while (s.length > 3) { out = (lang === 'fr' ? ' ' : ',') + s.slice(-3) + out; s = s.slice(0, -3); }
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
