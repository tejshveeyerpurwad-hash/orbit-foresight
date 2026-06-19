import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: 'M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z' },
  { to: '/intelligence', label: 'Intelligence Center', icon: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z' },
  { to: '/time-machine', label: 'Incident Time Machine', icon: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z' },
  { to: '/ai-planner', label: 'AI Engineering Planner', icon: 'M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12' },
  { to: '/execution-planner', label: 'Execution Planner', icon: 'M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z' },
  { to: '/knowledge-graph', label: 'Knowledge Graph', icon: 'M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z' },
  { to: '/impact-analysis', label: 'Impact Analysis', icon: 'M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6' },
  { to: '/cto-report', label: 'CTO Report', icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z' },
  { to: '/deployment-simulator', label: 'Deployment Simulator', icon: 'M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z' },
  { to: '/analytics', label: 'Analytics', icon: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z' },
  { to: '/help', label: 'Documentation', icon: 'M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25' },
  { to: '/settings', label: 'Settings', icon: 'M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z' },
]

export default function Layout({ children }) {
  const { pathname } = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const currentItem = navItems.find(i => i.to === pathname) || navItems.find(i => pathname.startsWith(i.to) && i.to !== '/dashboard')

  const isActive = (to) => pathname === to || (to !== '/dashboard' && pathname.startsWith(to))

  return (
    <div className="flex min-h-screen bg-slate-950">
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 flex h-full flex-col border-r border-white/[0.06] bg-slate-950/95 backdrop-blur-2xl transition-all duration-300 ease-in-out ${
          sidebarOpen
            ? 'translate-x-0 w-64'
            : collapsed
            ? '-translate-x-full lg:translate-x-0 lg:w-16'
            : '-translate-x-full w-64 lg:translate-x-0 lg:w-64'
        }`}
      >
        {/* Logo */}
        <div className="flex h-14 items-center gap-3 border-b border-white/[0.06] px-4">
          <Link to="/" className="flex items-center gap-2.5 group min-w-0">
            <div className="relative flex h-7 w-7 shrink-0 items-center justify-center">
              <div className="absolute h-7 w-7 rounded-full bg-brand/20 animate-ping-slow" />
              <div className="relative h-2 w-2 rounded-full bg-brand shadow-lg shadow-brand/50" />
            </div>
            <span className={`text-sm font-bold tracking-tight truncate transition-all duration-300 ${
              collapsed ? 'lg:hidden' : ''
            }`}>
              Orbit<span className="text-brand">Foresight</span>
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto rounded-lg p-1.5 text-slate-600 hover:bg-white/[0.06] hover:text-slate-300 lg:hidden"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-0.5 overflow-y-auto p-2.5 scrollbar-thin">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => { if (window.innerWidth < 1024) setSidebarOpen(false) }}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 group ${
                isActive(item.to)
                  ? 'bg-brand/[0.08] text-brand-light shadow-sm shadow-brand/5'
                  : 'text-slate-500 hover:bg-white/[0.04] hover:text-slate-300'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
              </svg>
              <span className={`truncate transition-all duration-300 ${
                collapsed ? 'lg:hidden' : ''
              }`}>{item.label}</span>
              {collapsed && (
                <span className="hidden lg:group-hover:block absolute left-16 bg-slate-800 text-slate-200 text-xs px-2 py-1 rounded-md shadow-xl whitespace-nowrap z-50 border border-white/[0.06]">
                  {item.label}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Bottom */}
        <div className="border-t border-white/[0.06] p-3">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-dark text-[9px] font-bold text-white shadow-sm">
              OF
            </div>
            <div className={`flex-1 min-w-0 transition-all duration-300 ${collapsed ? 'lg:hidden' : ''}`}>
              <div className="text-xs font-medium text-slate-400">Orbit Foresight</div>
              <div className="text-[9px] text-slate-700">v2.4.1 · Enterprise</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className={`flex flex-1 flex-col transition-all duration-300 ${
        collapsed ? 'lg:ml-16' : 'lg:ml-64'
      }`}>
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-white/[0.06] bg-slate-950/80 backdrop-blur-2xl px-4 sm:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-1.5 text-slate-600 hover:bg-white/[0.06] hover:text-slate-300 lg:hidden"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex rounded-lg p-1.5 text-slate-600 hover:bg-white/[0.06] hover:text-slate-300 transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg className={`h-4 w-4 transition-transform duration-200 ${collapsed ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
            </svg>
          </button>

          <div className="flex items-center gap-1 text-xs text-slate-600 min-w-0">
            <span className="hidden sm:inline font-medium">Orbit Foresight</span>
            <span className="hidden sm:inline mx-1.5 text-slate-700">/</span>
            <span className="text-slate-300 truncate">{currentItem?.label || 'Dashboard'}</span>
          </div>

          <div className="flex-1" />

          {/* Search */}
          <div className="relative">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="hidden sm:flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 text-xs text-slate-500 hover:border-white/[0.12] hover:text-slate-400 transition-colors min-w-[180px]"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              Search services, incidents...
              <span className="ml-auto text-[9px] text-slate-700 border border-white/[0.06] rounded px-1">⌘K</span>
            </button>
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="sm:hidden rounded-lg p-1.5 text-slate-600 hover:bg-white/[0.06] hover:text-slate-300"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </button>
            <AnimatePresence>
              {searchOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-white/[0.06] bg-slate-900/95 p-3 shadow-2xl backdrop-blur-2xl"
                >
                  <div className="flex items-center gap-2 border-b border-white/[0.06] pb-2">
                    <svg className="h-4 w-4 text-slate-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                    <input
                      autoFocus
                      placeholder="Search services, incidents, teams..."
                      className="flex-1 bg-transparent text-xs text-slate-300 placeholder-slate-600 outline-none"
                    />
                  </div>
                  <div className="mt-2 space-y-1">
                    {['Payment Service (high risk)', 'Billing Service (medium risk)', 'Auth Service (low risk)', 'Incident #142 - Retry queue overflow'].map((item) => (
                      <button key={item} className="w-full rounded-md px-2 py-1.5 text-left text-xs text-slate-500 hover:bg-white/[0.04] hover:text-slate-300 transition-colors">
                        {item}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative rounded-lg p-1.5 text-slate-600 hover:bg-white/[0.06] hover:text-slate-300 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
              <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-red-500" />
            </button>
            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute right-0 top-full mt-2 w-72 rounded-xl border border-white/[0.06] bg-slate-900/95 p-3 shadow-2xl backdrop-blur-2xl"
                >
                  <h4 className="text-xs font-semibold text-slate-300 mb-2">Notifications</h4>
                  <div className="space-y-1">
                    {[
                      { msg: 'Payment service risk threshold exceeded', time: '2m ago', color: 'text-red-400' },
                      { msg: 'New incident detected in billing pipeline', time: '15m ago', color: 'text-yellow-400' },
                      { msg: 'Deployment to staging completed', time: '1h ago', color: 'text-green-400' },
                    ].map((n, i) => (
                      <div key={i} className="rounded-md px-2 py-2 text-[10px] text-slate-400 hover:bg-white/[0.04] cursor-pointer">
                        <span className={`font-medium ${n.color}`}>● </span>
                        {n.msg}
                        <div className="text-[9px] text-slate-700 mt-0.5">{n.time}</div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* System Status */}
          <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-success/20 bg-success/[0.04] px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-soft" />
            <span className="text-[9px] font-medium text-success">All Systems Operational</span>
          </div>

          {/* Avatar */}
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-dark text-[9px] font-bold text-white shadow-sm">
            OF
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1">
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-white/[0.04] px-4 sm:px-6 lg:px-8 py-4">
          <div className="mx-auto max-w-7xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="relative flex h-4 w-4 items-center justify-center">
                  <div className="absolute h-4 w-4 rounded-full bg-brand/20" />
                  <div className="relative h-1 w-1 rounded-full bg-brand" />
                </div>
                <span className="text-[10px] font-semibold text-slate-500">
                  Orbit<span className="text-brand">Foresight</span>
                </span>
              </div>
              <span className="text-[9px] text-slate-700">© 2026 Orbit Foresight Inc.</span>
            </div>
            <div className="flex items-center gap-3 text-[9px] text-slate-700">
              <Link to="/help" className="hover:text-slate-500 transition-colors">Documentation</Link>
              <span>·</span>
              <Link to="/settings" className="hover:text-slate-500 transition-colors">Settings</Link>
              <span>·</span>
              <span>v2.4.1</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
