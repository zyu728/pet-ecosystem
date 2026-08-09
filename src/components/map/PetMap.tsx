'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { useAMap } from '@/lib/hooks/useAMap'
import { getShops } from '@/lib/db/shops'
import { getOnlinePets } from '@/lib/db/profiles'
import type { Shop, Profile, MarkerType } from '@/types'
import { useRouter } from 'next/navigation'
import { SHANGQIU_CENTER } from '@/lib/utils/helpers'

export default function PetMap({ onMarkerClick, filter = 'all' }: { onMarkerClick?: (type: MarkerType, id: string) => void; filter?: string }) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const { loaded, error: mapError } = useAMap()
  const [shops, setShops] = useState<Shop[]>([])
  const [onlinePets, setOnlinePets] = useState<Profile[]>([])
  const router = useRouter()

  useEffect(() => { getShops().then(setShops); getOnlinePets().then(setOnlinePets) }, [])

  useEffect(() => {
    if (!loaded || !mapRef.current) return
    const AMap = window.AMap
    mapInstance.current = new AMap.Map(mapRef.current, { zoom: 13, center: SHANGQIU_CENTER, mapStyle: 'amap://styles/light' })
    mapInstance.current.plugin('AMap.Geolocation', function () {
      mapInstance.current.addControl(new AMap.Geolocation({ enableHighAccuracy: true, timeout: 10000, buttonPosition: 'RB', buttonOffset: [10, 70], zoomToAccuracy: true }))
    })
    return () => { mapInstance.current?.destroy() }
  }, [loaded])

  const clearMarkers = useCallback(() => { markersRef.current.forEach((m) => m.setMap(null)); markersRef.current = [] }, [])

  const createIcon = useCallback((type: MarkerType): string => {
    const colors: Record<MarkerType, string> = { hospital: '#F44336', shop: '#2196F3', pet: '#4CAF50' }
    const emoji: Record<MarkerType, string> = { hospital: '🏥', shop: '🏪', pet: '🐾' }
    return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="36" height="44" viewBox="0 0 36 44"><circle cx="18" cy="16" r="14" fill="${colors[type]}" opacity="0.9"/><text x="18" y="21" text-anchor="middle" font-size="16">${emoji[type]}</text><polygon points="18,40 8,26 28,26" fill="${colors[type]}" opacity="0.9"/></svg>`)}`
  }, [])

  useEffect(() => {
    if (!mapInstance.current || !loaded) return
    const AMap = window.AMap; clearMarkers()

    shops.forEach((shop) => {
      if (filter !== 'all' && shop.type !== filter) return
      const type: MarkerType = shop.type === 'pet_hospital' ? 'hospital' : 'shop'
      const marker = new AMap.Marker({ position: [shop.lng, shop.lat], icon: createIcon(type), offset: [0, -22], zIndex: 100 })
      marker.on('click', () => onMarkerClick ? onMarkerClick(type, shop.id) : router.push(`/shops/${shop.id}`))
      marker.setMap(mapInstance.current); markersRef.current.push(marker)
    })

    if (filter === 'all') {
      onlinePets.forEach((profile) => {
        if (!profile.lat || !profile.lng) return
        const marker = new AMap.Marker({ position: [profile.lng, profile.lat], icon: createIcon('pet'), offset: [0, -22], zIndex: 80 })
        marker.on('click', () => onMarkerClick && onMarkerClick('pet', profile.id))
        marker.setMap(mapInstance.current); markersRef.current.push(marker)
      })
    }
  }, [shops, onlinePets, filter, loaded, clearMarkers, createIcon, onMarkerClick, router])

  if (mapError) return <div className="w-full h-full flex items-center justify-center bg-gray-100"><p className="text-red-500">{mapError}</p></div>

  return <div ref={mapRef} className="w-full h-full" />
}
