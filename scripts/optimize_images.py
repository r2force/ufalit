"""Create optional WebP previews of large published images; never modify originals.

Run with Pillow installed after building a preview: --site /tmp/ufalit-seo-preview.
The normal renderer and CI do not require Pillow; generated assets are committed.
"""

import argparse
import json
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from urllib.parse import unquote, urlsplit

from PIL import Image, ImageOps

from audit_seo import Page
from render_site import atlas_preview

ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / "site"


def optimize(path):
    if not path.is_file() or path.stat().st_size < 120000 or path.suffix.lower() not in {".jpg", ".jpeg", ".png"}:
        return 0
    with Image.open(path) as original:
        image = ImageOps.exif_transpose(original).convert("RGB")
        for width in (400, 1000):
            output = SITE / "assets/optimized" / path.relative_to(SITE / "assets")
            output = output.with_name(output.name + f".{width}.webp")
            output.parent.mkdir(parents=True, exist_ok=True)
            preview = image.copy()
            preview.thumbnail((width, width * 4), Image.Resampling.LANCZOS)
            preview.save(output, "WEBP", quality=82, method=6)
    return 1


def optimize_atlas():
    places = json.loads((ROOT / "templates" / "atlas-places.json").read_text(encoding="utf-8"))
    for source in sorted({place["image"] for place in places}):
        with Image.open(SITE / source) as original:
            image = ImageOps.exif_transpose(original).convert("RGB")
            marker = ImageOps.fit(image, (128, 128), Image.Resampling.LANCZOS)
            image.thumbnail((640, 640), Image.Resampling.LANCZOS)
            for size, preview, quality in ((128, marker, 75), (640, image, 81)):
                output = SITE / atlas_preview(source, size)
                output.parent.mkdir(parents=True, exist_ok=True)
                preview.save(output, "WEBP", quality=quality, method=6)
    print(f"Created marker and card previews for {len(places)} atlas places")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    mode = parser.add_mutually_exclusive_group(required=True)
    mode.add_argument("--site", type=Path, help="built HTML inventory")
    mode.add_argument("--atlas", action="store_true", help="generate atlas marker and card previews")
    args = parser.parse_args()
    if args.atlas:
        optimize_atlas()
        return
    sources = set()
    for page in args.site.rglob("*.html"):
        for image in Page(page.read_text()).images:
            src = image.get("src", "")
            parts = urlsplit(src)
            if src and not parts.scheme and not parts.netloc:
                path = (SITE / page.relative_to(args.site).parent / unquote(parts.path)).resolve()
                if path.is_relative_to(SITE / "assets"):
                    sources.add(path)
    with ThreadPoolExecutor(max_workers=4) as pool:
        count = sum(pool.map(optimize, sorted(sources)))
    print(f"Created two WebP previews for {count} large images; originals preserved")


if __name__ == "__main__":
    main()
