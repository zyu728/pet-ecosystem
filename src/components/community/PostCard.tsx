'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { IconHeart, IconChat } from '@/components/ui/Icons'
import { toggleLike, deletePost, getComments, addComment, toggleFollow, isFollowing } from '@/lib/db/community'
import type { Post, PostComment } from '@/types'

export default function PostCard({ post, onUpdate }: { post: Post; onUpdate: () => void }) {
  const { user } = useAuth()
  const router = useRouter()
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState<PostComment[]>([])
  const [commentText, setCommentText] = useState('')
  const [loadingComments, setLoadingComments] = useState(false)
  const [following, setFollowing] = useState(false)

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

  // Check follow status
  useEffect(() => {
    if (!user || isMine) return
    isFollowing(user.id, post.author_id).then(setFollowing)
  }, [user, post.author_id, isMine])

  const handleFollow = async () => {
    if (!user) { router.push('/auth/login'); return }
    const ok = await toggleFollow(user.id, post.author_id)
    setFollowing(ok)
  }

  const typeStyles: Record<string, string> = {
    normal: '',
    help: '',
    lost: '',
  }
  const typeBadge: Record<string, { label: string; cls: string }> = {
    help: { label: '求助', cls: 'text-status-danger border-status-danger/30 bg-red-50' },
    lost: { label: '走失', cls: 'text-status-warning border-status-warning/30 bg-amber-50' },
  }

  return (
    <div className={`card p-4 ${typeStyles[(post as any).post_type || 'normal']}`}>
      {/* 头部 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-surface-subtle text-ink-secondary flex items-center justify-center text-[13px] font-medium">
            {post.author?.nickname?.[0] || '宠'}
          </div>
          <div>
            <p className="text-[13px] font-medium text-ink-primary">{post.author?.nickname || '宠友'}</p>
            <p className="text-[11px] text-ink-muted tabular">{timeStr}{post.pet ? ` · ${post.pet.name}` : ''}</p>
          </div>
          {(post as any).post_type !== 'normal' && (
            <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${typeBadge[(post as any).post_type].cls}`}>{typeBadge[(post as any).post_type].label}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {!isMine && user && (
            <button onClick={handleFollow} aria-label={following ? '取消关注' : '关注该用户'} className={`text-[11px] px-2.5 py-1 rounded-btn font-medium transition-colors ${following ? 'text-ink-muted border border-line-hairline' : 'bg-ink-primary text-white'}`}>
              {following ? '已关注' : '关注'}
            </button>
          )}
          {isMine && <button onClick={handleDelete} className="text-ink-muted text-[11px]">删除</button>}
        </div>
      </div>

      {/* 内容 */}
      <p className="text-[14px] text-ink-primary leading-relaxed mb-3">{post.content}</p>
      {post.images && post.images.length > 0 && (
        <div className={`grid gap-1.5 mb-3 ${post.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
          {post.images.map((img, i) => (
            <img key={i} src={img} alt="" className="w-full h-44 object-cover rounded-btn" loading="lazy" />
          ))}
        </div>
      )}

      {/* 操作栏 */}
      <div className="flex items-center gap-5 border-t border-line-hairline pt-2.5">
        <button onClick={handleLike} aria-label={post.liked_by_me ? '取消点赞' : '点赞'} className={`flex items-center gap-1.5 text-[13px] tabular transition-colors ${post.liked_by_me ? 'text-status-danger' : 'text-ink-muted hover:text-ink-secondary'}`}>
          <IconHeart size={16} filled={post.liked_by_me} /> {post.likes_count || 0}
        </button>
        <button onClick={loadComments} aria-label="查看评论" className="flex items-center gap-1.5 text-[13px] tabular text-ink-muted hover:text-ink-secondary transition-colors">
          <IconChat size={16} /> {post.comments_count || 0}
        </button>
      </div>

      {/* 评论列表 */}
      {showComments && (
        <div className="border-t border-line-hairline mt-2.5 pt-2.5">
          {loadingComments ? (
            <p className="text-xs text-ink-muted text-center py-2">加载中</p>
          ) : comments.length === 0 ? (
            <p className="text-xs text-ink-muted text-center py-2">暂无评论</p>
          ) : (
            <div className="space-y-1.5 mb-2.5">
              {comments.map((c) => (
                <div key={c.id} className="bg-surface-subtle rounded-btn px-3 py-2">
                  <p className="text-xs leading-relaxed"><span className="font-medium text-ink-primary">{c.author?.nickname || '宠友'}</span> <span className="text-ink-secondary">{c.content}</span></p>
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <input type="text" value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="写评论…" className="flex-1 bg-surface-subtle rounded-btn px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-ink-faint" />
            <button onClick={handleAddComment} disabled={!commentText.trim()} className="text-ink-primary text-xs font-medium disabled:opacity-30">发送</button>
          </div>
        </div>
      )}
    </div>
  )
}
