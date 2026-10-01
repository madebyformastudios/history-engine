// Scene-by-scene spec, transcribed from DRAAIBOEK.md (the runbook is the source of truth).
// scripts/build-scenes.mjs resolves this into src/data/scenes.json.
//
// Time references inside a scene (any string value):
//   "@word"      the moment the narrator says `word` in THIS scene (cue or anchor), e.g. "@Korea"
//   "@word+0.4"  offset in seconds from that moment
//   "^+0.5"      scene start + 0.5 s        "$-1"  scene end - 1 s
// `cues` lists the runbook's CUES in order; they are resolved first (sequentially, so a
// repeated word like "ten" in S13 picks the right occurrence) and reported in the build report.

// ---------- shared pieces ----------
const TERRA = "terracotta";
const OLIVE = "olive";

// cameras (center lon/lat + zoom on the shared Eurasia projection)
const EURASIA = { center: [74, 45], zoom: 1.45 };
const MONGOLIA = { center: [103, 48.3], zoom: 5.2 };

// MAP-02: steppe tribes (used in S04 and S11)
const TRIBES = [
  { territory: "tribe_mongols", fill: TERRA, label: "Mongols", lonlat: [111.3, 47.7] },
  { territory: "tribe_tatars", fill: OLIVE, label: "Tatars", lonlat: [117.6, 47.2] },
  { territory: "tribe_merkits", fill: "#5E6B5A", label: "Merkits", lonlat: [105, 51.4] },
  { territory: "tribe_keraites", fill: "ochre", label: "Keraites", lonlat: [103.4, 47.2] },
  { territory: "tribe_naimans", fill: "#8A6A4C", label: "Naimans", lonlat: [92, 47.8] },
];
const ONON = { id: "onon", style: "river", path: [[108.6, 48.75], [109.6, 48.95], [110.6, 49.2], [111.4, 49.6], [112.4, 50.1], [113.4, 50.45], [114.4, 50.95], [115.2, 51.4]] };
const BIRTHPLACE = [110.9, 49.35]; // Delüün Boldog area on the Onon
const tribeLayer = (tr, fill = tr.fill) => ({ territory: tr.territory, fill, opacity: 0.8 });

// MAP-04: Khwarazm (used in S20 and S22)
const CITIES_KHWARAZM = {
  otrar: { label: "Otrar", lonlat: [68.3, 42.85] },
  bukhara: { label: "Bukhara", lonlat: [64.42, 39.77], labelSide: "left" },
  samarkand: { label: "Samarkand", lonlat: [66.97, 39.65], labelSide: "bottom" },
  urgench: { label: "Urgench", lonlat: [59.15, 42.33], labelSide: "left" },
  merv: { label: "Merv", lonlat: [61.83, 37.66], labelSide: "left" },
};
const KHWARAZM_CAM = { center: [65.5, 40.6], zoom: 4.9 };

// MAP-08 khanate colors (also MAP-10's starting state)
const KHANATES = [
  { territory: "golden_1300", fill: "gold", label: "Golden Horde", lonlat: [56, 51.5], cue: "@Golden" },
  { territory: "chagatai_1300", fill: OLIVE, label: "Chagatai Khanate", lonlat: [76, 42.2], cue: "@Chagatai" },
  { territory: "ilkhanate_1300", fill: "deepRed", label: "Ilkhanate", lonlat: [53, 32.5], cue: "@Ilkhanate" },
  { territory: "yuan_1300", fill: TERRA, label: "Yuan Dynasty", lonlat: [110, 33], cue: "@Yuan" },
];

const kb = (from, to, extra = {}) => ({ from: { scale: from[0], x: from[1], y: from[2] }, to: { scale: to[0], x: to[1], y: to[2] }, ...extra });
// 002's art stops at 66.4% of the image height (blank paper below): paint the ground on.
const MATTE_002 = { y: 0.664, color: "#9A8649", colorBottom: "#7F7140" };

export const meta = {
  id: "MongolEmpire",
  title: "The Mongol Empire in 5 Minutes",
  fps: 30,
  width: 1920,
  height: 1080,
  audio: "audio/voiceover.mp3",
  transitionFrames: 10, // runbook: 8 to 12 frames
};

export const overlay = { dust: 0.55, parchment: 0.22, grain: 0.07, vignette: 0.42 };

// One projection for every map; each scene picks a camera on it.
export const map = { extent: [[8, 6], [146, 64]], rotate: [-78, 0], parallels: [28, 56] };

export const scenes = [
  // ---------------- PART 1: HOOK ----------------
  {
    id: "S01", part: "HOOK", assets: ["MAP-01"], type: "map",
    motion: "Map of Eurasia. Mongol territory explodes outward from Mongolia to its peak extent in about 4 seconds, then holds.",
    cues: [
      { word: "Korea", action: "pulse label KOREA on the east edge" },
      { word: "Hungary", action: "pulse label HUNGARY on the west edge" },
    ],
    map: {
      id: "MAP-01",
      camera: [{ at: "^", ...EURASIA, zoom: 1.4 }, { at: "$", ...EURASIA, zoom: 1.5 }],
      states: [
        { at: "^", layers: [] },
        {
          at: "^+0.4", duration: 4, mode: "grow", origin: [104, 47.5],
          layers: ["yuan_1279", "chagatai_1279", "ilkhanate_1279", "golden_1279", "rus_vassals_1279"].map((territory) => ({ territory, fill: TERRA })),
        },
      ],
      markers: [
        { id: "korea", label: "Korea", lonlat: [127.6, 37.4], at: "@Korea", kind: "dot", pulse: true, labelSide: "bottom" },
        { id: "hungary", label: "Hungary", lonlat: [19.5, 47.3], at: "@Hungary", kind: "dot", pulse: true, labelSide: "bottom" },
      ],
    },
  },
  {
    id: "S02", part: "HOOK", assets: ["IMG 001"], type: "image", image: "images/001.jpg",
    motion: "Slow push in on the boy.",
    kenBurns: kb([1.04, 0.45, 0.5], [1.22, 0.33, 0.45]),
  },
  {
    id: "S03", part: "HOOK", assets: ["IMG 002"], type: "image", image: "images/002.jpg",
    motion: "Slow pan left to right across the steppe. Title card.",
    cues: [{ word: "Mongol", action: 'title "THE MONGOL EMPIRE" fades in, centered, serif, with a thin line underneath' }],
    kenBurns: kb([1.42, 0.36, 0.45], [1.42, 0.62, 0.45], { matte: MATTE_002 }),
    titles: [{ text: "THE MONGOL EMPIRE", at: "@Mongol", style: "title" }],
  },

  // ---------------- PART 2: TEMUJIN ----------------
  {
    id: "S04", part: "TEMUJIN", assets: ["MAP-02"], type: "map",
    motion: "Zoom into Mongolia. Tribe zones fade in one by one.",
    cues: [
      { word: "Temujin", action: "small pulsing dot at the Onon river" },
      { word: "rival", action: "tribe zones appear: Tatars, Merkits, Keraites, Naimans, Mongols" },
    ],
    date: { text: "1162 AD", at: "^+0.3" },
    map: {
      id: "MAP-02",
      meridian: 104,
      camera: [{ at: "^", center: [98, 45], zoom: 2 }, { at: "^+3.2", ...MONGOLIA }, { at: "$", ...MONGOLIA, zoom: 5.45 }],
      states: [
        { at: "^", layers: [] },
        // one by one, in the order the runbook names them
        ...["tribe_tatars", "tribe_merkits", "tribe_keraites", "tribe_naimans", "tribe_mongols"].map((id, i, arr) => ({
          at: `@rival+${(i * 0.45).toFixed(2)}`,
          duration: 0.7,
          layers: arr.slice(0, i + 1).map((tid) => tribeLayer(TRIBES.find((t) => t.territory === tid))),
        })),
      ],
      lines: [{ ...ONON, at: "^+1.2", duration: 1.6 }],
      markers: [{ id: "temujin", label: "Onon", lonlat: BIRTHPLACE, at: "@Temujin", kind: "dot", pulse: true, labelSide: "top" }],
      regionLabels: ["Tatars", "Merkits", "Keraites", "Naimans", "Mongols"].map((name, i) => {
        const tr = TRIBES.find((t) => t.label === name);
        return { text: name, lonlat: tr.lonlat, at: `@rival+${(i * 0.45 + 0.2).toFixed(2)}`, size: 34 };
      }),
      seaLabels: [{ text: "LAKE BAIKAL", lonlat: [106.5, 54.6], size: 22 }],
    },
  },
  {
    id: "S05", part: "TEMUJIN", assets: ["IMG 003"], type: "image", image: "images/003.jpg",
    motion: "Slow push in on the father at the fire.",
    kenBurns: kb([1.04, 0.55, 0.5], [1.28, 0.63, 0.4]),
  },
  {
    id: "S06", part: "TEMUJIN", assets: ["IMG 004"], type: "image", image: "images/004.jpg",
    motion: "Slow zoom out, making the family feel small and alone.",
    kenBurns: kb([1.4, 0.26, 0.6], [1.03, 0.5, 0.5]),
  },
  {
    id: "S07", part: "TEMUJIN", assets: ["IMG 005"], type: "image", image: "images/005.jpg",
    motion: "Slow push in. Subtle dark vignette.",
    kenBurns: kb([1.04, 0.55, 0.5], [1.28, 0.6, 0.56]),
    effects: { vignette: 0.7 },
  },
  {
    id: "S08", part: "TEMUJIN", assets: ["IMG 006"], type: "image", image: "images/006.jpg",
    motion: "Slow pan right.",
    kenBurns: kb([1.22, 0.4, 0.48], [1.22, 0.6, 0.48]),
  },
  {
    id: "S09", part: "TEMUJIN", assets: ["IMG 007"], type: "image", image: "images/007.jpg",
    motion: "Fast-ish push in, dust overlay.",
    kenBurns: kb([1.04, 0.47, 0.55], [1.45, 0.42, 0.62]),
    effects: { dust: 1 },
  },
  {
    id: "S10", part: "TEMUJIN", assets: ["IMG 008"], type: "image", image: "images/008.jpg",
    motion: "Slow zoom in toward the center gap between the two riders.",
    kenBurns: kb([1.05, 0.5, 0.55], [1.38, 0.5, 0.6]),
  },
  {
    id: "S11", part: "TEMUJIN", assets: ["MAP-02"], type: "map",
    motion: "Same map as S04. Tribe zones turn Mongol color one by one.",
    cues: [
      { word: "Tatars", action: "Tatar zone absorbed" },
      { word: "Keraites", action: "Keraite zone absorbed" },
      { word: "Naimans", action: "Naiman zone absorbed" },
    ],
    map: {
      id: "MAP-02",
      meridian: 104,
      camera: [{ at: "^", ...MONGOLIA, zoom: 5.45 }, { at: "$", ...MONGOLIA, center: [104, 48.3], zoom: 5.0 }],
      states: [
        { at: "^", layers: TRIBES.map((t) => tribeLayer(t)) },
        { at: "@Tatars", duration: 0.9, layers: TRIBES.map((t) => tribeLayer(t, t.territory === "tribe_tatars" ? TERRA : t.fill)) },
        {
          at: "@Keraites", duration: 0.9,
          layers: TRIBES.map((t) => tribeLayer(t, ["tribe_tatars", "tribe_keraites"].includes(t.territory) ? TERRA : t.fill)),
        },
        {
          at: "@Naimans", duration: 0.9,
          layers: TRIBES.map((t) => tribeLayer(t, ["tribe_tatars", "tribe_keraites", "tribe_naimans"].includes(t.territory) ? TERRA : t.fill)),
        },
      ],
      lines: [{ ...ONON, at: "^-5", duration: 0.1 }],
      regionLabels: TRIBES.map((t) => ({ text: t.label, lonlat: t.lonlat, at: "^-5", size: 34 })),
      seaLabels: [{ text: "LAKE BAIKAL", lonlat: [106.5, 54.6], size: 22 }],
    },
  },
  {
    id: "S12", part: "TEMUJIN", assets: ["IMG 009"], type: "image", image: "images/009.jpg",
    motion: "Slow zoom out to reveal the crowd.",
    cues: [{ word: "Genghis", action: 'label "GENGHIS KHAN" fades in' }],
    kenBurns: kb([1.6, 0.74, 0.42], [1.03, 0.5, 0.5]),
    date: { text: "1206", at: "^+0.3" },
    titles: [{ text: "GENGHIS KHAN", at: "@Genghis", style: "name" }],
  },

  // ---------------- PART 3: THE MACHINE ----------------
  {
    id: "S13", part: "THE MACHINE", assets: ["GFX-01"], type: "gfx", gfx: "decimal-army",
    motion: "Rider icons in a grid: 10, then zoom out and multiply to 100, 1,000, 10,000. Number counts along with unit names.",
    cues: [
      { word: "ten,", action: "10 (ARBAN)" },
      { word: "hundred,", action: "100 (JAGUN)" },
      { word: "thousand", action: "1,000 (MINGGHAN)" },
      { word: "ten thousand", action: "10,000 (TUMEN)" },
    ],
    steps: [
      { at: "@ten", value: 10, unit: "ARBAN" },
      { at: "@hundred", value: 100, unit: "JAGUN" },
      { at: "@thousand", value: 1000, unit: "MINGGHAN" },
      { at: "@ten thousand", value: 10000, unit: "TUMEN" },
    ],
  },
  {
    id: "S14", part: "THE MACHINE", assets: ["IMG 010"], type: "image", image: "images/010.jpg",
    motion: "Slow pan left.",
    kenBurns: kb([1.22, 0.6, 0.5], [1.22, 0.4, 0.5]),
  },
  {
    id: "S15", part: "THE MACHINE", assets: ["IMG 011"], type: "image", image: "images/011.jpg",
    motion: "Slow push in. (Optional motion-blur streak not used.)",
    kenBurns: kb([1.04, 0.5, 0.5], [1.3, 0.56, 0.42]),
  },
  {
    id: "S16", part: "THE MACHINE", assets: ["BG 002", "CUT 012"], type: "parallax",
    motion: "Background 002 pans slowly left, cutout horse archer 012 gallops from left to right across the frame with a small vertical bounce.",
    background: { src: "images/002.jpg", ...kb([1.6, 0.6, 0.5], [1.6, 0.4, 0.5], { matte: MATTE_002 }) },
    sprites: [{ src: "images/012.png", start: "^+0.2", end: "$+0.2", height: 520, bottom: 120, from: -30, to: 104, bob: 16, strideHz: 2.4 }],
  },

  // ---------------- PART 4: CONQUEST ----------------
  {
    id: "S17", part: "CONQUEST", assets: ["MAP-03"], type: "map",
    motion: "China campaigns: arrow into Western Xia (turns tributary), then arrows into Jin.",
    cues: [
      { word: "Western", action: "arrow into Western Xia, zone turns tributary color" },
      { word: "Jin", action: "arrows into Jin territory" },
    ],
    year: [{ at: "^+0.2", value: 1206 }, { at: "@Western", value: 1206 }, { at: "@1209.", value: 1209 }, { at: "@Jin", value: 1211 }],
    map: {
      id: "MAP-03",
      meridian: 108,
      camera: [{ at: "^", center: [108, 37.6], zoom: 3.25 }, { at: "$", center: [109.5, 37.2], zoom: 3.45 }],
      states: [
        {
          at: "^",
          layers: [
            { territory: "song_1210", fill: "#8E8D62", opacity: 0.6 },
            { territory: "mongol_1206", fill: TERRA, opacity: 0.9 },
            { territory: "xixia_1200", fill: OLIVE },
            { territory: "jin_1210", fill: OLIVE },
          ],
        },
        {
          at: "@Western+0.9", duration: 1,
          layers: [
            { territory: "song_1210", fill: "#8E8D62", opacity: 0.6 },
            { territory: "mongol_1206", fill: TERRA, opacity: 0.9 },
            { territory: "xixia_1200", fill: "tributary" },
            { territory: "jin_1210", fill: OLIVE },
          ],
        },
      ],
      lines: [
        { id: "xia", style: "arrow", path: [[104, 45.6], [102.4, 42.6], [104.6, 39.4]], at: "@Western", duration: 1.1 },
        { id: "jin1", style: "arrow", path: [[111, 44.8], [113.2, 42], [114.8, 39.6]], at: "@Jin", duration: 1.1 },
        { id: "jin2", style: "arrow", path: [[116.5, 46.6], [119.2, 44], [120.2, 41.6]], at: "@Jin+0.3", duration: 1.1 },
      ],
      regionLabels: [
        { text: "Mongols", lonlat: [104, 47], at: "^+0.3", size: 36 },
        { text: "Western Xia", lonlat: [101.5, 39.6], at: "^+0.5", size: 30 },
        { text: "Jin", lonlat: [116.5, 37], at: "^+0.7", size: 40 },
        { text: "Song", lonlat: [112, 28.5], at: "^+0.9", size: 36 },
      ],
    },
  },
  {
    id: "S18", part: "CONQUEST", assets: ["IMG 013"], type: "image", image: "images/013.jpg",
    motion: "Slow push in toward the siege engine.",
    kenBurns: kb([1.04, 0.5, 0.5], [1.34, 0.5, 0.64]),
  },
  {
    id: "S19", part: "CONQUEST", assets: ["IMG 014"], type: "image", image: "images/014.jpg",
    motion: "Slow zoom out, flickering orange glow overlay.",
    kenBurns: kb([1.38, 0.5, 0.45], [1.06, 0.5, 0.5]),
    effects: { fire: 1 },
    date: { text: "1215", at: "^+0.3" },
  },
  {
    id: "S20", part: "CONQUEST", assets: ["MAP-04"], type: "map",
    motion: "Khwarazm part 1: Khwarazmian territory highlights, caravan route to Otrar, red flash on Otrar.",
    cues: [
      { word: "Khwarazmian", action: "Khwarazmian territory highlights" },
      { word: "caravan", action: "dotted line from Mongolia to Otrar with a moving caravan dot" },
      { word: "Otrar", action: "red flash on Otrar" },
    ],
    year: [{ at: "^+0.2", value: 1218 }],
    map: {
      id: "MAP-04",
      meridian: 72,
      camera: [{ at: "^", center: [83, 43], zoom: 3.3 }, { at: "@Otrar-0.8", center: [83, 43], zoom: 3.4 }, { at: "@Otrar+0.8", center: [68.5, 41.2], zoom: 4.6 }, { at: "$", center: [68, 41], zoom: 4.75 }],
      states: [
        { at: "^", layers: [{ territory: "mongol_1218", fill: TERRA, opacity: 0.9 }, { territory: "khwarazm_1218", fill: "parchmentDark" }] },
        { at: "@Khwarazmian", duration: 0.9, layers: [{ territory: "mongol_1218", fill: TERRA, opacity: 0.9 }, { territory: "khwarazm_1218", fill: OLIVE, outline: 1 }] },
      ],
      lines: [{ id: "caravan", style: "route", path: [[101, 46.5], [93, 45], [84, 44.6], [76, 43.8], [68.5, 42.95]], at: "@caravan", until: "@Otrar", smooth: true, dots: { at: "@caravan", count: 1, period: "@Otrar-@caravan", loop: false } }],
      markers: Object.entries(CITIES_KHWARAZM).map(([id, c], i) => ({ id, ...c, at: `^+${(0.5 + i * 0.15).toFixed(2)}`, flashAt: id === "otrar" ? "@Otrar" : undefined })),
      regionLabels: [
        { text: "Khwarazmian Empire", lonlat: [60, 34.5], at: "@Khwarazmian+0.2", size: 38 },
        { text: "Mongols", lonlat: [96, 47], at: "^+0.3", size: 36 },
      ],
      seaLabels: [{ text: "CASPIAN SEA", lonlat: [51, 42], size: 22 }],
    },
  },
  {
    id: "S21", part: "CONQUEST", assets: ["IMG 015"], type: "image", image: "images/015.jpg",
    motion: "Slow push in on the Shah.",
    kenBurns: kb([1.04, 0.55, 0.5], [1.34, 0.78, 0.45]),
  },
  {
    id: "S22", part: "CONQUEST", assets: ["MAP-04"], type: "map",
    motion: "Khwarazm part 2: three arrows sweep into Khwarazm; each named city gets a cross mark.",
    cues: [
      { word: "invaded", action: "three arrows sweep into Khwarazm" },
      { word: "Otrar", action: "Otrar gets a cross mark" },
      { word: "Bukhara", action: "Bukhara gets a cross mark" },
      { word: "Samarkand", action: "Samarkand gets a cross mark" },
      { word: "Merv", action: "Merv gets a cross mark" },
    ],
    year: [{ at: "^+0.2", value: 1219 }, { at: "@Otrar", value: 1219 }, { at: "@Merv", value: 1221 }],
    map: {
      id: "MAP-04",
      meridian: 72,
      camera: [{ at: "^", ...KHWARAZM_CAM }, { at: "$", ...KHWARAZM_CAM, zoom: 5.2 }],
      states: [{ at: "^", layers: [{ territory: "mongol_1218", fill: TERRA, opacity: 0.9 }, { territory: "khwarazm_1218", fill: OLIVE, outline: 1 }] }],
      lines: [
        { id: "inv1", style: "arrow", path: [[79, 46.6], [73.5, 45], [69.2, 43.4]], at: "@invaded", duration: 1 },
        { id: "inv2", style: "arrow", path: [[82, 43.2], [74, 41.4], [67.8, 40]], at: "@invaded+0.25", duration: 1.1 },
        { id: "inv3", style: "arrow", path: [[74.5, 48], [66, 45.6], [60.2, 43]], at: "@invaded+0.5", duration: 1.2 },
      ],
      markers: Object.entries(CITIES_KHWARAZM).map(([id, c]) => ({
        id, ...c, at: "^-5",
        crossAt: { otrar: "@Otrar", bukhara: "@Bukhara", samarkand: "@Samarkand", merv: "@Merv" }[id],
      })),
      regionLabels: [{ text: "Khwarazmian Empire", lonlat: [59.5, 34.5], at: "^-5", size: 38 }],
      seaLabels: [{ text: "CASPIAN SEA", lonlat: [51, 42], size: 22 }],
    },
  },
  {
    id: "S23", part: "CONQUEST", assets: ["IMG 016"], type: "image", image: "images/016.jpg",
    motion: "Slow zoom out, smoke overlay.",
    kenBurns: kb([1.36, 0.4, 0.5], [1.04, 0.5, 0.5]),
    effects: { smoke: 0.8 },
  },
  {
    id: "S24", part: "CONQUEST", assets: ["MAP-05"], type: "map",
    motion: "Great Raid: dashed route from south of the Caspian through Persia, the Caucasus and the steppe north of the Black Sea, looping around the Caspian.",
    cues: [
      { word: "Jebe", action: "animated dashed route starts south of the Caspian and loops around it" },
      { word: "Georgian", action: "battle icon in Georgia" },
      { word: "Rus", action: "battle icon at the Kalka river" },
    ],
    year: [{ at: "^+0.2", value: 1220 }, { at: "@Jebe", value: 1220 }, { at: "@Rus", value: 1223 }],
    map: {
      id: "MAP-05",
      meridian: 46,
      camera: [{ at: "^", center: [46.5, 42], zoom: 4.5 }, { at: "$", center: [46.5, 42.4], zoom: 4.7 }],
      states: [{ at: "^", layers: [{ territory: "georgia_1200", fill: OLIVE }] }],
      lines: [
        // one continuous route, drawn in three legs so it reaches Georgia and the Kalka on their cues
        { id: "raid1", style: "route", path: [[53.5, 36.2], [51.4, 35.7], [48.5, 34.9], [46.3, 38.1], [44.9, 41.6]], at: "@Jebe", until: "@Georgian" },
        { id: "raid2", style: "route", path: [[44.9, 41.6], [47.2, 41.9], [48.3, 42.2], [46.6, 44.6], [42.5, 46.2], [37.7, 47.4]], at: "@Georgian", until: "@Rus" },
        { id: "raid3", style: "route", path: [[37.7, 47.4], [41.5, 48.9], [45.5, 50.6], [49.8, 51.2], [53.2, 49.6], [56, 47.6]], at: "@Rus", until: "$-0.2" },
        { id: "kalka", style: "river", path: [[38.3, 48.3], [37.9, 47.8], [37.6, 47.2]], at: "^+0.4", duration: 0.8 },
      ],
      markers: [
        { id: "georgia", label: "Georgia", lonlat: [44.9, 41.6], at: "@Georgian", kind: "dot", battleAt: "@Georgian", labelSide: "left" },
        { id: "kalka", label: "Kalka River", lonlat: [37.7, 47.4], at: "@Rus", kind: "dot", battleAt: "@Rus", labelSide: "bottom" },
      ],
      regionLabels: [{ text: "Persia", lonlat: [52.5, 35.2], at: "^+0.4", size: 30, tone: "dark" }],
      seaLabels: [{ text: "CASPIAN SEA", lonlat: [50.8, 42.3], size: 26 }, { text: "BLACK SEA", lonlat: [34.5, 43.3], size: 26 }],
    },
  },
  {
    id: "S25", part: "CONQUEST", assets: ["IMG 017"], type: "image", image: "images/017.jpg",
    motion: "Very slow push in, slight desaturation.",
    kenBurns: kb([1.04, 0.5, 0.58], [1.16, 0.5, 0.64], { desaturate: [0.95, 0.6] }),
    date: { text: "1227", at: "^+0.3" },
  },

  // ---------------- PART 5: THE SONS AND GRANDSONS ----------------
  {
    id: "S26", part: "SONS AND GRANDSONS", assets: ["IMG 018"], type: "image", image: "images/018.jpg",
    motion: "Slow pan right across the city.",
    kenBurns: kb([1.24, 0.4, 0.5], [1.24, 0.62, 0.5]),
    date: { text: "1234", at: "^+0.3" },
  },
  {
    id: "S27", part: "SONS AND GRANDSONS", assets: ["MAP-06"], type: "map",
    motion: "Europe campaign: arrows through Ryazan and Vladimir, Kyiv flashes, arrows to Legnica and Mohi with battle icons.",
    cues: [
      { word: "Russian", action: "arrows through Ryazan and Vladimir" },
      { word: "Kyiv", action: "Kyiv flashes, cross mark" },
      { word: "Poland", action: "arrow to Legnica, battle icon" },
      { word: "Hungary", action: "arrow to Mohi, battle icon" },
    ],
    year: [{ at: "^+0.2", value: 1237 }, { at: "@Russian", value: 1237 }, { at: "@Kyiv", value: 1240 }, { at: "@Hungary", value: 1241 }],
    map: {
      id: "MAP-06",
      meridian: 31,
      camera: [{ at: "^", center: [33, 51.8], zoom: 4.9 }, { at: "$", center: [30, 51.3], zoom: 5.1 }],
      states: [
        {
          at: "^",
          layers: [
            { territory: "golden_1279", fill: TERRA, opacity: 0.9 },
            { territory: "rus_1200", fill: OLIVE },
            { territory: "poland_1200", fill: OLIVE },
            { territory: "hungary_1200", fill: OLIVE },
          ],
        },
        {
          at: "@Kyiv+0.6", duration: 1.4,
          layers: [
            { territory: "golden_1279", fill: TERRA, opacity: 0.9 },
            { territory: "rus_1200", fill: TERRA, opacity: 0.9 },
            { territory: "poland_1200", fill: OLIVE },
            { territory: "hungary_1200", fill: OLIVE },
          ],
        },
      ],
      lines: [
        { id: "ryazan", style: "arrow", path: [[49.5, 52.6], [44.5, 53.6], [40.4, 54.6], [40.3, 55.9]], at: "@Russian", duration: 1.3 },
        { id: "kyiv", style: "arrow", path: [[40, 49.5], [35, 50.4], [31.2, 50.5]], at: "@Russian+0.5", until: "@Kyiv" },
        { id: "legnica", style: "arrow", path: [[29.6, 50.6], [23.5, 51.6], [16.8, 51.3]], at: "@Poland-0.4", until: "@Poland+0.5" },
        { id: "mohi", style: "arrow", path: [[29.5, 49.6], [25, 49.4], [21.4, 48.3]], at: "@Hungary-0.4", until: "@Hungary+0.5" },
      ],
      markers: [
        { id: "ryazan", label: "Ryazan", lonlat: [40.1, 54.4], at: "^+0.4", labelSide: "right" },
        { id: "vladimir", label: "Vladimir", lonlat: [40.4, 56.13], at: "^+0.55", labelSide: "right" },
        { id: "kyiv", label: "Kyiv", lonlat: [30.52, 50.45], at: "^+0.7", flashAt: "@Kyiv", crossAt: "@Kyiv+0.2", labelSide: "bottom" },
        { id: "legnica", label: "Legnica", lonlat: [16.16, 51.21], at: "^+0.85", battleAt: "@Poland+0.5", labelSide: "bottom" },
        { id: "mohi", label: "Mohi", lonlat: [20.95, 47.95], at: "^+1.0", battleAt: "@Hungary+0.5", labelSide: "right" },
      ],
      regionLabels: [
        { text: "Poland", lonlat: [20, 53.4], at: "^+0.5", size: 30 },
        { text: "Hungary", lonlat: [18.8, 46.4], at: "^+0.6", size: 30 },
        { text: "Rus", lonlat: [36, 55.2], at: "^+0.7", size: 34 },
      ],
    },
  },
  {
    id: "S28", part: "SONS AND GRANDSONS", assets: ["IMG 019"], type: "image", image: "images/019.jpg",
    motion: "Slow push in, dust overlay.",
    kenBurns: kb([1.04, 0.5, 0.5], [1.3, 0.46, 0.5]),
    effects: { dust: 1 },
  },
  {
    id: "S29", part: "SONS AND GRANDSONS", assets: ["IMG 020"], type: "image", image: "images/020.jpg",
    motion: "Slow zoom out.",
    kenBurns: kb([1.36, 0.45, 0.45], [1.04, 0.5, 0.5]),
  },
  {
    id: "S30", part: "SONS AND GRANDSONS", assets: ["MAP-07"], type: "map",
    motion: "Middle East: arrow from Persia toward Baghdad, Baghdad flashes red.",
    cues: [
      { word: "Hulegu", action: "arrow from Persia toward Baghdad" },
      { word: "Baghdad", action: "Baghdad flashes red" },
    ],
    year: [{ at: "^+0.2", value: 1258 }],
    map: {
      id: "MAP-07",
      meridian: 42,
      camera: [{ at: "^", center: [41.5, 32.6], zoom: 6.0 }, { at: "$", center: [42, 32.8], zoom: 6.25 }],
      states: [
        {
          at: "^",
          layers: [
            { territory: "ilkhanate_1279", fill: TERRA, opacity: 0.9 },
            { territory: "abbasid_1258", fill: "#9C8A55" },
            { territory: "mamluk_1279", fill: OLIVE },
          ],
        },
        {
          at: "@Baghdad+1", duration: 1.4,
          layers: [
            { territory: "ilkhanate_1279", fill: TERRA, opacity: 0.9 },
            { territory: "abbasid_1258", fill: TERRA, opacity: 0.9 },
            { territory: "mamluk_1279", fill: OLIVE },
          ],
        },
      ],
      lines: [{ id: "hulegu", style: "arrow", path: [[51.5, 35.4], [48.4, 34.8], [45.2, 33.6]], at: "@Hulegu", until: "@Baghdad" }],
      markers: [
        { id: "baghdad", label: "Baghdad", lonlat: [44.36, 33.31], at: "^+0.4", flashAt: "@Baghdad", labelSide: "bottom" },
        { id: "ainjalut", label: "Ain Jalut", lonlat: [35.35, 32.55], at: "^+0.6", labelSide: "left" },
      ],
      regionLabels: [
        { text: "Mongols", lonlat: [52.5, 33], at: "^+0.3", size: 34 },
        { text: "Mamluks", lonlat: [30.5, 27.8], at: "^+0.5", size: 34 },
      ],
      seaLabels: [{ text: "MEDITERRANEAN SEA", lonlat: [29.5, 34], size: 22 }, { text: "PERSIAN GULF", lonlat: [51, 27.3], size: 20 }],
    },
  },
  {
    id: "S31", part: "SONS AND GRANDSONS", assets: ["IMG 021"], type: "image", image: "images/021.jpg",
    motion: "Slow push in toward the river, smoke overlay.",
    kenBurns: kb([1.04, 0.5, 0.5], [1.3, 0.4, 0.64]),
    effects: { smoke: 0.6 },
  },
  {
    id: "S32", part: "SONS AND GRANDSONS", assets: ["IMG 022"], type: "image", image: "images/022.jpg",
    motion: "Slow push in.",
    kenBurns: kb([1.04, 0.5, 0.5], [1.26, 0.42, 0.5]),
    date: { text: "1260", at: "^+0.3" },
  },

  // ---------------- PART 6: SPLIT AND PEAK ----------------
  {
    id: "S33", part: "SPLIT AND PEAK", assets: ["MAP-08"], type: "map",
    motion: "Four khanates: the empire splits into four colored zones with dividing lines, each labelled on cue.",
    cues: [
      { word: "four", action: "empire splits into four colored zones with dividing lines" },
      { word: "Golden", action: "label GOLDEN HORDE" },
      { word: "Chagatai", action: "label CHAGATAI KHANATE" },
      { word: "Ilkhanate", action: "label ILKHANATE" },
      { word: "Yuan", action: "label YUAN DYNASTY" },
    ],
    map: {
      id: "MAP-08",
      camera: [{ at: "^", ...EURASIA }, { at: "$", ...EURASIA, zoom: 1.52 }],
      states: [
        { at: "^", layers: KHANATES.map((k) => ({ territory: k.territory, fill: TERRA, opacity: 0.9 })) },
        { at: "@four", duration: 1.1, layers: KHANATES.map((k) => ({ territory: k.territory, fill: k.fill, opacity: 0.92, outline: 1 })) },
      ],
      regionLabels: KHANATES.map((k) => ({ text: k.label, lonlat: k.lonlat, at: k.cue, size: 34 })),
    },
  },
  {
    id: "S34", part: "SPLIT AND PEAK", assets: ["IMG 023"], type: "image", image: "images/023.jpg",
    motion: "Slow push in on Kublai.",
    cues: [{ word: "Kublai", action: 'label "KUBLAI KHAN"' }],
    kenBurns: kb([1.04, 0.5, 0.5], [1.3, 0.5, 0.38]),
    date: { text: "1279", at: "^+0.3" },
    titles: [{ text: "KUBLAI KHAN", at: "@Kublai", style: "name" }],
  },
  {
    id: "S35", part: "SPLIT AND PEAK", assets: ["IMG 024"], type: "image", image: "images/024.jpg",
    motion: "Slow zoom out, rain and lightning flash overlay.",
    kenBurns: kb([1.36, 0.58, 0.42], [1.04, 0.5, 0.5]),
    effects: { rain: 1, lightning: ["^+0.6", "@failed.", "@typhoon"] },
  },
  {
    id: "S36", part: "SPLIT AND PEAK", assets: ["MAP-09"], type: "map",
    motion: "Silk Road: glowing ochre trade routes draw in, caravan dots move along them, dashed Marco Polo route Venice to Beijing (Khanbaliq).",
    cues: [
      { word: "Silk", action: "trade routes draw in as glowing ochre lines" },
      { word: "Merchants", action: "small caravan dots move along the routes" },
      { word: "Marco", action: "dashed route from Venice to Beijing (Khanbaliq)" },
    ],
    map: {
      id: "MAP-09",
      camera: [{ at: "^", center: [66, 42], zoom: 1.3 }, { at: "$", center: [66, 42], zoom: 1.36 }],
      states: [{ at: "^", layers: KHANATES.map((k) => ({ territory: k.territory, fill: TERRA, opacity: 0.45 })) }],
      lines: [
        {
          id: "silk-south", style: "trade", at: "@Silk", duration: 2.2,
          path: [[28.98, 41.01], [39.7, 41], [46.3, 38.1], [54, 36.6], [61.8, 37.6], [64.4, 39.8], [67, 39.65], [76, 39.5], [87, 41.8], [94.7, 40.1], [103.8, 36.1], [108.9, 34.3]],
          dots: { at: "@Merchants", count: 4, period: 14 },
        },
        {
          id: "silk-steppe", style: "trade", at: "@Silk+0.35", duration: 2.2,
          path: [[35.4, 45], [47.9, 46.8], [53.5, 45], [59.15, 42.3], [68.3, 42.85], [80.9, 43.9], [92, 45.5], [102.8, 47.2], [111, 43.5], [116.4, 39.9]],
          dots: { at: "@Merchants+0.3", count: 4, period: 15 },
        },
        {
          id: "silk-gulf", style: "trade", at: "@Silk+0.7", duration: 1.6,
          path: [[44.36, 33.31], [48.5, 34.8], [54, 36.6]],
          dots: { at: "@Merchants+0.6", count: 2, period: 7 },
        },
        {
          id: "marco", style: "route", at: "@Marco", until: "$-0.2",
          path: [[12.33, 45.44], [19, 37.5], [29, 34], [35.1, 32.9], [35.8, 36.8], [40.5, 38.5], [46.3, 38.1], [52.5, 32], [56.45, 27.1], [57.1, 30.3], [62, 34.5], [66.9, 36.76], [72, 37.5], [76, 39.5], [79.9, 37.1], [88, 39], [94.7, 40.1], [104, 39.5], [110, 41.2], [116.2, 42.36], [116.4, 39.9]],
        },
      ],
      markers: [
        { id: "venice", label: "Venice", lonlat: [12.33, 45.44], at: "@Marco", kind: "city", labelSide: "top" },
        { id: "khanbaliq", label: "Khanbaliq (Beijing)", lonlat: [116.4, 39.9], at: "@Marco+0.2", kind: "city", labelSide: "bottom" },
      ],
      regionLabels: [{ text: "Silk Road", lonlat: [70, 46.5], at: "@Silk+0.8", size: 40, tone: "dark" }],
    },
  },
  {
    id: "S37", part: "SPLIT AND PEAK", assets: ["IMG 025"], type: "image", image: "images/025.jpg",
    motion: "Slow push in, slight desaturation over the scene.",
    kenBurns: kb([1.04, 0.5, 0.5], [1.3, 0.45, 0.6], { desaturate: [0.95, 0.55] }),
  },

  // ---------------- PART 7: DECLINE AND LEGACY ----------------
  {
    id: "S38", part: "DECLINE AND LEGACY", assets: ["MAP-10"], type: "map",
    motion: "Decline: starts from the MAP-08 state; Ilkhanate fades, Yuan fades and MING appears, Golden Horde shrinks and fades.",
    cues: [
      { word: "Ilkhanate", action: "Ilkhanate zone fades out" },
      { word: "Yuan", action: 'Yuan zone fades, "MING" label appears' },
      { word: "Golden", action: "Golden Horde zone shrinks and fades" },
    ],
    year: [{ at: "@Ilkhanate", value: 1335 }, { at: "@Yuan", value: 1368 }, { at: "@Golden", value: 1480 }],
    map: {
      id: "MAP-10",
      camera: [{ at: "^", ...EURASIA, zoom: 1.52 }, { at: "$", ...EURASIA, zoom: 1.45 }],
      states: (() => {
        const full = KHANATES.map((k) => ({ territory: k.territory, fill: k.fill, opacity: 0.92, outline: 1 }));
        const without = (...ids) => full.filter((l) => !ids.includes(l.territory));
        const ming = { territory: "ming_1492", fill: OLIVE, opacity: 0.85 };
        return [
          { at: "^", layers: full },
          { at: "@Ilkhanate", duration: 1.2, layers: without("ilkhanate_1300") },
          { at: "@Yuan", duration: 1.4, layers: [...without("ilkhanate_1300", "yuan_1300"), ming] },
          // shrink: the Golden Horde gives way to its much smaller late-15th-century remnant, then fades
          { at: "@Golden", duration: 1.2, layers: [...without("ilkhanate_1300", "yuan_1300", "golden_1300"), { territory: "golden_1492", fill: "gold", opacity: 0.92, outline: 1 }, ming] },
          { at: "@Golden+1.8", duration: 1.4, layers: [...without("ilkhanate_1300", "yuan_1300", "golden_1300"), ming] },
        ];
      })(),
      regionLabels: [
        ...KHANATES.map((k) => ({
          text: k.label, lonlat: k.lonlat, at: "^-5", size: 34,
          hideAt: { golden_1300: "@Golden+1.8", ilkhanate_1300: "@Ilkhanate", yuan_1300: "@Yuan" }[k.territory],
        })),
        { text: "Ming", lonlat: [111, 31], at: "@Yuan+0.4", size: 44 },
      ],
    },
  },
  {
    id: "S39", part: "DECLINE AND LEGACY", assets: ["IMG 026"], type: "image", image: "images/026.jpg",
    motion: "Slow zoom out on the lone rider.",
    kenBurns: kb([1.38, 0.6, 0.56], [1.04, 0.5, 0.5]),
  },
  {
    id: "S40", part: "DECLINE AND LEGACY", assets: ["IMG 001"], type: "image", image: "images/001.jpg",
    motion: "Slow push in, then fade to black over the final 1.5 seconds after the VO ends (bookend reuse of 001).",
    kenBurns: kb([1.04, 0.5, 0.5], [1.28, 0.33, 0.42]),
  },
];
