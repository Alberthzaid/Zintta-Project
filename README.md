# ZINTTA · Print Studio

Landing premium + **panel administrativo** del catálogo, conectado a **Supabase (PostgreSQL)**.

> Stack: React 18 + TypeScript + Vite + TailwindCSS v4 + React Router 7
> + `@supabase/supabase-js` para datos, auth y RLS.

---

## 🚀 Puesta en marcha (3 pasos)

### 1. Crear el proyecto en Supabase

1. Entra a [supabase.com/dashboard](https://supabase.com/dashboard) y crea un nuevo proyecto.
2. En el menú lateral abre **SQL Editor → New query**.
3. Copia el contenido de [`supabase/schema.sql`](./supabase/schema.sql) y ejecútalo.
   Esto crea las tablas, índices, triggers (`updated_at` y `price_history` automático),
   políticas RLS y datos de ejemplo.

### 2. Configurar autenticación

1. **Authentication → Providers → Email**: activa "Email". Si quieres entrar sin verificar
   el correo, desactiva "Confirm email".
2. **Authentication → Users → Add user → Create new user**: crea tu usuario admin
   (`email` + `password`). Marca **Auto Confirm User**.

### 3. Conectar el frontend

1. En Supabase: **Settings → API**. Copia `Project URL` y `anon public` API key.
2. Edita [`frontend/.env`](./frontend/.env):

   ```env
   VITE_SUPABASE_URL=https://TU_PROJECT_REF.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOi...   # anon public key (NO uses service_role)
   VITE_WHATSAPP_NUMBER=                  # opcional, ej: 573001234567
   ```

3. Reinicia el frontend:

   ```bash
   sudo supervisorctl restart frontend
   ```

4. Entra a `/dashboard-admin/login` y autentícate con el usuario que creaste.

---

## 🗂️ Estructura del proyecto

```
/app
├── supabase/
│   └── schema.sql            ← Script SQL completo (copia y pega en Supabase)
├── frontend/
│   ├── .env                  ← Variables VITE_SUPABASE_*
│   └── src/
│       ├── lib/
│       │   ├── supabase.ts          ← Cliente Supabase tipado
│       │   ├── database.types.ts    ← Tipos TS de las tablas
│       │   └── api.ts               ← Capa de datos (CategoriesAPI, SizesAPI, …)
│       ├── context/AuthContext.tsx  ← Sesión de Supabase Auth
│       ├── components/
│       │   ├── admin/               ← AdminLayout, ProtectedRoute, Modal, Button …
│       │   ├── layout/              ← Navbar (público), Footer, WhatsAppFab
│       │   ├── home/                ← Hero, Catalog, BrandTrust, CTA
│       │   └── product/             ← ProductGallery, ConfigPanel, …
│       └── pages/
│           ├── HomePage.tsx
│           ├── ProductDetailPage.tsx
│           └── admin/
│               ├── AdminLogin.tsx
│               ├── AdminHome.tsx          ← Métricas
│               ├── CategoriesPage.tsx
│               ├── SizesPage.tsx
│               ├── ProductsPage.tsx
│               ├── VariantsPage.tsx       ← /productos/:id/variantes
│               └── HistoryPage.tsx        ← Auditoría de precios
└── backend/                  ← Stub mínimo (no se usa, Supabase reemplaza al backend)
```

---

## 🧭 Rutas

| Ruta | Descripción | Auth |
|---|---|---|
| `/` | Landing pública | — |
| `/product/:id` | Configurador de producto | — |
| `/dashboard-admin/login` | Login del admin | — |
| `/dashboard-admin` | Resumen + métricas | ✅ |
| `/dashboard-admin/categorias` | CRUD de categorías | ✅ |
| `/dashboard-admin/tallas` | CRUD de tallas | ✅ |
| `/dashboard-admin/productos` | CRUD de productos | ✅ |
| `/dashboard-admin/productos/:id/variantes` | CRUD de variantes + historial | ✅ |
| `/dashboard-admin/historial` | Auditoría global de precios | ✅ |

---

## 🗃️ Modelo de datos (resumen)

- **categories** · maestro de grupos (POLOS, BUZOS, CAMISETAS).
- **sizes** · maestro de tallas (S-M, L-XL, 2XL, 10-12, …).
- **products** · pertenece a una `category`. Único por nombre.
- **product_variants** · `(product_id, size_id)` único. Cada variante guarda:
  - `production_cost`, `manufacturing_cost`
  - `wholesale_price`, `retail_price`
  - **`wholesale_profit`** = `wholesale_price − production_cost` *(GENERATED ALWAYS AS STORED)*
  - **`retail_profit`** = `retail_price − production_cost` *(GENERATED ALWAYS AS STORED)*
- **price_history** · alimentada automáticamente por un **trigger** cada vez que cambia
  `wholesale_price` o `retail_price` de una variante.

---

## 🔒 Seguridad (RLS)

Todas las tablas tienen Row Level Security activado:
- `categories`, `sizes`, `products`, `product_variants` → **SELECT público**
  (el catálogo de la web pública puede consultar sin auth).
- Todas las escrituras (`INSERT/UPDATE/DELETE`) requieren un usuario autenticado
  (`auth.role() = 'authenticated'`).
- `price_history` solo se lee con auth.

> Si más adelante quieres rol específico de "admin", crea una tabla `profiles`
> con columna `role` y endurece las policies con `auth.uid()`.

---

## 🛠️ Comandos útiles

```bash
# Reiniciar servicios (después de cambiar .env o instalar deps)
sudo supervisorctl restart frontend
sudo supervisorctl restart backend

# Logs
tail -f /var/log/supervisor/frontend.out.log

# Tipos TS desde Supabase (opcional, requiere la CLI)
npx supabase gen types typescript --project-id YOUR_PROJECT_REF > frontend/src/lib/database.types.ts
```

---

## ✅ Checklist post-instalación

- [ ] Ejecuté `supabase/schema.sql` en el SQL Editor.
- [ ] Habilité el provider Email en Auth.
- [ ] Creé un usuario admin con Auto Confirm.
- [ ] Llené `frontend/.env` con URL + anon key.
- [ ] Reinicié `frontend` con supervisor.
- [ ] Pude iniciar sesión en `/dashboard-admin/login`.
- [ ] Vi mis categorías sembradas (POLOS / BUZOS / CAMISETAS).
- [ ] Edité un precio de variante y apareció el registro en *Historial*.
