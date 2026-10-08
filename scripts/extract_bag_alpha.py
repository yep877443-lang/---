from pathlib import Path
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFilter


def smoothstep(values: np.ndarray, low: float, high: float) -> np.ndarray:
    scaled = np.clip((values - low) / (high - low), 0.0, 1.0)
    return scaled * scaled * (3.0 - 2.0 * scaled)


def extract(source: Path, destination: Path, bottom_cut: int) -> None:
    image = Image.open(source).convert("RGB")
    rgb = np.asarray(image, dtype=np.float32)
    red, green, blue = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    maximum = rgb.max(axis=2)

    # The photographed subject is strongly berry-magenta against an almost-black
    # set. Red dominance gives a much cleaner matte than luminance alone and keeps
    # the genuinely dark leather folds.
    magenta = red - np.maximum(green, blue)
    chroma_alpha = smoothstep(magenta, 2.0, 22.0)
    visible_alpha = smoothstep(maximum, 4.0, 34.0)
    alpha = np.maximum(chroma_alpha, visible_alpha * smoothstep(magenta, 0.0, 8.0))

    # Keep the neutral silver eyelets only when they sit directly beside the
    # already-detected leather, so no neutral studio pixels are introduced.
    leather_seed = Image.fromarray((chroma_alpha * 255).astype(np.uint8), "L")
    nearby = np.asarray(leather_seed.filter(ImageFilter.MaxFilter(31)), dtype=np.float32) / 255.0
    neutral_bright = smoothstep(maximum, 42.0, 120.0) * nearby
    dark_leather = smoothstep(maximum, 3.0, 18.0) * nearby
    alpha = np.maximum(alpha, np.maximum(neutral_bright, dark_leather))

    # The deepest creases on the right side are close to black. A conservative
    # inset polygon marks the unquestionable front panel as solid leather while
    # leaving the open mouth and handle gaps transparent.
    core = Image.new("L", image.size, 0)
    draw = ImageDraw.Draw(core)
    points = [(319, 401), (1216, 401), (1207, 899), (329, 899)]
    draw.polygon(points, fill=255)
    core_array = np.asarray(core, dtype=np.float32) / 255.0
    alpha = np.maximum(alpha, core_array)

    # Remove the photographed floor/reflection below the physical bag. Feathering
    # the last pixels avoids a clipped-looking base edge.
    height = image.height
    rows = np.arange(height, dtype=np.float32)[:, None]
    floor_gate = np.clip((bottom_cut - rows) / 4.0, 0.0, 1.0)
    alpha *= floor_gate

    alpha_img = Image.fromarray((np.clip(alpha, 0.0, 1.0) * 255).astype(np.uint8), "L")
    alpha_img = alpha_img.filter(ImageFilter.GaussianBlur(0.65))
    alpha_array = np.asarray(alpha_img, dtype=np.float32) / 255.0

    # The source was composited over black. Un-premultiplying the soft edge colors
    # prevents a dark fringe once the cutout sits on the site's textured backdrop.
    corrected = rgb.copy()
    edge = (alpha_array > 0.035) & (alpha_array < 0.97)
    scale = np.ones_like(alpha_array)
    scale[edge] = np.minimum(1.0 / np.maximum(alpha_array[edge], 0.14), 2.6)
    corrected *= scale[..., None]
    corrected = np.clip(corrected, 0, 255).astype(np.uint8)

    rgba = np.dstack([corrected, np.asarray(alpha_img, dtype=np.uint8)])
    destination.parent.mkdir(parents=True, exist_ok=True)
    Image.fromarray(rgba, "RGBA").save(destination, optimize=True)


if __name__ == "__main__":
    if len(sys.argv) != 4:
        raise SystemExit("usage: extract_bag_alpha.py SOURCE DESTINATION BOTTOM_CUT")
    extract(Path(sys.argv[1]), Path(sys.argv[2]), int(sys.argv[3]))
