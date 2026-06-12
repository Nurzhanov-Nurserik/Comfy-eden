# CLAUDE.md — Comfy Eden

Этот файл читается в начале каждой сессии. Это короткие правила проекта — соблюдай их в любой задаче.

## Что это
Premium B2B-лендинг гостиничного текстиля и одноразовых принадлежностей для HoReCa. Регион — Казахстан, язык — русский. Статический имиджевый продающий сайт. Бренд: **Comfy Eden** (вордмарк + подзаголовок «HoReCa текстиль»).

## Стек и запуск
- Чистый HTML + CSS + JS, без сборки и фреймворков.
- Запуск: открыть `index.html` или `python -m http.server 5500`.

## Структура
- `index.html` — все секции (+ JSON-LD, OG-теги)
- `privacy.html` — политика конфиденциальности (форма требует согласия)
- `assets/css/styles.css` — стили, палитра, motion
- `assets/js/main.js` — `CONFIG` (контакты) + motion + sticky-storytelling + форма→WhatsApp; пустые контакты авто-скрываются
- `assets/img/og.svg` — превью для соцсетей
- `robots.txt`, `sitemap.xml` — SEO
- `bot/` — Telegram-бот (отдельный компонент, в git-репо сайта **игнорируется**)
- Документы (**локально, в .gitignore, не публикуются**): `SPEC.md` · `PLAN.md` · `TASK.md` · `BOT_SPEC.md` · публичный `README.md`

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

## Git, CI и деплой
- Репозиторий: `https://github.com/Nurzhanov-Nurserik/Comfy-eden` (**публичный**). Сайт опубликован: **https://nurzhanov-nurserik.github.io/Comfy-eden/** (Pages, Source = GitHub Actions).
- **Pre-commit хук** (`.githooks/`, через `core.hooksPath`): блок секретов + `node --check` + предупреждения. На новой машине включить: `git config core.hooksPath .githooks`.
- **Деплой:** GitHub Actions (`.github/workflows/deploy.yml`) на push в `main` → Pages; на прод уходит только `index.html`, `privacy.html`, `robots.txt`, `sitemap.xml`, `assets/`.
- Контакты — только в `CONFIG` (`main.js`). Секреты (токен бота и т.п.) — в `.env`, не коммитим.

## Статус сейчас
Сайт **ОПУБЛИКОВАН** и живой: **https://nurzhanov-nurserik.github.io/Comfy-eden/** (GitHub Pages, авто-деплой на каждый push в `main`). Проверен (QA), SEO-ready. Контакты: WhatsApp/телефон `+7 778 581 76 52` живые; email/город/Instagram/бот пустые → авто-скрыты. **Осталось:** дать цены для бота (`bot/prices.py`); по желанию — дизайн-полировка на vanilla по референсам 21st.dev. Дизайн-скилл `ui-ux-pro-max` установлен (user-level). Бот — каркас в `bot/` (aiogram).
