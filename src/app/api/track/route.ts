import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()
  const { serial, lat, lng, battery } = body

  if (!serial || !lat || !lng) {
    return NextResponse.json({ ok: false, error: 'Missing serial/lat/lng' }, { status: 400 })
  }

  // Service role client bypasses RLS
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Validate device
  const { data: collar, error: collarError } = await supabase
    .from('tracking_collars')
    .select('*, pets:pet_id(owner_id)')
    .eq('device_serial', serial)
    .single()

  if (collarError || !collar) {
    return NextResponse.json({ ok: false, error: 'Invalid device serial' }, { status: 403 })
  }

  // Use service_role key for write operations
  const adminClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Insert tracking record
  const { error: insertError } = await adminClient
    .from('tracking_records')
    .insert({ collar_id: collar.id, lat, lng })

  if (insertError) {
    return NextResponse.json({ ok: false, error: insertError.message }, { status: 500 })
  }

  // Update collar status
  await adminClient
    .from('tracking_collars')
    .update({ last_ping_at: new Date().toISOString(), battery_level: battery || 80 })
    .eq('id', collar.id)

  // Check geofence
  let alert: string | null = null
  const ownerId = (collar as any).pets?.owner_id
  if (ownerId) {
    const { data: fence } = await supabase
      .from('geofences')
      .select('*')
      .eq('pet_id', collar.pet_id)
      .single()

    if (fence) {
      const R = 6371000
      const dLat = (lat - fence.lat) * Math.PI / 180
      const dLng = (lng - fence.lng) * Math.PI / 180
      const a = Math.sin(dLat / 2) ** 2 + Math.cos(fence.lat * Math.PI / 180) * Math.cos(lat * Math.PI / 180) * Math.sin(dLng / 2) ** 2
      const distance = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

      if (distance > fence.radius_meters) {
        alert = `宠物已离开安全区域（${Math.round(distance)}米）`
        await adminClient.from('alerts').insert({
          user_id: ownerId, pet_id: collar.pet_id, message: alert, lat, lng,
        })
      }
    }
  }

  return NextResponse.json({ ok: true, alert })
}
