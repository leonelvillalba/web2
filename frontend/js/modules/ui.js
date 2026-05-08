// =========================================
// SANCTUARY AI — UI Helpers
// =========================================
// Sin dependencias externas

// ─── DOM HELPERS ───
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

function show(el) { if (typeof el === 'string') el = $(el); el && el.classList.remove('hidden'); }
function hide(el) { if (typeof el === 'string') el = $(el); el && el.classList.add('hidden'); }
function toggle(el) { if (typeof el === 'string') el = $(el); el && el.classList.toggle('hidden'); }

// ─── PASSWORD VISIBILITY ───
function togglePassword(inputId, btnId) {
  const input = document.getElementById(inputId);
  const btn = document.getElementById(btnId);
  if (!input) return;
  const isHidden = input.type === 'password';
  input.type = isHidden ? 'text' : 'password';
  btn.innerHTML = isHidden
    ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`
    : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
}

function setHTML(sel, html) { const el = $(sel); if (el) el.innerHTML = html; }
function setText(sel, text) { const el = $(sel); if (el) el.textContent = text; }

function showAlert(sel, msg, type = 'error') {
  const el = $(sel);
  if (!el) return;
  el.className = `alert alert-${type}`;
  el.innerHTML = `<svg class="alert-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    ${type === 'error' ? '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>'
    : '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>'}
  </svg>${msg}`;
  show(el);
}
function hideAlert(sel) { hide(sel); }

// ─── TOAST ───
function toast(msg, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<span>${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span> ${msg}`;
  container.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translateY(10px)'; t.style.transition = '0.3s'; setTimeout(() => t.remove(), 300); }, 3000);
}

// ─── LOADING STATE ───
function setLoading(btn, loading) {
  if (loading) {
    btn.dataset.originalText = btn.innerHTML;
    btn.innerHTML = '<span class="spinner"></span>';
    btn.disabled = true;
  } else {
    btn.innerHTML = btn.dataset.originalText || btn.innerHTML;
    btn.disabled = false;
  }
}

// ─── MONEY FORMAT ───
function formatMoney(amount, currency = 'ARS') {
  const user = auth.getUser();
  const curr = user?.currency || currency;
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: curr, maximumFractionDigits: 0 }).format(amount);
}

// ─── DATE FORMAT ───
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ─── CATEGORY HELPERS ───
const categoryClass = {
  'Supermercado': 'cat-supermercado', 'Transporte': 'cat-transporte',
  'Restaurantes': 'cat-restaurantes', 'Salud': 'cat-salud',
  'Vivienda': 'cat-vivienda', 'Servicios': 'cat-servicios',
  'Suscripciones': 'cat-suscripciones', 'Compras': 'cat-compras',
  'Ingresos': 'cat-ingresos',
};
const categoryIcons = {
  'Supermercado': '🛒', 'Transporte': '🚌', 'Restaurantes': '🍽️', 'Salud': '💊',
  'Vivienda': '🏠', 'Servicios': '📡', 'Suscripciones': '📱', 'Compras': '🛍️',
  'Ingresos': '💰', 'Otros': '📦',
};
function categoryChip(cat) {
  const cls = categoryClass[cat] || 'cat-otros';
  const icon = categoryIcons[cat] || '📦';
  return `<span class="category-chip ${cls}">${icon} ${cat}</span>`;
}

// ─── MODAL HELPERS ───
function openModal(id) { show(`#${id}`); }
function closeModal(id) { hide(`#${id}`); }
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.add('hidden');
  }
});
