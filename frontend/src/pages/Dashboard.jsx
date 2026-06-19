import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Layout from '../components/Layout'
import StatCard from '../components/StatCard'
import StatusBadge from '../components/StatusBadge'

const presets = [
  'Add payment retry support',
  'Implement OAuth 2.0 SSO',
  'Add full-text search',
  'Refactor billing module',
  'Deploy microservices monitoring',
]

const resultsData = {
  kpis: { riskScore: 72, confidenceScore: 91, incidentProbability: 82, releaseReadiness: 74 },
  deployment: { readiness: 68, risk: 'moderate', recommendation: 'Proceed with Caution' },
  incidentPrediction: { probability: 82, confidence: 91, severity: 'High', nextWindow: 'Next 24 hours' },
  blastRadius: { services: 4, teams: 3, pipelines: 2, score: 65 },
  services: [
    { name: 'Payment Service', risk: 87, impact: 'critical', status: 'Analyzed' },
    { name: 'Billing Service', risk: 65, impact: 'high', status: 'Analyzed' },
    { name: 'Notification Service', risk: 45, impact: 'medium', status: 'Analyzed' },
    { name: 'API Gateway', risk: 72, impact: 'high', status: 'Analyzed' },
  ],
  teams: [
    { name: 'Payments', role: 'Primary Owner', load: 85, members: 8 },
    { name: 'Billing', role: 'Supporting', load: 60, members: 5 },
    { name: 'Platform', role: 'Consulting', load: 30, members: 6 },
  ],
  timeline: [
    { phase: 'Design Review', dur: '3 days', risk: 'Low' },
    { phase: 'Core Implementation', dur: '8 days', risk: 'High' },
    { phase: 'Integration Testing', dur: '5 days', risk: 'Medium' },
    { phase: 'Staging Deploy', dur: '2 days', risk: 'Low' },
    { phase: 'Production Release', dur: '1 day', risk: 'Critical' },
  ],
  risks: [
    { risk: 'Circuit breaker misconfiguration', severity: 'critical', mitigation: 'Add integration tests with fault injection', probability: 'Medium' },
    { risk: 'Retry queue overflow under peak load', severity: 'high', mitigation: 'Implement bounded retry queues', probability: 'High' },
    { risk: 'Billing reconciliation delay during rollout', severity: 'medium', mitigation: 'Feature flag with gradual rollout', probability: 'Low' },
  ],
  actions: [
    { priority: 'P0', action: 'Add circuit breaker to payment retry', owner: 'Payments', deadline: 'This sprint' },
    { priority: 'P1', action: 'Increase billing worker memory limit', owner: 'Billing', deadline: 'Next sprint' },
    { priority: 'P1', action: 'Add monitoring alerts for retry failures', owner: 'Platform', deadline: 'This sprint' },
  ],
}

function AnimatedKPI({ value, label, color, delay = 0, format = '%' }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => {
      let start = 0; const inc = value / 40; const i = setInterval(() => { start += inc; if (start >= value) { setCount(value); clearInterval(i) } else setCount(Math.floor(start)) }, 25)
      return () => clearInterval(i)
    }, delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return (
    <div className="rounded-xl border border-white/[0.06] bg-gradient-to-br from-slate-900 to-slate-900/50 p-4 text-center group hover:border-brand/20 transition-all">
      <div className={`text-3xl sm:text-4xl font-bold ${color} group-hover:scale-110 transition-transform duration-300`}>{count}{format}</div>
      <div className="text-[10px] text-slate-500 mt-1.5 tracking-wide uppercase">{label}</div>
      <div className="mt-2 h-1 rounded-full bg-slate-800 overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 0.8, delay: delay / 1000 + 0.3 }} className={`h-full rounded-full ${color.replace('text-', 'bg-').replace('400', '500')}`} />
      </div>
    </div>
  )
}

function AnimatedGauge({ value, label, sub, color, delay = 0 }) {
  const [pct, setPct] = useState(0)
  useEffect(() => { const t = setTimeout(() => setPct(value), delay); return () => clearTimeout(t) }, [value, delay])
  const circumference = Math.PI * 50
  const offset = circumference - (pct / 100) * circumference
  return (
    <div className="flex flex-col items-center">
      <svg className="w-24 h-24 sm:w-28 sm:h-28 -rotate-90" viewBox="0 0 116 116">
        <circle cx="58" cy="58" r="50" fill="none" stroke="#1e293b" strokeWidth="8" />
        <circle cx="58" cy="58" r="50" fill="none" stroke={color} strokeWidth="8" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} className="transition-all duration-1000 ease-out" />
      </svg>
      <div className="relative -mt-[60px] flex flex-col items-center">
        <span className="text-xl sm:text-2xl font-bold text-white">{pct}<span className="text-xs text-slate-500">%</span></span>
        {sub && <span className="text-[9px] text-slate-500">{sub}</span>}
      </div>
      <span className="text-[10px] font-medium text-slate-600 mt-1">{label}</span>
    </div>
  )
}

function ServiceBar({ name, risk, impact, index }) {
  const [w, setW] = useState(0)
  useEffect(() => { const t = setTimeout(() => setW(risk), 300 + index * 100); return () => clearTimeout(t) }, [risk, index])
  const color = risk >= 80 ? 'from-red-500 to-red-600' : risk >= 60 ? 'from-orange-500 to-amber-500' : 'from-yellow-500 to-amber-400'
  const dotColor = risk >= 80 ? 'bg-red-500' : risk >= 60 ? 'bg-orange-500' : 'bg-yellow-500'
  return (
    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.08 }} className="flex items-center gap-3 py-2">
      <span className={`h-2 w-2 rounded-full shrink-0 ${dotColor}`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-xs font-medium text-slate-300">{name}</span>
          <span className="text-[10px] font-semibold text-slate-400">{risk}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${w}%` }} transition={{ duration: 0.8 }} className={`h-full rounded-full bg-gradient-to-r ${color}`} />
        </div>
      </div>
    </motion.div>
  )
}

function TeamCard({ team, index }) {
  const [w, setW] = useState(0)
  useEffect(() => { const t = setTimeout(() => setW(team.load), 400 + index * 100); return () => clearTimeout(t) }, [team.load, index])
  const color = team.load >= 80 ? 'bg-red-500' : team.load >= 60 ? 'bg-yellow-500' : 'bg-green-500'
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`flex h-7 w-7 rounded-lg items-center justify-center text-[9px] font-bold ${index === 0 ? 'bg-red-500/20 text-red-300' : index === 1 ? 'bg-yellow-500/20 text-yellow-300' : 'bg-green-500/20 text-green-300'}`}>{team.name[0]}</div>
          <div><div className="text-xs font-medium text-white">{team.name}</div><div className="text-[9px] text-slate-600">{team.role} · {team.members} eng</div></div>
        </div>
        <span className={`text-[10px] font-medium ${team.load >= 80 ? 'text-red-400' : team.load >= 60 ? 'text-yellow-400' : 'text-green-400'}`}>{team.load}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${w}%` }} transition={{ duration: 0.8 }} className={`h-full rounded-full ${color}`} />
      </div>
    </motion.div>
  )
}

function RiskCard({ item, index }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 hover:border-red-500/20 transition-colors">
      <div className="flex items-start justify-between mb-1">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <StatusBadge status={item.severity} label={item.severity} />
          <span className="text-xs text-slate-300">{item.risk}</span>
        </div>
        <StatusBadge status={item.probability === 'High' ? 'critical' : item.probability === 'Medium' ? 'warning' : 'info'} label={item.probability} />
      </div>
      <p className="text-[10px] text-slate-600 mt-1">{item.mitigation}</p>
    </motion.div>
  )
}

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } }
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }

export default function Dashboard() {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [showPresets, setShowPresets] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState(-1)
  const inputRef = useRef(null)

  const filtered = input.trim() ? presets.filter(p => p.toLowerCase().includes(input.toLowerCase())) : presets

  const analyze = (text) => {
    if (!text.trim()) return
    setLoading(true)
    setData(null)
    setActiveTab('overview')
    setTimeout(() => {
      setData(resultsData)
      setLoading(false)
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

  return (
    <Layout>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        {/* Header */}
        <motion.div variants={item} className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl text-white">Executive Command Center</h1>
            <p className="mt-1 text-sm text-slate-500">Real-time risk analysis and deployment intelligence for feature changes</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" /></span>
            <StatusBadge status="success" label="System Online" />
            <StatusBadge status="info" label="ML v3.2" />
          </div>
        </motion.div>

        {/* Input */}
        <motion.div variants={item} className="rounded-xl border border-white/[0.08] bg-gradient-to-br from-slate-900 to-slate-900/50 backdrop-blur-2xl p-4 sm:p-5">
          <form onSubmit={e => { e.preventDefault(); analyze(input) }}>
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => { setInput(e.target.value); setShowPresets(true) }}
                onFocus={() => setShowPresets(true)}
                onKeyDown={handleKey}
                placeholder='Enter a feature request to analyze, e.g. "Add payment retry support"'
                className="w-full rounded-xl border border-white/[0.06] bg-slate-800/60 py-3.5 pl-11 pr-44 text-sm text-white placeholder-slate-600 outline-none focus:border-brand/40 focus:bg-slate-800/80 transition-all"
                disabled={loading}
              />
              <div className="absolute inset-y-1.5 right-1.5 flex items-center gap-1">
                <button type="submit" disabled={loading || !input.trim()} className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-brand to-violet-500 px-5 py-2 text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand/20">
                  {loading ? (
                    <><svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Analyzing</>
                  ) : (
                    <><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" /></svg>Analyze Feature</>
                  )}
                </button>
              </div>
            </div>
          </form>
          <AnimatePresence>
            {showPresets && filtered.length > 0 && !loading && (
              <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="mt-2 rounded-xl border border-white/[0.06] bg-slate-800/80 overflow-hidden">
                {filtered.map((s, i) => (
                  <button key={s} type="button" className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${i === selectedPreset ? 'bg-brand/10 text-brand-light' : 'text-slate-500 hover:bg-white/[0.04] hover:text-white'}`} onClick={() => { setInput(s); setShowPresets(false); analyze(s) }}>
                    <svg className="h-3.5 w-3.5 shrink-0 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>
                    {s}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          {data && !loading && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/[0.06]">
              <StatusBadge status="success" label="Analysis Complete" />
              <span className="text-[10px] text-slate-600">Feature: <span className="text-slate-400 font-medium">{input}</span></span>
              <button onClick={() => { setData(null); setInput('') }} className="ml-auto text-[10px] text-slate-600 hover:text-slate-400 transition-colors">Clear</button>
            </div>
          )}
        </motion.div>

        {/* Loading */}
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (<div key={i} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-5 animate-pulse"><div className="h-3 w-20 bg-slate-800 rounded mb-3" /><div className="h-8 w-16 bg-slate-800 rounded mb-2" /><div className="h-2 bg-slate-800 rounded" /></div>))}
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              {Array.from({ length: 2 }).map((_, i) => (<div key={i} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-5 animate-pulse"><div className="h-3 w-32 bg-slate-800 rounded mb-4" />{Array.from({ length: 3 }).map((_, j) => (<div key={j} className="h-8 bg-slate-800 rounded mb-2" />))}</div>))}
            </div>
          </motion.div>
        )}

        {/* Results */}
        <AnimatePresence>
          {data && !loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              {/* Tab bar */}
              <motion.div variants={item} className="flex gap-1 rounded-xl border border-white/[0.06] bg-slate-900/60 p-1 overflow-x-auto">
                {['overview', 'services', 'risks', 'actions'].map(t => (
                  <button key={t} onClick={() => setActiveTab(t)} className={`rounded-lg px-3 sm:px-4 py-2 text-xs font-medium transition-all whitespace-nowrap ${activeTab === t ? 'bg-gradient-to-r from-brand/15 to-violet-500/15 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}>
                    {t === 'overview' ? 'Overview' : t === 'services' ? 'Services & Teams' : t === 'risks' ? 'Risk Analysis' : 'Action Plan'}
                  </button>
                ))}
              </motion.div>

              <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                  <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.15 }} className="space-y-6">
                    {/* KPI Row */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <AnimatedKPI value={data.kpis.riskScore} label="Risk Score" color="text-red-400" delay={0} />
                      <AnimatedKPI value={data.kpis.confidenceScore} label="Confidence Score" color="text-green-400" delay={100} />
                      <AnimatedKPI value={data.kpis.incidentProbability} label="Incident Probability" color="text-orange-400" delay={200} />
                      <AnimatedKPI value={data.kpis.releaseReadiness} label="Release Readiness" color="text-brand-light" delay={300} />
                    </div>

                    {/* Gauges Section */}
                    <div className="grid gap-6 lg:grid-cols-4">
                      <div className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-4">
                        <AnimatedGauge value={data.deployment.readiness} label="Deployment Readiness" sub="Risk Meter" color="#06b6d4" delay={300} />
                        <div className="mt-3 text-center">
                          <StatusBadge status={data.deployment.risk === 'high' ? 'critical' : data.deployment.risk === 'moderate' ? 'warning' : 'info'} label={data.deployment.recommendation} />
                        </div>
                      </div>
                      <div className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-4">
                        <AnimatedGauge value={data.incidentPrediction.probability} label="Incident Prediction" sub="Next 24h" color="#ef4444" delay={500} />
                        <div className="mt-3 text-center">
                          <StatusBadge status={data.incidentPrediction.severity === 'High' ? 'critical' : 'warning'} label={`${data.incidentPrediction.severity} Severity`} />
                        </div>
                      </div>
                      <div className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-4">
                        <AnimatedGauge value={data.kpis.confidenceScore} label="Release Confidence" sub="Model Score" color="#22c55e" delay={700} />
                        <div className="mt-3 text-center">
                          <StatusBadge status={data.kpis.confidenceScore >= 80 ? 'success' : 'warning'} label={data.kpis.confidenceScore >= 80 ? 'High Confidence' : 'Medium Confidence'} />
                        </div>
                      </div>
                      <div className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-4">
                        <AnimatedGauge value={data.blastRadius.score} label="Blast Radius Score" sub="Service Impact" color="#f59e0b" delay={900} />
                        <div className="mt-3 text-center">
                          <StatusBadge status={data.blastRadius.score >= 70 ? 'critical' : data.blastRadius.score >= 50 ? 'warning' : 'info'} label={`${data.blastRadius.services} services`} />
                        </div>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-5">
                      <h3 className="text-sm font-semibold text-white mb-4">Estimated Timeline</h3>
                      <div className="space-y-1">
                        {data.timeline.map((t, i) => (
                          <motion.div key={t.phase} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} className="flex items-center gap-3 py-2">
                            <div className={`h-2.5 w-2.5 rounded-full ${t.risk === 'Critical' ? 'bg-red-500' : t.risk === 'High' ? 'bg-orange-500' : t.risk === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'}`} />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-slate-300">{t.phase}</span>
                                <span className="text-[10px] text-slate-600">{t.dur}</span>
                              </div>
                              <div className="h-1.5 rounded-full bg-slate-800 mt-1 overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: `${100 - i * 20}%` }} transition={{ duration: 0.6, delay: 0.3 + i * 0.08 }} className={`h-full rounded-full ${t.risk === 'Critical' ? 'bg-red-500' : t.risk === 'High' ? 'bg-orange-500' : t.risk === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'}`} />
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'services' && (
                  <motion.div key="services" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.15 }} className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-5">
                      <h3 className="text-sm font-semibold text-white mb-4">Affected Services</h3>
                      {data.services.map((s, i) => <ServiceBar key={s.name} {...s} index={i} />)}
                      <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center gap-2 text-[10px] text-slate-600">
                        <span className="h-2 w-2 rounded-full bg-red-500" /> Critical
                        <span className="h-2 w-2 rounded-full bg-orange-500 ml-2" /> High
                        <span className="h-2 w-2 rounded-full bg-yellow-500 ml-2" /> Medium
                        <span className="ml-auto">{data.blastRadius.pipelines} pipelines affected</span>
                      </div>
                    </div>
                    <div className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-5">
                      <h3 className="text-sm font-semibold text-white mb-4">Affected Teams</h3>
                      <div className="space-y-2">
                        {data.teams.map((t, i) => <TeamCard key={t.name} team={t} index={i} />)}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'risks' && (
                  <motion.div key="risks" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.15 }} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-5">
                    <h3 className="text-sm font-semibold text-white mb-4">Risk Analysis</h3>
                    <div className="grid gap-3 md:grid-cols-2">
                      <div>
                        <h4 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Detected Risks</h4>
                        <div className="space-y-2">
                          {data.risks.map((r, i) => <RiskCard key={i} item={r} index={i} />)}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Blast Radius Impact</h4>
                        <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4">
                          <div className="grid grid-cols-3 gap-3 text-center">
                            <div><div className="text-xl font-bold text-red-400">{data.blastRadius.services}</div><div className="text-[9px] text-slate-600">Services</div></div>
                            <div><div className="text-xl font-bold text-yellow-400">{data.blastRadius.teams}</div><div className="text-[9px] text-slate-600">Teams</div></div>
                            <div><div className="text-xl font-bold text-orange-400">{data.blastRadius.pipelines}</div><div className="text-[9px] text-slate-600">Pipelines</div></div>
                          </div>
                          <div className="mt-3">
                            <div className="flex justify-between text-[9px] text-slate-600 mb-1"><span>Blast Radius</span><span>{data.blastRadius.score}%</span></div>
                            <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                              <motion.div initial={{ width: 0 }} animate={{ width: `${data.blastRadius.score}%` }} transition={{ duration: 0.8 }} className="h-full rounded-full bg-gradient-to-r from-yellow-500 to-red-500" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'actions' && (
                  <motion.div key="actions" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.15 }} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-5">
                    <h3 className="text-sm font-semibold text-white mb-4">Recommended Actions</h3>
                    <div className="space-y-2">
                      {data.actions.map((a, i) => (
                        <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} className="flex items-center gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 hover:border-brand/20 transition-all">
                          <StatusBadge status={a.priority === 'P0' ? 'critical' : a.priority === 'P1' ? 'warning' : 'info'} label={a.priority} dot={false} />
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium text-slate-300">{a.action}</div>
                            <div className="text-[9px] text-slate-600 mt-0.5">Owner: {a.owner} · Target: {a.deadline}</div>
                          </div>
                          <svg className="h-4 w-4 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" /></svg>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!data && !loading && (
          <motion.div variants={item} className="text-center py-12">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.06] bg-gradient-to-br from-brand/5 to-violet-500/5">
              <svg className="h-8 w-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">Analyze a feature request</h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto">Enter a feature request above to run instant risk analysis, impact prediction, and deployment readiness scoring.</p>
          </motion.div>
        )}
      </motion.div>
    </Layout>
  )
}
