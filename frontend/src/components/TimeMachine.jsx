import SimilarMRs from './SimilarMRs'
import FailurePrediction from './FailurePrediction'
import TimeMachineTimeline from './TimeMachineTimeline'

export default function TimeMachine({ data }) {
  const itm = data?.incident_time_machine
  if (!itm) return null

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 animate-fade-up">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/20">
          <svg className="h-4 w-4 text-brand-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Incident Time Machine</h2>
          <p className="text-xs text-base-300">Pattern-matched against {itm.historical_window} of changes</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 animate-fade-up" style={{ animationDelay: '50ms' }}>
        <div className="rounded-lg border border-brand/20 bg-brand/[0.04] px-3 py-1.5 text-xs">
          <span className="text-base-400">Patterns matched: </span>
          <span className="font-semibold text-brand-light">{itm.total_patterns_matched}</span>
        </div>
        <div className="rounded-lg border border-success/20 bg-success/[0.04] px-3 py-1.5 text-xs">
          <span className="text-base-400">Analysis confidence: </span>
          <span className="font-semibold text-success">{itm.analysis_confidence}%</span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="animate-fade-up" style={{ animationDelay: '100ms' }}>
          <SimilarMRs mrs={itm.similar_mrs} />
        </div>
        <div className="animate-fade-up" style={{ animationDelay: '200ms' }}>
          <FailurePrediction predictions={itm.predicted_incidents} confidence={itm.analysis_confidence} />
        </div>
      </div>

      <div className="animate-fade-up" style={{ animationDelay: '250ms' }}>
        <TimeMachineTimeline mrs={itm.similar_mrs} />
      </div>
    </div>
  )
}
