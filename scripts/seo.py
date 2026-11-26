"""Shared, dependency-free SEO helpers for the static publisher."""

import json
import re
import struct
from functools import lru_cache
from html import escape
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlsplit, unquote, quote
from xml.etree import ElementTree as ET

SITE_URL = "https://ufalit.ufacsdb.ru/"
DEFAULT_IMAGE = "assets/places/aksakov/image003.jpg"
SITEMAP_NS = "http://www.sitemaps.org/schemas/sitemap/0.9"
PREVIEW_WIDTHS = (80, 160, 256, 400, 640, 1000)


def page_url(relative):
    return urljoin(SITE_URL, str(relative).removesuffix("index.html"))


def absolute_url(value, relative=Path("index.html")):
    return urljoin(page_url(relative), value)


def canonical_url(page, relative):
    value = absolute_url(page.get("canonical", page.get("redirect", page_url(relative))), relative)
    value = value.removesuffix("index.html")
    parts = urlsplit(value)
    if not value.startswith(SITE_URL) or parts.query or parts.fragment:
        raise ValueError(f"canonical must be a clean URL on {SITE_URL}: {value}")
    return value


def is_indexable(page, relative):
    return (not page.get("redirect") and "noindex" not in page.get("robots", "").lower()
            and canonical_url(page, relative) == page_url(relative))


class PlainText(HTMLParser):
    def __init__(self, source):
        super().__init__(convert_charrefs=True)
        self.parts = []
        self.ignored = 0
        self.feed(source)

    def handle_starttag(self, tag, attrs):
        if tag in {"script", "style", "template"}:
            self.ignored += 1
        if not self.ignored:
            self.parts.append(" ")

    def handle_endtag(self, tag):
        if tag in {"script", "style", "template"}:
            self.ignored = max(0, self.ignored - 1)
        if not self.ignored:
            self.parts.append(" ")

    def handle_data(self, data):
        if not self.ignored:
            self.parts.append(data)

    def text(self):
        return re.sub(r"\s+", " ", "".join(self.parts)).strip()


def seo_head(page, relative, content):
    title = page["title"]
    description = page.get("description", "").strip()
    if not description:
        paragraphs = re.findall(r"<p\b[^>]*>(.*?)</p>", content, re.S)
        description = next((PlainText(p).text() for p in paragraphs if len(PlainText(p).text()) >= 70), "")[:200]
    if not description:
        raise ValueError("description needs an editorial description or a meaningful paragraph")
    canonical = canonical_url(page, relative)
    image = urljoin(SITE_URL, page.get("og_image", DEFAULT_IMAGE))
    rows = [
        f'<meta name="description" content="{escape(description, quote=True)}">',
        f'<link rel="canonical" href="{escape(canonical, quote=True)}">',
    ]
    for key, value in {"title": title, "description": description, "type": page.get("og_type", "website"),
                       "url": canonical, "image": image, "locale": "ru_RU", "site_name": "Уфа литературная"}.items():
        rows.append(f'<meta property="og:{key}" content="{escape(value, quote=True)}">')
    for key, value in {"card": "summary_large_image", "title": title, "description": description, "image": image}.items():
        rows.append(f'<meta name="twitter:{key}" content="{escape(value, quote=True)}">')
    if page.get("robots"):
        rows.append(f'<meta name="robots" content="{escape(page["robots"], quote=True)}">')
    graph = [{"@type": page.get("schema_type", "WebPage"), "@id": canonical + "#webpage", "url": canonical,
              "name": title, "description": description, "inLanguage": "ru",
              "isPartOf": {"@id": SITE_URL + "#website"}}]
    if relative == Path("index.html"):
        graph.append({"@type": "WebSite", "@id": SITE_URL + "#website", "url": SITE_URL,
                      "name": "Уфа литературная", "inLanguage": "ru"})
    crumbs = page.get("breadcrumbs", [])
    if crumbs:
        items = [{"@type": "ListItem", "position": 1, "name": "Уфа литературная", "item": SITE_URL}]
        for number, crumb in enumerate(crumbs, 2):
            items.append({"@type": "ListItem", "position": number,
                          "name": crumb if isinstance(crumb, str) else crumb["label"],
                          "item": canonical if isinstance(crumb, str) else absolute_url(crumb["href"], relative)})
        graph.append({"@type": "BreadcrumbList", "@id": canonical + "#breadcrumbs", "itemListElement": items})
        graph[0]["breadcrumb"] = {"@id": canonical + "#breadcrumbs"}
    payload = json.dumps({"@context": "https://schema.org", "@graph": graph}, ensure_ascii=False).replace("<", "\\u003c")
    rows.append(f'<script type="application/ld+json">{payload}</script>')
    return "\n".join(rows)


def write_sitemap(destination, pages):
    ET.register_namespace("", SITEMAP_NS)
    root = ET.Element(f"{{{SITEMAP_NS}}}urlset")
    seen = set()
    for relative, page in pages.items():
        if not is_indexable(page, relative):
            continue
        url = canonical_url(page, relative)
        if url in seen or not (destination / relative).is_file():
            raise ValueError(f"duplicate or missing sitemap page: {url}")
        seen.add(url)
        node = ET.SubElement(root, f"{{{SITEMAP_NS}}}url")
        ET.SubElement(node, f"{{{SITEMAP_NS}}}loc").text = url
    ET.indent(root)
    ET.ElementTree(root).write(destination / "sitemap.xml", encoding="utf-8", xml_declaration=True)


@lru_cache(maxsize=None)
def image_size(path):
    """Read intrinsic PNG/GIF/JPEG/WebP dimensions without an image processing dependency."""
    try:
        with path.open("rb") as stream:
            header = stream.read(30)
            if header.startswith(b"\x89PNG\r\n\x1a\n"):
                return struct.unpack(">II", header[16:24])
            if header[:6] in (b"GIF87a", b"GIF89a"):
                return struct.unpack("<HH", header[6:10])
            if header.startswith(b"RIFF") and header[8:12] == b"WEBP" and len(header) == 30:
                if header[12:16] == b"VP8X":
                    return 1 + int.from_bytes(header[24:27], "little"), 1 + int.from_bytes(header[27:30], "little")
                if header[12:16] == b"VP8L" and header[20] == 0x2F:
                    packed = int.from_bytes(header[21:25], "little")
                    return 1 + (packed & 0x3FFF), 1 + ((packed >> 14) & 0x3FFF)
                if header[12:16] == b"VP8 " and header[23:26] == b"\x9d\x01\x2a":
                    width, height = struct.unpack("<HH", header[26:30])
                    return width & 0x3FFF, height & 0x3FFF
            if header[:2] != b"\xff\xd8":
                return None
            stream.seek(2)
            orientation = 1
            while True:
                byte = stream.read(1)
                if not byte:
                    return None
                if byte != b"\xff":
                    continue
                marker = stream.read(1)
                while marker == b"\xff":
                    marker = stream.read(1)
                if not marker or marker in (b"\xd9", b"\xda"):
                    return None
                if marker[0] in (0x01, *range(0xD0, 0xD9)):
                    continue
                length = struct.unpack(">H", stream.read(2))[0]
                if length < 2:
                    return None
                if marker[0] in {0xC0, 0xC1, 0xC2, 0xC3, 0xC5, 0xC6, 0xC7, 0xC9, 0xCA, 0xCB, 0xCD, 0xCE, 0xCF}:
                    _, height, width = struct.unpack(">BHH", stream.read(5))
                    return (height, width) if orientation in (5, 6, 7, 8) else (width, height)
                if marker == b"\xe1":
                    orientation = exif_orientation(stream.read(length - 2)) or orientation
                else:
                    stream.seek(length - 2, 1)
    except (OSError, struct.error):
        return None


def exif_orientation(segment):
    if not segment.startswith(b"Exif\0\0"):
        return None
    tiff = segment[6:]
    endian = {b"II": "<", b"MM": ">"}.get(tiff[:2])
    if endian is None:
        return None
    try:
        magic, directory = struct.unpack_from(f"{endian}HI", tiff, 2)
        if magic != 42:
            return None
        (count,) = struct.unpack_from(f"{endian}H", tiff, directory)
        for offset in range(directory + 2, directory + 2 + count * 12, 12):
            tag, kind, values = struct.unpack_from(f"{endian}HHI", tiff, offset)
            if (tag, kind, values) == (0x112, 3, 1):
                return struct.unpack_from(f"{endian}H", tiff, offset + 8)[0]
    except struct.error:
        return None
    return None


def preview_path(path, site, width):
    asset = path.relative_to(site / "assets")
    return site / "assets" / "optimized" / asset.with_name(f"{asset.name}.{width}.webp")


def responsive_previews(path, relative, site):
    """Return HTML srcset candidates and the smallest preview for thumbnails."""
    if not path.is_relative_to(site / "assets"):
        return "", ""
    prefix = "../" * (len(relative.parts) - 1)

    def url(asset):
        return quote(prefix + asset.relative_to(site).as_posix(), safe="/.-_~")

    candidates = {}
    for width in PREVIEW_WIDTHS:
        preview = preview_path(path, site, width)
        if size := image_size(preview):
            candidates.setdefault(size[0], url(preview))
    if not candidates:
        return "", ""
    thumbnail = candidates[min(candidates)]
    if (size := image_size(path)) and size[0] <= PREVIEW_WIDTHS[-1]:
        candidates.setdefault(size[0], url(path))
    return ", ".join(f"{candidates[width]} {width}w" for width in sorted(candidates)), thumbnail


def image_dimensions(document, relative, site):
    site = site.resolve()

    def enrich(match):
        raw = match[0]
        attrs = dict(re.findall(r'([\w-]+)="([^"]*)"', raw))
        src = attrs.get("src", "")
        parts = urlsplit(src)
        if not src or parts.scheme or src.startswith("/"):
            return raw
        path = (site / relative.parent / unquote(parts.path)).resolve()
        if not path.is_relative_to(site):
            return raw
        size = image_size(path)
        if size and "width" not in attrs and "height" not in attrs:
            raw = raw[:-1] + f' width="{size[0]}" height="{size[1]}">'
        if "srcset" not in attrs:
            srcset, thumbnail = responsive_previews(path, relative, site)
            if srcset:
                width = attrs.get("width", "")
                fallback = (f"{width}px" if width.isdigit() and int(width) <= 160
                            else "(max-width: 40rem) calc(100vw - 3rem), min(40rem, 55vw)")
                sizes = attrs.get("sizes") or fallback
                if attrs.get("loading") == "lazy" and size:
                    if sizes.partition(",")[0].lower() != "auto":
                        sizes = f"auto, {sizes}"
                    # Auto sizes activates size containment. Use the image's own
                    # dimensions for intrinsic layouts instead of the 300×150 default.
                    style = attrs.get("style", "").rstrip(" ;")
                    intrinsic = f"contain-intrinsic-size: {size[0]}px {size[1]}px"
                    if "style" in attrs:
                        raw = re.sub(r'\s+style="[^"]*"', "", raw, count=1)
                    style = f"{style}; {intrinsic}" if style else intrinsic
                    raw = raw[:-1] + f' style="{escape(style)}">'
                if "sizes" in attrs:
                    raw = re.sub(r'\s+sizes="[^"]*"', "", raw, count=1)
                raw = raw[:-1] + (f' srcset="{escape(srcset)}" sizes="{escape(sizes)}"'
                                  f' data-preview-src="{escape(thumbnail)}">')
        if attrs.get("loading") == "lazy" and "decoding" not in attrs:
            raw = raw[:-1] + ' decoding="async">'
        return raw
    return re.sub(r"<img\b[^>]*>", enrich, document)
