import { supabase } from './supabase'
import type {
  Category,
  PriceHistory,
  Product,
  ProductVariant,
  Size,
} from './database.types'

/* ===================== CATEGORIES ===================== */
export const CategoriesAPI = {
  async list(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true })
    if (error) throw error
    return data ?? []
  },
  async create(name: string): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .insert({ name })
      .select()
      .single()
    if (error) throw error
    return data
  },
  async update(id: number, name: string): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .update({ name })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },
  async remove(id: number): Promise<void> {
    const { error } = await supabase.from('categories').delete().eq('id', id)
    if (error) throw error
  },
}

/* ===================== SIZES ===================== */
export const SizesAPI = {
  async list(): Promise<Size[]> {
    const { data, error } = await supabase
      .from('sizes')
      .select('*')
      .order('id', { ascending: true })
    if (error) throw error
    return data ?? []
  },
  async create(code: string, description: string | null): Promise<Size> {
    const { data, error } = await supabase
      .from('sizes')
      .insert({ code, description })
      .select()
      .single()
    if (error) throw error
    return data
  },
  async update(
    id: number,
    fields: { code?: string; description?: string | null }
  ): Promise<Size> {
    const { data, error } = await supabase
      .from('sizes')
      .update(fields)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },
  async remove(id: number): Promise<void> {
    const { error } = await supabase.from('sizes').delete().eq('id', id)
    if (error) throw error
  },
}

/* ===================== PRODUCTS ===================== */
export type ProductWithCategory = Product & {
  categories: Pick<Category, 'id' | 'name'> | null
}

export const ProductsAPI = {
  async list(): Promise<ProductWithCategory[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories ( id, name )')
      .order('created_at', { ascending: false })
    if (error) throw error
    return (data as unknown as ProductWithCategory[]) ?? []
  },
  async get(id: number): Promise<ProductWithCategory> {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories ( id, name )')
      .eq('id', id)
      .single()
    if (error) throw error
    return data as unknown as ProductWithCategory
  },
  async create(payload: {
    category_id: number
    name: string
    description?: string | null
    image_url?: string | null
    badge?: string | null
    active?: boolean
  }): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .insert(payload)
      .select()
      .single()
    if (error) throw error
    return data
  },
  async update(
    id: number,
    payload: {
      category_id?: number
      name?: string
      description?: string | null
      image_url?: string | null
      badge?: string | null
      active?: boolean
    }
  ): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .update(payload)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },
  async remove(id: number): Promise<void> {
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) throw error
  },
  async toggleActive(id: number, active: boolean): Promise<Product> {
    return this.update(id, { active })
  },
}

/* ===================== PUBLIC CATALOG ===================== */
export type CatalogProduct = ProductWithCategory & {
  minRetailPrice: number | null
  minWholesalePrice: number | null
  availableSizes: string[]
}

export type CatalogProductDetail = CatalogProduct & {
  variants: Array<{
    id: number
    size_id: number
    size_code: string
    size_description: string | null
    retail_price: number
    wholesale_price: number
    active: boolean
  }>
}

export const PublicCatalogAPI = {
  /** Returns only active products with their min retail price (across active variants). */
  async listActive(): Promise<CatalogProduct[]> {
    const { data, error } = await supabase
      .from('products')
      .select(
        `*,
         categories ( id, name ),
         product_variants ( retail_price, wholesale_price, active, sizes ( code ) )`
      )
      .eq('active', true)
      .order('created_at', { ascending: false })
    if (error) throw error
    const rows = (data ?? []) as unknown as Array<
      ProductWithCategory & {
        product_variants: Array<{
          retail_price: number
          wholesale_price: number
          active: boolean
          sizes: { code: string } | null
        }>
      }
    >
    return rows.map((p) => {
      const activeVariants = p.product_variants.filter((v) => v.active)
      const retails = activeVariants
        .map((v) => Number(v.retail_price))
        .filter((n) => Number.isFinite(n) && n > 0)
      const wholesales = activeVariants
        .map((v) => Number(v.wholesale_price))
        .filter((n) => Number.isFinite(n) && n > 0)
      return {
        ...p,
        minRetailPrice: retails.length ? Math.min(...retails) : null,
        minWholesalePrice: wholesales.length ? Math.min(...wholesales) : null,
        availableSizes: activeVariants
          .map((v) => v.sizes?.code)
          .filter((s): s is string => Boolean(s)),
      }
    })
  },

  async getById(id: number): Promise<CatalogProductDetail | null> {
    const { data, error } = await supabase
      .from('products')
      .select(
        `*,
         categories ( id, name ),
         product_variants (
           id, size_id, retail_price, wholesale_price, active,
           sizes ( id, code, description )
         )`
      )
      .eq('id', id)
      .maybeSingle()
    if (error) throw error
    if (!data) return null
    const row = data as unknown as ProductWithCategory & {
      product_variants: Array<{
        id: number
        size_id: number
        retail_price: number
        wholesale_price: number
        active: boolean
        sizes: { id: number; code: string; description: string | null } | null
      }>
    }
    const activeVariants = row.product_variants.filter((v) => v.active)
    const retails = activeVariants
      .map((v) => Number(v.retail_price))
      .filter((n) => Number.isFinite(n) && n > 0)
    const wholesales = activeVariants
      .map((v) => Number(v.wholesale_price))
      .filter((n) => Number.isFinite(n) && n > 0)
    return {
      ...row,
      minRetailPrice: retails.length ? Math.min(...retails) : null,
      minWholesalePrice: wholesales.length ? Math.min(...wholesales) : null,
      availableSizes: activeVariants
        .map((v) => v.sizes?.code)
        .filter((s): s is string => Boolean(s)),
      variants: row.product_variants.map((v) => ({
        id: v.id,
        size_id: v.size_id,
        size_code: v.sizes?.code ?? `#${v.size_id}`,
        size_description: v.sizes?.description ?? null,
        retail_price: Number(v.retail_price),
        wholesale_price: Number(v.wholesale_price),
        active: v.active,
      })),
    }
  },
}

/* ===================== PRODUCT VARIANTS ===================== */
export type VariantWithSize = ProductVariant & {
  sizes: Pick<Size, 'id' | 'code' | 'description'> | null
}

export const VariantsAPI = {
  async listByProduct(productId: number): Promise<VariantWithSize[]> {
    const { data, error } = await supabase
      .from('product_variants')
      .select('*, sizes ( id, code, description )')
      .eq('product_id', productId)
      .order('id', { ascending: true })
    if (error) throw error
    return (data as unknown as VariantWithSize[]) ?? []
  },
  async create(payload: {
    product_id: number
    size_id: number
    production_cost: number
    manufacturing_cost: number
    wholesale_price: number
    retail_price: number
    active?: boolean
  }): Promise<ProductVariant> {
    const { data, error } = await supabase
      .from('product_variants')
      .insert(payload)
      .select()
      .single()
    if (error) throw error
    return data
  },
  async update(
    id: number,
    payload: {
      size_id?: number
      production_cost?: number
      manufacturing_cost?: number
      wholesale_price?: number
      retail_price?: number
      active?: boolean
    }
  ): Promise<ProductVariant> {
    const { data, error } = await supabase
      .from('product_variants')
      .update(payload)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },
  async remove(id: number): Promise<void> {
    const { error } = await supabase.from('product_variants').delete().eq('id', id)
    if (error) throw error
  },
  async toggleActive(id: number, active: boolean): Promise<ProductVariant> {
    return this.update(id, { active })
  },
}

/* ===================== PRICE HISTORY ===================== */
export const PriceHistoryAPI = {
  async listByVariant(variantId: number): Promise<PriceHistory[]> {
    const { data, error } = await supabase
      .from('price_history')
      .select('*')
      .eq('product_variant_id', variantId)
      .order('changed_at', { ascending: false })
    if (error) throw error
    return data ?? []
  },
  async listAll(limit = 100): Promise<PriceHistory[]> {
    const { data, error } = await supabase
      .from('price_history')
      .select('*')
      .order('changed_at', { ascending: false })
      .limit(limit)
    if (error) throw error
    return data ?? []
  },
}

/* ===================== METRICS (Dashboard home) ===================== */
export type DashboardMetrics = {
  totalCategories: number
  totalSizes: number
  totalProducts: number
  activeProducts: number
  totalVariants: number
  activeVariants: number
}

export const MetricsAPI = {
  async fetch(): Promise<DashboardMetrics> {
    const [cats, szs, prods, prodsActive, vars, varsActive] = await Promise.all([
      supabase.from('categories').select('*', { count: 'exact', head: true }),
      supabase.from('sizes').select('*', { count: 'exact', head: true }),
      supabase.from('products').select('*', { count: 'exact', head: true }),
      supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('active', true),
      supabase.from('product_variants').select('*', { count: 'exact', head: true }),
      supabase
        .from('product_variants')
        .select('*', { count: 'exact', head: true })
        .eq('active', true),
    ])
    return {
      totalCategories: cats.count ?? 0,
      totalSizes: szs.count ?? 0,
      totalProducts: prods.count ?? 0,
      activeProducts: prodsActive.count ?? 0,
      totalVariants: vars.count ?? 0,
      activeVariants: varsActive.count ?? 0,
    }
  },
}
