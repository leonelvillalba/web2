// =========================================
// SANCTUARY AI — App Entry Point
// =========================================
// Este archivo ahora solo sirve como punto de entrada.
// Toda la lógica fue separada en módulos dentro de js/modules/
//
// Orden de carga (respetar dependencias):
//   1. config.js   → API_BASE, nav helper
//   2. api.js      → fetch wrapper (depende de config)
//   3. auth.js     → login/logout (depende de config + api)
//   4. ui.js       → DOM helpers, toast, alerts, formatters
//   5. theme.js    → dark/light mode, accent colors
//   6. navbar.js   → navbar user, roles, plans, dropdowns, logout
//   7. notifications.js → notification panel
//
// Cada página HTML carga los scripts en este orden:
//   <script src="../js/components/sidebar.js"></script>  (si tiene sidebar)
//   <script src="../js/app.js"></script>                 (este archivo)
//   <script> ... lógica específica de la página ... </script>
//
// NOTA: Este archivo queda vacío intencionalmente.
// Los módulos se cargan vía <script> tags en el HTML.
// Ver: js/modules/ para toda la lógica de la aplicación.
