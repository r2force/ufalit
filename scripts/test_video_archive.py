"""Integration checks for collection data, the single player and its preview links."""

import json
import unittest
from html.parser import HTMLParser
from pathlib import Path
from string import Template

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

    def test_single_player_preserves_all_recordings_and_download(self):
        for slug, count in (("video-389", 4), ("video-388", 7), ("video-81", 14)):
            with self.subTest(collection=slug):
                page, document = self.render(slug)
                tags = document.tags
                players = [attrs for tag, attrs in tags if tag == "video"]
                self.assertEqual(len(players), 1)
                self.assertEqual(players[0]["src"], page["videos"][0]["src"])
                self.assertIn("controls", players[0])
                choices = [attrs for tag, attrs in tags if "data-video-title" in attrs]
                self.assertEqual(len(choices), count)
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
                for removed in ("смотрите в плеере или скачивайте", "формат mp4", "скачать mp4", "запись 01"):
                    self.assertNotIn(removed, visible)

    def test_collection_labels_contain_names_portraits_and_counts(self):
        _, document = self.render("videos")
        labels = [attrs for _, attrs in document.tags if attrs.get("class") == "archive-can-label"]
        self.assertEqual(len(labels), 3)
        links = [attrs for tag, attrs in document.tags if tag == "a" and "archive-collection " in attrs.get("class", "")]
        self.assertEqual([link["href"] for link in links], ["../video-389/", "../video-388/", "../video-81/"])
        visible = " ".join(document.text).lower()
        for removed in ("открыть коллекцию", "цифровая видеоколлекция", "литературная коллекция"):
            self.assertNotIn(removed, visible)
        for name in ("Аксаков Сергей Тимофеевич", "Злобин Степан Павлович", "Мустай Карим"):
            self.assertIn(name.lower(), visible)


if __name__ == "__main__":
    unittest.main()
