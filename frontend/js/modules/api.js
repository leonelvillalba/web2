// =========================================
// SANCTUARY AI — API Helper
// =========================================
// Depende de: config.js (API_BASE)

const api = {
  async request(method, endpoint, data = null) {
    const opts = {
      method,
      headers: { 'Content-Type': 'application/json' },
    };
    const token = localStorage.getItem('sanctuary_token');
    if (token) {
      opts.headers['Authorization'] = `Bearer ${token}`;
    }
    if (data) opts.body = JSON.stringify(data);
    try {
      const res = await fetch(`${API_BASE}${endpoint}`, opts);
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || json.error || 'Error del servidor');
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
