import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

function AnimatedCounter({ value, suffix = '' }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (value === undefined || value === null) return
    const steps = 20
    const inc = value / steps
    let cur = 0
    const iv = setInterval(() => {
      cur += inc
      if (cur >= value) { setCount(value); clearInterval(iv) }
      else setCount(Math.floor(cur))
    }, 20)
    return () => clearInterval(iv)
  }, [value])
  return <>{count}{suffix}</>
}

const ping = (
  <span className="relative flex h-1.5 w-1.5">
    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
  </span>
)

const sections = [
  {
    title: 'LIVE OPERATIONS',
    color: 'emerald',
    items: [
      { icon: 'M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z', label: 'Active Incidents', badge: '3', badgeColor: 'red', pulse: true },
      { icon: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z', label: 'Critical Risks', badge: '3', badgeColor: 'amber', pulse: true },
      { icon: 'M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75', label: 'Services Degraded', badge: '2', badgeColor: 'red', pulse: true },
      { icon: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z', label: 'System Health', badge: '92%', badgeColor: 'green', pulse: false },
      { icon: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z', label: 'AI Confidence', badge: '96%', badgeColor: 'violet', pulse: false },
    ],
  },
  {
    title: 'AI RECOMMENDATIONS',
    color: 'violet',
    items: [
      { icon: 'M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z', label: 'Open Investigation', to: '/intelligence' },
      { icon: 'M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z', label: 'View Blast Radius', to: '/knowledge-graph' },
      { icon: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z', label: 'Replay Historical Incident', to: '/time-machine' },
      { icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z', label: 'Generate CTO Report', to: '/cto-report' },
      { icon: 'M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z', label: 'Launch AI Planner', to: '/ai-planner' },
    ],
  },
  {
    title: 'QUICK ACTIONS',
    color: 'indigo',
    items: [
      { icon: 'M12 4.5v15m7.5-7.5h-15', label: 'New Investigation', to: '/intelligence' },
      { icon: 'M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 01-.657.643 48.39 48.39 0 01-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 01-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 00-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 01-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 00.657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 01-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.401.604-.401.959v0c0 .333.277.599.61.58a48.1 48.1 0 005.427-.63 48.05 48.05 0 00.582-4.717.532.532 0 00-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.959.401v0a.656.656 0 00.658-.663 48.422 48.422 0 00-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 01-.61-.58v0z', label: 'New Deployment Analysis', to: '/analytics' },
      { icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z', label: 'New Impact Report', to: '/cto-report' },
      { icon: 'M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12', label: 'New Sprint Plan', to: '/ai-planner' },
      { icon: 'M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z', label: 'Export Executive Report' },
    ],
  },
  {
    title: 'RECENT SEARCHES',
    color: 'sky',
    items: [
      { icon: 'M12 4.5v15m7.5-7.5h-15', label: 'Payment Retry Logic' },
      { icon: 'M12 4.5v15m7.5-7.5h-15', label: 'API Gateway Timeout' },
      { icon: 'M12 4.5v15m7.5-7.5h-15', label: 'Billing Worker OOM' },
      { icon: 'M12 4.5v15m7.5-7.5h-15', label: 'Circuit Breaker Failure' },
    ],
  },
  {
    title: 'NOTIFICATIONS',
    color: 'amber',
    items: [
      { icon: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z', label: 'New Risk Detected', badge: 'critical', badgeColor: 'red', time: '2m ago' },
      { icon: 'M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z', label: 'Deployment Warning', badge: 'warning', badgeColor: 'amber', time: '15m ago' },
      { icon: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z', label: 'Historical Match Found', time: '1h ago' },
      { icon: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z', label: 'Revenue Risk Increased', badge: 'high', badgeColor: 'red', time: '2h ago' },
    ],
  },
]

const systemStats = [
  { label: 'Services', value: 47, suffix: '', color: 'text-cyan-400', icon: 'M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12' },
  { label: 'AI Confidence', value: 96, suffix: '%', color: 'text-violet-400', icon: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z' },
  { label: 'Critical Risks', value: 3, suffix: '', color: 'text-red-400', icon: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z' },
  { label: 'Analyses', value: 847, suffix: '', color: 'text-emerald-400', icon: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z' },
]

export default function CommandCenterDrawer({ open, onClose }) {
  const navigate = useNavigate()
  const drawerRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.aside
            ref={drawerRef}
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
            className="fixed top-0 left-0 z-50 flex h-full w-[340px] flex-col backdrop-blur-2xl border-r overflow-hidden"
            style={{ background: 'rgba(10,15,29,0.92)', borderColor: 'rgba(255,255,255,0.07)' }}
          >
            <div className="flex items-center justify-between shrink-0 px-5 border-b" style={{ height: '56px', borderColor: 'rgba(255,255,255,0.07)' }}>
              <div className="flex items-center gap-2.5">
                <div className="relative flex h-6 w-6 items-center justify-center">
                  <div className="absolute h-6 w-6 rounded-full bg-cyan-500/15" />
                  <div className="relative h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.7)]" />
                  <div className="absolute h-3.5 w-3.5 rounded-full border border-cyan-500/25" style={{ animation: 'spin 3s linear infinite' }} />
                </div>
                <span className="text-sm font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                  Command <span className="text-cyan-400">Center</span>
                </span>
              </div>
              <button onClick={onClose} className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-white/[0.06] transition-all" aria-label="Close drawer">
                <svg className="h-3.5 w-3.5" style={{ color: 'var(--text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-5">
              {sections.map((section) => (
                <div key={section.title}>
                  <div className="flex items-center gap-2 mb-2.5">
                    <div className={`h-1.5 w-1.5 rounded-full bg-${section.color}-400`} />
                    <span className="text-[9px] font-semibold tracking-[0.15em] uppercase" style={{ color: 'var(--text-muted)' }}>{section.title}</span>
                  </div>
                  <div className="space-y-0.5">
                    {section.items.map((item) => {
                      const Tag = item.to ? Link : 'button'
                      const props = item.to ? { to: item.to, onClick: onClose } : { onClick: () => { if (item.label === 'Export Executive Report') { navigate('/cto-report'); onClose() } } }
                      return (
                        <Tag key={item.label} {...props} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-all hover:bg-white/[0.04] group">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg" style={{ background: 'rgba(255,255,255,0.04)' }}>
                            <svg className="h-3.5 w-3.5" style={{ color: 'var(--text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>{item.label}</span>
                            {item.time && <span className="ml-2 text-[8px]" style={{ color: 'var(--text-muted)' }}>{item.time}</span>}
                          </div>
                          {item.badge && (
                            <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[8px] font-bold ${
                              item.badgeColor === 'red' ? 'bg-red-500/10 text-red-400' :
                              item.badgeColor === 'amber' ? 'bg-amber-500/10 text-amber-400' :
                              item.badgeColor === 'green' ? 'bg-emerald-500/10 text-emerald-400' :
                              item.badgeColor === 'violet' ? 'bg-violet-500/10 text-violet-400' :
                              'bg-slate-500/10 text-slate-400'
                            }`}>
                              {item.pulse && <span className="mr-1 inline-flex h-1.5 w-1.5 rounded-full bg-current animate-pulse" />}
                              {item.badge}
                            </span>
                          )}
                          <svg className="h-3 w-3 shrink-0 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" style={{ color: 'var(--text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                          </svg>
                        </Tag>
                      )
                    })}
                  </div>
                </div>
              ))}
            </nav>

            <div className="shrink-0 border-t px-4 py-3" style={{ borderColor: 'rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}>
              <div className="grid grid-cols-2 gap-2">
                {systemStats.map((stat) => (
                  <div key={stat.label} className="flex items-center gap-2 rounded-lg px-2.5 py-2" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <svg className="h-3 w-3 shrink-0" style={{ color: 'var(--text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={stat.icon} />
                    </svg>
                    <div className="min-w-0">
                      <div className={`text-xs font-bold ${stat.color}`}>
                        <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                      </div>
                      <div className="text-[7px] truncate" style={{ color: 'var(--text-muted)' }}>{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 mt-3 pt-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                {ping}
                <span className="text-[8px] font-mono font-bold tracking-wider text-emerald-400">All Systems Operational</span>
                <span className="ml-auto flex items-center gap-1">
                  <span className="h-1 w-1 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-[7px] font-mono" style={{ color: 'var(--text-muted)' }}>v3.2.1</span>
                </span>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
