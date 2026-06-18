import IncidentProbability from './IncidentProbability'
import ConfidenceScore from './ConfidenceScore'
import DeploymentRecommendation from './DeploymentRecommendation'
import SimilarMRs from './SimilarMRs'
import FailureSimulator from './FailureSimulator'

export default function IncidentPredictionCenter({ data }) {
  const fs = data?.failure_simulation
  const itm = data?.incident_time_machine
  if (!fs) return null

  return (
    <div className="space-y-8">
      <div className="animate-fade-up">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-danger/20">
            <svg className="h-4 w-4 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Incident Prediction Center</h2>
            <p className="text-xs text-base-400">Real-time risk analysis and deployment guidance</p>
          </div>
        </div>

        {itm && (
          <div className="flex flex-wrap gap-2 mt-3">
            <div className="rounded-lg border border-brand/20 bg-brand/[0.04] px-3 py-1.5 text-xs">
              <span className="text-base-400">Patterns matched: </span>
              <span className="font-semibold text-brand-light">{itm.total_patterns_matched}</span>
            </div>
            <div className="rounded-lg border border-success/20 bg-success/[0.04] px-3 py-1.5 text-xs">
              <span className="text-base-400">Confidence: </span>
              <span className="font-semibold text-success">{itm.analysis_confidence}%</span>
            </div>
            <div className="rounded-lg border border-base-500/20 bg-white/[0.03] px-3 py-1.5 text-xs">
              <span className="text-base-400">Window: </span>
              <span className="font-semibold text-base-200">{itm.historical_window}</span>
            </div>
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="animate-fade-up" style={{ animationDelay: '100ms' }}>
          <IncidentProbability pct={fs.incident_probability} />
        </div>
        <div className="animate-fade-up" style={{ animationDelay: '150ms' }}>
          <ConfidenceScore score={fs.confidence_score} />
        </div>
        <div className="animate-fade-up sm:col-span-2" style={{ animationDelay: '200ms' }}>
          <DeploymentRecommendation recommendation={fs.deploy_recommendation} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="animate-fade-up" style={{ animationDelay: '200ms' }}>
          <SimilarMRs mrs={itm?.similar_mrs} />
        </div>
        <div className="space-y-4">
          {fs.failure_reasons?.length > 0 && (
            <div className="animate-fade-up glass-card p-5" style={{ animationDelay: '250ms' }}>
              <div className="flex items-center gap-2 mb-4">
                <svg className="h-4 w-4 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                <h3 className="text-xs font-medium text-base-300 tracking-wider uppercase">Failure Reasons</h3>
              </div>
              <div className="grid gap-2">
                {fs.failure_reasons.map((reason, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-lg border border-white/[0.04] bg-white/[0.02] px-3.5 py-2.5">
                    <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-danger/20">
                      <svg className="h-2 w-2 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                      </svg>
                    </div>
                    <span className="text-sm text-base-300 leading-relaxed">{reason}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {itm?.predicted_incidents?.length > 0 && (
            <div className="animate-fade-up glass-card p-5" style={{ animationDelay: '300ms' }}>
              <div className="flex items-center gap-2 mb-4">
                <svg className="h-4 w-4 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                <h3 className="text-xs font-medium text-base-300 tracking-wider uppercase">Predicted Incidents</h3>
              </div>
              <div className="space-y-2">
                {itm.predicted_incidents.map((p, i) => {
                  const clr = p.severity === 'critical' ? '#ef4444' : p.severity === 'high' ? '#f59e0b' : p.severity === 'medium' ? '#06b6d4' : '#22c55e'
                  return (
                    <div key={i} className="flex items-center gap-3 rounded-lg border border-white/[0.04] bg-white/[0.02] px-3.5 py-2.5">
                      <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: clr }} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-white truncate">{p.incident}</span>
                          <span className="text-[10px] text-base-500 shrink-0">{p.timeframe}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 h-1 rounded-full bg-base-600 overflow-hidden max-w-[120px]">
                            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${p.probability}%`, backgroundColor: clr, opacity: 0.6 }} />
                          </div>
                          <span className="text-[10px] font-mono text-base-400">{p.probability}%</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
