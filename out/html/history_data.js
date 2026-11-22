// Historische Werte vor dem Spielstart (November 2024) für die Diagramme im Reiter „Klima“ (game.js, drawClimate).
//
// Regeln:
// - Nur Werte mit nachprüfbarer Quelle. Fehlt eine Reihe, bleibt sie leer ([]); das Diagramm beginnt dann erst beim Spielstart
//   (die Zeitachse richtet sich nach der frühesten vorhandenen Reihe der Ansicht). Werte nie schätzen oder erfinden.
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
        co2_national: [[2021, 25], [2022, 30], [2023, 30]]
    },
    // Reihen ohne belegte Werte (Stand der Arbeit: November 2026). Anzeige beginnt beim Spielstart.
    // Quellen zum Nachtragen: Sektoren: UBA, Emissionsübersichten KSG-Sektoren; Strommix: AG Energiebilanzen, Stromerzeugung nach
    // Energieträgern; Gas und Industriestrom: BDEW-Gaspreisanalyse bzw. Strompreisanalyse; EU-ETS: Jahresmittel der Zertifikatspreise (z. B. UBA, EEA).
    missing: [
        'Emissionen je Sektor (Energiewirtschaft, Industrie, Gebäude, Verkehr, Landwirtschaft, Abfall)',
        'Strommix (Erneuerbare, Wind, Photovoltaik, Erdgas, Kohle)',
        'Gaspreis für Haushalte',
        'Industriestrompreis',
        'CO2-Preis im EU-Emissionshandel'
    ]
};
