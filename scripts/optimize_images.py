"""Create responsive WebP previews of published images; never modify originals.

Run with Pillow installed after building a preview: --site /tmp/ufalit-seo-preview.
The normal renderer and CI do not require Pillow; generated assets are committed.
"""

import argparse
import json
from concurrent.futures import ThreadPoolExecutor
from io import BytesIO
from pathlib import Path
from urllib.parse import unquote, urlsplit

from PIL import Image, ImageOps

from audit_seo import Page
from render_site import atlas_preview
from seo import PREVIEW_WIDTHS, preview_path

ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / "site"


def optimize(path):
    if not path.is_file() or path.suffix.lower() not in {".jpg", ".jpeg", ".png", ".gif", ".webp"}:
        return 0
    source_bytes = path.stat().st_size
    expected = set()
    if source_bytes >= 5000:
        with Image.open(path) as original:
            if not getattr(original, "is_animated", False):
                oriented = ImageOps.exif_transpose(original)
                alpha = "A" in oriented.getbands() or "transparency" in oriented.info
                expected = save_previews(path, oriented.convert("RGBA" if alpha else "RGB"), source_bytes)
    for width in PREVIEW_WIDTHS:
        if width not in expected:
            preview_path(path, SITE, width).unlink(missing_ok=True)
    return len(expected)


def save_previews(path, image, source_bytes):
    saved = set()
    dimensions = set()
    for width in PREVIEW_WIDTHS:
        preview = image.copy()
        preview.thumbnail((width, width * 4), Image.Resampling.LANCZOS)
        if preview.width in dimensions:
            continue
        dimensions.add(preview.width)
        with BytesIO() as encoded:
            preview.save(encoded, "WEBP", quality=82, method=6)
            if encoded.tell() > min(source_bytes - 800, source_bytes * .9):
                continue
            output = preview_path(path, SITE, width)
            output.parent.mkdir(parents=True, exist_ok=True)
            output.write_bytes(encoded.getbuffer())
        saved.add(width)
    return saved


def optimize_atlas():
    sources = atlas_sources()
    for source in sorted(sources):
        with Image.open(SITE / source) as original:
            image = ImageOps.exif_transpose(original).convert("RGB")
            marker = ImageOps.fit(image, (128, 128), Image.Resampling.LANCZOS)
            image.thumbnail((640, 640), Image.Resampling.LANCZOS)
            for size, preview, quality in ((128, marker, 75), (640, image, 81)):
                output = SITE / atlas_preview(source, size)
                output.parent.mkdir(parents=True, exist_ok=True)
                preview.save(output, "WEBP", quality=quality, method=6)
                optimize(output)
    print(f"Created marker and card previews for {len(sources)} atlas photos")


def atlas_sources():
    places = json.loads((ROOT / "templates" / "atlas-places.json").read_text(encoding="utf-8"))
    return {place["image"] for place in places}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    mode = parser.add_mutually_exclusive_group(required=True)
    mode.add_argument("--site", type=Path, help="built HTML inventory")
    mode.add_argument("--atlas", action="store_true", help="generate atlas marker and card previews")
    args = parser.parse_args()
    if args.atlas:
        optimize_atlas()
        return
    sources = {SITE / atlas_preview(source, size) for source in atlas_sources() for size in (128, 640)}
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
    print(f"Created {count} responsive WebP previews; originals preserved")


if __name__ == "__main__":
    main()
