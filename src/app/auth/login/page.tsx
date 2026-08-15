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
      const { error: signUpError } = await supabase.auth.signUp({ email, password })
      if (signUpError) { setError('注册失败: ' + signUpError.message); setLoading(false); return }
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    if (signInError) { setError('登录失败: ' + signInError.message); setLoading(false); return }
    router.push('/guard'); router.refresh()
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-surface-bg">
      <div className="mb-8 text-center">
        <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-ink-primary flex items-center justify-center">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3c-3 3-6 4.5-6 8a6 6 0 0012 0c0-3.5-3-5-6-8z" />
            <circle cx="9.5" cy="10.5" r="0.8" fill="white" stroke="none" />
            <circle cx="14.5" cy="10.5" r="0.8" fill="white" stroke="none" />
            <path d="M10.5 13c.5.5 2.5.5 3 0" />
          </svg>
        </div>
        <h1 className="text-[22px] font-bold tracking-tight text-ink-primary">宠物生态平台</h1>
        <p className="text-[13px] text-ink-muted mt-1.5">商丘 · 宠物生活新方式</p>
      </div>

      <div className="w-full max-w-sm bg-surface-card border border-line-hairline rounded-card p-6">
        <div className="flex mb-5 bg-surface-subtle rounded-btn p-1">
          <button onClick={() => setIsRegister(false)} className={`flex-1 py-2 rounded-[6px] text-[13px] font-medium transition-all duration-150 ${!isRegister ? 'bg-surface-card text-ink-primary shadow-hairline' : 'text-ink-muted'}`}>登录</button>
          <button onClick={() => setIsRegister(true)} className={`flex-1 py-2 rounded-[6px] text-[13px] font-medium transition-all duration-150 ${isRegister ? 'bg-surface-card text-ink-primary shadow-hairline' : 'text-ink-muted'}`}>注册</button>
        </div>

        <div className="mb-4">
          <label className="block text-[13px] font-medium text-ink-secondary mb-1.5">邮箱</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="请输入邮箱" className="w-full border border-line-hairline rounded-btn px-3.5 py-3 outline-none focus:border-ink-faint focus:ring-1 focus:ring-ink-faint text-sm text-ink-primary placeholder:text-ink-faint transition-colors" />
        </div>

        <div className="mb-4">
          <label className="block text-[13px] font-medium text-ink-secondary mb-1.5">密码</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="请输入密码（至少6位）" className="w-full border border-line-hairline rounded-btn px-3.5 py-3 outline-none focus:border-ink-faint focus:ring-1 focus:ring-ink-faint text-sm text-ink-primary placeholder:text-ink-faint transition-colors" />
        </div>

        {error && <p className="text-status-danger text-[13px] mb-3">{error}</p>}

        <button onClick={handleSubmit} disabled={loading || !email.includes('@') || password.length < 6}
          className="w-full bg-ink-primary text-white py-3 rounded-btn font-medium text-sm disabled:opacity-40 disabled:cursor-not-allowed press">
          {loading ? '处理中…' : isRegister ? '注册并登录' : '登录'}
        </button>
      </div>

      <p className="text-[11px] text-ink-faint mt-8">登录即表示同意《用户协议》和《隐私政策》</p>
    </div>
  )
}
