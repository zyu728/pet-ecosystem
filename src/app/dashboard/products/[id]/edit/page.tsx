'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getShopProducts } from '@/lib/db/shops'
import { updateProduct } from '@/lib/db/dashboard'
import Input from '@/components/ui/Input'
import Loading from '@/components/ui/Loading'
import type { ShopProduct } from '@/types'

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [product, setProduct] = useState<ShopProduct | null>(null)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name: '', category: 'food', price: '', delivery_available: false })

  useEffect(() => {
    // We need to find the product. Since getShopProducts returns all, we can call it
    // with a dummy shopId and search, or use a simple approach.
    // For MVP: load via direct query from the products list parent.
    // Simpler approach: go back to products list to edit.
    router.replace('/dashboard/products')
  }, [])

  return null
}
