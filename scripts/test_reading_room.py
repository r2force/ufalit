"""Check catalogue coverage, three-level navigation, and preservation of reading content."""

import json
import unittest
from html.parser import HTMLParser
from pathlib import Path
from string import Template
from urllib.parse import unquote, urlsplit
from unittest.mock import patch

import render_site


class Document(HTMLParser):
    def __init__(self, source):
        super().__init__()
        self.tags, self.text = [], []
        self.feed(source)

    def handle_starttag(self, tag, attrs):
        self.tags.append((tag, dict(attrs)))

    def handle_data(self, data):
        self.text.append(data)


class ReadingRoomTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.root = render_site.ROOT
        cls.collections = json.loads((cls.root / 'templates/reading-room.json').read_text())
        cls.writers = json.loads((cls.root / 'templates/writers.json').read_text())
        cls.templates = {name: Template((cls.root / 'templates' / f'{name}.html').read_text().strip())
                         for name in render_site.TEMPLATE_NAMES}

    def render(self, slug):
        relative = Path(f'pages/{slug}/index.html')
        source = (self.root / 'site' / relative).read_text()
        return source, render_site.render_page(source, relative, self.templates, self.writers, self.collections)

    def test_catalogue_covers_every_reading_material_once(self):
        writers = [item['writer'] for item in self.collections]
        works = [work['slug'] for item in self.collections for work in item['works']]
        self.assertEqual(len(writers), 6)
        self.assertEqual(len(writers), len(set(writers)))
        self.assertEqual(len(works), 17)
        self.assertEqual(len(works), len(set(works)))
        pages = {p.parent.name for p in (self.root / 'site/pages').glob('reading-*/index.html')
                 if not p.parent.name.startswith('reading-author-')}
        self.assertEqual(set(works), pages)
        _, html = self.render('reading')
        cards = [attrs for _, attrs in Document(html).tags if 'data-library-author' in attrs]
        self.assertEqual([card['id'] for card in cards], [self.writers[key]['reading'] for key in writers])

    def test_author_shelves_keep_original_order_and_audio_separate(self):
        for collection in self.collections:
            with self.subTest(writer=collection['writer']):
                _, html = self.render('reading-author-' + collection['writer'])
                document = Document(html)
                work_links = [attrs['href'] for tag, attrs in document.tags if tag == 'a'
                              and any(attrs.get('href') == f'../{work["slug"]}/' for work in collection['works'])]
                self.assertEqual(work_links, [f'../{work["slug"]}/' for work in collection['works']])
                self.assertEqual(sum(tag == 'h1' for tag, _ in document.tags), 1)
                self.assertIn(f'../personalities/#person-{collection["writer"]}', html)
                if collection['writer'] == 'karim':
                    self.assertIn('id="library-audio"', html)
                if collection['writer'] == 'aksakov':
                    self.assertEqual(html.count('class="library-kind">О книге'), 3)

    def test_work_texts_and_audio_metadata_are_preserved(self):
        for collection in self.collections:
            for work in collection['works']:
                with self.subTest(work=work['slug']):
                    source, html = self.render(work['slug'])
                    if '<article' in source:
                        original = source[source.index('<article'):source.index('</article>')]
                        result = html[html.index('<article'):html.index('</article>')]
                        self.assertEqual(''.join(Document(original).text), ''.join(Document(result).text))
                        self.assertIn('data-reading-work', result)
                    else:
                        metadata = json.loads(source[4:].split('\n---\n', 1)[0])
                        for track in metadata['tracks']:
                            self.assertIn(track['src'], html)
                    self.assertIn(f'href="../reading-author-{collection["writer"]}/"', html)
                    self.assertIn('aria-current="location">Читальный зал', html)

    def test_full_text_index_includes_body_endnotes_and_track_names(self):
        documents = render_site.reading_search_documents(self.collections, self.writers)
        self.assertEqual(len(documents), 17)
        by_url = {item['href']: item for item in documents}
        bear = by_url['../reading-kiekbaev-bear/']
        self.assertIn('полакомиться', bear['text'])
        self.assertNotIn('полакомиться', bear['title'] + bear['description'])
        self.assertIn('Чий — вид жесткого тростника, растущего у реки.', by_url['../reading-shafikov-talas/']['text'])
        self.assertIn('Теперь я вырос, октябренком стал,', by_url['../reading-yanabi-poems/']['text'])
        self.assertIn('Цветы на камне', by_url['../reading-karim-audio/']['text'])
        _, html = self.render('reading')
        start = html.index('<script type="application/json" data-library-index>') + len('<script type="application/json" data-library-index>')
        self.assertEqual(json.loads(html[start:html.index('</script>', start)]), documents)

    def test_search_text_extraction_and_json_do_not_expose_markup(self):
        text = render_site.ReadingText('<p>Әкиәт <b>һәм</b> шиғыр.</p><p>Ёж &amp; лиса<br>Ҡояш</p>'
                                       '<script>hidden()</script><style>hidden{}</style><template>hidden</template>').text()
        self.assertEqual(text, 'Әкиәт һәм шиғыр. Ёж & лиса Ҡояш')
        payload = [{'text': '</script><img src=x onerror=alert(1)>'}]
        with patch.object(render_site, 'reading_search_documents', return_value=payload):
            _, html = self.render('reading')
        self.assertNotIn('</script><img', html)
        self.assertIn('\\u003c/script>', html)

    def test_all_library_links_images_and_fragments_resolve_under_subpath(self):
        slugs = ['reading'] + ['reading-author-' + item['writer'] for item in self.collections]
        slugs += [work['slug'] for item in self.collections for work in item['works']]
        for slug in slugs:
            _, html = self.render(slug)
            for tag, attrs in Document(html).tags:
                url = attrs.get('href') if tag == 'a' else attrs.get('src') if tag in ('img', 'script') else None
                if not url or urlsplit(url).scheme:
                    continue
                parsed = urlsplit(unquote(url))
                self.assertFalse(parsed.path.startswith('/'), (slug, url))
                target = (self.root / 'site/pages' / slug / parsed.path).resolve()
                if not parsed.path or target.is_dir():
                    target = target / 'index.html'
                self.assertTrue(target.is_file(), (slug, url, target))
                if parsed.fragment:
                    target_slug = target.parent.name
                    if target.suffix == '.html':
                        _, target_html = self.render(target_slug)
                        self.assertIn(f'id="{parsed.fragment}"', target_html, (slug, url))


if __name__ == '__main__':
    unittest.main()
