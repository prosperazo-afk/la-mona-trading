export const CATEGORIES = [
  'Electrónicos',
  'Hogar y decoración',
  'Cosméticos y salud',
  'Calzado',
  'Juguetes y niños',
  'Deportes y outdoor',
  'Maquinaria',
  'Vehículos y food trucks',
  'Ferretería e insumos',
  'Otra',
] as const

export type Category = (typeof CATEGORIES)[number]

export interface Provider {
  id: string
  user_id: string
  name: string
  category: Category
  city_province: string | null
  products: string | null
  contact: string | null
  moq: string | null
  production_time: string | null
  rating: number | null
  website_url: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export type ProviderFormData = Omit<Provider, 'id' | 'user_id' | 'created_at' | 'updated_at'>

export type ExtractedCard = Partial<Pick<Provider, 'name' | 'city_province' | 'products' | 'contact' | 'website_url'>>
