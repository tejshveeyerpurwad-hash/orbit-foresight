import { useState, useEffect } from 'react'

export default function ReleaseReadiness({ score, metrics }) {
  const [val, setVal] = useState(0)

  useEffect(() => {
    const dur = 1400
    const go = (now) => {
      const t = Math.min((now - start) / dur, 1)
      setVal(Math.round((1 - Math.pow(1 - t, 3)) * score))
      if (t < 1) requestAnimationFrame(go)
    }
    const start = performance.now()
    requestAnimationFrame(go)
  }, [score])

  const color = val >= 70 ? 'success' : val >= 40 ? 'warning' : 'danger'
  const label = val >= 70 ? 'Ready' : val >= 40 ? 'Needs Work' : 'Not Ready'
  const colorHex = color === 'success' ? '#22c55e' : color === 'warning' ? '#f59e0b' : '#ef4444'

  return (
    <div className="glass rounded-2xl p-6 glass-hover">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-medium text-base-300 tracking-wider uppercase">Release Readiness</h3>
        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
          color === 'success' ? 'bg-success/10 text-success' : color === 'warning' ? 'bg-warning/10 text-warning' : 'bg-danger/10 text-danger'
        }`}>
          {label}
        </span>
      </div>

      <div className="flex flex-col items-center py-4">
        <div className={`relative mb-4 ${
          color === 'success' ? 'glow-success' : color === 'warning' ? 'glow-warning' : 'glow-danger'
        }`}>
          <svg className="h-36 w-36 -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="50" fill="none" stroke="#1e293b" strokeWidth="8" />
            <circle cx="60" cy="60" r="50" fill="none"
              stroke={`url(#rr-${color})`} strokeWidth="8" strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 50}
              strokeDashoffset={2 * Math.PI * 50 - (val / 100) * 2 * Math.PI * 50}
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id={`rr-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={colorHex} />
                <stop offset="100%" stopColor={color === 'success' ? '#16a34a' : color === 'warning' ? '#d97706' : '#dc2626'} />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <span className={`text-3xl font-bold ${
                color === 'success' ? 'text-success' : color === 'warning' ? 'text-warning' : 'text-danger'
              }`}>{val}%</span>
              <div className={`text-[10px] font-semibold uppercase tracking-wider mt-0.5 ${
                color === 'success' ? 'text-success' : color === 'warning' ? 'text-warning' : 'text-danger'
              }`}>{label}</div>
            </div>
          </div>
        </div>

        <div className="w-full h-2 rounded-full bg-base-600 overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-1000 ease-out`}
            style={{
              width: `${val}%`,
              backgroundColor: colorHex,
              opacity: 0.7,
            }}
          />
        </div>

        {metrics && (
          <div className="w-full grid grid-cols-3 gap-2 mt-4">
            <div className="rounded-lg border border-white/[0.04] bg-white/[0.02] px-2 py-2 text-center">
              <div className={`text-xs font-bold ${
                metrics.risk_score >= 70 ? 'text-danger' : metrics.risk_score >= 40 ? 'text-warning' : 'text-success'
              }`}>{metrics.risk_score}%</div>
              <div className="text-[8px] text-base-400 mt-0.5">Risk Score</div>
            </div>
            <div className="rounded-lg border border-white/[0.04] bg-white/[0.02] px-2 py-2 text-center">
              <div className="text-xs font-bold text-base-200">{metrics.teams_impacted}</div>
              <div className="text-[8px] text-base-400 mt-0.5">Teams</div>
            </div>
            <div className="rounded-lg border border-white/[0.04] bg-white/[0.02] px-2 py-2 text-center">
              <div className="text-xs font-bold text-base-200">{metrics.estimated_effort}</div>
              <div className="text-[8px] text-base-400 mt-0.5">Effort</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
