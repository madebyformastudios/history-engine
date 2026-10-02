// Validates the build against DRAAIBOEK.md (the runbook):
//   1. every scene in the runbook exists in src/data/scenes.json, in the same order, with the same assets
//   2. every asset in the runbook's asset checklist is used in exactly the listed scene(s)
//   3. no image is used in a scene the runbook does not list it for
//   4. every referenced file exists (images, cutout, audio, map/territory data)
//   5. scenes are contiguous: no gaps, no overlaps, first starts at 0, last ends at the video end
//   6. every runbook cue (@"word") is resolved, and lands inside its scene
// Usage: node scripts/validate.ts   (Node ≥ 23 runs TypeScript directly)
import fs from "node:fs";
import path from "node:path";
import { geoContains } from "d3-geo";

const VIDEO = process.env.VIDEO;
if (!VIDEO) throw new Error("No video selected. Use `npm run validate <slug>`.");
const V = (...p: string[]) => path.join("videos", VIDEO, ...p);

type Cue = { word: string; t: number; frame: number; exact: boolean };
type MapLike = { id: string; states: { layers: { territory: string }[] }[]; lines?: { id: string; path: [number, number][]; style: string; river?: string; overWater?: boolean }[] };
type Scene = {
  id: string;
  assets: string[];
  type: string;
  start: number;
  end: number;
  startFrame: number;
  endFrame: number;
  image?: string;
  background?: { src: string };
  sprites?: { src: string }[];
  map?: MapLike;
  shots?: { at: number; image?: string; graphic?: object; depth?: number; kenBurns?: { path?: unknown[] }; map?: MapLike }[];
  cues: Cue[];
};

const errors: string[] = [];
const warnings: string[] = [];
const ok: string[] = [];
const fail = (m: string) => errors.push(m);

const runbook = fs.readFileSync(V("DRAAIBOEK.md"), "utf8");
const data = JSON.parse(fs.readFileSync(V("data/scenes.json"), "utf8"));
const scenes: Scene[] = data.scenes;
const territories = JSON.parse(fs.readFileSync("engine/maps-data/territories.json", "utf8"));

// ---------- parse the runbook ----------
// "### S16 | BG 002 + CUT 012 | parallax"
const headerRe = /^### (S\d{2}) \| ([^|]+?) \|/gm;
const rbScenes: { id: string; assets: string[] }[] = [];
for (const m of runbook.matchAll(headerRe)) rbScenes.push({ id: m[1], assets: m[2].split("+").map((a) => a.trim()) });

// CUES lines per scene: @"word"
const rbCues: Record<string, string[]> = {};
const blocks = runbook.split(/^### /m).slice(1);
for (const b of blocks) {
  const id = b.slice(0, 3);
  const cueLine = b.split("\n").find((l) => l.startsWith("CUES:"));
  rbCues[id] = cueLine ? [...cueLine.matchAll(/@"([^"]+)"/g)].map((m) => m[1]) : [];
}

// Asset checklist: "| 002 | Wide steppe with yurts | S03, S16 (background) |"
const checklist: { asset: string; scenes: string[] }[] = [];
const clStart = runbook.indexOf("## Asset checklist");
for (const line of runbook.slice(clStart).split("\n")) {
  const m = line.match(/^\|\s*(\d{3}|GFX-\d{2})\s*\|[^|]*\|\s*([^|]+)\|/);
  if (m) checklist.push({ asset: m[1], scenes: [...m[2].matchAll(/S\d{2}/g)].map((x) => x[0]) });
}
// "MAP-01 to MAP-10 | see scenes": take the map scenes from the scene headers.
// A runbook without an asset checklist (shot-list runbooks) takes every asset from the scene headers.
const mapUse: Record<string, string[]> = {};
const fromHeaders = (a: string) => a.startsWith("MAP-") || clStart < 0;
for (const s of rbScenes) for (const a of s.assets) if (fromHeaders(a)) (mapUse[a.replace(/^IMG /, "")] ??= []).push(s.id);
for (const [asset, sc] of Object.entries(mapUse)) checklist.push({ asset, scenes: sc });

// ---------- 1. scene list, order, assets ----------
if (rbScenes.length !== scenes.length) fail(`runbook has ${rbScenes.length} scenes, build has ${scenes.length}`);
rbScenes.forEach((rb, i) => {
  const s = scenes[i];
  if (!s) return fail(`${rb.id} missing from build`);
  if (s.id !== rb.id) fail(`position ${i + 1}: runbook ${rb.id}, build ${s.id} (order mismatch)`);
  if (JSON.stringify(s.assets) !== JSON.stringify(rb.assets)) fail(`${rb.id}: runbook assets [${rb.assets}] vs build [${s.assets}]`);
});
const paragraphs = fs.readFileSync(V("script.txt"), "utf8").split(/\n\s*\n/).filter((p) => p.trim());
if (paragraphs.length !== rbScenes.length) fail(`script.txt has ${paragraphs.length} paragraphs, runbook ${rbScenes.length} scenes`);

// ---------- what each built scene actually puts on screen ----------
const imageNo = (src: string) => {
  const b = path.basename(src);
  const photo = b.match(/^photo-(\d{2})\./);
  return photo ? `PHOTO-${photo[1]}` : b.match(/^(\d{3})\./)?.[1];
};
const mapId = (id: string) => id.replace(/[a-z]$/, ""); // MAP-21b = second state of MAP-21
const usedBy = (s: Scene): string[] => {
  const used: string[] = [];
  if (s.image) used.push(imageNo(s.image)!);
  if (s.background) used.push(imageNo(s.background.src)!);
  for (const sp of s.sprites ?? []) used.push(imageNo(sp.src)!);
  if (s.map) used.push(s.map.id);
  if (s.type === "gfx") used.push("GFX-01");
  for (const sh of s.shots ?? []) {
    const a = sh.image ? imageNo(sh.image)! : sh.map ? mapId(sh.map.id) : undefined;
    if (a && !used.includes(a)) used.push(a);
  }
  return used;
};
// the declared assets must match what is rendered
for (const s of scenes) {
  const declared = s.assets.map((a) => a.replace(/^(IMG|BG|CUT) /, ""));
  if (s.shots) declared.splice(0, declared.length, ...[...new Set(declared)]);
  const rendered = usedBy(s);
  if (JSON.stringify([...declared].sort()) !== JSON.stringify([...rendered].sort()))
    fail(`${s.id}: declares [${declared}] but renders [${rendered}]`);
}

// ---------- 2 + 3. checklist: each asset in exactly its scenes ----------
for (const { asset, scenes: expected } of checklist) {
  const actual = scenes.filter((s) => usedBy(s).includes(asset)).map((s) => s.id);
  const missing = expected.filter((x) => !actual.includes(x));
  const extra = actual.filter((x) => !expected.includes(x));
  if (missing.length) fail(`asset ${asset}: not used in ${missing.join(", ")} (runbook lists ${expected.join(", ")})`);
  if (extra.length) fail(`asset ${asset}: used in ${extra.join(", ")} where the runbook does not list it`);
  if (!missing.length && !extra.length) ok.push(`${asset} → ${actual.join(", ")}`);
}
for (const s of scenes) for (const a of usedBy(s)) if (!checklist.some((c) => c.asset === a)) fail(`${s.id} uses ${a}, which is not in the asset checklist`);

// ---------- 4. files exist ----------
const mustExist = new Set<string>([V("public", data.meta.audio)]);
const sprites = new Set<string>();
for (const s of scenes) {
  if (s.image) mustExist.add(V("public", s.image));
  for (const sh of s.shots ?? []) if (sh.image) mustExist.add(V("public", sh.image));
  if (s.background) mustExist.add(V("public", s.background.src));
  for (const sp of s.sprites ?? []) {
    mustExist.add(V("public", sp.src));
    sprites.add(V("public", sp.src));
  }
}
// every numbered image in the checklist must exist
for (const c of checklist) {
  const n = c.asset.match(/^\d{3}$/)?.[0];
  if (n && !fs.existsSync(V(`public/images/${n}.jpg`)) && !fs.existsSync(V(`public/images/${n}.png`))) fail(`public/images/${n}.jpg missing`);
}
for (const f of mustExist) if (!fs.existsSync(f)) fail(`missing file ${f}`);
for (const s of scenes) for (const m of [s.map, ...(s.shots ?? []).map((sh) => sh.map)]) for (const st of m?.states ?? []) for (const l of st.layers)
  if (!territories[l.territory]) fail(`${s.id}: territory "${l.territory}" not in engine/maps-data/territories.json`);
// shots: inside their scene, in order
for (const s of scenes) (s.shots ?? []).forEach((sh, i, arr) => {
  if (i > 0 && (sh.at < s.start - 0.05 || sh.at >= s.end)) fail(`${s.id}: shot ${i + 1} starts at ${sh.at}s, outside the scene (${s.start}–${s.end})`);
  if (i > 0 && sh.at <= arr[i - 1].at) fail(`${s.id}: shot ${i + 1} does not start after shot ${i}`);
});
// cutouts (sprites) must really be transparent PNGs
for (const f of sprites) {
  if (!fs.existsSync(f)) continue;
  const png = fs.readFileSync(f);
  if (!f.endsWith(".png") || png.readUInt8(25) !== 6) fail(`${f} is not an RGBA PNG`);
}

// ---------- 5. timing: contiguous, no gaps/overlaps ----------
if (scenes[0].startFrame !== 0) fail(`first scene starts at frame ${scenes[0].startFrame}, not 0`);
for (let i = 1; i < scenes.length; i++) {
  const a = scenes[i - 1], b = scenes[i];
  if (b.startFrame > a.endFrame) fail(`gap between ${a.id} (ends ${a.endFrame}) and ${b.id} (starts ${b.startFrame})`);
  if (b.startFrame < a.endFrame) fail(`overlap between ${a.id} (ends ${a.endFrame}) and ${b.id} (starts ${b.startFrame})`);
  if (b.endFrame <= b.startFrame) fail(`${b.id} has no duration`);
}
const last = scenes[scenes.length - 1];
if (last.endFrame !== data.meta.durationInFrames) fail(`last scene ends at ${last.endFrame}, video is ${data.meta.durationInFrames} frames`);
const expectedDur = Math.round((data.meta.audioDuration + 1.5) * data.meta.fps);
if (Math.abs(data.meta.durationInFrames - expectedDur) > 1) fail(`duration ${data.meta.durationInFrames} ≠ voiceover + 1.5 s (${expectedDur})`);

// ---------- 6. cues ----------
for (const s of scenes) {
  const want = rbCues[s.id] ?? [];
  const got = s.cues.map((c) => c.word);
  if (JSON.stringify(want) !== JSON.stringify(got)) fail(`${s.id}: runbook cues [${want.join(", ")}] vs build [${got.join(", ")}]`);
  for (const c of s.cues) {
    if (c.frame < s.startFrame || c.frame >= s.endFrame) fail(`${s.id}: cue @"${c.word}" at frame ${c.frame} is outside the scene`);
    if (!c.exact) warnings.push(`${s.id}: cue @"${c.word}" resolved to the closest match`);
  }
}

// ---------- 7. shots: no cuts back to the same image, no picture held longer than 8 s ----------
const fps = data.meta.fps;
for (const s of scenes) (s.shots ?? []).forEach((sh, i, arr) => {
  if (i > 0 && sh.image && sh.image === arr[i - 1].image)
    fail(`${s.id}: shots ${i} and ${i + 1} both show ${sh.image} (a jump cut). Use one shot with a camera \`path\` instead`);
  const end = i < arr.length - 1 ? arr[i + 1].at : s.end;
  const start = i === 0 ? s.start : sh.at;
  const beats = Math.max(1, (sh.kenBurns?.path?.length ?? 1) - 0);
  if ((end - start) / beats > 8.5 && !sh.graphic && !sh.map) warnings.push(`${s.id}: shot ${i + 1} holds ${(end - start).toFixed(1)} s without a new picture or camera beat`);
});

// ---------- 8. map lines over water (arrows and routes should follow land, rivers, passes) ----------
const land = JSON.parse(fs.readFileSync("engine/maps-data/land.json", "utf8"));
for (const s of scenes) for (const m of [s.map, ...(s.shots ?? []).map((sh) => sh.map)]) for (const l of m?.lines ?? []) {
  if (l.overWater || l.river || !["arrow", "route"].includes(l.style) || !l.path || l.path.length < 2) continue;
  let water = 0, n = 0;
  for (let i = 0; i < l.path.length - 1; i++) for (let k = 0; k < 12; k++) {
    const f = k / 12, a = l.path[i], b = l.path[i + 1];
    n++;
    if (!geoContains(land, [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f])) water++;
  }
  if (water / n > 0.15) warnings.push(`${s.id} ${m!.id}: line "${l.id}" runs ${Math.round((100 * water) / n)}% over water. Follow land, or set overWater: true if that is real (sea crossing, missile)`);
}

// ---------- report ----------
console.log(`Runbook: ${rbScenes.length} scenes, ${checklist.length} checklist assets, ${Object.values(rbCues).flat().length} cues`);
for (const o of ok) console.log(`  ok  ${o}`);
for (const w of warnings) console.log(`  WARN ${w}`);
if (errors.length) {
  for (const e of errors) console.log(`  ERROR ${e}`);
  console.log(`\nFAILED: ${errors.length} error(s)`);
  process.exit(1);
}
console.log(`\nPASSED: scenes in order, contiguous (${scenes[0].startFrame}–${last.endFrame}), all assets in their listed scenes, all files present, all cues resolved.`);
