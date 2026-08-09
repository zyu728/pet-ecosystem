'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/hooks/useAuth'
import { getOwnerShop, createProduct, updateProduct, deleteProduct } from '@/lib/db/dashboard'
import { getShopProducts } from '@/lib/db/shops'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import Loading from '@/components/ui/Loading'
import type { Shop, ShopProduct } from '@/types'

export default function DashboardProductsPage() {
  const { user } = useAuth()
  const [shop, setShop] = useState<Shop | null>(null)
  const [products, setProducts] = useState<ShopProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', category: 'food' as string, price: '', delivery_available: false })

  const loadData = async () => {
    if (!user) return
    const s = await getOwnerShop(user.id)
    if (!s) { setLoading(false); return }
    setShop(s)
    const p = await getShopProducts(s.id)
    setProducts(p)
    setLoading(false)
  }

  useEffect(() => { loadData() }, [user])

  const openAdd = () => {
    setEditingId(null)
    setForm({ name: '', category: 'food', price: '', delivery_available: false })
    setShowModal(true)
  }

  const openEdit = (p: ShopProduct) => {
    setEditingId(p.id)
    setForm({ name: p.name, category: p.category, price: String(p.price), delivery_available: p.delivery_available })
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!shop) return
    const data = {
      name: form.name, category: form.category as any,
      price: parseFloat(form.price) || 0, delivery_available: form.delivery_available, image: null,
    }
    if (editingId) {
      await updateProduct(editingId, data)
    } else {
      await createProduct(shop.id, data)
    }
    setShowModal(false)
    loadData()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定删除？')) return
    await deleteProduct(id)
    loadData()
  }

  if (loading) return <Loading />

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">📦 商品管理</h2>
        <button onClick={openAdd} className="bg-orange-500 text-white px-4 py-1.5 rounded-full text-sm font-medium">+ 添加</button>
      </div>
      {products.length === 0 ? (
        <p className="text-gray-400 text-center py-10">暂无商品</p>
      ) : (
        <div className="space-y-3">
          {products.map((p) => (
            <div key={p.id} className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">{p.name}</p>
                <p className="text-xs text-gray-400">{p.category === 'food' ? '食品' : p.category === 'supplies' ? '用品' : p.category === 'medicine' ? '药品' : '服务'} · ¥{p.price} {p.delivery_available ? '· 🚚' : ''}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(p)} className="text-blue-500 text-sm">编辑</button>
                <button onClick={() => handleDelete(p.id)} className="text-red-500 text-sm">删除</button>
              </div>
            </div>
          ))}
        </div>
      )}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingId ? '编辑商品' : '添加商品'}>
        <Input label="商品名称" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">分类</label>
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none">
            <option value="food">食品</option><option value="supplies">用品</option><option value="medicine">药品</option><option value="service">服务</option>
          </select>
        </div>
        <Input label="价格 (¥)" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
        <label className="flex items-center gap-2 mb-4 text-sm"><input type="checkbox" checked={form.delivery_available} onChange={(e) => setForm({ ...form, delivery_available: e.target.checked })} /> 支持配送</label>
        <button onClick={handleSave} disabled={!form.name.trim()} className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium disabled:opacity-50">{editingId ? '保存修改' : '确认添加'}</button>
      </Modal>
    </div>
  )
}
