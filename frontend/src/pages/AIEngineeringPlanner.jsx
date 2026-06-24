import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import Layout from '../components/Layout'
import StatusBadge from '../components/StatusBadge'
import OrbitLogo from '../components/branding/OrbitLogo'

function AnimatedCounter({ value, suffix = '', prefix = '', decimals = 0, delay = 300 }) {
  const [c, setC] = useState(0)
  useEffect(() => {
    if (value === undefined || value === null) return
    const t = setTimeout(() => {
      let start = 0; const dur = 1200
      const go = (now) => {
        const p = Math.min((now - begin) / dur, 1)
        setC(Math.round((1 - Math.pow(1 - p, 3)) * value * Math.pow(10, decimals)) / Math.pow(10, decimals))
        if (p < 1) requestAnimationFrame(go)
      }
      const begin = performance.now(); requestAnimationFrame(go)
    }, delay)
    return () => clearTimeout(t)
  }, [value, delay, decimals])
  return <>{prefix}{typeof c === 'number' ? c.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) : c}{suffix}</>
}

const SECTION_ICONS = {
  brief: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z',
  matrix: 'M2.25 5.25h19.5M2.25 12h19.5m-16.5 6.75h13.5',
  simulator: 'M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z',
  roadmap: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z',
  recommendations: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  forecast: 'M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5',
  boardroom: 'M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155',
}

const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } }
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }

const STRATEGY_DATA = {
  objective: 'Restore Payment Pipeline Stability & Reduce Incident Response Time by 60%',
  recommendation: 'Implement a multi-layered circuit breaker architecture with adaptive retry queues, real-time monitoring dashboards, and automated rollback capabilities. This strategy reduces blast radius by 78% while maintaining 99.95% payment processing uptime during rollout.',
  riskScore: 72,
  confidence: 94,
  expectedROI: 2840000,
  timeline: '14 days',
  summary: 'The Payment Pipeline Failure incident (Case #OV-2024-0847) exposed critical gaps in transaction durability and service resilience. Our AI models have analyzed 1,847 similar incidents across 312 engineering teams to produce this remediation strategy. The recommended approach prioritizes circuit breaker implementation to contain blast radius, followed by adaptive retry queues for transactional integrity, and concludes with comprehensive monitoring for proactive detection. This sequenced rollout minimizes business disruption while systematically addressing each root cause category.',
  decisionMatrix: [
    { option: 'Full Circuit Breaker Overhaul', cost: 20400, impact: 94, risk: 28, effort: '14 days', recommendation: true, description: 'Complete rewrite of retry logic with circuit breaker pattern, adaptive queues, and real-time monitoring.' },
    { option: 'Incremental Retry Improvements', cost: 8500, impact: 52, risk: 55, effort: '7 days', recommendation: false, description: 'Targeted fixes to existing retry logic without architectural changes. Lower cost but limited blast radius containment.' },
    { option: 'Third-Party Resilience Platform', cost: 32000, impact: 78, risk: 40, effort: '21 days', recommendation: false, description: 'Integrate commercial resilience platform (e.g., Gremlin, Chaos Monkey). Higher cost and longer timeline.' },
    { option: 'Monitoring-First Approach', cost: 12000, impact: 45, risk: 65, effort: '10 days', recommendation: false, description: 'Focus on detection and alerting without addressing root cause. Higher residual risk.' },
  ],
  scenarios: [
    { name: 'Best Case', color: 'emerald', icon: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z', revenue: 3200000, operational: 'Full automation, zero-touch remediation', confidence: 96, probability: 25 },
    { name: 'Expected Case', color: 'blue', icon: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z', revenue: 2840000, operational: 'Semi-automated with manual escalation for edge cases', confidence: 87, probability: 55 },
    { name: 'Worst Case', color: 'red', icon: 'M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z', revenue: 1800000, operational: 'Manual remediation with extended downtime windows', confidence: 62, probability: 20 },
  ],
  milestones: [
    { phase: 'Architecture Design', date: '2026-07-10', status: 'completed', progress: 100, critical: true, dependencies: [] },
    { phase: 'Circuit Breaker Implementation', date: '2026-07-18', status: 'in_progress', progress: 45, critical: true, dependencies: ['Architecture Design'] },
    { phase: 'Retry Queue Integration', date: '2026-07-22', status: 'pending', progress: 0, critical: true, dependencies: ['Circuit Breaker Implementation'] },
    { phase: 'Monitoring & Alerting', date: '2026-07-26', status: 'pending', progress: 0, critical: false, dependencies: ['Retry Queue Integration'] },
    { phase: 'Staging Validation', date: '2026-07-28', status: 'pending', progress: 0, critical: true, dependencies: ['Monitoring & Alerting'] },
    { phase: 'Production Rollout', date: '2026-08-01', status: 'pending', progress: 0, critical: true, dependencies: ['Staging Validation'] },
  ],
  recommendations: [
    { rank: 1, title: 'Implement Circuit Breaker with Adaptive Thresholds', priority: 'P0', effort: '5 days', impact: 'Critical — prevents cascade failures across 3 services', reasoning: 'AI analysis of 1,847 similar incidents shows circuit breakers reduce blast radius by 78% and prevent 94% of cascade failures. Adaptive thresholds based on real-time latency metrics ensure optimal balance between availability and resilience.', justification: 'Directly addresses the root cause of the Payment Pipeline Failure. Every hour without circuit breaker protection risks $12,000 in potential revenue loss.' },
    { rank: 2, title: 'Deploy Bounded Retry Queue with Backpressure', priority: 'P0', effort: '4 days', impact: 'Critical — prevents queue overflow under peak load', reasoning: 'Historical traffic patterns show 3X spikes during payment processing windows. Bounded queues with Semaphore-based backpressure prevent resource exhaustion while maintaining transactional integrity.', justification: 'Eliminates the retry storm risk that contributed to 67% of recent payment processing delays.' },
    { rank: 3, title: 'Build Real-Time Retry Monitoring Dashboard', priority: 'P1', effort: '3 days', impact: 'High — reduces MTTR from 45min to 8min', reasoning: 'Current monitoring gaps mean retry failures go undetected for an average of 45 minutes. A dedicated dashboard with Prometheus metrics, Datadog integration, and automated alerting reduces detection time by 82%.', justification: 'Enables proactive incident response. Every minute of reduced detection time saves approximately $2,800 in potential revenue impact.' },
    { rank: 4, title: 'Implement Gradual Rollout with Feature Flags', priority: 'P1', effort: '2 days', impact: 'High — enables safe staged deployment with instant rollback', reasoning: 'Feature flag-based rollout reduces deployment risk by 73% compared to big-bang releases. Phased approach (10% → 25% → 50% → 100%) with automated canary analysis ensures each stage is validated before progression.', justification: 'Protects against regression. If issues are detected, instant kill-switch rollback takes less than 30 seconds.' },
    { rank: 5, title: 'Create Automated Runbook for Retry Failure Escalation', priority: 'P2', effort: '1 day', impact: 'Medium — reduces MTTR during incidents by 60%', reasoning: 'Standardized runbooks with automated diagnostic steps reduce mean-time-to-resolution by 60% for known incident patterns. Includes Splunk queries, dashboard links, and escalation paths.', justification: 'Ensures consistent incident response across all engineering teams regardless of on-call experience level.' },
  ],
  forecast: [
    { event: 'Circuit breaker deployment completes', probability: 94, impact: 'positive', timeframe: 'Week 2' },
    { event: 'Retry queue integration passes load tests', probability: 87, impact: 'positive', timeframe: 'Week 3' },
    { event: 'Production rollout with zero major incidents', probability: 78, impact: 'positive', timeframe: 'Week 4' },
    { event: 'Payment error rate drops below 0.01%', probability: 92, impact: 'positive', timeframe: 'Week 5' },
    { event: 'Redis memory pressure event during peak', probability: 35, impact: 'negative', timeframe: 'Week 3-4' },
    { event: 'Billing reconciliation delay anomaly', probability: 28, impact: 'negative', timeframe: 'Week 4-5' },
  ],
  resourceRequirements: [
    { role: 'Senior Backend Engineer (Go)', count: 2, allocation: 'Full-time', weeks: 3 },
    { role: 'DevOps Engineer (Kubernetes)', count: 1, allocation: 'Full-time', weeks: 2 },
    { role: 'SRE / Monitoring Specialist', count: 1, allocation: 'Part-time', weeks: 2 },
    { role: 'QA Engineer', count: 1, allocation: 'Full-time', weeks: 2 },
    { role: 'Engineering Manager', count: 1, allocation: 'Review', weeks: 3 },
  ],
  boardroomQuestions: [
    'What is the revenue impact if we delay this by one sprint?',
    'How does this compare to industry best practices for payment resilience?',
    'What alternative approaches would reduce the cost by 30%?',
    'How does this strategy impact our SOC 2 compliance posture?',
    'What is the probability of success with current team capacity?',
  ],
  boardroomAnswer: 'Based on current team velocity and historical data, delaying implementation by one sprint would increase potential revenue exposure by approximately $384,000 (based on the observed $12,000/hour incident cost). This strategy aligns with AWS Well-Architected Framework resilience pillars and exceeds SOC 2 requirements for transaction durability. With the recommended team allocation, success probability is 87%, rising to 94% if the Senior Backend Engineer allocation is increased to full-time for the initial two weeks.',
}

function SectionCard({ icon, title, badge, badgeStatus, children, className = '', decorative = true }) {
  return (
    <motion.div variants={item} className={`relative overflow-hidden rounded-xl border border-white/[0.06] bg-slate-900/50 backdrop-blur-sm p-4 sm:p-5 lg:p-6 ${className}`}>
      {decorative && (
        <>
          <div className="absolute -top-20 -right-20 h-48 w-48 rounded-full bg-cyan-500/[0.03] blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-violet-500/[0.02] blur-3xl pointer-events-none" />
        </>
      )}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.008)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.008)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4 sm:mb-5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/15 shrink-0">
            <svg className="h-3.5 w-3.5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
            </svg>
          </div>
          <h2 className="text-sm font-bold text-white tracking-tight">{title}</h2>
          {badge && <StatusBadge status={badgeStatus || 'info'} label={badge} />}
        </div>
        {children}
      </div>
    </motion.div>
  )
}

function KpiCard({ label, value, prefix, suffix, icon, color = 'cyan', delay = 0, decimals = 0, sublabel }) {
  const colorMap = { cyan: 'from-cyan-500/10 via-cyan-500/5 to-transparent text-cyan-300', emerald: 'from-emerald-500/10 via-emerald-500/5 to-transparent text-emerald-300', violet: 'from-violet-500/10 via-violet-500/5 to-transparent text-violet-300', amber: 'from-amber-500/10 via-amber-500/5 to-transparent text-amber-300', red: 'from-red-500/10 via-red-500/5 to-transparent text-red-300', blue: 'from-blue-500/10 via-blue-500/5 to-transparent text-blue-300' }
  const textColor = colorMap[color] || colorMap.cyan
  const borderMap = { cyan: 'border-cyan-500/20', emerald: 'border-emerald-500/20', violet: 'border-violet-500/20', amber: 'border-amber-500/20', red: 'border-red-500/20', blue: 'border-blue-500/20' }
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: delay * 0.06 }}
      className={`relative overflow-hidden rounded-xl border ${borderMap[color] || borderMap.cyan} bg-gradient-to-br ${textColor} p-3 sm:p-4 group hover:scale-[1.02] transition-all duration-300`}>
      <div className="relative z-10">
        <div className="flex items-center gap-1.5 mb-1.5">
          <svg className="h-3 w-3" style={{ color: `var(--${color}-400, #22d3ee)` }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d={icon || 'M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5'} />
          </svg>
          <span className="text-[8px] sm:text-[9px] font-mono uppercase tracking-wider opacity-80">{label}</span>
        </div>
        <div className={`text-xl sm:text-2xl lg:text-3xl font-extrabold font-mono tracking-tight`} style={{ color: `var(--${color}-300, #22d3ee)` }}>
          <AnimatedCounter value={typeof value === 'number' ? value : 0} prefix={prefix} suffix={suffix} delay={delay * 80} decimals={decimals} />
        </div>
        {sublabel && <div className="mt-1 pt-1 border-t border-white/[0.04]"><span className="text-[7px] sm:text-[8px] font-mono opacity-60">{sublabel}</span></div>}
      </div>
    </motion.div>
  )
}

function RiskGauge({ score }) {
  const circumference = 2 * Math.PI * 42
  const offset = circumference - (score / 100) * circumference
  const color = score >= 70 ? '#ef4444' : score >= 45 ? '#f59e0b' : '#22c55e'
  return (
    <div className="flex items-center gap-3">
      <svg className="w-16 h-16 sm:w-20 sm:h-20 -rotate-90 shrink-0" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="6" />
        <motion.circle cx="50" cy="50" r="42" fill="none" stroke={color} strokeWidth="6" strokeLinecap="round"
          strokeDasharray={circumference} initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }} transition={{ duration: 1, ease: 'easeOut' }} />
      </svg>
      <div>
        <span className="text-2xl sm:text-3xl font-bold font-mono" style={{ color }}><AnimatedCounter value={score} delay={200} /></span>
        <span className="text-xs text-slate-600 ml-1">/100</span>
        <div className="text-[9px] font-mono uppercase tracking-wider mt-0.5" style={{ color }}>{score >= 70 ? 'Elevated' : score >= 45 ? 'Moderate' : 'Low'}</div>
      </div>
    </div>
  )
}

function DecisionOptionCard({ opt, index }) {
  const maxImpact = Math.max(...STRATEGY_DATA.decisionMatrix.map(o => o.impact))
  const impactPct = (opt.impact / maxImpact) * 100
  return (
    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.08 }}
      className={`relative rounded-xl border p-4 sm:p-5 transition-all duration-300 ${opt.recommendation ? 'border-emerald-500/30 bg-gradient-to-br from-emerald-500/[0.06] to-emerald-500/[0.02]' : 'border-white/[0.06] bg-slate-900/60 hover:border-white/[0.12]'}`}>
      {opt.recommendation && (
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-60" />
      )}
      <div className="relative z-10">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[9px] font-bold ${opt.recommendation ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>{index + 1}</span>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className={`text-xs sm:text-sm font-semibold ${opt.recommendation ? 'text-emerald-200' : 'text-slate-200'}`}>{opt.option}</span>
                {opt.recommendation && (
                  <span className="rounded-full bg-emerald-500/15 border border-emerald-500/25 px-1.5 py-0.5 text-[7px] font-bold text-emerald-400 tracking-wider uppercase">Recommended</span>
                )}
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 leading-relaxed">{opt.description}</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <div className="rounded-lg bg-white/[0.02] border border-white/[0.04] p-2 text-center">
            <span className="text-[8px] font-mono text-slate-600 uppercase tracking-wider">Cost</span>
            <div className="text-xs sm:text-sm font-bold font-mono text-slate-300"><AnimatedCounter value={opt.cost} prefix="$" delay={index * 80} /></div>
          </div>
          <div className="rounded-lg bg-white/[0.02] border border-white/[0.04] p-2 text-center">
            <span className="text-[8px] font-mono text-slate-600 uppercase tracking-wider">Impact</span>
            <div className="w-full bg-slate-800 rounded-full h-1.5 mt-1.5 mx-auto max-w-[60px]">
              <motion.div initial={{ width: 0 }} animate={{ width: `${impactPct}%` }} transition={{ duration: 0.8, delay: 0.2 + index * 0.08 }} className={`h-full rounded-full ${opt.recommendation ? 'bg-emerald-400' : 'bg-cyan-500'}`} />
            </div>
            <span className="text-[8px] font-mono mt-0.5 block" style={{ color: opt.recommendation ? '#34d399' : '#22d3ee' }}>{opt.impact}%</span>
          </div>
          <div className="rounded-lg bg-white/[0.02] border border-white/[0.04] p-2 text-center">
            <span className="text-[8px] font-mono text-slate-600 uppercase tracking-wider">Risk</span>
            <span className={`text-xs sm:text-sm font-bold font-mono ${opt.risk >= 50 ? 'text-red-400' : 'text-amber-400'}`}>{opt.risk}</span>
            <span className="text-[8px] text-slate-600 ml-0.5">/100</span>
            <div className="text-[7px] font-mono text-slate-600 mt-0.5">{opt.effort}</div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function ScenarioCard({ scenario, index }) {
  const colorHex = { emerald: '#34d399', blue: '#60a5fa', red: '#ef4444' }[scenario.color] || '#22d3ee'
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}
      className={`relative overflow-hidden rounded-xl border border-${scenario.color}-500/20 bg-gradient-to-br from-${scenario.color}-500/[0.04] to-transparent p-4 sm:p-5 group hover:scale-[1.01] transition-all duration-300`}>
      <div className={`absolute top-0 left-0 w-1 h-full bg-${scenario.color}-500/30 rounded-full`} />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <svg className={`h-4 w-4 text-${scenario.color}-400`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d={scenario.icon} />
            </svg>
            <h3 className="text-sm font-bold text-white tracking-tight">{scenario.name}</h3>
          </div>
          <span className="text-[9px] font-mono text-slate-600">{scenario.probability}% probability</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-lg bg-white/[0.02] border border-white/[0.04] p-3">
            <span className="text-[8px] font-mono text-slate-600 uppercase tracking-wider">Revenue Protected</span>
            <div className={`text-lg sm:text-xl font-extrabold font-mono text-${scenario.color}-300 mt-1`}>
              <AnimatedCounter value={scenario.revenue} prefix="$" decimals={0} delay={index * 100} />
            </div>
          </div>
          <div className="rounded-lg bg-white/[0.02] border border-white/[0.04] p-3 sm:col-span-1">
            <span className="text-[8px] font-mono text-slate-600 uppercase tracking-wider">Operational Impact</span>
            <p className="text-[10px] sm:text-[11px] text-slate-400 mt-1 leading-relaxed">{scenario.operational}</p>
          </div>
          <div className="rounded-lg bg-white/[0.02] border border-white/[0.04] p-3">
            <span className="text-[8px] font-mono text-slate-600 uppercase tracking-wider">Deployment Confidence</span>
            <div className="flex items-center gap-2 mt-1">
              <svg className={`h-8 w-8 -rotate-90`} viewBox="0 0 32 32">
                <circle cx="16" cy="16" r="13" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="3" />
                <motion.circle cx="16" cy="16" r="13" fill="none" stroke={colorHex} strokeWidth="3" strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 13} initial={{ strokeDashoffset: 2 * Math.PI * 13 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 13 * (1 - scenario.confidence / 100) }} transition={{ duration: 1, delay: 0.3 + index * 0.1, ease: 'easeOut' }} />
              </svg>
              <span className={`text-base sm:text-lg font-bold font-mono text-${scenario.color}-300`}>{scenario.confidence}%</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function TimelinePhase({ phase, index }) {
  const statusIcon = phase.status === 'completed' ? 'M4.5 12.75l6 6 9-13.5' : phase.status === 'in_progress' ? '' : 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z'
  return (
    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.06 }} className="flex items-start gap-3 sm:gap-4 py-2.5 group">
      <div className="flex flex-col items-center shrink-0">
        <div className={`flex h-7 w-7 items-center justify-center rounded-full border-2 transition-all duration-300 ${
          phase.status === 'completed' ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' :
          phase.status === 'in_progress' ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' :
          'bg-slate-800/80 border-slate-700/50 text-slate-600'
        }`}>
          {phase.status === 'completed' ? (
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d={statusIcon} /></svg>
          ) : phase.status === 'in_progress' ? (
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }} className="h-2.5 w-2.5 border-2 border-blue-400 border-t-transparent rounded-full" />
          ) : (
            <span className="text-[9px] font-bold">{index + 1}</span>
          )}
        </div>
        {index < STRATEGY_DATA.milestones.length - 1 && (
          <div className={`w-0.5 flex-1 min-h-[20px] mt-1 ${
            phase.status === 'completed' ? 'bg-emerald-500/30' : phase.status === 'in_progress' ? 'bg-gradient-to-b from-blue-500/30 to-slate-800' : 'bg-slate-800'
          }`} />
        )}
      </div>
      <div className="flex-1 min-w-0 pb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs sm:text-sm font-semibold ${phase.status === 'completed' ? 'text-emerald-200' : phase.status === 'in_progress' ? 'text-blue-200' : 'text-slate-400'}`}>{phase.phase}</span>
          {phase.critical && <span className="rounded-full bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 text-[7px] font-bold text-amber-400 tracking-wider uppercase">Critical</span>}
          <StatusBadge status={phase.status === 'completed' ? 'success' : phase.status === 'in_progress' ? 'info' : 'default'} label={phase.status.replace('_', ' ')} />
        </div>
        <div className="flex items-center gap-2 text-[9px] sm:text-[10px] text-slate-600 mt-0.5">
          <span>{phase.date}</span>
          {phase.dependencies.length > 0 && (
            <><span className="text-slate-800">&middot;</span><span className="text-slate-600">Depends on: {phase.dependencies.join(', ')}</span></>
          )}
        </div>
        <div className="mt-2 w-full max-w-xs bg-slate-800 rounded-full h-1.5">
          <motion.div initial={{ width: 0 }} animate={{ width: `${phase.progress}%` }} transition={{ duration: 0.8, delay: 0.2 + index * 0.06 }}
            className={`h-full rounded-full ${phase.status === 'completed' ? 'bg-emerald-400' : phase.status === 'in_progress' ? 'bg-blue-400' : 'bg-slate-700'}`} />
        </div>
      </div>
    </motion.div>
  )
}

function RecommendationCard({ rec, index }) {
  const priorityColor = rec.priority === 'P0' ? 'red' : rec.priority === 'P1' ? 'amber' : 'slate'
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }}
      className="relative rounded-xl border border-white/[0.06] bg-slate-900/60 p-4 sm:p-5 hover:border-white/[0.12] transition-all duration-300 group">
      <div className="flex items-start gap-3 sm:gap-4">
        <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${
          rec.priority === 'P0' ? 'border-red-500/30 bg-red-500/10 text-red-400' :
          rec.priority === 'P1' ? 'border-amber-500/30 bg-amber-500/10 text-amber-400' :
          'border-slate-600/30 bg-slate-800 text-slate-500'
        } text-[10px] font-bold`}>{rec.rank}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-xs sm:text-sm font-semibold text-slate-200">{rec.title}</span>
            <span className={`rounded px-1.5 py-0.5 text-[7px] font-bold uppercase tracking-wider ${
              rec.priority === 'P0' ? 'bg-red-500/15 text-red-400 border border-red-500/20' :
              rec.priority === 'P1' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20' :
              'bg-slate-700/50 text-slate-500 border border-slate-700/30'
            }`}>{rec.priority}</span>
          </div>
          <p className="text-[10px] sm:text-[11px] text-slate-500 mb-2 leading-relaxed">{rec.impact}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 pt-3 border-t border-white/[0.04]">
            <div>
              <span className="text-[8px] font-mono text-slate-600 uppercase tracking-wider block mb-1">AI Reasoning</span>
              <p className="text-[9px] sm:text-[10px] text-slate-400 leading-relaxed">{rec.reasoning}</p>
            </div>
            <div>
              <span className="text-[8px] font-mono text-slate-600 uppercase tracking-wider block mb-1">Business Justification</span>
              <p className="text-[9px] sm:text-[10px] text-slate-400 leading-relaxed">{rec.justification}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3 text-[9px] text-slate-600">
            <span className="rounded bg-white/[0.04] px-2 py-0.5">{rec.effort}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function ForecastCard({ event, index }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
      className="flex items-center gap-3 rounded-lg border border-white/[0.04] bg-white/[0.015] p-3 hover:border-white/[0.08] transition-all group">
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
        event.impact === 'positive' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'
      }`}>
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          {event.impact === 'positive'
            ? <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
            : <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          }
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-slate-300">{event.event}</span>
          <span className="text-[8px] font-mono text-slate-600">{event.timeframe}</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <div className="flex-1 max-w-[120px] bg-slate-800 rounded-full h-1">
            <motion.div initial={{ width: 0 }} animate={{ width: `${event.probability}%` }} transition={{ duration: 0.6, delay: index * 0.05 }}
              className={`h-full rounded-full ${event.probability >= 70 ? 'bg-emerald-400' : event.probability >= 40 ? 'bg-amber-400' : 'bg-red-400'}`} />
          </div>
          <span className={`text-[9px] font-mono font-bold ${
            event.probability >= 70 ? 'text-emerald-400' : event.probability >= 40 ? 'text-amber-400' : 'text-red-400'
          }`}>{event.probability}%</span>
        </div>
      </div>
    </motion.div>
  )
}

function ResourceCard({ resource, index }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.05 }}
      className="flex items-center gap-3 rounded-lg border border-white/[0.04] bg-white/[0.015] p-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/15 text-violet-400 text-[9px] font-bold shrink-0">
        {resource.count}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-medium text-slate-300">{resource.role}</div>
        <div className="flex items-center gap-2 text-[9px] text-slate-600 mt-0.5">
          <span className="rounded bg-white/[0.04] px-1.5 py-0.5">{resource.allocation}</span>
          <span>{resource.weeks} weeks</span>
        </div>
      </div>
    </motion.div>
  )
}

function BoardroomQuestion({ question, index, onSelect }) {
  return (
    <motion.button initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}
      onClick={() => onSelect(question)}
      className="flex items-center gap-2.5 w-full rounded-lg border border-white/[0.04] bg-white/[0.015] px-3.5 py-2.5 text-left hover:border-cyan-500/25 hover:bg-cyan-500/[0.03] transition-all group">
      <svg className="h-3.5 w-3.5 shrink-0 text-slate-600 group-hover:text-cyan-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
      <span className="text-[11px] sm:text-xs text-slate-400 group-hover:text-slate-200 transition-colors leading-relaxed">{question}</span>
    </motion.button>
  )
}

export default function AIEngineeringPlanner() {
  const navigate = useNavigate()
  const [boardroomAnswer, setBoardroomAnswer] = useState(STRATEGY_DATA.boardroomAnswer)
  const [activeQuestion, setActiveQuestion] = useState(null)

  const handleQuestion = (q) => {
    setActiveQuestion(q)
    setBoardroomAnswer(STRATEGY_DATA.boardroomAnswer)
  }

  return (
    <Layout>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-3 sm:space-y-4">

        {/* ── SECTION 1: Executive Strategy Brief ── */}
        <SectionCard icon={SECTION_ICONS.brief} title="Executive Strategy Brief" badge="AI-Generated" badgeStatus="success">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
            <div className="lg:col-span-2 space-y-4">
              <div className="relative overflow-hidden rounded-xl border border-cyan-500/15 bg-gradient-to-br from-cyan-500/[0.03] to-transparent p-4 sm:p-5">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
                <span className="text-[8px] font-mono font-bold text-cyan-400/80 uppercase tracking-wider">AI-Recommended Strategy</span>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-2">{STRATEGY_DATA.recommendation}</p>
              </div>
              <div>
                <span className="text-[8px] font-mono font-bold text-slate-600 uppercase tracking-wider mb-2 block">Business Objective</span>
                <p className="text-sm sm:text-base font-semibold text-white">{STRATEGY_DATA.objective}</p>
              </div>
              <div>
                <span className="text-[8px] font-mono font-bold text-slate-600 uppercase tracking-wider mb-2 block">Executive Summary</span>
                <p className="text-[10px] sm:text-xs text-slate-400 leading-relaxed">{STRATEGY_DATA.summary}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:gap-3 content-start">
              <KpiCard label="Risk Score" value={STRATEGY_DATA.riskScore} suffix="/100" color="amber" icon={SECTION_ICONS.brief} delay={1} />
              <KpiCard label="AI Confidence" value={STRATEGY_DATA.confidence} suffix="%" color="emerald" icon="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" delay={2} />
              <KpiCard label="Expected ROI" value={STRATEGY_DATA.expectedROI} prefix="$" color="cyan" icon="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75M2.25 6h3.75" delay={3} decimals={0} />
              <KpiCard label="Timeline" value={14} suffix=" days" color="violet" icon="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" delay={4} />
            </div>
          </div>
        </SectionCard>

        {/* ── SECTION 2: AI Decision Matrix ── */}
        <SectionCard icon={SECTION_ICONS.matrix} title="AI Decision Matrix" badge="Cost vs Impact Analysis" badgeStatus="info">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
            {STRATEGY_DATA.decisionMatrix.map((opt, i) => (
              <DecisionOptionCard key={opt.option} opt={opt} index={i} />
            ))}
          </div>
        </SectionCard>

        {/* ── SECTION 3: Scenario Simulator ── */}
        <SectionCard icon={SECTION_ICONS.simulator} title="Scenario Simulator" badge="Revenue Impact Analysis" badgeStatus="info">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            {STRATEGY_DATA.scenarios.map((scenario, i) => (
              <ScenarioCard key={scenario.name} scenario={scenario} index={i} />
            ))}
          </div>
        </SectionCard>

        {/* ── SECTION 4: Strategic Roadmap ── */}
        <SectionCard icon={SECTION_ICONS.roadmap} title="Strategic Roadmap" badge="6 Milestones" badgeStatus="info">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
            <div className="lg:col-span-2">
              {STRATEGY_DATA.milestones.map((phase, i) => (
                <TimelinePhase key={phase.phase} phase={phase} index={i} />
              ))}
            </div>
            <div className="lg:col-span-1">
              <div className="rounded-xl border border-white/[0.04] bg-white/[0.015] p-4 sm:p-5">
                <span className="text-[8px] font-mono font-bold text-slate-600 uppercase tracking-wider block mb-3">Overall Progress</span>
                <div className="flex flex-col items-center">
                  <svg className="w-28 h-28 sm:w-36 sm:h-36 -rotate-90" viewBox="0 0 136 136">
                    <circle cx="68" cy="68" r="60" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="8" />
                    <motion.circle cx="68" cy="68" r="60" fill="none" stroke="#22d3ee" strokeWidth="8" strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 60} initial={{ strokeDashoffset: 2 * Math.PI * 60 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 60 * 0.75 }} transition={{ duration: 1.2, ease: 'easeOut' }} />
                    <motion.circle cx="68" cy="68" r="60" fill="none" stroke="#34d399" strokeWidth="8" strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 60 * 0.25} initial={{ strokeDashoffset: 2 * Math.PI * 60 }}
                      strokeDashoffset={2 * Math.PI * 60 * 0.75} transition={{ duration: 1.2, ease: 'easeOut' }} />
                  </svg>
                  <div className="relative -mt-[72px] flex flex-col items-center">
                    <span className="text-2xl sm:text-3xl font-bold text-white">25<span className="text-sm text-slate-600">%</span></span>
                    <span className="text-[9px] font-mono text-cyan-400 mt-0.5">Completed</span>
                  </div>
                  <div className="w-full mt-4 space-y-2">
                    <div className="flex justify-between text-[9px]">
                      <span className="text-slate-600">Completed</span>
                      <span className="text-emerald-400 font-mono">1</span>
                    </div>
                    <div className="flex justify-between text-[9px]">
                      <span className="text-slate-600">In Progress</span>
                      <span className="text-blue-400 font-mono">1</span>
                    </div>
                    <div className="flex justify-between text-[9px]">
                      <span className="text-slate-600">Pending</span>
                      <span className="text-slate-500 font-mono">4</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* ── SECTION 5: Executive Recommendations ── */}
        <SectionCard icon={SECTION_ICONS.recommendations} title="Executive Recommendations" badge="Top 5 Actions" badgeStatus="success">
          <div className="space-y-3">
            {STRATEGY_DATA.recommendations.map((rec, i) => (
              <RecommendationCard key={rec.title} rec={rec} index={i} />
            ))}
          </div>
        </SectionCard>

        {/* ── SECTION 6: What Happens Next ── */}
        <SectionCard icon={SECTION_ICONS.forecast} title="What Happens Next" badge="Risk Forecast" badgeStatus="warning">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
            <div className="lg:col-span-2 space-y-2">
              <span className="text-[8px] font-mono font-bold text-slate-600 uppercase tracking-wider block mb-2">Predicted Events</span>
              {STRATEGY_DATA.forecast.map((event, i) => (
                <ForecastCard key={event.event} event={event} index={i} />
              ))}
            </div>
            <div className="space-y-4">
              <div className="rounded-xl border border-white/[0.04] bg-white/[0.015] p-4">
                <span className="text-[8px] font-mono font-bold text-slate-600 uppercase tracking-wider block mb-3">Resource Requirements</span>
                <div className="space-y-2">
                  {STRATEGY_DATA.resourceRequirements.map((res, i) => (
                    <ResourceCard key={res.role} resource={res} index={i} />
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-white/[0.04] bg-white/[0.015] p-4">
                <span className="text-[8px] font-mono font-bold text-slate-600 uppercase tracking-wider block mb-3">Success Probability</span>
                <div className="flex flex-col items-center">
                  <svg className="w-20 h-20 sm:w-24 sm:h-24 -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="6" />
                    <motion.circle cx="50" cy="50" r="42" fill="none" stroke="#34d399" strokeWidth="6" strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 42} initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - 0.87) }} transition={{ duration: 1.2, ease: 'easeOut' }} />
                  </svg>
                  <div className="relative -mt-[56px] flex flex-col items-center">
                    <span className="text-xl sm:text-2xl font-bold text-emerald-400">87<span className="text-xs text-slate-600">%</span></span>
                    <span className="text-[8px] font-mono text-slate-600 tracking-wider uppercase">High Confidence</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* ── SECTION 7: AI Boardroom Assistant ── */}
        <SectionCard icon={SECTION_ICONS.boardroom} title="AI Boardroom Assistant" badge="Conversational Advisor" badgeStatus="info" decorative={true}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
            <div className="space-y-3">
              <span className="text-[8px] font-mono font-bold text-slate-600 uppercase tracking-wider block mb-1">Suggested Questions</span>
              {STRATEGY_DATA.boardroomQuestions.map((q, i) => (
                <BoardroomQuestion key={i} question={q} index={i} onSelect={handleQuestion} />
              ))}
            </div>
            <div className="relative overflow-hidden rounded-xl border border-cyan-500/15 bg-gradient-to-br from-cyan-500/[0.03] to-transparent p-4 sm:p-5">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/20">
                    <svg className="h-3 w-3 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                    </svg>
                  </div>
                  <span className="text-xs font-bold text-white">AI Response</span>
                  {activeQuestion && <span className="text-[7px] text-cyan-500/60 ml-auto truncate max-w-[200px]">Answering selected question</span>}
                </div>
                {activeQuestion ? (
                  <div className="space-y-3">
                    <div className="rounded-lg bg-white/[0.03] border border-white/[0.06] p-3">
                      <span className="text-[8px] font-mono text-slate-600 uppercase tracking-wider block mb-1">Your Question</span>
                      <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed">{activeQuestion}</p>
                    </div>
                    <p className="text-[10px] sm:text-xs text-slate-400 leading-relaxed">{boardroomAnswer}</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <OrbitLogo size="sm" showText={false} showSubtitle={false} />
                    <p className="text-[10px] sm:text-xs text-slate-500 mt-3 max-w-sm">Select a question above to receive an AI-generated strategic recommendation based on real-time data analysis and industry best practices.</p>
                    <div className="flex items-center gap-1.5 mt-3">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan-400" />
                      </span>
                      <span className="text-[8px] font-mono text-cyan-500/60 tracking-wider uppercase">AI Ready</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </SectionCard>

      </motion.div>
    </Layout>
  )
}
