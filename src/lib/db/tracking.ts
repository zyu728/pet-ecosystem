import { createClient } from '@/lib/supabase/client'
import type { TrackingCollar, TrackingRecord } from '@/types'

export async function getCollarForPet(petId: string): Promise<TrackingCollar | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('tracking_collars')
    .select('*')
    .eq('pet_id', petId)
    .single()
  if (error) return null
  return data as TrackingCollar
}

export async function getTrackingRecords(
  collarId: string,
  limit: number = 100
): Promise<TrackingRecord[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('tracking_records')
    .select('*')
    .eq('collar_id', collarId)
    .order('recorded_at', { ascending: false })
    .limit(limit)
  if (error) return []
  return (data as TrackingRecord[]).reverse()
}

export async function addTrackingRecord(
  collarId: string,
  lat: number,
  lng: number
): Promise<TrackingRecord | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('tracking_records')
    .insert({ collar_id: collarId, lat, lng })
    .select()
    .single()
  if (error) return null

  await supabase
    .from('tracking_collars')
    .update({
      last_ping_at: new Date().toISOString(),
      battery_level: 85,
    })
    .eq('id', collarId)

  return data as TrackingRecord
}

export async function createCollar(
  ownerId: string,
  petId: string,
  deviceSerial: string
): Promise<TrackingCollar | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('tracking_collars')
    .insert({
      owner_id: ownerId,
      pet_id: petId,
      device_serial: deviceSerial,
    })
    .select()
    .single()
  if (error) return null
  return data as TrackingCollar
}
