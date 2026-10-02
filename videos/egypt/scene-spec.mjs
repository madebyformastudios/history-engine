// Scene-by-scene spec for this video, transcribed from DRAAIBOEK.md (the runbook is the source of truth).
// `npm run build <slug>` resolves it against data/timings.json into data/scenes.json.
//
// Time references (any string value):
//   "@word"      the moment the narrator says `word` in THIS scene, e.g. "@Korea"
//   "@word+0.4"  offset in seconds from that moment
//   "^+0.5"      scene start + 0.5 s        "$-1"  scene end - 1 s
//
// Every option is documented in CATALOG.md. Full working example: videos/mongol-empire/scene-spec.mjs

export const meta = {
  id: "MyVideo", // composition id, letters only
  title: "Title of the video",
  fps: 30,
  width: 1920,
  height: 1080,
  audio: "audio/voiceover.mp3",
  transitionFrames: 10,
};

export const overlay = { dust: 0.55, parchment: 0.22, grain: 0.07, vignette: 0.42 };

// One projection for every map in this video; each map scene picks a camera on it.
// extent = [[west, south], [east, north]] of the widest map you need.
export const map = { extent: [[8, 6], [146, 64]], rotate: [-78, 0], parallels: [28, 56] };

export const scenes = [
  // { id: "S01", part: "HOOK", assets: ["IMG 001"], type: "image", image: "images/001.jpg",
  //   motion: "Slow push in.", kenBurns: { from: { scale: 1.04, x: 0.5, y: 0.5 }, to: { scale: 1.2, x: 0.5, y: 0.45 } } },
];
