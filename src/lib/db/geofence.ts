import { createClient } from '@/lib/supabase/client'
import type { Geofence, Alert } from '@/types'

export async function getGeofence(petId: string): Promise<Geofence | null> {
  const supabase = createClient()
  const { data, error } = await supabase.from('geofences').select('*').eq('pet_id', petId).single()
  if (error) return null
  return data as Geofence
}

export async function saveGeofence(
  petId: string, lat: number, lng: number, radiusMeters: number
): Promise<Geofence | null> {
  const supabase = createClient()
  // Upsert: one geofence per pet
  const { data: existing } = await supabase.from('geofences').select('id').eq('pet_id', petId).single()
  if (existing) {
    const { data, error } = await supabase.from('geofences').update({ lat, lng, radius_meters: radiusMeters }).eq('pet_id', petId).select().single()
    if (error) return null
    return data as Geofence
  } else {
    const { data, error } = await supabase.from('geofences').insert({ pet_id: petId, lat, lng, radius_meters: radiusMeters }).select().single()
    if (error) return null
    return data as Geofence
  }
}

// Calculate distance between two coordinates in meters (Haversine formula)
function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export async function checkGeofence(
  petId: string, lat: number, lng: number, userId: string
): Promise<Alert | null> {
  const fence = await getGeofence(petId)
  if (!fence || !fence.enabled) return null

  const distance = haversineDistance(fence.lat, fence.lng, lat, lng)
  if (distance <= fence.radius_meters) return null

  return createAlert(userId, petId, `宠物已离开安全区域（${Math.round(distance)}米）`, lat, lng)
}

export async function createAlert(
  userId: string, petId: string, message: string, lat?: number, lng?: number
): Promise<Alert | null> {
  const supabase = createClient()
  const { data, error } = await supabase.from('alerts').insert({
    user_id: userId, pet_id: petId, message, lat: lat || null, lng: lng || null,
  }).select().single()
  if (error) return null
  return data as Alert
}

export async function getAlerts(userId: string): Promise<Alert[]> {
  const supabase = createClient()
  const { data, error } = await supabase.from('alerts').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(50)
  if (error) return []
  return data as Alert[]
}

export async function getUnreadCount(userId: string): Promise<number> {
  const supabase = createClient()
  const { count, error } = await supabase.from('alerts').select('*', { count: 'exact', head: true }).eq('user_id', userId).eq('is_read', false)
  if (error) return 0
  return count || 0
}

export async function markAlertRead(alertId: string): Promise<boolean> {
  const supabase = createClient()
  const { error } = await supabase.from('alerts').update({ is_read: true }).eq('id', alertId)
  return !error
}

export async function markAllRead(userId: string): Promise<boolean> {
  const supabase = createClient()
  const { error } = await supabase.from('alerts').update({ is_read: true }).eq('user_id', userId).eq('is_read', false)
  return !error
}
