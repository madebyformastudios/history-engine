import path from "node:path";
import fs from "node:fs";
import { Config } from "@remotion/cli/config";

// The video is selected with the VIDEO env var. Use the npm commands, e.g. `npm run studio mongol-empire`.
const VIDEO = process.env.VIDEO;
if (!VIDEO) throw new Error("No video selected. Use e.g. `npm run studio mongol-empire`.");
const dir = path.resolve("videos", VIDEO);
if (!fs.existsSync(dir)) throw new Error(`videos/${VIDEO} does not exist`);

Config.setEntryPoint("engine/index.ts");
Config.setPublicDir(path.join(dir, "public"));
Config.overrideWebpackConfig((c) => ({
  ...c,
  resolve: { ...c.resolve, alias: { ...(c.resolve?.alias ?? {}), "@video": dir } },
}));
Config.setOutputLocation(`out/${VIDEO}.mp4`);
Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(92);
Config.setCodec("h264");
Config.setCrf(18);
Config.setOverwriteOutput(true);
