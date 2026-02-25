import { PrintLocation, ProductSize } from '../../types'
import ArtworkUpload from './ArtworkUpload'

interface Props {
  selectedColor: string
  onColorChange: (color: string) => void
  selectedSize: ProductSize
  onSizeChange: (size: ProductSize) => void
  printLocation: PrintLocation
  onLocationChange: (loc: PrintLocation) => void
  uploadedDesign: string | null
  onDesignUpload: (dataUrl: string) => void
  onQuote: () => void
}

const COLORS: { label: string; value: string; bg: string }[] = [
  { label: 'Pure White', value: 'white', bg: '#ffffff' },
  { label: 'Midnight Black', value: 'black', bg: '#0f172a' },
  { label: 'Navy Blue', value: 'navy', bg: '#1e3a8a' },
  { label: 'Rose Red', value: 'rose', bg: '#e11d48' },
  { label: 'Emerald', value: 'emerald', bg: '#059669' },
]

const SIZES: ProductSize[] = ['S', 'M', 'L', 'XL', '2XL']

const LOCATIONS: { value: PrintLocation; icon: string; label: string }[] = [
  { value: 'FRONT', icon: 'top_panel_open', label: 'FRONT' },
  { value: 'BACK', icon: 'bottom_panel_open', label: 'BACK' },
  { value: 'SLEEVE', icon: 'align_horizontal_left', label: 'SLEEVE' },
]

export default function ConfigPanel({
  selectedColor,
  onColorChange,
  selectedSize,
  onSizeChange,
  printLocation,
  onLocationChange,
  uploadedDesign,
  onDesignUpload,
  onQuote,
}: Props) {
  const selectedColorLabel = COLORS.find((c) => c.value === selectedColor)?.label ?? 'Pure White'

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-black leading-tight tracking-tight mb-2">Classic T-Shirt</h1>
        <p className="text-lg opacity-60">Premium High-End Cotton Base</p>
      </div>

      {/* Step 1: Color */}
      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <h4 className="text-sm font-bold uppercase tracking-widest">1. Seleccionar Color</h4>
          <span className="text-xs opacity-60 font-medium">{selectedColorLabel}</span>
        </div>
        <div className="flex flex-wrap gap-3">
          {COLORS.map((color) => (
            <button
              key={color.value}
              title={color.label}
              onClick={() => onColorChange(color.value)}
              className={`size-10 rounded-full p-0.5 transition-transform hover:scale-110 ${
                selectedColor === color.value
                  ? 'border-2 border-[#ff1a88]'
                  : 'border-2 border-transparent'
              }`}
            >
              <span
                className="block w-full h-full rounded-full shadow-inner"
                style={{ backgroundColor: color.bg }}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Step 2: Size */}
      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <h4 className="text-sm font-bold uppercase tracking-widest">2. Talla</h4>
          <a href="#" className="text-xs text-[#ff1a88] underline underline-offset-4">Guía de Tallas</a>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {SIZES.map((size) => (
            <button
              key={size}
              onClick={() => onSizeChange(size)}
              className={`py-3 rounded-lg text-sm font-bold transition-all ${
                selectedSize === size
                  ? 'border-2 border-[#ff1a88] text-[#ff1a88] bg-[#ff1a88]/5'
                  : 'border border-[#3a2730] hover:border-[#ff1a88]'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Step 3: Print Location */}
      <div className="space-y-4">
        <h4 className="text-sm font-bold uppercase tracking-widest">3. Ubicación de Impresión</h4>
        <div className="grid grid-cols-3 gap-3">
          {LOCATIONS.map((loc) => (
            <button
              key={loc.value}
              onClick={() => onLocationChange(loc.value)}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all ${
                printLocation === loc.value
                  ? 'border-2 border-[#ff1a88] bg-[#ff1a88]/5'
                  : 'border border-[#3a2730] opacity-60 hover:opacity-100'
              }`}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>{loc.icon}</span>
              <span className="text-[11px] font-bold">{loc.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Step 4: Upload */}
      <ArtworkUpload onDesignUpload={onDesignUpload} uploadedDesign={uploadedDesign} />

      {/* Summary + CTA */}
      <div className="glass-panel-warm p-6 rounded-2xl shadow-2xl space-y-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold text-lg">Resumen del Pedido</h3>
          <span className="bg-[#ff1a88]/20 text-[#ff1a88] text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
            Estimado
          </span>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between opacity-80">
            <span>Item: Classic T-Shirt ({selectedColorLabel})</span>
            <span>Talla: {selectedSize}</span>
          </div>
          <div className="flex justify-between opacity-80">
            <span>Impresión: {printLocation} (A4)</span>
            <span>Cant: 1</span>
          </div>
        </div>
        <div className="h-px bg-white/10 my-4" />
        <button
          onClick={onQuote}
          className="w-full bg-[#ff1a88] hover:bg-[#ff1a88]/90 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg"
          style={{ boxShadow: '0 8px 30px rgba(255,26,136,0.3)' }}
        >
          <svg className="size-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.18-2.587-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.747-2.874-2.512-2.96-2.626-.087-.115-.708-.941-.708-1.793 0-.852.448-1.271.607-1.446.159-.175.348-.22.463-.22s.231.001.332.005c.109.004.258-.041.405.314.159.386.542 1.32.588 1.412.048.092.08.2.02.321-.061.12-.091.196-.181.301-.09.104-.19.233-.271.312-.089.088-.182.184-.078.362.104.178.463.763.993 1.235.684.609 1.258.799 1.437.887.178.088.283.073.389-.046.107-.12.457-.532.58-.714.123-.182.246-.153.414-.092.167.061 1.062.502 1.246.594.183.091.307.137.352.213.045.076.045.441-.099.846z" />
            <path d="M5.421 13.575l.361.214a9.87 9.87 0 005.031 1.378h.004c5.448 0 9.885-4.434 9.885-9.884a9.825 9.825 0 00-2.893-6.994 9.821 9.821 0 00-6.992-2.898c-5.452 0-9.888 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l.235.374-.998 3.648 3.746-.982zM1.587 23.943l1.945-7.098A11.836 11.836 0 01.157 11.891C.16 5.335 5.495 0 12.05 0a11.815 11.815 0 018.413 3.488 11.824 11.824 0 013.48 8.413c-.003 6.557-5.338 11.892-11.893 11.892a11.882 11.882 0 01-5.683-1.448l-4.78 1.598z" />
          </svg>
          Solicitar cotización por WhatsApp
        </button>
        <p className="text-[10px] text-center opacity-40 uppercase font-bold tracking-widest">
          Respuesta en menos de 15 minutos
        </p>
      </div>
    </div>
  )
}
