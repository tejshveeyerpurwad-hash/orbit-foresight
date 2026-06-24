import { motion } from 'framer-motion'

const sizes = { sm: 24, md: 48, lg: 128 }
const rings = [
  { color: '#06b6d4', label: 'Predict', delay: 0 },
  { color: '#3b82f6', label: 'Analyze', delay: 0.3 },
  { color: '#8b5cf6', label: 'Protect', delay: 0.6 },
  { color: '#22d3ee', label: 'Execute', delay: 0.9 },
]

export default function OrbitLogo({ size = 'md', className = '', animate = true }) {
  const px = typeof size === 'number' ? size : (sizes[size] || 48)
  const core = px * 0.22
  const stroke = Math.max(1.5, px * 0.035)
  const gap = px * 0.065

  return (
    <motion.div
      whileHover={animate ? { scale: 1.08 } : undefined}
      transition={{ type: 'spring', stiffness: 500, damping: 18 }}
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: px, height: px }}
      role="img"
      aria-label="OrbitForesight logo"
    >
      {/* Glass backdrop */}
      <div
        className="absolute inset-0 rounded-full backdrop-blur-sm"
        style={{
          background: 'radial-gradient(circle at 35% 35%, rgba(6,182,212,0.08) 0%, rgba(59,130,246,0.04) 40%, transparent 70%)',
          border: '0.5px solid rgba(6,182,212,0.12)',
        }}
      />

      {/* Ambient glow */}
      <div
        className="absolute inset-0 rounded-full opacity-60"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(6,182,212,0.06) 0%, transparent 60%)',
          filter: `blur(${px * 0.1}px)`,
        }}
      />

      {/* Orbital rings */}
      <svg
        width={px}
        height={px}
        viewBox={`0 0 ${px} ${px}`}
        className="absolute inset-0"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <linearGradient id={`ol-glow-${px}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.2" />
          </linearGradient>
          <filter id={`ol-blur-${px}`}>
            <feGaussianBlur stdDeviation={Math.max(1, px * 0.015)} />
          </filter>
        </defs>

        {rings.map((ring, i) => {
          const r = core + gap * (i + 1) * 2.2
          const circumference = 2 * Math.PI * r
          const dashLen = circumference * 0.72
          const dashGap = circumference - dashLen

          return (
            <g key={ring.label}>
              {/* Ring glow */}
              <ellipse
                cx={px / 2}
                cy={px / 2}
                rx={r}
                ry={r * 0.38}
                fill="none"
                stroke={ring.color}
                strokeWidth={stroke * 3}
                opacity={0.12}
                filter={`url(#ol-blur-${px})`}
                transform={`rotate(${45 + i * 22}, ${px / 2}, ${px / 2})`}
              />
              {/* Ring path */}
              <motion.ellipse
                cx={px / 2}
                cy={px / 2}
                rx={r}
                ry={r * 0.38}
                fill="none"
                stroke={ring.color}
                strokeWidth={stroke}
                strokeLinecap="round"
                strokeDasharray={`${dashLen} ${dashGap}`}
                transform={`rotate(${45 + i * 22}, ${px / 2}, ${px / 2})`}
                initial={animate ? { rotate: 45 + i * 22 } : undefined}
                animate={animate ? { rotate: 45 + i * 22 + 360 } : undefined}
                transition={animate ? {
                  duration: 8 - i * 0.8,
                  repeat: Infinity,
                  ease: 'linear',
                  delay: ring.delay,
                } : undefined}
              />
            </g>
          )
        })}

        {/* Crosshair */}
        <line x1={px * 0.3} y1={px / 2} x2={px * 0.7} y2={px / 2} stroke="rgba(6,182,212,0.15)" strokeWidth={0.5} />
        <line x1={px / 2} y1={px * 0.3} x2={px / 2} y2={px * 0.7} stroke="rgba(6,182,212,0.15)" strokeWidth={0.5} />
      </svg>

      {/* AI Core */}
      <motion.div
        className="absolute rounded-full flex items-center justify-center"
        style={{
          width: core * 2,
          height: core * 2,
          background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #8b5cf6 100%)',
          boxShadow: `0 0 ${px * 0.08}px rgba(6,182,212,0.4), 0 0 ${px * 0.15}px rgba(59,130,246,0.2)`,
        }}
        animate={animate ? { scale: [1, 1.04, 1] } : undefined}
        transition={animate ? { duration: 3, repeat: Infinity, ease: 'easeInOut' } : undefined}
      >
        {/* Inner core glow */}
        <div
          className="absolute rounded-full"
          style={{
            width: '60%',
            height: '60%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.5) 0%, transparent 70%)',
          }}
        />
      </motion.div>

      {/* Pulse ring */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: core * 3.5,
          height: core * 3.5,
          border: `${stroke * 0.5}px solid rgba(6,182,212,0.2)`,
        }}
        animate={animate ? { scale: [1, 1.25, 1], opacity: [0.3, 0, 0.3] } : undefined}
        transition={animate ? { duration: 2.5, repeat: Infinity, ease: 'easeOut', delay: 0.5 } : undefined}
      />

      {/* Corner glass reflections */}
      <div
        className="absolute rounded-full"
        style={{
          top: '12%',
          left: '18%',
          width: px * 0.06,
          height: px * 0.06,
          backgroundColor: 'rgba(255,255,255,0.15)',
          filter: `blur(${px * 0.015}px)`,
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          bottom: '20%',
          right: '15%',
          width: px * 0.04,
          height: px * 0.04,
          backgroundColor: 'rgba(6,182,212,0.15)',
          filter: `blur(${px * 0.01}px)`,
        }}
      />
    </motion.div>
  )
}
