import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Layout from '../components/Layout'

const SCENARIOS = [
  { service: 'Payment Gateway', label: 'Payment Service Failure', desc: 'Core payment processing pipeline goes offline' },
  { service: 'Billing Service', label: 'Billing Reconciliation Failure', desc: 'Invoice generation and reconciliation engine down' },
  { service: 'Auth Service', label: 'Authentication Service Failure', desc: 'OAuth/OIDC token validation fails' },
  { service: 'API Gateway', label: 'API Gateway Timeout', desc: 'Rate limiter and routing layer overwhelmed' },
  { service: 'Notification Bus', label: 'Notification Delivery Failure', desc: 'Event bus and webhook delivery fails' },
]

const MOCK_RESULTS = {
  'Payment Gateway': {
    blastRadius: '6 services (Billing, Auth, API Gateway, Notification, User Dashboard, Analytics)',
    revenueImpact: '$2.1M/hr',
    customerImpact: '12,400 customers affected',
    teamImpact: '4 teams (Payment Ops, Billing, Platform, SRE)',
    recoveryTime: '45 min (hot failover)',
    confidenceScore: 94,
    propagationChain: [
      { step: 0, service: 'Payment Gateway', status: 'failed', time: 'T+0s', severity: 'critical' },
      { step: 1, service: 'Billing Service', status: 'degraded', time: 'T+12s', severity: 'high' },
      { step: 2, service: 'API Gateway', status: 'degraded', time: 'T+30s', severity: 'high' },
      { step: 3, service: 'Auth Service', status: 'warning', time: 'T+45s', severity: 'medium' },
      { step: 4, service: 'Notification Bus', status: 'warning', time: 'T+60s', severity: 'medium' },
      { step: 5, service: 'User Dashboard', status: 'degraded', time: 'T+90s', severity: 'high' },
      { step: 6, service: 'Analytics Engine', status: 'affected', time: 'T+120s', severity: 'low' },
    ],
    aiRecommendation: 'Activate circuit breaker on Payment Gateway. Route traffic to backup payment provider. Scale Billing workers by 3x. Alert SRE team for Auth Service monitoring.',
  },
  'Billing Service': {
    blastRadius: '3 services (Payment Gateway, Notification, Analytics)',
    revenueImpact: '$890K/hr',
    customerImpact: '8,200 customers affected',
    teamImpact: '2 teams (Billing, Platform)',
    recoveryTime: '30 min (DB replica failover)',
    confidenceScore: 89,
    propagationChain: [
      { step: 0, service: 'Billing Service', status: 'failed', time: 'T+0s', severity: 'critical' },
      { step: 1, service: 'Payment Gateway', status: 'degraded', time: 'T+20s', severity: 'high' },
      { step: 2, service: 'Notification Bus', status: 'warning', time: 'T+40s', severity: 'medium' },
      { step: 3, service: 'Analytics Engine', status: 'affected', time: 'T+80s', severity: 'low' },
    ],
    aiRecommendation: 'Failover to billing DB replica. Throttle invoice generation. Notify finance team about delayed reconciliation.',
  },
  'Auth Service': {
    blastRadius: '4 services (API Gateway, Payment Gateway, Notification, User Dashboard)',
    revenueImpact: '$420K/hr',
    customerImpact: '47,000 customers affected',
    teamImpact: '3 teams (Platform, Security, SRE)',
    recoveryTime: '15 min (token cache reload)',
    confidenceScore: 92,
    propagationChain: [
      { step: 0, service: 'Auth Service', status: 'failed', time: 'T+0s', severity: 'critical' },
      { step: 1, service: 'API Gateway', status: 'degraded', time: 'T+5s', severity: 'high' },
      { step: 2, service: 'Payment Gateway', status: 'degraded', time: 'T+15s', severity: 'high' },
      { step: 3, service: 'Notification Bus', status: 'warning', time: 'T+30s', severity: 'medium' },
      { step: 4, service: 'User Dashboard', status: 'warning', time: 'T+45s', severity: 'medium' },
    ],
    aiRecommendation: 'Rotate auth tokens. Restart token cache service. Verify OIDC provider connectivity. Scale auth workers by 2x.',
  },
  'API Gateway': {
    blastRadius: '5 services (Payment Gateway, Billing, Notification, User Dashboard, Auth)',
    revenueImpact: '$1.3M/hr',
    customerImpact: '47,000 customers affected',
    teamImpact: '3 teams (Platform, SRE, Security)',
    recoveryTime: '20 min (rate limit config reload)',
    confidenceScore: 87,
    propagationChain: [
      { step: 0, service: 'API Gateway', status: 'failed', time: 'T+0s', severity: 'critical' },
      { step: 1, service: 'Auth Service', status: 'degraded', time: 'T+5s', severity: 'high' },
      { step: 2, service: 'Payment Gateway', status: 'degraded', time: 'T+15s', severity: 'high' },
      { step: 3, service: 'Billing Service', status: 'warning', time: 'T+30s', severity: 'medium' },
      { step: 4, service: 'Notification Bus', status: 'warning', time: 'T+45s', severity: 'medium' },
    ],
    aiRecommendation: 'Apply rate limit override config. Route API traffic to secondary gateway. Scale gateway workers by 4x.',
  },
  'Notification Bus': {
    blastRadius: '3 services (Payment Gateway, Billing, Analytics)',
    revenueImpact: '$180K/hr',
    customerImpact: '2,100 customers affected',
    teamImpact: '2 teams (Platform, DevOps)',
    recoveryTime: '10 min (queue drain)',
    confidenceScore: 95,
    propagationChain: [
      { step: 0, service: 'Notification Bus', status: 'failed', time: 'T+0s', severity: 'critical' },
      { step: 1, service: 'Payment Gateway', status: 'warning', time: 'T+30s', severity: 'medium' },
      { step: 2, service: 'Billing Service', status: 'warning', time: 'T+60s', severity: 'medium' },
    ],
    aiRecommendation: 'Drain notification queue. Restart event bus workers. Review webhook delivery retry config.',
  },
}

function AnimatedCounter({ value, suffix = '', duration = 1500, delay = 0 }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!value) return
    const timeout = setTimeout(() => {
      const numVal = parseFloat(value.toString().replace(/[$,K]/g, ''))
      if (isNaN(numVal)) { setCount(value); return }
      const steps = 30
      const inc = numVal / steps
      let cur = 0
      const iv = setInterval(() => {
        cur += inc
        if (cur >= numVal) { setCount(numVal); clearInterval(iv) }
        else setCount(Math.floor(cur))
      }, duration / steps)
      return () => clearInterval(iv)
    }, delay)
    return () => clearTimeout(timeout)
  }, [value, duration, delay])
  if (typeof count === 'number') return <span>{count.toLocaleString()}{suffix}</span>
  return <span>{value}</span>
}

const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }

export default function DecisionSimulator() {
  const [input, setInput] = useState('')
  const [simulating, setSimulating] = useState(false)
  const [results, setResults] = useState(null)
  const [activeScenario, setActiveScenario] = useState(null)
  const [showPropagation, setShowPropagation] = useState(false)
  const [propagationStep, setPropagationStep] = useState(0)
  const resultsRef = useRef(null)

  const filtered = input.trim()
    ? SCENARIOS.filter(s => s.service.toLowerCase().includes(input.toLowerCase()) || s.label.toLowerCase().includes(input.toLowerCase()))
    : SCENARIOS

  const simulate = (scenario) => {
    setSimulating(true)
    setResults(null)
    setShowPropagation(false)
    setPropagationStep(0)
    setActiveScenario(scenario)
    setTimeout(() => {
      setResults(MOCK_RESULTS[scenario.service])
      setSimulating(false)
      setTimeout(() => {
        setShowPropagation(true)
        setTimeout(() => {
          if (resultsRef.current) {
            resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        }, 100)
      }, 300)
    }, 1800)
  }

  useEffect(() => {
    if (!showPropagation || !results) return
    if (propagationStep >= results.propagationChain.length) return
    const t = setTimeout(() => setPropagationStep(s => s + 1), 600)
    return () => clearTimeout(t)
  }, [propagationStep, showPropagation, results])

  const handleKey = (e) => {
    if (e.key === 'Enter' && filtered.length > 0) {
      simulate(filtered[0])
    }
  }

  return (
    <Layout>
      <motion.div variants={{ hidden: {}, show: { staggerChildren: 0.04 } }} initial="hidden" animate="show" className="space-y-6">

        {/* Hero */}
        <motion.div variants={item} className="flex flex-col items-center text-center gap-4 pt-6 pb-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600/20 to-cyan-500/10 border border-violet-500/20">
            <svg className="h-8 w-8 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Executive Decision Simulator</h1>
            <p className="text-[10px] text-violet-400 font-medium tracking-[0.15em] uppercase mb-1">AI-Powered What-If Analysis Engine</p>
            <p className="text-sm text-slate-400 max-w-lg">Simulate service failures and see real-time blast radius, revenue impact, and AI-recommended response.</p>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div variants={item} className="max-w-xl mx-auto w-full">
          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask: What happens if Payment Service fails?"
              className="w-full rounded-xl border border-slate-700 bg-slate-900 py-3.5 pl-11 pr-4 text-sm text-white placeholder-slate-600 outline-none focus:border-violet-500/40 transition-all"
            />
          </div>
          <div className="flex flex-wrap gap-2 mt-3 justify-center">
            {filtered.map((s, i) => (
              <button key={s.service} onClick={() => { setInput(s.service); simulate(s) }}
                className="rounded-full border border-slate-700 bg-slate-900/60 px-3 py-1.5 text-[10px] text-slate-400 hover:border-violet-500/30 hover:text-violet-300 transition-all whitespace-nowrap flex items-center gap-1.5">
                <span className={`h-1.5 w-1.5 rounded-full ${
                  s.service === 'Payment Gateway' ? 'bg-red-500' :
                  s.service === 'Billing Service' ? 'bg-amber-500' :
                  s.service === 'Auth Service' ? 'bg-violet-500' :
                  s.service === 'API Gateway' ? 'bg-cyan-500' : 'bg-emerald-500'
                }`} />
                {s.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Simulating */}
        {simulating && (
          <motion.div variants={item} className="flex flex-col items-center py-12">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}>
              <svg className="h-10 w-10 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
              </svg>
            </motion.div>
            <p className="text-sm text-slate-500 mt-4">AI simulating failure scenario...</p>
            {activeScenario && (
              <div className="flex items-center gap-2 mt-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-violet-500 animate-pulse" />
                <span className="text-[10px] text-violet-400 font-mono">{activeScenario.label}</span>
              </div>
            )}
          </motion.div>
        )}

        {/* Results */}
        <AnimatePresence>
          {results && !simulating && (
            <motion.div
              ref={resultsRef}
              key="results"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Success banner */}
              <motion.div variants={item} className="rounded-xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/[0.04] to-green-500/[0.02] p-4 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20">
                  <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white">Simulation Complete &mdash; {activeScenario?.label}</p>
                  <p className="text-[10px] text-slate-400">AI analysis complete with {results.confidenceScore}% confidence</p>
                </div>
                <span className="rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 text-[8px] font-mono font-bold">AI POWERED</span>
              </motion.div>

              {/* KPI Grid */}
              <motion.div variants={item} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  { label: 'Revenue Impact', value: results.revenueImpact, icon: 'M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
                  { label: 'Customer Impact', value: results.customerImpact, icon: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
                  { label: 'Recovery Time', value: results.recoveryTime, icon: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
                ].map((kpi, i) => (
                  <div key={kpi.label} className={`rounded-lg border ${kpi.bg} p-4`}>
                    <div className="flex items-center gap-2 mb-2">
                      <svg className={`h-4 w-4 ${kpi.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={kpi.icon} />
                      </svg>
                      <span className="text-[9px] text-slate-500 font-mono uppercase tracking-wider">{kpi.label}</span>
                    </div>
                    <div className={`text-xl font-bold ${kpi.color}`}>{kpi.value}</div>
                  </div>
                ))}
                <div className={`rounded-lg border border-violet-500/20 bg-violet-500/10 p-4`}>
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="h-4 w-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-[9px] text-slate-500 font-mono uppercase tracking-wider">AI Confidence</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-2xl font-bold text-violet-400">{results.confidenceScore}%</div>
                    <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${results.confidenceScore}%` }} transition={{ duration: 1, delay: 0.3 }} className="h-full rounded-full bg-violet-500" />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Team Impact + Blast Radius */}
              <motion.div variants={item} className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-500/20">
                      <svg className="h-3.5 w-3.5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                      </svg>
                    </div>
                    <h3 className="text-xs font-semibold text-white">Blast Radius</h3>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">{results.blastRadius}</p>
                  <div className="mt-3 flex items-center gap-2 text-[9px] text-slate-600">
                    <svg className="h-3 w-3 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                    </svg>
                    {results.teamImpact}
                  </div>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/20">
                      <svg className="h-3.5 w-3.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-3.25-3.25a1.5 1.5 0 010-2.12l6.5-6.5a1.5 1.5 0 012.12 0l3.25 3.25a1.5 1.5 0 010 2.12l-6.5 6.5a1.5 1.5 0 01-2.12 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xs font-semibold text-white">AI Recommended Response</h3>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">{results.aiRecommendation}</p>
                </div>
              </motion.div>

              {/* Propagation Chain */}
              {showPropagation && (
                <motion.div variants={item} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20">
                      <svg className="h-3.5 w-3.5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                      </svg>
                    </div>
                    <h3 className="text-xs font-semibold text-white">Failure Propagation Simulation</h3>
                    <span className="rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 text-[8px] font-mono font-bold">LIVE</span>
                  </div>
                  <div className="space-y-1.5">
                    {results.propagationChain.map((p, i) => {
                      const isVisible = i <= propagationStep
                      const isCurrent = i === propagationStep
                      return (
                        <motion.div
                          key={p.service}
                          initial={{ opacity: 0, x: -20 }}
                          animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                          transition={{ duration: 0.4, delay: 0 }}
                          className={`flex items-center gap-3 rounded-lg border p-3 transition-all ${
                            isCurrent ? 'border-violet-500/40 bg-violet-500/[0.04] shadow-lg shadow-violet-500/5' :
                            p.severity === 'critical' ? 'border-red-500/20 bg-red-500/[0.02]' :
                            p.severity === 'high' ? 'border-orange-500/15 bg-orange-500/[0.02]' :
                            p.severity === 'medium' ? 'border-amber-500/10 bg-amber-500/[0.01]' :
                            'border-slate-800 bg-slate-900/60'
                          }`}
                        >
                          <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                            isCurrent ? 'bg-violet-500/20 text-violet-400 ring-2 ring-violet-500/50' :
                            p.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                            p.severity === 'high' ? 'bg-orange-500/20 text-orange-400' :
                            p.severity === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                            'bg-slate-700 text-slate-500'
                          }`}>
                            {isCurrent ? (
                              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="h-2 w-2 rounded-full bg-violet-500" />
                            ) : (
                              i + 1
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className={`text-xs font-medium ${isCurrent ? 'text-white' : 'text-slate-300'}`}>{p.service}</span>
                              <span className={`rounded px-1 py-0.5 text-[7px] font-bold uppercase ${
                                p.status === 'failed' ? 'bg-red-500/20 text-red-400' :
                                p.status === 'degraded' ? 'bg-orange-500/20 text-orange-400' :
                                p.status === 'warning' ? 'bg-amber-500/20 text-amber-400' :
                                'bg-slate-700 text-slate-400'
                              }`}>{p.status}</span>
                            </div>
                            <div className="flex gap-3 text-[8px] text-slate-600 mt-0.5">
                              <span>{p.time}</span>
                              <span className="capitalize">{p.severity} severity</span>
                            </div>
                          </div>
                          <div className="h-1.5 w-16 rounded-full bg-slate-800 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={isVisible ? { width: i === 0 ? '100%' : `${Math.max(20, 100 - i * 15)}%` } : { width: 0 }}
                              transition={{ duration: 0.6, delay: 0.2 }}
                              className={`h-full rounded-full ${
                                p.severity === 'critical' ? 'bg-red-500' :
                                p.severity === 'high' ? 'bg-orange-500' :
                                p.severity === 'medium' ? 'bg-amber-500' : 'bg-slate-500'
                              }`}
                            />
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </motion.div>
              )}

              {/* Fallback card */}
              <motion.div variants={item} className="rounded-xl border border-emerald-500/15 bg-emerald-500/[0.02] p-3 flex items-center gap-2">
                <svg className="h-4 w-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-[11px] text-slate-400">Decision simulation completed successfully. AI recommends immediate action based on {results.confidenceScore}% confidence analysis.</span>
              </motion.div>

            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>
    </Layout>
  )
}
