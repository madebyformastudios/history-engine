// Command runner: `npm run <task> <video-slug> [extra args]`
// Sets VIDEO=<slug> so the engine and all scripts work on videos/<slug>.
import fs from "node:fs";
import { spawnSync } from "node:child_process";

const [task, slug, ...rest] = process.argv.slice(2);
const videos = fs.existsSync("videos") ? fs.readdirSync("videos").filter((d) => !d.startsWith("_") && fs.statSync(`videos/${d}`).isDirectory()) : [];
if (!slug || !videos.includes(slug)) {
  console.error(`Usage: npm run ${task} <video>\nVideos: ${videos.join(", ") || "(none yet, run: npm run new <slug>)"}`);
  process.exit(1);
}
const env = { ...process.env, VIDEO: slug };
const meta = () => JSON.parse(fs.readFileSync(`videos/${slug}/data/scenes.json`, "utf8")).meta;
const run = (cmd, args) => {
  console.log(`\n> ${cmd} ${args.join(" ")}`);
  const r = spawnSync(cmd, args, { stdio: "inherit", env, shell: process.platform === "win32" });
  if (r.status !== 0) process.exit(r.status ?? 1);
};
const node = (script, args = []) => run("node", [script, ...args]);

const tasks = {
  studio: () => run("npx", ["remotion", "studio", ...rest]),
  render: () => run("npx", ["remotion", "render", meta().id, `out/${slug}.mp4`, ...rest]),
  draft: () => run("npx", ["remotion", "render", meta().id, `out/${slug}-draft.mp4`, "--scale=0.5", ...rest]),
  transcribe: () => node("scripts/transcribe.mjs", rest),
  align: () => node("scripts/align.mjs", rest),
  build: () => node("scripts/build-scenes.mjs", rest),
  validate: () => run("node", ["--experimental-strip-types", "scripts/validate.ts", ...rest]),
  stills: () => node("scripts/stills.mjs", rest),
  bench: () => node("scripts/bench.mjs", rest),
  "cta-preview": () => node("scripts/cta-preview.mjs", rest),
  depth: () => run("python3", ["scripts/depth.py", ...rest]),
  demo: () => node("scripts/demo.mjs", rest),
  // transcription + timings + scenes + validation in one go
  prepare: () => {
    tasks.transcribe();
    tasks.align();
    tasks.build();
    tasks.validate();
  },
};
if (!tasks[task]) {
  console.error(`Unknown task "${task}". Tasks: ${Object.keys(tasks).join(", ")}`);
  process.exit(1);
}
tasks[task]();
