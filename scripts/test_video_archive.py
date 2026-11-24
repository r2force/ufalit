"""Integration checks for collection data, the single player and its preview links."""

import json
import unittest
from html.parser import HTMLParser
from pathlib import Path
from string import Template
from urllib.parse import urlsplit, unquote

import render_site


class Document(HTMLParser):
    def __init__(self, html):
        super().__init__()
        self.tags = []
        self.text = []
        self.feed(html)

    def handle_starttag(self, tag, attributes):
        self.tags.append((tag, dict(attributes)))

    def handle_data(self, text):
        self.text.append(text)


class VideoArchiveTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.root = render_site.ROOT
        cls.templates = {
            name: Template((cls.root / "templates" / f"{name}.html").read_text().strip())
            for name in render_site.TEMPLATE_NAMES
        }
        cls.writers = json.loads((cls.root / "templates/writers.json").read_text())

    def render(self, slug):
        relative = Path(f"pages/{slug}/index.html")
        source = (self.root / "site" / relative).read_text()
        page = json.loads(source[4:].split("\n---\n", 1)[0])
        return page, Document(render_site.render_page(
            source, relative, self.templates, self.writers,
        ))

    def test_single_player_supports_current_recordings_and_empty_collections(self):
        for slug in ("video-389", "video-388", "video-81"):
            with self.subTest(collection=slug):
                page, document = self.render(slug)
                tags = document.tags
                players = [attrs for tag, attrs in tags if tag == "video"]
                self.assertEqual(len(players), 1)
                self.assertIn("controls", players[0])
                if not page["videos"]:
                    self.assertNotIn("src", players[0])
                    self.assertNotIn("poster", players[0])
                    self.assertFalse(any("data-video-title" in attrs for _, attrs in tags))
                    self.assertFalse(any("download" in attrs and "href" in attrs for _, attrs in tags))
                    self.assertIn("Видеозаписи будут добавлены позже", " ".join(document.text))
                    continue
                self.assertEqual(players[0]["src"], page["videos"][0]["src"])
                choices = [attrs for tag, attrs in tags if "data-video-title" in attrs]
                self.assertEqual(len(choices), len(page["videos"]))
                self.assertEqual(
                    [(item["data-video-title"], item["href"]) for item in choices],
                    [(item["title"], item["src"]) for item in page["videos"]],
                )
                self.assertEqual(sum("aria-current" in item for item in choices), 1)
                self.assertEqual(choices[0]["aria-current"], "true")
                downloads = [attrs for tag, attrs in tags if tag == "a" and "download" in attrs]
                self.assertEqual(len(downloads), 1)
                self.assertEqual(downloads[0]["href"], choices[0]["href"])
                self.assertIn("aria-label", downloads[0])
                self.assertFalse(any(tag == "input" for tag, _ in tags))
                for item in choices:
                    poster = (self.root / "site/pages" / slug / item["data-video-poster"]).resolve()
                    self.assertTrue(poster.read_bytes().startswith(b"\xff\xd8"), poster)
                    self.assertGreater(poster.stat().st_size, 1000)
                    self.assertEqual(Path(item["href"]).stem, poster.stem)
                    self.assertTrue((self.root / "site/pages" / slug / item["href"]).resolve().is_file())
                visible = " ".join(document.text).lower()
                for removed in ("смотрите в плеере или скачивайте", "формат mp4", "скачать mp4", "запись 01", "вернуться к коллекциям", "к началу страницы"):
                    self.assertNotIn(removed, visible)

    def test_collection_labels_contain_names_portraits_and_counts(self):
        _, document = self.render("videos")
        labels = [attrs for _, attrs in document.tags if attrs.get("class") == "archive-can-label"]
        self.assertEqual(len(labels), 3)
        links = [attrs for tag, attrs in document.tags if tag == "a" and "archive-collection " in attrs.get("class", "")]
        self.assertEqual([link["href"] for link in links], ["../video-389/", "../video-388/", "../video-81/"])
        visible = " ".join(document.text).lower()
        for removed in ("открыть коллекцию", "цифровая видеоколлекция", "литературная коллекция", "смотрите в своём темпе"):
            self.assertNotIn(removed, visible)
        for name in ("Аксаков Сергей Тимофеевич", "Злобин Степан Павлович", "Мустай Карим"):
            self.assertIn(name.lower(), visible)

    def test_new_recordings_still_render_player_choices_and_downloads(self):
        relative = Path('pages/video-389/index.html')
        source = (self.root / 'site' / relative).read_text()
        page = json.loads(source[4:].split('\n---\n', 1)[0])
        page['videos'] = [{'title': 'Новая запись', 'src': '../../assets/video/aksakov/new.mp4'}]
        source = '---\n' + json.dumps(page, ensure_ascii=False) + '\n---\n'
        document = Document(render_site.render_page(source, relative, self.templates, self.writers))
        player = next(attrs for tag, attrs in document.tags if tag == 'video')
        self.assertEqual(player['src'], page['videos'][0]['src'])
        choices = [attrs for _, attrs in document.tags if 'data-video-title' in attrs]
        self.assertEqual(len(choices), 1)
        self.assertEqual(choices[0]['data-video-title'], 'Новая запись')
        download = next(attrs for tag, attrs in document.tags if tag == 'a' and 'download' in attrs)
        self.assertEqual(download['href'], player['src'])
        self.assertNotIn('hidden', download)

    def test_audio_player_and_its_styles_remain_ready_for_new_tracks(self):
        page = dict(title='Аудиозаписи', audio_studio=dict(
            kicker='Аудиофонд', heading='Аудиозаписи', intro='Новые записи',
            voice='Авторское чтение', description=''), tracks=[
                dict(id='track-01', title='Новая запись', src='../../assets/audio/new.ogg')])
        source = '---\n' + json.dumps(page, ensure_ascii=False) + '\n---\n'
        html = render_site.render_page(source, Path('pages/audio/index.html'), self.templates, self.writers)
        self.assertIn('class="audio-studio"', html)
        self.assertIn('class="audio-deck"', html)
        self.assertIn('class="audio-item"', html)
        self.assertIn('ufalit-audio.js', html)
        self.assertIn('audio-studio', (self.root / 'site/assets/museum.css').read_text())

    def test_published_media_references_point_to_existing_files(self):
        referenced = set()
        extensions = {'.mp4', '.webm', '.ogg', '.mp3', '.wav', '.m4a'}
        for path in (self.root / 'site').rglob('*.html'):
            relative = path.relative_to(self.root / 'site')
            html = render_site.render_page(path.read_text(), relative, self.templates, self.writers)
            for _, attrs in Document(html).tags:
                for name in ('href', 'src'):
                    url = urlsplit(unquote(attrs.get(name, '')))
                    if url.scheme or Path(url.path).suffix.lower() not in extensions:
                        continue
                    target = (path.parent / url.path).resolve()
                    self.assertTrue(target.is_file(), (relative, url.path))
                    referenced.add(target)
        available = {path.resolve() for path in (self.root / 'site/assets').rglob('*')
                     if path.suffix.lower() in extensions}
        self.assertEqual(referenced, available)


if __name__ == "__main__":
    unittest.main()
