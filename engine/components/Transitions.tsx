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
