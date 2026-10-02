// Renders the CTA overlay over one scene of the selected video: a short MP4 plus key stills.
// Usage: npm run cta-preview <slug> [S10] [--position=bottom-right] [--full]
// Output: videos/<slug>/checks/cta-preview.mp4 and cta-*.jpg (not committed). ~200 frames, fine locally.
import fs from "node:fs";
import path from "node:path";
import { V, bundleVideo } from "./video.mjs";
import { renderMedia, renderStill, selectComposition } from "@remotion/renderer";

const args = process.argv.slice(2);
const full = args.includes("--full");
const position = args.find((a) => a.startsWith("--position="))?.split("=")[1];
const scene = args.find((a) => /^S\d+$/.test(a));
const inputProps = { ...(scene ? { scene } : {}), ...(position ? { position } : {}) };

const serveUrl = await bundleVideo();
const composition = await selectComposition({ serveUrl, id: "CtaPreview", inputProps });
const outDir = V("checks");
fs.mkdirSync(outDir, { recursive: true });
const scale = full ? 1 : 0.5;
for (const s of [1.0, 2.15, 2.6, 3.6]) {
  const output = path.join(outDir, `cta-${s.toFixed(2)}s.jpg`);
  await renderStill({ composition, serveUrl, inputProps, frame: Math.round(s * composition.fps), output, imageFormat: "jpeg", jpegQuality: 88, scale, overwrite: true });
  console.log(output);
}
const mp4 = path.join(outDir, "cta-preview.mp4");
await renderMedia({ composition, serveUrl, inputProps, codec: "h264", outputLocation: mp4, scale, muted: true, crf: 20, overwrite: true });
console.log(mp4);
