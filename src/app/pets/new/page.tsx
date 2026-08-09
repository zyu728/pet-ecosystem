'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import PetForm from '@/components/pet/PetForm'
import Loading from '@/components/ui/Loading'

export default function NewPetPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  if (loading) return <Loading />
  if (!user) { router.push('/auth/login'); return null }

  return (
    <div>
      <div className="sticky top-0 bg-white z-10 px-4 py-3 border-b flex items-center gap-3">
        <button onClick={() => router.back()} className="text-gray-600">←</button>
        <h1 className="text-lg font-bold">添加宠物</h1>
      </div>
      <PetForm userId={user.id} />
    </div>
  )
}
