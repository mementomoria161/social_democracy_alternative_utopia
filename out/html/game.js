(function() {
  var game;
  var ui;

  var DateOptions = {hour: 'numeric',
                 minute: 'numeric',
                 second: 'numeric',
                 year: 'numeric',
                 month: 'short',
                 day: 'numeric' };

  var main = function(dendryUI) {
    ui = dendryUI;
    game = ui.game;

    // Add your custom code here.
  };

  var TITLE = "Social Democracy: An Alternate History" + '_' + "Autumn Chen";

  // the url is a link to game.json
  // test url: https://aucchen.github.io/social_democracy_mods/v0.1.json
  // TODO; 
  window.loadMod = function(url) {
      ui.loadGame(url);
  };

  // save/load buttons
  window.updateSaveButtons = function() {
      if (window.dendryUI.language && window.dendryUI.language == "de") {
          for (var element of document.getElementsByClassName("save_button")) {
              if (element.textContent == "Save") {
                  element.textContent = "Speichern";
              } else if (element.textContent == "Load") {
                  element.textContent = "Laden";
              }
          } 
      }
      else {
          for (var element of document.getElementsByClassName("save_button")) {
              if (element.textContent == "Speichern") {
                  element.textContent = "Save";
              } else if (element.textContent == "Laden") {
                  element.textContent = "Load";
              }
          }
      }
  };

  window.onSave = function() {
      window.updateSaveButtons();
  };

  window.onPopulateSaveSlots = function() {
      window.updateSaveButtons();
  };

  window.showStats = function() {
    if (window.dendryUI.dendryEngine.state.sceneId.startsWith('library')) {
        window.dendryUI.dendryEngine.goToScene('backSpecialScene');
    } else {
        window.dendryUI.dendryEngine.goToScene('library');
    }
  };

  window.showMods = function() {
    window.hideOptions();
    if (window.dendryUI.dendryEngine.state.sceneId.startsWith('mod_loader')) {
        window.dendryUI.dendryEngine.goToScene('backSpecialScene');
    } else {
        window.dendryUI.dendryEngine.goToScene('mod_loader');
    }
  };

  // TODO: update audio displays
  window.updateAudio = function(song) {
      var now_playing = document.getElementById('currently_playing');
      if (song) {
          var a = song.split('/');
          now_playing.textContent = a[a.length-1];
      } else {
          var s = window.dendryUI.currentAudioURL;
          var a = s.split('/');
          now_playing.textContent = a[a.length-1];
      }
  };

  // sets the volume
  window.setVolume = function(volume) {
      if (window.dendryUI.currentAudio) {
          window.dendryUI.volume = volume/100;
          window.dendryUI.currentAudio.volume = volume/100;
      }
  };

  // go to the next song - this just sets the time to 9999 lol.
  window.shuffle = function() {
      if (window.dendryUI.currentAudio) {
          window.dendryUI.currentAudio.currentTime = 9999;
      }
  };

  // toggles pause or play of music
  window.togglePausePlay = function() {
      if (window.dendryUI.currentAudio) {
          if (window.dendryUI.currentAudio.paused) {
            window.dendryUI.currentAudio.play();
            document.getElementById('pause-button-image').style.display = "inline";
            document.getElementById('play-button-image').style.display = "none";
            document.getElementById('pause-button');
            document.getElementById('pause-button-text').textContent = "Pause";
          } else {
            window.dendryUI.currentAudio.pause();
            document.getElementById('play-button-image').style.display = "inline";
            document.getElementById('pause-button-image').style.display = "none";
            document.getElementById('pause-button-text').textContent = "Abspielen";
          }
      }
  };
  
  window.showOptions = function() {
      var save_element = document.getElementById('options');
      window.populateOptions();
      save_element.style.display = "block";
      if (!save_element.onclick) {
          save_element.onclick = function(evt) {
              var target = evt.target;
              var save_element = document.getElementById('options');
              if (target == save_element) {
                  window.hideOptions();
              }
          };
      }
  };

  window.hideOptions = function() {
      var save_element = document.getElementById('options');
      save_element.style.display = "none";
  };

  window.disableBg = function() {
      window.dendryUI.disable_bg = true;
      document.body.style.backgroundImage = 'none';
      window.dendryUI.saveSettings();
  };

  window.enableBg = function() {
      window.dendryUI.disable_bg = false;
      window.dendryUI.setBg(window.dendryUI.dendryEngine.state.bg);
      window.dendryUI.saveSettings();
  };

  window.disableAnimate = function() {
      window.dendryUI.animate = false;
      window.dendryUI.saveSettings();
  };

  window.enableAnimate = function() {
      window.dendryUI.animate = true;
      window.dendryUI.saveSettings();
  };

  window.disableAnimateBg = function() {
      window.dendryUI.animate_bg = false;
      window.dendryUI.saveSettings();
  };

  window.enableAnimateBg = function() {
      window.dendryUI.animate_bg = true;
      window.dendryUI.saveSettings();
  };

  window.disableAudio = function() {
      window.dendryUI.toggle_audio(false);
      window.dendryUI.saveSettings();
  };

  window.enableAudio = function() {
      window.dendryUI.toggle_audio(true);
      window.dendryUI.saveSettings();
  };

  window.enableImages = function() {
      window.dendryUI.show_portraits = true;
      window.dendryUI.saveSettings();
  };

  window.disableImages = function() {
      window.dendryUI.show_portraits = false;
      window.dendryUI.saveSettings();
  };

  window.enableLightMode = function() {
      window.dendryUI.dark_mode = false;
      document.body.classList.remove('dark-mode');
      window.dendryUI.saveSettings();
  };
  window.enableDarkMode = function() {
      window.dendryUI.dark_mode = true;
      document.body.classList.add('dark-mode');
      window.dendryUI.saveSettings();
  };

  // populates the checkboxes in the options view
  window.populateOptions = function() {
    var disable_bg = window.dendryUI.disable_bg;
    var animate = window.dendryUI.animate;
    var disable_audio = window.dendryUI.disable_audio;
    var show_portraits = window.dendryUI.show_portraits;
    if (disable_bg) {
        $('#backgrounds_no')[0].checked = true;
    } else {
        $('#backgrounds_yes')[0].checked = true;
    }
    if (animate) {
        $('#animate_yes')[0].checked = true;
    } else {
        $('#animate_no')[0].checked = true;
    }
    if (disable_audio) {
        $('#audio_no')[0].checked = true;
    } else {
        $('#audio_yes')[0].checked = true;
    }
    if (show_portraits) {
        $('#images_yes')[0].checked = true;
    } else {
        $('#images_no')[0].checked = true;
    }
    if (window.dendryUI.dark_mode) {
        $('#dark_mode')[0].checked = true;
    } else {
        $('#light_mode')[0].checked = true;
    }
  };

  
  // This function allows you to modify the text before it's displayed.
  // E.g. wrapping chat-like messages in spans.
  window.displayText = function(text) {
      return text;
  };

  // This function allows you to do something in response to signals.
  window.handleSignal = function(signal, event, scene_id) {
  };
  
  // This function runs on a new page. Right now, this auto-saves.
  window.onNewPage = function() {
    var scene = window.dendryUI.dendryEngine.state.sceneId;
    if (scene != 'root' && !window.justLoaded) {
        window.dendryUI.autosave();
    }
    if (window.justLoaded) {
        window.justLoaded = false;
    }
  };

  // Party-specific pictures (card-image/face-image know no conditions): shared scenes name the SPD picture,
  // in the Linke game it is swapped for the Linke counterpart. Content-heavy cards have their own Linke file instead.
  window.PARTY_IMAGES = {
      'img/ortsverein.jpg': 'img/linke_infostand.jpg',
      'img/parteitag.jpg': 'img/linke_parteitag.jpg',
      'img/volkspartei.jpg': 'img/karl_liebknecht_haus.jpg',
      'img/spd_fraktion.jpg': 'img/linke_fraktion.jpg'
  };
  window.applyPartyImages = function(player) {
      player = player || 'spd';
      if (window._imagesParty === player) return;
      window._imagesParty = player;
      var scenes = dendryUI.game.scenes;
      for (var id in scenes) {
          ['cardImage', 'faceImage'].forEach(function(k) {
              var img = scenes[id]['_spd_' + k] || scenes[id][k];
              if (!img || !window.PARTY_IMAGES[img]) return;
              scenes[id]['_spd_' + k] = img;
              scenes[id][k] = player == 'linke' ? window.PARTY_IMAGES[img] : img;
          });
      }
  };

  // TODO: have some code for tabbed sidebar browsing.
  window.updateSidebar = function() {
      $('#qualities').empty();
      // the Linke as player party swaps the colours of the seat slots spd/linke (game.css)
      document.body.classList.toggle('player-linke', dendryUI.dendryEngine.state.qualities.player == 'linke');
      window.applyPartyImages(dendryUI.dendryEngine.state.qualities.player);
      var scene = dendryUI.game.scenes[window.statusTab];
      dendryUI.dendryEngine._runActions(scene.onArrival);
      var displayContent = dendryUI.dendryEngine._makeDisplayContent(scene.content, true);
      $('#qualities').append(dendryUI.contentToHTML.convert(displayContent));
      dendryUI.dendryEngine._runActions(scene.onDisplay);
      window.drawPolls();
      window.drawEconomy();
      window.drawGroups();
      window.drawClimate();
  };

  // Wirtschafts-Reiter (Durchgang 4.4)
  // Reale Jahreswerte vor dem Spielstart: Arbeitslosenquote der Bundesagentur für Arbeit (Jahresdurchschnitt, bezogen auf alle
  // zivilen Erwerbspersonen), Verbraucherpreisindex (Destatis, Veränderung zum Vorjahr), BIP preisbereinigt (Destatis:
  // 2019-2022 Pressemitteilung Nr. 017 vom 15.01.2026, 2023/2024 Inlandsprodukt-Tabelle Stand 30.09.2026 nach der Sommerrevision 2026).
  var REAL_ECON = [
      // Jahr, Arbeitslosenquote, Inflation, Wachstum
      [2019, 5.0, 1.4, 1.0], [2020, 5.9, 0.5, -4.1], [2021, 5.7, 3.1, 3.9],
      [2022, 5.3, 6.9, 1.8], [2023, 5.7, 5.9, -1.0], [2024, 6.0, 2.2, 0.0]
  ].map(function(r) {
      return {'date': new Date(r[0], 6, 1), 'unemployment': r[1], 'inflation': r[2], 'growth': r[3], 'real': true};
  });
  var GAME_START = new Date(2024, 10, 6);
  // Reihenfolge wie SECTORS in post_event (dort Modell und Quellen der Anteile). share = Anteil an der Bruttowertschöpfung 2024 in %,
  // jobs = Erwerbstätige 2024 in Tausend (Destatis, Arbeitnehmer und Erwerbstätige nach Wirtschaftsbereichen, Stand 18.08.2026;
  // Energie = Produzierendes Gewerbe ohne Bau minus Verarbeitendes Gewerbe; Öffentliche und Sonstige Dienstleister geschätzt aufgeteilt).
  // group = Farbgruppe in der Zusammensetzung (höchstens acht Farben, der Rest als „Übrige“).
  var ECON_SECTORS = [
      {id: 'industrie', name: 'Industrie', share: 19.9, jobs: 7415, group: 0,
       text: 'Verarbeitendes Gewerbe: Fahrzeugbau, Maschinenbau, Chemie und Pharma, Metall und Elektro. Exportabhängig und konjunkturempfindlich; belastet durch hohe Energiepreise, Konkurrenz aus China und den Umbruch zum Elektroauto.'},
      {id: 'energie', name: 'Energie, Wasser, Bergbau', share: 3.5, jobs: 649, group: 7,
       text: 'Energie- und Wasserversorgung, Entsorgung, Bergbau. Wächst mit dem Ausbau von Netzen und erneuerbaren Energien.'},
      {id: 'bau', name: 'Baugewerbe', share: 5.1, jobs: 2613, group: 1,
       text: 'Hoch- und Tiefbau, Ausbaugewerbe. Seit dem Zinsanstieg 2022 im Abschwung; öffentliche Investitionen und Wohnungsbau beleben ihn.'},
      {id: 'handel', name: 'Handel, Verkehr, Gastgewerbe', share: 16.3, jobs: 10079, group: 2,
       text: 'Einzel- und Großhandel, Logistik, Verkehr, Hotels und Gaststätten. Hängt am privaten Konsum und an den Reallöhnen.'},
      {id: 'ikt', name: 'Information und Kommunikation', share: 4.9, jobs: 1572, group: 6,
       text: 'Software, IT-Dienste, Telekommunikation, Verlage und Medien. Wächst strukturell durch die Digitalisierung.'},
      {id: 'finanzen', name: 'Finanzen und Versicherungen', share: 3.7, jobs: 1086, group: 7,
       text: 'Banken und Versicherungen; anfällig für Finanzkrisen.'},
      {id: 'wohnen', name: 'Grundstücks- und Wohnungswesen', share: 10.6, jobs: 523, group: 4,
       text: 'Vermietung und Immobilienwirtschaft, einschließlich des selbst genutzten Wohneigentums (unterstellte Mieten). Wenige Beschäftigte, kaum konjunkturabhängig.'},
      {id: 'dienste', name: 'Unternehmensdienstleister', share: 11.5, jobs: 6248, group: 5,
       text: 'Beratung, Recht und Steuern, Ingenieurbüros, Forschung, Werbung, Zeitarbeit, Gebäudereinigung. Folgt der Industrie und der Konjunktur.'},
      {id: 'oeffentlich', name: 'Öffentliche Dienste, Erziehung, Gesundheit', share: 19.7, jobs: 11900, group: 3,
       text: 'Verwaltung, Verteidigung, Schulen und Kitas, Krankenhäuser und Pflege. Wächst mit der alternden Gesellschaft und kaum abhängig von der Konjunktur.'},
      {id: 'sonstige', name: 'Sonstige Dienstleister', share: 3.9, jobs: 3310, group: 7,
       text: 'Kunst, Kultur, Sport, Vereine, Friseure und andere persönliche Dienstleistungen.'},
      {id: 'agrar', name: 'Land- und Forstwirtschaft', share: 0.9, jobs: 565, group: 7,
       text: 'Landwirtschaft, Forstwirtschaft und Fischerei.'}
  ];
  var ECON_GROUPS = ['Industrie', 'Bau', 'Handel, Verkehr, Gastgewerbe', 'Öffentliche Dienste, Erziehung, Gesundheit',
                     'Grundstücks- und Wohnungswesen', 'Unternehmensdienstleister', 'Information und Kommunikation',
                     'Übrige (Energie, Finanzen, Landwirtschaft, Sonstige)'];
  // [Feld, Name, kurzer Name für die Beschriftung am Linienende]
  var ECON_LINES = [['growth', 'Wachstum', 'Wachstum'], ['unemployment', 'Arbeitslosenquote', 'Arbeitslose'], ['inflation', 'Inflation', 'Inflation']];
  var econNum = function(x, digits) {
      return (x < 0 ? '−' : '') + Math.abs(x).toFixed(digits === undefined ? 1 : digits).replace('.', ',');
  };
  var econDate = function(d) { return d3.timeFormat('%b %Y')(new Date(d)); };
  window.econOpen = {};

  window.drawEconomy = function() {
      var box = document.getElementById('econ_view');
      var Q = dendryUI.dendryEngine.state.qualities;
      if (!box || !window.d3 || Q.year === undefined) return;
      var now = {'date': new Date(Q.year, Q.month - 1), 'unemployment': Q.unemployed || 0, 'inflation': Q.inflation || 0,
                 'growth': Q.economic_growth || 0, 'budget': Q.budget || 0};
      var records = (Q.economic_records || []).filter(function(r) {
          return new Date(r.date).getTime() != now.date.getTime();
      });
      var game = records.concat([now]);

      var html = '';
      html += '<svg id="econ_graph" class="econ"></svg><div id="econ_readout" class="poll_note"></div>';

      // Sektoren: schlichte Listen wie die Parteien im Reiter Regierung
      var started = Q.sector_value && Q.sector_value.length == ECON_SECTORS.length;
      var values = started ? Q.sector_value : ECON_SECTORS.map(function(s) { return s.share * 39.796; });
      var rates = started ? Q.sector_growth : ECON_SECTORS.map(function() { return null; });
      var vTotal = values.reduce(function(a, b) { return a + b; }, 0);
      var rows = ECON_SECTORS.map(function(s, i) {
          var start = s.share * 39.796;
          return {s: s, share: 100 * values[i] / vTotal, rate: rates[i], jobs: s.jobs * (1 + 0.5 * (values[i] / start - 1))};
      });
      var jTotal = rows.reduce(function(a, r) { return a + r.jobs; }, 0);
      rows.forEach(function(r) { r.jobShare = 100 * r.jobs / jTotal; });
      var GROUP_COLORS = ['--econ-s1', '--econ-s2', '--econ-s3', '--econ-s4', '--econ-s5', '--econ-s6', '--econ-s7', '--econ-other'];
      var VIEWS = [['rate', 'Wachstum der Wirtschaftsbereiche', true], ['share', 'Anteile an der Wertschöpfung', false], ['jobShare', 'Anteile der Beschäftigten', false]];
      var view = VIEWS.filter(function(v) { return v[0] == window.econView; })[0] || VIEWS[0];
      var key = view[0], diverging = view[2];
      var fmt = function(v) { return v === null || v === undefined ? '–' : (diverging && v > 0 ? '+' : '') + econNum(v) + ' %'; };
      var maxV = Math.max(diverging ? 3 : 1, d3.max(rows, function(r) { return Math.abs(r[key] || 0); }));
      html += '<label class="poll_select">Anzeige: <select onchange="window.econView = this.value; window.drawEconomy();">' + VIEWS.map(function(v) {
          return '<option value="' + v[0] + '"' + (v[0] == key ? ' selected' : '') + '>' + v[1] + '</option>';
      }).join('') + '</select></label><table class="gov_table econ_table">' +
          rows.slice().sort(function(a, b) { return (b[key] || 0) - (a[key] || 0); }).map(function(r) {
              var v = r[key] || 0, w = 100 * Math.abs(v) / maxV / (diverging ? 2 : 1);
              var bar = '<span class="econ_div"><span class="' + (diverging ? (v < 0 ? 'neg' : 'pos') : 'pos') + '" style="width:' + w + '%;' +
                  (diverging ? (v < 0 ? 'right:50%' : 'left:50%') : 'left:0') + ';background:var(' + GROUP_COLORS[r.s.group] + ')"></span>' +
                  (diverging ? '<span class="econ_zero"></span>' : '') + '</span>';
              return '<tr><td>' + r.s.name + '</td><td class="econ_bar_cell">' + bar + '</td><td style="text-align:right;white-space:nowrap">' + fmt(r[key]) + '</td></tr>';
          }).join('') + '</table>';
      box.innerHTML = html;

      // Liniendiagramm
      var data = REAL_ECON.concat(game);
      var width = box.clientWidth, height = Math.min(260, Math.max(190, width * 0.5));
      var m = {top: 12, right: 96, bottom: 26, left: 30};
      var svg = d3.select('#econ_graph').attr('width', width).attr('height', height);
      var x = d3.scaleTime([new Date(2019, 0, 1), d3.max(data, function(d) { return new Date(d.date); })], [m.left, width - m.right]);
      var lo = Math.min(-1, d3.min(data, function(d) { return Math.min(d.growth, d.inflation, d.unemployment); }));
      var hi = d3.max(data, function(d) { return Math.max(d.growth, d.inflation, d.unemployment); }) + 0.5;
      var yS = d3.scaleLinear([Math.floor(lo), Math.ceil(hi)], [height - m.bottom, m.top]);
      svg.append('g').attr('class', 'econ_axis').attr('transform', 'translate(0,' + (height - m.bottom) + ')')
          .call(d3.axisBottom(x).ticks(Math.max(3, Math.floor((width - m.left - m.right) / 55))).tickFormat(d3.timeFormat('%Y')).tickSizeOuter(0));
      svg.append('g').attr('class', 'econ_axis').attr('transform', 'translate(' + m.left + ',0)')
          .call(d3.axisLeft(yS).ticks(6).tickFormat(function(v) { return econNum(v, 0); }).tickSize(-(width - m.left - m.right)))
          .call(function(g) { g.select('.domain').remove(); });
      svg.append('line').attr('class', 'econ_zero_line').attr('x1', m.left).attr('x2', width - m.right).attr('y1', yS(0)).attr('y2', yS(0));
      var labels = [];
      ECON_LINES.forEach(function(l, i) {
          var series = data.filter(function(d) { return d[l[0]] !== undefined && d[l[0]] !== null; });
          svg.append('path').attr('class', 'econ_line s' + (i + 1))
              .attr('d', d3.line().x(function(d) { return x(new Date(d.date)); }).y(function(d) { return yS(d[l[0]]); })(series));
          var last = series[series.length - 1];
          labels.push({i: i, text: l[2] + ' ' + econNum(last[l[0]]), y: yS(last[l[0]]) + 4});
      });
      labels.sort(function(a, b) { return a.y - b.y; });
      for (var k = 1; k < labels.length; k++) labels[k].y = Math.max(labels[k].y, labels[k - 1].y + 12);
      labels.forEach(function(lb) {
          svg.append('text').attr('class', 'econ_end_label').attr('x', width - m.right + 6).attr('y', lb.y).text(lb.text);
      });
      // Hover: Fadenkreuz und Werte des nächstgelegenen Monats bzw. Jahres
      var rule = svg.append('line').attr('class', 'econ_rule').attr('y1', m.top).attr('y2', height - m.bottom).style('display', 'none');
      var readout = document.getElementById('econ_readout');
      var bisect = d3.bisector(function(d) { return new Date(d.date); }).center;
      svg.append('rect').attr('x', m.left).attr('y', 0).attr('width', width - m.left - m.right).attr('height', height)
          .attr('fill', 'transparent')
          .on('pointermove', function(ev) {
              var d = data[bisect(data, x.invert(d3.pointer(ev)[0]))];
              rule.attr('x1', x(new Date(d.date))).attr('x2', x(new Date(d.date))).style('display', null);
              readout.textContent = (d.real ? String(new Date(d.date).getFullYear()) : econDate(d.date)) + ': ' +
                  ECON_LINES.filter(function(l) { return typeof d[l[0]] == 'number'; }).map(function(l) { return l[1] + ' ' + econNum(d[l[0]]) + ' %'; }).join(', ');
          })
          .on('pointerleave', function() { rule.style('display', 'none'); });
  };

  // Klima-Reiter (Durchgang 4.6): Ampel „Paris-Kurs“, Kennzahlen, Emissionen 1990-2045 mit KSG- und Paris-Pfad, Sektoren,
  // Strommix (Ring und Verlauf), Energiepreise, beschlossene Maßnahmen. Daten und Modell: source/scenes/climate_data.scene.dry
  // (dendryUI.game.CLIM), Werte cl_*/kp_* in den Qualities.
  var KL_MIX_NOTE = ['Wind an Land und auf See', 'Photovoltaik', 'Biomasse und Biogas', 'Laufwasser und Speicherwasser', 'Geothermie, biogener Abfall',
                     'Erdgas', 'Steinkohle', 'Braunkohle', 'Öl, nicht biogener Abfall, Sonstige'];
  var KL_PRICES = [['Haushaltsstrom', 'ct/kWh', 1], ['Gas für Haushalte', 'ct/kWh', 1], ['Industriestrom', 'ct/kWh', 1], ['CO2-Preis Heizen/Tanken', '€/t', 0]];
  var KL_P0 = [40.9, 12.3, 17.2, 45];
  window.klimaOpen = {};

  window.drawClimate = function() {
      var box = document.getElementById('klima_view');
      var Q = dendryUI.dendryEngine.state.qualities;
      if (!box || !window.d3 || Q.year === undefined) return;
      if (!dendryUI.game.CLIM) dendryUI.dendryEngine._runActions(dendryUI.game.scenes.climate_data.onArrival);
      var C = dendryUI.game.CLIM;
      if (!Q.cl_st) {
          box.innerHTML = '<p class="poll_note">Dieser Spielstand ist älter als der Reiter „Klima“. Emissionen, Strommix und Prognose erscheinen nach dem nächsten Monatswechsel.</p>';
          return;
      }
      var sum = function(a) { return a.reduce(function(x, y) { return x + y; }, 0); };
      var sec = Q.cl_sec || C.START, total = Q.cl_total || 649.8;
      var recs = Q.cl_records || [];
      var nowT = Q.year + (Q.month - 1) / 12;
      var yearAgo = recs.filter(function(r) { var d = new Date(r.date); return d.getFullYear() == Q.year - 1 && d.getMonth() == Q.month - 1; })[0];
      var status = Q.cl_status || 0, gap = Q.cl_gap2030 || 0, p2030 = Q.cl_p2030 || 0, byear = Q.cl_budget_year || 0;
      var left = C.BUDGET - (Q.cl_cum || 0);

      // Ampel
      var html = '<div class="kl_status kl_s' + status + '"><span class="kl_light" aria-hidden="true"></span><div><b>' +
          ['Nicht auf Kurs', 'Klimaziel 2030 in Reichweite, Paris verfehlt', 'Auf Paris-Kurs'][status] + '</b><br><span class="kl_small">' +
          'Prognose 2030: ' + econNum(p2030, 0) + ' Mio. t (Ziel 438, ' + (gap > 0 ? 'Lücke ' + econNum(gap, 0) + ' Mio. t' : 'Ziel erreicht') + '). ' +
          (byear ? 'Paris-Budget aufgebraucht etwa ' + byear + '.' : 'Paris-Budget bleibt bis 2045 eingehalten.') + '</span></div></div>';

      // Kennzahlen
      var tile = function(label, value, note, cls, title) {
          return '<div class="econ_tile" title="' + (title || '') + '"><div class="econ_label">' + label + '</div><div class="econ_value">' + value + '</div>' +
              (note ? '<div class="econ_trend' + (cls ? ' ' + cls : '') + '">' + note + '</div>' : '') + '</div>';
      };
      var prevE = yearAgo ? yearAgo.e : 650, dE = total - prevE;
      var ee0 = sum(C.MIX_2024.slice(0, 5)), ee = Q.cl_ee || ee0, prevEE = yearAgo ? sum(yearAgo.m.slice(0, 5)) : ee0;
      html += '<div class="econ econ_tiles">' +
          tile('Treibhausgase (Jahresrate)', econNum(total, 0) + ' Mt',
               (Math.abs(dE) < 0.5 ? '► wie ' : (dE < 0 ? '▼ ' : '▲ +') + econNum(dE, 0) + ' Mt ggü. ') + (yearAgo ? 'Vorjahr' : '2024') + ', −' + econNum(100 * (1 - total / C.BASE_1990), 0) + ' % ggü. 1990',
               dE < 0 ? 'good' : 'bad', 'Millionen Tonnen CO2-Äquivalente im Jahr, aktueller Monat hochgerechnet') +
          tile('Prognose 2030', econNum(p2030, 0) + ' Mt', gap > 0 ? '▲ ' + econNum(gap, 0) + ' Mt über dem Ziel (438)' : '▼ ' + econNum(-gap, 0) + ' Mt unter dem Ziel (438)',
               gap > 0 ? 'bad' : 'good', 'Fortschreibung mit den beschlossenen Maßnahmen, normalem Wetter und Erholung der Industrie') +
          tile('Paris-Budget CO2', econNum(Math.max(0, left) / 1000, 1) + ' Gt übrig', byear ? 'reicht bis etwa ' + byear : 'reicht bis 2045', byear ? 'bad' : 'good',
               'Restbudget für 1,75 Grad mit 67 % Wahrscheinlichkeit nach SRU, ab 2024 rund 4,8 Gt CO2') +
          tile('Erneuerbare am Strom', econNum(ee, 0) + ' %', (Math.abs(ee - prevEE) < 0.05 ? '► wie ' : (ee - prevEE >= 0 ? '▲ +' : '▼ ') + econNum(ee - prevEE, 1) + ' Pkt. ggü. ') + (yearAgo ? 'Vorjahr' : '2024'),
               ee - prevEE >= 0 ? 'good' : 'bad', 'Anteil an der Bruttostromerzeugung') +
          '</div>';
      if ((Q.cl_konj || 0) >= 2) {
          html += '<p class="kl_warn">Davon fehlen rund ' + econNum(Q.cl_konj, 0) + ' Mio. t nur, weil die Industrie weniger produziert. Das ist kein Klimaschutz: Erholt sich die Wirtschaft, kommen die Emissionen zurück.</p>';
      }

      // Verlauf
      html += '<h3 class="poll_heading">Emissionen 1990 bis 2045</h3><div class="econ_legend">' +
          '<span><span class="kl_key kl_real"></span>real</span><span><span class="kl_key kl_game"></span>Spiel</span>' +
          '<span><span class="kl_key kl_proj"></span>Prognose</span><span><span class="kl_key kl_ksg"></span>Klimaschutzgesetz</span>' +
          '<span><span class="kl_key kl_paris"></span>Paris-Pfad</span></div>' +
          '<svg id="kl_graph" class="econ"></svg><div id="kl_readout" class="poll_note">Zeige auf das Diagramm für einzelne Werte.</div>' +
          '<p class="poll_note">Treibhausgase in Mio. t CO2-Äquivalenten (ohne Landnutzung). Real bis 2024 (Umweltbundesamt), danach Monatswerte des Spiels als Jahresrate. ' +
          'Paris-Pfad: gleichmäßige Senkung, die das CO2-Budget für 1,75 Grad (SRU) einhält. KSG-Pfad bis 2045 brutto; die Restemissionen sollen dann durch Senken ausgeglichen werden.</p>';

      // Sektoren
      var prevS = yearAgo ? yearAgo.s : C.START;
      var maxS = Math.max.apply(null, C.START.concat(sec));
      html += '<h3 class="poll_heading">Sektoren und Ziel 2030</h3><p class="poll_note">Balken: aktuelle Jahresrate (grün: unter dem Ziel), dunkler Strich: Jahresmenge 2030 nach dem Klimaschutzgesetz, heller Strich: 2024. Klicke für Details.</p><div class="econ">' +
          C.SECTORS.map(function(s, i) {
              var v = sec[i], over = v > s.t2030;
              var why = (Q.cl_why || [])[i] || '';
              return '<details class="poll_group"' + (window.klimaOpen[s.id] ? ' open' : '') + ' ontoggle="window.klimaOpen[\'' + s.id + '\'] = this.open;">' +
                  '<summary class="econ_row" title="' + s.name + ': ' + econNum(v, 1) + ' Mio. t, Ziel 2030: ' + s.t2030 + ' Mio. t">' +
                  '<span class="econ_name">' + s.name + '</span><span class="kl_bar"><span class="kl_fill' + (over ? '' : ' ok') + '" style="width:' + (100 * v / maxS) + '%"></span>' +
                  '<span class="kl_mark prev" style="left:' + (100 * C.START[i] / maxS) + '%"></span><span class="kl_mark" style="left:' + (100 * s.t2030 / maxS) + '%"></span></span>' +
                  '<span class="econ_val">' + econNum(v, 0) + '</span></summary>' +
                  '<div class="econ_detail">' + econNum(v, 1) + ' Mio. t im Jahr (2024: ' + econNum(C.START[i], 1) + ', Ziel 2030: ' + s.t2030 + ')<br>' +
                  'Veränderung gegenüber ' + (yearAgo ? 'dem Vorjahresmonat' : '2024') + ': ' + (v - prevS[i] > 0 ? '+' : '') + econNum(v - prevS[i], 1) + ' Mio. t<br>' +
                  (why ? 'Einflüsse: ' + why : '') + '</div></details>';
          }).join('') + '</div>';

      // Strommix
      var mix = Q.cl_mix || C.MIX_2024;
      var cap = Q.cl_cap || [63.0, 9.1, 96.7, 15.6, 16.0];
      html += '<h3 class="poll_heading">Strommix</h3><div class="kl_mixbox"><svg id="kl_donut" width="150" height="150" role="img" aria-label="Strommix"></svg><div class="econ_legend kl_mixlegend">' +
          C.MIX.map(function(n, k) {
              return '<span title="' + KL_MIX_NOTE[k] + '"><span class="econ_swatch kl_m' + (k + 1) + '"></span>' + n + ' ' + econNum(mix[k], 0) + ' %</span>';
          }).join('') + '</div></div>';
      var mixBar = function(vals) {
          return '<span class="econ_stack">' + vals.map(function(v, k) {
              return '<span class="kl_m' + (k + 1) + '" title="' + C.MIX[k] + ': ' + econNum(v, 1) + ' %" style="flex-grow:' + Math.max(0, v) + '"></span>';
          }).join('') + '</span>';
      };
      var years = [['2024 (real)', C.MIX_2024]];
      for (var y = 2025; y < Q.year; y++) {
          var dec = recs.filter(function(r) { var d = new Date(r.date); return d.getFullYear() == y && d.getMonth() == 11; })[0];
          if (dec) years.push([String(y), dec.m]);
      }
      if (Q.cl_st && nowT > 2024.9) years.push([econDate(new Date(Q.year, Q.month - 1)), mix]);
      html += '<div class="econ">' + years.map(function(y) {
          return '<div class="econ_year"><span class="econ_year_label">' + y[0] + '</span>' + mixBar(y[1]) + '</div>';
      }).join('') + '</div>' +
          '<p class="kl_small">Leistung: Wind an Land <b>' + econNum(cap[0], 1) + ' GW</b> (Ziel 2030: 115), Wind auf See <b>' + econNum(cap[1], 1) + ' GW</b> (30), ' +
          'Photovoltaik <b>' + econNum(cap[2], 0) + ' GW</b> (215). Kohlekraftwerke am Markt: Braunkohle ' + econNum(cap[3], 1) + ' GW, Steinkohle ' + econNum(cap[4], 1) + ' GW. ' +
          'Kohleausstieg: <b>' + (Q.kp_kohle ? '2030 (beschlossen)' : 'spätestens 2038 (Gesetz)') + '</b>.</p>' +
          '<p class="poll_note">Anteile an der Bruttostromerzeugung. 2024 real nach AG Energiebilanzen (2025: 57 % erneuerbar), danach Spielmodell aus Kapazitäten, Wetter und CO2-Preis.</p>';

      // Energiepreise
      var price = Q.cl_price || [40.9, 12.3, 17.2, 45, 65, 75];
      html += '<h3 class="poll_heading">Energiepreise</h3><div class="kl_prices">' + KL_PRICES.map(function(p, i) {
          var base = KL_P0[i], v = price[i], d = v - base;
          return '<div class="econ_tile" title="' + p[0] + ': ' + econNum(v, p[2]) + ' ' + p[1] + ' (2024: ' + econNum(base, p[2]) + ')">' +
              '<div class="econ_label">' + p[0] + (i == 3 ? (Q.year >= 2028 ? ' (EU-ETS 2)' : ' (national)') : '') + '</div>' +
              '<div class="kl_pval">' + econNum(v, p[2]) + ' <span class="kl_small">' + p[1] + '</span></div>' +
              '<svg class="kl_spark" id="kl_spark' + i + '"></svg>' +
              '<div class="econ_trend">' + (Math.abs(d) < 0.05 ? 'wie 2024' : (d > 0 ? '▲ +' : '▼ ') + econNum(d, p[2]) + ' ggü. 2024') + '</div></div>';
      }).join('') + '</div>' +
          '<p class="kl_small">Energiepreisindex (2024 = 100): <b>' + econNum(Q.energy_price || 100, 0) + '</b>. Er wirkt auf Industrie und Energiewirtschaft (Reiter „Wirtschaft“), auf die Inflation und auf Mittelstand und Autoindustrie (Reiter „Gruppen“). ' +
          'CO2-Preis im EU-Emissionshandel für Kraftwerke und Industrie: ' + econNum(price[4], 0) + ' €/t, Großhandelsstrom: ' + econNum(price[5], 0) + ' €/MWh.</p>' +
          '<p class="poll_note">Startwerte nach BDEW (Haushaltsstrom 2024 rund 41, 2026 rund 37 ct/kWh; Industrie rund 17 ct/kWh) und BEHG (2024 45, 2025 55 €/t). Haushaltspreise folgen dem Großhandel mit Verzögerung.</p>';

      // Maßnahmen
      var M = [
          ['Kohleausstieg', Q.kp_kohle ? ['2030', 1] : ['2038 (Gesetz)', 0]],
          ['Wind und Solar', [['gebremst', -1], ['Grundtempo', 0], ['beschleunigt', 1], ['Ausbauoffensive', 1]][(Q.kp_ee || 0) + 1]],
          ['Netze und Speicher', Q.kp_netz ? ['Ausbau beschlossen', 1] : ['Grundtempo', 0]],
          ['Wärme und Gebäude', [['Heizungsgesetz entschärft', -1], ['Gebäudeenergiegesetz', 0], ['sozial gestaffelt', 1], ['plus Wärmenetze', 1]][(Q.kp_waerme || 0) + 1]],
          ['Bahn und Deutschlandticket', [['Status quo', 0], ['gesichert und günstiger', 1], ['Schienenoffensive', 1]][Q.kp_bahn || 0]],
          ['Tempolimit 130', Q.kp_tempolimit ? ['eingeführt', 1] : ['keins', 0]],
          ['Autos', [['Verbrenner-Aus aufgeweicht', -1], ['EU-Flottengrenzwerte', 0], ['Social Leasing', 1]][(Q.kp_eauto || 0) + 1]],
          ['Industrie', [['Grundtempo', 0], ['Klimaschutzverträge', 1], ['plus Industriestrompreis', 1]][Q.kp_industrie || 0]],
          ['Wasserstoff', Q.kp_h2 ? ['Kernnetz gefördert (ab 2028)', 1] : ['Grundtempo', 0]],
          ['CO2-Preis', [['gedeckelt', -1], ['nach Gesetz', 0], ['höherer Pfad', 1]][(Q.kp_co2 || 0) + 1]],
          ['Sozialer Ausgleich', Q.kp_klimageld ? ['Klimageld', 1] : (Q.stromsteuer_alle ? ['Stromsteuer gesenkt', 0] : ['keiner', 0])]
      ];
      html += '<h3 class="poll_heading">Klimapolitik</h3><div class="kl_measures">' + M.map(function(mm) {
          return '<div class="kl_measure"><span>' + mm[0] + '</span><span class="kl_pill p' + (mm[1][1] + 1) + '">' + mm[1][0] + '</span></div>';
      }).join('') + '</div><p class="poll_note">Maßnahmen beschließt die Regierung über die Karte „Klimaschutz und Energie“; in der Opposition wirkt die Karte „Klimakampagne“. ' +
          'Modellannahmen und Quellen: Umweltbundesamt (Treibhausgase 2024/2025, Projektionen 2026: 2030 −62,6 %), AG Energiebilanzen, Bundesnetzagentur, BDEW, SRU (CO2-Budget). Ab dem Spielstart ist alles Fiktion.</p>';
      box.innerHTML = html;

      // Liniendiagramm
      var width = box.clientWidth, height = Math.min(280, Math.max(200, width * 0.6));
      var m = {top: 12, right: 64, bottom: 26, left: 40};
      var svg = d3.select('#kl_graph').attr('width', width).attr('height', height);
      var x = d3.scaleLinear([1990, 2045.5], [m.left, width - m.right]);
      var yS = d3.scaleLinear([0, 1300], [height - m.bottom, m.top]);
      var toT = function(d) { var dt = new Date(d); return dt.getFullYear() + dt.getMonth() / 12; };
      var real = C.REAL.map(function(r) { return [r[0] + 0.5, r[1]]; });
      var game = [[2024.5, 650]].concat(recs.map(function(r) { return [toT(r.date), r.e]; }));
      var proj = (Q.cl_proj && Q.cl_proj.length ? Q.cl_proj : [[nowT, total]]);
      var ksg = [[2024.5, 650]].concat(C.KSG.map(function(k) { return [k[0] + 0.5, k[1]]; }));
      var zeroT = 2024 + 2 * C.BUDGET / C.co2Of(C.START);
      var paris = [[2024, 650], [zeroT, 0], [2045.5, 0]];
      var startX = x(2024.85);
      svg.append('rect').attr('class', 'econ_real_band').attr('x', m.left).attr('y', m.top).attr('width', Math.max(0, startX - m.left)).attr('height', height - m.top - m.bottom);
      svg.append('line').attr('class', 'econ_start').attr('x1', startX).attr('x2', startX).attr('y1', m.top).attr('y2', height - m.bottom);
      svg.append('g').attr('class', 'econ_axis').attr('transform', 'translate(0,' + (height - m.bottom) + ')')
          .call(d3.axisBottom(x).tickValues(width > 320 ? [1990, 2000, 2010, 2020, 2030, 2040] : [1990, 2010, 2030]).tickFormat(d3.format('d')).tickSizeOuter(0));
      svg.append('g').attr('class', 'econ_axis').attr('transform', 'translate(' + m.left + ',0)')
          .call(d3.axisLeft(yS).ticks(5).tickFormat(function(v) { return econNum(v, 0); }).tickSize(-(width - m.left - m.right)))
          .call(function(g) { g.select('.domain').remove(); });
      var line = d3.line().x(function(d) { return x(d[0]); }).y(function(d) { return yS(d[1]); });
      svg.append('path').attr('class', 'kl_line kl_ksg').attr('d', line(ksg));
      svg.append('path').attr('class', 'kl_line kl_paris').attr('d', line(paris));
      svg.append('path').attr('class', 'kl_line kl_real').attr('d', line(real));
      svg.selectAll(null).data(real).enter().append('circle').attr('class', 'kl_dot').attr('r', 2.5)
          .attr('cx', function(d) { return x(d[0]); }).attr('cy', function(d) { return yS(d[1]); });
      svg.append('path').attr('class', 'kl_line kl_proj').attr('d', line(proj));
      svg.append('path').attr('class', 'kl_line kl_game').attr('d', line(game));
      svg.append('circle').attr('class', 'kl_target').attr('r', 4).attr('cx', x(2030.5)).attr('cy', yS(438));
      svg.append('text').attr('class', 'econ_end_label').attr('x', x(2030.5) + 6).attr('y', yS(438) - 6).text('Ziel 2030');
      var pEnd = proj[proj.length - 1][1];
      svg.append('text').attr('class', 'econ_end_label').attr('x', width - m.right + 4).attr('y', yS(pEnd) + 4).text(econNum(pEnd, 0) + ' (2045)');
      var rule = svg.append('line').attr('class', 'econ_rule').attr('y1', m.top).attr('y2', height - m.bottom).style('display', 'none');
      var readout = document.getElementById('kl_readout');
      var at = function(series, t) {
          if (!series.length || t < series[0][0] - 0.6 || t > series[series.length - 1][0] + 0.6) return null;
          for (var i = 1; i < series.length; i++) {
              if (t <= series[i][0]) return series[i - 1][1] + (series[i][1] - series[i - 1][1]) * Math.max(0, t - series[i - 1][0]) / (series[i][0] - series[i - 1][0] || 1);
          }
          return series[series.length - 1][1];
      };
      svg.append('rect').attr('x', m.left).attr('y', 0).attr('width', width - m.left - m.right).attr('height', height).attr('fill', 'transparent')
          .on('pointermove', function(ev) {
              var t = x.invert(d3.pointer(ev)[0]);
              rule.attr('x1', x(t)).attr('x2', x(t)).style('display', null);
              var parts = [];
              var r = t <= 2024.9 ? at(real, t) : null, g = t > 2024.8 && t <= nowT + 0.05 ? at(game, t) : null, p = t > nowT ? at(proj, t) : null;
              if (r !== null) parts.push('real ' + econNum(r, 0));
              if (g !== null) parts.push('Spiel ' + econNum(g, 0));
              if (p !== null) parts.push('Prognose ' + econNum(p, 0));
              if (t >= 2024.5) parts.push('KSG ' + econNum(at(ksg, Math.min(t, 2045.5)), 0), 'Paris ' + econNum(Math.max(0, at(paris, t)), 0));
              readout.textContent = Math.floor(t) + ': ' + parts.join(', ') + ' Mio. t';
          })
          .on('pointerleave', function() { rule.style('display', 'none'); });

      // Ring: aktueller Strommix
      var R = 72, g0 = d3.select('#kl_donut').append('g').attr('transform', 'translate(75,75)');
      g0.selectAll(null).data(d3.pie().sort(null)(mix.map(function(v) { return Math.max(0, v); }))).enter().append('path')
          .attr('class', function(d, k) { return 'kl_arc kl_m' + (k + 1); })
          .attr('d', d3.arc().innerRadius(R * 0.58).outerRadius(R).padAngle(0.01))
          .append('title').text(function(d, k) { return C.MIX[k] + ': ' + econNum(mix[k], 1) + ' %'; });
      g0.append('text').attr('class', 'kl_donut_big').attr('text-anchor', 'middle').attr('y', 4).text(econNum(ee, 0) + ' %');
      g0.append('text').attr('class', 'kl_donut_small').attr('text-anchor', 'middle').attr('y', 20).text('erneuerbar');

      // Sparklines der Preise (Spielverlauf, gestrichelt: 2024)
      KL_PRICES.forEach(function(p, i) {
          var el = document.getElementById('kl_spark' + i);
          if (!el) return;
          var w = el.clientWidth || 120, h = 34, base = KL_P0[i];
          var data = [[2024.85, base]].concat(recs.map(function(r) { return [toT(r.date), r.p[i]]; }));
          var lo = d3.min(data, function(d) { return d[1]; }), hi = d3.max(data, function(d) { return d[1]; });
          var pad = Math.max(0.5, (hi - lo) * 0.15);
          var xs = d3.scaleLinear([2024.85, Math.max(2025.2, nowT)], [2, w - 2]), ys = d3.scaleLinear([lo - pad, hi + pad], [h - 2, 2]);
          var sv = d3.select(el).attr('width', w).attr('height', h);
          sv.append('line').attr('class', 'kl_spark_base').attr('x1', 0).attr('x2', w).attr('y1', ys(base)).attr('y2', ys(base));
          sv.append('path').attr('class', 'kl_spark_line').attr('d', d3.line().x(function(d) { return xs(d[0]); }).y(function(d) { return ys(d[1]); })(data));
          sv.append('title').text(p[0] + ' seit November 2024 (gestrichelt: 2024)');
      });
  };

  // Gruppen-Reiter (Durchgang 4.5): Netzwerk der Interessengruppen und Bewegungen, Infokarte, Liste nach Lagern.
  // Daten und Modell: source/scenes/groups_data.scene.dry (dendryUI.game.GRP), Werte g_/gm_/gr_/ga_<id> in den Qualities.
  // Anordnung: Gruppen auf einem Kreis (Reihenfolge der Tabelle, Lücken zwischen den Lagern), andere Parteien auf einem
  // inneren Ring beim Mittel ihrer nahestehenden Gruppen, die Strömungen der Spielerpartei um die Mitte. Hängt nur von den
  // Tabellen und der Spielerpartei ab, springt also nicht von Monat zu Monat.
  window.grpSel = null;
  window.grpView = 'infl';
  var GRP_FACTIONS = [['left', 'f_left', 270], ['labor', 'f_labor', 325], ['center', 'f_center', 35], ['reformist', 'f_reformist', 90], ['neorevisionist', 'f_neorev', 180]];
  var grpWord = function(r) { return r >= 75 ? 'eng' : r >= 55 ? 'gut' : r >= 40 ? 'neutral' : r >= 20 ? 'distanziert' : 'feindselig'; };
  var grpRad = function(x) { return x < 0.05 ? 'keine' : x < 0.14 ? 'sehr gering' : x < 0.24 ? 'gering' : x < 0.44 ? 'eher gering' : x < 0.69 ? 'mittel' : x < 1 ? 'hoch' : 'sehr hoch'; };
  var grpEsc = function(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); };

  window.drawGroups = function() {
      var box = document.getElementById('groups_view');
      var Q = dendryUI.dendryEngine.state.qualities;
      if (!box || !window.d3 || Q.year === undefined) return;
      if (!dendryUI.game.GRP) dendryUI.dendryEngine._runActions(dendryUI.game.scenes.groups_data.onArrival);
      var GRP = dendryUI.game.GRP, P = Q.player == 'linke' ? 'linke' : 'spd';
      var zur = 'zur ' + (Q.pp_dat || 'der SPD').replace(/^der /, '');
      var camps = {};
      GRP.CAMPS.forEach(function(c, i) { camps[c.id] = {name: c.name, k: i + 1}; });
      // Werte (alte Spielstände ohne Gruppen: Startwerte)
      var G = GRP.groups.map(function(g) {
          var s = Q['g_' + g.id] !== undefined ? Q['g_' + g.id] : (g.link ? GRP.fromThousands(Q[g.link + '_strength']) : g.start);
          return {g: g, id: g.id, s: s, m: Q['gm_' + g.id] || 0, r: Q['gr_' + g.id] !== undefined ? Q['gr_' + g.id] : g.rel[P],
                  a: Q['ga_' + g.id] !== undefined ? Q['ga_' + g.id] : (s >= 10 ? 1 : 0), hist: (Q.grp_hist || {})[g.id] || [],
                  why: (Q.grp_why || {})[g.id] || ''};
      });
      var byId = {};
      G.forEach(function(d) { byId[d.id] = d; });
      var showNeo = Q.neorevisionism > 0;
      var facs = GRP_FACTIONS.filter(function(f) { return f[0] != 'neorevisionist' || showNeo; });
      var facName = {};
      facs.forEach(function(f) { facName[f[0]] = Q[f[1]] || f[0]; });
      var partyName = {spd: Q.pp_name || 'SPD', linke: Q.op_name || 'Linke', union: 'CDU/CSU', gruene: 'Grüne', fdp: 'FDP', bsw: 'BSW', afd: 'AfD'};
      var partyColor = {spd: Q.pp_color || '#E3000F', linke: Q.op_color || '#BE3075', union: '#151518', gruene: '#46962B', fdp: '#E6C800', bsw: '#7D254F', afd: '#009EE0'};
      var trendTxt = function(m) { return m > 0.4 ? '▲' : m < -0.4 ? '▼' : ''; };
      var num = function(x, dg) { return econNum(x, dg === undefined ? 0 : dg); };

      // Geometrie
      var W = box.clientWidth || 320, H = Math.round(Math.min(W, 560) * 0.98);
      var cx = W / 2, cy = H / 2, lab = W < 400 ? 50 : 66;
      var R = Math.min(W / 2, H / 2) - lab, k = Math.max(0.75, Math.min(1.2, W / 440));
      var n = G.length, gaps = 0;
      G.forEach(function(d, i) { if (i > 0 && G[i - 1].g.camp != d.g.camp) gaps++; });
      if (G[n - 1].g.camp != G[0].g.camp) gaps++;
      var slot = 2 * Math.PI / (n + 0.8 * gaps), ang = -slot / 2;
      G.forEach(function(d, i) {
          if (i > 0 && G[i - 1].g.camp != d.g.camp) ang += 0.8 * slot;
          d.ang = ang; ang += slot;
          d.x = cx + R * Math.sin(d.ang); d.y = cy - R * Math.cos(d.ang);
          d.rad = (4 + 10 * Math.sqrt(Math.max(0, d.s) / 100)) * k;
      });
      // andere Parteien: Kreismittel der Winkel ihrer Gruppen, dann auseinanderschieben
      var parties = ['linke', 'gruene', 'union', 'fdp', 'bsw', 'afd'].map(function(p) {
          var sx = 0, sy = 0, members = [];
          G.forEach(function(d) {
              (d.g.parties || []).forEach(function(pn) { if (GRP.slot(Q, pn) == p) { sx += Math.sin(d.ang); sy += Math.cos(d.ang); members.push(d.id); } });
          });
          return {p: p, ang: Math.atan2(sx, sy), members: members};
      }).filter(function(o) { return o.members.length; });
      parties.sort(function(a, b) { return a.ang - b.ang; });
      for (var it = 0; it < 40; it++) {
          for (var i = 0; i < parties.length; i++) {
              var a = parties[i], b = parties[(i + 1) % parties.length];
              var diff = b.ang - a.ang + (i == parties.length - 1 ? 2 * Math.PI : 0);
              if (diff < 0.5) { a.ang -= (0.5 - diff) / 2; b.ang += (0.5 - diff) / 2; }
          }
      }
      parties.forEach(function(o) { o.x = cx + 0.6 * R * Math.sin(o.ang); o.y = cy - 0.6 * R * Math.cos(o.ang); });
      var facPos = {};
      facs.forEach(function(f) {
          var a = f[2] * Math.PI / 180;
          facPos[f[0]] = {x: cx + 0.36 * R * Math.sin(a), y: cy - 0.36 * R * Math.cos(a), s: Q[f[0] + '_strength'] || 0};
      });

      // Kanten der gewählten Ansicht
      var edges = [];
      var view = window.grpView;
      if (view == 'infl') {
          G.forEach(function(d) {
              if (!d.a) return;
              var infl = d.g.infl[P] || {};
              for (var f in infl) {
                  if (!facPos[f]) continue;
                  var p = (d.s - d.g.base) / 20;
                  edges.push({a: d.id, b: 'f:' + f, x1: d.x, y1: d.y, x2: facPos[f].x, y2: facPos[f].y, sign: infl[f] > 0 ? 1 : -1,
                              w: 0.6 + 3.2 * Math.abs(infl[f]) * d.s / 100, o: 0.3 + 0.6 * Math.max(0, Math.min(1, p))});
              }
          });
      } else if (view == 'rel') {
          G.forEach(function(d) {
              if (!d.a || d.id == 'rechts') return;
              edges.push({a: d.id, b: 'player', x1: d.x, y1: d.y, x2: cx, y2: cy, sign: d.r >= 60 ? 1 : d.r <= 30 ? -1 : 0,
                          w: 0.6 + 3.5 * d.s / 100, o: 0.35 + 0.5 * Math.abs(d.r - 45) / 55});
          });
      } else {
          GRP.links.forEach(function(l) {
              var d1 = byId[l[0]], d2 = byId[l[1]];
              if (!d1 || !d2) return;
              // Sehne leicht zur Mitte gebogen
              edges.push({a: l[0], b: l[1], x1: d1.x, y1: d1.y, x2: d2.x, y2: d2.y, sign: l[2], curve: true,
                          w: 0.8 + 2.5 * Math.min(d1.s, d2.s) / 100, o: d1.a && d2.a ? 0.75 : 0.25});
          });
          parties.forEach(function(o) {
              o.members.forEach(function(id) {
                  var d = byId[id];
                  edges.push({a: id, b: 'p:' + o.p, x1: d.x, y1: d.y, x2: o.x, y2: o.y, sign: 0, w: 0.8, o: d.a ? 0.45 : 0.15});
              });
          });
      }

      // HTML-Gerüst
      var views = [['infl', 'Einfluss auf die Strömungen'], ['rel', 'Verhältnis ' + zur], ['links', 'Bündnisse und Gegner']];
      var html = '<div class="grp_views">' + views.map(function(v) {
          return '<button class="grp_view_btn' + (view == v[0] ? ' active' : '') + '" onclick="window.grpView=\'' + v[0] + '\'; window.drawGroups();">' + v[1] + '</button>';
      }).join('') + '</div>' +
          '<svg id="grp_graph" class="grp" role="img" aria-label="Netzwerk der Interessengruppen und Bewegungen"></svg>' +
          '<div class="econ_legend grp_legend">' +
          (view == 'links' ? '<span><span class="grp_line pos"></span>Bündnis</span><span><span class="grp_line neg"></span>Gegnerschaft</span><span><span class="grp_line neu"></span>nahe Partei</span>'
           : view == 'rel' ? '<span><span class="grp_line pos"></span>Verhältnis gut (ab 60)</span><span><span class="grp_line neu"></span>neutral</span><span><span class="grp_line neg"></span>schlecht (bis 30)</span>'
           : '<span><span class="grp_line pos"></span>stärkt</span><span><span class="grp_line neg"></span>schwächt</span><span>kräftig = Gruppe stärker als gewöhnlich</span>') +
          '</div><div class="econ_legend grp_legend">' + GRP.CAMPS.map(function(c, i) {
              return '<span><span class="econ_swatch grp_c' + (i + 1) + '"></span>' + c.name + '</span>';
          }).join('') + '</div>' +
          '<div id="grp_card" class="grp_card"></div>';

      // Liste nach Lagern
      html += '<h3 class="poll_heading">Alle Gruppen nach Lagern</h3><p class="poll_note">Balken = Stärke (0 bis 100), Pfeil = Konjunktur, Zahl rechts = Verhältnis ' + zur + '. Klicke für Details.</p>';
      GRP.CAMPS.forEach(function(c, ci) {
          var rows = G.filter(function(d) { return d.g.camp == c.id; });
          if (!rows.length) return;
          html += '<div class="grp_camp_head"><span class="econ_swatch grp_c' + (ci + 1) + '"></span>' + c.name + '</div>';
          rows.forEach(function(d) {
              html += '<div class="grp_row' + (d.a ? '' : ' inactive') + (window.grpSel == d.id ? ' sel' : '') + '" onclick="window.grpSel=\'' + d.id + '\'; window.drawGroups();" title="' +
                  grpEsc(d.g.name + ': Stärke ' + Math.round(d.s) + ', Verhältnis ' + Math.round(d.r)) + '">' +
                  '<span class="grp_rname">' + grpEsc(d.g.short) + (d.a ? '' : ' <i>(kaum aktiv)</i>') + '</span>' +
                  '<span class="grp_bar"><span class="grp_c' + (ci + 1) + '" style="width:' + Math.max(1, Math.min(100, d.s)) + '%"></span></span>' +
                  '<span class="grp_trend ' + (d.m > 0.4 ? 'up' : d.m < -0.4 ? 'down' : '') + '">' + (trendTxt(d.m) || '►') + '</span>' +
                  '<span class="grp_rel ' + (d.r >= 60 ? 'good' : d.r <= 30 ? 'bad' : '') + '">' + (d.id == 'rechts' ? '–' : Math.round(d.r)) + '</span></div>';
          });
      });
      html += '<p class="poll_note">Stärke: Mitglieder, Mobilisierung und Durchsetzungskraft im Verhältnis zueinander (Spielmodell). Sie folgt Wirtschaftslage, Ereignissen und Politik und hat eine eigene Konjunktur. Starke Gruppen verschieben die Strömungen ' + (Q.pp_dat || '') + ' und machen manche Vorhaben leichter oder schwerer. Mit der Karte „Bündnisarbeit“ lässt sich das Verhältnis gezielt verbessern oder auf Abstand gehen.</p>';
      box.innerHTML = html;

      // Zeichnen
      var svg = d3.select('#grp_graph').attr('width', W).attr('height', H).attr('viewBox', '0 0 ' + W + ' ' + H);
      svg.append('circle').attr('class', 'grp_ring').attr('cx', cx).attr('cy', cy).attr('r', R);
      var eg = svg.append('g');
      var path = function(e) {
          if (!e.curve) return 'M' + e.x1 + ',' + e.y1 + 'L' + e.x2 + ',' + e.y2;
          var mx = (e.x1 + e.x2) / 2, my = (e.y1 + e.y2) / 2;
          return 'M' + e.x1 + ',' + e.y1 + 'Q' + (mx + 0.45 * (cx - mx)) + ',' + (my + 0.45 * (cy - my)) + ' ' + e.x2 + ',' + e.y2;
      };
      var edgeSel = eg.selectAll(null).data(edges).enter().append('path')
          .attr('class', function(e) { return 'grp_edge ' + (e.sign > 0 ? 'pos' : e.sign < 0 ? 'neg' : 'neu'); })
          .attr('d', path).attr('stroke-width', function(e) { return e.w; }).attr('stroke-opacity', function(e) { return e.o; });
      // Spielerpartei und Strömungen
      var ng = svg.append('g');
      var nodes = [];
      nodes.push({key: 'player', x: cx, y: cy, kind: 'player'});
      // je Ansicht nur die nötigen Knoten: Strömungen beim Einfluss, andere Parteien bei Bündnissen
      if (view == 'infl') facs.forEach(function(f) { nodes.push({key: 'f:' + f[0], f: f[0], x: facPos[f[0]].x, y: facPos[f[0]].y, kind: 'fac'}); });
      if (view == 'links') parties.forEach(function(o) { nodes.push({key: 'p:' + o.p, p: o.p, x: o.x, y: o.y, kind: 'party', o: o}); });
      G.forEach(function(d) { nodes.push({key: d.id, d: d, x: d.x, y: d.y, kind: 'group'}); });
      var nodeSel = ng.selectAll(null).data(nodes).enter().append('g')
          .attr('class', function(nd) { return 'grp_node ' + nd.kind + (nd.d && !nd.d.a ? ' inactive' : ''); })
          .attr('transform', function(nd) { return 'translate(' + nd.x + ',' + nd.y + ')'; })
          .attr('tabindex', 0);
      nodeSel.each(function(nd) {
          var g = d3.select(this);
          if (nd.kind == 'player') {
              g.append('circle').attr('r', 17 * k).attr('fill', partyColor.spd).attr('class', 'grp_player');
              g.append('text').attr('class', 'grp_player_label').attr('dy', '0.35em').text(partyName.spd);
          } else if (nd.kind == 'fac') {
              var fs = facPos[nd.f].s;
              g.append('circle').attr('r', (3 + 6 * Math.sqrt(fs / 100)) * k).attr('class', 'grp_fac').attr('fill', partyColor.spd);
              var a = GRP_FACTIONS.filter(function(f) { return f[0] == nd.f; })[0][2];
              var right = a > 0 && a < 180;
              g.append('text').attr('class', 'grp_fac_label').attr('x', (right ? 1 : -1) * 9 * k).attr('dy', a == 180 ? '1.3em' : '0.35em')
                  .attr('text-anchor', a == 180 ? 'middle' : right ? 'start' : 'end').text(facName[nd.f]);
          } else if (nd.kind == 'party') {
              var sz = 7 * k;
              g.append('rect').attr('x', -sz).attr('y', -sz).attr('width', 2 * sz).attr('height', 2 * sz).attr('rx', 2)
                  .attr('class', 'grp_party ' + nd.p).attr('fill', partyColor[nd.p]);
              g.append('text').attr('class', 'grp_party_label').attr('y', sz + 9).attr('text-anchor', 'middle').text(partyName[nd.p]);
          } else {
              var d = nd.d, ci = camps[d.g.camp].k;
              g.append('circle').attr('r', d.rad).attr('class', 'grp_dot grp_c' + ci);
              var sin = Math.sin(d.ang), cos = Math.cos(d.ang);
              var lx = sin * (d.rad + 4), ly = -cos * (d.rad + 4);
              var anchor = Math.abs(sin) < 0.3 ? 'middle' : sin > 0 ? 'start' : 'end';
              var t = g.append('text').attr('class', 'grp_label').attr('x', lx).attr('y', ly)
                  .attr('dy', cos > 0.3 ? '-0.2em' : cos < -0.3 ? '0.9em' : '0.35em').attr('text-anchor', anchor);
              t.append('tspan').text(d.g.short);
              var tr = trendTxt(d.m);
              if (tr) t.append('tspan').attr('class', 'grp_arrow ' + (d.m > 0 ? 'up' : 'down')).text(' ' + tr);
          }
      });

      // Auswahl, Hervorhebung und Infokarte
      var neighbors = function(key) {
          var set = {}; set[key] = 1;
          edges.forEach(function(e) { if (e.a == key) set[e.b] = 1; if (e.b == key) set[e.a] = 1; });
          return set;
      };
      var highlight = function(key) {
          if (!key) { edgeSel.classed('dim', false).classed('hi', false); nodeSel.classed('dim', false).classed('sel', false); return; }
          var nb = neighbors(key);
          edgeSel.classed('dim', function(e) { return e.a != key && e.b != key; }).classed('hi', function(e) { return e.a == key || e.b == key; });
          nodeSel.classed('dim', function(nd) { return !nb[nd.key]; }).classed('sel', function(nd) { return nd.key == key; });
      };
      var spark = function(h) {
          h = h.slice(-24);
          if (h.length < 2) return '';
          var w = 110, hh = 26, mx = Math.max(10, d3.max(h)), mn = Math.min(d3.min(h), mx - 10);
          var pts = h.map(function(v, i) { return (i * w / (h.length - 1)).toFixed(1) + ',' + (hh - 2 - (v - mn) / (mx - mn) * (hh - 4)).toFixed(1); });
          return '<svg class="grp_spark" width="' + w + '" height="' + hh + '"><polyline points="' + pts.join(' ') + '"/></svg>';
      };
      var card = function(key) {
          var el = document.getElementById('grp_card');
          if (!el) return;
          if (!key) {
              el.innerHTML = '<span class="poll_note">Zeige auf einen Kreis oder tippe ihn an: Stärke, Verlauf, Verhältnis ' + zur + ' und Einfluss.</span>';
              return;
          }
          var h = '';
          if (byId[key]) {
              var d = byId[key], g = d.g, ci = camps[g.camp].k;
              var infl = g.infl[P] || {}, eff = [];
              for (var f in infl) if (facName[f]) eff.push((infl[f] > 0 ? 'stärkt ' : 'schwächt ') + facName[f]);
              var near = (g.parties || []).map(function(pn) { return partyName[GRP.slot(Q, pn)]; });
              var ally = GRP.allied(key).map(function(o) { return byId[o] ? byId[o].g.short : o; });
              var opp = GRP.opposed(key).map(function(o) { return byId[o] ? byId[o].g.short : o; });
              h = '<div class="grp_card_head"><span class="econ_swatch grp_c' + ci + '"></span><b>' + grpEsc(g.name) + '</b></div>' +
                  '<div class="poll_note">' + camps[g.camp].name + (d.a ? '' : ', derzeit kaum aktiv') + '</div>' +
                  '<div class="grp_card_stats"><div><span class="econ_label">Stärke</span><div class="econ_value">' + Math.round(d.s) + '<small>/100</small></div>' +
                  '<span class="econ_trend ' + (d.m > 0.4 ? 'up' : d.m < -0.4 ? 'down' : '') + '">' + (d.m > 0.4 ? '▲ wachsend' : d.m < -0.4 ? '▼ schwindend' : '► stabil') +
                  ' (' + (d.m > 0 ? '+' : '') + num(d.m, 1) + ' pro Monat)</span></div>' +
                  (d.hist.length >= 2 ? '<div>' + spark(d.hist) + '<div class="poll_note">letzte ' + Math.min(24, d.hist.length) + ' Monate</div></div>' : '') +
                  (key == 'rechts' ? '' : '<div><span class="econ_label">Verhältnis ' + zur + '</span><div class="econ_value">' + Math.round(d.r) +
                  '<small>/100</small></div><span class="econ_trend ' + (d.r >= 60 ? 'good' : d.r <= 30 ? 'bad' : '') + '">' + grpWord(d.r) + '</span></div>') + '</div>';
              if (g.link) h += '<div>Mobilisierung: rund ' + num(Q[g.link + '_strength'] || 0) + ' Tsd. Menschen, Radikalisierung: ' + grpRad(Q[g.link + '_radicalism'] || 0) + '</div>';
              if (d.why) h += '<div>Antrieb: ' + grpEsc(d.why) + '</div>';
              h += '<div>Fordert: ' + grpEsc(g.demand(Q)) + '</div>';
              if (eff.length) h += '<div>Wirkt in ' + (Q.pp_dat || 'der Partei') + ': ' + eff.join(', ') + (d.s > g.base + 5 ? ' (derzeit spürbar, weil stärker als gewöhnlich)' : '') + '</div>';
              h += '<div>' + (near.length ? 'Nahe: ' + near.join(', ') : '') + (ally.length ? ' · Verbündet: ' + ally.join(', ') : '') + (opp.length ? ' · Gegner: ' + opp.join(', ') : '') + '</div>' +
                  '<div class="poll_note">' + grpEsc(g.desc) + '</div>';
          } else if (key.slice(0, 2) == 'f:') {
              var fk = key.slice(2), press = [];
              G.forEach(function(d) {
                  var w = (d.g.infl[P] || {})[fk];
                  if (w && d.a) press.push(d.g.short + (w > 0 ? ' (stärkt)' : ' (schwächt)'));
              });
              h = '<div class="grp_card_head"><b>' + grpEsc(facName[fk]) + '</b></div><div class="poll_note">Strömung ' + (Q.pp_dat || '') + '</div>' +
                  '<div>Stärke: ' + num(Q[fk + '_strength'] || 0) + ' %, Unmut: ' + num(Q[fk + '_dissent'] || 0) + ' %</div>' +
                  '<div>Einfluss von außen: ' + (press.join(', ') || 'keiner') + '</div>';
          } else if (key.slice(0, 2) == 'p:') {
              var pk = key.slice(2), o = parties.filter(function(x) { return x.p == pk; })[0];
              h = '<div class="grp_card_head"><b>' + partyName[pk] + '</b></div>' +
                  (Q[pk + '_relation'] !== undefined ? '<div>Verhältnis ' + zur + ': ' + Math.round(Q[pk + '_relation']) + '</div>' : '') +
                  '<div>Nahestehende Gruppen: ' + o.members.map(function(id) { return byId[id].g.short; }).join(', ') + '</div>';
          } else {
              var good = G.filter(function(d) { return d.a && d.r >= 60 && d.id != 'rechts'; }), bad = G.filter(function(d) { return d.a && d.r <= 25 && d.id != 'rechts'; });
              h = '<div class="grp_card_head"><b>' + grpEsc(Q.pp_Full || 'Wir') + '</b></div>' +
                  '<div>Verbündete (Verhältnis ab 60): ' + (good.map(function(d) { return d.g.short; }).join(', ') || 'keine') + '</div>' +
                  '<div>Gegner (bis 25): ' + (bad.map(function(d) { return d.g.short; }).join(', ') || 'keine') + '</div>';
          }
          el.innerHTML = h;
      };
      nodeSel.on('mouseenter', function(ev, nd) { highlight(nd.key); card(nd.key); })
          .on('mouseleave', function() { highlight(window.grpSel); card(window.grpSel); })
          .on('click', function(ev, nd) { window.grpSel = window.grpSel == nd.key ? null : nd.key; highlight(window.grpSel); card(window.grpSel); })
          .on('keydown', function(ev, nd) { if (ev.key == 'Enter' || ev.key == ' ') { ev.preventDefault(); window.grpSel = nd.key; highlight(nd.key); card(nd.key); } });
      highlight(window.grpSel);
      card(window.grpSel);
  };

  // Umfrage-Tab: Verlauf seit Januar 2023, gesamt oder je Wählergruppe
  if (window.d3) {
      d3.timeFormatDefaultLocale({dateTime: '%A, der %e. %B %Y, %X', date: '%d.%m.%Y', time: '%H:%M:%S',
          periods: ['AM', 'PM'], days: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
          shortDays: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
          months: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
          shortMonths: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']});
  }
  // Realer Verlauf vor Spielbeginn (6. November 2024): Monatsmittel aller Institute Januar 2023 bis Oktober 2024 aus
  // de.wikipedia.org/wiki/Bundestagswahl_2025/Umfragen_und_Prognosen, Tabelle „Monatliche Mittelwerte“/„Ältere Mittelwerte“
  // (Linke April-Oktober 2024 aus den Einzelumfragen gemittelt, BSW ab der Gründung im Januar 2024). Sonstige = Rest auf 100.
  // Ab November 2024 Spielverlauf (bis November 2026 mit der Umfrageschwerkraft aus post_event). Wählergruppen liegen dafür nicht vor.
  var REAL_POLLS = [
      // Jahr, Monat, Union, AfD, SPD, Grüne, Linke, BSW, FDP
      [2023, 1, 27.9, 14.4, 19.7, 18.1, 5.0, null, 6.9],
      [2023, 2, 28.2, 14.9, 20.5, 17.0, 4.9, null, 6.8],
      [2023, 3, 29.0, 14.8, 19.9, 16.9, 4.9, null, 6.7],
      [2023, 4, 28.7, 15.4, 19.5, 16.3, 4.4, null, 7.4],
      [2023, 5, 28.9, 16.3, 18.8, 15.1, 4.7, null, 7.7],
      [2023, 6, 27.7, 18.9, 19.0, 14.2, 4.6, null, 7.2],
      [2023, 7, 26.8, 20.2, 18.2, 14.4, 4.8, null, 6.8],
      [2023, 8, 26.6, 20.6, 18.0, 14.4, 4.7, null, 6.9],
      [2023, 9, 26.9, 21.4, 17.0, 14.3, 4.7, null, 6.6],
      [2023, 10, 28.8, 21.4, 16.2, 13.9, 4.5, null, 5.6],
      [2023, 11, 29.6, 21.1, 15.8, 14.3, 4.1, null, 5.3],
      [2023, 12, 31.0, 21.7, 15.0, 13.7, 3.7, null, 5.1],
      [2024, 1, 30.8, 21.7, 14.5, 13.2, 3.9, 5.4, 4.8],
      [2024, 2, 30.5, 18.9, 15.0, 13.4, 3.2, 6.3, 4.3],
      [2024, 3, 30.3, 18.3, 15.4, 13.4, 3.1, 5.9, 4.8],
      [2024, 4, 30.2, 17.8, 15.6, 13.2, 3.4, 6.0, 4.9],
      [2024, 5, 30.6, 16.8, 15.6, 13.1, 3.4, 6.2, 5.0],
      [2024, 6, 30.4, 16.5, 15.3, 12.3, 3.0, 7.3, 5.1],
      [2024, 7, 30.6, 17.2, 14.7, 11.5, 3.0, 8.2, 5.1],
      [2024, 8, 31.1, 17.4, 15.2, 11.3, 3.0, 8.3, 4.9],
      [2024, 9, 32.3, 18.1, 14.7, 10.8, 2.9, 8.6, 4.0],
      [2024, 10, 31.5, 18.0, 15.9, 10.7, 3.0, 7.9, 3.9]
  ].map(function(r) {
      // Monatsmittel in der Monatsmitte
      var date = new Date(r[0], r[1] - 1, 15);
      var rec = {'date': date, 'union': r[2], 'afd': r[3], 'spd': r[4], 'gruene': r[5], 'linke': r[6],
                 'bsw': r[7], 'fdp': r[8]};
      rec.other = Math.round((100 - r.slice(2).reduce(function(s, x) { return s + (x || 0); }, 0)) * 10) / 10;
      return rec;
  });
  var POLL_COLORS = {'spd': '#E3000F', 'linke': '#BE3075', 'gruene': '#46962B', 'union': '#151518', 'fdp': '#E6C800',
                     'bsw': '#7D254F', 'afd': '#009EE0', 'other': '#a0a0a0', 'sapd': '#c40000', 'srpd': '#F4A460'};
  var POLL_GROUPS = {'workers': 'Arbeitnehmer*innen', 'new_middle': 'Akademische Mittelschicht',
                     'old_middle': 'Selbstständige & Mittelstand', 'rural': 'Ländlicher Raum',
                     'unemployed': 'Arbeitslose & Grundsicherung', 'rentner': 'Rentner*innen'};
  window.pollGroup = '';
  window.pollOpen = {};

  // Treiber des Umfragetrends im letzten Monat (post_event, Durchgang 4.7): Q.poll_why = [{t: Text, d: [[Partei, Punkte], ...]}]
  var pollWhy = function(Q, names) {
      if (!Q.poll_why || !Q.poll_why.length) return '';
      var num = function(v) { return (v > 0 ? '+' : '−') + Math.abs(v).toFixed(2).replace('.', ','); };
      return '<details class="poll_why"' + (window.pollWhyOpen ? ' open' : '') + ' ontoggle="window.pollWhyOpen = this.open;">' +
          '<summary>Was die Umfragen im letzten Monat bewegt hat</summary><ul>' +
          Q.poll_why.map(function(x) {
              return '<li>' + x.t + ': ' + x.d.map(function(e) { return (names[e[0]] || e[0]) + ' ' + num(e[1]); }).join(', ') + '</li>';
          }).join('') + '</ul><span class="poll_note">Prozentpunkte im Monat, dazu kommen unsere Entscheidungen und Ereignisse.</span></details>';
  };

  window.drawPolls = function() {
      var box = document.getElementById('poll_view');
      var Q = dendryUI.dendryEngine.state.qualities;
      if (!box || !window.d3 || !Q.classes || !Q.parties) return;
      // slot spd = player party, slot linke = the other left party (PORT_2026.md, "Spielbare Parteien")
      var names = {'spd': Q.pp_name || 'SPD', 'linke': Q.op_name || 'Linke', 'gruene': Q.gruene_name || 'Grüne', 'union': 'CDU/CSU', 'fdp': 'FDP',
                   'bsw': 'BSW', 'afd': 'AfD', 'other': 'Sonstige', 'sapd': 'Soziale Linke', 'srpd': 'Neue Mitte'};
      var colors = Object.assign({}, POLL_COLORS, {'spd': Q.pp_color || POLL_COLORS.spd, 'linke': Q.op_color || POLL_COLORS.linke});
      var parties = Q.parties;
      var groups = Q.classes.filter(function(c) { return POLL_GROUPS[c]; });

      // aktueller Stand aus den Rohwerten, gleiche Formel wie in post_event (dort erst nach dem ersten Zug berechnet);
      // ersetzt einen Monatseintrag mit demselben Datum
      var now = {'date': new Date(Q.year, Q.month - 1)};
      var support = {}, total = 0;
      for (var c of Q.classes) {
          var classVotes = 0;
          for (var p of parties) classVotes += Math.max(0, Q[c + '_' + p] || 0);
          for (var p of parties) {
              var share = classVotes ? 100 * Math.max(0, Q[c + '_' + p] || 0) / classVotes : 0;
              now[c + '_' + p] = share;
              support[p] = (support[p] || 0) + (Q[c] || 0) * (Q.old_demographics ? Math.max(0, Q[c + '_' + p] || 0) : share);
          }
      }
      for (var p of parties) total += support[p];
      for (var p of parties) now[p] = total ? 100 * support[p] / total : 0;
      var records = (Q.party_support_records || []).slice();
      var last = records[records.length - 1];
      if (last && new Date(last.date).getTime() == now.date.getTime()) records.pop();
      // the real SPD/Linke values belong into the swapped slots when the Linke is played
      var real = Q.player == 'linke' ? REAL_POLLS.map(function(r) {
          return Object.assign({}, r, {'spd': r.linke, 'linke': r.spd});
      }) : REAL_POLLS;
      records = real.concat(records, [now]);

      var group = groups.indexOf(window.pollGroup) >= 0 ? window.pollGroup : '';
      var data = records.map(function(r) {
          var d = {'date': r.date};
          for (var p of parties) d[p] = r[group ? group + '_' + p : p];
          return d;
      });

      // real: Q.poll_real (post_event, bis November 2026) = reale Monatsmittel je Slot zum Vergleich mit unserem Verlauf
      var bars = function(values, real) {
          var sorted = parties.filter(function(p) { return values[p] > 0; })
              .sort(function(a, b) { return values[b] - values[a]; });
          var max = values[sorted[0]] || 1;
          return '<div class="poll_bars">' + sorted.map(function(p) {
              return '<div class="poll_row"><span class="poll_name">' + names[p] + '</span>' +
                  '<span class="poll_bar"><span class="' + p + '" style="width:' + (100 * values[p] / max) +
                  '%;background:' + colors[p] + '"></span></span>' +
                  '<span class="poll_val">' + Math.round(values[p]) + ' %</span>' +
                  (real ? '<span class="poll_real">' + (real[p] !== undefined ? real[p].toFixed(1).replace('.', ',') : '–') + '</span>' : '') + '</div>';
          }).join('') + '</div>';
      };
      var real_now = !group && Q.poll_real ? Q.poll_real : 0;
      var stack = function(values) {
          return '<span class="poll_stack">' + parties.filter(function(p) { return values[p] > 0; }).map(function(p) {
              return '<span class="' + p + '" title="' + names[p] + ' ' + Math.round(values[p]) + ' %" style="flex-grow:' +
                  values[p] + ';background:' + colors[p] + '"></span>';
          }).join('') + '</span>';
      };
      var groupValues = function(c) {
          var v = {};
          for (var p of parties) v[p] = now[c + '_' + p];
          return v;
      };

      var select = function(label, current, varName) {
          return '<label class="poll_select">' + label + ': <select onchange="window.' + varName + ' = this.value; window.drawPolls();">' +
              '<option value="">Alle Wähler*innen</option>' + groups.map(function(c) {
                  return '<option value="' + c + '"' + (c == current ? ' selected' : '') + '>' + POLL_GROUPS[c] + '</option>';
              }).join('') + '</select></label>';
      };
      var nowGroup = groups.indexOf(window.pollNowGroup) >= 0 ? window.pollNowGroup : '';
      var html = select('Verlauf seit Januar 2023', group, 'pollGroup') +
          '<svg id="poll_graph"></svg>' +
          pollWhy(Q, names) +
          select('Aktuelle Umfrage', nowGroup, 'pollNowGroup') +
          bars(nowGroup ? groupValues(nowGroup) : now) +
          '<div class="poll_select">Wählergruppenübersicht</div><div class="poll_bars">' +
          groups.map(function(c) {
              var v = groupValues(c);
              var top = parties.reduce(function(a, b) { return v[b] > v[a] ? b : a; });
              return '<div class="poll_overview"><span class="poll_group_name">' + POLL_GROUPS[c] + '</span> <span class="poll_top">' +
                  names[top] + ' ' + Math.round(v[top]) + ' %</span>' + stack(v) + '</div>';
          }).join('') + '</div>';
      box.innerHTML = html;

      var width = box.clientWidth;
      var height = Math.min(360, Math.max(240, width * 0.6));
      var spanMonths = (now.date - REAL_POLLS[0].date) / (30 * 24 * 3600 * 1000);
      // Platz rechts für die Parteinamen
      var lines = d3.linegraph(true, false, parties, colors, names, undefined, undefined, Math.ceil(spanMonths * 0.15) + 1);
      lines.width(width).height(height);
      d3.select('#poll_graph').attr('width', width).attr('height', height).datum(data).call(lines);
  };

  window.changeTab = function(newTab, tabId) {
      if (tabId == 'poll_tab' && dendryUI.dendryEngine.state.qualities.historical_mode) {
          window.alert('Im historischen Modus sind keine Umfragen verfügbar.');
          return;
      }
      var tabButton = document.getElementById(tabId);
      var tabButtons = document.getElementsByClassName('tab_button');
      for (i = 0; i < tabButtons.length; i++) {
        tabButtons[i].className = tabButtons[i].className.replace(' active', '');
      }
      tabButton.className += ' active';
      window.statusTab = newTab;
      window.updateSidebar();
  };

  window.onDisplayContent = function() {
      window.updateSidebar();
  };

  /*
   * This function copied from the code for Infinite Space Battle Simulator
   *
   * quality - a number between max and min
   * qualityName - the name of the quality
   * max and min - numbers
   * colors - if true/1, will use some color scheme - green to yellow to red for high to low
   * */
  window.generateBar = function(quality, qualityName, max, min, colors) {
      var bar = document.createElement('div');
      bar.className = 'bar';
      var value = document.createElement('div');
      value.className = 'barValue';
      var width = (quality - min)/(max - min);
      if (width > 1) {
          width = 1;
      } else if (width < 0) {
          width = 0;
      }
      value.style.width = Math.round(width*100) + '%';
      if (colors) {
          value.style.backgroundColor = window.probToColor(width*100);
      }
      bar.textContent = qualityName + ': ' + quality;
      if (colors) {
          bar.textContent += '/' + max;
      }
      bar.appendChild(value);
      return bar;
  };


  window.justLoaded = true;
  window.statusTab = "status";
  window.dendryModifyUI = main;
  console.log("Modifying stats: see dendryUI.dendryEngine.state.qualities");

  window.increaseFontSize = function() {
        window.dendryUI.font_size += 0.1;
        var fs = window.dendryUI.font_size;
        var sidebar_fs = fs - 0.1;
        document.getElementById("content").setAttribute("style", "font-size: " + fs + "em;");
        document.getElementById("stats_sidebar").setAttribute("style", "font-size: " + sidebar_fs + "em;");
        document.getElementById('font_size_value').textContent = window.dendryUI.font_size.toFixed(1) + "em";
        window.dendryUI.saveSettings();
  }

  window.decreaseFontSize = function() {
        window.dendryUI.font_size -= 0.1;
        var fs = window.dendryUI.font_size;
        var sidebar_fs = fs - 0.1;
        document.getElementById("content").setAttribute("style", "font-size: " + fs + "em;");
        document.getElementById("stats_sidebar").setAttribute("style", "font-size: " + sidebar_fs + "em;");
        document.getElementById('font_size_value').textContent = window.dendryUI.font_size.toFixed(1) + "em";
        window.dendryUI.saveSettings();
  }

  window.onload = function() {
    window.dendryUI.loadSettings({show_portraits: false});
    // Engine-Texte (dendrynexus) ins Deutsche übertragen
    var alertDE = {'Saved.': 'Gespeichert.', 'Loaded.': 'Geladen.', 'No save available.': 'Kein Spielstand vorhanden.',
                   'Saving and loading is currently disabled.': 'Speichern und Laden ist derzeit deaktiviert.'};
    var origAlert = window.alert.bind(window);
    window.alert = function(msg) { origAlert(alertDE[msg] || msg); };
    var origPopulate = window.dendryUI.populateSaveSlots;
    window.dendryUI.populateSaveSlots = function() {
      origPopulate.apply(this, arguments);
      var de = {'Load': 'Laden', 'Save': 'Speichern', 'Empty': 'Leer'};
      document.querySelectorAll('[id^=save_button_], [id^=save_info_]').forEach(function(el) {
        if (de[el.textContent]) { el.textContent = de[el.textContent]; }
      });
    };
    window.dendryUI.language = "de";
    if (window.dendryUI.dark_mode) {
        document.body.classList.add('dark-mode');
    }
    // fresh browser profiles have no saved font size yet
    if (typeof window.dendryUI.font_size !== 'number') {
        window.dendryUI.font_size = 1.1;
    }
    if (window.dendryUI.font_size != 1.1) {
        var fs = window.dendryUI.font_size;
        var sidebar_fs = fs - 0.1;
        document.getElementById("content").setAttribute("style", "font-size: " + fs + "em;");
        document.getElementById("stats_sidebar").setAttribute("style", "font-size: " + sidebar_fs + "em;");
    }
    document.getElementById('font_size_value').textContent = window.dendryUI.font_size.toFixed(1) + "em";
    window.pinnedCardsDescription = "Beraterkarten: Aktionen sind nur alle 6 Monate nutzbar.";
  };

  window.handDescription = "Hand – klicke auf eine Karte, um sie auszuspielen.";
  window.deckDescription = "Stapel – klicke auf einen Stapel, um eine Karte zu ziehen.";
  window.pinnedCardsDescription = window.pinnedCardsDescription || "Beraterkarten: Aktionen sind nur alle 6 Monate nutzbar.";
}());
