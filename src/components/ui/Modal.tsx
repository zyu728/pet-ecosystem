'use client'

import { useEffect } from 'react'
import { IconClose } from '@/components/ui/Icons'

interface ModalProps {
  isOpen: boolean; onClose: () => void; title?: string; children: React.ReactNode
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40 animate-fade-in" onClick={onClose} />
      <div className="relative bg-surface-card rounded-t-modal sm:rounded-modal w-full sm:max-w-md max-h-[85vh] overflow-y-auto animate-slide-up shadow-float-lg">
        {title && (
          <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-line-hairline">
            <h3 className="text-[15px] font-semibold tracking-tight text-ink-primary">{title}</h3>
            <button onClick={onClose} aria-label="关闭弹窗" className="w-8 h-8 -mr-2 flex items-center justify-center rounded-full text-ink-muted hover:bg-surface-subtle transition-colors">
              <IconClose size={16} />
            </button>
          </div>
        )}
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}
