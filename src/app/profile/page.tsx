'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/hooks/useAuth'
import { usePets } from '@/lib/hooks/usePets'
import { subscribeUser } from '@/lib/db/profiles'
import { createCollar } from '@/lib/db/tracking'
import { generateDeviceSerial } from '@/lib/utils/helpers'
import TabBar from '@/components/layout/TabBar'
import Avatar from '@/components/ui/Avatar'
import Modal from '@/components/ui/Modal'
import Loading from '@/components/ui/Loading'
import Link from 'next/link'
import PetCard from '@/components/pet/PetCard'
import type { Pet } from '@/types'

export default function ProfilePage() {
  const { user, profile, loading: authLoading, signOut } = useAuth()
  const { pets, loading: petsLoading, refresh } = usePets(user?.id)
  const [showSubscribe, setShowSubscribe] = useState(false)
  const [subscribeForm, setSubscribeForm] = useState({ address: '', petId: '' })
  const [subscribed, setSubscribed] = useState(false)

  if (authLoading) return <Loading />
  if (!user) {
    return (
      <>
        <div className="pb-14 flex flex-col items-center justify-center min-h-[60vh]"><p className="text-5xl mb-4">🐾</p><p className="text-gray-600 mb-1 font-semibold text-lg">欢迎来到宠物生态平台</p><p className="text-gray-400 text-sm mb-6">登录后可管理宠物、查看追踪、与宠友交流</p><Link href="/auth/login" className="bg-orange-500 text-white px-8 py-3 rounded-full font-medium">手机号登录</Link></div>
        <TabBar />
      </>
    )
  }

  const handleSubscribe = async () => {
    if (!subscribeForm.address.trim() || !subscribeForm.petId) return
    await subscribeUser(user.id)
    await createCollar(user.id, subscribeForm.petId, generateDeviceSerial())
    setSubscribed(true); refresh()
  }

  return (
    <>
      <div className="pb-14">
        <div className="bg-gradient-to-b from-orange-100 to-white px-4 pt-8 pb-4">
          <div className="flex items-center gap-4">
            <Avatar src={profile?.avatar_url} name={profile?.nickname || '用户'} size="xl" />
            <div>
              <h2 className="text-xl font-bold">{profile?.nickname || '宠友'}</h2>
              <p className="text-gray-500 text-sm">{profile?.phone || user.phone || ''}</p>
              <span className={`inline-block text-xs px-2 py-0.5 rounded-full mt-1 ${profile?.is_subscribed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                {profile?.is_subscribed ? '✅ 已订阅 · 已领项圈' : '📦 未订阅'}
              </span>
            </div>
          </div>
        </div>

        {!profile?.is_subscribed && (
          <div className="px-4 mt-3">
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🎁</span>
                <div className="flex-1"><p className="font-bold text-amber-800">订阅即送GPS追踪项圈</p><p className="text-xs text-amber-600">实时查看宠物位置，永不离线</p></div>
                <button onClick={() => setShowSubscribe(true)} className="bg-orange-500 text-white px-4 py-1.5 rounded-full text-sm font-medium">立即领取</button>
              </div>
            </div>
          </div>
        )}

        <div className="px-4 mt-4">
          <div className="flex items-center justify-between mb-3"><h3 className="font-bold text-lg">🐾 我的宠物</h3><Link href="/pets/new" className="text-orange-500 text-sm font-medium">+ 添加</Link></div>
          {petsLoading ? <Loading /> : pets.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-xl"><p className="text-3xl mb-2">🐣</p><p className="text-gray-400 text-sm">还没有宠物档案</p><Link href="/pets/new" className="text-orange-500 text-sm mt-1 inline-block">创建第一个 →</Link></div>
          ) : (
            <div className="space-y-3">{pets.map((pet: Pet) => <PetCard key={pet.id} pet={pet} />)}</div>
          )}
        </div>

        <div className="px-4 mt-6">
          <h3 className="font-bold text-lg mb-3">⚡ 快捷功能</h3>
          <div className="grid grid-cols-3 gap-3">
            {[{ icon: '📍', label: '宠物追踪', href: '/pets/tracking' }, { icon: '📦', label: '我的订单', href: '/orders' }, { icon: '⚙️', label: '设置', href: '#' }].map((item) => (
              <Link key={item.label} href={item.href} className="bg-gray-50 rounded-xl p-3 text-center active:scale-95 transition-all"><p className="text-2xl mb-1">{item.icon}</p><p className="text-xs text-gray-600">{item.label}</p></Link>
            ))}
          </div>
        </div>

        <div className="px-4 mt-8 mb-6"><button onClick={() => signOut()} className="w-full text-gray-400 text-sm py-3">退出登录</button></div>
      </div>
      <TabBar />

      <Modal isOpen={showSubscribe} onClose={() => setShowSubscribe(false)} title={subscribed ? '🎉 领取成功' : '🎁 订阅送追踪项圈'}>
        {subscribed ? (
          <div className="text-center py-4"><p className="text-4xl mb-3">🎉</p><p className="font-semibold text-gray-900">恭喜！您已成功订阅</p><p className="text-gray-500 text-sm mt-1">GPS追踪项圈将在3-5个工作日内发货</p><button onClick={() => setShowSubscribe(false)} className="bg-orange-500 text-white w-full py-3 rounded-lg font-medium mt-4">知道了</button></div>
        ) : (
          <>
            <p className="text-gray-500 text-sm mb-4">订阅平台即可<b>免费获得</b>GPS宠物追踪项圈。</p>
            {pets.length === 0 ? (
              <div className="text-center py-4"><p className="text-gray-400 mb-3">请先创建宠物档案</p><Link href="/pets/new" className="text-orange-500 font-medium" onClick={() => setShowSubscribe(false)}>→ 去创建</Link></div>
            ) : (
              <>
                <div className="mb-4"><label className="block text-sm font-medium text-gray-700 mb-1">佩戴项圈的宠物</label><select value={subscribeForm.petId} onChange={(e) => setSubscribeForm({ ...subscribeForm, petId: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none"><option value="">请选择</option>{pets.map((p: Pet) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
                <div className="mb-4"><label className="block text-sm font-medium text-gray-700 mb-1">收货地址</label><input type="text" value={subscribeForm.address} onChange={(e) => setSubscribeForm({ ...subscribeForm, address: e.target.value })} placeholder="请输入收货地址" className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-orange-400" /></div>
                <button onClick={handleSubscribe} disabled={!subscribeForm.address.trim() || !subscribeForm.petId} className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium disabled:opacity-50">确认订阅并领取项圈</button>
              </>
            )}
          </>
        )}
      </Modal>
    </>
  )
}
