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
          className="rounded-2xl border border-[#3a2730] overflow-hidden bg-[#181014]"
        >
          <table className="w-full">
            <thead>
              <tr className="text-left text-[11px] font-bold uppercase tracking-widest text-white/40 border-b border-[#3a2730]">
                <th className="px-6 py-4 w-20">ID</th>
                <th className="px-6 py-4">Producto</th>
                <th className="px-6 py-4">Categoría</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 w-72 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr
                  key={p.id}
                  data-testid={`product-row-${p.id}`}
                  className="border-b border-[#3a2730] last:border-0 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-6 py-4 text-white/40 font-mono text-sm">#{p.id}</td>
                  <td className="px-6 py-4">
                    <p className="font-bold">{p.name}</p>
                    {p.description && (
                      <p className="text-xs text-white/40 mt-1 line-clamp-1">
                        {p.description}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold">
                      {p.categories?.name ?? '—'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      data-testid={`toggle-product-${p.id}`}
                      onClick={() => onToggleActive(p)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                        p.active
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                          : 'bg-white/5 text-white/40 border border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {p.active ? 'Activo' : 'Inactivo'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Link to={`/dashboard-admin/productos/${p.id}/variantes`}>
                      <Button
                        testId={`variants-product-${p.id}`}
                        size="sm"
                        variant="subtle"
                        icon="tune"
                      >
                        Variantes
                      </Button>
                    </Link>
                    <Button
                      testId={`edit-product-${p.id}`}
                      size="sm"
                      variant="subtle"
                      icon="edit"
                      onClick={() => onOpen(p)}
                    >
                      
                    </Button>
                    <Button
                      testId={`delete-product-${p.id}`}
                      size="sm"
                      variant="danger"
                      icon="delete"
                      onClick={() => onDelete(p)}
                    >
                      
                    </Button>
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
