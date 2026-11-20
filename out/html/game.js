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
