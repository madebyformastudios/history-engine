import { AbsoluteFill, interpolate, spring } from "remotion";
import type { TextLabel } from "../config";
import { useSceneTime } from "../timing";
import { theme } from "../theme";

const SHADOW = `0 3px 22px ${theme.colors.shadow}, 0 1px 3px rgba(0,0,0,0.55)`;

/** Centred serif title with a thin rule that draws out underneath it. */
const TitleCard: React.FC<{ text: string; at: number }> = ({ text, at }) => {
  const { t, fps } = useSceneTime();
  if (t < at) return null;
  const f = (t - at) * fps;
  const p = spring({ frame: f, fps, config: theme.spring.soft });
  const rule = spring({ frame: f - 10, fps, config: theme.spring.smooth });
  const breathe = 1 + Math.sin(t * 0.9) * 0.004;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
      {/* soft dark backing so the title reads on a bright sky */}
      <div
        style={{
          position: "absolute",
          width: 1500,
          height: 420,
          top: 300,
          background: "radial-gradient(ellipse at center, rgba(30,18,8,0.42), transparent 66%)",
          opacity: p,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 380,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          transform: `translateY(${(1 - p) * 26}px) scale(${(0.97 + 0.03 * p) * breathe})`,
          opacity: p,
        }}
      >
        <div
          style={{
            fontFamily: theme.fonts.display,
            fontWeight: 700,
            fontSize: 112,
            letterSpacing: `${0.08 + (1 - p) * 0.06}em`,
            color: theme.colors.text,
            textShadow: SHADOW,
            whiteSpace: "nowrap",
          }}
        >
          {text}
        </div>
        <div
          style={{
            marginTop: 18,
            height: 2,
            width: interpolate(rule, [0, 1], [0, 780]),
            background: `linear-gradient(90deg, transparent, ${theme.colors.ochre} 18%, ${theme.colors.parchment} 50%, ${theme.colors.ochre} 82%, transparent)`,
            boxShadow: `0 1px 6px ${theme.colors.shadow}`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

/** Lower-left name card ("GENGHIS KHAN"), sits above the caption band. */
const NameCard: React.FC<{ text: string; at: number }> = ({ text, at }) => {
  const { t, fps } = useSceneTime();
  if (t < at) return null;
  const f = (t - at) * fps;
  const p = spring({ frame: f, fps, config: theme.spring.smooth });
  const rule = spring({ frame: f - 6, fps, config: theme.spring.smooth });
  return (
    <div style={{ position: "absolute", left: 96, bottom: 250, pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: -140,
          top: -120,
          width: 1000,
          height: 330,
          background: "radial-gradient(ellipse at 35% 50%, rgba(20,12,6,0.5), transparent 66%)",
          opacity: p,
        }}
      />
      <div
        style={{
          fontFamily: theme.fonts.display,
          fontWeight: 700,
          fontSize: 84,
          letterSpacing: "0.1em",
          color: theme.colors.text,
          textShadow: SHADOW,
          opacity: p,
          transform: `translateX(${(1 - p) * -30}px)`,
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </div>
      <div
        style={{
          marginTop: 10,
          height: 3,
          width: interpolate(rule, [0, 1], [0, 360]),
          background: `linear-gradient(90deg, ${theme.colors.ochre}, transparent)`,
        }}
      />
    </div>
  );
};

export const Titles: React.FC<{ titles: TextLabel[] }> = ({ titles }) => (
  <>
    {titles.map((l) =>
      l.style === "title" ? <TitleCard key={l.text} text={l.text} at={l.at} /> : <NameCard key={l.text} text={l.text} at={l.at} />,
    )}
  </>
);
