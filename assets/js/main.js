/* ============================================================
   Comfy Eden — main.js
   Конфиг контактов + motion + sticky-storytelling + форма → WhatsApp
   Зависимостей нет. Всё опционально-устойчиво (no-JS показывает плейсхолдеры).
   ============================================================ */

/* ------------------------------------------------------------
   1. КОНФИГ — единственное место для контактов.
   Заполните реальными данными перед публикацией.
------------------------------------------------------------ */
const CONFIG = {
  // WhatsApp менеджера — БЕЗ "+", только цифры. Формат РК: 77XXXXXXXXX
  whatsappNumber: '77000000000',          // TODO

  phoneDisplay: '+7 (700) 000-00-00',     // TODO — как показывать
  phoneHref:   '+77000000000',            // TODO — для tel: (без пробелов)

  email: 'hello@comfyeden.kz',            // TODO

  city: 'Алматы',                         // TODO

  instagramUrl: 'https://instagram.com/comfyeden',  // TODO
  instagramHandle: '@comfyeden',                    // TODO

  // Ссылка на Telegram-бота (каталог + прайс + КП)
  telegramBotUrl: 'https://t.me/comfyeden_bot',     // TODO

  // (Опц.) Endpoint, который перешлёт заявку в Telegram-бот/CRM.
  // Если пусто — заявка уходит только в WhatsApp. Пример: serverless-функция или webhook.
  leadEndpoint: ''                                  // TODO (необязательно)
};

const WA_GREETING = 'Здравствуйте! Пишу с сайта Comfy Eden. Хочу узнать про комплектацию текстилем для объекта.';

/* ------------------------------------------------------------
   Утилиты
------------------------------------------------------------ */
const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function waLink(text) {
  const base = 'https://wa.me/' + CONFIG.whatsappNumber;
  return text ? base + '?text=' + encodeURIComponent(text) : base;
}

/* ------------------------------------------------------------
   2. Заполнение контактов из CONFIG
------------------------------------------------------------ */
function applyContacts() {
  const hrefMap = {
    phone: 'tel:' + CONFIG.phoneHref,
    whatsapp: waLink(WA_GREETING),
    'whatsapp-float': waLink(WA_GREETING),
    email: 'mailto:' + CONFIG.email,
    telegram: CONFIG.telegramBotUrl,
    instagram: CONFIG.instagramUrl
  };
  const external = new Set(['whatsapp', 'whatsapp-float', 'telegram', 'instagram']);

  $$('[data-contact]').forEach(el => {
    const type = el.getAttribute('data-contact');
    const href = hrefMap[type];
    if (href && el.tagName === 'A') {
      el.setAttribute('href', href);
      if (external.has(type)) { el.target = '_blank'; el.rel = 'noopener'; }
    }
  });

  const textMap = {
    phone: CONFIG.phoneDisplay,
    email: CONFIG.email,
    city: CONFIG.city,
    instagram: CONFIG.instagramHandle
  };
  $$('[data-contact-text]').forEach(el => {
    const key = el.getAttribute('data-contact-text');
    if (textMap[key]) el.textContent = textMap[key];
  });

  const year = $('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
}

/* ------------------------------------------------------------
   3. Header scroll-state + WhatsApp float
------------------------------------------------------------ */
function initScrollUI() {
  const header = $('[data-header]');
  const waFloat = $('[data-wa-float]');
  const hero = $('.hero');
  const showAfter = hero ? hero.offsetHeight * 0.7 : 600;

  const onScroll = () => {
    const y = window.scrollY;
    if (header) header.classList.toggle('is-scrolled', y > 8);
    if (waFloat) waFloat.classList.toggle('is-shown', y > showAfter);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ------------------------------------------------------------
   4. Мобильное меню
------------------------------------------------------------ */
function initMobileMenu() {
  const toggle = $('[data-nav-toggle]');
  const menu = $('[data-mobile-menu]');
  if (!toggle || !menu) return;

  const setOpen = (open) => {
    menu.hidden = !open;
    menu.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.querySelector('use').setAttribute('href', open ? '#i-close' : '#i-menu');
  };

  toggle.addEventListener('click', () => setOpen(menu.hidden));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
  window.addEventListener('resize', () => { if (window.innerWidth > 900) setOpen(false); });
}

/* ------------------------------------------------------------
   5. Reveal при скролле (fade up)
------------------------------------------------------------ */
function initReveal() {
  const els = $$('[data-reveal]');
  if (prefersReduced || !('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
  els.forEach(el => io.observe(el));
}

/* ------------------------------------------------------------
   6. Sticky-сторителлинг категорий
------------------------------------------------------------ */
function initStory() {
  const steps = $$('[data-story-step]');
  const visual = $('[data-story-visual]');
  if (!steps.length || !visual) return;

  const els = {
    index:  $('[data-story-index]', visual),
    kicker: $('[data-story-kicker]', visual),
    head:   $('[data-story-heading]', visual),
    desc:   $('[data-story-desc]', visual),
    levels: $('[data-story-levels]', visual),
    media:  $('.story__media', visual),
    iconUse: $('[data-story-icon]', visual)
  };

  function renderLevels(str) {
    if (!els.levels) return;
    els.levels.innerHTML = '';
    (str || '').split(',').map(s => s.trim()).filter(Boolean).forEach(level => {
      const chip = document.createElement('span');
      chip.className = 'chip';
      chip.dataset.level = level;
      chip.textContent = level;
      els.levels.appendChild(chip);
    });
  }

  let current = null;
  function setActive(step) {
    if (step === current) return;
    current = step;

    steps.forEach(s => s.classList.toggle('is-active', s === step));

    const d = step.dataset;
    visual.setAttribute('data-cat', d.cat || '');
    if (els.index)  els.index.textContent = d.index || '';
    if (els.kicker) els.kicker.textContent = d.kicker || '';
    if (els.head)   els.head.textContent = (step.querySelector('h3') || {}).textContent || d.kicker || '';
    if (els.desc)   els.desc.textContent = d.desc || '';
    if (els.iconUse && d.icon) els.iconUse.setAttribute('href', '#' + d.icon);
    renderLevels(d.levels);

    // лёгкий crossfade media (если не reduced-motion)
    if (!prefersReduced && els.media) {
      els.media.style.opacity = '0.35';
      requestAnimationFrame(() => { els.media.style.opacity = '1'; });
    }
  }

  setActive(steps[0]);

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if (entry.isIntersecting) setActive(entry.target); });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
    steps.forEach(s => io.observe(s));
  } else {
    // fallback: клик/фокус переключает
    steps.forEach(s => s.addEventListener('mouseenter', () => setActive(s)));
  }
}

/* ------------------------------------------------------------
   7. Форма заявки → WhatsApp (+ опц. endpoint)
------------------------------------------------------------ */
function initLeadForm() {
  const form = $('[data-lead-form]');
  if (!form) return;
  const success = $('[data-form-success]', form);

  const required = ['name', 'city', 'phone'];

  function fieldWrap(input) { return input.closest('.field'); }
  function setError(input, msg) {
    const wrap = fieldWrap(input);
    if (!wrap) return;
    wrap.classList.toggle('field--invalid', !!msg);
    const slot = $('[data-error]', wrap);
    if (slot) slot.textContent = msg || '';
  }

  function validate() {
    let firstInvalid = null;
    required.forEach(name => {
      const input = form.elements[name];
      if (!input) return;
      let msg = '';
      const val = input.value.trim();
      if (!val) {
        msg = 'Заполните поле';
      } else if (name === 'phone') {
        const digits = val.replace(/\D/g, '');
        if (digits.length < 10) msg = 'Проверьте номер телефона';
      }
      setError(input, msg);
      if (msg && !firstInvalid) firstInvalid = input;
    });
    if (firstInvalid) firstInvalid.focus();
    return !firstInvalid;
  }

  // снимаем ошибку по мере ввода
  required.forEach(name => {
    const input = form.elements[name];
    if (input) input.addEventListener('input', () => {
      if (fieldWrap(input).classList.contains('field--invalid')) setError(input, '');
    });
  });

  function collect() {
    const products = $$('input[name="products"]:checked', form).map(i => i.value);
    return {
      name: form.elements.name.value.trim(),
      company: form.elements.company.value.trim(),
      city: form.elements.city.value.trim(),
      phone: form.elements.phone.value.trim(),
      whatsapp: form.elements.whatsapp.value.trim(),
      object: form.elements.object.value.trim(),
      products,
      volume: form.elements.volume.value.trim(),
      comment: form.elements.comment.value.trim(),
      date: new Date().toLocaleString('ru-RU')
    };
  }

  function buildMessage(d) {
    const lines = [
      'Заявка с сайта Comfy Eden',
      '—',
      'Имя: ' + d.name,
      d.company && 'Компания/объект: ' + d.company,
      'Город: ' + d.city,
      'Телефон: ' + d.phone,
      d.whatsapp && 'WhatsApp: ' + d.whatsapp,
      d.object && 'Тип объекта: ' + d.object,
      d.products.length && 'Товары: ' + d.products.join(', '),
      d.volume && 'Объём/номера: ' + d.volume,
      d.comment && 'Комментарий: ' + d.comment,
      '—',
      'Дата: ' + d.date
    ].filter(Boolean);
    return lines.join('\n');
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validate()) return;

    const data = collect();
    const message = buildMessage(data);

    // (опц.) уведомление в бот/CRM — best-effort, не блокирует WhatsApp
    if (CONFIG.leadEndpoint) {
      try {
        fetch(CONFIG.leadEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        }).catch(() => {});
      } catch (_) { /* no-op */ }
    }

    // основной канал — WhatsApp менеджеру с готовым сообщением
    window.open(waLink(message), '_blank', 'noopener');

    if (success) {
      success.hidden = false;
      success.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'center' });
    }
    form.reset();
    $$('.field--invalid', form).forEach(w => w.classList.remove('field--invalid'));
  });
}

/* ------------------------------------------------------------
   Init
------------------------------------------------------------ */
document.addEventListener('DOMContentLoaded', () => {
  applyContacts();
  initScrollUI();
  initMobileMenu();
  initReveal();
  initStory();
  initLeadForm();
});
