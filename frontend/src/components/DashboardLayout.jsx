import { useState, useEffect } from 'react'
import Sidebar from './Sidebar'

const tabs = [
  { id: 'simulator', label: 'Incident Prediction' },
  { id: 'knowledge-graph', label: 'Knowledge Graph' },
  { id: 'cto-report', label: 'CTO Report' },
]

export default function DashboardLayout({ data, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const contentReady = data && mounted

  return (
    <div className="flex min-h-screen bg-base-900">
      <Sidebar
        activeTab={data?.activeTab || 'simulator'}
        onTabChange={data?.onTabChange || (() => {})}
        collapsed={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex flex-1 flex-col lg:pl-16 xl:pl-64 transition-all duration-300">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-white/[0.06] bg-base-900/80 backdrop-blur-2xl px-4 sm:px-6">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-lg p-1.5 text-base-400 hover:bg-white/[0.06] hover:text-base-100 lg:hidden"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>

          <div className="flex items-center gap-1 text-xs text-base-400">
            <span className="hidden sm:inline">Orbit Foresight</span>
            <span className="hidden sm:inline mx-1.5">/</span>
            <span className="text-base-200">{tabs.find(t => t.id === data?.activeTab)?.label || 'Dashboard'}</span>
          </div>

          <div className="flex-1" />

          {contentReady && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 rounded-full border border-success/20 bg-success/[0.04] px-3 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-soft" />
                <span className="text-[10px] font-medium text-success">Live</span>
              </div>
              <div className="hidden sm:flex h-7 w-7 items-center justify-center rounded-full bg-brand/20 text-[10px] font-bold text-brand-light">
                CT
              </div>
            </div>
          )}

          {!contentReady && (
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-base-500" />
              <span className="text-[10px] text-base-500">No analysis</span>
            </div>
          )}
        </header>

        <main className="flex-1">
          {contentReady ? (
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="mx-auto max-w-7xl">
                {children}
              </div>
            </div>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center min-h-[60vh] px-4">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.03]">
                <svg className="h-10 w-10 text-base-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">No analysis loaded</h3>
              <p className="text-sm text-base-400 text-center max-w-sm">Submit a feature request from the landing page to explore incident prediction, service dependencies, and CTO reports.</p>
              <a
                href="/"
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-brand-dark active:scale-[0.97]"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                Go to Landing
              </a>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
