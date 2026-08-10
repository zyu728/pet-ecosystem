'use client'

import { useRef, useEffect, useCallback, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { useAMap } from '@/lib/hooks/useAMap'
import { useTracking } from '@/lib/hooks/useTracking'
import { createClient } from '@/lib/supabase/client'
import { getGeofence, saveGeofence, checkGeofence } from '@/lib/db/geofence'
import Loading from '@/components/ui/Loading'
import Modal from '@/components/ui/Modal'
import { SHANGQIU_CENTER } from '@/lib/utils/helpers'
import type { Geofence } from '@/types'

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
  const circleRef = useRef<any>(null)

  const [geofence, setGeofence] = useState<Geofence | null>(null)
  const [showGeofenceModal, setShowGeofenceModal] = useState(false)
  const [fenceRadius, setFenceRadius] = useState(500)
  const [notifyPermission, setNotifyPermission] = useState('default')
  const [isRealMode, setIsRealMode] = useState(false)

  useEffect(() => { if ('Notification' in window) setNotifyPermission(Notification.permission) }, [])

  const requestNotify = async () => {
    if (!('Notification' in window)) return
    const perm = await Notification.requestPermission()
    setNotifyPermission(perm)
  }

  const notify = (title: string, body: string) => {
    if (notifyPermission !== 'granted') return
    try { new Notification(title, { body, icon: '🐾' }) } catch {}
  }

  // 加载围栏
  useEffect(() => {
    if (!petId) return
    getGeofence(petId).then(setGeofence)
  }, [petId])

  // Realtime 订阅（真实模式）
  useEffect(() => {
    if (!isRealMode || !collar) return
    const supabase = createClient()
    const sub = supabase
      .channel(`tracking:${collar.id}`)
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'tracking_records',
        filter: `collar_id=eq.${collar.id}`,
      }, (payload: any) => {
        const rec = payload.new
        // Check geofence automatically
        if (petId && user) {
          checkGeofence(petId, rec.lat, rec.lng, user.id).then((alert) => {
            if (alert) notify('🚨 宠物出圈告警', alert.message)
          })
        }
        // Manually reload all records
        if (collar) {
          import('@/lib/db/tracking').then(({ getTrackingRecords }) => {
            getTrackingRecords(collar.id).then(() => {})
          })
        }
      })
      .subscribe()
    return () => { sub.unsubscribe() }
  }, [isRealMode, collar, petId, user])

  // 初始化地图
  useEffect(() => {
    if (!loaded || !mapRef.current) return
    mapInstance.current = new window.AMap.Map(mapRef.current, { zoom: 15, center: SHANGQIU_CENTER })
    return () => { mapInstance.current?.destroy() }
  }, [loaded])

  // 绘制围栏圆圈
  useEffect(() => {
    if (!mapInstance.current || !loaded) return
    const AMap = window.AMap
    if (circleRef.current) circleRef.current.setMap(null)
    if (geofence) {
      circleRef.current = new AMap.Circle({
        center: [geofence.lng, geofence.lat],
        radius: geofence.radius_meters,
        strokeColor: '#4CAF50', strokeWeight: 2, strokeOpacity: 0.8,
        fillColor: '#4CAF50', fillOpacity: 0.15,
      })
      circleRef.current.setMap(mapInstance.current)
    }
  }, [geofence, loaded])

  // 绘制轨迹
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

  // 设置围栏
  const handleSetFence = async () => {
    if (!petId || !user) return
    const map = mapInstance.current
    if (!map) return
    const center = map.getCenter()
    await saveGeofence(petId, center.lat, center.lng, fenceRadius)
    const f = await getGeofence(petId)
    setGeofence(f)
    setShowGeofenceModal(false)
  }

  // 模拟位置 + 围栏检测
  const handleSimulate = useCallback(async () => {
    let lat: number, lng: number
    if (navigator.geolocation) {
      try {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 }))
        lat = pos.coords.latitude + (Math.random() - 0.5) * 0.005
        lng = pos.coords.longitude + (Math.random() - 0.5) * 0.005
      } catch {
        lat = 34.414 + (Math.random() - 0.5) * 0.05  // larger spread for testing
        lng = 115.656 + (Math.random() - 0.5) * 0.05
      }
    } else {
      lat = 34.414 + (Math.random() - 0.5) * 0.05
      lng = 115.656 + (Math.random() - 0.5) * 0.05
    }

    await simulateUpdate(lat, lng)

    // Check geofence
    if (petId && user) {
      const alert = await checkGeofence(petId, lat, lng, user.id)
      if (alert) {
        notify('🚨 宠物出圈告警', alert.message)
      }
    }
  }, [simulateUpdate, petId, user, notifyPermission])

  if (!user) { router.push('/auth/login'); return null }
  if (mapError) return <p className="text-center py-10 text-red-500">{mapError}</p>
  if (dataLoading) return <Loading />

  return (
    <div className="relative w-full h-screen">
      <div ref={mapRef} className="w-full h-full" />

      {/* 顶栏 */}
      <div className="absolute top-0 left-0 right-0 z-10">
        <div className="bg-white/90 backdrop-blur m-3 rounded-xl shadow-lg p-3">
          <div className="flex items-center justify-between">
            <button onClick={() => router.back()} className="text-gray-600 font-medium">← 返回</button>
            <div className="text-center">
              <p className="font-semibold text-sm">{collar ? '🟢 追踪中' : '🔴 无项圈'}</p>
              {collar && <p className="text-xs text-gray-400">电量 {collar.battery_level}% · {records.length} 个点</p>}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setIsRealMode(!isRealMode)} className={`text-xs px-2 py-1 rounded-full ${isRealMode ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                {isRealMode ? '📡 真实' : '🎮 模拟'}
              </button>
              <button onClick={() => setShowGeofenceModal(true)} className="text-sm bg-green-500 text-white px-3 py-1 rounded-full">
                {geofence ? '🛡️ 围栏' : '➕ 围栏'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 底部按钮 */}
      <div className="absolute bottom-8 left-0 right-0 z-10 flex justify-center gap-3">
        <button onClick={handleSimulate} className="bg-orange-500 text-white px-6 py-3 rounded-full shadow-lg font-medium active:scale-95 transition-all">
          📍 模拟位置上报
        </button>
        {notifyPermission !== 'granted' && (
          <button onClick={requestNotify} className="bg-blue-500 text-white px-4 py-3 rounded-full shadow-lg text-sm active:scale-95">
            🔔 开启通知
          </button>
        )}
      </div>

      {/* 围栏设置弹窗 */}
      <Modal isOpen={showGeofenceModal} onClose={() => setShowGeofenceModal(false)} title="🛡️ 电子围栏">
        <p className="text-sm text-gray-500 mb-4">在地图上设置安全区域，宠物离开此范围将触发告警</p>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">安全半径（米）</label>
          <div className="flex gap-2">
            {[200, 500, 1000, 2000].map((r) => (
              <button key={r} onClick={() => setFenceRadius(r)} className={`flex-1 py-2 rounded-lg text-sm font-medium ${fenceRadius === r ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600'}`}>{r}m</button>
            ))}
          </div>
        </div>
        <p className="text-xs text-gray-400 mb-4">当前地图中心位置将被设为围栏中心</p>
        {geofence && (
          <p className="text-xs text-green-600 mb-4">当前围栏: {geofence.radius_meters}m（将替换）</p>
        )}
        <button onClick={handleSetFence} className="w-full bg-green-500 text-white py-3 rounded-lg font-medium">保存围栏</button>
        {geofence && (
          <button onClick={async () => {
            if (!petId || !user) return
            await saveGeofence(petId, geofence.lat, geofence.lng, 0)  // disable by setting 0
            setGeofence(null)
            setShowGeofenceModal(false)
          }} className="w-full text-red-400 text-sm py-2 mt-1">删除围栏</button>
        )}
      </Modal>
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
