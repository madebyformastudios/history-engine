// Builds the map data used by <MapScene>:
//   engine/maps-data/territories.json  – named MultiPolygons (one per keyframe) from aourednik/historical-basemaps
//   engine/maps-data/land.json         – Natural Earth 50m land (world-atlas), clipped to LAND_CLIP
// Usage: node scripts/fetch-maps.mjs
// For a new topic, edit MAP_KEYFRAMES (and LAND_CLIP) below and re-run.
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { feature } from "topojson-client";
import { geoArea, geoCentroid } from "d3-geo";
import { execFileSync } from "node:child_process";

const require = createRequire(import.meta.url);
const BASE = "https://raw.githubusercontent.com/aourednik/historical-basemaps/master/geojson";
const RAW_DIR = "engine/maps-data/raw"; // download cache, not in git
const OUT = "engine/maps-data/territories.json"; // shared library: every video can use every territory
const LAND_OUT = "engine/maps-data/land.json";
const LAND_CLIP = [-40, -15, 185, 82]; // [minLon, minLat, maxLon, maxLat]

// Hand-made polygons (lon/lat) for things the dataset lacks or gets wrong.
// Every one of these is listed in BUILD_REPORT.md. Territories are clipped to land at render
// time, so coastlines here can be rough.
const HANDMADE = {
  // MAP-02: steppe tribes around 1180 (no dataset has these).
  // Neighbouring tribes share vertices so the zones tile without gaps.
  tribe_naimans: [[[85, 49], [87.5, 51], [91, 51.6], [95, 50.8], [98.6, 49.6], [98.8, 47.2], [97.6, 45], [94, 44.2], [90, 44.6], [86.5, 46], [85, 49]]],
  tribe_keraites: [[[98.8, 47.2], [98.6, 49.6], [101.6, 50.2], [104.4, 49.9], [107.4, 49.2], [108.4, 47.6], [107.6, 45.4], [104.5, 44.6], [101.2, 44.9], [97.6, 45], [98.8, 47.2]]],
  tribe_merkits: [[[101.6, 50.2], [100.8, 52.1], [103.2, 53.3], [106.2, 53], [108.6, 52], [109.6, 50.9], [107.4, 49.2], [104.4, 49.9], [101.6, 50.2]]],
  tribe_mongols: [[[107.4, 49.2], [109.6, 50.9], [111.6, 51.1], [114, 50.6], [115.4, 49.4], [114.6, 47.6], [113, 46.6], [110.5, 46.4], [108.4, 47.6], [107.4, 49.2]]],
  tribe_tatars: [[[115.4, 49.4], [117.7, 50.1], [120.1, 49.6], [121.2, 47.5], [120.5, 45.4], [118, 44.4], [115.2, 44.9], [113, 46.6], [114.6, 47.6], [115.4, 49.4]]],
  // MAP-03/04: the unified Mongol state of 1206 (Mongolia proper). The dataset's 1200
  // "Mongol Empire" is a coarse box reaching into Siberia and Manchuria.
  mongol_1206: [[[87, 49], [90, 51.5], [94, 52], [98, 52], [104, 53.5], [109, 53], [114, 51.5], [118, 50.2], [120.5, 49], [120.5, 46.5], [118, 44.4], [115.2, 42.6], [112.5, 41.8], [110.5, 41.2], [106, 41.8], [100, 42.3], [96, 42.6], [92, 44], [89, 45.5], [87, 47], [87, 49]]],
  // MAP-04: former Kara Khitai lands, taken by the Mongols in 1218; tiles against Khwarazm and Mongolia.
  kara_khitai_1218: [[[66.5, 44.8], [68.8, 44], [70.5, 42.6], [71.5, 41.5], [73, 40.5], [74.5, 39.5], [76, 38.6], [80, 37.9], [84, 38.6], [88, 40], [92, 42.4], [96, 42.6], [92, 44], [89, 45.5], [87, 47], [87, 49], [84, 50.2], [80, 49.8], [76, 48.4], [72, 47.2], [69, 46.2], [66.5, 44.8]]],
  // MAP-03: Southern Song ~1210, south of the Huai river / Qinling (dataset pushes Song to 40°N).
  song_1210: [[[104.3, 35.2], [105.6, 34.4], [107.2, 33.6], [111.2, 33], [114.2, 32.6], [117, 32.9], [119.8, 33.6], [121.5, 32], [122, 30], [121, 28], [119.5, 25.5], [117, 23.5], [113.5, 22], [110, 21], [108, 21.5], [106.5, 22.8], [105.5, 23.5], [104, 24], [102.5, 26], [102, 28.5], [102.5, 31], [103.5, 33.5], [104.3, 35.2]]],
  // MAP-03: Jin dynasty ~1210. The dataset only has a small "Liao" polygon in Manchuria and
  // pushes Song up to 40°N, so Jin (north China down to the Huai river + Manchuria) is hand-made.
  jin_1210: [[[104.3, 35.2], [105.8, 37.6], [108.2, 39.3], [110.5, 40.6], [112.5, 41.8], [115.2, 42.6], [118, 44.4], [120.5, 45.4], [121.2, 47.5], [123.5, 49.6], [127, 50.2], [131, 48.4], [134.6, 48.2], [133.2, 45], [131.2, 42.9], [129.6, 42.4], [128, 41.9], [126.5, 41.6], [124.4, 40], [121.5, 39.2], [119, 39.6], [117.8, 38.6], [118.7, 37.4], [122.6, 37.3], [120.5, 35.9], [119.2, 34.8], [119.8, 33.6], [117, 32.9], [114.2, 32.6], [111.2, 33], [107.2, 33.6], [105.6, 34.4], [104.3, 35.2]]],
  // MAP-04: Khwarazmian Empire ~1218 (dataset polygon is a small, misplaced fragment).
  // MAP-07: what was left of the Abbasid caliphate in 1258 (central/southern Iraq). The 1279
  // Ilkhanate polygon already includes Iraq, so this sits on top until Baghdad falls.
  abbasid_1258: [[[42.4, 35.1], [44.5, 35.3], [46.2, 33.5], [47.6, 31.8], [48.5, 30.0], [47.8, 29.4], [46.5, 29.9], [45, 30.7], [43.6, 31.5], [42.0, 32.9], [41.0, 34.4], [42.4, 35.1]]],
  // ---- Iran video (2026) ----
  // Median kingdom c. 585 BC: from the Halys river (central Anatolia) over Armenia and the Zagros to eastern Iran;
  // Persis and Babylonia excluded. Rough estimate (borders of Media are poorly known).
  media_bc585: [[[34, 41], [38, 41.5], [42, 41.5], [46, 41], [50, 38.5], [54, 37.5], [58, 38], [62, 36.5], [64, 33], [61, 31], [56, 32], [53, 31.2], [51, 31.6], [49, 32.6], [47, 34], [45, 35.5], [42, 36.5], [38, 37], [35, 38.5], [34, 41]]],
  // Persis (Fars) c. 559 BC, the Persian homeland under Median overlordship: Zagros foothills to the Gulf coast.
  persis_bc559: [[[49.5, 31], [51, 31.6], [53, 31.2], [55, 28.5], [54, 27], [52, 27.3], [50.8, 28.5], [50, 29.5], [49.5, 31]]],
  // Lydia c. 560 BC: western Anatolia east to the Halys river (Kizilirmak).
  lydia_bc560: [[[26, 41], [29, 41.2], [32, 41.8], [34, 41], [35, 38.5], [33, 37], [30, 36.5], [28, 36.7], [26.5, 38], [26, 41]]],
  // Neo-Babylonian empire c. 550 BC: Mesopotamia south of the Median border, plus Syria and the Levant.
  babylonia_bc550: [[[38, 37], [42, 36.5], [45, 35.5], [47, 34], [48.5, 31], [48, 29.5], [46, 30], [43, 31], [39, 32], [36, 30], [34.5, 31.5], [35, 33.5], [36, 35.5], [37, 36.8], [38, 37]]],
  // Caucasus lands lost to Russia by the treaties of 1813 and 1828: everything north of the Aras river
  // (Georgia, Dagestan, today's Armenia and Azerbaijan), following the Aras from Turkey to the Caspian.
  caucasus_lost_1828: [[[40, 43], [44, 43.5], [47.5, 43.8], [48.5, 41.8], [49.6, 40.5], [48.9, 39.3], [48, 38.4], [47, 39.2], [46, 38.9], [45, 39.6], [44, 40], [43, 41], [41.5, 41.5], [40, 43]]],
  // Anglo-Russian Convention 1907. Russian zone: north of the line Qasr-e Shirin, Isfahan, Yazd, Zulfiqar.
  sphere_russia_1907: [[[44, 39.5], [45.5, 34.5], [51.7, 32.6], [54.4, 31.9], [61, 35.6], [60.5, 36.6], [57, 38.2], [54, 37.4], [49, 38.3], [48, 39.5], [46, 39], [44, 39.5]]],
  // British zone: southeast of the line Afghan border, Birjand, Kerman, Bandar Abbas.
  sphere_britain_1907: [[[61, 34.5], [59.2, 32.9], [57.1, 30.3], [56.3, 27.2], [57.5, 25.5], [61.6, 25.2], [63, 26.5], [61.5, 29.5], [61, 31.5], [61, 34.5]]],
  khwarazm_1218: [[[44.4, 37.6], [46.8, 38.9], [48.8, 38.4], [50.5, 37], [53.5, 37.2], [54, 40], [53, 42.5], [55.8, 45], [58.5, 46], [61.5, 46.3], [64, 45.5], [66.5, 44.8], [68.8, 44], [70.5, 42.6], [71.5, 41.5], [73, 40.5], [72.5, 39], [71.5, 37.5], [70.5, 36.5], [69, 34.5], [67, 33.5], [66, 31.5], [63.5, 29.5], [62, 26], [58, 25.5], [56.5, 27], [54, 26.8], [51.5, 27.9], [50, 30], [48.5, 30.5], [47.5, 32.5], [46, 33.8], [45.5, 35.5], [44.4, 37.6]]],
};

// id -> list of sources merged into one MultiPolygon.
//   { clio: "Polity name", year }                                                 (Cliopatria, preferred: borders per year)
//   { file, names: [feature NAME...], centroidIn?: [minLon,minLat,maxLon,maxLat] }  (historical-basemaps, coarse)
//   { handmade: key }                                                             (HANDMADE)
// Cliopatria (Seshat Global History Databank, CC BY 4.0) has borders per year for ~1600 polities from 3400 BC
// to 2024; names as in its "Name" field (e.g. "Achaemenid Empire", "Sasanian Empire", "Qajar Dynasty").
// Credit in the video description: "Borders: Cliopatria, Seshat Global History Databank (CC BY 4.0)".
const MAP_KEYFRAMES = {
  // Peak extent (MAP-01): the four khanates in 1279, Rus vassal principalities with the Golden Horde.
  yuan_1279: [{ file: "world_1279", names: ["Great Khanate"] }],
  chagatai_1279: [{ file: "world_1279", names: ["Chagatai Khanate"] }],
  ilkhanate_1279: [{ file: "world_1279", names: ["Ilkhanate"] }],
  golden_1279: [{ file: "world_1279", names: ["Khanate of the Golden Horde"] }],
  rus_vassals_1279: [{ file: "world_1279", names: ["Ryazan"] }],
  mamluk_1279: [{ file: "world_1279", names: ["Mamluke Sultanate"] }],
  // Four khanates around 1294 (MAP-08/09/10): world_1300 is the nearest file.
  yuan_1300: [{ file: "world_1300", names: ["Great Khanate"] }],
  chagatai_1300: [{ file: "world_1300", names: ["Chagatai Khanate"] }],
  ilkhanate_1300: [{ file: "world_1300", names: ["Ilkhanate"] }],
  golden_1300: [{ file: "world_1300", names: ["Khanate of the Golden Horde"] }],
  // Decline (MAP-10)
  golden_1492: [{ file: "world_1492", names: ["Golden Horde"] }],
  ming_1492: [{ file: "world_1492", names: ["Ming Empire"] }],
  // ~1200 states
  mongol_1200: [{ file: "world_1200", names: ["Mongol Empire"] }],
  xixia_1200: [{ file: "world_1200", names: ["Xixia"] }],
  song_1200: [{ file: "world_1200", names: ["Song Empire"] }],
  hungary_1200: [{ file: "world_1200", names: ["Hungary"] }],
  poland_1200: [{ file: "world_1200", names: ["Poland"] }],
  georgia_1200: [{ file: "world_1200", names: ["Georgia"] }],
  rus_1200: [{ file: "world_1200", names: ["Principality of Kyiv", "Principality of Vladimir-Suzdal", "Other Rus Principalities", "Principality of Novgorod", "Principality of Galicia-Volhynia"] }],
  // Hand-made
  tribe_naimans: [{ handmade: "tribe_naimans" }],
  tribe_keraites: [{ handmade: "tribe_keraites" }],
  tribe_merkits: [{ handmade: "tribe_merkits" }],
  tribe_mongols: [{ handmade: "tribe_mongols" }],
  tribe_tatars: [{ handmade: "tribe_tatars" }],
  jin_1210: [{ handmade: "jin_1210" }],
  song_1210: [{ handmade: "song_1210" }],
  mongol_1206: [{ handmade: "mongol_1206" }],
  // 1218: Mongolia + the former Kara Khitai lands taken that year.
  mongol_1218: [{ handmade: "mongol_1206" }, { handmade: "kara_khitai_1218" }],
  khwarazm_1218: [{ handmade: "khwarazm_1218" }],
  abbasid_1258: [{ handmade: "abbasid_1258" }],
  // ---- Iran video (2026): dataset territories ----
  elam_bc1000: [{ file: "world_bc1000", names: ["Elam"] }],
  achaemenid_bc500: [{ file: "world_bc500", names: ["Achaemenid Empire"] }],
  greek_bc500: [{ file: "world_bc500", names: ["Greek city-states"] }],
  alexander_bc323: [{ file: "world_bc323", names: ["Empire of Alexander"] }],
  seleucid_bc300: [{ file: "world_bc300", names: ["Seleucid Kingdom"] }],
  seleucid_bc200: [{ file: "world_bc200", names: ["Seleucid Kingdom"] }],
  parthia_bc200: [{ file: "world_bc200", names: ["Parthia"] }],
  parthia_bc100: [{ file: "world_bc100", names: ["Parthia"] }],
  roman_bc100: [{ file: "world_bc100", names: ["Roman Republic"] }],
  parthian_bc1: [{ file: "world_bc1", names: ["Parthian Empire"] }],
  roman_bc1: [{ file: "world_bc1", names: ["Roman Empire"] }],
  parthian_200: [{ file: "world_200", names: ["Parthian Empire"] }],
  sasanian_500: [{ file: "world_500", names: ["Sasanian Empire"] }],
  sasanian_600: [{ file: "world_600", names: ["Sasanian Empire"] }],
  byzantine_600: [{ file: "world_600", names: ["Eastern Roman Empire"] }],
  abbasid_800: [{ file: "world_800", names: ["Abbasid Caliphate"] }],
  seljuk_1100: [{ file: "world_1100", names: ["Seljuk Empire"] }],
  safavid_1530: [{ file: "world_1530", names: ["Safavid Empire"] }],
  safavid_1650: [{ file: "world_1650", names: ["Safavid Empire"] }],
  ottoman_1650: [{ file: "world_1650", names: ["Ottoman Empire"] }],
  persia_1783: [{ file: "world_1783", names: ["Persia"], centroidIn: [30, 20, 70, 45] }],
  afghanistan_1783: [{ file: "world_1783", names: ["Afghanistan"] }],
  persia_1815: [{ file: "world_1815", names: ["Persia"], centroidIn: [30, 20, 70, 45] }],
  russia_1815: [{ file: "world_1815", names: ["Russian Empire"] }],
  persia_1900: [{ file: "world_1900", names: ["Persia"], centroidIn: [30, 20, 70, 45] }],
  iran_1938: [{ file: "world_1938", names: ["Iran"] }],
  iran_2010: [{ file: "world_2010", names: ["Iran"] }],
  iraq_2010: [{ file: "world_2010", names: ["Iraq"] }],
  israel_2010: [{ file: "world_2010", names: ["Israel"] }],
  lebanon_2010: [{ file: "world_2010", names: ["Lebanon"] }],
  syria_2010: [{ file: "world_2010", names: ["Syria"] }],
  yemen_2010: [{ file: "world_2010", names: ["Yemen"] }],
  saudi_2010: [{ file: "world_2010", names: ["Saudi Arabia"] }],
  gulf_2010: [{ file: "world_2010", names: ["Kuwait", "Qatar", "United Arab Emirates", "Oman"] }],
  // ---- Iran video: hand-made ----
  media_bc585: [{ handmade: "media_bc585" }],
  persis_bc559: [{ handmade: "persis_bc559" }],
  lydia_bc560: [{ handmade: "lydia_bc560" }],
  babylonia_bc550: [{ handmade: "babylonia_bc550" }],
  caucasus_lost_1828: [{ handmade: "caucasus_lost_1828" }],
  sphere_russia_1907: [{ handmade: "sphere_russia_1907" }],
  sphere_britain_1907: [{ handmade: "sphere_britain_1907" }],
};


// ---- Cliopatria territories: [id, polity name, year]. Add rows here for new videos. ----
const CLIO = [
  // Iran video
  ["clio_elam_-1200", "Elam", -1200],
  ["clio_media_-585", "Median Kingdom", -585],
  ["clio_lydia_-560", "Lydia", -560],
  ["clio_neobabylon_-560", "Neo-Babylonian Empire", -560],
  ["clio_achaemenid_-550", "Achaemenid Empire", -550],
  ["clio_achaemenid_-539", "Achaemenid Empire", -539],
  ["clio_achaemenid_-500", "Achaemenid Empire", -500],
  ["clio_macedon_-323", "Macedonian Empire", -323],
  ["clio_seleucid_-300", "Seleucid Empire", -300],
  ["clio_seleucid_-200", "Seleucid Empire", -200],
  ["clio_parthian_-238", "Parthian Empire", -238],
  ["clio_parthian_-100", "Parthian Empire", -100],
  ["clio_parthian_-53", "Parthian Empire", -53],
  ["clio_roman_-53", "Roman Republic", -53],
  ["clio_roman_117", "Roman Empire", 117],
  ["clio_sasanian_260", "Sasanian Empire", 260],
  ["clio_sasanian_600", "Sasanian Empire", 600],
  ["clio_sasanian_620", "Sasanian Empire", 620],
  ["clio_byzantine_600", "Eastern Roman Empire", 600],
  ["clio_rashidun_655", "Rashidun Caliphate", 655],
  ["clio_abbasid_800", "Abbasid Caliphate", 800],
  ["clio_seljuk_1090", "Great Seljuk Empire", 1090],
  ["clio_ilkhanate_1300", "Ilkhanate", 1300],
  ["clio_timurid_1400", "Timurid Empire", 1400],
  ["clio_safavid_1510", "Safavid Dynasty", 1510],
  ["clio_safavid_1630", "Safavid Dynasty", 1630],
  ["clio_ottoman_1630", "Ottoman Empire", 1630],
  ["clio_afsharid_1740", "Afsharid Iran", 1740],
  ["clio_qajar_1800", "Qajar Dynasty", 1800],
  ["clio_qajar_1830", "Qajar Dynasty", 1830],
  ["clio_pahlavi_1941", "Pahlavi Dynasty", 1941],
  ["clio_iran_2020", "Islamic Republic of Iran", 2020],
];
for (const [id, name, year] of CLIO) MAP_KEYFRAMES[id] = [{ clio: name, year }];

const round = (n) => Math.round(n * 100) / 100;
const roundCoords = (c) => (typeof c[0] === "number" ? [round(c[0]), round(c[1])] : c.map(roundCoords));
const inBox = ([x, y], [x0, y0, x1, y1]) => x >= x0 && x <= x1 && y >= y0 && y <= y1;

// d3-geo wants clockwise exterior rings; fix rings that would cover "the rest of the globe".
const fixWinding = (poly) => (geoArea({ type: "Polygon", coordinates: poly }) > 2 * Math.PI ? poly.map((r) => [...r].reverse()) : poly);

// Ramer-Douglas-Peucker on one ring (degrees). Cliopatria polygons are very detailed; 0.02 degrees (~2 km)
// is invisible at our zoom levels and keeps territories.json small.
const SIMPLIFY = 0.02;
function rdp(pts, eps) {
  if (pts.length < 4) return pts;
  const [a, b] = [pts[0], pts[pts.length - 1]];
  let max = 0, idx = 0;
  for (let i = 1; i < pts.length - 1; i++) {
    const p = pts[i];
    const dx = b[0] - a[0], dy = b[1] - a[1];
    // closed ring (a == b): distance to a; otherwise distance to the line a-b
    const d = dx === 0 && dy === 0 ? Math.hypot(p[0] - a[0], p[1] - a[1]) : Math.abs(dy * p[0] - dx * p[1] + b[0] * a[1] - b[1] * a[0]) / Math.hypot(dx, dy);
    if (d > max) { max = d; idx = i; }
  }
  if (max <= eps) return [a, b];
  return [...rdp(pts.slice(0, idx + 1), eps).slice(0, -1), ...rdp(pts.slice(idx), eps)];
}
const simplifyPoly = (poly) => poly.map((ring) => rdp(ring, SIMPLIFY)).filter((r) => r.length >= 4);

let clioData = null;
async function loadClio() {
  if (clioData) return clioData;
  const p = path.join(RAW_DIR, "cliopatria_polities_only.geojson");
  if (!fs.existsSync(p)) {
    fs.mkdirSync(RAW_DIR, { recursive: true });
    const zip = path.join(RAW_DIR, "cliopatria.geojson.zip");
    const res = await fetch("https://raw.githubusercontent.com/Seshat-Global-History-Databank/cliopatria/main/cliopatria.geojson.zip");
    if (!res.ok) throw new Error(`fetch cliopatria: ${res.status}`);
    fs.writeFileSync(zip, Buffer.from(await res.arrayBuffer()));
    execFileSync("unzip", ["-o", "-q", zip, "-d", RAW_DIR]);
  }
  clioData = JSON.parse(fs.readFileSync(p, "utf8"));
  return clioData;
}

async function load(file) {
  const p = path.join(RAW_DIR, `${file}.geojson`);
  if (!fs.existsSync(p)) {
    fs.mkdirSync(RAW_DIR, { recursive: true });
    const res = await fetch(`${BASE}/${file}.geojson`);
    if (!res.ok) throw new Error(`fetch ${file}: ${res.status}`);
    fs.writeFileSync(p, await res.text());
  }
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

const out = {};
for (const [id, sources] of Object.entries(MAP_KEYFRAMES)) {
  const polys = [];
  const used = [];
  for (const src of sources) {
    if (src.clio) {
      const gj = await loadClio();
      const hits = gj.features.filter((f) => f.properties.Name === src.clio && f.properties.FromYear <= src.year && src.year <= f.properties.ToYear);
      if (!hits.length) throw new Error(`Cliopatria has no "${src.clio}" in ${src.year}`);
      for (const f of hits) {
        const g = f.geometry;
        const list = g.type === "Polygon" ? [g.coordinates] : g.coordinates;
        for (const p of list) {
          const sp = simplifyPoly(p);
          if (sp.length) polys.push(fixWinding(sp));
        }
      }
      used.push(`cliopatria:${src.clio}@${src.year}`);
      continue;
    }
    if (src.handmade) {
      polys.push(...HANDMADE[src.handmade].map((p) => fixWinding([p])));
      used.push(`handmade:${src.handmade}`);
      continue;
    }
    const gj = await load(src.file);
    for (const f of gj.features) {
      if (!src.names.includes(f.properties.NAME)) continue;
      const g = f.geometry;
      const list = g.type === "Polygon" ? [g.coordinates] : g.coordinates;
      for (const p of list) {
        if (src.centroidIn && !inBox(geoCentroid({ type: "Polygon", coordinates: p }), src.centroidIn)) continue;
        polys.push(fixWinding(p));
      }
    }
    used.push(src.file);
  }
  if (!polys.length) throw new Error(`No polygons for ${id}`);
  out[id] = {
    type: "Feature",
    properties: { id, sources: used },
    geometry: { type: "MultiPolygon", coordinates: roundCoords(polys) },
  };
  console.log(`${id}: ${polys.length} polygons from ${used.join(" + ")}`);
}
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out));

// --- Land: clip each ring to LAND_CLIP (Sutherland–Hodgman in lon/lat space) ---
function clipRing(ring, [x0, y0, x1, y1]) {
  const edges = [
    (p) => p[0] >= x0, (p) => p[0] <= x1, (p) => p[1] >= y0, (p) => p[1] <= y1,
  ];
  const cut = [
    (a, b) => [x0, a[1] + ((b[1] - a[1]) * (x0 - a[0])) / (b[0] - a[0])],
    (a, b) => [x1, a[1] + ((b[1] - a[1]) * (x1 - a[0])) / (b[0] - a[0])],
    (a, b) => [a[0] + ((b[0] - a[0]) * (y0 - a[1])) / (b[1] - a[1]), y0],
    (a, b) => [a[0] + ((b[0] - a[0]) * (y1 - a[1])) / (b[1] - a[1]), y1],
  ];
  let pts = ring.slice(0, -1);
  for (let e = 0; e < 4 && pts.length; e++) {
    const next = [];
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i], b = pts[(i + 1) % pts.length];
      const ain = edges[e](a), bin = edges[e](b);
      if (ain) next.push(a);
      if (ain !== bin) next.push(cut[e](a, b));
    }
    pts = next;
  }
  return pts.length >= 3 ? [...pts, pts[0]] : null;
}
// --- Rivers: Natural Earth 10m river centerlines, inside LAND_CLIP, simplified. Used by <MapScene>
//     (`rivers: true` draws them; a line with `river: "Tigris"` follows the real river).
{
  const p = path.join(RAW_DIR, "ne_10m_rivers.geojson");
  if (!fs.existsSync(p)) {
    const res = await fetch("https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_rivers_lake_centerlines.geojson");
    if (!res.ok) throw new Error(`fetch rivers: ${res.status}`);
    fs.writeFileSync(p, await res.text());
  }
  const gj = JSON.parse(fs.readFileSync(p, "utf8"));
  const [x0, y0, x1, y1] = LAND_CLIP;
  const byName = {};
  for (const f of gj.features) {
    const name = f.properties.name_en || f.properties.name;
    if (!name || f.properties.featurecla !== "River" || f.properties.scalerank > 9) continue;
    const g = f.geometry;
    const lines = g.type === "LineString" ? [g.coordinates] : g.coordinates;
    for (const l of lines) {
      if (!l.some(([x, y]) => x >= x0 && x <= x1 && y >= y0 && y <= y1)) continue;
      (byName[name] ??= { name, rank: f.properties.scalerank, lines: [] }).lines.push(roundCoords(rdp(l, 0.01)));
    }
  }
  fs.writeFileSync("engine/maps-data/rivers.json", JSON.stringify(byName));
  console.log(`rivers: ${Object.keys(byName).length} named rivers`);
}

const topo = require("world-atlas/land-50m.json");
const landFc = feature(topo, topo.objects.land);
const landPolys = [];
for (const f of landFc.features) {
  const list = f.geometry.type === "Polygon" ? [f.geometry.coordinates] : f.geometry.coordinates;
  for (const poly of list) {
    const rings = poly.map((r) => clipRing(r, LAND_CLIP)).filter(Boolean);
    if (rings.length && rings[0]) landPolys.push(fixWinding(rings));
  }
}
fs.writeFileSync(LAND_OUT, JSON.stringify({
  type: "Feature",
  properties: { source: "Natural Earth 50m via world-atlas" },
  geometry: { type: "MultiPolygon", coordinates: roundCoords(landPolys) },
}));
console.log(`wrote ${OUT}, ${LAND_OUT} (${landPolys.length} land polygons)`);
