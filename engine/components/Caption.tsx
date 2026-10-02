import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
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

/** Bottom-centre captions, word-by-word highlight, max two lines. */
export const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const page = pages.find((p) => t >= p.start - 0.05 && t < p.end);
  // fades shrink on very short pages (a lone last word) so the keyframes stay increasing
  const fade = page ? Math.min(0.12, (page.end - page.start) / 2 - 0.001) : 0.12;

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
            opacity: interpolate(t, [page.start - 0.05, page.start + fade, page.end - fade, page.end], [0, 1, 1, 0], {
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
