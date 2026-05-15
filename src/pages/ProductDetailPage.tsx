import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { PublicCatalogAPI, type CatalogProductDetail } from '../lib/api'
import { isSupabaseConfigured } from '../lib/supabase'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import WhatsAppFab from '../components/layout/WhatsAppFab'
import { getWhatsAppUrl, isWhatsAppConfigured } from '../lib/whatsapp'

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

  const [selectedSizeCode, setSelectedSizeCode] = useState<string>('')

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

  const activeVariants = useMemo(
    () => (product?.variants ?? []).filter((v) => v.active),
    [product]
  )

  const selectedVariant = useMemo(
    () =>
      activeVariants.find((v) => v.size_code === selectedSizeCode) ?? null,
    [activeVariants, selectedSizeCode]
  )

  const waUrl = useMemo(() => {
    if (!product) return null
    const lines = [
      `Hola ZINTTA, me interesa cotizar el producto "${product.name}".`,
      '',
      selectedSizeCode ? `• Talla: ${selectedSizeCode}` : null,
      selectedVariant
        ? `• Precio detal: ${fmt.format(selectedVariant.retail_price)}`
        : null,
      '',
      'Quedo atento a la propuesta comercial.',
    ].filter((l): l is string => l !== null)
    return getWhatsAppUrl(lines.join('\n'))
  }, [product, selectedSizeCode, selectedVariant])

  if (loading) {
    return (
      <div className="bg-[#0b0b0b] text-white min-h-screen flex items-center justify-center">
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
      <div className="bg-[#0b0b0b] text-white min-h-screen flex flex-col items-center justify-center gap-4 px-6">
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
          onClick={() => navigate('/catalogo')}
          className="bg-[#ff1a88] hover:bg-[#ff1a88]/90 px-6 py-3 rounded-xl font-bold"
        >
          Volver al catálogo
        </button>
      </div>
    )
  }

  const waConfigured = isWhatsAppConfigured()

  return (
    <div className="bg-[#0b0b0b] text-slate-100 min-h-screen">
      <Navbar />

      <main className="pt-28 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 mb-8 text-sm font-medium text-white/50">
            <button
              onClick={() => navigate('/catalogo')}
              className="hover:text-[#ff1a88] transition-colors"
            >
              Catálogo
            </button>
            <span
              className="material-symbols-outlined"
              style={{ fontSize: '14px' }}
            >
              chevron_right
            </span>
            <span>{product.categories?.name ?? 'Producto'}</span>
            <span
              className="material-symbols-outlined"
              style={{ fontSize: '14px' }}
            >
              chevron_right
            </span>
            <span
              data-testid="product-name-crumb"
              className="text-[#ff1a88]"
            >
              {product.name}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left: Image */}
            <div className="lg:col-span-7">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-white/5 border border-white/10">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-white/30 gap-3">
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: '64px' }}
                    >
                      image
                    </span>
                    <p className="text-sm">Sin imagen disponible</p>
                  </div>
                )}
              </div>

              {/* Description */}
              {product.description && (
                <div className="mt-10 pt-8 border-t border-white/10">
                  <h3 className="text-xl font-bold mb-4 text-white">
                    Descripción
                  </h3>
                  <p
                    data-testid="product-description"
                    className="text-sm text-white/60 leading-relaxed whitespace-pre-line"
                  >
                    {product.description}
                  </p>
                </div>
              )}

              {/* Price ladder */}
              {activeVariants.length > 0 && (
                <div className="mt-10 pt-8 border-t border-white/10">
                  <h3 className="text-xl font-bold mb-4 text-white">
                    Precios por talla
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {activeVariants.map((v) => (
                      <button
                        type="button"
                        key={v.id}
                        data-testid={`price-row-${v.id}`}
                        onClick={() => setSelectedSizeCode(v.size_code)}
                        className={`text-left rounded-xl border p-4 transition-colors ${
                          v.size_code === selectedSizeCode
                            ? 'border-[#ff1a88] bg-[#ff1a88]/5'
                            : 'border-white/10 hover:border-white/30'
                        }`}
                      >
                        <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">
                          {v.size_code}
                        </p>
                        <p className="font-bold text-white">
                          {fmt.format(v.retail_price)}
                        </p>
                        {v.wholesale_price > 0 && (
                          <p className="text-xs text-white/40 mt-1">
                            Mayor: {fmt.format(v.wholesale_price)}
                          </p>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Info & CTA */}
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-28 space-y-6">
                <div>
                  {product.categories?.name && (
                    <p className="text-[11px] font-bold uppercase tracking-widest text-[#ff1a88] mb-2">
                      {product.categories.name}
                    </p>
                  )}
                  <h1
                    data-testid="product-title"
                    className="text-4xl font-black leading-tight tracking-tight text-white mb-2"
                  >
                    {product.name}
                  </h1>
                  {product.badge && (
                    <span className="inline-block mt-2 bg-[#ff1a88]/15 text-[#ff1a88] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                      {product.badge}
                    </span>
                  )}
                </div>

                {/* Live price */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-white/50 mb-1">
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
                      <p className="text-[10px] uppercase tracking-widest text-white/50 mb-1">
                        Mayorista
                      </p>
                      <p className="text-lg font-bold text-white">
                        {fmt.format(selectedVariant.wholesale_price)}
                      </p>
                    </div>
                  )}
                </div>

                {/* Size selector */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-white">
                    Talla disponible
                  </h4>
                  {activeVariants.length === 0 ? (
                    <div className="text-xs text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-lg px-4 py-3">
                      Este producto aún no tiene variantes activas.
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {activeVariants.map((v) => (
                        <button
                          key={v.id}
                          type="button"
                          data-testid={`size-${v.size_code}`}
                          onClick={() => setSelectedSizeCode(v.size_code)}
                          className={`py-3 rounded-lg text-sm font-bold transition-all ${
                            selectedSizeCode === v.size_code
                              ? 'border-2 border-[#ff1a88] text-[#ff1a88] bg-[#ff1a88]/5'
                              : 'border border-white/10 text-white hover:border-[#ff1a88]/60'
                          }`}
                        >
                          {v.size_code}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* CTA */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 space-y-4">
                  {!waConfigured && (
                    <div
                      data-testid="wa-not-configured"
                      className="rounded-lg p-3 border border-amber-500/30 bg-amber-500/10 text-amber-200 text-xs"
                    >
                      <strong>WhatsApp no está configurado.</strong> Define{' '}
                      <code className="bg-black/40 px-1 py-0.5 rounded">
                        VITE_WHATSAPP_NUMBER
                      </code>{' '}
                      en{' '}
                      <code className="bg-black/40 px-1 py-0.5 rounded">
                        /frontend/.env
                      </code>
                      .
                    </div>
                  )}
                  {waUrl ? (
                    <a
                      data-testid="quote-cta-btn"
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-[#25D366] hover:brightness-110 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all"
                    >
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: '22px' }}
                      >
                        chat
                      </span>
                      Cotizar por WhatsApp
                    </a>
                  ) : (
                    <button
                      disabled
                      data-testid="quote-cta-btn"
                      className="w-full bg-white/10 text-white/40 py-4 rounded-xl font-bold flex items-center justify-center gap-3 cursor-not-allowed"
                    >
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: '22px' }}
                      >
                        block
                      </span>
                      Cotizar por WhatsApp
                    </button>
                  )}
                  <p className="text-[10px] text-center text-white/40 uppercase font-bold tracking-widest">
                    Respuesta en menos de 15 minutos
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppFab />
    </div>
  )
}
