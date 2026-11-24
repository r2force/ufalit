"""Build the static museum pages from their content and shared HTML templates."""

import json
import re
from argparse import ArgumentParser
from html import escape, unescape
from html.parser import HTMLParser
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
    "reading-index", "reading-card", "reading-author", "reading-work", "reading-context",
    "redirect", "gallery-writer",
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


def atlas_detail_url(place):
    return place.get("detail_url", f'pages/places/#{place["id"]}')


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
        category=escape(photo_category(photo)),
        writer=escape(photo.get("writer", "")), writer_name=escape(photo.get("writer_name", "")),
        order=escape(str(photo.get("order", ""))),
        note=f'<p class="photo-note">{escape(photo["note"])}</p>' if photo.get("note") else "",
        metadata=photo_metadata(photo),
        link_attrs=attributes(("title", "aria-label")),
        image_attrs=attributes(("loading", "width", "height", "fetchpriority")),
    )


def photo_category(photo):
    """Classify descriptive captions; leave unnamed archival frames unclassified."""
    if photo.get("category"):
        return photo["category"]
    caption = photo.get("caption", photo.get("alt", "")).lower()
    for pattern, category in (
        (r"карт[аы]|древо|автограф|документ|родослов", "Карты и документы"),
        (r"из книг|обложк|книж|афиш", "Книжные издания"),
        (r"бюст|памятник|мемориаль|доск|скульптур|табличк|могил", "Памятники и доски"),
        (r"улиц|бульвар|дом|музей|гимназ|медресе|театр|сад[ ау]|читальн|парк|библиотек|школ|уфа|печати|умпо|университет|академи", "Архитектура и улицы"),
        (r"портрет|аксаков$|амантай|бикбай|киекбаев|узиков|гафури|короленко|рахимкулов|сотников|ибрагимов|янаби|с семь|семейн|с жен|сестр|с детьми|с другом", "Портреты"),
    ):
        if re.search(pattern, caption):
            return category
    return "Фотоархив"


def photo_metadata(photo):
    caption = photo.get("caption", photo.get("alt", ""))
    address = photo.get("address")
    if not address:
        match = re.search(r"(?:ул\.?\s|улиц[аеы]\s|бульвар\s)[^()]+", caption, re.I)
        address = match[0].strip() if match else None
    year = photo.get("year")
    if not year:
        match = re.search(r"\b(?:18|19|20)\d{2}(?:[-–]е)?(?:\s*(?:год[ауы]?|гг?\.))?", caption)
        year = match[0] if match else None
    parts = []
    if address:
        parts.append(f'<span class="photo-location">{escape(address)}</span>')
    if year:
        parts.append(f'<span class="photo-date">{escape(year)}</span>')
    return "".join(parts)


def gallery_descendants(albums, slug, seen=None):
    """Keep source order while following nested albums and stopping back-links."""
    if seen is None:
        seen = set()
    if slug in seen:
        return []
    seen.add(slug)
    result = [slug]
    for child in re.findall(r'href="\.\./(gallery-[^/]+)/', albums[slug]["body"]):
        result.extend(gallery_descendants(albums, child, seen))
    return result


def gallery_photos(albums, slugs):
    return [photo for slug in slugs for photo in albums[slug]["page"].get("photos", [])]


def load_gallery_catalog(writers):
    summaries = json.loads((ROOT / "templates/gallery-catalog.json").read_text(encoding="utf-8"))
    albums = {}
    for path in sorted((SITE / "pages").glob("gallery-*/index.html")):
        metadata, body = path.read_text(encoding="utf-8")[4:].split("\n---\n", 1)
        albums[path.parent.name] = {"page": json.loads(metadata), "body": body}

    catalog = []
    for writer, summary in summaries.items():
        slugs = gallery_descendants(albums, writers[writer]["gallery"])
        photos = gallery_photos(albums, slugs)
        catalog.append(dict(writer=writer, summary=summary, slugs=slugs, count=len(photos)))
    return catalog, albums


def render_gallery(page, content, slug, prefix, templates, writers, catalog_data):
    catalog, albums = catalog_data
    selected = next((item for item in catalog if slug in item["slugs"]), catalog[0])
    cards = []
    for item in catalog:
        writer = writers[item["writer"]]
        cards.append(templates["gallery-writer"].substitute(
            href=escape(f'{prefix}pages/{writer["gallery"]}/#gallery-photos'),
            writer=escape(item["writer"]),
            current=' aria-current="true"' if item is selected else "",
            portrait=escape(prefix + writer["portrait"]), name=escape(writer["name"]),
            years=escape(writer["years"]), count=photo_count(item["count"]),
            summary=escape(item["summary"]),
        ))
    if slug == "gallery":
        photos = gallery_photos(albums, selected["slugs"])
        extra = ""
        heading = writers[selected["writer"]]["name"]
    else:
        photos = page.get("photos", [])
        extra = content.strip()
        source_heading = re.search(r'<h1\b[^>]*>(.*?)</h1>', content, re.S)
        heading = page.get("heading") or (unescape(re.sub(r'<[^>]+>', '', source_heading[1])) if source_heading else writers[selected["writer"]]["name"])
        if heading == "Фотогалерея":
            heading = writers[selected["writer"]]["name"]
        if not photos or slug == writers[selected["writer"]]["gallery"]:
            photos = gallery_photos(albums, gallery_descendants(albums, slug))
    # Keep the source links and anchors for every related collection.
    extra = re.sub(r'<h1\b[^>]*>.*?</h1>\s*', '', extra, flags=re.S)
    if extra:
        extra = f'<section class="gallery-related" aria-label="Подборки фотографий">{extra}</section>'
    # Keep other writers inert until they are selected or a global search is entered.
    # The same photo template is used for both the current album and the search corpus.
    all_photos = [dict(photo, writer=item["writer"], writer_name=writers[item["writer"]]["name"])
                  for item in catalog for photo in gallery_photos(albums, item["slugs"])]
    for order, photo in enumerate(all_photos):
        photo["order"] = order
    by_id = {photo["id"]: photo for photo in all_photos}
    photos = [by_id[photo["id"]] for photo in photos]
    shown = {photo["id"] for photo in photos}
    pool = "\n".join(render_photo(photo, templates["photo"]) for photo in all_photos if photo["id"] not in shown)
    content = templates["gallery-album"].substitute(
        heading=escape(heading), extra=extra, writers="\n".join(cards), count=photo_count(len(photos)),
        writer=escape(selected["writer"]), pool=pool,
    )
    return content, photos


def render_track(track, template):
    ext = Path(track["src"]).suffix.lstrip(".").lower() or "ogg"
    return template.substitute(
        id=escape(track["id"]), title=escape(track["title"]), src=escape(track["src"]),
        mime=escape(AUDIO_MIMES.get(ext, f"audio/{ext}")),
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
        reading_link = ""
        if "reading" in writer:
            reading_url = escape(f'{prefix}pages/reading-author-{slug}/')
            reading_link = f'<a class="profile-reading-link" href="{reading_url}">Читальный зал</a>'
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
            reading_link=reading_link, audio_link=audio,
        ) + "\n"

    rest_html = DIRECTORY_RECORD.sub(render_record, tail)
    return f'{prefix_html}{banner}<template class="directory-entries">\n{cards}\n</template>\n{rest_html}'


def material_count(count):
    if 11 <= count % 100 <= 14:
        word = "материалов"
    elif count % 10 == 1:
        word = "материал"
    elif 2 <= count % 10 <= 4:
        word = "материала"
    else:
        word = "материалов"
    return f"{count} {word}"


class ReadingText(HTMLParser):
    """Extract readable source content without HTML, scripts, or styles."""
    BREAKS = {"p", "div", "section", "article", "br", "li", "h1", "h2", "h3", "h4", "td", "tr", "figure", "figcaption"}
    IGNORED = {"script", "style", "template"}

    def __init__(self, source):
        super().__init__(convert_charrefs=True)
        self.parts = []
        self.ignored = 0
        self.feed(source)

    def handle_starttag(self, tag, attrs):
        if tag in self.IGNORED:
            self.ignored += 1
        if not self.ignored and tag in self.BREAKS:
            self.parts.append(" ")

    def handle_endtag(self, tag):
        if tag in self.IGNORED:
            self.ignored = max(0, self.ignored - 1)
        if not self.ignored and tag in self.BREAKS:
            self.parts.append(" ")

    def handle_data(self, data):
        if not self.ignored:
            self.parts.append(data)

    def text(self):
        return re.sub(r"\s+", " ", "".join(self.parts)).strip()


def reading_search_documents(collections, writers):
    documents = []
    for collection in collections:
        writer = writers[collection["writer"]]
        for work in collection["works"]:
            source = (SITE / "pages" / work["slug"] / "index.html").read_text(encoding="utf-8")
            metadata, content = source[4:].split("\n---\n", 1)
            page = json.loads(metadata)
            # Audio is searchable by track titles; no transcript is invented.
            tracks = " ".join(track["title"] for track in page.get("tracks", []))
            # Titles have their own search field; snippets should start in the body.
            content = re.sub(r'<h1\b[^>]*>.*?</h1>', '', content, count=1, flags=re.S)
            text = ReadingText(content).text()
            documents.append(dict(
                title=work["title"], author=work.get("author", writer["name"]),
                alias=" ".join([writer.get("full_name", ""), writer["name"] if "author" in work else ""]),
                kind=work["kind"], description=work["description"],
                href=f'../{work["slug"]}/', text=" ".join(part for part in (text, tracks) if part),
            ))
    return documents


def render_reading_room(page, content, slug, templates, writers, collections, prefix):
    """Build all three library levels from one ordered catalogue and shared writers."""
    def author_url(writer):
        return f'../reading-author-{writer}/'

    def writer_fields(key):
        writer = writers[key]
        return dict(name=escape(writer["name"]), years=escape(writer["years"]),
                    portrait=escape(prefix + writer["portrait"]))

    if page.get("reading_index"):
        cards = []
        for collection in collections:
            key = collection["writer"]
            writer = writers[key]
            cards.append(templates["reading-card"].substitute(
                **writer_fields(key), anchor=escape(writer["reading"]), href=author_url(key),
                count=material_count(len(collection["works"])), preview=escape(collection["intro"]),
            ))
        # Escaping '<' keeps even literal '</script>' in a work inside the JSON block.
        search_index = json.dumps(reading_search_documents(collections, writers), ensure_ascii=False).replace("<", "\\u003c")
        return templates["reading-index"].substitute(cards='\n'.join(cards), search_index=search_index)

    if "reading_author" in page or "reading_group" in page:
        legacy = page.get("reading_group")
        key = page.get("reading_author") or next(item["writer"] for item in collections
                    if any(group["slug"] == legacy for group in item.get("groups", [])))
        collection = next(item for item in collections if item["writer"] == key)
        groups = {group["slug"]: group for group in collection.get("groups", [])}
        works = [work for work in collection["works"] if not legacy or work.get("group") == legacy]

        def render_shelf(items):
            blocks, rows, current_group = [], [], None

            def finish_group():
                if not rows:
                    return
                listing = '<ul class="library-works">' + '\n'.join(rows) + '</ul>'
                if current_group:
                    heading = escape(groups[current_group]["title"])
                    listing = (f'<section class="library-work-group" id="{escape(current_group)}">'
                               f'<header><h3>{heading}</h3><span>{material_count(len(rows))}</span></header>{listing}</section>')
                blocks.append(listing)

            for work in items:
                group = work.get("group") if not legacy else None
                if group != current_group:
                    finish_group()
                    rows, current_group = [], group
                rows.append(templates["reading-work"].substitute(
                    title=escape(work["title"]), kind=escape(work["kind"]),
                    description=escape(work["description"]), href=f'../{escape(work["slug"])}/',
                    action="Слушать" if work["kind"] == "Аудиозаписи" else "Открыть" if work["kind"] == "О книге" else "Читать",
                    title_tag="h4" if group else "h3",
                    id=escape(work.get("legacy_anchor", work["slug"]) if legacy else work["slug"]),
                ))
            finish_group()
            return '\n'.join(blocks)

        rows = render_shelf(work for work in works if work["kind"] != "Аудиозаписи")
        audio = render_shelf(work for work in works if work["kind"] == "Аудиозаписи")
        audio_html = ('<section class="library-audio-shelf" id="library-audio"><h2>Послушать</h2>'
                      + audio + '</section>') if audio else ''
        selected_groups = [groups[legacy]] if legacy else list(groups.values())
        notes = '\n'.join(f'<section class="library-editorial">{group["notes_html"]}</section>'
                          for group in selected_groups if group.get("notes_html"))
        group_links = '' if legacy or len(groups) < 2 else (
            '<nav class="library-group-nav" aria-label="Подборки автора">' +
            ''.join(f'<a href="#{escape(group["slug"])}">{escape(group.get("label", group["title"]))}</a>' for group in selected_groups) + '</nav>'
        )
        others = ''.join(f'<a href="{author_url(item["writer"])}">{escape(writers[item["writer"]]["name"])}</a>'
                         for item in collections if item["writer"] != key)
        page["breadcrumbs"] = [{"label": "Читальный зал", "href": "../reading/"}, writers[key]["name"]]
        if legacy:
            page["breadcrumbs"] = [{"label": "Читальный зал", "href": "../reading/"},
                                   {"label": writers[key]["name"], "href": author_url(key)}, groups[legacy]["title"]]
        return templates["reading-author"].substitute(
            **writer_fields(key), writer=escape(key), role=escape(writers[key]["role"]),
            intro=escape(collection["intro"]), works=rows, audio=audio_html, authors=others,
            notes=notes, group_links=group_links,
            shelf_title=escape(groups[legacy]["title"]) if legacy else "Произведения и материалы",
        )

    for collection in collections:
        for number, work in enumerate(collection["works"]):
            if work["slug"] != slug:
                continue
            key = collection["writer"]
            page["breadcrumbs"] = [
                {"label": "Читальный зал", "href": "../reading/"},
                {"label": writers[key]["name"], "href": author_url(key)}, work["title"],
            ]
            content = READER_ARTICLE.sub(lambda match: match[0] + ' data-reading-work', content, count=1)
            following = collection["works"][number + 1:number + 2]
            next_link = (f'<a href="../{escape(following[0]["slug"])}/">Далее: {escape(following[0]["title"])}</a>'
                         if following else '')
            return templates["reading-context"].substitute(
                name=escape(writers[key]["name"]), portrait=escape(prefix + writers[key]["portrait"]),
                author_url=author_url(key), content=content, next=next_link,
            )
    return content


def render_page(source, relative, templates, writers, collections=None, gallery_catalog=None):
    if not source.startswith("---\n"):
        raise ValueError("missing page metadata")
    metadata, content = source[4:].split("\n---\n", 1)
    page = json.loads(metadata)
    prefix = "../" * (len(relative.parts) - 1)
    slug = relative.parent.name if relative != Path("index.html") else ""
    section = page_section(slug) if slug else None
    style_names = list(page.get("styles", []))
    script_names = list(page.get("scripts", []))
    redirect_meta = ""
    if "redirect" in page:
        target = escape(page["redirect"], quote=True)
        redirect_meta = f'<meta http-equiv="refresh" content="0;url={target}">'
        content = templates["redirect"].substitute(target=target, label=escape(page.get("redirect_label", "Открыть материал")))
    if collections is None:
        collections = json.loads((ROOT / "templates" / "reading-room.json").read_text(encoding="utf-8"))
    is_reading_room = page.get("reading_index") or "reading_author" in page or "reading_group" in page or any(
        work["slug"] == slug for collection in collections for work in collection["works"]
    )

    if "video_collections" in page:
        content = render_archive_index(page["video_collections"], templates, writers, prefix)
    if "video_collections" in page or "video_archive" in page:
        ensure_asset(style_names, "video-archive.css?v=3")
    if "video_archive" in page:
        first_video = page["videos"][0] if page["videos"] else None
        title = escape(first_video["title"]) if first_video else "Видеозаписи будут добавлены позже"
        src = escape(first_video["src"]) if first_video else ""
        content = templates["archive-album"].substitute(
            **archive_fields(page, writers, prefix), heading=escape(page["heading"]),
            reel=prefix + "assets/video-archive/reel.svg",
            title=title,
            download_attrs=f'href="{src}"' if first_video else 'hidden',
            video_attrs=f'poster="{archive_poster(first_video, prefix)}" src="{src}"' if first_video else '',
            video_fallback=f'<a href="{src}">Открыть видео «{title}»</a>' if first_video else '',
            fallback_attrs=f'href="{src}"' if first_video else 'hidden',
        )
        ensure_asset(script_names, "ufalit-video.js?v=3")

    is_gallery = slug == "gallery" or section == "gallery"
    if is_gallery:
        content, page["photos"] = render_gallery(
            page, content, slug, prefix, templates, writers,
            gallery_catalog if gallery_catalog is not None else load_gallery_catalog(writers),
        )
        ensure_asset(style_names, "gallery.css?v=2")
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
        ensure_asset(script_names, "ufalit-audio.js?v=3")

    if is_reading_room:
        content = render_reading_room(page, content, slug, templates, writers, collections, prefix)
        ensure_asset(style_names, "reading-room.css?v=3")
        if "reading_author" in page or "reading_group" in page:
            ensure_asset(style_names, "illustrations.css?v=2")
        if page.get("reading_index"):
            ensure_asset(script_names, "ufalit-search.js?v=2")
            ensure_asset(script_names, "ufalit-library.js?v=3")

    records = list(DIRECTORY_RECORD.finditer(content))
    if records:
        content = render_writer_directory(content, records, page, prefix, templates, writers)
        ensure_asset(style_names, "directory.css?v=3", prepend=True)
        ensure_asset(script_names, "ufalit-editorial.js?v=7")
    if BIBLIOGRAPHY.search(content):
        ensure_asset(style_names, "bibliography.css")
        ensure_asset(script_names, "ufalit-editorial.js?v=7")
    if READER_ARTICLE.search(content):
        ensure_asset(style_names, "reader.css?v=4")
        ensure_asset(style_names, "illustrations.css?v=2")
        ensure_asset(script_names, "ufalit-reader.js?v=3")

    content = expand_writer_refs(content, prefix, templates, writers)
    content = expand_illustrations(content, templates["zoom-image"])

    if "photos" in page:
        photos = page["photos"]
        content = insert_list(content, "photos", (render_photo(photo, templates["photo"]) for photo in photos))
        content = content.replace("<!-- photo-count -->", photo_count(len(photos)))
        ensure_asset(script_names, "ufalit-gallery.js?v=6")
    elif IMAGE_VIEWER.search(content):
        ensure_asset(script_names, "ufalit-gallery.js?v=6")
        ensure_asset(style_names, "gallery.css?v=2")

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
            id=escape(place["id"]), href=escape(atlas_detail_url(place)),
            label=escape(place["label"]), image=escape(place["image"]),
            category=escape(place["category"]),
        ) for place in places]
        atlas = templates["atlas"].substitute(
            **{key: escape(first.get(key, "")) for key in (
                "title", "writer", "category", "address", "image", "quote",
            )},
            href=escape(atlas_detail_url(first)),
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

    if slug.startswith("reading-") and not is_reading_room and "redirect" not in page and 'href="../reading/"' not in content:
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
    elif is_gallery:
        body_class = "museum gallery-page"
    elif is_reading_room:
        body_class = "museum library-page"
    else:
        body_class = "museum"

    assets = prefix + "assets/"
    styles = [f'<link rel="stylesheet" href="{assets}{escape(name)}">' for name in style_names]
    scripts = [f'<script src="{assets}{escape(name)}" defer></script>' for name in script_names]
    header = templates["header"].substitute(
        prefix=prefix, navigation=render_menu(templates["navigation"].template, relative)
    )
    return templates["base"].substitute(
        title=escape(page["title"]), prefix=prefix, extra_styles="\n".join(styles), redirect_meta=redirect_meta,
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
    collections = json.loads((ROOT / "templates" / "reading-room.json").read_text(encoding="utf-8"))
    gallery_catalog = load_gallery_catalog(writers)
    pages = [SITE / "index.html", *sorted((SITE / "pages").glob("*/index.html"))]
    generated = {}
    for page in pages:
        relative = page.relative_to(SITE)
        try:
            generated[relative] = render_page(page.read_bytes().decode("utf-8"), relative, templates, writers, collections, gallery_catalog)
        except (ValueError, KeyError, TypeError) as exc:
            raise SystemExit(f"Invalid page {relative}: {exc}") from exc

    if args.output:
        copytree(SITE, destination)
    for relative, body in generated.items():
        (destination / relative).write_bytes(body.encode("utf-8"))
    print(f"Built {len(generated)} pages in {destination}")


if __name__ == "__main__":
    main()
