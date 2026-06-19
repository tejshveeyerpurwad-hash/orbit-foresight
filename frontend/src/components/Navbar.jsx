import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'

const links = [
  { to: '/', label: 'Home' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/intelligence', label: 'Intelligence' },
  { to: '/time-machine', label: 'Time Machine' },
  { to: '/ai-planner', label: 'AI Planner' },
  { to: '/execution-planner', label: 'Execution' },
  { to: '/knowledge-graph', label: 'Knowledge Graph' },
  { to: '/analytics', label: 'Analytics' },
]

export default function Navbar() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.04] bg-slate-950/70 backdrop-blur-2xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="relative flex h-7 w-7 items-center justify-center">
            <div className="absolute h-7 w-7 rounded-full bg-brand/20 animate-ping-slow" />
            <div className="relative h-2 w-2 rounded-full bg-brand shadow-lg shadow-brand/50" />
          </div>
          <span className="text-sm font-bold tracking-tight">
            Orbit<span className="text-brand">Foresight</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 sm:flex">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
                pathname === to
                  ? 'bg-brand/[0.08] text-brand-light'
                  : 'text-slate-600 hover:bg-white/[0.04] hover:text-slate-300'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <button
          onClick={() => setOpen(!open)}
          className="rounded-lg p-2 text-slate-600 hover:bg-white/[0.04] hover:text-slate-300 sm:hidden"
          aria-label="Menu"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <nav className="border-t border-white/[0.04] px-4 pb-4 pt-2 sm:hidden animate-slide-down">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={`block rounded-lg px-4 py-2.5 text-sm font-medium ${
                pathname === to
                  ? 'bg-brand/[0.08] text-brand-light'
                  : 'text-slate-600 hover:bg-white/[0.04] hover:text-slate-300'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}
