const recs = {
  blocked: {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
      </svg>
    ),
    label: 'Blocked',
    desc: 'Critical risks detected. Do not deploy until resolved.',
    bg: 'bg-danger/10',
    border: 'border-danger/30',
    text: 'text-danger',
    badge: 'bg-danger/20 text-danger',
  },
  caution: {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    ),
    label: 'Proceed with Caution',
    desc: 'Moderate risks. Address high-priority items before deploying.',
    bg: 'bg-warning/10',
    border: 'border-warning/30',
    text: 'text-warning',
    badge: 'bg-warning/20 text-warning',
  },
  review: {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
      </svg>
    ),
    label: 'Needs Review',
    desc: 'Some risks identified. Manual review recommended before deploy.',
    bg: 'bg-brand/10',
    border: 'border-brand/30',
    text: 'text-brand-light',
    badge: 'bg-brand/20 text-brand-light',
  },
  approved: {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    label: 'Approved for Deploy',
    desc: 'Low risk profile. Safe to deploy with standard monitoring.',
    bg: 'bg-success/10',
    border: 'border-success/30',
    text: 'text-success',
    badge: 'bg-success/20 text-success',
  },
}

export default function DeploymentRecommendation({ recommendation }) {
  const r = recs[recommendation] || recs.review
  if (!recommendation) return null

  return (
    <div className={`glass rounded-2xl p-6 border ${r.border} ${r.bg}`}>
      <div className="flex items-start gap-4">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${r.badge}`}>
          {r.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-xs font-medium text-base-300 tracking-wider uppercase">Deploy Recommendation</h3>
            <span className={`rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${r.badge}`}>
              {r.label}
            </span>
          </div>
          <p className="text-sm text-base-300">{r.desc}</p>

          <div className="mt-4 grid grid-cols-3 gap-2">
            {recommendation === 'blocked' && (
              <>
                <div className="rounded-lg border border-danger/20 bg-danger/[0.04] px-3 py-2 text-center">
                  <div className="text-[10px] text-base-400">Risks</div>
                  <div className="text-xs font-semibold text-danger">4 critical</div>
                </div>
                <div className="rounded-lg border border-warning/20 bg-warning/[0.04] px-3 py-2 text-center">
                  <div className="text-[10px] text-base-400">Required</div>
                  <div className="text-xs font-semibold text-warning">3 actions</div>
                </div>
                <div className="rounded-lg border border-base-500/20 bg-white/[0.02] px-3 py-2 text-center">
                  <div className="text-[10px] text-base-400">ETA</div>
                  <div className="text-xs font-semibold text-base-200">5 days</div>
                </div>
              </>
            )}
            {recommendation === 'caution' && (
              <>
                <div className="rounded-lg border border-warning/20 bg-warning/[0.04] px-3 py-2 text-center">
                  <div className="text-[10px] text-base-400">Risks</div>
                  <div className="text-xs font-semibold text-warning">2 high</div>
                </div>
                <div className="rounded-lg border border-brand/20 bg-brand/[0.04] px-3 py-2 text-center">
                  <div className="text-[10px] text-base-400">Review</div>
                  <div className="text-xs font-semibold text-brand-light">1 required</div>
                </div>
                <div className="rounded-lg border border-base-500/20 bg-white/[0.02] px-3 py-2 text-center">
                  <div className="text-[10px] text-base-400">ETA</div>
                  <div className="text-xs font-semibold text-base-200">2 days</div>
                </div>
              </>
            )}
            {recommendation === 'review' && (
              <>
                <div className="rounded-lg border border-brand/20 bg-brand/[0.04] px-3 py-2 text-center">
                  <div className="text-[10px] text-base-400">Risks</div>
                  <div className="text-xs font-semibold text-brand-light">1 medium</div>
                </div>
                <div className="rounded-lg border border-base-500/20 bg-white/[0.02] px-3 py-2 text-center">
                  <div className="text-[10px] text-base-400">Review</div>
                  <div className="text-xs font-semibold text-base-200">Optional</div>
                </div>
                <div className="rounded-lg border border-success/20 bg-success/[0.04] px-3 py-2 text-center">
                  <div className="text-[10px] text-base-400">ETA</div>
                  <div className="text-xs font-semibold text-success">1 day</div>
                </div>
              </>
            )}
            {recommendation === 'approved' && (
              <>
                <div className="rounded-lg border border-success/20 bg-success/[0.04] px-3 py-2 text-center">
                  <div className="text-[10px] text-base-400">Risks</div>
                  <div className="text-xs font-semibold text-success">Minimal</div>
                </div>
                <div className="rounded-lg border border-success/20 bg-success/[0.04] px-3 py-2 text-center">
                  <div className="text-[10px] text-base-400">Status</div>
                  <div className="text-xs font-semibold text-success">Go</div>
                </div>
                <div className="rounded-lg border border-success/20 bg-success/[0.04] px-3 py-2 text-center">
                  <div className="text-[10px] text-base-400">ETA</div>
                  <div className="text-xs font-semibold text-success">Now</div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
