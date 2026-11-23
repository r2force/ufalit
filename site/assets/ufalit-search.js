/* Shared, DOM-independent full-text matching and snippets for the reading room. */
(() => {
  const normalize = text => text.toLocaleLowerCase('ru').replaceAll('ё', 'е').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();

  function terms(query) {
    const values = [...query.matchAll(/"([^"]+)"|«([^»]+)»|(\S+)/gu)]
      .flatMap(match => match[1] !== undefined || match[2] !== undefined
        ? [normalize(match[1] ?? match[2])] : normalize(match[3]).split(' ')).filter(Boolean);
    return [...new Set(values)];
  }

  function pattern(words) {
    if (!words.length) return null;
    const meaningful = words.filter(word => word.length > 2);
    const phrases = words.length > 1 ? [words.join(' ')] : [];
    // Terms contain only Unicode letters, numbers and spaces, never regex syntax.
    const alternatives = [...new Set([...phrases, ...(meaningful.length ? meaningful : words)])].sort((a, b) => b.length - a.length)
      .map(word => word.replaceAll('е', '[её]').split(' ').join('[^\\p{L}\\p{N}]+'));
    return new RegExp(`(?<![\\p{L}\\p{N}])(?:${alternatives.join('|')})(?![\\p{L}\\p{N}])`, 'giu');
  }

  function prepare(documents) {
    return documents.map((document, order) => ({document, order, fields: [
      normalize(document.title), normalize(`${document.author} ${document.alias}`),
      normalize(document.description), normalize(document.text),
    ]}));
  }

  function search(index, query) {
    const words = terms(query);
    if (!words.length) return [];
    const weights = [18, 10, 6, 1];
    const matches = [];
    for (const entry of index) {
      let score = 0;
      for (const word of words) {
        const field = entry.fields.findIndex(text => (` ${text} `).includes(` ${word} `));
        if (field < 0) { score = 0; break; }
        score += weights[field];
      }
      if (score) {
        if (entry.fields[0] === normalize(query)) score += 100;
        matches.push({document: entry.document, order: entry.order, score});
      }
    }
    return matches.sort((a, b) => b.score - a.score || a.order - b.order);
  }

  function highlight(text, words) {
    const expression = pattern(words);
    const parts = [];
    let previous = 0;
    if (expression) {
      for (const match of text.matchAll(expression)) {
        if (match.index > previous) parts.push({text: text.slice(previous, match.index), match: false});
        parts.push({text: match[0], match: true});
        previous = match.index + match[0].length;
      }
    }
    if (previous < text.length) parts.push({text: text.slice(previous), match: false});
    return parts;
  }

  function snippet(text, words, length = 260) {
    const expression = pattern(words);
    const match = expression ? expression.exec(text) : null;
    let start = match ? Math.max(0, match.index - 75) : 0;
    if (start) {
      const boundary = text.indexOf(' ', start);
      if (boundary >= 0 && boundary < match.index) start = boundary + 1;
    }
    let end = Math.min(text.length, Math.max(start + length, match ? match.index + match[0].length : 0));
    if (end < text.length) {
      const boundary = text.lastIndexOf(' ', end);
      if (boundary > (match ? match.index + match[0].length : start)) end = boundary;
    }
    const excerpt = (start ? '…' : '') + text.slice(start, end) + (end < text.length ? '…' : '');
    return {parts: highlight(excerpt, words), target: match ? match[0] : ''};
  }

  const api = {normalize, terms, prepare, search, highlight, snippet};
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else window.UfalitSearch = api;
})();
