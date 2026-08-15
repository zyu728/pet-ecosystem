'use client'

import { useState, useEffect } from 'react'
import TabBar from '@/components/layout/TabBar'
import ShopCard from '@/components/shop/ShopCard'
import EmptyState from '@/components/ui/EmptyState'
import Loading from '@/components/ui/Loading'
import { getShops, searchShops } from '@/lib/db/shops'
import type { Shop, ShopFilter } from '@/types'

const categories: { value: ShopFilter; label: string }[] = [
  { value: 'all', label: '全部' }, { value: 'pet_shop', label: '宠物店' }, { value: 'pet_hospital', label: '宠物医院' }, { value: 'grooming', label: '美容洗护' },
]

export default function DiscoverPage() {
  const [activeFilter, setActiveFilter] = useState<ShopFilter>('all')
  const [sortBy, setSortBy] = useState<'distance' | 'rating'>('distance')
  const [shops, setShops] = useState<Shop[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    setLoading(true)
    getShops(activeFilter).then((data) => { setShops(data); setLoading(false) })
  }, [activeFilter])

  // Track user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => localStorage.setItem('userLocation', JSON.stringify({ lat: pos.coords.latitude, lng: pos.coords.longitude }))
      )
    }
  }, [])

  const handleSearch = async (q: string) => {
    setSearch(q)
    if (q.length >= 1) {
      const results = await searchShops(q)
      setShops(results)
    } else {
      getShops(activeFilter).then(setShops)
    }
  }

  const sorted = [...shops].sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating
    return 0 // distance sorting done in ShopCard
  })

  return (
    <>
      <div className="pb-14">
        <div className="page-header">
          <h1 className="text-[17px] font-semibold tracking-tight mb-3">发现</h1>
          <div className="flex gap-2 mb-2.5">
            <input type="text" value={search} onChange={(e) => handleSearch(e.target.value)} placeholder="搜索店铺…" className="flex-1 bg-surface-subtle rounded-btn px-3.5 py-2 text-[13px] outline-none text-ink-primary placeholder:text-ink-muted" />
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="bg-surface-subtle rounded-btn px-3 py-2 text-[13px] outline-none text-ink-secondary border-0">
              <option value="distance">距离最近</option>
              <option value="rating">评分最高</option>
            </select>
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-0.5">
            {categories.map((cat) => (
              <button key={cat.value} onClick={() => setActiveFilter(cat.value)} className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-colors duration-150 border ${activeFilter === cat.value ? 'bg-ink-primary text-white border-ink-primary' : 'bg-surface-card text-ink-secondary border-line-hairline'}`}>{cat.label}</button>
            ))}
          </div>
        </div>
        <div className="px-4 space-y-3 mt-3">
          {loading ? <Loading /> : sorted.length === 0 ? <EmptyState icon="🔍" title="暂无店铺" description="换个关键词试试" /> : sorted.map((shop) => <ShopCard key={shop.id} shop={shop} />)}
        </div>
      </div>
      <TabBar />
    </>
  )
}
