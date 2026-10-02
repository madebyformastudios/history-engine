// Infographics: motion graphics that add context (see STYLE.md). Generic, all content comes from the scene spec.
//   - annotations on images (circle, arrow, label, box) that move with the camera
//   - graphics: timeline, stat (with source range), percent, compare, chain, relations, card
// Graphics can be a full-frame shot (`{ at, graphic }`) or an overlay on any scene (`graphics: [...]`).
import { AbsoluteFill, interpolate, spring } from "remotion";
import { useSceneTime } from "../timing";
import { color, theme } from "../theme";

const C = theme.colors;
const INK = C.ink;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = (t: number, a: number, d = 0.6) => interpolate(t, [a, a + d], [0, 1], { ...clamp, easing: theme.ease.out });
const fmt = (n: number, decimals = 0) => n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

// ---------------- annotations (image space 0..1, drawn inside the Ken Burns layer) ----------------

export type Annotation =
  | { type: "circle"; at: number; x: number; y: number; r?: number; label?: string; color?: string }
  | { type: "arrow"; at: number; from: [number, number]; to: [number, number]; label?: string; color?: string }
  | { type: "label"; at: number; x: number; y: number; text: string; color?: string }
  | { type: "box"; at: number; x: number; y: number; w: number; h: number; label?: string; color?: string };

const W = 1920, H = 1080;
const handLabel = (text: string, x: number, y: number, p: number, col: string, anchor: "start" | "middle" = "middle") => (
  <g opacity={p} transform={`translate(${x} ${y + (1 - p) * 10})`}>
    <text textAnchor={anchor} fontFamily={theme.fonts.display} fontWeight={700} fontSize={38} letterSpacing="0.06em" stroke="rgba(20,12,6,0.75)" strokeWidth={8} paintOrder="stroke" fill={col}>
      {text.toUpperCase()}
    </text>
  </g>
);

export const Annotations: React.FC<{ items: Annotation[] }> = ({ items }) => {
  const { t } = useSceneTime();
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible", pointerEvents: "none" }}>
      {items.map((a, i) => {
        if (t < a.at - 0.05) return null;
        const p = ease(t, a.at, 0.7);
        const col = color(a.color ?? "ochre");
        const stroke = { fill: "none", stroke: col, strokeWidth: 7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.6))" };
        if (a.type === "circle") {
          const r = (a.r ?? 0.08) * W;
          const len = 2 * Math.PI * r * 1.08;
          // slightly open, hand-drawn ellipse that draws itself
          return (
            <g key={i}>
              <ellipse cx={a.x * W} cy={a.y * H} rx={r} ry={r * 0.92} transform={`rotate(-8 ${a.x * W} ${a.y * H})`} {...stroke} strokeDasharray={len} strokeDashoffset={len * (1 - p)} />
              {a.label && handLabel(a.label, a.x * W, a.y * H - r - 22, ease(t, a.at + 0.4), col)}
            </g>
          );
        }
        if (a.type === "arrow") {
          const [x1, y1] = [a.from[0] * W, a.from[1] * H], [x2, y2] = [a.to[0] * W, a.to[1] * H];
          const mx = (x1 + x2) / 2 + (y2 - y1) * 0.18, my = (y1 + y2) / 2 - (x2 - x1) * 0.18;
          const d = `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`;
          const len = Math.hypot(x2 - x1, y2 - y1) * 1.15;
          const ang = Math.atan2(y2 - my, x2 - mx);
          const head = ease(t, a.at + 0.5, 0.25);
          const hx = (s: number) => x2 - Math.cos(ang + s) * 34, hy = (s: number) => y2 - Math.sin(ang + s) * 34;
          return (
            <g key={i}>
              <path d={d} {...stroke} strokeDasharray={len} strokeDashoffset={len * (1 - p)} />
              <path d={`M ${hx(0.5)} ${hy(0.5)} L ${x2} ${y2} L ${hx(-0.5)} ${hy(-0.5)}`} {...stroke} opacity={head} />
              {a.label && handLabel(a.label, x1, y1 - 24, ease(t, a.at), col)}
            </g>
          );
        }
        if (a.type === "box") {
          const [x, y, w, h] = [a.x * W, a.y * H, a.w * W, a.h * H];
          const len = 2 * (w + h);
          return (
            <g key={i}>
              <rect x={x} y={y} width={w} height={h} rx={10} {...stroke} strokeDasharray={len} strokeDashoffset={len * (1 - p)} />
              {a.label && handLabel(a.label, x, y - 18, ease(t, a.at + 0.4), col, "start")}
            </g>
          );
        }
        return <g key={i}>{handLabel(a.text, a.x * W, a.y * H, p, col)}</g>;
      })}
    </svg>
  );
};

// ---------------- graphics ----------------

type Base = { at: number; until?: number; layout?: "full" | "left" | "right" | "lower" | "center"; title?: string; source?: string };
export type Graphic = Base &
  (
    | { kind: "timeline"; from: number; to: number; eras?: { from: number; to: number; label: string; color?: string }[]; marks?: { year: number; label: string; at?: number }[]; now?: { at: number; year: number }[] }
    | { kind: "stat"; value: number; label: string; prefix?: string; suffix?: string; decimals?: number; range?: { low: number; high: number; lowLabel?: string; highLabel?: string } }
    | { kind: "percent"; value: number; label: string; restLabel?: string; color?: string }
    | { kind: "compare"; unit?: string; items: { label: string; value: number; color?: string; at?: number; note?: string }[] }
    | { kind: "chain"; nodes: { label: string; sub?: string; at?: number; color?: string }[] }
    | { kind: "relations"; center: { label: string; color?: string }; nodes: { label: string; edge: string; at?: number; color?: string; dir?: "in" | "out" }[] }
    | { kind: "card"; text: string; sub?: string }
  );

const yearText = (y: number) => (y < 0 ? `${fmt(-y)} BC` : `${y}`);
const Title: React.FC<{ text?: string; p: number }> = ({ text, p }) =>
  text ? (
    <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 46, letterSpacing: "0.08em", color: INK, opacity: p, transform: `translateY(${(1 - p) * 12}px)`, marginBottom: 28, textAlign: "center" }}>
      {text.toUpperCase()}
    </div>
  ) : null;
const Source: React.FC<{ text?: string; p: number }> = ({ text, p }) =>
  text ? <div style={{ marginTop: 26, fontFamily: theme.fonts.sans, fontSize: 22, color: "rgba(43,36,28,0.65)", opacity: p, textAlign: "center" }}>Source: {text}</div> : null;

const Timeline: React.FC<{ g: Extract<Graphic, { kind: "timeline" }>; t: number }> = ({ g, t }) => {
  const w = 1400;
  const x = (y: number) => ((y - g.from) / (g.to - g.from)) * w;
  const draw = ease(t, g.at, 1);
  const now = g.now?.length
    ? g.now.length === 1 || t <= g.now[0].at
      ? g.now[0].year
      : (() => {
          let v = g.now![g.now!.length - 1].year;
          for (let i = 0; i < g.now!.length - 1; i++) {
            const a = g.now![i], b = g.now![i + 1];
            if (t <= b.at) { v = a.year + (b.year - a.year) * interpolate(t, [a.at, b.at], [0, 1], { ...clamp, easing: theme.ease.inOut }); break; }
          }
          return v;
        })()
    : undefined;
  return (
    <div style={{ position: "relative", width: w, height: 260 }}>
      <div style={{ position: "absolute", top: 100, left: 0, height: 6, width: w * draw, background: INK, borderRadius: 3 }} />
      {(g.eras ?? []).map((e, i) => {
        const p = ease(t, g.at + 0.3 + i * 0.12, 0.5);
        return (
          <div key={i} style={{ position: "absolute", top: 72, left: x(e.from), width: Math.max(4, x(e.to) - x(e.from)), height: 62, background: color(e.color ?? (i % 2 ? "olive" : "terracotta")), opacity: 0.85 * p, borderRadius: 6, transform: `scaleY(${p})` }}>
            {x(e.to) - x(e.from) > 90 && (
              <div style={{ position: "absolute", top: 72, left: 0, right: 0, textAlign: "center", fontFamily: theme.fonts.sans, fontWeight: 700, fontSize: 26, color: INK, whiteSpace: "nowrap", opacity: p }}>{e.label}</div>
            )}
          </div>
        );
      })}
      {(g.marks ?? []).map((m, i) => {
        const p = ease(t, m.at ?? g.at + 0.5 + i * 0.15, 0.4);
        return (
          <div key={i} style={{ position: "absolute", left: x(m.year), top: 182, transform: "translateX(-50%)", textAlign: "center", opacity: p }}>
            <div style={{ width: 3, height: 18, background: INK, margin: "0 auto" }} />
            <div style={{ fontFamily: theme.fonts.sans, fontWeight: 700, fontSize: 22, color: INK, whiteSpace: "nowrap" }}>{yearText(m.year)}</div>
            <div style={{ fontFamily: theme.fonts.sans, fontSize: 20, color: "rgba(43,36,28,0.75)", whiteSpace: "nowrap" }}>{m.label}</div>
          </div>
        );
      })}
      {now !== undefined && (
        <div style={{ position: "absolute", left: x(now), top: 4, transform: "translateX(-50%)", opacity: ease(t, g.at + 0.6, 0.4) }}>
          <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 30, color: C.terracottaDark, textAlign: "center", whiteSpace: "nowrap" }}>{yearText(Math.round(now))}</div>
          <div style={{ width: 0, height: 0, margin: "4px auto 0", borderLeft: "14px solid transparent", borderRight: "14px solid transparent", borderTop: `20px solid ${C.terracottaDark}` }} />
        </div>
      )}
    </div>
  );
};

const Stat: React.FC<{ g: Extract<Graphic, { kind: "stat" }>; t: number }> = ({ g, t }) => {
  const p = ease(t, g.at, 1.4);
  const v = g.value * interpolate(p, [0, 1], [0, 1]);
  const r = g.range;
  const rp = ease(t, g.at + 1.2, 1);
  const span = r ? r.high - r.low : 1;
  return (
    <div style={{ textAlign: "center", minWidth: 900 }}>
      <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 150, color: C.terracottaDark, lineHeight: 1 }}>
        {g.prefix}
        {fmt(v, g.decimals)}
        {g.suffix}
      </div>
      <div style={{ fontFamily: theme.fonts.sans, fontWeight: 600, fontSize: 36, color: INK, marginTop: 16, opacity: ease(t, g.at + 0.4) }}>{g.label}</div>
      {r && (
        <div style={{ position: "relative", width: 900, height: 120, margin: "40px auto 0", opacity: rp }}>
          <div style={{ position: "absolute", top: 40, left: 0, right: 0, height: 4, background: "rgba(43,36,28,0.25)" }} />
          <div style={{ position: "absolute", top: 30, left: 0, width: 900 * rp, height: 24, background: `linear-gradient(90deg, ${C.ochre}, ${C.terracotta})`, borderRadius: 12, opacity: 0.85 }} />
          {[{ v: r.low, l: r.lowLabel, x: 0 }, { v: r.high, l: r.highLabel, x: 900 }, ...(g.value > r.low && g.value < r.high ? [{ v: g.value, l: undefined, x: ((g.value - r.low) / span) * 900 }] : [])].map((m, i) => (
            <div key={i} style={{ position: "absolute", left: m.x, top: 64, transform: "translateX(-50%)", textAlign: "center", whiteSpace: "nowrap" }}>
              <div style={{ fontFamily: theme.fonts.sans, fontWeight: 700, fontSize: 28, color: INK }}>{fmt(m.v)}</div>
              {m.l && <div style={{ fontFamily: theme.fonts.sans, fontSize: 20, color: "rgba(43,36,28,0.7)" }}>{m.l}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Percent: React.FC<{ g: Extract<Graphic, { kind: "percent" }>; t: number }> = ({ g, t }) => {
  const p = ease(t, g.at, 1.4);
  const r = 190, c = 2 * Math.PI * r;
  const col = color(g.color ?? "terracotta");
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 70 }}>
      <svg width={460} height={460} viewBox="0 0 460 460">
        <circle cx={230} cy={230} r={r} fill="none" stroke="rgba(43,36,28,0.18)" strokeWidth={56} />
        <circle cx={230} cy={230} r={r} fill="none" stroke={col} strokeWidth={56} strokeDasharray={`${(c * g.value * p) / 100} ${c}`} transform="rotate(-90 230 230)" />
        <text x={230} y={258} textAnchor="middle" fontFamily={theme.fonts.display} fontWeight={700} fontSize={96} fill={INK}>
          {Math.round(g.value * p)}%
        </text>
      </svg>
      <div style={{ maxWidth: 620 }}>
        <div style={{ fontFamily: theme.fonts.sans, fontWeight: 700, fontSize: 40, color: col, opacity: ease(t, g.at + 0.5) }}>{g.label}</div>
        {g.restLabel && <div style={{ fontFamily: theme.fonts.sans, fontWeight: 600, fontSize: 32, color: "rgba(43,36,28,0.75)", marginTop: 18, opacity: ease(t, g.at + 1) }}>{g.restLabel}</div>}
      </div>
    </div>
  );
};

const Compare: React.FC<{ g: Extract<Graphic, { kind: "compare" }>; t: number }> = ({ g, t }) => {
  const max = Math.max(...g.items.map((i) => i.value));
  return (
    <div style={{ width: 1300 }}>
      {g.items.map((it, i) => {
        const p = ease(t, it.at ?? g.at + i * 0.35, 1);
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", margin: "18px 0", opacity: Math.min(1, p * 2) }}>
            <div style={{ width: 330, fontFamily: theme.fonts.sans, fontWeight: 700, fontSize: 30, color: INK, textAlign: "right", paddingRight: 24 }}>{it.label}</div>
            <div style={{ height: 54, width: (it.value / max) * 760 * p, background: color(it.color ?? (i === 0 ? "terracotta" : "olive")), borderRadius: 6 }} />
            <div style={{ paddingLeft: 18, fontFamily: theme.fonts.sans, fontWeight: 700, fontSize: 30, color: INK, whiteSpace: "nowrap" }}>
              {fmt(it.value * p)} {g.unit}
              {it.note && <span style={{ fontWeight: 500, fontSize: 22, color: "rgba(43,36,28,0.7)" }}> {it.note}</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const Chain: React.FC<{ g: Extract<Graphic, { kind: "chain" }>; t: number }> = ({ g, t }) => {
  const n = g.nodes.length;
  const w = Math.min(320, 1600 / n - 40);
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {g.nodes.map((nd, i) => {
        const at = nd.at ?? g.at + i * 0.45;
        const p = spring({ frame: (t - at) * 30, fps: 30, config: theme.spring.snappy });
        const lp = ease(t, at - 0.3, 0.3);
        return (
          <div key={i} style={{ display: "flex", alignItems: "center" }}>
            {i > 0 && <div style={{ width: 46, height: 5, background: INK, transform: `scaleX(${lp})`, transformOrigin: "left", margin: "0 6px" }} />}
            <div style={{ width: w, padding: "22px 14px", borderRadius: 14, background: color(nd.color ?? "terracotta"), color: C.text, textAlign: "center", opacity: t < at ? 0 : 1, transform: `scale(${0.7 + 0.3 * p})`, boxShadow: "0 8px 20px rgba(43,36,28,0.3)" }}>
              <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 30, letterSpacing: "0.04em" }}>{nd.label}</div>
              {nd.sub && <div style={{ fontFamily: theme.fonts.sans, fontWeight: 600, fontSize: 22, marginTop: 6, opacity: 0.9 }}>{nd.sub}</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const Relations: React.FC<{ g: Extract<Graphic, { kind: "relations" }>; t: number }> = ({ g, t }) => {
  const R = 330, cx = 700, cy = 330;
  const n = g.nodes.length;
  return (
    <div style={{ position: "relative", width: 1400, height: 660 }}>
      <svg width={1400} height={660} style={{ position: "absolute", inset: 0 }}>
        {g.nodes.map((nd, i) => {
          const a = -Math.PI / 2 + (i / n) * Math.PI * 2;
          const x = cx + Math.cos(a) * R * 1.55, y = cy + Math.sin(a) * R * 0.82;
          const at = nd.at ?? g.at + 0.5 + i * 0.4;
          const p = ease(t, at, 0.6);
          const [x1, y1, x2, y2] = nd.dir === "in" ? [x, y, cx, cy] : [cx, cy, x, y];
          const ex = x1 + (x2 - x1) * (0.2 + 0.6 * p), ey = y1 + (y2 - y1) * (0.2 + 0.6 * p);
          return (
            <g key={i} opacity={Math.min(1, p * 3)}>
              <line x1={x1 + (x2 - x1) * 0.2} y1={y1 + (y2 - y1) * 0.2} x2={ex} y2={ey} stroke={INK} strokeWidth={5} strokeLinecap="round" />
              <text x={(cx + x) / 2} y={(cy + y) / 2 - 12} textAnchor="middle" fontFamily={theme.fonts.sans} fontWeight={700} fontSize={24} fill={C.terracottaDark} opacity={ease(t, at + 0.4)}>
                {nd.edge}
              </text>
            </g>
          );
        })}
      </svg>
      {[{ label: g.center.label, color: g.center.color ?? "terracotta", x: cx, y: cy, at: g.at, big: true }, ...g.nodes.map((nd, i) => {
        const a = -Math.PI / 2 + (i / n) * Math.PI * 2;
        return { label: nd.label, color: nd.color ?? "olive", x: cx + Math.cos(a) * R * 1.55, y: cy + Math.sin(a) * R * 0.82, at: nd.at ?? g.at + 0.5 + i * 0.4, big: false };
      })].map((b, i) => {
        const p = spring({ frame: (t - b.at) * 30, fps: 30, config: theme.spring.snappy });
        return (
          <div key={i} style={{ position: "absolute", left: b.x, top: b.y, transform: `translate(-50%,-50%) scale(${t < b.at ? 0 : 0.7 + 0.3 * p})`, padding: b.big ? "26px 40px" : "16px 26px", borderRadius: 14, background: color(b.color), color: C.text, fontFamily: theme.fonts.display, fontWeight: 700, fontSize: b.big ? 40 : 28, whiteSpace: "nowrap", boxShadow: "0 8px 20px rgba(43,36,28,0.3)" }}>
            {b.label}
          </div>
        );
      })}
    </div>
  );
};

const Card: React.FC<{ g: Extract<Graphic, { kind: "card" }>; t: number }> = ({ g, t }) => (
  <div style={{ maxWidth: 1250, textAlign: "center", opacity: ease(t, g.at, 0.8) }}>
    <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 58, lineHeight: 1.25, color: INK }}>{g.text}</div>
    {g.sub && <div style={{ fontFamily: theme.fonts.sans, fontWeight: 600, fontSize: 30, marginTop: 24, color: "rgba(43,36,28,0.75)", opacity: ease(t, g.at + 0.6) }}>{g.sub}</div>}
  </div>
);

const Body: React.FC<{ g: Graphic; t: number }> = ({ g, t }) => {
  switch (g.kind) {
    case "timeline": return <Timeline g={g} t={t} />;
    case "stat": return <Stat g={g} t={t} />;
    case "percent": return <Percent g={g} t={t} />;
    case "compare": return <Compare g={g} t={t} />;
    case "chain": return <Chain g={g} t={t} />;
    case "relations": return <Relations g={g} t={t} />;
    case "card": return <Card g={g} t={t} />;
  }
};

/** Paper panel holding a graphic. layout "full" = full-frame parchment; others = a floating card over the picture. */
export const GraphicView: React.FC<{ g: Graphic }> = ({ g }) => {
  const { t } = useSceneTime();
  if (t < g.at - 0.1 || (g.until !== undefined && t > g.until + 0.4)) return null;
  const inP = ease(t, g.at - 0.1, 0.45);
  const outP = g.until !== undefined ? interpolate(t, [g.until, g.until + 0.4], [1, 0], clamp) : 1;
  const layout = g.layout ?? "full";
  const inner = (
    <>
      <Title text={g.title} p={ease(t, g.at)} />
      <Body g={g} t={t} />
      <Source text={g.source} p={ease(t, g.at + 1)} />
    </>
  );
  if (layout === "full") {
    return (
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 45%, ${C.parchment}, ${C.parchmentDark})`, alignItems: "center", justifyContent: "center", opacity: inP * outP }}>
        <div style={{ transform: `translateY(${(1 - inP) * 20}px) scale(${1.2})`, display: "flex", flexDirection: "column", alignItems: "center" }}>{inner}</div>
      </AbsoluteFill>
    );
  }
  const pos: React.CSSProperties =
    layout === "left" ? { left: 80, top: 120, transformOrigin: "left top" } : layout === "right" ? { right: 80, top: 120, transformOrigin: "right top" } : layout === "lower" ? { left: "50%", bottom: 210, translate: "-50% 0" } : { left: "50%", top: "50%", translate: "-50% -50%" };
  return (
    <div style={{ position: "absolute", ...pos, padding: "40px 54px", borderRadius: 18, background: `linear-gradient(180deg, ${C.parchment}, ${C.parchmentDark})`, boxShadow: "0 18px 50px rgba(20,12,6,0.55)", opacity: inP * outP, transform: `scale(${(0.66 + 0.06 * inP) * (layout === "center" ? 1.2 : 1)})`, display: "flex", flexDirection: "column", alignItems: "center", pointerEvents: "none" }}>
      {inner}
    </div>
  );
};

export const Graphics: React.FC<{ items: Graphic[] }> = ({ items }) => (
  <>
    {items.map((g, i) => (
      <GraphicView key={i} g={g} />
    ))}
  </>
);
