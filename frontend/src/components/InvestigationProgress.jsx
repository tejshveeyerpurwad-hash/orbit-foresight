import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const steps = [
  { page: '/dashboard', label: 'Risk Detected', icon: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z', color: 'cyan' },
  { page: '/intelligence', label: 'Service Impact Identified', icon: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z', color: 'purple' },
  { page: '/time-machine', label: 'Historical Match', icon: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z', color: 'amber' },
  { page: '/knowledge-graph', label: 'Dependency Analysis', icon: 'M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z', color: 'emerald' },
  { page: '/cto-report', label: 'Business Impact', icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z', color: 'violet' },
  { page: '/execution-planner', label: 'Execution Plan', icon: 'M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z', color: 'rose' },
]

const stepColors = {
  cyan: { base: 'border-cyan-500/20 bg-cyan-500/10 text-cyan-300', active: 'border-cyan-400 bg-cyan-500 text-white', glow: 'shadow-cyan-500/30' },
  purple: { base: 'border-purple-500/20 bg-purple-500/10 text-purple-300', active: 'border-purple-400 bg-purple-500 text-white', glow: 'shadow-purple-500/30' },
  amber: { base: 'border-amber-500/20 bg-amber-500/10 text-amber-300', active: 'border-amber-400 bg-amber-500 text-white', glow: 'shadow-amber-500/30' },
  emerald: { base: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300', active: 'border-emerald-400 bg-emerald-500 text-white', glow: 'shadow-emerald-500/30' },
  violet: { base: 'border-violet-500/20 bg-violet-500/10 text-violet-300', active: 'border-violet-400 bg-violet-500 text-white', glow: 'shadow-violet-500/30' },
  rose: { base: 'border-rose-500/20 bg-rose-500/10 text-rose-300', active: 'border-rose-400 bg-rose-500 text-white', glow: 'shadow-rose-500/30' },
}

export default function InvestigationProgress({ currentPage }) {
  const navigate = useNavigate()
  const currentIdx = steps.findIndex(s => s.page === currentPage)

  return (
    <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2">
      <div className="flex items-center gap-1.5 mb-1.5">
        <svg className="h-3 w-3 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
        <span className="text-[8px] font-mono text-slate-500 uppercase tracking-wider font-semibold">Investigation Progress</span>
      </div>
      <div className="flex items-center gap-1 overflow-x-auto scrollbar-none pb-0.5">
        {steps.map((s, i) => {
          const isDone = i < currentIdx
          const isCurrent = i === currentIdx
          const isFuture = i > currentIdx
          const colors = stepColors[s.color]

          return (
            <div key={s.page} className="flex items-center gap-0 shrink-0">
              <button
                onClick={() => navigate(s.page)}
                className={`flex items-center gap-1 rounded-md border px-1.5 py-1 text-[7px] font-mono font-medium transition-all ${
                  isCurrent
                    ? `${colors.active} border shadow-sm ${colors.glow}`
                    : isDone
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                    : 'border-slate-700 bg-slate-800/30 text-slate-600 hover:border-slate-600 hover:text-slate-500'
                }`}
              >
                {isDone ? (
                  <svg className="h-2 w-2 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                ) : isCurrent ? (
                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="h-1.5 w-1.5 rounded-full bg-current"
                  />
                ) : (
                  <svg className="h-2 w-2 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                <span>{s.label}</span>
              </button>
              {i < steps.length - 1 && (
                <div className={`h-px w-2 ${isDone ? 'bg-emerald-500/40' : isCurrent ? 'bg-gradient-to-r from-cyan-500/40 to-slate-700' : 'bg-slate-800'}`} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
