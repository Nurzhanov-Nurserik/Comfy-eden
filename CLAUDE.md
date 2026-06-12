# CLAUDE.md — Comfy Eden

Этот файл читается в начале каждой сессии. Это короткие правила проекта — соблюдай их в любой задаче.

## Что это
Premium B2B-лендинг гостиничного текстиля и одноразовых принадлежностей для HoReCa. Регион — Казахстан, язык — русский. Статический имиджевый продающий сайт. Бренд: **Comfy Eden** (вордмарк + подзаголовок «HoReCa текстиль»).

## Стек и запуск
- Чистый HTML + CSS + JS, без сборки и фреймворков.
- Запуск: открыть `index.html` или `python -m http.server 5500`.

## Структура
- `index.html` — все секции
- `assets/css/styles.css` — стили, палитра, motion
- `assets/js/main.js` — `CONFIG` (контакты) + motion + sticky-storytelling + форма→WhatsApp
- `assets/img/` — фото (слоты под реальные фото)
- Документы: `SPEC.md` (что) · `PLAN.md` (фазы) · `TASK.md` (бэклог) · `README.md` (запуск/публикация)

## Правила (важно для ЛЮБОЙ правки)
- **Цены на сайте не публикуем.** Прайс/КП — только через Telegram-бот после имени+телефона (SPEC §8.5).
- **Сайт не хранит данные.** Форма заявки → готовое сообщение в WhatsApp (+ опц. `leadEndpoint`) (§8.1–8.2).
- **Контакты — только в `CONFIG`** (начало `main.js`), единственный источник. Для контактов HTML не правим — JS подставляет сам.
- **`prefers-reduced-motion` обязателен.** Motion сдержанный: reveal, sticky, hover (§6.2).
- Тон — премиум, по делу, доверие. Продаём ценность, а не просто название (§4.3).
- Фото v1 — CSS-плейсхолдеры `.ph`; слоты `.hero__card` и `.story__media` готовы под реальные фото.
- Уровни качества сквозные: Эконом / Стандарт / Премиум (§5.4).

## Код-конвенции
- BEM-подобные классы, CSS-переменные (`:root` в `styles.css`), палитра песок+изумруд, шрифты Playfair Display + Manrope.
- Только vanilla JS. id секций латиницей: `#products #audience #why #process #lead #contacts`; тексты — русские.
- Пиши код в стиле существующего файла; после значимых правок фронта прогоняй `/qa-review`.

## Агенты и скиллы (`.claude/`)
- **Агенты (роли):** `design-qa`, `ru-copywriter`, `frontend-dev`, `telegram-bot-dev`, `seo-kz`, `kz-localizer`.
- **Скиллы (команды):** `/qa-review` `/write-section` `/add-section` `/add-product` `/update-contacts` `/connect-photo` `/deploy` `/generate-kp` `/bot-spec` `/seo-pass` `/localize-section`.

## Статус сейчас
MVP собран (~90%). Блокер выхода — реальные контакты в `CONFIG` (TASK B1) → используй `/update-contacts`. Дальше: приёмка `/qa-review` → деплой `/deploy`. Бот и SEO/KZ — отдельные фазы.
