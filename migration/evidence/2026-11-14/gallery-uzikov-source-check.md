# Gallery Uzikov source recheck

- Date: 2026-11-14
- Scope: six gallery original URLs from `migration/assets.csv` for `site/assets/gallery/uzikov/`, fetched sequentially with pauses. Bodies and headers are retained at `/private/tmp/gallery-uzikov-repeat-<ID>.*`.
- Result: all six originals match manifest and assigned local files by HTTP, MIME, byte count, and SHA-256.
- Site files, shared registries, and Git metadata were not modified.

| Order | ID | Source URL | Assigned local file | HTTP | MIME | Content-Length | Download bytes | Download SHA-256 | Local bytes | Local SHA-256 | Checks |
|---:|---:|---|---|---:|---|---:|---:|---|---:|---|---|
| 1 | 669 | [669](https://ufalit.ufacsdb.ru/index.php?Itemid=88&catid=16:2012-12-25-05-41-41&id=669:01&option=com_phocagallery&phocadownload=2&tmpl=component&view=detail) | `site/assets/gallery/uzikov/669.jpg` | 200 | image/jpeg | 210649 | 210649 | `c4e627f28f9d4cfd1a95a52f1a984dcd5d81c9db24ada98b082c4d3263c86af7` | 210649 | `c4e627f28f9d4cfd1a95a52f1a984dcd5d81c9db24ada98b082c4d3263c86af7` | HTTP OK; MIME OK; Content-Length OK; source bytes OK; source SHA OK; local bytes OK; local SHA OK |
| 2 | 670 | [670](https://ufalit.ufacsdb.ru/index.php?Itemid=88&catid=16:2012-12-25-05-41-41&id=670:02&option=com_phocagallery&phocadownload=2&tmpl=component&view=detail) | `site/assets/gallery/uzikov/670.jpg` | 200 | image/jpeg | 9240 | 9240 | `ceef308a374fdce93126249a14e622c13f51b10d4a29c020836e097e1a7784cd` | 9240 | `ceef308a374fdce93126249a14e622c13f51b10d4a29c020836e097e1a7784cd` | HTTP OK; MIME OK; Content-Length OK; source bytes OK; source SHA OK; local bytes OK; local SHA OK |
| 3 | 671 | [671](https://ufalit.ufacsdb.ru/index.php?Itemid=88&catid=16:2012-12-25-05-41-41&id=671:03&option=com_phocagallery&phocadownload=2&tmpl=component&view=detail) | `site/assets/gallery/uzikov/671.jpg` | 200 | image/jpeg | 42257 | 42257 | `7bb04dd7606371d7af951cd6e8e294b390725537dec935abae52d72342d13715` | 42257 | `7bb04dd7606371d7af951cd6e8e294b390725537dec935abae52d72342d13715` | HTTP OK; MIME OK; Content-Length OK; source bytes OK; source SHA OK; local bytes OK; local SHA OK |
| 4 | 672 | [672](https://ufalit.ufacsdb.ru/index.php?Itemid=88&catid=16:2012-12-25-05-41-41&id=672:04&option=com_phocagallery&phocadownload=2&tmpl=component&view=detail) | `site/assets/gallery/uzikov/672.jpg` | 200 | image/jpeg | 37878 | 37878 | `7d530e4fd121336f1c58ad304fe7e26cb92c491ac7d50ab4f0a0afed5f72f42b` | 37878 | `7d530e4fd121336f1c58ad304fe7e26cb92c491ac7d50ab4f0a0afed5f72f42b` | HTTP OK; MIME OK; Content-Length OK; source bytes OK; source SHA OK; local bytes OK; local SHA OK |
| 5 | 673 | [673](https://ufalit.ufacsdb.ru/index.php?Itemid=88&catid=16:2012-12-25-05-41-41&id=673:05&option=com_phocagallery&phocadownload=2&tmpl=component&view=detail) | `site/assets/gallery/uzikov/673.jpg` | 200 | image/jpeg | 1483091 | 1483091 | `d9b366c537fba4f722f3786a6b8bb2108887f986136712cf806a6d968147213e` | 1483091 | `d9b366c537fba4f722f3786a6b8bb2108887f986136712cf806a6d968147213e` | HTTP OK; MIME OK; Content-Length OK; source bytes OK; source SHA OK; local bytes OK; local SHA OK |
| 6 | 674 | [674](https://ufalit.ufacsdb.ru/index.php?Itemid=88&catid=16:2012-12-25-05-41-41&id=674:06&option=com_phocagallery&phocadownload=2&tmpl=component&view=detail) | `site/assets/gallery/uzikov/674.jpg` | 200 | image/jpeg | 119460 | 119460 | `5d78103c9b6274052018c1bdcafe1a5c475b7eeb7b4fbc7b6cb600ba56187ffe` | 119460 | `5d78103c9b6274052018c1bdcafe1a5c475b7eeb7b4fbc7b6cb600ba56187ffe` | HTTP OK; MIME OK; Content-Length OK; source bytes OK; source SHA OK; local bytes OK; local SHA OK |

## Notes

- SHA-256 and byte counts were computed from the downloaded bodies and assigned local files. `Content-Length` is from the final response header when present.
- Order follows the source-order notes in the existing manifest. No local files were overwritten.
