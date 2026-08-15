import Link from 'next/link'
import { IconMap, IconCommunity, IconLocate } from '@/components/ui/Icons'

const features = [
  { icon: <IconMap size={20} />, title: '宠物地图', desc: '商丘宠物店与医院，一图尽览' },
  { icon: <IconCommunity size={20} />, title: '宠友社区', desc: '求助 · 走失 · 分享，互助同行' },
  { icon: <IconLocate size={20} />, title: '实时追踪', desc: 'GPS定位与电子围栏守护' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface-bg">
      {/* Hero */}
      <div className="pt-16 pb-10 px-6 text-center">
        <div className="w-14 h-14 mx-auto mb-6 rounded-2xl bg-ink-primary flex items-center justify-center text-ink-primary" aria-hidden>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3c-3 3-6 4.5-6 8a6 6 0 0012 0c0-3.5-3-5-6-8z" />
            <circle cx="9.5" cy="10.5" r="0.8" fill="white" stroke="none" />
            <circle cx="14.5" cy="10.5" r="0.8" fill="white" stroke="none" />
            <path d="M10.5 13c.5.5 2.5.5 3 0" />
          </svg>
        </div>
        <h1 className="text-[28px] font-bold tracking-tight text-ink-primary">商丘宠物生态平台</h1>
        <p className="text-sm text-ink-muted mt-2.5 leading-relaxed">找店铺 · 查医院 · 宠友交流 · 位置追踪</p>
      </div>

      {/* 功能列表 */}
      <div className="mx-6 mb-8 card divide-y divide-line-hairline">
        {features.map((f) => (
          <div key={f.title} className="flex items-center gap-4 px-4 py-4">
            <span className="text-ink-secondary flex-shrink-0">{f.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold tracking-tight text-ink-primary">{f.title}</p>
              <p className="text-xs text-ink-muted mt-0.5">{f.desc}</p>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-ink-faint flex-shrink-0">
              <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="px-6 space-y-2.5 pb-12">
        <Link href="/map" className="block w-full bg-ink-primary text-white text-center py-3.5 rounded-btn font-medium text-[15px] press">
          开始使用
        </Link>
        <Link href="/auth/login" className="block w-full bg-surface-card text-ink-secondary text-center py-3.5 rounded-btn font-medium text-[15px] border border-line-hairline press">
          登录 / 注册
        </Link>
      </div>

      <div className="text-center pb-10">
        <p className="text-[11px] text-ink-faint">商丘 · 宠物生活新方式</p>
      </div>
    </div>
  )
}
