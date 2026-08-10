'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getShop, getShopProducts } from '@/lib/db/shops'
import { createOrder } from '@/lib/db/orders'
import { useAuth } from '@/lib/hooks/useAuth'
import ProductCard from '@/components/shop/ProductCard'
import Modal from '@/components/ui/Modal'
import Loading from '@/components/ui/Loading'
import type { Shop, ShopProduct } from '@/types'

export default function ShopDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { user } = useAuth()
  const [shop, setShop] = useState<Shop | null>(null)
  const [products, setProducts] = useState<ShopProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState<ShopProduct | null>(null)
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [orderSuccess, setOrderSuccess] = useState(false)

  useEffect(() => { async function load() { const [s, p] = await Promise.all([getShop(id), getShopProducts(id)]); setShop(s); setProducts(p); setLoading(false) } load() }, [id])

  const handleBuy = (product: ShopProduct) => {
    if (!user) { router.push('/auth/login'); return }
    setSelectedProduct(product); setDeliveryAddress(''); setOrderSuccess(false)
  }

  const handleConfirmOrder = async () => {
    if (!selectedProduct || !user || !deliveryAddress.trim()) return
    await createOrder(user.id, shop!.id, [{ product_id: selectedProduct.id, product_name: selectedProduct.name, quantity: 1, price: selectedProduct.price }], selectedProduct.price, deliveryAddress)
    setOrderSuccess(true)
    setTimeout(() => { setSelectedProduct(null); setOrderSuccess(false) }, 2000)
  }

  if (loading) return <Loading />
  if (!shop) return <div className="p-8 text-center text-gray-400">店铺不存在</div>

  return (
    <div className="pb-6">
      <div className="h-48 bg-gradient-to-b from-orange-100 to-orange-50 flex items-center justify-center text-6xl">
        {shop.type === 'pet_hospital' ? '🏥' : shop.type === 'grooming' ? '✂️' : '🏪'}
      </div>
      <button onClick={() => router.back()} className="absolute top-4 left-4 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center text-gray-600 shadow">←</button>

      <div className="px-4 -mt-6 relative z-10">
        <div className="bg-white rounded-2xl shadow-lg p-5">
          <h1 className="text-xl font-bold">{shop.name}</h1>
          <p className="text-gray-500 text-sm mt-1">{shop.type === 'pet_hospital' ? '宠物医院' : shop.type === 'grooming' ? '美容洗护' : '宠物店'}{shop.rating > 0 && <span className="ml-2">⭐ {shop.rating.toFixed(1)}</span>}</p>
          <p className="text-gray-500 text-sm mt-1">📍 {shop.address}</p>
          {shop.business_hours && <p className="text-gray-500 text-sm">🕐 {shop.business_hours}</p>}
          {shop.phone && <p className="text-gray-500 text-sm">📞 {shop.phone}</p>}
          {shop.description && <p className="text-gray-600 text-sm mt-3 leading-relaxed">{shop.description}</p>}

          <div className="flex gap-3 mt-4">
            <button onClick={() => window.open(`https://uri.amap.com/navigation?to=${shop.lng},${shop.lat},${encodeURIComponent(shop.name)}`, '_blank')} className="flex-1 border border-gray-300 text-gray-700 rounded-lg py-2 text-sm font-medium">🧭 导航</button>
            <button onClick={() => router.push('/messages')} className="flex-1 border border-gray-300 text-gray-700 rounded-lg py-2 text-sm font-medium">💬 咨询</button>
            <a href={`tel:${shop.phone}`} className="flex-1 bg-orange-500 text-white rounded-lg py-2 text-sm font-medium text-center">📞 电话</a>
          </div>
        </div>

        <div className="mt-4">
          <h2 className="text-lg font-bold mb-3">{shop.type === 'pet_hospital' ? '🩺 医疗服务' : shop.type === 'grooming' ? '✂️ 美容服务' : '🛍️ 商品与服务'}</h2>
          {products.length === 0 ? <p className="text-gray-400 text-center py-8">暂无商品</p> : <div className="space-y-3">{products.map((p) => <ProductCard key={p.id} product={p} onBuy={handleBuy} />)}</div>}
        </div>
      </div>

      <Modal isOpen={!!selectedProduct} onClose={() => setSelectedProduct(null)} title={orderSuccess ? (shop.payment_qr ? '📱 扫码支付' : '✅ 下单成功') : '确认订单'}>
        {orderSuccess ? (
          shop.payment_qr ? (
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">请使用微信或支付宝扫码付款</p>
              <p className="text-orange-500 font-bold text-xl mb-3">¥{selectedProduct?.price}</p>
              <img src={shop.payment_qr} alt="收款码" className="w-48 h-48 object-contain mx-auto rounded-xl border" />
              <p className="text-xs text-gray-400 mt-3">扫码付款后点击下方按钮</p>
              <button onClick={() => setSelectedProduct(null)} className="w-full bg-green-500 text-white py-3 rounded-lg font-medium mt-3">我已付款</button>
            </div>
          ) : (
            <div className="text-center py-4"><p className="text-4xl mb-2">🎉</p><p className="text-gray-600">订单已提交</p><p className="text-gray-400 text-sm mt-1">货到付款</p></div>
          )
        ) : selectedProduct && (
          <>
            <div className="bg-gray-50 rounded-lg p-3 mb-4"><p className="font-medium">{selectedProduct.name}</p><p className="text-orange-500 font-bold text-lg">¥{selectedProduct.price}</p></div>
            <div className="mb-4"><label className="block text-sm font-medium text-gray-700 mb-1">配送地址</label><input type="text" value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} placeholder="请输入收货地址" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-orange-400" /></div>
            <button onClick={handleConfirmOrder} disabled={!deliveryAddress.trim()} className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium disabled:bg-gray-300">确认下单</button>
          </>
        )}
      </Modal>
    </div>
  )
}
