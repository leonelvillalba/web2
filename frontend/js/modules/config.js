// =========================================
// SANCTUARY AI — Configuración Global
// =========================================

// Auto-detect: si estoy en localhost uso backend local, si no uso Render
const isLocal = location.hostname === 'localhost' || location.hostname === '127.0.0.1' || location.protocol === 'file:';
const API_BASE = isLocal ? 'http://localhost:3001/api' : 'https://sanctuary-ai-backend.onrender.com/api';

// ─── NAV HELPER — detecta si estamos en /views/ para rutas relativas ───
const inViews = location.pathname.includes('/views/');
const nav = {
  toIndex: () => inViews ? '../index.html' : 'index.html',
  toView: (page) => inViews ? page : 'views/' + page,
};
