/* ==========================================================
   ALMATY SUPER SKI — логика
   1. Кастомный курсор   2. Мобильное меню   3. Языки RU/EN
   4. Появление при скролле   5. Погода Алматы (Open-Meteo)
   6. Интерактивная карта трасс и вкладки сервисов
   7. Калькулятор сноуборд/горнолыжного пасса   8. Модальное окно
   ========================================================== */

// ---- 1. Кастомный курсор ----
const cursor = document.getElementById('cursor');
let mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
(function loop() {
  cx += (mx - cx) * 0.2;
  cy += (my - cy) * 0.2;
  cursor.style.left = cx + 'px';
  cursor.style.top = cy + 'px';
  requestAnimationFrame(loop);
})();
document.querySelectorAll('a, button, select, input, .resort, .perk, .srv-card, .trail-item').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
});

// ---- 2. Мобильное меню ----
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
burger.addEventListener('click', () => {
  const open = !navLinks.classList.contains('open');
  navLinks.classList.toggle('open', open);
  burger.classList.toggle('active', open);
  burger.setAttribute('aria-expanded', String(open));
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  navLinks.classList.remove('open');
  burger.classList.remove('active');
}));

// ---- 3. Языки RU / EN ----
const T = {
  ru: {
    nav1: 'Кластеры', nav2: 'Схема трасс', nav3: 'Привилегии', nav4: 'Сервисы', privatePass: 'Private Pass',
    heroEyebrow: 'Заилийский Алатау · Алматы · 161 км трасс',
    heroSub: 'Единый сноуборд и горнолыжный кластер от Кок-Жайляу до Шымбулака и Oi-Qaragai. Сноупарки мирового уровня, пухляк и прямой доступ к вершинам.',
    btnPass: 'Подобрать Pass', btnMap: 'Схема трасс и Snowpark', btnRent: 'Pro-Прокат и школа',
    gear: 'Снаряд', gearBoard: 'Сноуборд', gearSki: 'Лыжи',
    zone: 'Сектор кластера', days: 'Дней', access: 'Тариф доступа', total: 'Итого', book: 'Забронировать',
    peak: 'Перепад высот', temp: 'Температура', snow: 'Снежный покров / Длина', lifts: '11 канатных дорог', open: 'Открыто',
    mapEyebrow: 'Интерактивная навигация', mapTitle: 'Схема трасс и Snowpark',
    resortsEyebrow: 'Единая инфраструктура', resortsTitle: 'Секторы кластера',
    servEyebrow: 'Всё для катания', servTitle: 'Сервисы курорта',
    perksEyebrow: 'Клуб', perksTitle: 'Привилегии',
    contacts: 'Контакты', rights: 'Все права защищены.'
  },
  en: {
    nav1: 'Clusters', nav2: 'Trail Map', nav3: 'Privileges', nav4: 'Services', privatePass: 'Private Pass',
    heroEyebrow: 'Trans-Ili Alatau · Almaty · 161 km of trails',
    heroSub: 'Unified snowboard & ski cluster linking Kok-Zhailau, Shymbulak, and Oi-Qaragai. Pro snowparks, deep powder, and direct summit access.',
    btnPass: 'Configure Pass', btnMap: 'Trail Map & Snowpark', btnRent: 'Pro Rental & School',
    gear: 'Discipline', gearBoard: 'Snowboard', gearSki: 'Ski',
    zone: 'Cluster sector', days: 'Days', access: 'Access tier', total: 'Total', book: 'Book now',
    peak: 'Elevation range', temp: 'Temperature', snow: 'Snowpack / Length', lifts: '11 cableways', open: 'Open',
    mapEyebrow: 'Interactive navigation', mapTitle: 'Trail Map & Snowpark',
    resortsEyebrow: 'Unified infrastructure', resortsTitle: 'Cluster Sectors',
    servEyebrow: 'Everything for riders', servTitle: 'Resort Services',
    perksEyebrow: 'Club', perksTitle: 'Privileges',
    contacts: 'Contacts', rights: 'All rights reserved.'
  }
};
function setLang(lang) {
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (T[lang][key]) el.textContent = T[lang][key];
  });
  document.querySelectorAll('.lang button').forEach(b => b.classList.toggle('active', b.dataset.lang === lang));
}
document.querySelectorAll('.lang button').forEach(b => b.addEventListener('click', () => setLang(b.dataset.lang)));

// ---- 4. Появление при скролле ----
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// ---- 5. Погода Алматы (Open-Meteo) ----
const LAT = 43.222, LON = 76.8512;
const WEATHER_URL = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,weather_code&timezone=Asia%2FAlmaty`;
const WMO = {
  0: 'Ясно', 1: 'Преимущественно ясно', 2: 'Переменная облачность', 3: 'Пасмурно',
  45: 'Туман', 48: 'Туман', 51: 'Морось', 53: 'Морось', 55: 'Морось',
  61: 'Дождь', 63: 'Дождь', 65: 'Сильный дождь', 71: 'Снег', 73: 'Снег', 75: 'Сильный снег',
  77: 'Снежная крупа', 80: 'Ливень', 81: 'Ливень', 82: 'Сильный ливень',
  85: 'Снегопад', 86: 'Сильный снегопад', 95: 'Гроза', 96: 'Гроза', 99: 'Гроза'
};
let lastGood = null;
function showTemp(value, statusText, isError = false) {
  document.getElementById('headerTemp').textContent = value;
  document.getElementById('temp').textContent = value;
  const st = document.getElementById('tempStatus');
  st.textContent = statusText;
  st.classList.toggle('error', isError);
}
async function loadTemp(retries = 2) {
  try {
    const res = await fetch(WEATHER_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    const c = data.current;
    const t = Math.round(c.temperature_2m);
    lastGood = { t, cond: WMO[c.weather_code] || '' };
    const time = new Date(c.time).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    showTemp(t, `Алматы · ${lastGood.cond} · обновлено ${time}`);
  } catch (err) {
    if (retries > 0) setTimeout(() => loadTemp(retries - 1), 2000);
    else showTemp(lastGood ? lastGood.t : '--', lastGood ? 'Нет связи · последние данные' : 'Нет связи с сервисом погоды', true);
  }
}
loadTemp();
setInterval(loadTemp, 5 * 60 * 1000);

// ---- 6. Фильтр трасс и вкладки сервисов ----
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const cat = btn.dataset.filter;
    document.querySelectorAll('.trail-item').forEach(item => {
      item.classList.toggle('hidden', cat !== 'all' && item.dataset.cat !== cat);
    });
    document.querySelectorAll('.trail-line').forEach(line => {
      line.classList.toggle('dimmed', cat !== 'all' && line.dataset.cat !== cat);
    });
  });
});

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const target = 'tab-' + btn.dataset.tab;
    document.querySelectorAll('.service-panel').forEach(p => p.classList.toggle('active', p.id === target));
  });
});

// ---- 7. Калькулятор сноуборд/горнолыжного пасса ----
const BASE = 160;
const LONG = 5;
const DISC = 0.1;
const el = {
  zone: document.getElementById('zone'),
  access: document.getElementById('access'),
  days: document.getElementById('days'),
  total: document.getElementById('total'),
  minus: document.getElementById('minus'),
  plus: document.getElementById('plus'),
  optRent: document.getElementById('optRent'),
  optIns: document.getElementById('optIns'),
  optCoach: document.getElementById('optCoach'),
  discountBadge: document.getElementById('discountBadge')
};
let dayCount = 3, shown = 0, selectedGear = 'Сноуборд';

document.querySelectorAll('.gear-switch button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.gear-switch button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedGear = btn.textContent.trim();
  });
});

function getExtrasPerDay() {
  let sum = 0;
  if (el.optRent.checked) sum += Number(el.optRent.value);
  if (el.optIns.checked) sum += Number(el.optIns.value);
  if (el.optCoach.checked) sum += Number(el.optCoach.value);
  return sum;
}

function calcTotal() {
  const passPerDay = BASE * parseFloat(el.zone.value) * parseFloat(el.access.value);
  const gross = (passPerDay + getExtrasPerDay()) * dayCount;
  const discount = dayCount >= LONG ? DISC : 0;
  el.discountBadge.textContent = dayCount >= LONG ? 'Скидка 10% применена!' : 'Скидка 10% от 5 дней';
  return Math.round(gross * (1 - discount));
}

function animateTotal(target) {
  const from = shown, start = performance.now(), duration = 550;
  (function frame(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 4);
    const v = Math.round(from + (target - from) * eased);
    el.total.textContent = '€' + v.toLocaleString('ru-RU');
    if (p < 1) requestAnimationFrame(frame); else shown = target;
  })(performance.now());
}
function updatePrice() { animateTotal(calcTotal()); }

el.minus.addEventListener('click', () => { if (dayCount > 1) { dayCount--; el.days.textContent = dayCount; updatePrice(); } });
el.plus.addEventListener('click', () => { if (dayCount < 14) { dayCount++; el.days.textContent = dayCount; updatePrice(); } });
[el.zone, el.access, el.optRent, el.optIns, el.optCoach].forEach(input => input.addEventListener('change', updatePrice));

document.querySelectorAll('.resort').forEach(card => {
  card.addEventListener('click', () => {
    el.zone.selectedIndex = parseInt(card.dataset.zone, 10);
    updatePrice();
    document.getElementById('pass').scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
});

document.querySelectorAll('.quick-book').forEach(btn => {
  btn.addEventListener('click', () => {
    el.zone.selectedIndex = Number(btn.dataset.presetZone || 0);
    el.access.selectedIndex = Number(btn.dataset.presetAccess || 0);
    updatePrice();
    document.getElementById('pass').scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
});
updatePrice();

// ---- 8. Модальное окно ----
const modal = document.getElementById('modal');
function openModal(customService = null) {
  if (customService) {
    document.getElementById('sGear').textContent = customService;
    document.getElementById('sZone').textContent = 'Almaty Super Ski Cluster';
    document.getElementById('sDays').textContent = 'По записи';
    document.getElementById('sAccess').textContent = 'Сервисный слот';
    document.getElementById('sExtras').textContent = 'Подтверждение консьержем';
    const priceMatch = customService.match(/€\d+/);
    document.getElementById('sTotal').textContent = priceMatch ? priceMatch[0] : 'Бесплатно';
  } else {
    const extras = [];
    if (el.optRent.checked) extras.push('Pro-прокат');
    if (el.optIns.checked) extras.push('Страховка');
    if (el.optCoach.checked) extras.push('Инструктор');
    document.getElementById('sGear').textContent = selectedGear;
    document.getElementById('sZone').textContent = el.zone.options[el.zone.selectedIndex].text;
    document.getElementById('sDays').textContent = dayCount;
    document.getElementById('sAccess').textContent = el.access.options[el.access.selectedIndex].text;
    document.getElementById('sExtras').textContent = extras.length ? extras.join(', ') : 'Без доп. опций';
    document.getElementById('sTotal').textContent = '€' + calcTotal().toLocaleString('ru-RU');
  }
  modal.classList.remove('done');
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal() { modal.classList.remove('open'); document.body.style.overflow = ''; }

document.getElementById('buy').addEventListener('click', () => openModal());
document.querySelectorAll('.srv-book').forEach(btn => {
  btn.addEventListener('click', () => openModal(btn.dataset.service));
});
document.getElementById('confirm').addEventListener('click', () => {
  document.getElementById('ref').textContent = 'ASS-' + Math.random().toString(36).slice(2, 8).toUpperCase();
  modal.classList.add('done');
});
document.getElementById('mClose').addEventListener('click', closeModal);
document.getElementById('mClose2').addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });