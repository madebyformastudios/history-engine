# DRAAIBOEK: The ENTIRE History of Egypt

The scene-by-scene runbook. Single source of truth: every scene, every asset, every cue.

## How to read this runbook

- One scene = one paragraph in `script.txt` (same order). Some script paragraphs are split over two or three scenes; the voiceover is continuous.
- `VO`: exact voiceover text (correct spelling). The recorded voiceover used `script_elevenlabs.txt` (spelled-out years, phonetic names), see Pronunciation.
- `ASSET`: `IMG 001` = public/images/001.jpg, `MAP-01` = map defined below.
- `MOTION`: how the asset moves. `CUES`: moments anchored to a spoken word, `@"Kadesh"`. Match cue words fuzzily against the transcript (years are spoken as words).
- `LABEL`: on-screen text (year plaque or name card). Labels use digits.
- Reuse an asset only where the runbook says so (011 is used twice on purpose).

## Global style

Same look as the Mongol Empire video: palette ochre #C8963E, terracotta #B5552D, olive #6B7041, deep blue #24384F, parchment #EADBC0, ink #2B241C. Parchment overlay, grain, dust, crossfades of 8 to 12 frames, word-by-word captions.

Map colors for this video: Egypt = terracotta, rivals and invaders = olive or deep red, other states = muted parchment tones, Nile = river blue.

## Pronunciation (script_elevenlabs.txt)

| Written | Spoken in the voiceover |
|---|---|
| years (e.g. 1274 BC) | spelled out ("twelve seventy-four BC") |
| Roman numerals (Ramesses II) | "Ramesses the Second" |
| Kemet | Keh-met |
| Djoser | Joser |
| Saqqara | Sakkara |
| Khufu | Koofoo |
| Hyksos | Hicksos |
| Hatshepsut | Hat-shep-soot |
| Piye | Pee-yeh |
| Fustat | Foostaht |
| al-Qahira | al-Kahira |
| Ain Jalut | Ayn Jaloot |
| Acre | Akko |
| Champollion | Shampolyon |

The voiceover was recorded in six parts (see the PART headings below); there may be short pauses between parts.

---

## PART 1: THE FIRST KINGDOMS

### S01 | IMG 001 | Ken Burns
VO: "Cleopatra lived closer in time to the Moon landing than to the building of the Great Pyramid. By the time she ruled Egypt, the pyramids were already about 2,500 years old, and Egypt was older still."
MOTION: Slow push in from Cleopatra toward the pyramids behind her.
CUES: @"Moon" small crescent moon icon fades in at the top right, then out

### S02 | MAP-01 | map
VO: "Almost everyone in Egypt lives on about four percent of its land. The rest is desert. That thin green strip along the Nile is where this story happens. It runs from the first farming villages, through pharaohs, Greeks, Romans, caliphs, sultans and kings, to a country of more than 106 million people."
MOTION: Map of Egypt. The desert stays pale, only the Nile valley and delta glow green.
CUES: @"four" the green strip pulses | @"106" counter label "106,000,000" appears top left

### S03 | IMG 002 | Ken Burns + dust
VO: "Around 5500 BC, small farming settlements began to spread along the Nile. Every summer the river flooded and left behind a layer of black mud, so farmers could grow wheat and barley in the middle of the desert. The Egyptians called their land Kemet, the black land."
MOTION: Slow pan right along the flooded fields.
LABEL: 5500 BC

### S04 | MAP-02 | map
VO: "Over time these villages grew into two kingdoms. Upper Egypt in the south, along the narrow valley, and Lower Egypt in the north, in the wide delta where the Nile meets the Mediterranean."
MOTION: Zoom to the Nile. Two zones fade in.
CUES: @"Upper" Upper Egypt zone (south) fades in, label UPPER EGYPT | @"Lower" Lower Egypt zone (delta) fades in, label LOWER EGYPT

### S05 | IMG 003 | Ken Burns
VO: "Around 3100 BC, a king named Narmer claimed both. He is shown on a carved stone palette wearing the white crown of the south on one side and the red crown of the north on the other. For the next three thousand years, every pharaoh would call himself Lord of the Two Lands."
MOTION: Slow push in on Narmer.
CUES: @"Narmer" name card "NARMER"
LABEL: 3100 BC

### S06 | MAP-03 | map
VO: "The period we now call the Old Kingdom began around 2686 BC. Its kings ruled from Memphis, near modern Cairo, and they spent enormous resources preparing for the afterlife."
MOTION: Zoom on the area around Memphis.
CUES: @"Memphis" Memphis marker pulses
LABEL: YearCounter "2686 BC"

### S07 | IMG 004 | Ken Burns + dust
VO: "For King Djoser, an official named Imhotep stacked six stone platforms on top of each other at Saqqara. The Step Pyramid was the first large building in Egypt made entirely of stone."
MOTION: Slow push in on the Step Pyramid.
CUES: @"Imhotep" name card "IMHOTEP"

### S08 | IMG 005 | Ken Burns
VO: "Within about a century, Egyptian builders had learned to make the sides smooth. Around 2600 BC, the pharaoh Khufu built the Great Pyramid of Giza. It was 146 meters tall and made of roughly 2.3 million stone blocks. For more than 3,700 years, nothing built by humans was taller."
MOTION: Slow tilt up the Great Pyramid.
CUES: @"146" label "146 m" | @"3,700" label "3,700+ YEARS"
LABEL: 2600 BC

### S09 | IMG 006 | Ken Burns + dust
VO: "Greek writers later claimed slaves built it. Archaeologists have since found the camps where the workers lived, and they point to Egyptian laborers called up for service, probably around 13,000 at a time and up to 40,000 at the peak."
MOTION: Slow pan left across the workers.

### S10 | IMG 007 | Ken Burns + dust
VO: "Then the floods failed. In the 22nd century BC, a long drought kept the Nile low for years. Harvests collapsed, and so did the central government. Local governors took over, fought each other, and for about two hundred years Egypt was split apart."
MOTION: Slow zoom out, slight desaturation.

### S11 | MAP-04 | map
VO: "Around 2030 BC, Mentuhotep II, a ruler from Thebes in the south, reunited the country and began what we call the Middle Kingdom."
MOTION: Egypt split into many small zones, then one color spreads north from Thebes.
CUES: @"Thebes" Thebes marker pulses | @"reunited" the zones merge into one color, growing from Thebes
LABEL: YearCounter "2030 BC"

### S12 | MAP-05 | map
VO: "But around 1650 BC, foreigners from the Levant took control of the north. The Egyptians called them the Hyksos, rulers of foreign lands. From their capital Avaris in the delta, they ruled Lower Egypt for about a century. They brought horses with them, and possibly new weapons as well."
MOTION: Delta and Levant in view.
CUES: @"Levant" arrow from the Levant into the delta | @"Avaris" Avaris marker appears, Hyksos zone over Lower Egypt
LABEL: YearCounter "1650 BC"

---

## PART 2: EMPIRE AND DECLINE

### S13 | IMG 008 | Ken Burns + dust
VO: "Around 1550 BC, Ahmose of Thebes drove the Hyksos out. Egypt now entered the New Kingdom, and this time it pushed far beyond its deserts and built an empire."
MOTION: Fast push in on the charging chariots.
LABEL: 1550 BC

### S14 | IMG 009 | Ken Burns
VO: "Hatshepsut, one of the few women to rule as pharaoh, sent a trading expedition to the distant Land of Punt and filled the temples at Karnak with new buildings."
MOTION: Slow pan right along the ships.
CUES: @"women" name card "HATSHEPSUT"

### S15 | MAP-06 | map
VO: "Her stepson Thutmose III fought at least sixteen campaigns in twenty years and captured some 350 cities. At its height, his empire reached from the Euphrates in Syria to deep into Nubia in the south."
MOTION: Egypt grows into its New Kingdom empire.
CUES: @"Thutmose" name label THUTMOSE III | @"Euphrates" territory grows north to the Euphrates | @"Nubia" territory grows south into Nubia
LABEL: YearCounter "1450 BC"

### S16 | IMG 010 | Ken Burns
VO: "A few generations later, Akhenaten pushed aside Egypt's many gods and built the state religion around one: the Aten, the disc of the sun. He built a new capital in the desert, and Egyptian art suddenly looked different."
MOTION: Slow push in on the sun disc with its rays.
CUES: @"Akhenaten" name card "AKHENATEN"

### S17 | IMG 011 | Ken Burns
VO: "After his death, the young Tutankhamun, probably his son, went back to the old gods and the old capital. Tutankhamun died at about 18 and was buried in a small tomb that robbers mostly missed. When Howard Carter opened it in 1922, he found more than five thousand objects inside."
MOTION: Slow push in through the doorway toward the gold.
CUES: @"Tutankhamun" name card "TUTANKHAMUN"

### S18 | MAP-07 | map
VO: "The most powerful pharaoh of the New Kingdom was Ramesses II, who ruled for 66 years. In 1274 BC, he fought the Hittites at Kadesh in Syria, in what may have been the largest chariot battle in history, with five to six thousand chariots. Neither side really won."
MOTION: Egypt and the Hittite Empire face each other in the Levant.
CUES: @"Ramesses" name label RAMESSES II | @"Kadesh" battle icon at Kadesh
LABEL: YearCounter "1274 BC"

### S19 | IMG 012 | Ken Burns
VO: "Sixteen years later, Ramesses and the new Hittite king, Hattusili III, signed a peace treaty. The original was engraved on silver. It is the oldest international peace treaty known to historians, and a replica hangs today at the United Nations."
MOTION: Slow push in on the silver tablet.
LABEL: 1258 BC

### S20 | MAP-08 | map
VO: "Around 1177 BC, the eastern Mediterranean fell apart. As cities burned and trade broke down, raiders known as the Sea Peoples attacked Egypt. Ramesses III beat them on land and at sea, but Egypt never recovered its strength. By 1069 BC, the New Kingdom was over."
MOTION: Eastern Mediterranean.
CUES: @"burned" red flashes on several coastal cities | @"Sea" arrows of the Sea Peoples sweep toward the Nile delta
LABEL: YearCounter "1177 BC"

### S21 | MAP-09 | map
VO: "Over the next seven centuries, Egypt was ruled more and more often by outsiders. Libyan dynasties ruled from the delta. Then the kings of Kush, from what is now Sudan, marched north. Their king Piye conquered Egypt around 747 BC, and for nearly a century these Kushite pharaohs, often called the Black Pharaohs, ruled the whole Nile valley."
MOTION: Nile valley from the delta down to Kush.
CUES: @"Kush" Kush zone appears in the south | @"conquered" Kush grows north over all of Egypt
LABEL: YearCounter "747 BC"

### S22 | IMG 013 | Ken Burns + fire
VO: "They were pushed out by the Assyrians, the most feared army of the age. In 671 BC the Assyrians took Memphis, and in 663 BC they sacked Thebes."
MOTION: Slow zoom out on the burning temple city.
LABEL: 671 BC then 663 BC on the cue

### S23 | MAP-10 | map
VO: "Egypt won back its freedom for a while under Psamtik I. But in 525 BC, the Persian king Cambyses II invaded, and Egypt became a province of the Persian Empire."
MOTION: Wide view of the Persian Empire.
CUES: @"Psamtik" Egypt in its own color | @"Cambyses" arrow into Egypt, Egypt joins the Persian Empire color
LABEL: YearCounter "525 BC"

---

## PART 3: GREEKS, ROMANS AND ARABS

### S24 | IMG 014 | Ken Burns
VO: "In 332 BC, Alexander the Great arrived, and the Egyptians welcomed him as a liberator from Persian rule. On the coast he founded a new city and named it after himself: Alexandria."
MOTION: Slow push in on Alexander.
CUES: @"Alexandria" label "ALEXANDRIA"
LABEL: 332 BC

### S25 | MAP-11 | map
VO: "When Alexander died, one of his generals, Ptolemy, took Egypt. In 305 BC he declared himself king and started the last dynasty of ancient Egypt, which would rule for nearly three hundred years. The Ptolemies were Greek-speaking Macedonians, and their capital Alexandria became one of the largest cities of the ancient world."
MOTION: The kingdoms after Alexander.
CUES: @"Ptolemy" Ptolemaic kingdom highlights | @"Alexandria" Alexandria marker pulses
LABEL: YearCounter "305 BC"

### S26 | IMG 015 | Ken Burns
VO: "They built the Great Library of Alexandria and a lighthouse on the island of Pharos, around 140 meters tall, counted among the Seven Wonders of the World. In 196 BC, priests issued a decree for Ptolemy V in three scripts: hieroglyphs, Demotic and Greek. One copy, carved on a slab of stone, would later become the key to reading hieroglyphs."
MOTION: Slow tilt up the lighthouse.
CUES: @"decree" label "196 BC"

### S27 | IMG 016 | Ken Burns + smoke
VO: "The last ruler of the dynasty was Cleopatra VII. She allied herself first with Julius Caesar and then with Mark Antony. In 31 BC, Octavian, the future emperor Augustus, defeated their fleet at Actium. A year later, in 30 BC, Cleopatra died, and Egypt became the personal property of the Roman emperor."
MOTION: Slow zoom out over the sea battle.
CUES: @"Cleopatra" name card "CLEOPATRA VII"
LABEL: 31 BC

### S28 | MAP-12 | map
VO: "Under Rome, Egypt was the richest province outside Italy. Its grain fed the city of Rome, and Alexandria remained a center of learning."
MOTION: The Roman Empire around the Mediterranean.
CUES: @"grain" trade line with moving ship dots from Alexandria to Rome
LABEL: YearCounter "1 AD"

### S29 | IMG 017 | Ken Burns
VO: "Christianity reached Egypt early, and Alexandria became one of its great centers. Egyptian Christians, known today as Copts, built one of the oldest churches in the world. Their language, Coptic, was the last stage of the ancient Egyptian language."
MOTION: Slow push in on the monastery.

### S30 | MAP-13 | map
VO: "In the 7th century, Egypt was caught between two exhausted empires. The Persians occupied it from 618 to 628. A decade later, a new power arrived from Arabia."
MOTION: Byzantine and Sasanian empires.
CUES: @"Persians" Egypt turns Sasanian color | @"Arabia" Arabia lights up in a new color
LABEL: YearCounter 618 to 628

### S31 | MAP-14 | map
VO: "In December 639, the Arab general Amr ibn al-As crossed into Egypt with about 4,000 men. Within three years, the Byzantine fortress of Babylon and the city of Alexandria had both surrendered. Amr built a new capital next to the old fortress, called Fustat. Egypt has been under Muslim rule ever since, although most Egyptians converted to Islam and switched to Arabic slowly, over several centuries."
MOTION: Zoom on the delta and Sinai.
CUES: @"Amr" arrow from Sinai into the delta | @"Babylon" Babylon marker gets a cross | @"Alexandria" Alexandria marker gets a cross | @"capital" Fustat marker appears
LABEL: YearCounter 639 to 642

---

## PART 4: CAIRO, THE MAMLUKS AND NAPOLEON

### S32 | IMG 018 | Ken Burns
VO: "In 969, a Shia dynasty from North Africa, the Fatimids, conquered Egypt and founded a new city next to Fustat. They called it al-Qahira, the Victorious. We know it as Cairo. They also built the al-Azhar mosque, which grew into one of the oldest universities in the world."
MOTION: Slow pan across the new city.
CUES: @"Cairo" label "CAIRO"
LABEL: "969"

### S33 | IMG 019 | Ken Burns
VO: "The Fatimids were brought down from the inside. Their Kurdish vizier, Saladin, took power in 1171. From Egypt he fought the Crusaders, and in 1187 he captured Jerusalem."
MOTION: Slow push in on Saladin.
CUES: @"Saladin" name card "SALADIN"
LABEL: "1187"

### S34 | IMG 020 | Ken Burns + dust
VO: "Saladin's successors relied on mamluks: soldiers bought as slaves, trained from childhood, and then freed to serve as an elite army. In 1250 the French king Louis IX invaded Egypt on crusade. The mamluks defeated his army and captured the king himself, and France had to pay a ransom of 800,000 bezants to get him back. That same year, they killed the last sultan of Saladin's family and took the throne for themselves."
MOTION: Slow push in on the captured king.
CUES: @"Louis" name card "LOUIS IX"
LABEL: "1250"

### S35 | MAP-15 | map
VO: "Ten years later, in 1260, the Mamluks defeated the Mongols at Ain Jalut in Palestine. It was one of the first major defeats the Mongol armies had suffered. In 1291 they took Acre, the last big Crusader stronghold in the Holy Land."
MOTION: The Mamluk Sultanate in Egypt and Syria.
CUES: @"Ten" Mongol zone in the north east | @"Mongols" battle icon at Ain Jalut | @"stronghold" cross mark on Acre
LABEL: YearCounter 1260 to 1291

### S36 | IMG 021 | Ken Burns
VO: "Mamluk Cairo was one of the great cities of the Islamic world. Then, in 1347, the Black Death arrived, and plague returned again and again over the following decades."
MOTION: Slow zoom out on the empty street, desaturation.
LABEL: "1347"

### S37 | MAP-16 | map
VO: "In 1517, the Ottoman sultan Selim I defeated the Mamluks outside Cairo and hanged the last Mamluk sultan at one of the city's gates. For almost three centuries, Egypt was a province of the Ottoman Empire, though the Mamluk families stayed rich and powerful underneath."
MOTION: The eastern Mediterranean.
CUES: @"Selim" Ottoman color spreads from Syria over Egypt
LABEL: YearCounter "1517"

### S38 | IMG 022 | Ken Burns + smoke
VO: "In 1798, Napoleon Bonaparte landed at Alexandria with an army and 167 scientists and scholars. On 21 July he defeated the Mamluks at the Battle of the Pyramids, but eleven days later the British admiral Nelson destroyed his fleet at the Battle of the Nile."
MOTION: Slow pan across the battle with the pyramids behind.
CUES: @"Napoleon" name card "NAPOLEON"
LABEL: "1798"

### S39 | IMG 023 | Ken Burns
VO: "The French were trapped, but the scholars kept working. Their survey, published as the Description de l'Égypte, helped start the modern study of ancient Egypt. In 1799, their soldiers dug up the stone with the decree of Ptolemy V near the town of Rosetta. Napoleon left Egypt the same year, his army surrendered in 1801, and the Rosetta Stone went to the British Museum. In 1822, the French scholar Champollion used it to read hieroglyphs for the first time in about fourteen hundred years."
MOTION: Slow push in on the stone.
CUES: @"hieroglyphs" name card "CHAMPOLLION"
LABEL: 1799 then 1822 on the cue

---

## PART 5: MUHAMMAD ALI AND THE BRITISH

### S40 | IMG 024 | Ken Burns
VO: "In the chaos the French left behind, an Albanian officer in the Ottoman army took control. His name was Muhammad Ali, and in 1805 he became governor of Egypt."
MOTION: Slow push in on Muhammad Ali.
CUES: @"Muhammad" name card "MUHAMMAD ALI"
LABEL: "1805"

### S41 | IMG 025 | Ken Burns
VO: "In 1811, he invited the Mamluk leaders to a celebration at the Citadel of Cairo, closed the gates, and had them killed."
MOTION: Slow push in on the closed gate, dark vignette.
LABEL: "1811"

### S42 | MAP-17 | map
VO: "Then he rebuilt the country, with a modern army, state factories and new schools, and turned Egypt into a major exporter of cotton. His armies conquered Sudan and parts of Arabia and Syria, and his son nearly reached Constantinople. In 1840, the European powers forced him to pull back, but his family won the right to rule Egypt."
MOTION: Egypt and its neighbours.
CUES: @"Sudan" Egyptian color grows into Sudan | @"Arabia" into western Arabia | @"Syria" into Syria | @"Constantinople" arrow toward Constantinople, then pulls back | @"European" Syria and Arabia fade back
LABEL: YearCounter 1811 to 1840

### S43 | MAP-18 | map
VO: "His grandson Ismail spent heavily to modernize Egypt along European lines. In 1869, during his reign, the Suez Canal opened after ten years of digging. At 193 kilometers long, it connected the Mediterranean to the Red Sea, so ships from Europe no longer had to sail around Africa."
MOTION: Wide view: Europe, Africa and Asia.
CUES: @"opened" the canal route draws through Suez | @"Africa" the old route around Africa draws in dashed, then fades
LABEL: YearCounter "1869"

### S44 | IMG 026 | Ken Burns + dust
VO: "It also ruined Egypt's finances. In 1875, deep in debt, Ismail sold Egypt's share in the canal to Britain for four million pounds. Seven years later, after an army revolt, British troops invaded and defeated the Egyptian army at Tel el-Kebir. Britain controlled Egypt from then on, even though on paper it was still part of the Ottoman Empire."
MOTION: Slow pan across the British troops.
LABEL: "1882"

### S45 | IMG 027 | Ken Burns
VO: "When the Ottomans joined the First World War, Britain made Egypt a formal protectorate. In 1919 the country rose up in revolution, and on 28 February 1922 Britain declared Egypt independent, while keeping control of defense and the canal."
MOTION: Slow pan across the crowd.
LABEL: 1919 then 1922 on the cue

### S46 | IMG 011 | Ken Burns
VO: "That same year, Howard Carter opened the tomb of Tutankhamun, which set off a new wave of fascination with ancient Egypt around the world."
MOTION: Reuse of 011, a different crop: push in on the golden mask.
LABEL: "1922"

---

## PART 6: MODERN EGYPT

### S47 | IMG 028 | Ken Burns
VO: "On 23 July 1952, a group of army officers called the Free Officers overthrew King Farouk. A year later the monarchy was gone, and in 1956 one of the officers, Gamal Abdel Nasser, became president."
MOTION: Slow push in on the officers.
CUES: @"Nasser" name card "GAMAL ABDEL NASSER"
LABEL: "1952"

### S48 | MAP-19 | map
VO: "The last British soldiers had left the canal zone in June 1956. A month later, Nasser nationalized the Suez Canal. Israel, Britain and France invaded, but the United States and the Soviet Union forced them to withdraw, and Nasser came out of the crisis as the hero of the Arab world."
MOTION: Zoom on Sinai and the canal.
CUES: @"nationalized" the canal line glows | @"Israel" arrows from Israel into Sinai, from the sea at Port Said | @"withdraw" the arrows fade out
LABEL: YearCounter "1956"

### S49 | MAP-20 | map
VO: "In 1958 Egypt even merged with Syria into one country, the United Arab Republic, although the union broke up after three years."
MOTION: Egypt and Syria.
CUES: @"merged" Egypt and Syria in one color, label UNITED ARAB REPUBLIC | @"broke" Syria fades back
LABEL: YearCounter 1958 to 1961

### S50 | IMG 029 | Ken Burns
VO: "At home, after the United States withdrew its funding, Nasser turned to the Soviet Union to build the Aswan High Dam, which ended the yearly Nile flood that had shaped Egypt since before the pharaohs."
MOTION: Slow pan along the dam wall.
CUES: @"Aswan" label "ASWAN HIGH DAM"

### S51 | MAP-21 | map
VO: "In 1967, Israel destroyed Egypt's air force in a few hours and took the Sinai Peninsula and Gaza in six days. Nasser died three years later."
MOTION: Sinai, Gaza and the canal.
CUES: @"Sinai" Sinai and Gaza turn Israeli color
LABEL: YearCounter "1967"

### S52 | MAP-22 | map
VO: "His successor, Anwar Sadat, attacked on 6 October 1973. Egyptian troops crossed the Suez Canal and broke through the Israeli defenses on the other side. The war ended without a clear winner, but it gave Sadat the strength to negotiate."
MOTION: Zoom on the canal.
CUES: @"crossed" arrows cross the canal from west to east | @"broke" the Israeli line on the east bank breaks
LABEL: YearCounter "1973"

### S53 | IMG 030 | Ken Burns
VO: "In 1977 he flew to Jerusalem, and on 26 March 1979 Egypt became the first Arab country to sign a peace treaty with Israel. Egypt got the Sinai back, and Sadat won the Nobel Peace Prize."
MOTION: Slow push in on the handshake.
CUES: @"Sadat" name card "ANWAR SADAT"
LABEL: "1979"

### S54 | IMG 031 | Ken Burns
VO: "Much of the Arab world saw the treaty as a betrayal, and Egypt was suspended from the Arab League for ten years. On 6 October 1981, eight years to the day after the crossing, Islamist soldiers shot Sadat during a military parade."
MOTION: Slow push in on the empty reviewing stand, dark vignette.
LABEL: "1981"

### S55 | IMG 032 | Ken Burns
VO: "His vice president, Hosni Mubarak, ruled for the next thirty years. On 25 January 2011, National Police Day, protesters against police brutality filled Tahrir Square in Cairo. After eighteen days and more than 800 deaths, Mubarak resigned. In 2012, Egyptians elected Mohamed Morsi of the Muslim Brotherhood in the country's first free presidential election."
MOTION: Slow zoom out over the crowd.
CUES: @"Mubarak" name card "HOSNI MUBARAK"
LABEL: "2011"

### S56 | IMG 033 | Ken Burns
VO: "A year later, after huge protests against him, the army removed Morsi. On 14 August 2013, security forces cleared his supporters' camps in Cairo, and hundreds were killed. The general who led the takeover, Abdel Fattah el-Sisi, was elected president in 2014 and is now in his third term."
MOTION: Slow pan over Cairo at dusk.
LABEL: "2013"

### S57 | MAP-23 | map
VO: "Today Egypt has more than 106 million people, and it still lives from the river. The Nile provides about 97 percent of its fresh water. In September 2025, Ethiopia opened a giant dam on the Blue Nile, upstream, and Egypt protested to the UN Security Council. The Suez Canal, which carries around 8 percent of the world's sea trade, lost more than half its income after attacks on shipping in the Red Sea, although traffic has been coming back."
MOTION: The whole Nile basin and the Red Sea.
CUES: @"Ethiopia" dam marker on the Blue Nile | @"Suez" shipping line through the canal, then a red flash in the Red Sea
LABEL: YearCounter "2026"

### S58 | IMG 034 | Ken Burns + fade to black
VO: "In November 2025, Egypt opened the Grand Egyptian Museum on the edge of Giza, a short distance from the pyramids. All 5,398 objects from Tutankhamun's tomb are now shown together for the first time, near the pyramid Khufu built more than 4,500 years ago."
MOTION: Slow zoom out from the museum to the pyramids. Fade to black 1.5 s after the voiceover ends.

---

## Map definitions

All maps: d3-geo SVG in the engine's map style. Use a projection centered on Egypt and the eastern Mediterranean (extent roughly 0°E to 70°E, 0°N to 50°N), each map with its own camera and meridian. MAP-12 and MAP-18 need a wider extent (Rome, London, the Cape, India): use a separate wide camera.
Borders: aourednik/historical-basemaps for the nearest year where it exists (`world_bc2000`, `world_bc1500`, `world_bc1000`, `world_bc700`, `world_bc500`, `world_bc323`, `world_bc200`, `world_bc1`, `world_600`, `world_1279`, `world_1492`, `world_1530`, `world_1815`, `world_1960`, `world_1994`). Prefer a dataset polygon over a hand-made one. Hand-made polygons follow real geography (the Nile, the delta branches, the Sinai coast, cataracts) and get a comment with year and source in `scripts/fetch-maps.mjs`. New territories go into the shared library.

| ID | Name | Area | Content |
|---|---|---|---|
| MAP-01 | Egypt today | Egypt, Mediterranean coast to Sudan border | Territory `nile_valley`: the Nile valley and delta as a thin green band (hand-made, follows the Nile river line and the delta). Rest of Egypt `egypt_modern` in pale desert color |
| MAP-02 | Two kingdoms | Nile from the delta to Aswan | `upper_egypt_3200bc` (valley south of Memphis to the first cataract at Aswan), `lower_egypt_3200bc` (the delta). Hand-made, both follow the Nile |
| MAP-03 | Old Kingdom | Zoom on Memphis | Markers: Memphis, Saqqara, Giza. Territory `egypt_old_kingdom` (Nile valley to Aswan + delta) |
| MAP-04 | Reunification | Nile valley | Start: 6 to 8 small hand-made zones along the Nile. End: one `egypt_middle_kingdom` color. Marker: Thebes |
| MAP-05 | Hyksos | Delta, Sinai, southern Levant | `hyksos_1650bc` (delta + north Sinai), `egypt_theban_1650bc` (valley from Cusae south). Marker: Avaris. Arrow from the Levant |
| MAP-06 | New Kingdom empire | Nubia to the Euphrates | historical-basemaps `world_bc1500` Egypt; grow to `egypt_empire_1450bc` (Levant up to the Euphrates bend, Nubia to the 4th cataract; hand-made if the dataset lacks it) |
| MAP-07 | Kadesh | Egypt, Levant, Anatolia | `egypt_1274bc`, `hittite_1274bc` (Anatolia + northern Syria). Marker + battle icon: Kadesh |
| MAP-08 | Bronze Age collapse | Eastern Mediterranean | Coastal city markers: Ugarit, Hattusa, Mycenae, Knossos. Sea Peoples arrows from the Aegean toward the delta |
| MAP-09 | Kushite pharaohs | Nile valley to Napata | `kush_750bc` (around Napata), then `kush_25th_dynasty` (Kush + all of Egypt). Marker: Napata |
| MAP-10 | Persian Empire | Egypt to the Indus | historical-basemaps `world_bc500` Achaemenid Empire; Egypt highlighted inside it |
| MAP-11 | After Alexander | Greece to Persia | historical-basemaps `world_bc323` / `world_bc200`: Ptolemaic, Seleucid, Macedonian kingdoms. Marker: Alexandria |
| MAP-12 | Roman Egypt | Whole Mediterranean | historical-basemaps `world_bc1` Roman Empire. Trade line Alexandria to Rome (Ostia) with ship dots |
| MAP-13 | Byzantium vs Persia | Egypt to Persia | historical-basemaps `world_600`: Eastern Roman Empire, Sasanian Empire, Arabia |
| MAP-14 | Arab conquest | Delta and Sinai | Arrow from Sinai (El Arish) via Pelusium to Babylon. Markers: Babylon fortress (Old Cairo), Alexandria, Fustat |
| MAP-15 | Mamluk Sultanate | Egypt, Levant, Syria | `mamluk_1260` (historical-basemaps `world_1279` Mamluks), Mongol Ilkhanate in the north east. Markers: Ain Jalut (battle), Acre (cross), Cairo |
| MAP-16 | Ottoman conquest | Anatolia to Egypt | historical-basemaps `world_1492` Ottoman Empire, then `world_1530` Ottoman Empire including Egypt |
| MAP-17 | Muhammad Ali's wars | Sudan to Anatolia | `egypt_1811`, then hand-made growth: Sudan (1820s), Hejaz in western Arabia (1810s), Syria (1831 to 1840). Arrow toward Constantinople. Hejaz and Syria fade at 1840 |
| MAP-18 | Suez Canal | Europe, Africa, India | Route lines: London to Bombay around the Cape of Good Hope (dashed), London to Bombay through Suez (solid). Marker: Suez |
| MAP-19 | Suez Crisis | Sinai and canal | Arrows: Israel into Sinai, British and French landing at Port Said. Canal line |
| MAP-20 | United Arab Republic | Egypt and Syria | Modern borders of Egypt and Syria, joined color, label UNITED ARAB REPUBLIC |
| MAP-21 | Six-Day War | Sinai, Gaza, Israel | `sinai_1967` + Gaza turn Israeli color (modern borders, 1967 lines) |
| MAP-22 | October War | Suez Canal | Canal line, Bar Lev line on the east bank, crossing arrows west to east |
| MAP-23 | Egypt today | Nile basin and Red Sea | Modern Egypt, Sudan, Ethiopia. Blue Nile and White Nile lines. Marker: Grand Ethiopian Renaissance Dam. Shipping line Red Sea to Suez, red flash near Bab el-Mandeb |

## Asset checklist

Every item must be used in the listed scene(s). Missing or wrong use = build fails.

| Asset | Description | Scene(s) |
|---|---|---|
| 001 | Cleopatra with the ancient pyramids | S01 |
| 002 | Farmers on the flooded Nile | S03 |
| 003 | Narmer with the two crowns | S05 |
| 004 | Building the Step Pyramid | S07 |
| 005 | The Great Pyramid finished | S08 |
| 006 | The pyramid builders | S09 |
| 007 | Drought on the Nile | S10 |
| 008 | Ahmose's chariots | S13 |
| 009 | Hatshepsut's expedition to Punt | S14 |
| 010 | Akhenaten and the Aten | S16 |
| 011 | Opening Tutankhamun's tomb | S17, S46 |
| 012 | The silver peace treaty | S19 |
| 013 | The Assyrians sack Thebes | S22 |
| 014 | Alexander in Egypt | S24 |
| 015 | The Lighthouse of Alexandria | S26 |
| 016 | The Battle of Actium | S27 |
| 017 | A Coptic monastery | S29 |
| 018 | Fatimid Cairo is born | S32 |
| 019 | Saladin before Jerusalem | S33 |
| 020 | A king captured | S34 |
| 021 | Plague in Cairo | S36 |
| 022 | The Battle of the Pyramids | S38 |
| 023 | The Rosetta Stone | S39 |
| 024 | Muhammad Ali | S40 |
| 025 | The closed gate at the Citadel | S41 |
| 026 | British troops in Egypt | S44 |
| 027 | The 1919 revolution | S45 |
| 028 | The Free Officers | S47 |
| 029 | The Aswan High Dam | S50 |
| 030 | The peace treaty | S53 |
| 031 | The reviewing stand | S54 |
| 032 | Tahrir Square 2011 | S55 |
| 033 | Cairo at dusk | S56 |
| 034 | The Grand Egyptian Museum | S58 |
| MAP-01 | Egypt today | S02 |
| MAP-02 | Two kingdoms | S04 |
| MAP-03 | Old Kingdom | S06 |
| MAP-04 | Reunification | S11 |
| MAP-05 | Hyksos | S12 |
| MAP-06 | New Kingdom empire | S15 |
| MAP-07 | Kadesh | S18 |
| MAP-08 | Bronze Age collapse | S20 |
| MAP-09 | Kushite pharaohs | S21 |
| MAP-10 | Persian Empire | S23 |
| MAP-11 | After Alexander | S25 |
| MAP-12 | Roman Egypt | S28 |
| MAP-13 | Byzantium vs Persia | S30 |
| MAP-14 | Arab conquest | S31 |
| MAP-15 | Mamluk Sultanate | S35 |
| MAP-16 | Ottoman conquest | S37 |
| MAP-17 | Muhammad Ali's wars | S42 |
| MAP-18 | Suez Canal | S43 |
| MAP-19 | Suez Crisis | S48 |
| MAP-20 | United Arab Republic | S49 |
| MAP-21 | Six-Day War | S51 |
| MAP-22 | October War | S52 |
| MAP-23 | Egypt today | S57 |
