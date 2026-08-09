import Link from 'next/link'
import type { Shop } from '@/types'

const typeLabels: Record<string, string> = { pet_shop: '宠物店', pet_hospital: '宠物医院', grooming: '美容洗护' }

export default function ShopCard({ shop }: { shop: Shop }) {
  return (
    <Link href={`/shops/${shop.id}`} className="block">
      <div className="shop-card flex gap-4">
        <div className="w-20 h-20 rounded-xl bg-gray-100 flex-shrink-0 flex items-center justify-center text-3xl">
          {shop.type === 'pet_hospital' ? '🏥' : shop.type === 'grooming' ? '✂️' : '🏪'}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{shop.name}</h3>
          <p className="text-xs text-gray-400 mt-0.5">{typeLabels[shop.type]}{shop.rating > 0 && <span className="ml-2">⭐ {shop.rating.toFixed(1)}</span>}</p>
          <p className="text-sm text-gray-500 mt-1 truncate">{shop.address}</p>
          {shop.business_hours && <p className="text-xs text-gray-400 mt-0.5">🕐 {shop.business_hours}</p>}
        </div>
      </div>
    </Link>
  )
}
