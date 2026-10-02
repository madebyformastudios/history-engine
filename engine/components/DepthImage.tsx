import { AbsoluteFill, Img, staticFile, useVideoConfig } from "remotion";
import type { Cam, KenBurnsConfig } from "../config";
import { useSceneTime } from "../timing";
import { camTransform, cameraAt } from "./KenBurns";

/**
 * 2.5D parallax on a flat illustration. `npm run depth <slug>` splits each image into two layers
 * (public/layers/NNN_0.webp background with the front objects painted out, NNN_1.webp the front objects).
 * The camera move is the normal Ken Burns move; nearer layers move further, so the picture gets depth.
 * `strength` 1 = normal, 0.5 = subtle, 2 = strong.
 */
const FACTORS = [0, 1];

export const DepthImage: React.FC<{ src: string; strength: number; children?: React.ReactNode } & KenBurnsConfig> = ({
  src,
  strength,
  from,
  to,
  path,
  children,
}) => {
  const { progress, t } = useSceneTime();
  const { width, height } = useVideoConfig();
  const cam = cameraAt({ from, to, path }, t, progress);
  const start = path?.length ? path[0] : from;
  const base = src.replace(/^images\//, "layers/").replace(/\.(jpg|png)$/, "");
  const layerCam = (f: number): Cam => {
    const k = 1 + f * 0.9 * strength;
    // exaggerate the move for nearer layers, plus a little extra zoom so their edges never show
    return {
      scale: (start.scale + (cam.scale - start.scale) * k) * (1 + f * 0.035 * strength),
      x: start.x + (cam.x - start.x) * k,
      y: start.y + (cam.y - start.y) * k,
    };
  };
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {FACTORS.map((f, i) => (
        <div key={i} style={{ position: "absolute", inset: 0, transformOrigin: "0 0", transform: camTransform(layerCam(f), width, height) }}>
          <Img src={staticFile(`${base}_${i}.webp`)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      ))}
      {children && <div style={{ position: "absolute", inset: 0, transformOrigin: "0 0", transform: camTransform(cam, width, height) }}>{children}</div>}
    </AbsoluteFill>
  );
};
