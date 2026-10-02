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

## Standing requirements for every video

These apply to every new video unless Jairo says otherwise.

1. **Grammar and spelling.** Before a script goes to ElevenLabs, check `script.txt` and `script_elevenlabs.txt`
   sentence by sentence for grammar, spelling, punctuation and missing words (a careful proofread, plus a
   grammar tool if available). Fix every issue in both files and list what was changed. No em or en dashes.
2. **Pacing: the picture changes at least every 6 to 8 seconds.** No shot may stay on screen longer than
   8 seconds. A long VO paragraph becomes several shots: a second image, a map beat, or a new camera move on a
   different part of the same image (a cut, not one slow zoom). Maps keep moving: camera moves, labels, arrows
   and territory changes land on cue words. Plan this in DRAAIBOEK.md (one row per shot) and count the images
   needed from it. Target for a 15-minute video: about 110 to 150 shots.
3. **Call to action.** Every video has one short spoken CTA (about 5 seconds), written into the script at a natural
   break right after the first big payoff, usually the end of the first chapter (roughly 2 to 4 minutes in), never
   in the first minute. Example: "If you like seeing history move on the map, subscribe, it helps the channel more
   than you think." While the CTA is spoken, the subscribe overlay plays (CATALOG.md, `cta`). A second short CTA
   can go in the last 20 seconds, over the end screen. Check the retention graph after each upload for a dip at
   the CTA and move it if needed.
4. **Rendering happens on GitHub, not on the laptop.** The MacBook Air gets too hot. Locally only
   `npm run stills` and short `npm run draft -- --frames=a-b` checks. Full drafts and the final render go through
   the GitHub Actions workflow "Render video" (push first, then run it with the video folder name); the MP4 is
   downloaded from the run's artifacts.
5. **Real photos, here and there.** Where real photos exist of the subject (artifacts, ruins, buildings,
   manuscripts, archive photos of people and events), use some of them between the illustrations, at moments
   where "this really exists" adds weight. Rules:
   - Only images that are free to use: public domain or a free licence (CC0, CC BY, CC BY-SA), mostly from
     Wikimedia Commons, museum open-access collections (Met, British Museum, Rijksmuseum, Library of Congress)
     or government archives. Never press-agency or stock photos, screenshots from other videos, or anything
     without a clear licence: that risks copyright claims and strikes.
   - Download the largest version (if the cloud workspace cannot reach the site, download it on Jairo's
     laptop through the linked computer, or give him the list of links), save as `public/images/photo-NN.jpg`, and record every photo in
     `videos/<slug>/PHOTOS.md` (file, what it shows, source URL, author, licence). CC BY and CC BY-SA photos get
     a credit line in the YouTube description (the upload checklist pulls them from PHOTOS.md).
   - Show them with the same Ken Burns moves and overlays as the illustrations so they sit in the parchment style.
     Use them as accents (roughly 1 in 8 to 10 shots), not instead of the illustrations.
   - Check each photo by eye: it must really show what the narration says (right building, right person, right
     period). If unsure, leave it out.
6. **Real over comfortable.** Tell what happened, also when it makes a country, government, religion or
   group look bad (any side, including Western powers, Israel, Iran or the narrator's "heroes"). No softening,
   leaving out or vague wording to protect advertisers or avoid comments. Neutral means: no opinions or
   loaded adjectives from the narrator, and every claim backed by solid sources. Where historians or sources
   really disagree (death tolls, who started what), say so and give the range. Death tolls, coups, massacres,
   assassinations and wars are named plainly.

## Making a new video

1. `npm run new <slug>`
2. Fill `DRAAIBOEK.md` (runbook), `script.txt` (one paragraph per scene, correct spelling), `IMAGE_PROMPTS.md`.
3. Images in `videos/<slug>/public/images/NNN.jpg` (cutouts `NNN.png`, RGBA), voiceover in `public/audio/voiceover.mp3`.
   Check every image by eye against its prompt number; Flow downloads are sometimes numbered wrongly.
4. Write `videos/<slug>/scene-spec.mjs` from the runbook, using only catalog options where possible.
5. `npm run prepare-video <slug>`: transcribe, align timings, build scenes.json, validate. Fix until it passes.
6. `npm run stills <slug>`: one still per scene (half size, one bundle). Look at them, fix what is off.
7. Push, then render on GitHub Actions ("Render video", `scale` 0.5 for a review draft, 1 for the final).
   Do not run full renders on the laptop. Rendered videos are never committed.

## Commands

| Command | What it does |
|---|---|
| `npm run new <slug>` | New video folder from the template |
| `npm run studio <slug>` | Preview in the browser |
| `npm run prepare-video <slug>` | transcribe + align + build + validate (`WHISPER_MODEL=base.en` for a fast transcription) |
| `npm run stills <slug> [S04@0.5 ...]` | Check stills into `videos/<slug>/checks/` (not committed) |
| `npm run draft <slug> -- --frames=a-b` | Short half-resolution check of a few scenes (full renders: GitHub Actions) |
| `npm run render <slug>` | Local full render. Avoid: the laptop overheats. Use GitHub Actions |
| `npm run cta-preview <slug> [S10]` | Short MP4 + stills of the CTA overlay over one scene |
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
- GitHub Actions: the repo is public, so rendering is free on 4-core Linux runners, 20 chunks in parallel.
  The 16-minute Iran video (207 shots, 29 maps) rendered in 19 minutes, far faster than the Mac. It is the
  standard way to render. A macOS runner can be picked (`runner` input) but only 5 run at once, so Linux is faster.
- The standing-requirement features are built: `cta` (subscribe overlay) and `shots` (multi-shot scenes), see CATALOG.md.
