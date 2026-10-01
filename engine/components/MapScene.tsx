import { useMemo } from "react";
import { AbsoluteFill, interpolate, interpolateColors, spring, useVideoConfig } from "remotion";
import { isOff } from "../perf";
import { geoConicConformal, geoPath } from "d3-geo";
import type { GeoPermissibleObjects } from "d3-geo";
import type { LineConfig, LonLat, MapSettings, MapSpec, MapState, MarkerConfig, RegionLabel } from "../config";
import { keyframes, ramp, useSceneTime } from "../timing";
import { color, theme } from "../theme";
import territoriesJson from "../maps-data/territories.json";
import landJson from "../maps-data/land.json";

const territories = territoriesJson as unknown as Record<string, GeoPermissibleObjects>;
const land = landJson as unknown as GeoPermissibleObjects;

type Pt = [number, number];
const DEFAULT_DURATION = 1.2;

/** Visible opacity + reveal progress of every territory layer at time t. */
const resolveLayers = (states: MapState[], t: number) => {
  type L = { key: string; territory: string; fill: string; opacity: number; outline: number; reveal: number; origin?: LonLat };
  let current: L[] = states[0].layers.map((l) => ({
    key: l.territory,
    territory: l.territory,
    fill: color(l.fill),
    opacity: l.opacity ?? 1,
    outline: l.outline ?? 0,
    reveal: 1,
  }));
  for (let i = 1; i < states.length; i++) {
    const s = states[i];
    if (t < s.at) break;
    const d = s.duration ?? DEFAULT_DURATION;
    const p = ramp(t, s.at, d, theme.ease.inOut);
    const mode = s.mode ?? "fade";
    const next: L[] = [];
    // Layers that persist: tween color/opacity. New layers: grow (radial reveal) or fade in.
    for (const l of s.layers) {
      const prev = current.find((c) => c.territory === l.territory);
      const target = { fill: color(l.fill), opacity: l.opacity ?? 1, outline: l.outline ?? 0 };
      if (prev) {
        next.push({
          ...prev,
          fill: interpolateColors(p, [0, 1], [prev.fill, target.fill]),
          opacity: prev.opacity + (target.opacity - prev.opacity) * p,
          outline: prev.outline + (target.outline - prev.outline) * p,
        });
      } else {
        next.push({
          key: `${l.territory}@${i}`,
          territory: l.territory,
          ...target,
          opacity: mode === "fade" ? target.opacity * p : target.opacity,
          reveal: mode === "grow" ? p : 1,
          origin: s.origin,
        });
      }
    }
    // Layers that leave: under a growing layer they hold until it has covered them, then fade.
    for (const c of current) {
      if (s.layers.some((l) => l.territory === c.territory)) continue;
      const out = mode === "grow" ? 1 - ramp(t, s.at + d * 0.6, d * 0.4) : 1 - p;
      if (out > 0.001) next.unshift({ ...c, opacity: c.opacity * out });
    }
    current = next;
  }
  return current;
};

/** Catmull-Rom resampling so hand-placed waypoints become a smooth curve. */
const smoothPolyline = (pts: Pt[], steps = 10): Pt[] => {
  if (pts.length < 3) return pts;
  const out: Pt[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    for (let s = 0; s < steps; s++) {
      const u = s / steps, u2 = u * u, u3 = u2 * u;
      out.push([0, 1].map((k) =>
        0.5 * (2 * p1[k] + (-p0[k] + p2[k]) * u + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * u2 + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * u3),
      ) as Pt);
    }
  }
  out.push(pts[pts.length - 1]);
  return out;
};

const polyLength = (pts: Pt[]) => pts.slice(1).reduce((n, p, i) => n + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0);

/** Points along a polyline up to fraction f of its length. */
const partialPolyline = (pts: Pt[], f: number): Pt[] => {
  if (f >= 1) return pts;
  const seg = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]));
  let remain = seg.reduce((a, b) => a + b, 0) * Math.max(0, f);
  const out: Pt[] = [pts[0]];
  for (let i = 0; i < seg.length; i++) {
    if (remain >= seg[i]) {
      out.push(pts[i + 1]);
      remain -= seg[i];
    } else {
      const k = remain / seg[i];
      out.push([pts[i][0] + (pts[i + 1][0] - pts[i][0]) * k, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * k]);
      break;
    }
  }
  return out;
};

const pointAt = (pts: Pt[], f: number): Pt => {
  const part = partialPolyline(pts, Math.min(1, Math.max(0, f)));
  return part[part.length - 1];
};

const toD = (pts: Pt[]) => (pts.length < 2 ? "" : `M${pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join("L")}`);

/**
 * Animated historical map. Land + territories are drawn in map space (scaled by the camera,
 * territories clipped to the coastline); lines, markers and labels are drawn in screen
 * space so they keep a constant size at any zoom.
 */
export const MapScene: React.FC<{ settings: MapSettings; spec: MapSpec; sceneId: string }> = ({ settings, spec, sceneId }) => {
  const { t, fps } = useSceneTime();
  const { width, height } = useVideoConfig();
  const { camera, states, markers = [], lines = [], regionLabels = [], seaLabels = [] } = spec;

  // Scale comes from fitting the whole Eurasia extent; each map then re-centres the cone on its
  // own meridian so north stays up even far from the default central meridian.
  const { projection, path } = useMemo(() => {
    const [[x0, y0], [x1, y1]] = settings.extent;
    const extent: GeoPermissibleObjects = { type: "MultiPoint", coordinates: [[x0, y0], [x1, y0], [x1, y1], [x0, y1], [(x0 + x1) / 2, y1]] };
    const base = geoConicConformal()
      .rotate(settings.rotate)
      .parallels(settings.parallels)
      .fitExtent([[40, 30], [width - 40, height - 30]], extent);
    const meridian = spec.meridian ?? -settings.rotate[0];
    const projection = geoConicConformal()
      .rotate([-meridian, settings.rotate[1]])
      .parallels(settings.parallels)
      .scale(base.scale())
      .translate([width / 2, height / 2]);
    return { projection, path: geoPath(projection) };
  }, [settings, width, height, spec.meridian]);

  const paths = useMemo(() => {
    const out: Record<string, string> = {};
    for (const [k, f] of Object.entries(territories)) out[k] = path(f) ?? "";
    return { land: path(land) ?? "", ...out };
  }, [path]);

  // Camera
  const lon = keyframes(t, camera, (k) => k.center[0], theme.ease.gentle);
  const lat = keyframes(t, camera, (k) => k.center[1], theme.ease.gentle);
  const zoom = Math.exp(keyframes(t, camera, (k) => Math.log(k.zoom), theme.ease.gentle));
  const [cx, cy] = projection([lon, lat]) ?? [width / 2, height / 2];
  const toScreen = (ll: LonLat): Pt => {
    const [x, y] = projection(ll) ?? [0, 0];
    return [(x - cx) * zoom + width / 2, (y - cy) * zoom + height / 2];
  };
  const mapTransform = `translate(${width / 2} ${height / 2}) scale(${zoom}) translate(${-cx} ${-cy})`;

  const layers = resolveLayers(states, t);
  const growRadius = Math.hypot(width, height) * 1.2;
  const idp = `${sceneId}-`;

  return (
    <AbsoluteFill style={{ background: theme.colors.seaDeep }}>
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id={`${idp}sea`} cx="50%" cy="45%" r="75%">
            <stop offset="0%" stopColor={theme.colors.sea} />
            <stop offset="100%" stopColor={theme.colors.seaDeep} />
          </radialGradient>
          <filter id={`${idp}landShadow`} x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="6" />
            <feOffset dx="0" dy="3" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.35" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <clipPath id={`${idp}landClip`}>
            <path d={paths.land} />
          </clipPath>
          {layers.map((l) => {
            if (l.reveal >= 1) return null;
            const [ox, oy] = projection(l.origin ?? camera[0].center) ?? [0, 0];
            return (
              <mask id={`${idp}m-${l.key}`} key={l.key} maskUnits="userSpaceOnUse" x={-5000} y={-5000} width={10000} height={10000}>
                <radialGradient id={`${idp}g-${l.key}`} gradientUnits="userSpaceOnUse" cx={ox} cy={oy} r={Math.max(1, growRadius * l.reveal)}>
                  <stop offset="0.82" stopColor="#fff" />
                  <stop offset="1" stopColor="#000" />
                </radialGradient>
                <rect x={-5000} y={-5000} width={10000} height={10000} fill={`url(#${idp}g-${l.key})`} />
              </mask>
            );
          })}
        </defs>

        <rect width={width} height={height} fill={`url(#${idp}sea)`} />

        <g transform={mapTransform}>
          {/* coastline halo in the sea, then the land itself */}
          <path d={paths.land} fill="none" stroke={theme.colors.parchment} strokeOpacity={0.16} strokeWidth={9} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
          <path d={paths.land} fill={theme.colors.parchment} stroke={theme.colors.coast} strokeWidth={1.3} vectorEffect="non-scaling-stroke" filter={isOff("mapShadow") ? undefined : `url(#${idp}landShadow)`} />

          <g clipPath={`url(#${idp}landClip)`}>
            {layers.map((l) => (
              <g key={l.key} mask={l.reveal < 1 ? `url(#${idp}m-${l.key})` : undefined} opacity={l.opacity}>
                {/* outline first, fill on top: hides seams where merged polygons overlap
                    (only the outer half of the stroke stays visible, hence the doubled width) */}
                <path
                  d={paths[l.territory as keyof typeof paths]}
                  fill="none"
                  stroke={interpolateColors(0.5 + 0.4 * l.outline, [0, 1], [l.fill, theme.colors.ink])}
                  strokeWidth={4.8 + 7.2 * l.outline}
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                />
                <path d={paths[l.territory as keyof typeof paths]} fill={interpolateColors(0.1, [0, 1], [l.fill, theme.colors.parchment])} />
              </g>
            ))}
          </g>
          {/* redraw the coastline on top so territory edges sit inside it */}
          <path d={paths.land} fill="none" stroke={theme.colors.ink} strokeOpacity={0.45} strokeWidth={1.1} vectorEffect="non-scaling-stroke" />
        </g>

        {seaLabels.map((s) => {
          const [x, y] = toScreen(s.lonlat);
          return (
            <text key={s.text} x={x} y={y} textAnchor="middle" fill={theme.colors.parchment} fillOpacity={0.55} fontFamily={theme.fonts.display} fontStyle="italic" fontSize={s.size ?? 26} letterSpacing="0.14em">
              {s.text}
            </text>
          );
        })}

        {lines.map((l) => (
          <MapLine key={l.id} line={l} t={t} toScreen={toScreen} />
        ))}
      </svg>

      {regionLabels.map((r) => (
        <Region key={r.text} r={r} pos={toScreen(r.lonlat)} t={t} fps={fps} />
      ))}

      {markers.map((m) => (
        <Marker key={m.id} m={m} pos={toScreen(m.lonlat)} t={t} fps={fps} />
      ))}
    </AbsoluteFill>
  );
};

const LINE_STYLE = {
  river: { color: theme.colors.river, width: 5, under: theme.colors.parchment, underWidth: 9, dash: undefined },
  arrow: { color: theme.colors.terracotta, width: 11, under: theme.colors.ink, underWidth: 17, dash: undefined },
  route: { color: theme.colors.terracottaDark, width: 6, under: theme.colors.parchment, underWidth: 12, dash: "16 12" },
  trade: { color: theme.colors.ochre, width: 6, under: theme.colors.ink, underWidth: 10, dash: undefined },
  divider: { color: theme.colors.ink, width: 5, under: theme.colors.parchment, underWidth: 9, dash: "14 10" },
} as const;

const MapLine: React.FC<{ line: LineConfig; t: number; toScreen: (ll: LonLat) => Pt }> = ({ line, t, toScreen }) => {
  const draw = ramp(t, line.at, line.duration ?? 1.4, theme.ease.inOut);
  if (draw <= 0) return null;
  const base = line.path.map(toScreen);
  const pts = line.smooth === false ? base : smoothPolyline(base);
  const part = partialPolyline(pts, draw);
  const st = LINE_STYLE[line.style];
  const d = toD(part);

  // arrowhead follows the tip while drawing
  let head: React.ReactNode = null;
  if (line.style === "arrow" && part.length >= 2) {
    const tip = part[part.length - 1];
    const back = pointAt(pts, Math.max(0, draw - 18 / Math.max(1, polyLength(pts))));
    const a = Math.atan2(tip[1] - back[1], tip[0] - back[0]);
    const L = 40, W = 24;
    const p1: Pt = [tip[0] + Math.cos(a) * L * 0.55, tip[1] + Math.sin(a) * L * 0.55];
    const p2: Pt = [tip[0] - Math.cos(a) * L * 0.45 + Math.cos(a + Math.PI / 2) * W, tip[1] - Math.sin(a) * L * 0.45 + Math.sin(a + Math.PI / 2) * W];
    const p3: Pt = [tip[0] - Math.cos(a) * L * 0.45 - Math.cos(a + Math.PI / 2) * W, tip[1] - Math.sin(a) * L * 0.45 - Math.sin(a + Math.PI / 2) * W];
    head = <path d={`M${p1.join(",")}L${p2.join(",")}L${p3.join(",")}Z`} fill={st.color} stroke={theme.colors.ink} strokeWidth={3.5} strokeLinejoin="round" />;
  }

  const glow = line.style === "trade" ? 0.55 + 0.25 * Math.sin(t * 2.4 + line.id.length) : 0;
  // dashed routes "march" slowly so a finished route still reads as movement
  const dashOffset = st.dash ? -t * 22 : undefined;
  const dots = line.dots && t >= line.dots.at ? line.dots : null;

  return (
    <g>
      {glow > 0 && <path d={d} fill="none" stroke={theme.colors.ochre} strokeOpacity={glow * 0.5} strokeWidth={22} strokeLinecap="round" strokeLinejoin="round" style={{ filter: isOff("blur") ? undefined : "blur(6px)" }} />}
      <path d={d} fill="none" stroke={st.under} strokeOpacity={line.style === "arrow" ? 0.85 : 0.75} strokeWidth={st.underWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke={st.color} strokeWidth={st.width} strokeDasharray={st.dash} strokeDashoffset={dashOffset} strokeLinecap="round" strokeLinejoin="round" />
      {head}
      {dots &&
        Array.from({ length: dots.count }).map((_, i) => {
          const age = t - dots.at;
          const appear = ramp(t, dots.at + i * 0.25, 0.4, theme.ease.out);
          const f = dots.loop === false
            ? Math.min(1, Math.max(0, age - i * 0.4) / dots.period) * draw
            : ((age / dots.period + i / dots.count) % 1) * Math.min(1, draw);
          const [x, y] = pointAt(pts, f);
          return (
            <g key={i} opacity={appear}>
              <circle cx={x} cy={y} r={12} fill={theme.colors.ochre} opacity={0.35} />
              <circle cx={x} cy={y} r={7} fill={theme.colors.parchment} stroke={theme.colors.ink} strokeWidth={2.5} />
            </g>
          );
        })}
    </g>
  );
};

const Region: React.FC<{ r: RegionLabel; pos: Pt; t: number; fps: number }> = ({ r, pos, t, fps }) => {
  if (t < r.at) return null;
  const p = spring({ frame: (t - r.at) * fps, fps, config: theme.spring.smooth });
  const out = r.hideAt !== undefined ? 1 - ramp(t, r.hideAt, 0.5, theme.ease.in) : 1;
  const dark = r.tone === "dark";
  return (
    <div
      style={{
        position: "absolute",
        left: pos[0],
        top: pos[1],
        transform: `translate(-50%, -50%) translateY(${(1 - p) * 16}px) scale(${0.94 + 0.06 * p})`,
        opacity: p * out,
        fontFamily: theme.fonts.display,
        fontWeight: 700,
        fontSize: r.size ?? 40,
        letterSpacing: "0.16em",
        whiteSpace: "nowrap",
        color: dark ? theme.colors.ink : theme.colors.text,
        textShadow: dark
          ? `0 0 8px ${theme.colors.parchment}, 0 0 16px ${theme.colors.parchment}, 0 0 3px ${theme.colors.parchment}`
          : `0 2px 14px ${theme.colors.shadow}, 0 1px 2px rgba(0,0,0,0.7)`,
      }}
    >
      {r.text.toUpperCase()}
    </div>
  );
};

/** Two crossed sabres, the battle icon. */
const Swords: React.FC<{ s: number }> = ({ s }) => (
  <g transform={`scale(${s})`} strokeLinecap="round">
    <circle r={34} fill={theme.colors.parchment} stroke={theme.colors.ink} strokeWidth={3} />
    {[-1, 1].map((k) => (
      <g key={k} transform={`scale(${k},1) rotate(-45)`}>
        <path d="M0,-24 Q5,-6 2,18" fill="none" stroke={theme.colors.ink} strokeWidth={6} />
        <path d="M0,-24 Q5,-6 2,18" fill="none" stroke={theme.colors.parchment} strokeWidth={2} />
        <line x1={-9} y1={14} x2={11} y2={14} stroke={theme.colors.terracottaDark} strokeWidth={5} />
        <line x1={1.5} y1={15} x2={1.5} y2={26} stroke={theme.colors.terracottaDark} strokeWidth={5} />
      </g>
    ))}
  </g>
);

const Marker: React.FC<{ m: MarkerConfig; pos: Pt; t: number; fps: number }> = ({ m, pos, t, fps }) => {
  if (t < m.at - 0.05) return null;
  const pop = spring({ frame: (t - m.at) * fps, fps, config: theme.spring.snappy });
  const cross = m.crossAt !== undefined ? ramp(t, m.crossAt, 0.4, theme.ease.out) : 0;
  const cross2 = m.crossAt !== undefined ? ramp(t, m.crossAt + 0.15, 0.4, theme.ease.out) : 0;
  const flash = m.flashAt !== undefined && t >= m.flashAt ? t - m.flashAt : -1;
  const battle = m.battleAt !== undefined && t >= m.battleAt ? spring({ frame: (t - m.battleAt) * fps, fps, config: theme.spring.snappy }) : 0;
  const pulsePhase = ((t - m.at) * 0.9) % 1;
  const breathe = 1 + Math.sin(t * 3) * 0.06;
  const side = m.labelSide ?? "right";
  const dim = 1 - cross * 0.25;
  const S = 34; // half-size of the X
  const kind = m.kind ?? "city";
  return (
    <div style={{ position: "absolute", left: pos[0], top: pos[1] }}>
      <svg width={200} height={200} viewBox="-100 -100 200 200" style={{ position: "absolute", left: -100, top: -100, overflow: "visible" }}>
        {flash >= 0 && (
          <g>
            {/* burning red bloom that settles into a lasting ember glow */}
            <circle r={18 + Math.min(1, flash / 0.5) * 70} fill="none" stroke={theme.colors.danger} strokeWidth={6} opacity={Math.max(0, 1 - flash / 0.7)} />
            <circle r={40} fill={theme.colors.danger} opacity={(flash < 0.25 ? flash / 0.25 : Math.max(0.35, 1 - (flash - 0.25) * 1.2)) * (0.55 + 0.1 * Math.sin(t * 9))} style={{ filter: isOff("blur") ? undefined : "blur(12px)" }} />
          </g>
        )}
        <g transform={`scale(${pop})`}>
          {m.pulse &&
            [0, 0.5].map((o) => {
              const ph = (pulsePhase + o) % 1;
              return <circle key={o} r={10 + ph * 46} fill="none" stroke={theme.colors.terracotta} strokeWidth={3} opacity={(1 - ph) * 0.9} />;
            })}
          {kind === "city" ? (
            <>
              <rect x={-9} y={-9} width={18} height={18} transform="translate(0,3) rotate(45)" fill={theme.colors.ink} opacity={0.3 * dim} />
              <rect x={-8} y={-8} width={16} height={16} transform="rotate(45)" fill={theme.colors.parchment} stroke={theme.colors.ink} strokeWidth={3.5} opacity={dim} />
            </>
          ) : (
            <>
              <circle r={13 * breathe} fill={theme.colors.ink} opacity={0.35} cy={2} />
              <circle r={10 * breathe} fill={theme.colors.terracotta} stroke={theme.colors.ink} strokeWidth={3} />
            </>
          )}
        </g>
        {cross > 0 && (
          <g stroke={theme.colors.terracottaDark} strokeWidth={10} strokeLinecap="round">
            <line x1={-S} y1={-S} x2={-S + 2 * S * cross} y2={-S + 2 * S * cross} />
            {cross2 > 0 && <line x1={S} y1={-S} x2={S - 2 * S * cross2} y2={-S + 2 * S * cross2} />}
          </g>
        )}
        {battle > 0 && (
          <g transform="translate(0,-62)">
            <Swords s={battle} />
          </g>
        )}
      </svg>
      {m.label && (
        <div
          style={{
            position: "absolute",
            whiteSpace: "nowrap",
            fontFamily: theme.fonts.display,
            fontWeight: 700,
            fontSize: 32,
            letterSpacing: "0.08em",
            color: theme.colors.ink,
            opacity: interpolate(pop, [0, 1], [0, 1], { extrapolateRight: "clamp" }),
            textShadow: `0 0 8px ${theme.colors.parchment}, 0 0 16px ${theme.colors.parchment}, 0 0 3px ${theme.colors.parchment}, 0 0 2px ${theme.colors.parchment}`,
            ...(side === "right" && { left: 26, top: -22 }),
            ...(side === "left" && { right: 26, top: -22 }),
            ...(side === "bottom" && { left: 0, top: 22, transform: "translateX(-50%)" }),
            ...(side === "top" && { left: 0, top: -66, transform: "translateX(-50%)" }),
          }}
        >
          {m.label.toUpperCase()}
        </div>
      )}
    </div>
  );
};
