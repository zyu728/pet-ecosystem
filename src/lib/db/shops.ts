import { createClient } from '@/lib/supabase/client'
import type { Shop, ShopProduct, ShopFilter } from '@/types'

export async function getShops(filter: ShopFilter = 'all'): Promise<Shop[]> {
  const supabase = createClient()
  let query = supabase.from('shops').select('*')
  if (filter !== 'all') {
    query = query.eq('type', filter)
  }
  const { data, error } = await query.order('rating', { ascending: false })
  if (error) return []
  return data as Shop[]
}

export async function getShop(shopId: string): Promise<Shop | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('shops')
    .select('*')
    .eq('id', shopId)
    .single()
  if (error) return null
  return data as Shop
}

export async function getShopProducts(shopId: string): Promise<ShopProduct[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('shop_products')
    .select('*')
    .eq('shop_id', shopId)
  if (error) return []
  return data as ShopProduct[]
}

export async function searchShops(keyword: string): Promise<Shop[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('shops')
    .select('*')
    .ilike('name', `%${keyword}%`)
  if (error) return []
  return data as Shop[]
}
