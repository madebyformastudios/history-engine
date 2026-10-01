import { Config } from "@remotion/cli/config";

Config.setEntryPoint("src/index.ts");
Config.setOutputLocation("out/video.mp4");
Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(92);
Config.setCodec("h264");
Config.setCrf(18);
Config.setOverwriteOutput(true);
