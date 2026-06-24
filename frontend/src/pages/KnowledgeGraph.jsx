import { useCallback, useState, useMemo, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import ReactFlow, { Background, Controls, MiniMap, useNodesState, useEdgesState, MarkerType, useReactFlow, ReactFlowProvider } from 'reactflow'
import 'reactflow/dist/style.css'
import Layout from '../components/Layout'
import NarrativeCTA from '../components/NarrativeCTA'
import ExecutiveBanner from '../components/ExecutiveBanner'
import PageHero from '../components/PageHero'

const initialNodes = [
  { id: 'gateway', position: { x: 475, y: 50 }, data: { label: 'API Gateway', type: 'API', risk: 'medium', team: 'Platform', deps: ['Payments', 'Auth', 'Billing'] } },
  { id: 'auth', position: { x: 150, y: 200 }, data: { label: 'Auth Service', type: 'Service', risk: 'low', team: 'Security', deps: [] } },
  { id: 'payments', position: { x: 400, y: 200 }, data: { label: 'Payment Service', type: 'Service', risk: 'high', team: 'Payments', deps: ['Auth', 'Database'] } },
  { id: 'billing', position: { x: 750, y: 200 }, data: { label: 'Billing Service', type: 'Service', risk: 'medium', team: 'Billing', deps: ['Auth', 'Cache'] } },
  { id: 'notifications', position: { x: 50, y: 400 }, data: { label: 'Notification Service', type: 'Service', risk: 'low', team: 'Platform', deps: ['Auth'] } },
  { id: 'webhooks', position: { x: 275, y: 400 }, data: { label: 'Webhook Service', type: 'Service', risk: 'medium', team: 'Platform', deps: ['Payments'] } },
  { id: 'cache', position: { x: 600, y: 400 }, data: { label: 'Redis Cache', type: 'Database', risk: 'low', team: 'Infra', deps: [] } },
  { id: 'db', position: { x: 850, y: 400 }, data: { label: 'PostgreSQL', type: 'Database', risk: 'low', team: 'Infra', deps: [] } },
  { id: 'ci-pipeline', position: { x: 400, y: 600 }, data: { label: 'CI Pipeline', type: 'Pipeline', risk: 'low', team: 'DevOps', deps: ['Gateway'] } },
  { id: 'cd-pipeline', position: { x: 650, y: 600 }, data: { label: 'CD Pipeline', type: 'Pipeline', risk: 'low', team: 'DevOps', deps: ['CI Pipeline'] } },
]

const initialEdges = [
  { id: 'e-gw-auth', source: 'gateway', target: 'auth', animated: false, style: { stroke: '#475569' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#475569' } },
  { id: 'e-gw-pay', source: 'gateway', target: 'payments', animated: true, style: { stroke: '#ef4444', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#ef4444' } },
  { id: 'e-gw-bill', source: 'gateway', target: 'billing', animated: false, style: { stroke: '#f59e0b' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#f59e0b' } },
  { id: 'e-auth-notif', source: 'auth', target: 'notifications', animated: false, style: { stroke: '#475569' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#475569' } },
  { id: 'e-pay-webhook', source: 'payments', target: 'webhooks', animated: false, style: { stroke: '#f59e0b' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#f59e0b' } },
  { id: 'e-pay-bill', source: 'payments', target: 'billing', animated: true, style: { stroke: '#ef4444', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#ef4444' } },
  { id: 'e-bill-cache', source: 'billing', target: 'cache', animated: false, style: { stroke: '#475569' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#475569' } },
  { id: 'e-pay-db', source: 'payments', target: 'db', animated: false, style: { stroke: '#475569' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#475569' } },
  { id: 'e-ci-cd', source: 'ci-pipeline', target: 'cd-pipeline', animated: false, style: { stroke: '#475569' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#475569' } },
  { id: 'e-gw-ci', source: 'gateway', target: 'ci-pipeline', animated: false, style: { stroke: '#475569' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#475569' } },
]

const serviceDetails = {
  gateway: { uptime: 99.97, responseTime: '42ms', errorRate: 0.3, incidents: 3, description: 'Central API gateway routing all external traffic' },
  auth: { uptime: 99.99, responseTime: '18ms', errorRate: 0.02, incidents: 0, description: 'Authentication and authorization service' },
  payments: { uptime: 99.82, responseTime: '120ms', errorRate: 1.2, incidents: 7, description: 'Payment processing and transaction orchestration' },
  billing: { uptime: 99.91, responseTime: '55ms', errorRate: 0.5, incidents: 2, description: 'Invoice generation and billing cycles' },
  notifications: { uptime: 99.98, responseTime: '28ms', errorRate: 0.08, incidents: 1, description: 'Push notifications and email delivery' },
  webhooks: { uptime: 99.87, responseTime: '67ms', errorRate: 0.6, incidents: 4, description: 'Webhook dispatch to external partners' },
  cache: { uptime: 99.99, responseTime: '2ms', errorRate: 0.01, incidents: 0, description: 'In-memory cache layer for hot data' },
  db: { uptime: 99.95, responseTime: '8ms', errorRate: 0.1, incidents: 1, description: 'Primary PostgreSQL database cluster' },
  'ci-pipeline': { uptime: 99.75, responseTime: '340s', errorRate: 3.5, incidents: 12, description: 'Continuous integration build pipeline' },
  'cd-pipeline': { uptime: 99.60, responseTime: '520s', errorRate: 4.2, incidents: 15, description: 'Continuous deployment release pipeline' },
}

const dependencies = [
  { id: 'd-1', source: 'gateway', target: 'payments', type: 'sync', risk: 'high', status: 'critical', propagation: 92, latency: '45ms' },
  { id: 'd-2', source: 'gateway', target: 'auth', type: 'sync', risk: 'low', status: 'healthy', propagation: 12, latency: '18ms' },
  { id: 'd-3', source: 'gateway', target: 'billing', type: 'sync', risk: 'medium', status: 'degraded', propagation: 45, latency: '55ms' },
  { id: 'd-4', source: 'payments', target: 'billing', type: 'async', risk: 'high', status: 'critical', propagation: 87, latency: '120ms' },
  { id: 'd-5', source: 'payments', target: 'webhooks', type: 'async', risk: 'medium', status: 'degraded', propagation: 34, latency: '67ms' },
  { id: 'd-6', source: 'payments', target: 'db', type: 'sync', risk: 'low', status: 'healthy', propagation: 8, latency: '8ms' },
  { id: 'd-7', source: 'billing', target: 'cache', type: 'sync', risk: 'low', status: 'healthy', propagation: 5, latency: '2ms' },
  { id: 'd-8', source: 'auth', target: 'notifications', type: 'sync', risk: 'low', status: 'healthy', propagation: 3, latency: '28ms' },
]

const teams = [
  { name: 'Payments', id: 'payments', services: ['payments', 'billing'], members: 8, risk: 72, lead: 'Sarah Chen', color: '#ef4444' },
  { name: 'Platform', id: 'platform', services: ['gateway', 'webhooks', 'notifications'], members: 12, risk: 48, lead: 'Mike Torres', color: '#f59e0b' },
  { name: 'Infra', id: 'infra', services: ['cache', 'db'], members: 6, risk: 22, lead: 'Aisha Patel', color: '#22c55e' },
  { name: 'DevOps', id: 'devops', services: ['ci-pipeline', 'cd-pipeline'], members: 5, risk: 68, lead: 'James Kim', color: '#8b5cf6' },
]

const allInsights = [
  { id: 'i-1', text: 'Payment Service is a critical hub — failure impacts 3 downstream services', priority: 'high', icon: 'hub', category: 'Architecture' },
  { id: 'i-2', text: 'Auth Service has zero dependencies — single point of failure risk if compromised', priority: 'high', icon: 'vulnerability', category: 'Security' },
  { id: 'i-3', text: 'API Gateway connects all services — highest blast radius in the topology', priority: 'critical', icon: 'blast', category: 'Resilience' },
  { id: 'i-4', text: 'CI/CD pipeline has no redundancy — deployment risk during peak hours', priority: 'medium', icon: 'pipeline', category: 'Operations' },
  { id: 'i-5', text: 'Billing depends on Payments sync — cascading failure if payment latency spikes', priority: 'medium', icon: 'cascade', category: 'Architecture' },
  { id: 'i-6', text: 'Redis Cache has zero inbound dependencies — consider decommissioning or consolidation', priority: 'low', icon: 'optimization', category: 'Cost' },
]

const propagationPaths = [
  { from: 'payments', to: 'billing', risk: 87, steps: ['payments', 'billing'], label: 'Payment → Billing' },
  { from: 'billing', to: 'notifications', risk: 45, steps: ['billing', 'cache', 'notifications'], label: 'Billing → Notifications' },
  { from: 'payments', to: 'webhooks', risk: 34, steps: ['payments', 'webhooks'], label: 'Payment → Webhooks' },
  { from: 'gateway', to: 'payments', risk: 92, steps: ['gateway', 'payments'], label: 'Gateway → Payments' },
  { from: 'gateway', to: 'billing', risk: 45, steps: ['gateway', 'billing'], label: 'Gateway → Billing' },
  { from: 'payments', to: 'db', risk: 8, steps: ['payments', 'db'], label: 'Payment → Database' },
  { from: 'ci-pipeline', to: 'cd-pipeline', risk: 78, steps: ['ci-pipeline', 'cd-pipeline'], label: 'CI → CD Pipeline' },
]

const riskColors = {
  high: { bg: 'rgba(239,68,68,0.18)', border: '#ef4444', text: '#fca5a5', glow: '0 0 20px rgba(239,68,68,0.3)', badge: 'bg-red-500/15 text-red-400 border-red-500/30' },
  medium: { bg: 'rgba(245,158,11,0.18)', border: '#f59e0b', text: '#fcd34d', glow: '0 0 15px rgba(245,158,11,0.2)', badge: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
  low: { bg: 'rgba(34,197,94,0.12)', border: '#22c55e', text: '#86efac', glow: '0 0 10px rgba(34,197,94,0.15)', badge: 'bg-green-500/15 text-green-400 border-green-500/30' },
}

const statusStyles = {
  healthy: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  degraded: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  critical: 'bg-red-500/15 text-red-400 border-red-500/30',
}
const statusDots = { healthy: '#22c55e', degraded: '#f59e0b', critical: '#ef4444' }

function NetworkIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
    </svg>
  )
}

function AlertTriangle({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  )
}

function ShieldIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  )
}

function BoltIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
  )
}

function ExclamationCircle({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
    </svg>
  )
}

function ArrowPath({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
    </svg>
  )
}

const typeIcons = {
  Service: '\u2699\uFE0F',
  API: '\uD83D\uDD0C',
  Database: '\uD83D\uDDFC\uFE0F',
  Pipeline: '\uD83D\uDD04',
}

const insightIconMap = {
  hub: NetworkIcon,
  vulnerability: ShieldIcon,
  blast: BoltIcon,
  pipeline: ArrowPath,
  cascade: ExclamationCircle,
  optimization: ArrowPath,
}

function CustomNode({ data }) {
  const c = riskColors[data.risk] || riskColors.low
  const detail = serviceDetails[data.id]
  const isHealthy = detail && detail.errorRate < 0.5
  const isDegraded = detail && detail.errorRate >= 0.5 && detail.errorRate < 2
  const healthDot = isHealthy ? '#22c55e' : isDegraded ? '#f59e0b' : '#ef4444'
  const healthPulse = isHealthy ? '' : 'animate-pulse'
  const revenueImpact = data.risk === 'high' ? '$2.1M' : data.risk === 'medium' ? '$890K' : '$120K'
  return (
    <motion.div
      whileHover={{ scale: 1.15 }}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      className="rounded-2xl border-2 px-5 py-4 text-center shadow-2xl backdrop-blur-xl min-w-[180px] cursor-pointer relative overflow-hidden group of-glow-card"
      style={{ backgroundColor: c.bg, borderColor: c.border, boxShadow: c.glow }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.06] to-transparent pointer-events-none" />
      <div className="absolute -top-6 -right-6 h-16 w-16 rounded-full opacity-[0.06] pointer-events-none"
        style={{ background: `radial-gradient(circle, ${c.border}, transparent)` }} />
      <span className="relative flex items-center justify-center mb-2">
        <span className="relative flex h-3 w-3 mr-1">
          <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${healthPulse}`} style={{ background: healthDot }} />
          <span className="relative inline-flex h-3 w-3 rounded-full" style={{ background: healthDot }} />
        </span>
        <span className="text-lg relative">{typeIcons[data.type] || '\u2699'}</span>
      </span>
      <div className="relative">
        <div className="text-base font-bold mb-0.5" style={{ color: c.text }}>{data.label}</div>
        <div className="text-xs text-slate-500 mb-1.5">{data.type} &middot; {data.team}</div>
        <div className="inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1" style={{ borderColor: `${c.border}40`, backgroundColor: `${c.border}10` }}>
          <svg className="h-3.5 w-3.5" style={{ color: c.text }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-bold" style={{ color: c.text }}>{revenueImpact}</span>
          <span className="text-[9px] text-slate-600">at risk</span>
        </div>
      </div>
      {data.risk === 'high' && (
        <div className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.6)]" />
      )}
    </motion.div>
  )
}

const nodeTypes = { custom: CustomNode }

function SearchFilterBar({ search, setSearch, activeFilter, setActiveFilter, drawerOpen, setDrawerOpen }) {
  const filters = [
    { key: 'all', label: 'All' },
    { key: 'high', label: 'High Risk' },
    { key: 'medium', label: 'Medium Risk' },
    { key: 'low', label: 'Low Risk' },
    { key: 'Service', label: 'Services' },
    { key: 'Database', label: 'Databases' },
    { key: 'Pipeline', label: 'Pipelines' },
  ]

  return (
    <div className="flex items-center gap-3 flex-shrink-0">
      <div className="relative flex-1 min-w-0 max-w-[240px]">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search nodes..."
          className="w-full rounded-lg border border-white/[0.06] bg-white/[0.03] py-2 pl-9 pr-3 text-sm text-slate-300 placeholder-slate-600 outline-none focus:border-cyan-500/40 focus:bg-white/[0.06] transition-all"
        />
      </div>
      <div className="hidden sm:flex gap-1.5">
        {filters.slice(0, 4).map(f => {
          const active = activeFilter === f.key
          return (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                active
                  ? 'border-cyan-400/40 bg-cyan-400/10 text-cyan-300'
                  : 'border-white/[0.06] text-slate-500 hover:border-white/[0.12] hover:text-slate-400'
              }`}
            >
              {f.label}
            </button>
          )
        })}
      </div>
      <button
        onClick={() => setDrawerOpen(!drawerOpen)}
        className={`lg:hidden rounded-lg border p-2 transition-all ${
          drawerOpen ? 'border-cyan-400/40 bg-cyan-400/10 text-cyan-300' : 'border-white/[0.06] text-slate-500 hover:text-slate-400'
        }`}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>
    </div>
  )
}

function GraphInside() {
  const reactFlowInstance = useReactFlow()
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes.map(n => ({ ...n, type: 'custom' })))
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges.map(e => {
    const dep = dependencies.find(d => d.source === e.source && d.target === e.target)
    const isHigh = dep?.risk === 'high' || e.style?.stroke === '#ef4444'
    return {
      ...e,
      type: isHigh ? 'animated' : undefined,
      data: { ...dep },
      animated: isHigh || e.animated,
    }
  }))
  const [selectedNode, setSelectedNode] = useState(null)
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const [blastMode, setBlastMode] = useState(false)
  const [presentMode, setPresentMode] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    if (presentMode) {
      document.body.classList.add('of-present-mode')
    } else {
      document.body.classList.remove('of-present-mode')
    }
    return () => document.body.classList.remove('of-present-mode')
  }, [presentMode])
  const graphRef = useRef(null)

  useEffect(() => {
    if (reactFlowInstance) {
      const t = setTimeout(() => {
        reactFlowInstance.fitView({ padding: 0.06 })
      }, 150)
      return () => clearTimeout(t)
    }
  }, [reactFlowInstance])

  const onNodeClick = useCallback((_, node) => {
    setSelectedNode(node)
  }, [])

  const onPaneClick = useCallback(() => {
    setSelectedNode(null)
  }, [])

  const filteredNodes = useMemo(() => {
    let result = nodes
    if (activeFilter !== 'all') {
      if (['high', 'medium', 'low'].includes(activeFilter)) {
        result = result.filter(n => n.data.risk === activeFilter)
      } else {
        result = result.filter(n => n.data.type === activeFilter)
      }
    }
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(n => n.data.label.toLowerCase().includes(q) || n.data.team.toLowerCase().includes(q) || n.data.type.toLowerCase().includes(q))
    }
    return result
  }, [nodes, search, activeFilter])

  const blastNodes = useMemo(() => {
    if (!blastMode || !selectedNode) return null
    return nodes.map(n => {
      const isBlast = n.id === selectedNode.id || selectedNode.data.deps?.includes(n.data.label) || edges.some(e => e.source === selectedNode.id && e.target === n.id)
      if (!isBlast) {
        return { ...n, data: { ...n.data, risk: 'low' }, style: { opacity: 0.2 } }
      }
      return { ...n, style: {} }
    })
  }, [nodes, selectedNode, blastMode, edges])

  const displayNodes = blastNodes || filteredNodes
  const highCount = nodes.filter(n => n.data.risk === 'high').length
  const mediumCount = nodes.filter(n => n.data.risk === 'medium').length
  const lowCount = nodes.filter(n => n.data.risk === 'low').length
  const uniqueTeams = [...new Set(nodes.map(n => n.data.team))]
  const selectedDetail = selectedNode ? serviceDetails[selectedNode.id] || {} : null

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-white/[0.06] flex-shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 border border-cyan-400/30 flex items-center justify-center shrink-0">
            <NetworkIcon className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-bold text-white truncate leading-tight">Dependency Intelligence</h2>
            <p className="text-[10px] text-slate-500 truncate">Command Center \u00B7 {nodes.length} services \u00B7 {edges.length} dependencies</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setBlastMode(!blastMode)}
            className={`rounded-lg border px-2.5 py-1.5 text-[10px] font-semibold transition-all flex items-center gap-1.5 ${
              blastMode
                ? 'border-cyan-400/40 bg-cyan-400/10 text-cyan-300'
                : 'border-white/[0.06] text-slate-500 hover:border-white/[0.12]'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Blast Radius</span>
          </button>
          <button
            onClick={() => setPresentMode(!presentMode)}
            className={`rounded-lg border px-2.5 py-1.5 text-[10px] font-semibold transition-all flex items-center gap-1.5 ${
              presentMode
                ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300'
                : 'border-white/[0.06] text-slate-500 hover:border-white/[0.12]'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
            </svg>
            <span>{presentMode ? 'Boardroom' : 'Standard'}</span>
          </button>
          {reactFlowInstance && (
            <button
              onClick={() => reactFlowInstance.fitView({ padding: 0.06 })}
              className="rounded-lg border border-white/[0.06] p-2 text-slate-500 hover:border-white/[0.12] hover:text-slate-400 transition-all"
              title="Fit view"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 px-4 py-2 border-b border-white/[0.04] flex-shrink-0">
        <SearchFilterBar search={search} setSearch={setSearch} activeFilter={activeFilter} setActiveFilter={setActiveFilter} drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />
        <div className="hidden md:flex items-center gap-3 ml-auto">
          <div className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-1.5">
            <span className="flex items-center gap-1.5 text-xs text-slate-400"><span className="w-2 h-2 rounded-full bg-red-500" /><span className="font-bold text-white">{highCount}</span> Critical</span>
            <span className="w-px h-4 bg-white/[0.06]" />
            <span className="flex items-center gap-1.5 text-xs text-slate-400"><span className="w-2 h-2 rounded-full bg-amber-500" /><span className="font-bold text-white">{mediumCount}</span> Watch</span>
            <span className="w-px h-4 bg-white/[0.06]" />
            <span className="flex items-center gap-1.5 text-xs text-slate-400"><span className="w-2 h-2 rounded-full bg-emerald-500" /><span className="font-bold text-white">{lowCount}</span> Healthy</span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 min-h-0 relative">
        <div className="flex-1 min-w-0 relative" ref={graphRef}>
          <ReactFlow
            nodes={displayNodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            className="bg-slate-950"
            minZoom={0.1}
            maxZoom={4}
            fitView={false}
            defaultEdgeOptions={{ animated: false }}
          >
            <Background color="#1e293b" gap={20} size={1} />
            <Controls className="bg-slate-900 border border-white/[0.06] rounded-lg [&>button]:border-white/[0.06] [&>button]:text-slate-400 [&>button]:hover:bg-white/[0.04]" />
            <MiniMap
              nodeColor={(n) => riskColors[n.data?.risk]?.border || '#475569'}
              maskColor="rgba(15,23,42,0.9)"
              className="border border-white/[0.06] rounded-lg"
              style={{ backgroundColor: '#0f172a' }}
            />
          </ReactFlow>
          {search && filteredNodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm">
              <div className="text-center">
                <svg className="w-8 h-8 text-slate-700 mx-auto mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <p className="text-sm text-slate-500">No nodes matching "<span className="text-slate-300 font-semibold">{search}</span>"</p>
              </div>
            </div>
          )}
        </div>

        <aside className="hidden lg:block border-l border-white/[0.06] bg-slate-950/95 overflow-y-auto flex-shrink-0 w-[340px]"
          style={{ maxHeight: '100%' }}
        >
          <div className="p-4 space-y-4 min-w-[340px]">
            {selectedNode && selectedDetail ? (
              <div className="rounded-xl border border-cyan-400/20 bg-gradient-to-br from-cyan-400/[0.04] to-transparent p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-white">{selectedNode.data.label}</h3>
                  <button onClick={() => setSelectedNode(null)} className="text-slate-600 hover:text-slate-400">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p className="text-sm text-slate-400 mb-3">{selectedDetail.description || ''}</p>
                <div className="flex gap-2 mb-3">
                  <span className={`rounded-lg border px-3 py-1 text-xs font-bold ${riskColors[selectedNode.data.risk]?.badge || riskColors.low.badge}`}>
                    {selectedNode.data.risk.toUpperCase()}
                  </span>
                  <span className="rounded-lg border border-white/[0.06] bg-white/[0.04] px-3 py-1 text-xs text-slate-300">{selectedNode.data.type}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {[
                    { label: 'Uptime', value: `${selectedDetail.uptime ?? '-'}%`, color: (selectedDetail.uptime ?? 0) >= 99.9 ? 'text-emerald-400' : 'text-amber-400' },
                    { label: 'Response', value: selectedDetail.responseTime || '-', color: 'text-cyan-400' },
                    { label: 'Error Rate', value: selectedDetail.errorRate != null ? `${selectedDetail.errorRate}%` : '-', color: (selectedDetail.errorRate ?? 0) < 0.5 ? 'text-emerald-400' : 'text-red-400' },
                    { label: 'Incidents', value: selectedDetail.incidents != null ? String(selectedDetail.incidents) : '-', color: (selectedDetail.incidents ?? 0) === 0 ? 'text-emerald-400' : 'text-amber-400' },
                  ].map(s => (
                    <div key={s.label} className="rounded-lg border border-white/[0.08] bg-white/[0.04] p-2.5">
                      <div className="text-[10px] text-slate-500 mb-0.5">{s.label}</div>
                      <div className={`text-sm font-bold ${s.color}`}>{s.value}</div>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl border border-cyan-400/15 bg-cyan-400/5 p-3">
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                    <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                    </svg>
                    <span className="font-semibold text-cyan-300">AI Recommendation</span>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {selectedNode.data.risk === 'high'
                      ? 'Critical service requiring immediate circuit breakers and redundancy. Deploy multi-region failover.'
                      : selectedNode.data.risk === 'medium'
                      ? 'Moderate risk. Monitor latency and error budgets. Consider auto-scaling.'
                      : 'Low risk. Standard monitoring sufficient.'}
                  </p>
                </div>
              </div>
            ) : null}

            <div>
              <h4 className="text-sm font-bold text-slate-300 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
                Executive KPIs
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Total Services', value: nodes.length, icon: '\u2699' },
                  { label: 'Dependencies', value: edges.length, icon: '\u2194' },
                  { label: 'Teams', value: uniqueTeams.length, icon: '\u2603' },
                  { label: 'At Risk', value: highCount, color: 'text-red-400', icon: '\u26A0' },
                ].map(s => (
                  <div key={s.label} className="rounded-xl border border-white/[0.06] bg-gradient-to-br from-white/[0.03] to-transparent p-3">
                    <div className="text-2xl font-bold text-white mb-0.5">{s.value}</div>
                    <div className="text-xs text-slate-500">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-300 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.25a8.681 8.681 0 01-.839-3.5m.839 3.5c0 4.463 3.626 8.02 8.08 8.02 3.793 0 6.975-2.62 7.823-6.153m-7.823 6.153a7.25 7.25 0 003.16-1.442m-3.16 1.442L12 20.25m0 0l-2.25-2.25M12 20.25l2.25-2.25" />
                </svg>
                Critical Dependencies
              </h4>
              <div className="space-y-1.5 max-h-[220px] overflow-y-auto">
                {dependencies.filter(d => d.risk === 'high').slice(0, 5).map(d => {
                  const src = initialNodes.find(n => n.id === d.source)?.data.label || d.source
                  const tgt = initialNodes.find(n => n.id === d.target)?.data.label || d.target
                  return (
                    <div key={d.id} className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/[0.03] px-3 py-2">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
                      <span className="text-sm text-slate-200 min-w-0 truncate flex-1">{src} \u2192 {tgt}</span>
                      <span className="text-xs font-mono text-red-400 shrink-0">{d.propagation}%</span>
                    </div>
                  )
                })}
                {(dependencies.filter(d => d.risk === 'high').length === 0) && (
                  <p className="text-xs text-slate-600 italic">No critical dependencies detected</p>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-300 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                </svg>
                AI Intelligence
              </h4>
              <div className="space-y-1.5 max-h-[200px] overflow-y-auto">
                {allInsights.slice(0, 4).map(inx => (
                  <div key={inx.id} className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        inx.priority === 'critical' ? 'bg-red-500/15 text-red-400 border border-red-500/20' :
                        inx.priority === 'high' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20' :
                        inx.priority === 'medium' ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/20' :
                        'bg-white/[0.06] text-slate-400 border border-white/[0.06]'
                      }`}>{inx.priority}</span>
                      <span className="text-[10px] text-slate-600">{inx.category}</span>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed">{inx.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-300 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
                Engineering Teams
              </h4>
              <div className="space-y-1.5">
                {teams.map(t => (
                  <div key={t.id} className="flex items-center justify-between rounded-lg border border-white/[0.04] bg-white/[0.02] px-3 py-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold" style={{ backgroundColor: `${t.color}22`, border: `1px solid ${t.color}44`, color: t.color }}>{t.name.slice(0, 2)}</div>
                      <span className="text-sm text-slate-200 truncate">{t.name}</span>
                    </div>
                    <span className="text-xs text-slate-500">{t.members} engineers</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {drawerOpen && (
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="lg:hidden fixed inset-x-0 bottom-0 z-50 max-h-[60vh] rounded-t-xl border border-white/[0.06] bg-slate-950/95 backdrop-blur-2xl overflow-y-auto"
          >
            <div className="sticky top-0 bg-slate-950/95 backdrop-blur-sm flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
              <span className="text-sm font-bold text-slate-300">Executive Intelligence</span>
              <button onClick={() => setDrawerOpen(false)} className="text-slate-600 hover:text-slate-400"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
            <div className="p-4 space-y-4">
              {selectedNode && selectedDetail && (
                <div className="rounded-xl border border-cyan-400/20 bg-gradient-to-br from-cyan-400/[0.04] to-transparent p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-white">{selectedNode.data.label}</span>
                    <span className={`rounded-lg border px-2 py-0.5 text-[10px] font-bold ${riskColors[selectedNode.data.risk]?.badge}`}>{selectedNode.data.risk}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <div className="text-center"><div className="text-sm font-bold text-white">{selectedDetail.uptime ?? '-'}%</div><div className="text-[9px] text-slate-600">Uptime</div></div>
                    <div className="text-center"><div className="text-sm font-bold text-cyan-400">{selectedDetail.responseTime || '-'}</div><div className="text-[9px] text-slate-600">Resp</div></div>
                    <div className="text-center"><div className="text-sm font-bold" style={{ color: (selectedDetail.errorRate ?? 0) < 0.5 ? '#22c55e' : '#ef4444' }}>{selectedDetail.errorRate ?? '-'}%</div><div className="text-[9px] text-slate-600">Err</div></div>
                    <div className="text-center"><div className="text-sm font-bold text-white">{selectedDetail.incidents ?? '-'}</div><div className="text-[9px] text-slate-600">Inc</div></div>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: 'Services', value: nodes.length },
                  { label: 'Deps', value: edges.length },
                  { label: 'Teams', value: uniqueTeams.length },
                  { label: 'High Risk', value: highCount },
                ].map(s => (
                  <div key={s.label} className="rounded-lg border border-white/[0.06] bg-white/[0.03] p-2 text-center"><div className="text-base font-bold text-white">{s.value}</div><div className="text-[10px] text-slate-600">{s.label}</div></div>
                ))}
              </div>
              <div><h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Critical Dependencies</h4><div className="space-y-1.5">{dependencies.filter(d => d.risk === 'high').slice(0, 5).map(d => { const src = initialNodes.find(n => n.id === d.source)?.data.label || d.source; const tgt = initialNodes.find(n => n.id === d.target)?.data.label || d.target; return <div key={d.id} className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/[0.03] px-3 py-2"><span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" /><span className="text-sm text-slate-200 flex-1 truncate">{src} → {tgt}</span></div> })}</div></div>
              <div><h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">AI Insights</h4><div className="space-y-1.5">{allInsights.slice(0, 3).map(inx => <div key={inx.id} className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-3"><p className="text-sm text-slate-300 leading-relaxed">{inx.text}</p></div>)}</div></div>
            </div>
          </motion.aside>
        )}
      </div>

      <div className="border-t border-white/[0.06] bg-slate-950 flex-shrink-0">
        <div className="flex flex-col sm:flex-row">
          <div className="flex-1 border-b sm:border-b-0 sm:border-r border-white/[0.04] p-3">
            <div className="flex items-center gap-2 mb-2">
              <BoltIcon className="w-5 h-5 text-red-400" />
              <h4 className="text-sm font-bold text-slate-300">Blast Radius & Propagation</h4>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {propagationPaths.slice(0, 4).map(p => {
                const src = initialNodes.find(n => n.id === p.from)?.data.label || p.from
                const tgt = initialNodes.find(n => n.id === p.to)?.data.label || p.to
                return (
                  <div key={p.label} className="shrink-0 rounded-lg border border-white/[0.06] bg-white/[0.03] p-2.5 min-w-[170px]">
                    <div className="flex items-center gap-1.5 text-xs text-slate-200 mb-1.5">
                      <span className="truncate font-medium">{src}</span>
                      <svg className="w-3 h-3 text-slate-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                      <span className="truncate font-medium">{tgt}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 rounded-full bg-white/[0.06] overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${p.risk}%`, backgroundColor: p.risk > 70 ? '#ef4444' : p.risk > 30 ? '#f59e0b' : '#22c55e' }} />
                      </div>
                      <span className={`text-xs font-bold ${p.risk > 70 ? 'text-red-400' : p.risk > 30 ? 'text-amber-400' : 'text-emerald-400'}`}>{p.risk}%</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="flex-shrink-0 p-3 min-w-[260px]">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>
              <h4 className="text-sm font-bold text-slate-300">Dependency Statistics</h4>
            </div>
            <div className="flex gap-3">
              <div className="flex-1 rounded-lg border border-white/[0.06] bg-white/[0.03] p-2 text-center"><div className="text-lg font-bold text-white">{dependencies.length}</div><div className="text-xs text-slate-500">Total Deps</div></div>
              <div className="flex-1 rounded-lg border border-red-500/20 bg-red-500/[0.04] p-2 text-center"><div className="text-lg font-bold text-red-400">{dependencies.filter(d => d.risk === 'high').length}</div><div className="text-xs text-slate-500">Critical</div></div>
              <div className="flex-1 rounded-lg border border-emerald-500/20 bg-emerald-500/[0.04] p-2 text-center"><div className="text-lg font-bold text-emerald-400">{dependencies.filter(d => d.status === 'healthy').length}</div><div className="text-xs text-slate-500">Healthy</div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function AnimatedEdge({ id, source, target, style, markerEnd, data }) {
  const edgePath = `M0,0 L100,0`
  const isHighRisk = style?.stroke === '#ef4444'

  return (
    <>
      {isHighRisk && (
        <motion.path
          d={edgePath}
          stroke="rgba(239,68,68,0.15)"
          strokeWidth="6"
          fill="none"
          animate={{ strokeOpacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
      <path
        id={id}
        d={edgePath}
        style={{
          ...style,
          stroke: isHighRisk ? '#ef4444' : style?.stroke || '#475569',
          strokeWidth: isHighRisk ? 2.5 : style?.strokeWidth || 1.5,
        }}
        className="react-flow__edge-path"
        markerEnd={markerEnd}
      />
      {isHighRisk && (
        <motion.path
          d={edgePath}
          stroke="#ef4444"
          strokeWidth={1}
          fill="none"
          strokeDasharray="4 4"
          animate={{ strokeDashoffset: [0, -8] }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="react-flow__edge-path"
        />
      )}
    </>
  )
}

const edgeTypes = { animated: AnimatedEdge }

export default function KnowledgeGraph() {
  return (
    <Layout>
      <div className="px-2 sm:px-3 pt-2 space-y-2">
        <PageHero
          title="Digital Twin — Service Dependency Map"
          subtitle="Live interactive model of your entire infrastructure topology showing real-time risk propagation, blast radius, and dependency health across all 47 services."
          impact="$340K"
          impactLabel="Blast Radius Exposure"
          confidence={92}
        />
        <ExecutiveBanner currentPage="/knowledge-graph" />
      </div>
      <div className="overflow-x-hidden">
        <div className="-m-4 sm:-m-6 lg:-m-8" style={{ height: 'calc(100vh - 3.5rem)', width: '100vw' }}>
          <div className="flex flex-col h-full">
            <ReactFlowProvider>
              <GraphInside />
            </ReactFlowProvider>
          </div>
        </div>
      </div>

      {/* === RISK HEAT MAP === */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 mt-4">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/20">
            <svg className="h-5 w-5 text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-white">Real-Time Risk Heat Map</h2>
          <div className="flex-1" />
          <span className="rounded-full bg-red-500/15 text-red-400 border border-red-500/25 px-3 py-1 text-xs font-mono font-bold">3 CRITICAL</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { service: 'Payment Gateway', risk: 92, impact: '$2.1M', status: 'Degraded', color: 'from-red-500/20 to-red-500/5 border-red-500/30' },
            { service: 'Billing Service', risk: 85, impact: '$890K', status: 'At Risk', color: 'from-orange-500/20 to-orange-500/5 border-orange-500/30' },
            { service: 'Auth Service', risk: 78, impact: '$420K', status: 'Warning', color: 'from-amber-500/20 to-amber-500/5 border-amber-500/30' },
            { service: 'User Dashboard', risk: 45, impact: '$120K', status: 'Stable', color: 'from-emerald-500/12 to-emerald-500/5 border-emerald-500/20' },
            { service: 'Notification Bus', risk: 32, impact: '$60K', status: 'Healthy', color: 'from-emerald-500/12 to-emerald-500/5 border-emerald-500/20' },
            { service: 'Analytics Engine', risk: 28, impact: '$40K', status: 'Healthy', color: 'from-emerald-500/12 to-emerald-500/5 border-emerald-500/20' },
          ].map((s) => (
            <div key={s.service} className={`rounded-xl border bg-gradient-to-br ${s.color} p-4 relative overflow-hidden group cursor-pointer hover:scale-[1.03] transition-transform`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-white">{s.service}</span>
                <span className={`text-xs font-mono font-bold px-2 py-1 rounded-lg ${
                  s.status === 'Degraded' ? 'bg-red-500/20 text-red-400 border border-red-500/20' : 
                  s.status === 'At Risk' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/20' :
                  s.status === 'Warning' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/20' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'
                }`}>{s.status}</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Risk Score</span>
                  <span className={`font-mono font-bold ${
                    s.risk >= 80 ? 'text-red-400' : s.risk >= 60 ? 'text-amber-400' : 'text-emerald-400'
                  }`}>{s.risk}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${
                    s.risk >= 80 ? 'bg-red-500' : s.risk >= 60 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`} style={{width: `${s.risk}%`}} />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Revenue at Risk</span>
                  <span className="text-red-300 font-mono font-bold">{s.impact}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* === BLAST RADIUS SIMULATION === */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 mt-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500/20 to-rose-500/20 border border-red-500/20">
            <svg className="h-5 w-5 text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-white">Blast Radius Simulation</h2>
          <span className="rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/25 px-3 py-1 text-xs font-mono font-bold">SIMULATION</span>
        </div>
        <p className="text-sm text-slate-400 mb-4">If Payment Gateway fails, the following services would be impacted within 90 seconds:</p>
        <div className="grid gap-2">
          {[
            { service: 'Payment Gateway', level: 0, impact: 'Failed', time: 'T+0s', services: 0 },
            { service: 'Billing Service', level: 1, impact: 'Degraded', time: 'T+12s', services: 3 },
            { service: 'Invoice Engine', level: 1, impact: 'Degraded', time: 'T+14s', services: 2 },
            { service: 'Notification Bus', level: 2, impact: 'Warning', time: 'T+45s', services: 5 },
            { service: 'User Dashboard', level: 3, impact: 'Reduced', time: 'T+72s', services: 1 },
            { service: 'Analytics Engine', level: 3, impact: 'Reduced', time: 'T+90s', services: 1 },
          ].map((s, i) => (
            <div key={s.service} className={`flex items-center gap-3 rounded-xl border ${
              s.impact === 'Failed' ? 'border-red-500/30 bg-red-500/[0.05]' : 
              s.impact === 'Degraded' ? 'border-orange-500/25 bg-orange-500/[0.04]' :
              s.impact === 'Warning' ? 'border-amber-500/20 bg-amber-500/[0.03]' : 'border-white/[0.06] bg-white/[0.02]'
            } p-3`}>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-xs font-mono text-slate-400 font-bold border border-white/[0.06]">{i + 1}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold text-white">{s.service}</span>
                  <span className={`text-xs font-mono px-2 py-0.5 rounded ${
                    s.impact === 'Failed' ? 'bg-red-500/20 text-red-400' :
                    s.impact === 'Degraded' ? 'bg-orange-500/20 text-orange-400' :
                    s.impact === 'Warning' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-500/20 text-slate-300'
                  }`}>{s.impact}</span>
                </div>
                <div className="flex gap-4 text-xs text-slate-500">
                  <span>Cascade Level {s.level}</span>
                  <span>{s.time}</span>
                  <span>{s.services} downstream services</span>
                </div>
              </div>
              <div className="h-3 w-28 rounded-full bg-white/[0.06] overflow-hidden">
                <div className={`h-full rounded-full transition-all ${
                  s.level === 0 ? 'bg-red-500 w-full' : 
                  s.level === 1 ? 'bg-orange-500 w-3/4' :
                  s.level === 2 ? 'bg-amber-500 w-1/2' : 'bg-slate-500 w-1/4'
                }`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-2 sm:px-4 pb-2">
        <NarrativeCTA currentPage="/knowledge-graph" confidence={92} impact="$340K blast radius exposure" />
      </div>
    </Layout>
  )
}
