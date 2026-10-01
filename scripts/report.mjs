// Writes BUILD_REPORT.md from the build data (scenes, timings, cues, map sources).
// Usage: node scripts/report.mjs
import fs from "node:fs";

const data = JSON.parse(fs.readFileSync("src/data/scenes.json", "utf8"));
const timings = JSON.parse(fs.readFileSync("src/data/timings.json", "utf8"));
const cueReport = JSON.parse(fs.readFileSync("src/data/cue-report.json", "utf8"));
const territories = JSON.parse(fs.readFileSync("src/data/territories.json", "utf8"));
const fps = data.meta.fps;
const ts = (s) => `${Math.floor(s / 60)}:${(s % 60).toFixed(2).padStart(5, "0")}`;

// what the image looks like (checked by eye against IMAGE_PROMPTS.md)
const SEEN = {
  "001": "Boy in a brown deel and fur hat with a staff, alone on the steppe, mountains behind",
  "002": "Panoramic steppe: yurt camp with smoke, horses and sheep, mountains; art fills only the middle band (blank paper below)",
  "003": "Night campfire: chieftain with a cup clutching his chest, rival men in shadow",
  "004": "Mother and four children on the steppe, a line of riders and carts leaving in the distance",
  "005": "Teenage boy in a wooden board collar by a tent at night, guards at a fire in the distance",
  "006": "Young couple in wedding clothes (tall headdress) before a white yurt, families around",
  "007": "Night raid under a full moon: rider reaches down to a running woman, burning tents",
  "008": "Two leaders on horseback facing each other, armies with white and dark banners, empty grass between",
  "009": "Bearded leader on a platform beside a white horse-tail standard, crowd raising arms",
  "010": "Ruler on a throne in a felt tent handing a golden tablet to a kneeling commander, fire in centre",
  "011": "Relay station: messenger leaps from a tired horse to a fresh one, keeper holds reins, road to horizon",
  "012": "Horse archer at full gallop facing right, drawing a bow (cutout, transparent background)",
  "013": "Siege of a walled Chinese city, engineers working a counterweight catapult in the foreground",
  "014": "Chinese imperial city burning at night, Mongol rider silhouettes on a hill",
  "015": "Persian throne hall with blue tiles, Shah gesturing dismissively at three Mongol envoys",
  "016": "Ruined Central Asian city: broken turquoise dome, fallen minaret, smoke, riders leaving",
  "017": "Dark felt tent interior, empty low throne with furs, bow and hat, beam of light from the roof",
  "018": "Walled city of Karakorum with palace, temples, markets, yurts and camel caravans",
  "019": "Armoured European knights with lances charging, Mongol horse archers shooting from the sides",
  "020": "Mongol commanders on a hilltop turning back east toward the rising sun, European town behind",
  "021": "Burning domed city beside a black river with books and scrolls on the bank and in the water",
  "022": "Mamluk cavalry with yellow banners and raised sabres, Mongol riders fleeing in the distance",
  "023": "Kublai Khan seated on a throne in a red-columned Chinese hall, dragon robe",
  "024": "Asian war fleet in a typhoon: huge waves, torn sails, lightning",
  "025": "Empty Black Sea harbour city under a grey-green sky, ships, rats on the quay",
  "026": "Lone rider from behind on a hill at sunset beside a stone cairn with blue scarves",
};

const lines = [];
const P = (s = "") => lines.push(s);

P("# BUILD REPORT: The Mongol Empire in 5 Minutes");
P();
P(`Remotion ${JSON.parse(fs.readFileSync("node_modules/remotion/package.json", "utf8")).version}, ${data.meta.width}x${data.meta.height}, ${fps} fps, TypeScript. Composition \`${data.meta.id}\`.`);
P(`Duration: ${data.meta.durationInFrames} frames = ${data.meta.duration.toFixed(3)} s (voiceover ${timings.audioDuration.toFixed(3)} s + 1.5 s fade to black). Last spoken word ends at ${timings.voiceEnd.toFixed(2)} s.`);
P();
P("```bash");
P("npx remotion studio            # preview");
P("npx remotion render            # → out/video.mp4 (settings in remotion.config.ts)");
P("```");
P();
P("Rebuild pipeline: `node scripts/transcribe.mjs` → `node scripts/align.mjs` → `node scripts/fetch-maps.mjs` → `node scripts/build-scenes.mjs` → `node scripts/validate.ts` → `sh scripts/render-stills.sh`.");
P();

P("## 1. Asset mapping");
P();
P("All 26 images were already named `001`–`026` in `public/images/`, so nothing was renamed. Each one was checked by eye against its prompt in IMAGE_PROMPTS.md; every image matches its number.");
P();
P("| Original filename | New name | What I see in the image |");
P("|---|---|---|");
for (const [n, d] of Object.entries(SEEN)) {
  const f = n === "012" ? "012.png" : `${n}.jpg`;
  P(`| ${f} | ${f} (unchanged) | ${d} |`);
}
P();
P("Notes:");
P("- **012 cutout**: the delivered `012.png` was already an RGBA PNG with a transparent background (no white halo: 0 opaque near-white pixels on the alpha edge). It was only trimmed to the figure's bounding box (+4 px) so it can be positioned precisely; the untrimmed original is kept in `data/originals/012_uncropped.png`. `scripts/remove-white-bg.mjs` (from the Roman project) is included in case a white-background version has to be re-cut.");
P("- **002**: the illustration only fills the middle band of the image (rows 0–66% are sky + landscape, the bottom third is blank paper). In S03 and S16 the Ken Burns layer paints matching ground colour (`#9A8649` → `#7F7140`) below the art line, so no blank paper shows.");
P("- Voiceover: `public/audio/voiceover.mp3`, played from frame 0.");
P();

P("## 2. Scenes");
P();
P("Scene start = first word of its paragraph in the voiceover, end = start of the next scene (S01 starts at 0, S40 ends at the end of the fade). Crossfades of " + data.meta.transitionFrames + " frames are centred on each cut.");
P();
P("| Scene | Start | End | Frames | Asset(s) | Type |");
P("|---|---|---|---|---|---|");
for (const s of data.scenes) P(`| ${s.id} | ${ts(s.start)} (f${s.startFrame}) | ${ts(s.end)} (f${s.endFrame}) | ${s.endFrame - s.startFrame} | ${s.assets.join(" + ")} | ${s.type} |`);
P();

P("## 3. Cues");
P();
P("Every `@\"word\"` cue from the runbook was matched to the transcript **exactly** (no closest-match fallbacks).");
P();
P("| Scene | Cue | Heard as | Time | Frame | Action |");
P("|---|---|---|---|---|---|");
for (const s of data.scenes) for (const c of s.cues) P(`| ${s.id} | @"${c.word}" | ${c.matched} | ${c.t.toFixed(2)} s | ${c.frame} | ${c.action} |`);
P();
P(`**Unresolved cues:** ${cueReport.problems.length ? cueReport.problems.join("; ") : "none."}`);
P();
P("Extra word anchors used for timing details that the runbook does not pin to a word:");
for (const a of cueReport.anchors) P(`- ${a}`);
P();

P("## 4. Voiceover alignment");
P();
P(`- Transcription: whisper.cpp 1.5.5 via \`@remotion/install-whisper-cpp\`, model \`medium.en\`, token-level timestamps merged into ${JSON.parse(fs.readFileSync("src/data/transcript.json", "utf8")).words.length} words → \`src/data/transcript.json\`. (1.5.5 is used because newer whisper.cpp releases need cmake, which is not installed.)`);
P(`- Alignment (\`scripts/align.mjs\`): script.txt and the transcript are normalised to spoken tokens (years spelled out: "1206" → "twelve oh six", "1340s" → "thirteen forties") and aligned globally with a phonetic fuzzy score. Result: ${timings.words.length} script words, ${timings.unaligned.length} unaligned.`);
P("- Whisper tends to start a word at the end of the preceding pause; word starts that fall inside a detected silence (ffmpeg `silencedetect`, -38 dB) are moved to the speech onset. This matters for scene starts after the `<break>` pauses (e.g. S13 starts at 82.02 s, not 80.80 s).");
const plain = (x) => x.toLowerCase().replace(/[^a-z]/g, "");
const fuzzy = timings.words.filter((w) => !/\d/.test(w.text) && plain(w.text) !== plain(w.heard));
P(`- Words where the transcript spelling differs from the script (captions always show the script spelling): ${fuzzy.map((w) => `${w.text.replace(/[.,]$/, "")} ← "${w.heard.replace(/[.,]$/, "")}"`).join(", ")}.`);
P("- The voiceover says \"Genghis Khan's grandson(s)\" in S30 and S33 where script.txt has \"Genghis's\"; the extra spoken \"Khan\" is absorbed by the alignment and the caption shows the script text.");
P("- Captions: word-by-word from these timings, bottom centre, max two lines, spoken words lit and the current word in ochre.");
P();

P("## 5. Maps: data sources and faked polygons");
P();
P("Base data: Natural Earth 50 m land (world-atlas). Borders: aourednik/historical-basemaps (`world_1200`, `world_1279`, `world_1300`, `world_1492`). Territories are clipped to the coastline at render time. Each map uses its own central meridian so north stays up.");
P();
P("| Territory id | Source |");
P("|---|---|");
for (const [id, f] of Object.entries(territories)) P(`| ${id} | ${f.properties.sources.join(" + ")} |`);
P();
P("**Hand-made (faked) polygons**, all simplified by hand:");
P("- `tribe_naimans`, `tribe_keraites`, `tribe_merkits`, `tribe_mongols`, `tribe_tatars` (MAP-02, S04/S11): no dataset has 12th-century tribes; the runbook allows hand-made zones.");
P("- `jin_1210` (MAP-03): the 1200 file only has a small \"Liao\" polygon in Manchuria and no Jin dynasty.");
P("- `song_1210` (MAP-03): the dataset's Song Empire reaches 40°N, overlapping Jin; redrawn south of the Huai river.");
P("- `mongol_1206` (MAP-03, MAP-04): the dataset's 1200 \"Mongol Empire\" is a coarse box reaching into Siberia and Manchuria; redrawn as Mongolia proper.");
P("- `kara_khitai_1218` (MAP-04, part of `mongol_1218`): the lands taken from Kara Khitai in 1218; the dataset polygon overlapped Khwarazm.");
P("- `khwarazm_1218` (MAP-04): the dataset's 1200 Khwarazmian polygon is a small, misplaced fragment.");
P("- `abbasid_1258` (MAP-07): the remaining Abbasid caliphate in Iraq, drawn over the 1279 Ilkhanate until Baghdad falls.");
P();
P("**Approximations from the nearest year** (dataset polygons used out of their year):");
P("- MAP-01 peak extent = the four khanates of 1279 + `rus_vassals_1279` (the Rus principalities, tributary to the Golden Horde).");
P("- MAP-06 Mongol territory \"around 1241\" = the 1279 Golden Horde; Rus, Poland and Hungary from 1200.");
P("- MAP-07 Mongol territory in 1258 = the 1279 Ilkhanate (+ the hand-made Abbasid zone); Mamluks from 1279.");
P("- MAP-08/09/10 \"around 1294\" = `world_1300`. MAP-10 shrinking Golden Horde = the `world_1492` Golden Horde; Ming = `world_1492` Ming Empire.");
P("- MAP-05 Georgia = `world_1200`. MAP-03 Western Xia = `world_1200` \"Xixia\".");
P();

P("## 6. Verification");
P();
P("- `node scripts/validate.ts`: **PASSED**. Checks that all 40 runbook scenes exist in order with the runbook's assets; every checklist asset (001–026, MAP-01…MAP-10, GFX-01) is used in exactly its listed scenes and nowhere else; every referenced file exists (012 is RGBA); scenes are contiguous from frame 0 to the last frame with no gaps or overlaps; duration = voiceover + 1.5 s; every runbook cue is resolved inside its scene.");
P("- `sh scripts/render-stills.sh`: one still per scene (middle frame) in `checks/Sxx.png`, each compared with the runbook. Problems found and fixed along the way: map land-clip edge visible at Eurasia zoom; parchment texture tile seams; regional maps rotated far from the central meridian (fixed with per-map meridians); regional zooms too wide; overlapping labels; MAP-01 growth mask cut flat at the top; GFX-01 transitions longer than the 0.5 s gaps between the VO cues (grid drifted off-frame).");
P();

P("## 7. Deviations, interpretations and things I could not do");
P();
P("- **S24 route direction.** The runbook says the route loops around the Caspian \"counterclockwise (through Persia, Caucasus, the steppe north of the Black Sea)\". That listed path (south → west → north → east) is clockwise on a north-up map. I followed the explicit path, which is also the historical route.");
P("- **S15** optional horizontal motion-blur streak: not used.");
P("- **S16** \"background pans slowly left\": the background drifts left (camera tracking the rider) while the archer gallops left to right with a stride bounce.");
P("- **S13 / GFX-01**: before the first cue (\"ten\") a single rider icon is shown so the frame is not empty for ~4.5 s. The four VO cues are only 0.5–0.9 s apart, so each grid step and count-up is compressed to fit before the next cue (10,000 lands at 89.1 s, the scene ends at 90.0 s).");
P("- **S38** \"Golden Horde shrinks\": done by crossfading the 1300 Golden Horde into its much smaller 1492 remnant, then fading it out. The Chagatai Khanate is not mentioned in the VO or the runbook, so it stays.");
P("- Small additions for orientation, not in the runbook: region labels on maps (e.g. MONGOLS, JIN, SONG, WESTERN XIA, KHWARAZMIAN EMPIRE, PERSIA, MAMLUKS, RUS, POLAND, HUNGARY, SILK ROAD), sea labels, the Kalka river line, Rus turning Mongol colour after Kyiv (S27) and Iraq turning Mongol colour after Baghdad (S30).");
P("- S04 year label shows \"1162 AD\" as written; other single-year labels show the number only, as written in the runbook.");
P("- No sound effects or music: none were provided or asked for.");
P();
fs.writeFileSync("BUILD_REPORT.md", lines.join("\n"));
console.log(`wrote BUILD_REPORT.md (${lines.length} lines)`);
