import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { PriceHistoryAPI } from '../../lib/api'
import type { PriceHistory } from '../../lib/database.types'
import EmptyState from '../../components/admin/EmptyState'

const fmt = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 2,
})

export default function HistoryPage() {
  const [items, setItems] = useState<PriceHistory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    PriceHistoryAPI.listAll(200)
      .then(setItems)
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-8">
      <header>
        <p className="text-[11px] font-bold uppercase tracking-widest text-[#ff1a88] mb-2">
          Auditoría
        </p>
        <h1 className="text-4xl font-bold tracking-tight">Historial de precios</h1>
        <p className="text-white/50 mt-2">
          Cada cambio de precio mayorista o detal queda registrado automáticamente por un
          trigger de PostgreSQL. Aquí ves los últimos 200.
        </p>
      </header>

      {loading ? (
        <div className="text-white/50 text-sm">Cargando…</div>
      ) : items.length === 0 ? (
        <EmptyState
          icon="history"
          title="Sin cambios registrados"
          description="Edita el precio mayorista o detal de cualquier variante y aparecerá un registro aquí automáticamente."
        />
      ) : (
        <div
          data-testid="history-table"
          className="rounded-2xl border border-[#3a2730] overflow-hidden bg-[#181014]"
        >
          <table className="w-full">
            <thead>
              <tr className="text-left text-[11px] font-bold uppercase tracking-widest text-white/40 border-b border-[#3a2730]">
                <th className="px-5 py-4 w-44">Fecha</th>
                <th className="px-5 py-4 w-32">Variante</th>
                <th className="px-5 py-4">Mayorista</th>
                <th className="px-5 py-4">Detal</th>
              </tr>
            </thead>
            <tbody>
              {items.map((h) => (
                <tr
                  key={h.id}
                  data-testid={`history-global-row-${h.id}`}
                  className="border-b border-[#3a2730] last:border-0 hover:bg-white/[0.02]"
                >
                  <td className="px-5 py-4 text-sm text-white/70">
                    {new Date(h.changed_at).toLocaleString('es-CO')}
                  </td>
                  <td className="px-5 py-4">
                    <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono">
                      #{h.product_variant_id}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm">
                    <span className="text-white/40 line-through">
                      {h.old_wholesale_price != null
                        ? fmt.format(Number(h.old_wholesale_price))
                        : '—'}
                    </span>
                    <span className="mx-2 text-[#ff1a88]">→</span>
                    <span className="font-bold">
                      {h.new_wholesale_price != null
                        ? fmt.format(Number(h.new_wholesale_price))
                        : '—'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm">
                    <span className="text-white/40 line-through">
                      {h.old_retail_price != null
                        ? fmt.format(Number(h.old_retail_price))
                        : '—'}
                    </span>
                    <span className="mx-2 text-[#ff1a88]">→</span>
                    <span className="font-bold">
                      {h.new_retail_price != null
                        ? fmt.format(Number(h.new_retail_price))
                        : '—'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
