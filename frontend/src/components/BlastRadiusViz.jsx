import { useState } from 'react'

const sevColor = {
  critical: { fill: 'rgba(239,68,68,0.2)', stroke: '#ef4444', text: '#ef4444', label: 'Critical' },
  high: { fill: 'rgba(245,158,11,0.2)', stroke: '#f59e0b', text: '#f59e0b', label: 'High' },
  medium: { fill: 'rgba(6,182,212,0.15)', stroke: '#06b6d4', text: '#06b6d4', label: 'Medium' },
  low: { fill: 'rgba(34,197,94,0.15)', stroke: '#22c55e', text: '#22c55e', label: 'Low' },
}

function getSize(pct) {
  if (pct >= 80) return 48
  if (pct >= 50) return 38
  if (pct >= 30) return 30
  return 22
}

export default function BlastRadiusViz({ items }) {
  const [hovered, setHovered] = useState(null)
  if (!items?.length) return null

  const w = 480, h = 280, cx = w / 2, cy = h / 2

  const positioned = items.map((item, i) => {
    const angle = (i / items.length) * 2 * Math.PI - Math.PI / 2 + 0.2
    const dist = 60 + (100 - getSize(item.pct)) * 0.6
    return {
      ...item,
      x: cx + dist * Math.cos(angle),
      y: cy + dist * Math.sin(angle),
      r: getSize(item.pct),
    }
  })

  return (
    <div className="glass rounded-2xl p-6 glass-hover">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-medium text-base-300 tracking-wider uppercase">Blast Radius</h3>
        <div className="flex items-center gap-2">
          {['critical', 'high', 'medium', 'low'].map((k) => {
            const s = sevColor[k]
            return (
              <div key={k} className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.stroke }} />
                <span className="text-[9px] text-base-400">{s.label}</span>
              </div>
            )
          })}
        </div>
      </div>
      <div className="relative overflow-hidden rounded-xl border border-white/[0.04] bg-base-800/40">
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto" style={{ minHeight: 240 }}>
          <circle cx={cx} cy={cy} r={80} fill="rgba(239,68,68,0.04)" stroke="rgba(239,68,68,0.15)" strokeWidth="1" strokeDasharray="4 4" />
          <circle cx={cx} cy={cy} r={55} fill="rgba(239,68,68,0.06)" stroke="rgba(239,68,68,0.1)" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx={cx} cy={cy} r={30} fill="rgba(239,68,68,0.08)" stroke="rgba(239,68,68,0.15)" strokeWidth="1" />

          <text x={cx} y={cy + 3} textAnchor="middle" fill="#64748b" fontSize="8" fontWeight="500" fontFamily="Inter, system-ui, sans-serif">
            Epicenter
          </text>

          {positioned.map((item) => {
            const c = sevColor[item.severity] || sevColor.medium
            const isHover = hovered === item.name
            return (
              <g key={item.name}
                onMouseEnter={() => setHovered(item.name)}
                onMouseLeave={() => setHovered(null)}
                className="transition-all duration-300 cursor-pointer"
              >
                {isHover && (
                  <circle cx={item.x} cy={item.y} r={item.r + 8}
                    fill="none" stroke={c.stroke} strokeWidth="1" strokeDasharray="3 3"
                    className="animate-pulse-soft"
                  />
                )}
                <circle cx={item.x} cy={item.y} r={item.r}
                  fill={c.fill} stroke={isHover ? c.stroke : `${c.stroke}50`} strokeWidth={isHover ? 2 : 1.5}
                  style={{ filter: isHover ? `drop-shadow(0 0 8px ${c.stroke}40)` : 'none' }}
                />
                <text x={item.x} y={item.y - item.r - 6} textAnchor="middle"
                  fill={isHover ? '#fff' : c.text}
                  fontSize="7" fontWeight="600" fontFamily="Inter, system-ui, sans-serif"
                >
                  {item.name.length > 14 ? item.name.slice(0, 13) + '\u2026' : item.name}
                </text>
                <text x={item.x} y={item.y + 3} textAnchor="middle" fill={isHover ? '#fff' : '#94a3b8'}
                  fontSize="9" fontWeight="700" fontFamily="Inter, system-ui, sans-serif"
                >
                  {item.pct}%
                </text>
              </g>
            )
          })}
        </svg>
        {hovered && (
          <div className="absolute bottom-3 left-3 right-3 rounded-lg border border-white/[0.06] bg-base-700/90 backdrop-blur-sm px-3 py-2 text-xs text-base-300 animate-fade-in">
            <span className="font-medium text-white">{hovered}</span>
            {' \u2014 '}
            <span className={sevColor[items.find((i) => i.name === hovered)?.severity || 'medium'].text}>
              {sevColor[items.find((i) => i.name === hovered)?.severity || 'medium'].label} severity
            </span>
            {' \u00b7 '}
            {items.find((i) => i.name === hovered)?.pct}% blast probability
          </div>
        )}
      </div>
    </div>
  )
}
