import { useState } from 'react'

function RiskDot({ phase, index, total, hovered, onHover, onLeave }) {
  const isActive = hovered === phase.phase
  const color = phase.risk >= 70 ? 'danger' : phase.risk >= 40 ? 'warning' : 'success'
  const c = color === 'danger' ? '#ef4444' : color === 'warning' ? '#f59e0b' : '#22c55e'

  return (
    <div className="flex-1 relative"
      onMouseEnter={() => onHover(phase.phase)}
      onMouseLeave={onLeave}
    >
      <div className="flex flex-col items-center">
        <div className="relative mb-2">
          {isActive && (
            <div className="absolute -inset-2 rounded-full animate-ping-slow opacity-30"
              style={{ backgroundColor: c }}
            />
          )}
          <div className={`relative w-3.5 h-3.5 rounded-full border-2 transition-all duration-300 ${
            isActive ? 'scale-150' : ''
          }`}
            style={{
              backgroundColor: isActive ? c : 'transparent',
              borderColor: c,
              boxShadow: isActive ? `0 0 12px ${c}60` : 'none',
            }}
          />
        </div>
        <span className={`text-[9px] font-medium text-center leading-tight transition-colors duration-200 ${
          isActive ? 'text-white' : 'text-base-400'
        }`}>
          {phase.phase}
        </span>
        <span className="text-[8px] text-base-500 mt-0.5">{phase.date}</span>
      </div>
    </div>
  )
}

export default function RiskTimeline({ timeline }) {
  const [hovered, setHovered] = useState(null)
  if (!timeline?.length) return null

  return (
    <div className="glass rounded-2xl p-6 glass-hover">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xs font-medium text-base-300 tracking-wider uppercase">Risk Timeline</h3>
        <span className="text-[10px] text-base-400">Projected risk over phases</span>
      </div>

      <div className="relative pt-2">
        <div className="absolute top-[7px] left-[8%] right-[8%] h-0.5 rounded-full bg-base-600">
          <div className="h-full rounded-full bg-gradient-to-r from-success via-warning to-danger transition-all duration-500"
            style={{ width: `${Math.max(...timeline.map((p) => p.risk))}%` }}
          />
        </div>

        <div className="flex items-start justify-between">
          {timeline.map((phase, i) => (
            <RiskDot key={phase.phase} phase={phase} index={i} total={timeline.length}
              hovered={hovered} onHover={setHovered} onLeave={() => setHovered(null)}
            />
          ))}
        </div>

        <div className="mt-6 rounded-xl border border-white/[0.04] bg-white/[0.02] p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-base-300">Risk Projection</span>
            {hovered ? (
              <span className="text-xs font-semibold text-white">{hovered}</span>
            ) : (
              <span className="text-xs text-base-400">Hover a phase</span>
            )}
          </div>
          <div className="space-y-1.5">
            {timeline.map((phase) => {
              const color = phase.risk >= 70 ? 'bg-danger' : phase.risk >= 40 ? 'bg-warning' : 'bg-success'
              const isHover = hovered === phase.phase
              return (
                <div key={phase.phase} className={`flex items-center gap-2 transition-opacity duration-200 ${
                  hovered && !isHover ? 'opacity-30' : 'opacity-100'
                }`}
                  onMouseEnter={() => setHovered(phase.phase)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <span className="text-[10px] text-base-400 w-14 shrink-0">{phase.phase}</span>
                  <div className="flex-1 h-1.5 rounded-full bg-base-600 overflow-hidden">
                    <div className={`h-full rounded-full ${color} transition-all duration-500`}
                      style={{ width: `${phase.risk}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-base-300 w-8 text-right">{phase.risk}%</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
