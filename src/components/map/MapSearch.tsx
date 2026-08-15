'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { searchShops } from '@/lib/db/shops'
import { IconSearch } from '@/components/ui/Icons'
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
      <div className="bg-surface-card border border-line-hairline rounded-btn shadow-float flex items-center px-3.5 py-2.5">
        <IconSearch size={16} className="text-ink-muted mr-2 flex-shrink-0" />
        <input type="text" value={query} onChange={(e) => handleSearch(e.target.value)} placeholder="搜索宠物店、医院…" className="flex-1 outline-none text-sm text-ink-primary placeholder:text-ink-muted" onFocus={() => results.length > 0 && setShowResults(true)} onBlur={() => setTimeout(() => setShowResults(false), 200)} />
      </div>
      {showResults && results.length > 0 && (
        <div className="bg-surface-card rounded-btn shadow-float mt-2 max-h-48 overflow-y-auto divide-y divide-line-hairline">
          {results.map((shop) => (
            <button key={shop.id} onClick={() => router.push(`/shops/${shop.id}`)} className="w-full text-left px-4 py-3 hover:bg-surface-subtle transition-colors">
              <p className="font-medium text-[13px] text-ink-primary">{shop.name}</p>
              <p className="text-xs text-ink-muted truncate mt-0.5">{shop.address}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
