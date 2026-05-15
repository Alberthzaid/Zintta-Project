import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'
import ProductCard from './ProductCard'
import { CategoriesAPI, PublicCatalogAPI, type CatalogProduct } from '../../lib/api'
import { isSupabaseConfigured } from '../../lib/supabase'
import type { Category } from '../../lib/database.types'

export default function ProductCatalog() {
  const [products, setProducts] = useState<CatalogProduct[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState<string>('Todos')

  const gridRef = useScrollAnimation({ childSelector: '.product-card', stagger: 120 })

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      setError(
        'Conecta Supabase en /app/frontend/.env para ver el catálogo en vivo.'
      )
      return
    }
    Promise.all([PublicCatalogAPI.listActive(), CategoriesAPI.list()])
      .then(([prods, cats]) => {
        setProducts(prods)
        setCategories(cats)
      })
      .catch((e: Error) => {
        setError(e.message)
        toast.error(e.message)
      })
      .finally(() => setLoading(false))
  }, [])

  const filters = useMemo(() => ['Todos', ...categories.map((c) => c.name)], [categories])

  const filtered = useMemo(() => {
    if (activeFilter === 'Todos') return products
    return products.filter((p) => p.categories?.name === activeFilter)
  }, [products, activeFilter])

  return (
    <section id="catalogo" className="max-w-7xl mx-auto px-6 py-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div className="space-y-4">
          <h2 className="text-4xl font-bold text-white tracking-tight">
            Catálogo de prendas premium
          </h2>
          <p className="text-white/40 text-lg max-w-md">
            Selección curada — sincronizada en tiempo real con nuestro inventario.
          </p>
        </div>

        {filters.length > 1 && (
          <div
            id="categorias"
            data-testid="catalog-filters"
            className="flex gap-2 overflow-x-auto pb-2 no-scrollbar"
          >
            {filters.map((f) => (
              <button
                key={f}
                data-testid={`filter-chip-${f}`}
                onClick={() => setActiveFilter(f)}
                className={`whitespace-nowrap px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  activeFilter === f
                    ? 'bg-[#ff1a88] text-white'
                    : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        )}
      </div>

      {loading ? (
        <div
          data-testid="catalog-loading"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
        >
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl bg-white/5 border border-white/5 overflow-hidden"
            >
              <div className="aspect-[4/5] bg-white/[0.04] animate-pulse" />
              <div className="p-8 space-y-4">
                <div className="h-6 bg-white/[0.04] rounded animate-pulse w-3/4" />
                <div className="h-4 bg-white/[0.04] rounded animate-pulse" />
                <div className="h-10 bg-white/[0.04] rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div
          data-testid="catalog-error"
          className="border border-amber-500/30 bg-amber-500/5 rounded-2xl p-12 text-center"
        >
          <span
            className="material-symbols-outlined text-amber-400 mb-3 block"
            style={{ fontSize: '36px' }}
          >
            cloud_off
          </span>
          <p className="text-white font-bold mb-1">Catálogo no disponible</p>
          <p className="text-white/50 text-sm">{error}</p>
        </div>
      ) : filtered.length === 0 ? (
        <div
          data-testid="catalog-empty"
          className="border border-dashed border-white/10 rounded-2xl p-16 text-center"
        >
          <p className="text-white/50">
            {activeFilter === 'Todos'
              ? 'Aún no hay productos publicados. Crea uno desde el panel administrativo.'
              : `Sin productos en la categoría "${activeFilter}".`}
          </p>
        </div>
      ) : (
        <div
          ref={gridRef}
          data-testid="catalog-grid"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
        >
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  )
}
