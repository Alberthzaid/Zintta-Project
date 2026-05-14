-- =============================================================
-- ZINTTA · Schema completo de Supabase (PostgreSQL)
-- Ejecuta este archivo en: Supabase Dashboard > SQL Editor > New query
-- =============================================================

-- ---------------- TABLAS ----------------

CREATE TABLE IF NOT EXISTS public.categories (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL UNIQUE,
    created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.sizes (
    id          BIGSERIAL PRIMARY KEY,
    code        VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(100),
    created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.products (
    id          BIGSERIAL PRIMARY KEY,
    category_id BIGINT NOT NULL,
    name        VARCHAR(200) NOT NULL,
    description TEXT,
    active      BOOLEAN NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMP DEFAULT NOW(),
    updated_at  TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_products_category
        FOREIGN KEY (category_id) REFERENCES public.categories(id),

    CONSTRAINT uq_products_name UNIQUE(name)
);

CREATE TABLE IF NOT EXISTS public.product_variants (
    id                   BIGSERIAL PRIMARY KEY,
    product_id           BIGINT NOT NULL,
    size_id              BIGINT NOT NULL,

    production_cost      NUMERIC(12,2) NOT NULL DEFAULT 0,
    manufacturing_cost   NUMERIC(12,2) NOT NULL DEFAULT 0,

    wholesale_price      NUMERIC(12,2) NOT NULL DEFAULT 0,
    retail_price         NUMERIC(12,2) NOT NULL DEFAULT 0,

    wholesale_profit     NUMERIC(12,2)
        GENERATED ALWAYS AS (wholesale_price - production_cost) STORED,

    retail_profit        NUMERIC(12,2)
        GENERATED ALWAYS AS (retail_price - production_cost) STORED,

    active     BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_variants_product
        FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE,

    CONSTRAINT fk_variants_size
        FOREIGN KEY (size_id) REFERENCES public.sizes(id),

    CONSTRAINT uq_product_size UNIQUE(product_id, size_id)
);

CREATE TABLE IF NOT EXISTS public.price_history (
    id                  BIGSERIAL PRIMARY KEY,
    product_variant_id  BIGINT NOT NULL,
    old_wholesale_price NUMERIC(12,2),
    new_wholesale_price NUMERIC(12,2),
    old_retail_price    NUMERIC(12,2),
    new_retail_price    NUMERIC(12,2),
    changed_at          TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_history_variant
        FOREIGN KEY (product_variant_id) REFERENCES public.product_variants(id) ON DELETE CASCADE
);

-- ---------------- ÍNDICES ----------------

CREATE INDEX IF NOT EXISTS idx_products_category  ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_variants_product   ON public.product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_variants_size      ON public.product_variants(size_id);
CREATE INDEX IF NOT EXISTS idx_variants_active    ON public.product_variants(active);
CREATE INDEX IF NOT EXISTS idx_history_variant    ON public.price_history(product_variant_id);
CREATE INDEX IF NOT EXISTS idx_history_changed_at ON public.price_history(changed_at DESC);

-- ---------------- TRIGGERS: updated_at ----------------

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_products_updated_at ON public.products;
CREATE TRIGGER trg_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_variants_updated_at ON public.product_variants;
CREATE TRIGGER trg_variants_updated_at
BEFORE UPDATE ON public.product_variants
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------------- TRIGGER: price_history automático ----------------
-- Registra cada cambio de precio mayorista o detal de una variante.

CREATE OR REPLACE FUNCTION public.log_price_change()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.wholesale_price IS DISTINCT FROM OLD.wholesale_price
       OR NEW.retail_price IS DISTINCT FROM OLD.retail_price THEN
        INSERT INTO public.price_history(
            product_variant_id,
            old_wholesale_price, new_wholesale_price,
            old_retail_price,    new_retail_price
        ) VALUES (
            NEW.id,
            OLD.wholesale_price, NEW.wholesale_price,
            OLD.retail_price,    NEW.retail_price
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_variants_price_history ON public.product_variants;
CREATE TRIGGER trg_variants_price_history
AFTER UPDATE OF wholesale_price, retail_price ON public.product_variants
FOR EACH ROW EXECUTE FUNCTION public.log_price_change();

-- ---------------- SEED DATA ----------------

INSERT INTO public.categories(name) VALUES
('POLOS'),
('BUZOS'),
('CAMISETAS')
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.sizes(code, description) VALUES
('S-M',   'Talla Small-Medium'),
('L-XL',  'Talla Large-Extra Large'),
('2-4',   'Niños 2-4'),
('6-8',   'Niños 6-8'),
('10-12', 'Niños 10-12'),
('14-16', 'Niños 14-16'),
('2XL',   'Extra Large 2'),
('3XL',   'Extra Large 3')
ON CONFLICT (code) DO NOTHING;

INSERT INTO public.products(category_id, name, description)
SELECT c.id, 'POLO HOMBRE BASICO', 'Polo básico para hombre'
FROM public.categories c WHERE c.name = 'POLOS'
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.product_variants(
    product_id, size_id,
    production_cost, manufacturing_cost,
    wholesale_price, retail_price
)
SELECT p.id, s.id, 32500, 22500, 46428.57, 67000
FROM public.products p
JOIN public.sizes s ON s.code = 'S-M'
WHERE p.name = 'POLO HOMBRE BASICO'
ON CONFLICT (product_id, size_id) DO NOTHING;

-- ---------------- ROW LEVEL SECURITY (RLS) ----------------
-- Solo usuarios autenticados pueden leer/escribir. El catálogo público de
-- Zintta podría querer SELECT abierto en products/categories/sizes — adapta
-- según necesidad.

ALTER TABLE public.categories       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sizes            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_history    ENABLE ROW LEVEL SECURITY;

-- Lectura pública (anon) del catálogo
DROP POLICY IF EXISTS "public_read_categories"       ON public.categories;
DROP POLICY IF EXISTS "public_read_sizes"            ON public.sizes;
DROP POLICY IF EXISTS "public_read_products"         ON public.products;
DROP POLICY IF EXISTS "public_read_product_variants" ON public.product_variants;

CREATE POLICY "public_read_categories"       ON public.categories       FOR SELECT USING (true);
CREATE POLICY "public_read_sizes"            ON public.sizes            FOR SELECT USING (true);
CREATE POLICY "public_read_products"         ON public.products         FOR SELECT USING (true);
CREATE POLICY "public_read_product_variants" ON public.product_variants FOR SELECT USING (true);

-- Escritura solo para usuarios autenticados (Supabase Auth)
DROP POLICY IF EXISTS "auth_write_categories"       ON public.categories;
DROP POLICY IF EXISTS "auth_write_sizes"            ON public.sizes;
DROP POLICY IF EXISTS "auth_write_products"         ON public.products;
DROP POLICY IF EXISTS "auth_write_variants"         ON public.product_variants;
DROP POLICY IF EXISTS "auth_read_history"           ON public.price_history;

CREATE POLICY "auth_write_categories" ON public.categories
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "auth_write_sizes" ON public.sizes
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "auth_write_products" ON public.products
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "auth_write_variants" ON public.product_variants
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "auth_read_history" ON public.price_history
    FOR SELECT TO authenticated USING (true);

-- =============================================================
-- LISTO ✅
-- Próximos pasos manuales:
--   1) Authentication > Providers > Email: habilita "Email" y desactiva
--      "Confirm email" si quieres usar el admin sin verificar correo.
--   2) Authentication > Users > Add user: crea tu usuario admin.
--   3) Settings > API: copia "Project URL" y "anon public key" al .env
--      del frontend.
-- =============================================================
