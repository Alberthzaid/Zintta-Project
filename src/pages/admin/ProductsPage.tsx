import { FormEvent, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  CategoriesAPI,
  ProductsAPI,
  type ProductWithCategory,
} from '../../lib/api'
import type { Category } from '../../lib/database.types'
import Button from '../../components/admin/Button'
import Modal from '../../components/admin/Modal'
import { Field, Select, TextArea, TextInput } from '../../components/admin/FormControls'
import EmptyState from '../../components/admin/EmptyState'
import ImageDropZone from '../../components/admin/ImageDropZone'

export default function ProductsPage() {
  const [items, setItems] = useState<ProductWithCategory[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [search, setSearch] = useState('')

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<ProductWithCategory | null>(null)
  const [form, setForm] = useState({
    category_id: '',
    name: '',
    description: '',
    image_url: '',
    badge: '',
    active: true,
  })
  const [saving, setSaving] = useState(false)

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [products, cats] = await Promise.all([
        ProductsAPI.list(),
        CategoriesAPI.list(),
      ])
      setItems(products)
      setCategories(cats)
    } catch (e) {
      toast.error((e as Error).message)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchAll()
  }, [])

  const filtered = useMemo(() => {
    return items.filter((p) => {
      if (filterCategory !== 'all' && String(p.category_id) !== filterCategory) return false
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [items, filterCategory, search])

  const onOpen = (p?: ProductWithCategory) => {
    setEditing(p ?? null)
    setForm({
      category_id: p ? String(p.category_id) : categories[0] ? String(categories[0].id) : '',
      name: p?.name ?? '',
      description: p?.description ?? '',
      image_url: p?.image_url ?? '',
      badge: p?.badge ?? '',
      active: p?.active ?? true,
    })
    setOpen(true)
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!form.category_id) {
      toast.error('Selecciona una categoría')
      return
    }
    setSaving(true)
    try {
      const payload = {
        category_id: Number(form.category_id),
        name: form.name.trim(),
        description: form.description.trim() || null,
        image_url: form.image_url.trim() || null,
        badge: form.badge.trim() || null,
        active: form.active,
      }
      if (editing) {
        await ProductsAPI.update(editing.id, payload)
        toast.success('Producto actualizado')
      } else {
        await ProductsAPI.create(payload)
        toast.success('Producto creado')
      }
      setOpen(false)
      fetchAll()
    } catch (e) {
      toast.error((e as Error).message)
    } finally {
      setSaving(false)
    }
  }

  const onDelete = async (p: ProductWithCategory) => {
    if (!confirm(`¿Eliminar "${p.name}"?\nSe eliminarán también todas sus variantes.`)) return
    try {
      await ProductsAPI.remove(p.id)
      toast.success('Producto eliminado')
      fetchAll()
    } catch (e) {
      toast.error((e as Error).message)
    }
  }

  const onToggleActive = async (p: ProductWithCategory) => {
    try {
      await ProductsAPI.toggleActive(p.id, !p.active)
      toast.success(p.active ? 'Producto desactivado' : 'Producto activado')
      fetchAll()
    } catch (e) {
      toast.error((e as Error).message)
    }
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#ff1a88] mb-2">
            Catálogo
          </p>
          <h1 className="text-4xl font-bold tracking-tight">Productos</h1>
          <p className="text-white/50 mt-2">
            Cada producto puede tener varias variantes por talla con sus propios costos y precios.
          </p>
        </div>
        <Button
          testId="new-product-btn"
          icon="add"
          onClick={() => onOpen()}
          disabled={categories.length === 0}
        >
          Nuevo producto
        </Button>
      </header>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <span
            className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/40"
            style={{ fontSize: '18px' }}
          >
            search
          </span>
          <input
            data-testid="product-search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre…"
            className="w-full bg-black/40 border border-[#3a2730] rounded-lg pl-12 pr-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#ff1a88]"
          />
        </div>
        <select
          data-testid="product-category-filter"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="bg-black/40 border border-[#3a2730] rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#ff1a88] min-w-[200px] cursor-pointer"
        >
          <option value="all">Todas las categorías</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-white/50 text-sm">Cargando…</div>
      ) : categories.length === 0 ? (
        <EmptyState
          icon="category"
          title="Primero crea una categoría"
          description="Cada producto debe pertenecer a una categoría. Crea al menos una para empezar."
          action={
            <Link to="/dashboard-admin/categorias">
              <Button icon="arrow_forward" testId="goto-categories-btn">
                Ir a categorías
              </Button>
            </Link>
          }
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="checkroom"
          title={search ? 'Sin resultados' : 'Sin productos todavía'}
          description={
            search
              ? 'Cambia el filtro o el término de búsqueda.'
              : 'Crea tu primer producto para empezar a operar el catálogo.'
          }
        />
      ) : (
        <div
          data-testid="products-table"
          className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl overflow-hidden shadow-2xl shadow-black/40"
        >
          <table className="w-full">
            <thead>
              <tr className="text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40 bg-black/40 border-b border-white/10">
                <th className="px-6 py-4 w-20">ID</th>
                <th className="px-6 py-4 w-20">Imagen</th>
                <th className="px-6 py-4">Producto</th>
                <th className="px-6 py-4">Categoría</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 w-44 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((p) => (
                <tr
                  key={p.id}
                  data-testid={`product-row-${p.id}`}
                  className="hover:bg-white/[0.03] transition-colors"
                >
                  <td className="px-6 py-4 text-white/40 font-mono text-xs">
                    #{p.id}
                  </td>
                  <td className="px-6 py-4">
                    <div
                      data-testid={`product-thumb-${p.id}`}
                      className="size-12 rounded-lg overflow-hidden bg-white/[0.04] border border-white/10 flex items-center justify-center"
                    >
                      {p.image_url ? (
                        <img
                          src={p.image_url}
                          alt={p.name}
                          loading="lazy"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            ;(e.currentTarget as HTMLImageElement).style.display = 'none'
                          }}
                        />
                      ) : (
                        <span
                          className="material-symbols-outlined text-white/20"
                          style={{ fontSize: '20px' }}
                        >
                          image
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-white">{p.name}</p>
                      {p.badge && (
                        <span
                          data-testid={`product-badge-${p.id}`}
                          className="px-2 py-0.5 rounded-full bg-[#ff1a88]/15 border border-[#ff1a88]/30 text-[#ff1a88] text-[10px] font-bold uppercase tracking-widest"
                        >
                          {p.badge}
                        </span>
                      )}
                    </div>
                    {p.description && (
                      <p className="text-xs text-white/40 line-clamp-1">
                        {p.description}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-medium text-white/80">
                      {p.categories?.name ?? '—'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      data-testid={`toggle-product-${p.id}`}
                      onClick={() => onToggleActive(p)}
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                        p.active
                          ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 hover:bg-emerald-500/15'
                          : 'bg-white/[0.04] text-white/40 border border-white/10 hover:bg-white/[0.08]'
                      }`}
                    >
                      <span
                        className={`size-1.5 rounded-full ${
                          p.active ? 'bg-emerald-400' : 'bg-white/30'
                        }`}
                      />
                      {p.active ? 'Activo' : 'Inactivo'}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        to={`/dashboard-admin/productos/${p.id}/variantes`}
                        title="Ver variantes"
                      >
                        <button
                          data-testid={`variants-product-${p.id}`}
                          className="size-9 rounded-lg bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] hover:border-white/20 transition-all flex items-center justify-center text-white/70 hover:text-white"
                        >
                          <span
                            className="material-symbols-outlined"
                            style={{ fontSize: '18px' }}
                          >
                            tune
                          </span>
                        </button>
                      </Link>
                      <button
                        data-testid={`edit-product-${p.id}`}
                        onClick={() => onOpen(p)}
                        title="Editar producto"
                        className="size-9 rounded-lg bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] hover:border-white/20 transition-all flex items-center justify-center text-white/70 hover:text-white"
                      >
                        <span
                          className="material-symbols-outlined"
                          style={{ fontSize: '18px' }}
                        >
                          edit
                        </span>
                      </button>
                      <button
                        data-testid={`delete-product-${p.id}`}
                        onClick={() => onDelete(p)}
                        title="Eliminar producto"
                        className="size-9 rounded-lg bg-white/[0.03] border border-white/10 hover:bg-red-500/10 hover:border-red-500/30 transition-all flex items-center justify-center text-white/60 hover:text-red-300"
                      >
                        <span
                          className="material-symbols-outlined"
                          style={{ fontSize: '18px' }}
                        >
                          delete
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? 'Editar producto' : 'Nuevo producto'}
        size="lg"
        footer={
          <>
            <Button variant="ghost" testId="cancel-product-btn" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button
              testId="save-product-btn"
              loading={saving}
              onClick={() => {
                const f = document.getElementById('product-form') as HTMLFormElement
                f?.requestSubmit()
              }}
            >
              {editing ? 'Guardar' : 'Crear'}
            </Button>
          </>
        }
      >
        <form id="product-form" onSubmit={onSubmit} className="space-y-5">
          <Field label="Categoría">
            <Select
              data-testid="product-category-input"
              required
              value={form.category_id}
              onChange={(e) => setForm({ ...form, category_id: e.target.value })}
            >
              <option value="">Selecciona…</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Nombre" hint="Único, máx. 200 caracteres.">
            <TextInput
              data-testid="product-name-input"
              required
              maxLength={200}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="POLO HOMBRE BASICO"
            />
          </Field>
          <Field label="Descripción">
            <TextArea
              data-testid="product-description-input"
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Polo básico para hombre"
            />
          </Field>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field
              label="URL de imagen"
              hint="Arrastra o elige archivo para subirlo a Storage (bucket assets, carpeta products). También puedes pegar un link externo."
            >
              <div className="space-y-3">
                <ImageDropZone
                  testId="product-image-dropzone"
                  disabled={saving}
                  onUploaded={(url) => setForm((f) => ({ ...f, image_url: url }))}
                />
                <TextInput
                  data-testid="product-image-input"
                  type="url"
                  value={form.image_url}
                  onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                  placeholder="https://…"
                />
              </div>
            </Field>
            <Field label="Badge" hint="Etiqueta opcional en la card (Bestseller, Premium…).">
              <TextInput
                data-testid="product-badge-input"
                maxLength={50}
                value={form.badge}
                onChange={(e) => setForm({ ...form, badge: e.target.value })}
                placeholder="Bestseller"
              />
            </Field>
          </div>

          {/* Live preview of the card */}
          <div className="rounded-xl border border-[#3a2730] bg-black/40 p-4">
            <p className="text-[10px] uppercase tracking-widest text-white/40 mb-3">
              Vista previa
            </p>
            <div className="flex items-center gap-4">
              <div
                data-testid="product-image-preview"
                className="size-24 rounded-lg overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center shrink-0"
              >
                {form.image_url ? (
                  <img
                    src={form.image_url}
                    alt={form.name || 'Preview'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const el = e.currentTarget as HTMLImageElement
                      el.style.display = 'none'
                      el.parentElement?.classList.add('preview-broken')
                    }}
                    onLoad={(e) => {
                      const el = e.currentTarget as HTMLImageElement
                      el.style.display = 'block'
                      el.parentElement?.classList.remove('preview-broken')
                    }}
                  />
                ) : (
                  <span
                    className="material-symbols-outlined text-white/20"
                    style={{ fontSize: '32px' }}
                  >
                    image
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-bold truncate">{form.name || 'Nombre del producto'}</p>
                  {form.badge && (
                    <span className="px-2 py-0.5 rounded-full bg-[#ff1a88]/15 border border-[#ff1a88]/30 text-[#ff1a88] text-[10px] font-bold uppercase tracking-widest">
                      {form.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-white/50 line-clamp-2">
                  {form.description || 'La descripción aparecerá aquí.'}
                </p>
              </div>
            </div>
          </div>
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              data-testid="product-active-input"
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
              className="size-5 rounded border-[#3a2730] bg-black/40 accent-[#ff1a88]"
            />
            <span className="text-sm">Producto activo (visible en catálogo)</span>
          </label>
        </form>
      </Modal>
    </div>
  )
}
