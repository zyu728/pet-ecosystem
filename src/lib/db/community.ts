import { createClient } from '@/lib/supabase/client'
import type { Post, PostComment } from '@/types'

export async function getFeed(): Promise<Post[]> {
  const supabase = createClient()
  const { data: posts, error } = await supabase
    .from('posts')
    .select('*, author:profiles!posts_author_id_fkey(nickname,avatar_url), pet:pets(name,species)')
    .order('created_at', { ascending: false })
    .limit(50)
  if (error) return []

  const { data: { user } } = await supabase.auth.getUser()
  const userId = user?.id

  // Get likes and comments counts + my likes
  const enriched = await Promise.all((posts || []).map(async (p: any) => {
    const { count: likesCount } = await supabase.from('post_likes').select('*', { count: 'exact', head: true }).eq('post_id', p.id)
    const { count: commentsCount } = await supabase.from('post_comments').select('*', { count: 'exact', head: true }).eq('post_id', p.id)
    let likedByMe = false
    if (userId) {
      const { data: like } = await supabase.from('post_likes').select('*').eq('post_id', p.id).eq('user_id', userId).single()
      likedByMe = !!like
    }
    return {
      id: p.id, author_id: p.author_id, pet_id: p.pet_id, content: p.content,
      images: p.images || [], created_at: p.created_at,
      author: p.author, pet: p.pet,
      likes_count: likesCount || 0, comments_count: commentsCount || 0, liked_by_me: likedByMe,
    } as Post
  }))

  return enriched
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
    return false // unliked
  } else {
    await supabase.from('post_likes').insert({ post_id: postId, user_id: userId })
    return true // liked
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
