import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MetricsAPI, type DashboardMetrics } from '../../lib/api'
import toast from 'react-hot-toast'

const CARDS: Array<{
  key: keyof DashboardMetrics
  label: string
  icon: string
  hint?: keyof DashboardMetrics
  hintLabel?: string
  color: string
  href: string
}> = [
  {
    key: 'totalCategories',
    label: 'Categorías',
    icon: 'category',
    color: 'from-[#ff1a88] to-[#ff1a88]/50',
    href: '/dashboard-admin/categorias',
  },
  {
    key: 'totalSizes',
    label: 'Tallas',
    icon: 'straighten',
    color: 'from-[#D4AF37] to-[#D4AF37]/40',
    href: '/dashboard-admin/tallas',
  },
  {
    key: 'totalProducts',
    label: 'Productos',
    icon: 'checkroom',
    hint: 'activeProducts',
    hintLabel: 'activos',
    color: 'from-emerald-400 to-emerald-700',
    href: '/dashboard-admin/productos',
  },
  {
    key: 'totalVariants',
    label: 'Variantes',
    icon: 'tune',
    hint: 'activeVariants',
    hintLabel: 'activas',
    color: 'from-sky-400 to-indigo-700',
    href: '/dashboard-admin/productos',
  },
]

export default function AdminHome() {
  const [m, setM] = useState<DashboardMetrics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    MetricsAPI.fetch()
      .then(setM)
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-10">
      <header>
        <p className="text-[11px] font-bold uppercase tracking-widest text-[#ff1a88] mb-2">
          Panel administrativo
        </p>
        <h1 className="text-4xl font-bold tracking-tight">Resumen general</h1>
        <p className="text-white/50 mt-2">
          Vista en tiempo real del catálogo de Zintta sincronizada con Supabase.
        </p>
      </header>

      <section
        data-testid="metrics-grid"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {CARDS.map((card) => {
          const value = m?.[card.key]
          const hintValue = card.hint && m ? m[card.hint] : null
          return (
            <Link
              key={card.key}
              to={card.href}
              data-testid={`metric-card-${card.key}`}
              className="group relative overflow-hidden rounded-2xl border border-[#3a2730] bg-[#181014] p-6 hover:border-[#ff1a88]/50 transition-all"
            >
              <div
                className={`absolute -top-12 -right-12 size-32 rounded-full bg-gradient-to-br ${card.color} opacity-10 blur-2xl group-hover:opacity-20 transition-opacity`}
              />
              <div className="relative">
                <div className="size-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-5 group-hover:border-[#ff1a88]/40 transition-colors">
                  <span
                    className="material-symbols-outlined text-[#ff1a88]"
                    style={{ fontSize: '22px' }}
                  >
                    {card.icon}
                  </span>
                </div>
                <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-2">
                  {card.label}
                </p>
                <p className="text-4xl font-bold tracking-tighter text-white">
                  {loading ? '—' : (value ?? 0)}
                </p>
                {card.hint && (
                  <p className="text-xs text-white/40 mt-2">
                    <span className="text-emerald-400 font-bold">
                      {loading ? '—' : (hintValue ?? 0)}
                    </span>{' '}
                    {card.hintLabel}
                  </p>
                )}
              </div>
            </Link>
          )
        })}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Link
          to="/dashboard-admin/productos"
          data-testid="quick-products-card"
          className="group rounded-2xl border border-[#3a2730] bg-gradient-to-br from-[#ff1a88]/10 to-transparent p-8 hover:border-[#ff1a88]/50 transition-all"
        >
          <span
            className="material-symbols-outlined text-[#ff1a88] mb-4 block"
            style={{ fontSize: '32px' }}
          >
            add_circle
          </span>
          <h3 className="text-2xl font-bold mb-2">Crear un producto</h3>
          <p className="text-white/50 mb-6">
            Define un nuevo artículo del catálogo y configura sus variantes por talla,
            costos y precios.
          </p>
          <span className="text-[#ff1a88] font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
            Ir a productos
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
              arrow_forward
            </span>
          </span>
        </Link>

        <Link
          to="/dashboard-admin/historial"
          data-testid="quick-history-card"
          className="group rounded-2xl border border-[#3a2730] bg-gradient-to-br from-[#D4AF37]/10 to-transparent p-8 hover:border-[#D4AF37]/50 transition-all"
        >
          <span
            className="material-symbols-outlined text-[#D4AF37] mb-4 block"
            style={{ fontSize: '32px' }}
          >
            history
          </span>
          <h3 className="text-2xl font-bold mb-2">Auditoría de precios</h3>
          <p className="text-white/50 mb-6">
            Cada cambio de precio mayorista o detal queda registrado automáticamente vía
            trigger en PostgreSQL.
          </p>
          <span className="text-[#D4AF37] font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
            Ver historial
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
              arrow_forward
            </span>
          </span>
        </Link>
      </section>
    </div>
  )
}
