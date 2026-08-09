'use client'

import { useState, useEffect } from 'react'
import { getConversations, getMessages, sendMessage, subscribeMessages } from '@/lib/db/messages'
import type { Message } from '@/types'

export function useConversations(userId: string | undefined) {
  const [conversations, setConversations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) { setConversations([]); setLoading(false); return }
    getConversations(userId).then((data) => {
      setConversations(data)
      setLoading(false)
    })
  }, [userId])

  return { conversations, loading }
}

export function useChat(conversationId: string | undefined) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!conversationId) return
    getMessages(conversationId).then((data) => {
      setMessages(data)
      setLoading(false)
    })

    const sub = subscribeMessages(conversationId, (newMsg) => {
      setMessages((prev) => [...prev, newMsg])
    })

    return () => { sub.unsubscribe() }
  }, [conversationId])

  const send = async (senderId: string, content: string, imageUrl?: string) => {
    if (!conversationId) return null
    const msg = await sendMessage(conversationId, senderId, content, imageUrl)
    if (msg) setMessages((prev) => [...prev, msg])
    return msg
  }

  return { messages, loading, send }
}
