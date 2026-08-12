import Link from 'next/link'
import type { Shop } from '@/types'

const typeLabels: Record<string, string> = { pet_shop: '宠物店', pet_hospital: '宠物医院', grooming: '美容洗护' }

function getDistanceText(shop: Shop): string | null {
  if (typeof window === 'undefined') return null
  const stored = localStorage.getItem('userLocation')
  if (!stored) return null
  try {
    const { lat, lng } = JSON.parse(stored)
    const R = 6371000
    const dLat = (shop.lat - lat) * Math.PI / 180
    const dLng = (shop.lng - lng) * Math.PI / 180
    const a = Math.sin(dLat/2)**2 + Math.cos(lat*Math.PI/180)*Math.cos(shop.lat*Math.PI/180)*Math.sin(dLng/2)**2
    const m = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    if (m < 1000) return `${Math.round(m)}m`
    return `${(m/1000).toFixed(1)}km`
  } catch { return null }
}

function isOpen(businessHours: string | null): boolean {
  if (!businessHours) return true
  try {
    const now = new Date()
    const currentMin = now.getHours() * 60 + now.getMinutes()
    const [start, end] = businessHours.split('-').map(t => {
      const [h, m] = t.trim().split(':').map(Number)
      return h * 60 + (m || 0)
    })
    return currentMin >= start && currentMin <= end
  } catch { return true }
}

export default function ShopCard({ shop }: { shop: Shop }) {
  const dist = getDistanceText(shop)
  const open = isOpen(shop.business_hours)

  return (
    <Link href={`/shops/${shop.id}`} className="block">
      <div className="bg-white rounded-card shadow-card p-4 flex gap-4 active:scale-[0.98] transition-all">
        <div className={`w-20 h-20 rounded-xl flex-shrink-0 flex items-center justify-center text-3xl ${shop.type === 'pet_hospital' ? 'bg-red-50' : shop.type === 'grooming' ? 'bg-purple-50' : 'bg-blue-50'}`}>
          {shop.type === 'pet_hospital' ? '🏥' : shop.type === 'grooming' ? '✂️' : '🏪'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900 truncate">{shop.name}</h3>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full flex-shrink-0 ${open ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>{open ? '🟢 营业' : '🔴 休息'}</span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            {typeLabels[shop.type]}
            {shop.rating > 0 && (
              <span className="ml-2 text-amber-500">{'⭐'.repeat(Math.round(shop.rating))} {shop.rating.toFixed(1)}</span>
            )}
          </p>
          <p className="text-sm text-gray-500 mt-1 truncate">{shop.address}</p>
          <div className="flex items-center gap-3 mt-1.5">
            {dist && <span className="text-xs text-blue-500">📍 {dist}</span>}
            {shop.phone && <span className="text-xs text-gray-400">📞 {shop.phone}</span>}
          </div>
        </div>
      </div>
    </Link>
  )
}
