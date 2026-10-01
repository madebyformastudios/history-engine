// Single source of truth for colors, type, easing and springs.
// To restyle a video for another topic, change this file only.
import { Easing } from "remotion";
import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Fonts are bundled in public/fonts (no network needed at render time).
const fonts: [string, string, string][] = [
  ["Cinzel", "500", "cinzel-latin-500-normal.woff2"],
  ["Cinzel", "700", "cinzel-latin-700-normal.woff2"],
  ["Inter", "500", "inter-latin-500-normal.woff2"],
  ["Inter", "600", "inter-latin-600-normal.woff2"],
  ["Inter", "700", "inter-latin-700-normal.woff2"],
];
for (const [family, weight, file] of fonts) {
  loadFont({ family, url: staticFile(`fonts/${file}`), weight, format: "woff2" });
}
const display = { fontFamily: "Cinzel" };
const sans = { fontFamily: "Inter" };

export const theme = {
  colors: {
    // Runbook palette
    ochre: "#C8963E",
    terracotta: "#B5552D",
    olive: "#6B7041",
    deepBlue: "#24384F",
    parchment: "#EADBC0",
    ink: "#2B241C",
    // Derived tones
    parchmentDark: "#CDB78A",
    coast: "#8E744A",
    sea: "#3A5670",
    seaDeep: "#24384F",
    river: "#4E7593",
    terracottaDark: "#7E3418",
    gold: "#D9AE4E", // Golden Horde
    deepRed: "#80261F", // Ilkhanate
    tributary: "#D08A4E", // vassal / tributary states
    danger: "#C8321E", // flashes on burning cities
    text: "#F7EEDB",
    shadow: "rgba(20, 12, 6, 0.55)",
  },
  fonts: {
    display: display.fontFamily,
    sans: sans.fontFamily,
  },
  ease: {
    out: Easing.bezier(0.16, 1, 0.3, 1),
    inOut: Easing.bezier(0.65, 0, 0.35, 1),
    gentle: Easing.bezier(0.45, 0, 0.55, 1), // Ken Burns / camera: no visible acceleration
    in: Easing.bezier(0.7, 0, 0.84, 0),
  },
  spring: {
    snappy: { damping: 14, stiffness: 160, mass: 0.6 },
    smooth: { damping: 20, stiffness: 90, mass: 1 },
    soft: { damping: 26, stiffness: 70, mass: 1 },
  },
} as const;

export type ThemeColor = keyof typeof theme.colors;

/** Accepts a theme color name ("terracotta") or any CSS color. */
export const color = (c: string): string => (c in theme.colors ? theme.colors[c as ThemeColor] : c);
