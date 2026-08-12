'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { getMyOrders } from '@/lib/db/orders'
import EmptyState from '@/components/ui/EmptyState'
import Loading from '@/components/ui/Loading'
import type { Order } from '@/types'

const statusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: '待确认', color: 'text-yellow-500' },
  confirmed: { label: '已确认', color: 'text-blue-500' },
  delivering: { label: '配送中', color: 'text-purple-500' },
  done: { label: '已完成', color: 'text-green-500' },
}

export default function OrdersPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => { if (!user) return; getMyOrders(user.id).then((data) => { setOrders(data); setLoading(false) }) }, [user])

  if (loading) return <Loading />
  if (!user) { router.push('/auth/login'); return null }

  return (
    <div>
      <div className="sticky top-0 bg-white z-10 px-4 py-3 border-b flex items-center gap-3">
        <button onClick={() => router.back()} className="text-gray-600">←</button>
        <h1 className="text-lg font-bold">📦 我的订单</h1>
      </div>
      {orders.length === 0 ? (
        <EmptyState icon="📦" title="暂无订单" />
      ) : (
        <div className="px-4 py-3 space-y-3">
          {orders.map((order) => {
            const status = statusLabels[order.status]
            return (
              <div key={order.id} className="bg-white border border-gray-100 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-400">{new Date(order.created_at).toLocaleString()}</span>
                  <span className={`text-xs font-medium ${status?.color}`}>{status?.label}</span>
                </div>
                {(order.items as any[]).map((item: any, i: number) => (
                  <div key={i} className="flex justify-between text-sm py-1"><span>{item.product_name} x{item.quantity}</span><span className="text-gray-500">¥{item.price}</span></div>
                ))}
                <div className="border-t mt-2 pt-2 flex justify-between"><span className="text-sm text-gray-500">合计</span><span className="font-bold text-orange-500">¥{order.total_amount}</span></div>
                {order.delivery_address && <p className="text-xs text-gray-400 mt-1">📍 {order.delivery_address}</p>}
                {(order as any).tracking_number && <p className="text-xs text-blue-500 mt-1">📦 运单号: {(order as any).tracking_number}</p>}
                {(order as any).estimated_time && <p className="text-xs text-green-500 mt-1">⏱ 预计: {(order as any).estimated_time}</p>}
                <p className="text-xs text-gray-400 mt-1">
                  {((order as any).delivery_method === 'pickup' ? '🏪 自取' : (order as any).delivery_method === 'express' ? '📦 快递' : '🚚 配送')}
                  {' · '}{((order as any).payment_status === 'paid' ? '已付款' : (order as any).payment_status === 'confirmed' ? '已确认' : '未付款')}
                </p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
