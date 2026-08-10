'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { toggleLike, deletePost, getComments, addComment } from '@/lib/db/community'
import type { Post, PostComment } from '@/types'

export default function PostCard({ post, onUpdate }: { post: Post; onUpdate: () => void }) {
  const { user } = useAuth()
  const router = useRouter()
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState<PostComment[]>([])
  const [commentText, setCommentText] = useState('')
  const [loadingComments, setLoadingComments] = useState(false)

  const handleLike = async () => {
    if (!user) { router.push('/auth/login'); return }
    await toggleLike(post.id, user.id)
    onUpdate()
  }

  const handleDelete = async () => {
    if (!confirm('确定删除这条动态？')) return
    await deletePost(post.id)
    onUpdate()
  }

  const loadComments = async () => {
    if (!showComments) {
      setLoadingComments(true)
      const c = await getComments(post.id)
      setComments(c)
      setLoadingComments(false)
    }
    setShowComments(!showComments)
  }

  const handleAddComment = async () => {
    if (!user || !commentText.trim()) return
    await addComment(post.id, user.id, commentText.trim())
    setCommentText('')
    const c = await getComments(post.id)
    setComments(c)
    onUpdate()
  }

  const isMine = user?.id === post.author_id
  const timeStr = new Date(post.created_at).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      {/* 头部 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center text-sm font-medium">
            {post.author?.nickname?.[0] || '🐾'}
          </div>
          <div>
            <p className="text-sm font-medium">{post.author?.nickname || '宠友'}</p>
            <p className="text-xs text-gray-400">{timeStr}{post.pet ? ` · ${post.pet.name}` : ''}</p>
          </div>
        </div>
        {isMine && (
          <button onClick={handleDelete} className="text-gray-300 text-xs">删除</button>
        )}
      </div>

      {/* 内容 */}
      <p className="text-gray-800 text-sm mb-3 leading-relaxed">{post.content}</p>

      {/* 操作栏 */}
      <div className="flex items-center gap-4 border-t pt-3">
        <button onClick={handleLike} className={`flex items-center gap-1 text-sm ${post.liked_by_me ? 'text-red-500' : 'text-gray-400'}`}>
          {post.liked_by_me ? '❤️' : '🤍'} {post.likes_count || 0}
        </button>
        <button onClick={loadComments} className="flex items-center gap-1 text-sm text-gray-400">
          💬 {post.comments_count || 0}
        </button>
      </div>

      {/* 评论列表 */}
      {showComments && (
        <div className="border-t mt-3 pt-3">
          {loadingComments ? (
            <p className="text-xs text-gray-400 text-center py-2">加载中...</p>
          ) : comments.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-2">暂无评论</p>
          ) : (
            <div className="space-y-2 mb-3">
              {comments.map((c) => (
                <div key={c.id} className="bg-gray-50 rounded-lg px-3 py-2">
                  <p className="text-xs"><span className="font-medium">{c.author?.nickname || '宠友'}</span> <span className="text-gray-500">{c.content}</span></p>
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <input type="text" value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="写评论..." className="flex-1 bg-gray-100 rounded-full px-3 py-1.5 text-xs outline-none" />
            <button onClick={handleAddComment} disabled={!commentText.trim()} className="text-orange-500 text-xs font-medium disabled:opacity-30">发送</button>
          </div>
        </div>
      )}
    </div>
  )
}
