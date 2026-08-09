'use client'

import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import ChatWindow from '@/components/chat/ChatWindow'
import Loading from '@/components/ui/Loading'

export default function ChatPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { user, loading } = useAuth()
  if (loading) return <Loading />
  if (!user) { router.push('/auth/login'); return null }

  return (
    <>
      <div className="sticky top-0 bg-white z-10 px-4 py-3 border-b flex items-center gap-3">
        <button onClick={() => router.back()} className="text-gray-600">←</button>
        <h1 className="font-semibold">聊天</h1>
      </div>
      <ChatWindow conversationId={id} />
    </>
  )
}
