import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

export async function POST(request: Request) {
  if (!SERVICE_KEY) {
    return NextResponse.json({ ok: false, error: 'Server not configured' }, { status: 500 })
  }

  const body = await request.json()
  const { serial, lat, lng, battery } = body

  if (!serial || !lat || !lng) {
    return NextResponse.json({ ok: false, error: 'Missing serial/lat/lng' }, { status: 400 })
  }

  const adminClient = createClient(SUPABASE_URL, SERVICE_KEY)

  // Validate device
  const { data: collar, error: collarError } = await adminClient
    .from('tracking_collars')
    .select('id, pet_id')
    .eq('device_serial', serial)
    .single()

  if (collarError || !collar) {
    return NextResponse.json({ ok: false, error: 'Invalid device serial' }, { status: 403 })
  }

  // Insert tracking record
  await adminClient
    .from('tracking_records')
    .insert({ collar_id: collar.id, lat, lng })

  // Update collar status
  await adminClient
    .from('tracking_collars')
    .update({ last_ping_at: new Date().toISOString(), battery_level: battery || 80 })
    .eq('id', collar.id)

  // Check geofence
  let alert: string | null = null
  const { data: fence } = await adminClient
    .from('geofences')
    .select('*')
    .eq('pet_id', collar.pet_id)
    .single()

  if (fence?.enabled) {
    const R = 6371000
    const dLat = (lat - fence.lat) * Math.PI / 180
    const dLng = (lng - fence.lng) * Math.PI / 180
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(fence.lat * Math.PI / 180) * Math.cos(lat * Math.PI / 180) * Math.sin(dLng / 2) ** 2
    const distance = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    if (distance > fence.radius_meters) {
      alert = `宠物已离开安全区域（${Math.round(distance)}米）`
      // Get owner from pet
      const { data: pet } = await adminClient.from('pets').select('owner_id').eq('id', collar.pet_id).single()
      if (pet) {
        await adminClient.from('alerts').insert({
          user_id: pet.owner_id, pet_id: collar.pet_id, message: alert, lat, lng,
        })
      }
    }
  }

  return NextResponse.json({ ok: true, alert })
}
