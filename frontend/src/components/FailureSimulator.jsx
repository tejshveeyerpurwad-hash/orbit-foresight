import IncidentProbability from './IncidentProbability'
import ConfidenceScore from './ConfidenceScore'
import BlastRadiusViz from './BlastRadiusViz'
import RiskTimeline from './RiskTimeline'
import DeploymentRecommendation from './DeploymentRecommendation'
import RiskHeatmap from './RiskHeatmap'

export default function FailureSimulator({ data }) {
  if (!data?.failure_simulation) return null

  const fs = data.failure_simulation

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 animate-fade-up">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-danger/20">
          <svg className="h-4 w-4 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Failure Simulator</h2>
          <p className="text-xs text-base-300">Predictive incident analysis for this change</p>
        </div>
      </div>

      <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="animate-fade-up" style={{ animationDelay: '100ms' }}>
          <IncidentProbability pct={fs.incident_probability} />
        </div>
        <div className="animate-fade-up" style={{ animationDelay: '200ms' }}>
          <ConfidenceScore score={fs.confidence_score} />
        </div>
        <div className="animate-fade-up sm:col-span-2 lg:col-span-2" style={{ animationDelay: '300ms' }}>
          <DeploymentRecommendation recommendation={fs.deploy_recommendation} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="animate-fade-up" style={{ animationDelay: '200ms' }}>
          <BlastRadiusViz items={fs.blast_radius} />
        </div>
        <div className="animate-fade-up" style={{ animationDelay: '300ms' }}>
          <RiskTimeline timeline={fs.risk_timeline} />
        </div>
      </div>

      {fs.failure_reasons?.length > 0 && (
        <div className="animate-fade-up glass rounded-2xl p-6 glass-hover" style={{ animationDelay: '250ms' }}>
          <h3 className="text-xs font-medium text-base-300 tracking-wider uppercase mb-4">Failure Reasons</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {fs.failure_reasons.map((reason, i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl border border-white/[0.04] bg-white/[0.02] px-4 py-3">
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-danger/20">
                  <svg className="h-3 w-3 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                </div>
                <span className="text-sm text-base-300 leading-relaxed">{reason}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="animate-fade-up" style={{ animationDelay: '350ms' }}>
        <RiskHeatmap />
      </div>
    </div>
  )
}
