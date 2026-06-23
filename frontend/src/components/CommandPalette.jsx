import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const ENTERPRISE_DATA = {
  pages: [
    { title: 'Dashboard', desc: 'System health, KPIs, live metrics', to: '/dashboard', icon: 'M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z', color: '#22d3ee' },
    { title: 'Intelligence Center', desc: 'Root cause analysis, investigation', to: '/intelligence', icon: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z', color: '#8b5cf6' },
    { title: 'Time Machine', desc: 'Incident timeline replay', to: '/time-machine', icon: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z', color: '#f59e0b' },
    { title: 'Dependency Map', desc: 'Service topology and blast radius', to: '/knowledge-graph', icon: 'M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z', color: '#34d399' },
    { title: 'Impact Analysis', desc: 'Business impact and CTO report', to: '/cto-report', icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z', color: '#f43f5e' },
    { title: 'AI Planner', desc: 'Engineering response plan', to: '/ai-planner', icon: 'M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z', color: '#06b6d4' },
    { title: 'Execute', desc: 'Deployment and remediation execution', to: '/execution-planner', icon: 'M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z', color: '#34d399' },
    { title: 'Analytics', desc: 'Metrics, MTTR, deployment velocity', to: '/analytics', icon: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z', color: '#22d3ee' },
  ],
  incidents: [
    { title: 'Payment Pipeline Failure', desc: 'Circuit breaker saturation cascade', to: '/intelligence?q=payment', type: 'Incident', risk: 92, confidence: 94, time: '5min ago', service: 'Payment Service', severity: 'critical' },
    { title: 'Auth Timeout Cascade', desc: 'OAuth token rotation failure', to: '/intelligence?q=auth', type: 'Incident', risk: 87, confidence: 91, time: '18min ago', service: 'Auth Service', severity: 'high' },
    { title: 'Billing Worker Crash Loop', desc: 'Connection pool exhaustion', to: '/intelligence?q=billing', type: 'Incident', risk: 78, confidence: 89, time: '32min ago', service: 'Billing Service', severity: 'high' },
    { title: 'Redis Memory Eviction', desc: 'Cache miss rate increased 340%', to: '/intelligence?q=redis', type: 'Incident', risk: 74, confidence: 92, time: '1h ago', service: 'Redis Cache', severity: 'medium' },
    { title: 'API Gateway Latency Spikes', desc: 'P99 latency >500ms', to: '/intelligence?q=gateway', type: 'Incident', risk: 62, confidence: 88, time: '2h ago', service: 'API Gateway', severity: 'medium' },
    { title: 'Notification Queue Backlog', desc: '12k messages queued', to: '/intelligence?q=notification', type: 'Incident', risk: 45, confidence: 85, time: '3h ago', service: 'Notification Svc', severity: 'low' },
    { title: 'Payment Retry Logic', desc: 'Retry queue overflow detected', to: '/intelligence?q=retry', type: 'Incident', risk: 88, confidence: 93, time: '10min ago', service: 'Payment Service', severity: 'critical' },
  ],
  services: [
    { title: 'Payment Service', desc: '12 pods · us-east-1 · 99.97% uptime', to: '/dashboard', type: 'Service', risk: 55, confidence: 97, time: 'Live', severity: 'warning' },
    { title: 'Auth Service', desc: '8 pods · us-west-2 · 99.99% uptime', to: '/dashboard', type: 'Service', risk: 22, confidence: 99, time: 'Live', severity: 'success' },
    { title: 'Database', desc: '6 nodes · eu-west-1 · 99.95% uptime', to: '/dashboard', type: 'Service', risk: 35, confidence: 96, time: 'Live', severity: 'success' },
    { title: 'Redis Cache', desc: '4 shards · us-east-1 · 82% memory', to: '/dashboard', type: 'Service', risk: 68, confidence: 91, time: 'Live', severity: 'warning' },
    { title: 'Billing Service', desc: '6 pods · degraded · us-east-1', to: '/dashboard', type: 'Service', risk: 74, confidence: 88, time: 'Live', severity: 'warning' },
    { title: 'API Gateway', desc: '8 pods · global · 2.4k req/s', to: '/dashboard', type: 'Service', risk: 42, confidence: 95, time: 'Live', severity: 'success' },
    { title: 'Message Queue', desc: '5 nodes · eu-west-1', to: '/dashboard', type: 'Service', risk: 28, confidence: 97, time: 'Live', severity: 'success' },
    { title: 'CDN', desc: '20 PoPs · global · 15Gbps', to: '/dashboard', type: 'Service', risk: 12, confidence: 99, time: 'Live', severity: 'success' },
  ],
  evidence: [
    { title: 'Payment Error Rate Spike', desc: '5.2% error rate on /v1/charges endpoint', to: '/intelligence?q=payment', type: 'Evidence', risk: 91, confidence: 95, time: '5min ago', severity: 'critical' },
    { title: 'Redis Memory Growth', desc: '82% utilization — 340% increase over 24h', to: '/intelligence?q=redis', type: 'Evidence', risk: 76, confidence: 89, time: '15min ago', severity: 'high' },
    { title: 'Circuit Breaker State', desc: '72% open threshold — 3 consecutive failures', to: '/intelligence?q=circuit', type: 'Evidence', risk: 88, confidence: 93, time: '8min ago', severity: 'critical' },
    { title: 'DB Connection Pool', desc: '85% utilized — billing worker affected', to: '/intelligence?q=connection', type: 'Evidence', risk: 71, confidence: 90, time: '22min ago', severity: 'high' },
    { title: 'Webhook Delivery Failure', desc: '15% failure rate — provider connectivity', to: '/intelligence?q=webhook', type: 'Evidence', risk: 65, confidence: 87, time: '30min ago', severity: 'medium' },
    { title: 'Memory Leak Detection', desc: 'Heap growth pattern — billing-worker', to: '/intelligence?q=memory', type: 'Evidence', risk: 58, confidence: 92, time: '45min ago', severity: 'medium' },
    { title: 'Auth Token Expiry', desc: 'OAuth rotation timing regression', to: '/intelligence?q=auth', type: 'Evidence', risk: 42, confidence: 86, time: '1h ago', severity: 'low' },
  ],
  mrs: [
    { title: 'fix: circuit breaker threshold tuning', desc: 'PR #401 — @alice', to: '/intelligence?q=payment', type: 'MR', risk: 35, confidence: 94, time: '12min ago', severity: 'success' },
    { title: 'chore: redis memory config update', desc: 'PR #398 — @bob', to: '/intelligence?q=redis', type: 'MR', risk: 28, confidence: 91, time: '25min ago', severity: 'success' },
    { title: 'feat: add circuit breaker to payment', desc: 'PR #395 — @carol', to: '/intelligence?q=payment', type: 'MR', risk: 42, confidence: 88, time: '40min ago', severity: 'warning' },
    { title: 'fix: billing worker OOM handling', desc: 'PR #392 — @dave', to: '/intelligence?q=billing', type: 'MR', risk: 55, confidence: 85, time: '1h ago', severity: 'warning' },
    { title: 'chore: increase connection pool size', desc: 'PR #389 — @alice', to: '/intelligence?q=connection', type: 'MR', risk: 22, confidence: 96, time: '2h ago', severity: 'success' },
  ],
  reports: [
    { title: 'CTO Executive Report', desc: 'Engineering intelligence brief', to: '/cto-report', type: 'Report', risk: 0, confidence: 96, time: 'Updated 5min ago', severity: 'info' },
    { title: 'Risk Assessment Summary', desc: 'Top risks by probability and impact', to: '/intelligence', type: 'Report', risk: 0, confidence: 93, time: 'Updated 15min ago', severity: 'info' },
    { title: 'SLA Compliance Report', desc: 'Service level attainment tracking', to: '/analytics', type: 'Report', risk: 0, confidence: 91, time: 'Updated 1h ago', severity: 'info' },
    { title: 'Deployment Analysis', desc: 'Change failure rate and deployment velocity', to: '/analytics', type: 'Report', risk: 0, confidence: 94, time: 'Updated 30min ago', severity: 'info' },
    { title: 'Cost Impact Analysis', desc: 'Revenue at risk and savings projection', to: '/cto-report', type: 'Report', risk: 0, confidence: 92, time: 'Updated 20min ago', severity: 'info' },
  ],
  deployments: [
    { title: 'payment-api v2.1.0', desc: 'Canary 10% — @alice — success', to: '/dashboard', type: 'Deployment', risk: 30, confidence: 96, time: '15min ago', severity: 'success' },
    { title: 'auth-service v1.8.3', desc: 'Staging — @bob — running', to: '/dashboard', type: 'Deployment', risk: 25, confidence: 93, time: '22min ago', severity: 'warning' },
    { title: 'billing-worker v3.0.1', desc: 'Production — failed — rolled back', to: '/dashboard', type: 'Deployment', risk: 82, confidence: 88, time: '58min ago', severity: 'critical' },
    { title: 'notification-svc v1.4.0', desc: 'Staging — @alice — success', to: '/dashboard', type: 'Deployment', risk: 18, confidence: 97, time: '45min ago', severity: 'success' },
    { title: 'redis-cluster v6.2.8', desc: 'Production — @bob — running', to: '/dashboard', type: 'Deployment', risk: 45, confidence: 90, time: 'now', severity: 'warning' },
  ],
}

const ACTIONS = [
  { title: 'Run Investigation', desc: 'Search for root cause of any incident', to: '/intelligence', icon: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z', color: '#8b5cf6' },
  { title: 'Generate CTO Report', desc: 'Executive engineering intelligence report', to: '/cto-report', icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z', color: '#f43f5e' },
  { title: 'Open Incident Timeline', desc: 'Replay incident history chronologically', to: '/time-machine', icon: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z', color: '#f59e0b' },
  { title: 'View Blast Radius', desc: 'Map impacted services and dependencies', to: '/knowledge-graph', icon: 'M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z', color: '#34d399' },
  { title: 'Replay Historical Incident', desc: 'Learn from past failure patterns', to: '/time-machine', icon: 'M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182', color: '#06b6d4' },
  { title: 'Launch Deployment Plan', desc: 'Execute remediation strategy', to: '/execution-planner', icon: 'M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z', color: '#34d399' },
]

const NLP_MAP = [
  { patterns: ['why did payments fail', 'payment failed', 'payment issue', 'payments down', 'payment error', 'retry', 'retry logic', 'payment retry'], to: '/intelligence?q=payment', title: 'Payment Service Retry Logic', type: 'Investigation' },
  { patterns: ['billing outage', 'billing failed', 'billing issue', 'why did billing fail', 'billing crash', 'billing error'], to: '/intelligence?q=billing', title: 'Billing Worker OOM Cascade', type: 'Investigation' },
  { patterns: ['revenue risk', 'show revenue', 'business impact', 'cost impact', 'revenue at risk', 'financial impact', 'what is the cost'], to: '/cto-report', title: 'Impact Analysis', type: 'Report' },
  { patterns: ['replay incident', 'previous incident', 'past incident', 'historical', 'what happened before', 'time machine', 'timeline'], to: '/time-machine', title: 'Incident Timeline Replay', type: 'Page' },
  { patterns: ['root cause', 'find cause', 'why did this happen', 'investigate', 'what caused', 'debug', 'troubleshoot'], to: '/intelligence', title: 'Intelligence Center', type: 'Page' },
  { patterns: ['api issue', 'api timeout', 'api latency', 'api error', 'gateway issue'], to: '/intelligence?q=gateway', title: 'API Gateway Latency Incident', type: 'Investigation' },
  { patterns: ['auth issue', 'authentication', 'auth failure', 'login failed', 'token issue', 'oauth'], to: '/intelligence?q=auth', title: 'Auth Timeout Cascade', type: 'Investigation' },
  { patterns: ['redis', 'cache', 'memory', 'eviction', 'cache miss'], to: '/intelligence?q=redis', title: 'Redis Memory Eviction', type: 'Investigation' },
  { patterns: ['deploy', 'deployment', 'release', 'rollout', 'canary'], to: '/deployment-simulator', title: 'Deployment Simulator', type: 'Page' },
  { patterns: ['analytics', 'metrics', 'kpi', 'mttr', 'velocity', 'dashboard overview'], to: '/analytics', title: 'Analytics Dashboard', type: 'Page' },
  { patterns: ['dependency', 'map', 'graph', 'topology', 'blast radius', 'service map'], to: '/knowledge-graph', title: 'Dependency Map', type: 'Page' },
  { patterns: ['report', 'cto', 'executive', 'summary', 'brief'], to: '/cto-report', title: 'CTO Report', type: 'Report' },
  { patterns: ['plan', 'execute', 'remediate', 'fix', 'deploy fix', 'action'], to: '/execution-planner', title: 'Execution Planner', type: 'Page' },
]

function getRecent() {
  try { return JSON.parse(localStorage.getItem('of-recent-searches') || '[]') } catch { return [] }
}

function setRecent(items) {
  try { localStorage.setItem('of-recent-searches', JSON.stringify(items.slice(0, 8))) } catch {}
}

function getPinned() {
  try { return JSON.parse(localStorage.getItem('of-pinned-searches') || '[]') } catch { return [] }
}

function setPinned(items) {
  try { localStorage.setItem('of-pinned-searches', JSON.stringify(items)) } catch {}
}

function fuzzyMatch(text, query) {
  if (!query) return true
  const lower = text.toLowerCase()
  const q = query.toLowerCase()
  let qi = 0
  for (let i = 0; i < lower.length && qi < q.length; i++) {
    if (lower[i] === q[qi]) qi++
  }
  return qi >= q.length
}

function findNLPResult(query) {
  const q = query.toLowerCase().trim()
  for (const entry of NLP_MAP) {
    if (entry.patterns.some(p => q.includes(p))) {
      return entry
    }
  }
  return null
}

function Counter({ to }) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    const steps = 20; const inc = to / steps; let cur = 0
    const i = setInterval(() => { cur += inc; if (cur >= to) { setVal(to); clearInterval(i) } else setVal(Math.floor(cur)) }, 25)
    return () => clearInterval(i)
  }, [to])
  return <span className="tabular-nums font-bold">{val}</span>
}

const severityConfig = {
  critical: { dot: 'bg-red-500', text: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', label: 'Critical' },
  high: { dot: 'bg-orange-500', text: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', label: 'High' },
  medium: { dot: 'bg-yellow-500', text: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', label: 'Medium' },
  low: { dot: 'bg-green-500', text: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20', label: 'Low' },
  warning: { dot: 'bg-amber-500', text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', label: 'Warning' },
  success: { dot: 'bg-emerald-500', text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', label: 'Success' },
  info: { dot: 'bg-cyan-500', text: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', label: 'Info' },
}

export default function CommandPalette({ open, onClose, currentPath }) {
  const [query, setQuery] = useState('')
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [recent, setRecentState] = useState(getRecent)
  const [pinned, setPinnedState] = useState(getPinned)
  const [activeTab, setActiveTab] = useState('all')
  const [simulating, setSimulating] = useState(false)
  const [nlpResult, setNlpResult] = useState(null)
  const inputRef = useRef(null)
  const navigate = useNavigate()

  const allResults = useMemo(() => {
    const flat = []
    ENTERPRISE_DATA.incidents.forEach(i => flat.push({ ...i, _section: 'Incidents', _icon: 'M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z', _sectionColor: '#ef4444' }))
    ENTERPRISE_DATA.services.forEach(s => flat.push({ ...s, _section: 'Services', _icon: 'M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6z', _sectionColor: '#22d3ee' }))
    ENTERPRISE_DATA.evidence.forEach(e => flat.push({ ...e, _section: 'Evidence', _icon: 'M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z', _sectionColor: '#8b5cf6' }))
    ENTERPRISE_DATA.mrs.forEach(m => flat.push({ ...m, _section: 'MRs', _icon: 'M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5', _sectionColor: '#06b6d4' }))
    ENTERPRISE_DATA.reports.forEach(r => flat.push({ ...r, _section: 'Reports', _icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z', _sectionColor: '#f43f5e' }))
    ENTERPRISE_DATA.deployments.forEach(d => flat.push({ ...d, _section: 'Deployments', _icon: 'M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z', _sectionColor: '#34d399' }))
    return flat
  }, [])

  const filtered = useMemo(() => {
    if (!query) return { results: [], nlp: null, analytics: {} }
    const nlp = findNLPResult(query)
    const results = allResults.filter(r =>
      fuzzyMatch(r.title, query) || fuzzyMatch(r.desc, query) || fuzzyMatch(r.type, query) || fuzzyMatch(r.service || '', query)
    )
    const analytics = {
      incidents: results.filter(r => r._section === 'Incidents').length,
      services: results.filter(r => r._section === 'Services').length,
      evidence: results.filter(r => r._section === 'Evidence').length,
      mrs: results.filter(r => r._section === 'MRs').length,
      reports: results.filter(r => r._section === 'Reports').length,
      deployments: results.filter(r => r._section === 'Deployments').length,
    }
    return { results: results.slice(0, 50), nlp, analytics }
  }, [query, allResults])

  const getContextRecommendations = (path) => {
    if (!path || path === '/') return ACTIONS.slice(0, 4)
    if (path.includes('intelligence')) return [
      { title: 'Payment Service Retry Logic', desc: 'Investigate retry queue overflow', to: '/intelligence?q=retry', icon: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z', color: '#8b5cf6' },
      { title: 'Blast Radius Analysis', desc: 'Map impacted services and dependencies', to: '/knowledge-graph', icon: 'M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z', color: '#34d399' },
      { title: 'Historical Replay', desc: 'Replay similar past incidents', to: '/time-machine', icon: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z', color: '#f59e0b' },
      { title: 'Mitigation Plan', desc: 'Generate remediation plan', to: '/execution-planner', icon: 'M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z', color: '#34d399' },
    ]
    if (path.includes('cto') || path.includes('impact')) return [
      { title: 'Revenue Impact Analysis', desc: 'Quantify business exposure', to: '/cto-report', icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z', color: '#f43f5e' },
      { title: 'Risk Assessment', desc: 'View top risks ranked by probability', to: '/intelligence', icon: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z', color: '#8b5cf6' },
      { title: 'Executive Brief', desc: 'Generate CTO summary report', to: '/cto-report', icon: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75z', color: '#06b6d4' },
      { title: 'Cost Analysis', desc: 'View financial impact breakdown', to: '/analytics', icon: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625z', color: '#22d3ee' },
    ]
    if (path.includes('dashboard') || path.includes('analytics')) return [
      { title: 'Deployment Summary', desc: 'View recent deployment activity', to: '/dashboard', icon: 'M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z', color: '#34d399' },
      { title: 'MTTR Analysis', desc: 'Mean time to resolve trends', to: '/analytics', icon: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625z', color: '#22d3ee' },
      { title: 'Incident Report', desc: 'View active incident summary', to: '/intelligence', icon: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z', color: '#8b5cf6' },
      { title: 'Service Health', desc: 'View live service health status', to: '/dashboard', icon: 'M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6z', color: '#22d3ee' },
    ]
    return ACTIONS.slice(0, 4)
  }

  const contextRecs = getContextRecommendations(currentPath)

  useEffect(() => {
    if (open) {
      setQuery('')
      setSelectedIdx(0)
      setNlpResult(null)
      setActiveTab('all')
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  useEffect(() => {
    setSelectedIdx(0)
    setNlpResult(filtered.nlp)
  }, [query, filtered.nlp])

  const execute = useCallback((item) => {
    if (!item) return
    const newRecent = [{ title: item.title, desc: item.desc, to: item.to, ts: Date.now() }, ...recent.filter(r => r.title !== item.title).slice(0, 7)]
    setRecentState(newRecent)
    setRecent(newRecent)
    onClose()
    navigate(item.to)
  }, [recent, onClose, navigate])

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') { onClose(); return }
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIdx(i => Math.min(i + 1, filtered.results.length + recent.length + pinned.length + contextRecs.length + (nlpResult ? 1 : 0) + 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIdx(i => Math.max(i - 1, 0)) }
    if (e.key === 'Enter') {
      if (nlpResult && selectedIdx === 0) { execute({ title: nlpResult.title, to: nlpResult.to }); return }
      const offset = (nlpResult ? 1 : 0)
      const ctxIdx = selectedIdx - offset
      if (ctxIdx >= 0 && ctxIdx < contextRecs.length) { execute({ ...contextRecs[ctxIdx], to: contextRecs[ctxIdx].to }); return }
      const recOff = offset + contextRecs.length
      const recIdx = selectedIdx - recOff
      if (recIdx >= 0 && recIdx < recent.length) { execute(recent[recIdx]); return }
      const pinOff = recOff + recent.length
      const pinIdx = selectedIdx - pinOff
      if (pinIdx >= 0 && pinIdx < pinned.length) { execute(pinned[pinIdx]); return }
      const resOff = pinOff + pinned.length
      const resIdx = selectedIdx - resOff
      if (resIdx >= 0 && resIdx < filtered.results.length) { execute(filtered.results[resIdx]) }
    }
  }

  const togglePin = (item, e) => {
    e.stopPropagation()
    const exists = pinned.some(p => p.title === item.title)
    const next = exists ? pinned.filter(p => p.title !== item.title) : [...pinned, { title: item.title, desc: item.desc, to: item.to }]
    setPinnedState(next)
    setPinned(next)
  }

  const hasResults = filtered.results.length > 0 || query === ''
  const noResults = query && !hasResults

  const totalResults = filtered.analytics.incidents + filtered.analytics.services + filtered.analytics.evidence + filtered.analytics.mrs + filtered.analytics.reports + filtered.analytics.deployments

  const resultSections = query ? [
    ['Incidents', ENTERPRISE_DATA.incidents.filter(i => fuzzyMatch(i.title, query) || fuzzyMatch(i.desc, query) || fuzzyMatch(i.service || '', query)), '#ef4444'],
    ['Services', ENTERPRISE_DATA.services.filter(s => fuzzyMatch(s.title, query) || fuzzyMatch(s.desc, query)), '#22d3ee'],
    ['Evidence', ENTERPRISE_DATA.evidence.filter(e => fuzzyMatch(e.title, query) || fuzzyMatch(e.desc, query)), '#8b5cf6'],
    ['MRs', ENTERPRISE_DATA.mrs.filter(m => fuzzyMatch(m.title, query) || fuzzyMatch(m.desc, query)), '#06b6d4'],
    ['Reports', ENTERPRISE_DATA.reports.filter(r => fuzzyMatch(r.title, query) || fuzzyMatch(r.desc, query)), '#f43f5e'],
    ['Deployments', ENTERPRISE_DATA.deployments.filter(d => fuzzyMatch(d.title, query) || fuzzyMatch(d.desc, query)), '#34d399'],
  ] : []

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Desktop backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            className="fixed inset-0 z-[100] hidden lg:block"
            onClick={onClose}
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          </motion.div>

          {/* Mobile backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            className="fixed inset-0 z-[100] lg:hidden"
            onClick={onClose}
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          </motion.div>

          {/* DESKTOP: Full command center */}
          <motion.div
            initial={{ opacity: 0, y: -24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="fixed z-[101] inset-x-0 top-[6vh] mx-auto max-w-2xl hidden lg:block"
            onClick={e => e.stopPropagation()}
          >
            <div className="rounded-2xl border shadow-2xl overflow-hidden backdrop-blur-2xl"
              style={{ background: 'var(--bg-base)', borderColor: 'var(--border)', boxShadow: '0 32px 80px rgba(0,0,0,0.45), 0 0 0 1px rgba(6,182,212,0.05)' }}
            >
              {/* Search Input */}
              <div className="flex items-center gap-3 px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
                <svg className="h-4 w-4 shrink-0" style={{ color: 'var(--text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={e => { setQuery(e.target.value); setSimulating(true); setTimeout(() => setSimulating(false), 300) }}
                  onKeyDown={handleKeyDown}
                  placeholder="Search incidents, services, MRs, or ask a question..."
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-600"
                  style={{ color: 'var(--text-primary)' }}
                />
                <div className="flex items-center gap-1.5">
                  {simulating && <div className="h-3 w-3 animate-spin rounded-full border-2 border-cyan-500/30 border-t-cyan-400" />}
                  <kbd className="rounded border px-1.5 py-0.5 text-[9px] font-mono" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>ESC</kbd>
                </div>
              </div>

              {/* NLP Result Banner */}
              {nlpResult && !simulating && (
                <div className="mx-4 mt-3 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <svg className="h-3.5 w-3.5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                    </svg>
                    <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-cyan-400">AI Matched</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{nlpResult.title}</p>
                      <p className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>Natural language match · {nlpResult.type}</p>
                    </div>
                    <button onClick={() => execute({ title: nlpResult.title, to: nlpResult.to })}
                      className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-[10px] font-semibold text-cyan-400 hover:bg-cyan-500/20 transition-all"
                    >
                      Open →
                    </button>
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="max-h-[55vh] overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
                {/* No results with AI fallback */}
                {!simulating && noResults && (
                  <div className="px-5 py-6">
                    <div className="flex items-center gap-2 mb-4">
                      <svg className="h-4 w-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                      </svg>
                      <span className="text-xs font-semibold text-cyan-400">AI Suggested Investigations</span>
                    </div>
                    <p className="text-[10px] mb-3" style={{ color: 'var(--text-muted)' }}>No direct match for "<span className="text-slate-400">{query}</span>". Try these:</p>
                    <div className="space-y-0.5">
                      {contextRecs.map((r, i) => (
                        <button key={i} onClick={() => execute(r)}
                          className="flex items-center gap-3 w-full rounded-xl px-3 py-2.5 text-left transition-all hover:bg-cyan-500/5"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          <span className="flex items-center justify-center w-6 h-6 rounded-lg shrink-0" style={{ background: `${r.color}15` }}>
                            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: r.color }}>
                              <path strokeLinecap="round" strokeLinejoin="round" d={r.icon} />
                            </svg>
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>{r.title}</div>
                            <div className="text-[9px] truncate" style={{ color: 'var(--text-muted)' }}>{r.desc}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Search Results */}
                {!simulating && query && hasResults && (
                  <div className="px-4 py-3">
                    {/* Analytics Bar */}
                    {totalResults > 0 && (
                      <div className="flex items-center gap-3 mb-3 px-2 py-2 rounded-lg border" style={{ borderColor: 'var(--border)', background: 'rgba(255,255,255,0.015)' }}>
                        {Object.entries(filtered.analytics).filter(([,v]) => v > 0).map(([key, val]) => (
                          <div key={key} className="flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
                            <span className="text-[10px] font-mono font-bold" style={{ color: 'var(--text-secondary)' }}><Counter to={val} /></span>
                            <span className="text-[8px] font-mono capitalize">{key} •</span>
                          </div>
                        ))}
                        {totalResults > 0 && (
                          <span className="ml-auto text-[8px] font-mono" style={{ color: 'var(--text-muted)' }}>
                            <span className="text-emerald-400 font-bold">{Math.min(92 + Math.floor(totalResults * 0.5), 99)}</span>% confidence
                          </span>
                        )}
                      </div>
                    )}

                    {/* Grouped results */}
                    {resultSections.filter(([,items]) => items.length > 0).map(([section, items, color]) => (
                      <div key={section} className="mb-2">
                        <p className="px-2 pb-1 text-[9px] font-mono font-bold uppercase tracking-widest flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
                          {section}
                          <span className="text-[8px] font-normal opacity-50">({items.length})</span>
                        </p>
                        <div className="space-y-0.5">
                          {items.slice(0, 4).map((item, idx) => {
                            const sev = severityConfig[item.severity] || severityConfig.info
                            return (
                              <button key={`${section}-${idx}`} onClick={() => execute(item)}
                                className="flex items-center gap-3 w-full rounded-xl px-3 py-2.5 text-left transition-all group"
                                style={{ color: 'var(--text-secondary)', background: 'transparent' }}
                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(6,182,212,0.04)' }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                              >
                                {/* Severity dot */}
                                <span className={`w-2 h-2 rounded-full shrink-0 ${sev.dot}`} />
                                {/* Main content */}
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[11px] font-medium truncate" style={{ color: 'var(--text-primary)' }}>{item.title}</span>
                                    {item.type && (
                                      <span className="text-[8px] font-mono shrink-0 px-1 py-0.5 rounded" style={{ background: `${color}12`, color }}>
                                        {item.type}
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[9px] truncate" style={{ color: 'var(--text-muted)' }}>{item.desc}</span>
                                  </div>
                                </div>
                                {/* Risk & Confidence */}
                                <div className="flex items-center gap-2 shrink-0">
                                  {item.risk > 0 && (
                                    <span className={`text-[9px] font-mono font-bold ${sev.text}`}>{item.risk}</span>
                                  )}
                                  {item.confidence > 0 && (
                                    <span className="text-[8px] font-mono" style={{ color: 'var(--text-muted)' }}>{item.confidence}%</span>
                                  )}
                                  <span className="text-[8px] font-mono hidden sm:block" style={{ color: 'var(--text-muted)' }}>{item.time}</span>
                                </div>
                                {/* Pin */}
                                <button onClick={(e) => togglePin(item, e)}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-white/[0.05]"
                                  style={{ color: 'var(--text-muted)' }}
                                  title={pinned.some(p => p.title === item.title) ? 'Unpin' : 'Pin'}
                                >
                                  <svg className="h-3 w-3" fill={pinned.some(p => p.title === item.title) ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                                  </svg>
                                </button>
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Default state (no query) */}
                {!simulating && !query && (
                  <div className="px-5 py-3">
                    {/* AI Recommended */}
                    <div className="mb-4">
                      <p className="px-1 pb-2 text-[9px] font-mono font-bold uppercase tracking-widest flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
                        <svg className="h-3 w-3 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                        </svg>
                        AI Recommended
                      </p>
                      <div className="space-y-0.5">
                        {contextRecs.map((r, i) => (
                          <button key={i} onClick={() => execute(r)}
                            className="flex items-center gap-3 w-full rounded-xl px-3 py-2.5 text-left transition-all hover:bg-cyan-500/5"
                            style={{ color: 'var(--text-secondary)' }}
                          >
                            <span className="flex items-center justify-center w-6 h-6 rounded-lg shrink-0" style={{ background: `${r.color}15` }}>
                              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: r.color }}>
                                <path strokeLinecap="round" strokeLinejoin="round" d={r.icon} />
                              </svg>
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className="text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>{r.title}</div>
                              <div className="text-[9px] truncate" style={{ color: 'var(--text-muted)' }}>{r.desc}</div>
                            </div>
                            <svg className="h-3 w-3 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                            </svg>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Recent */}
                    {recent.length > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between px-1 pb-2">
                          <span className="text-[9px] font-mono font-bold uppercase tracking-widest flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
                            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Recent
                          </span>
                          <button onClick={() => { setRecentState([]); setRecent([]) }} className="text-[8px] font-mono hover:text-slate-400" style={{ color: 'var(--text-muted)' }}>Clear</button>
                        </div>
                        <div className="space-y-0.5">
                          {recent.map((r, i) => (
                            <button key={i} onClick={() => execute(r)}
                              className="flex items-center gap-3 w-full rounded-xl px-3 py-2 text-left transition-all hover:bg-white/[0.03]"
                              style={{ color: 'var(--text-secondary)' }}
                            >
                              <svg className="h-3 w-3 shrink-0" style={{ color: 'var(--text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <div className="min-w-0 flex-1">
                                <span className="text-xs truncate block">{r.title}</span>
                                <span className="text-[9px] truncate block" style={{ color: 'var(--text-muted)' }}>{r.desc}</span>
                              </div>
                              {r.ts && <span className="text-[8px] font-mono shrink-0" style={{ color: 'var(--text-muted)' }}>{new Date(r.ts).toLocaleDateString()}</span>}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Pinned */}
                    {pinned.length > 0 && (
                      <div className="mb-4">
                        <p className="px-1 pb-2 text-[9px] font-mono font-bold uppercase tracking-widest flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                          </svg>
                          Pinned
                        </p>
                        <div className="space-y-0.5">
                          {pinned.map((p, i) => (
                            <button key={i} onClick={() => execute(p)}
                              className="flex items-center gap-3 w-full rounded-xl px-3 py-2 text-left transition-all hover:bg-white/[0.03]"
                              style={{ color: 'var(--text-secondary)' }}
                            >
                              <svg className="h-3 w-3 shrink-0 text-cyan-500" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                              </svg>
                              <div className="min-w-0 flex-1">
                                <span className="text-xs truncate block">{p.title}</span>
                                <span className="text-[9px] truncate block" style={{ color: 'var(--text-muted)' }}>{p.desc}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Navigation Pages */}
                    <div className="mb-3">
                      <p className="px-1 pb-1.5 text-[9px] font-mono font-bold uppercase tracking-widest flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6z" />
                        </svg>
                        Navigation
                      </p>
                      <div className="space-y-0.5">
                        {ENTERPRISE_DATA.pages.map((page) => (
                          <button key={page.title} onClick={() => execute(page)}
                            className="flex items-center gap-3 w-full rounded-xl px-3 py-2 text-sm text-left transition-all group hover:bg-white/[0.03]"
                            style={{ color: 'var(--text-secondary)' }}
                          >
                            <span className="flex items-center justify-center w-5 h-5 rounded shrink-0" style={{ background: `${page.color}15`, color: page.color }}>
                              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d={page.icon} />
                              </svg>
                            </span>
                            <span className="flex-1 truncate text-xs">{page.title}</span>
                            <span className="text-[8px] font-mono truncate max-w-[180px]" style={{ color: 'var(--text-muted)' }}>{page.desc}</span>
                            <svg className="h-3 w-3 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                            </svg>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div>
                      <p className="px-1 pb-1.5 text-[9px] font-mono font-bold uppercase tracking-widest flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21" />
                        </svg>
                        Actions
                      </p>
                      <div className="space-y-0.5">
                        {ACTIONS.map((action, i) => (
                          <button key={i} onClick={() => execute(action)}
                            className="flex items-center gap-3 w-full rounded-xl px-3 py-2 text-sm text-left transition-all group hover:bg-white/[0.03]"
                            style={{ color: 'var(--text-secondary)' }}
                          >
                            <span className="flex items-center justify-center w-5 h-5 rounded shrink-0" style={{ background: `${action.color}15`, color: action.color }}>
                              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d={action.icon} />
                              </svg>
                            </span>
                            <span className="flex-1 truncate text-xs">{action.title}</span>
                            <span className="text-[8px] font-mono truncate max-w-[180px]" style={{ color: 'var(--text-muted)' }}>{action.desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center gap-3 px-5 py-2.5 border-t" style={{ borderColor: 'var(--border)', background: 'rgba(255,255,255,0.015)' }}>
                <div className="flex items-center gap-2 text-[9px] font-mono" style={{ color: 'var(--text-muted)' }}>
                  <kbd className="rounded border px-1" style={{ borderColor: 'var(--border)' }}>↑↓</kbd>
                  <span>Navigate</span>
                </div>
                <div className="flex items-center gap-2 text-[9px] font-mono" style={{ color: 'var(--text-muted)' }}>
                  <kbd className="rounded border px-1" style={{ borderColor: 'var(--border)' }}>↵</kbd>
                  <span>Open</span>
                </div>
                {pinned.length > 0 && (
                  <div className="flex items-center gap-2 text-[9px] font-mono" style={{ color: 'var(--text-muted)' }}>
                    <kbd className="rounded border px-1" style={{ borderColor: 'var(--border)' }}>★</kbd>
                    <span>Pin</span>
                  </div>
                )}
                <span className="ml-auto text-[9px] font-mono" style={{ color: 'var(--text-muted)' }}>
                  {totalResults > 0 ? `${totalResults} results` : `${ENTERPRISE_DATA.pages.length + ACTIONS.length} items`}
                </span>
              </div>
            </div>
          </motion.div>

          {/* MOBILE: Bottom sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
            className="fixed bottom-0 inset-x-0 z-[101] lg:hidden"
            onClick={e => e.stopPropagation()}
          >
            <div
              className="rounded-t-2xl border shadow-2xl max-h-[85vh] flex flex-col"
              style={{ background: 'var(--bg-base)', borderColor: 'var(--border)', boxShadow: '0 -8px 40px rgba(0,0,0,0.3)' }}
            >
              {/* Handle */}
              <div className="flex justify-center pt-2 pb-1 shrink-0">
                <div className="w-10 h-1 rounded-full bg-slate-700" />
              </div>

              {/* Mobile Search */}
              <div className="flex items-center gap-3 px-4 py-3 border-b shrink-0" style={{ borderColor: 'var(--border)' }}>
                <svg className="h-4 w-4 shrink-0" style={{ color: 'var(--text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search..."
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-600"
                  style={{ color: 'var(--text-primary)' }}
                />
                <button onClick={onClose} className="text-[10px] font-semibold text-cyan-400">Cancel</button>
              </div>

              {/* Mobile results */}
              <div className="flex-1 overflow-y-auto px-3 py-2" style={{ scrollbarWidth: 'thin' }}>
                {!query && (
                  <>
                    <p className="px-2 pb-1.5 text-[9px] font-mono font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Quick Actions</p>
                    <div className="grid grid-cols-2 gap-1.5 mb-3">
                      {ACTIONS.slice(0, 4).map((a, i) => (
                        <button key={i} onClick={() => execute(a)}
                          className="flex items-center gap-2 rounded-lg border px-2.5 py-2 text-left transition-all"
                          style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
                        >
                          <span className="flex items-center justify-center w-5 h-5 rounded shrink-0" style={{ background: `${a.color}15` }}>
                            <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: a.color }}>
                              <path strokeLinecap="round" strokeLinejoin="round" d={a.icon} />
                            </svg>
                          </span>
                          <span className="text-[10px] truncate">{a.title}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
                {filtered.results.slice(0, 8).map((item, idx) => (
                  <button key={idx} onClick={() => execute(item)}
                    className="flex items-center gap-3 w-full rounded-xl px-3 py-2.5 text-left transition-all hover:bg-white/[0.03]"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] font-medium truncate" style={{ color: 'var(--text-primary)' }}>{item.title}</div>
                      <div className="text-[9px] truncate" style={{ color: 'var(--text-muted)' }}>{item.desc}</div>
                    </div>
                    {item.risk > 0 && (
                      <span className="text-[9px] font-mono font-bold shrink-0" style={{ color: item.severity === 'critical' ? '#ef4444' : item.severity === 'high' ? '#f59e0b' : '#34d399' }}>{item.risk}</span>
                    )}
                  </button>
                ))}
                {query && filtered.results.length === 0 && (
                  <div className="py-8 text-center">
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>No results for "{query}"</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}