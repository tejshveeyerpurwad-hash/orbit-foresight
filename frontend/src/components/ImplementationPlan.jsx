const statusIcon = {
  completed: (
    <svg className="h-3 w-3 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  ),
  in_progress: (
    <svg className="h-3 w-3 text-warning animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
    </svg>
  ),
  pending: (
    <svg className="h-3 w-3 text-base-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
}

export default function ImplementationPlan({ plan }) {
  if (!plan?.length) return null

  return (
    <div className="glass rounded-2xl p-6 glass-hover">
      <h3 className="text-xs font-medium text-base-300 tracking-wider uppercase mb-6">Implementation Plan</h3>
      <div className="relative">
        <div className="absolute left-[13px] top-3 h-[calc(100%-24px)] w-0.5 bg-gradient-to-b from-brand/40 via-brand/20 to-transparent" />
        <div className="space-y-6">
          {plan.map((p, i) => (
            <div key={i} className="relative flex gap-4" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center">
                <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-brand/30 bg-base-700 transition-all duration-300 hover:border-brand">
                  <span className="text-[10px] font-bold text-brand">
                    {statusIcon[p.status] || (i + 1)}
                  </span>
                </div>
              </div>
              <div className="flex-1 rounded-xl border border-white/[0.04] bg-white/[0.02] p-4 transition-all duration-300 hover:border-brand/20">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-brand-light">{p.phase}</span>
                  <span className="rounded-md bg-white/[0.04] px-2 py-0.5 text-[10px] font-mono text-base-400">
                    {p.duration}
                  </span>
                </div>
                <p className="text-sm text-base-300 leading-relaxed">{p.task}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
