---
name: update-contacts
description: Заполнить или поменять контакты сайта Comfy Eden. Применяй когда нужно вписать реальные WhatsApp, телефон, email, город, Instagram или ссылку на бота — все контакты в одном месте, в объекте CONFIG в main.js. Закрывает блокер B1.
---

# Контакты сайта (скилл, агент `frontend-dev`)

Все контакты живут в одном месте — объект `CONFIG` вверху `assets/js/main.js`. HTML трогать не надо: JS подставляет данные сам.

## Шаги
1. Открой `assets/js/main.js`, найди объект `CONFIG` (в самом начале файла).
2. Замени значения с пометкой `// TODO`:
   - `whatsappNumber` — номер менеджера, формат `77XXXXXXXXX` (без «+» и пробелов)
   - `phoneDisplay` / `phoneHref` — телефон для показа / для ссылки `tel:`
   - `email`, `city`
   - `instagramUrl`, `instagramHandle`
   - `telegramBotUrl` — ссылка на бота (или временно на менеджера/канал)
   - `leadEndpoint` — (опц.) webhook для уведомления в бот/CRM
3. Сохрани. В `index.html` ничего не меняй.
4. Прогони `/qa-review` — проверь, что ссылки WhatsApp / tel / email / Telegram открываются.

## Проверка
- [ ] Не осталось `// TODO` и заглушек `77000000000`, `comfyeden.kz`.
- [ ] `whatsappNumber` без «+», только цифры.
- [ ] Тестовая заявка из формы открывает WhatsApp на нужный номер.

## Пример
Вписали `whatsappNumber: '77011234567'`, реальный `telegramBotUrl`, город «Алматы». Форма и плавающая кнопка теперь ведут на верный номер; в подвале подставился телефон.

Связано: агент `frontend-dev`; скилл `qa-review`; файлы `assets/js/main.js` (`CONFIG`), `README.md`; `TASK.md` B1, `PLAN.md` §4.
