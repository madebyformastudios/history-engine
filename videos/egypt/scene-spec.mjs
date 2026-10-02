// Scene-by-scene spec for this video, transcribed from DRAAIBOEK.md (the runbook is the source of truth).
// `npm run build <slug>` resolves it against data/timings.json into data/scenes.json.
//
// Time references (any string value):
//   "@word"      the moment the narrator says `word` in THIS scene, e.g. "@Korea"
//   "@word+0.4"  offset in seconds from that moment
//   "^+0.5"      scene start + 0.5 s        "$-1"  scene end - 1 s
//
// Every option is documented in CATALOG.md. Full working example: videos/mongol-empire/scene-spec.mjs

// ---------- shared pieces ----------
const TERRA = "terracotta"; // Egypt
const OLIVE = "olive"; // rivals and invaders
const RED = "deepRed"; // rivals and invaders (second)
const MUTED = "#B8A27A"; // other states
const GREEN = "#5E8A3A"; // the inhabited Nile strip (MAP-01)

const kb = (from, to, extra = {}) => ({ from: { scale: from[0], x: from[1], y: from[2] }, to: { scale: to[0], x: to[1], y: to[2] }, ...extra });
const name = (text, at, hideAt) => ({ text, at, style: "name", ...(hideAt && { hideAt }) });
const city = (id, label, lonlat, at, extra = {}) => ({ id, label, lonlat, at, kind: "city", ...extra });
const PRE = "^-5"; // already on screen when the scene starts

// The Nile, south to north (same course as the Nile polygons in scripts/fetch-maps.mjs).
const NILE_SUDAN = [[32.53, 15.6], [32.7, 16.3], [33.43, 16.69], [33.75, 16.94], [33.98, 17.7], [33.98, 18.02], [33.6, 19.0], [33.32, 19.53], [32.8, 19.3], [32.3, 18.95]];
const NILE_NUBIA = [[32.3, 18.95], [31.83, 18.53], [31.3, 18.2], [30.95, 18.05], [30.55, 18.6], [30.48, 19.17], [30.42, 19.63], [30.33, 19.8], [30.4, 20.7], [30.95, 21.5], [31.35, 21.85], [31.62, 22.34], [32.4, 23.1], [32.85, 23.6], [32.89, 24.08]];
const NILE_EGYPT = [[32.89, 24.08], [32.93, 24.45], [32.87, 24.98], [32.55, 25.3], [32.64, 25.7], [32.72, 26.0], [32.73, 26.16], [32.45, 26.15], [32.25, 26.05], [31.95, 26.3], [31.7, 26.55], [31.45, 26.9], [31.18, 27.18], [30.85, 27.44], [30.88, 27.7], [30.75, 28.1], [30.8, 28.5], [31.0, 28.85], [31.1, 29.07], [31.22, 29.45], [31.25, 29.85], [31.23, 30.06], [31.18, 30.2]];
const ROSETTA = [[31.18, 30.2], [30.95, 30.45], [30.75, 30.75], [30.55, 31.05], [30.42, 31.3], [30.36, 31.45]];
const DAMIETTA = [[31.18, 30.2], [31.15, 30.5], [31.25, 30.8], [31.45, 31.05], [31.65, 31.25], [31.82, 31.45]];
const BLUE_NILE = [[37.39, 11.6], [37.9, 11.0], [38.2, 10.3], [37.7, 9.95], [36.8, 10.05], [36.0, 10.45], [35.09, 11.21], [34.38, 11.8], [33.63, 13.55], [33.52, 14.4], [32.53, 15.6]];
const WHITE_NILE = [[33.2, 0.45], [32.3, 1.7], [31.4, 2.4], [31.6, 3.7], [31.6, 4.85], [31.5, 6.2], [30.5, 9.5], [31.65, 9.53], [32.3, 11.2], [32.66, 13.17], [32.47, 14.6], [32.53, 15.6]];
// Lines that draw the river: valley + both delta branches. `start` = seconds after scene start to
// begin drawing, or null for "already drawn when the scene starts".
const nile = (start = null, valley = NILE_EGYPT) => {
  const at = (d) => (start === null ? PRE : `^+${(start + d).toFixed(2)}`);
  const dur = (d) => (start === null ? 0.1 : d);
  return [
    { id: "nile", style: "river", path: valley, at: at(0), duration: dur(1.6) },
    { id: "rosetta", style: "river", path: ROSETTA, at: at(1.6), duration: dur(0.6) },
    { id: "damietta", style: "river", path: DAMIETTA, at: at(1.6), duration: dur(0.6) },
  ];
};
const SUEZ_CANAL = [[32.31, 31.26], [32.32, 30.85], [32.29, 30.6], [32.35, 30.4], [32.4, 30.3], [32.53, 30.1], [32.55, 29.95]];

const C = {
  memphis: [31.25, 29.85], saqqara: [31.216, 29.871], giza: [31.134, 29.979], thebes: [32.64, 25.7], avaris: [31.82, 30.79],
  kadesh: [36.52, 34.56], napata: [31.83, 18.53], alexandria: [29.92, 31.2], babylon: [31.23, 30.006], fustat: [31.237, 30.03],
  cairo: [31.24, 30.05], ainJalut: [35.35, 32.55], acre: [35.08, 32.93], suez: [32.55, 29.97], portSaid: [32.3, 31.26],
  ismailia: [32.27, 30.6], rome: [12.48, 41.89], constantinople: [28.98, 41.01], london: [-0.12, 51.5], bombay: [72.83, 18.96],
};

export const meta = {
  id: "Egypt",
  title: "The Entire History of Egypt in 14 Minutes",
  fps: 30,
  width: 1920,
  height: 1080,
  audio: "audio/voiceover.mp3",
  transitionFrames: 10, // runbook: 8 to 12 frames
};

export const overlay = { dust: 0.55, parchment: 0.22, grain: 0.07, vignette: 0.42 };

// One projection centred on Egypt and the eastern Mediterranean; each map picks a camera on it.
// MAP-12 and MAP-18 use wide cameras (zoom < 1.4) on the same projection.
export const map = { extent: [[0, 5], [70, 48]], rotate: [-33, 0], parallels: [20, 40] };

export const scenes = [
  // ---------------- PART 1: THE FIRST KINGDOMS ----------------
  {
    id: "S01", part: "THE FIRST KINGDOMS", assets: ["IMG 001"], type: "image", image: "images/001.jpg",
    motion: "Slow push in from Cleopatra toward the pyramids behind her.",
    // The engine has no icon overlay yet: the moon icon is not drawn (see notes in the build report).
    cues: [{ word: "Moon", action: "small crescent moon icon fades in at the top right, then out (not drawn: no icon overlay in the engine yet)" }],
    kenBurns: kb([1.05, 0.3, 0.5], [1.32, 0.45, 0.42]),
  },
  {
    id: "S02", part: "THE FIRST KINGDOMS", assets: ["MAP-01"], type: "map",
    motion: "Map of Egypt. The desert stays pale, only the Nile valley and delta glow green.",
    cues: [
      { word: "four", action: "the green strip pulses" },
      { word: "106", action: 'counter label "106,000,000" appears top left' },
    ],
    date: { text: "106,000,000", at: "@106" },
    map: {
      id: "MAP-01",
      meridian: 31,
      camera: [{ at: "^", center: [30.6, 26.6], zoom: 3.0 }, { at: "$", center: [30.8, 26.8], zoom: 3.25 }],
      states: [
        { at: "^", layers: [{ territory: "egypt_modern", fill: "#D8C59B", opacity: 0.7 }] },
        { at: "^+0.6", duration: 1.6, layers: [{ territory: "egypt_modern", fill: "#D8C59B", opacity: 0.7 }, { territory: "nile_valley", fill: GREEN }] },
        // two pulses on "four percent"
        ...[0, 0.9].flatMap((d) => [
          { at: `@four+${d}`, duration: 0.4, layers: [{ territory: "egypt_modern", fill: "#D8C59B", opacity: 0.7 }, { territory: "nile_valley", fill: "#8DC04F", outline: 1 }] },
          { at: `@four+${d + 0.45}`, duration: 0.4, layers: [{ territory: "egypt_modern", fill: "#D8C59B", opacity: 0.7 }, { territory: "nile_valley", fill: GREEN }] },
        ]),
      ],
      lines: nile(0.3, [[31.35, 21.85], [31.62, 22.34], [32.4, 23.1], [32.85, 23.6], ...NILE_EGYPT]),
      markers: [city("cairo", "Cairo", C.cairo, "^+1.2", { labelSide: "right" })],
      regionLabels: [{ text: "Egypt", lonlat: [28.2, 26.3], at: "^+0.4", size: 44, tone: "dark" }],
      seaLabels: [{ text: "MEDITERRANEAN SEA", lonlat: [28.6, 32.7], size: 24 }, { text: "RED SEA", lonlat: [36.0, 23.6], size: 24 }],
    },
  },
  {
    id: "S03", part: "THE FIRST KINGDOMS", assets: ["IMG 002"], type: "image", image: "images/002.jpg",
    motion: "Slow pan right along the flooded fields.",
    kenBurns: kb([1.25, 0.38, 0.55], [1.25, 0.62, 0.55]),
    effects: { dust: 1 },
    date: { text: "5500 BC", at: "^+0.3" },
  },
  {
    id: "S04", part: "THE FIRST KINGDOMS", assets: ["MAP-02"], type: "map",
    motion: "Zoom to the Nile. Two zones fade in.",
    cues: [
      { word: "Upper", action: "Upper Egypt zone (south) fades in, label UPPER EGYPT" },
      { word: "Lower", action: "Lower Egypt zone (delta) fades in, label LOWER EGYPT" },
    ],
    map: {
      id: "MAP-02",
      meridian: 31,
      camera: [{ at: "^", center: [31, 27.2], zoom: 3.0 }, { at: "^+3", center: [31.3, 27.6], zoom: 3.7 }, { at: "$", center: [31.3, 27.6], zoom: 3.85 }],
      states: [
        { at: "^", layers: [] },
        { at: "@Upper", duration: 1, layers: [{ territory: "upper_egypt_3200bc", fill: "ochre" }] },
        { at: "@Lower", duration: 1, layers: [{ territory: "upper_egypt_3200bc", fill: "ochre" }, { territory: "lower_egypt_3200bc", fill: TERRA }] },
      ],
      lines: nile(0.3),
      regionLabels: [
        { text: "Upper Egypt", lonlat: [34.0, 26.4], at: "@Upper+0.3", size: 36, tone: "dark" },
        { text: "Lower Egypt", lonlat: [29.0, 30.6], at: "@Lower+0.3", size: 36, tone: "dark" },
      ],
      seaLabels: [{ text: "MEDITERRANEAN SEA", lonlat: [30.6, 32.4], size: 24 }],
    },
  },
  {
    id: "S05", part: "THE FIRST KINGDOMS", assets: ["IMG 003"], type: "image", image: "images/003.jpg",
    motion: "Slow push in on Narmer.",
    cues: [{ word: "Narmer", action: 'name card "NARMER"' }],
    kenBurns: kb([1.04, 0.5, 0.5], [1.3, 0.47, 0.38]),
    date: { text: "3100 BC", at: "^+0.3" },
    titles: [name("NARMER", "@Narmer")],
  },
  {
    id: "S06", part: "THE FIRST KINGDOMS", assets: ["MAP-03"], type: "map",
    motion: "Zoom on the area around Memphis.",
    cues: [{ word: "Memphis", action: "Memphis marker pulses" }],
    year: [{ at: "^+0.3", value: -2686 }],
    map: {
      id: "MAP-03",
      meridian: 31,
      camera: [
        { at: "^", center: [31.2, 27.6], zoom: 3.8 },
        { at: "@Memphis-0.5", center: [31.2, 28.2], zoom: 4.6 },
        { at: "@Memphis+2", center: [31.2, 29.9], zoom: 12 },
        { at: "$", center: [31.2, 29.9], zoom: 13 },
      ],
      states: [{ at: "^", layers: [{ territory: "egypt_old_kingdom", fill: TERRA, opacity: 0.85 }] }],
      lines: nile(),
      markers: [
        city("memphis", "Memphis", C.memphis, "@Memphis", { pulse: true, labelSide: "right" }),
        city("saqqara", "Saqqara", C.saqqara, "@Memphis+1.6", { labelSide: "left" }),
        city("giza", "Giza", C.giza, "@Memphis+2", { labelSide: "top" }),
      ],
    },
  },
  {
    id: "S07", part: "THE FIRST KINGDOMS", assets: ["IMG 004"], type: "image", image: "images/004.jpg",
    motion: "Slow push in on the Step Pyramid.",
    cues: [{ word: "Imhotep", action: 'name card "IMHOTEP"' }],
    kenBurns: kb([1.04, 0.5, 0.5], [1.3, 0.36, 0.42]),
    effects: { dust: 1 },
    titles: [name("IMHOTEP", "@Imhotep")],
  },
  {
    id: "S08", part: "THE FIRST KINGDOMS", assets: ["IMG 005"], type: "image", image: "images/005.jpg",
    motion: "Slow tilt up the Great Pyramid.",
    cues: [
      { word: "146", action: 'label "146 m"' },
      { word: "3,700", action: 'label "3,700+ YEARS"' },
    ],
    kenBurns: kb([1.3, 0.6, 0.7], [1.3, 0.6, 0.3]),
    date: { text: "2600 BC", at: "^+0.3" },
    titles: [name("146 m", "@146", "@3,700-0.6"), name("3,700+ YEARS", "@3,700")],
  },
  {
    id: "S09", part: "THE FIRST KINGDOMS", assets: ["IMG 006"], type: "image", image: "images/006.jpg",
    motion: "Slow pan left across the workers.",
    kenBurns: kb([1.25, 0.62, 0.55], [1.25, 0.38, 0.55]),
    effects: { dust: 1 },
  },
  {
    id: "S10", part: "THE FIRST KINGDOMS", assets: ["IMG 007"], type: "image", image: "images/007.jpg",
    motion: "Slow zoom out, slight desaturation.",
    kenBurns: kb([1.35, 0.5, 0.55], [1.04, 0.5, 0.5], { desaturate: [1, 0.6] }),
    effects: { dust: 1 },
  },
  {
    id: "S11", part: "THE FIRST KINGDOMS", assets: ["MAP-04"], type: "map",
    motion: "Egypt split into many small zones, then one color spreads north from Thebes.",
    cues: [
      { word: "Thebes", action: "Thebes marker pulses" },
      { word: "reunited", action: "the zones merge into one color, growing from Thebes" },
    ],
    year: [{ at: "^+0.3", value: -2030 }],
    map: {
      id: "MAP-04",
      meridian: 31,
      camera: [{ at: "^", center: [31.3, 27.6], zoom: 3.5 }, { at: "$", center: [31.3, 27.6], zoom: 3.7 }],
      states: [
        {
          at: "^",
          layers: [
            { territory: "fip_delta_west", fill: "#8A6A4C" },
            { territory: "fip_delta_east", fill: OLIVE },
            { territory: "fip_herakleopolis", fill: "ochre" },
            { territory: "fip_hermopolis", fill: "#5E6B5A" },
            { territory: "fip_asyut", fill: "#9C8A55" },
            { territory: "fip_thebes", fill: TERRA },
            { territory: "fip_elephantine", fill: "#A7794B" },
          ].map((l) => ({ ...l, outline: 1 })),
        },
        { at: "@reunited", duration: 2.4, mode: "grow", origin: C.thebes, layers: [{ territory: "egypt_middle_kingdom", fill: TERRA }] },
      ],
      lines: nile(),
      markers: [city("thebes", "Thebes", C.thebes, "@Thebes", { pulse: true, labelSide: "right" })],
      regionLabels: [{ text: "Middle Kingdom", lonlat: [34.2, 28.2], at: "@reunited+1.4", size: 36, tone: "dark" }],
    },
  },
  {
    id: "S12", part: "THE FIRST KINGDOMS", assets: ["MAP-05"], type: "map",
    motion: "Delta and Levant in view.",
    cues: [
      { word: "Levant", action: "arrow from the Levant into the delta" },
      { word: "Avaris", action: "Avaris marker appears, Hyksos zone over Lower Egypt" },
    ],
    year: [{ at: "^+0.3", value: -1650 }],
    map: {
      id: "MAP-05",
      meridian: 32.5,
      camera: [{ at: "^", center: [32.4, 30.0], zoom: 4.8 }, { at: "$", center: [32.6, 30.3], zoom: 5.2 }],
      states: [
        { at: "^", layers: [{ territory: "egypt_old_kingdom", fill: TERRA, opacity: 0.85 }] },
        {
          at: "@Avaris", duration: 1.2,
          layers: [{ territory: "hyksos_1650bc", fill: OLIVE, outline: 1 }, { territory: "egypt_theban_1650bc", fill: TERRA, opacity: 0.85 }],
        },
      ],
      lines: [
        ...nile(),
        { id: "hyksos", style: "arrow", path: [[35.4, 32.7], [34.6, 31.5], [33.3, 31.05], [32.2, 30.85]], at: "@Levant", until: "@Avaris" },
      ],
      markers: [city("avaris", "Avaris", C.avaris, "@Avaris", { labelSide: "top" })],
      regionLabels: [
        { text: "Levant", lonlat: [36.1, 32.6], at: "^+0.4", size: 32, tone: "dark" },
        { text: "Hyksos", lonlat: [30.2, 30.9], at: "@Avaris+0.5", size: 34 },
        { text: "Thebans", lonlat: [29.7, 28.0], at: "@Avaris+0.8", size: 30, tone: "dark" },
      ],
      seaLabels: [{ text: "MEDITERRANEAN SEA", lonlat: [31.6, 32.6], size: 24 }],
    },
  },

  // ---------------- PART 2: EMPIRE AND DECLINE ----------------
  {
    id: "S13", part: "EMPIRE AND DECLINE", assets: ["IMG 008"], type: "image", image: "images/008.jpg",
    motion: "Fast push in on the charging chariots.",
    kenBurns: kb([1.04, 0.5, 0.55], [1.45, 0.38, 0.62]),
    effects: { dust: 1 },
    date: { text: "1550 BC", at: "^+0.3" },
  },
  {
    id: "S14", part: "EMPIRE AND DECLINE", assets: ["IMG 009"], type: "image", image: "images/009.jpg",
    motion: "Slow pan right along the ships.",
    cues: [{ word: "women", action: 'name card "HATSHEPSUT"' }],
    kenBurns: kb([1.25, 0.38, 0.5], [1.25, 0.64, 0.45]),
    titles: [name("HATSHEPSUT", "@women")],
  },
  {
    id: "S15", part: "EMPIRE AND DECLINE", assets: ["MAP-06"], type: "map",
    motion: "Egypt grows into its New Kingdom empire.",
    cues: [
      { word: "Thutmose", action: "name label THUTMOSE III" },
      { word: "Euphrates", action: "territory grows north to the Euphrates" },
      { word: "Nubia", action: "territory grows south into Nubia" },
    ],
    year: [{ at: "^+0.3", value: -1450 }],
    titles: [name("THUTMOSE III", "@Thutmose")],
    map: {
      id: "MAP-06",
      meridian: 33,
      camera: [{ at: "^", center: [32.4, 27.6], zoom: 2.0 }, { at: "$", center: [33.4, 27.6], zoom: 1.8 }],
      states: [
        { at: "^", layers: [{ territory: "egypt_heartland", fill: TERRA }] },
        {
          at: "@Euphrates", duration: 1.6, mode: "grow", origin: [32.6, 31],
          layers: [{ territory: "egypt_heartland", fill: TERRA }, { territory: "egypt_levant_1450bc", fill: TERRA }],
        },
        {
          at: "@Nubia", duration: 1.6, mode: "grow", origin: [32.9, 24],
          layers: [{ territory: "egypt_heartland", fill: TERRA }, { territory: "egypt_levant_1450bc", fill: TERRA }, { territory: "egypt_nubia_1450bc", fill: TERRA }],
        },
      ],
      lines: [
        { id: "nubia", style: "river", path: NILE_NUBIA, at: PRE, duration: 0.1 },
        ...nile(),
        { id: "euphrates", style: "river", path: [[38.8, 38.4], [38.3, 37.4], [38.0, 36.83], [38.1, 36.0], [39.0, 35.95], [40.14, 35.33], [40.9, 34.45], [42.1, 34.1], [43.4, 33.4], [44.4, 32.5], [45.9, 31.0], [47.4, 31.0]], at: "^+0.3", duration: 1.4 },
      ],
      regionLabels: [
        { text: "Euphrates", lonlat: [41.8, 35.2], at: "@Euphrates", size: 24, tone: "dark" },
        { text: "Egypt", lonlat: [28.6, 27.2], at: "^+0.4", size: 40, tone: "dark" },
        { text: "Nubia", lonlat: [34.6, 20.4], at: "@Nubia+0.4", size: 34, tone: "dark" },
      ],
      seaLabels: [{ text: "MEDITERRANEAN SEA", lonlat: [27.5, 33.6], size: 22 }, { text: "RED SEA", lonlat: [37.4, 21.8], size: 22 }],
    },
  },
  {
    id: "S16", part: "EMPIRE AND DECLINE", assets: ["IMG 010"], type: "image", image: "images/010.jpg",
    motion: "Slow push in on the sun disc with its rays.",
    cues: [{ word: "Akhenaten", action: 'name card "AKHENATEN"' }],
    kenBurns: kb([1.04, 0.5, 0.5], [1.35, 0.4, 0.3]),
    titles: [name("AKHENATEN", "@Akhenaten")],
  },
  {
    id: "S17", part: "EMPIRE AND DECLINE", assets: ["IMG 011"], type: "image", image: "images/011.jpg",
    motion: "Slow push in through the doorway toward the gold.",
    cues: [{ word: "Tutankhamun", action: 'name card "TUTANKHAMUN"' }],
    kenBurns: kb([1.04, 0.5, 0.5], [1.5, 0.48, 0.55]),
    titles: [name("TUTANKHAMUN", "@Tutankhamun")],
  },
  {
    id: "S18", part: "EMPIRE AND DECLINE", assets: ["MAP-07"], type: "map",
    motion: "Egypt and the Hittite Empire face each other in the Levant.",
    cues: [
      { word: "Ramesses", action: "name label RAMESSES II" },
      { word: "Kadesh", action: "battle icon at Kadesh" },
    ],
    year: [{ at: "^+0.3", value: -1274 }],
    titles: [name("RAMESSES II", "@Ramesses", "@Kadesh-0.6")],
    map: {
      id: "MAP-07",
      meridian: 34,
      camera: [
        { at: "^", center: [33.6, 32.4], zoom: 2.1 },
        { at: "@Kadesh-0.6", center: [33.8, 32.6], zoom: 2.2 },
        { at: "@Kadesh+1.4", center: [36, 34], zoom: 4.6 },
        { at: "$", center: [36, 34], zoom: 4.8 },
      ],
      states: [{ at: "^", layers: [{ territory: "egypt_1274bc", fill: TERRA }, { territory: "hittite_1274bc", fill: RED, outline: 1 }] }],
      lines: nile(),
      markers: [city("kadesh", "Kadesh", C.kadesh, "^+0.8", { battleAt: "@Kadesh+0.2", labelSide: "right" })],
      regionLabels: [
        { text: "Egypt", lonlat: [32.4, 27.0], at: "^+0.4", size: 40 },
        { text: "Hittites", lonlat: [33.4, 39.2], at: "^+0.6", size: 40 },
      ],
      seaLabels: [{ text: "MEDITERRANEAN SEA", lonlat: [28.5, 33.6], size: 22 }],
    },
  },
  {
    id: "S19", part: "EMPIRE AND DECLINE", assets: ["IMG 012"], type: "image", image: "images/012.jpg",
    motion: "Slow push in on the silver tablet.",
    kenBurns: kb([1.04, 0.5, 0.5], [1.35, 0.5, 0.4]),
    date: { text: "1258 BC", at: "^+0.3" },
  },
  {
    id: "S20", part: "EMPIRE AND DECLINE", assets: ["MAP-08"], type: "map",
    motion: "Eastern Mediterranean.",
    cues: [
      { word: "burned", action: "red flashes on several coastal cities" },
      { word: "Sea", action: "arrows of the Sea Peoples sweep toward the Nile delta" },
    ],
    year: [{ at: "^+0.3", value: -1177 }],
    map: {
      id: "MAP-08",
      meridian: 29,
      camera: [{ at: "^", center: [29.5, 35], zoom: 2.4 }, { at: "$", center: [30, 34.4], zoom: 2.55 }],
      states: [
        { at: "^", layers: [{ territory: "hittite_1274bc", fill: MUTED }, { territory: "egypt_heartland", fill: TERRA }] },
        // the Hittite Empire collapses with its cities
        { at: "@burned+1.2", duration: 1.6, layers: [{ territory: "egypt_heartland", fill: TERRA }] },
      ],
      lines: [
        ...nile(),
        { id: "sea1", style: "arrow", path: [[24.6, 38.4], [26.6, 35.6], [29.4, 32.8], [30.9, 31.6]], at: "@Sea", duration: 1.6 },
        { id: "sea2", style: "arrow", path: [[27.4, 37.6], [31.5, 35.8], [34.4, 34.6], [34.3, 32.6], [32.4, 31.5]], at: "@Sea+0.3", duration: 1.8 },
      ],
      markers: [
        city("mycenae", "Mycenae", [22.76, 37.73], "^+0.4", { flashAt: "@burned", labelSide: "left" }),
        city("knossos", "Knossos", [25.16, 35.3], "^+0.5", { flashAt: "@burned+0.25", labelSide: "bottom" }),
        city("hattusa", "Hattusa", [34.62, 40.02], "^+0.6", { flashAt: "@burned+0.5", labelSide: "right" }),
        city("ugarit", "Ugarit", [35.78, 35.6], "^+0.7", { flashAt: "@burned+0.75", labelSide: "right" }),
      ],
      regionLabels: [{ text: "Egypt", lonlat: [28.8, 28.8], at: "^+0.4", size: 40 }],
      seaLabels: [{ text: "MEDITERRANEAN SEA", lonlat: [20.5, 33.8], size: 22 }],
    },
  },
  {
    id: "S21", part: "EMPIRE AND DECLINE", assets: ["MAP-09"], type: "map",
    motion: "Nile valley from the delta down to Kush.",
    cues: [
      { word: "Kush", action: "Kush zone appears in the south" },
      { word: "conquered", action: "Kush grows north over all of Egypt" },
    ],
    year: [{ at: "^+0.3", value: -747 }],
    map: {
      id: "MAP-09",
      meridian: 32,
      camera: [{ at: "^", center: [31.6, 24.4], zoom: 2.15 }, { at: "$", center: [31.6, 24.4], zoom: 2.3 }],
      states: [
        { at: "^", layers: [{ territory: "egypt_heartland", fill: TERRA }] },
        { at: "@Kush", duration: 1.2, layers: [{ territory: "egypt_heartland", fill: TERRA }, { territory: "kush_750bc", fill: OLIVE, outline: 1 }] },
        { at: "@conquered", duration: 2.2, mode: "grow", origin: C.napata, layers: [{ territory: "kush_25th_dynasty", fill: OLIVE, outline: 1 }] },
      ],
      lines: [{ id: "sudan", style: "river", path: NILE_SUDAN, at: PRE, duration: 0.1 }, { id: "nubia", style: "river", path: NILE_NUBIA, at: PRE, duration: 0.1 }, ...nile()],
      markers: [city("napata", "Napata", C.napata, "@Kush+0.3", { labelSide: "left" })],
      regionLabels: [
        { text: "Egypt", lonlat: [28.6, 27.4], at: "^+0.4", size: 40, tone: "dark", hideAt: "@conquered+1.2" },
        { text: "Kush", lonlat: [35.4, 17.6], at: "@Kush+0.4", size: 44 },
      ],
      seaLabels: [{ text: "RED SEA", lonlat: [37.6, 21.4], size: 22 }],
    },
  },
  {
    id: "S22", part: "EMPIRE AND DECLINE", assets: ["IMG 013"], type: "image", image: "images/013.jpg",
    motion: "Slow zoom out on the burning temple city.",
    kenBurns: kb([1.4, 0.3, 0.45], [1.04, 0.5, 0.5]),
    effects: { fire: 1 },
    year: [{ at: "^+0.3", value: -671 }, { at: "@663", value: -671 }, { at: "@663+0.5", value: -663 }],
  },
  {
    id: "S23", part: "EMPIRE AND DECLINE", assets: ["MAP-10"], type: "map",
    motion: "Wide view of the Persian Empire.",
    cues: [
      { word: "Psamtik", action: "Egypt in its own color" },
      { word: "Cambyses", action: "arrow into Egypt, Egypt joins the Persian Empire color" },
    ],
    year: [{ at: "^+0.3", value: -525 }],
    map: {
      id: "MAP-10",
      meridian: 46,
      camera: [{ at: "^", center: [46, 31.5], zoom: 1.15 }, { at: "$", center: [45, 31.5], zoom: 1.22 }],
      states: [
        { at: "^", layers: [{ territory: "achaemenid_500bc", fill: RED, opacity: 0.85 }] },
        { at: "@Psamtik", duration: 0.8, layers: [{ territory: "achaemenid_500bc", fill: RED, opacity: 0.85 }, { territory: "egypt_heartland", fill: TERRA, outline: 1 }] },
        { at: "@Cambyses+1.3", duration: 1.2, layers: [{ territory: "achaemenid_500bc", fill: RED, opacity: 0.85 }, { territory: "egypt_heartland", fill: RED, opacity: 0.85 }] },
      ],
      lines: [{ id: "cambyses", style: "arrow", path: [[35.8, 32.2], [34.0, 31.2], [32.0, 30.6]], at: "@Cambyses", duration: 1.3 }],
      regionLabels: [
        { text: "Persian Empire", lonlat: [55, 32], at: "^+0.4", size: 40 },
        { text: "Egypt", lonlat: [28.6, 27], at: "@Psamtik+0.2", size: 36, tone: "dark" },
      ],
      seaLabels: [{ text: "MEDITERRANEAN SEA", lonlat: [25, 34.2], size: 20 }, { text: "PERSIAN GULF", lonlat: [51.5, 26.6], size: 20 }],
    },
  },

  // ---------------- PART 3: GREEKS, ROMANS AND ARABS ----------------
  {
    id: "S24", part: "GREEKS, ROMANS AND ARABS", assets: ["IMG 014"], type: "image", image: "images/014.jpg",
    motion: "Slow push in on Alexander.",
    cues: [{ word: "Alexandria", action: 'label "ALEXANDRIA"' }],
    kenBurns: kb([1.04, 0.5, 0.5], [1.3, 0.42, 0.38]),
    date: { text: "332 BC", at: "^+0.3" },
    titles: [name("ALEXANDRIA", "@himself")], // "Alexandria" is the scene's last word
  },
  {
    id: "S25", part: "GREEKS, ROMANS AND ARABS", assets: ["MAP-11"], type: "map",
    motion: "The kingdoms after Alexander.",
    cues: [
      { word: "Ptolemy", action: "Ptolemaic kingdom highlights" },
      { word: "Alexandria", action: "Alexandria marker pulses" },
    ],
    year: [{ at: "^+0.3", value: -305 }],
    map: {
      id: "MAP-11",
      meridian: 38,
      camera: [{ at: "^", center: [38, 33], zoom: 1.4 }, { at: "$", center: [37, 33], zoom: 1.5 }],
      states: [
        { at: "^", layers: [{ territory: "macedon_200bc", fill: "#8A6A4C" }, { territory: "seleucid_200bc", fill: OLIVE }, { territory: "ptolemaic_200bc", fill: MUTED }] },
        { at: "@Ptolemy", duration: 1, layers: [{ territory: "macedon_200bc", fill: "#8A6A4C" }, { territory: "seleucid_200bc", fill: OLIVE }, { territory: "ptolemaic_200bc", fill: TERRA, outline: 1 }] },
      ],
      markers: [city("alexandria", "Alexandria", C.alexandria, "@Alexandria", { pulse: true, labelSide: "top" })],
      regionLabels: [
        { text: "Ptolemies", lonlat: [28.4, 26.6], at: "@Ptolemy+0.3", size: 38 },
        { text: "Seleucids", lonlat: [50, 33], at: "^+0.4", size: 38 },
        { text: "Macedon", lonlat: [22.6, 41.6], at: "^+0.6", size: 30 },
      ],
      seaLabels: [{ text: "MEDITERRANEAN SEA", lonlat: [22, 34], size: 20 }],
    },
  },
  {
    id: "S26", part: "GREEKS, ROMANS AND ARABS", assets: ["IMG 015"], type: "image", image: "images/015.jpg",
    motion: "Slow tilt up the lighthouse.",
    cues: [{ word: "decree", action: 'label "196 BC"' }],
    kenBurns: kb([1.3, 0.5, 0.62], [1.3, 0.5, 0.3]),
    date: { text: "196 BC", at: "@decree" },
  },
  {
    id: "S27", part: "GREEKS, ROMANS AND ARABS", assets: ["IMG 016"], type: "image", image: "images/016.jpg",
    motion: "Slow zoom out over the sea battle.",
    cues: [{ word: "Cleopatra", action: 'name card "CLEOPATRA VII"' }],
    kenBurns: kb([1.35, 0.5, 0.45], [1.04, 0.5, 0.5]),
    effects: { smoke: 0.7 },
    date: { text: "31 BC", at: "^+0.3" },
    titles: [name("CLEOPATRA VII", "@Cleopatra")],
  },
  {
    id: "S28", part: "GREEKS, ROMANS AND ARABS", assets: ["MAP-12"], type: "map",
    motion: "The Roman Empire around the Mediterranean.",
    cues: [{ word: "grain", action: "trade line with moving ship dots from Alexandria to Rome" }],
    year: [{ at: "^+0.3", value: 1 }],
    yearEra: "AD",
    map: {
      id: "MAP-12",
      meridian: 18,
      camera: [{ at: "^", center: [19, 37.5], zoom: 1.3 }, { at: "$", center: [20, 37], zoom: 1.4 }],
      states: [{ at: "^", layers: [{ territory: "roman_bc1", fill: OLIVE }, { territory: "egypt_heartland", fill: TERRA }] }],
      lines: [
        {
          id: "grain", style: "trade", at: "@grain", duration: 2,
          path: [C.alexandria, [27.5, 32.6], [22.5, 35.2], [17.5, 37.2], [15.6, 38.2], [13.8, 39.6], [12.29, 41.73]],
          dots: { at: "@grain+0.8", count: 3, period: 7 },
        },
      ],
      markers: [city("alexandria", "Alexandria", C.alexandria, "^+0.4", { labelSide: "bottom" }), city("rome", "Rome", C.rome, "^+0.6", { labelSide: "top" })],
      regionLabels: [{ text: "Roman Empire", lonlat: [3, 46.2], at: "^+0.4", size: 40 }],
      seaLabels: [{ text: "MEDITERRANEAN SEA", lonlat: [18, 34.2], size: 22 }],
    },
  },
  {
    id: "S29", part: "GREEKS, ROMANS AND ARABS", assets: ["IMG 017"], type: "image", image: "images/017.jpg",
    motion: "Slow push in on the monastery.",
    kenBurns: kb([1.04, 0.5, 0.5], [1.3, 0.42, 0.55]),
  },
  {
    id: "S30", part: "GREEKS, ROMANS AND ARABS", assets: ["MAP-13"], type: "map",
    motion: "Byzantine and Sasanian empires.",
    cues: [
      { word: "Persians", action: "Egypt turns Sasanian color" },
      { word: "Arabia", action: "Arabia lights up in a new color" },
    ],
    year: [{ at: "^+0.3", value: 618 }, { at: "@618", value: 618 }, { at: "@628", value: 628 }],
    yearEra: "AD",
    map: {
      id: "MAP-13",
      meridian: 40,
      camera: [{ at: "^", center: [40, 31], zoom: 1.4 }, { at: "@decade", center: [40, 31], zoom: 1.4 }, { at: "$", center: [40, 28.5], zoom: 1.45 }],
      states: (() => {
        const base = [{ territory: "eastern_roman_600", fill: OLIVE }, { territory: "sasanian_600", fill: RED }];
        return [
          { at: "^", layers: [...base, { territory: "egypt_heartland", fill: TERRA }] },
          { at: "@Persians", duration: 1.2, layers: [...base, { territory: "egypt_heartland", fill: RED, outline: 1 }] },
          // "Arabia" is the scene's last word: light it up on "power"
          { at: "@power", duration: 1.2, layers: [...base, { territory: "egypt_heartland", fill: RED, outline: 1 }, { territory: "hejaz_600", fill: "gold", outline: 1 }] },
        ];
      })(),
      regionLabels: [
        { text: "Eastern Roman Empire", lonlat: [30, 39.6], at: "^+0.4", size: 34 },
        { text: "Sasanian Empire", lonlat: [53, 33], at: "^+0.6", size: 34 },
        { text: "Egypt", lonlat: [28.6, 27], at: "^+0.8", size: 32, tone: "dark" },
        { text: "Arabia", lonlat: [43.5, 24], at: "@power+0.3", size: 36, tone: "dark" },
      ],
      seaLabels: [{ text: "MEDITERRANEAN SEA", lonlat: [24, 34], size: 20 }, { text: "RED SEA", lonlat: [38, 20.8], size: 20 }],
    },
  },
  {
    id: "S31", part: "GREEKS, ROMANS AND ARABS", assets: ["MAP-14"], type: "map",
    motion: "Zoom on the delta and Sinai.",
    cues: [
      { word: "Amr", action: "arrow from Sinai into the delta" },
      { word: "Babylon", action: "Babylon marker gets a cross" },
      { word: "Alexandria", action: "Alexandria marker gets a cross" },
      { word: "capital", action: "Fustat marker appears" },
    ],
    year: [{ at: "^+0.3", value: 639 }, { at: "@Babylon", value: 639 }, { at: "@Alexandria", value: 642 }],
    yearEra: "AD",
    map: {
      id: "MAP-14",
      meridian: 32,
      camera: [
        { at: "^", center: [31.9, 30.7], zoom: 7.2 },
        { at: "@capital-0.4", center: [31.8, 30.6], zoom: 7.6 },
        { at: "@capital+1.4", center: [31.23, 30.02], zoom: 16 },
        { at: "$", center: [31.23, 30.02], zoom: 17 },
      ],
      states: [{ at: "^", layers: [{ territory: "egypt_heartland", fill: TERRA, opacity: 0.75 }] }],
      lines: [
        ...nile(),
        { id: "amr", style: "arrow", path: [[33.8, 31.13], [32.57, 31.04], [31.9, 30.6], [31.32, 30.08]], at: "@Amr", until: "@Babylon-0.2" },
      ],
      markers: [
        city("babylon", "Babylon", C.babylon, "^+0.5", { crossAt: "@Babylon", labelSide: "right" }),
        city("alexandria", "Alexandria", C.alexandria, "^+0.7", { crossAt: "@Alexandria", labelSide: "top" }),
        { id: "pelusium", label: "Pelusium", lonlat: [32.57, 31.04], at: "@Amr+0.5", kind: "dot", labelSide: "top" },
        city("fustat", "Fustat", C.fustat, "@capital", { pulse: true, labelSide: "left" }),
      ],
      regionLabels: [{ text: "Sinai", lonlat: [33.9, 30.0], at: "^+0.4", size: 32, tone: "dark" }],
      seaLabels: [{ text: "MEDITERRANEAN SEA", lonlat: [31.4, 32.0], size: 24 }],
    },
  },

  // ---------------- PART 4: CAIRO, THE MAMLUKS AND NAPOLEON ----------------
  {
    id: "S32", part: "CAIRO, THE MAMLUKS AND NAPOLEON", assets: ["IMG 018"], type: "image", image: "images/018.jpg",
    motion: "Slow pan across the new city.",
    cues: [{ word: "Cairo", action: 'label "CAIRO"' }],
    kenBurns: kb([1.25, 0.38, 0.5], [1.25, 0.62, 0.5]),
    date: { text: "969", at: "^+0.3" },
    titles: [name("CAIRO", "@Cairo")],
  },
  {
    id: "S33", part: "CAIRO, THE MAMLUKS AND NAPOLEON", assets: ["IMG 019"], type: "image", image: "images/019.jpg",
    motion: "Slow push in on Saladin.",
    cues: [{ word: "Saladin", action: 'name card "SALADIN"' }],
    kenBurns: kb([1.04, 0.5, 0.5], [1.3, 0.6, 0.42]),
    date: { text: "1187", at: "^+0.3" },
    titles: [name("SALADIN", "@Saladin")],
  },
  {
    id: "S34", part: "CAIRO, THE MAMLUKS AND NAPOLEON", assets: ["IMG 020"], type: "image", image: "images/020.jpg",
    motion: "Slow push in on the captured king.",
    cues: [{ word: "Louis", action: 'name card "LOUIS IX"' }],
    kenBurns: kb([1.04, 0.5, 0.5], [1.3, 0.47, 0.45]),
    effects: { dust: 1 },
    date: { text: "1250", at: "^+0.3" },
    titles: [name("LOUIS IX", "@Louis")],
  },
  {
    id: "S35", part: "CAIRO, THE MAMLUKS AND NAPOLEON", assets: ["MAP-15"], type: "map",
    motion: "The Mamluk Sultanate in Egypt and Syria.",
    cues: [
      { word: "Ten", action: "Mongol zone in the north east" },
      { word: "Mongols", action: "battle icon at Ain Jalut" },
      { word: "stronghold", action: "cross mark on Acre" },
    ],
    year: [{ at: "^+0.3", value: 1260 }, { at: "@stronghold-1", value: 1260 }, { at: "@stronghold", value: 1291 }],
    map: {
      id: "MAP-15",
      meridian: 36,
      camera: [
        { at: "^", center: [36.5, 32], zoom: 2.1 },
        { at: "@Mongols-0.6", center: [36.5, 32], zoom: 2.15 },
        { at: "@Mongols+1.2", center: [35.2, 32.75], zoom: 10 },
        { at: "$", center: [35.2, 32.75], zoom: 10.5 },
      ],
      states: [
        { at: "^", layers: [{ territory: "mamluk_1279", fill: TERRA }] },
        { at: "@Ten", duration: 1.2, layers: [{ territory: "mamluk_1279", fill: TERRA }, { territory: "ilkhanate_1279", fill: RED, outline: 1 }] },
      ],
      lines: nile(),
      markers: [
        city("cairo", "Cairo", C.cairo, "^+0.4", { labelSide: "left" }),
        { id: "ainjalut", label: "Ain Jalut", lonlat: C.ainJalut, at: "@Mongols-0.3", kind: "dot", battleAt: "@Mongols+0.3", labelSide: "right" },
        city("acre", "Acre", C.acre, "@Mongols+1.4", { crossAt: "@stronghold", labelSide: "left" }),
      ],
      regionLabels: [
        { text: "Mamluk Sultanate", lonlat: [29.8, 27.4], at: "^+0.4", size: 36 },
        { text: "Mongols", lonlat: [44, 36.6], at: "@Ten+0.4", size: 38 },
      ],
      seaLabels: [{ text: "MEDITERRANEAN SEA", lonlat: [29, 33.6], size: 20 }],
    },
  },
  {
    id: "S36", part: "CAIRO, THE MAMLUKS AND NAPOLEON", assets: ["IMG 021"], type: "image", image: "images/021.jpg",
    motion: "Slow zoom out on the empty street, desaturation.",
    kenBurns: kb([1.35, 0.5, 0.55], [1.04, 0.5, 0.5], { desaturate: [1, 0.55] }),
    date: { text: "1347", at: "^+0.3" },
  },
  {
    id: "S37", part: "CAIRO, THE MAMLUKS AND NAPOLEON", assets: ["MAP-16"], type: "map",
    motion: "The eastern Mediterranean.",
    cues: [{ word: "Selim", action: "Ottoman color spreads from Syria over Egypt" }],
    year: [{ at: "^+0.3", value: 1517 }],
    map: {
      id: "MAP-16",
      meridian: 34,
      camera: [{ at: "^", center: [34, 32.5], zoom: 1.8 }, { at: "$", center: [33, 31.5], zoom: 1.9 }],
      states: [
        { at: "^", layers: [{ territory: "ottoman_1492", fill: OLIVE }, { territory: "mamluk_1492", fill: TERRA }] },
        { at: "@Selim+0.3", duration: 2.6, mode: "grow", origin: [37, 35.5], layers: [{ territory: "ottoman_1530", fill: OLIVE, outline: 1 }] },
      ],
      markers: [city("cairo", "Cairo", C.cairo, "^+0.5", { crossAt: "@Selim+2.4", labelSide: "left" })],
      regionLabels: [
        { text: "Ottoman Empire", lonlat: [32.5, 39.4], at: "^+0.4", size: 38 },
        { text: "Mamluks", lonlat: [29, 27.2], at: "^+0.6", size: 36, hideAt: "@Selim+2" },
      ],
      seaLabels: [{ text: "MEDITERRANEAN SEA", lonlat: [25, 34], size: 20 }],
    },
  },
  {
    id: "S38", part: "CAIRO, THE MAMLUKS AND NAPOLEON", assets: ["IMG 022"], type: "image", image: "images/022.jpg",
    motion: "Slow pan across the battle with the pyramids behind.",
    cues: [{ word: "Napoleon", action: 'name card "NAPOLEON"' }],
    kenBurns: kb([1.25, 0.38, 0.5], [1.25, 0.62, 0.5]),
    effects: { smoke: 0.6 },
    date: { text: "1798", at: "^+0.3" },
    titles: [name("NAPOLEON", "@Napoleon")],
  },
  {
    id: "S39", part: "CAIRO, THE MAMLUKS AND NAPOLEON", assets: ["IMG 023"], type: "image", image: "images/023.jpg",
    motion: "Slow push in on the stone.",
    cues: [{ word: "hieroglyphs", action: 'name card "CHAMPOLLION"' }],
    kenBurns: kb([1.04, 0.5, 0.5], [1.35, 0.45, 0.42]),
    year: [{ at: "^+0.3", value: 1799 }, { at: "@1822", value: 1799 }, { at: "@1822+0.6", value: 1822 }],
    titles: [name("CHAMPOLLION", "@hieroglyphs")],
  },

  // ---------------- PART 5: MUHAMMAD ALI AND THE BRITISH ----------------
  {
    id: "S40", part: "MUHAMMAD ALI AND THE BRITISH", assets: ["IMG 024"], type: "image", image: "images/024.jpg",
    motion: "Slow push in on Muhammad Ali.",
    cues: [{ word: "Muhammad", action: 'name card "MUHAMMAD ALI"' }],
    kenBurns: kb([1.04, 0.5, 0.5], [1.3, 0.66, 0.4]),
    date: { text: "1805", at: "^+0.3" },
    titles: [name("MUHAMMAD ALI", "@Muhammad")],
  },
  {
    id: "S41", part: "MUHAMMAD ALI AND THE BRITISH", assets: ["IMG 025"], type: "image", image: "images/025.jpg",
    motion: "Slow push in on the closed gate, dark vignette.",
    kenBurns: kb([1.04, 0.5, 0.5], [1.3, 0.42, 0.5]),
    effects: { vignette: 0.7 },
    date: { text: "1811", at: "^+0.3" },
  },
  {
    id: "S42", part: "MUHAMMAD ALI AND THE BRITISH", assets: ["MAP-17"], type: "map",
    motion: "Egypt and its neighbours.",
    cues: [
      { word: "Sudan", action: "Egyptian color grows into Sudan" },
      { word: "Arabia", action: "into western Arabia" },
      { word: "Syria", action: "into Syria" },
      { word: "Constantinople", action: "arrow toward Constantinople, then pulls back" },
      { word: "European", action: "Syria and Arabia fade back" },
    ],
    year: [{ at: "^+0.3", value: 1811 }, { at: "@Constantinople", value: 1833 }, { at: "@European", value: 1840 }],
    map: {
      id: "MAP-17",
      meridian: 34,
      camera: [{ at: "^", center: [34, 26.5], zoom: 1.2 }, { at: "$", center: [34, 27], zoom: 1.28 }],
      states: (() => {
        const base = [{ territory: "ottoman_1815", fill: MUTED }, { territory: "egypt_1811", fill: TERRA }];
        const sudan = { territory: "sudan_1820s", fill: TERRA };
        const hejaz = { territory: "hejaz_1818", fill: TERRA };
        const syria = { territory: "syria_1831", fill: TERRA };
        return [
          { at: "^", layers: base },
          { at: "@Sudan", duration: 1.4, mode: "grow", origin: [31.5, 22], layers: [...base, sudan] },
          { at: "@Arabia", duration: 1.2, mode: "grow", origin: [35, 28], layers: [...base, sudan, hejaz] },
          { at: "@Syria", duration: 1.2, mode: "grow", origin: [34.3, 31.2], layers: [...base, sudan, hejaz, syria] },
          { at: "@European+0.4", duration: 1.4, layers: [...base, sudan] },
        ];
      })(),
      lines: [
        {
          id: "ibrahim", style: "arrow", path: [[36.2, 36.9], [34.6, 38.0], [32.6, 38.8], [30.6, 39.6]], at: "@Constantinople", duration: 1.3,
          hideAt: "@European",
        },
      ],
      markers: [city("constantinople", "Constantinople", C.constantinople, "@Constantinople-0.2", { labelSide: "top" })],
      regionLabels: [
        { text: "Egypt", lonlat: [28.6, 26.4], at: "^+0.4", size: 40 },
        { text: "Ottoman Empire", lonlat: [39.5, 38.6], at: "^+0.6", size: 32, tone: "dark" },
        { text: "Sudan", lonlat: [30.5, 16], at: "@Sudan+0.6", size: 36 },
      ],
      seaLabels: [{ text: "MEDITERRANEAN SEA", lonlat: [24, 34], size: 20 }, { text: "RED SEA", lonlat: [38.2, 20.6], size: 20 }],
    },
  },
  {
    id: "S43", part: "MUHAMMAD ALI AND THE BRITISH", assets: ["MAP-18"], type: "map",
    motion: "Wide view: Europe, Africa and Asia.",
    cues: [
      { word: "opened", action: "the canal route draws through Suez" },
      { word: "Africa", action: "the old route around Africa draws in dashed, then fades" },
    ],
    year: [{ at: "^+0.3", value: 1869 }],
    map: {
      id: "MAP-18",
      meridian: 30,
      camera: [{ at: "^", center: [30, 9], zoom: 0.42 }, { at: "$", center: [30, 9], zoom: 0.44 }],
      states: [{ at: "^", layers: [{ territory: "egypt_modern", fill: TERRA }] }],
      lines: [
        {
          id: "suez", style: "trade", at: "@opened", duration: 2.4,
          path: [C.london, [-5, 49], [-9.6, 43], [-9.8, 38], [-5.6, 36.0], [3, 37.5], [11, 37.4], [20, 34], [32.3, 31.3], [32.55, 29.9], [34.5, 27], [38, 21], [42.7, 13.5], [45, 12.4], [55, 14], [64, 17], C.bombay],
          dots: { at: "@opened+2", count: 3, period: 9 },
        },
        {
          // "Africa" is the scene's last word: draw from "ships", fade right after "Africa"
          id: "cape", style: "route", at: "@ships", duration: 1.8, hideAt: "@Africa+0.1",
          path: [C.london, [-10, 45], [-17, 30], [-20, 15], [-12, 0], [0, -15], [10, -30], [18.5, -35.6], [26, -36], [38, -30], [45, -22], [55, -10], [62, 5], [70, 15], C.bombay],
        },
      ],
      markers: [
        city("london", "London", C.london, "^+0.4", { labelSide: "top" }),
        city("bombay", "Bombay", C.bombay, "^+0.6", { labelSide: "right" }),
        city("suez", "Suez", C.suez, "@opened+0.8", { pulse: true, labelSide: "right" }),
      ],
      seaLabels: [{ text: "ATLANTIC OCEAN", lonlat: [-24, 22], size: 22 }, { text: "INDIAN OCEAN", lonlat: [70, -8], size: 22 }],
    },
  },
  {
    id: "S44", part: "MUHAMMAD ALI AND THE BRITISH", assets: ["IMG 026"], type: "image", image: "images/026.jpg",
    motion: "Slow pan across the British troops.",
    kenBurns: kb([1.25, 0.38, 0.6], [1.25, 0.62, 0.6]),
    effects: { dust: 1 },
    date: { text: "1882", at: "^+0.3" },
  },
  {
    id: "S45", part: "MUHAMMAD ALI AND THE BRITISH", assets: ["IMG 027"], type: "image", image: "images/027.jpg",
    motion: "Slow pan across the crowd.",
    kenBurns: kb([1.25, 0.38, 0.55], [1.25, 0.62, 0.55]),
    year: [{ at: "^+0.3", value: 1919 }, { at: "@1922", value: 1919 }, { at: "@1922+0.6", value: 1922 }],
  },
  {
    id: "S46", part: "MUHAMMAD ALI AND THE BRITISH", assets: ["IMG 011"], type: "image", image: "images/011.jpg",
    motion: "Reuse of 011, a different crop: push in on the golden mask.",
    kenBurns: kb([1.2, 0.44, 0.5], [1.85, 0.4, 0.5]),
    date: { text: "1922", at: "^+0.3" },
  },

  // ---------------- PART 6: MODERN EGYPT ----------------
  {
    id: "S47", part: "MODERN EGYPT", assets: ["IMG 028"], type: "image", image: "images/028.jpg",
    motion: "Slow push in on the officers.",
    cues: [{ word: "Nasser", action: 'name card "GAMAL ABDEL NASSER"' }],
    kenBurns: kb([1.08, 0.5, 0.5], [1.32, 0.42, 0.42]),
    date: { text: "1952", at: "^+0.3" },
    titles: [name("GAMAL ABDEL NASSER", "@Nasser")],
  },
  {
    id: "S48", part: "MODERN EGYPT", assets: ["MAP-19"], type: "map",
    motion: "Zoom on Sinai and the canal.",
    cues: [
      { word: "nationalized", action: "the canal line glows" },
      { word: "Israel", action: "arrows from Israel into Sinai, from the sea at Port Said" },
      { word: "withdraw", action: "the arrows fade out" },
    ],
    year: [{ at: "^+0.3", value: 1956 }],
    map: {
      id: "MAP-19",
      meridian: 33,
      camera: [{ at: "^", center: [32.8, 30.3], zoom: 5.6 }, { at: "$", center: [33.2, 30.4], zoom: 6.4 }],
      states: [{ at: "^", layers: [{ territory: "egypt_modern", fill: TERRA, opacity: 0.85 }, { territory: "israel_modern", fill: OLIVE }] }],
      lines: [
        ...nile(),
        { id: "canal", style: "trade", path: SUEZ_CANAL, at: "@nationalized", duration: 1.2, smooth: false },
        { id: "isr1", style: "arrow", path: [[34.45, 31.05], [33.7, 30.6], [32.85, 30.3]], at: "@Israel", duration: 1.3, hideAt: "@withdraw" },
        { id: "isr2", style: "arrow", path: [[34.5, 30.3], [33.9, 29.6], [33.3, 29.2]], at: "@Israel+0.2", duration: 1.3, hideAt: "@withdraw" },
        { id: "portsaid", style: "arrow", path: [[31.4, 32.9], [31.95, 32.0], [32.28, 31.4]], at: "@Israel+0.6", duration: 1.2, hideAt: "@withdraw" },
      ],
      markers: [
        city("portsaid", "Port Said", C.portSaid, "^+0.4", { labelSide: "left" }),
        city("suez", "Suez", C.suez, "^+0.6", { labelSide: "left" }),
        city("cairo", "Cairo", C.cairo, "^+0.8", { labelSide: "left" }),
      ],
      regionLabels: [
        { text: "Sinai", lonlat: [33.7, 29.6], at: "^+0.4", size: 34, tone: "dark" },
        { text: "Israel", lonlat: [35.1, 31.3], at: "^+0.6", size: 30 },
      ],
      seaLabels: [{ text: "MEDITERRANEAN SEA", lonlat: [32.6, 32.2], size: 22 }],
    },
  },
  {
    id: "S49", part: "MODERN EGYPT", assets: ["MAP-20"], type: "map",
    motion: "Egypt and Syria.",
    cues: [
      { word: "merged", action: "Egypt and Syria in one color, label UNITED ARAB REPUBLIC" },
      { word: "broke", action: "Syria fades back" },
    ],
    year: [{ at: "^+0.3", value: 1958 }, { at: "@broke", value: 1958 }, { at: "@broke+0.6", value: 1961 }],
    map: {
      id: "MAP-20",
      meridian: 33,
      camera: [{ at: "^", center: [33, 29.5], zoom: 1.95 }, { at: "$", center: [33, 29.8], zoom: 2.05 }],
      states: [
        { at: "^", layers: [{ territory: "egypt_modern", fill: TERRA }, { territory: "syria_modern", fill: MUTED }] },
        { at: "@merged", duration: 1, layers: [{ territory: "egypt_modern", fill: TERRA, outline: 1 }, { territory: "syria_modern", fill: TERRA, outline: 1 }] },
        { at: "@broke+0.3", duration: 1.2, layers: [{ territory: "egypt_modern", fill: TERRA }, { territory: "syria_modern", fill: MUTED }] },
      ],
      regionLabels: [
        { text: "Egypt", lonlat: [29.6, 26.2], at: "^+0.4", size: 40, hideAt: "@merged" },
        { text: "Syria", lonlat: [38.6, 35.2], at: "^+0.6", size: 34 },
        { text: "United Arab Republic", lonlat: [30.6, 26.2], at: "@merged+0.4", size: 40, hideAt: "@broke+0.3" },
      ],
      seaLabels: [{ text: "MEDITERRANEAN SEA", lonlat: [27, 33.8], size: 20 }],
    },
  },
  {
    id: "S50", part: "MODERN EGYPT", assets: ["IMG 029"], type: "image", image: "images/029.jpg",
    motion: "Slow pan along the dam wall.",
    cues: [{ word: "Aswan", action: 'label "ASWAN HIGH DAM"' }],
    kenBurns: kb([1.25, 0.35, 0.55], [1.25, 0.62, 0.55]),
    titles: [name("ASWAN HIGH DAM", "@Aswan")],
  },
  {
    id: "S51", part: "MODERN EGYPT", assets: ["MAP-21"], type: "map",
    motion: "Sinai, Gaza and the canal.",
    cues: [{ word: "Sinai", action: "Sinai and Gaza turn Israeli color" }],
    year: [{ at: "^+0.3", value: 1967 }],
    map: {
      id: "MAP-21",
      meridian: 33,
      camera: [{ at: "^", center: [33.3, 30.3], zoom: 6 }, { at: "$", center: [33.5, 30.2], zoom: 6.4 }],
      states: (() => {
        const base = [{ territory: "egypt_modern", fill: TERRA, opacity: 0.85 }, { territory: "israel_modern", fill: OLIVE }];
        return [
          { at: "^", layers: base },
          { at: "@Sinai", duration: 1.4, layers: [...base, { territory: "sinai_1967", fill: OLIVE, outline: 1 }, { territory: "gaza_1967", fill: OLIVE, outline: 1 }] },
        ];
      })(),
      lines: [...nile(), { id: "canal", style: "river", path: SUEZ_CANAL, at: PRE, duration: 0.1, smooth: false }],
      markers: [
        city("cairo", "Cairo", C.cairo, "^+0.4", { labelSide: "left" }),
        { id: "gaza", label: "Gaza", lonlat: [34.45, 31.5], at: "^+0.6", kind: "dot", labelSide: "top" },
      ],
      regionLabels: [
        { text: "Sinai", lonlat: [33.7, 29.5], at: "@Sinai+0.6", size: 36 },
        { text: "Israel", lonlat: [35.1, 31.0], at: "^+0.5", size: 30 },
        { text: "Egypt", lonlat: [30.6, 29.0], at: "^+0.4", size: 36 },
      ],
    },
  },
  {
    id: "S52", part: "MODERN EGYPT", assets: ["MAP-22"], type: "map",
    motion: "Zoom on the canal.",
    cues: [
      { word: "crossed", action: "arrows cross the canal from west to east" },
      { word: "broke", action: "the Israeli line on the east bank breaks" },
    ],
    year: [{ at: "^+0.3", value: 1973 }],
    map: {
      id: "MAP-22",
      meridian: 32.5,
      camera: [{ at: "^", center: [32.55, 30.55], zoom: 11.5 }, { at: "$", center: [32.55, 30.55], zoom: 12.5 }],
      states: [{ at: "^", layers: [{ territory: "egypt_modern", fill: TERRA, opacity: 0.85 }, { territory: "sinai_1967", fill: OLIVE }] }],
      lines: [
        { id: "canal", style: "river", path: SUEZ_CANAL, at: PRE, duration: 0.1, smooth: false },
        { id: "barlev", style: "divider", path: [[32.4, 31.2], [32.39, 30.85], [32.37, 30.6], [32.44, 30.38], [32.5, 30.26], [32.6, 30.1], [32.62, 29.95]], at: "^+0.4", duration: 1.2, hideAt: "@broke+0.2" },
        ...[[31.0, 32.12, 32.58], [30.66, 32.08, 32.55], [30.42, 32.18, 32.62], [30.15, 32.38, 32.8], [29.98, 32.4, 32.82]].map(([lat, x0, x1], i) => ({
          id: `cross${i}`, style: "arrow", path: [[x0, lat], [x1, lat]], at: `@crossed+${(i * 0.2).toFixed(1)}`, duration: 0.9,
        })),
      ],
      markers: [
        city("portsaid", "Port Said", C.portSaid, "^+0.4", { labelSide: "left" }),
        city("ismailia", "Ismailia", C.ismailia, "^+0.5", { labelSide: "left" }),
        city("suez", "Suez", C.suez, "^+0.6", { labelSide: "left" }),
      ],
      regionLabels: [
        { text: "Bar Lev Line", lonlat: [32.95, 30.75], at: "^+1.2", size: 26, tone: "dark", hideAt: "@broke+0.2" },
        { text: "Sinai", lonlat: [33.3, 30.3], at: "^+0.6", size: 34 },
      ],
    },
  },
  {
    id: "S53", part: "MODERN EGYPT", assets: ["IMG 030"], type: "image", image: "images/030.jpg",
    motion: "Slow push in on the handshake.",
    cues: [{ word: "Sadat", action: 'name card "ANWAR SADAT"' }],
    kenBurns: kb([1.04, 0.5, 0.5], [1.35, 0.5, 0.52]),
    date: { text: "1979", at: "^+0.3" },
    titles: [name("ANWAR SADAT", "@Sadat")],
  },
  {
    id: "S54", part: "MODERN EGYPT", assets: ["IMG 031"], type: "image", image: "images/031.jpg",
    motion: "Slow push in on the empty reviewing stand, dark vignette.",
    kenBurns: kb([1.04, 0.5, 0.5], [1.3, 0.35, 0.6]),
    effects: { vignette: 0.7 },
    date: { text: "1981", at: "^+0.3" },
  },
  {
    id: "S55", part: "MODERN EGYPT", assets: ["IMG 032"], type: "image", image: "images/032.jpg",
    motion: "Slow zoom out over the crowd.",
    cues: [{ word: "Mubarak", action: 'name card "HOSNI MUBARAK"' }],
    kenBurns: kb([1.4, 0.5, 0.45], [1.04, 0.5, 0.5]),
    date: { text: "2011", at: "^+0.3" },
    titles: [name("HOSNI MUBARAK", "@Mubarak")],
  },
  {
    id: "S56", part: "MODERN EGYPT", assets: ["IMG 033"], type: "image", image: "images/033.jpg",
    motion: "Slow pan over Cairo at dusk.",
    kenBurns: kb([1.28, 0.38, 0.5], [1.28, 0.62, 0.5]),
    date: { text: "2013", at: "^+0.3" },
  },
  {
    id: "S57", part: "MODERN EGYPT", assets: ["MAP-23"], type: "map",
    motion: "The whole Nile basin and the Red Sea.",
    cues: [
      { word: "Ethiopia", action: "dam marker on the Blue Nile" },
      { word: "Suez", action: "shipping line through the canal, then a red flash in the Red Sea" },
    ],
    year: [{ at: "^+0.3", value: 2026 }],
    map: {
      id: "MAP-23",
      meridian: 35,
      camera: [{ at: "^", center: [35, 15.5], zoom: 1.0 }, { at: "$", center: [35, 16], zoom: 1.06 }],
      states: [
        {
          at: "^",
          layers: [
            { territory: "sudan_modern", fill: MUTED },
            { territory: "south_sudan_modern", fill: "#C9B48A" },
            { territory: "ethiopia_modern", fill: OLIVE },
            { territory: "egypt_modern", fill: TERRA },
          ],
        },
      ],
      lines: [
        { id: "white", style: "river", path: WHITE_NILE, at: "^+0.3", duration: 1.4 },
        { id: "blue", style: "river", path: BLUE_NILE, at: "^+0.5", duration: 1.2 },
        { id: "main", style: "river", path: [...NILE_SUDAN, ...NILE_NUBIA.slice(1), ...NILE_EGYPT.slice(1)], at: "^+1.6", duration: 1.6 },
        { id: "rosetta", style: "river", path: ROSETTA, at: "^+3.2", duration: 0.4 },
        { id: "damietta", style: "river", path: DAMIETTA, at: "^+3.2", duration: 0.4 },
        {
          id: "shipping", style: "trade", at: "@Suez", duration: 2,
          path: [[51, 12.6], [45, 12.2], [43.4, 12.6], [41, 16], [38, 21], [35.5, 25.5], [33.6, 28], [32.55, 29.95], [32.3, 31.3], [29.5, 33.4]],
          dots: { at: "@Suez+1", count: 3, period: 8 },
        },
      ],
      markers: [
        { id: "gerd", label: "Ethiopian dam", lonlat: [35.09, 11.21], at: "@Ethiopia", kind: "dot", pulse: true, labelSide: "right" },
        { id: "redsea", lonlat: [42.4, 14.6], at: "@Suez+2.2", kind: "dot", flashAt: "@Suez+2.2" },
      ],
      regionLabels: [
        { text: "Egypt", lonlat: [28.6, 26.2], at: "^+0.4", size: 36 },
        { text: "Sudan", lonlat: [29.2, 15.6], at: "^+0.6", size: 32, tone: "dark" },
        { text: "Ethiopia", lonlat: [39.6, 8.2], at: "^+0.8", size: 32 },
      ],
      seaLabels: [{ text: "RED SEA", lonlat: [38.6, 19.6], size: 20 }],
    },
  },
  {
    id: "S58", part: "MODERN EGYPT", assets: ["IMG 034"], type: "image", image: "images/034.jpg",
    motion: "Slow zoom out from the museum to the pyramids. Fade to black 1.5 s after the voiceover ends.",
    kenBurns: kb([1.45, 0.55, 0.55], [1.06, 0.4, 0.5]),
  },
];
