// Creates a new video folder from videos/_template: `npm run new <slug>`
import fs from "node:fs";
import path from "node:path";

const slug = process.argv[2];
if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
  console.error("Usage: npm run new <slug>   (lowercase, digits and dashes, e.g. viking-age)");
  process.exit(1);
}
const dest = path.join("videos", slug);
if (fs.existsSync(dest)) {
  console.error(`${dest} already exists`);
  process.exit(1);
}
fs.cpSync(path.join("videos", "_template"), dest, { recursive: true });
for (const d of ["public/images", "public/audio", "data"]) fs.mkdirSync(path.join(dest, d), { recursive: true });
console.log(`Created ${dest}. Next: fill DRAAIBOEK.md, put images in public/images and voiceover.mp3 in public/audio.`);
