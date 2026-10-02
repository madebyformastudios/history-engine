// Scene-by-scene spec for this video, transcribed from DRAAIBOEK.md (the runbook is the source of truth).
// `npm run build <slug>` resolves it against data/timings.json into data/scenes.json.
//
// Time references (any string value):
//   "@word"      the moment the narrator says `word` in THIS scene, e.g. "@Korea"
//   "@word+0.4"  offset in seconds from that moment
//   "^+0.5"      scene start + 0.5 s        "$-1"  scene end - 1 s
//
// Every option is documented in CATALOG.md; look and motion rules in STYLE.md.
// Working examples: videos/mongol-empire/scene-spec.mjs, videos/iran/scene-spec.mjs (multi-shot).

export const meta = {
  id: "MyVideo", // composition id, letters only
  title: "Title of the video",
  fps: 30,
  width: 1920,
  height: 1080,
  audio: "audio/voiceover.mp3",
  transitionFrames: 10,
  transition: { type: "fade" }, // default between scenes; accents per scene (STYLE.md)
  captions: { style: "kinetic" },
};

export const overlay = { dust: 0.55, parchment: 0.22, grain: 0.07, vignette: 0.42 };

// One projection for every map in this video; each map scene picks a camera on it.
// extent = [[west, south], [east, north]] of the widest map you need.
export const map = { extent: [[8, 6], [146, 64]], rotate: [-78, 0], parallels: [28, 56] };

const kb = (from, to, extra = {}) => ({ from: { scale: from[0], x: from[1], y: from[2] }, to: { scale: to[0], x: to[1], y: to[2] }, ...extra });

export const scenes = [
  // A multi-shot scene: one VO paragraph, several beats, each starting on a spoken word.
  // {
  //   id: "S01", part: "HOOK", assets: ["IMG 001", "MAP-01"], type: "shots",
  //   motion: "Push in on the king, glide to the tribute bearers, then the map.",
  //   shots: [
  //     { at: "^", image: "images/001.jpg", depth: 0.8,
  //       kenBurns: { ...kb([1.1, 0.5, 0.5], [1.4, 0.3, 0.6]),
  //         path: [{ at: "^", scale: 1.1, x: 0.5, y: 0.5 }, { at: "@tribute", scale: 1.4, x: 0.3, y: 0.6 }, { at: "@Egypt", scale: 1.45, x: 0.28, y: 0.6 }] },
  //       annotations: [{ type: "circle", at: "@king", x: 0.5, y: 0.3, r: 0.06, label: "the king" }] },
  //     { at: "@Egypt", transition: { type: "zoom" }, map: { id: "MAP-01", rivers: true, camera: [...], states: [...] } },
  //   ],
  //   graphics: [{ kind: "stat", layout: "right", at: "@million", until: "$", value: 50, suffix: " million", label: "people ruled", source: "..." }],
  // },
];
