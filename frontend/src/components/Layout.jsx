import { useState, useEffect, useCallback } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import QuickActionBar from './QuickActionBar'
import Footer from './Footer'

const workflow = [
  { to: '/dashboard', label: 'Situation', shortcut: '⌘1', stage: 1, desc: 'What is happening right now?' },
  { to: '/intelligence', label: 'Investigate', shortcut: '⌘2', stage: 2, desc: 'Find the root cause' },
  { to: '/time-machine', label: 'Time Machine', shortcut: '⌘3', stage: 3, desc: 'Replay incident history' },
  { to: '/knowledge-graph', label: 'Dependency Map', shortcut: '⌘4', stage: 4, desc: 'Map the blast radius' },
  { to: '/cto-report', label: 'Impact', shortcut: '⌘5', stage: 5, desc: 'Quantify business cost' },
  { to: '/execution-planner', label: 'Execute', shortcut: '⌘6', stage: 6, desc: 'Deploy the fix' },
]

const storyNarrative = [
  'anomalies detected',
  'root cause identified',
  'historical match found',
  'blast radius mapped',
  'business impact estimated',
  'remediation plan ready',
]

const sidebarNav = [
  { to: '/dashboard', label: 'Dashboard', icon: 'M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z' },
  { to: '/intelligence', label: 'Investigate', icon: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z' },
  { to: '/time-machine', label: 'Time Machine', icon: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z' },
  { to: '/knowledge-graph', label: 'Dependency Map', icon: 'M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z' },
  { to: '/cto-report', label: 'Impact', icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z' },
  { to: '/execution-planner', label: 'Execute', icon: 'M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z' },
  { to: '/analytics', label: 'Analytics', icon: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z' },
  { to: '/help', label: 'Documentation', icon: 'M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25' },
  { to: '/settings', label: 'Settings', icon: 'M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z' },
]

export default function Layout({ children }) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [presentMode, setPresentMode] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('present') === '1') {
      setPresentMode(true)
    }
  }, [])

  const isActive = (to) => pathname === to || (to !== '/dashboard' && pathname.startsWith(to))

  const currentSlideIdx = workflow.findIndex(n => pathname.startsWith(n.to) || pathname === n.to)
  const spotlightX = currentSlideIdx >= 0 ? ((currentSlideIdx + 0.5) / workflow.length) * 100 : 50

  const goToSlide = useCallback((direction) => {
    const nextIdx = currentSlideIdx + direction
    if (nextIdx >= 0 && nextIdx < workflow.length) {
      navigate(workflow[nextIdx].to + '?present=1')
    }
  }, [currentSlideIdx, navigate])

  useEffect(() => {
    if (!presentMode) return
    const handler = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault()
        goToSlide(1)
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        goToSlide(-1)
      } else if (e.key === 'Escape') {
        setPresentMode(false)
        const p = new URLSearchParams(window.location.search)
        p.delete('present')
        const qs = p.toString()
        navigate(pathname + (qs ? '?' + qs : ''), { replace: true })
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [presentMode, goToSlide, navigate, pathname])

  const togglePresentMode = useCallback(() => {
    setPresentMode(prev => {
      const next = !prev
      const p = new URLSearchParams(window.location.search)
      if (next) {
        p.set('present', '1')
      } else {
        p.delete('present')
      }
      const qs = p.toString()
      const newUrl = pathname + (qs ? '?' + qs : '')
      window.history.replaceState(null, '', newUrl)
      return next
    })
  }, [pathname])

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }, [])

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', handler)
    return () => document.removeEventListener('fullscreenchange', handler)
  }, [])

  const slideNavItems = workflow

  return (
    <div className="flex min-h-screen bg-slate-950">
      <style>{`
        @keyframes particle-flow {
          0% { transform: translateX(0) translateY(-50%); opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { transform: translateX(14px) translateY(-50%); opacity: 0; }
        }
        @keyframes shine-sweep {
          0% { transform: translateX(-100%) rotate(25deg); }
          50% { transform: translateX(300%) rotate(25deg); }
          100% { transform: translateX(300%) rotate(25deg); }
        }
        @keyframes ticker-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        @keyframes gradient-border {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes float-particle {
          0% { transform: translate(0, 0) scale(0); opacity: 0; }
          20% { opacity: 0.5; transform: translate(30px, -20px) scale(1); }
          80% { opacity: 0.5; }
          100% { transform: translate(80px, -50px) scale(0.3); opacity: 0; }
        }
        @keyframes float-particle-2 {
          0% { transform: translate(0, 0) scale(0); opacity: 0; }
          20% { opacity: 0.4; transform: translate(-40px, -30px) scale(1); }
          80% { opacity: 0.4; }
          100% { transform: translate(-100px, -60px) scale(0.3); opacity: 0; }
        }
        @keyframes pulse-soft {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.85; }
        }
        @keyframes data-packet {
          0% { left: -4px; opacity: 0; width: 3px; height: 3px; }
          15% { opacity: 1; }
          50% { width: 4px; height: 4px; }
          85% { opacity: 1; }
          100% { left: calc(100% + 4px); opacity: 0; width: 3px; height: 3px; }
        }
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 18px -4px rgba(6,182,212,0.15); }
          50% { box-shadow: 0 0 35px -4px rgba(6,182,212,0.35); }
        }
        @keyframes stat-update {
          0% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
          100% { opacity: 0.4; transform: scale(1); }
        }
        .header-grid {
          background-image:
            linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px);
          background-size: 48px 48px;
        }
        .animate-particle-flow { animation: particle-flow 1.8s ease-in-out infinite; }
        .animate-particle-flow-2 { animation: particle-flow 2.4s ease-in-out infinite; }
        .animate-particle-flow-3 { animation: particle-flow 3s ease-in-out infinite; }
        .animate-shine-sweep { animation: shine-sweep 5s ease-in-out infinite; }
        .animate-ticker-scroll { animation: ticker-scroll 50s linear infinite; }
        .animate-gradient-border { background-size: 200% 200%; animation: gradient-border 4s ease infinite; }
        .animate-float-particle { animation: float-particle 7s ease-in-out infinite; }
        .animate-float-particle-2 { animation: float-particle-2 9s ease-in-out infinite; }
        .animate-pulse-soft { animation: pulse-soft 2.5s ease-in-out infinite; }
        .animate-data-packet { animation: data-packet 1.8s ease-in-out infinite; }
        .animate-data-packet-2 { animation: data-packet 2.6s ease-in-out infinite; }
        .animate-data-packet-3 { animation: data-packet 3.4s ease-in-out infinite; }
        .animate-glow-pulse { animation: glow-pulse 3s ease-in-out infinite; }
        .animate-stat-update { animation: stat-update 1.5s ease-in-out infinite; }
      `}</style>

      {/* Present mode overlay chrome */}
      {presentMode && (
        <>
          {/* Top bar — minimal slide info */}
          <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-2 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
            <div className="flex items-center gap-2 pointer-events-auto">
              <div className="relative flex h-5 w-5 items-center justify-center">
                <div className="absolute h-5 w-5 rounded-full bg-brand/20" />
                <div className="relative h-1.5 w-1.5 rounded-full bg-brand" />
              </div>
              <span className="text-[9px] font-bold text-white/80">Orbit<span className="text-brand">Foresight</span></span>
              <span className="text-[7px] text-slate-600 font-mono">PRESENTATION</span>
            </div>
            <div className="flex items-center gap-2 pointer-events-auto">
              <div className="flex items-center gap-1.5 text-[8px] font-mono text-slate-500">
                <span>{currentSlideIdx >= 0 ? currentSlideIdx + 1 : '-'}</span>
                <span className="text-slate-700">/</span>
                <span>{slideNavItems.length}</span>
              </div>
              <button
                onClick={() => { navigate('/dashboard'); togglePresentMode() }}
                className="rounded-lg px-2 py-1 text-[8px] border border-white/[0.10] text-slate-400 hover:text-white hover:border-white/[0.20] transition-all"
              >
                Exit Present
              </button>
            </div>
          </div>

          {/* Slide progress bar */}
          <div className="fixed bottom-0 left-0 right-0 z-50 h-1 bg-slate-900">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-600"
              initial={false}
              animate={{ width: `${((currentSlideIdx + 1) / slideNavItems.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Bottom controls */}
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-slate-950/90 backdrop-blur-xl border border-white/[0.08] rounded-full px-3 py-1.5 shadow-2xl">
            <button
              onClick={() => goToSlide(-1)}
              disabled={currentSlideIdx <= 0}
              className="flex items-center gap-1 rounded-lg px-2 py-1 text-[9px] text-slate-500 hover:text-cyan-400 hover:bg-white/[0.06] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
              Prev
            </button>

            <div className="flex items-center gap-1">
              {slideNavItems.map((n, i) => (
                <div
                  key={n.to}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    i === currentSlideIdx
                      ? 'w-5 bg-cyan-400'
                      : i < currentSlideIdx
                      ? 'w-1.5 bg-emerald-500/60'
                      : 'w-1.5 bg-slate-700 hover:bg-slate-600'
                  }`}
                  onClick={() => navigate(n.to + '?present=1')}
                />
              ))}
            </div>

            <button
              onClick={() => goToSlide(1)}
              disabled={currentSlideIdx >= slideNavItems.length - 1}
              className="flex items-center gap-1 rounded-lg px-2 py-1 text-[9px] text-slate-500 hover:text-cyan-400 hover:bg-white/[0.06] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </>
      )}

      {/* Mobile sidebar overlay — hidden in present mode */}
      {!presentMode && (
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>
      )}

      {/* Side drawer — hidden in present mode */}
      <aside className={`fixed top-0 left-0 z-50 flex h-full w-64 flex-col border-r border-white/[0.06] bg-slate-950/95 backdrop-blur-2xl transition-transform duration-300 md:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} ${presentMode ? 'hidden' : ''}`}>
        <div className="flex h-14 items-center justify-between border-b border-white/[0.06] px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="relative flex h-7 w-7 items-center justify-center"><div className="absolute h-7 w-7 rounded-full bg-brand/20 animate-ping-slow" /><div className="relative h-2 w-2 rounded-full bg-brand shadow-lg shadow-brand/50" /></div>
            <span className="text-sm font-bold">Orbit<span className="text-brand">Foresight</span></span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="rounded-lg p-1.5 text-slate-600 hover:bg-white/[0.06]"><svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
        </div>
        <nav className="flex-1 space-y-0.5 overflow-y-auto p-2.5">
          {sidebarNav.map((item) => (
            <Link key={item.to} to={item.to} onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                isActive(item.to) ? 'bg-brand/[0.08] text-brand-light' : 'text-slate-500 hover:bg-white/[0.04] hover:text-slate-300'
              }`}
            >
              <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={item.icon} /></svg>
              <span className="truncate">{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main area */}
      <div className="flex flex-1 flex-col min-w-0">

        {/* ===== COMMAND BAR — hidden in present mode ===== */}
        {!presentMode && (
          <header className="sticky top-0 z-30 flex h-11 items-center gap-2 border-b border-white/[0.06] bg-slate-950/75 backdrop-blur-2xl px-2 sm:px-3 shadow-[0_1px_0_rgba(255,255,255,0.03),0_4px_24px_-8px_rgba(6,182,212,0.06)] before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-cyan-500/20 before:to-transparent">

            {/* HEADER ATMOSPHERE */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
              <div className="absolute inset-0 header-grid opacity-40" />
              <div className="absolute inset-0 transition-all duration-700 ease-out" style={{ background: `radial-gradient(ellipse 400px 50px at ${spotlightX}% 50%, rgba(6,182,212,0.08) 0%, transparent 70%)` }} />
              <div className="absolute top-1/4 left-[10%] h-1 w-1 rounded-full bg-cyan-400/30 animate-float-particle" />
              <div className="absolute top-1/3 left-[40%] h-0.5 w-0.5 rounded-full bg-blue-400/30 animate-float-particle-2" />
              <div className="absolute top-1/2 left-[65%] h-0.5 w-0.5 rounded-full bg-cyan-300/20 animate-float-particle" style={{ animationDelay: '3s' }} />
              <div className="absolute top-1/4 left-[88%] h-1 w-1 rounded-full bg-cyan-500/20 animate-float-particle-2" style={{ animationDelay: '5s' }} />
            </div>

            {/* LEFT: Logo + Status */}
            <div className="flex items-center gap-2 shrink-0 relative z-10">
              <button onClick={() => setSidebarOpen(true)} className="md:hidden rounded-lg p-1 text-slate-600 hover:bg-white/[0.06]">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
              </button>
              <Link to="/" className="flex items-center gap-1.5 group shrink-0">
                <div className="relative flex h-6 w-6 items-center justify-center">
                  <div className="absolute h-6 w-6 rounded-full bg-brand/20 animate-ping-slow" />
                  <div className="relative h-1.5 w-1.5 rounded-full bg-brand shadow-lg shadow-brand/50" />
                </div>
                <span className="text-[11px] font-bold tracking-tight hidden sm:inline">Orbit<span className="text-brand">Foresight</span></span>
              </Link>
              <div className="h-4 w-px bg-white/[0.06]" />
              <div className="hidden sm:flex items-center gap-1.5 rounded-md border border-emerald-500/15 bg-emerald-500/[0.04] px-1.5 py-0.5 shadow-[0_0_12px_-4px_rgba(52,211,153,0.12)]">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                  <span className="absolute inline-flex h-full w-8 rounded-full bg-emerald-400/20 blur-sm" style={{ width: '10px', height: '10px', top: '-3.5px', left: '-3.5px' }} />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.5)]" />
                </span>
                <span className="text-[8px] font-mono text-emerald-300 font-semibold tracking-wider">LIVE</span>
              </div>
              <div className="hidden sm:flex items-center gap-1">
                <span className="relative flex h-1.5 w-1.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-500 opacity-75" /><span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan-500" /></span>
                <span className="text-[8px] font-mono text-cyan-400/80 font-semibold tracking-wider">AI</span>
              </div>
            </div>

            {/* CENTER: Premium workflow navigation with animated intelligence pipeline */}
            <nav className="hidden md:flex items-center mx-auto relative z-10">
              {workflow.map((item, i) => {
                const active = isActive(item.to)
                const isDone = workflow.findIndex(n => isActive(n.to)) > i
                return (
                  <div key={item.to} className="flex items-center">
                    <Link
                      to={item.to}
                      className={`group relative flex items-center gap-1.5 rounded-lg px-2 py-1 text-[9px] font-medium whitespace-nowrap transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] ${
                        active
                          ? 'text-cyan-200 hover:text-white'
                          : 'text-slate-500 hover:text-slate-200'
                      }`}
                    >
                      {/* Stage number with premium styling */}
                      <span className={`relative z-10 flex h-4 w-4 items-center justify-center rounded-full text-[6px] font-bold font-mono transition-all duration-300 ${
                        active
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30'
                          : isDone
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                          : 'bg-slate-800/50 text-slate-600 border border-slate-700'
                      }`}>
                        {isDone ? (
                          <svg className="h-2 w-2 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        ) : (
                          item.stage
                        )}
                      </span>

                      {/* Active stage: animated gradient border glow + pulsing ring + neon shadow */}
                      {active && (
                        <>
                          <motion.div
                            layoutId="nav-glow"
                            className="absolute inset-0 rounded-lg bg-gradient-to-br from-cyan-500/12 to-blue-600/8 border border-cyan-400/25 shadow-[0_0_20px_-4px_rgba(6,182,212,0.15),inset_0_1px_0_rgba(255,255,255,0.06)]"
                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                          />
                          <div className="absolute -inset-1.5 rounded-xl bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-cyan-500/20 animate-gradient-border opacity-60 blur-[3px]" />
                          <motion.div
                            animate={{ boxShadow: ['0 0 18px -4px rgba(6,182,212,0.15)', '0 0 35px -4px rgba(6,182,212,0.35)', '0 0 18px -4px rgba(6,182,212,0.15)'] }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                            className="absolute inset-0 rounded-lg"
                          />
                          {/* Live indicator dot */}
                          <span className="absolute -top-0.5 -right-0.5 flex h-1.5 w-1.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
                            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan-400" />
                          </span>
                        </>
                      )}

                      {/* Hover glow + underline (inactive) */}
                      {!active && (
                        <>
                          <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/[0.03] border border-white/[0.06]" />
                          <div className="absolute bottom-0 left-2 right-2 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 scale-x-0 group-hover:scale-x-100 origin-center" />
                        </>
                      )}

                      {/* Label */}
                      <span className="relative z-10">{item.label}</span>
                    </Link>

                    {/* Animated intelligence pipeline connector */}
                    {i < workflow.length - 1 && (
                      <div className="relative w-5 mx-0.5">
                        {/* Base connector line */}
                        <div className={`h-px rounded-full transition-colors duration-500 ${
                          isDone
                            ? 'bg-emerald-500/60'
                            : active
                            ? 'bg-gradient-to-r from-cyan-500/50 via-blue-500/30 to-slate-700'
                            : 'bg-slate-800'
                        }`} />
                        {/* Flowing data packets (visible when reached or active) */}
                        {(isDone || active) && (
                          <div className="absolute inset-0 overflow-hidden">
                            <div className="absolute top-1/2 -translate-y-1/2 h-1 w-1 rounded-full bg-cyan-400 shadow-[0_0_4px_rgba(6,182,212,0.6)] animate-data-packet" />
                            <div className="absolute top-1/2 -translate-y-1/2 h-0.5 w-0.5 rounded-full bg-cyan-300 shadow-[0_0_3px_rgba(6,182,212,0.4)] animate-data-packet-2" />
                            <div className="absolute top-1/2 -translate-y-1/2 h-0.5 w-0.5 rounded-full bg-blue-400 shadow-[0_0_3px_rgba(59,130,246,0.4)] animate-data-packet-3" />
                          </div>
                        )}
                        {/* Completion checkpoint */}
                        {isDone && (
                          <div className="absolute -right-0.5 top-1/2 -translate-y-1/2">
                            <div className="h-1 w-1 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]" />
                            <div className="absolute -inset-1 rounded-full bg-emerald-400/20 animate-ping" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </nav>

            {/* RIGHT: Premium glass stats + cyber present + mission hub */}
            <div className="flex items-center gap-1.5 shrink-0 relative z-10">

              {/* Premium glass stats badges */}
              <div className="hidden lg:flex items-center gap-2 mr-1">
                {[
                  { label: 'Analyses', value: '847', color: 'cyan', icon: 'M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125' },
                  { label: 'Accuracy', value: '94%', color: 'emerald', icon: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z' },
                  { label: 'ROI', value: '320%', color: 'amber', icon: 'M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941' },
                ].map(s => {
                  const c = {
                    cyan: { border: 'border-cyan-500/20', bg: 'bg-cyan-500/[0.04]', text: 'text-cyan-400', stext: 'text-cyan-600', hborder: 'hover:border-cyan-400/40', hbg: 'hover:bg-cyan-500/[0.08]', ping: 'bg-cyan-500' },
                    emerald: { border: 'border-emerald-500/20', bg: 'bg-emerald-500/[0.04]', text: 'text-emerald-400', stext: 'text-emerald-600', hborder: 'hover:border-emerald-400/40', hbg: 'hover:bg-emerald-500/[0.08]', ping: 'bg-emerald-500' },
                    amber: { border: 'border-amber-500/20', bg: 'bg-amber-500/[0.04]', text: 'text-amber-400', stext: 'text-amber-600', hborder: 'hover:border-amber-400/40', hbg: 'hover:bg-amber-500/[0.08]', ping: 'bg-amber-500' },
                  }[s.color]
                  return (
                    <div key={s.label} className={`group relative flex items-center gap-1.5 rounded-lg border ${c.border} ${c.bg} backdrop-blur-sm px-2.5 py-1 ${c.hborder} ${c.hbg} hover:translate-y-[-1px] hover:shadow-[0_0_24px_-10px_rgba(255,255,255,0.15)] transition-all duration-300 cursor-default`}>
                      <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-white/[0.04] to-transparent" />
                      <span className="relative flex h-1.5 w-1.5">
                        <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${c.ping} opacity-60`} />
                        <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${c.ping}`} />
                      </span>
                      <svg className={`h-2.5 w-2.5 ${c.text} opacity-50 group-hover:opacity-80 transition-opacity`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={s.icon} />
                      </svg>
                      <span className={`text-[7px] font-mono font-semibold ${c.stext}`}>{s.label}</span>
                      <span className={`text-[10px] font-bold font-mono ${c.text} tabular-nums`}>{s.value}</span>
                    </div>
                  )
                })}
              </div>

              {/* Search */}
              <button
                onClick={() => { setSearchOpen(!searchOpen) }}
                className="hidden sm:flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.03] px-2 py-1 text-[8px] text-slate-500 hover:border-cyan-500/30 hover:bg-cyan-500/[0.04] hover:text-cyan-300 hover:shadow-[0_0_12px_-4px_rgba(6,182,212,0.15)] transition-all duration-300 group"
              >
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <span className="text-[6px] text-slate-700 border border-white/[0.06] rounded px-0.5 group-hover:border-cyan-500/20 group-hover:text-cyan-500/60 transition-all">⌘K</span>
              </button>

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="hidden sm:flex rounded-lg p-1 text-slate-600 hover:bg-white/[0.06] hover:text-cyan-400 hover:shadow-[0_0_12px_-4px_rgba(6,182,212,0.12)] transition-all duration-300"
                title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  {isFullscreen
                    ? <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
                    : <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />}
                </svg>
              </button>

              {/* Premium present button with shine sweep */}
              <button
                onClick={togglePresentMode}
                className={`group relative overflow-hidden flex items-center gap-1 rounded-lg border px-2 py-1 text-[8px] font-medium transition-all duration-300 hover:scale-[1.04] active:scale-[0.97] ${
                  presentMode
                    ? 'border-cyan-400/30 bg-cyan-400/10 text-cyan-200 shadow-[0_0_20px_-4px_rgba(6,182,212,0.25)]'
                    : 'hidden sm:flex border-cyan-500/20 text-slate-500 hover:text-cyan-300 hover:border-cyan-400/30 hover:bg-cyan-500/[0.05] hover:shadow-[0_0_24px_-6px_rgba(6,182,212,0.25)]'
                }`}
              >
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="absolute -inset-4 w-12 bg-gradient-to-r from-transparent via-white/12 to-transparent animate-shine-sweep skew-y-[25deg]" />
                </div>
                <svg className="h-3 w-3 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
                </svg>
                <span className="relative z-10">Present</span>
              </button>

              {/* Mission Status Hub — replaces Impact button */}
              <div className="group relative">
                <div className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 px-2 py-1 cursor-default hover:border-cyan-400/30 hover:shadow-[0_0_24px_-8px_rgba(6,182,212,0.2)] transition-all duration-300">
                  <div className="relative flex h-3.5 w-3.5 items-center justify-center">
                    <svg className="absolute inset-0 h-3.5 w-3.5 -rotate-90" viewBox="0 0 14 14">
                      <circle cx="7" cy="7" r="5.5" fill="none" stroke="rgba(6,182,212,0.15)" strokeWidth="1.5" />
                      <circle cx="7" cy="7" r="5.5" fill="none" stroke="rgb(6,182,212)" strokeWidth="1.5" strokeDasharray={`${(currentSlideIdx >= 0 ? ((currentSlideIdx + 1) / workflow.length) * 100 : 0)} 100`} strokeLinecap="round" className="transition-all duration-500" />
                    </svg>
                    <span className="text-[5px] font-bold font-mono text-cyan-300 tabular-nums">{currentSlideIdx >= 0 ? Math.round(((currentSlideIdx + 1) / workflow.length) * 100) : 0}%</span>
                  </div>
                  <span className="text-[7px] font-mono font-semibold text-cyan-400">Mission</span>
                </div>
                {/* Hover checklist dropdown */}
                <div className="absolute right-0 top-full mt-1.5 w-52 origin-top-right opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-1 group-hover:translate-y-0 z-50">
                  <div className="rounded-xl border border-white/[0.08] bg-slate-950/95 backdrop-blur-2xl shadow-2xl shadow-black/50 p-2.5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[7px] font-mono font-bold text-slate-400 uppercase tracking-wider">Mission Status</span>
                      <span className="text-[7px] font-mono text-cyan-400 font-semibold tabular-nums">{currentSlideIdx >= 0 ? Math.round(((currentSlideIdx + 1) / workflow.length) * 100) : 0}%</span>
                    </div>
                    <div className="h-0.5 rounded-full bg-slate-800 mb-2.5 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600"
                        initial={false}
                        animate={{ width: `${currentSlideIdx >= 0 ? ((currentSlideIdx + 1) / workflow.length) * 100 : 0}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <div className="space-y-1">
                      {workflow.map((w, i) => {
                        const done = i <= currentSlideIdx
                        const isNow = i === currentSlideIdx
                        return (
                          <div key={w.to} className={`flex items-center gap-1.5 ${isNow ? 'text-cyan-300' : done ? 'text-emerald-400/80' : 'text-slate-600'}`}>
                            <div className={`flex h-3 w-3 items-center justify-center rounded-full ${done ? 'bg-emerald-500/20' : 'bg-slate-800'}`}>
                              {done ? (
                                <svg className="h-2 w-2 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                              ) : (
                                <div className="h-1 w-1 rounded-full bg-slate-600" />
                              )}
                            </div>
                            <span className="text-[7px] font-mono">{w.label}</span>
                            {isNow && <span className="ml-auto text-[5px] font-mono text-cyan-400/60">ACTIVE</span>}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Avatar */}
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-dark text-[7px] font-bold text-white shadow-[0_0_12px_-2px_rgba(139,92,246,0.25)]">
                OF
              </div>
            </div>
          </header>
        )}

        {/* Executive story bar + live intelligence ribbon + prev/next — hidden in present mode */}
        {!presentMode && (
          <div className="sticky top-11 z-20 border-b border-white/[0.04] bg-slate-950/70 backdrop-blur-xl overflow-hidden shadow-[0_1px_0_rgba(255,255,255,0.03)]">
            {/* Live intelligence ribbon (auto-scrolling ticker) */}
            <div className="relative h-4 overflow-hidden border-b border-white/[0.02] bg-gradient-to-r from-cyan-500/[0.02] via-blue-600/[0.02] to-cyan-500/[0.02]">
              <div className="absolute inset-0 flex items-center">
                <div className="flex items-center gap-6 whitespace-nowrap animate-ticker-scroll will-change-transform pr-6">
                  {/* Duplicate for seamless scroll */}
                  {[0, 1].flatMap(dup => (
                    <div key={dup} className="flex items-center gap-6">
                      {storyNarrative.map((story, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <span className={`text-[6px] font-mono whitespace-nowrap ${
                            i === currentSlideIdx
                              ? 'text-cyan-300 font-semibold'
                              : i < currentSlideIdx
                              ? 'text-emerald-500/60'
                              : 'text-slate-700'
                          }`}>
                            {story}
                          </span>
                          {i < storyNarrative.length - 1 && (
                            <svg className={`h-1.5 w-1.5 ${i < currentSlideIdx ? 'text-emerald-500/40' : 'text-slate-800'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                            </svg>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
              {/* Fade edges */}
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-slate-950/80 to-transparent pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-slate-950/80 to-transparent pointer-events-none" />
            </div>

            {/* Bottom row: prev/next + context */}
            <div className="flex items-center justify-between gap-2 px-2 sm:px-3 py-1">
              <div className="flex items-center gap-1 min-w-0 overflow-x-auto scrollbar-none flex-1">
                <svg className="h-2 w-2 text-cyan-400/60 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
                <span className="text-[7px] font-mono text-slate-600/80 tracking-wider shrink-0">CURRENT MISSION</span>
                <span className="text-[7px] font-mono text-cyan-300 font-semibold shrink-0">{workflow[currentSlideIdx >= 0 ? currentSlideIdx : 0]?.label || 'Situation'}</span>
              </div>

              {/* Prev / Next step buttons */}
              <div className="flex items-center gap-1 shrink-0">
                {currentSlideIdx > 0 && (
                  <Link
                    to={workflow[currentSlideIdx - 1].to}
                    className="flex items-center gap-1 rounded-md border border-white/[0.04] bg-white/[0.02] px-1.5 py-0.5 text-[7px] font-mono text-slate-500 hover:text-cyan-300 hover:border-cyan-500/20 hover:bg-cyan-500/[0.04] transition-all"
                  >
                    <svg className="h-2 w-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                    {workflow[currentSlideIdx - 1].label}
                  </Link>
                )}
                {currentSlideIdx < workflow.length - 1 && (
                  <Link
                    to={workflow[currentSlideIdx + 1].to}
                    className="flex items-center gap-1 rounded-md bg-gradient-to-r from-cyan-500/10 to-blue-600/10 border border-cyan-500/15 px-1.5 py-0.5 text-[7px] font-mono text-cyan-300 hover:text-white hover:border-cyan-400/30 hover:shadow-[0_0_12px_-4px_rgba(6,182,212,0.15)] transition-all"
                  >
                    Next: {workflow[currentSlideIdx + 1].label}
                    <svg className="h-2 w-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </Link>
                )}
                {currentSlideIdx === workflow.length - 1 && (
                  <div className="flex items-center gap-1.5 rounded-md border border-emerald-500/15 bg-emerald-500/[0.04] px-1.5 py-0.5">
                    <svg className="h-2 w-2 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                    <span className="text-[7px] font-mono text-emerald-400 font-semibold">Mission Complete</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Page content */}
        <main className="flex-1">
          <div className={`${presentMode ? 'p-0' : 'p-2 sm:p-3 lg:p-4'}`}>
            <div className={`mx-auto w-full ${presentMode ? 'max-w-full' : 'max-w-[98vw]'}`}>
              {children}
            </div>
          </div>
        </main>

        {/* QuickActionBar — hidden in present mode */}
        {!presentMode && <QuickActionBar currentPage={pathname} />}

        {/* Footer — hidden in present mode */}
        {!presentMode && <Footer />}
      </div>

    </div>
  )
}
