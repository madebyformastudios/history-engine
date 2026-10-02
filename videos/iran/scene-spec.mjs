// Scene-by-scene spec for "The ENTIRE History of Iran", generated from DRAAIBOEK.md (shot list) by
// the runbook builder; maps below are written by hand. scripts/build-scenes.mjs resolves it into data/scenes.json.
// Every scene is a multi-shot scene (`type: "shots"`): each shot starts on a cue word ("@word") and is an
// image with its own camera move or a map. Time strings: "^" scene start, "@word+0.4" offset from a word.

const TERRA = "terracotta";
const OLIVE = "olive";
const RED = "deepRed";
const OCHRE = "ochre";
const MUTED = "#A8946C"; // neighbours that are not part of the story
const BLUE = "deepBlue";

/** Time `d` seconds after base time string `t` ("^" or "@word"). */
const o = (t, d) => (d ? `${t}${d >= 0 ? "+" : ""}${d}` : t);
const L = (territory, fill, opacity = 0.8) => ({ territory, fill, opacity });
const city = (id, label, lonlat, at, extra = {}) => ({ id, label, lonlat, at, kind: "city", ...extra });
const dot = (id, label, lonlat, at, extra = {}) => ({ id, label, lonlat, at, kind: "dot", ...extra });

// places [lon, lat]
const P = {
  susa: [48.25, 32.19], anshan: [52.4, 29.97], ecbatana: [48.5, 34.8], nineveh: [43.15, 36.36], babylon: [44.42, 32.54],
  pasargadae: [53.17, 30.2], persepolis: [52.89, 29.93], sardis: [28.04, 38.49], behistun: [47.44, 34.39], memphis: [31.25, 29.85],
  athens: [23.73, 37.98], marathon: [23.97, 38.15], thermopylae: [22.54, 38.8], salamis: [23.48, 37.95], plataea: [23.27, 38.21],
  granicus: [27.3, 40.3], issus: [36.2, 36.84], gaugamela: [43.4, 36.4], ctesiphon: [44.58, 33.09], carrhae: [39.03, 36.87],
  edessa: [38.79, 37.15], naqsh: [52.87, 29.99], jerusalem: [35.23, 31.78], constantinople: [28.98, 41.01], alexandria: [29.92, 31.2],
  qadisiyyah: [44.3, 31.7], nahavand: [48.37, 34.19], merv: [61.83, 37.66], baghdad: [44.37, 33.31], nishapur: [58.8, 36.21],
  otrar: [68.3, 42.85], bukhara: [64.42, 39.77], samarkand: [66.97, 39.65], isfahan: [51.67, 32.65], tabriz: [46.29, 38.08],
  chaldiran: [44.0, 39.1], hormuz: [56.46, 27.1], delhi: [77.2, 28.6], tehran: [51.39, 35.69], masjed: [49.3, 31.94],
  tiflis: [44.8, 41.7], baku: [49.87, 40.41], erivan: [44.5, 40.18], khorramshahr: [48.18, 30.44], basra: [47.8, 30.5],
  beirut: [35.5, 33.89], damascus: [36.3, 33.51], sanaa: [44.2, 15.35], fordow: [50.99, 34.88], natanz: [51.92, 33.72],
  minab: [57.08, 27.15], telaviv: [34.78, 32.08], riyadh: [46.7, 24.7], doha: [51.53, 25.29], kerman: [57.08, 30.28],
  mashhad: [59.6, 36.3], herat: [62.2, 34.35], kandahar: [65.7, 31.6], baghdad2: [44.37, 33.31], dubai: [55.3, 25.27],
};

// cameras
const WORLD = { center: [46, 31], zoom: 1 };
const IRAN = { center: [54, 32.5], zoom: 2.2 };
const WEST = { center: [40, 34], zoom: 1.7 };
const MESO = { center: [45.5, 33.5], zoom: 3 };
const GREECE = { center: [25.5, 38.5], zoom: 4.2 };
const GULF = { center: [53, 28], zoom: 2.6 };

const MAPS = {
  "MAP-01": (t) => ({
    camera: [{ at: t, center: [48, 30], zoom: 1.35 }, { at: o(t, 6), ...WORLD }],
    states: [{ at: t, layers: [] }, { at: o(t, 0.3), duration: 2.2, mode: "grow", origin: P.persepolis, layers: [L("achaemenid_bc500", TERRA)] }],
    markers: [city("persepolis1", "Persepolis", P.persepolis, o(t, 1.4))],
    regionLabels: [{ text: "ACHAEMENID EMPIRE", lonlat: [52, 35.5], at: o(t, 1.6), size: 40, tone: "dark" }],
  }),
  "MAP-02": (t) => ({
    camera: [{ at: t, ...WORLD, zoom: 1.2 }, { at: o(t, 6), ...IRAN }],
    states: [{ at: t, layers: [L("iran_2010", TERRA, 0.35)] }],
    regionLabels: [
      { text: "ZAGROS", lonlat: [48.5, 33], at: o(t, 0.8), size: 26, tone: "dark" },
      { text: "ALBORZ", lonlat: [52.5, 36.4], at: o(t, 1.4), size: 26, tone: "dark" },
      { text: "DASHT-E KAVIR", lonlat: [54.8, 34.4], at: o(t, 2), size: 22, tone: "dark" },
      { text: "DASHT-E LUT", lonlat: [58.5, 30.5], at: o(t, 2.6), size: 22, tone: "dark" },
      { text: "MESOPOTAMIA", lonlat: [44, 32.4], at: o(t, 3.2), size: 26, tone: "dark" },
      { text: "CENTRAL ASIA", lonlat: [63, 40.5], at: o(t, 3.6), size: 26, tone: "dark" },
      { text: "INDIA", lonlat: [71, 27.5], at: o(t, 4), size: 26, tone: "dark" },
    ],
    seaLabels: [{ text: "CASPIAN SEA", lonlat: [51, 41.5], size: 20 }, { text: "PERSIAN GULF", lonlat: [51.5, 27.2], size: 20 }],
  }),
  "MAP-03": (t) => ({
    camera: [{ at: t, center: [50, 34], zoom: 2.4 }, { at: o(t, 8), center: [50, 33], zoom: 2.7 }],
    states: [{ at: t, layers: [L("elam_bc1000", OCHRE)] }],
    markers: [city("susa3", "Susa", P.susa, o(t, 0.4))],
    lines: [
      { id: "mig1", style: "arrow", path: [[62, 41], [58, 38.5], [52, 36.5], [48.5, 35]], at: o(t, 0.6), duration: 2.4, smooth: true },
      { id: "mig2", style: "arrow", path: [[64, 39], [60, 34], [56, 31.5], [53, 30]], at: o(t, 1.2), duration: 2.4, smooth: true },
    ],
    regionLabels: [
      { text: "ELAM", lonlat: [49.5, 31.2], at: o(t, 0.3), size: 30, tone: "dark" },
      { text: "MEDES", lonlat: [48.2, 35.6], at: "@Medes", size: 32, tone: "dark" },
      { text: "PERSIS", lonlat: [53, 29.2], at: "@Persians", size: 32, tone: "dark" },
    ],
  }),
  "MAP-04": (t) => ({
    camera: [{ at: t, center: [46, 35], zoom: 2.2 }, { at: o(t, 6), center: [48, 34], zoom: 2.1 }],
    states: [
      { at: t, layers: [L("babylonia_bc550", MUTED, 0.6), L("lydia_bc560", MUTED, 0.6)] },
      { at: o(t, 0.4), duration: 1.6, mode: "grow", origin: P.ecbatana, layers: [L("babylonia_bc550", MUTED, 0.6), L("lydia_bc560", MUTED, 0.6), L("media_bc585", OLIVE), L("persis_bc559", TERRA, 0.75)] },
    ],
    markers: [city("ecb4", "Ecbatana", P.ecbatana, o(t, 0.8)), city("nin4", "Nineveh", P.nineveh, t, { crossAt: o(t, 0.2), labelSide: "left" })],
    regionLabels: [{ text: "MEDIA", lonlat: [52, 36.6], at: o(t, 1), size: 36, tone: "dark" }, { text: "PERSIS", lonlat: [53, 29], at: o(t, 1.4), size: 24, tone: "dark" }],
  }),
  "MAP-05": (t) => ({
    camera: [{ at: t, center: [48, 34], zoom: 2.3 }, { at: o(t, 7), center: [44, 36], zoom: 1.5 }],
    states: [
      { at: t, layers: [L("media_bc585", OLIVE), L("lydia_bc560", MUTED, 0.6), L("babylonia_bc550", MUTED, 0.6), L("persis_bc559", TERRA)] },
      { at: o(t, 0.2), duration: 1.4, mode: "grow", origin: P.ecbatana, layers: [L("lydia_bc560", MUTED, 0.6), L("babylonia_bc550", MUTED, 0.6), L("persis_bc559", TERRA), L("media_bc585", TERRA)] },
      { at: "@Lydia", duration: 1.2, mode: "grow", origin: P.sardis, layers: [L("babylonia_bc550", MUTED, 0.6), L("persis_bc559", TERRA), L("media_bc585", TERRA), L("lydia_bc560", TERRA)] },
      { at: "@Central", duration: 1.6, mode: "grow", origin: P.pasargadae, layers: [L("babylonia_bc550", MUTED, 0.6), L("achaemenid_bc500", TERRA)] },
    ],
    markers: [city("pas5", "Pasargadae", P.pasargadae, t), city("sar5", "Sardis", P.sardis, "@Lydia", { battleAt: "@Lydia" })],
  }),
  "MAP-06": (t) => ({
    camera: [{ at: t, center: [40, 31], zoom: 1.8 }, { at: o(t, 5), center: [36, 30], zoom: 2.1 }],
    states: [
      { at: t, layers: [L("persis_bc559", TERRA), L("media_bc585", TERRA), L("lydia_bc560", TERRA), L("babylonia_bc550", TERRA)] },
      { at: "@Egypt", duration: 1.4, mode: "grow", origin: P.memphis, layers: [L("persis_bc559", TERRA), L("media_bc585", TERRA), L("lydia_bc560", TERRA), L("babylonia_bc550", TERRA), L("achaemenid_bc500", TERRA)] },
    ],
    lines: [{ id: "camb", style: "arrow", path: [[44.4, 32.5], [38, 32.5], [34.5, 31], [31.3, 30]], at: o(t, 0.2), duration: 1.4, smooth: true }],
    markers: [city("mem6", "Memphis", P.memphis, o(t, 1.2), { battleAt: "@Egypt" })],
  }),
  "MAP-07": (t) => ({
    camera: [{ at: t, ...WORLD, zoom: 1.15 }, { at: o(t, 8), center: [42, 34], zoom: 1.6 }],
    states: [{ at: t, layers: [L("achaemenid_bc500", TERRA, 0.75)] }],
    lines: [{ id: "royalroad", style: "trade", path: [P.sardis, [32.5, 39], [37, 38.6], [40.2, 37.9], [43.2, 36.4], [45.5, 34.6], [47.4, 33.4], P.susa], at: "@royal", duration: 3, smooth: true, dots: { at: o("@royal", 2.5), count: 3, period: 6, loop: true } }],
    markers: [city("sar7", "Sardis", P.sardis, o(t, 0.3)), city("sus7", "Susa", P.susa, o(t, 0.3)), city("per7", "Persepolis", P.persepolis, o(t, 0.6))],
    regionLabels: [{ text: "SATRAPIES", lonlat: [55, 37], at: "@satrapies", size: 30, tone: "dark" }],
  }),
  "MAP-08": (t) => ({
    camera: [{ at: t, ...GREECE, zoom: 3 }, { at: o(t, 6), ...GREECE }],
    states: [{ at: t, layers: [L("greek_bc500", OLIVE), L("achaemenid_bc500", TERRA)] }],
    markers: [
      city("ath8", "Athens", P.athens, o(t, 0.3), { labelSide: "bottom" }),
      dot("mar8", "Marathon", P.marathon, "@Marathon", { battleAt: "@Marathon" }),
      dot("the8", "Thermopylae", P.thermopylae, "@Thermopylae", { battleAt: "@Thermopylae", labelSide: "left" }),
      dot("sal8", "Salamis", P.salamis, "@Salamis", { battleAt: "@Salamis", labelSide: "left" }),
      dot("pla8", "Plataea", P.plataea, "@beaten", { battleAt: "@beaten", labelSide: "top" }),
    ],
    lines: [{ id: "xerx", style: "arrow", path: [[28, 40.5], [26.2, 40.9], [24, 40.5], [22.8, 39.5], [22.6, 38.9]], at: "@Xerxes", duration: 2.2, smooth: true }],
  }),
  "MAP-09": (t) => ({
    camera: [{ at: t, center: [38, 35], zoom: 1.5 }, { at: o(t, 7), center: [45, 33], zoom: 1.4 }],
    states: [{ at: t, layers: [L("achaemenid_bc500", TERRA)] }, { at: "@Persepolis", duration: 1.6, mode: "grow", origin: P.granicus, layers: [L("alexander_bc323", OLIVE)] }],
    lines: [{ id: "alex", style: "route", path: [[26.5, 40.3], P.granicus, [32, 38.5], P.issus, [35, 33], [31, 30.6], [35.5, 33.5], [40, 36.5], P.gaugamela, P.babylon, P.susa, P.persepolis], at: "@crossed", duration: 6, smooth: true }],
    markers: [
      dot("iss9", "Issus", P.issus, "@Issus", { battleAt: "@Issus", labelSide: "left" }),
      dot("gau9", "Gaugamela", P.gaugamela, "@Gaugamela", { battleAt: "@Gaugamela" }),
      city("per9", "Persepolis", P.persepolis, "@Persepolis", { flashAt: "@Persepolis" }),
    ],
  }),
  "MAP-10": (t) => ({
    camera: [{ at: t, ...WORLD, zoom: 1.3 }, { at: o(t, 4), center: [50, 33], zoom: 1.6 }],
    states: [{ at: t, layers: [L("alexander_bc323", OLIVE)] }, { at: o(t, 0.4), duration: 1.4, layers: [L("seleucid_bc300", OCHRE)] }],
    regionLabels: [{ text: "SELEUCID EMPIRE", lonlat: [52, 33.5], at: o(t, 1), size: 34, tone: "dark" }],
  }),
  "MAP-11": (t) => ({
    camera: [{ at: t, center: [55, 35], zoom: 2 }, { at: o(t, 7), center: [50, 34], zoom: 1.6 }],
    states: [
      { at: t, layers: [L("seleucid_bc200", OCHRE, 0.7), L("parthia_bc200", TERRA)] },
      { at: o(t, 0.5), duration: 2.2, mode: "grow", origin: [58, 37.5], layers: [L("parthian_bc1", TERRA)] },
    ],
    markers: [city("cte11", "Ctesiphon", P.ctesiphon, "@Ctesiphon", { pulse: true, labelSide: "left" })],
    regionLabels: [{ text: "PARTHIA", lonlat: [56, 36], at: t, size: 34, tone: "dark" }],
  }),
  "MAP-12": (t) => ({
    camera: [{ at: t, center: [41, 35], zoom: 2 }, { at: o(t, 6), center: [40, 36], zoom: 2.6 }],
    states: [{ at: t, layers: [L("roman_bc100", OLIVE), L("parthian_bc1", TERRA)] }],
    lines: [{ id: "crassus", style: "arrow", path: [[36.2, 36.2], [37.5, 36.6], [39, 36.85]], at: o(t, 0.4), duration: 2, smooth: true }],
    markers: [dot("car12", "Carrhae", P.carrhae, o(t, 1.2), { battleAt: o(t, 2.2), labelSide: "bottom" })],
    regionLabels: [{ text: "ROME", lonlat: [34, 37.5], at: t, size: 30, tone: "dark" }, { text: "PARTHIA", lonlat: [46, 34.5], at: t, size: 30, tone: "dark" }],
  }),
  "MAP-13": (t) => ({
    camera: [{ at: t, center: [40, 35], zoom: 1.8 }, { at: o(t, 6), center: [42, 34.5], zoom: 2.2 }],
    states: [{ at: t, layers: [L("roman_bc1", OLIVE), L("parthian_bc1", TERRA)] }],
    markers: [city("cte13", "Ctesiphon", P.ctesiphon, t, { flashAt: o(t, 2), labelSide: "bottom" })],
    regionLabels: [{ text: "ARMENIA", lonlat: [44.5, 40.2], at: "@Armenia", size: 24, tone: "dark" }],
  }),
  "MAP-14": (t) => ({
    camera: [{ at: t, center: [48, 33], zoom: 1.5 }, { at: o(t, 5), center: [50, 33], zoom: 1.7 }],
    states: [{ at: t, layers: [L("roman_bc1", OLIVE, 0.6)] }, { at: o(t, 0.2), duration: 1.6, mode: "grow", origin: P.persepolis, layers: [L("roman_bc1", OLIVE, 0.6), L("sasanian_500", TERRA)] }],
    markers: [dot("ede14", "Edessa", P.edessa, o(t, 0.8), { battleAt: o(t, 1) }), city("naq14", "Naqsh-e Rostam", P.naqsh, o(t, 1.2), { labelSide: "bottom" })],
    regionLabels: [{ text: "SASANIAN EMPIRE", lonlat: [55, 34], at: o(t, 1.4), size: 34, tone: "dark" }],
  }),
  "MAP-15": (t) => ({
    camera: [{ at: t, center: [40, 34], zoom: 1.5 }, { at: o(t, 8), center: [38, 35], zoom: 1.6 }],
    states: [
      { at: t, layers: [L("byzantine_600", OLIVE), L("sasanian_600", TERRA)] },
      { at: "@Jerusalem", duration: 1.2, mode: "grow", origin: P.jerusalem, layers: [L("byzantine_600", OLIVE), L("sasanian_600", TERRA), L("babylonia_bc550", TERRA, 0.7)] },
    ],
    markers: [
      city("jer15", "Jerusalem", P.jerusalem, "@Jerusalem", { flashAt: "@Jerusalem", labelSide: "left" }),
      city("ale15", "Alexandria", P.alexandria, "@Egypt", { flashAt: "@Egypt", labelSide: "bottom" }),
      city("con15", "Constantinople", P.constantinople, "@Constantinople", { pulse: true }),
    ],
    lines: [
      { id: "kh1", style: "arrow", path: [[44, 33], [38, 34], [35.3, 31.9]], at: "@Jerusalem", duration: 1.4, smooth: true },
      { id: "kh2", style: "arrow", path: [[35, 31.5], [33, 30.8], [30.5, 30.8]], at: "@Egypt", duration: 1.2, smooth: true },
      { id: "kh3", style: "arrow", path: [[41, 38], [36, 39.5], [32, 40.4], [29.4, 40.9]], at: "@Constantinople", duration: 1.6, smooth: true },
    ],
  }),
  "MAP-16": (t) => ({
    camera: [{ at: t, center: [46, 31], zoom: 1.8 }, { at: o(t, 9), center: [53, 34], zoom: 1.7 }],
    states: [{ at: t, layers: [L("sasanian_600", TERRA)] }, { at: "@Nahavand", duration: 3, mode: "grow", origin: P.qadisiyyah, layers: [L("abbasid_800", OLIVE)] }],
    lines: [
      { id: "ar1", style: "arrow", path: [[42, 28.5], [43.5, 30.5], P.qadisiyyah], at: o(t, 0.2), duration: 1.4, smooth: true },
      { id: "ar2", style: "arrow", path: [P.ctesiphon, [46.5, 33.8], P.nahavand], at: "@Ctesiphon", duration: 1.4, smooth: true },
      { id: "ar3", style: "arrow", path: [P.nahavand, [53, 35.5], [58, 36.3], P.merv], at: "@Merv", duration: 1.6, smooth: true },
    ],
    markers: [
      dot("qad16", "al-Qadisiyyah", P.qadisiyyah, "@al-Qadisiyyah", { battleAt: "@al-Qadisiyyah", labelSide: "bottom" }),
      city("cte16", "Ctesiphon", P.ctesiphon, "@Ctesiphon", { crossAt: o("@Ctesiphon", 0.4), labelSide: "left" }),
      dot("nah16", "Nahavand", P.nahavand, "@Nahavand", { battleAt: "@Nahavand" }),
      city("mer16", "Merv", P.merv, "@Merv"),
    ],
  }),
  "MAP-17": (t) => ({
    camera: [{ at: t, center: [48, 32], zoom: 1.4 }, { at: o(t, 6), center: [46, 33.5], zoom: 2.4 }],
    states: [{ at: t, layers: [L("abbasid_800", OLIVE)] }],
    markers: [city("bag17", "Baghdad", P.baghdad, "@Baghdad", { pulse: true, labelSide: "left" }), dot("cte17", "Ctesiphon (ruins)", P.ctesiphon, "@Baghdad", { labelSide: "bottom" })],
    regionLabels: [{ text: "KHORASAN", lonlat: [60, 36.5], at: "@Khorasan", size: 30, tone: "dark" }],
  }),
  "MAP-18": (t) => ({
    camera: [{ at: t, center: [50, 35], zoom: 1.5 }, { at: o(t, 5), center: [47, 35], zoom: 1.6 }],
    states: [{ at: t, layers: [] }, { at: o(t, 0.2), duration: 2, mode: "grow", origin: P.merv, layers: [L("seljuk_1100", OCHRE)] }],
    markers: [city("isf18", "Isfahan", P.isfahan, o(t, 1)), city("bag18", "Baghdad", P.baghdad, "@Baghdad", { labelSide: "left" })],
    regionLabels: [{ text: "SELJUK EMPIRE", lonlat: [52, 37.5], at: o(t, 1.2), size: 32, tone: "dark" }],
  }),
  "MAP-19": (t) => ({
    camera: [{ at: t, center: [60, 38], zoom: 2 }, { at: "@Baghdad", center: [50, 35], zoom: 1.6 }],
    states: [{ at: t, layers: [L("khwarazm_1218", OCHRE)] }],
    lines: [
      { id: "mo1", style: "arrow", path: [[72, 44], P.otrar, P.bukhara, P.merv, P.nishapur], at: o(t, 0.3), duration: 3, smooth: true },
      { id: "mo2", style: "arrow", path: [P.nishapur, [52, 35.5], [47, 34.5], P.baghdad], at: "@Baghdad", duration: 2, smooth: true },
    ],
    markers: [
      city("otr19", "Otrar", P.otrar, o(t, 0.2), { flashAt: o(t, 0.6) }),
      city("nis19", "Nishapur", P.nishapur, "@Nishapur", { crossAt: "@Nishapur", labelSide: "bottom" }),
      city("mer19", "Merv", P.merv, "@Merv", { crossAt: "@Merv" }),
      city("bag19", "Baghdad", P.baghdad, "@Baghdad", { flashAt: o("@Baghdad", 1.6), labelSide: "left" }),
    ],
  }),
  "MAP-20": (t) => ({
    camera: [{ at: t, center: [50, 36], zoom: 1.35 }, { at: o(t, 6), center: [48, 36], zoom: 1.5 }],
    states: [{ at: t, layers: [] }, { at: o(t, 0.2), duration: 1.8, mode: "grow", origin: P.tabriz, layers: [L("ilkhanate_1300", TERRA)] }],
    markers: [city("tab20", "Tabriz", P.tabriz, o(t, 0.6), { pulse: true })],
    regionLabels: [{ text: "ILKHANATE", lonlat: [55, 34], at: o(t, 1), size: 34, tone: "dark" }],
  }),
  "MAP-21": (t) => ({
    camera: [{ at: t, center: [50, 34], zoom: 1.6 }, { at: o(t, 6), center: [48, 35], zoom: 1.7 }],
    states: [{ at: t, layers: [] }, { at: o(t, 0.2), duration: 1.8, mode: "grow", origin: P.tabriz, layers: [L("safavid_1530", TERRA)] }],
    markers: [city("tab21", "Tabriz", P.tabriz, o(t, 0.4))],
    regionLabels: [{ text: "SAFAVID IRAN", lonlat: [54, 33], at: o(t, 1), size: 34, tone: "dark" }],
  }),
  "MAP-21b": (t) => ({
    camera: [{ at: t, center: [44, 36], zoom: 2 }, { at: o(t, 5), center: [45, 35.5], zoom: 2.3 }],
    states: [{ at: t, layers: [L("ottoman_1650", OLIVE), L("safavid_1650", TERRA)] }],
    markers: [dot("cha21", "Chaldiran", P.chaldiran, t, { battleAt: o(t, 0.3), labelSide: "left" })],
    regionLabels: [{ text: "OTTOMAN EMPIRE", lonlat: [36, 38.5], at: t, size: 28, tone: "dark" }, { text: "BORDER OF 1639", lonlat: [44.5, 33.4], at: o(t, 0.8), size: 18, tone: "dark" }],
  }),
  "MAP-22": (t) => ({
    camera: [{ at: t, center: [66, 30.5], zoom: 1.5 }, { at: o(t, 5), center: [68, 30], zoom: 1.6 }],
    states: [{ at: t, layers: [L("persia_1783", TERRA), L("afghanistan_1783", TERRA, 0.65)] }],
    lines: [{ id: "nader", style: "arrow", path: [P.isfahan, P.kandahar, [69.17, 34.53], [72, 33.6], [74.5, 31.5], [76.98, 29.69], P.delhi], at: o(t, 0.1), duration: 1.8, smooth: true }],
    markers: [city("del22", "Delhi", P.delhi, o(t, 1.6), { flashAt: o(t, 1.9), labelSide: "left" })],
  }),
  "MAP-23": (t) => ({
    camera: [{ at: t, center: [46, 39], zoom: 2.6 }, { at: o(t, 6), center: [46.5, 39.5], zoom: 3.2 }],
    states: [
      { at: t, layers: [L("russia_1815", OLIVE, 0.75), L("persia_1815", TERRA), L("caucasus_lost_1828", TERRA)] },
      { at: o(t, 0.6), duration: 2.2, layers: [L("russia_1815", OLIVE, 0.75), L("persia_1815", TERRA), L("caucasus_lost_1828", OLIVE, 0.75)] },
    ],
    markers: [city("tif23", "Tiflis", P.tiflis, t), city("eri23", "Erivan", P.erivan, o(t, 0.3)), city("bak23", "Baku", P.baku, o(t, 0.3))],
    lines: [{ id: "aras", style: "river", path: [[43.5, 40.1], [44.6, 39.7], [45.4, 39.3], [46.5, 38.9], [47.5, 39.3], [48.3, 39.7], [48.9, 39.9]], at: "@Aras", duration: 1.4, smooth: true }],
    regionLabels: [{ text: "RUSSIAN EMPIRE", lonlat: [45, 43.4], at: o(t, 0.3), size: 26, tone: "dark" }, { text: "ARAS", lonlat: [46.2, 38.6], at: "@Aras", size: 18, tone: "dark" }],
  }),
  "MAP-24": (t) => ({
    camera: [{ at: t, ...IRAN, zoom: 2 }, { at: o(t, 6), ...IRAN }],
    states: [{ at: t, layers: [L("persia_1900", TERRA, 0.5)] }, { at: o(t, 0.3), duration: 1.4, layers: [L("persia_1900", TERRA, 0.5), L("sphere_russia_1907", OLIVE), L("sphere_britain_1907", RED)] }],
    regionLabels: [{ text: "RUSSIAN ZONE", lonlat: [51, 35.8], at: o(t, 0.8), size: 26, tone: "dark" }, { text: "BRITISH ZONE", lonlat: [59.5, 28.5], at: o(t, 1.2), size: 22, tone: "dark" }],
    markers: [dot("mis24", "Masjed Soleyman", P.masjed, o(t, 2), { pulse: true, labelSide: "left" })],
  }),
  "MAP-25": (t) => ({
    camera: [{ at: t, ...IRAN, zoom: 1.9 }, { at: o(t, 5), ...IRAN, zoom: 2.1 }],
    states: [{ at: t, layers: [L("iran_1938", TERRA)] }],
    lines: [
      { id: "sov", style: "arrow", path: [[47, 41.5], [47.5, 39], [49, 37], [51.2, 35.8]], at: o(t, 0.2), duration: 2, smooth: true },
      { id: "sov2", style: "arrow", path: [[58.5, 39], [57.5, 37.5], [54, 36.3]], at: o(t, 0.4), duration: 2, smooth: true },
      { id: "brit", style: "arrow", path: [[47.5, 30.3], [48.5, 31.5], [49.5, 33.5]], at: o(t, 0.6), duration: 2, smooth: true },
      { id: "brit2", style: "arrow", path: [[45.6, 34], [47, 34.3], [48.5, 34.7]], at: o(t, 0.8), duration: 2, smooth: true },
    ],
    markers: [city("teh25", "Tehran", P.tehran, t)],
  }),
  "MAP-26": (t) => ({
    camera: [{ at: t, center: [48, 32], zoom: 2.4 }, { at: o(t, 7), center: [50, 29], zoom: 2.2 }],
    states: [{ at: t, layers: [L("iraq_2010", OLIVE), L("iran_2010", TERRA)] }],
    lines: [
      { id: "irq", style: "arrow", path: [[47, 31], [48.2, 31.1], [48.8, 31.4]], at: o(t, 0.2), duration: 1.6, smooth: true },
      { id: "irq2", style: "arrow", path: [[47.5, 30.4], [48.2, 30.45]], at: o(t, 0.4), duration: 1.2 },
      { id: "irn", style: "arrow", path: [[48.4, 30.6], [47.6, 30.5]], at: "@1982", duration: 1.4 },
    ],
    markers: [city("kho26", "Khorramshahr", P.khorramshahr, o(t, 0.4), { battleAt: o(t, 1), labelSide: "bottom" }), city("bas26", "Basra", P.basra, o(t, 0.4), { labelSide: "left" })],
  }),
  "MAP-27": (t) => ({
    camera: [{ at: t, center: [45, 30], zoom: 1.5 }, { at: o(t, 6), center: [44, 29], zoom: 1.6 }],
    states: [{ at: t, layers: [L("iran_2010", TERRA)] }],
    lines: [
      { id: "al1", style: "trade", path: [P.tehran, [44, 34], P.damascus, P.beirut], at: o(t, 0.3), duration: 2, smooth: true },
      { id: "al2", style: "trade", path: [P.tehran, [48, 30], [46, 22], P.sanaa], at: o(t, 0.8), duration: 2, smooth: true },
    ],
    markers: [city("teh27", "Tehran", P.tehran, t), dot("bei27", "Hezbollah", P.beirut, o(t, 2), { labelSide: "left" }), dot("dam27", "Syria", P.damascus, o(t, 1.8), { labelSide: "bottom" }), dot("bag27", "Iraqi militias", P.baghdad, o(t, 1.4)), dot("san27", "Houthis", P.sanaa, o(t, 2.6), { labelSide: "left" })],
  }),
  "MAP-28": (t) => ({
    camera: [{ at: t, ...IRAN, zoom: 2.1 }, { at: o(t, 6), center: [51.5, 34], zoom: 3.2 }],
    states: [{ at: t, layers: [L("iran_2010", TERRA)] }],
    markers: [
      dot("for28", "Fordow", P.fordow, "@Fordow", { flashAt: "@Fordow" }),
      dot("nat28", "Natanz", P.natanz, "@Natanz", { flashAt: "@Natanz" }),
      city("isf28", "Isfahan", P.isfahan, "@Isfahan", { flashAt: "@Isfahan", labelSide: "bottom" }),
      city("teh28", "Tehran", P.tehran, o(t, 0.3), { flashAt: o(t, 0.6) }),
    ],
  }),
  "MAP-29": (t) => ({
    camera: [{ at: t, ...IRAN, zoom: 2 }, { at: o(t, 6), ...IRAN, zoom: 2.2 }],
    states: [{ at: t, layers: [L("iran_2010", TERRA)] }],
    markers: [city("teh29", "Tehran", P.tehran, t, { flashAt: o(t, 0.3) }), city("min29", "Minab", P.minab, "@Minab", { flashAt: "@Minab", labelSide: "bottom" })],
  }),
  "MAP-29b": (t) => ({
    camera: [{ at: t, center: [47, 29], zoom: 1.6 }, { at: o(t, 5), ...GULF }],
    states: [{ at: t, layers: [L("iran_2010", TERRA), L("israel_2010", OLIVE), L("saudi_2010", MUTED, 0.6), L("gulf_2010", MUTED, 0.6)] }],
    lines: [
      { id: "mis1", style: "arrow", path: [P.tehran, [44, 34.5], P.telaviv], at: o(t, 0.2), duration: 1.4, smooth: true },
      { id: "mis2", style: "arrow", path: [[52, 29], P.doha], at: o(t, 0.5), duration: 1 },
      { id: "mis3", style: "arrow", path: [[54.5, 27.8], P.dubai], at: o(t, 0.7), duration: 1 },
      { id: "mis4", style: "arrow", path: [[49, 30], P.riyadh], at: o(t, 0.9), duration: 1.2 },
    ],
    markers: [dot("hor29", "Strait of Hormuz", [56.4, 26.6], "@Strait", { crossAt: o("@Strait", 0.3), labelSide: "bottom" })],
  }),
};

/** A map shot: map `id` built at base time `t`. */
const M = (id, t) => ({ map: { id, ...MAPS[id](t) } });
const kb = (from, to, extra = {}) => ({ from: { scale: from[0], x: from[1], y: from[2] }, to: { scale: to[0], x: to[1], y: to[2] }, ...extra });

export const meta = {
  id: "IranHistory",
  title: "The ENTIRE History of Iran in 16 Minutes",
  fps: 30,
  width: 1920,
  height: 1080,
  audio: "audio/voiceover.mp3",
  transitionFrames: 10,
};

export const overlay = { dust: 0.45, parchment: 0.22, grain: 0.07, vignette: 0.42 };

// One projection for all maps: Greece to India, Caspian to the Gulf.
export const map = { extent: [[16, 12], [78, 48]], rotate: [-47, 0], parallels: [25, 42] };

export const scenes = [
  // ---------------- PART: BEFORE PERSIA ----------------
  {
    id: "S01", part: "BEFORE PERSIA", assets: ["IMG 001", "MAP-01", "IMG 078"], type: "shots",
    motion: "start: IMG 001, slow push toward the throne | @Egypt: MAP-01, empire flashes on, camera pulls out | @Today: IMG 078, slow pan across Tehran",
    titles: [{ text: "IRAN", at: "@Iran", style: "title" }],
    shots: [
      { at: "^", image: "images/001.jpg", kenBurns: kb([1.12, 0.5, 0.5], [1.3, 0.62, 0.58]) },
      { at: "@Egypt", ...M("MAP-01", "@Egypt") },
      { at: "@Today", image: "images/078.jpg", kenBurns: kb([1.35, 0.33, 0.42], [1.35, 0.67, 0.42]) },
    ],
  },
  {
    id: "S02", part: "BEFORE PERSIA", assets: ["MAP-02", "IMG 002"], type: "shots",
    motion: "start: MAP-02, relief map, mountains and deserts labelled | @between: IMG 002, slow pan across the plateau | @army: IMG 002, new camera move on another part of the image",
    shots: [
      { at: "^", ...M("MAP-02", "^") },
      { at: "@between", image: "images/002.jpg", kenBurns: kb([1.35, 0.33, 0.5], [1.35, 0.67, 0.5]) },
      { at: "@army", image: "images/002.jpg", kenBurns: kb([1.42, 0.32, 0.5], [1.55, 0.35, 0.5]) },
    ],
  },
  {
    id: "S03", part: "BEFORE PERSIA", assets: ["IMG 003", "IMG 004", "PHOTO-01"], type: "shots",
    motion: "start: IMG 003, push in on the scribes | @capital: IMG 003, new camera move on another part of the image | @people: IMG 003, new camera move on another part of the image | @Hammurabi's: IMG 004, pan following the stone | @stone: PHOTO-01, slow tilt up the stele",
    shots: [
      { at: "^", image: "images/003.jpg", kenBurns: kb([1.12, 0.5, 0.5], [1.3, 0.62, 0.42]) },
      { at: "@capital", image: "images/003.jpg", kenBurns: kb([1.42, 0.38, 0.5], [1.55, 0.41, 0.5]) },
      { at: "@people", image: "images/003.jpg", kenBurns: kb([1.42, 0.38, 0.54], [1.55, 0.41, 0.54]) },
      { at: "@Hammurabi's", image: "images/004.jpg", kenBurns: kb([1.35, 0.33, 0.58], [1.35, 0.67, 0.58]) },
      { at: "@stone", image: "images/photo-01.jpg", kenBurns: kb([1.3, 0.5, 0.66], [1.3, 0.5, 0.36]) },
    ],
  },
  {
    id: "S04", part: "BEFORE PERSIA", assets: ["MAP-03", "IMG 005"], type: "shots",
    motion: "start: MAP-03, arrows of migrating peoples | @Medes: IMG 005, slow pan across the caravan | @southwest: IMG 005, new camera move on another part of the image",
    shots: [
      { at: "^", ...M("MAP-03", "^") },
      { at: "@Medes", image: "images/005.jpg", kenBurns: kb([1.35, 0.67, 0.5], [1.35, 0.33, 0.5]) },
      { at: "@southwest", image: "images/005.jpg", kenBurns: kb([1.42, 0.32, 0.5], [1.55, 0.35, 0.5]) },
    ],
  },
  {
    id: "S05", part: "BEFORE PERSIA", assets: ["IMG 006", "MAP-04"], type: "shots",
    motion: "start: IMG 006, slow push into the burning gate | @capital: IMG 006, new camera move on another part of the image | @strongest: MAP-04, Media fills in, Persis as vassal",
    year: [{ at: "^+0.3", value: -612 }],
    shots: [
      { at: "^", image: "images/006.jpg", kenBurns: kb([1.12, 0.5, 0.5], [1.3, 0.5, 0.42]) },
      { at: "@capital", image: "images/006.jpg", kenBurns: kb([1.42, 0.32, 0.46], [1.55, 0.35, 0.46]) },
      { at: "@strongest", ...M("MAP-04", "@strongest") },
    ],
  },
  {
    id: "S06", part: "BEFORE PERSIA", assets: ["IMG 007", "MAP-05"], type: "shots",
    motion: "start: IMG 007, push in on Cyrus | @Within: MAP-05, conquests grow one by one on cue | @Turkey: MAP-05, camera moves to the next area",
    year: [{ at: "^+0.3", value: -550 }],
    titles: [{ text: "CYRUS THE GREAT", at: "@Cyrus", style: "name" }],
    shots: [
      { at: "^", image: "images/007.jpg", kenBurns: kb([1.12, 0.5, 0.5], [1.3, 0.38, 0.5]) },
      { at: "@Within", ...M("MAP-05", "@Within") },
      { at: "@Turkey", ...M("MAP-05", "@Turkey") },
    ],
  },
  {
    id: "S07", part: "BEFORE PERSIA", assets: ["IMG 008", "PHOTO-02", "IMG 009"], type: "shots",
    motion: "start: IMG 008, pan along the gate | @cylinder: PHOTO-02, slow push | @chosen: PHOTO-02, new camera move on another part of the image | @Jews: IMG 009, pan with the exiles | @called: IMG 009, new camera move on another part of the image | @propaganda: IMG 008, second move: crowds detail | @real: IMG 008, new camera move on another part of the image",
    year: [{ at: "^+0.3", value: -539 }],
    shots: [
      { at: "^", image: "images/008.jpg", kenBurns: kb([1.35, 0.33, 0.42], [1.35, 0.67, 0.42]) },
      { at: "@cylinder", image: "images/photo-02.jpg", kenBurns: kb([1.02, 0.5, 0.5], [1.3, 0.5, 0.42]) },
      { at: "@chosen", image: "images/photo-02.jpg", kenBurns: kb([1.42, 0.38, 0.54], [1.55, 0.41, 0.54]) },
      { at: "@Jews", image: "images/009.jpg", kenBurns: kb([1.35, 0.33, 0.5], [1.35, 0.67, 0.5]) },
      { at: "@called", image: "images/009.jpg", kenBurns: kb([1.42, 0.68, 0.42], [1.55, 0.65, 0.42]) },
      { at: "@propaganda", image: "images/008.jpg", kenBurns: kb([1.42, 0.62, 0.54], [1.55, 0.59, 0.54]) },
      { at: "@real", image: "images/008.jpg", kenBurns: kb([1.42, 0.38, 0.54], [1.55, 0.41, 0.54]) },
    ],
  },
  {
    id: "S08", part: "BEFORE PERSIA", assets: ["IMG 010"], type: "shots",
    motion: "start: IMG 010, CTA: subscribe overlay. Slow push on the tomb",
    cta: { at: "@subscribe", duration: 5.5 },
    shots: [
      { at: "^", image: "images/010.jpg", kenBurns: kb([1.12, 0.5, 0.5], [1.3, 0.38, 0.5]) },
    ],
  },
  // ---------------- PART: THE FIRST WORLD EMPIRE ----------------
  {
    id: "S09", part: "THE FIRST WORLD EMPIRE", assets: ["PHOTO-03", "MAP-06"], type: "shots",
    motion: "start: PHOTO-03, slow push | @nomads: PHOTO-03, new camera move on another part of the image | @Cambyses: MAP-06, arrow into Egypt",
    year: [{ at: "^+0.3", value: -530 }],
    shots: [
      { at: "^", image: "images/photo-03.jpg", kenBurns: kb([1.02, 0.5, 0.5], [1.3, 0.62, 0.5]) },
      { at: "@nomads", image: "images/photo-03.jpg", kenBurns: kb([1.42, 0.32, 0.42], [1.55, 0.35, 0.42]) },
      { at: "@Cambyses", ...M("MAP-06", "@Cambyses") },
    ],
  },
  {
    id: "S10", part: "THE FIRST WORLD EMPIRE", assets: ["IMG 011", "PHOTO-04"], type: "shots",
    motion: "start: IMG 011, start on Darius, pan up to the cliff | @killed: IMG 011, new camera move on another part of the image | @usurper: IMG 011, new camera move on another part of the image | @Behistun: PHOTO-04, slow pan over the relief",
    year: [{ at: "^+0.3", value: -522 }],
    titles: [{ text: "DARIUS I", at: "@Darius", style: "name" }],
    shots: [
      { at: "^", image: "images/011.jpg", kenBurns: kb([1.35, 0.67, 0.5], [1.35, 0.33, 0.5]) },
      { at: "@killed", image: "images/011.jpg", kenBurns: kb([1.42, 0.32, 0.42], [1.55, 0.35, 0.42]) },
      { at: "@usurper", image: "images/011.jpg", kenBurns: kb([1.42, 0.68, 0.5], [1.55, 0.65, 0.5]) },
      { at: "@Behistun", image: "images/photo-04.jpg", kenBurns: kb([1.35, 0.67, 0.58], [1.35, 0.33, 0.58]) },
    ],
  },
  {
    id: "S11", part: "THE FIRST WORLD EMPIRE", assets: ["MAP-07", "IMG 012"], type: "shots",
    motion: "start: MAP-07, satrapies appear, Royal Road draws Sardis to Susa | @River: MAP-07, camera moves to the next area | @tribute: MAP-07, camera moves to the next area | @Relay: IMG 012, quick push on the rider",
    shots: [
      { at: "^", ...M("MAP-07", "^") },
      { at: "@River", ...M("MAP-07", "@River") },
      { at: "@tribute", ...M("MAP-07", "@tribute") },
      { at: "@Relay", image: "images/012.jpg", kenBurns: kb([1.12, 0.5, 0.5], [1.3, 0.5, 0.5]) },
    ],
  },
  {
    id: "S12", part: "THE FIRST WORLD EMPIRE", assets: ["IMG 013", "PHOTO-05"], type: "shots",
    motion: "start: IMG 013, pan across the workers | @tablets: PHOTO-05, slow push on the ruins",
    shots: [
      { at: "^", image: "images/013.jpg", kenBurns: kb([1.4, 0.33, 0.62], [1.4, 0.67, 0.62]) },
      { at: "@tablets", image: "images/photo-05.jpg", kenBurns: kb([1.02, 0.5, 0.5], [1.3, 0.5, 0.42]) },
    ],
  },
  {
    id: "S13", part: "THE FIRST WORLD EMPIRE", assets: ["MAP-08", "IMG 014", "IMG 015"], type: "shots",
    motion: "start: MAP-08, Greece close-up, battle markers on cue | @rebel: MAP-08, camera moves to the next area | @Marathon: IMG 014, fast pan with the charge | @Xerxes: IMG 015, push in from Xerxes to the battle | @fleet: IMG 015, new camera move on another part of the image",
    year: [{ at: "^+0.3", value: -490 }],
    shots: [
      { at: "^", ...M("MAP-08", "^") },
      { at: "@rebel", ...M("MAP-08", "@rebel") },
      { at: "@Marathon", image: "images/014.jpg", kenBurns: kb([1.35, 0.67, 0.5], [1.35, 0.33, 0.5]) },
      { at: "@Xerxes", image: "images/015.jpg", kenBurns: kb([1.12, 0.5, 0.5], [1.3, 0.5, 0.42]) },
      { at: "@fleet", image: "images/015.jpg", kenBurns: kb([1.42, 0.32, 0.54], [1.55, 0.35, 0.54]) },
    ],
  },
  {
    id: "S14", part: "THE FIRST WORLD EMPIRE", assets: ["IMG 015"], type: "shots",
    motion: "start: IMG 015, second move: sinking ships detail | @lost: IMG 015, new camera move on another part of the image",
    shots: [
      { at: "^", image: "images/015.jpg", kenBurns: kb([1.42, 0.62, 0.54], [1.55, 0.59, 0.54]) },
      { at: "@lost", image: "images/015.jpg", kenBurns: kb([1.42, 0.62, 0.5], [1.55, 0.59, 0.5]) },
    ],
  },
  {
    id: "S15", part: "THE FIRST WORLD EMPIRE", assets: ["MAP-09", "IMG 016", "IMG 017"], type: "shots",
    motion: "start: MAP-09, Alexander's route draws on cue | @Asia: MAP-09, camera moves to the next area | @Gaugamela: IMG 016, push toward the chariot | @murdered: IMG 016, new camera move on another part of the image | @Persepolis: IMG 017, slow pull out from the flames",
    year: [{ at: "^+0.3", value: -334 }],
    titles: [{ text: "ALEXANDER THE GREAT", at: "@Alexander", style: "name" }],
    shots: [
      { at: "^", ...M("MAP-09", "^") },
      { at: "@Asia", ...M("MAP-09", "@Asia") },
      { at: "@Gaugamela", image: "images/016.jpg", kenBurns: kb([1.12, 0.5, 0.5], [1.3, 0.62, 0.42]) },
      { at: "@murdered", image: "images/016.jpg", kenBurns: kb([1.42, 0.32, 0.5], [1.55, 0.35, 0.5]) },
      { at: "@Persepolis", image: "images/017.jpg", kenBurns: kb([1.32, 0.62, 0.58], [1.12, 0.5, 0.5]) },
    ],
  },
  {
    id: "S16", part: "THE FIRST WORLD EMPIRE", assets: ["IMG 018"], type: "shots",
    motion: "start: IMG 018, slow push on the couple | @named: IMG 018, new camera move on another part of the image",
    year: [{ at: "^+0.3", value: -323 }],
    shots: [
      { at: "^", image: "images/018.jpg", kenBurns: kb([1.12, 0.5, 0.5], [1.3, 0.62, 0.42]) },
      { at: "@named", image: "images/018.jpg", kenBurns: kb([1.42, 0.32, 0.46], [1.55, 0.35, 0.46]) },
    ],
  },
  // ---------------- PART: ROME'S RIVAL ----------------
  {
    id: "S17", part: "ROME'S RIVAL", assets: ["MAP-10"], type: "shots",
    motion: "start: MAP-10, Seleucid realm fills in",
    shots: [
      { at: "^", ...M("MAP-10", "^") },
    ],
  },
  {
    id: "S18", part: "ROME'S RIVAL", assets: ["IMG 019", "MAP-11"], type: "shots",
    motion: "start: IMG 019, pan with the riders | @province: IMG 019, new camera move on another part of the image | @successors: MAP-11, Parthia grows, Ctesiphon marker | @Mesopotamia: MAP-11, camera moves to the next area",
    year: [{ at: "^+0.3", value: -238 }],
    shots: [
      { at: "^", image: "images/019.jpg", kenBurns: kb([1.35, 0.67, 0.42], [1.35, 0.33, 0.42]) },
      { at: "@province", image: "images/019.jpg", kenBurns: kb([1.42, 0.38, 0.54], [1.55, 0.41, 0.54]) },
      { at: "@successors", ...M("MAP-11", "@successors") },
      { at: "@Mesopotamia", ...M("MAP-11", "@Mesopotamia") },
    ],
  },
  {
    id: "S19", part: "ROME'S RIVAL", assets: ["MAP-12", "IMG 020", "IMG 021"], type: "shots",
    motion: "start: MAP-12, Crassus's route to Carrhae | @Roman: MAP-12, camera moves to the next area | @Carrhae: IMG 020, slow push into the square | @killed: IMG 020, new camera move on another part of the image | @Plutarch: IMG 021, slow push on the actor",
    year: [{ at: "^+0.3", value: -53 }],
    shots: [
      { at: "^", ...M("MAP-12", "^") },
      { at: "@Roman", ...M("MAP-12", "@Roman") },
      { at: "@Carrhae", image: "images/020.jpg", kenBurns: kb([1.12, 0.5, 0.5], [1.3, 0.62, 0.42]) },
      { at: "@killed", image: "images/020.jpg", kenBurns: kb([1.42, 0.62, 0.42], [1.55, 0.59, 0.42]) },
      { at: "@Plutarch", image: "images/021.jpg", kenBurns: kb([1.12, 0.5, 0.5], [1.3, 0.38, 0.42]) },
    ],
  },
  {
    id: "S20", part: "ROME'S RIVAL", assets: ["MAP-13", "IMG 022"], type: "shots",
    motion: "start: MAP-13, frontier, Ctesiphon sack markers | @sacked: IMG 022, pan across the looting",
    shots: [
      { at: "^", ...M("MAP-13", "^") },
      { at: "@sacked", image: "images/022.jpg", kenBurns: kb([1.35, 0.67, 0.58], [1.35, 0.33, 0.58]) },
    ],
  },
  {
    id: "S21", part: "ROME'S RIVAL", assets: ["IMG 023", "IMG 024"], type: "shots",
    motion: "start: IMG 023, push in on the crowning | @founded: IMG 023, new camera move on another part of the image | @Zoroastrianism: IMG 024, slow push on the flame",
    year: [{ at: "^+0.3", value: 224 }],
    shots: [
      { at: "^", image: "images/023.jpg", kenBurns: kb([1.12, 0.5, 0.5], [1.3, 0.62, 0.5]) },
      { at: "@founded", image: "images/023.jpg", kenBurns: kb([1.42, 0.38, 0.5], [1.55, 0.41, 0.5]) },
      { at: "@Zoroastrianism", image: "images/024.jpg", kenBurns: kb([1.12, 0.5, 0.5], [1.3, 0.62, 0.42]) },
    ],
  },
  {
    id: "S22", part: "ROME'S RIVAL", assets: ["IMG 025", "PHOTO-06", "MAP-14"], type: "shots",
    motion: "start: IMG 025, slow push on Valerian kneeling | @Roman: IMG 025, new camera move on another part of the image | @carved: PHOTO-06, slow pan across the relief | @still: MAP-14, Sasanian empire with Edessa and Naqsh-e Rostam",
    year: [{ at: "^+0.3", value: 260 }],
    titles: [{ text: "SHAPUR I", at: "@Shapur", style: "name" }],
    shots: [
      { at: "^", image: "images/025.jpg", kenBurns: kb([1.12, 0.5, 0.5], [1.3, 0.38, 0.42]) },
      { at: "@Roman", image: "images/025.jpg", kenBurns: kb([1.42, 0.38, 0.42], [1.55, 0.41, 0.42]) },
      { at: "@carved", image: "images/photo-06.jpg", kenBurns: kb([1.35, 0.33, 0.5], [1.35, 0.67, 0.5]) },
      { at: "@still", ...M("MAP-14", "@still") },
    ],
  },
  {
    id: "S23", part: "ROME'S RIVAL", assets: ["IMG 026"], type: "shots",
    motion: "start: IMG 026, pan from the scholars to the chess game | @books: IMG 026, new camera move on another part of the image",
    shots: [
      { at: "^", image: "images/026.jpg", kenBurns: kb([1.35, 0.67, 0.42], [1.35, 0.33, 0.42]) },
      { at: "@books", image: "images/026.jpg", kenBurns: kb([1.42, 0.68, 0.46], [1.55, 0.65, 0.46]) },
    ],
  },
  {
    id: "S24", part: "ROME'S RIVAL", assets: ["MAP-15", "IMG 027", "IMG 028"], type: "shots",
    motion: "start: MAP-15, conquests 614, 619, 626 on cue | @armies: MAP-15, camera moves to the next area | @Constantinople: IMG 027, slow push toward the walls | @Heraclius: IMG 028, pan with the cavalry",
    year: [{ at: "^+0.3", value: 602 }],
    shots: [
      { at: "^", ...M("MAP-15", "^") },
      { at: "@armies", ...M("MAP-15", "@armies") },
      { at: "@Constantinople", image: "images/027.jpg", kenBurns: kb([1.12, 0.5, 0.5], [1.3, 0.62, 0.58]) },
      { at: "@Heraclius", image: "images/028.jpg", kenBurns: kb([1.35, 0.33, 0.42], [1.35, 0.67, 0.42]) },
    ],
  },
  {
    id: "S25", part: "ROME'S RIVAL", assets: ["IMG 029"], type: "shots",
    motion: "start: IMG 029, very slow push on the empty throne | @than: IMG 029, new camera move on another part of the image",
    year: [{ at: "^+0.3", value: 628 }],
    shots: [
      { at: "^", image: "images/029.jpg", kenBurns: kb([1.12, 0.5, 0.5], [1.3, 0.5, 0.42]) },
      { at: "@than", image: "images/029.jpg", kenBurns: kb([1.42, 0.32, 0.5], [1.55, 0.35, 0.5]) },
    ],
  },
  // ---------------- PART: CONQUERED, NEVER ERASED ----------------
  {
    id: "S26", part: "CONQUERED, NEVER ERASED", assets: ["MAP-16", "IMG 030", "IMG 031"], type: "shots",
    motion: "start: MAP-16, Arab arrows on cue | @al-Qadisiyyah: IMG 030, pan across the battle | @Yazdegerd: IMG 031, slow push on the lone rider | @than: IMG 031, new camera move on another part of the image",
    year: [{ at: "^+0.3", value: 636 }],
    shots: [
      { at: "^", ...M("MAP-16", "^") },
      { at: "@al-Qadisiyyah", image: "images/030.jpg", kenBurns: kb([1.35, 0.67, 0.58], [1.35, 0.33, 0.58]) },
      { at: "@Yazdegerd", image: "images/031.jpg", kenBurns: kb([1.12, 0.5, 0.5], [1.3, 0.38, 0.42]) },
      { at: "@than", image: "images/031.jpg", kenBurns: kb([1.42, 0.62, 0.54], [1.55, 0.59, 0.54]) },
    ],
  },
  {
    id: "S27", part: "CONQUERED, NEVER ERASED", assets: ["IMG 032"], type: "shots",
    motion: "start: IMG 032, slow pan along the beach | @Christian: IMG 032, new camera move on another part of the image",
    shots: [
      { at: "^", image: "images/032.jpg", kenBurns: kb([1.35, 0.67, 0.42], [1.35, 0.33, 0.42]) },
      { at: "@Christian", image: "images/032.jpg", kenBurns: kb([1.42, 0.68, 0.54], [1.55, 0.65, 0.54]) },
    ],
  },
  {
    id: "S28", part: "CONQUERED, NEVER ERASED", assets: ["MAP-17", "IMG 033"], type: "shots",
    motion: "start: MAP-17, Khorasan pulse, Baghdad and Ctesiphon 35 km | @administration: MAP-17, camera moves to the next area | @brought: MAP-17, camera moves to the next area | @Baghdad: IMG 033, slow aerial push",
    year: [{ at: "^+0.3", value: 750 }],
    shots: [
      { at: "^", ...M("MAP-17", "^") },
      { at: "@administration", ...M("MAP-17", "@administration") },
      { at: "@brought", ...M("MAP-17", "@brought") },
      { at: "@Baghdad", image: "images/033.jpg", kenBurns: kb([1.12, 0.5, 0.5], [1.3, 0.5, 0.58]) },
    ],
  },
  {
    id: "S29", part: "CONQUERED, NEVER ERASED", assets: ["IMG 034"], type: "shots",
    motion: "start: IMG 034, pan across the scholars | @algorithm: IMG 034, new camera move on another part of the image",
    shots: [
      { at: "^", image: "images/034.jpg", kenBurns: kb([1.35, 0.33, 0.5], [1.35, 0.67, 0.5]) },
      { at: "@algorithm", image: "images/034.jpg", kenBurns: kb([1.42, 0.62, 0.42], [1.55, 0.59, 0.42]) },
    ],
  },
  {
    id: "S30", part: "CONQUERED, NEVER ERASED", assets: ["IMG 035", "PHOTO-07"], type: "shots",
    motion: "start: IMG 035, slow push on Ferdowsi | @Shahnameh: PHOTO-07, slow pan over the page | @first: PHOTO-07, new camera move on another part of the image",
    year: [{ at: "^+0.3", value: 1010 }],
    titles: [{ text: "FERDOWSI", at: "@Ferdowsi", style: "name" }],
    shots: [
      { at: "^", image: "images/035.jpg", kenBurns: kb([1.12, 0.5, 0.5], [1.3, 0.5, 0.5]) },
      { at: "@Shahnameh", image: "images/photo-07.jpg", kenBurns: kb([1.35, 0.67, 0.58], [1.35, 0.33, 0.58]) },
      { at: "@first", image: "images/photo-07.jpg", kenBurns: kb([1.42, 0.38, 0.42], [1.55, 0.41, 0.42]) },
    ],
  },
  {
    id: "S31", part: "CONQUERED, NEVER ERASED", assets: ["MAP-18", "IMG 036"], type: "shots",
    motion: "start: MAP-18, Seljuk empire fills in | @sultans: IMG 036, pan with the riders",
    shots: [
      { at: "^", ...M("MAP-18", "^") },
      { at: "@sultans", image: "images/036.jpg", kenBurns: kb([1.35, 0.67, 0.58], [1.35, 0.33, 0.58]) },
    ],
  },
  {
    id: "S32", part: "CONQUERED, NEVER ERASED", assets: ["MAP-19", "IMG 037", "IMG 038"], type: "shots",
    motion: "start: MAP-19, Mongol arrows (reuse Mongol video map) | @Shah: MAP-19, camera moves to the next area | @Nishapur: IMG 037, slow push toward the walls | @Baghdad: IMG 038, pan along the river",
    year: [{ at: "^+0.3", value: 1219 }],
    shots: [
      { at: "^", ...M("MAP-19", "^") },
      { at: "@Shah", ...M("MAP-19", "@Shah") },
      { at: "@Nishapur", image: "images/037.jpg", kenBurns: kb([1.12, 0.5, 0.5], [1.3, 0.38, 0.42]) },
      { at: "@Baghdad", image: "images/038.jpg", kenBurns: kb([1.35, 0.67, 0.5], [1.35, 0.33, 0.5]) },
    ],
  },
  {
    id: "S33", part: "CONQUERED, NEVER ERASED", assets: ["MAP-20", "IMG 039"], type: "shots",
    motion: "start: MAP-20, Ilkhanate fills in, Tabriz | @Persian: IMG 039, slow push on the painters",
    year: [{ at: "^+0.3", value: 1295 }],
    shots: [
      { at: "^", ...M("MAP-20", "^") },
      { at: "@Persian", image: "images/039.jpg", kenBurns: kb([1.12, 0.5, 0.5], [1.3, 0.5, 0.5]) },
    ],
  },
  {
    id: "S34", part: "CONQUERED, NEVER ERASED", assets: ["IMG 040"], type: "shots",
    motion: "start: IMG 040, slow push toward the towers | @against: IMG 040, new camera move on another part of the image",
    year: [{ at: "^+0.3", value: 1387 }],
    shots: [
      { at: "^", image: "images/040.jpg", kenBurns: kb([1.12, 0.5, 0.5], [1.3, 0.5, 0.42]) },
      { at: "@against", image: "images/040.jpg", kenBurns: kb([1.42, 0.62, 0.5], [1.55, 0.59, 0.5]) },
    ],
  },
  // ---------------- PART: SHAHS, SHIA AND SHRINKING BORDERS ----------------
  {
    id: "S35", part: "SHAHS, SHIA AND SHRINKING BORDERS", assets: ["IMG 041", "MAP-21"], type: "shots",
    motion: "start: IMG 041, push in on Ismail | @Safavid: MAP-21, Safavid Iran c. 1510 | @time: MAP-21, camera moves to the next area",
    year: [{ at: "^+0.3", value: 1501 }],
    titles: [{ text: "SHAH ISMAIL I", at: "@Ismail", style: "name" }],
    shots: [
      { at: "^", image: "images/041.jpg", kenBurns: kb([1.12, 0.5, 0.5], [1.3, 0.5, 0.5]) },
      { at: "@Safavid", ...M("MAP-21", "@Safavid") },
      { at: "@time", ...M("MAP-21", "@time") },
    ],
  },
  {
    id: "S36", part: "SHAHS, SHIA AND SHRINKING BORDERS", assets: ["IMG 042", "MAP-21"], type: "shots",
    motion: "start: IMG 042, pan across the cannon line | @crushed: IMG 042, new camera move on another part of the image | @border: MAP-21, second state: border of 1639",
    year: [{ at: "^+0.3", value: 1514 }],
    shots: [
      { at: "^", image: "images/042.jpg", kenBurns: kb([1.35, 0.67, 0.5], [1.35, 0.33, 0.5]) },
      { at: "@crushed", image: "images/042.jpg", kenBurns: kb([1.42, 0.38, 0.46], [1.55, 0.41, 0.46]) },
      { at: "@border", ...M("MAP-21b", "@border") },
    ],
  },
  {
    id: "S37", part: "SHAHS, SHIA AND SHRINKING BORDERS", assets: ["IMG 043", "IMG 044"], type: "shots",
    motion: "start: IMG 043, pan across the musketeers | @army: IMG 043, new camera move on another part of the image | @Hormuz: IMG 044, push into the fortress | @ruthless: IMG 043, second move: close on Abbas's face",
    year: [{ at: "^+0.3", value: 1587 }],
    titles: [{ text: "SHAH ABBAS I", at: "@Abbas", style: "name" }],
    shots: [
      { at: "^", image: "images/043.jpg", kenBurns: kb([1.35, 0.67, 0.58], [1.35, 0.33, 0.58]) },
      { at: "@army", image: "images/043.jpg", kenBurns: kb([1.42, 0.62, 0.54], [1.55, 0.59, 0.54]) },
      { at: "@Hormuz", image: "images/044.jpg", kenBurns: kb([1.12, 0.5, 0.5], [1.3, 0.38, 0.42]) },
      { at: "@ruthless", image: "images/043.jpg", kenBurns: kb([1.42, 0.62, 0.5], [1.55, 0.59, 0.5]) },
    ],
  },
  {
    id: "S38", part: "SHAHS, SHIA AND SHRINKING BORDERS", assets: ["IMG 045", "PHOTO-08"], type: "shots",
    motion: "start: IMG 045, slow aerial pan | @largest: IMG 045, new camera move on another part of the image | @half: PHOTO-08, slow push",
    shots: [
      { at: "^", image: "images/045.jpg", kenBurns: kb([1.35, 0.33, 0.5], [1.35, 0.67, 0.5]) },
      { at: "@largest", image: "images/045.jpg", kenBurns: kb([1.42, 0.62, 0.54], [1.55, 0.59, 0.54]) },
      { at: "@half", image: "images/photo-08.jpg", kenBurns: kb([1.02, 0.5, 0.5], [1.3, 0.38, 0.58]) },
    ],
  },
  {
    id: "S39", part: "SHAHS, SHIA AND SHRINKING BORDERS", assets: ["IMG 046", "IMG 047", "MAP-22", "IMG 048"], type: "shots",
    motion: "start: IMG 046, slow push on the queue | @until: IMG 046, new camera move on another part of the image | @Nader: IMG 047, push in on Nader | @India: MAP-22, raid route to Delhi | @thousands: MAP-22, camera moves to the next area | @Peacock: IMG 048, pan along the procession | @among: IMG 048, new camera move on another part of the image",
    year: [{ at: "^+0.3", value: 1722 }],
    titles: [{ text: "NADER SHAH", at: "@Nader", style: "name" }],
    shots: [
      { at: "^", image: "images/046.jpg", kenBurns: kb([1.12, 0.5, 0.5], [1.3, 0.5, 0.42]) },
      { at: "@until", image: "images/046.jpg", kenBurns: kb([1.42, 0.68, 0.42], [1.55, 0.65, 0.42]) },
      { at: "@Nader", image: "images/047.jpg", kenBurns: kb([1.12, 0.5, 0.5], [1.3, 0.62, 0.58]) },
      { at: "@India", ...M("MAP-22", "@India") },
      { at: "@thousands", ...M("MAP-22", "@thousands") },
      { at: "@Peacock", image: "images/048.jpg", kenBurns: kb([1.35, 0.33, 0.58], [1.35, 0.67, 0.58]) },
      { at: "@among", image: "images/048.jpg", kenBurns: kb([1.42, 0.38, 0.5], [1.55, 0.41, 0.5]) },
    ],
  },
  {
    id: "S40", part: "SHAHS, SHIA AND SHRINKING BORDERS", assets: ["IMG 049", "IMG 050", "MAP-23"], type: "shots",
    motion: "start: IMG 049, slow push on the shah | @over: IMG 049, new camera move on another part of the image | @Russia: IMG 050, pan with the soldiers | @treaties: MAP-23, Caucasus peels off, Aras highlighted | @that: MAP-23, camera moves to the next area",
    year: [{ at: "^+0.3", value: 1813 }],
    shots: [
      { at: "^", image: "images/049.jpg", kenBurns: kb([1.12, 0.5, 0.5], [1.3, 0.62, 0.58]) },
      { at: "@over", image: "images/049.jpg", kenBurns: kb([1.42, 0.38, 0.5], [1.55, 0.41, 0.5]) },
      { at: "@Russia", image: "images/050.jpg", kenBurns: kb([1.35, 0.33, 0.5], [1.35, 0.67, 0.5]) },
      { at: "@treaties", ...M("MAP-23", "@treaties") },
      { at: "@that", ...M("MAP-23", "@that") },
    ],
  },
  {
    id: "S41", part: "SHAHS, SHIA AND SHRINKING BORDERS", assets: ["IMG 051"], type: "shots",
    motion: "start: IMG 051, slow push on the crowd | @control: IMG 051, new camera move on another part of the image",
    year: [{ at: "^+0.3", value: 1891 }],
    shots: [
      { at: "^", image: "images/051.jpg", kenBurns: kb([1.12, 0.5, 0.5], [1.3, 0.5, 0.5]) },
      { at: "@control", image: "images/051.jpg", kenBurns: kb([1.42, 0.32, 0.46], [1.55, 0.35, 0.46]) },
    ],
  },
  {
    id: "S42", part: "SHAHS, SHIA AND SHRINKING BORDERS", assets: ["IMG 052", "MAP-24", "IMG 053"], type: "shots",
    motion: "start: IMG 052, pan across the crowd | @Iran's: IMG 052, new camera move on another part of the image | @spheres: MAP-24, Russian and British zones fill in | @shelled: IMG 053, push on the cannons",
    year: [{ at: "^+0.3", value: 1906 }],
    shots: [
      { at: "^", image: "images/052.jpg", kenBurns: kb([1.35, 0.67, 0.58], [1.35, 0.33, 0.58]) },
      { at: "@Iran's", image: "images/052.jpg", kenBurns: kb([1.42, 0.62, 0.46], [1.55, 0.59, 0.46]) },
      { at: "@spheres", ...M("MAP-24", "@spheres") },
      { at: "@shelled", image: "images/053.jpg", kenBurns: kb([1.12, 0.5, 0.5], [1.3, 0.5, 0.5]) },
    ],
  },
  {
    id: "S43", part: "SHAHS, SHIA AND SHRINKING BORDERS", assets: ["IMG 054", "PHOTO-09"], type: "shots",
    motion: "start: IMG 054, tilt up the gusher | @Anglo-Persian: PHOTO-09, slow push",
    year: [{ at: "^+0.3", value: 1908 }],
    shots: [
      { at: "^", image: "images/054.jpg", kenBurns: kb([1.3, 0.5, 0.66], [1.3, 0.5, 0.36]) },
      { at: "@Anglo-Persian", image: "images/photo-09.jpg", kenBurns: kb([1.02, 0.5, 0.5], [1.3, 0.5, 0.42]) },
    ],
  },
  {
    id: "S44", part: "SHAHS, SHIA AND SHRINKING BORDERS", assets: ["IMG 055"], type: "shots",
    motion: "start: IMG 055, very slow push | @soil: IMG 055, new camera move on another part of the image",
    year: [{ at: "^+0.3", value: 1917 }],
    shots: [
      { at: "^", image: "images/055.jpg", kenBurns: kb([1.12, 0.5, 0.5], [1.3, 0.62, 0.58]) },
      { at: "@soil", image: "images/055.jpg", kenBurns: kb([1.42, 0.32, 0.42], [1.55, 0.35, 0.42]) },
    ],
  },
  // ---------------- PART: OIL, REVOLUTION AND THE ISLAMIC REPUBLIC ----------------
  {
    id: "S45", part: "OIL, REVOLUTION AND THE ISLAMIC REPUBLIC", assets: ["IMG 056"], type: "shots",
    motion: "start: IMG 056, push in on Reza Khan | @encouragement: IMG 056, new camera move on another part of the image",
    year: [{ at: "^+0.3", value: 1921 }],
    titles: [{ text: "REZA KHAN", at: "@Reza", style: "name" }],
    shots: [
      { at: "^", image: "images/056.jpg", kenBurns: kb([1.12, 0.5, 0.5], [1.3, 0.38, 0.5]) },
      { at: "@encouragement", image: "images/056.jpg", kenBurns: kb([1.42, 0.32, 0.5], [1.55, 0.35, 0.5]) },
    ],
  },
  {
    id: "S46", part: "OIL, REVOLUTION AND THE ISLAMIC REPUBLIC", assets: ["IMG 057", "IMG 058"], type: "shots",
    motion: "start: IMG 057, pan with the train | @stop: IMG 057, new camera move on another part of the image | @veil: IMG 058, slow push",
    year: [{ at: "^+0.3", value: 1935 }],
    shots: [
      { at: "^", image: "images/057.jpg", kenBurns: kb([1.35, 0.67, 0.42], [1.35, 0.33, 0.42]) },
      { at: "@stop", image: "images/057.jpg", kenBurns: kb([1.42, 0.38, 0.42], [1.55, 0.41, 0.42]) },
      { at: "@veil", image: "images/058.jpg", kenBurns: kb([1.12, 0.5, 0.5], [1.3, 0.62, 0.42]) },
    ],
  },
  {
    id: "S47", part: "OIL, REVOLUTION AND THE ISLAMIC REPUBLIC", assets: ["MAP-25", "IMG 059"], type: "shots",
    motion: "start: MAP-25, Soviet and British arrows | @secure: MAP-25, camera moves to the next area | @abdicate: IMG 059, slow pan",
    year: [{ at: "^+0.3", value: 1941 }],
    shots: [
      { at: "^", ...M("MAP-25", "^") },
      { at: "@secure", ...M("MAP-25", "@secure") },
      { at: "@abdicate", image: "images/059.jpg", kenBurns: kb([1.35, 0.33, 0.58], [1.35, 0.67, 0.58]) },
    ],
  },
  {
    id: "S48", part: "OIL, REVOLUTION AND THE ISLAMIC REPUBLIC", assets: ["PHOTO-10", "IMG 060", "PHOTO-11"], type: "shots",
    motion: "start: PHOTO-10, slow push | @Iran's: PHOTO-10, new camera move on another part of the image | @coup: IMG 060, pan along the tanks | @crowds: IMG 060, new camera move on another part of the image | @documents: PHOTO-11, slow push | @prison: PHOTO-10, second move: close on the face",
    year: [{ at: "^+0.3", value: 1951 }],
    titles: [{ text: "MOHAMMAD MOSADDEGH", at: "@Mosaddegh", style: "name" }],
    shots: [
      { at: "^", image: "images/photo-10.jpg", kenBurns: kb([1.02, 0.5, 0.5], [1.3, 0.5, 0.58]) },
      { at: "@Iran's", image: "images/photo-10.jpg", kenBurns: kb([1.42, 0.38, 0.5], [1.55, 0.41, 0.5]) },
      { at: "@coup", image: "images/060.jpg", kenBurns: kb([1.35, 0.67, 0.5], [1.35, 0.33, 0.5]) },
      { at: "@crowds", image: "images/060.jpg", kenBurns: kb([1.42, 0.32, 0.46], [1.55, 0.35, 0.46]) },
      { at: "@documents", image: "images/photo-11.jpg", kenBurns: kb([1.02, 0.5, 0.5], [1.3, 0.62, 0.42]) },
      { at: "@prison", image: "images/photo-10.jpg", kenBurns: kb([1.42, 0.62, 0.46], [1.55, 0.59, 0.46]) },
    ],
  },
  {
    id: "S49", part: "OIL, REVOLUTION AND THE ISLAMIC REPUBLIC", assets: ["IMG 061", "IMG 062", "IMG 063"], type: "shots",
    motion: "start: IMG 061, pan across the boulevard | @vote: IMG 061, new camera move on another part of the image | @SAVAK: IMG 062, slow push | @Khomeini: IMG 063, slow push on the tapes",
    titles: [{ text: "RUHOLLAH KHOMEINI", at: "@Khomeini", style: "name" }],
    shots: [
      { at: "^", image: "images/061.jpg", kenBurns: kb([1.35, 0.67, 0.42], [1.35, 0.33, 0.42]) },
      { at: "@vote", image: "images/061.jpg", kenBurns: kb([1.42, 0.62, 0.54], [1.55, 0.59, 0.54]) },
      { at: "@SAVAK", image: "images/062.jpg", kenBurns: kb([1.12, 0.5, 0.5], [1.3, 0.38, 0.42]) },
      { at: "@Khomeini", image: "images/063.jpg", kenBurns: kb([1.12, 0.5, 0.5], [1.3, 0.62, 0.5]) },
    ],
  },
  {
    id: "S50", part: "OIL, REVOLUTION AND THE ISLAMIC REPUBLIC", assets: ["PHOTO-12", "IMG 064"], type: "shots",
    motion: "start: PHOTO-12, slow push, low zoom | @down: PHOTO-12, new camera move on another part of the image | @Khomeini: IMG 064, slow pull out over the crowd | @after: IMG 064, new camera move on another part of the image | @constitution: IMG 064, second move: banners detail",
    year: [{ at: "^+0.3", value: 1978 }],
    shots: [
      { at: "^", image: "images/photo-12.jpg", kenBurns: kb([1.0, 0.5, 0.5], [1.08, 0.5, 0.48]) },
      { at: "@down", image: "images/photo-12.jpg", kenBurns: kb([1.0, 0.5, 0.5], [1.08, 0.48, 0.48]) },
      { at: "@Khomeini", image: "images/064.jpg", kenBurns: kb([1.32, 0.38, 0.58], [1.12, 0.5, 0.5]) },
      { at: "@after", image: "images/064.jpg", kenBurns: kb([1.42, 0.38, 0.46], [1.55, 0.41, 0.46]) },
      { at: "@constitution", image: "images/064.jpg", kenBurns: kb([1.42, 0.62, 0.5], [1.55, 0.59, 0.5]) },
    ],
  },
  {
    id: "S51", part: "OIL, REVOLUTION AND THE ISLAMIC REPUBLIC", assets: ["IMG 065"], type: "shots",
    motion: "start: IMG 065, push in on the gates | @followers: IMG 065, new camera move on another part of the image | @compulsory: IMG 065, new camera move on another part of the image",
    year: [{ at: "^+0.3", value: 1979 }],
    shots: [
      { at: "^", image: "images/065.jpg", kenBurns: kb([1.12, 0.5, 0.5], [1.3, 0.5, 0.5]) },
      { at: "@followers", image: "images/065.jpg", kenBurns: kb([1.42, 0.68, 0.42], [1.55, 0.65, 0.42]) },
      { at: "@compulsory", image: "images/065.jpg", kenBurns: kb([1.42, 0.38, 0.5], [1.55, 0.41, 0.5]) },
    ],
  },
  {
    id: "S52", part: "OIL, REVOLUTION AND THE ISLAMIC REPUBLIC", assets: ["MAP-26", "IMG 066", "PHOTO-13", "IMG 067"], type: "shots",
    motion: "start: MAP-26, Iraqi invasion arrows, then Iranian counterattack | @carry: MAP-26, camera moves to the next area | @mustard: IMG 066, slow pan along the trench | @backed: PHOTO-13, slow push | @Vincennes: IMG 067, slow tilt up from ship to plane | @crew: IMG 067, new camera move on another part of the image",
    year: [{ at: "^+0.3", value: 1980 }],
    shots: [
      { at: "^", ...M("MAP-26", "^") },
      { at: "@carry", ...M("MAP-26", "@carry") },
      { at: "@mustard", image: "images/066.jpg", kenBurns: kb([1.35, 0.67, 0.5], [1.35, 0.33, 0.5]) },
      { at: "@backed", image: "images/photo-13.jpg", kenBurns: kb([1.0, 0.5, 0.5], [1.08, 0.48, 0.48]) },
      { at: "@Vincennes", image: "images/067.jpg", kenBurns: kb([1.3, 0.5, 0.66], [1.3, 0.5, 0.36]) },
      { at: "@crew", image: "images/067.jpg", kenBurns: kb([1.42, 0.32, 0.5], [1.55, 0.35, 0.5]) },
    ],
  },
  {
    id: "S53", part: "OIL, REVOLUTION AND THE ISLAMIC REPUBLIC", assets: ["IMG 068"], type: "shots",
    motion: "start: IMG 068, very slow push down the corridor | @Khomeini's: IMG 068, new camera move on another part of the image",
    year: [{ at: "^+0.3", value: 1988 }],
    shots: [
      { at: "^", image: "images/068.jpg", kenBurns: kb([1.12, 0.5, 0.5], [1.3, 0.38, 0.58]) },
      { at: "@Khomeini's", image: "images/068.jpg", kenBurns: kb([1.42, 0.32, 0.42], [1.55, 0.35, 0.42]) },
    ],
  },
  {
    id: "S54", part: "OIL, REVOLUTION AND THE ISLAMIC REPUBLIC", assets: ["IMG 069"], type: "shots",
    motion: "start: IMG 069, pan across the crowd | @millions: IMG 069, new camera move on another part of the image",
    year: [{ at: "^+0.3", value: 1989 }],
    shots: [
      { at: "^", image: "images/069.jpg", kenBurns: kb([1.35, 0.33, 0.42], [1.35, 0.67, 0.42]) },
      { at: "@millions", image: "images/069.jpg", kenBurns: kb([1.42, 0.68, 0.46], [1.55, 0.65, 0.46]) },
    ],
  },
  {
    id: "S55", part: "OIL, REVOLUTION AND THE ISLAMIC REPUBLIC", assets: ["MAP-27", "IMG 070"], type: "shots",
    motion: "start: MAP-27, lines to allies light up | @Lebanon: MAP-27, camera moves to the next area | @Stuxnet: IMG 070, slow push on the screen | @several: IMG 070, new camera move on another part of the image | @deal: IMG 070, new camera move on another part of the image",
    shots: [
      { at: "^", ...M("MAP-27", "^") },
      { at: "@Lebanon", ...M("MAP-27", "@Lebanon") },
      { at: "@Stuxnet", image: "images/070.jpg", kenBurns: kb([1.12, 0.5, 0.5], [1.3, 0.38, 0.5]) },
      { at: "@several", image: "images/070.jpg", kenBurns: kb([1.42, 0.32, 0.5], [1.55, 0.35, 0.5]) },
      { at: "@deal", image: "images/070.jpg", kenBurns: kb([1.42, 0.68, 0.42], [1.55, 0.65, 0.42]) },
    ],
  },
  {
    id: "S56", part: "OIL, REVOLUTION AND THE ISLAMIC REPUBLIC", assets: ["IMG 071"], type: "shots",
    motion: "start: IMG 071, slow tilt up to the plane | @missiles: IMG 071, new camera move on another part of the image | @airliner: IMG 071, new camera move on another part of the image",
    year: [{ at: "^+0.3", value: 2020 }],
    shots: [
      { at: "^", image: "images/071.jpg", kenBurns: kb([1.3, 0.5, 0.66], [1.3, 0.5, 0.36]) },
      { at: "@missiles", image: "images/071.jpg", kenBurns: kb([1.42, 0.68, 0.54], [1.55, 0.65, 0.54]) },
      { at: "@airliner", image: "images/071.jpg", kenBurns: kb([1.42, 0.32, 0.54], [1.55, 0.35, 0.54]) },
    ],
  },
  {
    id: "S57", part: "OIL, REVOLUTION AND THE ISLAMIC REPUBLIC", assets: ["PHOTO-14", "IMG 072"], type: "shots",
    motion: "start: PHOTO-14, slow push | @Woman: IMG 072, slow push on the women | @that: IMG 072, new camera move on another part of the image",
    year: [{ at: "^+0.3", value: 2022 }],
    shots: [
      { at: "^", image: "images/photo-14.jpg", kenBurns: kb([1.02, 0.5, 0.5], [1.3, 0.38, 0.42]) },
      { at: "@Woman", image: "images/072.jpg", kenBurns: kb([1.12, 0.5, 0.5], [1.3, 0.62, 0.42]) },
      { at: "@that", image: "images/072.jpg", kenBurns: kb([1.42, 0.38, 0.54], [1.55, 0.41, 0.54]) },
    ],
  },
  {
    id: "S58", part: "OIL, REVOLUTION AND THE ISLAMIC REPUBLIC", assets: ["MAP-28", "IMG 073"], type: "shots",
    motion: "start: MAP-28, strike flashes on cue | @Fordow: IMG 073, slow pan with the bombers",
    year: [{ at: "^+0.3", value: 2025 }],
    shots: [
      { at: "^", ...M("MAP-28", "^") },
      { at: "@Fordow", image: "images/073.jpg", kenBurns: kb([1.35, 0.67, 0.42], [1.35, 0.33, 0.42]) },
    ],
  },
  {
    id: "S59", part: "OIL, REVOLUTION AND THE ISLAMIC REPUBLIC", assets: ["IMG 074"], type: "shots",
    motion: "start: IMG 074, slow push down the street | @security: IMG 074, new camera move on another part of the image | @Human: IMG 074, new camera move on another part of the image",
    year: [{ at: "^+0.3", value: 2025 }],
    shots: [
      { at: "^", image: "images/074.jpg", kenBurns: kb([1.12, 0.5, 0.5], [1.3, 0.38, 0.58]) },
      { at: "@security", image: "images/074.jpg", kenBurns: kb([1.42, 0.32, 0.5], [1.55, 0.35, 0.5]) },
      { at: "@Human", image: "images/074.jpg", kenBurns: kb([1.42, 0.62, 0.54], [1.55, 0.59, 0.54]) },
    ],
  },
  {
    id: "S60", part: "OIL, REVOLUTION AND THE ISLAMIC REPUBLIC", assets: ["IMG 075", "MAP-29", "IMG 076"], type: "shots",
    motion: "start: IMG 075, slow pull out over the skyline | @goal: IMG 075, new camera move on another part of the image | @Khamenei: MAP-29, Tehran strike flash, then Minab | @school: IMG 076, very slow push | @preliminary: IMG 076, new camera move on another part of the image | @Assembly: IMG 075, second move: smoke over the city",
    year: [{ at: "^+0.3", value: 2026 }],
    shots: [
      { at: "^", image: "images/075.jpg", kenBurns: kb([1.32, 0.5, 0.42], [1.12, 0.5, 0.5]) },
      { at: "@goal", image: "images/075.jpg", kenBurns: kb([1.42, 0.32, 0.5], [1.55, 0.35, 0.5]) },
      { at: "@Khamenei", ...M("MAP-29", "@Khamenei") },
      { at: "@school", image: "images/076.jpg", kenBurns: kb([1.12, 0.5, 0.5], [1.3, 0.62, 0.42]) },
      { at: "@preliminary", image: "images/076.jpg", kenBurns: kb([1.42, 0.62, 0.54], [1.55, 0.59, 0.54]) },
      { at: "@Assembly", image: "images/075.jpg", kenBurns: kb([1.42, 0.62, 0.54], [1.55, 0.59, 0.54]) },
    ],
  },
  {
    id: "S61", part: "OIL, REVOLUTION AND THE ISLAMIC REPUBLIC", assets: ["MAP-29", "IMG 077"], type: "shots",
    motion: "start: MAP-29, second state: missile arcs and Hormuz closed | @Strait: IMG 077, slow pan across the tankers",
    year: [{ at: "^+0.3", value: 2026 }],
    shots: [
      { at: "^", ...M("MAP-29b", "^") },
      { at: "@Strait", image: "images/077.jpg", kenBurns: kb([1.35, 0.67, 0.42], [1.35, 0.33, 0.42]) },
    ],
  },
  {
    id: "S62", part: "OIL, REVOLUTION AND THE ISLAMIC REPUBLIC", assets: ["IMG 078", "IMG 079", "IMG 010"], type: "shots",
    motion: "start: IMG 078, slow push on Tehran | @Arabs: IMG 078, new camera move on another part of the image | @Ferdowsi's: IMG 079, slow push on the book | @tomb: IMG 010, callback: slow pull out from the tomb",
    shots: [
      { at: "^", image: "images/078.jpg", kenBurns: kb([1.12, 0.5, 0.5], [1.3, 0.38, 0.42]) },
      { at: "@Arabs", image: "images/078.jpg", kenBurns: kb([1.42, 0.38, 0.5], [1.55, 0.41, 0.5]) },
      { at: "@Ferdowsi's", image: "images/079.jpg", kenBurns: kb([1.12, 0.5, 0.5], [1.3, 0.38, 0.42]) },
      { at: "@tomb", image: "images/010.jpg", kenBurns: kb([1.32, 0.5, 0.58], [1.12, 0.5, 0.5]) },
    ],
  },
  {
    id: "S63", part: "OIL, REVOLUTION AND THE ISLAMIC REPUBLIC", assets: ["IMG 078"], type: "shots",
    motion: "start: IMG 078, end screen. CTA overlay at the end",
    cta: { at: "@subscribe", duration: 5.5 },
    shots: [
      { at: "^", image: "images/078.jpg", kenBurns: kb([1.12, 0.5, 0.5], [1.3, 0.62, 0.58]) },
    ],
  },
];
