export default function ImpactCard({ title, items, type = 'service' }) {
  const dotColor = type === 'service' ? 'bg-danger' : type === 'file' ? 'bg-brand' : 'bg-warning'

  return (
    <div className="glass rounded-2xl p-6 glass-hover">
      <h3 className="text-xs font-medium text-base-300 tracking-wider uppercase mb-4">{title}</h3>
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item}
            className="flex items-center gap-3 rounded-xl border border-white/[0.04] bg-white/[0.02] px-3.5 py-2.5 text-sm text-base-300 transition-colors hover:bg-white/[0.04] hover:text-base-200"
          >
            <span className="relative flex h-2 w-2 shrink-0">
              <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${dotColor} opacity-75`} />
              <span className={`relative inline-flex h-2 w-2 rounded-full ${dotColor}`} />
            </span>
            {type === 'file' ? (
              <span className="font-mono text-xs">{item}</span>
            ) : (
              <span>{item}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
