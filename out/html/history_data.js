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
        strommix: {
            'Erneuerbare': [[2021, 40.4], [2022, 44.1], [2023, 53.8]],
            'Wind': [[2021, 19.7], [2022, 21.5], [2023, 27.7]],
            'Photovoltaik': [[2021, 8.5], [2022, 10.6], [2023, 12.5]],
            'Erdgas': [[2021, 15.2], [2022, 13.7], [2023, 15.0]],
            'Kohle': [[2021, 27.8], [2022, 31.1], [2023, 24.4]]
        },
        // EU-Emissionshandel, durchschnittlicher Zuschlagspreis der deutschen Versteigerungen in Euro/t: UBA/DEHSt, Jahresberichte
        // und Pressemitteilungen zu den Erlösen (2020 24,61, 2021 52,50, 2022 80,32, 2023 83,66). 2024 ist der Startwert im Spiel.
        eu_ets: [[2020, 24.61], [2021, 52.50], [2022, 80.32], [2023, 83.66]]
    },
    // Reihen ohne belegte Werte (Stand der Arbeit: November 2026). Anzeige beginnt beim Spielstart.
    // Quellen zum Nachtragen: Gas und Industriestrom: BDEW-Gaspreisanalyse bzw. Strompreisanalyse (Jahresmittel, gleiche Abnahmefälle wie im Spiel).
    // Umfragen nach Wählergruppen: monatlich gibt es sie nicht; belegbar wären nur Wahltagsbefragungen (infratest dimap/ARD,
    // Forschungsgruppe Wahlen/ZDF) zur Bundestagswahl 2021 und Europawahl 2024.
    missing: [
        'Strommix 2020',
        'Gaspreis für Haushalte',
        'Industriestrompreis',
        'Umfragen nach Wählergruppen vor November 2024'
    ]
};
