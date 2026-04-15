// =========================================
// SANCTUARY AI — API & Auth JavaScript
// =========================================

// Auto-detect: si estoy en localhost uso backend local, si no uso Render
const isLocal = location.hostname === 'localhost' || location.hostname === '127.0.0.1' || location.protocol === 'file:';
const API_BASE = isLocal ? 'http://localhost:3001/api' : 'https://sanctuary-ai-backend.onrender.com/api';

// ─── API HELPER ───
const api = {
  async request(method, endpoint, data = null) {
    const opts = {
      method,
      headers: { 'Content-Type': 'application/json' },
    };
    if (data) opts.body = JSON.stringify(data);
    try {
      const res = await fetch(`${API_BASE}${endpoint}`, opts);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || json.message || 'Error del servidor');
      return json;
    } catch (err) {
      if (err.name === 'TypeError' || err.message === 'Failed to fetch') {
        throw new Error('No se pudo conectar al servidor. Puede estar iniciando (espera 30 seg) o sin conexión a internet.');
      }
      throw err;
    }
  },
  get(endpoint)         { return this.request('GET', endpoint); },
  post(endpoint, data)  { return this.request('POST', endpoint, data); },
  put(endpoint, data)   { return this.request('PUT', endpoint, data); },
  delete(endpoint)      { return this.request('DELETE', endpoint); },
};

// ─── AUTH ───
const auth = {
  getUser() {
    try { return JSON.parse(localStorage.getItem('sanctuary_user')); } catch { return null; }
  },
  setUser(user) { localStorage.setItem('sanctuary_user', JSON.stringify(user)); },
  removeUser() { localStorage.removeItem('sanctuary_user'); },
  isLoggedIn() { return !!this.getUser(); },
  requireAuth() {
    if (!this.isLoggedIn()) { window.location.href = 'login.html'; return false; }
    return true;
  },
  logout() {
    this.removeUser();
    window.location.href = 'index.html';
  },
  async login(email, password) {
    const data = await api.post('/auth/login', { email, password });
    if (data.user) this.setUser(data.user);
    return data;
  },
  async register(firstName, lastName, email, password) {
    const data = await api.post('/auth/register', { firstName, lastName, email, password });
    if (data.user) this.setUser(data.user);
    return data;
  },
};

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
  // Swap icon: eye vs eye-off
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

// ─── CATEGORY COLORS ───
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

// ─── NAVBAR USER ───
function renderNavbarUser() {
  const user = auth.getUser();
  if (!user) return;
  const initials = (user.firstName?.[0] || '') + (user.lastName?.[0] || '');
  const planLabel = user.plan === 'plus' ? '👑 Premium' : '📋 Básico';
  const avatarEl = document.getElementById('navbar-avatar');
  const nameEl = document.getElementById('navbar-name');
  const planEl = document.getElementById('navbar-plan');
  if (avatarEl) avatarEl.textContent = initials;
  if (nameEl) nameEl.textContent = `${user.firstName} ${user.lastName}`;
  if (planEl) planEl.textContent = planLabel;
}

// ─── ROLE-BASED UI ───
// Oculta elementos con clase .advisor-only si el usuario no es asesor
function applyRoleUI() {
  const user = auth.getUser();
  if (!user) return;
  const isAdvisor = user.role === 'advisor' || user.plan === 'advisor';
  document.querySelectorAll('.advisor-only').forEach(el => {
    el.style.display = isAdvisor ? '' : 'none';
  });
}


// ─── MODAL HELPERS ───
function openModal(id) { show(`#${id}`); }
function closeModal(id) { hide(`#${id}`); }
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.add('hidden');
  }
});

// ─── DROPDOWN TOGGLE ───
document.addEventListener('click', (e) => {
  const trigger = e.target.closest('[data-dropdown]');
  const menu = e.target.closest('.dropdown-menu');
  if (!trigger && !menu) {
    $$('.dropdown-menu').forEach(m => m.classList.add('hidden'));
  }
  if (trigger) {
    const targetId = trigger.dataset.dropdown;
    const targetMenu = document.getElementById(targetId);
    if (targetMenu) {
      $$('.dropdown-menu').forEach(m => { if (m !== targetMenu) m.classList.add('hidden'); });
      targetMenu.classList.toggle('hidden');
    }
  }
});

// ─── LOGOUT ───
document.addEventListener('click', (e) => {
  if (e.target.id === 'logout-btn' || e.target.closest('#logout-btn')) {
    auth.logout();
  }
});

// ─── THEME SYSTEM ───
const ACCENT_COLORS = {
  rojo:     { accent: '#e94560', secondary: '#533483' },
  azul:     { accent: '#3b82f6', secondary: '#1d4ed8' },
  verde:    { accent: '#10b981', secondary: '#059669' },
  violeta:  { accent: '#8b5cf6', secondary: '#6d28d9' },
  naranja:  { accent: '#f97316', secondary: '#ea580c' },
  rosa:     { accent: '#ec4899', secondary: '#db2777' },
  cyan:     { accent: '#06b6d4', secondary: '#0891b2' },
};

const theme = {
  get() {
    return {
      mode: localStorage.getItem('sanctuary_theme') || 'light',
      accent: localStorage.getItem('sanctuary_accent') || 'rojo',
    };
  },
  setMode(mode) {
    localStorage.setItem('sanctuary_theme', mode);
    this.apply();
  },
  setAccent(name) {
    localStorage.setItem('sanctuary_accent', name);
    this.apply();
  },
  toggleMode() {
    const current = this.get().mode;
    this.setMode(current === 'dark' ? 'light' : 'dark');
  },
  apply() {
    const { mode, accent } = this.get();
    // Dark mode
    document.documentElement.setAttribute('data-theme', mode);
    // Accent color
    const colors = ACCENT_COLORS[accent] || ACCENT_COLORS.rojo;
    document.documentElement.style.setProperty('--accent', colors.accent);
    document.documentElement.style.setProperty('--secondary', colors.secondary);
    // Update toggles UI if present
    const toggle = document.getElementById('dark-toggle');
    if (toggle) {
      toggle.classList.toggle('active', mode === 'dark');
    }
    const modeLabel = document.getElementById('dark-label');
    if (modeLabel) {
      modeLabel.textContent = mode === 'dark' ? 'Modo Oscuro activado' : 'Modo Claro activado';
    }
    // Update swatches
    document.querySelectorAll('.color-swatch').forEach(s => {
      s.classList.toggle('active', s.dataset.color === accent);
    });
  },
};

// Apply theme on every page load
theme.apply();
