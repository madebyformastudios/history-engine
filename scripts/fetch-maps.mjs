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

const require = createRequire(import.meta.url);
const BASE = "https://raw.githubusercontent.com/aourednik/historical-basemaps/master/geojson";
const RAW_DIR = "engine/maps-data/raw"; // download cache, not in git
const OUT = "engine/maps-data/territories.json"; // shared library: every video can use every territory
const LAND_OUT = "engine/maps-data/land.json";
const LAND_CLIP = [-40, -40, 185, 82]; // [minLon, minLat, maxLon, maxLat]; south to -40 for the Cape of Good Hope

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
  khwarazm_1218: [[[44.4, 37.6], [46.8, 38.9], [48.8, 38.4], [50.5, 37], [53.5, 37.2], [54, 40], [53, 42.5], [55.8, 45], [58.5, 46], [61.5, 46.3], [64, 45.5], [66.5, 44.8], [68.8, 44], [70.5, 42.6], [71.5, 41.5], [73, 40.5], [72.5, 39], [71.5, 37.5], [70.5, 36.5], [69, 34.5], [67, 33.5], [66, 31.5], [63.5, 29.5], [62, 26], [58, 25.5], [56.5, 27], [54, 26.8], [51.5, 27.9], [50, 30], [48.5, 30.5], [47.5, 32.5], [46, 33.8], [45.5, 35.5], [44.4, 37.6]]],
};

// ---------- Nile polygons (Egypt video) ----------
// The Nile's course, south to north, through the towns on its banks. Valley territories are
// corridors along this line, so they follow the river (and its bends) rather than a box.
const NILE = {
  // Napata / Karima (31.83, 18.53) up through the Great Bend: Ed Debba, Dongola, Kerma, the 3rd
  // cataract (Tombos), Sai, Semna and the 2nd cataract (Wadi Halfa), Abu Simbel, to Aswan.
  nubia: [[32.3, 18.95], [31.83, 18.53], [31.3, 18.2], [30.95, 18.05], [30.55, 18.6], [30.48, 19.17], [30.42, 19.63], [30.33, 19.8], [30.4, 20.7], [30.95, 21.5], [31.35, 21.85], [31.62, 22.34], [32.4, 23.1], [32.85, 23.6], [32.89, 24.08]],
  // Aswan (1st cataract) to the delta apex north of Cairo: Kom Ombo, Edfu, Esna, Thebes (Luxor),
  // the Qena bend, Nag Hammadi, Sohag, Asyut, Cusae (el-Qusiya), Amarna, Minya, Beni Suef, Memphis.
  valley: [[32.89, 24.08], [32.93, 24.45], [32.87, 24.98], [32.55, 25.3], [32.64, 25.7], [32.72, 26.0], [32.73, 26.16], [32.45, 26.15], [32.25, 26.05], [31.95, 26.3], [31.7, 26.55], [31.45, 26.9], [31.18, 27.18], [30.85, 27.44], [30.88, 27.7], [30.75, 28.1], [30.8, 28.5], [31.0, 28.85], [31.1, 29.07], [31.22, 29.45], [31.25, 29.85], [31.23, 30.06], [31.18, 30.2]],
};
const nileBetween = (pts, south, north) => pts.filter(([, lat]) => lat >= south && lat <= north);
/** A band of `half` degrees either side of a polyline (lon scaled by cos(lat)), as one ring. */
const corridor = (pts, half) => {
  const left = [], right = [];
  pts.forEach((p, i) => {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
    const k = Math.cos((p[1] * Math.PI) / 180);
    const dx = (b[0] - a[0]) * k, dy = b[1] - a[1];
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len / k, ny = dx / len; // unit normal, back in lon/lat
    left.push([p[0] + nx * half, p[1] + ny * half]);
    right.push([p[0] - nx * half, p[1] - ny * half]);
  });
  return [...left, ...right.reverse(), left[0]];
};
// The delta: apex north of Memphis, out along the Rosetta and Damietta branches to the coast,
// with the Pelusiac east and Lake Mareotis (Alexandria) west. Sea side is rough (clipped to land).
const DELTA = [[31.05, 29.95], [30.6, 30.3], [30.05, 30.65], [29.75, 31.0], [29.6, 31.3], [30.4, 31.7], [31.8, 31.7], [32.45, 31.4], [32.3, 30.95], [31.9, 30.5], [31.45, 30.05], [31.4, 29.95], [31.05, 29.95]];
const DELTA_WEST = [[31.18, 30.2], [30.95, 30.45], [30.75, 30.75], [30.55, 31.05], [30.42, 31.3], [30.38, 31.7], [29.6, 31.3], [29.75, 31.0], [30.05, 30.65], [30.6, 30.3], [31.05, 29.95], [31.18, 30.2]]; // west of the Rosetta branch
const DELTA_EAST = [[31.18, 30.2], [30.95, 30.45], [30.75, 30.75], [30.55, 31.05], [30.42, 31.3], [30.38, 31.7], [31.8, 31.7], [32.45, 31.4], [32.3, 30.95], [31.9, 30.5], [31.45, 30.05], [31.4, 29.95], [31.05, 29.95], [31.18, 30.2]];
// North Sinai coast road (the "Ways of Horus"), Pelusium to Gaza.
const NORTH_SINAI = [[32.3, 30.85], [32.35, 31.45], [34.25, 31.45], [34.3, 31.15], [33.2, 30.9], [32.3, 30.85]];
// Faiyum oasis, west of the valley at Beni Suef / Lahun.
const FAIYUM = [[30.45, 29.25], [30.6, 29.6], [31.0, 29.5], [31.1, 29.2], [30.85, 29.05], [30.45, 29.25]];

Object.assign(HANDMADE, {
  // MAP-01: today's inhabited strip, the Nile valley from Lake Nasser (22°N) to the delta, plus the
  // delta and the Faiyum. Width exaggerated (real valley 5-20 km) so it reads at map scale.
  nile_valley: [corridor([...nileBetween(NILE.nubia, 22, 25), ...NILE.valley.slice(1)], 0.13), DELTA, FAIYUM],
  // MAP-02: Upper Egypt ~3200 BC, the valley from the 1st cataract (Aswan) to just south of Memphis.
  upper_egypt_3200bc: [corridor(nileBetween(NILE.valley, 24, 29.75), 0.22), FAIYUM],
  // MAP-02: Lower Egypt ~3200 BC, the delta from Memphis to the sea.
  lower_egypt_3200bc: [DELTA, corridor(nileBetween(NILE.valley, 29.4, 30.3), 0.22)],
  // MAP-04: Egypt split ~2150 BC (First Intermediate Period). Seven rough power blocks along the
  // river, cut at known seats: the two delta halves (Rosetta branch), Memphis/Herakleopolis,
  // Middle Egypt (Hermopolis), Asyut-Abydos, Thebes, and Edfu-Elephantine.
  fip_delta_west: [DELTA_WEST],
  fip_delta_east: [DELTA_EAST],
  fip_herakleopolis: [corridor(nileBetween(NILE.valley, 28.85, 30.2), 0.22), FAIYUM],
  fip_hermopolis: [corridor(nileBetween(NILE.valley, 27.44, 28.85), 0.22)],
  fip_asyut: [corridor(nileBetween(NILE.valley, 26.15, 27.44), 0.22)],
  fip_thebes: [corridor(nileBetween(NILE.valley, 25.3, 26.16), 0.22)],
  fip_elephantine: [corridor(nileBetween(NILE.valley, 24, 25.3), 0.22)],
  // Lower Nubia to the 2nd cataract (Semna forts), held by the Middle Kingdom.
  nubia_lower: [corridor(nileBetween(NILE.nubia, 21.4, 24.1), 0.3)],
  // MAP-05: ~1650 BC. Hyksos: the delta, north Sinai and the valley down to Cusae (27.44°N).
  // Thebans: the valley from Cusae south to Aswan.
  hyksos_valley_1650bc: [corridor(nileBetween(NILE.valley, 27.44, 30.2), 0.22), FAIYUM],
  theban_valley_1650bc: [corridor(nileBetween(NILE.valley, 24, 27.44), 0.22)],
  north_sinai: [NORTH_SINAI],
  // MAP-06: New Kingdom ~1450 BC. Levant: Canaan and the Syrian coast up to Ugarit, inland to
  // Carchemish and the Euphrates bend (Thutmose III's stela). Sea side rough.
  egypt_levant_1450bc: [[[32.3, 30.85], [32.35, 31.45], [34.0, 31.6], [34.6, 32.7], [35.2, 34.0], [35.6, 35.4], [35.6, 36.1], [36.3, 36.5], [37.2, 36.85], [38.05, 36.9], [38.3, 36.0], [37.8, 35.2], [37.0, 34.0], [36.8, 33.0], [36.0, 32.0], [35.5, 31.0], [35.0, 29.6], [34.2, 30.4], [33.2, 30.9], [32.3, 30.85]]],
  // Nubia to the 4th cataract (Kurgus), along the Nile.
  egypt_nubia_1450bc: [corridor(nileBetween(NILE.nubia, 18, 24.1), 0.35)],
  // MAP-07: Egypt's Levant ~1274 BC: Canaan and the coast to Byblos, inland to Damascus; the
  // frontier with the Hittites runs just south of Kadesh (34.56°N).
  egypt_levant_1274bc: [[[32.3, 30.85], [32.35, 31.45], [34.0, 31.6], [34.6, 32.7], [35.2, 34.2], [36.0, 34.45], [36.6, 34.3], [36.9, 33.5], [36.6, 32.5], [36.0, 31.5], [35.5, 30.5], [35.0, 29.6], [34.2, 30.4], [33.2, 30.9], [32.3, 30.85]]],
  // Hittite northern Syria ~1274 BC: from the coast at Ugarit to Kadesh and the Euphrates bend.
  hittite_syria_1274bc: [[[35.2, 34.2], [35.6, 35.4], [35.6, 36.1], [36.3, 36.5], [37.2, 36.85], [38.05, 36.9], [38.3, 36.0], [37.8, 35.2], [37.0, 34.4], [36.6, 34.3], [36.0, 34.45], [35.2, 34.2]]],
  // MAP-17: lands Muhammad Ali took. Sudan 1820-22: Nubia, Dongola, Sennar and Kordofan (west edge
  // ~27.5°E, Darfur only fell in 1874), south to the Blue Nile at Fazughli (~11.5°N).
  sudan_1820s: [[[25.0, 22.0], [31.4, 22.0], [36.9, 22.0], [37.3, 19.5], [36.6, 15.8], [35.6, 13.2], [34.4, 11.5], [32.6, 11.9], [30.4, 11.0], [27.5, 12.2], [27.5, 16.0], [25.0, 20.0], [25.0, 22.0]]],
  // Hejaz campaign 1811-18: the Red Sea coast of Arabia from Aqaba to Asir, inland past Medina
  // and Mecca. Sea side rough.
  hejaz_1818: [[[35.0, 29.5], [36.6, 29.2], [38.6, 27.5], [40.6, 25.4], [41.6, 23.0], [42.2, 20.5], [42.8, 18.4], [42.4, 17.0], [41.0, 17.4], [39.0, 21.0], [37.4, 24.0], [35.4, 27.0], [34.6, 28.3], [35.0, 29.5]]],
  // Syria campaign 1831-40: Palestine, Lebanon, Syria and Cilicia (Adana), up to the Taurus.
  syria_1831: [[[34.25, 31.3], [34.0, 31.6], [34.6, 32.8], [35.3, 34.3], [35.6, 35.6], [35.5, 36.5], [34.5, 36.7], [34.6, 37.3], [36.0, 37.4], [37.5, 37.0], [38.2, 36.5], [38.8, 35.6], [38.5, 34.5], [37.6, 33.0], [36.8, 32.0], [36.0, 30.5], [35.0, 29.5], [34.9, 29.5], [34.25, 31.3]]],
  // MAP-21/22: Sinai as taken in 1967, the Suez Canal (Port Said - Ismailia - Bitter Lakes - Suez)
  // to the 1906 Rafah-Taba line. Gulf sides run down the water (clipped to land).
  sinai_1967: [[[32.31, 31.4], [32.33, 31.26], [32.32, 30.85], [32.29, 30.6], [32.35, 30.4], [32.4, 30.3], [32.53, 30.1], [32.56, 29.95], [32.65, 29.7], [33.3, 28.6], [33.9, 27.7], [34.3, 27.6], [34.6, 28.3], [34.75, 29.0], [34.9, 29.49], [34.73, 29.95], [34.55, 30.4], [34.4, 30.85], [34.25, 31.31], [34.15, 31.45], [32.31, 31.4]]],
  // Gaza Strip, Rafah to Beit Hanoun.
  gaza_1967: [[[34.25, 31.31], [34.37, 31.38], [34.57, 31.55], [34.49, 31.62], [34.15, 31.45], [34.25, 31.31]]],
});

// id -> list of sources merged into one MultiPolygon.
//   { file, names: [feature NAME...], centroidIn?: [minLon,minLat,maxLon,maxLat] }  (dataset)
//   { handmade: key }                                                             (HANDMADE)
//   { country: name }   modern border, Natural Earth 50m (world-atlas countries-50m)
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

  // ---------- Egypt video ----------
  nile_valley: [{ handmade: "nile_valley" }],
  upper_egypt_3200bc: [{ handmade: "upper_egypt_3200bc" }],
  lower_egypt_3200bc: [{ handmade: "lower_egypt_3200bc" }],
  // The Nile valley + delta, Aswan to the sea: the core of every ancient Egyptian state.
  egypt_old_kingdom: [{ handmade: "upper_egypt_3200bc" }, { handmade: "lower_egypt_3200bc" }],
  egypt_heartland: [{ handmade: "upper_egypt_3200bc" }, { handmade: "lower_egypt_3200bc" }],
  fip_delta_west: [{ handmade: "fip_delta_west" }],
  fip_delta_east: [{ handmade: "fip_delta_east" }],
  fip_herakleopolis: [{ handmade: "fip_herakleopolis" }],
  fip_hermopolis: [{ handmade: "fip_hermopolis" }],
  fip_asyut: [{ handmade: "fip_asyut" }],
  fip_thebes: [{ handmade: "fip_thebes" }],
  fip_elephantine: [{ handmade: "fip_elephantine" }],
  egypt_middle_kingdom: [{ handmade: "upper_egypt_3200bc" }, { handmade: "lower_egypt_3200bc" }, { handmade: "nubia_lower" }],
  hyksos_1650bc: [{ handmade: "lower_egypt_3200bc" }, { handmade: "hyksos_valley_1650bc" }, { handmade: "north_sinai" }],
  egypt_theban_1650bc: [{ handmade: "theban_valley_1650bc" }],
  egypt_levant_1450bc: [{ handmade: "egypt_levant_1450bc" }],
  egypt_nubia_1450bc: [{ handmade: "egypt_nubia_1450bc" }],
  egypt_1274bc: [{ handmade: "upper_egypt_3200bc" }, { handmade: "lower_egypt_3200bc" }, { handmade: "egypt_nubia_1450bc" }, { handmade: "egypt_levant_1274bc" }],
  // Hittite Empire ~1274 BC: the dataset's Anatolia (world_bc1500) + hand-made northern Syria.
  hittite_1274bc: [{ file: "world_bc1500", names: ["Hittites"] }, { handmade: "hittite_syria_1274bc" }],
  kush_750bc: [{ file: "world_bc700", names: ["Kush"] }],
  // 25th dynasty ~730 BC: Kush plus the whole Nile valley to the sea.
  kush_25th_dynasty: [{ file: "world_bc700", names: ["Kush"] }, { handmade: "egypt_nubia_1450bc" }, { handmade: "upper_egypt_3200bc" }, { handmade: "lower_egypt_3200bc" }],
  achaemenid_500bc: [{ file: "world_bc500", names: ["Achaemenid Empire"] }],
  ptolemaic_200bc: [{ file: "world_bc200", names: ["Ptolemaic Kingdom"] }],
  seleucid_200bc: [{ file: "world_bc200", names: ["Seleucid Kingdom"] }],
  macedon_200bc: [{ file: "world_bc200", names: ["Macedon and Hellenic League"] }],
  roman_bc1: [{ file: "world_bc1", names: ["Roman Empire"] }],
  eastern_roman_600: [{ file: "world_600", names: ["Eastern Roman Empire"] }],
  sasanian_600: [{ file: "world_600", names: ["Sasanian Empire", "Sasanian dependencies"] }],
  hejaz_600: [{ file: "world_600", names: ["Hejaz"] }],
  mamluk_1492: [{ file: "world_1492", names: ["Mamluke Sultanate"] }],
  ottoman_1492: [{ file: "world_1492", names: ["Ottoman Empire"] }],
  ottoman_1530: [{ file: "world_1530", names: ["Ottoman Empire"] }],
  egypt_1811: [{ file: "world_1815", names: ["Egypt"] }],
  ottoman_1815: [{ file: "world_1815", names: ["Ottoman Empire"] }],
  sudan_1820s: [{ handmade: "sudan_1820s" }],
  hejaz_1818: [{ handmade: "hejaz_1818" }],
  syria_1831: [{ handmade: "syria_1831" }],
  sinai_1967: [{ handmade: "sinai_1967" }],
  gaza_1967: [{ handmade: "gaza_1967" }],
  // Modern borders (Natural Earth 50m via world-atlas).
  egypt_modern: [{ country: "Egypt" }],
  israel_modern: [{ country: "Israel" }],
  syria_modern: [{ country: "Syria" }],
  sudan_modern: [{ country: "Sudan" }],
  south_sudan_modern: [{ country: "S. Sudan" }],
  ethiopia_modern: [{ country: "Ethiopia" }],
};

const round = (n) => Math.round(n * 100) / 100;
const roundCoords = (c) => (typeof c[0] === "number" ? [round(c[0]), round(c[1])] : c.map(roundCoords));
const inBox = ([x, y], [x0, y0, x1, y1]) => x >= x0 && x <= x1 && y >= y0 && y <= y1;

// d3-geo wants clockwise exterior rings; fix rings that would cover "the rest of the globe".
const fixWinding = (poly) => (geoArea({ type: "Polygon", coordinates: poly }) > 2 * Math.PI ? poly.map((r) => [...r].reverse()) : poly);

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

const countriesTopo = require("world-atlas/countries-50m.json");
const countries = feature(countriesTopo, countriesTopo.objects.countries);

const out = {};
for (const [id, sources] of Object.entries(MAP_KEYFRAMES)) {
  const polys = [];
  const used = [];
  for (const src of sources) {
    if (src.country) {
      const f = countries.features.find((c) => c.properties.name === src.country);
      if (!f) throw new Error(`No country "${src.country}" in world-atlas`);
      const g = f.geometry;
      polys.push(...(g.type === "Polygon" ? [g.coordinates] : g.coordinates).map(fixWinding));
      used.push(`naturalearth:${src.country}`);
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
