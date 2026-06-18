const features = [
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    title: 'Risk Scoring',
    desc: 'ML-powered risk assessment that analyzes your feature request against historical data to predict incident probability with 94% accuracy.',
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0l4.5-4.5M3 16.5h18m-3-9l-4.5-4.5m0 0L9 7.5m4.5-4.5v18" />
      </svg>
    ),
    title: 'Dependency Mapping',
    desc: 'Visualize every service, database, and API your change touches with an interactive graph — before writing a single line of code.',
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Historical Analysis',
    desc: 'Surface similar merge requests from the past that caused incidents, with author attribution and root cause details.',
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: 'Actionable Plans',
    desc: 'Get a concrete implementation plan with prioritized actions, phase timelines, and status tracking for your team.',
  },
]

export default function FeatureCards() {
  return (
    <section id="features" className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/[0.06] px-4 py-1.5 text-xs font-medium text-brand-light">
            Why Orbit Foresight
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ship with{' '}
            <span className="text-gradient">confidence</span>
          </h2>
          <p className="mt-4 text-base-300">
            Every feature request is analyzed against your entire GitLab Orbit history to predict what could go wrong.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="group glass glass-hover rounded-2xl p-6"
              style={{ animationDelay: `${i * 120}ms` }}
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.04] text-base-300 transition-all duration-300 group-hover:border-brand/30 group-hover:bg-brand/10 group-hover:text-brand-light">
                {f.icon}
              </div>
              <h3 className="mb-2 text-base font-semibold text-white/90 group-hover:text-white transition-colors">
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed text-base-300">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
