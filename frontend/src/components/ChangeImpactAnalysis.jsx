export default function ChangeImpactAnalysis({ data }) {
  const cia = data?.change_impact_analysis
  if (!cia) return null

  return (
    <div className="space-y-6">
      <div className="animate-fade-up">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/20">
            <svg className="h-4 w-4 text-brand-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.75v2.25m0 0V9m0-3.75h2.25M9.75 3.75h-2.25m0 0A2.25 2.25 0 005.25 6v.75m0 0A2.25 2.25 0 003 9v6.75A2.25 2.25 0 005.25 18h13.5A2.25 2.25 0 0021 15.75V9a2.25 2.25 0 00-2.25-2.25h-.75m0 0V6a2.25 2.25 0 00-2.25-2.25h-2.25m2.25 0V3.75" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Change Impact Analysis</h2>
            <p className="text-xs text-base-400">{cia.total_impact_count} total impact points across services, files, teams, and pipelines</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="animate-fade-up glass-card p-5" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-danger/20">
              <svg className="h-3.5 w-3.5 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </div>
            <h3 className="text-xs font-medium text-base-300 tracking-wider uppercase">Services</h3>
          </div>
          <div className="space-y-1.5">
            {cia.impacted_services?.map((s) => (
              <div key={s} className="flex items-center gap-2 rounded-lg border border-white/[0.04] bg-white/[0.02] px-3 py-2">
                <span className="h-1.5 w-1.5 rounded-full bg-danger/70" />
                <span className="text-xs text-base-300">{s}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="animate-fade-up glass-card p-5" style={{ animationDelay: '150ms' }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand/20">
              <svg className="h-3.5 w-3.5 text-brand-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <h3 className="text-xs font-medium text-base-300 tracking-wider uppercase">Files</h3>
          </div>
          <div className="space-y-1.5">
            {cia.impacted_files?.map((f) => (
              <div key={f} className="flex items-center gap-2 rounded-lg border border-white/[0.04] bg-white/[0.02] px-3 py-2">
                <span className="text-[10px] text-base-500">&lt;/&gt;</span>
                <span className="text-xs font-mono text-base-300">{f}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="animate-fade-up glass-card p-5" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-warning/20">
              <svg className="h-3.5 w-3.5 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
            </div>
            <h3 className="text-xs font-medium text-base-300 tracking-wider uppercase">Teams</h3>
          </div>
          <div className="space-y-1.5">
            {cia.impacted_teams?.map((t) => (
              <div key={t} className="flex items-center gap-2 rounded-lg border border-white/[0.04] bg-white/[0.02] px-3 py-2">
                <span className="h-1.5 w-1.5 rounded-full bg-warning/70" />
                <span className="text-xs text-base-300">{t}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="animate-fade-up glass-card p-5" style={{ animationDelay: '250ms' }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-success/20">
              <svg className="h-3.5 w-3.5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            <h3 className="text-xs font-medium text-base-300 tracking-wider uppercase">Pipelines</h3>
          </div>
          <div className="space-y-1.5">
            {cia.impacted_pipelines?.map((p) => (
              <div key={p} className="flex items-center gap-2 rounded-lg border border-white/[0.04] bg-white/[0.02] px-3 py-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
                </span>
                <span className="text-xs text-base-300">{p}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
