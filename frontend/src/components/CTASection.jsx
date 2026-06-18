import { useNavigate } from 'react-router-dom'

export default function CTASection() {
  const navigate = useNavigate()

  return (
    <section className="relative border-t border-white/[0.04] py-24 lg:py-32">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/[0.04] blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to predict your{' '}
            <span className="text-gradient">next incident?</span>
          </h2>
          <p className="mt-4 text-base-300">
            Stop finding out about risks in production. Start analyzing every feature request before you merge.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center gap-2 rounded-xl bg-brand px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-brand-dark hover:shadow-lg hover:shadow-brand/20 active:scale-[0.97]"
            >
              Go to Dashboard
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
            <a
              href="#demo-input"
              className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-8 py-3.5 text-sm font-semibold text-base-300 transition-all hover:border-white/[0.15] hover:bg-white/[0.06] hover:text-white"
            >
              Try a Demo
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
