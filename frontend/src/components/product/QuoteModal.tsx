import { useEffect, useRef } from 'react'
import anime from 'animejs'
import { OrderConfig } from '../../types'
import { getWhatsAppUrl, isWhatsAppConfigured } from '../../lib/whatsapp'

interface Props {
  config: OrderConfig
  priceLabel: string | null
  onClose: () => void
}

export default function QuoteModal({ config, priceLabel, onClose }: Props) {
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

  const messageText =
    `Hola ZINTTA, me gustaría cotizar el producto "${config.productName}".\n\n` +
    `• Color: ${config.color}\n` +
    `• Talla: ${config.size || '—'}\n` +
    `• Ubicación de impresión: ${config.printLocation}\n` +
    `• Cantidad: ${config.quantity}` +
    (priceLabel ? `\n• Precio detal estimado: ${priceLabel}` : '') +
    `\n\nQuedo atento a la propuesta comercial.`

  const waUrl = getWhatsAppUrl(messageText)
  const waConfigured = isWhatsAppConfigured()

  return (
    <div
      data-testid="quote-modal-backdrop"
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={modalRef}
        className="glass-panel-dark w-full max-w-[580px] rounded-xl shadow-2xl flex flex-col overflow-hidden"
        style={{ opacity: 0 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-white/10">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Revisa tu cotización
            </h2>
            <p className="text-white/50 text-xs uppercase tracking-widest mt-1">
              Paso final antes de enviar
            </p>
          </div>
          <button
            data-testid="quote-close-btn"
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
              close
            </span>
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
                  <span
                    className="material-symbols-outlined text-white/20"
                    style={{ fontSize: '36px' }}
                  >
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
                CANTIDAD: {config.quantity} UNIDAD(ES)
              </span>
              <h3 className="text-lg font-bold text-white mb-1">{config.productName}</h3>
              <p className="text-white/60 text-sm font-light">
                Color: <span className="text-white font-medium capitalize">{config.color}</span>
              </p>
              <p className="text-white/60 text-sm font-light">
                Talla: <span className="text-white font-medium">{config.size || '—'}</span>
              </p>
              {priceLabel && (
                <p className="text-white/60 text-sm font-light">
                  Precio detal:{' '}
                  <span className="text-[#ff1a88] font-bold">{priceLabel}</span>
                </p>
              )}
            </div>

            <button
              data-testid="quote-edit-btn"
              onClick={onClose}
              className="flex flex-col items-center gap-1 text-white/40 hover:text-[#ff1a88] transition-colors px-3 py-2 rounded-lg hover:bg-white/5"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                edit
              </span>
              <span className="text-[10px] font-bold uppercase">Editar</span>
            </button>
          </div>

          {/* Message preview */}
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
              <pre
                data-testid="quote-message"
                className="text-white/90 text-[13px] leading-relaxed whitespace-pre-wrap font-sans"
              >
                {messageText}
              </pre>
            </div>
          </div>

          {/* CTA */}
          <div className="space-y-4">
            {!waConfigured && (
              <div
                data-testid="wa-not-configured"
                className="rounded-lg p-4 border border-amber-500/30 bg-amber-500/10 text-amber-200 text-sm"
              >
                <strong>WhatsApp no está configurado.</strong> Define{' '}
                <code className="bg-black/40 px-1.5 py-0.5 rounded">
                  VITE_WHATSAPP_NUMBER
                </code>{' '}
                en <code className="bg-black/40 px-1.5 py-0.5 rounded">
                  /app/frontend/.env
                </code>{' '}
                (con código de país, sin signos, ej:{' '}
                <code className="bg-black/40 px-1.5 py-0.5 rounded">573001234567</code>).
              </div>
            )}
            {waUrl ? (
              <a
                data-testid="quote-send-btn"
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="gold-shimmer group relative w-full h-16 bg-[#ff1a88] hover:bg-[#ff1a88]/90 text-white rounded-lg flex items-center justify-center gap-3 transition-all duration-300 border border-[#D4AF37]/30"
                style={{ boxShadow: '0 0 20px rgba(255,26,136,0.3)' }}
              >
                <div className="absolute inset-0 rounded-lg border border-[#D4AF37]/20 pointer-events-none" />
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: '24px' }}
                >
                  chat
                </span>
                <span className="text-lg font-bold tracking-tight">
                  Enviar cotización por WhatsApp
                </span>
              </a>
            ) : (
              <button
                disabled
                className="w-full h-16 bg-white/10 text-white/40 rounded-lg flex items-center justify-center gap-3 text-lg font-bold cursor-not-allowed"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
                  block
                </span>
                Enviar cotización por WhatsApp
              </button>
            )}
            <div className="flex items-center justify-center gap-2 text-white/40 text-xs">
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                verified_user
              </span>
              <span>Respuesta garantizada en menos de 2 horas</span>
            </div>
          </div>
        </div>

        <div className="px-8 py-5 bg-black/20 border-t border-white/5 flex justify-center">
          <button
            data-testid="quote-back-btn"
            onClick={onClose}
            className="text-white/60 hover:text-white text-sm font-medium flex items-center gap-2 group"
          >
            <span
              className="material-symbols-outlined group-hover:-translate-x-1 transition-transform"
              style={{ fontSize: '20px' }}
            >
              arrow_back
            </span>
            Volver al catálogo
          </button>
        </div>
      </div>
    </div>
  )
}
