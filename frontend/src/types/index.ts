export interface Product {
  id: string
  name: string
  description: string
  price: string
  badge?: string
  image: string
  colors: string[]
  category: 'packaging' | 'editorial' | 'marketing' | 'lujo'
}

export type PrintLocation = 'FRONT' | 'BACK' | 'SLEEVE'

export type ProductColor = {
  label: string
  value: string
  tailwindClass: string
}

export type ProductSize = 'S' | 'M' | 'L' | 'XL' | '2XL'

export interface OrderConfig {
  productId: string
  productName: string
  color: string
  size: ProductSize
  printLocation: PrintLocation
  uploadedDesign: string | null
  quantity: number
}
