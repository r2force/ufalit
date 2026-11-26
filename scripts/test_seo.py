"""Validate the actual built site, links, metadata, JSON-LD and sitemap."""

import argparse
from collections import Counter
import json
from pathlib import Path
import re
from urllib.parse import urljoin, urlsplit, unquote
from xml.etree import ElementTree as ET

from audit_seo import Page
from seo import SITE_URL, SITEMAP_NS


def check(site):
    site = site.resolve()
    pages = {p.relative_to(site): Page(p.read_text()) for p in site.rglob("*.html")}
    errors = []
    exclusions = json.loads((Path(__file__).resolve().parents[1] / "templates/seo-exclusions.json").read_text())
    expected = set()
    titles, descriptions = [], []
    for relative, page in pages.items():
        def require(condition, message):
            if not condition: errors.append(f"{relative}: {message}")
        url = SITE_URL + relative.as_posix().removesuffix("index.html")
        redirected = bool(re.search(r'<meta\b[^>]*http-equiv="refresh"', page.raw, re.I))
        noindex = "noindex" in page.meta.get("robots", "").lower()
        require(page.canonicals and len(page.canonicals) == 1, "exactly one canonical required")
        canonical = page.canonicals[0] if page.canonicals else ""
        exception = exclusions.get(relative.as_posix(), {})
        require(canonical.startswith(SITE_URL) and not urlsplit(canonical).query and not urlsplit(canonical).fragment,
                "canonical must use primary HTTPS host without query/fragment")
        require(redirected or canonical == url or canonical == exception.get("canonical"), "unexpected alternate canonical")
        if not redirected and not noindex and canonical == url:
            expected.add(url)
            require(bool(page.title.strip()), "empty title")
            description = page.meta.get("description", "")
            require(len(description.strip()) >= 60, "missing or uninformative description")
            titles.append(page.title)
            descriptions.append(description)
            require(sum(h["level"] == 1 for h in page.headings) == 1, "exactly one main H1 required")
            previous_level = 0
            for heading in page.headings:
                require(heading["level"] <= previous_level + 1, f"skipped heading level: {heading['text']}")
                previous_level = heading["level"]
            require(len(" ".join(page.text).strip()) > 80, "main content must exist without JavaScript")
        elif not redirected and not noindex:
            require(canonical != SITE_URL or relative == Path("index.html"), "nested page canonical points to home")
        require(not noindex or redirected or bool(exception.get("reason")),
                "unexpected noindex: document reason in templates/seo-exclusions.json")
        for name in ["og:title", "og:description", "og:type", "og:url", "og:image", "twitter:card", "twitter:title", "twitter:description", "twitter:image"]:
            require(bool(page.meta.get(name)), f"missing {name}")
        require(page.meta.get("og:url") == canonical, "OG URL and canonical differ")
        require(page.meta.get("og:title") == page.title, "OG title and title differ")
        require(page.meta.get("og:description") == page.meta.get("description"), "OG description differs")
        require(bool(page.jsonld), "missing JSON-LD")
        for raw in page.jsonld:
            try:
                data = json.loads(raw)
                require(data.get("@context") == "https://schema.org", "wrong JSON-LD context")
                for entity in data.get("@graph", []):
                    require(bool(entity.get("@type")), "JSON-LD entity missing type")
                    if entity.get("@type") == "BreadcrumbList":
                        items = entity["itemListElement"]
                        require([i["position"] for i in items] == list(range(1, len(items)+1)), "breadcrumb positions")
                        require(all(i["item"].startswith(SITE_URL) for i in items), "breadcrumb host")
            except (ValueError, TypeError, KeyError) as exc: require(False, f"invalid JSON-LD: {exc}")
        require(not [x for x,c in Counter(page.ids).items() if c > 1], "duplicate HTML IDs")
        require(not re.search(r'\$(?:seo_head|metrika|text_places)\b', page.raw), "unexpanded SEO placeholder")
        require(page.raw.count("ym(110934501,'init'") == 1, "Metrika must initialize once")
        require(page.raw.count('https://mc.yandex.ru/watch/110934501') == 1, "Metrika noscript beacon")
        for image in page.images:
            require("alt" in image, f"missing alt: {image.get('src')}")
            require(image.get("alt", "").strip().lower() not in {"фото", "фотография", "image", "img"},
                    f"generic alt: {image.get('src')}")
        responsive = [{"url": candidate.strip().split()[0], "attribute": "srcset"}
                      for image in page.images for candidate in image.get("srcset", "").split(",") if candidate.strip()]
        for link in page.links + responsive + [{"url": page.meta.get("og:image", ""), "attribute": "src"}]:
            value = link["url"]
            parsed = urlsplit(value)
            if parsed.scheme and parsed.scheme not in ("http", "https"): continue
            target = urlsplit(urljoin(url, value))
            if target.netloc != urlsplit(SITE_URL).netloc: continue
            local = unquote(target.path).removeprefix(urlsplit(SITE_URL).path).lstrip("/")
            path = site / local
            if target.path.endswith("/") or path.is_dir(): path = path / "index.html"
            require(path.is_relative_to(site) and path.is_file(), f"broken internal URL: {value}")
            fragment = unquote(target.fragment).split(":~:text=", 1)[0]
            if fragment and path.suffix == ".html" and path.relative_to(site) in pages:
                require(fragment in pages[path.relative_to(site)].ids, f"missing anchor: {value}")
    for name, values in [("title", titles), ("description", descriptions)]:
        duplicates = [v for v,n in Counter(values).items() if n > 1]
        if duplicates: errors.append(f"Duplicate {name}: {duplicates}")
    try:
        root = ET.parse(site / "sitemap.xml").getroot()
        if root.tag != f"{{{SITEMAP_NS}}}urlset": errors.append("Wrong sitemap namespace")
        urls = [e.text for e in root.findall(f"{{{SITEMAP_NS}}}url/{{{SITEMAP_NS}}}loc")]
        if len(urls) != len(set(urls)): errors.append("Duplicate sitemap URLs")
        if set(urls) != expected: errors.append(f"Sitemap mismatch: missing {expected-set(urls)}, extra {set(urls)-expected}")
    except (OSError, ET.ParseError) as exc: errors.append(f"Invalid sitemap: {exc}")
    try:
        robots = (site / "robots.txt").read_text()
        if f"Sitemap: {SITE_URL}sitemap.xml" not in robots or re.search(r"^Disallow:\s*/\s*$", robots, re.M):
            errors.append("robots.txt must allow the site and point to the primary sitemap")
    except OSError as exc: errors.append(f"Missing robots.txt: {exc}")
    # The map's descriptions and addresses must be real HTML, not only a JSON script.
    places = json.loads((Path(__file__).resolve().parents[1] / "templates/atlas-places.json").read_text())
    map_page = pages.get(Path("pages/map/index.html"))
    if map_page:
        text = " ".join(map_page.text)
        for place in places:
            if place["address"] not in text or place["paragraphs"][0] not in text:
                errors.append(f"Map place missing HTML text: {place['id']}")
    if errors:
        raise SystemExit("\n".join(errors))
    print(f"SEO OK: {len(pages)} pages, {len(expected)} sitemap URLs; metadata, JSON-LD, links, images, map HTML and Metrika")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--site", type=Path, required=True, help="built preview or CI site directory")
    check(parser.parse_args().site)
