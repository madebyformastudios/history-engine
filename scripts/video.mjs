// Shared helpers: which video is selected and where its files live.
// The video is chosen with the VIDEO env var (set by scripts/v.mjs, e.g. `npm run studio mongol-empire`).
import fs from "node:fs";
import path from "node:path";

export const VIDEO = process.env.VIDEO;
if (!VIDEO) throw new Error("No video selected. Use e.g. `npm run studio mongol-empire` (sets VIDEO).");
export const VIDEO_DIR = path.resolve("videos", VIDEO);
if (!fs.existsSync(VIDEO_DIR)) throw new Error(`videos/${VIDEO} does not exist`);

/** Path inside the selected video folder. */
export const V = (...p) => path.join("videos", VIDEO, ...p);
export const publicDir = path.join(VIDEO_DIR, "public");
export const entryPoint = path.resolve("engine/index.ts");

/** Adds the "@video" import alias (engine code imports the video's data through it). */
export const webpackOverride = (config) => ({
  ...config,
  resolve: { ...config.resolve, alias: { ...(config.resolve?.alias ?? {}), "@video": VIDEO_DIR } },
});

/** Bundle the engine for the selected video (for scripts that use @remotion/renderer directly). */
export const bundleVideo = async () => {
  const { bundle } = await import("@remotion/bundler");
  return bundle({ entryPoint, publicDir, webpackOverride });
};

export const readJson = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
