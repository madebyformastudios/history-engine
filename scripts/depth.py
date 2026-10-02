#!/usr/bin/env python3
"""
Depth layers for 2.5D parallax (engine/components/DepthImage.tsx).

For every image (or the numbers given) it estimates a depth map with Depth Anything V2 (small, ONNX, runs on CPU),
separates the figures and objects that stand in front from the background and paints them out of it:
  public/layers/NNN_0.webp  background with the front objects painted out (inpainted)
  public/layers/NNN_1.webp  front objects, transparent elsewhere
The ground plane is not cut out: depth is compared with the typical depth of the same image row,
so only things that stand up out of the ground become the front layer.
Depth maps are kept in public/layers/NNN_depth.png so a wrong split can be checked by eye.

Usage:  npm run depth <slug> [001 002 ...] [--fg=0.22]
        (fg = at most this share of the picture becomes the front layer)
Needs:  pip install -r scripts/requirements.txt   (onnxruntime, opencv-python-headless, numpy, pillow)
"""
import os, sys, glob, urllib.request
import numpy as np
import cv2
from PIL import Image
import onnxruntime as ort

VIDEO = os.environ.get("VIDEO")
if not VIDEO:
    sys.exit("No video selected. Use: npm run depth <slug>")
ROOT = os.path.join("videos", VIDEO, "public")
OUT = os.path.join(ROOT, "layers")
MODEL_DIR = "models"  # not committed
MODEL = os.path.join(MODEL_DIR, "depth_anything_v2_small.onnx")
MODEL_URL = "https://huggingface.co/onnx-community/depth-anything-v2-small/resolve/main/onnx/model.onnx"
LAYER_W = 2400  # layer width in px (enough for a 1.3x zoom at 1080p)

args = [a for a in sys.argv[1:] if not a.startswith("--")]
opts = dict(a[2:].split("=") for a in sys.argv[1:] if a.startswith("--") and "=" in a)
FG = float(opts.get("fg", 0.22))


def model():
    if not os.path.exists(MODEL):
        os.makedirs(MODEL_DIR, exist_ok=True)
        print("downloading depth model (~100 MB) ...")
        urllib.request.urlretrieve(MODEL_URL, MODEL)
    return ort.InferenceSession(MODEL, providers=["CPUExecutionProvider"])


def depth_map(sess, rgb):
    h, w = rgb.shape[:2]
    H = 518
    W = int(round(H * w / h / 14)) * 14
    x = cv2.resize(rgb, (W, H), interpolation=cv2.INTER_CUBIC).astype(np.float32) / 255.0
    x = (x - np.array([0.485, 0.456, 0.406], np.float32)) / np.array([0.229, 0.224, 0.225], np.float32)
    x = x.transpose(2, 0, 1)[None]
    d = sess.run(None, {sess.get_inputs()[0].name: x})[0][0]
    d = cv2.resize(d, (w, h), interpolation=cv2.INTER_CUBIC)
    d = (d - d.min()) / max(1e-6, d.max() - d.min())  # 1 = near
    return cv2.bilateralFilter(d.astype(np.float32), 9, 0.1, 9)


def clean(mask, w):
    """Remove specks, close small holes, return a soft (feathered) alpha 0..1."""
    k = max(3, w // 400)
    m = cv2.morphologyEx(mask.astype(np.uint8), cv2.MORPH_OPEN, np.ones((k, k), np.uint8))
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((k * 3, k * 3), np.uint8))
    n, lab, stats, _ = cv2.connectedComponentsWithStats(m)
    keep = np.zeros_like(m)
    for i in range(1, n):
        if stats[i, cv2.CC_STAT_AREA] > m.size * 0.002:
            keep[lab == i] = 1
    soft = cv2.GaussianBlur(keep.astype(np.float32), (0, 0), max(1.5, w / 900))
    return keep, soft


def paint_out(rgb, mask, w):
    """Inpaint the masked area (grown a little) on a small copy, then paste the fill back."""
    grow = cv2.dilate(mask.astype(np.uint8), np.ones((w // 120 + 3, w // 120 + 3), np.uint8))
    s = 4
    small = cv2.resize(rgb, (rgb.shape[1] // s, rgb.shape[0] // s), interpolation=cv2.INTER_AREA)
    msmall = cv2.resize(grow, (small.shape[1], small.shape[0]), interpolation=cv2.INTER_NEAREST)
    filled = cv2.inpaint(small, msmall * 255, 12, cv2.INPAINT_TELEA)
    filled = cv2.resize(filled, (rgb.shape[1], rgb.shape[0]), interpolation=cv2.INTER_CUBIC)
    a = cv2.GaussianBlur(grow.astype(np.float32), (0, 0), 3)[..., None]
    return (rgb * (1 - a) + filled * a).astype(np.uint8)


def main():
    files = sorted(glob.glob(os.path.join(ROOT, "images", "*.jpg")))
    if args:
        files = [f for f in files if os.path.basename(f).split(".")[0] in args]
    os.makedirs(OUT, exist_ok=True)
    sess = model()
    for f in files:
        name = os.path.basename(f).split(".")[0]
        img = Image.open(f).convert("RGB")
        if img.width > LAYER_W:
            img = img.resize((LAYER_W, round(img.height * LAYER_W / img.width)), Image.LANCZOS)
        rgb = np.array(img)
        w = rgb.shape[1]
        d = depth_map(sess, rgb)
        # how far each pixel stands out from the typical depth of its row (removes the ground plane)
        base = np.quantile(d, 0.35, axis=1, keepdims=True)
        rel = cv2.GaussianBlur(d - base, (0, 0), 2)
        thr = max(0.06, float(np.quantile(rel, 1 - FG)))
        fg, fg_a = clean(rel >= thr, w)
        bg = paint_out(rgb, fg, w)
        Image.fromarray(bg).save(os.path.join(OUT, f"{name}_0.webp"), quality=86)
        Image.fromarray(np.dstack([rgb, (fg_a * 255).astype(np.uint8)])).save(os.path.join(OUT, f"{name}_1.webp"), quality=86)
        Image.fromarray((np.clip(rel / max(thr * 2, 1e-3), 0, 1) * 255).astype(np.uint8)).resize((w // 3, rgb.shape[0] // 3)).save(os.path.join(OUT, f"{name}_depth.png"))
        print(f"{name}: layers written (front objects {fg.mean():.0%} of the picture)")


main()
