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

const mockData = {
  feature: 'Add payment retry support',
  overview: {
    totalServices: 4,
    impactedTeams: 3,
    completionPct: 42,
    totalPoints: 34,
    pointsCompleted: 14,
    pointsRemaining: 20,
    estimatedHours: 136,
    hoursLogged: 58,
    sprintCount: 3,
    activeSprint: 1,
    blockers: 2,
    onTrack: true,
  },
  services: [
    { name: 'Payment Service', impact: 'critical', risk: 87, changes: 'Retry logic, circuit breaker, timeout config', files: 12, status: 'in_progress' },
    { name: 'Billing Service', impact: 'high', risk: 65, changes: 'Invoice reconciliation, retry event handling', files: 8, status: 'pending' },
    { name: 'Notification Service', impact: 'medium', risk: 45, changes: 'Retry failure alerts, webhook delivery', files: 5, status: 'pending' },
    { name: 'API Gateway', impact: 'high', risk: 72, changes: 'Rate limit config, timeout settings', files: 9, status: 'in_progress' },
  ],
  teams: [
    { name: 'Payments', role: 'Primary Owner', members: 8, load: 85, lead: '@alice', sprintPoints: 18, completedPoints: 14 },
    { name: 'Billing', role: 'Supporting', members: 5, load: 60, lead: '@bob', sprintPoints: 5, completedPoints: 0 },
    { name: 'Platform', role: 'Consulting', members: 6, load: 30, lead: '@carol', sprintPoints: 3, completedPoints: 0 },
  ],
  sprints: [
    {
      sprint: 1, name: 'Foundation & Core Logic', status: 'active', points: { total: 18, completed: 14 },
      focus: 'Circuit breaker, retry queue, billing integration',
      items: [
        { title: 'Implement circuit breaker pattern', type: 'feat', priority: 'P0', points: 8, assignee: '@alice', status: 'done' },
        { title: 'Add retry queue with bounded limits', type: 'feat', priority: 'P0', points: 5, assignee: '@alice', status: 'done' },
        { title: 'Update billing invoice reconciliation', type: 'feat', priority: 'P1', points: 5, assignee: '@bob', status: 'in_progress' },
      ],
    },
    {
      sprint: 2, name: 'Integration & Testing', status: 'planned', points: { total: 13, completed: 0 },
      focus: 'Monitoring, integration tests, gateway config',
      items: [
        { title: 'Add retry failure monitoring alerts', type: 'feat', priority: 'P1', points: 3, assignee: '@carol', status: 'todo' },
        { title: 'Write integration tests for retry scenarios', type: 'test', priority: 'P0', points: 5, assignee: '@dave', status: 'todo' },
        { title: 'Update API gateway timeout configuration', type: 'chore', priority: 'P2', points: 2, assignee: '@eve', status: 'todo' },
        { title: 'Create deployment runbook for retry changes', type: 'docs', priority: 'P2', points: 3, assignee: '@alice', status: 'todo' },
      ],
    },
    {
      sprint: 3, name: 'Hardening & Release', status: 'planned', points: { total: 3, completed: 0 },
      focus: 'Runbook, load tests, production rollout',
      items: [
        { title: 'Run load tests for retry scenarios', type: 'test', priority: 'P1', points: 3, assignee: '@dave', status: 'todo' },
      ],
    },
  ],
  timeline: [
    { phase: 'Design Review', start: 'Jun 15', end: 'Jun 17', duration: '3 days', progress: 100, status: 'completed' },
    { phase: 'Core Implementation', start: 'Jun 18', end: 'Jun 26', duration: '8 days', progress: 72, status: 'in_progress' },
    { phase: 'Integration & Testing', start: 'Jun 26', end: 'Jul 3', duration: '5 days', progress: 0, status: 'pending' },
    { phase: 'Staging Deploy', start: 'Jul 3', end: 'Jul 7', duration: '2 days', progress: 0, status: 'pending' },
    { phase: 'Production Release', start: 'Jul 8', end: 'Jul 8', duration: '1 day', progress: 0, status: 'pending' },
  ],
  effort: {
    totalStoryPoints: 34,
    engineeringHours: 136,
    engineers: 4,
    sprintDuration: '2 weeks',
    completionPct: 42,
    breakdown: [
      { phase: 'Design & Architecture', points: 8, hours: 32, owner: 'Tech Lead', completed: true },
      { phase: 'Core Retry Logic Implementation', points: 13, hours: 52, owner: 'Payments Team', completed: true },
      { phase: 'Billing Integration', points: 5, hours: 20, owner: 'Billing Team', completed: false },
      { phase: 'Testing & QA', points: 5, hours: 20, owner: 'QA Team', completed: false },
      { phase: 'Deployment & Monitoring', points: 3, hours: 12, owner: 'DevOps Team', completed: false },
    ],
  },
  risks: [
    { risk: 'Circuit breaker misconfiguration may cause silent failures', severity: 'critical', mitigation: 'Add comprehensive integration tests with fault injection', owner: 'Payments Team', probability: 'Medium', status: 'mitigated' },
    { risk: 'Retry queue overflow under peak load', severity: 'high', mitigation: 'Implement bounded retry queues with backpressure monitoring', owner: 'Platform Team', probability: 'High', status: 'active' },
    { risk: 'Billing reconciliation delay during rollout', severity: 'medium', mitigation: 'Implement feature flag with gradual rollout (10% → 50% → 100%)', owner: 'Billing Team', probability: 'Low', status: 'active' },
  ],
  workItems: [
    { title: 'Implement circuit breaker pattern', type: 'feat', priority: 'P0', points: 8, assignee: '@alice', sprint: 1, status: 'done' },
    { title: 'Add retry queue with bounded limits', type: 'feat', priority: 'P0', points: 5, assignee: '@alice', sprint: 1, status: 'done' },
    { title: 'Update billing invoice reconciliation', type: 'feat', priority: 'P1', points: 5, assignee: '@bob', sprint: 1, status: 'in_progress' },
    { title: 'Add retry failure monitoring alerts', type: 'feat', priority: 'P1', points: 3, assignee: '@carol', sprint: 2, status: 'todo' },
    { title: 'Write integration tests for retry scenarios', type: 'test', priority: 'P0', points: 5, assignee: '@dave', sprint: 2, status: 'todo' },
    { title: 'Update API gateway timeout configuration', type: 'chore', priority: 'P2', points: 2, assignee: '@eve', sprint: 2, status: 'todo' },
    { title: 'Create deployment runbook for retry changes', type: 'docs', priority: 'P2', points: 3, assignee: '@alice', sprint: 3, status: 'todo' },
    { title: 'Run load tests for retry scenarios', type: 'test', priority: 'P1', points: 3, assignee: '@dave', sprint: 3, status: 'todo' },
  ],
}

const tabs = [
  { id: 'dashboard', label: 'Executive Dashboard', icon: 'M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z' },
  { id: 'board', label: 'Planning Board', icon: 'M9 4.5v7.5m0 0v7.5m0-7.5h7.5m-7.5 0H6' },
  { id: 'timeline', label: 'Timeline', icon: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z' },
  { id: 'items', label: 'Work Items', icon: 'M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z' },
]

function AnimatedProgress({ value, color = 'bg-amber-500', size = 'md', label }) {
  const [w, setW] = useState(0)
  useEffect(() => { const t = setTimeout(() => setW(value), 300); return () => clearTimeout(t) }, [value])
  const h = size === 'sm' ? 'h-1' : size === 'lg' ? 'h-2.5' : 'h-1.5'
  return (
    <div className="w-full">
      {label && <div className="flex justify-between text-[10px] text-slate-500 mb-1"><span>{label}</span><span>{value}%</span></div>}
      <div className={`${h} rounded-full bg-slate-800 overflow-hidden`}>
        <motion.div initial={{ width: 0 }} animate={{ width: `${w}%` }} transition={{ duration: 0.8, ease: 'easeOut' }} className={`h-full rounded-full ${color}`} />
      </div>
    </div>
  )
}

function AnimatedGauge({ value, label, sub }) {
  const [pct, setPct] = useState(0)
  useEffect(() => { const t = setTimeout(() => setPct(value), 400); return () => clearTimeout(t) }, [value])
  const color = pct >= 80 ? '#22c55e' : pct >= 60 ? '#06b6d4' : pct >= 40 ? '#f59e0b' : '#ef4444'
  const circumference = Math.PI * 60
  const offset = circumference - (pct / 100) * circumference
  return (
    <div className="flex flex-col items-center">
      <svg className="w-28 h-28 sm:w-32 sm:h-32 -rotate-90" viewBox="0 0 136 136">
        <circle cx="68" cy="68" r="60" fill="none" stroke="#1e293b" strokeWidth="10" />
        <circle cx="68" cy="68" r="60" fill="none" stroke={color} strokeWidth="10" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} className="transition-all duration-1000 ease-out" />
      </svg>
      <div className="relative -mt-[76px] flex flex-col items-center">
        <span className="text-3xl font-bold text-white">{pct}<span className="text-base text-slate-500">%</span></span>
        {sub && <span className="text-[10px] text-slate-600 mt-0.5">{sub}</span>}
      </div>
      {label && <span className="text-[10px] font-medium text-slate-500 mt-1">{label}</span>}
    </div>
  )
}

function GanttRow({ phase, start, end, duration, progress, status, index }) {
  const barColor = status === 'completed' ? 'bg-emerald-500' : status === 'in_progress' ? 'bg-amber-500' : 'bg-slate-700'
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06 }}
      className="grid grid-cols-[110px_1fr_80px] sm:grid-cols-[130px_1fr_100px] items-center gap-3 py-2"
    >
      <div className="min-w-0">
        <div className="text-xs font-medium text-slate-300 truncate">{phase}</div>
        <div className="text-[9px] text-slate-600">{start} – {end}</div>
      </div>
      <div className="relative h-7 rounded-full bg-slate-800/80 border border-white/[0.04] overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, delay: 0.2 + index * 0.06 }}
          className={`h-full rounded-full ${barColor}`}
        />
        <div className="absolute inset-0 flex items-center px-3">
          <span className="text-[9px] font-medium text-slate-300">{duration}</span>
        </div>
      </div>
      <div className="flex justify-end">
        <StatusBadge status={status} label={status === 'in_progress' ? 'In Progress' : status} />
      </div>
    </motion.div>
  )
}

function WorkItemCard({ item }) {
  const typeColors = {
    feat: 'border-l-emerald-500/60 bg-emerald-500/[0.03]',
    test: 'border-l-amber-500/60 bg-amber-500/[0.03]',
    chore: 'border-l-yellow-500/60 bg-yellow-500/[0.03]',
    docs: 'border-l-slate-500/60 bg-slate-500/[0.03]',
  }
  const tc = typeColors[item.type] || typeColors.chore
  const statusDot = item.status === 'done' ? 'bg-emerald-500' : item.status === 'in_progress' ? 'bg-amber-500' : 'bg-slate-600'
  return (
    <div className={`rounded-lg border border-white/[0.06] border-l-2 ${tc} p-2.5 hover:border-white/[0.12] transition-all`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${statusDot}`} />
          <span className="text-xs text-slate-300 truncate">{item.title}</span>
        </div>
        <span className="text-[9px] text-slate-600 shrink-0">{item.points} pts</span>
      </div>
      <div className="flex items-center gap-1.5 mt-1.5">
        <span className={`rounded px-1.5 py-0.5 text-[7px] font-bold ${
          item.type === 'feat' ? 'bg-emerald-500/10 text-emerald-400' :
          item.type === 'test' ? 'bg-amber-500/10 text-amber-400' :
          item.type === 'chore' ? 'bg-yellow-500/10 text-yellow-400' :
          'bg-slate-500/10 text-slate-400'
        }`}>{item.type}</span>
        <span className={`rounded px-1 py-0.5 text-[7px] font-bold ${
          item.priority === 'P0' ? 'bg-red-500/10 text-red-400' :
          item.priority === 'P1' ? 'bg-yellow-500/10 text-yellow-400' :
          'bg-slate-500/10 text-slate-400'
        }`}>{item.priority}</span>
        <span className="text-[9px] text-slate-600">{item.assignee}</span>
        <span className="ml-auto text-[9px] text-slate-700">S{item.sprint}</span>
      </div>
    </div>
  )
}

const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } }
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }

export default function OrbitExecutionPlanner() {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)
  const [showPresets, setShowPresets] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState(-1)
  const [activeTab, setActiveTab] = useState('dashboard')
  const inputRef = useRef(null)

  const filtered = input.trim() ? presets.filter(p => p.toLowerCase().includes(input.toLowerCase())) : presets

  const generate = (text) => {
    if (!text.trim()) return
    setLoading(true)
    setData(null)
    setActiveTab('dashboard')
    setTimeout(() => {
      setData(mockData)
      setLoading(false)
    }, 1800)
  }

  const handleKey = (e) => {
    if (!showPresets || !filtered.length) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedPreset(p => Math.min(p + 1, filtered.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedPreset(p => Math.max(p - 1, 0)) }
    if (e.key === 'Enter' && selectedPreset >= 0) { e.preventDefault(); setInput(filtered[selectedPreset]); setShowPresets(false); generate(filtered[selectedPreset]) }
    if (e.key === 'Escape') setShowPresets(false)
  }

  useEffect(() => { setSelectedPreset(-1) }, [input])

  if (!data && !loading) {
    return (
      <Layout>
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
          <motion.div variants={item}>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/20">
                <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl text-white">Orbit Execution Planner</h1>
                <p className="text-sm text-slate-500">Track and manage feature delivery from planning to production</p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={item} className="relative">
            <div className="rounded-xl border border-white/[0.08] bg-slate-900/80 backdrop-blur-2xl p-4 sm:p-5">
              <form onSubmit={e => { e.preventDefault(); generate(input) }}>
                <div className="relative">
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
                  </svg>
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={e => { setInput(e.target.value); setShowPresets(true) }}
                    onFocus={() => setShowPresets(true)}
                    onKeyDown={handleKey}
                    placeholder='Enter a feature to plan execution, e.g. "Add payment retry support"'
                    className="w-full rounded-xl border border-white/[0.06] bg-slate-800/60 py-3.5 pl-11 pr-40 text-sm text-white placeholder-slate-600 outline-none focus:border-amber-500/40 focus:bg-slate-800/80 transition-all"
                    disabled={loading}
                  />
                  <div className="absolute inset-y-1.5 right-1.5 flex items-center gap-1">
                    <button
                      type="submit"
                      disabled={loading || !input.trim()}
                      className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 px-5 py-2 text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-500/20"
                    >
                      {loading ? (
                        <><svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Loading</>
                      ) : (
                        <><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" /></svg>Load Plan</>
                      )}
                    </button>
                  </div>
                </div>
              </form>
              <AnimatePresence>
                {showPresets && filtered.length > 0 && !loading && (
                  <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="mt-2 rounded-xl border border-white/[0.06] bg-slate-800/80 overflow-hidden">
                    {filtered.map((s, i) => (
                      <button key={s} type="button" className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${i === selectedPreset ? 'bg-amber-500/10 text-amber-300' : 'text-slate-500 hover:bg-white/[0.04] hover:text-white'}`} onClick={() => { setInput(s); setShowPresets(false); generate(s) }}>
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
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-white/[0.06] bg-gradient-to-br from-amber-500/5 to-orange-600/5">
              <svg className="h-10 w-10 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">Track execution from planning to production</h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto">Enter a feature above to load its execution plan. Monitor progress across sprints, services, and teams with real-time dashboards and interactive planning boards.</p>
          </motion.div>
        </motion.div>
      </Layout>
    )
  }

  return (
    <Layout>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-5 animate-pulse">
                  <div className="h-3 w-20 bg-slate-800 rounded mb-3" /><div className="h-8 w-16 bg-slate-800 rounded mb-2" /><div className="h-2 bg-slate-800 rounded" />
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-5 animate-pulse"><div className="h-3 w-48 bg-slate-800 rounded mb-4" />{Array.from({ length: 3 }).map((_, j) => (<div key={j} className="h-14 bg-slate-800 rounded mb-2" />))}</div>
          </motion.div>
        )}

        <AnimatePresence>
          {data && !loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              {/* Header */}
              <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-gradient-to-br from-slate-900 to-slate-900/50 p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 border border-amber-500/20">
                      <svg className="h-5 w-5 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" /></svg>
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs text-slate-500">Execution Plan for</div>
                      <h2 className="text-lg sm:text-xl font-bold text-white truncate">"{input}"</h2>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <StatusBadge status={data.overview.onTrack ? 'success' : 'error'} label={data.overview.onTrack ? 'On Track' : 'At Risk'} />
                    <StatusBadge status="info" label={`${data.overview.completionPct}% Complete`} />
                    <StatusBadge status={data.overview.blockers > 0 ? 'critical' : 'safe'} label={`${data.overview.blockers} Blockers`} />
                  </div>
                </div>
              </motion.div>

              {/* Tabs */}
              <motion.div variants={item} className="flex gap-1 rounded-xl border border-white/[0.06] bg-slate-900/60 p-1 overflow-x-auto">
                {tabs.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    className={`flex items-center gap-1.5 rounded-lg px-3 sm:px-4 py-2 text-xs font-medium transition-all whitespace-nowrap ${
                      activeTab === t.id
                        ? 'bg-gradient-to-r from-amber-500/15 to-orange-600/15 text-white shadow-sm'
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
                {activeTab === 'dashboard' && (
                  <motion.div key="dashboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.15 }} className="space-y-6">
                    {/* KPI Row */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-4 text-center">
                        <div className="flex items-baseline justify-center gap-1">
                          <span className="text-2xl font-bold text-emerald-400">{data.overview.completionPct}</span>
                          <span className="text-[10px] text-slate-600">%</span>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">Completion</div>
                      </div>
                      <div className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-4 text-center">
                        <div className="flex items-baseline justify-center gap-1">
                          <span className="text-2xl font-bold text-amber-300">{data.overview.pointsCompleted}</span>
                          <span className="text-[10px] text-slate-600">/ {data.overview.totalPoints}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">Points Done</div>
                      </div>
                      <div className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-4 text-center">
                        <div className="flex items-baseline justify-center gap-1">
                          <span className="text-2xl font-bold text-brand-light">{data.overview.hoursLogged}</span>
                          <span className="text-[10px] text-slate-600">/ {data.overview.estimatedHours}h</span>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">Hours Logged</div>
                      </div>
                      <div className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-4 text-center">
                        <div className="flex items-baseline justify-center gap-1">
                          <span className="text-2xl font-bold text-slate-300">{data.overview.activeSprint}</span>
                          <span className="text-[10px] text-slate-600">/ {data.overview.sprintCount}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">Active Sprint</div>
                      </div>
                    </div>

                    {/* Progress + Gauge */}
                    <div className="grid gap-6 lg:grid-cols-[1fr_auto]">
                      <div className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-5">
                        <h3 className="text-sm font-semibold text-white mb-4">Overall Progress</h3>
                        <AnimatedProgress value={data.overview.completionPct} color="bg-gradient-to-r from-amber-500 to-orange-600" size="lg" />
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                          <div className="text-center">
                            <div className="text-xs text-slate-600">Services</div>
                            <div className="text-lg font-bold text-white">{data.overview.totalServices}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-slate-600">Teams</div>
                            <div className="text-lg font-bold text-white">{data.overview.impactedTeams}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-slate-600">Blockers</div>
                            <div className="text-lg font-bold text-red-400">{data.overview.blockers}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-slate-600">Sprints</div>
                            <div className="text-lg font-bold text-white">{data.overview.sprintCount}</div>
                          </div>
                        </div>
                      </div>
                      <div className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-5 lg:w-[200px] flex flex-col items-center">
                        <h3 className="text-sm font-semibold text-white mb-3">On Track</h3>
                        <AnimatedGauge value={data.overview.completionPct} sub="complete" />
                      </div>
                    </div>

                    {/* Sprint Progress */}
                    <div className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-5">
                      <h3 className="text-sm font-semibold text-white mb-4">Sprint Progress</h3>
                      <div className="grid gap-4 sm:grid-cols-3">
                        {data.sprints.map(s => (
                          <div key={s.sprint} className={`rounded-lg border p-4 ${s.status === 'active' ? 'border-amber-500/30 bg-amber-500/[0.04]' : s.status === 'completed' ? 'border-emerald-500/20 bg-emerald-500/[0.03]' : 'border-white/[0.06] bg-white/[0.02]'}`}>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className={`h-2 w-2 rounded-full ${s.status === 'active' ? 'bg-amber-500 animate-pulse-soft' : s.status === 'completed' ? 'bg-emerald-500' : 'bg-slate-600'}`} />
                                <span className="text-xs font-bold text-white">Sprint {s.sprint}</span>
                              </div>
                              <span className="text-[10px] text-slate-500">{s.points.completed}/{s.points.total} pts</span>
                            </div>
                            <div className="text-sm font-semibold text-amber-300 mb-1">{s.name}</div>
                            <p className="text-[10px] text-slate-500 mb-2">{s.focus}</p>
                            <AnimatedProgress value={s.points.total > 0 ? Math.round((s.points.completed / s.points.total) * 100) : 0} color={s.status === 'completed' ? 'bg-emerald-500' : 'bg-amber-500'} size="sm" />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Services + Teams */}
                    <div className="grid gap-6 lg:grid-cols-2">
                      <div className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-5">
                        <h3 className="text-sm font-semibold text-white mb-4">Impacted Services</h3>
                        <div className="space-y-2">
                          {data.services.map((s, i) => (
                            <div key={i} className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 hover:border-amber-500/20 transition-colors">
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                <span className={`h-2 w-2 rounded-full shrink-0 ${s.impact === 'critical' ? 'bg-red-500' : s.impact === 'high' ? 'bg-orange-500' : 'bg-yellow-500'}`} />
                                <div className="min-w-0">
                                  <div className="text-xs font-medium text-white">{s.name}</div>
                                  <div className="text-[10px] text-slate-600 truncate">{s.changes}</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 shrink-0 ml-2">
                                <StatusBadge status={s.status === 'in_progress' ? 'running' : s.status} label={s.status === 'in_progress' ? 'In Progress' : s.status} />
                                <StatusBadge status={s.impact} label={`${s.risk}%`} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-5">
                        <h3 className="text-sm font-semibold text-white mb-4">Impacted Teams</h3>
                        <div className="space-y-2">
                          {data.teams.map((t, i) => (
                            <div key={i} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                                    i === 0 ? 'bg-amber-500/20 text-amber-300' : i === 1 ? 'bg-blue-500/20 text-blue-300' : 'bg-emerald-500/20 text-emerald-300'
                                  }`}>{t.name[0]}</div>
                                  <div>
                                    <div className="text-xs font-medium text-white">{t.name}</div>
                                    <div className="text-[10px] text-slate-600">{t.role} · {t.members} members</div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-[10px] text-slate-400">{t.completedPoints}/{t.sprintPoints} pts</div>
                                  <div className="text-[9px] text-slate-600">{t.lead}</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="flex-1 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${t.sprintPoints > 0 ? (t.completedPoints / t.sprintPoints) * 100 : 0}%` }}
                                    transition={{ duration: 0.6, delay: i * 0.1 }}
                                    className={`h-full rounded-full ${t.load >= 80 ? 'bg-red-500' : t.load >= 60 ? 'bg-yellow-500' : 'bg-emerald-500'}`}
                                  />
                                </div>
                                <span className={`text-[10px] font-medium min-w-[32px] text-right ${t.load >= 80 ? 'text-red-400' : t.load >= 60 ? 'text-yellow-400' : 'text-emerald-400'}`}>{t.load}%</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Risks */}
                    <div className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-5">
                      <div className="flex items-center gap-2 mb-4">
                        <h3 className="text-sm font-semibold text-white">Risk Mitigation Plan</h3>
                        <StatusBadge status={data.risks.some(r => r.severity === 'critical') ? 'critical' : 'safe'} label={`${data.risks.filter(r => r.status === 'active').length} active`} />
                      </div>
                      <div className="grid gap-3">
                        {data.risks.map((r, i) => (
                          <div key={i} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                            <div className="flex items-start justify-between mb-1 flex-wrap gap-1">
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <StatusBadge status={r.severity} label={r.severity} />
                                <span className="text-xs font-medium text-slate-200">{r.risk}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <StatusBadge status={r.status === 'mitigated' ? 'success' : 'warning'} label={r.status} />
                                <StatusBadge status={r.probability === 'High' ? 'critical' : r.probability === 'Medium' ? 'warning' : 'info'} label={r.probability} />
                              </div>
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
                    {data.sprints.map(s => {
                      const todo = s.items.filter(w => w.status === 'todo')
                      const inProgress = s.items.filter(w => w.status === 'in_progress')
                      const done = s.items.filter(w => w.status === 'done')
                      return (
                        <div key={s.sprint} className="rounded-xl border border-white/[0.06] bg-slate-900/30 p-4 sm:p-5">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <span className={`h-2.5 w-2.5 rounded-full ${s.status === 'active' ? 'bg-amber-500 animate-pulse-soft' : s.status === 'completed' ? 'bg-emerald-500' : 'bg-slate-600'}`} />
                              <div>
                                <h3 className="text-sm font-bold text-white">Sprint {s.sprint}: {s.name}</h3>
                                <p className="text-[10px] text-slate-600">{s.focus} · {s.points.completed}/{s.points.total} pts completed</p>
                              </div>
                            </div>
                            <StatusBadge status={s.status === 'active' ? 'running' : s.status === 'completed' ? 'success' : 'pending'} label={s.status} />
                          </div>
                          <div className="grid gap-3 sm:grid-cols-3">
                            <div className="rounded-xl border border-white/[0.06] bg-slate-900/40 p-3 min-h-[200px]">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <span className="h-2 w-2 rounded-full bg-slate-500" />
                                  <h4 className="text-[10px] font-semibold text-slate-400 uppercase">To Do</h4>
                                </div>
                                <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[9px] text-slate-500">{todo.length}</span>
                              </div>
                              <div className="space-y-1.5">
                                {todo.map((item, i) => <WorkItemCard key={item.title} item={item} />)}
                                {todo.length === 0 && <p className="text-[10px] text-slate-700 text-center py-6">All cleared</p>}
                              </div>
                            </div>
                            <div className="rounded-xl border border-white/[0.06] bg-slate-900/40 p-3 min-h-[200px]">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse-soft" />
                                  <h4 className="text-[10px] font-semibold text-amber-400 uppercase">In Progress</h4>
                                </div>
                                <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[9px] text-slate-500">{inProgress.length}</span>
                              </div>
                              <div className="space-y-1.5">
                                {inProgress.map((item, i) => <WorkItemCard key={item.title} item={item} />)}
                                {inProgress.length === 0 && <p className="text-[10px] text-slate-700 text-center py-6">Nothing in progress</p>}
                              </div>
                            </div>
                            <div className="rounded-xl border border-white/[0.06] bg-slate-900/40 p-3 min-h-[200px]">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                  <h4 className="text-[10px] font-semibold text-emerald-400 uppercase">Done</h4>
                                </div>
                                <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[9px] text-slate-500">{done.length}</span>
                              </div>
                              <div className="space-y-1.5">
                                {done.map((item, i) => <WorkItemCard key={item.title} item={item} />)}
                                {done.length === 0 && <p className="text-[10px] text-slate-700 text-center py-6">No completed items</p>}
                              </div>
                            </div>
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
                        <div className="flex h-6 w-6 items-center justify-center rounded bg-amber-500/20 text-[11px] font-bold text-amber-300">
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <h2 className="text-sm font-semibold text-white">Release Timeline</h2>
                      </div>
                      {/* Sprint markers */}
                      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
                        {data.sprints.map(s => (
                          <div key={s.sprint} className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-[9px] font-medium whitespace-nowrap ${
                            s.status === 'active' ? 'border-amber-500/30 bg-amber-500/10 text-amber-300' : s.status === 'completed' ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400' : 'border-white/[0.06] text-slate-500'
                          }`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${s.status === 'active' ? 'bg-amber-500 animate-pulse-soft' : s.status === 'completed' ? 'bg-emerald-500' : 'bg-slate-600'}`} />
                            Sprint {s.sprint}: {s.points.completed}/{s.points.total} pts
                          </div>
                        ))}
                      </div>
                      <div className="relative">
                        {data.timeline.map((t, i) => (
                          <GanttRow key={t.phase} {...t} index={i} />
                        ))}
                      </div>
                      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-white/[0.06]">
                        <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-500" /><span className="text-[9px] text-slate-600">In Progress</span></div>
                        <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500" /><span className="text-[9px] text-slate-600">Completed</span></div>
                        <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-slate-700" /><span className="text-[9px] text-slate-600">Pending</span></div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'items' && (
                  <motion.div key="items" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.15 }} className="space-y-6">
                    <div className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-5">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex h-6 w-6 items-center justify-center rounded bg-amber-500/20 text-[11px] font-bold text-amber-300">
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
                        </div>
                        <h2 className="text-sm font-semibold text-white">GitLab Work Items</h2>
                        <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[9px] text-slate-500 ml-auto">{data.workItems.length} items</span>
                      </div>
                      <div className="space-y-1.5 max-h-[600px] overflow-y-auto pr-1 scrollbar-thin">
                        {data.sprints.map(s => (
                          <div key={s.sprint}>
                            <div className="flex items-center gap-2 py-2 mt-2 first:mt-0">
                              <span className={`h-2 w-2 rounded-full ${s.status === 'active' ? 'bg-amber-500 animate-pulse-soft' : s.status === 'completed' ? 'bg-emerald-500' : 'bg-slate-600'}`} />
                              <h4 className="text-xs font-semibold text-slate-400">Sprint {s.sprint}: {s.name}</h4>
                              <span className="text-[9px] text-slate-700">({s.points.completed}/{s.points.total} pts)</span>
                            </div>
                            {s.items.map((item, i) => (
                              <div key={item.title} className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5 hover:border-amber-500/20 transition-colors ml-4">
                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                  <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${item.status === 'done' ? 'bg-emerald-500' : item.status === 'in_progress' ? 'bg-amber-500' : 'bg-slate-600'}`} />
                                  <span className={`rounded px-1.5 py-0.5 text-[7px] font-bold ${
                                    item.type === 'feat' ? 'bg-emerald-500/10 text-emerald-400' :
                                    item.type === 'test' ? 'bg-amber-500/10 text-amber-400' :
                                    item.type === 'chore' ? 'bg-yellow-500/10 text-yellow-400' :
                                    'bg-slate-500/10 text-slate-400'
                                  }`}>{item.type}</span>
                                  <span className={`rounded px-1 py-0.5 text-[7px] font-bold ${
                                    item.priority === 'P0' ? 'bg-red-500/10 text-red-400' :
                                    item.priority === 'P1' ? 'bg-yellow-500/10 text-yellow-400' :
                                    'bg-slate-500/10 text-slate-400'
                                  }`}>{item.priority}</span>
                                  <span className="text-xs text-slate-300 truncate">{item.title}</span>
                                </div>
                                <div className="flex items-center gap-2 shrink-0 ml-2">
                                  <span className="text-[9px] text-slate-600">{item.points} pts</span>
                                  <span className="text-[9px] text-slate-600">{item.assignee}</span>
                                  <StatusBadge status={item.status === 'in_progress' ? 'running' : item.status} label={item.status === 'in_progress' ? 'In Progress' : item.status} />
                                </div>
                              </div>
                            ))}
                          </div>
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
