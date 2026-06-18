import { useState } from 'react'

const palette = {
  high: { fill: 'rgba(239,68,68,0.15)', stroke: '#ef4444', text: '#ef4444', glow: 'rgba(239,68,68,0.15)' },
  medium: { fill: 'rgba(245,158,11,0.15)', stroke: '#f59e0b', text: '#f59e0b', glow: 'rgba(245,158,11,0.15)' },
  low: { fill: 'rgba(6,182,212,0.15)', stroke: '#06b6d4', text: '#06b6d4', glow: 'rgba(6,182,212,0.15)' },
}

export default function BlastRadiusExplorer({ services, riskPaths }) {
  const [hoveredPath, setHoveredPath] = useState(null)
  const [selectedService, setSelectedService] = useState(null)

  if (!services?.length) return null

  const w = 520, h = 360, cx = w / 2, cy = h / 2, r = 130
  const nodes = services.map((s, i) => {
    const angle = (i / services.length) * 2 * Math.PI - Math.PI / 2
    return { ...s, x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) }
  })

  const paths = (riskPaths || []).map((p) => {
    const from = nodes.find((n) => n.name === p.from)
    const to = nodes.find((n) => n.name === p.to)
    if (!from || !to) return null
    const mx = (from.x + to.x) / 2
    const my = (from.y + to.y) / 2 - 18
    return { ...p, x1: from.x, y1: from.y, x2: to.x, y2: to.y, mx, my }
  }).filter(Boolean)

  const activeService = selectedService || hoveredPath

  return (
    <div className="glass rounded-2xl p-6 glass-hover">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-medium text-base-300 tracking-wider uppercase">Blast Radius Explorer</h3>
        <div className="flex items-center gap-3">
          {[['high','High'],['medium','Med'],['low','Low']].map(([k,v]) => (
            <div key={k} className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: palette[k].stroke }} />
              <span className="text-[10px] text-base-400">{v}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="relative overflow-hidden rounded-xl border border-white/[0.04] bg-base-800/40">
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto" style={{ minHeight: 240 }}>
          <defs>
            <marker id="arr-risk" markerWidth="6" markerHeight="4" refX="6" refY="2" orient="auto">
              <polygon points="0 0, 6 2, 0 4" fill="#475569" />
            </marker>
          </defs>

          {paths.map((p, i) => {
            const isActive = hoveredPath === i || activeService && (p.from === activeService || p.to === activeService)
            const riskColor = p.risk >= 70 ? '#ef4444' : p.risk >= 40 ? '#f59e0b' : '#06b6d4'
            return (
              <g key={i}
                onMouseEnter={() => setHoveredPath(i)}
                onMouseLeave={() => setHoveredPath(null)}
                className="cursor-pointer"
              >
                {isActive && (
                  <line x1={p.x1} y1={p.y1} x2={p.x2} y2={p.y2}
                    stroke={riskColor} strokeWidth={2} strokeOpacity={0.2} strokeDasharray="4 4"
                  />
                )}
                <line x1={p.x1} y1={p.y1} x2={p.x2} y2={p.y2}
                  stroke={isActive ? riskColor : '#334155'}
                  strokeWidth={isActive ? 2.5 : 1}
                  strokeOpacity={activeService && !isActive ? 0.08 : 0.4}
                  markerEnd="url(#arr-risk)"
                  className="transition-all duration-300"
                />
                {isActive && (
                  <g>
                    <rect x={p.mx - 20} y={p.my - 8} width={40} height={14} rx={4}
                      fill={riskColor} opacity={0.9}
                    />
                    <text x={p.mx} y={p.my + 2} textAnchor="middle"
                      fill="#fff" fontSize="7" fontWeight="600"
                    >
                      {p.risk}%
                    </text>
                  </g>
                )}
              </g>
            )
          })}

          {nodes.map((s) => {
            const c = palette[s.risk] || palette.medium
            const isActive = s.name === activeService
            return (
              <g key={s.name}
                onMouseEnter={() => setSelectedService && setSelectedService(s.name)}
                onMouseLeave={() => setSelectedService && !selectedService && setSelectedService(null)}
                onClick={() => setSelectedService(selectedService === s.name ? null : s.name)}
                className="transition-all duration-300 cursor-pointer"
              >
                {isActive && (
                  <circle cx={s.x} cy={s.y} r={30} fill="none"
                    stroke={c.stroke} strokeWidth="1" strokeDasharray="3 3"
                    className="animate-pulse-soft"
                  />
                )}
                <circle cx={s.x} cy={s.y} r={22}
                  fill={isActive ? `${c.stroke}25` : c.fill}
                  stroke={isActive ? c.stroke : `${c.stroke}50`}
                  strokeWidth={isActive ? 2.5 : 1.5}
                  style={{ filter: isActive ? `drop-shadow(0 0 10px ${c.glow})` : 'none' }}
                  className="transition-all duration-300"
                />
                {isActive && (
                  <circle cx={s.x} cy={s.y} r={22}
                    fill="none" stroke={c.stroke} strokeWidth="1" opacity="0.5"
                    className="animate-ping-slow"
                  />
                )}
                <text x={s.x} y={s.y + 4} textAnchor="middle"
                  fill={isActive ? '#fff' : c.text}
                  fontSize="7" fontWeight="600"
                  fontFamily="Inter, system-ui, sans-serif"
                  className="transition-colors duration-300 pointer-events-none"
                >
                  {s.name.length > 14 ? s.name.slice(0, 13) + '\u2026' : s.name}
                </text>
              </g>
            )
          })}
        </svg>

        {activeService && nodes.find((n) => n.name === activeService) && (
          <div className="absolute bottom-3 left-3 right-3 rounded-lg border border-white/[0.06] bg-base-700/95 backdrop-blur-sm px-3 py-2.5 animate-fade-in">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-white">{activeService}</span>
              <span className={`rounded-full px-2 py-0.5 text-[9px] font-semibold ${
                palette[services.find((s) => s.name === activeService)?.risk || 'low'].text
              } bg-white/[0.04]`}>
                Risk: {services.find((s) => s.name === activeService)?.risk || 'low'}
              </span>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-base-300">
              <span>Propagation: {services.find((s) => s.name === activeService)?.propagation_risk || 0}%</span>
              <span>Dependencies: {services.find((s) => s.name === activeService)?.dependencies?.join(', ') || 'none'}</span>
            </div>
          </div>
        )}

        {!activeService && (
          <div className="absolute bottom-3 left-3 right-3 text-center">
            <span className="text-[10px] text-base-500">Hover or click a service to explore risk propagation paths</span>
          </div>
        )}
      </div>
    </div>
  )
}
