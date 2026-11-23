/* Exercise the same search engine used by the browser against the real corpus. */
const assert = require('node:assert/strict');
const {execFileSync} = require('node:child_process');
const path = require('node:path');
const search = require('../site/assets/ufalit-search.js');

const root = path.resolve(__dirname, '..');
const documents = JSON.parse(execFileSync('python3', ['-c', [
  'import json, sys',
  'sys.path.insert(0, "scripts")',
  'import render_site',
  'from pathlib import Path',
  'collections = json.loads(Path("templates/reading-room.json").read_text())',
  'writers = json.loads(Path("templates/writers.json").read_text())',
  'print(json.dumps(render_site.reading_search_documents(collections, writers), ensure_ascii=False))',
].join('\n')], {cwd: root, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024}));
const index = search.prepare(documents);
const find = query => search.search(index, query);
const bear = '../reading-kiekbaev-bear/';

assert.equal(documents.length, 136);
assert.ok(find('полакомиться').some(hit => hit.document.href === bear));
assert.equal(find('Киекбаев полакомиться')[0].document.href, bear);
assert.equal(find('Киекбаев полакомиться несуществующееслово').length, 0);
assert.equal(find('"толстый сук"')[0].document.href, bear);
assert.equal(find('«сук толстый»').length, 0);
assert.ok(find('ПЧЕЛЫ').some(hit => hit.document.href === bear));
assert.equal(find('Улыбка. Восточная сказка')[0].document.href, '../reading-karim-smile/');
assert.equal(find('жесткого тростника')[0].document.href, '../reading-shafikov-talas/');
assert.ok(find('"Цветы на камне"').some(hit => hit.document.kind === 'Аудиозаписи'));
assert.deepEqual(search.terms('"слон и петух" ЁЖ ёж'), ['слон и петух', 'еж']);
assert.deepEqual(search.terms('слон,петух'), ['слон', 'петух']);
for (const query of ['', '   ', '…?!', '""', 'несуществующееслово']) assert.equal(find(query).length, 0);

const work = documents.find(item => item.href === bear);
const excerpt = search.snippet(work.text, search.terms('пчелы'));
assert.equal(excerpt.target, 'пчёлы');
assert.ok(excerpt.parts.some(part => part.match && part.text === 'пчёлы'));
assert.ok(excerpt.parts.map(part => part.text).join('').length < 300);
const endnote = search.snippet(find('жесткого тростника')[0].document.text, search.terms('жесткого тростника'));
assert.ok(endnote.parts.map(part => part.text).join('').includes('Чий'));
assert.ok(endnote.parts.some(part => part.match));
assert.equal(search.highlight('<img onerror=x> ЁЖ', ['еж']).map(part => part.text).join(''), '<img onerror=x> ЁЖ');
assert.ok(search.highlight('ӘКИӘТ һәм ҠОЯШ', ['әкиәт', 'ҡояш']).filter(part => part.match).length === 2);
assert.ok(search.highlight('пчёлы', ['пче', 'пчелы']).some(part => part.text === 'пчёлы' && part.match));
assert.ok(search.snippet('Начало. Слон — и петух. Конец.', ['слон и петух']).target === 'Слон — и петух');
assert.deepEqual(search.highlight('Газим, большой слон и петух. Они пришли.', ['слон', 'и', 'петух']).filter(part => part.match).map(part => part.text), ['слон и петух']);
assert.deepEqual(search.highlight('Слоник, петушок, огромный, пришли', ['слон', 'и', 'петух']).filter(part => part.match), []);
assert.deepEqual(search.highlight('Газим и слон. Петух кричит.', ['слон', 'и', 'петух']).filter(part => part.match).map(part => part.text), ['слон', 'Петух']);
assert.equal(find('слон и петух')[0].document.title, 'Слон и петух');
const wordIndex = search.prepare([
  {title: 'Газим', author: '', alias: '', description: 'Огромный мир', text: 'Пришли великаны.'},
  {title: 'Слон и петух', author: '', alias: '', description: '', text: ''},
]);
assert.deepEqual(search.search(wordIndex, 'и').map(hit => hit.document.title), ['Слон и петух']);
console.log('Reading search: full corpus, phrases, all-word matching, ranking, Cyrillic/ё, snippets, audio and empty queries passed.');
