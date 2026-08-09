import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types'

export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  if (error) return null
  return data as Profile
}

export async function updateProfile(
  userId: string,
  updates: Partial<Pick<Profile, 'nickname' | 'avatar_url' | 'phone' | 'lat' | 'lng'>>
): Promise<Profile | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
  if (error) return null
  return data as Profile
}

export async function subscribeUser(userId: string): Promise<boolean> {
  const supabase = createClient()
  const { error } = await supabase
    .from('profiles')
    .update({ is_subscribed: true })
    .eq('id', userId)
  return !error
}

export async function getOnlinePets(): Promise<Profile[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .not('lat', 'is', null)
    .not('lng', 'is', null)
  if (error) return []
  return data as Profile[]
}
