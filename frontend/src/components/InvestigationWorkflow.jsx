import { motion } from 'framer-motion'

const STEPS = [
  { id: 'incident', label: 'Incident', icon: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z', color: '#ef4444', desc: 'Payment pipeline failure detected' },
  { id: 'root-cause', label: 'Root Cause', icon: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z', color: '#8b5cf6', desc: 'Circuit breaker gap in retry loop' },
  { id: 'blast-radius', label: 'Blast Radius', icon: 'M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z', color: '#f59e0b', desc: '3 services · 12 endpoints impacted' },
  { id: 'impact', label: 'Business Impact', icon: 'M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z', color: '#06b6d4', desc: '$2.4M revenue at risk · 15K customers' },
  { id: 'remediation', label: 'Auto Remediation', icon: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z', color: '#22c55e', desc: 'Circuit breaker deployed · MTTR: 24min' },
]

export default function InvestigationWorkflow({ steps = STEPS, activeStep }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <div className="rounded-xl border border-white/[0.06] bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-slate-950/80 p-4 sm:p-6 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-5">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20">
            <svg className="h-3 w-3 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
          </div>
          <h2 className="text-sm font-bold text-white">Investigation Workflow</h2>
          <span className="rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-1.5 py-0.5 text-[8px] font-mono font-bold">5 STEPS</span>
        </div>

        <div className="relative">
          {/* Horizontal connecting line - desktop */}
          <div className="hidden sm:block absolute top-8 left-[calc(8%+16px)] right-[calc(8%+16px)] h-px bg-gradient-to-r from-cyan-500/40 via-violet-500/40 to-emerald-500/40" />

          {/* Vertical connecting line - mobile */}
          <div className="sm:hidden absolute left-[19px] top-0 bottom-0 w-px bg-gradient-to-b from-red-500/40 via-violet-500/40 via-amber-500/40 via-cyan-500/40 to-emerald-500/40" />

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 sm:gap-2">
            {steps.map((step, i) => {
              const isActive = activeStep === undefined || activeStep === step.id
              return (
                <motion.div key={step.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                  className={`relative flex sm:flex-col items-start sm:items-center gap-3 sm:gap-2 ${isActive ? '' : 'opacity-40'}`}>
                  {/* Step circle */}
                  <div className="relative flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full border-2 z-10"
                    style={{
                      borderColor: `${step.color}40`,
                      background: `${step.color}12`,
                      boxShadow: isActive ? `0 0 20px ${step.color}20` : 'none',
                    }}>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke={step.color} strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={step.icon} />
                    </svg>
                    <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full text-[8px] font-bold font-mono"
                      style={{ background: step.color, color: '#fff' }}>{i + 1}</span>
                  </div>
                  {/* Content */}
                  <div className="flex-1 sm:text-center min-w-0">
                    <p className="text-[11px] font-bold text-white mb-0.5">{step.label}</p>
                    <p className="text-[9px] text-slate-500 leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
