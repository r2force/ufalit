"""Check catalogue coverage, three-level navigation, and preservation of reading content."""

import json
import unittest
import hashlib
import re
from collections import Counter
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

    def redirects(self):
        result = {}
        for path in (self.root / 'site/pages').glob('reading-*/index.html'):
            page = json.loads(path.read_text()[4:].split('\n---\n', 1)[0])
            if 'redirect' in page:
                result[path.parent.name] = page['redirect']
        return result

    def test_catalogue_covers_every_reading_material_once(self):
        writers = [item['writer'] for item in self.collections]
        works = [work['slug'] for item in self.collections for work in item['works']]
        self.assertEqual(len(writers), 6)
        self.assertEqual(len(writers), len(set(writers)))
        self.assertEqual(len(works), 112)
        self.assertEqual(len(works), len(set(works)))
        pages = {p.parent.name for p in (self.root / 'site/pages').glob('reading-*/index.html')
                 if not p.parent.name.startswith('reading-author-')}
        groups = {group['slug'] for item in self.collections for group in item.get('groups', [])}
        self.assertEqual(set(works) | groups | set(self.redirects()), pages)
        self.assertFalse(set(works) & groups)
        self.assertFalse(set(works) & set(self.redirects()))
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
        self.assertEqual(len(documents), 112)
        by_url = {item['href']: item for item in documents}
        bear = by_url['../reading-kiekbaev-bear/']
        self.assertIn('полакомиться', bear['text'])
        self.assertNotIn('полакомиться', bear['title'] + bear['description'])
        self.assertIn('Чий — вид жесткого тростника, растущего у реки.', by_url['../reading-shafikov-talas/']['text'])
        self.assertIn('Теперь я вырос, октябренком стал,', next(item['text'] for item in documents if item['title'] == 'Песня октябрёнка'))
        self.assertTrue(any('Цветы на камне' in item['text'] and item['kind'] == 'Аудиозаписи' for item in documents))
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
        slugs += [group['slug'] for item in self.collections for group in item.get('groups', [])]
        slugs += list(self.redirects())
        for slug in slugs:
            _, html = self.render(slug)
            tags = Document(html).tags
            ids = [attrs['id'] for _, attrs in tags if 'id' in attrs]
            self.assertEqual(len(ids), len(set(ids)), slug)
            for tag, attrs in tags:
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

    def test_split_preserves_every_original_paragraph_image_and_audio_track(self):
        audit = json.loads((self.root / 'migration/evidence/2026-11-23/reading-split-check.json').read_text())
        groups = {group['slug']: group for item in self.collections for group in item.get('groups', [])}
        for record in audit['sources']:
            if record.get('unchanged'):
                continue
            with self.subTest(source=record['source']):
                sources = [(self.root / 'site/pages' / slug / 'index.html').read_text() for slug in record['pages']]
                if 'tracks' in record:
                    tracks = [track for source in sources for track in json.loads(source[4:].split('\n---\n', 1)[0])['tracks']]
                    self.assertEqual(tracks, record['tracks'])
                    self.assertEqual(len(sources), 1)
                    continue
                sources.append(groups[record['notes_group']].get('notes_html', '') if record['notes_group'] else '')
                if record.get('destination_anchor'):
                    sources[0] = sources[0].split('id="' + record['destination_anchor'] + '">', 1)[1].split('</section>', 1)[0]
                combined = '\n'.join(sources)
                paragraphs = re.findall(r'<(?:p|h1|h3)\b[^>]*>.*?</(?:p|h1|h3)>', combined, re.S)
                actual = Counter(hashlib.sha256(re.sub(r'\s+', ' ', ''.join(Document(part).text)).strip().encode()).hexdigest()
                                 for part in paragraphs)
                for digest, count in record['paragraph_hashes'].items():
                    self.assertGreaterEqual(actual[digest], count, (record['source'], digest))
                images = Counter(re.findall(r'<img\b[^>]*\bsrc="([^"]+)"', combined))
                for image, count in Counter(record['images']).items():
                    self.assertGreaterEqual(images[image], count, (record['source'], image))

    def test_editorial_notes_are_on_author_shelf_and_legacy_groups_keep_links(self):
        collection = next(item for item in self.collections if item['writer'] == 'yanabi')
        _, author = self.render('reading-author-yanabi')
        self.assertIn('Гильманова Альбина и Насырова Диана', author)
        self.assertLess(author.index('Произведения и материалы'), author.index('Гильманова Альбина'))
        for work in collection['works']:
            source, _ = self.render(work['slug'])
            self.assertNotIn('Гильманова Альбина', source)
        self.assertEqual([work['title'] for work in collection['works']], ['Школьник', 'Песня октябрёнка', 'Школьные частушки', 'Слон и петух'])
        for item in self.collections:
            for group in item.get('groups', []):
                _, html = self.render(group['slug'])
                for work in item['works']:
                    if work.get('group') == group['slug']:
                        self.assertIn(f'href="../{work["slug"]}/"', html)
                        if 'legacy_anchor' in work:
                            self.assertIn(f'id="{work["legacy_anchor"]}"', html)

    def test_audio_is_two_original_multitrack_players(self):
        karim = next(item for item in self.collections if item['writer'] == 'karim')
        audio = [work for work in karim['works'] if work['kind'] == 'Аудиозаписи']
        self.assertEqual([work['slug'] for work in audio], ['reading-karim-audio', 'reading-karim-nazarova'])
        self.assertEqual([work['title'] for work in audio], ['Стихотворения. Читает Мустай Карим', 'Стихи в исполнении Зайнаб Назыровой и песни на стихи Мустая Карима'])
        _, author = self.render('reading-author-karim')
        shelf = author.split('id="library-audio">', 1)[1].split('</section>', 1)[0]
        self.assertEqual(sum(tag == 'a' for tag, _ in Document(shelf).tags), 2)
        for work, count in zip(audio, [18, 5]):
            source, result = self.render(work['slug'])
            page = json.loads(source[4:].split('\n---\n', 1)[0])
            self.assertEqual(len(page['tracks']), count)
            self.assertEqual(result.count('class="audio-studio"'), 1)
            self.assertEqual(result.count('class="audio-item"'), count)
            self.assertIn('ufalit-audio.js', result)

    def test_footnotes_belong_to_their_works(self):
        _, author = self.render('reading-author-karim')
        self.assertNotIn('Сармасан - река', author)
        self.assertNotIn('ИЗ «МОНОЛОГОВ ПРОМЕТЕЯ»', author)
        _, poem = self.render('reading-karim-v-krayu-moey-lyubimoy')
        self.assertIn('Сармасан - река в Башкирии.', poem)
        self.assertIn('href="#note-sarmasan"', poem)
        self.assertIn('href="#ref-sarmasan"', poem)
        for slug in ['reading-karim-kogda-grustno', 'reading-karim-kogda-sgorela-agaziya', 'reading-karim-pust-vremya-ne-ostanavlivaetsya']:
            _, poem = self.render(slug)
            self.assertIn('ИЗ «МОНОЛОГОВ ПРОМЕТЕЯ»', poem)

    def test_dedications_moved_to_profile_and_old_addresses_redirect(self):
        shafikov = next(item for item in self.collections if item['writer'] == 'shafikov')
        self.assertFalse(any(work.get('group') == 'reading-shafikov-dedications' for work in shafikov['works']))
        _, profile = self.render('personalities')
        section = profile.split('id="shafikov-dedications">', 1)[1].split('</section>', 1)[0]
        for name in ['Мустай Карим', 'Георгий Кацерик', 'Равиль Бикбаев', 'Ирек Киньябулатов', 'Айдар Хусаинов']:
            self.assertIn(name, section)
        self.assertEqual(section.count('Путь пройденный обозревая, все же'), 1)
        redirects = self.redirects()
        self.assertEqual(len(redirects), 28)
        self.assertEqual(redirects['reading-shafikov-dedications'], '../personalities/#shafikov-dedications')
        for slug, target in redirects.items():
            _, result = self.render(slug)
            self.assertIn(f'content="0;url={target}"', result)
            self.assertIn(f'href="{target}"', result)


if __name__ == '__main__':
    unittest.main()
