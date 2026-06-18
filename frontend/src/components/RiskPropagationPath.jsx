export default function RiskPropagationPath({ riskPaths }) {
  if (!riskPaths?.length) return null

  return (
    <div className="glass rounded-2xl p-6 glass-hover">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-medium text-base-300 tracking-wider uppercase">Risk Propagation Paths</h3>
        <span className="text-[10px] text-base-400">{riskPaths.length} paths</span>
      </div>
      <div className="space-y-2">
        {riskPaths.map((p, i) => {
          const color = p.risk >= 70 ? 'text-danger' : p.risk >= 40 ? 'text-warning' : 'text-brand-light'
          const barColor = p.risk >= 70 ? 'bg-danger' : p.risk >= 40 ? 'bg-warning' : 'bg-brand'
          return (
            <div
              key={i}
              className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-3 transition-all duration-200 hover:border-brand/20"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono font-medium text-white">{p.from}</span>
                <svg className="h-3 w-3 shrink-0 text-base-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
                <span className="text-xs font-mono font-medium text-white">{p.to}</span>
                <span className={`ml-auto text-xs font-semibold ${color}`}>{p.risk}%</span>
              </div>
              <p className="text-[10px] text-base-400 leading-relaxed mb-1.5">{p.description}</p>
              <div className="h-1.5 rounded-full bg-base-600 overflow-hidden">
                <div className={`h-full rounded-full ${barColor} transition-all duration-500`}
                  style={{ width: `${p.risk}%`, opacity: 0.7 }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
