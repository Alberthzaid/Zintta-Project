import { Link, useNavigate } from 'react-router-dom'
import { getWhatsAppContactUrl, getWhatsAppDefaultUrl } from '../../lib/whatsapp'

export default function Navbar() {
  const navigate = useNavigate()
  const contactUrl = getWhatsAppContactUrl()
  const quoteUrl = getWhatsAppDefaultUrl()

  return (
    <nav className="fixed top-0 w-full z-50 glass-panel border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="size-8 bg-[#ff1a88] rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-white" style={{ fontSize: '20px' }}>layers</span>
            </div>
            <span className="text-2xl font-bold tracking-tighter text-white">ZINTTA</span>
          </button>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
            <Link to="/catalogo" data-testid="nav-link-catalogo" className="hover:text-[#ff1a88] transition-colors">Catálogo</Link>
            {contactUrl ? (
              <a
                href={contactUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="nav-link-contactanos"
                className="hover:text-[#ff1a88] transition-colors"
              >
                Contáctanos
              </a>
            ) : (
              <a href="/#contactanos" data-testid="nav-link-contactanos" className="hover:text-[#ff1a88] transition-colors">Contáctanos</a>
            )}
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="relative hidden lg:block">
            <span
              className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
              style={{ fontSize: '18px' }}
            >
              search
            </span>
            <input
              className="bg-white/5 border-none rounded-full pl-10 pr-4 py-2 text-sm w-64 outline-none ring-transparent focus:ring-1 focus:ring-[#ff1a88] text-white placeholder:text-white/40"
              placeholder="Buscar producto..."
              type="text"
            />
          </div>

          {quoteUrl ? (
            <a
              href={quoteUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="nav-cotizar-articulo-btn"
              className="bg-[#ff1a88] hover:bg-[#ff1a88]/90 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all fuchsia-glow flex items-center gap-2"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>request_quote</span>
              Cotizar artículo
            </a>
          ) : (
            <button
              data-testid="nav-cotizar-articulo-btn"
              className="bg-[#ff1a88] hover:bg-[#ff1a88]/90 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all fuchsia-glow flex items-center gap-2"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>request_quote</span>
              Cotizar artículo
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}
