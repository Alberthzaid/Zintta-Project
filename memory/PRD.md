# ZINTTA · PRD

## Problema original
"Analiza Zintta-project" → modificar UI + construir dashboard admin orientado a la base de datos.

## Stack
- React 18 + TS + Vite + Tailwind v4 + React Router 7
- Supabase (PostgreSQL + Auth) vía `@supabase/supabase-js`
- Sin backend Python (server.py stub mínimo solo para satisfacer supervisor)

## Cambios entregados (sesión 1)

### UI pública
- Navbar: links → "Catálogo", "Categorías", "Nosotros", "Contáctanos"
- Hero title → "Prendas de alta gama y exclusivas"
- CTA button → "Cotizar artículo"

### Dashboard admin `/dashboard-admin`
- Login Supabase (email/password) con AuthContext + ProtectedRoute
- AdminLayout con sidebar (Resumen, Categorías, Tallas, Productos, Historial)
- AdminHome: 4 métricas (categorías, tallas, productos, variantes) con count exact
- CRUD completo:
  - Categorías
  - Tallas
  - Productos (con filtro por categoría y búsqueda)
  - Variantes (anidado /productos/:id/variantes — talla + costos + precios + utilidades calculadas)
  - Historial de precios (vista global + modal per-variant)
- Toggle activo/inactivo en productos y variantes
- Cálculo en vivo de wholesale_profit y retail_profit en el formulario

### Backend
- `supabase/schema.sql` listo para pegar en SQL Editor:
  - 5 tablas (categories, sizes, products, product_variants, price_history)
  - Generated columns (wholesale_profit, retail_profit)
  - Triggers (updated_at, price_history automático)
  - Índices, FKs, UNIQUE constraints
  - RLS: SELECT público al catálogo, mutaciones solo `authenticated`
  - Seed: 3 categorías, 8 tallas, 1 producto + 1 variante

## Pendiente (usuario)
1. Crear proyecto Supabase + correr `supabase/schema.sql`
2. Habilitar Auth Email + crear usuario admin
3. Llenar `frontend/.env` con `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`
4. Reiniciar frontend (`sudo supervisorctl restart frontend`)

## Backlog
- Conectar el catálogo público a Supabase (hoy es hardcoded en `ProductCatalog.tsx`)
- Reemplazar imágenes de `lh3.googleusercontent.com/aida-public/*` (URLs efímeras)
- Reemplazar `wa.me/yournumber` con `VITE_WHATSAPP_NUMBER`
- Subir el diseño del configurador a Supabase Storage y enviar el link por WhatsApp
- Code splitting (`React.lazy`) para reducir bundle (hoy 506 KB / 147 KB gzipped)
- Mockup AI del diseño con Gemini Nano Banana (wow factor)
- Tests con Vitest

## Métricas técnicas (sesión 1)
- Bundle: 506 KB (147 KB gzipped) ✓
- Lint: 0 issues
- TS: compila limpio
