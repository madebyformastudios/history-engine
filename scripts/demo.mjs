// Renders the feature demo (engine/FeatureDemo.tsx) with the selected video's images: stills of every
// feature plus a short half-size MP4, into videos/<slug>/checks/ (not committed).
// Usage: npm run demo <slug>   (run `npm run depth <slug> 001` first for the depth-parallax part)
import fs from "node:fs";
import path from "node:path";
import { V, bundleVideo } from "./video.mjs";
import { renderMedia, renderStill, selectComposition } from "@remotion/renderer";

const noVideo = process.argv.includes("--stills-only");
const serveUrl = await bundleVideo();
const composition = await selectComposition({ serveUrl, id: "FeatureDemo" });
const out = V("checks");
fs.mkdirSync(out, { recursive: true });
// seconds: transitions, camera path, depth, 7 infographics, map
const at = [3.3, 5.8, 8.4, 10.9, 14, 16.5, 19.5, 22.5, 26.5, 30, 33.5, 37, 40.5, 44, 48, 50.5, 53.5];
for (const s of at) {
  const output = path.join(out, `demo-${String(s).padStart(4, "0")}s.jpg`);
  await renderStill({ composition, serveUrl, frame: Math.round(s * 30), output, imageFormat: "jpeg", jpegQuality: 85, scale: 0.5, overwrite: true });
  console.log(output);
}
if (!noVideo) {
  const mp4 = path.join(out, "demo.mp4");
  await renderMedia({ composition, serveUrl, codec: "h264", outputLocation: mp4, scale: 0.5, muted: true, crf: 22, overwrite: true });
  console.log(mp4);
}
