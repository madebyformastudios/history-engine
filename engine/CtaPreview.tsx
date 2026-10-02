import { AbsoluteFill, getInputProps } from "remotion";
import { config } from "./config";
import { SceneWindow } from "./timing";
import { SceneRenderer } from "./SceneRenderer";
import { CtaOverlay } from "./components/Cta";
import { Grade, Grain, Parchment, Vignette } from "./components/Overlay";

/**
 * Preview of the CTA overlay over one scene of the selected video (default: the first image scene).
 * inputProps: {"scene": "S10", "position": "bottom-right"}. Render with `npm run cta-preview <slug>`.
 */
export const CtaPreview: React.FC = () => {
  const props = getInputProps() as { scene?: string; position?: "bottom-left" | "bottom-right" | "top-left" | "top-right" };
  const scene = config.scenes.find((s) => s.id === props.scene) ?? config.scenes.find((s) => s.type === "image") ?? config.scenes[0];
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <SceneWindow.Provider value={{ from: scene.startFrame, durationInFrames: scene.endFrame - scene.startFrame }}>
        <SceneRenderer scene={scene} />
      </SceneWindow.Provider>
      <Grade />
      <Parchment opacity={config.overlay.parchment} />
      <Vignette strength={config.overlay.vignette} />
      <CtaOverlay at={0.5} duration={5.5} position={props.position} />
      <Grain opacity={config.overlay.grain} />
    </AbsoluteFill>
  );
};
