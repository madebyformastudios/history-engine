# history-engine

Remotion engine for 2D history videos with map animations. One shared engine, one folder per video.

- `engine/`: shared components, effects, maps and fonts
- `videos/<slug>/`: everything for one video (runbook, script, scene spec, images, voiceover)
- `CATALOG.md`: what the engine can already do
- `CLAUDE.md`: working rules and commands
- `STYLE.md`: how the videos look and move

## Quick start

```bash
npm ci
npm run studio mongol-empire     # preview
npm run draft mongol-empire      # fast half-resolution render
npm run render mongol-empire     # final render to out/mongol-empire.mp4
npm run new viking-age           # start a new video
npm run demo mongol-empire       # every engine feature on this video's images
```

## Cloud render (GitHub Actions)

Actions tab > **Render video** > Run workflow, fill in the video folder name. Download the MP4 from the run's artifacts.
The repo is public, so this is free: 20 machines with 4 cores render in parallel (a 16-minute video in about 20 minutes).

## Videos

| Folder | Title |
|---|---|
| `mongol-empire` | The Mongol Empire in 5 Minutes |
| `egypt` | The ENTIRE History of Egypt in 14 Minutes (in production) |
| `iran` | The ENTIRE History of Iran in 16 Minutes (images, photos and voiceover in) |
