export default function DeploymentSimulator({ data }) {
  const ds = data?.deployment_simulator
  if (!ds?.scenarios?.length) return null

  return (
    <div className="space-y-6">
      <div className="animate-fade-up">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-danger/20">
            <svg className="h-4 w-4 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Deployment Simulator</h2>
            <p className="text-xs text-base-400">{ds.total_scenarios} failure scenarios identified — understand what could break and how to prevent it</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          <div className="rounded-lg border border-danger/20 bg-danger/[0.04] px-3 py-1.5 text-xs">
            <span className="text-base-400">Worst case: </span>
            <span className="font-semibold text-danger capitalize">{ds.worst_case_severity}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:gap-6">
        {ds.scenarios.map((s, i) => {
          const sevColor = s.severity === 'critical' ? '#ef4444' : s.severity === 'high' ? '#f59e0b' : s.severity === 'medium' ? '#06b6d4' : '#22c55e'
          const sevBg = s.severity === 'critical' ? 'bg-danger/10 text-danger' : s.severity === 'high' ? 'bg-warning/10 text-warning' : s.severity === 'medium' ? 'bg-brand/10 text-brand-light' : 'bg-success/10 text-success'
          return (
            <div key={i} className="animate-fade-up glass-card p-5" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: `${sevColor}15` }}>
                  <svg className="h-5 w-5" style={{ color: sevColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <h3 className="text-sm font-semibold text-white">What could break?</h3>
                    <span className={`rounded-full px-2 py-0.5 text-[9px] font-semibold capitalize ${sevBg}`}>
                      {s.severity}
                    </span>
                    <span className="text-[10px] text-base-500">{s.probability}% probability</span>
                  </div>
                  <p className="text-sm text-base-200 mb-3">{s.what}</p>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-lg border border-warning/20 bg-warning/[0.03] p-3">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <svg className="h-3.5 w-3.5 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                        </svg>
                        <span className="text-[10px] font-semibold text-warning uppercase tracking-wider">Why could it break?</span>
                      </div>
                      <p className="text-xs text-base-300 leading-relaxed">{s.why}</p>
                    </div>

                    <div className="rounded-lg border border-success/20 bg-success/[0.03] p-3">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <svg className="h-3.5 w-3.5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-[10px] font-semibold text-success uppercase tracking-wider">How to prevent it?</span>
                      </div>
                      <p className="text-xs text-base-300 leading-relaxed">{s.prevention}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
