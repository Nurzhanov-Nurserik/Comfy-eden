---
name: seo-pass
description: Проверить и улучшить SEO лендинга Comfy Eden под Казахстан. Применяй когда нужно настроить мета-теги, Open Graph, schema.org, sitemap/robots, скорость или подготовить блоки под города РК (Фаза 3).
---

# SEO-проход (скилл агента `seo-kz`)

Делаем сайт понятным для поисковиков и людей: корректные мета, разметка для машин, локальность под Казахстан. Без переспама и без цен.

## Шаги
1. Проверь `title`/`description`/один `h1`, `alt` у изображений и OG-теги в `index.html`.
2. Добавь/обнови JSON-LD `Organization` + `LocalBusiness` (адрес, гео, контакты из `CONFIG`).
3. Создай/обнови `sitemap.xml` и `robots.txt`.
4. Прогони Lighthouse SEO; для городов РК — блоки/страницы без дублирующегося текста.

## Проверка
- [ ] Валидный JSON-LD; ровно один `h1`; OG с реальной картинкой.
- [ ] `sitemap.xml` и `robots.txt` на месте.
- [ ] Lighthouse SEO ≥ 95; нет дублей контента.

## Пример
Добавили `LocalBusiness` JSON-LD с гео и контактами Алматы, заполнили `og:image`, сгенерировали `sitemap.xml` и `robots.txt`. Lighthouse SEO — 98.

Связано: агент `seo-kz`; файлы `index.html`, `SPEC.md` §13, `TASK.md` G3; контакты — `assets/js/main.js` (`CONFIG`).
