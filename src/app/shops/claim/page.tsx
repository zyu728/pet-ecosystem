'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { getUnclaimedShops, claimShop, registerShop } from '@/lib/db/dashboard'
import Loading from '@/components/ui/Loading'
import type { Shop } from '@/types'

export default function ClaimPage() {
  const { user, profile, loading: authLoading } = useAuth()
  const router = useRouter()
  const [unclaimed, setUnclaimed] = useState<Shop[]>([])
  const [loading, setLoading] = useState(true)
  const [mode, setMode] = useState<'choose' | 'register'>('choose')
  const [claiming, setClaiming] = useState(false)
  const [form, setForm] = useState({
    name: '', type: 'pet_shop' as string, address: '', lat: '34.414', lng: '115.656',
    phone: '', business_hours: '09:00-20:00', description: '',
  })

  useEffect(() => {
    if (!user) return
    getUnclaimedShops().then((s) => { setUnclaimed(s); setLoading(false) })
  }, [user])

  if (authLoading || loading) return <Loading />
  if (!user) { router.push('/auth/login'); return null }
  if (profile?.role === 'shop_owner') { router.push('/dashboard'); return null }

  const handleClaim = async (shopId: string) => {
    setClaiming(true)
    const ok = await claimShop(user.id, shopId)
    if (ok) { window.location.href = '/dashboard' }
    else { alert('认领失败，可能已被他人认领'); setClaiming(false) }
  }

  const handleRegister = async () => {
    if (!form.name.trim()) return
    setClaiming(true)
    await registerShop(user.id, {
      name: form.name, type: form.type as any, address: form.address,
      lat: parseFloat(form.lat), lng: parseFloat(form.lng), phone: form.phone || null,
      business_hours: form.business_hours || null, description: form.description || null,
      cover_image: null,
    })
    window.location.href = '/dashboard'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 bg-white z-10 px-4 py-3 border-b flex items-center gap-3">
        <button onClick={() => router.back()} className="text-gray-600">←</button>
        <h1 className="text-lg font-bold">店铺入驻</h1>
      </div>

      <div className="p-4">
        <div className="flex mb-4 bg-white rounded-xl p-1 shadow-sm">
          <button onClick={() => setMode('choose')} className={`flex-1 py-2 rounded-lg text-sm font-medium ${mode === 'choose' ? 'bg-orange-500 text-white' : 'text-gray-500'}`}>认领已有店铺</button>
          <button onClick={() => setMode('register')} className={`flex-1 py-2 rounded-lg text-sm font-medium ${mode === 'register' ? 'bg-orange-500 text-white' : 'text-gray-500'}`}>创建新店铺</button>
        </div>

        {mode === 'choose' ? (
          <div>
            <p className="text-sm text-gray-500 mb-3">选择一个未认领的店铺，一键成为店主：</p>
            {unclaimed.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-400 mb-3">暂无可认领的店铺</p>
                <button onClick={() => setMode('register')} className="text-orange-500 font-medium">→ 去创建新店铺</button>
              </div>
            ) : (
              <div className="space-y-3">
                {unclaimed.map((shop) => (
                  <div key={shop.id} className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{shop.name}</p>
                      <p className="text-xs text-gray-400">{shop.address}</p>
                    </div>
                    <button onClick={() => handleClaim(shop.id)} disabled={claiming} className="bg-orange-500 text-white px-4 py-1.5 rounded-full text-sm font-medium disabled:opacity-50">
                      {claiming ? '处理中' : '认领'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-5">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">店铺名称 *</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">类型</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none">
                <option value="pet_shop">宠物店</option><option value="pet_hospital">宠物医院</option><option value="grooming">美容洗护</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">地址 *</label>
              <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">纬度</label>
                <input value={form.lat} onChange={(e) => setForm({ ...form, lat: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">经度</label>
                <input value={form.lng} onChange={(e) => setForm({ ...form, lng: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none text-sm" />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">电话</label>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">营业时间</label>
              <input value={form.business_hours} onChange={(e) => setForm({ ...form, business_hours: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">简介</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none text-sm" />
            </div>
            <button onClick={handleRegister} disabled={claiming || !form.name.trim() || !form.address.trim()} className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium disabled:opacity-50">
              {claiming ? '创建中...' : '🏪 创建店铺并入驻'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
