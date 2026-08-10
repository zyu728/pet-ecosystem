'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/hooks/useAuth'
import { getOwnerShop, updateShopInfo } from '@/lib/db/dashboard'
import Input from '@/components/ui/Input'
import Loading from '@/components/ui/Loading'
import type { Shop } from '@/types'

export default function DashboardInfoPage() {
  const { user } = useAuth()
  const [shop, setShop] = useState<Shop | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', address: '', business_hours: '', description: '', payment_qr: '' })

  useEffect(() => {
    if (!user) return
    getOwnerShop(user.id).then((s) => {
      if (s) {
        setShop(s)
        setForm({ name: s.name, phone: s.phone || '', address: s.address, business_hours: s.business_hours || '', description: s.description || '', payment_qr: s.payment_qr || '' })
      }
      setLoading(false)
    })
  }, [user])

  const handleSave = async () => {
    if (!shop) return
    setSaving(true)
    await updateShopInfo(shop.id, form)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (loading) return <Loading />

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">🏪 店铺信息</h2>
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <Input label="店铺名称" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <Input label="联系电话" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <Input label="地址" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        <Input label="营业时间" value={form.business_hours} onChange={(e) => setForm({ ...form, business_hours: e.target.value })} placeholder="如：09:00-20:00" />
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">简介</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-orange-400 text-sm" />
        </div>
        <Input label="收款码图片URL" value={form.payment_qr} onChange={(e) => setForm({ ...form, payment_qr: e.target.value })} placeholder="上传到图床后粘贴链接" />
        {form.payment_qr && <img src={form.payment_qr} alt="收款码" className="w-40 h-40 object-contain mx-auto mb-4 rounded-xl border" />}
        <button onClick={handleSave} disabled={saving} className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium disabled:opacity-50">
          {saving ? '保存中...' : saved ? '✅ 已保存' : '保存修改'}
        </button>
      </div>
    </div>
  )
}
