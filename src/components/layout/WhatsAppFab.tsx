export default function WhatsAppFab() {
  return (
    <a
      href="https://wa.me/yournumber"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 z-[100] bg-[#25D366] text-white size-16 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform fuchsia-glow"
    >
      <span className="material-symbols-outlined" style={{ fontSize: '30px' }}>chat</span>
    </a>
  )
}
