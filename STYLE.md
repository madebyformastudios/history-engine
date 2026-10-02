# STYLE: how Parchment Atlas looks and moves

Infographic-driven like Vox, but in our own look: illustrated, warm parchment, maps as the main character.
Every new video and every new engine component follows this file. If a rule here blocks a good idea,
change this file first (with Jairo), then build.

## The look

- **Palette** (engine/theme.ts): ochre `#C8963E`, terracotta `#B5552D`, olive `#6B7041`, deep blue `#24384F`,
  parchment `#EADBC0`, ink `#2B241C`. Accent for highlights: ochre. Danger and death tolls: deep red.
- **Type:** Cinzel (titles, name cards, labels on maps and graphics, always uppercase with letter spacing),
  Inter (captions, numbers, sources). Nothing else.
- **Texture:** parchment overlay, grain and dust stay on for the whole video. Graphics sit on parchment cards,
  never on flat white or pure black.
- **Illustrations:** flat 2D, muted earthy colours, soft light, no text in the image (see IMAGE_PROMPTS.md style line).
- **Real photos:** accents only (about 1 in 8 to 10 shots), same camera moves and overlays as the illustrations.

## Motion

- **Easing:** everything eases (theme.ease); nothing moves linearly. Camera moves use the gentle curve
  (no visible acceleration). Pop-ins use a quick spring.
- **Durations:** elements appear in 0.3 to 0.6 s; graphics build in 1 to 2 s; nothing important appears faster
  than the viewer can read it.
- **Camera:** one calm move per picture, chosen from the named moves (`move`: hold, pushIn, pullOut, driftLeft,
  driftRight, rise, sink) and never the same move twice in a row. Many pictures should barely move (`hold`). To show another detail of the same picture, glide there with a
  camera `path` (no cut). Never cut from an image back to the same image (the validator blocks it).
- **Parallax:** only with layers made separately (a background plate plus cut-out figures generated on their own,
  see the `parallax` scene type). Never fake depth by cutting up a single flat image: it looks like a cut-out
  sliding over a smudge.
- **Pacing:** something changes at least every 6 to 8 seconds: a new picture, a map beat, a graphic,
  or a camera glide to a new detail.

## Transitions

| When | Transition |
|---|---|
| Default between scenes and shots | `fade` (soft crossfade, 8 to 12 frames) |
| Start of a new chapter | `whip` (fast blurred slide) or `inkWipe` |
| From a picture into the map of the same place, or back | `zoom` |
| A list of things (one after another) | `push` |
| Hard cut | only on a strong beat: a death, an explosion, a shocking number |

Use one or two transition types per video besides the fade. Variety for its own sake looks cheap.

## Captions

Kinetic captions (`meta.captions: { style: "kinetic" }`): 3 to 5 words, one line, words appear as they are spoken,
names, years and numbers in ochre. Spelling always from script.txt.

## Infographics: only when they add something

A graphic must show something the narration cannot show as fast: a number in context, a comparison, a
sequence, who is connected to whom. Never a graphic that only repeats a sentence.

| Content in the script | Graphic |
|---|---|
| Where we are in the big story (chapter starts) | `timeline` with eras and a moving "now" marker |
| A number that matters, especially a disputed one | `stat`, with `range` and the source of each end |
| A share or a split | `percent` |
| Two or more amounts side by side | `compare` |
| A succession (dynasties, rulers, conquerors) | `chain` |
| Alliances, backers, proxies | `relations` |
| A quote or a key law / treaty line | `card` |
| A detail in an illustration or photo | `annotations` (circle, arrow, box, label) |

Rules: one idea per graphic, at most 5 items, a source line for every number, `layout: "right"` or `"left"`
when the picture behind it still matters, `"full"` when the graphic is the point. Death tolls and contested
figures always show the range (see CLAUDE.md, "Real over comfortable").

## Maps

- Borders from Cliopatria (borders per year) where it has the state; historical-basemaps or hand-made only
  when it does not, and then with a comment saying why and what geography the border follows.
- Real rivers on (`rivers: true`); rivers that matter to the story drawn as a `river` line by name.
- Armies follow land: roads, river valleys, passes. Sea crossings and missiles are marked `overWater`.
- One idea per map beat; the camera moves to where the action is before the label or arrow appears.
- Colours: the subject of the video in terracotta; rivals olive or deep red; bystanders muted parchment.
