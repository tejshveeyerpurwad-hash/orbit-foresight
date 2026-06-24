import { useState, useEffect, useRef, Component } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import StatusBadge from '../components/StatusBadge'

class PlanErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }
  componentDidCatch(error, info) {
    console.error('[PlanErrorBoundary]', error, info)
  }
  render() {
    if (this.state.hasError) {
      return (
        <Layout>
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20">
              <svg className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white mb-1">Plan Generation Failed</h2>
              <p className="text-sm text-slate-400">An unexpected error occurred during plan generation.</p>
            </div>
            <button
              onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload() }}
              className="inline-flex items-center gap-2 rounded-lg bg-violet-500 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-violet-400 active:scale-[0.97] shadow-lg shadow-violet-500/20"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
              </svg>
              Retry Analysis
            </button>
          </div>
        </Layout>
      )
    }
    return this.props.children
  }
}

const presets = [
  'Add payment retry support',
  'Migrate database connection pool',
  'Implement SSO authentication',
  'Deploy microservices monitoring',
  'Refactor API gateway rate limiter',
  'Build incident response dashboard',
]

const mockPlan = {
  successProbability: 87,
  architectureComplexity: 72,
  impact: {
    riskScore: 72,
    blastRadius: '3 services',
    complexity: 'High',
    priority: 'P1 \u2014 High Priority',
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
    { name: 'Go \u2014 Concurrency Patterns', level: 'Expert', required: true, availability: 'Available' },
    { name: 'PostgreSQL \u2014 Transaction Mgmt', level: 'Advanced', required: true, availability: 'Available' },
    { name: 'Kubernetes \u2014 Deployment Strategy', level: 'Intermediate', required: false, availability: 'Consulting' },
    { name: 'Monitoring \u2014 Datadog APM', level: 'Intermediate', required: false, availability: 'Available' },
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
  milestones: [
    { date: 'Sprint 1 Week 1', label: 'Design Sign-off', critical: true },
    { date: 'Sprint 2 Week 1', label: 'Core Implementation Complete', critical: true },
    { date: 'Sprint 2 Week 2', label: 'Integration Tests Pass', critical: false },
    { date: 'Sprint 3 Week 1', label: 'Production Go-live', critical: true },
  ],
  dependencies: [
    { from: 0, to: 1 },
    { from: 1, to: 2 },
    { from: 2, to: 3 },
    { from: 3, to: 4 },
  ],
  risks: [
    { risk: 'Circuit breaker misconfiguration may cause silent failures', severity: 'critical', mitigation: 'Add comprehensive integration tests with fault injection', owner: 'Payments Team', probability: 'Medium', impact: 9, likelihood: 7 },
    { risk: 'Retry queue overflow under peak load', severity: 'high', mitigation: 'Implement bounded retry queues with backpressure monitoring', owner: 'Platform Team', probability: 'High', impact: 8, likelihood: 6 },
    { risk: 'Billing reconciliation delay during rollout', severity: 'medium', mitigation: 'Implement feature flag with gradual rollout (10% \u2192 50% \u2192 100%)', owner: 'Billing Team', probability: 'Low', impact: 5, likelihood: 3 },
    { risk: 'Database migration conflicts with existing transactions', severity: 'high', mitigation: 'Run migrations during low-traffic window with rollback plan', owner: 'Platform Team', probability: 'Medium', impact: 7, likelihood: 5 },
    { risk: 'Monitoring gaps for retry metrics', severity: 'medium', mitigation: 'Add Datadog dashboards and alerts for retry rates', owner: 'DevOps Team', probability: 'Low', impact: 4, likelihood: 4 },
  ],
  riskForecast: [
    { sprint: 1, risk: 35, label: 'Design & Planning' },
    { sprint: 2, risk: 55, label: 'Core Implementation' },
    { sprint: 3, risk: 45, label: 'Integration & Testing' },
    { sprint: 4, risk: 30, label: 'Staging & QA' },
    { sprint: 5, risk: 20, label: 'Production Rollout' },
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
  costEstimation: {
    hourlyRate: 150,
    totalCost: 20400,
    currency: 'USD',
    budget: 25000,
    phaseCosts: [
      { phase: 'Design & Architecture', hours: 32, cost: 4800 },
      { phase: 'Core Implementation', hours: 52, cost: 7800 },
      { phase: 'Billing Integration', hours: 20, cost: 3000 },
      { phase: 'Testing & QA', hours: 20, cost: 3000 },
      { phase: 'Deployment & Monitoring', hours: 12, cost: 1800 },
    ],
  },
  recommendations: [
    { title: 'Add circuit breaker metrics dashboard', priority: 'P0', effort: '3 days', impact: 'Critical \u2014 prevents silent failures in production', description: 'Instrument circuit breaker state changes and expose via Prometheus metrics. Add Datadog dashboard for real-time monitoring of open/closed/half-open states with alert thresholds.' },
    { title: 'Implement retry queue backpressure', priority: 'P0', effort: '5 days', impact: 'Critical \u2014 prevents queue overflow under load', description: 'Add adaptive rate limiting to retry queue consumer based on downstream latency. Use Semaphore pattern to bound concurrent retry executions and prevent resource exhaustion.' },
    { title: 'Set up feature flag for gradual rollout', priority: 'P1', effort: '2 days', impact: 'High \u2014 enables safe staged deployment', description: 'Integrate with LaunchDarkly for percentage-based rollout of new retry logic. Implement kill switch capability to instantly fall back to legacy retry behavior.' },
    { title: 'Create integration test suite for retry scenarios', priority: 'P1', effort: '4 days', impact: 'High \u2014 validates correctness across services', description: 'Build comprehensive integration tests covering network timeout, 5xx responses, rate limiting, and idempotency checks. Use testcontainers for dependent service simulation.' },
    { title: 'Document runbook for retry failure escalation', priority: 'P2', effort: '1 day', impact: 'Medium \u2014 reduces MTTR during incidents', description: 'Create runbook with flowcharts for diagnosing retry failures, common alert responses, and escalation paths. Include Splunk queries and dashboard links.' },
  ],
  allocation: {
    teams: ['Payments', 'Billing', 'Platform'],
    sprints: [1, 2, 3],
    data: [[80, 60, 30], [40, 20, 10], [20, 10, 5]],
  },
}

function AnimatedCounter({ value, suffix = '', duration = 800, delay = 0, className = '' }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (value === undefined || value === null) return
    const timeout = setTimeout(() => {
      const steps = 30
      const inc = value / steps
      let cur = 0
      const iv = setInterval(() => {
        cur += inc
        if (cur >= value) { setCount(value); clearInterval(iv) }
        else setCount(Math.floor(cur))
      }, duration / steps)
      return () => clearInterval(iv)
    }, delay)
    return () => clearTimeout(timeout)
  }, [value, duration, delay])
  return <span className={className}>{count}{suffix}</span>
}

function ReadinessGauge({ value, label }) {
  const [pct, setPct] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setPct(value), 400)
    return () => clearTimeout(t)
  }, [value])
  const color = pct >= 80 ? '#22c55e' : pct >= 60 ? '#818cf8' : pct >= 40 ? '#f59e0b' : '#ef4444'
  const circumference = Math.PI * 60
  const offset = circumference - (pct / 100) * circumference
  return (
    <div className="flex flex-col items-center">
      <svg className="w-28 h-28 sm:w-36 sm:h-36 -rotate-90" viewBox="0 0 136 136">
        <circle cx="68" cy="68" r="60" fill="none" stroke="#1e293b" strokeWidth="10" />
        <circle cx="68" cy="68" r="60" fill="none" stroke={color} strokeWidth="10" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} className="transition-all duration-1000 ease-out" />
      </svg>
      <div className="relative -mt-[76px] flex flex-col items-center">
        <span className="text-3xl sm:text-4xl font-bold text-white"><AnimatedCounter value={pct} delay={0} /><span className="text-base sm:text-lg text-slate-500">%</span></span>
        <span className="text-xs font-medium mt-1" style={{ color }}>{label || (pct >= 80 ? 'Ready' : pct >= 60 ? 'On Track' : pct >= 40 ? 'Needs Work' : 'At Risk')}</span>
      </div>
    </div>
  )
}

function EffortBar({ label, points, hours, owner, totalPoints, color = 'violet' }) {
  const pct = totalPoints > 0 ? (points / totalPoints) * 100 : 0
  const hexColor = color === 'violet' ? '#8b5cf6' : color === 'indigo' ? '#6366f1' : color === 'emerald' ? '#10b981' : '#8b5cf6'
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 hover:border-violet-500/30 transition-all group">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-medium text-slate-300 truncate mr-2">{label}</span>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] font-semibold text-violet-400">{points} pts</span>
          <span className="text-[9px] text-slate-600">{hours}h</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <svg width="28" height="28" viewBox="0 0 28 28" className="-rotate-90 shrink-0">
          <circle cx="14" cy="14" r="10" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="3" />
          <motion.circle cx="14" cy="14" r="10" fill="none" stroke={hexColor} strokeWidth="3" strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 10} initial={{ strokeDashoffset: 2 * Math.PI * 10 }}
            animate={{ strokeDashoffset: 2 * Math.PI * 10 * (1 - pct / 100) }} transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }} />
          <text x="14" y="17" textAnchor="middle" fill={hexColor} fontSize="6" fontWeight="700" fontFamily="monospace" transform="rotate(90 14 14)">{Math.round(pct)}%</text>
        </svg>
        <span className="text-[9px] text-slate-600">{owner}</span>
      </div>
    </div>
  )
}

function TeamCapacityBar({ load }) {
  const hexColor = load >= 80 ? '#ef4444' : load >= 60 ? '#eab308' : '#22c55e'
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" className="-rotate-90 shrink-0">
      <circle cx="12" cy="12" r="9" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="2.5" />
      <motion.circle cx="12" cy="12" r="9" fill="none" stroke={hexColor} strokeWidth="2.5" strokeLinecap="round"
        strokeDasharray={2 * Math.PI * 9} initial={{ strokeDashoffset: 2 * Math.PI * 9 }}
        animate={{ strokeDashoffset: 2 * Math.PI * 9 * (1 - load / 100) }} transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }} />
      <text x="12" y="15" textAnchor="middle" fill={hexColor} fontSize="6" fontWeight="700" fontFamily="monospace" transform="rotate(90 12 12)">{load}%</text>
    </svg>
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
  const isCritical = ['Core Implementation', 'Design Review', 'Production Release'].includes(phase)
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08 }}
      className={`grid grid-cols-[120px_1fr] sm:grid-cols-[140px_1fr_80px] items-center gap-2 sm:gap-4 py-2 ${isCritical ? 'relative' : ''}`}
    >
      {isCritical && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-amber-500/40 rounded-full" />}
      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          <div className="text-xs font-medium text-slate-300 truncate">{phase}</div>
          {isCritical && <span className="text-[7px] font-bold text-amber-500 bg-amber-500/10 rounded px-1 py-0.5">CRITICAL</span>}
        </div>
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
      <div className="hidden sm:flex justify-end items-center gap-2">
        <span className={`text-[9px] font-medium ${progress >= 100 ? 'text-green-400' : progress > 0 ? 'text-violet-400' : 'text-slate-600'}`}>{progress}%</span>
        <StatusBadge status={status} label={status.replace('_', ' ')} />
      </div>
    </motion.div>
  )
}

function SprintCard({ workItem }) {
  const typeColors = {
    feat: 'border-l-green-500/60 bg-green-500/[0.03]',
    test: 'border-l-indigo-500/60 bg-indigo-500/[0.03]',
    chore: 'border-l-amber-500/60 bg-amber-500/[0.03]',
    docs: 'border-l-slate-500/60 bg-slate-500/[0.03]',
  }
  const tc = typeColors[workItem.type] || typeColors.chore
  const priorityColor = workItem.priority === 'P0' ? 'text-red-400' : workItem.priority === 'P1' ? 'text-yellow-400' : 'text-slate-500'
  const priorityBorder = workItem.priority === 'P0' ? 'border-l-red-500/60' : workItem.priority === 'P1' ? 'border-l-amber-500/60' : ''
  return (
    <div className={`rounded-lg border border-slate-800 border-l-2 ${tc} ${priorityBorder} p-3 hover:border-slate-700 hover:shadow-lg hover:shadow-violet-500/5 transition-all group`}>
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
          workItem.type === 'test' ? 'bg-indigo-500/10 text-indigo-400' :
          workItem.type === 'chore' ? 'bg-amber-500/10 text-amber-400' :
          'bg-slate-500/10 text-slate-400'
        }`}>{workItem.type}</span>
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-700 text-[8px] font-bold text-slate-300">
          {workItem.assignee.replace('@', '').charAt(0).toUpperCase()}
        </div>
        <span className="text-[9px] text-slate-600">{workItem.assignee}</span>
      </div>
    </div>
  )
}

function BoardColumn({ title, items, accentColor, emptyText }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 min-h-[300px]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${accentColor}`} />
          <h3 className="text-xs font-semibold text-white uppercase tracking-wider">{title}</h3>
        </div>
        <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] font-medium text-slate-500">{items.length}</span>
      </div>
      <div className="space-y-2">
        <AnimatePresence>
          {items.map((w, i) => (
            <motion.div key={w.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <SprintCard workItem={w} />
            </motion.div>
          ))}
        </AnimatePresence>
        {items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <svg className="h-6 w-6 text-slate-700 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            <p className="text-[10px] text-slate-600">{emptyText || 'Drag items here'}</p>
          </div>
        )}
      </div>
    </div>
  )
}

function RiskMatrix({ risks, compact }) {
  return (
    <div className={`grid ${compact ? 'grid-cols-2 sm:grid-cols-5' : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-5'} gap-2`}>
      {risks.map((r, i) => {
        const score = r.impact * r.likelihood
        const color = score >= 50 ? 'bg-red-500/20 border-red-500/40 text-red-300' : score >= 25 ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' : 'bg-violet-500/20 border-violet-500/40 text-violet-300'
        return (
          <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.06 }} className={`rounded-lg border p-${compact ? '2' : '2.5'} text-center ${color}`}>
            <div className={`${compact ? 'text-base' : 'text-lg'} font-bold`}>{score}</div>
            <div className={`${compact ? 'text-[7px]' : 'text-[8px]'} opacity-80 mt-0.5`}>{r.risk.length > 30 ? r.risk.slice(0, compact ? 22 : 28) + '...' : r.risk}</div>
            <div className="flex items-center justify-center gap-1 mt-1 text-[7px] opacity-70">
              <span>I:{r.impact}</span>
              <span className="text-white/20">&times;</span>
              <span>P:{r.likelihood}</span>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

function ArchitectureDiagram({ services }) {
  const positions = [
    { x: 10, y: 10, w: 170, h: 68 },
    { x: 220, y: 10, w: 170, h: 68 },
    { x: 10, y: 110, w: 170, h: 68 },
    { x: 220, y: 110, w: 170, h: 68 },
  ]
  const svgW = 420, svgH = 200
  const impactColors = { critical: '#ef4444', high: '#f59e0b', medium: '#eab308', low: '#22c55e' }
  return (
    <div className="relative overflow-x-auto">
      <svg className="w-full max-w-full" viewBox={`0 0 ${svgW} ${svgH}`} style={{ minHeight: svgH, minWidth: svgW }}>
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#6366f1" />
          </marker>
          <marker id="arrowDashed" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#475569" />
          </marker>
        </defs>
        <line x1={positions[0].x + positions[0].w} y1={positions[0].y + positions[0].h / 2} x2={positions[1].x} y2={positions[1].y + positions[1].h / 2} stroke="#6366f1" strokeWidth="1.5" markerEnd="url(#arrow)" />
        <line x1={positions[0].x + positions[0].w / 2} y1={positions[0].y + positions[0].h} x2={positions[2].x + positions[2].w / 2} y2={positions[2].y} stroke="#6366f1" strokeWidth="1.5" markerEnd="url(#arrow)" />
        <line x1={positions[1].x + positions[1].w} y1={positions[1].y + positions[1].h / 2} x2={positions[3].x} y2={positions[3].y + positions[3].h / 2} stroke="#6366f1" strokeWidth="1.5" markerEnd="url(#arrow)" strokeDasharray="4,3" />
        <line x1={positions[3].x + positions[3].w / 2} y1={positions[3].y} x2={positions[2].x + positions[2].w / 2} y2={positions[2].y + positions[2].h} stroke="#6366f1" strokeWidth="1.5" markerEnd="url(#arrow)" strokeDasharray="4,3" />
        <line x1={positions[1].x + positions[1].w / 2} y1={positions[1].y + positions[1].h} x2={positions[3].x + positions[3].w / 2} y2={positions[3].y} stroke="#475569" strokeWidth="1" markerEnd="url(#arrowDashed)" strokeDasharray="3,3" />
        {services.map((s, i) => {
          const p = positions[i]
          const fill = impactColors[s.impact] || '#6366f1'
          return (
            <g key={s.name}>
              <rect x={p.x} y={p.y} width={p.w} height={p.h} rx="8" fill="#0f172a" stroke={fill} strokeWidth="1.5" strokeOpacity="0.4" />
              <text x={p.x + 12} y={p.y + 22} fill="#e2e8f0" fontSize="11" fontWeight="600" fontFamily="system-ui">{s.name}</text>
              <text x={p.x + 12} y={p.y + 37} fill={fill} fontSize="8" fontWeight="500" fontFamily="system-ui">{s.changes.length > 28 ? s.changes.slice(0, 26) + '...' : s.changes}</text>
              <rect x={p.x + 12} y={p.y + 46} width={p.w - 24} height="10" rx="5" fill="#1e293b" />
              <rect x={p.x + 12} y={p.y + 46} width={(p.w - 24) * (s.risk / 100)} height="10" rx="5" fill={fill} opacity="0.7" />
            </g>
          )
        })}
      </svg>
    </div>
  )
}

const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } }
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }

const loadingSteps = [
  'AI analyzing...',
  'Architecture review...',
  'Risk assessment...',
  'Sprint planning...',
  'Finalizing plan...',
]

function LoadingState() {
  const [step, setStep] = useState(0)
  useEffect(() => {
    if (step >= loadingSteps.length - 1) return
    const t = setTimeout(() => setStep(s => Math.min(s + 1, loadingSteps.length - 1)), 800)
    return () => clearTimeout(t)
  }, [step])

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="flex items-center gap-3 mb-2">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}>
          <svg className="h-5 w-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
          </svg>
        </motion.div>
        <div>
          <h2 className="text-sm font-semibold text-white">Generating Strategic Plan</h2>
          <p className="text-[10px] text-slate-500">Analyzing scope, impact, and resources</p>
        </div>
      </div>
      <div className="space-y-2">
        {loadingSteps.map((s, i) => (
          <div key={s} className={`flex items-center gap-3 text-sm transition-all duration-300 ${i <= step ? 'opacity-100' : 'opacity-30'}`}>
            <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
              i < step ? 'bg-green-500/20 text-green-400' : i === step ? 'bg-violet-500/20 text-violet-400' : 'bg-slate-800/60 text-slate-600'
            }`}>
              {i < step ? (
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
              ) : i === step ? (
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="h-3 w-3 border-2 border-violet-400 border-t-transparent rounded-full" />
              ) : (
                <span className="text-[10px]">{i + 1}</span>
              )}
            </div>
            <span className={`transition-all duration-300 ${i === step ? 'text-white font-medium' : i < step ? 'text-slate-400' : 'text-slate-600'}`}>{s}</span>
          </div>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 animate-pulse">
            <div className="h-3 w-24 rounded bg-slate-800 mb-3" />
            <div className="h-8 w-16 rounded bg-slate-800 mb-2" />
            <div className="h-2 w-full rounded bg-slate-800" />
          </div>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 animate-pulse">
          <div className="h-3 w-40 rounded bg-slate-800 mb-4" />
          {Array.from({ length: 5 }).map((_, j) => <div key={j} className="h-12 rounded bg-slate-800 mb-2" />)}
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 animate-pulse">
          <div className="h-3 w-32 rounded bg-slate-800 mb-4" />
          {Array.from({ length: 4 }).map((_, j) => <div key={j} className="h-10 rounded bg-slate-800 mb-2" />)}
        </div>
      </div>
    </motion.div>
  )
}

const suggestedTemplates = [
  { title: 'Payment Retry System', desc: 'Add idempotent retry logic with circuit breaker', difficulty: 'Medium', duration: '3 sprints', color: 'violet' },
  { title: 'Auth Migration', desc: 'Migrate from OAuth2 to OIDC with MFA support', difficulty: 'High', duration: '5 sprints', color: 'indigo' },
  { title: 'Database Sharding', desc: 'Horizontal sharding for PostgreSQL read replicas', difficulty: 'High', duration: '4 sprints', color: 'red' },
  { title: 'Observability Stack', desc: 'Deploy OpenTelemetry + Datadog across services', difficulty: 'Low', duration: '2 sprints', color: 'emerald' },
]

const recentPlans = [
  { title: 'API Rate Limiter Refactor', updated: '2 hours ago', status: 'viewed' },
  { title: 'Microservices Monitoring', updated: 'Yesterday', status: 'viewed' },
  { title: 'Database Connection Pool', updated: '3 days ago', status: 'viewed' },
]

export default function AIEngineeringPlanner() {
  const navigate = useNavigate()
  const [input, setInput] = useState('')
  const [planning, setPlanning] = useState(false)
  const [plan, setPlan] = useState(null)
  const [showPresets, setShowPresets] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState(-1)
  const [hasGenerated, setHasGenerated] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    if (!plan && !planning && !hasGenerated) {
      const saved = sessionStorage.getItem('ai_planner_plan')
      if (saved) {
        try { setPlan(JSON.parse(saved)); setHasGenerated(true) } catch { sessionStorage.removeItem('ai_planner_plan') }
      }
    }
  }, [])

  useEffect(() => {
    if (plan && hasGenerated) {
      sessionStorage.setItem('ai_planner_plan', JSON.stringify(plan))
    }
  }, [plan, hasGenerated])

  const filtered = input.trim() ? presets.filter(p => p.toLowerCase().includes(input.toLowerCase())) : presets

  const generate = (text) => {
    if (!text.trim()) return
    setPlanning(true)
    setPlan(null)
    setHasGenerated(true)
    setTimeout(() => {
      setPlan(mockPlan)
      setPlanning(false)
    }, 2800)
  }

  const handleKey = (e) => {
    if (!showPresets || !filtered.length) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedPreset(p => Math.min(p + 1, filtered.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedPreset(p => Math.max(p - 1, 0)) }
    if (e.key === 'Enter' && selectedPreset >= 0) { e.preventDefault(); setInput(filtered[selectedPreset]); setShowPresets(false); generate(filtered[selectedPreset]) }
    if (e.key === 'Escape') setShowPresets(false)
  }

  useEffect(() => { setSelectedPreset(-1) }, [input])

  const showEmpty = !plan && !planning

  return (
    <PlanErrorBoundary>
    <Layout>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">

        {showEmpty && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div className="flex flex-col items-center text-center gap-4 py-12">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600/20 to-violet-500/10 border border-violet-500/20">
                <svg className="h-8 w-8 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white mb-1">AI Strategy Room</h1>
                <p className="text-[9px] text-violet-400 font-medium tracking-wider uppercase mb-1">Executive Remediation Planning Engine</p>
                <p className="text-sm text-slate-400 max-w-md">Describe a feature, migration, or initiative and get a complete engineering plan with sprint breakdowns, risk analysis, and team allocation.</p>
              </div>
              <form onSubmit={e => { e.preventDefault(); generate(input) }} className="w-full max-w-lg">
                <div className="relative">
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={e => { setInput(e.target.value); setShowPresets(true) }}
                    onFocus={() => setShowPresets(true)}
                    onKeyDown={handleKey}
                    placeholder="Describe a feature to plan..."
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 py-3.5 pl-11 pr-36 text-sm text-white placeholder-slate-600 outline-none focus:border-violet-500/40 transition-all"
                  />
                  <div className="absolute inset-y-1.5 right-1.5 flex items-center gap-1">
                    <button
                      type="submit"
                      disabled={!input.trim()}
                      className="inline-flex items-center gap-2 rounded-lg bg-violet-500 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-violet-400 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-violet-500/20"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                      Generate Plan
                    </button>
                  </div>
                </div>
                <AnimatePresence>
                  {showPresets && filtered.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="mt-2 rounded-xl border border-slate-800 bg-slate-900 overflow-hidden">
                      {filtered.map((s, i) => (
                        <button key={s} type="button" className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${i === selectedPreset ? 'bg-violet-500/10 text-violet-300' : 'text-slate-500 hover:bg-white/[0.04] hover:text-white'}`} onClick={() => { setInput(s); setShowPresets(false); generate(s) }}>
                          <svg className="h-3.5 w-3.5 shrink-0 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>
                          {s}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_auto]">
              <div className="space-y-4">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Suggested Templates</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {suggestedTemplates.map((t, i) => (
                    <motion.button
                      key={t.title}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.06 * i }}
                      onClick={() => { setInput(t.title); generate(t.title) }}
                      className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-left hover:border-violet-500/30 hover:shadow-lg hover:shadow-violet-500/5 transition-all group"
                    >
                      <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-${t.color}-500/20 mb-3`}>
                        <svg className={`h-4 w-4 text-${t.color}-400`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
                        </svg>
                      </div>
                      <div className="text-sm font-semibold text-white mb-1 group-hover:text-violet-300 transition-colors">{t.title}</div>
                      <p className="text-[10px] text-slate-400 leading-relaxed mb-2">{t.desc}</p>
                      <div className="flex items-center gap-2 text-[9px] text-slate-600">
                        <span className="rounded-full bg-slate-800/80 px-2 py-0.5">{t.difficulty}</span>
                        <span className="rounded-full bg-slate-800/80 px-2 py-0.5">{t.duration}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
              <div className="lg:w-64 space-y-4">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Recent Plans</h3>
                <div className="space-y-2">
                  {recentPlans.map((rp, i) => (
                    <div key={i} className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 hover:border-violet-500/30 transition-all cursor-pointer">
                      <div className="text-[11px] font-medium text-white mb-0.5">{rp.title}</div>
                      <div className="flex items-center gap-2 text-[8px] text-slate-600">
                        <span>{rp.updated}</span>
                        <span className="h-1 w-1 rounded-full bg-slate-700" />
                        <span className="text-violet-400">{rp.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider pt-4">Quick Start</h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Try Examples', icon: 'M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z' },
                    { label: 'Watch Demo', icon: 'M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z' },
                    { label: 'View API', icon: 'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5' },
                    { label: 'Docs', icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z' },
                  ].map((q, i) => (
                    <button key={i} className="flex flex-col items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-center hover:border-violet-500/30 transition-all">
                      <svg className="h-4 w-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={q.icon} />
                      </svg>
                      <span className="text-[9px] text-slate-400">{q.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {planning && <LoadingState />}

        <AnimatePresence mode="wait">
          {plan && !planning && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">

              <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-violet-500 shadow-lg shadow-violet-500/25">
                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h1 className="text-xl font-bold tracking-tight text-white">AI STRATEGY ROOM</h1>
                      <span className="rounded-full bg-violet-500/10 border border-violet-500/20 px-1.5 py-0.5 text-[8px] font-semibold text-violet-400 tracking-wider uppercase">Pro</span>
                    </div>
                    <div className="text-[9px] text-violet-400 font-medium mb-0.5">Executive Remediation Planning Engine</div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-600">
                      <span>Plan for &quot;{input}&quot;</span>
                      <span className="text-slate-700">&middot;</span>
                      <span>Generated {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <StatusBadge status={plan.readiness.score >= 70 ? 'success' : plan.readiness.score >= 40 ? 'warning' : 'error'} label={`${plan.readiness.score}% Readiness`} />
                  <StatusBadge status={plan.impact.complexity === 'High' ? 'critical' : plan.impact.complexity === 'Medium' ? 'warning' : 'info'} label={plan.impact.complexity} />
                  <StatusBadge status="info" label={`${plan.effort.totalStoryPoints} pts`} />
                  <span className="text-[9px] text-slate-600 border border-slate-800 rounded px-2 py-1">{plan.effort.engineeringHours}h est.</span>
                </div>
              </motion.div>

              <motion.div variants={item}>
                <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
                  <form onSubmit={e => { e.preventDefault(); generate(input) }}>
                    <div className="relative">
                      <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                      </svg>
                      <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={e => { setInput(e.target.value); setShowPresets(true) }}
                        onFocus={() => setShowPresets(true)}
                        onKeyDown={handleKey}
                        placeholder="Describe a feature to plan..."
                        className="w-full rounded-xl border border-slate-800 bg-slate-950 py-3 pl-11 pr-44 text-sm text-white placeholder-slate-600 outline-none focus:border-violet-500/40 transition-all"
                        disabled={planning}
                      />
                      <div className="absolute inset-y-1.5 right-1.5 flex items-center gap-1">
                        <button
                          type="submit"
                          disabled={planning || !input.trim()}
                          className="inline-flex items-center gap-2 rounded-lg bg-violet-500 px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-violet-400 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-violet-500/20"
                        >
                          {planning ? (
                            <><svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Generating</>
                          ) : (
                            <><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>Generate Plan</>
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                  <AnimatePresence>
                    {showPresets && filtered.length > 0 && !planning && (
                      <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="mt-2 rounded-xl border border-slate-800 bg-slate-900 overflow-hidden">
                        {filtered.map((s, i) => (
                          <button key={s} type="button" className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${i === selectedPreset ? 'bg-violet-500/10 text-violet-300' : 'text-slate-500 hover:bg-white/[0.04] hover:text-white'}`} onClick={() => { setInput(s); setShowPresets(false); generate(s) }}>
                            <svg className="h-3.5 w-3.5 shrink-0 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>
                            {s}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1">
                    <span className="text-[9px] text-slate-600 font-medium mr-1">Popular:</span>
                    {presets.slice(0, 4).map((p, i) => (
                      <button key={i} type="button" onClick={() => { setInput(p); setShowPresets(false); generate(p) }} className="rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1 text-[10px] text-slate-400 hover:border-violet-500/30 hover:text-violet-300 transition-all whitespace-nowrap">
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>

              <motion.div variants={item} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {[
                  { label: 'Total Story Points', value: plan.effort.totalStoryPoints, suffix: '', color: 'text-violet-400', bg: 'bg-violet-500/10', icon: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z' },
                  { label: 'Engineering Hours', value: plan.effort.engineeringHours, suffix: 'h', color: 'text-indigo-400', bg: 'bg-indigo-500/10', icon: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z' },
                  { label: 'Teams Assigned', value: plan.teams.length, suffix: '', color: 'text-green-400', bg: 'bg-green-500/10', icon: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z' },
                  { label: 'Sprint Duration', value: 2, suffix: ' weeks', color: 'text-amber-400', bg: 'bg-amber-500/10', icon: 'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5' },
                  { label: 'Release Confidence', value: plan.effort.confidence === 'High' ? 85 : 60, suffix: '%', color: 'text-emerald-400', bg: 'bg-emerald-500/10', icon: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
                ].map((s, i) => (
                  <div key={s.label} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 hover:border-violet-500/20 hover:shadow-lg hover:shadow-violet-500/5 transition-all group">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${s.bg}`}>
                        <svg className={`h-3.5 w-3.5 ${s.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d={s.icon} />
                        </svg>
                      </div>
                      <span className="text-[10px] text-slate-500">{s.label}</span>
                    </div>
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.08 }} className={`text-2xl font-bold ${s.color}`}>
                      <AnimatedCounter value={typeof s.value === 'number' ? s.value : 85} suffix={s.suffix || ''} delay={200 + i * 80} />
                    </motion.div>
                    {s.label === 'Release Confidence' && (
                      <svg width="36" height="36" viewBox="0 0 36 36" className="-rotate-90 shrink-0 mx-auto mt-2">
                        <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="3.5" />
                        <motion.circle cx="18" cy="18" r="14" fill="none" stroke="#22c55e" strokeWidth="3.5" strokeLinecap="round"
                          strokeDasharray={2 * Math.PI * 14} initial={{ strokeDashoffset: 2 * Math.PI * 14 }}
                          animate={{ strokeDashoffset: 2 * Math.PI * 14 * (1 - (plan.effort.confidence === 'High' ? 85 : 60) / 100) }} transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }} />
                        <text x="18" y="21" textAnchor="middle" fill="#22c55e" fontSize="9" fontWeight="700" fontFamily="monospace" transform="rotate(90 18 18)">{plan.effort.confidence === 'High' ? 85 : 60}%</text>
                      </svg>
                    )}
                  </div>
                ))}
              </motion.div>

              {/* === EXECUTIVE RECOMMENDATION === */}
              <motion.div variants={item} className="rounded-xl border border-violet-500/20 bg-gradient-to-br from-violet-500/[0.04] to-purple-500/[0.02] p-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-purple-600 shadow-lg shadow-violet-500/25">
                    <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                    </svg>
                  </div>
                  <h2 className="text-sm font-bold text-white">AI Executive Recommendation</h2>
                  <div className="flex-1" />
                  <span className="rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20 px-2 py-0.5 text-[8px] font-mono font-bold">AI POWERED</span>
                </div>
                <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
                  <div className="space-y-3">
                    <div className="rounded-lg border border-violet-500/15 bg-violet-500/[0.04] p-3">
                      <div className="flex items-center gap-2 mb-1.5">
                        <svg className="h-4 w-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-xs font-semibold text-violet-300">Why AI Chose This Plan</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">Based on analysis of {plan.services.length} services with {plan.impact.riskScore}% risk score, AI recommends prioritizing circuit breaker implementation across payment and billing services. This reduces blast radius from {plan.impact.blastRadius} to 2 services and achieves 85% release confidence within 2 sprints.</p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { label: 'Risk Reduction', value: plan.readiness.score >= 70 ? '82%' : plan.readiness.score >= 40 ? '65%' : '45%', color: 'text-green-400', desc: 'Projected improvement' },
                        { label: 'Cost Impact', value: plan.readiness.score >= 70 ? '$340K' : '$180K', color: 'text-cyan-400', desc: 'Revenue protected' },
                        { label: 'Time to Value', value: plan.impact.complexity === 'High' ? '4 weeks' : '2 weeks', color: 'text-amber-400', desc: 'Expected delivery' },
                        { label: 'AI Confidence', value: `${plan.effort.confidence === 'High' ? 92 : plan.effort.confidence === 'Medium' ? 78 : 65}%`, color: 'text-violet-400', desc: 'Pattern match certainty' },
                      ].map((s, i) => (
                        <div key={s.label} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5 text-center hover:border-violet-500/20 transition-all">
                          <div className={`text-lg font-bold ${s.color}`}>{s.value}</div>
                          <div className="text-[9px] text-slate-500 font-medium">{s.label}</div>
                          <div className="text-[7px] text-slate-600 mt-0.5">{s.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-lg border border-emerald-500/15 bg-emerald-500/[0.03] p-3 flex flex-col items-center justify-center text-center">
                    <svg className="h-8 w-8 text-emerald-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="text-2xl font-bold text-emerald-400">{plan.readiness.score}%</div>
                    <div className="text-[9px] font-mono text-emerald-400/80">Readiness Score</div>
                    <div className="text-[7px] text-slate-600 mt-1 max-w-[140px]">AI evaluation of plan completeness and execution readiness</div>
                  </div>
                </div>
              </motion.div>

              {/* === COST VS BENEFIT === */}
              <motion.div variants={item} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20">
                    <svg className="h-3.5 w-3.5 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-sm font-bold text-white">Cost vs Benefit Analysis</h2>
                  <span className="rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 text-[8px] font-mono font-bold">ROI OPTIMIZED</span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    { label: 'Engineering Cost', value: `${plan.effort.engineeringHours}h`, cost: `${(plan.effort.engineeringHours * 150).toLocaleString()}`, icon: 'M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
                    { label: 'Revenue Protected', value: '$340K', cost: 'Projected savings', icon: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z' },
                    { label: 'Risk Avoidance', value: '$180K', cost: 'Potential loss prevented', icon: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z' },
                    { label: 'Net ROI', value: `${plan.readiness.score >= 70 ? '285' : '150'}%`, cost: 'Return on investment', icon: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
                  ].map((s, i) => (
                    <div key={s.label} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 hover:border-amber-500/20 transition-all">
                      <div className="flex items-center gap-2 mb-1.5">
                        <svg className="h-3.5 w-3.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d={s.icon} />
                        </svg>
                        <span className="text-[9px] text-slate-500">{s.label}</span>
                      </div>
                      <div className="text-lg font-bold text-white">{s.value}</div>
                      <div className="text-[8px] text-slate-600">{s.cost}</div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div variants={item} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/20 text-xs font-bold text-violet-400">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3" />
                      </svg>
                    </div>
                    <h2 className="text-sm font-semibold text-white">Architecture Generator</h2>
                  <div className="flex-1" />
                  <span className="text-[9px] text-slate-600">{plan.services.length} services &middot; {plan.services.reduce((a, s) => a + s.files, 0)} files</span>
                </div>
                <div className="grid gap-5 lg:grid-cols-[1fr_auto]">
                  <div className="space-y-4 min-w-0">
                    <p className="text-xs text-slate-400 leading-relaxed">Architecture overview: {plan.impact.summary}</p>
                    <ArchitectureDiagram services={plan.services} />
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {plan.services.map((s, i) => (
                        <div key={i} className="rounded-lg border border-slate-800 bg-slate-900/80 p-3 text-center hover:border-violet-500/30 transition-all">
                          <div className={`h-2 w-2 rounded-full mx-auto mb-1.5 ${
                            s.impact === 'critical' ? 'bg-red-500' : s.impact === 'high' ? 'bg-orange-500' : s.impact === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                          }`} />
                          <div className="text-[11px] font-medium text-white truncate">{s.name}</div>
                          <div className="text-[8px] text-slate-600 mt-0.5">{s.files} files &middot; {s.risk}% risk</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="lg:w-44 rounded-lg border border-slate-800 bg-slate-900/80 p-4 flex flex-col items-center">
                    <div className="text-[10px] text-slate-500 mb-2 font-medium">Complexity Score</div>
                    <ReadinessGauge value={plan.architectureComplexity} label="Complex" />
                    <div className="mt-2 text-[8px] text-slate-600 text-center">Moderate architectural complexity across 4 services</div>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={item} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/20 text-xs font-bold text-violet-400">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                    </svg>
                  </div>
                  <h2 className="text-sm font-semibold text-white">Engineering Plan</h2>
                  <div className="flex-1" />
                  <StatusBadge status={plan.impact.priority.startsWith('P1') ? 'warning' : 'critical'} label={plan.impact.priority} />
                </div>
                <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-3">
                        <div className="text-[9px] text-slate-500 mb-0.5">Risk Score</div>
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold text-red-400"><AnimatedCounter value={plan.impact.riskScore} delay={50} /></span>
                          <span className="text-[10px] text-slate-600">/ 100</span>
                        </div>
                      </div>
                      <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-3">
                        <div className="text-[9px] text-slate-500 mb-0.5">Blast Radius</div>
                        <div className="text-sm font-semibold text-white">{plan.impact.blastRadius}</div>
                      </div>
                      <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-3">
                        <div className="text-[9px] text-slate-500 mb-0.5">Complexity</div>
                        <div className="flex items-center gap-1.5">
                          <div className={`h-2 w-2 rounded-full ${plan.impact.complexity === 'High' ? 'bg-red-500' : plan.impact.complexity === 'Medium' ? 'bg-amber-500' : 'bg-green-500'}`} />
                          <span className="text-sm font-semibold text-white">{plan.impact.complexity}</span>
                        </div>
                      </div>
                      <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-3">
                        <div className="text-[9px] text-slate-500 mb-0.5">Engineers</div>
                        <div className="text-sm font-semibold text-white">{plan.effort.engineers} engineers</div>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{plan.impact.summary}</p>
                  </div>
                  <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-4">
                    <div className="text-[10px] text-slate-500 font-medium mb-3">4-Quadrant Estimate</div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-lg bg-violet-500/10 border border-violet-500/20 p-3 text-center">
                        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="text-2xl font-bold text-violet-400"><AnimatedCounter value={plan.effort.totalStoryPoints} delay={100} /></motion.div>
                        <div className="text-[9px] text-violet-400/70 mt-0.5">Total Story Points</div>
                      </div>
                      <div className="rounded-lg bg-indigo-500/10 border border-indigo-500/20 p-3 text-center">
                        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="text-2xl font-bold text-indigo-400"><AnimatedCounter value={plan.effort.engineeringHours} delay={200} /></motion.div>
                        <div className="text-[9px] text-indigo-400/70 mt-0.5">Engineering Hours</div>
                      </div>
                      <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 text-center">
                        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="text-2xl font-bold text-emerald-400"><AnimatedCounter value={plan.effort.engineers} delay={300} /></motion.div>
                        <div className="text-[9px] text-emerald-400/70 mt-0.5">Engineers Needed</div>
                      </div>
                      <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-3 text-center">
                        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }} className="text-2xl font-bold text-amber-400">{plan.effort.sprintDuration}</motion.div>
                        <div className="text-[9px] text-amber-400/70 mt-0.5">Sprint Duration</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={item}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/20 text-xs font-bold text-violet-400">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                  </div>
                  <h2 className="text-sm font-semibold text-white">Sprint Breakdown</h2>
                  <div className="flex-1" />
                  <span className="text-[9px] text-slate-600">{plan.sprints.length} sprints</span>
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  {plan.sprints.map((sprint, i) => {
                    const items = plan.workItems.filter(w => w.sprint === sprint.sprint)
                    const totalPts = items.reduce((a, w) => a + w.points, 0)
                    const donePts = items.filter(w => w.status === 'done').reduce((a, w) => a + w.points, 0)
                    const pct = totalPts > 0 ? Math.round((donePts / totalPts) * 100) : 0
                    const isActive = sprint.status === 'active'
                    return (
                      <motion.div
                        key={sprint.sprint}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className={`rounded-xl border bg-slate-900/60 p-5 transition-all ${
                          isActive ? 'border-violet-500/40 shadow-lg shadow-violet-500/10 ring-1 ring-violet-500/20' : 'border-slate-800 hover:border-violet-500/30'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className={`h-2.5 w-2.5 rounded-full ${isActive ? 'bg-violet-500 animate-pulse' : 'bg-slate-600'}`} />
                            <span className="text-xs font-semibold text-white">Sprint {sprint.sprint}</span>
                          </div>
                          <StatusBadge status={isActive ? 'running' : 'pending'} label={isActive ? 'Active' : 'Planned'} />
                        </div>
                        <div className="text-sm font-medium text-white mb-1">{sprint.name}</div>
                        <div className="text-[10px] text-slate-500 mb-3">{sprint.focus}</div>
                        <div className="flex items-center gap-2 mb-3">
                          <svg width="28" height="28" viewBox="0 0 28 28" className="-rotate-90 shrink-0">
                            <circle cx="14" cy="14" r="10" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="3" />
                            <motion.circle cx="14" cy="14" r="10" fill="none" stroke={isActive ? '#8b5cf6' : '#64748b'} strokeWidth="3" strokeLinecap="round"
                              strokeDasharray={2 * Math.PI * 10} initial={{ strokeDashoffset: 2 * Math.PI * 10 }}
                              animate={{ strokeDashoffset: 2 * Math.PI * 10 * (1 - pct / 100) }} transition={{ duration: 0.8, delay: 0.2 + i * 0.08, ease: 'easeOut' }} />
                            <text x="14" y="17" textAnchor="middle" fill={isActive ? '#8b5cf6' : '#64748b'} fontSize="6" fontWeight="700" fontFamily="monospace" transform="rotate(90 14 14)">{pct}%</text>
                          </svg>
                          <span className="text-[10px] font-medium text-slate-400">{donePts}/{totalPts} pts</span>
                        </div>
                        <div className="flex items-center justify-between text-[9px] text-slate-600">
                          <span>{sprint.start} &rarr; {sprint.end}</span>
                          <span className={pct > 0 ? 'text-violet-400' : 'text-slate-600'}>{pct}% complete</span>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </motion.div>

              <motion.div variants={item}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/20 text-xs font-bold text-violet-400">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                    </svg>
                  </div>
                  <h2 className="text-sm font-semibold text-white">Team Allocation</h2>
                  <div className="flex-1" />
                  <span className="text-[9px] text-slate-600">{plan.teams.reduce((a, t) => a + t.members, 0)} engineers</span>
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  {plan.teams.map((t, i) => {
                    const sprintPoints = plan.workItems
                      .filter(w => w.assignee.replace('@', '') === t.lead.replace('@', '') || (t.name === 'Payments' && ['@alice', '@dave'].includes(w.assignee)))
                      .reduce((a, w) => a + w.points, 0)
                    const completedPoints = plan.workItems
                      .filter(w => w.assignee.replace('@', '') === t.lead.replace('@', '') || (t.name === 'Payments' && ['@alice', '@dave'].includes(w.assignee)))
                      .filter(w => w.status === 'done')
                      .reduce((a, w) => a + w.points, 0)
                    const compPct = sprintPoints > 0 ? Math.round((completedPoints / sprintPoints) * 100) : 0
                    const isOver = t.load >= 80
                    return (
                      <motion.div
                        key={t.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 hover:border-violet-500/30 transition-all"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${
                            i === 0 ? 'bg-red-500/20 text-red-300' : i === 1 ? 'bg-amber-500/20 text-amber-300' : 'bg-green-500/20 text-green-300'
                          }`}>{t.name[0]}{t.name[1]}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-white">{t.name}</span>
                              {isOver && (
                                <span className="flex items-center gap-1 rounded-full bg-red-500/10 border border-red-500/20 px-1.5 py-0.5">
                                  <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                                  <span className="text-[7px] font-medium text-red-400">Overallocated</span>
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-violet-400">{t.role}</span>
                          </div>
                        </div>
                        <div className="space-y-2 mb-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-slate-500">Capacity</span>
                            <span className={`text-[10px] font-medium ${isOver ? 'text-red-400' : t.load >= 60 ? 'text-amber-400' : 'text-green-400'}`}>{t.load}%</span>
                          </div>
                          <TeamCapacityBar load={t.load} />
                        </div>
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          <div className="rounded bg-slate-800/60 p-2 text-center">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 + i * 0.08 }} className="text-xs font-bold text-white">
                              <AnimatedCounter value={sprintPoints} delay={100 + i * 80} />
                            </motion.div>
                            <div className="text-[8px] text-slate-600">Sprint Pts</div>
                          </div>
                          <div className="rounded bg-slate-800/60 p-2 text-center">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + i * 0.08 }} className={`text-xs font-bold ${compPct >= 50 ? 'text-green-400' : 'text-amber-400'}`}>
                              {compPct}%
                            </motion.div>
                            <div className="text-[8px] text-slate-600">Complete</div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-600">
                          <span>{t.members} members</span>
                          <span>{t.lead}</span>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </motion.div>

              <motion.div variants={item} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/20 text-xs font-bold text-violet-400">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                    </svg>
                  </div>
                  <h2 className="text-sm font-semibold text-white">Resource Planning</h2>
                  <div className="flex-1" />
                  <span className="text-[9px] text-slate-600">{plan.allocation.teams.length} teams &times; {plan.allocation.sprints.length} sprints</span>
                </div>
                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-4">
                    <div className="text-[10px] text-slate-500 font-medium mb-3">Team &times; Sprint Allocation Heatmap</div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-slate-800">
                            <th className="text-left py-2 pr-3 text-[9px] text-slate-500 font-medium">Team</th>
                            {plan.allocation.sprints.map(s => (
                              <th key={s} className="text-center py-2 px-2 text-[9px] text-slate-500 font-medium">S{s}</th>
                            ))}
                            <th className="text-center py-2 pl-2 text-[9px] text-slate-500 font-medium">Avg</th>
                          </tr>
                        </thead>
                        <tbody>
                          {plan.allocation.teams.map((team, ti) => {
                            const row = plan.allocation.data[ti]
                            const avg = Math.round(row.reduce((a, v) => a + v, 0) / row.length)
                            return (
                              <tr key={team} className="border-b border-white/[0.03]">
                                <td className="py-2 pr-3">
                                  <span className="text-[10px] text-slate-300">{team}</span>
                                </td>
                                {row.map((val, si) => {
                                  const cellColor = val >= 80 ? 'bg-red-500/25 text-red-300' : val >= 60 ? 'bg-amber-500/20 text-amber-300' : val >= 30 ? 'bg-violet-500/15 text-violet-300' : 'bg-slate-800/60 text-slate-500'
                                  return (
                                    <td key={si} className={`text-center py-2 px-2 rounded ${cellColor}`}>
                                      <span className="text-[10px] font-medium">{val}%</span>
                                    </td>
                                  )
                                })}
                                <td className={`text-center py-2 pl-2 text-[10px] font-medium ${
                                  avg >= 80 ? 'text-red-400' : avg >= 60 ? 'text-amber-400' : avg >= 30 ? 'text-violet-400' : 'text-slate-500'
                                }`}>{avg}%</td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-800 text-[8px] text-slate-600 flex-wrap">
                      <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-red-500/50" /> &ge;80%</span>
                      <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-amber-500/50" /> 60-79%</span>
                      <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-violet-500/50" /> 30-59%</span>
                      <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-slate-700" /> &lt;30%</span>
                    </div>
                  </div>
                  <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-4">
                    <div className="text-[10px] text-slate-500 font-medium mb-3">Resource Histogram &mdash; Engineers per Week</div>
                    <div className="space-y-2">
                      {[
                        { week: 'Week 1', payments: 6, billing: 3, platform: 2 },
                        { week: 'Week 2', payments: 7, billing: 4, platform: 2 },
                        { week: 'Week 3', payments: 5, billing: 3, platform: 3 },
                        { week: 'Week 4', payments: 3, billing: 2, platform: 2 },
                        { week: 'Week 5', payments: 2, billing: 1, platform: 1 },
                      ].map((w, i) => {
                        const total = w.payments + w.billing + w.platform
                        const maxVal = 12
                        return (
                          <div key={i} className="flex items-center gap-2">
                            <span className="text-[8px] text-slate-500 w-12 shrink-0">{w.week}</span>
                            <div className="flex-1 h-5 rounded bg-slate-800 overflow-hidden flex">
                              <motion.div initial={{ width: 0 }} animate={{ width: `${(w.payments / maxVal) * 100}%` }} transition={{ duration: 0.5, delay: 0.1 * i }} className="h-full bg-gradient-to-r from-red-500 to-red-400 relative" style={{ opacity: 0.85 }}>
                                <span className="absolute inset-0 flex items-center pl-1 text-[7px] text-white/90 font-medium">{w.payments}</span>
                              </motion.div>
                              <motion.div initial={{ width: 0 }} animate={{ width: `${(w.billing / maxVal) * 100}%` }} transition={{ duration: 0.5, delay: 0.15 + 0.1 * i }} className="h-full bg-gradient-to-r from-amber-500 to-amber-400 relative" style={{ opacity: 0.85 }}>
                                <span className="absolute inset-0 flex items-center pl-1 text-[7px] text-white/90 font-medium">{w.billing}</span>
                              </motion.div>
                              <motion.div initial={{ width: 0 }} animate={{ width: `${(w.platform / maxVal) * 100}%` }} transition={{ duration: 0.5, delay: 0.2 + 0.1 * i }} className="h-full bg-gradient-to-r from-green-500 to-green-400 relative" style={{ opacity: 0.85 }}>
                                <span className="absolute inset-0 flex items-center pl-1 text-[7px] text-white/90 font-medium">{w.platform}</span>
                              </motion.div>
                            </div>
                            <span className="text-[8px] text-slate-600 w-6 text-right">{total}</span>
                          </div>
                        )
                      })}
                    </div>
                    <div className="flex items-center gap-3 mt-2 pt-2 border-t border-slate-800 text-[8px] text-slate-600">
                      <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-red-500" /> Payments</span>
                      <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-amber-500" /> Billing</span>
                      <span className="flex items-center gap-1"><span className="h-2 w-2 rounded bg-green-500" /> Platform</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={item} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                <div className="flex items-center gap-2 mb-5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/20 text-xs font-bold text-violet-400">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-sm font-semibold text-white">Timeline Forecast</h2>
                  <div className="flex-1" />
                  <StatusBadge status="info" label={`${plan.timeline.length} phases`} />
                </div>
                <div className="mb-4">
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                    <span>Overall Progress</span>
                    <span className="text-violet-400 font-medium">{Math.round(plan.timeline.reduce((a, t) => a + t.progress, 0) / plan.timeline.length)}%</span>
                  </div>
                  <svg width="36" height="36" viewBox="0 0 36 36" className="-rotate-90">
                    <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="3.5" />
                    <motion.circle cx="18" cy="18" r="14" fill="none" stroke="#8b5cf6" strokeWidth="3.5" strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 14} initial={{ strokeDashoffset: 2 * Math.PI * 14 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 14 * (1 - Math.round(plan.timeline.reduce((a, t) => a + t.progress, 0) / plan.timeline.length) / 100) }} transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }} />
                    <text x="18" y="21" textAnchor="middle" fill="#8b5cf6" fontSize="9" fontWeight="700" fontFamily="monospace" transform="rotate(90 18 18)">{Math.round(plan.timeline.reduce((a, t) => a + t.progress, 0) / plan.timeline.length)}%</text>
                  </svg>
                </div>
                <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
                  {plan.sprints.map(s => (
                    <div key={s.sprint} className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-[9px] font-medium whitespace-nowrap ${
                      s.status === 'active' ? 'border-violet-500/30 bg-violet-500/10 text-violet-300' : 'border-slate-800 text-slate-500'
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${s.status === 'active' ? 'bg-violet-500' : 'bg-slate-600'}`} />
                      Sprint {s.sprint}: {s.name}
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
                  <span className="text-[9px] text-slate-600 mr-1">Milestones:</span>
                  {plan.milestones.map((m, i) => (
                    <div key={i} className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[8px] font-medium whitespace-nowrap ${
                      m.critical ? 'border-amber-500/30 bg-amber-500/10 text-amber-400' : 'border-slate-800 text-slate-400'
                    }`}>
                      <svg className={`h-3 w-3 ${m.critical ? 'text-amber-400' : 'text-slate-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                      </svg>
                      {m.label}
                    </div>
                  ))}
                </div>
                <div className="relative">
                  {plan.timeline.map((t, i) => <GanttBar key={t.phase} {...t} index={i} />)}
                </div>
                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-800">
                  <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-violet-500" /><span className="text-[9px] text-slate-600">In Progress</span></div>
                  <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-green-500" /><span className="text-[9px] text-slate-600">Completed</span></div>
                  <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-slate-700" /><span className="text-[9px] text-slate-600">Pending</span></div>
                  <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-500" /><span className="text-[9px] text-slate-600">Critical</span></div>
                </div>
              </motion.div>

              <motion.div variants={item} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/20 text-xs font-bold text-violet-400">$</div>
                  <h2 className="text-sm font-semibold text-white">Cost Forecast</h2>
                  <div className="flex-1" />
                  <span className="text-[9px] text-slate-600">{plan.costEstimation.currency} &middot; ${plan.costEstimation.hourlyRate}/hr avg</span>
                </div>
                <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-3 text-center">
                        <div className="text-xl font-bold text-violet-400"><AnimatedCounter value={plan.costEstimation.totalCost} delay={100} /></div>
                        <div className="text-[9px] text-slate-600 mt-0.5">Total Cost ($)</div>
                      </div>
                      <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-3 text-center">
                        <div className="text-xl font-bold text-white">{plan.effort.engineeringHours}</div>
                        <div className="text-[9px] text-slate-600 mt-0.5">Engineering Hours</div>
                      </div>
                      <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-3 text-center">
                        <div className="text-xl font-bold text-white">${plan.costEstimation.hourlyRate}</div>
                        <div className="text-[9px] text-slate-600 mt-0.5">Hourly Rate</div>
                      </div>
                      <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-3 text-center">
                        <div className="text-xl font-bold text-green-400"><AnimatedCounter value={plan.costEstimation.budget - plan.costEstimation.totalCost} delay={200} /></div>
                        <div className="text-[9px] text-slate-600 mt-0.5">Under Budget</div>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      {plan.costEstimation.phaseCosts.map((pc, i) => {
                        const pct = (pc.cost / plan.costEstimation.totalCost) * 100
                        return (
                          <div key={i} className="flex items-center gap-3 text-xs">
                            <span className="text-slate-400 w-28 shrink-0 truncate text-[10px]">{pc.phase}</span>
                            <div className="flex-1 h-5 rounded bg-slate-800 overflow-hidden relative">
                              <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6, delay: 0.2 + i * 0.08 }} className="h-full rounded bg-violet-500" />
                              <span className="absolute inset-0 flex items-center px-1.5 text-[8px] text-white/80">{pc.hours}h</span>
                            </div>
                            <span className="text-violet-400 w-20 text-right shrink-0 text-[10px]">${pc.cost.toLocaleString()}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  <div className="lg:w-48 rounded-lg border border-slate-800 bg-slate-900/80 p-4">
                    <div className="text-[10px] text-slate-500 font-medium mb-3">Budget vs Actual</div>
                    <div className="flex items-center justify-center gap-4 mb-3">
                      <div className="flex flex-col items-center">
                        <svg width="44" height="44" viewBox="0 0 44 44" className="-rotate-90">
                          <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="3.5" />
                          <motion.circle cx="22" cy="22" r="18" fill="none" stroke="#22c55e" strokeWidth="3.5" strokeLinecap="round"
                            strokeDasharray={2 * Math.PI * 18} animate={{ strokeDashoffset: 0 }} transition={{ duration: 0.8, delay: 0.3 }} />
                          <text x="22" y="26" textAnchor="middle" fill="#22c55e" fontSize="11" fontWeight="700" fontFamily="monospace" transform="rotate(90 22 22)">100%</text>
                        </svg>
                        <span className="text-[8px] text-slate-500 font-mono mt-1">Budget</span>
                        <span className="text-[9px] text-slate-400 font-mono">${plan.costEstimation.budget.toLocaleString()}</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <svg width="44" height="44" viewBox="0 0 44 44" className="-rotate-90">
                          <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="3.5" />
                          <motion.circle cx="22" cy="22" r="18" fill="none" stroke="#8b5cf6" strokeWidth="3.5" strokeLinecap="round"
                            strokeDasharray={2 * Math.PI * 18} initial={{ strokeDashoffset: 2 * Math.PI * 18 }}
                            animate={{ strokeDashoffset: 2 * Math.PI * 18 * (1 - plan.costEstimation.totalCost / plan.costEstimation.budget) }} transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }} />
                          <text x="22" y="26" textAnchor="middle" fill="#8b5cf6" fontSize="10" fontWeight="700" fontFamily="monospace" transform="rotate(90 22 22)">{Math.round((plan.costEstimation.totalCost / plan.costEstimation.budget) * 100)}%</text>
                        </svg>
                        <span className="text-[8px] text-slate-500 font-mono mt-1">Estimated</span>
                        <span className="text-[9px] text-violet-400 font-mono">${plan.costEstimation.totalCost.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-800">
                      <div className="text-[10px] text-slate-500">Savings</div>
                      <div className="text-lg font-bold text-green-400"><AnimatedCounter value={plan.costEstimation.budget - plan.costEstimation.totalCost} delay={400} /></div>
                      <div className="text-[8px] text-slate-600">{(100 - (plan.costEstimation.totalCost / plan.costEstimation.budget) * 100).toFixed(1)}% under budget</div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={item} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/20 text-xs font-bold text-violet-400">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                  </div>
                  <h2 className="text-sm font-semibold text-white">Risk Forecast</h2>
                  <div className="flex-1" />
                  <span className="text-[9px] text-slate-600">Sprint-by-sprint risk levels</span>
                </div>
                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="space-y-2">
                    {plan.riskForecast.map((rf, i) => {
                      const barColor = rf.risk >= 50 ? 'bg-red-500' : rf.risk >= 35 ? 'bg-amber-500' : 'bg-green-500'
                      return (
                        <div key={i} className="flex items-center gap-3">
                          <span className="text-[9px] text-slate-500 w-20 shrink-0">Sprint {rf.sprint}</span>
                          <div className="flex-1 h-5 rounded bg-slate-800 overflow-hidden relative">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${rf.risk}%` }} transition={{ duration: 0.6, delay: 0.1 * i }} className={`h-full rounded ${barColor}`} />
                            <span className="absolute inset-0 flex items-center px-1.5 text-[8px] text-white/80">{rf.label}</span>
                          </div>
                          <span className={`text-[9px] font-medium w-8 text-right ${rf.risk >= 50 ? 'text-red-400' : rf.risk >= 35 ? 'text-amber-400' : 'text-green-400'}`}>{rf.risk}%</span>
                        </div>
                      )
                    })}
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 mb-2">Probability &times; Impact Matrix</div>
                    <RiskMatrix risks={plan.risks} compact />
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 mt-4 pt-3 border-t border-slate-800">
                  {plan.risks.map((r, i) => {
                    const sevColor = r.severity === 'critical' ? 'bg-red-500/20 border-red-500/30 text-red-400' : r.severity === 'high' ? 'bg-amber-500/20 border-amber-500/30 text-amber-400' : 'bg-violet-500/20 border-violet-500/30 text-violet-400'
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + i * 0.06 }}
                        className="rounded-lg border border-slate-800 bg-slate-900/80 p-2.5 hover:border-violet-500/30 transition-all"
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className={`rounded px-1 py-0.5 text-[7px] font-bold ${sevColor}`}>{r.severity}</span>
                          <span className="text-[8px] text-slate-500">{r.probability}</span>
                        </div>
                        <div className="text-[9px] text-slate-300 mb-1 leading-tight">{r.risk.length > 40 ? r.risk.slice(0, 38) + '...' : r.risk}</div>
                        <div className="text-[7px] text-slate-600 leading-tight">Mitigation: {r.mitigation.length > 50 ? r.mitigation.slice(0, 48) + '...' : r.mitigation}</div>
                        <div className="flex items-center justify-between mt-1 text-[7px] text-slate-600">
                          <span>{r.owner}</span>
                          <span>I:{r.impact} P:{r.likelihood}</span>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </motion.div>

              <motion.div variants={item} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/20 text-xs font-bold text-violet-400">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" /></svg>
                  </div>
                  <h2 className="text-sm font-semibold text-white">AI Recommendations</h2>
                  <div className="flex-1" />
                  <span className="text-[9px] text-slate-600">{plan.recommendations.length} suggestions</span>
                </div>
                <div className="grid gap-2">
                  {plan.recommendations.map((rec, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 * i }} className="rounded-lg border border-slate-800 bg-slate-900/80 p-3 hover:border-violet-500/30 transition-all">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <span className={`rounded px-1.5 py-0.5 text-[8px] font-bold ${
                            rec.priority === 'P0' ? 'bg-red-500/10 text-red-400' :
                            rec.priority === 'P1' ? 'bg-amber-500/10 text-amber-400' :
                            'bg-slate-500/10 text-slate-400'
                          }`}>{rec.priority}</span>
                          <span className="text-xs font-medium text-white truncate">{rec.title}</span>
                        </div>
                        <span className="text-[8px] text-slate-600 bg-slate-800/60 rounded px-1.5 py-0.5 shrink-0">{rec.effort}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 leading-relaxed mb-1">{rec.description}</p>
                      <div className="flex items-center gap-1.5">
                        <svg className="h-3 w-3 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
                        <span className="text-[9px] text-violet-400">{rec.impact}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div variants={item} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/20 text-xs font-bold text-violet-400">
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-sm font-semibold text-white">Delivery Probability</h2>
                  <div className="flex-1" />
                  <StatusBadge status={plan.successProbability >= 80 ? 'success' : plan.successProbability >= 60 ? 'warning' : 'error'} label={`${plan.successProbability}% Confidence`} />
                </div>
                <div className="grid gap-4 lg:grid-cols-[auto_1fr] items-center">
                  <div className="flex flex-col items-center">
                    <ReadinessGauge value={plan.successProbability} label="Delivery Confidence" />
                    <div className="text-[8px] text-slate-600 mt-1">Success probability</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-[10px] text-slate-500 font-medium mb-2">Readiness Checklist</div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {plan.readiness.checks.map((c, i) => (
                        <motion.div
                          key={c.label}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 + i * 0.06 }}
                          className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900/80 p-3"
                        >
                          <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] ${
                            c.pass ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                          }`}>
                            {c.pass ? (
                              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                            ) : (
                              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                            )}
                          </div>
                          <span className="text-xs text-slate-300 flex-1">{c.label}</span>
                          <span className={`text-[9px] font-medium ${c.pass ? 'text-green-400' : 'text-red-400'}`}>{c.pass ? 'Pass' : 'Fail'}</span>
                        </motion.div>
                      ))}
                      <div className="flex items-center gap-3 rounded-lg border border-slate-800 bg-violet-500/5 p-3">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-[10px] text-violet-400">
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <span className="text-xs text-slate-300 flex-1">Overall Readiness</span>
                        <span className="text-[9px] font-medium text-violet-400">{plan.readiness.score}/100</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Layout>
    </PlanErrorBoundary>
  )
}

export { PlanErrorBoundary }