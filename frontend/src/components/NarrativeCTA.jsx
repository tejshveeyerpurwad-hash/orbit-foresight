import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const journeySteps = [
  { page: '/dashboard', label: 'Dashboard', question: 'What is happening right now?', number: '01', value: 'Situation Awareness', color: 'cyan' },
  { page: '/intelligence', label: 'Intelligence', question: 'Why did it happen?', number: '02', value: 'Root Cause Analysis', color: 'purple' },
  { page: '/time-machine', label: 'Time Machine', question: 'When has this happened before?', number: '03', value: 'Historical Patterns', color: 'amber' },
  { page: '/knowledge-graph', label: 'Knowledge Graph', question: 'What else will break?', number: '04', value: 'Dependency Impact', color: 'emerald' },
  { page: '/cto-report', label: 'CTO Report', question: 'What is the business impact?', number: '05', value: 'Executive Decision', color: 'violet' },
  { page: '/execution-planner', label: 'Execution', question: 'What should we do next?', number: '06', value: 'Action Plan', color: 'rose' },
]

const businessValues = {
  '/dashboard': { label: 'Risk Detection', value: '$288K', detail: 'Potential exposure identified' },
  '/intelligence': { label: 'Root Cause Found', value: '$340K', detail: 'Risk reduction achievable' },
  '/time-machine': { label: 'Pattern Matched', value: '$120K', detail: 'Avg incident cost mitigated' },
  '/knowledge-graph': { label: 'Blast Radius Mapped', value: '$340K', detail: 'Dependency exposure contained' },
  '/cto-report': { label: 'Executive Decision', value: '$288K', detail: 'Monthly savings projected' },
  '/execution-planner': { label: 'Execution Plan', value: '42%', detail: 'Completion rate achieved' },
}

const pageCTAs = {
  '/dashboard': {
    primary: { to: '/intelligence', label: 'Investigate Root Cause', icon: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z' },
    secondary: { to: '/intelligence', label: 'Open Intelligence Center' },
    narrative: 'System anomalies detected across 6 services with 96% AI confidence. 3 critical risks identified — payment error rate spike, Redis memory pressure, billing dependency timeout. Begin investigation to trace root cause.',
  },
  '/intelligence': {
    primary: { to: '/time-machine', label: 'Replay Historical Incident', icon: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z' },
    secondary: { to: '/time-machine', label: 'Open Time Machine' },
    narrative: 'Root cause isolated in payment processing pipeline — missing circuit breaker in retry loop. 8 failure modes across 4 services with 94% correlation. Proceed to historical replay for pattern confirmation.',
  },
  '/time-machine': {
    primary: { to: '/knowledge-graph', label: 'View Dependency Blast Radius', icon: 'M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z' },
    secondary: { to: '/knowledge-graph', label: 'Open Knowledge Graph' },
    narrative: 'Incident pattern confirmed across 3 recurrences over 6 weeks. 91% pattern match — retry queue overflow repeats every 4-6 weeks. Visualize dependency blast radius to quantify impact.',
  },
  '/knowledge-graph': {
    primary: { to: '/cto-report', label: 'Generate Business Impact Report', icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z' },
    secondary: { to: '/cto-report', label: 'Open CTO Report' },
    narrative: 'Dependency graph reveals $340K blast radius across 4 critical services. 7 propagation paths with 92% accuracy. Generate CTO report with remediation roadmap for executive decision.',
  },
  '/cto-report': {
    primary: { to: '/execution-planner', label: 'Create Execution Plan', icon: 'M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z' },
    secondary: { to: '/execution-planner', label: 'Open Execution Planner' },
    narrative: 'Business impact quantified at $288K monthly savings with 320% ROI. 87% confidence across 6 risk vectors. 5 mitigation plans with clear owners and timelines. Proceed to execution planning.',
  },
  '/execution-planner': {
    primary: null,
    secondary: null,
    narrative: 'End-to-end AI investigation complete. From anomaly detection to execution plan — $1.088M total business value identified. 42% completion across 3 sprints with 82% quality score.',
    terminal: true,
  },
}

export function JourneyNav({ currentPage, onStepClick }) {
  const currentIdx = journeySteps.findIndex(s => s.page === currentPage)
  const cumulative = currentIdx >= 0
    ? journeySteps.slice(0, currentIdx + 1).reduce((sum, s) => {
        const bv = businessValues[s.page]
        if (s.page === '/execution-planner') return sum
        const val = parseFloat((bv?.value || '$0').replace(/[$,]/g, ''))
        return sum + (isNaN(val) ? 0 : val)
      }, 0)
    : 0

  return (
    <div className="flex items-center w-full">
      <div className="flex items-center gap-0 flex-1">
        {journeySteps.map((step, i) => {
          const isCurrent = i === currentIdx
          const isPast = i < currentIdx
          const isFuture = i > currentIdx
          const stepColors = {
            cyan: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300',
            purple: 'border-purple-500/30 bg-purple-500/10 text-purple-300',
            amber: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
            emerald: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
            violet: 'border-violet-500/30 bg-violet-500/10 text-violet-300',
            rose: 'border-rose-500/30 bg-rose-500/10 text-rose-300',
          }

          return (
            <div key={step.page} className="flex items-center flex-1 last:flex-none">
              <Link
                to={step.page}
                className={`flex items-center gap-1.5 sm:gap-2 py-1.5 px-1.5 sm:px-2.5 rounded-lg transition-all group relative ${
                  isCurrent
                    ? 'bg-white/[0.04] border border-white/[0.08] shadow-sm'
                    : isPast
                    ? 'hover:bg-white/[0.02]'
                    : 'hover:bg-white/[0.01]'
                }`}
                onClick={(e) => { if (onStepClick) onStepClick(step.page) }}
              >
                <div className={`flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full text-[7px] sm:text-[8px] font-bold font-mono border transition-all ${
                  isCurrent
                    ? stepColors[step.color]
                    : isPast
                    ? 'border-emerald-500/40 bg-emerald-500/20 text-emerald-400'
                    : 'border-slate-700 bg-slate-800/50 text-slate-600'
                } ${isCurrent ? 'shadow-sm' : ''}`}>
                  {isPast ? (
                    <svg className="h-2 w-2 sm:h-2.5 sm:w-2.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  ) : (
                    step.number
                  )}
                </div>
                <span className={`text-[8px] sm:text-[9px] font-semibold font-mono leading-none ${
                  isCurrent
                    ? 'text-cyan-200'
                    : isPast
                    ? 'text-emerald-400/70'
                    : 'text-slate-600 group-hover:text-slate-500'
                }`}>
                  {step.label}
                </span>
                {isCurrent && (
                  <motion.span
                    layoutId="journey-glow"
                    className="absolute -inset-0.5 rounded-lg border border-cyan-400/20 bg-cyan-400/5"
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  />
                )}
              </Link>
              {i < journeySteps.length - 1 && (
                <div className={`flex-1 h-px mx-1 sm:mx-2 ${
                  isPast && !isCurrent ? 'bg-gradient-to-r from-emerald-500/40 to-emerald-500/10' :
                  isCurrent ? 'bg-gradient-to-r from-cyan-500/40 to-slate-700' :
                  'bg-slate-800'
                }`} />
              )}
            </div>
          )
        })}
      </div>

      {currentIdx >= 0 && (
        <div className="flex items-center gap-1.5 shrink-0 ml-2 sm:ml-3 pl-2 sm:pl-3 border-l border-white/[0.06]">
          <div className="flex items-center gap-1 rounded-md bg-emerald-500/10 border border-emerald-500/15 px-1.5 sm:px-2 py-0.5">
            <svg className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33" />
            </svg>
            <span className="text-[8px] sm:text-[9px] font-bold font-mono text-emerald-400">${cumulative.toLocaleString()}</span>
            <span className="text-[6px] sm:text-[7px] text-emerald-600 hidden sm:inline">Value</span>
          </div>
        </div>
      )}
    </div>
  )
}

export function NarrativeCTA({ currentPage, confidence = 0, impact = '' }) {
  const cta = pageCTAs[currentPage]
  const idx = journeySteps.findIndex(s => s.page === currentPage)
  const step = idx >= 0 ? journeySteps[idx] : null
  const bv = businessValues[currentPage]
  const navigate = useNavigate()

  const primaryColor = step?.color === 'purple' ? 'from-purple-500 to-violet-600' :
    step?.color === 'amber' ? 'from-amber-500 to-orange-600' :
    step?.color === 'emerald' ? 'from-emerald-500 to-green-600' :
    step?.color === 'violet' ? 'from-violet-500 to-purple-600' :
    step?.color === 'rose' ? 'from-rose-500 to-pink-600' :
    'from-cyan-500 to-blue-600'

  if (!cta) return null

  const progressPct = ((idx + 1) / journeySteps.length) * 100

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-white/[0.06] bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-900/60 p-3 sm:p-4 mt-2 sm:mt-3 overflow-hidden relative"
    >
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-slate-800/50">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progressPct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-full bg-gradient-to-r ${step?.color === 'purple' ? 'from-purple-500 to-violet-400' : step?.color === 'amber' ? 'from-amber-500 to-orange-400' : step?.color === 'emerald' ? 'from-emerald-500 to-green-400' : step?.color === 'violet' ? 'from-violet-500 to-purple-400' : step?.color === 'rose' ? 'from-rose-500 to-pink-400' : 'from-cyan-500 to-blue-400'}`}
        />
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-1">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`flex h-8 w-8 items-center justify-center rounded-lg border shrink-0 ${
            step?.color === 'purple' ? 'bg-purple-500/15 border-purple-500/30' :
            step?.color === 'amber' ? 'bg-amber-500/15 border-amber-500/30' :
            step?.color === 'emerald' ? 'bg-emerald-500/15 border-emerald-500/30' :
            step?.color === 'violet' ? 'bg-violet-500/15 border-violet-500/30' :
            step?.color === 'rose' ? 'bg-rose-500/15 border-rose-500/30' :
            'bg-cyan-500/15 border-cyan-500/30'
          }`}>
            <span className={`text-[9px] font-bold font-mono ${
              step?.color === 'purple' ? 'text-purple-300' :
              step?.color === 'amber' ? 'text-amber-300' :
              step?.color === 'emerald' ? 'text-emerald-300' :
              step?.color === 'violet' ? 'text-violet-300' :
              step?.color === 'rose' ? 'text-rose-300' :
              'text-cyan-300'
            }`}>{step?.number}</span>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[8px] text-slate-600 font-mono uppercase tracking-wider">
                Step {step?.number} — {step?.label}
              </span>
              {bv && (
                <span className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[7px] font-bold font-mono ${
                  step?.color === 'purple' ? 'bg-purple-500/10 text-purple-400' :
                  step?.color === 'amber' ? 'bg-amber-500/10 text-amber-400' :
                  step?.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-400' :
                  step?.color === 'violet' ? 'bg-violet-500/10 text-violet-400' :
                  step?.color === 'rose' ? 'bg-rose-500/10 text-rose-400' :
                  'bg-cyan-500/10 text-cyan-400'
                }`}>
                  {bv.value} {bv.label}
                </span>
              )}
            </div>
            <div className="text-[10px] sm:text-[11px] text-slate-400 leading-relaxed max-w-lg">
              {cta.narrative}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1 shrink-0">
          <div className="flex items-center gap-1">
            <svg className="h-1.5 w-1.5 text-cyan-400" fill="currentColor" viewBox="0 0 8 8">
              <circle cx="4" cy="4" r="3" />
            </svg>
            <span className="text-[7px] font-mono text-slate-600 uppercase tracking-widest font-semibold">Next Recommended Action</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-end">
          {confidence > 0 && (
            <div className="flex items-center gap-1.5 rounded-md border border-white/[0.06] bg-white/[0.03] px-2 py-1">
              <div className="flex items-center gap-1">
                <svg className="h-3 w-3 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
                <span className="text-[8px] text-slate-600">AI Confidence</span>
              </div>
              <span className="text-[9px] font-bold font-mono text-emerald-400">{confidence}%</span>
            </div>
          )}

          {impact && (
            <div className="flex items-center gap-1 rounded-md border border-amber-500/15 bg-amber-500/[0.04] px-2 py-1">
              <svg className="h-2.5 w-2.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              <span className="text-[8px] text-amber-400/80">{impact}</span>
            </div>
          )}

          {cta.terminal ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const el = document.createElement('a')
                  el.href = '/api/export/strategy'
                  el.download = 'orbit-foresight-strategy.pdf'
                  el.click()
                }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-green-600 px-3 py-1.5 text-[10px] font-semibold text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                Export Strategy
              </button>
              <button
                onClick={() => navigate('/dashboard?demo=true')}
                className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-400/30 bg-cyan-400/10 px-3 py-1.5 text-[10px] font-semibold text-cyan-300 hover:bg-cyan-400/15 transition-all"
              >
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                </svg>
                Demo Success State
              </button>
              <div className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-violet-500/20 to-purple-600/20 border border-violet-500/30 px-3 py-1.5">
                <svg className="h-3 w-3 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
                <span className="text-[9px] font-semibold text-violet-300">Final AI Recommendation</span>
                <span className="text-[8px] text-violet-500/80 font-mono">96% confidence</span>
              </div>
            </div>
          ) : (
            <>
              {cta.secondary && (
                <Link
                  to={cta.secondary.to}
                  className="hidden sm:inline-flex items-center gap-1 rounded-lg border border-white/[0.06] px-2.5 py-1.5 text-[9px] text-slate-500 hover:text-slate-300 hover:border-white/[0.12] transition-all"
                >
                  {cta.secondary.label}
                  <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              )}
              <Link
                to={cta.primary.to}
                className={`inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r ${primaryColor} px-3 py-1.5 text-[10px] font-semibold text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all`}
              >
                {cta.primary.label}
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </>
          )}
           </div>
        </div>
      </div>
    </motion.div>
  )
}

export default NarrativeCTA
