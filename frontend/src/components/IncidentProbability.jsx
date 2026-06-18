import { useState, useEffect } from 'react'

export default function IncidentProbability({ pct }) {
  const [val, setVal] = useState(0)

  useEffect(() => {
    const dur = 1200
    const go = (now) => {
      const t = Math.min((now - start) / dur, 1)
      const e = 1 - Math.pow(1 - t, 3)
      setVal(Math.round(e * pct))
      if (t < 1) requestAnimationFrame(go)
    }
    const start = performance.now()
    requestAnimationFrame(go)
  }, [pct])

  const color = val >= 70 ? 'danger' : val >= 40 ? 'warning' : 'success'
  const label = val >= 70 ? 'High Probability' : val >= 40 ? 'Moderate' : 'Low Probability'
  const barColor = val >= 70 ? 'from-danger to-danger/60' : val >= 40 ? 'from-warning to-warning/60' : 'from-success to-success/60'

  return (
    <div className="glass rounded-2xl p-6 glass-hover">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-medium text-base-300 tracking-wider uppercase">Incident Probability</h3>
        <span className={`text-[10px] font-semibold uppercase tracking-wider ${
          color === 'danger' ? 'text-danger' : color === 'warning' ? 'text-warning' : 'text-success'
        }`}>{label}</span>
      </div>
      <div className="flex flex-col items-center py-2">
        <div className={`relative mb-4 ${color === 'danger' ? 'glow-danger' : color === 'warning' ? 'glow-warning' : 'glow-success'}`}>
          <svg className="h-28 w-28 -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="50" fill="none" stroke="#1e293b" strokeWidth="8" />
            <circle cx="60" cy="60" r="50" fill="none"
              stroke={`url(#prob-${color})`} strokeWidth="8" strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 50}
              strokeDashoffset={2 * Math.PI * 50 - (val / 100) * 2 * Math.PI * 50}
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id={`prob-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={color === 'danger' ? '#ef4444' : color === 'warning' ? '#f59e0b' : '#22c55e'} />
                <stop offset="100%" stopColor={color === 'danger' ? '#dc2626' : color === 'warning' ? '#d97706' : '#16a34a'} />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <span className={`text-3xl font-bold ${
                color === 'danger' ? 'text-danger' : color === 'warning' ? 'text-warning' : 'text-success'
              }`}>{val}%</span>
            </div>
          </div>
        </div>
        <div className="w-full h-1.5 rounded-full bg-base-600 overflow-hidden">
          <div className={`h-full rounded-full bg-gradient-to-r ${barColor} transition-all duration-1000 ease-out`}
            style={{ width: `${val}%` }}
          />
        </div>
      </div>
    </div>
  )
}
