// =========================================
// SANCTUARY AI — Configuración Global
// =========================================

// CLIENT ID de Google Cloud para el inicio de sesión oficial
const GOOGLE_CLIENT_ID = "705826741224-o5anvv6apka3v95992lu0q06uvdfv7e1.apps.googleusercontent.com";

// Temporalmente apuntamos siempre al backend de producción en Render
const API_BASE = 'https://sanctuary-ai-backend.onrender.com/api';

// ─── NAV HELPER — detecta si estamos en /views/ para rutas relativas ───
const inViews = location.pathname.includes('/views/');
const nav = {
  toIndex: () => inViews ? '../index.html' : 'index.html',
  toView: (page) => inViews ? page : 'views/' + page,
};
