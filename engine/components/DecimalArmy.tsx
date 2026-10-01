import { AbsoluteFill, interpolate, spring, useVideoConfig } from "remotion";
import type { DecimalStep } from "../config";
import { ramp, useSceneTime } from "../timing";
import { theme } from "../theme";

/**
 * GFX-01. Rider icons in a grid that multiplies 10 → 100 → 1,000 → 10,000 on cue while the
 * camera pulls back, with a big counting number and the Mongol unit name underneath.
 * Each stage is a block of whole cells: (cols × rows) that always contains the previous one.
 */
const STAGES: Record<number, [number, number]> = {
  1: [1, 1],
  10: [5, 2],
  100: [10, 10],
  1000: [40, 25],
  10000: [100, 100],
};

const CELL = 10; // world units per rider cell

/** Flat silhouette of a horse archer, drawn in a 10×10 cell, facing right. */
const RiderGlyph: React.FC<{ fill: string }> = ({ fill }) => (
  <g fill={fill}>
    {/* horse body, neck, head */}
    <ellipse cx={4.6} cy={6.1} rx={3.1} ry={1.35} />
    <path d="M6.9,5.6 L8.4,3.5 L9.5,3.7 L9.3,4.4 L8.5,4.5 L7.8,6.2 Z" />
    {/* legs mid-gallop */}
    <path d="M2.2,6.6 L1.2,8.6 L1.7,8.7 L2.9,6.9 Z M3.4,7 L3.3,9 L3.8,9 L4.1,7.1 Z M5.6,7 L6.6,8.8 L7.1,8.6 L6.3,6.8 Z M6.6,6.6 L8.1,7.9 L8.4,7.5 L7.2,6.3 Z" />
    {/* tail */}
    <path d="M1.7,5.6 Q0.4,5.6 0.3,7.1 Q0.9,6.3 1.8,6.3 Z" />
    {/* rider torso + head + helmet point */}
    <path d="M4.2,5.1 L4.5,2.9 L5.6,2.9 L5.6,5.1 Z" />
    <circle cx={5.05} cy={2.25} r={0.75} />
    <path d="M4.5,1.85 L5.05,0.9 L5.6,1.85 Z" />
    {/* bow */}
    <path d="M6.6,1.4 Q7.8,3 6.6,4.6" fill="none" stroke={fill} strokeWidth={0.38} />
    <path d="M5.4,3.3 L6.9,3.0" stroke={fill} strokeWidth={0.4} />
  </g>
);

const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

export const DecimalArmy: React.FC<{ steps: DecimalStep[]; sceneId: string }> = ({ steps, sceneId }) => {
  const { t, fps, frame } = useSceneTime();
  const { width, height } = useVideoConfig();

  // which stage are we in, and how far into its build
  const current = [...steps].reverse().find((s) => t >= s.at);
  const idx = current ? steps.indexOf(current) : -1;
  const prevValue = idx > 0 ? steps[idx - 1].value : 1;
  const value = current?.value ?? 1;
  // The VO names the units ~0.5 s apart, so every transition must finish before the next cue.
  const span = (i: number) => (i < steps.length - 1 ? Math.min(0.9, (steps[i + 1].at - steps[i].at) * 0.85) : 0.6);
  const grow = current ? ramp(t, current.at, span(idx), theme.ease.inOut) : 1;

  // visible block: grows continuously from the previous stage's block to this one;
  // whole cells are drawn, while camera and centring follow the continuous size
  const [pc, pr] = STAGES[prevValue];
  const [nc, nr] = STAGES[value];
  const cw = pc + (nc - pc) * grow;
  const ch = pr + (nr - pr) * grow;
  const cols = Math.round(cw);
  const rows = Math.round(ch);

  // camera fits the growing block (capped so the lone rider isn't huge)
  const fitScale = (c: number, r: number) => Math.min(28, 980 / (c * CELL + 6), 760 / (r * CELL + 6));
  const s = fitScale(cw, ch);

  // block is centred in the right part of the frame
  const blockW = cw * CELL, blockH = ch * CELL;
  const cxArea = 1290, cyArea = 520;
  const breathe = 1 + Math.sin(t * 1.1) * 0.006;

  // number counts up between stages
  const shown = interpolate(grow, [0, 1], [prevValue, value]);
  const numPop = current ? spring({ frame: (t - current.at) * fps, fps, config: theme.spring.snappy }) : 0;
  const pid = `${sceneId}-rider`;

  // first stage: the ten riders appear one by one (stagger), not as a block
  const tenStage = value === 10 && idx === 0;

  return (
    <AbsoluteFill style={{ background: theme.colors.parchment }}>
      {/* warm radial light so the parchment isn't flat */}
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 65% 45%, #F3E7CF 0%, ${theme.colors.parchment} 45%, ${theme.colors.parchmentDark} 120%)` }} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id={pid} width={CELL} height={CELL} patternUnits="userSpaceOnUse">
            <RiderGlyph fill={theme.colors.ink} />
          </pattern>
          <pattern id={`${pid}-new`} width={CELL} height={CELL} patternUnits="userSpaceOnUse">
            <RiderGlyph fill={theme.colors.terracotta} />
          </pattern>
        </defs>
        <g transform={`translate(${cxArea} ${cyArea}) scale(${s * breathe}) translate(${-blockW / 2} ${-blockH / 2})`}>
          {idx < 0 && (
            // before the first cue: a single rider waits in the first cell
            <g opacity={spring({ frame, fps, config: theme.spring.soft })}>
              <RiderGlyph fill={theme.colors.ink} />
            </g>
          )}
          {tenStage &&
            Array.from({ length: 10 }).map((_, i) => {
              const p = spring({ frame: (t - current!.at) * fps - i * 3, fps, config: theme.spring.snappy });
              const x = (i % 5) * CELL, y = Math.floor(i / 5) * CELL;
              return (
                <g key={i} transform={`translate(${x + CELL / 2} ${y + CELL / 2 + (1 - p) * 4}) scale(${p}) translate(${-CELL / 2} ${-CELL / 2})`} opacity={p}>
                  <RiderGlyph fill={i === 0 ? theme.colors.ink : theme.colors.terracotta} />
                </g>
              );
            })}
          {!tenStage && idx >= 0 && (
            <>
              {/* new riders in terracotta, the previous unit in ink */}
              <rect x={0} y={0} width={cols * CELL} height={rows * CELL} fill={`url(#${pid}-new)`} />
              <rect x={0} y={0} width={pc * CELL} height={pr * CELL} fill={`url(#${pid})`} />
              <rect x={-1} y={-1} width={pc * CELL + 2} height={pr * CELL + 2} fill="none" stroke={theme.colors.ink} strokeWidth={Math.max(0.4, 2 / s)} opacity={1 - grow * 0.4} />
            </>
          )}
        </g>
      </svg>

      {/* number + unit name */}
      <div style={{ position: "absolute", left: 120, top: 330, width: 620 }}>
        <div
          style={{
            fontFamily: theme.fonts.display,
            fontWeight: 700,
            fontSize: 190,
            lineHeight: 1,
            color: theme.colors.ink,
            fontVariantNumeric: "tabular-nums",
            transform: `scale(${1 + (1 - numPop) * 0.08})`,
            transformOrigin: "0% 50%",
            opacity: idx < 0 ? 0 : 1,
          }}
        >
          {fmt(shown)}
        </div>
        <div style={{ marginTop: 18, height: 3, width: 300 * (idx < 0 ? 0 : numPop), background: `linear-gradient(90deg, ${theme.colors.terracotta}, transparent)` }} />
        {steps.map((st, i) => {
          if (i !== idx) return null;
          const p = spring({ frame: (t - st.at) * fps - 4, fps, config: theme.spring.smooth });
          return (
            <div
              key={st.unit}
              style={{
                marginTop: 22,
                fontFamily: theme.fonts.display,
                fontWeight: 700,
                fontSize: 64,
                letterSpacing: "0.22em",
                color: theme.colors.terracotta,
                opacity: p,
                transform: `translateY(${(1 - p) * 18}px)`,
              }}
            >
              {st.unit}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
