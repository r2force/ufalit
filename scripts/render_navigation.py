"""Render the shared navigation inside static pages that include it."""

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / "site"
INCLUDE = re.compile(r'<nav class="nav"[^>]*data-include="navigation"[^>]*>.*?</nav>', re.S)
LINK = re.compile(r'href="([^"]+)"')
DEFERRED_PAGES = {"videos", "video-81", "video-388", "video-389", "large-videos", "legends"}
AWARD_PAGES = {"fund", "medal", "stipend"}


def render_menu(template, page):
    relative = page.relative_to(SITE)
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
    template = (ROOT / "templates" / "navigation.html").read_text(encoding="utf-8").strip()
    if not INCLUDE.fullmatch(template):
        raise SystemExit("The navigation template must be a nav with data-include=\"navigation\"")

    pages = [SITE / "index.html", *sorted((SITE / "pages").glob("*/index.html"))]
    includes = 0
    updates = 0
    for page in pages:
        if page.parent.name in DEFERRED_PAGES:
            continue
        original = page.read_bytes()
        body = original.decode("utf-8")
        if not INCLUDE.search(body):
            continue
        menu = render_menu(template, page)
        rendered, count = INCLUDE.subn(lambda _: menu, body)
        if count != 1:
            raise SystemExit(f"Expected one navigation include in {page.relative_to(ROOT)}")
        includes += 1
        if rendered != body:
            page.write_bytes(rendered.encode("utf-8"))
            updates += 1
    if not includes:
        raise SystemExit("No navigation includes found")
    print(f"Shared navigation rendered on {includes} pages ({updates} updated)")


if __name__ == "__main__":
    main()
