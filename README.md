# history-engine

Remotion engine for 2D history videos with map animations. Current video: **The Mongol Empire in 5 Minutes**.

## Render in the cloud (GitHub Actions)

Actions tab > **Render video** > Run workflow.
- `chunks`: number of parallel machines (max 20)
- `scale`: 1 = final 1920x1080, 0.5 = fast draft
- `off`: effects to switch off, e.g. `grain,blur`

When it finishes, download the **video** artifact from the run page.

## Benchmark

Actions tab > **Render benchmark** > Run workflow. Renders three test clips once per effect setting
on the same machine and shows a table of what each effect costs in the run summary.

## Local

```bash
npm ci
npx remotion studio      # preview
npx remotion render      # full render to out/video.mp4
```
