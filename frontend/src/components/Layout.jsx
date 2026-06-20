import { useState, useEffect, useCallback } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { JourneyNav } from './NarrativeCTA'
import QuickActionBar from './QuickActionBar'
import Footer from './Footer'

const centerNav = [
  { to: '/dashboard', label: 'Dashboard', shortcut: '⌘1' },
  { to: '/intelligence', label: 'Intelligence', shortcut: '⌘2' },
  { to: '/time-machine', label: 'Time Machine', shortcut: '⌘3' },
  { to: '/knowledge-graph', label: 'Knowledge Graph', shortcut: '⌘4' },
  { to: '/cto-report', label: 'CTO Report', shortcut: '⌘5' },
  { to: '/execution-planner', label: 'Execution', shortcut: '⌘6' },
]

const sidebarNav = [
  { to: '/dashboard', label: 'Dashboard', icon: 'M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z' },
  { to: '/intelligence', label: 'Intelligence Center', icon: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z' },
  { to: '/time-machine', label: 'Incident Time Machine', icon: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z' },
  { to: '/knowledge-graph', label: 'Knowledge Graph', icon: 'M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z' },
  { to: '/cto-report', label: 'CTO Report', icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z' },
  { to: '/execution-planner', label: 'Execution Planner', icon: 'M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z' },
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

  const currentSlideIdx = centerNav.findIndex(n => pathname.startsWith(n.to) || pathname === n.to)

  const goToSlide = useCallback((direction) => {
    const nextIdx = currentSlideIdx + direction
    if (nextIdx >= 0 && nextIdx < centerNav.length) {
      navigate(centerNav[nextIdx].to + '?present=1')
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

  const slideNavItems = centerNav

  return (
    <div className="flex min-h-screen bg-slate-950">

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
          <header className="sticky top-0 z-30 flex h-11 items-center gap-2 border-b border-white/[0.06] bg-slate-950/85 backdrop-blur-2xl px-2 sm:px-3 shadow-[0_1px_0_rgba(255,255,255,0.03)]">

            {/* LEFT: Logo + Status */}
            <div className="flex items-center gap-2 shrink-0">
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
              <div className="hidden sm:flex items-center gap-1">
                <span className="relative flex h-1.5 w-1.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" /><span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" /></span>
                <span className="text-[8px] font-mono text-emerald-400/80 font-semibold tracking-wider">LIVE</span>
              </div>
              <div className="hidden sm:flex items-center gap-1">
                <span className="relative flex h-1.5 w-1.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-500 opacity-75" /><span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan-500" /></span>
                <span className="text-[8px] font-mono text-cyan-400/80 font-semibold tracking-wider">AI</span>
              </div>
            </div>

            {/* CENTER: Primary navigation */}
            <nav className="hidden md:flex items-center gap-0.5 mx-auto">
              {centerNav.map((item) => {
                const active = isActive(item.to)
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`relative flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10px] font-medium transition-all whitespace-nowrap group ${
                      active
                        ? 'text-cyan-300 bg-cyan-500/10 shadow-sm shadow-cyan-500/5'
                        : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.04]'
                    }`}
                  >
                    {active && <motion.div layoutId="nav-active" className="absolute inset-0 rounded-lg bg-cyan-500/10 border border-cyan-500/20" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />}
                    <span className="relative z-10">{item.label}</span>
                    <span className={`relative z-10 text-[6px] font-mono ${active ? 'text-cyan-500/60' : 'text-slate-700 group-hover:text-slate-600'}`}>{item.shortcut}</span>
                  </Link>
                )
              })}
            </nav>

            {/* RIGHT: Actions + Metrics */}
            <div className="flex items-center gap-1.5 shrink-0">
              <div className="hidden lg:flex items-center gap-2 mr-1">
                <div className="flex items-center gap-1.5 rounded-md border border-white/[0.04] bg-white/[0.02] px-2 py-0.5">
                  <span className="text-[7px] font-mono text-slate-600">Analyses</span>
                  <span className="text-[9px] font-bold font-mono text-cyan-400">847</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-md border border-white/[0.04] bg-white/[0.02] px-2 py-0.5">
                  <span className="text-[7px] font-mono text-slate-600">Accuracy</span>
                  <span className="text-[9px] font-bold font-mono text-emerald-400">94%</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-md border border-white/[0.04] bg-white/[0.02] px-2 py-0.5">
                  <span className="text-[7px] font-mono text-slate-600">ROI</span>
                  <span className="text-[9px] font-bold font-mono text-amber-400">320%</span>
                </div>
              </div>

              <button
                onClick={() => { setSearchOpen(!searchOpen) }}
                className="hidden sm:flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.03] px-2 py-1 text-[8px] text-slate-500 hover:border-cyan-500/30 hover:text-cyan-400 transition-all group"
              >
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <span className="text-[6px] text-slate-700 border border-white/[0.06] rounded px-0.5">⌘K</span>
              </button>

              <button
                onClick={toggleFullscreen}
                className="hidden sm:flex rounded-lg p-1 text-slate-600 hover:bg-white/[0.06] hover:text-cyan-400 transition-all"
                title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  {isFullscreen
                    ? <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
                    : <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />}
                </svg>
              </button>

              <button
                onClick={togglePresentMode}
                className={`flex items-center gap-1 rounded-lg border px-2 py-1 text-[8px] font-medium transition-all ${
                  presentMode
                    ? 'border-cyan-400/30 bg-cyan-400/10 text-cyan-300'
                    : 'hidden sm:flex border-white/[0.06] text-slate-500 hover:border-cyan-500/30 hover:text-cyan-400'
                }`}
              >
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
                </svg>
                Present
              </button>

              <Link
                to="/cto-report"
                className="hidden sm:inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-2.5 py-1 text-[8px] font-semibold text-white shadow-lg shadow-cyan-500/20 hover:shadow-xl hover:shadow-cyan-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
                Analysis
              </Link>

              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-dark text-[7px] font-bold text-white shadow-sm">
                OF
              </div>
            </div>
          </header>
        )}

        {/* Journey navigation strip — hidden in present mode */}
        {!presentMode && (
          <div className="sticky top-11 z-20 border-b border-white/[0.04] bg-slate-950/70 backdrop-blur-xl px-2 sm:px-3 py-1 shadow-[0_1px_0_rgba(255,255,255,0.03)]">
            <JourneyNav currentPage={pathname} />
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
