'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { createClient } from '@/lib/supabase/client'
import { IconMap, IconCommunity, IconSearch, IconChat, IconUser, IconSettings } from '@/components/ui/Icons'

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

  const Tab = ({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) => {
    const isActive = pathname.startsWith(href)
    return (
      <Link href={href} aria-label={label} className={`flex flex-col items-center justify-center relative gap-1 min-w-[48px] py-1.5 transition-colors duration-150 ${isActive ? 'text-ink-primary' : 'text-ink-muted'}`}>
        <span className="relative">
          {icon}
          {isActive && <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary-500" />}
        </span>
        <span className={`text-[10px] leading-none ${isActive ? 'font-medium' : 'font-normal'}`}>{label}</span>
      </Link>
    )
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-surface-card/95 backdrop-blur-lg border-t border-line-hairline safe-bottom max-w-[480px] mx-auto">
      <div className="flex justify-around items-center h-14">
        <Tab href="/map" icon={<IconMap size={21} />} label="地图" />
        <Tab href="/community" icon={<IconCommunity size={21} />} label="社区" />
        <Tab href="/discover" icon={<IconSearch size={21} />} label="发现" />
        {isShopOwner && <Tab href="/dashboard" icon={<IconSettings size={21} />} label="管理" />}
        <Tab href="/messages" icon={<IconChat size={21} />} label="消息" />
        <Link href="/profile" aria-label="我的" className={`flex flex-col items-center justify-center relative gap-1 min-w-[48px] py-1.5 transition-colors duration-150 ${pathname.startsWith('/profile') ? 'text-ink-primary' : 'text-ink-muted'}`}>
          <span className="relative">
            <IconUser size={21} />
            {unreadAlerts > 0 && (
              <span className="absolute -top-1 -right-1.5 min-w-[14px] h-[14px] px-0.5 rounded-full bg-status-danger text-white text-[9px] leading-[14px] text-center font-medium">{unreadAlerts > 9 ? '9+' : unreadAlerts}</span>
            )}
            {pathname.startsWith('/profile') && <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary-500" />}
          </span>
          <span className={`text-[10px] leading-none ${pathname.startsWith('/profile') ? 'font-medium' : 'font-normal'}`}>我的</span>
        </Link>
      </div>
    </nav>
  )
}
