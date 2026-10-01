import { isOff } from "../perf";
import { Img, interpolate, staticFile } from "remotion";
import type { SpriteConfig } from "../config";
import { useSceneTime } from "../timing";
import { theme } from "../theme";

/**
 * A cutout that travels across the frame (marching soldier, galloping rider) with a stride
 * bounce and a slight pitch, plus a soft ground shadow that stays on the ground.
 */
export const Sprite: React.FC<SpriteConfig> = ({ src, start, end, height, bottom, from, to, bob = 4, strideHz = 2 }) => {
  const { t } = useSceneTime();
  if (t < start || t > end) return null;
  // Constant travel speed is intended: a gallop does not ease in and out.
  const x = interpolate(t, [start, end], [from, to]);
  const phase = (t - start) * Math.PI * 2 * strideHz;
  const lift = Math.abs(Math.sin(phase / 2)); // one bounce per stride
  const pitch = Math.sin(phase) * 1.2;
  const opacity = interpolate(t, [start, start + 0.25, end - 0.25, end], [0, 1, 1, 0], {
    easing: theme.ease.inOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: `${x}%`,
          bottom: bottom - height * 0.04,
          width: height * 1.05,
          height: height * 0.1,
          marginLeft: height * 0.1,
          borderRadius: "50%",
          background: "radial-gradient(ellipse at center, rgba(30,20,10,0.45), rgba(30,20,10,0) 70%)",
          transform: `scaleX(${1 - lift * 0.12})`,
          opacity: opacity * (1 - lift * 0.35),
        }}
      />
      <Img
        src={staticFile(src)}
        style={{
          position: "absolute",
          left: `${x}%`,
          bottom: bottom + lift * bob,
          height,
          opacity,
          transformOrigin: "50% 90%",
          transform: `rotate(${pitch}deg)`,
          filter: isOff("blur") ? undefined : `drop-shadow(6px 10px 10px ${theme.colors.shadow})`,
        }}
      />
    </>
  );
};
