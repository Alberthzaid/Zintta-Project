# ZINTTA · Print Studio

Landing premium + **panel administrativo** del catálogo, conectado a **Supabase (PostgreSQL)**.

> Stack: React 18 + TypeScript + Vite + TailwindCSS v4 + React Router 7
> + `@supabase/supabase-js` para datos, auth y RLS.

---

## 🚀 Puesta en marcha (5 minutos)

### Paso 1 — Crear el proyecto en Supabase

1. Entra a [supabase.com/dashboard](https://supabase.com/dashboard) y crea un proyecto nuevo.
2. En el menú lateral abre **SQL Editor → New query**.
3. Copia el contenido completo de [`supabase/schema.sql`](./supabase/schema.sql) y ejecútalo.

   Esto crea:
   - 5 tablas (`categories`, `sizes`, `products`, `product_variants`, `price_history`)
   - Índices, foreign keys y unique constraints
   - Generated columns (`wholesale_profit`, `retail_profit`)
   - Triggers automáticos (`updated_at`, `price_history` con log de cada cambio de precio)
   - Políticas RLS (SELECT público al catálogo, escrituras solo `authenticated`)
   - Seed: 3 categorías, 8 tallas, 1 producto + 1 variante

> ⚠️ El script es idempotente (`CREATE … IF NOT EXISTS`, `ON CONFLICT DO NOTHING`, `ADD COLUMN IF NOT EXISTS`). Puedes re-ejecutarlo sin perder datos si añadimos columnas en el futuro.

### Paso 2 — Configurar autenticación

1. **Authentication → Providers → Email**: activa "Email".
2. Si quieres entrar sin verificar el correo, desactiva "Confirm email".
3. **Authentication → Users → Add user → Create new user**: crea tu admin
   (`email` + `password`). Marca **Auto Confirm User**.

### Paso 3 — Conectar el frontend

1. En Supabase: **Settings → API**. Copia:
   - `Project URL`
   - `anon public` API key (⚠️ NO uses `service_role` en el frontend)

2. Edita [`frontend/.env`](./frontend/.env):

   ```env
   VITE_SUPABASE_URL=https://TU_REF.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
   VITE_WHATSAPP_NUMBER=573001234567   # opcional, código de país sin signos
   ```

3. Reinicia el frontend:

   ```bash
   sudo supervisorctl restart frontend
   ```

4. Abre [`/dashboard-admin/login`](/dashboard-admin/login) y entra con tu usuario admin.

### Paso 4 — Crear productos desde el admin

1. En el panel ve a **Productos → Nuevo producto**.
2. Completa:
   - **Categoría** (selecciona una existente)
   - **Nombre** (único, hasta 200 caracteres)
   - **Descripción** (opcional)
   - **URL de imagen** — pega un link público (Unsplash, Cloudinary, S3, etc.)
   - **Badge** — texto corto que aparecerá como pill en la card (`Bestseller`, `Premium`, `Nuevo`…)
   - **Activo** — si está marcado, aparece en el catálogo público
3. Guarda. El producto aparece inmediatamente en `/` (catálogo público).
4. Entra al producto → **Variantes** para añadir tallas con sus costos y precios.

> 💡 Mientras escribes en el formulario verás una **vista previa** en vivo de cómo se verá la card.

---

## 🗂️ Estructura del proyecto

```
/app
├── supabase/
│   └── schema.sql            ← Script SQL completo (copia y pega en Supabase)
├── frontend/
│   ├── .env                  ← Variables VITE_SUPABASE_* + VITE_WHATSAPP_NUMBER
│   └── src/
│       ├── lib/
│       │   ├── supabase.ts          ← Cliente Supabase tipado
│       │   ├── database.types.ts    ← Tipos TS de las tablas
│       │   ├── api.ts               ← CategoriesAPI, SizesAPI, ProductsAPI,
│       │   │                          VariantsAPI, PriceHistoryAPI, MetricsAPI,
│       │   │                          PublicCatalogAPI
│       │   └── whatsapp.ts          ← Helper para construir wa.me URLs
│       ├── context/AuthContext.tsx  ← Sesión de Supabase Auth
│       ├── components/
│       │   ├── admin/               ← AdminLayout, ProtectedRoute, Modal, Button…
│       │   ├── layout/              ← Navbar (público), Footer, WhatsAppFab
│       │   ├── home/                ← Hero, Catalog, BrandTrust, CTA, ProductCard
│       │   └── product/             ← ProductGallery, ConfigPanel, QuoteModal, Upload
│       └── pages/
│           ├── HomePage.tsx                ← Catálogo público (Supabase)
│           ├── ProductDetailPage.tsx       ← Detalle por ID (Supabase)
│           └── admin/
│               ├── AdminLogin.tsx
│               ├── AdminHome.tsx           ← Métricas
│               ├── CategoriesPage.tsx
│               ├── SizesPage.tsx
│               ├── ProductsPage.tsx        ← CRUD + thumb + badge + preview
│               ├── VariantsPage.tsx        ← /productos/:id/variantes
│               └── HistoryPage.tsx         ← Auditoría de precios
└── backend/                  ← Stub mínimo (Supabase reemplaza al backend)
```

---

## 🧭 Rutas

| Ruta | Descripción | Auth |
|---|---|---|
| `/` | Catálogo público (productos activos) | — |
| `/product/:id` | Detalle del producto con tallas reales | — |
| `/dashboard-admin/login` | Login del admin | — |
| `/dashboard-admin` | Resumen + métricas | ✅ |
| `/dashboard-admin/categorias` | CRUD de categorías | ✅ |
| `/dashboard-admin/tallas` | CRUD de tallas | ✅ |
| `/dashboard-admin/productos` | CRUD de productos (con `image_url` y `badge`) | ✅ |
| `/dashboard-admin/productos/:id/variantes` | CRUD de variantes + historial | ✅ |
| `/dashboard-admin/historial` | Auditoría global de precios | ✅ |

---

## 🗃️ Modelo de datos

- **categories** · maestro de grupos (POLOS, BUZOS, CAMISETAS).
- **sizes** · maestro de tallas (S-M, L-XL, 2XL, 10-12, …).
- **products** · pertenece a una `category`. Único por nombre.
  - `image_url TEXT` y `badge VARCHAR(50)` para presentar la card.
- **product_variants** · `(product_id, size_id)` único. Cada variante guarda:
  - `production_cost`, `manufacturing_cost`
  - `wholesale_price`, `retail_price`
  - **`wholesale_profit`** = `wholesale_price − production_cost` *(GENERATED ALWAYS AS STORED)*
  - **`retail_profit`** = `retail_price − production_cost` *(GENERATED ALWAYS AS STORED)*
- **price_history** · alimentada automáticamente por un trigger cada vez que cambia
  `wholesale_price` o `retail_price` de una variante.

---

## 🔒 Seguridad (RLS)

Todas las tablas tienen Row Level Security activado:
- `categories`, `sizes`, `products`, `product_variants` → **SELECT público**
- Todas las escrituras requieren un usuario autenticado (`authenticated`).
- `price_history` solo se lee con auth.

---

## ✅ Checklist post-instalación

- [ ] Ejecuté `supabase/schema.sql` en el SQL Editor.
- [ ] Habilité el provider Email en Auth.
- [ ] Creé un usuario admin con Auto Confirm.
- [ ] Llené `frontend/.env` con URL + anon key (+ opcionalmente número de WhatsApp).
- [ ] Reinicié `frontend` con `sudo supervisorctl restart frontend`.
- [ ] Pude iniciar sesión en `/dashboard-admin/login`.
- [ ] Vi mis categorías sembradas (POLOS / BUZOS / CAMISETAS).
- [ ] Creé un producto con `image_url` y `badge` y lo vi en el catálogo público.
- [ ] Edité un precio de variante y apareció el registro en *Historial*.
