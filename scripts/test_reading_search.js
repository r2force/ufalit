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
const school = '../reading-yanabi-shkolnik/';

assert.equal(documents.length, 7);
assert.ok(find('Хулиганов').some(hit => hit.document.href === school));
assert.equal(find('Янаби Хулиганов')[0].document.href, school);
assert.equal(find('Янаби Хулиганов несуществующееслово').length, 0);
assert.equal(find('"учимся прилежно"')[0].document.href, school);
assert.equal(find('«прилежно учимся»').length, 0);
assert.equal(find('ПЕСНЯ ОКТЯБРЕНКА')[0].document.href, '../reading-yanabi-pesnya-oktyabrenka/');
assert.equal(find('Гильманова Насырова 1928').length, 4);
assert.equal(find('Амирова').length, 4);
for (const query of ['Мустай Карим', 'Киекбаев', 'Бикчентаев', 'Газим Шафиков', '"Цветы на камне"']) {
  assert.equal(find(query).length, 0, query);
}
assert.deepEqual(search.terms('"слон и петух" ЁЖ ёж'), ['слон и петух', 'еж']);
assert.deepEqual(search.terms('слон,петух'), ['слон', 'петух']);
for (const query of ['', '   ', '…?!', '""', 'несуществующееслово']) assert.equal(find(query).length, 0);

const work = documents.find(item => item.href === school);
const excerpt = search.snippet(work.text, search.terms('хулиганов'));
assert.equal(excerpt.target, 'Хулиганов');
assert.ok(excerpt.parts.some(part => part.match && part.text === 'Хулиганов'));
assert.ok(excerpt.parts.map(part => part.text).join('').length < 300);
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
console.log('Reading search: full corpus, phrases, all-word matching, ranking, Cyrillic/ё, snippets, removed authors and empty queries passed.');
