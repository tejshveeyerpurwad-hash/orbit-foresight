import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const links = [
  { to: '/dashboard',         label: 'Dashboard'      },
  { to: '/intelligence',      label: 'Intelligence'   },
  { to: '/time-machine',      label: 'Time Machine'   },
  { to: '/knowledge-graph',   label: 'Dependency Map' },
  { to: '/cto-report',        label: 'Impact'         },
  { to: '/ai-planner',        label: 'AI Planner'     },
  { to: '/execution-planner', label: 'Execute'        },
  { to: '/analytics',         label: 'Analytics'      },
]

export default function Navbar() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)

  return (
    <header
      className="sticky top-0 z-50"
      style={{
        background: 'rgba(10,15,29,0.85)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '0 1px 0 rgba(255,255,255,0.03), 0 4px 24px -8px rgba(6,182,212,0.06)',
      }}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.25), transparent)' }}
      />

      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 relative">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group shrink-0" id="landing-nav-logo">
          <div className="relative flex h-7 w-7 items-center justify-center">
            <div
              className="absolute h-7 w-7 rounded-full"
              style={{
                background: 'rgba(6,182,212,0.15)',
                animation: 'ping-slow-nb 1.8s cubic-bezier(0,0,0.2,1) infinite',
              }}
            />
            <div
              className="relative h-2 w-2 rounded-full"
              style={{
                background: '#06b6d4',
                boxShadow: '0 0 8px rgba(6,182,212,0.7)',
              }}
            />
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-bold tracking-tight text-white leading-none">
              Orbit<span style={{ color: '#22d3ee' }}>Foresight</span>
            </span>
            <span
              className="text-[8px] font-mono tracking-[0.12em] uppercase leading-none mt-0.5"
              style={{ color: '#475569' }}
            >
              Predict Before Production
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-0.5 md:flex" aria-label="Landing navigation">
          {links.map(({ to, label }) => {
            const active = pathname === to
            return (
              <Link
                key={to}
                to={to}
                id={`landing-nav-${label.toLowerCase().replace(/\s+/g, '-')}`}
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '6px 11px',
                  borderRadius: '9px',
                  fontSize: '13px',
                  fontWeight: active ? 600 : 500,
                  color: active ? '#ffffff' : '#94a3b8',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                  letterSpacing: '-0.01em',
                  transition: 'color 0.2s ease, background 0.2s ease',
                  background: active ? 'rgba(6,182,212,0.08)' : 'transparent',
                  border: active ? '1px solid rgba(6,182,212,0.18)' : '1px solid transparent',
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.color = '#e2e8f0'
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.color = '#94a3b8'
                    e.currentTarget.style.background = 'transparent'
                  }
                }}
              >
                {label}
                {active && (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '-1px',
                      left: '20%',
                      right: '20%',
                      height: '2px',
                      borderRadius: '2px',
                      background: 'linear-gradient(90deg, transparent, #06b6d4, transparent)',
                    }}
                  />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Right: CTA + mobile toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/dashboard"
            id="landing-nav-cta"
            className="hidden sm:flex items-center gap-1.5 rounded-[9px] px-3 py-1.5 text-[12px] font-semibold text-white transition-all duration-200 hover:scale-[1.03]"
            style={{
              background: 'linear-gradient(135deg, rgba(6,182,212,0.2), rgba(124,58,237,0.15))',
              border: '1px solid rgba(6,182,212,0.25)',
              boxShadow: '0 0 20px -6px rgba(6,182,212,0.2)',
            }}
          >
            <svg className="h-3.5 w-3.5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
            </svg>
            Open Dashboard
          </Link>

          {/* Mobile toggle */}
          <button
            id="landing-nav-mobile-toggle"
            onClick={() => setOpen(!open)}
            className="md:hidden rounded-lg p-2 transition-all"
            style={{ color: '#64748b' }}
            aria-label="Toggle mobile menu"
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
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t md:hidden"
            style={{ borderColor: 'rgba(255,255,255,0.05)' }}
          >
            <div className="px-4 py-3 space-y-0.5">
              {links.map(({ to, label }) => {
                const active = pathname === to
                return (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setOpen(false)}
                    className="flex items-center rounded-xl px-4 py-2.5 text-sm font-medium transition-all"
                    style={{
                      color: active ? '#ffffff' : '#94a3b8',
                      background: active ? 'rgba(6,182,212,0.08)' : 'transparent',
                      border: active ? '1px solid rgba(6,182,212,0.15)' : '1px solid transparent',
                    }}
                  >
                    {label}
                  </Link>
                )
              })}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes ping-slow-nb {
          0%    { transform: scale(1);   opacity: 0.8; }
          75%,100% { transform: scale(2.2); opacity: 0; }
        }
      `}</style>
    </header>
  )
}
