# history-engine

Remotion engine for 2D history videos with map animations. One shared engine, one folder per video.

- `engine/`: shared components, effects, maps and fonts
- `videos/<slug>/`: everything for one video (runbook, script, scene spec, images, voiceover)
- `CATALOG.md`: what the engine can already do
- `CLAUDE.md`: working rules and commands

## Quick start

```bash
npm ci
npm run studio mongol-empire     # preview
npm run draft mongol-empire      # fast half-resolution render
npm run render mongol-empire     # final render to out/mongol-empire.mp4
npm run new viking-age           # start a new video
```

## Cloud render (GitHub Actions)

Actions tab > **Render video** > Run workflow, fill in the video folder name. Download the MP4 from the run's artifacts.
On the free plan this is about as fast as a local Mac, but it keeps your computer free.

## Videos

| Folder | Title |
|---|---|
| `mongol-empire` | The Mongol Empire in 5 Minutes |
| `egypt` | The ENTIRE History of Egypt (about 15 min, in production) |
