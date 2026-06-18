import { useState, useEffect } from 'react'

export default function ConfidenceScore({ score }) {
  const [val, setVal] = useState(0)

  useEffect(() => {
    const dur = 1000
    const go = (now) => {
      const t = Math.min((now - start) / dur, 1)
      setVal(Math.round((1 - Math.pow(1 - t, 3)) * score))
      if (t < 1) requestAnimationFrame(go)
    }
    const start = performance.now()
    requestAnimationFrame(go)
  }, [score])

  const pct = val
  const color = pct >= 85 ? 'success' : pct >= 65 ? 'warning' : 'danger'
  const barColor = color === 'success' ? 'from-success to-success/50' : color === 'warning' ? 'from-warning to-warning/50' : 'from-danger to-danger/50'

  return (
    <div className="glass rounded-2xl p-6 glass-hover">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-medium text-base-300 tracking-wider uppercase">Confidence Score</h3>
        <span className={`text-[10px] font-semibold uppercase tracking-wider ${
          color === 'success' ? 'text-success' : color === 'warning' ? 'text-warning' : 'text-danger'
        }`}>
          {color === 'success' ? 'High' : color === 'warning' ? 'Medium' : 'Low'}
        </span>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative shrink-0">
          <svg className="h-20 w-20 -rotate-90" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="32" fill="none" stroke="#1e293b" strokeWidth="6" />
            <circle cx="40" cy="40" r="32" fill="none"
              stroke={`url(#conf-${color})`} strokeWidth="6" strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 32}
              strokeDashoffset={2 * Math.PI * 32 - (pct / 100) * 2 * Math.PI * 32}
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id={`conf-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={color === 'success' ? '#22c55e' : color === 'warning' ? '#f59e0b' : '#ef4444'} />
                <stop offset="100%" stopColor={color === 'success' ? '#16a34a' : color === 'warning' ? '#d97706' : '#dc2626'} />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-lg font-bold ${
              color === 'success' ? 'text-success' : color === 'warning' ? 'text-warning' : 'text-danger'
            }`}>{pct}%</span>
          </div>
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-base-400">Model certainty</span>
            <span className="text-base-200">{pct}%</span>
          </div>
          <div className="h-2 rounded-full bg-base-600 overflow-hidden">
            <div className={`h-full rounded-full bg-gradient-to-r ${barColor} transition-all duration-1000 ease-out`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-[10px] text-base-400 leading-relaxed">
            {pct >= 85 ? 'High confidence in this prediction based on historical patterns.' :
             pct >= 65 ? 'Moderate confidence. Additional data would improve accuracy.' :
             'Low confidence. Manual review strongly recommended.'}
          </p>
        </div>
      </div>
    </div>
  )
}
