// =========================================
// SANCTUARY AI — Sistema de Temas
// =========================================
// Sin dependencias externas (usa localStorage)

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
    let { mode, accent } = this.get();

    // Páginas públicas (landing, login, register) → siempre oscuras
    const page = location.pathname.split('/').pop() || 'index.html';
    const publicPages = ['index.html', 'login.html', 'register.html', ''];
    const isPublic = publicPages.includes(page);
    if (isPublic) mode = 'dark';

    // Aplicar modo
    document.documentElement.setAttribute('data-theme', mode);
    // Accent color
    const colors = ACCENT_COLORS[accent] || ACCENT_COLORS.rojo;
    document.documentElement.style.setProperty('--accent', colors.accent);
    document.documentElement.style.setProperty('--secondary', colors.secondary);
    // Update toggles UI if present
    const toggle = document.getElementById('dark-toggle');
    if (toggle) {
      toggle.classList.toggle('active', this.get().mode === 'dark');
    }
    const modeLabel = document.getElementById('dark-label');
    if (modeLabel) {
      modeLabel.textContent = this.get().mode === 'dark' ? 'Modo Oscuro activado' : 'Modo Claro activado';
    }
    // Update swatches
    document.querySelectorAll('.color-swatch').forEach(s => {
      s.classList.toggle('active', s.dataset.color === accent);
    });
  },
};

// Apply theme on every page load
theme.apply();
