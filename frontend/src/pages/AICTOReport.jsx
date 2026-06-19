import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Layout from '../components/Layout'
import StatCard from '../components/StatCard'
import StatusBadge from '../components/StatusBadge'

const reportData = {
  feature: 'Add payment retry support',
  verdict: { shouldBuild: true, confidence: 87, summary: 'Build — Strong ROI with acceptable risk. Estimated 320% ROI within 30 days of deployment. Mitigation investment of $14K offsets potential $288K/month incident cost.' },
  businessImpact: { revenueAtRisk: 12000, customerImpact: 'All payment flows', slaViolation: '45 min', regulatory: 'PCI compliance', businessScore: 72 },
  engineeringCost: { hours: 136, engineers: 4, sprints: 3, storyPoints: 34, costUSD: 14000, costScore: 65 },
  riskLevel: { score: 68, level: 'Moderate', criticalRisks: 1, highRisks: 2, mediumRisks: 1 },
  roi: { percentage: 320, breakevenHours: 3.5, monthlySavings: 288000, investment: 14000, projectionMonths: 12 },
  deploymentWindow: { earliest: 'Jul 8', latest: 'Jul 22', recommended: 'Jul 15', confidence: 'High' },
  recommendation: { decision: 'BUILD', reasoning: 'Feature delivers critical payment reliability improvements. Mitigation plan reduces all identified risks to acceptable levels. ROI of 320% within 30 days validates investment.', teamReadiness: 'Payments team at 85% capacity — recommend adding 1 contractor for Sprint 2.', alternative: 'Defer billing integration (P2 risk) to separate release if timeline pressure requires scope reduction.' },
  teamReadiness: [
    { team: 'Payments', readiness: 72, load: 85, confidence: 'On Track' },
    { team: 'Billing', readiness: 65, load: 60, confidence: 'Needs Support' },
    { team: 'Platform', readiness: 88, load: 30, confidence: 'Ready' },
  ],
}

function AnimatedScoreBar({ value, label, sublabel, color = 'bg-brand', delay = 0 }) {
  const [w, setW] = useState(0)
  useEffect(() => { const t = setTimeout(() => setW(value), 300 + delay); return () => clearTimeout(t) }, [value, delay])
  return (
    <div className="group">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">{label}</span>
        <span className="text-[10px] font-semibold text-white">{sublabel || `${value}%`}</span>
      </div>
      <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${w}%` }} transition={{ duration: 0.8, ease: 'easeOut' }} className={`h-full rounded-full ${color}`} />
      </div>
    </div>
  )
}

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } }
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }

export default function AICTOReport() {
  const data = reportData

  return (
    <Layout>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        {/* Header */}
        <motion.div variants={item} className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20">
                <svg className="h-3 w-3 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" /></svg>
              </div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl text-white">AI CTO Executive Report</h1>
            </div>
            <p className="text-sm text-slate-500">Strategic decision analysis with business impact, engineering cost, ROI projection, and deployment recommendation</p>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status="success" label="Q3 2026" />
            <button className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 text-[10px] text-slate-500 hover:border-white/[0.12] hover:text-slate-300 transition-all">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
              Export PDF
            </button>
          </div>
        </motion.div>

        {/* Should We Build This? */}
        <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-gradient-to-br from-slate-900 to-slate-900/50 p-5 overflow-hidden relative">
          <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-emerald-500/[0.04] blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20">
                <svg className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h2 className="text-base font-bold text-white">Should We Build This?</h2>
              <StatusBadge status={data.verdict.shouldBuild ? 'success' : 'error'} label={data.verdict.shouldBuild ? 'YES — RECOMMENDED' : 'NO — REJECT'} />
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">{data.verdict.summary}</p>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-600">Decision Confidence</span>
              <div className="flex-1 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${data.verdict.confidence}%` }} transition={{ duration: 1 }} className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-green-500" />
              </div>
              <span className="text-xs font-bold text-emerald-400">{data.verdict.confidence}%</span>
            </div>
          </div>
        </motion.div>

        {/* Business Impact + Engineering Cost */}
        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Business Impact</h3>
            <div className="space-y-4">
              <AnimatedScoreBar value={data.businessImpact.businessScore} label="Business Impact Score" sublabel={`${data.businessImpact.businessScore}%`} color="bg-gradient-to-r from-amber-500 to-orange-500" delay={0} />
              <AnimatedScoreBar value={100} label="Revenue at Risk" sublabel={`$${data.businessImpact.revenueAtRisk.toLocaleString()}/hr`} color="bg-gradient-to-r from-red-500 to-red-600" delay={100} />
              <AnimatedScoreBar value={85} label="Customer Impact" sublabel={data.businessImpact.customerImpact} color="bg-gradient-to-r from-orange-500 to-red-500" delay={200} />
              <AnimatedScoreBar value={60} label="SLA Violation Risk" sublabel={`${data.businessImpact.slaViolation} downtime`} color="bg-gradient-to-r from-yellow-500 to-amber-500" delay={300} />
              <AnimatedScoreBar value={70} label="Regulatory Impact" sublabel={data.businessImpact.regulatory} color="bg-gradient-to-r from-cyan-500 to-brand" delay={400} />
            </div>
          </motion.div>
          <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Engineering Cost</h3>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 text-center"><div className="text-2xl font-bold text-white">{data.engineeringCost.hours}</div><div className="text-[9px] text-slate-600">Hours</div></div>
              <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 text-center"><div className="text-2xl font-bold text-white">{data.engineeringCost.engineers}</div><div className="text-[9px] text-slate-600">Engineers</div></div>
              <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 text-center"><div className="text-2xl font-bold text-white">{data.engineeringCost.sprints}</div><div className="text-[9px] text-slate-600">Sprints</div></div>
              <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 text-center"><div className="text-2xl font-bold text-amber-300">{data.engineeringCost.storyPoints}</div><div className="text-[9px] text-slate-600">Story Points</div></div>
            </div>
            <AnimatedScoreBar value={data.engineeringCost.costScore} label="Cost Efficiency" sublabel={`$${data.engineeringCost.costUSD.toLocaleString()}`} color="bg-gradient-to-r from-brand to-violet-500" delay={0} />
          </motion.div>
        </div>

        {/* Risk + ROI */}
        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Risk Level</h3>
            <div className="flex items-center gap-4 mb-4">
              <div className="relative flex items-center justify-center w-24 h-24 rounded-full" style={{ backgroundColor: 'rgba(245,158,11,0.1)', border: '3px solid #f59e0b', boxShadow: '0 0 20px rgba(245,158,11,0.2)' }}>
                <div className="text-center">
                  <div className="text-xl font-bold text-yellow-400">{data.riskLevel.score}%</div>
                  <div className="text-[8px] text-slate-500 uppercase">Score</div>
                </div>
              </div>
              <div>
                <StatusBadge status={data.riskLevel.level === 'Moderate' ? 'warning' : data.riskLevel.level === 'Low' ? 'success' : 'critical'} label={data.riskLevel.level} />
                <div className="mt-2 text-[10px] text-slate-600 space-y-0.5">
                  <div className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-red-500" /> {data.riskLevel.criticalRisks} critical</div>
                  <div className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-orange-500" /> {data.riskLevel.highRisks} high</div>
                  <div className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-yellow-500" /> {data.riskLevel.mediumRisks} medium</div>
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Expected ROI</h3>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="rounded-lg border border-emerald-500/10 bg-emerald-500/[0.03] p-3 text-center"><div className="text-2xl font-bold text-emerald-400">{data.roi.percentage}%</div><div className="text-[9px] text-slate-600">ROI</div></div>
              <div className="rounded-lg border border-emerald-500/10 bg-emerald-500/[0.03] p-3 text-center"><div className="text-2xl font-bold text-emerald-400">{data.roi.breakevenHours}h</div><div className="text-[9px] text-slate-600">Breakeven</div></div>
              <div className="rounded-lg border border-brand/10 bg-brand/[0.03] p-3 text-center"><div className="text-lg font-bold text-brand-light">${(data.roi.monthlySavings / 1000).toFixed(0)}K</div><div className="text-[9px] text-slate-600">Monthly savings</div></div>
              <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 text-center"><div className="text-lg font-bold text-white">${(data.roi.investment / 1000).toFixed(0)}K</div><div className="text-[9px] text-slate-600">Investment</div></div>
            </div>
            <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(data.roi.percentage, 100)}%` }} transition={{ duration: 1 }} className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-green-500" />
            </div>
          </motion.div>
        </div>

        {/* Deployment Window + Team Readiness */}
        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Deployment Window</h3>
            <div className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] p-4 mb-3">
              <div className="text-center"><div className="text-[9px] text-slate-600">Earliest</div><div className="text-sm font-bold text-white">{data.deploymentWindow.earliest}</div></div>
              <div className="text-slate-700 text-lg">→</div>
              <div className="text-center"><div className="text-[9px] text-slate-600">Recommended</div><div className="text-sm font-bold text-brand-light">{data.deploymentWindow.recommended}</div></div>
              <div className="text-slate-700 text-lg">→</div>
              <div className="text-center"><div className="text-[9px] text-slate-600">Latest</div><div className="text-sm font-bold text-white">{data.deploymentWindow.latest}</div></div>
            </div>
            <StatusBadge status={data.deploymentWindow.confidence === 'High' ? 'success' : 'warning'} label={`${data.deploymentWindow.confidence} Confidence`} />
          </motion.div>
          <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Team Readiness</h3>
            <div className="space-y-2">
              {data.teamReadiness.map((t, i) => (
                <div key={t.team} className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                  <div className="flex items-center gap-3">
                    <span className={`h-2 w-2 rounded-full ${t.readiness >= 80 ? 'bg-green-500' : t.readiness >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`} />
                    <div><span className="text-xs font-medium text-white">{t.team}</span><div className="text-[9px] text-slate-600">Load: {t.load}%</div></div>
                  </div>
                  <StatusBadge status={t.confidence === 'Ready' ? 'success' : t.confidence === 'On Track' ? 'info' : 'warning'} label={t.confidence} />
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Final Recommendation */}
        <motion.div variants={item} className="rounded-xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/[0.04] to-slate-900/50 p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20">
              <svg className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h2 className="text-base font-bold text-white">Final Recommendation</h2>
            <StatusBadge status="success" label={data.recommendation.decision} />
          </div>
          <p className="text-sm text-slate-400 leading-relaxed mb-4">{data.recommendation.reasoning}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-brand/10 bg-brand/[0.03] p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <svg className="h-3 w-3 text-brand-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                <span className="text-[10px] font-semibold text-brand-light">Team Readiness</span>
              </div>
              <p className="text-[10px] text-slate-400">{data.recommendation.teamReadiness}</p>
            </div>
            <div className="rounded-lg border border-yellow-500/10 bg-yellow-500/[0.03] p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <svg className="h-3 w-3 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
                <span className="text-[10px] font-semibold text-yellow-400">Alternative</span>
              </div>
              <p className="text-[10px] text-slate-400">{data.recommendation.alternative}</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </Layout>
  )
}
