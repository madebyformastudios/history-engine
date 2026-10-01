import { AbsoluteFill, random, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { isOff } from "../perf";

const svgUri = (svg: string) => `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;

// Two turbulence passes: fine paper fibre + large soft blotches, tinted sepia.
const PARCHMENT = svgUri(
  `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='600'>
    <filter id='f'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' seed='3' stitchTiles='stitch'/>
      <feColorMatrix values='0 0 0 0 0.45  0 0 0 0 0.33  0 0 0 0 0.18  0 0 0 0.9 0'/></filter>
    <filter id='b'><feTurbulence type='fractalNoise' baseFrequency='0.006' numOctaves='3' seed='8' stitchTiles='stitch'/>
      <feColorMatrix values='0 0 0 0 0.42  0 0 0 0 0.3  0 0 0 0 0.15  0 0 0 1.4 -0.35'/></filter>
    <rect width='600' height='600' filter='url(#b)'/>
    <rect width='600' height='600' filter='url(#f)' opacity='0.55'/>
  </svg>`,
);

const GRAIN = svgUri(
  `<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'>
    <filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter>
    <rect width='240' height='240' filter='url(#n)' opacity='0.6'/>
  </svg>`,
);

/** Subtle parchment texture multiplied over everything. */
export const Parchment: React.FC<{ opacity: number }> = ({ opacity }) => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      backgroundImage: PARCHMENT,
      backgroundSize: "600px 600px",
      mixBlendMode: "multiply",
      opacity,
    }}
  />
);

/** Animated film grain. */
export const Grain: React.FC<{ opacity: number }> = ({ opacity }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        backgroundImage: GRAIN,
        backgroundSize: "240px",
        backgroundPosition: `${(frame * 37) % 240}px ${(frame * 71) % 240}px`,
        mixBlendMode: "overlay",
        opacity,
      }}
    />
  );
};

/** Warm grade that pulls illustrations and maps into one look. */
export const Grade: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <AbsoluteFill style={{ backgroundColor: theme.colors.ochre, mixBlendMode: "soft-light", opacity: 0.14 }} />
  </AbsoluteFill>
);

export const Vignette: React.FC<{ strength: number }> = ({ strength }) => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      background: `radial-gradient(ellipse at center, transparent 52%, rgba(25,14,6,${strength}) 100%)`,
    }}
  />
);

/** Floating dust motes catching the light. Deterministic (seeded) so renders are stable. */
export const Dust: React.FC<{ amount: number; count?: number }> = ({ amount, count = 70 }) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const t = frame / fps;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "screen" }}>
      {Array.from({ length: count }).map((_, i) => {
        const r = (k: string) => random(`dust-${i}-${k}`);
        const size = 1.5 + r("s") ** 2 * 5;
        const speed = 6 + r("v") * 18; // px per second
        const x = (r("x") * (width + 200) + t * speed * (0.4 + r("dx"))) % (width + 200) - 100;
        const y = (r("y") * (height + 200) - t * speed + 100000) % (height + 200) - 100;
        const sway = Math.sin(t * (0.4 + r("w")) + r("p") * 6.28) * 18;
        const twinkle = 0.45 + 0.55 * Math.sin(t * (0.8 + r("tw") * 1.6) + r("tp") * 6.28) ** 2;
        const blur = size > 4.5 ? 2 : 0.4;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x + sway,
              top: y,
              width: size,
              height: size,
              borderRadius: "50%",
              background: theme.colors.gold,
              filter: isOff("blur") ? undefined : `blur(${blur}px)`,
              opacity: amount * twinkle * (0.25 + r("o") * 0.5),
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** Slow drifting smoke wisps rising from the bottom of the frame. */
export const Smoke: React.FC<{ amount: number; count?: number }> = ({ amount, count = 9 }) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const t = frame / fps;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: count }).map((_, i) => {
        const r = (k: string) => random(`smoke-${i}-${k}`);
        const size = 520 + r("s") * 640;
        const cycle = 9 + r("c") * 6; // seconds to rise through the frame
        const life = ((t + r("o") * cycle) % cycle) / cycle; // 0..1
        const x = r("x") * width - size / 2 + Math.sin(t * 0.3 + i) * 60 + life * 120;
        const y = height - size * 0.35 - life * height * 0.55;
        const fade = Math.sin(life * Math.PI); // in and out over its life
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: size,
              height: size * 0.7,
              borderRadius: "50%",
              background: "radial-gradient(ellipse at center, rgba(70,58,50,0.55), rgba(70,58,50,0) 68%)",
              filter: isOff("blur") ? undefined : "blur(30px)",
              transform: `rotate(${r("r") * 360 + t * 6}deg) scale(${0.8 + life * 0.5})`,
              opacity: amount * fade,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** Flickering orange firelight from below (burning city). */
export const FireGlow: React.FC<{ amount: number }> = ({ amount }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  // sum of incommensurate sines + seeded jitter = organic flicker
  const flicker =
    0.72 + 0.12 * Math.sin(t * 7.3) + 0.08 * Math.sin(t * 13.1 + 1.3) + 0.08 * (random(`fire-${Math.floor(frame / 2)}`) - 0.5);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 90% 60% at 50% 62%, rgba(255,128,40,0.75), rgba(200,70,20,0.25) 55%, transparent 80%)`,
          mixBlendMode: "screen",
          opacity: amount * flicker * 0.55,
        }}
      />
      <AbsoluteFill style={{ background: theme.colors.terracotta, mixBlendMode: "soft-light", opacity: amount * flicker * 0.35 }} />
    </AbsoluteFill>
  );
};

/** Slanted rain streaks in two depth layers. */
export const Rain: React.FC<{ amount: number; count?: number }> = ({ amount, count = 140 }) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const t = frame / fps;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width={width} height={height}>
        {Array.from({ length: count }).map((_, i) => {
          const r = (k: string) => random(`rain-${i}-${k}`);
          const near = r("d") > 0.7;
          const len = near ? 90 + r("l") * 60 : 40 + r("l") * 40;
          const speed = near ? 2600 : 1700; // px per second
          const y = ((r("y") * (height + 400) + t * speed) % (height + 400)) - 200;
          const x = ((r("x") * (width + 400) - y * 0.35) % (width + 400) + width + 400) % (width + 400) - 200;
          return (
            <line
              key={i}
              x1={x}
              y1={y}
              x2={x - len * 0.35}
              y2={y + len}
              stroke="#D8E2EA"
              strokeWidth={near ? 2.2 : 1.2}
              strokeLinecap="round"
              opacity={amount * (near ? 0.5 : 0.3)}
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

/** White-blue sky flashes at the given absolute times (seconds): bright hit, quick double flicker. */
export const Lightning: React.FC<{ at: number[] }> = ({ at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  let o = 0;
  for (const a of at) {
    const d = t - a;
    if (d < 0 || d > 0.6) continue;
    o = Math.max(o, d < 0.06 ? 0.75 : d < 0.12 ? 0.2 : d < 0.18 ? 0.55 : 0.55 * Math.exp(-(d - 0.18) * 9));
  }
  if (o <= 0) return null;
  return <AbsoluteFill style={{ pointerEvents: "none", background: "#DCE6FF", mixBlendMode: "screen", opacity: o * 0.6 }} />;
};
