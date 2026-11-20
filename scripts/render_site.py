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
DEFERRED_PAGES = {"videos", "video-81", "video-388", "video-389", "large-videos"}
# The source link contains its label (which may include strong/small) and cover URL.
COVER_LINK = re.compile(r'<a\b([^<>]*?)\sdata-cover="([^"]+)"([^<>]*)>(.*?)</a>', re.S)
READER_ARTICLE = re.compile(r'<article\b[^>]*\sdata-reader(?=[\s>])')
DIRECTORY_RECORD = re.compile(r'<(details|section)\b[^>]*\sid="([^"]+)"\sdata-writer="([^"]+)"[^>]*>')
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
    photo = {"loading": "lazy", **photo}

    def attributes(names):
        return "".join(f' {name}="{escape(photo[name])}"' for name in names if photo.get(name) is not None)

    caption = photo["caption_html"] if "caption_html" in photo else escape(photo["caption"])
    alt = photo["alt"] if "alt" in photo else photo["caption"]
    return template.substitute(
        id=escape(photo["id"]), src=escape(photo["src"]), alt=escape(alt), caption=caption,
        link_attrs=attributes(("title", "aria-label")),
        image_attrs=attributes(("loading", "width", "height", "fetchpriority")),
    )


def photo_count(count):
    last = count % 10
    if 11 <= count % 100 <= 14:
        word = "фотографий"
    elif last == 1:
        word = "фотография"
    elif 2 <= last <= 4:
        word = "фотографии"
    else:
        word = "фотографий"
    return f"{count} {word}"


def insert_list(content, name, rows):
    marker = f"<!-- {name} -->"
    if content.count(marker) != 1:
        raise ValueError(f"expected one {marker} for {name}")
    return content.replace(marker, "\n".join(rows))


def render_writer_directory(content, records, prefix, templates, writers):
    def writer_fields(slug):
        writer = writers[slug]
        return {"name": escape(writer["name"]), "years": escape(writer["years"]),
                "thumbnail": escape(f"{prefix}assets/persons/thumbnails/{slug}.jpg")}

    def render_profile(match):
        tag, _, slug = match.groups()
        if tag != "details":
            return match[0]
        writer = writers[slug]
        gallery = writer.get("gallery", "gallery")
        reading_anchor = f'#{writer["reading"]}' if "reading" in writer else ""
        audio = ""
        if "audio" in writer:
            audio_url = escape(f'{prefix}pages/{writer["audio"]}/')
            audio = f'\n      <a class="profile-reading-link" href="{audio_url}">Аудиозаписи</a>'
        full_name = escape(writer.get("full_name", ""))
        return match[0] + "\n" + templates["writer-profile"].substitute(
            **writer_fields(slug), portrait=escape(prefix + writer["portrait"]),
            role=escape(writer["role"]), ufa=escape(writer["ufa"]),
            full_name=f'\n    <p class="person-full-name">{full_name}</p>' if full_name else "",
            gallery_url=escape(f"{prefix}pages/{gallery}/"),
            gallery_label="Фотогалерея" if "gallery" in writer else "Каталог фотогалереи",
            places_url=escape(f'{prefix}pages/places/#{writer["place"]}'),
            reading_url=escape(f"{prefix}pages/reading/{reading_anchor}"), audio_link=audio,
        ) + "\n"

    cards = "\n".join(templates["writer-card"].substitute(
        **writer_fields(slug), id=escape(record_id), letter=escape(writers[slug]["letter"]),
        alias=escape(writers[slug].get("full_name", "")),
    ) for _, record_id, slug in (match.groups() for match in records))
    first_record = records[0].start()
    content = DIRECTORY_RECORD.sub(render_profile, content)
    return (content[:first_record] + f'<template class="directory-entries">\n{cards}\n</template>\n'
            + content[first_record:])


def render_page(source, relative, templates, writers):
    if not source.startswith("---\n"):
        raise ValueError("missing page metadata")
    metadata, content = source[4:].split("\n---\n", 1)
    page = json.loads(metadata)
    prefix = "../" * (len(relative.parts) - 1)
    style_names = list(page.get("styles", []))
    script_names = list(page.get("scripts", []))
    records = list(DIRECTORY_RECORD.finditer(content))
    if records:
        content = render_writer_directory(content, records, prefix, templates, writers)
        style_names.insert(0, "directory.css?v=2")
        script_names.append("ufalit-editorial.js?v=6")
    if READER_ARTICLE.search(content):
        style_names.extend(("reader.css?v=3", "illustrations.css?v=2"))
        script_names.append("ufalit-reader.js?v=2")
    if "photos" in page:
        photos = page["photos"]
        content = insert_list(content, "photos", (render_photo(photo, templates["photo"]) for photo in photos))
        content = content.replace("<!-- photo-count -->", photo_count(len(photos)))
        if not any(name.partition("?")[0] == "ufalit-gallery.js" for name in script_names):
            script_names.append("ufalit-gallery.js?v=2")
    if "tracks" in page:
        tracks = (templates["audio-track"].substitute({key: escape(value) for key, value in track.items()})
                  for track in page["tracks"])
        content = insert_list(content, "tracks", tracks)
    if any(marker in content for marker in ("<!-- tracks -->", "<!-- photos -->", "<!-- photo-count -->")):
        raise ValueError("missing metadata for a media list")
    content = COVER_LINK.sub(lambda match: templates["album-cover"].substitute(
        attributes=(match[1] + match[3]).strip(), cover=match[2], label=match[4]), content)
    intro, marker, main_content = content.partition("<!-- main -->")
    items = []
    for crumb in page.get("breadcrumbs", []):
        if isinstance(crumb, str):
            items.append(escape(crumb))
        else:
            items.append(f'<a href="{escape(crumb["href"])}">{escape(crumb["label"])}</a>')

    assets = prefix + "assets/"
    styles = [f'<link rel="stylesheet" href="{assets}{escape(name)}">'
              for name in style_names]
    scripts = [f'<script src="{assets}{escape(name)}" defer></script>'
               for name in script_names]
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
                 for name in ("base", "header", "navigation", "breadcrumbs", "footer", "photo", "audio-track",
                              "album-cover", "writer-card", "writer-profile")}
    writers = json.loads((ROOT / "templates" / "writers.json").read_text(encoding="utf-8"))
    pages = [SITE / "index.html", *sorted((SITE / "pages").glob("*/index.html"))]
    generated = {}
    for page in pages:
        if page.parent.name in DEFERRED_PAGES:
            continue
        relative = page.relative_to(SITE)
        try:
            generated[relative] = render_page(page.read_bytes().decode("utf-8"), relative, templates, writers)
        except (ValueError, KeyError, TypeError) as exc:
            raise SystemExit(f"Invalid page {relative}: {exc}") from exc

    if args.output:
        copytree(SITE, destination)
    for relative, body in generated.items():
        (destination / relative).write_bytes(body.encode("utf-8"))
    print(f"Built {len(generated)} pages in {destination}")


if __name__ == "__main__":
    main()
