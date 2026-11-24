"""Verify archive coverage, captions, nested collections and subpath-safe links."""

import json
import re
import unittest
from html import unescape
from html.parser import HTMLParser
from pathlib import Path
from string import Template
from urllib.parse import unquote, urlsplit

import render_site


class Document(HTMLParser):
    def __init__(self, html):
        super().__init__()
        self.tags = []
        self.feed(html)

    def handle_starttag(self, tag, attrs):
        self.tags.append((tag, dict(attrs)))


class GalleryTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.root = render_site.ROOT
        cls.writers = json.loads((cls.root / 'templates/writers.json').read_text())
        cls.catalog, cls.albums = render_site.load_gallery_catalog(cls.writers)
        cls.templates = {name: Template((cls.root / 'templates' / f'{name}.html').read_text().strip())
                         for name in render_site.TEMPLATE_NAMES}

    def render(self, slug):
        relative = Path(f'pages/{slug}/index.html')
        return render_site.render_page((self.root / 'site' / relative).read_text(), relative,
                                       self.templates, self.writers,
                                       gallery_catalog=(self.catalog, self.albums))

    def test_every_writer_and_album_is_reachable_once_per_collection(self):
        self.assertEqual(len(self.catalog), 17)
        self.assertEqual({slug for item in self.catalog for slug in item['slugs']}, set(self.albums))
        for item in self.catalog:
            photos = render_site.gallery_photos(self.albums, item['slugs'])
            self.assertEqual(len(photos), item['count'])
            self.assertEqual(len({photo['id'] for photo in photos}), len(photos))
            self.assertTrue(item['summary'])
        # Aksakov's festival category links back to its parent. Follow it only once.
        self.assertEqual(self.catalog[0]['slugs'], ['gallery-aksakov', 'gallery-19', 'gallery-20', 'gallery-21', 'gallery-22'])

    def test_all_albums_keep_original_photos_captions_order_and_links(self):
        for slug, album in self.albums.items():
            with self.subTest(album=slug):
                html = self.render(slug)
                document = Document(html)
                ids = [attrs['id'] for tag, attrs in document.tags if 'id' in attrs]
                self.assertEqual(len(ids), len(set(ids)))
                figures = re.findall(r'<figure\b[^>]*id="([^"]+)".*?</figure>', html, re.S)
                original = album['page'].get('photos', [])
                self.assertEqual(figures[:len(original)], [photo['id'] for photo in original])
                for photo in original:
                    figure = re.search(r'<figure\b[^>]*id="' + re.escape(photo['id']) + r'".*?</figure>', html, re.S)[0]
                    tags = Document(figure).tags
                    img = next(attrs for tag, attrs in tags if tag == 'img')
                    self.assertEqual(img['src'], photo['src'])
                    self.assertEqual(img['alt'], photo.get('alt', photo.get('caption')))
                    if photo.get('loading', 'lazy') is not None:
                        self.assertEqual(img['loading'], photo.get('loading', 'lazy'))
                    caption = re.search(r'<div class="photo-caption">(.*?)</div>', figure, re.S)[1]
                    expected = photo.get('caption_html', photo.get('caption'))
                    self.assertEqual(unescape(caption), expected)
                for url in re.findall(r'href="([^"#]+)(?:#[^"]*)?"', album['body']):
                    self.assertIn(f'href="{url}"', html)
                self.assertEqual(sum(tag == 'h1' for tag, _ in document.tags), 1)
                self.assertNotIn('<!-- photos -->', html)
                self.assertIn('gallery.css?v=1', html)
                self.assertIn('ufalit-gallery.js?v=5', html)

    def test_writer_cards_match_the_selected_archive_and_counts(self):
        for slug in ['gallery', *self.albums]:
            html = self.render(slug)
            cards = [attrs for tag, attrs in Document(html).tags if attrs.get('class') == 'gallery-writer']
            self.assertEqual(len(cards), len(self.catalog))
            selected = [card for card in cards if 'aria-current' in card]
            self.assertEqual(len(selected), 1)
            expected = next((item for item in self.catalog if slug in item['slugs']), self.catalog[0])
            self.assertEqual(selected[0]['href'], '../../pages/' + self.writers[expected['writer']]['gallery'] + '/')
            if slug == 'gallery' or slug == self.writers[expected['writer']]['gallery']:
                count = len([1 for tag, _ in Document(html).tags if tag == 'figure'])
                self.assertEqual(count, expected['count'])

    def test_links_and_images_resolve_from_the_published_subpath(self):
        for slug in ['gallery', *self.albums]:
            for tag, attrs in Document(self.render(slug)).tags:
                url = attrs.get('src') if tag == 'img' else attrs.get('href') if tag in ('a', 'link', 'script') else None
                if not url or urlsplit(url).scheme or url.startswith('#'):
                    continue
                path = unquote(urlsplit(url).path)
                self.assertFalse(path.startswith('/'), (slug, url))
                target = (self.root / 'site/pages' / slug / path).resolve()
                if path.endswith('/'):
                    target /= 'index.html'
                self.assertTrue(target.is_file(), (slug, url))

    def test_metadata_uses_only_available_caption_or_explicit_fields(self):
        self.assertEqual(render_site.photo_metadata({'caption': 'Амантай'}), '')
        self.assertIn('Ул. Ленина 2', render_site.photo_metadata({'caption': 'Детская библиотека (Ул. Ленина 2)'}))
        self.assertIn('1928 года', render_site.photo_metadata({'caption': 'Из книг 1928 года «Маленьким друзьям»'}))
        self.assertEqual(render_site.photo_category({'caption': 'DSC04010'}), 'Фотоархив')
        photo = {'id': 'photo-test', 'src': 'image.jpg', 'caption': 'Ә Ҙ Ҡ Ң Ө Ҫ Ү Һ Ё',
                 'address': '<script>bad</script>', 'note': '<b>Текст</b>'}
        html = render_site.render_photo(photo, self.templates['photo'])
        self.assertIn('Ә Ҙ Ҡ Ң Ө Ҫ Ү Һ Ё', html)
        self.assertNotIn('<script>', html)
        self.assertIn('&lt;b&gt;Текст&lt;/b&gt;', html)

    def test_article_viewer_keeps_its_styles_without_archive_controls(self):
        source = '---\n{"title":"Статья"}\n---\n<article data-image-viewer><figure><a href="photo.jpg"><img src="photo.jpg" alt="Фото"></a></figure></article>'
        html = render_site.render_page(source, Path('pages/article/index.html'), self.templates, self.writers)
        self.assertIn('ufalit-gallery.js?v=5', html)
        self.assertIn('gallery.css?v=1', html)
        self.assertNotIn('gallery-writers', html)


if __name__ == '__main__':
    unittest.main()
