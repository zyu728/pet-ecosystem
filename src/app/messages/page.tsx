'use client'

import { useAuth } from '@/lib/hooks/useAuth'
import { useConversations } from '@/lib/hooks/useMessages'
import TabBar from '@/components/layout/TabBar'
import ConversationList from '@/components/chat/ConversationList'
import Loading from '@/components/ui/Loading'
import Link from 'next/link'

export default function MessagesPage() {
  const { user, loading: authLoading } = useAuth()
  const { conversations, loading } = useConversations(user?.id)
  if (authLoading) return <Loading />
  if (!user) {
    return (
      <>
        <div className="pb-14 flex flex-col items-center justify-center min-h-[60vh]"><p className="text-4xl mb-3">🔒</p><p className="text-gray-500 mb-4">请先登录后查看消息</p><Link href="/auth/login" className="bg-orange-500 text-white px-6 py-2 rounded-full text-sm">登录</Link></div>
        <TabBar />
      </>
    )
  }
  return (
    <>
      <div className="pb-14">
        <div className="sticky top-0 bg-white z-10 px-4 pt-4 pb-2"><h1 className="text-xl font-bold">💬 消息</h1></div>
        {loading ? <Loading /> : <ConversationList conversations={conversations} />}
      </div>
      <TabBar />
    </>
  )
}
