import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import WhatsAppFab from '../components/layout/WhatsAppFab'
import ProductCard from '../components/home/ProductCard'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { CategoriesAPI, PublicCatalogAPI, type CatalogProduct } from '../lib/api'
import { isSupabaseConfigured } from '../lib/supabase'
import type { Category } from '../lib/database.types'

type SortKey = 'recent' | 'price-asc' | 'price-desc' | 'name-asc'

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'recent', label: 'Más recientes' },
  { value: 'price-asc', label: 'Precio: menor a mayor' },
  { value: 'price-desc', label: 'Precio: mayor a menor' },
  { value: 'name-asc', label: 'Nombre A–Z' },
]

export default function CatalogPage() {
  const [products, setProducts] = useState<CatalogProduct[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('Todos')
  const [activeSize, setActiveSize] = useState<string>('Todas')
  const [sort, setSort] = useState<SortKey>('recent')

  const gridRef = useScrollAnimation({ childSelector: '.product-card', stagger: 90 })

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      setError('Conecta Supabase en /app/frontend/.env para ver el catálogo en vivo.')
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

  const allSizes = useMemo(() => {
    const set = new Set<string>()
    for (const p of products) for (const s of p.availableSizes) set.add(s)
    return Array.from(set).sort()
  }, [products])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    let list = products.filter((p) => {
      if (activeCategory !== 'Todos' && p.categories?.name !== activeCategory) return false
      if (activeSize !== 'Todas' && !p.availableSizes.includes(activeSize)) return false
      if (q) {
        const hay =
          p.name.toLowerCase().includes(q) ||
          (p.description?.toLowerCase().includes(q) ?? false) ||
          (p.categories?.name?.toLowerCase().includes(q) ?? false)
        if (!hay) return false
      }
      return true
    })

    list = [...list].sort((a, b) => {
      switch (sort) {
        case 'price-asc':
          return (a.minRetailPrice ?? Infinity) - (b.minRetailPrice ?? Infinity)
        case 'price-desc':
          return (b.minRetailPrice ?? -Infinity) - (a.minRetailPrice ?? -Infinity)
        case 'name-asc':
          return a.name.localeCompare(b.name, 'es')
        case 'recent':
        default:
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          )
      }
    })

    return list
  }, [products, search, activeCategory, activeSize, sort])

  const filtersActive =
    search.trim() !== '' || activeCategory !== 'Todos' || activeSize !== 'Todas'

  const resetFilters = () => {
    setSearch('')
    setActiveCategory('Todos')
    setActiveSize('Todas')
    setSort('recent')
  }

  return (
    <div className="bg-[#0b0b0b] text-slate-100 min-h-screen">
      <Navbar />

      <main className="pt-28 pb-24">
        {/* Hero compacto */}
        <section className="relative max-w-7xl mx-auto px-6">
          <div className="absolute inset-x-6 top-0 h-72 -z-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-br from-[#ff1a88]/10 via-transparent to-transparent rounded-3xl blur-3xl" />
          </div>

          <div className="relative z-10 flex flex-col gap-4 mb-12">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#ff1a88]">
              Catálogo
            </p>
            <h1
              data-testid="catalog-title"
              className="text-4xl md:text-6xl font-bold tracking-tight text-white"
            >
              Explora la colección
            </h1>
            <p className="text-white/50 text-base md:text-lg max-w-2xl">
              Selección curada de prendas premium. Filtra por categoría, talla o
              precio y cotiza al instante por WhatsApp.
            </p>
          </div>
        </section>

        {/* Layout: sidebar de filtros (izquierda) + grid (derecha) */}
        <section className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] gap-8">
            {/* Sidebar vertical de filtros */}
            <aside
              data-testid="catalog-toolbar"
              className="lg:sticky lg:top-28 lg:self-start"
            >
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl shadow-2xl shadow-black/40 p-5 space-y-6">
                {/* Header del sidebar */}
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold uppercase tracking-widest text-white">
                    Filtros
                  </h2>
                  <span
                    data-testid="catalog-count"
                    className="text-[11px] text-white/50"
                  >
                    {loading
                      ? 'Cargando…'
                      : `${filtered.length} ${
                          filtered.length === 1 ? 'producto' : 'productos'
                        }`}
                  </span>
                </div>

                {/* Búsqueda */}
                <div className="space-y-2">
                  <label
                    htmlFor="catalog-search"
                    className="text-[11px] font-semibold uppercase tracking-widest text-white/50"
                  >
                    Buscar
                  </label>
                  <div className="relative">
                    <span
                      className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none"
                      style={{ fontSize: '18px' }}
                    >
                      search
                    </span>
                    <input
                      id="catalog-search"
                      data-testid="catalog-search-input"
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Nombre, descripción…"
                      className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-9 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/30 transition-colors"
                    />
                    {search && (
                      <button
                        onClick={() => setSearch('')}
                        title="Limpiar búsqueda"
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 size-7 rounded-md hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                      >
                        <span
                          className="material-symbols-outlined"
                          style={{ fontSize: '18px' }}
                        >
                          close
                        </span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Ordenar */}
                <div className="space-y-2">
                  <label
                    htmlFor="catalog-sort"
                    className="text-[11px] font-semibold uppercase tracking-widest text-white/50"
                  >
                    Ordenar por
                  </label>
                  <select
                    id="catalog-sort"
                    data-testid="catalog-sort-select"
                    value={sort}
                    onChange={(e) => setSort(e.target.value as SortKey)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white cursor-pointer appearance-none focus:outline-none focus:border-white/30"
                  >
                    {SORT_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Categorías — lista vertical */}
                <div className="space-y-2">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-white/50">
                    Categoría
                  </p>
                  {/* Select oculto para tests/accesibilidad */}
                  <select
                    data-testid="catalog-category-select"
                    value={activeCategory}
                    onChange={(e) => setActiveCategory(e.target.value)}
                    className="sr-only"
                    aria-hidden="true"
                    tabIndex={-1}
                  >
                    <option value="Todos">Todas las categorías</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <div
                    data-testid="catalog-category-chips"
                    className="flex flex-col gap-1.5"
                  >
                    {['Todos', ...categories.map((c) => c.name)].map((name) => {
                      const active = activeCategory === name
                      return (
                        <button
                          key={name}
                          data-testid={`catalog-chip-${name}`}
                          onClick={() => setActiveCategory(name)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all border ${
                            active
                              ? 'bg-white text-black border-white'
                              : 'bg-white/[0.03] text-white/70 border-white/10 hover:bg-white/[0.08] hover:text-white'
                          }`}
                        >
                          {name}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Tallas */}
                <div className="space-y-2">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-white/50">
                    Talla
                  </p>
                  {/* Select oculto para tests/accesibilidad */}
                  <select
                    data-testid="catalog-size-select"
                    value={activeSize}
                    onChange={(e) => setActiveSize(e.target.value)}
                    disabled={allSizes.length === 0}
                    className="sr-only"
                    aria-hidden="true"
                    tabIndex={-1}
                  >
                    <option value="Todas">Todas las tallas</option>
                    {allSizes.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  {allSizes.length === 0 ? (
                    <p className="text-xs text-white/40">Sin tallas disponibles</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {['Todas', ...allSizes].map((s) => {
                        const active = activeSize === s
                        return (
                          <button
                            key={s}
                            onClick={() => setActiveSize(s)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                              active
                                ? 'bg-[#ff1a88] text-white border-[#ff1a88]'
                                : 'bg-white/[0.03] text-white/70 border-white/10 hover:bg-white/[0.08] hover:text-white'
                            }`}
                          >
                            {s}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>

                {/* Reset */}
                {filtersActive && (
                  <button
                    onClick={resetFilters}
                    data-testid="catalog-reset-filters"
                    className="w-full inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] hover:border-white/20 text-white/80 hover:text-white text-sm font-semibold transition-colors"
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: '16px' }}
                    >
                      restart_alt
                    </span>
                    Limpiar filtros
                  </button>
                )}
              </div>
            </aside>

            {/* Grid de productos */}
            <div className="min-w-0">
              {loading ? (
                <div
                  data-testid="catalog-loading"
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8"
                >
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="rounded-2xl bg-white/[0.02] border border-white/10 overflow-hidden"
                    >
                      <div className="aspect-[4/5] bg-white/[0.04] animate-pulse" />
                      <div className="p-6 space-y-4">
                        <div className="h-5 bg-white/[0.04] rounded animate-pulse w-3/4" />
                        <div className="h-3 bg-white/[0.04] rounded animate-pulse" />
                        <div className="h-9 bg-white/[0.04] rounded animate-pulse" />
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
                  <p className="text-white font-semibold mb-1">
                    Catálogo no disponible
                  </p>
                  <p className="text-white/50 text-sm">{error}</p>
                </div>
              ) : filtered.length === 0 ? (
                <div
                  data-testid="catalog-empty"
                  className="border border-dashed border-white/10 bg-white/[0.02] rounded-2xl p-16 text-center"
                >
                  <span
                    className="material-symbols-outlined text-white/30 mb-3 block"
                    style={{ fontSize: '36px' }}
                  >
                    search_off
                  </span>
                  <p className="text-white font-semibold mb-1">Sin resultados</p>
                  <p className="text-white/50 text-sm mb-6">
                    Prueba con otra búsqueda o limpia los filtros activos.
                  </p>
                  {filtersActive && (
                    <button
                      onClick={resetFilters}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black text-sm font-semibold hover:bg-white/90 transition-colors"
                    >
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: '16px' }}
                      >
                        restart_alt
                      </span>
                      Limpiar filtros
                    </button>
                  )}
                </div>
              ) : (
                <div
                  ref={gridRef}
                  data-testid="catalog-grid"
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8"
                >
                  {filtered.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppFab />
    </div>
  )
}
