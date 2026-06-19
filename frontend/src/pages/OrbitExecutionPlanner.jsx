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
    totalServices: 4, impactedTeams: 3, completionPct: 42, totalPoints: 34, pointsCompleted: 14, pointsRemaining: 20,
    estimatedHours: 136, hoursLogged: 58, storyPointsTotal: 34, sprintCount: 3, activeSprint: 1, blockers: 2,
    onTrack: true, sprintHealth: 74, velocityTrend: 68, qualityScore: 82, deploymentReadiness: 71,
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
      sprint: 1, name: 'Foundation & Core Logic', status: 'active', daysRemaining: 4, members: ['@alice', '@bob', '@carol'],
      points: { total: 20, completed: 14 }, focus: 'Circuit breaker, retry queue, billing integration',
      items: [
        { title: 'Design circuit breaker state machine review', type: 'docs', priority: 'P2', points: 2, assignee: '@carol', status: 'todo' },
        { title: 'Update billing invoice reconciliation', type: 'feat', priority: 'P1', points: 5, assignee: '@bob', status: 'in_progress' },
        { title: 'Implement circuit breaker pattern', type: 'feat', priority: 'P0', points: 8, assignee: '@alice', status: 'done' },
        { title: 'Add retry queue with bounded limits', type: 'feat', priority: 'P0', points: 5, assignee: '@alice', status: 'done' },
      ],
    },
    {
      sprint: 2, name: 'Integration & Testing', status: 'planned', daysRemaining: 11, members: ['@carol', '@dave', '@eve'],
      points: { total: 13, completed: 2 }, focus: 'Monitoring, integration tests, gateway config',
      items: [
        { title: 'Add retry failure monitoring alerts', type: 'feat', priority: 'P1', points: 3, assignee: '@carol', status: 'todo' },
        { title: 'Set up Grafana retry metrics dashboard', type: 'feat', priority: 'P2', points: 2, assignee: '@carol', status: 'todo' },
        { title: 'Write integration tests for retry scenarios', type: 'test', priority: 'P0', points: 5, assignee: '@dave', status: 'in_progress' },
        { title: 'Update API gateway timeout configuration', type: 'chore', priority: 'P2', points: 3, assignee: '@eve', status: 'done' },
      ],
    },
    {
      sprint: 3, name: 'Hardening & Release', status: 'planned', daysRemaining: 18, members: ['@alice', '@dave', '@eve'],
      points: { total: 9, completed: 1 }, focus: 'Runbook, load tests, production rollout',
      items: [
        { title: 'Run load tests for retry scenarios', type: 'test', priority: 'P1', points: 3, assignee: '@dave', status: 'todo' },
        { title: 'Draft post-release monitoring runbook', type: 'docs', priority: 'P2', points: 2, assignee: '@alice', status: 'todo' },
        { title: 'Create deployment runbook for retry changes', type: 'docs', priority: 'P2', points: 3, assignee: '@alice', status: 'in_progress' },
        { title: 'Review security scan findings', type: 'chore', priority: 'P1', points: 1, assignee: '@eve', status: 'done' },
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
  milestones: [
    { name: 'Design Complete', sprint: 'Sprint 1', status: 'done', desc: 'Circuit breaker and retry queue architecture finalized and reviewed' },
    { name: 'Core Implementation', sprint: 'Sprint 1-2', status: 'in_progress', desc: 'Core retry logic, circuit breaker pattern, billing integration' },
    { name: 'Integration Complete', sprint: 'Sprint 2', status: 'planned', desc: 'Monitoring, integration tests, gateway configuration deployed' },
    { name: 'Staging Deploy', sprint: 'Sprint 2', status: 'planned', desc: 'Full validation suite on staging environment, load tests pass' },
    { name: 'Production Release', sprint: 'Sprint 3', status: 'planned', desc: 'Production rollout with gradual feature flag ramp-up' },
  ],
  effort: {
    totalStoryPoints: 34, engineeringHours: 136, engineers: 4, sprintDuration: '2 weeks', completionPct: 42,
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
    { risk: 'Billing reconciliation delay during rollout', severity: 'medium', mitigation: 'Implement feature flag with gradual rollout (10% -> 50% -> 100%)', owner: 'Billing Team', probability: 'Low', status: 'active' },
  ],
  workItems: [
    { title: 'Implement circuit breaker state machine design', type: 'docs', priority: 'P2', points: 2, assignee: '@carol', sprint: 1, status: 'todo' },
    { title: 'Update billing invoice reconciliation', type: 'feat', priority: 'P1', points: 5, assignee: '@bob', sprint: 1, status: 'in_progress' },
    { title: 'Implement circuit breaker pattern', type: 'feat', priority: 'P0', points: 8, assignee: '@alice', sprint: 1, status: 'done' },
    { title: 'Add retry queue with bounded limits', type: 'feat', priority: 'P0', points: 5, assignee: '@alice', sprint: 1, status: 'done' },
    { title: 'Add retry failure monitoring alerts', type: 'feat', priority: 'P1', points: 3, assignee: '@carol', sprint: 2, status: 'todo' },
    { title: 'Set up Grafana retry metrics dashboard', type: 'feat', priority: 'P2', points: 2, assignee: '@carol', sprint: 2, status: 'todo' },
    { title: 'Write integration tests for retry scenarios', type: 'test', priority: 'P0', points: 5, assignee: '@dave', sprint: 2, status: 'in_progress' },
    { title: 'Update API gateway timeout configuration', type: 'chore', priority: 'P2', points: 3, assignee: '@eve', sprint: 2, status: 'done' },
    { title: 'Run load tests for retry scenarios', type: 'test', priority: 'P1', points: 3, assignee: '@dave', sprint: 3, status: 'todo' },
    { title: 'Draft post-release monitoring runbook', type: 'docs', priority: 'P2', points: 2, assignee: '@alice', sprint: 3, status: 'todo' },
    { title: 'Create deployment runbook for retry changes', type: 'docs', priority: 'P2', points: 3, assignee: '@alice', sprint: 3, status: 'in_progress' },
    { title: 'Review security scan findings', type: 'chore', priority: 'P1', points: 1, assignee: '@eve', sprint: 3, status: 'done' },
  ],
  deployments: [
    { name: 'v2.1.0-canary', env: 'staging', status: 'successful', date: 'Jun 3', duration: '12min', changes: 8, teams: ['Payments', 'Platform'] },
    { name: 'v2.1.0-beta', env: 'staging', status: 'running', date: 'Jun 5', duration: '8min', changes: 6, teams: ['Payments'] },
    { name: 'v2.1.0-rc.1', env: 'staging', status: 'successful', date: 'Jun 8', duration: '15min', changes: 10, teams: ['Payments', 'Billing', 'Platform'] },
    { name: 'v2.1.0-rc.2', env: 'production', status: 'failed', date: 'Jun 10', duration: '4min', changes: 10, teams: ['Payments', 'Billing'] },
    { name: 'v2.1.0', env: 'production', status: 'pending', date: 'Jun 15', duration: '20min', changes: 12, teams: ['Payments', 'Billing', 'Platform'] },
    { name: 'v2.1.1-hotfix', env: 'production', status: 'pending', date: 'Jun 18', duration: '5min', changes: 2, teams: ['Platform'] },
  ],
  blockers: [
    { title: 'Circuit breaker integration test failure', severity: 'critical', status: 'open', owner: '@alice', raisedDate: 'Jun 2', desc: 'Integration test for circuit breaker pattern fails under high concurrency with race condition in state transitions', linkedItems: ['Implement circuit breaker pattern'], progress: 0 },
    { title: 'Retry queue backpressure threshold misconfiguration', severity: 'critical', status: 'open', owner: '@bob', raisedDate: 'Jun 3', desc: 'Retry queue backpressure settings cause premature rejection under normal load patterns', linkedItems: ['Add retry queue with bounded limits'], progress: 15 },
    { title: 'Billing reconciliation API timeout', severity: 'high', status: 'resolving', owner: '@carol', raisedDate: 'Jun 1', desc: 'Invoice reconciliation endpoint times out when processing batches larger than 500 items', linkedItems: ['Update billing invoice reconciliation'], progress: 60 },
    { title: 'Rate limit config conflicts with retry policy', severity: 'high', status: 'open', owner: '@dave', raisedDate: 'Jun 4', desc: 'Rate limit configuration conflicts with retry policy causing 429 errors for legitimate traffic', linkedItems: ['Update API gateway timeout configuration'], progress: 10 },
    { title: 'Staging SSL certificate expired', severity: 'medium', status: 'resolved', owner: '@eve', raisedDate: 'May 28', desc: 'SSL certificate for staging.orbitservices.com expired, blocking deployment pipeline', linkedItems: ['Create deployment runbook for SSL changes'], progress: 100 },
  ],
  features: [
    { name: 'Circuit Breaker Pattern', progress: 100, priority: 'P0', owner: '@alice', sprint: 1, status: 'done' },
    { name: 'Retry Queue with Bounded Limits', progress: 100, priority: 'P0', owner: '@alice', sprint: 1, status: 'done' },
    { name: 'Billing Invoice Reconciliation', progress: 65, priority: 'P1', owner: '@bob', sprint: 1, status: 'in_progress' },
    { name: 'Retry Failure Monitoring Alerts', progress: 45, priority: 'P1', owner: '@carol', sprint: 2, status: 'in_progress' },
    { name: 'Integration Test Suite', progress: 20, priority: 'P0', owner: '@dave', sprint: 2, status: 'in_progress' },
    { name: 'API Gateway Rate Limit Config', progress: 15, priority: 'P2', owner: '@eve', sprint: 2, status: 'todo' },
    { name: 'Deployment Runbook', progress: 30, priority: 'P2', owner: '@alice', sprint: 3, status: 'in_progress' },
    { name: 'Load Testing Suite', progress: 0, priority: 'P1', owner: '@dave', sprint: 3, status: 'todo' },
  ],
  velocity: [
    { sprint: 1, name: 'Sprint 1', points: 18 },
    { sprint: 2, name: 'Sprint 2', points: 13 },
    { sprint: 3, name: 'Sprint 3', points: 6 },
  ],
  readinessChecks: [
    { name: 'Tests Passing', status: 'pass', category: 'Quality' },
    { name: 'Code Review Complete', status: 'pass', category: 'Process' },
    { name: 'Security Scan', status: 'pass', category: 'Security' },
    { name: 'Performance Benchmarks', status: 'fail', category: 'Performance' },
    { name: 'Documentation Updated', status: 'pass', category: 'Process' },
    { name: 'Deployment Runbook Ready', status: 'fail', category: 'Operations' },
  ],
  releases: [
    { milestone: 'Foundation Complete', sprint: 1, date: 'Jun 26', status: 'completed', desc: 'Circuit breaker and retry queue implementation finished' },
    { milestone: 'Integration Complete', sprint: 2, date: 'Jul 3', status: 'planned', desc: 'Monitoring, tests, and gateway configuration deployed' },
    { milestone: 'Staging Validation', sprint: 2, date: 'Jul 7', status: 'planned', desc: 'Full validation suite on staging environment' },
    { milestone: 'Production Release', sprint: 3, date: 'Jul 8', status: 'planned', desc: 'Production rollout of retry support feature' },
    { milestone: 'Post-Release Monitoring', sprint: 3, date: 'Jul 15', status: 'planned', desc: 'Monitor production metrics and address issues' },
  ],
}

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
  const color = pct >= 80 ? '#22c55e' : pct >= 60 ? '#f59e0b' : pct >= 40 ? '#f97316' : '#ef4444'
  const circumference = Math.PI * 60
  const offset = circumference - (pct / 100) * circumference
  return (
    <div className="flex flex-col items-center">
      <svg className="w-24 h-24 sm:w-28 sm:h-28 -rotate-90" viewBox="0 0 136 136">
        <circle cx="68" cy="68" r="60" fill="none" stroke="#1e293b" strokeWidth="10" />
        <circle cx="68" cy="68" r="60" fill="none" stroke={color} strokeWidth="10" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} className="transition-all duration-1000 ease-out" />
      </svg>
      <div className="relative -mt-[68px] flex flex-col items-center">
        <span className="text-2xl font-bold text-white">{pct}<span className="text-sm text-slate-500">%</span></span>
        {sub && <span className="text-[9px] text-slate-600 mt-0.5">{sub}</span>}
      </div>
      {label && <span className="text-[9px] font-medium text-slate-500 mt-1 text-center leading-tight">{label}</span>}
    </div>
  )
}

function AnimatedCounter({ value, suffix = '', decimals = 0, className = '' }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let start = 0
    const duration = 1200
    const step = Math.max(1, Math.floor(value / 30))
    const timer = setInterval(() => {
      start += step
      if (start >= value) { setCount(value); clearInterval(timer) }
      else setCount(start)
    }, duration / (value / step))
    return () => clearInterval(timer)
  }, [value])
  return <span className={className}>{count.toFixed(decimals)}{suffix}</span>
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

function BurndownChart({ totalPoints }) {
  const svgW = 600; const svgH = 200; const pad = { top: 20, right: 20, bottom: 30, left: 40 }
  const chartW = svgW - pad.left - pad.right; const chartH = svgH - pad.top - pad.bottom
  const sprintDays = [0, 5, 10, 14]
  const completedByDay = [0, 8, 13, 14]
  const maxY = totalPoints
  const idealX1 = pad.left; const idealY1 = pad.top
  const idealX2 = pad.left + chartW; const idealY2 = pad.top + chartH
  const actualPoints = sprintDays.map((d, i) => ({ x: pad.left + (d / 14) * chartW, y: pad.top + chartH - (completedByDay[i] / maxY) * chartH }))
  const actualPath = actualPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
  return (
    <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full max-w-full h-auto">
      <line x1={idealX1} y1={idealY1} x2={idealX2} y2={idealY2} stroke="#4b5563" strokeWidth="1.5" strokeDasharray="4 3" />
      <motion.path d={actualPath} fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, ease: 'easeInOut' }} />
      {actualPoints.map((p, i) => (
        <motion.circle key={i} cx={p.x} cy={p.y} r="4" fill="#f59e0b" stroke="#1e293b" strokeWidth="1.5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 + i * 0.2 }} />
      ))}
      {sprintDays.map((d, i) => (
        <text key={i} x={pad.left + (d / 14) * chartW} y={svgH - 6} textAnchor="middle" fill="#64748b" fontSize="9">Day {d}</text>
      ))}
      {[0, maxY / 2, maxY].map((v, i) => (
        <text key={i} x={pad.left - 6} y={pad.top + chartH - (v / maxY) * chartH + 3} textAnchor="end" fill="#64748b" fontSize="9">{v}pts</text>
      ))}
      <text x={idealX2 - 50} y={idealY1 - 6} fill="#4b5563" fontSize="8" fontStyle="italic">Ideal</text>
      <text x={actualPoints[actualPoints.length - 1].x + 6} y={actualPoints[actualPoints.length - 1].y + 3} fill="#f59e0b" fontSize="8" fontStyle="italic">Actual</text>
    </svg>
  )
}

function DeploymentCard({ dep, index }) {
  const envColor = dep.env === 'production' ? 'border-l-purple-500/60 bg-purple-500/[0.03]' : 'border-l-cyan-500/60 bg-cyan-500/[0.03]'
  const statusIcon = dep.status === 'successful' ? 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z' :
    dep.status === 'running' ? 'M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182' :
    dep.status === 'failed' ? 'M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z' :
    'M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z'
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className={`relative rounded-lg border border-white/[0.06] border-l-2 ${envColor} p-3 hover:border-white/[0.12] transition-all`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <svg className={`h-4 w-4 shrink-0 ${
            dep.status === 'successful' ? 'text-emerald-400' :
            dep.status === 'running' ? 'text-amber-400 animate-spin' :
            dep.status === 'failed' ? 'text-red-400' : 'text-slate-500'
          }`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d={statusIcon} />
          </svg>
          <span className="text-xs font-semibold text-white truncate">{dep.name}</span>
        </div>
        <StatusBadge status={dep.status === 'running' ? 'running' : dep.status} label={dep.status} />
      </div>
      <div className="flex items-center gap-3 text-[10px] text-slate-500 flex-wrap">
        <span className={`rounded px-1.5 py-0.5 text-[8px] font-bold ${dep.env === 'production' ? 'bg-purple-500/10 text-purple-400' : 'bg-cyan-500/10 text-cyan-400'}`}>{dep.env}</span>
        <span>{dep.date}</span>
        <span>{dep.duration}</span>
        <span>{dep.changes} changes</span>
        <span className="text-slate-600">Teams: {dep.teams.join(', ')}</span>
      </div>
    </motion.div>
  )
}

function BlockerCard({ blocker, index }) {
  const sevColor = blocker.severity === 'critical' ? 'border-l-red-500/60' : blocker.severity === 'high' ? 'border-l-orange-500/60' : 'border-l-yellow-500/60'
  const sevBg = blocker.severity === 'critical' ? 'bg-red-500/10 text-red-400' : blocker.severity === 'high' ? 'bg-orange-500/10 text-orange-400' : 'bg-yellow-500/10 text-yellow-400'
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className={`rounded-lg border border-white/[0.06] border-l-2 ${sevColor} p-3.5 hover:border-white/[0.12] transition-all`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <svg className={`h-3.5 w-3.5 shrink-0 ${
            blocker.severity === 'critical' ? 'text-red-400' : blocker.severity === 'high' ? 'text-orange-400' : 'text-yellow-400'
          }`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <span className="text-xs font-semibold text-slate-200 truncate">{blocker.title}</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className={`rounded px-1.5 py-0.5 text-[8px] font-bold ${sevBg}`}>{blocker.severity}</span>
          <StatusBadge status={blocker.status === 'resolved' ? 'success' : blocker.status === 'resolving' ? 'warning' : 'critical'} label={blocker.status} />
        </div>
      </div>
      <p className="text-[10px] text-slate-500 mb-2 leading-relaxed">{blocker.desc}</p>
      <div className="flex items-center gap-3 text-[9px] text-slate-600 mb-2 flex-wrap">
        <span>Owner: {blocker.owner}</span>
        <span>Raised: {blocker.raisedDate}</span>
        <span>Linked: {blocker.linkedItems.join(', ')}</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <div className="flex justify-between text-[8px] text-slate-600 mb-1"><span>Resolution Progress</span><span>{blocker.progress}%</span></div>
          <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${blocker.progress}%` }} transition={{ duration: 0.8, delay: index * 0.1 }} className={`h-full rounded-full ${blocker.progress >= 100 ? 'bg-emerald-500' : blocker.progress >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} />
          </div>
        </div>
        {blocker.status !== 'resolved' && (
          <div className="flex gap-1">
            <button className="rounded bg-white/[0.06] px-2 py-1 text-[8px] font-medium text-slate-400 hover:bg-white/[0.1] hover:text-white transition-colors">Resolve</button>
            <button className="rounded bg-white/[0.06] px-2 py-1 text-[8px] font-medium text-slate-400 hover:bg-white/[0.1] hover:text-white transition-colors">Assign</button>
          </div>
        )}
      </div>
    </motion.div>
  )
}

function FeatureCard({ feature, index }) {
  const priorityColor = feature.priority === 'P0' ? 'bg-red-500/10 text-red-400' : feature.priority === 'P1' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-slate-500/10 text-slate-400'
  const statusColor = feature.status === 'done' ? 'text-emerald-400' : feature.status === 'in_progress' ? 'text-amber-400' : 'text-slate-500'
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 hover:border-amber-500/20 transition-all"
    >
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${feature.status === 'done' ? 'bg-emerald-500' : feature.status === 'in_progress' ? 'bg-amber-500' : 'bg-slate-600'}`} />
          <span className="text-xs font-medium text-slate-200 truncate">{feature.name}</span>
          <span className={`rounded px-1.5 py-0.5 text-[7px] font-bold shrink-0 ${priorityColor}`}>{feature.priority}</span>
        </div>
        <span className="text-[9px] text-slate-600 shrink-0">{feature.progress}%</span>
      </div>
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-[9px] text-slate-600">{feature.owner}</span>
        <span className={`text-[9px] ${statusColor}`}>{feature.status.replace('_', ' ')}</span>
        <span className="text-[9px] text-slate-700">Sprint {feature.sprint}</span>
      </div>
      <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${feature.progress}%` }} transition={{ duration: 0.6, delay: index * 0.05 }} className={`h-full rounded-full ${feature.progress >= 100 ? 'bg-emerald-500' : feature.progress >= 50 ? 'bg-amber-500' : 'bg-slate-600'}`} />
      </div>
    </motion.div>
  )
}

function VelocityChart({ velocity, avgVelocity }) {
  const maxPts = Math.max(...velocity.map(v => v.points), 20)
  const barW = 40; const gap = 16; const chartH = 140
  return (
    <svg viewBox={`0 0 ${velocity.length * (barW + gap) + 40} ${chartH + 40}`} className="w-full max-w-full h-auto">
      <line x1="30" y1={chartH} x2={velocity.length * (barW + gap) + 30} y2={chartH} stroke="#334155" strokeWidth="1" />
      {[0, Math.round(maxPts / 2), maxPts].map((v, i) => (
        <text key={i} x="28" y={chartH - (v / maxPts) * chartH + 3} textAnchor="end" fill="#64748b" fontSize="9">{v}</text>
      ))}
      <line x1="30" y1={chartH - (avgVelocity / maxPts) * chartH} x2={velocity.length * (barW + gap) + 30} y2={chartH - (avgVelocity / maxPts) * chartH} stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 2" opacity="0.5" />
      <text x={velocity.length * (barW + gap) + 32} y={chartH - (avgVelocity / maxPts) * chartH + 2} fill="#f59e0b" fontSize="8" opacity="0.6">avg</text>
      {velocity.map((v, i) => {
        const barH = (v.points / maxPts) * chartH
        const x = 32 + i * (barW + gap)
        return (
          <g key={i}>
            <motion.rect x={x} y={chartH - barH} width={barW} height={barH} rx="3" fill="#f59e0b" fillOpacity="0.8" initial={{ height: 0, y: chartH }} animate={{ height: barH, y: chartH - barH }} transition={{ duration: 0.6, delay: i * 0.1 }} />
            <text x={x + barW / 2} y={chartH - barH - 5} textAnchor="middle" fill="#e2e8f0" fontSize="11" fontWeight="bold">{v.points}</text>
            <text x={x + barW / 2} y={chartH + 14} textAnchor="middle" fill="#64748b" fontSize="9">{v.name}</text>
          </g>
        )
      })}
    </svg>
  )
}

const container = { hidden: {}, show: { transition: { staggerChildren: 0.03 } } }
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }

const sections = [
  { id: 'dashboard', label: 'Sprint Dashboard', icon: 'M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z' },
  { id: 'kanban', label: 'Kanban Board', icon: 'M9 4.5v7.5m0 0v7.5m0-7.5h7.5m-7.5 0H6' },
  { id: 'progress', label: 'Progress & Milestones', icon: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z' },
  { id: 'team', label: 'Team & Blockers', icon: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z' },
  { id: 'readiness', label: 'Release Readiness', icon: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { id: 'deploy', label: 'Deployments', icon: 'M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z' },
  { id: 'forecast', label: 'Delivery Forecast', icon: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z' },
]

export default function OrbitExecutionPlanner() {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)
  const [showPresets, setShowPresets] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState(-1)
  const [activeSection, setActiveSection] = useState('dashboard')
  const inputRef = useRef(null)

  const filtered = input.trim() ? presets.filter(p => p.toLowerCase().includes(input.toLowerCase())) : presets

  const generate = (text) => {
    if (!text.trim()) return
    setLoading(true)
    setData(null)
    setActiveSection('dashboard')
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
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl text-white">Orbit Mission Control</h1>
                <p className="text-sm text-slate-500">Enterprise delivery command center</p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={item} className="relative">
            <div className="rounded-xl border border-white/[0.08] bg-slate-900/80 backdrop-blur-2xl p-4 sm:p-5">
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
                        <><svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Analyzing</>
                      ) : (
                        <><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>Generate Plan</>
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
            <p className="text-sm text-slate-600 max-w-md mx-auto">Enter a feature above to load its execution plan. Monitor progress across sprints, services, and teams with real-time dashboards, kanban boards, milestones, deployment timelines, and blocker tracking.</p>
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
            <div className="grid gap-4 sm:grid-cols-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-white/[0.06] bg-slate-950/50 p-4 animate-pulse">
                  <div className="h-3 w-16 bg-slate-800 rounded mb-3" /><div className="h-7 w-12 bg-slate-800 rounded mb-2" /><div className="h-2 bg-slate-800 rounded" />
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-white/[0.06] bg-slate-950/50 p-5 animate-pulse"><div className="h-3 w-48 bg-slate-800 rounded mb-4" />{Array.from({ length: 4 }).map((_, j) => (<div key={j} className="h-12 bg-slate-800 rounded mb-2" />))}</div>
          </motion.div>
        )}

        <AnimatePresence>
          {data && !loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              {/* ===== 10. EXECUTIVE SUMMARY ===== */}
              <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-gradient-to-br from-slate-950 to-slate-950/50 p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 border border-amber-500/20">
                      <svg className="h-5 w-5 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" /></svg>
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs text-slate-500">Execution Plan for</div>
                      <h2 className="text-lg sm:text-xl font-bold text-white truncate">&ldquo;{input}&rdquo;</h2>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <StatusBadge status={data.overview.onTrack ? 'success' : 'error'} label={data.overview.onTrack ? 'On Track' : 'At Risk'} />
                    <StatusBadge status="info" label={`${data.overview.completionPct}% Complete`} />
                    <StatusBadge status={data.overview.blockers > 0 ? 'critical' : 'safe'} label={`${data.overview.blockers} Blocker${data.overview.blockers !== 1 ? 's' : ''}`} />
                  </div>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
                  {[
                    { label: 'Overall Progress', value: data.overview.completionPct, color: 'text-amber-300', suffix: '%', bar: true },
                    { label: 'Total Sprints', value: data.overview.sprintCount, color: 'text-blue-400', icon: 'M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6z' },
                    { label: 'Active Teams', value: data.overview.impactedTeams, color: 'text-emerald-400', icon: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z' },
                    { label: 'Story Points', value: data.overview.storyPointsTotal, color: 'text-purple-400', icon: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z' },
                    { label: 'Points Done', value: data.overview.pointsCompleted, color: 'text-cyan-400', icon: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
                    { label: 'Trend', value: data.overview.onTrack ? 'ON' : 'OFF', color: data.overview.onTrack ? 'text-emerald-400' : 'text-red-400', suffix: data.overview.onTrack ? ' TRACK' : ' TRACK' },
                  ].map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + i * 0.05 }}
                      className="rounded-xl border border-white/[0.06] bg-gradient-to-b from-slate-900/80 to-slate-900/40 p-3 backdrop-blur-xl hover:border-amber-500/20 transition-all group"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {stat.icon && <svg className="h-3 w-3 text-slate-600 group-hover:text-amber-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={stat.icon} /></svg>}
                        <span className="text-[9px] text-slate-500 uppercase tracking-wider">{stat.label}</span>
                      </div>
                      <div className={`text-xl sm:text-2xl font-bold ${stat.color}`}>
                        <AnimatedCounter value={typeof stat.value === 'number' ? stat.value : 0} suffix={stat.suffix || ''} />
                        {typeof stat.value === 'string' && <span>{stat.value}</span>}
                      </div>
                      {stat.bar && (
                        <div className="mt-1.5 h-1 rounded-full bg-slate-800 overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${stat.value}%` }} transition={{ duration: 0.8, delay: 0.5 + i * 0.05 }} className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Section Navigation */}
              <motion.div variants={item} className="flex gap-1 rounded-xl border border-white/[0.06] bg-slate-900/60 p-1 overflow-x-auto">
                {sections.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setActiveSection(s.id)}
                    className={`flex items-center gap-1.5 rounded-lg px-3 sm:px-4 py-2 text-xs font-medium transition-all whitespace-nowrap ${
                      activeSection === s.id
                        ? 'bg-gradient-to-r from-amber-500/15 to-orange-600/15 text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={s.icon} />
                    </svg>
                    {s.label}
                  </button>
                ))}
              </motion.div>

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                {/* ===== 1. SPRINT DASHBOARD ===== */}
                {activeSection === 'dashboard' && (
                  <motion.div key="dashboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.15 }} className="space-y-6">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { label: 'Sprint Health', value: data.overview.sprintHealth, sub: 'current sprint' },
                        { label: 'Velocity Trend', value: data.overview.velocityTrend, sub: '3-sprint avg' },
                        { label: 'Quality Score', value: data.overview.qualityScore, sub: 'test pass rate' },
                        { label: 'Deployment Readiness', value: data.overview.deploymentReadiness, sub: 'release gate' },
                      ].map((g, i) => (
                        <motion.div key={g.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }} className="rounded-xl border border-white/[0.06] bg-slate-950/50 p-3 flex flex-col items-center">
                          <AnimatedGauge value={g.value} label={g.label} sub={g.sub} />
                        </motion.div>
                      ))}
                    </div>

                    <div className="rounded-xl border border-white/[0.06] bg-slate-950/50 p-5">
                      <h3 className="text-sm font-semibold text-white mb-4">Sprint Overview</h3>
                      <div className="grid gap-4 sm:grid-cols-3">
                        {data.sprints.map(s => {
                          const pct = s.points.total > 0 ? Math.round((s.points.completed / s.points.total) * 100) : 0
                          return (
                            <motion.div key={s.sprint} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: s.sprint * 0.06 }} className={`rounded-lg border p-4 ${s.status === 'active' ? 'border-amber-500/30 bg-amber-500/[0.04]' : s.status === 'completed' ? 'border-emerald-500/20 bg-emerald-500/[0.03]' : 'border-white/[0.06] bg-white/[0.02]'}`}>
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <span className={`h-2 w-2 rounded-full ${s.status === 'active' ? 'bg-amber-500 animate-pulse' : s.status === 'completed' ? 'bg-emerald-500' : 'bg-slate-600'}`} />
                                  <span className="text-xs font-bold text-white">{s.name}</span>
                                </div>
                                <StatusBadge status={s.status === 'active' ? 'running' : s.status} label={s.status === 'active' ? `Day ${14 - s.daysRemaining}` : 'Planned'} />
                              </div>
                              <div className="grid grid-cols-2 gap-2 mb-3 text-[10px] text-slate-500">
                                <span>{s.points.completed}/{s.points.total} points</span>
                                <span className="text-right">{s.daysRemaining}d remaining</span>
                                <span>{s.members.length} members</span>
                                <span className="text-right">{pct}% done</span>
                              </div>
                              <AnimatedProgress value={pct} color={s.status === 'completed' ? 'bg-emerald-500' : 'bg-amber-500'} size="sm" />
                              <div className="flex items-center gap-1 mt-2">
                                {s.members.map(m => (
                                  <span key={m} className="rounded-full bg-slate-800 px-1.5 py-0.5 text-[8px] text-slate-400 font-mono">{m}</span>
                                ))}
                              </div>
                            </motion.div>
                          )
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ===== 2. KANBAN BOARD ===== */}
                {activeSection === 'kanban' && (
                  <motion.div key="kanban" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.15 }} className="space-y-6">
                    {data.sprints.map(s => {
                      const todo = s.items.filter(w => w.status === 'todo')
                      const inProgress = s.items.filter(w => w.status === 'in_progress')
                      const done = s.items.filter(w => w.status === 'done')
                      const pct = s.points.total > 0 ? Math.round((s.points.completed / s.points.total) * 100) : 0
                      return (
                        <motion.div key={s.sprint} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: s.sprint * 0.05 }} className="rounded-xl border border-white/[0.06] bg-slate-950/30 p-4 sm:p-5">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <span className={`h-2.5 w-2.5 rounded-full ${s.status === 'active' ? 'bg-amber-500 animate-pulse' : s.status === 'completed' ? 'bg-emerald-500' : 'bg-slate-600'}`} />
                              <div>
                                <h3 className="text-sm font-bold text-white">Sprint {s.sprint}: {s.name}</h3>
                                <p className="text-[10px] text-slate-600">{s.focus}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <StatusBadge status={s.status === 'active' ? 'running' : s.status === 'completed' ? 'success' : 'pending'} label={s.status === 'active' ? `${s.daysRemaining}d left` : s.status} />
                              <span className="text-[10px] text-slate-500">{s.points.completed}/{s.points.total} pts</span>
                            </div>
                          </div>
                          <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden mb-4">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6 }} className={`h-full rounded-full ${s.status === 'completed' ? 'bg-emerald-500' : 'bg-gradient-to-r from-amber-500 to-orange-500'}`} />
                          </div>
                          <div className="grid gap-3 sm:grid-cols-3">
                            <div className="rounded-xl border border-white/[0.06] bg-slate-950/40 p-3 min-h-[200px]">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <span className="h-2 w-2 rounded-full bg-slate-500" />
                                  <h4 className="text-[10px] font-semibold text-slate-400 uppercase">To Do</h4>
                                </div>
                                <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[9px] text-slate-500">{todo.length} item{todo.length !== 1 ? 's' : ''}</span>
                              </div>
                              <div className="space-y-1.5">
                                {todo.length > 0 ? todo.map((item, i) => <WorkItemCard key={item.title} item={item} />) : (
                                  <div className="flex flex-col items-center justify-center h-24 text-slate-600 text-[10px]"><svg className="h-6 w-6 mb-1 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 11.625l2.25-2.25M12 11.625l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>No items</div>
                                )}
                              </div>
                            </div>
                            <div className="rounded-xl border border-white/[0.06] bg-slate-950/40 p-3 min-h-[200px]">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                                  <h4 className="text-[10px] font-semibold text-amber-400 uppercase">In Progress</h4>
                                </div>
                                <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[9px] text-slate-500">{inProgress.length} item{inProgress.length !== 1 ? 's' : ''}</span>
                              </div>
                              <div className="space-y-1.5">
                                {inProgress.length > 0 ? inProgress.map((item, i) => <WorkItemCard key={item.title} item={item} />) : (
                                  <div className="flex flex-col items-center justify-center h-24 text-slate-600 text-[10px]"><svg className="h-6 w-6 mb-1 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>No items</div>
                                )}
                              </div>
                            </div>
                            <div className="rounded-xl border border-white/[0.06] bg-slate-950/40 p-3 min-h-[200px]">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                  <h4 className="text-[10px] font-semibold text-emerald-400 uppercase">Done</h4>
                                </div>
                                <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[9px] text-slate-500">{done.length} item{done.length !== 1 ? 's' : ''}</span>
                              </div>
                              <div className="space-y-1.5">
                                {done.length > 0 ? done.map((item, i) => <WorkItemCard key={item.title} item={item} />) : (
                                  <div className="flex flex-col items-center justify-center h-24 text-slate-600 text-[10px]"><svg className="h-6 w-6 mb-1 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>No items</div>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </motion.div>
                )}

                {/* ===== 3. PROGRESS TRACKER + 4. MILESTONES ===== */}
                {activeSection === 'progress' && (
                  <motion.div key="progress" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.15 }} className="space-y-6">
                    <div className="rounded-xl border border-white/[0.06] bg-slate-950/50 p-5">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-white">Feature Progress Tracker</h3>
                        <span className="text-[10px] text-slate-500">{Math.round(data.features.reduce((a, f) => a + f.progress, 0) / data.features.length)}% overall completion</span>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {data.features.map((f, i) => <FeatureCard key={f.name} feature={f} index={i} />)}
                      </div>
                    </div>

                    <div className="rounded-xl border border-white/[0.06] bg-slate-950/50 p-5">
                      <h3 className="text-sm font-semibold text-white mb-5">Milestone Timeline</h3>
                      <div className="relative">
                        <div className="absolute left-[19px] top-3 bottom-3 w-0.5 bg-slate-800" />
                        <div className="space-y-0">
                          {data.milestones.map((m, i) => {
                            const statusColor = m.status === 'done' ? 'border-emerald-500 bg-emerald-500' : m.status === 'in_progress' ? 'border-amber-500 bg-amber-500' : 'border-slate-600 bg-slate-800'
                            const glowColor = m.status === 'done' ? 'shadow-emerald-500/30' : m.status === 'in_progress' ? 'shadow-amber-500/30' : 'shadow-transparent'
                            return (
                              <motion.div
                                key={m.name}
                                initial={{ opacity: 0, x: -15 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.08 }}
                                className="relative flex items-start gap-5 pb-8 last:pb-0"
                              >
                                <div className={`relative z-10 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-sm border-2 ${statusColor} shadow-lg ${glowColor} rotate-45 mt-1`}>
                                  {m.status === 'done' && (
                                    <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, delay: 0.3 + i * 0.1 }} className="h-3 w-3 -rotate-45 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </motion.svg>
                                  )}
                                  {m.status === 'in_progress' && (
                                    <motion.div animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.5, repeat: Infinity }} className="h-1.5 w-1.5 -rotate-45 rounded-full bg-white" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0 -mt-0.5">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-sm font-semibold text-slate-200">{m.name}</span>
                                    <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[8px] font-medium text-slate-500">{m.sprint}</span>
                                    <StatusBadge status={m.status === 'done' ? 'success' : m.status === 'in_progress' ? 'running' : 'pending'} label={m.status === 'in_progress' ? 'In Progress' : m.status === 'done' ? 'Done' : 'Planned'} />
                                  </div>
                                  <p className="text-[10px] text-slate-600 mt-1">{m.desc}</p>
                                </div>
                              </motion.div>
                            )
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl border border-white/[0.06] bg-slate-950/50 p-5">
                      <h3 className="text-sm font-semibold text-white mb-4">Timeline View</h3>
                      <div className="space-y-1">
                        {data.timeline.map((p, i) => (
                          <motion.div key={p.phase} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="flex items-center gap-3 py-1.5">
                            <div className="flex items-center gap-2 w-36 shrink-0">
                              <span className={`h-2 w-2 rounded-full shrink-0 ${p.status === 'completed' ? 'bg-emerald-500' : p.status === 'in_progress' ? 'bg-amber-500' : 'bg-slate-700'}`} />
                              <span className="text-[10px] font-medium text-slate-300 truncate">{p.phase}</span>
                            </div>
                            <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden">
                              <motion.div initial={{ width: 0 }} animate={{ width: `${p.progress}%` }} transition={{ duration: 0.6, delay: i * 0.06 }} className={`h-full rounded-full ${p.status === 'completed' ? 'bg-emerald-500' : p.status === 'in_progress' ? 'bg-amber-500' : 'bg-slate-700'}`} />
                            </div>
                            <span className="text-[9px] text-slate-600 w-16 text-right shrink-0">{p.duration}</span>
                            <StatusBadge status={p.status === 'in_progress' ? 'running' : p.status === 'completed' ? 'success' : 'pending'} label={p.status === 'in_progress' ? 'Active' : p.status} />
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ===== 5. TEAM WORKLOAD + 6. BLOCKERS ===== */}
                {activeSection === 'team' && (
                  <motion.div key="team" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.15 }} className="space-y-6">
                    <div className="rounded-xl border border-white/[0.06] bg-slate-950/50 p-5">
                      <h3 className="text-sm font-semibold text-white mb-4">Team Capacity & Workload</h3>
                      <div className="grid gap-4 sm:grid-cols-3">
                        {data.teams.map((t, i) => {
                          const loadPct = t.sprintPoints > 0 ? Math.round((t.completedPoints / t.sprintPoints) * 100) : 0
                          const isOverloaded = t.load >= 80
                          return (
                            <motion.div
                              key={t.name}
                              initial={{ opacity: 0, y: 15 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.06 }}
                              className={`rounded-lg border p-4 ${isOverloaded ? 'border-red-500/30 bg-red-500/[0.04]' : 'border-white/[0.06] bg-white/[0.02]'}`}
                            >
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${
                                    i === 0 ? 'bg-amber-500/20 text-amber-300' : i === 1 ? 'bg-blue-500/20 text-blue-300' : 'bg-emerald-500/20 text-emerald-300'
                                  }`}>{t.name[0]}</div>
                                  <div>
                                    <div className="text-sm font-semibold text-white">{t.name}</div>
                                    <div className="text-[9px] text-slate-600">{t.role}</div>
                                  </div>
                                </div>
                                {isOverloaded && (
                                  <span className="rounded bg-red-500/10 px-1.5 py-0.5 text-[8px] font-bold text-red-400 animate-pulse">OVERLOADED</span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-[10px] text-slate-500 mb-2">
                                <span>{t.members} members</span>
                                <span className="text-slate-700">·</span>
                                <span>Lead: {t.lead}</span>
                              </div>
                              <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1.5">
                                <span>{t.completedPoints}/{t.sprintPoints} sprint pts</span>
                                <span className={isOverloaded ? 'text-red-400 font-bold' : t.load >= 60 ? 'text-yellow-400' : 'text-emerald-400'}>{t.load}% load</span>
                              </div>
                              <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${loadPct}%` }}
                                  transition={{ duration: 0.6, delay: i * 0.08 }}
                                  className={`h-full rounded-full ${t.load >= 80 ? 'bg-red-500' : t.load >= 60 ? 'bg-yellow-500' : 'bg-emerald-500'}`}
                                />
                              </div>
                              <div className="mt-2 h-1 rounded-full bg-slate-800/50 overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${t.load}%` }}
                                  transition={{ duration: 0.6, delay: i * 0.1 }}
                                  className={`h-full rounded-full ${t.load >= 80 ? 'bg-red-500/50' : t.load >= 60 ? 'bg-yellow-500/50' : 'bg-emerald-500/50'}`}
                                />
                              </div>
                            </motion.div>
                          )
                        })}
                      </div>
                    </div>

                    <div className="rounded-xl border border-white/[0.06] bg-slate-950/50 p-5">
                      <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-2">
                          <svg className="h-4 w-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                          </svg>
                          <h3 className="text-sm font-semibold text-white">Blockers & Impediments</h3>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500">
                          <StatusBadge status="critical" label={`${data.blockers.filter(b => b.severity === 'critical').length} critical`} />
                          <StatusBadge status="warning" label={`${data.blockers.filter(b => b.status === 'open').length} open`} />
                        </div>
                      </div>
                      <div className="space-y-3">
                        {data.blockers.map((b, i) => <BlockerCard key={b.title} blocker={b} index={i} />)}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ===== 7. RELEASE READINESS + 8. DEPLOYMENT TIMELINE ===== */}
                {activeSection === 'readiness' && (
                  <motion.div key="readiness" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.15 }} className="space-y-6">
                    <div className="rounded-xl border border-white/[0.06] bg-slate-950/50 p-5">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-white">Release Readiness Checks</h3>
                        <StatusBadge status={data.readinessChecks.every(c => c.status === 'pass') ? 'success' : 'warning'} label={`${data.readinessChecks.filter(c => c.status === 'pass').length}/${data.readinessChecks.length} checks passed`} />
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {data.readinessChecks.map((c, i) => (
                          <motion.div
                            key={c.name}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.04 }}
                            className={`rounded-lg border p-4 flex items-center gap-3 transition-all ${
                              c.status === 'pass' ? 'border-emerald-500/20 bg-emerald-500/[0.03]' : 'border-red-500/20 bg-red-500/[0.03]'
                            }`}
                          >
                            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                              c.status === 'pass' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                            }`}>
                              {c.status === 'pass' ? (
                                <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, delay: 0.3 + i * 0.05 }} className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </motion.svg>
                              ) : (
                                <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, delay: 0.3 + i * 0.05 }} className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </motion.svg>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-xs font-medium text-slate-200 truncate">{c.name}</div>
                              <div className="text-[9px] text-slate-600">{c.category}</div>
                            </div>
                            <span className={`text-[10px] font-bold shrink-0 ${c.status === 'pass' ? 'text-emerald-400' : 'text-red-400'}`}>{c.status === 'pass' ? 'PASS' : 'FAIL'}</span>
                          </motion.div>
                        ))}
                      </div>
                      <div className="mt-4 pt-4 border-t border-white/[0.06]">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] text-slate-600">Overall Readiness</span>
                            <span className="text-lg font-bold text-white">{Math.round((data.readinessChecks.filter(c => c.status === 'pass').length / data.readinessChecks.length) * 100)}%</span>
                          </div>
                          <div className="w-48">
                            <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(data.readinessChecks.filter(c => c.status === 'pass').length / data.readinessChecks.length) * 100}%` }}
                                transition={{ duration: 1 }}
                                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-2">
                      <div className="rounded-xl border border-white/[0.06] bg-slate-950/50 p-5">
                        <h3 className="text-sm font-semibold text-white mb-4">Services Risk Assessment</h3>
                        <div className="space-y-2">
                          {data.services.map((s, i) => (
                            <motion.div key={s.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }} className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 hover:border-amber-500/20 transition-colors">
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                <div className={`h-8 w-8 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0 ${
                                  i === 0 ? 'bg-red-500/20 text-red-300' : i === 1 ? 'bg-orange-500/20 text-orange-300' : i === 2 ? 'bg-yellow-500/20 text-yellow-300' : 'bg-blue-500/20 text-blue-300'
                                }`}>{s.name[0]}</div>
                                <div className="min-w-0">
                                  <div className="text-xs font-medium text-white">{s.name}</div>
                                  <div className="text-[9px] text-slate-600 truncate">{s.changes}</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 shrink-0 ml-2">
                                <div className="w-20">
                                  <div className="flex justify-between text-[8px] text-slate-600 mb-0.5"><span>Risk</span><span>{s.risk}%</span></div>
                                  <div className="h-1 rounded-full bg-slate-800 overflow-hidden">
                                    <motion.div initial={{ width: 0 }} animate={{ width: `${s.risk}%` }} transition={{ duration: 0.6, delay: i * 0.05 }} className={`h-full rounded-full ${s.risk >= 80 ? 'bg-red-500' : s.risk >= 60 ? 'bg-orange-500' : 'bg-yellow-500'}`} />
                                  </div>
                                </div>
                                <span className={`rounded px-1.5 py-0.5 text-[8px] font-bold ${
                                  s.impact === 'critical' ? 'bg-red-500/10 text-red-400' : s.impact === 'high' ? 'bg-orange-500/10 text-orange-400' : 'bg-yellow-500/10 text-yellow-400'
                                }`}>{s.impact}</span>
                                <StatusBadge status={s.status === 'in_progress' ? 'running' : s.status} label={s.status === 'in_progress' ? 'Active' : s.status} />
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-xl border border-white/[0.06] bg-slate-950/50 p-5">
                        <h3 className="text-sm font-semibold text-white mb-4">Release Calendar</h3>
                        <div className="relative">
                          <div className="absolute left-[15px] top-2 bottom-2 w-px bg-slate-800" />
                          <div className="space-y-4">
                            {data.releases.map((r, i) => (
                              <motion.div key={r.milestone} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="relative flex items-start gap-4 pl-8">
                                <div className={`absolute left-[8px] top-1.5 h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                                  r.status === 'completed' ? 'border-emerald-500 bg-emerald-500/20' : 'border-slate-600 bg-slate-800'
                                }`}>
                                  {r.status === 'completed' && <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-xs font-medium text-slate-200">{r.milestone}</span>
                                    <StatusBadge status={r.status === 'completed' ? 'success' : 'pending'} label={r.status} />
                                    <span className="text-[9px] text-slate-600">Sprint {r.sprint}</span>
                                    <span className="text-[9px] text-slate-700">{r.date}</span>
                                  </div>
                                  <p className="text-[10px] text-slate-500 mt-0.5">{r.desc}</p>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ===== 8. DEPLOYMENT TIMELINE ===== */}
                {activeSection === 'deploy' && (
                  <motion.div key="deploy" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.15 }} className="space-y-6">
                    <div className="rounded-xl border border-white/[0.06] bg-slate-950/50 p-5">
                      <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-2">
                          <svg className="h-4 w-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                          </svg>
                          <h3 className="text-sm font-semibold text-white">Deployment Timeline</h3>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500">
                          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Success</span>
                          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" /> Running</span>
                          <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-red-500" /> Failed</span>
                        </div>
                      </div>
                      <div className="relative">
                        <div className="absolute left-[18px] top-3 bottom-3 w-px bg-gradient-to-b from-emerald-500/40 via-amber-500/40 to-slate-700/40" />
                        <div className="space-y-3">
                          {data.deployments.map((dep, i) => (
                            <div key={dep.name} className="relative pl-12">
                              <div className={`absolute left-[10px] top-3 h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                                dep.status === 'successful' ? 'border-emerald-500 bg-emerald-500/20' :
                                dep.status === 'running' ? 'border-amber-500 bg-amber-500/20' :
                                dep.status === 'failed' ? 'border-red-500 bg-red-500/20' :
                                'border-slate-600 bg-slate-800'
                              }`}>
                                <div className={`h-2 w-2 rounded-full ${
                                  dep.status === 'successful' ? 'bg-emerald-500' :
                                  dep.status === 'running' ? 'bg-amber-500 animate-pulse' :
                                  dep.status === 'failed' ? 'bg-red-500' :
                                  'bg-slate-600'
                                }`} />
                              </div>
                              <DeploymentCard dep={dep} index={i} />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: 'Total Deployments', value: data.deployments.length, color: 'text-white' },
                        { label: 'Successful', value: data.deployments.filter(d => d.status === 'successful').length, color: 'text-emerald-400' },
                        { label: 'Failed', value: data.deployments.filter(d => d.status === 'failed').length, color: 'text-red-400' },
                      ].map((s, i) => (
                        <div key={s.label} className="rounded-xl border border-white/[0.06] bg-slate-950/50 p-4 text-center">
                          <div className="text-[9px] text-slate-600 uppercase tracking-wider mb-1">{s.label}</div>
                          <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* ===== 9. DELIVERY FORECAST ===== */}
                {activeSection === 'forecast' && (
                  <motion.div key="forecast" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.15 }} className="space-y-6">
                    <div className="rounded-xl border border-white/[0.06] bg-slate-950/50 p-5">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-white">Sprint Burndown</h3>
                        <div className="flex items-center gap-3 text-[10px] text-slate-500">
                          <span className="flex items-center gap-1"><span className="h-0.5 w-3 bg-amber-500" /> Actual</span>
                          <span className="flex items-center gap-1"><span className="h-0.5 w-3 border-b border-dashed border-slate-500" /> Ideal</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-3 mb-4">
                        {[
                          { label: 'Total Points', value: data.overview.totalPoints, color: 'text-white' },
                          { label: 'Remaining', value: data.overview.pointsRemaining, color: 'text-orange-400' },
                          { label: 'Completed', value: data.overview.pointsCompleted, color: 'text-emerald-400' },
                          { label: 'On Track', value: data.overview.onTrack ? 'Yes' : 'No', color: data.overview.onTrack ? 'text-emerald-400' : 'text-red-400' },
                        ].map((s, i) => (
                          <div key={s.label} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 text-center">
                            <div className="text-[9px] text-slate-600 mb-0.5">{s.label}</div>
                            <div className={`text-lg font-bold ${s.color}`}>{s.value}</div>
                          </div>
                        ))}
                      </div>
                      <BurndownChart totalPoints={data.overview.totalPoints} />
                    </div>

                    <div className="rounded-xl border border-white/[0.06] bg-slate-950/50 p-5">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-white">Velocity Chart</h3>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500">
                          <span className="flex items-center gap-1"><span className="h-1.5 w-3 rounded bg-amber-500/60" /> Actual</span>
                          <span className="flex items-center gap-1"><span className="h-0.5 w-3 border-b border-dashed border-amber-500/50" /> Avg</span>
                        </div>
                      </div>
                      <VelocityChart velocity={data.velocity} avgVelocity={Math.round(data.velocity.reduce((a, v) => a + v.points, 0) / data.velocity.length)} />
                      <div className="grid grid-cols-3 gap-3 mt-4">
                        {data.velocity.map((v, i) => (
                          <div key={v.sprint} className="text-center rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                            <div className="text-[9px] text-slate-600">Sprint {v.sprint}</div>
                            <div className="text-xl font-bold text-white">{v.points}</div>
                            <div className="text-[8px] text-slate-600">points</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-xl border border-white/[0.06] bg-slate-950/50 p-5">
                      <div className="flex items-center gap-2 mb-4">
                        <h3 className="text-sm font-semibold text-white">Risk Mitigation Plan</h3>
                        <StatusBadge status={data.risks.some(r => r.severity === 'critical') ? 'critical' : 'safe'} label={`${data.risks.filter(r => r.status === 'active').length} active`} />
                      </div>
                      <div className="grid gap-3">
                        {data.risks.map((r, i) => (
                          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
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
