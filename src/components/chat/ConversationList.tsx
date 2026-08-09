import Link from 'next/link'
import Avatar from '@/components/ui/Avatar'
import { formatDate } from '@/lib/utils/helpers'

export default function ConversationList({ conversations }: { conversations: any[] }) {
  if (conversations.length === 0) {
    return <div className="text-center py-20"><p className="text-4xl mb-3">💬</p><p className="text-gray-400">暂无消息</p><p className="text-gray-300 text-sm mt-1">去地图发现宠友，开始聊天吧</p></div>
  }
  return (
    <div className="divide-y">
      {conversations.map((conv) => (
        <Link key={conv.id} href={`/messages/${conv.id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 active:bg-gray-100">
          <Avatar src={conv.other_user?.avatar_url} name={conv.other_user?.nickname || '用户'} />
          <div className="flex-1 min-w-0"><p className="font-medium text-sm text-gray-900">{conv.other_user?.nickname || '未知用户'}</p></div>
          <span className="text-xs text-gray-400">{formatDate(conv.last_message_at)}</span>
        </Link>
      ))}
    </div>
  )
}
