export default function ServiceImpactViz({ services }) {
  if (!services?.length) return null

  return (
    <div className="glass rounded-2xl p-6 glass-hover">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-medium text-base-300 tracking-wider uppercase">Service Impact</h3>
        <span className="text-[10px] text-base-400">{services.length} services</span>
      </div>
      <div className="space-y-3">
        {services.map((s, i) => {
          const color = s.propagation_risk >= 70 ? 'danger' : s.propagation_risk >= 40 ? 'warning' : s.propagation_risk >= 20 ? 'brand' : 'success'
          const colorHex = color === 'danger' ? '#ef4444' : color === 'warning' ? '#f59e0b' : color === 'brand' ? '#06b6d4' : '#22c55e'
          return (
            <div key={i} className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: colorHex }} />
                  <span className="text-sm font-medium text-white truncate">{s.name}</span>
                </div>
                <div className={`rounded-full px-2 py-0.5 text-[9px] font-semibold ${
                  color === 'danger' ? 'bg-danger/10 text-danger' : color === 'warning' ? 'bg-warning/10 text-warning' : color === 'brand' ? 'bg-brand/10 text-brand-light' : 'bg-success/10 text-success'
                }`}>
                  {s.propagation_risk}%
                </div>
              </div>
              <div className="h-1.5 rounded-full bg-base-600 overflow-hidden mb-2">
                <div className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${s.propagation_risk}%`, backgroundColor: colorHex, opacity: 0.7 }}
                />
              </div>
              <div className="flex items-center gap-2 text-[10px] text-base-400">
                <span className="truncate">Depends on: {s.dependencies?.length ? s.dependencies.join(', ') : 'none'}</span>
                {s.impacted_by?.length > 0 && (
                  <>
                    <span className="text-base-500">|</span>
                    <span className="truncate">Impacted by: {s.impacted_by.join(', ')}</span>
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
