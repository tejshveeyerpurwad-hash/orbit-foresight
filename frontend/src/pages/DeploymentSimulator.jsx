import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Layout from '../components/Layout'
import StatCard from '../components/StatCard'
import StatusBadge from '../components/StatusBadge'
import PageHero from '../components/PageHero'

const pipelineStages = [
  { id: 'build', label: 'Build', status: 'success', time: '32s', detail: 'Docker image v3.2.1 compiled', artifacts: '12 MB' },
  { id: 'test', label: 'Test', status: 'success', time: '1m 12s', detail: 'All 1,248 tests passed', artifacts: 'JUnit report' },
  { id: 'staging', label: 'Staging', status: 'running', time: '45s', detail: 'Deploying to staging-01 cluster', artifacts: '3 replicas' },
  { id: 'canary', label: 'Canary', status: 'pending', time: null, detail: 'Awaiting 5% traffic shift', artifacts: '10 min observation' },
  { id: 'production', label: 'Production', status: 'pending', time: null, detail: 'Full rollout pending', artifacts: 'Rolling update' },
]

const checks = [
  { name: 'Unit Tests', status: 'passed', time: '24s', detail: '847/847 passed', severity: 'low' },
  { name: 'Integration Tests', status: 'passed', time: '48s', detail: '156/156 passed', severity: 'low' },
  { name: 'Security Scan', status: 'passed', time: '1m 30s', detail: '0 critical, 2 low', severity: 'medium' },
  { name: 'Load Tests', status: 'running', time: '2m 15s', detail: '12K RPS sustained', severity: 'high' },
  { name: 'Smoke Tests', status: 'pending', time: null, detail: 'Awaiting deployment', severity: 'medium' },
]

const failureScenarios = [
  { scenario: 'Retry queue overflow', cause: 'Missing circuit breaker in payment retry logic', cost: '$12,000/hr', recovery: '45 min', mitigation: 'Add circuit breaker with exponential backoff', severity: 'critical', impact: 'Payment processing down', probability: '23%' },
  { scenario: 'Billing worker OOM', cause: 'Unbounded retry loop exhausting heap memory', cost: '$5,000/hr', recovery: '3 hr', mitigation: 'Bound retry count and add memory limit alerts', severity: 'high', impact: 'Billing delayed', probability: '18%' },
  { scenario: 'Idempotency key collision', cause: 'Missing idempotency keys in webhook delivery', cost: '$2,000/hr', recovery: '2 hr', mitigation: 'Generate unique idempotency keys for all webhooks', severity: 'medium', impact: 'Duplicate charges', probability: '12%' },
  { scenario: 'Database connection pool exhaustion', cause: 'No connection pooling limits configured in the billing service', cost: '$8,500/hr', recovery: '1.5 hr', mitigation: 'Configure HikariCP with max pool size of 50', severity: 'high', impact: 'API timeouts across services', probability: '15%' },
  { scenario: 'Secrets rotation failure', cause: 'Vault token expired during deployment window', cost: '$3,200/hr', recovery: '35 min', mitigation: 'Add pre-deploy secrets validation step', severity: 'medium', impact: 'Service authentication failures', probability: '9%' },
  { scenario: 'Cache invalidation storm', cause: 'Aggressive cache flush on new deployment pattern', cost: '$6,000/hr', recovery: '55 min', mitigation: 'Stagger cache invalidation across shards', severity: 'high', impact: 'Degraded read performance', probability: '14%' },
]

const timelineEvents = [
  { id: 1, label: 'Code Push', time: '0s', timestamp: '14:32:00', status: 'completed', actor: 'dev-team', detail: 'Commit a1b2c3d to main' },
  { id: 2, label: 'Build Start', time: '+5s', timestamp: '14:32:05', status: 'completed', actor: 'CI runner', detail: 'Docker build initiated' },
  { id: 3, label: 'Build Complete', time: '+32s', timestamp: '14:32:32', status: 'completed', actor: 'CI runner', detail: 'Image tagged v3.2.1' },
  { id: 4, label: 'Test Start', time: '+37s', timestamp: '14:32:37', status: 'completed', actor: 'Test runner', detail: 'Test suite started' },
  { id: 5, label: 'Test Pass', time: '+1m 49s', timestamp: '14:33:49', status: 'completed', actor: 'Test runner', detail: 'All checks passed' },
  { id: 6, label: 'Staging Deploy', time: '+2m 05s', timestamp: '14:34:05', status: 'running', actor: 'Orchestrator', detail: 'Deploying to staging' },
  { id: 7, label: 'Staging Health Check', time: '+2m 50s', timestamp: '14:34:50', status: 'pending', actor: 'Health monitor', detail: 'Endpoint health validation' },
  { id: 8, label: 'Canary Start', time: '+3m 10s', timestamp: '14:35:10', status: 'pending', actor: 'Traffic manager', detail: 'Shift 5% traffic' },
  { id: 9, label: 'Canary Observation', time: '+8m 10s', timestamp: '14:40:10', status: 'pending', actor: 'Monitor', detail: 'Observe error rates & latency' },
  { id: 10, label: 'Canary Pass', time: '+13m 10s', timestamp: '14:45:10', status: 'pending', actor: 'Auto-approve', detail: 'No errors detected' },
  { id: 11, label: 'Production Deploy', time: '+13m 30s', timestamp: '14:45:30', status: 'pending', actor: 'Orchestrator', detail: 'Rolling update to prod' },
  { id: 12, label: 'Production Complete', time: '+18m 30s', timestamp: '14:50:30', status: 'pending', actor: 'Orchestrator', detail: 'All pods healthy' },
]

const rollbackPlans = [
  { stage: 'Build', action: 'Discard docker image', time: 'Instant', risk: 'none', icon: 'trash' },
  { stage: 'Test', action: 'Skip and mark as failed', time: '30s', risk: 'none', icon: 'skip' },
  { stage: 'Staging', action: 'Revert to previous release', time: '2 min', risk: 'low', icon: 'rewind' },
  { stage: 'Canary', action: 'Halt traffic and rollback', time: '5 min', risk: 'medium', icon: 'stop' },
  { stage: 'Production', action: 'Revert + deploy hotfix', time: '15 min', risk: 'high', icon: 'alert' },
]

const deploymentHistory = [
  { date: '2026-06-19', service: 'Analytics Pipeline', version: 'v1.2.0', status: 'success', duration: '3m 45s', rollback: false, author: 'carol' },
  { date: '2026-06-18', service: 'Payment API', version: 'v3.1.0', status: 'success', duration: '6m 12s', rollback: false, author: 'alice' },
  { date: '2026-06-17', service: 'Billing Worker', version: 'v2.4.1', status: 'success', duration: '4m 05s', rollback: false, author: 'bob' },
  { date: '2026-06-16', service: 'API Gateway', version: 'v4.0.2', status: 'success', duration: '5m 20s', rollback: false, author: 'alice' },
  { date: '2026-06-15', service: 'Webhook Gateway', version: 'v1.8.0', status: 'failed', duration: '3m 22s', rollback: true, author: 'alice' },
  { date: '2026-06-14', service: 'User Service', version: 'v6.1.0', status: 'success', duration: '7m 10s', rollback: false, author: 'bob' },
  { date: '2026-06-12', service: 'Auth Service', version: 'v5.0.0', status: 'success', duration: '5m 45s', rollback: false, author: 'carol' },
  { date: '2026-06-10', service: 'Notification Svc', version: 'v2.1.3', status: 'success', duration: '2m 58s', rollback: false, author: 'bob' },
  { date: '2026-06-08', service: 'Payment API', version: 'v3.0.0', status: 'rolled-back', duration: '8m 30s', rollback: true, author: 'alice' },
]

const envConfig = {
  cluster: 'staging-01',
  namespace: 'payments-v3',
  replicas: 3,
  cpuLimit: '2 cores',
  memoryLimit: '4 GB',
  region: 'us-east-1',
  k8sVersion: '1.28',
  helmChart: 'payment-api-3.2.1',
  configMap: 'payment-config-v12',
  secretsRef: 'payment-secrets-v8',
}

const serviceDependencies = [
  { service: 'Payment API', dependsOn: ['Auth Service', 'User Service', 'Database'], type: 'sync', critical: true },
  { service: 'Billing Worker', dependsOn: ['Payment API', 'Database', 'Queue Service'], type: 'async', critical: true },
  { service: 'Webhook Gateway', dependsOn: ['Payment API', 'Notification Svc'], type: 'async', critical: false },
  { service: 'Notification Svc', dependsOn: ['User Service', 'Template Engine'], type: 'async', critical: false },
  { service: 'Auth Service', dependsOn: ['Database', 'Redis Cache'], type: 'sync', critical: true },
]

const blastRadiusServices = [
  { name: 'Payment API', risk: 'high', impact: 'Transaction processing halted', dependency: 'Order Service', mitigation: 'Enable circuit breaker', probability: '28%' },
  { name: 'Billing Worker', risk: 'medium', impact: 'Invoice generation delayed', dependency: 'Payment API', mitigation: 'Queue fallback', probability: '18%' },
  { name: 'Notification Svc', risk: 'low', impact: 'Email alerts delayed', dependency: 'Billing Worker', mitigation: 'Batch retry', probability: '8%' },
  { name: 'Analytics Pipeline', risk: 'low', impact: 'Reporting delayed 1 hr', dependency: 'Notification Svc', mitigation: 'Buffer events', probability: '5%' },
]

const aiRecommendations = [
  { id: 1, category: 'Canary', title: 'Increase canary duration to 15 min', detail: 'Current 10 min window may miss late-onset errors. Extend to 15 min for 99.9% error detection.', impact: 'High', effort: 'Low', metric: 'Detection rate +12%' },
  { id: 2, category: 'Monitoring', title: 'Add P99 latency alert during canary', detail: 'P95 currently monitored. P99 spikes detected 3 min before P95 degradation.', impact: 'High', effort: 'Medium', metric: 'MTTD -45%' },
  { id: 3, category: 'Rollback', title: 'Automate rollback test verification', detail: 'Manual verification adds 8 min to rollback. Automate health check assertions.', impact: 'Medium', effort: 'Low', metric: 'Rollback time -53%' },
  { id: 4, category: 'Validation', title: 'Add staging smoke test for DB migration', detail: 'Schema changes caused 2 outages this quarter. Add pre-deploy smoke test.', impact: 'High', effort: 'High', metric: 'Schema errors -90%' },
  { id: 5, category: 'Load Testing', title: 'Set load threshold at 30K RPS', detail: 'Current 12K RPS test misses holiday traffic spikes. Increase to 30K RPS.', impact: 'Medium', effort: 'Medium', metric: 'Capacity coverage +150%' },
]

const whatIfScenarios = [
  { name: 'Fast Track', risk: 'High', time: '6 min', cost: '$2,100', successRate: '62%', description: 'Skip canary, deploy directly to production. Highest risk but fastest delivery.' },
  { name: 'Standard', risk: 'Medium', time: '12 min', cost: '$3,800', successRate: '78%', description: 'Full pipeline with 10 min canary. Balanced risk and speed.' },
  { name: 'Conservative', risk: 'Low', time: '24 min', cost: '$6,700', successRate: '91%', description: 'Extended canary (30 min), manual approval gate. Maximum safety.' },
]

const riskByService = [
  { name: 'Payment API', probability: 28, color: 'bg-red-500' },
  { name: 'Billing Worker', probability: 18, color: 'bg-orange-400' },
  { name: 'Webhook Gateway', probability: 12, color: 'bg-yellow-400' },
  { name: 'Auth Service', probability: 8, color: 'bg-green-400' },
  { name: 'Notification Svc', probability: 5, color: 'bg-green-400' },
]

const historicalSuccessRates = [
  { month: 'Jan', rate: 74 },
  { month: 'Feb', rate: 78 },
  { month: 'Mar', rate: 71 },
  { month: 'Apr', rate: 82 },
  { month: 'May', rate: 79 },
  { month: 'Jun', rate: 85 },
]

const riskCategories = [
  { name: 'Database Migration', level: 'high', count: 3, description: 'Schema changes risk' },
  { name: 'API Breaking Changes', level: 'medium', count: 5, description: 'Contract compatibility' },
  { name: 'Configuration Drift', level: 'medium', count: 2, description: 'Env inconsistency' },
  { name: 'Resource Exhaustion', level: 'low', count: 4, description: 'Memory/CPU limits' },
]

const boxIcon = (type) => {
  const icons = {
    trash: 'M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0',
    skip: 'M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z',
    rewind: 'M9.75 3.75v-2.25a.75.75 0 00-1.5 0v2.25m0 4.5v-2.25m0 4.5v-2.25m0 4.5v-2.25M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    stop: 'M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z',
    alert: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z',
  }
  return icons[type] || icons.alert
}

const ArrowRightIcon = () => (
  <svg className="h-3 w-3 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
  </svg>
)

const PlayIcon = () => (
  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
  </svg>
)

const ResetIcon = () => (
  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
  </svg>
)

const SpinnerIcon = () => (
  <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
)

const CheckCircleIcon = () => (
  <svg className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const XCircleIcon = () => (
  <svg className="h-4 w-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } }
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }

export default function DeploymentSimulator() {
  const [simulating, setSimulating] = useState(false)
  const [currentStage, setCurrentStage] = useState(2)
  const [selectedScenario, setSelectedScenario] = useState(null)
  const [pipelineStatus, setPipelineStatus] = useState('idle')
  const [speed, setSpeed] = useState(1)
  const [autoAdvance, setAutoAdvance] = useState(false)
  const [selectedWhatIf, setSelectedWhatIf] = useState(1)
  const [timer, setTimer] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    let interval
    if (simulating && autoAdvance) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1)
      }, 1000 / speed)
    }
    return () => clearInterval(interval)
  }, [simulating, autoAdvance, speed])

  const simulate = () => {
    setSimulating(true)
    setPipelineStatus('running')
    setCurrentStage(0)
    setShowConfetti(false)
    setTimer(0)
    const intervalTime = 2000 / speed
    const interval = setInterval(() => {
      setCurrentStage(prev => {
        if (prev >= pipelineStages.length - 1) {
          clearInterval(interval)
          setSimulating(false)
          setPipelineStatus('completed')
          setShowConfetti(true)
          setTimeout(() => setShowConfetti(false), 5000)
          return prev
        }
        return prev + 1
      })
    }, intervalTime)
  }

  const reset = () => {
    setSimulating(false)
    setPipelineStatus('idle')
    setCurrentStage(2)
    setTimer(0)
    setShowConfetti(false)
  }

  const toggleAutoAdvance = () => {
    setAutoAdvance(prev => !prev)
    if (!autoAdvance) {
      setTimer(0)
    }
  }

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}m ${s.toString().padStart(2, '0')}s`
  }

  const stageStatus = (index) => {
    if (index < currentStage) return 'completed'
    if (index === currentStage) return  pipelineStatus === 'running' ? 'running' : 'pending'
    return 'pending'
  }

  const stageColor = (status) => {
    if (status === 'completed') return 'border-green-500/30 bg-green-500/[0.05] text-green-400'
    if (status === 'running') return 'border-brand/40 bg-brand/[0.06] text-brand-light'
    return 'border-white/[0.06] bg-white/[0.02] text-slate-600'
  }

  const stageDotColor = (status) => {
    if (status === 'completed') return 'bg-green-500'
    if (status === 'running') return 'bg-brand animate-pulse-soft'
    return 'bg-slate-700'
  }

  const statusForTime = (time, elapsed) => {
    if (elapsed >= time) return 'completed'
    return 'pending'
  }

  const readinessScore = 78

  return (
    <Layout>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-3">

        <PageHero
          title="Mission Control Center"
          subtitle="Live orchestration of deployment pipelines, canary analysis, and automated remediation — real-time mission operations."
          impact="97.2"
          impactLabel="Launch Readiness %"
          confidence={94}
          actionLabel="View Execution Plan"
          actionTo="/execution-planner"
        />

        {/* === MISSION STATUS BAR === */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          {[
            { label: 'Launch Readiness', value: '97.2%', color: 'text-emerald-400', bg: 'from-emerald-500/10 to-emerald-500/5', icon: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
            { label: 'Deployment Countdown', value: 'T-12:45', color: 'text-cyan-400', bg: 'from-cyan-500/10 to-cyan-500/5', icon: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z' },
            { label: 'Active Pipelines', value: '3 running', color: 'text-amber-400', bg: 'from-amber-500/10 to-amber-500/5', icon: 'M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z' },
            { label: 'Completion Probability', value: '94.2%', color: 'text-violet-400', bg: 'from-violet-500/10 to-violet-500/5', icon: 'M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
          ].map((s, i) => (
            <div key={s.label} className={`rounded-lg border border-white/[0.06] bg-gradient-to-br ${s.bg} p-3`}>
              <div className="flex items-center gap-1.5 mb-1">
                <svg className="h-3 w-3 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={s.icon} />
                </svg>
                <span className="text-[9px] font-mono text-slate-500">{s.label}</span>
              </div>
              <div className={`text-lg font-bold ${s.color}`}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* === LIVE STATUS BANNER === */}
        <div className="rounded-lg border border-emerald-500/15 bg-emerald-500/[0.03] p-2 mb-4 flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="text-[9px] font-mono text-emerald-400 font-bold tracking-widest uppercase">Mission Control Active</span>
          <span className="text-[8px] text-slate-600">— Monitoring 5 pipelines across 3 environments</span>
        </div>

        {/* ===== SECTION 1: SIMULATOR HERO ===== */}
        <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-4">
          <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-xl font-bold tracking-tight text-white">Deployment Simulator</h1>
                <StatusBadge
                  status={pipelineStatus === 'running' ? 'running' : pipelineStatus === 'completed' ? 'success' : pipelineStatus === 'failed' ? 'error' : 'pending'}
                  label={pipelineStatus === 'running' ? 'In Progress' : pipelineStatus === 'completed' ? 'Completed' : pipelineStatus === 'failed' ? 'Failed' : 'Ready'}
                  dot
                />
              </div>
              <div className="flex items-center gap-3 text-[10px] text-slate-500">
                <span>Pipeline ID: <span className="font-mono text-slate-400">pl-20260620-003</span></span>
                <span className="text-slate-700">|</span>
                <span>Environment: <span className="text-slate-400">staging</span></span>
                <span className="text-slate-700">|</span>
                <span>Branch: <span className="text-slate-400">main</span></span>
                <span className="text-slate-700">|</span>
                <span>Trigger: <span className="text-slate-400">manual</span></span>
                <span className="text-slate-700">|</span>
                <span>Commit: <span className="font-mono text-slate-400">a1b2c3d</span></span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={simulate}
                disabled={simulating}
                className="flex items-center gap-1.5 rounded-lg bg-brand px-3 py-2 text-xs font-semibold text-white hover:bg-brand-dark disabled:opacity-50 transition-all"
              >
                {simulating ? <SpinnerIcon /> : <PlayIcon />}
                {simulating ? 'Simulating...' : 'Run Simulation'}
              </button>
              <button
                onClick={reset}
                className="flex items-center gap-1.5 rounded-lg border border-white/[0.06] px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-white/[0.04] transition-all"
              >
                <ResetIcon />
                Reset
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            <StatCard label="Failure Prob." value="34%" color="text-yellow-400" />
            <StatCard label="Est. Cost" value="$19K/hr" color="text-red-400" />
            <StatCard label="Recovery" value="45min" color="text-orange-400" />
            <StatCard label="Mitigation" value="72%" color="text-green-400" />
            <StatCard label="Success Rate" value="66%" color="text-cyan-400" />
            <StatCard label="Confidence" value="88%" color="text-brand-light" />
          </div>
        </motion.div>

        {/* ===== SECTION 2: PIPELINE VISUALIZATION ===== */}
        <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white">Pipeline Visualization</h3>
            <span className="text-[10px] text-slate-600">
              {pipelineStatus === 'running' ? `Elapsed: ${formatTimer(timer)}` : pipelineStatus === 'completed' ? 'Completed in 18m 30s' : 'Ready'}
            </span>
          </div>
          <div className="flex items-start gap-1 overflow-x-auto pb-2">
            {pipelineStages.map((s, i) => {
              const st = stageStatus(i)
              return (
                <div key={s.id} className="flex-1 min-w-[130px]">
                  <div className={`rounded-lg border p-3 text-center transition-all ${stageColor(st)}`}>
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                      <div className={`h-2 w-2 rounded-full ${stageDotColor(st)}`} />
                      <span className="text-xs font-semibold">{s.label}</span>
                    </div>
                    <div className={`text-[10px] ${s.time ? 'text-slate-500' : 'text-slate-700'}`}>{s.time || '---'}</div>
                    <div className="text-[9px] text-slate-600 mt-0.5 truncate max-w-[110px]">{s.detail}</div>
                    <div className="text-[9px] text-slate-600 mt-1">{st === 'running' ? 'In progress...' : st === 'completed' ? 'Done' : 'Waiting'}</div>
                  </div>
                  {i < pipelineStages.length - 1 && (
                    <div className="flex items-center justify-center my-1">
                      <div className={`h-0.5 w-8 rounded-full ${st === 'completed' ? 'bg-green-500/40' : currentStage > i ? 'bg-green-500/40' : 'bg-slate-800'}`} />
                    </div>
                  )}
                  <div className="text-center mt-1">
                    <span className={`text-[8px] font-mono ${s.artifacts ? 'text-slate-600' : 'text-slate-800'}`}>{s.artifacts || '---'}</span>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-2 grid grid-cols-5 gap-1">
            {pipelineStages.map((s, i) => {
              const st = stageStatus(i)
              const barColor = st === 'completed' ? 'bg-green-500' : st === 'running' ? 'bg-brand' : 'bg-slate-800'
              return (
                <div key={s.id} className="flex flex-col items-center">
                  <div className={`w-full h-1 rounded-full ${barColor} ${st === 'running' ? 'animate-pulse' : ''}`} />
                </div>
              )
            })}
          </div>
          <div className="mt-3 flex items-center gap-4 text-[10px] text-slate-600 border-t border-white/[0.04] pt-3">
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span>Completed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-brand animate-pulse-soft" />
              <span>Running</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-slate-700" />
              <span>Pending</span>
            </div>
            <div className="flex items-center gap-1.5 ml-auto">
              <span className="text-slate-600">Current:</span>
              <span className="text-brand-light font-medium">{pipelineStages[currentStage]?.label || '---'}</span>
            </div>
          </div>
        </motion.div>

        {/* ===== SECTION 3: PIPELINE CONTROLS ===== */}
        <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white">Pipeline Controls</h3>
            <StatusBadge status={pipelineStatus === 'running' ? 'running' : pipelineStatus === 'completed' ? 'success' : 'pending'} label={pipelineStatus === 'running' ? 'Active' : pipelineStatus === 'completed' ? 'Completed' : 'Idle'} />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
              <div className="text-[10px] text-slate-600 mb-1.5">Run Simulation</div>
              <button
                onClick={simulate}
                disabled={simulating}
                className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-brand px-3 py-2 text-xs font-semibold text-white hover:bg-brand-dark disabled:opacity-50 transition-all"
              >
                {simulating ? <SpinnerIcon /> : <PlayIcon />}
                {simulating ? 'Running...' : 'Start'}
              </button>
            </div>
            <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
              <div className="text-[10px] text-slate-600 mb-1.5">Reset Pipeline</div>
              <button
                onClick={reset}
                className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-white/[0.06] px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-white/[0.04] transition-all"
              >
                <ResetIcon />
                Reset
              </button>
            </div>
            <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
              <div className="text-[10px] text-slate-600 mb-1.5">Auto-Advance</div>
              <button
                onClick={toggleAutoAdvance}
                disabled={!simulating}
                className={`w-full rounded-lg border px-3 py-2 text-xs font-semibold transition-all ${
                  autoAdvance
                    ? 'border-green-500/30 bg-green-500/[0.06] text-green-400'
                    : 'border-white/[0.06] text-slate-500 hover:bg-white/[0.04]'
                } disabled:opacity-50`}
              >
                {autoAdvance ? 'ON' : 'OFF'}
              </button>
            </div>
            <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
              <div className="text-[10px] text-slate-600 mb-1.5">Speed: {speed}x</div>
              <div className="flex gap-1">
                {[1, 2, 3].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSpeed(s)}
                    className={`flex-1 rounded border px-2 py-1.5 text-[10px] font-semibold transition-all ${
                      speed === s
                        ? 'border-brand/30 bg-brand/[0.06] text-brand-light'
                        : 'border-white/[0.06] text-slate-600 hover:bg-white/[0.04]'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-white/[0.04]">
            <div className="flex items-center justify-between text-[10px] text-slate-600 mb-2">
              <span>Pipeline Log</span>
              <span className="text-[9px] text-slate-700">Real-time events</span>
            </div>
            <div className="space-y-1 max-h-20 overflow-y-auto">
              {pipelineStatus === 'idle' && (
                <div className="text-[9px] text-slate-700 flex items-center gap-1.5">
                  <div className="h-1 w-1 rounded-full bg-slate-700" />
                  Pipeline ready. Click "Run Simulation" to start.
                </div>
              )}
              {pipelineStatus === 'running' && pipelineStages.slice(0, currentStage + 1).map((s, i) => (
                <div key={s.id} className="text-[9px] text-slate-600 flex items-center gap-1.5">
                  <div className={`h-1 w-1 rounded-full ${stageStatus(i) === 'completed' ? 'bg-green-500' : 'bg-brand animate-pulse-soft'}`} />
                  {s.label}: {stageStatus(i) === 'completed' ? 'Completed' : 'Running'} ({s.time || '---'})
                </div>
              ))}
              {pipelineStatus === 'completed' && (
                <div className="text-[9px] text-green-500/70 flex items-center gap-1.5">
                  <div className="h-1 w-1 rounded-full bg-green-500" />
                  Pipeline completed successfully in 18m 30s
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* ===== SECTIONS 4+5: PRE-DEPLOYMENT CHECKS + DEPLOYMENT SUMMARY ===== */}
        <div className="grid gap-3 lg:grid-cols-2">

          {/* SECTION 4: Pre-Deployment Checks */}
          <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white">Pre-Deployment Checks</h3>
              <StatusBadge
                status={checks.every(c => c.status === 'passed') ? 'success' : checks.some(c => c.status === 'running') ? 'running' : 'pending'}
                label={`${checks.filter(c => c.status === 'passed').length}/${checks.length} passed`}
                dot={false}
              />
            </div>
            <div className="space-y-2">
              {checks.map((c) => {
                const dotColor = c.status === 'passed' ? 'bg-green-500' : c.status === 'running' ? 'bg-brand animate-pulse-soft' : 'bg-slate-700'
                const borderColor = c.status === 'passed' ? 'border-green-500/10' : c.status === 'running' ? 'border-brand/10' : 'border-white/[0.04]'
                return (
                  <div key={c.name} className={`flex items-center justify-between rounded-lg border ${borderColor} bg-white/[0.02] p-3`}>
                    <div className="flex items-center gap-2.5">
                      <div className={`h-2 w-2 rounded-full ${dotColor}`} />
                      <div>
                        <span className="text-xs text-slate-300 font-medium">{c.name}</span>
                        <div className="text-[9px] text-slate-600">{c.detail}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {c.status === 'passed' && <CheckCircleIcon />}
                        {c.status === 'failed' && <XCircleIcon />}
                        <StatusBadge status={c.status} label={c.status} dot={false} />
                      </div>
                      {c.time && <span className="text-[10px] text-slate-600">{c.time}</span>}
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>

          {/* SECTION 5: Deployment Summary */}
          <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white">Deployment Summary</h3>
              <span className="text-[10px] text-slate-600 font-mono">v3.2.1</span>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5">
                <div className="text-[9px] text-slate-600">Total Duration</div>
                <div className="text-xs font-semibold text-slate-200">4m 29s</div>
              </div>
              <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5">
                <div className="text-[9px] text-slate-600">Services</div>
                <div className="text-xs font-semibold text-slate-200">3 deployed</div>
              </div>
              <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5">
                <div className="text-[9px] text-slate-600">Risk</div>
                <StatusBadge status="warning" label="Medium" />
              </div>
              <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5">
                <div className="text-[9px] text-slate-600">Rollback</div>
                <div className="text-xs font-semibold text-slate-300">Automated</div>
              </div>
              <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5">
                <div className="text-[9px] text-slate-600">Blast Radius</div>
                <div className="text-xs font-semibold text-slate-300">2 services</div>
              </div>
              <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5">
                <div className="text-[9px] text-slate-600">Release</div>
                <div className="text-xs font-semibold text-slate-300">v3.2.1</div>
              </div>
            </div>
            <div className="rounded-lg border border-white/[0.06] bg-brand/[0.03] p-3">
              <div className="text-[10px] text-slate-500 mb-1">Release Notes</div>
              <p className="text-[10px] text-slate-400 leading-relaxed">Deploy payment retry circuit breaker, billing worker memory optimization, and idempotency key generation for webhooks.</p>
            </div>
          </motion.div>
        </div>

        {/* ===== ENVIRONMENT CONFIG ===== */}
        <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white">Environment Configuration</h3>
            <StatusBadge status="success" label="Ready" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2">
            <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5">
              <div className="text-[9px] text-slate-600">Cluster</div>
              <div className="text-xs font-mono font-semibold text-slate-300 truncate">{envConfig.cluster}</div>
            </div>
            <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5">
              <div className="text-[9px] text-slate-600">Namespace</div>
              <div className="text-xs font-mono font-semibold text-slate-300 truncate">{envConfig.namespace}</div>
            </div>
            <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5">
              <div className="text-[9px] text-slate-600">Replicas</div>
              <div className="text-xs font-mono font-semibold text-slate-300">{envConfig.replicas}</div>
            </div>
            <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5">
              <div className="text-[9px] text-slate-600">CPU Limit</div>
              <div className="text-xs font-mono font-semibold text-slate-300">{envConfig.cpuLimit}</div>
            </div>
            <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5">
              <div className="text-[9px] text-slate-600">Memory</div>
              <div className="text-xs font-mono font-semibold text-slate-300">{envConfig.memoryLimit}</div>
            </div>
            <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5">
              <div className="text-[9px] text-slate-600">Region</div>
              <div className="text-xs font-mono font-semibold text-slate-300">{envConfig.region}</div>
            </div>
            <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5">
              <div className="text-[9px] text-slate-600">K8s Version</div>
              <div className="text-xs font-mono font-semibold text-slate-300">{envConfig.k8sVersion}</div>
            </div>
            <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5">
              <div className="text-[9px] text-slate-600">Helm Chart</div>
              <div className="text-xs font-mono font-semibold text-slate-300 truncate">{envConfig.helmChart}</div>
            </div>
            <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5">
              <div className="text-[9px] text-slate-600">Config Map</div>
              <div className="text-xs font-mono font-semibold text-slate-300 truncate">{envConfig.configMap}</div>
            </div>
            <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5">
              <div className="text-[9px] text-slate-600">Secrets</div>
              <div className="text-xs font-mono font-semibold text-slate-300 truncate">{envConfig.secretsRef}</div>
            </div>
          </div>
        </motion.div>

        {/* ===== SERVICE DEPENDENCIES ===== */}
        <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white">Service Dependencies</h3>
            <StatusBadge status="success" label="All resolved" />
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {serviceDependencies.map((sd) => (
              <div key={sd.service} className={`rounded-lg border p-3 ${
                sd.critical ? 'border-white/[0.06] bg-white/[0.02]' : 'border-white/[0.04] bg-white/[0.01]'
              }`}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    {sd.critical && (
                      <svg className="h-3 w-3 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                      </svg>
                    )}
                    <span className="text-xs font-semibold text-slate-200">{sd.service}</span>
                  </div>
                  <span className={`text-[9px] font-mono ${sd.type === 'sync' ? 'text-brand-light' : 'text-slate-500'}`}>{sd.type}</span>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[9px] text-slate-600">Depends on:</span>
                  {sd.dependsOn.map((dep) => (
                    <span key={dep} className="text-[9px] text-slate-400 bg-white/[0.03] px-1.5 py-0.5 rounded">{dep}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ===== SECTION 6: DEPLOYMENT TIMELINE ===== */}
        <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white">Deployment Timeline</h3>
            <span className="text-[10px] text-slate-600">{timelineEvents.length} events &middot; 18m 30s total</span>
          </div>
          <div className="relative">
            <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-slate-800" />
            <div className="space-y-1">
              {timelineEvents.map((ev, i) => {
                const st = i < 5 ? 'completed' : i === 5 ? 'running' : 'pending'
                const dotBg = st === 'completed' ? 'bg-green-500' : st === 'running' ? 'bg-brand animate-pulse-soft' : 'bg-slate-700'
                const textColor = st === 'completed' ? 'text-slate-300' : st === 'running' ? 'text-brand-light' : 'text-slate-600'
                return (
                  <div key={ev.id} className="relative flex items-start gap-3 pl-7">
                    <div className={`absolute left-[7px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-slate-900 ${dotBg}`} />
                    <div className="flex-1 flex items-center justify-between py-1.5">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-medium ${textColor}`}>{ev.label}</span>
                          <span className="text-[8px] text-slate-700 font-mono">{ev.timestamp}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] text-slate-600">{ev.detail}</span>
                          <span className="text-[8px] text-slate-700">by {ev.actor}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        <span className="text-[9px] font-mono text-slate-600">{ev.time}</span>
                        <StatusBadge status={st} label="" dot />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </motion.div>

        {/* ===== SECTION 7: FAILURE SCENARIOS ===== */}
        <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white">Failure Scenarios</h3>
            <StatusBadge status="error" label={`${failureScenarios.filter(f => f.severity === 'critical' || f.severity === 'high').length} high-risk of ${failureScenarios.length}`} />
          </div>
          <div className="space-y-2">
            {failureScenarios.map((fs, i) => (
              <div key={i}>
                <button
                  onClick={() => setSelectedScenario(selectedScenario === i ? null : i)}
                  className="w-full rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 text-left hover:border-white/[0.12] transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <StatusBadge status={fs.severity} label={fs.severity} />
                        <span className="text-xs font-semibold text-slate-200 truncate">{fs.scenario}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 truncate">Cause: {fs.cause}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <span className="text-[9px] text-slate-600">{fs.probability}</span>
                      <svg className={`h-3 w-3 text-slate-600 transition-transform ${selectedScenario === i ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </div>
                  </div>
                </button>
                {selectedScenario === i && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="overflow-hidden"
                  >
                    <div className="rounded-b-lg border-x border-b border-white/[0.06] bg-brand/[0.03] p-3">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div>
                          <span className="text-[9px] text-slate-600">Impact</span>
                          <div className="text-[11px] font-semibold text-slate-300">{fs.impact}</div>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-600">Cost</span>
                          <div className="text-[11px] font-semibold text-red-400">{fs.cost}</div>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-600">Recovery</span>
                          <div className="text-[11px] font-semibold text-yellow-400">{fs.recovery}</div>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-600">Probability</span>
                          <div className="text-[11px] font-semibold text-orange-400">{fs.probability}</div>
                        </div>
                      </div>
                      <div className="mt-2 pt-2 border-t border-white/[0.04]">
                        <span className="text-[9px] text-slate-600">Mitigation</span>
                        <div className="text-[11px] font-semibold text-green-400">{fs.mitigation}</div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* ===== SECTION 8: RISK ANALYSIS ===== */}
        <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white">Risk Analysis</h3>
            <StatusBadge status="warning" label="Overall: Medium" />
          </div>
          <div className="grid gap-3 lg:grid-cols-2">
            <div>
              <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 mb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-slate-600">Failure Probability</span>
                  <span className="text-xs font-bold text-yellow-400">34%</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '34%' }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"
                  />
                </div>
                <div className="flex justify-between text-[9px] text-slate-700 mt-1">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>
              <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                <div className="text-[10px] text-slate-600 mb-2">Risk by Service</div>
                <div className="space-y-1.5">
                  {riskByService.map((r) => (
                    <div key={r.name} className="flex items-center gap-2">
                      <span className="text-[9px] text-slate-500 w-24 truncate">{r.name}</span>
                      <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${r.probability}%` }}
                          transition={{ duration: 1, delay: 0.2 }}
                          className={`h-full rounded-full ${r.color}`}
                        />
                      </div>
                      <span className="text-[9px] text-slate-500 w-8 text-right">{r.probability}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 mb-3">
                <div className="text-[10px] text-slate-600 mb-2">Historical Success Rate</div>
                <div className="flex items-end gap-1 h-16">
                  {historicalSuccessRates.map((h) => {
                    const height = `${h.rate}%`
                    const isLatest = h.month === 'Jun'
                    return (
                      <div key={h.month} className="flex-1 flex flex-col items-center gap-0.5">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height }}
                          transition={{ duration: 0.8, delay: 0.3 }}
                          className={`w-full rounded-t-sm ${isLatest ? 'bg-brand/70' : 'bg-slate-700'} transition-all`}
                        />
                        <span className={`text-[8px] ${isLatest ? 'text-brand-light' : 'text-slate-600'}`}>{h.month}</span>
                      </div>
                    )
                  })}
                </div>
                <div className="flex justify-between text-[9px] text-slate-700 mt-1">
                  <span>Avg: 78.2%</span>
                  <span className="text-green-400">+5% MoM</span>
                </div>
              </div>
              <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                <div className="text-[10px] text-slate-600 mb-2">Risk Category Breakdown</div>
                <div className="space-y-1.5">
                  {riskCategories.map((rc) => {
                    const levelColor = rc.level === 'high' ? 'text-red-400 bg-red-500/[0.06]' : rc.level === 'medium' ? 'text-yellow-400 bg-yellow-500/[0.06]' : 'text-green-400 bg-green-500/[0.06]'
                    return (
                      <div key={rc.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${levelColor}`}>{rc.level}</span>
                          <span className="text-[10px] text-slate-400">{rc.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] text-slate-600">{rc.description}</span>
                          <span className="text-[10px] font-mono text-slate-500 w-4 text-right">{rc.count}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="mt-2 pt-2 border-t border-white/[0.04] flex items-center justify-between">
                  <span className="text-[9px] text-slate-600">Total risk items</span>
                  <span className="text-[10px] font-bold text-slate-300">{riskCategories.reduce((a, r) => a + r.count, 0)}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ===== SECTION 9: ROLLBACK PLAN ===== */}
        <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white">Rollback Plan</h3>
            <StatusBadge status="success" label="Automated" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/[0.04]">
                  <th className="text-left text-[10px] text-slate-600 font-medium pb-2 pr-3">Stage</th>
                  <th className="text-left text-[10px] text-slate-600 font-medium pb-2 pr-3">Action</th>
                  <th className="text-right text-[10px] text-slate-600 font-medium pb-2 pr-3">Time</th>
                  <th className="text-right text-[10px] text-slate-600 font-medium pb-2">Risk</th>
                </tr>
              </thead>
              <tbody>
                {rollbackPlans.map((rp) => {
                  const riskColor = rp.risk === 'none' ? 'bg-green-500/[0.06] text-green-400' : rp.risk === 'low' ? 'bg-green-500/[0.06] text-green-400' : rp.risk === 'medium' ? 'bg-yellow-500/[0.06] text-yellow-400' : 'bg-red-500/[0.06] text-red-400'
                  return (
                    <tr key={rp.stage} className="border-b border-white/[0.02]">
                      <td className="py-2 pr-3">
                        <div className="flex items-center gap-2">
                          <svg className="h-3 w-3 text-slate-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d={boxIcon(rp.icon)} />
                          </svg>
                          <span className="text-slate-300 font-medium">{rp.stage}</span>
                        </div>
                      </td>
                      <td className="py-2 pr-3 text-slate-400">{rp.action}</td>
                      <td className="py-2 pr-3 text-right font-mono text-slate-500">{rp.time}</td>
                      <td className="py-2 text-right"><span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${riskColor}`}>{rp.risk}</span></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* ===== SECTION 10: DEPLOYMENT HISTORY ===== */}
        <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white">Deployment History</h3>
            <span className="text-[10px] text-slate-600">Last {deploymentHistory.length} deployments</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/[0.04]">
                  <th className="text-left text-[10px] text-slate-600 font-medium pb-2 pr-2">Date</th>
                  <th className="text-left text-[10px] text-slate-600 font-medium pb-2 pr-2">Service</th>
                  <th className="text-left text-[10px] text-slate-600 font-medium pb-2 pr-2">Version</th>
                  <th className="text-left text-[10px] text-slate-600 font-medium pb-2 pr-2">Status</th>
                  <th className="text-right text-[10px] text-slate-600 font-medium pb-2 pr-2">Duration</th>
                  <th className="text-right text-[10px] text-slate-600 font-medium pb-2">Rollback</th>
                </tr>
              </thead>
              <tbody>
                {deploymentHistory.map((dh, i) => (
                  <tr key={i} className="border-b border-white/[0.02]">
                    <td className="py-1.5 pr-2">
                      <span className="text-slate-500 font-mono text-[9px]">{dh.date}</span>
                    </td>
                    <td className="py-1.5 pr-2 text-slate-300 font-medium">{dh.service}</td>
                    <td className="py-1.5 pr-2 font-mono text-slate-500">{dh.version}</td>
                    <td className="py-1.5 pr-2">
                      <StatusBadge
                        status={dh.status === 'success' ? 'success' : dh.status === 'failed' ? 'error' : 'warning'}
                        label={dh.status}
                        dot
                      />
                    </td>
                    <td className="py-1.5 pr-2 text-right font-mono text-slate-500">{dh.duration}</td>
                    <td className="py-1.5 text-right">
                      {dh.rollback ? <span className="text-red-400 text-[10px]">Yes</span> : <span className="text-slate-700 text-[10px]">No</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-2 flex items-center justify-between text-[10px] text-slate-600 border-t border-white/[0.04] pt-2">
            <span>{deploymentHistory.filter(d => d.status === 'success').length} successful &middot; {deploymentHistory.filter(d => d.rollback).length} rollbacks</span>
            <span>Avg duration: {(() => { const times = deploymentHistory.map(d => parseInt(d.duration)); const avg = Math.round(times.reduce((a, b) => a + b, 0) / times.length); return `${Math.floor(avg / 60)}m ${avg % 60}s` })()}</span>
          </div>
        </motion.div>

        {/* ===== SECTION 11: BLAST RADIUS ANALYSIS ===== */}
        <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white">Blast Radius Analysis</h3>
            <StatusBadge status="warning" label="4 affected services" />
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {blastRadiusServices.map((br) => {
              const riskBorder = br.risk === 'high' ? 'border-red-500/20 bg-red-500/[0.03]' : br.risk === 'medium' ? 'border-yellow-500/20 bg-yellow-500/[0.03]' : 'border-green-500/20 bg-green-500/[0.03]'
              const riskText = br.risk === 'high' ? 'text-red-400' : br.risk === 'medium' ? 'text-yellow-400' : 'text-green-400'
              const riskLabel = br.risk === 'high' ? 'bg-red-500/[0.06] text-red-400' : br.risk === 'medium' ? 'bg-yellow-500/[0.06] text-yellow-400' : 'bg-green-500/[0.06] text-green-400'
              return (
                <div key={br.name} className={`rounded-lg border ${riskBorder} p-3`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-slate-200">{br.name}</span>
                    <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${riskLabel}`}>{br.risk}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mb-1">Impact: <span className="text-slate-500">{br.impact}</span></div>
                  <div className="flex items-center justify-between text-[9px]">
                    <span className="text-slate-600">Dep: <span className="text-slate-500">{br.dependency}</span></span>
                    <span className={`font-semibold ${riskText}`}>{br.probability}</span>
                  </div>
                  <div className="mt-1.5 pt-1.5 border-t border-white/[0.04]">
                    <span className="text-[9px] text-green-500/70">{br.mitigation}</span>
                  </div>
                  <div className="mt-1.5 h-1 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: br.probability }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className={`h-full rounded-full ${br.risk === 'high' ? 'bg-red-500' : br.risk === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}`}
                    />
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-3 flex items-center gap-2 text-[10px] text-slate-600 border-t border-white/[0.04] pt-3">
            <span>Dependency Chain:</span>
            <span className="text-slate-500">Payment API → Billing Worker → Notification Svc → Analytics Pipeline</span>
          </div>
        </motion.div>

        {/* ===== SECTION 12: AI RECOMMENDATIONS ===== */}
        <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white">AI Recommendations</h3>
            <StatusBadge status="running" label="5 insights" />
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {aiRecommendations.map((rec) => (
              <div key={rec.id} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 hover:border-brand/20 transition-all">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[9px] font-semibold text-brand-light uppercase tracking-wider">{rec.category}</span>
                  <div className="flex items-center gap-1">
                    <span className={`text-[9px] px-1 py-0.5 rounded ${
                      rec.impact === 'High' ? 'bg-green-500/[0.06] text-green-400' : 'bg-yellow-500/[0.06] text-yellow-400'
                    }`}>{rec.impact} impact</span>
                    <span className={`text-[9px] px-1 py-0.5 rounded ${
                      rec.effort === 'Low' ? 'bg-green-500/[0.06] text-green-400' : rec.effort === 'Medium' ? 'bg-yellow-500/[0.06] text-yellow-400' : 'bg-red-500/[0.06] text-red-400'
                    }`}>{rec.effort} effort</span>
                  </div>
                </div>
                <h4 className="text-xs font-semibold text-slate-200 mb-1">{rec.title}</h4>
                <p className="text-[10px] text-slate-500 leading-relaxed">{rec.detail}</p>
                <div className="mt-1.5 pt-1.5 border-t border-white/[0.04] flex items-center justify-between">
                  <span className="text-[9px] text-slate-600">Metric</span>
                  <span className="text-[9px] font-semibold text-green-400">{rec.metric}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-white/[0.04] grid grid-cols-3 gap-3">
            <div className="text-center">
              <div className="text-[9px] text-slate-600">High Impact</div>
              <div className="text-xs font-bold text-green-400">{aiRecommendations.filter(r => r.impact === 'High').length}</div>
            </div>
            <div className="text-center">
              <div className="text-[9px] text-slate-600">Low Effort</div>
              <div className="text-xs font-bold text-green-400">{aiRecommendations.filter(r => r.effort === 'Low').length}</div>
            </div>
            <div className="text-center">
              <div className="text-[9px] text-slate-600">Quick Wins</div>
              <div className="text-xs font-bold text-brand-light">{aiRecommendations.filter(r => r.impact === 'High' && r.effort === 'Low').length}</div>
            </div>
          </div>
        </motion.div>

        {/* ===== SECTION 13: WHAT-IF SCENARIOS ===== */}
        <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white">What-If Scenarios</h3>
            <span className="text-[10px] text-slate-600">Compare deployment strategies</span>
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            {whatIfScenarios.map((wis, i) => {
              const isSelected = selectedWhatIf === i
              const riskColor = wis.risk === 'High' ? 'text-red-400' : wis.risk === 'Medium' ? 'text-yellow-400' : 'text-green-400'
              const riskBg = wis.risk === 'High' ? 'border-red-500/20' : wis.risk === 'Medium' ? 'border-yellow-500/20' : 'border-green-500/20'
              const selectedBorder = isSelected ? 'border-brand/40 bg-brand/[0.04]' : 'border-white/[0.06] bg-white/[0.02]'
              return (
                <button
                  key={wis.name}
                  onClick={() => setSelectedWhatIf(i)}
                  className={`rounded-lg border p-3 text-left transition-all ${selectedBorder} ${riskBg} hover:border-white/[0.12]`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-slate-200">{wis.name}</span>
                    {isSelected && (
                      <svg className="h-3 w-3 text-brand-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 mb-2 leading-relaxed">{wis.description}</p>
                  <div className="grid grid-cols-2 gap-1">
                    <div className="rounded bg-white/[0.02] p-1.5">
                      <div className="text-[8px] text-slate-600">Risk</div>
                      <div className={`text-xs font-bold ${riskColor}`}>{wis.risk}</div>
                    </div>
                    <div className="rounded bg-white/[0.02] p-1.5">
                      <div className="text-[8px] text-slate-600">Time</div>
                      <div className="text-xs font-bold text-slate-300">{wis.time}</div>
                    </div>
                    <div className="rounded bg-white/[0.02] p-1.5">
                      <div className="text-[8px] text-slate-600">Cost</div>
                      <div className="text-xs font-bold text-red-400">{wis.cost}</div>
                    </div>
                    <div className="rounded bg-white/[0.02] p-1.5">
                      <div className="text-[8px] text-slate-600">Success</div>
                      <div className="text-xs font-bold text-green-400">{wis.successRate}</div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
          <div className="mt-3 pt-3 border-t border-white/[0.04]">
            <div className="flex items-center justify-between text-[10px] text-slate-600 mb-1.5">
              <span>Risk vs Reward Comparison</span>
              <span className="text-slate-500">Selected: {whatIfScenarios[selectedWhatIf].name}</span>
            </div>
            <div className="flex items-end gap-1 h-10">
              {whatIfScenarios.map((wis, i) => {
                const riskNum = wis.risk === 'High' ? 90 : wis.risk === 'Medium' ? 60 : 30
                const successNum = parseInt(wis.successRate)
                return (
                  <div key={wis.name} className={`flex-1 flex flex-col items-center ${i === selectedWhatIf ? 'opacity-100' : 'opacity-50'}`}>
                    <div className="flex gap-0.5 w-full mb-0.5">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${riskNum}%` }}
                        className="flex-1 bg-red-500/50 rounded-t-sm"
                      />
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${successNum}%` }}
                        className="flex-1 bg-green-500/50 rounded-t-sm"
                      />
                    </div>
                    <span className={`text-[7px] ${i === selectedWhatIf ? 'text-slate-400' : 'text-slate-700'}`}>{wis.name}</span>
                  </div>
                )
              })}
            </div>
            <div className="flex items-center gap-3 text-[9px] text-slate-600 mt-1">
              <div className="flex items-center gap-1"><div className="h-1.5 w-1.5 rounded-full bg-red-500/50" /> Risk</div>
              <div className="flex items-center gap-1"><div className="h-1.5 w-1.5 rounded-full bg-green-500/50" /> Success</div>
            </div>
          </div>
        </motion.div>

        {/* ===== SECTION 14: DEPLOYMENT METRICS ===== */}
        <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white">Deployment Metrics</h3>
            <span className="text-[10px] text-slate-600">30-day rolling</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 text-center">
              <div className="text-[9px] text-slate-600 mb-1">MTTR</div>
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-lg font-bold text-green-400"
              >
                12m
              </motion.div>
              <div className="text-[9px] text-slate-600">Mean Time to Recovery</div>
            </div>
            <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 text-center">
              <div className="text-[9px] text-slate-600 mb-1">Deploy Frequency</div>
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-lg font-bold text-brand-light"
              >
                4.2/day
              </motion.div>
              <div className="text-[9px] text-slate-600">Avg deploys per day</div>
            </div>
            <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 text-center">
              <div className="text-[9px] text-slate-600 mb-1">Change Fail Rate</div>
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg font-bold text-yellow-400"
              >
                12%
              </motion.div>
              <div className="text-[9px] text-slate-600">% of deploys causing incidents</div>
            </div>
            <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 text-center">
              <div className="text-[9px] text-slate-600 mb-1">Rollback Trigger</div>
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-lg font-bold text-orange-400"
              >
                8.3%
              </motion.div>
              <div className="text-[9px] text-slate-600">% of deploys rolled back</div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-white/[0.04]">
            <div className="text-[9px] text-slate-600 mb-1.5">Weekly Trend</div>
            <div className="flex items-end gap-1 h-8">
              {[15, 12, 14, 10, 8, 6, 7].map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${val * 5}%` }}
                    transition={{ duration: 0.6, delay: i * 0.08 }}
                    className={`w-full rounded-t-sm ${i === 6 ? 'bg-brand' : 'bg-slate-700'} transition-all`}
                  />
                  <span className={`text-[6px] ${i === 6 ? 'text-brand-light' : 'text-slate-700'}`}>W{i + 1}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[8px] text-slate-700 mt-0.5">
              <span>Incidents decreasing</span>
              <span className="text-green-400">-53% WoW</span>
            </div>
          </div>
        </motion.div>

        {/* ===== SECTION 15: FINAL READINESS GAUGE ===== */}
        <motion.div variants={item} className="rounded-xl border border-white/[0.06] bg-slate-900/50 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white">Final Readiness Assessment</h3>
            <StatusBadge status={readinessScore >= 80 ? 'success' : readinessScore >= 60 ? 'warning' : 'error'} label={readinessScore >= 80 ? 'PROCEED' : readinessScore >= 60 ? 'HOLD' : 'ROLLBACK'} />
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative w-20 h-20 shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgb(51 65 85)" strokeWidth="3" />
                <motion.circle
                  cx="18" cy="18" r="15.5" fill="none"
                  stroke="currentColor" strokeWidth="3" strokeLinecap="round"
                  strokeDasharray="100"
                  initial={{ strokeDashoffset: 100 }}
                  animate={{ strokeDashoffset: 100 - readinessScore }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                  className={readinessScore >= 80 ? 'text-green-400' : readinessScore >= 60 ? 'text-yellow-400' : 'text-red-400'}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1 }}
                  className="text-lg font-bold text-white"
                >
                  {readinessScore}%
                </motion.span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <div className={`h-2 w-2 rounded-full ${readinessScore >= 80 ? 'bg-green-500' : readinessScore >= 60 ? 'bg-yellow-400' : 'bg-red-500'}`} />
                <span className="text-sm font-semibold text-white">
                  {readinessScore >= 80 ? 'Ready to Deploy' : readinessScore >= 60 ? 'Review Required' : 'Do Not Deploy'}
                </span>
              </div>
              <p className="text-[10px] text-slate-500">
                {readinessScore >= 80
                  ? 'All checks passed. Pipeline is clear for production deployment.'
                  : readinessScore >= 60
                  ? 'Some checks require attention. Review risk items before proceeding.'
                  : 'Critical checks failed. Immediate rollback or remediation required.'}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {[
              { label: 'Unit Tests', pass: true },
              { label: 'Integration', pass: true },
              { label: 'Security', pass: true },
              { label: 'Load Tests', pass: false },
              { label: 'Smoke Tests', pass: false },
            ].map((check) => (
              <div key={check.label} className={`rounded-lg border p-2.5 text-center ${
                check.pass ? 'border-green-500/20 bg-green-500/[0.04]' : 'border-yellow-500/20 bg-yellow-500/[0.04]'
              }`}>
                {check.pass ? <CheckCircleIcon /> : <XCircleIcon />}
                <div className={`text-[10px] font-medium mt-0.5 ${check.pass ? 'text-green-400' : 'text-yellow-400'}`}>
                  {check.label}
                </div>
                <div className="text-[8px] text-slate-600">{check.pass ? 'Pass' : 'Warn'}</div>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-white/[0.04] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-600">Recommendation:</span>
              <span className={`text-xs font-bold ${
                readinessScore >= 80 ? 'text-green-400' : readinessScore >= 60 ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {readinessScore >= 80 ? 'PROCEED WITH DEPLOYMENT' : readinessScore >= 60 ? 'HOLD FOR REVIEW' : 'ROLLBACK REQUIRED'}
              </span>
            </div>
            <StatusBadge
              status={readinessScore >= 80 ? 'success' : readinessScore >= 60 ? 'warning' : 'error'}
              label={`Score: ${readinessScore}%`}
            />
          </div>
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="rounded border border-white/[0.06] bg-white/[0.02] p-2">
              <div className="text-[9px] text-slate-600">Code Quality</div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="h-1.5 flex-1 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full w-[85%] bg-green-500 rounded-full" />
                </div>
                <span className="text-[9px] font-medium text-green-400">85%</span>
              </div>
            </div>
            <div className="rounded border border-white/[0.06] bg-white/[0.02] p-2">
              <div className="text-[9px] text-slate-600">Security</div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="h-1.5 flex-1 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full w-[92%] bg-green-500 rounded-full" />
                </div>
                <span className="text-[9px] font-medium text-green-400">92%</span>
              </div>
            </div>
            <div className="rounded border border-white/[0.06] bg-white/[0.02] p-2">
              <div className="text-[9px] text-slate-600">Load Readiness</div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="h-1.5 flex-1 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full w-[55%] bg-yellow-500 rounded-full" />
                </div>
                <span className="text-[9px] font-medium text-yellow-400">55%</span>
              </div>
            </div>
            <div className="rounded border border-white/[0.06] bg-white/[0.02] p-2">
              <div className="text-[9px] text-slate-600">Integration</div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="h-1.5 flex-1 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full w-[78%] bg-green-500 rounded-full" />
                </div>
                <span className="text-[9px] font-medium text-green-400">78%</span>
              </div>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-white/[0.04] flex items-center justify-between text-[10px] text-slate-600">
            <span>Deployment gate: {readinessScore >= 80 ? 'OPEN' : readinessScore >= 60 ? 'REVIEW REQUIRED' : 'BLOCKED'}</span>
            <span className={readinessScore >= 80 ? 'text-green-400' : readinessScore >= 60 ? 'text-yellow-400' : 'text-red-400'}>
              {readinessScore >= 80 ? 'Auto-approve enabled' : readinessScore >= 60 ? 'Manual approval needed' : 'Pipeline halted'}
            </span>
          </div>
        </motion.div>

        {showConfetti && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
          >
            {Array.from({ length: 30 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  opacity: 1,
                  x: Math.random() * window.innerWidth,
                  y: -20,
                  scale: Math.random() * 0.5 + 0.5,
                }}
                animate={{
                  y: window.innerHeight + 20,
                  rotate: Math.random() * 720,
                  opacity: 0,
                }}
                transition={{
                  duration: Math.random() * 2 + 2,
                  repeat: 0,
                  ease: 'linear',
                }}
                className="absolute h-2 w-2 rounded-sm"
                style={{
                  backgroundColor: ['#22c55e', '#06b6d4', '#eab308', '#f97316', '#a855f7'][i % 5],
                }}
              />
            ))}
          </motion.div>
        )}

      </motion.div>
    </Layout>
  )
}
