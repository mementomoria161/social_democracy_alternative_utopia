/* =====================================================================
   Standort-Modul (übernommen aus „Standort 2030“)
   Rechnet monatlich mit: neun Branchen, Lebensstandard der Mitte, Klimakurs.
   Zeigt die drei Ziele im Status-Reiter und den Reiter „Wirtschaft“ mit Klappmenüs.
   Daten: standort_data.js (erzeugt von tools/import_standort.py). Zustand: Q.sd (wird gespeichert).
   Aufrufe: SD.step(Q) einmal pro Monat aus post_event, SD.renderGoals(Q) und SD.renderEconomy(Q) aus status.
   ===================================================================== */
(function () {
  var D = window.STANDORT_DATA;
  if (!D) return;
  var SD = window.SD = {};

  /* Annahmen: Trend je Branche in % pro Jahr bei normalem Wachstum, Empfindlichkeit für Konjunktur */
  var TREND = {auto: -1.5, maschinen: 0.5, elektro: 0, chemie: -1.0, stahl: -2.5, pharma: 2.0, nahrung: 0, bau: 0.5, digital: 4.0};
  var ELAST = {auto: 1.6, maschinen: 1.5, elektro: 1.4, chemie: 1.3, stahl: 1.8, pharma: 0.4, nahrung: 0.3, bau: 1.2, digital: 0.8};
  var BASE_G = 0.8;        // Wachstum (% p. a.), bei dem die Branchen ihrem Trend folgen
  var ui = {goal: null};   // offene Ziel-Erklärung (nur Anzeige, wird nicht gespeichert)

  function fmt(v, d, sign) {
    var f = Math.pow(10, d || 0); v = Math.round(v * f) / f;
    var s = new Intl.NumberFormat('de-DE', {minimumFractionDigits: d || 0, maximumFractionDigits: d || 0}).format(Math.abs(v));
    return (v < 0 ? '−' : (sign && v > 0 ? '+' : '')) + s;
  }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function el(id) { return typeof document !== 'undefined' ? document.getElementById(id) : null; }

  /* ---------- Zustand ---------- */
  function init(Q) {
    if (Q.sd) return Q.sd;
    var sec = {};
    D.order.forEach(function (k) { sec[k] = {y: 100, yB: 100, emp: D.sectors[k].emp, emp0: D.sectors[k].emp}; });
    Q.sd = {sec: sec, n: 0, life_pol: 0, cut: {energie: 0, gebaeude: 0, verkehr: 0, stahl: 0, chemie: 0}, hist: []};
    record(Q);
    return Q.sd;
  }
  SD.init = init;

  /* Energiepreisindex (Start 100): Annahme, aus der Inflation abgeleitet, solange das Spiel keinen eigenen Wert hat */
  function energyIdx(Q) { return 100 + 4 * ((Q.inflation || 2) - 2); }

  SD.step = function (Q) {
    var s = init(Q); s.n++;
    var g = Q.economic_growth || 0, E = energyIdx(Q);
    D.order.forEach(function (k) {
      var P = D.sectors[k], x = s.sec[k];
      var ann = TREND[k] + ELAST[k] * (g - BASE_G) - P.energy * 6 * (E - 100);
      var dy = ann / 1200;
      x.y *= 1 + dy;
      x.yB *= 1 + TREND[k] / 1200;
      x.emp *= 1 + 0.35 * dy - 0.0006;
    });
    record(Q);
  };

  function record(Q) {
    var s = Q.sd;
    s.hist.push({d: Q.year + '-' + Q.month, L: +life(Q).toFixed(2), em: +emissions(Q).total.toFixed(1), u: Q.unemployed || 0, i: Q.inflation || 0});
    if (s.hist.length > 80) s.hist.shift();
  }

  /* ---------- Lebensstandard: Kaufkraft eines mittleren Haushalts seit Spielbeginn (Annahmen) ----------
     Reallöhne +0,05 % und Mieten samt Nebenkosten −0,067 % je Monat, jeder Prozentpunkt Arbeitslosigkeit −1 %,
     jeder Punkt Inflation über 2 % −0,5 %, dazu Entlastungen aus der Politik (life_pol). */
  function lifeParts(Q) {
    var s = Q.sd, n = s.n;
    return [['Reallöhne', 100 * Math.pow(1.0005, n) - 100], ['Mieten und Nebenkosten', -0.067 * n],
      ['Arbeitslosigkeit', -1.0 * ((Q.unemployed || 6.3) - 6.3)], ['Inflation', -0.5 * ((Q.inflation || 2) - 2)], ['Entlastungen', s.life_pol]];
  }
  function life(Q) { return 100 + lifeParts(Q).reduce(function (a, p) { return a + p[1]; }, 0); }
  SD.life = life;

  /* ---------- Klima: Emissionen im Jahr, Pfad des Klimaschutzgesetzes ---------- */
  function years(Q) { return Q.year + (Q.month - 1) / 12 - 2025.5; }
  function climPath(Q) { return D.clim.y0 - (D.clim.y0 - D.clim.t2030) * years(Q) / 5; }
  function indAvg(s, base) {
    var w = 0, a = 0;
    D.order.forEach(function (k) { var P = D.sectors[k]; if (!P.ind) return; w += P.umsatz; a += P.umsatz * (base ? s.sec[k].yB : s.sec[k].y); });
    return a / w;
  }
  function emissions(Q, base) {
    var s = Q.sd, C = D.clim, t = years(Q), c = base ? {energie: 0, gebaeude: 0, verkehr: 0, stahl: 0, chemie: 0} : s.cut;
    var yS = base ? s.sec.stahl.yB : s.sec.stahl.y, yC = base ? s.sec.chemie.yB : s.sec.chemie.y;
    var o = {
      energie: C.energie * Math.pow(0.96, t) * (1 - c.energie),
      industrie: C.stahl * yS / 100 * (1 - c.stahl) + C.chemie * yC / 100 * (1 - c.chemie) + (C.industrie - C.stahl - C.chemie) * indAvg(s, base) / 100 * Math.pow(0.99, t),
      gebaeude: C.gebaeude * Math.pow(0.985, t) * (1 - c.gebaeude),
      verkehr: C.verkehr * Math.pow(0.99, t) * (1 - c.verkehr),
      rest: (C.y0 - C.energie - C.industrie - C.gebaeude - C.verkehr) * Math.pow(0.995, t)
    };
    o.total = o.energie + o.industrie + o.gebaeude + o.verkehr + o.rest;
    return o;
  }
  SD.emissions = emissions;

  /* ---------- Die drei Ziele ---------- */
  /* Umfrageanteile: nach dem ersten Zug aus post_event, davor aus den Rohwerten (gleiche Formel wie drawPolls in game.js) */
  function shares(Q) {
    var out = {}, P = Q.parties || [];
    if (P.some(function (p) { return Q[p + '_normalized'] != null; })) { P.forEach(function (p) { out[p] = Q[p + '_normalized'] || 0; }); return out; }
    var support = {}, tot = 0;
    (Q.classes || []).forEach(function (c) {
      var cv = 0; P.forEach(function (p) { cv += Math.max(0, Q[c + '_' + p] || 0); });
      P.forEach(function (p) { var sh = cv ? 100 * Math.max(0, Q[c + '_' + p] || 0) / cv : 0; support[p] = (support[p] || 0) + (Q[c] || 0) * (Q.old_demographics ? Math.max(0, Q[c + '_' + p] || 0) : sh); });
    });
    P.forEach(function (p) { tot += support[p] || 0; });
    P.forEach(function (p) { out[p] = tot ? (support[p] || 0) / tot : 0; });
    return out;
  }
  function goals(Q) {
    var S = shares(Q), share = function (p) { return S[p] || 0; };
    var inParl = (Q.parties || []).filter(function (p) { return share(p) >= 0.05; });
    var tot = inParl.reduce(function (a, p) { return a + share(p); }, 0) || 1;
    var mid = ['union', 'spd', 'gruene'].filter(function (p) { return inParl.indexOf(p) >= 0; }).reduce(function (a, p) { return a + share(p); }, 0) / tot;
    var lead = (share('afd') - share('union')) * 100;
    var afd = {frac: mid, cls: mid >= 0.5 && lead < 0 ? 'ok' : mid >= 0.5 && lead < 4 ? 'mid' : 'bad',
      word: mid < 0.5 ? 'Mitte ohne Mehrheit' : lead >= 4 ? 'AfD klar vorn' : lead >= 0 ? 'Kopf an Kopf' : 'Union vorn', big: Math.round(mid * 630) + '', small: 'Sitze Mitte'};
    var L = life(Q) - 100;
    var lf = {frac: (L + 3) / 6, cls: L >= -0.2 ? 'ok' : L >= -1 ? 'mid' : 'bad', word: L >= 1 ? 'wächst' : L >= -0.2 ? 'gehalten' : L >= -1 ? 'wackelt' : 'sinkt', big: fmt(L, 1, true) + ' %', small: 'Kaufkraft'};
    var em = emissions(Q).total, emB = emissions(Q, true).total, path = climPath(Q);
    var closed = emB > path ? clamp((emB - em) / (emB - path), 0, 1) : 1;
    var cl = {frac: closed, em: em, emB: emB, path: path, cls: em - path <= 5 || closed >= 0.5 ? 'ok' : closed >= 0.15 ? 'mid' : 'bad',
      word: em - path <= 5 ? 'auf Kurs' : closed >= 0.15 ? 'holt auf' : 'weit daneben', big: Math.round(em) + '', small: 'Mt CO₂'};
    return {afd: afd, life: lf, clim: cl};
  }
  SD.goals = goals;

  function ring(frac, big, small, mark) {
    var C = 2 * Math.PI * 26, off = C * (1 - clamp(frac, 0, 1)), m = '';
    if (mark != null) {
      var a = 2 * Math.PI * mark - Math.PI / 2;
      m = '<line x1="' + (32 + 21 * Math.cos(a)).toFixed(1) + '" y1="' + (32 + 21 * Math.sin(a)).toFixed(1) + '" x2="' + (32 + 31 * Math.cos(a)).toFixed(1) + '" y2="' + (32 + 31 * Math.sin(a)).toFixed(1) + '" class="sd_mark"/>';
    }
    return '<svg class="sd_ring" viewBox="0 0 64 64" aria-hidden="true"><circle class="sd_bg" cx="32" cy="32" r="26"/>' +
      '<circle class="sd_fg" cx="32" cy="32" r="26" stroke-dasharray="' + C.toFixed(1) + '" stroke-dashoffset="' + off.toFixed(1) + '"/>' + m +
      '<text x="32" y="34" text-anchor="middle" class="sd_big">' + big + '</text><text x="32" y="45" text-anchor="middle" class="sd_small">' + small + '</text></svg>';
  }

  var HELP = {
    afd: 'Arbeitslosigkeit, Inflation, Streit in der Koalition und verlorene Industriejobs treiben Wähler zur AfD. Gut ist: Union, SPD und Grüne haben zusammen eine Mehrheit und die Union liegt vor der AfD.',
    life: 'Kaufkraft eines mittleren Haushalts seit Spielbeginn. Reallöhne wachsen langsam, Mieten und Nebenkosten fressen das auf. Ohne Entlastung sinkt sie leicht.',
    clim: 'Emissionen im Jahr gegen den Pfad des Klimaschutzgesetzes (2030: 438 Mt, also 65 % unter 1990). Das Umweltbundesamt erwartet auch real eine Lücke. Weniger Produktion senkt Emissionen ebenfalls, kostet aber Jobs.'
  };

  SD.renderGoals = function (Q) {
    var box = el('sd_goals'); if (!box) return;
    init(Q);
    var G = goals(Q), names = {afd: 'AfD verhindern', life: 'Lebensstandard', clim: 'Klimakurs'};
    var marks = {afd: 316 / 630, life: 0.5, clim: null};
    var h = '<div class="sd_goals">';
    ['afd', 'life', 'clim'].forEach(function (k) {
      var g = G[k];
      h += '<button class="sd_goal sd_' + g.cls + (ui.goal === k ? ' open' : '') + '" data-sd-goal="' + k + '" aria-expanded="' + (ui.goal === k) + '">' +
        ring(g.frac, g.big, g.small, marks[k]) + '<span class="sd_gl">' + names[k] + '</span><span class="sd_gs">' + g.word + '</span></button>';
    });
    h += '</div>';
    if (ui.goal) {
      var k = ui.goal, extra = '';
      if (k === 'life') extra = lifeTable(Q);
      if (k === 'clim') extra = climTable(Q, G.clim);
      h += '<div class="sd_info">' + HELP[k] + extra + '</div>';
    }
    box.innerHTML = h;
    box.querySelectorAll('[data-sd-goal]').forEach(function (b) {
      b.onclick = function () { ui.goal = ui.goal === b.dataset.sdGoal ? null : b.dataset.sdGoal; SD.renderGoals(Q); };
    });
  };

  /* ---------- Reiter Wirtschaft ---------- */
  function spark(vals, w, h) {
    vals = vals.filter(function (v) { return typeof v === 'number' && isFinite(v); });
    if (vals.length < 2) vals = [vals[0] || 0, vals[0] || 0];
    var mn = Math.min.apply(null, vals), mx = Math.max.apply(null, vals), r = (mx - mn) || 1;
    var pts = vals.map(function (v, i) { return (i / (vals.length - 1) * w).toFixed(1) + ',' + (h - 2 - (v - mn) / r * (h - 4)).toFixed(1); }).join(' ');
    return '<svg class="sd_spark" viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="none" aria-hidden="true"><polyline points="' + pts + '"/></svg>';
  }
  function lifeTable(Q) {
    var rows = lifeParts(Q).map(function (p) { return '<tr><td>' + p[0] + '</td><td class="' + (p[1] >= 0 ? 'sd_up' : 'sd_down') + '">' + fmt(p[1], 1, true) + ' %</td></tr>'; }).join('');
    return '<table class="sd_table">' + rows + '<tr><td><b>Kaufkraft der Mitte</b></td><td><b>' + fmt(life(Q) - 100, 1, true) + ' %</b></td></tr></table>';
  }
  function climTable(Q, g) {
    var e = emissions(Q), b = emissions(Q, true), C = D.clim;
    var lab = {energie: 'Strom und Wärme', industrie: 'Industrie', gebaeude: 'Gebäude', verkehr: 'Verkehr', rest: 'Landwirtschaft, Abfall'};
    var y0 = {energie: C.energie, industrie: C.industrie, gebaeude: C.gebaeude, verkehr: C.verkehr, rest: C.y0 - C.energie - C.industrie - C.gebaeude - C.verkehr};
    var rows = Object.keys(lab).map(function (k) { return '<tr><td>' + lab[k] + '</td><td>' + fmt(y0[k], 0) + '</td><td><b>' + fmt(e[k], 0) + '</b></td><td>' + fmt(b[k], 0) + '</td></tr>'; }).join('');
    return '<table class="sd_table"><tr><th>Mt im Jahr</th><th>2025</th><th>jetzt</th><th>ohne Politik</th></tr>' + rows +
      '<tr><td><b>Gesamt</b></td><td>649</td><td><b>' + fmt(e.total, 0) + '</b></td><td>' + fmt(b.total, 0) + '</td></tr></table>' +
      '<p class="sd_note">Pfad jetzt: ' + fmt(g ? g.path : climPath(Q), 0) + ' Mt, 2030: 438 Mt.</p>';
  }
  function fold(title, body, open) { return '<details class="sd_fold"' + (open ? ' open' : '') + '><summary>' + title + '</summary><div class="sd_in">' + body + '</div></details>'; }

  SD.renderEconomy = function (Q) {
    var box = el('sd_economy'); if (!box) return;
    var s = init(Q), H = s.hist, R = Q.economic_records || [];
    var open = {}; box.querySelectorAll('details.sd_fold').forEach(function (d, i) { open[i] = d.open; });
    var kpi = function (l, v, vals) { return '<div class="sd_kpi"><span>' + l + '</span><b>' + v + '</b>' + (vals ? spark(vals, 70, 18) : '') + '</div>'; };
    var h = '<div class="sd_kpis">' +
      kpi('Wachstum', fmt(Q.economic_growth || 0, 1) + ' %') +
      kpi('Arbeitslosigkeit', fmt(Q.unemployed || 0, 1) + ' %', R.map(function (r) { return r.unemployment; })) +
      kpi('Inflation', fmt(Q.inflation || 0, 1) + ' %', R.map(function (r) { return r.inflation; })) +
      (Q.spd_in_government ? kpi('Haushaltsspielraum', fmt(Q.budget || 0, 0)) : '') + '</div>';
    var rows = D.order.map(function (k) {
      var P = D.sectors[k], x = s.sec[k], d = x.emp - x.emp0;
      return '<tr><td>' + P.name + '</td><td><span class="sd_bar"><i style="width:' + clamp((x.y - 90) * 5, 2, 100) + '%"></i></span>' + fmt(x.y, 1) + '</td><td>' + fmt(x.emp, 0) +
        '</td><td class="' + (d >= 0 ? 'sd_up' : 'sd_down') + '">' + fmt(d, 1, true) + '</td><td>' + fmt(P.exportquote * 100, 0) + ' %</td></tr>';
    }).join('');
    var branchen = '<table class="sd_table"><tr><th>Branche</th><th>Produktion</th><th>Jobs Tsd.</th><th>seit Start</th><th>Export</th></tr>' + rows + '</table>' +
      '<p class="sd_note">Produktion als Index, Start = 100. Die Branchen folgen dem Wachstum, der Inflation (als Energiepreis) und ihrem eigenen Trend. Bau und Digitales sind fast reine Inlandsbranchen.</p>';
    var verlauf = '<div class="sd_kpis">' + kpi('Kaufkraft', fmt(life(Q) - 100, 1, true) + ' %', H.map(function (x) { return x.L; })) +
      kpi('Emissionen', fmt(emissions(Q).total, 0) + ' Mt', H.map(function (x) { return x.em; })) + '</div>';
    var quellen = '<ul class="sd_list">' + D.quellen.map(function (q) { return '<li>' + q + '</li>'; }).join('') +
      '<li>Trends und Empfindlichkeiten der Branchen, Lebensstandard und Klimatrends: Annahmen.</li></ul>';
    h += fold('Branchen', branchen, open[0]) + fold('Lebensstandard', lifeTable(Q), open[1]) + fold('Klima', climTable(Q), open[2]) +
      fold('Verlauf', verlauf, open[3]) + fold('Quellen und Annahmen', quellen, open[4]);
    box.innerHTML = h;
  };
})();
