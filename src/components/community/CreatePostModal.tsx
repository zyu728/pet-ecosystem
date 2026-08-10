'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/hooks/useAuth'
import { usePets } from '@/lib/hooks/usePets'
import { createPost } from '@/lib/db/community'
import Modal from '@/components/ui/Modal'

export default function CreatePostModal({ isOpen, onClose, onCreated }: { isOpen: boolean; onClose: () => void; onCreated: () => void }) {
  const { user } = useAuth()
  const { pets } = usePets(user?.id)
  const [content, setContent] = useState('')
  const [petId, setPetId] = useState<string>('')
  const [posting, setPosting] = useState(false)

  const handlePost = async () => {
    if (!user || !content.trim()) return
    setPosting(true)
    await createPost(user.id, petId || null, content.trim())
    setContent('')
    setPetId('')
    setPosting(false)
    onCreated()
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="发布动态">
      {pets.length > 0 && (
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">关联宠物（可选）</label>
          <select value={petId} onChange={(e) => setPetId(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none text-sm">
            <option value="">不关联</option>
            {pets.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
      )}
      <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="分享你和宠物的故事..." rows={4} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-orange-400 text-sm" />
      <button onClick={handlePost} disabled={posting || !content.trim()} className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium mt-3 disabled:opacity-50">
        {posting ? '发布中...' : '🐾 发布'}
      </button>
    </Modal>
  )
}
