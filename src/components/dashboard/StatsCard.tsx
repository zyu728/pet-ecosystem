export default function StatsCard({ stats }: { stats: { label: string; value: number; color: string }[] }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map((s) => (
        <div key={s.label} className={`rounded-xl p-4 text-center ${s.color}`}>
          <p className="text-2xl font-bold">{s.value}</p>
          <p className="text-xs mt-1 opacity-70">{s.label}</p>
        </div>
      ))}
    </div>
  )
}
