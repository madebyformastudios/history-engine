import { AbsoluteFill, Img, interpolate, staticFile, useVideoConfig } from "remotion";
import type { Cam, KenBurnsConfig } from "../config";
import { keyframes, useSceneTime } from "../timing";
import { theme } from "../theme";

/** Keeps the focus point far enough from the edges that the frame never shows past the image. */
const clampCam = (c: Cam): Cam => {
  const s = Math.max(1, c.scale);
  const half = 0.5 / s;
  return { scale: s, x: Math.min(1 - half, Math.max(half, c.x)), y: Math.min(1 - half, Math.max(half, c.y)) };
};

/** Camera transform for a full-frame layer: puts image point (x, y) in the frame centre at `scale`. */
export const camTransform = (c: Cam, width: number, height: number) => {
  const k = clampCam(c);
  return `translate(${width / 2 - k.scale * k.x * width}px, ${height / 2 - k.scale * k.y * height}px) scale(${k.scale})`;
};

/** Interpolates between two cameras with the gentle (no visible acceleration) curve. */
export const lerpCam = (from: Cam, to: Cam, p: number): Cam => {
  const e = interpolate(p, [0, 1], [0, 1], { easing: theme.ease.gentle, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // zoom in log space so push-ins feel constant-speed
  const scale = Math.exp(Math.log(from.scale) + (Math.log(to.scale) - Math.log(from.scale)) * e);
  return { scale, x: from.x + (to.x - from.x) * e, y: from.y + (to.y - from.y) * e };
};

/**
 * Named camera moves around a focus point. Small and slow on purpose: the picture should breathe,
 * not slide. `hold` barely moves (for strong images and while graphics are on screen).
 */
export const presetMove = (move: NonNullable<KenBurnsConfig["move"]>, focus: [number, number] = [0.5, 0.5], amount = 1): { from: Cam; to: Cam } => {
  const [x, y] = focus;
  const a = amount;
  switch (move) {
    case "hold": return { from: { scale: 1.06, x, y }, to: { scale: 1.06 + 0.03 * a, x, y } };
    case "pushIn": return { from: { scale: 1.06, x: 0.5 + (x - 0.5) * 0.3, y: 0.5 + (y - 0.5) * 0.3 }, to: { scale: 1.06 + 0.14 * a, x, y } };
    case "pullOut": return { from: { scale: 1.06 + 0.14 * a, x, y }, to: { scale: 1.06, x: 0.5 + (x - 0.5) * 0.3, y: 0.5 + (y - 0.5) * 0.3 } };
    case "driftLeft": return { from: { scale: 1.14, x: x + 0.035 * a, y }, to: { scale: 1.15, x: x - 0.035 * a, y } };
    case "driftRight": return { from: { scale: 1.14, x: x - 0.035 * a, y }, to: { scale: 1.15, x: x + 0.035 * a, y } };
    case "rise": return { from: { scale: 1.14, x, y: y + 0.03 * a }, to: { scale: 1.15, x, y: y - 0.03 * a } };
    case "sink": return { from: { scale: 1.14, x, y: y - 0.03 * a }, to: { scale: 1.15, x, y: y + 0.03 * a } };
  }
};

/** Camera for a still at absolute time `t` (path keyframes) or progress `p` (from → to, or a named move). */
export const cameraAt = ({ from, to, path, move, focus, amount }: Pick<KenBurnsConfig, "from" | "to" | "path" | "move" | "focus" | "amount">, t: number, p: number): Cam => {
  if (!path?.length && (move || !from || !to)) {
    const m = presetMove(move ?? "hold", focus, amount);
    return lerpCam(m.from, m.to, p);
  }
  return path && path.length
    ? {
        // zoom interpolated in log space, like lerpCam, so push-ins feel constant-speed
        scale: Math.exp(keyframes(t, path, (k) => Math.log(k.scale), theme.ease.gentle)),
        x: keyframes(t, path, (k) => k.x, theme.ease.gentle),
        y: keyframes(t, path, (k) => k.y, theme.ease.gentle),
      }
    : lerpCam(from!, to!, p);
};

/**
 * Slow camera move over a still for the length of its scene (from → to).
 * Optional matte paints the area below an image row (art that stops short of the frame),
 * optional desaturate ramps saturation from [0] to [1] (1 = untouched).
 */
export const KenBurns: React.FC<{ src: string; progress?: number; children?: React.ReactNode } & KenBurnsConfig> = ({
  src,
  from,
  to,
  path,
  move,
  focus,
  amount,
  matte,
  desaturate,
  progress: override,
  children,
}) => {
  const { progress, t } = useSceneTime();
  const { width, height } = useVideoConfig();
  const p = override ?? progress;
  const cam = cameraAt({ from, to, path, move, focus, amount }, t, p);
  const sat = desaturate ? desaturate[0] + (desaturate[1] - desaturate[0]) * p : 1;
  return (
    <AbsoluteFill style={{ overflow: "hidden", filter: sat < 1 ? `saturate(${sat})` : undefined }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transformOrigin: "0 0",
          transform: camTransform(cam, width, height),
        }}
      >
        <Img src={staticFile(src)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        {matte && (
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: `${matte.y * 100}%`,
              bottom: 0,
              background: `linear-gradient(180deg, ${matte.color}, ${matte.colorBottom ?? matte.color})`,
            }}
          />
        )}
        {/* annotations and other layers that must stick to the image (move with the camera) */}
        {children}
      </div>
    </AbsoluteFill>
  );
};
