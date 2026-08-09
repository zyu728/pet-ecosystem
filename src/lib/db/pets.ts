import { createClient } from '@/lib/supabase/client'
import type { Pet } from '@/types'

export async function getMyPets(userId: string): Promise<Pet[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('pets')
    .select('*')
    .eq('owner_id', userId)
    .order('created_at', { ascending: false })
  if (error) return []
  return data as Pet[]
}

export async function getPet(petId: string): Promise<Pet | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('pets')
    .select('*')
    .eq('id', petId)
    .single()
  if (error) return null
  return data as Pet
}

export async function createPet(
  pet: Omit<Pet, 'id' | 'created_at'>
): Promise<Pet | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('pets')
    .insert(pet)
    .select()
    .single()
  if (error) return null
  return data as Pet
}

export async function updatePet(
  petId: string,
  updates: Partial<Omit<Pet, 'id' | 'owner_id' | 'created_at'>>
): Promise<Pet | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('pets')
    .update(updates)
    .eq('id', petId)
    .select()
    .single()
  if (error) return null
  return data as Pet
}

export async function deletePet(petId: string): Promise<boolean> {
  const supabase = createClient()
  const { error } = await supabase
    .from('pets')
    .delete()
    .eq('id', petId)
  return !error
}
