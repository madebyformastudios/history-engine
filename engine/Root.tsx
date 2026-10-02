import { Composition } from "remotion";
import { Video } from "./Video";
import { CtaPreview } from "./CtaPreview";
import { DEMO_SECONDS, FeatureDemo } from "./FeatureDemo";
import { config } from "./config";

export const RemotionRoot: React.FC = () => {
  const { fps, width, height, durationInFrames, id } = config.meta;
  return (
    <>
      <Composition id={id} component={Video} durationInFrames={durationInFrames} fps={fps} width={width} height={height} />
      <Composition id="FeatureDemo" component={FeatureDemo} durationInFrames={Math.round(30 * DEMO_SECONDS)} fps={30} width={width} height={height} />
      <Composition id="CtaPreview" component={CtaPreview} durationInFrames={fps * 6.5} fps={fps} width={width} height={height} />
    </>
  );
};
