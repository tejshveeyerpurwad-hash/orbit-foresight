export default function TeamImpactAnalysis({ teams }) {
  if (!teams?.length) return null

  const impactColors = {
    high: { bg: 'bg-danger/10', text: 'text-danger', border: 'border-danger/20' },
    medium: { bg: 'bg-warning/10', text: 'text-warning', border: 'border-warning/20' },
    low: { bg: 'bg-success/10', text: 'text-success', border: 'border-success/20' },
  }

  return (
    <div className="glass rounded-2xl p-6 glass-hover">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-medium text-base-300 tracking-wider uppercase">Team Impact Analysis</h3>
        <span className="text-[10px] text-base-400">{teams.length} teams</span>
      </div>
      <div className="space-y-3">
        {teams.map((t, i) => {
          const ic = impactColors[t.impact] || impactColors.low
          return (
            <div
              key={i}
              className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-4 transition-all duration-200 hover:border-brand/20"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white">{t.team}</span>
                  <span className={`rounded-full border px-2 py-0.5 text-[9px] font-semibold uppercase ${ic.bg} ${ic.text} ${ic.border}`}>
                    {t.impact}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-base-400">
                  <span>{t.engineers} eng</span>
                  <span className="text-base-500">|</span>
                  <span>{t.workload}</span>
                </div>
              </div>
              <p className="text-xs text-base-300 leading-relaxed mb-2">{t.description}</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full bg-base-600 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${t.risk}%`,
                      backgroundColor: t.risk >= 70 ? '#ef4444' : t.risk >= 40 ? '#f59e0b' : '#06b6d4',
                      opacity: 0.7,
                    }}
                  />
                </div>
                <span className="text-[10px] font-mono text-base-400 w-8 text-right">{t.risk}%</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
