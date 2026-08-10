'use client'

import { useParams, useRouter } from 'next/navigation'

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  // Redirect back to products list - editing is done via modal on that page
  router.replace('/dashboard/products')
  return null
}
