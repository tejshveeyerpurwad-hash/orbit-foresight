import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Layout from '../components/Layout'
import StatusBadge from '../components/StatusBadge'
import NarrativeCTA from '../components/NarrativeCTA'
import ExecutiveBanner from '../components/ExecutiveBanner'
import AIRecommendations from '../components/AIRecommendations'
import PageHero from '../components/PageHero'
import BusinessImpact from '../components/BusinessImpact'
import InvestigationWorkflow from '../components/InvestigationWorkflow'

const API_BASE = import.meta.env.VITE_API_URL || '/api'

const presets = [
  'Add payment retry support',
  'Implement OAuth 2.0 SSO',
  'Migrate database connection pool',
  'Refactor billing module',
  'Deploy microservices monitoring',
]

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)] }
function rng(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min }
function hashNum(s, max) { let h = 0; for (let i = 0; i < s.length; i++) h = ((h << 5) - h) + s.charCodeAt(i); return Math.abs(h % max) }
const ucFirst = s => s.charAt(0).toUpperCase() + s.slice(1)

const timelineDotColors = {
  Detection: '#38bdf8',
  Analysis: '#a78bfa',
  Escalation: '#f97316',
  Resolution: '#22c55e',
  Review: '#eab308',
  Closed: '#64748b',
}
const timelineBadgeColors = {
  Detection: 'bg-sky-500/10 text-sky-400',
  Analysis: 'bg-purple-500/10 text-purple-400',
  Escalation: 'bg-orange-500/10 text-orange-400',
  Resolution: 'bg-green-500/10 text-green-400',
  Review: 'bg-yellow-500/10 text-yellow-400',
  Closed: 'bg-slate-500/10 text-slate-400',
}
const decisionGlows = {
  'Deploy Now': 'shadow-[0_0_15px_rgba(34,197,94,0.15)] border-green-500/20',
  'Monitor Closely': 'shadow-[0_0_15px_rgba(245,158,11,0.15)] border-amber-500/20',
  'Rollback Changes': 'shadow-[0_0_15px_rgba(249,115,22,0.15)] border-orange-500/20',
  'Investigate Further': 'shadow-[0_0_15px_rgba(59,130,246,0.15)] border-blue-500/20',
}
const decisionConfidenceColors = {
  'Deploy Now': 'text-green-400',
  'Monitor Closely': 'text-amber-400',
  'Rollback Changes': 'text-orange-400',
  'Investigate Further': 'text-blue-400',
}
const decisionButtons = {
  'Deploy Now': 'bg-green-600 hover:bg-green-500',
  'Monitor Closely': 'bg-amber-600 hover:bg-amber-500',
  'Rollback Changes': 'bg-orange-600 hover:bg-orange-500',
  'Investigate Further': 'bg-blue-600 hover:bg-blue-500',
}
const feedTypeStyles = {
  alert: 'border-l-red-500 bg-red-500/[0.02]',
  event: 'border-l-cyan-500 bg-cyan-500/[0.02]',
  investigation: 'border-l-blue-500 bg-blue-500/[0.02]',
  risk: 'border-l-yellow-500 bg-yellow-500/[0.02]',
}

const investigationData = {
  caseId: '#OV-2024-0847',
  status: 'ACTIVE',
  title: 'Payment Pipeline Failure - Forensic Analysis of Retry Queue Cascade & Circuit Breaker Gap',
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
    { mode: 'Retry queue overflow causes cascading failure', severity: 'critical', probability: 'High', impact: 'All payment flows blocked - 45min P0 outage', detection: 'Monitoring alert after 5 min of degraded throughput', mitigation: 'Add bounded retry queues with backpressure mechanism' },
    { mode: 'Circuit breaker misconfiguration causes silent failures', severity: 'critical', probability: 'Medium', impact: 'Failed transactions without error logs for 30+ min', detection: 'Customer complaints escalated through support tickets', mitigation: 'Add comprehensive integration tests with fault injection scenarios' },
    { mode: 'Billing reconciliation delay during rollout', severity: 'high', probability: 'Low', impact: '15K invoices delayed up to 3 hours', detection: 'Billing dashboard alert triggered by batch processing lag', mitigation: 'Feature flag with gradual rollout (10% -> 50% -> 100%) over 48h' },
    { mode: 'API gateway timeout regression', severity: 'high', probability: 'Medium', impact: 'Payment requests timeout under load > 500 RPS', detection: 'APM latency spike alert crossing 5s P99 threshold', mitigation: 'Update timeout configs with load testing validation at 2x expected traffic' },
    { mode: 'Database connection pool exhaustion', severity: 'high', probability: 'Low', impact: 'All services unable to connect to DB simultaneously', detection: 'Connection pool monitoring alert at 95% utilization', mitigation: 'Add connection pooling with max limit per service instance' },
    { mode: 'Webhook delivery failure on retry events', severity: 'medium', probability: 'Medium', impact: 'Merchants not notified of retry status for 2hr window', detection: 'Webhook delivery log audit during incident post-mortem', mitigation: 'Add idempotency keys and dead letter queue for failed deliveries' },
    { mode: 'Memory leak in retry worker loop', severity: 'medium', probability: 'Low', impact: 'Worker pod OOM kill after 4 hours continuous operation', detection: 'K8s pod restart count alert exceeding threshold', mitigation: 'Add memory limits and leak detection tests in CI pipeline' },
    { mode: 'Monitoring dashboard missing retry metrics', severity: 'low', probability: 'High', impact: 'Blind spot during incident response - no retry KPIs visible', detection: 'Manual discovery during incident by on-call engineer', mitigation: 'Add retry-related metrics to operations dashboard with alert thresholds' },
  ],
  mrs: [
    { id: 'MR #142', author: '@alice', date: 'May 12', desc: 'Failed integration tests due to missing retry config', outcome: 'Incident', match: 87, files: 12, risk: 'high' },
    { id: 'MR #198', author: '@bob', date: 'Jun 1', desc: 'Caused retry queue overflow in production - 45min outage', outcome: 'Incident', match: 92, files: 8, risk: 'critical' },
    { id: 'MR #211', author: '@carol', date: 'Jun 15', desc: 'Introduced N+1 query in billing report causing slow queries', outcome: 'Near Miss', match: 74, files: 5, risk: 'medium' },
    { id: 'MR #87', author: '@alice', date: 'Apr 20', desc: 'Payment timeout regression after major refactor of handler', outcome: 'Incident', match: 89, files: 15, risk: 'high' },
    { id: 'MR #305', author: '@dave', date: 'Jul 2', desc: 'Race condition in session invalidation handler for auth flow', outcome: 'Incident', match: 91, files: 6, risk: 'critical' },
  ],
  incidents: [
    { title: 'Production outage - Payment pipeline down 45min', date: 'Jun 1', cause: 'Retry queue overflow without circuit breaker', impact: 'All payment flows blocked for 45 minutes', duration: '45min', rootCause: 'Missing backpressure mechanism in payment worker', services: ['Payment Service', 'API Gateway'], severity: 'critical', lessons: 'Add circuit breaker pattern to all retry loops' },
    { title: 'Degraded billing processing - 3hr delay', date: 'May 15', cause: 'Billing worker OOM from unbounded retry loop', impact: '15K invoices delayed by 3+ hours', duration: '3hr', rootCause: 'Unbounded retry queue exhausted heap memory', services: ['Billing Service'], severity: 'high', lessons: 'Bound retry counts and add memory limits to workers' },
    { title: 'Webhook delivery failure - partial data loss', date: 'Apr 28', cause: 'Missing idempotency keys caused duplicate webhook events', impact: '2% merchants affected by duplicate notifications', duration: '2hr', rootCause: 'No idempotency checking in webhook handler', services: ['Notification Service', 'Webhook Gateway'], severity: 'medium', lessons: 'Idempotency keys required for all webhook deliveries' },
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
    { title: 'Circuit Breaker Cascade', chain: ['Missing circuit breaker in payment worker', 'Retry queue overflow under load spike', 'Complete payment pipeline outage (45min)'], descriptions: ['No backpressure mechanism configured in the payment worker retry loop - all failures retried immediately', 'Traffic spike caused unbounded retry queue to grow beyond memory limits, consuming all available heap', 'All payment flows blocked for 45 minutes - critical P0 incident declared with executive escalation'], confidences: [92, 87, 95], evidence: [12, 8, 15] },
    { title: 'Memory Exhaustion Chain', chain: ['Unbounded retry queue in billing worker', 'Worker OOM crash after 4hr continuous retry', '15K invoices delayed by 3+ hours'], descriptions: ['Billing worker had no upper bound on retry queue depth - could grow indefinitely under load', 'Heap exhaustion caused worker pod to be killed by OOM killer after 4 hours of sustained retries', 'Billing processing stalled completely leading to massive invoice backlog across 15K customers'], confidences: [91, 86, 93], evidence: [7, 5, 10] },
    { title: 'Idempotency Gap Chain', chain: ['Missing idempotency keys in webhook handler', 'Duplicate webhook events sent to merchants', '2% merchants received duplicate notifications'], descriptions: ['Webhook endpoints lacked idempotency key validation - same event could be delivered multiple times', 'Retry mechanism caused same event to be delivered 2-3 times to merchant endpoints', 'Merchants reported duplicate payment notifications and spam complaints to support team'], confidences: [88, 82, 90], evidence: [6, 4, 8] },
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
  verdict: { risk: 'High', confidence: 88, findings: ['Missing circuit breaker in payment retry loop is primary root cause - 92% correlation confidence across 3 incidents', 'Retry queue overflow has caused 3 distinct incidents affecting 100K+ transactions and 15K invoices', 'No idempotency guarantees on 4 webhook endpoints - potential for data integrity issues in merchant systems'], action: 'Immediate remediation required: deploy circuit breaker fix and bounded retry queues before next deployment cycle. Long-term investment in event-driven architecture with dead letter queues is strongly recommended to prevent recurrence.' },
  evidenceTimeline: [
    { date: '2024-05-28', type: 'Code Change', description: 'Retry logic added to payment handler without circuit breaker protection', source: 'GitLab MR #142 - @alice', relevance: 92 },
    { date: '2024-05-30', type: 'Code Change', description: 'Circuit breaker config deployed to staging environment for testing', source: 'GitLab MR #156 - @bob', relevance: 85 },
    { date: '2024-06-01', type: 'Incident', description: 'Payment pipeline outage lasting 45 minutes in production', source: 'PagerDuty #INC-3841 - P0', relevance: 97 },
    { date: '2024-06-10', type: 'Config Change', description: 'Retry queue limits adjusted from 10K to 5K max depth', source: 'GitLab MR #198 - @carol', relevance: 78 },
    { date: '2024-06-15', type: 'Alert', description: 'Billing worker memory threshold breach detected at 92% heap usage', source: 'Datadog Alert - memory.pressure', relevance: 88 },
    { date: '2024-06-22', type: 'Code Change', description: 'Idempotency keys added to webhook endpoints for deduplication', source: 'GitLab MR #211 - @dave', relevance: 73 },
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
      { name: 'Payment Service', radius: 1, risk: 87, critical: true, files: 12, status: 'Degraded' },
      { name: 'Billing Service', radius: 2, risk: 65, critical: false, files: 8, status: 'At Risk' },
      { name: 'API Gateway', radius: 2, risk: 72, critical: true, files: 5, status: 'Degraded' },
      { name: 'Notification Service', radius: 2, risk: 45, critical: false, files: 3, status: 'Stable' },
    ],
  },
  investigationTimeline: [
    { date: '2024-05-28', type: 'Detection', title: 'Monitoring alert triggered', description: 'Error rate spike detected on payment endpoint - PagerDuty alert fired automatically with severity P0', team: 'Platform', duration: '2min' },
    { date: '2024-05-30', type: 'Analysis', title: 'Root cause identification', description: 'Engineering team traced error to missing circuit breaker in retry loop implementation across 3 services', team: '@alice, @bob', duration: '45min' },
    { date: '2024-06-01', type: 'Escalation', title: 'Incident escalated to P0', description: 'Payment pipeline fully blocked - VP Engineering notified, cross-team incident bridge established on Slack', team: 'SRE, Platform, Security', duration: '15min' },
    { date: '2024-06-10', type: 'Resolution', title: 'Hotfix deployed to production', description: 'Circuit breaker threshold override pushed to all payment worker instances with canary deployment 10%->50%->100%', team: '@alice, Platform', duration: '30min' },
    { date: '2024-06-15', type: 'Review', title: 'Post-mortem analysis complete', description: 'Full RCA documented with 8 failure modes identified, 4 services impacted, and phased mitigation plan drafted', team: 'Engineering, SRE', duration: '2hr' },
    { date: '2024-06-22', type: 'Closed', title: 'Case closed with recommendations', description: 'All findings documented. 5 recommendations pushed to backlog with P0/P1 prioritization. Weekly review cadence established.', team: 'Platform', duration: '1hr' },
  ],
  liveFeed: [
    { time: '14:23:15', type: 'alert', message: 'Error rate spike >5% on payment endpoint - automated rollback triggered', severity: 'critical' },
    { time: '14:22:48', type: 'event', message: 'Circuit breaker opened on Payment Service after 15 consecutive failures detected', severity: 'high' },
    { time: '14:22:12', type: 'investigation', message: 'AI analysis completed - 8 failure modes identified across 4 services with 94% confidence', severity: 'info' },
    { time: '14:21:30', type: 'risk', message: 'Risk propagation probability updated: Payment -> Billing now at 87% likelihood', severity: 'warning' },
    { time: '14:20:55', type: 'alert', message: 'Billing worker memory threshold at 92% - potential OOM risk detected on pod billing-7', severity: 'high' },
    { time: '14:20:10', type: 'event', message: 'New correlation found: MR #198 matches 92% with current incident signature pattern', severity: 'info' },
    { time: '14:19:25', type: 'investigation', message: 'Blast radius analysis expanded - Notification Service added to impact zone', severity: 'warning' },
    { time: '14:18:40', type: 'risk', message: 'Webhook Gateway identified as downstream risk - propagation likelihood 78%', severity: 'medium' },
    { time: '14:18:00', type: 'event', message: 'Incident timeline updated - 6 forensic artifacts collected for evidence chain correlation', severity: 'info' },
    { time: '14:17:20', type: 'alert', message: 'Database connection pool utilization at 85% - approaching critical threshold of 90%', severity: 'medium' },
  ],
  decisions: [
    { action: 'Deploy Now', confidence: 92, reasoning: 'Circuit breaker fix ready for production with automated rollback protection - 92% confidence in fix efficacy', team: '@alice', urgency: 'immediate' },
    { action: 'Monitor Closely', confidence: 85, reasoning: 'Retry queue still within safe limits - observe for 2 hours before escalation decision', team: '@bob', urgency: 'short' },
    { action: 'Rollback Changes', confidence: 78, reasoning: 'Revert last 3 MRs to restore stable state - 78% confidence in regression cause being recent changes', team: '@carol', urgency: 'medium' },
    { action: 'Investigate Further', confidence: 94, reasoning: 'Additional correlation data needed - deep-dive into billing worker memory patterns and heap dumps', team: '@dave', urgency: 'long' },
  ],
  riskReduction: [
    { phase: 'Immediate', reduction: 65 },
    { phase: 'Short-Term', reduction: 85 },
    { phase: 'Long-Term', reduction: 95 },
  ],
  recommendationConfidence: [92, 88, 85, 78, 90],
  keyFindingsData: [
    { id: 'F-001', title: 'Missing Circuit Breaker', description: 'Payment retry loop lacks any circuit breaker pattern - all failures retry infinitely causing cascading collapse across downstream services', severity: 'critical' },
    { id: 'F-002', title: 'Unbounded Retry Queue', description: 'Billing worker retry queue has no depth limit - memory exhaustion triggered under sustained load during peak hours', severity: 'high' },
    { id: 'F-003', title: 'No Idempotency Keys', description: 'Webhook endpoints lack idempotency validation - duplicate events delivered during retry storms causing data integrity issues', severity: 'high' },
  ],
  affectedSystems: [
    { name: 'Payment Service', impact: 'Critical', status: 'Degraded', rps: '450' },
    { name: 'Billing Service', impact: 'High', status: 'At Risk', rps: '120' },
    { name: 'API Gateway', impact: 'High', status: 'Degraded', rps: '1200' },
    { name: 'Notification Service', impact: 'Medium', status: 'Stable', rps: '300' },
  ],
  whatIfSimulation: {
    currentPath: { riskReduction: 23, costSavings: 0, successProbability: 45, recoveryTime: '45min' },
    recommendedPath: { riskReduction: 82, costSavings: 340000, successProbability: 94, recoveryTime: '12min' },
    scenarios: [
      { name: 'Without Circuit Breaker', risk: 87, impact: '$340K loss', timeToRecover: '45min', confidence: 92 },
      { name: 'With Circuit Breaker', risk: 23, impact: '$28K loss', timeToRecover: '12min', confidence: 96 },
      { name: 'With Bounded Queues', risk: 35, impact: '$52K loss', timeToRecover: '18min', confidence: 91 },
      { name: 'Full Architecture Fix', risk: 12, impact: '$8K loss', timeToRecover: '5min', confidence: 88 },
    ],
    metrics: { riskReduction: 74, costSavings: 340000, successBoost: 49, timeReduction: 73 }
  },
  forecast: {
    predictions: [
      { period: '24 hours', risk: 23, confidence: 94, trend: 'down', description: 'Circuit breaker fix stabilizes payment pipeline. Predicted error rate drops from 4.2% to 0.3%.' },
      { period: '7 days', risk: 35, confidence: 88, trend: 'stable', description: 'Bounded retry queues prevent cascading failures. Predicted MTTR reduces from 45min to 12min.' },
      { period: '30 days', risk: 18, confidence: 82, trend: 'down', description: 'Complete architectural remediation reduces incident probability by 82%. Predicted cost avoidance: $340K.' },
    ],
    trendData: [
      { month: 'Jan', incidents: 4, mttr: 38 },
      { month: 'Feb', incidents: 3, mttr: 42 },
      { month: 'Mar', incidents: 5, mttr: 55 },
      { month: 'Apr', incidents: 7, mttr: 62 },
      { month: 'May', incidents: 6, mttr: 48 },
      { month: 'Jun', incidents: 2, mttr: 28 },
    ],
    riskByService: [
      { service: 'Payment Service', currentRisk: 87, mitigatedRisk: 15, improvement: 83 },
      { service: 'Billing Service', currentRisk: 65, mitigatedRisk: 22, improvement: 66 },
      { service: 'API Gateway', currentRisk: 72, mitigatedRisk: 18, improvement: 75 },
      { service: 'Notification Service', currentRisk: 45, mitigatedRisk: 12, improvement: 73 },
    ]
  },
  similarIncidents: [
    { id: 'INC-2023-0412', date: 'Dec 2023', title: 'Retry storm caused payment outage', similarity: 94, outcome: 'Resolved', fixApplied: 'Added circuit breaker with half-open state', services: ['Payment', 'Gateway'], duration: '55min' },
    { id: 'INC-2024-0215', date: 'Feb 2024', title: 'Queue overflow in billing pipeline', similarity: 88, outcome: 'Resolved', fixApplied: 'Bounded retry queue to 1000 max with backpressure', services: ['Billing'], duration: '3hr' },
    { id: 'INC-2024-0318', date: 'Mar 2024', title: 'Webhook duplicate delivery incident', similarity: 76, outcome: 'Resolved', fixApplied: 'Idempotency keys deployed to all webhook endpoints', services: ['Notification', 'Webhook'], duration: '2hr' },
    { id: 'INC-2024-0422', date: 'Apr 2024', title: 'API gateway timeout causing payment failures', similarity: 72, outcome: 'Resolved', fixApplied: 'Timeout configs updated with load testing', services: ['API Gateway', 'Payment'], duration: '1.5hr' },
    { id: 'INC-2024-0510', date: 'May 2024', title: 'Database connection pool exhaustion', similarity: 65, outcome: 'Resolved', fixApplied: 'Connection per-service limits configured', services: ['Database', 'Payment', 'Billing'], duration: '45min' },
    { id: 'INC-2024-0615', date: 'Jun 2024', title: 'Memory leak in worker retry loop', similarity: 81, outcome: 'Resolved', fixApplied: 'Memory limits and leak detection in CI pipeline', services: ['Billing Worker'], duration: '4hr' },
  ],
  evidenceItems: [
    { title: 'Error Rate Spike', type: 'Metric', value: '4.2%', timeframe: '14:15 - 14:45', source: 'Datadog APM', critical: true },
    { title: 'Retry Queue Depth', type: 'Log', value: '10,482', timeframe: '14:18:22', source: 'Worker Logs', critical: true },
    { title: 'CPU Utilization', type: 'Metric', value: '98%', timeframe: '14:20 - 14:45', source: 'K8s Metrics', critical: false },
    { title: 'Memory Pressure', type: 'Alert', value: '92%', timeframe: '14:22:15', source: 'PagerDuty', critical: true },
    { title: 'Error Correlation', type: 'Signal', value: '0.94', timeframe: 'Rolling 1hr', source: 'AI Engine', critical: false },
    { title: 'Transaction Failure', type: 'Event', value: '1,247', timeframe: '14:15 - 15:00', source: 'Payment Service', critical: true },
  ]
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
    <div className="flex flex-col items-center relative scale-[0.65] -my-3 -mx-2">
      <svg width="100" height="100" viewBox="0 0 120 120" className="-rotate-90">
        <circle cx="60" cy="60" r="42" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
        <circle cx="60" cy="60" r="42" fill="none" stroke={strokeColor} strokeWidth="8" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} style={{ transition: 'stroke-dashoffset 1.8s ease-out, stroke 0.3s' }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-white drop-shadow-lg" style={{ color: strokeColor }}>{animatedScore}</span>
        <span className="text-[7px] text-slate-500 uppercase tracking-widest">{severityLabel}</span>
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
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-[8px] text-slate-500 font-mono tracking-wide">{label}</span>
        <span className="text-xs font-bold text-white">{animVal}%</span>
      </div>
      <div className="relative h-2 rounded-full bg-white/[0.06] overflow-hidden">
        <div className={'h-full rounded-full transition-all duration-[1500ms] ease-out ' + barColor} style={{ width: animVal + '%' }} />
      </div>
    </div>
  )
}

function AnimatedBar({ value, height = 'h-1.5', color = 'bg-cyan-500' }) {
  const [width, setWidth] = useState(0)
  useEffect(() => { const t = setTimeout(() => setWidth(value), 100); return () => clearTimeout(t) }, [value])
  return (
    <div className={height + ' rounded-full bg-white/[0.06] overflow-hidden'}>
      <div className={'h-full rounded-full ' + color + ' transition-all duration-1000 ease-out'} style={{ width: width + '%' }} />
    </div>
  )
}

const PROFILES = {
  payment: {
    tag: 'payment',
    title: 'Payment Pipeline Failure — Forensic Analysis of Retry Queue Cascade & Circuit Breaker Gap',
    services: ['Payment Service', 'API Gateway', 'Billing Service', 'Auth Service', 'Database', 'Redis Cache'],
    riskScore: 87, confidence: 94, totalFailures: 8, criticalFailures: 2, highFailures: 3, mediumFailures: 2, lowFailures: 1,
    mrsAnalyzed: 847, incidentsPrevented: 124,
    deps: [
      { service: 'Payment Service', deps: ['Auth Service', 'Database', 'Redis Cache'], risk: 87, critical: true },
      { service: 'Billing Service', deps: ['Auth Service', 'Redis Cache', 'Payment Service'], risk: 65, critical: false },
      { service: 'API Gateway', deps: ['Payment Service', 'Auth Service'], risk: 72, critical: false },
    ],
    failureModes: [
      { mode: 'Retry queue overflow causes cascading failure', severity: 'critical', probability: 'High', impact: 'All payment flows blocked — 45min P0 outage', detection: 'Monitoring alert after 5 min of degraded throughput', mitigation: 'Add bounded retry queues with backpressure mechanism' },
      { mode: 'Circuit breaker misconfiguration in payment worker', severity: 'critical', probability: 'Medium', impact: 'Silent failures cascade to Billing service', detection: 'Support tickets from customers reporting failed transactions', mitigation: 'Add integration tests with fault injection for circuit breaker states' },
      { mode: 'Unbounded retry queue in billing worker', severity: 'high', probability: 'High', impact: 'Memory exhaustion under sustained load', detection: 'Container OOM kill alerts in K8s', mitigation: 'Set max retry queue depth with overflow dead-letter exchange' },
    ],
    rootCauseChains: [
      { title: 'Circuit Breaker Cascade', chain: ['No backpressure in retry loop', 'Queue overflow across 3 services', 'P0 Outage — full pipeline blocked'], descriptions: ['Payment retry loop calls downstream without circuit breaker — every failure triggers infinite retries', 'Retry queue grows unbounded across Payment, Billing, and Gateway exhausting pod memory', 'Complete payment pipeline blockage — 45 minute P0 outage affecting 12K transactions'], confidences: [92, 87, 95], evidence: [12, 8, 15] }
    ],
    affectedSystems: [
      { name: 'Payment Service', impact: 'Critical', status: 'Degraded', rps: '450' },
      { name: 'Billing Service', impact: 'High', status: 'At Risk', rps: '120' },
      { name: 'API Gateway', impact: 'High', status: 'Degraded', rps: '1200' },
      { name: 'Notification Service', impact: 'Medium', status: 'Stable', rps: '300' },
    ],
    keyFindingsData: [
      { id: 'F-001', title: 'Missing Circuit Breaker', description: 'Payment retry loop lacks any circuit breaker pattern — all failures retry infinitely causing cascading collapse across downstream services', severity: 'critical' },
      { id: 'F-002', title: 'Unbounded Retry Queue', description: 'Billing worker retry queue has no depth limit — memory exhaustion triggered under sustained load during peak hours', severity: 'high' },
      { id: 'F-003', title: 'No Idempotency Keys', description: 'Webhook endpoints lack idempotency validation — duplicate events delivered during retry storms causing data integrity issues', severity: 'high' },
    ],
    similarIncidents: [
      { id: 'INC-2023-0412', date: 'Dec 2023', title: 'Retry storm caused payment outage', similarity: 94, outcome: 'Resolved', fixApplied: 'Added circuit breaker with half-open state', services: ['Payment', 'Gateway'], duration: '55min' },
      { id: 'INC-2024-0215', date: 'Feb 2024', title: 'Queue overflow in billing pipeline', similarity: 88, outcome: 'Resolved', fixApplied: 'Bounded retry queue to 1000 max with backpressure', services: ['Billing'], duration: '3hr' },
      { id: 'INC-2024-0510', date: 'May 2024', title: 'Database connection pool exhaustion', similarity: 65, outcome: 'Resolved', fixApplied: 'Connection per-service limits configured', services: ['Database', 'Payment', 'Billing'], duration: '45min' },
    ],
    evidenceItems: [
      { title: 'Error Rate Spike', type: 'Metric', value: '4.2%', timeframe: '14:15 - 14:45', source: 'Datadog APM', critical: true },
      { title: 'Retry Queue Depth', type: 'Log', value: '10,482', timeframe: '14:18:22', source: 'Worker Logs', critical: true },
      { title: 'CPU Utilization', type: 'Metric', value: '98%', timeframe: '14:20 - 14:45', source: 'K8s Metrics', critical: false },
      { title: 'Memory Pressure', type: 'Alert', value: '92%', timeframe: '14:22:15', source: 'PagerDuty', critical: true },
      { title: 'Error Correlation', type: 'Signal', value: '0.94', timeframe: 'Rolling 1hr', source: 'AI Engine', critical: false },
      { title: 'Transaction Failure', type: 'Event', value: '1,247', timeframe: '14:15 - 15:00', source: 'Payment Service', critical: true },
    ],
  },
  auth: {
    tag: 'auth',
    title: 'OAuth 2.0 SSO Integration Failure — Token Expiry Cascade & Session Store Outage',
    services: ['Auth Service', 'Identity Provider', 'Session Store', 'API Gateway', 'User Service', 'Token Cache'],
    riskScore: 82, confidence: 91, totalFailures: 7, criticalFailures: 1, highFailures: 3, mediumFailures: 2, lowFailures: 1,
    mrsAnalyzed: 623, incidentsPrevented: 89,
    deps: [
      { service: 'Auth Service', deps: ['Identity Provider', 'Session Store', 'Token Cache'], risk: 82, critical: true },
      { service: 'API Gateway', deps: ['Auth Service', 'User Service'], risk: 70, critical: false },
      { service: 'User Service', deps: ['Session Store'], risk: 55, critical: false },
    ],
    failureModes: [
      { mode: 'OAuth token expiry causes cascading re-authentication', severity: 'critical', probability: 'High', impact: 'All SSO sessions invalidated — 15K users forced to re-login', detection: 'Auth error rate spike in IdP metrics', mitigation: 'Implement token refresh grace period with sliding window expiration' },
      { mode: 'Session store replication lag under load', severity: 'high', probability: 'Medium', impact: 'Users see intermittent 401 errors during peak hours', detection: 'Redis replication delay alerts', mitigation: 'Add read-replica fallback with local session cache' },
      { mode: 'JWT signing key rotation failure', severity: 'medium', probability: 'Low', impact: 'Some services reject valid tokens after key rotation', detection: 'Service-to-service 403 errors', mitigation: 'Implement key rotation with overlap window and JWKS endpoint caching' },
    ],
    rootCauseChains: [
      { title: 'Token Cascade Failure', chain: ['Short-lived access tokens without refresh buffer', 'Mass token expiry triggers re-auth storm', 'Session store overwhelmed — SSO outage'], descriptions: ['OAuth access tokens configured with 15min expiry but no grace period for concurrent refresh', 'All 15K active sessions expired simultaneously causing tsunami of re-authentication requests to IdP', 'Session store (Redis) connection pool exhausted under 8K req/s auth load — cascading SSO failure'], confidences: [94, 89, 92], evidence: [14, 7, 11] }
    ],
    affectedSystems: [
      { name: 'Auth Service', impact: 'Critical', status: 'Degraded', rps: '850' },
      { name: 'Identity Provider', impact: 'High', status: 'At Risk', rps: '320' },
      { name: 'Session Store', impact: 'High', status: 'Degraded', rps: '2400' },
      { name: 'API Gateway', impact: 'Medium', status: 'Stable', rps: '1800' },
    ],
    keyFindingsData: [
      { id: 'F-001', title: 'No Token Refresh Grace Period', description: 'Access tokens expire with zero overlap — all concurrent sessions force re-auth at exactly the same moment', severity: 'critical' },
      { id: 'F-002', title: 'Session Store Single Point of Failure', description: 'Single Redis cluster handles all session state without read replicas or local caching fallback', severity: 'high' },
      { id: 'F-003', title: 'JWKS Endpoint Uncached', description: 'Every service fetches JWKS keys on every request — 3K req/s hitting IdP for public keys', severity: 'medium' },
    ],
    similarIncidents: [
      { id: 'INC-2024-0115', date: 'Jan 2024', title: 'SSO outage caused by token storm', similarity: 92, outcome: 'Resolved', fixApplied: 'Added token refresh grace period + rate limiting on IdP', services: ['Auth', 'IdP'], duration: '35min' },
      { id: 'INC-2024-0308', date: 'Mar 2024', title: 'Session store Redis cluster meltdown', similarity: 85, outcome: 'Resolved', fixApplied: 'Redis cluster resized with read replicas deployed', services: ['Session Store'], duration: '2hr' },
    ],
    evidenceItems: [
      { title: 'Auth Error Rate', type: 'Metric', value: '8.5%', timeframe: '10:30 - 11:00', source: 'Datadog APM', critical: true },
      { title: 'Session Store CPU', type: 'Metric', value: '97%', timeframe: '10:35 - 11:00', source: 'K8s Metrics', critical: true },
      { title: 'IdP Requests/s', type: 'Metric', value: '8,200', timeframe: '10:32:15', source: 'IdP Dashboard', critical: true },
      { title: 'JWT Validation Errors', type: 'Log', value: '12,450', timeframe: '10:30 - 11:00', source: 'Gateway Logs', critical: false },
      { title: 'Token Refresh Count', type: 'Signal', value: '15,000+', timeframe: '10:31 - 10:35', source: 'AI Engine', critical: false },
      { title: 'User Login Failures', type: 'Event', value: '3,200', timeframe: '10:30 - 10:45', source: 'User Service', critical: true },
    ],
  },
  database: {
    tag: 'database',
    title: 'Database Connection Pool Exhaustion — Connection Leak & Migration Lock Contention',
    services: ['Database', 'Connection Pooler', 'Primary DB', 'Read Replica', 'Migration Runner', 'Cache Layer'],
    riskScore: 85, confidence: 93, totalFailures: 9, criticalFailures: 2, highFailures: 4, mediumFailures: 2, lowFailures: 1,
    mrsAnalyzed: 1050, incidentsPrevented: 67,
    deps: [
      { service: 'Database', deps: ['Connection Pooler', 'Primary DB'], risk: 85, critical: true },
      { service: 'Connection Pooler', deps: ['Primary DB', 'Read Replica'], risk: 78, critical: true },
      { service: 'Migration Runner', deps: ['Primary DB'], risk: 60, critical: false },
    ],
    failureModes: [
      { mode: 'Connection leak from long-running queries', severity: 'critical', probability: 'High', impact: 'Connection pool exhausted — all services unable to connect to database', detection: 'Connection pool utilization alert at 98%', mitigation: 'Set statement timeout and connection max lifetime with query monitoring' },
      { mode: 'Migration lock contention during deployment', severity: 'high', probability: 'Medium', impact: 'Schema migration blocks all write operations for 18 minutes', detection: 'Migration stuck at "acquiring exclusive lock" for 5min+', mitigation: 'Use online schema change tools (gh-ost) with lock wait timeout' },
      { mode: 'Read replica lag exceeds tolerance', severity: 'medium', probability: 'Medium', impact: 'Stale data served to reporting dashboards', detection: 'Replication lag monitoring alert >30s', mitigation: 'Increase replica instance size and tune replication parameters' },
    ],
    rootCauseChains: [
      { title: 'Connection Pool Cascade', chain: ['Long-running query holds connection for 12min', 'Pool exhaustion blocks new connections', 'All downstream services fail with connection timeout'], descriptions: ['A reporting query with missing index scanned 50M rows, holding the connection for 12+ minutes', 'Connection pool (max 100) fully occupied — every new request from all services fails to get a connection', 'Payment, Auth, Billing, and Notification services all return 503 — cascading multi-service failure'], confidences: [96, 91, 93], evidence: [13, 9, 14] }
    ],
    affectedSystems: [
      { name: 'Database', impact: 'Critical', status: 'Degraded', rps: '3200' },
      { name: 'Connection Pooler', impact: 'High', status: 'At Risk', rps: '1200' },
      { name: 'Payment Service', impact: 'High', status: 'Downstream', rps: '450' },
      { name: 'Auth Service', impact: 'Medium', status: 'Downstream', rps: '850' },
    ],
    keyFindingsData: [
      { id: 'F-001', title: 'Missing Query Index', description: 'reporting_daily_metrics query scans full table (50M rows) — missing composite index causes 12min execution time', severity: 'critical' },
      { id: 'F-002', title: 'Connection Pool Too Small', description: 'Max pool size of 100 connections insufficient for 15 microservices — no queueing mechanism leads to immediate rejection', severity: 'high' },
      { id: 'F-003', title: 'No Query Timeout', description: 'No statement_timeout configured — runaway queries hold connections indefinitely with no guardrail', severity: 'high' },
    ],
    similarIncidents: [
      { id: 'INC-2024-0220', date: 'Feb 2024', title: 'Connection pool exhaustion from ORM leak', similarity: 91, outcome: 'Resolved', fixApplied: 'Added connection validation and leak detection in HikariCP', services: ['Database', 'Payment'], duration: '40min' },
      { id: 'INC-2024-0415', date: 'Apr 2024', title: 'Schema migration lock caused write outage', similarity: 87, outcome: 'Resolved', fixApplied: 'Adopted gh-ost for online schema migrations', services: ['Database', 'Migration Runner'], duration: '2.5hr' },
    ],
    evidenceItems: [
      { title: 'Connection Pool Usage', type: 'Metric', value: '98%', timeframe: '13:45 - 14:30', source: 'DB Dashboard', critical: true },
      { title: 'Query Execution Time', type: 'Log', value: '12min 18s', timeframe: '13:47:22', source: 'pg_stat_activity', critical: true },
      { title: 'Service Error Rate', type: 'Metric', value: '12%', timeframe: '13:48 - 14:30', source: 'Datadog', critical: true },
      { title: 'Lock Wait Time', type: 'Alert', value: '18min', timeframe: '14:00 - 14:18', source: 'PagerDuty', critical: false },
      { title: 'Replication Lag', type: 'Metric', value: '47s', timeframe: '14:15', source: 'K8s Metrics', critical: false },
      { title: 'Failed Connections', type: 'Event', value: '3,800', timeframe: '13:50 - 14:30', source: 'Connection Pooler', critical: true },
    ],
  },
  monitoring: {
    tag: 'monitoring',
    title: 'Microservices Monitoring Degradation — Prometheus Scrape Timeout & High Cardinality Metrics Cluster Load',
    services: ['Monitoring Service', 'Prometheus', 'Grafana', 'Alertmanager', 'K8s API Server', 'Metrics Collector'],
    riskScore: 78, confidence: 92, totalFailures: 7, criticalFailures: 1, highFailures: 3, mediumFailures: 2, lowFailures: 1,
    mrsAnalyzed: 1100, incidentsPrevented: 156,
    deps: [
      { service: 'Monitoring Service', deps: ['Prometheus', 'Grafana'], risk: 78, critical: true },
      { service: 'Prometheus', deps: ['K8s API Server', 'Metrics Collector'], risk: 85, critical: true },
      { service: 'Grafana', deps: ['Prometheus'], risk: 50, critical: false },
    ],
    failureModes: [
      { mode: 'High cardinality metrics exhaust Prometheus memory', severity: 'critical', probability: 'High', impact: 'Monitoring platform crash — blind spot for all services', detection: 'Prometheus container restart loop alert', mitigation: 'Apply metric relabeling rules to drop high cardinality labels' },
      { mode: 'Kubernetes API server rate limit during discovery', severity: 'high', probability: 'Medium', impact: 'Delay in discovering new pods for metrics collection', detection: 'K8s client 429 error rate logs spike', mitigation: 'Increase Prometheus resync interval and cache discovery results' },
      { mode: 'Grafana dashboard query timeout', severity: 'medium', probability: 'Low', impact: 'Dashboards return no data for ops team during incident', detection: 'Grafana query timeout errors in logs', mitigation: 'Optimize dashboard queries with recording rules and dashboard caching' },
    ],
    rootCauseChains: [
      { title: 'Metric Cardinality Cascade', chain: ['Unbounded label values added to custom metric', 'Prometheus TSDB memory consumption spikes', 'Prometheus OOM crash causing total monitoring blackout'], descriptions: ['Deployment of new microservice version introduced user-id as a metric label', 'Active series count increased from 1M to 15M, exhausting Prometheus pod memory', 'Prometheus crashed repeatedly, leaving operations team blind during incident'], confidences: [95, 90, 94], evidence: [10, 8, 12] }
    ],
    affectedSystems: [
      { name: 'Prometheus', impact: 'Critical', status: 'CrashLoop', rps: 'N/A' },
      { name: 'Grafana', impact: 'High', status: 'Degraded', rps: '150' },
      { name: 'Alertmanager', impact: 'High', status: 'Degraded', rps: '80' },
      { name: 'K8s API Server', impact: 'Medium', status: 'Stable', rps: '450' },
    ],
    keyFindingsData: [
      { id: 'F-001', title: 'High Cardinality Labels', description: 'Custom metric "http_request_duration_ms" includes user_id label — 15M active series created from 1M baseline', severity: 'critical' },
      { id: 'F-002', title: 'Prometheus Memory Unbounded', description: 'No memory limits or alerting on TSDB series count — Prometheus uses unlimited pod memory until OOM', severity: 'high' },
      { id: 'F-003', title: 'No Recording Rules', description: 'All dashboards query raw Prometheus data — no aggregation or recording rules to reduce query load', severity: 'medium' },
    ],
    similarIncidents: [
      { id: 'INC-2024-0110', date: 'Jan 2024', title: 'Prometheus OOM from label explosion', similarity: 96, outcome: 'Resolved', fixApplied: 'Applied relabeling rules and increased memory limits', services: ['Prometheus'], duration: '1hr' },
      { id: 'INC-2024-0420', date: 'Apr 2024', title: 'Grafana dashboards timeout during incident', similarity: 72, outcome: 'Resolved', fixApplied: 'Recording rules created for top-10 dashboard queries', services: ['Grafana', 'Prometheus'], duration: '4hr' },
    ],
    evidenceItems: [
      { title: 'Active Series Count', type: 'Metric', value: '15M', timeframe: 'After deploy', source: 'Prometheus Status', critical: true },
      { title: 'Prometheus OOM Count', type: 'Event', value: '6 restarts', timeframe: '09:00 - 09:30', source: 'K8s Events', critical: true },
      { title: 'Memory Utilization', type: 'Metric', value: '2.8GB/3GB', timeframe: 'Pre-crash', source: 'Container Metrics', critical: true },
      { title: 'Scrape Failures', type: 'Log', value: '34%', timeframe: '09:00 - 09:30', source: 'Prometheus Logs', critical: false },
      { title: 'Dashboard Errors', type: 'Alert', value: '12 dashboards', timeframe: '09:00 - 10:00', source: 'Grafana', critical: false },
      { title: 'Alertmanager Silences', type: 'Signal', value: '8', timeframe: 'During outage', source: 'Alertmanager API', critical: false },
    ],
  },
}

const severityColor = {
  critical: { border: 'border-red-500/30', bg: 'bg-red-500/[0.04]', dot: 'bg-red-500', badge: 'bg-red-500/10 text-red-400 border-red-500/20', text: 'text-red-400', glow: '#ef4444' },
  high: { border: 'border-orange-500/30', bg: 'bg-orange-500/[0.04]', dot: 'bg-orange-500', badge: 'bg-orange-500/10 text-orange-400 border-orange-500/20', text: 'text-orange-400', glow: '#f97316' },
  medium: { border: 'border-yellow-500/30', bg: 'bg-yellow-500/[0.04]', dot: 'bg-yellow-500', badge: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20', text: 'text-yellow-400', glow: '#eab308' },
}

function generateMockData(query) {
  const q = query.toLowerCase()
  let profile
  if (q.includes('payment') || q.includes('retry')) profile = PROFILES.payment
  else if (q.includes('auth') || q.includes('oauth') || q.includes('sso') || q.includes('token') || q.includes('identity')) profile = PROFILES.auth
  else if (q.includes('database') || q.includes('db') || q.includes('migrat') || q.includes('connection') || q.includes('pool') || q.includes('schema') || q.includes('sql')) profile = PROFILES.database
  else if (q.includes('monitor') || q.includes('metric') || q.includes('observ') || q.includes('prometheus') || q.includes('grafana') || q.includes('alert')) profile = PROFILES.monitoring
  else profile = pick([PROFILES.payment, PROFILES.auth, PROFILES.database, PROFILES.monitoring])

  const svc = profile.services
  const id = `#OV-${new Date().getFullYear()}-${rng(1000, 9999)}`
  const qTitle = query.length > 50 ? query.slice(0, 47) + '...' : query
  const rs = rng(-5, 5)
  const conf = rng(-3, 3)

  return {
    caseId: id,
    status: 'ACTIVE',
    title: qTitle ? `${ucFirst(qTitle)} — ${profile.title}` : profile.title,
    riskScore: Math.min(100, Math.max(1, profile.riskScore + rs)),
    confidence: Math.min(100, Math.max(1, profile.confidence + conf)),
    keyFindings: profile.failureModes.length,
    recommendationsCount: rng(3, 5),
    totalFailures: profile.totalFailures + rng(-1, 2),
    criticalFailures: profile.criticalFailures,
    highFailures: profile.highFailures + rng(-1, 1),
    mediumFailures: profile.mediumFailures,
    lowFailures: profile.lowFailures,
    mrsAnalyzed: profile.mrsAnalyzed + rng(-50, 50),
    incidentsPrevented: profile.incidentsPrevented + rng(-10, 10),
    impactScore: Math.min(100, Math.max(1, profile.riskScore + rs - rng(5, 10))),
    riskTimeline: [
      { phase: 'Design Phase', risk: rng(15, 35), color: 'green' },
      { phase: 'Implementation', risk: rng(45, 70), color: 'yellow' },
      { phase: 'Testing', risk: rng(60, 80), color: 'orange' },
      { phase: 'Deployment', risk: Math.min(100, profile.riskScore + rng(-5, 10)), color: 'red' },
      { phase: 'Post-Release', risk: rng(30, 60), color: 'yellow' },
    ],
    failureModes: profile.failureModes,
    deps: profile.deps,
    recommendations: [
      { id: `REC-${rng(100, 999)}`, title: `Apply ${profile.failureModes[0].mitigation}`, impact: profile.failureModes[0].impact, effort: pick(['High', 'Medium', 'Low']), priority: pick(['P0', 'P1']), confidence: rng(80, 98) },
      { id: `REC-${rng(100, 999)}`, title: `Fix ${profile.failureModes[1].mode.slice(0, 35)}`, impact: profile.failureModes[1].impact, effort: pick(['High', 'Medium']), priority: pick(['P0', 'P1']), confidence: rng(75, 95) },
      { id: `REC-${rng(100, 999)}`, title: `Add monitoring for ${svc[0]} metrics`, impact: 'Early detection of recurrence', effort: pick(['Low', 'Medium']), priority: 'P2', confidence: rng(85, 98) },
    ],
    rootCauses: [
      { cause: profile.rootCauseChains[0].chain[0], confidence: profile.rootCauseChains[0].confidences[0], recommendation: `Implement ${profile.rootCauseChains[0].chain[0].toLowerCase()} mechanism` },
      { cause: profile.rootCauseChains[0].chain[1], confidence: profile.rootCauseChains[0].confidences[1], recommendation: `Address ${profile.rootCauseChains[0].chain[1].toLowerCase()}` },
      { cause: profile.rootCauseChains[0].chain[2], confidence: profile.rootCauseChains[0].confidences[2], recommendation: `Resolve ${profile.rootCauseChains[0].chain[2].toLowerCase()} scenario` },
    ],
    rootCauseChains: profile.rootCauseChains,
    propagation: [
      { from: svc[0], to: svc[1], risk: rng(75, 92) },
      { from: svc[1], to: svc[2], risk: rng(55, 78) },
      { from: svc[0], to: svc[2], risk: rng(60, 85) },
    ],
    mitigations: [
      { phase: 'Immediate (24h)', actions: [`Roll back ${svc[0]} config to previous stable version`, `Apply ${profile.failureModes[0].mitigation}`, 'Enable verbose logging for monitoring'], owner: '@alice', timeline: '24 hours' },
      { phase: 'Short-Term (Next Sprint)', actions: [`Implement ${profile.failureModes[1].mitigation}`, 'Add health check with saturation metrics', 'Create runbook for recovery procedures'], owner: '@bob', timeline: '2 weeks' },
      { phase: 'Long-Term (Architectural)', actions: ['Migrate to event-driven architecture with dead letter queues', 'Implement chaos engineering pipeline', 'Build automated canary analysis for all changes'], owner: '@carol', timeline: '3 months' },
    ],
    verdict: { risk: profile.riskScore >= 80 ? 'Critical' : profile.riskScore >= 60 ? 'High' : 'Elevated', confidence: profile.confidence, findings: profile.failureModes.map(m => m.mode), action: profile.failureModes[0].mitigation },
    evidenceTimeline: profile.evidenceItems.map((ev, i) => ({
      date: `${new Date().getFullYear()}-${String(3 + Math.floor(i / 2)).padStart(2, '0')}-${String(10 + i * 3).padStart(2, '0')}`,
      type: ev.type === 'Metric' ? 'Alert' : ev.type === 'Log' ? 'Code Change' : ev.type === 'Alert' ? 'Incident' : 'Event',
      description: ev.title,
      source: ev.source,
      relevance: rng(70, 98),
    })),
    correlations: [
      { incident: `${svc[0]} Error Rate`, score: rng(75, 95), commonCause: profile.rootCauseChains[0].chain[0], services: [svc[0], svc[1]], gap: `${rng(1, 5)} days` },
      { incident: `${svc[1]} Latency Spike`, score: rng(65, 88), commonCause: profile.rootCauseChains[0].chain[1], services: [svc[1], svc[2]], gap: `${rng(2, 7)} days` },
      { incident: 'Infrastructure Saturation', score: rng(50, 75), commonCause: 'Resource exhaustion', services: [svc[2], svc[3] || svc[0]], gap: `${rng(3, 10)} days` },
    ],
    heatmap: [
      { phase: 'Design', critical: rng(10, 20), high: rng(20, 30), medium: rng(10, 20), low: rng(5, 10) },
      { phase: 'Implementation', critical: rng(25, 40), high: rng(35, 50), medium: rng(15, 25), low: rng(8, 15) },
      { phase: 'Testing', critical: rng(45, 60), high: rng(50, 65), medium: rng(25, 40), low: rng(10, 20) },
      { phase: 'Deployment', critical: rng(65, 85), high: rng(60, 75), medium: rng(35, 50), low: rng(20, 30) },
      { phase: 'Post-Release', critical: rng(35, 55), high: rng(40, 55), medium: rng(20, 35), low: rng(15, 25) },
    ],
    blastRadius: {
      center: svc[0],
      depth: `${rng(2, 4)} levels deep`,
      totalServices: svc.length,
      zones: svc.slice(1).map((s, i) => ({ name: s, radius: i + 1, risk: rng(40, 85), critical: i < 2, files: rng(3, 15), status: pick(['Degraded', 'At Risk', 'Stable']) })),
    },
    investigationTimeline: [
      { date: `${new Date().getFullYear()}-${String(rng(3, 5)).padStart(2, '0')}-${String(rng(1, 28)).padStart(2, '0')}`, type: 'Detection', title: `Monitoring alert triggered on ${svc[0]}`, description: `Alert fired — ${profile.failureModes[0].detection}`, team: 'Platform', duration: `${rng(2, 10)}min` },
      { date: `${new Date().getFullYear()}-${String(rng(3, 5)).padStart(2, '0')}-${String(rng(1, 28)).padStart(2, '0')}`, type: 'Analysis', title: `Root cause identified in ${svc[0]}`, description: `Engineering traced issue to ${profile.rootCauseChains[0].chain[0]}`, team: pick(['@alice, @bob', '@carol, @dave']), duration: `${rng(20, 60)}min` },
      { date: `${new Date().getFullYear()}-${String(rng(4, 6)).padStart(2, '0')}-${String(rng(1, 28)).padStart(2, '0')}`, type: 'Escalation', title: `Incident escalated — ${profile.failureModes[0].impact.slice(0, 40)}`, description: profile.failureModes[0].impact, team: 'SRE, Platform', duration: `${rng(10, 30)}min` },
      { date: `${new Date().getFullYear()}-${String(rng(4, 6)).padStart(2, '0')}-${String(rng(1, 28)).padStart(2, '0')}`, type: 'Resolution', title: `Hotfix deployed for ${svc[0]}`, description: profile.failureModes[0].mitigation, team: pick(['@alice, Platform', '@bob, SRE']), duration: `${rng(20, 40)}min` },
      { date: `${new Date().getFullYear()}-${String(rng(5, 7)).padStart(2, '0')}-${String(rng(1, 28)).padStart(2, '0')}`, type: 'Review', title: 'Post-mortem analysis complete', description: `Full RCA with ${profile.failureModes.length} failure modes identified, ${profile.affectedSystems.length} services impacted`, team: 'Engineering, SRE', duration: `${rng(1, 3)}hr` },
      { date: `${new Date().getFullYear()}-${String(rng(5, 7)).padStart(2, '0')}-${String(rng(1, 28)).padStart(2, '0')}`, type: 'Closed', title: 'Case closed with recommendations', description: `${profile.failureModes.length + 2} recommendations pushed to backlog with P0/P1 prioritization`, team: 'Platform', duration: '1hr' },
    ],
    liveFeed: [
      { time: '14:23:15', type: 'alert', message: `Error rate spike on ${svc[0]} — automated rollback triggered`, severity: 'critical' },
      { time: '14:22:48', type: 'event', message: `${profile.rootCauseChains[0].chain[0]} detected on ${svc[0]} after ${rng(3, 15)} consecutive failures`, severity: 'high' },
      { time: '14:22:12', type: 'investigation', message: `AI analysis completed — ${profile.failureModes.length} failure modes identified across ${svc.length} services with ${profile.confidence}% confidence`, severity: 'info' },
      { time: '14:21:30', type: 'risk', message: `Risk propagation probability: ${svc[0]} -> ${svc[1]} now at ${rng(75, 92)}% likelihood`, severity: 'warning' },
      { time: '14:20:55', type: 'alert', message: `${svc[1]} resource threshold at ${rng(85, 95)}% — potential ${pick(['OOM', 'crash', 'throttle'])} risk`, severity: 'high' },
      { time: '14:20:10', type: 'event', message: `New correlation found: pattern matches ${rng(85, 98)}% with current incident signature`, severity: 'info' },
      { time: '14:19:25', type: 'investigation', message: `Blast radius analysis expanded — ${svc[2]} added to impact zone`, severity: 'warning' },
      { time: '14:18:40', type: 'risk', message: `${svc[3] || svc[0]} identified as downstream risk — propagation likelihood ${rng(60, 85)}%`, severity: 'medium' },
      { time: '14:18:00', type: 'event', message: `Incident timeline updated — ${profile.evidenceItems.length} forensic artifacts collected for evidence chain`, severity: 'info' },
      { time: '14:17:20', type: 'alert', message: `${svc[1]} connection pool utilization at ${rng(80, 95)}% — approaching critical threshold`, severity: 'medium' },
    ],
    decisions: [
      { action: 'Deploy Now', confidence: rng(85, 95), reasoning: `${profile.failureModes[0].mitigation} ready with automated rollback protection — high confidence`, team: pick(['@alice', '@bob']), urgency: 'immediate' },
      { action: 'Monitor Closely', confidence: rng(75, 88), reasoning: `${svc[1]} still within safe limits — observe for ${rng(1, 4)} hours before escalation`, team: pick(['@bob', '@carol']), urgency: 'short' },
      { action: 'Rollback Changes', confidence: rng(70, 85), reasoning: `Revert last ${rng(2, 5)} MRs to restore stable state — ${rng(70, 85)}% confidence in regression cause`, team: pick(['@carol', '@dave']), urgency: 'medium' },
      { action: 'Investigate Further', confidence: rng(88, 96), reasoning: `Additional correlation data needed on ${svc[2]} — deep-dive into metrics and heap dumps`, team: pick(['@dave', '@eve']), urgency: 'long' },
    ],
    riskReduction: [
      { phase: 'Immediate', reduction: rng(40, 65) },
      { phase: 'Short-Term', reduction: rng(65, 85) },
      { phase: 'Long-Term', reduction: rng(85, 98) },
    ],
    recommendationConfidence: [rng(85, 95), rng(80, 92), rng(75, 90), rng(70, 88), rng(85, 95)],
    keyFindingsData: profile.keyFindingsData,
    affectedSystems: profile.affectedSystems,
    whatIfSimulation: {
      currentPath: { riskReduction: rng(15, 30), costSavings: 0, successProbability: rng(35, 50), recoveryTime: `${rng(30, 60)}min` },
      recommendedPath: { riskReduction: rng(70, 88), costSavings: rng(200, 500) * 1000, successProbability: rng(88, 96), recoveryTime: `${rng(8, 20)}min` },
      scenarios: [
        { name: pick(['No Action', 'Current State', 'Without Fix']), risk: rng(75, 92), impact: `$${rng(200, 400)}K loss`, timeToRecover: `${rng(30, 60)}min`, confidence: rng(85, 95) },
        { name: pick(['Recommended Fix', 'With Circuit Breaker', 'Partial Mitigation']), risk: rng(15, 35), impact: `$${rng(15, 55)}K loss`, timeToRecover: `${rng(8, 20)}min`, confidence: rng(88, 96) },
        { name: 'Full Architecture Remediation', risk: rng(8, 20), impact: `$${rng(5, 15)}K loss`, timeToRecover: `${rng(3, 8)}min`, confidence: rng(82, 92) },
      ],
      metrics: { riskReduction: rng(65, 80), costSavings: rng(200, 500) * 1000, successBoost: rng(40, 55), timeReduction: rng(65, 80) }
    },
    forecast: {
      predictions: [
        { period: '24 hours', risk: rng(15, 30), confidence: rng(88, 96), trend: 'down', description: `${profile.failureModes[0].mitigation} stabilizes ${svc[0]}. Predicted error rate drops from ${rng(3, 6)}% to under 0.5%.` },
        { period: '7 days', risk: rng(25, 40), confidence: rng(82, 92), trend: 'stable', description: `${profile.failureModes[1]?.mitigation?.slice(0, 45) || 'Mitigations'} prevent cascading failures. MTTR reduces to ${rng(10, 20)}min.` },
        { period: '30 days', risk: rng(12, 25), confidence: rng(78, 88), trend: 'down', description: `Complete architectural remediation reduces incident probability by ${rng(70, 88)}%. Projected cost avoidance: $${rng(250, 450)}K.` },
      ],
      trendData: [
        { month: 'Jan', incidents: rng(2, 5), mttr: rng(25, 45) },
        { month: 'Feb', incidents: rng(2, 5), mttr: rng(30, 50) },
        { month: 'Mar', incidents: rng(3, 6), mttr: rng(35, 55) },
        { month: 'Apr', incidents: rng(4, 8), mttr: rng(40, 65) },
        { month: 'May', incidents: rng(3, 7), mttr: rng(35, 55) },
        { month: 'Jun', incidents: rng(1, 4), mttr: rng(20, 35) },
      ],
      riskByService: svc.slice(0, 4).map(s => ({ service: s, currentRisk: rng(50, 90), mitigatedRisk: rng(10, 30), improvement: rng(60, 85) })),
    },
    similarIncidents: profile.similarIncidents,
    evidenceItems: profile.evidenceItems.map((ev, i) => ({
      ...ev,
      timeframe: ev.timeframe || `${String(14 + Math.floor(i / 2)).padStart(2, '0')}:${String(15 + (i * 7) % 45).padStart(2, '0')} - ${String(14 + Math.floor(i / 2)).padStart(2, '0')}:${String(15 + (i * 7 + 15) % 45).padStart(2, '0')}`,
    })),
    incidents: profile.similarIncidents.slice(0, 3).map((inc, i) => ({
      title: inc.title,
      date: inc.date,
      cause: `Root cause: ${profile.rootCauseChains[0].chain[i] || profile.rootCauseChains[0].chain[0]}`,
      impact: `Impacted ${inc.services.length} services — ${inc.duration} duration`,
      duration: inc.duration,
      services: inc.services,
      severity: i === 0 ? 'critical' : i === 1 ? 'high' : 'medium',
      lessons: `Fix applied: ${inc.fixApplied}`,
    })),
    mrs: [
      { id: `MR #${rng(100, 999)}`, author: pick(['@alice', '@bob', '@carol']), date: pick(['May 12', 'Jun 1', 'Apr 20']), desc: `${profile.failureModes[0].mode.slice(0, 50)} — ${pick(['failed integration tests', 'caused production incident', 'review needed'])}`, outcome: pick(['Incident', 'Near Miss', 'Critical']), match: rng(70, 95), files: rng(3, 18), risk: pick(['critical', 'high', 'medium']) },
      { id: `MR #${rng(100, 999)}`, author: pick(['@bob', '@carol', '@dave']), date: pick(['Jun 15', 'Jul 2', 'May 28']), desc: `${profile.failureModes[1].mode.slice(0, 50)} — ${pick(['regression', 'performance issue', 'config change'])}`, outcome: pick(['Incident', 'Near Miss']), match: rng(65, 92), files: rng(5, 15), risk: pick(['high', 'medium']) },
      { id: `MR #${rng(100, 999)}`, author: pick(['@alice', '@dave', '@eve']), date: pick(['Apr 20', 'Mar 15', 'Feb 28']), desc: `${profile.failureModes[2]?.mode?.slice(0, 50) || 'Infrastructure change in ' + svc[0]}`, outcome: pick(['Near Miss', 'Resolved']), match: rng(55, 80), files: rng(2, 12), risk: 'medium' },
      { id: `MR #${rng(100, 999)}`, author: pick(['@carol', '@alice', '@frank']), date: pick(['Jul 5', 'Jun 20', 'May 5']), desc: `Rollback of ${svc[0]} deployment — ${pick(['config error', 'memory leak', 'timeout regression'])}`, outcome: pick(['Incident', 'Resolved']), match: rng(75, 90), files: rng(8, 25), risk: pick(['critical', 'high']) },
      { id: `MR #${rng(100, 999)}`, author: pick(['@dave', '@bob', '@grace']), date: pick(['Mar 22', 'Feb 10', 'Jan 30']), desc: `${svc[0]} resilience improvement — ${pick(['circuit breaker', 'retry logic', 'timeout handling'])}`, outcome: pick(['Resolved', 'Merged']), match: rng(60, 85), files: rng(10, 30), risk: 'low' },
    ],
  }
}

export default function IntelligenceCenter() {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(investigationData)
  const [showPresets, setShowPresets] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState(-1)
  const [timeAgo, setTimeAgo] = useState('2 min ago')
  const feedRef = useRef(null)
  const [copied, setCopied] = useState(false)
  const [expandedChain, setExpandedChain] = useState(null)
  const [selectedEvidence, setSelectedEvidence] = useState(null)
  const [hoveredDep, setHoveredDep] = useState(null)
  const [expandedMitigation, setExpandedMitigation] = useState(null)
  const [expandedFailure, setExpandedFailure] = useState(null)
  const copyId = () => {
    if (!data?.caseId) return
    navigator.clipboard.writeText(data.caseId).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  const presets = ['Payment Service Retry Logic', 'Monitoring Service Cardinality', 'Database Connection Pool']
  const filtered = presets.filter(p => p.toLowerCase().includes(input.toLowerCase()))

  useEffect(() => {
    if (!loading && data) console.log('[RESULTS_RENDERED]')
  }, [loading, data])

  const investigate = (text) => {
    if (!text.trim()) return
    console.log('[INVESTIGATION_STARTED]', text)
    setLoading(true)
    const result = generateMockData(text)
    setTimeout(() => {
      setData(result)
      console.log('[STATE_UPDATED]', result)
      setLoading(false)
    }, 800)
  }

  const handleKey = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const val = (selectedPreset >= 0 && filtered[selectedPreset]) ? filtered[selectedPreset] : input
      setInput(val)
      investigate(val)
      setShowPresets(false)
    }
    if (!showPresets) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedPreset(p => Math.min(p + 1, filtered.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedPreset(p => Math.max(p - 1, 0)) }
    if (e.key === 'Escape') setShowPresets(false)
  }

  return (
    <Layout>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-2 pb-4 overflow-x-hidden px-1 sm:px-0">

        <div className="space-y-2 mb-2">
          <PageHero
            title="Investigate Root Cause"
            subtitle="AI-powered investigation analyzing 47 services, 128 past incidents, and real-time telemetry to identify root cause and blast radius."
            impact="$2.4M"
            impactLabel="Revenue Protected"
            confidence={94}
          />
          <BusinessImpact />
          <AIRecommendations />
          <InvestigationWorkflow />
        </div>

        {/* ===== Investigation Query ===== */}
        <motion.div variants={item} className="glass-card p-2">
          <div className="flex items-center gap-1.5 mb-2">
            <div className="flex h-4 w-4 items-center justify-center rounded-md bg-gradient-to-br from-cyan-500/20 to-blue-500/20">
              <svg className="h-2.5 w-2.5 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
            <span className="text-[9px] text-slate-500 font-mono tracking-wide">Investigation Query Interface</span>
          </div>
          <form onSubmit={e => { e.preventDefault(); investigate(input) }}>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input ref={el => { if (el) el.focus() }} type="text" value={input} onChange={e => { setInput(e.target.value); setShowPresets(true) }} onFocus={() => setShowPresets(true)} onKeyDown={handleKey}
                placeholder="Run a new investigation - enter feature, incident, or MR ID..."
                className="w-full rounded-xl border border-white/[0.06] bg-slate-800/60 py-2.5 pl-10 pr-40 text-xs text-white placeholder-slate-600 outline-none focus:border-cyan-500/50 focus:bg-slate-800/80 focus:shadow-[0_0_15px_rgba(6,182,212,0.1)] transition-all font-mono tracking-wide"
                disabled={loading} />
              <div className="absolute inset-y-1 right-1.5 flex items-center gap-1">
                <button type="submit" disabled={loading || !input.trim()}
                  className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-1.5 text-xs font-semibold text-white transition-all hover:opacity-90 hover:shadow-lg hover:shadow-cyan-500/25 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed">
                  {loading ? (
                    <><svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Investigating</>
                  ) : (
                    <><svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>Investigate</>
                  )}
                </button>
              </div>
            </div>
          </form>
          <AnimatePresence>
            {showPresets && filtered.length > 0 && !loading && (
              <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="mt-1.5 rounded-xl border border-white/[0.06] bg-slate-800/80 overflow-hidden">
                {filtered.map((s, i) => (
                  <button key={s} type="button"
                    className={'flex w-full items-center gap-2 px-3 py-2 text-left text-xs transition-colors ' + (i === selectedPreset ? 'bg-cyan-500/10 text-cyan-300' : 'text-slate-500 hover:bg-white/[0.04] hover:text-white')}
                    onClick={() => { setInput(s); setShowPresets(false); investigate(s) }}>
                    <svg className="h-3 w-3 shrink-0 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>
                    {s}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ===== PREMIUM SECTION 1: ROOT CAUSE COMMAND CENTER HERO ===== */}
        <motion.div variants={item} className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.04] via-transparent to-purple-500/[0.03] pointer-events-none" />
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-cyan-500/[0.06] rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500/[0.05] rounded-full blur-[100px] pointer-events-none" />
          <div className="relative p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold tracking-[0.2em] text-white uppercase">ROOT CAUSE COMMAND CENTER</h1>
                <p className="text-xs text-slate-400 font-mono mt-1 max-w-3xl">{data.title}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button onClick={copyId} className="group flex items-center gap-1.5 font-mono text-[10px] text-slate-500 border border-white/[0.08] rounded-lg px-3 py-1.5 tracking-wider hover:border-cyan-500/30 hover:text-cyan-400 transition-all">
                  {copied ? 'Copied!' : data.caseId}
                  <svg className="h-3 w-3 text-slate-600 group-hover:text-cyan-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 8.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v8.25A2.25 2.25 0 006 16.5h2.25m8.25-8.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-7.5A2.25 2.25 0 018.25 18v-1.5m8.25-8.25h-3a4.5 4.5 0 01-4.5-4.5v-3" />
                  </svg>
                </button>
                <span className="flex items-center gap-1.5 text-[10px] text-green-400 font-mono tracking-wider border border-green-500/20 rounded-lg px-3 py-1.5">
                  <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.5)]" />
                  {data.status}
                </span>
                <span className="text-[10px] text-slate-600 font-mono border border-white/[0.06] rounded-lg px-3 py-1.5">
                  Updated {timeAgo}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/[0.08] to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none" />
                <div className="relative rounded-xl border border-white/[0.06] bg-white/[0.03] p-4 text-center backdrop-blur-sm">
                  <div className="text-4xl font-bold text-cyan-400 font-mono tracking-tight"><AnimatedCounter value={data.totalFailures} /></div>
                  <div className="text-[10px] text-slate-500 font-mono tracking-wider uppercase mt-1">Total Failures</div>
                  <div className="flex items-center justify-center gap-1.5 mt-2 text-[9px] text-slate-600">
                    <span className="text-red-400">{data.criticalFailures}C</span>
                    <span className="text-orange-400">{data.highFailures}H</span>
                    <span className="text-yellow-400">{data.mediumFailures}M</span>
                    <span className="text-green-400">{data.lowFailures}L</span>
                  </div>
                </div>
              </div>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-b from-blue-500/[0.08] to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none" />
                <div className="relative rounded-xl border border-white/[0.06] bg-white/[0.03] p-4 text-center backdrop-blur-sm">
                  <div className="text-4xl font-bold text-blue-400 font-mono tracking-tight"><AnimatedCounter value={data.mrsAnalyzed} /></div>
                  <div className="text-[10px] text-slate-500 font-mono tracking-wider uppercase mt-1">MRs Analyzed</div>
                  <div className="mt-2 text-[9px] text-slate-600 font-mono">Across {data.deps.length} services</div>
                </div>
              </div>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-b from-green-500/[0.08] to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none" />
                <div className="relative rounded-xl border border-white/[0.06] bg-white/[0.03] p-4 text-center backdrop-blur-sm">
                  <div className="text-4xl font-bold text-green-400 font-mono tracking-tight"><AnimatedCounter value={data.incidentsPrevented} /></div>
                  <div className="text-[10px] text-slate-500 font-mono tracking-wider uppercase mt-1">Incidents Prevented</div>
                  <div className="mt-2 text-[9px] text-slate-600 font-mono">AI-driven prevention</div>
                </div>
              </div>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-b from-purple-500/[0.08] to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none" />
                <div className="relative rounded-xl border border-white/[0.06] bg-white/[0.03] p-4 text-center backdrop-blur-sm">
                  <div className="text-4xl font-bold text-purple-400 font-mono tracking-tight">{data.confidence}<span className="text-xl text-purple-500/60">%</span></div>
                  <div className="text-[10px] text-slate-500 font-mono tracking-wider uppercase mt-1">Confidence</div>
                  <div className="mt-2 text-[9px] text-slate-600 font-mono">AI forensic certainty</div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <RiskGauge score={data.riskScore} />
                <div className="w-32">
                  <ConfidenceMeter confidence={data.confidence} label="INVESTIGATION CONFIDENCE" />
                </div>
              </div>
              <div className="flex items-center gap-3 border-l border-white/[0.06] pl-4">
                <div>
                  <span className="text-[9px] text-slate-600 font-mono uppercase tracking-wider">Impact Score</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold text-amber-400 font-mono">{data.impactScore}</span>
                    <span className="text-[9px] text-amber-400/60 font-mono">/100</span>
                  </div>
                </div>
                <StatusBadge status="critical" label="HIGH RISK" />
                <div className="flex items-center gap-1.5">
                  {(data.affectedSystems || []).slice(0, 3).map((sys, i) => (
                    <div key={i} className="inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-[9px] border-white/[0.06] bg-white/[0.02]">
                      <span className={(sys?.impact === 'Critical' ? 'bg-red-500 animate-pulse' : sys?.impact === 'High' ? 'bg-orange-500' : 'bg-yellow-500') + ' h-1.5 w-1.5 rounded-full'} />
                      <span className="text-slate-300 font-mono">{sys?.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ===== PREMIUM SECTION 2: ANIMATED AI BRAIN (NEURAL NETWORK) ===== */}
        <motion.div variants={item} className="relative overflow-hidden rounded-2xl border border-white/[0.08]">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(6,182,212,0.08)_0%,_transparent_60%)] pointer-events-none" />
          <div className="relative p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20">
                <svg className="h-3.5 w-3.5 text-cyan-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
              </div>
              <h3 className="text-sm font-bold text-white tracking-wider">AI Neural Forensics Engine</h3>
              <span className="text-[10px] text-slate-600 font-mono">deep learning analysis</span>
            </div>
            <div className="w-full min-h-[350px] relative max-w-full">
              <svg viewBox="0 0 600 350" className="w-full h-full max-w-full">
                <defs>
                  <linearGradient id="brainBg" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="rgba(6,182,212,0.15)" />
                    <stop offset="100%" stopColor="rgba(168,85,247,0.15)" />
                  </linearGradient>
                  <filter id="glowBrain"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                  <filter id="glowBrainIntense"><feGaussianBlur stdDeviation="6" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                </defs>
                <rect width="600" height="350" fill="url(#brainBg)" rx="12" />
                <motion.g style={{ transformOrigin: '300px 175px' }} animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}>
                  <circle cx="300" cy="175" r="130" fill="none" stroke="rgba(6,182,212,0.08)" strokeWidth="1" strokeDasharray="4 8" />
                </motion.g>
                <motion.g style={{ transformOrigin: '300px 175px' }} animate={{ rotate: -360 }} transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}>
                  <circle cx="300" cy="175" r="110" fill="none" stroke="rgba(168,85,247,0.08)" strokeWidth="1" strokeDasharray="6 10" />
                </motion.g>
                {[
                  { label: 'Services', angle: -90, color: '#06b6d4' },
                  { label: 'Logs', angle: -18, color: '#f59e0b' },
                  { label: 'Deployments', angle: 54, color: '#8b5cf6' },
                  { label: 'Dependencies', angle: 126, color: '#ef4444' },
                  { label: 'Incidents', angle: 198, color: '#22c55e' },
                ].map((node, i) => {
                  const angleRad = (node.angle * Math.PI) / 180
                  const nx = 300 + 140 * Math.cos(angleRad)
                  const ny = 175 + 140 * Math.sin(angleRad)
                  if (!Number.isFinite(nx) || !Number.isFinite(ny)) return null
                  return (
                    <g key={'node-' + i}>
                      <motion.path d={'M 300 175 L ' + nx + ' ' + ny} stroke={node.color} strokeWidth="1.5" strokeOpacity={0.3} strokeDasharray="6 4"
                        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: i * 0.2, ease: 'easeInOut' }} />
                      <motion.circle cx={nx} cy={ny} r="22" fill={node.color + '15'} stroke={node.color} strokeWidth="1.5" strokeOpacity={0.5}
                        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 100, delay: 0.5 + i * 0.2 }} />
                      <motion.circle cx={nx} cy={ny} r="5" fill={node.color} opacity={0.7}
                        animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }} />
                      <text x={nx} y={ny + 4} textAnchor="middle" fill={node.color} fontSize="7.5" fontWeight="600" fontFamily="monospace">{node.label}</text>
                    </g>
                  )
                })}
                <motion.circle cx="300" cy="175" r="32" fill="rgba(6,182,212,0.15)" stroke="rgba(6,182,212,0.5)" strokeWidth="2" filter="url(#glowBrain)"
                  animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} />
                <circle cx="300" cy="175" r="8" fill="rgba(6,182,212,0.6)" filter="url(#glowBrainIntense)" />
                <circle cx="300" cy="175" r="4" fill="#06b6d4" />
                <motion.circle cx="300" cy="175" r="40" fill="none" stroke="rgba(6,182,212,0.15)" strokeWidth="1"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }} />
                <motion.circle cx="300" cy="175" r="55" fill="none" stroke="rgba(6,182,212,0.1)" strokeWidth="1"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0, 0.2] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeOut', delay: 0.5 }} />
                <motion.g style={{ transformOrigin: '300px 175px' }} animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}>
                  <circle cx="300" cy="175" r="28" fill="none" stroke="rgba(6,182,212,0.3)" strokeWidth="1" strokeDasharray="3 5" />
                </motion.g>
                <text x="300" y="178" textAnchor="middle" fill="#06b6d4" fontSize="8" fontWeight="700" fontFamily="monospace" letterSpacing="2">AI BRAIN</text>
                {Array.from({ length: 20 }).map((_, i) => {
                  const px = 30 + Math.random() * 540
                  const py = 20 + Math.random() * 310
                  const size = 1.5 + Math.random() * 2
                  if (!Number.isFinite(px) || !Number.isFinite(py)) return null
                  return (
                    <motion.circle key={'p-' + i} cx={px} cy={py} r={size} fill={i % 2 === 0 ? 'rgba(6,182,212,0.4)' : 'rgba(168,85,247,0.3)'}
                      animate={{ y: [0, -10 - Math.random() * 15, 0], opacity: [0.2, 0.6, 0.2] }}
                      transition={{ duration: 3 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2, ease: 'easeInOut' }} />
                  )
                })}
              </svg>
            </div>
          </div>
        </motion.div>

        {/* ===== PREMIUM SECTION 3: EVIDENCE CONSTELLATION ===== */}
        <motion.div variants={item} className="relative overflow-hidden rounded-2xl border border-white/[0.08]">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/50" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(168,85,247,0.05)_0%,_transparent_60%)] pointer-events-none" />
          <div className="relative p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/20 to-indigo-500/20">
                <svg className="h-3.5 w-3.5 text-purple-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
              </div>
              <h3 className="text-sm font-bold text-white tracking-wider">Evidence Constellation</h3>
              <span className="text-[10px] text-slate-600 font-mono">{data.evidenceItems.length} forensic artifacts mapped</span>
            </div>
            <div className="relative w-full h-[380px] sm:h-[420px]">
              <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                {(() => {
                  const typeColors = {
                    Metric: 'rgba(6,182,212,', Log: 'rgba(245,158,11,', Alert: 'rgba(239,68,68,', Signal: 'rgba(168,85,247,', Event: 'rgba(34,197,94,'
                  }
                  const positions = [
                    { x: 50, y: 40 }, { x: 82, y: 65 }, { x: 30, y: 75 },
                    { x: 68, y: 88 }, { x: 45, y: 20 }, { x: 18, y: 50 },
                  ]
                  const lines = []
                  const nodes = []
                  data.evidenceItems.forEach((ev, i) => {
                    const from = positions[i] || { x: 50 + i * 10, y: 40 + i * 8 }
                    if (!positions[i]) console.warn('[IC Evidence] positions out of range at i=' + i + ' length=' + data.evidenceItems.length)
                    const fx = Number.isFinite(from?.x) ? from.x : 50
                    const fy = Number.isFinite(from?.y) ? from.y : 50
                    for (let j = i + 1; j < data.evidenceItems.length; j++) {
                      if (j - i <= 2) {
                        const to = positions[j]
                        if (to) {
                          const tox = Number.isFinite(to?.x) ? to.x : 50
                          const toy = Number.isFinite(to?.y) ? to.y : 50
                          lines.push(
                            <motion.line key={'el-' + i + '-' + j} x1={fx} y1={fy} x2={tox} y2={toy}
                              stroke="rgba(255,255,255,0.06)" strokeWidth="0.3" strokeDasharray="1 2"
                              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, delay: i * 0.15 }} />
                          )
                        }
                      }
                    }
                    const colorKey = typeColors[ev.type] || 'rgba(148,163,184,'
                    const r = ev.critical ? 5 : 3.5
                    nodes.push(
                      <g key={'ev-' + i}>
                        <motion.circle cx={fx} cy={fy} r={r + 3} fill={colorKey + '0.1)'} stroke="none"
                          animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 3, repeat: Infinity, delay: i * 0.4, ease: 'easeInOut' }} />
                        <motion.circle cx={fx} cy={fy} r={r} fill={colorKey + '0.5)'} stroke={colorKey + '0.7)'} strokeWidth="0.5"
                          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 150, delay: 0.3 + i * 0.15 }} />
                        {ev.critical && (
                          <motion.circle cx={fx} cy={fy} r={r + 4} fill="none" stroke="rgba(239,68,68,0.3)" strokeWidth="0.5"
                            animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }} />
                        )}
                        <motion.text x={fx} y={fy + r + 6} textAnchor="middle" fill={colorKey + '0.8)'} fontSize="2.5" fontFamily="monospace" fontWeight="600"
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 + i * 0.15 }}>
                          {ev.title}
                        </motion.text>
                        <text x={fx} y={fy - r - 2} textAnchor="middle" fill={colorKey + '0.6)'} fontSize="2" fontFamily="monospace">
                          {ev.type}
                        </text>
                      </g>
                    )
                  })
                  for (let k = 0; k < 30; k++) {
                    nodes.push(
                      <motion.circle key={'star-' + k} cx={5 + Math.random() * 90} cy={5 + Math.random() * 90} r={0.3 + Math.random() * 0.5} fill="rgba(255,255,255,0.1)"
                        animate={{ opacity: [0.1, 0.4, 0.1] }} transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2 }} />
                    )
                  }
                  return [...lines, ...nodes]
                })()}
              </svg>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-3 text-[8px] text-slate-600 font-mono bg-slate-900/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/[0.06]">
                <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />Metric</span>
                <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-amber-500" />Log</span>
                <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-red-500" />Alert</span>
                <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-purple-500" />Signal</span>
                <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-green-500" />Event</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />Critical</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ===== PREMIUM SECTION 4: BLAST RADIUS SIMULATION ===== */}
        <motion.div variants={item} className="relative overflow-hidden rounded-2xl border border-white/[0.08]">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-orange-950/30" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(239,68,68,0.05)_0%,_transparent_60%)] pointer-events-none" />
          <div className="relative p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500/20 to-red-500/20">
                <svg className="h-3.5 w-3.5 text-orange-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <h3 className="text-sm font-bold text-white tracking-wider">Blast Radius Simulation</h3>
              <StatusBadge status="critical" label={data.blastRadius.totalServices + ' services in range'} />
              <span className="text-[10px] text-slate-600 font-mono">depth: {data.blastRadius.depth}</span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">
              <div className="relative w-full max-w-[420px] mx-auto aspect-square">
                <svg viewBox="0 0 400 400" className="w-full h-full">
                  <defs>
                    <radialGradient id="zone3Grad"><stop offset="0%" stopColor="rgba(234,179,8,0)" /><stop offset="100%" stopColor="rgba(234,179,8,0.06)" /></radialGradient>
                    <radialGradient id="zone2Grad"><stop offset="0%" stopColor="rgba(249,115,22,0)" /><stop offset="100%" stopColor="rgba(249,115,22,0.08)" /></radialGradient>
                    <radialGradient id="zone1Grad"><stop offset="0%" stopColor="rgba(239,68,68,0)" /><stop offset="100%" stopColor="rgba(239,68,68,0.1)" /></radialGradient>
                  </defs>
                  <circle cx="200" cy="200" r="185" fill="url(#zone3Grad)" stroke="rgba(234,179,8,0.15)" strokeWidth="1" strokeDasharray="4 6" />
                  <circle cx="200" cy="200" r="130" fill="url(#zone2Grad)" stroke="rgba(249,115,22,0.2)" strokeWidth="1" strokeDasharray="3 5" />
                  <circle cx="200" cy="200" r="75" fill="url(#zone1Grad)" stroke="rgba(239,68,68,0.3)" strokeWidth="1.5" strokeDasharray="2 4" />
                  <motion.circle cx="200" cy="200" r="18" fill="rgba(239,68,68,0.15)" stroke="rgba(239,68,68,0.5)" strokeWidth="1.5"
                    animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 2.5, repeat: Infinity }} />
                  <circle cx="200" cy="200" r="6" fill="rgba(239,68,68,0.6)" />
                  <motion.circle cx="200" cy="200" r="30" fill="none" stroke="rgba(239,68,68,0.2)" strokeWidth="1"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0, 0.2] }} transition={{ duration: 2, repeat: Infinity }} />
                  <text x="200" y="203" textAnchor="middle" fill="#ef4444" fontSize="6" fontWeight="600" fontFamily="monospace">{data.blastRadius.center}</text>
                  <circle cx="60" cy="200" r="14" fill="rgba(234,179,8,0.12)" stroke="rgba(234,179,8,0.3)" strokeWidth="1" />
                  <text x="60" y="198" textAnchor="middle" fill="#eab308" fontSize="5" fontFamily="monospace" fontWeight="600">Notification</text>
                  <text x="60" y="206" textAnchor="middle" fill="#854d0e" fontSize="4" fontFamily="monospace">R:45%</text>
                  <circle cx="280" cy="140" r="14" fill="rgba(249,115,22,0.12)" stroke="rgba(249,115,22,0.3)" strokeWidth="1" />
                  <text x="280" y="138" textAnchor="middle" fill="#f97316" fontSize="5" fontFamily="monospace" fontWeight="600">Billing</text>
                  <text x="280" y="146" textAnchor="middle" fill="#7c2d12" fontSize="4" fontFamily="monospace">R:65%</text>
                  <circle cx="310" cy="240" r="14" fill="rgba(249,115,22,0.12)" stroke="rgba(249,115,22,0.3)" strokeWidth="1" />
                  <text x="310" y="238" textAnchor="middle" fill="#f97316" fontSize="5" fontFamily="monospace" fontWeight="600">API GW</text>
                  <text x="310" y="246" textAnchor="middle" fill="#7c2d12" fontSize="4" fontFamily="monospace">R:72%</text>
                  <circle cx="200" cy="130" r="14" fill="rgba(239,68,68,0.15)" stroke="rgba(239,68,68,0.4)" strokeWidth="1.5" />
                  <text x="200" y="128" textAnchor="middle" fill="#ef4444" fontSize="5" fontFamily="monospace" fontWeight="600">Payment</text>
                  <text x="200" y="136" textAnchor="middle" fill="#7f1d1d" fontSize="4" fontFamily="monospace">R:87%</text>
                  <motion.path d="M 200 130 L 200 118" stroke="rgba(239,68,68,0.4)" strokeWidth="1" fill="none"
                    animate={{ pathLength: [0, 1] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }} />
                  <motion.path d={'M 200 130 Q 240 120 280 140'} stroke="rgba(249,115,22,0.3)" strokeWidth="1" fill="none" strokeDasharray="3 3"
                    animate={{ pathLength: [0, 1] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5, ease: 'linear' }} />
                  <motion.path d={'M 200 130 Q 260 180 310 240'} stroke="rgba(249,115,22,0.25)" strokeWidth="1" fill="none" strokeDasharray="3 3"
                    animate={{ pathLength: [0, 1] }} transition={{ duration: 2.5, repeat: Infinity, delay: 1, ease: 'linear' }} />
                  <motion.path d={'M 200 130 Q 140 160 60 200'} stroke="rgba(234,179,8,0.2)" strokeWidth="1" fill="none" strokeDasharray="3 3"
                    animate={{ pathLength: [0, 1] }} transition={{ duration: 3, repeat: Infinity, delay: 1.5, ease: 'linear' }} />
                  <text x="360" y="340" textAnchor="middle" fill="rgba(234,179,8,0.3)" fontSize="4.5" fontFamily="monospace">Zone 3</text>
                  <text x="340" y="80" textAnchor="middle" fill="rgba(249,115,22,0.3)" fontSize="4.5" fontFamily="monospace">Zone 2</text>
                  <text x="200" y="60" textAnchor="middle" fill="rgba(239,68,68,0.3)" fontSize="4.5" fontFamily="monospace">Zone 1</text>
                </svg>
              </div>
              <div className="space-y-2">
                <div className="rounded-lg border border-red-500/20 bg-red-500/[0.04] p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-[10px] font-mono text-white font-semibold">Zone 1 - Critical Impact</span>
                    <StatusBadge status="critical" label="IMMEDIATE" />
                  </div>
                  <div className="text-[9px] text-slate-400">Payment Service - Risk: 87% - Files: 12 - Status: Degraded</div>
                </div>
                <div className="rounded-lg border border-orange-500/20 bg-orange-500/[0.04] p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="h-2 w-2 rounded-full bg-orange-500" />
                    <span className="text-[10px] font-mono text-white font-semibold">Zone 2 - Medium Impact</span>
                    <StatusBadge status="warning" label="AT RISK" />
                  </div>
                  <div className="text-[9px] text-slate-400">Billing Service - Risk: 65% - Files: 8</div>
                  <div className="text-[9px] text-slate-400">API Gateway - Risk: 72% - Files: 5 - Status: Degraded</div>
                </div>
                <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/[0.04] p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="h-2 w-2 rounded-full bg-yellow-500" />
                    <span className="text-[10px] font-mono text-white font-semibold">Zone 3 - Low Impact</span>
                    <StatusBadge status="info" label="STABLE" />
                  </div>
                  <div className="text-[9px] text-slate-400">Notification Service - Risk: 45% - Files: 3</div>
                </div>
                <div className="rounded-lg border border-cyan-500/15 bg-cyan-500/[0.03] p-2.5 text-[9px] text-slate-500 leading-relaxed">
                  <span className="text-cyan-400 font-mono text-[9px] block mb-1">Risk Propagation Path</span>
                  <span className="text-red-400">Payment Service 87%</span> <span className="text-slate-600">{'->'}</span> <span className="text-orange-400">Billing Service 65%</span> <span className="text-slate-600">{'->'}</span> <span className="text-yellow-400">Notification Service 45%</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ===== PREMIUM SECTION 5: CINEMATIC AI REASONING TIMELINE ===== */}
        <motion.div variants={item} className="relative overflow-hidden rounded-2xl border border-white/[0.08]">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950" />
          <div className="absolute -top-20 -left-20 w-60 h-60 bg-cyan-500/[0.04] rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-purple-500/[0.03] rounded-full blur-[80px] pointer-events-none" />
          <div className="relative p-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20">
                <svg className="h-3.5 w-3.5 text-cyan-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-sm font-bold text-white tracking-wider">Cinematic AI Reasoning Timeline</h3>
              <span className="text-[10px] text-slate-600 font-mono">{data.investigationTimeline.length} phases</span>
            </div>
            <div className="overflow-x-auto pb-2 -mx-1 px-1">
              <div className="flex gap-3 min-w-max relative">
                {(() => {
                  const timelineIcons = {
                    Detection: <svg key="det" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>,
                    Analysis: <svg key="ana" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>,
                    Escalation: <svg key="esc" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>,
                    Resolution: <svg key="res" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
                    Review: <svg key="rev" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>,
                    Closed: <svg key="clo" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>,
                  }
                  const dotColors = {
                    Detection: 'bg-blue-500 border-blue-500/30',
                    Analysis: 'bg-cyan-500 border-cyan-500/30',
                    Escalation: 'bg-orange-500 border-orange-500/30',
                    Resolution: 'bg-green-500 border-green-500/30',
                    Review: 'bg-purple-500 border-purple-500/30',
                    Closed: 'bg-slate-500 border-slate-500/30',
                  }
                  const badgeColors = {
                    Detection: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
                    Analysis: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
                    Escalation: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
                    Resolution: 'bg-green-500/10 text-green-400 border-green-500/20',
                    Review: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
                    Closed: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
                  }
                  return data.investigationTimeline.map((phase, i) => {
                    const icon = timelineIcons[phase.type] || null
                    const dotColor = dotColors[phase.type] || 'bg-slate-500 border-slate-500/30'
                    const bdgColor = badgeColors[phase.type] || 'bg-slate-500/10 text-slate-400'
                    return (
                      <motion.div key={i} className="relative flex flex-col items-center w-[180px] shrink-0"
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.12, type: 'spring', stiffness: 80 }}>
                        {i < data.investigationTimeline.length - 1 && (
                          <svg className="absolute top-[7px] left-[90px] w-[180px] h-px pointer-events-none" style={{ zIndex: 0 }}>
                            <line x1="0" y1="0" x2="180" y2="0" stroke="rgba(6,182,212,0.15)" strokeWidth="1" strokeDasharray="4 4" />
                          </svg>
                        )}
                        <motion.div className={'relative z-10 mb-2 h-4 w-4 rounded-full border-2 ' + dotColor + ' shadow-[0_0_12px_rgba(6,182,212,0.15)]'}
                          animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }} />
                        <div className="relative glass-card p-3 rounded-xl border border-white/[0.06] hover:border-cyan-500/25 transition-all w-full backdrop-blur-md bg-white/[0.03]">
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <span className="text-slate-400 shrink-0">{icon}</span>
                            <span className={'rounded-md px-1.5 py-0.5 text-[7px] font-bold ' + bdgColor}>{phase.type}</span>
                          </div>
                          <h4 className="text-[8px] font-bold text-white uppercase tracking-wider mb-1">{phase.title}</h4>
                          <p className="text-[7px] text-slate-500 leading-tight mb-1.5 line-clamp-2">{phase.description}</p>
                          <div className="flex items-center justify-between text-[6px] text-slate-600 font-mono">
                            <span className="flex items-center gap-0.5">
                              <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                              </svg>
                              {phase.team}
                            </span>
                            <span className="bg-white/[0.04] px-1 py-0.5 rounded">{phase.duration}</span>
                          </div>
                        </div>
                        <span className="mt-1.5 text-[7px] text-slate-700 font-mono">{phase.date}</span>
                      </motion.div>
                    )
                  })
                })()}
              </div>
            </div>
          </div>
        </motion.div>


        <ExecutiveBanner currentPage="/intelligence" />

        {/* ===== SECTION 1: CASE COMMAND HEADER (COMPACT) ===== */}
        <motion.div variants={item} className="glass-card">
          <div className="p-2">
            <div className="flex items-start justify-between flex-wrap gap-1 mb-1.5">
              <div className="flex items-center gap-1.5">
                <div className="flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-cyan-500/20 to-blue-500/20">
                  <svg className="h-3 w-3 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                </div>
                <div>
                  <h1 className="font-mono text-xs font-bold tracking-widest text-white uppercase">Forensic Investigation Console</h1>
                  <p className="text-[7px] text-slate-500 font-mono tracking-wide">AI-Powered Risk Intelligence & Root Cause Analysis Platform</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <button onClick={copyId} className="group flex items-center gap-1 font-mono text-[8px] text-slate-500 border border-white/[0.08] rounded-md px-1.5 py-0.5 tracking-wider hover:border-cyan-500/30 hover:text-cyan-400 transition-all">
                  {copied ? 'Copied!' : data.caseId}
                  <svg className="h-2 w-2 text-slate-600 group-hover:text-cyan-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 8.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v8.25A2.25 2.25 0 006 16.5h2.25m8.25-8.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-7.5A2.25 2.25 0 018.25 18v-1.5m8.25-8.25h-3a4.5 4.5 0 01-4.5-4.5v-3" />
                  </svg>
                </button>
                <span className="flex items-center gap-1 text-[8px] text-green-400 font-mono tracking-wider border border-green-500/20 rounded-md px-1.5 py-0.5">
                  <span className="h-1 w-1 rounded-full bg-green-400 animate-pulse shadow-[0_0_6px_rgba(74,222,128,0.5)]" />
                  {data.status}
                </span>
                <span className="text-[8px] text-slate-600 font-mono border border-white/[0.06] rounded-md px-1.5 py-0.5">
                  Updated {timeAgo}
                </span>
              </div>
            </div>
            <h2 className="text-[10px] text-slate-300 font-mono mb-1.5 leading-relaxed">{data.title}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mb-1.5">
              <div className="glass-card p-1.5 text-center">
                <div className="text-base font-bold text-cyan-400"><AnimatedCounter value={data.totalFailures} /></div>
                <div className="text-[7px] text-slate-500 font-mono tracking-wide">Total Failures</div>
                <div className="flex justify-center gap-1 text-[6px] text-slate-600">
                  <span className="text-red-400">{data.criticalFailures}C</span>
                  <span className="text-orange-400">{data.highFailures}H</span>
                  <span className="text-yellow-400">{data.mediumFailures}M</span>
                  <span className="text-green-400">{data.lowFailures}L</span>
                </div>
              </div>
              <div className="glass-card p-1.5 text-center">
                <div className="text-base font-bold text-red-400"><AnimatedCounter value={data.criticalFailures} /></div>
                <div className="text-[7px] text-slate-500 font-mono tracking-wide">Critical Threats</div>
              </div>
              <div className="glass-card p-1.5 text-center">
                <div className="text-base font-bold text-blue-400"><AnimatedCounter value={data.mrsAnalyzed} /></div>
                <div className="text-[7px] text-slate-500 font-mono tracking-wide">MRs Analyzed</div>
              </div>
              <div className="glass-card p-1.5 text-center">
                <div className="text-base font-bold text-green-400"><AnimatedCounter value={data.incidentsPrevented} /></div>
                <div className="text-[7px] text-slate-500 font-mono tracking-wide">Incidents Prevented</div>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap pt-1.5 border-t border-transparent">
              <RiskGauge score={data.riskScore} />
              <div className="w-28">
                <ConfidenceMeter confidence={data.confidence} label="CONFIDENCE" />
              </div>
              <div className="flex flex-col border-l border-white/[0.04] pl-2">
                <span className="text-[7px] text-slate-600 font-mono uppercase tracking-wider">Impact Score</span>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-bold text-amber-400 font-mono">{data.impactScore}</span>
                  <span className="text-[6px] text-amber-400/60 font-mono">/100</span>
                </div>
              </div>
              <StatusBadge status="critical" label="HIGH RISK" />
            </div>
            <div className="flex flex-wrap gap-1.5 mt-1.5 pt-1.5 border-t border-transparent">
              {(data.affectedSystems || []).map((sys, i) => (
                <div key={i} className={'inline-flex items-center gap-1 rounded-lg border px-1.5 py-0.5 text-[8px] ' + (sys?.impact === 'Critical' ? 'border-red-500/20 bg-red-500/[0.05]' : sys?.impact === 'High' ? 'border-orange-500/20 bg-orange-500/[0.04]' : 'border-yellow-500/15 bg-yellow-500/[0.03]')}>
                  <span className={'h-1 w-1 rounded-full ' + (sys?.impact === 'Critical' ? 'bg-red-500 animate-pulse' : sys?.impact === 'High' ? 'bg-orange-500' : 'bg-yellow-500')} />
                  <span className="text-slate-300 font-mono">{sys?.name}</span>
                  <span className={'font-mono font-semibold ' + (sys?.impact === 'Critical' ? 'text-red-400' : sys?.impact === 'High' ? 'text-orange-400' : 'text-yellow-400')}>{sys?.impact}</span>
                  <span className="text-slate-600">|</span>
                  <span className="text-slate-600 font-mono">{sys?.rps} RPS</span>
                  <span className="text-slate-600">|</span>
                  <span className="text-slate-500">{sys?.status}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ===== ROOT CAUSE RADAR — HERO VISUALIZATION ===== */}
        <motion.div variants={item} className="glass-card relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.02] via-transparent to-purple-500/[0.02] pointer-events-none" />
          <div className="relative p-3">
            <div className="flex items-center gap-1.5 mb-3">
              <div className="flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-cyan-500/20 to-blue-500/20">
                <svg className="h-3 w-3 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-white">Root Cause Radar</h3>
              <span className="text-[10px] text-slate-600 font-mono">real-time forensic scan</span>
              <StatusBadge status="critical" label="ACTIVE SCAN" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-center">
              <div className="lg:col-span-3 flex justify-center">
                <div className="relative w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] md:w-[380px] md:h-[380px]">
                  <div className="absolute inset-0 animate-radar-sweep">
                    <div className="absolute top-1/2 left-1/2 w-1/2 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-cyan-300 origin-left blur-[3px]" />
                  </div>
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r="95" fill="none" stroke="rgba(6,182,212,0.06)" strokeWidth="0.5" />
                    <circle cx="100" cy="100" r="78" fill="none" stroke="rgba(6,182,212,0.10)" strokeWidth="0.5" strokeDasharray="4 3" />
                    <circle cx="100" cy="100" r="60" fill="none" stroke="rgba(6,182,212,0.14)" strokeWidth="0.5" />
                    <circle cx="100" cy="100" r="40" fill="none" stroke="rgba(6,182,212,0.18)" strokeWidth="0.5" strokeDasharray="2 4" />
                    <circle cx="100" cy="100" r="20" fill="none" stroke="rgba(168,85,247,0.25)" strokeWidth="1" />
                    <circle cx="100" cy="100" r="95" fill="none" stroke="rgba(6,182,212,0.04)" strokeWidth="8" strokeDasharray="1 15" />
                    <circle cx="100" cy="100" r="78" fill="none" stroke="rgba(6,182,212,0.04)" strokeWidth="6" strokeDasharray="1 12" />
                    <circle cx="100" cy="100" r="60" fill="none" stroke="rgba(6,182,212,0.04)" strokeWidth="4" strokeDasharray="1 10" />
                    <circle cx="100" cy="100" r="40" fill="none" stroke="rgba(168,85,247,0.04)" strokeWidth="3" strokeDasharray="1 8" />
                    <circle cx="100" cy="100" r="95" fill="none" stroke="rgba(6,182,212,0.15)" strokeWidth="1" strokeDasharray="120 200" strokeDashoffset="40" className="animate-[spin_8s_linear_infinite]" />
                    <circle cx="100" cy="100" r="60" fill="none" stroke="rgba(168,85,247,0.15)" strokeWidth="1" strokeDasharray="80 200" strokeDashoffset="120" className="animate-[spin_12s_linear_infinite]" />
                    <circle className="animate-pulse" cx="160" cy="60" r="5" fill="rgba(239,68,68,0.4)" stroke="rgb(239,68,68)" strokeWidth="1.5" />
                    <circle className="animate-pulse" cx="50" cy="140" r="4" fill="rgba(249,115,22,0.4)" stroke="rgb(249,115,22)" strokeWidth="1.5" style={{ animationDelay: '0.5s' }} />
                    <circle className="animate-pulse" cx="140" cy="160" r="3.5" fill="rgba(234,179,8,0.4)" stroke="rgb(234,179,8)" strokeWidth="1.5" style={{ animationDelay: '1s' }} />
                    <circle className="animate-pulse" cx="40" cy="50" r="3" fill="rgba(6,182,212,0.4)" stroke="rgb(6,182,212)" strokeWidth="1.5" style={{ animationDelay: '0.8s' }} />
                    <circle className="animate-pulse" cx="170" cy="130" r="4.5" fill="rgba(168,85,247,0.4)" stroke="rgb(168,85,247)" strokeWidth="1.5" style={{ animationDelay: '0.3s' }} />
                    <circle className="animate-pulse" cx="80" cy="175" r="3" fill="rgba(34,197,94,0.4)" stroke="rgb(34,197,94)" strokeWidth="1.5" style={{ animationDelay: '1.5s' }} />
                    {[0, 60, 120, 180, 240, 300].map((angle) => {
                      const rad = angle * Math.PI / 180
                      const r = 85
                      return <line key={angle} x1="100" y1="100" x2={100 + r * Math.cos(rad)} y2={100 + r * Math.sin(rad)} stroke="rgba(6,182,212,0.04)" strokeWidth="0.5" />
                    })}
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-[11px] tracking-[0.25em] text-cyan-400 font-mono mb-1 animate-pulse">ROOT CAUSE IDENTIFIED</div>
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-5xl sm:text-6xl font-bold text-white tracking-tight">{data.confidence}</span>
                        <span className="text-xl text-cyan-400 font-bold font-mono">%</span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono tracking-[0.15em] mt-0.5">AI FORENSIC CONFIDENCE</div>
                      <div className="mt-2 flex items-center justify-center gap-2 text-[8px] text-slate-600 font-mono">
                        <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-red-500" />3 chains</span>
                        <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />6 services</span>
                        <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-green-500" />94% acc.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-2 space-y-2">
                {(data.rootCauseChains || []).map((chain, ci) => {
                  const colors = ['border-l-red-500/50', 'border-l-orange-500/50', 'border-l-amber-500/50']
                  const scoreColors = ['text-red-400', 'text-orange-400', 'text-amber-400']
                  return (
                    <div key={ci} className={'border-l-2 ' + colors[ci] + ' pl-3 hover:border-l-cyan-400/60 transition-all group'}>
                      <div className="flex items-center justify-between mb-0.5">
                        <h4 className="text-[11px] font-semibold text-slate-200 group-hover:text-white transition-colors">{chain.title}</h4>
                        <span className={'text-[13px] font-bold font-mono ' + scoreColors[ci]}>{Math.round(chain.confidences.reduce((a, b) => a + b, 0) / chain.confidences.length)}%</span>
                      </div>
                      <div className="flex items-center gap-1 text-[8px] text-slate-600 font-mono">
                        <span>{chain.chain.length} causal steps</span>
                        <span className="text-slate-700">·</span>
                        <span>{chain.evidence.reduce((a, b) => a + b, 0)} evidence items</span>
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        {chain.chain.map((_, ni) => (
                          <div key={ni} className={'h-1 flex-1 rounded-full ' + (chain.confidences[ni] >= 90 ? 'bg-green-500/50' : chain.confidences[ni] >= 80 ? 'bg-yellow-500/40' : 'bg-orange-500/30')} />
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </motion.div>



        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="glass-card p-3 animate-pulse"><div className="h-2.5 w-24 bg-slate-800 rounded mb-2" /><div className="h-6 w-14 bg-slate-800 rounded mb-1.5" /><div className="h-1.5 w-32 bg-slate-800 rounded" /></div>
              ))}
            </div>
            <div className="grid gap-1.5 sm:grid-cols-2">
              <div className="glass-card p-3 animate-pulse"><div className="h-3 w-36 bg-slate-800 rounded mb-3" /><div className="h-36 bg-slate-800 rounded" /></div>
              <div className="glass-card p-3 animate-pulse"><div className="h-3 w-36 bg-slate-800 rounded mb-3" /><div className="h-36 bg-slate-800 rounded" /></div>
            </div>
            <div className="glass-card p-3 animate-pulse"><div className="h-3 w-44 bg-slate-800 rounded mb-3" />{Array.from({ length: 5 }).map((_, j) => (<div key={j} className="h-10 bg-slate-800 rounded mb-1.5" />))}</div>
          </motion.div>
        )}

        {!loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">

            {/* ===== SECTION 2: EXECUTIVE BRIEFING ===== */}
            <motion.div variants={item} className="glass-card p-2">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-[8px] text-slate-700 font-mono">Analysis completed at 2024-06-01T14:23:00Z . Engine: OV-Forensic-v2.4 . Data sources: GitLab, PagerDuty, Datadog, K8s</span>
              </div>
              <div className="flex items-center gap-1.5 mb-3">
                <div className="flex h-4 w-4 items-center justify-center rounded-md bg-gradient-to-br from-cyan-500/20 to-blue-500/20">
                  <svg className="h-2.5 w-2.5 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
                  </svg>
                </div>
                <h3 className="text-xs font-semibold text-white">Executive Briefing</h3>
                <StatusBadge status="info" label="Live Analysis" />
              </div>
              <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2 mb-2">
                <span className="text-[8px] text-slate-600 font-mono tracking-wider uppercase block mb-1">Executive Summary</span>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Forensic analysis of the Payment Pipeline failure identified a critical circuit breaker gap in the payment worker retry loop, which caused a cascading system failure affecting 4 services. The investigation analyzed 847 MRs across the platform, correlating 5 historical incidents with 94% confidence. Three distinct root cause chains were identified - circuit breaker cascade (primary, 92% confidence), memory exhaustion (secondary, 91% confidence), and idempotency gap (tertiary, 88% confidence). Immediate remediation of the circuit breaker configuration is recommended to prevent recurrence of the P0 outage that blocked all payment flows for 45 minutes. Estimated business impact: $202K revenue at risk, 15K affected users, and $12K SLA exposure.
                </p>
              </div>
              <div className="grid gap-2 sm:grid-cols-3 mb-2">
                {(data.keyFindingsData || []).map((kf, i) => (
                  <motion.div key={kf.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                    className={'rounded-lg border p-2 ' + (kf.severity === 'critical' ? 'border-red-500/20 bg-red-500/[0.03]' : 'border-orange-500/20 bg-orange-500/[0.02]')}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[8px] text-slate-600">{kf.id}</span>
                      <StatusBadge status={kf?.severity} label={kf?.severity} />
                    </div>
                    <h4 className="text-[10px] font-semibold text-slate-200 mb-0.5">{kf.title}</h4>
                    <p className="text-[9px] text-slate-500 leading-relaxed">{kf.description}</p>
                  </motion.div>
                ))}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-1.5">
                <div className="glass-card p-3 text-center relative overflow-hidden group hover:border-orange-500/30 transition-all">
                  <div className="absolute inset-0 bg-gradient-to-b from-orange-500/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  <div className="relative">
                    <div className="text-[28px] sm:text-[32px] font-bold text-orange-400 font-mono tracking-tight">{data.riskScore}<span className="text-lg text-orange-500/60">%</span></div>
                    <div className="text-[9px] text-slate-500 font-mono tracking-wider uppercase mt-0.5">Risk Score</div>
                    <div className="text-[8px] text-slate-700 font-mono mt-0.5">Elevated · 87 threshold</div>
                  </div>
                </div>
                <div className="glass-card p-3 text-center relative overflow-hidden group hover:border-cyan-500/30 transition-all">
                  <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  <div className="relative">
                    <div className="text-[28px] sm:text-[32px] font-bold text-cyan-400 font-mono tracking-tight">{data.confidence}<span className="text-lg text-cyan-500/60">%</span></div>
                    <div className="text-[9px] text-slate-500 font-mono tracking-wider uppercase mt-0.5">Confidence</div>
                    <div className="text-[8px] text-slate-700 font-mono mt-0.5">AI certainty · forensic match</div>
                  </div>
                </div>
                <div className="glass-card p-3 text-center relative overflow-hidden group hover:border-red-500/30 transition-all">
                  <div className="absolute inset-0 bg-gradient-to-b from-red-500/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  <div className="relative">
                    <div className="text-[28px] sm:text-[32px] font-bold text-red-400 font-mono tracking-tight">$202<span className="text-lg text-red-500/60">K</span></div>
                    <div className="text-[9px] text-slate-500 font-mono tracking-wider uppercase mt-0.5">Revenue at Risk</div>
                    <div className="text-[8px] text-slate-700 font-mono mt-0.5">15K users · $12K SLA exposure</div>
                  </div>
                </div>
                <div className="glass-card p-3 text-center relative overflow-hidden group hover:border-rose-500/30 transition-all">
                  <div className="absolute inset-0 bg-gradient-to-b from-rose-500/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  <div className="relative">
                    <div className="text-[28px] sm:text-[32px] font-bold text-rose-400 font-mono tracking-tight animate-pulse">P0</div>
                    <div className="text-[9px] text-slate-500 font-mono tracking-wider uppercase mt-0.5">Urgency</div>
                    <div className="text-[8px] text-slate-700 font-mono mt-0.5">Act within 24h · critical severity</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ===== SECTION 3: ROOT CAUSE FORENSICS ===== */}
            <motion.div variants={item} className="glass-card p-2">
              <div className="flex items-center gap-1.5 mb-3">
                <div className="flex h-4 w-4 items-center justify-center rounded-md bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                  <svg className="h-2.5 w-2.5 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                </div>
                <h3 className="text-xs font-semibold text-white">Root Cause Forensics</h3>
                <span className="text-[9px] text-slate-600 font-mono">3 causal chains identified</span>
              </div>
              <div className="grid gap-3 lg:grid-cols-3">
                {(data.rootCauseChains || []).map((chain, ci) => (
                  <div key={ci} className="relative">
                    <h4 className="text-[9px] text-slate-500 font-mono tracking-wider mb-2 uppercase">{chain.title}</h4>
                    <div className="relative flex flex-col items-center">
                      <svg className="absolute top-0 left-1/2 w-full h-full -translate-x-1/2 pointer-events-none" style={{ zIndex: 0 }}>
                        <line x1="50%" y1="0" x2="50%" y2="100%" stroke="rgba(6,182,212,0.1)" strokeWidth="1" strokeDasharray="3 3" />
                      </svg>
                      {(chain.chain || []).map((cause, ni) => (
                        <div key={ni} className="relative z-10 w-full flex flex-col items-center">
                          {ni > 0 && (
                            <div className="flex flex-col items-center my-0.5">
                              <svg width="12" height="12" viewBox="0 0 12 12" className="text-cyan-500/30"><path d="M6 9L2 3h8z" fill="currentColor" /></svg>
                            </div>
                          )}
                          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: ni * 0.15 + ci * 0.1 }}
                            className={'w-full rounded-lg border p-2 transition-all hover:border-cyan-500/30 cursor-pointer ' + (ni === 0 ? 'border-orange-500/20 bg-orange-500/[0.03]' : ni === 1 ? 'border-yellow-500/20 bg-yellow-500/[0.02]' : 'border-red-500/20 bg-red-500/[0.03]')}
                            onClick={() => setExpandedChain(expandedChain === ci + '-' + ni ? null : ci + '-' + ni)}>
                            <div className="flex items-start justify-between gap-1">
                              <p className={'text-[9px] font-medium ' + (ni === 2 ? 'text-red-300' : 'text-slate-300')}>{cause}</p>
                              <span className="shrink-0 rounded bg-white/[0.04] px-1 py-0.5 text-[7px] font-mono text-slate-500">E:{chain.evidence[ni]}</span>
                            </div>
                            <div className="flex items-center gap-1.5 mt-1">
                              <div className="flex-1 h-1 rounded-full bg-white/[0.06] overflow-hidden">
                                <div className={'h-full rounded-full ' + (chain.confidences[ni] >= 90 ? 'bg-green-500' : chain.confidences[ni] >= 80 ? 'bg-yellow-500' : 'bg-orange-500')} style={{ width: chain.confidences[ni] + '%' }} />
                              </div>
                              <span className="text-[7px] font-mono text-slate-600">{chain.confidences[ni]}%</span>
                            </div>
                          </motion.div>
                          <AnimatePresence>
                            {expandedChain === ci + '-' + ni && (
                              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="w-full overflow-hidden">
                                <div className="mt-1.5 rounded-lg border border-white/[0.04] bg-white/[0.01] p-2 text-[8px] text-slate-500 leading-relaxed">
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


            {/* ===== NEW: CORRELATION MATRIX ===== */}
            <motion.div variants={item} className="glass-card p-2">
              <div className="flex items-center gap-1.5 mb-2">
                <div className="flex h-4 w-4 items-center justify-center rounded-md bg-gradient-to-br from-purple-500/20 to-indigo-500/20">
                  <svg className="h-2.5 w-2.5 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                  </svg>
                </div>
                <h3 className="text-[10px] font-semibold text-white">Correlation Matrix</h3>
                <span className="text-[8px] text-slate-600 font-mono">incident correlations</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {(data.correlations || []).map((corr, i) => {
                  const scoreColor = corr?.score >= 85 ? 'bg-red-500' : corr?.score >= 70 ? 'bg-orange-500' : 'bg-yellow-500'
                  const scoreTextColor = corr?.score >= 85 ? 'text-red-400' : corr?.score >= 70 ? 'text-orange-400' : 'text-yellow-400'
                  return (
                    <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                      className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-1.5 hover:border-cyan-500/20 transition-all">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-[9px] font-semibold text-slate-200">{corr?.incident}</h4>
                        <span className={'text-sm font-bold font-mono ' + scoreTextColor}>{corr?.score}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden mb-1">
                        <div className={'h-full rounded-full ' + scoreColor} style={{ width: (corr?.score || 0) + '%' }} />
                      </div>
                      <div className="text-[7px] text-slate-500">
                        <span className="text-slate-600">Cause: </span>{corr?.commonCause}
                      </div>
                      <div className="text-[7px] text-slate-500">
                        <span className="text-slate-600">Services: </span>{(corr?.services || []).join(', ')}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>

            {/* ===== AI REASONING TIMELINE — PREMIUM VERTICAL ===== */}
            <motion.div variants={item} className="glass-card p-3 relative overflow-hidden">
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-cyan-500/[0.03] rounded-full blur-[60px] pointer-events-none" />
              <div className="relative">
                <div className="flex items-center gap-1.5 mb-4">
                  <div className="flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-cyan-500/20 to-blue-500/20">
                    <svg className="h-3 w-3 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-white">AI Reasoning Timeline</h3>
                  <span className="text-[10px] text-slate-600 font-mono">{data.investigationTimeline.length} phases · 4.5 hrs total</span>
                </div>
                <div className="relative">
                  <div className="absolute left-[19px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-blue-500/30 via-cyan-500/20 via-purple-500/20 via-green-500/20 via-amber-500/15 to-slate-500/10" />
                  {(data.investigationTimeline || []).map((phase, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                      className="relative flex items-start gap-4 pb-4 group last:pb-0">
                      <div className={'relative z-10 mt-0.5 h-4 w-4 shrink-0 rounded-full border-[3px] ' + (timelineDotColors[phase?.type] || 'bg-slate-500 border-slate-500/30') + ' transition-all group-hover:scale-125 shadow-[0_0_12px_rgba(6,182,212,0.15)]'}>
                        <div className="absolute inset-0.5 rounded-full bg-current opacity-30 animate-pulse" />
                      </div>
                      <div className="flex-1 min-w-0 glass-card p-3 group-hover:border-cyan-500/25 transition-all">
                        <div className="flex items-center justify-between flex-wrap gap-1 mb-1">
                          <div className="flex items-center gap-2">
                            <span className={'rounded-md px-2 py-0.5 text-[9px] font-bold ' + (timelineBadgeColors[phase?.type] || 'bg-slate-500/10 text-slate-400')}>{phase?.type}</span>
                            <span className="text-[9px] font-mono text-slate-600">{phase?.date}</span>
                          </div>
                          <span className="text-[8px] text-slate-600 font-mono bg-white/[0.03] px-1.5 py-0.5 rounded">{phase?.duration}</span>
                        </div>
                        <h4 className="text-xs font-semibold text-slate-200 mb-0.5">{phase?.title}</h4>
                        <p className="text-[10px] text-slate-500 leading-relaxed">{phase?.description}</p>
                        <div className="flex items-center gap-1.5 mt-1.5 text-[8px] text-slate-600 font-mono">
                          <svg className="h-3 w-3 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                          </svg>
                          {phase?.team}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* ===== NEW: EVIDENCE TIMELINE ===== */}
            <motion.div variants={item} className="glass-card p-2">
              <div className="flex items-center gap-1.5 mb-2">
                <div className="flex h-4 w-4 items-center justify-center rounded-md bg-gradient-to-br from-amber-500/20 to-yellow-500/20">
                  <svg className="h-2.5 w-2.5 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                  </svg>
                </div>
                <h3 className="text-[10px] font-semibold text-white">Evidence Timeline</h3>
                <span className="text-[8px] text-slate-600 font-mono">chronological evidence</span>
              </div>
              <div className="space-y-0.5">
                {(data.evidenceTimeline || []).map((ev, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                    className="flex items-center gap-2 rounded border border-white/[0.04] bg-white/[0.01] p-1 text-[8px]">
                    <span className="text-[7px] text-slate-600 font-mono shrink-0 w-20">{ev?.date}</span>
                    <span className="rounded bg-white/[0.03] px-1 py-0.5 text-[6px] text-slate-500 font-mono shrink-0">{ev?.type}</span>
                    <span className="flex-1 text-slate-400 truncate">{ev?.description}</span>
                    <span className="text-[7px] text-slate-600 font-mono shrink-0 hidden sm:inline">{ev?.source}</span>
                    <div className="flex items-center gap-1 shrink-0 w-16">
                      <div className="flex-1 h-1 rounded-full bg-white/[0.06] overflow-hidden">
                        <div className={'h-full rounded-full ' + ((ev?.relevance || 0) >= 85 ? 'bg-red-500' : (ev?.relevance || 0) >= 75 ? 'bg-yellow-500' : 'bg-slate-500')} style={{ width: (ev?.relevance || 0) + '%' }} />
                      </div>
                      <span className="text-[6px] font-mono text-slate-600">{ev?.relevance}%</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* ===== SECTION 4: RISK PROPAGATION ENGINE ===== */}
            <motion.div variants={item} className="glass-card p-2">
              <div className="flex items-center gap-1.5 mb-2">
                <div className="flex h-4 w-4 items-center justify-center rounded-md bg-gradient-to-br from-red-500/20 to-orange-500/20">
                  <svg className="h-2.5 w-2.5 text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
                  </svg>
                </div>
                <h3 className="text-[10px] font-semibold text-white">Risk Propagation Engine</h3>
                <span className="text-[8px] text-slate-600 font-mono">{(data.propagation || []).length} propagation paths</span>
              </div>
              <div className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
                {(data.propagation || []).map((p, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                    className="relative rounded-lg border border-white/[0.06] bg-white/[0.02] p-2 hover:border-cyan-500/20 transition-all group">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                        <span className="text-[9px] font-mono text-slate-300 font-medium">{p?.from}</span>
                      </div>
                      <svg className="h-3 w-3 text-cyan-500/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                      <div className="flex items-center gap-1">
                        <span className="text-[9px] font-mono text-slate-300 font-medium">{p?.to}</span>
                        <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                      </div>
                    </div>
                    <AnimatedBar value={p?.risk} color={p.risk >= 80 ? 'bg-red-500' : p.risk >= 60 ? 'bg-orange-500' : 'bg-yellow-500'} />
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="text-[7px] text-slate-700 font-mono">Propagation Likelihood</span>
                      <span className="text-[9px] font-mono text-red-400">{p?.risk}%</span>
                    </div>
                    <div className="mt-1.5 rounded bg-white/[0.02] p-1 text-[7px] text-slate-600 leading-relaxed">
                      {p?.from} failure {'->'} <span className="text-red-400">{p?.risk}%</span> likely to affect {p?.to}
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="mt-2 rounded-lg border border-cyan-500/10 bg-cyan-500/[0.03] p-2">
                <div className="flex items-center gap-1.5 text-[8px] text-cyan-400 font-mono mb-1">
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                  Escalation Route Chain
                </div>
                <div className="flex items-center gap-1 text-[8px] font-mono flex-wrap">
                  <span className="text-red-400 font-semibold">Payment</span>
                  <svg className="h-2.5 w-2.5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                  <span className="text-orange-400 font-semibold">Billing</span>
                  <span className="text-slate-600">(87%)</span>
                  <svg className="h-2.5 w-2.5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                  <span className="text-orange-300 font-semibold">Notification</span>
                  <span className="text-slate-600">(65%)</span>
                  <svg className="h-2.5 w-2.5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                  <span className="text-yellow-300 font-semibold">Webhook</span>
                  <span className="text-slate-600">(78%)</span>
                </div>
              </div>
            </motion.div>

            {/* ===== SECTION 5: BLAST RADIUS ANALYSIS ===== */}
            <motion.div variants={item} className="glass-card p-2">
              <div className="flex items-center gap-1.5 mb-3">
                <div className="flex h-4 w-4 items-center justify-center rounded-md bg-gradient-to-br from-orange-500/20 to-red-500/20">
                  <svg className="h-2.5 w-2.5 text-orange-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                </div>
                <h3 className="text-xs font-semibold text-white">Blast Radius Analysis</h3>
                <StatusBadge status="critical" label={data.blastRadius.totalServices + ' services affected'} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mb-2">
                {(data.blastRadius.zones || []).map((z, i) => (
                  <motion.div key={z?.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                    className={'rounded-lg border p-3 transition-all hover:border-cyan-500/30 ' + (z?.critical ? 'border-red-500/20 bg-red-500/[0.03]' : 'border-white/[0.06] bg-white/[0.02]')}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className={'h-2 w-2 rounded-full ' + (z?.radius === 1 ? 'bg-red-500 animate-pulse' : z?.radius === 2 ? 'bg-orange-500' : 'bg-cyan-500')} />
                        <span className="text-[10px] font-mono text-slate-200 font-semibold">{z?.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {z?.critical && <span className="rounded bg-red-500/15 px-1 py-0.5 text-[7px] font-bold text-red-400 border border-red-500/25">CRITICAL</span>}
                        <span className={'text-[10px] font-mono font-bold ' + (z.risk >= 80 ? 'text-red-400' : z.risk >= 60 ? 'text-orange-400' : 'text-cyan-400')}>R:{z?.risk}</span>
                      </div>
                    </div>
                    <div className="mb-1.5">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[7px] text-slate-600 font-mono">Risk Level</span>
                        <span className={'text-[8px] font-mono ' + (z.risk >= 80 ? 'text-red-400' : z.risk >= 60 ? 'text-orange-400' : 'text-cyan-400')}>{z?.risk}%</span>
                      </div>
                      <AnimatedBar value={z?.risk} color={z.risk >= 80 ? 'bg-red-500' : z.risk >= 60 ? 'bg-orange-500' : 'bg-cyan-500'} />
                    </div>
                    <div className="flex items-center justify-between text-[8px] text-slate-600">
                      <span className="font-mono">Files Changed: {z?.files}</span>
                      <span className="font-mono">Status: {z?.status}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="rounded-lg border border-amber-500/15 bg-amber-500/[0.03] p-2">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <svg className="h-3.5 w-3.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span className="text-[9px] text-amber-300 font-mono font-semibold">Revenue at Risk</span>
                  </div>
                  <span className="text-base font-bold text-amber-400 font-mono">$202K</span>
                </div>
                <div className="rounded-lg border border-amber-500/15 bg-amber-500/[0.03] p-2">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <svg className="h-3.5 w-3.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
                    <span className="text-[9px] text-amber-300 font-mono font-semibold">Customer Impact</span>
                  </div>
                  <span className="text-base font-bold text-amber-400 font-mono">15K users</span>
                </div>
                <div className="rounded-lg border border-amber-500/15 bg-amber-500/[0.03] p-2">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <svg className="h-3.5 w-3.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
                    <span className="text-[9px] text-amber-300 font-mono font-semibold">SLA Exposure</span>
                  </div>
                  <span className="text-base font-bold text-amber-400 font-mono">$12K</span>
                </div>
              </div>
            </motion.div>

            {/* ===== SECTION 6: DEPENDENCY INTELLIGENCE ===== */}
            <motion.div variants={item} className="glass-card p-2">
              <div className="flex items-center gap-1.5 mb-3">
                <div className="flex h-4 w-4 items-center justify-center rounded-md bg-gradient-to-br from-cyan-500/20 to-blue-500/20">
                  <svg className="h-2.5 w-2.5 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                  </svg>
                </div>
                <h3 className="text-xs font-semibold text-white">Dependency Intelligence</h3>
                <span className="text-[9px] text-slate-600 font-mono">4 services - 7 dependency edges</span>
              </div>
              <div className="grid gap-2 sm:grid-cols-2 mb-3">
                {(data.deps || []).map((dep, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    onMouseEnter={() => setHoveredDep(dep?.service)} onMouseLeave={() => setHoveredDep(null)}
                    className={'rounded-lg border p-2 transition-all ' + (dep?.critical ? 'border-red-500/20 bg-red-500/[0.03]' : 'border-white/[0.06] bg-white/[0.02]') + (hoveredDep === dep?.service ? ' border-cyan-500/40' : '')}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className={'h-1.5 w-1.5 rounded-full ' + (dep?.critical ? 'bg-red-500 animate-pulse' : 'bg-cyan-500')} />
                        <span className="text-[10px] font-mono text-slate-200 font-semibold">{dep?.service}</span>
                        {dep?.critical && <span className="rounded bg-red-500/15 px-1 py-0.5 text-[7px] font-bold text-red-400">CRITICAL</span>}
                      </div>
                      <span className={'text-[9px] font-mono font-bold ' + (dep.risk >= 80 ? 'text-red-400' : dep.risk >= 60 ? 'text-orange-400' : 'text-cyan-400')}>{dep?.risk}%</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {(dep.deps || []).map((d, di) => (
                        <span key={di} className="inline-flex items-center gap-0.5 rounded bg-white/[0.03] px-1.5 py-0.5 text-[7px] font-mono text-slate-500 border border-white/[0.04]">
                          <svg className="h-1.5 w-1.5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                          {d}
                        </span>
                      ))}
                    </div>
                    <div className="mt-1.5 pt-1.5 border-t border-transparent flex items-center justify-between text-[7px] text-slate-700 font-mono">
                      <span>Upstream: {(dep?.deps || []).length} dep{(dep?.deps || []).length > 1 ? 's' : ''}</span>
                      <span>Propagation Risk: {dep?.risk}%</span>
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
                  <pattern id="gridDep" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="0.5" /></pattern>
                  <rect width="700" height="350" fill="url(#gridDep)" />
                  <path d="M 105 80 C 105 140, 200 140, 200 200" fill="none" stroke="rgba(239,68,68,0.35)" strokeWidth="2" markerEnd="url(#arrowRed)" strokeDasharray="6 3" /><text x="120" y="130" fill="#ef4444" fontSize="7" fontFamily="monospace" opacity="0.7">depends-on</text>
                  <path d="M 105 80 C 105 140, 300 140, 300 200" fill="none" stroke="rgba(6,182,212,0.25)" strokeWidth="1.5" markerEnd="url(#arrowCyan)" /><text x="160" y="150" fill="#64748b" fontSize="7" fontFamily="monospace" opacity="0.6">route-to</text>
                  <path d="M 330 80 C 330 140, 440 140, 440 200" fill="none" stroke="rgba(6,182,212,0.25)" strokeWidth="1.5" markerEnd="url(#arrowCyan)" /><text x="370" y="150" fill="#64748b" fontSize="7" fontFamily="monospace" opacity="0.6">reads/writes</text>
                  <path d="M 330 80 C 330 140, 530 140, 530 200" fill="none" stroke="rgba(6,182,212,0.25)" strokeWidth="1.5" markerEnd="url(#arrowCyan)" /><text x="400" y="160" fill="#64748b" fontSize="7" fontFamily="monospace" opacity="0.6">auth-check</text>
                  <path d="M 540 80 C 540 140, 620 140, 620 200" fill="none" stroke="rgba(6,182,212,0.2)" strokeWidth="1" markerEnd="url(#arrowCyan)" /><text x="560" y="150" fill="#64748b" fontSize="7" fontFamily="monospace" opacity="0.6">event</text>
                  <path d="M 540 80 C 500 130, 380 130, 330 200" fill="none" stroke="rgba(6,182,212,0.2)" strokeWidth="1" markerEnd="url(#arrowCyan)" strokeDasharray="3 3" /><text x="460" y="130" fill="#64748b" fontSize="7" fontFamily="monospace" opacity="0.5">sync</text>
                  <path d="M 105 280 L 220 280" fill="none" stroke="rgba(6,182,212,0.2)" strokeWidth="1" markerEnd="url(#arrowCyan)" /><text x="130" y="275" fill="#64748b" fontSize="7" fontFamily="monospace" opacity="0.5">deliver</text>
                  <path d="M 330 200 L 330 280" fill="none" stroke="rgba(6,182,212,0.2)" strokeWidth="1" markerEnd="url(#arrowCyan)" /><text x="340" y="245" fill="#64748b" fontSize="7" fontFamily="monospace" opacity="0.5">cache</text>
                  <path d="M 540 200 L 540 280" fill="none" stroke="rgba(6,182,212,0.2)" strokeWidth="1" markerEnd="url(#arrowCyan)" /><text x="550" y="245" fill="#64748b" fontSize="7" fontFamily="monospace" opacity="0.5">verify</text>
                  <rect x="45" y="50" width="120" height="48" rx="8" fill="rgba(6,182,212,0.08)" stroke={hoveredDep === 'API Gateway' ? 'rgba(6,182,212,0.7)' : 'rgba(6,182,212,0.3)'} strokeWidth="1.5" className="transition-all cursor-pointer" onMouseEnter={() => setHoveredDep('API Gateway')} onMouseLeave={() => setHoveredDep(null)} />
                  <text x="105" y="73" textAnchor="middle" fill="#22d3ee" fontSize="10" fontWeight="600" fontFamily="monospace">API Gateway</text><text x="105" y="88" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace">Risk: 72</text>
                  <rect x="270" y="50" width="120" height="48" rx="8" fill="rgba(239,68,68,0.12)" stroke={hoveredDep === 'Payment Service' ? 'rgba(239,68,68,0.8)' : 'rgba(239,68,68,0.5)'} strokeWidth="2" filter="url(#glow)" className="transition-all cursor-pointer" onMouseEnter={() => setHoveredDep('Payment Service')} onMouseLeave={() => setHoveredDep(null)} />
                  <text x="330" y="73" textAnchor="middle" fill="#ef4444" fontSize="10" fontWeight="600" fontFamily="monospace">Payment Service</text><text x="330" y="88" textAnchor="middle" fill="#fca5a5" fontSize="8" fontFamily="monospace">Risk: 87</text>
                  <rect x="480" y="50" width="120" height="48" rx="8" fill="rgba(6,182,212,0.06)" stroke={hoveredDep === 'Billing Service' ? 'rgba(6,182,212,0.6)' : 'rgba(6,182,212,0.3)'} strokeWidth="1.5" className="transition-all cursor-pointer" onMouseEnter={() => setHoveredDep('Billing Service')} onMouseLeave={() => setHoveredDep(null)} />
                  <text x="540" y="73" textAnchor="middle" fill="#22d3ee" fontSize="10" fontWeight="600" fontFamily="monospace">Billing Service</text><text x="540" y="88" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace">Risk: 65</text>
                  <rect x="270" y="200" width="120" height="48" rx="8" fill="rgba(239,68,68,0.08)" stroke={hoveredDep === 'Database' ? 'rgba(239,68,68,0.6)' : 'rgba(239,68,68,0.4)'} strokeWidth="1.5" className="transition-all cursor-pointer" onMouseEnter={() => setHoveredDep('Database')} onMouseLeave={() => setHoveredDep(null)} />
                  <text x="330" y="223" textAnchor="middle" fill="#fca5a5" fontSize="10" fontWeight="600" fontFamily="monospace">Database</text><text x="330" y="238" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace">Risk: 55</text>
                  <rect x="480" y="200" width="120" height="48" rx="8" fill="rgba(6,182,212,0.04)" stroke={hoveredDep === 'Auth Service' ? 'rgba(6,182,212,0.5)' : 'rgba(6,182,212,0.2)'} strokeWidth="1" className="transition-all cursor-pointer" onMouseEnter={() => setHoveredDep('Auth Service')} onMouseLeave={() => setHoveredDep(null)} />
                  <text x="540" y="223" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="600" fontFamily="monospace">Auth Service</text><text x="540" y="238" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace">Risk: 38</text>
                  <rect x="45" y="250" width="120" height="40" rx="8" fill="rgba(6,182,212,0.04)" stroke={hoveredDep === 'Notification Service' ? 'rgba(6,182,212,0.5)' : 'rgba(6,182,212,0.2)'} strokeWidth="1" className="transition-all cursor-pointer" onMouseEnter={() => setHoveredDep('Notification Service')} onMouseLeave={() => setHoveredDep(null)} />
                  <text x="105" y="270" textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="600" fontFamily="monospace">Notification</text><text x="105" y="282" textAnchor="middle" fill="#64748b" fontSize="7" fontFamily="monospace">Risk: 45</text>
                  <rect x="230" y="250" width="100" height="40" rx="8" fill="rgba(6,182,212,0.03)" stroke="rgba(6,182,212,0.15)" strokeWidth="1" /><text x="280" y="270" textAnchor="middle" fill="#94a3b8" fontSize="8" fontWeight="600" fontFamily="monospace">Webhook GW</text><text x="280" y="282" textAnchor="middle" fill="#64748b" fontSize="7" fontFamily="monospace">Risk: 42</text>
                  <rect x="480" y="250" width="100" height="40" rx="8" fill="rgba(6,182,212,0.03)" stroke="rgba(6,182,212,0.15)" strokeWidth="1" /><text x="530" y="270" textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="600" fontFamily="monospace">Redis Cache</text><text x="530" y="282" textAnchor="middle" fill="#64748b" fontSize="7" fontFamily="monospace">Risk: 25</text>
                </svg>
              </div>
            </motion.div>

            {/* ===== SECTION 7: HISTORICAL INTELLIGENCE ===== */}
            <motion.div variants={item} className="glass-card p-2">
              <div className="flex items-center gap-1.5 mb-3">
                <div className="flex h-4 w-4 items-center justify-center rounded-md bg-gradient-to-br from-blue-500/20 to-indigo-500/20">
                  <svg className="h-2.5 w-2.5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xs font-semibold text-white">Historical Intelligence</h3>
                <span className="text-[9px] text-slate-600 font-mono">{data.mrs.length} correlated MRs</span>
              </div>
              <div className="space-y-1.5">
                {(data.mrs || []).map((mr, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                    className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2 hover:border-cyan-500/20 transition-all">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[9px] text-cyan-400 font-bold">{mr?.id}</span>
                        <span className="text-[9px] text-slate-600 font-mono">{mr?.author}</span>
                        <span className="text-[9px] text-slate-600">|</span>
                        <span className="text-[9px] text-slate-600">{mr?.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className={'rounded px-1 py-0.5 text-[7px] font-bold ' + (mr?.outcome === 'Incident' ? 'bg-red-500/15 text-red-400 border border-red-500/25' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20')}>{mr.outcome}</span>
                        <span className={'rounded px-1 py-0.5 text-[7px] font-bold ' + (riskBadgeColors[mr.risk] || 'bg-slate-500/10 text-slate-400')}>{mr?.risk?.toUpperCase()}</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-400 mb-1.5">{mr?.desc}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-[7px] text-slate-600 font-mono">Match Score</span>
                          <span className={'text-[8px] font-mono ' + (mr.match >= 85 ? 'text-green-400' : mr.match >= 70 ? 'text-yellow-400' : 'text-slate-500')}>{mr?.match}%</span>
                        </div>
                        <AnimatedBar value={mr?.match} color={mr.match >= 85 ? 'bg-green-500' : mr.match >= 70 ? 'bg-yellow-500' : 'bg-slate-500'} />
                      </div>
                      <span className="text-[7px] text-slate-700 font-mono whitespace-nowrap">{mr?.files} files changed</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>


            {/* ===== SECTION 8: SIMILAR INCIDENT DATABASE ===== */}
            <motion.div variants={item} className="glass-card p-2">
              <div className="flex items-center gap-1.5 mb-3">
                <div className="flex h-4 w-4 items-center justify-center rounded-md bg-gradient-to-br from-red-500/20 to-rose-500/20">
                  <svg className="h-2.5 w-2.5 text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                </div>
                <h3 className="text-xs font-semibold text-white">Similar Incident Database</h3>
                <span className="text-[9px] text-slate-600 font-mono">{data.similarIncidents.length} historical matches</span>
              </div>
              <div className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
                {(data.similarIncidents || []).map((inc, i) => (
                  <motion.div key={inc?.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2 hover:border-cyan-500/20 transition-all group">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[8px] text-cyan-400">{inc?.id}</span>
                      <span className="text-[7px] text-slate-600 font-mono">{inc?.date}</span>
                    </div>
                    <h4 className="text-[10px] text-slate-200 font-semibold mb-1 leading-tight">{inc?.title}</h4>
                    <div className="flex items-center gap-1 mb-1.5">
                      <span className="rounded bg-green-500/10 text-green-400 px-1 py-0.5 text-[7px] font-mono border border-green-500/20">{inc?.outcome}</span>
                      <span className="text-[7px] text-slate-600 font-mono">{inc?.duration}</span>
                    </div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[7px] text-slate-600 font-mono">Similarity</span>
                      <span className={'text-[9px] font-mono font-bold ' + (inc.similarity >= 85 ? 'text-green-400' : inc.similarity >= 70 ? 'text-yellow-400' : 'text-slate-400')}>{inc?.similarity}%</span>
                    </div>
                    <AnimatedBar value={inc?.similarity} color={inc.similarity >= 85 ? 'bg-green-500' : inc.similarity >= 70 ? 'bg-yellow-500' : 'bg-slate-500'} />
                    <div className="mt-1.5 text-[7px] text-slate-600 font-mono leading-tight">
                      <span className="text-slate-500">Fix: </span>{inc?.fixApplied}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {(inc.services || []).map((s, si) => (
                        <span key={si} className="rounded bg-white/[0.03] px-1 py-0.5 text-[6px] font-mono text-slate-600 border border-white/[0.04]">{s}</span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* ===== EVIDENCE CENTER — FLOATING FORENSIC CARDS ===== */}
            <motion.div variants={item} className="glass-card p-3 relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber-500/[0.03] rounded-full blur-[60px] pointer-events-none" />
              <div className="relative">
                <div className="flex items-center gap-1.5 mb-3">
                  <div className="flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-amber-500/20 to-yellow-500/20">
                    <svg className="h-3 w-3 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-white">Evidence Center</h3>
                  <span className="text-[10px] text-slate-600 font-mono">{data.evidenceItems.length} forensic artifacts</span>
                  <StatusBadge status="info" label="Click to inspect" />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-3">
                  {(data.evidenceItems || []).map((ev, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                      className={'glass-card p-3 text-center transition-all cursor-pointer group ' + (ev.critical ? 'border-l-red-500/40 hover:border-red-500/60' : 'hover:border-cyan-500/30')}
                      onClick={() => setSelectedEvidence(selectedEvidence === i ? null : i)}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[8px] text-slate-600 font-mono tracking-wider">{ev?.type}</span>
                        {ev.critical && <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]" />}
                      </div>
                      <div className="text-lg font-bold text-white font-mono tracking-tight">{ev?.value}</div>
                      <div className="text-[8px] text-slate-400 mt-0.5">{ev?.title}</div>
                      <div className="text-[7px] text-slate-700 font-mono mt-1">{ev?.source}</div>
                      <div className="mt-1.5 h-0.5 rounded-full bg-white/[0.04] overflow-hidden">
                        <div className={'h-full rounded-full transition-all duration-700 ' + (ev.critical ? 'bg-red-500/60 w-full' : 'bg-cyan-500/40 w-3/4')} />
                      </div>
                    </motion.div>
                  ))}
                </div>
                <AnimatePresence>
                  {selectedEvidence !== null && data.evidenceItems[selectedEvidence] && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="mb-3">
                      <div className="rounded-xl border border-cyan-500/25 bg-gradient-to-br from-cyan-500/[0.05] to-blue-500/[0.03] p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <span className="text-[9px] text-cyan-400 font-mono uppercase tracking-wider">{data.evidenceItems[selectedEvidence].type} Forensic Artifact</span>
                            <h4 className="text-sm text-white font-semibold mt-0.5">{data.evidenceItems[selectedEvidence].title}</h4>
                          </div>
                          <StatusBadge status={data.evidenceItems[selectedEvidence].critical ? 'critical' : 'info'} label={data.evidenceItems[selectedEvidence].critical ? 'CRITICAL FINDING' : 'CONTEXTUAL'} />
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          <div className="glass-card p-2"><span className="text-slate-500 block font-mono text-[8px] uppercase tracking-wider">Value</span><span className="text-white font-mono text-sm font-bold">{data.evidenceItems[selectedEvidence].value}</span></div>
                          <div className="glass-card p-2"><span className="text-slate-500 block font-mono text-[8px] uppercase tracking-wider">Timeframe</span><span className="text-slate-300 font-mono text-sm">{data.evidenceItems[selectedEvidence].timeframe}</span></div>
                          <div className="glass-card p-2"><span className="text-slate-500 block font-mono text-[8px] uppercase tracking-wider">Source</span><span className="text-slate-300 font-mono text-sm">{data.evidenceItems[selectedEvidence].source}</span></div>
                          <div className="glass-card p-2"><span className="text-slate-500 block font-mono text-[8px] uppercase tracking-wider">Category</span><span className="text-slate-300 font-mono text-sm">{data.evidenceItems[selectedEvidence].type}</span></div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="glass-card p-3">
                  <div className="flex items-center gap-1.5 mb-2">
                    <svg className="h-3.5 w-3.5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" /></svg>
                    <span className="text-[9px] text-cyan-400 font-mono uppercase tracking-wider">Evidence Timeline Chain</span>
                    <span className="text-[8px] text-slate-600 font-mono ml-auto">{data.evidenceTimeline.length} events</span>
                  </div>
                  <div className="space-y-0.5">
                    {(data.evidenceTimeline || []).map((ev, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                        className="flex items-start gap-3 text-[9px] p-1.5 rounded-lg hover:bg-white/[0.02] transition-all group">
                        <div className="flex flex-col items-center">
                          <div className={'h-2.5 w-2.5 rounded-full ' + (ev.relevance >= 85 ? 'bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.4)]' : ev.relevance >= 75 ? 'bg-yellow-500' : 'bg-slate-600')} />
                          {i < data.evidenceTimeline.length - 1 && <div className="w-px h-4 bg-white/[0.04]" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[8px] text-slate-600 font-mono">{ev?.date}</span>
                            <span className="rounded bg-white/[0.04] px-1.5 py-0.5 text-[7px] text-slate-500 font-mono border border-white/[0.04]">{ev?.type}</span>
                            <span className="ml-auto text-[8px] font-mono text-slate-600">{ev?.relevance}% rel.</span>
                          </div>
                          <p className="text-[9px] text-slate-400 leading-relaxed mt-0.5">{ev?.description}</p>
                          <p className="text-[8px] text-slate-600 font-mono mt-0.5">{ev?.source}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>


            {/* ===== SECTION 10: AI RECOMMENDATIONS ===== */}
            <motion.div variants={item} className="glass-card overflow-hidden">
              <div className="flex items-center gap-1.5 p-2 pb-1">
                <div className="flex h-4 w-4 items-center justify-center rounded-md bg-gradient-to-br from-green-500/20 to-emerald-500/20">
                  <svg className="h-2.5 w-2.5 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                </div>
                <h3 className="text-xs font-semibold text-white">AI Recommendations</h3>
                <span className="text-[9px] text-slate-600 font-mono ml-1">{data.recommendations.length} prioritized actions</span>
              </div>
              <div className="px-2 pb-2 space-y-1">
                {(data.recommendations || []).map((r, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                    className="flex items-start gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] p-2 hover:border-cyan-500/20 transition-all group">
                    <div className="flex items-center gap-1 shrink-0 mt-0.5">
                      <span className={'rounded px-1 py-0.5 text-[7px] font-bold ' + (r?.priority === 'P0' ? 'bg-red-500/15 text-red-400 border border-red-500/25' : r?.priority === 'P1' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20')}>{r.priority}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-slate-300 font-medium">{r?.action}</p>
                      <div className="flex flex-wrap gap-2 mt-0.5 text-[8px] text-slate-600">
                        <span className="flex items-center gap-0.5">
                          <svg className="h-2.5 w-2.5 text-green-400/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
                          {r?.impact}
                        </span>
                        <span className="flex items-center gap-0.5">
                          <svg className="h-2.5 w-2.5 text-blue-400/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          {r?.effort}
                        </span>
                        <span className="flex items-center gap-0.5">
                          <svg className="h-2.5 w-2.5 text-purple-400/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
                          {r?.owner}
                        </span>
                        <span className="flex items-center gap-0.5">
                          <svg className="h-2.5 w-2.5 text-cyan-400/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>
                          {data.recommendationConfidence[i]}% confidence
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* ===== SECTION 11: MITIGATION ROADMAP ===== */}
            <motion.div variants={item} className="glass-card overflow-hidden">
              <div className="flex items-center gap-1.5 p-2 pb-1">
                <div className="flex h-4 w-4 items-center justify-center rounded-md bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
                  <svg className="h-2.5 w-2.5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </div>
                <h3 className="text-xs font-semibold text-white">Mitigation Roadmap</h3>
                <span className="text-[9px] text-slate-600 font-mono ml-1">{data.mitigations.length} phases</span>
              </div>
              <div className="px-2 pb-2 space-y-1">
                {(data.mitigations || []).map((m, i) => {
                  const isOpen = expandedMitigation === i
                  const phaseColors = ['from-red-500/5 to-orange-500/5 border-red-500/15', 'from-yellow-500/5 to-orange-500/5 border-yellow-500/15', 'from-green-500/5 to-cyan-500/5 border-green-500/15']
                  const phaseBadgeColors = ['bg-red-500/15 text-red-400', 'bg-yellow-500/10 text-yellow-400', 'bg-green-500/10 text-green-400']
                  return (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                      className={'rounded-lg border bg-gradient-to-br ' + phaseColors[i] + ' overflow-hidden hover:border-cyan-500/30 transition-all'}>
                      <button onClick={() => setExpandedMitigation(isOpen ? null : i)} className="w-full text-left p-3">
                        <div className="flex items-center justify-between mb-1.5">
                          <h4 className="text-[10px] font-mono text-white font-semibold">{m?.phase}</h4>
                          <span className={'rounded px-1.5 py-0.5 text-[7px] font-bold ' + phaseBadgeColors[i]}>{m?.timeline}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[8px] text-slate-500">
                          <span className="font-mono">Owner: {m?.owner}</span>
                          <span className="font-mono">{(m?.actions || []).length} action items</span>
                          <svg className={'h-2.5 w-2.5 ml-auto transition-transform ' + (isOpen ? 'rotate-180' : '')} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                          </svg>
                        </div>
                        <div className="mt-1.5">
                          <div className="flex items-center justify-between text-[7px] text-slate-600 font-mono mb-0.5">
                            <span>Expected Risk Reduction</span>
                            <span className={i === 0 ? 'text-red-400' : i === 1 ? 'text-yellow-400' : 'text-green-400'}>{(data.riskReduction || [])[i]?.reduction}%</span>
                          </div>
                          <AnimatedBar value={(data.riskReduction || [])[i]?.reduction} color={i === 0 ? 'bg-red-500' : i === 1 ? 'bg-yellow-500' : 'bg-green-500'} />
                        </div>
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="border-t border-transparent">
                            <div className="p-3 space-y-1.5">
                              {(m.actions || []).map((a, ai) => (
                                <div key={ai} className="flex items-start gap-1.5 group">
                                  <div className="h-3.5 w-3.5 mt-0.5 shrink-0 rounded-full border border-cyan-500/30 flex items-center justify-center group-hover:bg-cyan-500/10 transition-colors">
                                    <svg className="h-2 w-2 text-cyan-400/60 group-hover:text-cyan-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                  </div>
                                  <span className="text-[9px] text-slate-400 group-hover:text-slate-300 transition-colors leading-relaxed">{a}</span>
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


            {/* ===== SECTION 12: WHAT-IF SIMULATION LAB ===== */}
            <motion.div variants={item} className="glass-card p-2">
              <div className="flex items-center gap-1.5 mb-3">
                <div className="flex h-4 w-4 items-center justify-center rounded-md bg-gradient-to-br from-violet-500/20 to-purple-500/20">
                  <svg className="h-2.5 w-2.5 text-violet-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                </div>
                <h3 className="text-xs font-semibold text-white">What-If Simulation Lab</h3>
                <span className="text-[9px] text-slate-600 font-mono">{data.whatIfSimulation.scenarios.length} scenarios</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mb-2">
                <div className="rounded-lg border border-red-500/20 bg-red-500/[0.04] p-2">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="h-2 w-2 rounded-full bg-red-500" />
                    <span className="text-[9px] font-mono text-slate-300 font-semibold">Current Path</span>
                    <StatusBadge status="critical" label="BREAKING" />
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 text-[8px]">
                    <div className="rounded bg-white/[0.02] p-1"><span className="text-slate-600 block">Risk Reduction</span><span className="text-red-400 font-mono font-bold">{data.whatIfSimulation.currentPath.riskReduction}%</span></div>
                    <div className="rounded bg-white/[0.02] p-1"><span className="text-slate-600 block">Cost Savings</span><span className="text-slate-400 font-mono">$0</span></div>
                    <div className="rounded bg-white/[0.02] p-1"><span className="text-slate-600 block">Success Prob.</span><span className="text-yellow-400 font-mono font-bold">{data.whatIfSimulation.currentPath.successProbability}%</span></div>
                    <div className="rounded bg-white/[0.02] p-1"><span className="text-slate-600 block">Recovery Time</span><span className="text-red-400 font-mono font-bold">{data.whatIfSimulation.currentPath.recoveryTime}</span></div>
                  </div>
                </div>
                <div className="rounded-lg border border-green-500/20 bg-green-500/[0.04] p-2">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-[9px] font-mono text-slate-300 font-semibold">Recommended Path</span>
                    <StatusBadge status="info" label="OPTIMAL" />
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 text-[8px]">
                    <div className="rounded bg-white/[0.02] p-1"><span className="text-slate-600 block">Risk Reduction</span><span className="text-green-400 font-mono font-bold">{data.whatIfSimulation.recommendedPath.riskReduction}%</span></div>
                    <div className="rounded bg-white/[0.02] p-1"><span className="text-slate-600 block">Cost Savings</span><span className="text-green-400 font-mono font-bold">{'$' + (data.whatIfSimulation.recommendedPath.costSavings/1000).toFixed(0) + 'K'}</span></div>
                    <div className="rounded bg-white/[0.02] p-1"><span className="text-slate-600 block">Success Prob.</span><span className="text-green-400 font-mono font-bold">{data.whatIfSimulation.recommendedPath.successProbability}%</span></div>
                    <div className="rounded bg-white/[0.02] p-1"><span className="text-slate-600 block">Recovery Time</span><span className="text-green-400 font-mono font-bold">{data.whatIfSimulation.recommendedPath.recoveryTime}</span></div>
                  </div>
                </div>
              </div>
              <div className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-4 mb-2">
                {(data.whatIfSimulation.scenarios || []).map((sc, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                    className={'rounded-lg border p-2 ' + (i === 0 ? 'border-red-500/20 bg-red-500/[0.03]' : i === 1 ? 'border-green-500/20 bg-green-500/[0.03]' : i === 2 ? 'border-yellow-500/20 bg-yellow-500/[0.03]' : 'border-cyan-500/20 bg-cyan-500/[0.03]')}>
                    <h4 className="text-[9px] font-semibold text-slate-200 mb-1">{sc?.name}</h4>
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[7px] text-slate-600 font-mono">Risk</span>
                      <span className={'text-[9px] font-mono font-bold ' + (sc.risk >= 80 ? 'text-red-400' : sc.risk >= 40 ? 'text-yellow-400' : 'text-green-400')}>{sc?.risk}%</span>
                    </div>
                    <AnimatedBar value={100 - sc?.risk} color={sc.risk >= 80 ? 'bg-red-500' : sc.risk >= 40 ? 'bg-yellow-500' : 'bg-green-500'} />
                    <div className="flex items-center justify-between mt-1 text-[7px] text-slate-600 font-mono">
                      <span>{sc?.impact}</span>
                      <span>{sc?.timeToRecover}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                <div className="rounded bg-cyan-500/[0.04] border border-cyan-500/15 p-1.5 text-center">
                  <div className="text-[7px] text-slate-600 font-mono">Risk Reduction</div>
                  <div className="text-xs font-bold text-cyan-400 font-mono">{data.whatIfSimulation.metrics.riskReduction}%</div>
                </div>
                <div className="rounded bg-green-500/[0.04] border border-green-500/15 p-1.5 text-center">
                  <div className="text-[7px] text-slate-600 font-mono">Cost Savings</div>
                  <div className="text-xs font-bold text-green-400 font-mono">{'$' + (data.whatIfSimulation.metrics.costSavings/1000).toFixed(0) + 'K'}</div>
                </div>
                <div className="rounded bg-blue-500/[0.04] border border-blue-500/15 p-1.5 text-center">
                  <div className="text-[7px] text-slate-600 font-mono">Success Boost</div>
                  <div className="text-xs font-bold text-blue-400 font-mono">{'+' + data.whatIfSimulation.metrics.successBoost + '%'}</div>
                </div>
                <div className="rounded bg-purple-500/[0.04] border border-purple-500/15 p-1.5 text-center">
                  <div className="text-[7px] text-slate-600 font-mono">Time Reduction</div>
                  <div className="text-xs font-bold text-purple-400 font-mono">{data.whatIfSimulation.metrics.timeReduction + '%'}</div>
                </div>
              </div>
            </motion.div>

            {/* ===== SECTION 13: AI FORECAST ENGINE ===== */}
            <motion.div variants={item} className="glass-card p-2">
              <div className="flex items-center gap-1.5 mb-3">
                <div className="flex h-4 w-4 items-center justify-center rounded-md bg-gradient-to-br from-sky-500/20 to-blue-500/20">
                  <svg className="h-2.5 w-2.5 text-sky-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
                  </svg>
                </div>
                <h3 className="text-xs font-semibold text-white">AI Forecast Engine</h3>
                <span className="text-[9px] text-slate-600 font-mono">{data.forecast.predictions.length} prediction windows</span>
              </div>
              <div className="grid gap-2 sm:grid-cols-3 mb-2">
                {(data.forecast.predictions || []).map((pred, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                    className={'rounded-lg border p-2 ' + (i === 0 ? 'border-cyan-500/20 bg-cyan-500/[0.03]' : i === 1 ? 'border-yellow-500/20 bg-yellow-500/[0.03]' : 'border-green-500/20 bg-green-500/[0.03]')}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[9px] font-mono text-white font-semibold">{pred?.period}</span>
                      <span className={'flex items-center gap-0.5 text-[8px] font-mono ' + (pred.trend === 'down' ? 'text-green-400' : 'text-yellow-400')}>
                        <svg className={'h-2.5 w-2.5 ' + (pred.trend === 'down' ? '' : 'rotate-180')} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                        {pred?.trend}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                        <div className={'h-full rounded-full ' + (pred.risk >= 50 ? 'bg-red-500' : 'bg-green-500')} style={{ width: pred.risk + '%' }} />
                      </div>
                      <span className="text-[8px] font-mono text-slate-400">{pred?.risk}%</span>
                    </div>
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-[7px] text-slate-600 font-mono">Confidence:</span>
                      <span className="text-[8px] text-cyan-400 font-mono font-bold">{pred?.confidence}%</span>
                    </div>
                    <p className="text-[7px] text-slate-500 leading-tight">{pred?.description}</p>
                  </motion.div>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2">
                  <span className="text-[7px] text-slate-500 font-mono uppercase tracking-wider block mb-1.5">Monthly Incident Trend</span>
                  <div className="flex items-end gap-1 h-16">
                    {(data.forecast.trendData || []).map((d, i) => {
                      const maxHeight = Math.max(...(data.forecast.trendData || []).map(x => x.incidents))
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                          <div className="w-full rounded-t bg-red-500/30 transition-all" style={{ height: (d.incidents / maxHeight * 100) + '%', minHeight: '4px' }} />
                          <div className="w-full rounded-t bg-cyan-500/20 transition-all" style={{ height: (d.mttr / 62 * 40) + '%', minHeight: '2px' }} />
                          <span className="text-[6px] text-slate-600 font-mono">{d?.month}</span>
                        </div>
                      )
                    })}
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[6px] text-slate-700 font-mono">
                    <span className="flex items-center gap-0.5"><span className="h-1.5 w-1.5 rounded-full bg-red-500/50" /> Incidents</span>
                    <span className="flex items-center gap-0.5"><span className="h-1.5 w-1.5 rounded-full bg-cyan-500/40" /> MTTR (min)</span>
                  </div>
                </div>
                <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2">
                  <span className="text-[7px] text-slate-500 font-mono uppercase tracking-wider block mb-1.5">Risk by Service - Mitigation Impact</span>
                  <div className="space-y-1">
                    {(data.forecast.riskByService || []).map((svc, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[8px]">
                        <span className="w-24 text-slate-400 font-mono truncate">{svc?.service}</span>
                        <div className="flex-1 flex items-center gap-0.5">
                          <div className="flex-1 h-2 rounded-full bg-white/[0.06] overflow-hidden relative">
                            <div className="h-full rounded-full bg-red-500" style={{ width: svc.currentRisk + '%' }} />
                            <div className="absolute inset-y-0 left-0 h-full rounded-full bg-green-500/60" style={{ width: svc.mitigatedRisk + '%' }} />
                          </div>
                        </div>
                        <span className="text-green-400 font-mono w-8 text-right">{svc?.improvement}%</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[6px] text-slate-700 font-mono">
                    <span className="flex items-center gap-0.5"><span className="h-1.5 w-1.5 rounded-full bg-red-500" /> Current</span>
                    <span className="flex items-center gap-0.5"><span className="h-1.5 w-1.5 rounded-full bg-green-500/60" /> Mitigated</span>
                  </div>
                </div>
              </div>
            </motion.div>


            {/* ===== SECTION 14: EXECUTIVE DECISION CENTER ===== */}
            <motion.div variants={item} className="glass-card p-2">
              <div className="flex items-center gap-1.5 mb-3">
                <div className="flex h-4 w-4 items-center justify-center rounded-md bg-gradient-to-br from-cyan-500/20 to-blue-500/20">
                  <svg className="h-2.5 w-2.5 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                  </svg>
                </div>
                <h3 className="text-xs font-semibold text-white">Executive Decision Center</h3>
                <StatusBadge status="info" label="Action Required" />
              </div>
              <div className="grid gap-1.5 sm:grid-cols-2">
                {(data.decisions || []).map((dec, i) => (
                  <motion.div key={dec?.action} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                    className={'rounded-lg border p-3 transition-all hover:scale-[1.01] ' + decisionGlows[dec.action] + ' bg-white/[0.02]'}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-[10px] font-bold text-white font-mono">{dec?.action}</h4>
                      <span className={'text-base font-bold font-mono ' + decisionConfidenceColors[dec.action]}>{dec?.confidence}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden mb-2">
                      <div className={'h-full rounded-full transition-all duration-1000 ' + (dec.action === 'Deploy Now' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : dec.action === 'Monitor Closely' ? 'bg-amber-500' : dec.action === 'Rollback Changes' ? 'bg-orange-500' : 'bg-red-500')}
                        style={{ width: dec.confidence + '%' }} />
                    </div>
                    <p className="text-[9px] text-slate-400 mb-2 leading-relaxed">{dec?.reasoning}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[8px] text-slate-600 font-mono">Assigned: {dec?.team}</span>
                      <button className={'rounded-lg px-2.5 py-1 text-[8px] font-bold text-white transition-all hover:opacity-80 ' + decisionButtons[dec.action]}>
                        {dec.action === 'Deploy Now' ? 'Execute' : dec.action === 'Monitor Closely' ? 'Observe' : dec.action === 'Rollback Changes' ? 'Rollback' : 'Deep Dive'}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* ===== SIMILAR FAILURE DATABASE ===== */}
            <motion.div variants={item} className="glass-card overflow-hidden">
              <div className="flex items-center gap-1.5 p-2 pb-1">
                <div className="flex h-4 w-4 items-center justify-center rounded-md bg-gradient-to-br from-red-500/20 to-orange-500/20">
                  <svg className="h-2.5 w-2.5 text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                </div>
                <h3 className="text-xs font-semibold text-white">Similar Failure Database</h3>
                <span className="text-[9px] text-slate-600 font-mono ml-1">{data.failureModes.length} known failure modes</span>
              </div>
              <div className="px-2 pb-2 space-y-1">
                {(data.failureModes || []).map((f, i) => {
                  const isOpen = expandedFailure === i
                  return (
                    <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                      className="rounded-lg border border-white/[0.06] bg-white/[0.02] overflow-hidden hover:border-cyan-500/20 transition-all">
                      <button onClick={() => setExpandedFailure(isOpen ? null : i)}
                        className="flex w-full items-center justify-between p-2 text-left">
                        <div className="flex items-center gap-1.5 flex-1 min-w-0">
                          <span className={'rounded px-1 py-0.5 text-[7px] font-bold shrink-0 ' + severityColors[f.severity]}>{f?.severity}</span>
                          <span className="text-[10px] text-slate-300">{f?.mode}</span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0 ml-2">
                          <StatusBadge status={f.probability === 'High' ? 'critical' : f.probability === 'Medium' ? 'warning' : 'info'} label={f.probability} />
                          <svg className={'h-3 w-3 text-slate-600 transition-transform ' + (isOpen ? 'rotate-180' : '')} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                          </svg>
                        </div>
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="border-t border-transparent">
                            <div className="p-2 grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[9px]">
                              <div className="rounded bg-white/[0.02] p-1.5"><span className="text-slate-600 block mb-0.5 font-mono text-[8px] uppercase tracking-wider">Impact</span><span className="text-slate-400">{f?.impact}</span></div>
                              <div className="rounded bg-white/[0.02] p-1.5"><span className="text-slate-600 block mb-0.5 font-mono text-[8px] uppercase tracking-wider">Detection</span><span className="text-slate-400">{f?.detection}</span></div>
                              <div className="rounded bg-white/[0.02] p-1.5 sm:col-span-2"><span className="text-slate-600 block mb-0.5 font-mono text-[8px] uppercase tracking-wider">Mitigation</span><span className="text-cyan-400">{f?.mitigation}</span></div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>

            {/* ===== INCIDENT CORRELATION ENGINE ===== */}
            <motion.div variants={item} className="glass-card p-2">
              <div className="flex items-center gap-1.5 mb-3">
                <div className="flex h-4 w-4 items-center justify-center rounded-md bg-gradient-to-br from-purple-500/20 to-indigo-500/20">
                  <svg className="h-2.5 w-2.5 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                  </svg>
                </div>
                <h3 className="text-xs font-semibold text-white">Incident Correlation Engine</h3>
                <span className="text-[9px] text-slate-600 font-mono">{data.correlations.length} correlations found</span>
              </div>
              <div className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
                {(data.correlations || []).map((corr, i) => {
                  const corrColors = ['from-red-500/10 to-orange-500/5', 'from-orange-500/10 to-yellow-500/5', 'from-yellow-500/10 to-green-500/5', 'from-blue-500/10 to-cyan-500/5', 'from-purple-500/10 to-pink-500/5']
                  const borderColors = ['border-red-500/20', 'border-orange-500/20', 'border-yellow-500/20', 'border-blue-500/20', 'border-purple-500/20']
                  return (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                      className={'rounded-lg border ' + borderColors[i] + ' bg-gradient-to-br ' + corrColors[i] + ' p-2 hover:border-cyan-500/30 transition-all relative overflow-hidden group'}>
                      <div className="relative">
                        <div className="flex items-center justify-between mb-1.5">
                          <h4 className="text-[10px] font-semibold text-slate-200">{corr.incident}</h4>
                          <span className="flex items-center gap-1 text-[9px] font-mono text-cyan-400">{corr.score}%</span>
                        </div>
                        <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden mb-1.5">
                          <div className={'h-full rounded-full ' + (corr.score >= 85 ? 'bg-red-500' : corr.score >= 75 ? 'bg-orange-500' : 'bg-yellow-500')} style={{ width: corr.score + '%' }} />
                        </div>
                        <div className="space-y-0.5 text-[8px]">
                          <div className="flex items-center gap-1">
                            <span className="text-slate-600 w-14 shrink-0">Root Cause:</span>
                            <span className="text-slate-400 font-mono">{corr.commonCause}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-slate-600 w-14 shrink-0">Services:</span>
                            <span className="text-slate-400">{corr.services.join(', ')}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-slate-600 w-14 shrink-0">Timeline Gap:</span>
                            <span className="text-slate-400 font-mono">{corr.gap}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>

            {/* ===== RISK HEATMAP ===== */}
            <motion.div variants={item} className="glass-card p-2">
              <div className="flex items-center gap-1.5 mb-3">
                <div className="flex h-4 w-4 items-center justify-center rounded-md bg-gradient-to-br from-orange-500/20 to-red-500/20">
                  <svg className="h-2.5 w-2.5 text-orange-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
                  </svg>
                </div>
                <h3 className="text-xs font-semibold text-white">Risk Heatmap</h3>
                <span className="text-[9px] text-slate-600 font-mono">Phase vs. Severity</span>
              </div>
              <div className="overflow-x-auto">
                <svg viewBox="0 0 600 380" className="w-full max-w-2xl mx-auto" style={{ minWidth: 500 }}>
                  <defs>
                    <linearGradient id="heatRed" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="rgba(239,68,68,0.4)" /><stop offset="100%" stopColor="rgba(239,68,68,0.15)" /></linearGradient>
                    <linearGradient id="heatAmber" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="rgba(245,158,11,0.35)" /><stop offset="100%" stopColor="rgba(245,158,11,0.1)" /></linearGradient>
                    <linearGradient id="heatYellow" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="rgba(234,179,8,0.25)" /><stop offset="100%" stopColor="rgba(234,179,8,0.08)" /></linearGradient>
                    <linearGradient id="heatGreen" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="rgba(34,197,94,0.2)" /><stop offset="100%" stopColor="rgba(34,197,94,0.05)" /></linearGradient>
                  </defs>
                  <rect width="600" height="380" fill="transparent" />
                  <text x="140" y="40" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">Critical</text>
                  <text x="245" y="40" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">High</text>
                  <text x="350" y="40" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">Medium</text>
                  <text x="455" y="40" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="monospace">Low</text>
                  {['Design', 'Implementation', 'Testing', 'Deployment', 'Post-Release'].map((phase, i) => (
                    <text key={phase} x="75" y={85 + i * 60} textAnchor="end" fill="#94a3b8" fontSize="9" fontFamily="monospace">{phase}</text>
                  ))}
                  {(data.heatmap || []).map((row, ri) => {
                    const cells = [
                      { label: row?.critical, grad: 'heatRed', val: row?.critical },
                      { label: row?.high, grad: 'heatAmber', val: row?.high },
                      { label: row?.medium, grad: 'heatYellow', val: row?.medium },
                      { label: row?.low, grad: 'heatGreen', val: row?.low },
                    ]
                    return (cells || []).map((cell, ci) => {
                      const x = 110 + ci * 105, y = 55 + ri * 60
                      return (
                        <motion.g key={ri + '-' + ci} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: (ri * 4 + ci) * 0.04 }}>
                          <rect x={x} y={y} width="90" height="40" rx="6"
                            fill={'url(#' + (cell?.grad || 'heatRed') + ')'}
                            stroke={(cell?.val || 0) >= 70 ? 'rgba(239,68,68,0.3)' : (cell?.val || 0) >= 40 ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.05)'}
                            strokeWidth="1" className="transition-all hover:stroke-cyan-500/40 hover:stroke-2 cursor-pointer" />
                          <text x={x + 45} y={y + 24} textAnchor="middle"
                            fill={(cell?.val || 0) >= 70 ? '#fca5a5' : (cell?.val || 0) >= 40 ? '#fbbf24' : '#86efac'}
                            fontSize="14" fontWeight="700" fontFamily="monospace">{cell?.val}</text>
                        </motion.g>
                      )
                    })
                  })}
                </svg>
              </div>
            </motion.div>

            {/* ===== INVESTIGATION QUALITY ===== */}
            <motion.div variants={item} className="glass-card p-2">
              <div className="flex items-center gap-1.5 mb-2">
                <div className="flex h-4 w-4 items-center justify-center rounded-md bg-gradient-to-br from-cyan-500/20 to-blue-500/20">
                  <svg className="h-2.5 w-2.5 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                  </svg>
                </div>
                <h3 className="text-xs font-semibold text-white">Investigation Quality</h3>
              </div>
              <ConfidenceMeter confidence={data.confidence} />
              <div className="mt-2 grid grid-cols-3 gap-2 text-[8px] text-slate-600 font-mono">
                <div className="rounded bg-white/[0.02] p-1.5 text-center">
                  <div className="text-cyan-400 text-xs font-bold">{data.evidenceTimeline.length}</div>
                  <div>Evidence Artifacts</div>
                </div>
                <div className="rounded bg-white/[0.02] p-1.5 text-center">
                  <div className="text-cyan-400 text-xs font-bold">{data.correlations.length}</div>
                  <div>Correlations Found</div>
                </div>
                <div className="rounded bg-white/[0.02] p-1.5 text-center">
                  <div className="text-cyan-400 text-xs font-bold">{data.investigationTimeline.length}</div>
                  <div>Timeline Phases</div>
                </div>
              </div>
            </motion.div>

            {/* ===== HISTORICAL INCIDENT TRENDS ===== */}
            <motion.div variants={item} className="glass-card p-2">
              <div className="flex items-center gap-1.5 mb-3">
                <div className="flex h-4 w-4 items-center justify-center rounded-md bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
                  <svg className="h-2.5 w-2.5 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                  </svg>
                </div>
                <h3 className="text-xs font-semibold text-white">Historical Incident Trends</h3>
                <span className="text-[9px] text-slate-600 font-mono">{data.incidents.length} past incidents</span>
              </div>
              <div className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
                {(data.incidents || []).map((inc, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                    className={'rounded-lg border p-2 hover:border-cyan-500/30 transition-all ' + (inc.severity === 'critical' ? 'border-red-500/20 bg-red-500/[0.03]' : inc.severity === 'high' ? 'border-orange-500/20 bg-orange-500/[0.02]' : 'border-yellow-500/15 bg-yellow-500/[0.02]')}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[8px] text-slate-600 font-mono">{inc?.date}</span>
                      <span className={'rounded px-1 py-0.5 text-[6px] font-bold ' + (inc.severity === 'critical' ? 'bg-red-500/15 text-red-400 border border-red-500/25' : inc.severity === 'high' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/15')}>{inc?.severity}</span>
                    </div>
                    <h4 className="text-[10px] font-semibold text-slate-200 mb-0.5">{inc?.title}</h4>
                    <p className="text-[8px] text-slate-500 mb-1">{inc?.cause}</p>
                    <div className="flex items-center gap-1 text-[7px] text-slate-600 font-mono mb-1">
                      <span className="text-red-400">Impact:</span> {inc?.impact}
                    </div>
                    <div className="flex items-center gap-1 text-[7px] text-slate-600 font-mono">
                      <span className="text-cyan-400">Lesson:</span> {inc?.lessons}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      <span className="text-[7px] text-slate-600 font-mono">Services: </span>
                      {(inc.services || []).map((s, si) => (
                        <span key={si} className="rounded bg-white/[0.03] px-1 py-0.5 text-[6px] font-mono text-slate-500 border border-white/[0.04]">{s}</span>
                      ))}
                      <span className="ml-auto text-[7px] text-slate-600 font-mono">{inc?.duration}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* ===== RISK TIMELINE ANALYSIS ===== */}
            <motion.div variants={item} className="glass-card p-2">
              <div className="flex items-center gap-1.5 mb-3">
                <div className="flex h-4 w-4 items-center justify-center rounded-md bg-gradient-to-br from-amber-500/20 to-orange-500/20">
                  <svg className="h-2.5 w-2.5 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xs font-semibold text-white">Risk Timeline Analysis</h3>
                <span className="text-[9px] text-slate-600 font-mono">5 lifecycle phases</span>
              </div>
              <div className="space-y-2">
                {(data.riskTimeline || []).map((rt, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-28 text-[8px] text-slate-400 font-mono">{rt?.phase}</span>
                    <div className="flex-1 h-2 rounded-full bg-white/[0.06] overflow-hidden">
                      <div className={'h-full rounded-full ' + (rt?.color === 'red' ? 'bg-red-500' : rt?.color === 'orange' ? 'bg-orange-500' : rt?.color === 'yellow' ? 'bg-yellow-500' : 'bg-green-500')} style={{ width: rt.risk + '%' }} />
                    </div>
                    <span className={'text-[9px] font-mono font-bold w-8 text-right ' + (rt.risk >= 80 ? 'text-red-400' : rt.risk >= 60 ? 'text-orange-400' : rt.risk >= 40 ? 'text-yellow-400' : 'text-green-400')}>{rt?.risk}</span>
                  </div>
                ))}
              </div>
              <div className="mt-2 rounded-lg border border-cyan-500/10 bg-cyan-500/[0.03] p-2 text-[8px] text-slate-500 leading-relaxed">
                Risk escalates through the SDLC lifecycle, peaking at deployment (88%) where the missing circuit breaker triggered the cascade. Post-release risk drops to 55% after hotfix deployment.
              </div>
            </motion.div>

            {/* ===== DEFENSE IN DEPTH SCORE ===== */}
            <motion.div variants={item} className="glass-card p-2">
              <div className="flex items-center gap-1.5 mb-3">
                <div className="flex h-4 w-4 items-center justify-center rounded-md bg-gradient-to-br from-green-500/20 to-teal-500/20">
                  <svg className="h-2.5 w-2.5 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </div>
                <h3 className="text-xs font-semibold text-white">Defense-in-Depth Score</h3>
                <span className="text-[9px] text-slate-600 font-mono">3-layer protection analysis</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="rounded-lg border border-red-500/20 bg-red-500/[0.03] p-2">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="h-2 w-2 rounded-full bg-red-500" />
                    <span className="text-[9px] font-mono text-white font-semibold">Detection Layer</span>
                  </div>
                  <div className="text-[8px] text-slate-500 mb-1">Monitoring & alerting coverage</div>
                  <AnimatedBar value={65} color="bg-red-500" />
                  <div className="flex items-center justify-between mt-0.5 text-[7px] text-slate-600 font-mono">
                    <span>Score</span><span className="text-red-400 font-bold">65%</span>
                  </div>
                  <div className="mt-1 text-[7px] text-slate-500">Gap: Retry queue metrics not monitored. Alert delay: 5min.</div>
                </div>
                <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/[0.03] p-2">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="h-2 w-2 rounded-full bg-yellow-500" />
                    <span className="text-[9px] font-mono text-white font-semibold">Prevention Layer</span>
                  </div>
                  <div className="text-[8px] text-slate-500 mb-1">Circuit breakers, timeouts, retry limits</div>
                  <AnimatedBar value={42} color="bg-yellow-500" />
                  <div className="flex items-center justify-between mt-0.5 text-[7px] text-slate-600 font-mono">
                    <span>Score</span><span className="text-yellow-400 font-bold">42%</span>
                  </div>
                  <div className="mt-1 text-[7px] text-slate-500">Gap: No circuit breaker on payment retry loop. Bounded queues missing.</div>
                </div>
                <div className="rounded-lg border border-green-500/20 bg-green-500/[0.03] p-2">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-[9px] font-mono text-white font-semibold">Recovery Layer</span>
                  </div>
                  <div className="text-[8px] text-slate-500 mb-1">Rollback, canary, hotfix capability</div>
                  <AnimatedBar value={78} color="bg-green-500" />
                  <div className="flex items-center justify-between mt-0.5 text-[7px] text-slate-600 font-mono">
                    <span>Score</span><span className="text-green-400 font-bold">78%</span>
                  </div>
                  <div className="mt-1 text-[7px] text-slate-500">Gap: Runbook incomplete. Rollback time: 30min target vs 45min actual.</div>
                </div>
              </div>
            </motion.div>

            {/* ===== SECTION 15: INVESTIGATION CONCLUSION ===== */}
            <motion.div variants={item} className="glass-card overflow-hidden">
              <div className="relative p-2">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/[0.03] via-transparent to-cyan-500/[0.02] pointer-events-none" />
                <div className="relative">
                  <div className="flex items-center gap-1.5 mb-3">
                    <div className="flex h-4 w-4 items-center justify-center rounded-md bg-gradient-to-br from-red-500/20 to-rose-500/20">
                      <svg className="h-2.5 w-2.5 text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
                      </svg>
                    </div>
                    <h3 className="text-xs font-semibold text-white">Investigation Conclusion</h3>
                    <StatusBadge status="critical" label={data.verdict.risk + ' Risk'} />
                  </div>
                  <div className="grid gap-2 lg:grid-cols-3 mb-2">
                    <div className="flex flex-col items-center justify-center p-3 rounded-lg border border-white/[0.06] bg-white/[0.02]">
                      <span className="text-[9px] text-slate-600 font-mono tracking-wider uppercase mb-1">Overall Risk Verdict</span>
                      <span className={'text-2xl font-bold font-mono ' + (data.verdict.risk === 'High' ? 'text-red-400' : data.verdict.risk === 'Medium' ? 'text-yellow-400' : 'text-green-400')}>
                        {data.verdict.risk}
                      </span>
                      <div className="mt-2 scale-[0.7] origin-center">
                        <RiskGauge score={data.verdict.confidence} />
                      </div>
                      <span className="text-[8px] text-slate-600 font-mono mt-1">Confidence: {data.verdict.confidence}%</span>
                    </div>
                    <div className="lg:col-span-2 space-y-2">
                      <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2">
                        <span className="text-[8px] text-slate-600 font-mono tracking-wider uppercase block mb-1">Key Findings</span>
                        <ul className="space-y-1">
                          {(data.verdict.findings || []).map((f, fi) => (
                            <li key={fi} className="flex items-start gap-1.5 text-[10px] text-slate-400">
                              <svg className="h-3.5 w-3.5 mt-0.5 shrink-0 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {f}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="rounded-lg border border-cyan-500/15 bg-cyan-500/[0.03] p-2">
                        <span className="text-[8px] text-cyan-400 font-mono tracking-wider uppercase block mb-1">Recommended Action</span>
                        <p className="text-[10px] text-slate-400 leading-relaxed">{data.verdict.action}</p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mb-1.5">
                    <div className="rounded bg-white/[0.02] border border-white/[0.06] p-2 text-center">
                      <div className="text-[8px] text-slate-600 font-mono uppercase">Failures Found</div>
                      <div className="text-lg font-bold text-red-400 font-mono">{data.totalFailures}</div>
                    </div>
                    <div className="rounded bg-white/[0.02] border border-white/[0.06] p-2 text-center">
                      <div className="text-[8px] text-slate-600 font-mono uppercase">MRs Correlated</div>
                      <div className="text-lg font-bold text-blue-400 font-mono">{data.mrs.length}</div>
                    </div>
                    <div className="rounded bg-white/[0.02] border border-white/[0.06] p-2 text-center">
                      <div className="text-[8px] text-slate-600 font-mono uppercase">Evidence Items</div>
                      <div className="text-lg font-bold text-amber-400 font-mono">{data.evidenceTimeline.length + data.evidenceItems.length}</div>
                    </div>
                    <div className="rounded bg-white/[0.02] border border-white/[0.06] p-2 text-center">
                      <div className="text-[8px] text-slate-600 font-mono uppercase">Case Confidence</div>
                      <div className="text-lg font-bold text-green-400 font-mono">{data.confidence}%</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-transparent">
                    <div className="text-[8px] text-slate-700 font-mono">Case {data.caseId} . Investigated by AI Forensic Engine v2.4</div>
                    <div className="flex items-center gap-1.5">
                      <div className="flex items-center gap-0.5">
                        <div className="h-1.5 w-4 rounded-sm bg-red-500" />
                        <div className="h-1.5 w-4 rounded-sm bg-red-500/60" />
                        <div className="h-1.5 w-4 rounded-sm bg-orange-500/40" />
                        <div className="h-1.5 w-4 rounded-sm bg-yellow-500/30" />
                        <div className="h-1.5 w-4 rounded-sm bg-green-500/20" />
                      </div>
                      <span className="text-[9px] text-red-400 font-semibold font-mono">HIGH</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ===== INVESTIGATION TIMELINE ===== */}
            <motion.div variants={item} className="glass-card p-2">
              <div className="flex items-center gap-1.5 mb-3">
                <div className="flex h-4 w-4 items-center justify-center rounded-md bg-gradient-to-br from-purple-500/20 to-indigo-500/20">
                  <svg className="h-2.5 w-2.5 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xs font-semibold text-white">Investigation Timeline</h3>
                <span className="text-[9px] text-slate-600 font-mono">{data.investigationTimeline.length} phases - Total: 4.5 hours</span>
              </div>
              <div className="relative">
                <div className="absolute left-[15px] top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/40 via-cyan-500/30 via-orange-500/20 via-green-500/20 via-purple-500/15 to-slate-500/10" />
                <div className="space-y-0">
                  {(data.investigationTimeline || []).map((ev, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                      className="relative flex items-start gap-2 py-2 group">
                      <div className={'relative z-10 mt-0.5 h-3 w-3 shrink-0 rounded-full border-2 ' + (timelineDotColors[ev.type] || 'bg-slate-500 border-slate-500/30') + ' transition-all group-hover:scale-125 shadow-lg'}>
                        <div className="absolute inset-0.5 rounded-full bg-current opacity-30 animate-pulse" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between flex-wrap gap-1 mb-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className={'rounded px-1 py-0.5 text-[7px] font-bold ' + (timelineBadgeColors[ev.type] || 'bg-slate-500/10 text-slate-400')}>{ev?.type}</span>
                            <span className="text-[9px] font-mono text-slate-500">{ev?.date}</span>
                          </div>
                          <span className="text-[8px] text-slate-600 font-mono">{ev?.duration}</span>
                        </div>
                        <h4 className="text-[10px] font-semibold text-slate-200 mb-0.5">{ev?.title}</h4>
                        <p className="text-[9px] text-slate-500 leading-relaxed">{ev?.description}</p>
                        <div className="flex items-center gap-1.5 mt-1 text-[8px] text-slate-600 font-mono">
                          <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                          </svg>
                          {ev?.team}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* ===== LIVE INTELLIGENCE FEED — SOC CENTER ===== */}
            <motion.div variants={item} className="glass-card overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/[0.01] via-transparent to-red-500/[0.01] pointer-events-none" />
              <div className="relative">
                <div className="flex items-center justify-between p-3 pb-1">
                  <div className="flex items-center gap-1.5">
                    <div className="flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-cyan-500/20 to-blue-500/20">
                      <svg className="h-3 w-3 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                      </svg>
                    </div>
                    <h3 className="text-sm font-semibold text-white">Live SOC Feed</h3>
                    <span className="px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-[8px] text-cyan-400 font-mono">SECURITY OPS</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-[9px] text-green-400 font-mono bg-green-500/[0.06] border border-green-500/20 rounded-md px-2 py-0.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.6)]" />
                      <span className="tracking-wider">LIVE</span>
                    </div>
                    <span className="text-[9px] text-slate-600 font-mono">{data.liveFeed.length} events</span>
                  </div>
                </div>
                <div ref={feedRef} className="relative max-h-[360px] overflow-y-auto scroll-smooth">
                  <div className="sticky top-0 h-4 bg-gradient-to-b from-slate-950/60 to-transparent pointer-events-none z-10" />
                  {(data.liveFeed || []).map((item, i) => {
                    const severityGlow = item.severity === 'critical' ? 'shadow-[inset_0_0_15px_rgba(239,68,68,0.05)]' : item.severity === 'high' ? 'shadow-[inset_0_0_15px_rgba(249,115,22,0.04)]' : ''
                    return (
                      <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                        className={'border-l-[3px] pl-3 pr-4 py-2.5 ' + (feedTypeStyles[item.type] || 'border-l-slate-600 bg-white/[0.01]') + ' hover:bg-white/[0.03] transition-all ' + severityGlow}>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <span className={'h-1.5 w-1.5 rounded-full ' + (item.severity === 'critical' ? 'bg-red-500 animate-pulse' : item.severity === 'high' ? 'bg-orange-500' : item.severity === 'warning' ? 'bg-yellow-500' : 'bg-cyan-500')} />
                              <span className="text-[9px] font-mono text-slate-600">{item?.time}</span>
                              <span className={'rounded px-1.5 py-0.5 text-[7px] font-bold uppercase ' + (item.severity === 'critical' ? 'bg-red-500/15 text-red-400 border border-red-500/20' : item.severity === 'high' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/15' : item.severity === 'warning' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/15' : 'bg-blue-500/10 text-blue-400 border border-blue-500/15')}>{item?.severity}</span>
                              <span className="text-[8px] text-slate-700 font-mono uppercase tracking-wider">{item?.type}</span>
                            </div>
                            <p className="text-[10px] text-slate-400 leading-relaxed">{item?.message}</p>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                  <div className="sticky bottom-0 h-4 bg-gradient-to-t from-slate-950/60 to-transparent pointer-events-none" />
                </div>
              </div>
            </motion.div>

          </motion.div>
        )}

        <NarrativeCTA currentPage="/intelligence" confidence={94} impact="$340K risk reduction" />

      </motion.div>
    </Layout>
  )
}