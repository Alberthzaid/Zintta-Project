import { getWhatsAppDefaultUrl } from '../../lib/whatsapp'

export default function WhatsAppFab() {
  const url = getWhatsAppDefaultUrl()
  if (!url) return null
  return (
    <a
      data-testid="whatsapp-fab"
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 z-[100] bg-[#25D366] text-white size-16 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform fuchsia-glow"
    >
      <span className="material-symbols-outlined" style={{ fontSize: '30px' }}>chat</span>
    </a>
  )
}
