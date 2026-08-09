import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '宠物生态平台 · 商丘',
  description: '商丘宠物生活新方式 — 地图找店、宠物档案、追踪定位、宠友社交',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <main className="min-h-screen max-w-[480px] mx-auto relative bg-white shadow-lg">
          {children}
        </main>
      </body>
    </html>
  )
}
