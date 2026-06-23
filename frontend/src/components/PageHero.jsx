import { motion } from 'framer-motion'

export default function PageHero({
  title,
  subtitle,
  impact = '$2.4M',
  impactLabel = 'Revenue Protected',
  confidence = 94,
  actionLabel,
  actionTo,
  secondaryLabel,
  children,
}) {
  return (
    <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-slate-950/90 p-5 sm:p-7 md:p-8 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-cyan-500/[0.02] blur-3xl" />
        <div className="relative">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="relative flex h-6 w-6 items-center justify-center">
                  <div className="absolute h-full w-full animate-ping rounded-full bg-cyan-500/20" />
                  <div className="relative h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.7)]" />
                </div>
                <span className="text-[10px] font-mono font-bold tracking-[0.15em] uppercase text-cyan-400">Live · Enterprise AI Platform</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white mb-2 leading-[1.15]">
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl">
                  {subtitle}
                </p>
              )}
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0">
              <div className="text-right">
                <p className="text-[10px] font-mono font-bold tracking-widest uppercase text-slate-500">{impactLabel}</p>
                <p className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-emerald-400">{impact}</p>
              </div>
              <div className="h-10 w-px bg-white/[0.06] hidden sm:block" />
              <div className="text-right">
                <p className="text-[10px] font-mono font-bold tracking-widest uppercase text-slate-500">AI Confidence</p>
                <p className="text-2xl sm:text-3xl font-black tracking-tight text-violet-400">{confidence}%</p>
              </div>
            </div>
          </div>
          {children && <div className="mt-5">{children}</div>}
        </div>
      </div>
    </motion.div>
  )
}
