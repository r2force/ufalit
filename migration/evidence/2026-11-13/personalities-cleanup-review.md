# Review: personalities page style cleanup

Date: 2026-11-13  
Scope: read-only comparison of the working `site/pages/personalities/index.html` and `site/assets/personalities-cleanup.css` with `git HEAD`.

## Result

The normalized text content is unchanged, including the bibliography text in the hidden `_mcePaste` block. The source element sequence, table structure, and original `href`/`src` sequence are preserved. All 325 inline styles outside the retained Office paste block were replaced with corresponding `person-style-*` classes and rules. The original embedded page stylesheet was moved intact to the external stylesheet; the only extra table rule maps the six original `border="0"` table attributes to `border:none`.

This review checks source markup and local references. It does not confirm rendered styling in a browser.

## Checks and evidence

- The page's normalized text nodes match `git show HEAD:site/pages/personalities/index.html` exactly (3,364 non-empty text nodes). This includes bibliography and content stored within `_mcePaste`.
- The text inside `_mcePaste` is identical between HEAD and the working page (1,464 characters). The complete wrapper subtree is also unchanged (28,268 characters). This preserves its bibliography, but the block remains off-screen/hidden with the original MCE/Office wrapper and Office metadata; it is not a user-visible replacement for the visible bibliography content.
- The original `href`/`src` sequence is unchanged: 107 entries, including 98 image sources. The only added URL is the new stylesheet link. All local href/src targets resolve to existing paths. The one external HTTP link, `http://csdb.ufanet.ru`, is unchanged.
- The DOM start/end tag sequence matches after accounting for the moved head stylesheet and added stylesheet link. Counts for content tags are unchanged: 19 `details`, 19 `summary`, 6 tables, 6 `tbody`, 6 `tr`, 13 `td`, 98 `img`, and 93 `br` in both versions.
- The original embedded stylesheet in the page head (1,067 characters after trimming boundary whitespace) exactly matches the base stylesheet rules now at the start of `personalities-cleanup.css`, through the `@media(max-width:600px)` block.
- Parsed HEAD contains 325 per-element `style` attributes outside `_mcePaste`; the current page has 325 generated `person-style-*` classes corresponding to these elements, in the same tag order. The 19 CSS class rules cover the original style declarations; their occurrence comments total 325. Twenty distinct raw style strings coalesce to 19 rules because one pair differs only by extra spaces. The declaration values otherwise match the original strings.
- One source declaration is itself malformed: `float:  2px 5px;` on one image. The generated rule retains it as `float: 2px 5px;`, which is an invalid `float` value and will be ignored by browsers just as the original invalid inline declaration was. The preceding `border` declaration remains. This is inherited source data, not a newly introduced style loss.
- All six tables remain with their `tbody`/row/cell structure. Each prior `border="0"` and `mceItemTable` class was removed; `person-body table { border: none; }` preserves the no-border presentation. No `border` presentation attributes remain.
- The MCE table classes were safely removed, but this is not a complete purge of MCE/Office markup: the unchanged hidden `_mcePaste` wrapper retains `class="mceItemVisualAid"`, inline positioning styles, and four nested `mce:style` elements. This exception preserves the hidden bibliography data verbatim and should remain explicit in any claim about cleanup completeness.
- The page includes `../../assets/personalities-cleanup.css` once. Local links and image files were checked on disk; no missing local target was found.

## Limits

- No browser rendering was performed; desktop/mobile layout, cascade interactions, and image flow were not visually checked.
- Text and table preservation are source-to-source checks against the current `git HEAD`, not a fresh comparison against the public original site.
- The hidden MCE paste data remains non-visible by design of the unchanged source block. The audit confirms its preservation, not its accessibility or usefulness to visitors.
