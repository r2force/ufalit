/* Exercise delegated goals without loading the real tracking network. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const listeners = new Map();
const calls = [];
const context = {
  window: { ym: (...args) => calls.push(args) },
  document: { addEventListener: (event, callback) => listeners.set(event, callback) },
};
const source = fs.readFileSync(path.join(__dirname, '../site/assets/ufalit-analytics.js'), 'utf8');
vm.runInNewContext(source, context);
function target({ match = [], closest = [] } = {}) {
  return { matches: selector => match.includes(selector), closest: selector => closest.includes(selector) ? {} : null };
}
function click(link) { listeners.get('click')({ target: { closest: () => link } }); }
click(target({ closest: ['.nav'] }));
click(target({ match: ['.atlas-more'] }));
click(target({ closest: ['.library-work'] }));
click(target({ match: ['.photo-stage, [data-lightbox]'] }));
click({...target(), hash: '#person-amantai'});
listeners.get('play')({target: target({match: ['video']})});
listeners.get('play')({target: target({match: ['audio']})});
listeners.get('ufalit:map-select')();
assert.deepEqual(calls.map(c => c[2]), ['section_open', 'place_detail_open', 'work_open', 'photo_open',
  'biography_open', 'video_play', 'audio_play', 'map_place_open']);
assert.ok(calls.every(c => c[0] === 110934501 && c[1] === 'reachGoal'));
const count = calls.length;
click(target());
assert.equal(calls.length, count, 'unrelated actions are not goals');
context.window.ym = undefined;
assert.doesNotThrow(() => listeners.get('play')({target: target({match: ['video']})}));
console.log('Analytics OK: 8 goals, counter ID, unrelated clicks and blocked tracker');
