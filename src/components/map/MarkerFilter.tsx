'use client'

import type { ShopFilter } from '@/types'

const filters: { value: ShopFilter; label: string }[] = [
  { value: 'all', label: '全部' }, { value: 'pet_shop', label: '🏪 宠物店' }, { value: 'pet_hospital', label: '🏥 医院' }, { value: 'grooming', label: '✂️ 美容' },
]

export default function MarkerFilter({ current, onChange }: { current: ShopFilter; onChange: (f: ShopFilter) => void }) {
  return (
    <div className="absolute bottom-20 left-3 right-3 z-10">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {filters.map((f) => (
          <button key={f.value} onClick={() => onChange(f.value)} className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${current === f.value ? 'bg-orange-500 text-white shadow-lg' : 'bg-white text-gray-600 shadow'}`}>{f.label}</button>
        ))}
      </div>
    </div>
  )
}
