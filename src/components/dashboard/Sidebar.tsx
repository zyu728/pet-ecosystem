'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

interface SidebarProps {
  shopName?: string
}

export default function Sidebar({ shopName }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const links = [
    { href: '/dashboard/info', label: '🏪 店铺信息', match: '/dashboard/info' },
    { href: '/dashboard/products', label: '📦 商品管理', match: '/dashboard/products' },
    { href: '/dashboard/orders', label: '📋 订单管理', match: '/dashboard/orders' },
  ]

  return (
    <div className="bg-white border-b sticky top-0 z-10">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <button onClick={() => router.push('/map')} className="text-gray-400">← 前台</button>
          <h1 className="font-bold text-gray-900 truncate max-w-[180px]">{shopName || '店铺管理'}</h1>
        </div>
      </div>
      <div className="flex gap-1 px-2 pb-2 overflow-x-auto">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              pathname.startsWith(link.match) ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  )
}
