import { useCallback, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { uploadProductImage, validateProductImageFile } from '../../lib/productImages'

type Props = {
  onUploaded: (publicUrl: string) => void
  disabled?: boolean
  testId?: string
}

export default function ImageDropZone({ onUploaded, disabled, testId }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const dragDepth = useRef(0)
  const [dragOver, setDragOver] = useState(false)
  const [uploading, setUploading] = useState(false)

  const processFile = useCallback(
    async (file: File | undefined) => {
      if (!file || disabled) return
      const v = validateProductImageFile(file)
      if (v) {
        toast.error(v)
        return
      }
      setUploading(true)
      try {
        const url = await uploadProductImage(file)
        onUploaded(url)
        toast.success('Imagen subida')
      } catch (e) {
        toast.error((e as Error).message)
      } finally {
        setUploading(false)
      }
    },
    [disabled, onUploaded]
  )

  const onDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragDepth.current += 1
    if (e.dataTransfer.types.includes('Files')) setDragOver(true)
  }

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragDepth.current -= 1
    if (dragDepth.current <= 0) {
      dragDepth.current = 0
      setDragOver(false)
    }
  }

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    e.dataTransfer.dropEffect = 'copy'
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragDepth.current = 0
    setDragOver(false)
    if (disabled || uploading) return
    const file = e.dataTransfer.files?.[0]
    void processFile(file)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    void processFile(file)
  }

  const openPicker = () => {
    if (!uploading && !disabled) inputRef.current?.click()
  }

  return (
    <div
      data-testid={testId}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={handleDrop}
      className={`
        relative rounded-lg border-2 border-dashed px-4 py-8 text-center transition-colors
        ${dragOver ? 'border-[#ff1a88] bg-[#ff1a88]/10' : 'border-[#3a2730] bg-black/20'}
        ${disabled || uploading ? 'opacity-50 pointer-events-none' : 'cursor-pointer hover:border-white/20'}
      `}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          openPicker()
        }
      }}
      onClick={openPicker}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0"
        style={{ clip: 'rect(0,0,0,0)' }}
        disabled={disabled || uploading}
        onChange={handleInputChange}
        onClick={(e) => e.stopPropagation()}
      />
      {uploading ? (
        <p className="text-sm text-white/70">Subiendo imagen…</p>
      ) : (
        <>
          <span
            className="material-symbols-outlined text-[#ff1a88] mb-2 inline-block"
            style={{ fontSize: '36px' }}
          >
            cloud_upload
          </span>
          <p className="text-sm text-white font-medium">
            Arrastra una imagen aquí o haz clic para elegir
          </p>
          <p className="text-xs text-white/40 mt-1">
            JPG, PNG, WebP o GIF · máx. 5 MB · se guarda en <code className="text-white/50">assets</code> /{' '}
            <code className="text-white/50">products/</code>
          </p>
        </>
      )}
    </div>
  )
}
