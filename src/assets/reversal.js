/* Reversal Engine — le moteur en marche, en simulation à données synthétiques.
   La mécanique est la vraie (une bougie toutes les 15 minutes, un extremum
   local confirmé, un score de confiance, un seuil) ; les prix et les scores
   sont générés ici, de façon déterministe, et ne sont pas des résultats.
   Une première image est dessinée tout de suite, sans animation : si le
   navigateur gèle l'animation, le graphique reste complet. */
(function () {
  'use strict';
  var wrap = document.getElementById('moteur');
  if (!wrap) return;
  var canvas = wrap.querySelector('canvas');
  var boite = wrap.querySelector('.moteur-graph');
  var flux = document.getElementById('flux');
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext('2d');
  if (!ctx) return;
  var reduit = false;
  try { reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { reduit = false; }
  var lang = (document.documentElement.lang || 'fr').slice(0, 2);
  var lire = function (nom, defaut) { return (flux && flux.getAttribute('data-' + nom)) || defaut; };
  var txt = {
    bas: lire('bas', 'Retournement bas'),
    haut: lire('haut', 'Retournement haut'),
    envoye: lire('envoye', 'signal Telegram envoyé · ordre transmis'),
    muet: lire('muet', 'sous le seuil · aucun ordre'),
    conf: lire('conf', 'confiance')
  };

  /* ---------------------------------------------- générateur déterministe */
  var graine = 20260904;
  function alea() { graine = (graine * 1664525 + 1013904223) % 4294967296; return graine / 4294967296; }
  var bougies = [], prix = 148.4, tendance = 0.35, compteur = 0, minute = 9 * 60;
  function generer() {
    if (alea() < 0.07) tendance = -tendance * (0.6 + alea() * 0.9);
    tendance += (alea() - 0.5) * 0.12;
    tendance = Math.max(-1.2, Math.min(1.2, tendance));
    var o = prix, d = tendance * (0.4 + alea() * 0.8) + (alea() - 0.5) * 1.4, c = o + d;
    var h = Math.max(o, c) + alea() * 0.8, l = Math.min(o, c) - alea() * 0.8;
    prix = c; compteur += 1; minute += 15;
    return { o: o, h: h, l: l, c: c, i: compteur, t: minute };
  }
  function pousser(b) { bougies.push(b); if (bougies.length > 90) bougies.shift(); }

  /* --------------------------- détection : à la clôture de la bougie même
     La force du moteur est d'annoncer le retournement AU MOMENT où il se
     produit, pas quatre bougies plus tard : la dernière bougie fait le plus
     bas (ou le plus haut) des sept dernières et clôture du côté du rebond
     — le signal part tout de suite, et la tendance suivante lui donne
     raison (c'est une simulation : elle est écrite pour ça). */
  var signaux = [], dernierSignal = -99;
  function detecter() {
    var L = bougies.length;
    if (L < 8) return null;
    var p = bougies[L - 1];
    if (p.i - dernierSignal < 6) return null;
    var bas = true, haut = true;
    for (var j = L - 7; j < L - 1; j++) {
      if (bougies[j].l <= p.l) bas = false;
      if (bougies[j].h >= p.h) haut = false;
    }
    var amplitude = Math.max(0.01, p.h - p.l);
    if (bas && (p.c - p.l) / amplitude < 0.45) bas = false;
    if (haut && (p.h - p.c) / amplitude < 0.45) haut = false;
    if (!bas && !haut) return null;
    var conf = 0.62 + alea() * 0.34;
    var sig = { i: p.i, type: bas ? 'bas' : 'haut', prix: bas ? p.l : p.h, conf: conf, age: Math.floor(alea() * 100), t: p.t, envoye: conf >= 0.75 };
    signaux.push(sig);
    if (signaux.length > 14) signaux.shift();
    dernierSignal = p.i;
    /* le marché suit : la tendance part dans le sens annoncé */
    tendance = (bas ? 1 : -1) * (0.45 + conf * 0.7);
    return sig;
  }
  for (var k = 0; k < 64; k++) { pousser(generer()); detecter(); }

  /* ------------------------------------------------ le flux de signaux */
  function heure(t) { var hh = Math.floor(t / 60) % 24, mm = t % 60; return (hh < 10 ? '0' : '') + hh + ':' + (mm < 10 ? '0' : '') + mm; }
  function carte(sig) {
    if (!flux) return;
    var el = document.createElement('div');
    el.className = 'signal neuf ' + sig.type + (sig.envoye ? '' : ' muet');
    var conf = lang === 'fr' ? sig.conf.toFixed(2).replace('.', ',') : sig.conf.toFixed(2);
    el.innerHTML = '<i>' + (sig.type === 'bas' ? '▲' : '▼') + '</i><div><b>' +
      (sig.type === 'bas' ? txt.bas : txt.haut) + ' · SOL/USDC · ' + heure(sig.t) + '</b><span>' +
      txt.conf + ' ' + conf + ' · ' + (sig.envoye ? txt.envoye : txt.muet) + '</span></div>';
    flux.insertBefore(el, flux.firstChild);
    while (flux.children.length > 4) flux.removeChild(flux.lastChild);
    setTimeout(function () { el.classList.remove('neuf'); }, 800);
  }

  /* -------------------------------------------------------- le dessin */
  var W = 0, H = 0, dpr = 1, VISIBLES = 48;
  var courante = null, cible = null, progression = 0;
  function taille() {
    dpr = Math.min(2, window.devicePixelRatio || 1);
    var r = boite.getBoundingClientRect();
    W = Math.max(280, Math.round(r.width)); H = Math.max(300, Math.round(r.height));
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function arrondi(x, y, w, h, r) {
    ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }
  function dessiner() {
    ctx.clearRect(0, 0, W, H);
    var fond = ctx.createLinearGradient(0, 0, 0, H); fond.addColorStop(0, '#08160F'); fond.addColorStop(1, '#040E09');
    ctx.fillStyle = fond; ctx.fillRect(0, 0, W, H);
    var pad = { l: 14, r: 66, t: 48, b: 30 };
    var liste = bougies.slice(-VISIBLES);
    if (courante) liste.push(courante);
    var min = Infinity, max = -Infinity;
    for (var i = 0; i < liste.length; i++) { if (liste[i].l < min) min = liste[i].l; if (liste[i].h > max) max = liste[i].h; }
    var marge = (max - min) * 0.18 || 1; min -= marge; max += marge;
    var pas = (W - pad.l - pad.r) / VISIBLES;
    var glisse = courante ? progression : 0;
    var X = function (idx) { return pad.l + (idx + 1 - glisse) * pas - pas / 2; };
    var Y = function (v) { return pad.t + (max - v) / (max - min) * (H - pad.t - pad.b); };
    /* grille et échelle */
    ctx.strokeStyle = 'rgba(110,231,183,.09)'; ctx.lineWidth = 1; ctx.setLineDash([2, 7]);
    ctx.font = '500 9px JetBrains Mono, monospace'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    for (var g = 0; g <= 4; g++) {
      var yy = pad.t + (H - pad.t - pad.b) * g / 4;
      ctx.beginPath(); ctx.moveTo(pad.l, yy); ctx.lineTo(W - pad.r, yy); ctx.stroke();
      ctx.fillStyle = 'rgba(143,199,169,.75)'; ctx.fillText((max - (max - min) * g / 4).toFixed(1), W - pad.r + 8, yy);
    }
    ctx.setLineDash([]);
    /* la fenêtre de détection : les huit dernières bougies */
    var x0 = X(Math.max(0, liste.length - 9)), x1 = X(liste.length - 1) + pas / 2;
    var fen = ctx.createLinearGradient(x0, 0, x1, 0); fen.addColorStop(0, 'rgba(110,231,183,0)'); fen.addColorStop(1, 'rgba(110,231,183,.12)');
    ctx.fillStyle = fen; ctx.fillRect(x0, pad.t - 8, x1 - x0, H - pad.t - pad.b + 16);
    /* la ligne lissée, avec sa lueur */
    ctx.save(); ctx.shadowColor = 'rgba(110,231,183,.55)'; ctx.shadowBlur = 10; ctx.strokeStyle = 'rgba(110,231,183,.5)'; ctx.lineWidth = 1.5; ctx.beginPath();
    for (var m = 0; m < liste.length; m++) {
      var somme = 0, n = 0;
      for (var w = Math.max(0, m - 7); w <= m; w++) { somme += liste[w].c; n++; }
      var xm = X(m), ym = Y(somme / n);
      if (m === 0) ctx.moveTo(xm, ym); else ctx.lineTo(xm, ym);
    }
    ctx.stroke(); ctx.restore();
    /* les bougies */
    for (var b = 0; b < liste.length; b++) {
      var c = liste[b], x = X(b), monte = c.c >= c.o, col = monte ? '#6EE7B7' : '#FCD34D';
      ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(x, Y(c.h)); ctx.lineTo(x, Y(c.l)); ctx.stroke();
      var y1 = Y(Math.max(c.o, c.c)), y2 = Y(Math.min(c.o, c.c));
      ctx.globalAlpha = c === courante ? 0.7 : 0.92;
      ctx.fillRect(x - pas * 0.3, y1, pas * 0.6, Math.max(1.5, y2 - y1));
      ctx.globalAlpha = 1;
    }
    /* les retournements */
    for (var sg = 0; sg < signaux.length; sg++) {
      var sig = signaux[sg], idx = -1;
      for (var f = 0; f < liste.length; f++) if (liste[f].i === sig.i) { idx = f; break; }
      if (idx < 0) continue;
      var xs = X(idx), ys = Y(sig.prix) + (sig.type === 'bas' ? 16 : -16);
      var cs = !sig.envoye ? '#8FC7A9' : (sig.type === 'bas' ? '#6EE7B7' : '#FCD34D');
      if (sig.envoye) {
        var pulse = (sig.age % 110) / 110;
        ctx.strokeStyle = cs; ctx.globalAlpha = 1 - pulse; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(xs, ys, 5 + pulse * 20, 0, Math.PI * 2); ctx.stroke(); ctx.globalAlpha = 1;
      }
      ctx.save(); ctx.fillStyle = cs; ctx.shadowColor = cs; ctx.shadowBlur = sig.envoye ? 14 : 0;
      ctx.beginPath(); ctx.arc(xs, ys, 4.5, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      var etiquette = (sig.type === 'bas' ? '▲ ' : '▼ ') + Math.round(sig.conf * 100) + ' %';
      ctx.font = '600 10px JetBrains Mono, monospace';
      var tw = ctx.measureText(etiquette).width + 14, ty = sig.type === 'bas' ? ys + 11 : ys - 29;
      var xe = Math.max(pad.l + tw / 2, Math.min(W - pad.r - tw / 2, xs));
      ctx.fillStyle = 'rgba(6,19,13,.92)'; ctx.strokeStyle = cs; ctx.lineWidth = 1;
      arrondi(xe - tw / 2, ty, tw, 18, 5); ctx.fill(); ctx.stroke();
      ctx.fillStyle = cs; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(etiquette, xe, ty + 9);
    }
    /* le dernier prix */
    var dernier = liste[liste.length - 1].c, yl = Y(dernier);
    ctx.setLineDash([4, 5]); ctx.strokeStyle = 'rgba(236,253,245,.4)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(pad.l, yl); ctx.lineTo(W - pad.r, yl); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = '#ECFDF5'; arrondi(W - pad.r + 3, yl - 9, 58, 18, 4); ctx.fill();
    ctx.fillStyle = '#06130D'; ctx.font = '700 10px JetBrains Mono, monospace'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillText(dernier.toFixed(2), W - pad.r + 9, yl);
    /* l'horloge de la bougie en formation */
    if (courante) {
      var cx = pad.l + 10, cy = pad.t - 12;
      ctx.strokeStyle = 'rgba(110,231,183,.25)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, 6, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = '#6EE7B7'; ctx.beginPath(); ctx.arc(cx, cy, 6, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * Math.min(1, progression)); ctx.stroke();
      ctx.fillStyle = '#8FC7A9'; ctx.font = '500 9px JetBrains Mono, monospace'; ctx.textAlign = 'left';
      ctx.fillText(Math.min(15, Math.round(15 * progression)) + ' / 15 min · ' + heure(courante.t), cx + 12, cy);
    }
  }

  /* ---------------------------------------------------------- la vie */
  taille(); dessiner();
  if (reduit || !window.requestAnimationFrame) return;
  var derniere = 0, DUREE = 1500, saute = false;
  function ease(t) { return 1 - Math.pow(1 - t, 3); }
  function boucle(ts) {
    window.requestAnimationFrame(boucle);
    if (document.hidden) { derniere = ts; return; }
    if (W < 700) { saute = !saute; if (saute) return; }
    if (!derniere) derniere = ts;
    var dt = Math.min(80, ts - derniere); derniere = ts;
    if (!courante) {
      cible = generer();
      courante = { o: cible.o, h: cible.o, l: cible.o, c: cible.o, i: cible.i, t: cible.t };
      progression = 0;
    }
    progression += dt / DUREE;
    var e = ease(Math.min(1, progression));
    var bruit = Math.sin(progression * 23) * (cible.h - cible.l) * 0.12 * (1 - e);
    courante.c = cible.o + (cible.c - cible.o) * e + bruit;
    courante.h = Math.max(courante.h, courante.c, cible.o + (cible.h - cible.o) * e);
    courante.l = Math.min(courante.l, courante.c, cible.o - (cible.o - cible.l) * e);
    if (progression >= 1) {
      pousser(cible); courante = null;
      var sig = detecter();
      if (sig) carte(sig);
    }
    for (var s = 0; s < signaux.length; s++) signaux[s].age += 1;
    dessiner();
  }
  window.requestAnimationFrame(boucle);
  var minuterie = null;
  window.addEventListener('resize', function () {
    clearTimeout(minuterie);
    minuterie = setTimeout(function () { taille(); dessiner(); }, 120);
  });
})();
