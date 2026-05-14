import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  PublicCatalogAPI,
  type CatalogProductDetail,
} from '../lib/api'
import { isSupabaseConfigured } from '../lib/supabase'
import { PrintLocation, OrderConfig } from '../types'
import ProductGallery from '../components/product/ProductGallery'
import ConfigPanel from '../components/product/ConfigPanel'
import QuoteModal from '../components/product/QuoteModal'
import WhatsAppFab from '../components/layout/WhatsAppFab'

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&q=80',
  'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=900&q=80',
  'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=900&q=80',
  'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=900&q=80',
]

const fmt = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
})

export default function ProductDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [product, setProduct] = useState<CatalogProductDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Personalization (cosmetic — not persisted)
  const [selectedColor, setSelectedColor] = useState('white')
  const [selectedSizeCode, setSelectedSizeCode] = useState<string>('')
  const [printLocation, setPrintLocation] = useState<PrintLocation>('FRONT')
  const [uploadedDesign, setUploadedDesign] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      setError('Supabase no está configurado.')
      return
    }
    const productId = Number(id)
    if (!Number.isFinite(productId)) {
      setLoading(false)
      setError('Producto no válido.')
      return
    }
    PublicCatalogAPI.getById(productId)
      .then((p) => {
        if (!p) setError('Producto no encontrado.')
        else {
          setProduct(p)
          const firstActive = p.variants.find((v) => v.active)
          if (firstActive) setSelectedSizeCode(firstActive.size_code)
        }
      })
      .catch((e: Error) => {
        setError(e.message)
        toast.error(e.message)
      })
      .finally(() => setLoading(false))
  }, [id])

  const selectedVariant = useMemo(
    () =>
      product?.variants.find(
        (v) => v.active && v.size_code === selectedSizeCode
      ) ?? null,
    [product, selectedSizeCode]
  )

  const availableSizeCodes = useMemo(
    () =>
      (product?.variants ?? [])
        .filter((v) => v.active)
        .map((v) => v.size_code),
    [product]
  )

  const images = useMemo(() => {
    if (!product) return FALLBACK_IMAGES
    if (product.image_url) {
      return [product.image_url, ...FALLBACK_IMAGES.slice(1)]
    }
    return FALLBACK_IMAGES
  }, [product])

  if (loading) {
    return (
      <div className="bg-[#181014] text-white min-h-screen flex items-center justify-center">
        <span
          className="material-symbols-outlined animate-spin text-[#ff1a88]"
          style={{ fontSize: '36px' }}
        >
          progress_activity
        </span>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="bg-[#181014] text-white min-h-screen flex flex-col items-center justify-center gap-4 px-6">
        <span
          className="material-symbols-outlined text-[#ff1a88]"
          style={{ fontSize: '48px' }}
        >
          error_outline
        </span>
        <p
          data-testid="product-error"
          className="text-center text-white/70 max-w-md"
        >
          {error ?? 'No fue posible cargar el producto.'}
        </p>
        <button
          onClick={() => navigate('/')}
          className="bg-[#ff1a88] hover:bg-[#ff1a88]/90 px-6 py-3 rounded-xl font-bold"
        >
          Volver al inicio
        </button>
      </div>
    )
  }

  const orderConfig: OrderConfig = {
    productId: String(product.id),
    productName: product.name,
    color: selectedColor,
    // ProductSize is a literal union; cast for compatibility with the existing modal
    size: selectedSizeCode as OrderConfig['size'],
    printLocation,
    uploadedDesign,
    quantity: 1,
  }

  return (
    <div className="bg-[#181014] text-white min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[#3a2730] bg-[#181014]/80 backdrop-blur-md px-6 md:px-20 py-3">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-8">
          <div className="flex items-center gap-8">
            <button
              data-testid="header-home-btn"
              onClick={() => navigate('/')}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div className="size-8 text-[#ff1a88]">
                <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold tracking-tight">ZINTTA</h2>
            </button>

            <nav className="hidden lg:flex items-center gap-8 text-sm font-medium opacity-80">
              {['Catálogo', 'Categorías', 'Nosotros', 'Contáctanos'].map((item) => (
                <button
                  key={item}
                  onClick={() => navigate('/')}
                  className="hover:text-[#ff1a88] transition-colors"
                >
                  {item}
                </button>
              ))}
            </nav>
          </div>

          <button
            onClick={() => navigate('/dashboard-admin/login')}
            className="bg-[#ff1a88] hover:bg-[#ff1a88]/90 text-white px-6 py-2 rounded-xl text-sm font-bold transition-all"
          >
            Admin
          </button>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 md:px-20 py-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 mb-8 text-sm font-medium opacity-60">
          <button onClick={() => navigate('/')} className="hover:text-[#ff1a88]">
            Home
          </button>
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
            chevron_right
          </span>
          <span>{product.categories?.name ?? 'Catálogo'}</span>
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
            chevron_right
          </span>
          <span data-testid="product-name-crumb" className="text-[#ff1a88]">
            {product.name}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Gallery */}
          <div className="lg:col-span-7 space-y-6">
            <ProductGallery
              images={images}
              uploadedDesign={uploadedDesign}
              printLocation={printLocation}
            />

            {/* Description */}
            {product.description && (
              <div className="pt-8 border-t border-[#3a2730]">
                <h3 className="text-xl font-bold mb-4">Descripción</h3>
                <p
                  data-testid="product-description"
                  className="text-sm opacity-70 leading-relaxed"
                >
                  {product.description}
                </p>
              </div>
            )}

            {/* Price ladder */}
            {product.variants.filter((v) => v.active).length > 0 && (
              <div className="pt-8 border-t border-[#3a2730]">
                <h3 className="text-xl font-bold mb-4">Precios por talla</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {product.variants
                    .filter((v) => v.active)
                    .map((v) => (
                      <div
                        key={v.id}
                        data-testid={`price-row-${v.id}`}
                        className={`rounded-xl border p-4 transition-colors ${
                          v.size_code === selectedSizeCode
                            ? 'border-[#ff1a88] bg-[#ff1a88]/5'
                            : 'border-[#3a2730]'
                        }`}
                      >
                        <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">
                          {v.size_code}
                        </p>
                        <p className="font-bold">{fmt.format(v.retail_price)}</p>
                        {v.wholesale_price > 0 && (
                          <p className="text-xs text-white/40 mt-1">
                            Mayor: {fmt.format(v.wholesale_price)}
                          </p>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Config panel */}
          <div className="lg:col-span-5 relative">
            <div className="lg:sticky lg:top-28 space-y-4">
              {/* Live price */}
              <div className="glass-panel-warm p-5 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-widest opacity-60 mb-1">
                    Precio detal
                  </p>
                  <p
                    data-testid="product-current-price"
                    className="text-3xl font-bold text-[#ff1a88]"
                  >
                    {selectedVariant
                      ? fmt.format(selectedVariant.retail_price)
                      : '—'}
                  </p>
                </div>
                {selectedVariant && selectedVariant.wholesale_price > 0 && (
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-widest opacity-60 mb-1">
                      Mayorista
                    </p>
                    <p className="text-lg font-bold">
                      {fmt.format(selectedVariant.wholesale_price)}
                    </p>
                  </div>
                )}
              </div>

              <ConfigPanel
                productName={product.name}
                categoryName={product.categories?.name ?? null}
                availableSizes={availableSizeCodes}
                selectedColor={selectedColor}
                onColorChange={setSelectedColor}
                selectedSize={selectedSizeCode}
                onSizeChange={setSelectedSizeCode}
                printLocation={printLocation}
                onLocationChange={setPrintLocation}
                uploadedDesign={uploadedDesign}
                onDesignUpload={setUploadedDesign}
                onQuote={() => setShowModal(true)}
                priceLabel={
                  selectedVariant ? fmt.format(selectedVariant.retail_price) : null
                }
              />
            </div>
          </div>
        </div>
      </main>

      {showModal && (
        <QuoteModal
          config={orderConfig}
          priceLabel={
            selectedVariant ? fmt.format(selectedVariant.retail_price) : null
          }
          onClose={() => setShowModal(false)}
        />
      )}

      <WhatsAppFab />
    </div>
  )
}
