import { PrintLocation } from '../../types'
import ArtworkUpload from './ArtworkUpload'

interface Props {
  productName: string
  categoryName: string | null
  availableSizes: string[]
  selectedColor: string
  onColorChange: (color: string) => void
  selectedSize: string
  onSizeChange: (size: string) => void
  printLocation: PrintLocation
  onLocationChange: (loc: PrintLocation) => void
  uploadedDesign: string | null
  onDesignUpload: (dataUrl: string) => void
  onQuote: () => void
  priceLabel: string | null
}

const COLORS: { label: string; value: string; bg: string }[] = [
  { label: 'Blanco', value: 'white', bg: '#ffffff' },
  { label: 'Negro', value: 'black', bg: '#0f172a' },
  { label: 'Azul', value: 'navy', bg: '#1e3a8a' },
  { label: 'Rojo', value: 'rose', bg: '#e11d48' },
  { label: 'Esmeralda', value: 'emerald', bg: '#059669' },
]

const LOCATIONS: { value: PrintLocation; icon: string; label: string }[] = [
  { value: 'FRONT', icon: 'top_panel_open', label: 'FRENTE' },
  { value: 'BACK', icon: 'bottom_panel_open', label: 'ESPALDA' },
  { value: 'SLEEVE', icon: 'align_horizontal_left', label: 'MANGA' },
]

export default function ConfigPanel({
  productName,
  categoryName,
  availableSizes,
  selectedColor,
  onColorChange,
  selectedSize,
  onSizeChange,
  printLocation,
  onLocationChange,
  uploadedDesign,
  onDesignUpload,
  onQuote,
  priceLabel,
}: Props) {
  const selectedColorLabel =
    COLORS.find((c) => c.value === selectedColor)?.label ?? 'Blanco'

  return (
    <div className="space-y-8">
      <div>
        {categoryName && (
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#ff1a88] mb-2">
            {categoryName}
          </p>
        )}
        <h1
          data-testid="product-title"
          className="text-4xl font-black leading-tight tracking-tight mb-2"
        >
          {productName}
        </h1>
        <p className="text-sm opacity-60">Personaliza tu pedido y cotiza por WhatsApp.</p>
      </div>

      {/* Step 1: Color */}
      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <h4 className="text-sm font-bold uppercase tracking-widest">
            1. Seleccionar color
          </h4>
          <span className="text-xs opacity-60 font-medium">{selectedColorLabel}</span>
        </div>
        <div className="flex flex-wrap gap-3">
          {COLORS.map((color) => (
            <button
              key={color.value}
              data-testid={`color-${color.value}`}
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

      {/* Step 2: Size — driven by DB variants */}
      <div className="space-y-4">
        <h4 className="text-sm font-bold uppercase tracking-widest">
          2. Talla disponible
        </h4>
        {availableSizes.length === 0 ? (
          <div className="text-xs text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-lg px-4 py-3">
            Este producto aún no tiene variantes activas.
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {availableSizes.map((code) => (
              <button
                key={code}
                data-testid={`size-${code}`}
                onClick={() => onSizeChange(code)}
                className={`py-3 rounded-lg text-sm font-bold transition-all ${
                  selectedSize === code
                    ? 'border-2 border-[#ff1a88] text-[#ff1a88] bg-[#ff1a88]/5'
                    : 'border border-[#3a2730] hover:border-[#ff1a88]'
                }`}
              >
                {code}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Step 3: Print Location */}
      <div className="space-y-4">
        <h4 className="text-sm font-bold uppercase tracking-widest">
          3. Ubicación de impresión (opcional)
        </h4>
        <div className="grid grid-cols-3 gap-3">
          {LOCATIONS.map((loc) => (
            <button
              key={loc.value}
              data-testid={`location-${loc.value}`}
              onClick={() => onLocationChange(loc.value)}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all ${
                printLocation === loc.value
                  ? 'border-2 border-[#ff1a88] bg-[#ff1a88]/5'
                  : 'border border-[#3a2730] opacity-60 hover:opacity-100'
              }`}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>
                {loc.icon}
              </span>
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
          <h3 className="font-bold text-lg">Resumen del pedido</h3>
          <span className="bg-[#ff1a88]/20 text-[#ff1a88] text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
            Estimado
          </span>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between opacity-80">
            <span>
              Item: {productName} ({selectedColorLabel})
            </span>
            <span>Talla: {selectedSize || '—'}</span>
          </div>
          <div className="flex justify-between opacity-80">
            <span>Impresión: {printLocation}</span>
            <span>Cant: 1</span>
          </div>
          {priceLabel && (
            <div className="flex justify-between pt-2 mt-2 border-t border-white/10">
              <span className="font-bold">Precio unitario</span>
              <span data-testid="config-price-label" className="font-bold text-[#ff1a88]">
                {priceLabel}
              </span>
            </div>
          )}
        </div>
        <div className="h-px bg-white/10 my-4" />
        <button
          data-testid="quote-cta-btn"
          onClick={onQuote}
          disabled={availableSizes.length === 0}
          className="w-full bg-[#ff1a88] hover:bg-[#ff1a88]/90 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg"
          style={{ boxShadow: '0 8px 30px rgba(255,26,136,0.3)' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>
            chat
          </span>
          Solicitar cotización por WhatsApp
        </button>
        <p className="text-[10px] text-center opacity-40 uppercase font-bold tracking-widest">
          Respuesta en menos de 15 minutos
        </p>
      </div>
    </div>
  )
}
