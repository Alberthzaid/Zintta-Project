# ZINTTA · PRD

## Problema original
"Analiza Zintta-project" → modificar UI + construir dashboard admin orientado a la base de datos + conectar el catálogo público a Supabase.

## Stack
- React 18 + TS + Vite + Tailwind v4 + React Router 7
- Supabase (PostgreSQL + Auth) vía `@supabase/supabase-js`
- Stub FastAPI mínimo (no funcional)

## Cambios entregados

### Sesión 1
- UI pública: links navbar, hero "Prendas de alta gama y exclusivas", CTA "Cotizar artículo"
- Dashboard admin completo en `/dashboard-admin` (Auth Supabase + 6 páginas)
- Schema SQL completo

### Sesión 2
- ProductCatalog conectado a Supabase (productos activos + variantes)
- ProductDetailPage conectado a Supabase (tallas reales, precios dinámicos)
- Helper WhatsApp con `VITE_WHATSAPP_NUMBER`
- Schema extendido: `image_url` + `badge` en products

### Sesión 3 (este pase)
- 🐛 BUG FIX crítico: el `onSubmit` de ProductsPage NO enviaba `image_url` ni `badge` al backend (campos del form se perdían al guardar). Ahora payload completo.
- Admin ProductsPage muestra **thumbnail** + **badge chip** en cada fila de la tabla
- Formulario de producto tiene **vista previa en vivo** de la card (imagen + nombre + badge + descripción)
- `.env` limpio (sin comentarios per platform rules), `.env.example` creado
- README rebuilt con paso-a-paso de 4 pasos para que el usuario configure Supabase manualmente

## Estado actual
- TS compila ✓ · ESLint 0 issues ✓ · Build verificado ✓
- Frontend respondiendo 200 en `/` y `/dashboard-admin/login`
- Todo listo para que el usuario:
  1. Pegue `supabase/schema.sql` en SQL Editor
  2. Cree usuario admin en Authentication
  3. Llene URL + anon key + WhatsApp en `frontend/.env`
  4. Reinicie frontend

## Backlog
- Subida del diseño cliente a Supabase Storage
- Mockup AI con Gemini Nano Banana (wow factor)
- Code splitting con React.lazy
- Tests con Vitest + RTL
- SEO meta tags y favicon ZINTTA
