// ===== 数据库行类型 =====

export type ShopType = 'pet_shop' | 'pet_hospital' | 'grooming'

export interface Profile {
  id: string
  nickname: string | null
  avatar_url: string | null
  phone: string | null
  is_subscribed: boolean
  lat: number | null
  lng: number | null
  created_at: string
}

export interface Pet {
  id: string
  owner_id: string
  name: string
  species: 'dog' | 'cat' | 'other'
  breed: string | null
  age: number | null
  gender: 'male' | 'female' | null
  weight: number | null
  avatar_url: string | null
  photos: string[]
  vaccine_records: VaccineRecord[]
  allergies: string | null
  created_at: string
}

export interface VaccineRecord {
  name: string
  date: string
  next_date?: string
}

export interface Shop {
  id: string
  name: string
  type: ShopType
  address: string
  lat: number
  lng: number
  phone: string | null
  business_hours: string | null
  rating: number
  cover_image: string | null
  description: string | null
  created_at: string
}

export interface ShopProduct {
  id: string
  shop_id: string
  name: string
  category: 'food' | 'supplies' | 'medicine' | 'service'
  price: number
  image: string | null
  delivery_available: boolean
  created_at: string
}

export interface TrackingCollar {
  id: string
  owner_id: string
  pet_id: string
  device_serial: string
  battery_level: number
  last_ping_at: string | null
  created_at: string
}

export interface TrackingRecord {
  id: string
  collar_id: string
  lat: number
  lng: number
  recorded_at: string
}

export interface Conversation {
  id: string
  participant_1: string
  participant_2: string
  last_message_at: string
  created_at: string
}

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  image_url: string | null
  created_at: string
}

export interface Order {
  id: string
  buyer_id: string
  shop_id: string
  items: OrderItem[]
  total_amount: number
  status: 'pending' | 'confirmed' | 'delivering' | 'done'
  delivery_address: string
  created_at: string
}

export interface OrderItem {
  product_id: string
  product_name: string
  quantity: number
  price: number
}

// ===== 地图相关类型 =====

export type MarkerType = 'hospital' | 'shop' | 'pet'

export interface MapMarker {
  id: string
  type: MarkerType
  lat: number
  lng: number
  name: string
  info?: string
}

// ===== 筛选类型 =====

export type ShopFilter = 'all' | 'pet_shop' | 'pet_hospital' | 'grooming'
