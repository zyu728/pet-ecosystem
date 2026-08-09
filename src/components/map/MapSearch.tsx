'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { searchShops } from '@/lib/db/shops'
import type { Shop } from '@/types'

export default function MapSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Shop[]>([])
  const [showResults, setShowResults] = useState(false)
  const router = useRouter()

  const handleSearch = async (value: string) => {
    setQuery(value)
    if (value.length >= 1) { const shops = await searchShops(value); setResults(shops); setShowResults(true) }
    else { setResults([]); setShowResults(false) }
  }

  return (
    <div className="absolute top-3 left-3 right-3 z-10">
      <div className="bg-white rounded-xl shadow-lg flex items-center px-4 py-2.5">
        <span className="text-gray-400 mr-2">🔍</span>
        <input type="text" value={query} onChange={(e) => handleSearch(e.target.value)} placeholder="搜索宠物店、医院..." className="flex-1 outline-none text-sm text-gray-900" onFocus={() => results.length > 0 && setShowResults(true)} onBlur={() => setTimeout(() => setShowResults(false), 200)} />
      </div>
      {showResults && results.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg mt-2 max-h-48 overflow-y-auto">
          {results.map((shop) => (
            <button key={shop.id} onClick={() => router.push(`/shops/${shop.id}`)} className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b last:border-b-0">
              <p className="font-medium text-sm">{shop.name}</p>
              <p className="text-xs text-gray-400">{shop.address}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
