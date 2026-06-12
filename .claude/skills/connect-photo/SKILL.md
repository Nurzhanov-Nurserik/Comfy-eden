---
name: connect-photo
description: Подключить реальное фото в готовый слот сайта Comfy Eden вместо CSS-плейсхолдера (Фаза 2). Применяй когда появились фото товаров или интерьеров — вставить их, не меняя вёрстку.
---

# Фото в слот (скилл, агент `frontend-dev`)

В v1 вместо фото — текстурные плейсхолдеры `.ph`. Слоты под реальные фото уже готовы: меняем плейсхолдер на `<img>` того же размера, вёрстку не трогаем.

## Шаги
1. Положи оптимизированный файл в `assets/img/` (web-формат: `webp` или `jpg`).
2. Найди слот в `index.html`: hero — `.hero__card`, продукция — `.story__media` (или карточки категорий).
3. Замени `<div class="ph ...">` на `<img src="assets/img/<файл>" alt="<осмысленный alt>" loading="lazy">` в том же контейнере; в CSS убедись, что у `img` стоит `object-fit: cover` и размеры слота.
4. Проверь обрезку и адаптив → прогони `/qa-review`.

## Проверка
- [ ] Фото не растянуто и не искажено (`object-fit: cover`).
- [ ] У `<img>` есть осмысленный `alt` и `loading="lazy"`.
- [ ] Слот не «поехал» на 900/600; reduced-motion ок.

## Пример
В front-карточку hero вместо `.ph--linen` вставили `assets/img/bedding-set.webp` с `object-fit: cover`, `alt="Гостиничное постельное бельё Comfy Eden"` и lazy-load. Композиция hero не сдвинулась.

Связано: агент `frontend-dev`; скилл `qa-review`; файлы `index.html` (`.hero__card`, `.story__media`), `assets/img/`, `SPEC.md` §5.3, §6.3; `TASK.md` F2.
