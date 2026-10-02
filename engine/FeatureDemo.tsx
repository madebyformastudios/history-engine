import { AbsoluteFill, Sequence } from "remotion";
import { config } from "./config";
import type { MapSpec } from "./config";
import { SceneWindow } from "./timing";
import { KenBurns } from "./components/KenBurns";
import { DepthImage } from "./components/DepthImage";
import { MapScene } from "./components/MapScene";
import { TransitionIn, type TransitionType } from "./components/Transitions";
import { Annotations, GraphicView, type Graphic } from "./components/Infographics";
import { KineticCaptions } from "./components/Caption";
import { Grade, Grain, Parchment, Vignette } from "./components/Overlay";

/**
 * Feature demo: every new engine feature on the selected video's own images, to check them by eye.
 * Render with `npm run demo <slug>` (stills + a short MP4 in videos/<slug>/checks/). Not part of any video.
 * Images used: the first image scene's image and two more from public/images (001, 002, 003 by default).
 */
const S = 30; // fps assumed for the demo timings below (the composition uses the video's fps)
const sec = (s: number) => Math.round(s * S);

const Win: React.FC<{ from: number; len: number; children: React.ReactNode }> = ({ from, len, children }) => (
  <Sequence from={from} durationInFrames={len}>
    <SceneWindow.Provider value={{ from, durationInFrames: len }}>{children}</SceneWindow.Provider>
  </Sequence>
);

const IMG = ["images/001.jpg", "images/002.jpg", "images/003.jpg"];
const kb = { from: { scale: 1.1, x: 0.45, y: 0.5 }, to: { scale: 1.25, x: 0.55, y: 0.5 } };

export const DEMO_SECONDS = 2 + 4 * 2.5 + 6 + 5 + 7 * 3.5 + 7;

export const FeatureDemo: React.FC = () => {
  let t = 0;
  const parts: React.ReactNode[] = [];
  const add = (len: number, node: (from: number) => React.ReactNode) => {
    parts.push(<Win key={parts.length} from={sec(t)} len={sec(len) + 12}>{node(sec(t))}</Win>);
    t += len;
  };
  // 1. transitions: each one brings in the next image
  add(2, () => <KenBurns src={IMG[0]} {...kb} />);
  (["whip", "push", "inkWipe", "zoom"] as TransitionType[]).forEach((type, i) =>
    add(2.5, () => (
      <TransitionIn spec={{ type, frames: 12, direction: "left", origin: [0.3, 0.6] }} frames={12} enabled>
        <KenBurns src={IMG[(i + 1) % 3]} {...kb} />
      </TransitionIn>
    )),
  );
  // 2. camera path (glide between details, no cut) with annotations that stick to the image
  add(6, (f) => (
    <KenBurns
      src={IMG[1]}
      {...kb}
      path={[
        { at: f / S, scale: 1.1, x: 0.5, y: 0.5 },
        { at: f / S + 2.5, scale: 1.6, x: 0.35, y: 0.55 },
        { at: f / S + 5.5, scale: 1.6, x: 0.65, y: 0.45 },
      ]}
    >
      <Annotations
        items={[
          { type: "circle", at: f / S + 0.6, x: 0.35, y: 0.55, r: 0.07, label: "circle" },
          { type: "arrow", at: f / S + 3, from: [0.45, 0.25], to: [0.62, 0.42], label: "arrow" },
          { type: "box", at: f / S + 4, x: 0.6, y: 0.55, w: 0.18, h: 0.18, label: "box" },
        ]}
      />
    </KenBurns>
  ));
  // 3. depth parallax (needs `npm run depth <slug> 001`)
  add(5, () => <DepthImage src={IMG[0]} strength={1} from={{ scale: 1.12, x: 0.42, y: 0.5 }} to={{ scale: 1.3, x: 0.58, y: 0.5 }} />);
  // 4. infographics
  const g = (x: Partial<Graphic> & { kind: Graphic["kind"] }, f: number) => ({ at: f / S + 0.2, layout: "full", ...x }) as Graphic;
  const graphics: ((f: number) => Graphic)[] = [
    (f) => g({ kind: "timeline", title: "5,000 years of Iran", from: -3200, to: 2026, eras: [{ from: -3200, to: -640, label: "Elam" }, { from: -550, to: -330, label: "Achaemenid" }, { from: 224, to: 651, label: "Sasanian" }, { from: 1501, to: 1736, label: "Safavid" }, { from: 1925, to: 2026, label: "Modern" }], now: [{ at: f / S + 0.8, year: -3200 }, { at: f / S + 3, year: 260 }] } as Graphic, f),
    (f) => g({ kind: "stat", value: 7007, label: "deaths verified", range: { low: 3117, high: 30000, lowLabel: "government", highLabel: "other estimates" }, source: "demo data" } as Graphic, f),
    (f) => g({ kind: "percent", value: 16, label: "share of the profits", restLabel: "84% to the company" } as Graphic, f),
    (f) => g({ kind: "compare", title: "Compare", unit: "people", items: [{ label: "Killed", value: 20000 }, { label: "Captured", value: 10000 }] } as Graphic, f),
    (f) => g({ kind: "chain", title: "Chain", nodes: [{ label: "Greeks", sub: "330 BC" }, { label: "Arabs", sub: "651" }, { label: "Turks", sub: "1040" }, { label: "Mongols", sub: "1219" }] } as Graphic, f),
    (f) => g({ kind: "relations", title: "Who backed whom", center: { label: "Iraq" }, nodes: [{ label: "United States", edge: "backed", dir: "in" }, { label: "Soviet Union", edge: "backed", dir: "in" }, { label: "France", edge: "backed", dir: "in" }] } as Graphic, f),
    (f) => g({ kind: "card", text: "A quote or a key fact, set large", sub: "Source line" } as Graphic, f),
  ];
  graphics.forEach((mk) => add(3.5, (f) => <GraphicView g={mk(f)} />));
  // 5. map: Cliopatria borders, real rivers, a line along a real river, an arrow over land
  add(7, (f) => {
    const a = f / S;
    const spec: MapSpec = {
      id: "DEMO-MAP",
      rivers: true,
      camera: [{ at: a, center: [47, 33], zoom: 2.2 }, { at: a + 6, center: [45, 34], zoom: 2.8 }],
      states: [{ at: a, layers: [] }, { at: a + 0.3, duration: 1.6, mode: "grow", origin: [52.9, 29.9], layers: [{ territory: "clio_achaemenid_-500", fill: "terracotta", opacity: 0.8 }] }],
      lines: [
        { id: "tigris", style: "river", river: "Tigris", path: [], at: a + 2, duration: 2 },
        { id: "arrow", style: "arrow", path: [[53, 30], [50, 32], [47.5, 34.3], [45, 35.5]], at: a + 3.5, duration: 1.6, smooth: true },
      ],
      markers: [],
      regionLabels: [{ text: "ACHAEMENID EMPIRE (CLIOPATRIA)", lonlat: [55, 33], at: a + 1.5, size: 30, tone: "dark" }],
    };
    return <MapScene sceneId="demo" settings={config.map} spec={spec} />;
  });
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {parts}
      <Grade />
      <Parchment opacity={config.overlay.parchment} />
      <Vignette strength={config.overlay.vignette} />
      {/* kinetic captions over the whole demo (they follow this video's voiceover timing) */}
      <KineticCaptions />
      <Grain opacity={config.overlay.grain} />
    </AbsoluteFill>
  );
};

