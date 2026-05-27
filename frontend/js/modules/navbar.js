// =========================================
// SANCTUARY AI — Navbar, Roles y Planes
// =========================================
// Depende de: auth.js (auth)

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
    const user = auth.getUser();
    if (!user) return 0;
    const key = `sanctuary_scans_${user.id}`;
    const today = new Date().toISOString().split('T')[0];
    const data = JSON.parse(localStorage.getItem(key) || '{}');
    return data[today] || 0;
  },
  addScan() {
    const user = auth.getUser();
    if (!user) return 0;
    const key = `sanctuary_scans_${user.id}`;
    const today = new Date().toISOString().split('T')[0];
    const data = JSON.parse(localStorage.getItem(key) || '{}');
    data[today] = (data[today] || 0) + 1;
    localStorage.setItem(key, JSON.stringify(data));
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
