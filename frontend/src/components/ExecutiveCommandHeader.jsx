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

export default function ExecutiveCommandHeader() {
  const { pathname } = useLocation()
  const stage = pageStages[pathname] || pageStages['/dashboard']

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-xl border border-white/[0.10] bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950 shadow-2xl shadow-black/40"
    >
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
      <div className="absolute -top-32 -right-32 h-64 w-64 rounded-full bg-cyan-500/[0.04] blur-3xl" />
      <div className="absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-red-500/[0.03] blur-3xl" />

      <div className="relative z-10 p-3 sm:p-4 lg:p-5">
        {/* Status bar */}
        <div className="flex items-center gap-2 mb-2.5 flex-wrap">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="text-[8px] font-mono text-emerald-400/80 tracking-wider uppercase font-semibold">Live</span>
          <span className="h-3 w-px bg-white/[0.06]" />
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-500 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500" />
          </span>
          <span className="text-[8px] font-mono text-cyan-400/80 tracking-wider uppercase font-semibold">AI Active</span>
          <span className="h-3 w-px bg-white/[0.06]" />
          <div className="flex items-center gap-1.5 rounded-md border border-white/[0.04] bg-white/[0.02] px-1.5 py-0.5">
            <span className="text-[7px] font-mono text-slate-600">Mission</span>
            <span className="text-[7px] font-mono text-cyan-400">{stage.mission}</span>
          </div>
          <span className="h-3 w-px bg-white/[0.06]" />
          <div className="flex items-center gap-1 rounded-md border border-amber-500/15 bg-amber-500/[0.04] px-1.5 py-0.5">
            <svg className="h-2 w-2 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-[7px] font-mono text-amber-400">ETA {stage.eta}</span>
          </div>
        </div>

        {/* Hero section */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 mb-3">
          {/* Title + Description — spans 3 cols */}
          <div className="lg:col-span-3">
            <div className="flex items-center gap-1.5 mb-1">
              <div className="flex h-5 w-5 items-center justify-center rounded border border-red-500/40 bg-red-500/15">
                <svg className="h-3 w-3 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <span className="text-[9px] font-mono text-red-400 tracking-wider uppercase font-semibold">Active Executive Investigation</span>
              <span className="text-[7px] font-mono text-slate-600 ml-auto">{stage.stage}</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight mb-1">
              {investigation.title}
            </h1>
            <p className="text-[10px] sm:text-[11px] text-slate-400 leading-relaxed max-w-3xl">
              {investigation.subtitle} — {investigation.description}
            </p>
          </div>

          {/* Metric cards — spans 2 cols */}
          <div className="lg:col-span-2 grid grid-cols-2 gap-1.5">
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/[0.04] p-2 flex flex-col justify-center">
              <span className="text-[7px] font-mono text-amber-400/80 uppercase tracking-wider">Potential Exposure</span>
              <span className="text-lg sm:text-xl font-bold font-mono text-amber-400">${investigation.exposure}</span>
              <span className="text-[7px] text-amber-500/60">Monthly revenue at risk</span>
            </div>
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/[0.04] p-2 flex flex-col justify-center">
              <span className="text-[7px] font-mono text-emerald-400/80 uppercase tracking-wider">AI Confidence</span>
              <div className="flex items-center gap-1.5">
                <span className="text-lg sm:text-xl font-bold font-mono text-emerald-400">{investigation.confidence}</span>
                <div className="flex-1 h-1.5 rounded-full bg-slate-800 overflow-hidden max-w-[60px]">
                  <motion.div initial={{ width: 0 }} animate={{ width: '96%' }} transition={{ duration: 1 }} className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-green-400" />
                </div>
              </div>
              <span className="text-[7px] text-emerald-500/60">Pattern correlation confidence</span>
            </div>
            <div className="rounded-lg border border-red-500/20 bg-red-500/[0.04] p-2 flex flex-col justify-center">
              <span className="text-[7px] font-mono text-red-400/80 uppercase tracking-wider">Affected Services</span>
              <span className="text-lg sm:text-xl font-bold font-mono text-red-400">{investigation.affectedServices}</span>
              <span className="text-[7px] text-red-500/60">Payment, Redis, Billing</span>
            </div>
            <div className="rounded-lg border border-slate-700/40 bg-slate-800/30 p-2 flex flex-col justify-center">
              <span className="text-[7px] font-mono text-slate-500 uppercase tracking-wider">Total Systems</span>
              <span className="text-lg sm:text-xl font-bold font-mono text-slate-300">{investigation.totalSystems}</span>
              <span className="text-[7px] text-slate-600">Monitored infrastructure</span>
            </div>
          </div>
        </div>

        {/* Investigation Progress */}
        <div className="mb-2.5">
          <InvestigationProgress currentPage={pathname} />
        </div>

        {/* CTA + Services row */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5">
            {investigation.services.map((s) => (
              <div key={s.name} className={`flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[7px] font-mono ${
                s.risk === 'Critical' ? 'border-red-500/20 bg-red-500/[0.05] text-red-400' :
                s.risk === 'Warning' ? 'border-amber-500/20 bg-amber-500/[0.04] text-amber-400' :
                'border-yellow-500/15 bg-yellow-500/[0.03] text-yellow-400'
              }`}>
                <span className={`h-1 w-1 rounded-full ${
                  s.risk === 'Critical' ? 'bg-red-500' :
                  s.risk === 'Warning' ? 'bg-amber-500' : 'bg-yellow-500'
                }`} />
                {s.name}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-1.5">
            <Link
              to="/intelligence"
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-[11px] font-bold text-white shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/40 hover:scale-[1.03] active:scale-[0.97] transition-all group"
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
              className="hidden sm:inline-flex items-center gap-1 rounded-lg border border-white/[0.08] bg-white/[0.03] px-2.5 py-2 text-[9px] text-slate-400 hover:text-white hover:border-white/[0.15] hover:bg-white/[0.06] transition-all"
            >
              Open Intelligence Center
              <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
