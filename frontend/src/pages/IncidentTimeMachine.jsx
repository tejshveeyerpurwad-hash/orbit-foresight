import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Layout from '../components/Layout'
import StatusBadge from '../components/StatusBadge'
import NarrativeCTA from '../components/NarrativeCTA'
import ExecutiveBanner from '../components/ExecutiveBanner'

const presets = [
  'Deploy new payment gateway with retry logic',
  'Update billing invoice schema migration',
  'Refactor auth session handler timeout',
  'Add webhook idempotency key generation',
  'Migrate database connection pool config',
  'Deploy new API gateway rate limiter rules',
]

const timelineHistory = [
  { date: '2024-06-01', title: 'Payment pipeline outage', severity: 'critical', description: 'Complete payment flow blocked for 45 minutes', duration: '45min', services: ['Payment Service', 'API Gateway'] },
  { date: '2024-05-28', title: 'Billing worker OOM cascade', severity: 'critical', description: '15K invoices delayed by 3 hours', duration: '3hr', services: ['Billing Worker', 'Database'] },
  { date: '2024-05-15', title: 'Webhook delivery failure', severity: 'high', description: '2% merchants affected by duplicate events', duration: '2hr', services: ['Webhook Service', 'Event Bus'] },
  { date: '2024-05-02', title: 'Auth session token leak', severity: 'high', description: 'Session data exposed to unauthorized users', duration: '1hr', services: ['Auth Service', 'Redis'] },
  { date: '2024-04-20', title: 'Rate limiter misconfiguration', severity: 'medium', description: 'Legitimate traffic blocked for 15 minutes', duration: '30min', services: ['API Gateway'] },
  { date: '2024-04-10', title: 'Database connection pool exhaustion', severity: 'critical', description: 'All read queries failed for 2.5 hours', duration: '2.5hr', services: ['Database', 'API Service'] },
  { date: '2024-03-28', title: 'Cache invalidation bug', severity: 'medium', description: 'Stale data served across all regions', duration: '45min', services: ['Cache Layer', 'API Service'] },
  { date: '2024-03-15', title: 'Deployment rollback failure', severity: 'high', description: 'Rollback delayed by 90 minutes', duration: '1.5hr', services: ['CI/CD Pipeline'] },
]

const deployments = [
  { service: 'payment-api', version: 'v2.1.0', env: 'production', date: 'Jun 1', outcome: 'rolled-back', risk: 87, metricsBefore: { errorRate: 0.1, latency: 42, throughput: 1200 }, metricsAfter: { errorRate: 2.3, latency: 350, throughput: 300 } },
  { service: 'billing-worker', version: 'v1.8.3', env: 'production', date: 'May 28', outcome: 'rolled-back', risk: 92, metricsBefore: { errorRate: 0.3, latency: 65, throughput: 800 }, metricsAfter: { errorRate: 4.1, latency: 420, throughput: 150 } },
  { service: 'webhook-gateway', version: 'v3.0.1', env: 'staging', date: 'May 22', outcome: 'failed', risk: 45, metricsBefore: { errorRate: 0.5, latency: 55, throughput: 600 }, metricsAfter: { errorRate: 1.8, latency: 89, throughput: 580 } },
  { service: 'auth-service', version: 'v4.2.0', env: 'production', date: 'May 2', outcome: 'success', risk: 34, metricsBefore: { errorRate: 0.8, latency: 120, throughput: 2000 }, metricsAfter: { errorRate: 0.2, latency: 38, throughput: 2400 } },
  { service: 'api-gateway', version: 'v5.0.0', env: 'production', date: 'Apr 20', outcome: 'rolled-back', risk: 73, metricsBefore: { errorRate: 0.4, latency: 28, throughput: 3000 }, metricsAfter: { errorRate: 3.2, latency: 95, throughput: 1800 } },
  { service: 'cache-layer', version: 'v2.3.1', env: 'staging', date: 'Mar 28', outcome: 'success', risk: 22, metricsBefore: { errorRate: 0.6, latency: 15, throughput: 5000 }, metricsAfter: { errorRate: 0.1, latency: 8, throughput: 5500 } },
]

const replays = [
  {
    title: 'Payment Pipeline Outage', date: 'Jun 1, 2024', duration: '45min', severity: 'critical',
    steps: [
      { time: '14:00', action: 'Deploy v2.1.0 to production', type: 'Trigger' },
      { time: '14:02', action: 'Payment success rate drops below 95%', type: 'Detection' },
      { time: '14:03', action: 'PagerDuty alert fired — on-call notified', type: 'Alert' },
      { time: '14:06', action: 'Engineer identifies retry queue saturation', type: 'Response' },
      { time: '14:15', action: 'Deploy circuit breaker with exponential backoff', type: 'Mitigation' },
      { time: '14:45', action: 'Pipeline at 100% success, incident resolved', type: 'Resolution' },
    ],
  },
  {
    title: 'Billing Worker OOM Cascade', date: 'May 28, 2024', duration: '3hr', severity: 'critical',
    steps: [
      { time: '08:00', action: 'Monthly billing cycle initiates batch processing', type: 'Trigger' },
      { time: '08:05', action: 'Database returns slow responses under load', type: 'Detection' },
      { time: '08:07', action: 'Memory usage alert fires at 80% heap', type: 'Alert' },
      { time: '08:10', action: 'Retry queue grows unbounded, heap at 95%', type: 'Response' },
      { time: '08:15', action: 'Worker OOM killed, all jobs fail', type: 'Mitigation' },
      { time: '11:00', action: 'Memory limits configured, jobs reprocessed', type: 'Resolution' },
    ],
  },
  {
    title: 'Webhook Idempotency Failure', date: 'Apr 28, 2024', duration: '2hr', severity: 'high',
    steps: [
      { time: '09:30', action: 'Network blip triggers webhook retries for 500 merchants', type: 'Trigger' },
      { time: '09:31', action: 'Duplicate events detected in audit logs', type: 'Detection' },
      { time: '09:35', action: 'Data inconsistency alert raised by monitoring', type: 'Alert' },
      { time: '09:45', action: 'Engineering team begins investigation', type: 'Response' },
      { time: '10:15', action: 'Idempotency keys generated and deployed', type: 'Mitigation' },
      { time: '11:30', action: 'Dedup window confirmed, all systems normal', type: 'Resolution' },
    ],
  },
]

const evolution = [
  { month: 'Jan', risk: 45 },
  { month: 'Feb', risk: 52 },
  { month: 'Mar', risk: 68 },
  { month: 'Apr', risk: 81 },
  { month: 'May', risk: 73 },
  { month: 'Jun', risk: 59 },
]

const patternSparklines = {
  'Retry queue overflow': [3, 5, 8, 12, 11, 12],
  'Memory exhaustion in workers': [2, 4, 6, 8, 7, 8],
  'Missing circuit breaker pattern': [1, 2, 3, 5, 6, 6],
  'Database connection leaks': [1, 2, 3, 4, 3, 2],
  'Race conditions in session handlers': [1, 2, 3, 4, 5, 5],
  'Insufficient monitoring coverage': [6, 7, 8, 9, 8, 7],
}

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }

const mockResults = {
  incidentProbability: 82,
  confidenceScore: 91,
  severity: 'high',
  summaryStats: [
    { label: 'Timelines Analyzed', value: 847, color: '#a855f7', suffix: '' },
    { label: 'Incidents Replayed', value: 156, color: '#22d3ee', suffix: '' },
    { label: 'Patterns Detected', value: 23, color: '#f59e0b', suffix: '' },
    { label: 'Accuracy Rate', value: 94.2, color: '#22c55e', suffix: '%' },
  ],
  timeline: [
    { date: '2024-06-01', title: 'Payment pipeline outage', severity: 'critical', duration: '45min', impact: 'All payment flows blocked', services: ['Payment Service', 'API Gateway'], rootCause: 'Missing circuit breaker' },
    { date: '2024-05-28', title: 'Billing worker OOM cascade', severity: 'critical', duration: '3hr', impact: '15K invoices delayed', services: ['Billing Worker', 'Database'], rootCause: 'Unbounded retry queue' },
    { date: '2024-05-15', title: 'Webhook delivery failure', severity: 'high', duration: '2hr', impact: '2% merchants affected', services: ['Webhook Service', 'Event Bus'], rootCause: 'Missing idempotency keys' },
    { date: '2024-05-02', title: 'Auth session token leak', severity: 'high', duration: '1hr', impact: 'Session data exposed', services: ['Auth Service', 'Redis'], rootCause: 'Missing TTL on session tokens' },
    { date: '2024-04-20', title: 'Rate limiter misconfiguration', severity: 'medium', duration: '30min', impact: 'Legitimate traffic blocked', services: ['API Gateway'], rootCause: 'Incorrect rate limit threshold' },
    { date: '2024-04-10', title: 'Database connection pool exhaustion', severity: 'critical', duration: '2.5hr', impact: 'All read queries failed', services: ['Database', 'API Service'], rootCause: 'Connection leak in ORM layer' },
    { date: '2024-03-28', title: 'Cache invalidation bug', severity: 'medium', duration: '45min', impact: 'Stale data served across regions', services: ['Cache Layer', 'API Service'], rootCause: 'Missing cache key prefix' },
    { date: '2024-03-15', title: 'Deployment rollback failure', severity: 'high', duration: '1.5hr', impact: 'Rollback delayed by 90 minutes', services: ['CI/CD Pipeline'], rootCause: 'Missing rollback validation step' },
  ],
  patterns: [
    { name: 'Retry queue overflow', frequency: 12, severityDist: { critical: 3, high: 5, medium: 4 }, firstSeen: 'Jan 2024', lastSeen: 'Jun 2024', status: 'monitoring', trend: 'up', confidence: 87 },
    { name: 'Memory exhaustion in workers', frequency: 8, severityDist: { critical: 4, high: 3, medium: 1 }, firstSeen: 'Feb 2024', lastSeen: 'Jun 2024', status: 'monitoring', trend: 'stable', confidence: 82 },
    { name: 'Missing circuit breaker pattern', frequency: 6, severityDist: { critical: 5, high: 1, medium: 0 }, firstSeen: 'Mar 2024', lastSeen: 'Jun 2024', status: 'active', trend: 'up', confidence: 94 },
    { name: 'Database connection leaks', frequency: 4, severityDist: { critical: 2, high: 1, medium: 1 }, firstSeen: 'Apr 2024', lastSeen: 'May 2024', status: 'mitigated', trend: 'down', confidence: 79 },
    { name: 'Race conditions in session handlers', frequency: 5, severityDist: { critical: 1, high: 3, medium: 1 }, firstSeen: 'Mar 2024', lastSeen: 'Jul 2024', status: 'active', trend: 'up', confidence: 91 },
    { name: 'Insufficient monitoring coverage', frequency: 9, severityDist: { critical: 0, high: 4, medium: 5 }, firstSeen: 'Jan 2024', lastSeen: 'Jun 2024', status: 'active', trend: 'down', confidence: 76 },
  ],
  rootCauses: [
    {
      id: 'RCA-001', title: 'Payment Retry Chain Collapse', severity: 'critical',
      trigger: 'Downstream payment gateway returns 503 during peak load',
      failure: 'Missing circuit breaker allows unbounded retries, saturating all worker threads',
      impact: 'Complete payment pipeline outage for 45 minutes, $120K revenue loss',
      resolution: 'Deployed circuit breaker with exponential backoff and 3 retry limit',
      affectedServices: ['Payment Service', 'API Gateway', 'Worker Pool', 'Downstream Gateway'],
      eventTimeline: [
        { time: 'T+0s', event: 'Gateway returns intermittent 503s' },
        { time: 'T+30s', event: 'Retry queue grows to 50K messages' },
        { time: 'T+2min', event: 'Worker threads saturated at 100%' },
        { time: 'T+5min', event: 'Payment pipeline completely blocked' },
        { time: 'T+45min', event: 'Circuit breaker deployed, recovery starts' },
      ],
      lessons: 'All retry loops must implement circuit breaker pattern. Add retry queue monitoring alerts at 80% capacity.',
      prevention: 'Implement circuit breaker in all external service calls with max 3 retries and exponential backoff.',
      confidence: 94,
    },
    {
      id: 'RCA-002', title: 'Billing Worker OOM Cascade', severity: 'critical',
      trigger: 'Monthly billing cycle triggers batch processing of 50K invoices',
      failure: 'Unbounded retry mechanism exhausts heap memory, causing OOM kills',
      impact: '15K invoices delayed by 3 hours, SLA breach for 12 enterprise customers',
      resolution: 'Bound retry queue to 1000 entries, added memory limit alerts at 80% heap',
      affectedServices: ['Billing Worker', 'Database Cluster', 'Invoice Service', 'Monitoring'],
      eventTimeline: [
        { time: 'T+0s', event: 'Monthly billing cycle initiates' },
        { time: 'T+5min', event: 'Database returns slow responses under load' },
        { time: 'T+10min', event: 'Retry queue grows unbounded, heap at 70%' },
        { time: 'T+15min', event: 'Worker OOM killed, all billing jobs fail' },
        { time: 'T+3hr', event: 'Memory limits configured, jobs reprocessed' },
      ],
      lessons: 'Set bounded retry queues with memory limits. Implement circuit breaker for database calls under load.',
      prevention: 'Add memory limit enforcement to all worker processes with pre-configured heap thresholds.',
      confidence: 91,
    },
    {
      id: 'RCA-003', title: 'Webhook Idempotency Failure', severity: 'high',
      trigger: 'Network blip causes webhook delivery retries for 500 merchants',
      failure: 'Missing idempotency keys result in duplicate event processing',
      impact: '2% merchants received duplicate notifications, data inconsistency in audit logs',
      resolution: 'Generated unique idempotency keys with 24hr dedup window',
      affectedServices: ['Webhook Service', 'Event Bus', 'Audit Logger', 'Notification Service'],
      eventTimeline: [
        { time: 'T+0s', event: 'Network blip affects webhook delivery' },
        { time: 'T+1s', event: 'Webhook retry mechanism activates' },
        { time: 'T+30s', event: 'Duplicate events processed for 500 merchants' },
        { time: 'T+5min', event: 'Data inconsistency detected in audit logs' },
        { time: 'T+2hr', event: 'Idempotency keys deployed, dedup fixed' },
      ],
      lessons: 'All webhook handlers must enforce idempotency. Add dedup validation to event pipeline.',
      prevention: 'Generate idempotency keys for all webhook deliveries with 24-hour deduplication window.',
      confidence: 87,
    },
  ],
  recoveryTimeline: [
    { step: 'Detection', duration: '2min', detail: 'Monitoring alert triggered: payment success rate dropped below 95% threshold', owner: 'Monitoring' },
    { step: 'Triage', duration: '5min', detail: 'On-call engineer identifies retry queue saturation as root cause', owner: 'SRE' },
    { step: 'Diagnosis', duration: '10min', detail: 'Detailed analysis reveals missing circuit breaker in payment worker pool', owner: 'Payments Team' },
    { step: 'Fix', duration: '20min', detail: 'Deployed circuit breaker with exponential backoff, cleared 50K queued retries', owner: 'Payments Team' },
    { step: 'Verification', duration: '8min', detail: 'Pipeline at 100% success rate, monitoring confirms stability', owner: 'SRE' },
  ],
  comparisons: [
    { metric: 'Error Rate', before: 0.1, during: 2.3, after: 0.05, unit: '%' },
    { metric: 'Latency', before: 42, during: 350, after: 38, unit: 'ms' },
    { metric: 'Throughput', before: 1200, during: 300, after: 1500, unit: 'rps' },
  ],
  predictions: [
    { window: 'Next 24h', probability: 82, reasoning: 'Similar patterns detected — retry queue metrics show early signs of saturation', action: 'Review circuit breaker config and increase worker pool by 20%', severity: 'high' },
    { window: 'Next 7 days', probability: 65, reasoning: 'Weekly billing cycle approaching — historical OOM pattern correlates with billing batch jobs', action: 'Pre-scale billing workers and enable memory limit enforcement', severity: 'medium' },
    { window: 'Next Sprint', probability: 45, reasoning: 'Two risky merges pending in staging — both touch payment retry logic', action: 'Require engineering review for all retry-related changes this sprint', severity: 'low' },
  ],
  lessons: [
    { lesson: 'All retry loops need circuit breakers', incident: 'Payment Pipeline Outage', category: 'technical', severity: 'critical', status: 'in_progress' },
    { lesson: 'Bound all queues with memory limits', incident: 'Billing Worker OOM', category: 'technical', severity: 'critical', status: 'implemented' },
    { lesson: 'Enforce idempotency on webhooks', incident: 'Webhook Delivery Failure', category: 'technical', severity: 'high', status: 'pending' },
    { lesson: 'Add regression tests for timeout configs', incident: 'Payment Timeout Regression', category: 'process', severity: 'medium', status: 'in_progress' },
    { lesson: 'Thread safety review for session handlers', incident: 'Auth Session Token Leak', category: 'process', severity: 'high', status: 'pending' },
    { lesson: 'Monitoring coverage for all retry paths', incident: 'Rate Limiter Misconfig', category: 'cultural', severity: 'medium', status: 'implemented' },
  ],
  impactForecast: [
    { service: 'Payment Service', risk: 92, impact: 'downtime' },
    { service: 'Billing', risk: 78, impact: 'delay' },
    { service: 'API Gateway', risk: 65, impact: 'overload' },
    { service: 'Notification', risk: 45, impact: 'failure' },
  ],
  mrs: [
    { id: 'MR #142', author: '@alice', date: 'May 12', desc: 'Failed integration tests due to missing retry config', outcome: 'Incident', match: 87, rootCause: 'Missing backpressure mechanism in payment worker', lessons: 'Add circuit breaker pattern to all retry loops' },
    { id: 'MR #198', author: '@bob', date: 'Jun 1', desc: 'Caused retry queue overflow in production', outcome: 'Incident', match: 92, rootCause: 'Unbounded retry queue exhausted heap memory', lessons: 'Bound retry counts and add memory limits to workers' },
    { id: 'MR #211', author: '@carol', date: 'Jun 15', desc: 'Introduced N+1 query in billing report', outcome: 'Near Miss', match: 74, rootCause: 'Missing database index on invoice table', lessons: 'Add query analysis to CI pipeline' },
    { id: 'MR #87', author: '@alice', date: 'Apr 20', desc: 'Payment timeout regression after refactor', outcome: 'Incident', match: 89, rootCause: 'Removed timeout config during cleanup', lessons: 'Add regression tests for timeout configurations' },
    { id: 'MR #305', author: '@dave', date: 'Jul 2', desc: 'Race condition in session invalidation handler', outcome: 'Incident', match: 91, rootCause: 'Missing mutex lock in session store', lessons: 'Enforce thread-safety review for all session handlers' },
  ],
  incidents: [
    { title: 'Production outage — Payment pipeline down 45min', date: 'Jun 1', cause: 'Retry queue overflow without circuit breaker', impact: 'All payment flows blocked', duration: '45min', fix: 'Deployed circuit breaker with exponential backoff' },
    { title: 'Degraded billing processing — 3hr delay', date: 'May 15', cause: 'Billing worker OOM from unbounded retry loop', impact: '15K invoices delayed', duration: '3hr', fix: 'Bound retry counts and added memory limit alerts' },
    { title: 'Webhook delivery failure — partial data loss', date: 'Apr 28', cause: 'Missing idempotency keys caused duplicate webhook events', impact: '2% merchants affected', duration: '2hr', fix: 'Generated unique idempotency keys for all webhooks' },
  ],
  recommendations: [
    { priority: 'P0', action: 'Add circuit breaker to payment retry logic', owner: 'Payments Team', detail: 'Prevents cascading failures in payment pipeline. Estimated effort: 3 story points.', impact: 'Prevents $120K/incident revenue loss', effort: '3 story points', status: 'pending' },
    { priority: 'P0', action: 'Bound retry queues with memory limits', owner: 'Platform Team', detail: 'Eliminates OOM risks in worker processes. Estimated effort: 5 story points.', impact: 'Eliminates OOM-related outages', effort: '5 story points', status: 'in_progress' },
    { priority: 'P1', action: 'Add idempotency keys to webhook delivery', owner: 'Platform Team', detail: 'Eliminates duplicate event processing. Estimated effort: 5 story points.', impact: 'Protects 2% merchants from data issues', effort: '5 story points', status: 'pending' },
    { priority: 'P1', action: 'Increase billing worker memory limit', owner: 'Billing Team', detail: 'Prevents OOM during peak load. Estimated effort: 1 story point.', impact: 'Covers 15K invoices during peak', effort: '1 story point', status: 'completed' },
    { priority: 'P2', action: 'Add regression tests for timeout configs', owner: 'QA Team', detail: 'Catches accidental timeout removal during refactors. Estimated effort: 2 story points.', impact: 'Prevents timeout regressions', effort: '2 story points', status: 'pending' },
    { priority: 'P2', action: 'Implement session TTL enforcement', owner: 'Auth Team', detail: 'Ensures session tokens expire after max 24hr. Estimated effort: 3 story points.', impact: 'Prevents session data exposure', effort: '3 story points', status: 'in_progress' },
  ],
}

const severityColor = {
  critical: { border: 'border-red-500/30', bg: 'bg-red-500/[0.04]', dot: 'bg-red-500', badge: 'bg-red-500/10 text-red-400 border-red-500/20', text: 'text-red-400', glow: '#ef4444' },
  high: { border: 'border-orange-500/30', bg: 'bg-orange-500/[0.04]', dot: 'bg-orange-500', badge: 'bg-orange-500/10 text-orange-400 border-orange-500/20', text: 'text-orange-400', glow: '#f97316' },
  medium: { border: 'border-yellow-500/30', bg: 'bg-yellow-500/[0.04]', dot: 'bg-yellow-500', badge: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20', text: 'text-yellow-400', glow: '#eab308' },
}

function AnimatedStatCard({ value, label, color, delay = 200 }) {
  const safeValue = value ?? 0
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (safeValue === 0) { setCount(0); return }
    const timer = setTimeout(() => {
      let current = 0
      const step = Math.max(0.1, safeValue / 30)
      let iterations = 0
      const interval = setInterval(() => {
        iterations++
        current += step
        if (current >= safeValue || iterations > 100) {
          setCount(safeValue)
          clearInterval(interval)
        } else {
          setCount(current)
        }
      }, 25)
    }, delay)
    return () => clearTimeout(timer)
  }, [safeValue, delay])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay / 1000 + 0.3 }}
                    className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-4 backdrop-blur-xl hover:border-purple-500/30 hover:bg-white/[0.04] transition-all duration-300 group"
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-[11px] font-mono font-medium text-slate-500 tracking-wide uppercase">{label}</p>
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
        </div>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-bold tracking-tight tabular-nums" style={{ color }}>
          {label.includes('Rate') ? count.toFixed(1) : Math.floor(count)}{label.includes('Rate') ? '' : ''}
        </span>
        {label.includes('Rate') && <span className="text-lg text-slate-500" style={{ color }}>%</span>}
      </div>
      <svg width="36" height="36" viewBox="0 0 36 36" className="-rotate-90 shrink-0">
        <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="3" />
        <motion.circle cx="18" cy="18" r="14" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round"
          strokeDasharray={2 * Math.PI * 14} initial={{ strokeDashoffset: 2 * Math.PI * 14 }}
          animate={{ strokeDashoffset: 2 * Math.PI * 14 * (1 - (count / (label.includes('Rate') ? 100 : safeValue > 500 ? safeValue : 1000))) }} transition={{ duration: 0.8, ease: 'easeOut' }} />
      </svg>
    </motion.div>
  )
}

function Sparkline({ data, color = '#a855f7', height = 24, width = 80 }) {
  if (!data || data.length < 2) return null
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width
    const y = height - ((v - min) / range) * (height - 4) - 2
    return `${x},${y}`
  }).join(' ')
  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" points={points} />
      {data.map((v, i) => {
        const x = (i / (data.length - 1)) * width
        const y = height - ((v - min) / range) * (height - 4) - 2
        return <circle key={i} cx={x} cy={y} r="1.5" fill={color} />
      })}
    </svg>
  )
}


function DeploymentCard({ deploy, index }) {
  const [showComparison, setShowComparison] = useState(false)
  const outcomeColors = {
    'rolled-back': { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20' },
    failed: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20' },
    success: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20' },
  }
  const oc = outcomeColors[deploy.outcome] || outcomeColors.success

  const metrics = [
    { label: 'Error Rate', before: `${deploy.metricsBefore.errorRate}%`, after: `${deploy.metricsAfter.errorRate}%`, beforeVal: deploy.metricsBefore.errorRate, afterVal: deploy.metricsAfter.errorRate },
    { label: 'Latency', before: `${deploy.metricsBefore.latency}ms`, after: `${deploy.metricsAfter.latency}ms`, beforeVal: deploy.metricsBefore.latency, afterVal: deploy.metricsAfter.latency },
    { label: 'Throughput', before: `${deploy.metricsBefore.throughput}/s`, after: `${deploy.metricsAfter.throughput}/s`, beforeVal: deploy.metricsBefore.throughput, afterVal: deploy.metricsAfter.throughput },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="rounded-lg border border-white/[0.04] bg-white/[0.02] p-4 hover:border-purple-500/20 transition-all"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-semibold text-cyan-400">{deploy.service}</span>
          <span className="text-[9px] font-mono text-slate-600">{deploy.version}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`rounded-full border px-1.5 py-0.5 text-[8px] font-semibold ${oc.bg} ${oc.text} ${oc.border}`}>{deploy.outcome}</span>
          <span className="text-[9px] text-slate-600">{deploy.date}</span>
        </div>
      </div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-mono text-slate-600 bg-white/[0.04] px-1.5 py-0.5 rounded">{deploy.env}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[9px] text-slate-600">Risk:</span>
          <span className={`text-[10px] font-bold font-mono ${deploy.risk > 70 ? 'text-red-400' : deploy.risk > 40 ? 'text-yellow-400' : 'text-green-400'}`}>{deploy.risk}%</span>
        </div>
      </div>
      <button
        type="button"
        onClick={() => setShowComparison(!showComparison)}
        className="w-full flex items-center justify-center gap-1.5 rounded-md bg-white/[0.03] border border-white/[0.06] px-3 py-1.5 text-[9px] text-slate-500 hover:text-cyan-400 hover:border-cyan-500/20 transition-all"
      >
        <svg className={`w-3 h-3 transition-transform ${showComparison ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
        {showComparison ? 'Hide comparison' : 'Before vs After comparison'}
      </button>
      <AnimatePresence>
        {showComparison && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 space-y-2 pt-3 border-t border-white/[0.06]">
              {metrics.map((m) => {
                const worsened = m.afterVal > m.beforeVal && m.label !== 'Throughput'
                const improved = m.label === 'Throughput' ? m.afterVal > m.beforeVal : m.afterVal < m.beforeVal
                return (
                  <div key={m.label} className="flex items-center gap-3">
                    <span className="text-[9px] text-slate-600 w-16 shrink-0">{m.label}</span>
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-[9px] font-mono text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded">{m.before}</span>
                      <svg className="w-3 h-3 text-slate-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                      <span className={`text-[9px] font-mono ${worsened ? 'text-red-400 bg-red-500/10' : improved ? 'text-green-400 bg-green-500/10' : 'text-yellow-400 bg-yellow-500/10'} px-1.5 py-0.5 rounded`}>{m.after}</span>
                      {worsened && <svg className="w-3 h-3 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 19.5v-15m0 0l-6.75 6.75M12 4.5l6.75 6.75" /></svg>}
                      {improved && <svg className="w-3 h-3 text-green-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m0 0l6.75-6.75M12 19.5l-6.75-6.75" /></svg>}
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function ReplayCard({ replay, index }) {
  const [playing, setPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(-1)
  const intervalRef = useRef(null)

  const handlePlay = () => {
    if (playing) {
      clearInterval(intervalRef.current)
      setPlaying(false)
      setCurrentStep(-1)
      return
    }
    setPlaying(true)
    setCurrentStep(0)
    let step = 0
    intervalRef.current = setInterval(() => {
      step++
      if (step >= replay.steps.length) {
        clearInterval(intervalRef.current)
        setPlaying(false)
        setCurrentStep(-1)
      } else {
        setCurrentStep(step)
      }
    }, 800)
  }

  useEffect(() => {
    return () => clearInterval(intervalRef.current)
  }, [])

  const sev = severityColor[replay.severity] || severityColor.medium

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="rounded-lg border border-white/[0.04] bg-white/[0.02] p-4 hover:border-cyan-500/20 transition-all"
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="text-xs font-semibold text-white mb-0.5">{replay.title}</h4>
          <div className="flex items-center gap-2 text-[9px] text-slate-600">
            <span className="font-mono">{replay.date}</span>
            <span className="text-slate-700">|</span>
            <span>{replay.duration}</span>
          </div>
        </div>
        <span className={`rounded-full border px-1.5 py-0.5 text-[8px] font-semibold ${sev.badge}`}>{replay.severity}</span>
      </div>
      <div className="flex items-center gap-2 mb-3">
        <svg width="36" height="36" viewBox="0 0 36 36" className="-rotate-90 shrink-0">
          <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="3" />
          <motion.circle cx="18" cy="18" r="14" fill="none" stroke="#a855f7" strokeWidth="3" strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 14}
            animate={{ strokeDashoffset: 2 * Math.PI * 14 * (1 - (playing && currentStep >= 0 ? ((currentStep + 1) / replay.steps.length) : 0)) }} transition={{ duration: 0.3 }} />
          <text x="18" y="21" textAnchor="middle" fill="#a855f7" fontSize="8" fontWeight="700" fontFamily="monospace" transform="rotate(90 18 18)">{playing && currentStep >= 0 ? Math.round(((currentStep + 1) / replay.steps.length) * 100) : 0}%</text>
        </svg>
        <div className="flex-1">
          <div className="h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
            <motion.div className="h-full rounded-full bg-gradient-to-r from-purple-500 via-cyan-400 to-fuchsia-500"
              animate={{ width: playing && currentStep >= 0 ? `${((currentStep + 1) / replay.steps.length) * 100}%` : '0%' }} transition={{ duration: 0.3 }} />
          </div>
        </div>
      </div>
      <div className="space-y-1 min-h-[80px]">
        {replay.steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -5 }}
            animate={{
              opacity: currentStep >= i ? 1 : 0.2,
              x: currentStep >= i ? 0 : -5,
            }}
            transition={{ duration: 0.3 }}
            className={`flex items-center gap-2 px-2 py-1 rounded text-[9px] ${
              currentStep === i
                ? 'bg-purple-500/10 border border-purple-500/20'
                : currentStep > i
                  ? 'bg-white/[0.02]'
                  : ''
            }`}
          >
            <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${currentStep >= i ? 'bg-cyan-400' : 'bg-slate-700'}`} />
            <span className="font-mono text-slate-600 w-10 shrink-0">{step.time}</span>
            <span className={`flex-1 ${currentStep >= i ? 'text-slate-300' : 'text-slate-700'}`}>{step.action}</span>
            {currentStep >= i && (
              <span className={`text-[7px] px-1 py-0.5 rounded ${
                step.type === 'Trigger' ? 'bg-red-500/10 text-red-400' :
                step.type === 'Detection' ? 'bg-yellow-500/10 text-yellow-400' :
                step.type === 'Alert' ? 'bg-orange-500/10 text-orange-400' :
                step.type === 'Response' ? 'bg-blue-500/10 text-blue-400' :
                step.type === 'Mitigation' ? 'bg-purple-500/10 text-purple-400' :
                'bg-green-500/10 text-green-400'
              }`}>{step.type}</span>
            )}
          </motion.div>
        ))}
      </div>
      <button
        type="button"
        onClick={handlePlay}
        className={`mt-3 w-full flex items-center justify-center gap-2 rounded-md px-3 py-2 text-[10px] font-semibold transition-all ${
          playing
            ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20'
            : 'bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-cyan-300 border border-cyan-500/20 hover:from-purple-500/30 hover:to-cyan-500/30'
        }`}
      >
        {playing ? (
          <><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg>Stop Replay</>
        ) : (
          <><svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5.14v14.72a1 1 0 001.5.86l11-7.36a1 1 0 000-1.72l-11-7.36A1 1 0 008 5.14z" /></svg>Replay Incident</>
        )}
      </button>
    </motion.div>
  )
}

function RiskChart() {
  const [animate, setAnimate] = useState(false)
  useEffect(() => { setTimeout(() => setAnimate(true), 500) }, [])

  const width = 600
  const height = 180
  const padding = { top: 20, right: 20, bottom: 30, left: 40 }
  const chartW = width - padding.left - padding.right
  const chartH = height - padding.top - padding.bottom
  const maxRisk = 100

  const points = evolution.map((d, i) => ({
    x: padding.left + (i / (evolution.length - 1)) * chartW,
    y: padding.top + chartH - (d.risk / maxRisk) * chartH,
    ...d,
  }))

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
  const areaPath = `${linePath} L${points[points.length - 1].x},${padding.top + chartH} L${points[0].x},${padding.top + chartH} Z`

  const incidentAnnotations = [
    { index: 2, label: 'Webhook failure', risk: evolution[2].risk },
    { index: 3, label: 'DB pool exhaust', risk: evolution[3].risk },
    { index: 4, label: 'Rollback failure', risk: evolution[4].risk },
  ]

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a855f7" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 25, 50, 75, 100].map((v) => {
        const y = padding.top + chartH - (v / maxRisk) * chartH
        return (
          <g key={v}>
            <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="#1e293b" strokeWidth="1" />
            <text x={padding.left - 8} y={y + 3} textAnchor="end" className="fill-slate-600" fontSize="8" fontFamily="monospace">{v}</text>
          </g>
        )
      })}
      {evolution.map((d, i) => {
        const x = padding.left + (i / (evolution.length - 1)) * chartW
        return <text key={i} x={x} y={height - 6} textAnchor="middle" className="fill-slate-600" fontSize="9" fontFamily="monospace">{d.month}</text>
      })}
      <motion.path
        d={areaPath}
        fill="url(#chartGrad)"
        initial={{ opacity: 0 }}
        animate={{ opacity: animate ? 1 : 0 }}
        transition={{ duration: 0.8 }}
      />
      <motion.path
        d={linePath}
        fill="none"
        stroke="#a855f7"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: animate ? 1 : 0 }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
      />
      {points.map((p, i) => (
        <motion.circle
          key={i}
          cx={p.x}
          cy={p.y}
          r="4"
          fill="#1e293b"
          stroke="#a855f7"
          strokeWidth="2"
          initial={{ opacity: 0 }}
          animate={{ opacity: animate ? 1 : 0 }}
          transition={{ delay: 0.5 + i * 0.15 }}
        />
      ))}
      {incidentAnnotations.map((ann) => {
        const p = points[ann.index]
        return (
          <g key={ann.label}>
            <line x1={p.x} y1={p.y - 8} x2={p.x} y2={p.y - 24} stroke="#f97316" strokeWidth="1" strokeDasharray="2,2" />
            <rect x={p.x - 24} y={p.y - 38} width="48" height="14" rx="3" className="fill-slate-800" stroke="#f97316" strokeWidth="0.5" />
            <text x={p.x} y={p.y - 28} textAnchor="middle" className="fill-orange-400" fontSize="7" fontFamily="monospace">{ann.label}</text>
          </g>
        )
      })}
    </svg>
  )
}

function RecoveryTimelineCard({ steps }) {
  const totalMinutes = steps.reduce((acc, s) => {
    const mins = parseInt(s.duration)
    return acc + (isNaN(mins) ? 0 : mins)
  }, 0)

  return (
    <div className="space-y-4">
      {steps.map((step, i) => {
        const mins = parseInt(step.duration) || 1
        const pct = totalMinutes > 0 ? (mins / totalMinutes) * 100 : 0
        const stepColors = ['#a855f7', '#22d3ee', '#d946ef', '#f59e0b', '#22c55e']
        return (
          <motion.div
            key={step.step}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="relative"
          >
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold font-mono" style={{ backgroundColor: `${stepColors[i]}20`, color: stepColors[i], border: `1px solid ${stepColors[i]}40` }}>
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-white">{step.step}</h4>
                  <span className="text-[9px] font-mono text-cyan-400">{step.duration}</span>
                </div>
                <p className="text-[9px] text-slate-500 leading-tight truncate">{step.detail}</p>
              </div>
              <span className="text-[8px] font-mono text-slate-600 bg-white/[0.03] px-1.5 py-0.5 rounded shrink-0">{step.owner}</span>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <svg width="28" height="28" viewBox="0 0 28 28" className="-rotate-90 shrink-0">
                <circle cx="14" cy="14" r="10" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="3" />
                <motion.circle cx="14" cy="14" r="10" fill="none" stroke={stepColors[i]} strokeWidth="3" strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 10} initial={{ strokeDashoffset: 2 * Math.PI * 10 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 10 * (1 - pct / 100) }} transition={{ duration: 0.8, delay: i * 0.15, ease: 'easeOut' }} />
                <text x="14" y="17" textAnchor="middle" fill={stepColors[i]} fontSize="6" fontWeight="700" fontFamily="monospace" transform="rotate(90 14 14)">{Math.round(pct)}%</text>
              </svg>
            </div>
            {i < steps.length - 1 && (
              <div className="ml-[15px] w-0.5 h-4 bg-gradient-to-b from-slate-700 to-transparent" />
            )}
          </motion.div>
        )
      })}
    </div>
  )
}

function RootCauseChainCard({ rca, index }) {
  const sev = severityColor[rca.severity] || severityColor.medium
  const chainSteps = [
    { label: 'Trigger', value: rca.trigger, color: '#ef4444' },
    { label: 'Failure', value: rca.failure, color: '#f97316' },
    { label: 'Impact', value: rca.impact, color: '#eab308' },
    { label: 'Resolution', value: rca.resolution, color: '#22c55e' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.12 }}
      className="rounded-lg border border-white/[0.04] bg-white/[0.02] p-4 hover:border-purple-500/20 transition-all"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`rounded px-1.5 py-0.5 text-[8px] font-bold font-mono ${sev.badge}`}>{rca.id}</span>
          <h4 className="text-xs font-semibold text-white">{rca.title}</h4>
        </div>
        <div className="flex items-center gap-2">
          <span className={`rounded-full border px-1.5 py-0.5 text-[8px] font-semibold ${sev.badge}`}>{rca.severity}</span>
          <span className="text-[8px] font-mono text-slate-600">{rca.confidence}% conf</span>
        </div>
      </div>

      <div className="flex items-start gap-1 mb-2 overflow-x-auto pb-2">
        {chainSteps.map((step, si) => (
          <div key={step.label} className="flex items-start gap-1 shrink-0">
            <div className="w-44 rounded-lg border p-2.5" style={{ borderColor: `${step.color}30`, backgroundColor: `${step.color}08` }}>
              <span className="text-[8px] font-semibold uppercase tracking-wider block mb-1" style={{ color: step.color }}>{step.label}</span>
              <p className="text-[9px] text-slate-400 leading-relaxed">{step.value}</p>
            </div>
            {si < chainSteps.length - 1 && (
              <div className="flex items-center pt-6">
                <svg className="w-5 h-5 text-slate-700 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mb-3">
        <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">Event Timeline</span>
        <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] overflow-hidden">
          {rca.eventTimeline.map((ev, j) => (
            <div key={j} className={`flex items-center gap-3 px-3 py-1.5 ${j < rca.eventTimeline.length - 1 ? 'border-b border-white/[0.04]' : ''}`}>
              <span className="text-[8px] font-mono font-semibold text-cyan-400 shrink-0 w-10">{ev.time}</span>
              <span className="text-[9px] text-slate-400">{ev.event}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div className="rounded-lg border border-green-500/10 bg-green-500/[0.02] p-2.5">
          <span className="text-[8px] font-semibold text-green-400 uppercase tracking-wider block mb-1">Lessons Learned</span>
          <p className="text-[9px] text-slate-400 leading-relaxed">{rca.lessons}</p>
        </div>
        <div className="rounded-lg border border-cyan-500/10 bg-cyan-500/[0.02] p-2.5">
          <span className="text-[8px] font-semibold text-cyan-400 uppercase tracking-wider block mb-1">Prevention</span>
          <p className="text-[9px] text-slate-400 leading-relaxed">{rca.prevention}</p>
        </div>
      </div>
    </motion.div>
  )
}

function LessonCard({ lesson, index }) {
  const categoryColors = {
    technical: { bg: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
    process: { bg: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    cultural: { bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  }
  const catColor = categoryColors[lesson.category] || categoryColors.technical

  const statusConfig = {
    implemented: { dot: 'bg-green-400', text: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
    in_progress: { dot: 'bg-amber-400', text: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
    pending: { dot: 'bg-red-400', text: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
  }
  const st = statusConfig[lesson.status] || statusConfig.pending

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      className="rounded-lg border border-white/[0.04] bg-white/[0.02] p-3 hover:border-white/[0.1] transition-all"
    >
      <div className="flex items-start gap-3">
        <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${st.dot}`} style={{ boxShadow: `0 0 6px ${st.dot.replace('bg-', '')}60` }} />
        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-medium text-white mb-1">{lesson.lesson}</h4>
          <div className="flex items-center gap-2 text-[8px] text-slate-600 mb-1.5">
            <span>{lesson.incident}</span>
            <span className="text-slate-700">|</span>
            <span className={`rounded-full border px-1 py-0.5 text-[7px] ${catColor.bg}`}>{lesson.category}</span>
            <span className={`rounded-full border px-1 py-0.5 text-[7px] ${sevBadge(lesson.severity)}`}>{lesson.severity}</span>
          </div>
          <span className={`inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[7px] font-semibold ${st.bg}`}>
            <span className={`w-1 h-1 rounded-full ${st.dot}`} />
            {lesson.status === 'in_progress' ? 'In Progress' : lesson.status.charAt(0).toUpperCase() + lesson.status.slice(1)}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

function sevBadge(sev) {
  const map = {
    critical: 'bg-red-500/10 text-red-400 border-red-500/20',
    high: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  }
  return map[sev] || map.medium
}

function PredictionCard({ pred, index }) {
  const severityColorMap = {
    high: { border: 'border-red-500/30', bg: 'bg-red-500/[0.04]', text: 'text-red-400', glow: '#ef4444' },
    medium: { border: 'border-amber-500/30', bg: 'bg-amber-500/[0.04]', text: 'text-amber-400', glow: '#f59e0b' },
    low: { border: 'border-green-500/30', bg: 'bg-green-500/[0.04]', text: 'text-green-400', glow: '#22c55e' },
  }
  const sc = severityColorMap[pred.severity] || severityColorMap.medium

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`rounded-lg border ${sc.border} ${sc.bg} p-4 hover:border-white/[0.12] transition-all`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">{pred.window}</span>
        <span className={`text-[9px] font-semibold font-mono ${sc.text}`}>{pred.severity.toUpperCase()}</span>
      </div>
      <div className="flex items-center gap-3 mb-3">
        <div className="relative">
          <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="15.5" fill="none" stroke="#1e293b" strokeWidth="3" />
            <motion.circle
              cx="18" cy="18" r="15.5" fill="none"
              stroke={sc.glow} strokeWidth="3" strokeLinecap="round"
              strokeDasharray={`${pred.probability}, 100`}
              initial={{ strokeDasharray: '0, 100' }}
              animate={{ strokeDasharray: `${pred.probability}, 100` }}
              transition={{ duration: 1, delay: 0.3 }}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold font-mono" style={{ color: sc.glow }}>{pred.probability}%</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[9px] text-slate-400 leading-relaxed mb-1">{pred.reasoning}</p>
          <div className="rounded-md bg-slate-800/60 border border-white/[0.04] px-2 py-1">
            <span className="text-[7px] font-semibold text-cyan-400 uppercase tracking-wider block">Recommended Action</span>
            <span className="text-[8px] text-slate-300">{pred.action}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function ImpactForecastCard({ forecasts }) {
  const impactColors = {
    downtime: { bar: 'from-red-500 to-red-600', text: 'text-red-400', bg: 'bg-red-500/10' },
    delay: { bar: 'from-amber-500 to-amber-600', text: 'text-amber-400', bg: 'bg-amber-500/10' },
    overload: { bar: 'from-purple-500 to-purple-600', text: 'text-purple-400', bg: 'bg-purple-500/10' },
    failure: { bar: 'from-orange-500 to-orange-600', text: 'text-orange-400', bg: 'bg-orange-500/10' },
  }

  return (
    <div className="space-y-3">
      {forecasts.map((f, i) => {
        const ic = impactColors[f.impact] || impactColors.failure
        return (
          <motion.div
            key={f.service}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className="rounded-lg border border-white/[0.04] bg-white/[0.02] p-3 hover:border-white/[0.1] transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold text-white">{f.service}</span>
                <span className={`rounded-full px-1.5 py-0.5 text-[7px] font-semibold ${ic.bg} ${ic.text} border border-transparent`}>{f.impact}</span>
              </div>
              <span className="text-[9px] font-mono font-bold" style={{ color: ic.text.replace('text-', '#') }}>{f.risk}%</span>
            </div>
            <svg width="32" height="32" viewBox="0 0 32 32" className="-rotate-90 shrink-0">
              <circle cx="16" cy="16" r="12" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="3" />
              <motion.circle cx="16" cy="16" r="12" fill="none" stroke={ic.text === 'text-red-400' ? '#ef4444' : ic.text === 'text-amber-400' ? '#f59e0b' : ic.text === 'text-purple-400' ? '#a855f7' : '#f97316'} strokeWidth="3" strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 12} initial={{ strokeDashoffset: 2 * Math.PI * 12 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 12 * (1 - f.risk / 100) }} transition={{ duration: 1, delay: i * 0.1, ease: 'easeOut' }} />
              <text x="16" y="19" textAnchor="middle" fill={ic.text === 'text-red-400' ? '#ef4444' : ic.text === 'text-amber-400' ? '#f59e0b' : ic.text === 'text-purple-400' ? '#a855f7' : '#f97316'} fontSize="7" fontWeight="700" fontFamily="monospace" transform="rotate(90 16 16)">{f.risk}%</text>
            </svg>
          </motion.div>
        )
      })}
    </div>
  )
}

function HistoricalComparisonCard({ metric }) {
  const [phase, setPhase] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setPhase(p => (p + 1) % 3), 2500)
    return () => clearInterval(t)
  }, [])

  const states = [
    { label: 'Before', value: metric.before, unit: metric.unit, color: '#22c55e' },
    { label: 'During', value: metric.during, unit: metric.unit, color: '#ef4444' },
    { label: 'After', value: metric.after, unit: metric.unit, color: '#22c55e' },
  ]
  const maxVal = Math.max(metric.before, metric.during, metric.after)

  return (
    <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4">
      <h4 className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-3">{metric.metric}</h4>
      <AnimatePresence mode="wait">
        <motion.div
          key={phase}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <span className="text-2xl font-bold tabular-nums" style={{ color: states[phase].color }}>
            {states[phase].value}{states[phase].unit}
          </span>
          <div className="mt-2 flex justify-center gap-1">
            {states.map((p, i) => (
              <div key={p.label} className={`w-2 h-2 rounded-full transition-all ${i === phase ? 'bg-cyan-400 scale-125' : 'bg-slate-800'}`} />
            ))}
          </div>
          <svg width="32" height="32" viewBox="0 0 32 32" className="-rotate-90 shrink-0">
            <circle cx="16" cy="16" r="12" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="3" />
            <motion.circle cx="16" cy="16" r="12" fill="none" stroke={states[phase].color} strokeWidth="3" strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 12}
              animate={{ strokeDashoffset: 2 * Math.PI * 12 * (1 - (states[phase].value / maxVal)) }} transition={{ duration: 0.5 }} />
            <text x="16" y="19" textAnchor="middle" fill={states[phase].color} fontSize="7" fontWeight="700" fontFamily="monospace" transform="rotate(90 16 16)">{Math.round((states[phase].value / maxVal) * 100)}%</text>
          </svg>
          <span className="text-[8px] text-slate-600 mt-1 block">{states[phase].label}</span>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default function IncidentTimeMachine() {
  const [input, setInput] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [results, setResults] = useState(mockResults)
  const [showPresets, setShowPresets] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState(-1)
  const [activeTimelineIdx, setActiveTimelineIdx] = useState(-1)
  const [timeNav, setTimeNav] = useState('6 months')
  const timelineRef = useRef(null)
  const inputRef = useRef(null)

  const filtered = input.trim()
    ? presets.filter(p => p.toLowerCase().includes(input.toLowerCase()))
    : presets

  const analyze = (text) => {
    if (!text.trim()) return
    setAnalyzing(true)
    setResults(null)
    setTimeout(() => {
      setResults(mockResults)
      setAnalyzing(false)
    }, 1800)
  }

  const handleKey = (e) => {
    if (!showPresets || !filtered.length) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedPreset(p => Math.min(p + 1, filtered.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedPreset(p => Math.max(p - 1, 0)) }
    if (e.key === 'Enter' && selectedPreset >= 0) { e.preventDefault(); setInput(filtered[selectedPreset]); setShowPresets(false); analyze(filtered[selectedPreset]) }
    if (e.key === 'Escape') setShowPresets(false)
  }

  useEffect(() => { setSelectedPreset(-1) }, [input])

  const scrollTimeline = (dir) => {
    if (timelineRef.current) {
      timelineRef.current.scrollBy({ left: dir * 280, behavior: 'smooth' })
    }
  }

  return (
    <Layout>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-2">
        <ExecutiveBanner currentPage="/time-machine" />
        <motion.div variants={item}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 shadow-lg shadow-purple-500/25">
                  <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-cyan-400 animate-ping opacity-75" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-widest uppercase text-white">Time Lab</h1>
                <p className="text-[11px] font-mono text-slate-500 tracking-wide">Chronological Incident Forensics Engine</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/5 px-4 py-1.5">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[9px] font-mono text-green-400 tracking-wider uppercase">Active Timeline</span>
            </div>
          </div>
        </motion.div>

        <motion.div variants={item} className="relative">
          <div className="rounded-xl border border-white/[0.08] bg-slate-900/80 backdrop-blur-2xl p-4 sm:p-5">
            <form onSubmit={e => { e.preventDefault(); analyze(input) }}>
              <div className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => { setInput(e.target.value); setShowPresets(true) }}
                  onFocus={() => setShowPresets(true)}
                  onKeyDown={handleKey}
                  placeholder="Navigate to a change or incident..."
                  className="w-full rounded-xl border border-white/[0.06] bg-slate-800/60 py-3.5 pl-11 pr-36 text-sm text-white placeholder-slate-600 outline-none focus:border-purple-500/40 focus:bg-slate-800/80 transition-all font-mono"
                  disabled={analyzing}
                />
                <div className="absolute inset-y-1.5 right-1.5 flex items-center gap-1">
                  <button
                    type="submit"
                    disabled={analyzing || !input.trim()}
                    className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-500 via-fuchsia-500 to-cyan-500 px-5 py-2 text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/25 group relative overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {analyzing ? (
                        <><svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Analyzing</>
                      ) : (
                        <><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>Travel</>
                      )}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </button>
                </div>
              </div>
            </form>
            <AnimatePresence>
              {showPresets && filtered.length > 0 && !analyzing && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="mt-2 rounded-xl border border-white/[0.06] bg-slate-800/80 overflow-hidden"
                >
                  {filtered.map((s, i) => (
                    <button
                      key={s}
                      type="button"
                      className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                        i === selectedPreset ? 'bg-purple-500/10 text-purple-300' : 'text-slate-500 hover:bg-white/[0.04] hover:text-white'
                      }`}
                      onClick={() => { setInput(s); setShowPresets(false); analyze(s) }}
                    >
                      <svg className="h-3.5 w-3.5 shrink-0 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                      </svg>
                      {s}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {analyzing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-4 animate-pulse">
                  <div className="h-3 w-28 bg-slate-800 rounded mb-3" />
                  <div className="h-8 w-16 bg-slate-800 rounded mb-2" />
                  <div className="h-2 w-full bg-slate-800 rounded" />
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-4 animate-pulse">
              <div className="h-3 w-40 bg-slate-800 rounded mb-4" />
              <div className="flex gap-4 overflow-hidden">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="w-52 h-32 rounded-lg bg-slate-800/50 shrink-0" />
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-4 animate-pulse">
              <div className="h-3 w-32 bg-slate-800 rounded mb-4" />
              <div className="grid gap-3 sm:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-24 rounded-lg bg-slate-800/50" />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {results && !analyzing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              variants={container}
              className="space-y-3"
            >
              {/* 1. Stats */}
              <motion.div variants={item} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {results.summaryStats.map((stat, i) => (
                  <AnimatedStatCard key={stat.label} {...stat} delay={200 + i * 150} />
                ))}
              </motion.div>

              {/* 2. Historical Timeline */}
              <motion.div variants={item} className="relative">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Historical Timeline
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => scrollTimeline(-1)}
                      className="w-7 h-7 rounded-lg border border-white/[0.06] bg-white/[0.03] flex items-center justify-center hover:border-purple-500/30 transition-all"
                    >
                      <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => scrollTimeline(1)}
                      className="w-7 h-7 rounded-lg border border-white/[0.06] bg-white/[0.03] flex items-center justify-center hover:border-purple-500/30 transition-all"
                    >
                      <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                    </button>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute top-[38px] left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500/20 via-cyan-500/20 to-purple-500/20" />
                  <div
                    ref={timelineRef}
                    className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent -mx-1 px-1"
                    style={{ scrollBehavior: 'smooth' }}
                  >
                    {timelineHistory.map((ev, i) => {
                      const sev = severityColor[ev.severity] || severityColor.medium
                      const isActive = activeTimelineIdx === i
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setActiveTimelineIdx(activeTimelineIdx === i ? -1 : i)}
                          className={`relative shrink-0 w-56 rounded-xl border p-4 text-left transition-all duration-300 ${
                            isActive
                              ? 'border-purple-500/40 bg-purple-500/[0.06] shadow-lg shadow-purple-500/10'
                              : 'border-white/[0.04] bg-white/[0.02] hover:border-purple-500/20 hover:bg-white/[0.04]'
                          }`}
                        >
                          <div className="absolute -top-[13px] left-6 w-3 h-3 rounded-full border-2 border-slate-800 z-10 bg-slate-950"
                            style={{ borderColor: isActive ? sev.glow : '#334155', boxShadow: isActive ? `0 0 8px ${sev.glow}40` : 'none' }}>
                            <div className={`w-1.5 h-1.5 rounded-full ${sev.dot} mx-auto mt-[2px]`} />
                          </div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[9px] font-mono text-slate-600">{ev.date}</span>
                            <span className={`rounded-full border px-1.5 py-0.5 text-[7px] font-semibold ${sev.badge}`}>{ev.severity}</span>
                          </div>
                          <h4 className="text-xs font-semibold text-white mb-1 leading-tight">{ev.title}</h4>
                          <p className="text-[9px] text-slate-500 mb-2 leading-relaxed">{ev.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-[8px] font-mono text-slate-600">{ev.duration}</span>
                            <div className="flex gap-1">
                              {ev.services.slice(0, 2).map(s => (
                                <span key={s} className="rounded bg-white/[0.04] px-1 py-0.5 text-[7px] font-mono text-slate-600">{s.split(' ')[0]}</span>
                              ))}
                            </div>
                          </div>
                          {isActive && (
                            <motion.div
                              layoutId="timeline-glow"
                              className="absolute inset-0 rounded-xl border-2 border-transparent"
                              style={{ boxShadow: `inset 0 0 20px ${sev.glow}15` }}
                            />
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </motion.div>

              {/* 2a. Data Visualizations — replaced WormholeAnimation */}
              <motion.div variants={item} className="space-y-2">
                <div className="grid grid-cols-3 gap-2">
                  <div className="rounded-lg border border-white/[0.06] bg-slate-900/50 p-2.5">
                    <span className="text-[8px] font-mono text-slate-600 uppercase tracking-wider">Impact Score</span>
                    <p className="text-lg font-bold text-red-400 mt-0.5">
                      {Math.round((results.impactForecast || []).reduce((a, f) => a + (f?.risk ?? 0), 0) / Math.max((results.impactForecast || []).length, 1))}%
                    </p>
                  </div>
                  <div className="rounded-lg border border-white/[0.06] bg-slate-900/50 p-2.5">
                    <span className="text-[8px] font-mono text-slate-600 uppercase tracking-wider">Recovery Duration</span>
                    <p className="text-lg font-bold text-cyan-400 mt-0.5">
                      {(results.recoveryTimeline || []).reduce((a, s) => a + (parseInt(s?.duration) || 0), 0)}min
                    </p>
                  </div>
                  <div className="rounded-lg border border-white/[0.06] bg-slate-900/50 p-2.5">
                    <span className="text-[8px] font-mono text-slate-600 uppercase tracking-wider">Team Involved</span>
                    <p className="text-lg font-bold text-purple-400 mt-0.5 truncate">
                      {[...new Set((results.recoveryTimeline || []).map(s => s?.owner))].join(', ')}
                    </p>
                  </div>
                </div>

                <div className="rounded-lg border border-white/[0.06] bg-slate-900/50 p-3">
                  <h3 className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <svg className="w-3 h-3 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Incident Replay Timeline
                  </h3>
                  <div className="relative pt-4 pb-1">
                    <div className="absolute top-[22px] left-0 right-0 h-0.5 bg-slate-800" />
                    <div className="flex items-start justify-between overflow-x-auto gap-1">
                      {(timelineHistory || []).map((ev, i) => {
                        const sev = severityColor[ev?.severity] || severityColor.medium
                        const dotColors = { critical: '#ef4444', high: '#f97316', medium: '#eab308' }
                        return (
                          <button key={i} type="button" onClick={() => setActiveTimelineIdx(activeTimelineIdx === i ? -1 : i)} className="flex flex-col items-center shrink-0 w-20 group relative">
                            <div className={`w-3 h-3 rounded-full ${sev.dot} ring-2 ring-slate-900 transition-transform group-hover:scale-125`}
                              style={{ boxShadow: activeTimelineIdx === i ? `0 0 8px ${dotColors[ev?.severity] || '#eab308'}` : 'none' }} />
                            <span className="text-[7px] font-mono text-slate-600 text-center leading-tight truncate w-full mt-0.5">{ev?.title?.split(' ').slice(0, 2).join(' ') || ''}</span>
                            <span className="text-[6px] font-mono text-slate-700">{ev?.date?.slice(5) || ''}</span>
                            {activeTimelineIdx === i && (
                              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-1 p-1.5 rounded bg-slate-800 border border-white/[0.06] absolute top-8 z-20 w-36">
                                <p className="text-[8px] text-slate-300">{ev?.description}</p>
                                <span className="text-[7px] font-mono text-cyan-400">{ev?.duration}</span>
                              </motion.div>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="rounded-lg border border-white/[0.06] bg-slate-900/50 p-2.5">
                    <h3 className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Failure Path</h3>
                    <div className="flex items-end gap-0.5 h-16">
                      {(evolution || []).map((e, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center justify-end gap-0.5">
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${e?.risk ?? 0}%` }}
                            transition={{ duration: 0.5, delay: i * 0.05 }}
                            className="w-full rounded-t"
                            style={{
                              backgroundColor: (e?.risk ?? 0) > 70 ? '#ef4444' : (e?.risk ?? 0) > 50 ? '#f97316' : '#eab308',
                              minHeight: '4px',
                            }}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between mt-0.5">
                      {(evolution || []).map((e, i) => (
                        <span key={i} className="text-[6px] font-mono text-slate-700">{e?.month || ''}</span>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-lg border border-white/[0.06] bg-slate-900/50 p-2.5">
                    <h3 className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Root Cause</h3>
                    {((results.rootCauses || [])[0]) && (
                      <div>
                        <p className="text-[9px] font-semibold text-white truncate">{(results.rootCauses[0])?.title}</p>
                        <div className="mt-1 space-y-0.5">
                          {((results.rootCauses[0])?.eventTimeline || []).slice(0, 3).map((ev, j) => (
                            <div key={j} className="flex items-center gap-1">
                              <div className="w-1 h-1 rounded-full bg-cyan-400 shrink-0" />
                              <span className="text-[7px] font-mono text-cyan-400 shrink-0">{ev?.time || ''}</span>
                              <span className="text-[7px] text-slate-500 truncate">{ev?.event || ''}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="rounded-lg border border-white/[0.06] bg-slate-900/50 p-2.5">
                    <h3 className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Recovery</h3>
                    <div className="flex items-end gap-1 h-16">
                      {(results.recoveryTimeline || []).map((step, i) => {
                        const stepColors = ['#a855f7', '#22d3ee', '#d946ef', '#f59e0b', '#22c55e']
                        const mins = parseInt(step?.duration) || 1
                        return (
                          <div key={i} className="flex-1 flex flex-col items-center gap-0.5 group relative">
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: `${Math.min(mins * 4, 60)}px` }}
                              transition={{ duration: 0.4, delay: i * 0.08 }}
                              className="w-full rounded-sm"
                              style={{ backgroundColor: stepColors[i], opacity: 0.7 }}
                            />
                            <span className="text-[6px] font-mono text-slate-700">{step?.step?.slice(0, 3) || ''}</span>
                            <div className="hidden group-hover:block absolute bottom-full mb-1 z-20 bg-slate-800 border border-white/[0.06] rounded p-1 w-28 pointer-events-none">
                              <p className="text-[7px] text-slate-300">{step?.step}: {step?.duration}</p>
                              <p className="text-[6px] text-slate-500">{step?.detail}</p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div className="rounded-lg border border-white/[0.06] bg-slate-900/50 p-2.5">
                    <h3 className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Blast Radius</h3>
                    <div className="space-y-1">
                      {(results.impactForecast || []).slice(0, 4).map((f) => {
                        const impactColors = { downtime: '#ef4444', delay: '#f59e0b', overload: '#a855f7', failure: '#f97316' }
                        return (
                          <div key={f?.service} className="flex items-center gap-1">
                            <svg width="20" height="20" viewBox="0 0 20 20" className="-rotate-90 shrink-0">
                              <circle cx="10" cy="10" r="7" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="2.5" />
                              <motion.circle cx="10" cy="10" r="7" fill="none" stroke={impactColors[f?.impact] || '#f97316'} strokeWidth="2.5" strokeLinecap="round"
                                strokeDasharray={2 * Math.PI * 7} initial={{ strokeDashoffset: 2 * Math.PI * 7 }}
                                animate={{ strokeDashoffset: 2 * Math.PI * 7 * (1 - (f?.risk ?? 0) / 100) }} transition={{ duration: 0.5 }} />
                            </svg>
                            <span className="text-[7px] text-slate-500 w-10 truncate">{f?.service?.split(' ')[0] || ''}</span>
                            <div className="flex-1 min-w-0">
                              <span className="text-[7px] font-mono text-slate-600">{f?.risk ?? 0}%</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-white/[0.06] bg-slate-900/50 p-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <svg className="w-3 h-3 text-fuchsia-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                      </svg>
                      Replay Controls
                    </h3>
                    <StatusBadge status="warning" label={`${(replays || []).length} replays`} />
                  </div>
                  <div className="flex items-center gap-2 mt-2 overflow-x-auto">
                    {(replays || []).slice(0, 3).map((r, i) => (
                      <div key={i} className="flex items-center gap-2 rounded-lg border border-white/[0.04] bg-white/[0.02] px-3 py-1.5 shrink-0">
                        <div className="flex-1 min-w-0">
                          <p className="text-[9px] font-semibold text-white truncate">{r?.title}</p>
                          <span className="text-[7px] font-mono text-slate-600">{r?.date} · {r?.duration}</span>
                        </div>
                        <button type="button" className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center hover:bg-cyan-500/30 transition-all shrink-0">
                          <svg className="w-2.5 h-2.5 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5.14v14.72a1 1 0 001.5.86l11-7.36a1 1 0 000-1.72l-11-7.36A1 1 0 008 5.14z" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* 3. Incident Replay Engine */}
              <motion.div variants={item}>
                <div className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                      <svg className="w-3.5 h-3.5 text-fuchsia-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                      </svg>
                      Incident Replay Engine
                    </h3>
                    <StatusBadge status="warning" label={`${replays.length} replays`} />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {replays.map((r, i) => (
                      <ReplayCard key={r.title} replay={r} index={i} />
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* 4. Root Cause Journey */}
              <motion.div variants={item}>
                <div className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                      <svg className="w-3.5 h-3.5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                      </svg>
                      Root Cause Journey
                    </h3>
                    <StatusBadge status="error" label={`${results.rootCauses.length} deep-dives`} />
                  </div>
                  <div className="space-y-5">
                    {results.rootCauses.map((rca, i) => (
                      <RootCauseChainCard key={rca.id} rca={rca} index={i} />
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* 5. Recovery Analysis */}
              <motion.div variants={item}>
                <div className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                      <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
                      </svg>
                      Recovery Analysis — Payment Pipeline Outage
                    </h3>
                    <StatusBadge status="info" label="45min total" />
                  </div>
                  <RecoveryTimelineCard steps={results.recoveryTimeline} />
                </div>
              </motion.div>

              {/* 6. Lessons Learned */}
              <motion.div variants={item}>
                <div className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                      <svg className="w-3.5 h-3.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                      </svg>
                      Lessons Learned
                    </h3>
                    <StatusBadge status="warning" label={`${results.lessons.length} lessons`} />
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {results.lessons.map((l, i) => (
                      <LessonCard key={i} lesson={l} index={i} />
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* 7. Historical Comparisons */}
              <motion.div variants={item}>
                <div className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                      <svg className="w-3.5 h-3.5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
                      </svg>
                      Historical Comparisons — Before vs After
                    </h3>
                    <StatusBadge status="info" label="Payment Pipeline Outage" />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    {results.comparisons.map((m, i) => (
                      <HistoricalComparisonCard key={m.metric} metric={m} />
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* 8. Pattern Detection */}
              <motion.div variants={item}>
                <div className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                      <svg className="w-3.5 h-3.5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.75v3.375m0 0l3-3m-3 3l-3-3M3.75 13.5h10.5m-10.5 0l3 3m-3-3l-3-3m12 3h3.375m-3.375 0l3 3m-3-3l3-3" />
                      </svg>
                      Pattern Detection
                    </h3>
                    <StatusBadge status="warning" label={`${results.patterns.length} patterns`} />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {results.patterns.map((p, i) => {
                      const total = p.severityDist.critical + p.severityDist.high + p.severityDist.medium
                      const statusStyle = p.status === 'active' ? 'border-red-500/20 bg-red-500/[0.03]' :
                        p.status === 'monitoring' ? 'border-yellow-500/20 bg-yellow-500/[0.03]' :
                        'border-green-500/20 bg-green-500/[0.03]'
                      const statusColor = p.status === 'active' ? 'text-red-400 bg-red-500/10' :
                        p.status === 'monitoring' ? 'text-yellow-400 bg-yellow-500/10' :
                        'text-green-400 bg-green-500/10'
                      const trendIcon = p.trend === 'up' ? '\u2191' : p.trend === 'down' ? '\u2193' : '\u2192'
                      const trendColor = p.trend === 'up' ? 'text-red-400' : p.trend === 'down' ? 'text-green-400' : 'text-yellow-400'
                      const sparkData = patternSparklines[p.name] || [1, 2, 3, 4, 5, 6]
                      return (
                        <motion.div
                          key={p.name}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.06 }}
                          className={`rounded-lg border ${statusStyle} p-4 hover:border-white/[0.12] transition-all`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-semibold text-white mb-1 truncate">{p.name}</h4>
                              <div className="flex items-center gap-2">
                                <span className="text-lg font-bold text-white tabular-nums">{p.frequency}</span>
                                <span className={`text-sm font-mono ${trendColor}`}>{trendIcon}</span>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              <span className={`rounded-full px-1.5 py-0.5 text-[7px] font-semibold ${statusColor}`}>{p.status}</span>
                              <span className="text-[8px] text-slate-600">{p.confidence}% conf</span>
                            </div>
                          </div>
                          <div className="flex justify-center my-2">
                            <Sparkline data={sparkData} color={p.trend === 'up' ? '#ef4444' : p.trend === 'down' ? '#22c55e' : '#eab308'} height={28} width={100} />
                          </div>
                          <div className="flex items-center justify-center gap-1 mb-2">
                            {[
                              { label: 'C', count: p.severityDist.critical, color: '#ef4444' },
                              { label: 'H', count: p.severityDist.high, color: '#f97316' },
                              { label: 'M', count: p.severityDist.medium, color: '#eab308' },
                            ].map((sev, si) => (
                              <div key={sev.label} className="flex flex-col items-center">
                                <svg width="32" height="32" viewBox="0 0 32 32" className="-rotate-90">
                                  <circle cx="16" cy="16" r="12" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="3" />
                                  <motion.circle cx="16" cy="16" r="12" fill="none" stroke={sev.color} strokeWidth="3" strokeLinecap="round"
                                    strokeDasharray={2 * Math.PI * 12}
                                    animate={{ strokeDashoffset: 2 * Math.PI * 12 * (1 - sev.count / total) }} transition={{ duration: 0.8, delay: si * 0.1 }} />
                                  <text x="16" y="19" textAnchor="middle" fill={sev.color} fontSize="8" fontWeight="700" fontFamily="monospace" transform="rotate(90 16 16)">{sev.count}</text>
                                </svg>
                                <span className="text-[7px] text-slate-500 font-mono">{sev.label}</span>
                              </div>
                            ))}
                          </div>
                          <div className="flex items-center justify-between text-[8px] text-slate-700 border-t border-white/[0.06] pt-2 font-mono">
                            <span>First: {p.firstSeen}</span>
                            <span>Last: {p.lastSeen}</span>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              </motion.div>

              {/* 9. AI Future Prediction */}
              <motion.div variants={item}>
                <div className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                      <svg className="w-3.5 h-3.5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.125C3.75 12.504 4.254 12 4.875 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C8.25 20.496 7.746 21 7.125 21h-2.25A1.125 1.125 0 013.75 19.875v-6.75zM10.5 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM17.25 4.125c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                      </svg>
                      AI Future Prediction
                    </h3>
                    <StatusBadge status="error" label={`${results.predictions.length} forecasts`} />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    {results.predictions.map((p, i) => (
                      <PredictionCard key={p.window} pred={p} index={i} />
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* 10. Prevention Suggestions */}
              <motion.div variants={item}>
                <div className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                      <svg className="w-3.5 h-3.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Prevention Suggestions
                    </h3>
                    <StatusBadge status="success" label={`${results.recommendations.length} recommendations`} />
                  </div>
                  <div className="space-y-2">
                    {results.recommendations.map((r, i) => {
                      const statusBadgeStyle = r.status === 'completed' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                        r.status === 'in_progress' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                        'bg-slate-500/10 text-slate-400 border-slate-500/20'
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.06 }}
                          className="rounded-lg border border-white/[0.04] bg-white/[0.02] p-3 hover:border-green-500/20 hover:bg-white/[0.04] transition-all"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex flex-col items-center gap-1 mt-0.5 min-w-[32px]">
                              <span className={`rounded px-1.5 py-0.5 text-[8px] font-bold ${
                                r.priority === 'P0' ? 'bg-red-500/10 text-red-400' :
                                r.priority === 'P1' ? 'bg-yellow-500/10 text-yellow-400' :
                                'bg-slate-500/10 text-slate-400'
                              }`}>{r.priority}</span>
                              <span className={`rounded-full border px-1 py-0.5 text-[6px] font-semibold ${statusBadgeStyle}`}>{r.status.replace('_', ' ')}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-white mb-0.5">{r.action}</p>
                              <p className="text-[9px] text-slate-500 leading-relaxed mb-1.5">{r.detail}</p>
                              <div className="flex items-center gap-3 text-[8px] text-slate-600 flex-wrap">
                                <span className="flex items-center gap-1">
                                  <svg className="w-2.5 h-2.5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.94-4.125L12 1.5l-2.06 3.375m2.94 0h-2.94M10.5 6.375L6.44 2.25m.06 4.5L2.25 10.5m4.5 0l2.81 2.81M15 12l-2.25 2.25M15 12l2.25-2.25M5.25 12l-2.25 2.25m4.5 0l2.25-2.25" />
                                  </svg>
                                  {r.owner}
                                </span>
                                <span className="flex items-center gap-1">
                                  <svg className="w-2.5 h-2.5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  {r.effort}
                                </span>
                                <span className="flex items-center gap-1">
                                  <svg className="w-2.5 h-2.5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                  </svg>
                                  {r.impact}
                                </span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              </motion.div>

              {/* 11. Impact Forecast */}
              <motion.div variants={item}>
                <div className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                      <svg className="w-3.5 h-3.5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                      </svg>
                      Impact Forecast
                    </h3>
                    <StatusBadge status="error" label="If no action taken" />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <ImpactForecastCard forecasts={results.impactForecast} />
                    <div className="rounded-lg border border-white/[0.04] bg-white/[0.02] p-4">
                      <h4 className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-3">Risk Distribution</h4>
                      <div className="flex flex-col justify-center h-full">
                        <div className="flex items-center gap-4 justify-center mb-2">
                          {results.impactForecast.map((f) => {
                            const colors = {
                              downtime: '#ef4444',
                              delay: '#f59e0b',
                              overload: '#a855f7',
                              failure: '#f97316',
                            }
                            return (
                              <div key={f.service} className="flex flex-col items-center">
                                <div
                                  className="w-12 h-12 rounded-full flex items-center justify-center text-xs font-bold font-mono text-white"
                                  style={{ backgroundColor: `${colors[f.impact]}30`, border: `2px solid ${colors[f.impact]}` }}
                                >
                                  {f.risk}%
                                </div>
                                <span className="text-[7px] text-slate-600 mt-1 whitespace-nowrap">{f.service.split(' ')[0]}</span>
                              </div>
                            )
                          })}
                        </div>
                        <p className="text-[9px] text-slate-500 text-center leading-relaxed">
                          Combined risk score: <span className="text-red-400 font-semibold font-mono">
                            {Math.round(results.impactForecast.reduce((a, f) => a + f.risk, 0) / results.impactForecast.length)}%
                          </span> — High priority intervention recommended
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Historical Risk Evolution */}
              <motion.div variants={item}>
                <div className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                      <svg className="w-3.5 h-3.5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                      </svg>
                      Historical Risk Evolution
                    </h3>
                    <StatusBadge status="info" label="Jan-Jun 2024" />
                  </div>
                  <RiskChart />
                </div>
              </motion.div>

              {/* Historical Deployment Explorer */}
              <motion.div variants={item}>
                <div className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                      <svg className="w-3.5 h-3.5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
                      </svg>
                    </h3>
                    <StatusBadge status="info" label={`${deployments.length} deployments`} />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {deployments.map((d, i) => (
                      <DeploymentCard key={d.service} deploy={d} index={i} />
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Time Navigation Controls */}
              <motion.div variants={item}>
                <div className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                      <svg className="w-3.5 h-3.5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                      </svg>
                      Time Navigation Controls
                    </h3>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono text-slate-600">You are here:</span>
                      <span className="text-xs font-mono font-semibold text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded border border-cyan-500/20">June 2024</span>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {['1 month ago', '3 months', '6 months', '1 year'].map((label) => {
                        const isActive = timeNav === label
                        return (
                          <button
                            key={label}
                            type="button"
                            onClick={() => setTimeNav(label)}
                            className={`px-3 py-1.5 rounded-lg text-[9px] font-mono font-semibold transition-all ${
                              isActive
                                ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
                                : 'bg-white/[0.03] text-slate-600 border border-white/[0.06] hover:border-purple-500/20 hover:text-slate-300'
                            }`}
                          >
                            {label}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        
      </motion.div>
      <NarrativeCTA currentPage="/time-machine" confidence={87} impact="$120K avg incident cost" />
    </Layout>
  )
}
