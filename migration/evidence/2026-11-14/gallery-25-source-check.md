# Gallery 25 source recheck

- Date: 2026-11-14
- Scope: three original image URLs in `migration/evidence/2026-11-12/gallery-25/source-fetch-metadata.csv`, fetched sequentially with pauses. Bodies and response headers are retained at `/private/tmp/gallery25-repeat-<ID>.*`.
- Result: all three originals match recorded metadata and assigned local files by HTTP, MIME, byte count, and SHA-256.
- Site files, shared registries, and Git metadata were not modified.

| Order | ID | Source URL | Assigned local file | HTTP | MIME | Content-Length | Download bytes | Download SHA-256 | Local bytes | Local SHA-256 | Checks |
|---:|---:|---|---|---:|---|---:|---:|---|---:|---|---|
| 1 | 431 | [431](https://ufalit.ufacsdb.ru/index.php?option=com_phocagallery&view=detail&catid=25:2012-12-30-07-28-54&id=431:t01&tmpl=component&phocadownload=2&Itemid=88) | `site/assets/gallery/25/photo-431.jpg` | 200 | image/jpeg | 59885 | 59885 | `a97078ca0be8f5d7b21c490aaae56b6ea9695e35a9d8e1321745a79cb67d1b17` | 59885 | `a97078ca0be8f5d7b21c490aaae56b6ea9695e35a9d8e1321745a79cb67d1b17` | HTTP OK; MIME OK; Content-Length OK; source bytes OK; source SHA OK; local bytes OK; local SHA OK |
| 2 | 432 | [432](https://ufalit.ufacsdb.ru/index.php?option=com_phocagallery&view=detail&catid=25:2012-12-30-07-28-54&id=432:t02&tmpl=component&phocadownload=2&Itemid=88) | `site/assets/gallery/25/photo-432.jpg` | 200 | image/jpeg | 62004 | 62004 | `fa36a6f49d73f00229b3080b2e945b425fee154f6a02c6b684d01f5006828029` | 62004 | `fa36a6f49d73f00229b3080b2e945b425fee154f6a02c6b684d01f5006828029` | HTTP OK; MIME OK; Content-Length OK; source bytes OK; source SHA OK; local bytes OK; local SHA OK |
| 3 | 433 | [433](https://ufalit.ufacsdb.ru/index.php?option=com_phocagallery&view=detail&catid=25:2012-12-30-07-28-54&id=433:t03&tmpl=component&phocadownload=2&Itemid=88) | `site/assets/gallery/25/photo-433.jpg` | 200 | image/jpeg | 75081 | 75081 | `a3118074c269d03b908ddb5758bbb460f01dd8793b7c417ea45956cfb4164cf5` | 75081 | `a3118074c269d03b908ddb5758bbb460f01dd8793b7c417ea45956cfb4164cf5` | HTTP OK; MIME OK; Content-Length OK; source bytes OK; source SHA OK; local bytes OK; local SHA OK |

## Notes

- SHA-256 and byte counts were computed from downloaded bodies and assigned local files. `Content-Length` is from the final response header when present.
- The three image entries follow the existing category item order; no local files were overwritten.
