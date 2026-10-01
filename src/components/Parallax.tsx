import { AbsoluteFill } from "remotion";
import type { KenBurnsConfig, SpriteConfig } from "../config";
import { KenBurns } from "./KenBurns";
import { Sprite } from "./Sprite";

/**
 * Background still with its own slow camera move, plus one or more transparent cutouts
 * moving in front of it at a faster rate. The speed difference sells the depth.
 */
export const Parallax: React.FC<{ background: { src: string } & KenBurnsConfig; sprites: SpriteConfig[] }> = ({
  background,
  sprites,
}) => (
  <AbsoluteFill style={{ overflow: "hidden" }}>
    <KenBurns {...background} />
    {sprites.map((s, i) => (
      <Sprite key={i} {...s} />
    ))}
  </AbsoluteFill>
);
