# Independent review: Mustai Karim video article

Date: 2026-11-14. Read-only comparison of `site/pages/video-81/index.html` with `article-81.html` and article-81 rows in `media-metadata.tsv`. No video bodies were requested or downloaded.

## Result

The page title is «Мустай Карим». All 14 source FLV URLs appear exactly once, in the same order as the article configuration and TSV. The source has no text captions beside the players; the page says so explicitly and labels the links «Видео 1» through «Видео 14» as navigation labels, not original captions. The note also correctly says playback is unconfirmed and all links lead to original FLV files.

## Evidence

- Extracted `file` values from `article-81.html` are `/images/stories/videos/karim/1r.flv` through `/14r.flv` in ascending order. The page uses the same URLs resolved to `https://ufalit.ufacsdb.ru`, exactly matching all 14 TSV rows and preserving order.
- I checked the immediately preceding source paragraph before each of the 14 player configurations; each is blank (typically `<p><br /></p>`). Thus the target's numbered headings are editorial navigation labels, not invented source titles; the adjacent note makes this distinction explicit.
- TSV metadata records 14 HEAD responses as HTTP 200 / `video/x-flv` with `Content-Length` values. Those headers do not establish video integrity or playback; no body was requested or played.
- All local `href`/`src` targets resolve, including the shared stylesheet and navigation. The 14 video links are intentionally external. The page has no inline styles, deprecated tags, or MCE/Joomla/AllVideos/JWPlayer markup; it uses semantic `figure`, `figcaption`, headings, and anchors.
- `site/pages/video-388/index.html` now labels the Salavat link “около 343 МБ”. The recorded size is 343,297,500 bytes, approximately 343.3 decimal MB; the rounded label is accurate for the accepted large-file exception `video-large-zlobin-salavat`.

## Limits

- The source HTML snapshot declares UTF-8 but has invalid bytes in shell/footer material (see `VERIFY-INVENTORY.md`); the player URLs, IDs, and empty adjacent paragraphs were directly readable in the saved source.
- This compares to the saved 2026-11-13 source snapshot, not a fresh live request. No responsive/browser rendering, downloads, playback, duration, or media integrity were checked.
