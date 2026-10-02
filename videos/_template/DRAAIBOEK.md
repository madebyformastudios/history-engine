# DRAAIBOEK: <title>

The scene-by-scene runbook. Single source of truth: every scene, every asset, every cue.

## How to read this runbook

- One scene = one paragraph in `script.txt` (same order).
- `VO`: exact voiceover text. Timing comes from the voiceover (transcription).
- `ASSET`: `IMG 001` = public/images/001.jpg, `MAP-01` = map defined below, `GFX-01` = coded graphic,
  `BG 002 + CUT 012` = parallax (background + transparent cutout).
- `MOTION`: how the asset moves. `CUES`: moments anchored to a spoken word, `@"Otrar"`.
- `LABEL`: on-screen text (year, name).
- Reuse an asset in another scene only when the runbook says so.
- Pacing: no shot longer than 8 seconds. Split long VO over several shots (another image, a map beat, or a new
  camera move on another part of the same image). Shots within one scene: `SHOTS:` lines with a cue word each.
- CTA: one short spoken subscribe line at the end of the first chapter (never in the first minute), with `CTA: subscribe overlay` on that scene.
- Photos: real, free-licensed photos (Wikimedia Commons, museum open access) as accents, about 1 in 8 to 10 shots. Mark them `PHOTO-NN` in the shot list; sources and licences go in PHOTOS.md.

## Pronunciation (script_elevenlabs.txt)

| Written | Spoken |
|---|---|

---

## PART 1: <name>

### S01 | IMG 001 | Ken Burns
VO: "..."
MOTION: ...
CUES: @"word" ...
LABEL: ...

---

## Map definitions

| ID | Name | Area | Content (territories by year, cities, routes) |
|---|---|---|---|

## Graphics

| ID | Name | Description |
|---|---|---|

## Asset checklist

| Asset | Description | Scene(s) |
|---|---|---|
| 001 | ... | S01 |
