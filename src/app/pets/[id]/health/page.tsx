'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getPet } from '@/lib/db/pets'
import { getHealthRecords, addHealthRecord, deleteHealthRecord, getUpcomingVaccines, getWeightHistory } from '@/lib/db/health'
import { useAuth } from '@/lib/hooks/useAuth'
import { useToast } from '@/components/ui/Toast'
import Modal from '@/components/ui/Modal'
import Loading from '@/components/ui/Loading'
import type { Pet, HealthRecord } from '@/types'

const typeLabels: Record<string, { label: string; icon: string }> = {
  vaccine: { label: '疫苗', icon: '💉' },
  visit: { label: '就诊', icon: '🏥' },
  weight: { label: '体重', icon: '⚖️' },
  medication: { label: '用药', icon: '💊' },
  surgery: { label: '手术', icon: '🔬' },
  other: { label: '其他', icon: '📋' },
}

export default function PetHealthPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [pet, setPet] = useState<Pet | null>(null)
  const [records, setRecords] = useState<HealthRecord[]>([])
  const [upcoming, setUpcoming] = useState<HealthRecord[]>([])
  const [weights, setWeights] = useState<HealthRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ record_type: 'vaccine', title: '', note: '', record_date: '', next_date: '', weight_kg: '' })

  const loadAll = async () => {
    const [r, u, w] = await Promise.all([getHealthRecords(id), getUpcomingVaccines(id), getWeightHistory(id)])
    setRecords(r); setUpcoming(u); setWeights(w); setLoading(false)
  }

  useEffect(() => {
    getPet(id).then(setPet)
    loadAll()
  }, [id])

  if (loading) return <Loading />
  if (!pet) return <p className="text-center py-16 text-sm text-ink-muted">宠物不存在</p>

  const isOwner = user?.id === pet.owner_id

  const handleAdd = async () => {
    if (!form.title.trim()) { toast('请填写记录标题', 'error'); return }
    await addHealthRecord({
      pet_id: id,
      record_type: form.record_type as any,
      title: form.title.trim(),
      note: form.note.trim() || null,
      record_date: form.record_date || new Date().toISOString().split('T')[0],
      next_date: form.next_date || null,
      weight_kg: form.weight_kg ? parseFloat(form.weight_kg) : null,
    })
    setShowAdd(false)
    setForm({ record_type: 'vaccine', title: '', note: '', record_date: '', next_date: '', weight_kg: '' })
    toast('记录已添加', 'success')
    loadAll()
  }

  const handleDelete = async (recordId: string) => {
    if (!confirm('删除这条记录？')) return
    await deleteHealthRecord(recordId)
    toast('已删除', 'success')
    loadAll()
  }

  // 未来7天疫苗提醒
  const urgentVaccines = upcoming.filter(v => {
    const days = Math.ceil((new Date(v.next_date!).getTime() - Date.now()) / 86400000)
    return days <= 7
  })

  return (
    <div className="min-h-screen bg-surface-bg pb-10">
      <div className="page-header flex items-center gap-3">
        <button onClick={() => router.back()} aria-label="返回" className="text-ink-muted"><span className="text-lg">←</span></button>
        <h1 className="text-[17px] font-semibold tracking-tight">{pet.name} 的健康档案</h1>
        {isOwner && (
          <button onClick={() => setShowAdd(true)} className="ml-auto text-[13px] font-medium text-ink-primary press">+ 记录</button>
        )}
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* 疫苗提醒 */}
        {urgentVaccines.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-card p-4">
            <p className="text-[13px] font-semibold text-status-warning mb-2">⚠️ 疫苗即将到期</p>
            {urgentVaccines.map(v => {
              const days = Math.ceil((new Date(v.next_date!).getTime() - Date.now()) / 86400000)
              return (
                <p key={v.id} className="text-[12px] text-ink-secondary">{v.title} — <span className="font-medium text-status-danger">{days} 天后到期</span></p>
              )
            })}
          </div>
        )}

        {/* 体重记录 */}
        {weights.length >= 2 && (
          <div className="card p-4">
            <p className="text-[13px] font-semibold text-ink-primary mb-3">⚖️ 体重变化</p>
            <div className="flex items-end gap-1.5 h-24">
              {weights.map(w => (
                <div key={w.id} className="flex-1 flex flex-col items-center justify-end h-full">
                  <div className="w-full bg-ink-primary/10 rounded-t" style={{ height: `${((w.weight_kg! - Math.min(...weights.map(x => x.weight_kg!))) / (Math.max(...weights.map(x => x.weight_kg!)) - Math.min(...weights.map(x => x.weight_kg!)) || 1)) * 80 + 10}%` }} />
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-1.5">
              <p className="text-[10px] text-ink-muted tabular">{weights[0].weight_kg}kg · {new Date(weights[0].record_date).toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' })}</p>
              <p className="text-[10px] text-ink-muted tabular">{weights[weights.length - 1].weight_kg}kg · {new Date(weights[weights.length - 1].record_date).toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' })}</p>
            </div>
          </div>
        )}

        {/* 记录时间线 */}
        <div>
          <p className="text-[13px] font-semibold text-ink-primary mb-2.5">健康时间线（{records.length}）</p>
          {records.length === 0 ? (
            <div className="card p-6 text-center">
              <p className="text-sm text-ink-muted">还没有健康记录</p>
              {isOwner && <p className="text-xs text-ink-faint mt-1">点右上角 + 记录 添加第一条</p>}
            </div>
          ) : (
            <div className="relative pl-5 space-y-3 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-px before:bg-line-hairline">
              {records.map(r => {
                const t = typeLabels[r.record_type] || typeLabels.other
                return (
                  <div key={r.id} className="relative">
                    <span className="absolute -left-5 top-2 w-[15px] h-[15px] rounded-full bg-surface-card border border-line-strong flex items-center justify-center text-[8px]">{t.icon}</span>
                    <div className="card px-3.5 py-3">
                      <div className="flex items-center justify-between">
                        <p className="text-[13px] font-medium text-ink-primary">{r.title}</p>
                        {isOwner && <button onClick={() => handleDelete(r.id)} aria-label="删除记录" className="text-[11px] text-ink-faint">删除</button>}
                      </div>
                      <p className="text-[11px] text-ink-muted mt-0.5 tabular">
                        {t.label} · {new Date(r.record_date).toLocaleDateString('zh-CN')}
                        {r.next_date && ` → 下次 ${new Date(r.next_date).toLocaleDateString('zh-CN')}`}
                        {r.weight_kg && ` · ${r.weight_kg}kg`}
                      </p>
                      {r.note && <p className="text-[12px] text-ink-secondary mt-1 leading-relaxed">{r.note}</p>}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* 添加记录弹窗 */}
      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="添加健康记录">
        <div className="space-y-3.5">
          <div>
            <label className="block text-[13px] font-medium text-ink-secondary mb-1.5">类型</label>
            <div className="grid grid-cols-3 gap-1.5">
              {Object.entries(typeLabels).map(([k, v]) => (
                <button key={k} onClick={() => setForm({ ...form, record_type: k })} className={`py-2 rounded-btn text-[12px] font-medium border transition-colors ${form.record_type === k ? 'bg-ink-primary text-white border-ink-primary' : 'border-line-hairline text-ink-secondary'}`}>
                  {v.icon} {v.label}
                </button>
              ))}
            </div>
          </div>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="标题（如：狂犬疫苗第一针）" className="w-full border border-line-hairline rounded-btn px-3.5 py-2.5 text-sm outline-none text-ink-primary placeholder:text-ink-faint" />
          <div className="grid grid-cols-2 gap-2">
            <input type="date" value={form.record_date} onChange={(e) => setForm({ ...form, record_date: e.target.value })} className="w-full border border-line-hairline rounded-btn px-3 py-2.5 text-sm outline-none" />
            <input type="date" value={form.next_date} onChange={(e) => setForm({ ...form, next_date: e.target.value })} className="w-full border border-line-hairline rounded-btn px-3 py-2.5 text-sm outline-none" />
          </div>
          {form.record_type === 'weight' && (
            <input type="number" step="0.1" value={form.weight_kg} onChange={(e) => setForm({ ...form, weight_kg: e.target.value })} placeholder="体重 (kg)" className="w-full border border-line-hairline rounded-btn px-3.5 py-2.5 text-sm outline-none" />
          )}
          <textarea value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="备注（可选）" rows={2} className="w-full border border-line-hairline rounded-btn px-3.5 py-2.5 text-sm outline-none" />
          <button onClick={handleAdd} className="w-full py-3 rounded-btn bg-ink-primary text-white text-sm font-medium press">保存记录</button>
        </div>
      </Modal>
    </div>
  )
}
