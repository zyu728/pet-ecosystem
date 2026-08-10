'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'

export default function TabBar() {
  const pathname = usePathname()
  const { profile } = useAuth()
  const isShopOwner = profile?.role === 'shop_owner'

  // 后台页面不显示前台 TabBar
  if (pathname.startsWith('/dashboard')) return null

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 flex justify-around items-center h-14 safe-bottom max-w-[480px] mx-auto">
      <Link href="/map" className={`flex flex-col items-center justify-center text-xs transition-colors ${pathname.startsWith('/map') ? 'text-orange-500' : 'text-gray-500'}`}>
        <span className="text-xl mb-0.5">📍</span><span>地图</span>
      </Link>
      <Link href="/community" className={`flex flex-col items-center justify-center text-xs transition-colors ${pathname.startsWith('/community') ? 'text-orange-500' : 'text-gray-500'}`}>
        <span className="text-xl mb-0.5">🐾</span><span>社区</span>
      </Link>
      <Link href="/discover" className={`flex flex-col items-center justify-center text-xs transition-colors ${pathname.startsWith('/discover') ? 'text-orange-500' : 'text-gray-500'}`}>
        <span className="text-xl mb-0.5">🔍</span><span>发现</span>
      </Link>
      {isShopOwner && (
        <Link href="/dashboard" className={`flex flex-col items-center justify-center text-xs transition-colors ${pathname.startsWith('/dashboard') ? 'text-orange-500' : 'text-gray-500'}`}>
          <span className="text-xl mb-0.5">⚙️</span><span>管理</span>
        </Link>
      )}
      <Link href="/messages" className={`flex flex-col items-center justify-center text-xs transition-colors ${pathname.startsWith('/messages') ? 'text-orange-500' : 'text-gray-500'}`}>
        <span className="text-xl mb-0.5">💬</span><span>消息</span>
      </Link>
      <Link href="/profile" className={`flex flex-col items-center justify-center text-xs transition-colors ${pathname.startsWith('/profile') ? 'text-orange-500' : 'text-gray-500'}`}>
        <span className="text-xl mb-0.5">👤</span><span>我的</span>
      </Link>
    </nav>
  )
}
