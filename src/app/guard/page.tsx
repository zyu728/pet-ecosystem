'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { usePets } from '@/lib/hooks/usePets'
import { getCollarForPet, getTrackingRecords } from '@/lib/db/tracking'
import { getGeofence } from '@/lib/db/geofence'
import { getAlerts } from '@/lib/db/geofence'
import { getMyActiveLost } from '@/lib/db/guard'
import TabBar from '@/components/layout/TabBar'
import Loading from '@/components/ui/Loading'
import EmptyState from '@/components/ui/EmptyState'
import Link from 'next/link'
import type { Pet, Alert } from '@/types'

export default function GuardPage() {
  const { user, profile } = useAuth()
  const { pets, loading: petsLoading } = usePets(user?.id)
  const router = useRouter()
  const [guardData, setGuardData] = useState<Record<string, { collar: any; fence: any; lastRecord: any; lost: any }>>({})
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || pets.length === 0) { if (!petsLoading) setLoading(false); return }
    async function load() {
      const data: Record<string, any> = {}
      for (const pet of pets) {
        const [collar, fence, lost] = await Promise.all([
          getCollarForPet(pet.id),
          getGeofence(pet.id),
          getMyActiveLost(pet.id),
        ])
        let lastRecord = null
        if (collar) {
          const records = await getTrackingRecords(collar.id, 1)
          lastRecord = records[0] || null
        }
        data[pet.id] = { collar, fence, lastRecord, lost }
      }
      setGuardData(data)
      const a = await getAlerts(user!.id)
      setAlerts(a.slice(0, 5))
      setLoading(false)
    }
    load()
  }, [user, pets, petsLoading])

  if (loading || petsLoading) return <Loading />
  if (!user) { router.push('/auth/login'); return null }

  return (
    <>
      <div className="pb-20">
        <div className="page-header">
          <h1 className="text-[17px] font-semibold tracking-tight">守护中心</h1>
        </div>

        <div className="px-4 pt-4 space-y-4">
          {/* 宠物状态卡 */}
          {pets.length === 0 ? (
            <EmptyState
              icon={<span className="text-xl">🐾</span>}
              title="还没有宠物档案"
              description="创建档案并绑定项圈后，这里会显示守护状态"
              action={{ label: '创建宠物档案', href: '/pets/new' }}
            />
          ) : (
            pets.map((pet: Pet) => {
              const g = guardData[pet.id]
              const isGuarding = !!g?.collar
              const isLost = !!g?.lost
              return (
                <div key={pet.id} className="card p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-btn bg-surface-subtle flex items-center justify-center text-xl">
                        {pet.species === 'dog' ? '🐶' : pet.species === 'cat' ? '🐱' : '🐹'}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-ink-primary">{pet.name}</p>
                        <p className="text-[11px] text-ink-muted">{pet.breed || pet.species}</p>
                      </div>
                    </div>
                    {isLost ? (
                      <span className="text-[11px] font-medium text-status-danger bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">走失中</span>
                    ) : isGuarding ? (
                      <span className="flex items-center gap-1.5 text-[11px] font-medium text-status-success">
                        <span className="w-1.5 h-1.5 rounded-full bg-status-success" /> 守护中
                      </span>
                    ) : (
                      <span className="text-[11px] text-ink-muted">未绑定项圈</span>
                    )}
                  </div>

                  {isGuarding && !isLost && (
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <div className="bg-surface-subtle rounded-btn px-2 py-2 text-center">
                        <p className="text-[10px] text-ink-muted">电量</p>
                        <p className="text-[13px] font-semibold text-ink-primary tabular">{g?.collar?.battery_level ?? '--'}%</p>
                      </div>
                      <div className="bg-surface-subtle rounded-btn px-2 py-2 text-center">
                        <p className="text-[10px] text-ink-muted">围栏</p>
                        <p className={`text-[13px] font-semibold tabular ${g?.fence ? 'text-status-success' : 'text-ink-muted'}`}>{g?.fence ? `${g.fence.radius_meters}m` : '未设置'}</p>
                      </div>
                      <div className="bg-surface-subtle rounded-btn px-2 py-2 text-center">
                        <p className="text-[10px] text-ink-muted">最近位置</p>
                        <p className="text-[13px] font-semibold text-ink-primary tabular">{g?.lastRecord ? '刚刚' : '--'}</p>
                      </div>
                    </div>
                  )}

                  {isLost ? (
                    <div className="bg-red-50 border border-red-200 rounded-btn p-3 mb-3">
                      <p className="text-[13px] font-medium text-status-danger mb-2">🐾 正在全力寻找 {pet.name}</p>
                      <Link href={`/guard/lost/${g?.lost?.id}`} className="text-[12px] text-status-danger underline">查看走失进展 →</Link>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      {isGuarding && (
                        <button onClick={() => router.push(`/pets/tracking?petId=${pet.id}`)} className="flex-1 py-2 rounded-btn border border-line-hairline text-[13px] font-medium text-ink-secondary press">
                          实时位置
                        </button>
                      )}
                      <button onClick={() => router.push(`/guard/lost?petId=${pet.id}`)} className="flex-1 py-2 rounded-btn bg-status-danger text-white text-[13px] font-semibold press">
                        一键走失
                      </button>
                    </div>
                  )}
                </div>
              )
            })
          )}

          {/* 未订阅提示 */}
          {profile && !profile.is_subscribed && (
            <div className="card p-4">
              <p className="text-[13px] font-semibold text-ink-primary mb-1">🛡️ 守护服务</p>
              <p className="text-[12px] text-ink-muted mb-3 leading-relaxed">GPS实时追踪 · 电子围栏 · 走失互助网络 · 免费项圈</p>
              <Link href="/profile" className="block text-center py-2 rounded-btn bg-ink-primary text-white text-[13px] font-medium press">
                免费领取守护项圈
              </Link>
            </div>
          )}

          {/* 最近告警 */}
          {alerts.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-[13px] font-semibold text-ink-primary">最近告警</p>
                <Link href="/alerts" className="text-[12px] text-ink-muted">全部 →</Link>
              </div>
              <div className="space-y-2">
                {alerts.map((a) => (
                  <div key={a.id} className="card px-3.5 py-2.5 flex items-center gap-2.5">
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${a.is_read ? 'bg-ink-faint' : 'bg-status-danger'}`} />
                    <p className="text-[12px] text-ink-secondary flex-1 truncate">{a.message}</p>
                    <p className="text-[10px] text-ink-muted tabular flex-shrink-0">{new Date(a.created_at).toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' })}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <TabBar />
    </>
  )
}
