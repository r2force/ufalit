"""Verify that contacts never leak into built links, labels, attributes or search."""

import json
import unittest
from html.parser import HTMLParser
from pathlib import Path
from string import Template
from unittest.mock import patch

import render_site
from email_contacts import protect_email_links


class EmailContactTests(unittest.TestCase):
    def test_address_label_and_attributes_are_hidden(self):
        source = ('<p>Контакты: <a id="contact" class="contact-link" href="mailto:library@example.org" '
                  'title="library@example.org" aria-label="library@example.org" '
                  'data-address="library@example.org"><span>library&#64;example.org</span></a>.</p>')
        result = protect_email_links(source)
        self.assertNotIn("library", result)
        self.assertNotIn("mailto:", result)
        self.assertIn('id="contact"', result)
        self.assertIn('class="email-contact contact-link"', result)
        self.assertIn('aria-label="Написать письмо"', result)
        self.assertIn('>Написать письмо</button>', result)
        self.assertIn('<noscript>', result)
        self.assertTrue(result.startswith('<p>Контакты: '))
        self.assertTrue(result.endswith('.</p>'))

    def test_quoted_unquoted_and_entity_encoded_targets(self):
        for href in ('href=mailto:library@example.org', "href='MAILTO:library@example.org'",
                     'href=" mailto:library&#64;example.org "', 'href="&#109;ailto:library%40example.org"'):
            with self.subTest(href=href):
                result = protect_email_links(f'<a {href}>Связаться с библиотекой</a>')
                self.assertNotIn('example', result)
                self.assertIn('>Связаться с библиотекой</button>', result)

    def test_target_query_unicode_and_multiple_contacts_round_trip(self):
        targets = ['mailto:library@example.org?subject=Вопрос%20о%20книге&body=Здравствуйте',
                   'mailto:книги@пример.рф?cc=reader%40example.org']
        source = '\n'.join(f'<a href="{href.replace("&", "&amp;")}">Написать</a>' for href in targets)
        document = render_site.ReadingText(protect_email_links(source))
        class Tokens(HTMLParser):
            def handle_starttag(self, tag, attrs):
                if tag == 'button':
                    tokens.append(dict(attrs)['data-email-contact'])

        tokens = []
        Tokens().feed(protect_email_links(source))
        self.assertEqual([bytes.fromhex(token).decode() for token in tokens], targets)
        self.assertNotIn('example', document.text())

    def test_other_markup_and_repeated_build_are_unchanged(self):
        source = '<!-- mailto:comment --><script>const x = "<a href=mailto:example>";</script><a href="/page/">Статья</a>'
        self.assertEqual(protect_email_links(source), source)
        protected = protect_email_links('<a href="mailto:library@example.org">Написать</a>')
        self.assertEqual(protect_email_links(protected), protected)
        prefix = '<p>Справка\u2028о библиотеке</p>\r\n'
        self.assertEqual(protect_email_links(prefix + '<a href="mailto:library@example.org">Написать</a>'),
                         prefix + protected)

    def test_final_page_protects_shared_templates_and_uses_relative_script(self):
        templates = {name: Template((render_site.ROOT / 'templates' / f'{name}.html').read_text().strip())
                     for name in render_site.TEMPLATE_NAMES}
        templates['footer'] = Template('<footer><a href="mailto:library@example.org">library@example.org</a></footer>')
        source = '---\n' + json.dumps({'title': 'Контакты'}) + '\n---\n<p>Библиотека</p>'
        for relative, prefix in ((Path('index.html'), ''), (Path('pages/contacts/index.html'), '../../')):
            result = render_site.render_page(source, relative, templates, {}, [])
            self.assertNotIn('library@example.org', result)
            self.assertNotIn('mailto:', result)
            self.assertEqual(result.count(f'src="{prefix}assets/ufalit-contact.js?v=1"'), 1)
        templates['footer'] = Template('<footer>Библиотека</footer>')
        self.assertNotIn('ufalit-contact.js', render_site.render_page(source, Path('index.html'), templates, {}, []))

    def test_contact_does_not_leak_through_reading_search(self):
        collection = [{'writer': 'test', 'works': [{'slug': 'test', 'title': 'Статья', 'kind': 'Текст', 'description': ''}]}]
        source = '---\n{}\n---\n<p>Материал <a href="mailto:library@example.org">library@example.org</a></p>'
        with patch.object(Path, 'read_text', return_value=source):
            documents = render_site.reading_search_documents(collection, {'test': {'name': 'Автор'}})
        self.assertNotIn('example', json.dumps(documents))
        self.assertNotIn('Включите JavaScript', documents[0]['text'])

    def test_unclosed_contact_fails_build_instead_of_leaking_address(self):
        with self.assertRaisesRegex(ValueError, 'unclosed mailto'):
            protect_email_links('<a href="mailto:library@example.org">Адрес')


if __name__ == '__main__':
    unittest.main()
