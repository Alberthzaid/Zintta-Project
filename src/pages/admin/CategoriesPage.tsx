import { FormEvent, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { CategoriesAPI } from '../../lib/api'
import type { Category } from '../../lib/database.types'
import Button from '../../components/admin/Button'
import Modal from '../../components/admin/Modal'
import { Field, TextInput } from '../../components/admin/FormControls'
import EmptyState from '../../components/admin/EmptyState'

export default function CategoriesPage() {
  const [items, setItems] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      setItems(await CategoriesAPI.list())
    } catch (e) {
      toast.error((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const onOpen = (c?: Category) => {
    setEditing(c ?? null)
    setName(c?.name ?? '')
    setOpen(true)
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editing) {
        await CategoriesAPI.update(editing.id, name.trim().toUpperCase())
        toast.success('Categoría actualizada')
      } else {
        await CategoriesAPI.create(name.trim().toUpperCase())
        toast.success('Categoría creada')
      }
      setOpen(false)
      fetchData()
    } catch (e) {
      toast.error((e as Error).message)
    } finally {
      setSaving(false)
    }
  }

  const onDelete = async (c: Category) => {
    if (!confirm(`¿Eliminar la categoría "${c.name}"?\n\nNo se podrá si tiene productos asociados.`)) return
    try {
      await CategoriesAPI.remove(c.id)
      toast.success('Categoría eliminada')
      fetchData()
    } catch (e) {
      toast.error((e as Error).message)
    }
  }

  return (
    <div className="space-y-8">
      <header className="flex items-end justify-between gap-6">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#ff1a88] mb-2">
            Catálogo
          </p>
          <h1 className="text-4xl font-bold tracking-tight">Categorías</h1>
          <p className="text-white/50 mt-2">
            Define los grupos de prendas: polos, buzos, camisetas, etc.
          </p>
        </div>
        <Button testId="new-category-btn" icon="add" onClick={() => onOpen()}>
          Nueva categoría
        </Button>
      </header>

      {loading ? (
        <div className="text-white/50 text-sm">Cargando…</div>
      ) : items.length === 0 ? (
        <EmptyState
          icon="category"
          title="Sin categorías todavía"
          description="Crea tu primera categoría para empezar a organizar el catálogo."
          action={
            <Button testId="empty-new-category-btn" icon="add" onClick={() => onOpen()}>
              Crear categoría
            </Button>
          }
        />
      ) : (
        <div
          data-testid="categories-table"
          className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl overflow-hidden shadow-2xl shadow-black/40"
        >
          <table className="w-full">
            <thead>
              <tr className="text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40 bg-black/40 border-b border-white/10">
                <th className="px-6 py-4 w-20">ID</th>
                <th className="px-6 py-4">Nombre</th>
                <th className="px-6 py-4">Creada</th>
                <th className="px-6 py-4 w-32 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {items.map((c) => (
                <tr
                  key={c.id}
                  data-testid={`category-row-${c.id}`}
                  className="hover:bg-white/[0.03] transition-colors"
                >
                  <td className="px-6 py-4 text-white/40 font-mono text-xs">
                    #{c.id}
                  </td>
                  <td className="px-6 py-4 font-semibold text-white">{c.name}</td>
                  <td className="px-6 py-4 text-white/50 text-sm">
                    {new Date(c.created_at).toLocaleDateString('es-CO')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        data-testid={`edit-category-${c.id}`}
                        onClick={() => onOpen(c)}
                        title="Editar categoría"
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
                        data-testid={`delete-category-${c.id}`}
                        onClick={() => onDelete(c)}
                        title="Eliminar categoría"
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
        title={editing ? 'Editar categoría' : 'Nueva categoría'}
        footer={
          <>
            <Button variant="ghost" testId="cancel-category-btn" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button
              testId="save-category-btn"
              loading={saving}
              type="submit"
              onClick={() => {
                const form = document.getElementById('category-form') as HTMLFormElement
                form?.requestSubmit()
              }}
            >
              {editing ? 'Guardar' : 'Crear'}
            </Button>
          </>
        }
      >
        <form id="category-form" onSubmit={onSubmit} className="space-y-5">
          <Field
            label="Nombre"
            hint="Se guarda en mayúsculas, máx. 100 caracteres, único."
          >
            <TextInput
              data-testid="category-name-input"
              required
              maxLength={100}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="POLOS"
            />
          </Field>
        </form>
      </Modal>
    </div>
  )
}
