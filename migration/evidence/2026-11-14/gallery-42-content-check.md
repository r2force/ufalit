# Gallery-42 content check

Date: 2026-11-14. Scope: fresh originals `/private/tmp/gallery42-repeat-<ID>.jpg`, capture evidence `migration/evidence/2026-11-13/gallery-42/`, local images `site/assets/gallery/42/`, target `site/pages/gallery-42/index.html`. Layout and design were not assessed.

## Result

- All 8 fresh originals match their corresponding local files and `fetch-log.tsv` SHA-256 values byte for byte; sizes also match the log.
- The target contains the same 8 details in source order. For every item, category and detail snapshots, capture log, and target agree on ID, title/alt label, caption, and local filename/path. The target preserves the distinct `.jpeg` and `.jpg` variants despite repeated labels; they remain separate assets with distinct IDs, captions, and hashes.
- All local `href`/`src` destinations in the target resolve to existing files or pages in the site tree. This checks filesystem paths, not HTTP responses.

## Per-item comparison

| Order | Detail ID | Local file | Title / alt | Source caption | Bytes | Fresh source SHA-256 | Local SHA-256 | Result |
|---:|---:|---|---|---|---:|---|---|---|
| 1 | 716 | `0 (1).jpeg` | 0 (1) / 0 (1) | Национальный Музей | 7336 | `d62116c9b4b74793c8975471feea9fb5e9d409c8680e3e1d26b2cca604cf2821` | `d62116c9b4b74793c8975471feea9fb5e9d409c8680e3e1d26b2cca604cf2821` | совпадает |
| 2 | 717 | `0 (1).jpg` | 0 (1) / 0 (1) | Академия наук | 44898 | `0b37e05e75048a42e5adb3da7efc9f1a420341ac5ebc908199a8ca84ee09d302` | `0b37e05e75048a42e5adb3da7efc9f1a420341ac5ebc908199a8ca84ee09d302` | совпадает |
| 3 | 718 | `0 (2).jpeg` | 0 (2) / 0 (2) | Союз писателей | 13613 | `6e6e1209b776dbf7bf0f675ee8a2925aca4cc5c8ec772b26909f803901fe109e` | `6e6e1209b776dbf7bf0f675ee8a2925aca4cc5c8ec772b26909f803901fe109e` | совпадает |
| 4 | 719 | `0 (2).jpg` | 0 (2) / 0 (2) | Дом печати | 38183 | `ceab88d2f79a2e473652bf76372992efea5441da058728d30c786b76546f6d4e` | `ceab88d2f79a2e473652bf76372992efea5441da058728d30c786b76546f6d4e` | совпадает |
| 5 | 720 | `0 (3).jpeg` | 0 (3) / 0 (3) | Союз писателей | 42513 | `374fa5e139aee45013e29bbc5a0552c1bc852659bdd8afbeda2bb8f1eea26176` | `374fa5e139aee45013e29bbc5a0552c1bc852659bdd8afbeda2bb8f1eea26176` | совпадает |
| 6 | 721 | `0 (3).jpg` | 0 (3) / 0 (3) | Башкирский государственный университет | 14576 | `93b2cb26a0c7c71e63ee30e8fcd6c15be5d05422ebd9cfd0a9a45d60a71da32f` | `93b2cb26a0c7c71e63ee30e8fcd6c15be5d05422ebd9cfd0a9a45d60a71da32f` | совпадает |
| 7 | 722 | `0 (4).jpg` | 0 (4) / 0 (4) | Карта Уфы | 853184 | `6d1933bffc312f8e11e4286bea17283aaaee59e670a355b56d62d211a68ea6eb` | `6d1933bffc312f8e11e4286bea17283aaaee59e670a355b56d62d211a68ea6eb` | совпадает |
| 8 | 723 | `0 (5).jpg` | 0 (5) / 0 (5) | Телецентр | 46619 | `2cdbc790f9ad87303d927c85e374314fb4d6e43ec482bae4ca28c0f7fb8999c4` | `2cdbc790f9ad87303d927c85e374314fb4d6e43ec482bae4ca28c0f7fb8999c4` | совпадает |

## Method and limits

Recomputed SHA-256 and byte size for each fresh source body and local target file, then matched against the capture log. Parsed source category and detail snapshots and target figures by detail ID; checked image links and all other local `href`/`src` paths for existence. External URLs were not fetched. Visual appearance, browser behavior, layout, and design were not evaluated. No site pages, assets, shared registries, or Git metadata were changed; only this report was written.
