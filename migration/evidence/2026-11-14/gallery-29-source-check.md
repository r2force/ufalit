# Gallery 29 source recheck

- Date: 2026-11-14
- Scope: two original download URLs from `migration/assets.csv` for `site/assets/gallery/29/`, fetched sequentially with a pause. Bodies and headers are retained at `/private/tmp/gallery29-repeat-<ID>.*`.
- Result: both original downloads match manifest expectations and assigned local files by HTTP, MIME, byte count, and SHA-256.
- Site files, shared registries, and Git metadata were not modified.

| Order | ID | Source URL | Assigned local file | HTTP | MIME | Content-Length | Download bytes | Download SHA-256 | Local bytes | Local SHA-256 | Checks |
|---:|---:|---|---|---:|---|---:|---:|---|---:|---|---|
| 1 | 451 | [451](https://ufalit.ufacsdb.ru/index.php?option=com_phocagallery&view=detail&catid=29:2012-12-30-07-32-57&id=451:img15172843&tmpl=component&phocadownload=2&Itemid=88) | `site/assets/gallery/29/451.jpg` | 200 | image/jpeg | 13252 | 13252 | `0199245b56eb1583281ef29200a723c171994ff6d61e958ed23255ac4fa9b26f` | 13252 | `0199245b56eb1583281ef29200a723c171994ff6d61e958ed23255ac4fa9b26f` | HTTP OK; MIME OK; Content-Length OK; source bytes OK; source SHA OK; local bytes OK; local SHA OK |
| 2 | 452 | [452](https://ufalit.ufacsdb.ru/index.php?option=com_phocagallery&view=detail&catid=29:2012-12-30-07-32-57&id=452:img0711&tmpl=component&phocadownload=2&Itemid=88) | `site/assets/gallery/29/452.jpg` | 200 | image/jpeg | 46333 | 46333 | `05b01eb1bd8a242c0cb4b4e2981dcd34bf6456fcd1b0afbdc94136a847c578e8` | 46333 | `05b01eb1bd8a242c0cb4b4e2981dcd34bf6456fcd1b0afbdc94136a847c578e8` | HTTP OK; MIME OK; Content-Length OK; source bytes OK; source SHA OK; local bytes OK; local SHA OK |

## Notes

- SHA-256 and byte counts were computed from downloaded bodies and assigned local files. `Content-Length` is from the final response header when present.
- The evidence directory also records corresponding direct image-path URLs; this recheck used the two phocadownload URLs assigned by the manifest.
