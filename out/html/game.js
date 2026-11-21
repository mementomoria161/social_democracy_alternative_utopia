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

  // Klima-Reiter in zwei Abschnitten: unten der aktuelle Stand aller drei Bereiche nebeneinander (Ring der Emissionen nach Sektoren,
  // Ring des Strommixes, Einschätzung der Energiepreise), oben der Verlauf als Liniendiagramm mit fester Zeitachse 2020-2045 und
  // zwei Auswahlen, links die Ansicht (Emissionen, Strommix, Energiepreise), rechts ein Filter (Sektor bzw. Preis). Daten und Modell: source/scenes/climate_data.scene.dry
  // (dendryUI.game.CLIM), Werte cl_* in den Qualities. Die beschlossenen Maßnahmen stehen auf der Karte „Klimaschutz und Energie“.
  // Reale Werte vor dem Spielstart (Jahresmittel, in der Jahresmitte eingezeichnet):
  // - Treibhausgase gesamt: CLIM.REAL (Umweltbundesamt).
  // - Haushaltsstrom 2020-2024: BDEW-Strompreisanalyse Dezember 2024 (31,81 / 32,16 / 37,91 / 45,73 / 40,92 ct/kWh, 3 500 kWh im Jahr).
  // - CO2-Preis Heizen und Tanken (BEHG): 2021 25, 2022 und 2023 je 30, 2024 45 Euro/t.
  // - Sektoren, Strommix, Gas und Industriestrom: real nur 2024 (Startwerte in CLIM).
  var KL_X0 = 2020, KL_X1 = 2045.5, KL_START = 2024 + 10 / 12;
  var KL_VIEWS = [['emis', 'Emissionen'], ['mix', 'Strommix'], ['preis', 'Energiepreise']];
  // [Name, Einheit, Nachkommastellen, reale Jahreswerte]
  var KL_PRICES = [['Haushaltsstrom', 'ct/kWh', 1, [[2020, 31.81], [2021, 32.16], [2022, 37.91], [2023, 45.73]]],
                   ['Gas für Haushalte', 'ct/kWh', 1, []],
                   ['Industriestrom', 'ct/kWh', 1, []],
                   ['CO2-Preis Heizen und Tanken', 'Euro/t', 0, [[2021, 25], [2022, 30], [2023, 30]]]];
  var KL_P0 = [40.9, 12.3, 17.2, 45];
  // Einschätzung der Preise (ANNAHME des Spiels): Obergrenzen für sehr niedrig, niedrig, mittel, hoch, darüber sehr hoch.
  // Grob an der Spanne 2020-2024 ausgerichtet (Haushaltsstrom 32-46 ct, Gas 7 bis über 15 ct, Industriestrom 17-43 ct, CO2 25-45 Euro).
  // Farbe aus Sicht der Verbraucher*innen (grün günstig, rot teuer); beim CO2-Preis ohne Farbe, weil er Klimaschutz bewirkt.
  var KL_LEVELS = [[28, 34, 40, 46], [7, 9.5, 12, 15], [12, 15, 19, 25], [30, 50, 80, 120]];
  var KL_WORDS = ['sehr niedrig', 'niedrig', 'mittel', 'hoch', 'sehr hoch'];
  // Strommix im Ring (aktueller Stand): [Name, Indizes in CLIM.MIX, Farbe]
  var KL_MIX_NOW = [['Wind', [0], '--kl-m1'], ['Photovoltaik', [1], '--kl-m2'], ['Biomasse, Wasser u. a.', [2, 3, 4], '--kl-m3'],
                    ['Erdgas', [5], '--kl-m6'], ['Kohle', [6, 7], '--kl-m8'], ['Sonstige', [8], '--kl-m9']];
  // Strommix zusammengefasst: [Name, Indizes in CLIM.MIX, Farbe]
  var KL_MIX = [['Erneuerbare', [0, 1, 2, 3, 4], '--kl-paris'], ['Wind', [0], '--kl-m1'], ['Photovoltaik', [1], '--kl-m2'],
                ['Erdgas', [5], '--kl-m6'], ['Kohle', [6, 7], '--kl-m8']];
  var KL_SEC_COLORS = ['--econ-s1', '--econ-s2', '--econ-s3', '--econ-s4', '--econ-s5', '--econ-s7'];
  window.klView = 'emis';
  window.klFilter = {emis: '', preis: '0'};

  window.drawClimate = function() {
      var box = document.getElementById('klima_view');
      var Q = dendryUI.dendryEngine.state.qualities;
      if (!box || !window.d3 || Q.year === undefined) return;
      if (!dendryUI.game.CLIM) dendryUI.dendryEngine._runActions(dendryUI.game.scenes.climate_data.onArrival);
      var C = dendryUI.game.CLIM;
      if (!Q.cl_st) {
          box.innerHTML = '<p class="poll_note">Dieser Spielstand ist älter als der Reiter „Klima“. Die Diagramme erscheinen nach dem nächsten Monatswechsel.</p>';
          return;
      }
      var view = KL_VIEWS.filter(function(v) { return v[0] == window.klView; })[0] ? window.klView : 'emis';
      var toT = function(d) { var dt = new Date(d); return dt.getFullYear() + dt.getMonth() / 12; };
      var nowT = Q.year + (Q.month - 1) / 12;
      var recs = (Q.cl_records || []).map(function(r) { return {t: toT(r.date), e: r.e, s: r.s, m: r.m, p: r.p}; });
      var nowRec = {t: nowT, e: Q.cl_total || 649.8, s: Q.cl_sec || C.START, m: Q.cl_mix || C.MIX_2024, p: (Q.cl_price || KL_P0).slice(0, 4)};
      if (!recs.length || recs[recs.length - 1].t < nowT - 0.01) recs.push(nowRec);
      // Verlauf einer Größe: reale Jahreswerte, Startwert im November 2024, dann Monatswerte des Spiels
      var hist = function(real, start, get) {
          return real.map(function(r) { return [r[0] + 0.5, r[1]]; }).concat([[KL_START, start]],
              recs.filter(function(r) { return r.t > KL_START + 0.01; }).map(function(r) { return [r.t, get(r)]; }));
      };
      var sum = function(a, idx) { return idx.reduce(function(x, k) { return x + (a[k] || 0); }, 0); };

      // Serien je Ansicht: {pts, color, cls, label, end}
      var series = [], unit = '', digits = 0, filter = null, marks = [];
      if (view == 'emis') {
          unit = 'Mio. t CO2-Äquivalente';
          filter = {key: 'emis', label: 'Sektor', options: [['', 'Gesamt'], ['alle', 'Alle Sektoren']].concat(C.SECTORS.map(function(s, i) { return [String(i), s.name]; }))};
          var fsec = window.klFilter.emis || '';
          if (fsec === '') {
              var proj = Q.cl_proj && Q.cl_proj.length ? Q.cl_proj : null;
              if (!proj) {
                  // vor dem ersten Monatswechsel: Prognose auf einer Kopie rechnen
                  var Qc = Object.assign({}, Q);
                  C.project(Qc);
                  proj = Qc.cl_proj;
              }
              var past = C.REAL.filter(function(r) { return r[0] >= 2018 && r[0] < 2024; });
              series.push({pts: hist(past, 650, function(r) { return r.e; }), color: '--kl-game', cls: 'main', label: 'Emissionen'});
              series.push({pts: proj, color: '--kl-game', cls: 'proj', label: 'Prognose', end: 'Prognose'});
              series.push({pts: [[KL_START, 650]].concat(C.KSG.map(function(k) { return [k[0] + 0.5, k[1]]; })), color: '--kl-ksg', cls: 'ksg',
                           label: 'Klimaschutzgesetz', end: 'Gesetz'});
              var zeroT = 2024 + 2 * C.BUDGET / C.co2Of(C.START);
              series.push({pts: [[2024, 650], [zeroT, 0], [KL_X1, 0]], color: '--kl-paris', cls: 'paris', label: 'Paris-Pfad', end: 'Paris'});
              marks.push({t: 2030.5, v: C.TARGET_2030, color: '--kl-ksg', text: 'Ziel 2030'});
          } else {
              C.SECTORS.forEach(function(s, i) {
                  if (fsec != 'alle' && fsec != String(i)) return;
                  series.push({pts: hist([], C.START[i], function(r) { return r.s[i]; }), color: KL_SEC_COLORS[i], cls: 'main', label: s.name,
                               end: s.name.split(' ')[0]});
                  if (fsec != 'alle') marks.push({t: 2030.5, v: s.t2030, color: KL_SEC_COLORS[i], text: 'Ziel 2030: ' + s.t2030});
              });
          }
      } else if (view == 'mix') {
          unit = 'Prozent der Stromerzeugung';
          KL_MIX.forEach(function(g) {
              series.push({pts: hist([], sum(C.MIX_2024, g[1]), function(r) { return sum(r.m, g[1]); }), color: g[2],
                           cls: g[0] == 'Erneuerbare' ? 'main bold' : 'main', label: g[0], end: g[0]});
          });
      } else {
          filter = {key: 'preis', label: 'Preis', options: KL_PRICES.map(function(p, i) { return [String(i), p[0]]; })};
          var pi = Math.max(0, Math.min(3, parseInt(window.klFilter.preis, 10) || 0)), P = KL_PRICES[pi];
          unit = P[1]; digits = P[2];
          series.push({pts: hist(P[3], KL_P0[pi], function(r) { return r.p[pi]; }), color: '--kl-game', cls: 'main', label: P[0]});
          // CO2-Preis im EU-Emissionshandel (Kraftwerke und Industrie) zum Vergleich
          if (pi == 3) series.push({pts: hist([], 65, function(r) { return r.p.length > 4 ? r.p[4] : null; }).filter(function(d) { return d[1] !== null; }),
                                    color: '--kl-ksg', cls: 'main', label: 'EU-Emissionshandel', end: 'EU-ETS'});
      }
      if (view == 'preis') series[0].end = econNum(series[0].pts[series[0].pts.length - 1][1], digits);

      // Auswahlen
      var sel = function(label, options, current, onchange) {
          return '<label class="poll_select">' + label + ': <select onchange="' + onchange + '">' + options.map(function(o) {
              return '<option value="' + o[0] + '"' + (o[0] == current ? ' selected' : '') + '>' + o[1] + '</option>';
          }).join('') + '</select></label>';
      };
      // Aktueller Stand, alle drei Bereiche auf einen Blick: Ring der Emissionen nach Sektoren, Ring des Strommixes,
      // Einschätzung der Energiepreise. Ein Klick wählt den Bereich (und Sektor bzw. Preis) für den Verlauf darüber.
      var go = function(v, key, val) {
          return 'window.klView = \'' + v + '\';' + (key ? ' window.klFilter.' + key + ' = \'' + val + '\';' : '') + ' window.drawClimate();';
      };
      var secNow = nowRec.s, secSum = secNow.reduce(function(a, b) { return a + b; }, 0);
      var rings = [
          {title: 'Emissionen', vals: secNow, colors: KL_SEC_COLORS, names: C.SECTORS.map(function(s) { return s.name; }),
           fmt: function(v) { return econNum(v, 0) + ' Mt'; }, big: econNum(secSum, 0), small: 'Mio. t',
           pick: function(k) { return go('emis', 'emis', String(k)); },
           sel: view == 'emis' && /^\d$/.test(window.klFilter.emis) ? window.klFilter.emis : null},
          {title: 'Strommix', vals: KL_MIX_NOW.map(function(g) { return sum(nowRec.m, g[1]); }), colors: KL_MIX_NOW.map(function(g) { return g[2]; }),
           names: KL_MIX_NOW.map(function(g) { return g[0]; }), fmt: function(v) { return econNum(v, 0) + ' %'; },
           big: econNum(sum(nowRec.m, [0, 1, 2, 3, 4]), 0) + ' %', small: 'erneuerbar',
           pick: function() { return go('mix'); }, sel: null}
      ];
      var top = '<div class="kl_now_grid">' + rings.map(function(r, j) {
          return '<div class="kl_panel' + ((j == 0 && view == 'emis') || (j == 1 && view == 'mix') ? ' sel' : '') + '"><div class="kl_panel_title">' + r.title + '</div>' +
              '<svg id="kl_ring' + j + '" class="kl_ring" width="120" height="120" role="img" aria-label="' + r.title + '"></svg><div class="kl_ringlegend">' +
              r.vals.map(function(v, k) {
                  return '<div class="kl_leg' + (r.sel === String(k) ? ' sel' : '') + '" onclick="' + r.pick(k) + '">' +
                      '<span class="econ_swatch" style="background:var(' + r.colors[k] + ')"></span>' +
                      '<span class="kl_leg_name">' + r.names[k] + '</span><span class="kl_leg_val">' + r.fmt(v) + '</span></div>';
              }).join('') + '</div></div>';
      }).join('') +
          '<div class="kl_panel kl_panel_prices' + (view == 'preis' ? ' sel' : '') + '"><div class="kl_panel_title">Energiepreise</div><div class="kl_levels">' +
          KL_PRICES.map(function(p, i) {
              var v = nowRec.p[i], lv = KL_LEVELS[i].filter(function(b) { return v >= b; }).length;
              return '<div class="kl_level' + (view == 'preis' && String(i) == window.klFilter.preis ? ' sel' : '') + '" onclick="' + go('preis', 'preis', i) + '">' +
                  '<div class="kl_level_name">' + p[0] + '</div><div class="kl_level_word' + (i < 3 ? ' l' + lv : '') + '">' + KL_WORDS[lv] + '</div>' +
                  '<div class="kl_level_num">' + econNum(v, p[2]) + ' ' + p[1] + '</div></div>';
          }).join('') + '</div></div></div>';
      box.innerHTML = '<h3 class="poll_heading">Verlauf</h3><div class="kl_controls">' +
          sel('Ansicht', KL_VIEWS, view, 'window.klView = this.value; window.drawClimate();') +
          (filter ? sel(filter.label, filter.options, window.klFilter[filter.key], 'window.klFilter.' + filter.key + ' = this.value; window.drawClimate();') : '') +
          '</div><svg id="kl_graph"></svg><div id="kl_readout" class="poll_note"></div>' +
          '<h3 class="poll_heading">Aktueller Stand</h3>' + top;
      rings.forEach(function(r, j) {
          var R = 58, g0 = d3.select('#kl_ring' + j).append('g').attr('transform', 'translate(60,60)');
          g0.selectAll(null).data(d3.pie().sort(null)(r.vals.map(function(v) { return Math.max(0, v); }))).enter().append('path')
              .attr('class', function(d, k) { return 'kl_arc' + (r.sel !== null && r.sel != String(k) ? ' dim' : ''); })
              .style('fill', function(d, k) { return 'var(' + r.colors[k] + ')'; })
              .on('click', function(ev, d) { (new Function(r.pick(d.index)))(); })
              .attr('d', d3.arc().innerRadius(R * 0.62).outerRadius(R).padAngle(0.012))
              .append('title').text(function(d, k) { return r.names[k] + ': ' + r.fmt(r.vals[k]); });
          g0.append('text').attr('class', 'kl_ring_big').attr('text-anchor', 'middle').attr('y', 4).text(r.big);
          g0.append('text').attr('class', 'kl_ring_small').attr('text-anchor', 'middle').attr('y', 18).text(r.small);
      });

      // Diagramm
      var width = box.clientWidth, height = Math.min(320, Math.max(230, width * 0.65));
      var m = {top: 22, right: 72, bottom: 26, left: 36};
      var svg = d3.select('#kl_graph').attr('width', width).attr('height', height);
      var x = d3.scaleLinear([KL_X0, KL_X1], [m.left, width - m.right]);
      var visible = function(d) { return d[0] >= KL_X0 - 1; };
      var hi = d3.max(series, function(s) { return d3.max(s.pts.filter(visible), function(d) { return d[1]; }); }) || 1;
      marks.forEach(function(mk) { hi = Math.max(hi, mk.v); });
      var yS = d3.scaleLinear([0, hi * 1.08], [height - m.bottom, m.top]).nice();
      var col = function(c) { return 'var(' + c + ')'; };
      svg.append('defs').append('clipPath').attr('id', 'kl_clip').append('rect')
          .attr('x', m.left).attr('y', 0).attr('width', width - m.left - m.right).attr('height', height);
      var startX = x(KL_START);
      svg.append('rect').attr('class', 'econ_real_band').attr('x', m.left).attr('y', m.top).attr('width', Math.max(0, startX - m.left))
          .attr('height', height - m.top - m.bottom);
      svg.append('line').attr('class', 'econ_start').attr('x1', startX).attr('x2', startX).attr('y1', m.top).attr('y2', height - m.bottom);
      svg.append('g').attr('class', 'econ_axis').attr('transform', 'translate(0,' + (height - m.bottom) + ')')
          .call(d3.axisBottom(x).tickValues(width > 340 ? [2020, 2025, 2030, 2035, 2040, 2045] : [2020, 2030, 2040]).tickFormat(d3.format('d')).tickSizeOuter(0));
      svg.append('g').attr('class', 'econ_axis').attr('transform', 'translate(' + m.left + ',0)')
          .call(d3.axisLeft(yS).ticks(5).tickFormat(function(v) { return econNum(v, 0); }).tickSize(-(width - m.left - m.right)))
          .call(function(g) { g.select('.domain').remove(); });
      svg.append('text').attr('class', 'econ_end_label kl_unit').attr('x', 0).attr('y', 10).text(unit);
      var line = d3.line().defined(function(d) { return d[1] !== null && d[1] !== undefined; })
          .x(function(d) { return x(d[0]); }).y(function(d) { return yS(d[1]); });
      var plot = svg.append('g').attr('clip-path', 'url(#kl_clip)');
      series.forEach(function(s) {
          plot.append('path').attr('class', 'kl_line ' + s.cls).style('stroke', col(s.color)).attr('d', line(s.pts));
          // Punkt auf dem aktuellen Wert (zu Spielbeginn gibt es nur diesen)
          if (s.cls.indexOf('main') >= 0) {
              var cur = s.pts.filter(function(d) { return d[0] <= nowT + 0.01 && d[1] !== null; }).pop();
              if (cur) svg.append('circle').attr('class', 'kl_now').style('fill', col(s.color)).attr('r', 3).attr('cx', x(cur[0])).attr('cy', yS(cur[1]));
          }
      });
      marks.forEach(function(mk) {
          svg.append('circle').attr('class', 'kl_target').style('stroke', col(mk.color)).attr('r', 4).attr('cx', x(mk.t)).attr('cy', yS(mk.v));
          svg.append('text').attr('class', 'econ_end_label').attr('x', x(mk.t) + 7).attr('y', yS(mk.v) - 6).text(mk.text);
      });
      // Beschriftung am rechten Ende (bei Serien, die bis 2045 reichen) bzw. am letzten Spielwert
      var labels = [];
      series.forEach(function(s) {
          if (!s.end) return;
          var last = s.pts[s.pts.length - 1];
          labels.push({text: s.end, color: s.color, x: Math.min(x(last[0]), width - m.right) + 5, y: yS(last[1]) + 4});
      });
      labels.sort(function(a, b) { return a.y - b.y; });
      for (var k = 1; k < labels.length; k++) {
          if (Math.abs(labels[k].x - labels[k - 1].x) < 60) labels[k].y = Math.max(labels[k].y, labels[k - 1].y + 13);
      }
      labels.forEach(function(lb) {
          svg.append('text').attr('class', 'econ_end_label').style('fill', col(lb.color)).attr('x', lb.x).attr('y', lb.y).text(lb.text);
      });

      // Hover: Werte aller Serien zum Zeitpunkt
      var at = function(pts, t) {
          pts = pts.filter(function(d) { return d[1] !== null && d[1] !== undefined; });
          if (!pts.length || t < pts[0][0] - 0.5 || t > pts[pts.length - 1][0] + 0.05) return null;
          if (t <= pts[0][0]) return pts[0][1];
          for (var i = 1; i < pts.length; i++) {
              if (t <= pts[i][0]) return pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * (t - pts[i - 1][0]) / (pts[i][0] - pts[i - 1][0] || 1);
          }
          return pts[pts.length - 1][1];
      };
      var rule = svg.append('line').attr('class', 'econ_rule').attr('y1', m.top).attr('y2', height - m.bottom).style('display', 'none');
      var readout = document.getElementById('kl_readout');
      var shortUnit = view == 'mix' ? ' %' : view == 'preis' ? ' ' + unit : ' Mio. t';
      readout.textContent = 'Zeige auf das Diagramm für einzelne Werte.';
      svg.append('rect').attr('x', m.left).attr('y', 0).attr('width', width - m.left - m.right).attr('height', height).attr('fill', 'transparent')
          .on('pointermove', function(ev) {
              var t = x.invert(d3.pointer(ev)[0]);
              rule.attr('x1', x(t)).attr('x2', x(t)).style('display', null);
              var parts = series.map(function(s) {
                  var v = at(s.pts, t);
                  return v === null ? null : s.label + ' ' + econNum(Math.max(0, v), view == 'preis' ? digits : 0);
              }).filter(function(p) { return p; });
              var when = t < KL_START ? String(Math.floor(t)) : econDate(new Date(Math.floor(t), Math.floor((t % 1) * 12 + 0.001)));
              readout.textContent = when + ': ' + (parts.length ? parts.join(', ') + shortUnit : 'keine Werte');
          })
          .on('pointerleave', function() { rule.style('display', 'none'); readout.textContent = 'Zeige auf das Diagramm für einzelne Werte.'; });
  };

  // Politik-Reiter (Durchgang 4.5, umgebaut Nov. 2026): Grafik mit drei Ansichten (Parteien, Strömungen, Gruppen), Infokarte,
  // darunter Übersicht aller Parteien, Strömungen und Gruppen. Daten und Modell: source/scenes/groups_data.scene.dry
  // (dendryUI.game.GRP), Werte g_/gm_/gr_/ga_<id> und gl_<a>_<b> in den Qualities. Anordnung: Gruppen gleichmäßig auf einem
  // Kreis (Reihenfolge der Tabelle), Parteien auf einem Kreis von links nach rechts, Strömungen um die Mitte.
  window.grpSel = null;
  window.grpView = 'parties';
  var GRP_FACTIONS = [['left', 'f_left', 270], ['labor', 'f_labor', 325], ['center', 'f_center', 35], ['reformist', 'f_reformist', 90], ['neorevisionist', 'f_neorev', 180]];
  // Eine Farbskala für alle Verhältnisse (Gruppen, Parteien): Stufen wie source/qdisplays/relationships.qdisplay.dry
  var GRP_REL = [[5, 'feindselig', '#7a0b0b'], [14.9, 'eisig', '#b3261e'], [29.9, 'kalt', '#e0533d'], [39.9, 'kühl', '#ef9a6a'],
                 [54.9, 'neutral', '#9a9a9a'], [64.9, 'warm', '#9fd67f'], [74.9, 'freundlich', '#56b85a'], [Infinity, 'sehr freundlich', '#1f8a3a']];
  // Unmut der Strömungen (qdisplays/dissent) auf dieselben Farben: wenig Unmut grün, viel Unmut rot
  var GRP_DIS = [[4.999, 'sehr gering', 7], [14.999, 'gering', 5], [30.999, 'mittel', 3], [49.999, 'hoch', 2], [Infinity, 'sehr hoch', 0]];
  var GRP_STR = [[10, 'kaum vorhanden'], [25, 'schwach'], [45, 'mittel'], [65, 'stark'], [Infinity, 'sehr stark']];
  var GRP_FSTR = [[10, 'schwach'], [25, 'mittel'], [40, 'stark'], [60, 'sehr stark'], [Infinity, 'dominant']]; // qdisplays/strength
  var GRP_PARTIES = ['linke', 'gruene', 'fdp', 'union', 'afd', 'bsw']; // Reihenfolge im Kreis der Parteien-Ansicht
  var grpStep = function(tab, x) { for (var i = 0; i < tab.length; i++) if (x < tab[i][0]) return tab[i]; return tab[tab.length - 1]; };
  var grpRel = function(r) { return grpStep(GRP_REL, r); };
  var grpDis = function(x) { var s = grpStep(GRP_DIS, x); return [s[0], s[1], GRP_REL[s[2]][2]]; };
  var grpRad = function(x) { return x < 0.05 ? 'keine' : x < 0.14 ? 'sehr gering' : x < 0.24 ? 'gering' : x < 0.44 ? 'eher gering' : x < 0.69 ? 'mittel' : x < 1 ? 'hoch' : 'sehr hoch'; };
  var grpEsc = function(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); };
  var grpWord = function(txt, col) { return '<b class="grp_word" style="color:' + col + '">' + txt + '</b>'; };
  var grpList = function(a) { return a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' und ' + a[a.length - 1]; };
  // lange Beschriftungen auf zwei Zeilen: am Leerzeichen, das der Mitte am nächsten liegt
  var grpLines = function(t) {
      if (t.length <= 14 || t.indexOf(' ') < 0) return [t];
      var best = -1;
      for (var i = 0; i < t.length; i++) if (t[i] == ' ' && (best < 0 || Math.abs(i - t.length / 2) < Math.abs(best - t.length / 2))) best = i;
      return [t.slice(0, best), t.slice(best + 1)];
  };

  window.drawGroups = function() {
      var box = document.getElementById('groups_view');
      var Q = dendryUI.dendryEngine.state.qualities;
      if (!box || !window.d3 || Q.year === undefined) return;
      if (!dendryUI.game.GRP) dendryUI.dendryEngine._runActions(dendryUI.game.scenes.groups_data.onArrival);
      var GRP = dendryUI.game.GRP, P = Q.player == 'linke' ? 'linke' : 'spd';
      var zur = 'zur ' + (Q.pp_dat || 'der SPD').replace(/^der /, '');
      // Werte (alte Spielstände ohne Gruppen: Startwerte)
      var G = GRP.groups.map(function(g) {
          var s = Q['g_' + g.id] !== undefined ? Q['g_' + g.id] : (g.link ? GRP.fromThousands(Q[g.link + '_strength']) : g.start);
          return {g: g, id: g.id, s: s, m: Q['gm_' + g.id] || 0, r: Q['gr_' + g.id] !== undefined ? Q['gr_' + g.id] : g.rel[P],
                  a: Q['ga_' + g.id] !== undefined ? Q['ga_' + g.id] : (s >= 10 ? 1 : 0), why: (Q.grp_why || {})[g.id] || ''};
      });
      var byId = {};
      G.forEach(function(d) { byId[d.id] = d; });
      var showNeo = Q.neorevisionism > 0;
      var facs = GRP_FACTIONS.filter(function(f) { return f[0] != 'neorevisionist' || showNeo; });
      var facName = {};
      facs.forEach(function(f) { facName[f[0]] = Q[f[1]] || f[0]; });
      var partyName = {spd: Q.pp_name || 'SPD', linke: Q.op_name || 'Linke', union: 'CDU/CSU', gruene: 'Grüne', fdp: 'FDP', bsw: 'BSW', afd: 'AfD'};
      var partyColor = {spd: Q.pp_color || '#E3000F', linke: Q.op_color || '#BE3075', union: '#151518', gruene: '#46962B', fdp: '#E6C800', bsw: '#7D254F', afd: '#009EE0'};
      // vor dem ersten Monatswechsel gibt es noch keine Spielumfrage: letzter realer Monatswert (Oktober 2024)
      var lastReal = REAL_POLLS[REAL_POLLS.length - 1];
      var votes = function(p) {
          if (Q[p + '_votes'] != null) return Math.max(0, Q[p + '_votes']);
          return lastReal[Q.player == 'linke' && (p == 'spd' || p == 'linke') ? (p == 'spd' ? 'linke' : 'spd') : p] || 0;
      };
      var trendWord = function(m) { return m > 0.4 ? 'wachsend' : m < -0.4 ? 'schwindend' : 'stabil'; };
      var trendTxt = function(m) { return m > 0.4 ? '▲' : m < -0.4 ? '▼' : ''; };
      var view = window.grpView == 'facs' || window.grpView == 'groups' ? window.grpView : 'parties';

      // Geometrie
      var W = box.clientWidth || 320, H = Math.round(Math.min(W, 560) * 0.98);
      var cx = W / 2, cy = H / 2, lab = W < 400 ? 64 : 76;
      var R = Math.min(W / 2, H / 2) - lab, k = Math.max(0.75, Math.min(1.2, W / 440));
      var slot = 2 * Math.PI / G.length;
      G.forEach(function(d, i) {
          d.ang = i * slot;
          d.x = cx + R * Math.sin(d.ang); d.y = cy - R * Math.cos(d.ang);
          // Fläche ~ Stärke, aber nicht größer als der Platz auf dem Kreis
          d.rad = Math.min((2 + 17 * Math.sqrt(Math.max(0, d.s) / 100)) * k, 0.45 * slot * R);
      });
      var parties = GRP_PARTIES.map(function(p, i) {
          var a = (-120 + i * 60) * Math.PI / 180; // links die linken, rechts die rechten Parteien, das BSW unten dazwischen
          return {p: p, x: cx + 0.8 * R * Math.sin(a), y: cy - 0.8 * R * Math.cos(a), sz: (4 + 26 * Math.sqrt(votes(p) / 100)) * k,
                  members: G.filter(function(d) { return (d.g.parties || []).some(function(pn) { return GRP.slot(Q, pn) == p; }); }).map(function(d) { return d.id; })};
      });
      var playerRad = (8 + 30 * Math.sqrt(votes('spd') / 100)) * k;
      var facPos = {};
      facs.forEach(function(f) {
          var a = f[2] * Math.PI / 180, s = Q[f[0] + '_strength'] || 0;
          facPos[f[0]] = {x: cx + 0.38 * R * Math.sin(a), y: cy - 0.38 * R * Math.cos(a), s: s, rad: (3 + 20 * Math.sqrt(s / 100)) * k};
      });

      // Kanten der gewählten Ansicht. col = Farbe der Verhältnisskala; own = Verhältnis zur Spielerpartei, nur bei Auswahl sichtbar
      var edges = [];
      var relEdge = function(a, b, x1, y1, x2, y2, r, w, extra) {
          var e = {a: a, b: b, x1: x1, y1: y1, x2: x2, y2: y2, col: grpRel(r)[2], w: w, o: 0.8};
          for (var key in extra) e[key] = extra[key];
          edges.push(e);
      };
      if (view == 'parties') {
          parties.forEach(function(o) {
              if (Q[o.p + '_relation'] !== undefined) relEdge('player', 'p:' + o.p, cx, cy, o.x, o.y, Q[o.p + '_relation'], 3 * k);
          });
      } else if (view == 'facs') {
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
          // Unmut der Strömungen gegenüber der Parteiführung
          facs.forEach(function(f) {
              var dis = Q[f[0] + '_dissent'] || 0;
              edges.push({a: 'player', b: 'f:' + f[0], x1: cx, y1: cy, x2: facPos[f[0]].x, y2: facPos[f[0]].y, col: grpDis(dis)[2], w: 2.5 * k, o: 0.9});
          });
      } else {
          GRP.links.forEach(function(l) {
              var d1 = byId[l[0]], d2 = byId[l[1]];
              if (!d1 || !d2) return;
              relEdge(l[0], l[1], d1.x, d1.y, d2.x, d2.y, GRP.linkVal(Q, l[0], l[1]), 0.8 + 2.5 * Math.min(d1.s, d2.s) / 100, {curve: true, o: d1.a && d2.a ? 0.8 : 0.25});
          });
          G.forEach(function(d) {
              if (d.a) relEdge('player', d.id, cx, cy, d.x, d.y, d.r, 0.6 + 3.2 * d.s / 100, {own: true});
          });
      }

      // HTML-Gerüst: Ansichten, Grafik, kurze Legende, Infokarte
      var views = [['parties', 'Parteien'], ['facs', 'Strömungen'], ['groups', 'Gruppen']];
      var scale = function(steps, from, to) {
          return '<span class="grp_scale">' + from + ' ' + steps.map(function(s) { return '<i style="background:' + s[0] + '" title="' + s[1] + '"></i>'; }).join('') + ' ' + to + '</span>';
      };
      var relScale = scale(GRP_REL.map(function(s) { return [s[2], s[1]]; }), 'feindselig', 'sehr freundlich');
      var legend = view == 'facs'
          ? '<span>Linien zur Mitte: Unmut ' + scale(GRP_DIS.map(function(s) { return [GRP_REL[s[2]][2], s[1]]; }), 'gering', 'hoch') + '</span>' +
            '<span><span class="grp_line pos"></span>stärkt</span><span><span class="grp_line neg"></span>schwächt die Strömung</span>'
          : '<span>Verhältnis ' + relScale + '</span>' + (view == 'groups' ? '<span>Tippe ' + partyName.spd + ' an für ihre Verhältnisse.</span>' : '');
      var html = '<div class="grp_views">' + views.map(function(v) {
          return '<button class="grp_view_btn' + (view == v[0] ? ' active' : '') + '" onclick="window.grpView=\'' + v[0] + '\'; window.grpSel=null; window.drawGroups();">' + v[1] + '</button>';
      }).join('') + '</div>' +
          '<svg id="grp_graph" class="grp" role="img" aria-label="Parteien, Strömungen und Gruppen"></svg>' +
          '<div class="econ_legend grp_legend">' + legend + '<span>Größe = Stärke</span></div>' +
          '<div id="grp_card" class="grp_card"></div>';

      // Übersicht mit Überschriften wie die übrigen Abschnitte des Reiters; Klick wählt in der Grafik aus
      var row = function(key, v, name, cells, extra) {
          return '<div class="grp_row' + (extra || '') + (window.grpSel == key ? ' sel' : '') + '" onclick="window.grpView=\'' + v + '\'; window.grpSel=\'' + key + '\'; window.drawGroups();">' +
              '<span class="grp_rname">' + name + '</span>' + cells + '</div>';
      };
      var relCell = function(r) { var s = grpRel(r); return '<span class="grp_rel" style="color:' + s[2] + '">' + s[1] + '</span>'; };
      html += '<h1>Parteien</h1><p class="poll_note">Umfragewert und Verhältnis ' + zur + '.</p>';
      GRP_PARTIES.forEach(function(p) {
          html += row('p:' + p, 'parties', partyName[p], '<span class="grp_val">' + econNum(votes(p), 0) + ' %</span>' + (Q[p + '_relation'] !== undefined ? relCell(Q[p + '_relation']) : ''));
      });
      html += '<h1>Strömungen</h1><p class="poll_note">Stärke in ' + (Q.pp_dat || 'der Partei') + ' und Unmut.</p>';
      facs.forEach(function(f) {
          var dis = grpDis(Q[f[0] + '_dissent'] || 0);
          html += row('f:' + f[0], 'facs', grpEsc(facName[f[0]]), '<span class="grp_val">' + grpStep(GRP_FSTR, Q[f[0] + '_strength'] || 0)[1] + '</span>' +
              '<span class="grp_rel" style="color:' + dis[2] + '">Unmut ' + dis[1] + '</span>');
      });
      html += '<h1>Gruppen</h1><p class="poll_note">Balken = Stärke, Pfeil = Konjunktur, rechts das Verhältnis ' + zur + '.</p>';
      G.forEach(function(d) {
          html += row(d.id, 'groups', grpEsc(d.g.short) + (d.a ? '' : ' <i>(kaum aktiv)</i>'),
              '<span class="grp_bar"><span style="background:' + d.g.color + ';width:' + Math.max(1, Math.min(100, d.s)) + '%"></span></span>' +
              '<span class="grp_trend ' + (d.m > 0.4 ? 'up' : d.m < -0.4 ? 'down' : '') + '">' + (trendTxt(d.m) || '►') + '</span>' + relCell(d.r), d.a ? '' : ' inactive');
      });
      html += '<p class="poll_note">Stärke: Mitglieder, Mobilisierung und Durchsetzungskraft im Verhältnis zueinander (Spielmodell). Sie folgt Wirtschaftslage, Ereignissen und Politik und hat eine eigene Konjunktur. Starke Gruppen verschieben die Strömungen ' + (Q.pp_dat || '') + ' und machen manche Vorhaben leichter oder schwerer. Mit der Karte „Bündnisarbeit“ lässt sich das Verhältnis gezielt verbessern oder auf Abstand gehen.</p>';
      box.innerHTML = html;

      // Zeichnen
      var svg = d3.select('#grp_graph').attr('width', W).attr('height', H).attr('viewBox', '0 0 ' + W + ' ' + H);
      if (view != 'parties') svg.append('circle').attr('class', 'grp_ring').attr('cx', cx).attr('cy', cy).attr('r', R);
      var eg = svg.append('g');
      var path = function(e) {
          if (!e.curve) return 'M' + e.x1 + ',' + e.y1 + 'L' + e.x2 + ',' + e.y2;
          var mx = (e.x1 + e.x2) / 2, my = (e.y1 + e.y2) / 2;
          return 'M' + e.x1 + ',' + e.y1 + 'Q' + (mx + 0.45 * (cx - mx)) + ',' + (my + 0.45 * (cy - my)) + ' ' + e.x2 + ',' + e.y2;
      };
      var edgeSel = eg.selectAll(null).data(edges).enter().append('path')
          .attr('class', function(e) { return 'grp_edge ' + (e.col ? 'rel' : e.sign > 0 ? 'pos' : 'neg') + (e.own ? ' own' : ''); })
          .style('stroke', function(e) { return e.col || null; })
          .attr('d', path).attr('stroke-width', function(e) { return e.w; }).attr('stroke-opacity', function(e) { return e.o; });
      // Knoten je Ansicht: Parteien, oder Gruppen (mit Strömungen), die Spielerpartei immer in der Mitte und zuletzt (oben)
      var ng = svg.append('g');
      var nodes = [];
      if (view == 'parties') parties.forEach(function(o) { nodes.push({key: 'p:' + o.p, p: o.p, x: o.x, y: o.y, kind: 'party', o: o}); });
      else {
          if (view == 'facs') facs.forEach(function(f) { nodes.push({key: 'f:' + f[0], f: f[0], x: facPos[f[0]].x, y: facPos[f[0]].y, kind: 'fac'}); });
          G.forEach(function(d) { nodes.push({key: d.id, d: d, x: d.x, y: d.y, kind: 'group'}); });
      }
      nodes.push({key: 'player', x: cx, y: cy, kind: 'player'});
      var nodeSel = ng.selectAll(null).data(nodes).enter().append('g')
          .attr('class', function(nd) { return 'grp_node ' + nd.kind + (nd.d && !nd.d.a ? ' inactive' : ''); })
          .attr('transform', function(nd) { return 'translate(' + nd.x + ',' + nd.y + ')'; })
          .attr('tabindex', 0);
      nodeSel.each(function(nd) {
          var g = d3.select(this);
          if (nd.kind == 'player') {
              g.append('circle').attr('r', playerRad).attr('fill', partyColor.spd).attr('class', 'grp_player');
              g.append('text').attr('class', 'grp_player_label').attr('dy', '0.35em').text(partyName.spd);
          } else if (nd.kind == 'fac') {
              var fp = facPos[nd.f];
              g.append('circle').attr('r', fp.rad).attr('class', 'grp_fac').attr('fill', partyColor.spd);
              var a = GRP_FACTIONS.filter(function(f) { return f[0] == nd.f; })[0][2];
              var right = a > 0 && a < 180;
              g.append('text').attr('class', 'grp_fac_label').attr('x', a == 180 ? 0 : (right ? 1 : -1) * (fp.rad + 3)).attr('y', a == 180 ? fp.rad + 3 : 0)
                  .attr('dy', a == 180 ? '0.8em' : '0.35em').attr('text-anchor', a == 180 ? 'middle' : right ? 'start' : 'end').text(facName[nd.f]);
          } else if (nd.kind == 'party') {
              var sz = nd.o.sz;
              g.append('rect').attr('x', -sz).attr('y', -sz).attr('width', 2 * sz).attr('height', 2 * sz).attr('rx', 2)
                  .attr('class', 'grp_party ' + nd.p).attr('fill', partyColor[nd.p]);
              g.append('text').attr('class', 'grp_party_label').attr('y', sz + 11).attr('text-anchor', 'middle').text(partyName[nd.p]);
          } else {
              var d = nd.d;
              g.append('circle').attr('r', d.rad).attr('class', 'grp_dot').attr('fill', d.g.color);
              var sin = Math.sin(d.ang), cos = Math.cos(d.ang);
              var lines = grpLines(d.g.short), tr = trendTxt(d.m);
              var anchor = Math.abs(sin) < 0.3 ? 'middle' : sin > 0 ? 'start' : 'end';
              var lx = sin * (d.rad + 4), ly = -cos * (d.rad + 4);
              // oben: Text über dem Punkt endet am Punkt, unten beginnt er dort
              var dy0 = cos > 0.3 ? -(lines.length - 1) * 1.1 - 0.2 : cos < -0.3 ? 0.9 : 0.35 - (lines.length - 1) * 0.55;
              var t = g.append('text').attr('class', 'grp_label').attr('y', ly).attr('text-anchor', anchor);
              lines.forEach(function(line, i) {
                  var ts = t.append('tspan').attr('x', lx).attr('dy', (i == 0 ? dy0 : 1.1) + 'em').text(line);
                  if (tr && i == lines.length - 1) t.append('tspan').attr('class', 'grp_arrow ' + (d.m > 0 ? 'up' : 'down')).text(' ' + tr);
              });
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
      var stat = function(label, word) { return '<div><span class="econ_label">' + label + '</span> ' + word + '</div>'; };
      var relTo = function(r) { var s = grpRel(r); return stat('Verhältnis ' + zur + ':', grpWord(s[1], s[2])); };
      var card = function(key) {
          var el = document.getElementById('grp_card');
          if (!el) return;
          if (!key) {
              el.innerHTML = '<span class="poll_note">Zeige auf einen Kreis oder tippe ihn an: Stärke, Verhältnis ' + zur + ' und Beschreibung.</span>';
              return;
          }
          var h = '';
          if (byId[key]) {
              var d = byId[key], g = d.g;
              var infl = g.infl[P] || {}, up = [], down = [];
              for (var f in infl) if (facName[f]) (infl[f] > 0 ? up : down).push(facName[f]);
              var near = (g.parties || []).map(function(pn) { return partyName[GRP.slot(Q, pn)]; });
              var short = function(o) { return byId[o] ? byId[o].g.short : o; };
              var ally = GRP.allied(key, Q).map(short), opp = GRP.opposed(key, Q).map(short);
              // Fließtext aus Beschreibung und aktuellem Stand
              var txt = g.desc;
              if (g.link) txt += ' Derzeit mobilisiert die Bewegung rund ' + econNum(Q[g.link + '_strength'] || 0, 0) + ' Tausend Menschen, ihre Radikalisierung ist ' + grpRad(Q[g.link + '_radicalism'] || 0) + '.';
              if (d.why) txt += ' Was sie gerade bewegt: ' + d.why + '.';
              txt += ' Sie fordert derzeit: ' + g.demand(Q) + '.';
              if (near.length) txt += ' Nahe stehen ' + grpList(near) + '.';
              if (ally.length) txt += ' Verbündet mit ' + grpList(ally) + (opp.length ? ', im Konflikt mit ' + grpList(opp) : '') + '.';
              else if (opp.length) txt += ' Im Konflikt mit ' + grpList(opp) + '.';
              if (up.length || down.length) txt += ' In ' + (Q.pp_dat || 'der Partei') + ' ' + (up.length ? 'stärkt sie ' + grpList(up) : '') + (up.length && down.length ? ' und ' : '') +
                  (down.length ? 'schwächt ' + grpList(down) : '') + (d.s > g.base + 5 ? ', derzeit spürbar, weil sie stärker ist als gewöhnlich' : '') + '.';
              h = '<div class="grp_card_head"><span class="econ_swatch" style="background:' + g.color + '"></span><b>' + grpEsc(g.name) + '</b></div>' +
                  (d.a ? '' : '<div class="poll_note">derzeit kaum aktiv</div>') +
                  '<div class="grp_card_stats">' + stat('Stärke:', '<b>' + grpStep(GRP_STR, d.s)[1] + '</b>, ' + trendWord(d.m)) + relTo(d.r) + '</div>' +
                  '<p class="grp_card_text">' + grpEsc(txt) + '</p>';
          } else if (key.slice(0, 2) == 'f:') {
              var fk = key.slice(2), up2 = [], down2 = [];
              G.forEach(function(d) {
                  var w = (d.g.infl[P] || {})[fk];
                  if (w && d.a) (w > 0 ? up2 : down2).push(d.g.short);
              });
              var dis = grpDis(Q[fk + '_dissent'] || 0);
              var ftxt = (GRP.FAC_DESC[P] || {})[fk] || '';
              if (fk == 'reformist' && P == 'spd' && Q.spd_prussia) ftxt += ' In den SPD-geführten Ländern haben sie großen Einfluss.'; // wie in der Bibliothek
              var ext = (up2.length ? 'Von außen gestärkt durch ' + grpList(up2) : '') + (up2.length && down2.length ? ', geschwächt durch ' : down2.length ? 'Von außen geschwächt durch ' : '') + grpList(down2);
              h = '<div class="grp_card_head"><b>' + grpEsc(facName[fk] || fk) + '</b></div><div class="poll_note">Strömung ' + (Q.pp_dat || '') + '</div>' +
                  '<div class="grp_card_stats">' + stat('Stärke:', '<b>' + grpStep(GRP_FSTR, Q[fk + '_strength'] || 0)[1] + '</b>') + stat('Unmut:', grpWord(dis[1], dis[2])) + '</div>' +
                  '<p class="grp_card_text">' + grpEsc(ftxt) + (ext ? ' <span class="poll_note">' + grpEsc(ext) + '.</span>' : '') + '</p>';
          } else if (key.slice(0, 2) == 'p:') {
              var pk = key.slice(2), o = parties.filter(function(x) { return x.p == pk; })[0];
              h = '<div class="grp_card_head"><b>' + partyName[pk] + '</b></div>' +
                  '<div class="grp_card_stats">' + stat('Umfrage:', '<b>' + econNum(votes(pk), 0) + ' %</b>') + (Q[pk + '_relation'] !== undefined ? relTo(Q[pk + '_relation']) : '') + '</div>' +
                  (o.members.length ? '<p class="grp_card_text">Nahestehende Gruppen: ' + grpList(o.members.map(function(id) { return byId[id].g.short; })) + '.</p>' : '');
          } else {
              var act = G.filter(function(d) { return d.a; });
              var good = act.filter(function(d) { return d.r >= 54.9; }), bad = act.filter(function(d) { return d.r < 29.9; });
              var names = function(a) { return grpList(a.map(function(d) { return d.g.short; })) || 'keine'; };
              var dis2 = grpDis(Q.dissent_percent || 0);
              h = '<div class="grp_card_head"><b>' + grpEsc(Q.pp_Full || partyName.spd) + '</b></div>' +
                  '<div class="grp_card_stats">' + stat('Umfrage:', '<b>' + econNum(votes('spd'), 0) + ' %</b>') + stat('Unmut in der Partei:', grpWord(dis2[1], dis2[2])) + '</div>' +
                  '<p class="grp_card_text">Gutes Verhältnis (warm oder besser): ' + names(good) + '. Schlechtes Verhältnis (kalt oder schlechter): ' + names(bad) + '.</p>';
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
