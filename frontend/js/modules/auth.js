// =========================================
// SANCTUARY AI — Autenticación
// =========================================
// Depende de: config.js (nav), api.js (api)

const auth = {
  getUser() {
    try { return JSON.parse(localStorage.getItem('sanctuary_user')); } catch { return null; }
  },
  setUser(user) { localStorage.setItem('sanctuary_user', JSON.stringify(user)); },
  removeUser() { localStorage.removeItem('sanctuary_user'); },
  isLoggedIn() { return !!this.getUser(); },
  requireAuth() {
    if (!this.isLoggedIn()) { window.location.href = nav.toView('login.html'); return false; }
    return true;
  },
  logout() {
    this.removeUser();
    // Resetear tema a oscuro para que la landing se vea siempre negra
    localStorage.setItem('sanctuary_theme', 'dark');
    window.location.href = nav.toIndex();
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
