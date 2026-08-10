'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { getFeed } from '@/lib/db/community'
import PostCard from '@/components/community/PostCard'
import CreatePostModal from '@/components/community/CreatePostModal'
import TabBar from '@/components/layout/TabBar'
import Loading from '@/components/ui/Loading'
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
        <div className="sticky top-0 bg-white z-10 px-4 pt-4 pb-2 border-b">
          <h1 className="text-xl font-bold">🐾 社区</h1>
        </div>

        {loading ? <Loading /> : posts.length === 0 ? (
          <div className="text-center py-20 px-4">
            <p className="text-4xl mb-3">🐣</p>
            <p className="text-gray-400 mb-2">还没有动态</p>
            <p className="text-gray-300 text-sm">点击右下角 + 发布第一条</p>
          </div>
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
          className="fixed bottom-20 right-4 w-14 h-14 bg-orange-500 text-white rounded-full shadow-lg flex items-center justify-center text-2xl active:scale-95 transition-all z-20"
        >
          +
        </button>
      </div>

      <CreatePostModal isOpen={showCreate} onClose={() => setShowCreate(false)} onCreated={loadFeed} />
      <TabBar />
    </>
  )
}
