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

  // TODO: have some code for tabbed sidebar browsing.
  window.updateSidebar = function() {
      $('#qualities').empty();
      var scene = dendryUI.game.scenes[window.statusTab];
      dendryUI.dendryEngine._runActions(scene.onArrival);
      var displayContent = dendryUI.dendryEngine._makeDisplayContent(scene.content, true);
      $('#qualities').append(dendryUI.contentToHTML.convert(displayContent));
      dendryUI.dendryEngine._runActions(scene.onDisplay);
      window.drawPolls();
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
      var names = {'spd': 'SPD', 'linke': 'Linke', 'gruene': Q.gruene_name || 'Grüne', 'union': 'CDU/CSU', 'fdp': 'FDP',
                   'bsw': 'BSW', 'afd': 'AfD', 'other': 'Sonstige', 'sapd': 'Soziale Linke', 'srpd': 'Neue Mitte'};
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
      records = REAL_POLLS.concat(records, [now]);

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
                  '%;background:' + POLL_COLORS[p] + '"></span></span>' +
                  '<span class="poll_val">' + Math.round(values[p]) + ' %</span></div>';
          }).join('') + '</div>';
      };
      var stack = function(values) {
          return '<span class="poll_stack">' + parties.filter(function(p) { return values[p] > 0; }).map(function(p) {
              return '<span class="' + p + '" title="' + names[p] + ' ' + Math.round(values[p]) + ' %" style="flex-grow:' +
                  values[p] + ';background:' + POLL_COLORS[p] + '"></span>';
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
      var lines = d3.linegraph(true, false, parties, POLL_COLORS, names, undefined, undefined, Math.ceil(spanMonths * 0.15) + 1);
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
