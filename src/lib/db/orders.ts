import { createClient } from '@/lib/supabase/client'
import type { Order, OrderItem } from '@/types'

export async function getMyOrders(userId: string): Promise<Order[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('buyer_id', userId)
    .order('created_at', { ascending: false })
  if (error) return []
  return data as Order[]
}

export async function createOrder(
  buyerId: string,
  shopId: string,
  items: OrderItem[],
  totalAmount: number,
  deliveryAddress: string,
  deliveryMethod: string = 'delivery'
): Promise<Order | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('orders')
    .insert({
      buyer_id: buyerId,
      shop_id: shopId,
      items: items as any,
      total_amount: totalAmount,
      delivery_address: deliveryAddress,
      delivery_method: deliveryMethod,
      status: 'pending',
    })
    .select()
    .single()
  if (error) return null
  return data as Order
}
