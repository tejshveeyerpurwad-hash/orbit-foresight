import { motion } from 'framer-motion'

const pageContext = {
  '/dashboard': {
    step: 'Situation Awareness',
    mission: 'Contain Payment Service Failure',
    description: 'Real-time system monitoring across 47 services. 3 critical anomalies detected — AI predicts coordinated incident pattern with 96% confidence.',
    eta: '2 min',
    totalSystems: 47,
    affectedCritical: 3,
    exposure: '$288K',
    confidence: '96%',
    metrics: [
      { label: 'Anomalies', value: '3', color: 'text-cyan-400' },
      { label: 'Confidence', value: '96%', color: 'text-emerald-400' },
      { label: 'Exposure', value: '$288K', color: 'text-amber-400' },
    ],
    color: 'from-cyan-500/10 to-blue-600/5',
    border: 'border-cyan-500/15',
    accent: 'text-cyan-400',
  },
  '/intelligence': {
    step: 'Root Cause Analysis',
    mission: 'Isolate Failure Origin',
    description: 'Forensic investigation into payment pipeline failure. 8 failure modes across 4 services isolated with 94% correlation confidence.',
    eta: '8 min',
    totalSystems: 47,
    affectedCritical: 4,
    exposure: '$340K',
    confidence: '94%',
    metrics: [
      { label: 'Failures', value: '8', color: 'text-red-400' },
      { label: 'Services', value: '4', color: 'text-purple-400' },
      { label: 'Confidence', value: '94%', color: 'text-emerald-400' },
    ],
    color: 'from-purple-500/10 to-violet-600/5',
    border: 'border-purple-500/15',
    accent: 'text-purple-400',
  },
  '/time-machine': {
    step: 'Historical Patterns',
    mission: 'Confirm Recurrence Pattern',
    description: '14 prior incidents reconstructed across 6 recurrence patterns. 91% match confidence — retry queue overflow pattern repeats every 4-6 weeks.',
    eta: '4 min',
    totalSystems: 47,
    affectedCritical: 3,
    exposure: '$120K',
    confidence: '91%',
    metrics: [
      { label: 'Incidents', value: '14', color: 'text-amber-400' },
      { label: 'Patterns', value: '6', color: 'text-cyan-400' },
      { label: 'Match', value: '91%', color: 'text-emerald-400' },
    ],
    color: 'from-amber-500/10 to-orange-600/5',
    border: 'border-amber-500/15',
    accent: 'text-amber-400',
  },
  '/knowledge-graph': {
    step: 'Dependency Impact',
    mission: 'Map Blast Radius',
    description: '10 services mapped across 4 teams. 7 propagation paths identified with 92% blast radius accuracy — $340K dependency exposure contained.',
    eta: '6 min',
    totalSystems: 47,
    affectedCritical: 4,
    exposure: '$340K',
    confidence: '92%',
    metrics: [
      { label: 'Services', value: '10', color: 'text-emerald-400' },
      { label: 'Paths', value: '7', color: 'text-cyan-400' },
      { label: 'Exposure', value: '$340K', color: 'text-amber-400' },
    ],
    color: 'from-emerald-500/10 to-green-600/5',
    border: 'border-emerald-500/15',
    accent: 'text-emerald-400',
  },
  '/cto-report': {
    step: 'Executive Decision',
    mission: 'Quantify Executive Risk',
    description: 'Build vs. no-build analysis with 320% projected ROI. 87% confidence across 6 risk vectors — $288K monthly savings at 1:4.7 risk/reward ratio.',
    eta: '3 min',
    totalSystems: 47,
    affectedCritical: 3,
    exposure: '$288K',
    confidence: '87%',
    metrics: [
      { label: 'ROI', value: '320%', color: 'text-emerald-400' },
      { label: 'Confidence', value: '87%', color: 'text-cyan-400' },
      { label: 'Savings', value: '$288K', color: 'text-violet-400' },
    ],
    color: 'from-violet-500/10 to-purple-600/5',
    border: 'border-violet-500/15',
    accent: 'text-violet-400',
  },
  '/execution-planner': {
    step: 'Action Plan',
    mission: 'Deploy Remediation Plan',
    description: '42% execution completion across 3 sprints. 2 active blockers requiring executive attention — 74% sprint health with 82% quality score.',
    eta: '12 min',
    totalSystems: 47,
    affectedCritical: 2,
    exposure: '$1.08M',
    confidence: '82%',
    metrics: [
      { label: 'Complete', value: '42%', color: 'text-emerald-400' },
      { label: 'Blockers', value: '2', color: 'text-red-400' },
      { label: 'Health', value: '74%', color: 'text-amber-400' },
    ],
    color: 'from-rose-500/10 to-pink-600/5',
    border: 'border-rose-500/15',
    accent: 'text-rose-400',
  },
}

export default function ExecutiveBanner({ currentPage }) {
  const ctx = pageContext[currentPage]
  if (!ctx) return null

  const healthyCount = ctx.totalSystems - ctx.affectedCritical

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden rounded-lg border ${ctx.border} bg-gradient-to-r ${ctx.color} p-2 sm:p-3`}
    >
      <div className="flex items-start sm:items-center justify-between gap-2 flex-col sm:flex-row">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
            <span className={`text-[8px] font-mono ${ctx.accent} uppercase tracking-wider font-semibold`}>
              {ctx.step}
            </span>
            <div className="h-3 w-px bg-white/[0.06]" />
            <span className="text-[7px] text-slate-600 font-mono">Executive Briefing</span>
            <div className="h-3 w-px bg-white/[0.06]" />
            <div className="flex items-center gap-1 rounded-md border border-amber-500/15 bg-amber-500/[0.04] px-1.5 py-0.5">
              <svg className="h-2 w-2 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-[7px] font-mono text-amber-400">ETA {ctx.eta}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 mb-0.5">
            <svg className="h-2.5 w-2.5 text-cyan-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            <span className="text-[9px] font-semibold text-slate-300 font-mono">MISSION: {ctx.mission}</span>
          </div>
          <p className="text-[9px] sm:text-[10px] text-slate-400 leading-relaxed max-w-2xl">
            {ctx.description}
          </p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
          {(ctx.metrics || []).map((m, i) => (
            <div key={m.label} className={`flex items-center gap-1 rounded-md border border-white/[0.04] bg-white/[0.02] px-1.5 py-0.5 ${i > 0 ? 'hidden sm:flex' : ''}`}>
              <span className="text-[7px] text-slate-600 font-mono">{m.label}</span>
              <span className={`text-[9px] font-bold font-mono ${m.color}`}>{m.value}</span>
            </div>
          ))}
          <div className="flex items-center gap-1 rounded-md border border-white/[0.04] bg-white/[0.02] px-1.5 py-0.5">
            <svg className={`h-2 w-2 ${ctx.affectedCritical > 0 ? 'text-red-400' : 'text-emerald-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 01-1.125-1.125v-3.75zM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-8.25zM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-2.25z" />
            </svg>
            <span className="text-[7px] text-slate-600 font-mono">Systems</span>
            <span className={`text-[8px] font-bold font-mono ${ctx.affectedCritical > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
              {ctx.affectedCritical}
            </span>
            <span className="text-[7px] text-slate-500 font-mono">/ {ctx.totalSystems}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
