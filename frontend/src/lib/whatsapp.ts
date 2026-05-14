const RAW = import.meta.env.VITE_WHATSAPP_NUMBER ?? ''
const NUMBER = RAW.replace(/\D/g, '')

export const isWhatsAppConfigured = (): boolean => NUMBER.length > 0

export function getWhatsAppUrl(message: string): string | null {
  if (!NUMBER) return null
  return `https://wa.me/${NUMBER}?text=${encodeURIComponent(message)}`
}

/**
 * Default URL with a generic greeting — used by the floating FAB.
 */
export function getWhatsAppDefaultUrl(): string | null {
  return getWhatsAppUrl(
    'Hola ZINTTA, me interesa conocer más sobre sus prendas premium.'
  )
}
