// =========================================
// SANCTUARY AI — Sidebar Component
// =========================================
// Componente reutilizable: se inyecta en cada vista
// Uso: <div id="sidebar"></div> + renderSidebar('dashboard')

function renderSidebar(activePage) {
  const container = document.getElementById('sidebar');
  if (!container) return;

  const navItems = [
    {
      section: 'Principal',
      items: [
        { id: 'nav-panel', href: 'dashboard.html', icon: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>', label: 'Panel', page: 'dashboard' },
        { id: 'nav-gastos', href: 'gastos.html', icon: '<rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>', label: 'Gastos', page: 'gastos' },
        { id: 'nav-insights', href: 'insights.html', icon: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>', label: 'Perspectivas IA', page: 'insights' },
        { id: 'nav-asesor', href: 'asesor.html', icon: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>', label: 'Portal del Asesor', page: 'asesor', advisorOnly: true },
        { id: 'nav-soporte', href: 'soporte.html', icon: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>', label: 'Soporte', page: 'soporte' },
      ]
    }
  ];

  const navHTML = navItems.map(section => `
    <div class="sidebar-section-title">${section.section}</div>
    ${section.items.map(item => `
      <a href="${item.href}" class="sidebar-item${item.page === activePage ? ' active' : ''}${item.advisorOnly ? ' advisor-only' : ''}" id="${item.id}">
        <svg class="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${item.icon}</svg>
        ${item.label}
      </a>
    `).join('')}
  `).join('');

  container.innerHTML = `
    <aside class="sidebar">
      <div class="sidebar-logo">
        <div class="sidebar-logo-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>
        </div>
        <div>
          <div class="sidebar-logo-text">Sanctuary AI</div>
        </div>
      </div>

      <nav class="sidebar-nav">
        ${navHTML}
      </nav>

      <div class="sidebar-cta">
        <div class="sidebar-cta-text">Escanear Recibo</div>
        <div class="sidebar-cta-sub">Subí una foto de tu ticket</div>
        <a href="gastos.html" class="sidebar-cta-btn">+ Subir Ticket</a>
      </div>

      <div class="sidebar-footer">
        <a href="perfil.html" class="sidebar-item">
          <svg class="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
          Mi Perfil
        </a>
        <button class="sidebar-item sidebar-logout-btn" style="color:rgba(233,69,96,0.8)">
          <svg class="sidebar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Cerrar Sesión
        </button>
      </div>
    </aside>
  `;

  // Bind logout en el sidebar
  const logoutBtn = container.querySelector('.sidebar-logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => auth.logout());
  }
}
