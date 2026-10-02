import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { config } from "../config";
import timings from "@video/data/timings.json";
import { theme } from "../theme";

export type TimedWord = { text: string; start: number; end: number; scene: string };
type Page = { start: number; end: number; words: TimedWord[] };

const MAX_CHARS = 72; // ~2 lines at the caption size
const SOFT_BREAK = 34; // after this many chars, break at a comma / sentence end

/**
 * Groups the aligned script words (correct spelling, VO timing) into caption pages:
 * never across a scene boundary, at most two lines, preferring punctuation breaks.
 */
export const buildPages = (words: TimedWord[]): Page[] => {
  const pages: Page[] = [];
  let cur: TimedWord[] = [];
  const len = (ws: TimedWord[]) => ws.reduce((n, w) => n + w.text.length + 1, 0);
  const flush = () => {
    if (cur.length) pages.push({ start: cur[0].start, end: cur[cur.length - 1].end, words: cur });
    cur = [];
  };
  words.forEach((w, i) => {
    if (cur.length && (cur[0].scene !== w.scene || len(cur) + w.text.length > MAX_CHARS)) flush();
    cur.push(w);
    const next = words[i + 1];
    if (len(cur) >= SOFT_BREAK && /[.,:;!?]$/.test(w.text) && (!next || len(cur) + next.text.length > SOFT_BREAK)) flush();
    else if (/[.!?]$/.test(w.text) && len(cur) >= MAX_CHARS * 0.6) flush();
  });
  flush();
  // each page holds until the next one starts (short pauses), but not forever
  pages.forEach((p, i) => {
    const next = pages[i + 1];
    p.end = next ? Math.min(next.start, p.end + 1.2) : p.end + 1.2;
  });
  return pages;
};

const pages = buildPages((timings as { words: TimedWord[] }).words);

/**
 * Fade-in / fade-out keyframes for a caption page. Pages shorter than ~0.25 s would give a
 * non-increasing range, so the inner points meet in the middle (normal pages are unchanged).
 */
const fadeRange = (start: number, end: number) => {
  const mid = (start + end) / 2;
  return [start - 0.05, Math.min(start + 0.12, mid - 0.001), Math.max(end - 0.12, mid + 0.001), Math.max(end, mid + 0.002)];
};

/** Bottom-centre captions, word-by-word highlight, max two lines. */
const ClassicCaptions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const page = pages.find((p) => t >= p.start - 0.05 && t < p.end);

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* bottom band for legibility */}
      <AbsoluteFill style={{ background: "linear-gradient(0deg, rgba(18,10,4,0.6) 0%, rgba(18,10,4,0.28) 13%, transparent 25%)" }} />
      {page && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: 62,
            width: 1440,
            transform: `translateX(-50%) translateY(${interpolate(t, [page.start - 0.05, page.start + 0.15], [10, 0], { easing: theme.ease.out, extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
            opacity: interpolate(t, fadeRange(page.start, page.end), [0, 1, 1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            textAlign: "center",
            fontFamily: theme.fonts.sans,
            fontWeight: 600,
            fontSize: 46,
            lineHeight: 1.3,
            textWrap: "balance",
            textShadow: "0 2px 4px rgba(0,0,0,0.8), 0 4px 20px rgba(0,0,0,0.55)",
          }}
        >
          {page.words.map((w, i) => {
            const spoken = t >= w.start;
            const active = spoken && t < w.end + 0.08;
            const lit = interpolate(t, [w.start - 0.04, w.start + 0.06], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            return (
              <span
                key={i}
                style={{
                  color: active ? theme.colors.ochre : theme.colors.text,
                  opacity: 0.5 + 0.5 * lit,
                }}
              >
                {w.text}
                {i < page.words.length - 1 ? " " : ""}
              </span>
            );
          })}
        </div>
      )}
    </AbsoluteFill>
  );
};

// ---------------- kinetic captions ----------------
// Short chunks (3 to 5 words, one line); words appear as they are spoken with a small pop;
// names, numbers and years are highlighted. Chosen with `meta.captions: { style: "kinetic" }`.

const MAX_WORDS = 5;
const MIN_WORDS = 3;

/** Splits words into short one-line chunks, preferring punctuation, never across scenes. */
export const buildChunks = (words: TimedWord[]): Page[] => {
  const out: Page[] = [];
  let cur: TimedWord[] = [];
  const flush = () => {
    if (cur.length) out.push({ start: cur[0].start, end: cur[cur.length - 1].end, words: cur });
    cur = [];
  };
  words.forEach((w, i) => {
    if (cur.length && cur[0].scene !== w.scene) flush();
    cur.push(w);
    const next = words[i + 1];
    const punct = /[.,:;!?]$/.test(w.text);
    const gap = next ? next.start - w.end > 0.35 : true;
    if (cur.length >= MAX_WORDS || (cur.length >= MIN_WORDS && (punct || gap)) || /[.!?]$/.test(w.text)) flush();
  });
  flush();
  out.forEach((p, i) => {
    const next = out[i + 1];
    p.end = next ? Math.min(next.start, p.end + 0.8) : p.end + 0.8;
  });
  return out;
};

/** Words worth a highlight: numbers, years, and capitalised names that are not the first word of a sentence. */
const isKey = (w: TimedWord, prev?: TimedWord) => {
  const t = w.text.replace(/[^\p{L}\p{N}'-]/gu, "");
  if (/\d/.test(t)) return true;
  const sentenceStart = !prev || /[.!?]$/.test(prev.text);
  return !sentenceStart && /^\p{Lu}/u.test(t) && t.length > 2 && !["The", "In", "On", "At", "But", "And"].includes(t);
};

const chunks = buildChunks((timings as { words: TimedWord[] }).words);

export const KineticCaptions: React.FC<{ size?: number; highlight?: boolean }> = ({ size = 56, highlight = true }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const idx = chunks.findIndex((p) => t >= p.start - 0.04 && t < p.end);
  const page = idx >= 0 ? chunks[idx] : undefined;
  const allWords = (timings as { words: TimedWord[] }).words;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ background: "linear-gradient(0deg, rgba(18,10,4,0.5) 0%, rgba(18,10,4,0.2) 12%, transparent 22%)" }} />
      {page && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: 78,
            transform: "translateX(-50%)",
            whiteSpace: "nowrap",
            fontFamily: theme.fonts.sans,
            fontWeight: 700,
            fontSize: size,
            lineHeight: 1.2,
            textShadow: "0 3px 6px rgba(0,0,0,0.85), 0 6px 24px rgba(0,0,0,0.5)",
            opacity: interpolate(t, [page.end - 0.12, page.end], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}
        >
          {page.words.map((w, i) => {
            const shown = t >= w.start - 0.04;
            const pop = spring({ frame: (t - w.start + 0.04) * fps, fps, config: { damping: 13, stiffness: 220, mass: 0.5 } });
            const gi = allWords.indexOf(w);
            const key = highlight && isKey(w, allWords[gi - 1]);
            const speaking = t >= w.start && t < w.end + 0.05;
            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  marginRight: i < page.words.length - 1 ? "0.3em" : 0,
                  color: key ? theme.colors.ochre : theme.colors.text,
                  fontWeight: key ? 800 : 700,
                  opacity: shown ? 1 : 0,
                  // pop in from slightly below; no lasting scale, so the spacing between words stays even
                  transform: `translateY(${(1 - pop) * 14 - (speaking ? 2 : 0)}px) scale(${0.85 + 0.15 * pop})`,
                  transformOrigin: "50% 100%",
                }}
              >
                {w.text}
              </span>
            );
          })}
        </div>
      )}
    </AbsoluteFill>
  );
};

/** Caption style per video: `meta.captions: { style: "classic" | "kinetic" | "off", size?, highlight? }` (default classic). */
export const Captions: React.FC = () => {
  const c = (config.meta as { captions?: { style?: string; size?: number; highlight?: boolean } }).captions;
  if (c?.style === "off") return null;
  if (c?.style === "kinetic") return <KineticCaptions size={c.size} highlight={c.highlight} />;
  return <ClassicCaptions />;
};
