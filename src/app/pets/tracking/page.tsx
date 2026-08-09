'use client'

import { useRef, useEffect, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { useAMap } from '@/lib/hooks/useAMap'
import { useTracking } from '@/lib/hooks/useTracking'
import Loading from '@/components/ui/Loading'
import { SHANGQIU_CENTER } from '@/lib/utils/helpers'

function TrackingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const petId = searchParams.get('petId') || undefined
  const { user } = useAuth()
  const { collar, records, loading: dataLoading, simulateUpdate } = useTracking(petId)
  const { loaded, error: mapError } = useAMap()
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<any>(null)
  const pathRef = useRef<any>(null)
  const markerRef = useRef<any>(null)

  useEffect(() => {
    if (!loaded || !mapRef.current) return
    mapInstance.current = new window.AMap.Map(mapRef.current, { zoom: 15, center: SHANGQIU_CENTER })
    return () => { mapInstance.current?.destroy() }
  }, [loaded])

  useEffect(() => {
    if (!mapInstance.current || !loaded || records.length === 0) return
    const AMap = window.AMap
    if (pathRef.current) pathRef.current.setMap(null)
    if (markerRef.current) markerRef.current.setMap(null)

    const path = records.map((r: any) => [r.lng, r.lat])
    pathRef.current = new AMap.Polyline({ path, strokeColor: '#4CAF50', strokeWeight: 4, strokeOpacity: 0.7 })
    pathRef.current.setMap(mapInstance.current)

    const last = records[records.length - 1]
    markerRef.current = new AMap.Marker({
      position: [last.lng, last.lat],
      icon: new AMap.Icon({ size: [32, 32], image: `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><circle cx="16" cy="16" r="14" fill="#4CAF50" opacity="0.3"/><circle cx="16" cy="16" r="8" fill="#4CAF50"/><circle cx="16" cy="16" r="4" fill="white"/></svg>')}` }),
    })
    markerRef.current.setMap(mapInstance.current)
    mapInstance.current.setFitView([pathRef.current])
  }, [records, loaded])

  const handleSimulate = useCallback(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => simulateUpdate(pos.coords.latitude + (Math.random() - 0.5) * 0.005, pos.coords.longitude + (Math.random() - 0.5) * 0.005),
      () => simulateUpdate(34.414 + (Math.random() - 0.5) * 0.02, 115.656 + (Math.random() - 0.5) * 0.02)
    )
  }, [simulateUpdate])

  if (!user) { router.push('/auth/login'); return null }
  if (mapError) return <p className="text-center py-10 text-red-500">{mapError}</p>
  if (dataLoading) return <Loading />

  return (
    <div className="relative w-full h-screen">
      <div ref={mapRef} className="w-full h-full" />
      <div className="absolute top-0 left-0 right-0 z-10">
        <div className="bg-white/90 backdrop-blur m-3 rounded-xl shadow-lg p-3">
          <div className="flex items-center justify-between">
            <button onClick={() => router.back()} className="text-gray-600 font-medium">← 返回</button>
            <div className="text-center">
              <p className="font-semibold text-sm">{collar ? '🟢 追踪中' : '🔴 无项圈'}</p>
              {collar && <p className="text-xs text-gray-400">电量 {collar.battery_level}% · {records.length} 个点</p>}
            </div>
            <div className="w-12" />
          </div>
        </div>
      </div>
      <div className="absolute bottom-8 left-0 right-0 z-10 flex justify-center">
        <button onClick={handleSimulate} className="bg-orange-500 text-white px-6 py-3 rounded-full shadow-lg font-medium active:scale-95 transition-all">
          📍 模拟位置上报
        </button>
      </div>
    </div>
  )
}

export default function TrackingPage() {
  return (
    <Suspense fallback={<Loading />}>
      <TrackingContent />
    </Suspense>
  )
}
