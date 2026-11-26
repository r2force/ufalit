"""Create optional WebP previews of large published images; never modify originals.

Run with Pillow installed after building a preview: --site /tmp/ufalit-seo-preview.
The normal renderer and CI do not require Pillow; generated assets are committed.
"""

import argparse
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from urllib.parse import unquote, urlsplit

from PIL import Image, ImageOps

from audit_seo import Page

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


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--site", type=Path, required=True, help="built HTML inventory")
    args = parser.parse_args()
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
