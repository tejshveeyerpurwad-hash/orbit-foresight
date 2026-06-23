import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const NOTIFICATIONS = [
  { id: 'n1', category: 'Critical Alerts', icon: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z', color: '#ef4444', unread: true, time: '2 min ago', message: 'Payment Service risk increased to 92%', detail: 'Circuit breaker saturation threshold crossed. Immediate attention required.' },
  { id: 'n2', category: 'Critical Alerts', icon: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z', color: '#ef4444', unread: true, time: '5 min ago', message: 'Retry queue saturation detected', detail: 'Queue depth at 12k messages. Auto-scaling triggered.' },
  { id: 'n3', category: 'Risk Warnings', icon: 'M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z', color: '#f59e0b', unread: true, time: '8 min ago', message: 'Redis memory pressure warning', detail: 'Memory usage at 82%. Eviction policy may activate within 6h.' },
  { id: 'n4', category: 'Deployments', icon: 'M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5', color: '#22d3ee', unread: true, time: '12 min ago', message: 'Circuit breaker deployed', detail: 'Payment service circuit breaker v2.1 deployed to production canary (10%).' },
  { id: 'n5', category: 'Deployments', icon: 'M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5', color: '#22d3ee', unread: false, time: '18 min ago', message: 'Billing worker rollback completed', detail: 'v3.0.1 rolled back after health check failure. v3.0.0 restored.' },
  { id: 'n6', category: 'AI Findings', icon: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z', color: '#8b5cf6', unread: true, time: '22 min ago', message: 'AI found recurring outage pattern', detail: 'Pattern matching shows 78% similarity to incident INC-2024-312. Root cause: Redis dependency.' },
  { id: 'n7', category: 'AI Findings', icon: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z', color: '#8b5cf6', unread: false, time: '35 min ago', message: 'MTTR improved by 18%', detail: 'Weekly MTTR reduced from 29.3min to 24.0min. Automated runbooks driving improvement.' },
  { id: 'n8', category: 'Team Activity', icon: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z', color: '#06b6d4', unread: true, time: '28 min ago', message: 'SRE team updated runbook', detail: 'Runbook "Payment Service Degradation" updated with new circuit breaker procedures.' },
  { id: 'n9', category: 'Team Activity', icon: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z', color: '#06b6d4', unread: false, time: '45 min ago', message: '@alice merged PR #342', detail: 'OAuth token rotation fix with 3 approvals. All checks passed.' },
  { id: 'n10', category: 'Approvals', icon: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z', color: '#34d399', unread: true, time: '30 min ago', message: 'Emergency scaling approved', detail: 'Payment worker pool +12 pods approved by @carol. Estimated completion: 4 min.' },
  { id: 'n11', category: 'Approvals', icon: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z', color: '#34d399', unread: false, time: '1h ago', message: 'Redis cluster migration approved', detail: '3 shard migration plan approved by SRE team. Implementation window: next maintenance.' },
  { id: 'n12', category: 'Risk Warnings', icon: 'M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z', color: '#f59e0b', unread: false, time: '1.5h ago', message: 'API Gateway latency exceeds threshold', detail: 'P99 latency at 340ms vs 200ms SLO. Rate limiting engaged.' },
]

const CATEGORIES = ['All', 'Critical Alerts', 'Deployments', 'AI Findings', 'Risk Warnings', 'Team Activity', 'Approvals']

export default function NotificationCenter({ open, onClose }) {
  const [activeFilter, setActiveFilter] = useState('All')
  const [markingAll, setMarkingAll] = useState(false)
  const [items, setItems] = useState(NOTIFICATIONS)
  const panelRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  const unreadCount = items.filter(n => n.unread).length

  const filtered = activeFilter === 'All' ? items : items.filter(n => n.category === activeFilter)

  const markAllRead = () => {
    setMarkingAll(true)
    setTimeout(() => {
      setItems(prev => prev.map(n => ({ ...n, unread: false })))
      setMarkingAll(false)
    }, 400)
  }

  const toggleRead = (id) => {
    setItems(prev => prev.map(n => n.id === id ? { ...n, unread: !n.unread } : n))
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.aside
            ref={panelRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
            className="fixed top-0 right-0 z-[91] h-full w-full max-w-md border-l shadow-2xl backdrop-blur-2xl"
            style={{ background: 'var(--bg-base)', borderColor: 'var(--border)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <svg className="h-5 w-5" style={{ color: 'var(--text-primary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full text-[8px] font-bold text-white" style={{ background: '#ef4444', boxShadow: '0 0 8px rgba(239,68,68,0.5)' }}>
                      {unreadCount}
                    </span>
                  )}
                </div>
                <div>
                  <h2 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Notifications</h2>
                  <p className="text-[9px] font-mono" style={{ color: 'var(--text-muted)' }}>Live updates · Real-time</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {unreadCount > 0 && (
                  <button onClick={markAllRead}
                    className="flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-[9px] font-semibold transition-all hover:border-cyan-500/30 hover:text-cyan-400"
                    style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
                  >
                    {markingAll ? (
                      <div className="h-3 w-3 animate-spin rounded-full border-2 border-cyan-500/30 border-t-cyan-400" />
                    ) : (
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                    Mark all read
                  </button>
                )}
                <button onClick={onClose}
                  className="flex items-center justify-center w-7 h-7 rounded-lg transition-all hover:bg-white/[0.05]"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-1.5 px-5 py-2.5 overflow-x-auto border-b" style={{ borderColor: 'var(--border)', scrollbarWidth: 'none' }}>
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setActiveFilter(cat)}
                  className="whitespace-nowrap rounded-lg px-2.5 py-1 text-[9px] font-semibold transition-all"
                  style={{
                    background: activeFilter === cat ? 'rgba(6,182,212,0.1)' : 'transparent',
                    color: activeFilter === cat ? '#22d3ee' : 'var(--text-muted)',
                    border: activeFilter === cat ? '1px solid rgba(6,182,212,0.2)' : '1px solid transparent'
                  }}
                >
                  {cat}
                  {cat !== 'All' && <span className="ml-1 text-[8px] opacity-60">{items.filter(n => n.category === cat).length}</span>}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="h-[calc(100%-120px)] overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
                  <svg className="h-10 w-10 mb-3" style={{ color: 'var(--text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                  </svg>
                  <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>No notifications</p>
                  <p className="text-[9px]" style={{ color: 'var(--text-muted)' }}>All caught up in this category.</p>
                </div>
              ) : (
                <div className="py-1">
                  {filtered.map((n, idx) => (
                    <motion.button
                      key={n.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.02 }}
                      onClick={() => toggleRead(n.id)}
                      className="w-full text-left px-5 py-3 transition-all hover:bg-white/[0.02] border-b"
                      style={{ borderColor: 'rgba(255,255,255,0.03)', opacity: n.unread ? 1 : 0.7 }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative mt-0.5">
                          <span className="flex items-center justify-center w-7 h-7 rounded-lg" style={{ background: `${n.color}12` }}>
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: n.color }}>
                              <path strokeLinecap="round" strokeLinejoin="round" d={n.icon} />
                            </svg>
                          </span>
                          {n.unread && (
                            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full" style={{ background: n.color, boxShadow: `0 0 6px ${n.color}80` }} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-[9px] font-mono font-semibold" style={{ color: n.color }}>{n.category}</span>
                            <span className="text-[8px] font-mono shrink-0" style={{ color: 'var(--text-muted)' }}>{n.time}</span>
                          </div>
                          <p className={`text-xs mt-0.5 leading-relaxed ${n.unread ? 'font-medium' : ''}`} style={{ color: 'var(--text-primary)' }}>{n.message}</p>
                          <p className="text-[9px] mt-0.5 leading-relaxed" style={{ color: 'var(--text-muted)' }}>{n.detail}</p>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}