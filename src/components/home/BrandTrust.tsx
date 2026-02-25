import { useEffect, useRef } from 'react'
import anime from 'animejs'

const BRANDS = [
  { name: 'LVMH', className: 'text-3xl font-black tracking-tighter' },
  { name: 'VOGUE', className: 'text-3xl font-serif italic tracking-tight' },
  { name: 'GUCCI', className: 'text-2xl font-bold tracking-widest' },
  { name: 'APPLE', className: 'text-3xl font-extrabold' },
  { name: 'TESLA', className: 'text-2xl font-light tracking-[0.4em]' },
]

export default function BrandTrust() {
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const totalWidth = track.scrollWidth / 2

    const anim = anime({
      targets: track,
      translateX: [`0px`, `-${totalWidth}px`],
      duration: 18000,
      easing: 'linear',
      loop: true,
    })

    return () => anim.pause()
  }, [])

  const items = [...BRANDS, ...BRANDS]

  return (
    <section className="border-t border-white/5 bg-white/[0.02] py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
        <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-12">
          Confían en nuestra calidad
        </p>
        <div className="w-full overflow-hidden">
          <div
            ref={trackRef}
            className="flex items-center gap-16 md:gap-24 opacity-30 grayscale contrast-125 whitespace-nowrap will-change-transform"
            style={{ display: 'inline-flex' }}
          >
            {items.map((brand, i) => (
              <span key={i} className={`text-white ${brand.className}`}>
                {brand.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
