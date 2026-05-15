
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
