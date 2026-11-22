"""Build the static museum pages from their content and shared HTML templates."""

import json
import re
from argparse import ArgumentParser
from html import escape, unescape
from pathlib import Path
from shutil import copytree
from string import Template

ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / "site"
LINK = re.compile(r'href="([^"]+)"')
COVER_LINK = re.compile(r'<a\b([^<>]*?)\sdata-cover="([^"]+)"([^<>]*)>(.*?)</a>', re.S)
WRITER_LINK = re.compile(r'<a\b([^<>]*?)\sdata-writer="([^"]+)"([^<>]*)>(.*?)</a>', re.S)
WRITER_HEADING = re.compile(r'<h2\b([^<>]*?)\sdata-writer="([^"]+)"([^<>]*)></h2>')
READER_ARTICLE = re.compile(r'<article\b[^>]*\sdata-reader(?=[\s>])')
IMAGE_VIEWER = re.compile(r'\bdata-image-viewer(?=[\s>])')
BIBLIOGRAPHY = re.compile(r'\bdata-bibliography(?=[\s>])|\bperson-hidden-bibliography-fragment\b')
DIRECTORY_RECORD = re.compile(r'<(details|section)\b([^<>]*?\sid="([^"]+)"\sdata-writer="([^"]+)"[^<>]*)>')
LEGEND_FIGURE = re.compile(
    r'(<figure\b[^<>]*\bclass="[^"]*\blegend-(?:figure|cover|map)\b[^"]*"[^<>]*>\s*)'
    r'<img\b([^<>]+)>(\s*(?:<figcaption\b[^<>]*>(.*?)</figcaption>\s*)?</figure>)',
    re.S,
)
MATERIAL_CONTAINER = re.compile(
    r'(<(?P<tag>figure|span)\b[^<>]*\bclass="[^"]*\bmaterial-(?:figure|inline)\b[^"]*"[^<>]*>\s*)'
    r'<img\b([^<>]+)>(\s*(?:<(?P<cap>figcaption|span)\b[^<>]*>(.*?)</(?P=cap)>\s*)?</(?P=tag)>)',
    re.S,
)
INLINE_MATERIAL_IMG = re.compile(r'<img\b([^<>]*\bclass="[^"]*\bmaterial-inline\b[^"]*"[^<>]*)>')
ATTR = re.compile(r'(\b[\w-]+)="([^"]*)"')
AWARD_PAGES = {"fund", "medal", "stipend"}
AUDIO_MIMES = {"ogg": "audio/ogg", "mp3": "audio/mpeg", "wav": "audio/wav", "m4a": "audio/mp4"}
TEMPLATE_NAMES = (
    "base", "header", "navigation", "breadcrumbs", "footer", "photo", "gallery-album",
    "audio-track", "audio-studio", "video", "video-album", "album-cover", "writer-card",
    "writer-profile", "directory-banner", "zoom-image", "atlas", "atlas-choice", "guide-card",
    "archive-index", "archive-collection", "archive-album", "archive-video",
)


def page_section(slug):
    if slug.startswith(("gallery-", "reading-")):
        return slug.split("-", 1)[0]
    if slug.startswith("video-") or slug == "large-videos":
        return "videos"
    if slug in AWARD_PAGES:
        return "awards"
    return None


def ensure_asset(items, asset, *, prepend=False):
    base = asset.partition("?")[0]
    if any(existing.partition("?")[0] == base for existing in items):
        return
    if prepend:
        items.insert(0, asset)
    else:
        items.append(asset)


def render_menu(template, relative):
    prefix = "../" * (len(relative.parts) - 1)
    slug = relative.parent.name
    section = page_section(slug)
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


def render_track(track, template):
    ext = Path(track["src"]).suffix.lstrip(".").lower() or "ogg"
    return template.substitute(
        id=escape(track["id"]), title=escape(track["title"]), src=escape(track["src"]),
        mime=escape(AUDIO_MIMES.get(ext, f"audio/{ext}")), format=escape(ext.upper()),
    )


def render_video(video, template):
    ext = Path(video["src"]).suffix.lstrip(".").upper() or "MP4"
    id_attr = f' id="{escape(video["id"])}"' if "id" in video else ""
    description = f'<p>{escape(video["description"])}</p>' if "description" in video else ""
    return template.substitute(
        id_attr=id_attr, title=escape(video["title"]), src=escape(video["src"]),
        description=description, format=escape(ext),
    )


def video_count(count):
    if 11 <= count % 100 <= 14:
        word = "видеозаписей"
    elif count % 10 == 1:
        word = "видеозапись"
    elif 2 <= count % 10 <= 4:
        word = "видеозаписи"
    else:
        word = "видеозаписей"
    return f"{count} {word}"


def archive_fields(page, writers, prefix):
    writer = writers[page["video_archive"]]
    return dict(
        name=escape(writer["name"]), writer=escape(page["video_archive"]),
        portrait=escape(prefix + writer["portrait"]),
        count=escape(video_count(len(page["videos"]))),
    )


def archive_poster(video, prefix):
    """Use a locally stored frame extracted from this specific recording."""
    video_path = Path(video["src"])
    return escape(f"{prefix}assets/video-archive/previews/{video_path.parent.name}/{video_path.stem}.jpg")


def render_archive_index(collections, templates, writers, prefix):
    cards = []
    total = 0
    for slug in collections:
        source = (SITE / "pages" / slug / "index.html").read_text(encoding="utf-8")
        page = json.loads(source[4:].split("\n---\n", 1)[0])
        total += len(page["videos"])
        cards.append(templates["archive-collection"].substitute(
            **archive_fields(page, writers, prefix), href=f"../{escape(slug)}/",
        ))
    return templates["archive-index"].substitute(
        collections="\n".join(cards), count=video_count(total),
        collection_count=len(collections), reel=prefix + "assets/video-archive/reel.svg",
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


def parse_attrs(raw):
    return dict(ATTR.findall(raw))


def format_attrs(attrs):
    return "".join(f' {key}="{value}"' for key, value in attrs.items())


def zoom_aria_label(caption_html, alt_value):
    caption_text = re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", unescape(caption_html or ""))).strip()
    label = caption_text or unescape(alt_value or "").strip()
    return f"Открыть изображение: {label}" if label else "Открыть изображение в полном размере"


def expand_illustrations(content, zoom_template):
    def expand_legend(match):
        opening, raw_attrs, closing, caption_html = match.groups()
        attrs = parse_attrs(raw_attrs)
        if "alt" not in attrs:
            caption_text = re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", unescape(caption_html or ""))).strip()
            attrs["alt"] = escape(caption_text)
        if "loading" not in attrs and "fetchpriority" not in attrs:
            attrs["loading"] = "lazy"
        wrapped = zoom_template.substitute(href=attrs["src"], link_attrs="", img_attrs=format_attrs(attrs))
        return f"{opening}{wrapped}{closing}"

    def expand_material_container(match):
        opening, _, raw_attrs, closing, _, caption_html = match.groups()
        attrs = parse_attrs(raw_attrs)
        attrs.setdefault("alt", "")
        classes = attrs.get("class", "").split()
        if "material-image" not in classes:
            classes.append("material-image")
        attrs["class"] = " ".join(classes)
        attrs.setdefault("loading", "lazy")
        attrs.setdefault("decoding", "async")
        aria = escape(zoom_aria_label(caption_html, attrs["alt"]))
        link_attrs = f' class="material-image-link" aria-label="{aria}"'
        wrapped = zoom_template.substitute(href=attrs["src"], link_attrs=link_attrs, img_attrs=format_attrs(attrs))
        return f"{opening}{wrapped}{closing}"

    def expand_inline_material(match):
        attrs = parse_attrs(match[1])
        attrs.setdefault("alt", "")
        inline_classes = [c for c in attrs.get("class", "").split() if c.startswith("material-inline")]
        img_classes = [c for c in attrs.get("class", "").split() if not c.startswith("material-inline")]
        if "material-image" not in img_classes:
            img_classes.append("material-image")
        attrs["class"] = " ".join(img_classes)
        attrs.setdefault("loading", "lazy")
        attrs.setdefault("decoding", "async")
        aria = escape(zoom_aria_label("", attrs["alt"]))
        link_class = " ".join(["material-image-link", *inline_classes])
        link_attrs = f' class="{escape(link_class)}" aria-label="{aria}"'
        return zoom_template.substitute(href=attrs["src"], link_attrs=link_attrs, img_attrs=format_attrs(attrs))

    content = LEGEND_FIGURE.sub(expand_legend, content)
    content = MATERIAL_CONTAINER.sub(expand_material_container, content)
    return INLINE_MATERIAL_IMG.sub(expand_inline_material, content)


def expand_writer_refs(content, prefix, templates, writers):
    def render_heading(match):
        before, slug, after = match.groups()
        writer = writers[slug]
        attrs = f"{before}{after}"
        if 'id="' not in attrs:
            attrs += f' id="{escape(writer["reading"])}"'
        return f'<h2{attrs}>{escape(writer["name"])}</h2>'

    def render_link(match):
        before, slug, after, inner = match.groups()
        writer = writers[slug]
        attrs = " ".join(part.strip() for part in (before, after) if part.strip())
        if 'href="' not in attrs:
            href = f'href="{escape(prefix + "pages/" + writer["gallery"] + "/")}"'
            attrs = f"{href} {attrs}".strip()
        cover = escape(prefix + writer["portrait"])
        label = escape(writer["name"]) + inner
        return templates["album-cover"].substitute(attributes=attrs, cover=cover, label=label)

    content = WRITER_HEADING.sub(render_heading, content)
    return WRITER_LINK.sub(render_link, content)


def render_writer_directory(content, records, page, prefix, templates, writers):
    def writer_fields(slug):
        writer = writers[slug]
        return {"name": escape(writer["name"]), "years": escape(writer["years"]),
                "thumbnail": escape(f"{prefix}assets/persons/thumbnails/{slug}.jpg")}

    cards = "\n".join(templates["writer-card"].substitute(
        **writer_fields(slug), id=escape(record_id), letter=escape(writers[slug]["letter"]),
        alias=escape(writers[slug].get("full_name", "")),
    ) for _, _, record_id, slug in (match.groups() for match in records))
    banner = ""
    if "heading" in page and "intro" in page and 'class="directory-banner"' not in content:
        banner = templates["directory-banner"].substitute(
            heading=escape(page["heading"]), intro=escape(page["intro"])
        ) + "\n"
    first_record = records[0].start()
    prefix_html = content[:first_record]
    tail = content[first_record:]

    def render_record(match):
        tag, raw_attrs, _, slug = match.groups()
        writer = writers[slug]
        if tag == "section":
            heading_match = re.search(r'\sdata-heading-id="([^"]+)"', raw_attrs)
            clean_attrs = re.sub(r'\sdata-heading-id="[^"]+"', "", raw_attrs)
            opening = f"<section{clean_attrs}>"
            after = tail[match.end():].lstrip()
            if heading_match:
                return f'{opening}<h2 id="{escape(heading_match[1])}">{escape(writer["name"])}</h2>'
            if not after.startswith("<h2"):
                return f'{opening}<h2>{escape(writer["name"])}</h2>'
            return opening

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

    rest_html = DIRECTORY_RECORD.sub(render_record, tail)
    return f'{prefix_html}{banner}<template class="directory-entries">\n{cards}\n</template>\n{rest_html}'


def render_page(source, relative, templates, writers):
    if not source.startswith("---\n"):
        raise ValueError("missing page metadata")
    metadata, content = source[4:].split("\n---\n", 1)
    page = json.loads(metadata)
    prefix = "../" * (len(relative.parts) - 1)
    slug = relative.parent.name if relative != Path("index.html") else ""
    section = page_section(slug) if slug else None
    style_names = list(page.get("styles", []))
    script_names = list(page.get("scripts", []))

    if "video_collections" in page:
        content = render_archive_index(page["video_collections"], templates, writers, prefix)
    if "video_collections" in page or "video_archive" in page:
        ensure_asset(style_names, "video-archive.css?v=2")
    if "video_archive" in page:
        first_video = page["videos"][0]
        content = templates["archive-album"].substitute(
            **archive_fields(page, writers, prefix), heading=escape(page["heading"]),
            reel=prefix + "assets/video-archive/reel.svg",
            title=escape(first_video["title"]), src=escape(first_video["src"]),
            poster=archive_poster(first_video, prefix),
        )
        ensure_asset(script_names, "ufalit-video.js?v=2")

    if "photos" in page and "<!-- photos -->" not in content:
        extra = f"\n{content.strip()}" if content.strip() else ""
        content = templates["gallery-album"].substitute(heading=escape(page["heading"]), extra=extra)
    if "videos" in page and "<!-- videos -->" not in content:
        extra = f"\n  {content.strip()}" if content.strip() else ""
        note = page.get("note", "Видеозаписи доступны для просмотра и скачивания в формате MP4.")
        content = templates["video-album"].substitute(
            heading=escape(page["heading"]), note=escape(note), extra=extra,
        )
    if "audio_studio" in page:
        studio = page["audio_studio"]
        intro_html = studio["intro_html"] if "intro_html" in studio else escape(studio["intro"])
        content = templates["audio-studio"].substitute(
            kicker=escape(studio["kicker"]), heading=escape(studio["heading"]),
            intro=intro_html, voice=escape(studio["voice"]), description=escape(studio["description"]),
        ) + ("\n" + content.strip() if content.strip() else "")
        ensure_asset(script_names, "ufalit-audio.js?v=2")

    records = list(DIRECTORY_RECORD.finditer(content))
    if records:
        content = render_writer_directory(content, records, page, prefix, templates, writers)
        ensure_asset(style_names, "directory.css?v=3", prepend=True)
        ensure_asset(script_names, "ufalit-editorial.js?v=7")
    if BIBLIOGRAPHY.search(content):
        ensure_asset(style_names, "bibliography.css")
        ensure_asset(script_names, "ufalit-editorial.js?v=7")
    if READER_ARTICLE.search(content):
        ensure_asset(style_names, "reader.css?v=3")
        ensure_asset(style_names, "illustrations.css?v=2")
        ensure_asset(script_names, "ufalit-reader.js?v=2")

    content = expand_writer_refs(content, prefix, templates, writers)
    content = expand_illustrations(content, templates["zoom-image"])

    if "photos" in page:
        photos = page["photos"]
        content = insert_list(content, "photos", (render_photo(photo, templates["photo"]) for photo in photos))
        content = content.replace("<!-- photo-count -->", photo_count(len(photos)))
        ensure_asset(script_names, "ufalit-gallery.js?v=4")
    elif IMAGE_VIEWER.search(content):
        ensure_asset(script_names, "ufalit-gallery.js?v=4")

    if "tracks" in page:
        content = insert_list(content, "tracks", (render_track(track, templates["audio-track"]) for track in page["tracks"]))
    if "videos" in page:
        if "video_archive" in page:
            videos = (
                templates["archive-video"].substitute(
                    title=escape(video["title"]), src=escape(video["src"]),
                    poster=archive_poster(video, prefix),
                    current=' aria-current="true"' if number == 1 else "",
                )
                for number, video in enumerate(page["videos"], 1)
            )
        else:
            videos = (render_video(video, templates["video"]) for video in page["videos"])
        content = insert_list(content, "videos", videos)
    if page.get("atlas"):
        places = json.loads((ROOT / "templates" / "atlas-places.json").read_text(encoding="utf-8"))
        first = places[0]
        choices = [templates["atlas-choice"].substitute(
            id=escape(place["id"]), label=escape(place["label"]),
            image=escape(place["image"]), category=escape(place["category"]),
        ) for place in places]
        atlas = templates["atlas"].substitute(
            **{key: escape(first.get(key, "")) for key in (
                "id", "title", "writer", "category", "address", "image", "quote",
            )},
            description="".join(f"<p>{escape(text)}</p>" for text in first["paragraphs"]),
            choices="\n".join(choices),
            count=len(places),
            places_json=json.dumps(places, ensure_ascii=False).replace("<", "\\u003c"),
        )
        content = insert_list(content, "atlas", [atlas])
    if "guide_cards" in page:
        cards = (
            templates["guide-card"].substitute(
                href=escape(card["href"]), icon=card["icon"], title=escape(card["title"]),
                description=escape(card["description"]), action=escape(card["action"]),
                badge=escape(card["badge"]),
            )
            for card in page["guide_cards"]
        )
        content = insert_list(content, "guide-cards", cards)

    if any(marker in content for marker in (
        "<!-- tracks -->", "<!-- photos -->", "<!-- photo-count -->",
        "<!-- videos -->", "<!-- atlas -->", "<!-- guide-cards -->",
    )):
        raise ValueError("missing metadata for a template list")

    content = COVER_LINK.sub(lambda match: templates["album-cover"].substitute(
        attributes=(match[1] + match[3]).strip(), cover=match[2], label=match[4]), content)

    if slug.startswith("reading-") and 'href="../reading/"' not in content:
        content = content.rstrip() + '\n<p><a href="../reading/">Вернуться в читальный зал</a></p>\n'

    intro, marker, main_content = content.partition("<!-- main -->")
    items = []
    for crumb in page.get("breadcrumbs", []):
        if isinstance(crumb, str):
            items.append(escape(crumb))
        else:
            items.append(f'<a href="{escape(crumb["href"])}">{escape(crumb["label"])}</a>')

    if relative == Path("index.html"):
        body_class = "museum museum-home"
    elif slug == "videos" or section == "videos":
        body_class = "museum video-page"
    else:
        body_class = "museum"

    assets = prefix + "assets/"
    styles = [f'<link rel="stylesheet" href="{assets}{escape(name)}">' for name in style_names]
    scripts = [f'<script src="{assets}{escape(name)}" defer></script>' for name in script_names]
    header = templates["header"].substitute(
        prefix=prefix, navigation=render_menu(templates["navigation"].template, relative)
    )
    return templates["base"].substitute(
        title=escape(page["title"]), prefix=prefix, extra_styles="\n".join(styles),
        scripts="\n".join(scripts), header=header, footer=templates["footer"].template,
        body_class=body_class,
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
                 for name in TEMPLATE_NAMES}
    writers = json.loads((ROOT / "templates" / "writers.json").read_text(encoding="utf-8"))
    pages = [SITE / "index.html", *sorted((SITE / "pages").glob("*/index.html"))]
    generated = {}
    for page in pages:
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
