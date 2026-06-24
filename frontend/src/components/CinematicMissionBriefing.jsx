import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const MISSION_STEPS = [
  { text: 'AI OPERATING SYSTEM FOR ENGINEERING LEADERS', sub: 'Predict. Prevent. Protect.', delay: 400 },
  { text: 'INITIALIZING ORBIT VISION AI', sub: 'Neural Threat Detection Engine', delay: 2000 },
  { text: 'SCANNING 47 SERVICES', sub: 'Distributed topology analysis active', delay: 3500 },
  { text: '3 CRITICAL VULNERABILITIES DETECTED', sub: 'Payment Gateway — Billing — Auth Services', delay: 5000 },
  { text: 'BLAST RADIUS ESTIMATE: $2.8M', sub: 'Executive action required within 24 hours', delay: 6500 },
  { text: 'MISSION BRIEFING ACTIVE', sub: 'All systems nominal. Ready for executive command.', delay: 8000 },
]

const KPIS = [
  { label: 'Revenue Protected', value: 2400000, prefix: '$', suffix: '', color: 'text-emerald-400', barColor: 'bg-emerald-500' },
  { label: 'Risk Avoided', value: 840000, prefix: '$', suffix: '', color: 'text-cyan-400', barColor: 'bg-cyan-500' },
  { label: 'Engineering Hours Saved', value: 12400, prefix: '', suffix: 'h', color: 'text-violet-400', barColor: 'bg-violet-500' },
  { label: 'Deployment Confidence', value: 94, prefix: '', suffix: '%', color: 'text-amber-400', barColor: 'bg-amber-500' },
]

function AnimatedKPI({ kpi, delay }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    const timeout = setTimeout(() => {
      const steps = 40
      const inc = kpi.value / steps
      let cur = 0
      const iv = setInterval(() => {
        cur += inc
        if (cur >= kpi.value) { setCount(kpi.value); clearInterval(iv) }
        else setCount(Math.floor(cur))
      }, 30)
      return () => clearInterval(iv)
    }, delay)
    return () => clearTimeout(timeout)
  }, [kpi.value, delay])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: delay / 1000 }}
      className="flex flex-col items-center text-center"
    >
      <div className={`text-2xl sm:text-3xl font-bold ${kpi.color} mb-0.5`}>
        {kpi.prefix}{count.toLocaleString()}{kpi.suffix}
      </div>
      <div className="text-[9px] font-mono text-slate-500 tracking-wider">{kpi.label}</div>
      <div className="h-0.5 w-full max-w-[80px] mt-1.5 rounded-full bg-slate-800 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, (count / kpi.value) * 100)}%` }}
          transition={{ duration: 0.5 }}
          className={`h-full rounded-full ${kpi.barColor}`}
        />
      </div>
    </motion.div>
  )
}

export default function CinematicMissionBriefing({ onComplete }) {
  const [step, setStep] = useState(0)
  const [visible, setVisible] = useState(true)
  const [showKPIs, setShowKPIs] = useState(false)

  useEffect(() => {
    if (step >= MISSION_STEPS.length) {
      setShowKPIs(true)
      const timeout = setTimeout(() => {
        setVisible(false)
        onComplete?.()
      }, 3000)
      return () => clearTimeout(timeout)
    }

    const timeout = setTimeout(() => {
      setStep(s => s + 1)
    }, MISSION_STEPS[step].delay)

    return () => clearTimeout(timeout)
  }, [step, onComplete])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black"
        >
          {/* Scanline overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black via-slate-950/80 to-black pointer-events-none" />
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
              backgroundSize: '100% 4px',
            }}
          />

          {/* Grid effect */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          {/* Top security bar */}
          <div className="absolute top-0 left-0 right-0 p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-mono text-emerald-500/80 tracking-widest">CLASSIFIED // EXECUTIVE EYES ONLY</span>
            </div>
            <span className="text-[9px] font-mono text-slate-700">ORBIT VISION v3.2.1</span>
          </div>

          {/* Bottom indicator */}
          {step < MISSION_STEPS.length && (
            <div className="absolute bottom-8 flex flex-col items-center gap-2">
              <div className="flex gap-1">
                {MISSION_STEPS.map((_, i) => (
                  <div key={i} className={`h-0.5 w-6 rounded-full transition-all duration-500 ${i <= step ? 'bg-cyan-500/80' : 'bg-white/[0.06]'}`} />
                ))}
              </div>
              <span className="text-[8px] font-mono text-slate-700 tracking-widest uppercase">AI Threat Assessment in Progress</span>
            </div>
          )}

          {/* Corner brackets */}
          <div className="absolute top-8 left-8 w-10 h-10 border-t-2 border-l-2 border-cyan-500/30" />
          <div className="absolute top-8 right-8 w-10 h-10 border-t-2 border-r-2 border-cyan-500/30" />
          <div className="absolute bottom-8 left-8 w-10 h-10 border-b-2 border-l-2 border-cyan-500/30" />
          <div className="absolute bottom-8 right-8 w-10 h-10 border-b-2 border-r-2 border-cyan-500/30" />

          {/* Content */}
          <AnimatePresence mode="wait">
            {step < MISSION_STEPS.length ? (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 text-center px-6"
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent mb-8 mx-auto max-w-xs"
                />
                <h1 className="text-xl sm:text-3xl font-bold tracking-[0.15em] sm:tracking-[0.3em] text-white mb-3">
                  {MISSION_STEPS[step].text}
                </h1>
                <p className="text-xs font-mono text-slate-500 tracking-wider">
                  {MISSION_STEPS[step].sub}
                </p>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent mt-8 mx-auto max-w-xs"
                />
              </motion.div>
            ) : (
              <motion.div
                key="complete"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 text-center px-6 w-full max-w-2xl"
              >
                <div className="relative mb-6 mx-auto w-16 h-16">
                  <div className="absolute inset-0 rounded-full border-2 border-emerald-500/30 animate-ping" />
                  <div className="absolute inset-2 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center">
                    <svg className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <h1 className="text-lg font-bold tracking-[0.2em] text-white mb-1">MISSION READY</h1>
                <p className="text-[10px] font-mono text-slate-500 mb-8">All systems nominal. Proceed to command interface.</p>

                {showKPIs && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6"
                  >
                    {KPIS.map((kpi, i) => (
                      <AnimatedKPI key={kpi.label} kpi={kpi} delay={100 + i * 200} />
                    ))}
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
