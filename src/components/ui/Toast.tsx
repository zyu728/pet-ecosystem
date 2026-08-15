'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

type ToastType = 'success' | 'error' | 'info'

interface ToastItem { id: number; type: ToastType; message: string }

interface ToastCtx {
  toast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastCtx>({ toast: () => {} })

export const useToast = () => useContext(ToastContext)

let toastId = 0

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const toast = useCallback((message: string, type: ToastType = 'info') => {
    const id = ++toastId
    setToasts((prev) => [...prev, { id, type, message }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 2500)
  }, [])

  const dotColors: Record<ToastType, string> = {
    success: 'bg-status-success',
    error: 'bg-status-danger',
    info: 'bg-ink-muted',
  }

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[200] flex flex-col gap-2 w-[90%] max-w-[360px]">
        {toasts.map((t) => (
          <div key={t.id} className="flex items-center gap-2.5 bg-ink-primary/95 text-white px-4 py-2.5 rounded-btn shadow-float animate-scale-in">
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotColors[t.type]}`} />
            <p className="text-[13px] leading-snug">{t.message}</p>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
