# CATALOG: what the engine already has

Read this before building anything. If something here does the job, use it through `scene-spec.mjs`.
Only write new code when nothing here fits, and then add it to `engine/` and to this catalog.

Full working example of every option: `videos/mongol-empire/scene-spec.mjs` and `videos/iran/scene-spec.mjs` (multi-shot).
See every new feature on screen: `npm run demo <slug>` (engine/FeatureDemo.tsx). Look and motion rules: STYLE.md.

## Scene types

| Type | What it shows | Key options |
|---|---|---|
| `image` | A still image with a camera move (Ken Burns) | `image`, `kenBurns` |
| `parallax` | Background image + transparent cutout(s) moving across it | `background` (image + Ken Burns), `sprites` |
| `map` | Animated historical map | `map` (see Maps) |
| `shots` | Several shots in one scene (one VO paragraph), each starting on a cue word: an image with its own camera move, or a map. Shots after the first fade in over `shotFade` frames (default 6, 0 = hard cut); a shot can set its own `fade`. Use this to change the picture every 5 to 8 seconds | `shots: [{ at, image, kenBurns } or { at, map }]`, `shotFade` |
| `gfx` | Coded motion graphic. Available: `decimal-army` (10 / 100 / 1,000 / 10,000 grid) | `gfx`, `steps` |

### Ken Burns (`kenBurns`, also used by `parallax.background`)
- `path: [{ at, scale, x, y }, ...]`: camera keyframes; the camera glides from detail to detail without a cut. Use this instead of two shots on the same image (the validator blocks those).
- `from` / `to`: `{ scale, x, y }`. `scale` 1 = fit, `x`/`y` 0..1 = point of the image in the centre.
- `matte: { y, color, colorBottom? }`: paints ground colour below row `y` for images whose art stops short (see 002 in the Mongol video).
- `desaturate: [from, to]`: fade colour out over the scene (0..1).
- Helper in the spec: `kb([scale, x, y], [scale, x, y], extra)`.

### Sprites (`parallax.sprites[]`, cutouts must be RGBA PNG)
`src`, `start`, `end`, `height` (px), `bottom` (px from bottom), `from` / `to` (left edge, % of width), `bob` (px bounce per stride), `strideHz`.
Has a soft drop shadow.

### Depth parallax (`depth` on an image scene or image shot)
`depth: 0.6` to `1` (subtle to normal). Needs layers: `npm run depth <slug>` (all images) or `npm run depth <slug> 012 013`.
It estimates depth (Depth Anything V2, ONNX, CPU), cuts out the figures and objects that stand in front and paints
them out of the background (`public/layers/NNN_0.webp`, `NNN_1.webp`, commit them). `NNN_depth.png` shows the split.
Works on any illustration; skip it on images with text or flat diagrams. Python deps: `pip install -r scripts/requirements.txt`.

## Transitions (`transition: { type, frames?, direction?, origin? }`)

On a scene (how it comes in), on a shot, or as the default `meta.transition`. Without one: the old crossfade.

| Type | Look |
|---|---|
| `fade` | Soft crossfade (default) |
| `cut` | Hard cut |
| `whip` | Fast slide with motion blur (`direction`: left, right, up, down) |
| `push` | New picture slides over the old one with a shadow |
| `inkWipe` | Organic ink-blot reveal from `origin` [x, y] (0..1) |
| `zoom` | New picture grows out of the old one |

## Captions (`meta.captions`)

`{ style: "kinetic" }`: 3 to 5 words at a time, words pop in as spoken, names / years / numbers highlighted (`highlight: false` to turn off, `size` in px).
`{ style: "classic" }` (default): two-line pages with word highlight. `{ style: "off" }`: none.

## Infographics

Rules for when to use which: STYLE.md. All content comes from the spec. Times are absolute ("@word" works).

| Option | What it shows |
|---|---|
| `annotations: [...]` on an image scene or image shot | Hand-drawn `circle` {x, y, r, label}, `arrow` {from, to, label}, `box` {x, y, w, h, label}, `label` {x, y, text}. Image coordinates 0..1; they move with the camera |
| `graphics: [...]` on any scene | Graphic overlays. Each: `{ kind, at, until?, layout?, title?, source? }`, layout `full`, `left`, `right`, `lower`, `center` |
| `{ at, graphic: {...} }` as a shot | Full-frame graphic shot on parchment |

| `kind` | Fields |
|---|---|
| `timeline` | `from`, `to` (years, negative = BC), `eras: [{from, to, label, color}]`, `marks: [{year, label}]`, `now: [{at, year}, ...]` (moving marker) |
| `stat` | `value`, `label`, `prefix`, `suffix`, `decimals`, `range: {low, high, lowLabel, highLabel}` (counts up, shows where the value sits in the estimates) |
| `percent` | `value` (0..100), `label`, `restLabel`, `color` (donut) |
| `compare` | `items: [{label, value, color, note, at}]`, `unit` (bars grow one by one) |
| `chain` | `nodes: [{label, sub, color, at}]` (succession, linked boxes) |
| `relations` | `center: {label}`, `nodes: [{label, edge, dir: "in" or "out", at}]` (who backed whom) |
| `card` | `text`, `sub` (quote or key line) |

## Per-scene effects (`effects: {...}`, any scene type)

| Effect | Value | Look | Render cost |
|---|---|---|---|
| `dust` | 0..1 | Floating dust motes catching light | low |
| `smoke` | 0..1 | Slow smoke wisps rising from the bottom | **high** (CSS blur, makes a scene ~3x slower) |
| `fire` | 0..1 | Flickering orange firelight (burning city) | low |
| `rain` | 0..1 | Slanted rain streaks, two depth layers | low |
| `lightning` | list of times | White-blue sky flashes | low |
| `vignette` | 0..1 | Extra dark edges | low |

## Labels and text (any scene type)

| Option | Look |
|---|---|
| `titles: [{ text, at, style: "title" }]` | Centred serif title with a line that draws out under it (video title card) |
| `titles: [{ text, at, style: "name" }]` | Lower-left name card, e.g. "GENGHIS KHAN" |
| `year: [{ at, value }, ...]` | Top-left year plaque. One key = static, several = counts between them. Negative = BC, no year 0 |
| `yearEra` | Override the era text ("AD", "BC") |
| `date: { text, at }` | Top-left plaque with free text |
| captions | Automatic, word by word from the voiceover. Spelling comes from `script.txt` |

## Global overlays (`overlay` in the spec, whole video)

`parchment` (paper texture), `grain` (animated film grain), `dust`, `vignette`, plus a warm colour grade.
Measured render cost: all close to zero. Keep them.

## Transitions

Crossfade between every scene (`meta.transitionFrames`, 8 to 12), fade to black after the voiceover ends. Automatic.

## Maps (`type: "map"`, `map: {...}`)

One projection per video (`map` in the spec: `extent`, `rotate`, `parallels`). Each map scene has:

| Option | What it does |
|---|---|
| `meridian` | Central meridian for this map so north stays up (use the map's centre longitude) |
| `camera: [{ at, center: [lon, lat], zoom }]` | Camera keyframes, eased. Zoom 1.4 = Eurasia, ~5 = one region |
| `states: [{ at, layers, mode, duration, origin }]` | Territory layers over time. `mode: "grow"` reveals radially from `origin`, `"fade"` crossfades. Layers: `{ territory, fill, opacity, outline }` |
| `markers: [{ id, label, lonlat, at, kind, pulse, crossAt, flashAt, battleAt, labelSide }]` | Cities and dots. `crossAt` = cross mark (city falls), `flashAt` = red flash (sacked), `battleAt` = crossed swords |
| `lines: [{ id, path, at, duration, style, smooth, dots }]` | Animated lines. Styles: `arrow` (army move), `route` (dashed journey), `trade` (glowing route), `river`, `divider` (border split). `dots` = caravans moving along it |
| `regionLabels: [{ text, lonlat, at, size, tone, hideAt }]` | Large spaced labels for states and regions |
| `seaLabels: [{ text, lonlat, size }]` | Italic sea names |
| `rivers: true` (or a list of names) | Real rivers (Natural Earth 10m) drawn faintly |
| line `river: "Tigris"` (+ `riverPart: [from, to]`) | A line that follows the real river; `path` can be `[]` |
| line `overWater: true` | Marks a real sea crossing or missile, so the validator does not warn |

Colours: use palette names (`terracotta`, `olive`, `ochre`, `gold`, `deepRed`, `tributary`, `deepBlue`) or hex.
Render cost: maps are the slowest scenes (about 6x slower than image scenes). See CLAUDE.md, "Known improvements".

### Territory library (`engine/maps-data/territories.json`)

Shared by all videos. Built by `npm run maps` from `scripts/fetch-maps.mjs`. Add new territories there, never per video.

Sources, best first:
1. **Cliopatria** (Seshat Global History Databank, CC BY 4.0): borders per year for ~1600 polities, 3400 BC to 2024.
   Add a row `[id, "Polity name", year]` to `CLIO` in fetch-maps.mjs. Credit in the description:
   "Borders: Cliopatria, Seshat Global History Databank (CC BY 4.0)".
2. historical-basemaps (aourednik): coarse snapshots for a few years. Only when Cliopatria lacks the state.
3. Hand-made polygons, with a comment on year and the geography they follow.

The validator warns when an army arrow or route runs over water.

| Territory | Source | Accuracy |
|---|---|---|
| `yuan_1279` | world_1279 | dataset (coarse) |
| `chagatai_1279` | world_1279 | dataset (coarse) |
| `ilkhanate_1279` | world_1279 | dataset (coarse) |
| `golden_1279` | world_1279 | dataset (coarse) |
| `rus_vassals_1279` | world_1279 | dataset (coarse) |
| `mamluk_1279` | world_1279 | dataset (coarse) |
| `yuan_1300` | world_1300 | dataset (coarse) |
| `chagatai_1300` | world_1300 | dataset (coarse) |
| `ilkhanate_1300` | world_1300 | dataset (coarse) |
| `golden_1300` | world_1300 | dataset (coarse) |
| `golden_1492` | world_1492 | dataset (coarse) |
| `ming_1492` | world_1492 | dataset (coarse) |
| `mongol_1200` | world_1200 | dataset (coarse) |
| `xixia_1200` | world_1200 | dataset (coarse) |
| `song_1200` | world_1200 | dataset (coarse) |
| `hungary_1200` | world_1200 | dataset (coarse) |
| `poland_1200` | world_1200 | dataset (coarse) |
| `georgia_1200` | world_1200 | dataset (coarse) |
| `rus_1200` | world_1200 | dataset (coarse) |
| `tribe_naimans` | handmade:tribe_naimans | hand-made estimate |
| `tribe_keraites` | handmade:tribe_keraites | hand-made estimate |
| `tribe_merkits` | handmade:tribe_merkits | hand-made estimate |
| `tribe_mongols` | handmade:tribe_mongols | hand-made estimate |
| `tribe_tatars` | handmade:tribe_tatars | hand-made estimate |
| `jin_1210` | handmade:jin_1210 | hand-made estimate |
| `song_1210` | handmade:song_1210 | hand-made estimate |
| `mongol_1206` | handmade:mongol_1206 | hand-made estimate |
| `mongol_1218` | handmade:mongol_1206 + handmade:kara_khitai_1218 | hand-made estimate |
| `khwarazm_1218` | handmade:khwarazm_1218 | hand-made estimate |
| `abbasid_1258` | handmade:abbasid_1258 | hand-made estimate |
| `elam_bc1000` | world_bc1000 | dataset (coarse) |
| `achaemenid_bc500` | world_bc500 | dataset (coarse) |
| `greek_bc500` | world_bc500 | dataset (coarse) |
| `alexander_bc323` | world_bc323 | dataset (coarse) |
| `seleucid_bc300` | world_bc300 | dataset (coarse) |
| `seleucid_bc200` | world_bc200 | dataset (coarse) |
| `parthia_bc200` | world_bc200 | dataset (coarse) |
| `parthia_bc100` | world_bc100 | dataset (coarse) |
| `roman_bc100` | world_bc100 | dataset (coarse) |
| `parthian_bc1` | world_bc1 | dataset (coarse) |
| `roman_bc1` | world_bc1 | dataset (coarse) |
| `parthian_200` | world_200 | dataset (coarse) |
| `sasanian_500` | world_500 | dataset (coarse) |
| `sasanian_600` | world_600 | dataset (coarse) |
| `byzantine_600` | world_600 | dataset (coarse) |
| `abbasid_800` | world_800 | dataset (coarse) |
| `seljuk_1100` | world_1100 | dataset (coarse) |
| `safavid_1530` | world_1530 | dataset (coarse) |
| `safavid_1650` | world_1650 | dataset (coarse) |
| `ottoman_1650` | world_1650 | dataset (coarse) |
| `persia_1783` | world_1783 | dataset (coarse) |
| `afghanistan_1783` | world_1783 | dataset (coarse) |
| `persia_1815` | world_1815 | dataset (coarse) |
| `russia_1815` | world_1815 | dataset (coarse) |
| `persia_1900` | world_1900 | dataset (coarse) |
| `iran_1938` | world_1938 | dataset (coarse) |
| `iran_2010` | world_2010 | dataset (coarse) |
| `iraq_2010` | world_2010 | dataset (coarse) |
| `israel_2010` | world_2010 | dataset (coarse) |
| `lebanon_2010` | world_2010 | dataset (coarse) |
| `syria_2010` | world_2010 | dataset (coarse) |
| `yemen_2010` | world_2010 | dataset (coarse) |
| `saudi_2010` | world_2010 | dataset (coarse) |
| `gulf_2010` | world_2010 | dataset (coarse) |
| `media_bc585` | handmade:media_bc585 | hand-made estimate |
| `persis_bc559` | handmade:persis_bc559 | hand-made estimate |
| `lydia_bc560` | handmade:lydia_bc560 | hand-made estimate |
| `babylonia_bc550` | handmade:babylonia_bc550 | hand-made estimate |
| `caucasus_lost_1828` | handmade:caucasus_lost_1828 | hand-made estimate |
| `sphere_russia_1907` | handmade:sphere_russia_1907 | hand-made estimate |
| `sphere_britain_1907` | handmade:sphere_britain_1907 | hand-made estimate |
| `clio_elam_-1200` | cliopatria:Elam@-1200 | Cliopatria (per year) |
| `clio_media_-585` | cliopatria:Median Kingdom@-585 | Cliopatria (per year) |
| `clio_lydia_-560` | cliopatria:Lydia@-560 | Cliopatria (per year) |
| `clio_neobabylon_-560` | cliopatria:Neo-Babylonian Empire@-560 | Cliopatria (per year) |
| `clio_achaemenid_-550` | cliopatria:Achaemenid Empire@-550 | Cliopatria (per year) |
| `clio_achaemenid_-539` | cliopatria:Achaemenid Empire@-539 | Cliopatria (per year) |
| `clio_achaemenid_-500` | cliopatria:Achaemenid Empire@-500 | Cliopatria (per year) |
| `clio_macedon_-323` | cliopatria:Macedonian Empire@-323 | Cliopatria (per year) |
| `clio_seleucid_-300` | cliopatria:Seleucid Empire@-300 | Cliopatria (per year) |
| `clio_seleucid_-200` | cliopatria:Seleucid Empire@-200 | Cliopatria (per year) |
| `clio_parthian_-238` | cliopatria:Parthian Empire@-238 | Cliopatria (per year) |
| `clio_parthian_-100` | cliopatria:Parthian Empire@-100 | Cliopatria (per year) |
| `clio_parthian_-53` | cliopatria:Parthian Empire@-53 | Cliopatria (per year) |
| `clio_roman_-53` | cliopatria:Roman Republic@-53 | Cliopatria (per year) |
| `clio_roman_117` | cliopatria:Roman Empire@117 | Cliopatria (per year) |
| `clio_sasanian_260` | cliopatria:Sasanian Empire@260 | Cliopatria (per year) |
| `clio_sasanian_600` | cliopatria:Sasanian Empire@600 | Cliopatria (per year) |
| `clio_sasanian_620` | cliopatria:Sasanian Empire@620 | Cliopatria (per year) |
| `clio_byzantine_600` | cliopatria:Eastern Roman Empire@600 | Cliopatria (per year) |
| `clio_rashidun_655` | cliopatria:Rashidun Caliphate@655 | Cliopatria (per year) |
| `clio_abbasid_800` | cliopatria:Abbasid Caliphate@800 | Cliopatria (per year) |
| `clio_seljuk_1090` | cliopatria:Great Seljuk Empire@1090 | Cliopatria (per year) |
| `clio_ilkhanate_1300` | cliopatria:Ilkhanate@1300 | Cliopatria (per year) |
| `clio_timurid_1400` | cliopatria:Timurid Empire@1400 | Cliopatria (per year) |
| `clio_safavid_1510` | cliopatria:Safavid Dynasty@1510 | Cliopatria (per year) |
| `clio_safavid_1630` | cliopatria:Safavid Dynasty@1630 | Cliopatria (per year) |
| `clio_ottoman_1630` | cliopatria:Ottoman Empire@1630 | Cliopatria (per year) |
| `clio_afsharid_1740` | cliopatria:Afsharid Iran@1740 | Cliopatria (per year) |
| `clio_qajar_1800` | cliopatria:Qajar Dynasty@1800 | Cliopatria (per year) |
| `clio_qajar_1830` | cliopatria:Qajar Dynasty@1830 | Cliopatria (per year) |
| `clio_pahlavi_1941` | cliopatria:Pahlavi Dynasty@1941 | Cliopatria (per year) |
| `clio_iran_2020` | cliopatria:Islamic Republic of Iran@2020 | Cliopatria (per year) |

## CTA subscribe overlay

| Option | What it does |
|---|---|
| `cta: { at: "@subscribe", duration: 5.5, position: "bottom-left" }` (any scene) | Animated subscribe card: channel logo, name and tagline, a red Subscribe button that a cursor clicks (turns into Subscribed with a check), then the bell gets clicked and rings. Slides in and out. Drawn on top of the whole video (not cut by scene changes), above the captions. `position`: bottom-left (default), bottom-right, top-left, top-right. Branding comes from `engine/brand.ts` (`branding/profile.png`). Cost: negligible (no blur) |

Check how it looks over any scene: `npm run cta-preview <slug> [S10] [--position=bottom-right]` writes `checks/cta-preview.mp4` and stills (about 200 frames, fine on the laptop).
