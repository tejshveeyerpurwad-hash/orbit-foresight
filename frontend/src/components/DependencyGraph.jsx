import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const palette = {
  high: { fill: 'rgba(239,68,68,0.15)', stroke: '#ef4444', text: '#ef4444', glow: 'rgba(239,68,68,0.15)' },
  medium: { fill: 'rgba(245,158,11,0.15)', stroke: '#f59e0b', text: '#f59e0b', glow: 'rgba(245,158,11,0.15)' },
  low: { fill: 'rgba(34,197,94,0.15)', stroke: '#22c55e', text: '#22c55e', glow: 'rgba(34,197,94,0.15)' },
}

export default function DependencyGraph({ deps, interactive = true }) {
  const [selected, setSelected] = useState(null)
  const [hovered, setHovered] = useState(null)
  const navigate = useNavigate()

  if (!deps?.length) return null

  const w = 520, h = 300, cx = w / 2, cy = h / 2, r = 110
  const nodes = deps.map((d, i) => {
    const angle = (i / deps.length) * 2 * Math.PI - Math.PI / 2
    return { ...d, x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) }
  })

  const edges = []
  nodes.forEach((n) =>
    n.dependencies?.forEach((dep) => {
      const t = nodes.find((x) => x.service === dep)
      if (t) edges.push({ x1: n.x, y1: n.y, x2: t.x, y2: t.y, from: n.service, to: dep, risk: n.risk })
    })
  )

  const activeNode = selected || hovered

  return (
    <div className="glass rounded-2xl p-6 glass-hover">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-medium text-base-300 tracking-wider uppercase">Dependency Graph</h3>
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
            <marker id="arr-dep" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
              <polygon points="0 0, 7 2.5, 0 5" fill="#475569" />
            </marker>
          </defs>

          {edges.map((e, i) => {
            const c = palette[e.risk] || palette.medium
            const isActive = activeNode && (e.from === activeNode || e.to === activeNode)
            return (
              <line key={i} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
                stroke={isActive ? c.stroke : '#334155'}
                strokeWidth={isActive ? 2.5 : 1}
                strokeOpacity={activeNode && !isActive ? 0.1 : 0.5}
                markerEnd="url(#arr-dep)"
                className="transition-all duration-300"
              />
            )
          })}

          {nodes.map((n) => {
            const c = palette[n.risk]
            const isActive = n.service === activeNode
            return (
              <g key={n.service}
                onMouseEnter={() => interactive && setHovered(n.service)}
                onMouseLeave={() => interactive && setHovered(null)}
                onClick={() => interactive && setSelected(selected === n.service ? null : n.service)}
                className="transition-all duration-300 cursor-pointer"
              >
                {isActive && (
                  <circle cx={n.x} cy={n.y} r={32} fill="none"
                    stroke={c.stroke} strokeWidth="1" strokeDasharray="3 3"
                    className="animate-pulse-soft"
                  />
                )}
                <circle cx={n.x} cy={n.y} r={26}
                  fill={isActive ? `${c.stroke}25` : c.fill}
                  stroke={isActive ? c.stroke : `${c.stroke}50`}
                  strokeWidth={isActive ? 2.5 : 1.5}
                  style={{ filter: isActive ? `drop-shadow(0 0 10px ${c.glow})` : 'none' }}
                  className="transition-all duration-300"
                />
                {isActive && (
                  <circle cx={n.x} cy={n.y} r={26}
                    fill="none" stroke={c.stroke} strokeWidth="1" opacity="0.5"
                    className="animate-ping-slow"
                  />
                )}
                <text x={n.x} y={n.y + 4} textAnchor="middle"
                  fill={isActive ? '#fff' : c.text}
                  fontSize="7.5" fontWeight="600"
                  fontFamily="Inter, system-ui, sans-serif"
                  className="transition-colors duration-300 pointer-events-none"
                >
                  {n.service.length > 14 ? n.service.slice(0, 13) + '\u2026' : n.service}
                </text>
              </g>
            )
          })}
        </svg>

        {activeNode && nodes.find((n) => n.service === activeNode) && (
          <div className="absolute bottom-3 left-3 right-3 rounded-lg border border-white/[0.06] bg-base-700/95 backdrop-blur-sm px-3 py-2.5 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white">{activeNode}</span>
              <button
                onClick={() => navigate('/dashboard')}
                className="text-[10px] text-brand-light hover:text-brand transition-colors"
              >
                View details &rarr;
              </button>
            </div>
            <div className="mt-1 flex items-center gap-3 text-xs text-base-300">
              <span>Risk: {
                deps.find((d) => d.service === activeNode)?.risk || 'unknown'
              }</span>
              <span className="text-base-500">|</span>
              <span>
                Depends on: {deps.find((d) => d.service === activeNode)?.dependencies?.join(', ') || 'none'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
