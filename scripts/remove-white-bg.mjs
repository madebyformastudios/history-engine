// Removes a near-white background from cutout illustrations and saves transparent PNGs.
// Usage: node scripts/remove-white-bg.mjs [public/images/img2b.jpg ...]
// Alpha ramps softly between HARD and SOFT "whiteness" so edges have no white halo;
// edge pixels are also un-premultiplied against white so they keep their true color.
import sharp from "sharp";
import path from "node:path";

const HARD = 248; // min channel >= HARD -> fully transparent
const SOFT = 215; // min channel <= SOFT -> fully opaque
const MAX_CHROMA = 28; // only grey-ish pixels count as background (keeps pale cloth tints)
const EDGE_SOFT = 140; // in the anti-aliased ring next to the background, ramp alpha over a wider range
const EDGE_RING = 2; // px

const inputs = process.argv.slice(2);
const files = inputs.length ? inputs : ["public/images/img2b.jpg", "public/images/img3.jpg"];

for (const file of files) {
  const { data, info } = await sharp(file).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const out = Buffer.alloc(width * height * 4);

  // 1) Flood-fill from the borders so only background connected to the edge is removed
  //    (white highlights inside the figure, like a toga, stay opaque).
  const isBgLike = (i) => {
    const r = data[i * 3], g = data[i * 3 + 1], b = data[i * 3 + 2];
    const mn = Math.min(r, g, b), mx = Math.max(r, g, b);
    return mn > SOFT && mx - mn < MAX_CHROMA;
  };
  const bg = new Uint8Array(width * height);
  const stack = [];
  for (let x = 0; x < width; x++) stack.push(x, (height - 1) * width + x);
  for (let y = 0; y < height; y++) stack.push(y * width, y * width + width - 1);
  while (stack.length) {
    const i = stack.pop();
    if (bg[i] || !isBgLike(i)) continue;
    bg[i] = 1;
    const x = i % width, y = (i / width) | 0;
    if (x > 0) stack.push(i - 1);
    if (x < width - 1) stack.push(i + 1);
    if (y > 0) stack.push(i - width);
    if (y < height - 1) stack.push(i + width);
  }

  // 2) Mark an EDGE_RING-px ring of figure pixels touching the background.
  const ring = new Uint8Array(width * height);
  for (let i = 0; i < width * height; i++) {
    if (bg[i]) continue;
    const x = i % width, y = (i / width) | 0;
    outer: for (let dy = -EDGE_RING; dy <= EDGE_RING; dy++)
      for (let dx = -EDGE_RING; dx <= EDGE_RING; dx++) {
        const nx = x + dx, ny = y + dy;
        if (nx >= 0 && ny >= 0 && nx < width && ny < height && bg[ny * width + nx]) { ring[i] = 1; break outer; }
      }
  }

  // 3) Soft alpha on the background and the ring; everything else stays opaque.
  for (let i = 0; i < width * height; i++) {
    const r = data[i * 3], g = data[i * 3 + 1], b = data[i * 3 + 2];
    let a = 255;
    if (bg[i] || ring[i]) {
      const mn = Math.min(r, g, b);
      const lo = bg[i] ? SOFT : EDGE_SOFT;
      const t = Math.min(1, Math.max(0, (mn - lo) / (HARD - lo)));
      a = Math.round(255 * (1 - t * t * (3 - 2 * t))); // smoothstep
    }
    let R = r, G = g, B = b;
    if (a > 0 && a < 255) {
      // un-blend from white: c = a*fg + (1-a)*255  ->  fg = (c - (1-a)*255) / a
      const af = a / 255;
      R = Math.max(0, Math.min(255, (r - (1 - af) * 255) / af));
      G = Math.max(0, Math.min(255, (g - (1 - af) * 255) / af));
      B = Math.max(0, Math.min(255, (b - (1 - af) * 255) / af));
    }
    out[i * 4] = R; out[i * 4 + 1] = G; out[i * 4 + 2] = B; out[i * 4 + 3] = a;
  }

  const dest = path.join(path.dirname(file), path.basename(file, path.extname(file)) + ".png");
  // Feather the alpha a touch (3x3 weighted blur) so JPEG-stepped edges read smooth.
  const alpha = Buffer.alloc(width * height);
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++) {
      let sum = 0, wsum = 0;
      for (let dy = -1; dy <= 1; dy++)
        for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx, ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
          const w = dx === 0 && dy === 0 ? 4 : dx === 0 || dy === 0 ? 2 : 1;
          sum += out[(ny * width + nx) * 4 + 3] * w;
          wsum += w;
        }
      alpha[y * width + x] = Math.min(out[(y * width + x) * 4 + 3], Math.round(sum / wsum)); // only soften inward
    }
  for (let i = 0; i < width * height; i++) out[i * 4 + 3] = alpha[i];
  const raw = { raw: { width, height, channels: 4 } };

  // Crop to the visible figure (+4px) so layouts can position it precisely.
  let x0 = width, y0 = height, x1 = 0, y1 = 0;
  for (let i = 0; i < width * height; i++) {
    if (alpha[i] < 8) continue;
    const x = i % width, y = (i / width) | 0;
    if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
  }
  x0 = Math.max(0, x0 - 4); y0 = Math.max(0, y0 - 4);
  x1 = Math.min(width - 1, x1 + 4); y1 = Math.min(height - 1, y1 + 4);
  await sharp(out, raw)
    .extract({ left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 })
    .png()
    .toFile(dest);
  const meta = await sharp(dest).metadata();
  console.log(`${file} -> ${dest} (${meta.width}x${meta.height})`);
}
