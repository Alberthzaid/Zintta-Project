import { FormEvent, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { SizesAPI } from '../../lib/api'
import type { Size } from '../../lib/database.types'
import Button from '../../components/admin/Button'
import Modal from '../../components/admin/Modal'
import { Field, TextInput } from '../../components/admin/FormControls'
import EmptyState from '../../components/admin/EmptyState'

export default function SizesPage() {
  const [items, setItems] = useState<Size[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Size | null>(null)
  const [code, setCode] = useState('')
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      setItems(await SizesAPI.list())
    } catch (e) {
      toast.error((e as Error).message)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchData()
  }, [])

  const onOpen = (s?: Size) => {
    setEditing(s ?? null)
    setCode(s?.code ?? '')
    setDescription(s?.description ?? '')
    setOpen(true)
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editing) {
        await SizesAPI.update(editing.id, {
          code: code.trim(),
          description: description.trim() || null,
        })
        toast.success('Talla actualizada')
      } else {
        await SizesAPI.create(code.trim(), description.trim() || null)
        toast.success('Talla creada')
      }
      setOpen(false)
      fetchData()
    } catch (e) {
      toast.error((e as Error).message)
    } finally {
      setSaving(false)
    }
  }

  const onDelete = async (s: Size) => {
    if (!confirm(`¿Eliminar la talla "${s.code}"?`)) return
    try {
      await SizesAPI.remove(s.id)
      toast.success('Talla eliminada')
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
          <h1 className="text-4xl font-bold tracking-tight">Tallas</h1>
          <p className="text-white/50 mt-2">
            Maestro único de tallas disponibles para las variantes.
          </p>
        </div>
        <Button testId="new-size-btn" icon="add" onClick={() => onOpen()}>
          Nueva talla
        </Button>
      </header>

      {loading ? (
        <div className="text-white/50 text-sm">Cargando…</div>
      ) : items.length === 0 ? (
        <EmptyState
          icon="straighten"
          title="Sin tallas registradas"
          description="Define las tallas que se podrán asociar a las variantes de cada producto."
        />
      ) : (
        <div
          data-testid="sizes-grid"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {items.map((s) => (
            <div
              key={s.id}
              data-testid={`size-card-${s.id}`}
              className="group bg-white/[0.02] border border-white/10 rounded-2xl p-5 flex flex-col gap-4 backdrop-blur-xl shadow-xl shadow-black/30 hover:bg-white/[0.04] hover:border-white/20 transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40 mb-1">
                    Código
                  </p>
                  <p className="text-2xl font-bold tracking-tight text-white">
                    {s.code}
                  </p>
                </div>
                <span className="text-[10px] text-white/30 font-mono px-2 py-0.5 rounded-md bg-black/40 border border-white/5">
                  #{s.id}
                </span>
              </div>
              <p className="text-sm text-white/60 min-h-[1.25rem]">
                {s.description ?? '—'}
              </p>
              <div className="flex items-center justify-end gap-1.5 pt-3 border-t border-white/5">
                <button
                  data-testid={`edit-size-${s.id}`}
                  onClick={() => onOpen(s)}
                  title="Editar talla"
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
                  data-testid={`delete-size-${s.id}`}
                  onClick={() => onDelete(s)}
                  title="Eliminar talla"
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
            </div>
          ))}
        </div>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? 'Editar talla' : 'Nueva talla'}
        footer={
          <>
            <Button variant="ghost" testId="cancel-size-btn" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button
              testId="save-size-btn"
              loading={saving}
              onClick={() => {
                const form = document.getElementById('size-form') as HTMLFormElement
                form?.requestSubmit()
              }}
            >
              {editing ? 'Guardar' : 'Crear'}
            </Button>
          </>
        }
      >
        <form id="size-form" onSubmit={onSubmit} className="space-y-5">
          <Field label="Código" hint="Ej: S-M, L-XL, 2XL, 10-12 — único, máx. 50.">
            <TextInput
              data-testid="size-code-input"
              required
              maxLength={50}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="S-M"
            />
          </Field>
          <Field label="Descripción" hint="Opcional, máx. 100 caracteres.">
            <TextInput
              data-testid="size-description-input"
              maxLength={100}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Talla Small-Medium"
            />
          </Field>
        </form>
      </Modal>
    </div>
  )
}
