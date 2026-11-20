/* Erzeugt von tools/import_standort.py. Nicht von Hand ändern. */
window.STANDORT_DATA = {
 "quelle": "Standort 2030, data/params.json (Destatis 2022 (Umsatz, Exportquote), Q3 2025 (Beschäftigte))",
 "order": [
  "auto",
  "maschinen",
  "elektro",
  "chemie",
  "stahl",
  "pharma",
  "nahrung",
  "bau",
  "digital"
 ],
 "sectors": {
  "auto": {
   "name": "Automobil",
   "wz": "C29",
   "umsatz": 509.0,
   "emp": 721.4,
   "exportquote": 0.694,
   "energy": 0.005,
   "ind": true,
   "co2": 0.0
  },
  "maschinen": {
   "name": "Maschinenbau",
   "wz": "C28",
   "umsatz": 269.3,
   "emp": 934.2,
   "exportquote": 0.624,
   "energy": 0.008,
   "ind": true,
   "co2": 0.0
  },
  "elektro": {
   "name": "Elektro",
   "wz": "C27",
   "umsatz": 115.2,
   "emp": 387.5,
   "exportquote": 0.48,
   "energy": 0.009,
   "ind": true,
   "co2": 0.0
  },
  "chemie": {
   "name": "Chemie",
   "wz": "C20",
   "umsatz": 202.4,
   "emp": 323.6,
   "exportquote": 0.615,
   "energy": 0.031,
   "ind": true,
   "co2": 37.0
  },
  "stahl": {
   "name": "Stahl und Metall",
   "wz": "C24",
   "umsatz": 114.9,
   "emp": 227.0,
   "exportquote": 0.47,
   "energy": 0.076,
   "ind": true,
   "co2": 51.0
  },
  "pharma": {
   "name": "Pharma",
   "wz": "C21",
   "umsatz": 59.2,
   "emp": 133.4,
   "exportquote": 0.624,
   "energy": 0.013,
   "ind": true,
   "co2": 0.0
  },
  "nahrung": {
   "name": "Ernährung",
   "wz": "C10-11",
   "umsatz": 232.7,
   "emp": 658.2,
   "exportquote": 0.36,
   "energy": 0.02,
   "ind": true,
   "co2": 0.0
  },
  "bau": {
   "name": "Bau",
   "wz": "F",
   "umsatz": 121.0,
   "emp": 923.0,
   "exportquote": 0.02,
   "energy": 0.02,
   "ind": false,
   "co2": 0.0
  },
  "digital": {
   "name": "Digitales und KI",
   "wz": "J62-63",
   "umsatz": 198.0,
   "emp": 924.0,
   "exportquote": 0.15,
   "energy": 0.01,
   "ind": false,
   "co2": 0.0
  }
 },
 "clim": {
  "y0": 649,
  "t2030": 438,
  "energie": 189.1,
  "industrie": 144.1,
  "gebaeude": 103.4,
  "verkehr": 146.3,
  "stahl": 51,
  "chemie": 37
 },
 "quellen": [
  "Branchen: Destatis, BVE, IW Köln, WV Stahl, WVMetalle, ZEW, ZDB (Details in Standort 2030, data/branchen.csv)",
  "Emissionen: Umweltbundesamt, Emissionsdaten 2025 (14.3.2026)",
  "Klimapfad: Bundes-Klimaschutzgesetz § 3"
 ]
};
