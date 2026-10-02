# CATALOG: what the engine already has

Read this before building anything. If something here does the job, use it through `scene-spec.mjs`.
Only write new code when nothing here fits, and then add it to `engine/` and to this catalog.

Full working example of every option: `videos/mongol-empire/scene-spec.mjs`.

## Scene types

| Type | What it shows | Key options |
|---|---|---|
| `image` | A still image with a camera move (Ken Burns) | `image`, `kenBurns` |
| `parallax` | Background image + transparent cutout(s) moving across it | `background` (image + Ken Burns), `sprites` |
| `map` | Animated historical map | `map` (see Maps) |
| `gfx` | Coded motion graphic. Available: `decimal-army` (10 / 100 / 1,000 / 10,000 grid) | `gfx`, `steps` |

### Ken Burns (`kenBurns`, also used by `parallax.background`)
- `from` / `to`: `{ scale, x, y }`. `scale` 1 = fit, `x`/`y` 0..1 = point of the image in the centre.
- `matte: { y, color, colorBottom? }`: paints ground colour below row `y` for images whose art stops short (see 002 in the Mongol video).
- `desaturate: [from, to]`: fade colour out over the scene (0..1).
- Helper in the spec: `kb([scale, x, y], [scale, x, y], extra)`.

### Sprites (`parallax.sprites[]`, cutouts must be RGBA PNG)
`src`, `start`, `end`, `height` (px), `bottom` (px from bottom), `from` / `to` (left edge, % of width), `bob` (px bounce per stride), `strideHz`.
Has a soft drop shadow.

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

Colours: use palette names (`terracotta`, `olive`, `ochre`, `gold`, `deepRed`, `tributary`, `deepBlue`) or hex.
Render cost: maps are the slowest scenes (about 6x slower than image scenes). See CLAUDE.md, "Known improvements".

### Territory library (`engine/maps-data/territories.json`)

Shared by all videos. Built by `npm run maps` from `scripts/fetch-maps.mjs`
(historical-basemaps by aourednik + hand-made polygons). Add new territories there, never per video.

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

## CTA subscribe overlay

| Option | What it does |
|---|---|
| `cta: { at: "@subscribe", duration: 5.5, position: "bottom-left" }` (any scene) | Animated subscribe card: channel logo, name and tagline, a red Subscribe button that a cursor clicks (turns into Subscribed with a check), then the bell gets clicked and rings. Slides in and out. Drawn on top of the whole video (not cut by scene changes), above the captions. `position`: bottom-left (default), bottom-right, top-left, top-right. Branding comes from `engine/brand.ts` (`branding/profile.png`). Cost: negligible (no blur) |

Check how it looks over any scene: `npm run cta-preview <slug> [S10] [--position=bottom-right]` writes `checks/cta-preview.mp4` and stills (about 200 frames, fine on the laptop).

## Planned, not built yet

Build these once, generically, then move them up into the catalog.

| Option | What it will do |
|---|---|
| `shots: [{ at: "@word", from, to }]` (image scenes) | Several camera moves on one image with a hard cut or a quick push between them, so a long paragraph on one image still changes picture every few seconds |
