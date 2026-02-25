import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PrintLocation, ProductSize, OrderConfig } from '../types'
import ProductGallery from '../components/product/ProductGallery'
import ConfigPanel from '../components/product/ConfigPanel'
import QuoteModal from '../components/product/QuoteModal'
import WhatsAppFab from '../components/layout/WhatsAppFab'

const PRODUCT_IMAGES = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCk2HMep5OIcEuttWvNglnLtDV83uVqwGNWd_RSZJlJKhfJa5Jf__I6eac5-u9MbGhvhf-ewA6FqwA6fdVk7E2MYEWrbA_ZUzkqMYvHy8M_UBHSFcdwBDJjeyyGB5s6ARTjfFxBf25VByQScb9laVDyHDj7sioLh3GyLYg8zkH130w9UkIyqtBdvKMMGEx7sgko61fYyBS52k7rDSn6l9VJvPTrurnSYyv4ojBKE8-gp3GR0pnSvpLiAWHR2fB8QjzNOi2_o3V00HqL',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDQ4wnGV4v7knlMBUUKSiM9h8ntMLKLeYn-h0sEBLRYT28GRaA0i7QIMD9V4XwV-oU8tmsMW7JeppdgLpzAPOLsn6sAQHQcbYeVZK33v1YOD8J2j1-l-IcBuNO4IcQkYf3vgtlIUU3OamSWclWyx_GeSg7c9knmMmw2GcA2Qd_Z5-2eKU4YK10aSnpxD4Ep8EUDIDEm219PinnWQYUHhu-SzKG9bSkp-DYDdPulikmjcijSJ2fNYv5ubhbcBwS_4_GexxfRfT4hc10V',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuACqcanAUfRiNiVcroLa54-Ug3izn_JQKYcHWqu19EmIQR8AuxMwJAeO6zM3qEnSZ3bvzr6CegbMigqJUCpAQhLZB80v7KsaYbjS0owYdujZBFcsADJbb9Ceha_GDs2Ir4qPAiwLF0lie3aYLqVbeiwUJ6I_cglTLdl3rTb51yz0SosQs9j_LuCvgHkF310C7ijY2zgi4cykYS5QYqlnE6oFifddyY_VUrg5jCB1LRKySnW1H_cAIVkgX_7-_dTKp7O5KD78f_U_z3U',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAOb7G36FVn7lBgUPU4g1BghCBveEVFTAnsHAXIC4NC0px5F9BTlNFBzOrKmcmYO-CCzV3Dxdn2HE7L1mCUK5134yFSKWq_4L2DxdvEh4s6oWkOX0d1RLWLF06iD3ijGT44332fLJGV5EX2S7VWNOIrBawYo-8a9W2B1pxzMlS5SDuNH9ZAZ3lYzoFdl_YthpdkiGtkzd93inXclFWeDTdE3FskSKJbnHcxg7d4IJBLzl39zQ5ASJIDPod296spAZvRUwOw88D8xZlP',
]

const SPECS = [
  { label: 'Material', value: '100% Ring-spun combed cotton, 180 GSM' },
  { label: 'Fit', value: 'Modern Classic Fit, Seamless collar' },
  { label: 'Durabilidad', value: 'Double-needle sleeve and bottom hems' },
  { label: 'Técnica', value: 'Optimizado para DTG e Impresión Serigráfica' },
]

export default function ProductDetailPage() {
  const navigate = useNavigate()

  const [selectedColor, setSelectedColor] = useState('white')
  const [selectedSize, setSelectedSize] = useState<ProductSize>('L')
  const [printLocation, setPrintLocation] = useState<PrintLocation>('FRONT')
  const [uploadedDesign, setUploadedDesign] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)

  const orderConfig: OrderConfig = {
    productId: '1',
    productName: 'Classic T-Shirt',
    color: selectedColor,
    size: selectedSize,
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
              {['Catálogo', 'Colecciones', 'Cómo Funciona', 'Soporte'].map((item) => (
                <a key={item} href="#" className="hover:text-[#ff1a88] transition-colors">
                  {item}
                </a>
              ))}
            </nav>
          </div>

          <button className="bg-[#ff1a88] hover:bg-[#ff1a88]/90 text-white px-6 py-2 rounded-xl text-sm font-bold transition-all">
            Login
          </button>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 md:px-20 py-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 mb-8 text-sm font-medium opacity-60">
          <button onClick={() => navigate('/')} className="hover:text-[#ff1a88]">Home</button>
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>chevron_right</span>
          <span>Personalización</span>
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>chevron_right</span>
          <span className="text-[#ff1a88]">Classic T-Shirt</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Gallery */}
          <div className="lg:col-span-7 space-y-6">
            <ProductGallery
              images={PRODUCT_IMAGES}
              uploadedDesign={uploadedDesign}
              printLocation={printLocation}
            />

            {/* Specs */}
            <div className="pt-8 border-t border-[#3a2730]">
              <h3 className="text-xl font-bold mb-4">Especificaciones del Producto</h3>
              <div className="grid grid-cols-2 gap-6 text-sm">
                {SPECS.map((spec) => (
                  <div key={spec.label} className="space-y-2">
                    <p className="opacity-60 uppercase tracking-widest text-[10px] font-bold">
                      {spec.label}
                    </p>
                    <p>{spec.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust badges */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: 'verified', title: 'Tintas Eco-Friendly', desc: 'Usamos tintas a base de agua, biodegradables, para toda nuestra impresión textil.' },
                { icon: 'local_shipping', title: 'Envío Global', desc: 'Logística puerta a puerta con seguimiento en tiempo real para cada pedido.' },
                { icon: 'precision_manufacturing', title: 'Control de Calidad', desc: 'Cada prenda pasa por 5 puntos de verificación antes de ser empacada.' },
              ].map((badge) => (
                <div key={badge.title} className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-[#ff1a88]" style={{ fontSize: '30px' }}>
                    {badge.icon}
                  </span>
                  <div>
                    <h5 className="font-bold mb-1">{badge.title}</h5>
                    <p className="text-sm opacity-60">{badge.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Config panel */}
          <div className="lg:col-span-5 relative">
            <div className="lg:sticky lg:top-28">
              <ConfigPanel
                selectedColor={selectedColor}
                onColorChange={setSelectedColor}
                selectedSize={selectedSize}
                onSizeChange={setSelectedSize}
                printLocation={printLocation}
                onLocationChange={setPrintLocation}
                uploadedDesign={uploadedDesign}
                onDesignUpload={setUploadedDesign}
                onQuote={() => setShowModal(true)}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-[#3a2730] py-12 bg-[#110b0e]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-20 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3 opacity-50">
            <div className="size-6">
              <svg fill="currentColor" viewBox="0 0 48 48">
                <path d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold">ZINTTA</h2>
          </div>
          <p className="text-sm opacity-40">© 2024 ZINTTA Print Studio. Todos los derechos reservados.</p>
          <div className="flex gap-6 opacity-60 text-sm">
            {['Privacidad', 'Términos', 'Cookies'].map((item) => (
              <a key={item} href="#" className="hover:text-[#ff1a88] transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </footer>

      {/* Quote modal */}
      {showModal && (
        <QuoteModal config={orderConfig} onClose={() => setShowModal(false)} />
      )}

      <WhatsAppFab />
    </div>
  )
}
