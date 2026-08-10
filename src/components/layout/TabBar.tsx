'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'

export default function TabBar() {
  const pathname = usePathname()
  const { profile } = useAuth()
  const isShopOwner = profile?.role === 'shop_owner'

  if (pathname.startsWith('/dashboard')) return null

  const Tab = ({ href, icon, label }: { href: string; icon: string; label: string }) => {
    const isActive = pathname.startsWith(href)
    return (
      <Link href={href} className="flex flex-col items-center justify-center relative py-1">
        <span className={`text-xl transition-all duration-200 ${isActive ? 'scale-110' : ''}`}>{icon}</span>
        <span className={`text-[10px] mt-0.5 transition-colors duration-200 ${isActive ? 'text-primary-500 font-semibold' : 'text-gray-400'}`}>{label}</span>
        {isActive && <span className="absolute -bottom-1 w-1 h-1 bg-primary-500 rounded-full" />}
      </Link>
    )
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg flex justify-around items-center h-16 safe-bottom max-w-[480px] mx-auto border-t border-gray-100">
      <div className="absolute top-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-primary-400/30 to-transparent" />
      <Tab href="/map" icon="📍" label="地图" />
      <Tab href="/community" icon="🐾" label="社区" />
      <Tab href="/discover" icon="🔍" label="发现" />
      {isShopOwner && <Tab href="/dashboard" icon="⚙️" label="管理" />}
      <Tab href="/messages" icon="💬" label="消息" />
      <Tab href="/profile" icon="👤" label="我的" />
    </nav>
  )
}
