'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isRegister, setIsRegister] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async () => {
    setLoading(true); setError('')

    if (isRegister) {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setError('注册失败: ' + error.message)
      else setError('')
      // After signup, auto-login
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError('登录失败: ' + error.message)
    else { router.push('/map'); router.refresh() }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-b from-orange-50 to-white">
      <div className="mb-8 text-center">
        <div className="text-6xl mb-4">🐾</div>
        <h1 className="text-2xl font-bold text-gray-900">宠物生态平台</h1>
        <p className="text-gray-500 mt-2">商丘 · 宠物生活新方式</p>
      </div>

      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-6">
        <div className="flex mb-4 bg-gray-100 rounded-lg p-1">
          <button onClick={() => setIsRegister(false)} className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${!isRegister ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}>登录</button>
          <button onClick={() => setIsRegister(true)} className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${isRegister ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}>注册</button>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">邮箱</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="请输入邮箱" className="w-full border border-gray-300 rounded-lg px-3 py-3 outline-none focus:ring-2 focus:ring-orange-400 text-gray-900" />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">密码</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="请输入密码（至少6位）" className="w-full border border-gray-300 rounded-lg px-3 py-3 outline-none focus:ring-2 focus:ring-orange-400 text-gray-900" />
        </div>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <button onClick={handleSubmit} disabled={loading || !email.includes('@') || password.length < 6}
          className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium disabled:bg-gray-300 disabled:cursor-not-allowed active:scale-[0.98] transition-all">
          {loading ? '处理中...' : isRegister ? '注册并登录' : '登录'}
        </button>
      </div>

      <p className="text-xs text-gray-400 mt-8">登录即表示同意《用户协议》和《隐私政策》</p>
    </div>
  )
}
