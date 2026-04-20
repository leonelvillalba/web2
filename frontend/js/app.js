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

// ─── PLAN MANAGEMENT ───
const plans = {
  isPremium() {
    const user = auth.getUser();
    return user && user.plan === 'plus';
  },
  isBasic() {
    return !this.isPremium();
  },
  // OCR scan counter (3/day for basic)
  getScanCount() {
    const today = new Date().toISOString().split('T')[0];
    const data = JSON.parse(localStorage.getItem('sanctuary_scans') || '{}');
    return data[today] || 0;
  },
  addScan() {
    const today = new Date().toISOString().split('T')[0];
    const data = JSON.parse(localStorage.getItem('sanctuary_scans') || '{}');
    data[today] = (data[today] || 0) + 1;
    localStorage.setItem('sanctuary_scans', JSON.stringify(data));
    return data[today];
  },
  canScan() {
    if (this.isPremium()) return true;
    return this.getScanCount() < 3;
  },
  scansRemaining() {
    if (this.isPremium()) return '∞';
    return Math.max(0, 3 - this.getScanCount());
  },
  // Show upgrade modal
  showUpgradePrompt(feature) {
    const msgs = {
      'scan': 'Alcanzaste el límite de 3 escaneos diarios.',
      'ai': 'El Asistente IA personalizado es exclusivo del Plan Plus.',
      'pdf': 'La exportación PDF es exclusiva del Plan Plus.',
      'stats': 'Las estadísticas avanzadas son exclusivas del Plan Plus.',
      'default': 'Esta función es exclusiva del Plan Plus.'
    };
    const msg = msgs[feature] || msgs['default'];
    // Create/show upgrade modal
    let modal = document.getElementById('upgrade-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'upgrade-modal';
      modal.className = 'modal-overlay';
      document.body.appendChild(modal);
    }
    modal.innerHTML = `
      <div class="modal" style="max-width:440px;text-align:center">
        <div style="font-size:3rem;margin-bottom:12px">👑</div>
        <h2 style="font-weight:800;font-size:1.3rem;margin-bottom:8px">Mejorá a Plan Plus</h2>
        <p class="text-muted" style="margin-bottom:20px;line-height:1.6">${msg}</p>
        <div style="background:var(--bg);border-radius:var(--radius);padding:16px;margin-bottom:20px;text-align:left">
          <div style="font-weight:700;font-size:0.85rem;margin-bottom:10px">Con Plan Plus obtenés:</div>
          <div style="display:flex;flex-direction:column;gap:6px;font-size:0.82rem">
            <div>✅ Escaneos ilimitados de tickets</div>
            <div>✅ Asistente IA personalizado</div>
            <div>✅ Estadísticas avanzadas</div>
            <div>✅ Exportación de informes PDF</div>
            <div>✅ Soporte prioritario</div>
          </div>
        </div>
        <div style="display:flex;gap:10px">
          <button class="btn btn-outline" style="flex:1" onclick="closeModal('upgrade-modal')">Quizás después</button>
          <button class="btn btn-accent" style="flex:1" onclick="toast('Módulo de pagos próximamente','info');closeModal('upgrade-modal')">Mejorar — $4.99/mes</button>
        </div>
      </div>
    `;
    modal.classList.remove('hidden');
    modal.style.display = 'flex';
  },
};

// Apply plan-based UI: hide .plus-only for basic users
function applyPlanUI() {
  document.querySelectorAll('.plus-only').forEach(el => {
    if (plans.isBasic()) {
      el.style.display = 'none';
    }
  });
  document.querySelectorAll('.basic-limit').forEach(el => {
    if (plans.isPremium()) {
      el.style.display = 'none';
    }
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
      mode: localStorage.getItem('sanctuary_theme') || 'dark',
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

// ─── NOTIFICATION SYSTEM ───
const notifications = {
  _key: 'sanctuary_notifications',

  _defaults() {
    const now = Date.now();
    return [
      { id: 1, type: 'warning', icon: '⚠️', title: 'Presupuesto al 80%', desc: 'Ya usaste el 80% de tu presupuesto mensual. Quedan $840 disponibles.', time: now - 1000 * 60 * 15, unread: true },
      { id: 2, type: 'success', icon: '✅', title: 'Ingreso registrado', desc: 'Se registró un nuevo ingreso de $85,000 en tu cuenta.', time: now - 1000 * 60 * 60 * 2, unread: true },
      { id: 3, type: 'info', icon: '🤖', title: 'Perspectiva de IA disponible', desc: 'Analizamos tus gastos del mes. Tenés una nueva recomendación personalizada.', time: now - 1000 * 60 * 60 * 24, unread: true },
      { id: 4, type: 'info', icon: '📊', title: 'Resumen semanal listo', desc: 'Tu resumen de gastos de la semana pasada está disponible para revisar.', time: now - 1000 * 60 * 60 * 48, unread: false },
      { id: 5, type: 'warning', icon: '💳', title: 'Gasto inusual detectado', desc: 'Detectamos un gasto en Restaurantes un 40% mayor al promedio de los últimos meses.', time: now - 1000 * 60 * 60 * 72, unread: false },
    ];
  },

  getAll() {
    try {
      const stored = localStorage.getItem(this._key);
      const ver = localStorage.getItem(this._key + '_v');
      // v2: force refresh to fix encoding
      if (stored && ver === '2') return JSON.parse(stored);
    } catch {}
    const defaults = this._defaults();
    this.save(defaults);
    localStorage.setItem(this._key + '_v', '2');
    return defaults;
  },

  save(list) {
    localStorage.setItem(this._key, JSON.stringify(list));
  },

  markAllRead() {
    const list = this.getAll().map(n => ({ ...n, unread: false }));
    this.save(list);
    return list;
  },

  markRead(id) {
    const list = this.getAll().map(n => n.id === id ? { ...n, unread: false } : n);
    this.save(list);
    return list;
  },

  unreadCount() {
    return this.getAll().filter(n => n.unread).length;
  },

  formatTime(ts) {
    const diff = Date.now() - ts;
    if (diff < 60000) return 'ahora';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
    return `${Math.floor(diff / 86400000)}d`;
  },

  render(list) {
    if (list.length === 0) {
      return `<div class="notif-empty"><div class="notif-empty-icon">🔔</div>Sin notificaciones nuevas</div>`;
    }
    return list.map(n => `
      <div class="notif-item ${n.unread ? 'unread' : ''}" data-notif-id="${n.id}">
        <div class="notif-icon type-${n.type}">${n.icon}</div>
        <div class="notif-body">
          <div class="notif-body-title">${n.title}</div>
          <div class="notif-body-desc">${n.desc}</div>
        </div>
        <div class="notif-time">${this.formatTime(n.time)}</div>
      </div>
    `).join('');
  },
};

function initNotifications() {
  const wrapper = document.getElementById('notif-wrapper');
  if (!wrapper) return;

  const btn = wrapper.querySelector('.navbar-btn-icon');
  const dot = wrapper.querySelector('.notif-dot');
  const panel = document.getElementById('notif-panel');
  const listEl = document.getElementById('notif-list');
  const markAllBtn = document.getElementById('notif-mark-all');

  function refreshDot() {
    const count = notifications.unreadCount();
    if (dot) dot.classList.toggle('hidden-dot', count === 0);
  }

  function renderList(list) {
    if (listEl) listEl.innerHTML = notifications.render(list);
  }

  refreshDot();
  renderList(notifications.getAll());

  // Toggle panel
  btn && btn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!panel) return;
    const isHidden = panel.classList.contains('hidden');
    // Close other dropdowns
    document.querySelectorAll('.dropdown-menu').forEach(m => m.classList.add('hidden'));
    panel.classList.toggle('hidden', !isHidden);
  });

  // Mark all as read
  markAllBtn && markAllBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const updated = notifications.markAllRead();
    renderList(updated);
    refreshDot();
  });

  // Mark individual as read on click
  listEl && listEl.addEventListener('click', (e) => {
    const item = e.target.closest('[data-notif-id]');
    if (!item) return;
    const id = parseInt(item.dataset.notifId);
    const updated = notifications.markRead(id);
    item.classList.remove('unread');
    refreshDot();
  });

  // Close panel when clicking outside
  document.addEventListener('click', (e) => {
    if (!panel) return;
    if (!wrapper.contains(e.target)) {
      panel.classList.add('hidden');
    }
  });
}

// Init on DOMContentLoaded (o inmediatamente si ya cargó)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initNotifications);
} else {
  initNotifications();
}
