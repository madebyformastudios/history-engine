// Scene-local frames -> absolute seconds, so components can use the absolute
// cue times written in scenes.json.
import { createContext, useContext } from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import type { EasingFunction } from "remotion";
import { theme } from "./theme";

export const SceneWindow = createContext({ from: 0, durationInFrames: 1 });

export const useSceneTime = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { from, durationInFrames } = useContext(SceneWindow);
  const abs = frame + from;
  return {
    frame,
    fps,
    abs,
    t: abs / fps, // absolute seconds
    progress: Math.min(1, Math.max(0, frame / Math.max(1, durationInFrames - 1))),
    durationInFrames,
  };
};

/** 0→1 between absolute seconds `start` and `start + duration`, eased and clamped. */
export const ramp = (t: number, start: number, duration: number, easing: EasingFunction = theme.ease.inOut) =>
  duration <= 0
    ? t >= start ? 1 : 0
    : interpolate(t, [start, start + duration], [0, 1], {
        easing,
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });

/** Piecewise interpolation over keyframes [{at, ...}] with easing between each pair. */
export const keyframes = <K extends { at: number }>(
  t: number,
  keys: K[],
  pick: (k: K) => number,
  easing: EasingFunction = theme.ease.inOut,
) => {
  if (keys.length === 1 || t <= keys[0].at) return pick(keys[0]);
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i], b = keys[i + 1];
    if (t <= b.at) return pick(a) + (pick(b) - pick(a)) * ramp(t, a.at, b.at - a.at, easing);
  }
  return pick(keys[keys.length - 1]);
};
