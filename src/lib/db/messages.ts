import { createClient } from '@/lib/supabase/client'
import type { Message } from '@/types'

export async function getConversations(userId: string): Promise<any[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .or(`participant_1.eq.${userId},participant_2.eq.${userId}`)
    .order('last_message_at', { ascending: false })
  if (error || !data) return []

  const enriched = await Promise.all(
    data.map(async (conv) => {
      const otherId =
        conv.participant_1 === userId
          ? conv.participant_2
          : conv.participant_1
      const { data: profile } = await supabase
        .from('profiles')
        .select('id, nickname, avatar_url')
        .eq('id', otherId)
        .single()
      return { ...conv, other_user: profile }
    })
  )
  return enriched
}

export async function getOrCreateConversation(
  user1Id: string,
  user2Id: string
): Promise<string | null> {
  const supabase = createClient()
  const [p1, p2] = [user1Id, user2Id].sort()
  const { data: existing } = await supabase
    .from('conversations')
    .select('id')
    .eq('participant_1', p1)
    .eq('participant_2', p2)
    .single()
  if (existing) return existing.id

  const { data: created } = await supabase
    .from('conversations')
    .insert({ participant_1: p1, participant_2: p2 })
    .select('id')
    .single()
  return created?.id || null
}

export async function getMessages(conversationId: string): Promise<Message[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })
  if (error) return []
  return data as Message[]
}

export async function sendMessage(
  conversationId: string,
  senderId: string,
  content: string,
  imageUrl?: string
): Promise<Message | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_id: senderId,
      content,
      image_url: imageUrl || null,
    })
    .select()
    .single()
  if (error) return null

  await supabase
    .from('conversations')
    .update({ last_message_at: new Date().toISOString() })
    .eq('id', conversationId)
  return data as Message
}

export function subscribeMessages(
  conversationId: string,
  onMessage: (message: Message) => void
) {
  const supabase = createClient()
  return supabase
    .channel(`messages:${conversationId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`,
      },
      (payload) => onMessage(payload.new as Message)
    )
    .subscribe()
}
