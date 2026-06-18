import ExecutiveSummary from './ExecutiveSummary'
import TeamImpactAnalysis from './TeamImpactAnalysis'
import ReleaseReadiness from './ReleaseReadiness'

export default function CTOReport({ data }) {
  const cto = data?.ai_cto_report
  if (!cto) return null

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 animate-fade-up">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/20">
          <svg className="h-4 w-4 text-brand-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">AI CTO Report</h2>
          <p className="text-xs text-base-300">Executive summary and release readiness assessment</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="animate-fade-up lg:col-span-2" style={{ animationDelay: '100ms' }}>
          <ExecutiveSummary summary={cto.executive_summary} metrics={cto.key_metrics} recommendation={cto.deploy_recommendation} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="animate-fade-up" style={{ animationDelay: '200ms' }}>
          <TeamImpactAnalysis teams={cto.team_impact} />
        </div>
        <div className="animate-fade-up" style={{ animationDelay: '300ms' }}>
          <ReleaseReadiness score={cto.release_readiness} metrics={cto.key_metrics} />
        </div>
      </div>
    </div>
  )
}
