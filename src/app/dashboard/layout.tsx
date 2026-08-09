'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { getOwnerShop } from '@/lib/db/dashboard'
import Sidebar from '@/components/dashboard/Sidebar'
import Loading from '@/components/ui/Loading'
import Link from 'next/link'
import type { Shop } from '@/types'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, loading: authLoading } = useAuth()
  const [shop, setShop] = useState<Shop | null>(null)
  const [shopLoading, setShopLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!user) return
    getOwnerShop(user.id).then((s) => { setShop(s); setShopLoading(false) })
  }, [user])

  if (authLoading) return <Loading />
  if (!user) { router.push('/auth/login'); return null }

  if (shopLoading) return <Loading />

  if (!shop) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <p className="text-5xl mb-4">🏪</p>
        <p className="text-gray-600 font-semibold text-lg mb-1">你还没有店铺</p>
        <p className="text-gray-400 text-sm mb-6 text-center">认领一个已有店铺或创建新店铺，开始线上经营</p>
        <Link href="/shops/claim" className="bg-orange-500 text-white px-6 py-3 rounded-full font-medium">立即入驻</Link>
        <Link href="/map" className="text-gray-400 text-sm mt-4">返回首页</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar shopName={shop.name} />
      <div className="p-4">{children}</div>
    </div>
  )
}
