# Sanctuary AI — Plataforma Inteligente de Gestión de Gastos

## Estructura del Proyecto

```
Santuario/
├── frontend/          ← Frontend (HTML + CSS + JavaScript)
│   ├── index.html     ← Landing page
│   ├── login.html     ← Inicio de sesión
│   ├── register.html  ← Registro de usuario
│   ├── dashboard.html ← Panel principal
│   ├── gastos.html    ← Gestión de gastos (CRUD + OCR)
│   ├── insights.html  ← Perspectivas de IA
│   ├── asesor.html    ← Portal del asesor financiero
│   ├── perfil.html    ← Perfil de usuario
│   ├── css/styles.css ← Estilos globales
│   └── js/app.js      ← API helper, auth, utilidades
│
├── backend/           ← Backend (NestJS + TypeORM + PostgreSQL)
│   ├── src/
│   │   ├── auth/      ← Autenticación (login, register, perfil)
│   │   ├── expenses/  ← CRUD de gastos
│   │   ├── dashboard/ ← Datos del panel
│   │   ├── insights/  ← Perspectivas IA
│   │   ├── advisor/   ← Portal del asesor
│   │   ├── seed/      ← Datos iniciales
│   │   └── entities/  ← Modelos User, Expense
│   └── .env           ← Variables de entorno (NO se sube a git)
│
└── README.md
```

## Tecnologías

- **Frontend:** HTML5, CSS3, JavaScript (vanilla)
- **Backend:** NestJS, TypeORM
- **Base de Datos:** PostgreSQL (Supabase)
- **IA/OCR:** Integrado en gastos.html (procesamiento de tickets)
- **Deploy:** Render (backend) + Vercel/hosting estático (frontend)

## Cómo ejecutar

### Backend
```bash
cd backend
npm install
# Configurar .env con DATABASE_URL
npx nest start
```
Backend en: http://localhost:3001

### Frontend
```bash
# Opción 1: Abrir directamente
abrir frontend/index.html en el navegador

# Opción 2: Con servidor local
npx http-server ./frontend -p 8080
```
Frontend en: http://localhost:8080
## Web
Frontend desplegado en: https://web2-delta-mauve.vercel.app/index.html#producto

## Usuarios de prueba
| Rol | Email | Contraseña | Plan |
|-----|-------|------------|------|
| Usuario Premium | leonel@sanctuary.ai | 123456 | Plus |
| Usuario Básico | maria@sanctuary.ai | 123456 | Basic |
| Asesor | asesor@sanctuary.ai | 123456 | Advisor |

## API Endpoints
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | /api/auth/login | Iniciar sesión |
| POST | /api/auth/register | Registrar usuario |
| GET | /api/auth/profile/:id | Obtener perfil |
| PUT | /api/auth/profile/:id | Actualizar perfil |
| GET | /api/expenses?userId=X | Listar gastos |
| POST | /api/expenses | Crear gasto |
| PUT | /api/expenses/:id | Editar gasto |
| DELETE | /api/expenses/:id | Eliminar gasto |
| GET | /api/dashboard?userId=X | Datos del panel |
| GET | /api/insights?userId=X | Perspectivas IA |
| GET | /api/advisor/clients | Clientes del asesor |
