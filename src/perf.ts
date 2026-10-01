import { getInputProps } from "remotion";

/**
 * Performance switches for benchmarking. Pass inputProps like {"off": ["grain", "blur"]}.
 * Keys: parchment, grain, dust, grade, vignette, mapShadow, blur (all CSS/SVG blur + drop-shadow).
 * With no inputProps everything is on, so normal renders are unchanged.
 */
const props = (() => {
  try {
    return getInputProps() as { off?: string[] };
  } catch {
    return {};
  }
})();
const disabled = new Set(props.off ?? []);
export const isOff = (key: string) => disabled.has(key) || disabled.has("all");
