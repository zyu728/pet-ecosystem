'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { usePets } from '@/lib/hooks/usePets'
import { getCollarForPet, getTrackingRecords } from '@/lib/db/tracking'
import { createLostReport } from '@/lib/db/guard'
import { useToast } from '@/components/ui/Toast'
import Loading from '@/components/ui/Loading'

function LostReportContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const presetPetId = searchParams.get('petId') || ''
  const { user } = useAuth()
  const { pets, loading: petsLoading } = usePets(user?.id)
  const { toast } = useToast()
  const [petId, setPetId] = useState(presetPetId)
  const [note, setNote] = useState('')
  const [reward, setReward] = useState('')
  const [contact, setContact] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [autoLocation, setAutoLocation] = useState('')

  useEffect(() => {
    if (!presetPetId || !pets.length) return
    setPetId(presetPetId)
    getCollarForPet(presetPetId).then(async (collar) => {
      if (!collar) return
      const records = await getTrackingRecords(collar.id, 1)
      if (records[0]) {
        setAutoLocation(`最后定位: ${records[0].lat.toFixed(5)}, ${records[0].lng.toFixed(5)} · ${new Date(records[0].recorded_at).toLocaleString('zh-CN')}`)
      }
    })
  }, [presetPetId, pets])

  if (petsLoading) return <Loading />
  if (!user) { router.push('/auth/login'); return null }
  if (pets.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-sm text-ink-secondary mb-3">还没有宠物档案</p>
        <button onClick={() => router.push('/pets/new')} className="px-5 py-2 rounded-btn bg-ink-primary text-white text-[13px] press">创建档案</button>
      </div>
    )
  }

  const handleSubmit = async () => {
    if (!petId) { toast('请选择宠物', 'error'); return }
    if (!note.trim()) { toast('请填写走失特征和最后位置', 'error'); return }
    setSubmitting(true)
    const lost = await createLostReport(petId, user.id, { note: note.trim(), reward: reward.trim() || undefined, contact: contact.trim() || undefined })
    setSubmitting(false)
    if (lost) {
      toast('走失信息已发布，社区已同步', 'success')
      router.push(`/guard/lost/${lost.id}`)
    } else {
      toast('发布失败，请重试', 'error')
    }
  }

  return (
    <div className="min-h-screen bg-surface-bg">
      <div className="page-header flex items-center gap-3">
        <button onClick={() => router.back()} aria-label="返回" className="text-ink-muted"><span className="text-lg">←</span></button>
        <h1 className="text-[17px] font-semibold tracking-tight">一键走失</h1>
      </div>

      <div className="px-4 pt-4 space-y-4 pb-10">
        <div className="bg-red-50 border border-red-200 rounded-card p-4">
          <p className="text-[13px] font-semibold text-status-danger mb-1">不要慌，现在开始找</p>
          <p className="text-[12px] text-ink-secondary leading-relaxed">发布后：社区自动置顶 · 宠友看到你的求助 · 有人目击会立即联系你</p>
        </div>

        <div className="card p-4 space-y-4">
          <div>
            <label className="block text-[13px] font-medium text-ink-secondary mb-1.5">走失的宠物 *</label>
            <select value={petId} onChange={(e) => setPetId(e.target.value)} className="w-full border border-line-hairline rounded-btn px-3.5 py-2.5 text-sm outline-none text-ink-primary">
              <option value="">选择宠物</option>
              {pets.map((p) => <option key={p.id} value={p.id}>{p.name}（{p.breed || p.species}）</option>)}
            </select>
          </div>

          {autoLocation && (
            <div className="bg-surface-subtle rounded-btn px-3.5 py-2.5">
              <p className="text-[12px] text-ink-secondary">{autoLocation}</p>
              <p className="text-[11px] text-ink-muted mt-0.5">以上为项圈最后一次上报位置</p>
            </div>
          )}

          <div>
            <label className="block text-[13px] font-medium text-ink-secondary mb-1.5">走失特征和最后位置 *</label>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="例：黄色柯基，项圈蓝色，最后在神火大道万达广场附近出现…" className="w-full border border-line-hairline rounded-btn px-3.5 py-2.5 text-sm outline-none text-ink-primary placeholder:text-ink-faint" />
          </div>

          <div>
            <label className="block text-[13px] font-medium text-ink-secondary mb-1.5">悬赏（可选）</label>
            <input value={reward} onChange={(e) => setReward(e.target.value)} placeholder="例：重金酬谢 / 500元" className="w-full border border-line-hairline rounded-btn px-3.5 py-2.5 text-sm outline-none text-ink-primary placeholder:text-ink-faint" />
          </div>

          <div>
            <label className="block text-[13px] font-medium text-ink-secondary mb-1.5">联系方式 *</label>
            <input value={contact} onChange={(e) => setContact(e.target.value)} placeholder="手机号 / 微信号" className="w-full border border-line-hairline rounded-btn px-3.5 py-2.5 text-sm outline-none text-ink-primary placeholder:text-ink-faint" />
          </div>

          <button onClick={handleSubmit} disabled={submitting} className="w-full py-3 rounded-btn bg-status-danger text-white text-sm font-semibold press disabled:opacity-50">
            {submitting ? '发布中…' : '🚨 立即发布走失信息'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function LostReportPage() {
  return (
    <Suspense fallback={<Loading />}>
      <LostReportContent />
    </Suspense>
  )
}
