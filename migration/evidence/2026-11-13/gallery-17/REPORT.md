# Gallery 17 — registry candidates

**Source page:** `https://ufalit.ufacsdb.ru/index.php?Itemid=88&id=17:2012-12-25-05-41-56&option=com_phocagallery&view=category`  
**Target page:** `site/pages/gallery-17/index.html`  
**Capture date:** 2026-11-13  
**Evidence:** `category.html`, `category.headers`, `category-37.html`, `category-37.headers`, `category-38.html`, `category-38.headers`, `TEXT-REPORT.md`, `VERIFY-REPORT.md`

## Candidate parity rows

`content-parity-candidate.csv` follows the shared `migration/content-parity.csv` schema. It contains five source text rows: the actual component heading, the names of the two nested categories, and their displayed counts. Each is marked `matched` because the saved source HTML, current target locator, and independent verification report agree. The additional word «Источник» beside each count in the target is new interface guidance and is identified in the row notes; it is not attributed to the source.

No separate parent photo count or photo captions are recorded because the parent category contains no individual photo entries. The two category names and counts are the source labels/metadata for the nested-category links. The source's `Category List` and `Powered by Phoca Gallery` strings are preserved on the target, but are outside the requested candidate set of category heading and nested-category labels/counts.

## Page registry information

Suggested `pages.csv` row (not applied to the shared registry):

```csv
source_url,discovered_from,section,kind,canonical_url,target_path,status,checked_at,evidence,notes
https://ufalit.ufacsdb.ru/index.php?Itemid=88&id=17:2012-12-25-05-41-56&option=com_phocagallery&view=category,https://ufalit.ufacsdb.ru/index.php?option=com_phocagallery&view=categories&Itemid=88,Фотогалерея / Худайбердин Шагит Ахметович,category,https://ufalit.ufacsdb.ru/index.php?Itemid=88&id=17:2012-12-25-05-41-56&option=com_phocagallery&view=category,site/pages/gallery-17/index.html,captured,2026-11-13,migration/evidence/2026-11-13/gallery-17/VERIFY-REPORT.md,Parent category contains two nested categories; both remain external source links.
```

The source page itself has the generic heading «Фотогалерея». The category ID and parent label were provided in the assignment; the related child snapshots display the full parent link label «Худайбердин Шагит Ахметович». The target's shorter «Шагит Худайбердин» line is contextual interface text and is not represented as matched source text.

## Discovered child categories

These URLs are copied from the parent category's actual `href` values, with the source origin added. They are discovered but not migrated; the target links are visibly marked «Источник».

| Order | Name | Count | Source URL | Evidence |
|---:|---|---:|---|---|
| 1 | Музей, премия | 23 | `https://ufalit.ufacsdb.ru/index.php?option=com_phocagallery&view=category&id=37:2012-12-30-08-42-35&Itemid=88` | `category.html`, `category-37.html`, `category-37.headers` |
| 2 | Экскурсия по мемориальному уголку | 17 | `https://ufalit.ufacsdb.ru/index.php?option=com_phocagallery&view=category&id=38:2012-12-30-08-42-58&Itemid=88` | `category.html`, `category-38.html`, `category-38.headers` |

The child snapshots show 23 and 17 photo entries respectively (40 total) but provide no per-photo detail snapshots or original image bodies in this evidence set. They remain separate migration work and must not be counted as captured on the parent page.

## Independent review and limits

`VERIFY-REPORT.md` confirms the parent heading, names, counts, order, and exact child hrefs from the saved snapshots. It also confirms all local target paths resolve and the target contains no obsolete table/form layout, Joomla/MCE artifacts, or inline presentation styles. Browser rendering and network availability of source links were not checked because the browser surface was blocked/unavailable. The source was not refreshed after the 2026-11-13 snapshots.

There are no parent-category photographs to register. Its original folder icons and the generic Category List icon were not retained as images; the category names and navigation are available as semantic links. The external child links continue to depend on the legacy source site until IDs 37 and 38 are migrated.

These are review candidates only. Shared registries and Git were not changed.
