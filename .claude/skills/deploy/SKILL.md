---
name: deploy
description: Публикация сайта Comfy Eden на статический хостинг. Используй когда нужно выложить сайт или обновление в прод — преддеплой-чеклист (контакты в CONFIG, ссылки, форма), заливка, домен, HTTPS, пост-деплой smoke-тест. Сайт статический (HTML/CSS/JS).
---

# Деплой сайта Comfy Eden

Статический сайт: `index.html` + `assets/`. Без сборки.

## 1. Преддеплой-чеклист
- [ ] В `assets/js/main.js` → объект `CONFIG` заполнен реальными данными (не осталось `// TODO` и заглушек `77000000000`, `comfyeden.kz`): whatsappNumber, phoneDisplay/phoneHref, email, city, instagram, telegramBotUrl.
- [ ] OG-картинка `assets/img/og.jpg` существует, `<meta og:image>` раскомментирован.
- [ ] Прогнать субагент `design-qa` (вёрстка, адаптив, a11y, reduced-motion) — без blocker/major.
- [ ] Локально проверить: ссылки WhatsApp / tel / email / Telegram и отправку тестовой заявки.

## 2. Выбор хостинга
GitHub Pages · Netlify · Vercel · Cloudflare Pages · обычный shared-хостинг.
Заливать нужно `index.html` и папку `assets/` (можно без `SPEC.md` / `PLAN.md` / `TASK.md` / `.claude/`).

## 3. Заливка
- **Netlify / Vercel / Cloudflare Pages:** drag-and-drop папки или подключение git-репозитория.
- **GitHub Pages:** запушить в репозиторий, включить Pages на нужной ветке.
- **Shared-хостинг:** загрузить файлы по FTP в корень.

## 4. Домен и HTTPS
- Привязать домен, дождаться обновления DNS.
- Убедиться, что HTTPS включён (у большинства хостингов Let's Encrypt автоматически).

## 5. Пост-деплой smoke-тест
- [ ] Сайт открывается по `https://`, в консоли нет ошибок и mixed-content.
- [ ] Мобильная версия на реальном телефоне: меню, sticky-сторителлинг, форма.
- [ ] Все ссылки ведут куда надо; тестовая заявка реально открывает WhatsApp менеджеру.
- [ ] OG-превью корректно (проверить через шеринг-дебаггер Telegram/Facebook).

## Пример
Заполнили `CONFIG` контактами, прогнали `qa-review` (без major), залили папку на Netlify drag-and-drop, привязали домен — HTTPS поднялся автоматически. Smoke-тест: форма открыла WhatsApp менеджеру, OG-превью корректно в Telegram.

Готово, когда сайт доступен на домене по HTTPS и smoke-тест пройден. См. `PLAN.md` §6, `TASK.md` эпик D.
