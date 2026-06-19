import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Layout from '../components/Layout'
import StatusBadge from '../components/StatusBadge'

const presets = [
  'Add payment retry support',
  'Migrate database connection pool',
  'Implement SSO authentication',
  'Deploy microservices monitoring',
  'Refactor API gateway rate limiter',
  'Build incident response dashboard',
]

const mockPlan = {
  impact: {
    riskScore: 72,
    blastRadius: '3 services',
    complexity: 'High',
    priority: 'P1 — High Priority',
    summary: 'Adding payment retry support impacts the core payment processing pipeline. Changes to retry logic affect transaction durability, idempotency, and downstream billing reconciliation. Three services require coordinated updates with zero-downtime deployment strategy.',
  },
  services: [
    { name: 'Payment Service', impact: 'critical', changes: 'Retry logic, circuit breaker, timeout config', files: 12, risk: 87 },
    { name: 'Billing Service', impact: 'high', changes: 'Invoice reconciliation, retry event handling', files: 8, risk: 65 },
    { name: 'Notification Service', impact: 'medium', changes: 'Retry failure alerts, webhook delivery', files: 5, risk: 45 },
    { name: 'API Gateway', impact: 'high', changes: 'Rate limit config, timeout settings', files: 9, risk: 72 },
  ],
  teams: [
    { name: 'Payments', role: 'Primary Owner', members: 8, load: 85, lead: '@alice' },
    { name: 'Billing', role: 'Supporting', members: 5, load: 60, lead: '@bob' },
    { name: 'Platform', role: 'Consulting', members: 6, load: 30, lead: '@carol' },
  ],
  skills: [
    { name: 'Go — Concurrency Patterns', level: 'Expert', required: true, availability: 'Available' },
    { name: 'PostgreSQL — Transaction Mgmt', level: 'Advanced', required: true, availability: 'Available' },
    { name: 'Kubernetes — Deployment Strategy', level: 'Intermediate', required: false, availability: 'Consulting' },
    { name: 'Monitoring — Datadog APM', level: 'Intermediate', required: false, availability: 'Available' },
  ],
  effort: {
    totalStoryPoints: 34,
    engineeringHours: 136,
    engineers: 4,
    sprintDuration: '2 weeks',
    confidence: 'High',
    breakdown: [
      { phase: 'Design & Architecture', points: 8, hours: 32, owner: 'Tech Lead' },
      { phase: 'Core Retry Logic Implementation', points: 13, hours: 52, owner: 'Payments Team' },
      { phase: 'Billing Integration', points: 5, hours: 20, owner: 'Billing Team' },
      { phase: 'Testing & QA', points: 5, hours: 20, owner: 'QA Team' },
      { phase: 'Deployment & Monitoring', points: 3, hours: 12, owner: 'DevOps Team' },
    ],
  },
  timeline: [
    { phase: 'Design Review', start: 'Sprint 1 Week 1', end: 'Sprint 1 Week 1', duration: '3 days', status: 'completed', progress: 100 },
    { phase: 'Core Implementation', start: 'Sprint 1 Week 1', end: 'Sprint 2 Week 1', duration: '8 days', status: 'in_progress', progress: 45 },
    { phase: 'Integration & Testing', start: 'Sprint 2 Week 1', end: 'Sprint 2 Week 2', duration: '5 days', status: 'pending', progress: 0 },
    { phase: 'Staging Deploy', start: 'Sprint 2 Week 2', end: 'Sprint 2 Week 2', duration: '2 days', status: 'pending', progress: 0 },
    { phase: 'Production Release', start: 'Sprint 3 Week 1', end: 'Sprint 3 Week 1', duration: '1 day', status: 'pending', progress: 0 },
  ],
  risks: [
    { risk: 'Circuit breaker misconfiguration may cause silent failures', severity: 'critical', mitigation: 'Add comprehensive integration tests with fault injection', owner: 'Payments Team', probability: 'Medium' },
    { risk: 'Retry queue overflow under peak load', severity: 'high', mitigation: 'Implement bounded retry queues with backpressure monitoring', owner: 'Platform Team', probability: 'High' },
    { risk: 'Billing reconciliation delay during rollout', severity: 'medium', mitigation: 'Implement feature flag with gradual rollout (10% → 50% → 100%)', owner: 'Billing Team', probability: 'Low' },
  ],
  workItems: [
    { title: 'Implement circuit breaker pattern', type: 'feat', priority: 'P0', points: 8, assignee: '@alice', sprint: 1, status: 'in_progress' },
    { title: 'Add retry queue with bounded limits', type: 'feat', priority: 'P0', points: 5, assignee: '@alice', sprint: 1, status: 'in_progress' },
    { title: 'Update billing invoice reconciliation', type: 'feat', priority: 'P1', points: 5, assignee: '@bob', sprint: 1, status: 'todo' },
    { title: 'Add retry failure monitoring alerts', type: 'feat', priority: 'P1', points: 3, assignee: '@carol', sprint: 2, status: 'todo' },
    { title: 'Write integration tests for retry scenarios', type: 'test', priority: 'P0', points: 5, assignee: '@dave', sprint: 2, status: 'todo' },
    { title: 'Update API gateway timeout configuration', type: 'chore', priority: 'P2', points: 2, assignee: '@eve', sprint: 2, status: 'todo' },
    { title: 'Create deployment runbook for retry changes', type: 'docs', priority: 'P2', points: 3, assignee: '@alice', sprint: 3, status: 'todo' },
    { title: 'Run load tests for retry scenarios', type: 'test', priority: 'P1', points: 3, assignee: '@dave', sprint: 3, status: 'todo' },
  ],
  sprints: [
    { sprint: 1, name: 'Foundation & Core Logic', focus: 'Circuit breaker, retry queue, billing integration', points: 18, status: 'active', start: 'Sprint 1', end: 'Sprint 2' },
    { sprint: 2, name: 'Integration & Testing', focus: 'Monitoring, integration tests, gateway config', points: 13, status: 'planned', start: 'Sprint 2', end: 'Sprint 3' },
    { sprint: 3, name: 'Hardening & Release', focus: 'Runbook, load tests, production rollout', points: 6, status: 'planned', start: 'Sprint 3', end: 'Sprint 3' },
  ],
  readiness: {
    score: 74,
    level: 'On Track',
    checks: [
      { label: 'Design Complete', pass: true },
      { label: 'Dependencies Resolved', pass: true },
      { label: 'Test Plan Ready', pass: false },
      { label: 'Security Review', pass: true },
      { label: 'Performance Benchmarks', pass: false },
      { label: 'Deployment Runbook', pass: false },
    ],
  },
  summary: {
    totalItems: 8,
    completedItems: 2,
    inProgressItems: 2,
    remainingItems: 4,
    estimatedDays: 14,
    percentComplete: 25,
  },
}

const tabs = [
  { id: 'overview', label: 'Plan Overview', icon: 'M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z' },
  { id: 'board', label: 'Sprint Board', icon: 'M9 4.5v7.5m0 0v7.5m0-7.5h7.5m-7.5 0H6' },
  { id: 'timeline', label: 'Timeline', icon: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z' },
  { id: 'resources', label: 'Resources', icon: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z' },
]

function ReadinessGauge({ value }) {
  const [pct, setPct] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setPct(value), 400)
    return () => clearTimeout(t)
  }, [value])
  const color = pct >= 80 ? '#22c55e' : pct >= 60 ? '#06b6d4' : pct >= 40 ? '#f59e0b' : '#ef4444'
  const circumference = Math.PI * 60
  const offset = circumference - (pct / 100) * circumference
  return (
    <div className="flex flex-col items-center">
      <svg className="w-28 h-28 sm:w-36 sm:h-36 -rotate-90" viewBox="0 0 136 136">
        <circle cx="68" cy="68" r="60" fill="none" stroke="#1e293b" strokeWidth="10" />
        <circle cx="68" cy="68" r="60" fill="none" stroke={color} strokeWidth="10" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} className="transition-all duration-1000 ease-out" />
      </svg>
      <div className="relative -mt-[76px] flex flex-col items-center">
        <span className="text-3xl sm:text-4xl font-bold text-white">{pct}<span className="text-base sm:text-lg text-slate-500">%</span></span>
        <span className="text-xs font-medium mt-1" style={{ color }}>{pct >= 80 ? 'Ready' : pct >= 60 ? 'On Track' : pct >= 40 ? 'Needs Work' : 'At Risk'}</span>
      </div>
    </div>
  )
}

function EffortBar({ label, points, hours, owner, totalPoints }) {
  const pct = totalPoints > 0 ? (points / totalPoints) * 100 : 0
  return (
    <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 hover:border-violet-500/20 transition-colors">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-medium text-slate-300 truncate mr-2">{label}</span>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] font-semibold text-violet-300">{points} pts</span>
          <span className="text-[9px] text-slate-600">{hours}h</span>
        </div>
      </div>
      <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-brand"
        />
      </div>
      <div className="mt-1 text-[9px] text-slate-600">{owner}</div>
    </div>
  )
}

function TeamCapacityBar({ load }) {
  const color = load >= 80 ? 'bg-red-500' : load >= 60 ? 'bg-yellow-500' : 'bg-green-500'
  return (
    <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden flex-1 mx-2">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${load}%` }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className={`h-full rounded-full ${color}`}
      />
    </div>
  )
}

function GanttBar({ phase, start, duration, status, progress, index }) {
  const statusColors = {
    completed: 'bg-green-500/20 border-green-500/40',
    in_progress: 'bg-violet-500/20 border-violet-500/40',
    pending: 'bg-slate-800/60 border-slate-700/40',
  }
  const fillColors = {
    completed: 'bg-green-500',
    in_progress: 'bg-violet-500',
    pending: 'bg-slate-700',
  }
  const sc = statusColors[status] || statusColors.pending
  const fc = fillColors[status] || fillColors.pending
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08 }}
      className="grid grid-cols-[120px_1fr] sm:grid-cols-[140px_1fr_80px] items-center gap-2 sm:gap-4 py-2"
    >
      <div className="min-w-0">
        <div className="text-xs font-medium text-slate-300 truncate">{phase}</div>
        <div className="text-[9px] text-slate-600 mt-0.5">{start}</div>
      </div>
      <div className={`rounded-full border h-6 sm:h-7 ${sc} relative overflow-hidden`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, delay: 0.3 + index * 0.08 }}
          className={`h-full ${fc} rounded-full`}
        />
        <div className="absolute inset-0 flex items-center px-2.5">
          <span className="text-[9px] font-medium text-slate-300">{duration}</span>
        </div>
      </div>
      <div className="hidden sm:flex justify-end">
        <StatusBadge status={status} label={status.replace('_', ' ')} />
      </div>
    </motion.div>
  )
}

function SprintCard({ workItem }) {
  const typeColors = {
    feat: 'border-l-green-500/60 bg-green-500/[0.03]',
    test: 'border-l-brand/60 bg-brand/[0.03]',
    chore: 'border-l-yellow-500/60 bg-yellow-500/[0.03]',
    docs: 'border-l-slate-500/60 bg-slate-500/[0.03]',
  }
  const tc = typeColors[workItem.type] || typeColors.chore
  const priorityColor = workItem.priority === 'P0' ? 'text-red-400' : workItem.priority === 'P1' ? 'text-yellow-400' : 'text-slate-500'
  return (
    <div className={`rounded-lg border border-white/[0.06] border-l-2 ${tc} p-3 hover:border-white/[0.12] transition-all group`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          <span className={`rounded px-1 py-0.5 text-[8px] font-bold uppercase ${priorityColor} bg-white/[0.04]`}>{workItem.priority}</span>
          <span className="text-xs text-slate-300 truncate">{workItem.title}</span>
        </div>
        <span className="text-[9px] text-slate-600 shrink-0">{workItem.points} pts</span>
      </div>
      <div className="flex items-center gap-2 mt-2">
        <span className={`rounded px-1.5 py-0.5 text-[8px] font-bold ${
          workItem.type === 'feat' ? 'bg-green-500/10 text-green-400' :
          workItem.type === 'test' ? 'bg-brand/10 text-brand-light' :
          workItem.type === 'chore' ? 'bg-yellow-500/10 text-yellow-400' :
          'bg-slate-500/10 text-slate-400'
        }`}>{workItem.type}</span>
        <span className="text-[9px] text-slate-600">{workItem.assignee}</span>
      </div>
    </div>
  )
}

function BoardColumn({ title, items, accentColor, emptyText }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-slate-900/40 p-4 min-h-[300px]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${accentColor}`} />
          <h3 className="text-xs font-semibold text-white uppercase tracking-wider">{title}</h3>
        </div>
        <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] font-medium text-slate-500">{items.length}</span>
      </div>
      <div className="space-y-2">
        <AnimatePresence>
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <SprintCard workItem={item} />
            </motion.div>
          ))}
        </AnimatePresence>
        {items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <svg className="h-6 w-6 text-slate-700 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            <p className="text-[10px] text-slate-600">{emptyText || 'No items'}</p>
          </div>
        )}
      </div>
    </div>
  )
}

const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } }
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }

export default function AIEngineeringPlanner() {
  const [input, setInput] = useState('')
  const [planning, setPlanning] = useState(false)
  const [plan, setPlan] = useState(null)
  const [showPresets, setShowPresets] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState(-1)
  const [activeTab, setActiveTab] = useState('overview')
  const inputRef = useRef(null)

  const filtered = input.trim() ? presets.filter(p => p.toLowerCase().includes(input.toLowerCase())) : presets

  const generate = (text) => {
    if (!text.trim()) return
    setPlanning(true)
    setPlan(null)
    setActiveTab('overview')
    setTimeout(() => {
      setPlan(mockPlan)
      setPlanning(false)
    }, 2000)
  }

  const handleKey = (e) => {
    if (!showPresets || !filtered.length) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedPreset(p => Math.min(p + 1, filtered.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedPreset(p => Math.max(p - 1, 0)) }
    if (e.key === 'Enter' && selectedPreset >= 0) { e.preventDefault(); setInput(filtered[selectedPreset]); setShowPresets(false); generate(filtered[selectedPreset]) }
    if (e.key === 'Escape') setShowPresets(false)
  }

  useEffect(() => { setSelectedPreset(-1) }, [input])

  if (!plan && !planning) {
    return (
      <Layout>
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
          <motion.div variants={item}>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-brand shadow-lg shadow-violet-500/20">
                <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl text-white">AI Engineering Planner</h1>
                <p className="text-sm text-slate-500">From feature request to full engineering plan — powered by AI</p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={item} className="relative">
            <div className="rounded-xl border border-white/[0.08] bg-slate-900/80 backdrop-blur-2xl p-4 sm:p-5">
              <form onSubmit={e => { e.preventDefault(); generate(input) }}>
                <div className="relative">
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
                  </svg>
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={e => { setInput(e.target.value); setShowPresets(true) }}
                    onFocus={() => setShowPresets(true)}
                    onKeyDown={handleKey}
                    placeholder='Describe a feature request, e.g. "Add payment retry support"'
                    className="w-full rounded-xl border border-white/[0.06] bg-slate-800/60 py-3.5 pl-11 pr-40 text-sm text-white placeholder-slate-600 outline-none focus:border-violet-500/40 focus:bg-slate-800/80 transition-all"
                    disabled={planning}
                  />
                  <div className="absolute inset-y-1.5 right-1.5 flex items-center gap-1">
                    <button
                      type="submit"
                      disabled={planning || !input.trim()}
                      className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-500 to-brand px-5 py-2 text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-violet-500/20"
                    >
                      {planning ? (
                        <><svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Generating</>
                      ) : (
                        <><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" /></svg>Generate Plan</>
                      )}
                    </button>
                  </div>
                </div>
              </form>
              <AnimatePresence>
                {showPresets && filtered.length > 0 && !planning && (
                  <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="mt-2 rounded-xl border border-white/[0.06] bg-slate-800/80 overflow-hidden">
                    {filtered.map((s, i) => (
                      <button key={s} type="button" className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${i === selectedPreset ? 'bg-violet-500/10 text-violet-300' : 'text-slate-500 hover:bg-white/[0.04] hover:text-white'}`} onClick={() => { setInput(s); setShowPresets(false); generate(s) }}>
                        <svg className="h-3.5 w-3.5 shrink-0 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>
                        {s}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          <motion.div variants={item} className="text-center py-16">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-white/[0.06] bg-gradient-to-br from-violet-500/5 to-brand/5">
              <svg className="h-10 w-10 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">Transform feature requests into engineering plans</h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto">Enter a feature request above to generate a complete engineering plan with impact analysis, effort estimates, work items, and release readiness scoring.</p>
          </motion.div>
        </motion.div>
      </Layout>
    )
  }

  return (
    <Layout>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        {/* Loading */}
        {planning && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-5 animate-pulse">
                  <div className="h-3 w-20 skeleton rounded mb-3" /><div className="h-8 w-16 skeleton rounded mb-2" /><div className="h-2 skeleton rounded" />
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-5 animate-pulse"><div className="h-3 w-48 skeleton rounded mb-4" />{Array.from({ length: 3 }).map((_, j) => (<div key={j} className="h-14 skeleton rounded mb-2" />))}</div>
          </motion.div>
        )}

        {/* Results */}
        <AnimatePresence>
          {plan && !planning && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              {/* Plan Header */}
              <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-gradient-to-br from-slate-900 to-slate-900/50 p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-brand/20 border border-violet-500/20">
                      <svg className="h-5 w-5 text-violet-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" /></svg>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500">Engineering Plan for</span>
                        <span className="text-[9px] text-slate-700">•</span>
                        <span className="text-[9px] text-slate-600">Generated {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <h2 className="text-lg sm:text-xl font-bold text-white truncate">"{input}"</h2>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={plan.readiness.score >= 70 ? 'success' : plan.readiness.score >= 40 ? 'warning' : 'error'} label={`${plan.readiness.score}% Readiness`} />
                    <StatusBadge status={plan.impact.complexity === 'High' ? 'critical' : plan.impact.complexity === 'Medium' ? 'warning' : 'info'} label={plan.impact.complexity} />
                    <StatusBadge status={plan.impact.complexity === 'High' ? 'critical' : 'info'} label={`${plan.effort.totalStoryPoints} pts`} />
                    <span className="hidden sm:flex text-[9px] text-slate-700 border border-white/[0.06] rounded px-2 py-1">{plan.effort.engineeringHours}h est.</span>
                  </div>
                </div>
              </motion.div>

              {/* Executive Summary Strip */}
              <motion.div variants={item} className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                {[
                  { label: 'Total Work Items', value: plan.summary.totalItems, icon: 'M9 4.5v7.5m0 0v7.5m0-7.5h7.5m-7.5 0H6', color: 'text-violet-300', bg: 'bg-violet-500/10' },
                  { label: 'Completed', value: plan.summary.completedItems, icon: 'M4.5 12.75l6 6 9-13.5', color: 'text-green-400', bg: 'bg-green-500/10' },
                  { label: 'In Progress', value: plan.summary.inProgressItems, icon: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z', color: 'text-amber-400', bg: 'bg-amber-500/10' },
                  { label: 'Est. Duration', value: `${plan.summary.estimatedDays} days`, icon: 'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5', color: 'text-blue-400', bg: 'bg-blue-500/10' },
                ].map((s, i) => (
                  <div key={s.label} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-3 sm:p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${s.bg}`}>
                        <svg className={`h-3.5 w-3.5 ${s.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d={s.icon} />
                        </svg>
                      </div>
                      <span className="text-[10px] text-slate-500">{s.label}</span>
                    </div>
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                      className="text-2xl font-bold text-white"
                    >
                      {typeof s.value === 'number' ? s.value : s.value}
                    </motion.div>
                    {s.label === 'Completed' && (
                      <div className="mt-1.5 h-1 rounded-full bg-slate-800 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${plan.summary.percentComplete}%` }}
                          transition={{ duration: 0.8, delay: 0.5 }}
                          className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-400"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </motion.div>

              {/* Tabs */}
              <motion.div variants={item} className="flex gap-1 rounded-xl border border-white/[0.06] bg-slate-900/60 p-1 overflow-x-auto">
                {tabs.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    className={`flex items-center gap-1.5 rounded-lg px-3 sm:px-4 py-2 text-xs font-medium transition-all whitespace-nowrap ${
                      activeTab === t.id
                        ? 'bg-gradient-to-r from-violet-500/15 to-brand/15 text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={t.icon} />
                    </svg>
                    {t.label}
                  </button>
                ))}
              </motion.div>

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                  <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.15 }} className="space-y-6">
                    {/* Impact + Readiness */}
                    <div className="grid gap-6 lg:grid-cols-[1fr_auto]">
                      <div className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-5">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="flex h-6 w-6 items-center justify-center rounded bg-violet-500/20 text-[11px] font-bold text-violet-300">1</div>
                          <h2 className="text-sm font-semibold text-white">Orbit Impact Analysis</h2>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                          <div className="rounded-lg border border-red-500/10 bg-red-500/[0.03] p-3">
                            <span className="text-[10px] text-slate-600">Risk Score</span>
                            <div className="flex items-baseline gap-1 mt-0.5">
                              <span className="text-xl font-bold text-red-400">{plan.impact.riskScore}</span>
                              <span className="text-[10px] text-slate-600">%</span>
                            </div>
                            <div className="mt-1.5 h-1 rounded-full bg-slate-800 overflow-hidden">
                              <div className="h-full rounded-full bg-gradient-to-r from-red-500 to-orange-500" style={{ width: `${plan.impact.riskScore}%` }} />
                            </div>
                          </div>
                          <div className="rounded-lg border border-orange-500/10 bg-orange-500/[0.03] p-3">
                            <span className="text-[10px] text-slate-600">Blast Radius</span>
                            <div className="text-xl font-bold text-orange-400 mt-0.5">{plan.impact.blastRadius}</div>
                          </div>
                          <div className="rounded-lg border border-yellow-500/10 bg-yellow-500/[0.03] p-3">
                            <span className="text-[10px] text-slate-600">Complexity</span>
                            <div className="text-xl font-bold text-yellow-400 mt-0.5">{plan.impact.complexity}</div>
                          </div>
                          <div className="rounded-lg border border-brand/10 bg-brand/[0.03] p-3">
                            <span className="text-[10px] text-slate-600">Priority</span>
                            <div className="text-xl font-bold text-brand-light mt-0.5">{plan.impact.priority}</div>
                          </div>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">{plan.impact.summary}</p>
                      </div>
                      <div className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-5 lg:w-[200px]">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex h-6 w-6 items-center justify-center rounded bg-violet-500/20 text-[11px] font-bold text-violet-300">10</div>
                          <h2 className="text-sm font-semibold text-white">Release Readiness</h2>
                        </div>
                        <ReadinessGauge value={plan.readiness.score} />
                      </div>
                    </div>

                    {/* Effort + Services */}
                    <div className="grid gap-6 lg:grid-cols-2">
                      <div className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-5">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="flex h-6 w-6 items-center justify-center rounded bg-violet-500/20 text-[11px] font-bold text-violet-300">5</div>
                          <h2 className="text-sm font-semibold text-white">Engineering Effort Estimate</h2>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                          <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 text-center">
                            <div className="text-2xl font-bold text-white">{plan.effort.totalStoryPoints}</div>
                            <div className="text-[9px] text-slate-600 mt-0.5">Story Points</div>
                          </div>
                          <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 text-center">
                            <div className="text-2xl font-bold text-white">{plan.effort.engineeringHours}</div>
                            <div className="text-[9px] text-slate-600 mt-0.5">Hours</div>
                          </div>
                          <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 text-center">
                            <div className="text-2xl font-bold text-white">{plan.effort.engineers}</div>
                            <div className="text-[9px] text-slate-600 mt-0.5">Engineers</div>
                          </div>
                          <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 text-center">
                            <div className="text-2xl font-bold text-violet-300">{plan.effort.sprintDuration}</div>
                            <div className="text-[9px] text-slate-600 mt-0.5">Per Sprint</div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {plan.effort.breakdown.map((b, i) => (
                            <EffortBar key={i} {...b} totalPoints={plan.effort.totalStoryPoints} />
                          ))}
                        </div>
                      </div>

                      <div className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-5">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="flex h-6 w-6 items-center justify-center rounded bg-violet-500/20 text-[11px] font-bold text-violet-300">2</div>
                          <h2 className="text-sm font-semibold text-white">Affected Services</h2>
                        </div>
                        <div className="space-y-2">
                          {plan.services.map((s, i) => (
                            <div key={i} className="group flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 hover:border-violet-500/20 transition-colors">
                              <div className="flex items-center gap-3 min-w-0">
                                <div className={`h-2 w-2 rounded-full shrink-0 ${
                                  s.impact === 'critical' ? 'bg-red-500' : s.impact === 'high' ? 'bg-orange-500' : s.impact === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                                }`} />
                                <div className="min-w-0">
                                  <div className="text-xs font-medium text-white">{s.name}</div>
                                  <div className="text-[10px] text-slate-600 mt-0.5 truncate">{s.changes}</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 shrink-0 ml-2">
                                <span className="text-[9px] text-slate-600">{s.files} files</span>
                                <StatusBadge status={s.impact} label={`${s.risk}%`} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Teams + Skills */}
                    <div className="grid gap-6 lg:grid-cols-2">
                      <div className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-5">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="flex h-6 w-6 items-center justify-center rounded bg-violet-500/20 text-[11px] font-bold text-violet-300">3</div>
                          <h2 className="text-sm font-semibold text-white">Affected Teams</h2>
                        </div>
                        <div className="space-y-2">
                          {plan.teams.map((t, i) => (
                            <div key={i} className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                                  i === 0 ? 'bg-red-500/20 text-red-300' : i === 1 ? 'bg-yellow-500/20 text-yellow-300' : 'bg-green-500/20 text-green-300'
                                }`}>{t.name[0]}</div>
                                <div className="min-w-0">
                                  <div className="text-xs font-medium text-white">{t.name}</div>
                                  <div className="text-[10px] text-slate-600">{t.role} · {t.members} members</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 shrink-0 ml-2">
                                <TeamCapacityBar load={t.load} />
                                <span className={`text-[10px] font-medium min-w-[36px] text-right ${
                                  t.load >= 80 ? 'text-red-400' : t.load >= 60 ? 'text-yellow-400' : 'text-green-400'
                                }`}>{t.load}%</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-5">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="flex h-6 w-6 items-center justify-center rounded bg-violet-500/20 text-[11px] font-bold text-violet-300">4</div>
                          <h2 className="text-sm font-semibold text-white">Required Skills</h2>
                        </div>
                        <div className="space-y-2">
                          {plan.skills.map((s, i) => (
                            <div key={i} className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                              <div className="flex items-center gap-3 min-w-0">
                                <div className={`h-2 w-2 rounded-full shrink-0 ${s.required ? 'bg-violet-500' : 'bg-slate-600'}`} />
                                <div className="min-w-0">
                                  <div className="text-xs text-slate-300 truncate">{s.name}</div>
                                  <div className="text-[10px] text-slate-600">{s.level}</div>
                                </div>
                              </div>
                              <StatusBadge status={s.required ? 'info' : 'pending'} label={s.availability} />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Sprint Overview Cards */}
                    <div className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-5">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex h-6 w-6 items-center justify-center rounded bg-violet-500/20 text-[11px] font-bold text-violet-300">9</div>
                        <h2 className="text-sm font-semibold text-white">Sprint Breakdown</h2>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-3">
                        {plan.sprints.map((s, si) => {
                          const sprintItems = plan.workItems.filter(w => w.sprint === s.sprint)
                          const doneItems = sprintItems.filter(w => w.status === 'done').length
                          const totalItems = sprintItems.length
                          const pct = totalItems > 0 ? Math.round((doneItems / totalItems) * 100) : 0
                          return (
                            <div key={s.sprint} className={`rounded-lg border p-4 ${
                              s.status === 'active' ? 'border-violet-500/30 bg-violet-500/[0.04]' : 'border-white/[0.06] bg-white/[0.02]'
                            }`}>
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                  <span className={`h-2 w-2 rounded-full ${s.status === 'active' ? 'bg-violet-500 animate-pulse-soft' : 'bg-slate-600'}`} />
                                  <span className="text-xs font-bold text-white">Sprint {s.sprint}</span>
                                </div>
                                <StatusBadge status={s.status === 'active' ? 'info' : 'pending'} label={`${s.points} pts`} />
                              </div>
                              <div className="text-sm font-semibold text-violet-300 mb-1">{s.name}</div>
                              <p className="text-[10px] text-slate-500 leading-relaxed mb-3">{s.focus}</p>
                              <div className="flex items-center justify-between text-[9px] text-slate-600 mb-1">
                                <span>{doneItems}/{totalItems} items</span>
                                <span className={pct >= 100 ? 'text-green-400' : pct > 0 ? 'text-violet-400' : 'text-slate-600'}>{pct}%</span>
                              </div>
                              <div className="h-1 rounded-full bg-slate-800 overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${pct}%` }}
                                  transition={{ duration: 0.8, delay: 0.3 + si * 0.1 }}
                                  className={`h-full rounded-full ${pct >= 100 ? 'bg-green-500' : pct > 0 ? 'bg-gradient-to-r from-violet-500 to-brand' : 'bg-slate-700'}`}
                                />
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Risk Mitigation */}
                    <div className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-5">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex h-6 w-6 items-center justify-center rounded bg-violet-500/20 text-[11px] font-bold text-violet-300">7</div>
                        <h2 className="text-sm font-semibold text-white">Risk Mitigation Strategy</h2>
                      </div>
                      <div className="grid gap-3">
                        {plan.risks.map((r, i) => (
                          <div key={i} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                            <div className="flex items-start justify-between mb-1.5 flex-wrap gap-1">
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <StatusBadge status={r.severity} label={r.severity} />
                                <span className="text-xs font-medium text-slate-200">{r.risk}</span>
                              </div>
                              <StatusBadge status={r.probability === 'High' ? 'critical' : r.probability === 'Medium' ? 'warning' : 'info'} label={r.probability} />
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-slate-500 flex-wrap">
                              <span className="text-slate-600">Mitigation:</span>
                              <span>{r.mitigation}</span>
                              <span className="text-slate-700">·</span>
                              <span className="text-slate-600">Owner:</span>
                              <span>{r.owner}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'board' && (
                  <motion.div key="board" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.15 }} className="space-y-6">
                    {plan.sprints.map(sprint => {
                      const items = plan.workItems.filter(w => w.sprint === sprint.sprint)
                      const todo = items.filter(w => w.status === 'todo')
                      const inProgress = items.filter(w => w.status === 'in_progress')
                      const done = items.filter(w => w.status === 'done')
                      const total = items.length
                      const donePct = total > 0 ? Math.round((done.length / total) * 100) : 0
                      return (
                        <div key={sprint.sprint} className="rounded-xl border border-white/[0.06] bg-slate-900/30 p-4 sm:p-5">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                            <div className="flex items-center gap-3">
                              <span className={`h-2.5 w-2.5 rounded-full ${sprint.status === 'active' ? 'bg-violet-500 animate-pulse-soft' : 'bg-slate-600'}`} />
                              <div>
                                <h3 className="text-sm font-bold text-white">Sprint {sprint.sprint}: {sprint.name}</h3>
                                <p className="text-[10px] text-slate-600">{sprint.focus}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1.5 text-[9px] text-slate-600">
                                <span className={`rounded px-1.5 py-0.5 ${todo.length > 0 ? 'bg-slate-500/10 text-slate-400' : 'text-slate-700'}`}>{todo.length} todo</span>
                                <span className={`rounded px-1.5 py-0.5 ${inProgress.length > 0 ? 'bg-violet-500/10 text-violet-400' : 'text-slate-700'}`}>{inProgress.length} active</span>
                                <span className={`rounded px-1.5 py-0.5 ${done.length > 0 ? 'bg-green-500/10 text-green-400' : 'text-slate-700'}`}>{done.length} done</span>
                              </div>
                              <StatusBadge status={sprint.status === 'active' ? 'running' : 'pending'} label={sprint.status} />
                            </div>
                          </div>
                          {total > 0 && (
                            <div className="flex items-center gap-2 mb-4">
                              <div className="flex-1 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${donePct}%` }}
                                  transition={{ duration: 0.8, delay: 0.1 }}
                                  className={`h-full rounded-full ${donePct >= 100 ? 'bg-green-500' : 'bg-gradient-to-r from-violet-500 to-brand'}`}
                                />
                              </div>
                              <span className={`text-[10px] font-medium ${donePct >= 100 ? 'text-green-400' : 'text-violet-400'}`}>{donePct}%</span>
                            </div>
                          )}
                          <div className="grid gap-3 sm:grid-cols-3">
                            <BoardColumn title="To Do" items={todo} accentColor="bg-slate-500" emptyText="All items moved" />
                            <BoardColumn title="In Progress" items={inProgress} accentColor="bg-violet-500" emptyText="Nothing in progress" />
                            <BoardColumn title="Done" items={done} accentColor="bg-green-500" emptyText="No completed items" />
                          </div>
                        </div>
                      )
                    })}
                  </motion.div>
                )}

                {activeTab === 'timeline' && (
                  <motion.div key="timeline" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.15 }} className="space-y-6">
                    <div className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-4 sm:p-5">
                      <div className="flex items-center gap-2 mb-5">
                        <div className="flex h-6 w-6 items-center justify-center rounded bg-violet-500/20 text-[11px] font-bold text-violet-300">6</div>
                        <h2 className="text-sm font-semibold text-white">Release Timeline</h2>
                      </div>
                      {/* Timeline stats */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
                        {[
                          { label: 'Total Phases', value: plan.timeline.length, color: 'text-violet-300' },
                          { label: 'Completed', value: plan.timeline.filter(t => t.status === 'completed').length, color: 'text-green-400' },
                          { label: 'In Progress', value: plan.timeline.filter(t => t.status === 'in_progress').length, color: 'text-amber-400' },
                          { label: 'Pending', value: plan.timeline.filter(t => t.status === 'pending').length, color: 'text-slate-500' },
                        ].map((s, i) => (
                          <div key={s.label} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5 text-center">
                            <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
                            <div className="text-[9px] text-slate-600">{s.label}</div>
                          </div>
                        ))}
                      </div>
                      {/* Sprint markers */}
                      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
                        {plan.sprints.map(s => (
                          <div key={s.sprint} className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-[9px] font-medium whitespace-nowrap ${
                            s.status === 'active' ? 'border-violet-500/30 bg-violet-500/10 text-violet-300' : 'border-white/[0.06] text-slate-500'
                          }`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${s.status === 'active' ? 'bg-violet-500' : 'bg-slate-600'}`} />
                            Sprint {s.sprint}: {s.name} ({s.points} pts)
                          </div>
                        ))}
                      </div>
                      {/* Overall progress bar */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                          <span>Overall Progress</span>
                          <span>{Math.round(plan.timeline.reduce((a, t) => a + t.progress, 0) / plan.timeline.length)}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.round(plan.timeline.reduce((a, t) => a + t.progress, 0) / plan.timeline.length)}%` }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-brand"
                          />
                        </div>
                      </div>
                      <div className="relative">
                        {plan.timeline.map((t, i) => (
                          <GanttBar key={t.phase} {...t} index={i} />
                        ))}
                      </div>
                      {/* Legend */}
                      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-white/[0.06]">
                        <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-violet-500" /><span className="text-[9px] text-slate-600">In Progress</span></div>
                        <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-green-500" /><span className="text-[9px] text-slate-600">Completed</span></div>
                        <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-slate-700" /><span className="text-[9px] text-slate-600">Pending</span></div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'resources' && (
                  <motion.div key="resources" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.15 }} className="space-y-6">
                    {/* Resource Summary */}
                    <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-4 sm:p-5">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex h-6 w-6 items-center justify-center rounded bg-violet-500/20 text-[11px] font-bold text-violet-300">✓</div>
                        <h2 className="text-sm font-semibold text-white">Resource Allocation Summary</h2>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                          { label: 'Total Engineers', value: plan.teams.reduce((a, t) => a + t.members, 0), icon: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z' },
                          { label: 'Total Capacity', value: `${Math.round(plan.teams.reduce((a, t) => a + t.load, 0) / plan.teams.length)}% avg`, icon: 'M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15' },
                          { label: 'Story Points', value: plan.effort.totalStoryPoints, icon: 'M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
                          { label: 'Est. Hours', value: plan.effort.engineeringHours, icon: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z' },
                        ].map((s, i) => (
                          <div key={s.label} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                            <div className="flex items-center gap-1.5 mb-1">
                              <svg className="h-3 w-3 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d={s.icon} />
                              </svg>
                              <span className="text-[10px] text-slate-500">{s.label}</span>
                            </div>
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.2 + i * 0.1 }}
                              className="text-lg font-bold text-white mt-0.5"
                            >{s.value}</motion.div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                    {/* Team Cards */}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {plan.teams.map((t, i) => (
                        <motion.div
                          key={t.name}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-5 hover:border-violet-500/20 transition-all group"
                        >
                          <div className="flex items-center gap-3 mb-4">
                            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${
                              i === 0 ? 'bg-red-500/20 text-red-300' : i === 1 ? 'bg-yellow-500/20 text-yellow-300' : 'bg-green-500/20 text-green-300'
                            }`}>{t.name[0]}{t.name[1]}</div>
                            <div className="min-w-0 flex-1">
                              <div className="text-sm font-semibold text-white">{t.name}</div>
                              <div className="text-[10px] text-violet-400">{t.role}</div>
                            </div>
                          </div>
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] text-slate-500">Capacity</span>
                              <span className={`text-[10px] font-medium ${
                                t.load >= 80 ? 'text-red-400' : t.load >= 60 ? 'text-yellow-400' : 'text-green-400'
                              }`}>{t.load}%</span>
                            </div>
                            <TeamCapacityBar load={t.load} />
                          </div>
                          <div className="flex items-center justify-between text-[10px]">
                            <div className="flex items-center gap-1.5">
                              <svg className="h-3 w-3 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
                              <span className="text-slate-600">{t.members} members</span>
                            </div>
                            <span className="text-slate-600">{t.lead}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Work Items by Sprint (for full list view) */}
                    <div className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-5">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex h-6 w-6 items-center justify-center rounded bg-violet-500/20 text-[11px] font-bold text-violet-300">8</div>
                        <h2 className="text-sm font-semibold text-white">GitLab Work Items</h2>
                      </div>
                      <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin">
                        {plan.workItems.map((w, i) => (
                          <motion.div
                            key={w.title}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.03 }}
                            className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5 hover:border-violet-500/20 transition-colors"
                          >
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                              <span className={`rounded px-1.5 py-0.5 text-[8px] font-bold ${
                                w.type === 'feat' ? 'bg-green-500/10 text-green-400' :
                                w.type === 'test' ? 'bg-brand/10 text-brand-light' :
                                w.type === 'chore' ? 'bg-yellow-500/10 text-yellow-400' :
                                'bg-slate-500/10 text-slate-400'
                              }`}>{w.type}</span>
                              <span className={`rounded px-1 py-0.5 text-[7px] font-bold ${
                                w.priority === 'P0' ? 'bg-red-500/10 text-red-400' :
                                w.priority === 'P1' ? 'bg-yellow-500/10 text-yellow-400' :
                                'bg-slate-500/10 text-slate-400'
                              }`}>{w.priority}</span>
                              <span className="text-xs text-slate-300 truncate">{w.title}</span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0 ml-2">
                              <span className="text-[9px] text-slate-700">S{w.sprint}</span>
                              <span className="text-[9px] text-slate-600">{w.points} pts</span>
                              <span className="text-[9px] text-slate-600">{w.assignee}</span>
                              <StatusBadge status={w.status === 'in_progress' ? 'running' : w.status} label={w.status === 'in_progress' ? 'In Progress' : w.status} />
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Layout>
  )
}
