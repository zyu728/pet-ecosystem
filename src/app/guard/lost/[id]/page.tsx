'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { getLostPet, markFound, addSighting } from '@/lib/db/guard'
import { useToast } from '@/components/ui/Toast'
import Loading from '@/components/ui/Loading'
import type { LostPet } from '@/types'

export default function LostPetDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [lost, setLost] = useState<LostPet | null>(null)
  const [loading, setLoading] = useState(true)
  const [sighting, setSighting] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [founding, setFounding] = useState(false)

  useEffect(() => {
    getLostPet(id).then((l) => { setLost(l); setLoading(false) })
  }, [id])

  if (loading) return <Loading />
  if (!lost) return <p className="text-center py-16 text-ink-muted text-sm">信息不存在或已删除</p>

  const isOwner = user?.id === lost.owner_id
  const isFound = lost.status === 'found'

  const handleSighting = async () => {
    if (!user) { router.push('/auth/login'); return }
    if (!sighting.trim()) { toast('请描述目击信息', 'error'); return }
    setSubmitting(true)
    const ok = await addSighting(lost.id, user.id, sighting.trim())
    setSubmitting(false)
    if (ok) { toast('线索已发送给主人', 'success'); setSighting('') }
    else { toast('发送失败，请重试', 'error') }
  }

  const handleFound = async () => {
    setFounding(true)
    const ok = await markFound(lost.id)
    setFounding(false)
    if (ok) {
      toast('已标记找回，太好了！', 'success')
      const l = await getLostPet(id)
      setLost(l)
    }
  }

  return (
    <div className="min-h-screen bg-surface-bg">
      <div className="page-header flex items-center gap-3">
        <button onClick={() => router.back()} aria-label="返回" className="text-ink-muted"><span className="text-lg">←</span></button>
        <h1 className="text-[17px] font-semibold tracking-tight">走失寻宠</h1>
        <span className={`ml-auto text-[11px] font-medium px-2 py-0.5 rounded-full border ${isFound ? 'text-status-success border-green-200 bg-green-50' : 'text-status-danger border-red-200 bg-red-50'}`}>
          {isFound ? '✅ 已找回' : '🔍 寻找中'}
        </span>
      </div>

      <div className="px-4 pt-4 pb-10 space-y-4">
        {/* 宠物信息卡 */}
        <div className="card p-5 text-center">
          <div className="w-20 h-20 mx-auto mb-3 rounded-card bg-surface-subtle flex items-center justify-center text-4xl">
            {lost.pet?.species === 'dog' ? '🐶' : lost.pet?.species === 'cat' ? '🐱' : '🐹'}
          </div>
          <h2 className="text-lg font-bold tracking-tight text-ink-primary">{lost.pet?.name}</h2>
          <p className="text-[12px] text-ink-muted mt-0.5">{lost.pet?.breed || lost.pet?.species}</p>
          <div className="mt-4 text-left bg-surface-subtle rounded-btn p-3.5">
            <p className="text-[13px] text-ink-primary leading-relaxed">{lost.note}</p>
          </div>
          {lost.last_seen_at && (
            <p className="text-[11px] text-ink-muted mt-2 tabular">走失时间: {new Date(lost.last_seen_at || lost.created_at).toLocaleString('zh-CN')}</p>
          )}
        </div>

        {/* 联系方式 */}
        <div className="card p-4 flex items-center justify-between">
          <div>
            <p className="text-[13px] font-semibold text-ink-primary">联系主人</p>
            <p className="text-[12px] text-ink-secondary mt-0.5">{lost.contact || '未留联系方式'}</p>
          </div>
          {lost.reward && (
            <span className="text-[13px] font-semibold text-status-warning">{lost.reward}</span>
          )}
        </div>

        {/* 目击留言 */}
        {!isFound && !isOwner && (
          <div className="card p-4">
            <p className="text-[13px] font-semibold text-ink-primary mb-2.5">👀 我见过它</p>
            <div className="flex gap-2">
              <input value={sighting} onChange={(e) => setSighting(e.target.value)} placeholder="描述看到的时间和地点…" className="flex-1 bg-surface-subtle rounded-btn px-3.5 py-2.5 text-sm outline-none text-ink-primary placeholder:text-ink-muted" />
              <button onClick={handleSighting} disabled={submitting} className="px-4 py-2.5 rounded-btn bg-ink-primary text-white text-[13px] font-medium press disabled:opacity-50">发送</button>
            </div>
          </div>
        )}

        {/* 主人操作 */}
        {isOwner && !isFound && (
          <button onClick={handleFound} disabled={founding} className="w-full py-3 rounded-btn bg-status-success text-white text-sm font-semibold press disabled:opacity-50">
            {founding ? '处理中…' : '🎉 已找到，结束寻找'}
          </button>
        )}
      </div>
    </div>
  )
}
