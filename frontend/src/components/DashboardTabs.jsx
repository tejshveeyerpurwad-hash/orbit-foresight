const tabs = [
  { id: 'simulator', label: 'Prediction Center', desc: 'Incident probability, confidence, and recommendations' },
  { id: 'knowledge-graph', label: 'Knowledge Graph', desc: 'Service dependencies, blast radius, risk propagation' },
  { id: 'cto-report', label: 'CTO Report', desc: 'Executive summary, team impact, release readiness' },
]

export default function DashboardTabs({ active, onChange }) {
  return (
    <div className="flex flex-wrap gap-1 border-b border-white/[0.06] mb-8">
      {tabs.map((tab) => {
        const isActive = active === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`relative px-4 py-3 text-left transition-all duration-200 ${
              isActive ? '' : 'hover:bg-white/[0.02]'
            }`}
          >
            <div className={`text-sm font-medium transition-colors duration-200 ${
              isActive ? 'text-brand-light' : 'text-base-400'
            }`}>
              {tab.label}
            </div>
            <div className={`text-[10px] mt-0.5 transition-colors duration-200 ${
              isActive ? 'text-base-500' : 'text-base-600'
            }`}>
              {tab.desc}
            </div>
            {isActive && (
              <div className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-brand" />
            )}
          </button>
        )
      })}
    </div>
  )
}
