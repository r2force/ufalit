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
    """Read intrinsic PNG/GIF/JPEG dimensions without an image processing dependency."""
    try:
        with path.open("rb") as stream:
            header = stream.read(24)
            if header.startswith(b"\x89PNG\r\n\x1a\n"):
                return struct.unpack(">II", header[16:24])
            if header[:6] in (b"GIF87a", b"GIF89a"):
                return struct.unpack("<HH", header[6:10])
            if header[:2] != b"\xff\xd8":
                return None
            stream.seek(2)
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
                if marker[0] in {0xC0, 0xC1, 0xC2, 0xC3, 0xC5, 0xC6, 0xC7, 0xC9, 0xCA, 0xCB, 0xCD, 0xCE, 0xCF}:
                    _, height, width = struct.unpack(">BHH", stream.read(5))
                    return width, height
                stream.seek(length - 2, 1)
    except (OSError, struct.error):
        return None


def image_dimensions(document, relative, site):
    def enrich(match):
        raw = match[0]
        attrs = dict(re.findall(r'([\w-]+)="([^"]*)"', raw))
        src = attrs.get("src", "")
        if not src or urlsplit(src).scheme or src.startswith("/"):
            return raw
        path = (site / relative.parent / unquote(urlsplit(src).path)).resolve()
        if not path.is_relative_to(site.resolve()):
            return raw
        size = image_size(path)
        if size and "width" not in attrs and "height" not in attrs:
            raw = raw[:-1] + f' width="{size[0]}" height="{size[1]}">'
        if "srcset" not in attrs and path.is_relative_to(site.resolve() / "assets"):
            asset = path.relative_to(site.resolve() / "assets")
            preview = site / "assets/optimized" / asset
            variants = [preview.with_name(preview.name + f".{width}.webp") for width in (400, 1000)]
            if all(p.is_file() for p in variants):
                prefix = "../" * (len(relative.parts) - 1)
                urls = [quote(prefix + p.relative_to(site).as_posix(), safe="/.-_~") for p in variants]
                sizes = (f'{attrs["width"]}px' if attrs.get("width", "").isdigit() and int(attrs["width"]) <= 160
                         else '(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 800px')
                candidates = {min(size[0], width): url for width, url in zip((400, 1000), urls)} if size else {400: urls[0], 1000: urls[1]}
                srcset = ", ".join(f'{escape(url, quote=True)} {width}w' for width, url in candidates.items())
                raw = raw[:-1] + (f' srcset="{srcset}"'
                                  f' sizes="{sizes}" data-preview-src="{escape(urls[1], quote=True)}">')
        if attrs.get("loading") == "lazy" and "decoding" not in attrs:
            raw = raw[:-1] + ' decoding="async">'
        return raw
    return re.sub(r"<img\b[^>]*>", enrich, document)
