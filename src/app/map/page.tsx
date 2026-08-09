'use client'

import { useState } from 'react'
import TabBar from '@/components/layout/TabBar'
import PetMap from '@/components/map/PetMap'
import MapSearch from '@/components/map/MapSearch'
import MarkerFilter from '@/components/map/MarkerFilter'
import type { ShopFilter, MarkerType } from '@/types'

export default function MapPage() {
  const [filter, setFilter] = useState<ShopFilter>('all')

  return (
    <>
      <div className="relative w-full h-[calc(100vh-56px)]">
        <PetMap filter={filter} />
        <MapSearch />
        <MarkerFilter current={filter} onChange={setFilter} />
      </div>
      <TabBar />
    </>
  )
}
