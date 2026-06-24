import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const QUERIES = [
  { id: 'risk', label: 'Why is risk increasing?', icon: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z' },
  { id: 'deps', label: 'Show critical dependencies', icon: 'M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z' },
  { id: 'fix', label: 'What should I fix first?', icon: 'M11.42 15.17l-3.25-3.25a1.5 1.5 0 010-2.12l6.5-6.5a1.5 1.5 0 012.12 0l3.25 3.25a1.5 1.5 0 010 2.12l-6.5 6.5a1.5 1.5 0 01-2.12 0z' },
  { id: 'revenue', label: 'Revenue impact summary', icon: 'M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { id: 'blast', label: 'What is the blast radius?', icon: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z' },
  { id: 'health', label: 'System health overview', icon: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
]

const RESPONSES = {
  risk: {
    title: 'Risk Trend Analysis',
    body: 'Risk is trending upward (↑12% this week) due to three factors: (1) Payment Gateway circuit breaker is approaching threshold with 87% failure rate, (2) Billing Service has 3 unresolved incidents from this sprint, (3) API Gateway timeout configuration needs tuning for peak traffic.',
    insights: [
      'Payment Gateway: 87% circuit breaker threshold reached',
      'Billing Service: 3 unresolved incidents',
      'API Gateway: timeout tuning required',
      'Recommendation: Prioritize circuit breaker fix in current sprint',
    ],
    priority: 'high',
  },
  deps: {
    title: 'Critical Dependency Map',
    body: '3 critical dependency chains identified: Payment Gateway → Billing Service → Invoice Engine (revenue chain), Auth Service → API Gateway → All Services (auth chain), Notification Bus → Webhook Delivery → Customer Alerts (reliability chain).',
    insights: [
      'Payment Gateway depends on 4 downstream services',
      'Auth Service is a single point of failure for 47 services',
      'Billing reconciliation blocks invoice generation',
      'Recommendation: Add circuit breaker on Payment → Billing path',
    ],
    priority: 'critical',
  },
  fix: {
    title: 'Priority Remediation Plan',
    body: 'Based on risk scoring and business impact, fix in this order: (1) Payment Gateway circuit breaker — prevents $2.1M/hr blast radius, (2) Auth Service token rotation — affects all 47 services, (3) API Gateway rate limiting — protects against cascade failure.',
    insights: [
      'P0: Payment Gateway circuit breaker (risk score: 92)',
      'P0: Auth Service token rotation (risk score: 85)',
      'P1: API Gateway rate limit tuning (risk score: 72)',
      'P2: Billing Service reconciliation (risk score: 45)',
    ],
    priority: 'critical',
  },
  revenue: {
    title: 'Revenue Impact Assessment',
    body: 'Current blast radius exposure: $2.8M at risk across 3 critical services. Payment Gateway alone accounts for $2.1M/hr. Billing Service adds $890K/hr if reconciliation fails. Recommended circuit breaker implementation reduces exposure by 82%.',
    insights: [
      'Payment Gateway: $2.1M/hr at risk',
      'Billing Service: $890K/hr at risk',
      'Auth Service: $420K/hr at risk',
      'Total exposure: $3.4M (peak)',
      'Mitigation ROI: 285% (circuit breaker implementation)',
    ],
    priority: 'high',
  },
  blast: {
    title: 'Blast Radius Analysis',
    body: 'Payment Gateway failure cascades to 6 services within 90 seconds. Impact order: Billing Service (T+12s) → API Gateway (T+30s) → Auth Service (T+45s) → Notification Bus (T+60s) → User Dashboard (T+90s) → Analytics Engine (T+120s).',
    insights: [
      '6 services affected within 90 seconds',
      'Stage 1: Direct dependencies (2 services)',
      'Stage 2: Secondary cascade (3 services)',
      'Stage 3: Tertiary impact (1 service)',
      'Recovery estimate: 45 minutes with hot failover',
    ],
    priority: 'critical',
  },
  health: {
    title: 'System Health Overview',
    body: 'Overall system health: 92.4%. 3 services degraded (Payment Gateway, Billing Service, API Gateway). 44 services operational. AI Confidence: 94.2%. Incident prevention rate: 96.7% (128 prevented in last 30 days).',
    insights: [
      'Overall health: 92.4% (stable)',
      'Degraded: 3 services (Payment, Billing, API)',
      'Operational: 44 services',
      'AI Confidence: 94.2%',
      'Incidents prevented: 128 (96.7% prevention rate)',
    ],
    priority: 'info',
  },
}

export default function AICopilot() {
  const [open, setOpen] = useState(false)
  const [selectedQuery, setSelectedQuery] = useState(null)
  const [response, setResponse] = useState(null)
  const [loading, setLoading] = useState(false)
  const panelRef = useRef(null)

  const handleQuery = (query) => {
    setSelectedQuery(query)
    setLoading(true)
    setResponse(null)
    setTimeout(() => {
      setResponse(RESPONSES[query.id])
      setLoading(false)
    }, 800)
  }

  const reset = () => {
    setSelectedQuery(null)
    setResponse(null)
    setLoading(false)
  }

  useEffect(() => {
    if (!open) reset()
  }, [open])

  useEffect(() => {
    const handleKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'm') {
        e.preventDefault()
        setOpen(p => !p)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setOpen(p => !p)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-purple-600 shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 transition-shadow"
      >
        <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
        </svg>
        <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-slate-900">
          <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-75" />
        </span>
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-36 right-4 sm:bottom-32 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 max-h-[60vh] rounded-xl border border-slate-700 bg-slate-900 shadow-2xl shadow-violet-500/10 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center gap-2 p-3 border-b border-slate-800 bg-slate-900/80">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-purple-600">
                <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white">AI Copilot</p>
                <p className="text-[8px] text-slate-600 font-mono">Ctrl+M to open &middot; Ask anything</p>
              </div>
              <button onClick={() => setOpen(false)} className="flex h-6 w-6 items-center justify-center rounded hover:bg-slate-800 transition-colors">
                <svg className="h-3.5 w-3.5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {!selectedQuery && !loading && !response && (
                <>
                  <p className="text-[9px] text-slate-600 font-mono uppercase tracking-wider mb-2">Ask AI about your infrastructure</p>
                  {QUERIES.map((q) => (
                    <button
                      key={q.id}
                      onClick={() => handleQuery(q)}
                      className="flex w-full items-center gap-2.5 rounded-lg border border-slate-800 bg-slate-900/60 p-2.5 text-left hover:border-violet-500/30 hover:bg-violet-500/[0.02] transition-all group"
                    >
                      <svg className="h-4 w-4 text-slate-600 group-hover:text-violet-400 transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={q.icon} />
                      </svg>
                      <span className="text-[11px] text-slate-400 group-hover:text-white transition-colors">{q.label}</span>
                    </button>
                  ))}
                </>
              )}

              {loading && (
                <div className="flex flex-col items-center py-8">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}>
                    <svg className="h-6 w-6 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
                    </svg>
                  </motion.div>
                  <p className="text-[10px] text-slate-600 mt-3 font-mono">AI analyzing...</p>
                </div>
              )}

              {response && !loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className={`rounded px-1.5 py-0.5 text-[8px] font-bold ${
                      response.priority === 'critical' ? 'bg-red-500/20 text-red-400' :
                      response.priority === 'high' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-cyan-500/20 text-cyan-400'
                    }`}>{response.priority.toUpperCase()}</span>
                    <span className="text-[11px] font-semibold text-white">{response.title}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed">{response.body}</p>
                  <div className="space-y-1 pt-1 border-t border-slate-800">
                    {response.insights.map((insight, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <svg className="h-3 w-3 text-violet-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-[9px] text-slate-500">{insight}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={reset}
                    className="flex items-center gap-1.5 text-[9px] text-violet-400 hover:text-violet-300 transition-colors"
                  >
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                    </svg>
                    Ask another question
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
