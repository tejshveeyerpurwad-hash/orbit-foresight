import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const FORENSICS_STEPS = [
  {
    icon: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z',
    label: 'Incident Detected',
    value: 'Payment Error Rate Spike',
    detail: 'Error rate increased from 0.2% to 8.7% over 90 seconds',
    color: 'text-red-400',
    border: 'border-red-500/20',
    bg: 'bg-red-500/[0.03]',
    dot: 'bg-red-500',
  },
  {
    icon: 'M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z',
    label: 'Dependency Chain',
    value: 'Payment Gateway → Billing Service → Auth Service',
    detail: '3 critical dependency paths affected by cascading failure',
    color: 'text-orange-400',
    border: 'border-orange-500/20',
    bg: 'bg-orange-500/[0.03]',
    dot: 'bg-orange-500',
  },
  {
    icon: 'M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12',
    label: 'Affected Services',
    value: 'Payment Gateway (Critical), Billing Service (High), Auth Service (Medium)',
    detail: '47 total services monitored, 3 impacted',
    color: 'text-amber-400',
    border: 'border-amber-500/20',
    bg: 'bg-amber-500/[0.03]',
    dot: 'bg-amber-500',
  },
  {
    icon: 'M11.42 15.17l-3.25-3.25a1.5 1.5 0 010-2.12l6.5-6.5a1.5 1.5 0 012.12 0l3.25 3.25a1.5 1.5 0 010 2.12l-6.5 6.5a1.5 1.5 0 01-2.12 0z',
    label: 'Root Cause',
    value: 'Circuit breaker threshold exceeded on Payment Gateway downstream',
    detail: 'Redis connection pool exhaustion caused by 8x traffic spike from billing retry storm',
    color: 'text-violet-400',
    border: 'border-violet-500/20',
    bg: 'bg-violet-500/[0.03]',
    dot: 'bg-violet-500',
  },
  {
    icon: 'M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    label: 'Revenue Impact',
    value: '$2.1M/hr exposure',
    detail: '$340K realized loss in 12 minutes before mitigation',
    color: 'text-red-400',
    border: 'border-red-500/20',
    bg: 'bg-red-500/[0.03]',
    dot: 'bg-red-500',
  },
  {
    icon: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z',
    label: 'Recommended Fix',
    value: 'Implement circuit breaker with proper backpressure',
    detail: 'Deploy fix: P0 (24h), Add monitoring: P1 (72h), Runbook: P2 (1 week)',
    color: 'text-emerald-400',
    border: 'border-emerald-500/20',
    bg: 'bg-emerald-500/[0.03]',
    dot: 'bg-emerald-500',
  },
]

export default function RootCauseForensics({ autoPlay = true, speed = 700 }) {
  const [visibleStep, setVisibleStep] = useState(autoPlay ? 0 : FORENSICS_STEPS.length)

  useEffect(() => {
    if (!autoPlay) return
    if (visibleStep >= FORENSICS_STEPS.length) return
    const t = setTimeout(() => setVisibleStep(s => s + 1), speed)
    return () => clearTimeout(t)
  }, [visibleStep, autoPlay, speed])

  return (
    <div className="space-y-2">
      {FORENSICS_STEPS.map((step, i) => (
        <motion.div
          key={step.label}
          initial={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
          animate={i < visibleStep ? {
            opacity: 1, x: 0, height: 'auto', marginBottom: 8,
          } : {
            opacity: 0, x: -20, height: 0, marginBottom: 0,
          }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <div className={`rounded-lg border ${step.border} ${step.bg} p-3 flex items-start gap-3`}>
            {/* Step number */}
            <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
              i < visibleStep ? `${step.dot}/20 text-white` : 'bg-slate-800 text-slate-600'
            } text-[10px] font-bold`}>
              {i < visibleStep ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                >
                  <svg className={`h-3.5 w-3.5 ${step.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={step.icon} />
                  </svg>
                </motion.div>
              ) : (
                i + 1
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[9px] font-mono text-slate-600 uppercase tracking-wider">{step.label}</span>
                {i === visibleStep - 1 && i < FORENSICS_STEPS.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-1"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-violet-500 animate-pulse" />
                    <span className="text-[8px] font-mono text-violet-400">ANALYZING</span>
                  </motion.div>
                )}
              </div>
              <p className={`text-xs font-semibold ${step.color}`}>{step.value}</p>
              <p className="text-[9px] text-slate-500 mt-0.5">{step.detail}</p>
            </div>

            {/* Arrow indicator */}
            {i < FORENSICS_STEPS.length - 1 && i < visibleStep && (
              <div className="flex flex-col items-center shrink-0">
                <svg className="h-4 w-4 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </div>
            )}
          </div>
        </motion.div>
      ))}

      {visibleStep >= FORENSICS_STEPS.length && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-lg border border-emerald-500/20 bg-emerald-500/[0.03] p-3 flex items-center gap-2"
        >
          <svg className="h-4 w-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-[10px] text-slate-400">Forensic analysis complete. Root cause identified with 94% AI confidence.</span>
        </motion.div>
      )}
    </div>
  )
}
