"""Inventory every built page; optionally inspect public HTTP responses (no account data)."""

import argparse
from collections import Counter
from concurrent.futures import ThreadPoolExecutor
import hashlib
from html.parser import HTMLParser
import json
from pathlib import Path
import urllib.error
import urllib.request
from urllib.parse import urljoin, urlsplit

from seo import SITE_URL, page_url


class Page(HTMLParser):
    def __init__(self, html):
        super().__init__(convert_charrefs=True)
        self.title = ""
        self.meta = {}
        self.canonicals = []
        self.headings = []
        self.links = []
        self.images = []
        self.ids = []
        self.jsonld = []
        self.text = []
        self.raw = html
        self.template_depth = 0
        self.ignore = 0
        self.main = False
        self.in_title = False
        self.heading = None
        self.ld = None
        self.feed(html)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "title": self.in_title = True
        if tag == "meta": self.meta[attrs.get("name", attrs.get("property", ""))] = attrs.get("content", "")
        if tag == "link" and attrs.get("rel") == "canonical": self.canonicals.append(attrs.get("href", ""))
        if tag == "script" and attrs.get("type") == "application/ld+json": self.ld = ""
        if tag in {"script", "style", "template"}: self.ignore += 1
        if tag == "template": self.template_depth += 1
        # Template contents still contain valid links and IDs, but are excluded from main text and headings.
        if attrs.get("id"): self.ids.append(attrs["id"])
        for attribute in ("href", "src", "poster"):
            if attrs.get(attribute): self.links.append({"tag": tag, "attribute": attribute, "url": attrs[attribute]})
        if tag == "img": self.images.append(attrs)
        if tag == "main": self.main = True
        if tag in {"h1", "h2", "h3", "h4", "h5", "h6"} and not self.template_depth:
            self.heading = {"level": int(tag[1]), "text": "", "id": attrs.get("id")}
            self.headings.append(self.heading)

    def handle_endtag(self, tag):
        if tag == "title": self.in_title = False
        if tag == "script" and self.ld is not None:
            self.jsonld.append(self.ld)
            self.ld = None
        if tag in {"script", "style", "template"}: self.ignore = max(0, self.ignore - 1)
        if tag == "template": self.template_depth = max(0, self.template_depth - 1)
        if tag == "main": self.main = False
        if tag in {"h1", "h2", "h3", "h4", "h5", "h6"}: self.heading = None

    def handle_data(self, data):
        if self.in_title: self.title += data
        if self.ld is not None: self.ld += data
        if self.heading is not None: self.heading["text"] += data
        if self.main and not self.ignore: self.text.append(data)

    def report(self, relative, details=False):
        text = " ".join(" ".join(self.text).split())
        external = [link for link in self.links if urlsplit(link["url"]).netloc and not link["url"].startswith(SITE_URL)]
        result = {"path": relative.as_posix(), "url": page_url(relative), "title": self.title,
                "description": self.meta.get("description", ""), "canonical": self.canonicals,
                "robots": self.meta.get("robots", "index, follow (default)"), "headings": self.headings,
                "social": {k:v for k,v in self.meta.items() if k.startswith(("og:", "twitter:"))},
                "link_count": len(self.links), "external_link_count": len(external),
                "image_count": len(self.images), "missing_alt": sum("alt" not in i for i in self.images),
                "images_without_dimensions": sum(not ("width" in i and "height" in i) for i in self.images),
                "empty_alt": sum(i.get("alt") == "" for i in self.images), "jsonld": self.jsonld,
                "text_characters": len(text), "text_sha256": hashlib.sha256(text.encode()).hexdigest(),
                "duplicate_ids": [key for key,count in Counter(self.ids).items() if count > 1]}
        if details:
            result.update(links=self.links, images=self.images)
        return result


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *args):
        return None


def check_http(url):
    opener = urllib.request.build_opener(NoRedirect)
    hops = []
    current = url
    for _ in range(8):
        try:
            request = urllib.request.Request(current, headers={"User-Agent": "Ufalit-SEO-audit/1.0"})
            response = opener.open(request, timeout=25)
        except urllib.error.HTTPError as exc:
            response = exc
        except (OSError, ValueError) as exc:
            return {"requested": url, "hops": hops, "error": str(exc)}
        with response:
            status = response.code
            location = response.headers.get("Location")
            hops.append({"url": current, "status": status, "location": location,
                         "x_robots_tag": response.headers.get("X-Robots-Tag")})
            if status in (301, 302, 303, 307, 308) and location:
                current = urljoin(current, location)
                continue
            body = response.read().decode("utf-8", errors="replace")
            parsed = Page(body)
            return {"requested": url, "hops": hops, "final_url": current, "status": status,
                    "bytes": len(body.encode()), "title": parsed.title,
                    "description": parsed.meta.get("description"), "canonical": parsed.canonicals,
                    "robots": parsed.meta.get("robots"), "h1": [h for h in parsed.headings if h["level"] == 1]}
    return {"requested": url, "hops": hops, "error": "too many redirects"}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--site", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--live", action="store_true")
    parser.add_argument("--details", action="store_true", help="include all image attributes and link destinations")
    args = parser.parse_args()
    inventory = [Page(p.read_text()).report(p.relative_to(args.site), args.details) for p in sorted(args.site.rglob("*.html"))]
    data = {"site_url": SITE_URL, "pages": inventory}
    if args.live:
        urls = [p["url"] for p in inventory] + [SITE_URL + "robots.txt", SITE_URL + "sitemap.xml",
                "https://r2force.github.io/robots.txt", "https://r2force.github.io/ufalit/", SITE_URL + "index.html"]
        with ThreadPoolExecutor(max_workers=6) as pool:
            data["http"] = list(pool.map(check_http, urls))
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n")
    print(f"Audited {len(inventory)} HTML pages: {args.output}")


if __name__ == "__main__":
    main()
