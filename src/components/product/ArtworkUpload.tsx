import { useRef, useState } from 'react'

interface Props {
  onDesignUpload: (dataUrl: string) => void
  uploadedDesign: string | null
}

export default function ArtworkUpload({ onDesignUpload, uploadedDesign }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') return
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result
      if (typeof result === 'string') onDesignUpload(result)
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-bold uppercase tracking-widest">4. Subir Diseño</h4>

      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all group ${
          isDragging
            ? 'border-[#ff1a88] bg-[#ff1a88]/5'
            : uploadedDesign
            ? 'border-[#ff1a88]/50 bg-[#ff1a88]/5'
            : 'border-[#3a2730] hover:border-[#ff1a88]/50'
        }`}
      >
        {uploadedDesign ? (
          <>
            <div className="size-16 rounded-lg overflow-hidden mb-4 border border-white/10">
              <img src={uploadedDesign} alt="Uploaded design" className="w-full h-full object-contain" />
            </div>
            <p className="text-sm font-medium text-white">Diseño cargado</p>
            <p className="text-xs text-white/40 mt-1">Haz clic para cambiar</p>
          </>
        ) : (
          <>
            <div className="size-12 rounded-full bg-[#3a2730] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[#ff1a88]" style={{ fontSize: '24px' }}>
                cloud_upload
              </span>
            </div>
            <p className="text-sm font-medium mb-1 text-white">Arrastra tu diseño aquí</p>
            <p className="text-xs text-white/50">SVG, PNG, AI o PDF (Máx. 20MB)</p>
          </>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*,application/pdf"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  )
}
