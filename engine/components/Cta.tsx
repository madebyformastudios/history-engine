import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { brand } from "../brand";

/**
 * Subscribe overlay for the spoken CTA: channel logo + name, a Subscribe button that a cursor
 * clicks (turns into "Subscribed"), then the bell gets clicked and rings. Slides in and out.
 * Render it at the top level of the video (absolute frames), not inside a scene Sequence,
 * so it is never cut by a scene change. `at` and `duration` are absolute seconds.
 */
export type CtaConfig = { at: number; duration?: number; position?: "bottom-left" | "bottom-right" | "top-left" | "top-right" };

// Card geometry (px). Positions below are derived from these, so the cursor always hits the buttons.
const H = 128;
const PAD_L = 16;
const LOGO = 96;
const GAP = 22;
const TEXT_W = 330;
const BTN_W = 236;
const BTN_H = 64;
const BELL = 64;
const W = PAD_L + LOGO + GAP + TEXT_W + 26 + BTN_W + 14 + BELL + 24;
const BTN_X = PAD_L + LOGO + GAP + TEXT_W + 26;
const BELL_X = BTN_X + BTN_W + 14;

const RED = "#D7261E";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Cursor path keyframes, seconds relative to `at`, in card coordinates (tip of the arrow). */
const cursorPath = (s: number) => {
  const bx = BTN_X + BTN_W * 0.62, by = H / 2 + 6;
  const lx = BELL_X + BELL * 0.55, ly = H / 2 + 8;
  const e = theme.ease.inOut;
  if (s < 1.6) {
    const k = interpolate(s, [0.75, 1.5], [0, 1], { ...clamp, easing: e });
    return { x: interpolate(k, [0, 1], [W + 260, bx]), y: interpolate(k, [0, 1], [H + 170, by]) };
  }
  if (s < 2.7) {
    const k = interpolate(s, [2.0, 2.55], [0, 1], { ...clamp, easing: e });
    return { x: interpolate(k, [0, 1], [bx, lx]), y: interpolate(k, [0, 1], [by, ly]) };
  }
  const k = interpolate(s, [3.1, 3.8], [0, 1], { ...clamp, easing: theme.ease.in });
  return { x: interpolate(k, [0, 1], [lx, lx + 120]), y: interpolate(k, [0, 1], [ly, ly + 160]) };
};

const Cursor: React.FC<{ press: number }> = ({ press }) => (
  <svg width={46} height={46} viewBox="0 0 24 24" style={{ transform: `scale(${1 - 0.16 * press})`, transformOrigin: "0 0", filter: "drop-shadow(0 3px 5px rgba(0,0,0,0.55))" }}>
    <path d="M3 2 L3 19.5 L7.6 15.3 L10.6 22 L13.6 20.7 L10.7 14.1 L17 14.1 Z" fill="#fff" stroke="#111" strokeWidth={1.4} strokeLinejoin="round" />
  </svg>
);

const BellIcon: React.FC<{ filled: boolean }> = ({ filled }) => (
  <svg width={34} height={34} viewBox="0 0 24 24">
    <path
      d="M12 3a6 6 0 0 0-6 6v4.2L4.3 16.6a.8.8 0 0 0 .7 1.2h14a.8.8 0 0 0 .7-1.2L18 13.2V9a6 6 0 0 0-6-6Z"
      fill={filled ? theme.colors.text : "none"}
      stroke={theme.colors.text}
      strokeWidth={1.9}
      strokeLinejoin="round"
    />
    <path d="M9.6 19.6a2.5 2.5 0 0 0 4.8 0" fill="none" stroke={theme.colors.text} strokeWidth={1.9} strokeLinecap="round" />
  </svg>
);

const Ripple: React.FC<{ s: number; at: number; x: number; y: number }> = ({ s, at, x, y }) => {
  const k = interpolate(s, [at, at + 0.45], [0, 1], clamp);
  if (s < at || k >= 1) return null;
  const r = 14 + 46 * k;
  return (
    <div
      style={{
        position: "absolute",
        left: x - r,
        top: y - r,
        width: r * 2,
        height: r * 2,
        borderRadius: "50%",
        border: `3px solid rgba(255,255,255,${0.7 * (1 - k)})`,
      }}
    />
  );
};

export const CtaOverlay: React.FC<CtaConfig> = ({ at, duration = 5.5, position = "bottom-left" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = frame / fps - at; // seconds since the CTA started
  if (s < -0.1 || s > duration + 0.1) return null;

  const enter = spring({ frame: s * fps, fps, config: theme.spring.smooth });
  const exit = interpolate(s, [duration - 0.55, duration], [0, 1], { ...clamp, easing: theme.ease.in });
  const shown = enter * (1 - exit);

  const CLICK_SUB = 1.6;
  const CLICK_BELL = 2.7;
  const subscribed = s >= CLICK_SUB + 0.05;
  const belled = s >= CLICK_BELL + 0.05;
  const press = (c: number) => interpolate(s, [c - 0.08, c, c + 0.16], [0, 1, 0], clamp);
  const btnPop = spring({ frame: (s - CLICK_SUB) * fps, fps, config: theme.spring.snappy });
  const ring = belled ? Math.sin((s - CLICK_BELL) * 26) * 22 * Math.max(0, 1 - (s - CLICK_BELL) / 0.9) : 0;

  const cur = cursorPath(s);
  const cursorOpacity = interpolate(s, [0.7, 0.9, 3.3, 3.8], [0, 1, 1, 0], clamp);

  const top = position.startsWith("top");
  const left = position.endsWith("left");
  const offset = (1 - enter) * 60 + exit * 40;

  return (
    <div
      style={{
        position: "absolute",
        [left ? "left" : "right"]: 90,
        [top ? "top" : "bottom"]: top ? 80 : 225,
        width: W,
        height: H,
        opacity: shown,
        transform: `translateY(${top ? -offset : offset}px) scale(${0.94 + 0.06 * enter})`,
        transformOrigin: left ? "left center" : "right center",
        pointerEvents: "none",
      }}
    >
      {/* card */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: H / 2,
          background: "linear-gradient(180deg, rgba(36,28,20,0.9), rgba(20,15,10,0.9))",
          border: `1.5px solid rgba(200,150,62,0.55)`,
          boxShadow: "0 14px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(247,238,219,0.12)",
        }}
      />
      {/* logo */}
      <img
        src={brand.logo}
        style={{
          position: "absolute",
          left: PAD_L,
          top: (H - LOGO) / 2,
          width: LOGO,
          height: LOGO,
          borderRadius: "50%",
          border: `3px solid ${theme.colors.ochre}`,
          boxSizing: "border-box",
          objectFit: "cover",
        }}
      />
      {/* name + tagline */}
      <div style={{ position: "absolute", left: PAD_L + LOGO + GAP, top: 0, width: TEXT_W, height: H, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ fontFamily: theme.fonts.display, fontWeight: 700, fontSize: 34, letterSpacing: "0.04em", color: theme.colors.text, whiteSpace: "nowrap" }}>{brand.name}</div>
        <div style={{ fontFamily: theme.fonts.sans, fontWeight: 500, fontSize: 19, color: "rgba(247,238,219,0.68)", marginTop: 4, whiteSpace: "nowrap" }}>{brand.tagline}</div>
      </div>
      {/* subscribe button */}
      <div
        style={{
          position: "absolute",
          left: BTN_X,
          top: (H - BTN_H) / 2,
          width: BTN_W,
          height: BTN_H,
          borderRadius: BTN_H / 2,
          background: subscribed ? "rgba(247,238,219,0.16)" : RED,
          border: subscribed ? "1.5px solid rgba(247,238,219,0.3)" : "1.5px solid transparent",
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          fontFamily: theme.fonts.sans,
          fontWeight: 700,
          fontSize: 27,
          color: "#fff",
          transform: `scale(${1 - 0.06 * press(CLICK_SUB) + (subscribed ? 0.05 * (1 - btnPop) : 0)})`,
        }}
      >
        {subscribed && (
          <svg width={26} height={26} viewBox="0 0 24 24">
            <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#fff" strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={24} strokeDashoffset={24 * (1 - btnPop)} />
          </svg>
        )}
        {subscribed ? "Subscribed" : "Subscribe"}
      </div>
      {/* bell */}
      <div
        style={{
          position: "absolute",
          left: BELL_X,
          top: (H - BELL) / 2,
          width: BELL,
          height: BELL,
          borderRadius: "50%",
          background: belled ? "rgba(200,150,62,0.35)" : "rgba(247,238,219,0.12)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: interpolate(s, [1.75, 2.05], [0.35, 1], clamp),
          transform: `scale(${1 - 0.08 * press(CLICK_BELL)})`,
        }}
      >
        <div style={{ transform: `rotate(${ring}deg)`, transformOrigin: "50% 15%", display: "flex" }}>
          <BellIcon filled={belled} />
        </div>
      </div>
      <Ripple s={s} at={CLICK_SUB} x={cursorPath(CLICK_SUB).x} y={cursorPath(CLICK_SUB).y} />
      <Ripple s={s} at={CLICK_BELL} x={cursorPath(CLICK_BELL).x} y={cursorPath(CLICK_BELL).y} />
      {/* cursor */}
      <div style={{ position: "absolute", left: cur.x, top: cur.y, opacity: cursorOpacity }}>
        <Cursor press={Math.max(press(CLICK_SUB), press(CLICK_BELL))} />
      </div>
    </div>
  );
};
