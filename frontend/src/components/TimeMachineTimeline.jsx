import { useState } from 'react'

const outcomeColors = {
  incident: '#ef4444',
  near_miss: '#f59e0b',
  no_incident: '#22c55e',
}

const outcomeLabels = {
  incident: 'Incident',
  near_miss: 'Near Miss',
  no_incident: 'Safe',
}

export default function TimeMachineTimeline({ mrs }) {
  const [hovered, setHovered] = useState(null)
  if (!mrs?.length) return null

  const sorted = [...mrs].sort((a, b) => new Date(b.date) - new Date(a.date))

  return (
    <div className="glass rounded-2xl p-6 glass-hover">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xs font-medium text-base-300 tracking-wider uppercase">Historical Timeline</h3>
        <div className="flex items-center gap-2">
          {Object.entries(outcomeColors).map(([k, v]) => (
            <div key={k} className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: v }} />
              <span className="text-[9px] text-base-400">{outcomeLabels[k]}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="relative">
        <div className="absolute left-[13px] top-2 h-[calc(100%-16px)] w-0.5 bg-gradient-to-b from-base-500/40 to-transparent" />
        <div className="space-y-4">
          {sorted.map((mr, i) => {
            const color = outcomeColors[mr.outcome] || outcomeColors.no_incident
            const isHover = hovered === i
            return (
              <div
                key={i}
                className="relative flex gap-4 cursor-default"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                <div className="relative z-10 flex shrink-0 items-start pt-2">
                  <div
                    className="h-3 w-3 rounded-full border-2 transition-all duration-300"
                    style={{
                      backgroundColor: isHover ? color : 'transparent',
                      borderColor: color,
                      boxShadow: isHover ? `0 0 12px ${color}60` : 'none',
                      transform: isHover ? 'scale(1.4)' : 'scale(1)',
                    }}
                  />
                </div>
                <div className={`flex-1 rounded-xl border border-white/[0.04] bg-white/[0.02] px-4 py-3 transition-all duration-200 ${
                  isHover ? 'border-brand/20 bg-white/[0.04]' : ''
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white">{mr.mr}</span>
                      <span className="rounded bg-white/[0.04] px-1.5 py-0.5 text-[9px] font-mono text-base-400">@{mr.author}</span>
                    </div>
                    <span className="text-[10px] text-base-500">{mr.date}</span>
                  </div>
                  <p className="text-xs text-base-300 leading-relaxed">{mr.description}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-[10px] font-semibold" style={{ color }}>{outcomeLabels[mr.outcome]}</span>
                    <span className="text-base-500">|</span>
                    <span className="text-[10px] text-base-400">Match: {mr.confidence}%</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
