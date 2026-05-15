/** Número por defecto (Colombia +57). Puede sobrescribirse con VITE_WHATSAPP_NUMBER. */
const DEFAULT_NUMBER = '573173051118'

const RAW = (import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined) ?? ''
const ENV_NUMBER = RAW.replace(/\D/g, '')
const NUMBER = ENV_NUMBER || DEFAULT_NUMBER

export const isWhatsAppConfigured = (): boolean => NUMBER.length > 0

export function getWhatsAppNumber(): string {
  return NUMBER
}

/** Devuelve la URL de wa.me con un mensaje pre-rellenado. */
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

/** URL de contacto general — usada por los enlaces "Contáctanos". */
export function getWhatsAppContactUrl(): string | null {
  return getWhatsAppUrl('Hola ZINTTA, me gustaría ponerme en contacto con ustedes.')
}
