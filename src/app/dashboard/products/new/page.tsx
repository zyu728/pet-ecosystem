'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { getOwnerShop, createProduct } from '@/lib/db/dashboard'
import Input from '@/components/ui/Input'
import Loading from '@/components/ui/Loading'

export default function NewProductPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [shopId, setShopId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name: '', category: 'food', price: '', delivery_available: false })

  useEffect(() => {
    if (!user) return
    getOwnerShop(user.id).then((s) => { if (s) setShopId(s.id); setLoading(false) })
  }, [user])

  const handleSubmit = async () => {
    if (!shopId) return
    await createProduct(shopId, {
      name: form.name, category: form.category as any, price: parseFloat(form.price) || 0,
      delivery_available: form.delivery_available, image: null,
    })
    router.push('/dashboard/products')
  }

  if (loading) return <Loading />

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => router.back()} className="text-gray-600">←</button>
        <h2 className="text-lg font-bold">添加商品</h2>
      </div>
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <Input label="商品名称" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">分类</label>
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none">
            <option value="food">食品</option><option value="supplies">用品</option><option value="medicine">药品</option><option value="service">服务</option>
          </select>
        </div>
        <Input label="价格 (¥)" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
        <label className="flex items-center gap-2 mb-4 text-sm"><input type="checkbox" checked={form.delivery_available} onChange={(e) => setForm({ ...form, delivery_available: e.target.checked })} /> 支持配送</label>
        <button onClick={handleSubmit} disabled={!form.name.trim()} className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium disabled:opacity-50">确认添加</button>
      </div>
    </div>
  )
}
