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

      // Kacheln: Wert jetzt und Veränderung gegenüber dem Vorjahresmonat (im ersten Spieljahr gegenüber dem realen Vorjahresmittel)
      var yearAgo = records.filter(function(r) {
          var d = new Date(r.date);
          return d.getFullYear() == Q.year - 1 && d.getMonth() == Q.month - 1;
      })[0] || REAL_ECON.filter(function(r) { return r.date.getFullYear() == Q.year - 1; })[0] || {};
      var tile = function(label, value, prev, unit, digits, better, note) {
          var trend = '';
          if (prev !== undefined && prev !== null) {
              var d = value - prev;
              var good = better(d);
              trend = Math.abs(d) < 0.05 ? '<span class="econ_trend">► wie im Vorjahr</span>' :
                  '<span class="econ_trend ' + (good ? 'good' : 'bad') + '">' + (d > 0 ? '▲ ' : '▼ ') +
                  (d > 0 ? '+' : '') + econNum(d, digits) + (unit ? ' Pkt.' : '') + ' ggü. Vorjahr</span>';
          }
          return '<div class="econ_tile"><div class="econ_label">' + label + '</div><div class="econ_value">' +
              econNum(value, digits) + unit + '</div>' + trend + (note ? '<div class="econ_trend">' + note + '</div>' : '') + '</div>';
      };
      var html = '<div class="econ econ_tiles">' +
          tile('Wachstum (Jahresrate)', now.growth, yearAgo.growth, ' %', 1, function(d) { return d > 0; }) +
          tile('Arbeitslosenquote', now.unemployment, yearAgo.unemployment, ' %', 1, function(d) { return d < 0; }) +
          tile('Inflation', now.inflation, yearAgo.inflation, ' %', 1,
               function(d) { return Math.abs(now.inflation - 2) < Math.abs(now.inflation - d - 2); }) +
          tile('Haushaltsspielraum', now.budget, yearAgo.budget, '', 0, function(d) { return d > 0; },
               now.budget < 0 ? 'im Defizit' : '') +
          '</div>';

      // Verlauf
      html += '<h3 class="poll_heading">Verlauf seit 2019</h3><div class="econ_legend">' + ECON_LINES.map(function(l, i) {
          return '<span><span class="econ_swatch s' + (i + 1) + '"></span>' + l[1] + '</span>';
      }).join('') + '</div><svg id="econ_graph" class="econ"></svg>' +
          '<div id="econ_readout" class="poll_note">Zeige auf das Diagramm für einzelne Werte.</div>' +
          '<p class="poll_note">2019 bis 2024 reale Jahreswerte (Destatis, Bundesagentur für Arbeit), ab dem Spielstart im November 2024 Monatswerte des Spielverlaufs. Inflationsspitze real: 8,8 % im Oktober 2022.</p>';

      // Sektoren
      var started = Q.sector_value && Q.sector_value.length == ECON_SECTORS.length;
      var values = started ? Q.sector_value : ECON_SECTORS.map(function(s) { return s.share * 39.796; });
      var rates = started ? Q.sector_growth : ECON_SECTORS.map(function() { return null; });
      var total = values.reduce(function(a, b) { return a + b; }, 0);
      var srec = Q.sector_records || [];
      var lastYear = srec.filter(function(r) {
          var d = new Date(r.date);
          return d.getFullYear() == Q.year - 1 && d.getMonth() == Q.month - 1;
      })[0];
      var rows = ECON_SECTORS.map(function(s, i) {
          var start = s.share * 39.796;
          return {s: s, i: i, value: values[i], share: 100 * values[i] / total, rate: rates[i],
                  yoy: lastYear ? 100 * (values[i] / lastYear.v[i] - 1) : null,
                  jobs: s.jobs * (1 + 0.5 * (values[i] / start - 1)), why: (Q.sector_why || [])[i] || ''};
      });
      var maxRate = Math.max(3, d3.max(rows, function(r) { return Math.abs(r.rate || 0); }));
      html += '<h3 class="poll_heading">Wachstum der Wirtschaftsbereiche</h3>' +
          '<p class="poll_note">Aktuelle Jahresrate der realen Wertschöpfung, sortiert. Klicke auf einen Bereich für Details.</p>' +
          '<div class="econ">' + rows.slice().sort(function(a, b) { return (b.rate || 0) - (a.rate || 0); }).map(function(r) {
          var w = r.rate === null ? 0 : 50 * Math.abs(r.rate) / maxRate;
          var bar = '<span class="econ_div"><span class="econ_zero"></span><span class="' + (r.rate < 0 ? 'neg' : 'pos') +
              '" style="width:' + w + '%;' + (r.rate < 0 ? 'right:50%' : 'left:50%') + '"></span></span>';
          return '<details class="poll_group"' + (window.econOpen[r.s.id] ? ' open' : '') +
              ' ontoggle="window.econOpen[\'' + r.s.id + '\'] = this.open;"><summary class="econ_row" title="' + r.s.name + ': ' +
              (r.rate === null ? '' : econNum(r.rate) + ' % Wachstum, ') + econNum(r.share) + ' % der Wertschöpfung">' +
              '<span class="econ_name">' + r.s.name + '</span>' + bar +
              '<span class="econ_val">' + (r.rate === null ? '–' : (r.rate > 0 ? '+' : '') + econNum(r.rate) + ' %') + '</span></summary>' +
              '<div class="econ_detail">Anteil an der Bruttowertschöpfung: <b>' + econNum(r.share) + ' %</b> (2024: ' + econNum(r.s.share) + ' %), ' +
              'rund ' + econNum(r.value, 0) + ' Mrd. Euro (Preise von 2024)<br>' +
              (r.yoy !== null ? 'Veränderung gegenüber dem Vorjahresmonat: ' + (r.yoy > 0 ? '+' : '') + econNum(r.yoy) + ' %<br>' : '') +
              'Erwerbstätige: rund ' + econNum(r.jobs / 1000) + ' Mio. (2024: ' + econNum(r.s.jobs / 1000) + ' Mio.)<br>' +
              (r.why ? 'Einflüsse: ' + r.why + '<br>' : '') + '<span class="poll_note">' + r.s.text + '</span></div></details>';
      }).join('') + '</div>';

      // Zusammensetzung: ein gestapelter Balken je Jahr (Dezemberwert, im laufenden Jahr der aktuelle Stand)
      var shareBar = function(vals) {
          var sum = vals.reduce(function(a, b) { return a + b; }, 0);
          var groups = ECON_GROUPS.map(function() { return 0; });
          vals.forEach(function(v, i) { groups[ECON_SECTORS[i].group] += 100 * v / sum; });
          return '<span class="econ_stack">' + groups.map(function(g, k) {
              return '<span class="g' + (k + 1) + '" title="' + ECON_GROUPS[k] + ': ' + econNum(g) + ' %" style="flex-grow:' + g + '"></span>';
          }).join('') + '</span>';
      };
      var years = [['2024', ECON_SECTORS.map(function(s) { return s.share; })]];
      for (var y = 2025; y < Q.year; y++) {
          var dec = srec.filter(function(r) { var d = new Date(r.date); return d.getFullYear() == y && d.getMonth() == 11; })[0];
          if (dec) years.push([String(y), dec.v]);
      }
      if (started && Q.year > 2024) years.push([econDate(now.date), values]);
      html += '<h3 class="poll_heading">Anteile an der Wertschöpfung</h3><div class="econ">' + years.map(function(y) {
          return '<div class="econ_year"><span class="econ_year_label">' + y[0] + '</span>' + shareBar(y[1]) + '</div>';
      }).join('') + '<div class="econ_legend">' + ECON_GROUPS.map(function(g, k) {
          return '<span><span class="econ_swatch g' + (k + 1) + '"></span>' + g + '</span>';
      }).join('') + '</div></div>' +
          '<p class="poll_note">2024 Anteile in jeweiligen Preisen (Destatis, teils geschätzt), danach Spielmodell: Jeder Bereich wächst mit eigenem Trend um das Gesamtwachstum; Krisen, Zölle, Investitionen und Energiepreise verschieben die Gewichte.</p>';
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
      var x0 = x(GAME_START);
      svg.append('rect').attr('class', 'econ_real_band').attr('x', m.left).attr('y', m.top)
          .attr('width', Math.max(0, x0 - m.left)).attr('height', height - m.top - m.bottom);
      svg.append('text').attr('class', 'econ_band_label').attr('x', m.left + 4).attr('y', m.top + 11).text('real');
      svg.append('text').attr('class', 'econ_band_label').attr('x', x0 + 4).attr('y', m.top + 11).text('Spiel');
      svg.append('line').attr('class', 'econ_start').attr('x1', x0).attr('x2', x0).attr('y1', m.top).attr('y2', height - m.bottom);
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
          svg.selectAll(null).data(series.filter(function(d) { return d.real; })).enter().append('circle')
              .attr('class', 'econ_dot s' + (i + 1)).attr('r', 4)
              .attr('cx', function(d) { return x(d.date); }).attr('cy', function(d) { return yS(d[l[0]]); });
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
              readout.textContent = (d.real ? new Date(d.date).getFullYear() + ' (real, Jahresmittel)' : econDate(d.date)) + ': ' +
                  ECON_LINES.filter(function(l) { return typeof d[l[0]] == 'number'; }).map(function(l) { return l[1] + ' ' + econNum(d[l[0]]) + ' %'; }).join(', ');
          })
          .on('pointerleave', function() { rule.style('display', 'none'); });
  };

  // Umfrage-Tab: Verlauf seit der Bundestagswahl 2021, gesamt oder je Wählergruppe
  if (window.d3) {
      d3.timeFormatDefaultLocale({dateTime: '%A, der %e. %B %Y, %X', date: '%d.%m.%Y', time: '%H:%M:%S',
          periods: ['AM', 'PM'], days: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
          shortDays: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
          months: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
          shortMonths: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']});
  }
  // Realer Verlauf vor Spielbeginn (6. November 2024): amtliches Endergebnis der Bundestagswahl vom 26.09.2021
  // (Zweitstimmen, Bundeswahlleiterin) als Anker, dann Monatsmittel aller Institute Januar bis Oktober 2024 aus
  // de.wikipedia.org/wiki/Bundestagswahl_2025/Umfragen_und_Prognosen (Linke aus den Einzelumfragen gemittelt,
  // BSW ab der Gründung im Januar 2024). Sonstige = Rest auf 100. Ab November 2024 Spielverlauf
  // (bis Januar 2026 mit der Umfrageschwerkraft aus post_event). Wählergruppen liegen dafür nicht vor.
  var REAL_POLLS = [
      // Jahr, Monat, Union, AfD, SPD, Grüne, Linke, BSW, FDP
      [2021, 9.85, 24.1, 10.3, 25.7, 14.8, 4.9, null, 11.5],
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
      // Monatsmittel in der Monatsmitte, die Wahl (9.85) am 26. September 2021
      var date = r[1] == 9.85 ? new Date(2021, 8, 26) : new Date(r[0], r[1] - 1, 15);
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

      var bars = function(values) {
          var sorted = parties.filter(function(p) { return values[p] > 0; })
              .sort(function(a, b) { return values[b] - values[a]; });
          var max = values[sorted[0]] || 1;
          return '<div class="poll_bars">' + sorted.map(function(p) {
              return '<div class="poll_row"><span class="poll_name">' + names[p] + '</span>' +
                  '<span class="poll_bar"><span class="' + p + '" style="width:' + (100 * values[p] / max) +
                  '%;background:' + colors[p] + '"></span></span>' +
                  '<span class="poll_val">' + Math.round(values[p]) + ' %</span></div>';
          }).join('') + '</div>';
      };
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

      var html = '<label class="poll_select">Verlauf seit der Bundestagswahl 2021: <select onchange="window.pollGroup = this.value; window.drawPolls();">' +
          '<option value="">Alle Wähler*innen</option>' + groups.map(function(c) {
              return '<option value="' + c + '"' + (c == group ? ' selected' : '') + '>' + POLL_GROUPS[c] + '</option>';
          }).join('') + '</select></label>' +
          '<svg id="poll_graph"></svg>' +
          '<p class="poll_note">Bundestagswahl 2021 und Januar bis Oktober 2024 reale Umfragen (Monatsmittel aller Institute, Quelle: Wikipedia), ab November 2024 Spielverlauf.</p>' +
          '<h3 class="poll_heading">Aktuell' + (group ? ': ' + POLL_GROUPS[group] : '') + '</h3>' +
          bars(group ? groupValues(group) : now) +
          '<h3 class="poll_heading">Nach Wählergruppen</h3>' +
          groups.map(function(c) {
              var v = groupValues(c);
              var top = parties.reduce(function(a, b) { return v[b] > v[a] ? b : a; });
              return '<details class="poll_group"' + (window.pollOpen[c] ? ' open' : '') +
                  ' ontoggle="window.pollOpen[\'' + c + '\'] = this.open;"><summary><span class="poll_group_name">' +
                  POLL_GROUPS[c] + '</span> <span class="poll_top">' + names[top] + ' ' + Math.round(v[top]) + ' %</span>' +
                  stack(v) + '</summary>' + bars(v) +
                  '<button class="b poll_show" onclick="window.pollGroup = \'' + c + '\'; window.drawPolls(); ' +
                  'document.getElementById(\'poll_view\').scrollIntoView({behavior: \'smooth\'});">' +
                  (c == group ? 'Wird oben angezeigt' : 'Im Verlauf oben anzeigen') + '</button></details>';
          }).join('');
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
