/**
 * Types matching the PostgreSQL schema:
 *   categories, sizes, products, product_variants, price_history
 *
 * Generated columns (wholesale_profit, retail_profit) are returned by the
 * database — never sent on insert/update.
 *
 * The Database type follows the shape expected by @supabase/supabase-js
 * (compatible with `supabase gen types typescript`).
 */
export type Category = {
  id: number
  name: string
  created_at: string
}

export type Size = {
  id: number
  code: string
  description: string | null
  created_at: string
}

export type Product = {
  id: number
  category_id: number
  name: string
  description: string | null
  active: boolean
  created_at: string
  updated_at: string
}

export type ProductVariant = {
  id: number
  product_id: number
  size_id: number
  production_cost: number
  manufacturing_cost: number
  wholesale_price: number
  retail_price: number
  wholesale_profit: number
  retail_profit: number
  active: boolean
  created_at: string
  updated_at: string
}

export type PriceHistory = {
  id: number
  product_variant_id: number
  old_wholesale_price: number | null
  new_wholesale_price: number | null
  old_retail_price: number | null
  new_retail_price: number | null
  changed_at: string
}

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: Category
        Insert: {
          id?: number
          name: string
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          created_at?: string
        }
        Relationships: []
      }
      sizes: {
        Row: Size
        Insert: {
          id?: number
          code: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          code?: string
          description?: string | null
          created_at?: string
        }
        Relationships: []
      }
      products: {
        Row: Product
        Insert: {
          id?: number
          category_id: number
          name: string
          description?: string | null
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          category_id?: number
          name?: string
          description?: string | null
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      product_variants: {
        Row: ProductVariant
        Insert: {
          id?: number
          product_id: number
          size_id: number
          production_cost?: number
          manufacturing_cost?: number
          wholesale_price?: number
          retail_price?: number
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          product_id?: number
          size_id?: number
          production_cost?: number
          manufacturing_cost?: number
          wholesale_price?: number
          retail_price?: number
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      price_history: {
        Row: PriceHistory
        Insert: {
          id?: number
          product_variant_id: number
          old_wholesale_price?: number | null
          new_wholesale_price?: number | null
          old_retail_price?: number | null
          new_retail_price?: number | null
          changed_at?: string
        }
        Update: {
          id?: number
          product_variant_id?: number
          old_wholesale_price?: number | null
          new_wholesale_price?: number | null
          old_retail_price?: number | null
          new_retail_price?: number | null
          changed_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
