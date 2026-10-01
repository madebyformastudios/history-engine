// Aligns script.txt (correct spelling, one paragraph per scene) to the word-level
// transcript of the voiceover and writes src/data/timings.json:
//   words:  every script word with start/end seconds and its scene id (used for captions + cues)
//   scenes: S01..Snn with start = first word, end = next scene's start
// The voiceover was generated from script_elevenlabs.txt, so years are spoken ("twelve oh six")
// and names are phonetic ("Temoojin"). Both sides are normalised to spoken lowercase tokens
// and aligned globally (Needleman-Wunsch) with a fuzzy phonetic similarity score.
// Usage: node scripts/align.mjs
import fs from "node:fs";
import { execFileSync } from "node:child_process";

const SCRIPT = "script.txt";
const TRANSCRIPT = "src/data/transcript.json";
const AUDIO = "public/audio/voiceover.mp3";
const OUT = "src/data/timings.json";
const FADE_OUT = 1.5; // seconds of fade to black after the voiceover

// ---------- number → spoken words ----------
const ONES = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
const TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
const twoDigits = (n) => (n < 20 ? ONES[n] : TENS[Math.floor(n / 10)] + (n % 10 ? ` ${ONES[n % 10]}` : ""));
const PLURAL = { twenty: "twenties", thirty: "thirties", forty: "forties", fifty: "fifties", sixty: "sixties", seventy: "seventies", eighty: "eighties", ninety: "nineties" };
/** 1206 → "twelve oh six", 1340s → "thirteen forties", 1480 → "fourteen eighty". */
const spellNumber = (raw) => {
  const plural = /s$/.test(raw);
  const n = parseInt(raw.replace(/\D/g, ""), 10);
  if (Number.isNaN(n)) return raw;
  let words;
  if (n >= 1000 && n < 2000) {
    const hi = Math.floor(n / 100), lo = n % 100;
    words = `${twoDigits(hi)} ${lo === 0 ? "hundred" : lo < 10 ? `oh ${ONES[lo]}` : twoDigits(lo)}`;
  } else if (n < 100) words = twoDigits(n);
  else words = String(n);
  if (plural) {
    const parts = words.split(" ");
    parts[parts.length - 1] = PLURAL[parts[parts.length - 1]] ?? `${parts[parts.length - 1]}s`;
    words = parts.join(" ");
  }
  return words;
};

/** Word → spoken lowercase tokens. */
const tokens = (word) =>
  word
    .toLowerCase()
    .replace(/[’']s\b/g, "s")
    .split(/[\s\-–—]+/)
    .flatMap((w) => (/\d/.test(w) ? spellNumber(w.replace(/[^\d s]/g, "")).split(" ") : [w]))
    .map((w) => w.replace(/[^a-z0-9]/g, ""))
    .filter(Boolean);

// ---------- fuzzy phonetic similarity ----------
const phonetic = (w) =>
  w
    .replace(/ph/g, "f")
    .replace(/ck/g, "k")
    .replace(/q/g, "k")
    .replace(/x/g, "sh")
    .replace(/zh/g, "j")
    .replace(/kh/g, "k")
    .replace(/c(?=[aou])/g, "k")
    .replace(/oo|ou|u/g, "u")
    .replace(/ee|ea|y/g, "i")
    .replace(/z/g, "s")
    .replace(/(.)\1+/g, "$1")
    .replace(/h$/g, "");
const lev = (a, b) => {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
};
const sim = (a, b) => {
  if (a === b) return 1;
  const pa = phonetic(a), pb = phonetic(b);
  if (pa === pb) return 0.95;
  return Math.max(0, 1 - lev(pa, pb) / Math.max(pa.length, pb.length));
};

// ---------- inputs ----------
const paragraphs = fs.readFileSync(SCRIPT, "utf8").split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
const sceneIds = paragraphs.map((_, i) => `S${String(i + 1).padStart(2, "0")}`);
const scriptWords = paragraphs.flatMap((p, si) => p.split(/\s+/).map((text) => ({ text, scene: sceneIds[si] })));
const transcript = JSON.parse(fs.readFileSync(TRANSCRIPT, "utf8")).words;
const audioDuration = parseFloat(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", AUDIO]).toString());

const A = scriptWords.flatMap((w, wi) => tokens(w.text).map((tok) => ({ tok, wi })));
const B = transcript.flatMap((w, ti) => tokens(w.text).map((tok) => ({ tok, ti })));

// ---------- global alignment ----------
const GAP = -0.6;
const n = A.length, m = B.length;
const score = Array.from({ length: n + 1 }, () => new Float64Array(m + 1));
const move = Array.from({ length: n + 1 }, () => new Uint8Array(m + 1)); // 1 diag, 2 up (skip A), 3 left (skip B)
for (let i = 1; i <= n; i++) { score[i][0] = i * GAP; move[i][0] = 2; }
for (let j = 1; j <= m; j++) { score[0][j] = j * GAP; move[0][j] = 3; }
for (let i = 1; i <= n; i++)
  for (let j = 1; j <= m; j++) {
    const s = sim(A[i - 1].tok, B[j - 1].tok);
    const diag = score[i - 1][j - 1] + (s >= 0.5 ? 2 * s : -1);
    const up = score[i - 1][j] + GAP, left = score[i][j - 1] + GAP;
    if (diag >= up && diag >= left) { score[i][j] = diag; move[i][j] = 1; }
    else if (up >= left) { score[i][j] = up; move[i][j] = 2; }
    else { score[i][j] = left; move[i][j] = 3; }
  }
const pairs = []; // [aIndex, bIndex, sim]
for (let i = n, j = m; i > 0 || j > 0; ) {
  const mv = move[i][j];
  if (mv === 1) { pairs.push([i - 1, j - 1, sim(A[i - 1].tok, B[j - 1].tok)]); i--; j--; }
  else if (mv === 2) i--;
  else j--;
}
pairs.reverse();

// ---------- script word timings ----------
const words = scriptWords.map((w) => ({ ...w, start: null, end: null, heard: [], score: 0, n: 0 }));
for (const [ai, bi, s] of pairs) {
  const w = words[A[ai].wi];
  const tw = transcript[B[bi].ti];
  w.start = w.start === null ? tw.start : Math.min(w.start, tw.start);
  w.end = w.end === null ? tw.end : Math.max(w.end, tw.end);
  if (!w.heard.includes(tw.text)) w.heard.push(tw.text);
  w.score += s;
  w.n++;
}
// words that matched nothing: interpolate between neighbours
const unaligned = [];
for (let i = 0; i < words.length; i++) {
  if (words[i].start !== null) continue;
  unaligned.push(`${words[i].scene} "${words[i].text}"`);
  const prev = words.slice(0, i).reverse().find((w) => w.end !== null);
  let k = i;
  while (k < words.length && words[k].start === null) k++;
  const next = words[k];
  const a = prev?.end ?? 0, b = next?.start ?? a + 0.3 * (k - i);
  const step = (b - a) / (k - i);
  for (let q = i; q < k; q++) { words[q].start = a + step * (q - i); words[q].end = words[q].start + step; }
}
// Whisper often starts a word at the end of the preceding pause. Snap any start that falls
// inside a detected silence to the speech onset at the end of that silence.
const silences = [];
{
  const log = execFileSync("sh", ["-c", `ffmpeg -hide_banner -i "${AUDIO}" -af silencedetect=noise=-38dB:d=0.12 -f null - 2>&1`]).toString();
  let s0 = null;
  for (const line of log.split("\n")) {
    const a = line.match(/silence_start: ([\d.]+)/);
    const b = line.match(/silence_end: ([\d.]+)/);
    if (a) s0 = parseFloat(a[1]);
    if (b && s0 !== null) { silences.push([s0, parseFloat(b[1])]); s0 = null; }
  }
}
let snapped = 0;
for (const w of words) {
  const sil = silences.find(([a, b]) => w.start >= a - 0.02 && w.start < b - 0.04);
  if (sil) {
    w.start = Math.max(w.start, sil[1] - 0.04);
    w.end = Math.max(w.end, w.start + 0.15);
    snapped++;
  }
}
// a snapped word can land on top of the next one: keep a minimal spacing
for (let i = 1; i < words.length; i++) {
  if (words[i].start < words[i - 1].start + 0.1) words[i].start = words[i - 1].start + 0.1;
  if (words[i].end < words[i].start + 0.05) words[i].end = words[i].start + 0.05;
}

// enforce monotonic, non-overlapping words
for (let i = 1; i < words.length; i++) {
  if (words[i].start < words[i - 1].start) words[i].start = words[i - 1].start;
  if (words[i - 1].end > words[i].start) words[i - 1].end = Math.max(words[i - 1].start + 0.02, words[i].start);
  if (words[i].end < words[i].start) words[i].end = words[i].start + 0.05;
}

const voiceEnd = words[words.length - 1].end;
const duration = Math.round((audioDuration + FADE_OUT) * 1000) / 1000;
const scenes = sceneIds.map((id, i) => {
  const first = words.find((w) => w.scene === id);
  return { id, start: i === 0 ? 0 : first.start, firstWord: first.text, vo: paragraphs[i] };
});
scenes.forEach((s, i) => (s.end = i < scenes.length - 1 ? scenes[i + 1].start : duration));

const round = (x) => Math.round(x * 1000) / 1000;
const out = {
  source: { script: SCRIPT, transcript: TRANSCRIPT, audio: AUDIO },
  audioDuration: round(audioDuration),
  voiceEnd: round(voiceEnd),
  fadeOut: FADE_OUT,
  duration,
  scenes: scenes.map((s) => ({ ...s, start: round(s.start), end: round(s.end) })),
  words: words.map((w) => ({
    text: w.text,
    scene: w.scene,
    start: round(w.start),
    end: round(w.end),
    heard: w.heard.join(" "),
    confidence: w.n ? round(w.score / w.n) : 0,
  })),
  unaligned,
};
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
const weak = out.words.filter((w) => w.confidence < 0.75);
console.log(`wrote ${OUT}: ${scenes.length} scenes, ${words.length} words, voice ends ${round(voiceEnd)}s, total ${duration}s`);
console.log(`silences: ${silences.length}, word starts snapped to speech onset: ${snapped}`);
console.log(`unaligned words (${unaligned.length}): ${unaligned.join(", ") || "none"}`);
console.log(`fuzzy matches (${weak.length}): ${weak.map((w) => `${w.text}~"${w.heard}"`).join(", ")}`);
