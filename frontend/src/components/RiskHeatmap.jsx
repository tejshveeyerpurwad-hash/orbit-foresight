const cells = [
  { area: 'API Contracts', likelihood: 85, impact: 75, label: 'Critical' },
  { area: 'Data Integrity', likelihood: 60, impact: 90, label: 'Critical' },
  { area: 'Performance', likelihood: 70, impact: 55, label: 'High' },
  { area: 'Security', likelihood: 25, impact: 95, label: 'High' },
  { area: 'Monitoring', likelihood: 65, impact: 40, label: 'Medium' },
  { area: 'Compliance', likelihood: 15, impact: 80, label: 'Medium' },
  { area: 'Dependencies', likelihood: 80, impact: 30, label: 'Medium' },
  { area: 'Documentation', likelihood: 35, impact: 20, label: 'Low' },
  { area: 'Testing', likelihood: 55, impact: 45, label: 'Medium' },
  { area: 'Deployment', likelihood: 45, impact: 60, label: 'High' },
  { area: 'Rollback', likelihood: 30, impact: 70, label: 'High' },
  { area: 'Telemetry', likelihood: 50, impact: 25, label: 'Low' },
]

function heatColor(likelihood, impact) {
  const score = likelihood * impact / 100
  if (score >= 60) return { bg: 'rgba(239,68,68,0.2)', text: '#ef4444', border: 'rgba(239,68,68,0.3)' }
  if (score >= 30) return { bg: 'rgba(245,158,11,0.2)', text: '#f59e0b', border: 'rgba(245,158,11,0.3)' }
  if (score >= 15) return { bg: 'rgba(6,182,212,0.15)', text: '#06b6d4', border: 'rgba(6,182,212,0.2)' }
  return { bg: 'rgba(34,197,94,0.15)', text: '#22c55e', border: 'rgba(34,197,94,0.2)' }
}

export default function RiskHeatmap({ className = '' }) {
  return (
    <div className={`glass rounded-2xl p-6 glass-hover ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-medium text-base-300 tracking-wider uppercase">Risk Heatmap</h3>
        <div className="flex items-center gap-2">
          {[
            { label: 'Critical', color: '#ef4444' },
            { label: 'High', color: '#f59e0b' },
            { label: 'Med', color: '#06b6d4' },
            { label: 'Low', color: '#22c55e' },
          ].map(({ label, color }) => (
            <div key={label} className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: color }} />
              <span className="text-[9px] text-base-400">{label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {cells.map((cell) => {
          const c = heatColor(cell.likelihood, cell.impact)
          return (
            <div key={cell.area}
              className="rounded-xl border p-3 transition-all duration-200 hover:scale-[1.02] cursor-default"
              style={{ backgroundColor: c.bg, borderColor: c.border }}
            >
              <div className="text-[10px] font-medium leading-tight mb-2"
                style={{ color: c.text }}
              >
                {cell.area}
              </div>
              <div className="flex items-center justify-between text-[8px] text-base-400">
                <span>L:{cell.likelihood}%</span>
                <span>I:{cell.impact}%</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
