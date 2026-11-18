"""Build the static museum pages from their content and shared HTML templates."""

import json
import re
from argparse import ArgumentParser
from html import escape
from pathlib import Path
from shutil import copytree
from string import Template

ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / "site"
LINK = re.compile(r'href="([^"]+)"')
DEFERRED_PAGES = {"videos", "video-81", "video-388", "video-389", "large-videos", "legends"}
AWARD_PAGES = {"fund", "medal", "stipend"}


def render_menu(template, relative):
    prefix = "../" * (len(relative.parts) - 1)
    slug = relative.parent.name

    if slug.startswith(("gallery-", "reading-")):
        section = slug.split("-", 1)[0]
    elif slug in AWARD_PAGES:
        section = "awards"
    else:
        section = None

    current_page = relative.as_posix().removesuffix("index.html") or "index.html"

    def render_link(match):
        target = match[1]
        current = ""
        if target == current_page:
            current = ' aria-current="page"'
        elif section and target == f"pages/{section}/":
            current = ' aria-current="location"'
        return f'href="{prefix}{target}"{current}'

    return LINK.sub(render_link, template)


def render_photo(photo, template):
    def attributes(names):
        return "".join(f' {name}="{escape(photo[name])}"' for name in names if name in photo)

    caption = photo["caption_html"] if "caption_html" in photo else escape(photo["caption"])
    alt = photo["alt"] if "alt" in photo else photo["caption"]
    return template.substitute(
        id=escape(photo["id"]), src=escape(photo["src"]), alt=escape(alt), caption=caption,
        link_attrs=attributes(("title", "aria-label")),
        image_attrs=attributes(("loading", "width", "height", "fetchpriority")),
    )


def render_page(source, relative, templates):
    if not source.startswith("---\n"):
        raise ValueError("missing page metadata")
    metadata, content = source[4:].split("\n---\n", 1)
    page = json.loads(metadata)
    prefix = "../" * (len(relative.parts) - 1)
    photos = page.get("photos", [])
    if content.count("<!-- photos -->") != int(bool(photos)):
        raise ValueError("an album must have one photo list and one photo marker")
    if photos:
        figures = "\n".join(render_photo(photo, templates["photo"]) for photo in photos)
        content = content.replace("<!-- photos -->", figures)
    intro, marker, main_content = content.partition("<!-- main -->")
    items = []
    for crumb in page.get("breadcrumbs", []):
        if isinstance(crumb, str):
            items.append(escape(crumb))
        else:
            items.append(f'<a href="{escape(crumb["href"])}">{escape(crumb["label"])}</a>')

    assets = prefix + "assets/"
    styles = [f'<link rel="stylesheet" href="{assets}{escape(name)}">'
              for name in page.get("styles", [])]
    scripts = [f'<script src="{assets}{escape(name)}" defer></script>'
               for name in page.get("scripts", [])]
    header = templates["header"].substitute(
        prefix=prefix, navigation=render_menu(templates["navigation"].template, relative)
    )
    return templates["base"].substitute(
        title=escape(page["title"]), prefix=prefix, extra_styles="\n".join(styles),
        scripts="\n".join(scripts), header=header, footer=templates["footer"].template,
        body_class="museum museum-home" if relative == Path("index.html") else "museum",
        breadcrumbs=templates["breadcrumbs"].substitute(items=" / ".join(items)) if items else "",
        intro=intro if marker else "", content=main_content if marker else content,
    )


def main():
    parser = ArgumentParser(description=__doc__)
    mode = parser.add_mutually_exclusive_group(required=True)
    mode.add_argument("--output", type=Path, help="build a preview in a new directory")
    mode.add_argument("--in-place", action="store_true", help="render in a disposable CI checkout")
    args = parser.parse_args()
    destination = args.output.resolve() if args.output else SITE
    if args.output and destination.is_relative_to(SITE):
        parser.error("--output must be outside the source site directory")

    templates = {name: Template((ROOT / "templates" / f"{name}.html").read_text(encoding="utf-8").strip())
                 for name in ("base", "header", "navigation", "breadcrumbs", "footer", "photo")}
    pages = [SITE / "index.html", *sorted((SITE / "pages").glob("*/index.html"))]
    generated = {}
    for page in pages:
        if page.parent.name in DEFERRED_PAGES:
            continue
        relative = page.relative_to(SITE)
        try:
            generated[relative] = render_page(page.read_bytes().decode("utf-8"), relative, templates)
        except (ValueError, KeyError, TypeError) as exc:
            raise SystemExit(f"Invalid page {relative}: {exc}") from exc

    if args.output:
        copytree(SITE, destination)
    for relative, body in generated.items():
        (destination / relative).write_bytes(body.encode("utf-8"))
    print(f"Built {len(generated)} pages in {destination}")


if __name__ == "__main__":
    main()
