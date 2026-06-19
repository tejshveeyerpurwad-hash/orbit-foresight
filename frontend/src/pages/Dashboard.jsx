import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Layout from '../components/Layout'
import StatusBadge from '../components/StatusBadge'

const mockData = {
  kpis: [
    { value: 92, label: 'System Health', format: '%', trend: 'stable', ringColor: '#34d399', color: 'text-emerald-400', subtitle: 'Overall system status across 47 services', detail: 'Last 24h: 99.97% uptime' },
    { value: 12, label: 'Active Incidents', format: '', trend: 'up', ringColor: '#ef4444', color: 'text-red-400', subtitle: '3 critical, 5 high, 4 medium', detail: 'Up from 8 yesterday' },
    { value: 24, label: 'MTTR (min)', format: 'm', trend: 'down', ringColor: '#22d3ee', color: 'text-cyan-400', subtitle: 'Mean time to resolve', detail: 'Target: <30 min' },
    { value: 47, label: 'Services Monitored', format: '', trend: 'stable', ringColor: '#fbbf24', color: 'text-amber-400', subtitle: 'Across all environments', detail: '6 with degraded performance' },
    { value: 9997, label: 'Uptime', format: '%%', trend: 'stable', ringColor: '#34d399', color: 'text-emerald-400', subtitle: 'Last 30 days SLA', detail: 'Target: 99.99%' },
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
    { time: '14:23:15', severity: 'critical', service: 'Payment Service', message: 'Error rate spike >5% on payment endpoint — circuit breaker nearing threshold', status: 'acknowledged', duration: '4m 12s', source: 'Auto-Detect' },
    { time: '14:21:02', severity: 'medium', service: 'Redis Cache', message: 'Memory usage exceeding 85% — eviction policy may trigger cascading failures', status: 'triggered', duration: '6m 30s', source: 'Threshold Alert' },
    { time: '14:18:44', severity: 'critical', service: 'Billing Service', message: 'Invoice generation latency >30s — downstream dependency degraded', status: 'triggered', duration: '8m 15s', source: 'SLO Monitor' },
    { time: '14:15:30', severity: 'high', service: 'API Gateway', message: 'P99 latency increased by 200ms — rate limiting engaged', status: 'acknowledged', duration: '3m 48s', source: 'Latency Alert' },
    { time: '14:12:08', severity: 'high', service: 'Notification Service', message: 'Email delivery queue backlog 12k messages — retry flooding detected', status: 'triggered', duration: '10m 22s', source: 'Queue Monitor' },
    { time: '14:08:55', severity: 'medium', service: 'Database', message: 'Connection pool utilization 78% — scaling threshold 80% imminent', status: 'resolved', duration: '15m 05s', source: 'Pool Monitor' },
    { time: '14:05:20', severity: 'critical', service: 'Payment Service', message: 'Webhook delivery failure rate 15% — provider connectivity issue detected', status: 'triggered', duration: '2m 45s', source: 'Webhook Monitor' },
    { time: '14:01:10', severity: 'low', service: 'CDN', message: 'Edge cache hit rate dropped to 82% — origin warmup in progress', status: 'resolved', duration: '7m 33s', source: 'Cache Analyzer' },
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
  onCall: {
    primary: '@alice',
    secondary: '@bob',
    escalation: '@carol',
    coverage: '24h',
    shiftRemaining: '4h 22m',
    lastHandoff: '10:00 UTC',
  },
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
}

const container = { hidden: {}, show: { transition: { staggerChildren: 0.02 } } }
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }

function Timestamp() {
  const [time, setTime] = useState(new Date())
  useEffect(() => { const i = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(i) }, [])
  return <span className="font-mono text-[10px] text-cyan-400/70">{time.toISOString().replace('T', ' ').slice(0, 19)}Z</span>
}

function useCounter(target, delay = 0, duration = 1500, format = false) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (target === undefined) return
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
  const max = Math.max(...data); const min = Math.min(...data); const range = max - min || 1
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * width},${height - ((v - min) / range) * height}`).join(' ')
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="shrink-0">
      <polyline fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" points={pts} />
    </svg>
  )
}

function MiniGaugeSparkline({ data, color = '#22d3ee' }) {
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
  const count = useCounter(kpi.value, idx * 80, 1500, kpi.format === '$$$')
  const circumference = 2 * Math.PI * 22
  const pct = Math.min((kpi.value / (kpi.label === 'Uptime' ? 10000 : 100)) * 100, 100)
  const offset = circumference - (pct / 100) * circumference
  const trendIcon = kpi.trend === 'up' ? '\u2191' : kpi.trend === 'down' ? '\u2193' : '\u2192'
  const trendColor = kpi.trend === 'up' ? 'text-red-400' : kpi.trend === 'down' ? 'text-emerald-400' : 'text-slate-500'
  const displayVal = typeof count === 'string' ? count : count
  const finalDisplay = kpi.label === 'Uptime' ? '99.97' : displayVal
  const finalSuffix = kpi.label === 'Uptime' ? '%' : kpi.format === '%%' ? '%' : kpi.format === 'm' ? 'm' : kpi.format === '$$$' ? '' : kpi.format
  const ringPct = Math.round(pct)
  return (
    <motion.div variants={item} className="relative overflow-hidden rounded-xl border border-white/[0.06] bg-gradient-to-br from-slate-900 to-slate-900/50 p-3 sm:p-4 group hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300">
      <div className="flex items-center gap-3">
        <div className="relative shrink-0">
          <svg className="w-12 h-12 sm:w-14 sm:h-14 -rotate-90" viewBox="0 0 52 52">
            <circle cx="26" cy="26" r="22" fill="none" stroke="#1e293b" strokeWidth="4" />
            <motion.circle cx="26" cy="26" r="22" fill="none" stroke={kpi.ringColor} strokeWidth="4" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} initial={{ strokeDashoffset: circumference }} animate={{ strokeDashoffset: offset }} transition={{ duration: 1.2, delay: idx * 0.08, ease: 'easeOut' }} />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[8px] font-mono text-slate-500">{ringPct}%</span>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className={`text-xl sm:text-2xl font-bold font-mono tracking-tight ${kpi.color}`}>
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
  const [animPct, setAnimPct] = useState(0)
  const pctThreshold = (gauge.value / gauge.max) * 100
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
    <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-gradient-to-br from-slate-900 to-slate-900/50 p-4 sm:p-5">
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
  const containerRef = useRef(null)
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
    <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-gradient-to-br from-slate-900 to-slate-900/50 p-4 sm:p-5">
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
                  <StatusBadge status={a.status === 'triggered' ? 'running' : a.status === 'acknowledged' ? 'warning' : 'success'} label={a.status === 'triggered' ? 'ALERT' : a.status.toUpperCase()} />
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

function ServiceHealthCard({ service, idx }) {
  const dotColor = service.status === 'healthy' ? 'bg-emerald-500' : service.status === 'degraded' ? 'bg-amber-500' : 'bg-red-500'
  const borderColor = service.status === 'healthy' ? 'border-emerald-500/20' : service.status === 'degraded' ? 'border-amber-500/30' : 'border-red-500/30'
  const badgeStatus = service.status === 'healthy' ? 'success' : service.status === 'degraded' ? 'warning' : 'failed'
  const uptimeStr = `${service.uptime}%`
  return (
    <motion.div variants={item} className={`rounded-lg border ${borderColor} bg-white/[0.02] p-3 hover:bg-white/[0.04] transition-all group`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className={`absolute inline-flex h-full w-full rounded-full ${dotColor} opacity-75 ${service.status === 'degraded' ? 'animate-ping' : ''}`} />
            <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${dotColor}`} />
          </span>
          <span className="text-[11px] font-mono text-slate-300 font-medium truncate">{service.name}</span>
        </div>
        <MiniSparkline data={service.trend} color={service.color} width={48} height={14} />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <StatusBadge status={badgeStatus} label={service.status} />
          <span className="text-[9px] font-mono text-slate-600">{uptimeStr}</span>
        </div>
        <span className="text-[9px] font-mono text-slate-500">{service.responseTime}</span>
      </div>
      <div className="flex items-center gap-2 mt-1.5 pt-1.5 border-t border-white/[0.03] text-[8px] font-mono text-slate-700">
        <span>{service.pods} pods</span>
        <span className="text-slate-700">\u00b7</span>
        <span>{service.region}</span>
      </div>
    </motion.div>
  )
}

function DeploymentTimeline() {
  const deployments = mockData.deployments
  return (
    <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-gradient-to-br from-slate-900 to-slate-900/50 p-4 sm:p-5">
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
                    <>
                      <span className="text-slate-700">\u00b7</span>
                      <span className="text-[8px] font-mono text-red-400/70">rolled back</span>
                    </>
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
    <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-gradient-to-br from-slate-900 to-slate-900/50 p-4 sm:p-5">
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
              <motion.rect
                x={x} y={chartH} width={barWidth} height={0}
                animate={animated ? { y, height: barH } : {}}
                transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
                rx="3" fill={barColor} opacity="0.85"
              />
              <motion.rect
                x={x} y={chartH} width={barWidth} height={0}
                animate={animated ? { y, height: barH } : {}}
                transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
                rx="3" fill={barColor} opacity="0.15"
                style={{ transform: 'translateY(2px)' }}
              />
              <text x={x + barWidth / 2} y={chartH + 15} textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace">{d.week}</text>
              <motion.text
                x={x + barWidth / 2} y={y - 5}
                textAnchor="middle" fill="#e2e8f0" fontSize="8" fontFamily="monospace" fontWeight="bold"
                initial={{ opacity: 0 }} animate={animated ? { opacity: 1 } : {}}
                transition={{ duration: 0.4, delay: i * 0.1 + 0.6 }}
              >{d.points}</motion.text>
              {pctChange !== 0 && (
                <text x={x + barWidth + 2} y={y + 8} fill={pctChange > 0 ? '#34d399' : '#ef4444'} fontSize="6" fontFamily="monospace">
                  {pctChange > 0 ? '\u2191' : '\u2193'}{Math.abs(Math.round(pctChange))}%
                </text>
              )}
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
  const actionIcons = {
    deployed: 'M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z',
    merged: 'M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15',
    reviewed: 'M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
    alerted: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z',
  }
  return (
    <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-gradient-to-br from-slate-900 to-slate-900/50 p-4 sm:p-5">
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
    <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-gradient-to-br from-slate-900 to-slate-900/50 p-4 sm:p-5">
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
                  {p.factors.map((f, fi) => (
                    <span key={fi} className="rounded-md bg-white/[0.03] border border-white/[0.04] px-1.5 py-0.5 text-[7px] font-mono text-slate-600">{f}</span>
                  ))}
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
    <motion.div variants={item} className={`relative overflow-hidden rounded-xl border border-white/[0.06] bg-gradient-to-br from-slate-900 to-slate-900/50 p-4 sm:p-5 ${globalFlash ? 'ring-1 ring-amber-500/30' : ''} transition-all duration-300`}>
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
                <div className={`text-lg sm:text-xl font-bold font-mono ${biz.color} truncate`}>
                  {biz.prefix}{displayVal}{biz.suffix}
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${barPct}%` }}
                    transition={{ duration: 1.2, delay: idx * 0.1 + 0.3, ease: 'easeOut' }}
                    className={`h-full rounded-full ${biz.color.replace('text-', 'bg-').replace('400', '500/80')}`}
                  />
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

function IncidentsByService() {
  return (
    <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-gradient-to-br from-slate-900 to-slate-900/50 p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.15em] font-mono">Incidents by Service</h2>
        <StatusBadge status="info" label="24h window" />
      </div>
      <div className="space-y-2">
        {mockData.incidentsByService.map((item, idx) => {
          const sevColor = item.severity === 'critical' ? 'text-red-400' : item.severity === 'high' ? 'text-orange-400' : item.severity === 'medium' ? 'text-amber-400' : 'text-emerald-400'
          const sevBar = item.severity === 'critical' ? 'bg-red-500/80' : item.severity === 'high' ? 'bg-orange-500/80' : item.severity === 'medium' ? 'bg-amber-500/80' : 'bg-emerald-500/80'
          const barWidth = Math.min((item.count / 5) * 100, 100)
          return (
            <motion.div key={item.service} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }} className="flex items-center gap-3">
              <span className="text-[10px] font-mono text-slate-400 w-24 shrink-0 truncate">{item.service}</span>
              <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${barWidth}%` }}
                  transition={{ duration: 0.8, delay: idx * 0.05 }}
                  className={`h-full rounded-full ${sevBar}`}
                />
              </div>
              <div className="flex items-center gap-1.5 shrink-0 w-16 justify-end">
                <span className={`text-[11px] font-bold font-mono ${sevColor}`}>{item.count}</span>
                <span className={`text-[8px] font-mono ${item.trend === 'up' ? 'text-red-400' : item.trend === 'down' ? 'text-emerald-400' : 'text-slate-600'}`}>
                  {item.trend === 'up' ? '\u2191' : item.trend === 'down' ? '\u2193' : '\u2192'}
                </span>
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
    <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-gradient-to-br from-slate-900 to-slate-900/50 p-4 sm:p-5">
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
              <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(barPct * (slo.unit === 'ms' ? 2 : 1), 100)}%` }}
                  transition={{ duration: 0.8, delay: idx * 0.05 }}
                  className={`h-full rounded-full ${barColor}`}
                />
              </div>
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
    <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-gradient-to-br from-slate-900 to-slate-900/50 p-4 sm:p-5">
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
              <motion.div
                initial={{ height: 0 }}
                animate={anim ? { height: h } : {}}
                transition={{ duration: 0.8, delay: i * 0.08, ease: 'easeOut' }}
                className="w-full rounded-t-md"
                style={{ backgroundColor: color, height: anim ? h : 0, minHeight: anim ? h : 0 }}
              />
              <span className="text-[8px] font-mono text-slate-600">{d.week}</span>
              <span className="text-[7px] font-mono text-slate-700">{d.deploys} deploys</span>
            </div>
          )
        })}
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
          { label: 'CACHE HIT RATE', value: '94%', color: 'text-emerald-400' },
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
    <motion.div variants={item} className="rounded-xl border border-white/[0.08] bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900/80 backdrop-blur-2xl p-4 sm:p-5 relative overflow-hidden">
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
    <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-gradient-to-br from-slate-900 to-slate-900/50 p-4 sm:p-5">
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

export default function Dashboard() {
  return (
    <Layout>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-4 pb-8">
        {/* HEADER */}
        <CommandHeader />

        {/* 1. EXECUTIVE SUMMARY — 6 ANIMATED KPI CARDS */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <h2 className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.15em] font-mono">Executive Summary</h2>
            <div className="flex items-center gap-2">
              <StatusBadge status="info" label="Auto-Refresh 30s" />
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {mockData.kpis.map((kpi, idx) => (
              <AnimatedKPI key={kpi.label} kpi={kpi} idx={idx} />
            ))}
          </div>
        </div>

        {/* 2. LIVE OPERATIONAL METRICS — 4 LARGE RING GAUGES */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <h2 className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.15em] font-mono">Live Operational Metrics</h2>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-500 opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500" /></span>
              <span className="text-[9px] font-mono text-cyan-400/70">STREAMING</span>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {mockData.gauges.map((gauge, idx) => (
              <AnimatedGauge key={gauge.label} gauge={gauge} history={mockData.gaugeHistory[idx].data} idx={idx} />
            ))}
          </div>
        </div>

        {/* 3. RISK HEATMAP + 4. AI ALERTS FEED — TWO COLUMN */}
        <div className="grid gap-4 lg:grid-cols-2">
          <RiskHeatmap />
          <AlertsFeed />
        </div>

        {/* 5. SERVICE HEALTH OVERVIEW — 6 SERVICES IN GRID */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <h2 className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.15em] font-mono">Service Health Overview</h2>
            <div className="flex items-center gap-2">
              <StatusBadge status="success" label={`${mockData.services.filter(s => s.status === 'healthy').length} Healthy`} />
              <StatusBadge status="warning" label={`${mockData.services.filter(s => s.status !== 'healthy').length} Degraded`} />
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {mockData.services.map((service, idx) => (
              <ServiceHealthCard key={service.name} service={service} idx={idx} />
            ))}
          </div>
        </div>

        {/* 6. DEPLOYMENT INSIGHTS + 8. RECENT ACTIVITY TIMELINE — TWO COLUMN */}
        <div className="grid gap-4 lg:grid-cols-2">
          <DeploymentTimeline />
          <ActivityTimeline />
        </div>

        {/* 7. ENGINEERING PRODUCTIVITY TRENDS — SVG BAR CHART */}
        <VelocityBarChart />

        {/* INCIDENTS BY SERVICE + SLO SUMMARY — TWO COLUMN */}
        <div className="grid gap-4 lg:grid-cols-2">
          <IncidentsByService />
          <SloSummary />
        </div>

        {/* CHANGE FAILURE RATE + ON-CALL BANNER */}
        <div className="grid gap-4 lg:grid-cols-2">
          <ChangeFailureRate />
          <OnCallBanner />
        </div>

        {/* 9. PREDICTION CARDS */}
        <PredictionCards />

        {/* 10. BUSINESS IMPACT CALCULATOR */}
        <BusinessImpactCalculator />

        {/* STATUS TICKER */}
        <StatusTicker />

        {/* QUICK ACTION PANEL */}
        <QuickActionPanel />

        {/* FOOTER STATUS BAR */}
        <FooterBar />
      </motion.div>
    </Layout>
  )
}
