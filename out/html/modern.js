/* =====================================================================
   Bewegung für den Papier-Look (modern.css):
   gleitende Reitermarkierung, Einblenden neuer Szenen, geänderte Werte in der
   Seitenleiste zählen hoch und leuchten kurz auf, Zielringe füllen sich.
   Greift nur über die Seite zu, ändert keine Spielwerte. Respektiert „Bewegung reduzieren“.
   ===================================================================== */
(function () {
  if (typeof document === 'undefined') return;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)');
  var calm = function () { return reduce && reduce.matches; };

  /* ---------- Reitermarkierung ---------- */
  function moveMarker() {
    var box = document.querySelector('.tab_container'); if (!box) return;
    var m = document.getElementById('tab_marker');
    if (!m) { m = document.createElement('span'); m.id = 'tab_marker'; box.appendChild(m); }
    var b = box.querySelector('.tab_button.active'); if (!b) return;
    m.style.left = b.offsetLeft + 6 + 'px';
    m.style.width = Math.max(0, b.offsetWidth - 12) + 'px';
    m.style.top = b.offsetTop + b.offsetHeight - 2 + 'px';
  }

  /* ---------- Werte in der Seitenleiste: hochzählen und aufleuchten ---------- */
  var prev = {};
  var NUM = /(−|-)?\d{1,3}(?:\.\d{3})*(?:,\d+)?|(−|-)?\d+(?:[.,]\d+)?/;
  function parse(t) { var m = String(t).match(NUM); if (!m) return null; return parseFloat(m[0].replace('−', '-').replace(/\.(?=\d{3})/g, '').replace(',', '.')); }
  function tween(node, from, to, text) {
    var dec = (text.match(/[.,](\d+)/) || [0, ''])[1].length, t0 = performance.now();
    var sep = text.indexOf(',') >= 0 ? ',' : '.';
    var shape = function (v) { var s = Math.abs(v).toFixed(dec); if (sep === ',') s = s.replace('.', ','); return text.replace(NUM, (v < 0 ? (text.indexOf('−') >= 0 ? '−' : '-') : '') + s); };
    (function step(now) { var q = Math.min(1, (now - t0) / 800), e = 1 - Math.pow(1 - q, 3); node.textContent = shape(from + (to - from) * e); if (q < 1) requestAnimationFrame(step); else node.textContent = text; })(t0);
  }
  function scanSidebar() {
    var root = document.getElementById('qualities'); if (!root) return;
    var tab = window.statusTab || 'status';
    root.querySelectorAll('p').forEach(function (p) {
      var t = p.textContent, sp = p.querySelector('.mp-num');
      if (sp && sp.dataset.final) t = t.replace(sp.textContent, sp.dataset.final);   // während des Hochzählens zählt der Endwert
      var i = t.indexOf(':'); if (i < 1) return;
      var key = tab + '|' + t.slice(0, i).trim(), valText = t.slice(i + 1).trim(), v = parse(valText);
      var old = prev[key]; prev[key] = {v: v, s: valText};
      if (!old || old.s === valText || calm()) return;
      var last = p.lastChild;
      if (v != null && old.v != null && last && last.nodeType === 3 && last.textContent.trim() === valText) {
        var span = document.createElement('span'); span.className = 'mp-num mp-flash';   // neutral: höher ist nicht immer besser (Arbeitslosigkeit)
        span.dataset.final = valText; p.replaceChild(span, last); span.textContent = valText; tween(span, old.v, v, valText);
      } else {
        p.classList.remove('mp-flash'); void p.offsetWidth; p.classList.add('mp-flash');
      }
    });
  }

  /* ---------- Neu gezogene Karten fallen sanft auf die Hand ---------- */
  var handSeen = null;
  function dealCards() {
    var cards = document.querySelectorAll('.card-in-hand'); if (!cards.length) { return; }
    var now = {};
    cards.forEach(function (c) {
      var k = c.textContent.trim(); now[k] = 1;
      if (handSeen && !handSeen[k] && !calm()) { c.classList.remove('mp-deal'); void c.offsetWidth; c.classList.add('mp-deal'); }
    });
    handSeen = now;
  }

  /* ---------- Zielringe füllen sich; wechselt ein Ziel den Zustand, schimmert die Kachel einmal ---------- */
  var rings = {}, states = {};
  function animateRings() {
    document.querySelectorAll('.sd_goal').forEach(function (g) {
      var k = g.dataset.sdGoal, st = (g.querySelector('.sd_gs') || {}).textContent;
      if (states[k] && states[k] !== st && !calm()) { g.classList.remove('mp-pulse'); void g.offsetWidth; g.classList.add('mp-pulse'); }
      states[k] = st;
    });
    document.querySelectorAll('.sd_goal, .sd_climhead').forEach(function (g, i) {
      var c = g.querySelector('.sd_fg'); if (!c) return;
      var key = (g.dataset.sdGoal || 'clim') + i, to = c.getAttribute('stroke-dashoffset'), from = rings[key];
      rings[key] = to;
      if (calm()) return;
      c.style.strokeDashoffset = from == null ? c.getAttribute('stroke-dasharray') : from;
      requestAnimationFrame(function () { requestAnimationFrame(function () { c.style.strokeDashoffset = to; }); });
    });
  }

  /* ---------- Einblenden neuer Szenen ---------- */
  /* „Weiter …“ und „Continue...“ werden zu „Weiter ⟶“ (Pfeil für die Fortsetzung, wie in alten Magazinen) */
  function arrows(root) {
    /* Endzeichen: am letzten Absatz mit Text vor jeder Auswahl */
    root.querySelectorAll('ul.choices').forEach(function (ul) {
      var p = ul.previousElementSibling;
      while (p && !(p.tagName === 'P' && p.textContent.trim())) p = p.previousElementSibling;
      if (p && !p.classList.contains('mp-end')) p.classList.add('mp-end');
    });
    root.querySelectorAll('ul.choices a').forEach(function (a) {
      if (a.querySelector('.mp-arrow')) return;
      var t = a.textContent.trim();
      /* „Continue...“ ist ein englischer Rest aus der Engine */
      if (/^(Weiter|Continue)\s*(…|\.\.\.)?$/.test(t)) { a.textContent = 'Weiter'; var s = document.createElement('span'); s.className = 'mp-arrow'; s.textContent = '\u27F6'; a.appendChild(s); }
    });
  }
  function watchContent() {
    /* auf den ganzen Körper hören: die Engine kann #content neu anlegen */
    var pending = false;
    new MutationObserver(function (list) {
      var content = document.getElementById('content'); if (!content) return;
      if (!calm()) list.forEach(function (m) { if (m.target !== content) return; m.addedNodes.forEach(function (n) { if (n.nodeType === 1 && !n.classList.contains('mp-enter')) n.classList.add('mp-enter'); }); });
      if (pending) return; pending = true;
      requestAnimationFrame(function () { pending = false; arrows(document.getElementById('content') || document); dealCards(); });
    }).observe(document.body, {childList: true, subtree: true});
    var c = document.getElementById('content'); if (c) arrows(c);
  }

  function watchSidebar() {
    var q = document.getElementById('qualities'); if (!q) return;
    var busy = false;
    new MutationObserver(function () {
      if (busy) return; busy = true;
      requestAnimationFrame(function () { scanSidebar(); animateRings(); moveMarker(); busy = false; });
    }).observe(q, {childList: true, subtree: true});
    var tabs = document.querySelector('.tab_container'), lastTab = window.statusTab;
    if (tabs) new MutationObserver(function () {
      moveMarker();
      if (window.statusTab !== lastTab) {   // Reiter gewechselt: Inhalt weich überblenden
        lastTab = window.statusTab;
        if (!calm()) { q.classList.remove('mp-swap'); void q.offsetWidth; q.classList.add('mp-swap'); }
      }
    }).observe(tabs, {attributes: true, subtree: true, attributeFilter: ['class']});
  }

  function start() { watchContent(); watchSidebar(); moveMarker(); setTimeout(moveMarker, 400); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
  window.addEventListener('resize', moveMarker);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(moveMarker);
})();
