import { useState } from 'react'
import { useAnalysis } from '../hooks/useAnalysis'
import DashboardLayout from '../components/DashboardLayout'
import DashboardTabs from '../components/DashboardTabs'
import FeatureRequestInput from '../components/FeatureRequestInput'
import IncidentPredictionCenter from '../components/IncidentPredictionCenter'
import OrbitKnowledgeGraph from '../components/OrbitKnowledgeGraph'
import AICTOReportPage from '../components/AICTOReportPage'
import LoadingSkeleton from '../components/LoadingSkeleton'
import ErrorBanner from '../components/ErrorBanner'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('simulator')
  const { data, loading, error, analyze, reset, presets } = useAnalysis()

  return (
    <DashboardLayout data={{ activeTab, onTabChange: setActiveTab }}>
      <div className="mb-6 animate-fade-up">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl text-white">
          {activeTab === 'simulator' && 'Incident Prediction Center'}
          {activeTab === 'knowledge-graph' && 'Orbit Knowledge Graph'}
          {activeTab === 'cto-report' && 'AI CTO Report'}
        </h1>
        <p className="mt-1 text-sm text-base-400">
          {activeTab === 'simulator' && 'Real-time risk analysis and deployment guidance for your feature changes'}
          {activeTab === 'knowledge-graph' && 'Interactive service topology with risk propagation and blast radius visualization'}
          {activeTab === 'cto-report' && 'Executive summary with team impact analysis and release readiness scoring'}
        </p>
      </div>

      <div className="glass-strong rounded-xl p-4 sm:p-5 mb-8 animate-fade-up" style={{ animationDelay: '50ms' }}>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <FeatureRequestInput onAnalyze={analyze} loading={loading} presets={presets} />
          </div>
          {data && !loading && (
            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center gap-1.5 rounded-full border border-success/20 bg-success/[0.04] px-3 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-soft" />
                <span className="text-[10px] font-medium text-success">Analyzed</span>
              </div>
              <button
                onClick={reset}
                className="rounded-lg border border-white/[0.06] px-3 py-1.5 text-[10px] text-base-400 hover:bg-white/[0.04] hover:text-base-200 transition-colors"
              >
                Reset
              </button>
            </div>
          )}
        </div>
      </div>

      <ErrorBanner message={error} onDismiss={reset} />

      {loading && <LoadingSkeleton />}

      {data && !loading && (
        <>
          <div className="animate-fade-up" style={{ animationDelay: '100ms' }}>
            <DashboardTabs active={activeTab} onChange={setActiveTab} />
          </div>

          {activeTab === 'simulator' && (
            <IncidentPredictionCenter data={data} />
          )}

          {activeTab === 'knowledge-graph' && (
            <OrbitKnowledgeGraph
              services={data.blast_radius_explorer?.services}
              riskPaths={data.blast_radius_explorer?.risk_paths}
            />
          )}

          {activeTab === 'cto-report' && (
            <AICTOReportPage data={data} />
          )}
        </>
      )}
    </DashboardLayout>
  )
}
