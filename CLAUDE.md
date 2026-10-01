# history-engine: rules for Claude

Remotion engine for 2D history videos with map animations. One shared engine, one folder per video.

## Layout

```
engine/            shared code: components, effects, maps, fonts. Used by every video.
engine/maps-data/  shared map library: land + historical territories (all videos)
videos/<slug>/     one video: DRAAIBOEK.md, script.txt, scene-spec.mjs, data/, public/images, public/audio
videos/_template/  copied by `npm run new <slug>`
scripts/           pipeline scripts (all take the video via VIDEO, set by `npm run <task> <slug>`)
CATALOG.md         everything the engine can already do. READ IT FIRST.
```

## Golden rule: reuse first

1. Read `CATALOG.md` before writing any code.
2. If the catalog covers what the runbook asks, only write `videos/<slug>/scene-spec.mjs`. Do not touch `engine/`.
3. If something truly does not fit, build it in `engine/` as a generic, configurable component (no topic-specific
   names or hard-coded content), expose it through scene-spec options, and add it to `CATALOG.md` in the same commit.
4. Changing an existing engine component must not change how existing videos look. If a change would,
   add an option with the old behaviour as default. Check with `npm run stills mongol-empire` against the previous output.
5. New territories go in `scripts/fetch-maps.mjs` (shared library), then `npm run maps`. Never per video.
   Every hand-made polygon gets a comment with its year and the geography it follows (river, mountain range, coast).

## Making a new video

1. `npm run new <slug>`
2. Fill `DRAAIBOEK.md` (runbook), `script.txt` (one paragraph per scene, correct spelling), `IMAGE_PROMPTS.md`.
3. Images in `videos/<slug>/public/images/NNN.jpg` (cutouts `NNN.png`, RGBA), voiceover in `public/audio/voiceover.mp3`.
   Check every image by eye against its prompt number; Flow downloads are sometimes numbered wrongly.
4. Write `videos/<slug>/scene-spec.mjs` from the runbook, using only catalog options where possible.
5. `npm run prepare-video <slug>`: transcribe, align timings, build scenes.json, validate. Fix until it passes.
6. `npm run stills <slug>`: one still per scene (half size, one bundle). Look at them, fix what is off.
7. `npm run draft <slug>` (half resolution) for review, `npm run render <slug>` for the final.
   Output goes to `out/` and is never committed.

## Commands

| Command | What it does |
|---|---|
| `npm run new <slug>` | New video folder from the template |
| `npm run studio <slug>` | Preview in the browser |
| `npm run prepare-video <slug>` | transcribe + align + build + validate |
| `npm run stills <slug> [S04@0.5 ...]` | Check stills into `videos/<slug>/checks/` (not committed) |
| `npm run draft <slug>` | Half-resolution render (about 4x faster) |
| `npm run render <slug>` | Final render to `out/<slug>.mp4` |
| `npm run bench <slug> [--variants=baseline]` | Render-cost benchmark per effect |
| `npm run maps` | Rebuild the shared territory library |
| `npm run typecheck` | TypeScript check |

## What is not committed

`out/` (rendered videos), `**/checks/`, `node_modules/`, `whisper.cpp/` (installed on first transcribe), `engine/maps-data/raw/`.

## Known costs and planned improvements

Measured with the benchmark on the Mongol video (2-core machine):
- Overlays (parchment, grain, dust, grade): ~0% cost. Keep them live.
- `smoke` effect: CSS `blur(30px)` makes a smoke scene ~3x slower. Planned: soft gradients without CSS blur.
- Maps: ~1 fps vs ~6 fps for image scenes. The coastline (28k points) is drawn several times per frame with
  `vector-effect: non-scaling-stroke` and live clip paths. Planned, with no visible change:
  only draw what is inside the camera view, scale stroke widths manually instead of non-scaling-stroke.
- Map accuracy: many territories are coarse dataset polygons or hand-made estimates (see CATALOG.md).
  Planned: borders per year, following real rivers and mountain ranges, with a source per territory.
- GitHub Actions rendering is not faster than a local Mac on the free plan (2-core runners, ~5 parallel jobs).
