/* ==========================================================
   SUPER SKI — рабочая логика
   1. Утилиты   2. Мобильное меню   3. Погода Алматы
   4. Статус работы   5. Ски-пассы и корзина   6. Оформление заказа
   7. Модалки   8. Фильтр трасс   9. Формы и валидация
   10. Cookie и кнопка «Наверх»
   ========================================================== */

// ---- 1. Утилиты ----
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const eur = n => '€' + n.toLocaleString('ru-RU');
let toastTimer;
function toast(text) {
  const t = $('#toast');
  t.textContent = text;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
}
// Безопасное сохранение в localStorage (может быть недоступно)
function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* режим без хранения */ }
}
function load(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch (e) { return fallback; }
}

// ---- 2. Мобильное меню ----
$('#burger').addEventListener('click', () => $('#menu').classList.toggle('open'));
$$('#menu a').forEach(a => a.addEventListener('click', () => $('#menu').classList.remove('open')));

// ---- 3. Погода Алматы (Open-Meteo, без ключа) ----
const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast?latitude=43.222&longitude=76.8512'
  + '&current=temperature_2m&timezone=Asia%2FAlmaty';
async function loadWeather(retries = 2) {
  try {
    const res = await fetch(WEATHER_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    $('#temp-top').textContent = Math.round(data.current.temperature_2m) + ' °C · Алматы';
  } catch (e) {
    if (retries > 0) setTimeout(() => loadWeather(retries - 1), 2000);
    else $('#temp-top').textContent = '-- °C · Алматы';
  }
}
loadWeather();
setInterval(loadWeather, 5 * 60 * 1000);

// ---- 4. Статус работы: открыто 09:00–17:00 по местному времени ----
function updateOpenStatus() {
  const h = new Date().getHours();
  const open = h >= 9 && h < 17;
  $('#openDot').className = 'dot ' + (open ? 'open' : 'closed');
  $('#openText').textContent = open ? 'Сейчас открыто · до 17:00' : 'Сейчас закрыто · открываемся в 09:00';
}
updateOpenStatus();
setInterval(updateOpenStatus, 60 * 1000);

// ---- 5. Ски-пассы и корзина ----
const PRODUCTS = {
  day:    { name: 'Дневной',       price: 65 },
  week:   { name: 'Пакет 5 дней',  price: 280 },
  season: { name: 'Сезонный',      price: 1200 }
};
let qtys = { day: 1, week: 1, season: 1 };
let cart = load('superski_cart', []);   // [{id, qty}]

function setQty(id, value) {
  qtys[id] = Math.min(10, Math.max(1, value));
  $('#q-' + id).textContent = qtys[id];
}
$$('[data-inc]').forEach(b => b.addEventListener('click', () => setQty(b.dataset.inc, qtys[b.dataset.inc] + 1)));
$$('[data-dec]').forEach(b => b.addEventListener('click', () => setQty(b.dataset.dec, qtys[b.dataset.dec] - 1)));

function cartTotal() {
  return cart.reduce((sum, item) => sum + PRODUCTS[item.id].price * item.qty, 0);
}
function cartCount() {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}
function renderCart() {
  $('#cartCount').textContent = cartCount();
  $('#cartTotal').textContent = eur(cartTotal());
  $('#coTotal').textContent = eur(cartTotal());
  const box = $('#cartItems');
  if (cart.length === 0) {
    box.innerHTML = '<div class="empty">Корзина пуста. Выберите ски-пасс.</div>';
    $('#checkoutBtn').disabled = true;
    return;
  }
  $('#checkoutBtn').disabled = false;
  box.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div><strong>${PRODUCTS[item.id].name}</strong><div style="color:var(--muted);font-size:.85rem">${item.qty} × ${eur(PRODUCTS[item.id].price)}</div></div>
      <div style="display:flex;align-items:center;gap:10px">
        <strong>${eur(PRODUCTS[item.id].price * item.qty)}</strong>
        <button data-remove="${item.id}" aria-label="Удалить">✕</button>
      </div>
    </div>`).join('');
  $$('[data-remove]', box).forEach(b => b.addEventListener('click', () => {
    cart = cart.filter(i => i.id !== b.dataset.remove);
    persistCart();
    toast('Удалено из корзины');
  }));
}
function persistCart() {
  save('superski_cart', cart);
  renderCart();
}
function addToCart(id) {
  const existing = cart.find(i => i.id === id);
  if (existing) existing.qty += qtys[id];
  else cart.push({ id, qty: qtys[id] });
  persistCart();
  toast(`Добавлено: ${PRODUCTS[id].name} × ${qtys[id]}`);
}
$$('[data-add]').forEach(b => b.addEventListener('click', () => addToCart(b.dataset.add)));

// Кнопки «Выбрать пасс» на карточках курортов
$$('[data-zone]').forEach(b => b.addEventListener('click', () => toast('Выберите пасс ниже')));

// ---- 7. Модалки ----
const overlay = $('#overlay');
function openModal(el) {
  el.classList.add('open');
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeAll() {
  $$('.modal, .drawer').forEach(el => el.classList.remove('open'));
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}
overlay.addEventListener('click', closeAll);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAll(); });
$$('[data-close]').forEach(b => b.addEventListener('click', closeAll));

// Корзина
$('#openCart').addEventListener('click', () => { renderCart(); $('#cartDrawer').classList.add('open'); overlay.classList.add('open'); });
$('#closeCart').addEventListener('click', closeAll);

// Оформление заказа
$('#checkoutBtn').addEventListener('click', () => {
  if (!cart.length) return;
  closeAll();
  $('#coForm').style.display = 'block';
  $('#coDone').style.display = 'none';
  renderCart();
  openModal($('#checkoutModal'));
});

// Информация о курорте
const RESORTS = [
  { name: 'Apex Peak', text: 'Самая высокая зона кластера: 2 450–3 450 м, 18 трасс и 9 подъёмников. Выбор для опытных райдеров.' },
  { name: 'Nordic Valley', text: 'Спокойный курорт на высоте 1 780 м: 12 трасс, 6 подъёмников, лесные маршруты. Семейный формат.' },
  { name: 'Glacier Sanctuary', text: 'Ледниковые спуски на высоте 2 900 м, 15 трасс и приватная зона отдыха для гостей с пассом.' }
];
$$('[data-resort]').forEach(b => b.addEventListener('click', () => {
  const r = RESORTS[parseInt(b.dataset.resort, 10)];
  $('#rTitle').textContent = r.name;
  $('#rText').textContent = r.text;
  openModal($('#resortModal'));
}));
$('#rBuy').addEventListener('click', () => {
  closeAll();
  document.getElementById('passes').scrollIntoView({ behavior: 'smooth' });
});

// ---- 8. Фильтр трасс ----
$$('.filter-btn').forEach(btn => btn.addEventListener('click', () => {
  $$('.filter-btn').forEach(b => b.classList.toggle('active', b === btn));
  const f = btn.dataset.filter;
  $$('#trailList .trail').forEach(t => {
    t.classList.toggle('hidden', f !== 'all' && t.dataset.status !== f);
  });
}));

// ---- 9. Формы и валидация ----
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[0-9\s()-]{10,}$/;

// Показ ошибки у поля
function setError(fieldEl, message) {
  const err = $('.err', fieldEl);
  fieldEl.classList.toggle('invalid', !!message);
  if (err) err.textContent = message || '';
  return !message;
}
function validate(form, rules) {
  let ok = true;
  rules.forEach(({ field, input, check, text }) => {
    const value = $(input, form).value.trim();
    const valid = check(value);
    ok = setError($(`[data-field="${field}"]`, form), valid ? '' : text) && ok;
  });
  return ok;
}

// Обращение
$('#contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const form = e.target;
  const ok = validate(form, [
    { field: 'name', input: '#cName', check: v => v.length >= 2, text: 'Введите имя (минимум 2 символа)' },
    { field: 'email', input: '#cEmail', check: v => EMAIL_RE.test(v), text: 'Некорректный email' },
    { field: 'message', input: '#cMsg', check: v => v.length >= 5, text: 'Напишите сообщение (минимум 5 символов)' }
  ]);
  if (!ok) { $('#contactMsg').textContent = ''; return; }
  const msgs = load('superski_messages', []);
  msgs.push({ name: $('#cName').value.trim(), email: $('#cEmail').value.trim(), message: $('#cMsg').value.trim(), at: new Date().toISOString() });
  save('superski_messages', msgs);
  $('#contactMsg').style.color = 'var(--ok)';
  $('#contactMsg').textContent = 'Спасибо! Сообщение отправлено.';
  form.reset();
});

// Подписка
$('#subscribeForm').addEventListener('submit', e => {
  e.preventDefault();
  const v = $('#subEmail').value.trim();
  const msg = $('#subMsg');
  if (!EMAIL_RE.test(v)) {
    msg.style.color = 'var(--bad)';
    msg.textContent = 'Введите корректный email';
    return;
  }
  const subs = load('superski_subs', []);
  if (!subs.includes(v)) subs.push(v);
  save('superski_subs', subs);
  msg.style.color = 'var(--ok)';
  msg.textContent = 'Вы подписаны на новости.';
  e.target.reset();
});

// Оформление заказа
$('#checkoutForm').addEventListener('submit', e => {
  e.preventDefault();
  const form = e.target;
  const today = new Date().toISOString().split('T')[0];
  const ok = validate(form, [
    { field: 'fname', input: '#fName', check: v => v.length >= 2, text: 'Введите имя' },
    { field: 'femail', input: '#fEmail', check: v => EMAIL_RE.test(v), text: 'Некорректный email' },
    { field: 'fphone', input: '#fPhone', check: v => PHONE_RE.test(v), text: 'Введите телефон' },
    { field: 'fdate', input: '#fDate', check: v => !!v && v >= today, text: 'Выберите дату не раньше сегодня' }
  ]);
  if (!ok) return;
  const id = 'SS-' + Date.now().toString(36).toUpperCase().slice(-6);
  const orders = load('superski_orders', []);
  orders.push({ id, items: cart, total: cartTotal(), name: $('#fName').value.trim(), email: $('#fEmail').value.trim(),
    phone: $('#fPhone').value.trim(), date: $('#fDate').value, at: new Date().toISOString() });
  save('superski_orders', orders);
  cart = [];
  persistCart();
  $('#orderId').textContent = id;
  $('#coForm').style.display = 'none';
  $('#coDone').style.display = 'block';
  form.reset();
});

// ---- 10. Cookie и кнопка «Наверх» ----
const cookie = $('#cookie');
if (load('superski_cookie', false)) cookie.classList.add('hidden');
$('#cookieOk').addEventListener('click', () => { save('superski_cookie', true); cookie.classList.add('hidden'); });

const toTop = $('#toTop');
window.addEventListener('scroll', () => toTop.classList.toggle('show', window.scrollY > 600));
toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Старт
renderCart();
