# Independent review: Zlobin video article

Date: 2026-11-14. Read-only comparison of `site/pages/video-388/index.html` with `article-388.html` and the article-388 rows in `media-metadata.tsv`. No video bodies were requested or downloaded.

## Result

All seven captions and FLV paths correspond to the source article in the same order. The page accurately says the links lead to source FLV files and that videos do not play on this page. Internal links resolve locally; markup is modern semantic HTML without Joomla/MCE player artifacts. The accepted large-file exception is correctly linked, but its individual size is not shown on the page.

## Verification

| # | Source caption | Source FLV path | Match |
|---:|---|---|---|
| 1 | Национальная гордость | `/images/stories/videos/zlobin/gordost.flv` | Exact |
| 2 | О фильме | `/images/stories/videos/zlobin/Ofilme.flv` | Exact |
| 3 | О Злобине | `/images/stories/videos/zlobin/OZlobine.flv` | Exact |
| 4 | К уроку | `/images/stories/videos/zlobin/quroqu.flv` | Exact |
| 5 | Разные издания | `/images/stories/videos/zlobin/raznyeizdaniia.flv` | Exact |
| 6 | Кинофильм "Салават Юлаев" | `/images/stories/videos/zlobin/Salavat.flv` | Exact |
| 7 | Злобин | `/images/stories/videos/zlobin/zlobin.flv` | Exact |

The source article uses root-relative `/images/...` player URLs. The target links use `https://ufalit.ufacsdb.ru` plus those same paths; this resolves to the exact URLs in `media-metadata.tsv`. Each of the seven target captions and URL entries matches the TSV order.

`media-metadata.tsv` records all seven URLs as HEAD HTTP 200, `video/x-flv`. Item 6 `Salavat.flv` reports 343,297,500 bytes and has accepted exception `video-large-zlobin-salavat` in `migration/exceptions.csv`. It is not stored locally; the target links to the original and has a page-level no-playback/external-source note. The target does not state the file size or individually mark item 6 as exceptionally large. That is a discoverability limitation, not a URL or exception-status mismatch.

All local `href`/`src` targets in `video-388/index.html` resolve. Seven FLV links are intentionally external. There are no inline styles, deprecated presentation tags, `mce*`, Joomla, AllVideos, or JWPlayer strings in the page. Its figures and captions use `<figure>`, `<figcaption>`, `<h2>`, and `<a>`.

The source snapshot declares UTF-8 but contains invalid UTF-8 bytes in source wrapper/footer material, as recorded in `VERIFY-INVENTORY.md`; the seven article labels compared here decode and match. The source snapshot is the 2026-11-13 capture, not a new live request.

## Additional check: 2007 Aksakov size note

The current `site/pages/video-389/index.html` shows “(около 191 МБ)” immediately beside the source link for `2007.flv`. `media-metadata.tsv` records 190,780,004 bytes; 191 MB is an appropriate rounded decimal size. This is a metadata check only, not a download or playback check.

## Limits

No video body was downloaded or played. HEAD status, MIME, and Content-Length do not establish video integrity or playback. No browser rendering or responsive layout check was performed.
