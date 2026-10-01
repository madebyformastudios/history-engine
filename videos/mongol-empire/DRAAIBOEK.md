# DRAAIBOEK: The Mongol Empire in 5 Minutes

This is the scene-by-scene runbook for the video. It is the single source of truth.
Claude must follow it exactly: every scene, every asset, every cue.

## How to read this runbook

- Every scene has an ID (S01, S02, ...). One scene = one paragraph in `script.txt`.
- `VO` is the exact voiceover text for that scene. Scene timing comes from the voiceover (see CLAUDE_PROMPT.md).
- `ASSET` says what is on screen:
  - `IMG 001` = `public/images/001.jpg` (image prompts in IMAGE_PROMPTS.md use the same number)
  - `MAP-01` = an animated map, defined in the "Map definitions" section below
  - `GFX-01` = a motion graphic built in code, defined in the "Graphics" section below
  - `BG 002 + CUT 013` = parallax: image 002 as background, image 013 (cutout, transparent PNG) in front
- `MOTION` says how the asset moves.
- `CUES` are moments inside the scene, anchored to a word in the VO: `@"Otrar"` means "at the moment the narrator says Otrar".
- `LABEL` is on-screen text (year, name). Keep labels short.
- An asset may be reused in a later scene only when the runbook says so.

## Global style

- Palette: ochre #C8963E, terracotta #B5552D, olive green #6B7041, deep blue #24384F, parchment #EADBC0, ink #2B241C
- Typography: one serif display font for titles and labels (e.g. Cormorant Garamond or Cinzel), one clean sans for captions
- Parchment texture overlay on everything (low opacity), subtle dust particles
- Crossfade between scenes (8 to 12 frames) unless the scene says "hard cut"
- Captions: bottom center, word-by-word highlight, max 2 lines

---

## PART 1: HOOK

### S01 | MAP-01 | teaser
VO: "In less than a century, a few nomadic tribes from the Mongolian steppe built the largest connected land empire in history. At its height, it stretched from Korea all the way to Hungary."
MOTION: Map of Eurasia. Mongol territory explodes outward from Mongolia to its peak extent in about 4 seconds, then holds.
CUES: @"Korea" pulse label KOREA on the east edge | @"Hungary" pulse label HUNGARY on the west edge
LABEL: none

### S02 | IMG 001 | Ken Burns
VO: "And it all began with a boy who had nothing."
MOTION: Slow push in on the boy.

### S03 | IMG 002 | Ken Burns + title card
VO: "This is the story of the Mongol Empire."
MOTION: Slow pan left to right across the steppe.
CUES: @"Mongol" title "THE MONGOL EMPIRE" fades in, centered, serif, with a thin line underneath

---

## PART 2: TEMUJIN

### S04 | MAP-02 | steppe tribes
VO: "Around 1162, a boy named Temujin was born on the steppe of what is now Mongolia. The steppe was divided between rival tribes, who raided and fought each other constantly."
MOTION: Zoom into Mongolia. Tribe zones fade in one by one.
CUES: @"Temujin" small pulsing dot at the Onon river | @"rival" tribe zones appear: Tatars, Merkits, Keraites, Naimans, Mongols
LABEL: YearCounter "1162 AD"

### S05 | IMG 003 | Ken Burns
VO: "When Temujin was about nine, his father was poisoned by the Tatars, a rival tribe."
MOTION: Slow push in on the father at the fire.

### S06 | IMG 004 | Ken Burns
VO: "His own clan abandoned the family. They survived by fishing, hunting small animals and digging up roots."
MOTION: Slow zoom out, making the family feel small and alone.

### S07 | IMG 005 | Ken Burns
VO: "As a teenager, Temujin was captured by a rival clan and locked in a heavy wooden collar. One night, he escaped."
MOTION: Slow push in. Subtle dark vignette.

### S08 | IMG 006 | Ken Burns
VO: "He married a young woman named Borte. But soon after the wedding, she was kidnapped by the Merkit tribe."
MOTION: Slow pan right.

### S09 | IMG 007 | Ken Burns + dust
VO: "Temujin gathered allies, including his blood brother Jamukha, and rescued her. It was his first great victory, and people began to follow him."
MOTION: Fast-ish push in, dust overlay.

### S10 | IMG 008 | Ken Burns
VO: "But Jamukha became his greatest rival. For twenty years, Temujin fought tribe after tribe for control of the steppe."
MOTION: Slow zoom in toward the center gap between the two riders.

### S11 | MAP-02 | unification (reuse of MAP-02)
VO: "He crushed the Tatars, the Keraites and the Naimans. In the end, Jamukha was betrayed by his own men and executed."
MOTION: Same map as S04. Tribe zones turn Mongol color one by one.
CUES: @"Tatars" Tatar zone absorbed | @"Keraites" Keraite zone absorbed | @"Naimans" Naiman zone absorbed

### S12 | IMG 009 | Ken Burns
VO: "In 1206, a great assembly of the tribes gave him a new title: Genghis Khan. For the first time, the steppe was united."
MOTION: Slow zoom out to reveal the crowd.
CUES: @"Genghis" label "GENGHIS KHAN" fades in
LABEL: "1206"

---

## PART 3: THE MACHINE

### S13 | GFX-01 | decimal army
VO: "Genghis rebuilt Mongol society around the army. Men were organized in units of ten, a hundred, a thousand and ten thousand."
CUES: @"ten," 10 | @"hundred," 100 | @"thousand" 1,000 | @"ten thousand" 10,000

### S14 | IMG 010 | Ken Burns
VO: "Old tribal loyalties were broken up on purpose. Commanders were promoted for loyalty and skill, not for noble birth."
MOTION: Slow pan left.

### S15 | IMG 011 | Ken Burns
VO: "He introduced a code of law called the Yassa, and a network of relay stations, where riders swapped horses so messages could cross the empire at incredible speed."
MOTION: Slow push in. Optional: small horizontal motion blur streak.

### S16 | BG 002 + CUT 012 | parallax
VO: "Every Mongol warrior was a horse archer, trained from childhood. Each rider brought several spare horses, so an army could cover huge distances without stopping."
MOTION: Background 002 pans slowly left, cutout horse archer 012 gallops from left to right across the frame (with small vertical bounce). Reuse of 002 is intentional.

---

## PART 4: CONQUEST

### S17 | MAP-03 | China campaigns
VO: "First, he turned south. The Tangut kingdom of Western Xia submitted in 1209. Then he invaded the Jin dynasty of northern China."
CUES: @"Western" arrow into Western Xia, zone turns tributary color | @"Jin" arrows into Jin territory
LABEL: YearCounter 1206 to 1211

### S18 | IMG 013 | Ken Burns
VO: "The Mongols had no experience with walled cities. So they learned, using captured Chinese engineers to build siege weapons."
MOTION: Slow push in toward the siege engine.

### S19 | IMG 014 | Ken Burns + fire glow
VO: "In 1215, they captured the Jin capital Zhongdu, near modern Beijing."
MOTION: Slow zoom out, flickering orange glow overlay.
LABEL: "1215"

### S20 | MAP-04 | Khwarazm part 1
VO: "In the west lay the Khwarazmian Empire, a rich Muslim state in Central Asia. Genghis sent a trade caravan there, but the governor of Otrar had the merchants killed."
CUES: @"Khwarazmian" Khwarazmian territory highlights | @"caravan" dotted line from Mongolia to Otrar with a moving caravan dot | @"Otrar" red flash on Otrar
LABEL: YearCounter "1218"

### S21 | IMG 015 | Ken Burns
VO: "Genghis sent envoys to demand justice. The Shah had one of them executed and sent the others back humiliated."
MOTION: Slow push in on the Shah.

### S22 | MAP-04 | Khwarazm part 2 (reuse of MAP-04)
VO: "It was a fatal mistake. In 1219, the Mongols invaded. Within three years, Otrar, Bukhara, Samarkand and Merv had fallen."
CUES: @"invaded" three arrows sweep into Khwarazm | @"Otrar" @"Bukhara" @"Samarkand" @"Merv" each city gets a cross mark as it is named
LABEL: YearCounter 1219 to 1221

### S23 | IMG 016 | Ken Burns + smoke
VO: "Cities that resisted were destroyed and their people massacred. Cities that surrendered were usually spared. Word spread fast."
MOTION: Slow zoom out, smoke overlay.

### S24 | MAP-05 | Great Raid
VO: "Meanwhile, two generals, Jebe and Subutai, rode all the way around the Caspian Sea, defeating Georgian and Rus armies on the way."
CUES: @"Jebe" animated dashed route starts south of the Caspian and loops around it counterclockwise (through Persia, Caucasus, the steppe north of the Black Sea) | @"Georgian" battle icon in Georgia | @"Rus" battle icon at the Kalka river
LABEL: YearCounter 1220 to 1223

### S25 | IMG 017 | Ken Burns
VO: "In 1227, Genghis Khan died during a campaign in western China. To this day, nobody knows where he is buried."
MOTION: Very slow push in, slight desaturation.
LABEL: "1227"

---

## PART 5: THE SONS AND GRANDSONS

### S26 | IMG 018 | Ken Burns
VO: "His son Ogedei became the Great Khan and built a capital at Karakorum. In 1234, the Jin dynasty was finally destroyed."
MOTION: Slow pan right across the city.
LABEL: "1234"

### S27 | MAP-06 | Europe campaign
VO: "Then the Mongols looked west. Between 1237 and 1241, they swept through the Russian principalities, burned Kyiv, and crushed armies in Poland and Hungary."
CUES: @"Russian" arrows through Ryazan and Vladimir | @"Kyiv" Kyiv flashes, cross mark | @"Poland" arrow to Legnica, battle icon | @"Hungary" arrow to Mohi, battle icon
LABEL: YearCounter 1237 to 1241

### S28 | IMG 019 | Ken Burns + dust
VO: "European knights had never faced anything like this. Mongol riders would pretend to retreat, then turn around and surround their pursuers."
MOTION: Slow push in, dust overlay.

### S29 | IMG 020 | Ken Burns
VO: "Europe seemed open. But in late 1241, news came that Ogedei had died. The Mongol leaders turned back east, and they never returned in full force."
MOTION: Slow zoom out.

### S30 | MAP-07 | Middle East
VO: "In the Middle East, Genghis's grandson Hulegu attacked Baghdad in 1258. One of the greatest cities in the world was sacked, and the last Abbasid caliph was killed."
CUES: @"Hulegu" arrow from Persia toward Baghdad | @"Baghdad" Baghdad flashes red
LABEL: YearCounter "1258"

### S31 | IMG 021 | Ken Burns + smoke
VO: "According to legend, so many books were thrown into the Tigris that the river ran black with ink."
MOTION: Slow push in toward the river.

### S32 | IMG 022 | Ken Burns
VO: "But in 1260, the Egyptian Mamluks defeated a Mongol army at Ain Jalut. For the first time, the Mongol advance had been stopped."
MOTION: Slow push in.
LABEL: "1260"

---

## PART 6: SPLIT AND PEAK

### S33 | MAP-08 | four khanates
VO: "By then, the empire was too big to rule from one place. After a civil war between Genghis's grandsons, it broke into four parts: the Golden Horde, the Chagatai Khanate, the Ilkhanate, and the Yuan dynasty in China."
CUES: @"four" empire splits into four colored zones with dividing lines | @"Golden" label GOLDEN HORDE | @"Chagatai" label CHAGATAI KHANATE | @"Ilkhanate" label ILKHANATE | @"Yuan" label YUAN DYNASTY

### S34 | IMG 023 | Ken Burns
VO: "The Yuan was ruled by Kublai Khan. In 1279, he completed the conquest of southern China, and for the first time all of China was under Mongol rule."
MOTION: Slow push in on Kublai.
CUES: @"Kublai" label "KUBLAI KHAN"
LABEL: "1279"

### S35 | IMG 024 | Ken Burns + rain
VO: "He also tried to invade Japan, twice. Both attempts failed. The second fleet was destroyed by a typhoon the Japanese called kamikaze, the divine wind."
MOTION: Slow zoom out, rain and lightning flash overlay.

### S36 | MAP-09 | Silk Road
VO: "Despite all the violence, Mongol rule made the Silk Road safer than ever. Merchants, ideas and travelers like Marco Polo crossed from Europe to China."
CUES: @"Silk" trade routes draw in as glowing ochre lines | @"Merchants" small caravan dots move along the routes | @"Marco" dashed route from Venice to Beijing (Khanbaliq)

### S37 | IMG 025 | Ken Burns
VO: "But the same routes also carried something deadly. In the 1340s, the Black Death spread from Central Asia to the Black Sea, and from there to Europe."
MOTION: Slow push in, slight desaturation over the scene.

---

## PART 7: DECLINE AND LEGACY

### S38 | MAP-10 | decline
VO: "One by one, the khanates fell apart. The Ilkhanate collapsed in 1335. In 1368, the Yuan were driven out of China by the Ming. The Golden Horde held on the longest, until its grip on Moscow ended in 1480."
CUES: @"Ilkhanate" Ilkhanate zone fades out | @"Yuan" Yuan zone fades, "MING" label appears | @"Golden" Golden Horde zone shrinks and fades
LABEL: YearCounter 1335 to 1368 to 1480, following the cues

### S39 | IMG 026 | Ken Burns
VO: "The empire was gone. But it had reshaped the map of Asia and Europe, and the countries that rose from its ruins, from Russia to China."
MOTION: Slow zoom out on the lone rider.

### S40 | IMG 001 | Ken Burns + fade to black (reuse of 001)
VO: "And it all started with a boy on the steppe who refused to give up."
MOTION: Slow push in, then fade to black over the final 1.5 seconds after the VO ends. Reuse of 001 is intentional (bookend).

---

## Map definitions

All maps: d3-geo SVG, parchment land, deep blue sea, ink outlines. Mongol territory = terracotta. Enemy or target states = olive. Labels in the serif font, uppercase, small caps feel.
Projection for Eurasia maps: show from Hungary (west) to Korea (east), Siberia edge (north) to India (south).
Border data: aourednik/historical-basemaps GeoJSON. Use the nearest available years. If a polygon is missing or wrong, draw a simplified hand-made polygon and list every faked polygon in the build report.

| ID | Name | Area | Content |
|---|---|---|---|
| MAP-01 | Teaser | Full Eurasia | Mongol territory grows from Mongolia to peak extent (~1279). Labels KOREA, HUNGARY |
| MAP-02 | Steppe tribes | Zoom on Mongolia and surroundings | Zones for Tatars, Merkits, Keraites, Naimans, Mongols (hand-made polygons are fine). Onon river. Used in S04 and S11 |
| MAP-03 | China | Mongolia, Western Xia, Jin, Song | Western Xia, Jin, Song borders around 1210. Arrows south |
| MAP-04 | Khwarazm | Mongolia to Caspian Sea | Khwarazmian Empire around 1218. Cities: Otrar, Bukhara, Samarkand, Urgench, Merv. Used in S20 and S22 |
| MAP-05 | Great Raid | Caspian, Caucasus, Black Sea | Route of Jebe and Subutai, Georgia, Kalka river |
| MAP-06 | Europe | Volga to Hungary | Cities: Ryazan, Vladimir, Kyiv, Legnica, Mohi. Mongol territory around 1241 |
| MAP-07 | Middle East | Persia to Egypt | Baghdad, Ain Jalut. Mamluk territory in olive |
| MAP-08 | Four khanates | Full Eurasia | Golden Horde (gold), Chagatai (olive), Ilkhanate (deep red), Yuan (terracotta) around 1294 |
| MAP-09 | Silk Road | Full Eurasia, extended west to Venice | Trade routes, caravan dots, Marco Polo route Venice to Beijing |
| MAP-10 | Decline | Full Eurasia | Starts from MAP-08 state, zones fade by cue. Ming label in China |

## Graphics

| ID | Name | Description |
|---|---|---|
| GFX-01 | Decimal army | Parchment background. Small rider icons (simple flat silhouettes) in a grid. 10 icons appear, then the grid zooms out and multiplies to 100, then 1,000, then a dense block for 10,000. Big serif number counts along: 10, 100, 1,000, 10,000. Unit names under the number: ARBAN, JAGUN, MINGGHAN, TUMEN |

## Asset checklist

Every item below must be used in the listed scene(s). Missing or wrong use = build fails.

| Asset | Description | Scene(s) |
|---|---|---|
| 001 | Young boy alone on the steppe | S02, S40 |
| 002 | Wide steppe with yurts | S03, S16 (background) |
| 003 | Father poisoned at a feast fire | S05 |
| 004 | Mother and children abandoned | S06 |
| 005 | Teenage Temujin in wooden collar | S07 |
| 006 | Temujin and Borte | S08 |
| 007 | Night rescue raid | S09 |
| 008 | Temujin and Jamukha facing each other | S10 |
| 009 | 1206 great assembly | S12 |
| 010 | Commanders before Genghis in a tent | S14 |
| 011 | Relay rider changing horses | S15 |
| 012 | Horse archer cutout | S16 (foreground) |
| 013 | Siege of a Chinese walled city | S18 |
| 014 | Zhongdu burning at night | S19 |
| 015 | Shah receiving Mongol envoys | S21 |
| 016 | Ruined Central Asian city | S23 |
| 017 | Empty throne in a dark tent | S25 |
| 018 | Karakorum city | S26 |
| 019 | Knights versus horse archers | S28 |
| 020 | Riders turning back east | S29 |
| 021 | Books in the Tigris | S31 |
| 022 | Mamluk cavalry at Ain Jalut | S32 |
| 023 | Kublai Khan on throne | S34 |
| 024 | Fleet in a typhoon | S35 |
| 025 | Dark harbor city, Black Death | S37 |
| 026 | Lone rider at sunset | S39 |
| MAP-01 to MAP-10 | see Map definitions | see scenes |
| GFX-01 | Decimal army | S13 |
