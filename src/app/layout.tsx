import type { Metadata, Viewport } from 'next'
import ClientLayout from '@/components/ClientLayout'
import './globals.css'

export const metadata: Metadata = {
  title: '宠物生态平台 · 商丘',
  description: '商丘宠物生活新方式 — 地图找店、宠物档案、追踪定位、宠友社交',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <ClientLayout>
          <main className="min-h-screen max-w-[480px] mx-auto relative bg-white shadow-lg">
            {children}
          </main>
        </ClientLayout>
      </body>
    </html>
  )
}
