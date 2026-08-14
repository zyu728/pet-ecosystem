import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-white">
      {/* Hero */}
      <div className="text-center pt-16 pb-8 px-6">
        <div className="text-7xl mb-4 animate-fade-in">🐾</div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">商丘宠物生态平台</h1>
        <p className="text-gray-500 text-sm">找店铺 · 查医院 · 宠友交流 · GPS追踪</p>
      </div>

      {/* 统计 */}
      <div className="flex justify-center gap-8 py-6">
        {[
          { num: '13', label: '宠物店铺' }, { num: '4', label: '宠物医院' }, { num: '0', label: '宠友在线', sub: '等你加入' }
        ].map((s) => (
          <div key={s.label} className="text-center">
            <p className="text-2xl font-extrabold text-orange-500">{s.num}</p>
            <p className="text-xs text-gray-400">{s.label}</p>
            {s.sub && <p className="text-[10px] text-gray-300">{s.sub}</p>}
          </div>
        ))}
      </div>

      {/* 功能卡片 */}
      <div className="px-6 grid grid-cols-2 gap-3 mb-6">
        {[
          { icon: '🗺️', title: '宠物地图', desc: '一键查找附近店铺' },
          { icon: '🐾', title: '宠友社区', desc: '晒宠·交流·求助' },
          { icon: '📍', title: 'GPS追踪', desc: '实时定位·电子围栏' },
          { icon: '🎁', title: '免费项圈', desc: '注册即送追踪项圈' },
        ].map((f) => (
          <div key={f.title} className="bg-white rounded-card shadow-card p-4 text-center">
            <div className="text-3xl mb-2">{f.icon}</div>
            <p className="font-bold text-sm text-gray-800">{f.title}</p>
            <p className="text-xs text-gray-400 mt-1">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="px-6 space-y-3">
        <Link href="/map" className="block w-full bg-orange-500 text-white text-center py-3.5 rounded-btn font-bold text-base shadow-float active:scale-[0.98] transition-all">
          🐾 直接开始使用
        </Link>
        <Link href="/auth/login" className="block w-full bg-white border border-gray-200 text-gray-700 text-center py-3.5 rounded-btn font-medium text-sm active:scale-[0.98] transition-all">
          登录 / 注册
        </Link>
      </div>

      {/* 底部 */}
      <div className="text-center py-8 mt-4">
        <p className="text-xs text-gray-300">商丘 · 宠物生活新方式</p>
        <p className="text-xs text-gray-300 mt-1">bare-lash.com</p>
      </div>
    </div>
  )
}
