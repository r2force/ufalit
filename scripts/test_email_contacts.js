// Verify lazy activation and exact mailto recovery without opening a mail client.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '../site/assets/ufalit-contact.js'), 'utf8');
const listeners = {};
const window = { location: { href: 'https://example.org/ufalit/' } };
const document = { addEventListener: (name, listener) => { listeners[name] = listener; } };
vm.runInNewContext(source, { document, window, TextDecoder, Uint8Array });
assert.equal(window.location.href, 'https://example.org/ufalit/', 'loading the page does not reveal a target');
function activate(token) {
  listeners.click({ target: { closest: () => ({ dataset: { emailContact: token } }) } });
}
for (const href of ['mailto:library@example.org?subject=Вопрос&body=Здравствуйте', 'MAILTO:книги@пример.рф?cc=reader%40example.org']) {
  activate(Buffer.from(href).toString('hex'));
  assert.equal(window.location.href, href);
}
window.location.href = 'unchanged';
for (const token of ['', 'zz', '123', 'ff', Buffer.from('https://example.org/').toString('hex'), Buffer.from('mailto:x\r\nheader:y').toString('hex')]) {
  activate(token);
  assert.equal(window.location.href, 'unchanged');
}
listeners.click({ target: { closest: () => null } });
assert.equal(window.location.href, 'unchanged');
console.log('Email contacts: lazy activation, exact targets and invalid tokens passed');
