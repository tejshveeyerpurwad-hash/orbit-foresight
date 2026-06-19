import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Layout from '../components/Layout'
import StatCard from '../components/StatCard'
import StatusBadge from '../components/StatusBadge'

const presets = ['Add payment retry support', 'Implement OAuth 2.0 SSO', 'Migrate database connection pool', 'Refactor billing module', 'Deploy microservices monitoring']

const investigationData = {
  summary: { totalFailures: 8, criticalFailures: 2, highFailures: 3, mediumFailures: 2, lowFailures: 1, mrsAnalyzed: 847, incidentsPrevented: 124 },
  failureModes: [
    { mode: 'Retry queue overflow causes cascading failure', severity: 'critical', probability: 'High', impact: 'All payment flows blocked', detection: 'Monitoring alert after 5 min', mitigation: 'Add bounded retry queues with backpressure' },
    { mode: 'Circuit breaker misconfiguration causes silent failures', severity: 'critical', probability: 'Medium', impact: 'Failed transactions without error logs', detection: 'Customer complaints after 30 min', mitigation: 'Add comprehensive integration tests with fault injection' },
    { mode: 'Billing reconciliation delay during rollout', severity: 'high', probability: 'Low', impact: '15K invoices delayed up to 3 hours', detection: 'Billing dashboard alert', mitigation: 'Feature flag with gradual rollout (10% → 50% → 100%)' },
    { mode: 'API gateway timeout regression', severity: 'high', probability: 'Medium', impact: 'Payment requests timeout under load', detection: 'APM latency spike alert', mitigation: 'Update timeout configs with load testing validation' },
    { mode: 'Database connection pool exhaustion', severity: 'high', probability: 'Low', impact: 'All services unable to connect to DB', detection: 'Connection pool monitoring alert', mitigation: 'Add connection pooling with max limit per service' },
    { mode: 'Webhook delivery failure on retry events', severity: 'medium', probability: 'Medium', impact: 'Merchants not notified of retry status', detection: 'Webhook delivery log audit', mitigation: 'Add idempotency keys and dead letter queue' },
    { mode: 'Memory leak in retry worker loop', severity: 'medium', probability: 'Low', impact: 'Worker pod OOM kill after 4 hours', detection: 'K8s pod restart count alert', mitigation: 'Add memory limits and leak detection tests' },
    { mode: 'Monitoring dashboard missing retry metrics', severity: 'low', probability: 'High', impact: 'Blind spot during incident response', detection: 'Manual discovery during incident', mitigation: 'Add retry-related metrics to operations dashboard' },
  ],
  mrs: [
    { id: 'MR #142', author: '@alice', date: 'May 12', desc: 'Failed integration tests due to missing retry config', outcome: 'Incident', match: 87, files: 12, risk: 'high' },
    { id: 'MR #198', author: '@bob', date: 'Jun 1', desc: 'Caused retry queue overflow in production', outcome: 'Incident', match: 92, files: 8, risk: 'critical' },
    { id: 'MR #211', author: '@carol', date: 'Jun 15', desc: 'Introduced N+1 query in billing report', outcome: 'Near Miss', match: 74, files: 5, risk: 'medium' },
    { id: 'MR #87', author: '@alice', date: 'Apr 20', desc: 'Payment timeout regression after refactor', outcome: 'Incident', match: 89, files: 15, risk: 'high' },
    { id: 'MR #305', author: '@dave', date: 'Jul 2', desc: 'Race condition in session invalidation handler', outcome: 'Incident', match: 91, files: 6, risk: 'critical' },
  ],
  incidents: [
    { title: 'Production outage — Payment pipeline down 45min', date: 'Jun 1', cause: 'Retry queue overflow without circuit breaker', impact: 'All payment flows blocked', duration: '45min', rootCause: 'Missing backpressure mechanism in payment worker', services: ['Payment Service', 'API Gateway'], severity: 'critical', lessons: 'Add circuit breaker pattern to all retry loops' },
    { title: 'Degraded billing processing — 3hr delay', date: 'May 15', cause: 'Billing worker OOM from unbounded retry loop', impact: '15K invoices delayed', duration: '3hr', rootCause: 'Unbounded retry queue exhausted heap memory', services: ['Billing Service'], severity: 'high', lessons: 'Bound retry counts and add memory limits to workers' },
    { title: 'Webhook delivery failure — partial data loss', date: 'Apr 28', cause: 'Missing idempotency keys caused duplicate webhook events', impact: '2% merchants affected', duration: '2hr', rootCause: 'No idempotency checking in webhook handler', services: ['Notification Service', 'Webhook Gateway'], severity: 'medium', lessons: 'Idempotency keys required for all webhook deliveries' },
  ],
  deps: [
    { service: 'Payment Service', deps: ['Auth Service', 'Database', 'Redis Cache'], risk: 87, critical: true },
    { service: 'Billing Service', deps: ['Auth Service', 'Cache', 'Payment Service'], risk: 65, critical: false },
    { service: 'Notification Service', deps: ['Auth Service'], risk: 45, critical: false },
    { service: 'API Gateway', deps: ['Payment Service', 'Auth Service', 'Billing Service'], risk: 72, critical: true },
  ],
  recommendations: [
    { action: 'Add circuit breaker pattern to all retry loops', priority: 'P0', impact: 'Prevents cascading failures', effort: '8 story points' },
    { action: 'Implement bounded retry queues with backpressure monitoring', priority: 'P0', impact: 'Prevents queue overflow incidents', effort: '5 story points' },
    { action: 'Add comprehensive integration tests with fault injection', priority: 'P1', impact: 'Catches misconfiguration before deploy', effort: '5 story points' },
    { action: 'Create deployment runbook with rollback procedures', priority: 'P1', impact: 'Reduces MTTR by 60%', effort: '3 story points' },
    { action: 'Add retry-related metrics to operations dashboard', priority: 'P2', impact: 'Improves incident detection time', effort: '2 story points' },
  ],
}

const severityColors = { critical: 'bg-red-500/20 text-red-400 border-red-500/30', high: 'bg-orange-500/15 text-orange-400 border-orange-500/20', medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/15', low: 'bg-green-500/10 text-green-400 border-green-500/15' }

const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } }
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }

export default function IntelligenceCenter() {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)
  const [expandedSection, setExpandedSection] = useState('failures')
  const [expandedIncident, setExpandedIncident] = useState(null)
  const [showPresets, setShowPresets] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState(-1)
  const inputRef = useRef(null)

  const filtered = input.trim() ? presets.filter(p => p.toLowerCase().includes(input.toLowerCase())) : presets

  const investigate = (text) => {
    if (!text.trim()) return
    setLoading(true)
    setData(null)
    setExpandedSection('failures')
    setTimeout(() => { setData(investigationData); setLoading(false) }, 2000)
  }

  const handleKey = (e) => {
    if (!showPresets || !filtered.length) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedPreset(p => Math.min(p + 1, filtered.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedPreset(p => Math.max(p - 1, 0)) }
    if (e.key === 'Enter' && selectedPreset >= 0) { e.preventDefault(); setInput(filtered[selectedPreset]); setShowPresets(false); investigate(filtered[selectedPreset]) }
    if (e.key === 'Escape') setShowPresets(false)
  }

  useEffect(() => { setSelectedPreset(-1) }, [input])

  return (
    <Layout>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        {/* Header */}
        <motion.div variants={item} className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/20 to-brand/20">
                <svg className="h-3 w-3 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" /></svg>
              </div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl text-white">AI Risk Investigation Console</h1>
            </div>
            <p className="text-sm text-slate-500 mt-1">Deep-dive risk analysis with failure mode detection, historical correlation, and mitigation intelligence</p>
          </div>
        </motion.div>

        {/* Input */}
        <motion.div variants={item} className="rounded-xl border border-white/[0.08] bg-gradient-to-br from-slate-900 to-slate-900/50 backdrop-blur-2xl p-4 sm:p-5">
          <form onSubmit={e => { e.preventDefault(); investigate(input) }}>
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" /></svg>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => { setInput(e.target.value); setShowPresets(true) }}
                onFocus={() => setShowPresets(true)}
                onKeyDown={handleKey}
                placeholder='Enter a feature request for deep investigation, e.g. "Add payment retry support"'
                className="w-full rounded-xl border border-white/[0.06] bg-slate-800/60 py-3.5 pl-11 pr-44 text-sm text-white placeholder-slate-600 outline-none focus:border-cyan-500/40 focus:bg-slate-800/80 transition-all"
                disabled={loading}
              />
              <div className="absolute inset-y-1.5 right-1.5 flex items-center gap-1">
                <button type="submit" disabled={loading || !input.trim()} className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-brand px-5 py-2 text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/20">
                  {loading ? <><svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Investigating</> : <><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" /></svg>Investigate</>}
                </button>
              </div>
            </div>
          </form>
          <AnimatePresence>
            {showPresets && filtered.length > 0 && !loading && (
              <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="mt-2 rounded-xl border border-white/[0.06] bg-slate-800/80 overflow-hidden">
                {filtered.map((s, i) => (
                  <button key={s} type="button" className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${i === selectedPreset ? 'bg-cyan-500/10 text-cyan-300' : 'text-slate-500 hover:bg-white/[0.04] hover:text-white'}`} onClick={() => { setInput(s); setShowPresets(false); investigate(s) }}>
                    <svg className="h-3.5 w-3.5 shrink-0 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>
                    {s}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Loading */}
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            <div className="grid gap-4 sm:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (<div key={i} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-5 animate-pulse"><div className="h-3 w-20 bg-slate-800 rounded mb-3" /><div className="h-8 w-16 bg-slate-800 rounded mb-2" /><div className="h-2 bg-slate-800 rounded" /></div>))}
            </div>
            <div className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-5 animate-pulse"><div className="h-3 w-48 bg-slate-800 rounded mb-4" />{Array.from({ length: 4 }).map((_, j) => (<div key={j} className="h-12 bg-slate-800 rounded mb-2" />))}</div>
          </motion.div>
        )}

        {/* Results */}
        <AnimatePresence>
          {data && !loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              {/* Summary Stats */}
              <motion.div variants={item} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-4 text-center hover:border-red-500/20 transition-all"><div className="text-2xl font-bold text-red-400">{data.summary.totalFailures}</div><div className="text-[10px] text-slate-500">Failure Modes</div></div>
                <div className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-4 text-center hover:border-red-500/20 transition-all"><div className="text-2xl font-bold text-red-400">{data.summary.criticalFailures}</div><div className="text-[10px] text-slate-500">Critical</div></div>
                <div className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-4 text-center hover:border-brand/20 transition-all"><div className="text-2xl font-bold text-brand-light">{data.summary.mrsAnalyzed}</div><div className="text-[10px] text-slate-500">MRs Analyzed</div></div>
                <div className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-4 text-center hover:border-green-500/20 transition-all"><div className="text-2xl font-bold text-green-400">{data.summary.incidentsPrevented}</div><div className="text-[10px] text-slate-500">Incidents Prevented</div></div>
              </motion.div>

              {/* Investigation Sections */}
              <div className="space-y-3">
                {[
                  { id: 'failures', label: 'Failure Mode Analysis', icon: 'M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z', count: data.failureModes.length },
                  { id: 'mrs', label: 'Similar Historical Merge Requests', icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z', count: data.mrs.length },
                  { id: 'incidents', label: 'Production Incident History', icon: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z', count: data.incidents.length },
                  { id: 'deps', label: 'Dependency Analysis', icon: 'M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z', count: data.deps.length },
                  { id: 'recs', label: 'AI Risk Mitigation Recommendations', icon: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z', count: data.recommendations.length },
                ].map((section) => (
                  <motion.div key={section.id} variants={item} className="rounded-xl border border-white/[0.06] bg-slate-900/50 overflow-hidden">
                    <button onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)} className="flex w-full items-center justify-between p-4 hover:bg-white/[0.02] transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/20 to-brand/20">
                          <svg className="h-4 w-4 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={section.icon} /></svg>
                        </div>
                        <div className="text-left">
                          <h3 className="text-sm font-semibold text-white">{section.label}</h3>
                          <p className="text-[10px] text-slate-600">{section.count} items</p>
                        </div>
                      </div>
                      <svg className={`h-4 w-4 text-slate-600 transition-transform duration-200 ${expandedSection === section.id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                    </button>
                    <AnimatePresence>
                      {expandedSection === section.id && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="border-t border-white/[0.04]">
                          <div className="p-4 space-y-2 max-h-[500px] overflow-y-auto scrollbar-thin">
                            {section.id === 'failures' && data.failureModes.map((f, i) => (
                              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 hover:border-cyan-500/20 transition-all">
                                <div className="flex items-start justify-between mb-1">
                                  <div className="flex items-center gap-2 flex-1 min-w-0">
                                    <span className={`rounded px-1.5 py-0.5 text-[8px] font-bold ${severityColors[f.severity]}`}>{f.severity}</span>
                                    <span className="text-xs text-slate-300">{f.mode}</span>
                                  </div>
                                  <StatusBadge status={f.probability === 'High' ? 'critical' : f.probability === 'Medium' ? 'warning' : 'info'} label={f.probability} />
                                </div>
                                <div className="grid grid-cols-2 gap-1 mt-1.5 text-[9px] text-slate-600">
                                  <span>Impact: <span className="text-slate-400">{f.impact}</span></span>
                                  <span>Detection: <span className="text-slate-400">{f.detection}</span></span>
                                </div>
                              </motion.div>
                            ))}
                            {section.id === 'mrs' && data.mrs.map((mr, i) => (
                              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="rounded-lg border border-white/[0.04] bg-white/[0.02] p-3 hover:border-cyan-500/20 transition-all">
                                <div className="flex items-start justify-between mb-1">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="rounded bg-cyan-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-cyan-300">{mr.id}</span>
                                    <span className="text-[10px] font-mono text-slate-500">{mr.author}</span>
                                    <span className={`rounded px-1.5 py-0.5 text-[8px] font-bold ${mr.outcome === 'Incident' ? 'bg-red-500/10 text-red-400' : 'bg-yellow-500/10 text-yellow-400'}`}>{mr.outcome}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-slate-600">{mr.date}</span>
                                    <span className="text-[10px] font-semibold text-cyan-400">{mr.match}%</span>
                                  </div>
                                </div>
                                <p className="text-xs text-slate-400">{mr.desc}</p>
                              </motion.div>
                            ))}
                            {section.id === 'incidents' && data.incidents.map((inc, i) => (
                              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} onClick={() => setExpandedIncident(expandedIncident === i ? null : i)} className={`rounded-lg border p-3 cursor-pointer transition-all ${inc.severity === 'critical' ? 'border-red-500/10 bg-red-500/[0.02] hover:border-red-500/20' : inc.severity === 'high' ? 'border-orange-500/10 bg-orange-500/[0.02] hover:border-orange-500/20' : 'border-yellow-500/10 bg-yellow-500/[0.02] hover:border-yellow-500/20'}`}>
                                <div className="flex items-start justify-between">
                                  <div className="flex items-center gap-2 min-w-0 flex-1">
                                    <span className={`rounded px-1.5 py-0.5 text-[8px] font-bold ${severityColors[inc.severity]}`}>{inc.severity}</span>
                                    <span className="text-xs font-semibold text-slate-200">{inc.title}</span>
                                  </div>
                                  <span className="text-[10px] text-slate-600 shrink-0 ml-2">{inc.date}</span>
                                </div>
                                <p className="text-[10px] text-slate-500 mt-1">Root cause: {inc.rootCause}</p>
                                {expandedIncident === i && (
                                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-2 pt-2 border-t border-white/[0.06]">
                                    <div className="grid grid-cols-2 gap-1 text-[9px] text-slate-600">
                                      <span>Cause: <span className="text-slate-400">{inc.cause}</span></span>
                                      <span>Impact: <span className="text-slate-400">{inc.impact}</span></span>
                                      <span>Duration: <span className="text-slate-400">{inc.duration}</span></span>
                                      <span>Services: <span className="text-slate-400">{inc.services.join(', ')}</span></span>
                                      <span className="col-span-2 text-green-400">Lesson: {inc.lessons}</span>
                                    </div>
                                  </motion.div>
                                )}
                              </motion.div>
                            ))}
                            {section.id === 'deps' && data.deps.map((d, i) => (
                              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 hover:border-cyan-500/20 transition-all">
                                <div className="flex items-center justify-between mb-1">
                                  <div className="flex items-center gap-2">
                                    <span className={`h-2 w-2 rounded-full ${d.critical ? 'bg-red-500' : 'bg-yellow-500'}`} />
                                    <span className="text-xs font-medium text-white">{d.service}</span>
                                    {d.critical && <StatusBadge status="critical" label="Critical" />}
                                  </div>
                                  <span className="text-[10px] font-semibold text-slate-400">{d.risk}% risk</span>
                                </div>
                                <div className="flex items-center gap-1.5 flex-wrap text-[9px] text-slate-600">
                                  <span>Depends on:</span>
                                  {d.deps.map((dep, j) => (
                                    <span key={j} className="rounded bg-white/[0.04] px-1.5 py-0.5 text-slate-400">{dep}</span>
                                  ))}
                                </div>
                              </motion.div>
                            ))}
                            {section.id === 'recs' && data.recommendations.map((r, i) => (
                              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} className="flex items-start gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 hover:border-green-500/20 transition-all">
                                <StatusBadge status={r.priority === 'P0' ? 'critical' : r.priority === 'P1' ? 'warning' : 'info'} label={r.priority} dot={false} />
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs text-slate-300">{r.action}</p>
                                  <div className="flex gap-3 mt-0.5 text-[9px] text-slate-600">
                                    <span>{r.impact}</span>
                                    <span className="text-slate-700">·</span>
                                    <span>{r.effort}</span>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!data && !loading && (
          <motion.div variants={item} className="text-center py-12">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.06] bg-gradient-to-br from-cyan-500/5 to-brand/5">
              <svg className="h-8 w-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" /></svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">Investigate feature risk</h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto">Enter a feature request above to run a full investigation — failure modes, historical MRs, incident root causes, dependency chains, and AI-powered mitigation recommendations.</p>
          </motion.div>
        )}
      </motion.div>
    </Layout>
  )
}
