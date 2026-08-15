'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { IconBack } from '@/components/ui/Icons'

interface SidebarProps {
  shopName?: string
}

export default function Sidebar({ shopName }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const links = [
    { href: '/dashboard/info', label: '店铺信息', match: '/dashboard/info' },
    { href: '/dashboard/products', label: '商品管理', match: '/dashboard/products' },
    { href: '/dashboard/orders', label: '订单管理', match: '/dashboard/orders' },
  ]

  return (
    <div className="bg-surface-card border-b border-line-hairline sticky top-0 z-10">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-1.5">
          <button onClick={() => router.push('/map')} aria-label="返回前台" className="w-8 h-8 -ml-2 flex items-center justify-center text-ink-muted hover:text-ink-primary transition-colors">
            <IconBack size={16} />
          </button>
          <h1 className="text-[15px] font-semibold tracking-tight text-ink-primary truncate max-w-[180px]">{shopName || '店铺管理'}</h1>
        </div>
      </div>
      <div className="flex gap-1.5 px-3 pb-2.5 overflow-x-auto">
        {links.map((link) => {
          const active = pathname.startsWith(link.match)
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-colors duration-150 border ${active ? 'bg-ink-primary text-white border-ink-primary' : 'bg-surface-subtle text-ink-secondary border-transparent'}`}
            >
              {link.label}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
