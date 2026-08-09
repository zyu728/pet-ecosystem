'use client'

import { useState, useEffect } from 'react'
import { getCollarForPet, getTrackingRecords, addTrackingRecord } from '@/lib/db/tracking'
import type { TrackingCollar, TrackingRecord } from '@/types'

export function useTracking(petId: string | undefined) {
  const [collar, setCollar] = useState<TrackingCollar | null>(null)
  const [records, setRecords] = useState<TrackingRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!petId) return
    async function load() {
      const c = await getCollarForPet(petId as string)
      setCollar(c)
      if (c) {
        const r = await getTrackingRecords(c.id)
        setRecords(r)
      }
      setLoading(false)
    }
    load()
  }, [petId])

  const simulateUpdate = async (lat: number, lng: number) => {
    if (!collar) return
    const record = await addTrackingRecord(collar.id, lat, lng)
    if (record) setRecords((prev) => [...prev, record])
  }

  return { collar, records, loading, simulateUpdate }
}
