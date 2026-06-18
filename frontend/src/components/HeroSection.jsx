export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-12 sm:pt-16 lg:pt-20">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-brand/5 blur-3xl" />
        <div className="absolute -right-40 -bottom-40 h-[500px] w-[500px] rounded-full bg-brand/[0.03] blur-3xl" />
        <div className="absolute left-1/2 top-1/3 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-brand/[0.02] blur-3xl" />
        <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-40" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex animate-fade-down items-center gap-2 rounded-full border border-brand/20 bg-brand/[0.06] px-4 py-1.5 text-xs font-medium text-brand-light">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
            </span>
            Predict. Prevent. Deploy with confidence.
          </div>

          <h1 className="animate-fade-up text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Predict software risks{' '}
            <span className="text-gradient">before production</span>
          </h1>

          <p className="animate-fade-up mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-base-300 sm:text-xl" style={{ animationDelay: '150ms' }}>
            Orbit Foresight analyzes feature requests against your GitLab
            Orbit history, surfacing risk scores, impacted services, and
            recommended actions before you merge.
          </p>

          <div className="animate-fade-up mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center" style={{ animationDelay: '300ms' }}>
            <a
              href="#demo-input"
              className="inline-flex items-center gap-2 rounded-xl bg-brand px-7 py-3.5 text-sm font-semibold text-white transition-all hover:bg-brand-dark hover:shadow-lg hover:shadow-brand/20 active:scale-[0.97]"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 01-.657.643 48.39 48.39 0 01-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 01-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 00-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 01-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 00.657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 01-.349-1.003c0-1.035 1.007-1.875 2.25-1.875s2.25.84 2.25 1.875c0 .369-.128.713-.349 1.003-.215.283-.401.604-.401.959v0c0 .333.277.599.61.58a48.1 48.1 0 005.427-.63 48.05 48.05 0 00.582-4.717.532.532 0 00-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.959.401v0a.656.656 0 00.658-.663 48.422 48.422 0 00-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 01-.61-.58v0z" />
              </svg>
              Try Demo
            </a>
            <a
              href="#features"
              className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-7 py-3.5 text-sm font-semibold text-base-300 transition-all hover:border-white/[0.15] hover:bg-white/[0.06] hover:text-white"
            >
              Learn More
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="mt-16 sm:mt-20 lg:mt-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="animate-fade-up relative overflow-hidden rounded-2xl border border-white/[0.06] bg-base-800/60 p-2 shadow-2xl shadow-black/40 backdrop-blur-sm" style={{ animationDelay: '500ms' }}>
            <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-20" />
            <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-base-900/80">
              <div className="flex h-full items-center justify-center">
                <div className="text-center p-8">
                  <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-brand/10 px-3 py-1 text-xs text-brand-light">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                    Live Preview
                  </div>
                  <div className="mx-auto grid max-w-lg grid-cols-2 gap-3 text-left">
                    {[
                      { label: 'Risk Score', value: '82', color: 'text-danger' },
                      { label: 'Services', value: '3 impacted', color: 'text-warning' },
                      { label: 'Files', value: '4 changed', color: 'text-brand-light' },
                      { label: 'Actions', value: '4 recommended', color: 'text-success' },
                    ].map((item) => (
                      <div key={item.label} className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3">
                        <div className="text-xs text-base-300">{item.label}</div>
                        <div className={`text-lg font-bold ${item.color}`}>{item.value}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-base-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-success" />
                    Analysis complete for "Add payment retry support"
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
