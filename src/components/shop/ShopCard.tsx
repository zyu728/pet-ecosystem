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

function StarRating({ rating }: { rating: number }) {
  const full = Math.round(rating)
  return (
    <span className="text-status-warning text-xs tabular" aria-label={`评分 ${rating}`}>
      {'★'.repeat(full)}<span className="text-ink-faint">{'★'.repeat(5 - full)}</span>
      <span className="ml-1 text-ink-secondary">{rating.toFixed(1)}</span>
    </span>
  )
}

export default function ShopCard({ shop }: { shop: Shop }) {
  const dist = getDistanceText(shop)
  const open = isOpen(shop.business_hours)

  return (
    <Link href={`/shops/${shop.id}`} className="block">
      <div className="card p-3.5 press flex items-center gap-3.5">
        <div className={`w-12 h-12 rounded-btn flex-shrink-0 flex items-center justify-center text-xl ${shop.type === 'pet_hospital' ? 'bg-red-50' : shop.type === 'grooming' ? 'bg-purple-50' : 'bg-blue-50'}`}>
          {shop.type === 'pet_hospital' ? '🏥' : shop.type === 'grooming' ? '✂️' : '🏪'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold tracking-tight text-ink-primary truncate">{shop.name}</h3>
            <span className={`flex-shrink-0 w-1.5 h-1.5 rounded-full ${open ? 'bg-status-success' : 'bg-ink-faint'}`} aria-label={open ? '营业中' : '休息中'} />
          </div>
          <p className="text-xs text-ink-muted mt-0.5">
            {typeLabels[shop.type]}
            {shop.rating > 0 && <span className="ml-1.5"><StarRating rating={shop.rating} /></span>}
          </p>
          <p className="text-xs text-ink-secondary mt-1 truncate">{shop.address}</p>
        </div>
        <div className="text-right flex-shrink-0">
          {dist && <p className="text-xs font-medium text-ink-secondary tabular">📍 {dist}</p>}
          <p className={`text-[10px] mt-0.5 ${open ? 'text-status-success' : 'text-ink-muted'}`}>{open ? '营业中' : '休息中'}</p>
        </div>
      </div>
    </Link>
  )
}
