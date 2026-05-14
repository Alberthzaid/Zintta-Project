import { useEffect, useRef } from 'react'
import anime from 'animejs'
import { OrderConfig } from '../../types'

interface Props {
  config: OrderConfig
  onClose: () => void
}

export default function QuoteModal({ config, onClose }: Props) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (modalRef.current) {
      anime({
        targets: modalRef.current,
        scale: [0.95, 1],
        opacity: [0, 1],
        duration: 300,
        easing: 'easeOutExpo',
      })
    }
  }, [])

  const waMessage = encodeURIComponent(
    `Hola ZINTTA, me gustaría cotizar ${config.productName} con el siguiente diseño adjunto. Quedo atento a la propuesta comercial para las ${config.quantity} unidades.`
  )
  const waUrl = `https://wa.me/yournumber?text=${waMessage}`

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Background catalog blur (simulated) */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="h-full grid grid-cols-3 gap-6 p-10 pt-24">
          <div className="aspect-[3/4] bg-white/5 rounded-xl" />
          <div className="aspect-[3/4] bg-white/5 rounded-xl" />
          <div className="aspect-[3/4] bg-white/5 rounded-xl" />
        </div>
      </div>

      <div
        ref={modalRef}
        className="glass-panel-dark w-full max-w-[580px] rounded-xl shadow-2xl flex flex-col overflow-hidden"
        style={{ opacity: 0 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-white/10">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white">Revisa tu Cotización</h2>
            <p className="text-white/50 text-xs uppercase tracking-widest mt-1">Paso final antes de enviar</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>close</span>
          </button>
        </div>

        <div className="p-8 space-y-8">
          {/* Product card */}
          <div className="flex items-center gap-6 bg-white/5 p-5 rounded-lg border border-white/5">
            <div className="relative">
              <div className="w-24 h-24 rounded-lg overflow-hidden bg-zinc-800 border border-white/10 flex items-center justify-center">
                {config.uploadedDesign ? (
                  <img
                    src={config.uploadedDesign}
                    alt="Design thumbnail"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <span className="material-symbols-outlined text-white/20" style={{ fontSize: '36px' }}>
                    image
                  </span>
                )}
              </div>
              <div className="absolute -top-2 -right-2 bg-[#ff1a88] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg">
                PREMIUM
              </div>
            </div>

            <div className="flex-1">
              <span className="text-[#ff1a88] font-bold text-sm tracking-tighter block mb-1">
                CANTIDAD: {config.quantity} UNIDADES
              </span>
              <h3 className="text-lg font-bold text-white mb-1">{config.productName}</h3>
              <p className="text-white/60 text-sm font-light">
                Color: <span className="text-white font-medium capitalize">{config.color}</span>
              </p>
              <p className="text-white/60 text-sm font-light">
                Talla: <span className="text-white font-medium">{config.size}</span>
              </p>
            </div>

            <button
              onClick={onClose}
              className="flex flex-col items-center gap-1 text-white/40 hover:text-[#ff1a88] transition-colors px-3 py-2 rounded-lg hover:bg-white/5"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>edit</span>
              <span className="text-[10px] font-bold uppercase">Editar</span>
            </button>
          </div>

          {/* WhatsApp message preview */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <span className="material-symbols-outlined text-[#ff1a88]" style={{ fontSize: '20px' }}>
                chat_bubble
              </span>
              <h4 className="text-sm font-bold text-white/80 uppercase tracking-wider">
                Mensaje a enviar por WhatsApp
              </h4>
            </div>
            <div className="bg-black/40 rounded-lg p-5 border border-white/5">
              <p className="text-white/90 text-[15px] leading-relaxed italic">
                "Hola{' '}
                <span className="text-[#ff1a88] font-medium">ZINTTA</span>, me gustaría cotizar{' '}
                <span className="underline decoration-[#ff1a88]/30 underline-offset-4">
                  {config.productName}
                </span>{' '}
                con el siguiente diseño adjunto. Quedo atento a la propuesta comercial para las{' '}
                <span className="font-bold">{config.quantity} unidades</span>."
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="space-y-4">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="gold-shimmer group relative w-full h-16 bg-[#ff1a88] hover:bg-[#ff1a88]/90 text-white rounded-lg flex items-center justify-center gap-3 transition-all duration-300 border border-[#D4AF37]/30"
              style={{ boxShadow: '0 0 20px rgba(255,26,136,0.3)' }}
            >
              <div className="absolute inset-0 rounded-lg border border-[#D4AF37]/20 pointer-events-none" />
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              <span className="text-lg font-bold tracking-tight">Enviar cotización por WhatsApp</span>
            </a>
            <div className="flex items-center justify-center gap-2 text-white/40 text-xs">
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>verified_user</span>
              <span>Respuesta garantizada en menos de 2 horas</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 bg-black/20 border-t border-white/5 flex justify-center">
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white text-sm font-medium flex items-center gap-2 group"
          >
            <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform" style={{ fontSize: '20px' }}>
              arrow_back
            </span>
            Volver al catálogo
          </button>
        </div>
      </div>
    </div>
  )
}
