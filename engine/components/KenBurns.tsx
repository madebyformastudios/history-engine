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

/** Camera for a still at absolute time `t` (path keyframes) or progress `p` (from → to). */
export const cameraAt = ({ from, to, path }: Pick<KenBurnsConfig, "from" | "to" | "path">, t: number, p: number): Cam =>
  path && path.length
    ? {
        // zoom interpolated in log space, like lerpCam, so push-ins feel constant-speed
        scale: Math.exp(keyframes(t, path, (k) => Math.log(k.scale), theme.ease.gentle)),
        x: keyframes(t, path, (k) => k.x, theme.ease.gentle),
        y: keyframes(t, path, (k) => k.y, theme.ease.gentle),
      }
    : lerpCam(from, to, p);

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
  matte,
  desaturate,
  progress: override,
  children,
}) => {
  const { progress, t } = useSceneTime();
  const { width, height } = useVideoConfig();
  const p = override ?? progress;
  const cam = cameraAt({ from, to, path }, t, p);
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
