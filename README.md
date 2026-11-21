# Sozialdemokratie: Eine alternative Utopie

Browser-Textspiel über die Bundesrepublik der Gegenwart: ein Port von *Social Democracy: An Alternate History* (Autumn Chen, MIT) aus der Weimarer Republik 1928 in die Zeit ab dem Bruch der Ampel am 6. November 2024.

- **Zwei spielbare Parteien**: SPD oder Die Linke, von der Neuwahl 2025 über die Bundestagswahl 2029 bis Dezember 2030.
- **Wahlen** werden aus der Stimmung in sechs Wählergruppen berechnet (5-Prozent-Hürde, Grundmandatsklausel, Koalitionsbildung). Bis November 2026 folgen die Umfragen dem realen Verlauf, danach erklärbaren Treibern (Wirtschaft, Regierungsbilanz, Vertrauen, Klima, Bewegungen).
- **Reiter** für Status, Regierung (Kabinett, Bundestag), Politik, Wirtschaft (Kennzahlen, Wirtschaftsbereiche), Gruppen (Verbände und Bewegungen als Netzwerk), Klima (Emissionen, Strommix, Paris-Budget) und Umfragen.
- Was bis zum Spielstart geschah, ist belegt; alles danach ist Fiktion. Alle Bilder sind frei lizenziert (Nachweise in `credits_images.txt` und in den Credits).

Regeln für die Arbeit am Spiel: `AGENTS.md`. Plan, Entscheidungen und Stand: `PORT_2026.md`.

## Bauen und testen

```
npm ci                              # danach Windows-Patch aus AGENTS.md
npx dendrynexus make-html           # baut out/game.json
cp out/game.json out/html/
python -I tools/check_links.py      # 0 kaputte Verweise
node tools/sim.js . 20              # Zufallsläufe headless (Parameter: spd, linke, smart)
python -m http.server 8765 -d out/html
```

## Included Libraries

[jquery v1.11.1](https://releases.jquery.com/)

[d3.js v7](https://d3js.org)

[d3-parliament](https://github.com/geoffreybr/d3-parliament)

## Building the original game

1. Install [dendrynexus](https://github.com/aucchen/dendrynexus)

2. Run `dendrynexus make-html` in this folder.

To update dendrynexus in `package-lock.json`, run `npm install --upgrade https://github.com/aucchen/dendrynexus`
