'use client'

import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/lib/hooks/useAuth'
import { useChat } from '@/lib/hooks/useMessages'
import { markAsRead } from '@/lib/db/messages'
import { uploadImage } from '@/lib/upload'
import { IconCamera } from '@/components/ui/Icons'

export default function ChatWindow({ conversationId }: { conversationId: string }) {
  const { user } = useAuth()
  const { messages, loading, send } = useChat(conversationId)
  const [text, setText] = useState('')
  const [uploading, setUploading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  // Mark messages as read
  useEffect(() => {
    if (!user) return
    markAsRead(conversationId, user.id)
  }, [conversationId, user])

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return
    setUploading(true)
    const url = await uploadImage(file)
    if (url) await send(user.id, '📷', url)
    setUploading(false)
  }

  const handleSend = async () => { if (!text.trim() || !user) return; await send(user.id, text.trim()); setText('') }

  if (loading) return <p className="text-center py-10 text-gray-400">加载中...</p>

  return (
    <div className="flex flex-col h-[calc(100vh-56px)]">
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.map((msg) => {
          const isMe = msg.sender_id === user?.id
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${isMe ? 'bg-ink-primary text-white rounded-br-md' : 'bg-surface-subtle text-ink-primary rounded-bl-md'}`}>
                {msg.content !== '📷' && msg.content}
                {msg.image_url && <img src={msg.image_url} alt="" className="mt-1 rounded-lg max-w-full" loading="lazy" />}
                <p className={`text-[10px] mt-1 flex items-center gap-1 tabular ${isMe ? 'text-white/50' : 'text-ink-muted'}`}>
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  {isMe && (msg as any).read_at && <span className="text-white/70">✓✓</span>}
                </p>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>
      <div className="border-t border-line-hairline bg-surface-card px-4 py-3 safe-bottom">
        <div className="flex items-center gap-2">
          <button onClick={() => fileRef.current?.click()} disabled={uploading} aria-label="发送图片" className="text-ink-muted flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-subtle transition-colors disabled:opacity-50">
            <IconCamera size={19} />
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
          <input type="text" value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSend() } }} placeholder="输入消息…" className="flex-1 bg-surface-subtle rounded-full px-4 py-2.5 outline-none text-sm text-ink-primary placeholder:text-ink-muted" />
          <button disabled={!text.trim()} onClick={handleSend} className="bg-ink-primary text-white px-5 py-2 rounded-full text-[13px] font-medium press disabled:opacity-40">发送</button>
        </div>
      </div>
    </div>
  )
}
