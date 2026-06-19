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
import Dashboard from './pages/Dashboard'
import IntelligenceCenter from './pages/IntelligenceCenter'
import ChangeImpactAnalysis from './pages/ChangeImpactAnalysis'
import AICTOReport from './pages/AICTOReport'
import DeploymentSimulator from './pages/DeploymentSimulator'
import IncidentTimeMachine from './pages/IncidentTimeMachine'
import AIEngineeringPlanner from './pages/AIEngineeringPlanner'
import OrbitExecutionPlanner from './pages/OrbitExecutionPlanner'
import Settings from './pages/Settings'
import Help from './pages/Help'

const KnowledgeGraph = lazy(() => import('./pages/KnowledgeGraph'))
const Analytics = lazy(() => import('./pages/Analytics'))

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
      <Route path="/dashboard" element={<FadeIn><Dashboard /></FadeIn>} />
      <Route path="/intelligence" element={<FadeIn><IntelligenceCenter /></FadeIn>} />
      <Route path="/knowledge-graph" element={<Suspense fallback={<PageSkeleton />}><FadeIn><KnowledgeGraph /></FadeIn></Suspense>} />
      <Route path="/impact-analysis" element={<FadeIn><ChangeImpactAnalysis /></FadeIn>} />
      <Route path="/cto-report" element={<FadeIn><AICTOReport /></FadeIn>} />
      <Route path="/deployment-simulator" element={<FadeIn><DeploymentSimulator /></FadeIn>} />
      <Route path="/analytics" element={<Suspense fallback={<PageSkeleton />}><FadeIn><Analytics /></FadeIn></Suspense>} />
      <Route path="/time-machine" element={<FadeIn><IncidentTimeMachine /></FadeIn>} />
      <Route path="/ai-planner" element={<FadeIn><AIEngineeringPlanner /></FadeIn>} />
      <Route path="/execution-planner" element={<FadeIn><OrbitExecutionPlanner /></FadeIn>} />
      <Route path="/settings" element={<FadeIn><Settings /></FadeIn>} />
      <Route path="/help" element={<FadeIn><Help /></FadeIn>} />
    </Routes>
  )
}
