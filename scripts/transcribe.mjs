// Transcribes videos/<slug>/public/audio/voiceover.mp3 with whisper.cpp (word-level timestamps)
// and writes videos/<slug>/data/transcript.json: { words: [{ text, start, end }] } in seconds.
// Usage: node scripts/transcribe.mjs
import fs from "node:fs";
import { V } from "./video.mjs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { downloadWhisperModel, installWhisperCpp, toCaptions, transcribe } from "@remotion/install-whisper-cpp";

const WHISPER_DIR = path.resolve("whisper.cpp");
const WHISPER_VERSION = "1.5.5"; // last release that builds with plain `make` (no cmake needed)
const MODEL = process.env.WHISPER_MODEL ?? "medium.en"; // base.en is much faster on a 2-core machine and good enough for word timings
const AUDIO = V("public/audio/voiceover.mp3");
const WAV = path.resolve("whisper.cpp/voiceover-16k.wav"); // whisper runs in its own cwd
const OUT = V("data/transcript.json");

await installWhisperCpp({ to: WHISPER_DIR, version: WHISPER_VERSION });
await downloadWhisperModel({ model: MODEL, folder: WHISPER_DIR });

// whisper.cpp wants 16 kHz mono PCM
execFileSync("ffmpeg", ["-v", "error", "-y", "-i", AUDIO, "-ar", "16000", "-ac", "1", "-c:a", "pcm_s16le", WAV]);

const output = await transcribe({
  inputPath: WAV,
  whisperPath: WHISPER_DIR,
  whisperCppVersion: WHISPER_VERSION,
  model: MODEL,
  tokenLevelTimestamps: true,
});
const { captions } = toCaptions({ whisperCppOutput: output });

// whisper.cpp returns sub-word tokens (" nom" + "adic"): a token that starts with a space
// begins a new word, anything else is glued onto the previous word (incl. punctuation).
const words = [];
for (const c of captions) {
  const raw = c.text;
  if (!raw.trim() || /^\s*\[.*\]\s*$/.test(raw)) continue;
  const prev = words[words.length - 1];
  if (prev && !/^\s/.test(raw)) {
    prev.text += raw.trim();
    prev.end = c.endMs / 1000;
  } else {
    words.push({ text: raw.trim(), start: c.startMs / 1000, end: c.endMs / 1000 });
  }
}

fs.writeFileSync(OUT, JSON.stringify({ source: AUDIO, model: MODEL, words }, null, 1));
console.log(`wrote ${OUT}: ${words.length} words, last ends at ${words.at(-1)?.end}s`);
