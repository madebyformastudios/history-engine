import { interpolate, spring } from "remotion";
import type { YearKey } from "../config";
import { keyframes, useSceneTime } from "../timing";
import { theme } from "../theme";

// Historical years have no year 0: 1 BC is followed by 1 AD.
// Convert to astronomical numbering (1 BC = 0, 2 BC = -1) to interpolate, then back.
export const toAstronomical = (year: number) => (year < 0 ? year + 1 : year);
export const fromAstronomical = (astro: number) => (astro <= 0 ? astro - 1 : astro);

export const formatYear = (year: number) => {
  const y = Math.round(year);
  return y < 0 ? { num: String(-y), era: "BC" } : { num: String(y), era: "AD" };
};

/** Parses "753 BC" / "117 AD" / "395" into a signed year, or null for other text. */
export const parseYear = (text: string): number | null => {
  const m = text.trim().match(/^(\d+)\s*(BC|BCE|AD|CE)?$/i);
  if (!m) return null;
  const n = parseInt(m[1], 10);
  return m[2] && /^BC/i.test(m[2]) ? -n : n;
};

/** The top-left date plaque: big number + era. Used both static and counting. */
export const DatePlaque: React.FC<{ num: string; era?: string; appearAt: number; pulse?: number }> = ({
  num,
  era,
  appearAt,
  pulse = 0,
}) => {
  const { t, fps } = useSceneTime();
  const p = spring({ frame: (t - appearAt) * fps, fps, config: theme.spring.smooth });
  if (t < appearAt) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 92,
        top: 72,
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [-24, 0])}px) scale(${1 + pulse * 0.04})`,
        transformOrigin: "0% 50%",
        color: theme.colors.text,
        textShadow: `0 3px 18px ${theme.colors.shadow}, 0 1px 3px rgba(0,0,0,0.6)`,
      }}
    >
      {/* soft backing so the plaque reads on bright images */}
      <div
        style={{
          position: "absolute",
          left: -120,
          top: -110,
          width: 620,
          height: 360,
          background: "radial-gradient(ellipse at 30% 40%, rgba(20,12,6,0.32), transparent 62%)",
          zIndex: -1,
        }}
      />
      <div style={{ display: "flex", alignItems: "baseline", gap: 18, fontFamily: theme.fonts.display }}>
        <span style={{ fontSize: 104, fontWeight: 700, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>{num}</span>
        {era && (
          <span style={{ fontSize: 46, fontWeight: 500, color: theme.colors.gold, letterSpacing: "0.08em" }}>{era}</span>
        )}
      </div>
      <div
        style={{
          marginTop: 14,
          height: 3,
          width: interpolate(p, [0, 1], [0, 220]),
          background: `linear-gradient(90deg, ${theme.colors.gold}, transparent)`,
        }}
      />
    </div>
  );
};

/** Counts between year keyframes (negative = BC). Shows no year 0. */
export const YearCounter: React.FC<{ keys: YearKey[]; era?: string }> = ({ keys, era: forcedEra }) => {
  const { t } = useSceneTime();
  const astroKeys = keys.map((k) => ({ at: k.at, v: toAstronomical(k.value) }));
  const astro = keyframes(t, astroKeys, (k) => k.v, theme.ease.inOut);
  const year = fromAstronomical(Math.round(astro));
  const { num } = formatYear(year);
  // AD is implied unless asked for; BC is always shown
  const era = year < 0 ? "BC" : forcedEra;
  // little pop while the number is moving
  const dt = 1 / 30;
  const speed = Math.abs(keyframes(t + dt, astroKeys, (k) => k.v) - keyframes(t - dt, astroKeys, (k) => k.v));
  return <DatePlaque num={num} era={era} appearAt={keys[0].at - 0.2} pulse={Math.min(1, speed / 20)} />;
};

/** A static label such as "753 BC" in the same plaque style. */
export const DateLabel: React.FC<{ text: string; at: number }> = ({ text, at }) => {
  const year = parseYear(text);
  if (year === null) return <DatePlaque num={text} appearAt={at} />;
  const { num, era } = formatYear(year);
  // show the era only when the label spells it out ("1162 AD") or the year is BC
  const explicit = /\b(AD|CE|BC|BCE)\b/i.test(text) || year < 0;
  return <DatePlaque num={num} era={explicit ? era : undefined} appearAt={at} />;
};
