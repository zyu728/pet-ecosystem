export default function Loading({ text = '加载中' }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="w-5 h-5 border border-ink-faint border-t-ink-secondary rounded-full animate-spin" />
      <p className="text-xs text-ink-muted mt-3">{text}</p>
    </div>
  )
}
