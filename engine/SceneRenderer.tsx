import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import { useContext } from "react";
import { SceneWindow } from "./timing";
import { config, sec, type Effects, type Scene, type Shot } from "./config";
import { KenBurns } from "./components/KenBurns";
import { Parallax } from "./components/Parallax";
import { MapScene } from "./components/MapScene";
import { DecimalArmy } from "./components/DecimalArmy";
import { DateLabel, YearCounter } from "./components/YearCounter";
import { Dust, FireGlow, Lightning, Rain, Smoke, Vignette } from "./components/Overlay";
import { Titles } from "./components/Titles";

const EffectLayers: React.FC<{ fx: Effects }> = ({ fx }) => (
  <>
    {fx.fire ? <FireGlow amount={fx.fire} /> : null}
    {fx.smoke ? <Smoke amount={fx.smoke} /> : null}
    {fx.dust ? <Dust amount={fx.dust} count={110} /> : null}
    {fx.rain ? <Rain amount={fx.rain} /> : null}
    {fx.lightning ? <Lightning at={fx.lightning} /> : null}
    {fx.vignette ? <Vignette strength={fx.vignette} /> : null}
  </>
);

/** Fades its children in over `frames` (a short crossfade between shots; 0 = hard cut). */
const FadeIn: React.FC<{ frames: number; children: React.ReactNode }> = ({ frames, children }) => {
  const f = useCurrentFrame();
  const o = frames > 0 ? interpolate(f, [0, frames], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

/**
 * Several shots inside one scene (one VO paragraph): each shot is an image with its own camera
 * move, or a map, starting on its cue. Shots after the first fade in over `fade` frames.
 */
const Shots: React.FC<{ sceneId: string; shots: Shot[]; fade: number }> = ({ sceneId, shots, fade }) => {
  const win = useContext(SceneWindow);
  const end = win.from + win.durationInFrames;
  return (
    <>
      {shots.map((shot, i) => {
        const start = i === 0 ? win.from : Math.max(win.from, sec(shot.at));
        const next = i < shots.length - 1 ? Math.max(start + 1, sec(shots[i + 1].at)) : end;
        const nextFade = i < shots.length - 1 ? (shots[i + 1].fade ?? fade) : 0;
        const until = Math.min(end, next + nextFade);
        // the camera move runs over the visible part of the shot (start .. next), not the overlap
        const moveWin = { from: start, durationInFrames: Math.max(1, next - start) };
        return (
          <Sequence key={i} from={start - win.from} durationInFrames={Math.max(1, until - start)} layout="none">
            <SceneWindow.Provider value={moveWin}>
              <FadeIn frames={i === 0 ? 0 : (shot.fade ?? fade)}>
                {shot.map ? (
                  <MapScene sceneId={`${sceneId}-${i}`} settings={config.map} spec={shot.map} />
                ) : shot.image ? (
                  <KenBurns src={shot.image} {...(shot.kenBurns ?? { from: { scale: 1.05, x: 0.5, y: 0.5 }, to: { scale: 1.15, x: 0.5, y: 0.5 } })} />
                ) : null}
                {shot.effects ? <EffectLayers fx={shot.effects} /> : null}
              </FadeIn>
            </SceneWindow.Provider>
          </Sequence>
        );
      })}
    </>
  );
};

/** Picks the visual for a scene by `type`, then adds the per-scene effects and labels. */
export const SceneRenderer: React.FC<{ scene: Scene }> = ({ scene }) => {
  const fx = scene.effects ?? {};
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      {scene.type === "image" && <KenBurns src={scene.image} {...scene.kenBurns} />}
      {scene.type === "parallax" && <Parallax background={scene.background} sprites={scene.sprites} />}
      {scene.type === "map" && <MapScene sceneId={scene.id} settings={config.map} spec={scene.map} />}
      {scene.type === "gfx" && <DecimalArmy sceneId={scene.id} steps={scene.steps} />}
      {scene.type === "shots" && <Shots sceneId={scene.id} shots={scene.shots} fade={scene.shotFade ?? 6} />}

      {fx.fire ? <FireGlow amount={fx.fire} /> : null}
      {fx.smoke ? <Smoke amount={fx.smoke} /> : null}
      {fx.dust ? <Dust amount={fx.dust} count={110} /> : null}
      {fx.rain ? <Rain amount={fx.rain} /> : null}
      {fx.lightning ? <Lightning at={fx.lightning} /> : null}
      {fx.vignette ? <Vignette strength={fx.vignette} /> : null}

      {scene.titles && <Titles titles={scene.titles} />}
      {scene.year && <YearCounter keys={scene.year} era={scene.yearEra} />}
      {scene.date && <DateLabel text={scene.date.text} at={scene.date.at} />}
    </AbsoluteFill>
  );
};
