import { useState } from 'react'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'
import ProductCard from './ProductCard'
import { Product } from '../../types'

const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Cajas Rigid Premium',
    description: 'Acabado Soft Touch mate con hot-stamping dorado. Ideal para joyería y alta costura.',
    price: 'Desde $45.00',
    badge: 'Bestseller',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCd6WSCW_XfVIMviwn8aBNc8_2owQDLtuUZ8yeWTzoGzLgy17XtW_NP_JnbYOpGuIlV0OMHOCaXQFjkU0hcLOOGC9MmD2TNMduVppJ1mudnq-b1N-IkBccd0kxvLIrOJ0T4U7Tp7gFkvy8UEQbi9Fvp-MxRLIieE-QueZfCduSht83CnLbDUmi0oBx6jykdf3UUNyzTMCYMqnhYZw0NTN-Oxv3U2U65FOJueLc-4rUosn08tITSmSCydmPbJo5RCwenxVQctNf2hpTw',
    colors: ['rgba(255,255,255,0.2)', '#000000', '#94a3b8'],
    category: 'packaging',
  },
  {
    id: '2',
    name: 'Libros de Arte',
    description: 'Papel importado de 200g con encuadernado cosido y lomo reforzado. Calidad museográfica.',
    price: 'Desde $120.00',
    badge: 'Premium',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBp3dPmsIuYYXGTi2TilOokHT2F0Y4pIqGqL8pziQ29l6M_UOEFzYXvRE96G4dUvFUGvIzxqdxZjU_giypCkB1Crprh9xLCCiYPTWPkat4jOdEWAq0S8dt2KFhr1wSzg4uFmUvlU34dsK5S6bnYwXlyNA1ibRteHvD8mMkY9r-H23XeqqcwFWP8T6VSkqt4PQXlxLiXcXZ6LnVENMLI2NejgJYM1D-NnalmWYep6J2hvVmvRrizitGUdgiIKIaJX_mlm-G1hR8tp4N0',
    colors: ['#e7e5e4', '#1c1917'],
    category: 'editorial',
  },
  {
    id: '3',
    name: 'Tarjetas Edge Gilded',
    description: 'Papel algodón 600g con cantos pintados en fucsia neón y letterpress profundo.',
    price: 'Desde $85.00',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDELp2xMCVp0OY5hB-lcWoFZ0YypQbFvukXhEPHEQmp6dlPr4q3P9kM9f3OPoF6zEPhlWbuz6gQIInbutm1RF5diJFAyvfkTSb31STCqCn0S3o3tBTY5Y4O8F8rs92hzHv7XfJEhlmgIY71Id0KXkoq3arfSCBAUTm_o1YcwLsRyYZkj7PKap7T1b-P6_LvhoI63LDhLWugzInlZee_ceeYIKt0dA-BL2pGxkiuBc3jY7HMnFbS__ns9iQPTHlC6peBYA45b_-dXcsZ',
    colors: ['#ff1a88', '#facc15'],
    category: 'lujo',
  },
]

const FILTERS = ['Todos', 'Packaging', 'Editorial', 'Marketing', 'Lujo'] as const

export default function ProductCatalog() {
  const [activeFilter, setActiveFilter] = useState<string>('Todos')
  const gridRef = useScrollAnimation({ childSelector: '.product-card', stagger: 120 })

  const filtered =
    activeFilter === 'Todos'
      ? PRODUCTS
      : PRODUCTS.filter(
          (p) => p.category.toLowerCase() === activeFilter.toLowerCase()
        )

  return (
    <section id="catalogo" className="max-w-7xl mx-auto px-6 py-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div className="space-y-4">
          <h2 className="text-4xl font-bold text-white tracking-tight">
            Catálogo de Productos Premium
          </h2>
          <p className="text-white/40 text-lg max-w-md">
            Selección curada de soluciones de packaging y editorial de lujo.
          </p>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`whitespace-nowrap px-6 py-2 rounded-full text-sm font-medium transition-all ${
                activeFilter === f
                  ? 'bg-[#ff1a88] text-white'
                  : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div
        ref={gridRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
        style={{ opacity: filtered.length > 0 ? undefined : undefined }}
      >
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="mt-20 flex justify-center">
        <button className="group flex items-center gap-4 text-white/60 hover:text-white transition-all">
          <span className="text-lg font-medium">Explorar catálogo completo</span>
          <div className="size-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#ff1a88] group-hover:bg-[#ff1a88]/10 transition-all">
            <span className="material-symbols-outlined group-hover:text-[#ff1a88] transition-all" style={{ fontSize: '18px' }}>
              expand_more
            </span>
          </div>
        </button>
      </div>
    </section>
  )
}
