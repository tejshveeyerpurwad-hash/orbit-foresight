import { motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import InvestigationProgress from './InvestigationProgress'

const investigation = {
  title: 'Payment Pipeline Failure',
  subtitle: 'Forensic Analysis — Case #OV-2024-0847',
  description: 'System anomalies detected across 6 services with 96% AI confidence. 3 critical risks identified — payment error rate spike, Redis memory pressure, billing dependency timeout.',
  exposure: '$288,000',
  confidence: '96%',
  affectedServices: '3 Critical',
  totalSystems: '8',
  riskLevel: 'CRITICAL',
  services: [
    { name: 'Payment Service', risk: 'Critical' },
    { name: 'Redis Cache', risk: 'Warning' },
    { name: 'Billing Service', risk: 'Elevated' },
  ],
}

const pageStages = {
  '/dashboard': { stage: 'Risk Detection', eta: '2 min', mission: 'Contain Payment Service Failure' },
  '/intelligence': { stage: 'Root Cause Analysis', eta: '8 min', mission: 'Isolate Failure Origin' },
  '/time-machine': { stage: 'Historical Pattern Match', eta: '4 min', mission: 'Confirm Recurrence Pattern' },
  '/knowledge-graph': { stage: 'Dependency Impact Analysis', eta: '6 min', mission: 'Map Blast Radius' },
  '/cto-report': { stage: 'Business Impact Assessment', eta: '3 min', mission: 'Quantify Executive Risk' },
  '/ai-planner': { stage: 'AI Strategy Planning', eta: '10 min', mission: 'Generate Remediation Strategy' },
  '/execution-planner': { stage: 'Execution Planning', eta: '12 min', mission: 'Deploy Remediation Plan' },
  '/analytics': { stage: 'Outcome Measurement', eta: '—', mission: 'Validate Business Impact' },
  '/impact-analysis': { stage: 'Boardroom Review', eta: '5 min', mission: 'Assess Cross-Service Impact' },
  '/deployment-simulator': { stage: 'Mission Control', eta: '15 min', mission: 'Orchestrate Safe Deployment' },
  '/decision-simulator': { stage: 'Decision Simulator', eta: '5 min', mission: 'Simulate Failure Scenarios' },
}

const kpiItems = [
  {
    label: 'Revenue Protected',
    value: '$2.4M',
    change: '+18%',
    color: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/25',
    icon: 'M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75M2.25 6h3.75',
    textColor: 'text-emerald-300',
    changeColor: 'text-emerald-400',
  },
  {
    label: 'Risk Avoided',
    value: '$890K',
    change: '+24%',
    color: 'from-cyan-500/20 to-cyan-500/5 border-cyan-500/25',
    icon: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z',
    textColor: 'text-cyan-300',
    changeColor: 'text-cyan-400',
  },
  {
    label: 'Incidents Prevented',
    value: '128',
    change: '+12',
    color: 'from-violet-500/20 to-violet-500/5 border-violet-500/25',
    icon: 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z',
    textColor: 'text-violet-300',
    changeColor: 'text-violet-400',
  },
  {
    label: 'Deployment Confidence',
    value: '94.2%',
    change: '+3.4%',
    color: 'from-amber-500/20 to-amber-500/5 border-amber-500/25',
    icon: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z',
    textColor: 'text-amber-300',
    changeColor: 'text-amber-400',
  },
]

export default function ExecutiveCommandHeader() {
  const { pathname } = useLocation()
  const stage = pageStages[pathname] || pageStages['/dashboard']

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl border border-white/[0.10] bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950 shadow-2xl shadow-black/40"
    >
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
      <div className="absolute -top-32 -right-32 h-64 w-64 rounded-full bg-cyan-500/[0.06] blur-3xl" />
      <div className="absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-violet-500/[0.04] blur-3xl" />

      <div className="relative z-10 p-3 sm:p-4 lg:p-6 space-y-4">

        {/* Status bar */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="text-[10px] font-mono font-bold text-emerald-400/80 tracking-wider uppercase">Live</span>
          <span className="h-4 w-px bg-white/[0.06]" />
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-500 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500" />
          </span>
          <span className="text-[10px] font-mono font-bold text-cyan-400/80 tracking-wider uppercase">AI Active</span>
          <span className="h-4 w-px bg-white/[0.06]" />
          <div className="flex items-center gap-1.5 rounded-md border border-white/[0.04] bg-white/[0.02] px-2 py-1">
            <span className="text-[9px] font-mono text-slate-500">Mission</span>
            <span className="text-[9px] font-mono text-cyan-400 font-semibold">{stage.mission}</span>
          </div>
          <span className="h-4 w-px bg-white/[0.06]" />
          <div className="flex items-center gap-1 rounded-md border border-amber-500/15 bg-amber-500/[0.04] px-2 py-1">
            <svg className="h-2.5 w-2.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-[9px] font-mono text-amber-400 font-semibold">ETA {stage.eta}</span>
          </div>
        </div>

        {/* Executive KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {kpiItems.map((kpi, i) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4, ease: 'easeOut' }}
              className={`relative overflow-hidden rounded-xl border bg-gradient-to-br ${kpi.color} p-3 sm:p-4 group hover:scale-[1.02] transition-all duration-300`}
            >
              <div className="absolute -top-6 -right-6 h-12 w-12 rounded-full opacity-[0.04] pointer-events-none"
                style={{ background: `radial-gradient(circle, ${kpi.textColor === 'text-emerald-300' ? '#34d399' : kpi.textColor === 'text-cyan-300' ? '#22d3ee' : kpi.textColor === 'text-violet-300' ? '#8b5cf6' : '#f59e0b'}, transparent)` }} />
              <div className="flex items-center gap-2 mb-2">
                <svg className="h-4 w-4" style={{ color: kpi.textColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={kpi.icon} />
                </svg>
                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider" style={{ color: `${kpi.textColor}CC` }}>{kpi.label}</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className={`of-present-kpi text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight ${kpi.textColor}`}>{kpi.value}</span>
                <span className={`text-xs sm:text-sm font-bold ${kpi.changeColor}`}>{kpi.change}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Investigation title + progress */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
          <div className="lg:col-span-3">
            <div className="flex items-center gap-1.5 mb-1">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg border border-red-500/40 bg-red-500/15">
                <svg className="h-3.5 w-3.5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <span className="text-[10px] font-mono font-bold text-red-400 tracking-wider uppercase">Active Executive Investigation</span>
              <span className="text-[9px] font-mono text-slate-600 ml-auto">{stage.stage}</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight mb-1 leading-tight">
              {investigation.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-3xl">
              {investigation.subtitle} — {investigation.description}
            </p>
          </div>

          <div className="lg:col-span-2 grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.04] p-2.5 sm:p-3 flex flex-col justify-center">
              <span className="text-[8px] font-mono font-bold text-amber-400/80 uppercase tracking-wider">Potential Exposure</span>
              <span className="text-xl sm:text-2xl font-extrabold font-mono text-amber-400 of-present-kpi">${investigation.exposure}</span>
              <span className="text-[8px] text-amber-500/60">Monthly revenue at risk</span>
            </div>
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04] p-2.5 sm:p-3 flex flex-col justify-center">
              <span className="text-[8px] font-mono font-bold text-emerald-400/80 uppercase tracking-wider">AI Confidence</span>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-extrabold font-mono text-emerald-400 of-present-kpi">{investigation.confidence}</span>
                <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden max-w-[80px]">
                  <motion.div initial={{ width: 0 }} animate={{ width: '96%' }} transition={{ duration: 1, delay: 0.3 }} className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-green-400" />
                </div>
              </div>
              <span className="text-[8px] text-emerald-500/60">Pattern correlation confidence</span>
            </div>
            <div className="rounded-xl border border-red-500/20 bg-red-500/[0.04] p-2.5 sm:p-3 flex flex-col justify-center">
              <span className="text-[8px] font-mono font-bold text-red-400/80 uppercase tracking-wider">Affected Services</span>
              <span className="text-xl sm:text-2xl font-extrabold font-mono text-red-400 of-present-kpi">{investigation.affectedServices}</span>
              <span className="text-[8px] text-red-500/60">Payment, Redis, Billing</span>
            </div>
            <div className="rounded-xl border border-slate-700/40 bg-slate-800/30 p-2.5 sm:p-3 flex flex-col justify-center">
              <span className="text-[8px] font-mono font-bold text-slate-500 uppercase tracking-wider">Total Systems</span>
              <span className="text-xl sm:text-2xl font-extrabold font-mono text-slate-300 of-present-kpi">{investigation.totalSystems}</span>
              <span className="text-[8px] text-slate-600">Monitored infrastructure</span>
            </div>
          </div>
        </div>

        {/* Investigation Progress */}
        <div>
          <InvestigationProgress currentPage={pathname} />
        </div>

        {/* CTA + Services */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5">
            {investigation.services.map((s) => (
              <div key={s.name} className={`flex items-center gap-1.5 rounded-md border px-2 py-1 text-[8px] font-mono font-semibold ${
                s.risk === 'Critical' ? 'border-red-500/20 bg-red-500/[0.05] text-red-400' :
                s.risk === 'Warning' ? 'border-amber-500/20 bg-amber-500/[0.04] text-amber-400' :
                'border-yellow-500/15 bg-yellow-500/[0.03] text-yellow-400'
              }`}>
                <span className={`h-1.5 w-1.5 rounded-full ${
                  s.risk === 'Critical' ? 'bg-red-500 animate-pulse' :
                  s.risk === 'Warning' ? 'bg-amber-500' : 'bg-yellow-500'
                }`} />
                {s.name}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/intelligence"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/40 hover:scale-[1.03] active:scale-[0.97] transition-all group"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
              START INVESTIGATION
              <svg className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <Link
              to="/cto-report"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2.5 text-[10px] font-semibold text-slate-400 hover:text-white hover:border-white/[0.15] hover:bg-white/[0.06] transition-all"
            >
              Open Intelligence Center
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
