import { supabase } from './supabase'

/** Bucket de Storage en Supabase */
export const PRODUCT_IMAGES_BUCKET = 'assets'
/** Carpeta dentro del bucket: `products/…` */
export const PRODUCT_IMAGES_FOLDER = 'products'

const MAX_BYTES = 5 * 1024 * 1024
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])

function extensionFor(file: File): string {
  if (file.type === 'image/png') return 'png'
  if (file.type === 'image/webp') return 'webp'
  if (file.type === 'image/gif') return 'gif'
  return 'jpg'
}

export function validateProductImageFile(file: File): string | null {
  if (!ALLOWED_TYPES.has(file.type))
    return 'Formato no permitido. Usa JPG, PNG, WebP o GIF.'
  if (file.size > MAX_BYTES) return 'El archivo supera 5 MB.'
  return null
}

/**
 * Sube una imagen a Storage (`assets` / `products/…`) y devuelve la URL pública.
 * Requiere políticas RLS en el bucket que permitan INSERT al rol que uses (p. ej. usuarios autenticados).
 */
export async function uploadProductImage(file: File): Promise<string> {
  const validation = validateProductImageFile(file)
  if (validation) throw new Error(validation)

  const ext = extensionFor(file)
  const path = `${PRODUCT_IMAGES_FOLDER}/${crypto.randomUUID()}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from(PRODUCT_IMAGES_BUCKET)
    .upload(path, file, {
      cacheControl: '31536000',
      upsert: false,
      contentType: file.type || `image/${ext}`,
    })

  if (uploadError) throw new Error(uploadError.message)

  const { data } = supabase.storage.from(PRODUCT_IMAGES_BUCKET).getPublicUrl(path)
  return data.publicUrl
}
