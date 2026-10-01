// Contact sheet of check stills: node scripts/sheet.mjs out.jpg a.jpg b.jpg ... (2 columns, half-size stills)
import sharp from "sharp";
const [out, ...files] = process.argv.slice(2);
const comps = files.map((f, i) => ({ input: f, left: (i % 2) * 965, top: Math.floor(i / 2) * 545 }));
await sharp({ create: { width: 1925, height: Math.ceil(files.length / 2) * 545, channels: 3, background: "#fff" } }).composite(comps).jpeg({ quality: 80 }).toFile(out);
