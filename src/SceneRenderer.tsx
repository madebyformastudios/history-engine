import { AbsoluteFill } from "remotion";
import { config, type Scene } from "./config";
import { KenBurns } from "./components/KenBurns";
import { Parallax } from "./components/Parallax";
import { MapScene } from "./components/MapScene";
import { DecimalArmy } from "./components/DecimalArmy";
import { DateLabel, YearCounter } from "./components/YearCounter";
import { Dust, FireGlow, Lightning, Rain, Smoke, Vignette } from "./components/Overlay";
import { Titles } from "./components/Titles";

/** Picks the visual for a scene by `type`, then adds the per-scene effects and labels. */
export const SceneRenderer: React.FC<{ scene: Scene }> = ({ scene }) => {
  const fx = scene.effects ?? {};
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      {scene.type === "image" && <KenBurns src={scene.image} {...scene.kenBurns} />}
      {scene.type === "parallax" && <Parallax background={scene.background} sprites={scene.sprites} />}
      {scene.type === "map" && <MapScene sceneId={scene.id} settings={config.map} spec={scene.map} />}
      {scene.type === "gfx" && <DecimalArmy sceneId={scene.id} steps={scene.steps} />}

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
