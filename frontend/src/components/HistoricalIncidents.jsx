export default function HistoricalIncidents({ changes }) {
  if (!changes?.length) return null

  return (
    <div className="glass rounded-2xl p-6 glass-hover">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-medium text-base-300 tracking-wider uppercase">Historical Incidents</h3>
        <span className="text-[10px] text-base-400">Past 3 changes</span>
      </div>
      <div className="space-y-3">
        {changes.map((item, i) => (
          <div
            key={i}
            className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-4 transition-all duration-200 hover:border-warning/20 hover:bg-warning/[0.02]"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="flex items-start justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-md bg-warning/10 px-2 py-0.5 text-[10px] font-semibold text-warning">
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                  {item.mr}
                </span>
                {item.author && (
                  <span className="rounded bg-white/[0.04] px-1.5 py-0.5 text-[10px] font-mono text-base-400">
                    @{item.author}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-base-500">{item.date}</span>
            </div>
            <p className="text-sm leading-relaxed text-base-300">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
