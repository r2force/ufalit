/* Resolve a protected mailto only when its button is activated. */
(() => {
  document.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-email-contact]");
    if (!button) return;
    const token = button.dataset.emailContact;
    if (!/^(?:[0-9a-f]{2})+$/i.test(token)) return;
    try {
      const bytes = Uint8Array.from(token.match(/../g), (pair) => parseInt(pair, 16));
      const href = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
      if (!/^mailto:/i.test(href) || /[\r\n]/.test(href)) return;
      window.location.href = href;
    } catch {
      // An invalid token must not open a different URL or break other controls.
    }
  });
})();
