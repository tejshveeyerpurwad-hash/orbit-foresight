import { motion } from 'framer-motion'

const defaultStory = {
  mission: 'Protect revenue and maintain service reliability across all 47 services',
  situation: 'Payment Gateway error rate spike detected with 96% AI confidence. Circuit breaker threshold approaching critical level.',
  risk: '$2.8M revenue at risk across 3 critical services if circuit breaker triggers cascade failure',
  impact: '12,400 customers affected, 6 services degraded within 90 seconds, $340K realized loss per hour',
  recommendation: 'Deploy circuit breaker fix as P0. Implement backpressure on retry queue. Add monitoring dashboards.',
  expectedOutcome: '82% risk reduction, $2.4M revenue protected, 45 min MTTR improvement, 94% deployment confidence',
}

export default function ExecutiveStoryBanner({ story = defaultStory, confidence = 94 }) {
  const items = [
    { label: 'Mission', value: story.mission, icon: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z', color: 'text-violet-400', border: 'border-violet-500/20' },
    { label: 'Situation', value: story.situation, icon: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z', color: 'text-amber-400', border: 'border-amber-500/20' },
    { label: 'Risk', value: story.risk, icon: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z', color: 'text-red-400', border: 'border-red-500/20' },
    { label: 'Impact', value: story.impact, icon: 'M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z', color: 'text-orange-400', border: 'border-orange-500/20' },
    { label: 'Recommendation', value: story.recommendation, icon: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z', color: 'text-cyan-400', border: 'border-cyan-500/20' },
    { label: 'Expected Outcome', value: story.expectedOutcome, icon: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z', color: 'text-emerald-400', border: 'border-emerald-500/20' },
  ]

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-slate-800 bg-gradient-to-br from-slate-900/80 to-slate-900/60 p-4 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600/20 to-cyan-500/20">
          <svg className="h-3 w-3 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
          </svg>
        </div>
        <h3 className="text-xs font-semibold text-white">Executive Briefing</h3>
        <div className="flex-1" />
        <span className="rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20 px-2 py-0.5 text-[7px] font-mono font-bold">{confidence}% AI CONFIDENCE</span>
      </div>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i }}
            className={`rounded-lg border ${item.border} bg-white/[0.02] p-2.5`}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <svg className={`h-3 w-3 ${item.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
              </svg>
              <span className="text-[8px] font-mono text-slate-600 uppercase tracking-wider">{item.label}</span>
            </div>
            <p className="text-[9px] text-slate-400 leading-relaxed">{item.value}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
