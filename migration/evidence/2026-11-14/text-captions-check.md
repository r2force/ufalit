# Independent check of 124 gallery captions

- Date: 2026-11-14
- Scope: the 124 photograph-caption rows identified in `text-parity-queue.md`, out of its 152 discovered text rows.
- Machine-readable row-level results: `text-captions-check.tsv`.

## Result

All 124 checked captions match their saved source values exactly, and their source item order matches target figure order. This includes `gallery-33`, where the category HTML snapshot has no saved caption text and the caption was read from each corresponding detail snapshot's `#description-text`. For the other galleries the caption was read from the saved category item (`.phocaimgdesc`, or its source image `alt`/link `title` label when no description is provided); available detail snapshots were included as corroborating evidence.

| Target page | Captions checked | Text matches | Source/target order |
|---|---:|---:|---|
| `gallery-43` | 35 | 35 | exact |
| `gallery-35` | 23 | 23 | exact |
| `gallery-34` | 14 | 14 | exact |
| `gallery-31` | 13 | 13 | exact |
| `gallery-32` | 12 | 12 | exact |
| `gallery-33` | 11 | 11 | exact |
| `gallery-30` | 7 | 7 | exact |
| `gallery-36` | 9 | 9 | exact |
| **Total** | **124** | **124** | **exact** |

## Comparison rules and evidence

- I parsed each saved source category/detail snapshot and each target gallery HTML. HTML entities were decoded; only whitespace at the outside edges of the selected text node was trimmed. Internal spaces, punctuation, and non-breaking spaces were retained and compared exactly.
- Source order was independently derived from the source category's ordered photo cards and compared with the target page's ordered figure IDs. All eight galleries matched exactly.
- Each TSV row records `content_id`, canonical source page, precise source locator and extracted text, target locator and extracted text, source and target order positions, result, and paths to source/detail/target evidence. Rows are marked `matched` only when source evidence and target text exist, exact text agrees, and order positions agree. No rows were flagged.
- The original 152-row queue includes 28 additional non-caption text rows (titles, counts, breadcrumbs, and category links). They are outside this caption-only check. No shared registry, site page, or Git state was changed.

## Limits

This checks caption text and ordering against the saved HTML evidence. It does not establish that each caption semantically describes the corresponding image, verify image bytes or visual placement, or assess browser rendering. It does not update statuses in `migration/content-parity.csv`.
