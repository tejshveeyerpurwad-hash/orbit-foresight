import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Layout from '../components/Layout'
import StatusBadge from '../components/StatusBadge'
import NarrativeCTA from '../components/NarrativeCTA'
import ExecutiveCommandHeader from '../components/ExecutiveCommandHeader'

const mockData = {
  kpis: [
    { value: 92, label: 'System Health', format: '%', trend: 'stable', ringColor: '#34d399', color: 'text-emerald-400', subtitle: 'Overall system status across 47 services', detail: 'Last 24h: 99.97% uptime' },
    { value: 12, label: 'Active Incidents', format: '', trend: 'up', ringColor: '#ef4444', color: 'text-red-400', subtitle: '3 critical, 5 high, 4 medium', detail: 'Up from 8 yesterday' },
    { value: 24, label: 'MTTR (min)', format: 'm', trend: 'down', ringColor: '#22d3ee', color: 'text-cyan-400', subtitle: 'Mean time to resolve', detail: 'Target: <30 min' },
    { value: 47, label: 'Services Monitored', format: '', trend: 'stable', ringColor: '#fbbf24', color: 'text-amber-400', subtitle: 'Across all environments', detail: '6 with degraded performance' },
    { value: 99.97, label: 'Uptime', format: '%', trend: 'stable', ringColor: '#34d399', color: 'text-emerald-400', subtitle: 'Last 30 days SLA', detail: 'Target: 99.99%' },
    { value: 72, label: 'Risk Score', format: '', trend: 'up', ringColor: '#fb923c', color: 'text-orange-400', subtitle: 'Aggregate risk index', detail: 'Threshold: 80 critical' },
  ],
  gauges: [
    { label: 'API Latency', value: 42, threshold: 200, unit: 'ms', max: 200, description: 'P99 response time across all endpoints' },
    { label: 'Error Rate', value: 0.3, threshold: 1, unit: '%', max: 1, description: 'Percentage of failed requests' },
    { label: 'CPU Utilization', value: 67, threshold: 90, unit: '%', max: 100, description: 'Aggregate CPU across cluster nodes' },
    { label: 'Memory Usage', value: 81, threshold: 90, unit: '%', max: 100, description: 'Total memory consumption' },
  ],
  gaugeHistory: [
    { data: [38, 42, 40, 45, 43, 48, 42, 39, 44, 42], color: '#22d3ee' },
    { data: [0.2, 0.25, 0.18, 0.3, 0.22, 0.28, 0.35, 0.3, 0.27, 0.3], color: '#34d399' },
    { data: [72, 68, 65, 70, 67, 63, 69, 66, 71, 67], color: '#fbbf24' },
    { data: [78, 82, 79, 85, 81, 77, 83, 80, 86, 81], color: '#fb923c' },
  ],
  heatmap: {
    phases: ['Design', 'Implementation', 'Testing', 'Deployment', 'Post-Release'],
    severities: ['Critical', 'High', 'Medium', 'Low'],
    cells: [
      [30, 65, 45, 20],
      [75, 85, 55, 35],
      [45, 60, 70, 40],
      [85, 70, 50, 25],
      [60, 45, 35, 15],
    ],
    descriptions: [
      ['Architecture review phase', 'Component design approval', 'API contract validation', 'Resource planning signoff'],
      ['Core logic implementation', 'Integration development', 'Database migration scripts', 'Configuration management'],
      ['Unit test coverage analysis', 'Integration test results', 'E2E test pass rate', 'Performance benchmark results'],
      ['Canary deployment metrics', 'Blue-green transition state', 'Rollback procedure readiness', 'Smoke test results'],
      ['Monitoring dashboard validation', 'Alert threshold tuning', 'Incident response drills', 'SLA compliance tracking'],
    ],
  },
  alerts: [
    { time: '14:23:15', severity: 'critical', service: 'Payment Service', message: 'Error rate spike >5% on payment endpoint ï¿½ circuit breaker nearing threshold', status: 'acknowledged', duration: '4m 12s', source: 'Auto-Detect' },
    { time: '14:21:02', severity: 'medium', service: 'Redis Cache', message: 'Memory usage exceeding 85% ï¿½ eviction policy may trigger cascading failures', status: 'triggered', duration: '6m 30s', source: 'Threshold Alert' },
    { time: '14:18:44', severity: 'critical', service: 'Billing Service', message: 'Invoice generation latency >30s ï¿½ downstream dependency degraded', status: 'triggered', duration: '8m 15s', source: 'SLO Monitor' },
    { time: '14:15:30', severity: 'high', service: 'API Gateway', message: 'P99 latency increased by 200ms ï¿½ rate limiting engaged', status: 'acknowledged', duration: '3m 48s', source: 'Latency Alert' },
    { time: '14:12:08', severity: 'high', service: 'Notification Service', message: 'Email delivery queue backlog 12k messages ï¿½ retry flooding detected', status: 'triggered', duration: '10m 22s', source: 'Queue Monitor' },
    { time: '14:08:55', severity: 'medium', service: 'Database', message: 'Connection pool utilization 78% ï¿½ scaling threshold 80% imminent', status: 'resolved', duration: '15m 05s', source: 'Pool Monitor' },
    { time: '14:05:20', severity: 'critical', service: 'Payment Service', message: 'Webhook delivery failure rate 15% ï¿½ provider connectivity issue detected', status: 'triggered', duration: '2m 45s', source: 'Webhook Monitor' },
    { time: '14:01:10', severity: 'low', service: 'CDN', message: 'Edge cache hit rate dropped to 82% ï¿½ origin warmup in progress', status: 'resolved', duration: '7m 33s', source: 'Cache Analyzer' },
  ],
  services: [
    { name: 'Payment Service', status: 'healthy', uptime: 99.97, trend: [40, 42, 38, 45, 50, 48, 52, 55, 53, 58], responseTime: '42ms', color: '#34d399', pods: 12, region: 'us-east-1' },
    { name: 'Auth Service', status: 'healthy', uptime: 99.99, trend: [60, 58, 62, 65, 63, 68, 72, 70, 75, 78], responseTime: '18ms', color: '#22d3ee', pods: 8, region: 'us-west-2' },
    { name: 'Database', status: 'healthy', uptime: 99.95, trend: [80, 78, 82, 79, 85, 82, 80, 84, 86, 83], responseTime: '8ms', color: '#34d399', pods: 6, region: 'eu-west-1' },
    { name: 'Redis Cache', status: 'degraded', uptime: 98.41, trend: [70, 65, 60, 55, 48, 45, 42, 38, 35, 32], responseTime: '3ms', color: '#fbbf24', pods: 4, region: 'us-east-1' },
    { name: 'Message Queue', status: 'healthy', uptime: 99.88, trend: [30, 35, 32, 40, 38, 42, 45, 48, 44, 50], responseTime: '12ms', color: '#34d399', pods: 5, region: 'eu-west-1' },
    { name: 'CDN', status: 'healthy', uptime: 100.0, trend: [90, 88, 92, 87, 93, 91, 94, 89, 95, 97], responseTime: '5ms', color: '#a78bfa', pods: 20, region: 'global' },
  ],
  deployments: [
    { service: 'payment-api', version: 'v2.1.0', env: 'production', status: 'success', time: '14:15', author: '@alice', commit: 'a3f8e2d', duration: '4m 22s', rollback: false },
    { service: 'auth-service', version: 'v1.8.3', env: 'staging', status: 'running', time: '14:22', author: '@bob', commit: 'b7c1a4f', duration: '1m 15s', rollback: false },
    { service: 'billing-worker', version: 'v3.0.1', env: 'production', status: 'fail', time: '13:58', author: '@carol', commit: 'd9e5f2a', duration: '0m 48s', rollback: true },
    { service: 'notification-svc', version: 'v1.4.0', env: 'staging', status: 'success', time: '13:45', author: '@alice', commit: 'e2f8b1c', duration: '3m 10s', rollback: false },
    { service: 'redis-cluster', version: 'v6.2.8', env: 'production', status: 'running', time: '14:05', author: '@bob', commit: 'f1a3c6e', duration: '2m 33s', rollback: false },
    { service: 'api-gateway', version: 'v4.2.1', env: 'production', status: 'success', time: '13:30', author: '@dave', commit: 'c4d7e9b', duration: '5m 01s', rollback: false },
  ],
  sprintVelocity: [
    { week: 'W-5', points: 124, commits: 87, prs: 14, deploys: 8 },
    { week: 'W-4', points: 148, commits: 102, prs: 18, deploys: 11 },
    { week: 'W-3', points: 112, commits: 76, prs: 11, deploys: 6 },
    { week: 'W-2', points: 166, commits: 118, prs: 22, deploys: 14 },
    { week: 'W-1', points: 139, commits: 94, prs: 16, deploys: 9 },
    { week: 'W', points: 157, commits: 108, prs: 20, deploys: 12 },
  ],
  activityTimeline: [
    { time: '14:23', actor: '@alice', action: 'deployed', target: 'payment-api', outcome: 'success', detail: 'v2.1.0 \u2192 production (canary 10% / 5min observation)' },
    { time: '14:18', actor: '@bob', action: 'merged', target: 'auth-service', outcome: 'success', detail: 'PR #342 \u2014 OAuth token rotation fix (3 approvals, 1 change requested)' },
    { time: '14:12', actor: '@carol', action: 'reviewed', target: 'billing-worker', outcome: 'success', detail: 'Code review PR #345 \u2014 3 approvals, 0 change requests' },
    { time: '14:05', actor: '@sentry', action: 'alerted', target: 'payment-api', outcome: 'warning', detail: 'Error rate >5% on /v1/charges \u2014 auto-rollback triggered' },
    { time: '13:58', actor: '@carol', action: 'deployed', target: 'billing-worker', outcome: 'fail', detail: 'v3.0.1 \u2014 deployment failed at health check phase (timeout)' },
    { time: '13:50', actor: '@dave', action: 'merged', target: 'api-gateway', outcome: 'success', detail: 'PR #340 \u2014 rate limiter configuration update (2 approvals)' },
    { time: '13:45', actor: '@alice', action: 'deployed', target: 'notification-svc', outcome: 'success', detail: 'v1.4.0 \u2192 staging for QA validation cycle' },
    { time: '13:38', actor: '@bob', action: 'reviewed', target: 'redis-cluster', outcome: 'success', detail: 'Code review PR #338 \u2014 cluster config update (2 approvals)' },
  ],
  predictions: [
    { title: 'Incident Probability', value: 82, unit: '%', timeframe: 'next 24h', confidence: 'High', recommendation: 'Prepare runbook for payment service degradation scenario', severity: 'critical', icon: 'alert-triangle', factors: ['Circuit breaker threshold', 'Memory pressure'] },
    { title: 'Deployment Risk', value: 'Moderate', unit: '', timeframe: 'current window', confidence: 'Medium', recommendation: 'Proceed with caution \u2014 monitor billing worker rollout closely', severity: 'medium', icon: 'shield-alert', factors: ['Failed prior deploy', 'Dependency instability'] },
    { title: 'System Degradation Risk', value: 'Low', unit: '', timeframe: 'next 48h', confidence: 'High', recommendation: 'No action required \u2014 all systems operating within parameters', severity: 'low', icon: 'check-circle', factors: ['Stable metrics', 'Healthy dependencies'] },
  ],
  businessImpact: [
    { label: 'Cost of Downtime', value: 4500, prefix: '$', suffix: '/min', format: true, color: 'text-red-400', icon: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z', barMax: 5000 },
    { label: 'Revenue at Risk', value: 202500, prefix: '$', suffix: '', format: true, color: 'text-amber-400', icon: 'M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z', barMax: 250000 },
    { label: 'Customer Impact', value: 15000, prefix: '', suffix: ' users', format: true, color: 'text-cyan-400', icon: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z', barMax: 20000 },
    { label: 'SLA Credits at Risk', value: 12000, prefix: '$', suffix: '', format: true, color: 'text-red-400', icon: 'M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z', barMax: 15000 },
  ],
  incidentsByService: [
    { service: 'Payment Service', count: 4, trend: 'up', severity: 'critical' },
    { service: 'Billing Service', count: 2, trend: 'up', severity: 'high' },
    { service: 'API Gateway', count: 3, trend: 'stable', severity: 'medium' },
    { service: 'Redis Cache', count: 1, trend: 'down', severity: 'medium' },
    { service: 'Notification Svc', count: 2, trend: 'up', severity: 'low' },
    { service: 'Database', count: 0, trend: 'down', severity: 'low' },
  ],
  onCall: { primary: '@alice', secondary: '@bob', escalation: '@carol', coverage: '24h', shiftRemaining: '4h 22m', lastHandoff: '10:00 UTC' },
  changeFailureRate: [
    { week: 'W-5', rate: 12.5, deploys: 8 },
    { week: 'W-4', rate: 8.3, deploys: 11 },
    { week: 'W-3', rate: 16.7, deploys: 6 },
    { week: 'W-2', rate: 7.1, deploys: 14 },
    { week: 'W-1', rate: 11.1, deploys: 9 },
    { week: 'W', rate: 6.3, deploys: 12 },
  ],
  slos: [
    { name: 'Payment API Availability', slo: 99.95, actual: 99.97, status: 'attaining', color: '#34d399' },
    { name: 'Auth API Latency P99', slo: 200, actual: 180, unit: 'ms', status: 'attaining', color: '#22d3ee' },
    { name: 'Billing Error Rate', slo: 0.5, actual: 0.3, unit: '%', status: 'attaining', color: '#34d399' },
    { name: 'Notification Delivery', slo: 99.9, actual: 99.82, status: 'warning', color: '#fbbf24' },
    { name: 'API Gateway Uptime', slo: 99.99, actual: 99.99, status: 'attaining', color: '#34d399' },
    { name: 'Database Query Time', slo: 100, actual: 85, unit: 'ms', status: 'attaining', color: '#a78bfa' },
  ],
  dailyBriefing: {
    greeting: 'Good morning, Executive.',
    body: 'Orbit analyzed 847 deployments this period. Detected 3 emerging risks. Predicted 1 likely service degradation. Recommended 4 engineering actions.',
    analyzed: '847 deployments',
    accuracy: '96%',
    savings: '$288,000',
    confidence: 96,
  },
  executiveInsights: [
    { id: 1, title: 'Payment Service risk increased 18% in 2 hours', impact: '$202K potential exposure', confidence: '93%', action: 'Scale worker pool \u2014 12 additional pods recommended', severity: 'critical' },
    { id: 2, title: 'Redis memory trend predicts cache instability within 6h', impact: '$85K potential exposure', confidence: '89%', action: 'Increase maxmemory-policy and provision cluster', severity: 'high' },
    { id: 3, title: 'Billing Service deployment risk rising \u2014 dependency timeout detected', impact: '$120K potential exposure', confidence: '92%', action: 'Hold deployment pipeline \u2014 investigate DB connection pool', severity: 'high' },
  ],
  businessImpactCenter: [
    { label: 'Revenue Exposure', value: 202500, prefix: '$', suffix: '', trend: 'up', pct: 12, description: 'Quarterly at-risk revenue', color: 'text-red-400', barColor: 'bg-red-500/80', dotColor: 'bg-red-500' },
    { label: 'Customer Impact', value: 15000, prefix: '', suffix: ' users', trend: 'up', pct: 8, description: 'Affected user base', color: 'text-cyan-400', barColor: 'bg-cyan-500/80', dotColor: 'bg-cyan-500' },
    { label: 'SLA Risk', value: 12000, prefix: '$', suffix: '', trend: 'down', pct: 3, description: 'Credits at risk', color: 'text-amber-400', barColor: 'bg-amber-500/80', dotColor: 'bg-amber-500' },
    { label: 'Brand Impact', value: 72, prefix: '', suffix: '/100', trend: 'down', pct: 5, description: 'Reputation index', color: 'text-violet-400', barColor: 'bg-violet-500/80', dotColor: 'bg-violet-500' },
    { label: 'Operational Risk', value: 68, prefix: '', suffix: '/100', trend: 'up', pct: 15, description: 'Aggregate ops risk', color: 'text-orange-400', barColor: 'bg-orange-500/80', dotColor: 'bg-orange-500' },
  ],
  aiPredictions: [
    { title: '24h Forecast', value: 82, unit: '%', description: 'Probability of stable operations', trend: 'declining', color: '#fbbf24', textColor: 'text-amber-400', sparkData: [88, 86, 85, 83, 82, 81], factors: ['Circuit breaker', 'Memory pressure', 'Error rate'] },
    { title: '7 Day Forecast', value: 74, unit: '%', description: 'Medium-term reliability outlook', trend: 'declining', color: '#fb923c', textColor: 'text-orange-400', sparkData: [82, 80, 78, 76, 75, 74], factors: ['Deployment risk', 'Dependency health', 'Capacity'] },
    { title: '30 Day Forecast', value: 68, unit: '%', description: 'Long-term degradation risk', trend: 'declining', color: '#ef4444', textColor: 'text-red-400', sparkData: [76, 74, 72, 70, 69, 68], factors: ['Architecture debt', 'Scaling limits', 'Tech refresh'] },
    { title: 'Overall Confidence', value: 91, unit: '%', description: 'ML model prediction accuracy', trend: 'stable', color: '#22d3ee', textColor: 'text-cyan-400', sparkData: [90, 91, 90, 91, 92, 91], factors: ['Data quality', 'Model drift', 'Feature coverage'] },
  ],
  topRisks: [
    { rank: 1, service: 'Payment Service', riskScore: 92, impact: 202000, impactLabel: '$202K', failureProbability: 87, status: 'Critical' },
    { rank: 2, service: 'Redis Cache', riskScore: 78, impact: 85000, impactLabel: '$85K', failureProbability: 72, status: 'Warning' },
    { rank: 3, service: 'Billing Service', riskScore: 74, impact: 120000, impactLabel: '$120K', failureProbability: 65, status: 'Warning' },
    { rank: 4, service: 'API Gateway', riskScore: 62, impact: 45000, impactLabel: '$45K', failureProbability: 48, status: 'Elevated' },
    { rank: 5, service: 'Notification Svc', riskScore: 45, impact: 28000, impactLabel: '$28K', failureProbability: 35, status: 'Monitor' },
    { rank: 6, service: 'Database', riskScore: 32, impact: 15000, impactLabel: '$15K', failureProbability: 22, status: 'Stable' },
  ],
  rootCauses: [
    { id: 'RC-001', service: 'Payment Service', cause: 'Circuit breaker saturation triggered by Redis dependency timeout cascading to payment endpoint', duration: '4h 22m', confidence: '95%', impact: 'Critical', sparkData: [82, 78, 75, 72, 68, 65] },
    { id: 'RC-002', service: 'Billing Service', cause: 'Database connection pool exhaustion on billing-worker causing transaction failures and timeouts', duration: '2h 15m', confidence: '89%', impact: 'High', sparkData: [45, 48, 52, 55, 58, 62] },
    { id: 'RC-003', service: 'Redis Cache', cause: 'Memory pressure from eviction policy triggering during peak load windows causing cache misses', duration: '1h 48m', confidence: '92%', impact: 'High', sparkData: [70, 68, 65, 62, 58, 55] },
  ],
  executiveRecommendations: {
    immediate: { title: 'Immediate Actions (24h)', items: ['Scale Payment worker pool (+12 pods)', 'Increase Redis maxmemory (8GB -> 16GB)', 'Hold Billing Service deploys'], impact: '$202K risk reduction', savings: '$45K', confidence: '92%' },
    nextSprint: { title: 'Next Sprint Actions', items: ['Redis Cluster migration (3 shards)', 'Database connection pool optimization', 'Payment circuit breaker tuning'], impact: '$120K risk reduction', savings: '$85K', confidence: '89%' },
    strategic: { title: 'Strategic Actions (30 days)', items: ['Service mesh implementation', 'Automated failover testing', 'Dependency health monitoring'], impact: '$400K risk reduction', savings: '$288K', confidence: '87%' },
  },
  systemTopology: [
    { name: 'api-gateway-01', service: 'API Gateway', status: 'healthy', details: 'us-east-1a, 8 pods, 2.4k req/s', cpu: 52 },
    { name: 'payment-svc-01', service: 'Payment Service', status: 'degraded', details: 'us-east-1b, 12 pods, 1.8k req/s', cpu: 78 },
    { name: 'auth-svc-01', service: 'Auth Service', status: 'healthy', details: 'us-west-2a, 8 pods, 0.9k req/s', cpu: 38 },
    { name: 'billing-svc-01', service: 'Billing Service', status: 'degraded', details: 'us-east-1c, 6 pods, 0.5k req/s', cpu: 85 },
    { name: 'notification-01', service: 'Notification Svc', status: 'healthy', details: 'us-east-1a, 4 pods, 0.3k req/s', cpu: 41 },
    { name: 'database-p-01', service: 'Database', status: 'healthy', details: 'eu-west-1a, 6 nodes, 4.5k conn', cpu: 64 },
    { name: 'redis-c-01', service: 'Redis Cache', status: 'degraded', details: 'us-east-1a, 4 shards, 82% mem', cpu: 91 },
    { name: 'cdn-edge-01', service: 'CDN', status: 'healthy', details: 'global, 20 PoPs, 15Gbps', cpu: 32 },
  ],
  deploymentForecast: [
    { day: 'Mon', value: '12', pct: 85, events: 12 },
    { day: 'Tue', value: '15', pct: 92, events: 15 },
    { day: 'Wed', value: '10', pct: 72, events: 10 },
    { day: 'Thu', value: '18', pct: 96, events: 18 },
    { day: 'Fri', value: '8', pct: 58, events: 8 },
    { day: 'Sat', value: '3', pct: 25, events: 3 },
    { day: 'Sun', value: '2', pct: 18, events: 2 },
  ],
  boardroomView: {
    ctoShouldKnow: { title: 'What the CTO Should Know Today', icon: 'M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z', items: ['Payment Service error rate exceeded 5% threshold â€” circuit breaker at 72%', 'Redis memory pressure expected to trigger eviction within 6 hours', 'Billing Service deployment failed â€” rollback completed'] },
    requiresAttention: { title: 'What Requires Attention (24h)', icon: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z', items: ['Approve emergency scaling for Payment worker pool', 'Review Redis cluster migration proposal', 'Authorize DB connection pool increase'] },
    canWait: { title: 'What Can Wait (This Week)', icon: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z', items: ['API Gateway rate limit configuration update', 'Notification service queue optimization', 'CDN cache warming schedule adjustment'] },
    highestROI: { title: 'What Creates the Highest ROI', icon: 'M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z', items: ['Service mesh implementation â€” projected $400K annual savings', 'Automated failover testing â€” reduces MTTR by 60%', 'Dependency health monitoring â€” prevents 85% of cascading failures'] },
  },
  recommendations: [
    { id: 1, priority: 'critical', title: 'Scale Payment Worker Pool', description: 'Scale Payment worker pool by 12 additional pods to handle increased load and prevent circuit breaker saturation.', confidence: '92%', impact: '$202K risk reduction' },
    { id: 2, priority: 'high', title: 'Increase Redis Memory Limit', description: 'Increase Redis maxmemory from 8GB to 16GB to prevent eviction policy triggering during peak loads.', confidence: '89%', impact: '$85K risk reduction' },
    { id: 3, priority: 'high', title: 'Hold Billing Deployments', description: 'Hold Billing Service deployment pipeline until DB connection pool issue is investigated and resolved.', confidence: '95%', impact: '$120K risk reduction' },
    { id: 4, priority: 'medium', title: 'Migrate to Redis Cluster', description: 'Plan migration to Redis Cluster with 3 shards to improve memory management and fault tolerance.', confidence: '87%', impact: '$60K risk reduction' },
    { id: 5, priority: 'medium', title: 'Optimize Database Pool', description: 'Increase database connection pool size from 10 to 25 for the billing-worker service.', confidence: '91%', impact: '$45K risk reduction' },
  ],
  topRisksLeaderboard: [
    { id: 'TR-001', title: 'Payment circuit breaker saturation critical', service: 'Payment Service', severity: 'critical', score: 92, impact: '$202K potential revenue loss' },
    { id: 'TR-002', title: 'Redis memory pressure eviction imminent', service: 'Redis Cache', severity: 'high', score: 78, impact: '$85K SLA credit exposure' },
    { id: 'TR-003', title: 'Billing worker DB pool exhaustion', service: 'Billing Service', severity: 'high', score: 74, impact: '$120K billing revenue at risk' },
    { id: 'TR-004', title: 'API Gateway P99 latency degradation', service: 'API Gateway', severity: 'medium', score: 62, impact: '$45K customer impact' },
    { id: 'TR-005', title: 'Notification queue backlog growth', service: 'Notification Svc', severity: 'medium', score: 45, impact: '$28K operational overhead' },
    { id: 'TR-006', title: 'Database connection pressure', service: 'Database', severity: 'low', score: 32, impact: '$15K infrastructure risk' },
  ],
  boardroomMetrics: [
    { label: 'Revenue', value: '$12.4M', prefix: '', suffix: '', color: 'text-emerald-400', dot: '#34d399', trend: 'up', pct: 3.2, change: '+$384K vs forecast' },
    { label: 'Cost Savings', value: '$1.8M', prefix: '', suffix: '', color: 'text-cyan-400', dot: '#22d3ee', trend: 'up', pct: 5.7, change: 'YTD operational savings' },
    { label: 'SLA Attainment', value: '99.97', prefix: '', suffix: '%', color: 'text-emerald-400', dot: '#34d399', trend: 'up', pct: 0.5, change: 'Above 99.95% target' },
    { label: 'Engineering Velocity', value: '157', prefix: '', suffix: ' pts', color: 'text-violet-400', dot: '#8b5cf6', trend: 'up', pct: 12.9, change: 'Sprint-over-sprint growth' },
    { label: 'Customer Churn', value: '2.1', prefix: '', suffix: '%', color: 'text-amber-400', dot: '#f59e0b', trend: 'down', pct: 0.3, change: 'Below 2.5% threshold' },
    { label: 'MTTR', value: '24', prefix: '', suffix: 'm', color: 'text-rose-400', dot: '#f43f5e', trend: 'down', pct: 14.3, change: 'Reduced from 35m average' },
  ],

  aiRiskMetrics: [
    { label: 'Overall Risk Score', value: 72, prefix: '', suffix: '', color: 'text-orange-400', dot: 'bg-orange-500', trend: 'up', pct: 8 },
    { label: 'Threat Count', value: 12, prefix: '', suffix: '', color: 'text-red-400', dot: 'bg-red-500', trend: 'up', pct: 20 },
    { label: 'Risk Reduction', value: 34, prefix: '', suffix: '%', color: 'text-emerald-400', dot: 'bg-emerald-500', trend: 'up', pct: 5 },
    { label: 'Detection Rate', value: 96, prefix: '', suffix: '%', color: 'text-cyan-400', dot: 'bg-cyan-500', trend: 'up', pct: 2 },
  ],
  serviceHealthCards: [
    { name: 'Payment Service', status: 'healthy', uptime: 99.97, trend: [40, 42, 38, 45, 50, 48, 52, 55, 53, 58], responseTime: '42ms', color: '#34d399', pods: 12, region: 'us-east-1' },
    { name: 'Auth Service', status: 'healthy', uptime: 99.99, trend: [60, 58, 62, 65, 63, 68, 72, 70, 75, 78], responseTime: '18ms', color: '#22d3ee', pods: 8, region: 'us-west-2' },
    { name: 'Database', status: 'healthy', uptime: 99.95, trend: [80, 78, 82, 79, 85, 82, 80, 84, 86, 83], responseTime: '8ms', color: '#34d399', pods: 6, region: 'eu-west-1' },
    { name: 'Redis Cache', status: 'degraded', uptime: 98.41, trend: [70, 65, 60, 55, 48, 45, 42, 38, 35, 32], responseTime: '3ms', color: '#fbbf24', pods: 4, region: 'us-east-1' },
    { name: 'Message Queue', status: 'healthy', uptime: 99.88, trend: [30, 35, 32, 40, 38, 42, 45, 48, 44, 50], responseTime: '12ms', color: '#34d399', pods: 5, region: 'eu-west-1' },
    { name: 'CDN', status: 'healthy', uptime: 100.0, trend: [90, 88, 92, 87, 93, 91, 94, 89, 95, 97], responseTime: '5ms', color: '#a78bfa', pods: 20, region: 'global' },
    { name: 'Monitoring Stack', status: 'healthy', uptime: 99.93, trend: [85, 87, 86, 88, 90, 89, 91, 92, 91, 93], responseTime: '22ms', color: '#34d399', pods: 6, region: 'us-east-2' },
    { name: 'Search Service', status: 'degraded', uptime: 98.72, trend: [65, 62, 58, 55, 52, 50, 48, 45, 43, 42], responseTime: '95ms', color: '#fbbf24', pods: 4, region: 'us-west-2' },
  ],
  sectionInsights: [
    { id: 'si-1', section: 'executive', text: 'Executive summary shows 3 critical findings requiring immediate board attention. Payment Service circuit breaker saturation is the highest priority risk with $202K potential revenue exposure. Recommend emergency review session.', severity: 'critical' },
    { id: 'si-2', section: 'predictions', text: 'AI predictions indicate a 7.3% week-over-week degradation in system reliability. The 30-day forecast shows increasing probability of cascading failures in the Payment-Billing dependency chain.', severity: 'high' },
    { id: 'si-3', section: 'topology', text: 'Live topology scan reveals 2 degraded nodes (Payment Service, Redis Cache) and 1 critical node (Billing Service dependency chain). Service mesh implementation recommended to reduce blast radius.', severity: 'high' },
    { id: 'si-4', section: 'deployments', text: 'Deployment velocity is up 12.9% this sprint, but change failure rate has increased to 6.3%. Rollback probability is trending down suggesting improved deployment practices.', severity: 'medium' },
    { id: 'si-5', section: 'boardroom', text: 'Boardroom metrics show strong revenue growth at $12.4M (+3.2%) and SLA attainment at 99.97%. MTTR reduced 14.3% to 24 minutes through automated runbook adoption.', severity: 'low' },
  ],
}
mockData.aiConfidenceIndicators = {
  briefing: 96,
  executiveInsights: [93, 89, 92],
  predictions: [91, 89, 87, 93],
  riskScores: [96, 88, 91, 85, 79, 82],
  recommendations: [92, 89, 87],
  rootCauses: [95, 89, 92],
  forecasts: [91, 87, 85, 93],
}
mockData.refreshIntervals = {
  briefing: '30s',
  executiveSummary: '30s',
  liveMetrics: '10s',
  alerts: '5s',
  topology: '15s',
  predictions: '60s',
  riskLeaderboard: '120s',
}
mockData.lastAnalysis = {
  briefing: '14:24:00 UTC',
  executiveInsights: '14:23:15 UTC',
  riskLeaderboard: '14:22:30 UTC',
  predictions: '14:20:00 UTC',
  recommendations: '14:18:45 UTC',
}
mockData.briefingStats = {
  totalDeployments: 847,
  emergingRisks: 3,
  predictedDegradations: 1,
  recommendedActions: 4,
  riskDetectionAccuracy: 96,
  potentialSavings: 288000,
  meanTimeToDetection: '4.2m',
  meanTimeToResolution: '18.7m',
  servicesScanned: 47,
  dataPointsProcessed: '2.4M',
  mlModelVersion: 'v4.2.1',
  lastTrainingCycle: '3 hours ago',
}
mockData.executiveSummaryExpanded = {
  revenueProtected: '$2.4M',
  incidentsPrevented: 18,
  automatedActions: 47,
  manualInterventions: 12,
  aiAccuracy: '96.8%',
  systemReliability: '99.97%',
  meanTimeToAcknowledge: '48s',
  meanTimeToResolve: '18.7m',
}
mockData.riskTrends = {
  weekOverWeek: { current: 72, previous: 68, change: '+5.9%' },
  monthOverMonth: { current: 72, previous: 58, change: '+24.1%' },
  quarterOverQuarter: { current: 72, previous: 45, change: '+60.0%' },
  projectedNextWeek: 78,
  projectedNextMonth: 85,
}
mockData.costAnalysis = {
  currentBurnRate: 4500,
  projectedMonthlyBurn: 135000,
  annualizedRiskExposure: 1620000,
  riskMitigationSavings: 288000,
  roifromActions: '5.3x',
  breakEvenHorizon: '12 days',
}
mockData.dependencyGraph = {
  criticalPaths: 3,
  upstreamDependencies: 47,
  downstreamDependents: 128,
  singlePointsOfFailure: 2,
  redundancyCoverage: '84%',
  faultToleranceScore: '72/100',
}

const container = { hidden: {}, show: { transition: { staggerChildren: 0.02 } } }
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }

function Timestamp() {
  const [time, setTime] = useState(new Date())
  useEffect(() => { const i = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(i) }, [])
  return <span className="font-mono text-[10px] text-cyan-400/70">{time instanceof Date && !isNaN(time) ? time.toISOString().replace('T', ' ').slice(0, 19) : '---'}Z</span>
}

function useCounter(target, delay = 0, duration = 1500, format = false) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (target === undefined || target === null || isNaN(target)) return
    const t = setTimeout(() => {
      const steps = 40; const inc = target / steps; let cur = 0
      const i = setInterval(() => { cur += inc; if (cur >= target) { setVal(target); clearInterval(i) } else setVal(Math.floor(cur)) }, duration / steps)
      return () => clearInterval(i)
    }, delay)
    return () => clearTimeout(t)
  }, [target, delay, duration])
  return format && target >= 1000 ? val.toLocaleString() : val
}

function MiniSparkline({ data, color = '#34d399', width = 56, height = 16 }) {
  if (!data || !Array.isArray(data) || data.length < 2) return <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="shrink-0" />
  const max = Math.max(...data); const min = Math.min(...data); const range = max - min || 1
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * width},${height - ((v - min) / range) * height}`).join(' ')
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="shrink-0">
      <polyline fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" points={pts} />
    </svg>
  )
}

function MiniGaugeSparkline({ data, color = '#22d3ee' }) {
  if (!data || !Array.isArray(data) || data.length < 2) return <svg width={32} height={8} viewBox="0 0 32 8" className="shrink-0 opacity-40" />
  const w = 32; const h = 8
  const max = Math.max(...data); const min = Math.min(...data); const range = max - min || 1
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(' ')
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="shrink-0 opacity-40">
      <polyline fill="none" stroke={color} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" points={pts} />
    </svg>
  )
}

function AnimatedKPI({ kpi, idx }) {
  if (!kpi) return null
  const count = useCounter(kpi.value ?? 0, idx * 80, 1500, (kpi.format || '') === '$$$')
  const circumference = 2 * Math.PI * 22
  const pct = Math.min((kpi.value / ((kpi.label || '') === 'Uptime' ? 10000 : 100)) * 100, 100)
  const offset = circumference - (pct / 100) * circumference
  const trendIcon = kpi.trend === 'up' ? '\u2191' : kpi.trend === 'down' ? '\u2193' : '\u2192'
  const trendColor = kpi.trend === 'up' ? 'text-red-400' : kpi.trend === 'down' ? 'text-emerald-400' : 'text-slate-500'
  const displayVal = typeof count === 'string' ? count : count
  const finalDisplay = (kpi.label || '') === 'Uptime' ? '99.97' : displayVal
  const finalSuffix = (kpi.label || '') === 'Uptime' ? '%' : (kpi.format || '') === '%%' ? '%' : (kpi.format || '') === 'm' ? 'm' : (kpi.format || '') === '$$$' ? '' : (kpi.format || '')
  const ringPct = Math.round(pct || 0)
  return (
    <motion.div variants={item} className="relative overflow-hidden rounded-xl border border-white/[0.06] bg-gradient-to-br from-slate-900 to-slate-900/50 p-3 sm:p-4 group hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300">
      <div className="flex items-center gap-3">
        <div className="relative shrink-0">
          <svg className="w-12 h-12 sm:w-14 sm:h-14 -rotate-90" viewBox="0 0 52 52">
            <circle cx="26" cy="26" r="22" fill="none" stroke="#1e293b" strokeWidth="4" />
            <motion.circle cx="26" cy="26" r="22" fill="none" stroke={kpi.ringColor || '#22c55e'} strokeWidth="4" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} initial={{ strokeDashoffset: circumference }} animate={{ strokeDashoffset: offset }} transition={{ duration: 1.2, delay: idx * 0.08, ease: 'easeOut' }} />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[8px] font-mono text-slate-500">{ringPct}%</span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className={`text-xl sm:text-2xl font-bold font-mono tracking-tight ${kpi.color || 'text-white'}`}>
              {finalDisplay}{finalSuffix}
            </span>
            <span className={`text-xs font-mono ${trendColor}`}>{trendIcon}</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5 tracking-wide uppercase truncate">{kpi.label}</div>
          <div className="text-[8px] text-slate-600/70 mt-0.5 truncate">{kpi.subtitle}</div>
        </div>
      </div>
      <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-emerald-500/5 blur-2xl group-hover:bg-emerald-500/10 transition-all duration-500" />
    </motion.div>
  )
}

function AnimatedGauge({ gauge, history, idx }) {
  if (!gauge) return null
  const [animPct, setAnimPct] = useState(0)
  const pctThreshold = gauge.max > 0 ? (Math.min(gauge.value, gauge.max) / gauge.max) * 100 : 0
  const ratio = Math.min(pctThreshold, 100) / 100
  const circumference = 2 * Math.PI * 36
  const offset = circumference - (animPct / 100) * circumference * ratio
  useEffect(() => { const t = setTimeout(() => setAnimPct(100), idx * 120); return () => clearTimeout(t) }, [idx])
  const color = pctThreshold < 60 ? '#34d399' : pctThreshold < 85 ? '#fbbf24' : '#f87171'
  const textColor = pctThreshold < 60 ? 'text-emerald-400' : pctThreshold < 85 ? 'text-amber-400' : 'text-red-400'
  const statusLabel = pctThreshold < 60 ? 'Normal' : pctThreshold < 85 ? 'Warning' : 'Critical'
  const histColor = pctThreshold < 60 ? '#34d399' : pctThreshold < 85 ? '#fbbf24' : '#f87171'
  return (
    <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-gradient-to-br from-slate-900 to-slate-900/50 p-3 sm:p-4 flex flex-col items-center group hover:border-cyan-500/30 transition-all duration-300">
      <div className="relative flex flex-col items-center">
        <svg className="w-20 h-20 sm:w-24 sm:h-24 -rotate-90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="36" fill="none" stroke="#1e293b" strokeWidth="5" />
          <motion.circle cx="40" cy="40" r="36" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} initial={{ strokeDashoffset: circumference }} animate={{ strokeDashoffset: offset }} transition={{ duration: 1.2, delay: idx * 0.12, ease: 'easeOut' }} />
          <circle cx="40" cy="40" r="36" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" strokeDasharray={circumference * ratio} strokeDashoffset={circumference} opacity="0.15" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-lg sm:text-xl font-bold font-mono leading-none ${textColor}`}>
            {gauge.value}<span className="text-[10px] text-slate-500">/{gauge.threshold}{gauge.unit}</span>
          </span>
          <span className={`text-[8px] font-mono mt-0.5 ${textColor}/70`}>{statusLabel}</span>
        </div>
      </div>
      <span className="text-[9px] font-mono text-slate-600 mt-1 uppercase tracking-wide">{gauge.label}</span>
      <div className="flex items-center gap-2 mt-1.5 w-full justify-center">
        <MiniGaugeSparkline data={history} color={histColor} />
        <span className="text-[8px] font-mono text-slate-700">10 min</span>
      </div>
      <span className="text-[8px] text-slate-700/60 text-center mt-0.5 px-1 hidden sm:block">{gauge.description}</span>
    </motion.div>
  )
}
function MiniGauge({ value = 0, suffix = '', danger = false, warn = false, width = 40, height = 16, fontSize = 5, strokeWidth = 2 }) {
  const [animPct, setAnimPct] = useState(0)
  const pct = Math.min(value, 100)
  useEffect(() => {
    const t = setTimeout(() => setAnimPct(pct), 200)
    return () => clearTimeout(t)
  }, [pct])
  const color = danger ? '#f87171' : warn ? '#fbbf24' : '#34d399'
  const textColor = danger ? 'text-red-400' : warn ? 'text-amber-400' : 'text-emerald-400'
  const circumference = 2 * Math.PI * (height / 2 - strokeWidth / 2)
  const r = height / 2 - strokeWidth / 2
  const cx = width / 2
  const cy = height / 2
  const offset = circumference - (animPct / 100) * circumference
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="shrink-0">
      <text x={2} y={height - 2} fontSize={fontSize} fill="#64748b" fontFamily="monospace">{pct}{suffix}</text>
      <circle cx={width - 6} cy={height / 2} r={r} fill="none" stroke="#1e293b" strokeWidth={strokeWidth} />
      <motion.circle cx={width - 6} cy={height / 2} r={r} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} initial={{ strokeDashoffset: circumference }} animate={{ strokeDashoffset: offset }} transition={{ duration: 1, ease: 'easeOut' }} />
    </svg>
  )
}
function RiskHeatmap() {
  const [reveal, setReveal] = useState(false)
  const [hovered, setHovered] = useState(null)
  useEffect(() => { const t = setTimeout(() => setReveal(true), 200); return () => clearTimeout(t) }, [])
  const getColor = (v) => {
    if (v >= 75) return { fill: '#ef4444', text: 'text-red-400', bg: 'bg-red-500/20', label: 'Critical' }
    if (v >= 55) return { fill: '#fb923c', text: 'text-orange-400', bg: 'bg-orange-500/20', label: 'High' }
    if (v >= 35) return { fill: '#fbbf24', text: 'text-amber-400', bg: 'bg-amber-500/20', label: 'Medium' }
    return { fill: '#34d399', text: 'text-emerald-400', bg: 'bg-emerald-500/20', label: 'Low' }
  }
  return (
    <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-gradient-to-br from-slate-900 to-slate-900/50 p-3 sm:p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.15em] font-mono">Risk Heatmap</h2>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-500 opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" /></span>
          <span className="text-[9px] font-mono text-amber-400/70">LIVE</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-[460px]">
          <div className="flex mb-1">
            <div className="w-24 shrink-0" />
            {mockData.heatmap.severities.map(s => (
              <div key={s} className="flex-1 text-center text-[9px] font-mono text-slate-600 uppercase tracking-wider pb-1">{s}</div>
            ))}
          </div>
          {mockData.heatmap.phases.map((phase, ri) => (
            <div key={phase} className="flex mb-1 last:mb-0">
              <div className="w-24 shrink-0 flex items-center pr-2">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">{phase}</span>
              </div>
              {mockData.heatmap.cells[ri].map((val, ci) => {
                const colors = getColor(val)
                const isHovered = hovered && hovered[0] === ri && hovered[1] === ci
                return (
                  <motion.div
                    key={`${ri}-${ci}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: (ri * 4 + ci) * 0.04 }}
                    onMouseEnter={() => setHovered([ri, ci])}
                    onMouseLeave={() => setHovered(null)}
                    className={`flex-1 m-0.5 rounded-md ${colors.bg} border border-white/[0.04] cursor-pointer transition-all duration-200 ${isHovered ? 'ring-1 ring-white/20 scale-[1.03] z-10' : ''} relative overflow-hidden`}
                    style={{ minHeight: 40 }}
                  >
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: reveal ? `${val}%` : 0 }}
                      transition={{ duration: 0.8, delay: (ri * 4 + ci) * 0.04 }}
                      className="absolute bottom-0 left-0 right-0 opacity-20"
                      style={{ backgroundColor: colors.fill }}
                    />
                    <div className="relative z-10 flex items-center justify-center h-full py-1.5">
                      <span className={`text-[10px] font-mono font-bold ${colors.text}`}>{val}%</span>
                    </div>
                    {isHovered && (
                      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 z-20 whitespace-nowrap rounded-md bg-slate-800 px-2 py-1 text-[8px] text-slate-400 shadow-lg border border-white/[0.06]">
                        {mockData.heatmap.descriptions[ri][ci]}
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-3 mt-3 pt-2 border-t border-white/[0.04] flex-wrap">
        <span className="text-[9px] font-mono text-slate-600">Legend:</span>
        {[
          { label: 'Critical (75-100)', color: '#ef4444' },
          { label: 'High (55-74)', color: '#fb923c' },
          { label: 'Medium (35-54)', color: '#fbbf24' },
          { label: 'Low (0-34)', color: '#34d399' },
        ].map(l => (
          <div key={l.label} className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: l.color }} />
            <span className="text-[8px] font-mono text-slate-500">{l.label}</span>
          </div>
        ))}
        <span className="ml-auto text-[8px] font-mono text-slate-700">Hover for details</span>
      </div>
    </motion.div>
  )
}

function AlertsFeed() {
  const [acknowledged, setAcknowledged] = useState(new Set())
  const ref = useRef(null)
  useEffect(() => {
    if (!ref.current) return
    const el = ref.current
    let scrolling = false
    const i = setInterval(() => {
      if (!scrolling && el) {
        scrolling = true
        const max = el.scrollHeight - el.clientHeight
        if (el.scrollTop >= max - 2) { el.scrollTop = 0; scrolling = false; return }
        el.scrollTop = Math.min(el.scrollTop + 1, max)
        scrolling = false
      }
    }, 180)
    return () => clearInterval(i)
  }, [acknowledged])
  return (
    <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-gradient-to-br from-slate-900 to-slate-900/50 p-3 sm:p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.15em] font-mono">AI Alerts Feed</h2>
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[9px] font-mono text-slate-500">{mockData.alerts.filter(a => a.status === 'triggered').length} active</span>
          <span className="text-slate-700 text-[8px]">|</span>
          <span className="text-[9px] font-mono text-slate-600">{mockData.alerts.filter(a => a.status === 'acknowledged').length} ack</span>
        </div>
      </div>
      <div ref={ref} className="space-y-1 max-h-[360px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800 pr-1">
        {mockData.alerts.map((a, idx) => {
          const borderColor = a.severity === 'critical' ? 'border-l-red-500' : a.severity === 'high' ? 'border-l-orange-500' : a.severity === 'medium' ? 'border-l-yellow-500' : 'border-l-green-500'
          const isAck = acknowledged.has(idx) || a.status === 'acknowledged' || a.status === 'resolved'
          const severityDot = a.severity === 'critical' ? 'bg-red-500' : a.severity === 'high' ? 'bg-orange-500' : a.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
          return (
            <motion.div key={idx} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.04 }} className={`rounded-lg border border-white/[0.04] border-l-2 ${borderColor} bg-white/[0.01] p-2.5 hover:bg-white/[0.03] transition-colors`}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                    <span className={`h-1.5 w-1.5 rounded-full ${severityDot} ${a.severity === 'critical' ? 'animate-pulse' : ''}`} />
                    <span className="text-[9px] font-mono text-slate-600">{a.time}</span>
                    <StatusBadge status={a.severity} label={a.severity} />
                    <span className="text-[10px] text-slate-500 truncate font-medium">{a.service}</span>
                    <span className="text-[8px] font-mono text-slate-700">{a.duration}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 truncate">{a.message}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-[8px] font-mono text-slate-700">Source: {a.source}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {!isAck && (
                    <motion.button whileTap={{ scale: 0.95 }} onClick={() => setAcknowledged(prev => new Set(prev).add(idx))} className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[9px] font-medium text-emerald-400 hover:bg-emerald-500/20 transition-all whitespace-nowrap">
                      ACKNOWLEDGE
                    </motion.button>
                  )}
                  <StatusBadge status={a.status === 'triggered' ? 'running' : a.status === 'acknowledged' ? 'warning' : 'success'} label={a.status === 'triggered' ? 'ALERT' : String(a.status ?? '').toUpperCase()} />
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/[0.04] text-[8px] font-mono text-slate-700">
        <span>{mockData.alerts.length} total alerts</span>
        <span>Auto-scroll active</span>
        <button onClick={() => { setAcknowledged(new Set()); if (ref.current) ref.current.scrollTop = 0 }} className="text-emerald-500/60 hover:text-emerald-400 transition-colors">Reset</button>
      </div>
    </motion.div>
  )
}
function ServiceHealthCard({ svc, idx }) {
  if (!svc) return null
  const dotColor = svc.status === 'healthy' ? 'bg-emerald-500' : svc.status === 'degraded' ? 'bg-amber-500' : 'bg-red-500'
  const borderColor = svc.status === 'healthy' ? 'border-emerald-500/20' : svc.status === 'degraded' ? 'border-amber-500/30' : 'border-red-500/30'
  const badgeStatus = svc.status === 'healthy' ? 'success' : svc.status === 'degraded' ? 'warning' : 'failed'
  const uptimeStr = svc.uptime != null ? `${svc.uptime}%` : '-%'
  return (
    <motion.div variants={item} className={`rounded-lg border ${borderColor} bg-white/[0.02] p-3 hover:bg-white/[0.04] transition-all group`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className={`absolute inline-flex h-full w-full rounded-full ${dotColor} opacity-75 ${svc.status === 'degraded' ? 'animate-ping' : ''}`} />
            <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${dotColor}`} />
          </span>
          <span className="text-[11px] font-mono text-slate-300 font-medium truncate">{svc.name || '-'}</span>
        </div>
        <MiniSparkline data={svc.trend} color={svc.color} width={48} height={14} />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <StatusBadge status={badgeStatus} label={svc.status || 'unknown'} />
          <span className="text-[9px] font-mono text-slate-600">{uptimeStr}</span>
        </div>
        <span className="text-[9px] font-mono text-slate-500">{svc.responseTime || '-'}</span>
      </div>
      <div className="flex items-center gap-2 mt-1.5 pt-1.5 border-t border-white/[0.03] text-[8px] font-mono text-slate-700">
        <span>{svc.pods != null ? `${svc.pods} pods` : '-'}</span>
        <span className="text-slate-700">\u00b7</span>
        <span>{svc.region || '-'}</span>
      </div>
    </motion.div>
  )
}

function DeploymentTimeline() {
  const deployments = mockData.deployments
  return (
    <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-gradient-to-br from-slate-900 to-slate-900/50 p-3 sm:p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.15em] font-mono">Deployment Insights</h2>
        <div className="flex items-center gap-2">
          <StatusBadge status="info" label={`${deployments.length} today`} />
          <span className={`relative flex h-2 w-2`}>
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-500 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500" />
          </span>
        </div>
      </div>
      <div className="relative">
        {deployments.map((d, idx) => {
          const statusColor = d.status === 'success' ? 'bg-emerald-500' : d.status === 'running' ? 'bg-cyan-500' : 'bg-red-500'
          const statusBadge = d.status === 'success' ? 'success' : d.status === 'running' ? 'running' : 'failed'
          const envBadge = d.env === 'production' ? 'critical' : 'info'
          return (
            <motion.div key={idx} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.06 }} className="relative flex items-start gap-3 pb-4 last:pb-0">
              <div className="flex flex-col items-center shrink-0">
                <div className={`h-3 w-3 rounded-full ${statusColor} ${d.status === 'running' ? 'animate-ping' : ''} ring-2 ring-slate-800`} />
                {idx < deployments.length - 1 && <div className="w-px flex-1 bg-slate-800 mt-1" />}
              </div>
              <div className="flex-1 min-w-0 -mt-0.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-medium text-slate-200 font-mono">{d.service}</span>
                    <span className="text-[9px] font-mono text-slate-600">{d.version}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <StatusBadge status={envBadge} label={d.env} />
                    <StatusBadge status={statusBadge} label={d.status} />
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  <span className="text-[9px] font-mono text-slate-600">{d.time}</span>
                  <span className="text-slate-700">\u00b7</span>
                  <span className="text-[9px] font-mono text-slate-600">{d.author}</span>
                  <span className="text-slate-700">\u00b7</span>
                  <span className="text-[8px] font-mono text-slate-700">{d.commit}</span>
                  <span className="text-slate-700">\u00b7</span>
                  <span className="text-[8px] font-mono text-slate-700">{d.duration}</span>
                  {d.rollback && (
                    <><span className="text-slate-700">\u00b7</span><span className="text-[8px] font-mono text-red-400/70">rolled back</span></>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

function VelocityBarChart() {
  const [animated, setAnimated] = useState(false)
  useEffect(() => { const t = setTimeout(() => setAnimated(true), 300); return () => clearTimeout(t) }, [])
  const data = mockData.sprintVelocity
  const maxPoints = Math.max(...data.map(d => d.points))
  const avgPoints = Math.round(data.reduce((s, d) => s + d.points, 0) / data.length)
  const barWidth = 36; const gap = 10; const chartH = 140; const chartW = data.length * (barWidth + gap) + 20
  return (
    <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-gradient-to-br from-slate-900 to-slate-900/50 p-3 sm:p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.15em] font-mono">Engineering Productivity Trends</h2>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-mono text-slate-500">Avg: {avgPoints}pts</span>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span className="text-[9px] font-mono text-emerald-400/70">+6.2% MoM</span>
        </div>
      </div>
      <svg viewBox={`0 0 ${chartW} ${chartH + 40}`} className="w-full h-auto max-h-[200px]">
        {[0, 0.25, 0.5, 0.75, 1].map((frac, i) => (
          <g key={i}>
            <line x1="0" y1={chartH - frac * chartH} x2={chartW - 20} y2={chartH - frac * chartH} stroke="#1e293b" strokeWidth="0.5" strokeDasharray="4" />
            <text x={chartW - 15} y={chartH - frac * chartH + 3} fill="#475569" fontSize="7" fontFamily="monospace">{Math.round(maxPoints * frac)}</text>
          </g>
        ))}
        <line x1="0" y1={chartH - (avgPoints / maxPoints) * chartH} x2={chartW - 20} y2={chartH - (avgPoints / maxPoints) * chartH} stroke="#fbbf24" strokeWidth="1" strokeDasharray="3" opacity="0.6" />
        <text x={chartW - 15} y={chartH - (avgPoints / maxPoints) * chartH - 2} fill="#fbbf24" fontSize="6" fontFamily="monospace">avg</text>
        {data.map((d, i) => {
          const barH = (d.points / maxPoints) * chartH
          const x = i * (barWidth + gap) + 10
          const y = chartH - barH
          const pctChange = i > 0 ? ((d.points - data[i - 1].points) / data[i - 1].points) * 100 : 0
          const barColor = d.points >= avgPoints ? '#34d399' : '#fbbf24'
          return (
            <g key={d.week}>
              <motion.rect x={x} y={chartH} width={barWidth} height={0} animate={animated ? { y, height: barH } : {}} transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }} rx="3" fill={barColor} opacity="0.85" />
              <motion.rect x={x} y={chartH} width={barWidth} height={0} animate={animated ? { y, height: barH } : {}} transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }} rx="3" fill={barColor} opacity="0.15" style={{ transform: 'translateY(2px)' }} />
              <text x={x + barWidth / 2} y={chartH + 15} textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace">{d.week}</text>
              <motion.text x={x + barWidth / 2} y={y - 5} textAnchor="middle" fill="#e2e8f0" fontSize="8" fontFamily="monospace" fontWeight="bold" initial={{ opacity: 0 }} animate={animated ? { opacity: 1 } : {}} transition={{ duration: 0.4, delay: i * 0.1 + 0.6 }}>{d.points}</motion.text>
              {pctChange !== 0 && (<text x={x + barWidth + 2} y={y + 8} fill={pctChange > 0 ? '#34d399' : '#ef4444'} fontSize="6" fontFamily="monospace">{pctChange > 0 ? '\u2191' : '\u2193'}{Math.abs(Math.round(pctChange))}%</text>)}
            </g>
          )
        })}
        <text x={chartW / 2} y={chartH + 34} textAnchor="middle" fill="#334155" fontSize="7" fontFamily="monospace" letterSpacing="2">SPRINT VELOCITY (STORY POINTS)</text>
      </svg>
    </motion.div>
  )
}

function ActivityTimeline() {
  const activities = mockData.activityTimeline
  const actionColors = { deployed: 'bg-emerald-500', merged: 'bg-cyan-500', reviewed: 'bg-violet-500', alerted: 'bg-red-500' }
  return (
    <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-gradient-to-br from-slate-900 to-slate-900/50 p-3 sm:p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.15em] font-mono">Recent Activity Timeline</h2>
        <StatusBadge status="info" label="Live Feed" />
      </div>
      <div className="space-y-0">
        {activities.map((act, idx) => {
          const dotColor = actionColors[act.action] || 'bg-slate-500'
          const outcomeDot = act.outcome === 'success' ? 'bg-emerald-500' : act.outcome === 'warning' ? 'bg-amber-500' : 'bg-red-500'
          return (
            <motion.div key={idx} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }} className="relative flex items-start gap-3 pb-3 last:pb-0">
              <div className="flex flex-col items-center shrink-0">
                <div className={`h-3 w-3 rounded-full ${dotColor} ring-2 ring-slate-800 flex items-center justify-center`}>
                  <svg className="h-1.5 w-1.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                </div>
                {idx < activities.length - 1 && <div className="w-px flex-1 bg-slate-800 mt-1" />}
              </div>
              <div className="flex-1 min-w-0 -mt-0.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-xs font-medium ${act.action === 'alerted' ? 'text-red-300' : 'text-slate-200'}`}>{act.actor}</span>
                    <span className="text-[10px] text-slate-500">{act.action}d</span>
                    <span className="text-[10px] font-mono text-slate-500">{act.target}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`h-1.5 w-1.5 rounded-full ${outcomeDot} ${act.outcome === 'warning' ? 'animate-pulse' : ''}`} />
                    <span className="text-[9px] font-mono text-slate-600">{act.time}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-[9px] text-slate-600 truncate">{act.detail}</span>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
function IncidentsByService() {
  return (
    <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-gradient-to-br from-slate-900 to-slate-900/50 p-3 sm:p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.15em] font-mono">Incidents by Service</h2>
        <StatusBadge status="info" label="24h window" />
      </div>
      <div className="space-y-2">
          {mockData.incidentsByService.map((item, idx) => {
          const sevColor = item.severity === 'critical' ? '#ef4444' : item.severity === 'high' ? '#f97316' : item.severity === 'medium' ? '#eab308' : '#22c55e'
          const sevColorClass = item.severity === 'critical' ? 'text-red-400' : item.severity === 'high' ? 'text-orange-400' : item.severity === 'medium' ? 'text-amber-400' : 'text-emerald-400'
          const pct = Math.min((item.count / 5) * 100, 100)
          return (
            <motion.div key={item.service} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }} className="flex items-center gap-2 glass-card p-1.5">
              <svg width="28" height="28" viewBox="0 0 28 28" className="-rotate-90 shrink-0">
                <circle cx="14" cy="14" r="10" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="3" />
                <motion.circle cx="14" cy="14" r="10" fill="none" stroke={sevColor} strokeWidth="3" strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 10} initial={{ strokeDashoffset: 2 * Math.PI * 10 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 10 * (1 - pct / 100) }} transition={{ duration: 0.8, delay: idx * 0.05, ease: 'easeOut' }} />
                <text x="14" y="17" textAnchor="middle" fill={sevColor} fontSize="6" fontWeight="700" fontFamily="monospace" transform="rotate(90 14 14)">{item.count}</text>
              </svg>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-300 truncate">{item.service}</span>
                  <span className={'text-[8px] font-mono ' + (item.trend === 'up' ? 'text-red-400' : item.trend === 'down' ? 'text-emerald-400' : 'text-slate-600')}>{item.trend === 'up' ? '\u2191' : item.trend === 'down' ? '\u2193' : '\u2192'}</span>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

function SloSummary() {
  return (
    <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-gradient-to-br from-slate-900 to-slate-900/50 p-3 sm:p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.15em] font-mono">SLO Summary</h2>
        <StatusBadge status="success" label={`${mockData.slos.filter(s => s.status === 'attaining').length}/${mockData.slos.length} Attaining`} />
      </div>
      <div className="space-y-2.5">
        {mockData.slos.map((slo, idx) => {
          const statusColor = slo.status === 'attaining' ? 'text-emerald-400' : 'text-amber-400'
          const barColor = slo.status === 'attaining' ? 'bg-emerald-500/80' : 'bg-amber-500/80'
          const actualPct = slo.unit === 'ms' ? ((slo.threshold - slo.actual) / slo.threshold) * 100 : (slo.actual / slo.threshold) * 100
          const barPct = Math.min(actualPct, 100)
          const displayActual = slo.unit ? `${slo.actual}${slo.unit}` : `${slo.actual}%`
          const displaySlo = slo.unit ? `${slo.threshold}${slo.unit}` : `${slo.threshold}%`
          return (
            <motion.div key={slo.name} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className="rounded-lg border border-white/[0.04] bg-white/[0.01] p-2.5">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className={`h-1.5 w-1.5 rounded-full ${slo.status === 'attaining' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                  <span className="text-[10px] font-medium text-slate-300">{slo.name}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`text-[10px] font-mono font-bold ${statusColor}`}>{displayActual}</span>
                  <span className="text-[8px] font-mono text-slate-700">slo: {displaySlo}</span>
                  <StatusBadge status={slo.status === 'attaining' ? 'success' : 'warning'} label={slo.status} />
                </div>
              </div>
              <svg width="28" height="28" viewBox="0 0 28 28" className="-rotate-90 shrink-0">
                <circle cx="14" cy="14" r="10" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="3" />
                <motion.circle cx="14" cy="14" r="10" fill="none" stroke={slo.status === 'attaining' ? '#22c55e' : '#f59e0b'} strokeWidth="3" strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 10} initial={{ strokeDashoffset: 2 * Math.PI * 10 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 10 * (1 - Math.min(barPct * (slo.unit === 'ms' ? 2 : 1), 100) / 100) }} transition={{ duration: 0.8, delay: idx * 0.05, ease: 'easeOut' }} />
                <text x="14" y="17" textAnchor="middle" fill={slo.status === 'attaining' ? '#22c55e' : '#f59e0b'} fontSize="6" fontWeight="700" fontFamily="monospace" transform="rotate(90 14 14)">{displayActual}</text>
              </svg>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

function OnCallBanner() {
  const oc = mockData.onCall
  return (
    <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-gradient-to-r from-slate-900 via-slate-900/80 to-slate-900/50 p-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-500 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan-500" />
            </span>
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">On-Call</span>
          </div>
          <span className="text-[11px] font-mono text-cyan-400 font-medium">{oc.primary}</span>
          <span className="text-slate-700 text-[8px]">|</span>
          <span className="text-[9px] font-mono text-slate-600">Escalation: {oc.escalation}</span>
        </div>
        <div className="flex items-center gap-3 text-[9px] font-mono text-slate-600">
          <span>Secondary: {oc.secondary}</span>
          <span className="text-slate-700">\u00b7</span>
          <span>Shift: {oc.coverage}</span>
          <span className="text-slate-700">\u00b7</span>
          <span>Remaining: <span className="text-amber-400/80">{oc.shiftRemaining}</span></span>
          <span className="text-slate-700">\u00b7</span>
          <span>Handoff: {oc.lastHandoff}</span>
        </div>
      </div>
    </motion.div>
  )
}
function ChangeFailureRate() {
  const [anim, setAnim] = useState(false)
  useEffect(() => { const t = setTimeout(() => setAnim(true), 400); return () => clearTimeout(t) }, [])
  const data = mockData.changeFailureRate
  return (
    <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-gradient-to-br from-slate-900 to-slate-900/50 p-3 sm:p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.15em] font-mono">Change Failure Rate</h2>
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] font-mono text-slate-500">6-week avg: {Math.round(data.reduce((s, d) => s + d.rate, 0) / data.length)}%</span>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span className="text-[9px] font-mono text-emerald-400/70">-1.8% WoW</span>
        </div>
      </div>
      <div className="flex items-end gap-2 sm:gap-3">
        {data.map((d, i) => {
          const h = Math.min(d.rate * 4, 80)
          const color = d.rate < 10 ? '#34d399' : d.rate < 15 ? '#fbbf24' : '#ef4444'
          return (
            <div key={d.week} className="flex-1 flex flex-col items-center gap-1">
              <span className={`text-[8px] font-mono font-bold ${d.rate < 10 ? 'text-emerald-400' : d.rate < 15 ? 'text-amber-400' : 'text-red-400'}`}>{d.rate}%</span>
              <motion.div initial={{ height: 0 }} animate={anim ? { height: h } : {}} transition={{ duration: 0.8, delay: i * 0.08, ease: 'easeOut' }} className="w-full rounded-t-md" style={{ backgroundColor: color, height: anim ? h : 0, minHeight: anim ? h : 0 }} />
              <span className="text-[8px] font-mono text-slate-600">{d.week}</span>
              <span className="text-[7px] font-mono text-slate-700">{d.deploys} deploys</span>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}

function PredictionCards() {
  const colors = {
    critical: { border: 'border-red-500/30', bg: 'bg-red-500/5', text: 'text-red-400', glow: 'bg-red-500/10', dot: 'bg-red-500' },
    medium: { border: 'border-amber-500/30', bg: 'bg-amber-500/5', text: 'text-amber-400', glow: 'bg-amber-500/10', dot: 'bg-amber-500' },
    low: { border: 'border-emerald-500/30', bg: 'bg-emerald-500/5', text: 'text-emerald-400', glow: 'bg-emerald-500/10', dot: 'bg-emerald-500' },
  }
  const icons = {
    'alert-triangle': 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z',
    'shield-alert': 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z',
    'check-circle': 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  }
  const [flash, setFlash] = useState(null)
  useEffect(() => { const i = setInterval(() => { setFlash(Math.floor(Math.random() * 3)); setTimeout(() => setFlash(null), 300) }, 4000); return () => clearInterval(i) }, [])
  return (
    <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-gradient-to-br from-slate-900 to-slate-900/50 p-3 sm:p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.15em] font-mono">Prediction Engine</h2>
        <div className="flex items-center gap-1">
          <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-500 opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500" /></span>
          <span className="text-[9px] font-mono text-cyan-400/70">ML ACTIVE</span>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {mockData.predictions.map((p, idx) => {
          const c = colors[p.severity]
          const isFlashing = flash === idx
          return (
            <motion.div key={p.title} variants={item} className={`relative overflow-hidden rounded-xl border ${c.border} ${c.bg} p-3 sm:p-4 ${isFlashing ? 'ring-1 ring-white/20' : ''} transition-all duration-200`}>
              <div className={`absolute -top-6 -right-6 w-16 h-16 rounded-full ${c.glow} blur-xl transition-all duration-500 ${isFlashing ? 'scale-150' : ''}`} />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <svg className={`h-4 w-4 ${c.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={icons[p.icon]} /></svg>
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">{p.title}</span>
                </div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className={`text-xl sm:text-2xl font-bold font-mono ${c.text}`}>{p.value}{p.unit}</span>
                  <span className="text-[9px] text-slate-600">{p.timeframe}</span>
                </div>
                <div className="flex items-center gap-1.5 mb-2">
                  <span className={`h-1.5 w-1.5 rounded-full ${c.dot} ${p.severity === 'critical' ? 'animate-ping' : ''}`} />
                  <span className={`text-[9px] font-mono ${c.text}`}>{p.confidence} Confidence</span>
                </div>
                <p className="text-[9px] text-slate-500 leading-relaxed mb-2">{p.recommendation}</p>
                <div className="flex flex-wrap gap-1">
                  {p.factors.map((f, fi) => (<span key={fi} className="rounded-md bg-white/[0.03] border border-white/[0.04] px-1.5 py-0.5 text-[7px] font-mono text-slate-600">{f}</span>))}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

function BusinessImpactCalculator() {
  const [globalFlash, setGlobalFlash] = useState(false)
  useEffect(() => { const i = setInterval(() => { setGlobalFlash(true); setTimeout(() => setGlobalFlash(false), 200) }, 6000); return () => clearInterval(i) }, [])
  return (
    <motion.div variants={item} className={`relative overflow-hidden rounded-xl border border-white/[0.06] bg-gradient-to-br from-slate-900 to-slate-900/50 p-3 sm:p-4 ${globalFlash ? 'ring-1 ring-amber-500/30' : ''} transition-all duration-300`}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(251,191,36,0.03),transparent_60%)]" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.15em] font-mono">Business Impact Calculator</h2>
          <div className="flex items-center gap-1.5">
            <span className={`h-1.5 w-1.5 rounded-full bg-amber-500 ${globalFlash ? 'animate-ping' : ''}`} />
            <span className="text-[9px] font-mono text-amber-400/70">REALTIME ESTIMATE</span>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {mockData.businessImpact.map((biz, idx) => {
            const val = useCounter(biz.value, idx * 100, 1800, biz.format)
            const displayVal = typeof val === 'string' ? val : val.toLocaleString()
            const barPct = Math.min((biz.value / biz.barMax) * 100, 100)
            return (
              <motion.div key={biz.label} variants={item} className="rounded-lg border border-white/[0.04] bg-white/[0.01] p-3 sm:p-4 hover:bg-white/[0.03] transition-all group">
                <div className="flex items-center gap-2 mb-2">
                  <svg className={`h-3.5 w-3.5 ${biz.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={biz.icon} /></svg>
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider truncate">{biz.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`text-lg sm:text-xl font-bold font-mono ${biz.color} truncate`}>{biz.prefix}{displayVal}{biz.suffix}</div>
                  <svg width="32" height="32" viewBox="0 0 32 32" className="-rotate-90 shrink-0 ml-auto">
                    <circle cx="16" cy="16" r="12" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="3" />
                    <motion.circle cx="16" cy="16" r="12" fill="none" stroke={(() => { const m = { 'text-red-400': '#f87171', 'text-amber-400': '#fbbf24', 'text-cyan-400': '#22d3ee', 'text-emerald-400': '#34d399' }; return m[biz.color] || '#64748b' })()} strokeWidth="3" strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 12} initial={{ strokeDashoffset: 2 * Math.PI * 12 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 12 * (1 - barPct / 100) }} transition={{ duration: 1.2, delay: idx * 0.1 + 0.3, ease: 'easeOut' }} />
                    <text x="16" y="19" textAnchor="middle" fill={(() => { const m = { 'text-red-400': '#f87171', 'text-amber-400': '#fbbf24', 'text-cyan-400': '#22d3ee', 'text-emerald-400': '#34d399' }; return m[biz.color] || '#64748b' })()} fontSize="7" fontWeight="700" fontFamily="monospace" transform="rotate(90 16 16)">{Math.round(barPct)}%</text>
                  </svg>
                </div>
              </motion.div>
            )
          })}
        </div>
        <div className="mt-3 pt-2 border-t border-white/[0.04] flex items-center justify-between flex-wrap gap-1 text-[9px] font-mono text-slate-600">
          <span>NEXT SLA WINDOW: <span className="text-amber-400/80">23:47:12</span></span>
          <span>EST. TOTAL EXPOSURE: <span className="text-red-400">$219,000</span></span>
          <span>RISK ADJUSTED: <span className="text-amber-400">$157,680</span></span>
        </div>
      </div>
    </motion.div>
  )
}
function StatusTicker() {
  return (
    <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-gradient-to-r from-slate-900 via-slate-900/80 to-slate-900/50 p-3 overflow-hidden">
      <div className="flex items-center gap-6 overflow-x-auto scrollbar-none">
        {[
          { label: 'INCIDENTS TODAY', value: '23', color: 'text-red-400' },
          { label: 'MEAN DETECTION', value: '3.2m', color: 'text-cyan-400' },
          { label: 'MEAN RESPONSE', value: '6.8m', color: 'text-emerald-400' },
          { label: 'RESOLUTION RATE', value: '97.4%', color: 'text-emerald-400' },
          { label: 'SLA COMPLIANCE', value: '99.2%', color: 'text-amber-400' },
          { label: 'DEPLOYS TODAY', value: '14', color: 'text-violet-400' },
          { label: 'ROLLBACKS', value: '1', color: 'text-red-400' },
          { label: 'ON-CALL', value: '4 eng', color: 'text-cyan-400' },
          { label: 'P0 INCIDENTS', value: '0', color: 'text-emerald-400' },
          { label: 'ALERT ACK TIME', value: '48s', color: 'text-amber-400' },
          { label: 'CACHE HIT RATE', value: '92%', color: 'text-emerald-400' },
          { label: 'DB CONNECTIONS', value: '142', color: 'text-cyan-400' },
        ].map((m, i) => (
          <div key={m.label} className="flex items-center gap-2 shrink-0">
            <span className="text-[9px] font-mono text-slate-600 uppercase tracking-wider whitespace-nowrap">{m.label}</span>
            <span className={`text-sm font-bold font-mono ${m.color}`}>{m.value}</span>
            {i < 11 && <span className="text-slate-800 text-[8px]">|</span>}
          </div>
        ))}
      </div>
    </motion.div>
  )
}

function CommandHeader() {
  return (
    <motion.div variants={item} className="rounded-xl border border-white/[0.08] bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900/80 backdrop-blur-2xl p-2 sm:p-3 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px]" />
      <div className="flex items-center justify-between flex-wrap gap-3 relative z-10">
        <div className="flex items-center gap-3">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 shadow-lg shadow-emerald-500/10">
            <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
            <div className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-slate-950" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold tracking-[0.15em] font-mono text-white uppercase">Executive Command Center</h1>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" /></span>
              <span className="text-[10px] font-mono text-emerald-400/80 tracking-wider uppercase">All Systems Nominal</span>
              <span className="text-slate-700">|</span>
              <span className="flex items-center gap-1 text-[9px] font-mono text-slate-600">
                <svg className="h-3 w-3 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>
                UPTIME: 99.97%
              </span>
              <span className="text-slate-700">|</span>
              <Timestamp />
              <span className="text-slate-700">|</span>
              <span className="text-[9px] font-mono text-cyan-400/60">SYS-OP: MONITOR</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden sm:flex items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] font-mono text-emerald-400/80">THREAT LVL: 3</span>
          </span>
          <StatusBadge status="success" label="All Systems" />
          <StatusBadge status="info" label="v3.4.1" />
          <div className="h-6 w-px bg-white/[0.06]" />
          <span className="hidden xs:flex text-[9px] font-mono text-slate-600">NOC-SEA-01</span>
        </div>
      </div>
    </motion.div>
  )
}

function FooterBar() {
  return (
    <motion.div variants={item} className="rounded-xl border border-white/[0.04] bg-slate-900/30 p-2.5">
      <div className="flex items-center justify-between flex-wrap gap-1 text-[8px] font-mono text-slate-700">
        <div className="flex items-center gap-3">
          <span>CONSOLE v3.4.1</span>
          <span>NOC-SEA-01</span>
          <span>UPTIME: 99.97%</span>
          <span>LAST FAILOVER: NEVER</span>
          <span>SESSION: ADMIN</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            REDUNDANCY: ACTIVE
          </span>
          <span>HEARTBEAT: <span className="text-emerald-500/80">OK</span></span>
          <span>SEVERITY: <span className="text-emerald-500/80">INFO</span></span>
        </div>
      </div>
    </motion.div>
  )
}

function QuickActionPanel() {
  return (
    <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-gradient-to-br from-slate-900 to-slate-900/50 p-3 sm:p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.15em] font-mono">Quick Action Panel</h2>
        <StatusBadge status="info" label="SYS-OP TOOLS" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: 'Run Risk Scan', icon: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z', bg: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 text-emerald-400' },
          { label: 'Deploy Hotfix', icon: 'M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z', bg: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/30 text-cyan-400' },
          { label: 'Rollback Service', icon: 'M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3', bg: 'from-amber-500/20 to-amber-600/10 border-amber-500/30 text-amber-400' },
          { label: 'Scale Cluster', icon: 'M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15', bg: 'from-violet-500/20 to-violet-600/10 border-violet-500/30 text-violet-400' },
          { label: 'Trigger Runbook', icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z', bg: 'from-rose-500/20 to-rose-600/10 border-rose-500/30 text-rose-400' },
        ].map((action, i) => (
          <motion.button key={action.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className={`rounded-xl border ${action.bg} bg-gradient-to-br p-4 flex flex-col items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 group`}>
            <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={action.icon} /></svg>
            <span className="text-[9px] font-semibold uppercase tracking-wider text-center">{action.label}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}
function DailyBriefing() {
  const db = mockData.dailyBriefing
  const [visible, setVisible] = useState(false)
  const [textIdx, setTextIdx] = useState(0)
  const fullText = db.body
  useEffect(() => {
    setVisible(true)
    const t = setTimeout(() => {
      const i = setInterval(() => {
        setTextIdx(prev => { if (prev >= fullText.length) { clearInterval(i); return prev }; return prev + 1 })
      }, 12)
      return () => clearInterval(i)
    }, 600)
    return () => clearTimeout(t)
  }, [fullText])
  return (
    <motion.div variants={item} className="relative overflow-hidden rounded-xl border border-white/[0.06] bg-gradient-to-br from-slate-900 to-slate-900/50 p-3 sm:p-4 group hover:border-cyan-500/30 transition-all duration-300">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-transparent opacity-30" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
            <h2 className="text-[11px] font-semibold text-cyan-400 uppercase tracking-[0.15em] font-mono">Daily AI Briefing</h2>
            <StatusBadge status="info" label="AI GENERATED" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-500 opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500" /></span>
            <span className="text-[9px] font-mono text-cyan-400/70">LIVE</span>
          </div>
        </div>
        <div className="mb-2"><span className="text-xs font-semibold text-slate-200">{db.greeting}</span></div>
        <p className="text-[11px] text-slate-400 leading-relaxed min-h-[32px]">{fullText.slice(0, textIdx)}{textIdx < fullText.length && <span className="animate-pulse text-cyan-400">|</span>}</p>
        <div className="grid grid-cols-3 gap-2 mt-2">
          <div className="rounded-lg bg-white/[0.03] border border-white/[0.04] p-2"><span className="text-[8px] font-mono text-slate-600 uppercase tracking-wider">Analyzed</span><div className="text-[11px] font-bold font-mono text-cyan-400">{db.analyzed}</div></div>
          <div className="rounded-lg bg-white/[0.03] border border-white/[0.04] p-2"><span className="text-[8px] font-mono text-slate-600 uppercase tracking-wider">Risk Detection</span><div className="text-[11px] font-bold font-mono text-emerald-400">{db.accuracy}</div></div>
          <div className="rounded-lg bg-white/[0.03] border border-white/[0.04] p-2"><span className="text-[8px] font-mono text-slate-600 uppercase tracking-wider">Potential Savings</span><div className="text-[11px] font-bold font-mono text-amber-400">{db.savings}</div></div>
        </div>
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/[0.04] text-[8px] font-mono text-slate-700">
          <span>Last updated: <Timestamp /></span>
          <span>Confidence: <span className="text-emerald-400/80">{db.confidence}%</span></span>
        </div>
      </div>
    </motion.div>
  )
}

function ExecutiveInsights() {
  const findings = mockData.executiveInsights
  const sevCfg = { critical: { border: 'border-l-red-500', dot: 'bg-red-500', text: 'text-red-400', badge: 'critical' }, high: { border: 'border-l-orange-500', dot: 'bg-orange-500', text: 'text-orange-400', badge: 'warning' } }
  return (
    <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-gradient-to-br from-slate-900 to-slate-900/50 p-3 sm:p-4">
      <div className="flex items-center justify-between mb-2.5">
        <h2 className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.15em] font-mono">Executive Intelligence</h2>
        <div className="flex items-center gap-2"><StatusBadge status="info" label="AI-POWERED" /><span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-500 opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" /></span></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {findings.map((f, idx) => {
          const c = sevCfg[f.severity] || sevCfg.high
          return (
            <motion.div key={f.id} variants={item} className={`rounded-lg border border-white/[0.04] border-l-2 ${c.border} bg-white/[0.01] p-3 hover:bg-white/[0.03] transition-all group`}>
              <div className="flex items-center gap-1.5 mb-2">
                <span className={`h-2 w-2 rounded-full ${c.dot} ${f.severity === 'critical' ? 'animate-ping' : ''}`} />
                <StatusBadge status={c.badge} label={f.severity === 'critical' ? 'Critical' : 'High'} />
                <span className="text-[8px] font-mono text-slate-700 ml-auto">Finding #{f.id}</span>
              </div>
              <p className="text-[11px] font-medium text-slate-200 mb-2 leading-relaxed">{f.title}</p>
              <div className="space-y-1 mb-2">
                <div className="flex items-center gap-2">
                  <svg className="h-3 w-3 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" /></svg>
                  <span className="text-[9px] font-mono text-slate-400">Impact: <span className={c.text}>{f.impact}</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="h-3 w-3 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
                  <span className="text-[9px] font-mono text-slate-400">Confidence: <span className="text-emerald-400">{f.confidence}</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="h-3 w-3 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
                  <span className="text-[9px] font-mono text-slate-400">Action: <span className="text-slate-300">{f.action}</span></span>
                </div>
              </div>
              <button className="text-[8px] font-mono text-cyan-400/60 hover:text-cyan-400 transition-colors">View Details</button>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

function BusinessImpactCenter() {
  const items = mockData.businessImpactCenter
  return (
    <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-gradient-to-br from-slate-900 to-slate-900/50 p-3 sm:p-4">
      <div className="flex items-center justify-between mb-2.5">
        <h2 className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.15em] font-mono">Business Impact Center</h2>
        <div className="flex items-center gap-2"><StatusBadge status="warning" label="RISK ASSESSMENT" /><span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" /></div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {items.map((biz, idx) => {
          const val = useCounter(biz.value, idx * 80, 1500, biz.value >= 1000)
          const displayVal = typeof val === 'string' ? val : val.toLocaleString()
          const trendIcon = biz.trend === 'up' ? '\u2191' : '\u2193'
          const trendColor = biz.trend === 'up' ? 'text-red-400' : 'text-emerald-400'
          return (
            <motion.div key={biz.label} variants={item} className="rounded-lg border border-white/[0.04] bg-white/[0.01] p-3 hover:bg-white/[0.03] transition-all group">
              <div className="flex items-center gap-1.5 mb-1.5"><span className={`h-2 w-2 rounded-full ${biz.dotColor}`} /><span className="text-[8px] font-mono text-slate-600 uppercase tracking-wider truncate">{biz.label}</span></div>
              <div className={`text-lg sm:text-xl font-bold font-mono ${biz.color} truncate`}>{biz.prefix}{displayVal}{biz.suffix}</div>
              <div className="flex items-center gap-1.5 mt-0.5"><span className={`text-[9px] font-mono ${trendColor}`}>{trendIcon} {biz.pct}%</span></div>
              <p className="text-[8px] text-slate-600 mt-1">{biz.description}</p>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

function PredictionWall() {
  const predictions = mockData.aiPredictions
  const trendColors = { declining: '#ef4444', stable: '#22d3ee', improving: '#34d399' }
  return (
    <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-gradient-to-br from-slate-900 to-slate-900/50 p-3 sm:p-4">
      <div className="flex items-center justify-between mb-2.5">
        <h2 className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.15em] font-mono">AI Prediction Wall</h2>
        <div className="flex items-center gap-2"><StatusBadge status="info" label="FORECAST ACTIVE" /><span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-500 opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500" /></span></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {predictions.map((p, idx) => {
          const count = useCounter(parseInt(p.value), idx * 100, 1500)
          return (
            <motion.div key={p.title} variants={item} className="rounded-lg border border-white/[0.04] bg-white/[0.01] p-3 hover:bg-white/[0.03] transition-all group">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} /><span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">{p.title}</span></div>
                <MiniSparkline data={p.sparkData} color={p.color} width={48} height={14} />
              </div>
              <div className="flex items-baseline gap-1"><span className={`text-xl sm:text-2xl font-bold font-mono ${p.textColor}`}>{count}{p.unit}</span></div>
              <p className="text-[8px] text-slate-600 mt-0.5">{p.description}</p>
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className="h-1 w-1 rounded-full" style={{ backgroundColor: trendColors[p.trend] || '#64748b' }} />
                <span className="text-[8px] font-mono text-slate-700">{String(p.trend ?? '').charAt(0).toUpperCase() + String(p.trend ?? '').slice(1)}</span>
              </div>
              <div className="flex flex-wrap gap-1 mt-1.5 pt-1.5 border-t border-white/[0.03]">
                {p.factors.map((f, fi) => (<span key={fi} className="rounded-md bg-white/[0.02] border border-white/[0.03] px-1.5 py-0.5 text-[7px] font-mono text-slate-700">{f}</span>))}
              </div>
            </motion.div>
          )
        })}
      </div>
      <div className="mt-2.5 pt-2 border-t border-white/[0.04] flex items-center justify-between text-[9px] font-mono">
        <span className="text-slate-500">Risk Direction: <span className="text-red-400">Increasing</span></span>
        <span className="text-amber-400/80">Recommend proactive mitigation in 3 service areas</span>
        <span className="text-slate-700">AI Confidence: 91%</span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <EnterpriseRiskGalaxy selectedRisk={null} onSelectRisk={() => {}} />
        <AISpotlightPanel selectedRisk={null} />
      </div>
    </motion.div>
  )
}

function EnterpriseRiskGalaxy({ selectedRisk, onSelectRisk }) {
  const risks = mockData.topRisks || []
  
  return (
    <div className="relative overflow-hidden rounded-xl border border-white/[0.08] bg-slate-950/70 backdrop-blur-xl p-4 sm:p-5 h-[380px] flex flex-col justify-between group">
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-500 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan-500" />
          </span>
          <h3 className="text-xs font-semibold text-white font-mono uppercase tracking-[0.15em]">Enterprise Risk Galaxy</h3>
        </div>
        <span className="text-[10px] text-slate-500 font-mono">Interactive Gravity Node Map</span>
      </div>

      <div className="relative flex-1 flex items-center justify-center overflow-hidden">
        {/* Galaxy background grid / circles */}
        <div className="absolute inset-0 flex items-center justify-center opacity-40 pointer-events-none">
          <div className="absolute w-[100px] h-[100px] rounded-full border border-dashed border-cyan-500/10 animate-[spin_40s_linear_infinite]" />
          <div className="absolute w-[200px] h-[200px] rounded-full border border-dashed border-cyan-500/10 animate-[spin_60s_linear_infinite]" style={{ animationDirection: 'reverse' }} />
          <div className="absolute w-[300px] h-[300px] rounded-full border border-dashed border-cyan-500/5 animate-[spin_80s_linear_infinite]" />
        </div>

        {/* Central Core */}
        <div className="relative z-10 flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.15)] animate-pulse">
            <svg className="h-7 w-7 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9s2.015-9 4.5-9m0 0a9.004 9.004 0 018.716 2.253M12 3a9.004 9.004 0 00-8.716 2.253" />
            </svg>
          </div>
          <span className="text-[8px] font-mono text-cyan-400/80 mt-1 uppercase tracking-widest">Orbit Core</span>
        </div>

        {/* Nodes */}
        {risks.map((r, i) => {
          const orbitIndex = i % 3;
          const radius = [60, 95, 130][orbitIndex];
          const angle = (i * (360 / risks.length) * Math.PI) / 180;
          const x = radius * Math.cos(angle);
          const y = radius * Math.sin(angle);

          const isSelected = selectedRisk && selectedRisk.service === r.service;

          const size = Math.max(16, Math.min(36, (r.impact / 202000) * 20 + 16));
          const colorClass =
            r.status === 'Critical' ? 'bg-red-500 text-red-400 border-red-400/30' :
            r.status === 'Warning' ? 'bg-orange-500 text-orange-400 border-orange-400/30' :
            r.status === 'Elevated' ? 'bg-amber-500 text-amber-400 border-amber-400/30' :
            r.status === 'Monitor' ? 'bg-yellow-500 text-yellow-400 border-yellow-400/30' :
            'bg-cyan-500 text-cyan-400 border-cyan-400/30';

          const glowShadow =
            r.status === 'Critical' ? 'shadow-[0_0_20px_rgba(239,68,68,0.5)]' :
            r.status === 'Warning' ? 'shadow-[0_0_15px_rgba(249,115,22,0.4)]' :
            r.status === 'Elevated' ? 'shadow-[0_0_15px_rgba(245,158,11,0.3)]' :
            'shadow-[0_0_10px_rgba(6,182,212,0.2)]';

          return (
            <motion.div
              key={r.service}
              className="absolute z-20 cursor-pointer"
              style={{ x, y }}
              animate={{
                y: [y, y - 3, y + 3, y],
                x: [x, x + 2, x - 2, x]
              }}
              transition={{
                duration: 5 + i,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              onClick={() => onSelectRisk(r)}
            >
              <div className="relative group">
                <svg className="absolute pointer-events-none origin-top-left" style={{
                  width: Math.abs(x) || 1,
                  height: Math.abs(y) || 1,
                  left: x > 0 ? -x : 0,
                  top: y > 0 ? -y : 0,
                  transform: `scaleX(${x > 0 ? -1 : 1}) scaleY(${y > 0 ? -1 : 1})`,
                  overflow: 'visible',
                  zIndex: -1
                }}>
                  <line x1="0" y1="0" x2={Math.abs(x)} y2={Math.abs(y)} stroke={isSelected ? 'rgba(34,211,238,0.25)' : 'rgba(255,255,255,0.03)'} strokeWidth={isSelected ? 1.5 : 0.5} strokeDasharray={isSelected ? '3 3' : 'none'} />
                </svg>

                <div
                  className={`rounded-full ${colorClass} ${glowShadow} border flex items-center justify-center transition-all duration-300 ${
                    isSelected ? 'ring-2 ring-cyan-400 scale-110' : 'hover:scale-105'
                  }`}
                  style={{ width: size, height: size }}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-white opacity-80" />
                </div>

                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 whitespace-nowrap bg-slate-900/90 border border-white/[0.08] rounded-md px-1.5 py-0.5 pointer-events-none select-none">
                  <span className="text-[8px] font-mono text-slate-300 font-semibold">{r.service}</span>
                  <span className="text-[7px] font-mono text-slate-500 ml-1">({r.impactLabel})</span>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      <div className="flex items-center gap-4 text-[9px] font-mono text-slate-500 border-t border-white/[0.04] pt-2">
        <span className="text-[8px] uppercase tracking-wider font-semibold">Severity Keys:</span>
        <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-red-500" /> Critical</span>
        <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-orange-500" /> Warning</span>
        <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Elevated</span>
        <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-cyan-500" /> Stable</span>
      </div>
    </div>
  )
}

function AISpotlightPanel({ selectedRisk }) {
  const r = selectedRisk || mockData.topRisks[0]
  
  return (
    <div className="rounded-xl border border-white/[0.08] bg-slate-950/80 p-4 sm:p-5 h-[380px] flex flex-col justify-between font-mono relative overflow-hidden group">
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
      <div className="absolute top-0 right-0 p-2 text-[8px] text-slate-700 select-none">ORBIT_TERMINAL_V4.2</div>
      
      <div className="space-y-4 relative z-10">
        <div className="border-b border-white/[0.06] pb-2">
          <div className="flex items-center justify-between text-[10px] text-cyan-400 font-semibold uppercase tracking-wider">
            <span>[AI Strategic Diagnostics]</span>
            <span className="text-[8px] text-slate-500">CONFIDENCE: {r.failureProbability}%</span>
          </div>
          <h3 className="text-sm font-bold text-slate-200 mt-1 uppercase tracking-tight">{r.service} - Incident Outage Threat</h3>
        </div>

        <div className="grid grid-cols-2 gap-3 text-[10px]">
          <div className="bg-white/[0.02] border border-white/[0.04] p-2 rounded-lg">
            <span className="text-slate-500 block uppercase text-[8px]">Projected Loss</span>
            <span className="text-sm font-bold text-red-400 mt-0.5 block">{r.impactLabel}</span>
            <span className="text-[7px] text-slate-600 block">SLA credits & billing exposure</span>
          </div>
          <div className="bg-white/[0.02] border border-white/[0.04] p-2 rounded-lg">
            <span className="text-slate-500 block uppercase text-[8px]">Threat Priority</span>
            <span className="text-sm font-bold text-orange-400 mt-0.5 block">LEVEL-0{r.rank}</span>
            <span className="text-[7px] text-slate-600 block">Immediate action required</span>
          </div>
        </div>

        <div className="space-y-1.5 text-[9px] bg-slate-800/20 p-2.5 rounded-lg border border-white/[0.04]">
          <div className="flex items-start gap-1">
            <span className="text-cyan-500 font-bold shrink-0">DIAGNOSTIC:</span>
            <span className="text-slate-400">
              High telemetry anomaly patterns matching historical cascading failures. Circuit breaker saturation in {r.service} likely to trigger downstream degradations.
            </span>
          </div>
          <div className="flex items-start gap-1 mt-1.5">
            <span className="text-emerald-500 font-bold shrink-0">REACTION:</span>
            <span className="text-slate-300">
              Scale cluster capacity, spin up additional worker nodes, and authorize cache memory expansions to contain blast radius.
            </span>
          </div>
        </div>
      </div>

      <div className="relative z-10 border-t border-white/[0.06] pt-3 flex items-center justify-between gap-2">
        <div className="flex flex-col">
          <span className="text-[7px] text-slate-600 uppercase">Recommendation Level</span>
          <span className="text-[9px] font-bold text-emerald-400 uppercase">Containment Active</span>
        </div>
        <Link
          to="/execution-planner"
          className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-3.5 py-2 text-[10px] font-bold text-white hover:shadow-lg hover:shadow-cyan-500/20 transition-all hover:scale-[1.02]"
        >
          EXECUTE MITIGATION
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </div>
    </div>
  )
}

function RootCauseSnapshots() {
  const causes = mockData.rootCauses
  return (
    <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-gradient-to-br from-slate-900 to-slate-900/50 p-3 sm:p-4">
      <div className="flex items-center justify-between mb-2.5">
        <h2 className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.15em] font-mono">Root Cause Snapshots</h2>
        <StatusBadge status="warning" label="ANALYSIS" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {causes.map((rc, idx) => (
          <motion.div key={rc.id} variants={item} className="rounded-lg border border-white/[0.04] bg-white/[0.01] p-3 hover:bg-white/[0.03] transition-all group">
            <div className="flex items-center gap-1.5 mb-2">
              <span className="h-2 w-2 rounded-full bg-cyan-400" />
              <span className="text-[8px] font-mono text-slate-600 uppercase tracking-wider">{rc.service}</span>
              <span className="text-[8px] font-mono text-slate-700 ml-auto">{rc.duration}</span>
            </div>
            <p className="text-[10px] font-medium text-slate-200 mb-2">{rc.cause}</p>
            <div className="flex items-center justify-between"><span className="text-[8px] font-mono text-slate-700">Confidence: {rc.confidence}</span><span className="text-[8px] font-mono text-red-400">{rc.impact}</span></div>
            <div className="flex items-center gap-2 mt-1.5"><MiniSparkline data={rc.sparkData} color="#22d3ee" width={56} height={12} /></div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

function ExecutiveRecommendations() {
  const recommendations = mockData.recommendations
  return (
    <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-gradient-to-br from-slate-900 to-slate-900/50 p-3 sm:p-4">
      <div className="flex items-center justify-between mb-2.5">
        <h2 className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.15em] font-mono">Executive Recommendations</h2>
        <StatusBadge status="info" label="AI-DRIVEN" />
      </div>
      <div className="space-y-2">
        {recommendations.map((rec, idx) => (
          <motion.div key={rec.id} variants={item} className="rounded-lg border-l-2 border-l-cyan-500 border border-white/[0.04] bg-white/[0.01] p-3 flex items-start gap-3">
            <div className={`rounded-full p-1.5 shrink-0 ${rec.priority === 'critical' ? 'bg-red-500/20' : rec.priority === 'high' ? 'bg-orange-500/20' : 'bg-cyan-500/20'}`}>
              <span className={`text-[10px] ${rec.priority === 'critical' ? 'text-red-400' : rec.priority === 'high' ? 'text-orange-400' : 'text-cyan-400'}`}>{rec.priority === 'critical' ? '!' : rec.priority === 'high' ? '\u25B3' : '\u2713'}</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1"><span className={`text-[9px] font-bold uppercase tracking-wider ${rec.priority === 'critical' ? 'text-red-400' : rec.priority === 'high' ? 'text-orange-400' : 'text-cyan-400'}`}>{rec.title}</span><span className="text-[8px] font-mono text-slate-700">{String(rec.priority ?? '').toUpperCase()}</span></div>
              <p className="text-[10px] text-slate-400">{rec.description}</p>
              <div className="flex items-center gap-3 mt-1"><span className="text-[8px] font-mono text-slate-700">Confidence: {rec.confidence}</span><span className="text-[8px] font-mono text-emerald-400/80">Impact: {rec.impact}</span></div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

function LiveSystemTopology() {
  const nodes = mockData.systemTopology || []
  return (
    <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-gradient-to-br from-slate-900 to-slate-900/50 p-3 sm:p-4">
      <div className="flex items-center justify-between mb-2.5">
        <h2 className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.15em] font-mono">Live System Topology</h2>
        <div className="flex items-center gap-2"><StatusBadge status="info" label="REALTIME" /><span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" /></span></div>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
        {nodes.map((node, idx) => {
          if (!node) return null
          const dotColor = node.status === 'healthy' ? 'bg-emerald-500' : node.status === 'degraded' ? 'bg-amber-500' : 'bg-red-500'
          const borderColor = node.status === 'healthy' ? 'border-emerald-500/20' : node.status === 'degraded' ? 'border-amber-500/20' : 'border-red-500/20'
          return (
            <motion.div key={node.name || idx} variants={item} className={`rounded-lg border ${borderColor} bg-white/[0.01] p-2 hover:bg-white/[0.03] transition-all cursor-pointer`}>
              <div className="flex items-center gap-1 mb-1"><span className={`h-2 w-2 rounded-full ${dotColor} ${node.status === 'healthy' ? 'animate-pulse' : ''}`} /><span className="text-[8px] font-mono text-slate-600 truncate">{node.service || '-'}</span></div>
              <p className="text-[9px] text-slate-200 font-medium truncate">{node.name || '-'}</p>
              <p className="text-[7px] font-mono text-slate-700 truncate">{node.details || ''}</p>
              <MiniGauge value={node.cpu ?? 0} suffix="%" danger={(node.cpu ?? 0) > 85} warn={(node.cpu ?? 0) > 60} width={40} height={16} fontSize={5} strokeWidth={2} />
            </motion.div>
          )
        })}
      </div>
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/[0.04] text-[8px] font-mono text-slate-700">
        <span>Total Services: {nodes.filter(n => n && n.status).length}</span>
        <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />{nodes.filter(n => n && n.status === 'healthy').length} Healthy</span>
        <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-amber-500" />{nodes.filter(n => n && n.status === 'degraded').length} Degraded</span>
        <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-red-500" />{nodes.filter(n => n && n.status === 'critical').length} Critical</span>
      </div>
    </motion.div>
  )
}

function DeploymentForecast() {
  const forecast = mockData.deploymentForecast
  return (
    <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-gradient-to-br from-slate-900 to-slate-900/50 p-3 sm:p-4">
      <div className="flex items-center justify-between mb-2.5">
        <h2 className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.15em] font-mono">Deployment Forecast</h2>
        <StatusBadge status="info" label="7-DAY OUTLOOK" />
      </div>
      <div className="grid grid-cols-7 gap-2">
        {forecast.map((day, idx) => (
          <motion.div key={day.day} variants={item} className="rounded-lg border border-white/[0.04] bg-white/[0.01] p-2 text-center hover:bg-white/[0.03] transition-all">
            <div className="text-[8px] font-mono text-slate-600 uppercase">{day.day}</div>
            <div className="text-sm sm:text-base font-bold font-mono text-cyan-400 my-1">{day.value}</div>
            <div className="w-6 h-12 mx-auto relative bg-white/[0.02] rounded-sm overflow-hidden"><motion.div initial={{ height: 0 }} whileInView={{ height: `${day.pct}%` }} viewport={{ once: true }} transition={{ duration: 0.8, delay: idx * 0.08 }} className="absolute bottom-0 w-full rounded-sm bg-gradient-to-t from-cyan-600 to-cyan-400" style={{ height: `${day.pct}%` }} /></div>
            <div className="text-[7px] font-mono text-slate-700 mt-1">{day.events} deploys</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

function BoardroomView() {
  const items = mockData.boardroomMetrics
  return (
    <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-gradient-to-br from-slate-900 to-slate-900/50 p-3 sm:p-4">
      <div className="flex items-center justify-between mb-2.5">
        <h2 className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.15em] font-mono">Boardroom View</h2>
        <StatusBadge status="success" label="EXECUTIVE" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {items.map((m, idx) => {
          const trendIcon = m.trend === 'up' ? '\u2191' : '\u2193'
          const trendColor = m.trend === 'up' ? 'text-emerald-400' : 'text-red-400'
          return (
            <motion.div key={m.label} variants={item} className="rounded-lg border border-white/[0.04] bg-white/[0.01] p-3 hover:bg-white/[0.03] transition-all group">
              <div className="flex items-center gap-1.5 mb-1.5"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: m.dot }} /><span className="text-[8px] font-mono text-slate-600 uppercase tracking-wider">{m.label}</span></div>
              <div className={`text-lg sm:text-xl font-bold font-mono ${m.color} truncate`}>{m.prefix}{m.value}{m.suffix}</div>
              <div className="flex items-center gap-1.5 mt-0.5"><span className={`text-[9px] font-mono ${trendColor}`}>{trendIcon} {m.pct}%</span></div>
              <p className="text-[8px] text-slate-600 mt-1">{m.change}</p>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
function DailyBriefingExpanded() {
  const db = mockData.dailyBriefing
  const risks = mockData.executiveInsights || []
  const recommendations = mockData.recommendations || []
  return (
    <motion.div variants={item} className="relative overflow-hidden rounded-xl border border-white/[0.08] bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-900/50 p-2 sm:p-3 group hover:border-cyan-500/30 transition-all duration-500">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:32px_32px]" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2 flex-wrap gap-1.5">
          <div className="flex items-center gap-2">
            <div className="relative flex h-7 w-7 items-center justify-center rounded-lg border border-cyan-500/30 bg-cyan-500/10">
              <svg className="h-3.5 w-3.5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
            </div>
            <div><h2 className="text-xs font-bold text-cyan-400 uppercase tracking-[0.15em] font-mono">Daily AI Briefing</h2><p className="text-[7px] font-mono text-cyan-400/60">AI Generated Intelligence Report</p></div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-500 opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500" /></span>
            <span className="text-[8px] font-mono text-cyan-400/80 tracking-wider uppercase">Live</span>
            <StatusBadge status="info" label="AI" />
          </div>
        </div>
        <div className="mb-1.5"><span className="text-xs font-semibold text-slate-200">{db.greeting} {db.body}</span></div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mb-2">
          <div className="rounded-lg bg-white/[0.03] border border-white/[0.05] p-1.5"><span className="text-[7px] font-mono text-slate-600 uppercase tracking-wider">Analyzed</span><div className="text-xs font-bold font-mono text-cyan-400">{db.analyzed}</div></div>
          <div className="rounded-lg bg-white/[0.03] border border-white/[0.05] p-1.5"><span className="text-[7px] font-mono text-slate-600 uppercase tracking-wider">Accuracy</span><div className="text-xs font-bold font-mono text-emerald-400">{db.accuracy}</div></div>
          <div className="rounded-lg bg-white/[0.03] border border-white/[0.05] p-1.5"><span className="text-[7px] font-mono text-slate-600 uppercase tracking-wider">Savings</span><div className="text-xs font-bold font-mono text-amber-400">{db.savings}</div></div>
          <div className="rounded-lg bg-white/[0.03] border border-white/[0.05] p-1.5"><span className="text-[7px] font-mono text-slate-600 uppercase tracking-wider">Confidence</span><div className="text-xs font-bold font-mono text-emerald-400">{db.confidence}%</div></div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
          <div className="rounded-lg border border-red-500/15 bg-red-500/[0.03] p-1.5">
            <div className="flex items-center gap-1 mb-1"><span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" /><span className="text-[7px] font-mono text-red-400 uppercase tracking-wider font-semibold">Critical Risks</span></div>
            <p className="text-[9px] text-slate-400 leading-tight">{recommendations[0]?.title || 'Scale Payment Worker Pool'}</p>
          </div>
          <div className="rounded-lg border border-amber-500/15 bg-amber-500/[0.03] p-1.5">
            <div className="flex items-center gap-1 mb-1"><svg className="h-2.5 w-2.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg><span className="text-[7px] font-mono text-amber-400 uppercase tracking-wider font-semibold">Predicted Incidents</span></div>
            <p className="text-[9px] text-slate-400 leading-tight">{risks[1]?.title || 'Redis memory predicts cache instability'}</p>
          </div>
          <div className="rounded-lg border border-cyan-500/15 bg-cyan-500/[0.03] p-1.5">
            <div className="flex items-center gap-1 mb-1"><svg className="h-2.5 w-2.5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg><span className="text-[7px] font-mono text-cyan-400 uppercase tracking-wider font-semibold">AI Recommendations</span></div>
            <p className="text-[9px] text-slate-400 leading-tight">{recommendations[1]?.title || 'Increase Redis Memory Limit'}</p>
          </div>
          <div className="rounded-lg border border-emerald-500/15 bg-emerald-500/[0.03] p-1.5">
            <div className="flex items-center gap-1 mb-1"><svg className="h-2.5 w-2.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg><span className="text-[7px] font-mono text-emerald-400 uppercase tracking-wider font-semibold">Executive Actions</span></div>
            <p className="text-[9px] text-slate-400 leading-tight">{recommendations[2]?.title || 'Hold Billing Deployments'}</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function ExecutiveInsightsExpanded() {
  const findings = mockData.executiveInsights
  return (
    <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-gradient-to-br from-slate-900 to-slate-900/50 p-3 sm:p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <svg className="h-4 w-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
          <h2 className="text-sm font-semibold text-amber-400 uppercase tracking-[0.15em] font-mono">Executive Intelligence</h2>
          <StatusBadge status="warning" label="AI" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {findings.map((f, idx) => {
          const sevCfg = { critical: { borderL: 'border-l-red-500', text: 'text-red-400', badge: 'critical', dot: 'bg-red-500' }, high: { borderL: 'border-l-orange-500', text: 'text-orange-400', badge: 'warning', dot: 'bg-orange-500' } }
          const c = sevCfg[f.severity] || sevCfg.high
          return (
            <motion.div key={f.id} variants={item} className={`rounded-xl border border-white/[0.05] border-l-2 ${c.borderL} bg-white/[0.02] p-4 hover:bg-white/[0.04] transition-all group`}>
              <div className="flex items-center gap-2 mb-2.5">
                <span className={`h-2.5 w-2.5 rounded-full ${c.dot} ${f.severity === 'critical' ? 'animate-ping' : ''}`} />
                <StatusBadge status={c.badge} label={f.severity === 'critical' ? 'Critical' : 'High'} />
              </div>
              <p className="text-sm font-medium text-slate-200 mb-3 leading-relaxed">{f.title}</p>
              <div className="space-y-2 mb-3">
                <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500"><svg className="h-3.5 w-3.5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" /></svg>Impact: <span className={c.text}>{f.impact}</span></div>
                <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500"><svg className="h-3.5 w-3.5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>Confidence: <span className="text-emerald-400">{f.confidence}</span></div>
                <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500"><svg className="h-3.5 w-3.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>Action: <span className="text-slate-300">{f.action}</span></div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

function BusinessImpactCenterExpanded() {
  const items = mockData.businessImpactCenter
  return (
    <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-gradient-to-br from-slate-900 to-slate-900/50 p-3 sm:p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <svg className="h-4 w-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>
          <h2 className="text-sm font-semibold text-amber-400 uppercase tracking-[0.15em] font-mono">Business Impact Center</h2>
          <StatusBadge status="warning" label="Risk" />
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {items.map((biz, idx) => {
          const val = useCounter(biz.value, idx * 60, 1500, biz.value >= 1000)
          const displayVal = typeof val === 'string' ? val : val.toLocaleString()
          return (
            <motion.div key={biz.label} variants={item} className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-3 hover:bg-white/[0.04] transition-all group">
              <div className="flex items-center gap-1.5 mb-1.5"><span className={`h-2 w-2 rounded-full ${biz.dotColor}`} /><span className="text-[9px] font-mono text-slate-600 uppercase tracking-wider">{biz.label}</span></div>
              <div className={`text-lg sm:text-xl font-bold font-mono ${biz.color} truncate`}>{biz.prefix}{displayVal}{biz.suffix}</div>
              <div className="flex items-center gap-1.5 mt-0.5"><span className={`text-[10px] font-mono ${biz.trend === 'up' ? 'text-red-400' : 'text-emerald-400'}`}>{biz.trend === 'up' ? '\u2191' : '\u2193'} {biz.pct}%</span></div>
              <p className="text-[8px] text-slate-600 mt-1">{biz.description}</p>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

function PredictionWallExpanded() {
  const predictions = mockData.aiPredictions
  return (
    <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-gradient-to-br from-slate-900 to-slate-900/50 p-3 sm:p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <svg className="h-4 w-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" /></svg>
          <h2 className="text-sm font-semibold text-cyan-400 uppercase tracking-[0.15em] font-mono">AI Prediction Wall</h2>
          <StatusBadge status="info" label="Forecast" />
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {predictions.map((p, idx) => {
          const count = useCounter(parseInt(p.value), idx * 80, 1500)
          return (
            <motion.div key={p.title} variants={item} className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-4 hover:bg-white/[0.04] transition-all group">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} /><span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">{p.title}</span></div>
                <MiniSparkline data={p.sparkData} color={p.color} width={56} height={14} />
              </div>
              <div className="flex items-baseline gap-1"><span className={`text-2xl font-bold font-mono ${p.textColor}`}>{count}{p.unit}</span></div>
              <p className="text-[9px] text-slate-600 mt-1">{p.description}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="h-1 w-1 rounded-full" style={{ backgroundColor: p.trend === 'declining' ? '#ef4444' : p.trend === 'stable' ? '#22d3ee' : '#34d399' }} />
<span className="text-[8px] font-mono text-slate-700">{String(p.trend ?? '').charAt(0).toUpperCase() + String(p.trend ?? '').slice(1)}</span>
              </div>
              <div className="flex flex-wrap gap-1 mt-2 pt-2 border-t border-white/[0.03]">{p.factors.map((f, fi) => (<span key={fi} className="rounded-md bg-white/[0.02] border border-white/[0.03] px-1.5 py-0.5 text-[7px] font-mono text-slate-700">{f}</span>))}</div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

function TopRisksLeaderboardExpanded() {
  const [selectedRisk, setSelectedRisk] = useState(mockData.topRisks[0])
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
      <div className="lg:col-span-3">
        <EnterpriseRiskGalaxy selectedRisk={selectedRisk} onSelectRisk={setSelectedRisk} />
      </div>
      <div className="lg:col-span-2">
        <AISpotlightPanel selectedRisk={selectedRisk} />
      </div>
    </div>
  )
}

function RootCauseSnapshotsExpanded() {
  const causes = mockData.rootCauses
  return (
    <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-gradient-to-br from-slate-900 to-slate-900/50 p-3 sm:p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <svg className="h-4 w-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" /></svg>
          <h2 className="text-sm font-semibold text-cyan-400 uppercase tracking-[0.15em] font-mono">Root Cause Snapshots</h2>
          <StatusBadge status="warning" label="Analysis" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {causes.map((rc, idx) => (
          <motion.div key={rc.id} variants={item} className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-4 hover:bg-white/[0.04] transition-all group">
            <div className="flex items-center gap-1.5 mb-2">
              <span className="h-2 w-2 rounded-full bg-cyan-400" />
              <span className="text-[9px] font-mono text-slate-600 uppercase tracking-wider">{rc.service}</span>
              <span className="text-[9px] font-mono text-slate-700 ml-auto">{rc.duration}</span>
            </div>
            <p className="text-sm font-medium text-slate-200 mb-3">{rc.cause}</p>
            <div className="flex items-center justify-between"><span className="text-[10px] font-mono text-slate-700">Confidence: {rc.confidence}</span><span className="text-[10px] font-mono text-red-400">{rc.impact}</span></div>
            <div className="flex items-center gap-2 mt-2"><MiniSparkline data={rc.sparkData} color="#22d3ee" width={64} height={14} /></div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

function ExecutiveRecommendationsExpanded() {
  const recommendations = mockData.recommendations
  return (
    <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-gradient-to-br from-slate-900 to-slate-900/50 p-3 sm:p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <svg className="h-4 w-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
          <h2 className="text-sm font-semibold text-cyan-400 uppercase tracking-[0.15em] font-mono">Executive Recommendations</h2>
          <StatusBadge status="info" label="AI-Driven" />
        </div>
      </div>
      <div className="space-y-3">
        {recommendations.map((rec, idx) => (
          <motion.div key={rec.id} variants={item} className="rounded-xl border-l-2 border-l-cyan-500 border border-white/[0.04] bg-white/[0.02] p-4 flex items-start gap-3 hover:bg-white/[0.04] transition-all">
            <div className={`rounded-full p-2 shrink-0 ${rec.priority === 'critical' ? 'bg-red-500/20' : rec.priority === 'high' ? 'bg-orange-500/20' : 'bg-cyan-500/20'}`}>
              <span className={`text-sm ${rec.priority === 'critical' ? 'text-red-400' : rec.priority === 'high' ? 'text-orange-400' : 'text-cyan-400'}`}>{rec.priority === 'critical' ? '!' : rec.priority === 'high' ? '\u25B3' : '\u2713'}</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1"><span className={`text-[11px] font-bold uppercase tracking-wider ${rec.priority === 'critical' ? 'text-red-400' : rec.priority === 'high' ? 'text-orange-400' : 'text-cyan-400'}`}>{rec.title}</span><span className="text-[9px] font-mono text-slate-700">{String(rec.priority ?? '').toUpperCase()}</span></div>
              <p className="text-sm text-slate-400 mb-2">{rec.description}</p>
              <div className="flex items-center gap-3"><span className="text-[10px] font-mono text-slate-700">Confidence: {rec.confidence}</span><span className="text-[10px] font-mono text-emerald-400/80">Impact: {rec.impact}</span></div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

function LiveSystemTopologyExpanded() {
  const nodes = mockData.systemTopology || []
  return (
    <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-gradient-to-br from-slate-900 to-slate-900/50 p-3 sm:p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <svg className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          <h2 className="text-sm font-semibold text-emerald-400 uppercase tracking-[0.15em] font-mono">Live System Topology</h2>
          <StatusBadge status="success" label="Realtime" />
        </div>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
        {nodes.map((node, idx) => {
          if (!node) return null
          const dotColor = node.status === 'healthy' ? 'bg-emerald-500' : node.status === 'degraded' ? 'bg-amber-500' : 'bg-red-500'
          const borderColor = node.status === 'healthy' ? 'border-emerald-500/20' : node.status === 'degraded' ? 'border-amber-500/20' : 'border-red-500/20'
          return (
            <motion.div key={node.name || idx} variants={item} className={`rounded-lg border ${borderColor} bg-white/[0.02] p-2 hover:bg-white/[0.04] transition-all cursor-pointer`}>
              <div className="flex items-center gap-1 mb-1"><span className={`h-2 w-2 rounded-full ${dotColor} ${node.status === 'healthy' ? 'animate-pulse' : ''}`} /><span className="text-[8px] font-mono text-slate-600 truncate">{node.service || '-'}</span></div>
              <p className="text-[10px] text-slate-200 font-medium truncate">{node.name || '-'}</p>
              <p className="text-[8px] font-mono text-slate-700 truncate">{node.details || ''}</p>
              <MiniGauge value={node.cpu ?? 0} suffix="%" danger={(node.cpu ?? 0) > 85} warn={(node.cpu ?? 0) > 60} width={40} height={16} fontSize={5} strokeWidth={2} />
            </motion.div>
          )
        })}
      </div>
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.04] text-[10px] font-mono text-slate-700">
        <span>Total: {nodes.length}</span>
        <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />{nodes.filter(n => n && n.status === 'healthy').length} Healthy</span>
        <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-amber-500" />{nodes.filter(n => n && n.status === 'degraded').length} Degraded</span>
        <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-red-500" />{nodes.filter(n => n && n.status === 'critical').length} Critical</span>
      </div>
    </motion.div>
  )
}

function DeploymentForecastExpanded() {
  const forecast = mockData.deploymentForecast || []
  return (
    <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-gradient-to-br from-slate-900 to-slate-900/50 p-3 sm:p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <svg className="h-4 w-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" /></svg>
          <h2 className="text-sm font-semibold text-cyan-400 uppercase tracking-[0.15em] font-mono">Deployment Forecast</h2>
          <StatusBadge status="info" label="7-Day Outlook" />
        </div>
      </div>
      <div className="grid grid-cols-7 gap-3">
        {forecast.map((day, idx) => (
          <motion.div key={day?.day || idx} variants={item} className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-3 text-center hover:bg-white/[0.04] transition-all">
            <div className="text-[10px] font-mono text-slate-600 uppercase">{day?.day || '-'}</div>
            <div className="text-base sm:text-lg font-bold font-mono text-cyan-400 my-2">{day?.value ?? '-'}</div>
            <div className="w-8 h-16 mx-auto relative bg-white/[0.02] rounded-sm overflow-hidden"><motion.div initial={{ height: 0 }} whileInView={{ height: `${day?.pct || 0}%` }} viewport={{ once: true }} transition={{ duration: 0.8, delay: idx * 0.08 }} className="absolute bottom-0 w-full rounded-sm bg-gradient-to-t from-cyan-600 to-cyan-400" style={{ height: `${day?.pct || 0}%` }} /></div>
            <div className="text-[8px] font-mono text-slate-700 mt-1">{day?.events ?? 0} deploys</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

function BoardroomViewExpanded() {
  const items = mockData.boardroomMetrics || []
  return (
    <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-gradient-to-br from-slate-900 to-slate-900/50 p-3 sm:p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <svg className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12H12m-8.25 5.25h16.5" /></svg>
          <h2 className="text-sm font-semibold text-emerald-400 uppercase tracking-[0.15em] font-mono">Boardroom View</h2>
          <StatusBadge status="success" label="Executive" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {items.map((m, idx) => {
          if (!m) return null
          const trendIcon = m.trend === 'up' ? '\u2191' : '\u2193'
          const trendColor = m.trend === 'up' ? 'text-emerald-400' : 'text-red-400'
          return (
            <motion.div key={m.label || idx} variants={item} className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-4 hover:bg-white/[0.04] transition-all group">
              <div className="flex items-center gap-1.5 mb-1.5"><span className="h-2 w-2 rounded-full" style={{ backgroundColor: m.dot || '#64748b' }} /><span className="text-[9px] font-mono text-slate-600 uppercase tracking-wider">{m.label || '-'}</span></div>
              <div className={`text-lg sm:text-xl font-bold font-mono ${m.color || 'text-white'} truncate`}>{m.prefix || ''}{m.value ?? '-'}{m.suffix || ''}</div>
              <div className="flex items-center gap-1.5 mt-0.5"><span className={`text-[10px] font-mono ${trendColor}`}>{trendIcon} {m.pct ?? 0}%</span></div>
              <p className="text-[9px] text-slate-600 mt-1">{m.change || ''}</p>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
function SectionInsightBanner({ id, severity, text }) {
  const sevColors = { critical: 'border-l-red-500 bg-red-500/5 text-red-400', high: 'border-l-orange-500 bg-orange-500/5 text-orange-400', medium: 'border-l-amber-500 bg-amber-500/5 text-amber-400', low: 'border-l-emerald-500 bg-emerald-500/5 text-emerald-400' }
  const sevIcons = { critical: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z', high: 'M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z', medium: 'M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z', low: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z' }
  return (
    <motion.div key={id} variants={item} className={`rounded-lg border border-white/[0.04] border-l-2 ${sevColors[severity] || sevColors.low} p-3 flex items-start gap-3`}>
      <svg className="h-4 w-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={sevIcons[severity] || sevIcons.low} /></svg>
      <p className="text-[11px] leading-relaxed text-slate-400">{text}</p>
    </motion.div>
  )
}

function RiskAnalyticsDashboard() {
  const riskImpact = mockData.businessImpactCenter || []
  const riskMetrics = mockData.aiRiskMetrics || []
  return (
    <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-gradient-to-br from-slate-900 to-slate-900/50 p-3 sm:p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <svg className="h-4 w-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
          <h2 className="text-sm font-semibold text-red-400 uppercase tracking-[0.15em] font-mono">Risk Analytics Dashboard</h2>
          <StatusBadge status="critical" label="Real-Time" />
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {riskMetrics.map((rm, idx) => {
          if (!rm) return null
          const val = useCounter(parseInt(String(rm.value ?? '0')), idx * 80, 1500, Number(rm.value) >= 1000)
          const displayVal = typeof val === 'string' ? val : val.toLocaleString()
          return (
            <motion.div key={rm.label || idx} variants={item} className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-3 hover:bg-white/[0.04] transition-all">
              <div className="flex items-center gap-1.5 mb-1.5"><span className={`h-2 w-2 rounded-full ${rm.dot || 'bg-slate-500'}`} /><span className="text-[9px] font-mono text-slate-600 uppercase tracking-wider">{rm.label || '-'}</span></div>
              <div className={`text-lg sm:text-xl font-bold font-mono ${rm.color || 'text-white'}`}>{rm.prefix || ''}{displayVal}{rm.suffix || ''}</div>
              <div className="flex items-center gap-1.5 mt-0.5"><span className={`text-[10px] font-mono ${rm.trend === 'up' ? 'text-red-400' : 'text-emerald-400'}`}>{rm.trend === 'up' ? '\u2191' : '\u2193'} {rm.pct ?? 0}%</span></div>
            </motion.div>
          )
        })}
      </div>
      <div className="mt-3 pt-3 border-t border-white/[0.04] flex items-center justify-between text-[10px] font-mono">
        <span className="text-slate-500">Aggregate Risk Score</span>
        <span className="text-red-400 font-bold">{riskMetrics.reduce((a, b) => a + (typeof b.value === 'number' ? b.value : parseInt(String(b.value ?? '0').replace(/,/g, '')) || 0), 0)}</span>
        <span className="text-amber-400/80">Threshold: 75</span>
      </div>
    </motion.div>
  )
}

function SkeletonBlock({ className }) {
  return <div className={`animate-pulse rounded-xl bg-white/[0.03] ${className || ''}`} />
}

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-slate-950">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>
      <div className="relative z-10 max-w-[2000px] mx-auto px-2 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-6 space-y-1.5 sm:space-y-2">
        <SkeletonBlock className="h-12 w-full" />
        <SkeletonBlock className="h-8 w-full" />
        <SkeletonBlock className="h-48 w-full" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1.5 sm:gap-2">
          {[1,2,3,4,5,6].map(i => <SkeletonBlock key={i} className="h-28" />)}
        </div>
        <SkeletonBlock className="h-64 w-full" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1.5 sm:gap-2">
          {[1,2,3,4].map(i => <SkeletonBlock key={i} className="h-24" />)}
        </div>
        <SkeletonBlock className="h-48 w-full" />
        <SkeletonBlock className="h-48 w-full" />
        <SkeletonBlock className="h-48 w-full" />
        <SkeletonBlock className="h-48 w-full" />
        <SkeletonBlock className="h-48 w-full" />
        <SkeletonBlock className="h-64 w-full" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1.5 sm:gap-2">
          {[1,2,3].map(i => <SkeletonBlock key={i} className="h-32" />)}
        </div>
        <SkeletonBlock className="h-48 w-full" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-1.5 sm:gap-2">
          <SkeletonBlock className="h-48" /><SkeletonBlock className="h-48" />
        </div>
        <SkeletonBlock className="h-48 w-full" />
        <SkeletonBlock className="h-48 w-full" />
      </div>
    </div>
  )
}

function KpiRibbon() {
  const kpis = mockData.kpis
  const icons = {
    'System Health': 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z',
    'Active Incidents': 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z',
    'MTTR (min)': 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0zm-4.5 4.5h.008v.008H12v-.008z',
    'Services Monitored': 'M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25',
    'Uptime': 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z',
    'Risk Score': 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z',
  }
  return (
    <motion.div variants={item} className="rounded-lg border border-white/[0.06] bg-slate-900/50 py-1 px-2">
      <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
        {kpis.map((k, i) => (
          <div key={k.label} className="flex items-center gap-1 shrink-0 rounded-md bg-white/[0.02] border border-white/[0.04] px-1.5 py-0.5">
            <svg className={`h-2.5 w-2.5 ${k.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d={icons[k.label] || icons['System Health']} />
            </svg>
            <span className={`text-[10px] font-bold font-mono leading-none ${k.color}`}>
              {k.label === 'Uptime' ? '99.97' : k.value}{k.format === '%' ? '%' : k.format === 'm' ? 'm' : ''}
            </span>
            <span className="text-[7px] font-mono text-slate-600 truncate max-w-[52px] hidden sm:block">{k.label}</span>
            <span className={`text-[7px] font-mono ${k.trend === 'up' ? 'text-red-400' : k.trend === 'down' ? 'text-emerald-400' : 'text-slate-600'}`}>
              {k.trend === 'up' ? '\u2191' : k.trend === 'down' ? '\u2193' : '\u2192'}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

function AnimatedCounter({ value, suffix = '', prefix = '', delay = 0, decimals = 2 }) {
  const count = useCounter(value, delay, 1500, false)
  const displayVal = typeof count === 'number' && !Number.isInteger(count) && decimals > 0 ? count.toFixed(decimals) : typeof count === 'number' ? count : count
  return <>{prefix}{displayVal}{suffix}</>
}

function ExecutiveIntelligenceHero() {
  const metrics = [
    { label: 'Revenue Protected', value: 2.4, prefix: '$', suffix: 'M', color: 'text-emerald-400', decimals: 1, ref: mockData.executiveSummaryExpanded.revenueProtected,
      icon: 'M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z',
      bgGrad: 'from-emerald-500/10 via-emerald-500/5 to-transparent' },
    { label: 'Services At Risk', value: 3, prefix: '', suffix: '', color: 'text-red-400', decimals: 0, ref: mockData.executiveInsights.length,
      icon: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z',
      bgGrad: 'from-red-500/10 via-red-500/5 to-transparent' },
    { label: 'AI Confidence', value: 96.8, prefix: '', suffix: '%', color: 'text-cyan-400', decimals: 1, ref: mockData.executiveSummaryExpanded.aiAccuracy,
      icon: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z',
      bgGrad: 'from-cyan-500/10 via-cyan-500/5 to-transparent' },
    { label: 'Predicted Incident Cost', value: 288, prefix: '$', suffix: 'K', color: 'text-orange-400', decimals: 0, ref: mockData.costAnalysis.riskMitigationSavings,
      icon: 'M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z',
      bgGrad: 'from-orange-500/10 via-orange-500/5 to-transparent' },
    { label: 'MTTR Reduction', value: 18.7, prefix: '', suffix: 'm', color: 'text-violet-400', decimals: 1, ref: mockData.executiveSummaryExpanded.meanTimeToResolve,
      icon: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0zm-4.5 4.5h.008v.008H12v-.008z',
      bgGrad: 'from-violet-500/10 via-violet-500/5 to-transparent' },
    { label: 'Risk Forecast', value: 72, prefix: '', suffix: '', color: 'text-amber-400', decimals: 0, ref: mockData.riskTrends.weekOverWeek.current,
      icon: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z',
      bgGrad: 'from-amber-500/10 via-amber-500/5 to-transparent' },
  ]
  return (
    <motion.div variants={item} className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-slate-900/30 backdrop-blur-2xl p-3 sm:p-4 md:p-6 shadow-2xl">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(6,182,212,0.08),transparent_70%)]" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3 sm:mb-4 flex-wrap gap-2">
          <div>
            <span className="text-[9px] sm:text-[10px] font-mono text-cyan-400 uppercase tracking-[0.2em] font-semibold">Orbit Intelligence Suite</span>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight mt-1">Executive Intelligence Command Center</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="text-[9px] sm:text-[10px] font-mono text-emerald-400 font-semibold tracking-wider">LIVE</span>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
          {metrics.map((m, idx) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.5, ease: 'easeOut' }}
              className="relative overflow-hidden rounded-xl border border-white/[0.06] bg-slate-900/50 backdrop-blur-xl p-3 sm:p-4 group hover:border-white/[0.15] hover:shadow-lg hover:shadow-white/5 transition-all duration-300"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${m.bgGrad} opacity-40 group-hover:opacity-60 transition-opacity duration-500`} />
              <div className="relative z-10">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                  <svg className={`h-3 w-3 sm:h-3.5 sm:w-3.5 ${m.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={m.icon} />
                  </svg>
                  <span className="text-[8px] sm:text-[9px] font-mono text-slate-500 uppercase tracking-wider truncate">{m.label}</span>
                </div>
                <div className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold font-mono tracking-tight ${m.color}`}>
                  <AnimatedCounter value={m.value} prefix={m.prefix} suffix={m.suffix} delay={idx * 80} decimals={m.decimals === 0 ? 0 : 1} />
                </div>
                <div className="mt-1 pt-1 border-t border-white/[0.03] flex items-center justify-between">
                  <span className="text-[7px] sm:text-[8px] font-mono text-slate-700">{m.ref}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

function EnterpriseRiskGalaxySVG() {
  const [selectedIdx, setSelectedIdx] = useState(null)
  const risks = mockData.topRisks || []
  const leaderboard = mockData.topRisksLeaderboard || []
  const maxImpact = Math.max(...risks.map(r => r.impact), 1)
  const w = 800; const h = 300
  const cx = w / 2; const cy = h / 2
  const radius = 110
  const positions = risks.map((_, i) => {
    const angle = (i / risks.length) * Math.PI * 2 - Math.PI / 2
    return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) }
  })
  const connections = [[0,1],[0,2],[1,5],[2,5],[3,0],[3,4]]
  const getSev = (s) => s === 'Critical' ? { fill: '#ef4444', glow: 'rgba(239,68,68,0.5)', cls: 'bg-red-500' } : s === 'Warning' ? { fill: '#f97316', glow: 'rgba(249,115,22,0.4)', cls: 'bg-orange-500' } : s === 'Elevated' ? { fill: '#eab308', glow: 'rgba(234,179,8,0.3)', cls: 'bg-amber-500' } : { fill: '#22d3ee', glow: 'rgba(34,211,238,0.2)', cls: 'bg-cyan-500' }
  return (
    <motion.div variants={item} className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-slate-900/30 backdrop-blur-xl p-3 sm:p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-500 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan-500" />
          </span>
          <h2 className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.15em] font-mono">Enterprise Risk Galaxy</h2>
        </div>
        <span className="text-[8px] sm:text-[9px] font-mono text-slate-600">Risk Network Topology</span>
      </div>
      <div className="relative w-full overflow-hidden rounded-xl bg-[radial-gradient(ellipse_at_center,#0f172a_0%,#020617_100%)]" style={{ height: 300 }}>
        <svg className="absolute inset-0 w-full h-full opacity-[0.08]" viewBox={`0 0 ${w} ${h}`}>
          <defs>
            <pattern id="rg-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(6,182,212,0.15)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width={w} height={h} fill="url(#rg-grid)" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
          <div className="w-[120px] h-[120px] rounded-full border border-dashed border-cyan-500/10 animate-[spin_40s_linear_infinite]" />
          <div className="absolute w-[220px] h-[220px] rounded-full border border-dashed border-cyan-500/10 animate-[spin_60s_linear_infinite]" style={{ animationDirection: 'reverse' }} />
        </div>
        <svg className="absolute inset-0 w-full h-full" viewBox={`0 0 ${w} ${h}`} style={{ pointerEvents: 'none' }}>
          {connections.map((conn, i) => {
            const from = positions[conn[0]]; const to = positions[conn[1]]
            const hl = selectedIdx !== null && (conn[0] === selectedIdx || conn[1] === selectedIdx)
            return <motion.line key={i} x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={hl ? 'rgba(34,211,238,0.3)' : 'rgba(255,255,255,0.04)'} strokeWidth={hl ? 1.5 : 0.5} strokeDasharray={hl ? '4 3' : 'none'} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + i * 0.04 }} />
          })}
        </svg>
        {risks.map((r, i) => {
          const pos = positions[i]; const sev = getSev(r.status)
          const sz = 14 + (r.impact / maxImpact) * 28; const hl = selectedIdx === i
          return (
            <motion.div key={r.service} className="absolute cursor-pointer z-10" style={{ left: pos.x - sz / 2, top: pos.y - sz / 2 }}
              initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.08, type: 'spring', stiffness: 150, damping: 12 }}
              whileHover={{ scale: 1.15 }} onClick={() => setSelectedIdx(hl ? null : i)}
            >
              <div className="absolute rounded-full animate-pulse" style={{ width: sz * 2.5, height: sz * 2.5, left: -sz * 0.75, top: -sz * 0.75, background: `radial-gradient(circle, ${sev.glow}, transparent 70%)`, opacity: hl ? 0.8 : 0.25 }} />
              <div className={`rounded-full border-2 flex items-center justify-center ${hl ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-slate-950' : ''}`}
                style={{ width: sz, height: sz, backgroundColor: sev.fill + '25', borderColor: sev.fill + '50', boxShadow: hl ? `0 0 ${sz}px ${sev.glow}` : `0 0 10px ${sev.glow}` }}>
                <div className="rounded-full bg-white/70" style={{ width: sz * 0.3, height: sz * 0.3 }} />
              </div>
              <div className="absolute whitespace-nowrap pointer-events-none" style={{ left: '50%', transform: 'translateX(-50%)', top: sz + 3 }}>
                <span className="text-[7px] sm:text-[8px] font-mono text-slate-400 font-semibold">{r.service}</span>
                <span className="text-[6px] sm:text-[7px] font-mono text-slate-600 ml-0.5">{r.impactLabel}</span>
              </div>
            </motion.div>
          )
        })}
      </div>
      <AnimatePresence>
        {selectedIdx !== null && risks[selectedIdx] && (
          <motion.div initial={{ opacity: 0, y: -8, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, y: -8, height: 0 }} transition={{ duration: 0.3 }} className="mt-2 rounded-xl border border-cyan-500/20 bg-cyan-500/[0.04] p-3 overflow-hidden">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <div className={`h-2 w-2 rounded-full ${getSev(risks[selectedIdx].status).cls}`} />
                  <span className="text-xs font-semibold text-slate-200">{risks[selectedIdx].service}</span>
                  <StatusBadge status={risks[selectedIdx].status === 'Critical' ? 'critical' : risks[selectedIdx].status === 'Warning' ? 'warning' : 'info'} label={risks[selectedIdx].status} />
                  <span className="text-[8px] font-mono text-slate-700 ml-auto">Risk Score: {risks[selectedIdx].riskScore}</span>
                </div>
                <p className="text-[10px] text-slate-400 mb-1.5">{leaderboard[selectedIdx]?.title || `${risks[selectedIdx].service} - Risk assessment`}</p>
                <div className="flex items-center gap-3 text-[9px] font-mono flex-wrap">
                  <span className="text-red-400">Impact: {risks[selectedIdx].impactLabel}</span>
                  <span className="text-amber-400">Failure Probability: {risks[selectedIdx].failureProbability}%</span>
                </div>
                <p className="text-[9px] text-slate-500 mt-1">Recommended: {leaderboard[selectedIdx]?.title?.replace(/^.*? /, '').replace(/ .*$/, '') || 'Mitigate risk'} - {risks[selectedIdx].impactLabel} exposure</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex items-center gap-3 mt-2 pt-2 border-t border-white/[0.04] text-[8px] font-mono text-slate-700 flex-wrap">
        <span className="text-[8px] uppercase tracking-wider font-semibold">Severity:</span>
        <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-red-500" />Critical</span>
        <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-orange-500" />Warning</span>
        <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-amber-500" />Elevated</span>
        <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />Stable</span>
        <span className="ml-auto text-[7px] text-slate-700">Click node for details</span>
      </div>
    </motion.div>
  )
}

function AIStrategicInsightsPanel() {
  const fullText = mockData.dailyBriefing.body
  const [textIdx, setTextIdx] = useState(0)
  const [cursor, setCursor] = useState(true)
  const predictions = mockData.aiPredictions || []
  const topInsight = mockData.executiveInsights[0] || {}
  useEffect(() => {
    const t = setTimeout(() => {
      const i = setInterval(() => { setTextIdx(p => p >= fullText.length ? p : p + 1) }, 18)
      return () => clearInterval(i)
    }, 400)
    return () => clearTimeout(t)
  }, [fullText])
  useEffect(() => { const i = setInterval(() => setCursor(c => !c), 530); return () => clearInterval(i) }, [])
  const trendColors = { declining: '#ef4444', stable: '#22d3ee', improving: '#34d399' }
  return (
    <motion.div variants={item} className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-slate-950/90 backdrop-blur-xl p-3 sm:p-4 font-mono">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.025)_1px,transparent_1px)] bg-[size:20px_20px]" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3 border-b border-green-500/10 pb-2 flex-wrap gap-1">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[9px] sm:text-[10px] text-green-500 font-semibold uppercase tracking-wider">ORBIT_AI_TERMINAL v4.2.1</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[8px] text-green-700">CONFIDENCE: {mockData.dailyBriefing.confidence}%</span>
            <span className="text-[8px] text-slate-700">|</span>
            <span className="text-[8px] text-slate-600">{mockData.refreshIntervals.predictions}</span>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="text-[9px] text-green-500 font-bold">$</span>
              <span className="text-[9px] sm:text-[10px] text-green-400 font-semibold uppercase tracking-wider">STRATEGIC FORECAST</span>
            </div>
            <div className="rounded-lg bg-green-950/30 border border-green-500/10 p-2.5 sm:p-3 min-h-[90px]">
              <p className="text-[10px] sm:text-[11px] text-green-400/90 leading-relaxed">
                {fullText.slice(0, textIdx)}
                {cursor && textIdx < fullText.length && <span className="text-green-500 animate-pulse">_</span>}
                {textIdx >= fullText.length && <span className={`text-green-500 ${cursor ? 'opacity-100' : 'opacity-0'} transition-opacity`}>_</span>}
              </p>
            </div>
            <div className="flex items-center gap-2 text-[7px] sm:text-[8px] text-green-700 flex-wrap">
              <span>AI_GENERATED</span>
              <span className="text-slate-700">|</span>
              <span>ANALYZED: {mockData.dailyBriefing.analyzed}</span>
              <span className="text-slate-700">|</span>
              <span>ACCURACY: {mockData.dailyBriefing.accuracy}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="text-[9px] text-green-500 font-bold">#</span>
              <span className="text-[9px] sm:text-[10px] text-green-400 font-semibold uppercase tracking-wider">PREDICTIVE ANALYTICS</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
              {predictions.slice(0, 4).map((p, idx) => {
                const pVal = parseInt(p.value) || 0
                const circumference = 2 * Math.PI * 10
                const pct = Math.min(pVal, 100)
                return (
                  <div key={p.title} className="rounded-lg bg-green-950/30 border border-green-500/10 p-2 sm:p-2.5 group hover:bg-green-950/40 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[7px] sm:text-[8px] text-green-600 uppercase tracking-wider truncate">{p.title}</span>
                      <svg width="24" height="24" viewBox="0 0 24 24" className="shrink-0 -rotate-90">
                        <circle cx="12" cy="12" r="10" fill="none" stroke="rgba(34,197,94,0.12)" strokeWidth="2.5" />
                        <motion.circle cx="12" cy="12" r="10" fill="none" stroke={p.color || '#22d3ee'} strokeWidth="2.5" strokeLinecap="round"
                          strokeDasharray={circumference}
                          initial={{ strokeDashoffset: circumference }}
                          animate={{ strokeDashoffset: circumference * (1 - pct / 100) }}
                          transition={{ duration: 1.2, delay: idx * 0.1, ease: 'easeOut' }} />
                        <text x="12" y="15" textAnchor="middle" fill={p.color || '#22d3ee'} fontSize="7" fontWeight="700" fontFamily="monospace" transform="rotate(90 12 12)">{pVal}%</text>
                      </svg>
                    </div>
                    <div className={`text-[10px] sm:text-xs font-bold ${p.textColor || 'text-green-400'}`}>{p.value}{p.unit}</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {p.factors.slice(0, 2).map((f, fi) => (
                        <span key={fi} className="text-[6px] sm:text-[7px] text-green-700 bg-green-950/50 px-1 py-0.5 rounded">{f}</span>
                      ))}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="h-1 w-1 rounded-full" style={{ backgroundColor: trendColors[p.trend] || '#64748b' }} />
                      <span className="text-[6px] text-green-700">{String(p.trend ?? '').charAt(0).toUpperCase() + String(p.trend ?? '').slice(1)}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        {topInsight.title && (
          <div className="mt-3 pt-3 border-t border-green-500/10">
            <div className="rounded-lg bg-red-950/20 border border-red-500/20 p-2.5 sm:p-3">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
                <span className="text-[9px] text-red-400 font-bold uppercase tracking-wider">MOST LIKELY OUTAGE</span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-300 mb-2">{topInsight.title}</p>
              <div className="flex items-center gap-3 sm:gap-4 text-[8px] sm:text-[9px] font-mono flex-wrap">
                <span className="text-red-400">Projected Loss: {topInsight.impact}</span>
                <span className="text-emerald-400">Confidence: {topInsight.confidence}</span>
              </div>
              <p className="text-[8px] sm:text-[9px] text-amber-400/80 mt-1.5">Recommended Action: {topInsight.action}</p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default function Dashboard() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return <DashboardSkeleton />
  return (
    <Layout>
      <motion.div initial="hidden" animate="show" variants={container} className="relative z-10 max-w-[2000px] mx-auto space-y-4">
        <ExecutiveIntelligenceHero />

        <EnterpriseRiskGalaxySVG />

        <AIStrategicInsightsPanel />

        {/* Executive Intelligence Command Center Header & Metrics */}
        <div className="rounded-xl border border-white/[0.08] bg-slate-900/40 backdrop-blur-md p-5 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-[0.2em] font-semibold">Mission Control HUD</span>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-0.5">Executive Intelligence Command Center</h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-[10px] font-mono text-emerald-400 font-semibold tracking-wider">ALL CORE OPERATIONS STABLE</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
            {[
              { label: 'Revenue Protected', value: 2.8, prefix: '$', suffix: 'M', color: 'text-emerald-400', trend: 'up', pct: 12, sparkData: [1.8, 2.0, 2.2, 2.4, 2.5, 2.7, 2.8] },
              { label: 'Services At Risk', value: 3, prefix: '', suffix: ' Critical', color: 'text-red-400', trend: 'up', pct: 20, sparkData: [1, 2, 2, 3, 2, 3, 3] },
              { label: 'AI Confidence', value: 96, prefix: '', suffix: '%', color: 'text-cyan-400', trend: 'stable', pct: 0.5, sparkData: [94, 95, 95, 96, 96, 96, 96] },
              { label: 'Predicted Incident Cost', value: 4.5, prefix: '$', suffix: 'K/m', color: 'text-orange-400', trend: 'down', pct: 8.4, sparkData: [5.2, 5.0, 4.8, 4.7, 4.5, 4.5, 4.5] },
              { label: 'MTTR Reduction', value: 31, prefix: '-', suffix: '%', color: 'text-violet-400', trend: 'up', pct: 14.3, sparkData: [24, 26, 27, 28, 30, 29, 31] },
              { label: 'Risk Forecast', value: 72, prefix: 'Score: ', suffix: '', color: 'text-amber-400', trend: 'down', pct: 5.2, sparkData: [78, 76, 75, 74, 72, 72, 72] }
            ].map((kpi, idx) => {
              const val = useCounter(kpi.value, idx * 60, 1500, kpi.value >= 1000)
              const displayVal = typeof val === 'number' ? val : kpi.value
              return (
                <div key={kpi.label} className="rounded-xl border border-white/[0.05] bg-slate-900/30 p-3 hover:border-white/[0.1] transition-all group relative overflow-hidden">
                  <span className="text-[8px] font-mono text-slate-500 uppercase tracking-wider block mb-0.5">{kpi.label}</span>
                  <div className="flex items-baseline justify-between gap-1 mt-1">
                    <span className={`text-2xl sm:text-3xl font-extrabold font-mono tracking-tight ${kpi.color}`}>
                      {kpi.prefix}{displayVal}{kpi.suffix}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-white/[0.02]">
                    <span className={`text-[9px] font-mono ${kpi.trend === 'up' && kpi.color.includes('red') ? 'text-red-400' : 'text-emerald-400'}`}>
                      {kpi.trend === 'up' ? '↑' : kpi.trend === 'down' ? '↓' : '→'} {kpi.pct}%
                    </span>
                    <MiniSparkline data={kpi.sparkData} color={kpi.color.includes('red') ? '#ef4444' : kpi.color.includes('emerald') ? '#34d399' : kpi.color.includes('cyan') ? '#22d3ee' : kpi.color.includes('orange') ? '#f97316' : kpi.color.includes('violet') ? '#a78bfa' : '#f59e0b'} width={44} height={12} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Core Galaxy and Bloomberg Insights Panel */}
        <TopRisksLeaderboardExpanded />

        {/* Topology Mesh map */}
        <LiveSystemTopologyExpanded />

        {/* Executive Insights & Highlights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ExecutiveInsightsExpanded />
          <PredictionWallExpanded />
        </div>

        {/* Heatmap & Alerts Feed Combined */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <RiskHeatmap />
          <AlertsFeed />
        </div>

        {/* Lower graphs / timelines */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <DeploymentTimeline />
          <ActivityTimeline />
        </div>

        <BoardroomViewExpanded />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <IncidentsByService />
          <SloSummary />
        </div>

        <NarrativeCTA currentPage="/dashboard" confidence={96} impact="$288K potential exposure" />
      </motion.div>
    </Layout>
  )
}
