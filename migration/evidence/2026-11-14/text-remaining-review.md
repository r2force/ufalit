# Review of remaining text candidates

Date: 2026-11-14

## Scope and method

Reviewed all 28 records in `text-remaining-candidate.tsv` against the cited saved source snapshots and the current target HTML, including the current working-tree version of `site/pages/gallery-26/index.html`. Source and target text were extracted from the referenced elements with HTML entities decoded. Literal text was retained for comparison; a separate whitespace-normalized comparison treats ordinary spaces and nonbreaking spaces as equivalent. The TSV records each exact source and target value, locator, numeric value where relevant, evidence file, and disposition. Four additional rows check source category counts against the count paragraphs on the corresponding detail pages.

This was a source/target text review of the listed records. It does not establish completeness of the broader source crawl, evaluate visual design, or claim browser verification.

## Results

Of the 28 candidate rows:

- 17 are literal text matches.
- 6 differ only by whitespace (including NBSP versus ordinary space).
- 5 contain substantive wording or visible count-format differences.

So 23/28 match by content after whitespace normalization, while 5 remain actual differences. This revises the candidate's initial 20 matched / 8 different split: three of its differences were false positives against the current gallery-26 page, whose three category links now include `(2)`, `(7)`, and `(13)`. The source and target values for those rows differ only in NBSP versus ordinary space. The parent noted this page was edited concurrently; `git diff` shows those three count-bearing labels in the working tree, and the committed `HEAD` is older than the current target checked here.

The five confirmed differences are:

| Record | Source text | Current target text | Finding |
|---|---|---|---|
| `gallery-30-count` | `(7)` | `7 фотографий` | Same number, different count phrase. |
| `gallery-7-parent` | `Category List` | `Фотогалерея` | Genuine label wording change. |
| `gallery-7-34` | `Фотоматериалы по творчеству Гафури (14)` | `Фотоматериалы по творчеству Гафури14 фотографий` | Same number, different count phrase; target DOM text joins label and count without a separating whitespace character. |
| `gallery-7-33` | `Памятные места (11)` | `Памятные места11 фотографий` | Same number, different count phrase; target DOM text joins label and count without a separating whitespace character. |
| `gallery-18-child-category` | `Фото улицы Тухвата Янаби (35)` | `Фото улицы Тухвата Янаби (35 фотографий)` | Same number, different count phrase. |

The count value is preserved in each of the four count-format differences; `gallery-7-parent` is the only wording change without a count.

## Source locator corrections

Two candidate source references incorrectly pointed at the global `galleries.html.gz` index using ID 26, where these labels do not occur. The review uses the actual parent category snapshot (`migration/evidence/2026-11-12/gallery-6/source-current.html`) instead:

- `gallery-26-title`: parent category entry label `Памятные места` → target H1.
- `gallery-30-parent`: parent category entry label `Памятные места` → target breadcrumb.

The corrected values match. The TSV records the corrected canonical source URL and element locator.

## Separate count pairs

Separate count rows are warranted for IDs 34, 35, 36, and 43 because the candidate rows compare category/title text, while the detail pages expose counts in separate `p.gallery-count` elements. These pairs are included in the TSV and show matching values but different visible forms:

| Detail page | Source category count | Target count | Value |
|---|---|---|---:|
| gallery-34 | `(14)` | `14 фотографий` | 14 |
| gallery-35 | `(23)` | `23 фотографии` | 23 |
| gallery-36 | `(33)` | `33 фотографии` | 33 |
| gallery-43 | `(35)` | `35 фотографий` | 35 |

## Machine-readable evidence

`text-remaining-review.tsv` contains the 28 reviewed candidates plus the 4 count-pair rows. Results distinguish literal matches, whitespace-only differences, same-number/different-text cases, and genuine text mismatch; no numeric agreement is reported as a text match.
