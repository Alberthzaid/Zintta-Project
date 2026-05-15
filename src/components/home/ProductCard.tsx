import { useNavigate } from 'react-router-dom'
import type { CatalogProduct } from '../../lib/api'
import { getWhatsAppUrl } from '../../lib/whatsapp'

const fmt = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
})

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80'

interface Props {
  product: CatalogProduct
}

export default function ProductCard({ product }: Props) {
  const navigate = useNavigate()
  const priceLabel =
    product.minRetailPrice != null
      ? `Desde ${fmt.format(product.minRetailPrice)}`
      : 'Precio a consultar'

  const waUrl = getWhatsAppUrl(
    `Hola ZINTTA, me interesa el producto "${product.name}". ¿Podrían enviarme más información?`
  )

  return (
    <div
      data-testid={`product-card-${product.id}`}
      className="group product-card flex flex-col bg-white/5 rounded-2xl overflow-hidden border border-white/5"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-white/5">
        <img
          src={product.image_url || FALLBACK_IMAGE}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {product.badge && (
          <div className="absolute top-4 left-4">
            <span
              className="bg-[#ff1a88]/80 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-white/10 backdrop-blur-md"
            >
              {product.badge}
            </span>
          </div>
        )}
        {product.categories?.name && (
          <div className="absolute top-4 right-4">
            <span className="bg-black/60 text-white/80 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-white/10 backdrop-blur-md">
              {product.categories.name}
            </span>
          </div>
        )}
      </div>

      <div className="p-8 space-y-6 flex flex-col flex-1">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">{product.name}</h3>
          <p className="text-white/40 text-sm leading-relaxed line-clamp-2 min-h-[2.5rem]">
            {product.description ?? '\u00A0'}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[#ff1a88] font-bold text-lg">{priceLabel}</span>
          {product.availableSizes.length > 0 && (
            <span className="text-xs text-white/40">
              {product.availableSizes.length} talla
              {product.availableSizes.length === 1 ? '' : 's'}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-3 pt-4 mt-auto">
          <button
            data-testid={`view-product-${product.id}`}
            onClick={() => navigate(`/product/${product.id}`)}
            className="flex items-center justify-center gap-2 border border-white/10 hover:bg-white/10 text-white font-bold py-3 rounded-xl transition-all text-sm"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
              visibility
            </span>
            Ver
          </button>
          {waUrl ? (
            <a
              data-testid={`wa-product-${product.id}`}
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-[#25D366] hover:brightness-110 text-white font-bold py-3 rounded-xl transition-all text-sm"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                chat
              </span>
              WhatsApp
            </a>
          ) : (
            <button
              disabled
              title="Configura VITE_WHATSAPP_NUMBER en .env"
              className="flex items-center justify-center gap-2 bg-white/5 text-white/40 font-bold py-3 rounded-xl text-sm cursor-not-allowed"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                chat
              </span>
              WhatsApp
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
