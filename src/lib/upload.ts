'use client'

import { createClient } from '@/lib/supabase/client'

export async function uploadImage(file: File): Promise<string | null> {
  const supabase = createClient()
  const ext = file.name.split('.').pop() || 'jpg'
  const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  const { error } = await supabase.storage.from('uploads').upload(name, file, { upsert: true })
  if (error) return null
  const { data } = supabase.storage.from('uploads').getPublicUrl(name)
  return data.publicUrl
}

export async function uploadImages(files: File[]): Promise<string[]> {
  const urls = await Promise.all(files.map(uploadImage))
  return urls.filter(Boolean) as string[]
}
