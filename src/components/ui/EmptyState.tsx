import Link from 'next/link'

interface EmptyStateProps {
  icon?: string
  title: string
  description?: string
  action?: { label: string; href?: string; onClick?: () => void }
}

export default function EmptyState({ icon = '📭', title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 animate-fade-in">
      <span className="text-5xl mb-4">{icon}</span>
      <p className="text-gray-500 font-medium mb-1">{title}</p>
      {description && <p className="text-gray-300 text-sm text-center">{description}</p>}
      {action && (
        action.href ? (
          <Link href={action.href} className="mt-5 bg-primary-500 text-white px-6 py-2.5 rounded-full text-sm font-medium shadow-float active:scale-95 transition-all">
            {action.label}
          </Link>
        ) : (
          <button onClick={action.onClick} className="mt-5 bg-primary-500 text-white px-6 py-2.5 rounded-full text-sm font-medium shadow-float active:scale-95 transition-all">
            {action.label}
          </button>
        )
      )}
    </div>
  )
}
