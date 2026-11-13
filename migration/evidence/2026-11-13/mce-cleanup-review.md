# Ревью удаления дублирующих MCE-атрибутов

Дата: 13 ноября 2026 года. Проверен текущий `git diff` для HTML в `site/`; изменения не вносились.

## Результат

В 14 файлах удалено всего **141 атрибут**: 121 `mce_style`, 5 `mce_href` и 15 `mce_bogus`. Все три вида больше не встречаются в затронутых версиях.

Сравнение HEAD с рабочими файлами HTML-парсером показало, что после исключения только этих трёх атрибутов структура тегов и остальные атрибуты совпадают; текст совпадает после нормализации пробельных последовательностей. Значения обычных `href` и `style` неизменны. Список ссылок совпал полностью, количество и порядок `<br>` сохранены: **180 до и 180 после**. Никакой текст, ссылка, обычный `style` или сам элемент `<br>` не был удалён.

### Изменённые файлы

| Файл | `mce_style` | `mce_href` | `mce_bogus` | Всего удалено |
|---|---:|---:|---:|---:|
| `site/pages/awards/index.html` | 25 | 3 | 4 | 32 |
| `site/pages/reading-aksakov-childhood/index.html` | 0 | 0 | 1 | 1 |
| `site/pages/reading-aksakov-flower/index.html` | 2 | 0 | 0 | 2 |
| `site/pages/reading-aksakov-nature/index.html` | 1 | 0 | 0 | 1 |
| `site/pages/reading-bikchentaev-reviews/index.html` | 16 | 0 | 0 | 16 |
| `site/pages/reading-bikchentaev-stories/index.html` | 4 | 0 | 0 | 4 |
| `site/pages/reading-karim-children/index.html` | 36 | 0 | 0 | 36 |
| `site/pages/reading-karim-poems/index.html` | 3 | 0 | 0 | 3 |
| `site/pages/reading-karim-smile/index.html` | 2 | 0 | 0 | 2 |
| `site/pages/reading-shafikov-dedications/index.html` | 13 | 1 | 0 | 14 |
| `site/pages/reading-shafikov-poems/index.html` | 4 | 0 | 0 | 4 |
| `site/pages/reading-shafikov-sayings/index.html` | 1 | 0 | 0 | 1 |
| `site/pages/reading-shafikov-talas/index.html` | 5 | 1 | 0 | 6 |
| `site/pages/reading/index.html` | 9 | 0 | 10 | 19 |

## Ограничения

В 12 из 14 изменённых файлов исходная версия имела окончания строк CRLF, а текущая — LF; поэтому обычная статистика `git diff` показывает много изменённых строк. Сравнение после нормализации пробелов и окончаний строк не выявило текстовых или структурных изменений помимо целевых атрибутов. Это ревью файлового diff, не визуальная проверка страниц в браузере.
