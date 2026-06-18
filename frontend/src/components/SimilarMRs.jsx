const outcomeColors = {
  incident: { bg: 'bg-danger/10', text: 'text-danger', border: 'border-danger/20', label: 'Incident' },
  near_miss: { bg: 'bg-warning/10', text: 'text-warning', border: 'border-warning/20', label: 'Near Miss' },
  no_incident: { bg: 'bg-success/10', text: 'text-success', border: 'border-success/20', label: 'No Incident' },
}

export default function SimilarMRs({ mrs }) {
  if (!mrs?.length) return null

  return (
    <div className="glass rounded-2xl p-6 glass-hover">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-medium text-base-300 tracking-wider uppercase">Similar Historical MRs</h3>
        <span className="text-[10px] text-base-400">{mrs.length} matches</span>
      </div>
      <div className="space-y-3 max-h-[440px] overflow-y-auto pr-1">
        {mrs.map((mr, i) => {
          const oc = outcomeColors[mr.outcome] || outcomeColors.no_incident
          return (
            <div
              key={i}
              className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-4 transition-all duration-200 hover:border-brand/20"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1 rounded-md bg-brand/10 px-2 py-0.5 text-[10px] font-semibold text-brand-light">
                    {mr.mr}
                  </span>
                  {mr.author && (
                    <span className="rounded bg-white/[0.04] px-1.5 py-0.5 text-[10px] font-mono text-base-400">
                      @{mr.author}
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-base-500 shrink-0">{mr.date}</span>
              </div>
              <p className="text-sm text-base-300 leading-relaxed mb-3">{mr.description}</p>
              <div className="flex items-center gap-2">
                <span className={`rounded-full border px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${oc.bg} ${oc.text} ${oc.border}`}>
                  {oc.label}
                </span>
                <span className="flex items-center gap-1 text-[10px] text-base-400">
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Match: {mr.confidence}%
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
