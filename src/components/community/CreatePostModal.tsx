'use client'

import { useState, useRef } from 'react'
import { useAuth } from '@/lib/hooks/useAuth'
import { usePets } from '@/lib/hooks/usePets'
import { createPost } from '@/lib/db/community'
import { uploadImages } from '@/lib/upload'
import Modal from '@/components/ui/Modal'

export default function CreatePostModal({ isOpen, onClose, onCreated }: { isOpen: boolean; onClose: () => void; onCreated: () => void }) {
  const { user } = useAuth()
  const { pets } = usePets(user?.id)
  const [content, setContent] = useState('')
  const [petId, setPetId] = useState<string>('')
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [posting, setPosting] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || [])
    setFiles(prev => [...prev, ...selected])
    selected.forEach(f => {
      const reader = new FileReader()
      reader.onload = () => setPreviews(prev => [...prev, reader.result as string])
      reader.readAsDataURL(f)
    })
  }

  const handlePost = async () => {
    if (!user || !content.trim()) return
    setPosting(true)
    let images: string[] = []
    if (files.length > 0) {
      images = await uploadImages(files)
    }
    await createPost(user.id, petId || null, content.trim(), images)
    setContent(''); setPetId(''); setFiles([]); setPreviews([])
    setPosting(false)
    onCreated()
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="发布动态">
      {pets.length > 0 && (
        <div className="mb-3">
          <select value={petId} onChange={(e) => setPetId(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none text-sm">
            <option value="">不关联宠物</option>
            {pets.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
      )}
      <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="分享你和宠物的故事..." rows={4} className="w-full border border-gray-200 rounded-xl px-3 py-3 outline-none focus:ring-2 focus:ring-orange-400 text-sm" />

      {/* 图片预览 */}
      {previews.length > 0 && (
        <div className="flex gap-2 mt-2 overflow-x-auto pb-2">
          {previews.map((p, i) => (
            <div key={i} className="relative flex-shrink-0">
              <img src={p} className="w-20 h-20 object-cover rounded-xl" alt="" />
              <button onClick={() => { setPreviews(previews.filter((_, j) => j !== i)); setFiles(files.filter((_, j) => j !== i)) }} className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">×</button>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2 mt-3">
        <button onClick={() => fileRef.current?.click()} className="flex-1 border border-dashed border-gray-300 rounded-xl py-2.5 text-sm text-gray-500">📷 添加图片</button>
        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />
        <button onClick={handlePost} disabled={posting || !content.trim()} className="flex-1 bg-orange-500 text-white rounded-xl py-2.5 text-sm font-medium disabled:opacity-50">
          {posting ? '发布中...' : '🐾 发布'}
        </button>
      </div>
    </Modal>
  )
}
