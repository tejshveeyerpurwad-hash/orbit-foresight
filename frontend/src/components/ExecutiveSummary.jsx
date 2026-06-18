const recConfig = {
  blocked: { label: 'Blocked', bg: 'bg-danger/10', border: 'border-danger/30', text: 'text-danger', dot: 'bg-danger' },
  caution: { label: 'Proceed with Caution', bg: 'bg-warning/10', border: 'border-warning/30', text: 'text-warning', dot: 'bg-warning' },
  review: { label: 'Needs Review', bg: 'bg-brand/10', border: 'border-brand/30', text: 'text-brand-light', dot: 'bg-brand' },
  approved: { label: 'Approved', bg: 'bg-success/10', border: 'border-success/30', text: 'text-success', dot: 'bg-success' },
}

export default function ExecutiveSummary({ summary, metrics, recommendation }) {
  if (!summary) return null
  const rec = recConfig[recommendation] || recConfig.review

  return (
    <div className="glass rounded-2xl p-6 glass-hover">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-medium text-base-300 tracking-wider uppercase">Executive Summary</h3>
        <div className={`rounded-full px-3 py-1 text-[10px] font-semibold ${rec.bg} ${rec.text} ${rec.border} border`}>
          {rec.label}
        </div>
      </div>
      <p className="text-sm text-base-300 leading-relaxed mb-6">{summary}</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {metrics && Object.entries(metrics).map(([key, val]) => {
          let color = 'text-base-200'
          const label = key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
          if (key === 'risk_score' || key === 'incident_probability') {
            color = val >= 70 ? 'text-danger' : val >= 40 ? 'text-warning' : 'text-success'
          }
          if (key === 'confidence_score') {
            color = val >= 85 ? 'text-success' : val >= 65 ? 'text-warning' : 'text-danger'
          }
          return (
            <div key={key} className="rounded-xl border border-white/[0.04] bg-white/[0.02] px-3 py-2.5 text-center">
              <div className={`text-sm font-bold ${color}`}>{val}{typeof val === 'number' ? '%' : ''}</div>
              <div className="text-[9px] text-base-400 mt-0.5 truncate">{label}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
