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
  whatsappNumber: '77785817652',

  phoneDisplay: '+7 778 581 76 52',       // показываем (тот же номер, что WhatsApp)
  phoneHref:   '+77785817652',            // для tel:

  email: 'comfyeden.kz@gmail.com',

  city: 'Шымкент',

  instagramUrl: 'https://instagram.com/comfy.eden',
  instagramHandle: '@comfy.eden',

  // Ссылка на Telegram-бота (каталог + прайс + КП)
  telegramBotUrl: '',                     // TODO: ссылка на бота — пока скрыт

  // (Опц.) Endpoint, который перешлёт заявку в Telegram-бот/CRM.
  // Если пусто — заявка уходит только в WhatsApp. Пример: serverless-функция или webhook.
  leadEndpoint: ''
  // Пустые поля выше автоматически скрываются на сайте (см. applyContacts).
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
  const has = v => typeof v === 'string' && v.trim() !== '';
  const hide = el => { const card = el.closest('.contact'); (card || el).hidden = true; };

  const hrefMap = {
    phone: has(CONFIG.phoneHref) ? 'tel:' + CONFIG.phoneHref : '',
    whatsapp: has(CONFIG.whatsappNumber) ? waLink(WA_GREETING) : '',
    'whatsapp-float': has(CONFIG.whatsappNumber) ? waLink(WA_GREETING) : '',
    email: has(CONFIG.email) ? 'mailto:' + CONFIG.email : '',
    telegram: has(CONFIG.telegramBotUrl) ? CONFIG.telegramBotUrl : '',
    instagram: has(CONFIG.instagramUrl) ? CONFIG.instagramUrl : ''
  };
  const external = new Set(['whatsapp', 'whatsapp-float', 'telegram', 'instagram']);

  $$('[data-contact]').forEach(el => {
    const type = el.getAttribute('data-contact');
    const href = hrefMap[type];
    if (href && el.tagName === 'A') {
      el.setAttribute('href', href);
      if (external.has(type)) { el.target = '_blank'; el.rel = 'noopener'; }
    } else if (!href) {
      hide(el); // нет данных для канала — прячем ссылку/карточку
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
    if (!(key in textMap)) return; // whatsapp/telegram — статический текст; их видимость решает href-цикл
    if (has(textMap[key])) el.textContent = textMap[key];
    else hide(el);
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
    // согласие на обработку персональных данных
    const consent = form.elements.consent;
    const consentErr = form.querySelector('.consent-error');
    if (consent && !consent.checked) {
      if (consentErr) consentErr.textContent = 'Подтвердите согласие на обработку данных';
      if (!firstInvalid) firstInvalid = consent;
    } else if (consentErr) {
      consentErr.textContent = '';
    }
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
  if (form.elements.consent) {
    form.elements.consent.addEventListener('change', () => {
      const cErr = form.querySelector('.consent-error');
      if (cErr && form.elements.consent.checked) cErr.textContent = '';
    });
  }

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
      'Согласие на обработку ПДн: да',
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
   8. Лёгкий parallax hero-карточек (премиум-глубина)
------------------------------------------------------------ */
function initParallax() {
  if (prefersReduced) return;
  const layers = [
    [$('.hero__card--back'), 0.05],
    [$('.hero__card--mid'), -0.03],
    [$('.hero__card--front'), 0.08]
  ].filter(pair => pair[0]);
  if (!layers.length) return;
  let ticking = false;
  const update = () => {
    const y = window.scrollY;
    layers.forEach(([el, rate]) => el.style.setProperty('--py', (y * rate).toFixed(1) + 'px'));
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  update();
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
  initParallax();
  initLeadForm();
});
