import { createClient } from '@/lib/supabase/client'
import type { Shop, ShopProduct, Order } from '@/types'

export async function getOwnerShop(ownerId: string): Promise<Shop | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('shops').select('*').eq('owner_id', ownerId).single()
  if (error) return null
  return data as Shop
}

export async function updateShopInfo(
  shopId: string,
  updates: Partial<Pick<Shop, 'name' | 'address' | 'phone' | 'business_hours' | 'description' | 'lat' | 'lng'>>
): Promise<Shop | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('shops').update(updates).eq('id', shopId).select().single()
  if (error) return null
  return data as Shop
}

export async function claimShop(userId: string, shopId: string): Promise<boolean> {
  const supabase = createClient()
  const { error: shopError } = await supabase
    .from('shops').update({ owner_id: userId }).eq('id', shopId).is('owner_id', null)
  if (shopError) return false

  const { error: profileError } = await supabase
    .from('profiles').update({ role: 'shop_owner' }).eq('id', userId)
  return !profileError
}

export async function registerShop(
  userId: string,
  shopData: Omit<Shop, 'id' | 'owner_id' | 'rating' | 'created_at'>
): Promise<Shop | null> {
  const supabase = createClient()
  const { data: shop, error: shopError } = await supabase
    .from('shops').insert({ ...shopData, owner_id: userId, rating: 0 }).select().single()
  if (shopError) return null

  await supabase.from('profiles').update({ role: 'shop_owner' }).eq('id', userId)
  return shop as Shop
}

export async function getUnclaimedShops(): Promise<Shop[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('shops').select('*').is('owner_id', null).order('name')
  if (error) return []
  return data as Shop[]
}

export async function createProduct(
  shopId: string,
  product: Omit<ShopProduct, 'id' | 'shop_id' | 'created_at'>
): Promise<ShopProduct | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('shop_products').insert({ ...product, shop_id: shopId }).select().single()
  if (error) return null
  return data as ShopProduct
}

export async function updateProduct(
  productId: string,
  updates: Partial<Pick<ShopProduct, 'name' | 'category' | 'price' | 'image' | 'delivery_available'>>
): Promise<ShopProduct | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('shop_products').update(updates).eq('id', productId).select().single()
  if (error) return null
  return data as ShopProduct
}

export async function deleteProduct(productId: string): Promise<boolean> {
  const supabase = createClient()
  const { error } = await supabase.from('shop_products').delete().eq('id', productId)
  return !error
}

export async function getShopOrders(shopId: string): Promise<Order[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('orders').select('*').eq('shop_id', shopId).order('created_at', { ascending: false })
  if (error) return []
  return data as Order[]
}

export async function updateOrderStatus(
  orderId: string,
  status: 'confirmed' | 'delivering' | 'done'
): Promise<boolean> {
  const supabase = createClient()
  const { error } = await supabase.from('orders').update({ status }).eq('id', orderId)
  return !error
}
