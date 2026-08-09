'use client'

import { useState, useEffect } from 'react'
import TabBar from '@/components/layout/TabBar'
import ShopCard from '@/components/shop/ShopCard'
import Loading from '@/components/ui/Loading'
import { getShops } from '@/lib/db/shops'
import type { Shop, ShopFilter } from '@/types'

const categories: { value: ShopFilter; label: string }[] = [
  { value: 'all', label: '全部' }, { value: 'pet_shop', label: '宠物店' }, { value: 'pet_hospital', label: '宠物医院' }, { value: 'grooming', label: '美容洗护' },
]

export default function DiscoverPage() {
  const [activeFilter, setActiveFilter] = useState<ShopFilter>('all')
  const [shops, setShops] = useState<Shop[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { setLoading(true); getShops(activeFilter).then((data) => { setShops(data); setLoading(false) }) }, [activeFilter])

  return (
    <>
      <div className="pb-14">
        <div className="sticky top-0 bg-white z-10 px-4 pt-4 pb-2">
          <h1 className="text-xl font-bold mb-3">🔍 发现</h1>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button key={cat.value} onClick={() => setActiveFilter(cat.value)} className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${activeFilter === cat.value ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'}`}>{cat.label}</button>
            ))}
          </div>
        </div>
        <div className="px-4 space-y-3">
          {loading ? <Loading /> : shops.length === 0 ? <p className="text-gray-400 text-center py-20">暂无店铺数据</p> : shops.map((shop) => <ShopCard key={shop.id} shop={shop} />)}
        </div>
      </div>
      <TabBar />
    </>
  )
}
