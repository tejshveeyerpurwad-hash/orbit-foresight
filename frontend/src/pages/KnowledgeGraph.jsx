import { useCallback, useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ReactFlow, { Background, Controls, MiniMap, useNodesState, useEdgesState, MarkerType } from 'reactflow'
import 'reactflow/dist/style.css'
import Layout from '../components/Layout'

const initialNodes = [
  { id: 'gateway', position: { x: 400, y: 0 }, data: { label: 'API Gateway', type: 'API', risk: 'medium', team: 'Platform', deps: ['Payments', 'Auth', 'Billing'] } },
  { id: 'auth', position: { x: 100, y: 150 }, data: { label: 'Auth Service', type: 'Service', risk: 'low', team: 'Security', deps: [] } },
  { id: 'payments', position: { x: 350, y: 150 }, data: { label: 'Payment Service', type: 'Service', risk: 'high', team: 'Payments', deps: ['Auth', 'Database'] } },
  { id: 'billing', position: { x: 600, y: 150 }, data: { label: 'Billing Service', type: 'Service', risk: 'medium', team: 'Billing', deps: ['Auth', 'Cache'] } },
  { id: 'notifications', position: { x: 0, y: 320 }, data: { label: 'Notification Service', type: 'Service', risk: 'low', team: 'Platform', deps: ['Auth'] } },
  { id: 'webhooks', position: { x: 200, y: 320 }, data: { label: 'Webhook Service', type: 'Service', risk: 'medium', team: 'Platform', deps: ['Payments'] } },
  { id: 'cache', position: { x: 500, y: 320 }, data: { label: 'Redis Cache', type: 'Database', risk: 'low', team: 'Infra', deps: [] } },
  { id: 'db', position: { x: 700, y: 320 }, data: { label: 'PostgreSQL', type: 'Database', risk: 'low', team: 'Infra', deps: [] } },
  { id: 'ci-pipeline', position: { x: 350, y: 470 }, data: { label: 'CI Pipeline', type: 'Pipeline', risk: 'low', team: 'DevOps', deps: ['Gateway'] } },
  { id: 'cd-pipeline', position: { x: 550, y: 470 }, data: { label: 'CD Pipeline', type: 'Pipeline', risk: 'low', team: 'DevOps', deps: ['CI Pipeline'] } },
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

const insights = [
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

function HubIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
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

const typeIcons = {
  Service: '⚙️',
  API: '🔌',
  Database: '🗄️',
  Pipeline: '🔄',
}

const insightIconMap = {
  hub: HubIcon,
  vulnerability: ShieldIcon,
  blast: BoltIcon,
  pipeline: ArrowPath,
  cascade: ExclamationCircle,
  optimization: ArrowPath,
}

function CustomNode({ data }) {
  const c = riskColors[data.risk] || riskColors.low
  return (
    <motion.div
      whileHover={{ scale: 1.08 }}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      className="rounded-xl border-2 px-4 py-3 text-center shadow-lg backdrop-blur-xl min-w-[130px] cursor-pointer relative overflow-hidden group"
      style={{ backgroundColor: c.bg, borderColor: c.border, boxShadow: c.glow }}
      title={`${data.label} (${data.risk} risk) - Team: ${data.team}`}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />
      <div className="text-xs mb-1 relative">{typeIcons[data.type] || '📦'}</div>
      <div className="relative">
        <div className="text-xs font-semibold" style={{ color: c.text }}>{data.label}</div>
        <div className="text-[8px] text-slate-500 mt-0.5">{data.type} · {data.team}</div>
      </div>
      {data.risk === 'high' && (
        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
      )}
    </motion.div>
  )
}

const nodeTypes = { custom: CustomNode }

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } }
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }

const filters = [
  { key: 'all', label: 'All' },
  { key: 'high', label: 'High Risk' },
  { key: 'medium', label: 'Medium Risk' },
  { key: 'low', label: 'Low Risk' },
  { key: 'Service', label: 'Services' },
  { key: 'Database', label: 'Databases' },
  { key: 'Pipeline', label: 'Pipelines' },
]

function SearchFilterBar({ search, setSearch, activeFilter, setActiveFilter }) {
  return (
    <motion.div variants={item} className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
      <div className="relative flex-1 w-full sm:max-w-xs">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search nodes by name, team, or type..."
          className="w-full rounded-lg border border-white/[0.06] bg-white/[0.03] py-2 pl-9 pr-3 text-xs text-slate-300 placeholder-slate-600 outline-none focus:border-cyan-500/40 focus:bg-white/[0.06] transition-all"
        />
      </div>
      <div className="flex flex-wrap gap-1.5">
        {filters.map(f => {
          const active = activeFilter === f.key
          return (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`rounded-lg border px-2.5 py-1 text-[10px] font-medium transition-all ${
                active
                  ? 'border-cyan-400/40 bg-cyan-400/10 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                  : 'border-white/[0.06] text-slate-500 hover:border-white/[0.12] hover:text-slate-400'
              }`}
            >
              {f.label}
            </button>
          )
        })}
      </div>
    </motion.div>
  )
}

function DetailPanel({ selectedNode, onClose, onBlastToggle, blastMode }) {
  if (!selectedNode) return null
  const { id, data } = selectedNode
  const detail = serviceDetails[id] || {}
  const c = riskColors[data.risk] || riskColors.low
  const connectedEdges = dependencies.filter(d => d.source === id || d.target === id)
  const connectedServiceIds = new Set()
  connectedEdges.forEach(e => { connectedServiceIds.add(e.source); connectedServiceIds.add(e.target) })
  connectedServiceIds.delete(id)
  const connectedServices = Array.from(connectedServiceIds).map(nid => {
    const node = initialNodes.find(n => n.id === nid)
    return node ? node.data.label : nid
  })

  return (
    <motion.div
      initial={{ opacity: 0, x: 40, height: 0 }}
      animate={{ opacity: 1, x: 0, height: 'auto' }}
      exit={{ opacity: 0, x: 40, height: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      className="rounded-xl border border-white/[0.08] bg-slate-900/70 backdrop-blur-xl overflow-hidden"
    >
      <div className="p-5 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg" style={{ backgroundColor: c.bg, border: `1px solid ${c.border}` }}>
              {typeIcons[data.type] || '📦'}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">{data.label}</h3>
              <p className="text-[10px] text-slate-500">{detail.description || `${data.type} service managed by ${data.team}`}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onBlastToggle}
              className={`rounded-lg border px-2.5 py-1 text-[10px] font-medium transition-all ${
                blastMode
                  ? 'border-cyan-400/40 bg-cyan-400/10 text-cyan-300'
                  : 'border-white/[0.06] text-slate-500 hover:border-white/[0.12]'
              }`}
            >
              {blastMode ? 'Blast On' : 'Blast Radius'}
            </button>
            <button
              onClick={onClose}
              className="rounded-lg border border-white/[0.06] p-1 text-slate-500 hover:border-white/[0.12] hover:text-slate-400 transition-all"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold ${c.badge}`}>{data.risk.toUpperCase()} RISK</span>
          <span className="rounded-md border border-white/[0.06] bg-white/[0.04] px-2 py-0.5 text-[10px] text-slate-400">{data.type}</span>
          <span className="rounded-md border border-white/[0.06] bg-white/[0.04] px-2 py-0.5 text-[10px] text-slate-400">Team: {data.team}</span>
          <span className="rounded-md border border-white/[0.06] bg-white/[0.04] px-2 py-0.5 text-[10px] text-slate-400">ID: {id}</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Uptime', value: `${detail.uptime || '-'}%`, color: (detail.uptime || 0) >= 99.9 ? 'text-emerald-400' : (detail.uptime || 0) >= 99 ? 'text-amber-400' : 'text-red-400' },
            { label: 'Response Time', value: detail.responseTime || '-', color: 'text-cyan-400' },
            { label: 'Error Rate', value: detail.errorRate != null ? `${detail.errorRate}%` : '-', color: (detail.errorRate || 0) < 0.5 ? 'text-emerald-400' : (detail.errorRate || 0) < 1 ? 'text-amber-400' : 'text-red-400' },
            { label: 'Incidents (30d)', value: detail.incidents != null ? String(detail.incidents) : '-', color: (detail.incidents || 0) === 0 ? 'text-emerald-400' : (detail.incidents || 0) < 5 ? 'text-amber-400' : 'text-red-400' },
          ].map(s => (
            <div key={s.label} className="rounded-lg border border-white/[0.06] bg-white/[0.03] p-2.5">
              <div className="text-[9px] text-slate-600 mb-0.5">{s.label}</div>
              <div className={`text-sm font-bold ${s.color}`}>{s.value}</div>
            </div>
          ))}
        </div>

        {connectedServices.length > 0 && (
          <div>
            <div className="text-[10px] font-medium text-slate-500 mb-2">Connected Services ({connectedServices.length})</div>
            <div className="flex flex-wrap gap-1.5">
              {connectedServices.map(s => (
                <span key={s} className="rounded-md border border-white/[0.06] bg-white/[0.04] px-2 py-0.5 text-[10px] text-slate-400">{s}</span>
              ))}
            </div>
          </div>
        )}

        {data.deps?.length > 0 && (
          <div>
            <div className="text-[10px] font-medium text-slate-500 mb-2">Dependencies</div>
            <div className="flex flex-wrap gap-1.5">
              {data.deps.map((d, i) => (
                <span key={d} className="flex items-center gap-1">
                  <span className="rounded-md border border-white/[0.06] bg-white/[0.04] px-2 py-0.5 text-[10px] text-slate-400">{d}</span>
                  {i < data.deps.length - 1 && <span className="text-slate-700 text-[10px]">→</span>}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="rounded-lg border border-cyan-400/15 bg-cyan-400/5 p-3">
          <div className="flex items-start gap-2">
            <ShieldIcon className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
            <div>
              <div className="text-[10px] font-semibold text-cyan-300 mb-0.5">AI Risk Assessment</div>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                {data.risk === 'high'
                  ? `Critical service with elevated risk. Direct failure impact on ${connectedServices.length} downstream services. Recommended: implement circuit breakers and redundancy.`
                  : data.risk === 'medium'
                  ? `Moderate risk profile. Service has ${connectedServices.length} connections. Monitor latency trends and error budgets.`
                  : `Low risk service with stable metrics. ${connectedServices.length > 0 ? `Connected to ${connectedServices.length} services.` : 'No downstream dependencies — consider if this service is still needed.'}`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function DependencyCards({ depSearch, setDepSearch }) {
  const filteredDeps = useMemo(() => {
    if (!depSearch) return dependencies
    const q = depSearch.toLowerCase()
    return dependencies.filter(d => {
      const src = initialNodes.find(n => n.id === d.source)?.data.label || d.source
      const tgt = initialNodes.find(n => n.id === d.target)?.data.label || d.target
      return src.toLowerCase().includes(q) || tgt.toLowerCase().includes(q) || d.type.toLowerCase().includes(q) || d.status.toLowerCase().includes(q) || d.risk.toLowerCase().includes(q)
    })
  }, [depSearch])

  return (
    <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <NetworkIcon className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-white">Dependency Explorer</h3>
          <span className="rounded-md bg-white/[0.04] px-1.5 py-0.5 text-[9px] text-slate-500">{dependencies.length} dependencies</span>
        </div>
        <input
          value={depSearch}
          onChange={e => setDepSearch(e.target.value)}
          placeholder="Filter dependencies..."
          className="w-44 rounded-lg border border-white/[0.06] bg-white/[0.03] py-1.5 pl-2.5 pr-2.5 text-[10px] text-slate-300 placeholder-slate-600 outline-none focus:border-cyan-500/30 focus:bg-white/[0.06] transition-all"
        />
      </div>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredDeps.map(d => {
          const srcLabel = initialNodes.find(n => n.id === d.source)?.data.label || d.source
          const tgtLabel = initialNodes.find(n => n.id === d.target)?.data.label || d.target
          const rc = riskColors[d.risk] || riskColors.low
          return (
            <motion.div
              key={d.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-lg border border-white/[0.06] bg-white/[0.03] p-3 hover:border-white/[0.12] hover:bg-white/[0.05] transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-xs text-slate-300">
                  <span className="font-medium text-white">{srcLabel}</span>
                  <svg className="w-3 h-3 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                  <span className="font-medium text-white">{tgtLabel}</span>
                </div>
                <span className={`rounded px-1.5 py-0.5 text-[8px] font-semibold ${rc.badge}`}>{d.risk}</span>
              </div>
              <div className="flex items-center gap-3 text-[9px] text-slate-500">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusDots[d.status] }} />
                  {d.status}
                </span>
                <span>{d.type}</span>
                <span>{d.latency}</span>
              </div>
              <div className="mt-2 pt-2 border-t border-white/[0.04] flex items-center justify-between text-[9px]">
                <span className="text-slate-600">Failure propagation</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-16 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${d.propagation}%`,
                        backgroundColor: d.propagation > 70 ? '#ef4444' : d.propagation > 30 ? '#f59e0b' : '#22c55e'
                      }}
                    />
                  </div>
                  <span className={`font-semibold ${d.propagation > 70 ? 'text-red-400' : d.propagation > 30 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {d.propagation}%
                  </span>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
      {filteredDeps.length === 0 && (
        <div className="text-center py-8">
          <p className="text-xs text-slate-600">No dependencies matching "<span className="text-slate-400">{depSearch}</span>"</p>
        </div>
      )}
    </motion.div>
  )
}

function TeamCards() {
  return (
    <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-4">
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
        <h3 className="text-sm font-semibold text-white">Ownership Mapping</h3>
        <span className="rounded-md bg-white/[0.04] px-1.5 py-0.5 text-[9px] text-slate-500">{teams.length} teams</span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {teams.map(team => (
          <motion.div
            key={team.id}
            whileHover={{ y: -2 }}
            className="rounded-lg border border-white/[0.06] bg-white/[0.03] p-3 hover:border-white/[0.12] transition-all"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-md flex items-center justify-center text-[10px] font-bold text-white" style={{ backgroundColor: `${team.color}22`, border: `1px solid ${team.color}44` }}>
                {team.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="text-xs font-semibold text-white">{team.name}</div>
                <div className="text-[9px] text-slate-500">Lead: {team.lead}</div>
              </div>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-500 mb-2">
              <span>{team.services.length} service{team.services.length !== 1 ? 's' : ''}</span>
              <span>{team.members} member{team.members !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex flex-wrap gap-1 mb-2">
              {team.services.map(sid => {
                const svc = initialNodes.find(n => n.id === sid)
                return svc ? (
                  <span key={sid} className="rounded bg-white/[0.04] px-1.5 py-0.5 text-[8px] text-slate-400">{svc.data.label}</span>
                ) : null
              })}
            </div>
            <div className="pt-2 border-t border-white/[0.04]">
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-slate-600">Risk Exposure</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-16 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${team.risk}%`,
                        backgroundColor: team.risk > 65 ? '#ef4444' : team.risk > 35 ? '#f59e0b' : '#22c55e'
                      }}
                    />
                  </div>
                  <span className={`text-[10px] font-semibold ${team.risk > 65 ? 'text-red-400' : team.risk > 35 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {team.risk}%
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

function PropagationPaths() {
  const [selectedPath, setSelectedPath] = useState(null)

  return (
    <motion.div variants={item} className="rounded-xl border border-white/[0.08] bg-slate-900/60 p-4">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-4 h-4 text-red-400" />
        <h3 className="text-sm font-semibold text-white">Risk Propagation Analysis</h3>
        <span className="rounded-md bg-white/[0.04] px-1.5 py-0.5 text-[9px] text-slate-500">Payment Service failure simulation</span>
      </div>

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {propagationPaths.map((p, idx) => {
          const srcLabel = initialNodes.find(n => n.id === p.from)?.data.label || p.from
          const tgtLabel = initialNodes.find(n => n.id === p.to)?.data.label || p.to
          const stepLabels = p.steps.map(s => initialNodes.find(n => n.id === s)?.data.label || s)
          const isSelected = selectedPath === idx

          return (
            <motion.div
              key={p.label}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedPath(isSelected ? null : idx)}
              className={`rounded-lg border p-3 cursor-pointer transition-all ${
                isSelected
                  ? 'border-red-400/40 bg-red-500/5'
                  : 'border-white/[0.06] bg-white/[0.03] hover:border-white/[0.12]'
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs font-medium mb-2 flex-wrap">
                {stepLabels.map((label, si) => (
                  <span key={si} className="flex items-center gap-1">
                    <span className={`rounded px-1.5 py-0.5 ${
                      label.toLowerCase().includes('payment') ? 'bg-red-500/10 text-red-300' : 'bg-white/[0.04] text-slate-300'
                    }`}>{label}</span>
                    {si < stepLabels.length - 1 && (
                      <svg className="w-3 h-3 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    )}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-slate-600">Propagation risk</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-20 h-2 rounded-full bg-white/[0.06] overflow-hidden">
                    <div
                      className="h-full rounded-full animate-pulse transition-all"
                      style={{
                        width: `${p.risk}%`,
                        backgroundColor: p.risk > 70 ? '#ef4444' : p.risk > 30 ? '#f59e0b' : '#22c55e'
                      }}
                    />
                  </div>
                  <span className={`text-xs font-bold ${p.risk > 70 ? 'text-red-400' : p.risk > 30 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {p.risk}%
                  </span>
                </div>
              </div>
              {isSelected && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-2 pt-2 border-t border-red-400/20"
                >
                  <p className="text-[9px] text-slate-500 leading-relaxed">
                    Failure of <span className="text-red-300">{srcLabel}</span> propagates to <span className="text-red-300">{tgtLabel}</span> with <span className="text-red-400 font-semibold">{p.risk}%</span> probability.
                    {p.risk > 70 ? ' Critical cascading failure risk — immediate mitigation recommended.' : p.risk > 30 ? ' Moderate propagation risk — monitor closely.' : ' Low propagation risk — standard monitoring sufficient.'}
                  </p>
                </motion.div>
              )}
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

function InsightsSection() {
  return (
    <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-4">
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-4 h-4 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
        </svg>
        <h3 className="text-sm font-semibold text-white">AI-Powered Insights</h3>
        <span className="rounded-md bg-white/[0.04] px-1.5 py-0.5 text-[9px] text-slate-500">{insights.length} recommendations</span>
      </div>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {insights.map(inx => {
          const IconComp = insightIconMap[inx.icon] || ExclamationCircle
          const p = inx.priority
          const pColor = p === 'critical' ? 'text-red-400 border-red-500/30 bg-red-500/10'
            : p === 'high' ? 'text-amber-400 border-amber-500/30 bg-amber-500/10'
            : p === 'medium' ? 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10'
            : 'text-slate-400 border-white/[0.06] bg-white/[0.04]'
          const pLabel = p.charAt(0).toUpperCase() + p.slice(1)

          return (
            <motion.div
              key={inx.id}
              whileHover={{ y: -2, borderColor: 'rgba(6,182,212,0.3)' }}
              className="rounded-lg border border-white/[0.06] bg-white/[0.03] p-3 transition-all"
            >
              <div className="flex items-start gap-2.5">
                <div className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${
                  p === 'critical' ? 'bg-red-500/10 text-red-400'
                    : p === 'high' ? 'bg-amber-500/10 text-amber-400'
                    : p === 'medium' ? 'bg-cyan-500/10 text-cyan-400'
                    : 'bg-white/[0.04] text-slate-500'
                }`}>
                  <IconComp className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className={`rounded border px-1.5 py-0.5 text-[8px] font-semibold ${pColor}`}>{pLabel}</span>
                    <span className="text-[8px] text-slate-600">{inx.category}</span>
                  </div>
                  <p className="text-[10px] text-slate-300 leading-relaxed">{inx.text}</p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
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
          animate={{
            strokeOpacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
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
          animate={{
            strokeDashoffset: [0, -8],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="react-flow__edge-path"
        />
      )}
    </>
  )
}

const edgeTypes = { animated: AnimatedEdge }

export default function KnowledgeGraph() {
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
  const [depSearch, setDepSearch] = useState('')

  const onNodeClick = useCallback((_, node) => {
    setSelectedNode(node)
  }, [])

  const onPaneClick = useCallback(() => {
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

  return (
    <Layout>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 pb-8">
        <motion.div variants={item} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 border border-cyan-400/30 flex items-center justify-center">
              <NetworkIcon className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                Engineering Intelligence Graph
                <span className="rounded-md bg-cyan-400/10 border border-cyan-400/30 px-1.5 py-0.5 text-[8px] text-cyan-300 font-medium">v2.0</span>
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">Interactive Service Dependency & Risk Map • {nodes.length} services • {edges.length} dependencies</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setBlastMode(!blastMode)}
              className={`rounded-lg border px-3 py-1.5 text-[10px] font-medium transition-all flex items-center gap-1.5 ${
                blastMode
                  ? 'border-cyan-400/40 bg-cyan-400/10 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                  : 'border-white/[0.06] text-slate-500 hover:border-white/[0.12] hover:text-slate-400'
              }`}
            >
              <AlertTriangle className="w-3 h-3" />
              {blastMode ? 'Exit Blast Radius' : 'Blast Radius'}
            </button>
          </div>
        </motion.div>

        <motion.div variants={item} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {[
            { label: 'Services', value: nodes.length, color: 'text-cyan-400', detail: `${uniqueTeams.length} teams` },
            { label: 'Dependencies', value: edges.length, color: 'text-emerald-400', detail: `${dependencies.filter(d => d.risk === 'high').length} high risk` },
            { label: 'Teams', value: uniqueTeams.length, color: 'text-violet-400', detail: `${nodes.length} total services` },
            { label: 'High Risk', value: highCount, color: 'text-red-400', detail: `${((highCount / nodes.length) * 100).toFixed(0)}% of services` },
            { label: 'Medium Risk', value: mediumCount, color: 'text-amber-400', detail: `${((mediumCount / nodes.length) * 100).toFixed(0)}% of services` },
            { label: 'Low Risk', value: lowCount, color: 'text-emerald-400', detail: `${((lowCount / nodes.length) * 100).toFixed(0)}% of services` },
          ].map(s => (
            <div key={s.label} className="rounded-lg border border-white/[0.06] bg-white/[0.03] p-3">
              <div className="text-[9px] text-slate-600 mb-0.5">{s.label}</div>
              <div className={`text-lg font-bold ${s.color}`}>{s.value}</div>
              <div className="text-[8px] text-slate-600 mt-0.5">{s.detail}</div>
            </div>
          ))}
        </motion.div>

        <SearchFilterBar search={search} setSearch={setSearch} activeFilter={activeFilter} setActiveFilter={setActiveFilter} />

        <motion.div variants={item} className="relative h-[450px] md:h-[550px] rounded-xl border border-white/[0.06] overflow-hidden bg-slate-950">
          <ReactFlow
            nodes={displayNodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
            className="bg-slate-950"
            minZoom={0.3}
            maxZoom={2.5}
          >
            <Background color="#1e293b" gap={24} size={1} />
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
                <p className="text-xs text-slate-600">No nodes matching "<span className="text-slate-400">{search}</span>"</p>
                <p className="text-[9px] text-slate-700 mt-1">Try a different search term or clear filters</p>
              </div>
            </div>
          )}
        </motion.div>

        <AnimatePresence>
          {selectedNode && (
            <DetailPanel
              selectedNode={selectedNode}
              onClose={() => setSelectedNode(null)}
              onBlastToggle={() => setBlastMode(!blastMode)}
              blastMode={blastMode}
            />
          )}
        </AnimatePresence>

        <DependencyCards depSearch={depSearch} setDepSearch={setDepSearch} />

        <TeamCards />

        <PropagationPaths />

        <InsightsSection />
      </motion.div>
    </Layout>
  )
}
