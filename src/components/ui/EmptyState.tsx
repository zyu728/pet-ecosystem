import Link from 'next/link'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: { label: string; href?: string; onClick?: () => void }
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 animate-fade-in">
      {icon && (
        <div className="w-14 h-14 mb-4 rounded-full bg-surface-subtle flex items-center justify-center text-ink-muted">
          {icon}
        </div>
      )}
      <p className="text-sm font-medium text-ink-secondary mb-1">{title}</p>
      {description && <p className="text-xs text-ink-muted text-center leading-relaxed">{description}</p>}
      {action && (
        action.href ? (
          <Link href={action.href} className="mt-4 px-5 py-2 rounded-btn bg-ink-primary text-white text-[13px] font-medium press">
            {action.label}
          </Link>
        ) : (
          <button onClick={action.onClick} className="mt-4 px-5 py-2 rounded-btn bg-ink-primary text-white text-[13px] font-medium press">
            {action.label}
          </button>
        )
      )}
    </div>
  )
}
