import { FormEvent, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  PriceHistoryAPI,
  ProductsAPI,
  SizesAPI,
  VariantsAPI,
  type ProductWithCategory,
  type VariantWithSize,
} from '../../lib/api'
import type { PriceHistory, Size } from '../../lib/database.types'
import Button from '../../components/admin/Button'
import Modal from '../../components/admin/Modal'
import { Field, NumberInput, Select } from '../../components/admin/FormControls'
import EmptyState from '../../components/admin/EmptyState'

const fmt = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 2,
})

const empty = {
  size_id: '',
  production_cost: '0',
  manufacturing_cost: '0',
  wholesale_price: '0',
  retail_price: '0',
  active: true,
}

export default function VariantsPage() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const id = Number(productId)

  const [product, setProduct] = useState<ProductWithCategory | null>(null)
  const [variants, setVariants] = useState<VariantWithSize[]>([])
  const [sizes, setSizes] = useState<Size[]>([])
  const [loading, setLoading] = useState(true)

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<VariantWithSize | null>(null)
  const [form, setForm] = useState({ ...empty })
  const [saving, setSaving] = useState(false)

  const [historyOpen, setHistoryOpen] = useState(false)
  const [history, setHistory] = useState<PriceHistory[]>([])
  const [historyVariant, setHistoryVariant] = useState<VariantWithSize | null>(null)

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [p, v, s] = await Promise.all([
        ProductsAPI.get(id),
        VariantsAPI.listByProduct(id),
        SizesAPI.list(),
      ])
      setProduct(p)
      setVariants(v)
      setSizes(s)
    } catch (e) {
      toast.error((e as Error).message)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    if (Number.isFinite(id)) fetchAll()
  }, [id])

  // Sizes available for the create form (not already used unless editing this one)
  const availableSizes = useMemo(() => {
    const used = new Set(
      variants.filter((v) => v.id !== editing?.id).map((v) => v.size_id)
    )
    return sizes.filter((s) => !used.has(s.id))
  }, [sizes, variants, editing])

  const onOpen = (v?: VariantWithSize) => {
    setEditing(v ?? null)
    if (v) {
      setForm({
        size_id: String(v.size_id),
        production_cost: String(v.production_cost),
        manufacturing_cost: String(v.manufacturing_cost),
        wholesale_price: String(v.wholesale_price),
        retail_price: String(v.retail_price),
        active: v.active,
      })
    } else {
      setForm({ ...empty, size_id: availableSizes[0] ? String(availableSizes[0].id) : '' })
    }
    setOpen(true)
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!form.size_id) {
      toast.error('Selecciona una talla')
      return
    }
    setSaving(true)
    try {
      const payload = {
        size_id: Number(form.size_id),
        production_cost: Number(form.production_cost),
        manufacturing_cost: Number(form.manufacturing_cost),
        wholesale_price: Number(form.wholesale_price),
        retail_price: Number(form.retail_price),
        active: form.active,
      }
      if (editing) {
        await VariantsAPI.update(editing.id, payload)
        toast.success('Variante actualizada')
      } else {
        await VariantsAPI.create({ product_id: id, ...payload })
        toast.success('Variante creada')
      }
      setOpen(false)
      fetchAll()
    } catch (e) {
      toast.error((e as Error).message)
    } finally {
      setSaving(false)
    }
  }

  const onDelete = async (v: VariantWithSize) => {
    if (!confirm(`¿Eliminar la variante talla ${v.sizes?.code}?`)) return
    try {
      await VariantsAPI.remove(v.id)
      toast.success('Variante eliminada')
      fetchAll()
    } catch (e) {
      toast.error((e as Error).message)
    }
  }

  const onToggleActive = async (v: VariantWithSize) => {
    try {
      await VariantsAPI.toggleActive(v.id, !v.active)
      fetchAll()
    } catch (e) {
      toast.error((e as Error).message)
    }
  }

  const openHistory = async (v: VariantWithSize) => {
    setHistoryVariant(v)
    setHistoryOpen(true)
    try {
      setHistory(await PriceHistoryAPI.listByVariant(v.id))
    } catch (e) {
      toast.error((e as Error).message)
    }
  }

  // Live profit calculation for the form
  const liveWholesaleProfit =
    Number(form.wholesale_price || 0) - Number(form.production_cost || 0)
  const liveRetailProfit =
    Number(form.retail_price || 0) - Number(form.production_cost || 0)

  if (!Number.isFinite(id)) {
    return <div className="text-white/50">ID de producto inválido</div>
  }

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-white/40">
        <Link to="/dashboard-admin/productos" className="hover:text-[#ff1a88]">
          Productos
        </Link>
        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
          chevron_right
        </span>
        <span className="text-white">{product?.name ?? '…'}</span>
        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
          chevron_right
        </span>
        <span className="text-[#ff1a88]">Variantes</span>
      </nav>

      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#ff1a88] mb-2">
            {product?.categories?.name ?? '—'}
          </p>
          <h1 className="text-4xl font-bold tracking-tight">
            {product?.name ?? 'Cargando…'}
          </h1>
          <p className="text-white/50 mt-2">
            Configura una variante por cada talla disponible — costos, precios y
            márgenes calculados en tiempo real.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            testId="back-products-btn"
            variant="ghost"
            icon="arrow_back"
            onClick={() => navigate('/dashboard-admin/productos')}
          >
            Volver
          </Button>
          <Button
            testId="new-variant-btn"
            icon="add"
            onClick={() => onOpen()}
            disabled={availableSizes.length === 0}
          >
            Nueva variante
          </Button>
        </div>
      </header>

      {availableSizes.length === 0 && sizes.length > 0 && variants.length === sizes.length && (
        <div className="px-5 py-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-sm">
          Este producto ya tiene una variante por cada talla disponible.
        </div>
      )}

      {loading ? (
        <div className="text-white/50 text-sm">Cargando…</div>
      ) : variants.length === 0 ? (
        <EmptyState
          icon="tune"
          title="Sin variantes"
          description="Crea la primera variante asignando una talla y sus costos/precios."
          action={
            <Button testId="empty-new-variant-btn" icon="add" onClick={() => onOpen()}>
              Crear variante
            </Button>
          }
        />
      ) : (
        <div
          data-testid="variants-table"
          className="rounded-2xl border border-[#3a2730] overflow-x-auto bg-[#181014]"
        >
          <table className="w-full min-w-[1100px]">
            <thead>
              <tr className="text-left text-[11px] font-bold uppercase tracking-widest text-white/40 border-b border-[#3a2730]">
                <th className="px-5 py-4">Talla</th>
                <th className="px-5 py-4 text-right">Costo Prod.</th>
                <th className="px-5 py-4 text-right">Costo Fabr.</th>
                <th className="px-5 py-4 text-right">P. Mayorista</th>
                <th className="px-5 py-4 text-right">P. Detal</th>
                <th className="px-5 py-4 text-right">Ut. Mayor.</th>
                <th className="px-5 py-4 text-right">Ut. Detal</th>
                <th className="px-5 py-4">Estado</th>
                <th className="px-5 py-4 w-60 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {variants.map((v) => (
                <tr
                  key={v.id}
                  data-testid={`variant-row-${v.id}`}
                  className="border-b border-[#3a2730] last:border-0 hover:bg-white/[0.02]"
                >
                  <td className="px-5 py-4">
                    <span className="px-3 py-1 rounded-full bg-[#ff1a88]/10 border border-[#ff1a88]/30 text-[#ff1a88] text-xs font-bold">
                      {v.sizes?.code ?? `#${v.size_id}`}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right text-sm text-white/80">
                    {fmt.format(Number(v.production_cost))}
                  </td>
                  <td className="px-5 py-4 text-right text-sm text-white/80">
                    {fmt.format(Number(v.manufacturing_cost))}
                  </td>
                  <td className="px-5 py-4 text-right text-sm font-bold">
                    {fmt.format(Number(v.wholesale_price))}
                  </td>
                  <td className="px-5 py-4 text-right text-sm font-bold">
                    {fmt.format(Number(v.retail_price))}
                  </td>
                  <td className="px-5 py-4 text-right text-sm">
                    <span
                      className={
                        Number(v.wholesale_profit) >= 0
                          ? 'text-emerald-400 font-bold'
                          : 'text-red-400 font-bold'
                      }
                    >
                      {fmt.format(Number(v.wholesale_profit))}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right text-sm">
                    <span
                      className={
                        Number(v.retail_profit) >= 0
                          ? 'text-emerald-400 font-bold'
                          : 'text-red-400 font-bold'
                      }
                    >
                      {fmt.format(Number(v.retail_profit))}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      data-testid={`toggle-variant-${v.id}`}
                      onClick={() => onToggleActive(v)}
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        v.active
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-white/5 text-white/40 border border-white/10'
                      }`}
                    >
                      {v.active ? 'Activa' : 'Inactiva'}
                    </button>
                  </td>
                  <td className="px-5 py-4 text-right space-x-1.5">
                    <Button
                      testId={`history-variant-${v.id}`}
                      size="sm"
                      variant="subtle"
                      icon="history"
                      onClick={() => openHistory(v)}
                    >
                      
                    </Button>
                    <Button
                      testId={`edit-variant-${v.id}`}
                      size="sm"
                      variant="subtle"
                      icon="edit"
                      onClick={() => onOpen(v)}
                    >
                      
                    </Button>
                    <Button
                      testId={`delete-variant-${v.id}`}
                      size="sm"
                      variant="danger"
                      icon="delete"
                      onClick={() => onDelete(v)}
                    >
                      
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* CRUD modal */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        size="lg"
        title={editing ? `Editar variante ${editing.sizes?.code ?? ''}` : 'Nueva variante'}
        footer={
          <>
            <Button variant="ghost" testId="cancel-variant-btn" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button
              testId="save-variant-btn"
              loading={saving}
              onClick={() => {
                const f = document.getElementById('variant-form') as HTMLFormElement
                f?.requestSubmit()
              }}
            >
              {editing ? 'Guardar' : 'Crear'}
            </Button>
          </>
        }
      >
        <form id="variant-form" onSubmit={onSubmit} className="space-y-5">
          <Field label="Talla" hint="Cada talla solo puede aparecer una vez por producto.">
            <Select
              data-testid="variant-size-input"
              required
              value={form.size_id}
              onChange={(e) => setForm({ ...form, size_id: e.target.value })}
            >
              <option value="">Selecciona…</option>
              {(editing ? sizes : availableSizes).map((s) => (
                <option key={s.id} value={s.id}>
                  {s.code} {s.description ? `· ${s.description}` : ''}
                </option>
              ))}
            </Select>
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Costo de producción">
              <NumberInput
                data-testid="variant-production-cost-input"
                min={0}
                required
                value={form.production_cost}
                onChange={(e) => setForm({ ...form, production_cost: e.target.value })}
              />
            </Field>
            <Field label="Costo de fabricación">
              <NumberInput
                data-testid="variant-manufacturing-cost-input"
                min={0}
                required
                value={form.manufacturing_cost}
                onChange={(e) => setForm({ ...form, manufacturing_cost: e.target.value })}
              />
            </Field>
            <Field label="Precio mayorista">
              <NumberInput
                data-testid="variant-wholesale-price-input"
                min={0}
                required
                value={form.wholesale_price}
                onChange={(e) => setForm({ ...form, wholesale_price: e.target.value })}
              />
            </Field>
            <Field label="Precio detal (retail)">
              <NumberInput
                data-testid="variant-retail-price-input"
                min={0}
                required
                value={form.retail_price}
                onChange={(e) => setForm({ ...form, retail_price: e.target.value })}
              />
            </Field>
          </div>

          {/* Live profit preview */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-black/40 border border-[#3a2730]">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">
                Utilidad mayorista
              </p>
              <p
                data-testid="variant-preview-wholesale-profit"
                className={`text-lg font-bold ${
                  liveWholesaleProfit >= 0 ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {fmt.format(liveWholesaleProfit)}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">
                Utilidad detal
              </p>
              <p
                data-testid="variant-preview-retail-profit"
                className={`text-lg font-bold ${
                  liveRetailProfit >= 0 ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {fmt.format(liveRetailProfit)}
              </p>
            </div>
            <p className="col-span-2 text-[10px] text-white/40 mt-1">
              Calculadas por PostgreSQL como columnas generadas (precio − costo de producción).
            </p>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              data-testid="variant-active-input"
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
              className="size-5 rounded border-[#3a2730] bg-black/40 accent-[#ff1a88]"
            />
            <span className="text-sm">Variante activa</span>
          </label>
        </form>
      </Modal>

      {/* Per-variant history modal */}
      <Modal
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        title={`Historial · talla ${historyVariant?.sizes?.code ?? ''}`}
        size="lg"
      >
        {history.length === 0 ? (
          <p className="text-sm text-white/50">
            Esta variante no tiene cambios de precio registrados todavía.
          </p>
        ) : (
          <div className="space-y-3">
            {history.map((h) => (
              <div
                key={h.id}
                data-testid={`history-row-${h.id}`}
                className="rounded-lg border border-[#3a2730] bg-black/30 p-4"
              >
                <p className="text-xs uppercase tracking-widest text-white/40 mb-2">
                  {new Date(h.changed_at).toLocaleString('es-CO')}
                </p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-white/40 text-xs">Mayorista: </span>
                    <span className="line-through text-white/40">
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
                  </div>
                  <div>
                    <span className="text-white/40 text-xs">Detal: </span>
                    <span className="line-through text-white/40">
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
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  )
}
