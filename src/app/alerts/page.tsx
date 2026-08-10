'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { getAlerts, markAlertRead, markAllRead } from '@/lib/db/geofence'
import Loading from '@/components/ui/Loading'
import TabBar from '@/components/layout/TabBar'
import type { Alert } from '@/types'

export default function AlertsPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    getAlerts(user.id).then((a) => { setAlerts(a); setLoading(false) })
  }, [user])

  if (authLoading || loading) return <Loading />
  if (!user) { router.push('/auth/login'); return null }

  return (
    <>
      <div className="pb-14">
        <div className="sticky top-0 bg-white z-10 px-4 pt-4 pb-2 border-b flex items-center justify-between">
          <h1 className="text-xl font-bold">🔔 告警记录</h1>
          {alerts.some(a => !a.is_read) && (
            <button onClick={async () => { await markAllRead(user.id); const a = await getAlerts(user.id); setAlerts(a) }} className="text-sm text-orange-500">全部已读</button>
          )}
        </div>
        {alerts.length === 0 ? (
          <div className="text-center py-20"><p className="text-4xl mb-3">✅</p><p className="text-gray-400">暂无告警</p></div>
        ) : (
          <div className="px-4 py-3 space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                onClick={async () => { await markAlertRead(alert.id); setAlerts(alerts.map(a => a.id === alert.id ? { ...a, is_read: true } : a)) }}
                className={`rounded-xl p-4 cursor-pointer ${alert.is_read ? 'bg-white border border-gray-100' : 'bg-red-50 border border-red-200'}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className={`text-sm ${alert.is_read ? 'text-gray-600' : 'font-semibold text-gray-900'}`}>
                      {!alert.is_read && '🔴 '}{alert.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{new Date(alert.created_at).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <TabBar />
    </>
  )
}
