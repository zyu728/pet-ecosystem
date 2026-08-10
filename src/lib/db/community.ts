import { createClient } from '@/lib/supabase/client'
import type { Post, PostComment } from '@/types'

export async function getFeed(): Promise<Post[]> {
  const supabase = createClient()

  // 1 query: posts with joins + counter columns
  const { data: posts, error } = await supabase
    .from('posts')
    .select('*, author:profiles!posts_author_id_fkey(nickname,avatar_url), pet:pets(name,species)')
    .order('created_at', { ascending: false })
    .limit(50)
  if (error || !posts) return []

  // 1 query: which posts the current user liked
  const { data: { user } } = await supabase.auth.getUser()
  let likedIds = new Set<string>()
  if (user) {
    const { data: likes } = await supabase.from('post_likes').select('post_id').eq('user_id', user.id)
    likedIds = new Set((likes || []).map((l: any) => l.post_id))
  }

  // Merge - no extra queries
  return posts.map((p: any) => ({
    id: p.id, author_id: p.author_id, pet_id: p.pet_id, content: p.content,
    images: p.images || [], created_at: p.created_at,
    author: p.author, pet: p.pet,
    likes_count: p.likes_count || 0, comments_count: p.comments_count || 0,
    liked_by_me: likedIds.has(p.id),
  })) as Post[]
}

export async function createPost(authorId: string, petId: string | null, content: string): Promise<Post | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('posts').insert({ author_id: authorId, pet_id: petId, content }).select().single()
  if (error) return null
  return data as Post
}

export async function deletePost(postId: string): Promise<boolean> {
  const supabase = createClient()
  const { error } = await supabase.from('posts').delete().eq('id', postId)
  return !error
}

export async function toggleLike(postId: string, userId: string): Promise<boolean> {
  const supabase = createClient()
  const { data: existing } = await supabase.from('post_likes').select('*').eq('post_id', postId).eq('user_id', userId).single()
  if (existing) {
    await supabase.from('post_likes').delete().eq('post_id', postId).eq('user_id', userId)
    return false
  } else {
    await supabase.from('post_likes').insert({ post_id: postId, user_id: userId })
    return true
  }
}

export async function getComments(postId: string): Promise<PostComment[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('post_comments')
    .select('*, author:profiles!post_comments_author_id_fkey(nickname,avatar_url)')
    .eq('post_id', postId)
    .order('created_at', { ascending: true })
  if (error) return []
  return (data || []).map((c: any) => ({
    id: c.id, post_id: c.post_id, author_id: c.author_id,
    content: c.content, created_at: c.created_at, author: c.author,
  }))
}

export async function addComment(postId: string, authorId: string, content: string): Promise<PostComment | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('post_comments').insert({ post_id: postId, author_id: authorId, content }).select().single()
  if (error) return null
  return data as PostComment
}
