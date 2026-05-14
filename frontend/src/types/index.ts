export interface Product {
  id: string
  name: string
  description: string
  price: string
  badge?: string
  image: string
  colors: string[]
  category: string
}

export type PrintLocation = 'FRONT' | 'BACK' | 'SLEEVE'

export type ProductColor = {
  label: string
  value: string
  tailwindClass: string
}

// Free-form so sizes from the DB (S-M, L-XL, 10-12, 2XL, …) all fit.
export type ProductSize = string

export interface OrderConfig {
  productId: string
  productName: string
  color: string
  size: ProductSize
  printLocation: PrintLocation
  uploadedDesign: string | null
  quantity: number
}
