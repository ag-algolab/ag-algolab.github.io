/* AG Algo Lab — script du site.
   Le HTML est déjà dans son état final : ce script n'ajoute que des
   commodités (menu, copie de l'adresse), le changement de page des écrans
   (par simple remplacement partout, en fondu sur grand écran avec souris)
   et, sur ce même chemin riche, un peu de mouvement. Sans lui, rien ne manque. */
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
  Array.prototype.forEach.call(doc.querySelectorAll('[data-copier]'), function (b) {
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

  /* --------------------------------------- les écrans changent de page
     data-pages="a.webp,b.webp,…" sur le conteneur ; l'image de base reste
     toujours affichée. Sur le chemin riche, la suivante se pose par-dessus
     en fondu puis devient la base ; ailleurs, la base change simplement de
     fichier. Un écran figé ne peut donc jamais être vide. */
  var rotations = doc.querySelectorAll('.ecran-rot[data-pages]');
  Array.prototype.forEach.call(rotations, function (boite, index) {
    var pages = boite.getAttribute('data-pages').split(',').map(function (s) { return s.trim(); }).filter(Boolean);
    var base = boite.querySelector('img');
    if (!base || pages.length < 2) return;
    var i = 0;
    var occupe = false;
    var suivante = function () {
      if (occupe || doc.hidden) return;
      i = (i + 1) % pages.length;
      var src = pages[i];
      var pre = new Image();
      occupe = true;
      var poser = function () {
        if (!riche) { base.src = src; occupe = false; return; }
        var calque = doc.createElement('img');
        calque.className = 'img-suivant';
        calque.alt = '';
        calque.width = base.width;
        calque.height = base.height;
        calque.src = src;
        calque.style.transform = base.style.transform;
        boite.appendChild(calque);
        /* deux images posées, puis le fondu */
        setTimeout(function () { calque.classList.add('in'); }, 30);
        setTimeout(function () {
          base.src = src;
          if (calque.parentNode) calque.parentNode.removeChild(calque);
          occupe = false;
        }, 1100);
      };
      pre.onload = poser;
      pre.onerror = function () { occupe = false; };
      pre.src = src;
    };
    setTimeout(function () {
      suivante();
      setInterval(suivante, 5200);
    }, 2600 + (index % 5) * 900);
  });

  if (!riche) return;

  /* ------------------------------------------ planches qui défilent */
  var ecrans = doc.querySelectorAll('.planche-duo .ordi-ecran, .planche-duo .tel-ecran, .planches .ordi-ecran, .planche-tel .tel-ecran');
  Array.prototype.forEach.call(ecrans, function (boite) {
    var cadre = boite.closest('.ordi, .tel') || boite;
    cadre.addEventListener('mouseenter', function () {
      var imgs = boite.querySelectorAll('img');
      if (!imgs.length) return;
      var d = imgs[0].getBoundingClientRect().height - boite.getBoundingClientRect().height;
      if (d <= 0) return;
      Array.prototype.forEach.call(imgs, function (img) {
        img.style.transitionDuration = Math.min(16, Math.max(3, d / 110)) + 's';
        img.style.transform = 'translateY(' + (-d) + 'px)';
      });
    });
    cadre.addEventListener('mouseleave', function () {
      Array.prototype.forEach.call(boite.querySelectorAll('img'), function (img) {
        img.style.transitionDuration = '1.2s';
        img.style.transform = 'translateY(0)';
      });
    });
  });

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

  /* ---------------------------------------------------- compteurs */
  Array.prototype.forEach.call(doc.querySelectorAll('[data-compte]'), function (el) {
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
