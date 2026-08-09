'use client'

import { useState, useEffect, useCallback } from 'react'
import { getMyPets } from '@/lib/db/pets'
import type { Pet } from '@/types'

export function usePets(userId: string | undefined) {
  const [pets, setPets] = useState<Pet[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!userId) { setPets([]); setLoading(false); return }
    setLoading(true)
    const data = await getMyPets(userId)
    setPets(data)
    setLoading(false)
  }, [userId])

  useEffect(() => { refresh() }, [refresh])

  return { pets, loading, refresh }
}
