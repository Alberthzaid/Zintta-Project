import { useScrollAnimation } from '../../hooks/useScrollAnimation'

export default function CTABanner() {
  const ref = useScrollAnimation({ translateY: [30, 0], opacity: [0, 1], duration: 800 })

  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <div
        ref={ref}
        className="relative bg-[#ff1a88] rounded-3xl p-12 md:p-24 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12 shadow-2xl"
        style={{ boxShadow: '0 25px 60px rgba(255, 26, 136, 0.2)', opacity: 0 }}
      >
        {/* Radial highlight */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle at center, white, transparent)' }}
        />

        <div className="relative z-10 max-w-xl space-y-6">
          <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-none">
            ¿Listo para materializar tu visión?
          </h2>
          <p className="text-white/80 text-lg">
            Conversa con uno de nuestros especialistas en acabados de lujo hoy mismo.
          </p>
        </div>

        <div className="relative z-10">
          <button className="bg-white text-[#ff1a88] px-10 py-5 rounded-2xl text-xl font-bold hover:scale-105 transition-transform flex items-center gap-4 shadow-xl">
            <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>chat_bubble</span>
            Iniciar Cotización
          </button>
        </div>
      </div>
    </section>
  )
}
