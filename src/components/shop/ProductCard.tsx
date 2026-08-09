import type { ShopProduct } from '@/types'

const categoryLabels: Record<string, string> = { food: '食品', supplies: '用品', medicine: '药品', service: '服务' }

export default function ProductCard({ product, onBuy }: { product: ShopProduct; onBuy?: (p: ShopProduct) => void }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 flex gap-3">
      <div className="w-16 h-16 rounded-lg bg-gray-100 flex-shrink-0 flex items-center justify-center text-2xl">
        {product.category === 'food' ? '🦴' : product.category === 'medicine' ? '💊' : product.category === 'service' ? '🛁' : '🎾'}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div><h4 className="font-medium text-gray-900 text-sm">{product.name}</h4><span className="text-xs text-gray-400">{categoryLabels[product.category]}</span></div>
          <span className="text-orange-500 font-bold text-lg">¥{product.price}</span>
        </div>
        <div className="flex items-center justify-between mt-2">
          {product.delivery_available && <span className="text-xs text-green-500">🚚 支持配送</span>}
          {onBuy && <button onClick={() => onBuy(product)} className="bg-orange-500 text-white text-xs px-4 py-1.5 rounded-full font-medium">购买</button>}
        </div>
      </div>
    </div>
  )
}
