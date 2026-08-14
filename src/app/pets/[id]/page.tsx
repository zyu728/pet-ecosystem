'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getPet } from '@/lib/db/pets'
import { getCollarForPet } from '@/lib/db/tracking'
import { useAuth } from '@/lib/hooks/useAuth'
import Loading from '@/components/ui/Loading'
import type { Pet, TrackingCollar } from '@/types'

export default function PetDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { user } = useAuth()
  const [pet, setPet] = useState<Pet | null>(null)
  const [collar, setCollar] = useState<TrackingCollar | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { async function load() { const [p, c] = await Promise.all([getPet(id), getCollarForPet(id)]); setPet(p); setCollar(c); setLoading(false) } load() }, [id])

  if (loading) return <Loading />
  if (!pet) return <p className="text-center py-20 text-gray-400">宠物不存在</p>
  const isOwner = user?.id === pet.owner_id

  return (
    <div className="pb-20">
      <div className="h-56 bg-gradient-to-b from-orange-100 to-orange-50 flex flex-col items-center justify-center relative">
        <button onClick={() => router.back()} aria-label="返回上一页" className="absolute top-4 left-4 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow">←</button>
        {isOwner && <button onClick={() => router.push(`/pets/${pet.id}/edit`)} className="absolute top-4 right-4 bg-white/80 px-3 py-1 rounded-full text-sm shadow">编辑</button>}
        <div className="text-7xl mb-2">{pet.species === 'dog' ? '🐶' : pet.species === 'cat' ? '🐱' : '🐹'}</div>
        <h1 className="text-2xl font-bold">{pet.name}</h1>
        <p className="text-gray-500 text-sm">{pet.breed} · {pet.gender === 'male' ? '♂' : pet.gender === 'female' ? '♀' : ''} · {pet.age}个月</p>
      </div>

      <div className="px-4 -mt-4">
        <div className="bg-white rounded-2xl shadow-lg p-5 space-y-3">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-gray-50 rounded-xl p-3"><p className="text-xs text-gray-400">体重</p><p className="font-bold text-gray-900">{pet.weight ? `${pet.weight}kg` : '-'}</p></div>
            <div className="bg-gray-50 rounded-xl p-3"><p className="text-xs text-gray-400">年龄</p><p className="font-bold text-gray-900">{pet.age ? `${pet.age}个月` : '-'}</p></div>
            <div className="bg-gray-50 rounded-xl p-3"><p className="text-xs text-gray-400">性别</p><p className="font-bold text-gray-900">{pet.gender === 'male' ? '公' : pet.gender === 'female' ? '母' : '-'}</p></div>
          </div>

          <div className="bg-blue-50 rounded-xl p-4 flex items-center justify-between">
            <div><p className="font-medium text-blue-900">📍 GPS项圈</p><p className="text-xs text-blue-600">{collar ? `在线 · 电量 ${collar.battery_level}%` : '未绑定项圈'}</p></div>
            {collar && <button onClick={() => router.push(`/pets/tracking?petId=${pet.id}`)} className="bg-blue-500 text-white px-4 py-1.5 rounded-full text-sm font-medium">实时追踪</button>}
          </div>

          {pet.vaccine_records && pet.vaccine_records.length > 0 && (
            <div><h3 className="font-semibold text-gray-900 mb-2">💉 疫苗记录</h3>{(pet.vaccine_records as any[]).map((v: any, i: number) => {
              const nextDate = v.next_date ? new Date(v.next_date) : null
              const daysLeft = nextDate ? Math.ceil((nextDate.getTime() - Date.now()) / 86400000) : null
              const isUrgent = daysLeft !== null && daysLeft <= 7 && daysLeft >= 0
              return <div key={i} className={`text-sm flex justify-between py-1.5 px-2 rounded-lg ${isUrgent ? 'bg-red-50 text-red-600 font-medium' : 'text-gray-600'}`}>
                <span>{v.name} {isUrgent && '⚠️'}</span>
                <span>{v.date}{nextDate && ` → ${v.next_date}`}{isUrgent && ` (${daysLeft}天后到期)`}</span>
              </div>
            })})</div>
          )}
          {pet.allergies && <div><h3 className="font-semibold text-gray-900">⚠️ 过敏</h3><p className="text-sm text-red-500">{pet.allergies}</p></div>}
        </div>
      </div>
    </div>
  )
}
