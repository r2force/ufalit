# Cleanup of the hidden MCE bibliography fragment

Updated `site/pages/personalities/index.html` and extended `site/assets/personalities-cleanup.css`.

## Comparison

- Preserved all 10 paragraph text sequences in the hidden fragment, in their original order; the page content outside the fragment is byte-for-byte unchanged.
- Preserved every anchor `href` and image `src` in the full page.
- Converted 80 inline styles in the fragment into 16 scoped CSS rules. The root wrapper still uses the original off-screen geometry.
- Removed the `_mcePaste` identifier, MCE/Office class markers, three conditional Office XML blocks, and the conditional Word stylesheet block. The fragment itself and all bibliography text remain in the HTML.
- Preserved the exact newline sequence of the page.

## Limitations and open questions

The bibliography remains positioned off-screen, matching the existing hidden paste fragment behavior. Whether this material should remain hidden or be surfaced as bibliography content is an editorial question. Nonstandard Word `mso-*` and `tab-stops` declarations were subsequently removed from the cleanup CSS; standard CSS properties were preserved. No browser rendering review was performed. This comparison verifies text, paragraph order, links, image references, and markup preservation, but does not establish the original Word formatting in every browser.


## CSS follow-up

Removed only `mso-*` and `tab-stops` declarations from `site/assets/personalities-cleanup.css` (16 declarations). Compared the ordered remaining CSS property/value pairs before and after; all standard declarations are unchanged. The HTML file was not modified.
