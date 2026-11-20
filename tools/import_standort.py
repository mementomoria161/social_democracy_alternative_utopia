#!/usr/bin/env python3
"""
Datenbrücke aus „Standort 2030“: liest data/params.json aus dem Standort-Repo und schreibt
out/html/standort_data.js (Branchen und Klima-Startwerte). Aufruf aus dem Repo-Wurzelverzeichnis:

    python3 -I tools/import_standort.py [Pfad/zu/standort2030]

Ohne Pfad wird ../standort2030 angenommen. Die erzeugte Datei wird eingecheckt, damit das Spiel ohne
das Standort-Repo läuft. Zahlen ändert man in Standort 2030 (data/branchen.csv, calibrate.py), nicht hier.
"""
import json, pathlib, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
src = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT.parent / "standort2030"
params = json.loads((src / "data" / "params.json").read_text(encoding="utf-8"))

ORDER = ["auto", "maschinen", "elektro", "chemie", "stahl", "pharma", "nahrung", "bau", "digital"]
sectors = {}
for k in ORDER:
    p = params["sectors"][k]
    sectors[k] = {"name": p["name"], "wz": p["wz"], "umsatz": p["umsatz"], "emp": p["emp"],
                  "exportquote": p["exportquote"], "energy": p["energy"], "ind": p.get("ind", True), "co2": p.get("co2", 0)}

data = {
    "quelle": "Standort 2030, data/params.json (" + params["meta"]["branchen"] + ")",
    "order": ORDER,
    "sectors": sectors,
    # Emissionen 2025 in Mt CO2-Äquivalenten (Umweltbundesamt, Emissionsdaten 2025, 14.3.2026); Stahl 51 Mt (WV Stahl);
    # Chemie 37 Mt: Annahme. Pfad: Klimaschutzgesetz § 3, 2030 minus 65 % gegenüber 1990 = 438 Mt.
    "clim": {"y0": 649, "t2030": 438, "energie": 189.1, "industrie": 144.1, "gebaeude": 103.4, "verkehr": 146.3, "stahl": 51, "chemie": 37},
    "quellen": [
        "Branchen: Destatis, BVE, IW Köln, WV Stahl, WVMetalle, ZEW, ZDB (Details in Standort 2030, data/branchen.csv)",
        "Emissionen: Umweltbundesamt, Emissionsdaten 2025 (14.3.2026)",
        "Klimapfad: Bundes-Klimaschutzgesetz § 3",
    ],
}
out = ROOT / "out" / "html" / "standort_data.js"
out.write_text("/* Erzeugt von tools/import_standort.py. Nicht von Hand ändern. */\nwindow.STANDORT_DATA = "
               + json.dumps(data, ensure_ascii=False, indent=1) + ";\n", encoding="utf-8")
print("geschrieben:", out.relative_to(ROOT), "mit", len(sectors), "Branchen")
