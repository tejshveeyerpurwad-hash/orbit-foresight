import { Link } from 'react-router-dom'
import { motion, useMotionValue, useSpring, animate } from 'framer-motion'
import { useEffect, useState } from 'react'

const sectionLabel = 'text-[8px] font-mono text-slate-600 uppercase tracking-[0.15em] font-semibold'

/* ── Animated Counter ── */
function Counter({ to, suffix = '', decimals = 0 }) {
  const [display, setDisplay] = useState(`${Number(0).toFixed(decimals)}${suffix}`)
  const motionVal = useMotionValue(0)
  const springVal = useSpring(motionVal, { stiffness: 60, damping: 20 })

  useEffect(() => {
    setDisplay(`${Number(0).toFixed(decimals)}${suffix}`)
    const unsub = springVal.on('change', (v) => {
      setDisplay(`${Number(v).toFixed(decimals)}${suffix}`)
    })
    const controls = animate(motionVal, to, { duration: 2, ease: 'easeOut' })
    return () => { controls.stop(); unsub() }
  }, [to, decimals, suffix, springVal, motionVal])

  return (
    <span className="text-lg sm:text-xl lg:text-2xl font-bold font-mono text-white tracking-tight">
      {display}
    </span>
  )
}

/* ── Section 2 Metric ── */
function MetricCard({ value, label, suffix = '', decimals = 0, icon }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative overflow-hidden rounded-lg border border-white/[0.04] bg-white/[0.015] p-3 hover:border-cyan-500/20 hover:bg-cyan-500/[0.03] transition-all"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative flex items-start gap-2.5">
        <svg className="h-3.5 w-3.5 text-cyan-500/50 mt-1 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
        </svg>
        <div className="min-w-0">
          <Counter to={value} suffix={suffix} decimals={decimals} />
          <div className="text-[8px] sm:text-[9px] text-slate-600 font-mono leading-tight mt-0.5">{label}</div>
        </div>
      </div>
    </motion.div>
  )
}

/* ── Particles ── */
function Particle({ index }) {
  const left = ((index * 17 + 31) % 100)
  const size = 1 + (index % 3)
  const duration = 10 + (index % 7) * 2
  const delay = (index * 0.9) % 8
  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        left: `${left}%`,
        width: size,
        height: size,
        top: -size,
        background: index % 2 === 0 ? 'rgba(6,182,212,0.25)' : 'rgba(59,130,246,0.2)',
        boxShadow: index % 2 === 0 ? '0 0 6px rgba(6,182,212,0.3)' : '0 0 6px rgba(59,130,246,0.2)',
      }}
      animate={{ y: [0, 800], opacity: [0, 0.7, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: 'linear' }}
    />
  )
}

/* ── Glow Badge ── */
function GlowBadge({ label, icon }) {
  return (
    <div className="group relative flex items-center gap-1.5 rounded-md border border-white/[0.04] bg-white/[0.015] px-2.5 py-1.5 hover:border-cyan-500/20 hover:bg-cyan-500/[0.04] hover:shadow-[0_0_12px_rgba(6,182,212,0.08)] transition-all">
      <svg className="h-3 w-3 text-cyan-500/60 group-hover:text-cyan-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
      </svg>
      <span className="text-[8px] sm:text-[9px] font-mono text-slate-500 group-hover:text-slate-300 transition-colors tracking-wide">{label}</span>
    </div>
  )
}

/* ── DATA ── */
const metricsData = [
  { value: 847, label: 'Deployments Analyzed', suffix: '', decimals: 0, icon: 'M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605' },
  { value: 184, label: 'Incidents Investigated', suffix: '', decimals: 0, icon: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z' },
  { value: 94, label: 'Prediction Accuracy', suffix: '%', decimals: 0, icon: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z' },
  { value: 99.97, label: 'Uptime', suffix: '%', decimals: 2, icon: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z' },
  { value: 320, label: 'ROI', suffix: '%', decimals: 0, icon: 'M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { value: 288000, label: 'Risk Prevented', suffix: '', decimals: 0, icon: 'M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
]

const trustData = [
  { label: 'SOC 2 READY', icon: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z' },
  { label: 'GDPR', icon: 'M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z' },
  { label: 'AES-256', icon: 'M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z' },
  { label: 'Enterprise SLA', icon: 'M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776' },
  { label: '24/7 Support', icon: 'M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155' },
  { label: 'Audit Logging', icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z' },
]

const productItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/intelligence', label: 'Intelligence Center' },
  { to: '/time-machine', label: 'Time Machine' },
  { to: '/knowledge-graph', label: 'Knowledge Graph' },
  { to: '/cto-report', label: 'Impact Analysis' },
  { to: '/cto-report', label: 'CTO Report' },
  { to: '/execution-planner', label: 'Execution Planner' },
]

const socialItems = [
  { label: 'GitHub', href: 'https://github.com', icon: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' },
  { label: 'LinkedIn', href: 'https://linkedin.com', icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
  { label: 'Documentation', to: '/help', icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z' },
  { label: 'Architecture', to: '/help?tab=architecture', icon: 'M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z' },
]

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/[0.04] bg-gradient-to-b from-slate-950 via-slate-950/95 to-slate-950">
      {/* ── Background FX ── */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:28px_28px]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
      <div className="absolute -top-48 -left-48 h-96 w-96 rounded-full bg-cyan-500/[0.015] blur-3xl" />
      <div className="absolute -bottom-48 -right-48 h-96 w-96 rounded-full bg-blue-600/[0.015] blur-3xl" />
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 14 }, (_, i) => <Particle key={i} index={i} />)}
      </div>

      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-5 sm:py-7 lg:py-9">
        <div className="mx-auto max-w-7xl">

          {/* ════════════════════════════════════════
             SECTION 1 — ENTERPRISE CTA
             ════════════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative mb-4 sm:mb-5 overflow-hidden rounded-xl border border-white/[0.06] bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950/80 p-5 sm:p-7 lg:p-9 text-center"
          >
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:18px_18px]" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/25 to-transparent" />
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-cyan-500/5 via-blue-600/5 to-cyan-500/5 opacity-50 blur-xl" />
            <div className="absolute -top-32 -right-32 h-64 w-64 rounded-full bg-cyan-500/[0.04] blur-3xl" />
            <div className="absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-blue-600/[0.03] blur-3xl" />

            <div className="relative">
              <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-white tracking-tight mb-1.5">
                Engineering Intelligence{' '}
                <span className="bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-500 bg-clip-text text-transparent">Starts Here.</span>
              </h2>
              <p className="text-[10px] sm:text-xs text-slate-500 max-w-lg mx-auto mb-4 sm:mb-5 leading-relaxed">
                Predict failures. Understand blast radius. Execute with confidence.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
                <Link
                  to="/intelligence"
                  className="group relative inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 hover:shadow-xl hover:shadow-cyan-500/30 hover:scale-[1.03] active:scale-[0.97] transition-all overflow-hidden"
                >
                  <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent_30%,rgba(255,255,255,0.1)_50%,transparent_70%)] bg-[length:200%_100%] animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative">Launch OrbitForesight</span>
                  <svg className="relative h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
                <Link
                  to="/?present=1"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] px-5 py-2.5 text-xs font-semibold text-slate-300 hover:text-white hover:border-cyan-500/30 hover:bg-cyan-500/[0.05] hover:shadow-[0_0_16px_rgba(6,182,212,0.06)] transition-all"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                  </svg>
                  Watch Executive Demo
                </Link>
              </div>
            </div>
          </motion.div>

          {/* ════════════════════════════════════════
             SECTION 2 — LIVE PLATFORM NUMBERS
             ════════════════════════════════════════ */}
          <div className="mb-4 sm:mb-5">
            <div className="flex items-center gap-1.5 mb-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className={sectionLabel}>Live Platform Numbers</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1.5">
              {metricsData.map((m, i) => (
                <MetricCard key={m.label} {...m} />
              ))}
            </div>
          </div>

          {/* ════════════════════════════════════════
             SECTION 3 — TRUST BAR
             ════════════════════════════════════════ */}
          <div className="mb-4 sm:mb-5">
            <div className="flex items-center gap-1.5 mb-2">
              <svg className="h-2.5 w-2.5 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              <span className={sectionLabel}>Trust &amp; Compliance</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {trustData.map((t) => (
                <GlowBadge key={t.label} {...t} />
              ))}
            </div>
          </div>

          {/* ════════════════════════════════════════
             SECTIONS 4+5 — PRODUCT MAP + PLATFORM STATUS
             ════════════════════════════════════════ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-5">
            {/* Product Map */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-lg border border-white/[0.04] bg-white/[0.015] p-3 sm:p-4"
            >
              <div className="flex items-center gap-1.5 mb-2">
                <svg className="h-2.5 w-2.5 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6z" />
                </svg>
                <span className={sectionLabel}>Product Map</span>
              </div>
              <div className="grid grid-cols-2 gap-1">
                {(productItems || []).map((p) => (
                  <Link
                    key={p.label}
                    to={p.to}
                    className="group flex items-center gap-1.5 rounded-md border border-white/[0.03] bg-white/[0.01] px-2 py-1.5 text-[9px] sm:text-[10px] font-mono text-slate-500 hover:text-slate-200 hover:border-cyan-500/20 hover:bg-cyan-500/[0.04] hover:translate-x-0.5 transition-all"
                  >
                    <svg className="h-2 w-2 text-cyan-500/0 group-hover:text-cyan-400 transition-all" fill="currentColor" viewBox="0 0 8 8">
                      <circle cx="4" cy="4" r="3" />
                    </svg>
                    {p.label}
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Platform Status */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 }}
              className="rounded-lg border border-white/[0.04] bg-white/[0.015] p-3 sm:p-4"
            >
              <div className="flex items-center gap-1.5 mb-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-500 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500" />
                </span>
                <span className={sectionLabel}>Platform Status</span>
              </div>
              <div className="space-y-1">
                {[
                  { label: 'Live Systems', value: 'All Operational', color: 'text-emerald-400', pulse: true },
                  { label: 'Services', value: '47 Monitored', color: 'text-cyan-400' },
                  { label: 'Teams', value: '12 Active', color: 'text-blue-400' },
                  { label: 'Critical Risks', value: '3 Open', color: 'text-red-400' },
                  { label: 'AI Confidence', value: '96%', color: 'text-emerald-400' },
                ].map((s) => (
                  <div key={s.label} className="flex items-center justify-between rounded-md border border-white/[0.03] bg-white/[0.01] px-2 py-1">
                    <div className="flex items-center gap-1.5">
                      {s.pulse && (
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        </span>
                      )}
                      {!s.pulse && <div className="h-1.5 w-1.5 rounded-full bg-slate-700" />}
                      <span className="text-[8px] sm:text-[9px] font-mono text-slate-600">{s.label}</span>
                    </div>
                    <span className={`text-[8px] sm:text-[9px] font-mono font-semibold ${s.color}`}>{s.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ════════════════════════════════════════
             SECTION 6 — SOCIAL & LINKS
             ════════════════════════════════════════ */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-3 sm:mb-4">
            {socialItems.map((s) => {
              const isExternal = s.href
              const Comp = isExternal ? 'a' : Link
              const props = isExternal
                ? { href: s.href, target: '_blank', rel: 'noopener noreferrer' }
                : { to: s.to }
              return (
                <Comp
                  key={s.label}
                  {...props}
                  className="group relative flex items-center gap-2 rounded-lg border border-white/[0.04] bg-white/[0.015] px-3 py-1.5 hover:border-cyan-500/25 hover:bg-cyan-500/[0.04] hover:shadow-[0_0_14px_rgba(6,182,212,0.06)] transition-all"
                >
                  <svg className="h-3.5 w-3.5 text-slate-600 group-hover:text-cyan-400 transition-colors" fill={isExternal ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke={isExternal ? 'none' : 'currentColor'} strokeWidth={isExternal ? 0 : 1.5}>
                    {isExternal ? (
                      <path d={s.icon} />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" d={s.icon} />
                    )}
                  </svg>
                  <span className="text-[9px] font-mono text-slate-600 group-hover:text-slate-300 transition-colors">{s.label}</span>
                </Comp>
              )
            })}
          </div>

          {/* ════════════════════════════════════════
             SECTION 7 — FINAL CLOSING STRIP
             ════════════════════════════════════════ */}
          <div className="border-t border-white/[0.03] pt-3 sm:pt-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[8px] sm:text-[9px] text-slate-700">
              <div className="flex items-center gap-2">
                <div className="relative flex h-3.5 w-3.5 items-center justify-center">
                  <div className="absolute h-3.5 w-3.5 rounded-full bg-cyan-500/20" />
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                    className="absolute h-3.5 w-3.5 rounded-full border border-cyan-500/30 border-t-transparent"
                  />
                  <div className="relative h-1 w-1 rounded-full bg-cyan-400" />
                </div>
                <span className="font-semibold text-slate-500">
                  Orbit<span className="text-cyan-400">Foresight</span>
                </span>
                <span className="text-slate-700/60">v3.4.1</span>
              </div>
              <span className="text-slate-700/60">Built for engineering leaders.</span>
              <span className="text-slate-700/60">© 2026 OrbitForesight</span>
            </div>
          </div>

        </div>
      </div>
    </footer>
  )
}
