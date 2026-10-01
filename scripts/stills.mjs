// Fast stills for checking: bundles once, renders many frames.
// Usage:
//   npm run stills <slug>                   middle frame of every scene → videos/<slug>/checks/Sxx.jpg
//   node scripts/stills.mjs S04@0.8 S13@0.9 scene at a fraction of its length
//   node scripts/stills.mjs 1234 5678        absolute frames
//   add --full for full 1920x1080 (default is half size)
// (scripts/render-stills.sh does the same per-scene pass with `npx remotion still`.)
import fs from "node:fs";
import path from "node:path";
import { V, bundleVideo, readJson } from "./video.mjs";
import { renderStill, selectComposition } from "@remotion/renderer";

const args = process.argv.slice(2);
const full = args.includes("--full");
const targets = args.filter((a) => !a.startsWith("--"));
const { meta, scenes } = readJson(V("data/scenes.json"));

const jobs = [];
if (!targets.length) {
  for (const s of scenes) jobs.push({ name: s.id, frame: Math.floor((s.startFrame + s.endFrame) / 2) });
} else {
  for (const t of targets) {
    const m = t.match(/^(S\d\d)@([\d.]+)$/);
    if (m) {
      const s = scenes.find((x) => x.id === m[1]);
      const frame = Math.round(s.startFrame + (s.endFrame - s.startFrame - 1) * parseFloat(m[2]));
      jobs.push({ name: `${m[1]}_${m[2]}`, frame });
    } else jobs.push({ name: `f${t}`, frame: parseInt(t, 10) });
  }
}

const serveUrl = await bundleVideo();
const composition = await selectComposition({ serveUrl, id: meta.id });
const outDir = V("checks");
fs.mkdirSync(outDir, { recursive: true });
for (const j of jobs) {
  const output = path.join(outDir, `${j.name}.jpg`);
  await renderStill({ composition, serveUrl, frame: j.frame, output, imageFormat: "jpeg", jpegQuality: 85, scale: full ? 1 : 0.5, overwrite: true });
  console.log(`${output} (frame ${j.frame})`);
}
