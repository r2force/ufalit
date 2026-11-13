# Personalities markup cleanup

Completed 2026-11-13. Scope: `site/pages/personalities/index.html`, new `site/assets/personalities-cleanup.css`, and this report. No other pages, shared `style.css`, registries, or Git state were changed.

## Changes

Moved the existing page-specific `<style>` block into the external stylesheet. Converted 325 of 405 inline style attributes outside the retained Office payload into deterministic, element-scoped CSS classes (19 distinct tag/declaration rules). Original declarations were preserved, with only whitespace between tokens collapsed. This includes paragraph alignment, image borders/floats/margins, and Word-derived font/list declarations. The external CSS also sets `border:none` for the six formerly `border="0"` tables.

Removed six `border="0"` attributes and six MCE `mceItemTable` classes. The full hidden `<div id="_mcePaste">` Office/MCE payload (29,405 bytes) was preserved byte-for-byte, including its `mceItemVisualAid` class, off-screen inline positioning, 80 inline styles, Word XML, conditional comments, `mce:style` blocks, and bibliography context. Its content and wrapper were not edited. `MsoNormal` Word classes and `.clr` helpers also remain.

## Comparison against Git HEAD

The normalized comparison ignores only moved inline styles, the removed `mceItemTable`/`border="0"` metadata, the moved document `<style>` block, and the new stylesheet link. It retains all other tags, attributes and ordering. Before editing, the working file matched Git `HEAD`; after editing, normalized DOM structure, whitespace-normalized visible text, ordered anchor `href` values, and ordered image `src` values are unchanged. The entire hidden `_mcePaste` block was verified byte-for-byte unchanged. Original per-line line endings from `HEAD` were restored.

| Measure | SHA-256 before = after |
|---|---|
| Normalized visible text | `c085d389463d2d3c554155e91fe2972f42f184abc76baf5a51b80e9e83e6a937` |
| Ordered anchor hrefs | `aefc43e36c566ff48a3c8b108415b4504fea4f99b0ab4760b922e5948c38c33b` |
| Ordered image srcs | `1b13daedb8bec709a2610890496f2e265740667249f549ef76a033f144af175d` |
| Normalized DOM signature | `d40c601902ca4ea2ba66e583b162434b4bbf13346280731aadacb9607d976a72` |

Moved styles: **325**; distinct CSS rules: **19**; retained Office inline styles: **80**; removed MCE table classes / `border="0"`: **6 / 6**.

## Open task and limitations

- Review the retained hidden `_mcePaste` Word payload, including its Office XML, conditional comments, MCE style blocks, Word-specific spans/list metadata, and adjacent bibliography. It was deliberately not deleted or reorganized. Cleanup of the remaining 80 style attributes in this block requires a separate content-focused review.
- The generated stylesheet preserves `mso-*` declarations. Browsers may ignore these nonstandard Word properties as they did inline; their Word-specific effect was not evaluated.
- The static checks establish preservation of normalized text, DOM structure, links and image references, not pixel-identical rendering. Browser visual review was not performed.
- This cleanup did not refresh the source snapshot.

No text, bibliography entry, link, image, or ordering was removed or rewritten. No registry or Git operation was performed.
