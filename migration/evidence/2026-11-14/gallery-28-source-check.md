# Gallery 28 source recheck

- Date: 2026-11-14
- Scope: three original URLs from `migration/assets.csv` for `site/assets/gallery/28/`, fetched sequentially with pauses. Bodies and headers are retained at `/private/tmp/gallery28-repeat-<ID>.*`.
- Result: all three source downloads match manifest expectations and assigned local files by HTTP, MIME, byte count, and SHA-256.
- Site files, shared registries, and Git metadata were not modified.

| Order | ID | Source URL | Assigned local file | HTTP | MIME | Content-Length | Download bytes | Download SHA-256 | Local bytes | Local SHA-256 | Checks |
|---:|---:|---|---|---:|---|---:|---:|---|---:|---|---|
| 1 | 448 | [448](https://ufalit.ufacsdb.ru/index.php?option=com_phocagallery&view=detail&catid=28:2012-12-30-07-30-30&id=448:l01&tmpl=component&phocadownload=2&Itemid=88) | `site/assets/gallery/28/photo-448.jpg` | 200 | image/jpeg | 5710 | 5710 | `ca78a7760d08679feddbe8cba9a02ab751bf58f24d741553b755c908e47ccba2` | 5710 | `ca78a7760d08679feddbe8cba9a02ab751bf58f24d741553b755c908e47ccba2` | HTTP OK; MIME OK; Content-Length OK; source bytes OK; source SHA OK; local bytes OK; local SHA OK |
| 2 | 449 | [449](https://ufalit.ufacsdb.ru/index.php?option=com_phocagallery&view=detail&catid=28:2012-12-30-07-30-30&id=449:l02&tmpl=component&phocadownload=2&Itemid=88) | `site/assets/gallery/28/photo-449.jpg` | 200 | image/jpeg | 6856 | 6856 | `bf70975c1ebfcd00777ac1b4a6fb05f17604b5a6e7360ba0c4c77726670962a1` | 6856 | `bf70975c1ebfcd00777ac1b4a6fb05f17604b5a6e7360ba0c4c77726670962a1` | HTTP OK; MIME OK; Content-Length OK; source bytes OK; source SHA OK; local bytes OK; local SHA OK |
| 3 | 450 | [450](https://ufalit.ufacsdb.ru/index.php?option=com_phocagallery&view=detail&catid=28:2012-12-30-07-30-30&id=450:l03&tmpl=component&phocadownload=2&Itemid=88) | `site/assets/gallery/28/photo-450.jpg` | 200 | image/jpeg | 5159 | 5159 | `5cd0d63d7762a391118ab68b80d7337129b1ebaf526241fe6ae783b612868412` | 5159 | `5cd0d63d7762a391118ab68b80d7337129b1ebaf526241fe6ae783b612868412` | HTTP OK; MIME OK; Content-Length OK; source bytes OK; source SHA OK; local bytes OK; local SHA OK |

## Notes

- SHA-256 and byte counts were computed from downloaded bodies and assigned local files. `Content-Length` is shown from the final response header when present.
- Existing evidence also records direct image-path URLs for these same three media items; this recheck used the three assigned gallery download URLs from the manifest.
