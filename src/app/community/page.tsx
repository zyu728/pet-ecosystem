'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { getFeed } from '@/lib/db/community'
import PostCard from '@/components/community/PostCard'
import CreatePostModal from '@/components/community/CreatePostModal'
import TabBar from '@/components/layout/TabBar'
import EmptyState from '@/components/ui/EmptyState'
import Loading from '@/components/ui/Loading'
import { IconPlus } from '@/components/ui/Icons'
import type { Post } from '@/types'

export default function CommunityPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)

  const loadFeed = useCallback(async () => {
    setLoading(true)
    const p = await getFeed()
    setPosts(p)
    setLoading(false)
  }, [])

  useEffect(() => { loadFeed() }, [loadFeed])

  return (
    <>
      <div className="pb-14">
        <div className="page-header">
          <h1 className="text-[17px] font-semibold tracking-tight">社区</h1>
        </div>

        {loading ? <Loading /> : posts.length === 0 ? (
          <EmptyState icon="🐣" title="还没有动态" description="点击右下角 + 发布第一条" />
        ) : (
          <div className="px-4 py-3 space-y-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} onUpdate={loadFeed} />
            ))}
          </div>
        )}

        {/* FAB 发布按钮 */}
        <button
          onClick={() => {
            if (!user) { router.push('/auth/login'); return }
            setShowCreate(true)
          }}
          aria-label="发布新动态"
          className="fixed bottom-20 right-4 w-[52px] h-[52px] bg-ink-primary text-white rounded-full shadow-float-lg flex items-center justify-center press z-20"
        >
          <IconPlus size={22} />
        </button>
      </div>

      <CreatePostModal isOpen={showCreate} onClose={() => setShowCreate(false)} onCreated={loadFeed} />
      <TabBar />
    </>
  )
}
