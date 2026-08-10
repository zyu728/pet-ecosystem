'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { createClient } from '@/lib/supabase/client'

export default function TabBar() {
  const pathname = usePathname()
  const { profile, user } = useAuth()
  const isShopOwner = profile?.role === 'shop_owner'
  const [unreadAlerts, setUnreadAlerts] = useState(0)

  useEffect(() => {
    if (!user) return
    const supabase = createClient()
    supabase.from('alerts').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('is_read', false).then(({ count }) => setUnreadAlerts(count || 0))
  }, [user, pathname])

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
      <Link href="/profile" className="flex flex-col items-center justify-center relative py-1">
        <span className={`text-xl transition-all duration-200 ${pathname.startsWith('/profile') ? 'scale-110' : ''}`}>👤</span>
        <span className={`text-[10px] mt-0.5 transition-colors duration-200 ${pathname.startsWith('/profile') ? 'text-primary-500 font-semibold' : 'text-gray-400'}`}>我的</span>
        {unreadAlerts > 0 && (
          <span className="absolute top-0 right-1/4 bg-red-500 text-white text-[9px] min-w-[16px] h-4 rounded-full flex items-center justify-center font-bold px-1">{unreadAlerts > 9 ? '9+' : unreadAlerts}</span>
        )}
        {pathname.startsWith('/profile') && <span className="absolute -bottom-1 w-1 h-1 bg-primary-500 rounded-full" />}
      </Link>
    </nav>
  )
}
