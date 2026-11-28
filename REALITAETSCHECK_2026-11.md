# Realitäts- und Plausibilitätscheck (Stand 28. November 2026)

> **Umsetzung:** Alle Punkte dieses Berichts sind inzwischen umgesetzt (Commits db2f5a2, a66dad2, dae08aa, e45e84e, cb1c023 und Nachträge in `PORT_2026.md`). Der Bericht beschreibt den Stand vor der Umsetzung.

Blick von zwei Seiten: als Game Designer (Spielgefühl, Entscheidungen, Rückmeldung, Balance) und als politischer Berater (Fakten, Abläufe, Machtlogik, Personen).
Grundlage: Build und Prüfskripte, 120 Headless-Läufe, zwei vollständig mitgeschriebene Durchgänge (SPD im historischen Modus, Linke normal) mit allen Texten, eine Browser-Stichprobe und eine Recherche zum Stand der Wirklichkeit bis Ende November 2026 (Quellen am Ende).

---

## 1. Kurzfazit

Der Prolog 2024/25 ist das Beste am Spiel: Die Fakten sitzen fast durchgehend, die Texte sind dicht, fair und politisch klug, die Umfragen laufen bis November 2026 exakt auf dem realen Pfad. Die Linke ist als zweite Partei erstaunlich gut getroffen.

Die Schwächen liegen woanders:

1. **Die Wirklichkeit hat das Spiel seit Juli 2026 überholt.** Bundespräsidentenwahl (30. Januar 2027, Ilse Aigner als gemeinsame Kandidatin von Union, SPD und Grünen), Rücktritt von Bärbel Bas und SPD-Führungswahl im Januar 2027, Iran-Krieg mit Energiepreisschock und Tankrabatt, Inflation um 3 %, Rentenkommission (Juni 2026, nicht 2027), die bevorstehende Ministerpräsidentenwahl in Sachsen-Anhalt: Nichts davon steht im Spiel, einiges widerspricht ihm.
2. **Die Koalitionsbildung 2025 kippt zu oft ins Unplausible.** In 16 von 58 plausiblen SPD-Läufen lehnt die Union Schwarz-Rot ab, obwohl es ohne AfD keine andere Mehrheit gibt. Danach regiert vier Jahre lang eine von der SPD tolerierte Unions-Minderheitsregierung, und fast alle Texte tun so, als gäbe es eine Koalition.
3. **Die Wirtschaft ist 2026 zu rosig und danach zu starr.** Inflation 2,0 statt 2,8 %, Arbeitslosigkeit im Mitschnitt 5,7 statt 6,3 %, Energiepreise sinken statt zu steigen. Ab 2027 bewegen sich Umfragen und Wirtschaft kaum noch, Programme wirken dagegen sprunghaft in einem Monat.
4. **Die versprochene „Utopie“ ist fast unerreichbar.** SPD-Kanzlerschaft am Ende in 3 von 40 plausiblen Läufen, Merz regiert in 36. Das ist politisch realistisch, aber als Spielversprechen zu wenig.
5. **Weimar-Reste in Schlüsseltexten.** Das Spielende verkündet „Der Höhenflug der extremen Rechten ist gebrochen“, auch wenn die AfD gerade stärkste Fraktion geworden ist.
6. **Viele kleine Textfehler,** vor allem 79 Zeilen mit ungeschützten Gender-Sternchen, die im Spiel als Kursivschrift erscheinen und das Sternchen verschlucken.

Technisch ist alles sauber: Build fehlerfrei, 1627 Verweise ohne Fehler, 124 Bilder mit vollständigen Nachweisen, 120 Läufe ohne Laufzeitfehler und ohne Endlosschleifen, keine Konsolenfehler im Browser.

---

## 2. Vorgehen

| Schritt | Ergebnis |
|---|---|
| `npx dendrynexus make-html`, `check_links.py`, `check_image_credits.py`, `check_party_texts.py` | fehlerfrei (1627/0, 124/0, eine offene Fundstelle in `status.scene.dry:22`, die den Linke-Kontext betrifft) |
| `node tools/sim.js . 40 spd smart`, `. 40 linke smart`, `. 40` | keine Fehler, keine Schleifen; 75 bzw. 74 bzw. 86 verschiedene Events gesehen |
| Eigenes Skript (Koalitionsprüfung, 60 Läufe SPD, plausible Wahl) | Union lehnt Schwarz-Rot 2025 in 16 von 58 Fällen ab |
| Zwei Durchgänge mit vollständigem Textprotokoll (fester Zufallsstartwert) | SPD (historischer Modus) und Linke (normal), November 2024 bis Dezember 2030 |
| Browser (`spiel`, Port 8765) | Start, Hand, Status- und Umfrage-Reiter, keine Konsolenfehler |
| Recherche | Landtagswahlen 2026, Umfragen, Personal, Gesetze, Wirtschaft, Klima, Außenpolitik (Quellen in Abschnitt 9) |

Hinweis zu den Mitschnitten: Die Läufe wählen innerhalb der „plausiblen“ Optionen zufällig. Aussagen über Häufigkeiten stammen aus den Sammelläufen, Textbeobachtungen aus den Mitschnitten.

---

## 3. Was stimmt (und bleiben sollte)

- **Prolog 2024/25** ist fast fehlerfrei: Ampel-Aus, Kukies, Wissing parteilos, Vertrauensfrage am 16.12., Neuwahl am 23.02., Magdeburg und Aschaffenburg, Abstimmung 348:345, TV-Duell, Sondervermögen im alten Bundestag mit Bremen und MV im Bundesrat, Kanzlerwahl mit dem gescheiterten ersten Wahlgang (310 Stimmen), Parteitag mit Bas 95 % und Denkzettel für Klingbeil, Stromsteuer, Richterwahl Brosius-Gersdorf mit korrekter Zweidrittel-Arithmetik, Junge Gruppe (18 Abgeordnete), Gaza-Waffenruhe vom 10.10.2025, Kommunalwahl NRW mit Dortmund.
- **Bundestagswahl 2025 im historischen Modus** trifft das reale Ergebnis auf wenige Zehntel (SPD 17,2 statt 16,4; Union 28,7 statt 28,5; AfD 20,5 statt 20,8; Linke 8,6 statt 8,8).
- **Umfragen bis November 2026** (`GRAVITY`): Monatswerte stimmen mit dem Wikipedia-Mittel überein (Nov. 2026 im Spiel 19,9/27,7/13,8/15,4/10,2, real mit 16 Umfragen 19,9/27,6/13,8/15,3/10,2).
- **Landtagswahlen 2026**: Die Zahlen in den Kommentaren stimmen (BW, RP, Sachsen-Anhalt, MV, Berlin), ebenso die Haushaltslücke 2027 (34 Mrd. Euro), der Wehrdienst (Fragebogen seit Januar 2026, Bedarfswehrpflicht nicht aktiviert) und das Heizungsgesetz (Beschluss Juli 2026).
- **Die Linke** ist mit Mission Silberlocke, Mitgliederboom, Parteitag Chemnitz, Jerusalemer Erklärung, Mietwucher-Rechner und dem Konflikt Bewegungs- gegen Ostpartei sehr nah an der Wirklichkeit, ohne Partei zu ergreifen.
- **Forschungsbasierte Balance** (Kalla/Broockman, Pons, Klüver/Spoon, Funke/Schularick/Trebesch) ist ein echtes Alleinstellungsmerkmal. Die Bibliothek erklärt sie gut.
- **Respekt vor realen Personen**: Spahn erscheint nur im Kommentar, Kühnerts Rückzug wird benannt, die Richterwahl-Kampagne als Kampagne beschrieben.

---

## 4. Realitätscheck: Was nicht (mehr) stimmt

Sortiert nach Gewicht. „Spiel“ = Stand im Code, „Wirklichkeit“ = Stand 28.11.2026.

### 4.1 Bundespräsidentenwahl 2027 (hoch)

| | Spiel | Wirklichkeit |
|---|---|---|
| Termin | Februar 2027 (`presidential_election_1932`, `bundesversammlung_linke_2027`) | **30. Januar 2027**, 18. Bundesversammlung |
| Union | Norbert Lammert | **Ilse Aigner** (CSU), Vorschlag Söder April 2026, Nominierung durch den CDU-Vorstand am 9.11.2026 |
| SPD | eigene Kandidatin Manuela Schwesig möglich | SPD- und Grünen-Führung unterstützen **Aigner** seit 9.11.2026 |
| AfD | Tino Chrupalla | **Thomas Berthold** (nominiert 14.11.2026) |
| Linke | Gerhard Trabert | kein eigener Kandidat; Reichinnek nennt Hape Kerkeling (Campact-Petition) „einen gut geeigneten Vorschlag“ |
| Zusammensetzung | aus Umfragen berechnet: im Mitschnitt AfD 26,8 % | **fest**: Union 431, AfD 259 (20,6 %), SPD 254, Grüne 194, Linke 78, FW 18, FDP 13, BSW 7, Sonstige 6; Mehrheit 631 |
| Ergebnis | SPD-Spiel: Lammert 40/40; Linke-Spiel: Schwesig 37/40 | Union + SPD + Grüne haben 879 Stimmen: Aigner im ersten Wahlgang so gut wie sicher |

**Empfehlung**: Event auf Januar 2027 legen, reale Sitzverteilung fest einbauen (nicht aus Umfragen rechnen), Aigner als gemeinsame Kandidatin der Mitte. Die Spielentscheidung verschiebt sich dann sinnvoll: Trägt die SPD Aigner mit (Normalfall, Preis: Profil), oder riskiert sie eine eigene Kandidatur (und den Bruch mit der Union)? Für die Linke: Kerkeling, eigener Kandidat (Trabert, als Fiktion gekennzeichnet) oder Enthaltung. Erfolg „Norbert Lammert im Schloss Bellevue“ (`game_over.scene.dry:210`) umbenennen.

### 4.2 SPD-Führung und Kabinett (hoch)

- **Bärbel Bas** ist am 12.10.2026 als Co-Vorsitzende und Arbeitsministerin zurückgetreten. **Alexander Schweitzer** ist seit 13.10.2026 Bundesarbeitsminister.
- Die SPD wählt auf einem Bundesparteitag in **Bremen am 16./17. Januar 2027** die gesamte Spitze neu. Hubertus Heil kandidiert; Klingbeil lässt offen, ob er antritt (Pistorius und Miersch unterstützen ihn); Schwesig gilt vielen als Favoritin, hat aber abgesagt; Pistorius tritt nicht an; Rehlinger sagt wegen der Saarland-Wahl 2027 ab.
- Im Spiel bleibt Bas Arbeitsministerin und Beraterin mit statischem Text „seit Juni 2025 Co-Vorsitzende … und Bundesministerin“ (`advisors/bas.scene.dry:11`), auch im Zweig, in dem die SPD gar nicht regiert.
- Im Linke-Spiel heißt der SPD-Arbeitsminister ab 2025 **Heil** (die Startbesetzung bleibt stehen, weil `Heil` in `post_event` als gültiger SPD-Name gilt). Richtig wäre Bas, ab Oktober 2026 Schweitzer.
- Kabinettsumbildung 29.07.2026 (Warken Kanzleramt, Linnemann Gesundheit, Bilger Verkehr): betrifft keins der acht Spielressorts, im CDU-Parteitag-Text korrekt berücksichtigt.

**Empfehlung**: Ein Event Oktober 2026 „Rücktritt von Bärbel Bas“ (sachlich: persönliche Gründe und zunehmende öffentliche Angriffe; nichts zum familiären Hintergrund, Regel 3), danach `labor_minister = "Schweitzer"`, Bas verlässt den Beraterkreis oder wird ohne Ämter weitergeführt. Und ein Event **„Parteitag Bremen“ im Januar 2027** als großer Spielermoment: Doppelspitze neu wählen (Klingbeil/Schwesig/Heil-Konstellationen), mit echten Folgen für Strömungen und Unmut. Das ist die beste reale Steilvorlage, die das Spiel gerade bekommen kann.

### 4.3 Iran-Krieg, Energiepreise, Inflation (hoch)

- Seit dem **28. Februar 2026** (US-israelische Angriffe) ist die Straße von Hormus faktisch gesperrt; Öl zeitweise um 100 bis 110 US-Dollar. Tankrabatt im **Mai/Juni** und wieder **1. Oktober bis 31. Dezember 2026**; danach ist ein Spritpreisdeckel im Gespräch, das Kartellamt ermittelt gegen Raffinerien.
- **Inflation**: August 2,9 %, September 3,3 %, Oktober 2,8 % (Energie +12,2 % zum Vorjahr). Gemeinschaftsdiagnose Herbst 2026: 2,8 % für 2026, **3,2 % für 2027**.
- Im Spiel: kein Wort dazu. Inflation liegt 2025 bis 2028 starr bei 2,0 bis 2,3 %, der Energiepreisindex **sinkt** 2026 auf 94 („günstiger Strom“).

**Empfehlung**: Ein Event „Krieg am Golf“ (März 2026) und „Tankrabatt“ (Mai und September 2026) mit Entscheidungen (Tankrabatt, Klimageld, gezielte Entlastung, Übergewinnsteuer), `energy_price` und `inflation` bis November 2026 auf den realen Pfad ziehen (wie `GRAVITY` für Umfragen), Ölpreis als Treiber im Klimamodell ergänzen.

### 4.4 Wirtschaftsdaten 2026 (mittel bis hoch)

| | Spiel (Mitschnitt SPD / Mittel 40 Läufe) | Wirklichkeit |
|---|---|---|
| Arbeitslosenquote Okt./Nov. 2026 | 5,7 % / 6,2 % (5,2–7,5) | 6,3 % (BA Oktober; 2,955 Mio., 44.000 mehr als im Vorjahr) |
| Inflation | 2,0 % | 2,8 % (Oktober) |
| Wachstum 2026 | Anzeige 1,6 % | Prognose 1,3 % (Gemeinschaftsdiagnose), 2025: 0,2 % |
| Wachstum 2027/28 | Pfad 1,1/0,4 laut Kommentar | 1,1 / 0,4 (GD), Bundesregierung 1,1 / 0,6 |

Ursache: Ab 1,5 % Wachstum sinkt die Arbeitslosigkeit um 0,05 Punkte im Monat (`post_event.scene.dry:332`), also 0,6 Punkte im Jahr. Für Deutschland braucht es aber etwa 1 bis 1,5 % Wachstum, nur um die Arbeitslosigkeit konstant zu halten; 2026 stieg sie trotz Erholung leicht.

**Empfehlung**: Bis November 2026 Arbeitslosigkeit, Inflation und Wachstum wie die Umfragen an Monatswerte binden (`REAL_ECON` monatlich statt jährlich), Okun-Schwelle für Rückgänge auf rund 1,5 % heben.

### 4.5 Rentenkommission (mittel bis hoch)

- Spiel: Bericht **Juni bis September 2027**, drei Wege zur Wahl (Niveau, Eintrittsalter, Kapitaldeckung), nur wenn die SPD regiert (`events/rentenkommission.scene.dry:5`).
- Wirklichkeit: Die Alterssicherungskommission hat am **23. Juni 2026** 33 Empfehlungen vorgelegt: Regelaltersgrenze ab 2032 im Verhältnis 2:1 an die Lebenserwartung koppeln, abschlagsfreie „Rente mit 63“ abschaffen, Haltelinie 48 % nur bis 2031, danach wieder Nachhaltigkeitsfaktor, teilweise Kapitaldeckung. Koalitionsausschuss am 2. Juli 2026: vollständige Umsetzung; Gesetz bis Ende 2026, Bundestag und Bundesrat im ersten Quartal 2027.

**Empfehlung**: Event nach Juni 2026 vorziehen und die Entscheidung auf das umkämpfte Umsetzungsgesetz legen: Vertrauensschutz, Ausnahmen für harte Berufe, Erwerbsminderungsrente, Haltelinie nach 2031. Das ist der zentrale innenpolitische Konflikt dieses Winters und ein natürlicher Auslöser für SPD-Unmut.

### 4.6 Sachsen-Anhalt, Berlin, MV (mittel)

- **Sachsen-Anhalt**: AfD 43,8 %, 39 von 83 Sitzen, CDU 17,2 %. Siegmund will sich im **Dezember 2026** im Landtag zur Wahl stellen, die CDU will den Saal verlassen, das BSW sich im dritten Wahlgang enthalten (dort genügt die Mehrheit der abgegebenen Stimmen). Das ist der härteste Brandmauer-Test der nächsten Wochen und fehlt im Spiel ganz. Der Text im September (`landtagswahlen_september_2026`) deutet nur an, „in der CDU wird offen darüber gestritten“.
- **Berlin**: Linke 25,7 %, CDU 18,8 % (mit Stefan Evers, Wegner trat nicht an), AfD 16,3, Grüne 14,3, **SPD 12,1 % (Platz 5, historisches Tief)**. Seit 2. November verhandeln Linke, Grüne und SPD über Rot-Grün-Rot unter Elif Eralp, Vertrag im Januar 2027 erwartet. Der SPD-Text schweigt zur eigenen Niederlage („profitiert vor allem die Linke“).
- **MV**: AfD 38,2, SPD 35,5 (starkes Ergebnis), Linke 6,5, Grüne 5,7, **CDU 4,9 % und erstmals bei einer Landtagswahl draußen**. Schwesig sondiert Rot-Rot-Grün. Der SPD-Text („Koalition der demokratischen Parteien“) ist richtig, aber blass.
- **BW**: „die SPD bleibt einstellig bis knapp zweistellig“ ist geschönt: 5,5 %, nur knapp im Landtag. Grün-Schwarz unter Özdemir.
- **RP**: korrekt (Schnieder MP seit 18.05.2026, SPD Juniorpartnerin); dass Schweitzer jetzt Bundesminister ist, könnte im Bas-Event aufgegriffen werden.

### 4.7 Weitere Einzelpunkte

- **Expertenrat** (`klima_expertenrat`): Der Text nennt als Prüfbericht „rund 518 Mt 2030, Lücke etwa 80 Mt“. Das ist die Modellzahl. Der reale Prüfbericht vom 18.05.2026 sagt etwas anderes: Er verwirft die knappe Zielerreichung der Projektionsdaten 2026 (die 62,6 % Minderung, also rund 468 Mt, und einen Puffer von 4,5 Mt ergaben) und erwartet eine Überschreitung des Budgets 2021–2030 um **60 bis 100 Mt kumuliert**. Im Mitschnitt erscheint das Event zweimal mit identischen Zahlen. Vorschlag: 2026 die realen Aussagen, später die Modellzahl mit eigener Formulierung („nach eigener Rechnung“); das Modell liegt rund 50 Mt über der UBA-Projektion und sollte das im Kommentar begründen.
- **Restgesetze Dezember 2024**: Die Schwellen (`union_relation >= 30`) sperren Kindergeld und BVerfG-Schutz, wenn man in der Vertrauensfrage angreift. Real hat Scholz scharf angegriffen, und trotzdem kamen im Dezember 2024 Kindergeld und kalte Progression sowie die Absicherung des Bundesverfassungsgerichts mit Stimmen von Union bzw. FDP durch (das Deutschlandticket bitte eigens prüfen). Der historische Weg wird bestraft.
- **CDU-Parteitag 2028** (`center_party_conference`): Merz gibt im Spiel den Vorsitz ab, Linnemann gewinnt fast immer, aber `union_leader` bleibt „Merz“ und Merz wird 2029 wieder Kanzler. Real hat Merz eine zweite Amtszeit nach 2029 angekündigt. Entweder die Unions-K-Frage 2028 sauber modellieren (Merz, Wüst, Söder, Linnemann) oder das Event auf Programm und Kurs beschränken.
- **BSW**: seit Dezember 2025 Doppelspitze De Masi/Mohamed Ali, Wagenknecht leitet die Grundwertekommission; seit 1.10.2026 heißt die Partei „Bündnis Soziale Gerechtigkeit und Wirtschaftliche Vernunft“ (Kürzel bleibt). Im Spiel fehlt das (`linke_bsw_rueckkehrer` lässt „Sahra Wagenknecht eine Neuauszählung verlangen“, das passt für 2025).
- **Ukraine**: kein Waffenstillstand; US-vermittelte Gespräche in Abu Dhabi seit 10.11.2026 nach acht Monaten Pause, großer Gefangenenaustausch, kein Durchbruch. Das Spiel-Event ab August 2027 unter Bedingungen ist als Fiktion vertretbar.
- **AfD-Verbot**: Antrag im Bundestag gibt es nicht, Union lehnt ab, GFF-Gutachten (Juni 2026), Juristenbrief. Die Formulierung „in Teilen als gesichert rechtsextrem“ ist vorsichtig; den Stand der Hochstufung von Mai 2025 und des Verfahrens in Köln würde ich vor dem nächsten Durchgang eigens prüfen.
- **Fehlende Landtagswahlen**: Saarland (2027, Rehlinger tritt an), Niedersachsen (Herbst 2027, SPD-Land unter Olaf Lies), Bayern und Hessen (Herbst 2028) kommen nicht vor; `landtagswahlen_2027` deckt nur NRW, SH und Bremen ab. Gerade Niedersachsen ist für die SPD eine Schicksalswahl.
- **Europawahl 2029**: „Ohne Fünf-Prozent-Hürde“ ist heute richtig; ob bis 2029 die EU-Direktwahlakt-Reform (Sperrklausel 2 bis 5 % für große Staaten) in Kraft ist, bitte prüfen.
- **Rüstungspaket 2028** (`panzerkreuzer_b.scene.dry:13`): „Große Teile unserer Partei lehnen die Aufrüstung ab“ passt zur SPD von 1928, nicht zur SPD von Pistorius und Wehrdienstgesetz. Besser: „die Parteilinke und Teile der Fraktion“.

---

## 5. Politische Plausibilität (Beratersicht)

### 5.1 Regierungsbildung 2025: die wichtigste Baustelle

Die Union lädt nur ein, wenn `union_relation >= 25` (`bundestagswahl.scene.dry:394`). Im Prolog sinkt der Wert durch genau die Entscheidungen, die Scholz real getroffen hat (Angriffsrede in der Vertrauensfrage, Angriff im TV-Duell, Kritik an der Abstimmung mit der AfD). Ergebnis im historischen Modus: „Die Union lehnt eine weitere Koalition mit uns ab.“ In 16 von 58 plausiblen Läufen passiert das.

Politisch ist das kaum denkbar. 2025 hatte Merz bei intakter Brandmauer **keine andere Mehrheit** (Schwarz-Grün 46,5 % der Sitze). Ein schlechtes Verhältnis verteuert die Koalition, es verhindert sie nicht. Eine tolerierte Minderheitsregierung über eine ganze Wahlperiode hat es im Bund nie gegeben; Minderheitsregierungen gab es nur für Wochen (1966, 1972, 1982).

**Empfehlung**:
- Absage der Union nur, wenn es eine Alternative ohne die SPD gibt (Schwarz-Grün, Jamaika) oder die Brandmauer gefallen ist. Sonst bestimmt das Verhältnis den Preis: Verhandlungsmasse, Ressorts, Konfliktpunkte im Koalitionsvertrag, Startwert `coalition_dissent`.
- Tolerierung und Minderheitsregierung zeitlich begrenzen: spätestens beim ersten Haushalt (Herbst 2025) ein Event „Koalition oder Neuwahl“. Die Option bleibt spannend, aber sie wird nicht zum Dauerzustand.

### 5.2 Texte, die den Regierungszweig voraussetzen

Wenn die SPD toleriert oder opponiert, stimmen zu viele Texte nicht mehr: Bas als Ministerin, Miersch „muss dafür sorgen, dass 120 Abgeordnete die Kompromisse der Koalition mittragen“ (`advisors/miersch.scene.dry:11`), „Die Koalition beschließt den Entwurf“ beim Heizungsgesetz, „im Koalitionsvertrag steht“. Umgekehrt fallen Kernereignisse weg (Rentenkommission, Haushaltslücke, Industriekrise verlangen `spd_in_government`), sodass Opposition inhaltlich leer läuft: Im Mitschnitt hat die SPD von 2026 bis 2028 fast nur Parteikarten.

### 5.3 Weitere Punkte zur Machtlogik

- **Abspaltung der Parteilinken**: Im Mitschnitt gründet sich die „Soziale Linke“ im Februar 2026, ohne Vorlauf. Real wäre das ein Beben mit Vorzeichen (Brandbriefe, Mitgliederbegehren, Austritte prominenter Abgeordneter, Jusos-Beschlüsse). Die letzte relevante Linksabspaltung war die WASG 2004/05. Vorschlag: zweistufig ankündigen und mit einem Rettungsfenster versehen.
- **Unions-K-Frage 2029**: siehe 4.7. Merz wäre bei der Wahl 73 Jahre alt und hat laut dpa eine zweite Amtszeit angekündigt; das gibt ein gutes Event her (Merz, Wüst, Söder), aber nicht als Vorsitzwahl ohne Folgen.
- **Bundesversammlung**: aus Umfragen statt aus der festen Zusammensetzung berechnet; das überzeichnet die AfD um rund sechs Punkte.
- **Wirtschaftsprogramme**: „Bau- und Beschäftigungsprogramm in abgespeckter Form“ senkt im Mitschnitt die Arbeitslosigkeit in **einem Monat** von 6,5 auf 5,5 % (rund 450.000 Menschen) und hebt die Inflation von 1,2 auf 3,3 %. Fiskalmultiplikatoren um 0,5 bis 1 mit Verzögerung von ein bis zwei Jahren wären plausibel: Wirkung über 12 bis 24 Monate verteilen.
- **Umfragen nach November 2026 zu träge**: Im Mitschnitt bewegt sich die Union von Januar 2027 bis Dezember 2028 nur zwischen 20,3 und 20,8 %, die AfD zwischen 26,8 und 27,8 %. Real hat sich die Union allein 2026 um fünf Punkte bewegt. Die Lageranker und Monatsgrenzen dämpfen so stark, dass Spielzüge und Ereignisse kaum noch sichtbar werden. Vorschlag: Anker schwächer, dafür seltene, deutliche Schocks (Skandal, Führungswechsel, Krise) mit Abklingen.
- **Weimar-Reste im Wortlaut**: „Justiz und Polizei sind gegen uns“ (`sklarek_affair.scene.dry:36`), „Wir müssen etwas gegen die Not tun …“ / „So funktioniert der Weltmarkt eben …“ (`black_thursday.scene.dry:24`), „Halbzeit 2030 … Noch ist es nicht zu spät für ein Rettungsprogramm“ (`1934.scene.dry:17`, auch bei 5,5 % Arbeitslosigkeit), Spielende „Der Höhenflug der extremen Rechten ist gebrochen“ (`1934_end.scene.dry:14`, auch wenn die AfD 2029 stärkste Fraktion wurde). Die Endtexte sollten aus dem Zustand gebaut werden (AfD-Anteil, Regierung, Wirtschaft, Klimastatus).
- **Reale Personen**: Kevin Kühnert hat sich im Oktober 2024 aus gesundheitlichen Gründen zurückgezogen; ein „Comeback“ als Berater ist respektvoll formuliert, bleibt aber Fiktion über eine reale Person in einer privaten Lage. Ich würde ihn ersetzen (z. B. durch eine aktive Figur der Parlamentarischen Linken) oder deutlich als fiktiv markieren. Fiedler und Wiese laufen mechanisch unter dem „Dänischen Kurs“; ihre Texte sind sauber, aber der versteckte Strömungs-Tag schreibt ihnen eine Position zu, die sie öffentlich nicht vertreten.

---

## 6. Game Design

### 6.1 Versprechen und Erfüllbarkeit

Der Titel verspricht eine Utopie, das Spiel liefert eine realistische Abwehrschlacht. Ergebnisse am Ende (40 plausible Läufe je Partei):

| | SPD | Linke |
|---|---|---|
| Kanzler*in am Ende | Merz 36, SPD 3, AfD 1 | Merz 40 |
| Koalition am Ende | Kenia 23, Unions-Minderheit 15 | Kenia 38 |
| Brandmauer gefallen | 13 | 4 |
| Klimastatus 2030 „auf Paris-Kurs“ | 0 | 0 |

Realismus ist richtig, aber es braucht **sichtbare, erarbeitbare Siegpfade**: z. B. eine Kette, die eine SPD-Kanzlerschaft 2029 möglich macht (Führungswechsel 2027, Profil in der Koalition, Rentenkompromiss, Niedersachsen gewonnen, Union im K-Frage-Streit), und für die Linke einen Weg zu Rot-Grün-Rot (Berlin als Modell, Bundesrat, Verhältnis zur SPD nach Bremen). Zwischenziele mit Rückmeldung (Erfolge, Meilensteine im Status-Reiter) machen Fortschritt fühlbar, auch wenn der große Sieg selten bleibt.

### 6.2 Rhythmus

- **2024/25 dicht und stark**, **2026 noch gut**, **2027 bis 2029 dünn**: Im Mitschnitt kommen nach dem Wahlsonntag im Osten bis zur Bundestagswahl 2029 nur rund ein Dutzend Ereignisse. Die neuen realen Anker (Bas, Bremen, Aigner, Sachsen-Anhalt, Rente, Iran, Saarland, Niedersachsen, Bayern/Hessen, Europawahl) würden diese Lücke füllen.
- **Wiederholungen**: Expertenrat zweimal mit gleichem Text und gleichen Zahlen; Beratertexte bleiben über Jahre gleich. Einzeiler je Zustand (in Regierung, Opposition, nach Rücktritt) würden viel bringen.
- **Historischer Modus** ist der schwerste Modus und bestraft den historischen Weg (siehe 5.1). Spieler*innen erwarten dort eher, dass Geschichte ohne Eingriff so läuft wie real.

### 6.3 Rückmeldung und Klarheit

- Koalitionsliste zeigt Gleitkommareste und Punkt statt Komma: „51.800000000000004 %“, „40.599999999999994 %“ (`bundestagswahl.scene.dry:256 ff.`, Werte wie `grand_coalition` ungerundet).
- „Bundeskanzler*in Merz“ (`emergency_cuts.scene.dry:2`, Kabinett-Liste `bundestagswahl.scene.dry:861`, Toleranztexte): bei bekannter Person die passende Form setzen.
- „Debug: Schnellstart“ steht im Startmenü (`root.scene.dry:18`); für Spieler*innen ausblenden (z. B. nur mit `?debug` in der URL).
- Das Kartenbild „Parteiangelegenheiten“ (Parkbank) erklärt sich nicht.
- Wenn das Spiel vor heute von der Wirklichkeit abweicht (Linke zieht im März 2026 in beide Südwest-Landtage ein; SPD hält Rheinland-Pfalz), hilft ein kurzer Hinweis „Wirklich: …“, wie ihn der Umfrage-Reiter schon hat.

---

## 7. Text- und Anzeigefehler

| Fehler | Umfang | Beispiel |
|---|---|---|
| Ungeschützte Gender-Sternchen (`*innen` statt `\*innen`) erzeugen Kursivsatz und verschlucken das Sternchen | 79 Zeilen in 40 Dateien, am meisten `party_disunity`, `crisis_program`, `verfassungsrichterwahl_2025`, `lk_reformist_resign`, `enemies`, `lk_inter_party_relationships` | kompiliert: „Die Hamburger Genoss“ + kursiv „innen haben monatelang …“ (`hamburg_2025`, Linke) |
| Leerzeichen vor Satzzeichen und doppelte Leerzeichen aus leeren Bedingungen | häufig | „auf sich vereint hat .“ (`advisors/klingbeil`), „wie die rote Nelke .“ (`rally.scene.dry:74`), „SPD und Grünen .“, „Debatte  findet“, „vor  der Union“, „Sozialdemokratie  zeigen“ |
| Gleitkomma in Koalitionsliste | jede Wahl | siehe 6.3 |
| „Bundeskanzler*in“ bei bekannter Person | mehrere Stellen | siehe 6.3 |
| Statischer Beratertext im falschen Zweig | Bas, Miersch | siehe 5.2 |

Vorschlag: Prüfskript `check_party_texts.py` um zwei Regeln erweitern (ungeschütztes `*` vor `in`/`innen` außerhalb von Kommentaren und JS; ` [.,;:]` und doppelte Leerzeichen im kompilierten `game.json`).

---

## 8. Priorisierte Liste

**Sofort (vor dem nächsten Spieltest)**
1. Bundespräsidentenwahl auf 30.01.2027, Aigner/Berthold, feste Zusammensetzung (4.1).
2. Bas-Rücktritt und Schweitzer (Oktober 2026), Beratertext Bas, Linke-Spiel: SPD-Arbeitsminister korrigieren (4.2).
3. Koalitionsabsage der Union 2025 nur mit Alternative; Tolerierung befristen (5.1).
4. Gender-Sternchen, Gleitkomma, Leerzeichen, Debug-Menü (7).

**Kurzfristig**
5. Iran-Krieg, Tankrabatt, Inflation und Energiepreise 2026 auf realen Pfad (4.3, 4.4).
6. Rentenkommission nach Juni 2026, Entscheidung über das Umsetzungsgesetz (4.5).
7. Neue Events: Parteitag Bremen (Januar 2027), Ministerpräsidentenwahl Sachsen-Anhalt (Dezember 2026), Berlin Rot-Grün-Rot (Januar 2027) (4.2, 4.6).
8. Spielende und „Halbzeit 2030“ aus dem Zustand erzeugen (5.3).

**Mittelfristig**
9. Umfragedynamik nach 2026 lebendiger (5.3), Programmeffekte über Zeit verteilen.
10. Fehlende Landtagswahlen 2027/2028, Unions-K-Frage, Siegpfade für beide Parteien (4.7, 6.1).
11. Texte für Opposition/Tolerierung, damit dieser Zweig trägt (5.2).

---

## 9. Quellen (abgerufen 28.11.2026)

Wahlen und Umfragen
- Umfragen: [Wikipedia, Umfragen zur 22. Bundestagswahl](https://de.wikipedia.org/wiki/Wahl_zum_22._Deutschen_Bundestag/Umfragen_und_Prognosen), [DAWUM, FGW 27.11.2026](https://dawum.de/Bundestag/Forschungsgruppe_Wahlen/2026-11-27)
- Baden-Württemberg: [Landesregierung, vorläufiges Ergebnis](https://www.baden-wuerttemberg.de/de/service/presse/pressemitteilung/pid/vorlaeufiges-amtliches-ergebnis-der-landtagswahl-2026)
- Rheinland-Pfalz: [bpb](https://www.bpb.de/kurz-knapp/hintergrund-aktuell/576319/landtagswahl-rheinland-pfalz-2026-cdu-ist-staerkste-kraft/), [ZDF, Koalitionsvertrag CDU/SPD](https://www.zdfheute.de/politik/deutschland/rheinland-pfalz-koalitionsvertrag-cdu-spd-regierung-100.html)
- Sachsen-Anhalt: [ZDF, Ergebnis](https://www.zdfheute.de/politik/deutschland/landtagswahl-sachsen-anhalt-historisches-ergebnis-100.html), [ZDF, CDU will Saal verlassen](https://www.zdfheute.de/politik/deutschland/cdu-sachsen-anhalt-wahl-ministerpraesident-afd-siegmund-100.html), [Stuttgarter Zeitung, MP-Wahl](https://www.stuttgarter-zeitung.de/politik/regierungsbildung-in-sachsen-anhalt-wann-wird-der-ministerpraesident-gewaehlt-79537532.html)
- Mecklenburg-Vorpommern: [Pharmazeutische Zeitung (dpa)](https://www.pharmazeutische-zeitung.de/afd-vor-spd-cdu-fliegt-aus-dem-landtag-168528/), [Stuttgarter Zeitung, Rot-Rot-Grün](https://www.stuttgarter-zeitung.de/politik/nach-wahl-in-mecklenburg-vorpommern-schwesig-strebt-bildung-einer-rot-rot-gruenen-landesregierung-an-79488360.html)
- Berlin: [bpb](https://www.bpb.de/kurz-knapp/hintergrund-aktuell/581533/wahl-zum-abgeordnetenhaus-berlin-2026-die-linke-wird-erstmals-staerkste-kraft/), [Jüdische Allgemeine, Verhandlungen bis Januar](https://www.juedische-allgemeine.de/politik/rot-gruen-rote-koalitionsverhandlungen-bis-januar/)
- Bundespräsidentenwahl: [Wikipedia](https://de.wikipedia.org/wiki/Wahl_des_deutschen_Bundespr%C3%A4sidenten_2027), [LpB BW](https://www.lpb-bw.de/themen/bundespraesident-in-wahl-2027)

Personal und Parteien
- Bas/Schweitzer: [taz](https://taz.de/Ruecktritt-von-SPD-Chefin/!6220794/), [Bundesregierung](https://www.bundesregierung.de/breg-de/aktuelles/schweitzer-bundesminister-2456990)
- SPD-Vorsitz: [ZDF](https://www.zdfheute.de/politik/spd-vorsitz-klingbeil-schwesig-pistorius-parteivorsitz-100.html), [Stuttgarter Zeitung](https://www.stuttgarter-zeitung.de/politik/spd-vorsitz-hubertus-heil-will-spd-chef-werden-jetzt-sind-klingbeil-und-schwesig-am-zug-79703520.html)
- Kabinettsumbildung Juli 2026: [Bundestag](https://www.bundestag.de/dokumente/textarchiv/2026/kw31-regierungsumbildung-1200848)
- Merz und 2029: [newstime (dpa)](https://newstime.joyn.de/themen/politik/zweite-amtszeit-als-kanzler-merz-macht-klare-ansage-68065)
- BSW: [ZDF, Parteitag Magdeburg](https://www.zdfheute.de/politik/deutschland/bsw-parteitag-amira-mohamed-ali-wahl-linke-brandmauer-100.html), [ORF, Umbenennung](https://orf.at/stories/3413676/)

Wirtschaft, Energie, Klima
- Inflation: [Destatis Oktober 2026](https://www.destatis.de/DE/Presse/Pressemitteilungen/2026/10/PD26_382_611.html), [Destatis September 2026](https://www.destatis.de/DE/Presse/Pressemitteilungen/2026/09/PD26_348_611.html)
- Arbeitsmarkt: [BA, Oktober 2026](https://www.arbeitsagentur.de/presse/2026-41-arbeitsmarkt-im-oktober-2026)
- Wachstum: [Destatis BIP 2025](https://www.destatis.de/DE/Presse/Pressemitteilungen/2026/01/PD26%5F017%5F811.html), [Gemeinschaftsdiagnose Herbst 2026](https://www.diw.de/de/diw_01.c.1020394.de/gemeinschaftsdiagnose_herbst_2026__aufschwung_mit_strukturproblemen_____finanzpolitik_auf_abwegen.html)
- Hormus und Tankrabatt: [SRF](https://www.srf.ch/news/wirtschaft/strasse-von-hormus-gesperrt-offen-gesperrt-krieg-um-eine-meerenge), [Bundesregierung, Energiepreise](https://www.bundesregierung.de/breg-de/schwerpunkte/wirksam-regieren/fragen-antworten-energie-2425230), [Auto Bild, Energiesteuersenkung ab 1.10.2026](https://www.autobild.de/artikel/energiesteuersenkung-seit-1.-oktober-2026-baa7482-28832013.html)
- Emissionen: [UBA, Treibhausgasdaten 2025](https://www.umweltbundesamt.de/presse/pressemitteilungen/treibhausgasdaten-zeigen-klimaschutz-braucht-neuen), [Expertenrat, Prüfbericht 2026](https://expertenrat-klima.de/fileadmin/ERK/Pressemitteilungen_Meldungen/ERK2026_Pr%C3%BCfbericht-2026_Pressemitteilung.pdf), [hib 440/2026](https://www.bundestag.de/presse/hib/kurzmeldungen-1182956)

Gesetze und Außenpolitik
- Rentenkommission: [ZDF, 33 Vorschläge](https://www.zdfheute.de/politik/deutschland/rente-kommission-bericht-eintrittsalter-beitragszahler-100.html), [Bundesregierung, FAQ Rentenreform](https://www.bundesregierung.de/breg-de/aktuelles/faq-rentenreform-2444534)
- Wehrdienst: [Bundesregierung](https://www.bundesregierung.de/breg-de/service/fragen-und-antworten/neuer-wehrdienst-gesetzentwurf-2381580)
- Neue Grundsicherung: [Bundesregierung](https://www.bundesregierung.de/breg-de/aktuelles/bundesrat-neue-grundsicherung-2399562)
- Heizungsgesetz (GMG): [Bundestag, KW 28](https://www.bundestag.de/dokumente/textarchiv/2026/kw28-de-heizungsgesetz-1194534)
- Haushalt 2027: [hib 939/2026](https://www.bundestag.de/1233152)
- Ukraine: [Al Jazeera, 17.11.2026](https://www.aljazeera.com/amp/news/2026/11/17/ukraine-holds-peace-talks-with-us-europe-as-conflict-escalates), [PRIO](https://www.prio.org/comments/1933)
- AfD-Verbot: [Correctiv, Dokumente](https://correctiv.org/aktuelles/debatte-um-afd-verbot/2026/04/15/alle-wichtigen-dokumente-zum-moeglichen-afd-verbot/)
