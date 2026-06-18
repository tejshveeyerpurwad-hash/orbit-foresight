import { useState } from 'react'

const outcomeColors = {
  incident: { bg: 'bg-danger/10', text: 'text-danger', border: 'border-danger/20', label: 'Incident' },
  near_miss: { bg: 'bg-warning/10', text: 'text-warning', border: 'border-warning/20', label: 'Near Miss' },
  no_incident: { bg: 'bg-success/10', text: 'text-success', border: 'border-success/20', label: 'Safe' },
}

export default function HistoricalIntelligence({ data }) {
  const hi = data?.historical_intelligence
  if (!hi) return null

  return (
    <div className="space-y-8">
      <div className="animate-fade-up">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/20">
            <svg className="h-4 w-4 text-brand-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Historical Intelligence</h2>
            <p className="text-xs text-base-400">Pattern-matched analysis across {hi.total_patterns_matched} historical changes</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          <div className="rounded-lg border border-success/20 bg-success/[0.04] px-3 py-1.5 text-xs">
            <span className="text-base-400">Confidence: </span>
            <span className="font-semibold text-success">{hi.analysis_confidence}%</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="animate-fade-up" style={{ animationDelay: '100ms' }}>
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-medium text-base-300 tracking-wider uppercase">Similar Merge Requests</h3>
              <span className="text-[10px] text-base-500">{hi.similar_mrs?.length || 0} matches</span>
            </div>
            <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
              {hi.similar_mrs?.map((mr, i) => {
                const oc = outcomeColors[mr.outcome] || outcomeColors.no_incident
                return (
                  <div key={i} className="rounded-lg border border-white/[0.04] bg-white/[0.02] p-3 transition-all hover:border-brand/20">
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="rounded bg-brand/10 px-1.5 py-0.5 text-[10px] font-semibold text-brand-light">{mr.mr}</span>
                        <span className="text-[10px] font-mono text-base-500">@{mr.author}</span>
                      </div>
                      <span className="text-[10px] text-base-600">{mr.date}</span>
                    </div>
                    <p className="text-xs text-base-300 leading-relaxed mb-1.5">{mr.description}</p>
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full border px-1.5 py-0.5 text-[9px] font-semibold ${oc.bg} ${oc.text} ${oc.border}`}>
                        {oc.label}
                      </span>
                      <span className="text-[10px] text-base-500">{mr.confidence}% match</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="animate-fade-up space-y-6" style={{ animationDelay: '150ms' }}>
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-medium text-base-300 tracking-wider uppercase">Similar Production Incidents</h3>
              <span className="text-[10px] text-base-500">{hi.similar_incidents?.length || 0} incidents</span>
            </div>
            <div className="space-y-2">
              {hi.similar_incidents?.map((inc, i) => (
                <div key={i} className="rounded-lg border border-danger/10 bg-danger/[0.02] p-3">
                  <div className="flex items-start justify-between mb-1">
                    <span className="text-xs font-semibold text-danger leading-tight">{inc.incident}</span>
                    <span className="text-[10px] text-base-500 shrink-0 ml-2">{inc.date}</span>
                  </div>
                  <p className="text-[10px] text-base-400 leading-relaxed mb-1.5">Root cause: {inc.root_cause}</p>
                  <div className="flex items-center gap-3 text-[10px] text-base-500">
                    <span>Impact: {inc.impact}</span>
                    <span className="text-base-600">|</span>
                    <span>Duration: {inc.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 animate-fade-up" style={{ animationDelay: '200ms' }}>
        <div className="glass-card p-5">
          <h3 className="text-xs font-medium text-base-300 tracking-wider uppercase mb-4">Root Causes</h3>
          <div className="space-y-2">
            {hi.root_causes?.map((rc, i) => {
              const freqColor = rc.frequency === 'high' ? '#ef4444' : '#f59e0b'
              return (
                <div key={i} className="flex items-center gap-3 rounded-lg border border-white/[0.04] bg-white/[0.02] px-3.5 py-2.5">
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: freqColor }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-base-200 truncate">{rc.cause}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-base-500 capitalize">{rc.frequency} frequency</span>
                      <span className="text-base-600">|</span>
                      <span className="text-[10px] text-base-500">{rc.services_affected} services</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-medium text-base-300 tracking-wider uppercase">Lessons Learned</h3>
            <span className="text-[10px] text-base-500">{hi.lessons_learned?.length || 0} items</span>
          </div>
          <div className="space-y-2">
            {hi.lessons_learned?.map((ll, i) => {
              const priColor = ll.priority === 'critical' ? 'bg-danger/10 text-danger border-danger/20' : ll.priority === 'high' ? 'bg-warning/10 text-warning border-warning/20' : 'bg-brand/10 text-brand-light border-brand/20'
              return (
                <div key={i} className="rounded-lg border border-white/[0.04] bg-white/[0.02] p-3">
                  <div className="flex items-start gap-2">
                    <span className={`rounded-full border px-1.5 py-0.5 text-[9px] font-semibold uppercase shrink-0 mt-0.5 ${priColor}`}>
                      {ll.priority}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs text-base-300 leading-relaxed">{ll.lesson}</p>
                      <span className="text-[10px] text-base-500 mt-0.5 block">Team: {ll.team}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
