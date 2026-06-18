import { useState, useEffect } from 'react'

export default function RiskScoreGauge({ score, size = 'lg' }) {
  const [val, setVal] = useState(0)

  useEffect(() => {
    const dur = 1200
    const go = (now) => {
      const t = Math.min((now - start) / dur, 1)
      setVal(Math.round((1 - Math.pow(1 - t, 3)) * score))
      if (t < 1) requestAnimationFrame(go)
    }
    const start = performance.now()
    requestAnimationFrame(go)
  }, [score])

  const color = val >= 70 ? 'danger' : val >= 40 ? 'warning' : 'success'
  const label = val >= 70 ? 'High Risk' : val >= 40 ? 'Medium Risk' : 'Low Risk'
  const isLg = size === 'lg'
  const dim = isLg ? 36 : 28
  const sw = isLg ? 10 : 8
  const r = (dim - sw) / 2
  const circ = 2 * Math.PI * r
  const off = circ - (val / 100) * circ
  const fs = isLg ? 'text-4xl' : 'text-2xl'

  return (
    <div className="glass rounded-2xl p-6 glass-hover">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-medium text-base-300 tracking-wider uppercase">Risk Score</h3>
        <span className={`text-[10px] font-semibold uppercase tracking-wider ${
          color === 'danger' ? 'text-danger' : color === 'warning' ? 'text-warning' : 'text-success'
        }`}>{label}</span>
      </div>
      <div className="flex flex-col items-center py-2">
        <div className={`relative ${color === 'danger' ? 'glow-danger' : color === 'warning' ? 'glow-warning' : 'glow-success'}`}>
          <svg className={`${isLg ? 'h-36 w-36' : 'h-28 w-28'} -rotate-90`} viewBox={`0 0 ${dim} ${dim}`}>
            <circle cx={dim/2} cy={dim/2} r={r} fill="none" stroke="#1e293b" strokeWidth={sw} />
            <circle cx={dim/2} cy={dim/2} r={r} fill="none"
              stroke={`url(#rs-${color}-${size})`} strokeWidth={sw} strokeLinecap="round"
              strokeDasharray={circ} strokeDashoffset={off}
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id={`rs-${color}-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={color === 'danger' ? '#ef4444' : color === 'warning' ? '#f59e0b' : '#22c55e'} />
                <stop offset="100%" stopColor={color === 'danger' ? '#dc2626' : color === 'warning' ? '#d97706' : '#16a34a'} />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`${fs} font-bold tracking-tight ${
              color === 'danger' ? 'text-danger' : color === 'warning' ? 'text-warning' : 'text-success'
            }`}>{val}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
