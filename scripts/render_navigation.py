"""Render the shared navigation inside static pages that include it."""

import re
from argparse import ArgumentParser
from pathlib import Path
from shutil import copytree

ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / "site"
INCLUDE = '<template data-include="navigation"></template>'
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


def main():
    parser = ArgumentParser(description=__doc__)
    mode = parser.add_mutually_exclusive_group(required=True)
    mode.add_argument("--output", type=Path, help="build a preview in a new directory")
    mode.add_argument("--in-place", action="store_true", help="render in a disposable CI checkout")
    args = parser.parse_args()
    destination = args.output.resolve() if args.output else SITE
    if args.output and destination.is_relative_to(SITE):
        parser.error("--output must be outside the source site directory")

    template = (ROOT / "templates" / "navigation.html").read_text(encoding="utf-8").strip()
    if not re.fullmatch(r"<nav(?:\s[^>]*)?>.*?</nav>", template, re.S):
        raise SystemExit("The navigation template must contain one nav element")

    pages = [SITE / "index.html", *sorted((SITE / "pages").glob("*/index.html"))]
    generated = {}
    for page in pages:
        if page.parent.name in DEFERRED_PAGES:
            continue
        body = page.read_bytes().decode("utf-8")
        if INCLUDE not in body:
            continue
        relative = page.relative_to(SITE)
        if body.count(INCLUDE) != 1:
            raise SystemExit(f"Expected one navigation include in {relative}")
        generated[relative] = body.replace(INCLUDE, render_menu(template, relative), 1)

    if not generated:
        raise SystemExit("No navigation includes found")
    if args.output:
        copytree(SITE, destination)
    for relative, body in generated.items():
        (destination / relative).write_bytes(body.encode("utf-8"))
    print(f"Shared navigation rendered on {len(generated)} pages in {destination}")


if __name__ == "__main__":
    main()
