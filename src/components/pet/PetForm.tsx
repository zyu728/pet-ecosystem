'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Input from '@/components/ui/Input'
import { createPet, updatePet } from '@/lib/db/pets'
import type { Pet } from '@/types'

export default function PetForm({ userId, pet }: { userId: string; pet?: Pet | null }) {
  const router = useRouter()
  const isEdit = !!pet
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: pet?.name || '', species: pet?.species || 'dog', breed: pet?.breed || '',
    age: pet?.age || null as number | null, gender: pet?.gender || null as 'male' | 'female' | null,
    weight: pet?.weight || null as number | null, allergies: pet?.allergies || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) { setError('请输入宠物名字'); return }
    setSaving(true); setError('')

    const petData = {
      owner_id: userId, name: form.name.trim(), species: form.species as 'dog' | 'cat' | 'other',
      breed: form.breed || null, age: form.age, gender: form.gender, weight: form.weight,
      allergies: form.allergies || null, avatar_url: null, photos: [], vaccine_records: [],
    }

    const result = isEdit && pet ? await updatePet(pet.id, petData) : await createPet(petData)
    if (result) router.push(isEdit && pet ? `/pets/${pet.id}` : `/pets/${result.id}`)
    else setError('保存失败')
    setSaving(false)
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <Input label="宠物名字 *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="给TA取个名字吧" error={error} />
      <div className="mb-4"><label className="block text-sm font-medium text-gray-700 mb-1">种类</label>
        <div className="flex gap-3">
          <button type="button" onClick={() => setForm({ ...form, species: 'dog' })} className={`flex-1 py-3 rounded-xl text-center text-sm font-medium transition-all ${form.species === 'dog' ? 'bg-orange-100 text-orange-600 border-2 border-orange-400' : 'bg-gray-50 text-gray-500 border-2 border-transparent'}`}>🐶 狗狗</button>
          <button type="button" onClick={() => setForm({ ...form, species: 'cat' })} className={`flex-1 py-3 rounded-xl text-center text-sm font-medium transition-all ${form.species === 'cat' ? 'bg-orange-100 text-orange-600 border-2 border-orange-400' : 'bg-gray-50 text-gray-500 border-2 border-transparent'}`}>🐱 猫猫</button>
          <button type="button" onClick={() => setForm({ ...form, species: 'other' })} className={`flex-1 py-3 rounded-xl text-center text-sm font-medium transition-all ${form.species === 'other' ? 'bg-orange-100 text-orange-600 border-2 border-orange-400' : 'bg-gray-50 text-gray-500 border-2 border-transparent'}`}>🐹 其他</button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input label="品种" value={form.breed} onChange={(e) => setForm({ ...form, breed: e.target.value })} placeholder={form.species === 'dog' ? '如：金毛' : form.species === 'cat' ? '如：英短' : ''} />
        <Input label="年龄（月）" type="number" value={form.age ?? ''} onChange={(e) => setForm({ ...form, age: e.target.value ? parseInt(e.target.value) : null })} placeholder="如：12" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="mb-4"><label className="block text-sm font-medium text-gray-700 mb-1">性别</label>
          <div className="flex gap-2">
            {[{ value: 'male', label: '♂ 公' }, { value: 'female', label: '♀ 母' }].map((g) => (
              <button key={g.value} type="button" onClick={() => setForm({ ...form, gender: g.value as any })} className={`flex-1 py-2 rounded-lg text-sm transition-all ${form.gender === g.value ? 'bg-blue-100 text-blue-600 border-2 border-blue-400' : 'bg-gray-50 text-gray-500 border-2 border-transparent'}`}>{g.label}</button>
            ))}
          </div>
        </div>
        <Input label="体重（kg）" type="number" value={form.weight ?? ''} onChange={(e) => setForm({ ...form, weight: e.target.value ? parseFloat(e.target.value) : null })} placeholder="如：5.5" />
      </div>
      <Input label="过敏信息" value={form.allergies} onChange={(e) => setForm({ ...form, allergies: e.target.value })} placeholder="如：鸡肉过敏（选填）" />
      <button type="submit" disabled={saving} className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium disabled:opacity-50">{saving ? '保存中...' : isEdit ? '保存修改' : '🐾 创建宠物档案'}</button>
    </form>
  )
}
