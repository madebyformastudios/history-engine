// Render benchmark: measures what each visual effect costs.
// Bundles once, then renders the same test segments for every variant on the same machine,
// so the numbers are directly comparable.
//
// Usage: node scripts/bench.mjs [--frames=120] [--scale=1]
// Output: out/bench/<variant>-<segment>.mp4, out/bench/results.md (also appended to the GitHub job summary)
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { V, bundleVideo, readJson } from "./video.mjs";
import { renderMedia, selectComposition } from "@remotion/renderer";

const arg = (k, d) => {
  const a = process.argv.find((x) => x.startsWith(`--${k}=`));
  return a ? a.split("=")[1] : d;
};
const len = parseInt(arg("frames", "120"), 10);
const scale = parseFloat(arg("scale", "1"));
const only = arg("variants", ""); // e.g. --variants=baseline,all
const tag = arg("tag", "");
const concurrency = os.cpus().length;

const { meta, scenes } = readJson(V("data/scenes.json"));
const at = (id, frac) => {
  const s = scenes.find((x) => x.id === id);
  const start = Math.max(s.startFrame, Math.round(s.startFrame + (s.endFrame - s.startFrame - len) * frac));
  return [start, start + len - 1];
};

// Three representative segments: the first and last map scene, and an image scene (preferably one with effects).
const maps = scenes.filter((s) => s.type === "map");
const images = scenes.filter((s) => s.type === "image" || s.type === "parallax");
const fxImage = images.find((s) => s.effects && Object.keys(s.effects).length) ?? images[0];
const picks = [maps[0], fxImage, maps[maps.length - 1]].filter(Boolean);
const segments = [...new Map(picks.map((s) => [s.id, s])).values()].map((s) => ({ name: `${s.type}-${s.id}`, range: at(s.id, 0.4) }));

const variants = [
  { name: "baseline (all on)", off: [] },
  { name: "no parchment", off: ["parchment"] },
  { name: "no grain", off: ["grain"] },
  { name: "no dust", off: ["dust"] },
  { name: "no grade", off: ["grade"] },
  { name: "no map shadow", off: ["mapShadow"] },
  { name: "no blur / drop-shadow", off: ["blur"] },
  { name: "all effects off", off: ["all"] },
];

if (only) {
  const keys = only.split(",");
  for (let i = variants.length - 1; i >= 0; i--)
    if (!keys.some((k) => variants[i].name.startsWith(k))) variants.splice(i, 1);
}
fs.mkdirSync("out/bench", { recursive: true });
console.log(`CPU: ${os.cpus()[0]?.model} x${concurrency}, ${Math.round(os.totalmem() / 1e9)} GB RAM`);
console.log("Bundling...");
const serveUrl = await bundleVideo();

const rows = [];
for (const v of variants) {
  const inputProps = { off: v.off };
  const composition = await selectComposition({ serveUrl, id: meta.id, inputProps });
  const times = [];
  for (const seg of segments) {
    const t0 = performance.now();
    await renderMedia({
      composition,
      serveUrl,
      codec: "h264",
      inputProps,
      frameRange: seg.range,
      outputLocation: `out/bench/${tag}${v.name.replace(/[^a-z0-9]+/gi, "-")}-${seg.name}.mp4`,
      muted: true,
      scale,
      concurrency,
      imageFormat: "jpeg",
      jpegQuality: 92,
      crf: 18,
      overwrite: true,
    });
    const s = (performance.now() - t0) / 1000;
    times.push(s);
    console.log(`${v.name.padEnd(24)} ${seg.name.padEnd(14)} ${s.toFixed(1)}s  (${(len / s).toFixed(1)} fps)`);
  }
  rows.push({ v, times });
}

const base = rows[0].times.reduce((a, b) => a + b, 0);
const totalFrames = meta.durationInFrames;
let md = `## Render benchmark\n\n`;
md += `Machine: ${os.cpus()[0]?.model} x${concurrency}, ${Math.round(os.totalmem() / 1e9)} GB RAM. `;
md += `${len} frames per segment, scale ${scale}.\n\n`;
md += `| Variant | ${segments.map((s) => s.name).join(" | ")} | Total | fps | vs baseline | Est. full video (1 machine) |\n`;
md += `|---|${segments.map(() => "---").join("|")}|---|---|---|---|\n`;
for (const { v, times } of rows) {
  const tot = times.reduce((a, b) => a + b, 0);
  const fps = (len * segments.length) / tot;
  md += `| ${v.name} | ${times.map((t) => t.toFixed(1) + "s").join(" | ")} | ${tot.toFixed(1)}s | ${fps.toFixed(1)} | ${((1 - tot / base) * 100).toFixed(0)}% faster | ${(totalFrames / fps / 60).toFixed(1)} min |\n`;
}
fs.writeFileSync(`out/bench/${tag}results.md`, md);
if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, md);
console.log("\n" + md);
