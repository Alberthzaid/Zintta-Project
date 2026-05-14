export default function Footer() {
  return (
    <footer className="bg-[#050505] border-t border-white/5 py-20 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-6 col-span-1">
          <div className="flex items-center gap-2">
            <div className="size-6 bg-[#ff1a88] rounded-md" />
            <span className="text-xl font-bold tracking-tighter text-white">ZINTTA</span>
          </div>
          <p className="text-white/40 text-sm leading-relaxed">
            Definiendo el estándar de oro en impresión digital y offset para el mercado de lujo global.
          </p>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6">Explorar</h4>
          <ul className="space-y-4 text-sm text-white/40">
            {['Packaging', 'Editorial de Arte', 'Materiales Sostenibles', 'Muestrario Físico'].map((item) => (
              <li key={item}>
                <a href="#" className="hover:text-[#ff1a88] transition-colors">{item}</a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6">Compañía</h4>
          <ul className="space-y-4 text-sm text-white/40">
            {['Sobre Nosotros', 'Portafolio', 'Carreras', 'Contacto'].map((item) => (
              <li key={item}>
                <a href="#" className="hover:text-[#ff1a88] transition-colors">{item}</a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6">Newsletter</h4>
          <p className="text-white/40 text-sm mb-6">
            Suscríbete para recibir tendencias en diseño y acabados.
          </p>
          <div className="flex gap-2">
            <input
              className="bg-white/5 border-none rounded-lg text-sm px-4 flex-1 outline-none text-white placeholder:text-white/30 focus:ring-1 focus:ring-[#ff1a88]"
              placeholder="Email"
              type="email"
            />
            <button className="bg-[#ff1a88] size-10 rounded-lg flex items-center justify-center text-white hover:bg-[#ff1a88]/90 transition-colors">
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>send</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-white/20 text-xs">© 2024 ZINTTA Printing Solutions. Todos los derechos reservados.</p>
        <div className="flex gap-6 text-white/20 text-xs">
          {['Privacidad', 'Términos', 'Cookies'].map((item) => (
            <a key={item} href="#" className="hover:text-white transition-colors">{item}</a>
          ))}
        </div>
      </div>
    </footer>
  )
}
