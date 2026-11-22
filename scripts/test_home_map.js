// Lightweight regression test: SVG <a> does not implement HTMLAnchorElement.hash.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const ids = ['places-text-004', 'places-text-016', 'places-text-031', 'places-text-248', 'places-text-318', 'places-text-437'];
function link(id) {
  const attributes = {href: `pages/places/#${id}`};
  return {
    attributes,
    classList: {toggle(name, value) { this[name] = value; }},
    getAttribute(name) { return attributes[name]; },
    setAttribute(name, value) { attributes[name] = value; },
    removeAttribute(name) { delete attributes[name]; },
    addEventListener(name, callback) { this.callback = callback; },
  };
}
const links = [...ids.map(link), ...ids.map(link)];
const nodes = {};
for (const selector of ['.atlas-feature h3', '.atlas-writer', '.atlas-kicker', '.atlas-address', '.atlas-feature img', '.atlas-quote', '.atlas-more']) nodes[selector] = {};
nodes['.atlas-description'] = { replaceChildren(...children) { this.children = children; } };
nodes['.atlas-key'] = {scrollIntoView() {}};
const atlas = {querySelector: selector => nodes[selector], querySelectorAll: () => links};
const document = {querySelector: () => atlas, createElement: () => ({})};
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../site/assets/ufalit-map.js'), 'utf8'), {document, window: {matchMedia: () => ({matches: false})}});
for (const item of links) {
  let prevented = false;
  item.callback({button: 0, preventDefault() { prevented = true; }});
  const id = item.getAttribute('href').split('#')[1];
  assert.equal(prevented, true);
  assert.equal(nodes['.atlas-more'].href, `pages/places/#${id}`);
  assert.equal(item.classList['is-selected'], true);
  assert.equal(item.getAttribute('aria-current'), 'true');
  assert.ok(nodes['.atlas-feature h3'].textContent);
  assert.ok(nodes['.atlas-description'].children.length);
}
let prevented = false;
links[0].callback({button: 0, ctrlKey: true, preventDefault() { prevented = true; }});
assert.equal(prevented, false, 'modified clicks must keep the normal link behavior');
console.log('Home map: SVG and HTML links select all six places; modified clicks remain links.');
