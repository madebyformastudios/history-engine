import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";

/**
 * Wrap a scene to fade it in over `frames` at its start. Scenes overlap by the same
 * amount and later scenes render on top, so this produces a crossfade.
 */
export const CrossfadeIn: React.FC<{ frames: number; enabled: boolean; children: React.ReactNode }> = ({
  frames,
  enabled,
  children,
}) => {
  const frame = useCurrentFrame();
  const opacity = enabled
    ? interpolate(frame, [0, frames], [0, 1], { easing: theme.ease.inOut, extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 1;
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};

/** Black overlay fading in between two absolute times (seconds). */
export const FadeToBlack: React.FC<{ start: number; end: number }> = ({ start, end }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = interpolate(frame / fps, [start, end - 0.1], [0, 1], {
    easing: theme.ease.inOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return <AbsoluteFill style={{ background: "#000", opacity, pointerEvents: "none" }} />;
};

// ---------------- transition library ----------------
// Used between scenes (`scene.transition` or `meta.transition`) and between shots (`shot.transition`).
// "fade" is identical to CrossfadeIn, so videos that do not set a transition look exactly as before.

export type TransitionType = "fade" | "cut" | "whip" | "push" | "inkWipe" | "zoom";
export type TransitionSpec = { type: TransitionType; frames?: number; direction?: "left" | "right" | "up" | "down"; origin?: [number, number] };

/** Organic ink-blot outline: a circle of radius r (0..1 of the frame diagonal) with a wobbly edge. */
const inkPolygon = (r: number, ox: number, oy: number, seed = 7) => {
  const pts: string[] = [];
  const n = 48;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const wob = 1 + 0.09 * Math.sin(a * 5 + seed) + 0.05 * Math.sin(a * 11 + seed * 2) + 0.03 * Math.sin(a * 23 + seed * 3);
    const rr = r * 150 * wob; // in % of the frame (150% covers the far corner)
    pts.push(`${(ox * 100 + Math.cos(a) * rr * 0.5625).toFixed(2)}% ${(oy * 100 + Math.sin(a) * rr).toFixed(2)}%`);
  }
  return `polygon(${pts.join(",")})`;
};

/** Wraps the incoming scene or shot; the outgoing one stays underneath. */
export const TransitionIn: React.FC<{ spec?: TransitionSpec; frames: number; enabled: boolean; children: React.ReactNode }> = ({
  spec,
  frames: defaultFrames,
  enabled,
  children,
}) => {
  const frame = useCurrentFrame();
  const type = spec?.type ?? "fade";
  const frames = spec?.frames ?? defaultFrames;
  if (!enabled || type === "cut" || frames <= 0) return <AbsoluteFill>{children}</AbsoluteFill>;
  if (type === "fade") return <CrossfadeIn frames={frames} enabled>{children}</CrossfadeIn>;
  const p = interpolate(frame, [0, frames], [0, 1], { easing: theme.ease.inOut, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const dir = spec?.direction ?? "left";
  const sign = dir === "left" || dir === "up" ? 1 : -1;
  const axis = dir === "left" || dir === "right" ? "X" : "Y";
  if (type === "whip" || type === "push") {
    const off = (1 - p) * 100 * sign;
    const blur = type === "whip" ? Math.sin(p * Math.PI) * 14 : 0;
    return (
      <AbsoluteFill
        style={{
          transform: `translate${axis}(${off}%)`,
          filter: blur > 0.5 ? `blur(${blur.toFixed(1)}px)` : undefined,
          boxShadow: type === "push" ? "0 0 60px rgba(20,12,6,0.55)" : undefined,
        }}
      >
        {children}
      </AbsoluteFill>
    );
  }
  if (type === "inkWipe") {
    const [ox, oy] = spec?.origin ?? [0.5, 0.5];
    return <AbsoluteFill style={{ clipPath: p >= 1 ? undefined : inkPolygon(p, ox, oy) }}>{children}</AbsoluteFill>;
  }
  // zoom: the new picture grows out of the old one
  return <AbsoluteFill style={{ opacity: p, transform: `scale(${1.18 - 0.18 * p})` }}>{children}</AbsoluteFill>;
};
