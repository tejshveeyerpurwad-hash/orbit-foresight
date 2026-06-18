export default function EmptyState({ onAnalyze, presets, executive = false }) {
  return (
    <div className="flex flex-col items-center py-20 px-4 animate-fade-in">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.03]">
        <svg className="h-12 w-12 text-base-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">
        {executive ? 'No analysis loaded' : 'No analysis yet'}
      </h3>
      <p className="text-sm text-base-300 text-center max-w-md mb-6">
        {executive
          ? 'Submit a feature request to see failure simulation, incident time machine, blast radius explorer, and AI CTO report.'
          : 'Enter a feature request above to get started. Orbit Foresight will analyze risks, map dependencies, and generate an executive report.'
        }
      </p>
      {presets?.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 max-w-lg">
          {presets.map((p) => (
            <button
              key={p}
              onClick={() => onAnalyze?.(p)}
              className="rounded-lg border border-white/[0.06] bg-white/[0.03] px-3.5 py-2 text-xs text-base-300 transition-all hover:border-brand/30 hover:bg-brand/10 hover:text-brand-light"
            >
              {p}
            </button>
          ))}
        </div>
      )}
      {onAnalyze && presets?.length > 0 && (
        <p className="mt-4 text-[10px] text-base-500">Click a suggestion to load demo data</p>
      )}
    </div>
  )
}
