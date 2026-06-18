const layers = [
  {
    title: 'Feature Request',
    items: ['Natural Language Input', 'Autocomplete Suggestions'],
    gradient: 'from-brand/20 to-brand/5',
  },
  {
    title: 'Analysis Engine',
    items: ['Risk Profiler', 'Dependency Resolver', 'Historical Matcher'],
    gradient: 'from-brand/20 to-brand/5',
  },
  {
    title: 'Insight Layer',
    items: ['Risk Scoring', 'Impact Analysis', 'Failure Prediction'],
    gradient: 'from-brand/20 to-brand/5',
  },
  {
    title: 'Output',
    items: ['Recommended Actions', 'Implementation Plan', 'Visual Reports'],
    gradient: 'from-brand/20 to-brand/5',
  },
]

export default function ArchitectureSection() {
  return (
    <section className="relative border-t border-white/[0.04] py-24 lg:py-32">
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-30" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/[0.06] px-4 py-1.5 text-xs font-medium text-brand-light">
            How It Works
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            From request to{' '}
            <span className="text-gradient">insight</span>
          </h2>
          <p className="mt-4 text-base-300">
            Four layers transform your feature request into actionable risk intelligence.
          </p>
        </div>

        <div className="grid gap-0 lg:grid-cols-4 lg:gap-4">
          {layers.map((layer, i) => (
            <div key={layer.title} className="relative">
              <div className={`glass rounded-2xl p-6 h-full transition-all duration-300 hover:border-brand/20 hover:bg-base-700`}>
                <div className="mb-3 flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand/20 text-xs font-bold text-brand-light">
                    {i + 1}
                  </span>
                  <h3 className="text-sm font-semibold text-white">{layer.title}</h3>
                </div>
                <ul className="space-y-2">
                  {layer.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-base-300">
                      <span className="h-1 w-1 rounded-full bg-brand/60" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              {i < layers.length - 1 && (
                <div className="hidden lg:flex absolute -right-3 top-1/2 z-10 -translate-y-1/2 items-center justify-center">
                  <svg className="h-5 w-5 text-base-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
