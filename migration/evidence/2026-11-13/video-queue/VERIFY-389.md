# Independent review: video index and Aksakov article

Date: 2026-11-14. Read-only comparison of `site/pages/videos/index.html` and `site/pages/video-389/index.html` with the saved `video-queue` HTML and metadata. No video bodies were requested or downloaded.

## Result

The category's three articles are listed in source order (389, 388, 81). Article 389 has all four source labels and links to the exact four FLV URLs in the source order. Its article-body text consists of those four labels; the target preserves them and adds an explicit notice that the files are external and are not played on this page. No local media files or missing local links were found.

The pages use semantic HTML (`ol`, `li`, `figure`, `figcaption`, headings, anchors), have no inline styles or old Joomla/MCE/player markup, and all internal href targets resolve locally. No browser playback or video integrity check was performed.

## Comparison details

- Source `category.html` lists 389 «Аксаков Сергей Тимофеевич», 388 «Злобин Степан Павлович», then 81 «Мустай Карим». Target `videos/index.html` preserves that order. The 389 route is local; 388 and 81 remain source-site links labelled as not yet migrated. These statuses are clear to the reader.
- Source article 389 labels and target labels match exactly and retain order:

| # | Caption | Source FLV URL | Target link |
|---:|---|---|---|
| 1 | Фонограмма к мероприятию по Аксакову 1998 | `https://ufalit.ufacsdb.ru/images/stories/videos/aksakov/fonogramma1998.flv` | Exact |
| 2 | Фонограмма к мероприятию по Аксакову 2002 | `https://ufalit.ufacsdb.ru/images/stories/videos/aksakov/fonogramma.flv` | Exact |
| 3 | Аксаков 2005 | `https://ufalit.ufacsdb.ru/images/stories/videos/aksakov/2005.flv` | Exact |
| 4 | Аксаков 2007 | `https://ufalit.ufacsdb.ru/images/stories/videos/aksakov/2007.flv` | Exact |

- The metadata ledger reports each file as HTTP HEAD 200, `video/x-flv`; sizes are respectively 20,194,603; 13,675,218; 96,510,326; and 190,780,004 bytes. These are metadata only: video data and playback were not checked.
- Article 389's largest file (2007, 190,780,004 bytes) has an accepted `size-limit` exception (`video-large-aksakov-2007`) in `migration/exceptions.csv`. The target page says all links lead to source FLV files and that videos do not play there, which accurately marks their external/non-playing behavior. It does not show per-file size or call out the 2007 entry as the large-file exception; visitors therefore receive no size warning before opening that link. The exception is documented in the registry and user decision.
- All internal href/src paths in both pages resolve locally, including `../../assets/style.css`, navigation, breadcrumb, and article/category routes. Four video hrefs are intentionally external. No video binaries were present under these target pages.
- The source snapshots declare UTF-8 but contain invalid UTF-8 bytes in template/footer material (also recorded in `video-queue/VERIFY-INVENTORY.md`). The article labels and category titles compared above decode correctly; target pages are UTF-8. The shared site poem/banner appears on the home page, not repeated on these new pages; this review treats it as site-shell content rather than article-389 prose.
- The category/source response also has no active pagination links; the saved pagination container is empty. Target index includes exactly the three captured category entries.

## Limits

- HEAD metadata is not proof that a file body can be downloaded intact, nor proof of playback. No video was downloaded, opened, or played.
- HTML text/URL comparison was against the saved 2026-11-13 snapshot, not a new request to the live site.
- Responsive appearance was not reviewed in a browser.
