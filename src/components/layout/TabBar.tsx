'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const tabs = [
  { path: '/map', label: '地图', icon: '📍' },
  { path: '/discover', label: '发现', icon: '🔍' },
  { path: '/messages', label: '消息', icon: '💬' },
  { path: '/profile', label: '我的', icon: '👤' },
]

export default function TabBar() {
  const pathname = usePathname()
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 flex justify-around items-center h-14 safe-bottom max-w-[480px] mx-auto">
      {tabs.map((tab) => {
        const isActive = pathname.startsWith(tab.path)
        return (
          <Link key={tab.path} href={tab.path} className={`flex flex-col items-center justify-center text-xs transition-colors ${isActive ? 'text-orange-500' : 'text-gray-500'}`}>
            <span className="text-xl mb-0.5">{tab.icon}</span>
            <span>{tab.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
