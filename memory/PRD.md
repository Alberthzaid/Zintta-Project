# ZINTTA · PRD

## Problema original
"Analiza Zintta-project" → modificar UI + construir dashboard admin orientado a la base de datos + conectar el catálogo público a Supabase.

## Stack
- React 18 + TS + Vite + Tailwind v4 + React Router 7
- Supabase (PostgreSQL + Auth) vía `@supabase/supabase-js`
- Stub FastAPI mínimo (no se usa funcionalmente)

## Cambios entregados

### Sesión 1
- UI pública: links del navbar, hero title "Prendas de alta gama y exclusivas", CTA "Cotizar artículo"
- Dashboard admin completo en `/dashboard-admin` (Auth Supabase + 6 páginas CRUD)
- SQL completo en `/app/supabase/schema.sql` (tablas, generated columns, triggers, RLS)

### Sesión 2
- **ProductCatalog conectado a Supabase**: consume `products` activos + sus variantes; filtros dinámicos derivados de categories; estados loading/error/empty
- **ProductDetailPage conectado a Supabase**: carga producto por ID con `categories` + `product_variants` + `sizes`; tallas reales reemplazan las hardcoded; precio dinámico por talla seleccionada; tabla de precios por talla con retail + mayorista
- **WhatsApp helper centralizado** (`lib/whatsapp.ts`): usa `VITE_WHATSAPP_NUMBER`; reemplazado en WhatsAppFab (FAB se oculta si no está configurado), QuoteModal (mensaje completo con producto/color/talla/precio) y ProductCard (botón por producto)
- **Schema extendido**: `image_url` y `badge` añadidos a `products` (con `ADD COLUMN IF NOT EXISTS` para migración segura)
- **Admin ProductsPage**: nuevos inputs para `image_url` y `badge`

## Estado actual
- TS compila limpio · ESLint 0 issues · Build 145 KB gzipped ✓
- Routes verificadas con screenshots (catalog vacío + product error renderean correctamente sin Supabase)
- Listo para que el usuario llene `frontend/.env` con `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` y `VITE_WHATSAPP_NUMBER`

## Backlog
- Subir el diseño del configurador a Supabase Storage y enviar el link en el WhatsApp
- Mockup AI del diseño con Gemini Nano Banana (wow factor para conversión)
- Code splitting con React.lazy
- Reemplazar imágenes `lh3.googleusercontent.com/aida-public/*` (siguen en ProductGallery como fallback de la sesión 1)
- Tests con Vitest + RTL
- SEO meta tags (`og:image`, `twitter:card`, etc.)
