import ExecutiveSummary from './ExecutiveSummary'
import TeamImpactAnalysis from './TeamImpactAnalysis'
import ReleaseReadiness from './ReleaseReadiness'
import RecommendedActions from './RecommendedActions'
import ImplementationPlan from './ImplementationPlan'

export default function AICTOReportPage({ data }) {
  const cto = data?.ai_cto_report
  if (!cto) return null

  return (
    <div className="space-y-8">
      <div className="animate-fade-up">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/20">
            <svg className="h-4 w-4 text-brand-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">AI CTO Report</h2>
            <p className="text-xs text-base-400">Executive assessment with team impact and readiness scoring</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="lg:col-span-2 animate-fade-up" style={{ animationDelay: '100ms' }}>
          <ExecutiveSummary
            summary={cto.executive_summary}
            metrics={cto.key_metrics}
            recommendation={cto.deploy_recommendation}
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="animate-fade-up" style={{ animationDelay: '150ms' }}>
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <svg className="h-4 w-4 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              <h3 className="text-xs font-medium text-base-300 tracking-wider uppercase">Risk Assessment</h3>
            </div>
            <div className="space-y-2">
              {[
                { label: 'Overall Risk', value: data.risk_score, color: data.risk_score >= 70 ? 'text-danger' : data.risk_score >= 40 ? 'text-warning' : 'text-success' },
                { label: 'Incident Probability', value: data.failure_simulation?.incident_probability || 0, color: (data.failure_simulation?.incident_probability || 0) >= 70 ? 'text-danger' : 'text-warning' },
                { label: 'Confidence', value: data.failure_simulation?.confidence_score || 0, color: (data.failure_simulation?.confidence_score || 0) >= 85 ? 'text-success' : 'text-warning' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3 rounded-lg border border-white/[0.04] bg-white/[0.02] px-3.5 py-2.5">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-base-300">{item.label}</span>
                      <span className={`text-xs font-bold ${item.color}`}>{item.value}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-base-600 overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500" style={{
                        width: `${item.value}%`,
                        backgroundColor: item.color === 'text-danger' ? '#ef4444' : item.color === 'text-warning' ? '#f59e0b' : '#22c55e',
                        opacity: 0.6,
                      }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="animate-fade-up" style={{ animationDelay: '200ms' }}>
          <ReleaseReadiness score={cto.release_readiness} metrics={cto.key_metrics} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="animate-fade-up" style={{ animationDelay: '200ms' }}>
          <TeamImpactAnalysis teams={cto.team_impact} />
        </div>
        <div className="animate-fade-up" style={{ animationDelay: '250ms' }}>
          <RecommendedActions actions={data.recommended_actions} />
        </div>
      </div>

      <div className="animate-fade-up" style={{ animationDelay: '300ms' }}>
        <ImplementationPlan plan={data.implementation_plan} />
      </div>
    </div>
  )
}
