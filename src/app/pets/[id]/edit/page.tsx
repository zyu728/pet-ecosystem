'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { getPet } from '@/lib/db/pets'
import PetForm from '@/components/pet/PetForm'
import Loading from '@/components/ui/Loading'
import type { Pet } from '@/types'

export default function EditPetPage() {
  const { id } = useParams<{ id: string }>()
  const { user, loading: authLoading } = useAuth()
  const [pet, setPet] = useState<Pet | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => { getPet(id).then((p) => { setPet(p); setLoading(false) }) }, [id])

  if (authLoading || loading) return <Loading />
  if (!user) { router.push('/auth/login'); return null }
  if (!pet) return <p className="text-center py-20 text-gray-400">宠物不存在</p>
  if (pet.owner_id !== user.id) { router.push(`/pets/${id}`); return null }

  return (
    <div>
      <div className="sticky top-0 bg-white z-10 px-4 py-3 border-b flex items-center gap-3">
        <button onClick={() => router.back()} className="text-gray-600">←</button>
        <h1 className="text-lg font-bold">编辑 {pet.name}</h1>
      </div>
      <PetForm userId={user.id} pet={pet} />
    </div>
  )
}
