import { useEffect } from 'react'
import anime from 'animejs'
import { useParallax } from '../../hooks/useParallax'

const HERO_BG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCEWGNShjLtVepDNqYyxTMWw8KsKRVVdU48PAjnCe-K2EXSvZ4Qy3mscekOzhb00ddkLXoLh-BVZ9Gz9FSQnufiossXKfs2ZnjJ1e819bteWk41xjGu9HcOXJgDXCK1JZizIAWarVMDZv_McdZvQZxovufzDsbzdZ6RpPq4tv5UOHz3ZwEzhGy6n94HgJ7bREmd0g-RKmGQ3vMKAQHxvTw5KE_jEhhGYu8Q0AvnVeodgWtQ-lMOZDdWv2fXOJT3uVtHoWcSxO4WfDsy'

export default function HeroSection() {
  const bgRef = useParallax(0.35)

  useEffect(() => {
    anime
      .timeline({ easing: 'easeOutExpo' })
      .add({
        targets: '.hero-badge',
        opacity: [0, 1],
        translateY: [-20, 0],
        duration: 600,
      })
      .add(
        {
          targets: '.hero-title',
          opacity: [0, 1],
          translateY: [50, 0],
          duration: 900,
        },
        '-=300'
      )
      .add(
        {
          targets: '.hero-subtitle',
          opacity: [0, 1],
          translateY: [24, 0],
          duration: 700,
        },
        '-=500'
      )
      .add(
        {
          targets: '.hero-cta',
          opacity: [0, 1],
          translateY: [20, 0],
          duration: 600,
        },
        '-=400'
      )
  }, [])

  return (
    <section className="relative h-[85vh] flex items-center justify-center px-6 overflow-hidden">
      {/* Parallax background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b0b0b]/20 via-[#0b0b0b]/60 to-[#0b0b0b] z-10" />
        <div
          ref={bgRef}
          className="absolute inset-0 w-full bg-cover bg-center will-change-transform"
          style={{ backgroundImage: `url("${HERO_BG}")`, top: '-10%', height: '120%' }}
        />
      </div>

      {/* Content */}
      <div className="relative z-20 max-w-4xl w-full">
        <div className="glass-panel p-10 md:p-16 rounded-2xl md:rounded-3xl flex flex-col items-center text-center space-y-8 border-white/10">
          <span
            className="hero-badge px-4 py-1.5 rounded-full bg-[#ff1a88]/10 text-[#ff1a88] text-xs font-bold uppercase tracking-widest border border-[#ff1a88]/20"
            style={{ opacity: 0 }}
          >
            Edición Limitada &amp; Premium
          </span>

          <h1
            data-testid="hero-title"
            className="hero-title text-5xl md:text-7xl font-bold text-white leading-[1.1] tracking-tight"
            style={{ opacity: 0 }}
          >
            Prendas de{' '}
            <span className="text-[#ff1a88] italic">alta gama</span> y exclusivas
          </h1>

          <p
            className="hero-subtitle text-lg md:text-xl text-white/60 max-w-2xl font-light"
            style={{ opacity: 0 }}
          >
            Eleva tu presencia con acabados premium y personalización total. Calidad Apple-style en cada detalle impreso.
          </p>

          <div
            className="hero-cta flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            style={{ opacity: 0 }}
          >
            <button className="bg-[#ff1a88] text-white px-10 py-5 rounded-xl text-lg font-bold transition-all fuchsia-glow flex items-center justify-center gap-3 group">
              Cotizar mi impresión
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform" style={{ fontSize: '20px' }}>
                arrow_forward
              </span>
            </button>
            <button className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-10 py-5 rounded-xl text-lg font-bold transition-all flex items-center justify-center gap-3">
              Ver Muestrario
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
