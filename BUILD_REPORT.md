# BUILD REPORT: The Mongol Empire in 5 Minutes

Remotion 4.0.532, 1920x1080, 30 fps, TypeScript. Composition `MongolEmpire`.
Duration: 9863 frames = 328.771 s (voiceover 327.271 s + 1.5 s fade to black). Last spoken word ends at 326.80 s.

```bash
npx remotion studio            # preview
npx remotion render            # → out/video.mp4 (settings in remotion.config.ts)
```

Rebuild pipeline: `node scripts/transcribe.mjs` → `node scripts/align.mjs` → `node scripts/fetch-maps.mjs` → `node scripts/build-scenes.mjs` → `node scripts/validate.ts` → `sh scripts/render-stills.sh`.

## 1. Asset mapping

All 26 images were already named `001`–`026` in `public/images/`, so nothing was renamed. Each one was checked by eye against its prompt in IMAGE_PROMPTS.md; every image matches its number.

| Original filename | New name | What I see in the image |
|---|---|---|
| 001.jpg | 001.jpg (unchanged) | Boy in a brown deel and fur hat with a staff, alone on the steppe, mountains behind |
| 002.jpg | 002.jpg (unchanged) | Panoramic steppe: yurt camp with smoke, horses and sheep, mountains; art fills only the middle band (blank paper below) |
| 003.jpg | 003.jpg (unchanged) | Night campfire: chieftain with a cup clutching his chest, rival men in shadow |
| 004.jpg | 004.jpg (unchanged) | Mother and four children on the steppe, a line of riders and carts leaving in the distance |
| 005.jpg | 005.jpg (unchanged) | Teenage boy in a wooden board collar by a tent at night, guards at a fire in the distance |
| 006.jpg | 006.jpg (unchanged) | Young couple in wedding clothes (tall headdress) before a white yurt, families around |
| 007.jpg | 007.jpg (unchanged) | Night raid under a full moon: rider reaches down to a running woman, burning tents |
| 008.jpg | 008.jpg (unchanged) | Two leaders on horseback facing each other, armies with white and dark banners, empty grass between |
| 009.jpg | 009.jpg (unchanged) | Bearded leader on a platform beside a white horse-tail standard, crowd raising arms |
| 010.jpg | 010.jpg (unchanged) | Ruler on a throne in a felt tent handing a golden tablet to a kneeling commander, fire in centre |
| 011.jpg | 011.jpg (unchanged) | Relay station: messenger leaps from a tired horse to a fresh one, keeper holds reins, road to horizon |
| 012.png | 012.png (unchanged) | Horse archer at full gallop facing right, drawing a bow (cutout, transparent background) |
| 013.jpg | 013.jpg (unchanged) | Siege of a walled Chinese city, engineers working a counterweight catapult in the foreground |
| 014.jpg | 014.jpg (unchanged) | Chinese imperial city burning at night, Mongol rider silhouettes on a hill |
| 015.jpg | 015.jpg (unchanged) | Persian throne hall with blue tiles, Shah gesturing dismissively at three Mongol envoys |
| 016.jpg | 016.jpg (unchanged) | Ruined Central Asian city: broken turquoise dome, fallen minaret, smoke, riders leaving |
| 017.jpg | 017.jpg (unchanged) | Dark felt tent interior, empty low throne with furs, bow and hat, beam of light from the roof |
| 018.jpg | 018.jpg (unchanged) | Walled city of Karakorum with palace, temples, markets, yurts and camel caravans |
| 019.jpg | 019.jpg (unchanged) | Armoured European knights with lances charging, Mongol horse archers shooting from the sides |
| 020.jpg | 020.jpg (unchanged) | Mongol commanders on a hilltop turning back east toward the rising sun, European town behind |
| 021.jpg | 021.jpg (unchanged) | Burning domed city beside a black river with books and scrolls on the bank and in the water |
| 022.jpg | 022.jpg (unchanged) | Mamluk cavalry with yellow banners and raised sabres, Mongol riders fleeing in the distance |
| 023.jpg | 023.jpg (unchanged) | Kublai Khan seated on a throne in a red-columned Chinese hall, dragon robe |
| 024.jpg | 024.jpg (unchanged) | Asian war fleet in a typhoon: huge waves, torn sails, lightning |
| 025.jpg | 025.jpg (unchanged) | Empty Black Sea harbour city under a grey-green sky, ships, rats on the quay |
| 026.jpg | 026.jpg (unchanged) | Lone rider from behind on a hill at sunset beside a stone cairn with blue scarves |

Notes:
- **012 cutout**: the delivered `012.png` was already an RGBA PNG with a transparent background (no white halo: 0 opaque near-white pixels on the alpha edge). It was only trimmed to the figure's bounding box (+4 px) so it can be positioned precisely; the untrimmed original is kept in `data/originals/012_uncropped.png`. `scripts/remove-white-bg.mjs` (from the Roman project) is included in case a white-background version has to be re-cut.
- **002**: the illustration only fills the middle band of the image (rows 0–66% are sky + landscape, the bottom third is blank paper). In S03 and S16 the Ken Burns layer paints matching ground colour (`#9A8649` → `#7F7140`) below the art line, so no blank paper shows.
- Voiceover: `public/audio/voiceover.mp3`, played from frame 0.

## 2. Scenes

Scene start = first word of its paragraph in the voiceover, end = start of the next scene (S01 starts at 0, S40 ends at the end of the fade). Crossfades of 10 frames are centred on each cut.

| Scene | Start | End | Frames | Asset(s) | Type |
|---|---|---|---|---|---|
| S01 | 0:00.00 (f0) | 0:10.21 (f306) | 306 | MAP-01 | map |
| S02 | 0:10.21 (f306) | 0:13.72 (f412) | 106 | IMG 001 | image |
| S03 | 0:13.72 (f412) | 0:17.08 (f512) | 100 | IMG 002 | image |
| S04 | 0:17.08 (f512) | 0:28.01 (f840) | 328 | MAP-02 | map |
| S05 | 0:28.01 (f840) | 0:33.04 (f991) | 151 | IMG 003 | image |
| S06 | 0:33.04 (f991) | 0:38.69 (f1161) | 170 | IMG 004 | image |
| S07 | 0:38.69 (f1161) | 0:45.28 (f1358) | 197 | IMG 005 | image |
| S08 | 0:45.28 (f1358) | 0:50.82 (f1525) | 167 | IMG 006 | image |
| S09 | 0:50.82 (f1525) | 0:59.10 (f1773) | 248 | IMG 007 | image |
| S10 | 0:59.10 (f1773) | 1:05.70 (f1971) | 198 | IMG 008 | image |
| S11 | 1:05.70 (f1971) | 1:13.24 (f2197) | 226 | MAP-02 | map |
| S12 | 1:13.24 (f2197) | 1:22.02 (f2460) | 263 | IMG 009 | image |
| S13 | 1:22.02 (f2460) | 1:30.00 (f2700) | 240 | GFX-01 | gfx |
| S14 | 1:30.00 (f2700) | 1:37.00 (f2910) | 210 | IMG 010 | image |
| S15 | 1:37.00 (f2910) | 1:45.90 (f3177) | 267 | IMG 011 | image |
| S16 | 1:45.90 (f3177) | 1:56.19 (f3486) | 309 | BG 002 + CUT 012 | parallax |
| S17 | 1:56.19 (f3486) | 2:03.50 (f3705) | 219 | MAP-03 | map |
| S18 | 2:03.50 (f3705) | 2:10.30 (f3909) | 204 | IMG 013 | image |
| S19 | 2:10.30 (f3909) | 2:15.50 (f4065) | 156 | IMG 014 | image |
| S20 | 2:15.50 (f4065) | 2:25.87 (f4376) | 311 | MAP-04 | map |
| S21 | 2:25.87 (f4376) | 2:31.90 (f4557) | 181 | IMG 015 | image |
| S22 | 2:31.90 (f4557) | 2:41.80 (f4854) | 297 | MAP-04 | map |
| S23 | 2:41.80 (f4854) | 2:49.43 (f5083) | 229 | IMG 016 | image |
| S24 | 2:49.43 (f5083) | 2:56.70 (f5301) | 218 | MAP-05 | map |
| S25 | 2:56.70 (f5301) | 3:04.10 (f5523) | 222 | IMG 017 | image |
| S26 | 3:04.10 (f5523) | 3:13.60 (f5808) | 285 | IMG 018 | image |
| S27 | 3:13.60 (f5808) | 3:23.40 (f6102) | 294 | MAP-06 | map |
| S28 | 3:23.40 (f6102) | 3:31.80 (f6354) | 252 | IMG 019 | image |
| S29 | 3:31.80 (f6354) | 3:43.93 (f6718) | 364 | IMG 020 | image |
| S30 | 3:43.93 (f6718) | 3:53.89 (f7017) | 299 | MAP-07 | map |
| S31 | 3:53.89 (f7017) | 3:59.23 (f7177) | 160 | IMG 021 | image |
| S32 | 3:59.23 (f7177) | 4:08.31 (f7449) | 272 | IMG 022 | image |
| S33 | 4:08.31 (f7449) | 4:21.45 (f7844) | 395 | MAP-08 | map |
| S34 | 4:21.45 (f7844) | 4:30.80 (f8124) | 280 | IMG 023 | image |
| S35 | 4:30.80 (f8124) | 4:41.40 (f8442) | 318 | IMG 024 | image |
| S36 | 4:41.40 (f8442) | 4:50.65 (f8719) | 277 | MAP-09 | map |
| S37 | 4:50.65 (f8719) | 5:00.77 (f9023) | 304 | IMG 025 | image |
| S38 | 5:00.77 (f9023) | 5:14.60 (f9438) | 415 | MAP-10 | map |
| S39 | 5:14.60 (f9438) | 5:22.80 (f9684) | 246 | IMG 026 | image |
| S40 | 5:22.80 (f9684) | 5:28.77 (f9863) | 179 | IMG 001 | image |

## 3. Cues

Every `@"word"` cue from the runbook was matched to the transcript **exactly** (no closest-match fallbacks).

| Scene | Cue | Heard as | Time | Frame | Action |
|---|---|---|---|---|---|
| S01 | @"Korea" | Korea | 8.25 s | 248 | pulse label KOREA on the east edge |
| S01 | @"Hungary" | Hungary. | 9.37 s | 281 | pulse label HUNGARY on the west edge |
| S03 | @"Mongol" | Mongol | 14.86 s | 446 | title "THE MONGOL EMPIRE" fades in, centered, serif, with a thin line underneath |
| S04 | @"Temujin" | Temujin | 19.24 s | 577 | small pulsing dot at the Onon river |
| S04 | @"rival" | rival | 24.34 s | 730 | tribe zones appear: Tatars, Merkits, Keraites, Naimans, Mongols |
| S11 | @"Tatars" | Tatars, | 66.32 s | 1990 | Tatar zone absorbed |
| S11 | @"Keraites" | Keraites | 67.28 s | 2019 | Keraite zone absorbed |
| S11 | @"Naimans" | Naimans. | 68.32 s | 2050 | Naiman zone absorbed |
| S12 | @"Genghis" | Genghis | 77.49 s | 2325 | label "GENGHIS KHAN" fades in |
| S13 | @"ten," | ten, | 86.81 s | 2604 | 10 (ARBAN) |
| S13 | @"hundred," | hundred, | 87.34 s | 2620 | 100 (JAGUN) |
| S13 | @"thousand" | thousand | 88.17 s | 2645 | 1,000 (MINGGHAN) |
| S13 | @"ten thousand" | ten thousand. | 89.11 s | 2673 | 10,000 (TUMEN) |
| S17 | @"Western" | Western | 118.31 s | 3549 | arrow into Western Xia, zone turns tributary color |
| S17 | @"Jin" | Jin | 121.70 s | 3651 | arrows into Jin territory |
| S20 | @"Khwarazmian" | Khwarazmian | 136.64 s | 4099 | Khwarazmian territory highlights |
| S20 | @"caravan" | caravan | 141.36 s | 4241 | dotted line from Mongolia to Otrar with a moving caravan dot |
| S20 | @"Otrar" | Otrar | 143.47 s | 4304 | red flash on Otrar |
| S22 | @"invaded" | invaded. | 155.34 s | 4660 | three arrows sweep into Khwarazm |
| S22 | @"Otrar" | Otrar, | 157.49 s | 4725 | Otrar gets a cross mark |
| S22 | @"Bukhara" | Bukhara, | 158.09 s | 4743 | Bukhara gets a cross mark |
| S22 | @"Samarkand" | Samarkand | 158.86 s | 4766 | Samarkand gets a cross mark |
| S22 | @"Merv" | Merv | 160.16 s | 4805 | Merv gets a cross mark |
| S24 | @"Jebe" | Jebe | 170.77 s | 5123 | animated dashed route starts south of the Caspian and loops around it |
| S24 | @"Georgian" | Georgian | 174.72 s | 5242 | battle icon in Georgia |
| S24 | @"Rus" | Rus | 175.38 s | 5261 | battle icon at the Kalka river |
| S27 | @"Russian" | Russian | 199.10 s | 5973 | arrows through Ryazan and Vladimir |
| S27 | @"Kyiv" | Kyiv, | 200.76 s | 6023 | Kyiv flashes, cross mark |
| S27 | @"Poland" | Poland | 202.20 s | 6066 | arrow to Legnica, battle icon |
| S27 | @"Hungary" | Hungary. | 202.73 s | 6082 | arrow to Mohi, battle icon |
| S30 | @"Hulegu" | Hulegu | 226.07 s | 6782 | arrow from Persia toward Baghdad |
| S30 | @"Baghdad" | Baghdad | 227.12 s | 6814 | Baghdad flashes red |
| S33 | @"four" | four | 254.76 s | 7643 | empire splits into four colored zones with dividing lines |
| S33 | @"Golden" | Golden | 255.93 s | 7678 | label GOLDEN HORDE |
| S33 | @"Chagatai" | Chagatai | 257.04 s | 7711 | label CHAGATAI KHANATE |
| S33 | @"Ilkhanate" | Ilkhanate, | 258.46 s | 7754 | label ILKHANATE |
| S33 | @"Yuan" | Yuan | 259.66 s | 7790 | label YUAN DYNASTY |
| S34 | @"Kublai" | Kublai | 262.35 s | 7871 | label "KUBLAI KHAN" |
| S36 | @"Silk" | Silk | 284.10 s | 8523 | trade routes draw in as glowing ochre lines |
| S36 | @"Merchants" | Merchants, | 285.93 s | 8578 | small caravan dots move along the routes |
| S36 | @"Marco" | Marco | 288.02 s | 8641 | dashed route from Venice to Beijing (Khanbaliq) |
| S38 | @"Ilkhanate" | Ilkhanate | 303.20 s | 9096 | Ilkhanate zone fades out |
| S38 | @"Yuan" | Yuan | 307.15 s | 9215 | Yuan zone fades, "MING" label appears |
| S38 | @"Golden" | Golden | 310.42 s | 9313 | Golden Horde zone shrinks and fades |

**Unresolved cues:** none.

Extra word anchors used for timing details that the runbook does not pin to a word:
- S17 @"1209." → "1209." 119.68s
- S35 @"failed." → "failed." 275.10s
- S35 @"typhoon" → "typhoon" 277.79s

## 4. Voiceover alignment

- Transcription: whisper.cpp 1.5.5 via `@remotion/install-whisper-cpp`, model `medium.en`, token-level timestamps merged into 902 words → `src/data/transcript.json`. (1.5.5 is used because newer whisper.cpp releases need cmake, which is not installed.)
- Alignment (`scripts/align.mjs`): script.txt and the transcript are normalised to spoken tokens (years spelled out: "1206" → "twelve oh six", "1340s" → "thirteen forties") and aligned globally with a phonetic fuzzy score. Result: 896 script words, 0 unaligned.
- Whisper tends to start a word at the end of the preceding pause; word starts that fall inside a detected silence (ffmpeg `silencedetect`, -38 dB) are moved to the speech onset. This matters for scene starts after the `<break>` pauses (e.g. S13 starts at 82.02 s, not 80.80 s).
- Words where the transcript spelling differs from the script (captions always show the script spelling): Keraites ← "Karites", Yassa ← "Yasa", Xia ← "Shia", Jebe ← "Jeba", Karakorum ← "Karakoram", Kyiv ← "Kiev", Genghis's ← "Genghis", Hulegu ← "Hulagu", Genghis's ← "Genghis", Khanate ← "Khanadi", Ilkhanate ← "Ilkhanadi".
- The voiceover says "Genghis Khan's grandson(s)" in S30 and S33 where script.txt has "Genghis's"; the extra spoken "Khan" is absorbed by the alignment and the caption shows the script text.
- Captions: word-by-word from these timings, bottom centre, max two lines, spoken words lit and the current word in ochre.

## 5. Maps: data sources and faked polygons

Base data: Natural Earth 50 m land (world-atlas). Borders: aourednik/historical-basemaps (`world_1200`, `world_1279`, `world_1300`, `world_1492`). Territories are clipped to the coastline at render time. Each map uses its own central meridian so north stays up.

| Territory id | Source |
|---|---|
| yuan_1279 | world_1279 |
| chagatai_1279 | world_1279 |
| ilkhanate_1279 | world_1279 |
| golden_1279 | world_1279 |
| rus_vassals_1279 | world_1279 |
| mamluk_1279 | world_1279 |
| yuan_1300 | world_1300 |
| chagatai_1300 | world_1300 |
| ilkhanate_1300 | world_1300 |
| golden_1300 | world_1300 |
| golden_1492 | world_1492 |
| ming_1492 | world_1492 |
| mongol_1200 | world_1200 |
| xixia_1200 | world_1200 |
| song_1200 | world_1200 |
| hungary_1200 | world_1200 |
| poland_1200 | world_1200 |
| georgia_1200 | world_1200 |
| rus_1200 | world_1200 |
| tribe_naimans | handmade:tribe_naimans |
| tribe_keraites | handmade:tribe_keraites |
| tribe_merkits | handmade:tribe_merkits |
| tribe_mongols | handmade:tribe_mongols |
| tribe_tatars | handmade:tribe_tatars |
| jin_1210 | handmade:jin_1210 |
| song_1210 | handmade:song_1210 |
| mongol_1206 | handmade:mongol_1206 |
| mongol_1218 | handmade:mongol_1206 + handmade:kara_khitai_1218 |
| khwarazm_1218 | handmade:khwarazm_1218 |
| abbasid_1258 | handmade:abbasid_1258 |

**Hand-made (faked) polygons**, all simplified by hand:
- `tribe_naimans`, `tribe_keraites`, `tribe_merkits`, `tribe_mongols`, `tribe_tatars` (MAP-02, S04/S11): no dataset has 12th-century tribes; the runbook allows hand-made zones.
- `jin_1210` (MAP-03): the 1200 file only has a small "Liao" polygon in Manchuria and no Jin dynasty.
- `song_1210` (MAP-03): the dataset's Song Empire reaches 40°N, overlapping Jin; redrawn south of the Huai river.
- `mongol_1206` (MAP-03, MAP-04): the dataset's 1200 "Mongol Empire" is a coarse box reaching into Siberia and Manchuria; redrawn as Mongolia proper.
- `kara_khitai_1218` (MAP-04, part of `mongol_1218`): the lands taken from Kara Khitai in 1218; the dataset polygon overlapped Khwarazm.
- `khwarazm_1218` (MAP-04): the dataset's 1200 Khwarazmian polygon is a small, misplaced fragment.
- `abbasid_1258` (MAP-07): the remaining Abbasid caliphate in Iraq, drawn over the 1279 Ilkhanate until Baghdad falls.

**Approximations from the nearest year** (dataset polygons used out of their year):
- MAP-01 peak extent = the four khanates of 1279 + `rus_vassals_1279` (the Rus principalities, tributary to the Golden Horde).
- MAP-06 Mongol territory "around 1241" = the 1279 Golden Horde; Rus, Poland and Hungary from 1200.
- MAP-07 Mongol territory in 1258 = the 1279 Ilkhanate (+ the hand-made Abbasid zone); Mamluks from 1279.
- MAP-08/09/10 "around 1294" = `world_1300`. MAP-10 shrinking Golden Horde = the `world_1492` Golden Horde; Ming = `world_1492` Ming Empire.
- MAP-05 Georgia = `world_1200`. MAP-03 Western Xia = `world_1200` "Xixia".

## 6. Verification

- `node scripts/validate.ts`: **PASSED**. Checks that all 40 runbook scenes exist in order with the runbook's assets; every checklist asset (001–026, MAP-01…MAP-10, GFX-01) is used in exactly its listed scenes and nowhere else; every referenced file exists (012 is RGBA); scenes are contiguous from frame 0 to the last frame with no gaps or overlaps; duration = voiceover + 1.5 s; every runbook cue is resolved inside its scene.
- `sh scripts/render-stills.sh`: one still per scene (middle frame) in `checks/Sxx.png`, each compared with the runbook. Problems found and fixed along the way: map land-clip edge visible at Eurasia zoom; parchment texture tile seams; regional maps rotated far from the central meridian (fixed with per-map meridians); regional zooms too wide; overlapping labels; MAP-01 growth mask cut flat at the top; GFX-01 transitions longer than the 0.5 s gaps between the VO cues (grid drifted off-frame).

## 7. Deviations, interpretations and things I could not do

- **S24 route direction.** The runbook says the route loops around the Caspian "counterclockwise (through Persia, Caucasus, the steppe north of the Black Sea)". That listed path (south → west → north → east) is clockwise on a north-up map. I followed the explicit path, which is also the historical route.
- **S15** optional horizontal motion-blur streak: not used.
- **S16** "background pans slowly left": the background drifts left (camera tracking the rider) while the archer gallops left to right with a stride bounce.
- **S13 / GFX-01**: before the first cue ("ten") a single rider icon is shown so the frame is not empty for ~4.5 s. The four VO cues are only 0.5–0.9 s apart, so each grid step and count-up is compressed to fit before the next cue (10,000 lands at 89.1 s, the scene ends at 90.0 s).
- **S38** "Golden Horde shrinks": done by crossfading the 1300 Golden Horde into its much smaller 1492 remnant, then fading it out. The Chagatai Khanate is not mentioned in the VO or the runbook, so it stays.
- Small additions for orientation, not in the runbook: region labels on maps (e.g. MONGOLS, JIN, SONG, WESTERN XIA, KHWARAZMIAN EMPIRE, PERSIA, MAMLUKS, RUS, POLAND, HUNGARY, SILK ROAD), sea labels, the Kalka river line, Rus turning Mongol colour after Kyiv (S27) and Iraq turning Mongol colour after Baghdad (S30).
- S04 year label shows "1162 AD" as written; other single-year labels show the number only, as written in the runbook.
- No sound effects or music: none were provided or asked for.
