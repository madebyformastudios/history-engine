#!/bin/sh
# One still per scene (middle frame) with `npx remotion still` → checks/Sxx.png
# Usage: sh scripts/render-stills.sh
set -e
mkdir -p checks
node -e 'const d=require("./src/data/scenes.json");for(const s of d.scenes)console.log(s.id, Math.floor((s.startFrame+s.endFrame)/2))' |
while read id frame; do
  npx remotion still src/index.ts MongolEmpire "checks/$id.png" --frame="$frame" --overwrite --log=error
  echo "checks/$id.png (frame $frame)"
done
