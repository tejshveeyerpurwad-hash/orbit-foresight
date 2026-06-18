import { Link, useLocation, useNavigate } from 'react-router-dom'

const navItems = [
  {
    id: 'simulator',
    label: 'Incident Prediction',
    icon: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z',
  },
  {
    id: 'knowledge-graph',
    label: 'Knowledge Graph',
    icon: 'M9.75 3.75v2.25m0 0V9m0-3.75h2.25M9.75 3.75h-2.25m0 0A2.25 2.25 0 005.25 6v.75m0 0A2.25 2.25 0 003 9v6.75A2.25 2.25 0 005.25 18h13.5A2.25 2.25 0 0021 15.75V9a2.25 2.25 0 00-2.25-2.25h-.75m0 0V6a2.25 2.25 0 00-2.25-2.25h-2.25m2.25 0V3.75',
  },
  {
    id: 'cto-report',
    label: 'CTO Report',
    icon: 'M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5',
  },
]

export default function Sidebar({ activeTab, onTabChange, collapsed, onToggle }) {
  const navigate = useNavigate()

  return (
    <>
      {collapsed && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" onClick={onToggle} />
      )}

      <aside className={`fixed top-0 left-0 z-50 flex h-full flex-col border-r border-white/[0.06] bg-base-900/95 backdrop-blur-2xl transition-all duration-300 ease-in-out ${
        collapsed ? 'translate-x-0 w-64' : '-translate-x-full w-64 lg:translate-x-0 lg:w-16 xl:w-64 lg:group-hover:w-64'
      }`}>

        <div className="flex h-14 items-center gap-3 border-b border-white/[0.06] px-4">
          <button onClick={() => navigate('/')} className="flex items-center gap-2.5 group min-w-0">
            <div className="relative flex h-7 w-7 shrink-0 items-center justify-center">
              <div className="absolute h-7 w-7 rounded-full bg-brand/20 animate-ping-slow" />
              <div className="relative h-2 w-2 rounded-full bg-brand shadow-lg shadow-brand/50" />
            </div>
            <span className="text-sm font-bold tracking-tight truncate lg:hidden xl:block">
              Orbit<span className="text-brand">Foresight</span>
            </span>
          </button>
          <button onClick={onToggle} className="ml-auto rounded-lg p-1.5 text-base-400 hover:bg-white/[0.06] hover:text-base-100 lg:hidden">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { onTabChange(item.id); if (window.innerWidth < 1024) onToggle() }}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                activeTab === item.id
                  ? 'bg-brand/[0.08] text-brand-light'
                  : 'text-base-400 hover:bg-white/[0.04] hover:text-base-100'
              }`}
            >
              <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
              </svg>
              <span className="lg:hidden xl:block truncate">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="border-t border-white/[0.06] p-3">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand/20 text-[10px] font-bold text-brand-light">
              CT
            </div>
            <div className="flex-1 min-w-0 lg:hidden xl:block">
              <div className="text-xs font-medium text-base-200 truncate">CTO Dashboard</div>
              <div className="text-[10px] text-base-500">Engineering Leaders</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
