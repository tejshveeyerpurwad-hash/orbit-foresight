import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Layout from '../components/Layout'
import StatusBadge from '../components/StatusBadge'

const presets = [
  'Add payment retry support',
  'Implement OAuth 2.0 SSO',
  'Migrate database connection pool',
  'Refactor billing module',
  'Deploy microservices monitoring',
]

const investigationData = {
  caseId: '#OV-2024-0847',
  status: 'ACTIVE',
  title: 'Payment Pipeline Failure — Forensic Analysis of Retry Queue Cascade & Circuit Breaker Gap',
  riskScore: 87,
  confidence: 94,
  keyFindings: 4,
  recommendationsCount: 5,
  totalFailures: 8,
  criticalFailures: 2,
  highFailures: 3,
  mediumFailures: 2,
  lowFailures: 1,
  mrsAnalyzed: 847,
  incidentsPrevented: 124,
  impactScore: 87,
  riskTimeline: [
    { phase: 'Design Phase', risk: 25, color: 'green' },
    { phase: 'Implementation', risk: 65, color: 'yellow' },
    { phase: 'Testing', risk: 78, color: 'orange' },
    { phase: 'Deployment', risk: 88, color: 'red' },
    { phase: 'Post-Release', risk: 55, color: 'yellow' },
  ],
  failureModes: [
    { mode: 'Retry queue overflow causes cascading failure', severity: 'critical', probability: 'High', impact: 'All payment flows blocked — 45min P0 outage', detection: 'Monitoring alert after 5 min of degraded throughput', mitigation: 'Add bounded retry queues with backpressure mechanism' },
    { mode: 'Circuit breaker misconfiguration causes silent failures', severity: 'critical', probability: 'Medium', impact: 'Failed transactions without error logs for 30+ min', detection: 'Customer complaints escalated through support tickets', mitigation: 'Add comprehensive integration tests with fault injection scenarios' },
    { mode: 'Billing reconciliation delay during rollout', severity: 'high', probability: 'Low', impact: '15K invoices delayed up to 3 hours', detection: 'Billing dashboard alert triggered by batch processing lag', mitigation: 'Feature flag with gradual rollout (10% → 50% → 100%) over 48h' },
    { mode: 'API gateway timeout regression', severity: 'high', probability: 'Medium', impact: 'Payment requests timeout under load > 500 RPS', detection: 'APM latency spike alert crossing 5s P99 threshold', mitigation: 'Update timeout configs with load testing validation at 2x expected traffic' },
    { mode: 'Database connection pool exhaustion', severity: 'high', probability: 'Low', impact: 'All services unable to connect to DB simultaneously', detection: 'Connection pool monitoring alert at 95% utilization', mitigation: 'Add connection pooling with max limit per service instance' },
    { mode: 'Webhook delivery failure on retry events', severity: 'medium', probability: 'Medium', impact: 'Merchants not notified of retry status for 2hr window', detection: 'Webhook delivery log audit during incident post-mortem', mitigation: 'Add idempotency keys and dead letter queue for failed deliveries' },
    { mode: 'Memory leak in retry worker loop', severity: 'medium', probability: 'Low', impact: 'Worker pod OOM kill after 4 hours continuous operation', detection: 'K8s pod restart count alert exceeding threshold', mitigation: 'Add memory limits and leak detection tests in CI pipeline' },
    { mode: 'Monitoring dashboard missing retry metrics', severity: 'low', probability: 'High', impact: 'Blind spot during incident response — no retry KPIs visible', detection: 'Manual discovery during incident by on-call engineer', mitigation: 'Add retry-related metrics to operations dashboard with alert thresholds' },
  ],
  mrs: [
    { id: 'MR #142', author: '@alice', date: 'May 12', desc: 'Failed integration tests due to missing retry config', outcome: 'Incident', match: 87, files: 12, risk: 'high' },
    { id: 'MR #198', author: '@bob', date: 'Jun 1', desc: 'Caused retry queue overflow in production — 45min outage', outcome: 'Incident', match: 92, files: 8, risk: 'critical' },
    { id: 'MR #211', author: '@carol', date: 'Jun 15', desc: 'Introduced N+1 query in billing report causing slow queries', outcome: 'Near Miss', match: 74, files: 5, risk: 'medium' },
    { id: 'MR #87', author: '@alice', date: 'Apr 20', desc: 'Payment timeout regression after major refactor of handler', outcome: 'Incident', match: 89, files: 15, risk: 'high' },
    { id: 'MR #305', author: '@dave', date: 'Jul 2', desc: 'Race condition in session invalidation handler for auth flow', outcome: 'Incident', match: 91, files: 6, risk: 'critical' },
  ],
  incidents: [
    { title: 'Production outage — Payment pipeline down 45min', date: 'Jun 1', cause: 'Retry queue overflow without circuit breaker', impact: 'All payment flows blocked for 45 minutes', duration: '45min', rootCause: 'Missing backpressure mechanism in payment worker', services: ['Payment Service', 'API Gateway'], severity: 'critical', lessons: 'Add circuit breaker pattern to all retry loops' },
    { title: 'Degraded billing processing — 3hr delay', date: 'May 15', cause: 'Billing worker OOM from unbounded retry loop', impact: '15K invoices delayed by 3+ hours', duration: '3hr', rootCause: 'Unbounded retry queue exhausted heap memory', services: ['Billing Service'], severity: 'high', lessons: 'Bound retry counts and add memory limits to workers' },
    { title: 'Webhook delivery failure — partial data loss', date: 'Apr 28', cause: 'Missing idempotency keys caused duplicate webhook events', impact: '2% merchants affected by duplicate notifications', duration: '2hr', rootCause: 'No idempotency checking in webhook handler', services: ['Notification Service', 'Webhook Gateway'], severity: 'medium', lessons: 'Idempotency keys required for all webhook deliveries' },
  ],
  deps: [
    { service: 'Payment Service', deps: ['Auth Service', 'Database', 'Redis Cache'], risk: 87, critical: true },
    { service: 'Billing Service', deps: ['Auth Service', 'Redis Cache', 'Payment Service'], risk: 65, critical: false },
    { service: 'Notification Service', deps: ['Auth Service'], risk: 45, critical: false },
    { service: 'API Gateway', deps: ['Payment Service', 'Auth Service', 'Billing Service'], risk: 72, critical: true },
  ],
  recommendations: [
    { action: 'Add circuit breaker pattern to all retry loops across payment services', priority: 'P0', impact: 'Prevents cascading failures from retry storms', effort: '8 story points', owner: '@alice' },
    { action: 'Implement bounded retry queues with backpressure monitoring and alerts', priority: 'P0', impact: 'Prevents queue overflow incidents under traffic spikes', effort: '5 story points', owner: '@bob' },
    { action: 'Add comprehensive integration tests with fault injection scenarios', priority: 'P1', impact: 'Catches misconfiguration before production deployment', effort: '5 story points', owner: '@carol' },
    { action: 'Create deployment runbook with rollback procedures for payment changes', priority: 'P1', impact: 'Reduces MTTR by 60% during incident response', effort: '3 story points', owner: '@alice' },
    { action: 'Add retry-related metrics to operations dashboard with alert thresholds', priority: 'P2', impact: 'Improves incident detection time from 5min to under 1min', effort: '2 story points', owner: '@dave' },
  ],
  rootCauses: [
    { title: 'Missing Backpressure in Payment Worker', cause: 'Retry queue overflow without circuit breaker or backpressure mechanism', impact: 'Complete payment pipeline outage for 45 minutes', duration: '45min', services: ['Payment Service', 'API Gateway'], lesson: 'All retry loops must implement circuit breaker pattern with configurable thresholds' },
    { title: 'Unbounded Retry Queue Heap Exhaustion', cause: 'Billing worker OOM from unbounded retry queue consuming all heap memory', impact: '15K invoices delayed by 3+ hours', duration: '3hr', services: ['Billing Service'], lesson: 'Bound retry counts and enforce memory limits on all background workers' },
    { title: 'Missing Idempotency in Webhook Handler', cause: 'Duplicate webhook events due to missing idempotency key checking', impact: '2% of merchants received duplicate notifications', duration: '2hr', services: ['Notification Service', 'Webhook Gateway'], lesson: 'Idempotency keys are mandatory for all webhook delivery endpoints' },
  ],
  rootCauseChains: [
    { title: 'Circuit Breaker Cascade', chain: ['Missing circuit breaker in payment worker', 'Retry queue overflow under load spike', 'Complete payment pipeline outage (45min)'], descriptions: ['No backpressure mechanism configured in the payment worker retry loop — all failures retried immediately', 'Traffic spike caused unbounded retry queue to grow beyond memory limits, consuming all available heap', 'All payment flows blocked for 45 minutes — critical P0 incident declared with executive escalation'], confidences: [92, 87, 95], evidence: [12, 8, 15] },
    { title: 'Memory Exhaustion Chain', chain: ['Unbounded retry queue in billing worker', 'Worker OOM crash after 4hr continuous retry', '15K invoices delayed by 3+ hours'], descriptions: ['Billing worker had no upper bound on retry queue depth — could grow indefinitely under load', 'Heap exhaustion caused worker pod to be killed by OOM killer after 4 hours of sustained retries', 'Billing processing stalled completely leading to massive invoice backlog across 15K customers'], confidences: [91, 86, 93], evidence: [7, 5, 10] },
    { title: 'Idempotency Gap Chain', chain: ['Missing idempotency keys in webhook handler', 'Duplicate webhook events sent to merchants', '2% merchants received duplicate notifications'], descriptions: ['Webhook endpoints lacked idempotency key validation — same event could be delivered multiple times', 'Retry mechanism caused same event to be delivered 2-3 times to merchant endpoints', 'Merchants reported duplicate payment notifications and spam complaints to support team'], confidences: [88, 82, 90], evidence: [6, 4, 8] },
  ],
  propagation: [
    { from: 'Payment Service', to: 'Billing Service', risk: 87 },
    { from: 'Payment Service', to: 'API Gateway', risk: 92 },
    { from: 'Billing Service', to: 'Notification Service', risk: 65 },
    { from: 'API Gateway', to: 'Auth Service', risk: 54 },
    { from: 'Notification Service', to: 'Webhook Gateway', risk: 78 },
    { from: 'Payment Service', to: 'Database', risk: 71 },
  ],
  mitigations: [
    { phase: 'Immediate (24h)', actions: ['Roll back payment retry config to previous stable version to stop cascade', 'Restart all payment worker pods with memory limits enforced via K8s resource quotas', 'Add circuit breaker threshold override to stop cascading failures across services', 'Enable verbose logging for retry queue depth monitoring in production'], owner: '@bob', timeline: '24 hours' },
    { phase: 'Short-Term (Next Sprint)', actions: ['Implement bounded retry queues with configurable max depth (reduce from 10K to 1K)', 'Add health check endpoint exposing retry queue saturation as a metric', 'Deploy circuit breaker with half-open state to all external service calls', 'Create runbook for payment pipeline recovery procedures and rollback steps'], owner: '@alice', timeline: '2 weeks' },
    { phase: 'Long-Term (Architectural)', actions: ['Migrate to event-driven architecture with dead letter queues for failed messages', 'Implement chaos engineering pipeline with fault injection testing in staging', 'Add distributed tracing across all payment and billing services for visibility', 'Build automated canary analysis for all retry logic changes before prod rollout', 'Design idempotency framework for all webhook and async event handlers across the platform'], owner: '@carol', timeline: '3 months' },
  ],
  verdict: { risk: 'High', confidence: 88, findings: ['Missing circuit breaker in payment retry loop is primary root cause — 92% correlation confidence across 3 incidents', 'Retry queue overflow has caused 3 distinct incidents affecting 100K+ transactions and 15K invoices', 'No idempotency guarantees on 4 webhook endpoints — potential for data integrity issues in merchant systems'], action: 'Immediate remediation required: deploy circuit breaker fix and bounded retry queues before next deployment cycle. Long-term investment in event-driven architecture with dead letter queues is strongly recommended to prevent recurrence.' },
  evidenceTimeline: [
    { date: '2024-05-28', type: 'Code Change', description: 'Retry logic added to payment handler without circuit breaker protection', source: 'GitLab MR #142 — @alice', relevance: 92 },
    { date: '2024-05-30', type: 'Code Change', description: 'Circuit breaker config deployed to staging environment for testing', source: 'GitLab MR #156 — @bob', relevance: 85 },
    { date: '2024-06-01', type: 'Incident', description: 'Payment pipeline outage lasting 45 minutes in production', source: 'PagerDuty #INC-3841 — P0', relevance: 97 },
    { date: '2024-06-10', type: 'Config Change', description: 'Retry queue limits adjusted from 10K to 5K max depth', source: 'GitLab MR #198 — @carol', relevance: 78 },
    { date: '2024-06-15', type: 'Alert', description: 'Billing worker memory threshold breach detected at 92% heap usage', source: 'Datadog Alert — memory.pressure', relevance: 88 },
    { date: '2024-06-22', type: 'Code Change', description: 'Idempotency keys added to webhook endpoints for deduplication', source: 'GitLab MR #211 — @dave', relevance: 73 },
  ],
  correlations: [
    { incident: 'Payment pipeline outage', score: 87, commonCause: 'Missing circuit breaker in retry loop', services: ['Payment', 'API Gateway'], gap: '2 days' },
    { incident: 'Billing processing delay', score: 91, commonCause: 'Unbounded retry queue in worker', services: ['Billing Service'], gap: '5 days' },
    { incident: 'Webhook delivery failure', score: 78, commonCause: 'Missing idempotency keys in handler', services: ['Notification', 'Webhook Gateway'], gap: '3 days' },
    { incident: 'API gateway timeout spike', score: 84, commonCause: 'Connection pool exhaustion under load', services: ['API Gateway', 'Auth Service'], gap: '1 day' },
    { incident: 'Database connection stall', score: 72, commonCause: 'Pool limit misconfiguration in config', services: ['Database', 'Payment Service'], gap: '4 days' },
  ],
  heatmap: [
    { phase: 'Design', critical: 15, high: 25, medium: 10, low: 5 },
    { phase: 'Implementation', critical: 30, high: 45, medium: 20, low: 10 },
    { phase: 'Testing', critical: 55, high: 60, medium: 35, low: 15 },
    { phase: 'Deployment', critical: 80, high: 70, medium: 45, low: 25 },
    { phase: 'Post-Release', critical: 45, high: 50, medium: 30, low: 20 },
  ],
  blastRadius: {
    center: 'Payment Retry Logic Change',
    depth: '3 levels deep',
    totalServices: 7,
    zones: [
      { name: 'Payment Service', radius: 1, risk: 87, critical: true, files: 12 },
      { name: 'Billing Service', radius: 2, risk: 65, critical: false, files: 8 },
      { name: 'API Gateway', radius: 2, risk: 72, critical: true, files: 5 },
      { name: 'Notification Service', radius: 2, risk: 45, critical: false, files: 3 },
    ],
  },
  investigationTimeline: [
    { date: '2024-05-28', type: 'Detection', title: 'Monitoring alert triggered', description: 'Error rate spike detected on payment endpoint — PagerDuty alert fired automatically', team: 'Platform', duration: '2min' },
    { date: '2024-05-30', type: 'Analysis', title: 'Root cause identification', description: 'Engineering team traced error to missing circuit breaker in retry loop implementation', team: '@alice, @bob', duration: '45min' },
    { date: '2024-06-01', type: 'Escalation', title: 'Incident escalated to P0', description: 'Payment pipeline fully blocked — executive notified, cross-team incident bridge established', team: 'SRE, Platform', duration: '15min' },
    { date: '2024-06-10', type: 'Resolution', title: 'Hotfix deployed to production', description: 'Circuit breaker threshold override pushed to all payment worker instances', team: '@alice, Platform', duration: '30min' },
    { date: '2024-06-15', type: 'Review', title: 'Post-mortem analysis complete', description: 'Full RCA documented with 8 failure modes identified and mitigation plan drafted', team: 'Engineering', duration: '2hr' },
    { date: '2024-06-22', type: 'Closed', title: 'Case closed with recommendations', description: 'All findings documented. 5 recommendations pushed to backlog with P0/P1 prioritization', team: 'Platform', duration: '1hr' },
  ],
  liveFeed: [
    { time: '14:23:15', type: 'alert', message: 'Error rate spike >5% on payment endpoint — automated rollback triggered', severity: 'critical' },
    { time: '14:22:48', type: 'event', message: 'Circuit breaker opened on Payment Service after 15 consecutive failures', severity: 'high' },
    { time: '14:22:12', type: 'investigation', message: 'AI analysis completed — 8 failure modes identified across 4 services', severity: 'info' },
    { time: '14:21:30', type: 'risk', message: 'Risk propagation probability updated: Payment → Billing now at 87%', severity: 'warning' },
    { time: '14:20:55', type: 'alert', message: 'Billing worker memory threshold at 92% — potential OOM risk detected', severity: 'high' },
    { time: '14:20:10', type: 'event', message: 'New correlation found: MR #198 matches 92% with current incident signature', severity: 'info' },
    { time: '14:19:25', type: 'investigation', message: 'Blast radius analysis expanded — Notification Service added to impact zone', severity: 'warning' },
    { time: '14:18:40', type: 'risk', message: 'Webhook Gateway identified as downstream risk — propagation likelihood 78%', severity: 'medium' },
    { time: '14:18:00', type: 'event', message: 'Incident timeline updated — 6 forensic artifacts collected for evidence chain', severity: 'info' },
    { time: '14:17:20', type: 'alert', message: 'Database connection pool utilization at 85% — approaching critical threshold', severity: 'medium' },
  ],
  decisions: [
    { action: 'Deploy Now', confidence: 92, reasoning: 'Circuit breaker fix ready for production with automated rollback protection', team: '@alice', urgency: 'immediate' },
    { action: 'Monitor Closely', confidence: 85, reasoning: 'Retry queue still within safe limits — observe for 2 hours before escalation', team: '@bob', urgency: 'short' },
    { action: 'Rollback Changes', confidence: 78, reasoning: 'Revert last 3 MRs to restore stable state — 78% confidence in regression cause', team: '@carol', urgency: 'medium' },
    { action: 'Investigate Further', confidence: 94, reasoning: 'Additional correlation data needed — deep-dive into billing worker memory patterns', team: '@dave', urgency: 'long' },
  ],
  riskReduction: [
    { phase: 'Immediate', reduction: 65 },
    { phase: 'Short-Term', reduction: 85 },
    { phase: 'Long-Term', reduction: 95 },
  ],
  recommendationConfidence: [92, 88, 85, 78, 90],
  keyFindingsData: [
    { id: 'F-001', title: 'Missing Circuit Breaker', description: 'Payment retry loop lacks any circuit breaker pattern — all failures retry infinitely causing cascading collapse', severity: 'critical', icon: 'shield' },
    { id: 'F-002', title: 'Unbounded Retry Queue', description: 'Billing worker retry queue has no depth limit — memory exhaustion triggered under sustained load', severity: 'high', icon: 'chart' },
    { id: 'F-003', title: 'No Idempotency Keys', description: 'Webhook endpoints lack idempotency validation — duplicate events delivered during retry storms', severity: 'high', icon: 'link' },
  ],
  affectedSystems: [
    { name: 'Payment Service', impact: 'Critical', status: 'Degraded' },
    { name: 'Billing Service', impact: 'High', status: 'At Risk' },
    { name: 'API Gateway', impact: 'High', status: 'Degraded' },
    { name: 'Notification Service', impact: 'Medium', status: 'Stable' },
  ],
}

const severityColors = {
  critical: 'bg-red-500/20 text-red-400 border-red-500/30',
  high: 'bg-orange-500/15 text-orange-400 border-orange-500/20',
  medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/15',
  low: 'bg-green-500/10 text-green-400 border-green-500/15',
}

const riskBadgeColors = {
  critical: 'bg-red-500/15 text-red-400 border-red-500/25',
  high: 'bg-orange-500/15 text-orange-400 border-orange-500/25',
  medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  low: 'bg-green-500/10 text-green-400 border-green-500/20',
}

const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } }
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }

function AnimatedCounter({ value, suffix = '', className = '' }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (value === undefined || value === null) return
    let start = 0
    const step = Math.max(1, Math.floor(value / 60))
    const interval = setInterval(() => {
      start += step
      if (start >= value) { setCount(value); clearInterval(interval) }
      else setCount(start)
    }, 1500 / Math.max(1, value / step))
    return () => clearInterval(interval)
  }, [value])
  return <span className={className}>{count}{suffix}</span>
}

function RiskGauge({ score }) {
  const [animatedScore, setAnimatedScore] = useState(0)
  useEffect(() => {
    let start = 0
    const step = Math.max(1, Math.floor(score / 60))
    const interval = setInterval(() => {
      start += step
      if (start >= score) { setAnimatedScore(score); clearInterval(interval) }
      else setAnimatedScore(start)
    }, 1800 / Math.max(1, score / step))
    return () => clearInterval(interval)
  }, [score])
  const circumference = 2 * Math.PI * 42
  const offset = circumference - (animatedScore / 100) * circumference
  const strokeColor = animatedScore >= 80 ? '#ef4444' : animatedScore >= 50 ? '#f59e0b' : '#22c55e'
  const severityLabel = animatedScore >= 80 ? 'CRITICAL' : animatedScore >= 50 ? 'ELEVATED' : 'MODERATE'
  return (
    <div className="flex flex-col items-center relative">
      <svg width="120" height="120" viewBox="0 0 120 120" className="-rotate-90">
        <defs>
          <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.3" />
            <stop offset="100%" stopColor={strokeColor} stopOpacity="0.7" />
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r="42" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
        <circle cx="60" cy="60" r="42" fill="none" stroke={strokeColor} strokeWidth="8" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} style={{ transition: 'stroke-dashoffset 1.8s ease-out, stroke 0.3s' }} />
        <circle cx="60" cy="60" r="32" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="2 4" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-white drop-shadow-lg" style={{ color: strokeColor }}>{animatedScore}</span>
        <span className="text-[9px] text-slate-500 uppercase tracking-widest mt-0.5">{severityLabel}</span>
      </div>
    </div>
  )
}

function ConfidenceMeter({ confidence, label = 'INVESTIGATION CONFIDENCE' }) {
  const [animVal, setAnimVal] = useState(0)
  useEffect(() => {
    let start = 0
    const step = Math.max(1, Math.floor(confidence / 60))
    const interval = setInterval(() => {
      start += step
      if (start >= confidence) { setAnimVal(confidence); clearInterval(interval) }
      else setAnimVal(start)
    }, 1500 / Math.max(1, confidence / step))
    return () => clearInterval(interval)
  }, [confidence])
  const barColor = animVal >= 80 ? 'bg-green-500' : animVal >= 60 ? 'bg-yellow-500' : 'bg-red-500'
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500 font-mono tracking-wide">{label}</span>
        <span className="text-sm font-bold text-white">{animVal}%</span>
      </div>
      <div className="relative h-3 rounded-full bg-white/[0.06] overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-[1500ms] ease-out ${barColor}`} style={{ width: `${animVal}%` }} />
      </div>
    </div>
  )
}

function AnimatedBar({ value, height = 'h-1.5', color = 'bg-cyan-500' }) {
  const [width, setWidth] = useState(0)
  useEffect(() => { const t = setTimeout(() => setWidth(value), 100); return () => clearTimeout(t) }, [value])
  return (
    <div className={`${height} rounded-full bg-white/[0.06] overflow-hidden`}>
      <div className={`h-full rounded-full ${color} transition-all duration-1000 ease-out`} style={{ width: `${width}%` }} />
    </div>
  )
}

export default function IntelligenceCenter() {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [data] = useState(investigationData)
  const [expandedFailure, setExpandedFailure] = useState(null)
  const [expandedChain, setExpandedChain] = useState(null)
  const [expandedMitigation, setExpandedMitigation] = useState(null)
  const [expandedPhase, setExpandedPhase] = useState(null)
  const [selectedEvidence, setSelectedEvidence] = useState(null)
  const [hoveredDep, setHoveredDep] = useState(null)
  const [showPresets, setShowPresets] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState(-1)
  const [timeAgo, setTimeAgo] = useState('2 min ago')
  const feedRef = useRef(null)

  useEffect(() => {
    const interval = setInterval(() => {
      const mins = Math.floor(Math.random() * 3) + 1
      setTimeAgo(`${mins} min ago`)
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!feedRef.current) return
    const interval = setInterval(() => {
      feedRef.current.scrollTop = 0
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const filtered = input.trim() ? presets.filter(p => p.toLowerCase().includes(input.toLowerCase())) : presets

  const investigate = (text) => {
    if (!text.trim()) return
    setLoading(true)
    setTimeout(() => { setLoading(false) }, 2000)
  }

  const handleKey = (e) => {
    if (!showPresets || !filtered.length) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedPreset(p => Math.min(p + 1, filtered.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedPreset(p => Math.max(p - 1, 0)) }
    if (e.key === 'Enter' && selectedPreset >= 0) { e.preventDefault(); setInput(filtered[selectedPreset]); setShowPresets(false); investigate(filtered[selectedPreset]) }
    if (e.key === 'Escape') setShowPresets(false)
  }

  useEffect(() => { setSelectedPreset(-1) }, [input])

  const timelineEventIcons = {
    Detection: (
      <svg className="h-3.5 w-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
    Analysis: (
      <svg className="h-3.5 w-3.5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
      </svg>
    ),
    Escalation: (
      <svg className="h-3.5 w-3.5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    ),
    Resolution: (
      <svg className="h-3.5 w-3.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    Review: (
      <svg className="h-3.5 w-3.5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
    Closed: (
      <svg className="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.712 4.33a9.027 9.027 0 011.652 1.306c.51.51.944 1.064 1.306 1.652M16.712 4.33l-3.448 4.138m3.448-4.138a9.014 9.014 0 00-9.424 0M19.67 7.288l-4.138 3.448m4.138-3.448a9.014 9.014 0 010 9.424m-4.138-5.976a3.736 3.736 0 00-.88-1.388 3.737 3.737 0 00-1.388-.88m2.268 2.268a3.765 3.765 0 010 2.528m-2.268-4.796l-3.448 4.138m0 0a3.736 3.736 0 00-.88 1.388 3.765 3.765 0 000 2.528m.88-3.916l-4.138 3.448m0 0a9.027 9.027 0 01-1.306 1.652 9.027 9.027 0 01-1.652 1.306m2.958-2.958l-3.448 4.138m3.448-4.138a9.014 9.014 0 010 9.424" />
      </svg>
    ),
  }

  const feedTypeStyles = {
    alert: 'border-l-red-500 bg-red-500/[0.03]',
    event: 'border-l-cyan-500 bg-cyan-500/[0.02]',
    investigation: 'border-l-blue-500 bg-blue-500/[0.02]',
    risk: 'border-l-orange-500 bg-orange-500/[0.02]',
  }

  const decisionGlows = {
    'Deploy Now': 'shadow-green-500/20 border-green-500/30',
    'Monitor Closely': 'shadow-amber-500/20 border-amber-500/30',
    'Rollback Changes': 'shadow-orange-500/20 border-orange-500/30',
    'Investigate Further': 'shadow-red-500/20 border-red-500/30',
  }

  const decisionButtons = {
    'Deploy Now': 'bg-green-600 hover:bg-green-500',
    'Monitor Closely': 'bg-amber-600 hover:bg-amber-500',
    'Rollback Changes': 'bg-orange-600 hover:bg-orange-500',
    'Investigate Further': 'bg-red-600 hover:bg-red-500',
  }

  const decisionConfidenceColors = {
    'Deploy Now': 'text-green-400',
    'Monitor Closely': 'text-amber-400',
    'Rollback Changes': 'text-orange-400',
    'Investigate Further': 'text-red-400',
  }

  return (
    <Layout>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 pb-12">

        {/* ===== SECTION 1: FORENSIC INVESTIGATION HERO ===== */}
        <motion.div variants={item} className="glass-card overflow-hidden">
          <div className="relative p-5 sm:p-6">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.04] to-blue-500/[0.02] pointer-events-none" />
            <div className="relative">
              <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 shadow-lg shadow-cyan-500/10">
                    <svg className="h-5 w-5 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                    </svg>
                  </div>
                  <div>
                    <h1 className="font-mono text-xl font-bold tracking-widest text-white uppercase">Forensic Investigation Console</h1>
                    <p className="text-xs text-slate-500 font-mono tracking-wide">AI-Powered Risk Intelligence & Root Cause Analysis Platform</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <button onClick={() => navigator.clipboard.writeText(data.caseId)} className="group flex items-center gap-1.5 font-mono text-[10px] text-slate-500 border border-white/[0.08] rounded-md px-2.5 py-1 tracking-wider hover:border-cyan-500/30 hover:text-cyan-400 transition-all">
                    {data.caseId}
                    <svg className="h-3 w-3 text-slate-600 group-hover:text-cyan-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 8.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v8.25A2.25 2.25 0 006 16.5h2.25m8.25-8.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-7.5A2.25 2.25 0 018.25 18v-1.5m8.25-8.25h-3a4.5 4.5 0 01-4.5-4.5v-3" />
                    </svg>
                  </button>
                  <span className="flex items-center gap-1.5 text-[10px] text-green-400 font-mono tracking-wider border border-green-500/20 rounded-md px-2.5 py-1">
                    <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_6px_rgba(74,222,128,0.5)]" />
                    {data.status}
                  </span>
                  <span className="text-[10px] text-slate-600 font-mono border border-white/[0.06] rounded-md px-2.5 py-1">
                    Updated {timeAgo}
                  </span>
                </div>
              </div>
              <h2 className="text-sm text-slate-300 font-mono mb-5 leading-relaxed">{data.title}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                <div className="glass-card p-3 text-center hover:border-cyan-500/20 transition-all relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <div className="text-2xl font-bold text-cyan-400"><AnimatedCounter value={data.totalFailures} /></div>
                    <div className="text-[10px] text-slate-500 mt-1 font-mono tracking-wide">Total Failures</div>
                    <div className="flex justify-center gap-2 mt-1 text-[8px] text-slate-600">
                      <span className="text-red-400">{data.criticalFailures}C</span>
                      <span className="text-orange-400">{data.highFailures}H</span>
                      <span className="text-yellow-400">{data.mediumFailures}M</span>
                      <span className="text-green-400">{data.lowFailures}L</span>
                    </div>
                  </div>
                </div>
                <div className="glass-card p-3 text-center hover:border-red-500/20 transition-all relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <div className="text-2xl font-bold text-red-400"><AnimatedCounter value={data.criticalFailures} /></div>
                    <div className="text-[10px] text-slate-500 mt-1 font-mono tracking-wide">Critical Threats</div>
                    <div className="text-[8px] text-red-400/60 mt-1">Requires immediate action</div>
                  </div>
                </div>
                <div className="glass-card p-3 text-center hover:border-blue-500/20 transition-all relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <div className="text-2xl font-bold text-blue-400"><AnimatedCounter value={data.mrsAnalyzed} /></div>
                    <div className="text-[10px] text-slate-500 mt-1 font-mono tracking-wide">MRs Analyzed</div>
                    <div className="text-[8px] text-blue-400/60 mt-1">Historical correlation</div>
                  </div>
                </div>
                <div className="glass-card p-3 text-center hover:border-green-500/20 transition-all relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <div className="text-2xl font-bold text-green-400"><AnimatedCounter value={data.incidentsPrevented} /></div>
                    <div className="text-[10px] text-slate-500 mt-1 font-mono tracking-wide">Incidents Prevented</div>
                    <div className="text-[8px] text-green-400/60 mt-1">Proactive detection</div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 flex-wrap pt-3 border-t border-white/[0.04]">
                <div className="flex items-center gap-2">
                  <div className="w-16 h-16 relative">
                    <svg width="64" height="64" viewBox="0 0 64 64" className="-rotate-90">
                      <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="4" />
                      <circle cx="32" cy="32" r="26" fill="none" stroke="#22d3ee" strokeWidth="4" strokeLinecap="round" strokeDasharray={2 * Math.PI * 26} strokeDashoffset={2 * Math.PI * 26 * (1 - data.confidence / 100)} style={{ transition: 'stroke-dashoffset 2s ease-out' }} />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-bold text-cyan-400 font-mono">{data.confidence}%</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] text-slate-600 font-mono uppercase tracking-wider">Confidence</div>
                    <div className="text-[10px] text-cyan-400 font-mono">AI Certainty Level</div>
                  </div>
                </div>
                <div className="h-8 w-px bg-white/[0.06]" />
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-600 font-mono uppercase tracking-wider">Risk Score</span>
                  <span className="text-lg font-bold text-orange-400 font-mono">{data.riskScore}</span>
                </div>
                <div className="h-8 w-px bg-white/[0.06]" />
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-600 font-mono uppercase tracking-wider">Impact Score</span>
                  <span className="text-lg font-bold text-amber-400 font-mono">{data.impactScore}</span>
                </div>
                <div className="h-8 w-px bg-white/[0.06]" />
                <StatusBadge status="critical" label="HIGH RISK" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* ===== Investigation Input ===== */}
        <motion.div variants={item} className="glass-card p-4 sm:p-5">
          <form onSubmit={e => { e.preventDefault(); investigate(input) }}>
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input ref={el => { if (el) el.focus() }} type="text" value={input} onChange={e => { setInput(e.target.value); setShowPresets(true) }} onFocus={() => setShowPresets(true)} onKeyDown={handleKey}
                placeholder="Run a new investigation — enter feature, incident, or MR ID..."
                className="w-full rounded-xl border border-white/[0.06] bg-slate-800/60 py-3.5 pl-11 pr-44 text-sm text-white placeholder-slate-600 outline-none focus:border-cyan-500/50 focus:bg-slate-800/80 focus:shadow-[0_0_15px_rgba(6,182,212,0.1)] transition-all font-mono tracking-wide"
                disabled={loading} />
              <div className="absolute inset-y-1.5 right-1.5 flex items-center gap-1">
                <button type="submit" disabled={loading || !input.trim()}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2 text-sm font-semibold text-white transition-all hover:opacity-90 hover:shadow-lg hover:shadow-cyan-500/25 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed">
                  {loading ? (
                    <><svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Investigating</>
                  ) : (
                    <><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>Investigate</>
                  )}
                </button>
              </div>
            </div>
          </form>
          <AnimatePresence>
            {showPresets && filtered.length > 0 && !loading && (
              <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="mt-2 rounded-xl border border-white/[0.06] bg-slate-800/80 overflow-hidden">
                {filtered.map((s, i) => (
                  <button key={s} type="button"
                    className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${i === selectedPreset ? 'bg-cyan-500/10 text-cyan-300' : 'text-slate-500 hover:bg-white/[0.04] hover:text-white'}`}
                    onClick={() => { setInput(s); setShowPresets(false); investigate(s) }}>
                    <svg className="h-3.5 w-3.5 shrink-0 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>
                    {s}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="glass-card p-5 animate-pulse">
                  <div className="h-3 w-28 bg-slate-800 rounded mb-3" />
                  <div className="h-8 w-16 bg-slate-800 rounded mb-2" />
                  <div className="h-2 w-36 bg-slate-800 rounded" />
                </div>
              ))}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="glass-card p-5 animate-pulse"><div className="h-4 w-40 bg-slate-800 rounded mb-4" /><div className="h-48 bg-slate-800 rounded" /></div>
              <div className="glass-card p-5 animate-pulse"><div className="h-4 w-40 bg-slate-800 rounded mb-4" /><div className="h-48 bg-slate-800 rounded" /></div>
            </div>
            <div className="glass-card p-5 animate-pulse"><div className="h-4 w-48 bg-slate-800 rounded mb-4" />{Array.from({ length: 5 }).map((_, j) => (<div key={j} className="h-12 bg-slate-800 rounded mb-2" />))}</div>
          </motion.div>
        )}

        {!loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">

            {/* ===== SECTION 2: AI INVESTIGATION SUMMARY ===== */}
            <motion.div variants={item} className="glass-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-cyan-500/20 to-blue-500/20">
                  <svg className="h-3 w-3 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-white">AI Investigation Summary</h3>
                <StatusBadge status="info" label="Live Analysis" />
              </div>
              <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4 mb-4">
                <span className="text-[9px] text-slate-600 font-mono tracking-wider uppercase block mb-2">Executive Summary</span>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Forensic analysis of the Payment Pipeline failure identified a critical circuit breaker gap in the payment worker retry loop, which caused a cascading system failure affecting 4 services. The investigation analyzed 847 MRs across the platform, correlating 5 historical incidents with 92% confidence. Three distinct root cause chains were identified — circuit breaker cascade (primary), memory exhaustion (secondary), and idempotency gap (tertiary). Immediate remediation of the circuit breaker configuration is recommended to prevent recurrence of the P0 outage that blocked all payment flows for 45 minutes.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-3 mb-4">
                {data.keyFindingsData.map((kf, i) => (
                  <motion.div key={kf.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                    className={`rounded-lg border p-3 ${kf.severity === 'critical' ? 'border-red-500/20 bg-red-500/[0.03]' : 'border-orange-500/20 bg-orange-500/[0.02]'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-[9px] text-slate-600">{kf.id}</span>
                      <StatusBadge status={kf.severity} label={kf.severity} />
                    </div>
                    <h4 className="text-xs font-semibold text-slate-200 mb-1">{kf.title}</h4>
                    <p className="text-[10px] text-slate-500 leading-relaxed">{kf.description}</p>
                  </motion.div>
                ))}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 text-center">
                  <div className="text-[9px] text-slate-600 font-mono uppercase tracking-wider mb-1">Risk Score</div>
                  <div className="text-xl font-bold text-orange-400 font-mono">{data.riskScore}%</div>
                </div>
                <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 text-center">
                  <div className="text-[9px] text-slate-600 font-mono uppercase tracking-wider mb-1">Confidence</div>
                  <div className="text-xl font-bold text-cyan-400 font-mono">{data.confidence}%</div>
                </div>
                <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 text-center">
                  <div className="text-[9px] text-slate-600 font-mono uppercase tracking-wider mb-1">Impact</div>
                  <div className="text-xl font-bold text-red-400 font-mono">HIGH</div>
                </div>
                <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 text-center">
                  <div className="text-[9px] text-slate-600 font-mono uppercase tracking-wider mb-1">Urgency</div>
                  <div className="text-xl font-bold text-red-400 font-mono animate-pulse">CRITICAL</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {data.affectedSystems.map((sys, i) => (
                  <div key={i} className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-[10px] ${sys.impact === 'Critical' ? 'border-red-500/20 bg-red-500/[0.05]' : sys.impact === 'High' ? 'border-orange-500/20 bg-orange-500/[0.04]' : 'border-yellow-500/15 bg-yellow-500/[0.03]'}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${sys.impact === 'Critical' ? 'bg-red-500' : sys.impact === 'High' ? 'bg-orange-500' : 'bg-yellow-500'}`} />
                    <span className="text-slate-300 font-mono">{sys.name}</span>
                    <span className={`font-mono ${sys.impact === 'Critical' ? 'text-red-400' : sys.impact === 'High' ? 'text-orange-400' : 'text-yellow-400'}`}>{sys.impact}</span>
                    <span className="text-slate-600">·</span>
                    <span className="text-slate-500">{sys.status}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* ===== SECTION 3: ROOT CAUSE EXPLORER ===== */}
            <motion.div variants={item} className="glass-card p-5">
              <div className="flex items-center gap-2 mb-5">
                <div className="flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                  <svg className="h-3 w-3 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-white">Root Cause Explorer</h3>
                <span className="text-[10px] text-slate-600 font-mono">3 causal chains identified</span>
              </div>
              <div className="grid gap-6 lg:grid-cols-3">
                {data.rootCauseChains.map((chain, ci) => (
                  <div key={ci} className="relative">
                    <h4 className="text-[10px] text-slate-500 font-mono tracking-wider mb-3 uppercase">{chain.title}</h4>
                    <div className="relative flex flex-col items-center">
                      <svg className="absolute top-0 left-1/2 w-full h-full -translate-x-1/2 pointer-events-none" style={{ zIndex: 0 }}>
                        <line x1="50%" y1="0" x2="50%" y2="100%" stroke="rgba(6,182,212,0.12)" strokeWidth="1.5" strokeDasharray="4 4" />
                      </svg>
                      {chain.chain.map((cause, ni) => (
                        <div key={ni} className="relative z-10 w-full flex flex-col items-center">
                          {ni > 0 && (
                            <div className="flex flex-col items-center my-1">
                              <svg width="16" height="16" viewBox="0 0 16 16" className="text-cyan-500/40"><path d="M8 12L3 4h10z" fill="currentColor" /></svg>
                            </div>
                          )}
                          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: ni * 0.15 + ci * 0.1 }}
                            className={`w-full rounded-lg border p-3 transition-all hover:border-cyan-500/30 cursor-pointer ${ni === 0 ? 'border-orange-500/20 bg-orange-500/[0.03]' : ni === 1 ? 'border-yellow-500/20 bg-yellow-500/[0.02]' : 'border-red-500/20 bg-red-500/[0.03]'}`}
                            onClick={() => setExpandedChain(expandedChain === `${ci}-${ni}` ? null : `${ci}-${ni}`)}>
                            <div className="flex items-start justify-between gap-2">
                              <p className={`text-[10px] font-medium ${ni === 2 ? 'text-red-300' : 'text-slate-300'}`}>{cause}</p>
                              <span className="shrink-0 rounded bg-white/[0.04] px-1.5 py-0.5 text-[8px] font-mono text-slate-500">E:{chain.evidence[ni]}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-1.5">
                              <div className="flex-1 h-1 rounded-full bg-white/[0.06] overflow-hidden">
                                <div className={`h-full rounded-full ${chain.confidences[ni] >= 90 ? 'bg-green-500' : chain.confidences[ni] >= 80 ? 'bg-yellow-500' : 'bg-orange-500'}`} style={{ width: `${chain.confidences[ni]}%` }} />
                              </div>
                              <span className="text-[8px] font-mono text-slate-600">{chain.confidences[ni]}%</span>
                            </div>
                          </motion.div>
                          <AnimatePresence>
                            {expandedChain === `${ci}-${ni}` && (
                              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="w-full overflow-hidden">
                                <div className="mt-2 rounded-lg border border-white/[0.04] bg-white/[0.01] p-2.5 text-[9px] text-slate-500 leading-relaxed">
                                  {chain.descriptions[ni]}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* ===== SECTION 4: HISTORICAL INCIDENT INTELLIGENCE ===== */}
            <motion.div variants={item} className="glass-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-blue-500/20 to-indigo-500/20">
                  <svg className="h-3 w-3 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-white">Historical Incident Intelligence</h3>
                <span className="text-[10px] text-slate-600 font-mono">{data.mrs.length} correlated MRs</span>
              </div>
              <div className="space-y-2">
                {data.mrs.map((mr, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                    className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 hover:border-cyan-500/20 transition-all">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-cyan-400 font-bold">{mr.id}</span>
                        <span className="text-[10px] text-slate-600 font-mono">{mr.author}</span>
                        <span className="text-[10px] text-slate-600">·</span>
                        <span className="text-[10px] text-slate-600">{mr.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`rounded px-1.5 py-0.5 text-[8px] font-bold ${mr.outcome === 'Incident' ? 'bg-red-500/15 text-red-400' : 'bg-yellow-500/10 text-yellow-400'}`}>{mr.outcome}</span>
                        <span className={`rounded px-1.5 py-0.5 text-[8px] font-bold ${riskBadgeColors[mr.risk] || 'bg-slate-500/10 text-slate-400'}`}>{mr.risk.toUpperCase()}</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-400 mb-2">{mr.desc}</p>
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-[8px] text-slate-600 font-mono">Match Score</span>
                          <span className={`text-[9px] font-mono ${mr.match >= 85 ? 'text-green-400' : mr.match >= 70 ? 'text-yellow-400' : 'text-slate-500'}`}>{mr.match}%</span>
                        </div>
                        <AnimatedBar value={mr.match} color={mr.match >= 85 ? 'bg-green-500' : mr.match >= 70 ? 'bg-yellow-500' : 'bg-slate-500'} />
                      </div>
                      <span className="text-[8px] text-slate-700 font-mono whitespace-nowrap">{mr.files} files</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* ===== SECTION 5: BLAST RADIUS ANALYSIS ===== */}
            <motion.div variants={item} className="glass-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-orange-500/20 to-red-500/20">
                  <svg className="h-3 w-3 text-orange-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-white">Blast Radius Analysis</h3>
                <StatusBadge status="critical" label={`${data.blastRadius.totalServices} services affected`} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {data.blastRadius.zones.map((z, i) => (
                  <motion.div key={z.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                    className={`rounded-lg border p-4 transition-all hover:border-cyan-500/30 ${z.critical ? 'border-red-500/20 bg-red-500/[0.03]' : 'border-white/[0.06] bg-white/[0.02]'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${z.radius === 1 ? 'bg-red-500 animate-pulse' : z.radius === 2 ? 'bg-orange-500' : 'bg-cyan-500'}`} />
                        <span className="text-xs font-mono text-slate-200 font-semibold">{z.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {z.critical && <span className="rounded bg-red-500/15 px-1.5 py-0.5 text-[8px] font-bold text-red-400">CRITICAL</span>}
                        <span className={`text-[11px] font-mono font-bold ${z.risk >= 80 ? 'text-red-400' : z.risk >= 60 ? 'text-orange-400' : 'text-cyan-400'}`}>R:{z.risk}</span>
                      </div>
                    </div>
                    <div className="mb-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[8px] text-slate-600 font-mono">Risk Level</span>
                        <span className={`text-[9px] font-mono ${z.risk >= 80 ? 'text-red-400' : z.risk >= 60 ? 'text-orange-400' : 'text-cyan-400'}`}>{z.risk}%</span>
                      </div>
                      <AnimatedBar value={z.risk} color={z.risk >= 80 ? 'bg-red-500' : z.risk >= 60 ? 'bg-orange-500' : 'bg-cyan-500'} />
                    </div>
                    <div className="flex items-center justify-between text-[9px] text-slate-600">
                      <span className="font-mono">Files Changed: {z.files || 4}</span>
                      <span className="font-mono">Status: {z.critical ? 'Degraded' : 'Stable'}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="rounded-lg border border-amber-500/15 bg-amber-500/[0.03] p-3">
                <div className="flex items-center flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-[10px] text-amber-300 font-mono font-semibold">Business Impact</span>
                  </div>
                  <div className="flex items-center gap-4 text-[10px]">
                    <span className="text-slate-400"><span className="text-amber-400 font-mono font-bold">Revenue at Risk:</span> $202K</span>
                    <span className="text-slate-400"><span className="text-amber-400 font-mono font-bold">Customer Impact:</span> 15K users</span>
                    <span className="text-slate-400"><span className="text-amber-400 font-mono font-bold">SLA Exposure:</span> $12K</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ===== SECTION 6: DEPENDENCY INTELLIGENCE ===== */}
            <motion.div variants={item} className="glass-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-cyan-500/20 to-blue-500/20">
                  <svg className="h-3 w-3 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-white">Dependency Intelligence</h3>
                <span className="text-[10px] text-slate-600 font-mono">4 services · 7 dependency edges</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 mb-4">
                {data.deps.map((dep, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    onMouseEnter={() => setHoveredDep(dep.service)} onMouseLeave={() => setHoveredDep(null)}
                    className={`rounded-lg border p-3 transition-all ${dep.critical ? 'border-red-500/20 bg-red-500/[0.03]' : 'border-white/[0.06] bg-white/[0.02]'} ${hoveredDep === dep.service ? 'border-cyan-500/40' : ''}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${dep.critical ? 'bg-red-500 animate-pulse' : 'bg-cyan-500'}`} />
                        <span className="text-xs font-mono text-slate-200 font-semibold">{dep.service}</span>
                        {dep.critical && <span className="rounded bg-red-500/15 px-1.5 py-0.5 text-[7px] font-bold text-red-400">CRITICAL</span>}
                      </div>
                      <span className={`text-[10px] font-mono font-bold ${dep.risk >= 80 ? 'text-red-400' : dep.risk >= 60 ? 'text-orange-400' : 'text-cyan-400'}`}>{dep.risk}%</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {dep.deps.map((d, di) => (
                        <span key={di} className="inline-flex items-center gap-1 rounded bg-white/[0.03] px-2 py-0.5 text-[8px] font-mono text-slate-500 border border-white/[0.04]">
                          <svg className="h-2 w-2 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                          </svg>
                          {d}
                        </span>
                      ))}
                    </div>
                    <div className="mt-2 pt-2 border-t border-white/[0.04] flex items-center justify-between text-[8px] text-slate-700 font-mono">
                      <span>Upstream: {dep.deps.length} dep{dep.deps.length > 1 ? 's' : ''}</span>
                      <span>Propagation: {dep.risk}%</span>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="relative w-full overflow-x-auto">
                <svg viewBox="0 0 700 350" className="w-full max-w-4xl mx-auto" style={{ minWidth: 600 }}>
                  <defs>
                    <marker id="arrowCyan" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="rgba(6,182,212,0.5)" /></marker>
                    <marker id="arrowRed" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="rgba(239,68,68,0.5)" /></marker>
                    <filter id="glow"><feGaussianBlur stdDeviation="2" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                  </defs>
                  <pattern id="gridDep" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="0.5" />
                  </pattern>
                  <rect width="700" height="350" fill="url(#gridDep)" />
                  <path d="M 105 80 C 105 140, 200 140, 200 200" fill="none" stroke="rgba(239,68,68,0.35)" strokeWidth="2" markerEnd="url(#arrowRed)" strokeDasharray="6 3" />
                  <text x="120" y="130" fill="#ef4444" fontSize="7" fontFamily="monospace" opacity="0.7">depends-on</text>
                  <path d="M 105 80 C 105 140, 300 140, 300 200" fill="none" stroke="rgba(6,182,212,0.25)" strokeWidth="1.5" markerEnd="url(#arrowCyan)" />
                  <text x="160" y="150" fill="#64748b" fontSize="7" fontFamily="monospace" opacity="0.6">route-to</text>
                  <path d="M 330 80 C 330 140, 440 140, 440 200" fill="none" stroke="rgba(6,182,212,0.25)" strokeWidth="1.5" markerEnd="url(#arrowCyan)" />
                  <text x="370" y="150" fill="#64748b" fontSize="7" fontFamily="monospace" opacity="0.6">reads/writes</text>
                  <path d="M 330 80 C 330 140, 530 140, 530 200" fill="none" stroke="rgba(6,182,212,0.25)" strokeWidth="1.5" markerEnd="url(#arrowCyan)" />
                  <text x="400" y="160" fill="#64748b" fontSize="7" fontFamily="monospace" opacity="0.6">auth-check</text>
                  <path d="M 540 80 C 540 140, 620 140, 620 200" fill="none" stroke="rgba(6,182,212,0.2)" strokeWidth="1" markerEnd="url(#arrowCyan)" />
                  <text x="560" y="150" fill="#64748b" fontSize="7" fontFamily="monospace" opacity="0.6">event</text>
                  <path d="M 540 80 C 500 130, 380 130, 330 200" fill="none" stroke="rgba(6,182,212,0.2)" strokeWidth="1" markerEnd="url(#arrowCyan)" strokeDasharray="3 3" />
                  <text x="460" y="130" fill="#64748b" fontSize="7" fontFamily="monospace" opacity="0.5">sync</text>
                  <path d="M 105 280 L 220 280" fill="none" stroke="rgba(6,182,212,0.2)" strokeWidth="1" markerEnd="url(#arrowCyan)" />
                  <text x="130" y="275" fill="#64748b" fontSize="7" fontFamily="monospace" opacity="0.5">deliver</text>
                  <path d="M 330 200 L 330 280" fill="none" stroke="rgba(6,182,212,0.2)" strokeWidth="1" markerEnd="url(#arrowCyan)" />
                  <text x="340" y="245" fill="#64748b" fontSize="7" fontFamily="monospace" opacity="0.5">cache</text>
                  <path d="M 540 200 L 540 280" fill="none" stroke="rgba(6,182,212,0.2)" strokeWidth="1" markerEnd="url(#arrowCyan)" />
                  <text x="550" y="245" fill="#64748b" fontSize="7" fontFamily="monospace" opacity="0.5">verify</text>
                  <rect x="45" y="50" width="120" height="48" rx="8" fill="rgba(6,182,212,0.08)" stroke={hoveredDep === 'API Gateway' ? 'rgba(6,182,212,0.7)' : 'rgba(6,182,212,0.3)'} strokeWidth="1.5" className="transition-all cursor-pointer" onMouseEnter={() => setHoveredDep('API Gateway')} onMouseLeave={() => setHoveredDep(null)} />
                  <text x="105" y="73" textAnchor="middle" fill="#22d3ee" fontSize="10" fontWeight="600" fontFamily="monospace">API Gateway</text>
                  <text x="105" y="88" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace">Risk: 72</text>
                  <rect x="270" y="50" width="120" height="48" rx="8" fill="rgba(239,68,68,0.12)" stroke={hoveredDep === 'Payment Service' ? 'rgba(239,68,68,0.8)' : 'rgba(239,68,68,0.5)'} strokeWidth="2" filter="url(#glow)" className="transition-all cursor-pointer" onMouseEnter={() => setHoveredDep('Payment Service')} onMouseLeave={() => setHoveredDep(null)} />
                  <text x="330" y="73" textAnchor="middle" fill="#ef4444" fontSize="10" fontWeight="600" fontFamily="monospace">Payment Service</text>
                  <text x="330" y="88" textAnchor="middle" fill="#fca5a5" fontSize="8" fontFamily="monospace">Risk: 87</text>
                  <rect x="480" y="50" width="120" height="48" rx="8" fill="rgba(6,182,212,0.06)" stroke={hoveredDep === 'Billing Service' ? 'rgba(6,182,212,0.6)' : 'rgba(6,182,212,0.3)'} strokeWidth="1.5" className="transition-all cursor-pointer" onMouseEnter={() => setHoveredDep('Billing Service')} onMouseLeave={() => setHoveredDep(null)} />
                  <text x="540" y="73" textAnchor="middle" fill="#22d3ee" fontSize="10" fontWeight="600" fontFamily="monospace">Billing Service</text>
                  <text x="540" y="88" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace">Risk: 65</text>
                  <rect x="270" y="200" width="120" height="48" rx="8" fill="rgba(239,68,68,0.08)" stroke={hoveredDep === 'Database' ? 'rgba(239,68,68,0.6)' : 'rgba(239,68,68,0.4)'} strokeWidth="1.5" className="transition-all cursor-pointer" onMouseEnter={() => setHoveredDep('Database')} onMouseLeave={() => setHoveredDep(null)} />
                  <text x="330" y="223" textAnchor="middle" fill="#fca5a5" fontSize="10" fontWeight="600" fontFamily="monospace">Database</text>
                  <text x="330" y="238" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace">Risk: 55</text>
                  <rect x="480" y="200" width="120" height="48" rx="8" fill="rgba(6,182,212,0.04)" stroke={hoveredDep === 'Auth Service' ? 'rgba(6,182,212,0.5)' : 'rgba(6,182,212,0.2)'} strokeWidth="1" className="transition-all cursor-pointer" onMouseEnter={() => setHoveredDep('Auth Service')} onMouseLeave={() => setHoveredDep(null)} />
                  <text x="540" y="223" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="600" fontFamily="monospace">Auth Service</text>
                  <text x="540" y="238" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace">Risk: 38</text>
                  <rect x="45" y="250" width="120" height="40" rx="8" fill="rgba(6,182,212,0.04)" stroke={hoveredDep === 'Notification Service' ? 'rgba(6,182,212,0.5)' : 'rgba(6,182,212,0.2)'} strokeWidth="1" className="transition-all cursor-pointer" onMouseEnter={() => setHoveredDep('Notification Service')} onMouseLeave={() => setHoveredDep(null)} />
                  <text x="105" y="270" textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="600" fontFamily="monospace">Notification</text>
                  <text x="105" y="282" textAnchor="middle" fill="#64748b" fontSize="7" fontFamily="monospace">Risk: 45</text>
                  <rect x="230" y="250" width="100" height="40" rx="8" fill="rgba(6,182,212,0.03)" stroke="rgba(6,182,212,0.15)" strokeWidth="1" />
                  <text x="280" y="270" textAnchor="middle" fill="#94a3b8" fontSize="8" fontWeight="600" fontFamily="monospace">Webhook GW</text>
                  <text x="280" y="282" textAnchor="middle" fill="#64748b" fontSize="7" fontFamily="monospace">Risk: 42</text>
                  <rect x="480" y="250" width="100" height="40" rx="8" fill="rgba(6,182,212,0.03)" stroke="rgba(6,182,212,0.15)" strokeWidth="1" />
                  <text x="530" y="270" textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="600" fontFamily="monospace">Redis Cache</text>
                  <text x="530" y="282" textAnchor="middle" fill="#64748b" fontSize="7" fontFamily="monospace">Risk: 25</text>
                </svg>
              </div>
            </motion.div>

            {/* ===== SECTION 7: RISK PROPAGATION ENGINE ===== */}
            <motion.div variants={item} className="glass-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-red-500/20 to-orange-500/20">
                  <svg className="h-3 w-3 text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-white">Risk Propagation Engine</h3>
                <span className="text-[10px] text-slate-600 font-mono">{data.propagation.length} propagation paths</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {data.propagation.map((p, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                    className="relative rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 hover:border-cyan-500/20 transition-all group">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-red-500" />
                        <span className="text-[10px] font-mono text-slate-300 font-medium">{p.from}</span>
                      </div>
                      <svg className="h-4 w-4 text-cyan-500/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono text-slate-300 font-medium">{p.to}</span>
                        <span className="h-2 w-2 rounded-full bg-orange-500" />
                      </div>
                    </div>
                    <AnimatedBar value={p.risk} color={p.risk >= 80 ? 'bg-red-500' : p.risk >= 60 ? 'bg-orange-500' : 'bg-yellow-500'} />
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[8px] text-slate-700 font-mono">Propagation Likelihood</span>
                      <span className="text-[10px] font-mono text-red-400">{p.risk}%</span>
                    </div>
                    <div className="mt-2 rounded bg-white/[0.02] p-1.5 text-[8px] text-slate-600 leading-relaxed">
                      {p.from} failure → <span className="text-red-400">{p.risk}%</span> likely to affect {p.to}
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="mt-4 rounded-lg border border-cyan-500/10 bg-cyan-500/[0.03] p-3">
                <div className="flex items-center gap-2 text-[9px] text-cyan-400 font-mono mb-2">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                  Escalation Route
                </div>
                <div className="flex items-center gap-1 text-[9px] font-mono flex-wrap">
                  <span className="text-red-400">Payment</span>
                  <svg className="h-3 w-3 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                  <span className="text-orange-400">Billing</span>
                  <span className="text-slate-700">(87%)</span>
                  <svg className="h-3 w-3 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                  <span className="text-orange-300">Notification</span>
                  <span className="text-slate-700">(65%)</span>
                  <svg className="h-3 w-3 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                  <span className="text-yellow-300">Webhook</span>
                  <span className="text-slate-700">(78%)</span>
                </div>
              </div>
            </motion.div>

            {/* ===== SECTION 8: AI RECOMMENDATIONS ===== */}
            <motion.div variants={item} className="glass-card overflow-hidden">
              <div className="flex items-center gap-2 p-5 pb-3">
                <div className="flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-green-500/20 to-emerald-500/20">
                  <svg className="h-3 w-3 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-white">AI Recommendations</h3>
                <span className="text-[10px] text-slate-600 font-mono ml-1">{data.recommendations.length} prioritized actions</span>
              </div>
              <div className="px-5 pb-5 space-y-2">
                {data.recommendations.map((r, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                    className="flex items-start gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 hover:border-cyan-500/20 transition-all group">
                    <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
                      <span className={`rounded px-1.5 py-0.5 text-[8px] font-bold ${r.priority === 'P0' ? 'bg-red-500/15 text-red-400 border border-red-500/25' : r.priority === 'P1' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>{r.priority}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-300 font-medium">{r.action}</p>
                      <div className="flex flex-wrap gap-3 mt-0.5 text-[9px] text-slate-600">
                        <span className="flex items-center gap-1">
                          <svg className="h-3 w-3 text-green-400/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
                          {r.impact}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="h-3 w-3 text-blue-400/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          {r.effort}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="h-3 w-3 text-purple-400/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
                          {r.owner}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="h-3 w-3 text-cyan-400/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>
                          {data.recommendationConfidence[i]}% confidence
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* ===== SECTION 9: MITIGATION STRATEGY ===== */}
            <motion.div variants={item} className="glass-card overflow-hidden">
              <div className="flex items-center gap-2 p-5 pb-3">
                <div className="flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
                  <svg className="h-3 w-3 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-white">Mitigation Strategy</h3>
                <span className="text-[10px] text-slate-600 font-mono ml-1">{data.mitigations.length} phases</span>
              </div>
              <div className="px-5 pb-5 space-y-3">
                {data.mitigations.map((m, i) => {
                  const isOpen = expandedMitigation === i
                  const phaseColors = ['from-red-500/5 to-orange-500/5 border-red-500/15', 'from-yellow-500/5 to-orange-500/5 border-yellow-500/15', 'from-green-500/5 to-cyan-500/5 border-green-500/15']
                  const phaseBadgeColors = ['bg-red-500/15 text-red-400', 'bg-yellow-500/10 text-yellow-400', 'bg-green-500/10 text-green-400']
                  return (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                      className={`rounded-lg border bg-gradient-to-br ${phaseColors[i]} overflow-hidden hover:border-cyan-500/30 transition-all`}>
                      <button onClick={() => setExpandedMitigation(isOpen ? null : i)} className="w-full text-left p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-xs font-mono text-white font-semibold">{m.phase}</h4>
                          <span className={`rounded px-2 py-0.5 text-[8px] font-bold ${phaseBadgeColors[i]}`}>{m.timeline}</span>
                        </div>
                        <div className="flex items-center gap-3 text-[9px] text-slate-500">
                          <span className="font-mono">Owner: {m.owner}</span>
                          <span className="font-mono">{m.actions.length} action items</span>
                          <svg className={`h-3 w-3 ml-auto transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                          </svg>
                        </div>
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-[8px] text-slate-600 font-mono mb-1">
                            <span>Expected Risk Reduction</span>
                            <span className={i === 0 ? 'text-red-400' : i === 1 ? 'text-yellow-400' : 'text-green-400'}>{data.riskReduction[i].reduction}%</span>
                          </div>
                          <AnimatedBar value={data.riskReduction[i].reduction} color={i === 0 ? 'bg-red-500' : i === 1 ? 'bg-yellow-500' : 'bg-green-500'} />
                        </div>
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="border-t border-white/[0.04]">
                            <div className="p-4 space-y-2">
                              {m.actions.map((a, ai) => (
                                <div key={ai} className="flex items-start gap-2 group">
                                  <div className="h-4 w-4 mt-0.5 shrink-0 rounded-full border border-cyan-500/30 flex items-center justify-center group-hover:bg-cyan-500/10 transition-colors">
                                    <svg className="h-2.5 w-2.5 text-cyan-400/60 group-hover:text-cyan-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                  </div>
                                  <span className="text-[10px] text-slate-400 group-hover:text-slate-300 transition-colors leading-relaxed">{a}</span>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>

            {/* ===== SECTION 10: EXECUTIVE DECISION CENTER ===== */}
            <motion.div variants={item} className="glass-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-cyan-500/20 to-blue-500/20">
                  <svg className="h-3 w-3 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-white">Executive Decision Center</h3>
                <StatusBadge status="info" label="Action Required" />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {data.decisions.map((dec, i) => (
                  <motion.div key={dec.action} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                    className={`rounded-lg border p-4 transition-all hover:scale-[1.01] ${decisionGlows[dec.action]} bg-white/[0.02]`}>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-xs font-bold text-white font-mono">{dec.action}</h4>
                      <span className={`text-lg font-bold font-mono ${decisionConfidenceColors[dec.action]}`}>{dec.confidence}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden mb-3">
                      <div className={`h-full rounded-full transition-all duration-1000 ${dec.action === 'Deploy Now' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : dec.action === 'Monitor Closely' ? 'bg-amber-500' : dec.action === 'Rollback Changes' ? 'bg-orange-500' : 'bg-red-500'}`}
                        style={{ width: `${dec.confidence}%` }} />
                    </div>
                    <p className="text-[10px] text-slate-400 mb-3 leading-relaxed">{dec.reasoning}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-slate-600 font-mono">Assigned: {dec.team}</span>
                      <button className={`rounded-lg px-3 py-1 text-[9px] font-bold text-white transition-all hover:opacity-80 ${decisionButtons[dec.action]}`}>
                        {dec.action === 'Deploy Now' ? 'Execute' : dec.action === 'Monitor Closely' ? 'Observe' : dec.action === 'Rollback Changes' ? 'Rollback' : 'Deep Dive'}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* ===== SECTION 11: INVESTIGATION TIMELINE ===== */}
            <motion.div variants={item} className="glass-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-purple-500/20 to-indigo-500/20">
                  <svg className="h-3 w-3 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-white">Investigation Timeline</h3>
                <span className="text-[10px] text-slate-600 font-mono">{data.investigationTimeline.length} phases</span>
              </div>
              <div className="relative">
                <div className="absolute left-[15px] top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/40 via-cyan-500/30 via-orange-500/20 via-green-500/20 via-purple-500/15 to-slate-500/10" />
                <div className="space-y-0">
                  {data.investigationTimeline.map((ev, i) => {
                    const dotColors = {
                      Detection: 'bg-blue-500 border-blue-500/30',
                      Analysis: 'bg-cyan-500 border-cyan-500/30',
                      Escalation: 'bg-orange-500 border-orange-500/30',
                      Resolution: 'bg-green-500 border-green-500/30',
                      Review: 'bg-purple-500 border-purple-500/30',
                      Closed: 'bg-slate-500 border-slate-500/30',
                    }
                    const typeBadgeColors = {
                      Detection: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
                      Analysis: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
                      Escalation: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
                      Resolution: 'bg-green-500/10 text-green-400 border-green-500/20',
                      Review: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
                      Closed: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
                    }
                    return (
                      <motion.div key={i} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                        className="relative flex items-start gap-4 py-4 group">
                        <div className={`relative z-10 mt-0.5 h-3.5 w-3.5 shrink-0 rounded-full border-2 ${dotColors[ev.type] || 'bg-slate-500 border-slate-500/30'} transition-all group-hover:scale-125`}>
                          <div className="absolute inset-0.5 rounded-full bg-current opacity-30 animate-pulse" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                            <div className="flex items-center gap-2">
                              <span className={`rounded px-1.5 py-0.5 text-[8px] font-bold ${typeBadgeColors[ev.type] || 'bg-slate-500/10 text-slate-400'}`}>{ev.type}</span>
                              <span className="text-[10px] font-mono text-slate-500">{ev.date}</span>
                            </div>
                            <span className="text-[9px] text-slate-600 font-mono">{ev.duration}</span>
                          </div>
                          <h4 className="text-xs font-semibold text-slate-200 mb-0.5">{ev.title}</h4>
                          <p className="text-[10px] text-slate-500 leading-relaxed">{ev.description}</p>
                          <div className="flex items-center gap-2 mt-1.5 text-[9px] text-slate-600 font-mono">
                            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                            </svg>
                            {ev.team}
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            </motion.div>

            {/* ===== SECTION 12: LIVE INTELLIGENCE FEED ===== */}
            <motion.div variants={item} className="glass-card overflow-hidden">
              <div className="flex items-center justify-between p-5 pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-cyan-500/20 to-blue-500/20">
                    <svg className="h-3 w-3 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-white">Live Intelligence Feed</h3>
                </div>
                <div className="flex items-center gap-1.5 text-[9px] text-green-400 font-mono border border-green-500/20 rounded-md px-2 py-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse shadow-[0_0_6px_rgba(74,222,128,0.5)]" />
                  LIVE
                </div>
              </div>
              <div ref={feedRef} className="relative max-h-[480px] overflow-y-auto scroll-smooth">
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-slate-950/20 to-transparent h-6 top-0 z-10" />
                {data.liveFeed.map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                    className={`border-l-2 pl-4 pr-5 py-3 ${feedTypeStyles[item.type] || 'border-l-slate-600 bg-white/[0.01]'} hover:bg-white/[0.03] transition-all`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[9px] font-mono text-slate-600">{item.time}</span>
                          <span className={`rounded px-1.5 py-0.5 text-[7px] font-bold uppercase ${item.severity === 'critical' ? 'bg-red-500/15 text-red-400' : item.severity === 'high' ? 'bg-orange-500/10 text-orange-400' : item.severity === 'warning' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-blue-500/10 text-blue-400'}`}>{item.severity}</span>
                          <span className="text-[8px] text-slate-700 font-mono uppercase">{item.type}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-relaxed">{item.message}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
                <div className="sticky bottom-0 h-6 bg-gradient-to-t from-slate-950/30 to-transparent pointer-events-none" />
              </div>
            </motion.div>

          </motion.div>
        )}

      </motion.div>
    </Layout>
  )
}
