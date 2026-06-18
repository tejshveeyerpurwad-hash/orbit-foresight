export default function FailurePrediction({ predictions, confidence }) {
  if (!predictions?.length) return null

  return (
    <div className="glass rounded-2xl p-6 glass-hover">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-medium text-base-300 tracking-wider uppercase">Predicted Incidents</h3>
        <span className="text-[10px] text-base-400">Next 4 weeks</span>
      </div>
      <div className="space-y-3">
        {predictions.map((p, i) => {
          const color = p.severity === 'critical' ? 'danger' : p.severity === 'high' ? 'warning' : p.severity === 'medium' ? 'brand' : 'success'
          const colorHex = color === 'danger' ? '#ef4444' : color === 'warning' ? '#f59e0b' : color === 'brand' ? '#06b6d4' : '#22c55e'
          return (
            <div
              key={i}
              className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-4 transition-all duration-200 hover:border-brand/20"
            >
              <div className="flex items-start justify-between mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`h-2 w-2 shrink-0 rounded-full`} style={{ backgroundColor: colorHex }} />
                  <span className="text-sm font-medium text-white truncate">{p.incident}</span>
                </div>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${
                  color === 'danger' ? 'bg-danger/10 text-danger' : color === 'warning' ? 'bg-warning/10 text-warning' : color === 'brand' ? 'bg-brand/10 text-brand-light' : 'bg-success/10 text-success'
                }`}>
                  {p.severity}
                </span>
              </div>
              <p className="text-xs text-base-400 mb-2 leading-relaxed">{p.description}</p>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex justify-between text-[10px] text-base-400 mb-1">
                    <span>Probability</span>
                    <span>{p.probability}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-base-600 overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${p.probability}%`,
                        backgroundColor: colorHex,
                        opacity: 0.7,
                      }}
                    />
                  </div>
                </div>
                <div className="text-[10px] text-base-500 shrink-0">{p.timeframe}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
