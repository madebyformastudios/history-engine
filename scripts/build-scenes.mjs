// Resolves videos/<slug>/scene-spec.mjs against data/timings.json and writes data/scenes.json.
//   - scene start/end come from the voiceover alignment (seconds + frames)
//   - every "@word" reference is resolved to the moment that word is spoken in that scene
//   - runbook cues are resolved in order and stored per scene with their frame
// Usage: node scripts/build-scenes.mjs
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { V } from "./video.mjs";
const spec = await import(pathToFileURL(path.resolve(V("scene-spec.mjs"))).href);

const TIMINGS = V("data/timings.json");
const OUT = V("data/scenes.json");
const timings = JSON.parse(fs.readFileSync(TIMINGS, "utf8"));
const fps = spec.meta.fps;
const frameOf = (s) => Math.round(s * fps);
const round = (x) => Math.round(x * 1000) / 1000;

const norm = (w) => w.toLowerCase().replace(/[’']s$/, "").replace(/[^a-z0-9]/g, "");
const lev = (a, b) => {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
};

if (spec.scenes.length !== timings.scenes.length) {
  throw new Error(`scene-spec has ${spec.scenes.length} scenes but script.txt has ${timings.scenes.length} paragraphs`);
}

const problems = [];
const anchorsUsed = [];

/** Finds phrase `key` (one or more words) in the scene's words from index `from`; fuzzy fallback. */
const findPhrase = (words, phrase, from = 0) => {
  const parts = phrase.split(/\s+/).map(norm).filter(Boolean);
  const hit = (i) => parts.every((p, k) => words[i + k] && norm(words[i + k].text) === p);
  for (let i = from; i < words.length; i++) if (hit(i)) return { index: i, exact: true };
  for (let i = 0; i < from; i++) if (hit(i)) return { index: i, exact: true };
  // closest match (edit distance on the first word)
  let best = { index: 0, d: Infinity };
  words.forEach((w, i) => {
    const d = lev(norm(w.text), parts[0]) / Math.max(parts[0].length, 1);
    if (d < best.d) best = { index: i, d };
  });
  return { index: best.index, exact: false };
};

const scenes = spec.scenes.map((s, si) => {
  const tm = timings.scenes[si];
  if (s.id !== tm.id) throw new Error(`scene order mismatch: spec ${s.id} vs timings ${tm.id}`);
  const words = timings.words.filter((w) => w.scene === s.id);

  // 1) runbook cues, in order
  const cueTimes = {};
  let cursor = 0;
  const cues = (s.cues ?? []).map((c) => {
    const { index, exact } = findPhrase(words, c.word, cursor);
    cursor = index + 1;
    const t = words[index].start;
    const matched = c.word.split(/\s+/).length > 1 ? words.slice(index, index + c.word.split(/\s+/).length).map((w) => w.text).join(" ") : words[index].text;
    cueTimes[norm(c.word.replace(/\s+/g, ""))] = t;
    cueTimes[c.word.split(/\s+/).map(norm).join(" ")] = t;
    if (!exact) problems.push(`${s.id} cue @"${c.word}" not found; closest word "${matched}" at ${t.toFixed(2)}s`);
    return { word: c.word, action: c.action, t: round(t), frame: frameOf(t), matched, exact };
  });

  // 2) any "@word" / "^+x" / "$-x" string inside the scene
  const resolveRef = (ref) => {
    const key = ref.split(/\s+/).map(norm).join(" ");
    if (key in cueTimes) return cueTimes[key];
    const { index, exact } = findPhrase(words, ref);
    anchorsUsed.push(`${s.id} @"${ref}" → "${words[index].text}" ${words[index].start.toFixed(2)}s${exact ? "" : " (closest match)"}`);
    if (!exact) problems.push(`${s.id} anchor @"${ref}" not found; used "${words[index].text}"`);
    return words[index].start;
  };
  const resolveTime = (str) => {
    let m = str.match(/^@(.+?)-@(.+)$/);
    if (m) return resolveRef(m[1]) - resolveRef(m[2]);
    m = str.match(/^([@^$])(.*?)([+-]\d*\.?\d+)?$/);
    if (!m) return str;
    const off = m[3] ? parseFloat(m[3]) : 0;
    if (m[1] === "^") return tm.start + off;
    if (m[1] === "$") return tm.end + off;
    return resolveRef(m[2]) + off;
  };
  const walk = (v) => {
    if (typeof v === "string" && /^[@^$]/.test(v)) return round(resolveTime(v));
    if (Array.isArray(v)) return v.map(walk);
    if (v && typeof v === "object") {
      const o = {};
      for (const [k, x] of Object.entries(v)) if (x !== undefined) o[k] = walk(x);
      // lines: `until` → duration
      if ("until" in o && "at" in o) {
        o.duration = round(Math.max(0.3, o.until - o.at));
        delete o.until;
      }
      return o;
    }
    return v;
  };

  const { cues: _c, ...rest } = s;
  const body = walk(rest);
  return {
    ...body,
    start: round(tm.start),
    end: round(tm.end),
    startFrame: frameOf(tm.start),
    endFrame: frameOf(tm.end),
    vo: tm.vo,
    cues,
  };
});

const duration = timings.duration;
const out = {
  meta: {
    ...spec.meta,
    duration,
    durationInFrames: frameOf(duration),
    voiceEnd: timings.voiceEnd,
    audioDuration: timings.audioDuration,
    fadeOut: { start: round(duration - timings.fadeOut), end: duration },
  },
  overlay: spec.overlay,
  map: spec.map,
  scenes,
};
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log(`wrote ${OUT}: ${scenes.length} scenes, ${out.meta.durationInFrames} frames (${duration}s)`);
for (const s of scenes) for (const c of s.cues) console.log(`  ${s.id} @"${c.word}" → "${c.matched}" ${c.t}s frame ${c.frame}${c.exact ? "" : "  (CLOSEST MATCH)"}`);
console.log(`anchors: ${anchorsUsed.length}`);
for (const a of anchorsUsed) console.log(`  ${a}`);
if (problems.length) {
  console.log("PROBLEMS:");
  for (const p of problems) console.log(`  ${p}`);
}
fs.writeFileSync(V("data/cue-report.json"), JSON.stringify({ problems, anchors: anchorsUsed }, null, 1));
