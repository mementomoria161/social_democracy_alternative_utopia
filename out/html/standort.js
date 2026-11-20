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
    if (Q.sd) { initGroups(Q.sd); return Q.sd; }
    var sec = {};
    D.order.forEach(function (k) { sec[k] = {y: 100, yB: 100, emp: D.sectors[k].emp, emp0: D.sectors[k].emp}; });
    Q.sd = {sec: sec, n: 0, life_pol: 0, cut: {energie: 0, gebaeude: 0, verkehr: 0, stahl: 0, chemie: 0}, hist: []};
    initGroups(Q.sd);
    record(Q);
    return Q.sd;
  }
  SD.init = init;

  /* ---------- Verbände und Gewerkschaften ----------
     Drei Lager mit Zugang zu den SPD-geführten Ministerien. Zufriedenheit 0 bis 100 folgt jeden Monat der Lage
     ihrer Branche bzw. ihrem Thema (Annahmen). Wer wenig Zugang hat, protestiert lauter. */
  var BLOCS = {
    O: {n: 'Mittelstand und Ordnungspolitik', s: 'Mittelstand', c: '#a87b1f', d: 'Mittelstandsverbände, Familienunternehmen, Maschinenbau und die meisten Wirtschaftsinstitute. Fürchten Bürokratie, Steuern und Konzerne, die der Staat bevorzugt.'},
    W: {n: 'Weltmarkt-Industrie', s: 'Konzerne', c: '#3b5b8c', d: 'BDI und Großkonzerne. Für Förderung großer Projekte und lockeres Beihilferecht, gegen Handelsschutz. Intern gespalten: Autoindustrie dagegen, Elektroindustrie eher dafür.'},
    S: {n: 'Gewerkschaften', s: 'Gewerkschaften', c: '#b3261e', d: 'DGB, IG Metall und gewerkschaftsnahe Institute. Stützen Industriepolitik, Standortgarantien und Staatsbeteiligungen, weil sie Arbeitsplätze sichern.'}
  };
  var GROUPS = {
    bvmw: {n: 'BVMW (Mittelstand)', b: 'O', w: 1.0, start: 48},
    famu: {n: 'Die Familienunternehmer', b: 'O', w: 0.9, start: 46},
    vdma: {n: 'VDMA (Maschinenbau)', b: 'O', w: 1.1, start: 50, sec: 'maschinen'},
    inst: {n: 'ifo, IfW, Sachverständigenrat', b: 'O', w: 0.8, start: 50},
    bdi: {n: 'BDI', b: 'W', w: 1.4, start: 50},
    vda: {n: 'VDA (Automobil)', b: 'W', w: 1.2, start: 44, sec: 'auto'},
    zvei: {n: 'ZVEI und bitkom', b: 'W', w: 0.9, start: 52, sec: 'elektro'},
    vci: {n: 'VCI (Chemie)', b: 'W', w: 0.9, start: 46, sec: 'chemie'},
    dgb: {n: 'DGB und IG Metall', b: 'S', w: 1.3, start: 55}
  };
  function initGroups(s) {
    if (s.grp) return;
    s.grp = {}; for (var g in GROUPS) s.grp[g] = GROUPS[g].start;
    s.acc = {O: 30, W: 45, S: 55};   // Zugang zu den SPD-Ministerien zu Spielbeginn (Annahme)
  }
  function groupTarget(Q, g) {
    var s = Q.sd, G = GROUPS[g], gr = Q.economic_growth || 0, u = Q.unemployed || 6.3, inf = Q.inflation || 2, bud = Q.budget || 0;
    var ind = indAvg(s) - 100;
    if (G.sec) return 50 + 4 * (s.sec[G.sec].y - 100) + 2 * (gr - 0.8);
    if (g === 'dgb') return 55 - 6 * (u - 6.3) + 1.5 * ind;
    if (g === 'inst') return 50 + 5 * (gr - 0.8) + 1.5 * clamp(bud, -6, 6) - 2 * Math.max(0, inf - 2.5);
    if (g === 'bdi') return 50 + 3 * ind + 3 * (gr - 0.8);
    return 48 + 4 * (gr - 0.8) - 3 * Math.max(0, inf - 2.5) - 1.5 * Math.max(0, -bud);   // bvmw, famu
  }
  function stepGroups(Q) {
    var s = Q.sd;
    for (var g in GROUPS) {
      var lack = (60 - s.acc[GROUPS[g].b]) / 60;   // wenig Zugang: schärfere Reaktion nach unten
      var t = groupTarget(Q, g), d = t - s.grp[g];
      s.grp[g] = clamp(s.grp[g] + 0.15 * d * (d < 0 ? 1 + 0.6 * Math.max(0, lack) : 1), 0, 100);
    }
    for (var b in s.acc) s.acc[b] += 0.02 * (40 - s.acc[b]);   // Zugang verblasst langsam ohne Pflege
  }
  function blocSup(s, b) { var a = 0, w = 0; for (var g in GROUPS) if (GROUPS[g].b === b) { a += s.grp[g] * GROUPS[g].w; w += GROUPS[g].w; } return a / w; }
  SD.blocSup = function (Q, b) { return blocSup(init(Q), b); };

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
    stepGroups(Q);
    record(Q);
  };

  function record(Q) {
    var s = Q.sd;
    if (!Q.year || !Q.month) return;   // vor Spielbeginn gibt es noch kein Datum
    s.hist.push({d: Q.year + '-' + Q.month, t: +years(Q).toFixed(3), L: +life(Q).toFixed(2), em: +emissions(Q).total.toFixed(1), emB: +emissions(Q, true).total.toFixed(1), u: Q.unemployed || 0, i: Q.inflation || 0});
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
    if (!Q.year) { box.innerHTML = ''; return; }   // Titelbildschirm: noch kein Spiel
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
    if (!Q.year) { box.innerHTML = ''; return; }   // Titelbildschirm: noch kein Spiel
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
    h += fold('Branchen', branchen, open[0]) + fold('Lebensstandard', lifeTable(Q), open[1]) +
      fold('Verlauf', verlauf, open[2]) + fold('Quellen und Annahmen', quellen, open[3]) +
      '<p class="sd_note">Emissionen und Klimapfad stehen im Reiter Klima.</p>';
    box.innerHTML = h;
  };

  /* ---------- Reiter Klima ----------
     Sektorziele 2030: Klimaschutzgesetz, Anlage 2 (Fassung 2021, zusammen 438 Mt). Seit der Novelle 2024 zählt
     die Summe über alle Sektoren, die einzelnen Sektorwerte dienen als Orientierung. */
  var TARGET30 = {energie: 108, industrie: 118, gebaeude: 67, verkehr: 85, rest: 60};
  var LAB = {energie: 'Energiewirtschaft', industrie: 'Industrie', gebaeude: 'Gebäude', verkehr: 'Verkehr', rest: 'Landwirtschaft und Abfall'};

  function climChart(Q) {
    var ok = function (v) { return typeof v === 'number' && isFinite(v); };
    var H = (Q.sd.hist || []).filter(function (x) { return ok(x.t) && ok(x.em); });
    var W = 300, Hh = 130, x0 = 0.5, x1 = 5, y0 = 420, y1 = 670;
    var X = function (t) { return 28 + (t - x0) / (x1 - x0) * (W - 36); }, Y = function (v) { return 8 + (1 - (v - y0) / (y1 - y0)) * (Hh - 26); };
    var g = '';
    [450, 500, 550, 600, 650].forEach(function (v) { g += '<line x1="28" x2="' + (W - 8) + '" y1="' + Y(v) + '" y2="' + Y(v) + '" class="sd_grid"/><text x="24" y="' + (Y(v) + 3) + '" text-anchor="end" class="sd_ax">' + v + '</text>'; });
    [2026, 2027, 2028, 2029, 2030].forEach(function (yr) { var t = yr - 2025.5; g += '<text x="' + X(t) + '" y="' + (Hh - 4) + '" text-anchor="middle" class="sd_ax">' + yr + '</text>'; });
    g += '<line x1="' + X(x0) + '" y1="' + Y(D.clim.y0 - (D.clim.y0 - D.clim.t2030) * x0 / 5) + '" x2="' + X(x1) + '" y2="' + Y(D.clim.t2030) + '" class="sd_path"/>';
    g += '<text x="' + (X(x1) - 2) + '" y="' + (Y(D.clim.t2030) - 4) + '" text-anchor="end" class="sd_ax">Gesetz 438</text>';
    var line = function (key, cls) {
      var pts = H.filter(function (x) { return ok(x[key]); }).map(function (x) { return X(x.t).toFixed(1) + ',' + Y(x[key]).toFixed(1); });
      return pts.length > 1 ? '<polyline points="' + pts.join(' ') + '" class="' + cls + '"/>' : '';
    };
    g += line('emB', 'sd_base') + line('em', 'sd_em');
    var last = H[H.length - 1];
    if (last) g += '<circle cx="' + X(last.t) + '" cy="' + Y(last.em) + '" r="3" class="sd_dot"/>';
    return '<svg class="sd_chart" viewBox="0 0 ' + W + ' ' + Hh + '" role="img" aria-label="Emissionen gegen den Pfad des Klimaschutzgesetzes">' + g + '</svg>' +
      '<div class="sd_legend"><span><i class="sd_l_em"></i>deine Emissionen</span><span><i class="sd_l_base"></i>ohne deine Politik</span><span><i class="sd_l_path"></i>Pfad des Gesetzes</span></div>';
  }

  SD.renderClimate = function (Q) {
    var box = el('sd_climate'); if (!box) return;
    if (!Q.year) { box.innerHTML = ''; return; }   // Titelbildschirm: noch kein Spiel
    init(Q);
    var open = {}; box.querySelectorAll('details.sd_fold').forEach(function (d, i) { open[i] = d.open; });
    var G = goals(Q).clim, e = emissions(Q), C = D.clim;
    var y0 = {energie: C.energie, industrie: C.industrie, gebaeude: C.gebaeude, verkehr: C.verkehr, rest: C.y0 - C.energie - C.industrie - C.gebaeude - C.verkehr};
    var gap = G.em - G.path;
    var h = '<div class="sd_climhead sd_' + G.cls + '">' + ring(G.frac, Math.round(G.frac * 100) + ' %', 'Lücke zu', null) +
      '<div><b>' + fmt(G.em, 0) + ' Mt</b> CO₂ im Jahr<br><span class="sd_note">Pfad des Klimaschutzgesetzes jetzt ' + fmt(G.path, 0) + ' Mt. ' +
      (gap > 0 ? 'Abstand ' + fmt(gap, 0) + ' Mt.' : 'Du liegst auf dem Pfad.') + ' Ohne deine Politik wären es ' + fmt(G.emB, 0) + ' Mt.</span><br><span class="sd_gs">' + G.word + '</span></div></div>';
    h += climChart(Q);
    h += '<div class="sd_sectors">' + Object.keys(LAB).map(function (k) {
      var max = 200, now = e[k], t = TARGET30[k];
      return '<div class="sd_sec"><div class="sd_sech"><span>' + LAB[k] + '</span><span><b>' + fmt(now, 0) + '</b> / Ziel 2030: ' + t + ' Mt</span></div>' +
        '<div class="sd_track"><i style="width:' + clamp(now / max * 100, 0, 100) + '%"></i><b style="left:' + (t / max * 100) + '%" title="Ziel 2030"></b><u style="left:' + (y0[k] / max * 100) + '%" title="2025"></u></div></div>';
    }).join('') + '<p class="sd_note">Balken: jetzt. Strich: Ziel 2030. Kleiner Strich: 2025.</p></div>';
    var ziel = '<ul class="sd_list"><li>Das Klimaschutzgesetz verlangt bis 2030 minus 65 % gegenüber 1990, also höchstens 438 Mt im Jahr, und Klimaneutralität bis 2045.</li>' +
      '<li>Seit der Novelle 2024 zählt die Summe über alle Sektoren. Die Sektorziele für 2030 stammen aus Anlage 2 der Fassung von 2021 und dienen hier als Orientierung.</li>' +
      '<li>Das Umweltbundesamt sah im März 2026 bis 2030 eine Lücke von zusammen 255 Mt, vor allem bei Gebäuden und Verkehr.</li></ul>';
    var treiber = '<ul class="sd_list"><li><b>Strom:</b> Ausbau der Erneuerbaren senkt die Emissionen um etwa 4 % pro Jahr.</li>' +
      '<li><b>Industrie:</b> Stahl und Chemie stoßen am meisten aus. Weniger Produktion senkt Emissionen, kostet aber Jobs.</li>' +
      '<li><b>Gebäude und Verkehr:</b> sinken nur langsam, um 1 bis 1,5 % pro Jahr.</li>' +
      '<li>Hebel wie Kohleausstieg, Klimaschutzverträge für die Industrie, Wärmepumpen und Bahn kommen mit den nächsten Karten.</li></ul>';
    var quellen = '<ul class="sd_list"><li>Umweltbundesamt: Emissionsdaten 2025 (14.3.2026): 649 Mt, Energiewirtschaft 189,1, Industrie 144,1, Gebäude 103,4, Verkehr 146,3.</li>' +
      '<li>Wirtschaftsvereinigung Stahl: 51 Mt aus der Stahlindustrie (2024). Chemie 37 Mt: Annahme.</li>' +
      '<li>Bundes-Klimaschutzgesetz § 3 und Anlage 2 (Fassung 2021).</li><li>Trends der Sektoren ohne neue Politik: Annahmen, angelehnt an die UBA-Projektion.</li></ul>';
    h += fold('Was das Gesetz verlangt', ziel, open[0]) + fold('Was die Emissionen treibt', treiber, open[1]) + fold('Quellen und Annahmen', quellen, open[2]);
    box.innerHTML = h;
  };

  /* ---------- Reiter Bewegungen: Verbände und Gewerkschaften ---------- */
  function supCol(v) { return v >= 55 ? '#2f8a4b' : v >= 42 ? '#c98a12' : '#c0392b'; }
  function groupNet(s) {
    var W = 260, H = 178, M = {x: 130, y: 92}, P = {O: {x: 46, y: 40}, W: {x: 214, y: 40}, S: {x: 130, y: 158}}, g = '';
    for (var b in P) {
      var p = P[b], sup = blocSup(s, b), r = 10 + sup / 7;
      g += '<line x1="' + M.x + '" y1="' + M.y + '" x2="' + p.x + '" y2="' + p.y + '" stroke="' + BLOCS[b].c + '" stroke-width="' + (1 + s.acc[b] / 14).toFixed(1) + '" stroke-opacity=".55"/>';
      g += '<circle cx="' + p.x + '" cy="' + p.y + '" r="' + r.toFixed(1) + '" fill="' + supCol(sup) + '" fill-opacity=".85" stroke="' + BLOCS[b].c + '" stroke-width="2"/>';
      g += '<text x="' + p.x + '" y="' + (p.y + 4) + '" text-anchor="middle" class="sd_nn">' + Math.round(sup) + '</text>';
      g += '<text x="' + p.x + '" y="' + (b === 'S' ? p.y - r - 4 : p.y + r + 11) + '" text-anchor="middle" class="sd_nl">' + BLOCS[b].s + '</text>';
      g += '<text x="' + ((M.x + p.x) / 2 + (b === 'S' ? 22 : 0)) + '" y="' + ((M.y + p.y) / 2 + (b === 'S' ? 0 : -4)) + '" text-anchor="middle" class="sd_nz">Zugang ' + Math.round(s.acc[b]) + '</text>';
    }
    g += '<rect x="' + (M.x - 30) + '" y="' + (M.y - 12) + '" width="60" height="24" rx="12" fill="#b3261e"/><text x="' + M.x + '" y="' + (M.y + 4) + '" text-anchor="middle" class="sd_nc">SPD</text>';
    return '<svg class="sd_net" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Lager mit Zufriedenheit und Zugang zur SPD">' + g + '</svg>';
  }
  SD.renderGroups = function (Q) {
    var box = el('sd_groups'); if (!box) return;
    if (!Q.year) { box.innerHTML = ''; return; }
    var s = init(Q);
    var open = {}; box.querySelectorAll('details.sd_fold').forEach(function (d, i) { open[i] = d.open; });
    var h = '<p class="sd_note" style="margin-top:0">Kreise: Zufriedenheit mit der Politik (0 bis 100). Linien: Zugang zu den SPD-Ministerien. Wer wenig Zugang hat, reagiert schärfer.</p>' + groupNet(s);
    ['O', 'W', 'S'].forEach(function (b, i) {
      var rows = Object.keys(GROUPS).filter(function (g) { return GROUPS[g].b === b; }).map(function (g) {
        var v = s.grp[g];
        return '<div class="sd_grow"><span>' + GROUPS[g].n + '</span><span class="sd_gbar"><i style="width:' + v.toFixed(0) + '%;background:' + supCol(v) + '"></i></span><b>' + Math.round(v) + '</b></div>';
      }).join('');
      h += fold('<span class="sd_dot" style="background:' + BLOCS[b].c + '"></span>' + BLOCS[b].n + ' ◇ ' + Math.round(blocSup(s, b)), rows + '<p class="sd_note">' + BLOCS[b].d + ' Zugang: ' + Math.round(s.acc[b]) + '.</p>', open[i]);
    });
    h += fold('Wie die Verbände reagieren', '<ul class="sd_list"><li>Branchenverbände folgen der Lage ihrer Branche (Produktion, Wachstum).</li><li>Gewerkschaften achten auf Arbeitslosigkeit und Industriejobs.</li><li>Institute achten auf Wachstum, Haushalt und Inflation.</li><li>Mittelstand und Familienunternehmen auf Wachstum, Inflation und Haushaltslöcher.</li><li>Zugang verblasst ohne Pflege langsam. Alle Gewichte sind Annahmen.</li></ul>', open[3]);
    box.innerHTML = h;
  };
})();
