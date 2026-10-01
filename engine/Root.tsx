import { Composition } from "remotion";
import { Video } from "./Video";
import { config } from "./config";

export const RemotionRoot: React.FC = () => {
  const { fps, width, height, durationInFrames, id } = config.meta;
  return <Composition id={id} component={Video} durationInFrames={durationInFrames} fps={fps} width={width} height={height} />;
};
