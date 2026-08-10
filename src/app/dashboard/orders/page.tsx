'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/hooks/useAuth'
import { getOwnerShop, getShopOrders, updateOrderStatus } from '@/lib/db/dashboard'
import Loading from '@/components/ui/Loading'
import type { Shop, Order } from '@/types'

const statusLabels: Record<string, { label: string; color: string; next?: string }> = {
  pending: { label: '待确认', color: 'text-yellow-500', next: 'confirmed' },
  confirmed: { label: '已确认', color: 'text-blue-500', next: 'delivering' },
  delivering: { label: '配送中', color: 'text-purple-500', next: 'done' },
  done: { label: '已完成', color: 'text-green-500' },
}

const payLabels: Record<string, string> = { unpaid: '未付', paid: '已付', confirmed: '已确认' }

export default function DashboardOrdersPage() {
  const { user } = useAuth()
  const [shop, setShop] = useState<Shop | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    if (!user) return
    const s = await getOwnerShop(user.id)
    if (!s) { setLoading(false); return }
    setShop(s)
    const o = await getShopOrders(s.id)
    setOrders(o)
    setLoading(false)
  }

  useEffect(() => { loadData() }, [user])

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    await updateOrderStatus(orderId, newStatus as any)
    loadData()
  }

  if (loading) return <Loading />

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">📋 订单管理</h2>
      {orders.length === 0 ? (
        <p className="text-gray-400 text-center py-10">暂无订单</p>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const status = statusLabels[order.status]
            return (
              <div key={order.id} className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-400">{new Date(order.created_at).toLocaleString()}</span>
                  <div className="flex gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded ${(order as any).payment_status === 'paid' ? 'bg-green-100 text-green-600' : (order as any).payment_status === 'confirmed' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>💰 {payLabels[(order as any).payment_status || 'unpaid']}</span>
                    <span className={`text-xs font-medium ${status?.color}`}>{status?.label}</span>
                  </div>
                </div>
                {(order.items as any[]).map((item: any, i: number) => (
                  <p key={i} className="text-sm text-gray-700">{item.product_name} x{item.quantity} · ¥{item.price}</p>
                ))}
                <div className="border-t mt-2 pt-2 flex justify-between items-center">
                  <span className="font-bold text-orange-500">¥{order.total_amount}</span>
                  <div className="flex gap-2">
                    {(order as any).payment_status === 'paid' && (
                      <button onClick={() => updateOrderStatus(order.id, 'confirmed').then(loadData)} className="bg-green-500 text-white text-xs px-3 py-1 rounded-full font-medium">确认收款</button>
                    )}
                    {status?.next && (order as any).payment_status !== 'unpaid' && (
                      <button onClick={() => handleStatusChange(order.id, status.next!)} className="bg-orange-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                        → {statusLabels[status.next!].label}
                      </button>
                    )}
                  </div>
                </div>
                {order.delivery_address && <p className="text-xs text-gray-400 mt-1">📍 {order.delivery_address}</p>}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
