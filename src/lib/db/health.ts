import { createClient } from '@/lib/supabase/client'
import type { HealthRecord } from '@/types'

export async function getHealthRecords(petId: string): Promise<HealthRecord[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('health_records')
    .select('*')
    .eq('pet_id', petId)
    .order('record_date', { ascending: false })
  if (error) return []
  return data as HealthRecord[]
}

export async function addHealthRecord(
  record: Omit<HealthRecord, 'id' | 'created_at'>
): Promise<HealthRecord | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('health_records')
    .insert(record)
    .select()
    .single()
  if (error) return null
  return data as HealthRecord
}

export async function deleteHealthRecord(id: string): Promise<boolean> {
  const supabase = createClient()
  const { error } = await supabase.from('health_records').delete().eq('id', id)
  return !error
}

export async function getUpcomingVaccines(petId: string): Promise<HealthRecord[]> {
  const supabase = createClient()
  const today = new Date().toISOString().split('T')[0]
  const { data, error } = await supabase
    .from('health_records')
    .select('*')
    .eq('pet_id', petId)
    .eq('record_type', 'vaccine')
    .not('next_date', 'is', null)
    .gte('next_date', today)
    .order('next_date', { ascending: true })
  if (error) return []
  return data as HealthRecord[]
}

export async function getWeightHistory(petId: string): Promise<HealthRecord[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('health_records')
    .select('*')
    .eq('pet_id', petId)
    .eq('record_type', 'weight')
    .not('weight_kg', 'is', null)
    .order('record_date', { ascending: true })
  if (error) return []
  return data as HealthRecord[]
}
