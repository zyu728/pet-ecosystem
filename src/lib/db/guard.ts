import { createClient } from '@/lib/supabase/client'
import type { LostPet } from '@/types'

export async function createLostReport(
  petId: string, ownerId: string,
  data: { last_seen_lat?: number; last_seen_lng?: number; last_seen_at?: string; note?: string; reward?: string; contact?: string }
): Promise<LostPet | null> {
  const supabase = createClient()
  const { data: lost, error } = await supabase
    .from('lost_pets')
    .insert({ pet_id: petId, owner_id: ownerId, ...data })
    .select()
    .single()
  if (error) return null

  // 自动发社区走失帖
  const { data: pet } = await supabase.from('pets').select('name, breed').eq('id', petId).single()
  const { data: user } = await supabase.auth.getUser()
  const petName = pet?.name || '宠物'
  const breed = pet?.breed || ''
  await supabase.from('posts').insert({
    author_id: ownerId,
    pet_id: petId,
    content: `【走失寻宠】${petName}（${breed}）走失了！最后出现: ${data.note || '位置未知'}。如有线索请立即联系${data.contact || user.user?.phone || '主人'}。${data.reward ? `悬赏: ${data.reward}` : ''}`,
    post_type: 'lost',
  })

  return lost as LostPet
}

export async function getLostPet(id: string): Promise<LostPet | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('lost_pets')
    .select('*, pet:pets(name,species,breed,avatar_url), owner:profiles(nickname,avatar_url)')
    .eq('id', id)
    .single()
  if (error) return null
  return data as LostPet
}

export async function getMyActiveLost(petId: string): Promise<LostPet | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('lost_pets')
    .select('*')
    .eq('pet_id', petId)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (error) return null
  return data as LostPet
}

export async function getActiveLostPets(): Promise<LostPet[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('lost_pets')
    .select('*, pet:pets(name,species,breed,avatar_url)')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
  if (error) return []
  return data as LostPet[]
}

export async function markFound(lostId: string): Promise<boolean> {
  const supabase = createClient()
  const { error } = await supabase
    .from('lost_pets')
    .update({ status: 'found', found_at: new Date().toISOString() })
    .eq('id', lostId)
  return !error
}

export async function addSighting(lostId: string, userId: string, content: string): Promise<boolean> {
  const supabase = createClient()
  // 目击线索以社区评论形式添加（走失帖评论区）
  const { data: lost } = await supabase.from('lost_pets').select('pet_id, owner_id').eq('id', lostId).single()
  if (!lost) return false
  // 找到对应的社区帖
  const { data: post } = await supabase
    .from('posts')
    .select('id')
    .eq('pet_id', lost.pet_id)
    .eq('post_type', 'lost')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (!post) return false
  const { error } = await supabase
    .from('post_comments')
    .insert({ post_id: post.id, author_id: userId, content: `👀 目击线索: ${content}` })
  return !error
}
