import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, useState, lazy, Suspense } from 'react'
import Landing from './pages/Landing'

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

function FadeIn({ children }) {
  const location = useLocation()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(false)
    const t = setTimeout(() => setVisible(true), 20)
    return () => clearTimeout(t)
  }, [location])

  return (
    <div className={`transition-opacity duration-200 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      {children}
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<FadeIn><Landing /></FadeIn>} />
      <Route path="/dashboard" element={<Suspense fallback={<PageSkeleton />}><FadeIn><Dashboard /></FadeIn></Suspense>} />
      <Route path="/intelligence" element={<Suspense fallback={<PageSkeleton />}><FadeIn><IntelligenceCenter /></FadeIn></Suspense>} />
      <Route path="/knowledge-graph" element={<Suspense fallback={<PageSkeleton />}><FadeIn><KnowledgeGraph /></FadeIn></Suspense>} />
      <Route path="/impact-analysis" element={<Suspense fallback={<PageSkeleton />}><FadeIn><ChangeImpactAnalysis /></FadeIn></Suspense>} />
      <Route path="/cto-report" element={<Suspense fallback={<PageSkeleton />}><FadeIn><AICTOReport /></FadeIn></Suspense>} />
      <Route path="/deployment-simulator" element={<Suspense fallback={<PageSkeleton />}><FadeIn><DeploymentSimulator /></FadeIn></Suspense>} />
      <Route path="/analytics" element={<Suspense fallback={<PageSkeleton />}><FadeIn><Analytics /></FadeIn></Suspense>} />
      <Route path="/time-machine" element={<Suspense fallback={<PageSkeleton />}><FadeIn><IncidentTimeMachine /></FadeIn></Suspense>} />
      <Route path="/ai-planner" element={<Suspense fallback={<PageSkeleton />}><FadeIn><AIEngineeringPlanner /></FadeIn></Suspense>} />
      <Route path="/execution-planner" element={<Suspense fallback={<PageSkeleton />}><FadeIn><OrbitExecutionPlanner /></FadeIn></Suspense>} />
      <Route path="/settings" element={<Suspense fallback={<PageSkeleton />}><FadeIn><Settings /></FadeIn></Suspense>} />
      <Route path="/help" element={<Suspense fallback={<PageSkeleton />}><FadeIn><Help /></FadeIn></Suspense>} />
    </Routes>
  )
}
