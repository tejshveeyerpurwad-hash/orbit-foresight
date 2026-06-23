import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const DEFAULT = {
  revenueProtected: { value: 2400000, label: 'Revenue Protected', prefix: '$', suffix: '', color: '#22c55e' },
  costAvoided: { value: 840000, label: 'Cost Avoided', prefix: '$', suffix: '', color: '#06b6d4' },
  downtimePrevented: { value: 47, label: 'Downtime Prevented', prefix: '', suffix: 'min', color: '#8b5cf6' },
  incidentsPrevented: { value: 128, label: 'Incidents Prevented', prefix: '', suffix: '', color: '#f59e0b' },
  customerSatisfaction: { value: 3.2, label: 'CSAT Improvement', prefix: '', suffix: ' pts', color: '#34d399' },
}

export default function BusinessImpact({ metrics = DEFAULT }) {
  const items = Object.values(metrics)
  return (
    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="rounded-xl border border-emerald-500/10 bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-slate-950/80 p-4 sm:p-6 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500/20 to-green-500/20">
            <svg className="h-3 w-3 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-sm font-bold text-white">Business Impact Calculator</h2>
          <span className="rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 text-[8px] font-mono font-bold">LIVE</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {items.map((metric) => (
            <div key={metric.label} className="rounded-lg border border-white/[0.04] bg-white/[0.02] p-3 text-center">
              <p className="text-2xl sm:text-3xl font-black tracking-tight mb-0.5" style={{ color: metric.color }}>
                {metric.prefix}{metric.value.toLocaleString()}{metric.suffix}
              </p>
              <p className="text-[10px] font-medium text-slate-500">{metric.label}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
