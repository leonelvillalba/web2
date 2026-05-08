// =========================================
// SANCTUARY AI — Sistema de Notificaciones
// =========================================
// Depende de: ui.js ($, $$)

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
