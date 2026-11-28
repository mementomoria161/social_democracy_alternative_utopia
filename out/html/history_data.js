// Historische Werte vor dem Spielstart (November 2024) für die Diagramme im Reiter „Klima“ (game.js, drawClimate).
//
// Regeln:
// - Werte mit nachprüfbarer Quelle. Wo keine frei zugängliche Quelle gefunden wurde, steht eine SCHÄTZUNG mit Begründung;
//   geschätzte Jahre stehen in „geschaetzt“ (bis einschließlich dieses Jahres) und erscheinen mit „≈“ im Tooltip.
//   Fehlt eine Reihe ganz, bleibt sie leer ([]); das Diagramm beginnt dann erst beim Spielstart.
// - Jahreswerte als [Jahr, Wert]; sie werden in der Jahresmitte eingezeichnet.
// - Neue Reihe: hier eintragen, Quelle direkt darüber als Kommentar, Eintrag in „missing“ streichen.
//
// Weitere reale Reihen, die an anderer Stelle liegen (alle mit Quelle dort):
// - Treibhausgase gesamt 1990-2023: source/scenes/climate_data.scene.dry (CLIM.REAL, UBA)
// - Wirtschaft (Arbeitslosenquote, Inflation, Wachstum 2019-2024): out/html/game.js (REAL_ECON)
// - Umfragen: out/html/game.js (REAL_POLLS)
window.HISTORY = {
    klima: {
        // Haushaltsstrom in ct/kWh, Jahresmittel für 3 500 kWh im Jahr: BDEW-Strompreisanalyse Dezember 2024
        // (2020 31,81 / 2021 32,16 / 2022 37,91 / 2023 45,73; 2024 40,92 ist der Startwert im Spiel).
        haushaltsstrom: [[2020, 31.81], [2021, 32.16], [2022, 37.91], [2023, 45.73]],
        // CO2-Preis Heizen und Tanken (nationaler Emissionshandel, BEHG) in Euro/t: gesetzlicher Festpreis
        // 2021 25, 2022 und 2023 je 30 (2024: 45, Startwert im Spiel). 2020 gab es noch keinen Preis.
        co2_national: [[2021, 25], [2022, 30], [2023, 30]],
        // Treibhausgase nach KSG-Sektoren in Mio. t CO2-Äquivalente, Reihenfolge wie CLIM.SECTORS (Energiewirtschaft, Industrie,
        // Gebäude, Verkehr, Landwirtschaft, Abfallwirtschaft und Sonstiges): UBA, „Emissionsübersichten KSG-Sektoren 1990-2025“
        // (xlsx, Blatt „THG kurz“, Seite zuletzt aktualisiert am 02.07.2026), auf 0,1 gerundet. 2024 ist der Startwert im Spiel.
        sektoren: [
            [[2020, 220.1], [2021, 247.8], [2022, 258.1], [2023, 204.8]],
            [[2020, 172.3], [2021, 180.1], [2022, 164.2], [2023, 149.7]],
            [[2020, 121.6], [2021, 118.0], [2022, 111.3], [2023, 102.4]],
            [[2020, 145.9], [2021, 146.8], [2022, 148.1], [2023, 144.5]],
            [[2020, 65.0], [2021, 64.2], [2022, 61.9], [2023, 62.7]],
            [[2020, 6.1], [2021, 5.9], [2022, 5.6], [2023, 5.4]]
        ],
        // Anteile an der Bruttostromerzeugung in %: Destatis, Bruttostromerzeugung in Deutschland (Stand 21.10.2026, Quelle AG
        // Energiebilanzen, Stand September 2026). Kohle = Braunkohle + Steinkohle. 2020 fehlt in der Tabelle (AGEB-Tabelle nachtragen).
        // 2020 SCHÄTZUNG: Erneuerbare 43,9 % (Destatis-Zeitreihe nach AGEB), Aufteilung nach Energieträgern geschätzt
        // (Wind rund 132 TWh, Photovoltaik rund 51 TWh, Erdgas rund 95 TWh, Braun- und Steinkohle rund 135 TWh von 577 TWh).
        strommix: {
            'Erneuerbare': [[2020, 43.9], [2021, 40.4], [2022, 44.1], [2023, 53.8]],
            'Wind': [[2020, 22.9], [2021, 19.7], [2022, 21.5], [2023, 27.7]],
            'Photovoltaik': [[2020, 8.8], [2021, 8.5], [2022, 10.6], [2023, 12.5]],
            'Erdgas': [[2020, 16.5], [2021, 15.2], [2022, 13.7], [2023, 15.0]],
            'Kohle': [[2020, 23.3], [2021, 27.8], [2022, 31.1], [2023, 24.4]]
        },
        // Gas für Haushalte in ct/kWh (Einfamilienhaus, alle Bestandteile), SCHÄTZUNG nach BDEW-Gaspreisanalysen: vor der Energiekrise
        // um 7 ct, 2022 Quartalswerte von knapp 16 bis knapp 20 ct, Frühjahr 2023 im Mittel 15,6 ct, 2024 12,3 ct (Startwert im Spiel).
        gas_haushalte: [[2020, 6.8], [2021, 7.2], [2022, 16.5], [2023, 13.5]],
        // Industriestrom in ct/kWh (Neuabschlüsse, mit Stromsteuer), SCHÄTZUNG nach BDEW-Strompreisanalysen: 2023 23,32 ct ohne
        // Stromsteuer (Dezember 2023) plus 1,54 ct Stromsteuer; 2020-2022 Größenordnung der BDEW-Reihe (Spitze 2022 über 40 ct).
        industriestrom: [[2020, 17.8], [2021, 21.4], [2022, 43.2], [2023, 24.9]],
        // geschätzt bis einschließlich dieses Jahres
        geschaetzt: {strommix: 2020, gas_haushalte: 2023, industriestrom: 2023},
        // EU-Emissionshandel, durchschnittlicher Zuschlagspreis der deutschen Versteigerungen in Euro/t: UBA/DEHSt, Jahresberichte
        // und Pressemitteilungen zu den Erlösen (2020 24,61, 2021 52,50, 2022 80,32, 2023 83,66). 2024 ist der Startwert im Spiel.
        eu_ets: [[2020, 24.61], [2021, 52.50], [2022, 80.32], [2023, 83.66]]
    },
    // Reihen ohne belegte Werte (Stand der Arbeit: November 2026). Anzeige beginnt beim Spielstart.
    // Quellen zum Nachtragen: Gas und Industriestrom: BDEW-Gaspreisanalyse bzw. Strompreisanalyse (Jahresmittel, gleiche Abnahmefälle wie im Spiel).
    // Umfragen nach Wählergruppen: monatlich nicht öffentlich (Politbarometer/GLES nur über GESIS, Veröffentlichung genehmigungspflichtig).
    // Eingezeichnet sind die Wahltagsbefragungen 2021 und 2024 (game.js, EXIT_POLLS); für den ländlichen Raum gibt es keine.
    // Geschätzt statt belegt (siehe oben): Strommix 2020 nach Energieträgern, Gaspreis für Haushalte, Industriestrompreis,
    // Umfragen nach Wählergruppen Januar 2023 bis Oktober 2024 (game.js, estimateGroup).
    missing: [
        'Strommix 2020 nach Energieträgern (geschätzt)',
        'Gaspreis für Haushalte 2020-2023 (geschätzt)',
        'Industriestrompreis 2020-2023 (geschätzt)',
        'Umfragen nach Wählergruppen vor November 2024 (monatlich geschätzt)'
    ]
};
