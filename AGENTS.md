# AGENTS.md – Regeln für alle, die an diesem Spiel arbeiten (Menschen und KI-Agenten)

Spiel: **Sozialdemokratie: Eine alternative Utopie**, ein Port von *Social Democracy: An Alternate History* (Autumn Chen, MIT) in die Bundesrepublik der Gegenwart.
Gesamtplan und Entscheidungen: `PORT_2026.md`. Diese Datei hier ist verbindlich.

## Verbindliche Regeln

1. **Bildlizenzen.** Jedes Bild im Spiel muss frei verwendbar sein: **gemeinfrei (Public Domain), CC0, CC BY oder CC BY-SA** (jede Version). Verboten: NC (nicht kommerziell), ND (keine Bearbeitung), „Fair Use“, Pressefotos, Agenturbilder, Screenshots aus Medien, KI-Bilder mit unklarer Herkunft, alles ohne nachprüfbare Lizenz. Quelle ist in der Regel Wikimedia Commons.
   - Jedes neue Bild bekommt sofort einen Eintrag in `credits_images.txt` **und** in der Szene `source/scenes/credits.scene.dry` (Abschnitt „Bildquellen“): Datei, Urheber*in, Titel, Quell-URL, Lizenz mit Lizenz-URL. Bearbeitungen (Ausschnitt) vermerken.
   - Werkzeug: `python -I tools/commons_images.py jobs.json` (lädt nur erlaubte Lizenzen, hängt den Nachweis an `credits_images.txt` an; die Credits-Szene danach selbst nachziehen).
   - Ablage: `out/html/img/` (Themenbilder 960 px breit), Porträts `out/html/img/portraits/Name.jpg` (480 px, Umlaute als ae/oe/ue/ss, Leerzeichen als `_`).
   - Bilder für allgemeine Themen sollen für beide spielbaren Parteien passen; parteispezifische Szenen (Parteitag, Infostand, Wahlkampf) bekommen je ein eigenes Bild pro Partei.
2. **Sprache.** Alle Spieltexte direkt auf Deutsch im Quelltext, gendern mit Sternchen (`Arbeitnehmer*innen`). Kommentare im Code dürfen englisch oder deutsch sein.
3. **Reale Personen** respektvoll und politisch plausibel darstellen; nichts über ihr Privatleben erfinden. Was ab dem Spielstart passiert, ist Fiktion und wird als solche gekennzeichnet.
4. **Fakten bis heute** (Stand der Arbeit: November 2026) sollen stimmen: Wahlergebnisse, Umfragen, Wirtschafts- und Klimadaten mit Quelle (Destatis, Bundesagentur für Arbeit, Umweltbundesamt, AG Energiebilanzen, Bundeswahlleiterin, Wikipedia-Umfragetabellen). Quellen im Code-Kommentar nennen.
5. **Git.** Direkt auf `main` committen (das Repo ist ein Fork), ein Commit pro Meilenstein, deutsche Commit-Nachricht. Nicht pushen.
6. **Keine Git-Worktrees mit verlinktem `node_modules`** (Junction/Symlink): `git worktree remove --force` löscht sonst das echte `node_modules`. Für Vorher/Nachher-Vergleiche lieber `git stash` oder einen Build des alten Stands in ein Scratch-Verzeichnis. Lokaler Patch nach `npm ci`: in `node_modules/dendrynexus/lib/cli/utils.js` `sourcePath.replace(/\\/g, '/')` (Windows-Pfade).
7. **Vor jedem Commit**: Build, Linkprüfung und Simulation müssen sauber laufen (siehe unten). Keine Laufzeitfehler, keine Endlosschleifen.

## Bauen und testen

```
npx dendrynexus make-html          # baut out/game.json (Warnung "Overwriting existing HTML content" ist normal)
cp out/game.json out/html/
python -I tools/check_links.py     # 0 kaputte Verweise
node tools/sim.js . 20             # 20 Zufallsläufe headless; meldet Fehler, Endlosschleifen, gesehene Events
```

Browser: `.claude/launch.json` (`python -m http.server 8765 -d out/html`), dann `http://localhost:8765`.

## Architektur in Kürze

- **Engine**: dendrynexus (Dendry-Fork). Inhalte sind Szenen in `source/scenes/**/*.scene.dry`. Eine Datei = eine Szene, `@id` darin = Unterszene (`datei.id`).
- **Kopfzeilen**: `title`, `subtitle`, `tags` (`event`, `party_affairs`, `govt_affairs`, Berater-Tags), `view-if`, `choose-if`, `unavailable-subtitle`, `on-arrival` (einfache Syntax `a += 1; b = 2 if c > 3` oder JS in `{! ... !}` mit `Q` = Qualities), `go-to: ziel if bedingung; ...`, `max-visits`, `priority`, `card-image`, `face-image`, `set-bg`, `new-page`.
- **Text**: `[+ quality +]` fügt einen Wert ein, `[+ q : qdisplay +]` mit Anzeigeformat (`source/qdisplays/`), `[? if bedingung : Text ?]` bedingt. JS-Blöcke `{! ... !}` auch als `on-display` (z. B. für Diagramme).
- **Ablauf**: `root` (Startmenü, Startwerte in `root.start`) → `main` (Hand mit Partei-/Regierungsstapel und Beratern) → nach jeder Aktion `post_event`: Monatswechsel, Wirtschaftsmodell, jährliche Umfragedrift, dann Events (`#event`, sortiert nach `priority`), sonst zurück zu `main`.
- **Wahlen**: Unterstützung je Wählergruppe und Partei (`Q.<gruppe>_<partei>`, z. B. `workers_spd`), gewichtet mit der Größe der Gruppe (`Q.workers` …), normalisiert in `post_event` bzw. `election_algorithm`. Sitzanteile `Q.<partei>_r`. Bundestagswahl: `events/bundestagswahl.scene.dry` (5-%-Hürde, Koalitionsbildung).
- **Seitenleiste** (Reiter links): Knöpfe in `out/html/index.html` (`window.changeTab('status.<abschnitt>', '<button-id>')`), Inhalte als Abschnitte in `source/scenes/status.scene.dry`, Zeichencode in `out/html/game.js` (`updateSidebar`, `drawPolls`) oder in `on-display`-Blöcken. d3 v7 ist geladen (`d3-linegraph.js`, `d3-parliament.js` als Helfer). Styles in `out/html/game.css` (Hell- und Dunkelmodus beachten: `body.dark-mode`).
- **Zeitreihen**: `Q.party_support_records`, `Q.economic_records` werden in `post_event` monatlich angehängt. Neue Zeitreihen genauso anlegen und in Spielständen kompakt halten (Zahlen runden).
- **Strömungstexte**: Die Beschreibungen der Strömungen in der Bibliothek (`library.scene.dry`) und im Politik-Reiter (`GRP.FAC_DESC` in `groups_data.scene.dry`) müssen wörtlich gleich sein. Wer eine ändert, ändert beide.
- **Verhältnisse** (zu Parteien, Gruppen, zwischen Gruppen) immer auf der Skala 0–100 mit den Wörtern aus `qdisplays/relationships.qdisplay.dry` (feindselig … sehr freundlich); der Politik-Reiter färbt sie von Dunkelrot bis Grün (`GRP_REL` in `game.js`).
- **Neue Qualities** immer in `root.start` initialisieren (sonst `undefined` in alten Szenen und Spielständen; im JS defensiv mit `|| 0` lesen).

## Konventionen für mehrere spielbare Parteien

Siehe Abschnitt „Spielbare Parteien“ in `PORT_2026.md` (wird beim Einbau der Linken festgelegt und ist dann verbindlich).
