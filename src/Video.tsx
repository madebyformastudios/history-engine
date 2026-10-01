import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { config, sceneWindow } from "./config";
import { SceneWindow } from "./timing";
import { SceneRenderer } from "./SceneRenderer";
import { CrossfadeIn, FadeToBlack } from "./components/Transitions";
import { Captions } from "./components/Caption";
import { isOff } from "./perf";
import { Dust, Grade, Grain, Parchment, Vignette } from "./components/Overlay";

/**
 * Layer stack (bottom → top): scenes (crossfaded) → grade → parchment → dust →
 * vignette → captions → grain → fade to black. Everything is driven by src/data/scenes.json.
 */
export const Video: React.FC = () => {
  const { meta, overlay, scenes } = config;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Audio src={staticFile(meta.audio)} />

      {scenes.map((scene, i) => {
        const win = sceneWindow(i);
        return (
          <Sequence key={scene.id} name={`${scene.id} ${scene.assets.join(" + ")}`} from={win.from} durationInFrames={win.durationInFrames}>
            <SceneWindow.Provider value={win}>
              <CrossfadeIn frames={meta.transitionFrames} enabled={i > 0}>
                <SceneRenderer scene={scene} />
              </CrossfadeIn>
            </SceneWindow.Provider>
          </Sequence>
        );
      })}

      {!isOff("grade") && <Grade />}
      {!isOff("parchment") && <Parchment opacity={overlay.parchment} />}
      {!isOff("dust") && <Dust amount={overlay.dust} />}
      {!isOff("vignette") && <Vignette strength={overlay.vignette} />}
      <Captions />
      {!isOff("grain") && <Grain opacity={overlay.grain} />}
      <FadeToBlack start={meta.fadeOut.start} end={meta.fadeOut.end} />
    </AbsoluteFill>
  );
};
