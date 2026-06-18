const badges = {
  critical: { bg: 'bg-danger/10', text: 'text-danger', border: 'border-danger/20' },
  high: { bg: 'bg-warning/10', text: 'text-warning', border: 'border-warning/20' },
  medium: { bg: 'bg-brand/10', text: 'text-brand-light', border: 'border-brand/20' },
  low: { bg: 'bg-white/[0.04]', text: 'text-base-400', border: 'border-white/[0.06]' },
}

export default function RecommendedActions({ actions }) {
  if (!actions?.length) return null

  return (
    <div className="glass rounded-2xl p-6 glass-hover">
      <h3 className="text-xs font-medium text-base-300 tracking-wider uppercase mb-4">Recommended Actions</h3>
      <div className="space-y-2">
        {actions.map((a, i) => {
          const b = badges[a.priority] || badges.medium
          return (
            <div
              key={i}
              className={`flex items-center gap-3 rounded-xl border border-white/[0.04] bg-white/[0.02] px-4 py-3 transition-all duration-200 hover:${b.border} hover:${b.bg}`}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${b.bg} ${b.border} border`}>
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <span className="flex-1 text-sm text-base-300">{a.action}</span>
              <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${b.bg} ${b.text} ${b.border}`}>
                {a.priority}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
