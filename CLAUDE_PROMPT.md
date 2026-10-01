Build a Remotion video in THIS folder: "The Mongol Empire in 5 Minutes".
1920x1080, 30fps, TypeScript.

READ FIRST
1. DRAAIBOEK.md is the single source of truth. Follow it scene by scene. Do not invent, skip, merge or reorder scenes.
2. IMAGE_PROMPTS.md describes what each numbered image should show.
3. script.txt is the voiceover text. Each paragraph = one scene (S01, S02, ...), in order.

REUSE
Copy and reuse the components from ../roman-empire-in-60-seconds (KenBurns, Parallax, MapScene, YearCounter, Caption, Overlay, Transitions). Improve them where needed, but keep them generic.

STEP 1: ASSETS
- Images are in public/images/. They should be named 001.jpg to 026.jpg.
- If files are not named like that (e.g. long names from Google Flow), look at each image and match it to the number in IMAGE_PROMPTS.md. Use the number in the filename if it is there; otherwise match on content. Rename them to NNN.jpg.
- Print a mapping table (original filename, new name, what you see in the image) BEFORE building anything. If an image is missing or you are unsure about a match, stop and ask me.
- Cutout 012 has a white background: make it a transparent PNG (012.png) with sharp, no white halo.
- Voiceover: public/audio/voiceover.mp3.

STEP 2: TIMINGS FROM THE VOICEOVER
- Transcribe public/audio/voiceover.mp3 with @remotion/install-whisper-cpp (word-level timestamps). Save to src/data/transcript.json.
- Align every scene's VO text to the transcript: a scene starts at its first word and ends where the next scene starts. Save to src/data/timings.json.
- Note: the voiceover was generated from script_elevenlabs.txt, which spells years out ("twelve oh six" = 1206) and uses phonetic names (Temoojin = Temujin, Jamooka = Jamukha, Borteh = Borte, Western Shyah = Western Xia, Jong-doo = Zhongdu, Kwarazmian = Khwarazmian, Jebbeh = Jebe, Soobootai = Subutai, Ogeday = Ogedei, Keev = Kyiv, Hoolegoo = Hulegu, Ayn Jaloot = Ain Jalut). Match fuzzily and phonetically. Captions on screen must use the correct spelling from DRAAIBOEK.md, not the phonetic one.
- Resolve every CUE in the runbook (@"word") to a frame using the word timestamps. If a cue word cannot be found, use the closest match and list it in the report.
- Total duration = voiceover length + 1.5 seconds for the fade to black.

STEP 3: BUILD
- src/data/scenes.json: one entry per scene with id, asset(s), type, motion, cues (resolved to frames), labels.
- Implement MAP-01 to MAP-10 and GFX-01 exactly as defined in the runbook.
- Captions: word-by-word from the transcript.
- Play the voiceover from frame 0.

STEP 4: VERIFY (required, do not skip)
- Write scripts/validate.ts that checks: every asset in the runbook's asset checklist is used in the right scene(s), every referenced file exists, no image is used in a scene where the runbook does not list it, and scenes are in the right order with no gaps or overlaps. Run it and fix all errors.
- Render one still per scene (middle frame) with `npx remotion still` into checks/, look at each still, and compare it with the runbook. Fix anything that does not match.
- Write BUILD_REPORT.md: the asset mapping table, a table of scene id / start / end / asset, unresolved cues, faked map polygons, and anything you could not do.

DELIVERABLES
- `npx remotion studio` to preview, `npx remotion render` to output out/video.mp4
- BUILD_REPORT.md
