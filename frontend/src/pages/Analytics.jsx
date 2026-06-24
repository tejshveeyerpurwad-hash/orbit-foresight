import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, ComposedChart, Legend, RadialBarChart, RadialBar } from 'recharts'
import Layout from '../components/Layout'
import StatCard from '../components/StatCard'
import StatusBadge from '../components/StatusBadge'
import PageHero from '../components/PageHero'
import ExecutiveSummary from '../components/ExecutiveSummary'

const incidentTrends = [
  { month: 'Jan', incidents: 12, prevented: 8, autoResolved: 5, escalated: 7, p1: 2, p2: 4, p3: 6 },
  { month: 'Feb', incidents: 9, prevented: 11, autoResolved: 6, escalated: 3, p1: 1, p2: 3, p3: 5 },
  { month: 'Mar', incidents: 15, prevented: 7, autoResolved: 4, escalated: 11, p1: 3, p2: 5, p3: 7 },
  { month: 'Apr', incidents: 7, prevented: 14, autoResolved: 9, escalated: 2, p1: 1, p2: 2, p3: 4 },
  { month: 'May', incidents: 10, prevented: 12, autoResolved: 7, escalated: 5, p1: 2, p2: 3, p3: 5 },
  { month: 'Jun', incidents: 5, prevented: 16, autoResolved: 12, escalated: 1, p1: 0, p2: 1, p3: 4 },
  { month: 'Jul', incidents: 8, prevented: 13, autoResolved: 10, escalated: 2, p1: 1, p2: 2, p3: 5 },
]

const deploymentData = [
  { name: 'Payments', success: 92, failed: 8, total: 100, p95Latency: 45, errorBudget: 92, deploysThisMonth: 18, rollbacks: 1 },
  { name: 'Billing', success: 85, failed: 15, total: 100, p95Latency: 120, errorBudget: 78, deploysThisMonth: 14, rollbacks: 2 },
  { name: 'Auth', success: 98, failed: 2, total: 100, p95Latency: 12, errorBudget: 98, deploysThisMonth: 22, rollbacks: 0 },
  { name: 'Notifications', success: 78, failed: 22, total: 100, p95Latency: 180, errorBudget: 65, deploysThisMonth: 10, rollbacks: 3 },
  { name: 'API Gateway', success: 95, failed: 5, total: 100, p95Latency: 28, errorBudget: 94, deploysThisMonth: 26, rollbacks: 1 },
  { name: 'Webhooks', success: 88, failed: 12, total: 100, p95Latency: 65, errorBudget: 85, deploysThisMonth: 16, rollbacks: 1 },
]

const riskData = [
  { name: 'Low Risk', value: 45, color: '#22c55e', count: 234, trend: '+8%' },
  { name: 'Medium Risk', value: 30, color: '#f59e0b', count: 156, trend: '-3%' },
  { name: 'High Risk', value: 18, color: '#ef4444', count: 94, trend: '-12%' },
  { name: 'Critical', value: 7, color: '#dc2626', count: 36, trend: '-22%' },
]

const teamData = [
  { name: 'Payments', commits: 142, incidents: 4, velocity: 85, prs: 38, reviews: 52, deployments: 24, storyPoints: 210, bugs: 6, sprintDays: 14, teamSize: 8 },
  { name: 'Billing', commits: 98, incidents: 2, velocity: 72, prs: 22, reviews: 34, deployments: 18, storyPoints: 165, bugs: 4, sprintDays: 14, teamSize: 6 },
  { name: 'Auth', commits: 76, incidents: 0, velocity: 91, prs: 28, reviews: 48, deployments: 20, storyPoints: 180, bugs: 1, sprintDays: 14, teamSize: 5 },
  { name: 'Notifications', commits: 54, incidents: 1, velocity: 64, prs: 16, reviews: 22, deployments: 12, storyPoints: 110, bugs: 3, sprintDays: 14, teamSize: 4 },
  { name: 'Platform', commits: 112, incidents: 3, velocity: 78, prs: 32, reviews: 44, deployments: 22, storyPoints: 195, bugs: 5, sprintDays: 14, teamSize: 7 },
  { name: 'Webhooks', commits: 48, incidents: 2, velocity: 58, prs: 14, reviews: 18, deployments: 10, storyPoints: 95, bugs: 2, sprintDays: 14, teamSize: 4 },
  { name: 'API Gateway', commits: 88, incidents: 1, velocity: 82, prs: 26, reviews: 38, deployments: 20, storyPoints: 160, bugs: 2, sprintDays: 14, teamSize: 6 },
]

const healthData = [
  { name: 'Uptime', value: 99.97, fill: '#22c55e', target: 99.95, trend: '+0.02%', status: 'exceeded' },
  { name: 'Latency', value: 42, fill: '#06b6d4', target: 50, trend: '-8ms', status: 'met' },
  { name: 'Error Rate', value: 0.3, fill: '#f59e0b', target: 0.5, trend: '-0.2%', status: 'met' },
  { name: 'Throughput', value: 8.2, fill: '#8b5cf6', target: 7.0, trend: '+1.2K', status: 'exceeded' },
  { name: 'Saturation', value: 67, fill: '#ef4444', target: 75, trend: '-5%', status: 'met' },
]

const serviceAnalytics = [
  { name: 'Payment', incidents: 3, deploySuccess: 92, latency: 45, errorRate: 0.8, status: 'healthy', p99Latency: 120, requests: 450000, teamSize: 8, alerts: 2, region: 'us-east-1', cpu: 42, memory: 68, dbLatency: 5 },
  { name: 'Billing', incidents: 7, deploySuccess: 85, latency: 120, errorRate: 2.1, status: 'warning', p99Latency: 340, requests: 280000, teamSize: 6, alerts: 5, region: 'us-west-2', cpu: 76, memory: 88, dbLatency: 22 },
  { name: 'Auth', incidents: 1, deploySuccess: 98, latency: 12, errorRate: 0.2, status: 'healthy', p99Latency: 28, requests: 890000, teamSize: 5, alerts: 1, region: 'eu-west-1', cpu: 34, memory: 45, dbLatency: 2 },
  { name: 'Notifications', incidents: 5, deploySuccess: 78, latency: 180, errorRate: 3.4, status: 'critical', p99Latency: 520, requests: 190000, teamSize: 4, alerts: 8, region: 'us-east-1', cpu: 82, memory: 91, dbLatency: 45 },
  { name: 'API Gateway', incidents: 2, deploySuccess: 95, latency: 28, errorRate: 0.4, status: 'healthy', p99Latency: 65, requests: 1200000, teamSize: 7, alerts: 3, region: 'global', cpu: 55, memory: 62, dbLatency: 3 },
  { name: 'Webhooks', incidents: 4, deploySuccess: 88, latency: 65, errorRate: 1.5, status: 'warning', p99Latency: 180, requests: 150000, teamSize: 4, alerts: 4, region: 'us-west-2', cpu: 48, memory: 72, dbLatency: 12 },
]

const incidentTimeline = [
  { id: 1, date: '2026-06-18', severity: 'critical', service: 'Billing', duration: '3h 12m', status: 'resolved', desc: 'Worker OOM crash loop due to memory leak in invoice processing pipeline', resolvedBy: 'SRE team', runbook: 'RBL-102', tags: ['memory', 'billing'] },
  { id: 2, date: '2026-06-16', severity: 'high', service: 'Notifications', duration: '1h 45m', status: 'resolved', desc: 'Queue backpressure spike from SMS provider outage', resolvedBy: 'Platform team', runbook: 'NTS-045', tags: ['queue', 'provider'] },
  { id: 3, date: '2026-06-14', severity: 'medium', service: 'API Gateway', duration: '28m', status: 'resolved', desc: 'Latency degradation from connection pool exhaustion', resolvedBy: 'Infra team', runbook: 'GWY-023', tags: ['latency', 'connection'] },
  { id: 4, date: '2026-06-12', severity: 'low', service: 'Webhooks', duration: '15m', status: 'resolved', desc: 'SSL cert rotation delay during automated renewal', resolvedBy: 'Security team', runbook: 'WHK-011', tags: ['ssl', 'certificate'] },
  { id: 5, date: '2026-06-10', severity: 'critical', service: 'Payment', duration: '2h 05m', status: 'resolved', desc: 'Payment processing failure from database replica lag', resolvedBy: 'SRE team', runbook: 'PMT-088', tags: ['database', 'replica'] },
  { id: 6, date: '2026-06-08', severity: 'high', service: 'Auth', duration: '12m', status: 'resolved', desc: 'Session token validation error after JWT key rotation', resolvedBy: 'Security team', runbook: 'AUT-034', tags: ['auth', 'jwt'] },
  { id: 7, date: '2026-06-06', severity: 'medium', service: 'Billing', duration: '55m', status: 'resolved', desc: 'Invoice generation delay due to upstream API throttling', resolvedBy: 'Billing team', runbook: 'RBL-107', tags: ['api', 'throttling'] },
  { id: 8, date: '2026-06-04', severity: 'low', service: 'Notifications', duration: '8m', status: 'resolved', desc: 'Template rendering glitch from missing locale data', resolvedBy: 'Platform team', runbook: 'NTS-048', tags: ['template', 'locale'] },
  { id: 9, date: '2026-06-02', severity: 'medium', service: 'API Gateway', duration: '18m', status: 'resolved', desc: 'Rate limit configuration mismatch after canary deployment', resolvedBy: 'Infra team', runbook: 'GWY-027', tags: ['rate-limit', 'config'] },
  { id: 10, date: '2026-05-30', severity: 'low', service: 'Webhooks', duration: '6m', status: 'resolved', desc: 'Webhook signature verification timeout spike', resolvedBy: 'Platform team', runbook: 'WHK-015', tags: ['webhook', 'timeout'] },
  { id: 11, date: '2026-05-28', severity: 'critical', service: 'Payment', duration: '4h 30m', status: 'resolved', desc: 'Payment gateway downstream outage cascading to all payment flows', resolvedBy: 'SRE team', runbook: 'PMT-091', tags: ['gateway', 'downstream'] },
  { id: 12, date: '2026-05-26', severity: 'high', service: 'Auth', duration: '22m', status: 'resolved', desc: 'OAuth token exchange failure rate spiked to 12%', resolvedBy: 'Security team', runbook: 'AUT-037', tags: ['oauth', 'token'] },
  { id: 13, date: '2026-05-24', severity: 'medium', service: 'Billing', duration: '1h 10m', status: 'resolved', desc: 'Subscription renewal processing delayed by DB connection pool exhaustion', resolvedBy: 'Billing team', runbook: 'RBL-112', tags: ['database', 'connection'] },
  { id: 14, date: '2026-05-22', severity: 'low', service: 'API Gateway', duration: '5m', status: 'resolved', desc: 'Health check endpoint returning 503 due to stale cache', resolvedBy: 'Infra team', runbook: 'GWY-031', tags: ['health', 'cache'] },
]

const weeklyDeployments = [
  { week: 'W12', deploys: 18, failures: 2, failureRate: 11.1, rollbacks: 1, hotfixes: 0, canaries: 5, totalChanges: 42 },
  { week: 'W13', deploys: 22, failures: 1, failureRate: 4.5, rollbacks: 0, hotfixes: 1, canaries: 8, totalChanges: 51 },
  { week: 'W14', deploys: 15, failures: 3, failureRate: 20.0, rollbacks: 2, hotfixes: 1, canaries: 4, totalChanges: 38 },
  { week: 'W15', deploys: 20, failures: 2, failureRate: 10.0, rollbacks: 1, hotfixes: 0, canaries: 7, totalChanges: 46 },
  { week: 'W16', deploys: 25, failures: 1, failureRate: 4.0, rollbacks: 0, hotfixes: 0, canaries: 10, totalChanges: 58 },
  { week: 'W17', deploys: 19, failures: 4, failureRate: 21.1, rollbacks: 2, hotfixes: 1, canaries: 6, totalChanges: 44 },
  { week: 'W18', deploys: 23, failures: 2, failureRate: 8.7, rollbacks: 1, hotfixes: 0, canaries: 9, totalChanges: 53 },
  { week: 'W19', deploys: 17, failures: 1, failureRate: 5.9, rollbacks: 0, hotfixes: 0, canaries: 6, totalChanges: 40 },
  { week: 'W20', deploys: 21, failures: 3, failureRate: 14.3, rollbacks: 1, hotfixes: 1, canaries: 7, totalChanges: 49 },
  { week: 'W21', deploys: 26, failures: 1, failureRate: 3.8, rollbacks: 0, hotfixes: 0, canaries: 11, totalChanges: 60 },
  { week: 'W22', deploys: 24, failures: 2, failureRate: 8.3, rollbacks: 1, hotfixes: 0, canaries: 9, totalChanges: 55 },
  { week: 'W23', deploys: 28, failures: 1, failureRate: 3.6, rollbacks: 0, hotfixes: 0, canaries: 12, totalChanges: 64 },
]

const mttrData = [
  { name: 'Payment', minutes: 45, lastMonth: 62, trend: '-17m', best: 28, worst: 125, incidents: 6 },
  { name: 'Billing', minutes: 180, lastMonth: 210, trend: '-30m', best: 55, worst: 420, incidents: 12 },
  { name: 'Auth', minutes: 12, lastMonth: 15, trend: '-3m', best: 4, worst: 28, incidents: 3 },
  { name: 'Notifications', minutes: 120, lastMonth: 145, trend: '-25m', best: 45, worst: 310, incidents: 9 },
  { name: 'API Gateway', minutes: 28, lastMonth: 35, trend: '-7m', best: 12, worst: 55, incidents: 5 },
  { name: 'Webhooks', minutes: 35, lastMonth: 42, trend: '-7m', best: 18, worst: 78, incidents: 7 },
]

const slaMetrics = [
  { label: 'Uptime', value: '99.97%', goal: '99.95%', status: 'exceeded', bar: 99.97, trend: '+0.02%', description: 'Composite across all service regions and AZs' },
  { label: 'Response Time', value: '99.2%', goal: '99.0%', status: 'met', bar: 99.2, trend: '+0.4%', description: 'Percentage of requests under 200ms P95' },
  { label: 'Error Budget', value: '82%', goal: '100%', status: 'healthy', bar: 82, trend: '+5%', description: 'Remaining annual error budget for all services' },
  { label: 'Availability', value: '99.95%', goal: '99.9%', status: 'exceeded', bar: 99.95, trend: '+0.03%', description: 'Availability excluding planned maintenance windows' },
  { label: 'Performance', value: '97.8%', goal: '95%', status: 'met', bar: 97.8, trend: '+2.1%', description: 'Performance score based on Lighthouse and RUM data' },
  { label: 'Durability', value: '99.999%', goal: '99.999%', status: 'exceeded', bar: 99.999, trend: '0%', description: 'Data durability across all storage systems' },
  { label: 'Recovery Time', value: '98.5%', goal: '97%', status: 'met', bar: 98.5, trend: '+0.8%', description: 'Services recovering within RTO targets' },
]

const costImpactData = [
  { label: 'Revenue Saved', value: '$2.8M', change: '↑ 15%', color: 'text-green-400', detail: 'From prevented outages and reduced downtime' },
  { label: 'Incidents Avoided', value: '81', change: '↑ 24%', color: 'text-green-400', detail: 'AI-predicted incidents mitigated preemptively' },
  { label: 'Engineering Hours Saved', value: '340', change: '↑ 42%', color: 'text-cyan-400', detail: 'Reduced toil through automation and self-healing' },
  { label: 'Customer Satisfaction', value: '94 NPS', change: '↑ 8 pts', color: 'text-purple-400', detail: 'Post-incident satisfaction survey scores' },
  { label: 'MTTR Reduction', value: '28%', change: '↓ 12 min avg', color: 'text-emerald-400', detail: 'Year-over-year improvement in mean time to repair' },
  { label: 'Deploy Velocity', value: '24/wk', change: '↑ 18%', color: 'text-blue-400', detail: 'Average weekly deployment frequency across all services' },
  { label: 'Error Budget Saved', value: '14 days', change: '↑ 6 days', color: 'text-yellow-400', detail: 'Additional error budget remaining vs prior quarter' },
  { label: 'Automation Coverage', value: '76%', change: '↑ 12%', color: 'text-indigo-400', detail: 'Percentage of incidents handled without manual intervention' },
  { label: 'Incident Cost Avoidance', value: '$420K', change: '↑ 32%', color: 'text-rose-400', detail: 'Estimated cost of incidents prevented this quarter' },
  { label: 'On-Call Hours Reduced', value: '180 hrs', change: '↓ 25%', color: 'text-orange-400', detail: 'Reduction in after-hours on-call engineering time' },
]

const aiInsights = [
  { icon: '⚡', title: 'Circuit breaker failures down 67%', desc: 'After the retry backoff fix in Payment service, breaker trips dropped from 12/week to 4. Recommended: monitor for 2 more weeks before expanding pattern to Billing service.', impact: 'high', tag: 'Reliability', confidence: 94, category: 'resilience' },
  { icon: '🧠', title: 'Billing worker OOM risk decreased 45%', desc: 'Memory profiling and heap limit reduction cut OOM kills from 11 to 6 per month. The GOMEMLIMIT env var is working as expected across all worker pools. Consider applying to Notification workers.', impact: 'high', tag: 'Performance', confidence: 91, category: 'performance' },
  { icon: '📬', title: 'Webhook delivery success up to 99.2%', desc: 'Retry queue optimization with exponential backoff and idempotency keys improved delivery rate from 94.7% to 99.2%. Current P99 delivery time is 2.3s. Target: 1.5s.', impact: 'medium', tag: 'Delivery', confidence: 88, category: 'reliability' },
  { icon: '🔐', title: 'Auth latency reduced 32%', desc: 'Token caching layer cut P95 auth latency from 18ms to 12ms. Redis cache hit rate is 94%. Consider increasing TTL from 300s to 600s for further gains without stale risk.', impact: 'medium', tag: 'Latency', confidence: 92, category: 'performance' },
  { icon: '🌐', title: 'API Gateway error rate steady at 0.4%', desc: 'Rate limiting and circuit breaker patterns maintaining consistent error rates below 0.5% threshold. No anomalies detected in past 72 hours across any route.', impact: 'low', tag: 'Stability', confidence: 96, category: 'stability' },
  { icon: '📊', title: 'Notification queue depth normalizing', desc: 'After the SMS provider incident, queue depth returned to baseline of 200 messages. Dead-letter queue has 14 unprocessed messages from the provider spike.', impact: 'medium', tag: 'Observability', confidence: 87, category: 'observability' },
  { icon: '🔧', title: 'Payment DB replica lag at 50ms', desc: 'Read replica lag reduced from 2s to 50ms after connection pooling and query optimization changes. All payment reads now served from replicas with <100ms staleness.', impact: 'high', tag: 'Performance', confidence: 93, category: 'performance' },
  { icon: '🔄', title: 'Canary deployment failure rate at 2.1%', desc: 'New canary analysis shows 2.1% failure rate vs 5.8% for direct deploys. Canary adoption is now at 78% of all production deployments. Target: 90% by Q4.', impact: 'low', tag: 'Delivery', confidence: 90, category: 'deployment' },
  { icon: '📈', title: 'Billing API P99 latency dropped 28%', desc: 'Query optimization on invoice listing endpoint reduced P99 from 340ms to 245ms. Index added on created_at + status composite column.', impact: 'medium', tag: 'Performance', confidence: 89, category: 'performance' },
  { icon: '🛡️', title: 'WAF block rate increased 15%', desc: 'Web application firewall blocking 15% more malicious requests after rule update. False positive rate steady at 0.02%. No customer-facing impact detected.', impact: 'low', tag: 'Security', confidence: 95, category: 'security' },
]

const trendForecast = [
  { month: 'Aug', predicted: 7, upper: 10, lower: 4, prevented: 14, autoResolved: 11, p95: 9 },
  { month: 'Sep', predicted: 5, upper: 8, lower: 3, prevented: 16, autoResolved: 13, p95: 7 },
  { month: 'Oct', predicted: 4, upper: 7, lower: 2, prevented: 18, autoResolved: 15, p95: 6 },
]

const executiveInsights = [
  { title: 'Incident Rate Declining 18% QoQ', desc: 'Platform-wide improvements driving sustained reduction in production incidents quarter over quarter. Auto-remediation now handles 72% of common alert patterns. Key drivers: circuit breaker rollout, improved monitoring, and standardized runbooks.', icon: '📉', color: 'border-emerald-500/30', metric: '18%', metricLabel: 'decline' },
  { title: 'AI Prevention Saving $240K/Month', desc: 'Automated prevention and self-healing mechanisms reducing engineering toil and revenue loss. ROI on AI ops investment now at 340% annualized. Top contributors: predictive anomaly detection and automated rollback triggers.', icon: '💰', color: 'border-cyan-500/30', metric: '$240K', metricLabel: 'monthly savings' },
  { title: 'Team Velocity Up 12%', desc: 'Squad velocity improving after platform reliability investments reduced context-switching. Average cycle time reduced by 2.4 days. PR review turnaround improved by 34%. Deployment frequency increased 18%.', icon: '🚀', color: 'border-purple-500/30', metric: '12%', metricLabel: 'velocity gain' },
  { title: 'Deployment Failure Rate at 5.8%', desc: 'Lowest recorded failure rate driven by improved CI/CD pipelines, enhanced canary deployments, and automated rollback triggers. Target for Q3 is 4.5%. Current rate is down from 8.2% at start of year.', icon: '✅', color: 'border-green-500/30', metric: '5.8%', metricLabel: 'failure rate' },
]

const hourlyIncidents = [
  { hour: '00:00', count: 1 }, { hour: '01:00', count: 0 }, { hour: '02:00', count: 0 }, { hour: '03:00', count: 0 },
  { hour: '04:00', count: 0 }, { hour: '05:00', count: 1 }, { hour: '06:00', count: 2 }, { hour: '07:00', count: 3 },
  { hour: '08:00', count: 5 }, { hour: '09:00', count: 8 }, { hour: '10:00', count: 6 }, { hour: '11:00', count: 7 },
  { hour: '12:00', count: 4 }, { hour: '13:00', count: 6 }, { hour: '14:00', count: 5 }, { hour: '15:00', count: 4 },
  { hour: '16:00', count: 3 }, { hour: '17:00', count: 4 }, { hour: '18:00', count: 2 }, { hour: '19:00', count: 1 },
  { hour: '20:00', count: 1 }, { hour: '21:00', count: 0 }, { hour: '22:00', count: 0 }, { hour: '23:00', count: 0 },
]

const severityBreakdown = [
  { name: 'P0 Critical', value: 8, color: '#dc2626', avgResponse: '2m', sla: '99.9%', count: 8, pctOfTotal: 6.5 },
  { name: 'P1 High', value: 22, color: '#f97316', avgResponse: '5m', sla: '99.5%', count: 22, pctOfTotal: 17.7 },
  { name: 'P2 Medium', value: 35, color: '#eab308', avgResponse: '15m', sla: '99.0%', count: 35, pctOfTotal: 28.2 },
  { name: 'P3 Low', value: 42, color: '#3b82f6', avgResponse: '30m', sla: '98.0%', count: 42, pctOfTotal: 33.9 },
  { name: 'P4 Info', value: 18, color: '#22c55e', avgResponse: '60m', sla: '95.0%', count: 18, pctOfTotal: 14.5 },
]

const onCallData = [
  { shift: 'Week 1', acknowledged: 12, missed: 1, avgResponseTime: '4m', pagesReceived: 14, escalated: 2 },
  { shift: 'Week 2', acknowledged: 8, missed: 0, avgResponseTime: '3m', pagesReceived: 8, escalated: 1 },
  { shift: 'Week 3', acknowledged: 15, missed: 2, avgResponseTime: '6m', pagesReceived: 18, escalated: 4 },
  { shift: 'Week 4', acknowledged: 10, missed: 0, avgResponseTime: '2m', pagesReceived: 11, escalated: 1 },
  { shift: 'Week 5', acknowledged: 9, missed: 1, avgResponseTime: '5m', pagesReceived: 11, escalated: 2 },
  { shift: 'Week 6', acknowledged: 13, missed: 0, avgResponseTime: '3m', pagesReceived: 14, escalated: 1 },
]

const weeklyMttrTrend = [
  { week: 'W12', minutes: 62 }, { week: 'W13', minutes: 55 }, { week: 'W14', minutes: 70 }, { week: 'W15', minutes: 48 },
  { week: 'W16', minutes: 52 }, { week: 'W17', minutes: 65 }, { week: 'W18', minutes: 42 }, { week: 'W19', minutes: 38 },
  { week: 'W20', minutes: 45 }, { week: 'W21', minutes: 35 }, { week: 'W22', minutes: 40 }, { week: 'W23', minutes: 32 },
]

const errorBudgetByService = [
  { name: 'Payments', consumed: 8, remaining: 92 },
  { name: 'Billing', consumed: 22, remaining: 78 },
  { name: 'Auth', consumed: 2, remaining: 98 },
  { name: 'Notifications', consumed: 35, remaining: 65 },
  { name: 'API Gateway', consumed: 6, remaining: 94 },
  { name: 'Webhooks', consumed: 15, remaining: 85 },
]

const changeTypeBreakdown = [
  { name: 'Feature', value: 142, color: '#22c55e' },
  { name: 'Bugfix', value: 68, color: '#f59e0b' },
  { name: 'Refactor', value: 34, color: '#06b6d4' },
  { name: 'Config', value: 22, color: '#8b5cf6' },
  { name: 'Infra', value: 18, color: '#ef4444' },
]

const regionHealth = [
  { name: 'us-east-1', uptime: 99.99, latency: 38, errors: 0.2, status: 'healthy' },
  { name: 'us-west-2', uptime: 99.97, latency: 45, errors: 0.4, status: 'healthy' },
  { name: 'eu-west-1', uptime: 99.98, latency: 42, errors: 0.3, status: 'healthy' },
  { name: 'eu-central-1', uptime: 99.96, latency: 48, errors: 0.5, status: 'warning' },
  { name: 'ap-southeast-1', uptime: 99.95, latency: 52, errors: 0.6, status: 'warning' },
]

const dbPerformance = [
  { name: 'Payments', queries: 1250000, avgLatency: 5, p99Latency: 22, connections: 42, poolUtilization: 68, cacheHit: 94, rowsExamined: 85000 },
  { name: 'Billing', queries: 890000, avgLatency: 22, p99Latency: 95, connections: 38, poolUtilization: 82, cacheHit: 78, rowsExamined: 210000 },
  { name: 'Auth', queries: 3200000, avgLatency: 2, p99Latency: 8, connections: 56, poolUtilization: 45, cacheHit: 97, rowsExamined: 18000 },
  { name: 'Notifications', queries: 450000, avgLatency: 45, p99Latency: 180, connections: 18, poolUtilization: 91, cacheHit: 62, rowsExamined: 320000 },
  { name: 'API Gateway', queries: 580000, avgLatency: 3, p99Latency: 12, connections: 28, poolUtilization: 52, cacheHit: 96, rowsExamined: 12000 },
  { name: 'Webhooks', queries: 310000, avgLatency: 12, p99Latency: 45, connections: 16, poolUtilization: 73, cacheHit: 85, rowsExamined: 65000 },
]

const cacheMetrics = [
  { name: 'Auth Tokens', hits: 940000, misses: 56000, hitRate: 94.4, memory: 1.2, ttl: 300 },
  { name: 'Payment Sessions', hits: 380000, misses: 42000, hitRate: 90.1, memory: 0.8, ttl: 600 },
  { name: 'API Responses', hits: 2100000, misses: 180000, hitRate: 92.1, memory: 3.4, ttl: 120 },
  { name: 'User Profiles', hits: 680000, misses: 32000, hitRate: 95.5, memory: 0.6, ttl: 900 },
  { name: 'Rate Limit State', hits: 4500000, misses: 50000, hitRate: 98.9, memory: 0.2, ttl: 60 },
  { name: 'Feature Flags', hits: 1200000, misses: 120000, hitRate: 90.9, memory: 0.3, ttl: 30 },
]

const releaseTrains = [
  { train: 'R24-06', changes: 42, incidents: 2, deployTime: '45m', rollbacks: 0, passRate: 97.6, services: 8 },
  { train: 'R24-07', changes: 38, incidents: 3, deployTime: '52m', rollbacks: 1, passRate: 94.2, services: 7 },
  { train: 'R24-08', changes: 51, incidents: 1, deployTime: '38m', rollbacks: 0, passRate: 98.9, services: 9 },
  { train: 'R24-09', changes: 45, incidents: 2, deployTime: '42m', rollbacks: 0, passRate: 96.5, services: 8 },
  { train: 'R24-10', changes: 55, incidents: 1, deployTime: '35m', rollbacks: 0, passRate: 99.1, services: 10 },
]

const dependencyHealth = [
  { name: 'Stripe API', uptime: 99.95, latency: 85, errors: 0.12, status: 'healthy', pctTraffic: 34 },
  { name: 'SendGrid', uptime: 99.88, latency: 120, errors: 0.45, status: 'warning', pctTraffic: 22 },
  { name: 'AWS S3', uptime: 99.99, latency: 18, errors: 0.02, status: 'healthy', pctTraffic: 78 },
  { name: 'Redis Cache', uptime: 99.97, latency: 1, errors: 0.01, status: 'healthy', pctTraffic: 95 },
  { name: 'PostgreSQL', uptime: 99.96, latency: 5, errors: 0.08, status: 'healthy', pctTraffic: 100 },
  { name: 'Kafka', uptime: 99.92, latency: 22, errors: 0.18, status: 'healthy', pctTraffic: 65 },
]

const alertFatigue = [
  { service: 'Payment', critical: 4, warning: 18, info: 42, actionable: 22, noise: 42 },
  { service: 'Billing', critical: 8, warning: 35, info: 58, actionable: 28, noise: 73 },
  { service: 'Auth', critical: 2, warning: 12, info: 28, actionable: 18, noise: 24 },
  { service: 'Notifications', critical: 6, warning: 42, info: 72, actionable: 20, noise: 100 },
  { service: 'API Gateway', critical: 3, warning: 22, info: 38, actionable: 25, noise: 38 },
  { service: 'Webhooks', critical: 5, warning: 28, info: 45, actionable: 22, noise: 56 },
]

const incidentCauseBreakdown = [
  { cause: 'Deploy Rollout', count: 22, pct: 33.3, trend: '-8%' },
  { cause: 'Upstream Dependency', count: 14, pct: 21.2, trend: '-5%' },
  { cause: 'Resource Exhaustion', count: 11, pct: 16.7, trend: '-12%' },
  { cause: 'Configuration Change', count: 8, pct: 12.1, trend: '-3%' },
  { cause: 'Data Migration', count: 5, pct: 7.6, trend: '+2%' },
  { cause: 'Security Event', count: 4, pct: 6.1, trend: '-15%' },
  { cause: 'Other', count: 2, pct: 3.0, trend: '-10%' },
]

const weeklySprintHealth = [
  { sprint: 'S12', planned: 120, completed: 108, velocity: 85, bugs: 8, debt: 12 },
  { sprint: 'S13', planned: 132, completed: 112, velocity: 88, bugs: 6, debt: 14 },
  { sprint: 'S14', planned: 115, completed: 98, velocity: 72, bugs: 12, debt: 18 },
  { sprint: 'S15', planned: 140, completed: 126, velocity: 92, bugs: 5, debt: 10 },
  { sprint: 'S16', planned: 128, completed: 108, velocity: 78, bugs: 9, debt: 15 },
  { sprint: 'S17', planned: 145, completed: 132, velocity: 94, bugs: 4, debt: 8 },
  { sprint: 'S18', planned: 135, completed: 118, velocity: 86, bugs: 7, debt: 11 },
]

const rollbackReasons = [
  { reason: 'Test Failure', count: 5, color: '#ef4444' },
  { reason: 'Performance Regression', count: 3, color: '#f97316' },
  { reason: 'Configuration Error', count: 2, color: '#eab308' },
  { reason: 'Observability Gap', count: 1, color: '#3b82f6' },
  { reason: 'Security Concern', count: 1, color: '#22c55e' },
]

const customTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !Array.isArray(payload)) return null
  return (
    <div className="rounded-lg border border-white/[0.06] bg-slate-900/90 p-3 text-xs shadow-xl backdrop-blur-xl">
      <p className="text-slate-400 mb-1 font-medium">{label || ''}</p>
      {payload.map((p, i) => {
        if (!p) return null
        const nm = p.name || ''
        return (
          <p key={i} className="text-slate-200" style={{ color: p.color || '#e2e8f0' }}>
            {nm}: {p.value ?? '-'}{nm === 'minutes' || nm === 'Min' ? 'm' : nm === 'Failure Rate' || nm === 'Change Failure Rate' ? '%' : ''}
            {nm === 'value' ? '%' : ''}
          </p>
        )
      })}
    </div>
  )
}

function ChartCard({ title, subtitle, children, delay = 0, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`rounded-xl border border-white/[0.06] bg-slate-900/50 p-4 overflow-hidden min-w-0 ${className}`}
    >
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        {subtitle && <p className="text-[10px] text-slate-600 mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </motion.div>
  )
}

function safeArr(arr) {
  return Array.isArray(arr) ? arr : []
}

function safeVal(v, fallback = 0) {
  return v ?? fallback
}

const container = { hidden: {}, show: { transition: { staggerChildren: 0.03 } } }
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }

export default function Analytics() {
  const [mounted, setMounted] = useState(false)
  const [selectedSeverity, setSelectedSeverity] = useState('all')
  const [showAllInsights, setShowAllInsights] = useState(false)
  const [selectedRegion, setSelectedRegion] = useState('all')
  const [selectedMetric, setSelectedMetric] = useState('incidents')
  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  const severityColor = (s) => {
    switch (s) {
      case 'critical': return 'bg-red-500'
      case 'high': return 'bg-orange-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-blue-500'
      default: return 'bg-slate-500'
    }
  }

  const slaBarColor = (v) => {
    if (v >= 99.9) return '#22c55e'
    if (v >= 99) return '#06b6d4'
    if (v >= 80) return '#f59e0b'
    return '#ef4444'
  }

  const filteredTimeline = (selectedSeverity === 'all' ? incidentTimeline : (incidentTimeline || []).filter(i => i?.severity === selectedSeverity)) || []

  const filteredServices = (selectedRegion === 'all' ? serviceAnalytics : (serviceAnalytics || []).filter(s => s?.region === selectedRegion)) || []

  const totalCostImpact = costImpactData.reduce((acc, c) => {
    const val = parseFloat(c.value.replace(/[^0-9.]/g, ''))
    return isNaN(val) ? acc : acc + val
  }, 0)

  return (
    <Layout>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-3 overflow-x-hidden">

        <PageHero
          title="Platform Analytics & AI Performance Center"
          subtitle="Executive measurement of AI accuracy, engineering velocity, incident prevention, and business outcomes."
          impact="97.2"
          impactLabel="Uptime % (30d)"
          confidence={94}
        />

        {/* === EXECUTIVE KPI STRIP === */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 mb-4">
          {[
            { label: 'AI Accuracy', value: '94.2%', trend: '+2.1%', color: 'text-violet-400', up: true },
            { label: 'Incidents Prevented', value: '128', trend: '+18', color: 'text-emerald-400', up: true },
            { label: 'MTTR', value: '12min', trend: '-34%', color: 'text-cyan-400', up: true },
            { label: 'ROI Realized', value: '$2.4M', trend: '+18%', color: 'text-amber-400', up: true },
            { label: 'Prediction Accuracy', value: '91.7%', trend: '+3.4%', color: 'text-green-400', up: true },
            { label: 'Services Monitored', value: '47', trend: '—', color: 'text-slate-400', up: false },
          ].map((kpi, i) => (
            <div key={kpi.label} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5">
              <p className="text-[8px] font-mono text-slate-600 uppercase tracking-wider">{kpi.label}</p>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className={`text-lg font-bold ${kpi.color}`}>{kpi.value}</span>
                {kpi.trend !== '—' && (
                  <span className={`text-[9px] font-mono font-bold ${kpi.up ? 'text-emerald-500' : 'text-red-500'}`}>{kpi.trend}</span>
                )}
              </div>
            </div>
          ))}
        </div>
        <ExecutiveSummary />

        <motion.div variants={item} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <StatCard label="Total Incidents" value="66" trend="↓ 12% this quarter" color="text-red-400" />
          <StatCard label="Incidents Prevented" value="81" trend="↑ 24% this quarter" color="text-green-400" />
          <StatCard label="Avg Response Time" value="4.2m" trend="↓ 18%" color="text-cyan-400" />
          <StatCard label="Deploy Success" value="89.3%" trend="↑ 5.2%" color="text-green-400" />
          <StatCard label="Active Services" value="12" trend="All operational" color="text-purple-400" />
          <StatCard label="Platform Health" value="94%" trend="↑ 3.2%" color="text-emerald-400" />
        </motion.div>

        <motion.div variants={item}>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {executiveInsights.map((e, i) => (
              <div key={i} className={`rounded-xl border ${e.color} border-white/[0.04] bg-slate-900/40 p-3 hover:bg-slate-900/60 transition-colors`}>
                <div className="flex items-start gap-2">
                  <span className="text-lg leading-none mt-0.5">{e.icon}</span>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-semibold text-white leading-tight">{e.title}</h4>
                    <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">{e.desc}</p>
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="text-sm font-bold text-white">{e.metric}</span>
                      <span className="text-[11px] text-slate-600">{e.metricLabel}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid gap-3 lg:grid-cols-2">
          <ChartCard title="Incident Trends" subtitle="Actual incidents vs prevented over time" delay={0.1}>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={incidentTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#475569" tick={{ fontSize: 11 }} />
                <YAxis stroke="#475569" tick={{ fontSize: 11 }} />
                <Tooltip content={<customTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="incidents" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444', r: 3 }} name="Incidents" />
                <Line type="monotone" dataKey="prevented" stroke="#22c55e" strokeWidth={2} dot={{ fill: '#22c55e', r: 3 }} name="Prevented" />
                <Line type="monotone" dataKey="autoResolved" stroke="#06b6d4" strokeWidth={1.5} strokeDasharray="4 2" dot={{ fill: '#06b6d4', r: 2 }} name="Auto-Resolved" />
              </LineChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
              <div className="text-center rounded-lg bg-slate-800/20 p-1.5 border border-white/[0.03]">
                <p className="text-[11px] font-bold text-red-400">66</p>
                <p className="text-[11px] text-slate-600">Total Incidents</p>
              </div>
              <div className="text-center rounded-lg bg-slate-800/20 p-1.5 border border-white/[0.03]">
                <p className="text-[11px] font-bold text-green-400">81</p>
                <p className="text-[11px] text-slate-600">Prevented</p>
              </div>
              <div className="text-center rounded-lg bg-slate-800/20 p-1.5 border border-white/[0.03]">
                <p className="text-[11px] font-bold text-cyan-400">53</p>
                <p className="text-[11px] text-slate-600">Auto-Resolved</p>
              </div>
              <div className="text-center rounded-lg bg-slate-800/20 p-1.5 border border-white/[0.03]">
                <p className="text-[11px] font-bold text-yellow-400">31</p>
                <p className="text-[11px] text-slate-600">Escalated</p>
              </div>
            </div>
          </ChartCard>

          <ChartCard title="Deployment Success Rate" subtitle="By service for the current period" delay={0.15}>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={deploymentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#475569" tick={{ fontSize: 10 }} angle={-20} textAnchor="end" height={60} />
                <YAxis stroke="#475569" tick={{ fontSize: 11 }} unit="%" />
                <Tooltip content={<customTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="success" fill="#22c55e" radius={[3, 3, 0, 0]} name="Success" />
                <Bar dataKey="failed" fill="#ef4444" radius={[3, 3, 0, 0]} name="Failed" />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-between mt-2 text-[10px] text-slate-600 px-1">
              <span>Avg success: <span className="text-green-400 font-semibold">89.3%</span></span>
              <span>Avg failure: <span className="text-red-400 font-semibold">10.7%</span></span>
              <span>Total deploys: <span className="text-white font-semibold">600</span></span>
            </div>
          </ChartCard>
        </div>

        <div className="grid gap-3 lg:grid-cols-2">
          <ChartCard title="Risk Distribution" subtitle="Across all analyzed services and components" delay={0.2}>
            <div className="flex flex-col items-center">
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={riskData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={95}
                    paddingAngle={4}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={{ stroke: '#475569', strokeWidth: 1 }}
                  >
                    {riskData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<customTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-1">
                {riskData.map((r) => (
                  <div key={r.name} className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: r.color }} />
                    <span className="text-[10px] text-slate-500">{r.name}</span>
                    <span className="text-[10px] text-slate-600">({r.count})</span>
                    <span className="text-[11px]" style={{ color: r.trend.startsWith('+') ? '#22c55e' : '#ef4444' }}>{r.trend}</span>
                  </div>
                ))}
              </div>
            </div>
          </ChartCard>

          <ChartCard title="Team Impact" subtitle="Velocity and commits by team" delay={0.25}>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={teamData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#475569" tick={{ fontSize: 11 }} />
                <YAxis stroke="#475569" tick={{ fontSize: 11 }} />
                <Tooltip content={<customTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="velocity" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.12} strokeWidth={2} name="Velocity" />
                <Area type="monotone" dataKey="commits" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.12} strokeWidth={2} name="Commits" />
              </AreaChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-3 sm:grid-cols-7 gap-1 mt-2">
              {teamData.map((t) => (
                <div key={t.name} className="text-center">
                  <p className="text-[10px] font-semibold text-white">{t.velocity}</p>
                  <p className="text-[10px] text-slate-600 truncate">{t.name}</p>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
          <ChartCard title="Platform Health Score" subtitle="Real-time system health metrics" delay={0.3}>
            <ResponsiveContainer width="100%" height={260}>
              <RadialBarChart cx="50%" cy="50%" innerRadius="15%" outerRadius="80%" barSize={14} data={healthData}>
                <RadialBar label={{ fill: '#94a3b8', fontSize: 9, position: 'insideStart' }} background dataKey="value" />
                <Tooltip content={<customTooltip />} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-1 mt-1">
              {healthData.map((h) => (
                <div key={h.name} className="text-center p-1 rounded bg-slate-800/10">
                  <p className="text-[11px] font-semibold text-white">
                    {h.value}{h.name === 'Uptime' || h.name === 'Error Rate' ? '%' : h.name === 'Latency' ? 'ms' : h.name === 'Throughput' ? 'K' : '%'}
                  </p>
                  <p className="text-[10px] text-slate-600 truncate">{h.name}</p>
                  <p className="text-[10px]" style={{ color: h.trend.startsWith('+') ? '#22c55e' : '#ef4444' }}>{h.trend}</p>
                </div>
              ))}
            </div>
          </ChartCard>

          <div className="xl:col-span-2">
            <ChartCard title="Service-Level Analytics" subtitle="Per-service health and performance metrics" delay={0.35}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] text-slate-600">Region:</span>
                {['all', 'us-east-1', 'us-west-2', 'eu-west-1', 'global'].map((r) => (
                  <button
                    key={r}
                    onClick={() => setSelectedRegion(r)}
                    className={`text-[11px] px-2 py-0.5 rounded-full border transition-colors ${
                      selectedRegion === r
                        ? 'border-white/20 bg-white/10 text-white'
                        : 'border-white/[0.04] text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {r === 'all' ? 'All' : r}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {filteredServices.map((s) => (
                  <div key={s.name} className="rounded-lg border border-white/[0.05] bg-slate-800/40 p-2.5 hover:bg-slate-800/60 transition-colors">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold text-white">{s.name}</span>
                      <StatusBadge status={s.status} />
                    </div>
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                      <div>
                        <p className="text-[11px] text-slate-600">Incidents</p>
                        <p className="text-[11px] font-medium text-slate-300">{s.incidents}</p>
                      </div>
                      <div>
                        <p className="text-[11px] text-slate-600">Deploy</p>
                        <p className="text-[11px] font-medium text-slate-300">{s.deploySuccess}%</p>
                      </div>
                      <div>
                        <p className="text-[11px] text-slate-600">P95 Latency</p>
                        <p className="text-[11px] font-medium text-slate-300">{s.latency}ms</p>
                      </div>
                      <div>
                        <p className="text-[11px] text-slate-600">Errors</p>
                        <p className="text-[11px] font-medium text-slate-300">{s.errorRate}%</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-1 mt-1.5 pt-1 border-t border-white/[0.04]">
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-slate-600">CPU:</span>
                        <span className="text-[10px] text-slate-400">{s.cpu}%</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-slate-600">Mem:</span>
                        <span className="text-[10px] text-slate-400">{s.memory}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ChartCard>
          </div>
        </div>

        <ChartCard title="Incident Timeline" subtitle="Recent incidents across all services" delay={0.4}>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-[10px] text-slate-600">Filter:</span>
            {['all', 'critical', 'high', 'medium', 'low'].map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSeverity(s)}
                className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors ${
                  selectedSeverity === s
                    ? 'border-white/20 bg-white/10 text-white'
                    : 'border-white/[0.04] text-slate-500 hover:text-slate-300'
                }`}
              >
                {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
          <div className="max-h-[320px] overflow-y-auto space-y-0.5 pr-1 custom-scrollbar">
            {filteredTimeline.map((inc) => (
              <div key={inc.id} className="flex items-center gap-3 rounded-lg border border-white/[0.03] bg-slate-800/20 px-3 py-2 hover:bg-slate-800/40 transition-colors">
                <div className="flex flex-col items-center gap-0.5 w-14 shrink-0">
                  <span className="text-[11px] text-slate-600 font-medium">{inc.date.slice(5)}</span>
                </div>
                <div className={`w-2 h-2 rounded-full shrink-0 ${severityColor(inc.severity)}`} />
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span className="text-[10px] font-semibold text-white capitalize">{inc.severity}</span>
                  <span className="text-[11px] text-slate-600">·</span>
                  <span className="text-[10px] text-slate-300">{inc.service}</span>
                  <span className="text-[11px] text-slate-600">·</span>
                  <span className="text-[11px] text-slate-500 truncate">{inc.desc}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="hidden lg:flex gap-1">
                    {inc.tags.slice(0, 2).map((t) => (
                      <span key={t} className="text-[10px] bg-slate-800/60 text-slate-500 px-1 py-0.5 rounded">{t}</span>
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-600">{inc.runbook}</span>
                  <span className="text-[11px] text-slate-600">{inc.duration}</span>
                  <StatusBadge status={inc.status} />
                </div>
              </div>
            ))}
          </div>
        </ChartCard>

        <div className="grid gap-3 lg:grid-cols-2">
          <ChartCard title="Deployment Frequency" subtitle="Weekly deploys with change failure rate" delay={0.45}>
            <ResponsiveContainer width="100%" height={240}>
              <ComposedChart data={weeklyDeployments}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="week" stroke="#475569" tick={{ fontSize: 10 }} />
                <YAxis yAxisId="left" stroke="#475569" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="right" orientation="right" stroke="#f59e0b" tick={{ fontSize: 11 }} unit="%" />
                <Tooltip content={<customTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar yAxisId="left" dataKey="deploys" fill="#06b6d4" radius={[2, 2, 0, 0]} name="Deploys" />
                <Bar yAxisId="left" dataKey="rollbacks" fill="#f59e0b" radius={[2, 2, 0, 0]} name="Rollbacks" />
                <Line yAxisId="right" type="monotone" dataKey="failureRate" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444', r: 3 }} name="Change Failure Rate" />
              </ComposedChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
              <div className="text-center rounded bg-slate-800/10 p-1">
                <p className="text-[11px] font-bold text-cyan-400">{weeklyDeployments.reduce((a, b) => a + b.deploys, 0)}</p>
                <p className="text-[10px] text-slate-600">Total Deploys</p>
              </div>
              <div className="text-center rounded bg-slate-800/10 p-1">
                <p className="text-[11px] font-bold text-red-400">{weeklyDeployments.reduce((a, b) => a + b.failures, 0)}</p>
                <p className="text-[10px] text-slate-600">Failures</p>
              </div>
              <div className="text-center rounded bg-slate-800/10 p-1">
                <p className="text-[11px] font-bold text-yellow-400">{weeklyDeployments.reduce((a, b) => a + b.rollbacks, 0)}</p>
                <p className="text-[10px] text-slate-600">Rollbacks</p>
              </div>
              <div className="text-center rounded bg-slate-800/10 p-1">
                <p className="text-[11px] font-bold text-green-400">{weeklyDeployments.reduce((a, b) => a + b.hotfixes, 0)}</p>
                <p className="text-[10px] text-slate-600">Hotfixes</p>
              </div>
            </div>
          </ChartCard>

          <ChartCard title="MTTR Analysis" subtitle="Mean time to repair by service (minutes)" delay={0.5}>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={mttrData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" stroke="#475569" tick={{ fontSize: 11 }} unit="m" />
                <YAxis dataKey="name" type="category" stroke="#475569" tick={{ fontSize: 10 }} width={80} />
                <Tooltip content={<customTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="minutes" radius={[0, 3, 3, 0]} name="This Month">
                  {mttrData.map((e, i) => (
                    <Cell key={i} fill={e.minutes <= 30 ? '#22c55e' : e.minutes <= 60 ? '#06b6d4' : e.minutes <= 120 ? '#f59e0b' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1 mt-2">
              {mttrData.map((m) => (
                <div key={m.name} className="text-center">
                  <p className="text-[10px] font-semibold text-white">{m.minutes}m</p>
                  <p className="text-[10px] text-slate-600">{m.trend}</p>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        <ChartCard title="MTTR Weekly Trend" subtitle="Average time to repair across all services by week" delay={0.52}>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={weeklyMttrTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="week" stroke="#475569" tick={{ fontSize: 10 }} />
              <YAxis stroke="#475569" tick={{ fontSize: 11 }} unit="m" />
              <Tooltip content={<customTooltip />} />
              <Area type="monotone" dataKey="minutes" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.12} strokeWidth={2} name="MTTR" />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-between mt-1 text-[11px] text-slate-600">
            <span>Best week: W23 (32m)</span>
            <span>Worst week: W14 (70m)</span>
            <span>Average: {(weeklyMttrTrend.reduce((a, b) => a + b.minutes, 0) / weeklyMttrTrend.length).toFixed(0)}m</span>
          </div>
        </ChartCard>

        <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
          <ChartCard title="SLA Compliance" subtitle="Service level agreement metrics status" delay={0.55}>
            <div className="space-y-2">
              {slaMetrics.map((s) => (
                <div key={s.label} className="border-b border-white/[0.03] pb-2 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] text-slate-300 font-medium">{s.label}</p>
                      <p className="text-[10px] text-slate-600 mt-0.5 truncate">{s.description}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <div className="text-right">
                        <p className="text-[11px] font-semibold text-white">{s.value}</p>
                        <p className="text-[10px] text-slate-600">goal: {s.goal}</p>
                      </div>
                      <StatusBadge status={s.status} />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg width="24" height="24" viewBox="0 0 24 24" className="-rotate-90 shrink-0">
                      <circle cx="12" cy="12" r="9" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="2.5" />
                      <circle cx="12" cy="12" r="9" fill="none" stroke={slaBarColor(s.bar)} strokeWidth="2.5" strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * 9} strokeDashoffset={2 * Math.PI * 9 * (1 - Math.min(s.bar, 100) / 100)} />
                      <text x="12" y="15" textAnchor="middle" fill={slaBarColor(s.bar)} fontSize="5" fontWeight="700" fontFamily="monospace" transform="rotate(90 12 12)">{Math.round(Math.min(s.bar, 100))}%</text>
                    </svg>
                    <span className="text-[10px] text-slate-600 w-10 text-right">{s.trend}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/[0.04] text-[11px] text-slate-600">
              <span>Metrics meeting/exceeding: <span className="text-green-400 font-semibold">7/7</span></span>
              <span>Overall SLA score: <span className="text-white font-semibold">98.2%</span></span>
            </div>
          </ChartCard>

          <ChartCard title="Error Budget" subtitle="Consumed vs remaining per service" delay={0.58}>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={errorBudgetByService} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" stroke="#475569" tick={{ fontSize: 11 }} unit="%" />
                <YAxis dataKey="name" type="category" stroke="#475569" tick={{ fontSize: 10 }} width={80} />
                <Tooltip content={<customTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="remaining" fill="#22c55e" radius={[0, 3, 3, 0]} name="Remaining" stackId="a" />
                <Bar dataKey="consumed" fill="#ef4444" radius={[0, 3, 3, 0]} name="Consumed" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-between text-[11px] text-slate-600 mt-1">
              <span>Total remaining: <span className="text-green-400 font-semibold">85.3%</span></span>
              <span>Total consumed: <span className="text-red-400 font-semibold">14.7%</span></span>
            </div>
          </ChartCard>

          <ChartCard title="AI Insights" subtitle="Automated anomaly detection findings" delay={0.65}>
            <div className="max-h-[360px] overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
              {(showAllInsights ? aiInsights : aiInsights.slice(0, 5)).map((a, i) => (
                <div key={i} className="rounded-lg border border-white/[0.04] bg-slate-800/20 p-2 hover:bg-slate-800/40 transition-colors">
                  <div className="flex items-start gap-2">
                    <span className="text-base leading-none mt-0.5 shrink-0">{a.icon}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                        <h4 className="text-[11px] font-semibold text-white">{a.title}</h4>
                        <span className={`text-[10px] px-1 py-0.5 rounded-full ${
                          a.tag === 'Reliability' ? 'bg-emerald-500/10 text-emerald-400' :
                          a.tag === 'Performance' ? 'bg-cyan-500/10 text-cyan-400' :
                          a.tag === 'Delivery' ? 'bg-purple-500/10 text-purple-400' :
                          a.tag === 'Latency' ? 'bg-yellow-500/10 text-yellow-400' :
                          a.tag === 'Observability' ? 'bg-pink-500/10 text-pink-400' :
                          a.tag === 'Security' ? 'bg-rose-500/10 text-rose-400' :
                          a.tag === 'Stability' ? 'bg-blue-500/10 text-blue-400' :
                          'bg-slate-500/10 text-slate-400'
                        }`}>{a.tag}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">{a.desc}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] font-medium ${
                          a.impact === 'high' ? 'text-green-400' : a.impact === 'medium' ? 'text-yellow-400' : 'text-blue-400'
                        }`}>
                          {a.impact.toUpperCase()} IMPACT
                        </span>
                         <div className="flex items-center gap-1">
                           <svg width="20" height="20" viewBox="0 0 20 20" className="-rotate-90">
                             <circle cx="10" cy="10" r="7" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="2.5" />
                             <circle cx="10" cy="10" r="7" fill="none" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round"
                               strokeDasharray={2 * Math.PI * 7} strokeDashoffset={2 * Math.PI * 7 * (1 - a.confidence / 100)} />
                           </svg>
                           <span className="text-[10px] text-slate-600">{a.confidence}%</span>
                         </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <button
                onClick={() => setShowAllInsights(!showAllInsights)}
                className="w-full text-[10px] text-slate-500 hover:text-slate-300 py-1 transition-colors"
              >
                {showAllInsights ? 'Show less' : `Show all ${aiInsights.length} insights`}
              </button>
            </div>
          </ChartCard>
        </div>

        <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
          <ChartCard title="Database Performance" subtitle="Query latency and pool utilization by service" delay={0.56}>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={dbPerformance} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" stroke="#475569" tick={{ fontSize: 10 }} unit="ms" />
                <YAxis dataKey="name" type="category" stroke="#475569" tick={{ fontSize: 9 }} width={70} />
                <Tooltip content={<customTooltip />} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="avgLatency" fill="#06b6d4" radius={[0, 3, 3, 0]} name="Avg Latency" />
                <Bar dataKey="p99Latency" fill="#8b5cf6" radius={[0, 3, 3, 0]} name="P99 Latency" />
              </BarChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1 mt-1">
              {dbPerformance.map((d) => (
                <div key={d.name} className="text-center">
                  <p className="text-[10px] font-semibold" style={{ color: d.poolUtilization > 85 ? '#ef4444' : d.poolUtilization > 70 ? '#f59e0b' : '#22c55e' }}>{d.poolUtilization}%</p>
                  <p className="text-[10px] text-slate-600 truncate">{d.name}</p>
                </div>
              ))}
            </div>
          </ChartCard>

          <ChartCard title="Cache Hit Rates" subtitle="Cache efficiency by cache type" delay={0.57}>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={cacheMetrics} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" stroke="#475569" tick={{ fontSize: 10 }} unit="%" domain={[80, 100]} />
                <YAxis dataKey="name" type="category" stroke="#475569" tick={{ fontSize: 9 }} width={80} />
                <Tooltip content={<customTooltip />} />
                <Bar dataKey="hitRate" fill="#22c55e" radius={[0, 3, 3, 0]} name="Hit Rate %">
                  {cacheMetrics.map((e, i) => (
                    <Cell key={i} fill={e.hitRate >= 95 ? '#22c55e' : e.hitRate >= 90 ? '#06b6d4' : '#f59e0b'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-3 gap-1 mt-1">
              <div className="text-center rounded bg-slate-800/10 p-1">
                <p className="text-[10px] font-bold text-green-400">{cacheMetrics.reduce((a, b) => a + b.hits, 0).toLocaleString()}</p>
                <p className="text-[10px] text-slate-600">Total Hits</p>
              </div>
              <div className="text-center rounded bg-slate-800/10 p-1">
                <p className="text-[10px] font-bold text-yellow-400">{cacheMetrics.reduce((a, b) => a + b.misses, 0).toLocaleString()}</p>
                <p className="text-[10px] text-slate-600">Total Misses</p>
              </div>
              <div className="text-center rounded bg-slate-800/10 p-1">
                <p className="text-[10px] font-bold text-cyan-400">{(() => { const t = cacheMetrics.reduce((a, b) => a + b.hits + b.misses, 0); return t > 0 ? ((cacheMetrics.reduce((a, b) => a + b.hits, 0) / t) * 100).toFixed(1) : '0.0' })()}%</p>
                <p className="text-[10px] text-slate-600">Overall Hit Rate</p>
              </div>
            </div>
          </ChartCard>

          <ChartCard title="Release Train Health" subtitle="Recent release train performance" delay={0.58}>
            <div className="space-y-1.5">
              <div className="hidden sm:grid grid-cols-6 gap-1 text-[10px] text-slate-600 font-medium pb-1 border-b border-white/[0.04]">
                <span>Train</span>
                <span className="text-center">Changes</span>
                <span className="text-center">Incidents</span>
                <span className="text-center">Pass %</span>
                <span className="text-center">Time</span>
                <span className="text-center">Rollback</span>
              </div>
              {releaseTrains.map((r) => (
                <div key={r.train} className="grid grid-cols-3 sm:grid-cols-6 gap-1 text-[11px] text-slate-300 py-0.5 border-b border-white/[0.02] last:border-0 items-center">
                  <span className="font-medium text-white text-[10px]">{r.train}</span>
                  <span className="text-center">{r.changes}</span>
                  <span className="text-center" style={{ color: r.incidents > 2 ? '#ef4444' : r.incidents > 1 ? '#f59e0b' : '#22c55e' }}>{r.incidents}</span>
                  <span className="text-center text-cyan-400">{r.passRate}%</span>
                  <span className="text-center text-slate-500">{r.deployTime}</span>
                  <span className="text-center" style={{ color: r.rollbacks > 0 ? '#ef4444' : '#22c55e' }}>{r.rollbacks > 0 ? 'Yes' : 'No'}</span>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        <div className="grid gap-3 lg:grid-cols-2">
          <ChartCard title="Incident Root Cause Analysis" subtitle="Breakdown of incident causes this quarter" delay={0.6}>
            <div className="space-y-2">
              {incidentCauseBreakdown.map((c) => (
                  <div key={c.cause} className="flex items-center gap-2">
                    <svg width="24" height="24" viewBox="0 0 24 24" className="-rotate-90 shrink-0">
                      <circle cx="12" cy="12" r="9" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="2.5" />
                      <circle cx="12" cy="12" r="9" fill="none" stroke={c.pct > 25 ? '#ef4444' : c.pct > 15 ? '#f59e0b' : c.pct > 8 ? '#06b6d4' : '#22c55e'} strokeWidth="2.5" strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * 9} strokeDashoffset={2 * Math.PI * 9 * (1 - c.pct / 100)} />
                      <text x="12" y="15" textAnchor="middle" fill={c.pct > 25 ? '#ef4444' : c.pct > 15 ? '#f59e0b' : c.pct > 8 ? '#06b6d4' : '#22c55e'} fontSize="5" fontWeight="700" fontFamily="monospace" transform="rotate(90 12 12)">{Math.round(c.pct)}%</text>
                    </svg>
                    <div className="w-24 shrink-0">
                      <p className="text-[11px] text-slate-300 truncate">{c.cause}</p>
                    </div>
                  <div className="w-10 text-right shrink-0">
                    <p className="text-[11px] font-semibold text-white">{c.count}</p>
                  </div>
                  <div className="w-12 text-right shrink-0">
                    <p className="text-[10px] text-slate-600">{c.pct}%</p>
                  </div>
                  <div className="w-10 text-right shrink-0">
                    <p className="text-[10px]" style={{ color: c.trend.startsWith('+') ? '#ef4444' : '#22c55e' }}>{c.trend}</p>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>

          <ChartCard title="Alert Fatigue Analysis" subtitle="Alert volume by service (last 30 days)" delay={0.62}>
            <div className="space-y-1.5">
              <div className="hidden sm:grid grid-cols-6 gap-1 text-[10px] text-slate-600 font-medium pb-1 border-b border-white/[0.04]">
                <span>Service</span>
                <span className="text-center">Crit</span>
                <span className="text-center">Warn</span>
                <span className="text-center">Info</span>
                <span className="text-center">Action</span>
                <span className="text-center">Noise</span>
              </div>
              {alertFatigue.map((a) => (
                <div key={a.service} className="grid grid-cols-3 sm:grid-cols-6 gap-1 text-[11px] text-slate-300 py-0.5 border-b border-white/[0.02] last:border-0 items-center">
                  <span className="font-medium text-white text-[10px]">{a.service}</span>
                  <span className="text-center" style={{ color: a.critical > 5 ? '#ef4444' : '#f59e0b' }}>{a.critical}</span>
                  <span className="text-center text-yellow-400">{a.warning}</span>
                  <span className="text-center text-slate-500">{a.info}</span>
                  <span className="text-center text-green-400">{a.actionable}</span>
                  <span className="text-center text-red-400">{a.noise}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/[0.04] text-[10px] text-slate-600">
              <span>Total alerts: {alertFatigue.reduce((a, b) => a + b.critical + b.warning + b.info, 0)}</span>
              <span>Actionable: {alertFatigue.reduce((a, b) => a + b.actionable, 0)}</span>
              <span>Noise: {alertFatigue.reduce((a, b) => a + b.noise, 0)}</span>
              <span>SNR: {((alertFatigue.reduce((a, b) => a + b.actionable, 0) / alertFatigue.reduce((a, b) => a + b.noise, 0)) * 100).toFixed(0)}%</span>
            </div>
          </ChartCard>
        </div>

        <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
          <ChartCard title="Sprint Health Overview" subtitle="Planned vs completed story points" delay={0.64}>
            <ResponsiveContainer width="100%" height={200}>
              <ComposedChart data={weeklySprintHealth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="sprint" stroke="#475569" tick={{ fontSize: 10 }} />
                <YAxis stroke="#475569" tick={{ fontSize: 10 }} />
                <Tooltip content={<customTooltip />} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="planned" fill="#475569" radius={[2, 2, 0, 0]} name="Planned" />
                <Bar dataKey="completed" fill="#22c55e" radius={[2, 2, 0, 0]} name="Completed" />
                <Line type="monotone" dataKey="velocity" stroke="#06b6d4" strokeWidth={2} dot={{ fill: '#06b6d4', r: 3 }} name="Velocity" />
              </ComposedChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-1">
              <div className="text-center rounded bg-slate-800/10 p-1">
                <p className="text-[10px] font-bold text-green-400">{weeklySprintHealth.reduce((a, b) => a + b.completed, 0)}</p>
                <p className="text-[10px] text-slate-600">Total Done</p>
              </div>
              <div className="text-center rounded bg-slate-800/10 p-1">
                <p className="text-[10px] font-bold text-slate-400">{weeklySprintHealth.reduce((a, b) => a + b.planned, 0)}</p>
                <p className="text-[10px] text-slate-600">Total Planned</p>
              </div>
              <div className="text-center rounded bg-slate-800/10 p-1">
                <p className="text-[10px] font-bold text-red-400">{weeklySprintHealth.reduce((a, b) => a + b.bugs, 0)}</p>
                <p className="text-[10px] text-slate-600">Bugs Found</p>
              </div>
              <div className="text-center rounded bg-slate-800/10 p-1">
                <p className="text-[10px] font-bold text-yellow-400">{weeklySprintHealth.reduce((a, b) => a + b.debt, 0)}</p>
                <p className="text-[10px] text-slate-600">Tech Debt</p>
              </div>
            </div>
          </ChartCard>

          <ChartCard title="Dependency Health" subtitle="External dependency status monitoring" delay={0.66}>
            <div className="space-y-1.5">
              {dependencyHealth.map((d) => (
                <div key={d.name} className="flex items-center gap-2 py-1 border-b border-white/[0.03] last:border-0">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="text-[10px] font-medium text-slate-300">{d.name}</p>
                      <StatusBadge status={d.status} />
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-[10px] text-slate-600">Uptime: {d.uptime}%</span>
                      <span className="text-[10px] text-slate-600">Latency: {d.latency}ms</span>
                      <span className="text-[10px] text-slate-600">Errors: {d.errors}%</span>
                    </div>
                  </div>
                  <div className="w-10 text-right shrink-0">
                    <p className="text-[10px] text-slate-600">{d.pctTraffic}%</p>
                    <p className="text-[10px] text-slate-700">traffic</p>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>

          <ChartCard title="Rollback Analysis" subtitle="Reasons for deployment rollbacks" delay={0.68}>
            <div className="flex flex-col items-center">
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={rollbackReasons}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="count"
                    label={({ reason, percent }) => `${(percent * 100).toFixed(0)}%`}
                    labelLine={{ stroke: '#475569', strokeWidth: 1 }}
                  >
                    {rollbackReasons.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<customTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-2 mt-1 flex-wrap">
                {rollbackReasons.map((r) => (
                  <div key={r.reason} className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: r.color }} />
                    <span className="text-[10px] text-slate-500">{r.reason}</span>
                    <span className="text-[10px] text-slate-600">({r.count})</span>
                  </div>
                ))}
              </div>
            </div>
          </ChartCard>
        </div>

        <div className="grid gap-3 lg:grid-cols-2">
          <ChartCard title="Cost Impact Analysis" subtitle="Financial and operational savings" delay={0.7}>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {costImpactData.map((c, i) => (
                <div key={i} className="rounded-lg border border-white/[0.05] bg-slate-800/30 p-2 hover:bg-slate-800/50 transition-colors">
                  <p className="text-[11px] text-slate-600">{c.label}</p>
                  <p className={`text-sm font-bold ${c.color}`}>{c.value}</p>
                  <div className="flex items-center justify-between mt-0.5">
                    <p className="text-[11px] text-slate-600">{c.change}</p>
                    <p className="text-[10px] text-slate-700 truncate ml-1 max-w-[80px]">{c.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>

          <ChartCard title="Change Type Breakdown" subtitle="Types of changes deployed this period" delay={0.62}>
            <div className="flex flex-col items-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={changeTypeBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={{ stroke: '#475569', strokeWidth: 1 }}
                  >
                    {changeTypeBreakdown.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<customTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-3 mt-1 flex-wrap">
                {changeTypeBreakdown.map((c) => (
                  <div key={c.name} className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: c.color }} />
                    <span className="text-[11px] text-slate-500">{c.name}</span>
                    <span className="text-[11px] text-slate-600">({c.value})</span>
                  </div>
                ))}
              </div>
            </div>
          </ChartCard>
        </div>

        <ChartCard title="Trend Forecast" subtitle="Predicted incidents with confidence intervals (next 3 months)" delay={0.7}>
          <ResponsiveContainer width="100%" height={250}>
            <ComposedChart data={trendForecast}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" stroke="#475569" tick={{ fontSize: 11 }} />
              <YAxis stroke="#475569" tick={{ fontSize: 11 }} />
              <Tooltip content={<customTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area type="monotone" dataKey="upper" stroke="transparent" fill="#ef4444" fillOpacity={0.06} name="Confidence Interval" />
              <Area type="monotone" dataKey="lower" stroke="transparent" fill="#ef4444" fillOpacity={0.06} name="" />
              <Line type="monotone" dataKey="upper" stroke="#ef4444" strokeWidth={0.5} strokeDasharray="3 3" dot={false} name="Upper Bound" />
              <Line type="monotone" dataKey="lower" stroke="#ef4444" strokeWidth={0.5} strokeDasharray="3 3" dot={false} name="Lower Bound" />
              <Bar dataKey="predicted" fill="#ef4444" radius={[3, 3, 0, 0]} name="Predicted Incidents" />
              <Line type="monotone" dataKey="prevented" stroke="#22c55e" strokeWidth={2} dot={{ fill: '#22c55e', r: 4 }} name="Predicted Prevented" />
              <Line type="monotone" dataKey="autoResolved" stroke="#06b6d4" strokeWidth={1.5} strokeDasharray="4 2" dot={{ fill: '#06b6d4', r: 3 }} name="Auto-Resolved" />
            </ComposedChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
            {trendForecast.map((t) => (
              <div key={t.month} className="rounded-lg border border-white/[0.04] bg-slate-800/20 p-2 text-center">
                <p className="text-[11px] font-bold text-white">{t.month}</p>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <span className="text-[11px] text-red-400 font-semibold">{t.predicted}</span>
                  <span className="text-[10px] text-slate-600">±{((t.upper - t.lower) / 2).toFixed(0)}</span>
                </div>
                <p className="text-[10px] text-slate-600">{t.prevented} prevented · {t.autoResolved} auto</p>
                  <svg width="20" height="20" viewBox="0 0 20 20" className="-rotate-90 mx-auto mt-1">
                    <circle cx="10" cy="10" r="7" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="2.5" />
                    <circle cx="10" cy="10" r="7" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 7} strokeDashoffset={2 * Math.PI * 7 * (1 - ((t.prevented + t.predicted) > 0 ? t.prevented / (t.prevented + t.predicted) : 0))} />
                  </svg>
              </div>
            ))}
          </div>
        </ChartCard>

        <div className="grid gap-3 lg:grid-cols-2">
          <ChartCard title="Incident Hourly Distribution" subtitle="Incidents by time of day (last 30 days)" delay={0.75}>
            <ResponsiveContainer width="100%" height={190}>
              <AreaChart data={hourlyIncidents}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="hour" stroke="#475569" tick={{ fontSize: 8 }} interval={3} />
                <YAxis stroke="#475569" tick={{ fontSize: 10 }} />
                <Tooltip content={<customTooltip />} />
                <Area type="monotone" dataKey="count" stroke="#ef4444" fill="#ef4444" fillOpacity={0.12} strokeWidth={2} name="Incidents" />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-between mt-1 text-[11px] text-slate-600">
              <span>Peak hours: 08:00–12:00 (deploy window)</span>
              <span>Avg: {(hourlyIncidents.reduce((a, b) => a + b.count, 0) / 24).toFixed(1)}/hr</span>
              <span>Quiet: 22:00–05:00</span>
            </div>
          </ChartCard>

          <ChartCard title="Severity Breakdown" subtitle="Incidents by severity level" delay={0.8}>
            <div className="space-y-2">
              {severityBreakdown.map((s) => (
                <div key={s.name} className="flex items-center gap-2">
                  <svg width="24" height="24" viewBox="0 0 24 24" className="-rotate-90 shrink-0">
                    <circle cx="12" cy="12" r="9" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="2.5" />
                    <circle cx="12" cy="12" r="9" fill="none" stroke={s.color} strokeWidth="2.5" strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 9} strokeDashoffset={2 * Math.PI * 9 * (1 - s.value / severityBreakdown.reduce((a, b) => a + b.value, 0))} />
                    <text x="12" y="15" textAnchor="middle" fill={s.color} fontSize="5" fontWeight="700" fontFamily="monospace" transform="rotate(90 12 12)">{Math.round((s.value / severityBreakdown.reduce((a, b) => a + b.value, 0)) * 100)}%</text>
                  </svg>
                  <div className="w-20 shrink-0">
                    <p className="text-[10px] font-medium text-slate-300">{s.name}</p>
                  </div>
                  <div className="w-12 text-right shrink-0">
                    <p className="text-[10px] font-semibold text-white">{s.value}</p>
                  </div>
                  <div className="w-24 text-right shrink-0">
                    <p className="text-[10px] text-slate-600">Resp: {s.avgResponse}</p>
                  </div>
                  <div className="w-14 text-right shrink-0">
                    <p className="text-[10px] text-slate-600">{s.sla}</p>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        <div className="grid gap-3 lg:grid-cols-2">
          <ChartCard title="On-Call Response Metrics" subtitle="Weekly on-call performance" delay={0.85}>
            <div className="space-y-1.5">
              <div className="hidden sm:grid grid-cols-5 gap-2 text-[10px] text-slate-600 font-medium pb-1 border-b border-white/[0.04]">
                <span>Week</span>
                <span className="text-center">Pages</span>
                <span className="text-center">Ack'd</span>
                <span className="text-center">Missed</span>
                <span className="text-right">Resp</span>
              </div>
              {onCallData.map((o) => (
                <div key={o.shift} className="grid grid-cols-3 sm:grid-cols-5 gap-2 text-[10px] text-slate-300 py-1 border-b border-white/[0.02] last:border-0 items-center">
                  <span className="font-medium text-[11px]">{o.shift}</span>
                  <span className="text-center text-slate-400">{o.pagesReceived}</span>
                  <span className="text-center text-green-400">{o.acknowledged}</span>
                  <span className="text-center" style={{ color: o.missed > 0 ? '#ef4444' : '#22c55e' }}>{o.missed}</span>
                  <span className="text-right text-cyan-400">{o.avgResponseTime}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/[0.04] text-[10px] text-slate-600">
              <span>Total pages: {onCallData.reduce((a, b) => a + b.pagesReceived, 0)}</span>
              <span>Ack rate: {(() => { const p = onCallData.reduce((a, b) => a + b.pagesReceived, 0); return p > 0 ? ((onCallData.reduce((a, b) => a + b.acknowledged, 0) / p) * 100).toFixed(0) : '100' })()}%</span>
              <span>Missed: {onCallData.reduce((a, b) => a + b.missed, 0)}</span>
            </div>
          </ChartCard>

          <ChartCard title="Team Velocity Detail" subtitle="Per-team sprint metrics for current period" delay={0.9}>
            <div className="space-y-1">
              <div className="hidden sm:grid grid-cols-8 gap-1 text-[10px] text-slate-600 font-medium pb-1 border-b border-white/[0.04]">
                <span>Team</span>
                <span className="text-center">PRs</span>
                <span className="text-center">Rvws</span>
                <span className="text-center">Dply</span>
                <span className="text-center">SP</span>
                <span className="text-center">Bug</span>
                <span className="text-center">Vel</span>
                <span className="text-center">Size</span>
              </div>
              {teamData.map((t) => (
                <div key={t.name} className="grid grid-cols-4 sm:grid-cols-8 gap-1 text-[11px] text-slate-300 py-0.5 border-b border-white/[0.02] last:border-0 items-center">
                  <span className="font-medium text-white truncate text-[10px]">{t.name}</span>
                  <span className="text-center">{t.prs}</span>
                  <span className="text-center">{t.reviews}</span>
                  <span className="text-center">{t.deployments}</span>
                  <span className="text-center">{t.storyPoints}</span>
                  <span className="text-center" style={{ color: t.bugs > 4 ? '#ef4444' : t.bugs > 2 ? '#f59e0b' : '#22c55e' }}>{t.bugs}</span>
                  <span className="text-center text-cyan-400">{t.velocity}</span>
                  <span className="text-center text-slate-600">{t.teamSize}</span>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        <ChartCard title="Regional Health" subtitle="Uptime, latency and error rate by region" delay={0.92}>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
            {regionHealth.map((r) => (
              <div key={r.name} className="rounded-lg border border-white/[0.04] bg-slate-800/20 p-2.5 text-center">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <p className="text-[11px] font-semibold text-white">{r.name}</p>
                  <div className={`w-1.5 h-1.5 rounded-full ${r.status === 'healthy' ? 'bg-green-400' : 'bg-yellow-400'}`} />
                </div>
                <div className="flex justify-center gap-3 sm:gap-1">
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-emerald-400">{r.uptime}%</p>
                    <p className="text-[10px] text-slate-600">Uptime</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-cyan-400">{r.latency}ms</p>
                    <p className="text-[10px] text-slate-600">Latency</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-yellow-400">{r.errors}%</p>
                    <p className="text-[10px] text-slate-600">Errors</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>

        <motion.div variants={item} className="rounded-xl border border-white/[0.04] bg-slate-900/30 p-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-semibold text-white">Platform Summary</h3>
              <p className="text-[10px] text-slate-600 mt-0.5">End-to-end reliability metrics for the current period</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 mt-3">
            <div className="text-center p-2 rounded-lg bg-slate-800/20 border border-white/[0.03] hover:bg-slate-800/40 transition-colors">
              <p className="text-xs font-bold text-emerald-400">99.97%</p>
              <p className="text-[11px] text-slate-600 mt-0.5">Uptime</p>
              <p className="text-[10px] text-emerald-500/70">↑ 0.02%</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-slate-800/20 border border-white/[0.03] hover:bg-slate-800/40 transition-colors">
              <p className="text-xs font-bold text-cyan-400">42ms</p>
              <p className="text-[11px] text-slate-600 mt-0.5">P95 Latency</p>
              <p className="text-[10px] text-green-500/70">↓ 8ms</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-slate-800/20 border border-white/[0.03] hover:bg-slate-800/40 transition-colors">
              <p className="text-xs font-bold text-yellow-400">0.3%</p>
              <p className="text-[11px] text-slate-600 mt-0.5">Error Rate</p>
              <p className="text-[10px] text-green-500/70">↓ 0.2%</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-slate-800/20 border border-white/[0.03] hover:bg-slate-800/40 transition-colors">
              <p className="text-xs font-bold text-purple-400">8.2K</p>
              <p className="text-[11px] text-slate-600 mt-0.5">Req/s</p>
              <p className="text-[10px] text-emerald-500/70">↑ 1.2K</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-slate-800/20 border border-white/[0.03] hover:bg-slate-800/40 transition-colors">
              <p className="text-xs font-bold text-red-400">67%</p>
              <p className="text-[11px] text-slate-600 mt-0.5">Saturation</p>
              <p className="text-[10px] text-green-500/70">↓ 5%</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-slate-800/20 border border-white/[0.03] hover:bg-slate-800/40 transition-colors">
              <p className="text-xs font-bold text-green-400">12</p>
              <p className="text-[11px] text-slate-600 mt-0.5">Active Svc</p>
              <p className="text-[10px] text-slate-600">All healthy</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-slate-800/20 border border-white/[0.03] hover:bg-slate-800/40 transition-colors">
              <p className="text-xs font-bold text-blue-400">340</p>
              <p className="text-[11px] text-slate-600 mt-0.5">Hrs Saved</p>
              <p className="text-[10px] text-emerald-500/70">↑ 42%</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-slate-800/20 border border-white/[0.03] hover:bg-slate-800/40 transition-colors">
              <p className="text-xs font-bold text-indigo-400">94</p>
              <p className="text-[11px] text-slate-600 mt-0.5">NPS Score</p>
              <p className="text-[10px] text-emerald-500/70">↑ 8 pts</p>
            </div>
          </div>
        </motion.div>

      </motion.div>
    </Layout>
  )
}
