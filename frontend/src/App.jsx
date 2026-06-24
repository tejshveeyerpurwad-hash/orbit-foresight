import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, useState, lazy, Suspense } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Landing from './pages/Landing'
import ErrorBoundary from './components/ErrorBoundary'

function PageSkeleton() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand/30 border-t-brand" />
        <div className="text-xs text-slate-600">Loading...</div>
      </div>
    </div>
  )
}
const Dashboard = lazy(() => import('./pages/Dashboard'))
const IntelligenceCenter = lazy(() => import('./pages/IntelligenceCenter'))
const ChangeImpactAnalysis = lazy(() => import('./pages/ChangeImpactAnalysis'))
const AICTOReport = lazy(() => import('./pages/AICTOReport'))
const DeploymentSimulator = lazy(() => import('./pages/DeploymentSimulator'))
const IncidentTimeMachine = lazy(() => import('./pages/IncidentTimeMachine'))
const AIEngineeringPlanner = lazy(() => import('./pages/AIEngineeringPlanner'))
const OrbitExecutionPlanner = lazy(() => import('./pages/OrbitExecutionPlanner'))
const KnowledgeGraph = lazy(() => import('./pages/KnowledgeGraph'))
const Analytics = lazy(() => import('./pages/Analytics'))
const Settings = lazy(() => import('./pages/Settings'))
const Help = lazy(() => import('./pages/Help'))
const DecisionSimulator = lazy(() => import('./pages/DecisionSimulator'))

const pageVariants = {
  initial: { opacity: 0, y: 6, filter: 'blur(2px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -4, filter: 'blur(1px)' },
}

const pageTransition = {
  type: 'spring',
  stiffness: 260,
  damping: 28,
  mass: 0.6,
}

function AnimatedPage({ children }) {
  const location = useLocation()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setReady(false)
    const t = setTimeout(() => setReady(true), 30)
    return () => clearTimeout(t)
  }, [location])

  return (
    <motion.div
      key={location.pathname}
      variants={pageVariants}
      initial="initial"
      animate={ready ? 'animate' : 'initial'}
      exit="exit"
      transition={pageTransition}
      style={{ willChange: 'transform, opacity, filter' }}
    >
      {children}
    </motion.div>
  )
}

export default function App() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<AnimatedPage><Landing /></AnimatedPage>} />
        <Route path="/dashboard" element={<Suspense fallback={<PageSkeleton />}><AnimatedPage><Dashboard /></AnimatedPage></Suspense>} />
        <Route path="/intelligence" element={<Suspense fallback={<PageSkeleton />}><AnimatedPage><IntelligenceCenter /></AnimatedPage></Suspense>} />
        <Route path="/knowledge-graph" element={<Suspense fallback={<PageSkeleton />}><AnimatedPage><KnowledgeGraph /></AnimatedPage></Suspense>} />
        <Route path="/impact-analysis" element={<Suspense fallback={<PageSkeleton />}><AnimatedPage><ChangeImpactAnalysis /></AnimatedPage></Suspense>} />
        <Route path="/cto-report" element={<Suspense fallback={<PageSkeleton />}><AnimatedPage><AICTOReport /></AnimatedPage></Suspense>} />
        <Route path="/deployment-simulator" element={<Suspense fallback={<PageSkeleton />}><AnimatedPage><DeploymentSimulator /></AnimatedPage></Suspense>} />
        <Route path="/analytics" element={<Suspense fallback={<PageSkeleton />}><AnimatedPage><ErrorBoundary><Analytics /></ErrorBoundary></AnimatedPage></Suspense>} />
        <Route path="/time-machine" element={<Suspense fallback={<PageSkeleton />}><AnimatedPage><ErrorBoundary><IncidentTimeMachine /></ErrorBoundary></AnimatedPage></Suspense>} />
        <Route path="/ai-planner" element={<Suspense fallback={<PageSkeleton />}><AnimatedPage><AIEngineeringPlanner /></AnimatedPage></Suspense>} />
        <Route path="/decision-simulator" element={<Suspense fallback={<PageSkeleton />}><AnimatedPage><DecisionSimulator /></AnimatedPage></Suspense>} />
        <Route path="/execution-planner" element={<Suspense fallback={<PageSkeleton />}><AnimatedPage><OrbitExecutionPlanner /></AnimatedPage></Suspense>} />
        <Route path="/settings" element={<Suspense fallback={<PageSkeleton />}><AnimatedPage><Settings /></AnimatedPage></Suspense>} />
        <Route path="/help" element={<Suspense fallback={<PageSkeleton />}><AnimatedPage><Help /></AnimatedPage></Suspense>} />
      </Routes>
    </AnimatePresence>
  )
}